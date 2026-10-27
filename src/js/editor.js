// Codaluna – Code-Editor (CodeMirror 5, global per <script> geladen).
// Anfängerfreundliche Tastenbelegung für Python:
//   Tab / Shift+Tab   Einrücken / Ausrücken (auch für markierte Zeilen)
//   Rücktaste         löscht in der Einrückung bis zur vorigen 4er-Stufe
//   Strg/Cmd+Enter    Ausführen · Strg/Cmd+/ Kommentar an/aus · Strg/Cmd+S speichern
//   Esc               Editor verlassen (Tastatur-Navigation)

const CM = () => window.CodeMirror;
const INDENT = 4;

// Rücktaste in führenden Leerzeichen: bis zur vorigen Einrückungsstufe löschen.
function smartBackspace(cm) {
  if (cm.somethingSelected()) return CM().Pass;
  const cur = cm.getCursor();
  const before = cm.getLine(cur.line).slice(0, cur.ch);
  if (cur.ch > 0 && /^ +$/.test(before)) {
    const del = ((cur.ch - 1) % INDENT) + 1;
    cm.replaceRange("", { line: cur.line, ch: cur.ch - del }, cur, "+delete");
    return undefined;
  }
  return CM().Pass;
}

// Tab mit Markierung rückt die Zeilen ein (löscht nie markierten Text),
// ohne Markierung werden Leerzeichen bis zur nächsten 4er-Stufe eingefügt.
function tab(cm) {
  if (cm.somethingSelected()) cm.indentSelection("add");
  else cm.execCommand("insertSoftTab");
}

// Zeilen (Auswahl oder aktuelle Zeile) aus-/einkommentieren.
function toggleComment(cm) {
  const ranges = cm.listSelections();
  cm.operation(() => {
    for (const r of ranges) {
      let from = Math.min(r.anchor.line, r.head.line);
      let to = Math.max(r.anchor.line, r.head.line);
      // Endet die Auswahl am Zeilenanfang, gehört die Zeile nicht dazu.
      const end = r.anchor.line > r.head.line ? r.anchor : r.head;
      if (to > from && end.ch === 0) to--;
      const lines = [];
      for (let l = from; l <= to; l++) lines.push(cm.getLine(l));
      const filled = lines.filter((s) => s.trim());
      const allCommented = filled.length > 0 && filled.every((s) => /^\s*#/.test(s));
      const indent = Math.min(...filled.map((s) => s.match(/^\s*/)[0].length), Infinity);
      for (let l = from; l <= to; l++) {
        const text = cm.getLine(l);
        if (!text.trim()) continue;
        if (allCommented) {
          const m = text.match(/^(\s*)# ?/);
          cm.replaceRange(m[1], { line: l, ch: 0 }, { line: l, ch: m[0].length });
        } else {
          const at = Number.isFinite(indent) ? indent : 0;
          cm.replaceRange("# ", { line: l, ch: at });
        }
      }
    }
  });
}

// Typografische Anführungszeichen (z. B. von Handy-Tastaturen) außerhalb von
// Strings durch gerade ersetzen – sonst meldet Python "invalid character".
function straightenQuotes(cm, change) {
  if (change.origin !== "+input") return;
  const text = change.text.join("\n");
  if (!/[“”„‟«»‘’‚‛]/.test(text)) return;
  // Mitten in einem abgeschlossenen Text bleiben sie erhalten (z. B. „Zitat“ in einem String).
  const token = cm.getTokenAt(change.from, true);
  if (token && token.type && token.type.includes("string") && change.from.ch < token.end) {
    const body = token.string.replace(/^[rRbBuUfF]*/, "");
    const q = body[0];
    const closed = (q === '"' || q === "'") && body.length >= 2 && body.endsWith(q) && !body.endsWith("\\" + q);
    if (closed) return;
  }
  change.update(
    change.from,
    change.to,
    change.text.map((s) => s.replace(/[“”„‟«»]/g, '"').replace(/[‘’‚‛]/g, "'"))
  );
}

export function createEditor(host, { value = "", label = "", onChange, onRun, onSave } = {}) {
  const cm = CM()(host, {
    value,
    mode: "python",
    lineNumbers: true,
    indentUnit: INDENT,
    tabSize: INDENT,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: false,
    smartIndent: true,
    electricChars: true,
    spellcheck: false,
    autocorrect: false,
    autocapitalize: false,
    extraKeys: {
      Tab: tab,
      "Shift-Tab": (c) => c.indentSelection("subtract"),
      Backspace: smartBackspace,
      "Ctrl-Enter": () => onRun && onRun(),
      "Cmd-Enter": () => onRun && onRun(),
      "Ctrl-/": toggleComment,
      "Cmd-/": toggleComment,
      "Ctrl-S": () => onSave && onSave(),
      "Cmd-S": () => onSave && onSave(),
      Esc: (c) => c.getInputField().blur(),
    },
  });
  cm.setSize("100%", "100%");
  cm.on("beforeChange", straightenQuotes);

  let timer = null;
  cm.on("changes", () => {
    clearErrorLine(cm);
    if (!onChange) return;
    clearTimeout(timer);
    timer = setTimeout(() => onChange(cm.getValue()), 400);
  });

  setEditorLabel(cm, label);
  return cm;
}

export function setEditorLabel(cm, label) {
  if (label) cm.getInputField().setAttribute("aria-label", label);
}

// Inhalt ersetzen, ohne dass "Rückgängig" in den Code der vorigen Lektion springt.
export function loadCode(cm, code) {
  cm.setValue(code);
  cm.clearHistory();
  clearErrorLine(cm);
}

// Fehlerzeile hervorheben (1-basiert) und in den sichtbaren Bereich holen.
// spot {from, to}: die genaue Stelle in der Zeile (0-basiert), wird zusätzlich markiert.
export function markErrorLine(cm, line, spot) {
  clearErrorLine(cm);
  if (!line || line < 1 || line > cm.lineCount()) return;
  const handle = cm.addLineClass(line - 1, "wrap", "cm-error-line");
  cm.state.pqErrorLine = handle;
  const len = cm.getLine(line - 1).length;
  if (spot && spot.to > spot.from && spot.from < len) {
    cm.state.pqErrorSpot = cm.markText(
      { line: line - 1, ch: spot.from },
      { line: line - 1, ch: Math.min(spot.to, len) },
      { className: "cm-error-spot" }
    );
  }
  cm.scrollIntoView({ line: line - 1, ch: 0 }, 60);
}

export function clearErrorLine(cm) {
  const handle = cm.state.pqErrorLine;
  if (handle) {
    cm.removeLineClass(handle, "wrap", "cm-error-line");
    cm.state.pqErrorLine = null;
  }
  if (cm.state.pqErrorSpot) {
    cm.state.pqErrorSpot.clear();
    cm.state.pqErrorSpot = null;
  }
}

// Korrektur aus der Fehlerkarte übernehmen (fixes.js). Bleibt mit Strg+Z rückgängig zu machen.
export function applyFix(cm, fix) {
  const line = Math.max(1, Math.min(fix.line || 1, cm.lineCount()));
  if (fix.code !== undefined) cm.setValue(fix.code);
  else if (fix.insert) cm.replaceRange(fix.text + "\n", { line: line - 1, ch: 0 });
  else cm.replaceRange(fix.text, { line: line - 1, ch: 0 }, { line: line - 1, ch: cm.getLine(line - 1).length });
  cm.focus();
  cm.setCursor({ line: line - 1, ch: cm.getLine(line - 1).length });
}

export function gotoLine(cm, line) {
  if (!line) return;
  cm.focus();
  cm.setCursor({ line: line - 1, ch: cm.getLine(line - 1) ? cm.getLine(line - 1).search(/\S|$/) : 0 });
  cm.scrollIntoView(null, 60);
}
