# Measures the decor of the reference (vases5/ginkgo, ref. 114) for an exact copy (owner's decision, 2026-10-16): the glazed
# leaves isolated from the stoneware by their colour (CIELAB), the raised beads of their outlines traced as ridge lines, and
# the relief of the glaze read on the depth map (Depth Anything V2) once calibrated on the turned body of the model.
# Everything is written as derived maps into out/decor_maps.npz (private, next to the photograph); the photograph never
# leaves out/.   python trace.py
import sys, os, math, json
import numpy as np, cv2
from skimage.filters import sato
from skimage.morphology import skeletonize
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
ARGS = sys.argv[1:]
sys.argv = ['mk.py', 'x']
sys.path.insert(0, HERE)
import mk  # noqa: E402

F_RP = float(ARGS[0]) if ARGS else 80          # percentile of the ridge filter kept as beads
UP = 2                                    # the maps are traced at twice the photograph's resolution
im = cv2.imread('out/ref.jpg')
H0, W0 = im.shape[:2]
imu = cv2.resize(im, (W0 * UP, H0 * UP), interpolation=cv2.INTER_CUBIC)
lab = cv2.cvtColor(imu, cv2.COLOR_BGR2LAB).astype(np.float32)
L, b = lab[..., 0] * 100 / 255, lab[..., 2] - 128

# ---------------------------------------------------------------- the body of the model in the photograph's camera
cam = mk.Cam('photo'); cam.P = UP; cam.W, cam.H = W0 * UP, H0 * UP
phi, h, hit, _ = cam.inverse()
sil = hit & (h < mk.H_CM - .02)

# ---------------------------------------------------------------- glaze: yellow, or light (highlights, pale beads)
Ls, bs = cv2.GaussianBlur(L, (0, 0), 1.0), cv2.GaussianBlur(b, (0, 0), 1.0)
g = sil & ((bs > 17) | (Ls > 63))
g = cv2.morphologyEx(g.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
g = cv2.morphologyEx(g, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
n, lb, st, _ = cv2.connectedComponentsWithStats(g)
keep = np.zeros_like(g)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] > 120:
        keep[lb == i] = 1
inv = (1 - keep).astype(np.uint8)
n, lb, st, _ = cv2.connectedComponentsWithStats(inv)
for i in range(1, n):                      # small holes are highlights or specks: fill them
    if st[i, cv2.CC_STAT_AREA] < 60:
        keep[lb == i] = 1
glaze = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.2)

# ---------------------------------------------------------------- the beads: bright thin ridges inside the glaze
rid = sato(L, sigmas=[1.5, 2.5], black_ridges=False)
inner = cv2.erode(keep, np.ones((7, 7), np.uint8)) > 0
# pale cream crests, not the white glints of the highlights
rm = (rid > np.percentile(rid[inner], F_RP)) & inner & (Ls < 86) & (bs > 9) & ((Ls - cv2.GaussianBlur(Ls, (0, 0), 4)) > 1.0)
rm = cv2.morphologyEx(rm.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
sk = skeletonize(rm > 0)
n, lb, st, _ = cv2.connectedComponentsWithStats(sk.astype(np.uint8), connectivity=8)
ridge = np.zeros_like(sk)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] > 18:
        ridge |= lb == i

# ---------------------------------------------------------------- relief of the glaze from the depth map
d = np.load('out/depth.npy')
d = cv2.resize(d, (W0 * UP, H0 * UP), interpolation=cv2.INTER_CUBIC)
z = mk.rad(h) * np.cos(phi)                # depth of the turned body towards the camera (cm)
stone = sil & (keep == 0) & (np.arange(H0 * UP)[:, None] < 640 * UP)
yy = np.broadcast_to(np.arange(H0 * UP)[:, None] / UP, d.shape)
A = np.c_[z[stone], np.ones(stone.sum()), yy[stone], yy[stone] ** 2]
coef, *_ = np.linalg.lstsq(A, d[stone], rcond=None)
fit = coef[0] * z + coef[1] + coef[2] * yy + coef[3] * yy ** 2
relief = (d - fit) / coef[0]               # cm above the turned surface
relief = np.where(sil, relief, 0).astype(np.float32)
res_stone = relief[stone]
print('depth fit: %.3f per cm, stone residual sd %.3f cm, glaze relief p50 %.3f p90 %.3f cm' % (
    coef[0], res_stone.std(), np.percentile(relief[keep > 0], 50), np.percentile(relief[keep > 0], 90)))

# ---------------------------------------------------------------- the beads as polylines on the surface (phi, h)
def trace_lines(sk):
    """walks the skeleton into polylines, breaking at junctions"""
    ys, xs = np.nonzero(sk)
    pts = set(zip(ys.tolist(), xs.tolist()))
    nb = lambda p: [(p[0] + dy, p[1] + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy or dx) and (p[0] + dy, p[1] + dx) in pts]
    deg = {p: len(nb(p)) for p in pts}
    seen, lines = set(), []
    starts = [p for p in pts if deg[p] == 1] + [p for p in pts if deg[p] != 1]
    for s0 in starts:
        if s0 in seen:
            continue
        line, p = [s0], s0
        seen.add(s0)
        while True:
            nx = [q for q in nb(p) if q not in seen]
            if not nx:
                break
            p = nx[0]; seen.add(p); line.append(p)
            if deg[p] > 2:
                break
        if len(line) >= 10:
            lines.append(np.array(line, float))
    return lines


lines = []
for ln in trace_lines(ridge):
    ln = ln[::2]
    ii, jj = ln[:, 0].astype(int), ln[:, 1].astype(int)
    lines.append(np.c_[phi[ii, jj], h[ii, jj]])
flat = np.vstack([np.r_[[[np.nan, np.nan]], l] for l in lines]) if lines else np.zeros((0, 2))
print('bead lines %d' % len(lines))
# ---------------------------------------------------------------- glaze thickness: its local lightness (the beads run thin and
# pale, the glaze pools darker inside them and in the veins), the photograph's broad lighting and its glints removed
hp = Ls - cv2.GaussianBlur(Ls, (0, 0), 5 * UP)
glint = (Ls > 86) & (bs < 22)
glint = cv2.dilate(glint.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
tk = np.where((keep > 0) & ~glint, np.clip(hp, -15, 15), 0).astype(np.float32)
tk = cv2.GaussianBlur(tk, (0, 0), .8)

# ---------------------------------------------------------------- glaze luminance (linear), glints filled in from around them:
# with the model's own prediction it gives the tilt of each leaf (shape from shading, in mk.py)
lin = lambda c: np.where(c / 255 <= .04045, c / 255 / 12.92, ((c / 255 + .055) / 1.055) ** 2.4)
Yl = lin(imu[..., ::-1].astype(np.float32)) @ np.array([.2126, .7152, .0722], np.float32)
ok = ((keep > 0) & ~glint).astype(np.float32)
s_ = 2.5 * UP
yref = cv2.GaussianBlur(Yl * ok, (0, 0), s_) / np.maximum(cv2.GaussianBlur(ok, (0, 0), s_), 1e-3)

# ---------------------------------------------------------------- the top of the rim seen from above: glaze draped over it
# (normalised ellipse coordinates u = (x - xc) / (R k), v = (y - yc) / (R k ry), R the outer radius of the lip roll)
Rt = mk.R_TOP + mk.LIPR
yc = cam.y0 - mk.H_CM * cam.k
uu, vv = np.meshgrid(np.linspace(-1, 1, 241), np.linspace(-1, 1, 121))
xs_ = (cam.x0(yc) + uu * Rt * cam.k) * UP; ys_ = (yc + vv * Rt * cam.k * cam.ry) * UP
gt = ((bs > 17) | (Ls > 63)).astype(np.float32)
top = cv2.remap(gt, xs_.astype(np.float32), ys_.astype(np.float32), cv2.INTER_LINEAR)
top = cv2.GaussianBlur(top, (0, 0), 1.5) * (uu ** 2 + vv ** 2 <= 1)
np.savez_compressed('out/decor_maps.npz', yref=yref.astype(np.float16), tk=tk.astype(np.float16), top=top.astype(np.float16), lines=flat.astype(np.float32), glaze=glaze.astype(np.float16), ridge=ridge.astype(np.uint8),
                    relief=relief.astype(np.float16), up=UP)
vis = imu.copy()
vis[keep > 0] = (vis[keep > 0] * .55 + np.array([255, 0, 255]) * .45).astype(np.uint8)
vis[ridge] = (0, 255, 0)
cv2.imwrite('out/work/trace_vis.png', vis[230:1000, 290:840])
rv = np.clip(128 + relief * 600, 0, 255).astype(np.uint8)
cv2.imwrite('out/work/trace_relief.png', rv[230:1000, 290:840])
print('glaze px %d  ridge px %d' % (keep.sum(), ridge.sum()))
