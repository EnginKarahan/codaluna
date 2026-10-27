// Codaluna – Inhaltstests mit der echten Python-Laufzeit (Pyodide in Node).
//
//   node tests/content.test.mjs                 alles
//   node tests/content.test.mjs --lang=de       nur eine Sprache für Muster-/Startcode
//   node tests/content.test.mjs --lesson=s2-l1  nur eine Lektion
//   node tests/content.test.mjs --verbose       auch bestandene Prüfungen zeigen
//
// Geprüft wird je Lektion:
//   · Musterlösung und Bonus-Lösung bestehen – in jeder Sprache
//   · der unveränderte Start-Code besteht NICHT – in jeder Sprache
//   · weitere richtige Lösungen bestehen (nicht zu streng)
//   · typische falsche Lösungen scheitern mit genau der erwarteten Rückmeldung

import course from "../content/courses/season-1.js";
import cases from "./cases/season-1.cases.mjs";
import { loadRuntime, evaluate } from "./lib/runtime.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const LANGS = args.lang ? [args.lang] : ["de", "en", "fr", "it", "tr", "es"];
const verbose = !!args.verbose;

// Jede Sprache wird einzeln geladen (ohne Rückfall auf Englisch), damit eine
// unvollständige Übersetzung auffällt und Sprachen sich nicht gegenseitig stören.
const overlays = {};
for (const lang of LANGS) {
  if (lang === "de") continue;
  try {
    overlays[lang] = (await import(`../content/i18n/season-1.${lang}.js`)).default;
  } catch (e) {
    console.error(`Übersetzung ${lang} lässt sich nicht laden: ${e.message}`);
    process.exit(1);
  }
}

function field(lesson, lang, name) {
  const o = lang !== "de" && overlays[lang][lesson.id];
  return o && o[name] !== undefined ? o[name] : lesson[name];
}
function expertField(lesson, lang, name) {
  const o = lang !== "de" && overlays[lang][lesson.id];
  return o && o.expert && o.expert[name] !== undefined ? o.expert[name] : lesson.expert[name];
}

let total = 0;
const failures = [];
function report(ok, label, got, want, detail) {
  total++;
  if (!ok) failures.push(`✗ ${label}\n    erwartet: ${want}\n    erhalten: ${got}${detail ? "  (" + detail + ")" : ""}`);
  else if (verbose) console.log(`✓ ${label}`);
}

await loadRuntime();
const lessons = course.chapters.flatMap((c) => c.lessons).filter((l) => !args.lesson || l.id === args.lesson);

for (const lesson of lessons) {
  const c = cases[lesson.id] || {};
  const inputs = c.inputs || [];
  const expertInputs = c.expertInputs || inputs;
  if (!c.wrong || c.wrong.length < 3) failures.push(`✗ ${lesson.id}: zu wenige falsche Testfälle (mindestens 3)`);

  for (const lang of LANGS) {
    const starter = field(lesson, lang, "starterCode");
    const sol = evaluate(lesson, field(lesson, lang, "solution"), { starter, inputs });
    report(sol.status === "pass", `${lesson.id} [${lang}] Musterlösung besteht`, sol.status, "pass", sol.detail);
    const st = evaluate(lesson, starter, { starter, inputs });
    report(st.status !== "pass", `${lesson.id} [${lang}] Start-Code besteht nicht`, st.status, "nicht pass");
    if (lesson.expert) {
      const ex = evaluate(lesson, expertField(lesson, lang, "solution"), { starter, inputs: expertInputs, expert: true });
      report(ex.status === "pass", `${lesson.id} [${lang}] Bonus-Lösung besteht`, ex.status, "pass", ex.detail);
    }
  }

  const starter = lesson.starterCode;
  (c.right || []).forEach((code, i) => {
    const r = evaluate(lesson, code, { starter, inputs });
    report(r.status === "pass", `${lesson.id} richtige Variante ${i + 1}`, r.status, "pass", r.detail);
  });
  (c.wrong || []).forEach((w, i) => {
    const r = evaluate(lesson, w.code, { starter, inputs });
    report(r.status === w.expect, `${lesson.id} falsche Variante ${i + 1}`, r.status, w.expect, r.detail);
  });
  (c.expertRight || []).forEach((code, i) => {
    const r = evaluate(lesson, code, { starter, inputs: expertInputs, expert: true });
    report(r.status === "pass", `${lesson.id} Bonus richtig ${i + 1}`, r.status, "pass", r.detail);
  });
  (c.expertWrong || []).forEach((w, i) => {
    const r = evaluate(lesson, w.code, { starter, inputs: expertInputs, expert: true });
    report(r.status === w.expect, `${lesson.id} Bonus falsch ${i + 1}`, r.status, w.expect, r.detail);
  });
}

console.log(`\nCodaluna-Inhaltstests: ${total - failures.length}/${total} bestanden (${lessons.length} Lektionen, Sprachen: ${LANGS.join(", ")})`);
if (failures.length) {
  console.log("\n" + failures.join("\n"));
  process.exit(1);
}
