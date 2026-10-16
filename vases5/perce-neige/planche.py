# Board for the owner: reference | our SVG in the photograph's framing | the shop view (SVG), then close-ups at 1:1 and 300 %,
# with the acceptance figures of mesure.py.
import os, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'out')
ref = cv2.imread(os.path.join(OUT, 'ref.jpg')); svp = cv2.imread(os.path.join(OUT, 'shot_photo.png'))
sh = cv2.imread(os.path.join(OUT, 'shot_shop.png')); m = np.load(os.path.join(OUT, 'glb_shop_mask.npy'))
sh[~m] = (238, 238, 240)
ys, xs = np.where(m); shc = sh[ys.min() - 10:ys.max() + 11, xs.min() - 20:xs.max() + 21]
H = 900
f = lambda x: cv2.resize(x, (int(x.shape[1] * H / x.shape[0]), H), interpolation=cv2.INTER_AREA)
top = np.hstack([f(ref), f(svp), f(shc)])
# close-ups in the photograph's framing: the snowdrop's head and a stem foot, at 1:1 and 300 %
z1 = (slice(300, 600), slice(200, 500)); z3 = (slice(420, 520), slice(300, 400))
row = lambda a, b: np.hstack([a, np.full((a.shape[0], 8, 3), 255, np.uint8), b])
c1 = row(ref[z1], svp[z1]); c3 = row(cv2.resize(ref[z3], None, fx=3, fy=3, interpolation=cv2.INTER_NEAREST), cv2.resize(svp[z3], None, fx=3, fy=3, interpolation=cv2.INTER_NEAREST))
bot = np.hstack([c1, np.full((300, 16, 3), 255, np.uint8), c3])
bot = cv2.resize(bot, (top.shape[1], int(bot.shape[0] * top.shape[1] / bot.shape[1])))
board = np.vstack([top, np.full((10, top.shape[1], 3), 255, np.uint8), bot])
r = json.load(open(os.path.join(OUT, 'm_svgphoto', 'mesure_cmp.json')))
txt = 'SVG / photo : silhouette 0,980 | dE lisse %.1f (seuil 4) | SSIM lisse %.2f (0,80) | aretes %.2f/%.2f (0,75)' % (r['dE2000_lisse_mean'], r['ssim_lisse'], r['aretes_precision'], r['aretes_rappel'])
cv2.putText(board, txt, (12, 28), cv2.FONT_HERSHEY_SIMPLEX, .75, (0, 0, 200), 2)
for i, t in enumerate(('reference 063', 'SVG, cadrage photo', 'SVG, vue boutique')):
    cv2.putText(board, t, (12 + i * f(ref).shape[1], H - 14), cv2.FONT_HERSHEY_SIMPLEX, .7, (0, 0, 200), 2)
cv2.imwrite(os.path.join(OUT, 'planche.jpg'), board, [cv2.IMWRITE_JPEG_QUALITY, 90])
print(board.shape)
