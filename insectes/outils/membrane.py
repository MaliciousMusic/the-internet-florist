"""membrane.py: a transparent wing (bee, bumblebee, wasp, fly) laid flat in its own frame and read in numbers (PROTOCOLE §3.3, §4.4),
the counterpart of aile.py for a membrane without scales: what is measured is not a pattern of zones but the veins, the outline and
how much the membrane lets through and tints the ground behind it. Runs in vases5/.venv-depth (SAM facebook/sam-vit-base).

  vases5/.venv-depth/Scripts/python insectes/outils/membrane.py plat <cadres.json> <nom> [--r 40] [--sam]
  python insectes/outils/membrane.py paire <cadres.json> <nom> <rendu_plat.png>     photo against render, flat, cells of 1 mm

<cadres.json> (insectes/<id>/ailes/cadres.json, numbers only), per wing, as aile.py: photo, pxmm (or longueur_mm: the wing's length,
for a photo without a scale bar), hinge, axe (tail then head, px), side, box, pos, neg, retirer (polygon, px: the other wing where SAM
cannot part them), plaque: "claire" (a light plate: veins dark on light) or "sombre".
Measured, in the frame of aile.py (s outward from the hinge, q toward the head, mm):
  contour     the outline (simplified to 0.03 mm)
  nervures    the veins as stroked polylines, grouped by width (0.04 mm steps) and colour (aile.py veins)
  membrane    over a light plate: the transmission per channel (the membrane against the plate around the wing, linear RGB), its median,
              the tint it gives a white ground, and the same per cell of 1 mm (from the base to the tip the membrane clears)
  grain       the fine texture of the membrane (microtrichia and wrinkles): the spread of L* once its 0.25 mm blur is taken off
Writes refcache/<sid>/ailes/<nom>/ (photo pixels: never in git): plat.png, masque.png, nervures.png, controle.jpg; and
insectes/<id>/ailes/<nom>.json."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import aile  # noqa: E402

ROOT = aile.ROOT
lin = lambda u: np.where(u <= 0.04045, u / 12.92, ((u + 0.055) / 1.055) ** 2.4)
gam = lambda u: np.where(u <= 0.0031308, 12.92 * u, 1.055 * np.power(np.clip(u, 0, None), 1 / 2.4) - 0.055)


def hexrgb(v):
    return '#%02x%02x%02x' % tuple(int(round(np.clip(x, 0, 1) * 255)) for x in v)


def plate(rgb, m, wide):
    """the plate behind the wing: a smooth fit (quadratic in x, y, per channel, linear RGB) of the pixels around the wing, within
    `wide` px of it but outside it, the dark ones (body, legs, pin) left out"""
    ring = (cv2.dilate(m.astype(np.uint8), np.ones((wide, wide), np.uint8)) > 0) & ~(cv2.dilate(m.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0)
    L = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)[..., 0].astype(float) * 100 / 255
    ring &= L > np.percentile(L[ring], 40)
    ys, xs = np.nonzero(ring)
    i = np.random.default_rng(3).choice(len(ys), min(30000, len(ys)), replace=False); ys, xs = ys[i], xs[i]
    A = lambda X, Y: np.stack([np.ones_like(X), X, Y, X * X, Y * Y, X * Y], -1)
    S = 1000.0
    V = lin(rgb[ys, xs].astype(float) / 255)
    f = np.linalg.lstsq(A(xs / S, ys / S), V, rcond=None)[0]
    YY, XX = np.mgrid[:rgb.shape[0], :rgb.shape[1]]
    return np.clip(A(XX / S, YY / S) @ f, 1e-3, 1)


def flat2(rgb, m, c, r, cos, org=None, size=None):
    """aile.flat with the span foreshortened by cos (a raised wing seen from above): the image distance along the span is s pxmm cos"""
    h, es, eq = aile.frame(c); pxmm = c['pxmm']
    if org is None:
        ys, xs = np.nonzero(m); P = np.stack([xs, ys], 1) - h
        s = P @ es / (pxmm * cos); q = P @ eq / pxmm
        s0, s1, q0, q1 = min(0, s.min()) - 0.5, s.max() + 0.5, q.min() - 0.5, q.max() + 0.5
        W, H = int((s1 - s0) * r), int((q1 - q0) * r)
    else:
        s0, q1, _ = org; W, H = size
    S, Q = np.meshgrid(s0 + (np.arange(W) + .5) / r, q1 - (np.arange(H) + .5) / r)
    mx = (h[0] + (S * es[0] * cos + Q * eq[0]) * pxmm).astype(np.float32); my = (h[1] + (S * es[1] * cos + Q * eq[1]) * pxmm).astype(np.float32)
    img = cv2.remap(rgb, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    mm = cv2.remap(m.astype(np.uint8) * 255, mx, my, cv2.INTER_LINEAR) > 127
    return img, mm, (s0, q1, r)


def veins(img, mm, org, r, wmax=0.3, thr=8.0, lmin=0.12):
    """the veins of a membrane (aile.veins, for a clear membrane): the black-hat of L* over a disk of wmax mm, over thr L*, kept where
    the piece is a line (skeleton over 0.6 mm in all, mean width under 0.2 mm), walked between junctions into polylines; the short
    cross veins are kept (pieces down to lmin mm, aile.veins drops those under 0.4 mm), each with its width (twice the distance
    from its skeleton to the edge of the un-closed vein, its darker half) and colour; grouped by width (0.02 mm) and colour"""
    from skimage.morphology import skeletonize
    s0, q1, _ = org
    lab = aile.lab_of(img); L = lab[..., 0]
    k = int(wmax * r) | 1
    bh = cv2.morphologyEx(cv2.GaussianBlur(L, (0, 0), 0.6), cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    raw = (bh > thr) & (cv2.erode(mm.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)
    vm = cv2.morphologyEx(raw.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.08 * r) | 1, int(0.08 * r) | 1))) > 0
    sk0 = skeletonize(vm)
    n, cc, st, _ = cv2.connectedComponentsWithStats(vm.astype(np.uint8), connectivity=8)
    skl = np.bincount(cc[sk0], minlength=n).astype(float) / r
    area = st[:, cv2.CC_STAT_AREA] / r / r
    keep = (skl > 0.6) & (area / np.maximum(skl, 1e-3) < 0.2); keep[0] = False
    vm = keep[cc]; raw &= vm
    sk = skeletonize(vm)
    dt = cv2.distanceTransform(raw.astype(np.uint8), cv2.DIST_L2, 3)
    ys, xs = np.nonzero(sk)
    pix = set(zip(ys.tolist(), xs.tolist()))
    nb = lambda p: [(p[0] + a, p[1] + b) for a in (-1, 0, 1) for b in (-1, 0, 1) if (a or b) and (p[0] + a, p[1] + b) in pix]
    deg = {p: len(nb(p)) for p in pix}
    seen = set(); paths = []
    def walk(a, b):
        path = [a, b]; seen.add((a, b)); seen.add((b, a)); prev, cur = a, b
        while deg[cur] == 2:
            nx = [q for q in nb(cur) if q != prev]
            if not nx or (cur, nx[0]) in seen: break
            prev, cur = cur, nx[0]; seen.add((prev, cur)); seen.add((cur, prev)); path.append(cur)
        return path
    for p in pix:
        if deg[p] != 2:
            for q in nb(p):
                if (p, q) not in seen: paths.append(walk(p, q))
    for p in pix:
        for q in nb(p):
            if (p, q) not in seen: paths.append(walk(p, q))
    out = {}
    for P in paths:
        if len(P) < lmin * r: continue
        A = np.array([[x, y] for y, x in P], np.int32)
        ap = cv2.approxPolyDP(A.reshape(-1, 1, 2), 0.02 * r, False)[:, 0, :]
        wd = float(np.median([dt[y, x] for y, x in P])) * 2 / r
        vals = np.array([L[y, x] for y, x in P]); core = np.array([lab[y, x] for y, x in P])[vals <= np.percentile(vals, 50)]
        c = np.median(core, 0)
        key = (round(wd / 0.02) * 0.02, aile.hexof(np.round(c / 6) * 6))
        out.setdefault(key, []).append([[round(s0 + (x + .5) / r, 3), round(q1 - (y + .5) / r, 3)] for x, y in ap])
    V = [{'largeur': round(max(0.02, k[0]), 3), 'c': k[1], 'traits': v} for k, v in sorted(out.items())]
    print('nervures : %d traits, %d groupes, %.1f mm' % (sum(len(v['traits']) for v in V), len(V), sk.sum() / r))
    return V, vm


def cmd_plat(o):
    C = json.load(open(o.cadres, encoding='utf-8')); c = dict(C[o.nom]); sid = C['_sid']
    out = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom); os.makedirs(out, exist_ok=True)
    rgb = cv2.imread(os.path.join(ROOT, 'refcache', sid, c['photo']))[..., ::-1].copy()
    mp = os.path.join(out, 'sam.png')
    if c.get('masque') == 'plaque':
        # no model: on a smooth light plate the membrane stands off the plate by its tint (aile.ground), within the box
        g = aile.ground(rgb, 40)
        x0, y0, x1, y1 = c['box']; m = np.zeros(g.shape, bool); m[y0:y1, x0:x1] = g[y0:y1, x0:x1]
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))) > 0
        from scipy import ndimage
        m = ndimage.binary_fill_holes(m)
    elif os.path.exists(mp) and not o.sam: m = cv2.imread(mp, 0) > 127
    else: m = aile.sam_mask(rgb, c); cv2.imwrite(mp, m.astype(np.uint8) * 255)
    if c.get('retirer'):
        cut = np.zeros(m.shape, np.uint8)
        for P in (c['retirer'] if isinstance(c['retirer'][0][0], list) else [c['retirer']]): cv2.fillPoly(cut, [np.array(P, np.int32)], 1)
        m &= cut == 0
    if c.get('ajouter'):
        add = np.zeros(m.shape, np.uint8)
        for P in c['ajouter']: cv2.fillPoly(add, [np.array(P, np.int32)], 1)
        m |= add > 0
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))) > 0
    n_, lb_, st_, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    if n_ > 2: m = lb_ == (1 + np.argmax(st_[1:, cv2.CC_STAT_AREA]))
    # the scale: a bar on the plate (pxmm), the wing's own length (longueur_mm), or, for a pinned specimen whose wings are raised
    # (the span foreshortened, the chord seen true), its width (largeur_mm) and its length / width measured flat (rapport): the
    # chord gives the scale, the ratio the foreshortening of the span (cos of the wing's tilt), undone in the flat frame
    h, es, eq = aile.frame(dict(c, pxmm=1))
    ys, xs = np.nonzero(m); P = np.stack([xs, ys], 1) - h; sp, qp = P @ es, P @ eq
    cos = 1.0
    if 'largeur_mm' in c:
        c['pxmm'] = float((np.percentile(qp, 99.8) - np.percentile(qp, 0.2)) / c['largeur_mm'])
        cos = float(min(1.0, np.percentile(sp, 99.8) / (c['pxmm'] * c['largeur_mm'] * c['rapport'])))
        print('échelle lue sur la largeur : %.1f px/mm, envergure raccourcie par %.3f (aile levée de %.0f°)' % (c['pxmm'], cos, np.degrees(np.arccos(cos))))
    elif 'pxmm' not in c:
        c['pxmm'] = float(sp.max() / c['longueur_mm'])
        print('échelle lue sur la longueur de l\'aile : %.1f px/mm' % c['pxmm'])
    if 'raccourci' in c: cos = c['raccourci']
    img, mm, org = flat2(rgb, m, c, o.r, cos)
    if c.get('plaque', 'claire') == 'claire':
        G = plate(rgb, m, int(1.5 * c['pxmm']))
        Gf, _, _ = flat2((np.clip(gam(G), 0, 1) * 255).astype(np.uint8), m, c, o.r, cos, org, (mm.shape[1], mm.shape[0]))
    else:
        Gf = None
    V, vm = veins(img, mm, org, o.r, wmax=c.get('wmax', 0.3), thr=c.get('seuil', 8.0))
    ol = aile.outline(mm, org, o.r)
    # the membrane alone: the mask off the veins (dilated by their half width) and off the very edge
    memb = mm & ~(cv2.dilate(vm.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0)
    memb &= cv2.erode(mm.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    res = {}
    lab = aile.lab_of(img); L = lab[..., 0]
    hp = L - cv2.GaussianBlur(L, (0, 0), 0.25 * o.r)
    res['grain'] = round(float(np.std(hp[memb])), 2)
    if Gf is not None:
        T = lin(img.astype(float) / 255) / np.maximum(lin(Gf.astype(float) / 255), 1e-3)
        Tm = np.median(T[memb], 0)
        res['transmission'] = [round(float(x), 3) for x in Tm]
        res['transmission_lum'] = round(float(Tm @ [0.2126, 0.7152, 0.0722]), 3)
        res['teinte'] = hexrgb(gam(np.clip(Tm, 0, 1)))
        # per cell of 1 mm along the span (the base is darker and browner than the tip), and the spread over the membrane
        s0, q1, r = org
        cells = []
        for gx in range(0, mm.shape[1], int(r)):
            b = memb[:, gx:gx + int(r)]
            if b.sum() < 0.2 * r * r: continue
            t = np.median(T[:, gx:gx + int(r)][b], 0)
            cells.append([round(s0 + (gx + r / 2) / r, 2), round(float(t @ [0.2126, 0.7152, 0.0722]), 3), hexrgb(gam(np.clip(t, 0, 1)))])
        res['le_long'] = cells
        res['ecart'] = round(float(np.std((T[memb] @ [0.2126, 0.7152, 0.0722]))), 3)
    vcol = np.median(lab[vm], 0) if vm.any() else None
    rec = {'_doc': 'membrane.py plat: aile transparente mesurée sur %s (repère : s vers l\'extérieur depuis la charnière, q vers la tête, mm). '
                   'Des chiffres, jamais l\'image.' % c['photo'], 'photo': c['photo'], 'pxmm': round(c['pxmm'], 2), 'raccourci': round(cos, 3), 'r': o.r,
           'origine': [round(org[0], 3), round(org[1], 3)], 'taille': [int(mm.shape[1]), int(mm.shape[0])],
           'longueur': round(max(p[0] for p in ol), 2), 'largeur': round(max(p[1] for p in ol) - min(p[1] for p in ol), 2),
           'contour': ol, 'nervures': V, 'couleur_nervures': aile.hexof(vcol) if vcol is not None else None, 'membrane': res}
    dst = os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.nom + '.json')
    json.dump(rec, open(dst, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
    cv2.imwrite(os.path.join(out, 'plat.png'), img[..., ::-1])
    cv2.imwrite(os.path.join(out, 'masque.png'), mm.astype(np.uint8) * 255)
    if Gf is not None: cv2.imwrite(os.path.join(out, 'fond.png'), Gf[..., ::-1])
    ov = img.copy(); ov[vm] = (255, 0, 255)
    cs, _ = cv2.findContours(mm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE); cv2.drawContours(ov, cs, -1, (0, 200, 255), 1)
    cv2.imwrite(os.path.join(out, 'controle.jpg'), np.concatenate([img, ov], 0)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(dst, '%.0f Ko' % (os.path.getsize(dst) / 1024), 'longueur %.2f mm, largeur %.2f mm' % (rec['longueur'], rec['largeur']), json.dumps(res, ensure_ascii=False)[:300])


def cmd_paire(o):
    """the flat render (the wing alone in its plane, over the measured plate) against the flattened photo: ΔE2000 per cell of 1 mm
    over the membrane (blurred at 0.1 mm: the colour the membrane gives the plate), the veins' darkness and width compared on their
    mask, and photo | render | ΔE"""
    C = json.load(open(o.cadres, encoding='utf-8')); sid = C['_sid']
    d = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom)
    P = cv2.imread(os.path.join(d, 'plat.png'))[..., ::-1]; M = cv2.imread(os.path.join(d, 'masque.png'), 0) > 127
    R = cv2.imread(o.rendu)[..., ::-1]
    if R.shape != P.shape: R = cv2.resize(R, (P.shape[1], P.shape[0]), interpolation=cv2.INTER_AREA)
    rec = json.load(open(os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.nom + '.json'), encoding='utf-8')); r = rec['r']
    m = cv2.erode(M.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    lp, lr = aile.lab_of(P), aile.lab_of(R)
    bl = lambda x: cv2.GaussianBlur(x, (0, 0), 0.1 * r)
    dE = aile.de2000(bl(lp), bl(lr)); dE[~m] = 0
    cell = int(r); rows = []
    for gy in range(0, P.shape[0], cell):
        for gx in range(0, P.shape[1], cell):
            mk = m[gy:gy + cell, gx:gx + cell]
            if mk.sum() < 0.4 * cell * cell: continue
            Lp = lp[gy:gy + cell, gx:gx + cell, 0]; Lr = lr[gy:gy + cell, gx:gx + cell, 0]
            rows.append({'dE': round(float(np.median(dE[gy:gy + cell, gx:gx + cell][mk])), 1),
                         'contraste': round(float(np.std(Lr[mk]) / max(.5, np.std(Lp[mk]))), 2)})
    de = np.array([x['dE'] for x in rows]); con = np.array([x['contraste'] for x in rows])
    res = {'cases': len(rows), 'dE_med': round(float(np.median(de)), 1), 'dE_p90': round(float(np.percentile(de, 90)), 1), 'ko': int((de > 6).sum()),
           'contraste_med': round(float(np.median(con)), 2)}
    hm = np.ascontiguousarray(cv2.applyColorMap(np.clip(dE * 255 / 12, 0, 255).astype(np.uint8), cv2.COLORMAP_INFERNO)[..., ::-1])
    cv2.imwrite(os.path.join(d, 'paire.jpg'), np.concatenate([P, R, hm], 0)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    json.dump({'resume': res, 'cases': rows}, open(os.path.join(d, 'paire.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(json.dumps(res, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd')
    a = sp.add_parser('plat'); a.add_argument('cadres'); a.add_argument('nom'); a.add_argument('--r', type=float, default=40); a.add_argument('--sam', action='store_true')
    b = sp.add_parser('paire'); b.add_argument('cadres'); b.add_argument('nom'); b.add_argument('rendu')
    o = ap.parse_args()
    {'plat': cmd_plat, 'paire': cmd_paire}[o.cmd](o)


if __name__ == '__main__':
    main()
