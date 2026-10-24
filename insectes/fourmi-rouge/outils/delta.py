"""delta.py: every photo | render pair of the red ant measured by region (PROTOCOLE §5.2): the head, the mesosoma, the waist's nodes,
the gaster and the legs, each the median colour (ΔE2000 render against photo), the tone contrast (std of L*, render / photo) and the
fine grain (std of L* minus its blur at 3 px, render / photo). Run after outils/paires.py, which rendered planches/paire-<nom>.png.

  python insectes/fourmi-rouge/outils/delta.py [--only i,j] [--json out.json]
The photo is cropped (and turned) as paires.py does, brought to the render's size, cut from its ground (the colour of its border, a
ΔE over 14), and fitted onto the render along the body's length (the ant lies along x in every pair but the face). The trunk is the
mask opened by a disc of 2.5 % of the length; the legs and antennae are the rest. The regions cut the trunk at the model's landmarks
as fractions of its length (mandibles' tip to gaster's tip). Verdicts: ΔE ≤ 6, contrast and grain within 0.7..1.4."""
import sys, os, json
import numpy as np
import cv2
from PIL import Image, ImageOps
from skimage import color

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
SP = os.path.join(HERE, '..')
# landmarks along x (mm, model): mandibles' tip 2.85, head / mesosoma 1.47, mesosoma / petiole 0, postpetiole / gaster -0.87, tip -2.62
CUTS = [('tete', 0.0, 0.253), ('mesosome', 0.253, 0.523), ('noeuds', 0.523, 0.683), ('gastre', 0.683, 1.0)]


def mask_of(rgb, render=False):
    lab = color.rgb2lab(rgb / 255.)
    b = np.concatenate([lab[:6].reshape(-1, 3), lab[-6:].reshape(-1, 3), lab[:, :6].reshape(-1, 3), lab[:, -6:].reshape(-1, 3)])
    bg = np.median(b, 0)
    d = np.linalg.norm(lab - bg, axis=2)
    if render: m = d > 6
    # a photo: the cuticle is red-brown or dark, never green (a leaf), never pale and dull (paper, sand); highlights are filled after
    else: m = ((lab[..., 1] > 11) & (lab[..., 0] < 88) & (d > 10)) | ((lab[..., 0] < 28) & (d > 10))
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    if not render: m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lb, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        big = st[1:, cv2.CC_STAT_AREA].max(); keep = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.02 * big]
        m = np.isin(lb, keep)
    from scipy import ndimage
    return ndimage.binary_fill_holes(m > 0), lab


def trunk(m, L):
    r = max(1, int(round(0.025 * L)))
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    t = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, k) > 0
    n, lb, st, _ = cv2.connectedComponentsWithStats(t.astype(np.uint8))
    if n > 1:
        big = st[1:, cv2.CC_STAT_AREA].max(); keep = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.03 * big]
        t = np.isin(lb, keep)
    return t


def stats(lab, sel):
    if sel.sum() < 30: return None
    L = lab[..., 0]
    g = L - cv2.GaussianBlur(L.astype(np.float32), (0, 0), 3)
    return {'lab': np.median(lab[sel], 0), 'c': float(L[sel].std()), 'g': float(g[sel].std()), 'n': int(sel.sum())}


def regions(lab, m, flip):
    ys, xs = np.nonzero(m)
    T = trunk(m, xs.max() - xs.min())
    ty, tx = np.nonzero(T)
    x0, x1 = tx.min(), tx.max()
    out = {}
    X = np.arange(m.shape[1])[None, :].repeat(m.shape[0], 0)
    for name, f0, f1 in CUTS:
        a, b = (x0 + (x1 - x0) * f0, x0 + (x1 - x0) * f1) if not flip else (x1 - (x1 - x0) * f1, x1 - (x1 - x0) * f0)
        out[name] = stats(lab, T & (X >= a) & (X < b))
    out['pattes'] = stats(lab, m & ~T)
    out['entier'] = stats(lab, m)
    return out


def main():
    a = sys.argv[1:]
    only = [int(x) for x in a[a.index('--only') + 1].split(',')] if '--only' in a else None
    cfg = json.load(open(os.path.join(SP, 'paires.json'), encoding='utf-8'))
    ref = os.path.join(SP, '..', '..', 'refcache', cfg['sid'])
    res = {}
    print('%-20s %-9s %6s %6s %6s  %s' % ('paire', 'région', 'ΔE', 'contr.', 'grain', 'verdict'))
    for i, p in enumerate(cfg['pairs']):
        if only and i not in only: continue
        r = np.asarray(Image.open(os.path.join(SP, 'planches', 'paire-%s.png' % p['nom'])).convert('RGB')).astype(np.float32)
        ph = Image.open(os.path.join(ref, p['photo'])).convert('RGB')
        if p.get('rot'): b = p['box']; ph = ph.rotate(p['rot'], resample=Image.BICUBIC, center=((b[0] + b[2]) / 2, (b[1] + b[3]) / 2), fillcolor='#efe9df')
        ph = ImageOps.expand(ph, border=800, fill='#efe9df').crop(tuple(v + 800 for v in p['box']))
        if p.get('flip'): ph = ImageOps.mirror(ph)
        ph = np.asarray(ph.resize((r.shape[1], r.shape[0]), Image.LANCZOS)).astype(np.float32)
        mr, lr = mask_of(r, True); mp, lp = mask_of(ph)
        # the render's head is to the left at az 90, to the right at az 270: the regions run from the head
        az = int(p['vue'].split(':')[1]) % 360
        flip = az > 180
        face = p['nom'].startswith('face')
        if face:
            Rr, Rp = {'entier': stats(lr, mr)}, {'entier': stats(lp, mp)}
        else:
            Rr, Rp = regions(lr, mr, flip), regions(lp, mp, flip)
        res[p['nom']] = {}
        for k in Rr:
            A, B = Rr[k], Rp.get(k)
            if not A or not B: continue
            de = float(color.deltaE_ciede2000(A['lab'][None, None], B['lab'][None, None])[0, 0])
            cr, gr = A['c'] / max(B['c'], 1e-3), A['g'] / max(B['g'], 1e-3)
            ok = de <= 6 and 0.7 <= cr <= 1.4 and 0.7 <= gr <= 1.4
            res[p['nom']][k] = {'dE': round(de, 1), 'contraste': round(cr, 2), 'grain': round(gr, 2), 'ok': ok,
                                'photo': '#%02x%02x%02x' % tuple(int(v * 255) for v in np.clip(color.lab2rgb(B['lab'][None, None])[0, 0], 0, 1)),
                                'rendu': '#%02x%02x%02x' % tuple(int(v * 255) for v in np.clip(color.lab2rgb(A['lab'][None, None])[0, 0], 0, 1))}
            print('%-20s %-9s %6.1f %6.2f %6.2f  %s  photo %s rendu %s' % (p['nom'], k, de, cr, gr, 'ok' if ok else 'KO', res[p['nom']][k]['photo'], res[p['nom']][k]['rendu']))
    # the synthesis by region over the pairs: the mean render against the mean photo, and the photos' own spread (each photo's ΔE to
    # their mean): one albedo under one light cannot sit closer to every photo than the photos sit to each other
    hx = lambda h: color.rgb2lab(np.array([[[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]]]))[0, 0]
    print('\nsynthèse     ΔE moyen  dispersion photos  verdict')
    syn = {}
    for k in ['tete', 'mesosome', 'noeuds', 'gastre', 'pattes']:
        P = [hx(v[k]['photo']) for v in res.values() if k in v]; R = [hx(v[k]['rendu']) for v in res.values() if k in v]
        if len(P) < 2: continue
        mp, mr = np.mean(P, 0), np.mean(R, 0)
        de = float(color.deltaE_ciede2000(mr[None, None], mp[None, None])[0, 0])
        sp = float(np.mean([color.deltaE_ciede2000(x[None, None], mp[None, None])[0, 0] for x in P]))
        ok = de <= max(6, sp)
        syn[k] = {'dE': round(de, 1), 'dispersion': round(sp, 1), 'ok': ok}
        print('%-12s %6.1f %12.1f        %s' % (k, de, sp, 'ok' if ok else 'KO'))
    res['_synthese'] = syn
    if '--json' in a: json.dump(res, open(a[a.index('--json') + 1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
