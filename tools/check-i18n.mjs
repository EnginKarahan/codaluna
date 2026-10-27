// PyQuest – Übersetzungen prüfen (UI-Texte und Kurs-Overlays), je Sprache isoliert.
//
//   node tools/check-i18n.mjs            alle Sprachen
//   node tools/check-i18n.mjs --lang=tr  nur eine Sprache
//
// Prüft: fehlende/überzählige UI-Schlüssel, Platzhalter ({n}, {0} …) wie im Deutschen,
// fehlende Lektionsfelder (auch story), Bereiche der Station (regions), Zahl der Tipps,
// Feedback-Schlüssel, Bonus-Aufgaben,
// ausgeglichene <code>/<b>-Tags. Beendet sich mit Code 1, wenn etwas fehlt.

import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const LANGS = args.lang ? [args.lang] : ["en", "fr", "it", "tr", "es"];

const de = (await import(ROOT + "src/i18n/de.js")).default;
const course = (await import(ROOT + "content/courses/season-1.js")).default;
const lessons = course.chapters.flatMap((c) => c.lessons);

// {wort} innerhalb von <code> sind f-String-Beispiele mit übersetzten Variablennamen, keine Platzhalter
const placeholders = (s) =>
  [...String(s).replace(/<code>[\s\S]*?<\/code>/g, "").matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const tags = (s) => {
  const out = [];
  for (const tag of ["code", "b", "i", "p", "pre", "ul", "li"]) {
    const open = (String(s).match(new RegExp(`<${tag}(\\s[^>]*)?>`, "g")) || []).length;
    const close = (String(s).match(new RegExp(`</${tag}>`, "g")) || []).length;
    if (open !== close) out.push(`<${tag}> ${open}/${close}`);
  }
  return out;
};

let problems = 0;
const say = (lang, msg) => {
  problems++;
  console.log(`  [${lang}] ${msg}`);
};

for (const lang of LANGS) {
  console.log(`\n== ${lang.toUpperCase()} ==`);
  // ---- UI-Texte ----
  let ui;
  try {
    ui = (await import(ROOT + `src/i18n/${lang}.js`)).default;
  } catch (e) {
    say(lang, `UI-Datei fehlt oder ist fehlerhaft: ${e.message}`);
    continue;
  }
  for (const k of Object.keys(de)) {
    if (ui[k] === undefined) say(lang, `UI fehlt: ${k}`);
    else {
      if (placeholders(ui[k]) !== placeholders(de[k])) say(lang, `UI-Platzhalter in ${k}: "${placeholders(ui[k])}" statt "${placeholders(de[k])}"`);
      for (const p of tags(ui[k])) say(lang, `UI-Tags unausgeglichen in ${k}: ${p}`);
    }
  }
  for (const k of Object.keys(ui)) if (de[k] === undefined) say(lang, `UI überzählig: ${k}`);

  // ---- Kurs ----
  let ov;
  try {
    ov = (await import(ROOT + `content/i18n/season-1.${lang}.js`)).default;
  } catch (e) {
    say(lang, `Kurs-Datei fehlt oder ist fehlerhaft: ${e.message}`);
    continue;
  }
  for (const ch of course.chapters) {
    if (!ov.chapters || !ov.chapters[ch.id]) say(lang, `Kapiteltitel fehlt: ${ch.id}`);
    if (ch.region) {
      const r = ov.regions && ov.regions[ch.id];
      for (const f of ["name", "intro", "outro"]) if (!r || !r[f]) say(lang, `Bereich ${ch.id}.${f} fehlt`);
      for (const f of ["intro", "outro"]) for (const p of tags((r && r[f]) || "")) say(lang, `Bereich ${ch.id}.${f}: ${p}`);
    }
  }
  for (const l of lessons) {
    const o = ov[l.id];
    if (!o) {
      say(lang, `Lektion fehlt: ${l.id}`);
      continue;
    }
    for (const f of ["title", "intro", "taskHtml", "hints", "starterCode", "solution"]) {
      if (o[f] === undefined) say(lang, `${l.id}.${f} fehlt`);
    }
    if (l.story && !o.story) say(lang, `${l.id}.story fehlt`);
    for (const f of Object.keys(o)) {
      if (!["title", "story", "intro", "taskHtml", "hints", "starterCode", "solution", "feedback", "expert"].includes(f)) {
        say(lang, `${l.id}: unbekanntes Feld "${f}" (z. B. kicker wird inzwischen automatisch erzeugt)`);
      }
    }
    if (Array.isArray(l.hints) && (!Array.isArray(o.hints) || o.hints.length !== l.hints.length)) {
      say(lang, `${l.id}.hints: ${o.hints ? o.hints.length : 0} statt ${l.hints.length}`);
    }
    for (const f of ["title", "story", "intro", "taskHtml"]) for (const p of tags(o[f] || "")) say(lang, `${l.id}.${f}: ${p}`);
    (o.hints || []).forEach((h, i) => tags(h).forEach((p) => say(lang, `${l.id}.hints[${i}]: ${p}`)));
    const checkFeedback = (base, over, where) => {
      for (const k of Object.keys(base || {})) {
        if (!over || over[k] === undefined) say(lang, `${where}.${k} fehlt`);
        else {
          if (placeholders(over[k]) !== placeholders(base[k])) say(lang, `${where}.${k}: Platzhalter weichen ab`);
          for (const p of tags(over[k])) say(lang, `${where}.${k}: ${p}`);
        }
      }
      for (const k of Object.keys(over || {})) if (!base || base[k] === undefined) say(lang, `${where}.${k} überzählig`);
    };
    checkFeedback(l.feedback, o.feedback, `${l.id}.feedback`);
    if (l.expert) {
      if (!o.expert) say(lang, `${l.id}.expert fehlt`);
      else {
        for (const f of ["html", "solution"]) if (o.expert[f] === undefined) say(lang, `${l.id}.expert.${f} fehlt`);
        for (const p of tags(o.expert.html || "")) say(lang, `${l.id}.expert.html: ${p}`);
        checkFeedback(l.expert.feedback, o.expert.feedback, `${l.id}.expert.feedback`);
      }
    }
  }
}

console.log(problems ? `\n${problems} Problem(e) gefunden.` : "\nAlles vollständig. ✓");
process.exit(problems ? 1 : 0);
