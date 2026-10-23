"""calage.py: the model's shell drawn over a photo (loi_modele.mjs samples), to fit a pair's frame by eye (view, scale, turn, offset).
  python insectes/cetoine/outils/calage.py <samples.json> <out.jpg> [--w 1000]   (photo pixels: the output stays in the scratchpad)"""
import sys, os, json, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
a = sys.argv[1:]; D = json.load(open(a[0])); im = cv2.imread(os.path.join(ROOT, 'refcache', 'cetonia-aurata', 'hd', D['photo'] + '.jpg'))
col = {'pronotum': (0, 0, 255), 'scutellum': (0, 255, 255), 'elytre-g': (255, 0, 255), 'elytre-d': (255, 128, 0)}
for s in D['samples'][::3]:
    x, y = map(int, s['ph']); cv2.circle(im, (x, y), max(3, im.shape[1] // 500), col[s['piece']], -1)
W = int(a[a.index('--w') + 1]) if '--w' in a else 1000; f = W / im.shape[1]
cv2.imwrite(a[1], cv2.resize(im, None, fx=f, fy=f))
