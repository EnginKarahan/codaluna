# Fremdkomponenten

PyQuest liefert die folgenden Bibliotheken und Schriften unverändert in `vendor/` mit, damit die
App ohne externe Ressourcen und offline läuft. Sie stehen unter ihren eigenen Lizenzen, nicht unter
der Lizenz von PyQuest. Die Lizenztexte liegen jeweils neben den Dateien.

| Komponente | Version | Lizenz | Dateien | Lizenztext | Quelle |
|---|---|---|---|---|---|
| Pyodide | 0.26.4 | MPL-2.0 | `vendor/pyodide/` | `vendor/pyodide/LICENSE.txt` | [github.com/pyodide/pyodide (0.26.4)](https://github.com/pyodide/pyodide/tree/0.26.4) |
| CPython (in Pyodide, inkl. `python_stdlib.zip`) | 3.12.1 | PSF-2.0 | `vendor/pyodide/` | `vendor/pyodide/LICENSE-CPython.txt` | [github.com/python/cpython (v3.12.1)](https://github.com/python/cpython/tree/v3.12.1) |
| Emscripten-Laufzeit (in Pyodide) | 3.1.58 | MIT oder NCSA | `vendor/pyodide/pyodide.asm.js` | `vendor/pyodide/LICENSE-Emscripten.txt` | [github.com/emscripten-core/emscripten (3.1.58)](https://github.com/emscripten-core/emscripten/tree/3.1.58) |
| CodeMirror | 5.65.16 | MIT | `vendor/codemirror/` | `vendor/codemirror/LICENSE.txt` | [github.com/codemirror/codemirror5](https://github.com/codemirror/codemirror5/tree/5.65.16) |
| supabase-js (mit auth-js, functions-js, postgrest-js, realtime-js, storage-js) | 2.110.7 | MIT | `vendor/supabase/supabase.js` | `vendor/supabase/LICENSE.txt` | [github.com/supabase/supabase-js](https://github.com/supabase/supabase-js) |
| iceberg-js (in supabase.js) | 0.8.1 | MIT | `vendor/supabase/supabase.js` | `vendor/supabase/LICENSE.txt` | [npmjs.com/package/iceberg-js](https://www.npmjs.com/package/iceberg-js) |
| @supabase/phoenix (in supabase.js) | 0.4.5 | MIT | `vendor/supabase/supabase.js` | `vendor/supabase/LICENSE.txt` | [npmjs.com/package/@supabase/phoenix](https://www.npmjs.com/package/@supabase/phoenix) |
| tslib (in supabase.js) | 2.8.1 | 0BSD | `vendor/supabase/supabase.js` | `vendor/supabase/LICENSE.txt` | [github.com/microsoft/tslib](https://github.com/microsoft/tslib) |
| Atkinson Hyperlegible Next | | OFL-1.1 | `vendor/fonts/atkinson-next-*.woff2` | `vendor/fonts/OFL-atkinson-hyperlegible-next.txt` | [github.com/googlefonts/atkinson-hyperlegible-next](https://github.com/googlefonts/atkinson-hyperlegible-next) |
| JetBrains Mono | | OFL-1.1 | `vendor/fonts/jetbrains-mono-*.woff2` | `vendor/fonts/OFL-jetbrains-mono.txt` | [github.com/JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) |

Das npm-Paket von Pyodide gibt in seiner `package.json` Apache-2.0 an. Maßgeblich ist hier die
Lizenzdatei des Pyodide-Repositorys zum Stand 0.26.4 (MPL-2.0). Der Quelltext von Pyodide ist
unter dem oben genannten Link erhältlich.
