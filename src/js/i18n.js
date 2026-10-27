// Codaluna – Mehrsprachigkeit (i18n). Vanilla, offline, mit Fallback-Kette.
// UI-Texte liegen je Sprache in src/i18n/<code>.js (gebündelt über i18n-ui.js).
// Fehlt ein Schlüssel, wird auf Englisch, dann Deutsch zurückgefallen.

import UI from "/src/js/i18n-ui.js";

// Alle wählbaren Sprachen (native Namen). Alle sechs sind vollständig übersetzt.
export const LANGS = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "tr", name: "Türkçe" },
  { code: "es", name: "Español" },
];
const VALID = new Set(LANGS.map((l) => l.code));
const FALLBACKS = ["en", "de"];
const STORE_KEY = "pyquest.lang";

let current = "de";

export function getLocale() {
  return current;
}

function apply(l) {
  current = VALID.has(l) ? l : "de";
  document.documentElement.lang = current;
  return current;
}

export function setLocale(l) {
  apply(l);
  try {
    localStorage.setItem(STORE_KEY, current);
  } catch (_) {}
  return current;
}

export function initLocale() {
  let l = null;
  try {
    l = localStorage.getItem(STORE_KEY);
  } catch (_) {}
  if (!VALID.has(l)) {
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "de";
    l = nav.slice(0, 2).toLowerCase();
  }
  return apply(l);
}

function lookup(loc, key) {
  return UI[loc] ? UI[loc][key] : undefined;
}

function resolve(key) {
  let s = lookup(current, key);
  if (s === undefined) {
    for (const f of FALLBACKS) {
      s = lookup(f, key);
      if (s !== undefined) break;
    }
  }
  return s;
}

export function hasKey(key) {
  return resolve(key) !== undefined;
}

// t("schluessel", {param: wert}) – mit Fallback und {param}-Interpolation.
export function t(key, params) {
  let s = resolve(key);
  if (s === undefined) s = key;
  if (params) {
    for (const k in params) s = s.split("{" + k + "}").join(params[k]);
  }
  return s;
}

// Zahlen im Format der gewählten Sprache (z. B. 1.250 vs. 1,250).
export function fmtNumber(n) {
  try {
    return new Intl.NumberFormat(current).format(n);
  } catch (_) {
    return String(n);
  }
}

// Statische DOM-Texte übersetzen (per data-Attribute markiert).
export function applyStatic(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
}
