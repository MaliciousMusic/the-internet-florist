"""paires.py: every photo | render pair of a species (PROTOCOLE §5.1), from insectes/<id>/paires.json, in one sheet.

  python insectes/outils/paires.py <id> [--only i,j] [--scale 0.6]
paires.json: {"sid": "<refcache folder>", "pairs": [{"nom", "photo": "hd/c123.jpg", "box": [x0,y0,x1,y1], "vue": "pose:az:el[:f]",
"k": px/mm, "w", "h", "focus": [x,y,z], "flip": false, "detail": 1}]}. Renders go to insectes/<id>/planches/paire-<nom>.png,
pairs and the sheet to refcache/<sid>/ (they hold photo pixels: never in git)."""
import sys, os, json, subprocess
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
a = sys.argv[1:]
sp = a[0]
only = [int(x) for x in a[a.index('--only') + 1].split(',')] if '--only' in a else None
scale = float(a[a.index('--scale') + 1]) if '--scale' in a else 0.6
cfg = json.load(open(os.path.join(HERE, '..', sp, 'paires.json'), encoding='utf-8'))
ref = os.path.join(HERE, '..', '..', 'refcache', cfg['sid'])
H = 420
tiles = []
for i, p in enumerate(cfg['pairs']):
    if only and i not in only: continue
    out = os.path.join(HERE, '..', sp, 'planches', 'paire-%s.png' % p['nom'])
    f = ','.join(str(v) for v in p['focus'])
    r0 = subprocess.run(['node', os.path.join(HERE, 'gros.mjs'), sp, out, str(p['k']), str(p['w']), str(p['h']), f, p['vue'], str(p.get('detail', 1))], capture_output=True, text=True)
    if r0.returncode: sys.exit(r0.stderr[-1500:])
    ph = Image.open(os.path.join(ref, p['photo'])).convert('RGB').crop(tuple(p['box']))
    if p.get('flip'): ph = ImageOps.mirror(ph)
    r = Image.open(out).convert('RGB')
    ph = ph.resize((round(ph.width * H / ph.height), H), Image.LANCZOS)
    r = r.resize((round(r.width * H / r.height), H), Image.LANCZOS)
    t = Image.new('RGB', (ph.width + r.width + 8, H + 22), '#efe9df')
    t.paste(ph, (0, 22)); t.paste(r, (ph.width + 8, 22))
    from PIL import ImageDraw
    ImageDraw.Draw(t).text((4, 4), '%d %s  %s | %s' % (i, p['nom'], p['photo'], p['vue']), fill='#5a4a38')
    tiles.append(t)
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
S.resize((round(S.width * scale), round(S.height * scale)), Image.LANCZOS).save(os.path.join(ref, 'paires-s.jpg'), quality=85)
print(os.path.join(ref, 'paires-s.jpg'), S.size)
