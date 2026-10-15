# Reference reading aids: grid overlay, high-pass (difference of blurs) map, zoomed crops.
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageChops, ImageFont
src = sys.argv[1]; out = sys.argv[2]
im = Image.open(src).convert('RGB')
W, H = im.size
def grid(img, step=50, x0=0, y0=0, scale=1.0, col=(255, 0, 0)):
    d = ImageDraw.Draw(img)
    w, h = img.size
    xs = (x0 // step) * step
    x = xs
    while (x - x0) * scale < w:
        px = (x - x0) * scale
        if px >= 0:
            strong = x % (step * 2) == 0
            d.line([(px, 0), (px, h)], fill=col if strong else (255, 140, 0), width=1)
            if strong: d.text((px + 2, 2), str(x), fill=col)
        x += step
    y = (y0 // step) * step
    while (y - y0) * scale < h:
        py = (y - y0) * scale
        if py >= 0:
            strong = y % (step * 2) == 0
            d.line([(0, py), (w, py)], fill=col if strong else (255, 140, 0), width=1)
            if strong: d.text((2, py + 2), str(y), fill=col)
        y += step
    return img
g = grid(im.copy(), 50)
g.save(out + '/grid_full.jpg', quality=88)
gray = ImageOps.grayscale(im)
a = gray.filter(ImageFilter.GaussianBlur(1.2)); b = gray.filter(ImageFilter.GaussianBlur(6))
hp = ImageChops.subtract(a, b, scale=0.25, offset=128)
hp = ImageOps.autocontrast(hp, cutoff=1).convert('RGB')
grid(hp, 50).save(out + '/hp_full.jpg', quality=88)
# zoomed crops with grid in photo coordinates
crops = {'tl': (120, 0, 520, 450), 'tc': (420, 0, 820, 450), 'tr': (700, 0, 1100, 450),
         'ml': (120, 380, 520, 830), 'mc': (420, 380, 820, 830), 'mr': (700, 380, 1100, 830),
         'bl': (120, 780, 520, 1230), 'bc': (420, 780, 820, 1230), 'br': (700, 780, 1100, 1230),
         'base': (150, 1150, 1050, 1435)}
for k, (x0, y0, x1, y1) in crops.items():
    c = im.crop((x0, y0, x1, y1)); s = 2.0
    c = c.resize((int((x1 - x0) * s), int((y1 - y0) * s)), Image.LANCZOS)
    c = ImageOps.autocontrast(c, cutoff=0.5)
    grid(c, 25, x0, y0, s).save(out + f'/crop_{k}.jpg', quality=90)
print('ok', W, H)
