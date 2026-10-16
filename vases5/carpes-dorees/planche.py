# The comparison sheet: reference | our render in its framing | the shop's view, then 1:1 on light and dark grounds and 300 % close-ups.
#   python planche.py   (after mk.py photo, mk.py shop and the Chrome shots of work/)
import cv2
import numpy as np

W = 1600


def fit(im, w, h, bg=(236, 236, 234)):
    s = min(w / im.shape[1], h / im.shape[0])
    r = cv2.resize(im, (int(im.shape[1] * s), int(im.shape[0] * s)), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)
    out = np.full((h, w, 3), bg, np.uint8)
    y, x = (h - r.shape[0]) // 2, (w - r.shape[1]) // 2
    out[y:y + r.shape[0], x:x + r.shape[1]] = r
    return out


def label(im, txt):
    cv2.putText(im, txt, (10, 24), cv2.FONT_HERSHEY_SIMPLEX, .6, (40, 40, 40), 1, cv2.LINE_AA)
    return im


ref = cv2.imread('out/ref.jpg')
ph = cv2.imread('out/etude/shot_photo.png')
sh = cv2.imread('work/shot_shop.png')
w1 = W // 3
row1 = np.hstack([label(fit(ref, w1, 500), 'reference (privee)'), label(fit(ph, w1, 500), 'notre rendu, meme cadrage'),
                  label(fit(sh, W - 2 * w1, 500), 'vue boutique (lumiere de la boutique)')])
l11 = cv2.imread('work/shot_11.png'); d11 = cv2.imread('work/shot_11d.png')
c1 = np.full((300, 340, 3), 236, np.uint8); c1[12:12 + l11.shape[0], 13:13 + l11.shape[1]] = l11
c2 = np.full((300, 340, 3), 27, np.uint8); c2[12:12 + d11.shape[0], 13:13 + d11.shape[1]] = d11
label(c1, '1:1 fond clair')
cv2.putText(c2, '1:1 fond sombre', (10, 24), cv2.FONT_HERSHEY_SIMPLEX, .6, (220, 220, 220), 1, cv2.LINE_AA)
rest = W - 680
crops = [cv2.imread('work/%s.png' % n) for n in ('c_head', 'c_scales', 'c_tail')]
cw = rest // 3
row2 = np.hstack([c1, c2] + [label(fit(c, cw if i < 2 else rest - 2 * cw, 300), '300 %') for i, c in enumerate(crops)])
row3 = np.hstack([label(fit(cv2.imread('work/c_low.png'), W // 2, 340), '300 % : tete de la carpe du milieu'),
                  label(fit(cv2.imread('work/prev_shop.png'), W - W // 2, 340), 'champ calcule (cible du vectoriel)')])
import json, os
mc = cv2.imread('out/etude/mesure_cmp.jpg')
row4 = fit(mc, W, int(mc.shape[0] * W / mc.shape[1]), bg=(255, 255, 255))
J = json.load(open('out/etude/mesure_cmp.json'))
D = json.load(open('out/etude/decor_check.json')) if os.path.exists('out/etude/decor_check.json') else {}
G_ = json.load(open('out/etude/grain.json')) if os.path.exists('out/etude/grain.json') else {}
txt = ['Mesures au cadrage de la photo (mesure.py cmp, masque du vase) :',
       'silhouette IoU %.3f (seuil 0,97) | dE2000 lisse %.2f (<= 4) | ombre %.2f, demi-teinte %.2f, lumiere %.2f (<= 5) | SSIM lisse %.3f (>= 0,80), brute %.3f'
       % (J['silhouette_iou'], J['dE2000_lisse_mean'], J['zones']['ombre']['dE'], J['zones']['demi-teinte']['dE'], J['zones']['lumiere']['dE'],
          J.get('ssim_lisse', 0), J['ssim']),
       'aretes precision %.2f rappel %.2f (>= 0,75) | grain : ecart log %s (<= 0,15)' % (J['aretes_precision'], J['aretes_rappel'], G_.get('ecart_log_moyen', '-')),
       'decor (ecart max a la place mesuree, %% de la hauteur) : ' + ', '.join('%s %.2f' % (k, v['pct_max']) for k, v in D.items())]
pane = np.full((24 * len(txt) + 16, W, 3), 255, np.uint8)
for i, s in enumerate(txt):
    cv2.putText(pane, s, (10, 26 + 24 * i), cv2.FONT_HERSHEY_SIMPLEX, .55, (30, 30, 30), 1, cv2.LINE_AA)
sheet = np.vstack([row1, row2, row3, row4, pane])
cv2.imwrite('out/planche.jpg', sheet, [cv2.IMWRITE_JPEG_QUALITY, 88])
print(sheet.shape)
