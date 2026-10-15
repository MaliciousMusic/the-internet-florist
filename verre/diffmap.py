# Coverage check of the sculpted model against the reference: the reference's figures (guided segmentation, ground = rough
# patches) versus the union of the modelled forms. Red: missing in the model; blue: model where the reference shows ground.
import sys, json, numpy as np, cv2
sys.argv = ['mk.py', 'photo'] + sys.argv[1:]
sys.path.insert(0, '.')
import mk
order = mk.build_groups()
ours = np.zeros((mk.H, mk.W), bool)
for g in order:
    ours |= g['mask']
lab = np.load('out/lab.npy')
sil = mk.poly_mask(mk.silhouette_pts(), 1.0, (mk.H, mk.W), n=1)
body = sil & (np.mgrid[0:mk.H, 0:mk.W][0] > 205) & (np.mgrid[0:mk.H, 0:mk.W][0] < 1240)
ref = (lab >= 3) & body
ours &= body
en = (cv2.imread('out/clahe.jpg') * .6).astype(np.uint8)
v = en.copy()
v[ref & ~ours] = (v[ref & ~ours] * .4 + np.array([0, 0, 255]) * .6).astype(np.uint8)
v[ours & ~ref] = (v[ours & ~ref] * .4 + np.array([255, 120, 0]) * .6).astype(np.uint8)
for g in order:
    cs, _ = cv2.findContours(g['mask'].astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cv2.drawContours(v, cs, -1, (200, 255, 200), 1)
for x in range(0, 1200, 50):
    cv2.line(v, (x, 0), (x, 1435), (0, 200, 0) if x % 100 == 0 else (0, 90, 0), 1)
for y in range(0, 1435, 50):
    cv2.line(v, (0, y), (1200, y), (0, 200, 0) if y % 100 == 0 else (0, 90, 0), 1)
for x in range(100, 1200, 100):
    cv2.putText(v, str(x), (x + 2, 205), cv2.FONT_HERSHEY_SIMPLEX, .45, (0, 255, 0), 1)
for y in range(200, 1400, 100):
    cv2.putText(v, str(y), (75, y - 3), cv2.FONT_HERSHEY_SIMPLEX, .45, (0, 255, 0), 1)
iou = (ref & ours).sum() / max(1, (ref | ours).sum())
print('IoU %.3f  missing %.0f%%  excess %.0f%%' % (iou, 100 * (ref & ~ours).sum() / ref.sum(), 100 * (ours & ~ref).sum() / ref.sum()))
c = v[180:1260, 70:1130]
cv2.imwrite('out/diff.jpg', cv2.resize(c, (int(1060 * .8), int(1080 * .8))), [cv2.IMWRITE_JPEG_QUALITY, 88])
for nm, (x0, y0, x1, y1) in {'tl': (80, 190, 620, 720), 'tr': (560, 190, 1120, 720), 'bl': (150, 660, 640, 1270), 'br': (560, 660, 1060, 1270)}.items():
    c = v[y0:y1, x0:x1]
    cv2.imwrite('out/diff_%s.jpg' % nm, cv2.resize(c, (int((x1 - x0) * 1.35), int((y1 - y0) * 1.35))), [cv2.IMWRITE_JPEG_QUALITY, 88])
