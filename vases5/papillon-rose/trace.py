# Measurements of the reference (private photograph out/ref.jpg, 736 x 981): only numbers leave, into traces.json.
#   python trace.py   -> traces.json, work/trace_*.png (diagnostics, private)
# What is measured, in photograph pixels: the silhouette row by row (sub-pixel), the opening of the slit (the dark inside),
# the two crosiers (medial axis and half width of the silhouette above the funnel), the top edge of the back wall, the
# butterfly (outline of each wing, the white cells of the net as fitted ellipses, the body, the tails).
import sys, os, json, math
import numpy as np, cv2
from skimage.morphology import skeletonize
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import mesure as M  # noqa: E402

im, _ = M.read(os.path.join(HERE, 'out', 'ref.jpg'))
mask = cv2.imread(os.path.join(HERE, 'out', 'mask_ref.png'), 0) > 127
H, W = mask.shape
lab = M.to_lab(cv2.GaussianBlur(im, (0, 0), .8))
L, A, Bb = lab[..., 0], lab[..., 1], lab[..., 2]
out = {}


def contour(m, simplify=.6):
    cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)[:, 0, :].astype(float)
    c = cv2.approxPolyDP(c.astype(np.float32).reshape(-1, 1, 2), simplify, True)[:, 0, :]
    return [[round(float(x), 1), round(float(y), 1)] for x, y in c]


# ---------------------------------------------------------------- silhouette rows (sub-pixel: crossings of the blurred mask)
mb = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), .7)
rows = []
for y in range(40, H):
    r = mb[y]
    idx = np.nonzero(r > .5)[0]
    if idx.size < 2:
        continue
    i0, i1 = idx[0], idx[-1]
    xl = i0 - (r[i0] - .5) / max(r[i0] - r[i0 - 1], 1e-3)
    xr = i1 + (r[i1] - .5) / max(r[i1] - r[i1 + 1], 1e-3)
    rows.append([y, round(float(xl), 2), round(float(xr), 2)])
out['rows'] = rows

# ---------------------------------------------------------------- the inside seen through the slit
inside = mask & (L < 56) & (A < 10)
inside = cv2.morphologyEx(inside.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, lb, st, _ = cv2.connectedComponentsWithStats(inside)
inside = lb == lb[600, 380]
inside = cv2.morphologyEx(inside.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8)).astype(bool)
irows = []
for y in range(150, H):
    idx = np.nonzero(inside[y])[0]
    if idx.size:
        irows.append([y, int(idx[0]), int(idx[-1])])
out['inside_rows'] = irows
out['inside_outline'] = contour(inside)

# ---------------------------------------------------------------- the crosiers: medial axis of the silhouette above the funnel
dt = cv2.distanceTransform(mask.astype(np.uint8), cv2.DIST_L2, 5)
cros = {}
for side, (x0, x1, y1) in (('left', (190, 352, 200)), ('right', (452, 540, 240))):
    sub = np.zeros_like(mask)
    sub[30:y1, x0:x1] = mask[30:y1, x0:x1]
    sk = skeletonize(sub)
    ys, xs = np.nonzero(sk)
    pts = [[int(x), int(y), round(float(dt[y, x]), 2)] for x, y in zip(xs, ys)]
    cros[side] = pts
out['crosier_skeleton'] = cros

# ---------------------------------------------------------------- top edge of the back wall (upper silhouette between the crosiers)
top = []
for x in range(296, 480, 2):
    idx = np.nonzero(mask[60:260, x])[0]
    if idx.size:
        top.append([x, int(idx[0] + 60)])
out['top_edge'] = top

# ---------------------------------------------------------------- the butterfly
# painted (not cream) glaze below the neck: a* above the cream's, lighter than the inside
paint = mask & (A > 1.8) & ~inside & (L > 40)
yy, xx = np.mgrid[0:H, 0:W]
paint &= (yy > 470) & (yy < 905)
paint = cv2.morphologyEx(paint.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)).astype(bool)
# the white cells of the net are part of the wing: fill the holes of each wing
def fill_holes(m):
    ff = m.astype(np.uint8).copy()
    cs, _ = cv2.findContours(ff, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    o = np.zeros_like(ff); cv2.drawContours(o, cs, -1, 1, -1)
    return o.astype(bool)
paint = fill_holes(paint)
cv2.imwrite(os.path.join(HERE, 'work', 'trace_paint.png'), (paint * 255).astype(np.uint8))
# the white cells: bright blobs above their surroundings, inside the upper wings
Lb = cv2.GaussianBlur(L, (0, 0), 6)
cellm = paint & (L - Lb > 3.5) & (L > 70) & (A < 9) & (yy < 690)
# not the white highlight running along the lips' rims (long and thin)
cellm = cv2.morphologyEx(cellm.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
n, lb, st, cen = cv2.connectedComponentsWithStats(cellm)
cells = []
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] < 10:
        continue
    cs, _ = cv2.findContours((lb == i).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    if len(c) >= 5:
        (cx, cy), (a, b), ang = cv2.fitEllipse(c)
        if max(a, b) > 5 * min(a, b) or max(a, b) > 46:
            continue
        cells.append([round(cx, 1), round(cy, 1), round(a, 1), round(b, 1), round(ang, 1)])
out['cells'] = cells
out['paint_outline'] = []
cs, _ = cv2.findContours(paint.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
for c in sorted(cs, key=cv2.contourArea, reverse=True)[:4]:
    if cv2.contourArea(c) > 200:
        c2 = cv2.approxPolyDP(c, .8, True)[:, 0, :]
        out['paint_outline'].append([[int(x), int(y)] for x, y in c2])
# paint zones of the butterfly (outlines in photograph px): mauve (the net's ground, the borders, the body), orange
def zone_outlines(m, amin=12, eps=.7):
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    cs, hier = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    res = []
    for i, c in enumerate(cs):
        if abs(cv2.contourArea(c)) < amin:
            continue
        c2 = cv2.approxPolyDP(c, eps, True)[:, 0, :]
        if len(c2) >= 3:
            res.append([int(hier[0][i][3] >= 0)] + [v for p in c2 for v in (int(p[0]), int(p[1]))])
    return res


pz = paint & ~inside
mauve = pz & (A > 3.0) & (Bb < 15.5) & (L < 80)
orange = pz & (Bb >= 15.5) & (A > 4.0)
out['zone_mauve'] = zone_outlines(mauve)
out['zone_orange'] = zone_outlines(orange)
# veins: thin dark lines on the wings (black top-hat of the lightness), as skeleton pixels
th = cv2.morphologyEx(L.astype(np.float32), cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
vm = pz & (th > 5.5) & (yy > 560)
vm = cv2.morphologyEx(vm.astype(np.uint8), cv2.MORPH_OPEN, np.ones((1, 2), np.uint8)).astype(bool)
sk = skeletonize(vm)
n, lb, st, _ = cv2.connectedComponentsWithStats(sk.astype(np.uint8), connectivity=8)
vk = np.zeros_like(sk)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] >= 8:
        vk |= lb == i
vy, vx = np.nonzero(vk)
out['veins'] = [int(v) for p in zip(vx, vy) for v in p]
# the lips' mauve band on the neck: how far it reaches past the inside, row by row (outer side of each lip)
rim = mask & ~inside & (A > 3.0) & (L < 82) & (Bb < 16)
rr = []
for y in range(250, 500, 2):
    idx = np.nonzero(inside[y])[0]
    if not idx.size:
        continue
    l = np.nonzero(rim[y, :idx[0]])[0]; r = np.nonzero(rim[y, idx[-1]:])[0]
    rr.append([y, int(l[0]) if l.size else -1, int(idx[-1] + r[-1]) if r.size else -1])
out['rim_rows'] = rr
json.dump(out, open(os.path.join(HERE, 'traces.json'), 'w'), separators=(',', ':'))
cv2.imwrite(os.path.join(HERE, 'work', 'trace_zones.png'), np.dstack([vk * 255, orange * 200, mauve * 255]).astype(np.uint8))

# diagnostics
ov = im.copy()
ov[inside] = (ov[inside] * .5 + np.array([255, 0, 0]) * .5).astype(np.uint8)
for c in out['paint_outline']:
    cv2.polylines(ov, [np.array(c, np.int32)], True, (0, 255, 0), 1)
for cx, cy, a, b, ang in cells:
    cv2.ellipse(ov, ((cx, cy), (a, b), ang), (0, 0, 255), 1)
for side in cros:
    for x, y, r in cros[side]:
        ov[y, x] = (255, 0, 255)
cv2.imwrite(os.path.join(HERE, 'work', 'trace_ov.png'), ov)
print('rows', len(rows), 'inside', inside.sum(), 'cells', len(cells), 'paint parts', len(out['paint_outline']),
      'crosiers', {k: len(v) for k, v in cros.items()})
