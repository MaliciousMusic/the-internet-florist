"""mesure_horizon.py: numbers of the horizon plane (decor/horizon.mjs), measured like decor/refs/horizon.md.

  python decor/mesure_horizon.py rangs  <dir>        ranks rendered alone on transparent (rang-C.png, rang-B.png, rang-A.png)
  python decor/mesure_horizon.py photo  <img> <x0,y0,x1,y1>     vegetation of a photo crop (sky pixels left out)
  python decor/mesure_horizon.py pre    <png>         far meadow band G, y 724-736 (render of the world frame, any width)
  python decor/mesure_horizon.py haut   <png>         height profile of the plane over the horizon (alpha), phone column

Light along the edge (defect 4): mean luminance of each column of 60 world units, half range p5-p95 over the mean.
Vegetation: L* (CIE), chroma C*, hue h (Lab) of the median, 90th and 10th percentiles of luminance; Michelson contrast
against the sky at the horizon of the photos (#a8c3dd, Y 0.526) and of the site (#dfe4e8, Y 0.769): (Ysky - Y) / (Ysky + Y) on the median. Clair:ombre = Y p90 / Y p10."""
import sys
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
YSKY = 0.526   # sky at the horizon of the photos and of the brief (#a8c3dd)
YSKYH = 0.769  # sky at the horizon of the site, provisional (#dfe4e8, chief 15 Oct.)


def srgb2lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lab(rgb):
    l = srgb2lin(np.asarray(rgb, float))
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    X, Y, Z = (l @ M.T).T
    X, Z = X / 0.95047, Z / 1.08883
    f = lambda t: np.where(t > (6 / 29) ** 3, np.cbrt(t), t / (3 * (6 / 29) ** 2) + 4 / 29)
    L = 116 * f(Y) - 16
    a = 500 * (f(X) - f(Y))
    b = 200 * (f(Y) - f(Z))
    return L, a, b, Y


def stats(px, name):
    L, a, b, Y = lab(px)
    o = np.argsort(L)
    n = len(o)
    pick = lambda q: o[min(n - 1, int(q * n))]
    out = []
    for q in (0.1, 0.5, 0.9):
        i = pick(q)
        out.append((L[i], np.hypot(a[i], b[i]), np.degrees(np.arctan2(b[i], a[i])) % 360, Y[i]))
    med = np.median(Y)
    mich = (YSKY - med) / (YSKY + med)
    mich2 = (YSKYH - med) / (YSKYH + med)
    # chroma and hue of the median band (40-60 %), more stable than one pixel
    band = o[int(0.4 * n):int(0.6 * n)]
    C = np.hypot(np.median(a[band]), np.median(b[band]))
    h = np.degrees(np.arctan2(np.median(b[band]), np.median(a[band]))) % 360
    print(f'{name}: L* p10 {out[0][0]:.1f} | p50 {out[1][0]:.1f} (C* {C:.1f}, h {h:.0f}) | p90 {out[2][0]:.1f}'
          f' | clair:ombre {out[2][3] / max(out[0][3], 1e-4):.1f}:1 | Michelson {mich:.2f} (ras #dfe4e8 : {mich2:.2f}) | {n} px')


def lisiere(Y, cover, width_px, name):
    """Light along the edge: mean luminance of the covered pixels in columns of width_px, half range p5-p95 / mean."""
    cols, cnt = [], []
    for x0 in range(0, Y.shape[1] - width_px + 1, width_px):
        m = cover[:, x0:x0 + width_px]
        cnt.append(m.sum())
        cols.append(Y[:, x0:x0 + width_px][m].mean() if m.sum() else np.nan)
    cols, cnt = np.array(cols), np.array(cnt)
    cols = cols[cnt >= 0.3 * np.median(cnt[cnt > 0])]
    print(f'{name}: lumière le long de la lisière (colonnes) ±{(np.percentile(cols, 95) - np.percentile(cols, 5)) / 2 / cols.mean() * 100:.0f} %'
          f', écart-type {cols.std() / cols.mean() * 100:.0f} % ({len(cols)} colonnes)')


def rangs(d):
    for r in ('C', 'B', 'A'):
        try:
            im = np.asarray(Image.open(f'{d}/rang-{r}.png').convert('RGBA'), float)
        except FileNotFoundError:
            continue
        m = im[..., 3] > 250
        stats(im[m][:, :3], f'rang {r}')
        _, _, _, Y = lab(im[..., :3].reshape(-1, 3))
        lisiere(Y.reshape(m.shape), m, max(1, round(60 * im.shape[1] / 2400)), f'rang {r}')


def photo(path, box):
    im = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = im.shape
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    c = im[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    br = c[..., 2] - c[..., 0]
    sky = np.percentile(br, 97, axis=1, keepdims=True)
    veg = br < 0.35 * np.maximum(sky, 1)
    stats(c[veg], path.replace('\\', '/').split('/')[-1] + ' ' + box)
    if len(sys.argv) > 4:  # column width in px covering 60 world units at the photo's scale (52 px at f 1618)
        _, _, _, Y = lab(c.reshape(-1, 3))
        lisiere(Y.reshape(veg.shape), veg, int(sys.argv[4]), 'photo')


def pre(path):
    im = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = im.shape
    s = H / 1350
    _, _, _, Y = lab(im.reshape(-1, 3))
    Y = Y.reshape(H, W)
    # band G (since 15 Oct.: y 722-736.5, faded to 739.5) between the feet of the edge and its bottom
    for y0, y1 in ((724, 727), (727, 731), (731, 736)):
        band = Y[int(y0 * s):int(y1 * s)].mean(axis=0)
        k = max(1, int(40 * W / 2400))
        sm = np.convolve(band, np.ones(k) / k, mode='valid')
        dev = (np.percentile(sm, 95) - np.percentile(sm, 5)) / 2 / sm.mean()
        print(f'pré y {y0}-{y1}: variation latérale ±{dev * 100:.1f} % (colonnes de 40 unités, p5-p95), Y moyen {sm.mean():.3f}')


def haut(path):
    im = np.asarray(Image.open(path).convert('RGBA'), float)
    H, W, _ = im.shape
    s = H / 1350
    al = im[:int(722 * s), :, 3] > 128
    top = np.where(al.any(axis=0), al.argmax(axis=0), int(722 * s))
    hgt = (722 * s - top) / s
    xs = np.arange(W) / W * 2400
    col = (xs >= 820) & (xs <= 1580)
    mid = (xs >= 1050) & (xs <= 1350)
    side = col & ~mid
    print(f'hauteur au-dessus de l\'horizon (unités) : médiane {np.median(hgt):.1f}, p90 {np.percentile(hgt, 90):.1f}, max {hgt.max():.1f}'
          f' | > 55 sur {(hgt > 55).mean() * 2400:.0f} unités de large | colonne : médiane {np.median(hgt[col]):.1f}, max {hgt[col].max():.1f}'
          f' | centre ±150 : médiane {np.median(hgt[mid]):.1f}, max {hgt[mid].max():.1f}'
          f' | côtés de la colonne (150-380) : médiane {np.median(hgt[side]):.1f}, p75 {np.percentile(hgt[side], 75):.1f},'
          f' max {hgt[side].max():.1f}, ≥ 30 sur {(hgt[side] >= 30).mean() * 100:.0f} %')
    for a, b in ((0, 400), (400, 820), (820, 1580), (1580, 2000), (2000, 2400)):
        m = (xs >= a) & (xs < b)
        print(f'  x {a}-{b}: médiane {np.median(hgt[m]):.1f}, max {hgt[m].max():.1f}, ciel ouvert au ras (< 3) {(hgt[m] < 3).mean() * 100:.0f} %')


if __name__ == '__main__':
    cmd, *rest = sys.argv[1:]
    {'rangs': lambda: rangs(rest[0]), 'photo': lambda: photo(rest[0], rest[1]), 'pre': lambda: pre(rest[0]),
     'haut': lambda: haut(rest[0])}[cmd]()
