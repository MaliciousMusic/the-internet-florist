"""sprites_pack.py: packs a bouquet's rendered images into WebP sheets for the page's PixiJS canvas (called by sprites.mjs).

  python sprites_pack.py <tmp dir> <out dir>   reads <tmp>/cells.json and its PNGs, writes <out>/frise.webp and
                                               <out>/proche-<n>.webp, prints {sheets, frames: [[sheet, x, y]], kb} as JSON

Shelf packing, tallest first, sheets of at most `sheet` pixels; one pixel of gap between images. WebP lossy with full-quality
alpha (the edges of petals stay clean)."""
import json, os, sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
meta = json.load(open(os.path.join(src, 'cells.json'), encoding='utf-8'))
S = meta['sheet']
Q = dict(quality=92, method=6, alpha_quality=100)


def crop(file, c):
    x, y, w, h = c
    return Image.open(os.path.join(src, file)).convert('RGBA').crop((x, y, x + w, y + h))


kb = {}
f = meta['frise']
im = crop(f['file'], f['crop'])
p = os.path.join(out, 'frise.webp')
im.save(p, 'WEBP', **Q)
kb['frise'] = os.path.getsize(p) // 1024

cells = meta['cells']
order = sorted(range(len(cells)), key=lambda i: -cells[i]['crop'][3])
place = [None] * len(cells)
sheets = []  # [[x, y, shelf_h, used_w, used_h]]
for i in order:
    w, h = cells[i]['crop'][2], cells[i]['crop'][3]
    if w > S or h > S:
        raise SystemExit(f'image {i} trop grande pour une planche : {w}x{h}')
    done = False
    for n, s in enumerate(sheets):
        if s[0] + w <= S and s[1] + h <= S:  # on the current shelf
            place[i] = (n, s[0], s[1])
            s[0] += w + 1
            s[2] = max(s[2], h)
            s[3] = max(s[3], s[0])
            s[4] = max(s[4], s[1] + h)
            done = True
            break
        if s[1] + s[2] + 1 + h <= S and w <= S:  # a new shelf below
            s[1] += s[2] + 1
            s[0], s[2] = 0, 0
            place[i] = (n, s[0], s[1])
            s[0] += w + 1
            s[2] = h
            s[3] = max(s[3], s[0])
            s[4] = max(s[4], s[1] + h)
            done = True
            break
    if not done:
        sheets.append([w + 1, 0, h, w + 1, h])
        place[i] = (len(sheets) - 1, 0, 0)

names = []
total = 0
for n, s in enumerate(sheets):
    sheet = Image.new('RGBA', (min(S, s[3]), min(S, s[4])), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        if place[i][0] == n:
            sheet.paste(crop(c['file'], c['crop']), (place[i][1], place[i][2]))
    name = f'proche-{n}.webp'
    p = os.path.join(out, name)
    sheet.save(p, 'WEBP', **Q)
    total += os.path.getsize(p)
    names.append(name)
kb['proche'] = total // 1024
print(json.dumps({'sheets': names, 'frames': [list(x) for x in place], 'kb': kb}))
