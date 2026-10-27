// PyQuest-Tests: dieselbe Python-Laufzeit wie im Browser (vendor/pyodide + src/py/pqrt.py),
// hier in Node geladen. evaluate() spielt den Ablauf der App nach: Programm ausführen,
// Code analysieren, versteckte Testläufe, Prüfung der Lektion.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeContext } from "../../content/lib/check-kit.js";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

let rt = null;

export async function loadRuntime() {
  if (rt) return rt;
  const { loadPyodide } = await import(ROOT + "vendor/pyodide/pyodide.mjs");
  const py = await loadPyodide({ indexURL: ROOT + "vendor/pyodide/" });
  py.FS.mkdirTree("/pyquest");
  py.FS.writeFile("/pyquest/pqrt.py", readFileSync(ROOT + "src/py/pqrt.py", "utf8"));
  py.runPython("import sys\nsys.path.insert(0, '/pyquest')\nimport pqrt");
  rt = py.pyimport("pqrt");
  return rt;
}

function normalize(res) {
  if (typeof res === "boolean") return { passed: res };
  return res && typeof res === "object" ? res : { passed: false };
}

// Ergebnis: {status: "pass" | "<feedback>" | "error:<Typ>" | "timeout" | "limit" | "exhausted", detail}
export function evaluate(lesson, code, { starter, inputs = [], expert = false }) {
  const spec = { inputs, time: 5 };
  if (lesson.world) spec.world = lesson.world; // Eisfeld der Mission (Modul drone)
  const main = JSON.parse(rt.run_scripted_json(code, JSON.stringify(spec)));
  if (!main.ok) {
    if (main.error) return { status: "error:" + main.error.type, detail: main.error.message };
    if (main.timeout) return { status: "timeout" };
    if (main.limit) return { status: "limit" };
    if (main.exhausted) return { status: "exhausted" };
    return { status: "fail" };
  }
  const target = expert ? lesson.expert : lesson;
  const analysis = JSON.parse(rt.analyze(code, starter ?? null));
  const tests = target.tests && target.tests.length ? JSON.parse(rt.verify(code, JSON.stringify(target.tests))) : [];
  const ctx = makeContext({ code, starter, result: { ...main, analysis }, tests });
  let res;
  try {
    res = normalize(target.check(ctx));
  } catch (e) {
    return { status: "check-crash", detail: String(e && e.stack) };
  }
  return { status: res.passed ? "pass" : res.feedback || "fail", detail: res.params ? JSON.stringify(res.params) : "" };
}
