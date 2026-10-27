// Codaluna – Lumo, die Wartungsdrohne der Station Polaris (Begleitfigur).
// Inline-SVG ohne Bibliothek, Stimmung über CSS-Klassen (Animationen in app.css,
// prefers-reduced-motion schaltet sie ab). Lumo ist nie enttäuscht oder tadelnd:
// Bei Fehlern „glitcht“ Lumo mit und wird neugierig.
//
// Stimmungen: idle (wartet), think (Programm läuft), listen (wartet auf Eingabe),
// happy (gelöst), proud (Bonus, Level), curious (fast / Hinweis), glitch (Fehler), sleep.

export const MOODS = ["idle", "think", "listen", "happy", "proud", "curious", "glitch", "sleep"];

const EYES = {
  idle: `<g class="lumo-eye lumo-blink"><circle cx="32" cy="32.5" r="5.4"/><circle class="lumo-glint" cx="34" cy="30.5" r="1.6"/></g>`,
  listen: `<g class="lumo-eye"><circle cx="32" cy="32.5" r="6.1"/><circle class="lumo-glint" cx="34.2" cy="30.2" r="1.8"/></g>`,
  think: `<g class="lumo-eye lumo-dots"><circle cx="25.5" cy="32.5" r="2.4"/><circle cx="32" cy="32.5" r="2.4"/><circle cx="38.5" cy="32.5" r="2.4"/></g>`,
  happy: `<path class="lumo-eye lumo-line" d="M24.5 35.5 Q32 25 39.5 35.5"/>`,
  proud: `<path class="lumo-eye lumo-line" d="M23.5 35 Q27.3 28 31 35 M33 35 Q36.7 28 40.5 35"/>`,
  curious: `<g class="lumo-eye"><circle cx="34.5" cy="31.5" r="5.9"/><circle class="lumo-glint" cx="36.6" cy="29.4" r="1.7"/></g>`,
  glitch: `<path class="lumo-eye lumo-line" d="M23 34.5 l3.6 -4 l3.6 4 l3.6 -4 l3.6 4 l3.6 -4"/>`,
  sleep: `<path class="lumo-eye lumo-line" d="M26 34 H38"/>`,
};

const EXTRAS = {
  proud: `<g class="lumo-spark"><path d="M52 12 l1.4 3.2 3.2 1.4 -3.2 1.4 -1.4 3.2 -1.4 -3.2 -3.2 -1.4 3.2 -1.4z"/><path d="M10 20 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1z"/></g>`,
  curious: `<text class="lumo-mark" x="49" y="16">?</text>`,
  sleep: `<text class="lumo-mark lumo-z" x="47" y="16">z</text>`,
  glitch: `<g class="lumo-spark lumo-bits"><rect x="8" y="22" width="3" height="3"/><rect x="53" y="38" width="3" height="3"/><rect x="50" y="18" width="2" height="2"/></g>`,
};

// SVG-Markup für Lumo. size in Pixeln, cls für zusätzliche Klassen.
export function lumo(mood = "idle", { size = 40, cls = "" } = {}) {
  const m = MOODS.includes(mood) ? mood : "idle";
  return `<svg class="lumo lumo-${m}${cls ? " " + cls : ""}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" focusable="false">
  <ellipse class="lumo-shadow" cx="32" cy="60" rx="13" ry="2.4"/>
  <g class="lumo-body">
    <g class="lumo-rotor"><rect x="17" y="5" width="30" height="3" rx="1.5"/></g>
    <rect class="lumo-mast" x="31" y="7.5" width="2" height="7" rx="1"/>
    <path class="lumo-hull" d="M32 14 48.5 23.5v19L32 52 15.5 42.5v-19z"/>
    <rect class="lumo-visor" x="19" y="23" width="26" height="19" rx="7"/>
    ${EYES[m]}
    <circle class="lumo-led" cx="22" cy="44.5" r="1.3"/><circle class="lumo-led" cx="42" cy="44.5" r="1.3"/>
  </g>
  ${EXTRAS[m] || ""}
</svg>`;
}

// Lebendige Lumo-Anzeige in einem Container: setMood(mood, {back}) wechselt die Stimmung,
// back = nach so vielen ms zurück zu "idle". Nach langer Ruhe schläft Lumo ein.
export function createBuddy(host, { size = 30, sleepAfter = 5 * 60 * 1000 } = {}) {
  let mood = null;
  let backTimer = 0;
  let sleepTimer = 0;
  function render(m) {
    if (m === mood) return;
    mood = m;
    host.innerHTML = lumo(m, { size });
    host.dataset.mood = m;
  }
  function armSleep() {
    clearTimeout(sleepTimer);
    sleepTimer = setTimeout(() => {
      if (mood === "idle") render("sleep");
    }, sleepAfter);
  }
  function setMood(m, { back = 0 } = {}) {
    clearTimeout(backTimer);
    render(m);
    if (back) backTimer = setTimeout(() => setMood("idle"), back);
    armSleep();
  }
  setMood("idle");
  return { setMood, get mood() { return mood; } };
}

// Lichtfarbe von Lumo (Werkstatt). Gültig sind #rgb / #rrggbb.
export function setLumoLight(color) {
  if (!/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(String(color || ""))) return;
  document.documentElement.style.setProperty("--lumo-light", color);
}
