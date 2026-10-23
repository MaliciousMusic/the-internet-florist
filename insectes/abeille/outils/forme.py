"""forme.py: the shape map of an insect photo or of a render (PROTOCOLE §2): the body cut out by SAM (box, points inside, points on
its neighbours), its depth by Depth Anything V2, then measured along the body axis: the width (or height) profile, the pieces
between the constrictions (neck, petiole), their lengths and widths over the body length, and the relief across each piece.
Runs in vases5/.venv-depth (SAM and depth loaded one after the other); always through GATE_MAX=1 sh ws/gate.sh.

  python forme.py photo <cadres.json> <nom>         the photo of cadres[nom] -> formes/<nom>.json, refcache/<sid>/formes/<nom>.jpg
  python forme.py rendu <png> <nom> --axe x,y;x,y [--bg #efe9df] [--depth]
                                                    a render on its flat ground -> formes/rendu-<nom>.json (same measures)
  python forme.py table <cadres.json> [rendu-<nom> ...]
                                                    the photos' range per view, and each render's verdict (inside the range widened by 25 %)

cadres[nom]: photo (refcache/<sid>/...), vue (dessus | profil | face), box, pos, neg (px), axe: [tail, head] (px, on the midline),
coupes: the expected number of pieces (3: head, thorax, abdomen), nojambes: the opening (mm) that takes legs and antennae off the cut-out.
Only numbers are written into the repository; the cut-outs and depth maps stay in refcache/."""
import sys, os, json
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(HERE, '..', 'formes')
N = 300   # samples along the axis


def sam_mask(rgb, box, pos, neg):
    import torch
    from transformers import SamModel, SamProcessor
    torch.set_num_threads(max(1, (os.cpu_count() or 4) // 2))
    proc = SamProcessor.from_pretrained('facebook/sam-vit-base'); model = SamModel.from_pretrained('facebook/sam-vit-base').eval()
    pts = pos + neg; lbl = [1] * len(pos) + [0] * len(neg)
    inp = proc(images=rgb, input_boxes=[[box]], input_points=[[pts]], input_labels=[[lbl]], return_tensors='pt')
    with torch.no_grad(): o = model(**inp, multimask_output=True)
    ms = proc.image_processor.post_process_masks(o.pred_masks, inp['original_sizes'], inp['reshaped_input_sizes'])[0][0].numpy()
    sc = o.iou_scores[0, 0].numpy()
    def score(k):
        m = ms[k]
        return sc[k] + 2 * np.mean([m[int(p[1]), int(p[0])] for p in pos]) - 2 * (np.mean([m[int(p[1]), int(p[0])] for p in neg]) if neg else 0)
    k = max(range(len(sc)), key=score)
    del model
    return ms[k]


def depth(rgb):
    sys.path.insert(0, os.path.join(ROOT, 'fleur'))
    import carte
    return carte.depth_of(rgb)


def along(m, d, axe, L_ext=0.12):
    """the cut-out sampled along the axis (tail -> head, prolonged by L_ext of its length at both ends): per sample, the extent of the
    mask on each side of the axis (px) and the relief across it (depth at the axis minus its mean over the outer fifth, over the
    depth range of the whole body)"""
    a, b = np.array(axe[0], float), np.array(axe[1], float)
    L = np.linalg.norm(b - a); e = (b - a) / L; nrm = np.array([-e[1], e[0]])
    ts = np.linspace(-L_ext, 1 + L_ext, N)
    H, W = m.shape
    half = int(0.6 * L)
    offs = np.arange(-half, half + 1)
    rows = []
    rng = (np.percentile(d[m], 98) - np.percentile(d[m], 2)) if d is not None else 1
    for t in ts:
        c = a + e * L * t
        P = c[None] + nrm[None] * offs[:, None]
        x = np.clip(P[:, 0].round().astype(int), 0, W - 1); y = np.clip(P[:, 1].round().astype(int), 0, H - 1)
        inb = (P[:, 0] >= 0) & (P[:, 0] < W) & (P[:, 1] >= 0) & (P[:, 1] < H)
        on = m[y, x] & inb
        if not on.any(): rows.append((t, 0, 0, None)); continue
        # the run that holds the axis (or the nearest run to it)
        idx = np.nonzero(on)[0]; mid = half
        k = idx[np.argmin(np.abs(idx - mid))]
        lo = k
        while lo > 0 and on[lo - 1]: lo -= 1
        hi = k
        while hi < len(on) - 1 and on[hi + 1]: hi += 1
        rel = None
        if d is not None and hi - lo > 10:
            dv = d[y[lo:hi + 1], x[lo:hi + 1]]
            n5 = max(2, (hi - lo) // 5)
            rel = float((np.median(dv[(hi - lo) // 2 - n5 // 2:(hi - lo) // 2 + n5 // 2 + 1]) - 0.5 * (dv[:n5].mean() + dv[-n5:].mean())) / max(1e-6, rng))
        rows.append((t, mid - lo, hi - mid, rel))
    return L, rows


def pieces(L, rows, n):
    """the n pieces between the n - 1 deepest constrictions of the width profile (local minima, each the lowest within 8 % of the
    length), from the tail; per piece its start, end, widest point and width (in body lengths: the extent of the cut-out along the
    axis), and its median relief"""
    t = np.array([r[0] for r in rows]); w = np.array([r[1] + r[2] for r in rows], float)
    on = np.nonzero(w > 0)[0]; i0, i1 = on[0], on[-1]
    t0, t1 = t[i0], t[i1]; BL = (t1 - t0) * L
    ws = cv2.GaussianBlur(w.reshape(-1, 1).astype(np.float32), (1, 0), 2).ravel()
    win = int(0.08 * N)
    mins = [i for i in range(i0 + win, i1 - win) if ws[i] == ws[max(i0, i - win):i + win + 1].min()]
    # the n - 1 deepest relative to their surroundings
    depth_of = lambda i: min(ws[max(i0, i - 3 * win):i].max(), ws[i + 1:i + 3 * win + 1].max()) - ws[i]
    mins = sorted(sorted(mins, key=depth_of, reverse=True)[:n - 1])
    cuts = [i0] + mins + [i1]
    out = []
    for j in range(n):
        a, b = cuts[j], cuts[j + 1]
        k = a + int(np.argmax(ws[a:b + 1]))
        rel = [r[3] for r in rows[a:b + 1] if r[3] is not None]
        out.append({'debut': round(float((t[a] - t0) * L / BL), 3), 'fin': round(float((t[b] - t0) * L / BL), 3),
                    'longueur': round(float((t[b] - t[a]) * L / BL), 3), 'large_a': round(float((t[k] - t0) * L / BL), 3),
                    'largeur': round(float(w[k] / BL), 3), 'relief': round(float(np.median(rel)), 3) if rel else None})
    prof = []
    for q in np.linspace(0, 1, 41):
        tt = t0 + q * (t1 - t0); i = int(np.argmin(np.abs(t - tt)))
        prof.append(round(float(w[i] / BL), 3))
    return BL, out, prof


def clean(m, px):
    """legs, antennae and pins off: an opening by a disk of px, then the largest piece"""
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (max(3, int(px) | 1), max(3, int(px) | 1)))
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, k)
    n, lb, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 2: m = (lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    from scipy import ndimage
    return ndimage.binary_fill_holes(m > 0)


def control(rgb, m, d, axe, path):
    v = rgb.copy(); v[~m] = (v[~m] * 0.25).astype(np.uint8)
    cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cv2.drawContours(v, cs, -1, (255, 0, 255), 3)
    cv2.line(v, tuple(map(int, axe[0])), tuple(map(int, axe[1])), (0, 255, 255), 3)
    if d is not None:
        dn = np.zeros(m.shape, np.uint8); lo, hi = np.percentile(d[m], [2, 98]); dn[m] = np.clip((d[m] - lo) / (hi - lo + 1e-6) * 255, 0, 255)
        v = np.concatenate([v, cv2.applyColorMap(dn, cv2.COLORMAP_INFERNO)[..., ::-1]], 1)
    s = 1400 / v.shape[1]
    cv2.imwrite(path, cv2.resize(v, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)[..., ::-1], [cv2.IMWRITE_JPEG_QUALITY, 85])


def cmd_photo(cad, nom):
    C = json.load(open(cad, encoding='utf-8')); c = C[nom]; sid = C['_sid']
    rgb = cv2.imread(os.path.join(ROOT, 'refcache', sid, c['photo']))[..., ::-1].copy()
    ref = os.path.join(ROOT, 'refcache', sid, 'formes'); os.makedirs(ref, exist_ok=True)
    mp = os.path.join(ref, nom + '-m.png'); dp = os.path.join(ref, nom + '-d.npy')
    if os.path.exists(mp): m0 = cv2.imread(mp, 0) > 127
    else: m0 = sam_mask(rgb, c['box'], c['pos'], c.get('neg', [])); cv2.imwrite(mp, m0.astype(np.uint8) * 255)
    if os.path.exists(dp): d = np.load(dp)
    else:
        x0, y0, x1, y1 = c['box']; d = np.zeros(m0.shape, np.float32)
        d[y0:y1, x0:x1] = depth(np.ascontiguousarray(rgb[y0:y1, x0:x1])); np.save(dp, d)
    L0 = np.linalg.norm(np.subtract(c['axe'][1], c['axe'][0]))
    m = clean(m0, c.get('nojambes', 0.05) * L0)
    L, rows = along(m, d, c['axe'])
    BL, P, prof = pieces(L, rows, c.get('coupes', 3))
    rec = {'_doc': 'forme.py: cut-out (SAM) and relief (Depth Anything V2) of %s, measured along the body axis; lengths and widths in body '
                   'lengths (the cut-out\'s extent along the axis), relief: depth at the axis over the outer fifth, in the body\'s depth range. '
                   'Numbers only.' % c['photo'], 'photo': c['photo'], 'vue': c['vue'], 'longueur_px': round(float(BL), 1), 'pieces': P,
           'profil': prof, 'ecart': c.get('ecart')}
    os.makedirs(OUT, exist_ok=True)
    json.dump(rec, open(os.path.join(OUT, nom + '.json'), 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    control(rgb, m, d, c['axe'], os.path.join(ref, nom + '.jpg'))
    print(nom, c['vue'], 'longueur %.0f px' % BL, json.dumps(P, ensure_ascii=False))


def cmd_rendu(png, nom, axe, bg, with_depth):
    im = cv2.imread(png, cv2.IMREAD_UNCHANGED)
    if im.shape[2] == 4: m0 = im[..., 3] > 40; rgb = np.ascontiguousarray(im[..., :3][..., ::-1])
    else:
        rgb = im[..., ::-1].copy(); g = np.array([int(bg[i:i + 2], 16) for i in (1, 3, 5)])
        m0 = np.abs(rgb.astype(int) - g).max(2) > 10
    d = None
    if with_depth:
        ys, xs = np.nonzero(m0); x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        d = np.zeros(m0.shape, np.float32); d[y0:y1, x0:x1] = depth(np.ascontiguousarray(rgb[y0:y1, x0:x1]))
    L0 = np.linalg.norm(np.subtract(axe[1], axe[0]))
    m = clean(m0, 0.05 * L0)
    L, rows = along(m, d, axe)
    BL, P, prof = pieces(L, rows, 3)
    rec = {'_doc': 'forme.py rendu: the same measures on a render', 'rendu': os.path.basename(png), 'longueur_px': round(float(BL), 1), 'pieces': P, 'profil': prof}
    json.dump(rec, open(os.path.join(OUT, 'rendu-' + nom + '.json'), 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    ref = os.path.dirname(os.path.abspath(png))
    control(rgb, m, d, axe, os.path.join(ref, 'forme-' + nom + '.jpg'))
    print('rendu', nom, json.dumps(P, ensure_ascii=False))


def cmd_table(cad, rendus):
    C = json.load(open(cad, encoding='utf-8'))
    views = {}
    for nom, c in C.items():
        if nom.startswith('_'): continue
        p = os.path.join(OUT, nom + '.json')
        if os.path.exists(p): views.setdefault(c['vue'], []).append(json.load(open(p, encoding='utf-8')))
    names = ['abdomen', 'thorax', 'tete']
    res = {}
    for v, F in views.items():
        print('vue', v, ':', ', '.join(f['photo'] for f in F))
        for j, nm in enumerate(names):
            for key in ('longueur', 'largeur', 'large_a', 'relief'):
                vals = [f['pieces'][j][key] for f in F if f['pieces'][j].get(key) is not None]
                if not vals: continue
                lo, hi = min(vals), max(vals); pad = 0.25 * max(abs(hi - lo), 0.1 * abs(hi + lo) / 2)
                res[f'{v}/{nm}/{key}'] = [lo - pad, hi + pad]
                print('  %-8s %-9s photos %s  plage %.3f..%.3f' % (nm, key, ' '.join('%.3f' % x for x in vals), lo - pad, hi + pad))
    for r in rendus:
        R = json.load(open(os.path.join(OUT, r + '.json'), encoding='utf-8')); v = R.get('vue') or r.split('-')[1]
        ko = []
        for j, nm in enumerate(names):
            for key in ('longueur', 'largeur', 'large_a', 'relief'):
                k = f'{v}/{nm}/{key}'
                if k in res and R['pieces'][j].get(key) is not None:
                    x = R['pieces'][j][key]
                    if not res[k][0] <= x <= res[k][1]: ko.append('%s %s %.3f hors %.3f..%.3f' % (nm, key, x, *res[k]))
        print(r, 'ok' if not ko else 'ko : ' + '; '.join(ko))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'photo': cmd_photo(a[1], a[2])
    elif a[0] == 'rendu':
        axe = [list(map(float, p.split(','))) for p in a[a.index('--axe') + 1].split(';')]
        cmd_rendu(a[1], a[2], axe, a[a.index('--bg') + 1] if '--bg' in a else '#efe9df', '--depth' in a)
    elif a[0] == 'table': cmd_table(a[1], a[2:])
