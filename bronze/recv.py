"""recv.py: receives images rendered by a page in the browser pane (POST /save?name=x.png, body: a data URL) and writes them to bronze/out."""
import base64, os, re
from http.server import BaseHTTPRequestHandler, HTTPServer
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS'); self.send_header('Access-Control-Allow-Headers', '*')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        m = re.search(r'name=([\w.-]+)', self.path); n = int(self.headers.get('Content-Length', 0)); body = self.rfile.read(n).decode()
        ok = bool(m) and body.startswith('data:image/')
        if ok:
            open(os.path.join(OUT, m.group(1)), 'wb').write(base64.b64decode(body.split(',', 1)[1]))
        self.send_response(200 if ok else 400); self._cors(); self.end_headers(); self.wfile.write(b'ok' if ok else b'bad')
    def log_message(self, *a): pass
HTTPServer(('127.0.0.1', 8781), H).serve_forever()
