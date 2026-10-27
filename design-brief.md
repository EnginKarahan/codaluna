# Codaluna – Design-Brief

> **Zweck:** Übergabe an Gestalter:innen (Mensch oder KI) für visuelle Weiterentwicklung.
> Beschreibt den **aktuellen** Stand (Oktober 2026, nach der UX-Prüfung), die **Rahmenbedingungen** und den
> **Klassennamen-Vertrag**, damit Lieferungen drop-in passen.
> Mitgeben: dieses Dokument, Screenshots (Desktop, Mobil Aufgabe/Code, Fehler-Karte,
> Erfolgs-Karte, Fortschritt-Dialog) und optional `src/css/design.css` + `src/css/app.css`.

---

## 1. Was ist Codaluna?

Eine Web-Lernapp, mit der **echter Python-Code direkt im Browser** geschrieben und ausgeführt
wird (Pyodide). Zielgruppe: **Jugendliche ab 12 Jahren** und mitlernende Erwachsene. Lernpfad
aus Kapiteln und Lektionen mit Editor, Konsole, Aufgabe, gestaffelten Tipps, Bonus-Aufgabe,
automatischer Prüfung mit Rückmeldung und dezenter Gamification (XP, Level, Wochenziel, Abzeichen,
Diplom). Sechs Sprachen, offline-fähig (PWA), Open-Source-tauglich.

## 2. Zielgruppe, Ton & Inklusion (nicht verhandelbar)

- **Modern und aufgeräumt, nicht verkindlicht.** Keine Comic-Optik, aber auch kein generischer
  Vorlagen-Look (siehe Abschnitt 7, Gestaltungsregeln).
- **Neutral und inklusiv** (Mädchen und Jungen, ohne Gender-Trennung): kein Klischee-„Hacker-Dark“
  (Matrix-Grün, Neon), kein „Pink/Prinzessin“. Ruhig, warm, sachlich („ambient belonging“).
- Gamification bleibt **selbstbezogen** (du gegen gestern), **keine** Ranglisten, **keine** Käufe,
  Zufallsbelohnungen oder Verlust-Mechaniken (Wochenziel statt Streak). Leitplanken: `docs/spielend-lernen.md`.
- Begleitfigur **Lumo** (Wartungsdrohne, Hexagon wie das Logo, kein Geschlecht, nie tadelnd).
- Ermutigender Ton, Fehler sind normal – Fehler- und Erfolgs-Karten sind Kernstücke.
- Das Coden steht im Mittelpunkt; die Oberfläche darf keine eigene Lernkurve erzeugen.

## 3. Technische Rahmenbedingungen

1. **Vanilla, kein Build-Step.** HTML/CSS/JS, Styling über CSS Custom Properties und klassisches CSS.
2. **Offline, alles self-contained.** Keine externen Ressourcen; Fonts als vendorte `woff2`:
   Atkinson Hyperlegible Next (variabel 200–800, latin + latin-ext, OFL) für Oberfläche und Text,
   JetBrains Mono für Code. Icons sind eigene Inline-SVGs aus `src/js/icons.js`.
3. **Dark ist Standard**, Light-Theme über `:root[data-theme="light"]`. Header, Werkzeugleiste
   und Konsole bleiben in beiden Themes dunkel (deshalb dort feste Farbwerte statt Tokens).
4. **Editor = CodeMirror 5** (Token-Klassen `.cm-keyword` usw.; Fehlerzeile `.cm-error-line`, genaue Fehlerstelle `.cm-error-spot`).
5. **Responsiv 320–1600 px**: Desktop drei Bereiche; ≤960 px Sidebar als Drawer und Tabs
   „Aufgabe | Code“; ≤600 px Icon-Toolbar (Ausführen bleibt beschriftet). Kein horizontaler
   Overflow. Mobile: `100dvh`, Safe-Area-Ränder, 16 px Schrift in Eingaben (kein iOS-Zoom).
6. **Barrierefreiheit**: sichtbarer `:focus-visible`-Ring, Dialoge mit Fokusführung (Tab bleibt
   im Dialog, Escape schließt), `aria-live` für Konsole und Hinweise, `prefers-reduced-motion`.

## 4. Design-Tokens (Auszug aus `design.css`)

```css
--bg:#161513; --bg-tint:#1b1a17; --surface:#211f1c; --surface-2:#2a2824; --surface-3:#35322d;
--border:#3a3732; --border-soft:#2b2925; --border-strong:#4d4942; --bg-deep:#100f0d;
--text:#eeebe4; --text-muted:#bdb8ad; --text-faint:#949086;   /* alle ≥ 4,5:1 auf jeder Fläche */
--accent:#f2a93b; --accent-ink:#f2b45a; --teal:#3ccfb0; --teal-ink:#4fd6b8;
--warning:#e9c46a; --danger:#f2826f; --on-accent:#1a1306;
--chrome:#121110; --chrome-line:#2b2925;   /* Kopf, Werkzeugleiste, Konsole (immer dunkel) */
--font:"Atkinson Hyperlegible Next"; --display:var(--font); --mono:"JetBrains Mono";
--r-sm:4px; --r-md:6px; --r-lg:10px; --header-h:56px; --sidebar-w:280px;
```

## 5. Layout

- **Desktop:** Header über `[ Sidebar | Lektion (≥320 px/40 %) | Editor + Konsole ]`.
- **Header:** Logo + Marke · Statistik-Knopf (Wochenziel-Punkte, Level, XP-Balken → öffnet
  „Fortschritt & Abzeichen“) · Sprache · Ton · Hell/Dunkel · Installieren (nur wenn möglich) · Offline · Tour.
- **Sidebar:** Spielplatz ganz oben, dann Kapitel (Label, Titel, Zähler „3/6“) mit Lektionen als
  verbundene Journey-Linie (Knoten: Nummer, ✓, 🔒, ★ Boss, 🏁 Finale, 🧠 für gelöste Boni),
  unten Fortschritt, Konto, Sichern/Laden/Löschen, Rechtslinks.
- **Lektion:** Kicker (automatisch: „Lektion 6“, „Boss · Kapitel 2“, „Finale“) + „✓ Geschafft“,
  Titel, Erklärung, Aufgabe, Tipp-Knopf (deckt Tipps nacheinander auf), aufklappbare
  Bonus-Aufgabe, unten Zurück/Weiter.
- **Editor-Spalte:** Werkzeugleiste (Ausführen mit Ladezustand, Stop, Zurücksetzen, Lösung),
  CodeMirror, Konsole (Kopf mit Status „läuft …/wartet auf Eingabe/prüft …“ und Leeren-Knopf,
  Ausgabe, Eingabezeile mit Senden-Knopf).

## 6. Komponenten

- Buttons `.btn`, `.btn-primary`, `.btn-danger`, `.btn-danger-solid`, `.btn-ghost`; runde
  Icon-Buttons `.help-btn`; `[aria-disabled="true"]` für „noch nicht verfügbar“.
- **Fehler-Karte** `.err-card`: `.err-title` (Icon, Titel, Zeilen-Knopf `.where`),
  `.err-msg` (konkrete Erklärung), `.err-code` (betroffene Zeile `.err-line` mit `<mark>` an der
  Fehlerstelle, darunter `.err-line.fix` mit `<ins>` für den geänderten Teil; `.gap` = Einfügestelle),
  `.err-fix-bar` mit `.btn-fix` („Übernehmen“), `.err-orig` (Originalmeldung), `<details>.err-details` (Traceback).
  Rot (Koralle) markiert den Fehler, Teal den Vorschlag.
- **Ergebnis-Karten** `.result-card.ok|.hint|.bonus|.warn` mit `.rc-title`, `.rc-text`,
  `.rc-actions` (z. B. „Weiter: … →“).
- **Toasts** `#toasts > .toast.ok|.fail|.info|.badge` (Stapel oben mittig).
- **Bonus-Aufgabe** `.expert(.open|.solved)` mit `.expert-toggle`, `.xp-chip`, `.expert-body`.
- **Dialoge** `.modal-overlay > .modal` (+ `.confirm-modal`, `.progress-modal`, `.auth-modal`,
  `.diploma-modal`, `.welcome-modal`), linksbündig, Knöpfe rechts; lange Dialoge haben oben
  rechts ein Schließen-Kreuz `.modal-x` (`openModal({closeButton: true})`). „Schließen“ ist nie
  der Hauptknopf. Tour `.tour/.tour-spot/.tour-card`.
- **Fortschritt** `.pg-level`, `.pg-stats`, `.badge-grid > .badge(.earned)`.

## 7. Was erhalten bleiben soll

Eigene Identität (warmes Graphit, Amber + Teal, Hexagon-Logo `>_`, Journey-Sidebar, Lumo,
Atkinson Hyperlegible Next + JetBrains Mono), die Fehler- und Erfolgs-Karten, die klare Struktur,
das Responsive-Verhalten.

**Gestaltungsregeln „Stationskonsole“ (Oktober 2026).** Sie entstanden aus der UX-Prüfung
(`docs/ux-pruefung.md`), weil die Oberfläche vorher wie ein generiertes Template wirkte.

- Keine Emojis in der Oberfläche (Knöpfe, Titel, Karten, Abzeichen, Toasts). Icons kommen aus
  `src/js/icons.js` (20er-Raster, 1,6 px Linie); neue Icons dort im selben Stil ergänzen.
  Emojis in Kursinhalten und Beispiel-Ausgaben (`print("🎉")`) sind erlaubt.
- Keine Verläufe, kein Leuchten (`box-shadow` in Farbe, `text-shadow`, `drop-shadow`), kein
  `backdrop-filter`. Schatten nur für schwebende Ebenen (Dialoge, Menüs, Toasts).
- Farbe hat Bedeutung: Amber = Handlung und „hier bist du“, Teal = Lumo und „geschafft“,
  Koralle = Fehler, Gelb = Tipp. Keine zusätzliche Akzentfarbe.
- Flächen und 1px-Linien statt Karten in Karten; keine farbigen Randstreifen links.
- Keine Pillen-Chips und keine gesperrten Großbuchstaben-Labels; Labels in normaler Schreibweise.
- Kleine Radien (4/6/10 px). Sechseck nur dort, wo es Bedeutung trägt (Logo, Level, Abzeichen).
- Text links ausgerichtet, auch in Dialogen; Lesetext 16 px.

## 8. Klassennamen-Vertrag (vom JavaScript erwartet)

```
#app .header .brand .logo .name .header-spacer
#stats-btn .stats-btn .stat[data-kind=week](.met) .week-dots > i(.on) .stat-label .val #week-val #sound-btn
.xp-wrap #level-badge .level-badge .xp-bar #xp-fill .xp-fill
#menu-btn #lang-btn #lang-menu .lang-wrap .lang-menu .lang-opt(.active)
#theme-btn #install-btn #offline-btn(.done) #help-btn .help-btn
.body #sidebar .sidebar(.open) #scrim .scrim
.lesson-item(.first/.last/.active/.done/.locked/.boss/.final/.sandbox-item) > .mark + .title (+ .bonus-star)
.chapter-title > .ch-label .ch-name .ch-count · .sidebar-footer .side-action(.danger) .side-account .acct-email .side-legal
#workspace .workspace(.show-code) #mtabs .mtabs .mtab(.active)
#lesson-pane .lesson-pane .lesson-head .lesson-kicker(.sandbox) .lesson-done .lesson-body .task h2
.hint-box .hint .hint-n .hint-btn · .expert(.open/.solved) .expert-toggle .expert-head .label .xp-chip .sub .chev .expert-body .expert-note
.lesson-nav #prev-lesson #next-lesson
#editor-col .editor-col .toolbar .btn(.btn-primary/.btn-danger/.btn-ghost) .btxt .spacer #run-btn(.loading) .run-ico #run-label
#editor-host .editor-host .CodeMirror (+ .cm-* Token-Klassen, .cm-error-line, .cm-error-spot)
.console .console-head .dot(.running/.input/.verify) #console-status .console-status #console-clear .console-clear
#console-out .console-out (span.err/.in/.info/.placeholder)
.err-card .err-title .ico .txt .where .err-msg .err-code .err-line .err-line.fix .ln .gap .err-fix-bar .btn-fix .err-orig .err-details
.result-card(.ok/.hint/.bonus/.warn) .rc-title .rc-text .rc-actions
#console-input .console-input(.show) .prompt #console-input-field #console-input-send .input-send
#toasts .toasts .toast(.show/.ok/.fail/.info/.badge) · .boot(.hide) .spinner .big · .offline-toast(.show)
.modal-overlay(.gate) .modal .modal-logo .modal-actions · .tour .tour-spot .tour-card .tour-step .tour-actions
```

**Spielend lernen (Oktober 2026), zusätzlich:**

```
.icon .icon-<name> (icons.js) · [data-icon] (Platzhalter in index.html) · .modal-x · .toast .toast-ico · .toast.lock
.lumo(.lumo-idle/-think/-listen/-happy/-proud/-curious/-glitch/-sleep) > .lumo-body .lumo-hull .lumo-visor .lumo-eye .lumo-rotor
#buddy .buddy (Lumo im Konsolenkopf) · .result-card.talk .buddy-ico · .result-card.pause
.try-btn · pre.can-try · .story(.boss) .story-lumo .story-text .story-who .story-jump · .region-banner .rb-icon
.lesson-kicker.boss · .lesson-item.map-entry · .strand-head · .chapter-title.side .ch-icon
.stage-card .stage-screen .stage-info .stage-world .stage-world-info .eq · #share-btn .share-link
.fx-layer .fx-spark .fx-xp .fx-pulse .fx-level .fx-level-card .fx-level-n
.progress-modal .pg-goal .goal-opt(.active) .badge.secret · .workshop-modal .ws-grid .ws-opt(.active/.locked) .ws-swatch .ws-lumo
.map-modal .map-frame .map-svg .map-ground .map-node(.offline/.partly/.online/.locked/.flash) .map-list .map-item · .region-modal
:root[data-skin=amber|night|aurora|sunset|mono] (Editor-Farben) · --lumo-light (Lumos Licht)
```

## 9. Bereits gelöst – bitte nicht zurückdrehen

Kontraste (Sekundärtext AA), Responsive ohne Overflow, Fokus-Ring, `aria`-Beschriftungen in allen
Sprachen, Heading-Reihenfolge, Bestätigungsdialoge (Lösung laden, Zurücksetzen, Fortschritt
löschen), Lock-Hinweise, `[hidden]` wird nicht von `display`-Regeln überschrieben,
Startbildschirm blockiert nicht mehr bis Python geladen ist, emojifreie Oberfläche mit eigenem
Icon-Satz, eine Schrift für alle Geräte (vorher fiel der Fließtext auf die jeweilige System-Schrift zurück).

## 10. Liefer-Format

1. `design.css` (Tokens, Basis, Buttons, CodeMirror-Farben) und `app.css` (Komponenten) mit den
   Klassennamen aus Abschnitt 8.
2. Neue Schriften nur als `woff2` mit Bezugsquelle (offline vendorbar).
3. Kurze Begründung der wichtigsten Entscheidungen (2–5 Sätze).
4. Struktur-Änderungen nur, wenn unvermeidbar – dann genau auflisten.
