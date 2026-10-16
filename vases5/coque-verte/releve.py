# Measurements of the reference (vases5/coque-verte), kept as numbers and masks in out/ (private, never in git):
#   - the silhouette, the plate and the sheet, from the photograph and its depth map (Depth Anything V2, out/depth.npy);
#   - the depth map calibrated in cm on our geometric model (model.py, through the photograph's camera), and its normals;
#   - the light of the photograph measured on those normals: a 2nd-order spherical-harmonics irradiance (9 terms) plus a
#     cavity term, fitted per material part on the CIELAB colours of the photograph blurred of its grain.
#   python releve.py   ->  out/releve.npz, out/releve.json, work/releve_*.png
import sys, os, json, math
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..'))
os.chdir(HERE)
import mesure as MS  # noqa: E402

ref = cv2.imread('out/ref.jpg')
H, W = ref.shape[:2]
g = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY).astype(np.float32)
lab = MS.to_lab(cv2.GaussianBlur(ref, (0, 0), 2.5))
dn = np.load('out/depth.npy').astype(np.float32)

# ---------------------------------------------------------------- silhouette (the clay is far darker than the wall and the table)
gb = cv2.GaussianBlur(g, (0, 0), 1.2)
m = (gb < 116).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, lb, st, _ = cv2.connectedComponentsWithStats(m)
m = (lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
sil = np.zeros_like(m); cv2.drawContours(sil, cs, -1, 1, -1)
sil = sil.astype(bool)
# sub-pixel: the 50 % iso-line of the blurred luminance between clay (~45) and backdrop (~205)
SIL_LEVEL = 116.0

# ---------------------------------------------------------------- our model through the photograph's camera (a prior for the parts)
sys.argv = ['mk.py', 'none']
import mk  # noqa: E402
cam = mk.photo_cam()
Bm = mk.Buf(cam.W, cam.H)
for P_, N_, part_, side_ in mk.MD.points(cam.k * 1.5):
    Bm.splat(cam, P_, N_, part_, side_)
pm = cv2.resize(Bm.part.reshape(cam.H, cam.W), (W, H), interpolation=cv2.INTER_NEAREST)
model_sil = cv2.dilate((pm > 0).astype(np.uint8), np.ones((31, 31), np.uint8)) > 0
model_plate = cv2.dilate((pm == 1).astype(np.uint8), np.ones((25, 25), np.uint8)) > 0
sil = MS.silhouette(ref) & model_sil                  # GrabCut outline, without the shadow on the table
FLOOR_Y, FLOOR_X = 803, 432                          # the plate meets the table there (measured): below it, only shadow
sil[FLOOR_Y:, FLOOR_X:] = False
n, lb, st, _ = cv2.connectedComponentsWithStats(sil.astype(np.uint8))
sil = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])

# ---------------------------------------------------------------- the plate: a plane in the depth map
ys, xs = np.mgrid[0:H, 0:W]
seed = sil & (xs > 450) & (ys > 160) & (ys < 700) & (xs < 560)
A = np.c_[xs[seed], ys[seed], np.ones(seed.sum())]
coef = np.linalg.lstsq(A, dn[seed], rcond=None)[0]
for _ in range(3):
    r = dn[seed] - A @ coef
    k = np.abs(r) < 2.5 * np.std(r)
    coef = np.linalg.lstsq(A[k], dn[seed][k], rcond=None)[0]
plane = coef[0] * xs + coef[1] * ys + coef[2]
res = dn - plane
tol = float(max(.12, 3 * np.std(dn[seed] - A @ coef)))
plate = sil & (res < tol) & model_plate
plate = cv2.morphologyEx(plate.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)).astype(bool)
n, lb, st, _ = cv2.connectedComponentsWithStats(plate.astype(np.uint8))
plate = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
plate = cv2.morphologyEx(plate.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)).astype(bool) & sil
sheet = sil & ~plate
# the right side of the trunk recedes to the plate's depth: the meeting line is read on the photograph instead, as the
# strongest step of the luminance near the model's trunk edge, row by row
gx_ = np.abs(cv2.Sobel(cv2.GaussianBlur(g, (0, 0), 1.5), cv2.CV_32F, 1, 0, ksize=3))
xr = {}
for y in range(380, 800):
    row = pm[y]
    xs_ = np.nonzero((row[:-1] == 2) & (row[1:] == 1))[0]
    xs_ = xs_[xs_ > 300]
    if not len(xs_):
        continue
    x0 = int(xs_.max())
    a0, a1 = max(0, x0 - 28), min(W - 2, x0 + 28)
    xr[y] = a0 + int(np.argmax(gx_[y, a0:a1]))
if xr:
    yk = np.array(sorted(xr)); xk = np.array([xr[k] for k in yk], float)
    xk = cv2.GaussianBlur(xk.reshape(-1, 1), (0, 0), 6).ravel() if len(xk) > 12 else xk
    for y, x in zip(yk, xk):
        sheet[y, :int(round(x))] |= sil[y, :int(round(x))] & (np.arange(int(round(x))) > 300)
        sheet[y, int(round(x)):] &= False
    plate = sil & ~sheet
    print('trunk meeting line read on %d rows, x %d..%d' % (len(yk), xk.min(), xk.max()))
# the inside of the rolled lobe, above the S edge, is in the dark like the plate's face: it goes with the plate
# (its edge is the S itself, read on the photograph as the step from the lit lip to the dark inside)
e = math.radians(11.5)
sv = np.linspace(0, mk.MD._d[10], 200)
Ep = mk.MD.shell_mid(sv, np.ones_like(sv))
Ex = 296 + 20.6 * Ep[:, 0]; Ey = 806 - 20.6 * (Ep[:, 1] * math.cos(e) - Ep[:, 2] * math.sin(e))
poly = np.r_[np.c_[Ex, Ey + 14], [[Ex[-1] + 30, 0], [0, 0], [0, Ey[0]]]]
above = np.zeros((H, W), np.uint8); cv2.fillPoly(above, [np.round(poly).astype(np.int32)], 1)
Lb = MS.to_lab(cv2.GaussianBlur(ref, (0, 0), 3))[..., 0]
inner = sheet & (above > 0) & (Lb < 27)
inner = cv2.morphologyEx(inner.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(bool)
n, lb, st, _ = cv2.connectedComponentsWithStats(inner.astype(np.uint8))
inner = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]) if n > 1 else inner
plate = (plate | inner) & sil
sheet = sil & ~plate
n, lb, st, _ = cv2.connectedComponentsWithStats(sheet.astype(np.uint8))
sheet = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
plate = sil & ~sheet
print('plate plane', np.round(coef, 5), 'tol %.3f' % tol, 'plate', plate.sum(), 'sheet', sheet.sum())

# ---------------------------------------------------------------- depth in cm
# Depth Anything gives a relative inverse depth; over 20 cm of a piece seen from afar it is close to linear in depth. Two
# anchors of the measured geometry set its scale (model.py through the photograph's camera): the plate's face (Z ~ 1.6 cm)
# and the front of the trunk at its belly (axis 11.5 cm + radius 9.6 cm); the left flank (Z ~ 11.5) checks it.
ANCH = [((450, 200), 1.6), ((500, 450), 1.9), ((300, 650), 21.1), ((330, 700), 20.9)]
dd = np.array([np.median(dn[y - 3:y + 4, x - 3:x + 4]) for (x, y), _ in ANCH]); zz = np.array([z for _, z in ANCH])
a, b = np.polyfit(dd, zz, 1)
cal = {'all': (float(a), float(b))}
print('depth calibration cm = %.3f d %+.2f' % (a, b), '; left flank check: %.1f cm (expected ~11.5)' % (a * np.median(dn[445:456, 55:66]) + b))
Zcm = (a * dn + b).astype(np.float32)


def masked_blur(a, msk, s):
    mm = msk.astype(np.float32)
    return cv2.GaussianBlur(a * mm, (0, 0), s) / np.maximum(cv2.GaussianBlur(mm, (0, 0), s), 1e-4)


PX = 20.6                                              # photo pixels per cm (camera fitted in mk.photo_cam)
NRM = np.zeros((H, W, 3), np.float32)
CAV = np.zeros((H, W), np.float32)
for msk in (sheet, plate):
    Zs = masked_blur(Zcm, msk, 2.0)
    gy, gx = np.gradient(Zs)
    nx, ny = -gx * PX / PX, gy                         # dZ/dX (cm/cm) = gx * PX / PX ; image y down -> world up
    nrm = np.dstack([-gx, gy, np.full_like(gx, 1.0 / PX)])
    nrm /= np.linalg.norm(nrm, axis=2, keepdims=True)
    NRM[msk] = nrm[msk]
    # cavity: how far below its surroundings each point lies (cm), at two scales
    c = (masked_blur(Zs, msk, 6) - Zs) * .6 + (masked_blur(Zs, msk, 18) - Zs) * .4
    CAV[msk] = c[msk]


# ---------------------------------------------------------------- the light of the photograph, measured on those normals
from releve_feats import LIGHTS, cast_shadow, feats as _feats  # noqa: E402
SH = [cast_shadow(Zcm, l, sil) for l in LIGHTS]
def _dist_in(m):
    return cv2.distanceTransform(m.astype(np.uint8), cv2.DIST_L2, 5).astype(np.float32)


meet = cv2.dilate(plate.astype(np.uint8), np.ones((3, 3), np.uint8)) & cv2.dilate(sheet.astype(np.uint8), np.ones((3, 3), np.uint8))
d_meet = cv2.distanceTransform((1 - meet).astype(np.uint8), cv2.DIST_L2, 5).astype(np.float32)
# distances to: the own part's outline, the silhouette, the line where the sheet meets the plate
ED = np.stack([np.where(sheet, _dist_in(sheet), _dist_in(plate)), _dist_in(sil), d_meet])
feats = lambda nrm, cav: _feats(nrm, cav, np.stack(SH), ED)


fit = {}
for name, msk in (('sheet', sheet), ('plate', plate)):
    sel = cv2.erode(msk.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
    Fm = feats(NRM, CAV)[sel]
    out = []
    for ch in range(3):
        y = lab[..., ch][sel]
        lam = 2e-5 * np.eye(Fm.shape[1]); lam[0, 0] = 0
        if ch > 0:
            lam = lam * 3000; lam[0, 0] = 0                  # chroma: a smooth, heavily regularised model (no colour bands)
        w = np.linalg.solve(Fm.T @ Fm + lam * len(y), Fm.T @ y)
        out.append(w)
        print(name, 'LAB'[ch], 'rms %.2f' % np.std(y - Fm @ w))
    fit[name] = np.array(out).tolist()

np.savez_compressed('out/releve.npz', sil=sil, plate=plate, sheet=sheet, Zcm=Zcm, NRM=NRM, CAV=CAV, SH=np.stack(SH), ED=ED)
json.dump(dict(plane=coef.tolist(), tol=tol, cal=cal, fit=fit, sil_level=SIL_LEVEL), open('out/releve.json', 'w'), indent=1)
v = ref.copy(); v[plate] = (v[plate] * .5 + np.array([200, 80, 0]) * .5).astype(np.uint8); v[sheet] = (v[sheet] * .5 + np.array([0, 120, 220]) * .5).astype(np.uint8)
cv2.imwrite('work/releve_parts.png', v)
cv2.imwrite('work/releve_normals.png', ((NRM * .5 + .5) * 255).astype(np.uint8)[..., ::-1])

# ---------------------------------------------------------------- check board: parts | normals | measured L | fitted L | residual x6
pred = np.zeros_like(lab)
for name in ('sheet', 'plate'):
    w = np.array(fit[name]); mm = sheet if name == 'sheet' else plate
    pred[mm] = feats(NRM, CAV)[mm] @ w.T
res_ = np.where(sil, pred[..., 0] - lab[..., 0], 0)
gv = lambda a: cv2.cvtColor(np.clip(a, 0, 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
board = np.hstack([v, cv2.imread('work/releve_normals.png'), gv(lab[..., 0] * 2.55), gv(pred[..., 0] * 2.55), gv(128 + res_ * 6)])
cv2.imwrite('work/releve_board.png', cv2.resize(board, None, fx=.5, fy=.5))
print('fitted L rms over the silhouette %.2f' % np.std(res_[sil]))
