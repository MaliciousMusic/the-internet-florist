# Silhouette of the vase in the photo: per row, the first/last pixel that differs from the backdrop (black above the table edge, white below).
import numpy as np, cv2
im = cv2.imread('out/ref.jpg').astype(np.float32)
H, W = im.shape[:2]
lum = im.mean(2)
# table edge row: the backdrop turns from black to white
col = lum[:, 20]
edge = int(np.argmax(col > 128))
print('table edge row', edge)
rows = []
for y in range(60, H):
    r = lum[y]
    if y < edge - 2:
        m = r > 40
    elif y > edge + 6:
        # white table: the vase is darker or more coloured than the paper
        sat = im[y].max(1) - im[y].min(1)
        m = (r < 228) | (sat > 18)
    else:
        continue
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones(5, np.uint8)).ravel() > 0
    xs = np.nonzero(m)[0]
    if len(xs) > 30:
        rows.append((y, int(xs[0]), int(xs[-1])))
rows = np.array(rows)
# the rows along the table edge are polluted by the edge itself: interpolate across them
bad = (rows[:, 0] > edge - 12) & (rows[:, 0] < edge + 12)
good = rows[~bad]
ys = np.arange(rows[0, 0], rows[-1, 0] + 1)
rows = np.c_[ys, np.interp(ys, good[:, 0], good[:, 1]).round(), np.interp(ys, good[:, 0], good[:, 2]).round()].astype(int)
np.save('out/sil.npy', rows)
for y, a, b in rows[::50]:
    print(y, a, b, b - a)
