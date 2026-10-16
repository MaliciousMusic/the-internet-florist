# The comparison sheet (local; the reference stays in out/): reference | the SVG in the reference's frame over the reference's
# own backdrop | dE2000 map | the shop's view | with stems, then the shop view at 1:1, two 300 % close-ups, a dark shop; the
# acceptance numbers of mesure.py printed on it.
import json
import numpy as np, cv2
H1, H2 = 600, 470
def fit(im, h):
    return cv2.resize(im, (int(round(im.shape[1] * h / im.shape[0])), h), interpolation=cv2.INTER_AREA)
def lab(im, t):
    im = im.copy(); cv2.rectangle(im, (0, 0), (im.shape[1], 22), (255, 255, 255), -1)
    cv2.putText(im, t, (6, 16), cv2.FONT_HERSHEY_SIMPLEX, .45, (40, 40, 40), 1, cv2.LINE_AA); return im
ref = cv2.imread('out/ref.jpg'); rp = cv2.imread('out/render_photo.png', cv2.IMREAD_UNCHANGED)
B = np.load('out/bg.npy'); a = rp[..., 3:4] / 255.0
rp = (rp[..., :3] * a + B * (1 - a)).astype(np.uint8)
board = cv2.imread('out/mesure_cmp.jpg'); w5 = board.shape[1] // 5; heat = board[:, 2 * w5:3 * w5]
sh = cv2.imread('work/shot_shop.png'); bl = cv2.imread('work/bq_light.png'); bd = cv2.imread('work/bq_dark.png')
cr = lambda im: im[270:820, 110:400]
row1 = [lab(fit(cr(ref), H1), 'reference 087'), lab(fit(cr(rp), H1), 'SVG, meme cadrage'), lab(fit(heat[150:590, 60:290], H1), 'dE2000'),
        lab(fit(sh, H1), 'vue boutique'), lab(fit(bl, H1), 'avec tiges')]
one = cv2.resize(sh, (sh.shape[1] // 3, sh.shape[0] // 3), interpolation=cv2.INTER_AREA)
c1 = sh[0:H2, 260:260 + H2]; c2 = sh[960:960 + H2, 200:200 + H2]
row2 = [lab(fit(one, H2), '1:1'), lab(c1, '300 % : haut'), lab(c2, '300 % : panse'), lab(fit(bd, H2), 'fond sombre')]
def hrow(ims, h):
    return np.hstack([np.vstack([i, np.full((h - i.shape[0], i.shape[1], 3), 238, np.uint8)]) if i.shape[0] < h else i[:h] for i in ims])
r1 = hrow(row1, H1); r2 = hrow(row2, H2)
W = max(r1.shape[1], r2.shape[1])
padw = lambda r: np.hstack([r, np.full((r.shape[0], W - r.shape[1], 3), 238, np.uint8)])
m = json.load(open('out/mesure_cmp_final.json'))
z = m['zones']
txt1 = 'IoU %.3f (>=0.97)   dE2000 lisse %.2f (<=4)   ombre %.1f  demi-teinte %.1f  lumiere %.1f (<=5)' % (
    m['silhouette_iou'], m['dE2000_lisse_mean'], z['ombre']['dE'], z['demi-teinte']['dE'], z['lumiere']['dE'])
txt2 = 'SSIM %.3f (>=0.80)   aretes precision %.2f rappel %.2f (>=0.75)   grain ecart log 0.24 col / 0.63 panse (<=0.15)' % (
    m['ssim'], m['aretes_precision'], m['aretes_rappel'])
bar = np.full((52, W, 3), 255, np.uint8)
cv2.putText(bar, txt1, (8, 20), cv2.FONT_HERSHEY_SIMPLEX, .55, (20, 20, 20), 1, cv2.LINE_AA)
cv2.putText(bar, txt2, (8, 44), cv2.FONT_HERSHEY_SIMPLEX, .55, (20, 20, 20), 1, cv2.LINE_AA)
out = np.vstack([bar, padw(r1), np.full((6, W, 3), 238, np.uint8), padw(r2)])
if out.shape[1] > 1600:
    out = cv2.resize(out, (1600, int(out.shape[0] * 1600 / out.shape[1])), interpolation=cv2.INTER_AREA)
cv2.imwrite('out/planche.jpg', out, [cv2.IMWRITE_JPEG_QUALITY, 90]); print(out.shape)
