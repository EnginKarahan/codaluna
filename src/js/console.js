// Codaluna – Konsole: Programmausgabe, Eingabezeile für input() und Ergebnis-Karten.
// Ausgabe wird gesammelt und höchstens einmal pro Frame in den DOM geschrieben,
// damit auch Programme mit sehr viel Ausgabe die Oberfläche nicht einfrieren.

const KIND_CLASS = { o: "", p: "", e: "err", in: "in", info: "info" };

export function createConsole({ out, inputRow, inputField }) {
  let queue = [];
  let frame = 0;
  let last = null; // zuletzt beschriebener Span {node, kind}

  const nearBottom = () => out.scrollHeight - out.scrollTop - out.clientHeight < 64;

  function removePlaceholder() {
    const ph = out.querySelector(":scope > .placeholder");
    if (ph) ph.remove();
  }

  function render() {
    frame = 0;
    if (!queue.length) return;
    const stick = nearBottom();
    removePlaceholder();
    for (const [text, kind] of queue) {
      if (last && last.kind === kind && last.node.isConnected && last.node.firstChild) {
        last.node.firstChild.appendData(text);
      } else {
        const span = document.createElement("span");
        if (KIND_CLASS[kind]) span.className = KIND_CLASS[kind];
        span.textContent = text;
        out.appendChild(span);
        last = { node: span, kind };
      }
    }
    queue = [];
    if (stick) out.scrollTop = out.scrollHeight;
  }

  function write(text, kind = "o") {
    if (!text) return;
    queue.push([String(text), kind]);
    if (!frame) frame = requestAnimationFrame(render);
  }

  function flushNow() {
    if (frame) cancelAnimationFrame(frame);
    render();
  }

  function clear() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    queue = [];
    last = null;
    out.textContent = "";
  }

  function placeholder(text) {
    clear();
    const ph = document.createElement("span");
    ph.className = "placeholder";
    ph.textContent = text;
    out.appendChild(ph);
  }

  // Karte (Fehler, Erfolg, Hinweis) unter die Ausgabe hängen.
  function append(node) {
    flushNow();
    removePlaceholder();
    // Karte beginnt immer in einer neuen Zeile
    if (out.lastChild && out.lastChild.nodeType === 1 && out.lastChild.tagName === "SPAN") {
      const txt = out.lastChild.textContent;
      if (txt && !txt.endsWith("\n")) write("\n");
      flushNow();
    }
    out.appendChild(node);
    last = null;
    out.scrollTop = out.scrollHeight;
  }

  // Sorgt dafür, dass der Anfang einer Karte sichtbar ist (z. B. "Geschafft!"),
  // auch wenn danach noch weitere Karten angehängt wurden.
  function reveal(node) {
    if (!node || !node.isConnected) return;
    const top = node.getBoundingClientRect().top - out.getBoundingClientRect().top;
    if (top < 0) out.scrollTop += top - 8;
  }

  function showInput() {
    inputRow.classList.add("show");
    inputField.value = "";
    inputField.focus({ preventScroll: false });
    out.scrollTop = out.scrollHeight;
  }

  function hideInput() {
    inputRow.classList.remove("show");
  }

  return { write, flushNow, clear, placeholder, append, reveal, showInput, hideInput };
}
