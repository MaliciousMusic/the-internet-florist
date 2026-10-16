# Side by side: the photograph | the model's own texture at the fitted pose | silhouettes (photo red, model green) and the
# decor edges of both, to judge the pose.
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import numpy as np, cv2, glbkit
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
P = json.load(open(os.path.join(OUT, 'glb_pose.json')))
cam = dict(P['cam'], **{k: float(v) for k, v in (a.split('=') for a in sys.argv[1:])})
ph = cv2.imread(os.path.join(OUT, 'ref.jpg')); H, W = ph.shape[:2]
pm = cv2.imread(os.path.join(OUT, 'mask.png'), 0) > 127
R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))
r = R.render(cam, W, H, modes=(0,))
a = np.clip(r['albedo'][..., ::-1] * 255, 0, 255).astype(np.uint8); a[~r['mask']] = 20
ov = np.zeros_like(ph); ov[..., 2] = pm * 255; ov[..., 1] = r['mask'] * 255
e1 = cv2.Canny(cv2.GaussianBlur(ph, (0, 0), 1.5), 40, 90) > 0
e2 = cv2.Canny(cv2.GaussianBlur(a, (0, 0), 1.5), 40, 90) > 0
ed = np.full_like(ph, 255); ed[e1] = (0, 0, 220); ed[e2] = (0, 150, 0); ed[e1 & e2] = 0
print('iou %.4f' % ((r['mask'] & pm).sum() / (r['mask'] | pm).sum()))
cv2.imwrite(os.path.join(OUT, 'pose_check.jpg'), cv2.resize(np.hstack([ph, a, ov, ed]), (4 * W // 2, H // 2)))
