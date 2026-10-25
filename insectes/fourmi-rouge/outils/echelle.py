"""echelle.py: the scale of an AntWeb specimen photo, read on its scale bar (the longest dark horizontal run near the bottom),
and a millimetre grid laid over the photo to read landmarks by eye (PROTOCOLE §2: lengths in mm, never guessed).

  python insectes/fourmi-rouge/outils/echelle.py barre <photo> <bar mm>               -> px per mm
  python insectes/fourmi-rouge/outils/echelle.py grille <photo> <px/mm> <out.jpg> [--box x0,y0,x1,y1] [--pas 0.1] [--zoom 2]
The grid image holds photo pixels: it stays in refcache/ (never in git)."""
import sys
import numpy as np
from PIL import Image, ImageDraw


def barre(path, mm):
    g = np.asarray(Image.open(path).convert('L'), np.float32)
    h, w = g.shape
    best = (0, 0, 0)
    for y in range(int(h * 0.55), h):
        row = g[y] < 60
        # runs of dark pixels
        d = np.diff(np.concatenate([[0], row.astype(np.int8), [0]]))
        s, e = np.where(d == 1)[0], np.where(d == -1)[0]
        for a, b in zip(s, e):
            if b - a > best[0] and b - a < w * 0.6: best = (b - a, y, a)
    n, y, x = best
    print('barre %d px (y %d, x %d) -> %.1f px/mm' % (n, y, x, n / mm))
    return n / mm


def grille(path, k, out, box=None, pas=0.1, zoom=2):
    im = Image.open(path).convert('RGB')
    if box: im = im.crop(box)
    else: box = (0, 0, im.width, im.height)
    im = im.resize((im.width * zoom, im.height * zoom), Image.LANCZOS)
    D = ImageDraw.Draw(im, 'RGBA')
    K = k * zoom
    n = int(im.width / (K * pas)) + 1
    for i in range(n):
        x = i * K * pas
        major = i % 10 == 0
        D.line([(x, 0), (x, im.height)], fill=(0, 255, 255, 150 if major else 60), width=2 if major else 1)
        if major or i % 5 == 0: D.text((x + 2, 2), '%.1f' % (i * pas), fill=(255, 255, 0, 255))
    m = int(im.height / (K * pas)) + 1
    for j in range(m):
        y = j * K * pas
        major = j % 10 == 0
        D.line([(0, y), (im.width, y)], fill=(255, 0, 255, 150 if major else 60), width=2 if major else 1)
        if major or j % 5 == 0: D.text((2, y + 2), '%.1f' % (j * pas), fill=(255, 255, 0, 255))
    im.save(out, quality=90)
    print(out, im.size, 'origine photo', box[:2])


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'barre': barre(a[1], float(a[2]))
    else:
        box = tuple(int(v) for v in a[a.index('--box') + 1].split(',')) if '--box' in a else None
        pas = float(a[a.index('--pas') + 1]) if '--pas' in a else 0.1
        zoom = int(a[a.index('--zoom') + 1]) if '--zoom' in a else 2
        grille(a[1], float(a[2]), a[3], box, pas, zoom)
