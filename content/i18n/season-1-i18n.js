// PyQuest – Übersetzungen des Kurses "season-1" (eine Datei pro Sprache).
// Basis (Deutsch) steht in content/courses/season-1.js. Die Overlays überschreiben nur
// Texte und Code: title, intro, taskHtml, hints[], starterCode, solution, feedback{},
// expert{html, solution, feedback{}} sowie chapters (Kapiteltitel).
// Prüfungen, Tests und XP bleiben in der Basis und gelten für alle Sprachen.
// Fehlt ein Feld, greift Englisch, dann Deutsch. Prüfen: node tools/check-i18n.mjs

import en from "./season-1.en.js";
import fr from "./season-1.fr.js";
import it from "./season-1.it.js";
import tr from "./season-1.tr.js";
import es from "./season-1.es.js";

export default { en, fr, it, tr, es };
