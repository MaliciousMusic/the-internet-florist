"""atlas.py: packs the baked cells of an insect into one WebP atlas per level of detail, and writes its index.

  python atlas.py <atlas dir> <name>     reads <dir>/cells.json and <dir>/cells/*.png
                                         writes <dir>/<name>-S.webp, <name>-L.webp and <dir>/<name>.json

Cells are baked at twice their size and reduced here with premultiplied alpha (no dark fringe on the hairs).
Every cell keeps its full square so that the insect's origin stays at the cell centre."""
import json, os, sys, math
import numpy as np
from PIL import Image

d, name = sys.argv[1], sys.argv[2]
meta = json.load(open(os.path.join(d, 'cells.json'), encoding='utf-8'))
MAX = 2048


def reduce(path, size):
    im = np.asarray(Image.open(path).convert('RGBA')).astype(np.float32) / 255
    a = im[..., 3:4]
    pre = np.concatenate([im[..., :3] * a, a], axis=2)
    small = np.stack([np.asarray(Image.fromarray(pre[..., c]).resize((size, size), Image.LANCZOS)) for c in range(4)], axis=2)
    small = np.clip(small, 0, 1)
    al = small[..., 3:4]
    rgb = np.where(al > 1e-4, small[..., :3] / np.maximum(al, 1e-4), 0)
    return Image.fromarray((np.concatenate([np.clip(rgb, 0, 1), al], axis=2) * 255 + 0.5).astype(np.uint8), 'RGBA')


index = {'span': meta['span'], 'light': meta['light'], 'el': meta['el'], 'frames': meta['frames'], 'lod': {}}
for lod, L in meta['lod'].items():
    cells = [c for c in meta['cells'] if c['lod'] == lod]
    cs = L['cell']
    cols = MAX // cs
    rows = math.ceil(len(cells) / cols)
    if rows * cs > MAX:
        sys.exit(f'{lod}: {len(cells)} cells of {cs} px do not fit in {MAX} px')
    sheet = Image.new('RGBA', (cols * cs, rows * cs), (0, 0, 0, 0))
    keys = {}
    for i, c in enumerate(cells):
        x, y = (i % cols) * cs, (i // cols) * cs
        sheet.paste(reduce(os.path.join(d, 'cells', c['file']), cs), (x, y))
        keys[f"{c['pose']}/{c['f']}/{c['az']}/{c['el']}"] = i
    f = f'{name}-{lod}.webp'
    sheet.save(os.path.join(d, f), 'WEBP', quality=90, alpha_quality=100, method=6)
    index['lod'][lod] = {'file': f, 'cell': cs, 'cols': cols, 'w': sheet.width, 'h': sheet.height, 'az': L['az'], 'poses': L['poses'], 'keys': keys}
    kb = os.path.getsize(os.path.join(d, f)) / 1024
    print(f'{lod}: {len(cells)} cells, {sheet.width}x{sheet.height}, {kb:.0f} KB, {sheet.width * sheet.height * 4 / 2**20:.1f} MB on the GPU')
json.dump(index, open(os.path.join(d, name + '.json'), 'w', encoding='utf-8', newline='\n'), separators=(',', ':'))
