# Board of one vase made by glbsvg.py: reference photograph | GLB posed on it (silhouette overlap) | our SVG rendered by Chrome,
# then a 1:1 crop of the SVG. -> <vase>/out/planche_<tag>.jpg (and _apercu/<vase>_<tag>.jpg)
#   python glbplanche.py <vase> <tag> [x0 y0 size]   (crop box of the close-up, photo pixels; default: the middle)
import sys, os, subprocess
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
vase, tag = sys.argv[1], sys.argv[2]
OUT = os.path.join(HERE, vase, 'out')
ref = cv2.imread(os.path.join(OUT, 'ref.jpg'))
H, W = ref.shape[:2]
svg = os.path.join(OUT, 'glbsvg_%s.svg' % tag)
png = os.path.join(OUT, 'shot_%s.png' % tag)
if not os.path.exists(png) or os.path.getmtime(png) < os.path.getmtime(svg):
    subprocess.run(['sh', os.path.join(HERE, '..', 'verre', 'shot.sh'), svg, png, str(W), str(H)], check=True)
shot = cv2.imread(png)
pm = cv2.imread(os.path.join(OUT, 'mask.png'), 0) > 127
fld = cv2.imread(os.path.join(OUT, 'field_%s.png' % tag))
fld = cv2.resize(fld, (W, H), interpolation=cv2.INTER_AREA)
fm = (fld.min(2) < 250)
ov = ref.copy()
ov[pm & ~fm] = (0, 0, 255); ov[fm & ~pm] = (255, 160, 0)
iou = (pm & fm).sum() / max(1, (pm | fm).sum())
cv2.putText(ov, 'IoU %.3f' % iou, (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 0), 3)
row = np.hstack([ref, ov, shot])
s = 1800 / row.shape[1]
row = cv2.resize(row, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
if len(sys.argv) > 5:
    x0, y0, sz = map(int, sys.argv[3:6])
else:
    ys, xs = np.where(pm); sz = int(min(W, H) * .4); x0, y0 = int(xs.mean() - sz / 2), int(ys.mean() - sz / 2)
x0 = max(0, min(W - sz, x0)); y0 = max(0, min(H - sz, y0))
c1 = cv2.resize(ref[y0:y0 + sz, x0:x0 + sz], (900, 900), interpolation=cv2.INTER_CUBIC)
c2 = cv2.resize(shot[y0:y0 + sz, x0:x0 + sz], (900, 900), interpolation=cv2.INTER_CUBIC)
zoom = np.hstack([c1, c2])
board = np.vstack([row, zoom])
cv2.imwrite(os.path.join(OUT, 'planche_%s.jpg' % tag), board, [cv2.IMWRITE_JPEG_QUALITY, 88])
os.makedirs(os.path.join(HERE, '_apercu'), exist_ok=True)
cv2.imwrite(os.path.join(HERE, '_apercu', '%s_%s.jpg' % (vase, tag)), board, [cv2.IMWRITE_JPEG_QUALITY, 88])
print('IoU %.3f' % iou, os.path.join(OUT, 'planche_%s.jpg' % tag))
