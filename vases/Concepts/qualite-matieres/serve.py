"""Serve only the sixteen local studies and explicit gallery assets on loopback."""
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

ROOT = Path(__file__).resolve().parent
samples = json.loads((ROOT / 'comparaison.json').read_text(encoding='utf-8'))['samples']
ALLOWED = {'index.html', 'app.js', 'style.css', 'comparaison.js', 'comparaison.json'}
ALLOWED.update(s[k] for s in samples for k in ['before', 'after'])
ALLOWED.update(s['previous'] for s in samples if 'previous' in s)

class Handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.respond(False)

    def do_GET(self):
        self.respond(True)

    def respond(self, body):
        name = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
        file = (ROOT / name).resolve()
        if name not in ALLOWED or not file.is_relative_to(ROOT) or not file.is_file():
            self.send_error(404)
            return
        self.send_response(200)
        mime = 'image/svg+xml' if file.suffix == '.svg' else mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        self.send_header('Content-Type', mime + ('; charset=utf-8' if mime.startswith('text/') or file.suffix in ['.js', '.json'] else ''))
        self.send_header('Content-Length', str(file.stat().st_size))
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'")
        self.end_headers()
        if body:
            self.wfile.write(file.read_bytes())

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8788)
    args=parser.parse_args()
    if args.port==8766:
        parser.error('Le port 8766 est réservé.')
    server=HTTPServer(('127.0.0.1',args.port), Handler)
    print(f'Atelier des matières : http://127.0.0.1:{args.port}/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
