"""aile.py: a wing of a spread specimen, laid flat in its own frame and read as zones (PROTOCOLE §3.3, porteur 2026-10-23:
« contours extraits »). Runs in vases5/.venv-depth (SAM facebook/sam-vit-base, already downloaded).

  vases5/.venv-depth/Scripts/python insectes/outils/aile.py plat <cadres.json> <nom> [--k 7] [--r 20]
  python insectes/outils/aile.py paire <cadres.json> <nom> <render_flat.png>       photo against render, in the wing frame

<cadres.json> (insectes/<id>/ailes/cadres.json, numbers only) holds per wing face:
  photo     refcache/<sid>/hd/<file>
  pxmm      the specimen's scale (its 1 cm bar)
  hinge     the wing's hinge (px), axe: two points of the body axis, tail then head (px), side: "g" when the wing lies on the image's
            left (s grows toward -x), "d" otherwise
  box, pos, neg   SAM prompts (px): the wing's box, points inside it, points on its neighbours (other wing, body, background)
  retirer   optional polygon (px) taken off the mask: the neighbour wing where SAM cannot part them
  poils     optional polygons (px) of the long hairs over the wing (their region read on the grid; direction, colours, cover measured)
  complete  optional outline (mm, wing frame) of the part hidden under the other wing, added to the mask; or completer: the name of
            the same wing measured whole on the other face (the hindwing seen from below, the forewing from above), scaled
The frame: s outward from the hinge, perpendicular to the body axis; q toward the head; millimetres.

Writes refcache/<sid>/ailes/<nom>/ (photo pixels: never in git): plat.png (the wing flat at r px/mm), masque.png, etiquettes.png,
controle.jpg; and insectes/<id>/ailes/<nom>.json (numbers only): the outline, the zones (colour, contours with holes), the dust
(small scales of one zone scattered over another: their colour, size and density per cell), the measured colours."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def lab_of(rgb):
    lab = cv2.cvtColor(rgb.astype(np.float32) / 255, cv2.COLOR_RGB2LAB)
    return lab


def hexof(lab):
    rgb = cv2.cvtColor(np.array([[lab]], np.float32), cv2.COLOR_LAB2RGB)[0, 0]
    return '#%02x%02x%02x' % tuple(int(round(min(1, max(0, c)) * 255)) for c in rgb)


def frame(c):
    h = np.array(c['hinge'], float); a, t = np.array(c['axe'][0], float), np.array(c['axe'][1], float)
    eq = (t - a) / np.linalg.norm(t - a)                   # along the body axis, toward the head
    es = np.array([eq[1], -eq[0]])                         # perpendicular
    # outward: away from the body axis, on the wing's side of the image
    if (es[0] > 0) != (c['side'] == 'd'): es = -es
    return h, es, eq


def sam_mask(rgb, c):
    import torch
    from transformers import SamModel, SamProcessor
    torch.set_num_threads(max(1, (os.cpu_count() or 4) // 2))
    x0, y0, x1, y1 = c['box']; pad = 40
    H, W = rgb.shape[:2]
    X0, Y0, X1, Y1 = max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad)
    crop = rgb[Y0:Y1, X0:X1]
    proc = SamProcessor.from_pretrained('facebook/sam-vit-base'); model = SamModel.from_pretrained('facebook/sam-vit-base').eval()
    inside = lambda p: X0 <= p[0] < X1 and Y0 <= p[1] < Y1
    pos = [p for p in c['pos'] if inside(p)]; neg = [p for p in c.get('neg', []) if inside(p)]
    c = dict(c, pos=pos, neg=neg)
    pts = [[p[0] - X0, p[1] - Y0] for p in pos] + [[p[0] - X0, p[1] - Y0] for p in neg]
    lbl = [1] * len(pos) + [0] * len(neg)
    inp = proc(images=crop, input_boxes=[[[x0 - X0, y0 - Y0, x1 - X0, y1 - Y0]]], input_points=[[pts]], input_labels=[[lbl]], return_tensors='pt')
    with torch.no_grad(): o = model(**inp, multimask_output=True)
    ms = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
    sc = o.iou_scores[0, 0].numpy()
    def score(k):
        m = ms[k]; inn = np.mean([m[int(p[1]), int(p[0])] for p in pts[:len(c['pos'])]])
        out = np.mean([m[int(p[1]), int(p[0])] for p in pts[len(c['pos']):]]) if len(pts) > len(c['pos']) else 0
        return sc[k] + 2 * inn - 2 * out
    k = max(range(len(sc)), key=score)
    m = np.zeros((H, W), bool); m[Y0:Y1, X0:X1] = ms[k]
    print('sam', 'score %.3f' % sc[k], 'candidat', k)
    return m


def ground(rgb, pxmm):
    """the specimen's ground: MHNT plates have a neutral, smooth gradient (chroma ~0.1); a pixel stands off it by its chroma or by
    its lightness against a smooth fit of the ground. Returns the mask of the specimen (holes filled)."""
    lab = lab_of(cv2.GaussianBlur(rgb, (0, 0), 1.2)); L = lab[..., 0]; C = np.hypot(lab[..., 1], lab[..., 2])
    neutral = C < 1.2
    small = cv2.resize(np.where(neutral, L, np.nan).astype(np.float32), (rgb.shape[1] // 16, rgb.shape[0] // 16), interpolation=cv2.INTER_AREA)
    ys, xs = np.nonzero(~np.isnan(small))
    A = lambda X, Y: np.stack([np.ones_like(X), X, Y, X * X, Y * Y, X * Y], -1).astype(np.float64)
    f = np.linalg.lstsq(A(xs / 100, ys / 100), small[ys, xs], rcond=None)[0]
    YY, XX = np.mgrid[:rgb.shape[0], :rgb.shape[1]]
    Lf = (A(XX / 1600, YY / 1600) @ f).astype(np.float32)
    off = (C > 2.0) | (np.abs(L - Lf) > 2.5)
    off = cv2.morphologyEx(off.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    from scipy import ndimage
    return ndimage.binary_fill_holes(off > 0)


def ground_tinted(rgb, de=5.0):
    """a plate whose ground is a coloured gradient (cadres key fond: "degrade"; MHNT c258 navy, c259 brown, black at the
    bottom): its Lab is a smooth field (cubic in x and y), fitted on the dark, smooth pixels and refitted on those close to it;
    a pixel stands off it by its ΔE76 over `de`. Returns the mask of the specimen (holes filled)."""
    H, W = rgb.shape[:2]
    lab = lab_of(cv2.GaussianBlur(rgb, (0, 0), 1.2))
    sm = cv2.resize(lab, (W // 16, H // 16), interpolation=cv2.INTER_AREA)
    sd = cv2.resize(cv2.GaussianBlur(lab[..., 0] ** 2, (0, 0), 6) - cv2.GaussianBlur(lab[..., 0], (0, 0), 6) ** 2, (W // 16, H // 16), interpolation=cv2.INTER_AREA)
    C = np.hypot(sm[..., 1], sm[..., 2])
    cand = (sm[..., 0] < 32) & (C < 22) & (np.sqrt(np.maximum(sd, 0)) < 1.5)
    ys, xs = np.mgrid[:sm.shape[0], :sm.shape[1]]
    A = lambda X, Y: np.stack([np.ones_like(X), X, Y, X * X, Y * Y, X * Y, X ** 3, Y ** 3, X * X * Y, X * Y * Y], -1).astype(np.float64)
    for _ in range(4):
        f = np.linalg.lstsq(A(xs[cand] / 100, ys[cand] / 100), sm[cand].astype(np.float64), rcond=None)[0]
        fit = (A(xs / 100, ys / 100) @ f).astype(np.float32)
        cand = np.linalg.norm(sm - fit, axis=-1) < 3.0
    YY, XX = np.mgrid[:H, :W]
    fit = (A(XX / 1600, YY / 1600) @ f).astype(np.float32)
    off = np.linalg.norm(lab - fit, axis=-1) > de
    off = cv2.morphologyEx(off.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    from scipy import ndimage
    return ndimage.binary_fill_holes(off > 0)


def flat(rgb, m, c, r, org=None, size=None):
    h, es, eq = frame(c); pxmm = c['pxmm']
    if org is None:
        ys, xs = np.nonzero(m)
        P = np.stack([xs, ys], 1) - h
        s = P @ es / pxmm; q = P @ eq / pxmm
        s0, s1, q0, q1 = min(0, s.min()) - 0.5, s.max() + 0.5, q.min() - 0.5, q.max() + 0.5
        W, H = int((s1 - s0) * r), int((q1 - q0) * r)
    else:
        s0, q1, _ = org; W, H = size
    S, Q = np.meshgrid(s0 + (np.arange(W) + .5) / r, q1 - (np.arange(H) + .5) / r)
    mx = (h[0] + (S * es[0] + Q * eq[0]) * pxmm).astype(np.float32); my = (h[1] + (S * es[1] + Q * eq[1]) * pxmm).astype(np.float32)
    img = cv2.remap(rgb, mx, my, cv2.INTER_AREA if pxmm > r else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    mm = cv2.remap(m.astype(np.uint8) * 255, mx, my, cv2.INTER_LINEAR) > 127
    return img, mm, (s0, q1, r)


def to_mm(cnt, org):
    s0, q1, r = org
    return [[round(s0 + (p[0] + .5) / r, 3), round(q1 - (p[1] + .5) / r, 3)] for p in cnt]


def path_of(polys):
    return ''.join('M' + 'L'.join('%.2f %.2f' % (x, y) for x, y in P) + 'Z' for P in polys)


def poly_mm(mask, org, r, tol_mm, amin_mm2):
    """the contours of a mask (outer ones and holes) simplified to tol_mm, in mm, rounded to 0.01"""
    cs, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    for cn in cs:
        if cv2.contourArea(cn) < amin_mm2 * r * r: continue
        ap = cv2.approxPolyDP(cn, tol_mm * r, True)[:, 0, :]
        if len(ap) >= 3: out.append([[round(x, 2), round(y, 2)] for x, y in to_mm(ap, org)])
    return out


def gradient(labf, sel, org, r):
    """the zone's own tone as a linear gradient: the direction its lightness changes along (a plane fitted over the zone), and
    the median colour at 5 %, 50 % and 95 % along it; None when the zone keeps one colour (spread under 1.5 ΔE)"""
    s0, q1, _ = org
    ys, xs = np.nonzero(sel)
    if len(ys) < 200: return None
    i = np.random.default_rng(5).choice(len(ys), min(40000, len(ys)), replace=False); ys, xs = ys[i], xs[i]
    S = s0 + (xs + .5) / r; Q = q1 - (ys + .5) / r; V = labf[ys, xs]
    A = np.stack([np.ones_like(S), S, Q], 1); cL = np.linalg.lstsq(A, V[:, 0], rcond=None)[0]
    d = np.array(cL[1:]); n = np.linalg.norm(d)
    if n < 1e-6: return None
    d /= n; t = S * d[0] + Q * d[1]; t0, t1 = np.percentile(t, [2, 98])
    if t1 - t0 < 0.5: return None
    stops = []
    for f in (0.05, 0.5, 0.95):
        tm = t0 + f * (t1 - t0); w = np.abs(t - tm) < 0.08 * (t1 - t0)
        if w.sum() < 20: return None
        stops.append([f, np.median(V[w], 0)])
    if max(np.linalg.norm(a[1] - b[1]) for a in stops for b in stops) < 1.5: return None
    c0 = np.array([S.mean(), Q.mean()]); m = c0 @ d
    p0 = c0 + d * (t0 - m); p1 = c0 + d * (t1 - m)
    return {'p0': [round(float(x), 2) for x in p0], 'p1': [round(float(x), 2) for x in p1], 'stops': [[f, hexof(v)] for f, v in stops]}


def veins(img, mm, org, r, hm=None, wmax=0.35, thr=12.0, medmin=58, lmin=1.2, wmean=0.22, light=False):
    """the veins: thin dark lines across the lighter scales (the black-hat of L* over a disk of wmax mm, over thr L*), thinned to
    their skeleton and walked into polylines between their junctions; each with its measured width (twice the distance to its
    edge) and colour (its darkest third). Grouped by width (0.03 mm steps) and colour for a few stroked paths. Returns the
    veins and their mask (taken out of the zones and the dust, which then fill under them)."""
    from skimage.morphology import skeletonize
    s0, q1, _ = org
    lab = lab_of(img); L = lab[..., 0]
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(wmax * r) | 1, int(wmax * r) | 1))
    # light=True: veins paler than the cells between them (a bush-cricket's green tegmen), read by the top-hat
    bh = cv2.morphologyEx(cv2.GaussianBlur(L, (0, 0), 0.6), cv2.MORPH_TOPHAT if light else cv2.MORPH_BLACKHAT, ker)
    # on a light ground only (its median over 1 mm): between the light grains of a dusted black band the black reads as a net
    # of thin lines, which are not veins
    med = cv2.medianBlur(np.clip(L * 2.55, 0, 255).astype(np.uint8), (int(1.0 * r) | 1)).astype(np.float32) / 2.55
    vm = (bh > thr) & (med > medmin) & cv2.erode(mm.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    if hm is not None: vm &= ~hm
    # the gaps of a vein where it pales for a few scales are closed (0.15 mm), so it is walked as one line, not in dashes
    vm = cv2.morphologyEx(vm.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.15 * r) | 1, int(0.15 * r) | 1))) > 0
    # keep the lines, not the dark grains nor the dusted bands: per piece, its skeleton's length (over 1.2 mm) and its mean width
    # (its area over that length, under 0.22 mm)
    from skimage.morphology import skeletonize as _sk
    sk0 = _sk(vm)
    n, cc, st, _ = cv2.connectedComponentsWithStats(vm.astype(np.uint8), connectivity=8)
    skl = np.bincount(cc[sk0], minlength=n).astype(float) / r
    area = st[:, cv2.CC_STAT_AREA] / r / r
    keep = (skl > lmin) & (area / np.maximum(skl, 1e-3) < wmean)
    keep[0] = False
    vm = keep[cc]
    sk = skeletonize(vm)
    dt = cv2.distanceTransform(vm.astype(np.uint8), cv2.DIST_L2, 5)
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
        if len(P) < 0.4 * r: continue
        A = np.array([[x, y] for y, x in P], np.int32)
        ap = cv2.approxPolyDP(A.reshape(-1, 1, 2), 0.03 * r, False)[:, 0, :]
        wd = float(np.median([dt[y, x] for y, x in P])) * 2 / r
        vals = np.array([L[y, x] for y, x in P]); core = np.array([lab[y, x] for y, x in P])[(vals >= np.percentile(vals, 65)) if light else (vals <= np.percentile(vals, 35))]
        c = np.median(core, 0)
        key = (round(wd / 0.04) * 0.04, hexof(np.round(c / 8) * 8))
        out.setdefault(key, []).append([[round(s0 + (x + .5) / r, 2), round(q1 - (y + .5) / r, 2)] for x, y in ap])
    V = [{'largeur': round(max(0.04, k[0]), 3), 'c': k[1], 'traits': v} for k, v in out.items()]
    print('nervures : %d traits, %d groupes, %.1f mm²' % (sum(len(v['traits']) for v in V), len(V), vm.sum() / r / r))
    return V, vm


def zones(img, mm, org, k, r, amin=0.25, tol=0.05, hm=None, vm=None, flou=0.02, poudre=True, forcer=(), teinte=1.4, sous=None):
    """fine labels by k-means (Lab, on a light blur); macro zones: the fine labels with their small islands (scattered scales,
    under amin mm²) filled by the zone around them, so veins and bars stay and dust goes. Each zone: its contours (simplified to
    tol mm, drawn as smooth curves), its colour and its gradient. Dust: the islands of one zone in another, as density levels
    (contours), with the grains' size and spacing: the renderer fills each level with a tile of grains."""
    from scipy import ndimage
    from scipy.spatial import cKDTree
    # flou (mm): a striated face (cadres key stries) reads its zones on the tones under the striae, which are measured apart
    lab = lab_of(cv2.GaussianBlur(img, (0, 0), flou * r)); px = lab[mm]
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 60, 0.2)
    wt = np.array([1.0, teinte, teinte], np.float32)         # a little more weight on hue than on lightness: blue against grey
    rng = np.random.default_rng(3); sub = px[rng.choice(len(px), min(150000, len(px)), replace=False)] * wt
    _, _, cen = cv2.kmeans(sub.astype(np.float32), k, None, crit, 4, cv2.KMEANS_PP_CENTERS)
    lb = np.argmin(np.linalg.norm((px * wt)[:, None, :] - cen[None], axis=2), 1)
    fine = np.full(mm.shape, -1, int); fine[mm] = lb
    A = amin * r * r
    macro = fine.copy()
    # a granular class (the blue of the swallowtail's band) is made of grains even where they are
    # dense: its edge per area is that of grains (over 18 per mm, a grain of 0.2 mm), not of a solid zone. It is never a zone,
    # only dust over the zone around it.
    gran = []; forced = set()
    disk = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.15 * r) | 1, int(0.15 * r) | 1))
    for j in range(k):
        m_ = (fine == j).astype(np.uint8)
        if m_.sum() < 50: continue
        # an opening by a disk of 0.15 mm keeps bars, veins of 0.2 mm and the eye-spot; it wipes grains of 0.1 mm out
        kept = cv2.morphologyEx(m_, cv2.MORPH_OPEN, disk).sum() / m_.sum()
        # thin veins also vanish under the opening, but they hold together: a network of a few big pieces, where dust is a
        # crowd of islands. The share of the class in pieces over 2 mm² tells them apart.
        n_, cc_, st_, _ = cv2.connectedComponentsWithStats(m_, connectivity=8)
        big = st_[1:, cv2.CC_STAT_AREA][st_[1:, cv2.CC_STAT_AREA] > 2 * r * r].sum() / m_.sum()
        print('  classe %d %s : %.0f %% reste après ouverture, %.0f %% en grands morceaux' % (j, hexof(np.median(lab_of(img)[fine == j], 0)), 100 * kept, 100 * big))
        if poudre and kept < 0.45 and big < 0.3 and (fine == j).sum() < 0.3 * mm.sum(): gran.append(j)
        # cadres key poudre_seule: colours read on the photo as scales scattered over another zone even where they are dense (the
        # peacock's blue and lilac scales over the black and the maroon of its eyespot): never a zone
        elif poudre and any(np.linalg.norm(np.median(lab_of(img)[fine == j], 0) - f) < 14 for f in forcer): gran.append(j); forced.add(j)
    for j in range(k):
        if j in gran: macro[fine == j] = -2; continue
        n, cc, st, _ = cv2.connectedComponentsWithStats((fine == j).astype(np.uint8), connectivity=8)
        small = np.nonzero(st[1:, cv2.CC_STAT_AREA] < A)[0] + 1
        if len(small): macro[np.isin(cc, small)] = -2
    if gran: print('classes granuleuses (poudre seulement) :', gran)
    if vm is not None: macro[vm] = -2                      # under the veins: the zone around them (the veins are strokes)
    keep = macro >= 0
    _, (iy, ix) = ndimage.distance_transform_edt(~keep, return_indices=True)
    macro = np.where(mm, macro[iy, ix], -1)
    # cadres key poudre_sous: the zone a granular colour lies on, read on the photo (the peacock's blue scales lie on the black of
    # its eyespot, not on the maroon beside it): its pixels go to the zone of the nearest given colour instead of the nearest zone
    if sous:
        labb = lab_of(img)
        cen_lab = {j: np.median(labb[fine == j], 0) for j in range(k) if (fine == j).any()}
        rules = []
        for g_lab, z_lab in sous:
            j = min(gran, key=lambda j: np.linalg.norm(cen_lab[j] - g_lab)) if gran else None
            if j is None or np.linalg.norm(cen_lab[j] - g_lab) > 14: continue
            zi = min((i for i in range(k) if i not in gran and i in cen_lab), key=lambda i: np.linalg.norm(cen_lab[i] - z_lab))
            rules.append((j, zi))
        if rules:
            # where the grains lie (their area closed over 0.25 mm), each pixel goes to the zone under the colour of grains that
            # is densest there (blurred over 0.15 mm)
            ker_ = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.25 * r) | 1,) * 2)
            area = np.zeros(mm.shape, bool)
            for j, _ in rules: area |= cv2.morphologyEx((fine == j).astype(np.uint8), cv2.MORPH_CLOSE, ker_) > 0
            dens = np.stack([cv2.GaussianBlur((fine == j).astype(np.float32), (0, 0), 0.15 * r) for j, _ in rules], -1)
            zsel = np.array([zi for _, zi in rules])[np.argmax(dens, -1)]
            ok = area & mm & np.isin(macro, [i for i in range(k) if i not in gran])
            macro[ok] = zsel[ok]
    # under the long hairs lies the membrane of the zone that borders them most (the hairs' own dark mass is drawn as hairs)
    if hm is not None and hm.any():
        ring = (cv2.dilate(hm.astype(np.uint8), np.ones((int(0.6 * r), int(0.6 * r)), np.uint8)) > 0) & ~hm & mm
        lab_ring = macro[ring]; lab_ring = lab_ring[lab_ring >= 0]
        if len(lab_ring): macro[hm] = np.bincount(lab_ring).argmax()
    stack = np.stack([cv2.GaussianBlur((macro == j).astype(np.float32), (0, 0), 0.06 * r) for j in range(k)], -1)
    macro = np.where(mm, np.argmax(stack, -1), -1)
    labf = lab_of(img)
    cols = []
    for j in range(k):
        sel = (fine == j) & (macro == j)
        cols.append(np.median(labf[sel], 0) if sel.sum() > 20 else np.median(labf[fine == j], 0) if (fine == j).any() else np.array([50, 0, 0]))
    order = sorted(range(k), key=lambda j: -(macro == j).sum())
    Z = []
    for j in order:
        a = macro == j
        if a.sum() < 4: continue
        P = poly_mm(a, org, r, tol, 0.06)
        if not P: continue
        Z.append({'zone': int(j), 'c': hexof(cols[j]), 'lab': [round(float(v), 1) for v in cols[j]], 'part': round(float(a.sum() / mm.sum()), 4),
                  'poly': P, 'degrade': gradient(labf, (fine == j) & (macro == j), org, r)})
    # dust: per pair (grains of zone j over zone i), the grains' count per mm², smoothed over 0.3 mm, cut in density levels
    D = []; tot = 0
    for i in (order if poudre else []):
        for j in range(k):
            if i == j: continue
            sel = (macro == i) & (fine == j)
            if hm is not None: sel &= ~hm                      # under the hairs: the hairs are drawn, not dust
            if vm is not None: sel &= ~cv2.dilate(vm.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
            if sel.sum() < 0.002 * mm.sum(): continue
            n, lbb, st, _ = cv2.connectedComponentsWithStats(sel.astype(np.uint8))
            areas = st[1:, cv2.CC_STAT_AREA]; g = np.nonzero((areas >= 3) & ((areas < A) | (j in gran)))[0] + 1
            if len(g) < 30: continue
            ag = areas[g - 1]; med = np.median(ag[ag < np.percentile(ag, 60)]) if len(ag) > 10 else np.median(ag)
            mult = np.maximum(1, np.round(ag / med))
            # each grain's ellipse: long and short axes and orientation (second moments)
            ys_, xs_ = np.nonzero(sel); lid = lbb[ys_, xs_]
            cnt = np.bincount(lid, minlength=n).astype(float); cnt[cnt == 0] = 1
            mx = np.bincount(lid, xs_, n) / cnt; my = np.bincount(lid, ys_, n) / cnt
            dx, dy = xs_ - mx[lid], ys_ - my[lid]
            cxx = np.bincount(lid, dx * dx, n) / cnt; cyy = np.bincount(lid, dy * dy, n) / cnt; cxy = np.bincount(lid, dx * dy, n) / cnt
            tr, det = cxx + cyy, cxx * cyy - cxy ** 2; disc = np.sqrt(np.maximum(0, tr * tr / 4 - det))
            gs = g[ag <= np.percentile(ag, 60)] if len(g) > 10 else g      # the single grains, not the merged clumps
            maj = float(np.median(4 * np.sqrt((tr / 2 + disc)[gs]) / r)); mnr = float(np.median(4 * np.sqrt(np.maximum(1e-6, tr / 2 - disc)[gs]) / r))
            ang = -np.degrees(0.5 * np.arctan2(2 * cxy[g], (cxx - cyy)[g]))
            t2 = np.radians(2 * ang); angm = float(np.degrees(np.arctan2(np.sin(t2).mean(), np.cos(t2).mean()) / 2))
            P_ = np.stack([mx[g], my[g]], 1); dd, _ = cKDTree(P_).query(P_, k=2); nn = dd[:, 1] / r
            # grains per mm²: the share of the zone they cover (blurred over 0.45 mm) over one single grain's area (clumps of touching
            # grains count by their area, not as one)
            zone_i = (macro == i).astype(np.float32)
            num = cv2.GaussianBlur(sel.astype(np.float32), (0, 0), 0.25 * r); dnm = cv2.GaussianBlur(zone_i, (0, 0), 0.25 * r)
            a1 = med / r / r
            dens = np.where(zone_i > 0, num / np.maximum(dnm, 1e-3) / a1, 0)
            dmax = float(np.percentile(dens[zone_i > 0], 99.5))
            if dmax <= 0: continue
            weight = float(dens[zone_i > 0].sum() / r / r * np.pi / 4 * maj * mnr)       # mm² of grains
            tot += weight
            levels = []
            # three levels; each band smoothed (open, close over 0.3 mm) so that its edge is a few soft curves, not a fray
            edges = [0.15, 0.45, 0.75]
            ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.2 * r) | 1, int(0.2 * r) | 1))
            for li, e0 in enumerate(edges):
                e1 = edges[li + 1] if li + 1 < len(edges) else 9
                band = ((dens >= e0 * dmax) & (dens < e1 * dmax) & (zone_i > 0)).astype(np.uint8)
                band = cv2.morphologyEx(cv2.morphologyEx(band, cv2.MORPH_OPEN, ker), cv2.MORPH_CLOSE, ker) > 0
                if band.sum() < 0.3 * r * r: continue
                Pl = poly_mm(band, org, r, 0.1, 0.3)
                if Pl: levels.append({'densite': round(float(np.median(dens[band])), 1), 'poly': Pl})
            if not levels: continue
            # the grains' colour: a little past their median toward their own side (their soft edges mix with the ground)
            v = labf[sel]; Lz = cols[i][0]; q = 60 if np.median(v[:, 0]) > Lz else 40
            core = v[(v[:, 0] >= np.percentile(v[:, 0], q - 20)) & (v[:, 0] <= np.percentile(v[:, 0], q + 20))]
            # a forced colour (poudre_seule: blue scales over black): its grains mix with the ground at their edges in hue as well;
            # their colour is that of their more chromatic half
            if j in forced: Cv = np.hypot(v[:, 1], v[:, 2]); core = v[Cv >= np.percentile(Cv, 50)]
            D.append({'sur': int(i), 'de': int(j), 'c': hexof(np.median(core, 0)), 'grain': [round(maj, 3), round(mnr, 3)], 'angle': round(angm, 1),
                      'espacement': round(float(np.median(nn[nn < np.percentile(nn, 50)])), 3), 'poids': weight, 'niveaux': levels})
            if j in forced:
                # a forced colour lies dense on a small area (the peacock's blue over its eyespot's black: about a thousand grains):
                # a tile there melts into a flat tint; every grain is kept at its place instead, with its tone (one of 3 measured
                # tones), in numbers. Where they touch, the grains are told apart by their lightness peaks (one scale, one peak,
                # 0.05 mm apart at least), with the axes and angle of the single grains
                s0_, q1_, _ = org
                Ls = cv2.GaussianBlur(labf[..., 0], (0, 0), 0.02 * r)
                kp = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.05 * r) | 1,) * 2)
                pk = (Ls >= cv2.dilate(Ls, kp)) & sel
                py_, px_ = np.nonzero(pk)
                lb3 = cv2.GaussianBlur(labf, (0, 0), 0.02 * r)[py_, px_]
                _, lbt, cent = cv2.kmeans(lb3.astype(np.float32), 3, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.2), 3, cv2.KMEANS_PP_CENTERS)
                D[-1]['tons'] = [hexof(c_ + [2, 0, 0]) for c_ in cent]
                rg_ = np.random.default_rng(int(i * 31 + j))
                D[-1]['grains'] = [[round(s0_ + (x_ + .5) / r, 2), round(q1_ - (y_ + .5) / r, 2), round(maj, 3), round(mnr, 3), int(round(angm + rg_.normal(0, 12))), int(l_)]
                                   for x_, y_, l_ in zip(px_, py_, lbt.ravel())]
                g = py_
                print('grains en place : %d sur la zone %d, tons %s' % (len(g), i, D[-1]['tons']))
    # keep the groups that carry 96 % of the grains' area (the rest does not show), at most 6
    D.sort(key=lambda x: -x['poids']); keepD = []; acc = 0
    for x in D:
        if acc >= 0.96 * tot or len(keepD) >= 6: break
        keepD.append(x); acc += x['poids']
    for x in keepD: x['poids'] = round(x['poids'], 2)
    return Z, keepD, fine, macro, cols


def striae(img, mm, org, r, vm=None, seuil=3.0, cell_mm=0.6, ncol=6, periode=None, vis=None, pc=5.0, centre=None):
    """the striae of a dead-leaf underside (cadres key stries; the peacock's): rows of scales along which dark and light scales
    run in short dashes. Read per cell of cell_mm, in numbers only, as the hairs are: the striae's direction (structure tensor
    over 0.3 mm), the share of the cell its dark and its light scales cover (the lightness against its median over 0.5 mm, by
    `seuil` L*), their colours (each quantised to `ncol` measured colours); over the wing, the dashes' length along the rows
    (runs walked along the measured direction) and width (across). The renderer lays dashes cell by cell to those numbers."""
    s0, q1, _ = org
    lab = lab_of(img); L = lab[..., 0]
    k = int(0.5 * r) | 1
    med = cv2.medianBlur(np.clip(L * 2.55, 0, 255).astype(np.uint8), k).astype(np.float32) / 2.55
    inner = cv2.erode(mm.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    if vm is not None: inner &= ~vm
    g1 = cv2.GaussianBlur(L, (0, 0), 0.7)
    ix = cv2.Sobel(g1, cv2.CV_32F, 1, 0, ksize=3); iy = cv2.Sobel(g1, cv2.CV_32F, 0, 1, ksize=3); si = 0.3 * r
    jxx = cv2.GaussianBlur(ix * ix, (0, 0), si); jyy = cv2.GaussianBlur(iy * iy, (0, 0), si); jxy = cv2.GaussianBlur(ix * iy, (0, 0), si)
    th_img = 0.5 * np.arctan2(2 * jxy, jxx - jyy) + np.pi / 2           # the lines' direction in the image (y down)
    # the scales read through a blur of 0.025 mm (one scale stays whole: unblurred, a dash breaks into specks of single scales)
    Lb = cv2.GaussianBlur(L, (0, 0), 0.025 * r)
    dark = (Lb < med - seuil) & inner; light = (Lb > med + seuil) & inner
    rng_ = np.random.default_rng(7)
    def runs(m):
        ys, xs = np.nonzero(m); i = rng_.choice(len(ys), min(5000, len(ys)), replace=False)
        out = []
        for y, x in zip(ys[i], xs[i]):
            dx, dy = np.cos(th_img[y, x]), np.sin(th_img[y, x]); n = 1
            for sg in (1, -1):
                for st in range(1, int(1.5 * r)):
                    xx, yy = int(round(x + sg * st * dx)), int(round(y + sg * st * dy))
                    if not (0 <= yy < m.shape[0] and 0 <= xx < m.shape[1]) or not m[yy, xx]: break
                    n += 1
            out.append(n / r)
        # a point falls in a run in proportion to its length: the median of this sample is the run that holds half of the dark
        # (light) area, the dash the eye sees (the specks of one scale count for little)
        return float(np.median(out))
    def width(m):
        # across the direction: the same walk, perpendicular
        ys, xs = np.nonzero(m); i = rng_.choice(len(ys), min(3000, len(ys)), replace=False); out = []
        for y, x in zip(ys[i], xs[i]):
            dx, dy = -np.sin(th_img[y, x]), np.cos(th_img[y, x]); n = 1
            for sg in (1, -1):
                for st in range(1, int(0.5 * r)):
                    xx, yy = int(round(x + sg * st * dx)), int(round(y + sg * st * dy))
                    if not (0 <= yy < m.shape[0] and 0 <= xx < m.shape[1]) or not m[yy, xx]: break
                    n += 1
            out.append(n / r)
        return float(np.median(out)) * 0.75                         # less the blur's widening
    cell = max(2, int(cell_mm * r)); cases = []; cd, cl = [], []
    for gy in range(0, mm.shape[0], cell):
        for gx in range(0, mm.shape[1], cell):
            b = inner[gy:gy + cell, gx:gx + cell]
            if b.sum() < 0.3 * cell * cell: continue
            t2 = 2 * th_img[gy:gy + cell, gx:gx + cell][b]
            a = np.arctan2(np.sin(t2).mean(), np.cos(t2).mean()) / 2
            ang = (-np.degrees(a) + 90) % 180 - 90                      # in the frame (q up)
            if centre is not None:
                # the rows of scales cross the veins: arcs around the point the veins radiate from (cadres stries.centre, mm; the
                # hinge for the peacock's underside, read on c259). On this face the tensor reads the scales' sides, not the rows
                cs_, cq_ = s0 + (gx + cell / 2) / r, q1 - (gy + cell / 2) / r
                ang = (np.degrees(np.arctan2(cq_ - centre[1], cs_ - centre[0])) + 90 + 90) % 180 - 90
            d_ = dark[gy:gy + cell, gx:gx + cell][b]; l_ = light[gy:gy + cell, gx:gx + cell][b]
            v = lab[gy:gy + cell, gx:gx + cell][b]
            # a little past their median toward their own side (their edges mix with the ground under the blur), as the dust
            cd.append((np.median(v[d_], 0) if d_.sum() >= 3 else np.median(v, 0)) - [4, 0, 0])
            cl.append((np.median(v[l_], 0) if l_.sum() >= 3 else np.median(v, 0)) + [3, 0, 0])
            cases.append([gx // cell, gy // cell, round(float(ang)), round(float(d_.mean()), 2), round(float(l_.mean()), 2)])
    pal = {}
    for side, C in (('sombre', cd), ('clair', cl)):
        C = np.array(C, np.float32)
        _, lb, cen = cv2.kmeans(C, ncol, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.2), 3, cv2.KMEANS_PP_CENTERS)
        pal[side] = ([hexof(c) for c in cen], lb.ravel())
    for i, c in enumerate(cases): c += [int(pal['sombre'][1][i]), int(pal['clair'][1][i])]
    res = {'cellule': round(cell / r, 3), 'cases': cases, 'sombre': pal['sombre'][0], 'clair': pal['clair'][0],
           'longueur': [round(runs(dark), 3), round(runs(light), 3)], 'largeur': [round(width(dark), 3), round(width(light), 3)]}
    # the dark lines (the zigzag postdiscal and basal lines): the darkest pc % of the lightness over 0.075 mm, in pieces whose
    # skeleton runs over 1.5 mm, outside the strip completed from the other face; drawn over the striae as measured contours
    from skimage.morphology import skeletonize
    zone_in = inner if vis is None else inner & (cv2.erode(vis.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0)
    Lb3 = cv2.GaussianBlur(L, (0, 0), 0.075 * r)
    lm = (Lb3 < np.percentile(Lb3[zone_in], pc)) & zone_in
    lm = cv2.morphologyEx(lm.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))) > 0
    n_, cc_, st_, _ = cv2.connectedComponentsWithStats(lm.astype(np.uint8), connectivity=8)
    skl = np.bincount(cc_[skeletonize(lm)], minlength=n_) / r
    keep = skl > 1.5; keep[0] = False; lm = keep[cc_]
    res['lignes'] = [{'c': hexof(np.median(lab[lm & (L <= np.percentile(L[lm], 60))], 0) - [2, 0, 0]), 'poly': poly_mm(lm, org, r, 0.04, 0.05)}] if lm.any() else []
    print('lignes : %d morceaux, %.1f mm de long, %.2f mm²' % (keep.sum(), skl[keep].sum(), lm.sum() / r / r))
    # a dash is one row of scales wide: the walk across, widened by the blur and by neighbouring rows, is bounded by the rows'
    # measured period (scale_rows)
    if periode: res['largeur'] = [round(min(w_, 0.8 * periode), 3) for w_ in res['largeur']]; res['periode'] = round(periode, 4)
    # the golden scales: a few bright, warm scales scattered over the striae (L* over its median by 15, chroma over 18), kept at
    # their places, in two measured tones
    Cc = np.hypot(lab[..., 1], lab[..., 2])
    gm = (Lb > med + 15) & (Cc > 18) & inner
    n_, cc2, st2, cen2 = cv2.connectedComponentsWithStats(gm.astype(np.uint8), connectivity=8)
    ok_ = np.nonzero((st2[1:, cv2.CC_STAT_AREA] >= 2) & (st2[1:, cv2.CC_STAT_AREA] <= 0.06 * r * r))[0] + 1
    if len(ok_) >= 10:
        cols_ = np.array([np.median(lab[cc2 == i], 0) for i in ok_], np.float32)
        _, lbp, cenp = cv2.kmeans(cols_, 2, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.2), 3, cv2.KMEANS_PP_CENTERS)
        res['paillettes'] = {'c': [hexof(c_) for c_ in cenp], 'taille': round(float(np.median(2 * np.sqrt(st2[ok_, cv2.CC_STAT_AREA] / np.pi)) / r), 3),
                             'pts': [[round(s0 + (cen2[i][0] + .5) / r, 2), round(q1 - (cen2[i][1] + .5) / r, 2), int(l_)] for i, l_ in zip(ok_, lbp.ravel())]}
        print('paillettes : %d, %s, %.3f mm' % (len(ok_), res['paillettes']['c'], res['paillettes']['taille']))
    print('stries : %d cases, sombre %.0f %% clair %.0f %%, tirets %.2f / %.2f mm de long, %.3f / %.3f mm de large'
          % (len(cases), 100 * dark[inner].mean(), 100 * light[inner].mean(), *res['longueur'], *res['largeur']))
    return res


def outline(mm, org, r):
    cs, _ = cv2.findContours(mm.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cn = max(cs, key=cv2.contourArea)
    ap = cv2.approxPolyDP(cn, 0.03 * r, True)[:, 0, :]
    return [[round(x, 2), round(y, 2)] for x, y in to_mm(ap, org)]


def scale_rows(img, mm, macro, org, r):
    """the rows of scales: on every 2.4 mm patch of one zone, the spectrum's peak gives their period and the direction across
    them; the point they radiate from is fitted to those directions (least squares on the lines through each patch)."""
    g = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY).astype(float); s0, q1, _ = org
    n = int(1.2 * r); out = []
    win = np.outer(np.hanning(2 * n), np.hanning(2 * n)); yy, xx = np.mgrid[:2 * n, :2 * n] - n; rr = np.hypot(xx, yy)
    for y in range(n, mm.shape[0] - n, n):
        for x in range(n, mm.shape[1] - n, n):
            z = macro[y - n:y + n, x - n:x + n]
            for j in np.unique(z[z >= 0]):
                if (z == j).mean() < 0.9: continue
                p = g[y - n:y + n, x - n:x + n]; p = p - cv2.GaussianBlur(p, (0, 0), 6)
                F = np.abs(np.fft.fftshift(np.fft.fft2(p * win))) ** 2
                F[(rr < 2 * n / (0.16 * r)) | (rr > 2 * n / (0.05 * r))] = 0      # periods 0.05 to 0.16 mm
                i = np.argmax(F); fy, fx = np.unravel_index(i, F.shape); fy -= n; fx -= n
                sharp = F.max() / (F.mean() + 1e-9)
                if sharp < 25: continue
                out.append([round(s0 + (x + .5) / r, 2), round(q1 - (y + .5) / r, 2), int(j), round(float(2 * n / np.hypot(fx, fy) / r), 4),
                            round(float(np.degrees(np.arctan2(-fy, fx)) % 180), 1), round(float(sharp), 0)])
    res = {'patches': out}
    if len(out) >= 6:
        A = np.array(out, float)
        # rows are read on the zone whose spectrum peaks at the shortest period (elsewhere the peak is the dust's spacing)
        # rows are the short periods (0.06 to 0.13 mm); a longer peak is the dust's spacing
        B = A[(A[:, 3] >= 0.06) & (A[:, 3] <= 0.13)]
        jr = int(np.bincount(B[:, 2].astype(int)).argmax()) if len(B) else -1
        def fit(B):
            th = np.radians(B[:, 4]); d = np.stack([np.cos(th), np.sin(th)], 1); P = B[:, :2]
            nrm = np.stack([-d[:, 1], d[:, 0]], 1); w_ = np.sqrt(B[:, 5])
            M = (nrm * w_[:, None]).T @ nrm; b = (nrm * w_[:, None]).T @ (nrm * P).sum(1)
            c = np.linalg.solve(M + 1e-6 * np.eye(2), b)
            pred = np.degrees(np.arctan2(P[:, 1] - c[1], P[:, 0] - c[0])) % 180
            return c, ((B[:, 4] - pred + 90) % 180) - 90
        if len(B) >= 6:
            c, err = fit(B)
            keep = np.abs(err) < 25
            if keep.sum() >= 6: c, err = fit(B[keep])
            res.update({'zone': int(jr), 'centre': [round(float(c[0]), 2), round(float(c[1]), 2)], 'periode': round(float(np.median(B[:, 3])), 4),
                        'ecart_deg': round(float(np.median(np.abs(err))), 1), 'n': int(len(B))})
    return res


def fringe(img, mm, ol, org, r, pas=0.25, larg=0.1):
    """the colour just inside the edge, every `pas` mm along the outline: the median of the wing's pixels within `larg` mm of
    the edge around that point (the fringe of the margin, the hairs of the inner margin); colours quantised to 1.5 L* to share
    paths"""
    s0, q1, _ = org
    edge = mm & ~(cv2.erode(mm.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0)
    dist = cv2.distanceTransform(mm.astype(np.uint8), cv2.DIST_L2, 5)
    band = mm & (dist <= larg * r)
    ys, xs = np.nonzero(band); lab = lab_of(img)[ys, xs]
    from scipy.spatial import cKDTree
    T = cKDTree(np.stack([xs, ys], 1))
    P = np.array([[(x - s0) * r, (q1 - y) * r] for x, y in ol], float)
    pts = []; acc = 0.0
    for i in range(len(P)):
        a, b = P[i], P[(i + 1) % len(P)]; L = np.linalg.norm(b - a)
        while acc <= L: pts.append(a + (b - a) * (acc / L if L else 0)); acc += pas * r
        acc -= L
    V = []
    for p in pts:
        idx = T.query_ball_point(p, pas * r * 0.7)
        V.append(np.median(lab[idx], 0) if len(idx) >= 3 else np.array([50, 0, 0]))
    # a palette of 6 measured colours (k-means): long runs of one colour, a few paths
    V = np.array(V, np.float32)
    _, lb, cen = cv2.kmeans(V, min(6, len(V)), None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.2), 3, cv2.KMEANS_PP_CENTERS)
    pal = [hexof(c) for c in cen]
    return {'pas': pas, 'largeur': larg, 'couleurs': [pal[i] for i in lb.ravel()]}


def hairs(img, mm, hm, org, r, cell_mm=0.8, couleurs=False):
    """the long hairs over a wing's base and inner margin (their region read on the photo's grid, porteur's rule « tracé »,
    their content measured): per cell of cell_mm, the hairs' direction (structure tensor of the flat photo, integration over
    0.25 mm), its coherence, the share of the cell the light hairs cover; the light and dark hair colours over the region"""
    s0, q1, _ = org
    g = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY).astype(np.float32)
    g1 = cv2.GaussianBlur(g, (0, 0), 0.7)
    ix = cv2.Sobel(g1, cv2.CV_32F, 1, 0, ksize=3); iy = cv2.Sobel(g1, cv2.CV_32F, 0, 1, ksize=3)
    si = 0.25 * r
    jxx = cv2.GaussianBlur(ix * ix, (0, 0), si); jyy = cv2.GaussianBlur(iy * iy, (0, 0), si); jxy = cv2.GaussianBlur(ix * iy, (0, 0), si)
    # the lines run across the dominant gradient
    th_g = 0.5 * np.arctan2(2 * jxy, jxx - jyy)
    coh = np.sqrt((jxx - jyy) ** 2 + 4 * jxy ** 2) / (jxx + jyy + 1e-6)
    lab = lab_of(img); L = lab[..., 0]
    loc = cv2.GaussianBlur(L, (0, 0), 0.15 * r)
    light = (L > loc + 4) & hm
    cell = max(2, int(cell_mm * r)); cases = []; cd_, cl_ = [], []
    for gy in range(0, mm.shape[0], cell):
        for gx in range(0, mm.shape[1], cell):
            b = hm[gy:gy + cell, gx:gx + cell]
            if b.sum() < 0.3 * cell * cell: continue
            t = th_g[gy:gy + cell, gx:gx + cell][b]; w = coh[gy:gy + cell, gx:gx + cell][b]
            t2 = 2 * t; a = np.arctan2((w * np.sin(t2)).sum(), (w * np.cos(t2)).sum()) / 2
            # line direction in the image (y down) = gradient + 90°, then in the frame (q up): flip the sign
            ang = -np.degrees(a + np.pi / 2)
            ang = (ang + 90) % 180 - 90
            cases.append([gx // cell, gy // cell, round(float(ang), 0), round(float(np.median(w)), 2),
                          round(float(light[gy:gy + cell, gx:gx + cell][b].mean()), 2)])
            if couleurs:
                # cadres key poils_couleurs: the hairs change colour over the region (the peacock's: rusty over the brown, white
                # along the inner margin): the cell's dark and light hairs (its lower and upper thirds of lightness), measured
                vv = lab[gy:gy + cell, gx:gx + cell][b]; lo, hi = np.percentile(vv[:, 0], [33, 67])
                cd_.append(np.median(vv[vv[:, 0] <= lo], 0)); cl_.append(np.median(vv[vv[:, 0] >= hi], 0))
    v = lab[hm]
    out = {'cellule': round(cell / r, 3), 'cases': cases,
           'clair': hexof(np.median(v[v[:, 0] >= np.percentile(v[:, 0], 80)], 0)),
           'sombre': hexof(np.median(v[v[:, 0] <= np.percentile(v[:, 0], 20)], 0)),
           'moyen': hexof(np.median(v, 0)), 'poly': poly_mm(hm, org, r, 0.08, 0.2)}
    if couleurs and len(cases) >= 6:
        for key, C in (('sombres', cd_), ('clairs', cl_)):
            _, lb, cen = cv2.kmeans(np.array(C, np.float32), 6, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.2), 3, cv2.KMEANS_PP_CENTERS)
            out[key] = [hexof(c) for c in cen]
            for cs, l in zip(cases, lb.ravel()): cs.append(int(l))
    print('poils : %d cases, clair %s sombre %s' % (len(cases), out['clair'], out['sombre']))
    return out


def fit_outline(mm, gf, org, r, other):
    """scale and turn (about the hinge, the frame's origin) that lay another specimen's outline on this wing's true edges: the
    edge pixels next to the plate's ground (not those along the wing or body that hides it)"""
    from scipy.spatial import cKDTree
    s0, q1, _ = org
    edge = mm & ~(cv2.erode(mm.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0)
    near_ground = cv2.dilate((~gf).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    ys, xs = np.nonzero(edge & near_ground)
    E = np.stack([s0 + (xs + .5) / r, q1 - (ys + .5) / r], 1)[::3]
    O = np.array(other, float)
    # the other outline densely sampled
    seg = []
    for i in range(len(O)):
        a, b = O[i], O[(i + 1) % len(O)]; n = max(1, int(np.linalg.norm(b - a) / 0.05))
        seg.append(a + (b - a) * np.linspace(0, 1, n, endpoint=False)[:, None])
    O = np.concatenate(seg)
    best = None
    for th in np.arange(-10, 10.01, 0.25):
        ct, st = np.cos(np.radians(th)), np.sin(np.radians(th))
        R = O @ np.array([[ct, st], [-st, ct]])
        for sc in np.arange(0.9, 1.1001, 0.005):
            d, _ = cKDTree(R * sc).query(E)
            cost = np.mean(np.minimum(d, 1.0))
            if best is None or cost < best[0]: best = (cost, sc, th)
    print('ajustement du contour : écart moyen %.3f mm sur %d points de bord vrai' % (best[0], len(E)))
    return float(best[1]), float(best[2])


def cmd_plat(o):
    C = json.load(open(o.cadres, encoding='utf-8')); c = C[o.nom]
    sid = C['_sid']; out = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom); os.makedirs(out, exist_ok=True)
    rgb = cv2.imread(os.path.join(ROOT, 'refcache', sid, c['photo']))[..., ::-1].copy()
    g = ground_tinted(rgb, c.get('fond_de', 5.0)) if c.get('fond') == 'degrade' else ground(rgb, c['pxmm'])
    mp = os.path.join(out, 'sam.png')
    if c.get('masque') == 'fond':
        # no model (cadres key masque: "fond"): where the plate's ground is clean, the specimen inside the wing's box is the wing,
        # its neighbours (the other wing, the body) cut off by the polygons read on the grid (retirer)
        x0, y0, x1, y1 = c['box']; m = np.zeros(g.shape, bool); m[y0:y1, x0:x1] = True; m &= g
        cv2.imwrite(mp, m.astype(np.uint8) * 255)
    elif os.path.exists(mp) and not o.sam: m = cv2.imread(mp, 0) > 127
    else: m = sam_mask(rgb, c); cv2.imwrite(mp, m.astype(np.uint8) * 255)
    # --sansfond: the mask is traced by hand on a natural ground (masques.json), not read against an MHNT plate
    if o.sansfond: g = np.ones(rgb.shape[:2], bool)
    # SAM separates the wing from its neighbours; the ground test sets its edge against the plate (SAM's edge is ~1.5 px coarse)
    # where a cut line was read on the grid (the edge between the two wings), SAM's own edge there (a few tenths of a mm short of
    # it) gives way: the specimen within 1 mm of SAM's mask, minus the cut region
    grow = 1 if c.get('masque') == 'fond' else int(c['pxmm'] * 1.0) if c.get('retirer') else 1 if o.sansfond else 7
    m = (cv2.dilate(m.astype(np.uint8), np.ones((grow, grow), np.uint8)) > 0) & g
    if c.get('retirer'):
        # the neighbour wing where SAM cannot tell the two apart: a polygon (px) read on the photo's grid
        R_ = c['retirer']; R_ = R_ if isinstance(R_[0][0], list) else [R_]          # one polygon, or several
        cut = np.zeros(m.shape, np.uint8)
        for P_ in R_: cv2.fillPoly(cut, [np.array(P_, np.int32)], 1)
        m &= cut == 0
    n_, lb_, st_, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
    if n_ > 2: m = lb_ == (1 + np.argmax(st_[1:, cv2.CC_STAT_AREA]))
    img, mm, org = flat(rgb, m, c, o.r)
    comp = c.get('complete'); align = None
    _, gf, _ = flat(rgb, g, c, o.r, org, (mm.shape[1], mm.shape[0]))
    if c.get('completer'):
        # the hidden strip from the same wing seen whole on the other face. Another specimen, spread at its own angle: the other
        # outline is fitted (scale and turn about the hinge) to this wing's TRUE edges only, those that border the plate's ground
        other = json.load(open(os.path.join(os.path.dirname(os.path.abspath(o.cadres)), c['completer'] + '.json'), encoding='utf-8'))
        sc_, th_ = fit_outline(mm, gf, org, o.r, other['contour'])
        ct, st = np.cos(np.radians(th_)), np.sin(np.radians(th_))
        comp = [[sc_ * (ct * x - st * y), sc_ * (st * x + ct * y)] for x, y in other['contour']]
        align = {'de': c['completer'], 'echelle': round(sc_, 4), 'angle': round(th_, 2)}
        print('complété par', c['completer'], 'échelle %.3f, tourné de %.2f°' % (sc_, th_))
    hid = np.zeros(mm.shape, bool)
    if comp:
        s0, q1, r = org
        P = np.array([[(x - s0) * r, (q1 - y) * r] for x, y in comp], np.int32)
        add = np.zeros(mm.shape, np.uint8); cv2.fillPoly(add, [P], 1)
        # only where something of the specimen hides the wing (the other wing, the body): never over the plate's ground
        hid = (add > 0) & ~mm & gf
        mm = mm | hid
    # the wing's base, hidden under the thorax and its hair: the hull of the wing within 4 mm of the hinge, with the hinge itself,
    # where the specimen (not the plate) lies; without it the wing would stop short of the body and leave a hole there
    s0b, q1b, rb = org; hx, hy = int((0 - s0b) * rb), int((q1b - 0) * rb)
    near = np.zeros(mm.shape, np.uint8); cv2.circle(near, (hx, hy), int(4 * rb), 1, -1)
    ys_, xs_ = np.nonzero(mm & (near > 0))
    if len(ys_):
        pts = np.concatenate([np.stack([xs_, ys_], 1), [[hx, hy]]]).astype(np.int32)
        hull = np.zeros(mm.shape, np.uint8); cv2.fillPoly(hull, [cv2.convexHull(pts)], 1)
        base = (hull > 0) & ~mm & gf
        hid = hid | base
        mm = mm | base
        print('base sous le corps : %.2f mm²' % (base.sum() / rb / rb))
    # one piece: an antenna or a hair crossing the edge is cut off
    mm = cv2.morphologyEx(mm.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))) > 0
    n_, lb_, st_, _ = cv2.connectedComponentsWithStats(mm.astype(np.uint8))
    if n_ > 2: mm = lb_ == (1 + np.argmax(st_[1:, cv2.CC_STAT_AREA]))
    hid &= mm
    if c.get('masquer'):
        # what lies over the wing without being the wing (a leg crossing it, px polygons): kept in the outline, filled from around
        hp = np.zeros(rgb.shape[:2], np.uint8)
        for P in c['masquer']: cv2.fillPoly(hp, [np.array(P, np.int32)], 1)
        _, hq, _ = flat(rgb, hp > 0, c, o.r, org, (mm.shape[1], mm.shape[0])); hid |= hq & mm
    vis = mm & ~hid
    if hid.any():
        from scipy import ndimage
        _, (iy, ix) = ndimage.distance_transform_edt(~vis, return_indices=True)
        img[hid] = img[iy[hid], ix[hid]]
        # --lisse: wide hidden strips (a leg across a tegmen) inpainted smooth rather than smeared from their nearest edge
        if o.lisse: img = cv2.inpaint(np.ascontiguousarray(img), (cv2.dilate(hid.astype(np.uint8), np.ones((3, 3), np.uint8))).astype(np.uint8), 6, cv2.INPAINT_TELEA)
    hm = None
    if c.get('poils'):
        hp = np.zeros(rgb.shape[:2], np.uint8)
        for P in c['poils']: cv2.fillPoly(hp, [np.array(P, np.int32)], 1)
        _, hm, _ = flat(rgb, hp > 0, c, o.r, org, (mm.shape[1], mm.shape[0])); hm &= mm
    # cadres key nervures: the thresholds of a dark face (the peacock's underside: its zigzag lines are drawn as measured lines)
    # the command line's vein options (the bush-cricket's pale veins), then the cadres key nervures over them
    V, vm = veins(img, mm, org, o.r, hm, **{'wmax': o.vlarg, 'thr': o.vseuil, 'light': o.vclaires, 'medmin': o.vclair, **c.get('nervures', {})})
    st_ = c.get('stries')
    forcer = [lab_of(np.array([[[int(h[i:i + 2], 16) for i in (1, 3, 5)]]], np.uint8))[0, 0] for h in c.get('poudre_seule', [])]
    hexlab = lambda h: lab_of(np.array([[[int(h[i:i + 2], 16) for i in (1, 3, 5)]]], np.uint8))[0, 0]
    sous = [(hexlab(a), hexlab(b)) for a, b in c.get('poudre_sous', {}).items()]
    Z, D, fine, macro, cols = zones(img, mm, org, o.k, o.r, hm=hm, vm=vm, forcer=forcer, teinte=c.get('poids_teinte', 1.4), sous=sous, **({'flou': st_.get('flou', 0.12), 'poudre': False} if st_ else {}))
    ol = outline(mm, org, o.r)
    # the rows of a striated face are read over the whole wing (its zones are only tones under the striae)
    rows = scale_rows(img, mm, np.where(mm, 0, -1) if st_ else macro, org, o.r)
    fr = fringe(img, mm, ol, org, o.r)
    rec = {'_doc': 'aile.py plat: contours et couleurs mesurés sur %s (repère : s vers l\'extérieur depuis la charnière, q vers la tête, mm). '
                   'Des chiffres, jamais l\'image.' % c['photo'], 'photo': c['photo'], 'pxmm': c['pxmm'], 'k': o.k, 'r': o.r, 'origine': [round(org[0], 3), round(org[1], 3)], 'taille': [int(mm.shape[1]), int(mm.shape[0])],
           'longueur': round(max(p[0] for p in ol), 2), 'contour': ol, 'zones': Z, 'poussiere': D,
           'cache': round(float(hid.sum() / mm.sum()), 3), 'rangees': rows, 'frange': fr, 'alignement': align, 'nervures': V,
           'poils': hairs(img, mm, hm, org, o.r, couleurs=bool(c.get('poils_couleurs'))) if hm is not None and hm.any() else None,
           'stries': striae(img, mm, org, o.r, vm, st_.get('seuil', 3.0), st_.get('cellule', 0.6), st_.get('ncol', 6), rows.get('periode'), vis, st_.get('lignes', 5.0), st_.get('centre')) if st_ else None}
    dst = os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.nom + '.json')
    json.dump(rec, open(dst, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, separators=(',', ':'))
    # control image: the flat wing | its zones in their colours | contours over the photo
    cv2.imwrite(os.path.join(out, 'plat.png'), img[..., ::-1])
    cv2.imwrite(os.path.join(out, 'masque.png'), mm.astype(np.uint8) * 255)
    pal = np.array([cv2.cvtColor(np.array([[cl]], np.float32), cv2.COLOR_LAB2RGB)[0, 0] for cl in cols])
    zim = np.full(img.shape, 239, np.uint8); zim[mm] = (np.clip(pal[macro[mm]], 0, 1) * 255).astype(np.uint8)
    ov = img.copy()
    for z in range(o.k):
        cs, _ = cv2.findContours((macro == z).astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(ov, cs, -1, (255, 0, 255), 1)
    cv2.imwrite(os.path.join(out, 'controle.jpg'), np.concatenate([img, zim, ov], 1)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    kb = os.path.getsize(dst) / 1024
    print(dst, '%.0f Ko' % kb, 'zones', len(Z), 'poussières', len(D), 'longueur %.2f mm' % rec['longueur'], 'caché %.1f %%' % (100 * rec['cache']))
    for z in Z: print('  zone', z['zone'], z['c'], 'part %.3f' % z['part'])


def de2000(a, b):
    L1, a1, b1 = a[..., 0], a[..., 1], a[..., 2]; L2, a2, b2 = b[..., 0], b[..., 1], b[..., 2]
    C1 = np.hypot(a1, b1); C2 = np.hypot(a2, b2); Cm = (C1 + C2) / 2
    G = 0.5 * (1 - np.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = a1 * (1 + G), a2 * (1 + G); C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1 = np.degrees(np.arctan2(b1, a1p)) % 360; h2 = np.degrees(np.arctan2(b2, a2p)) % 360
    dL = L2 - L1; dC = C2p - C1p
    dh = h2 - h1; dh = np.where(dh > 180, dh - 360, np.where(dh < -180, dh + 360, dh))
    dH = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lm = (L1 + L2) / 2; Cmp = (C1p + C2p) / 2
    hm = np.where(np.abs(h1 - h2) > 180, (h1 + h2 + 360) / 2, (h1 + h2) / 2)
    T = 1 - .17 * np.cos(np.radians(hm - 30)) + .24 * np.cos(np.radians(2 * hm)) + .32 * np.cos(np.radians(3 * hm + 6)) - .2 * np.cos(np.radians(4 * hm - 63))
    SL = 1 + .015 * (Lm - 50) ** 2 / np.sqrt(20 + (Lm - 50) ** 2); SC = 1 + .045 * Cmp; SH = 1 + .015 * Cmp * T
    RT = -2 * np.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7)) * np.sin(np.radians(60 * np.exp(-((hm - 275) / 25) ** 2)))
    return np.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH))


def cmd_paire(o):
    """the render of the wing alone, flat, in the same frame and scale (papillon-planche --plat), against the flattened photo:
    ΔE2000 per cell of 3 mm, contrast and grain per cell, and an image photo | render | ΔE map."""
    C = json.load(open(o.cadres, encoding='utf-8')); sid = C['_sid']
    d = os.path.join(ROOT, 'refcache', sid, 'ailes', o.nom)
    P = cv2.imread(os.path.join(d, 'plat.png'))[..., ::-1]; M = cv2.imread(os.path.join(d, 'masque.png'), 0) > 127
    R = cv2.imread(o.rendu)[..., ::-1]
    if R.shape != P.shape: R = cv2.resize(R, (P.shape[1], P.shape[0]), interpolation=cv2.INTER_AREA)
    rec = json.load(open(os.path.join(os.path.dirname(os.path.abspath(o.cadres)), o.nom + '.json'), encoding='utf-8')); r = rec['r']
    m = cv2.erode(M.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    lp, lr = lab_of(P), lab_of(R)
    bl = lambda x: cv2.GaussianBlur(x, (0, 0), 0.2 * r)      # the colour field, over the grain spacing (grains are judged by grain)
    dE = de2000(bl(lp), bl(lr)); dE[~m] = 0
    cell = int(3 * r); rows = []
    for gy in range(0, P.shape[0], cell):
        for gx in range(0, P.shape[1], cell):
            mk = m[gy:gy + cell, gx:gx + cell]
            if mk.sum() < 0.4 * cell * cell: continue
            Lp = lp[gy:gy + cell, gx:gx + cell, 0]; Lr = lr[gy:gy + cell, gx:gx + cell, 0]
            gp = np.std((Lp - cv2.GaussianBlur(Lp, (0, 0), 1.5))[mk]); gr = np.std((Lr - cv2.GaussianBlur(Lr, (0, 0), 1.5))[mk])
            rows.append({'s': round(rec['contour'][0][0] * 0 + (gx + cell / 2) / r, 1), 'q': round(-(gy + cell / 2) / r, 1),
                         'dE': round(float(np.median(dE[gy:gy + cell, gx:gx + cell][mk])), 1),
                         'contraste': round(float(np.std(Lr[mk]) / max(.5, np.std(Lp[mk]))), 2), 'grain': round(float(gr / max(.2, gp)), 2)})
    de = np.array([x['dE'] for x in rows]); con = np.array([x['contraste'] for x in rows]); gra = np.array([x['grain'] for x in rows])
    res = {'cases': len(rows), 'dE_med': round(float(np.median(de)), 1), 'dE_p90': round(float(np.percentile(de, 90)), 1),
           'ko': int((de > 6).sum()), 'proche': int(((de > 3) & (de <= 6)).sum()), 'ok': int((de <= 3).sum()),
           'contraste_med': round(float(np.median(con)), 2), 'grain_med': round(float(np.median(gra)), 2),
           'grain_hors': int(((gra < .7) | (gra > 1.4)).sum()), 'contraste_hors': int(((con < .7) | (con > 1.4)).sum())}
    json.dump({'resume': res, 'cases': rows}, open(os.path.join(d, 'paire.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    hm = np.ascontiguousarray(cv2.applyColorMap(np.clip(dE * 255 / 12, 0, 255).astype(np.uint8), cv2.COLORMAP_INFERNO)[..., ::-1])
    for x in rows:
        gx, gy = int(x['s'] * r - cell / 2), int(-x['q'] * r - cell / 2)
        cv2.rectangle(hm, (gx, gy), (gx + cell, gy + cell), (0, 255, 0) if x['dE'] <= 3 else (255, 200, 0) if x['dE'] <= 6 else (255, 0, 0), 1)
    Pb = P.copy(); Pb[~M] = 239; Rb = R.copy(); Rb[~M] = 239
    cv2.imwrite(os.path.join(d, 'paire.jpg'), np.concatenate([Pb, Rb, hm], 1)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])
    print(json.dumps(res, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd')
    a = sp.add_parser('plat'); a.add_argument('cadres'); a.add_argument('nom'); a.add_argument('--k', type=int, default=7)
    a.add_argument('--r', type=float, default=40); a.add_argument('--sig', type=float, default=0.1); a.add_argument('--sam', action='store_true')
    # veins: paler than the cells (--vclaires), their threshold, the lightest median ground they show on, their widest (mm)
    a.add_argument('--sansfond', action='store_true'); a.add_argument('--lisse', action='store_true'); a.add_argument('--vclaires', action='store_true'); a.add_argument('--vseuil', type=float, default=12.0); a.add_argument('--vclair', type=float, default=58.0); a.add_argument('--vlarg', type=float, default=0.35)
    b = sp.add_parser('paire'); b.add_argument('cadres'); b.add_argument('nom'); b.add_argument('rendu')
    o = ap.parse_args()
    {'plat': cmd_plat, 'paire': cmd_paire}[o.cmd](o)


if __name__ == '__main__':
    main()
