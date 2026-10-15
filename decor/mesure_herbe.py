"""mesure_herbe.py: the numbers of refs/herbe.md measured on a meadow render or on a photo crop, same method.

  python decor/mesure_herbe.py scene <render.png> [--box x0,y0,x1,y1]    bands by distance on a world render
                                                                        (2400 x 1350 frame, any scale)
  python decor/mesure_herbe.py crop <img>:<x0,y0,x1,y1> [...]           one crop (fractions of the image)

Per zone: grass pixels only (green-ish, not sky); "ombre" p10, "moyen" p50, "clair" p90 of the luminance, with the
median colour of the pixels around each; HSV saturation and hue (medians); share of hues < 85 / 85-135 / > 135;
clair:ombre = ratio of linear luminance p90 / p10; lateral variation = +- of the column means (columns 1/40 of the
width, smoothed), in % of the mean."""
import sys, colorsys
import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
F, Y0, EYE = 1854, 722, 0.75


def lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def stats(a, label):
    px = a.reshape(-1, a.shape[-1])
    if px.shape[1] == 4:
        px = px[px[:, 3] > 200][:, :3]
    px = px.astype(float)
    r, g, b = px[:, 0], px[:, 1], px[:, 2]
    # grass: not sky (blue dominant), not grey pillar
    m = ~((b > g) & (b > r)) & ~((abs(r - g) < 6) & (abs(g - b) < 6))
    px = px[m]
    if len(px) < 50:
        print(f'{label}: trop peu de pixels'); return
    L = 0.299 * px[:, 0] + 0.587 * px[:, 1] + 0.114 * px[:, 2]
    Y = (lin(px) @ np.array([0.2126, 0.7152, 0.0722]))
    out = []
    for q in (10, 50, 90):
        v = np.percentile(L, q)
        sel = np.abs(L - v) < max(2, 0.03 * v)
        c = np.median(px[sel], axis=0)
        out.append('#%02x%02x%02x' % tuple(int(x) for x in c))
    hsv = np.array([colorsys.rgb_to_hsv(*(p / 255)) for p in px[:: max(1, len(px) // 20000)]])
    H = hsv[:, 0] * 360
    S = np.median(hsv[:, 1])
    ratio = np.percentile(Y, 90) / max(np.percentile(Y, 10), 1e-4)
    share = [(H < 85).mean() * 100, ((H >= 85) & (H <= 135)).mean() * 100, (H > 135).mean() * 100]
    print(f'{label}: ombre {out[0]} moyen {out[1]} clair {out[2]} | L p10/50/90 {np.percentile(L, 10):.0f}/{np.median(L):.0f}/{np.percentile(L, 90):.0f}'
          f' | sat {S:.2f} teinte {np.median(H):.0f} | <85 {share[0]:.0f} % 85-135 {share[1]:.0f} % >135 {share[2]:.0f} % | clair:ombre {ratio:.1f}:1')


def lateral(a, label):
    g = a[..., :3].astype(float)
    L = 0.299 * g[..., 0] + 0.587 * g[..., 1] + 0.114 * g[..., 2]
    W = L.shape[1]
    n = 40
    cols = np.array([L[:, int(i * W / n):int((i + 1) * W / n)].mean() for i in range(n)])
    cols = np.convolve(cols, np.ones(3) / 3, mode='valid')
    print(f'{label}: variation laterale +-{(cols.max() - cols.min()) / 2 / cols.mean() * 100:.1f} %')


def zdepth(y):
    return F * EYE / (y - Y0)


def scene(path, box=None):
    im = np.asarray(Image.open(path).convert('RGBA'))
    h, w, _ = im.shape
    s = w / 2400
    bands = [(731, 745, 'loin 60-170 m'), (745, 770, 'loin 29-60 m'), (770, 800, 'loin 18-29 m'), (800, 840, 'milieu 12-18 m'),
             (840, 900, 'milieu 8-12 m'), (900, 1040, 'milieu 4,4-8 m'), (1040, 1200, 'pres 2,9-4,4 m'), (1200, 1350, 'pres 2,2-2,9 m')]
    x0, x1 = (0, 2400) if not box else (box[0], box[2])
    for y0, y1, lab in bands:
        a = im[int(y0 * s):int(y1 * s), int(x0 * s):int(x1 * s)]
        if a.size == 0:
            continue
        stats(a, f'{lab:16s} y {y0}-{y1}')
        lateral(a, f'{"":16s}')


if __name__ == '__main__':
    if sys.argv[1] == 'scene':
        box = None
        if '--box' in sys.argv:
            box = [float(v) for v in sys.argv[sys.argv.index('--box') + 1].split(',')]
        scene(sys.argv[2], box)
    else:
        for arg in sys.argv[2:]:
            p, b = arg.rsplit(':', 1)
            im = np.asarray(Image.open(p).convert('RGB'))
            H, W, _ = im.shape
            x0, y0, x1, y1 = [float(v) for v in b.split(',')]
            a = im[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
            stats(a, p.split('/')[-1].split('\\')[-1] + ' ' + b)
            lateral(a, '')
