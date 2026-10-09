"""organ.py : numbers for the plant (stem and leaf) on a photograph or a render, before any picture is opened.

  python -P fleur/organ.py stem <img> "x0,y0,x1,y1" [--head <px>] [--green] [--tol 40]
      the stem in the crop (the largest silhouette away from the crop's corners, or the green pixels with --green): its axis (principal
      direction), its width measured across the axis along it (median, at 20 % and 80 % of its length from the crop's lower end : the
      taper), its bend (largest gap between the axis line and the midline, x length), and three tones (shade, body, light : the 10th, 50th
      and 90th percentile of the brightness inside it, as #rrggbb). --head : the flower's width in px on the same image -> stem / flower.
  python -P fleur/organ.py leaf <img> "x0,y0,x1,y1" [--green] [--tol 40]
      the leaf in the crop: length along its axis over its largest width (L/W, blade and whole), the petiole's share (the narrow run at
      one end, width < 22 % of the largest), the lobes (how many times the width profile dips by more than 12 % of the largest width
      along the blade), its three tones.
  python -P fleur/organ.py head <img> "x0,y0,x1,y1" [--tol 40]  -> width and height of the non-green silhouette (the flower)
On a render the background is the sheet's #e9e4dc. Boxes are pixels of the image.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image


def opts(a):
    o, p, i = {}, [], 0
    while i < len(a):
        if a[i].startswith('--'):
            k = a[i][2:]
            if i + 1 < len(a) and not a[i + 1].startswith('--'):
                o[k] = a[i + 1]
                i += 2
            else:
                o[k] = '1'
                i += 1
        else:
            p.append(a[i])
            i += 1
    return o, p


def crop(path, box):
    im = Image.open(path).convert('RGB')
    if box and box != 'all':
        x0, y0, x1, y1 = [int(float(v)) for v in box.split(',')]
        im = im.crop((x0, y0, x1, y1))
    return np.asarray(im).astype(float)


def hsv(a):
    r, g, b = a[..., 0] / 255, a[..., 1] / 255, a[..., 2] / 255
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = np.where(mx > 0, (mx - mn) / (mx + 1e-9), 0)
    return h, s, mx


def mask(a, green=False, tol=40, nongreen=False):
    h, w, _ = a.shape
    if green or nongreen:
        H, S, V = hsv(a)
        g = (H > 55) & (H < 170) & (S > .18) & (V > .12)
        m = (~g) & (S > .25) & (V > .2) if nongreen else g
    else:
        k = max(2, min(h, w) // 12)
        cs = np.concatenate([a[:k, :k].reshape(-1, 3), a[:k, -k:].reshape(-1, 3), a[-k:, :k].reshape(-1, 3), a[-k:, -k:].reshape(-1, 3)])
        bg = np.median(cs, axis=0)
        m = np.abs(a - bg).sum(axis=2) > tol
    return largest(m)


def largest(m):
    h, w = m.shape
    lab = np.zeros(m.shape, int)
    best, bn, n = 0, 0, 0
    for y0 in range(0, h, 2):
        for x0 in range(0, w, 2):
            if not m[y0, x0] or lab[y0, x0]:
                continue
            n += 1
            q = deque([(y0, x0)])
            lab[y0, x0] = n
            c = 0
            while q:
                y, x = q.popleft()
                c += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < h and 0 <= xx < w and m[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = n
                        q.append((yy, xx))
            if c > bn:
                bn, best = c, n
    return lab == best if best else m


def axis(m):
    ys, xs = np.nonzero(m)
    P = np.stack([xs, ys], 1).astype(float)
    c = P.mean(0)
    u, s, vt = np.linalg.svd(P - c, full_matrices=False)
    d = vt[0]
    if d[1] < 0:
        d = -d  # pointing down the image
    n = np.array([-d[1], d[0]])
    t = (P - c) @ d
    q = (P - c) @ n
    return P, c, d, n, t, q


def profile(m, nb=40):
    P, c, d, n, t, q = axis(m)
    t0, t1 = t.min(), t.max()
    L = t1 - t0
    bins = np.linspace(t0, t1, nb + 1)
    W, M = [], []
    for i in range(nb):
        s = (t >= bins[i]) & (t < bins[i + 1])
        if s.sum() < 2:
            W.append(0)
            M.append(0)
            continue
        W.append(q[s].max() - q[s].min() + 1)
        M.append((q[s].max() + q[s].min()) / 2)
    return np.array(W), np.array(M), L


def tones(a, m):
    px = a[m]
    br = px.mean(1)
    out = []
    for pc in (10, 50, 90):
        v = np.percentile(br, pc)
        s = px[np.abs(br - v) <= max(4, br.std() * .15)]
        c = np.median(s, 0) if len(s) else px.mean(0)
        out.append('#%02x%02x%02x' % tuple(int(x) for x in c))
    return out


def stem(a, o):
    m = mask(a, 'green' in o, int(o.get('tol', 40)))
    W, M, L = profile(m)
    nb = len(W)
    core = W[int(nb * .1):int(nb * .9)]
    med = float(np.median(core[core > 0])) if (core > 0).any() else 0
    lo = float(np.median(W[int(nb * .7):int(nb * .9)]))  # lower end of the crop
    hi = float(np.median(W[int(nb * .1):int(nb * .3)]))
    bend = float(np.abs(M[int(nb * .1):int(nb * .9)] - np.linspace(M[int(nb * .1)], M[int(nb * .9) - 1], len(core))).max()) / L if L else 0
    r = f'tige : longueur {L:.0f} px, largeur mediane {med:.1f} px (haut {hi:.1f}, bas {lo:.1f} : effilement bas/haut {lo / max(hi, 1e-6):.2f}), L/l {L / max(med, 1e-6):.1f}, fleche {bend:.3f} x L'
    if 'head' in o:
        r += f" ; tige / fleur = 1/{float(o['head']) / max(med, 1e-6):.1f}"
    print(r)
    print('tons (ombre, corps, lumiere) :', ' '.join(tones(a, m)))


def leaf(a, o):
    m = mask(a, 'green' in o, int(o.get('tol', 40)))
    W, M, L = profile(m, 60)
    wm = W.max()
    nb = len(W)
    # the petiole: the narrow run at the end farthest from the widest bin
    iw = int(W.argmax())
    pet = 0
    rng = range(nb - 1, -1, -1) if iw < nb / 2 else range(nb)
    for i in rng:
        if W[i] < .22 * wm:
            pet += 1
        else:
            break
    blade = nb - pet
    Lb = L * blade / nb
    lob, prev, down = 0, None, False
    seg = W[:blade] if iw < nb / 2 else W[pet:]
    for i in range(1, len(seg) - 1):
        if seg[i] < seg[i - 1] - .12 * wm and not down:
            down = True
        elif seg[i] > seg[i - 1] + .12 * wm and down:
            lob += 1
            down = False
    print(f'feuille : longueur {L:.0f} px, plus grande largeur {wm:.0f} px, L/l entiere {L / wm:.2f}, limbe L/l {Lb / wm:.2f}, '
          f'petiole {pet / nb:.2f} de la longueur (petiole/limbe {pet / max(blade, 1):.2f}), creux du profil {lob}')
    print('tons (ombre, corps, lumiere) :', ' '.join(tones(a, m)))


def head(a, o):
    m = mask(a, nongreen=True, tol=int(o.get('tol', 40)))
    ys, xs = np.nonzero(m)
    print(f'fleur : largeur {xs.max() - xs.min() + 1} px, hauteur {ys.max() - ys.min() + 1} px')


if __name__ == '__main__':
    o, p = opts(sys.argv[1:])
    if len(p) < 2:
        print(__doc__)
        sys.exit(1)
    a = crop(p[1], p[2] if len(p) > 2 else 'all')
    {'stem': stem, 'leaf': leaf, 'head': head}[p[0]](a, o)
