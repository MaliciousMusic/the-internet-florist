"""forme.py: the shape map of an ant (PROTOCOLE §2), on a photo (Segment Anything for the body, Depth Anything for its relief) and on a
render alike, read along the body's axis so that photo and render compare by numbers. Models from fleur/carte.py, in vases5/.venv-depth;
one heavy task at a time: GATE_MAX=1 sh ws/gate.sh <this command>.

  python forme.py photo <img> <x0,y0,x1,y1> <"x,y;x,y;..." points on the body> <"x,y;x,y" axis: front -> rear> --out <dir> [--vue v]
  python forme.py rendu <png> <"x,y;x,y" axis> --out <dir> [--vue v]        (the render's flat ground is the mask, no model)
  python forme.py table <dir>... [--ref k]   the first k maps are photos: every other column gets a verdict per measure (inside the
                                             photos' range widened by 25 %, PROTOCOLE §2.2)

The axis runs from the front of the ant (the mandibles' tip in profile and from above, the vertex of the head from the front) to its
rear (the gaster's tip, or the mandibles' tip from the front); L is its length. The legs and antennae are opened away (a disc of 2.5 % of
L), so the measures describe the trunk. Measures (forme.json), lengths in L:
  h[48]      the trunk's extent across the axis at 48 stations (height in profile, width from above or from the front)
  cuts       the constrictions (local minima of h, the neck, the waist's nodes): their station and depth
  peaks      the head, the mesosoma, the nodes and the gaster: station and extent of each maximum
  relief[48] the depth's range across the trunk at each station over its extent (Depth Anything, relative: from above, the section's
             rz / ry; read with care)
  dark       share of the trunk under 0.55 of its lit level (L* 95th centile), lit (over 0.9)
Files: forme.json, forme.jpg (cut-out | opened trunk with the stations | depth), mask.png. Photo pixels stay in refcache/."""
import sys, os, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'fleur'))
NS = 48


def pts_of(s):
    return [tuple(float(v) for v in p.split(',')) for p in s.split(';')]


def lstar(rgb):
    c = rgb.astype(float) / 255.; c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    y = c @ [.2126, .7152, .0722]
    return np.where(y > .008856, 116 * np.cbrt(y) - 16, 903.3 * y)


def trunk(mask, L):
    r = max(1, int(round(0.025 * L)))
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    t = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_OPEN, k)
    n, lb, st, _ = cv2.connectedComponentsWithStats(t)
    if n <= 1: return t > 0
    # the trunk: every piece at least 3 % of the largest (the gaster can part from the mesosoma at the opened waist)
    big = st[1:, cv2.CC_STAT_AREA].max()
    keep = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.03 * big]
    return np.isin(lb, keep)


def measure(rgb, mask, axis, depth=None):
    A, B = np.array(axis[0]), np.array(axis[-1])
    L = float(np.linalg.norm(B - A)); u = (B - A) / L; nrm = np.array([-u[1], u[0]])
    T = trunk(mask, L)
    ys, xs = np.nonzero(T)
    P = np.stack([xs, ys], 1).astype(float) - A
    s = P @ u / L; q = P @ nrm / L
    h, rel = [], []
    for i in range(NS):
        sel = (s >= i / NS) & (s < (i + 1) / NS)
        if sel.sum() < 3: h.append(0.0); rel.append(0.0); continue
        h.append(float(np.percentile(q[sel], 98) - np.percentile(q[sel], 2)))
        if depth is not None:
            d = depth[ys[sel], xs[sel]]
            rel.append(float((np.percentile(d, 95) - np.percentile(d, 5))))
        else: rel.append(0.0)
    h = np.array(h)
    hs = np.convolve(np.pad(h, 1, mode='edge'), [1 / 3, 1 / 3, 1 / 3], 'valid')
    cuts, peaks = [], []
    for i in range(1, NS - 1):
        if hs[i] < hs[i - 1] and hs[i] <= hs[i + 1] and hs[i] > 0: cuts.append({'t': round((i + .5) / NS, 3), 'h': round(float(hs[i]), 4)})
        if hs[i] > hs[i - 1] and hs[i] >= hs[i + 1]: peaks.append({'t': round((i + .5) / NS, 3), 'h': round(float(hs[i]), 4)})
    Ls = lstar(rgb)[T]; ref = np.percentile(Ls, 95); l = Ls / max(ref, 1)
    if depth is not None:
        dr = np.array(rel); mx = max(1e-6, dr.max()); rel = list(dr / mx)
    return T, {'L_px': round(L, 1), 'h': [round(float(v), 4) for v in h], 'cuts': cuts, 'peaks': peaks,
               'relief': [round(float(v), 3) for v in rel], 'dark': round(float((l < .55).mean()), 3), 'lit': round(float((l > .9).mean()), 3)}


def panel(rgb, mask, T, axis, depth, path):
    H = 420
    def fit(a):
        return cv2.resize(a, (int(a.shape[1] * H / a.shape[0]), H), interpolation=cv2.INTER_AREA)
    cut = rgb.copy(); cut[~mask] = (cut[~mask] * 0.25 + 180).astype(np.uint8)
    tr = np.full_like(rgb, 235); tr[T] = (60, 40, 30)
    A, B = np.array(axis[0]), np.array(axis[-1])
    for i in range(NS + 1):
        p = A + (B - A) * i / NS
        cv2.circle(tr, (int(p[0]), int(p[1])), max(2, int(rgb.shape[1] / 300)), (220, 60, 40), -1)
    ims = [fit(cut), fit(tr)]
    if depth is not None:
        d = depth.copy(); d = (d - d[mask].min()) / max(1e-6, d[mask].max() - d[mask].min()); d = np.clip(d, 0, 1)
        dm = cv2.applyColorMap((d * 255).astype(np.uint8), cv2.COLORMAP_VIRIDIS)[..., ::-1].copy(); dm[~mask] = 235
        ims.append(fit(dm))
    out = np.concatenate([np.concatenate([a, np.full((H, 8, 3), 239, np.uint8)], 1) for a in ims], 1)
    cv2.imwrite(path, out[..., ::-1])


def photo(o):
    from carte import sam_box, depth_of
    bgr = cv2.imread(o.img); rgb = bgr[..., ::-1].copy()
    x0, y0, x1, y1 = [int(v) for v in o.box.split(',')]
    pos = pts_of(o.points); axis = pts_of(o.axis)
    m = sam_box(rgb, [x0, y0, x1, y1], [list(p) for p in pos])
    m[:y0] = False; m[y1:] = False; m[:, :x0] = False; m[:, x1:] = False
    d = depth_of(rgb[y0:y1, x0:x1]); depth = np.zeros(m.shape, np.float32); depth[y0:y1, x0:x1] = d
    write(o, rgb, m, axis, depth, {'photo': os.path.basename(o.img), 'box': [x0, y0, x1, y1]})


def rendu(o):
    bgr = cv2.imread(o.img); rgb = bgr[..., ::-1].copy()
    bg = np.median(np.concatenate([rgb[:4, :4].reshape(-1, 3), rgb[:4, -4:].reshape(-1, 3), rgb[-4:, :4].reshape(-1, 3)]), 0)
    m = np.abs(rgb.astype(int) - bg).sum(-1) > 24
    write(o, rgb, m, pts_of(o.axis), None, {'rendu': os.path.basename(o.img)})


def write(o, rgb, m, axis, depth, info):
    os.makedirs(o.out, exist_ok=True)
    T, M = measure(rgb, m, axis, depth)
    M.update(info); M['vue'] = o.vue; M['axe'] = axis
    json.dump(M, open(os.path.join(o.out, 'forme.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    cv2.imwrite(os.path.join(o.out, 'mask.png'), (m * 255).astype(np.uint8))
    panel(rgb, m, T, axis, depth, os.path.join(o.out, 'forme.jpg'))
    print(o.out, 'L %.0f px' % M['L_px'], 'creux', [(c['t'], c['h']) for c in M['cuts']][:6])


def table(dirs, k):
    F = [json.load(open(os.path.join(d, 'forme.json'), encoding='utf-8')) for d in dirs]
    names = [os.path.basename(os.path.normpath(d)) for d in dirs]
    rows = []
    # the trunk's extent at 12 stations (every fourth of the 48) and the summary measures
    for j in range(2, NS, 4): rows.append(('h@%.2f' % ((j + .5) / NS), [f['h'][j] for f in F]))
    rows += [('dark', [f['dark'] for f in F]), ('lit', [f['lit'] for f in F])]
    print('%-10s' % '', ' '.join('%10s' % n[:10] for n in names))
    nok = 0
    for name, vals in rows:
        ref = vals[:k]; lo, hi = min(ref), max(ref); w = (hi - lo) * 0.25 + 0.1 * max(abs(hi), 1e-3) * 0.25
        cells = []
        for i, v in enumerate(vals):
            mark = '' if i < k else (' ok' if lo - w <= v <= hi + w else ' KO')
            nok += mark == ' KO'
            cells.append('%7.3f%s' % (v, mark))
        print('%-10s' % name, ' '.join('%10s' % c for c in cells))
    print('hors plage :', nok)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); s = ap.add_subparsers(dest='cmd')
    p = s.add_parser('photo'); p.add_argument('img'); p.add_argument('box'); p.add_argument('points'); p.add_argument('axis')
    p.add_argument('--out', required=True); p.add_argument('--vue', default='profil')
    r = s.add_parser('rendu'); r.add_argument('img'); r.add_argument('axis'); r.add_argument('--out', required=True); r.add_argument('--vue', default='profil')
    t = s.add_parser('table'); t.add_argument('dirs', nargs='+'); t.add_argument('--ref', type=int, default=2)
    o = ap.parse_args()
    if o.cmd == 'photo': photo(o)
    elif o.cmd == 'rendu': rendu(o)
    else: table(o.dirs, o.ref)
