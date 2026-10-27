// PyQuest – Werkstatt: Editor-Farben und Lumos Licht. Freigeschaltet wird über Level,
// nicht über Käufe oder Zufall, und was es wofür gibt, ist vorher sichtbar.

import { t } from "/src/js/i18n.js";
import { openModal } from "/src/js/ui.js";
import { lumo, setLumoLight } from "/src/js/companion.js";
import { icon } from "/src/js/icons.js";

export const SKINS = [
  { id: "amber", level: 1, colors: ["#14110b", "#ffb340", "#c8a3ff", "#ff9d84"] },
  { id: "night", level: 3, colors: ["#10131f", "#ffd36e", "#ff9de2", "#a5f0a0"] },
  { id: "aurora", level: 5, colors: ["#0d1a1a", "#5ee0c8", "#b48cff", "#9ff0b0"] },
  { id: "sunset", level: 7, colors: ["#1f1218", "#ff9b6b", "#ff8fc0", "#f5e17a"] },
  { id: "mono", level: 9, colors: ["#120d05", "#ffb340", "#ffe2a8", "#a07a40"] },
];

export const LIGHTS = [
  { id: "teal", level: 1, color: "#34d3b5" },
  { id: "amber", level: 2, color: "#ffb340" },
  { id: "violet", level: 4, color: "#b48cff" },
  { id: "coral", level: 6, color: "#ff7a6b" },
  { id: "lime", level: 8, color: "#b6e34a" },
  { id: "ice", level: 10, color: "#bfe9ff" },
];

export const DEFAULT_LOOK = { skin: "amber", light: "teal" };

// Was ein Level freischaltet (für den Level-up-Moment)
export function unlocksAt(level) {
  return [
    ...SKINS.filter((s) => s.level === level).map((s) => t(`workshop.skin.${s.id}`)),
    ...LIGHTS.filter((l) => l.level === level).map((l) => t(`workshop.light.${l.id}`)),
  ];
}

// Aussehen anwenden; Gesperrtes (z. B. nach dem Löschen des Fortschritts) fällt auf Standard zurück
export function applyLook(look, level) {
  const skin = SKINS.find((s) => s.id === (look && look.skin) && s.level <= level) || SKINS[0];
  const light = LIGHTS.find((l) => l.id === (look && look.light) && l.level <= level) || LIGHTS[0];
  document.documentElement.dataset.skin = skin.id;
  setLumoLight(light.color);
}

const CHECK = icon("check", { size: 15 });

// onPick(look): neues Aussehen speichern (die App wendet es an)
export function showWorkshop({ look, level, onPick }) {
  let current = { ...DEFAULT_LOOK, ...(look || {}) };
  const option = (kind, item, inner) => {
    const open = item.level <= level;
    const active = current[kind] === item.id;
    const name = t(`workshop.${kind}.${item.id}`);
    return `<button type="button" class="ws-opt${active ? " active" : ""}${open ? "" : " locked"}" data-kind="${kind}" data-id="${item.id}"
      aria-pressed="${active}"${open ? "" : ' aria-disabled="true"'}>
      ${inner}
      <span class="ws-name">${name}</span>
      <span class="ws-lock">${open ? (active ? CHECK : "") : icon("lock", { size: 13 }) + " " + t("workshop.locked", { n: item.level })}</span>
    </button>`;
  };
  const skins = SKINS.map((s) =>
    option("skin", s, `<span class="ws-swatch" aria-hidden="true">${s.colors.map((c) => `<i style="background:${c}"></i>`).join("")}</span>`)
  ).join("");
  const lights = LIGHTS.map((l) =>
    option("light", l, `<span class="ws-lumo" aria-hidden="true" style="--lumo-light:${l.color}">${lumo("happy", { size: 40 })}</span>`)
  ).join("");

  const m = openModal({
    label: t("workshop.title"),
    className: "workshop-modal",
    closeButton: true,
    html: `
      <h2>${t("workshop.title")}</h2>
      <p>${t("workshop.intro")}</p>
      <h3>${t("workshop.editor")}</h3>
      <div class="ws-grid">${skins}</div>
      <h3>${t("workshop.lumo")}</h3>
      <div class="ws-grid lights">${lights}</div>
      <div class="modal-actions"><button type="button" class="btn" data-close>${t("dlg.close")}</button></div>`,
  });
  m.el.querySelector("[data-close]").onclick = () => m.close();
  m.el.querySelectorAll(".ws-opt").forEach((b) => {
    b.onclick = () => {
      if (b.classList.contains("locked")) return;
      current = { ...current, [b.dataset.kind]: b.dataset.id };
      m.el.querySelectorAll(`.ws-opt[data-kind="${b.dataset.kind}"]`).forEach((x) => {
        const on = x === b;
        x.classList.toggle("active", on);
        x.setAttribute("aria-pressed", String(on));
        const lock = x.querySelector(".ws-lock");
        if (!x.classList.contains("locked")) lock.innerHTML = on ? CHECK : "";
      });
      onPick(current);
    };
  });
}
