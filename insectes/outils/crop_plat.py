"""crop_plat.py: crops of a flattened photo and its flat render at the same mm boxes, side by side, enlarged x z.
  python crop_plat.py <record.json> <plat.png> <rendu.png> <out.jpg> <z> s0,q0,s1,q1 ..."""
import sys, json, numpy as np, cv2
rec = json.load(open(sys.argv[1], encoding='utf-8')); P = cv2.imread(sys.argv[2]); R = cv2.imread(sys.argv[3]); out = sys.argv[4]; z = float(sys.argv[5])
s0, q1 = rec['origine']; r = rec['r']
rows = []
for b in sys.argv[6:]:
    a0, b0, a1, b1 = map(float, b.split(','))
    x0, x1 = int((a0 - s0) * r), int((a1 - s0) * r); y0, y1 = int((q1 - b1) * r), int((q1 - b0) * r)
    cp = cv2.resize(P[y0:y1, x0:x1], None, fx=z, fy=z, interpolation=cv2.INTER_NEAREST if z >= 2 else cv2.INTER_AREA)
    cr = cv2.resize(R[y0:y1, x0:x1], None, fx=z, fy=z, interpolation=cv2.INTER_NEAREST if z >= 2 else cv2.INTER_AREA)
    rows.append(np.concatenate([cp, np.full((cp.shape[0], 8, 3), 239, np.uint8), cr], 1))
W = max(x.shape[1] for x in rows)
rows = [np.pad(x, ((0, 8), (0, W - x.shape[1]), (0, 0)), constant_values=239) for x in rows]
cv2.imwrite(out, np.concatenate(rows, 0), [cv2.IMWRITE_JPEG_QUALITY, 90]); print(out)
