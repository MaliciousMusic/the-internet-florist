# -*- coding: utf-8 -*-
"""snap_recv.py: receives the images that a page open in the built-in browser renders at high resolution, and writes them to a folder, so
that large renders need no extra headless Chrome when the PC is short of memory (docs/STANDARD-RENDU.md).

Listens on 127.0.0.1:8781 only (never 8766). In the page: serialize the svg with the defs it refers to, draw it on a canvas of the wanted
width, then  fetch('http://127.0.0.1:8781/save?name=vase.png', {method: 'POST', body: canvas.toDataURL('image/png')}).

usage: python snap_recv.py [folder, ./snaps by default]
"""
import base64, os, re, sys
from http.server import BaseHTTPRequestHandler, HTTPServer

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.getcwd(), 'snaps')
os.makedirs(OUT, exist_ok=True)


class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        m = re.search(r'name=([\w.-]+)', self.path)
        body = self.rfile.read(int(self.headers.get('Content-Length', 0))).decode()
        ok = bool(m) and body.startswith('data:image/')
        if ok:
            open(os.path.join(OUT, m.group(1)), 'wb').write(base64.b64decode(body.split(',', 1)[1]))
        self.send_response(200 if ok else 400)
        self._cors()
        self.end_headers()
        self.wfile.write(b'ok' if ok else b'bad')

    def log_message(self, *a):
        pass


print('snap_recv : 127.0.0.1:8781 ->', OUT)
HTTPServer(('127.0.0.1', 8781), H).serve_forever()
