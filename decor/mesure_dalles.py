"""mesure_dalles.py: numbers measured on the renders of the stepping stones, against decor/refs/dalles.md and lave.md.

  python decor/mesure_dalles.py [--seed 7]

Renders (resvg, through decor/shot.mjs, whole frame, no crop) the path alone, its stones alone, its grass alone and its
ground alone (over the provisional meadow), at 1.8 px per unit (the phone), then reads them with the projected
outlines of decor/out/chemin.json:
  - per stone: size, pitch, gap, exposed side / width, apparent h/l of the top;
  - top: mean, median and quartiles of the colour, share of dark pits (L < .55 x median), value spread between stones;
  - side: mean colour, side / top ratio (sRGB value and linear light);
  - grass: share of the outline bitten (grass over the 3 px band inside the edge), overhang on the top (% of width);
  - ground: cast shadow / lit meadow, visible crescent width.
"""
import json
import os
import subprocess
import sys
import numpy as np
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'decor')
OUT = os.path.join(D, 'out', 'd2', 'mes')
SC = 1.8
MEADOW = (0x4E, 0x6A, 0x26)


def run(*a):
    return subprocess.run(['node', *a], cwd=ROOT, capture_output=True, text=True, encoding='utf-8').stdout.strip()


def render(parts, seed, bg=None):
    svg = os.path.join(OUT, f'chemin-{parts}.svg')
    run('decor/dalles.mjs', '--seed', str(seed), '--parts', parts, '--out', svg)
    if bg:
        s = open(svg, encoding='utf-8').read()
        s = s.replace('<g id="chemin">', f'<rect width="2400" height="1350" fill="{bg}"/><g id="chemin">', 1)
        open(svg, 'w', encoding='utf-8').write(s)
    line = run('decor/shot.mjs', svg, '--w', str(int(2400 * SC)), '--out', OUT)
    return np.asarray(Image.open(svg[:-4] + '.png').convert('RGBA'), float), line


def mask(poly, shape):
    m = Image.new('L', (shape[1], shape[0]), 0)
    ImageDraw.Draw(m).polygon([(x * SC, y * SC) for x, y in poly], fill=255)
    return np.asarray(m) > 127


def lum(c):
    return 0.299 * c[..., 0] + 0.587 * c[..., 1] + 0.114 * c[..., 2]


def lin(c):
    c = np.asarray(c, float) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def hexs(c):
    return '#%02x%02x%02x' % tuple(int(round(v)) for v in c[:3])


def erode(m, k):
    out = m.copy()
    for dy in range(-k, k + 1):
        for dx in range(-k, k + 1):
            out &= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def main():
    seed = int(sys.argv[sys.argv.index('--seed') + 1]) if '--seed' in sys.argv else 7
    os.makedirs(OUT, exist_ok=True)
    run('decor/dalles.mjs', '--seed', str(seed), '--json', '--log')
    meta = json.load(open(os.path.join(D, 'out', 'chemin.json'), encoding='utf-8'))
    full, line_full = render('all', seed)
    stone, _ = render('stone', seed)
    grass, _ = render('grass', seed)
    ground, _ = render('shadow', seed, bg='#%02x%02x%02x' % MEADOW)
    print('poids et rendu :', line_full.split(': ', 1)[1].split(' -> ')[0], f'(rendu à {SC} px/unité)')
    shape = stone.shape[:2]
    tops = []
    prev = None
    print('\ndalle  l×p (cm)  tranche/l  h/l dessus  pas  écart | dessus moyen  médiane  p10   p90   creux | tranche moy.  tr/dessus (sRGB, lin) | herbe : bord du contour couvert, dessus couvert')
    for s in meta['info']:
        mt = mask(s['top'], shape)
        ms = mask(s['side'], shape) & ~mt
        inner = erode(mt, 4)
        c = stone[..., :3][inner & (stone[..., 3] > 250)]
        L = lum(c)
        med = np.median(L)
        dark = (L < 0.55 * med).mean()
        mean = c.mean(axis=0)
        sc = stone[..., :3][erode(ms, 2) & (stone[..., 3] > 250)]
        smean = sc.mean(axis=0) if len(sc) else np.zeros(3)
        r_srgb = lum(smean) / lum(mean)
        r_lin = (lin(smean) @ [0.2126, 0.7152, 0.0722]) / (lin(mean) @ [0.2126, 0.7152, 0.0722])
        xs = [p[0] for p in s['top']]
        ys = [p[1] for p in s['top']]
        hl = (max(ys) - min(ys)) / (max(xs) - min(xs))
        # grass over the outline: band 3 px inside the edge
        sil = mt | mask(s['side'], shape)
        band = sil & ~erode(sil, 3)
        occ = np.abs(full[..., :3] - stone[..., :3]).sum(axis=2) > 40  # something drawn over the stone
        bitten = occ[band].mean()
        over = occ[mt & erode(sil, 3)].sum() / max(1, mt.sum())
        # overhang depth: per column, grass rows inside the top from its nearest edge, / apparent width
        pitch = f"{(s['Z0'] - prev['Z0']) * 100:.0f}" if prev else '-'
        gap = f"{(s['zmin'] - prev['zmax']) * 100:.0f}" if prev else '-'
        tops.append(lum(mean))
        print(
            f"{s['k']}  {s['w'] * 100:.0f}×{s['d'] * 100:.0f}  {s['he'] / s['w'] * 100:.0f} %  {hl:.2f}  {pitch}  {gap} | "
            f"{hexs(mean)} {hexs(np.median(c, axis=0))} {np.percentile(L, 10):.0f} {np.percentile(L, 90):.0f} {dark * 100:.0f} % | "
            f"{hexs(smean)}  {r_srgb:.2f} / {r_lin:.2f} | {bitten * 100:.0f} %  {over * 100:.1f} % du dessus"
        )
        prev = s
    t = np.array(tops)
    print(f'\nvaleur du dessus entre dalles : {t.min():.0f} à {t.max():.0f} (±{(t.max() - t.min()) / 2 / t.mean() * 100:.1f} %)')
    # cast shadow on the meadow: ground only, the darkest third of what the ground layer darkens
    g = lum(ground[..., :3])
    ml = lum(np.array(MEADOW, float))
    dk = g < 0.8 * ml
    if dk.any():
        print(f'ombre portée / pré éclairé : médiane {np.median(g[dk]) / ml:.2f}, p10 {np.percentile(g[dk], 10) / ml:.2f} (visé 0,55)')
    for s in meta['info']:
        print(f"  dalle {s['k']} : croissant d'ombre à droite {0.417 * s['he'] * 1854 / s['Z0'] * SC:.0f} px au téléphone ({0.417 * s['he'] * 100:.1f} cm)")


if __name__ == '__main__':
    main()
