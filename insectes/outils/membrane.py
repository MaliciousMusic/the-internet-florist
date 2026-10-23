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


def cmd_plat(o):
    C = json.load(open(o.cadres, encoding='utf-8')); c = dict(C[o.nom]); sid = C['_sid']
    out = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom); os.makedirs(out, exist_ok=True)
    rgb = cv2.imread(os.path.join(ROOT, 'refcache', sid, c['photo']))[..., ::-1].copy()
    mp = os.path.join(out, 'sam.png')
    if os.path.exists(mp) and not o.sam: m = cv2.imread(mp, 0) > 127
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
    # the scale: a bar on the plate, or the wing's own length (the farthest point of the mask from the hinge, along the span)
    if 'pxmm' not in c:
        h, es, eq = aile.frame(dict(c, pxmm=1))
        ys, xs = np.nonzero(m); s = (np.stack([xs, ys], 1) - h) @ es
        c['pxmm'] = float(s.max() / c['longueur_mm'])
        print('échelle lue sur la longueur de l\'aile : %.1f px/mm' % c['pxmm'])
    img, mm, org = aile.flat(rgb, m, c, o.r)
    if c.get('plaque', 'claire') == 'claire':
        G = plate(rgb, m, int(1.5 * c['pxmm']))
        Gf, _, _ = aile.flat((np.clip(gam(G), 0, 1) * 255).astype(np.uint8), m, c, o.r, org, (mm.shape[1], mm.shape[0]))
    else:
        Gf = None
    V, vm = aile.veins(img, mm, org, o.r, None, wmax=c.get('wmax', 0.3), thr=c.get('seuil', 8.0))
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
                   'Des chiffres, jamais l\'image.' % c['photo'], 'photo': c['photo'], 'pxmm': round(c['pxmm'], 2), 'r': o.r,
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
