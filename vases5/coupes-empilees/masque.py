# masque.py: the reference's silhouette mask (out/lect/masque.png): GrabCut silhouette of mesure.py, cut under the foot
# (the table's reflection), and the per-ring label map (out/lect/anneaux.png: 1 cup, 2 fuchsia, 3 orange, 4 amber) from
# the measured interface lines
import sys, os, json, cv2, numpy as np
sys.path.insert(0, '..')
import mesure as M
im, _ = M.read('out/ref.jpg')
m = M.silhouette(im)
L = json.load(open('out/lect/lignes.json'))
prof = np.array(L['A_foot']['profile'], float)
H, W = m.shape
xs = np.arange(W)
yfoot = np.interp(xs, prof[:, 0], prof[:, 1])
# beyond the measured foot profile the cup's side is the boundary: cut at the profile's end rows
yy = np.arange(H)[:, None]
m &= yy <= yfoot[None, :] + .5
m &= yy <= 768
n, lb, st, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8))
m = lb == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
cv2.imwrite('out/lect/masque.png', m.astype(np.uint8) * 255)
line = lambda k: L[k]['a'] + L[k]['b'] * xs[None, :]
lab = np.zeros((H, W), np.uint8)
lab[m] = 1
lab[m & (yy < line('B_bot'))] = 2
lab[m & (yy < line('C_bot'))] = 3
lab[m & (yy < line('D_bot'))] = 4
cv2.imwrite('out/lect/anneaux.png', lab)
print('mask px', int(m.sum()), [int((lab == k).sum()) for k in range(1, 5)])
