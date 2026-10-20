# calib2.py <rounds> [cw...]: the peony's guard calibration with the lighting matched (REPRISE.md: calib.py averaged a lit and a shaded guard
# that did not correspond). Once: the 12 guards rendered alone (&solo=g0..g11, framboise, view 0, D 700, seed 7) are ranked by their mean
# lightness (the geometry, hence the light, does not depend on the colourway) -> reperes.json '_solo_L'. Then each round, for each colourway:
# the photo's lit guard (the brighter of its two flattened guards, <cw>-t1/t2.npy) is paired with the brightest solo guard only; calibre.py
# corrects the guard grid from that one table (the grid is the lit tissue, the material makes the shade); the heart as in calib.py.
import json, subprocess, sys, re, os
import numpy as np
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
S = os.path.dirname(os.path.abspath(__file__)); A = 'refcache/pivoine-herbacee-double/apparence'; C = 'refcache/pivoine-herbacee-double/cw'
R = json.load(open(A + '/reperes.json', encoding='utf-8')); RFC = '541,630;541,500;541,375;32'
n = int(sys.argv[1]); cws = [a for a in sys.argv[2:] if not a.startswith('--')] or [k for k in R if not k.startswith('_')]
def sh(*a): return subprocess.run(list(a), capture_output=True, text=True)
def shot(name, q): sh('sh', 'fleur/shot_p.sh', name, 'grid=1&sid=pivoine-herbacee-double&st=1:0&view=0&D=700&det=2&seed=7&' + q); return 'fleur/out/%s.png' % name
def lum(png):
    a = np.asarray(Image.open(png).convert('RGB')).astype(float); bg = a[2, 2]; m = np.abs(a - bg).sum(-1) > 30
    return float((a[m] @ [.2126, .7152, .0722]).mean()) if m.sum() > 50 else -1
def stats(t):
    ko = re.findall(r'^\| (\S+) \| ([0-9.]+) \| [^|]+ \| ([0-9.]+) \| ([0-9.]+) \|', t, re.M)
    return len([x for x in ko if float(x[1]) > 6]), np.mean([float(x[1]) for x in ko]) if ko else -1
if '_solo_L' not in R:
    L = {}
    for k in range(12):
        L['g%d' % k] = lum(shot('cal_rank_g%d' % k, 'cws=framboise&solo=g%d' % k))
    R['_solo_L'] = L; json.dump(R, open(A + '/reperes.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
L = R['_solo_L']; best = max((v, k) for k, v in L.items() if v > 0)[1]
print('gardes solo par éclairage :', ' '.join('%s %.0f' % (k, v) for v, k in sorted(((v, k) for k, v in L.items()), reverse=True)[:5]), '-> %s' % best, flush=True)
for rd in range(1, n + 1):
    for cw in cws:
        ph = lambda f: f"{C}/{f}".replace('.jpg', '-wb.jpg') if cw in ('blanc', 'blush') else f"{C}/{f}"
        Lp = []
        for t in ('t1', 't2'):
            try: Lp.append(float(np.load(f'{A}/{cw}/{cw}-{t}.npy', allow_pickle=True)[..., 0].mean()))
            except Exception: Lp.append(-1)
        key = 'g1' if Lp[0] >= Lp[1] else 'g2'; pf = R[cw][1] if key == 'g1' else R[cw][2]
        png = shot('cal_%s_%s' % (cw, best), 'cws=%s&solo=%s' % (cw, best)); rf = sh('python', 'fleur/repere.py', png, '--base', '541,513').stdout.strip()
        sh('python', 'fleur/apparence.py', 'paire', ph(R[cw][0]), pf, png, rf, '--out', f'{A}/{cw}/{cw}-paire-lit')
        png = shot('cal_%s_full' % cw, 'cws=%s' % cw)
        sh('python', 'fleur/apparence.py', 'paire', ph(R['_coeur'][cw][0]), R['_coeur'][cw][1], png, RFC, '--out', f'{A}/{cw}/{cw}-paire-coeur')
        out = []
        for k in ('lit', 'coeur'):
            try: ko, de = stats(open(f'{A}/{cw}/{cw}-paire-{k}.txt', encoding='utf-8').read()); out.append('%s ko %d ΔE %.1f' % (k, ko, de))
            except OSError: out.append('%s absent' % k)
        print('tour', rd, cw, '(photo %s, rendu %s)' % (key, best), ' | '.join(out), flush=True)
        if rd < n:
            for k, ps in (('g', [f'{A}/{cw}/{cw}-paire-lit.json']), ('h', [f'{A}/{cw}/{cw}-paire-coeur.json'])):
                cur = f'.scratch/cal_{cw}_{k}.json'; os.makedirs('.scratch', exist_ok=True); sh('python', S + '/gridio.py', 'get', cw, k, cur)
                sh('python', 'fleur/calibre.py', cur, *ps, '--out', cur, '--k', '.8'); sh('python', S + '/gridio.py', 'put', cw, k, cur)
    if rd < n: sh('sh', 'mkapp.sh')
