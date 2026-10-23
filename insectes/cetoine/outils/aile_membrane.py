"""aile_membrane.py: the rose chafer's hind wing measured on a beetle whose wings lie spread on stone (c230 from below, c228 from
above), numbers only (PROTOCOLE §3.3 and §3.4, adapted to a membrane: no scales, a tinted glass over its ground).

  python insectes/cetoine/outils/aile_membrane.py <cadre.json> <out.json> [--r 40] [--chroma 9]

<cadre.json> (insectes/cetoine/ailes/cadre.json): photo, pxmm (the scale, read on the body: elytra width), hinge (px), axe (two
points of the body axis, tail then head, px), side ("g" / "d": the wing's side on the image), garder (the polygon, px, that holds the
wing and none of the body), retirer (polygons taken off: a leg lying over the wing).
The wing: the pixels of the polygon that stand off the grey stone by their chroma (C* > --chroma), holes filled (veins, the leg),
laid flat in its frame by aile.flat (s outward from the hinge, perpendicular to the body axis; q toward the head; mm).
The membrane: a tinted glass of opacity alpha and colour M over the stone B: I = alpha M + (1 - alpha) B. The stone under the wing is
estimated by inpainting it from around the wing (Telea, on a blurred copy), and per channel I is regressed on B over the clear
membrane (veins and folds left out), per third of the span (base, middle, tip): alpha = 1 - slope, M = intercept / alpha.
The veins: dark lines (black-hat of L* over 0.4 mm, above 6 L*), skeleton walked into polylines (aile.veins), each with its width
and colour. The folds: the light creases of the apical field (top-hat), as thin strokes.
Writes refcache/cetonia-aurata/ailes/membrane/ (plat.png, fond.png, controle.jpg: photo pixels, never in git) and <out.json>."""
import sys, os, json
import numpy as np
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'insectes', 'outils'))
import aile  # noqa: E402

REF = os.path.join(ROOT, 'refcache', 'cetonia-aurata')
opt = lambda a, k, d=None: a[a.index(k) + 1] if k in a else d


def lines(mask, img_lab, org, r, minlen=0.6):
    """the skeleton of a line mask walked into polylines (mm), with width and colour (as aile.veins does)"""
    from skimage.morphology import skeletonize
    s0, q1, _ = org
    sk = skeletonize(mask); dt = cv2.distanceTransform(mask.astype(np.uint8), cv2.DIST_L2, 5)
    ys, xs = np.nonzero(sk); pix = set(zip(ys.tolist(), xs.tolist()))
    nb = lambda p: [(p[0] + a, p[1] + b) for a in (-1, 0, 1) for b in (-1, 0, 1) if (a or b) and (p[0] + a, p[1] + b) in pix]
    deg = {p: len(nb(p)) for p in pix}; seen = set(); paths = []
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
    out = []
    for P in paths:
        if len(P) < minlen * r: continue
        A = np.array([[x, y] for y, x in P], np.int32)
        ap = cv2.approxPolyDP(A.reshape(-1, 1, 2), 0.04 * r, False)[:, 0, :]
        wd = float(np.median([dt[y, x] for y, x in P])) * 2 / r
        vals = np.array([img_lab[y, x] for y, x in P]); core = vals[vals[:, 0] <= np.percentile(vals[:, 0], 40)]
        out.append({'largeur': round(max(0.03, wd), 3), 'c': aile.hexof(np.median(core, 0)),
                    'trait': [[round(s0 + (x + .5) / r, 2), round(q1 - (y + .5) / r, 2)] for x, y in ap]})
    return out


def main():
    a = sys.argv[1:]
    c = json.load(open(a[0], encoding='utf-8')); out = a[1]
    r = float(opt(a, '--r', 40)); cthr = float(opt(a, '--chroma', 9))
    img = cv2.imread(os.path.join(ROOT, c['photo']))[..., ::-1].copy()
    H, W = img.shape[:2]
    lab = aile.lab_of(cv2.GaussianBlur(img, (0, 0), 1.5)); C = np.hypot(lab[..., 1], lab[..., 2])
    keep = np.zeros((H, W), np.uint8); cv2.fillPoly(keep, [np.array(c['garder'], np.int32)], 1); keep0 = keep.copy()
    for P in c.get('retirer', []): cv2.fillPoly(keep, [np.array(P, np.int32)], 0)
    m = ((C > cthr) & (lab[..., 2] > 0.6 * cthr) & (keep > 0)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    # the pieces of the wing a leg cuts apart are kept (every piece over 2 % of the largest), then bridged under the leg
    n, lb, st, _ = cv2.connectedComponentsWithStats(m); big = st[:, cv2.CC_STAT_AREA] > 0.02 * st[1:, cv2.CC_STAT_AREA].max(); big[0] = False
    m = big[lb].astype(np.uint8)
    from scipy import ndimage
    m = ndimage.binary_fill_holes(cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))).astype(np.uint8)
    # the membrane hidden under a leg: the wing's convex hull within the polygons taken off (the leg's notch bridged)
    hidden = np.zeros((H, W), np.uint8)
    for P in c.get('retirer', []): cv2.fillPoly(hidden, [np.array(P, np.int32)], 1)
    if hidden.any():
        cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        hull = np.zeros((H, W), np.uint8); cv2.fillPoly(hull, [cv2.convexHull(np.concatenate(cs))], 1)
        m = m | (hull & hidden & (keep0 > 0))
    # the stone under the wing: inpainted from around it on a blurred, reduced copy
    sm = 4
    small = cv2.resize(cv2.GaussianBlur(img, (0, 0), 3), (W // sm, H // sm), interpolation=cv2.INTER_AREA)
    ms = cv2.dilate(cv2.resize(m, (W // sm, H // sm), interpolation=cv2.INTER_NEAREST), np.ones((7, 7), np.uint8))
    bg = cv2.resize(cv2.inpaint(small[..., ::-1], ms * 255, 12, cv2.INPAINT_TELEA)[..., ::-1], (W, H), interpolation=cv2.INTER_CUBIC)
    flat, mm, org = aile.flat(img, m > 0, c, r)
    fb, _, _ = aile.flat(bg, m > 0, c, r, org=org, size=(flat.shape[1], flat.shape[0]))
    d = os.path.join(REF, 'ailes', 'membrane'); os.makedirs(d, exist_ok=True)
    cv2.imwrite(os.path.join(d, 'plat.png'), flat[..., ::-1]); cv2.imwrite(os.path.join(d, 'fond.png'), fb[..., ::-1])
    s0, q1, _ = org
    labf = aile.lab_of(flat); L = labf[..., 0]
    # veins: dark lines over the membrane
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.4 * r) | 1,) * 2)
    bh = cv2.morphologyEx(cv2.GaussianBlur(L, (0, 0), 0.8), cv2.MORPH_BLACKHAT, ker)
    inner = cv2.erode(mm.astype(np.uint8), np.ones((int(0.25 * r) | 1,) * 2, np.uint8)) > 0
    # the leg lying over the wing (black-green, dark and grey) is not a vein
    Cf = np.hypot(labf[..., 1], labf[..., 2])
    dark = cv2.dilate(((L < 30) | ((L < 42) & (Cf < 10))).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    vm = (bh > float(opt(a, '--seuil', 6))) & inner & ~dark
    vm = cv2.morphologyEx(vm.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.12 * r) | 1,) * 2)) > 0
    nlab, cc, st2, _ = cv2.connectedComponentsWithStats(vm.astype(np.uint8), connectivity=8)
    big = st2[:, cv2.CC_STAT_AREA] > (0.08 * r * r); big[0] = False; vm = big[cc]
    nerv = lines(vm, labf, org, r)
    # the leading edge: the thick dark costa along the edge is its own band (the edge of the mask on the costal side, 0.25 mm)
    # folds: light creases
    th = cv2.morphologyEx(cv2.GaussianBlur(L, (0, 0), 0.8), cv2.MORPH_TOPHAT, ker)
    fm = (th > 4) & inner & ~cv2.dilate(vm.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    fm = cv2.morphologyEx(fm.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)) > 0
    nlab, cc, st3, _ = cv2.connectedComponentsWithStats(fm.astype(np.uint8), connectivity=8)
    big = st3[:, cv2.CC_STAT_AREA] > (0.05 * r * r); big[0] = False; fm = big[cc]
    plis = lines(fm, labf, org, r, minlen=1.0)
    # the membrane, per third of the span: I = alpha M + (1 - alpha) B, per channel
    hid = aile.flat(hidden * 255, m > 0, c, r, org=org, size=(flat.shape[1], flat.shape[0]))[0] > 127 if hidden.any() else np.zeros(L.shape, bool)
    vm &= ~hid; fm &= ~hid
    clear = ~hid & inner & ~cv2.dilate(vm.astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool) & ~fm & (L > 15)
    S = s0 + (np.arange(flat.shape[1]) + .5) / r
    smax = S[mm.any(0)].max()
    zon = []
    clear &= ~dark
    # the stone's grain seen through the membrane against the stone around it (linear light, a band of 0.3 to 1.5 mm): the
    # membrane lets 1 - alpha of it through
    lin = (flat.astype(np.float64) / 255) ** 2.2
    hp = cv2.GaussianBlur(lin, (0, 0), 0.08 * r) - cv2.GaussianBlur(lin, (0, 0), 0.5 * r)
    ring = (cv2.dilate(mm.astype(np.uint8), np.ones((int(2.5 * r),) * 2, np.uint8)) > 0) & ~(cv2.dilate(mm.astype(np.uint8), np.ones((int(0.6 * r),) * 2, np.uint8)) > 0)
    ring_o = (cv2.dilate(m, np.ones((int(2.5 * c['pxmm']),) * 2, np.uint8)) > 0) & ~(cv2.dilate(m, np.ones((int(0.6 * c['pxmm']),) * 2, np.uint8)) > 0) & (keep0 > 0)
    lin_o = (img.astype(np.float64) / 255) ** 2.2
    hp_o = cv2.GaussianBlur(lin_o, (0, 0), 0.08 * c['pxmm']) - cv2.GaussianBlur(lin_o, (0, 0), 0.5 * c['pxmm'])
    sd_out = hp_o[ring_o].std(0); mean_out = lin_o[ring_o].mean(0)
    for k, (f0, f1) in enumerate([(0, 0.33), (0.33, 0.66), (0.66, 1.01)]):
        sel = clear & ((S >= f0 * smax) & (S < f1 * smax))[None, :]
        sd_in = hp[sel].std(0); Iin = np.median(lin[sel], 0); Bin = np.median(lin_o[ring_o], 0)   # the stone around, as the stone under
        al = list(np.clip(1 - sd_in / sd_out, 0.05, 0.98))
        alpha = float(np.mean(al))
        Mc = np.clip((Iin - (1 - alpha) * Bin) / alpha, 0, 1) ** (1 / 2.2)
        zon.append({'s': [round(f0 * smax, 2), round(min(1, f1) * smax, 2)], 'alpha': round(alpha, 3), 'alpha_rvb': [round(float(x), 3) for x in al],
                    'teinte': '#%02x%02x%02x' % tuple(int(round(x * 255)) for x in Mc), 'vue': '#%02x%02x%02x' % tuple(int(round(x ** (1 / 2.2) * 255)) for x in Iin), 'n': int(sel.sum())})
        print('membrane %s : alpha %.2f (%s), teinte %s, vue sur la pierre %s' % (zon[-1]['s'], alpha, ' '.join('%.2f' % x for x in al), zon[-1]['teinte'], zon[-1]['vue']))
    cs, _ = cv2.findContours(mm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cn = max(cs, key=cv2.contourArea); ap = cv2.approxPolyDP(cn, 0.05 * r, True)[:, 0, :]
    contour = aile.to_mm(ap, org)
    xs = [p[0] for p in contour]; ys = [p[1] for p in contour]
    rec = {'_doc': 'aile_membrane.py sur %s : aile postérieure à plat (s vers l\'extérieur depuis la charnière, q vers la tête, mm). '
                   'Contour, membrane (opacité et teinte par tiers de l\'envergure), nervures et plis : des chiffres, jamais l\'image.' % c['photo'],
           'photo': c['photo'], 'pxmm': c['pxmm'], 'longueur': round(max(xs), 2), 'corde': round(max(ys) - min(ys), 2),
           'contour': [[round(x, 2), round(y, 2)] for x, y in contour], 'membrane': zon, 'nervures': nerv, 'plis': plis}
    json.dump(rec, open(out, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False)
    # control: flat | veins and folds over it
    v = flat[..., ::-1].copy(); v2 = v.copy(); v2[vm] = (0, 0, 255); v2[fm] = (255, 255, 0)
    cv2.drawContours(v2, [ap], -1, (255, 0, 255), 1)
    cv2.imwrite(os.path.join(d, 'controle.jpg'), np.concatenate([v, v2], 0), [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(out, 'longueur %.2f mm, corde %.2f mm, %d nervures, %d plis' % (rec['longueur'], rec['corde'], len(nerv), len(plis)))


if __name__ == '__main__':
    main()
