"""lum.py: luminance percentiles of the cloud pixels in a crop (photo or render on its sky), and the share of bright
pixels, to compare value structures. Cloud = pixels whose blue-red gap is well below the sky's of the same row.
  python decor/lum.py <img:x0,y0,x1,y1> [...]"""
import sys
import numpy as np
from PIL import Image
for a in sys.argv[1:]:
    path, box = a.rsplit(':', 1)
    im = np.asarray(Image.open(path).convert('RGB'), float)
    H, W, _ = im.shape
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    c = im[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    br = c[..., 2] - c[..., 0]
    sky = np.percentile(br, 95, axis=1, keepdims=True)  # bluest pixels of each row
    alpha = np.clip(1 - br / np.maximum(sky, 1), 0, 1)
    L = 0.299 * c[..., 0] + 0.587 * c[..., 1] + 0.114 * c[..., 2]
    m = alpha > 0.6
    v = L[m]
    p = np.percentile(v, [5, 25, 50, 75, 95])
    top = np.percentile(v, 97)
    print(f'{path.split("/")[-1]}: nuage {m.mean() * 100:.0f} % du cadre | L p5 {p[0]:.0f} p25 {p[1]:.0f} p50 {p[2]:.0f} p75 {p[3]:.0f} p95 {p[4]:.0f}'
          f' | part > 0.9 du sommet : {(v > 0.9 * top).mean() * 100:.0f} % | < 0.75 : {(v < 0.75 * top).mean() * 100:.0f} %')
