"""couleur.py: the colours of boxes of a photo, as shadow / middle / light (percentiles 20, 50, 85 of L*) and the median
chroma and hue, background excluded (L* < 6 or > 97). Numbers only (PROTOCOLE §3).

  python insectes/outils/couleur.py <photo> name=x0,y0,x1,y1 ..."""
import sys
import numpy as np
import cv2


def hexs(lab):
    p = np.uint8([[[lab[0] * 255 / 100, lab[1] + 128, lab[2] + 128]]])
    b = cv2.cvtColor(p, cv2.COLOR_LAB2BGR)[0, 0]
    return '#%02x%02x%02x' % (b[2], b[1], b[0])


im = cv2.imread(sys.argv[1])
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
lab[..., 0] *= 100 / 255; lab[..., 1] -= 128; lab[..., 2] -= 128
for a in sys.argv[2:]:
    n, b = a.split('='); x0, y0, x1, y1 = map(int, b.split(','))
    P = lab[y0:y1, x0:x1].reshape(-1, 3)
    P = P[(P[:, 0] > 6) & (P[:, 0] < 97)]
    if len(P) < 20: print(n, 'vide'); continue
    L = P[:, 0]; out = []
    for q in (20, 50, 85):
        v = np.percentile(L, q); s = P[np.abs(L - v) < 4]
        out.append(hexs([v, np.median(s[:, 1]), np.median(s[:, 2])]))
    C = np.hypot(P[:, 1], P[:, 2])
    print('%-10s ombre %s  milieu %s  lumiere %s   L %.0f  C %.0f  h %.0f  contraste %.2f' % (n, *out, np.median(L), np.median(C), np.degrees(np.arctan2(np.median(P[:, 2]), np.median(P[:, 1]))) % 360, L.std() / max(1, L.mean())))
