# spec.py: the field (out/field_photo.png) laid in the photograph's frame (out/field_full.png, white backdrop), then the
# CIELAB medians per ring, ours against the reference's (same masks)
import sys, json, cv2, numpy as np
sys.path.insert(0, '..')
import mesure as M
f = cv2.imread('out/field_photo.png'); m = json.load(open('out/field_photo.json'))
can = np.full((933, 700, 3), 255, np.uint8)
s = 1 / m['res']
fr = cv2.resize(f, None, fx=s, fy=s, interpolation=cv2.INTER_LINEAR)
x0, y0 = int(round(m['x0'])), int(round(m['y0']))
xa, ya = max(0, x0), max(0, y0); xb, yb = min(700, x0 + fr.shape[1]), min(933, y0 + fr.shape[0])
can[ya:yb, xa:xb] = fr[ya - y0:yb - y0, xa - x0:xb - x0]
cv2.imwrite('out/field_full.png', can)
ref = cv2.imread('out/ref.jpg')
lr, lf = M.to_lab(ref), M.to_lab(can)
tot = []
for n in ('ambre', 'orange', 'fuchsia', 'citron'):
    k = cv2.imread('out/lect/m_%s.png' % n, 0) > 127
    a, b = np.median(lr[k], 0), np.median(lf[k], 0)
    pa, pb = np.percentile(lr[k][:, 0], [10, 90]), np.percentile(lf[k][:, 0], [10, 90])
    de = M.de2000(M.to_lab(cv2.GaussianBlur(ref, (0, 0), 2))[k], M.to_lab(cv2.GaussianBlur(can, (0, 0), 2))[k]).mean()
    tot.append(de)
    print('%-8s ref L%5.1f a%6.1f b%6.1f (L10-90 %4.0f-%3.0f) | nous L%5.1f a%6.1f b%6.1f (L10-90 %4.0f-%3.0f) | dE %.1f' % (n, *a, *pa, *b, *pb, de))
print('dE moyen %.2f' % np.mean(tot))
