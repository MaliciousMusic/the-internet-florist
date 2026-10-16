# Albedo calibration against the photograph (owner's decision of 2026-10-16: colours set on measured targets, material by
# material). The photograph-framed field (python mk.py prev, res=1) carries, per pixel, the paint it shows (pid). For each
# paint, the medians of the linear colour of the photograph and of our render are compared on the pixels both agree are
# that paint (eroded, away from edges and highlights); the albedo multiplier of that paint is corrected by their ratio.
# Light, shadows and reflections stay computed: only the materials' colours move.
#   python calib.py [--reset]  -> calib.json (numbers only), and a table of the medians (CIELAB)
import sys, os, json
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
import mesure as M  # noqa: E402

NAMES = {0: 'glaze', 1: 'lips', 2: 'inside', 3: 'foot', 4: 'orange', 5: 'mauve', 6: 'pale', 7: 'tails', 8: 'crosier mauve',
         9: 'crosier cream'}
CF = os.path.join(HERE, 'calib.json')
cal = {} if '--reset' in sys.argv or not os.path.exists(CF) else json.load(open(CF))
ref, _ = M.read(os.path.join(HERE, 'out', 'ref.jpg'))
z = np.load(os.path.join(HERE, 'out', 'field_photo.npz'))
assert float(z['res']) == 1.0, 'run mk.py prev res=1 first'
pid = z['pid']; disp = z['disp']; cov = z['cov']
mref = cv2.imread(os.path.join(HERE, 'out', 'mask_ref.png'), 0) > 127
lin = lambda im: (np.clip(im, 0, 255) / 255.0) ** 2.2
R_ = lin(cv2.GaussianBlur(ref, (0, 0), 1.0)[..., ::-1].astype(np.float32))
D_ = lin(cv2.GaussianBlur(disp, (0, 0), 1.0))
labR, labD = M.to_lab(cv2.GaussianBlur(ref, (0, 0), 1.0)), M.to_lab(cv2.GaussianBlur(disp[..., ::-1].astype(np.uint8), (0, 0), 1.0))
damp = float(next((a.split('=')[1] for a in sys.argv if a.startswith('damp=')), .85))
print('%-14s %6s  %-20s %-20s %s' % ('paint', 'px', 'photo L a b', 'render L a b', 'multiplier'))
for p, name in NAMES.items():
    m = (pid == p) & (cov > .99) & mref
    m = cv2.erode(m.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) if m.sum() > 400 else m
    if m.sum() < 30:
        continue
    # leave out the specular highlights of both (the glaze's reflections are computed, not painted)
    Lr, Ld = labR[..., 0], labD[..., 0]
    keep = m & (Lr < np.percentile(Lr[m], 92)) & (Ld < np.percentile(Ld[m], 92))
    r = np.median(R_[keep], 0); d = np.median(D_[keep], 0)
    k = np.clip((r / np.maximum(d, 1e-4)) ** damp, .5, 2.0)
    old = np.array(cal.get(str(p), [1, 1, 1]), float)
    new = np.clip(old * k, .05, 12)
    cal[str(p)] = [round(float(v), 4) for v in new]
    print('%-14s %6d  %-20s %-20s %s' % (name, keep.sum(), np.round(np.median(labR[keep], 0), 1), np.round(np.median(labD[keep], 0), 1),
                                         cal[str(p)]))
json.dump(cal, open(CF, 'w'), indent=1)
