"""recadre.py: the cropped pairs the fresh judge looks at (PROTOCOLE §5.1, §5.3): for each photo | render pair of paires.json, the
whole pair, then three crops of it (rear, middle and front thirds of the insect's box, or top, middle and bottom for the face and
the belly) at twice the pair's scale, photo on the left, render on the right, the same box in both.

  python insectes/bourdon/recadre.py        -> refcache/bombus-terrestris/juge/<nom>-0.jpg (whole), <nom>-1..3.jpg (crops)
They hold photo pixels: never in git."""
import os, sys, json
import numpy as np
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
cfg = json.load(open(os.path.join(HERE, 'paires.json'), encoding='utf-8'))
ref = os.path.join(ROOT, 'refcache', cfg['sid'])
out = os.path.join(ref, 'juge'); os.makedirs(out, exist_ok=True)
BG = '#efe9df'


def side(a, b, h):
    a = a.resize((round(a.width * h / a.height), h), Image.LANCZOS); b = b.resize((round(b.width * h / b.height), h), Image.LANCZOS)
    t = Image.new('RGB', (a.width + b.width + 12, h), BG); t.paste(a, (0, 0)); t.paste(b, (a.width + 12, 0))
    return t


for p in cfg['pairs']:
    rp = os.path.join(HERE, 'planches', 'paire-%s.png' % p['nom'])
    if not os.path.exists(rp): continue
    R = Image.open(rp).convert('RGB')
    P = Image.open(os.path.join(ref, p['photo'])).convert('RGB').crop(tuple(p['box']))
    if p.get('flip'): P = ImageOps.mirror(P)
    P = P.resize(R.size, Image.LANCZOS)
    side(P, R, 560).save(os.path.join(out, '%s-0.jpg' % p['nom']), quality=90)
    # the insect's box in the render (its non-background pixels)
    a = np.asarray(R).astype(int); bg = np.median(np.concatenate([a[:4, :4].reshape(-1, 3), a[:4, -4:].reshape(-1, 3)]), 0)
    ys, xs = np.nonzero(np.abs(a - bg).sum(-1) > 24)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    vertical = p['nom'] in ('face', 'dessous') or (y1 - y0) > 1.3 * (x1 - x0)
    for i in range(3):
        if vertical: b = (x0, y0 + (y1 - y0) * i // 3, x1, y0 + (y1 - y0) * (i + 1) // 3)
        else: b = (x0 + (x1 - x0) * i // 3, y0, x0 + (x1 - x0) * (i + 1) // 3, y1)
        m = 0.06 * max(b[2] - b[0], b[3] - b[1])
        b = (int(max(0, b[0] - m)), int(max(0, b[1] - m)), int(min(R.width, b[2] + m)), int(min(R.height, b[3] + m)))
        h = min(900, 2 * (b[3] - b[1]))
        side(P.crop(b), R.crop(b), h).save(os.path.join(out, '%s-%d.jpg' % (p['nom'], i + 1)), quality=90)
    print(p['nom'], 'ok')
