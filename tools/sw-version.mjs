// PyQuest – Cache-Version des Service Workers pflegen.
//
//   node tools/sw-version.mjs          VERSION in sw.js auf den aktuellen Hash setzen
//   node tools/sw-version.mjs --check  nur prüfen (Exit 1, wenn veraltet oder Dateien fehlen)
//
// Die Version ist ein Hash über alle Dateien der CORE-Liste. Ändert sich eine App-Datei,
// ändert sich die Version, und Browser laden beim nächsten Besuch die neue Fassung.
// Außerdem wird geprüft, dass jede App-Datei (src/, content/) in CORE steht – sonst
// würde sie offline fehlen.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const check = process.argv.includes("--check");
const swPath = join(ROOT, "sw.js");
const sw = readFileSync(swPath, "utf8");

const block = sw.match(/const CORE = \[([\s\S]*?)\];/);
if (!block) throw new Error("CORE-Liste in sw.js nicht gefunden");
const core = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const fileOf = (url) => join(ROOT, url === "/" ? "index.html" : url.slice(1));

const problems = [];
for (const url of core) if (!existsSync(fileOf(url))) problems.push(`CORE-Datei fehlt auf der Platte: ${url}`);

// Jede ausgelieferte App-Datei muss in CORE stehen
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
for (const dir of ["src", "content"]) {
  for (const file of walk(join(ROOT, dir))) {
    if (!/\.(js|mjs|css|py)$/.test(file)) continue;
    const url = "/" + relative(ROOT, file).split("\\").join("/");
    if (!core.includes(url)) problems.push(`nicht in CORE (fehlt offline): ${url}`);
  }
}

const hash = createHash("sha1");
for (const url of core) {
  hash.update(url + "\0");
  if (existsSync(fileOf(url))) hash.update(readFileSync(fileOf(url)));
}
const version = hash.digest("hex").slice(0, 10);
const current = (sw.match(/const VERSION = "([^"]*)"/) || [])[1];

if (check) {
  if (current !== version) problems.push(`VERSION in sw.js ist veraltet (${current} statt ${version}) – node tools/sw-version.mjs ausführen`);
  if (problems.length) {
    console.log(problems.map((p) => "✗ " + p).join("\n"));
    process.exit(1);
  }
  console.log(`Service Worker aktuell (VERSION ${version}, ${core.length} Dateien). ✓`);
} else {
  writeFileSync(swPath, sw.replace(/const VERSION = "[^"]*"/, `const VERSION = "${version}"`));
  console.log(`VERSION = ${version}` + (problems.length ? "\n" + problems.map((p) => "✗ " + p).join("\n") : ""));
  if (problems.length) process.exit(1);
}
