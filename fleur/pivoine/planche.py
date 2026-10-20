# planche.py <render.png> <out.jpg> <cw>...: the validation sheet of the peony's colourways (BONNES-PRATIQUES §16.9): for each colourway, its
# named photo cut out of its foliage and laid on the render's own beige ground, beside the render (one cell per colourway in render.png, in
# the order given). The cut-out keeps what is not foliage: green (a* < -6 with b* > 0), dark (L* < 18) or far from the flower's centre.
import sys, json
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
A = 'refcache/pivoine-herbacee-double/apparence'; C = 'refcache/pivoine-herbacee-double/cw'
R = json.load(open(A + '/reperes.json', encoding='utf-8'))
ren, out, cws = sys.argv[1], sys.argv[2], sys.argv[3:]

def lab(a):
    c = a / 255.; c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    x = c @ np.array([[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]]).T / [.95047, 1, 1.08883]
    f = np.where(x > .008856, np.cbrt(x), 7.787 * x + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

rim = Image.open(ren).convert('RGB'); bg = rim.getpixel((3, 3)); ch = rim.height // len(cws); T = 340
tiles = []
for i, cw in enumerate(cws):
    f = R[cw][0]; im = Image.open(f'{C}/{f}').convert('RGB')
    pts = [tuple(map(float, p.split(','))) for fr in (R[cw][1], R[cw][2]) for p in fr.split(';')[:3]]
    cx, cy = map(float, R['_coeur'][cw][1].split(';')[1].split(','))
    r = 1.08 * max(np.hypot(x - cx, y - cy) for x, y in pts)
    im = im.crop((int(cx - r), int(cy - r), int(cx + r), int(cy + r))).resize((T, T))
    import cv2  # GrabCut from the crop's frame, the heart forced as flower; the component that holds the centre is kept
    a = np.asarray(im)[..., ::-1].copy(); mk = np.full((T, T), cv2.GC_PR_BGD, np.uint8); yy, xx = np.mgrid[:T, :T]; d = np.hypot(xx - T / 2, yy - T / 2) / (T / 2)
    mk[d < .78] = cv2.GC_PR_FGD; mk[d < .22] = cv2.GC_FGD; mk[d > .99] = cv2.GC_BGD
    bgm = np.zeros((1, 65), np.float64); fgm = np.zeros((1, 65), np.float64); cv2.grabCut(a, mk, None, bgm, fgm, 6, cv2.GC_INIT_WITH_MASK)
    keep = ((mk == cv2.GC_FGD) | (mk == cv2.GC_PR_FGD)).astype(np.uint8); n, lb = cv2.connectedComponents(keep); keep = (lb == lb[T // 2, T // 2]) & (keep > 0)
    m = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    ph = Image.composite(im, Image.new('RGB', (T, T), bg), m)
    rc = rim.crop((0, i * ch, rim.width, (i + 1) * ch)); rc.thumbnail((T, T)); rr = Image.new('RGB', (T, T), bg); rr.paste(rc, ((T - rc.width) // 2, (T - rc.height) // 2))
    t = Image.new('RGB', (2 * T, T + 22), 'white'); t.paste(ph, (0, 22)); t.paste(rr, (T, 22))
    ImageDraw.Draw(t).text((6, 5), '%s : photo %s (detouree, fond beige) | rendu' % (cw, f.split('_')[0]), fill='black'); tiles.append(t)
cols = 2; rows = (len(tiles) + cols - 1) // cols; S = Image.new('RGB', (cols * 2 * T + 10, rows * (T + 26)), 'white')
for i, t in enumerate(tiles): S.paste(t, ((i % cols) * (2 * T + 10), (i // cols) * (T + 26)))
S.save(out, quality=88); print(out, S.size)
