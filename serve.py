#!/usr/bin/env python3
"""Lokaler Entwicklungsserver für Codaluna.

Setzt die für SharedArrayBuffer nötigen Cross-Origin-Isolation-Header
(input() und der Stop-Knopf brauchen sie) und schaltet das Caching ab.

Start:  python3 serve.py            ->  http://localhost:8000
        python3 serve.py -p 8123    ->  anderer Port
Ist der Port belegt, wird automatisch der nächste freie genommen.
"""
import argparse
import errno
import functools
import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".mjs": "text/javascript",
        ".js": "text/javascript",
        ".wasm": "application/wasm",
        ".json": "application/json",
        ".webmanifest": "application/manifest+json",
        ".py": "text/plain; charset=utf-8",
    }

    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        print("·", self.command, self.path)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    ap = argparse.ArgumentParser(description="Codaluna lokal starten")
    ap.add_argument("-p", "--port", type=int, default=8000)
    ap.add_argument("--host", default="127.0.0.1", help="0.0.0.0 = im Netzwerk erreichbar (ohne HTTPS geht input() dort nicht)")
    args = ap.parse_args()
    handler = functools.partial(Handler, directory=ROOT)
    for port in range(args.port, args.port + 20):
        try:
            httpd = Server((args.host, port), handler)
            break
        except OSError as e:
            if e.errno != errno.EADDRINUSE:
                raise
    else:
        raise SystemExit(f"Kein freier Port zwischen {args.port} und {args.port + 19}.")
    with httpd:
        print(f"Codaluna läuft auf  http://localhost:{port}  (Strg+C zum Beenden)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nBeendet.")


if __name__ == "__main__":
    main()
