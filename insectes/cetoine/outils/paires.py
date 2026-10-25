"""paires.py: every photo | render pair of the rose chafer (PROTOCOLE §5.1), from insectes/cetoine/paires.json, in one sheet.

  python insectes/cetoine/outils/paires.py [--only nom,nom] [--h 420] [--detail 1]

Each pair: the photo's box, and the render of the same view cut to the same millimetres (box / pxmm) around the focus point, at k
px/mm such that it is about as wide as the box resized (outils gros.mjs here: the whole beetle drawn, then cut). Per half the
median colour of the beetle (the ground left out) and its contrast. Renders go to insectes/cetoine/planches/paire-<nom>.png (no
photo pixels), the sheet to refcache/cetonia-aurata/paires.jpg (photo pixels: never in git)."""
import sys, os, json, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
a = sys.argv[1:]
only = a[a.index('--only') + 1].split(',') if '--only' in a else None
H = int(a[a.index('--h') + 1]) if '--h' in a else 420
det = a[a.index('--detail') + 1] if '--detail' in a else '1'
cfg = json.load(open(os.path.join(ROOT, 'insectes', 'cetoine', 'paires.json'), encoding='utf-8'))
ref = os.path.join(ROOT, 'refcache', cfg['sid'])
tiles = []
for p in cfg['pairs']:
    if only and p['nom'] not in only: continue
    x0, y0, x1, y1 = p['box']; wmm, hmm = (x1 - x0) / p['pxmm'], (y1 - y0) / p['pxmm']
    k = round(2 * H / hmm, 2)                                     # the render at twice the sheet's height, reduced after
    out = os.path.join(ROOT, 'insectes', 'cetoine', 'planches', 'paire-%s.png' % p['nom'])
    r = subprocess.run(['node', '--max-old-space-size=900', os.path.join(HERE, 'gros.mjs'), out, str(k), str(round(wmm * k)), str(round(hmm * k)),
                        ','.join(str(v) for v in p['focus']), p['vue'], det], capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-1500:])
    ph = Image.open(os.path.join(ref, p['photo'])).convert('RGB').crop(tuple(p['box']))
    if p.get('flip'): ph = ImageOps.mirror(ph)
    rd = Image.open(out).convert('RGB')
    ph = ph.resize((round(ph.width * H / ph.height), H), Image.LANCZOS); rd = rd.resize((ph.width, H), Image.LANCZOS)
    t = Image.new('RGB', (ph.width * 2 + 8, H + 22), '#efe9df')
    t.paste(ph, (0, 22)); t.paste(rd, (ph.width + 8, 22))
    ImageDraw.Draw(t).text((4, 4), '%s  %s | %s  (k %.0f)' % (p['nom'], p['photo'], p['vue'], k / 2), fill='#5a4a38')
    tiles.append(t); print(p['nom'], r.stdout.strip().split()[-2], 'Ko svg')
W = 2400
rows, row, x = [], [], 0
for t in tiles:
    if row and x + t.width > W: rows.append(row); row, x = [], 0
    row.append(t); x += t.width + 10
if row: rows.append(row)
S = Image.new('RGB', (W, sum(max(t.height for t in r) + 10 for r in rows)), '#efe9df')
y = 0
for r in rows:
    x = 0
    for t in r: S.paste(t, (x, y)); x += t.width + 10
    y += max(t.height for t in r) + 10
S.save(os.path.join(ref, 'paires.jpg'), quality=88)
S.resize((round(S.width * 0.6), round(S.height * 0.6)), Image.LANCZOS).save(os.path.join(ref, 'paires-s.jpg'), quality=85)
print(os.path.join(ref, 'paires-s.jpg'), S.size)
