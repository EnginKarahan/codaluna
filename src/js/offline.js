// PyQuest – PWA/Offline: Service Worker, Installation, "Für offline vorbereiten".

import { t } from "/src/js/i18n.js";
import { logError } from "/src/js/telemetry.js";

const RELOAD_KEY = "pyquest.coiReload";

export function initOffline(el) {
  if (!("serviceWorker" in navigator)) {
    if (el.offlineBtn) el.offlineBtn.hidden = true;
    return;
  }
  navigator.serviceWorker.register("/sw.js").catch((e) => logError("serviceWorker", e));
  ensureIsolation();

  // Installation (Zum Startbildschirm hinzufügen)
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (el.installBtn) el.installBtn.hidden = false;
  });
  if (el.installBtn) {
    el.installBtn.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      el.installBtn.hidden = true;
    };
  }
  window.addEventListener("appinstalled", () => {
    if (el.installBtn) el.installBtn.hidden = true;
  });

  // Offline-Knopf: Zustand abfragen und Vorbereitung starten
  navigator.serviceWorker.addEventListener("message", (ev) => {
    const d = ev.data || {};
    if (d.type === "OFFLINE_STATUS" && el.offlineBtn) el.offlineBtn.classList.toggle("done", !!d.ready);
  });
  navigator.serviceWorker.ready.then((reg) => {
    if (reg.active) reg.active.postMessage({ type: "OFFLINE_STATUS" });
  });
  if (el.offlineBtn) el.offlineBtn.onclick = () => prepareOffline(el);
}

// Liefert der Server keine COOP/COEP-Header, setzt sie der Service Worker. Wirksam wird
// das erst, wenn er die Seite kontrolliert – dann einmalig neu laden.
function ensureIsolation() {
  if (self.crossOriginIsolated) {
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch (_) {}
    return;
  }
  let tried = false;
  try {
    tried = !!sessionStorage.getItem(RELOAD_KEY);
  } catch (_) {}
  if (tried) return;
  const reload = () => {
    try {
      sessionStorage.setItem(RELOAD_KEY, "1");
    } catch (_) {
      return; // ohne sessionStorage kein Schutz vor Endlos-Neuladen
    }
    location.reload();
  };
  if (navigator.serviceWorker.controller) reload();
  else navigator.serviceWorker.addEventListener("controllerchange", reload, { once: true });
}

let toast = null;
let hideTimer = null;
function showToast(text, ms) {
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "offline-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(hideTimer);
  if (ms) hideTimer = setTimeout(() => toast.classList.remove("show"), ms);
}

async function prepareOffline(el) {
  try {
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    if (!reg.active) {
      showToast(t("offline.reload"), 4000);
      return;
    }
    showToast(t(el.offlineBtn && el.offlineBtn.classList.contains("done") ? "offline.already" : "offline.loading"));
    const onMsg = (ev) => {
      const d = ev.data || {};
      if (d.type === "OFFLINE_PROGRESS") {
        showToast(t("offline.progress", { pct: Math.round((d.done / d.total) * 100) }));
      } else if (d.type === "OFFLINE_READY") {
        showToast(t("offline.ready"), 4000);
        if (el.offlineBtn) el.offlineBtn.classList.add("done");
        navigator.serviceWorker.removeEventListener("message", onMsg);
      } else if (d.type === "OFFLINE_ERROR") {
        showToast(t("offline.errorMsg"), 5000);
        navigator.serviceWorker.removeEventListener("message", onMsg);
      }
    };
    navigator.serviceWorker.addEventListener("message", onMsg);
    reg.active.postMessage({ type: "PREPARE_OFFLINE" });
  } catch (_) {
    showToast(t("offline.fail"), 4000);
  }
}
