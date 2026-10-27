"""PyQuest-Laufzeit: führt Code von Lernenden aus, analysiert ihn und prüft ihn.

Wird im Browser (Web-Worker mit Pyodide) und in der Testsuite (Node + Pyodide)
geladen. Im Browser stellt der Worker das Modul ``pqjs`` bereit:

    pqjs.out(kind, text)   Ausgabe an die Konsole weiterreichen ("o", "e", "p")
    pqjs.flush()           gesammelte Ausgabe sofort anzeigen
    pqjs.read_line()       blockierend eine Eingabezeile lesen (None = Abbruch)

Ohne ``pqjs`` (Testsuite) wird nichts weitergereicht, Eingaben kommen aus Listen.

Alle öffentlichen Funktionen geben JSON-Strings zurück, damit die JS-Seite
keine Python-Proxys verwalten muss.
"""

import ast
import builtins
import io
import json
import linecache
import random
import re
import sys
import time
import traceback
import types
import unicodedata

try:  # Brücke zum Web-Worker, nur im Browser vorhanden
    import pqjs
except ImportError:  # pragma: no cover - Testsuite
    pqjs = None

FILENAME = "main.py"

if pqjs is not None:
    import signal

    def _flush_signal(signum, frame):
        pqjs.flush()

    try:
        # Die Hauptseite setzt den Interrupt-Puffer regelmäßig auf SIGUSR1: so erscheint
        # Ausgabe auch dann zeitnah, wenn ein Programm danach lange rechnet.
        signal.signal(signal.SIGUSR1, _flush_signal)
    except (AttributeError, ValueError, OSError):  # pragma: no cover
        pass

# Grenzen für den sichtbaren Lauf: genug für echte Programme, aber eine
# Endlosschleife mit print() wird schnell und freundlich gestoppt.
MAIN_LIMIT_LINES = 20000
MAIN_LIMIT_CHARS = 400000

# Grenzen für die versteckten Prüfläufe
TEST_LIMIT_LINES = 3000
TEST_LIMIT_CHARS = 100000

# Ereignisse für Bildschirm, Lautsprecher und Eisfeld (Kanal "g") haben ein eigenes Budget,
# damit eine Pixel-Animation nicht das Ausgabe-Budget von print() aufbraucht.
MAIN_LIMIT_EVENTS = 100000
TEST_LIMIT_EVENTS = 20000
TEST_TIME = 2.0
TEST_MAX_INPUTS = 200

_real_sleep = time.sleep
_SUGGESTION = re.compile(r"Did you mean: '([^']+)'\?")


class OutputLimit(BaseException):
    """Zu viel Ausgabe, vermutlich eine Endlosschleife."""


class InputsExhausted(BaseException):
    """Prüflauf: das Programm wollte mehr Eingaben als vorbereitet."""


class TestTimeout(BaseException):
    """Prüflauf: Zeitlimit überschritten."""


# --------------------------------------------------------------------------
# Modul "station": Bildschirm (Pixel) und Lautsprecher (Töne) der Station Polaris
# --------------------------------------------------------------------------
# Jeder Lauf bekommt ein frisches Modul. Was gezeichnet und gespielt wird, geht als
# Ereignis (eine JSON-Zeile, Kanal "g") an die Seite, die es live zeigt bzw. abspielt,
# und steht danach für die Prüfungen als result["screen"] / result["music"] bereit.

class StationError(ValueError):
    """Falscher Wert für den Stationsbildschirm oder den Lautsprecher."""


SCREEN_SIZE = 16
SCREEN_MIN, SCREEN_MAX = 8, 32
MUSIC_MAX_TONES = 2000
MUSIC_MAX_SECONDS = 180.0

_PALETTE = {
    "white": "#f6f1e7", "red": "#ff5a4e", "orange": "#ff9636", "yellow": "#ffd23f",
    "gold": "#ffb340", "green": "#5ed16a", "lime": "#b6e34a", "teal": "#34d3b5",
    "cyan": "#4cc9f0", "blue": "#4a7dff", "navy": "#2e3f9e", "purple": "#9b6bff",
    "pink": "#ff7ab6", "brown": "#a0693a", "gray": "#8d8a82",
}
# Farbnamen in den sechs Sprachen der App (None = schwarz = Pixel aus)
_COLOR_ALIASES = {
    None: "black schwarz noir nero siyah negro",
    "white": "weiß weiss blanc bianco beyaz blanco",
    "red": "rot rouge rosso kırmızı kirmizi rojo",
    "orange": "arancione turuncu naranja",
    "yellow": "gelb jaune giallo sarı sari amarillo",
    "gold": "or doré dore oro altın altin dorado",
    "green": "grün gruen vert verde yeşil yesil",
    "lime": "hellgrün hellgruen vert-clair verde-chiaro açık-yeşil acik-yesil verde-claro",
    "teal": "türkis tuerkis turquoise turchese turkuaz turquesa",
    "cyan": "hellblau bleu-clair azzurro ciano açık-mavi acik-mavi camgöbeği celeste cian",
    "blue": "blau bleu blu mavi azul",
    "navy": "dunkelblau bleu-marine blu-scuro lacivert azul-marino",
    "purple": "lila violett violet viola mor morado violeta",
    "pink": "rosa rose pembe",
    "brown": "braun marron brun marrone kahverengi marrón",
    "gray": "grey grau gris grigio gri",
}


def _norm(text):
    """Kleinschreibung ohne Akzente, damit "Grün", "grun" und "GRUEN" gleich zählen."""
    text = str(text).strip().lower().replace("ß", "ss").replace("ı", "i").replace(" ", "-")
    text = unicodedata.normalize("NFKD", text)
    return "".join(c for c in text if not unicodedata.combining(c))


_COLORS = {}
for _name, _hex in _PALETTE.items():
    _COLORS[_name] = _hex
for _target, _words in _COLOR_ALIASES.items():
    for _word in _words.split():
        _COLORS[_norm(_word)] = _PALETTE[_target] if _target else None

_NOTE_STEPS = {"c": -9, "d": -7, "e": -5, "f": -4, "g": -2, "a": 0, "b": 2, "h": 2}
_SOLFEGE = {"do": "c", "re": "d", "mi": "e", "fa": "f", "sol": "g", "la": "a", "si": "b", "ti": "b"}
_NOTE = re.compile(r"(do|re|mi|fa|sol|la|si|ti|[a-h])([#b]?)(\d)?")
_DRUMS = {
    "kick": "kick bass bum boom bom", "snare": "snare tschak tak", "hihat": "hihat hi-hat hat ts tss",
    "clap": "clap klatsch", "tom": "tom",
}
_DRUM_NAMES = {_norm(w): k for k, words in _DRUMS.items() for w in words.split()}


def _color(value):
    if isinstance(value, (tuple, list)) and len(value) == 3 and all(isinstance(v, int) for v in value):
        if all(0 <= v <= 255 for v in value):
            return "#%02x%02x%02x" % tuple(value)
    elif isinstance(value, str):
        text = value.strip()
        if re.fullmatch(r"#[0-9a-fA-F]{6}", text):
            return text.lower()
        if re.fullmatch(r"#[0-9a-fA-F]{3}", text):
            return "#" + "".join(c * 2 for c in text[1:].lower())
        key = _norm(text)
        if key in _COLORS:
            return _COLORS[key]
    raise StationError(f"unknown color {value!r}")


def _note_freq(name):
    m = _NOTE.fullmatch(_norm(name)) if isinstance(name, str) else None
    if not m:
        raise StationError(f"unknown note {name!r}")
    letter = _SOLFEGE.get(m.group(1), m.group(1))
    semis = _NOTE_STEPS[letter] + {"#": 1, "b": -1}.get(m.group(2), 0)
    octave = int(m.group(3)) if m.group(3) is not None else 4
    return round(440 * 2 ** ((semis + (octave - 4) * 12) / 12), 2)


def _number(value, what, low, high):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise StationError(f"{what} must be a number, not {type(value).__name__}")
    if not low <= value <= high:
        raise StationError(f"{what} must be between {low} and {high} (got {value})")
    return value


class _Station:
    def __init__(self, session):
        self.session = session
        self.size = SCREEN_SIZE
        self.pixels = {}
        self.bpm = 120
        self.cursor = 0.0
        self.tones = []

    def emit(self, event):
        self.session.write("g", json.dumps(event, separators=(",", ":")) + "\n")

    def _xy(self, x, y):
        top = self.size - 1
        for name, v in (("x", x), ("y", y)):
            if isinstance(v, bool) or not isinstance(v, int):
                raise StationError(f"{name} must be a whole number, not {type(v).__name__}")
            if not 0 <= v <= top:
                raise StationError(f"{name} must be between 0 and {top} (got {v})")

    def pixel(self, x, y, color="white"):
        self._xy(x, y)
        c = _color(color)
        if c is None:
            self.pixels.pop((x, y), None)
        else:
            self.pixels[(x, y)] = c
        self.emit({"t": "px", "x": x, "y": y, "c": c})

    def fill(self, color):
        c = _color(color)
        self.pixels = {} if c is None else {(x, y): c for x in range(self.size) for y in range(self.size)}
        self.emit({"t": "fill", "c": c})

    def clear(self):
        self.fill("black")

    def screen(self, size=SCREEN_SIZE):
        self.size = int(_number(size, "size", SCREEN_MIN, SCREEN_MAX))
        self.pixels = {}
        self.emit({"t": "size", "n": self.size})

    def _tone(self, kind, name, freq, beats):
        beats = _number(beats, "beats", 0.125, 16)
        duration = beats * 60.0 / self.bpm
        if len(self.tones) >= MUSIC_MAX_TONES or self.cursor + duration > MUSIC_MAX_SECONDS:
            raise StationError(f"the song is too long (max. {MUSIC_MAX_TONES} tones or {int(MUSIC_MAX_SECONDS)} seconds)")
        tone = {"k": kind, "n": name, "at": round(self.cursor, 4), "d": round(duration, 4)}
        if freq is not None:
            tone["f"] = freq
        self.tones.append(tone)
        self.cursor += duration
        self.emit({"t": "tone", **tone})

    def note(self, name, beats=1):
        freq = _note_freq(name)
        self._tone("note", str(name), freq, beats)

    def drum(self, kind="kick", beats=1):
        key = _DRUM_NAMES.get(_norm(kind)) if isinstance(kind, str) else None
        if key is None:
            raise StationError(f"unknown drum {kind!r}")
        self._tone("drum", key, None, beats)

    def rest(self, beats=1):
        beats = _number(beats, "beats", 0.125, 16)
        self.cursor += beats * 60.0 / self.bpm

    def tempo(self, bpm):
        self.bpm = _number(bpm, "bpm", 30, 300)

    def summary(self):
        return {
            "size": self.size,
            "pixels": {f"{x},{y}": c for (x, y), c in self.pixels.items()},
        }


def _station_module(session):
    st = _Station(session)
    mod = types.ModuleType("station", "Bildschirm und Lautsprecher der Station Polaris (PyQuest).")

    # Echte Funktionen statt gebundener Methoden: Fehlermeldungen wie
    # "pixel() takes … arguments" zählen dann richtig (ohne self).
    def pixel(x, y, color="white"):
        st.pixel(x, y, color)

    def fill(color):
        st.fill(color)

    def clear():
        st.clear()

    def screen(size=SCREEN_SIZE):
        st.screen(size)

    def note(name, beats=1):
        st.note(name, beats)

    def drum(kind="kick", beats=1):
        st.drum(kind, beats)

    def rest(beats=1):
        st.rest(beats)

    def tempo(bpm):
        st.tempo(bpm)

    for fn in (pixel, fill, clear, screen, note, drum, rest, tempo):
        fn.__module__ = "station"
        fn.__qualname__ = fn.__name__
        setattr(mod, fn.__name__, fn)
    mod.StationError = StationError
    mod.COLORS = sorted(_PALETTE) + ["black"]
    session.station = st
    return mod


# --------------------------------------------------------------------------
# Modul "drone": Lumo fliegt über das Eisfeld (Gitterwelt im Stil von Karel/Reeborg)
# --------------------------------------------------------------------------
# Die Welt wird hier simuliert, damit Prüfungen auch versteckte Testwelten durchspielen
# können. Jede Aktion geht als Ereignis an die Seite, die sie animiert abspielt.
# Karte: "#" Wand, "." Eis, "*" Kristall, "G" Ladestation (Ziel), "D" Start.

class DroneCrash(Exception):
    """Lumo ist gegen eine Wand geflogen."""


class DroneError(Exception):
    """Diesen Befehl kann Lumo hier nicht ausführen."""


DRONE_MAX_STEPS = 2000
DRONE_MAX_CHECKS = 20000
_DIRS = {"N": (0, -1), "E": (1, 0), "S": (0, 1), "W": (-1, 0)}
_LEFT = {"N": "W", "W": "S", "S": "E", "E": "N"}
# Eisfeld für den Spielplatz (ohne Aufgabe)
DEFAULT_WORLD = {
    "map": [
        "##########",
        "#D.......#",
        "#..*..#..#",
        "#..#..#*.#",
        "#.*#.....#",
        "#..#..*..#",
        "#.....#.G#",
        "##########",
    ],
    "dir": "E",
}


class _Drone:
    def __init__(self, session, world):
        self.session = session
        self.world = world or DEFAULT_WORLD
        rows = [str(r) for r in self.world["map"]]
        self.rows = rows
        self.walls = set()
        self.crystals = set()
        self.goals = set()
        self.x = self.y = 1
        for y, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch == "#":
                    self.walls.add((x, y))
                elif ch == "*":
                    self.crystals.add((x, y))
                elif ch == "G":
                    self.goals.add((x, y))
                elif ch == "D":
                    self.x, self.y = x, y
        self.dir = self.world.get("dir", "E") if self.world.get("dir") in _DIRS else "E"
        self.total = len(self.crystals)
        self.collected = 0
        self.steps = 0
        self.checks = 0
        self.crashed = False
        self.shown = False

    def emit(self, event):
        self.session.write("g", json.dumps(event, separators=(",", ":")) + "\n")

    def _show(self):
        # Die Welt erscheint erst, wenn das Programm Lumo wirklich benutzt
        if not self.shown:
            self.shown = True
            self.emit({"t": "world", "map": self.rows, "x": self.x, "y": self.y, "d": self.dir})

    def _wall(self, x, y):
        if y < 0 or y >= len(self.rows) or x < 0 or x >= len(self.rows[y]):
            return True
        return (x, y) in self.walls

    def _ahead(self):
        dx, dy = _DIRS[self.dir]
        return self.x + dx, self.y + dy

    def _act(self):
        self._show()
        self.steps += 1
        if self.steps > DRONE_MAX_STEPS:
            raise DroneError(f"too many steps (more than {DRONE_MAX_STEPS}) - is there an endless loop?")

    def _check(self):
        self._show()
        self.checks += 1
        if self.checks > DRONE_MAX_CHECKS:
            raise DroneError(f"too many checks (more than {DRONE_MAX_CHECKS}) - is there an endless loop?")

    def move(self):
        self._act()
        nx, ny = self._ahead()
        if self._wall(nx, ny):
            self.crashed = True
            self.emit({"t": "bump", "x": self.x, "y": self.y, "d": self.dir})
            raise DroneCrash(f"Lumo hit a wall at ({nx}, {ny})")
        self.x, self.y = nx, ny
        self.emit({"t": "move", "x": nx, "y": ny})

    def turn_left(self):
        self._act()
        self.dir = _LEFT[self.dir]
        self.emit({"t": "turn", "d": self.dir})

    def collect(self):
        self._act()
        if (self.x, self.y) not in self.crystals:
            self.emit({"t": "miss", "x": self.x, "y": self.y})
            raise DroneError("there is no crystal here")
        self.crystals.discard((self.x, self.y))
        self.collected += 1
        self.emit({"t": "take", "x": self.x, "y": self.y})

    def front_clear(self):
        self._check()
        return not self._wall(*self._ahead())

    def on_crystal(self):
        self._check()
        return (self.x, self.y) in self.crystals

    def at_goal(self):
        self._check()
        return (self.x, self.y) in self.goals

    def summary(self):
        return {
            "x": self.x,
            "y": self.y,
            "d": self.dir,
            "goal": (self.x, self.y) in self.goals,
            "crystals": self.collected,
            "total": self.total,
            "left": len(self.crystals),
            "steps": self.steps,
            "crashed": self.crashed,
        }


def _drone_module(session, world):
    dr = _Drone(session, world)
    mod = types.ModuleType("drone", "Lumo, die Wartungsdrohne der Station Polaris (PyQuest).")

    def move():
        dr.move()

    def turn_left():
        dr.turn_left()

    def collect():
        dr.collect()

    def front_clear():
        return dr.front_clear()

    def on_crystal():
        return dr.on_crystal()

    def at_goal():
        return dr.at_goal()

    funcs = (move, turn_left, collect, front_clear, on_crystal, at_goal)
    for fn in funcs:
        fn.__module__ = "drone"
        fn.__qualname__ = fn.__name__
        setattr(mod, fn.__name__, fn)
    mod.__all__ = [fn.__name__ for fn in funcs]
    mod.DroneCrash = DroneCrash
    mod.DroneError = DroneError
    session.drone = dr
    return mod


class Session:
    """Sammelt die Ausgabe eines Laufs (mit Grenzen) und reicht sie ggf. weiter."""

    def __init__(self, forward, limit_lines, limit_chars, limit_events):
        self.forward = forward and pqjs is not None
        self.limit_lines = limit_lines
        self.limit_chars = limit_chars
        self.limit_events = limit_events
        self.events = 0
        self.parts = []
        self.chars = 0
        self.lines = 0
        self.prompts = []
        self.inputs = []
        self.chunks = [""]  # Ausgabe zwischen den input()-Aufrufen
        self.over = False
        self.station = None  # Zustand des Moduls "station" in diesem Lauf
        self.drone = None  # Zustand des Moduls "drone" in diesem Lauf
        self.world = None  # Eisfeld dieser Mission (None = Spielplatz-Eisfeld)

    def write(self, kind, text):
        if kind == "g":  # Ereignis für die Bühne: eigenes Budget, wird nicht gespeichert
            self.events += 1
            if self.events > self.limit_events:
                raise StationError(f"too many updates for screen or speaker (more than {self.limit_events}) - is there an endless loop?")
            if self.forward:
                pqjs.out(kind, text)
            return
        if self.over:
            raise OutputLimit()
        self.chars += len(text)
        self.lines += text.count("\n")
        if self.chars > self.limit_chars or self.lines > self.limit_lines:
            self.over = True
            raise OutputLimit()
        self.parts.append((kind, text))
        if kind == "o":
            self.chunks[-1] += text
        if self.forward:
            pqjs.out(kind, text)

    def flush(self):
        if self.forward:
            pqjs.flush()

    def text(self, kinds):
        return "".join(t for k, t in self.parts if k in kinds)


class Stream(io.TextIOBase):
    """Ersatz für sys.stdout/sys.stderr während eines Laufs."""

    def __init__(self, session, kind):
        super().__init__()
        self._session = session
        self._kind = kind

    @property
    def encoding(self):
        return "utf-8"

    def writable(self):
        return True

    def isatty(self):
        return True

    def write(self, text):
        if not isinstance(text, str):
            raise TypeError(f"write() argument must be str, not {type(text).__name__}")
        if text:
            self._session.write(self._kind, text)
        return len(text)

    def flush(self):
        self._session.flush()


class Stdin(io.TextIOBase):
    """sys.stdin während eines Laufs: liest über dieselbe Eingabe wie input()."""

    def __init__(self, input_fn):
        super().__init__()
        self._input = input_fn

    @property
    def encoding(self):
        return "utf-8"

    def readable(self):
        return True

    def isatty(self):
        return True

    def readline(self, size=-1):
        try:
            return self._input("") + "\n"
        except EOFError:
            return ""

    def read(self, size=-1):
        parts = []
        for _ in range(TEST_MAX_INPUTS):
            line = self.readline()
            if not line:
                break
            parts.append(line)
        return "".join(parts)

    def __next__(self):
        line = self.readline()
        if not line:
            raise StopIteration
        return line


class Patched:
    """Ersetzt für die Dauer eines Laufs stdout/stderr/stdin, input() und time.sleep()."""

    def __init__(self, session, input_fn, sleep_fn):
        self.session = session
        self.input_fn = input_fn
        self.sleep_fn = sleep_fn
        self.saved = None

    def __enter__(self):
        self.saved = (
            sys.stdout, sys.stderr, sys.stdin, builtins.input, time.sleep,
            sys.modules.get("station"), sys.modules.get("drone"),
        )
        sys.stdout = Stream(self.session, "o")
        sys.stderr = Stream(self.session, "e")
        sys.stdin = Stdin(self.input_fn)
        # Fehlermeldungen sollen "input()" nennen, nicht die interne Hilfsfunktion
        self.input_fn.__name__ = self.input_fn.__qualname__ = "input"
        builtins.input = self.input_fn
        time.sleep = self.sleep_fn
        sys.modules["station"] = _station_module(self.session)
        sys.modules["drone"] = _drone_module(self.session, self.session.world)
        return self

    def __exit__(self, *exc):
        sys.stdout, sys.stderr, sys.stdin, builtins.input, time.sleep, station, drone = self.saved
        for name, mod in (("station", station), ("drone", drone)):
            if mod is None:
                sys.modules.pop(name, None)
            else:  # pragma: no cover
                sys.modules[name] = mod
        return False


class _SafeExcept(ast.NodeTransformer):
    """`except:` und `except BaseException:` werden zu `except Exception:`.

    Sonst würde ein Programm wie `while True: try: … except: pass` auch Stop,
    das Zeitlimit der Prüfung oder fehlende Prüf-Eingaben verschlucken und nie enden.
    Für normale Fehler (ValueError …) ändert sich nichts.
    """

    @staticmethod
    def _exc(node):
        return ast.copy_location(ast.Name(id="Exception", ctx=ast.Load()), node)

    def visit_ExceptHandler(self, node):
        self.generic_visit(node)
        t = node.type
        if t is None or (isinstance(t, ast.Name) and t.id == "BaseException"):
            node.type = self._exc(node)
        elif isinstance(t, ast.Tuple):
            t.elts = [self._exc(e) if isinstance(e, ast.Name) and e.id == "BaseException" else e for e in t.elts]
        return node


def _compile(code):
    tree = ast.parse(code, FILENAME)
    tree = ast.fix_missing_locations(_SafeExcept().visit(tree))
    try:
        return compile(tree, FILENAME, "exec")
    except SyntaxError as exc:  # z. B. 'return' outside function: Codezeile für die Anzeige ergänzen
        if exc.text is None and exc.lineno and 0 < exc.lineno <= len(code.splitlines()):
            exc.text = code.splitlines()[exc.lineno - 1] + "\n"
        raise


def _register_source(code):
    # Damit Tracebacks die betroffene Codezeile zeigen wie im echten Python.
    linecache.cache[FILENAME] = (len(code), None, code.splitlines(True), FILENAME)


def _record_prompt(session, prompt):
    prompt = str(prompt)
    if prompt:
        session.write("p", prompt)
    session.prompts.append(prompt)
    session.chunks.append("")


def error_info(exc):
    """Fehler strukturiert beschreiben: Typ, Meldung, Zeile, Traceback ohne Interna."""
    etype = type(exc).__name__
    tb = exc.__traceback__
    while tb is not None and tb.tb_frame.f_code.co_filename != FILENAME:
        tb = tb.tb_next
    frames = traceback.extract_tb(tb) if tb is not None else []
    user_frames = [f for f in frames if f.filename == FILENAME]
    line = user_frames[-1].lineno if user_frames else None
    col = end_col = None
    if isinstance(exc, SyntaxError):
        line = exc.lineno
        col = exc.offset
        end_col = getattr(exc, "end_offset", None)
    try:
        # Mit Traceback formatiert, sonst fehlt Pythons "Did you mean: …?"-Vorschlag.
        tb_text = "".join(traceback.format_exception(type(exc), exc, tb)).rstrip("\n")
    except Exception:  # pragma: no cover
        tb_text = f"{etype}: {exc}"
    last = tb_text.splitlines()[-1] if tb_text else etype
    m = re.match(r"^[\w.]+(?:: (.*))?$", last, re.S)
    message = (m.group(1) or "") if m else str(exc)
    suggestion = _SUGGESTION.search(last)
    name = getattr(exc, "name", None)
    return {
        "type": etype,
        "message": message,
        "line": line,
        "col": col,
        "endCol": end_col,
        "traceback": tb_text,
        "suggestion": suggestion.group(1) if suggestion else None,
        "name": name if isinstance(name, str) else None,
    }


def _exit_info(session, exc):
    code = exc.code
    if code is None or isinstance(code, int):
        return code or 0
    # sys.exit("Text") schreibt den Text wie im echten Python nach stderr
    try:
        session.write("e", str(code) + "\n")
    except OutputLimit:
        pass
    return 1


def _execute(code, session, input_fn, sleep_fn, tracer=None, after=None):
    """Code in frischem Namensraum ausführen. Gibt das Ergebnis-Dict zurück."""
    _register_source(code)
    ns = {"__name__": "__main__", "__builtins__": builtins}
    result = {"ok": True}
    with Patched(session, input_fn, sleep_fn):
        try:
            compiled = _compile(code)
            if tracer is not None:
                sys.settrace(tracer)
            try:
                exec(compiled, ns)
            finally:
                if tracer is not None:
                    sys.settrace(None)
        except SystemExit as exc:
            result = {"ok": True, "exit": _exit_info(session, exc)}
        except OutputLimit:
            result = {"ok": False, "limit": "output"}
        except InputsExhausted:
            result = {"ok": False, "exhausted": True}
        except TestTimeout:
            result = {"ok": False, "timeout": True}
        except KeyboardInterrupt:
            result = {"ok": False, "stopped": True}
        except BaseException as exc:  # noqa: B902 - alles soll freundlich erklärt werden
            result = {"ok": False, "error": error_info(exc)}
        if after is not None and result.get("ok"):
            after(result, ns)
    return result


def _summary(result, session):
    st = session.station
    if st is not None and (st.pixels or st.tones or st.size != SCREEN_SIZE):
        result["screen"] = st.summary()
        result["music"] = st.tones
    if session.drone is not None and session.drone.shown:
        result["drone"] = session.drone.summary()
    result["out"] = session.text("o")
    result["stdout"] = session.text("op")
    result["stderr"] = session.text("e")
    result["prompts"] = session.prompts
    result["inputs"] = session.inputs
    result["chunks"] = session.chunks
    return result


# --------------------------------------------------------------------------
# Sichtbarer Lauf (Browser)
# --------------------------------------------------------------------------

def run_main(code, world_json=None):
    """Interaktiver Lauf: Ausgabe live an die Konsole, input() fragt die Nutzerin.
    world_json: Eisfeld der Mission für das Modul "drone" (sonst das Spielplatz-Eisfeld)."""
    session = Session(True, MAIN_LIMIT_LINES, MAIN_LIMIT_CHARS, MAIN_LIMIT_EVENTS)
    session.world = json.loads(world_json) if world_json else None

    def _input(prompt=""):
        _record_prompt(session, prompt)
        line = pqjs.read_line() if pqjs is not None else None
        if line is None:
            raise EOFError("EOF when reading a line")
        line = str(line)
        session.inputs.append(line)
        return line

    def _sleep(seconds):
        # In kurzen Schritten schlafen: Zwischen den Schritten prüft Python den
        # Interrupt-Puffer, so wirkt der Stop-Knopf sofort statt erst nach dem Schlaf.
        session.flush()
        remaining = float(seconds)
        if remaining < 0:
            raise ValueError("sleep length must be non-negative")
        if pqjs is not None:
            pqjs.sleeping(remaining)  # Schlafen zählt nicht gegen das Zeitlimit
        end = time.monotonic() + remaining
        while remaining > 0:
            _real_sleep(min(0.05, remaining))
            remaining = end - time.monotonic()

    result = _execute(code, session, _input, _sleep)
    return json.dumps(_summary(result, session))


# --------------------------------------------------------------------------
# Prüfläufe (versteckt, mit vorbereiteten Eingaben)
# --------------------------------------------------------------------------

def _make_tracer(deadline):
    count = 0

    def tracer(frame, event, arg):
        nonlocal count
        count += 1
        if count & 255 == 0 and time.monotonic() > deadline:
            raise TestTimeout()
        return tracer

    return tracer


def _patch_random(spec):
    saved = {}
    if "seed" in spec:
        random.seed(spec["seed"])
    if "randint" in spec:
        fixed = int(spec["randint"])
        saved["randint"] = random.randint
        saved["randrange"] = random.randrange

        def randint(a, b):
            return min(max(fixed, a), b)

        def randrange(start, stop=None, step=1):
            if stop is None:
                start, stop = 0, start
            return min(max(fixed, start), stop - 1)

        random.randint = randint
        random.randrange = randrange
    return saved


def _restore_random(saved):
    for name, fn in saved.items():
        setattr(random, name, fn)


def _user_funcs(ns, nargs=None):
    found = []
    for key, value in ns.items():
        if key.startswith("_") or not isinstance(value, types.FunctionType):
            continue
        if value.__code__.co_filename != FILENAME:
            continue
        if nargs is not None and value.__code__.co_argcount != nargs:
            continue
        found.append(value)
    return found


def _user_values(ns, *kinds):
    return [
        value
        for key, value in ns.items()
        if not key.startswith("__")
        and isinstance(value, kinds)
        and not isinstance(value, (types.ModuleType, types.FunctionType, type))
    ]


def _jsonable(value, depth=0):
    if depth > 6:
        return repr(value)
    if value is None or isinstance(value, (bool, str)):
        return value
    if isinstance(value, int):
        return value if abs(value) < 2**53 else str(value)
    if isinstance(value, float):
        return value if value == value and abs(value) != float("inf") else repr(value)
    if isinstance(value, (list, tuple)):
        return [_jsonable(v, depth + 1) for v in list(value)[:1000]]
    if isinstance(value, (set, frozenset)):
        return [_jsonable(v, depth + 1) for v in sorted(value, key=repr)[:1000]]
    if isinstance(value, dict):
        return {str(k): _jsonable(v, depth + 1) for k, v in list(value.items())[:1000]}
    return repr(value)


def _probe(expr, ns, tracer):
    """Prüf-Ausdruck im Namensraum des Programms auswerten (z. B. Funktionen testen)."""

    def call(fn, *args):
        if fn is None:
            return {"error": "nofunc"}
        try:
            return fn(*args)
        except (TestTimeout, OutputLimit, InputsExhausted, KeyboardInterrupt):
            raise
        except BaseException as exc:  # noqa: B902
            return {"error": type(exc).__name__}

    def fn(nargs=None):
        found = _user_funcs(ns, nargs)
        return found[0] if found else None

    env = {
        "__builtins__": builtins,
        "ns": ns,
        "funcs": lambda nargs=None: _user_funcs(ns, nargs),
        "fn": fn,
        "values": lambda *kinds: _user_values(ns, *kinds),
        "call": call,
    }
    sys.settrace(tracer)
    try:
        value = eval(expr, env)
    except (TestTimeout, OutputLimit, InputsExhausted, KeyboardInterrupt):
        raise
    except BaseException as exc:  # noqa: B902
        value = {"error": type(exc).__name__}
    finally:
        sys.settrace(None)
    return _jsonable(value)


def run_scripted(code, spec):
    """Lauf ohne Anzeige. spec: inputs, fill, seed, randint, probe, time, world."""
    session = Session(False, TEST_LIMIT_LINES, TEST_LIMIT_CHARS, TEST_LIMIT_EVENTS)
    session.world = spec.get("world")
    queue = [str(x) for x in spec.get("inputs", [])]
    fill = spec.get("fill")

    def _input(prompt=""):
        _record_prompt(session, prompt)
        if len(session.inputs) >= TEST_MAX_INPUTS:
            raise InputsExhausted()
        if queue:
            value = queue.pop(0)
        elif fill is not None:
            value = str(fill)
        else:
            raise InputsExhausted()
        session.inputs.append(value)
        return value

    def _sleep(seconds):  # Prüfläufe warten nicht
        return None

    deadline = time.monotonic() + float(spec.get("time", TEST_TIME))
    tracer = _make_tracer(deadline)
    probe = spec.get("probe")

    def after(result, ns):
        if probe:
            try:
                result["value"] = _probe(probe, ns, tracer)
            except TestTimeout:
                result.update(ok=False, timeout=True)
            except OutputLimit:
                result.update(ok=False, limit="output")
            except InputsExhausted:
                result.update(ok=False, exhausted=True)

    saved = {}
    try:
        saved = _patch_random(spec)
        result = _execute(code, session, _input, _sleep, tracer, after)
    finally:
        _restore_random(saved)
    return _summary(result, session)


def run_scripted_json(code, spec_json):
    return json.dumps(run_scripted(code, json.loads(spec_json)))


_EMPTY_RUN = {"out": "", "stdout": "", "stderr": "", "prompts": [], "inputs": [], "chunks": [""]}


def verify(code, tests_json):
    """Mehrere Prüfläufe nacheinander. Ein JS-Watchdog-Abbruch beendet alle weiteren."""
    tests = json.loads(tests_json)
    results = []
    aborted = False
    for spec in tests:
        if aborted:
            results.append({"ok": False, "timeout": True, "skipped": True, **_EMPTY_RUN})
            continue
        try:
            result = run_scripted(code, spec)
        except KeyboardInterrupt:
            result = {"ok": False, "timeout": True, **_EMPTY_RUN}
            aborted = True
        if result.get("stopped"):
            result["timeout"] = True
            aborted = True
        results.append(result)
    random.seed()
    return json.dumps(results)


# --------------------------------------------------------------------------
# Code-Analyse (sprachneutral, ignoriert Kommentare und Strings)
# --------------------------------------------------------------------------

class _Analyzer(ast.NodeVisitor):
    def __init__(self):
        self.nodes = {}
        self.calls = {}
        self.methods = {}
        self.calls_in_loop = {}
        self.imports = set()
        self.defs = []
        self.compares = 0
        self.elifs = 0
        self.elses = 0
        self.depth = 0
        self.max_depth = 0
        self.print_args = []
        self.self_updates = 0
        self.fstring_fields = 0
        self.fstring_exprs = []
        self.list_lens = []
        self.dict_lens = []
        self.neg_index = 0
        self.str_keys = 0
        self.sub_store = 0
        self.print_calls = []
        self.newline_strings = 0
        self.str_assigns = {}
        self.ops_with_names = {}
        self.for_iters = []
        self.list_dicts = 0

    @staticmethod
    def _inc(counter, key):
        counter[key] = counter.get(key, 0) + 1

    def _count(self, node):
        self._inc(self.nodes, type(node).__name__)

    def generic_visit(self, node):
        self._count(node)
        super().generic_visit(node)

    def _enter(self):
        self.depth += 1
        self.max_depth = max(self.max_depth, self.depth)

    def visit_For(self, node):
        self._count(node)
        self.for_iters.append(type(node.iter).__name__)
        self.visit(node.target)
        self.visit(node.iter)
        self._enter()
        for stmt in node.body + node.orelse:
            self.visit(stmt)
        self.depth -= 1

    visit_AsyncFor = visit_For

    def visit_While(self, node):
        self._count(node)
        self._enter()
        self.visit(node.test)
        for stmt in node.body + node.orelse:
            self.visit(stmt)
        self.depth -= 1

    def visit_Call(self, node):
        name = None
        if isinstance(node.func, ast.Name):
            name = node.func.id
            self._inc(self.calls, name)
            if name == "print":
                self.print_args.extend(type(a).__name__ for a in node.args)
                self.print_calls.append(len(node.args))
        elif isinstance(node.func, ast.Attribute):
            name = node.func.attr
            self._inc(self.methods, name)
        if name and self.depth:
            self._inc(self.calls_in_loop, name)
        self.generic_visit(node)

    def visit_If(self, node):
        if node.orelse:
            if len(node.orelse) == 1 and isinstance(node.orelse[0], ast.If):
                self.elifs += 1
            else:
                self.elses += 1
        self.generic_visit(node)

    def visit_Compare(self, node):
        self.compares += len(node.ops)
        self.generic_visit(node)

    def visit_AugAssign(self, node):
        self.self_updates += 1
        self.generic_visit(node)

    def visit_Constant(self, node):
        if isinstance(node.value, str) and "\n" in node.value:
            self.newline_strings += 1
        self.generic_visit(node)

    def visit_BinOp(self, node):
        if isinstance(node.left, ast.Name) or isinstance(node.right, ast.Name):
            self._inc(self.ops_with_names, type(node.op).__name__)
        self.generic_visit(node)

    def visit_Assign(self, node):
        if (
            len(node.targets) == 1
            and isinstance(node.targets[0], ast.Name)
            and isinstance(node.value, ast.Constant)
            and isinstance(node.value.value, str)
        ):
            self.str_assigns.setdefault(node.targets[0].id, node.value.value[:200])
        targets = {t.id for t in node.targets if isinstance(t, ast.Name)}
        if targets and any(isinstance(n, ast.Name) and n.id in targets for n in ast.walk(node.value)):
            self.self_updates += 1
        self.generic_visit(node)

    def visit_JoinedStr(self, node):
        fields = [v for v in node.values if isinstance(v, ast.FormattedValue)]
        self.fstring_fields = max(self.fstring_fields, len(fields))
        self.fstring_exprs.extend(type(f.value).__name__ for f in fields)
        self.generic_visit(node)

    def visit_List(self, node):
        self.list_lens.append(len(node.elts))
        self.list_dicts = max(self.list_dicts, sum(isinstance(e, ast.Dict) for e in node.elts))
        self.generic_visit(node)

    def visit_Dict(self, node):
        self.dict_lens.append(len(node.keys))
        self.generic_visit(node)

    def visit_Subscript(self, node):
        sl = node.slice
        if isinstance(sl, ast.UnaryOp) and isinstance(sl.op, ast.USub):
            self.neg_index += 1
        if isinstance(sl, ast.Constant) and isinstance(sl.value, str):
            self.str_keys += 1
        if isinstance(node.ctx, ast.Store):
            self.sub_store += 1
        self.generic_visit(node)

    def visit_Import(self, node):
        for alias in node.names:
            self.imports.add(alias.name.split(".")[0])
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module:
            self.imports.add(node.module.split(".")[0])
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        returns = any(isinstance(n, ast.Return) and n.value is not None for n in ast.walk(node))
        self.defs.append({"name": node.name, "args": len(node.args.args), "returns": returns})
        self.generic_visit(node)

    def result(self):
        names = {d["name"] for d in self.defs}
        return {
            "nodes": self.nodes,
            "calls": self.calls,
            "methods": self.methods,
            "callsInLoop": self.calls_in_loop,
            "imports": sorted(self.imports),
            "defs": self.defs,
            "userCalls": sum(self.calls.get(n, 0) for n in names),
            "compares": self.compares,
            "elifs": self.elifs,
            "elses": self.elses,
            "loopDepth": self.max_depth,
            "printArgs": self.print_args,
            "selfUpdates": self.self_updates,
            "fstringFields": self.fstring_fields,
            "fstringExprs": self.fstring_exprs,
            "listLens": self.list_lens,
            "dictLens": self.dict_lens,
            "negIndex": self.neg_index,
            "strKeys": self.str_keys,
            "subStore": self.sub_store,
            "printCalls": self.print_calls,
            "newlineStrings": self.newline_strings,
            "strAssigns": self.str_assigns,
            "opsWithNames": self.ops_with_names,
            "forIters": self.for_iters,
            "listDicts": self.list_dicts,
        }


def _same_program(tree, other_code):
    if other_code is None:
        return False
    try:
        return ast.dump(ast.parse(other_code)) == ast.dump(tree)
    except (SyntaxError, ValueError):
        return False


def analyze(code, starter=None):
    """Struktur des Programms beschreiben (für die sprachneutralen Prüfungen)."""
    try:
        tree = ast.parse(code, FILENAME)
    except (SyntaxError, ValueError):
        return json.dumps({"syntax": False})
    visitor = _Analyzer()
    visitor.visit(tree)
    info = visitor.result()
    info["syntax"] = True
    info["unchanged"] = _same_program(tree, starter)
    info["codeLines"] = sum(
        1 for line in code.splitlines() if line.strip() and not line.strip().startswith("#")
    )
    return json.dumps(info)
