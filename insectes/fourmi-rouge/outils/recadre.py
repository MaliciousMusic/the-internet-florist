"""recadre.py: the photo | render pairs of the red ant cut by region for the judge (PROTOCOLE §5.1, §5.3): each pair whole, then its
head, mesosoma with the waist, and gaster at the pair's scale, side by side at the same height. Outputs hold photo pixels: refcache only.

  python insectes/fourmi-rouge/outils/recadre.py [--h 520]   -> refcache/<sid>/juge/<pair>-<region>.jpg"""
import sys, os, json
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__)); SP = os.path.join(HERE, '..')
cfg = json.load(open(os.path.join(SP, 'paires.json'), encoding='utf-8'))
ref = os.path.join(SP, '..', '..', 'refcache', cfg['sid']); out = os.path.join(ref, 'juge'); os.makedirs(out, exist_ok=True)
H = int(sys.argv[sys.argv.index('--h') + 1]) if '--h' in sys.argv else 520
# regions as fractions of the pair's width (the ant lies along x): from the head end
REG = [('tete', 0.0, 0.36), ('mesosome-taille', 0.25, 0.68), ('gastre', 0.55, 1.0)]
n = 0
for p in cfg['pairs']:
    r = Image.open(os.path.join(SP, 'planches', 'paire-%s.png' % p['nom'])).convert('RGB')
    ph = Image.open(os.path.join(ref, p['photo'])).convert('RGB')
    if p.get('rot'): b = p['box']; ph = ph.rotate(p['rot'], resample=Image.BICUBIC, center=((b[0] + b[2]) / 2, (b[1] + b[3]) / 2), fillcolor='#efe9df')
    ph = ImageOps.expand(ph, border=800, fill='#efe9df').crop(tuple(v + 800 for v in p['box'])).resize(r.size, Image.LANCZOS)
    head_right = int(p['vue'].split(':')[1]) % 360 > 180
    def pair(a, b, name):
        global n
        a = a.resize((round(a.width * H / a.height), H), Image.LANCZOS); b = b.resize((round(b.width * H / b.height), H), Image.LANCZOS)
        m = Image.new('RGB', (a.width + b.width + 14, H), '#efe9df'); m.paste(a, (0, 0)); m.paste(b, (a.width + 14, 0))
        m.save(os.path.join(out, '%s-%s.jpg' % (p['nom'], name)), quality=90); n += 1
    pair(ph, r, 'entier')
    if p['nom'].startswith('face'): continue
    W = r.width
    for name, f0, f1 in REG:
        x0, x1 = (int(W * (1 - f1)), int(W * (1 - f0))) if head_right else (int(W * f0), int(W * f1))
        pair(ph.crop((x0, 0, x1, r.height)), r.crop((x0, 0, x1, r.height)), name)
print(n, 'paires dans', out)
