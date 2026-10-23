"""grille.py: a photo with a labelled pixel grid, to read the positions of the landmarks of an insect (PROTOCOLE §2).

  python insectes/outils/grille.py <photo> <out.jpg> [--pas 100] [--box x0,y0,x1,y1] [--w 1400]

Coordinates printed on the grid are those of the full photo. The output stays in refcache/."""
import sys
from PIL import Image, ImageDraw


def main():
    a = sys.argv[1:]
    pas = int(a[a.index('--pas') + 1]) if '--pas' in a else 100
    W = int(a[a.index('--w') + 1]) if '--w' in a else 1400
    im = Image.open(a[0]).convert('RGB')
    x0, y0, x1, y1 = [int(v) for v in a[a.index('--box') + 1].split(',')] if '--box' in a else (0, 0, im.width, im.height)
    im = im.crop((x0, y0, x1, y1))
    s = W / im.width
    im = im.resize((W, round(im.height * s)), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    for X in range((x0 // pas + 1) * pas, x1, pas):
        x = (X - x0) * s
        d.line([(x, 0), (x, im.height)], fill=(0, 255, 255) if X % (pas * 5) else (255, 0, 255), width=1)
        d.text((x + 2, 2), str(X), fill=(255, 255, 0))
    for Y in range((y0 // pas + 1) * pas, y1, pas):
        y = (Y - y0) * s
        d.line([(0, y), (im.width, y)], fill=(0, 255, 255) if Y % (pas * 5) else (255, 0, 255), width=1)
        d.text((2, y + 2), str(Y), fill=(255, 255, 0))
    im.save(a[1], quality=88)
    print(a[1], im.size)


if __name__ == '__main__':
    main()
