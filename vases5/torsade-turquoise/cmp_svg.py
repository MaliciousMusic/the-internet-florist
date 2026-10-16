# The SVG itself, measured against the reference: rendered by Chrome on black and on white (shot.sh, through the gate), its
# colour and coverage recovered from the two, laid over the reference's own backdrop (out/bg.npy), then mesure.py cmp.
#   python cmp_svg.py [svg]  ->  out/render_photo.png (RGBA), out/mesure_cmp.jpg, out/mesure_cmp.json
import sys, subprocess
import numpy as np, cv2
svg = sys.argv[1] if len(sys.argv) > 1 else 'out/mk_photo.svg'
for bg, png in (('#000000', 'work/_cb.png'), ('#ffffff', 'work/_cw.png')):
    subprocess.run(['sh', 'shot.sh', svg, png, '711', '1268', bg], check=True)
cb = cv2.imread('work/_cb.png').astype(np.float32); cw = cv2.imread('work/_cw.png').astype(np.float32)
cb = cv2.resize(cb, (474, 845), interpolation=cv2.INTER_AREA); cw = cv2.resize(cw, (474, 845), interpolation=cv2.INTER_AREA)
a = np.clip(1 - (cw - cb).mean(2) / 255, 0, 1)
B = np.load('out/bg.npy')
C = cb + (1 - a[..., None]) * B
cov = cv2.imread('out/vase_mask.png', 0)          # placeholder size
alpha = (a > .02).astype(np.uint8) * 255
cv2.imwrite('out/render_photo.png', np.dstack([np.clip(C, 0, 255).astype(np.uint8), alpha]))
subprocess.run([sys.executable, '../mesure.py', 'cmp', 'out/ref_vase.png', 'out/render_photo.png', '--mask', 'out/cmp_mask.png', '--out', 'out/'])
