// Codaluna – Fortschritt im Browser (localStorage), Version 2.
//
// XP werden NICHT aufaddiert gespeichert, sondern aus den erledigten Lektionen und
// Bonus-Aufgaben berechnet (siehe course.js). So bleiben XP, Level, Sync und Import
// immer stimmig. Datumswerte sind lokale Kalendertage (YYYY-MM-DD).
//
// Statt einer Streak, die reißen kann, gibt es ein selbst gewähltes Wochenziel
// („an 3 Tagen pro Woche“). Verpasste Tage setzen nichts auf null (siehe docs/spielend-lernen.md).

const KEY = "pyquest.progress.v2";
const LEGACY_KEY = "pyquest.progress.v1";

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayBefore(day) {
  const [y, m, d] = day.split("-").map(Number);
  return localDay(new Date(y, m - 1, d - 1));
}

// Montag der Woche, in der `day` liegt (Wochen beginnen montags).
export function weekStart(day = localDay()) {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const back = (date.getDay() + 6) % 7;
  return localDay(new Date(y, m - 1, d - back));
}

export const WEEK_GOALS = [2, 3, 4, 5, 7];

// Erreichte Wochenziele aus den Übungstagen ableiten (nach Laden, Import und Sync,
// damit auch Tage von einem anderen Gerät zählen). Bereits erreichte Wochen bleiben.
export function fillWeeks(data) {
  const byWeek = {};
  for (const day of Object.keys(data.days || {})) {
    const start = weekStart(day);
    (byWeek[start] = byWeek[start] || []).push(day);
  }
  for (const [start, days] of Object.entries(byWeek)) {
    if (!data.weeks[start] && days.length >= data.weekGoal) data.weeks[start] = days.sort()[data.weekGoal - 1];
  }
  return data;
}
const KEEP_DAYS = 120; // ältere Übungstage werden nicht mehr gebraucht

const defaults = () => ({
  v: 2,
  completed: {}, // lessonId -> Tag des Abschlusses
  bonus: {}, // lessonId -> Tag, an dem die Bonus-Aufgabe gelöst wurde
  code: {}, // lessonId -> zuletzt geschriebener Code
  tried: {}, // lessonId -> true, sobald einmal ausgeführt (schaltet die Lösung frei)
  badges: {}, // badgeId -> Tag
  streak: 0, // nur noch für ältere Stände und den Sync, wird nicht mehr angezeigt
  lastActive: null, // letzter Übungstag
  days: {}, // Übungstage (YYYY-MM-DD -> 1)
  weekGoal: 3, // so viele Übungstage pro Woche hat man sich vorgenommen
  weeks: {}, // Montag einer Woche -> Tag, an dem das Wochenziel erreicht wurde
  glitches: {}, // Fehlertyp -> 1 (für das Entdecker-Abzeichen „Glitch-Sammlung“)
  look: { skin: "amber", light: "teal" }, // Werkstatt: Editor-Farben und Lumos Licht
  stats: { runs: 0, errors: 0, fixes: 0, sandboxRuns: 0 },
  last: null, // zuletzt geöffnete Lektion
  owner: null, // Konto, dem dieser Stand gehört (Cloud-Sync)
});

const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);

// Unbekannte oder kaputte Daten in eine gültige Form bringen (Import, alte Versionen).
export function sanitize(raw) {
  const base = defaults();
  if (!isObj(raw)) return base;
  const map = (obj, keep) => {
    const out = {};
    if (isObj(obj)) for (const [k, v] of Object.entries(obj)) if (keep(v)) out[k] = v;
    return out;
  };
  const day = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
  // v1 speicherte erledigte Lektionen als true
  base.completed = {};
  if (isObj(raw.completed)) {
    for (const [k, v] of Object.entries(raw.completed)) if (v) base.completed[k] = day(v) || "—";
  }
  base.bonus = map(raw.bonus, (v) => !!v);
  base.code = map(raw.code, (v) => typeof v === "string");
  base.tried = map(raw.tried, (v) => v === true);
  base.badges = map(raw.badges, (v) => typeof v === "string");
  // Die Streak-Abzeichen von früher gelten als erreichte Wochenziele
  if (base.badges["streak-3"] && !base.badges["week-1"]) base.badges["week-1"] = base.badges["streak-3"];
  if (base.badges["streak-7"] && !base.badges["week-4"]) base.badges["week-4"] = base.badges["streak-7"];
  delete base.badges["streak-3"];
  delete base.badges["streak-7"];
  base.streak = Number.isFinite(raw.streak) && raw.streak > 0 ? Math.floor(raw.streak) : 0;
  base.lastActive = day(raw.lastActive);
  base.days = {};
  if (isObj(raw.days)) for (const k of Object.keys(raw.days)) if (day(k)) base.days[k] = 1;
  if (base.lastActive) base.days[base.lastActive] = 1;
  base.weekGoal = WEEK_GOALS.includes(raw.weekGoal) ? raw.weekGoal : 3;
  base.weeks = {};
  if (isObj(raw.weeks)) for (const [k, v] of Object.entries(raw.weeks)) if (day(k) && day(v)) base.weeks[k] = v;
  if (isObj(raw.look)) {
    for (const k of ["skin", "light"]) if (typeof raw.look[k] === "string" && /^[a-z]{2,16}$/.test(raw.look[k])) base.look[k] = raw.look[k];
  }
  base.glitches = map(raw.glitches, (v) => v === 1 || v === true);
  for (const k of Object.keys(base.glitches)) base.glitches[k] = 1;
  fillWeeks(base);
  if (isObj(raw.stats)) {
    for (const k of Object.keys(base.stats)) {
      const v = raw.stats[k];
      if (Number.isFinite(v) && v > 0) base.stats[k] = Math.floor(v);
    }
  }
  base.last = typeof raw.last === "string" ? raw.last : null;
  base.owner = typeof raw.owner === "string" ? raw.owner : null;
  return base;
}

export const progress = {
  data: defaults(),
  onSave: null, // optionaler Hook (z. B. Cloud-Sync), wird nach jedem save() aufgerufen

  load() {
    let raw = null;
    try {
      raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
    } catch (_) {}
    try {
      this.data = sanitize(raw ? JSON.parse(raw) : null);
    } catch (_) {
      this.data = defaults();
    }
    return this;
  },

  save({ silent = false } = {}) {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch (_) {}
    if (!silent && this.onSave) {
      try {
        this.onSave();
      } catch (_) {}
    }
  },

  // Streak, wie sie heute gilt: gestern oder heute geübt -> zählt, sonst 0.
  get streak() {
    const today = localDay();
    const last = this.data.lastActive;
    return last === today || last === dayBefore(today) ? this.data.streak : 0;
  },

  // Übungstage in der Woche von `day` (Montag bis Sonntag).
  weekDays(day = localDay()) {
    const start = weekStart(day);
    return Object.keys(this.data.days).filter((d) => weekStart(d) === start).length;
  },
  get weekGoal() {
    return this.data.weekGoal;
  },
  setWeekGoal(n) {
    if (!WEEK_GOALS.includes(n) || n === this.data.weekGoal) return;
    this.data.weekGoal = n;
    this.markWeek();
    this.save();
  },
  // Wie oft das Wochenziel schon erreicht wurde
  get weeksMet() {
    return Object.keys(this.data.weeks).length;
  },
  // Wochenziel dieser Woche eintragen, sobald es erreicht ist
  markWeek(day = localDay()) {
    const start = weekStart(day);
    if (!this.data.weeks[start] && this.weekDays(day) >= this.data.weekGoal) this.data.weeks[start] = day;
  },

  // Ein Übungstag zählt, sobald Code ausgeführt wird.
  practice() {
    const today = localDay();
    const last = this.data.lastActive;
    if (last === today) {
      this.markWeek(today); // z. B. nach einem Sync mit Tagen von einem anderen Gerät
      return;
    }
    this.data.streak = last === dayBefore(today) ? this.data.streak + 1 : 1;
    this.data.lastActive = today;
    this.data.days[today] = 1;
    const [y, m, d] = today.split("-").map(Number);
    const oldest = localDay(new Date(y, m - 1, d - KEEP_DAYS));
    for (const k of Object.keys(this.data.days)) if (k < oldest) delete this.data.days[k];
    this.markWeek(today);
  },

  // Fehlertyp merken (für das Entdecker-Abzeichen); true, wenn er neu ist
  noteGlitch(type) {
    if (!type || this.data.glitches[type]) return false;
    this.data.glitches[type] = 1;
    return true;
  },

  isDone(id) {
    return !!this.data.completed[id];
  },
  hasBonus(id) {
    return !!this.data.bonus[id];
  },

  // Gibt true zurück, wenn die Lektion gerade zum ersten Mal erledigt wurde.
  complete(id) {
    if (this.data.completed[id]) return false;
    this.data.completed[id] = localDay();
    this.save();
    return true;
  },
  completeBonus(id) {
    if (this.data.bonus[id]) return false;
    this.data.bonus[id] = localDay();
    this.save();
    return true;
  },

  saveCode(id, code) {
    if (this.data.code[id] === code) return;
    this.data.code[id] = code;
    this.save();
  },
  getCode(id) {
    return this.data.code[id];
  },
  clearCode(id) {
    delete this.data.code[id];
    this.save();
  },

  markTried(id) {
    this.data.tried[id] = true;
  },
  hasTried(id) {
    return !!this.data.tried[id];
  },

  setLast(id) {
    if (this.data.last === id) return;
    this.data.last = id;
    this.save({ silent: true });
  },

  exportJSON() {
    return JSON.stringify({ app: "codaluna", ...this.data }, null, 2);
  },
  importJSON(text) {
    const parsed = JSON.parse(text);
    if (!isObj(parsed) || !(isObj(parsed.completed) || isObj(parsed.code))) throw new Error("ungültig");
    const owner = this.data.owner;
    this.data = sanitize(parsed);
    this.data.owner = owner;
    this.save();
  },
  reset() {
    const owner = this.data.owner;
    this.data = defaults();
    this.data.owner = owner;
    this.save();
  },
  // Lokalen Stand komplett verwerfen (z. B. beim Abmelden): kein Sync-Push.
  wipe() {
    this.data = defaults();
    this.save({ silent: true });
  },
};
