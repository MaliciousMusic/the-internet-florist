# Inverse search of what the photograph does not show directly (the back of the block, the pocket's depth, the glass's
# absorption, the sun): a (1+1) evolution on the measured distance to the photograph (mesure.py cmp on the traced field,
# silhouette fixed by fit_cut.py). Each evaluation runs one trace through the shared gate.
#   python opt_photo.py <n_evals> [seed]   -> out/_opt.json (best parameters), out/_opt.log
import sys, os, json, subprocess, random, math
HERE = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(HERE, 'out')
sys.path.insert(0, HERE)
import fit_cut  # noqa: E402

N = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 40
rnd = random.Random(int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 1)
SPACE = {  # name: (low, high)
    'fz': (2.6, 4.2), 'b1': (-.5, 2.5), 'b2': (-2.5, .5), 'bz': (2.4, 4.2),
    'rm': (2.6, 3.4), 'ez': (.5, .95), 'hb': (6.5, 8.0), 'u1': (.18, .4), 'capk': (1.0, 2.5),
    'ar': (.02, .08), 'ag': (.08, .3), 'ab': (.6, 2.0),
    'saz': (-60, 60), 'sel': (10, 60), 'suni': (5, 80), 'sunr': (2, 12),
    'room': (.0, .1), 'pceil': (.0, .3), 'knee': (.8, .999), 'gain': (.7, 1.8), 'zw': (10, 60),
}
START = {'fz': 3.4, 'b1': .777, 'b2': -1.348, 'bz': 3.4, 'rm': 3.0, 'ez': .75, 'hb': 7.2, 'u1': .27, 'capk': 1.6,
         'ar': .03, 'ag': .1, 'ab': .4, 'saz': 40, 'sel': 30, 'suni': 40, 'sunr': 3, 'room': .02, 'pceil': .03, 'knee': .95, 'gain': 1.0, 'zw': 28}


def args_of(p):
    b1, b2 = max(p['b1'], p['b2'] + .2), min(p['b2'], p['b1'] - .2)
    cut, rms, _ = fit_cut.fit(p['fz'], (b1, b2, p['bz']))
    az, el = math.radians(p['saz']), math.radians(p['sel'])
    sun = (math.sin(az) * math.cos(el), math.sin(el), -math.cos(az) * math.cos(el))   # azimuth from straight behind, towards the right
    a = cut + ['rm=%.3f' % p['rm'], 'ez=%.3f' % p['ez'], 'hb=%.3f' % p['hb'], 'u1=%.3f' % p['u1'], 'capk=%.3f' % p['capk'],
               'alpha=%.4f,%.4f,%.4f' % (p['ar'], p['ag'], p['ab']), 'sun=%.4f,%.4f,%.4f' % sun, 'suni=%.2f' % p['suni'],
               'sunr=%.2f' % p['sunr'], 'room=%.3f,%.3f,%.3f' % ((p['room'],) * 3), 'pceil=%.3f,%.3f,%.3f' % ((p['pceil'],) * 3), 'knee=%.3f' % p['knee'], 'gain=%.3f' % p['gain'], 'zw=%.2f' % p['zw']]
    return a, rms


def score(p, res=.3):
    a, rms = args_of(p)
    r = subprocess.run(['sh', os.path.join(HERE, '..', '..', 'ws', 'gate.sh'), sys.executable, 'mk.py', 'photo', 'res=%g' % res] + a,
                       cwd=HERE, capture_output=True, text=True)
    if r.returncode:
        return 1e9, None
    r = subprocess.run([sys.executable, 'cmp_photo.py', 'field', os.path.join(O, '_opt')], cwd=HERE, capture_output=True, text=True)
    d = json.loads(r.stdout.strip().splitlines()[-1])
    J = d['dE2000_lisse_mean'] + 15 * (1 - d.get('ssim_lisse', d['ssim'])) + 4 * (2 - d['aretes_precision'] - d['aretes_rappel'])
    return J, d


def run():
    global best
    best = dict(START)
    f = os.path.join(O, '_opt.json')
    if os.path.exists(f):
        best.update({k: v for k, v in json.load(open(f))['p'].items() if k not in ('ar', 'ag', 'ab')})
    Jb, db = score(best)
    log = open(os.path.join(O, '_opt.log'), 'a')
    log.write('start J=%.3f %s\n' % (Jb, json.dumps(db))); log.flush()
    sigma = .25
    for it in range(N):
        q = dict(best)
        keys = rnd.sample(list(SPACE), rnd.choice((1, 2, 3)))
        for k in keys:
            lo, hi = SPACE[k]
            q[k] = min(hi, max(lo, q[k] + rnd.gauss(0, sigma * (hi - lo))))
        J, d = score(q)
        ok = J < Jb
        log.write('%3d %s J=%.3f %s %s\n' % (it, 'OK ' if ok else '   ', J, {k: round(q[k], 3) for k in keys},
                                           '' if d is None else 'dE %.2f ssimL %.3f ar %.2f/%.2f' % (d['dE2000_lisse_mean'], d.get('ssim_lisse', d['ssim']), d['aretes_precision'], d['aretes_rappel'])))
        log.flush()
        if ok:
            best, Jb, db = q, J, d
            json.dump({'p': best, 'J': Jb, 'm': db, 'args': args_of(best)[0]}, open(f, 'w'), indent=1)
    print('best J=%.3f' % Jb, json.dumps(db))


if __name__ == '__main__':
    run()
