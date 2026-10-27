# PyQuest – Mehrsprachige Python-Lernapp (offline-first)

## Stand 16.10.2026 (Überarbeitung)

Umgesetzt ist Phase 1 vollständig und Phase 2 vorbereitet (Supabase-Login, standardmäßig aus).
Abweichungen vom ursprünglichen Plan (bewusst): **kein Build-Step** (Vanilla-ES-Module statt
Vite/Svelte) und **CodeMirror 5** statt 6 – beides für Offline-Robustheit und Einfachheit.
Zielgruppe ist inzwischen „Jugendliche ab 12“.

Die Überarbeitung im Oktober 2026 hat die Ausführung und die Prüfungen neu gebaut:

- **Laufzeit** `src/py/pqrt.py`: frischer Namensraum je Lauf, Ausgabe-/Zeitgrenzen (Endlosschleifen
  frieren nichts mehr ein), `exit()` als normales Ende, strukturierte Fehler, AST-Analyse,
  versteckte Prüfläufe. Worker bündelt die Ausgabe; Stop wirkt sofort, auch bei `input()`.
- **Prüfungen** sprachneutral (Code-Struktur, Testläufe mit Eingaben/Zufall/Funktionsaufrufen)
  mit konkreter Rückmeldung; jede Lektion hat eine prüfbare Bonus-Aufgabe mit Lösung.
- **Kurs** auf 26 Lektionen überarbeitet; Start-Code besteht nie ohne eigene Arbeit.
- **Tests** mit richtigen und falschen Lösungen je Lektion und Sprache (`npm test`).
- **Editor** für Anfänger (Einrücken, Kommentieren, Autosave, Fehlerzeile), verständliche
  Fehlermeldungen, Abzeichen, Spielplatz, Fortschritt v2 (XP berechnet, Streak nach Übungstagen).
- **Offline**: Pyodide-Cache überlebt Updates, Service Worker setzt COOP/COEP bei Bedarf.

Offene Ideen: Klassenmodus für Lehrkräfte (ohne Konten), Season 2, Android als Trusted Web
Activity (eine Capacitor-WebView kann keine Cross-Origin-Isolation und damit kein `input()`).

---

## Ziel
Jugendliche übers **selbst Programmieren** an Python heranführen, Erwachsene lernen mit. Dafür
eine **brauchbare, erweiterbare Lernplattform**, die

- **nicht auf 4 Wochen festgelegt** ist → beliebig neue Kapitel/Themen/Übungen ergänzbar,
- **mehrsprachig** ist (DE, EN, FR, IT, TR, ES),
- **echten Python-Code im Browser** ausführt und spielerisch bindet (XP/Streak/Abzeichen),
- **offline** funktioniert (auch bei schlechter oder fehlender Verbindung),
- als **Open Source** veröffentlicht werden kann.

Entscheidungen: **Phasiert** · **Backend-Ziel Supabase**.

**Grundsatz Secrets:** Der *Code* darf öffentlich sein, die **geheimen Keys nie** (nur
`.env`/Server-Env; der `publishable`-Key ist harmlos).

---

## Leitprinzipien (Architektur)
1. **Offline-first & backend-optional.** Die App läuft vollständig im **Gast-Modus**
   (Fortschritt in `localStorage`), **ohne** Login/Backend. Ein **austauschbarer
   `SyncProvider`** (`LocalProvider` jetzt, `SupabaseProvider` in Phase 2) kapselt alles
   Konten-/Sync-bezogene. Kein harter Backend-Zwang.
2. **Inhalt = Daten, beliebig erweiterbar.** Kurse/Kapitel/Lektionen liegen als validierte
   Datendateien vor (Schema + Autoren-Guide). Neue Themen = neue Datei, **kein** Eingriff in
   den App-Kern. Kein fester 4-Wochen-Rahmen — Fortschritt über **Freischalten**, nicht Kalender.
3. **Mehrsprachig von Anfang an.** UI-Strings und Lektionsinhalte lokalisierbar (6 Sprachen).
   Python-Code bleibt sprachneutral; nur Prosa/Anleitungen werden übersetzt.
4. **Secrets nie im Repository.** Secrets ausschließlich in `.env`/Server-Env; `.env.example`
   mit Platzhaltern; `.gitignore` schützt Secrets.
5. **YAGNI/phasiert.** Jede Phase ist eigenständig lauffähig und für sich nützlich.

---

## Tech-Stack
- **Frontend:** Leichter Build mit **Vite** (statischer Export → offline/PWA & OSS-Build).
  Komponenten mit **Svelte** *(oder Vanilla + Web Components — entscheiden wir beim Start)*.
  Ein Build-Step ist jetzt gerechtfertigt (i18n, Routing, mehrere Kurse, spätere Auth).
- **Python im Browser: Pyodide**, **lokal einvendort** (kein CDN → offline), im **Web-Worker**:
  UI friert bei Endlosschleifen nicht ein; **Stopp/Timeout** via Interrupt-Buffer;
  **`input()`** echt via `Atomics.wait` + In-App-Konsolen-Eingabe; `stdout/stderr` abgefangen,
  Tracebacks kindgerecht gekürzt/erklärt. Braucht **COOP/COEP-Header** (`same-origin` /
  `require-corp`) → lokal per `serve.py`, online per Host-Headers (`_headers`/`.htaccess`).
- **Editor: CodeMirror 6** (Python-Mode) eingebunden über Vite.
- **Backend-Ziel (P2): Supabase** — Auth + Postgres (Fortschritt/Konten), Row-Level-Security
  pro Nutzer; das Frontend bleibt statisch.

---

## Kurs-Engine & Erweiterbarkeit
Datenmodell: **Course → Chapter → Lesson**. Eine Lektion enthält: `id`, Titel, Erklärungs-Text
(lokalisierbar), `starterCode`, **Aufgaben** mit Prüf-Logik (Ausgabe-/Assertion-Checks), Tipps
(gestaffelt), Musterlösung, optionaler **`extra`-Block** (Bonus-Aufgabe: schwererer Twist am selben
Beispiel), XP, verliehene Abzeichen. Kurse werden über einen **Katalog** registriert; neue
Kurse/Kapitel = neue Dateien. Ein kleines **Validierungs-Skript** prüft Schema & Vollständigkeit
(inkl. fehlender Übersetzungen). **Autoren-Guide** im README, damit sich Kapitel ohne Eingriff in
den Kern ergänzen lassen.

---

## Mehrsprachigkeit (DE, EN, FR, IT, TR, ES)
- UI-Strings in Locale-Dateien; Lektionsprosa je Sprache. Sprache umschaltbar, Auswahl gespeichert.
- Realistischer Weg: **DE zuerst vollständig**, Struktur/Keys für alle 6 Sprachen vorhanden,
  Übersetzungen **schrittweise** befüllbar (Fallback auf DE/EN bei Lücke, vom Validator sichtbar).

---

## Offline / PWA
- **Installierbare PWA** (`manifest` + Service Worker): App-Shell + Pyodide + aktueller Kurs
  werden gecached; weitere Kapitel **on demand**.
- **„📥 Für offline vorbereiten"**: lädt online alles (Pyodide + gewählte Kurse) in den Cache.
- Fortschritt bleibt offline in `localStorage`; **Export/Import** als JSON (Backup/Gerätewechsel);
  bei Login (P2) späterer Cloud-Sync.

---

## Gamification / Bindung
Lernpfad-/Kapitel-Karte mit Fortschritt, **XP + Level**, **Streak-Flamme**, **Abzeichen**,
Freischalt-Mechanik, **Kapitel-Boss-Projekte**, **Diplom/Zertifikat** je Kurs, jederzeit
erreichbarer **Spielplatz (Sandbox)**.

---

## Launch-Kurs „Season 1: Python-Starter" (Inhalt)
Präsentiert als **Kapitel** (nicht Kalendertage). Beispiele aus **Games, Musik/Minecraft/Technik,
Fußball**. Umfang ~28 Lektionen in 4 Kapiteln, je mit Boss + Bonus-Aufgaben.

- **Kap. 1 – Erste Befehle & Worte:** `print`, Variablen, `input`, f-strings, Rechnen.
  (Gamer-Tag, Highscore merken, Begrüßungs-Bot, Fußball-Punkterechner, Beat-Maker.)
  *Boss:* Fan-Card-/Steckbrief-Bot.
- **Kap. 2 – Entscheidungen & Wiederholungen:** `if/else`, bool, `random`, `for`, `while`.
  (Türsteher, Redstone-Logik, **Elfmeter-Simulator**, Minecraft-Muster, Schere-Stein-Papier.)
  *Boss:* **Zahlenraten** „zu hoch/tief" + Versuchszähler *(Bonus: Tipp-Heuristik/Bestwert)*.
- **Kap. 3 – Sammlungen & eigene Befehle:** Listen, `for`-über-Listen, `def`, `return`, `dict`.
  (Team-Aufstellung/Playlist/Inventar, Torschützenliste, `wuerfeln()`, Crafting-Rezepte.)
  *Boss:* **Text-Adventure** (Räume, Entscheidungen, Inventar).
- **Kap. 4 – Alles zusammen:** Game-Loop, **Caesar-Verschlüsselung**, ASCII-/Turtle-Zeichnen,
  Bundesliga-Tabellenrechner, Debuggen/Aufräumen. *Boss/Finale:* eigenes Projekt + **Diplom**.

---

## Repo-Struktur (ursprünglich geplant)
```
pyquest/
  app/                    # Frontend (Vite)
    src/ (UI, Editor, Runner, i18n, SyncProvider-Interface, LocalProvider)
    public/vendor/pyodide/…   # Pyodide lokal (offline)
    public/manifest.webmanifest, sw.js
  content/                # Kurse/Kapitel/Lektionen (Daten, i18n)
    courses/season-1/…    ; schema.md ; validate.mjs
  backend/                # ab Phase 2 — Keys NICHT im Repo
    supabase/ (migrations)
  serve.py                # lokaler Server mit COOP/COEP
  .env.example            # nur Platzhalter   |   .gitignore schützt .env
  README.md               # Start, Autoren-Guide, Deploy, Beitrag
  LICENSE                 # z. B. MIT
```

---

## Phasenplan (jede Phase eigenständig lauffähig)
**Phase 1 – Lern-App (jetzt).** Frontend + Kurs-Engine + Pyodide-Worker (`input`/Stopp) +
i18n-Gerüst (DE komplett, 6 Sprachen strukturell) + Season-1-Inhalt + Gamification +
PWA/Offline + Gast-Modus + Export/Import. **Ergebnis:** sofort nutzbar (auch offline);
als statische Site deploybar; als Open Source veröffentlichbar.

**Phase 2 – Konten & Cloud-Sync.** Supabase-Auth (Login/Registrierung, mehrsprachig),
`SupabaseProvider` als `SyncProvider` → Fortschritt/Code geräteübergreifend; Gast-Modus bleibt
als Fallback. Frontend bleibt statisch; Supabase-JS-Client + RLS.

---

## Verifikation (End-to-End)
1. `serve.py` starten → App lädt Pyodide **aus `vendor/`** (keine CDN-Calls); Mission 1 (`print`)
   läuft, Aufgabe wird erkannt, XP steigt, nächste Lektion öffnet.
2. **`input()` + `while`**: Zahlenraten-Boss durchspielen (Eingabe-Balken, Schleife bis richtig).
3. **Stopp/Timeout**: `while True: pass` sauber abbrechbar, App bleibt nutzbar.
4. **Bonus-Aufgabe**: ein-/ausblendbar, prüft korrekt.
5. **i18n**: Sprache auf EN/TR umschalten → UI wechselt; Fallback bei fehlender Übersetzung;
   `content/validate.mjs` meldet Lücken.
6. **Offline**: „Für offline vorbereiten" → DevTools „Offline" → Neuladen: App+Python+Kurs laufen,
   Fortschritt erhalten. Export/Import-JSON funktioniert.
7. **Erweiterbarkeit**: neues Test-Kapitel als Datei hinzufügen → erscheint ohne Code-Änderung.
8. *(P2)* Login → Fortschritt synct auf zweitem Gerät.

---

## Umsetzungsreihenfolge (Phase 1)
1. Vite-Projekt + Theme + Kapitel-Karte + Routing (Dummy-Inhalt).
2. Pyodide-Worker + CodeMirror + Konsole (run/stop/stdout) — ohne `input()`.
3. `input()`-Bridge (Atomics) + COOP/COEP (`serve.py`) — Kern-Coding-Erlebnis steht.
4. Kurs-Engine (Schema, Katalog, Validator) + Aufgaben-Prüfung + Fortschritt/XP/Streak/Abzeichen.
5. i18n-Gerüst; Season-1-Inhalt DE (inkl. Bonus-Aufgaben) → **früh mit Jugendlichen der Zielgruppe testen**.
6. PWA/Service Worker + „Für offline vorbereiten" + Export/Import; Diplom-Seite; Feinschliff.
7. Als statische Site deployen (Header für COOP/COEP setzen) + README/OSS-Vorbereitung.
