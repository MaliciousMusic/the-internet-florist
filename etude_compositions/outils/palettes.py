"""Extract each reference bouquet's colour palette (background removed), with value/temperature stats."""
import colorsys, json, os, sys
import numpy as np
from PIL import Image
SRC = r'C:\Users\agent\Desktop\flower\Composition reference'
OUT = r'C:\Users\agent\Desktop\flower\etude_compositions'
rng = np.random.default_rng(7)

def kmeans(X, k, it=25):
    C = X[rng.choice(len(X), k, replace=False)]
    for _ in range(it):
        d = ((X[:, None, :] - C[None, :, :]) ** 2).sum(-1)
        lab = d.argmin(1)
        C2 = np.array([X[lab == j].mean(0) if (lab == j).any() else C[j] for j in range(k)])
        if np.allclose(C, C2): break
        C = C2
    return C, np.bincount(lab, minlength=k) / len(X)

def hexa(c): return '#%02x%02x%02x' % tuple(int(max(0, min(255, v))) for v in c)

res = []
files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')))
for n, f in enumerate(files, 1):
    im = Image.open(os.path.join(SRC, f)).convert('RGB'); im.thumbnail((220, 220))
    A = np.asarray(im).astype(float); h, w, _ = A.shape
    b = max(2, int(min(h, w) * .06))
    border = np.concatenate([A[:b].reshape(-1, 3), A[-b:].reshape(-1, 3), A[:, :b].reshape(-1, 3), A[:, -b:].reshape(-1, 3)])
    bg = np.median(border, 0)
    P = A.reshape(-1, 3)
    hsv = np.array([colorsys.rgb_to_hsv(*(p / 255)) for p in P])
    far = np.sqrt(((P - bg) ** 2).sum(1)) > 48
    wall = (hsv[:, 1] < .14) & (hsv[:, 2] > .55)
    keep = far & ~wall
    chrom = keep & (hsv[:, 1] > .25) & (hsv[:, 2] > .18)
    X = P[chrom] if chrom.sum() > 200 else (P[keep] if keep.sum() > 300 else P)
    C, w8 = kmeans(X, 6)
    o = np.argsort(-w8)
    pal = [{'hex': hexa(C[i]), 'part': round(float(w8[i]), 3)} for i in o]
    H = hsv[keep] if keep.sum() > 300 else hsv
    sat, val = H[:, 1], H[:, 2]
    chroma = H[(sat > .25) & (val > .2)]
    hues = chroma[:, 0] * 360 if len(chroma) else np.array([0.])
    warm = float(((hues < 70) | (hues > 290)).mean()) if len(chroma) else 0
    hist = np.histogram(hues, bins=12, range=(0, 360))[0] / max(1, len(hues))
    fams = int((hist > .08).sum())
    res.append({'n': n, 'fichier': f, 'palette': pal, 'part_fonce': round(float((val < .3).mean()), 3), 'part_clair': round(float((val > .8).mean()), 3),
                'saturation_moy': round(float(sat.mean()), 3), 'part_chaude': round(warm, 3), 'familles_teintes': fams,
                'type_palette': 'tonale' if fams <= 2 else ('analogue' if fams <= 3 else 'multicolore')})
    print(n, f, [p['hex'] for p in pal[:5]], res[-1]['type_palette'], flush=True)
json.dump(res, open(os.path.join(OUT, 'palettes.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# swatch board
from PIL import ImageDraw, ImageFont
try: font = ImageFont.truetype('arialbd.ttf', 16)
except Exception: font = ImageFont.load_default()
cols, cw, ch = 3, 420, 70
rows = (len(res) + cols - 1) // cols
board = Image.new('RGB', (cols * cw, rows * ch), 'white'); d = ImageDraw.Draw(board)
for i, r in enumerate(res):
    x0, y0 = (i % cols) * cw, (i // cols) * ch
    d.text((x0 + 6, y0 + 24), f"{r['n']:02d}", fill='black', font=font)
    x = x0 + 40
    for p in r['palette']:
        wpx = max(6, int(p['part'] * 360)); d.rectangle([x, y0 + 8, x + wpx, y0 + ch - 8], fill=p['hex']); x += wpx
board.save(os.path.join(OUT, 'palettes.png'))
print('palettes.json + palettes.png ok')
