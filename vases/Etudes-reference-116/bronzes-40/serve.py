"""Serve only the forty private drawings and their viewer on loopback."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import mimetypes

ROOT=Path(__file__).resolve().parent
ALLOWED={name:ROOT/name for name in ['index.html','style.css','app.js','compositions.json']}
ALLOWED.update({f'svg/B{family:02d}-{variant}.svg':ROOT/'svg'/f'B{family:02d}-{variant}.svg' for family in range(1,11) for variant in 'abcd'})


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        name=unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
        target=ALLOWED.get(name)
        if not target or not target.is_file():
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header('Content-Type',mimetypes.guess_type(target.name)[0] or 'application/octet-stream')
        self.send_header('Content-Length',str(target.stat().st_size))
        self.send_header('Cache-Control','no-store')
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Content-Security-Policy',"default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'")
        self.end_headers()
        self.wfile.write(target.read_bytes())

    def log_message(self,*args):
        pass


if __name__=='__main__':
    print('Quarante bronzes : http://127.0.0.1:8791/',flush=True)
    HTTPServer(('127.0.0.1',8791),Handler).serve_forever()
