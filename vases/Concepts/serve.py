"""Loopback-only concept gallery and local selection persistence."""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
from threading import Lock
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
VERSION = "belai-vases-400-v1"
SELECTION = ROOT / "selection.json"
CONCEPTS = {c["id"]: c for c in json.loads((ROOT / "concepts.json").read_text(encoding="utf-8"))}
LOCK = Lock()
ASSETS = {
    "index.html": "text/html; charset=utf-8",
    "style.css": "text/css; charset=utf-8",
    "app.js": "text/javascript; charset=utf-8",
    "catalogue.js": "text/javascript; charset=utf-8",
    "references.js": "text/javascript; charset=utf-8",
    "concepts.json": "application/json; charset=utf-8",
    "extraction-116.json": "application/json; charset=utf-8",
    "vocabulaire.json": "application/json; charset=utf-8",
    "EXTRACTION.md": "text/markdown; charset=utf-8",
}


def canonicalize(data: object, timestamp: str) -> dict:
    if not isinstance(data, dict) or data.get("catalogueVersion") != VERSION:
        raise ValueError("Version du catalogue inconnue.")
    ids = data.get("selectedIds")
    if not isinstance(ids, list) or len(ids) > len(CONCEPTS):
        raise ValueError("Liste de sélection invalide.")
    if any(not isinstance(i, str) or i not in CONCEPTS for i in ids):
        raise ValueError("Numéro de concept inconnu.")
    if len(set(ids)) != len(ids):
        raise ValueError("Numéro de concept répété.")
    notes = data.get("notes", {})
    if not isinstance(notes, dict) or len(notes) > len(CONCEPTS):
        raise ValueError("Notes invalides.")
    for ident, note in notes.items():
        if ident not in CONCEPTS or not isinstance(note, str) or len(note) > 2000:
            raise ValueError("Note invalide ou trop longue.")
    ids = sorted(ids)
    notes = {ident: note for ident, note in sorted(notes.items()) if note}
    keys = ("id", "name", "family", "material", "shape", "style", "file", "brief")
    return {
        "catalogueVersion": VERSION,
        "updatedAt": timestamp,
        "selectedIds": ids,
        "notes": notes,
        "selected": [dict({key: CONCEPTS[ident][key] for key in keys}, note=notes.get(ident, "")) for ident in ids],
    }


def atomic_write(data: dict) -> None:
    temporary = ROOT / ".selection.tmp"
    with temporary.open("w", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, SELECTION)


class Gallery(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        if len(args) > 1 and args[1] not in ("200", "204", "304"):
            super().log_message(format, *args)

    def allowed_host(self) -> bool:
        return self.headers.get("Host") in {f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"}

    def respond(self, code: int, body: bytes, content_type: str, head: bool = False) -> None:
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'")
        self.end_headers()
        if not head:
            try:
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError):
                pass

    def json_response(self, code: int, data: dict, head: bool = False) -> None:
        self.respond(code, json.dumps(data, ensure_ascii=False).encode("utf-8"), "application/json; charset=utf-8", head)

    def do_HEAD(self) -> None:
        self.do_GET(head=True)

    def do_GET(self, head: bool = False) -> None:
        if not self.allowed_host():
            self.json_response(403, {"error": "Adresse locale attendue."}, head)
            return
        name = unquote(urlsplit(self.path).path).lstrip("/") or "index.html"
        if name == "favicon.ico":
            self.respond(204, b"", "image/x-icon", head)
            return
        if name == "api/selection":
            try:
                with LOCK:
                    data = json.loads(SELECTION.read_text(encoding="utf-8"))
                    data = canonicalize(data, data.get("updatedAt", "1970-01-01T00:00:00Z"))
                self.json_response(200, data, head)
            except (OSError, ValueError):
                self.json_response(500, {"error": "Fichier de sélection illisible. Il est conservé."}, head)
            return
        mime = ASSETS.get(name)
        if re.fullmatch(r"svg/C\d{3}\.svg", name) and name[4:8] in CONCEPTS:
            mime = "image/svg+xml; charset=utf-8"
        path = (ROOT / name).resolve()
        if not mime or not path.is_relative_to(ROOT) or not path.is_file():
            self.json_response(404, {"error": "Page introuvable."}, head)
            return
        self.respond(200, path.read_bytes(), mime, head)

    def do_PUT(self) -> None:
        origins = {f"http://127.0.0.1:{self.server.server_port}", f"http://localhost:{self.server.server_port}"}
        if not self.allowed_host() or self.headers.get("Origin") not in origins:
            self.json_response(403, {"error": "La sauvegarde doit provenir de cette page locale."})
            return
        if urlsplit(self.path).path != "/api/selection":
            self.json_response(404, {"error": "Page introuvable."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 500000:
                self.json_response(413, {"error": "Sélection trop volumineuse."})
                return
            if self.headers.get("Content-Type", "").split(";", 1)[0] != "application/json":
                self.json_response(415, {"error": "Fichier JSON attendu."})
                return
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            timestamp = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
            data = canonicalize(data, timestamp)
            with LOCK:
                atomic_write(data)
            self.json_response(200, {"saved": True, "count": len(data["selectedIds"]), "updatedAt": timestamp})
        except (ValueError, UnicodeError) as error:
            self.json_response(400, {"error": str(error)})
        except OSError:
            self.json_response(500, {"error": "Écriture impossible. La sélection précédente est conservée."})


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8787)
    args = parser.parse_args()
    if not SELECTION.exists():
        atomic_write(canonicalize({"catalogueVersion": VERSION, "selectedIds": [], "notes": {}}, "1970-01-01T00:00:00Z"))
    with ThreadingHTTPServer(("127.0.0.1", args.port), Gallery) as server:
        print(f"Galerie prête : http://127.0.0.1:{args.port}/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
