// PyQuest – kleine UI-Bausteine: Dialoge (statt confirm()), Hinweise (Toasts).

import { t } from "/src/js/i18n.js";
import { escapeHtml } from "/src/js/errors.js";
import { icon } from "/src/js/icons.js";
import { report } from "/src/js/telemetry.js";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function isModalOpen() {
  return !!document.querySelector(".modal-overlay, .tour");
}

// Modaler Dialog mit Fokusführung: Fokus hinein, Tab bleibt drin, Escape schließt.
// closeButton: Schließen-Kreuz oben rechts (für lange Dialoge, deren Knöpfe unten liegen)
export function openModal({ html, label, className = "", dismissible = true, closeButton = false, onClose }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const x = closeButton ? `<button type="button" class="modal-x" data-x aria-label="${escapeHtml(t("dlg.close"))}">${icon("close")}</button>` : "";
  overlay.innerHTML = `<div class="modal ${className}" role="dialog" aria-modal="true" aria-label="${escapeHtml(label || "")}" tabindex="-1">${x}${html}</div>`;
  const before = document.activeElement;
  document.body.appendChild(overlay);
  const modal = overlay.querySelector(".modal");
  let closed = false;

  function close(result) {
    if (closed) return;
    closed = true;
    overlay.remove();
    document.removeEventListener("keydown", onKey, true);
    if (before && before.isConnected && before.focus) before.focus({ preventScroll: true });
    if (onClose) onClose(result);
  }

  function onKey(e) {
    if (e.key === "Escape" && dismissible) {
      e.preventDefault();
      e.stopPropagation();
      close(null);
    } else if (e.key === "Tab") {
      const items = [...modal.querySelectorAll(FOCUSABLE)].filter((x) => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.addEventListener("keydown", onKey, true);
  const xBtn = modal.querySelector("[data-x]");
  if (xBtn) xBtn.onclick = () => close(null);
  if (dismissible) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(null);
    });
  }
  requestAnimationFrame(() => {
    const target = modal.querySelector("[data-autofocus]") || modal.querySelector(".btn-primary") || modal;
    target.focus({ preventScroll: true });
  });
  return { el: modal, overlay, close };
}

// Bestätigung als Promise<boolean>. danger: Abbrechen ist vorausgewählt.
export function confirmDialog({ title, text, ok, cancel, danger = false }) {
  return new Promise((resolve) => {
    const m = openModal({
      label: title,
      className: "confirm-modal",
      onClose: (result) => resolve(result === true),
      html: `
        <h2>${title}</h2>
        <p>${text}</p>
        <div class="modal-actions">
          <button type="button" class="btn ${danger ? "btn-danger-solid" : "btn-primary"}" data-ok>${ok || t("dlg.ok")}</button>
          <button type="button" class="btn btn-ghost" data-cancel ${danger ? "data-autofocus" : ""}>${cancel || t("dlg.cancel")}</button>
        </div>`,
    });
    m.el.querySelector("[data-ok]").onclick = () => m.close(true);
    m.el.querySelector("[data-cancel]").onclick = () => m.close(false);
  });
}

// Kurze Hinweise oben (Stapel). kind: "ok" | "fail" | "info" | "badge"
const TOAST_ICONS = { ok: "check", fail: "alert", badge: "award", lock: "lock" };

export function toast(html, kind = "info", ms = 3200) {
  const root = document.getElementById("toasts");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  const ico = TOAST_ICONS[kind] ? `<span class="toast-ico" aria-hidden="true">${icon(TOAST_ICONS[kind])}</span>` : "";
  el.innerHTML = `${ico}<span>${html}</span>`;
  if (kind === "fail") report("app", "Toast", el.lastElementChild.textContent, { context: { where: "toast" } });
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  const remove = () => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  };
  setTimeout(remove, ms);
  el.addEventListener("click", remove);
  // höchstens drei gleichzeitig
  while (root.children.length > 3) root.firstElementChild.remove();
}
