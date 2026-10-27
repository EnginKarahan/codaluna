// PyQuest – Werkzeuge für Lektions-Prüfungen (App UND Testsuite nutzen diese Datei).
//
// Eine Prüfung bekommt einen Kontext `r` und liefert need(...)-Ergebnis:
//   r.out      Ausgabe des Programms OHNE input()-Prompts
//   r.lines    nicht-leere Ausgabezeilen (rechts getrimmt)
//   r.inputs   eingegebene Zeilen · r.prompts  gezeigte Fragen
//   r.code     Code · r.unchanged  true, wenn das Programm dem Start-Code entspricht
//   r.ast      Struktur (Aufrufe, Schleifen, if/else, f-Strings …), Kommentare zählen nicht
//   r.tests    versteckte Prüfläufe (je: ok, out, lines, inputs, value, error, timeout …)
//   r.screen   Bildschirm der Station: {size, pixels: {"x,y": "#rrggbb"}, lit, colors}
//   r.music    gespielte Töne [{k: "note"|"drum", n, at, d, f}] · r.tones(k)  Anzahl
//   r.drone    Lumo auf dem Eisfeld: {x, y, d, goal, crystals, total, left, steps, crashed} oder null
//   r.call(n) / r.method(n) / r.node(n)   Anzahl im Code · r.num(x)  Zahl x in der Ausgabe?
//
// need([bedingung, "feedbackSchlüssel", {params}], …) liefert den ersten nicht erfüllten
// Punkt als Rückmeldung. Bedingungen dürfen Funktionen sein (werden erst dann ausgewertet).
// Schlüssel mit "fb." sind allgemeine UI-Texte, alle anderen stehen in lesson.feedback.

export function lines(text) {
  return String(text || "")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .filter((l) => l.trim().length > 0);
}

export function numbers(text) {
  return (String(text || "").match(/-?\d+(?:[.,]\d+)?/g) || []).map((x) => parseFloat(x.replace(",", ".")));
}

export function hasNumber(text, n) {
  return numbers(text).some((x) => Math.abs(x - n) < 1e-9);
}

// Länge in sichtbaren Zeichen (Emojis zählen als eins)
export function width(text) {
  return [...String(text || "")].length;
}

export function leadingSpaces(line) {
  return line.length - line.replace(/^ +/, "").length;
}

const EMPTY_AST = {
  syntax: false,
  unchanged: false,
  nodes: {},
  calls: {},
  methods: {},
  callsInLoop: {},
  imports: [],
  defs: [],
  userCalls: 0,
  compares: 0,
  elifs: 0,
  elses: 0,
  loopDepth: 0,
  printArgs: [],
  selfUpdates: 0,
  fstringFields: 0,
  fstringExprs: [],
  listLens: [],
  dictLens: [],
  negIndex: 0,
  strKeys: 0,
  subStore: 0,
  printCalls: [],
  newlineStrings: 0,
  strAssigns: {},
  opsWithNames: {},
  forIters: [],
  listDicts: 0,
  codeLines: 0,
};

// Prüflauf-Ergebnis vervollständigen, damit Prüfungen nie auf fehlende Felder stoßen
function withLines(test) {
  const t = test || {};
  const out = typeof t.out === "string" ? t.out : "";
  return { ...t, out, lines: lines(out), chunks: Array.isArray(t.chunks) ? t.chunks : [], inputs: t.inputs || [] };
}

// Bildschirm-Zusammenfassung (fehlt, wenn das Programm nichts gezeichnet hat)
export function screenOf(result) {
  const s = (result && result.screen) || {};
  const pixels = s.pixels && typeof s.pixels === "object" ? s.pixels : {};
  return { size: s.size || 16, pixels, lit: Object.keys(pixels).length, colors: new Set(Object.values(pixels)).size };
}

// Kontext aus einem Laufergebnis bauen. tests: Ergebnisse der versteckten Prüfläufe.
export function makeContext({ code = "", starter = "", result = {}, tests = null }) {
  const ast = { ...EMPTY_AST, ...(result.analysis || {}) };
  const out = result.out || "";
  const music = Array.isArray(result.music) ? result.music : [];
  return {
    drone: result.drone || null,
    screen: screenOf(result),
    music,
    tones: (kind) => music.filter((m) => !kind || m.k === kind).length,
    code,
    starter,
    out,
    stdout: result.stdout || "",
    lines: lines(out),
    prompts: result.prompts || [],
    inputs: result.inputs || [],
    ast,
    unchanged: !!ast.unchanged,
    tests: (tests || []).map(withLines),
    call: (name) => ast.calls[name] || 0,
    method: (name) => ast.methods[name] || 0,
    node: (name) => ast.nodes[name] || 0,
    num: (n, text = out) => hasNumber(text, n),
  };
}

export function need(...rules) {
  for (const rule of rules) {
    const [cond, feedback, params] = rule;
    const ok = typeof cond === "function" ? cond() : cond;
    if (!ok) return { passed: false, feedback: feedback || "fb.generic", params: params || null };
  }
  return { passed: true };
}

// Alle Prüfläufe ohne Fehler, Zeitüberschreitung oder fehlende Eingaben?
export function testsRun(r) {
  for (const test of r.tests) {
    if (test.timeout || test.limit) return [false, "fb.testTimeout"];
    if (test.exhausted) return [false, "fb.testExhausted"];
    if (test.error) return [false, "fb.testError", { err: test.error.type }];
    if (!test.ok) return [false, "fb.generic"];
  }
  return [true];
}

// Häufige Bausteine als fertige Regeln
export const rules = {
  changed: (r) => [!r.unchanged, "fb.unchanged"],
  output: (r) => [r.lines.length > 0 || r.screen.lit > 0 || r.music.length > 0 || !!(r.drone && r.drone.steps), "fb.noOutput"],
  print: (r) => [r.call("print") > 0, "fb.needPrint"],
  minLines: (r, n) => [r.lines.length >= n, "fb.needLines", { n }],
  input: (r, n = 1) => [r.call("input") >= n, n > 1 ? "fb.needInputs" : "fb.needInput", { n }],
  fstring: (r) => [r.node("JoinedStr") > 0, "fb.needFString"],
  ifStmt: (r) => [r.node("If") > 0, "fb.needIf"],
  elseBlock: (r) => [r.ast.elses > 0, "fb.needElse"],
  elif: (r) => [r.ast.elifs > 0, "fb.needElif"],
  forLoop: (r) => [r.node("For") > 0, "fb.needFor"],
  whileLoop: (r) => [r.node("While") > 0, "fb.needWhile"],
  def: (r) => [r.node("FunctionDef") > 0, "fb.needDef"],
  ret: (r) => [r.ast.defs.some((d) => d.returns), "fb.needReturn"],
  list: (r, n = 1) => [r.ast.listLens.some((len) => len >= n), "fb.needList", { n }],
  dict: (r, n = 1) => [r.ast.dictLens.some((len) => len >= n), "fb.needDict", { n }],
  importRandom: (r) => [r.ast.imports.includes("random"), "fb.needImportRandom"],
  station: (r) => [r.ast.imports.includes("station"), "fb.needStation"],
  pixels: (r, n) => [r.screen.lit >= n, "fb.needPixels", { n }],
  colors: (r, n) => [r.screen.colors >= n, "fb.needColors", { n }],
  tones: (r, n) => [r.music.length >= n, "fb.needTones", { n }],
  // Drohne: Ziel erreicht, alle Kristalle eingesammelt, auch in den versteckten Testwelten
  goal: (r) => [!!(r.drone && r.drone.goal), "fb.droneGoal"],
  crystals: (r) => [!!(r.drone && r.drone.left === 0), "fb.droneCrystals", { n: r.drone ? r.drone.left : 0 }],
  worlds: (r, crystals = false) => [
    r.tests.every((t) => t.ok && t.drone && t.drone.goal && (!crystals || t.drone.left === 0)),
    "fb.droneWorlds",
  ],
  tests: (r) => testsRun(r),
};

// Python-Code lesbar in JS notieren: py`…` entfernt die gemeinsame Einrückung,
// Backslashes bleiben wörtlich erhalten (\n im Python-Code bleibt \n).
export function py(strings, ...values) {
  const text = String.raw({ raw: strings.raw }, ...values).replace(/^\n/, "");
  const rows = text.split("\n");
  if (rows.length && rows[rows.length - 1].trim() === "") rows.pop();
  const filled = rows.filter((l) => l.trim());
  const indent = filled.length ? Math.min(...filled.map((l) => l.match(/^ */)[0].length)) : 0;
  return rows.map((l) => l.slice(indent)).join("\n") + "\n";
}
