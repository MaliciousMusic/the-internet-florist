"""cycle_continuite.py: is the baked cycle continuous (decor/CYCLE.md C2: no jump between two frames)?

  python decor/cycle_continuite.py <frames dir> [--out courbe.png]

Each frame (cycle_cuisson.mjs, f0000.png...) is laid on a grey and reduced to a quarter; the mean absolute change from the frame before is
measured (0..255). Prints the frames whose change stands out from their neighbours (a jump: more than 4 times the median of the 24 around
it, and above 0.6), and draws the curve with the stage borders of cycle.json."""
import sys, os, json
import numpy as np
from PIL import Image, ImageDraw

src = sys.argv[1]
out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(src, 'continuite.png')
meta = json.load(open(os.path.join(src, 'cycle.json'), encoding='utf-8'))
ims = sorted(x['i'] for x in meta['images'])


def load(i):
    im = Image.open(os.path.join(src, f'f{i:04d}.png')).convert('RGBA')
    im = im.resize((im.width // 4, im.height // 4), Image.BILINEAR)
    bg = Image.new('RGBA', im.size, (128, 128, 128, 255))
    bg.alpha_composite(im)
    return np.asarray(bg.convert('RGB'), dtype=np.float32)


prev, d = None, []
for i in ims:
    a = load(i)
    d.append(0.0 if prev is None else float(np.abs(a - prev).mean()))
    prev = a
d = np.array(d)
fps = meta['fps']
jumps = []
for k in range(1, len(d)):
    lo, hi = max(1, k - 12), min(len(d), k + 13)
    med = float(np.median(np.delete(d[lo:hi], k - lo)))
    if d[k] > 0.6 and d[k] > 4 * max(med, 0.05):
        jumps.append((ims[k], ims[k] / fps, d[k], med))
print(f'{len(d)} images, écart moyen {d[1:].mean():.3f}, maximum {d[1:].max():.2f} (image {ims[int(d[1:].argmax()) + 1]})')
for i, t, v, m in jumps:
    print(f'  à-coup image {i} ({t:.2f} s) : {v:.2f} contre {m:.2f} autour')
if not jumps:
    print('  aucun à-coup')
# the curve
W, H = 1200, 260
img = Image.new('RGB', (W, H), 'white')
dr = ImageDraw.Draw(img)
top = max(1.0, float(d.max()))
for t, lab in [(3, 'matin'), (11, 'déclin'), (18, 'fané'), (29, 'fin')]:
    x = int(t / meta['duree'] * W)
    dr.line([(x, 0), (x, H)], fill='#cccccc')
    dr.text((x + 3, 3), lab, fill='#666666')
pts = [(int(ims[k] / fps / meta['duree'] * W), H - 10 - int(d[k] / top * (H - 30))) for k in range(len(d))]
dr.line(pts, fill='#2a5d8a', width=2)
for i, t, v, m in jumps:
    x = int(t / meta['duree'] * W)
    dr.ellipse([x - 4, H - 10 - int(v / top * (H - 30)) - 4, x + 4, H - 10 - int(v / top * (H - 30)) + 4], outline='#c0392b', width=2)
img.save(out)
print(out)
