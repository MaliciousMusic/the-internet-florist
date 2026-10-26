"""servir.py: the shop's pages served locally for checks, as http.server does, but every answer says Cache-Control:
no-cache, so a browser asks again for every file it holds (a plain http.server sends none, and a browser then keeps
scripts and manifests at its own pace: on 2026-10-26 the frieze showed rebaked clumps under their old boxes).
Cloudflare Pages already asks browsers to check each file again (max-age=0, must-revalidate).

    python decor/scene/servir.py <port> <directory>
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


if __name__ == '__main__':
    port, root = int(sys.argv[1]), sys.argv[2]
    ThreadingHTTPServer(('127.0.0.1', port), partial(NoCache, directory=root)).serve_forever()
