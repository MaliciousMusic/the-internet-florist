# Turns a posed GLB so it is seen square from the front: the turn about the axis (near the photograph's) for which the view
# is most nearly its own mirror image (silhouette and texture, about the axis). Pitch, focal and position stay those of the
# photograph's pose.
#   .venv-depth/Scripts/python front.py <vase> [span=60] [step=1]   -> out/glb_pose.json (the photograph's pose kept as glb_pose_photo.json)
import sys, os, json, shutil
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import glbkit  # noqa: E402

vase = sys.argv[1]
OPT = dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a)
OUT = os.path.join(HERE, vase, 'out')
src = os.path.join(OUT, 'glb_pose_photo.json')
if not os.path.exists(src):
    shutil.copy(os.path.join(OUT, 'glb_pose.json'), src)
P = json.load(open(src))
cam0, W, H = P['cam'], P['W'], P['H']
s = 360 / max(W, H)
w, h = int(W * s), int(H * s)
R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))


def score(yaw):
    c = dict(cam0, yaw=yaw, fpx=cam0['fpx'] * s, cy=cam0['cy'] * s, cx=w / 2, roll=0)
    r = R.render(c, w, h, modes=(0,))
    m = r['mask'].astype(np.float32)
    a = cv2.cvtColor(np.clip(r['albedo'], 0, 1).astype(np.float32), cv2.COLOR_RGB2GRAY) * m
    ys, xs = np.where(m > 0)
    if len(xs) < 50:
        return -1
    ax = (xs.min() + xs.max()) / 2                 # mirror about the middle of the silhouette
    M = np.float32([[-1, 0, 2 * ax], [0, 1, 0]])
    mf = cv2.warpAffine(m, M, (w, h)); af = cv2.warpAffine(a, M, (w, h))
    iou = (np.minimum(m, mf).sum() / max(1, np.maximum(m, mf).sum()))
    both = (m > 0) & (mf > 0)
    x, y = a[both] - a[both].mean(), af[both] - af[both].mean()
    corr = (x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-9)
    return iou + .5 * corr


span, step = float(OPT.get('span', 60)), float(OPT.get('step', 1))
ys_ = np.arange(cam0['yaw'] - span, cam0['yaw'] + span + .01, step)
sc = [(score(float(y)), float(y)) for y in ys_]
best, yaw = max(sc)
for y in np.arange(yaw - 1, yaw + 1.01, .25):
    v = score(float(y))
    if v > best:
        best, yaw = v, float(y)
cam = dict(cam0, yaw=yaw % 360, roll=0.0)
json.dump(dict(P, cam=cam, front=True, front_score=float(best)), open(os.path.join(OUT, 'glb_pose.json'), 'w'), indent=1)
print('photo turn %.1f -> front turn %.1f (symmetry %.3f)' % (cam0['yaw'], yaw % 360, best))
