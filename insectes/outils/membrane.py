"""membrane.py: a membranous wing (bee, bumblebee) of a spread specimen on a light plate, laid flat in its own frame and read as
numbers (PROTOCOLE §3.4, aile.py adapted to a transparent membrane). Where aile.py reads the colours of scales, a membrane is seen
against the plate behind it: each pixel is the plate's light passed through the membrane, so the measure is the share of the light
it lets through, channel by channel (the plate fitted by a smooth surface where it shows), turned into what the runtime can draw over
any ground: a colour C over an opacity a (out = a C + (1 - a) ground), the least opaque pair that gives the measured light
(the pair that best passes the measured light over any ground, from black to white: over_pair).

  python insectes/outils/membrane.py plat <cadres.json> <nom> [--r 40] [--k 3]
  python insectes/outils/membrane.py paire <cadres.json> <nom> <rendu.png>      the flat render (over the same plate) against the photo

<cadres.json> (insectes/<id>/ailes/cadres.json, numbers only), per wing: photo (refcache/<sid>/...), pxmm, hinge, axe (tail then head,
px), side (g|d) as in aile.py; and `contour`: a polygon (px) drawn outside the wing's free edges and ON its limit with the other wing
(read on the gridded photo: two membranes over each other read darker, and SAM does not part them); the wing is that polygon where the
specimen stands off the plate (aile.ground). `cache` (optional, mm in the wing frame): the strip hidden under the other wing, added to
the mask and filled from its neighbours, as aile.py's `complete`.

Writes refcache/<sid>/ailes/<nom>/ (pixels: never in git): plat.png (the wing flat over its plate, r px/mm), fond.png (the plate
alone), masque.png, controle.jpg; and insectes/<id>/ailes/<nom>.json (numbers only): the outline, the zones of the membrane (colour,
opacity, contours), the veins (aile.veins: strokes with their width and colour), the papillae of the distal membrane (their region,
density, size and colour), the wing's length."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from aile import frame, ground, flat, veins, outline, poly_mm, lab_of, hexof, de2000  # noqa: E402


def lin(x):
    x = x.astype(np.float32) / 255
    return np.where(x > 0.04045, ((x + 0.055) / 1.055) ** 2.4, x / 12.92)


def srgb(x):
    x = np.clip(x, 0, 1)
    return (np.where(x > 0.0031308, 1.055 * x ** (1 / 2.4) - 0.055, 12.92 * x) * 255 + 0.5).astype(np.uint8)


def plate_fit(rgb, spec):
    """the plate's light where the specimen is not, per channel (linear), fitted by a quadratic surface (the studio's gradient)"""
    small = cv2.resize(lin(rgb), (rgb.shape[1] // 8, rgb.shape[0] // 8), interpolation=cv2.INTER_AREA)
    sm = cv2.resize((~spec).astype(np.uint8), (rgb.shape[1] // 8, rgb.shape[0] // 8), interpolation=cv2.INTER_NEAREST) > 0
    sm = cv2.erode(sm.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    ys, xs = np.nonzero(sm)
    A = lambda X, Y: np.stack([np.ones_like(X), X, Y, X * X, Y * Y, X * Y], -1).astype(np.float64)
    YY, XX = np.mgrid[:rgb.shape[0], :rgb.shape[1]]
    G = np.zeros(rgb.shape, np.float32)
    for c in range(3):
        f = np.linalg.lstsq(A(xs / 100, ys / 100), small[ys, xs, c], rcond=None)[0]
        G[..., c] = (A(XX / 800, YY / 800) @ f).astype(np.float32)
    return G


def over_pair(T):
    """the colour over opacity that best passes T (linear, per channel) of any ground's light, B from black to white: per channel the
    error of a C + (1 - a) B against T B, squared and summed over B in [0, 1], is k0^2 + k0 k1 + k1^2 / 3 (k0 = a C, k1 = 1 - a - T);
    for one a, the best C is (T - 1 + a) / (2 a) kept in [0, 1]; a is searched. A filter cannot be laid over a ground exactly: on a
    white ground it lets the measured light through, on a black one it adds a little of its hue (the membrane's sheen, which the
    engine also draws by its Fresnel term)"""
    T = np.atleast_2d(T); best = None
    for a in np.linspace(0.002, 1, 500):
        C = np.clip((T - 1 + a) / (2 * a), 0, 1); k0 = a * C; k1 = 1 - a - T
        e = (k0 * k0 + k0 * k1 + k1 * k1 / 3).sum(-1)
        if best is None: best = (e, np.full(T.shape[0], a), C)
        else:
            w = e < best[0]; best[0][w] = e[w]; best[1][w] = a; best[2][w] = C[w]
    return best[1], best[2]


def papillae(img, mm, vm, org, r, T):
    """the dark points of the distal membrane (microtrichia and papillae): the black-hat of L* over 0.06 mm, the points kept where they
    stand 4 L* under their surround; their region (a density over 30 per mm2, closed over 0.4 mm), density, size and colour"""
    s0, q1, _ = org
    L = lab_of(img)[..., 0]
    k = max(3, int(0.08 * r) | 1)
    bh = cv2.morphologyEx(L, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    pt = (bh > 4) & mm & ~cv2.dilate(vm.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    n, lb, st, cen = cv2.connectedComponentsWithStats(pt.astype(np.uint8))
    keep = (st[1:, cv2.CC_STAT_AREA] >= 1) & (st[1:, cv2.CC_STAT_AREA] <= (0.05 * r) ** 2 * 3)
    C = cen[1:][keep]; A = st[1:, cv2.CC_STAT_AREA][keep]
    dens = np.zeros(mm.shape, np.float32)
    for x, y in C: dens[int(y), int(x)] += 1
    win = int(0.5 * r) | 1
    dmap = cv2.boxFilter(dens, -1, (win, win), normalize=False) / (win / r) ** 2      # points per mm2
    reg = (dmap > 30) & mm
    reg = cv2.morphologyEx(reg.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.4 * r) | 1,) * 2)) > 0
    reg &= mm
    if reg.sum() < 0.5 * r * r: return None
    inreg = reg[C[:, 1].astype(int), C[:, 0].astype(int)]
    lab = lab_of(img)
    cols = np.array([lab[int(y), int(x)] for x, y in C[inreg]])
    dm = float(inreg.sum() / (reg.sum() / r / r))
    # the points' own darkness against the membrane around them, as the opacity of a dark point drawn over the membrane
    Lm = float(np.median(L[reg & ~pt])); Lp = float(np.median(cols[:, 0]))
    return {'poly': poly_mm(reg, org, r, 0.05, 0.3), 'densite': round(dm, 1), 'taille': round(float(2 * np.sqrt(np.median(A[inreg]) / np.pi) / r), 3),
            'c': hexof(np.median(cols, 0)), 'contraste': round(Lm - Lp, 1), 'aire': round(float(reg.sum() / r / r), 2)}


def cmd_plat(o):
    Cf = json.load(open(o.cadres, encoding='utf-8')); c = Cf[o.nom]; sid = Cf['_sid']
    out = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom); os.makedirs(out, exist_ok=True)
    rgb = cv2.imread(os.path.join(ROOT, 'refcache', sid, c['photo']))[..., ::-1].copy()
    spec = ground(rgb, c['pxmm'])
    G = plate_fit(rgb, spec)
    poly = np.zeros(rgb.shape[:2], np.uint8); cv2.fillPoly(poly, [np.array(c['contour'], np.int32)], 1)
    m = spec & (poly > 0)
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))) > 0
    n_, lb_, st_, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    if n_ > 2: m = lb_ == (1 + np.argmax(st_[1:, cv2.CC_STAT_AREA]))
    from scipy import ndimage
    m = ndimage.binary_fill_holes(m)
    img, mm, org = flat(rgb, m, c, o.r)
    Gs = np.stack([cv2.remap(G[..., i], *_maps(c, org, mm.shape, o.r), cv2.INTER_LINEAR) for i in range(3)], -1)
    s0, q1, r = org
    hid = np.zeros(mm.shape, bool)
    if c.get('cache'):
        add = np.zeros(mm.shape, np.uint8)
        for P in c['cache']: cv2.fillPoly(add, [np.array([[(x - s0) * r, (q1 - y) * r] for x, y in P], np.int32)], 1)
        hid = (add > 0) & ~mm; mm = mm | hid
    vis = mm & ~hid
    if hid.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~vis, return_indices=True)
        img[hid] = img[iy[hid], ix[hid]]
    V, vm = veins(img, mm, org, r, None, wmax=0.3, thr=8.0)
    # the light let through, per channel, against the plate behind
    T = np.clip(lin(img) / np.maximum(Gs, 1e-3), 0, 1.2)
    a, Cc = over_pair(np.minimum(T, 1))
    memb = mm & ~cv2.dilate(vm.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
    P = papillae(img, mm, vm, org, r, T)
    # zones of the membrane: k-means on the light let through (blurred over 0.3 mm), small islands given to their surround
    Tb = cv2.GaussianBlur(np.where(memb[..., None], T, 0).astype(np.float32), (0, 0), 0.3 * r)
    wb = cv2.GaussianBlur(memb.astype(np.float32), (0, 0), 0.3 * r)
    Tb = Tb / np.maximum(wb[..., None], 1e-3)
    X = Tb[mm].reshape(-1, 3).astype(np.float32)
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 1e-4)
    _, lab_k, cen = cv2.kmeans(X, o.k, None, crit, 4, cv2.KMEANS_PP_CENTERS, )
    order = np.argsort(-cen.mean(1))                       # the clearest membrane first: zone 0 fills the outline
    rank = np.empty(o.k, int); rank[order] = np.arange(o.k)
    Z = np.full(mm.shape, -1, int); Z[mm] = rank[lab_k.ravel()]
    for z in range(1, o.k):
        zz = (Z == z).astype(np.uint8)
        nz, lz, sz, _ = cv2.connectedComponentsWithStats(zz)
        for i in range(1, nz):
            if sz[i, cv2.CC_STAT_AREA] < 0.6 * r * r: Z[lz == i] = 0
    zones = []
    for z in range(o.k):
        sel = (Z == z) & memb
        if sel.sum() < 50: continue
        Tz = np.median(T[sel], 0); az, Cz = over_pair(Tz[None])
        rec = {'zone': z, 'a': round(float(az[0]), 3), 'c': '#%02x%02x%02x' % tuple(srgb(Cz[0])), 'transmis': [round(float(v), 3) for v in Tz],
               'part': round(float(sel.sum() / memb.sum()), 3)}
        if z > 0: rec['poly'] = poly_mm(Z == z, org, r, 0.05, 0.3)
        zones.append(rec)
    ol = outline(mm, org, r)
    rec = {'_doc': 'membrane.py plat: contours, nervures et lumière transmise mesurés sur %s (repère : s vers l\'extérieur depuis la charnière, '
                   'q vers la tête, mm). Des chiffres, jamais l\'image.' % c['photo'], 'photo': c['photo'], 'pxmm': c['pxmm'], 'r': r,
           'origine': [round(s0, 3), round(q1, 3)], 'taille': [int(mm.shape[1]), int(mm.shape[0])], 'longueur': round(max(p[0] for p in ol), 2),
           'contour': ol, 'zones': zones, 'nervures': V, 'papilles': P, 'cache': round(float(hid.sum() / mm.sum()), 3),
           'fond': '#%02x%02x%02x' % tuple(srgb(np.median(Gs[mm], 0)))}
    dst = os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.nom + '.json')
    json.dump(rec, open(dst, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
    cv2.imwrite(os.path.join(out, 'plat.png'), img[..., ::-1])
    cv2.imwrite(os.path.join(out, 'fond.png'), srgb(Gs)[..., ::-1])
    cv2.imwrite(os.path.join(out, 'masque.png'), mm.astype(np.uint8) * 255)
    zim = np.full(img.shape, 239, np.uint8)
    pal = [(255, 230, 200), (200, 150, 110), (120, 80, 60), (60, 40, 30)]
    for z in range(o.k): zim[Z == z] = pal[min(z, 3)]
    zim[vm] = (40, 20, 10)
    if P:
        pm = np.zeros(mm.shape, np.uint8)
        for poly_ in P['poly']: cv2.polylines(pm, [np.array([[(x - s0) * r, (q1 - y) * r] for x, y in poly_], np.int32)], True, 1, 2)
        zim[pm > 0] = (255, 0, 255)
    am = srgb(np.dstack([a] * 3) * 4)
    cv2.imwrite(os.path.join(out, 'controle.jpg'), np.concatenate([img, zim, am], 1)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(dst, '%.0f Ko' % (os.path.getsize(dst) / 1024), 'longueur %.2f mm' % rec['longueur'], 'caché %.1f %%' % (100 * rec['cache']))
    for z in zones: print('  zone', z['zone'], z['c'], 'a %.3f' % z['a'], 'transmis', z['transmis'], 'part %.2f' % z['part'])
    if P: print('  papilles : %.0f par mm², %.3f mm, %s, contraste %.1f L*, %.1f mm²' % (P['densite'], P['taille'], P['c'], P['contraste'], P['aire']))


def _maps(c, org, shape, r):
    h, es, eq = frame(c); pxmm = c['pxmm']; s0, q1, _ = org; H, W = shape
    S, Q = np.meshgrid(s0 + (np.arange(W) + .5) / r, q1 - (np.arange(H) + .5) / r)
    return (h[0] + (S * es[0] + Q * eq[0]) * pxmm).astype(np.float32), (h[1] + (S * es[1] + Q * eq[1]) * pxmm).astype(np.float32)


def cmd_paire(o):
    """the flat render of the wing over the same plate against the flattened photo: ΔE2000 per cell of 1 mm (the colour field blurred
    over 0.1 mm), the veins' cover, and the grain (the papillae) per cell; an image photo | render | ΔE"""
    Cf = json.load(open(o.cadres, encoding='utf-8')); sid = Cf['_sid']
    d = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom)
    P = cv2.imread(os.path.join(d, 'plat.png'))[..., ::-1]; M = cv2.imread(os.path.join(d, 'masque.png'), 0) > 127
    R = cv2.imread(o.rendu)[..., ::-1]
    if R.shape != P.shape: R = cv2.resize(R, (P.shape[1], P.shape[0]), interpolation=cv2.INTER_AREA)
    rec = json.load(open(os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.nom + '.json'), encoding='utf-8')); r = rec['r']
    m = cv2.erode(M.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    lp, lr = lab_of(P), lab_of(R)
    bl = lambda x: cv2.GaussianBlur(x, (0, 0), 0.1 * r)
    dE = de2000(bl(lp), bl(lr)); dE[~m] = 0
    cell = int(1 * r); rows = []
    for gy in range(0, P.shape[0], cell):
        for gx in range(0, P.shape[1], cell):
            mk = m[gy:gy + cell, gx:gx + cell]
            if mk.sum() < 0.4 * cell * cell: continue
            Lp = lp[gy:gy + cell, gx:gx + cell, 0]; Lr = lr[gy:gy + cell, gx:gx + cell, 0]
            gp = np.std((Lp - cv2.GaussianBlur(Lp, (0, 0), 1.5))[mk]); gr = np.std((Lr - cv2.GaussianBlur(Lr, (0, 0), 1.5))[mk])
            rows.append({'dE': round(float(np.median(dE[gy:gy + cell, gx:gx + cell][mk])), 1), 'grain': round(float(gr / max(.2, gp)), 2),
                         'contraste': round(float(np.std(Lr[mk]) / max(.5, np.std(Lp[mk]))), 2)})
    de = np.array([x['dE'] for x in rows]); gra = np.array([x['grain'] for x in rows]); con = np.array([x['contraste'] for x in rows])
    res = {'cases': len(rows), 'dE_med': round(float(np.median(de)), 1), 'dE_p90': round(float(np.percentile(de, 90)), 1), 'ko': int((de > 6).sum()),
           'grain_med': round(float(np.median(gra)), 2), 'contraste_med': round(float(np.median(con)), 2)}
    json.dump({'resume': res, 'cases': rows}, open(os.path.join(d, 'paire.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    hm = np.ascontiguousarray(cv2.applyColorMap(np.clip(dE * 255 / 12, 0, 255).astype(np.uint8), cv2.COLORMAP_INFERNO)[..., ::-1])
    Pb = P.copy(); Pb[~M] = 239; Rb = R.copy(); Rb[~M] = 239
    cv2.imwrite(os.path.join(d, 'paire.jpg'), np.concatenate([Pb, Rb, hm], 1)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(json.dumps(res, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd')
    a = sp.add_parser('plat'); a.add_argument('cadres'); a.add_argument('nom'); a.add_argument('--r', type=float, default=40); a.add_argument('--k', type=int, default=3)
    b = sp.add_parser('paire'); b.add_argument('cadres'); b.add_argument('nom'); b.add_argument('rendu')
    o = ap.parse_args()
    {'plat': cmd_plat, 'paire': cmd_paire}[o.cmd](o)


if __name__ == '__main__':
    main()
