# Triptych of one window: reference (enhanced) | tracing overlay | render, same scale.
# usage: python tri.py render.png x0 y0 w h scale name [figs]
import sys, subprocess, cv2, numpy as np
r, x0, y0, w, h, s, name = sys.argv[1], *map(float, sys.argv[2:7]), sys.argv[7]
figs = sys.argv[8] if len(sys.argv) > 8 else 'all'
subprocess.run([sys.executable, 'overlay.py', figs, str(x0), str(y0), str(w), str(h), str(s), '_t'], check=True, capture_output=True)
ov = cv2.imread('out/ov__t.jpg')
ref = cv2.imread('out/ref.jpg'); ren = cv2.imread(r)
def cr(im):
    c = im[int(y0):int(y0 + h), int(x0):int(x0 + w)]
    return cv2.resize(c, (ov.shape[1], ov.shape[0]), interpolation=cv2.INTER_CUBIC)
out = np.hstack([cr(ref), ov, cr(ren)])
cv2.imwrite(f'out/tri_{name}.jpg', out, [cv2.IMWRITE_JPEG_QUALITY, 88])
print(f'out/tri_{name}.jpg', out.shape)
