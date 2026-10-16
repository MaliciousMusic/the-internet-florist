# Depth and normal maps of a reference photograph, by a local monocular depth estimator (Depth Anything V2, run on the CPU in
# vases5/.venv-depth, decided by the owner on 2026-10-16). The maps are measuring guides, like the owner's maps of the glass
# dancers: they stay in the workshop's out/ folder with the photograph and are fitted to our measured geometry before use.
#   .venv-depth/Scripts/python depth.py <vase> [--model base|large] [--size 756]
#   -> <vase>/out/depth.npy (relative inverse depth, float32, photo pixels), depth16.png, normal.png (RGB = x right, y up, z to eye),
#      depth_viz.jpg (photo | depth | normals)
import sys, os
import numpy as np, cv2, torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForDepthEstimation

HERE = os.path.dirname(os.path.abspath(__file__))
A = sys.argv[1:]
opt = lambda k, d: A[A.index(k) + 1] if k in A else d
vase = A[0]
name = {'small': 'depth-anything/Depth-Anything-V2-Small-hf', 'base': 'depth-anything/Depth-Anything-V2-Base-hf',
        'large': 'depth-anything/Depth-Anything-V2-Large-hf'}[opt('--model', 'base')]
size = int(opt('--size', 756))
torch.set_num_threads(max(1, (os.cpu_count() or 4) // 2))      # leave half the cores to the PC

out = os.path.join(HERE, vase, 'out')
img = Image.open(os.path.join(out, 'ref.jpg')).convert('RGB')
W, H = img.size
proc = AutoImageProcessor.from_pretrained(name)
model = AutoModelForDepthEstimation.from_pretrained(name).eval()


def infer(im):
    inp = proc(images=im, return_tensors='pt', size={'height': size // 14 * 14, 'width': int(size * im.size[0] / im.size[1]) // 14 * 14},
               do_resize=True, keep_aspect_ratio=False)
    with torch.no_grad():
        d = model(**inp).predicted_depth[0].numpy()
    return cv2.resize(d, (im.size[0], im.size[1]), interpolation=cv2.INTER_CUBIC)


# test-time augmentation: the photograph and its mirror, averaged (steadier relief, no left/right bias)
d = (infer(img) + infer(img.transpose(Image.FLIP_LEFT_RIGHT))[:, ::-1]) / 2
d = d.astype(np.float32)
np.save(os.path.join(out, 'depth.npy'), d)
dn = (d - d.min()) / (np.ptp(d) + 1e-9)
cv2.imwrite(os.path.join(out, 'depth16.png'), (dn * 65535).astype(np.uint16))
# normals from the depth gradient (inverse depth grows toward the eye), relief scaled on the object's own depth range (2-98 %),
# the silhouette steps (object against the backdrop) clamped so they do not swamp the modelling inside
k = float(opt('--k', 160.0))
lo, hi = np.percentile(d, [2, 98])
ds = cv2.GaussianBlur((d - lo) / (hi - lo + 1e-9), (0, 0), 1.5) * k * max(W, H) / 1000
gy, gx = np.gradient(ds)
g = np.hypot(gx, gy); cap = np.percentile(g, 97)
s = np.where(g > cap, cap / (g + 1e-9), 1.0)
n = np.dstack([-gx * s, gy * s, np.ones_like(gx)])
n /= np.linalg.norm(n, axis=2, keepdims=True)
nrm = ((n * .5 + .5) * 255).astype(np.uint8)
cv2.imwrite(os.path.join(out, 'normal.png'), nrm[..., ::-1])
ph = cv2.imread(os.path.join(out, 'ref.jpg'))
dv = cv2.applyColorMap((dn * 255).astype(np.uint8), cv2.COLORMAP_TURBO)
f = lambda x: cv2.resize(x, (int(x.shape[1] * 700 / x.shape[0]), 700), interpolation=cv2.INTER_AREA)
cv2.imwrite(os.path.join(out, 'depth_viz.jpg'), np.hstack([f(ph), f(dv), f(nrm[..., ::-1])]), [cv2.IMWRITE_JPEG_QUALITY, 88])
print(vase, name.split('/')[-1], 'depth', d.shape, 'range %.3f..%.3f' % (d.min(), d.max()))
