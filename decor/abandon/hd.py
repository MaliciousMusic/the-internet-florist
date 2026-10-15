"""hd.py: close-up pairs at the same scale: a reference photo in 1600 px (refcache/decor-nuages/hd/, never committed)
next to one cloud rendered alone over the sky colour of its height in the scene, scaled so that both clouds have the
same height in pixels (1:1 comparison of edges, fringes and modelling).

  python decor/hd.py <out.png> <photo>:<x0,y0,x1,y1> <cloud name> [...]     (boxes in fractions of the photo)"""
import sys, re, json, subprocess
import numpy as np
from PIL import Image


def cloud_height(a):
    """Height in px of the cloud in a photo crop: rows holding pixels much whiter than the sky of their row."""
    br = a[..., 2] - a[..., 0]
    al = np.clip(1 - br / np.maximum(np.percentile(br, 95, axis=1, keepdims=True), 1), 0, 1)
    ys = np.where((al > .5).any(axis=1))[0]
    return ys.max() - ys.min() + 1


def pair(photo, box, name):
    im = Image.open(photo).convert('RGB')
    x0, y0, x1, y1 = [float(v) for v in box.split(',')]
    ph = im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))
    hp = cloud_height(np.asarray(ph, float))
    svg = f'decor/out/nuage-{name}.svg'
    vw = float(re.search(r'viewBox="0 0 ([\d.]+) ', open(svg, encoding='utf-8').read()).group(1))
    subprocess.run(['node', 'decor/shot.mjs', svg, '--w', str(int(vw)), '--out', 'decor/out/png'], capture_output=True)
    al = np.asarray(Image.open(f'decor/out/png/nuage-{name}.png').convert('RGBA'))[..., 3] / 255
    yy = np.where((al > .5).any(axis=1))[0]
    sc = hp / (yy.max() - yy.min() + 1)
    # sky colour at the cloud's mid-height, read on the sky render (world frame)
    n = next(c for c in json.load(open('decor/out/scene.json', encoding='utf-8'))['nuages'] if c['src'] == f'nuage-{name}.svg')
    sky = Image.open('decor/out/ciel.png').convert('RGB')
    ymid = (n['y'] / 100 * 1350 + (yy.min() + yy.max()) / 2) / 1350 * sky.height
    bg = '#%02x%02x%02x' % sky.getpixel((sky.width // 2, int(ymid)))
    subprocess.run(['node', 'decor/shot.mjs', svg, '--w', str(int(vw * sc)), '--out', 'decor/out/hd', '--bg', bg], capture_output=True)
    r = Image.open(f'decor/out/hd/nuage-{name}.png').convert('RGB')
    if r.height > ph.height:
        r = r.crop((0, (r.height - ph.height) // 2, r.width, (r.height - ph.height) // 2 + ph.height))
    print(f'{name}: nuage photo {hp} px de haut, rendu a l echelle {sc:.2f}, ciel {bg}')
    return ph, r


if __name__ == '__main__':
    out, args = sys.argv[1], sys.argv[2:]
    rows = []
    for i in range(0, len(args), 2):
        path, box = args[i].rsplit(':', 1)
        rows.append(pair(path, box, args[i + 1]))
    W = max(a.width + b.width + 8 for a, b in rows)
    H = sum(max(a.height, b.height) + 8 for a, b in rows)
    board = Image.new('RGB', (W, H), (30, 30, 30))
    y = 0
    for a, b in rows:
        board.paste(a, (0, y))
        board.paste(b, (a.width + 8, y))
        y += max(a.height, b.height) + 8
    board.save(out)
    print(out, board.size)
