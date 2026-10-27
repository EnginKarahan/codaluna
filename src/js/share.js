// Codaluna – Projekte per Link teilen. Der Code steckt komprimiert im Link-Anker (#p=…):
// kein Server, kein Konto, kein Chat. Ein geteilter Link öffnet sich im Spielplatz und
// wird nie automatisch ausgeführt (siehe app.js).

export const SHARE_PREFIX = "#p=";
export const MAX_CODE = 20000; // Zeichen Code
export const MAX_TOKEN = 12000; // Zeichen im Link
const MAX_BYTES = 256 * 1024; // Schutz gegen „Zip-Bomben“ beim Entpacken

function toB64Url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(text) {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) throw new Error("kein base64url");
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function readAll(stream, limit) {
  const reader = stream.getReader();
  const parts = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      reader.cancel().catch(() => {});
      throw new Error("zu groß");
    }
    parts.push(value);
  }
  const out = new Uint8Array(size);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

const transform = (bytes, stream) => new Blob([bytes]).stream().pipeThrough(stream);

// Code -> Link-Token. Erstes Zeichen: "1" = deflate-raw, "0" = unkomprimiert (alte Browser)
export async function encodeCode(code) {
  const data = new TextEncoder().encode(String(code));
  if (typeof CompressionStream === "undefined") return "0" + toB64Url(data);
  return "1" + toB64Url(await readAll(transform(data, new CompressionStream("deflate-raw")), MAX_BYTES));
}

export async function decodeCode(token) {
  const kind = token.charAt(0);
  const bytes = fromB64Url(token.slice(1));
  let data;
  if (kind === "0") data = bytes;
  else if (kind === "1") data = await readAll(transform(bytes, new DecompressionStream("deflate-raw")), MAX_BYTES);
  else throw new Error("unbekanntes Format");
  const code = new TextDecoder("utf-8", { fatal: true }).decode(data);
  if (code.length > MAX_CODE) throw new Error("zu lang");
  return code;
}

// Token aus dem Link-Anker oder null
export function shareToken(hash) {
  return typeof hash === "string" && hash.startsWith(SHARE_PREFIX) ? hash.slice(SHARE_PREFIX.length) : null;
}

export function shareUrl(token, loc = window.location) {
  return loc.origin + loc.pathname + SHARE_PREFIX + token;
}
