"""sculpture.py: the period and the direction of the rugae of a cuticle patch (PROTOCOLE §3: the sculpture measured, never drawn by
eye), by the spectrum of the patch's lightness (its strongest peak away from the centre), in mm on an AntWeb photo of known scale.

  python insectes/fourmi-rouge/outils/sculpture.py <photo> <px/mm> <x0,y0,x1,y1 mm> [--nom n]
Prints the period (mm), the direction of the ridges (degrees from the photo's x axis), their contrast (std of L* across them) and the
share of the spectrum's energy in the peak's direction (1 = parallel striae, low = a reticulate mesh)."""
import sys
import numpy as np
from PIL import Image


def main():
    a = sys.argv[1:]
    img, k = a[0], float(a[1]); x0, y0, x1, y1 = [float(v) for v in a[2].split(',')]
    nom = a[a.index('--nom') + 1] if '--nom' in a else ''
    g = np.asarray(Image.open(img).convert('L'), np.float32)
    p = g[int(y0 * k):int(y1 * k), int(x0 * k):int(x1 * k)]
    # flatten the form shading: the lightness minus its blur at 0.06 mm
    from scipy import ndimage
    hp = p - ndimage.gaussian_filter(p, 0.06 * k)
    hp *= np.outer(np.hanning(hp.shape[0]), np.hanning(hp.shape[1]))
    F = np.abs(np.fft.fftshift(np.fft.fft2(hp))) ** 2
    h, w = F.shape; cy, cx = h // 2, w // 2
    Y, X = np.mgrid[:h, :w]; fy = (Y - cy) / h; fx = (X - cx) / w
    fr = np.hypot(fx, fy) * k  # cycles per mm
    band = (fr > 1 / 0.2) & (fr < 1 / 0.012)
    i = np.argmax(np.where(band, F, 0)); py, px = np.unravel_index(i, F.shape)
    f0 = fr[py, px]; ang = np.degrees(np.arctan2(fy[py, px], fx[py, px]))
    # energy within 20 degrees of the peak's direction, in the band
    th = np.degrees(np.arctan2(fy, fx)); d = np.abs(((th - ang + 90) % 180) - 90)
    share = F[band & (d < 20)].sum() / F[band].sum()
    print('%-14s periode %.4f mm  cretes a %+.0f deg  contraste %.1f  ordre %.2f' % (nom, 1 / f0, (ang + 180) % 180 - 90, hp.std(), share))


if __name__ == '__main__':
    main()
