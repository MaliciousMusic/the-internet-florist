# quick preview of the computed field (no browser): python prev.py photo|shop [key=value ...] -> work/prev_<proj>.png
import sys, time
import numpy as np, cv2
import model as M
M.OPT.update(dict(a.split('=', 1) for a in sys.argv[2:] if '=' in a))
import render as Rn
proj = sys.argv[1] if len(sys.argv) > 1 else 'photo'
t0 = time.time()
cam = Rn.Cam(proj)
bufs = Rn.render(cam)
bg = np.array([.78, .79, .80]) if proj == 'photo' else np.array([248, 244, 238]) / 255
C, T, front, sig, any_ = Rn.composite(bufs, cam, bg)
img = np.clip(C * 255, 0, 255).astype(np.uint8)[:, :, ::-1]
out = ('out/prev_%s.png' if proj == 'photo' else 'work/prev_%s.png') % proj
if proj == 'photo':
    ref = cv2.imread('out/ref.jpg')
    ref = cv2.resize(ref, (cam.W, cam.H), interpolation=cv2.INTER_CUBIC)
    img = np.hstack([ref, img])
cv2.imwrite(out, img)
print('%d layers, %.1fs -> %s' % (len(bufs), time.time() - t0, out))
if proj == 'photo':
    # crop of the vase, both sides, at the work scale
    k = cam.k
    x0, y0, x1, y1 = [int(v * k) for v in (110, 280, 400, 810)]
    a = img[y0:y1, x0:x1]; b = img[y0:y1, cam.W + x0:cam.W + x1]
    cv2.imwrite('out/prev_crop.png', np.hstack([a, b]))
