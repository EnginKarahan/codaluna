// PyQuest – spürbares Feedback: Funken, fliegende XP, Level-up-Moment.
// Kurz, mit Sinn und abschaltbar: Bei prefers-reduced-motion gibt es keine Bewegung,
// der Level-up-Moment erscheint dann ruhig ohne Animation.

import { lumo } from "/src/js/companion.js";

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COLORS = ["var(--accent)", "var(--teal)", "var(--accent-soft)", "var(--teal-soft)", "#fff6dc"];

function center(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, visible: r.width > 0 && r.height > 0 };
}

// Funkenregen aus der Mitte eines Elements.
export function burst(el, { count = 18, spread = 90 } = {}) {
  if (!el || calm()) return;
  const c = center(el);
  if (!c.visible) return;
  const layer = document.createElement("div");
  layer.className = "fx-layer";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "fx-spark" + (i % 3 === 0 ? " sq" : "");
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = spread * (0.55 + Math.random() * 0.6);
    p.style.left = c.x + "px";
    p.style.top = c.y + "px";
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist - 20 + "px");
    p.style.setProperty("--c", COLORS[i % COLORS.length]);
    p.style.animationDelay = Math.random() * 60 + "ms";
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1100);
}

// „+20 XP“ fliegt von einem Element zur XP-Anzeige in der Kopfzeile.
export function flyXp(fromEl, toEl, text) {
  if (!fromEl || !toEl || calm()) return Promise.resolve();
  const a = center(fromEl);
  const b = center(toEl);
  if (!a.visible || !b.visible) return Promise.resolve();
  const chip = document.createElement("div");
  chip.className = "fx-xp";
  chip.setAttribute("aria-hidden", "true");
  chip.textContent = text;
  chip.style.left = a.x + "px";
  chip.style.top = a.y + "px";
  chip.style.setProperty("--dx", b.x - a.x + "px");
  chip.style.setProperty("--dy", b.y - a.y + "px");
  document.body.appendChild(chip);
  return new Promise((resolve) => {
    setTimeout(() => {
      chip.remove();
      toEl.classList.remove("fx-pulse");
      void toEl.offsetWidth; // Animation neu starten
      toEl.classList.add("fx-pulse");
      resolve();
    }, 900);
  });
}

// Großer, kurzer Moment für ein neues Level. Schließt sich selbst (oder per Klick/Taste).
export function levelMoment({ level, title, text }) {
  document.querySelectorAll(".fx-level").forEach((x) => x.remove());
  const box = document.createElement("div");
  box.className = "fx-level";
  box.setAttribute("role", "status");
  box.innerHTML = `
    <div class="fx-level-card">
      ${lumo("proud", { size: 88 })}
      <div class="fx-level-n">${level}</div>
      <div class="fx-level-title">${title}</div>
      ${text ? `<div class="fx-level-text">${text}</div>` : ""}
    </div>`;
  document.body.appendChild(box);
  const close = () => {
    box.classList.add("out");
    setTimeout(() => box.remove(), 300);
    document.removeEventListener("keydown", close, true);
  };
  box.addEventListener("click", close);
  document.addEventListener("keydown", close, true);
  setTimeout(close, 2600);
  burst(box.querySelector(".fx-level-n"), { count: 26, spread: 150 });
}
