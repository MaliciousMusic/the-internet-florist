# Mean CIELAB L (and b) of the photograph and of our render on a coarse grid inside the measured mask: where the light
# and the dark differ (the cells read row by row from the top, columns from the left)
import sys, os, numpy as np, cv2
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import mesure as M
O = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
ref = cv2.imread(os.path.join(O, 'ref.jpg')); ren = cv2.imread(os.path.join(O, '_ren_rgba.png'))
m = cv2.imread(os.path.join(O, 'mask_ref.png'), 0) > 127
A, B = M.to_lab(cv2.GaussianBlur(ref, (0, 0), 2)), M.to_lab(cv2.GaussianBlur(ren, (0, 0), 2))
ys, xs = np.nonzero(m); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
R, C = int(sys.argv[1]) if len(sys.argv) > 1 else 10, int(sys.argv[2]) if len(sys.argv) > 2 else 5
for i in range(R):
    row = []
    for j in range(C):
        a, b = y0 + (y1 - y0) * i // R, y0 + (y1 - y0) * (i + 1) // R
        c, d = x0 + (x1 - x0) * j // C, x0 + (x1 - x0) * (j + 1) // C
        s = m[a:b, c:d]
        if s.sum() < 50:
            row.append('     ----     '); continue
        la, lb = A[a:b, c:d][s].mean(0), B[a:b, c:d][s].mean(0)
        row.append('%3.0f/%3.0f b%3.0f/%3.0f' % (la[0], lb[0], la[2], lb[2]))
    print('y%4d ' % ((a + b) // 2) + ' | '.join(row))
