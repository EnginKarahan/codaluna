// PyQuest – Steuerung der Python-Ausführung vom Main-Thread aus.
// Kapselt den Worker, die geteilten Puffer, input(), Stop, Zeitlimit und Neustarts.
//
// Zustände (runner.status): "loading" -> "ready" <-> "running", bei Problemen
// "restarting" (Worker wird neu gestartet) oder "failed" (Python lädt nicht).

const INPUT_BUF_BYTES = 64 * 1024; // max. Länge einer Eingabezeile
const RUN_LIMIT_MS = 20000; // reine Rechenzeit; Warten auf Eingaben und time.sleep() zählen nicht
const KILL_GRACE_MS = 2500; // so lange darf ein Programm nach Stop noch brauchen
const FLUSH_SIGNAL_MS = 150; // so oft wird der Worker angestoßen, gepufferte Ausgabe zu zeigen
const SIGUSR1 = 10; // Signal für "Ausgabe zeigen" (Python-Handler in pqrt.py), 2 = Stop

const EMPTY = { out: "", stdout: "", stderr: "", prompts: [], inputs: [] };

export class PyRunner {
  constructor() {
    // Ohne Cross-Origin-Isolation gibt es keinen SharedArrayBuffer: Python läuft
    // trotzdem, nur input() und das sanfte Stoppen fehlen (Stop = Neustart).
    this.shared = typeof SharedArrayBuffer !== "undefined" && self.crossOriginIsolated === true;
    this.status = "idle";
    this.worker = null;
    this.current = null;
    this.nextId = 1;
    this.listeners = new Set();
    this.readyPromise = null;
    this.bootFailures = 0;
    this.enc = new TextEncoder();
    if (this.shared) {
      this.ctrlSAB = new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT);
      this.dataSAB = new SharedArrayBuffer(INPUT_BUF_BYTES);
      this.intSAB = new SharedArrayBuffer(1);
      this.ctrl = new Int32Array(this.ctrlSAB);
      this.data = new Uint8Array(this.dataSAB);
      this.interrupt = new Uint8Array(this.intSAB);
    }
  }

  get ready() {
    return this.status === "ready";
  }
  get running() {
    return this.status === "running";
  }

  // fn(status, detail) – wird sofort mit dem aktuellen Zustand aufgerufen.
  onStatus(fn) {
    this.listeners.add(fn);
    fn(this.status);
    return () => this.listeners.delete(fn);
  }

  _setStatus(status, detail) {
    this.status = status;
    for (const fn of this.listeners) fn(status, detail);
  }

  // Startet den Worker (einmalig). Das Promise erfüllt sich, sobald Python bereit ist.
  init() {
    if (!this.readyPromise) {
      this.readyPromise = new Promise((resolve, reject) => {
        this._resolveReady = resolve;
        this._rejectReady = reject;
      });
      this._spawn("loading");
    }
    return this.readyPromise;
  }

  // Erneuter Versuch nach "failed" (z. B. Netz war weg).
  retry() {
    this.bootFailures = 0;
    this.readyPromise = new Promise((resolve, reject) => {
      this._resolveReady = resolve;
      this._rejectReady = reject;
    });
    this.readyPromise.catch(() => {});
    this._restart();
  }

  _spawn(status, detail) {
    this._setStatus(status, detail);
    const w = new Worker("/src/js/py-worker.js", { type: "module" });
    this.worker = w;
    w.onmessage = (ev) => this._onMessage(w, ev.data);
    w.onerror = (ev) => {
      if (ev && ev.preventDefault) ev.preventDefault();
      this._onCrash(w, (ev && ev.message) || "Worker-Fehler");
    };
    w.onmessageerror = () => this._onCrash(w, "messageerror");
    w.postMessage(
      this.shared
        ? { type: "init", ctrl: this.ctrlSAB, data: this.dataSAB, interrupt: this.intSAB }
        : { type: "init" }
    );
  }

  // detail: Grund, falls der Worker abgestürzt ist (geht mit dem Status "restarting" raus)
  _restart(detail) {
    if (this.worker) this.worker.terminate();
    this.worker = null;
    if (this.shared) {
      Atomics.store(this.ctrl, 0, 0);
      Atomics.store(this.ctrl, 1, 0);
      this.interrupt[0] = 0;
    }
    this._spawn("restarting", detail);
  }

  _onMessage(w, msg) {
    if (w !== this.worker) return; // Nachrichten eines beendeten Workers ignorieren
    const run = this.current;
    switch (msg.type) {
      case "ready":
        this.bootFailures = 0;
        this._setStatus("ready");
        if (this._resolveReady) this._resolveReady();
        break;
      case "boot-error":
        this._bootFailed(msg.text);
        break;
      case "out":
        if (run && msg.id === run.id && run.handlers.onOutput) run.handlers.onOutput(msg.text, msg.kind);
        break;
      case "input-request":
        if (!run || msg.id !== run.id) break;
        if (run.stopReason) {
          this._answerEOF(); // Stop kam vor der Eingabe-Anfrage an
          break;
        }
        run.awaitingInput = true;
        this._pauseWatchdog();
        if (run.handlers.onInputRequest) run.handlers.onInputRequest();
        break;
      case "sleep":
        // Schlafen zählt nicht gegen das Zeitlimit: Budget um die Schlafzeit verlängern
        if (run && msg.id === run.id && !run.awaitingInput && !run.stopReason) {
          this._pauseWatchdog();
          run.budget += msg.ms;
          this._armWatchdog();
        }
        break;
      case "phase":
        if (run && msg.id === run.id && run.handlers.onPhase) run.handlers.onPhase(msg.phase);
        break;
      case "done":
        if (run && msg.id === run.id) {
          this._finish({
            ...msg.result,
            analysis: msg.analysis || null,
            tests: msg.tests || null,
            expertTests: msg.expertTests || null,
          });
        }
        break;
    }
  }

  _bootFailed(text) {
    this.bootFailures++;
    if (this.bootFailures <= 1) {
      this._restart(); // ein stiller zweiter Versuch
      return;
    }
    this._setStatus("failed", text);
    if (this._rejectReady) this._rejectReady(new Error(text));
  }

  _onCrash(w, text) {
    if (w !== this.worker) return;
    const run = this.current;
    if (run) {
      this._clearTimers(run);
      this.current = null;
      run.resolve({
        ok: false,
        crashed: true,
        reason: "crash",
        error: { type: "InternalError", message: text, line: null, traceback: text },
        ...EMPTY,
      });
      this._restart();
    } else if (this.status === "loading" || this.status === "restarting") {
      this._bootFailed(text);
    } else {
      this._restart(text);
    }
  }

  // Code ausführen. opts: {starter, tests, expertTests, world}
  // handlers: {onOutput(text, kind), onInputRequest(), onPhase(phase)}
  // Liefert ein Promise mit dem Ergebnis (ok, error, out, analysis, tests …).
  run(code, opts = {}, handlers = {}) {
    if (this.status !== "ready") return Promise.reject(new Error("not-ready"));
    const id = this.nextId++;
    this._setStatus("running");
    return new Promise((resolve) => {
      this.current = {
        id,
        handlers,
        resolve,
        awaitingInput: false,
        stopReason: null,
        budget: RUN_LIMIT_MS,
        resumedAt: 0,
        watchdog: null,
        killTimer: null,
        flushTimer: null,
      };
      const run = this.current;
      if (this.shared) {
        this.interrupt[0] = 0;
        // Regelmäßig "Ausgabe zeigen" signalisieren – nie über ein anstehendes Stop schreiben
        run.flushTimer = setInterval(() => {
          if (!run.awaitingInput && !run.stopReason) Atomics.compareExchange(this.interrupt, 0, 0, SIGUSR1);
        }, FLUSH_SIGNAL_MS);
      }
      this.worker.postMessage({
        type: "run",
        id,
        code,
        starter: opts.starter ?? null,
        tests: opts.tests || [],
        expertTests: opts.expertTests || [],
        world: opts.world || null,
      });
      this._armWatchdog();
    });
  }

  get awaitingInput() {
    return !!(this.current && this.current.awaitingInput);
  }

  // Antwort auf input(): Zeile in den geteilten Puffer schreiben und Worker wecken.
  sendInput(text) {
    const run = this.current;
    if (!run || !run.awaitingInput || !this.shared) return false;
    const bytes = this.enc.encode(String(text));
    const len = Math.min(bytes.length, this.data.length);
    this.data.set(bytes.subarray(0, len));
    Atomics.store(this.ctrl, 1, len);
    Atomics.store(this.ctrl, 0, 1);
    Atomics.notify(this.ctrl, 0);
    run.awaitingInput = false;
    this._armWatchdog();
    return true;
  }

  // Stop: Interrupt setzen (und eine wartende Eingabe abbrechen). Reagiert das
  // Programm nicht, wird der Worker nach kurzer Frist hart neu gestartet.
  stop(reason = "user") {
    const run = this.current;
    if (!run || run.stopReason) return;
    run.stopReason = reason;
    this._clearTimers(run);
    if (!this.shared) {
      this._hardStop();
      return;
    }
    Atomics.store(this.interrupt, 0, 2);
    if (run.awaitingInput) this._answerEOF();
    run.killTimer = setTimeout(() => this._hardStop(), KILL_GRACE_MS);
  }

  _answerEOF() {
    const run = this.current;
    Atomics.store(this.ctrl, 1, -1);
    Atomics.store(this.ctrl, 0, 1);
    Atomics.notify(this.ctrl, 0);
    if (run) run.awaitingInput = false;
  }

  _hardStop() {
    const run = this.current;
    if (!run) return;
    this._clearTimers(run);
    this.current = null;
    run.resolve({ ok: false, stopped: true, reason: run.stopReason || "user", restarted: true, ...EMPTY });
    this._restart();
  }

  _finish(payload) {
    const run = this.current;
    if (!run) return;
    this._clearTimers(run);
    this.current = null;
    if (run.stopReason) {
      // Stop gilt auch, wenn das Programm schon fertig war und nur noch geprüft wurde
      payload.ok = false;
      payload.stopped = true;
      payload.reason = run.stopReason;
      delete payload.error; // z. B. EOFError durch den Abbruch einer Eingabe
    } else if (payload.stopped) {
      payload.reason = payload.reason || "user";
    } else if (payload.limit === "output") {
      payload.reason = "output";
    }
    if (!this.shared && payload.error && payload.error.type === "EOFError") payload.noInput = true;
    this._setStatus("ready");
    run.resolve(payload);
  }

  // Zeitbudget: läuft nur, solange das Programm rechnet (nicht bei input() oder sleep()).
  _armWatchdog() {
    const run = this.current;
    if (!run) return;
    clearTimeout(run.watchdog);
    run.resumedAt = performance.now();
    run.watchdog = setTimeout(() => this.stop("timeout"), Math.max(0, run.budget));
  }

  _pauseWatchdog() {
    const run = this.current;
    if (!run || !run.watchdog) return;
    clearTimeout(run.watchdog);
    run.watchdog = null;
    run.budget -= performance.now() - run.resumedAt;
  }

  _clearTimers(run) {
    clearTimeout(run.watchdog);
    clearTimeout(run.killTimer);
    clearInterval(run.flushTimer);
    run.watchdog = null;
    run.killTimer = null;
    run.flushTimer = null;
  }
}
