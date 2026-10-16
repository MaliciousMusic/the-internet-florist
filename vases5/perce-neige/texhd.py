# The GLB's own texture rendered in the shop view at a higher definition (s times the working maps of glbkit maps ... shop),
# with its alpha: the image vtracer turns into paths. -> out/tex_shop_hd.png, out/tex_shop_hd.json (scale)
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import numpy as np, cv2, glbkit
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
s = float(sys.argv[1]) if len(sys.argv) > 1 else 2.0
C = json.load(open(os.path.join(OUT, 'glb_shop_cam.json')))
cam = dict(C['cam']); W, H = int(round(C['W'] * s)), int(round(C['H'] * s))
cam['fpx'] *= s; cam['cx'] *= s; cam['cy'] *= s
R = glbkit.Renderer(glbkit.Model(os.path.join(OUT, 'model.glb')))
r = R.render(cam, W, H, modes=(0,))
a = np.clip(r['albedo'][..., ::-1] * 255, 0, 255).astype(np.uint8)
rgba = np.dstack([a, (r['mask'] * 255).astype(np.uint8)])
ys, xs = np.where(r['mask']); pad = 4
y0, y1, x0, x1 = ys.min() - pad, ys.max() + pad + 1, xs.min() - pad, xs.max() + pad + 1
cv2.imwrite(os.path.join(OUT, 'tex_shop_hd.png'), rgba[y0:y1, x0:x1])
json.dump(dict(s=s, W=W, H=H, x0=int(x0), y0=int(y0), yfoot=int(ys.max() + 1)), open(os.path.join(OUT, 'tex_shop_hd.json'), 'w'))
print(W, H, 'crop', x1 - x0, y1 - y0)
