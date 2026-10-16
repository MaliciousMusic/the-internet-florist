# calib.py [n] [key=value ...]: spectrographic calibration of the four tints. Renders the photo-framed field, compares the
# median linear colour of each ring with the reference's (same masks), and moves each absorption coefficient by the log
# ratio over an effective path; n rounds. Writes the result to out/lect/alphas.txt (a0=.. a1=.. a2=.. a3=..)
import sys, os, subprocess, json, cv2, numpy as np
n = int(sys.argv[1]) if len(sys.argv) > 1 else 3
extra = sys.argv[2:]
names = ['citron', 'fuchsia', 'orange', 'ambre']
A = {'a0': '.035,.03,.3', 'a1': '.03,.55,.26', 'a2': '.02,.33,1.5', 'a3': '.012,.045,.17'}
if os.path.exists('out/lect/alphas.txt'):
    A.update(dict(kv.split('=') for kv in open('out/lect/alphas.txt').read().split()))
for kv in extra:
    k, v = kv.split('=')
    if k in A:
        A[k] = v
LEFF = 5.0
DAMP = .5
ref = cv2.imread('out/ref.jpg')
lin = lambda im: (im[..., ::-1].astype(np.float64) / 255) ** 2.2
for it in range(n):
    subprocess.run(['python', 'mk.py', 'photo', 'res=.5', 'ss=1', 'emit=0'] + ['%s=%s' % kv for kv in A.items()] +
                   [e for e in extra if e.split('=')[0] not in A], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['python', 'spec.py'], check=True, stdout=subprocess.DEVNULL)
    can = cv2.imread('out/field_full.png')
    rep = []
    for i, nm in enumerate(names):
        k = cv2.imread('out/lect/m_%s.png' % nm, 0) > 127
        r, o = lin(ref)[k].mean(0), lin(can)[k].mean(0)
        a = np.array([float(v) for v in A['a%d' % i].split(',')])
        a = np.clip(a + DAMP * np.log(np.maximum(o, 1e-3) / np.maximum(r, 1e-3)) / LEFF, .001, 4)
        A['a%d' % i] = ','.join('%.4f' % v for v in a)
        rep.append('%s ref %s nous %s' % (nm, np.round(r ** (1 / 2.2) * 255).astype(int), np.round(o ** (1 / 2.2) * 255).astype(int)))
    print('round', it, ' | '.join(rep), flush=True)
open('out/lect/alphas.txt', 'w').write(' '.join('%s=%s' % kv for kv in A.items()))
print(' '.join('%s=%s' % kv for kv in A.items()))
