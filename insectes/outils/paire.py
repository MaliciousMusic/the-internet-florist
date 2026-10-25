"""paire.py: a photo | render pair at the same height (PROTOCOLE §5.1), with the median colour and contrast of each half.

  python insectes/outils/paire.py <photo> <x0,y0,x1,y1 px> <render.png> <out.jpg> [--h 700] [--flip]

The pair stays in refcache/ when it shows a photo (never in git). --flip mirrors the photo (a right-facing insect against
a left-facing render)."""
import sys
import numpy as np
from PIL import Image, ImageOps


def stats(im):
    a = np.asarray(im.convert('L'), dtype=np.float32)
    return a.std() / max(1, a.mean())


def main():
    a = sys.argv[1:]
    H = int(a[a.index('--h') + 1]) if '--h' in a else 700
    photo, box, render, out = a[0], [int(v) for v in a[1].split(',')], a[2], a[3]
    p = Image.open(photo).convert('RGB').crop(box)
    if '--flip' in a: p = ImageOps.mirror(p)
    r = Image.open(render).convert('RGB')
    p = p.resize((round(p.width * H / p.height), H), Image.LANCZOS)
    r = r.resize((round(r.width * H / r.height), H), Image.LANCZOS)
    m = Image.new('RGB', (p.width + r.width + 12, H), '#efe9df')
    m.paste(p, (0, 0)); m.paste(r, (p.width + 12, 0))
    m.save(out, quality=90)
    print(out, m.size, 'contraste photo %.2f rendu %.2f' % (stats(p), stats(r)))


if __name__ == '__main__':
    main()
