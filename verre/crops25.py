# Zoomed reading crops: CLAHE on lightness (keeps colour), grid in photo pixels, every 50 px labelled.
import numpy as np, cv2, sys
im = cv2.imread('out/ref.jpg')
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB)
cl = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(12, 12))
lab[:, :, 0] = cl.apply(lab[:, :, 0])
en = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
cv2.imwrite('out/clahe.jpg', en)
def crop(x0, y0, w, h, s, name, step=25):
    c = en[y0:y0 + h, x0:x0 + w]
    c = cv2.resize(c, (int(w * s), int(h * s)), interpolation=cv2.INTER_CUBIC)
    for x in range((x0 // step + 1) * step, x0 + w, step):
        px = int((x - x0) * s); big = x % 50 == 0
        cv2.line(c, (px, 0), (px, c.shape[0]), (0, 0, 255) if big else (0, 160, 255), 1)
        if True: cv2.putText(c, str(x), (px + 2, 12), cv2.FONT_HERSHEY_SIMPLEX, .4, (0, 0, 255), 1)
    for y in range((y0 // step + 1) * step, y0 + h, step):
        py = int((y - y0) * s); big = y % 50 == 0
        cv2.line(c, (0, py), (c.shape[1], py), (0, 0, 255) if big else (0, 160, 255), 1)
        if True: cv2.putText(c, str(y), (2, py - 2), cv2.FONT_HERSHEY_SIMPLEX, .4, (0, 0, 255), 1)
    cv2.imwrite(f'out/z_{name}.jpg', c, [cv2.IMWRITE_JPEG_QUALITY, 90])
if len(sys.argv) > 1:
    x0, y0, w, h = map(int, sys.argv[1:5]); s = float(sys.argv[5]); crop(x0, y0, w, h, s, sys.argv[6])
else:
    crop(0, 0, 1200, 1435, .75, 'full', 50)
