// PyQuest – anonyme Nutzungsstatistik und Fehlerberichte an die eigene Webstatistik
// (STATS_URL in app-config.js: cookie-los, keine IP-Speicherung, keine Kennung im Browser).
//
// Gesendet wird nur, wenn die App unter STATS_DOMAIN läuft (also nicht lokal), nicht bei
// Do-Not-Track bzw. Global Privacy Control und nicht aus automatisierten Browsern (Tests).
// Im Browser wird dafür nichts gespeichert; was offline passiert, geht verloren.
//
//   track(name, props)            Ereignis für die Statistik (/collect.php)
//   report(kind, name, message, { hint, code, stack, context })
//                                 Fehlerbericht (/report.php), kind: python | run | app
//   logError(where, err, context) Fehler in die Konsole schreiben und melden

import config from "/app-config.js";

const BASE = String(config.STATS_URL || "").replace(/\/+$/, "");
const DOMAIN = String(config.STATS_DOMAIN || "");
const SESSION_MAX = 80; // mehr Berichte pro Seitenaufruf wären eine Fehlerschleife
const MAX_BYTES = 24000; // Obergrenze des Servers: 24576 Bytes

function doNotTrack() {
  const v = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  return v === "1" || v === "yes" || navigator.globalPrivacyControl === true;
}

export const telemetryOn =
  !!(BASE && DOMAIN) &&
  typeof location !== "undefined" &&
  location.hostname === DOMAIN &&
  !navigator.webdriver &&
  !doNotTrack();

let version = "";
let contextOf = () => ({});
let sent = 0;
let last = "";

const enc = new TextEncoder();
const clip = (s, n) => (s == null ? undefined : String(s).slice(0, n));

function post(path, payload) {
  return fetch(BASE + path, {
    method: "POST",
    body: JSON.stringify(payload), // als text/plain: kein Preflight
    keepalive: true,
    mode: "cors",
    credentials: "omit",
  }).catch(() => {}); // offline oder Statistik nicht erreichbar: nicht weiter schlimm
}

// Start: Version vom Service Worker erfragen, globale Fehler abfangen.
// context(): liefert den aktuellen Zustand der App (Lektion, Sprache) für jeden Bericht.
export function initTelemetry({ context } = {}) {
  if (context) contextOf = context;
  if (!telemetryOn) return;
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (ev) => {
      if (ev.data && ev.data.type === "VERSION") version = clip(ev.data.version, 32) || "";
    });
    navigator.serviceWorker.ready
      .then(() => navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ type: "VERSION" }))
      .catch(() => {});
  }
  window.addEventListener("error", (ev) => {
    if (!ev.error && (!ev.message || ev.message === "Script error.")) return; // fremde Skripte ohne Angaben
    const file = ev.filename ? new URL(ev.filename, location.href).pathname : "";
    report("app", (ev.error && ev.error.name) || "Error", (ev.error && ev.error.message) || ev.message, {
      stack: ev.error && ev.error.stack,
      context: { where: file ? `${file}:${ev.lineno || 0}` : "window" },
    });
  });
  window.addEventListener("unhandledrejection", (ev) => {
    const r = ev.reason;
    report("app", (r && r.name) || "UnhandledRejection", (r && r.message) || String(r), {
      stack: r && r.stack,
      context: { where: "promise" },
    });
  });
}

export function track(name, props) {
  if (!telemetryOn) return;
  const payload = { d: DOMAIN, u: "/", r: name === "pageview" ? document.referrer || "" : "", w: window.innerWidth || 0, e: name };
  if (props) payload.p = props;
  post("/collect.php", payload);
}

export function report(kind, name, message, { hint, code, stack, context } = {}) {
  if (!telemetryOn || sent >= SESSION_MAX) return;
  const ctx = { ...contextOf(), ...(context || {}) };
  // Derselbe Fehler mit demselben Code direkt hintereinander bringt nichts Neues
  const key = [kind, name, message, code || "", ctx.where || ""].join("\u0000");
  if (key === last) return;
  last = key;
  sent++;
  const payload = {
    d: DOMAIN,
    k: kind,
    n: clip(String(name || "Error").replace(/[^A-Za-z0-9 _.:-]/g, ""), 64) || "Error",
    m: clip(message || "(ohne Meldung)", 1000),
    h: hint || undefined,
    u: "/",
    v: version || undefined,
    x: ctx,
    s: clip(stack, 4000),
    c: clip(code, 10000),
    w: window.innerWidth || 0,
  };
  // Zu groß für den Server? Erst den Code, dann den Stack kürzen.
  while (enc.encode(JSON.stringify(payload)).length > MAX_BYTES) {
    if (payload.c) payload.c = payload.c.length > 200 ? payload.c.slice(0, Math.floor(payload.c.length * 0.7)) : undefined;
    else if (payload.s) payload.s = undefined;
    else break;
  }
  post("/report.php", payload);
}

export function logError(where, err, context) {
  console.error(`${where}:`, err);
  report("app", (err && err.name) || "Error", (err && err.message) || String(err), {
    stack: err && err.stack,
    context: { where, ...(context || {}) },
  });
}
