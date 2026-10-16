# field preview and measured comparison (no browser): python prev4.py [key=value ...]
#   -> out/prev4.png (the field over the reference's backdrop, RGBA) and out/mesure_cmp.* (mesure.py cmp)
import sys, json, subprocess, time
import numpy as np, cv2
import photo_model as P
P.OPT.update(dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a))
t0 = time.time()
f = P.field(int(P.F('k', 2)))
C = f['E'] + f['T'] * f['B']
k = f['k']; H, W = C.shape[0] // k, C.shape[1] // k
Cs = cv2.resize(C.astype(np.float32), (W, H), interpolation=cv2.INTER_AREA)
Ms = cv2.resize(f['M'].astype(np.float32), (W, H), interpolation=cv2.INTER_AREA) > .5
img = np.clip(Cs * 255, 0, 255).astype(np.uint8)[:, :, ::-1]
cv2.imwrite('out/prev4.png', np.dstack([img, Ms.astype(np.uint8) * 255]))
print('field %.1fs' % (time.time() - t0))
subprocess.run([sys.executable, '../mesure.py', 'cmp', 'out/ref_vase.png', 'out/prev4.png', '--mask', 'out/cmp_mask.png', '--out', 'out/'])
