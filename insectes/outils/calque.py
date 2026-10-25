"""calque.py: the outline of a render (calque.mjs, transparent ground) over the photo it was laid on, and the render beside it, to
fit the shape by eye and by numbers (PROTOCOLE §2). The output holds photo pixels: it stays in refcache/.

  python insectes/outils/calque.py <photo> <render.png> <scale> <out.jpg> [--box x0,y0,x1,y1 (photo px)]
Prints the share of the photo's insect (SAM mask, optional --masque png at photo size) covered by the render and the reverse."""
import sys
import numpy as np
import cv2

a = sys.argv[1:]
photo, render, sc, out = a[0], a[1], float(a[2]), a[3]
P = cv2.imread(photo); P = cv2.resize(P, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA)
R = cv2.imread(render, cv2.IMREAD_UNCHANGED)
R = R[:P.shape[0], :P.shape[1]]
al = R[..., 3] > 40
cs, _ = cv2.findContours(al.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
ov = P.copy()
cv2.drawContours(ov, cs, -1, (255, 0, 255), 1)
# the render composited on the photo's ground colour, beside
bg = np.full(P.shape, 239, np.uint8)
f = R[..., 3:4].astype(np.float32) / 255
comp = (R[..., :3] * f + bg * (1 - f)).astype(np.uint8)
if '--box' in a:
    x0, y0, x1, y1 = [int(int(v) * sc) for v in a[a.index('--box') + 1].split(',')]
    ov, comp = ov[y0:y1, x0:x1], comp[y0:y1, x0:x1]
if '--masque' in a:
    M = cv2.imread(a[a.index('--masque') + 1], 0) > 127
    M = cv2.resize(M.astype(np.uint8), (P.shape[1], P.shape[0]), interpolation=cv2.INTER_NEAREST) > 0
    print('photo couverte par le rendu %.2f, rendu dans la photo %.2f' % ((M & al).sum() / max(1, M.sum()), (M & al).sum() / max(1, al.sum())))
img = np.concatenate([ov, np.full((ov.shape[0], 6, 3), 239, np.uint8), comp], 1) if ov.shape[1] < ov.shape[0] * 1.2 else np.concatenate([ov, np.full((6, ov.shape[1], 3), 239, np.uint8), comp], 0)
cv2.imwrite(out, img, [cv2.IMWRITE_JPEG_QUALITY, 88])
print(out, img.shape[1], img.shape[0])
