# try.py key=value ... : one traced variant in the photograph's framing, from the search's best parameters (out/_opt.json)
# with some of them changed (the cut is refitted); prints the measures and the coarse L/b grid
import sys, os, json, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import opt_photo as op
p = dict(op.START)
f = os.path.join(HERE, 'out', '_opt.json')
if os.path.exists(f):
    p.update(json.load(open(f))['p'])
extra = []
for a in sys.argv[1:]:
    k, v = a.split('=', 1)
    if k in op.SPACE or k in p:
        p[k] = float(v)
    else:
        extra.append(a)
res = [a for a in extra if a.startswith('res=')]
J, d = op.score(p, float(res[0][4:]) if res else .3) if not extra or res == extra else (None, None)
if extra and res != extra:
    args, _ = op.args_of(p)
    subprocess.run(['sh', os.path.join(HERE, '..', '..', 'ws', 'gate.sh'), sys.executable, 'mk.py', 'photo', 'res=.3'] + args + extra, cwd=HERE, capture_output=True)
    r = subprocess.run([sys.executable, 'cmp_photo.py', 'field', os.path.join(HERE, 'out', '_opt')], cwd=HERE, capture_output=True, text=True)
    d = json.loads(r.stdout.strip().splitlines()[-1])
    J = d['dE2000_lisse_mean'] + 15 * (1 - d.get('ssim_lisse', d['ssim'])) + 4 * (2 - d['aretes_precision'] - d['aretes_rappel'])
print('J %.2f dE %.2f ssimL %.3f ar %.2f/%.2f' % (J, d['dE2000_lisse_mean'], d.get('ssim_lisse', 0), d['aretes_precision'], d['aretes_rappel']), d['zones'])
subprocess.run([sys.executable, 'grid_cmp.py', '5', '4'], cwd=HERE)
