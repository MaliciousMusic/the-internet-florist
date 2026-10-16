"""Serve only three native studies and their viewer on the local loopback interface."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import mimetypes

ROOT = Path(__file__).resolve().parent
ALLOWED = {name: ROOT / name for name in (
    'index.html', 'style.css', 'app.js',
    '013-aurore.svg', '013-onde.svg', '013-brise.svg',
)}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        name = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
        file = ALLOWED.get(name)
        if not file or not file.is_file():
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header('Content-Type', mimetypes.guess_type(file.name)[0] or 'application/octet-stream')
        self.send_header('Content-Length', str(file.stat().st_size))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'")
        self.end_headers()
        self.wfile.write(file.read_bytes())

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    print('Trois variations du 013 : http://127.0.0.1:8790/', flush=True)
    HTTPServer(('127.0.0.1', 8790), Handler).serve_forever()
