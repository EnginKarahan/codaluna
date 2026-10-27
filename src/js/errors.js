// Codaluna – Fehler verständlich erklären.
// Python liefert Typ + englische Meldung; hier wird daraus eine kurze, ermutigende
// Erklärung in der gewählten Sprache. Zuerst greifen Regeln, die die Codezeile lesen
// (fixes.js: `else if`, `\n` außerhalb von Text …), dann konkrete Muster auf die Meldung
// (fehlender Doppelpunkt, offene Klammer …), sonst die allgemeine Erklärung zum Fehlertyp.
// Wo es eindeutig genug ist, kommt eine korrigierte Zeile zum Übernehmen dazu.

import { t, hasKey } from "/src/js/i18n.js";
import { makeContext, ruleHelp, patternHelp, fallbackHelp, defaultSpot } from "/src/js/fixes.js";

// [Fehlertypen, Muster auf die Meldung, i18n-Schlüssel]. Treffergruppen -> {0}, {1} …
const PATTERNS = [
  [["SyntaxError"], /^expected ':'/, "errx.colon"],
  [["SyntaxError"], /^'([([{])' was never closed/, "errx.neverClosed"],
  [["SyntaxError"], /^unmatched '([)\]}])'/, "errx.unmatched"],
  [["SyntaxError"], /^closing parenthesis '(.)' does not match opening parenthesis '(.)'/, "errx.mismatch"],
  [["SyntaxError"], /^unterminated (?:triple-quoted )?string literal/, "errx.unterminated"],
  [["SyntaxError"], /^invalid character '([“”„‟‘’‚‛«»])'/, "errx.smartQuote"],
  [["SyntaxError"], /^invalid character '(.+?)'/, "errx.badChar"],
  [["SyntaxError"], /^invalid non-printable character/, "errx.nonPrintable"],
  [["SyntaxError"], /Missing parentheses in call to 'print'/, "errx.printParens"],
  [["SyntaxError"], /Perhaps you forgot a comma\?/, "errx.comma"],
  [["SyntaxError"], /Maybe you meant '==' or ':=' instead of '='\?/, "errx.compareEq"],
  [["SyntaxError"], /^cannot assign to /, "errx.assignTarget"],
  [["SyntaxError"], /^invalid decimal literal/, "errx.decimal"],
  [["SyntaxError"], /^'return' outside function/, "errx.returnOutside"],
  [["SyntaxError"], /^expected 'except' or 'finally' block/, "errx.tryBlock"],
  [["SyntaxError"], /^'(break|continue)' (?:outside loop|not properly in loop)/, "errx.loopOnly"],
  [["SyntaxError"], /^leading zeros in decimal integer literals/, "errx.leadingZero"],
  [["SyntaxError"], /^positional argument follows keyword argument/, "errx.keywordArgOrder"],
  [["SyntaxError"], /^f-string: expecting '\}'/, "errx.fstringClose"],
  [["SyntaxError"], /^f-string: single '\}' is not allowed/, "errx.fstringSingle"],
  [["SyntaxError"], /^f-string: (?:valid expression required before '\}'|empty expression not allowed)/, "errx.fstringEmpty"],
  [["TabError"], /^inconsistent use of tabs and spaces/, "err.TabError.hint"],
  [["IndentationError"], /^expected an indented block after '(\w+)' statement on line (\d+)/, "errx.indentAfter"],
  [["IndentationError"], /^expected an indented block after function definition on line (\d+)/, "errx.indentAfterDef"],
  [["IndentationError"], /^unexpected indent/, "errx.unexpectedIndent"],
  [["IndentationError", "TabError"], /^unindent does not match any outer indentation level/, "errx.unindent"],
  [["TypeError"], /^can only concatenate str \(not "(\w+)"\) to str/, "errx.concat"],
  [["TypeError"], /^unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/, "errx.operand"],
  [["TypeError"], /^'([<>]=?)' not supported between instances of '(\w+)' and '(\w+)'/, "errx.compareTypes"],
  [["TypeError"], /takes (\d+) positional arguments? but (\d+) (?:were|was) given/, "errx.tooManyArgs"],
  [["TypeError"], /takes from \d+ to (\d+) positional arguments? but (\d+) (?:were|was) given/, "errx.tooManyArgs"],
  [["TypeError"], /^'float' object cannot be interpreted as an integer/, "errx.floatAsInt"],
  [["TypeError"], /missing (\d+) required positional arguments?/, "errx.missingArgs"],
  [["TypeError"], /^'(\w+)' object is not callable/, "errx.notCallable"],
  [["TypeError"], /^'(\w+)' object is not subscriptable/, "errx.notSubscriptable"],
  [["TypeError"], /^'(\w+)' object is not iterable/, "errx.notIterable"],
  [["TypeError"], /^can't multiply sequence by non-int of type '(\w+)'/, "errx.multiplySeq"],
  [["ValueError"], /^invalid literal for int\(\) with base 10: (.*)$/, "errx.intParse"],
  [["ValueError"], /^could not convert string to float: (.*)$/, "errx.floatParse"],
  [["IndexError"], /index out of range/, "errx.index"],
  [["KeyError"], /^(.+)$/, "errx.key"],
  [["UnboundLocalError"], /local variable '(\w+)'/, "errx.unboundLocal"],
  [["ModuleNotFoundError"], /^No module named '(turtle|tkinter|pygame)/, "errx.moduleGraphics"],
  [["ModuleNotFoundError"], /^No module named '([\w.]+)'/, "errx.moduleMissing"],
  [["RecursionError"], /maximum recursion depth/, "errx.recursion"],
  [["StationError"], /^unknown color (.+)$/, "errx.stationColor"],
  [["StationError"], /^(\w+) must be between (\S+) and (\S+) \(got (.+)\)$/, "errx.stationRange"],
  [["StationError"], /^(\w+) must be a whole number, not (\w+)/, "errx.stationWhole"],
  [["StationError"], /^(\w+) must be a number, not (\w+)/, "errx.stationNumber"],
  [["StationError"], /^unknown note (.+)$/, "errx.stationNote"],
  [["StationError"], /^unknown drum (.+)$/, "errx.stationDrum"],
  [["StationError"], /^the song is too long/, "errx.stationLong"],
  [["StationError"], /^too many updates for screen or speaker \(more than (\d+)\)/, "errx.stationEvents"],
  [["DroneError"], /^there is no crystal here/, "errx.droneNoCrystal"],
  [["DroneError"], /^too many steps/, "errx.droneSteps"],
  [["DroneError"], /^too many checks/, "errx.droneChecks"],
];

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const code = (s) => `<code>${escapeHtml(s)}</code>`;

function patternHint(type, message) {
  for (const [types, re, key] of PATTERNS) {
    if (!types.includes(type)) continue;
    const m = message.match(re);
    if (m) return { key, params: m.slice(1), groups: m.slice(1) };
  }
  return null;
}

// Platzhalter: Text als <code> (escaped), Zahlen wie sie sind
function renderParams(params) {
  if (!params) return undefined;
  const out = {};
  params.forEach((p, i) => (out[i] = typeof p === "number" ? String(p) : code(p)));
  return out;
}

// Liefert {title, hint, key, line, text, spot, fix}
//   hint  HTML (Parameter sind escaped) · key der verwendete Textschlüssel (Tests, Fehlersuche)
//   text  die betroffene Codezeile, spot {from, to} die Stelle darin (0-basiert)
//   fix   Korrektur: {line, text} | {line, text, insert} | {code} – siehe fixes.js
// code: das ausgeführte Programm (ohne Code gibt es nur die Erklärung).
export function explainError(err, source = "") {
  const type = (err && err.type) || "Error";
  const message = (err && err.message) || "";
  const typeKey = hasKey(`err.${type}.title`) ? type : "default";
  const c = makeContext(err || {}, source);
  let found = ruleHelp(c);
  if (!found) {
    const p = patternHint(type, message);
    if (p) found = { ...p, ...(patternHelp(c, p.key, p.groups) || {}) };
  }
  if (!found) found = fallbackHelp(c);
  if (!found) found = { key: `err.${typeKey}.hint` };
  return {
    title: t(`err.${typeKey}.title`),
    hint: t(found.key, renderParams(found.params)),
    key: found.key,
    line: c.line,
    text: c.line ? c.text : null,
    spot: found.spot || defaultSpot(c),
    fix: found.fix,
  };
}
