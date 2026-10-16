# Fine pose of a GLB in its reference photograph: one joint search (Nelder-Mead) over the turn, pitch, roll, stretch, scale,
# perspective and position of the camera, scored on the silhouettes (soft IoU on slightly blurred masks) and, for a
# textured model, on the decor (CIELAB correlation of the texture with the photograph: it fixes the turn of a turned vase).
# Works at a reduced size (fast), writes the pose at the photograph's size.
#   .venv-depth/Scripts/python posefit.py <vase> [wd=.3] [scan=1] [px=520]  -> <vase>/out/glb_pose.json (previous one kept as glb_pose_prev.json)
import sys, os, json, math, time, shutil
import numpy as np, cv2
from scipy.optimize import minimize

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import glbkit, mesure  # noqa: E402

vase = sys.argv[1]
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
F = lambda k, d: float(OPT.get(k, d))
OUT = os.path.join(HERE, vase, 'out')
T0 = time.time()
ph = cv2.imread(os.path.join(OUT, 'ref.jpg'))
H, W = ph.shape[:2]
s = F('px', 520) / max(H, W)
w, h = int(round(W * s)), int(round(H * s))
pm = cv2.resize(cv2.imread(os.path.join(OUT, 'mask.png'), 0), (w, h), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
pms = cv2.GaussianBlur(pm, (0, 0), 1.2)
pl = mesure.to_lab(cv2.GaussianBlur(cv2.resize(ph, (w, h), interpolation=cv2.INTER_AREA), (0, 0), 1.5))
model = glbkit.Model(os.path.join(OUT, 'model.glb'))
textured = model.base is not None and F('wd', .3) > 0
R = glbkit.Renderer(model)
ys, xs = np.where(pm > .5)
inner = cv2.erode((pm > .5).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0


def cam_of(p):
    yaw, pitch, roll, sx, lsc, lD, cx, cy = p
    D = math.exp(lD)
    return dict(yaw=yaw, pitch=pitch, roll=roll, sx=sx, dist=D, fpx=math.exp(lsc) * D * h, cx=cx * w, cy=cy * h, ty=.5)


def score(p, parts=False):
    r = R.render(cam_of(p), w, h, modes=(0,) if textured else (2,))
    mm = cv2.GaussianBlur(r['mask'].astype(np.float32), (0, 0), 1.2)
    iou = float(np.minimum(mm, pms).sum() / max(1e-6, np.maximum(mm, pms).sum()))
    corr = 0.0
    if textured:
        a = np.clip(cv2.GaussianBlur(r['albedo'][..., ::-1], (0, 0), 1.5) * 255, 0, 255).astype(np.uint8)
        ml = mesure.to_lab(a)
        sel = inner & r['mask']
        if sel.sum() > 100:
            cs = []
            for c, wt in ((0, 1.0), (1, 1.0), (2, 1.0)):
                x, y = pl[..., c][sel], ml[..., c][sel]
                x, y = x - x.mean(), y - y.mean()
                cs.append((x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-9))
            corr = float(np.mean(cs))
    # a product photograph is taken from afar: a camera nearer than dmin model heights is penalised
    loss = (1 - iou) + max(0.0, F('dmin', 0) - math.exp(p[5])) * .05 + F('wd', .3) * (1 - corr) * (1 if textured else 0) * .1
    return (loss, iou, corr) if parts else loss


def start_points():
    P0 = os.path.join(OUT, 'glb_pose.json')
    pts = []
    if os.path.exists(P0) and F('scan', 0) < 1:
        c = json.load(open(P0))['cam']
        D = c['dist']
        sc = c['fpx'] / D / (H)       # image height per model height ~ fpx / D in photo pixels / H
        pts.append([c['yaw'], c['pitch'], c.get('roll', 0), c.get('sx', 1), math.log(sc), math.log(D), c['cx'] / W, c['cy'] / H])
        return pts
    # a coarse scan of the turn and pitch: the model's height fitted to the photograph's, centred on its box
    hh = (ys.max() - ys.min()) / h
    best = []
    for yaw in range(0, 360, 15):
        for pitch in (5, 15, 25):
            p = [yaw, pitch, 0, 1, math.log(hh * .95), math.log(6), (xs.min() + xs.max()) / 2 / w, (ys.min() + ys.max()) / 2 / h]
            # place: shift so that the boxes match
            r = R.render(cam_of(p), w, h, modes=(2,))
            my, mx = np.where(r['mask'])
            if len(my) < 30:
                continue
            k = (ys.max() - ys.min()) / max(1, my.max() - my.min())
            p[4] += math.log(k)
            r = R.render(cam_of(p), w, h, modes=(2,))
            my, mx = np.where(r['mask'])
            p[6] += ((xs.min() + xs.max()) / 2 - (mx.min() + mx.max()) / 2) / w
            p[7] += ((ys.min() + ys.max()) / 2 - (my.min() + my.max()) / 2) / h
            best.append((score(p), p))
    best.sort(key=lambda t: t[0])
    print('scan: best turns', [(round(b[1][0]), round(b[1][1]), round(1 - b[0], 3)) for b in best[:4]])
    return [b[1] for b in best[:int(F('nstart', 3))]]


results = []
for p0 in start_points():
    st = np.array([20, 6, 2, .04, .06, .4, .02, .02])
    sim = np.array([p0] + [np.array(p0) + np.eye(8)[i] * st[i] for i in range(8)])
    rs = minimize(score, p0, method='Nelder-Mead', options=dict(initial_simplex=sim, maxfev=int(F('nfev', 500)), xatol=.01, fatol=1e-5))
    st2 = st / 5
    sim = np.array([rs.x] + [rs.x + np.eye(8)[i] * st2[i] for i in range(8)])
    rs = minimize(score, rs.x, method='Nelder-Mead', options=dict(initial_simplex=sim, maxfev=int(F('nfev', 500)), xatol=.002, fatol=1e-6))
    l, iou, corr = score(rs.x, True)
    print('start turn %.0f -> turn %.1f pitch %.1f roll %.2f stretch %.3f dist %.1f: IoU %.4f decor %.3f (%.0fs)' % (
        p0[0], rs.x[0], rs.x[1], rs.x[2], rs.x[3], math.exp(rs.x[5]), iou, corr, time.time() - T0), flush=True)
    results.append((l, rs.x, iou, corr))
l, p, iou, corr = min(results, key=lambda t: t[0])
c = cam_of(p)
# back to the photograph's size
c['fpx'] /= s; c['cx'] /= s; c['cy'] /= s
c['yaw'] %= 360
P0 = os.path.join(OUT, 'glb_pose.json')
if os.path.exists(P0):
    shutil.copy(P0, os.path.join(OUT, 'glb_pose_prev.json'))
json.dump(dict(cam=c, silhouette_iou=iou, decor_corr=corr, W=W, H=H, fit='posefit'), open(P0, 'w'), indent=1)
print('pose: turn %.1f, pitch %.1f, roll %.2f, IoU %.4f, decor %.3f' % (c['yaw'], c['pitch'], c['roll'], iou, corr))
