# lect.py: measured lines of the reference (pixels of out/ref.jpg): for each interface, the strongest vertical-gradient
# transition per column inside a window, then a robust straight-line fit (y = a + b x)
import cv2, numpy as np, json, sys
im = cv2.imread('out/ref.jpg').astype(np.float32)
lab = cv2.cvtColor(im / 255, cv2.COLOR_BGR2Lab)
g = cv2.GaussianBlur(lab, (0, 0), 1.2)
gy = np.linalg.norm(cv2.Sobel(g, cv2.CV_32F, 0, 1), axis=2)
gx = np.linalg.norm(cv2.Sobel(g, cv2.CV_32F, 1, 0), axis=2)
# windows (x0, x1, y at x0, y at x1, half height): interfaces read on the 2x grids
W = {'D_top': (220, 560, 240, 212, 10), 'D_bot': (140, 570, 380, 328, 12), 'C_bot': (200, 510, 443, 437, 8),
     'B_top': (180, 490, 446, 440, 6), 'B_bot': (185, 520, 575, 557, 9), 'A_foot': (240, 470, 760, 760, 10)}
res = {}
for k, (x0, x1, ya, yb, hh) in W.items():
    pts = []
    for x in range(x0, x1, 2):
        yc = ya + (yb - ya) * (x - x0) / (x1 - x0)
        a, b = int(yc - hh), int(yc + hh)
        col = gy[a:b, x]
        pts.append((x, a + int(np.argmax(col)), float(col.max())))
    P = np.array(pts)
    best = None
    rng = np.random.default_rng(0)
    for _ in range(400):
        i, j = rng.choice(len(P), 2, replace=False)
        if P[i, 0] == P[j, 0]:
            continue
        bb = (P[j, 1] - P[i, 1]) / (P[j, 0] - P[i, 0]); aa = P[i, 1] - bb * P[i, 0]
        inl = np.abs(P[:, 1] - (aa + bb * P[:, 0])) < 1.5
        if best is None or inl.sum() > best[0]:
            best = (inl.sum(), inl)
    inl = best[1]
    bb, aa = np.polyfit(P[inl, 0], P[inl, 1], 1)
    res[k] = dict(a=round(float(aa), 2), b=round(float(bb), 5), inliers=int(inl.sum()), n=len(P),
                  deg=round(float(np.degrees(np.arctan(bb))), 2), ends=[[int(P[inl, 0].min()), round(float(aa + bb * P[inl, 0].min()), 1)], [int(P[inl, 0].max()), round(float(aa + bb * P[inl, 0].max()), 1)]])
    if k == 'A_foot':
        res[k]['profile'] = [[int(x), int(y)] for x, y, s in P[::5]]
for k, v in res.items():
    print(k, v)
json.dump(res, open('out/lect/lignes.json', 'w'), indent=1)
