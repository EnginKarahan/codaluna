// PyQuest – Python-Ausführung im Web-Worker (Pyodide, lokal vendored).
// Die eigentliche Lauf-, Prüf- und Analyselogik steckt in src/py/pqrt.py
// (dieselbe Datei nutzt die Testsuite). Dieser Worker ist nur die Brücke.
//
// Main -> Worker:
//   {type:"init", ctrl?, data?, interrupt?}   geteilte Puffer (fehlen ohne Cross-Origin-Isolation)
//   {type:"run", id, code, starter, tests, expertTests, world}   world: Eisfeld der Mission (Modul drone)
// Worker -> Main:
//   {type:"ready", shared} | {type:"boot-error", text}
//   {type:"out", id, kind, text}              gebündelte Ausgabe: "o" stdout, "e" stderr, "p" input-Prompt
//   {type:"input-request", id}                input() wartet auf eine Zeile
//   {type:"sleep", id, ms}                    time.sleep() läuft (zählt nicht gegen das Zeitlimit)
//   {type:"phase", id, phase:"verify"}        Programm fertig, versteckte Prüfläufe laufen
//   {type:"done", id, result, analysis, tests, expertTests}

import { loadPyodide } from "/vendor/pyodide/pyodide.mjs";

const FLUSH_MS = 33; // höchstens ~30 Ausgabe-Nachrichten pro Sekunde -> UI bleibt flüssig
const FLUSH_CHARS = 64 * 1024;

let py = null;
let rt = null; // Python-Modul pqrt
let ctrl = null; // Int32Array: [0] = Eingabe bereit, [1] = Länge (-1 = Abbruch)
let data = null; // Uint8Array: UTF-8-Bytes der Eingabezeile
let interrupt = null; // Uint8Array(1): 2 => KeyboardInterrupt

let runId = 0;
let pending = "";
let pendingKind = "o";
let lastFlush = 0;
const decoder = new TextDecoder();

function flush() {
  if (pending) {
    self.postMessage({ type: "out", id: runId, kind: pendingKind, text: pending });
    pending = "";
  }
  lastFlush = performance.now();
}

// Wird von Python aufgerufen (pqjs.out). Bündelt nach Zeit statt pro Zeile.
function out(kind, text) {
  if (kind !== pendingKind && pending) flush();
  pendingKind = kind;
  pending += text;
  if (performance.now() - lastFlush >= FLUSH_MS || pending.length >= FLUSH_CHARS) flush();
}

// time.sleep() meldet die Schlafzeit, damit sie nicht gegen das Zeitlimit zählt (pqjs.sleeping).
function sleeping(seconds) {
  self.postMessage({ type: "sleep", id: runId, ms: Math.round(seconds * 1000) });
}

// Blockierendes Einlesen einer Zeile (pqjs.read_line). Der Worker darf warten,
// der Main-Thread bleibt frei. Ohne SharedArrayBuffer gibt es kein input().
function readLine() {
  flush();
  if (!ctrl) return null;
  Atomics.store(ctrl, 0, 0); // vor der Anfrage zurücksetzen, sonst Wettlauf mit schneller Antwort
  self.postMessage({ type: "input-request", id: runId });
  Atomics.wait(ctrl, 0, 0);
  const len = Atomics.load(ctrl, 1);
  if (len < 0) return null;
  return decoder.decode(data.slice(0, len));
}

async function boot(msg) {
  if (msg.ctrl) {
    ctrl = new Int32Array(msg.ctrl);
    data = new Uint8Array(msg.data);
    interrupt = new Uint8Array(msg.interrupt);
  }
  try {
    py = await loadPyodide({ indexURL: "/vendor/pyodide/" });
    if (interrupt) py.setInterruptBuffer(interrupt);
    // Fallback-Kanäle (während eines Laufs leitet pqrt die Ausgabe selbst um)
    py.setStdout({ batched: (s) => out("o", s + "\n") });
    py.setStderr({ batched: (s) => out("e", s + "\n") });
    py.setStdin({
      stdin: () => {
        const line = readLine();
        return line === null ? null : line + "\n";
      },
    });
    py.registerJsModule("pqjs", { out, flush, read_line: readLine, sleeping });

    const res = await fetch("/src/py/pqrt.py");
    if (!res.ok) throw new Error("pqrt.py: HTTP " + res.status);
    py.FS.mkdirTree("/pyquest");
    py.FS.writeFile("/pyquest/pqrt.py", await res.text());
    py.runPython("import sys\nsys.path.insert(0, '/pyquest')\nimport pqrt");
    rt = py.pyimport("pqrt");
    self.postMessage({ type: "ready", shared: !!ctrl });
  } catch (e) {
    self.postMessage({ type: "boot-error", text: String((e && e.message) || e) });
  }
}

const EMPTY = { out: "", stdout: "", stderr: "", prompts: [], inputs: [] };

// Fehler, die nicht aus dem Programm selbst stammen (z. B. Interrupt zwischen zwei Schritten)
function internalResult(e) {
  const text = String((e && e.message) || e);
  if (/KeyboardInterrupt/.test(text)) return { ok: false, stopped: true, ...EMPTY };
  return {
    ok: false,
    internal: true,
    error: { type: "InternalError", message: text, line: null, traceback: text },
    ...EMPTY,
  };
}

function parse(json) {
  return JSON.parse(json);
}

function run(msg) {
  runId = msg.id;
  if (interrupt) interrupt[0] = 0;
  pending = "";
  pendingKind = "o";
  lastFlush = -Infinity; // erste Ausgabe sofort zeigen
  const t0 = performance.now();

  let result;
  try {
    result = parse(rt.run_main(msg.code, msg.world ? JSON.stringify(msg.world) : null));
  } catch (e) {
    result = internalResult(e);
  }
  flush();
  result.ms = Math.round(performance.now() - t0);

  let analysis = null;
  let tests = null;
  let expertTests = null;
  if (result.ok) {
    self.postMessage({ type: "phase", id: runId, phase: "verify" });
    try {
      analysis = parse(rt.analyze(msg.code, msg.starter ?? null));
      if (msg.tests && msg.tests.length) tests = parse(rt.verify(msg.code, JSON.stringify(msg.tests)));
      if (msg.expertTests && msg.expertTests.length) {
        expertTests = parse(rt.verify(msg.code, JSON.stringify(msg.expertTests)));
      }
    } catch (e) {
      result.verifyError = String((e && e.message) || e);
    }
    flush();
  }
  self.postMessage({ type: "done", id: runId, result, analysis, tests, expertTests });
}

self.onmessage = (ev) => {
  const msg = ev.data;
  if (msg.type === "init") {
    boot(msg);
  } else if (msg.type === "run") {
    if (!rt) {
      self.postMessage({ type: "done", id: msg.id, result: internalResult("Python ist noch nicht bereit") });
      return;
    }
    run(msg);
  }
};
