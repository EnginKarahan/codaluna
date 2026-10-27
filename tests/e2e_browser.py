#!/usr/bin/env python3
"""Codaluna – Browser-Test (Ende zu Ende) mit Playwright.

Startet serve.py auf einem freien Port und bedient die App wie eine Lernende:
Ausführen, Fehler, Erfolg, Weiter, input(), Stop, Endlosschleife, Editor-Tasten,
Fortschritt nach Neuladen, Sprachwechsel, Mobilansicht.

    pip install playwright && python3 -m playwright install chromium
    python3 tests/e2e_browser.py              # Ergebnis in der Konsole
    python3 tests/e2e_browser.py --shots DIR  # zusätzlich Screenshots

Eigenes Chromium:  CODALUNA_CHROMIUM=/pfad/zu/chrome python3 tests/e2e_browser.py
"""
import argparse
import asyncio
import os
import socket
import subprocess
import sys
import time

from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
results = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("✓ " if ok else "✗ ") + name + (f"  ({detail})" if detail and not ok else ""))


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


async def set_code(page, code):
    await page.evaluate("(c) => document.querySelector('.CodeMirror').CodeMirror.setValue(c)", code)


async def get_code(page):
    return await page.evaluate("document.querySelector('.CodeMirror').CodeMirror.getValue()")


async def console_text(page):
    return await page.evaluate("document.querySelector('#console-out').innerText")


async def wait_idle(page, timeout=30):
    """Wartet, bis der Ausführen-Knopf wieder aktiv ist (Python bereit, nichts läuft)
    und die Konsole ihre gesammelte Ausgabe gezeichnet hat (sie rendert pro Frame)."""
    t0 = time.time()
    while time.time() - t0 < timeout:
        if not await page.evaluate("document.querySelector('#run-btn').disabled"):
            await page.evaluate("new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))")
            await asyncio.sleep(0.05)
            return time.time() - t0
        await asyncio.sleep(0.05)
    return None


async def run(page, code=None, timeout=30):
    if code is not None:
        await set_code(page, code)
    await page.click("#run-btn")
    await asyncio.sleep(0.15)
    return await wait_idle(page, timeout)


async def desktop(browser, base, shots):
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
    page = await ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    stats = []  # Tests (auch gegen die Live-Seite) dürfen Statistik und Fehlerberichte nicht füllen
    page.on("request", lambda r: stats.append(r.url) if "stats." in r.url else None)

    t0 = time.time()
    await page.goto(base + "/")
    await page.wait_for_selector("#boot.hide", timeout=20000)
    check("Startbildschirm verschwindet schnell", time.time() - t0 < 5, f"{time.time() - t0:.1f}s")
    welcome = await page.query_selector(".welcome-modal")
    check("Willkommensdialog beim ersten Start", welcome is not None)
    if welcome:
        await page.click("[data-skip]")
    ready = await wait_idle(page, 60)
    check("Python wird geladen", ready is not None)
    week = await page.inner_text('.stat[data-kind="week"] .val')
    check("Kopfzeile zeigt das Wochenziel statt einer Streak", week.strip() == "0/3", week)
    check("Lumo sitzt im Konsolenkopf", await page.query_selector("#buddy .lumo") is not None)
    check("Lumo erzählt den Missions-Aufhänger", await page.query_selector("#lesson-pane .story .lumo") is not None)
    check("Erste Mission zeigt den Bereich der Station", await page.query_selector("#lesson-pane .region-banner") is not None)
    await page.click('.lesson-item[data-act="map"]')
    await page.wait_for_selector(".map-modal .map-svg", timeout=3000)
    check("Stationskarte zeigt alle Bereiche", await page.evaluate("document.querySelectorAll('.map-modal .map-node').length") >= 4)
    await page.keyboard.press("Escape")

    # Lektion 1: Start-Code unverändert -> Hinweis statt Erfolg
    await run(page)
    check("Unveränderter Start-Code besteht nicht", await page.query_selector(".result-card.hint") is not None)
    # Lösung ohne vorherigen Versuch? (Versuch ist erfolgt -> Lösung darf geladen werden)
    await run(page, 'print("Ich lerne Python!")\n')
    ok_card = await page.query_selector(".result-card.ok")
    check("Eigene Nachricht besteht Lektion 1", ok_card is not None, await console_text(page))
    check("Lumo spricht die Erfolgskarte", await page.query_selector(".result-card.ok .lumo-happy") is not None)
    week = await page.inner_text('.stat[data-kind="week"] .val')
    check("Ein Lauf zählt als Übungstag", week.strip() == "1/3", week)
    if shots:
        await page.screenshot(path=os.path.join(shots, "desktop-success.png"))
    check("Sidebar markiert Lektion 1 als erledigt", await page.query_selector('.lesson-item.done[data-id="s1-l1"]') is not None)
    # Bonus-Aufgabe (ohne versteckte Tests) im selben Zug lösen
    await page.click("#expert-toggle")
    await run(page, 'print("Hallo", "Welt!", "\\nZweite Zeile")\n')
    check("Bonus-Aufgabe wird erkannt", await page.query_selector(".result-card.bonus") is not None, await console_text(page))
    check("Bonus erscheint in der Lektion als gelöst", await page.query_selector(".expert.solved") is not None)
    await page.click(".result-card.ok .btn-primary")
    await asyncio.sleep(0.2)
    title = await page.inner_text("#lesson-pane h1")
    check("Weiter-Knopf öffnet Lektion 2", "Variablen" in title, title)

    # „▶ Ausprobieren“ führt das Beispiel aus, ohne den Editor anzufassen
    await set_code(page, "# mein Code\n")
    await page.click(".lesson-body .try-btn")
    await asyncio.sleep(0.15)
    await wait_idle(page)
    txt = await console_text(page)
    check("Ausprobieren führt das Beispiel in der Konsole aus", "7" in txt and await get_code(page) == "# mein Code\n", txt[:120])
    check("Ausprobieren prüft nicht", await page.query_selector(".result-card.ok, .result-card.hint") is None)

    # Ton-Schalter
    await page.click("#sound-btn")
    check("Ton lässt sich ausschalten", await page.get_attribute("#sound-btn", "aria-pressed") == "false")
    await page.click("#sound-btn")
    check("Ton lässt sich einschalten", await page.get_attribute("#sound-btn", "aria-pressed") == "true")

    # Fehlerkarte + markierte Zeile
    await run(page, 'lieblingszahl = 7\nprnt(lieblingszahl)\n')
    check("Fehlerkarte erscheint", await page.query_selector(".err-card") is not None)
    txt = await console_text(page)
    check("Fehler erklärt Tippfehler (Meintest du print?)", "print" in txt and "Meintest" in txt, txt[:200])
    check("Fehlerzeile im Editor markiert", await page.query_selector(".cm-error-line") is not None)
    if shots:
        await page.screenshot(path=os.path.join(shots, "desktop-error.png"))
    await run(page, "lieblingszahl = 7\nprint(lieblingszahl)\n")
    check("Behobener Fehler besteht Lektion 2", await page.query_selector(".result-card.ok") is not None)

    # Korrekturvorschlag: Stelle markieren, Vorschlag zeigen, mit einem Klick übernehmen
    await page.click('.lesson-item[data-id="sandbox"]')
    await run(page, 'print("hallo", "wie geht es Dir?" \\n "sagt der fremde Mann.")\n')
    mark = await page.text_content(".err-card .err-line mark") if await page.query_selector(".err-card .err-line mark") else ""
    check("Fehlerkarte markiert die Stelle (\\n)", mark == "\\n", mark)
    check("Stelle ist auch im Editor markiert", await page.query_selector(".cm-error-spot") is not None)
    check("Fehlerkarte zeigt einen Vorschlag", await page.query_selector(".err-card .err-line.fix ins") is not None)
    await page.click(".err-card [data-apply]")
    code = await get_code(page)
    check("Übernehmen korrigiert die Zeile", code == 'print("hallo", "wie geht es Dir?\\nsagt der fremde Mann.")\n', code)
    await run(page, code)
    txt = await console_text(page)
    check("Korrigierter Code läuft", await page.query_selector(".err-card") is None and "sagt der fremde Mann." in txt, txt[:120])

    # print ohne Zeilenumbruch und frischer Namensraum
    await page.click('.lesson-item[data-id="sandbox"]')
    await run(page, 'print("abc", end="")\n')
    check("Ausgabe ohne Zeilenumbruch erscheint sofort", (await console_text(page)).startswith("abc"))
    await run(page, "x = 5\n")
    await run(page, "print(x)\n")
    check("Variablen bleiben nicht zwischen Läufen hängen", await page.query_selector(".err-card") is not None)

    # input() und Stop während input()
    await set_code(page, 'name = input("Name? ")\nprint("Hallo " + name)\n')
    await page.click("#run-btn")
    await page.wait_for_selector("#console-input.show", timeout=10000)
    await page.fill("#console-input-field", "Ada")
    await page.press("#console-input-field", "Enter")
    await wait_idle(page)
    check("input() funktioniert", "Hallo Ada" in await console_text(page))
    await set_code(page, 'x = input("Warte: ")\n')
    await page.click("#run-btn")
    await page.wait_for_selector("#console-input.show", timeout=10000)
    t0 = time.time()
    await page.click("#stop-btn")
    d = await wait_idle(page, 10)
    check("Stop während input() wirkt sofort", d is not None and time.time() - t0 < 2, f"{time.time() - t0:.2f}s")

    # Endlosschleife mit Ausgabe: wird gestoppt, Oberfläche bleibt bedienbar
    t0 = time.time()
    d = await run(page, 'while True:\n    print("x")\n', timeout=30)
    check("Endlosschleife mit print wird gestoppt", d is not None and time.time() - t0 < 10, f"{time.time() - t0:.1f}s")
    check("Hinweis auf zu viel Ausgabe", await page.query_selector(".result-card.warn") is not None)
    t0 = time.time()
    await page.evaluate("1 + 1")
    check("Oberfläche reagiert nach Ausgabe-Flut", time.time() - t0 < 1)

    # Endlosschleife ohne Ausgabe: Stop
    await set_code(page, "while True:\n    pass\n")
    await page.click("#run-btn")
    await asyncio.sleep(1)
    t0 = time.time()
    await page.click("#stop-btn")
    d = await wait_idle(page, 10)
    check("Stop beendet Rechen-Schleife", d is not None and time.time() - t0 < 3, f"{time.time() - t0:.2f}s")
    check("Nach Stop läuft das nächste Programm", (await run(page, 'print("weiter")\n')) is not None and "weiter" in await console_text(page))

    # Editor: Tab mit Markierung rückt ein statt zu löschen
    await set_code(page, "print(1)\nprint(2)\n")
    await page.evaluate(
        "() => { const cm = document.querySelector('.CodeMirror').CodeMirror; cm.focus(); cm.setSelection({line:0,ch:0},{line:1,ch:8}); }"
    )
    await page.keyboard.press("Tab")
    code = await get_code(page)
    check("Tab rückt markierte Zeilen ein", code.startswith("    print(1)\n    print(2)"), repr(code))
    await page.keyboard.press("Shift+Tab")
    check("Shift+Tab rückt wieder aus", (await get_code(page)).startswith("print(1)\nprint(2)"))

    # Fortschritt bleibt nach Neuladen, Fortsetzen bei der letzten Lektion
    await page.click('.lesson-item[data-id="s1-l3"]')
    await set_code(page, "# mein Entwurf\n")
    await asyncio.sleep(0.6)  # Autosave
    await page.reload()
    await page.wait_for_selector("#boot.hide", timeout=20000)
    title = await page.inner_text("#lesson-pane h1")
    check("Nach Neuladen geht es bei der letzten Lektion weiter", "Spar" in title, title)
    check("Code wurde automatisch gespeichert", "mein Entwurf" in await get_code(page))
    check("Erledigte Lektionen bleiben erledigt", await page.query_selector('.lesson-item.done[data-id="s1-l2"]') is not None)

    # Fortschritt-Dialog
    await page.click("#stats-btn")
    await page.wait_for_selector(".progress-modal", timeout=3000)
    earned = await page.evaluate("document.querySelectorAll('.badge.earned').length")
    check("Fortschritt-Dialog zeigt verdiente Abzeichen", earned >= 3, str(earned))
    await page.click('.goal-opt[data-goal="2"]')
    week = await page.inner_text('.stat[data-kind="week"] .val')
    check("Wochenziel lässt sich ändern", week.strip() == "1/2", week)
    secrets = await page.evaluate("document.querySelectorAll('.badge.secret').length")
    check("Geheime Entdeckungen werden als Rätsel gezeigt", secrets >= 7, str(secrets))
    await page.keyboard.press("Escape")

    # Sprachwechsel
    await page.click("#lang-btn")
    await page.click('.lang-opt[data-lang="tr"]')
    await asyncio.sleep(0.2)
    label = await page.inner_text("#run-label")
    check("Sprachwechsel übersetzt die Oberfläche", label.strip() != "Ausführen", label)
    check("HTML-lang folgt der Sprache", await page.evaluate("document.documentElement.lang") == "tr")
    await page.click("#lang-btn")
    await page.click('.lang-opt[data-lang="de"]')

    # Hell/Dunkel
    await page.click("#theme-btn")
    check("Theme-Umschalter", await page.evaluate("document.documentElement.dataset.theme") == "light")
    if shots:
        await page.screenshot(path=os.path.join(shots, "desktop-light.png"))
    await page.click("#theme-btn")

    check("Keine JavaScript-Fehler", not errors, "; ".join(errors[:3]))
    check("Automatisierte Browser senden nichts an die Statistik", not stats, "; ".join(stats[:3]))
    await ctx.close()


async def mobile(browser, base, shots):
    ctx = await browser.new_context(viewport={"width": 360, "height": 740}, is_mobile=True, has_touch=True)
    page = await ctx.new_page()
    await page.goto(base + "/")
    await page.wait_for_selector("#boot.hide", timeout=20000)
    if await page.query_selector("[data-skip]"):
        await page.click("[data-skip]")
    await wait_idle(page, 60)
    overflow = await page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    check("Mobil: kein horizontaler Überlauf", overflow <= 0, str(overflow))
    install_visible = await page.evaluate("getComputedStyle(document.querySelector('#install-btn')).display")
    check("Installieren-Knopf versteckt, solange nicht möglich", install_visible == "none", install_visible)
    await page.click('.mtab[data-tab="code"]')
    await set_code(page, 'print("Hallo vom Handy")\n')
    await page.click("#run-btn")
    await asyncio.sleep(0.2)
    await wait_idle(page)
    check("Mobil: Erfolgskarte in der Konsole", await page.query_selector(".result-card.ok") is not None)
    if shots:
        await page.screenshot(path=os.path.join(shots, "mobile-success.png"))
    await page.click(".result-card.ok .btn-primary")
    await asyncio.sleep(0.2)
    on_task = await page.evaluate("!document.querySelector('#workspace').classList.contains('show-code')")
    check("Mobil: Weiter zeigt die neue Aufgabe", on_task)
    await page.click("#menu-btn")
    await asyncio.sleep(0.3)
    check("Mobil: Lernpfad öffnet als Drawer", await page.evaluate("document.querySelector('#sidebar').classList.contains('open')"))
    if shots:
        await page.screenshot(path=os.path.join(shots, "mobile-drawer.png"))
    await ctx.close()


async def missions(browser, base, shots):
    """Außeneinsätze: Lumo fliegt animiert, das Ergebnis kommt erst danach; Crash; Sperren."""
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
    page = await ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    await page.add_init_script("localStorage.setItem('pyquest.onboarded.v1','1')")
    await page.goto(base + "/")
    await page.wait_for_selector("#boot.hide", timeout=20000)
    await wait_idle(page, 60)
    await page.evaluate("document.querySelector('.lesson-item[data-id=\"g-1\"]').click()")  # gesperrt (aria-disabled)
    await asyncio.sleep(0.2)
    toast = await page.evaluate("document.querySelector('#toasts').innerText")
    check("Gesperrte Nebenmission sagt, was vorher fehlt", "Frag den Computer" in toast, toast)
    await page.click('.lesson-item[data-id="d-1"]')
    await set_code(page, "from drone import *\n" + "move()\n" * 5)
    await page.click("#run-btn")
    await page.wait_for_selector(".stage-world:not([hidden])", timeout=15000)
    early = await page.query_selector(".result-card.ok")
    check("Eisfeld erscheint, Ergebnis wartet auf Lumos Flug", early is None)
    await page.wait_for_selector(".result-card.ok", timeout=15000)
    check("Einsatz 1 besteht nach dem Flug", True)
    if shots:
        await page.screenshot(path=os.path.join(shots, "drone-done.png"))
    # Vorspulen: langer Flug ist per Klick sofort fertig
    await page.click(".result-card.ok .btn-primary")
    await set_code(page, "from drone import *\nfor i in range(4):\n    move()\nturn_left()\nmove()\nmove()\n")
    await page.click("#run-btn")
    await page.wait_for_selector(".stage-world:not([hidden])", timeout=15000)
    t0 = time.time()
    await page.click(".stage-world")
    await page.wait_for_selector(".result-card.ok", timeout=15000)
    check("Vorspulen zeigt das Ergebnis sofort", time.time() - t0 < 1.5, f"{time.time() - t0:.2f}s")
    await set_code(page, "from drone import *\n" + "move()\n" * 9)
    await page.click("#run-btn")
    await page.wait_for_selector(".err-card", timeout=15000)
    txt = await console_text(page)
    check("Crash wird als Glitch mit Zeile erklärt", "DroneCrash" in txt and await page.query_selector(".cm-error-line") is not None, txt[:120])
    # Weiter-Knopf öffnet keine Mission, die erst mit dem Hauptkurs aufgeht (d-4 braucht die for-Lektion)
    await page.evaluate("localStorage.setItem('pyquest.progress.v2', JSON.stringify({v:2, completed:{'d-1':'2026-10-16','d-2':'2026-10-16'}, last:'d-3'}))")
    await page.reload()
    await page.wait_for_selector("#boot.hide", timeout=20000)
    await wait_idle(page, 60)
    await run(page, "from drone import *\nmove()\nmove()\ncollect()\nmove()\nmove()\ncollect()\nmove()\nmove()\n")
    await page.wait_for_selector(".result-card.ok", timeout=15000)
    card = await page.inner_text(".result-card.ok")
    check("Weiter öffnet keine gesperrte Nebenmission", "Lange" not in card and "Beat wiederholen" in card, card[:160])
    check("Missionen: keine JavaScript-Fehler", not errors, "; ".join(errors[:3]))
    await ctx.close()


async def languages(browser, base):
    """Je Sprache: Start-Code scheitert, Musterlösung über den Lösungs-Knopf besteht."""
    for lang in ["de", "en", "fr", "it", "tr", "es"]:
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.add_init_script(
            f"localStorage.setItem('pyquest.onboarded.v1','1'); localStorage.setItem('pyquest.lang','{lang}');"
        )
        await page.goto(base + "/")
        await page.wait_for_selector("#boot.hide", timeout=20000)
        await wait_idle(page, 60)
        ok = await page.evaluate("document.documentElement.lang") == lang
        await run(page)
        ok = ok and await page.query_selector(".result-card.hint") is not None
        await page.click("#solution-btn")
        await asyncio.sleep(0.3)
        await run(page)
        ok = ok and await page.query_selector(".result-card.ok") is not None
        check(f"Sprache {lang}: Start-Code scheitert, Musterlösung besteht", ok and not errors, "; ".join(errors[:2]))
        await ctx.close()


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", help="Ordner für Screenshots")
    ap.add_argument("--url", help="laufende Instanz testen statt serve.py zu starten")
    args = ap.parse_args()
    if args.shots:
        os.makedirs(args.shots, exist_ok=True)

    server = None
    base = args.url
    if not base:
        port = free_port()
        server = subprocess.Popen(
            [sys.executable, os.path.join(ROOT, "serve.py"), "-p", str(port)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        base = f"http://localhost:{port}"
        time.sleep(0.8)
    try:
        async with async_playwright() as p:
            exe = os.environ.get("CODALUNA_CHROMIUM")
            browser = await p.chromium.launch(executable_path=exe) if exe else await p.chromium.launch()
            await desktop(browser, base, args.shots)
            await mobile(browser, base, args.shots)
            await missions(browser, base, args.shots)
            await languages(browser, base)
            await browser.close()
    finally:
        if server:
            server.terminate()
    failed = [r for r in results if not r[1]]
    print(f"\nBrowser-Test: {len(results) - len(failed)}/{len(results)} bestanden")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    asyncio.run(main())
