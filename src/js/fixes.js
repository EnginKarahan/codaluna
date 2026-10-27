// Codaluna – typische Anfängerfehler erkennen und Korrekturen vorschlagen.
//
// Pythons Meldung allein hilft oft wenig ("invalid syntax") oder führt in die Irre
// ("expected ':'" bei `else if`). Diese Regeln lesen deshalb die betroffene Codezeile mit
// und liefern einen Erklärungsschlüssel, auf Wunsch die genaue Stelle und, wo es eindeutig
// genug ist, eine korrigierte Zeile zum Übernehmen.
//
// Ergebnis einer Regel: { key, params, fix, spot }
//   params  Werte für {0}, {1} … – Text wird in errors.js als <code> gesetzt, Zahlen bleiben Zahl
//   fix     { line, text } ersetzt Zeile `line` · { line, text, insert: true } fügt davor ein ·
//           { code } ersetzt das ganze Programm
//   spot    { from, to } Spalten (0-basiert) in der Fehlerzeile statt der Stelle von Python

const ID = "[\\p{L}_][\\p{L}\\p{N}_]*";
const reId = new RegExp(`^${ID}$`, "u");
const CLOSE = { "(": ")", "[": "]", "{": "}" };
const OPEN = { ")": "(", "]": "[", "}": "{" };
const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del",
  "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
]);
const BLOCK = /^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b/;
const CASE_WORDS = ["if", "elif", "else", "for", "while", "def", "return", "import", "from", "class", "try", "except", "finally", "with", "pass", "break", "continue"];
const MASK = "\u00a4"; // ersetzt Zeichen in Texten, damit Regeln nicht in Strings suchen

// Befehlswörter aus den Sprachen der App. Nur am Anfang einer Blockzeile mit ":" bzw. als Aufruf.
const FOREIGN_BLOCK = {
  wenn: "if", falls: "if", sonst: "else", solange: "while", "für": "for",
  si: "if", sinon: "else", tantque: "while", pour: "for",
  se: "if", altrimenti: "else", mentre: "while", per: "for",
  "eğer": "if", "değilse": "else", iken: "while",
  sino: "else", mientras: "while", para: "for",
};
const FOREIGN_CALL = {
  drucke: "print", ausgabe: "print", zeige: "print", schreibe: "print",
  afficher: "print", affiche: "print", imprimer: "print", imprime: "print",
  stampa: "print", scrivi: "print", mostra: "print",
  "yazdır": "print", yazdir: "print", yaz: "print",
  imprimir: "print", escribir: "print", mostrar: "print",
  eingabe: "input", saisir: "input", leggi: "input", girdi: "input", leer: "input",
  "länge": "len", laenge: "len", longueur: "len", lunghezza: "len", uzunluk: "len", longitud: "len",
};
// Zeichen aus Textverarbeitung und Mathe, die Python nicht kennt
const CHAR_FIX = {
  "×": "*", "·": "*", "÷": "/", "–": "-", "—": "-", "−": "-", "≤": "<=", "≥": ">=", "≠": "!=",
  "²": "**2", "³": "**3", "\u00a0": " ", "\u2009": " ", "\u202f": " ", "\u200b": "", "\ufeff": "",
};
const SMART_DOUBLE = /[„“”‟«»]/;
const SMART_SINGLE = /[‘’‚‛]/;
const MODULES = ["random", "math", "time", "string", "datetime", "station", "drone"];

// ---------------------------------------------------------------------------
// Hilfen: Texte ausblenden, Klammern zählen, Einrückung
// ---------------------------------------------------------------------------

// Inhalt von Strings durch MASK ersetzen (Anführungszeichen bleiben), Kommentare durch
// Leerzeichen. Gleiche Länge wie das Original, damit Spalten passen.
export function mask(s) {
  let out = "";
  let comment = -1;
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "#") {
      comment = i;
      out += " ".repeat(s.length - i);
      break;
    }
    if (ch === '"' || ch === "'") {
      const triple = s.startsWith(ch.repeat(3), i);
      const q = triple ? ch.repeat(3) : ch;
      out += q;
      i += q.length;
      while (i < s.length && !s.startsWith(q, i)) {
        if (s[i] === "\\" && i + 1 < s.length) {
          out += MASK + MASK;
          i += 2;
        } else {
          out += MASK;
          i++;
        }
      }
      if (i < s.length) {
        out += q;
        i += q.length;
      }
      continue;
    }
    out += ch;
    i++;
  }
  return { masked: out, comment };
}

// Offene Klammern (Stapel) und überzählige schließende in einem maskierten Text
function brackets(m) {
  const stack = [];
  const extra = [];
  for (let i = 0; i < m.length; i++) {
    const ch = m[i];
    if (CLOSE[ch]) stack.push({ ch, i });
    else if (OPEN[ch]) {
      if (stack.length && stack[stack.length - 1].ch === OPEN[ch]) stack.pop();
      else extra.push({ ch, i });
    }
  }
  return { stack, extra };
}

// Passende schließende Klammer zu m[start] (maskiert), -1 wenn keine
function matching(m, start) {
  let depth = 0;
  for (let i = start; i < m.length; i++) {
    if (CLOSE[m[i]]) depth++;
    else if (OPEN[m[i]] && --depth === 0) return i;
  }
  return -1;
}

// Bereiche zwischen Kommas auf oberster Ebene in m[from, to)
function splitTop(m, from, to, sep = ",") {
  const parts = [];
  let depth = 0;
  let start = from;
  for (let i = from; i < to; i++) {
    if (CLOSE[m[i]]) depth++;
    else if (OPEN[m[i]]) depth--;
    else if (depth === 0 && m.startsWith(sep, i)) {
      parts.push([start, i]);
      start = i + sep.length;
    }
  }
  parts.push([start, to]);
  return parts;
}

const indentOf = (s) => s.match(/^[ \t]*/)[0];
const isBlank = (s) => /^\s*(#.*)?$/.test(s);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordRe = (w, flags = "u") => new RegExp(`(?<![\\p{L}\\p{N}_])${esc(w)}(?![\\p{L}\\p{N}_])`, flags);
const splice = (s, from, to, ins) => s.slice(0, from) + ins + s.slice(to);

// Ende des Codes in der Zeile (vor Kommentar und Leerzeichen)
function codeEnd(c) {
  const end = c.comment >= 0 ? c.comment : c.text.length;
  return c.text.slice(0, end).replace(/\s+$/, "").length;
}
const codePart = (c) => c.text.slice(0, codeEnd(c));
const maskedCode = (c) => c.masked.slice(0, codeEnd(c));
const withIndent = (text, indent) => indent + text.replace(/^[ \t]*/, "");
const lineFix = (c, text) => (text !== c.text ? { line: c.line, text } : undefined);

// Indizes der vorherigen Codezeilen (ohne Leer- und Kommentarzeilen), nächste zuerst
function previousCode(c) {
  const out = [];
  for (let i = c.line - 2; i >= 0; i--) if (!isBlank(c.lines[i])) out.push(i);
  return out;
}

// Gültige Einrückungsebenen vor der Fehlerzeile (wie Pythons Einrückungs-Stapel)
function indentLevels(c) {
  const stack = [0];
  for (let i = 0; i < c.line - 1; i++) {
    if (isBlank(c.lines[i])) continue;
    const w = indentOf(c.lines[i]).replace(/\t/g, "    ").length;
    if (w > stack[stack.length - 1]) stack.push(w);
    else while (stack.length > 1 && stack[stack.length - 1] > w) stack.pop();
  }
  return stack;
}

// Einrückung des Blockkopfs, zu dem else/elif/except/finally gehört
function partnerIndent(c, word) {
  const heads = word === "except" || word === "finally" ? /^\s*(try|except)\b/ : /^\s*(if|elif|for|while|try|except)\b/;
  const mine = indentOf(c.text).length;
  for (const i of previousCode(c)) {
    const ind = indentOf(c.lines[i]);
    if (heads.test(c.lines[i]) && (ind.length < mine || word === "else" || word === "elif")) {
      if (ind.length !== mine) return ind;
    }
    if (ind.length === 0 && !heads.test(c.lines[i])) break;
  }
  return null;
}

// Wo bekommt ein Name einen Wert? Zeilennummer (1-basiert) oder 0
function definedAt(c, name) {
  const n = esc(name);
  const res = [
    new RegExp(`^\\s*(?:${ID}\\s*,\\s*)*${n}\\s*(?:,\\s*${ID}\\s*)*(?:[-+*/%]|//|\\*\\*)?=(?!=)`, "u"),
    new RegExp(`^\\s*for\\s+[^:]*(?<![\\p{L}\\p{N}_])${n}(?![\\p{L}\\p{N}_])[^:]*\\bin\\b`, "u"),
    new RegExp(`^\\s*def\\s+${n}\\b`, "u"),
    new RegExp(`^\\s*def\\s+${ID}\\s*\\([^)]*(?<![\\p{L}\\p{N}_])${n}(?![\\p{L}\\p{N}_])`, "u"),
    new RegExp(`^\\s*(?:from\\s+\\S+\\s+)?import\\s+.*(?<![\\p{L}\\p{N}_])${n}(?![\\p{L}\\p{N}_])`, "u"),
    new RegExp(`\\bas\\s+${n}\\b`, "u"),
  ];
  for (let i = 0; i < c.lines.length; i++) {
    const m = mask(c.lines[i]).masked;
    if (res.some((re) => re.test(m))) return i + 1;
  }
  return 0;
}

// Erstes Vorkommen eines Wortes außerhalb von Texten
function findWord(c, w) {
  const m = wordRe(w).exec(c.masked);
  return m ? m.index : -1;
}

// Aus Teilen wie  "Du bist ", alter, " Jahre"  einen f-String bauen (null, wenn es nicht passt).
// sep steht zwischen den Teilen (" " für Werte wie bei print, "" für eine Kette mit +).
function toFString(raws, sep = "") {
  const pieces = [];
  for (const r of raws) {
    const raw = r.trim();
    const lit = raw.match(/^(["'])((?:\\.|(?!\1)[^\\])*)\1$/s);
    if (lit) pieces.push({ lit: lit[2] });
    // "Summe: " + 3 + 4 – gemeint ist vielleicht 7; da lieber keine Korrektur als eine falsche
    else if (!raw || /^\d/.test(raw) || /^[rbfuRBFU]{1,2}["']/.test(raw) || /["'{}\\]/.test(raw)) return null;
    else pieces.push({ expr: raw.replace(/^str\((.*)\)$/s, "$1") });
  }
  const lits = pieces.filter((p) => p.lit !== undefined).map((p) => p.lit).join("");
  if (lits.includes("'") && lits.includes('"')) return null;
  const quote = lits.includes('"') ? "'" : '"';
  const body = pieces
    .map((p) => (p.expr !== undefined ? `{${p.expr}}` : p.lit.replace(/\{/g, "{{").replace(/\}/g, "}}")))
    .join(sep);
  return pieces.some((p) => p.expr !== undefined) ? `f${quote}${body}${quote}` : null;
}

// Teilausdruck mit `+` auf oberster Ebene und mindestens einem Text: in Klammern oder rechts vom =
function plusSegments(c) {
  const m = maskedCode(c);
  const segs = [];
  for (let i = 0; i < m.length; i++) {
    if (m[i] === "(" || m[i] === "[") {
      const j = matching(m, i);
      if (j > 0) segs.push(...splitTop(m, i + 1, j));
    }
  }
  const assign = m.match(new RegExp(`^\\s*${ID}\\s*=(?!=)`, "u"));
  if (assign) segs.push([assign[0].length, m.length]);
  return segs.filter(([a, b]) => splitTop(m, a, b, "+").length > 1 && /["']/.test(m.slice(a, b)));
}

function fstringFix(c) {
  const m = maskedCode(c);
  for (const [a, b] of plusSegments(c)) {
    const f = toFString(splitTop(m, a, b, "+").map(([x, y]) => c.text.slice(x, y)));
    if (!f) continue;
    const lead = c.text.slice(a, b).match(/^\s*/)[0];
    const trail = c.text.slice(a, b).match(/\s*$/)[0];
    return lineFix(c, splice(c.text, a, b, lead + f + trail));
  }
  return undefined;
}

// Variable aus input(), die in der Fehlerzeile vorkommt → { name, fix } (int(input(…)) bzw. float)
function inputNumberFix(c, conv = "int") {
  const here = mask(c.text).masked;
  // input() direkt in der Fehlerzeile
  const direct = here.search(/(?<![\p{L}\p{N}_.])input\s*\(/u);
  if (direct >= 0 && !/(int|float)\s*\(\s*$/.test(here.slice(0, direct))) {
    const open = here.indexOf("(", direct);
    const close = matching(here, open);
    if (close > 0) {
      return { name: "input()", fix: lineFix(c, splice(c.text, direct, close + 1, `${conv}(${c.text.slice(direct, close + 1)})`)) };
    }
  }
  for (let i = 0; i < c.lines.length; i++) {
    const m = mask(c.lines[i]).masked;
    const hit = m.match(new RegExp(`^(\\s*)(${ID})\\s*=\\s*(input\\s*\\()`, "u"));
    if (!hit || findWord(c, hit[2]) < 0) continue;
    const start = hit[0].length - hit[3].length;
    const close = matching(m, hit[0].length - 1);
    if (close < 0) continue;
    const text = splice(c.lines[i], start, close + 1, `${conv}(${c.lines[i].slice(start, close + 1)})`);
    return { name: hit[2], fix: { line: i + 1, text } };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Syntaxfehler: Regeln, die die Zeile lesen (vor den Meldungs-Mustern)
// ---------------------------------------------------------------------------

const SYNTAX_RULES = [
  // `\n` oder `\t` außerhalb der Anführungszeichen
  (c) => {
    if (!/^unexpected character after line continuation character/.test(c.message)) return null;
    const bs = c.col - 2;
    if (c.text[bs] !== "\\") return null;
    const spot = { from: bs, to: bs + 2 };
    const ch = c.text[bs + 1];
    if (ch !== "n" && ch !== "t") {
      const gap = /[ \t]/.test(c.text[bs - 1] || "") && /[ \t]/.test(ch) ? 2 : 1;
      return { key: "errx.lineCont", spot, fix: lineFix(c, splice(c.text, bs, bs + gap, "")) };
    }
    const e = "\\" + ch;
    // "A" \n "B"  →  "A\nB"
    const near = /(["'])((?:\\.|(?!\1)[^\\])*)\1\s*\\[nt]\s*(["'])((?:\\.|(?!\3)[^\\])*)\3/g;
    let m;
    while ((m = near.exec(c.text))) {
      if (bs < m.index || bs > m.index + m[0].length) continue;
      const q = m[1];
      if (m[4].includes(q) && m[3] !== q) break;
      return { key: "errx.escapeOutside", params: [e], spot, fix: lineFix(c, splice(c.text, m.index, m.index + m[0].length, q + m[2] + e + m[4] + q)) };
    }
    // sonst in den nächstgelegenen Text davor (oder danach) schieben
    const without = c.text.slice(0, bs).replace(/[ \t]$/, "") + c.text.slice(bs + 2);
    const removedAt = c.text.slice(0, bs).replace(/[ \t]$/, "").length;
    const mm = mask(without).masked;
    let target = -1;
    for (let i = removedAt - 1; i >= 0; i--) if ((mm[i] === '"' || mm[i] === "'") && mm[i - 1] === MASK) { target = i; break; }
    let fix;
    if (target >= 0) fix = splice(without, target, target, e);
    else {
      const after = mm.slice(removedAt).search(/["']/);
      if (after >= 0) fix = splice(without, removedAt + after + 1, removedAt + after + 1, e);
    }
    return { key: "errx.escapeOutside", params: [e], spot, fix: fix ? lineFix(c, fix) : undefined };
  },

  // else if → elif
  (c) => {
    const m = c.masked.match(/^(\s*)else\s+if\b/);
    if (!m) return null;
    let text = splice(c.text, m[1].length, m[0].length, "elif");
    const tmp = { ...c, text, ...mask(text) };
    if (!maskedCode(tmp).endsWith(":")) text = splice(text, codeEnd(tmp), codeEnd(tmp), ":");
    return { key: "errx.elseIf", spot: { from: m[1].length, to: m[0].length }, fix: lineFix(c, text) };
  },

  // If/For/Else großgeschrieben, Befehlswörter aus anderen Sprachen
  (c) => {
    const m = c.masked.match(new RegExp(`^(\\s*)(${ID})`, "u"));
    if (!m) return null;
    const w = m[2];
    const lw = w.toLowerCase();
    const spot = { from: m[1].length, to: m[0].length };
    const fixWith = (py) => lineFix(c, splice(c.text, m[1].length, m[0].length, py));
    if (w !== lw && CASE_WORDS.includes(lw)) {
      return { key: "errx.keywordCase", params: [w, lw], spot, fix: fixWith(lw) };
    }
    if (FOREIGN_BLOCK[lw] && maskedCode(c).endsWith(":")) {
      const py = FOREIGN_BLOCK[lw];
      const hasHead = py !== "else" || previousCode(c).some((i) => /^\s*(if|elif|for|while|try|except)\b/.test(c.lines[i]));
      return { key: "errx.foreignWord", params: [w, py], spot, fix: hasHead ? fixWith(py) : undefined };
    }
    return null;
  },

  // => =< =! <>
  (c) => {
    const m = c.masked.match(/=>|=<|=!|<>/);
    if (!m) return null;
    const right = { "=>": ">=", "=<": "<=", "=!": "!=", "<>": "!=" }[m[0]];
    return { key: "errx.compareOp", params: [m[0], right], spot: { from: m.index, to: m.index + 2 }, fix: lineFix(c, splice(c.text, m.index, m.index + 2, right)) };
  },

  // x++ / x--
  (c) => {
    const m = maskedCode(c).match(new RegExp(`(${ID})\\s*(\\+\\+|--)$`, "u"));
    if (!m) return null;
    const good = `${m[1]} ${m[2][0]}= 1`;
    return { key: "errx.incDec", params: [m[1] + m[2], good], spot: { from: m.index, to: m.index + m[0].length }, fix: lineFix(c, splice(c.text, m.index, m.index + m[0].length, good)) };
  },

  // mein-name = 5
  (c) => {
    const m = c.masked.match(new RegExp(`^(\\s*)(${ID}(?:-${ID})+)(\\s*=)(?!=)`, "u"));
    if (!m || !/^cannot assign to expression/.test(c.message)) return null;
    const good = m[2].replace(/-/g, "_");
    return { key: "errx.hyphenName", params: [good], spot: { from: m[1].length, to: m[1].length + m[2].length }, fix: lineFix(c, splice(c.text, m[1].length, m[1].length + m[2].length, good)) };
  },

  // class = 5, True = 1
  (c) => {
    const m = c.masked.match(new RegExp(`^(\\s*)(${ID})\\s*=(?!=)`, "u"));
    const kw = (m && KEYWORDS.has(m[2]) && m[2]) || (c.message.match(/^cannot assign to (True|False|None)\b/) || [])[1];
    if (!kw) return null;
    const from = c.masked.indexOf(kw);
    return { key: "errx.keywordName", params: [kw], spot: from >= 0 ? { from, to: from + kw.length } : undefined };
  },

  // mein name = "Ada"
  (c) => {
    if (c.message !== "invalid syntax") return null;
    const m = c.masked.match(new RegExp(`^(\\s*)(${ID}(?:[ \\t]+${ID})+)(\\s*)=(?!=)`, "u"));
    if (!m) return null;
    const words = m[2].split(/[ \t]+/);
    if (words.some((w) => KEYWORDS.has(w) || FOREIGN_BLOCK[w.toLowerCase()])) return null;
    const good = words.join("_");
    return { key: "errx.spaceInName", params: [good], spot: { from: m[1].length, to: m[1].length + m[2].length }, fix: lineFix(c, splice(c.text, m[1].length, m[1].length + m[2].length, good)) };
  },

  // for-Zeilen: fehlendes in, "1 to 10", "1..10", range ohne Klammern
  (c) => {
    const code = maskedCode(c);
    if (!/^\s*for\b/.test(code)) return null;
    let m = code.match(new RegExp(`^(\\s*for\\s+${ID}(?:\\s*,\\s*${ID})*)\\s+(?!in\\b)(?=\\S)`, "u"));
    if (m && !/\bin\b/.test(code)) {
      return { key: "errx.forIn", spot: { from: m[0].length, to: m[0].length }, fix: lineFix(c, splice(c.text, m[0].length, m[0].length, "in ")) };
    }
    m = code.match(/\bin\s+(.+?)\s*(?:\.\.|\s(?:to|bis|à|a|fino a|kadar|hasta)\s)\s*(.+?)\s*:$/);
    if (m) {
      const [a, b] = [m[1], m[2]];
      const end = /^\d+$/.test(b) ? String(Number(b) + 1) : `${b} + 1`;
      const good = `range(${a}, ${end})`;
      const from = m.index + m[0].match(/^in\s+/)[0].length;
      const to = code.length - 1;
      return { key: "errx.forTo", params: [good], spot: { from, to }, fix: lineFix(c, splice(c.text, from, to, good)) };
    }
    m = code.match(/\brange[ \t]+(?!\()([^:]+?)\s*:$/);
    if (m) {
      const good = `range(${m[1]})`;
      return { key: "errx.rangeParens", params: [good], spot: { from: m.index, to: m.index + m[0].length - 1 }, fix: lineFix(c, splice(c.text, m.index, m.index + m[0].length - 1, good)) };
    }
    return null;
  },

  // x == 5 and < 10
  (c) => {
    const m = c.masked.match(new RegExp(`(${ID})\\s*(==|!=|<=|>=|<|>)\\s*(\\S+)\\s+(and|or)(\\s+)(?=(==|!=|<=|>=|<|>))`, "u"));
    if (!m) return null;
    const at = m.index + m[0].length;
    const fixed = splice(c.text, at, at, m[1] + " ");
    const tail = mask(fixed).masked.slice(at).match(/^\S+\s*(==|!=|<=|>=|<|>)\s*[^\s:)]+/);
    return { key: "errx.andCompare", params: [tail ? tail[0] : `${m[1]} ${m[6]} …`], spot: { from: at, to: at }, fix: lineFix(c, fixed) };
  },

  // else/elif falsch eingerückt oder ohne if
  (c) => {
    if (c.message !== "invalid syntax") return null;
    const m = c.masked.match(/^(\s*)(else|elif|except|finally)\b/);
    if (!m || c.col !== m[1].length + 1) return null;
    const ind = partnerIndent(c, m[2]);
    const spot = { from: m[1].length, to: m[1].length + m[2].length };
    if (ind === null) return { key: "errx.elseNoIf", params: [m[2]], spot };
    return { key: "errx.elseIndent", params: [m[2]], spot, fix: lineFix(c, withIndent(c.text, ind)) };
  },

  // Apostroph im Text ('C'est'), Anfang und Ende passen nicht ('Hallo")
  (c) => {
    if (!/^unterminated string literal/.test(c.message)) return null;
    const code = codePart(c);
    const first = code.indexOf("'");
    const last = code.lastIndexOf("'");
    if (first >= 0 && last > first) {
      const inner = code.slice(first + 1, last);
      if (/[\p{L}]'[\p{L}]/u.test(inner) && !inner.includes('"') && (code.split("'").length - 1) % 2 === 1) {
        const text = splice(splice(c.text, last, last + 1, '"'), first, first + 1, '"');
        return { key: "errx.apostrophe", spot: { from: first, to: last + 1 }, fix: lineFix(c, text) };
      }
    }
    const s = c.col - 1;
    const q = c.text[s];
    const other = q === '"' ? "'" : '"';
    if ((q === '"' || q === "'") && c.text.slice(s + 1).includes(other) && !c.text.slice(s + 1).includes(q)) {
      return { key: "errx.quoteMismatch", params: [q, other], spot: { from: s, to: s + 1 }, fix: lineFix(c, splice(c.text, s, s + 1, other)) };
    }
    // print(Hallo")  → vorne fehlt das Anführungszeichen
    const words = c.masked.slice(0, s).match(new RegExp(`(?<=[(,=]\\s*)${ID}(?:[ \\t]+${ID})*$`, "u"));
    if ((q === '"' || q === "'") && words && !words[0].split(/[ \t]+/).some((w) => KEYWORDS.has(w) || definedAt(c, w))) {
      const text = splice(c.text, words.index, words.index, q);
      return { key: "errx.needQuotes", params: [words[0], q + words[0] + q], spot: { from: words.index, to: s + 1 }, fix: lineFix(c, text) };
    }
    return null;
  },

  // print("a", end="", "b") → Angaben wie end= ans Ende
  (c) => {
    if (!/^positional argument follows keyword argument/.test(c.message)) return null;
    const { stack } = brackets(c.masked.slice(0, c.col - 1));
    const open = stack.length ? stack[stack.length - 1].i : -1;
    const close = open >= 0 ? matching(c.masked, open) : -1;
    if (close < 0) return { key: "errx.keywordArgOrder" };
    const parts = splitTop(c.masked, open + 1, close);
    const kw = (s) => new RegExp(`^\\s*${ID}\\s*=(?!=)`, "u").test(s);
    const args = parts.map(([a, b]) => c.text.slice(a, b).trim());
    const first = parts.find(([a, b]) => kw(c.text.slice(a, b)));
    const sorted = [...args.filter((a) => !kw(a)), ...args.filter(kw)];
    const spot = first ? { from: first[0] + c.text.slice(first[0]).search(/\S/), to: first[1] } : undefined;
    return { key: "errx.keywordArgOrder", spot, fix: lineFix(c, splice(c.text, open + 1, close, sorted.join(", "))) };
  },

  // if (x > 3:   → Klammer vor dem Doppelpunkt schließen
  (c) => {
    if (c.message !== "invalid syntax" || !BLOCK.test(c.masked)) return null;
    const code = maskedCode(c);
    if (!code.endsWith(":")) return null;
    const { stack } = brackets(code.slice(0, -1));
    if (!stack.length) return null;
    const closers = stack.map((b) => CLOSE[b.ch]).reverse().join("");
    const at = code.length - 1;
    return { key: "errx.closeBeforeColon", params: [closers], spot: { from: at, to: at + 1 }, fix: lineFix(c, splice(c.text, at, at, closers)) };
  },

  // ; zwischen Werten, Komma zu viel, Rechenzeichen ohne Wert, Doppelpunkt zu viel
  (c) => {
    if (c.message !== "invalid syntax" || !c.col) return null;
    const i = c.col - 1;
    const ch = c.masked[i];
    const before = c.masked.slice(0, i).replace(/\s+$/, "");
    const open = brackets(c.masked.slice(0, i)).stack.length > 0;
    if (ch === ";" && open) {
      return { key: "errx.semicolon", spot: { from: i, to: i + 1 }, fix: lineFix(c, splice(c.text, before.length, i + 1, ",")) };
    }
    if (ch === "," && /[([,]$/.test(before)) {
      const after = c.text.slice(i + 1).match(/^\s*/)[0].length;
      return { key: "errx.extraComma", spot: { from: i, to: i + 1 }, fix: lineFix(c, splice(c.text, i, i + 1 + after, "")) };
    }
    const op = before.match(/(\*\*|\/\/|[-+*/%])$/);
    if (op && (OPEN[ch] || i >= codeEnd(c)) && !/[-+*/%]=$/.test(before)) {
      let start = before.length - op[1].length;
      while (start > 0 && /[ \t]/.test(c.text[start - 1])) start--;
      const fix = OPEN[ch] ? lineFix(c, splice(c.text, start, i, "")) : undefined;
      return { key: "errx.missingValue", params: [op[1]], spot: { from: before.length - op[1].length, to: before.length }, fix };
    }
    if (ch === ":" && i === codeEnd(c) - 1 && !BLOCK.test(c.masked) && !open) {
      return { key: "errx.extraColon", spot: { from: i, to: i + 1 }, fix: lineFix(c, splice(c.text, i, i + 1, "")) };
    }
    return null;
  },

  // def gruss:  → def gruss():
  (c) => {
    if (!/^expected '\('/.test(c.message)) return null;
    const m = maskedCode(c).match(new RegExp(`^(\\s*def\\s+${ID})\\s*(:?)$`, "u"));
    if (!m) return null;
    const good = `${m[1].trim()}():`;
    return { key: "errx.defParens", params: [good], spot: { from: m[1].length, to: m[1].length }, fix: lineFix(c, splice(c.text, 0, m[0].length, indentOf(c.text) + good)) };
  },

  // print"Hallo")  → print("Hallo")
  (c) => {
    if (!/^unmatched '\)'/.test(c.message)) return null;
    const m = c.masked.match(new RegExp(`(?<![\\p{L}\\p{N}_.])(${ID})(?=\\s*["'])`, "u"));
    if (!m || KEYWORDS.has(m[1]) || /^[rbfuRBFU]{1,2}$/.test(m[1])) return null;
    const at = m.index + m[1].length;
    return { key: "errx.missingOpenParen", params: [m[1]], spot: { from: at, to: at }, fix: lineFix(c, splice(c.text, at, at, "(")) };
  },

  // Meldungen mit "Maybe you meant '=='": Vergleich, vertauschte Seiten, ungültiges Ziel
  (c) => {
    if (!/Maybe you meant '=='/.test(c.message)) return null;
    if (/^\s*(if|elif|while)\b/.test(c.masked)) {
      const m = c.masked.match(/(?<![=!<>:+\-*/%&|^])=(?!=)/);
      return { key: "errx.compareEq", spot: m ? { from: m.index, to: m.index + 1 } : undefined, fix: m ? lineFix(c, splice(c.text, m.index, m.index + 1, "==")) : undefined };
    }
    if (/^cannot assign to literal/.test(c.message)) {
      const m = maskedCode(c).match(new RegExp(`^(\\s*)(\\S.*?)\\s*=\\s*(${ID})$`, "u"));
      if (m) {
        const good = `${m[3]} = ${c.text.slice(m[1].length, m[1].length + m[2].length)}`;
        return { key: "errx.assignSwap", params: [good], fix: lineFix(c, splice(c.text, m[1].length, codeEnd(c), good)) };
      }
    }
    return { key: "errx.assignTarget" };
  },
];

// ---------------------------------------------------------------------------
// Laufzeitfehler: Regeln mit Blick auf die Zeile und das ganze Programm
// ---------------------------------------------------------------------------

const RUNTIME_RULES = [
  // NameError: Befehl aus einer anderen Sprache (drucke, afficher …)
  (c) => {
    if (c.type !== "NameError" || !c.name) return null;
    const py = FOREIGN_CALL[c.name.toLowerCase()];
    const at = findWord(c, c.name);
    if (!py || at < 0 || !/^\s*\(/.test(c.masked.slice(at + c.name.length))) return null;
    return { key: "errx.foreignWord", params: [c.name, py], spot: { from: at, to: at + c.name.length }, fix: lineFix(c, splice(c.text, at, at + c.name.length, py)) };
  },

  // NameError / AttributeError / ImportError mit Pythons Vorschlag
  (c) => {
    if (!c.suggestion || !["NameError", "AttributeError", "ImportError"].includes(c.type)) return null;
    const wrong = c.type === "ImportError" ? (c.message.match(/cannot import name '([\w.]+)'/) || [])[1] : c.name;
    const at = wrong ? findWord(c, wrong) : -1;
    const shown = c.type === "AttributeError" ? "." + c.suggestion : c.suggestion;
    const spot = at >= 0 ? { from: at, to: at + wrong.length } : undefined;
    return { key: "errx.didYouMean", params: [shown], spot, fix: at >= 0 ? lineFix(c, splice(c.text, at, at + wrong.length, c.suggestion)) : undefined };
  },

  // NameError: Modul nicht importiert
  (c) => {
    const m = c.type === "NameError" && c.message.match(/Did you forget to import '([\w.]+)'/);
    if (!m) return null;
    const at = findWord(c, m[1]);
    return { key: "errx.forgotImport", params: ["import " + m[1]], spot: at >= 0 ? { from: at, to: at + m[1].length } : undefined, fix: { line: 1, text: "import " + m[1], insert: true } };
  },

  // NameError: Name bekommt erst später einen Wert · sollte ein Text sein · unbekannt
  (c) => {
    if (c.type !== "NameError" || !c.name) return null;
    const at = findWord(c, c.name);
    const spot = at >= 0 ? { from: at, to: at + c.name.length } : undefined;
    const def = definedAt(c, c.name);
    if (def > c.line) return { key: "errx.usedBefore", params: [c.name, def], spot };
    // Unbekanntes Wort direkt als Wert in print(…) oder input(…): sollte wohl Text sein
    const call = !def && at >= 0 ? c.masked.match(/(?<![\p{L}\p{N}_.])(?:print|input)\s*\(/u) : null;
    const open = call ? call.index + call[0].length - 1 : -1;
    const close = open >= 0 ? matching(c.masked, open) : -1;
    const arg = close > 0 && open < at && at < close ? splitTop(c.masked, open + 1, close).find(([a, b]) => a <= at && at < b) : null;
    if (arg && new RegExp(`^\\s*${ID}\\s*$`, "u").test(c.text.slice(arg[0], arg[1]))) {
      const good = `"${c.name}"`;
      return { key: "errx.needQuotes", params: [c.name, good], spot, fix: lineFix(c, splice(c.text, at, at + c.name.length, good)) };
    }
    return { key: "errx.nameUnknown", params: [c.name], spot };
  },

  // Modulname großgeschrieben (import Random)
  (c) => {
    const m = c.type === "ModuleNotFoundError" && c.message.match(/^No module named '(\w+)'/);
    if (!m || m[1] === m[1].toLowerCase() || !MODULES.includes(m[1].toLowerCase())) return null;
    const at = findWord(c, m[1]);
    const good = m[1].toLowerCase();
    return { key: "errx.moduleCase", params: [good], spot: at >= 0 ? { from: at, to: at + m[1].length } : undefined, fix: at >= 0 ? lineFix(c, splice(c.text, at, at + m[1].length, good)) : undefined };
  },

  // None statt Wert (liste = liste.sort())
  (c) => {
    if (!/'NoneType'/.test(c.message)) return null;
    for (let i = 0; i < c.lines.length; i++) {
      const m = mask(c.lines[i]).masked.match(new RegExp(`^(\\s*)(${ID})\\s*=\\s*(\\2\\.(?:sort|append|reverse|extend|insert|remove|clear)\\s*\\()`, "u"));
      if (!m) continue;
      const rest = c.lines[i].slice(m[0].length - m[3].length);
      return { key: "errx.noneFromMethod", params: [c.lines[i].trim(), rest.trim()], fix: { line: i + 1, text: m[1] + rest } };
    }
    return { key: "errx.noneValue" };
  },

  // Text und Zahl mit + verbinden → f-String; Zahl aus input() → int(input())
  (c) => {
    const concat = c.message.match(/^can only concatenate str \(not "(\w+)"\) to str/);
    const operand = c.message.match(/^unsupported operand type\(s\) for \+: '(\w+)' and '(\w+)'/);
    if (!concat && !(operand && (operand[1] === "str" || operand[2] === "str"))) return null;
    const fix = fstringFix(c);
    if (fix) return concat ? { key: "errx.concat", params: [concat[1]], fix } : { key: "errx.operand", params: ["+", operand[1], operand[2]], fix };
    const inp = inputNumberFix(c);
    if (inp) return { key: "errx.inputNumber", params: [inp.name, "int(input(…))"], fix: inp.fix };
    return null;
  },

  // Zahl-Vergleich, range(), Index, Malnehmen mit Text aus input()
  (c) => {
    const cmp = c.message.match(/^'[<>]=?' not supported between instances of '(\w+)' and '(\w+)'/);
    const seq = c.message.match(/^can't multiply sequence by non-int of type '(\w+)'/);
    const strInt = /^'str' object cannot be interpreted as an integer/.test(c.message);
    const idx = c.message.match(/^(?:list|string|tuple) indices must be integers(?: or slices)?, not '?(\w+)'?/);
    if (!(cmp && cmp.includes("str")) && !seq && !strInt && !idx) return null;
    const conv = (cmp && cmp.includes("float")) || (seq && seq[1] === "float") ? "float" : "int";
    const inp = inputNumberFix(c, conv);
    if (inp) return { key: "errx.inputNumber", params: [inp.name, `${conv}(input(…))`], fix: inp.fix };
    if (strInt) return { key: "errx.strAsInt" };
    if (idx) return { key: "errx.indexType", params: [idx[1]] };
    return null;
  },

  // 2(3 + 4) → 2 * (3 + 4)
  (c) => {
    if (!/^'(int|float)' object is not callable/.test(c.message)) return null;
    const m = c.masked.match(/(\d)(\s*)\(/);
    if (!m) return null;
    const at = m.index + 1;
    const fixed = splice(c.text, at, at + m[2].length, " * ");
    return { key: "errx.implicitMulParen", params: [fixed.trim()], spot: { from: m.index, to: at + m[2].length + 1 }, fix: lineFix(c, fixed) };
  },

  // liste = liste + 5 → liste.append(5)
  (c) => {
    if (!/^can only concatenate list \(not "\w+"\) to list/.test(c.message)) return null;
    const code = maskedCode(c);
    const m = code.match(new RegExp(`^(\\s*)(${ID})\\s*(?:=\\s*\\2\\s*\\+|\\+=)\\s*(.+)$`, "u"));
    if (!m) return { key: "errx.listConcat", params: [".append(…)"] };
    const good = `${m[2]}.append(${c.text.slice(code.length - m[3].length, code.length)})`;
    return { key: "errx.listConcat", params: [good], fix: lineFix(c, splice(c.text, m[1].length, code.length, good)) };
  },

  // input("Name", x) → input(f"Name {x}")
  (c) => {
    if (!/^input\(\) takes from 0 to 1 positional arguments/.test(c.message)) return null;
    const at = c.masked.search(/(?<![\p{L}\p{N}_.])input\s*\(/u);
    if (at < 0) return { key: "errx.inputArgs", params: ['input(f"… {name} …")'] };
    const open = c.masked.indexOf("(", at);
    const close = matching(c.masked, open);
    const parts = close > 0 ? splitTop(c.masked, open + 1, close) : [];
    const merged = parts.length > 1 ? toFString(parts.map(([a, b]) => c.text.slice(a, b)), " ") : null;
    if (!merged) return { key: "errx.inputArgs", params: ['input(f"… {name} …")'] };
    return { key: "errx.inputArgs", params: [`input(${merged})`], fix: lineFix(c, splice(c.text, open + 1, close, merged)) };
  },

  // int("3.5"), int("3,5"), int("")
  (c) => {
    const m = c.message.match(/^invalid literal for int\(\) with base 10: (.*)$/);
    if (!m) return null;
    const at = c.masked.search(/(?<![\p{L}\p{N}_.])int\s*\(/u);
    const fix = at >= 0 && c.masked.slice(at + 3).search(/(?<![\p{L}\p{N}_.])int\s*\(/u) < 0 ? lineFix(c, splice(c.text, at, at + 3, "float")) : undefined;
    if (/^'\s*'$/.test(m[1])) return { key: "errx.intParseEmpty" };
    if (/^'\s*-?\d+\.\d+\s*'$/.test(m[1])) return { key: "errx.intParseDecimal", params: [m[1]], fix };
    if (/^'\s*-?\d+,\d+\s*'$/.test(m[1])) return { key: "errx.intParseComma", params: [m[1]] };
    return null;
  },

  // Text stückweise ändern, len() einer Zahl, Methoden, die es nicht gibt
  (c) => {
    let m = c.message.match(/^'(\w+)' object does not support item assignment/);
    if (m) return { key: "errx.itemAssign", params: [m[1]] };
    m = c.message.match(/^object of type '(\w+)' has no len\(\)/);
    if (m) return { key: "errx.noLen", params: [m[1]] };
    m = c.type === "AttributeError" && c.message.match(/^'(\w+)' object has no attribute '(\w+)'/);
    if (!m) return null;
    const at = c.masked.indexOf("." + m[2]);
    const spot = at >= 0 ? { from: at + 1, to: at + 1 + m[2].length } : undefined;
    if (m[1] === "str" && m[2] === "append") return { key: "errx.strAppend", spot };
    return { key: "errx.noAttr", params: [m[1], "." + m[2]], spot };
  },
];

// ---------------------------------------------------------------------------
// Korrekturen zu den Meldungs-Mustern in errors.js (Schlüssel → Korrektur)
// ---------------------------------------------------------------------------

const FIXERS = {
  "errx.colon": (c) => {
    const end = codeEnd(c);
    const at = Math.min(Math.max(c.col - 1, 0), end);
    const rest = c.text.slice(at, end);
    return lineFix(c, splice(c.text, at, at, rest.trim() && !/^\s/.test(rest) ? ": " : ":"));
  },
  "errx.neverClosed": (c) => {
    const code = maskedCode(c);
    const head = BLOCK.test(code) && code.endsWith(":");
    const body = head ? code.slice(0, -1) : code;
    const { stack } = brackets(body);
    if (!stack.length || /[,+\-*/([{]\s*$/.test(body)) return undefined;
    const closers = stack.map((b) => CLOSE[b.ch]).reverse().join("");
    const at = body.replace(/\s+$/, "").length;
    return lineFix(c, splice(c.text, at, at, closers));
  },
  "errx.unmatched": (c) => {
    const i = c.col - 1;
    return OPEN[c.text[i]] ? lineFix(c, splice(c.text, i, i + 1, "")) : undefined;
  },
  "errx.mismatch": (c, g) => {
    const i = c.col - 1;
    return OPEN[c.text[i]] && CLOSE[g[1]] ? lineFix(c, splice(c.text, i, i + 1, CLOSE[g[1]])) : undefined;
  },
  "errx.unterminated": (c) => {
    const s = c.col - 1;
    const q = c.text[s];
    if (q !== '"' && q !== "'") return undefined;
    const before = mask(c.text.slice(0, s)).masked;
    let opens = brackets(before).stack.length;
    let at = codeEnd(c);
    if (BLOCK.test(before) && c.text[at - 1] === ":") at--;
    while (opens > 0 && OPEN[c.text[at - 1]] && at - 1 > s) {
      at--;
      opens--;
    }
    return lineFix(c, splice(c.text, at, at, q));
  },
  "errx.smartQuote": (c) => {
    let text = "";
    for (let i = 0; i < c.text.length; i++) {
      const ch = c.text[i];
      const outside = c.masked[i] === ch;
      text += outside && SMART_DOUBLE.test(ch) ? '"' : outside && SMART_SINGLE.test(ch) ? "'" : ch;
    }
    return lineFix(c, text);
  },
  "errx.badChar": (c) => replaceChars(c),
  "errx.nonPrintable": (c) => replaceChars(c),
  "errx.printParens": (c) => {
    const m = maskedCode(c).match(/^(\s*)print\s+(?!\()/);
    if (!m) return undefined;
    const end = codeEnd(c);
    return lineFix(c, `${m[1]}print(${c.text.slice(m[0].length, end)})${c.text.slice(end)}`);
  },
  "errx.comma": (c) => commaFix(c)?.fix,
  "errx.decimal": (c) => decimalFix(c)?.fix,
  "errx.leadingZero": (c) => {
    const i = c.col - 1;
    const m = c.text.slice(i).match(/^0+(\d+)/);
    return m ? lineFix(c, splice(c.text, i, i + m[0].length, m[1])) : undefined;
  },
  "errx.fstringClose": (c) => {
    const i = c.col - 1;
    return i > 0 && i <= c.text.length ? lineFix(c, splice(c.text, i, i, "}")) : undefined;
  },
  "errx.fstringSingle": (c) => {
    const i = c.col - 1;
    if (c.text[i] !== "}") return undefined;
    const m = c.text.slice(0, i).match(new RegExp(`${ID}$`, "u"));
    return m ? lineFix(c, splice(c.text, i - m[0].length, i - m[0].length, "{")) : undefined;
  },
  "errx.indentAfter": (c, g) => indentFix(c, Number(g[1])),
  "errx.indentAfterDef": (c, g) => indentFix(c, Number(g[0])),
  "errx.unexpectedIndent": (c) => {
    const prev = previousCode(c)[0];
    return lineFix(c, withIndent(c.text, prev === undefined ? "" : indentOf(c.lines[prev])));
  },
  "errx.unindent": (c) => {
    const m = c.text.match(/^\s*(else|elif|except|finally)\b/);
    if (m) {
      const ind = partnerIndent(c, m[1]);
      if (ind !== null) return lineFix(c, withIndent(c.text, ind));
    }
    const w = indentOf(c.text).replace(/\t/g, "    ").length;
    const levels = indentLevels(c);
    const best = levels.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a), levels[0]);
    return lineFix(c, withIndent(c.text, " ".repeat(best)));
  },
  "err.TabError.hint": (c) => {
    const code = c.lines.map((l) => l.replace(/^[ \t]+/, (ws) => ws.replace(/\t/g, "    "))).join("\n");
    return code !== c.lines.join("\n") ? { code } : undefined;
  },
};

function replaceChars(c) {
  let text = "";
  for (let i = 0; i < c.text.length; i++) {
    const ch = c.text[i];
    text += c.masked[i] === ch && ch in CHAR_FIX ? CHAR_FIX[ch] : ch;
  }
  return lineFix(c, text);
}

function indentFix(c, headLine) {
  const head = c.lines[headLine - 1];
  if (head === undefined) return undefined;
  const ind = indentOf(head);
  return lineFix(c, withIndent(c.text, ind + (ind.includes("\t") ? "\t" : "    ")));
}

// "Perhaps you forgot a comma?": Komma ergänzen, Text in Anführungszeichen, Zahl ohne Leerzeichen
function commaFix(c) {
  if (!c.col || !c.endCol) return null;
  const a = c.col - 1;
  const b = c.endCol - 1;
  const region = c.text.slice(a, b);
  const re = /[rRbBfFuU]{0,2}(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\d[\d_]*(?:\.\d+)?|[\p{L}_][\p{L}\p{N}_]*(?:\.[\p{L}_][\p{L}\p{N}_]*)*|\S/gu;
  const toks = [...region.matchAll(re)].map((m) => ({ s: m[0], i: m.index }));
  if (toks.length < 2) return null;
  const isWord = (t) => reId.test(t.s) && !KEYWORDS.has(t.s);
  // 1 000 000 (Tausendergruppen) ist eine Zahl, [1, 2 3] dagegen zwei Werte
  if (toks.every((t) => /^\d+$/.test(t.s)) && toks.slice(1).every((t) => t.s.length === 3)) {
    const good = toks.map((t) => t.s).join("");
    return { key: "errx.numberSpace", params: [good, good.replace(/\B(?=(\d{3})+(?!\d))/g, "_")], fix: lineFix(c, splice(c.text, a, b, good)) };
  }
  if (toks.every(isWord)) {
    const joined = toks.map((t) => t.s).join("_");
    if (definedAt(c, joined)) return { key: "errx.spaceInName", params: [joined], fix: lineFix(c, splice(c.text, a, b, joined)) };
    if (!toks.some((t) => definedAt(c, t.s))) {
      const good = `"${region.trim()}"`;
      return { key: "errx.needQuotes", params: [region.trim(), good], fix: lineFix(c, splice(c.text, a, b, good)) };
    }
  }
  const value = (t) => /^[rRbBfFuU]{0,2}["']|^\d|^[\p{L}_]/u.test(t.s) && !KEYWORDS.has(t.s);
  let out = region;
  for (let k = toks.length - 1; k > 0; k--) {
    const l = toks[k - 1];
    const r = toks[k];
    const gap = region.slice(l.i + l.s.length, r.i);
    if (/^\s+$/.test(gap) && (value(l) || /[)\]}]$/.test(l.s)) && (value(r) || /^[([{]/.test(r.s))) {
      out = splice(out, l.i + l.s.length, r.i, ", ");
    }
  }
  return out !== region ? { key: "errx.comma", fix: lineFix(c, splice(c.text, a, b, out)) } : null;
}

// "invalid decimal literal": 2x → 2 * x, 1spieler = … → spieler1
function decimalFix(c) {
  const i = c.col - 1;
  const m = c.text.slice(i).match(/^(\d+)([\p{L}_][\p{L}\p{N}_]*)/u);
  if (!m) return null;
  const startOfLine = i === indentOf(c.text).length && /^\s*=(?!=)/.test(c.text.slice(i + m[0].length));
  if (startOfLine) {
    const good = m[2] + m[1];
    return { key: "errx.digitName", params: [good], fix: lineFix(c, splice(c.text, i, i + m[0].length, good)) };
  }
  const good = `${m[1]} * ${m[2]}`;
  return { key: "errx.implicitMul", params: [good], fix: lineFix(c, splice(c.text, i, i + m[0].length, good)) };
}

// Regeln, die einen anderen Schlüssel als das Meldungs-Muster liefern
const PATTERN_OVERRIDES = {
  "errx.comma": commaFix,
  "errx.decimal": decimalFix,
};

// ---------------------------------------------------------------------------
// Öffentliche Schnittstelle (für errors.js)
// ---------------------------------------------------------------------------

export function makeContext(err, code) {
  const lines = String(code || "").replace(/\r/g, "").split("\n");
  const line = err.line && err.line >= 1 && err.line <= lines.length ? err.line : null;
  const text = line ? lines[line - 1] : "";
  return {
    type: err.type || "Error",
    message: err.message || "",
    line,
    col: err.col || null,
    endCol: err.endCol || null,
    name: err.name || null,
    suggestion: err.suggestion || null,
    text,
    lines,
    ...mask(text),
  };
}

const SYNTAX_TYPES = ["SyntaxError", "IndentationError", "TabError"];

// Zuerst die Regeln, die die Zeile lesen
export function ruleHelp(c) {
  if (!c.line) return null;
  const rules = SYNTAX_TYPES.includes(c.type) ? (c.type === "SyntaxError" ? SYNTAX_RULES : []) : RUNTIME_RULES;
  for (const rule of rules) {
    const r = rule(c);
    if (r) return r;
  }
  return null;
}

// Korrektur (und ggf. genauerer Schlüssel) zu einem Treffer der Meldungs-Muster
export function patternHelp(c, key, groups) {
  if (!c.line) return null;
  const over = PATTERN_OVERRIDES[key];
  if (over) return over(c);
  const fixer = FIXERS[key];
  const fix = fixer ? fixer(c, groups) : undefined;
  return fix ? { key, fix } : null;
}

// Letzter Versuch bei "invalid syntax": die markierte Stelle benennen
export function fallbackHelp(c) {
  if (c.type !== "SyntaxError" || c.message !== "invalid syntax" || !c.line || !c.col) return null;
  const from = c.col - 1;
  const to = c.endCol && c.endCol > c.col ? c.endCol - 1 : c.col;
  const tok = c.text.slice(from, to).trim();
  if (!tok || from >= codeEnd(c)) return { key: "errx.invalidEnd" };
  return { key: "errx.invalidAt", params: [tok] };
}

// Stelle des Fehlers in der Zeile (0-basiert) aus Pythons Spaltenangaben
export function defaultSpot(c) {
  if (!c.line || !c.col) return undefined;
  if (c.type !== "SyntaxError") {
    const ind = indentOf(c.text).length;
    return ind ? { from: 0, to: ind } : undefined;
  }
  const from = c.col - 1;
  const to = c.endCol && c.endCol > c.col ? c.endCol - 1 : from + 1;
  return { from: Math.min(from, c.text.length), to: Math.min(to, c.text.length) };
}

// Korrektur anwenden (für Tests und die Vorschau)
export function applyFix(code, fix) {
  const lines = String(code).replace(/\r/g, "").split("\n");
  if (fix.code !== undefined) return fix.code;
  if (fix.insert) lines.splice(fix.line - 1, 0, fix.text);
  else lines[fix.line - 1] = fix.text;
  return lines.join("\n");
}
