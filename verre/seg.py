# Smooth (figures) vs rough (stippled ground) map of the reference, to help the tracing.
import numpy as np, cv2, sys
im = cv2.imread('out/ref.jpg').astype(np.float32) / 255
L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
for s1, s2, nm in [(1.0, 3.0, 'a'), (1.5, 5.0, 'b')]:
    hp = cv2.GaussianBlur(L, (0, 0), s1) - cv2.GaussianBlur(L, (0, 0), s2)
    r = cv2.GaussianBlur(hp * hp, (0, 0), 7)
    r = np.sqrt(r)
    v = np.clip(r / np.percentile(r, 97), 0, 1)
    out = (v * 255).astype(np.uint8)
    col = cv2.applyColorMap(out, cv2.COLORMAP_INFERNO)
    # grid
    for x in range(0, col.shape[1], 50):
        cv2.line(col, (x, 0), (x, col.shape[0]), (0, 255, 0) if x % 100 == 0 else (0, 110, 0), 1)
    for y in range(0, col.shape[0], 50):
        cv2.line(col, (0, y), (col.shape[1], y), (0, 255, 0) if y % 100 == 0 else (0, 110, 0), 1)
    cv2.imwrite(f'out/rough_{nm}.jpg', col)
    np.save(f'out/rough_{nm}.npy', v)
print('ok')
