"""carte_fourmi.py: the shape map of an ant (PROTOCOLE §2) on a photo and on a render of the same view, so that both compare by numbers.
Runs in vases5/.venv-depth (SAM facebook/sam-vit-base, Depth Anything V2 base, on the CPU); one model at a time, through the gate:

  GATE_MAX=1 sh ws/gate.sh vases5/.venv-depth/Scripts/python insectes/fourmi-noire/outils/carte_fourmi.py photo <img> \
      --box x0,y0,x1,y1 --pts "x,y;x,y;..." [--neg "x,y;..."] --axe "xa,ya;xb,yb" --out <dir> [--depth] [--flip]
  python insectes/fourmi-noire/outils/carte_fourmi.py rendu <png> --axe "xa,ya;xb,yb" --out <dir>   (the render's alpha is its mask)
  python insectes/fourmi-noire/outils/carte_fourmi.py table <dir>... [--ref k]

--axe: the body's axis, from the front of the head (the closed mandibles) to the tip of the gaster, in image pixels. Points are in
image pixels too. Legs and antennae are taken off the mask by an opening of 2.2 % of the body length: what stays is the trunk.
Measures (carte.json), lengths in body lengths (the axis):
  profile     h[40]: the trunk's extent across the axis per station (top and bottom apart), from the head to the tip
  pieces      the waist and the neck found as the narrowest stations in their windows: head, mesosoma, petiole, gaster lengths;
              the height (or width, seen from above) of each piece at its widest
  appendages  share of the whole mask that is legs and antennae (the opened-away part), their mean thickness
  tone        L* of the trunk: p10, median, p90; gloss (share brighter than the median by 25 L*), contrast (std / mean), grain
              (std of L* minus its blur at 0.6 % of the length, over the trunk)
  relief      with --depth: the depth across the gaster and the mesosoma (normalised), its curvature (how domed)
Files: carte.json, carte.jpg (cut-out | trunk and stations | depth), mask.png. Photo pixels stay in refcache/ (never committed)."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
FLEUR = os.path.join(HERE, '..', '..', '..', 'fleur')
NS = 40


def pts_of(s):
    return [tuple(map(float, p.split(','))) for p in s.split(';') if p.strip()] if s else []


def lstar(rgb):
    c = rgb.astype(float) / 255.; c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    y = c @ [.2126, .7152, .0722]
    return np.where(y > .008856, 116 * np.cbrt(y) - 16, 903.3 * y)


def sam_mask(rgb, box, pos, neg):
    sys.path.insert(0, FLEUR)
    import carte
    torch = carte.torch_(); proc, model = carte.sam()
    pts = [list(p) for p in pos] + [list(p) for p in neg]
    lab = [1] * len(pos) + [0] * len(neg)
    # points only: the box is the whole crop, and with it SAM's best-scored candidate is the whole frame (87 % of c254)
    inp = proc(rgb, input_points=[[pts]], input_labels=[[lab]], return_tensors='pt')
    with torch.no_grad(): out = model(**inp, multimask_output=True)
    m = proc.image_processor.post_process_masks(out.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
    sc = out.iou_scores[0, 0].numpy()
    best, bs = None, -9
    for k in range(m.shape[0]):
        ok = all(m[k][int(y), int(x)] for x, y in pos)
        s = sc[k] + (1 if ok else 0) - (2 if m[k].mean() > 0.6 else 0)
        if s > bs: best, bs = k, s
    return m[best].astype(np.uint8), float(sc[best])


def depth(rgb):
    sys.path.insert(0, FLEUR)
    import carte
    return carte.depth_of(rgb)


def measure(rgb, mask, a, b, dep=None):
    A, B = np.array(a), np.array(b); L = float(np.linalg.norm(B - A)); u = (B - A) / L; n = np.array([-u[1], u[0]])
    r = max(1, int(round(0.022 * L / 2)))
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    trunk = cv2.morphologyEx(mask, cv2.MORPH_OPEN, k)
    # keep the components that touch the axis
    nl, lab = cv2.connectedComponents(trunk)
    keep = np.zeros_like(trunk)
    for i in range(1, nl):
        ys, xs = np.nonzero(lab == i)
        P = np.stack([xs, ys], 1) - A
        s = P @ u; d = np.abs(P @ n)
        if ((s > -0.05 * L) & (s < 1.05 * L) & (d < 0.08 * L)).any(): keep[lab == i] = 1
    trunk = keep
    ys, xs = np.nonzero(trunk); P = np.stack([xs, ys], 1) - A; s = (P @ u) / L; d = (P @ n) / L
    st = np.linspace(0, 1, NS + 1)
    top, bot, h = [], [], []
    for i in range(NS):
        sel = (s >= st[i]) & (s < st[i + 1])
        if sel.sum() < 3: top.append(0); bot.append(0); h.append(0); continue
        t, bb = float(np.percentile(d[sel], 99)), float(np.percentile(d[sel], 1))
        top.append(round(t, 4)); bot.append(round(bb, 4)); h.append(round(t - bb, 4))
    h = np.array(h)
    def argmin_in(lo, hi):
        i0, i1 = int(lo * NS), int(hi * NS); j = i0 + int(np.argmin(h[i0:i1])); return j
    neck = argmin_in(0.17, 0.32)
    waist = argmin_in(0.45, 0.66)
    # the petiole: from the waist's narrow stations, the scale between two narrowings (front of the gaster: where h rises past 60 %)
    g0 = waist
    while g0 < NS - 1 and h[g0] < 0.6 * h[int(0.82 * NS)]: g0 += 1
    m0 = waist
    while m0 > neck and h[m0] < 0.6 * h[(neck + waist) // 2]: m0 -= 1
    pieces = {
        'tete': [0, (neck + 0.5) / NS], 'mesosome': [(neck + 0.5) / NS, (m0 + 0.5) / NS],
        'petiole': [(m0 + 0.5) / NS, (g0 + 0.5) / NS], 'gastre': [(g0 + 0.5) / NS, 1.0]}
    hp = {k2: round(float(h[int(v[0] * NS):max(int(v[0] * NS) + 1, int(v[1] * NS))].max()), 4) for k2, v in pieces.items()}
    Lst = lstar(rgb)
    T = trunk.astype(bool)
    lv = Lst[T]
    med = float(np.median(lv))
    blur = cv2.GaussianBlur(Lst.astype(np.float32), (0, 0), max(0.8, 0.006 * L))
    grain = float(np.std((Lst - blur)[cv2.erode(trunk, np.ones((5, 5), np.uint8)).astype(bool)]))
    out = {'longueur_px': round(L, 1), 'h': [float(x) for x in h], 'haut': top, 'bas': bot,
           'pieces': {k2: [round(v[0], 3), round(v[1], 3)] for k2, v in pieces.items()},
           'longueurs': {k2: round(v[1] - v[0], 3) for k2, v in pieces.items()}, 'hauteurs': hp,
           'appendices': round(float((mask.sum() - trunk.sum()) / max(1, mask.sum())), 3),
           'ton': {'p10': round(float(np.percentile(lv, 10)), 1), 'med': round(med, 1), 'p90': round(float(np.percentile(lv, 90)), 1),
                   'lustre': round(float((lv > med + 25).mean()), 3), 'contraste': round(float(lv.std() / max(1, lv.mean())), 3), 'grain': round(grain, 2)}}
    if dep is not None:
        dz = dep.copy(); v = dz[T]; lo, hi = np.percentile(v, 2), np.percentile(v, 98); dz = (dz - lo) / max(1e-6, hi - lo)
        rel = {}
        for k2, (p0, p1) in pieces.items():
            sel = T & (((np.stack(np.meshgrid(np.arange(T.shape[1]), np.arange(T.shape[0])), -1) - A) @ u / L >= p0) & ((np.stack(np.meshgrid(np.arange(T.shape[1]), np.arange(T.shape[0])), -1) - A) @ u / L < p1))
            if sel.sum() > 20: rel[k2] = {'med': round(float(np.median(dz[sel])), 3), 'etendue': round(float(np.percentile(dz[sel], 95) - np.percentile(dz[sel], 5)), 3)}
        out['relief'] = rel
    return out, trunk


def panels(rgb, mask, trunk, a, b, res, dep, path):
    H, W = mask.shape
    cut = rgb.copy(); cut[mask == 0] = (cut[mask == 0] * 0.25 + 180).astype(np.uint8)
    tr = np.full_like(rgb, 235); tr[trunk > 0] = (60, 60, 60); tr[(mask > 0) & (trunk == 0)] = (150, 150, 200)
    A, B = np.array(a), np.array(b); L = res['longueur_px']; u = (B - A) / L; n = np.array([-u[1], u[0]])
    for k2, (p0, p1) in res['pieces'].items():
        for p in (p0, p1):
            c = A + u * p * L
            cv2.line(tr, tuple(int(x) for x in c - n * 0.15 * L), tuple(int(x) for x in c + n * 0.15 * L), (220, 60, 40), max(1, int(L / 400)))
    cv2.line(tr, tuple(int(x) for x in A), tuple(int(x) for x in B), (40, 120, 220), max(1, int(L / 500)))
    ims = [cut, tr]
    if dep is not None:
        dz = dep.copy(); v = dz[mask > 0]; lo, hi = np.percentile(v, 2), np.percentile(v, 98)
        dd = (np.clip((dz - lo) / max(1e-6, hi - lo), 0, 1) * 255).astype(np.uint8)
        dc = cv2.applyColorMap(dd, cv2.COLORMAP_VIRIDIS)[..., ::-1]; dc[mask == 0] = 235; ims.append(dc)
    sheet = np.concatenate([np.pad(i, ((0, 0), (0, 6), (0, 0)), constant_values=239) for i in ims], 1)
    s = min(1.0, 2400 / sheet.shape[1])
    cv2.imwrite(path, cv2.resize(sheet, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 88])


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('mode'); ap.add_argument('args', nargs='+')
    ap.add_argument('--box'); ap.add_argument('--pts'); ap.add_argument('--neg'); ap.add_argument('--axe'); ap.add_argument('--out')
    ap.add_argument('--depth', action='store_true'); ap.add_argument('--ref', type=int, default=0); ap.add_argument('--seuil', default='45')
    o = ap.parse_args()
    if o.mode == 'table': return table(o.args, o.ref)
    if o.mode == 'lot':
        # a batch from a json list [{"photo", "box", "pts", "neg", "axe", "out", "depth"}]: SAM and the depth model load once
        for job in json.load(open(o.args[0], encoding='utf-8')):
            if os.path.exists(os.path.join(job['out'], 'carte.json')) and not job.get('refaire'): continue
            run(argparse.Namespace(mode='photo', args=[job['photo']], box=job['box'], pts=job['pts'], neg=job.get('neg'), axe=job['axe'],
                                   out=job['out'], depth=job.get('depth', False)))
        return
    run(o)


def run(o):
    img = o.args[0]; os.makedirs(o.out, exist_ok=True)
    (xa, ya), (xb, yb) = pts_of(o.axe)
    if o.mode == 'seuil':
        # no model: a dark ant on a light ground (white sheet, specimen plate, orange mealybugs), the mask by L* under --seuil,
        # its holes (highlights on the cuticle) filled; to check against SAM when the gate lets the model run
        rgb = cv2.imread(img)[..., ::-1].copy()
        x0, y0, x1, y1 = map(int, o.box.split(','))
        crop = rgb[y0:y1, x0:x1].copy()
        Ls = cv2.GaussianBlur(lstar(crop).astype(np.float32), (0, 0), 1.2)
        m = (Ls < float(o.seuil)).astype(np.uint8)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
        ff = m.copy(); hh, ww = m.shape; fl = np.zeros((hh + 2, ww + 2), np.uint8)
        cv2.floodFill(ff, fl, (0, 0), 1); mask = (m | (1 - ff)).astype(np.uint8)
        nl, lab, st, _ = cv2.connectedComponentsWithStats(mask)
        big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])) if nl > 1 else 1
        mask = (lab == big).astype(np.uint8)
        sc = 0.0; dep = None; a, b = (xa - x0, ya - y0), (xb - x0, yb - y0)
    elif o.mode == 'photo':
        rgb = cv2.imread(img)[..., ::-1].copy()
        x0, y0, x1, y1 = map(int, o.box.split(','))
        crop = rgb[y0:y1, x0:x1].copy()
        sh = lambda P: [(x - x0, y - y0) for x, y in P]
        mask, sc = sam_mask(crop, (0, 0, x1 - x0, y1 - y0), sh(pts_of(o.pts)), sh(pts_of(o.neg)))
        dep = depth(crop) if o.depth else None
        a, b = (xa - x0, ya - y0), (xb - x0, yb - y0)
    else:
        im = cv2.imread(img, cv2.IMREAD_UNCHANGED)
        crop = im[..., 2::-1].copy(); mask = (im[..., 3] > 127).astype(np.uint8) if im.shape[2] == 4 else None
        sc = 1.0; dep = None; a, b = (xa, ya), (xb, yb)
        if mask is None: sys.exit('rendu sans alpha')
    res, trunk = measure(crop, mask, a, b, dep)
    res.update({'source': os.path.basename(img), 'mode': o.mode, 'score_sam': round(sc, 3),
                'decalage': [int(v) for v in o.box.split(',')[:2]] if o.box else [0, 0]})
    json.dump(res, open(os.path.join(o.out, 'carte.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    cv2.imwrite(os.path.join(o.out, 'mask.png'), mask * 255)
    if dep is not None: np.save(os.path.join(o.out, 'depth.npy'), dep.astype(np.float16))
    panels(crop, mask, trunk, a, b, res, dep, os.path.join(o.out, 'carte.jpg'))
    print(o.out, 'L %.0f px' % res['longueur_px'], res['longueurs'], res['hauteurs'], res['ton'])


def table(dirs, nref):
    R = [json.load(open(os.path.join(d, 'carte.json'), encoding='utf-8')) for d in dirs]
    rows = [('tete L', lambda r: r['longueurs']['tete']), ('mesosome L', lambda r: r['longueurs']['mesosome']),
            ('petiole L', lambda r: r['longueurs']['petiole']), ('gastre L', lambda r: r['longueurs']['gastre']),
            ('tete h', lambda r: r['hauteurs']['tete']), ('mesosome h', lambda r: r['hauteurs']['mesosome']),
            ('gastre h', lambda r: r['hauteurs']['gastre']), ('appendices', lambda r: r['appendices']),
            ('L* med', lambda r: r['ton']['med']), ('L* p90', lambda r: r['ton']['p90']), ('lustre', lambda r: r['ton']['lustre']),
            ('contraste', lambda r: r['ton']['contraste']), ('grain', lambda r: r['ton']['grain'])]
    print('%-12s' % '' + ''.join('%11s' % os.path.basename(os.path.normpath(d))[:10] for d in dirs))
    verdicts = {}
    for name, f in rows:
        v = [f(r) for r in R]
        line = '%-12s' % name + ''.join('%11.3f' % x for x in v)
        if nref:
            lo, hi = min(v[:nref]), max(v[:nref]); w = (hi - lo) * 0.25 + 1e-9
            lo2, hi2 = lo - max(w, abs(lo) * 0.05), hi + max(w, abs(hi) * 0.05)
            ok = ['ok' if lo2 <= x <= hi2 else 'KO' for x in v[nref:]]
            line += '   [%.3f..%.3f] ' % (lo2, hi2) + ' '.join(ok)
            verdicts[name] = ok
        print(line)
    return verdicts


if __name__ == '__main__':
    main()
