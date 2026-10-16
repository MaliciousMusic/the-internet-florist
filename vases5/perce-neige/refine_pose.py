# Refines the fitted pose on the silhouette: roll, stretch, pitch, focal and shift by a small coordinate search; keeps the turn.
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import numpy as np, cv2, glbkit
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
P = json.load(open(os.path.join(OUT, 'glb_pose.json')))
cam = dict(P['cam'], yaw=float(sys.argv[1]) if len(sys.argv) > 1 else P['cam']['yaw'])
pm = cv2.imread(os.path.join(OUT, 'mask.png'), 0) > 127; H, W = pm.shape
R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))
def iou(c):
    m = R.render(c, W, H, modes=(2,))['mask']
    return (m & pm).sum() / (m | pm).sum()
best = iou(cam); print('start %.4f' % best)
steps = dict(roll=.6, sx=.02, pitch=1.0, fpx=cam['fpx'] * .01, cx=2.0, cy=2.0)
for it in range(5):
    for k, s in steps.items():
        for d in (-s, s, -s / 3, s / 3):
            c = dict(cam); c[k] = c.get(k, 0 if k != 'sx' else 1) + d
            v = iou(c)
            if v > best:
                best, cam = v, c
    print(it, '%.4f' % best, {k: round(cam.get(k, 0), 3) for k in steps})
# the turn from the decor alone (colour pattern correlation, as glbkit fit 'lab'), the silhouette pose kept
import mesure
ph = cv2.imread(os.path.join(OUT, 'ref.jpg')); pl = mesure.to_lab(cv2.GaussianBlur(ph, (0, 0), 2))
inner = cv2.erode(pm.astype(np.uint8), np.ones((15, 15), np.uint8)) > 0
def dscore(y):
    r = R.render(dict(cam, yaw=y), W, H, modes=(0,))
    ml = mesure.to_lab(np.clip(cv2.GaussianBlur(r['albedo'][..., ::-1], (0, 0), 2) * 255, 0, 255).astype(np.uint8))
    sel = inner & r['mask']; t = 0
    for j, w in ((0, 1), (1, 1), (2, 1)):
        x, z = pl[..., j][sel], ml[..., j][sel]; x, z = x - x.mean(), z - z.mean()
        t += w * (x * z).sum() / np.sqrt((x * x).sum() * (z * z).sum())
    return t / 3
sc = sorted((dscore(float(y)), float(y)) for y in np.arange(cam['yaw'] - 6, cam['yaw'] + 6.01, .5))
print('decor turn %.1f (corr %.4f), silhouette IoU there %.4f' % (sc[-1][1], sc[-1][0], iou(dict(cam, yaw=sc[-1][1]))))
cam['yaw'] = sc[-1][1]
P['cam'] = cam; P['silhouette_iou'] = float(iou(cam)); P['decor_corr'] = sc[-1][0]
json.dump(P, open(os.path.join(OUT, 'glb_pose.json'), 'w'), indent=1)
