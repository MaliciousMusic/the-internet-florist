# opt.py [rounds]: coordinate descent of a few physical parameters (studio, bores, bowl) on the measured colour distance
# (smoothed dE2000 in the vase's mask) of the traced field against the reference. Results in out/lect/opt.txt
import sys, os, subprocess, json
R = int(sys.argv[1]) if len(sys.argv) > 1 else 1
P = {'sw0': 15, 'sw1': 22, 'swk': .95, 'expo': 1.15, 'bxA': 365, 'rcA': 3.6, 'yb': 4.6, 'ec': 3.0, 'bxB': 330, 'rcB': 3.6,
     'bxC': 360, 'rcC': 3.4, 'frontk': .45}
S = {'sw0': 4, 'sw1': 4, 'swk': .2, 'expo': .15, 'bxA': 15, 'rcA': .5, 'yb': .8, 'ec': .8, 'bxB': 15, 'rcB': .5, 'bxC': 15,
     'rcC': .5, 'frontk': .2}
if os.path.exists('out/lect/opt.txt'):
    P.update({k: float(v) for k, v in (kv.split('=') for kv in open('out/lect/opt.txt').read().split())})
alph = open('out/lect/alphas.txt').read().split()


def score(p):
    subprocess.run(['python', 'mk.py', 'photo', 'res=.4', 'ss=1', 'emit=0'] + alph + ['%s=%s' % kv for kv in p.items()],
                   check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['python', 'spec.py'], check=True, stdout=subprocess.DEVNULL)
    out = subprocess.run(['python', '../mesure.py', 'cmp', 'out/ref.jpg', 'out/field_full.png', '--mask', 'out/lect/masque.png',
                          '--out', 'out/_mes'], check=True, capture_output=True, text=True).stdout
    d = json.loads(out.strip().splitlines()[-1])
    return d['dE2000_lisse_mean'] - 5 * d['ssim']


best = score(P)
print('start', round(best, 3), flush=True)
for r in range(R):
    for k in list(S):
        for sg in (1, -1):
            q = dict(P); q[k] = round(P[k] + sg * S[k], 4)
            v = score(q)
            if v < best - .02:
                best, P = v, q
                print('  %s -> %s : %.3f' % (k, q[k], v), flush=True)
                break
        open('out/lect/opt.txt', 'w').write(' '.join('%s=%s' % kv for kv in P.items()))
    S = {k: v / 2 for k, v in S.items()}
print('best', round(best, 3), ' '.join('%s=%s' % kv for kv in P.items()))
