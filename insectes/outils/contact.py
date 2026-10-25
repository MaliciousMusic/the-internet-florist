"""contact.py: one contact sheet of the registered HD photos of an insect (refs-organes.json), numbered and labelled.

  python insectes/outils/contact.py <sid> [--tile 300] [--cols 6]  -> refcache/<sid>/contact.jpg"""
import sys, os, json
from PIL import Image, ImageDraw
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'refcache')
a = sys.argv[1:]
sid = a[0]; tile = int(a[a.index('--tile') + 1]) if '--tile' in a else 300; cols = int(a[a.index('--cols') + 1]) if '--cols' in a else 6
reg = json.load(open(os.path.join(ROOT, sid, 'refs-organes.json'), encoding='utf-8'))['photos']
rows = (len(reg) + cols - 1) // cols
S = Image.new('RGB', (cols * tile, rows * (tile + 34)), '#222')
d = ImageDraw.Draw(S)
for k, p in enumerate(reg):
    im = Image.open(os.path.join(ROOT, '..', p['fichier'])).convert('RGB'); im.thumbnail((tile, tile))
    x, y = (k % cols) * tile, (k // cols) * (tile + 34)
    S.paste(im, (x + (tile - im.width) // 2, y + (tile - im.height) // 2))
    d.text((x + 3, y + tile + 2), 'c%03d %s' % (p['i'], '+'.join(p['organes']))[:48], fill='#ff0')
    d.text((x + 3, y + tile + 16), ('+'.join(p['vues']) + ' ' + p['qualite']['verdict'])[:48], fill='#0ff')
S.save(os.path.join(ROOT, sid, 'contact.jpg'), quality=85)
print(len(reg), 'photos')
