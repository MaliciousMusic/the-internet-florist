# cmp.py: the reference and the photo-framed field side by side (out/_cmp.png)
import cv2, json, numpy as np, sys
ref = cv2.imread('out/ref.jpg')
f = cv2.imread('out/field_photo.png'); m = json.load(open('out/field_photo.json'))
H, W = ref.shape[:2]
can = np.full_like(ref, (229, 235, 238))
s = 1 / m['res']
fr = cv2.resize(f, None, fx=s, fy=s, interpolation=cv2.INTER_LINEAR)
x0, y0 = int(round(m['x0'])), int(round(m['y0']))
xa, ya = max(0, x0), max(0, y0)
xb, yb = min(W, x0 + fr.shape[1]), min(H, y0 + fr.shape[0])
can[ya:yb, xa:xb] = fr[ya - y0:yb - y0, xa - x0:xb - x0]
out = np.hstack([ref, can])
if len(sys.argv) > 1:
    out = cv2.resize(out, None, fx=float(sys.argv[1]), fy=float(sys.argv[1]), interpolation=cv2.INTER_AREA)
cv2.imwrite('out/_cmp.png', out)
