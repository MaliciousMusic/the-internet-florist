# coeur_mesure.py: numbers that say how a full double flower reads, taken the same way on a photo and on a render (BONNES-PRATIQUES §16.10).
#   python fleur/pivoine/coeur_mesure.py photo <img> <cx,cy,r> [--out base]     the flower cut out by GrabCut from a circle around it
#   python fleur/pivoine/coeur_mesure.py rendu <png> [--out base]                the flower is whatever differs from the render's ground
#   python fleur/pivoine/coeur_mesure.py table <a.json> <b.json> ...             side by side, the photo columns first
# The flower is brought to a radius of 256 px, its lightness L* divided by its lit level (95th centile), so photos of other exposures and
# colours compare. Measures (r is the distance to the centre in flower radii):
#   dark55, dark75   share of the flower darker than 0.55 / 0.75 of the lit level (deep hollows, shade)
#   hollow           share darker than 0.6 of the brightest rim within 12 px: the hollows between petals, not the shaded side
#   edge             length of the edges (Canny on L/Lref) per unit of area, in 1/R: how busy the flower is
#   ridge            share of thin bright lines (a pixel brighter than its 5 px surround by 0.08 Lref): the lit rims of the petals
#   patch            mean distance to the nearest edge, in R: the size of the smooth stretches
#   conc             share of the edge strength whose gradient is radial (edges that run around the centre), 0.5 = no order
#   ray              edges crossed along a ray from r .08 to .92, median over 72 rays: the visible layers
#   ring3/5/7/9      edges crossed around the circle r = .3 .5 .7 .9: visible petals in that ring
#   prof             median L/Lref in 10 bins of r, and dark55 in the same bins
#   round, lobes     the outline: std/mean of r(theta), and the number of its bumps
import sys, json, argparse
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
N = 256


def lstar(bgr):
    c = bgr[..., ::-1].astype(float) / 255.; c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    y = c @ [.2126, .7152, .0722]
    return np.where(y > .008856, 116 * np.cbrt(y) - 16, 903.3 * y)


def cut_photo(img, cx, cy, r):
    h, w = img.shape[:2]; m = 1.12
    x0, y0, x1, y1 = int(max(0, cx - m * r)), int(max(0, cy - m * r)), int(min(w, cx + m * r)), int(min(h, cy + m * r))
    a = img[y0:y1, x0:x1].copy(); s = 600 / max(a.shape[:2]); a = cv2.resize(a, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    ccx, ccy, rr = (cx - x0) * s, (cy - y0) * s, r * s
    yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]; d = np.hypot(xx - ccx, yy - ccy) / rr
    mk = np.full(a.shape[:2], cv2.GC_PR_BGD, np.uint8); mk[d < .85] = cv2.GC_PR_FGD; mk[d < .3] = cv2.GC_FGD; mk[d > 1.08] = cv2.GC_BGD
    bg = np.zeros((1, 65)); fg = np.zeros((1, 65)); cv2.grabCut(a, mk, None, bg, fg, 6, cv2.GC_INIT_WITH_MASK)
    keep = ((mk == cv2.GC_FGD) | (mk == cv2.GC_PR_FGD)).astype(np.uint8)
    n, lb = cv2.connectedComponents(keep); keep = (lb == lb[int(ccy), int(ccx)]) & (keep > 0)
    keep = cv2.morphologyEx(keep.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    return a, keep > 0


def cut_render(img):
    bg = img[2, 2].astype(int); m = np.abs(img.astype(int) - bg).sum(-1) > 24
    n, lb, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8)); k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    return img, lb == k


def normalise(a, m):
    ys, xs = np.nonzero(m); cy, cx = ys.mean(), xs.mean(); R = np.sqrt(m.sum() / np.pi)
    s = N / R; M = np.float32([[s, 0, N * 1.1 - s * cx], [0, s, N * 1.1 - s * cy]]); W = int(N * 2.2)
    a2 = cv2.warpAffine(a, M, (W, W), flags=cv2.INTER_AREA, borderValue=(0, 0, 0))
    m2 = cv2.warpAffine(m.astype(np.uint8) * 255, M, (W, W), flags=cv2.INTER_LINEAR) > 127
    return a2, m2, (W / 2, W / 2)


def measure(a, m, c):
    L = lstar(a); Lref = np.percentile(L[m], 95); l = np.clip(L / Lref, 0, 1.3)
    W = a.shape[0]; yy, xx = np.mgrid[:W, :W]; dx, dy = xx - c[0], yy - c[1]; r = np.hypot(dx, dy) / N; th = np.arctan2(dy, dx)
    inner = m & (cv2.erode(m.astype(np.uint8), np.ones((7, 7), np.uint8)) > 0)  # off the outline, whose edge is the ground's
    out = {'Lref': round(float(Lref), 1)}
    out['dark55'] = float((l[m] < .55).mean()); out['dark75'] = float((l[m] < .75).mean())
    lm = np.where(m, l, 0); top = cv2.dilate(cv2.GaussianBlur(lm, (0, 0), 2), np.ones((25, 25), np.uint8))  # the lit rims around a pixel
    hol = inner & (l < .6 * top); out['hollow'] = float(hol.sum() / inner.sum())
    g = cv2.GaussianBlur(l, (0, 0), 1.2); e = cv2.Canny(np.uint8(np.clip(g * 200, 0, 255)), 18, 42) > 0; e &= inner
    out['edge'] = float(e.sum() / inner.sum() * N)
    sur = cv2.GaussianBlur(l, (0, 0), 5); rid = (g - sur > .08) & inner; out['ridge'] = float(rid.mean() / max(inner.mean(), 1e-9))
    dt = cv2.distanceTransform((~e).astype(np.uint8), cv2.DIST_L2, 3); out['patch'] = float(dt[inner].mean() / N)
    gx = cv2.Sobel(g, cv2.CV_64F, 1, 0, ksize=3); gy = cv2.Sobel(g, cv2.CV_64F, 0, 1, ksize=3); gm = np.hypot(gx, gy)
    cosr = np.abs(gx * dx + gy * dy) / (gm * np.maximum(np.hypot(dx, dy), 1) + 1e-9); sel = inner & (gm > .05)
    out['conc'] = float((gm[sel] * (cosr[sel] > .7071)).sum() / gm[sel].sum()) if sel.any() else -1
    def crossings(pts):
        v = [bool(e[int(y), int(x)]) if 0 <= int(y) < W and 0 <= int(x) < W else False for x, y in pts]
        return sum(1 for i in range(1, len(v)) if v[i] and not v[i - 1])
    rays = []
    for t in np.linspace(0, 2 * np.pi, 72, endpoint=False):
        ok = [rr for rr in np.linspace(.08, .92, 220) if m[int(c[1] + rr * N * np.sin(t)), int(c[0] + rr * N * np.cos(t))]]
        rays.append(crossings([(c[0] + rr * N * np.cos(t), c[1] + rr * N * np.sin(t)) for rr in ok]))
    out['ray'] = float(np.median(rays)); out['ray_q'] = [float(np.percentile(rays, 25)), float(np.percentile(rays, 75))]
    for rr in (.3, .5, .7, .9):
        ts = np.linspace(0, 2 * np.pi, int(2 * np.pi * rr * N * 1.5), endpoint=False)
        out['ring%d' % int(rr * 10)] = crossings([(c[0] + rr * N * np.cos(t), c[1] + rr * N * np.sin(t)) for t in ts])
    bins = np.linspace(0, 1.1, 11); pl, pd = [], []
    for i in range(10):
        s = m & (r >= bins[i]) & (r < bins[i + 1])
        pl.append(round(float(np.median(l[s])), 2) if s.sum() > 30 else None); pd.append(round(float((l[s] < .55).mean()), 2) if s.sum() > 30 else None)
    out['prof'] = pl; out['prof_dark'] = pd
    rt = []
    for t in np.linspace(-np.pi, np.pi, 180, endpoint=False):
        s = m & (np.abs(np.angle(np.exp(1j * (th - t)))) < np.pi / 180); rt.append(float(r[s].max()) if s.any() else 0)
    rt = np.array(rt); out['round'] = float(rt.std() / rt.mean())
    sm = np.convolve(np.r_[rt[-4:], rt, rt[:4]], np.ones(5) / 5, 'same')[4:-4]
    out['lobes'] = int(sum(1 for i in range(180) if sm[i] > sm[i - 1] and sm[i] >= sm[(i + 1) % 180] and sm[i] > np.median(sm)))
    return out, l, e, rid


def diag(a, m, l, e, rid, path):
    W = a.shape[0]; v = np.zeros((W, W * 3, 3), np.uint8)
    v[:, :W] = np.where(m[..., None], a, 255)
    d = np.full((W, W, 3), 255, np.uint8); d[m] = 200; d[m & (l < .75)] = (150, 150, 150); d[m & (l < .55)] = (0, 0, 0); v[:, W:2 * W] = d
    z = np.full((W, W, 3), 255, np.uint8); z[m] = 235; z[e] = (0, 0, 200); z[rid] = (0, 160, 0); v[:, 2 * W:] = z
    cv2.imwrite(path, v, [cv2.IMWRITE_JPEG_QUALITY, 85])


K = ['dark55', 'dark75', 'hollow', 'edge', 'ridge', 'patch', 'conc', 'ray', 'ring3', 'ring5', 'ring7', 'ring9', 'round', 'lobes']
if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('mode'); ap.add_argument('args', nargs='+'); ap.add_argument('--out'); ap.add_argument('--nom')
    o = ap.parse_args()
    if o.mode == 'table':
        rows = [json.load(open(p, encoding='utf-8')) for p in o.args]
        print('| mesure | ' + ' | '.join(x.get('nom', '?')[:18] for x in rows) + ' |'); print('|---' * (len(rows) + 1) + '|')
        for k in K: print('| %s | ' % k + ' | '.join(('%.3f' % x[k]) if isinstance(x[k], float) else str(x[k]) for x in rows) + ' |')
        for k in ('prof', 'prof_dark'): print('| %s | ' % k + ' | '.join(' '.join('-' if v is None else '%.2f' % v for v in x[k][:9]) for x in rows) + ' |')
        sys.exit()
    img = cv2.imread(o.args[0])
    if o.mode == 'photo': a, m = cut_photo(img, *map(float, o.args[1].split(',')))
    else: a, m = cut_render(img)
    a, m, c = normalise(a, m); res, l, e, rid = measure(a, m, c); res['nom'] = o.nom or o.args[0].replace('\\', '/').split('/')[-1]
    base = o.out or o.args[0].rsplit('.', 1)[0] + '-cm'
    json.dump(res, open(base + '.json', 'w', encoding='utf-8'), indent=1); diag(a, m, l, e, rid, base + '.jpg')
    print(json.dumps({k: (round(v, 3) if isinstance(v, float) else v) for k, v in res.items() if k in K}))
