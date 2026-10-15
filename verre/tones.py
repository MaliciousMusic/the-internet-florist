import sys
sys.argv = ['mk2.py', 'photo']; sys.path.insert(0, '.')
import numpy as np, cv2, mk2
f = mk2.figure_masks(); fig = np.zeros((1435, 1200), bool)
for k in f: fig |= f[k]
sil = mk2.mk.poly_mask(mk2.mk.silhouette_pts(), 1.0, (1435, 1200), n=1)
yy = np.mgrid[0:1435, 0:1200][0]
top = (yy > 220) & (yy < 880)
for nm in sys.argv_files if hasattr(sys, 'argv_files') else []: pass
import os
for nm in os.environ['IMS'].split(','):
    im = cv2.imread('out/' + nm)[:, :, ::-1].astype(float)
    Y = im @ [.3, .59, .11]
    for lab, m in (('fig', fig & top), ('ground', sil & ~fig & top)):
        print('%-8s %-6s Y %s  mean %s' % (nm, lab, np.percentile(Y[m], [5, 25, 50, 75, 95]).round(), im[m].mean(0).round()))
