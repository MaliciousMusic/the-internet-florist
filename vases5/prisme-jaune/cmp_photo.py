# Measured comparison with the photograph, in its framing (vases5/mesure.py cmp): our render (the traced field, or the
# SVG as Chrome draws it) laid on the photograph's own backdrop outside the block's silhouette, the silhouettes given as
# alpha (measured mask for the photograph, the model's exact outline for the render).
#   python cmp_photo.py [field|svg] [out_dir]
import sys, os, json, subprocess
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(HERE, 'out')
src = sys.argv[1] if len(sys.argv) > 1 else 'field'
od = sys.argv[2] if len(sys.argv) > 2 else os.path.join(O, 'mesure')
ref = cv2.imread(os.path.join(O, 'ref.jpg'))
if src == 'field':
    f = cv2.imread(os.path.join(O, 'field_photo.png')); j = json.load(open(os.path.join(O, 'field_photo.json')))
    M = np.float32([[1 / j['res'], 0, j['x0'] + .5 / j['res'] - .5], [0, 1 / j['res'], j['y0'] + .5 / j['res'] - .5]])
    ren = cv2.warpAffine(f, M, (1200, 1600), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0))
else:
    ren = cv2.imread(os.path.join(O, 'shot_photo.png'))
mm = cv2.imread(os.path.join(O, 'mask_model.png'), 0)
mr = cv2.imread(os.path.join(O, 'mask_ref.png'), 0)
a = (mm.astype(np.float32) / 255)[..., None]
comp = (ren * a + ref * (1 - a)).astype(np.uint8)
cv2.imwrite(os.path.join(O, '_ren_rgba.png'), np.dstack([comp, mm]))
cv2.imwrite(os.path.join(O, '_ref_rgba.png'), np.dstack([ref, mr]))
subprocess.run([sys.executable, os.path.join(HERE, '..', 'mesure.py'), 'cmp', os.path.join(O, '_ref_rgba.png'), os.path.join(O, '_ren_rgba.png'),
                '--mask', os.path.join(O, 'mask_ref.png'), '--out', od])
