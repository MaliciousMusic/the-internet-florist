# The reference's vase isolated (local, numbers and masks only stay in out/): out/vase_mask.png (the glass), out/stems_mask.png
# (the bouquet's stems seen inside the glass, left out of the colour comparison), out/ref_vase.png (the photograph with the
# vase as alpha, for mesure.py)
import numpy as np, cv2
im = cv2.imread('out/ref.jpg'); H, W = im.shape[:2]
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(int); h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(int)
chroma = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
teal = ((chroma > 7) & (h >= 70) & (h <= 115)) | (v < 70)
teal[:285] = 0
brown = (h < 35) & (s > 60) & (v < 200)                      # stems, buds and branches
white = (v > 215) & (chroma < 10)                           # petals
seed = cv2.morphologyEx(teal.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, cc, st, _ = cv2.connectedComponentsWithStats(seed)
seed = (cc == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
gc = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
gc[cv2.dilate(seed, np.ones((9, 9), np.uint8)) > 0] = cv2.GC_PR_FGD
gc[cv2.erode(seed, np.ones((7, 7), np.uint8)) > 0] = cv2.GC_FGD
gc[cv2.dilate(seed, np.ones((25, 25), np.uint8)) == 0] = cv2.GC_BGD
gc[brown & (cv2.erode(seed, np.ones((15, 15), np.uint8)) == 0)] = cv2.GC_BGD
gc[white & (np.arange(H)[:, None] < 360)] = cv2.GC_BGD
bg, fg = np.zeros((1, 65)), np.zeros((1, 65))
cv2.grabCut(im, gc, None, bg, fg, 5, cv2.GC_INIT_WITH_MASK)
m = ((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)).astype(np.uint8)
m[794:] = 0                                                  # the cast shadow on the floor
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, cc, st, _ = cv2.connectedComponentsWithStats(m)
m = (cc == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
m = np.zeros_like(m); cv2.drawContours(m, cs, -1, 1, -1)
m = (cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2) > .5).astype(np.uint8)
# the stems inside the glass: thin dark lines (black-hat), brownish or much darker than their surroundings
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
bh = cv2.morphologyEx(g, cv2.MORPH_BLACKHAT, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
stem = (bh > 28) & (m > 0) & (np.arange(H)[:, None] < 640) & ((h < 40) | (h > 160) | (s < 90))
stem = cv2.morphologyEx(stem.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
n, cc, st, _ = cv2.connectedComponentsWithStats(stem)
keep = np.zeros_like(stem)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] > 25 and max(st[i, cv2.CC_STAT_WIDTH], st[i, cv2.CC_STAT_HEIGHT]) > 15:
        keep[cc == i] = 1
# the stems in front of the glass and seen through it are brownish: hue of wood, inside the vase
wood = (m > 0) & (h < 32) & (s > 45) & (v < 210)
keep = keep | cv2.morphologyEx(wood.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
keep = cv2.dilate(keep, np.ones((3, 3), np.uint8))
cv2.imwrite('out/vase_mask.png', m * 255)
cv2.imwrite('out/stems_mask.png', keep * 255)
cv2.imwrite('out/cmp_mask.png', ((m > 0) & (keep == 0)).astype(np.uint8) * 255)
rgba = np.dstack([im, m * 255])
cv2.imwrite('out/ref_vase.png', rgba)
ov = im.copy(); ov[m > 0] = (ov[m > 0] * .55 + np.array([0, 0, 255]) * .45).astype(np.uint8); ov[keep > 0] = (0, 255, 0)
cv2.imwrite('out/_seg_ov.jpg', ov[270:830, 90:420])
print('vase px', int(m.sum()), 'stems px', int(keep.sum()))
