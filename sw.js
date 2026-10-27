// PyQuest – Service Worker: Offline-Betrieb und Cross-Origin-Isolation.
//
// Zwei Caches:
//   pyquest-core-<VERSION>  App-Dateien (klein). VERSION ist ein Hash über alle Dateien in
//                           CORE und wird mit `node tools/sw-version.mjs` aktualisiert
//                           (die Tests melden, wenn das vergessen wurde).
//   pyquest-vendor-…        Pyodide, CodeMirror, Schriften (groß, ändert sich selten).
//                           Bleibt bei App-Updates erhalten – offline geht nichts verloren.
//
// Strategie: App-Dateien und Vendor aus dem Cache (offline-first), sonst Netz.
// Auf localhost immer zuerst das Netz, damit Änderungen beim Entwickeln sofort sichtbar sind.
// Jede Antwort bekommt COOP/COEP/CORP, falls der Server sie nicht setzt – damit
// SharedArrayBuffer (input(), Stop) auch auf Hosts ohne eigene Header funktioniert.

const VERSION = "12ce11554f"; // wird von tools/sw-version.mjs gesetzt
const CORE_CACHE = `pyquest-core-${VERSION}`;
const VENDOR_CACHE = "pyquest-vendor-p0.26.4-cm5.65.16-v1";
const DEV = self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";

// App-Dateien: beim Installieren vollständig gecacht
const CORE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/impressum.html",
  "/datenschutz.html",
  "/eltern.html",
  "/app-config.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/src/css/design.css",
  "/src/css/app.css",
  "/src/js/app.js",
  "/src/js/auth.js",
  "/src/js/badges.js",
  "/src/js/companion.js",
  "/src/js/console.js",
  "/src/js/course.js",
  "/src/js/diploma.js",
  "/src/js/discoveries.js",
  "/src/js/editor.js",
  "/src/js/errors.js",
  "/src/js/i18n.js",
  "/src/js/i18n-ui.js",
  "/src/js/juice.js",
  "/src/js/offline.js",
  "/src/js/onboarding.js",
  "/src/js/progress.js",
  "/src/js/py-worker.js",
  "/src/js/runner.js",
  "/src/js/share.js",
  "/src/js/sfx.js",
  "/src/js/stage.js",
  "/src/js/sync.js",
  "/src/js/telemetry.js",
  "/src/js/ui.js",
  "/src/js/view-lesson.js",
  "/src/js/view-map.js",
  "/src/js/view-progress.js",
  "/src/js/view-sidebar.js",
  "/src/js/workshop.js",
  "/src/js/icons.js",
  "/src/js/fixes.js",
  "/src/py/pqrt.py",
  "/src/i18n/de.js",
  "/src/i18n/en.js",
  "/src/i18n/fr.js",
  "/src/i18n/it.js",
  "/src/i18n/tr.js",
  "/src/i18n/es.js",
  "/content/lib/check-kit.js",
  "/content/courses/season-1.js",
  "/content/courses/season-1-missions.js",
  "/content/i18n/season-1-i18n.js",
  "/content/i18n/season-1.en.js",
  "/content/i18n/season-1.fr.js",
  "/content/i18n/season-1.it.js",
  "/content/i18n/season-1.tr.js",
  "/content/i18n/season-1.es.js",
];

// Große, selten geänderte Dateien: beim ersten Gebrauch bzw. über "Für offline vorbereiten"
const VENDOR = [
  "/vendor/pyodide/pyodide.mjs",
  "/vendor/pyodide/pyodide.asm.js",
  "/vendor/pyodide/pyodide.asm.wasm",
  "/vendor/pyodide/python_stdlib.zip",
  "/vendor/pyodide/pyodide-lock.json",
  "/vendor/codemirror/lib-codemirror.js",
  "/vendor/codemirror/lib-codemirror.css",
  "/vendor/codemirror/mode/python/python.js",
  "/vendor/codemirror/addon/edit/matchbrackets.js",
  "/vendor/codemirror/addon/edit/closebrackets.js",
  "/vendor/fonts/atkinson-next-latin.woff2",
  "/vendor/fonts/atkinson-next-latin-ext.woff2",
  "/vendor/fonts/jetbrains-mono-400.woff2",
  "/vendor/fonts/jetbrains-mono-700.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: "no-cache" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CORE_CACHE && k !== VENDOR_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// COOP/COEP/CORP ergänzen (nur für normale same-origin-Antworten)
function isolate(res) {
  if (!res || (res.type !== "basic" && res.type !== "default") || res.status === 0) return res;
  const h = new Headers(res.headers);
  if (h.has("Cross-Origin-Embedder-Policy") && h.has("Cross-Origin-Opener-Policy")) return res;
  h.set("Cross-Origin-Opener-Policy", "same-origin");
  h.set("Cross-Origin-Embedder-Policy", "require-corp");
  if (!h.has("Cross-Origin-Resource-Policy")) h.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

async function fromCacheFirst(req, cacheName, cacheKey) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(cacheKey || req, { ignoreSearch: req.mode === "navigate" });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok && res.type === "basic") cache.put(cacheKey || req, res.clone());
  return res;
}

async function fromNetworkFirst(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === "basic") (await caches.open(cacheName)).put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await caches.match(req, { ignoreSearch: req.mode === "navigate" });
    if (hit) return hit;
    throw err;
  }
}

async function handle(req) {
  const url = new URL(req.url);
  try {
    if (url.pathname.startsWith("/vendor/")) return isolate(await fromCacheFirst(req, VENDOR_CACHE));
    if (DEV) return isolate(await fromNetworkFirst(req, CORE_CACHE));
    // Navigation (auch mit ?code=… nach Logins) bekommt die App-Seite aus dem Cache
    if (req.mode === "navigate" && (url.pathname === "/" || url.pathname === "/index.html")) {
      return isolate(await fromCacheFirst(req, CORE_CACHE, "/"));
    }
    return isolate(await fromCacheFirst(req, CORE_CACHE));
  } catch (err) {
    return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;
  e.respondWith(handle(req));
});

// ---- "Für offline vorbereiten": alles laden, Fortschritt melden ----
async function prepareOffline(client) {
  const jobs = [...CORE.map((u) => [CORE_CACHE, u]), ...VENDOR.map((u) => [VENDOR_CACHE, u])];
  let done = 0;
  let failed = 0;
  for (const [cacheName, url] of jobs) {
    try {
      const cache = await caches.open(cacheName);
      if (!(await cache.match(url))) {
        const res = await fetch(url, { cache: "no-cache" });
        if (res && res.ok) await cache.put(url, res.clone());
        else failed++;
      }
    } catch (_) {
      failed++;
    }
    done++;
    if (client) client.postMessage({ type: "OFFLINE_PROGRESS", done, total: jobs.length });
  }
  if (client) client.postMessage({ type: failed ? "OFFLINE_ERROR" : "OFFLINE_READY", failed, total: jobs.length });
}

// Ist schon alles für den Offline-Betrieb da?
async function offlineStatus(client) {
  const core = await caches.open(CORE_CACHE);
  const vendor = await caches.open(VENDOR_CACHE);
  let missing = 0;
  for (const u of CORE) if (!(await core.match(u))) missing++;
  for (const u of VENDOR) if (!(await vendor.match(u))) missing++;
  if (client) client.postMessage({ type: "OFFLINE_STATUS", ready: missing === 0, missing });
}

self.addEventListener("message", (event) => {
  const type = event.data && event.data.type;
  if (type === "PREPARE_OFFLINE") event.waitUntil(prepareOffline(event.source));
  else if (type === "OFFLINE_STATUS") event.waitUntil(offlineStatus(event.source));
  else if (type === "VERSION" && event.source) event.source.postMessage({ type: "VERSION", version: VERSION });
});
