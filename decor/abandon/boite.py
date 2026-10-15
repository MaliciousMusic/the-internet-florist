"""boite.py: crop box (fractions of the world frame) of a solo cloud from compose.mjs --only, with a margin.
  python decor/boite.py a1 [--m .12]"""
import sys, json, re
n = sys.argv[1]
m = float(sys.argv[sys.argv.index('--m') + 1]) if '--m' in sys.argv else .12
sc = json.load(open('decor/out/scene.json', encoding='utf-8'))['nuages']
c = next(c for c in sc if c['src'] == f'nuage-{n}.svg')
vb = re.search(r'viewBox="([^"]+)"', open(f'decor/out/nuage-{n}.svg', encoding='utf-8').read()).group(1).split()
vw, vh = float(vb[2]), float(vb[3])
w = c['w'] / 100 * 2400; h = w * vh / vw; x = (2400 - w) / 2; y = c['y'] / 100 * 1350
x0, x1, y0, y1 = x - m * w, x + w + m * w, y - m * w * .5, y + h + m * w * .3
print(f'{max(0,x0)/2400:.4f},{max(0,y0)/1350:.4f},{min(2400,x1)/2400:.4f},{min(1350,y1)/1350:.4f}')
