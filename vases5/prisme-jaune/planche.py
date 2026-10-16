# The comparison sheet: reference | our render in the reference's framing | shop view (alone, with stems, on dark),
# then close-ups at 1:1 and 300 %. Renders go through shot.sh (one headless Chrome at a time, behind the shared gate).
#   python planche.py [--norender]  ->  out/planche.jpg
import os, sys, subprocess
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
O = os.path.join(HERE, 'out')
import re
VB = [float(v) for v in re.search(r'viewBox="([^"]+)"', open(os.path.join(O, 'prisme_shop.svg')).read()).group(1).split()]
VBW, VBH = VB[2], VB[3]


def shot(svg, png, w, h):
    subprocess.run(['sh', os.path.join(HERE, 'shot.sh'), os.path.join(O, svg), os.path.join(O, png), str(w), str(h)], check=True)


if '--norender' not in sys.argv:
    shot('prisme_photo.svg', 'shot_photo.png', 1200, 1600)
    for name in ('shop', 'shop_stems', 'shop_dark', 'shop_stems_dark'):
        shot('prisme_%s.svg' % name, 'shot_%s_3.png' % name, round(VBW * 3), round(VBH * 3))
    shot('prisme_shop_stems.svg', 'shot_shop_stems_1.png', round(VBW), round(VBH))

rd = lambda n: cv2.imread(os.path.join(O, n))
ref = rd('ref.jpg')
ph = rd('shot_photo.png')
H1 = 900
crop = lambda im: im[260:1310, 330:870]        # the reference's framing, around the vase
a, b = crop(ref), crop(ph)
fit = lambda im, h: cv2.resize(im, (round(im.shape[1] * h / im.shape[0]), h), interpolation=cv2.INTER_AREA)
row1 = [fit(a, H1), fit(b, H1)]
for n in ('shot_shop_3.png', 'shot_shop_stems_3.png', 'shot_shop_stems_dark_3.png'):
    row1.append(fit(rd(n)[30:-10], H1))
pad = lambda im: cv2.copyMakeBorder(im, 0, 0, 0, 10, cv2.BORDER_CONSTANT, value=(255, 255, 255))
r1 = np.hstack([pad(x) for x in row1])
# close-ups: 1:1 (the shop at 100 %), and 300 % on the pocket's bottom and the girdle, and on the mouth
one = rd('shot_shop_stems_1.png')
s3 = rd('shot_shop_3.png')
h3, w3 = s3.shape[:2]
z1 = s3[int(h3 * .38):int(h3 * .62), int(w3 * .2):int(w3 * .8)]
z2 = s3[int(h3 * .06):int(h3 * .2), int(w3 * .25):int(w3 * .75)]
z3 = s3[int(h3 * .72):int(h3 * .97), int(w3 * .2):int(w3 * .8)]
H2 = 420
row2 = [fit(one, H2)[:, :] if False else cv2.copyMakeBorder(one, (H2 - one.shape[0]) // 2, H2 - one.shape[0] - (H2 - one.shape[0]) // 2, 20, 20,
                                                             cv2.BORDER_CONSTANT, value=(255, 255, 255))]
for z in (z1, z2, z3):
    row2.append(fit(z, H2))
r2 = np.hstack([pad(x) for x in row2])
W = max(r1.shape[1], r2.shape[1])
r1 = cv2.copyMakeBorder(r1, 0, 10, 0, W - r1.shape[1], cv2.BORDER_CONSTANT, value=(255, 255, 255))
r2 = cv2.copyMakeBorder(r2, 0, 0, 0, W - r2.shape[1], cv2.BORDER_CONSTANT, value=(255, 255, 255))
sheet = np.vstack([r1, r2])
if sheet.shape[1] > 2400:
    sheet = cv2.resize(sheet, (2400, round(sheet.shape[0] * 2400 / sheet.shape[1])), interpolation=cv2.INTER_AREA)
cv2.imwrite(os.path.join(O, 'planche.jpg'), sheet, [cv2.IMWRITE_JPEG_QUALITY, 90])
print('planche', sheet.shape)
