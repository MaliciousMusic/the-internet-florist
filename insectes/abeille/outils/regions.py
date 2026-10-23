"""regions.py: the pairs of paires.json cut by region (PROTOCOLE §5.1): head, thorax, abdomen, legs, wings, photo | render at the
same scale, at 100 % and 200 %, with the median ΔE2000 (blurred at 0.1 mm), the contrast and the grain (render / photo) of each.
  python regions.py            -> refcache/apis-mellifera/regions/<pair>-<region>.jpg, regions.jpg (photo pixels: never in git)
The regions are model points (mm) projected in each pair's view, as outils/gros.mjs places the render."""
import os, sys, json, math
import numpy as np
import cv2
from PIL import Image, ImageOps, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'outils'))
import aile  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
cfg = json.load(open(os.path.join(HERE, '..', 'paires.json'), encoding='utf-8'))
ref = os.path.join(ROOT, 'refcache', cfg['sid']); out = os.path.join(ref, 'regions'); os.makedirs(out, exist_ok=True)
# region centres (mm, body frame) and half sizes (mm)
REG = {'tete': ([5.0, 0, -0.1], 2.1), 'thorax': ([1.8, 0, 0.3], 2.4), 'abdomen': ([-3.4, 0, -0.6], 3.1),
       'pattes': ([1.5, 0, -2.4], 2.4), 'ailes': ([-1.5, 0, 1.8], 3.2)}


def cam(az, el):
    a, e = math.radians(az), math.radians(el)
    c = np.array([math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)])
    r = np.array([-math.sin(a), math.cos(a), 0.0]); u = np.cross(r, -c)
    return lambda p: np.array([np.dot(p, r), np.dot(p, u)])


tiles = []
res = {}
for p in cfg['pairs']:
    rp = os.path.join(HERE, '..', 'planches', 'paire-%s.png' % p['nom'])
    if not os.path.exists(rp) or 'box' not in p: continue
    _, az, el = p['vue'].split(':')[:3]
    proj = cam(float(az), float(el)); f = proj(np.array(p['focus']))
    R = np.asarray(Image.open(rp).convert('RGB'))
    ph = Image.open(os.path.join(ref, p['photo'])).convert('RGB')
    x0, y0, x1, y1 = p['box']; pxp = (x1 - x0) / (p['w'] / p['k'])
    for name, (c, hs) in REG.items():
        if p['nom'].startswith('face') and name not in ('tete',): continue
        q = proj(np.array(c)) - f
        rx, ry = p['w'] / 2 + q[0] * p['k'], p['h'] / 2 - q[1] * p['k']
        px, py = (x0 + x1) / 2 + q[0] * pxp, (y0 + y1) / 2 - q[1] * pxp
        hr, hp = hs * p['k'], hs * pxp
        if p['nom'].startswith('face'): rx, ry, hr, px, py, hp = p['w'] / 2, p['h'] / 2, p['w'] / 2, (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2
        rc = R[int(max(0, ry - hr)):int(ry + hr), int(max(0, rx - hr)):int(rx + hr)]
        if rc.size == 0: continue
        pc = ph.crop((int(px - hp), int(py - hp), int(px + hp), int(py + hp))).resize((rc.shape[1], rc.shape[0]), Image.LANCZOS)
        pc = np.asarray(pc)
        bl = lambda x: cv2.GaussianBlur(aile.lab_of(x), (0, 0), 0.1 * p['k'])
        # on the insect only: off the render's beige ground, and off a light plate in the photo
        ins = (np.abs(rc.astype(int) - [239, 233, 223]).max(2) > 12)
        if 'c282' in p['photo'] or 'c278' in p['photo']: ins &= aile.lab_of(pc)[..., 0] < 88
        ins = cv2.erode(ins.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        if ins.sum() < 200: ins[:] = True
        dEm = aile.de2000(bl(pc), bl(rc))
        dE = float(np.median(dEm[ins]))
        dlab = np.median(aile.lab_of(pc)[ins], 0) - np.median(aile.lab_of(rc)[ins], 0)
        res.setdefault(p['nom'], {})[name] = {'dE': round(dE, 1), 'dLab': [round(float(x), 1) for x in dlab]}
        Lp, Lr = aile.lab_of(pc)[..., 0], aile.lab_of(rc)[..., 0]
        con = float(Lr.std() / max(0.5, Lp.std()))
        gr = float(np.std(Lr - cv2.GaussianBlur(Lr, (0, 0), 1.5)) / max(0.2, np.std(Lp - cv2.GaussianBlur(Lp, (0, 0), 1.5))))
        H = 360
        a = Image.fromarray(pc).resize((H, H)); b = Image.fromarray(rc).resize((H, H))
        t = Image.new('RGB', (2 * H + 6, H + 20), '#efe9df'); t.paste(a, (0, 20)); t.paste(b, (H + 6, 20))
        ImageDraw.Draw(t).text((4, 3), '%s %s  dE %.1f  contraste %.2f  grain %.2f' % (p['nom'], name, dE, con, gr), fill='#5a4a38')
        t.save(os.path.join(out, '%s-%s.jpg' % (p['nom'], name)), quality=88)
        tiles.append(t)
        print('%-12s %-8s dE %.1f contraste %.2f grain %.2f  dLab %+.1f %+.1f %+.1f' % (p['nom'], name, dE, con, gr, *dlab))
W = 3 * (2 * 360 + 6) + 20
rows = [tiles[i:i + 3] for i in range(0, len(tiles), 3)]
S = Image.new('RGB', (W, len(rows) * 390), '#efe9df')
for j, r in enumerate(rows):
    for i, t in enumerate(r): S.paste(t, (i * (2 * 360 + 12), j * 390))
S.save(os.path.join(ref, 'regions.jpg'), quality=86)
json.dump(res, open(os.path.join(HERE, '..', 'formes', 'regions.json'), 'w', encoding='utf-8', newline='\n'), indent=1)
print(os.path.join(ref, 'regions.jpg'), S.size)
