"""fit.py: fits the free settings of an SVG flower (a kind's sheet for svBloom, its genes, its material, its plant) to the measures of its
reference photographs, by batched headless renders and image measures; no language model in the loop. Mode d'emploi : FIT.md.

  python fleur/fit.py <sid> --space <space.json> --targets <targets.json> [--cw i] [--view 2,0,3] [--budget 60] [--out <dir>]
  python fleur/fit.py targets <sid> --refs <refcache/<sid>> --out <targets.json> [--family grappe]   measures of the kept photos
  python fleur/fit.py targets <sid> --render --space <space.json> --out <targets.json> [--cw i] [--family grappe]   measures of the current drawing
  python fleur/fit.py cmp <a.json> <b.json>                                                   two targets files side by side

Every render goes through fleur/shot.sh (the atelier gate: 3 headless Chrome at most, waits under 3.8 GB of free RAM), many candidates per
Chrome (the fit mode of pilote/svtest.js: one cell per candidate and stage). Same inputs, same result: no draw from any random stream."""
import sys, os, re, json, io, time, math, glob, subprocess, contextlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import img as IMG  # noqa: E402  (blob, measure: the silhouette tools of img.py pair)
import refs as REFS  # noqa: E402  (auto: base / body / tip colours of a flower on its background)

BG = (233, 228, 220)
# the stages a measure belongs to, and the cell that renders it (op opening, wl wilt, view index of VIEWS: 0 face, 2 three-quarter, 7 profile)
STAGES = {
    'bouton': {'k': 'head', 'op': .08, 'wl': 0, 'view': 7, 'Dk': 2},
    'entrouverte': {'k': 'head', 'op': .55, 'wl': 0, 'view': 7},
    'ouverte': {'k': 'head', 'op': .9, 'wl': 0, 'view': 7},
    'face': {'k': 'head', 'op': 1, 'wl': 0, 'view': 0},
    'tige': {'k': 'plant', 'op': 1, 'wl': 0, 'full': 0},
    'feuille': {'k': 'plant', 'op': 1, 'wl': 0, 'full': 30},
}
SEEDS = [3, 8]
# the smallest tolerance of each kind of measure (photos: the spread of the kept photos when it is larger)
TOL = {'hw': .06, 'wh': .06, 'ang': 3.0, 'lab': 5.0, 'stem': .02, 'leaflw': .3, 'leafang': 6.0, 'taper': .08, 'fill': .06}
KINDS = {'bouton': ['hw'], 'entrouverte': ['wh', 'ang'], 'ouverte': ['wh', 'ang'], 'face': ['lab'], 'tige': ['stem'], 'feuille': ['leaflw', 'leafang']}
# inflorescences (raceme, panicle, thyrse: lilac, hyacinth, grape hyacinth, wisteria, freesia): not a radial flower, so the cup / opening
# measures give way to the silhouette of the whole cluster, in ratios only: hw length/width, taper narrow end/wide end, fill area/box
GRAPPE = {'grappe', 'panicule', 'thyrse', 'raceme', 'epi', 'inflorescence'}
KINDS_G = dict(KINDS, bouton=['hw', 'taper', 'fill'], entrouverte=['hw', 'taper', 'fill'], ouverte=['hw', 'taper', 'fill'])
LAB_G = ('corps',)  # the colour of a cluster is its body: base and tip are the cup's business
STAGE_NAME = {'ouvert': 'ouverte', 'ouverte': 'ouverte', 'entrouvert': 'entrouverte', 'entrouverte': 'entrouverte', 'bouton': 'bouton', 'boutons': 'bouton'}


def fam_of(x):
    """'grappe' for a cluster family (any of GRAPPE, case and accents aside), else ''"""
    x = re.sub(r'[^a-z]', '', (x or '').lower().replace('é', 'e').replace('è', 'e'))
    return 'grappe' if x in GRAPPE else ''


def opts(a):
    o, p, j = {}, [], 0
    while j < len(a):
        if a[j].startswith('--'):
            if j + 1 < len(a) and not a[j + 1].startswith('--'):
                o[a[j][2:]] = a[j + 1]
                j += 2
            else:
                o[a[j][2:]] = '1'
                j += 1
        else:
            p.append(a[j])
            j += 1
    return o, p


def jload(p):
    return json.load(open(p, encoding='utf-8'))


def jsave(p, o):
    json.dump(o, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


# ---------------------------------------------------------------- renders: one Chrome per batch, through the gate (shot.sh)
class Renderer:
    MAXCELLS = 120

    def __init__(self, sid, spec, cw, tag):
        self.sid, self.spec, self.cw, self.tag = sid, spec, cw, tag
        self.launches, self.cells, self.cwid = 0, 0, None
        os.makedirs(os.path.join(ROOT, 'fleur', 'out'), exist_ok=True)

    def run(self, cells, cands, links=(), probe=(), D=150, cols=12, det=1):
        """cells: the cell specs drawn for every candidate; cands: [{path: value}]. Returns [[PIL cell image or None]] per candidate, base values"""
        per = max(1, self.MAXCELLS // max(1, len(cells)))
        res, base = [], {}
        for s in range(0, len(cands), per):
            r, b = self._one(cells, cands[s:s + per], links, probe, D, cols, det)
            res += r
            base = base or b
        return res, base

    def _one(self, cells, cands, links, probe, D, cols, det):
        self.launches += 1
        name = '%s_%d' % (self.tag, self.launches)
        job = {'sid': self.sid, 'spec': self.spec, 'cw': self.cw, 'D': D, 'gap': 2.3, 'cols': cols, 'det': det, 'cells': cells, 'cands': cands,
               'links': list(links), 'probe': list(probe)}
        jp = os.path.join(ROOT, 'fleur', 'out', 'fitjob_%s.json' % name)
        jsave(jp, job)
        q = 'fit=1&job=../fleur/out/fitjob_%s.json&sp=fit&seeds=1&views=0&snap=' % name
        subprocess.run(['sh', os.path.join(HERE, 'shot.sh'), name, q], capture_output=True, text=True, encoding='utf-8', errors='replace')
        png, oj = os.path.join(ROOT, 'fleur', 'out', name + '.png'), os.path.join(ROOT, 'fleur', 'out', name + '.json')
        try:
            out = json.loads(open(oj, encoding='utf-8').read())
        except Exception as e:
            raise SystemExit('rendu %s : pas de sortie (%s) ; serveur 8765 / recv 8781 allumés ?' % (name, e))
        if not os.path.exists(png):
            raise SystemExit('rendu %s : PAS D\'IMAGE %s' % (name, (out.get('err') or [''])[:2]))
        self.cwid = out.get('cw', self.cwid)
        im = Image.open(png).convert('RGB')
        im.load()
        if not out.get('err') and not os.environ.get('FIT_KEEP'):  # the batch's files are read: drop them (FIT_KEEP=1 keeps them)
            for p in (png, oj, jp):
                os.remove(p)
        self.cells += len(cells) * len(cands)
        nc, res = len(cells), []
        bad = {int(e.split()[0]) for e in out.get('err', []) if e.split()[0].isdigit()}
        for ci in range(len(cands)):
            row = []
            for j in range(nc):
                i = ci * nc + j
                b = out['box'][i] if i < len(out['box']) else None
                row.append(im.crop(tuple(int(v) for v in b)) if b and i not in bad else None)
            res.append(row)
        if out.get('err'):
            self.errs = out['err']
        return res, out.get('base', {})


# ---------------------------------------------------------------- measures (the same functions for the drawing and the photographs)
def trim(mask):
    """drops the narrow rows at both ends of a silhouette (a stem, a neck below the flower; a style above): under a fifth of the widest row"""
    rows = np.nonzero(mask.any(1))[0]
    if not len(rows):
        return mask
    w = np.array([(lambda r: r.max() - r.min() + 1 if len(r) else 0)(np.nonzero(mask[y])[0]) for y in range(mask.shape[0])])
    big = np.nonzero(w >= .2 * w.max())[0]
    m = mask.copy()
    m[:big.min()] = 0
    m[big.max() + 1:] = 0
    return m


def shape(mask):
    """height/width, width/height and the opening angle of a trimmed silhouette (img.py measure)"""
    if mask is None or mask.sum() < 30:
        return None
    return IMG.measure(trim(mask))


def closed(mask):
    """a silhouette with its holes filled and its specks (within 2 px of the main body) joined; only the main body is kept"""
    from scipy import ndimage
    if mask is None or mask.sum() < 60:
        return None
    m = ndimage.binary_fill_holes(mask)
    lb, n = ndimage.label(ndimage.binary_dilation(m, iterations=2))
    if n > 1:
        m = m & (lb == 1 + int(np.argmax(ndimage.sum(m, lb, range(1, n + 1)))))
    return m


def body_lab(im, m):
    """the body colour of a silhouette: Lab of the median colour of its pixels (the edge pixels, blended with the background, left out)"""
    from scipy import ndimage
    e = ndimage.binary_erosion(m, iterations=2)
    e = e if e.sum() >= 20 else m
    c = np.median(np.asarray(im.convert('RGB'))[e], 0).astype(int)
    return lab('#%02x%02x%02x' % tuple(c))


def thyrse(mask):
    """silhouette of an inflorescence, in ratios only. The mask is closed (holes filled, specks within 2 px joined to the main body), read in its
    principal axes (PCA: a tilted photograph reads like an upright drawing; the wide edge is the length) and measured in slabs 2 px thick along
    the axis; the narrow slabs at both ends (stem, neck, a fine tip: under a fifth of the widest) are dropped, as in trim().
    hw = length/width of the box; taper = mean width of the narrower end third / that of the wider one (1: a cylinder; it does not matter which
    end is up, so it serves an upright lilac as well as a hanging wisteria); fill = area / box. Same function for the drawing and the photos."""
    m = closed(mask)
    if m is None:
        return None
    ys, xs = np.nonzero(m)
    P = np.stack([xs, ys], 1).astype(float)
    P -= P.mean(0)
    ev, evec = np.linalg.eigh(np.cov(P.T))
    u, v = P @ evec[:, 1], P @ evec[:, 0]
    k = ((u - u.min()) // 2).astype(int)
    lo, hi = np.full(k.max() + 1, np.inf), np.full(k.max() + 1, -np.inf)
    np.minimum.at(lo, k, v)
    np.maximum.at(hi, k, v)
    w = np.where(np.isfinite(lo), hi - lo + 1, 0.)
    big = np.nonzero(w >= .2 * w.max())[0]
    a, b = big.min(), big.max()
    if b - a < 5:
        return None
    sel = (k >= a) & (k <= b)
    H, W = 2. * (b - a + 1), np.ptp(v[sel]) + 1
    w, t = w[a:b + 1], max(1, (b - a + 1) // 3)
    narrow, wide = sorted([w[:t].mean(), w[-t:].mean()])
    return {'hw': float(H / W), 'taper': float(narrow / wide), 'fill': float(sel.sum() / (H * W))}


def rmask(cell):
    a = np.asarray(cell).astype(int)
    return np.abs(a - np.array(BG)).sum(2) > 18


def pmask(im):
    """a photograph's subject on a copy 240 px wide at most: away from the border's colour (img.py blob, refs.py auto), foliage green left out,
    the connected part at the centre of the frame (or the nearest to it)"""
    from scipy import ndimage
    im = im.copy()
    im.thumbnail((240, 240))
    A = np.asarray(im).astype(float)
    bg = np.median(np.concatenate([A[0], A[-1], A[:, 0], A[:, -1]]), 0)
    m = (np.sqrt(((A - bg) ** 2).sum(-1)) > 40) & ~green(A)
    m = ndimage.binary_opening(m, iterations=1)
    lb, n = ndimage.label(m)
    if n == 0:
        return None
    h, w = m.shape
    cy, cx = h // 2, w // 2
    if not m[cy, cx]:
        ys, xs = np.nonzero(m)
        i = np.argmin((ys - cy) ** 2 + (xs - cx) ** 2)
        cy, cx = ys[i], xs[i]
    return ndimage.binary_fill_holes(lb == lb[cy, cx])


def conf_shape(m):
    """how far a photograph's silhouette can be trusted: share of the frame, sides touched, fill of its box"""
    if m is None:
        return 0, 'pas de silhouette'
    h, w = m.shape
    a = m.mean()
    sides = int(m[0].any()) + int(m[-1].any()) + int(m[:, 0].any()) + int(m[:, -1].any())
    ys, xs = np.nonzero(m)
    fill = m.sum() / ((np.ptp(ys) + 1) * (np.ptp(xs) + 1))
    if a < .03:
        return 0, 'sujet trop petit (%.2f)' % a
    if a > .75:
        return 0, 'fond confondu (%.2f)' % a
    if sides >= 2:
        return 0, 'silhouette coupée ou fond confondu (%d bords)' % sides
    if fill < .3:
        return 0, 'silhouette diffuse (%.2f)' % fill
    return 1, ''


def lab(hexc):
    c = np.array([int(hexc[i:i + 2], 16) for i in (1, 3, 5)]) / 255.
    c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    X, Y, Z = np.array([[.4124, .3576, .1805], [.2126, .7152, .0722], [.0193, .1192, .9505]]) @ c / np.array([.95047, 1., 1.08883])
    f = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    return [round(116 * f(Y) - 16, 1), round(500 * (f(X) - f(Y)), 1), round(200 * (f(Y) - f(Z)), 1)]


def colours(im):
    """refs.py auto on an image (the same rule for a photograph and a rendered cell): {base, corps, pointe: Lab}, confidence"""
    t = im.copy()
    t.thumbnail((640, 640))
    REFS.thumb = lambda sid, i: t
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        REFS.auto('fit', 0)
    s = buf.getvalue()
    m = re.search(r'base (\S+) corps (\S+) pointe (\S+) confiance ([\d.]+)', s)
    if not m:
        return None, 0.
    out = {k: lab(v) for k, v in zip(('base', 'corps', 'pointe'), m.groups()[:3]) if v.startswith('#')}
    return out, float(m.group(4))


def runs_at(row, x):
    r = np.nonzero(row)[0]
    if not len(r) or not row[x]:
        return 0
    a = b = x
    while a > 0 and row[a - 1]:
        a -= 1
    while b < len(row) - 1 and row[b + 1]:
        b += 1
    return b - a + 1


def stem_ratio(m):
    """stem thickness over flower width: the widest row of the upper 60 % against the median run, in the lowest quarter, through the stem's column"""
    if m is None or m.sum() < 50:
        return None
    ys, xs = np.nonzero(m)
    y0, y1 = ys.min(), ys.max()
    H = y1 - y0 + 1
    wid = lambda y: (lambda r: r.max() - r.min() + 1 if len(r) else 0)(np.nonzero(m[y])[0])
    Wf = max(wid(y) for y in range(y0, y0 + int(.6 * H) + 1))
    lo = range(y1 - int(.25 * H), y1 + 1)
    xc = int(np.median(xs[ys >= y1 - int(.1 * H)]))
    w = [runs_at(m[y], xc) for y in lo]
    w = [v for v in w if v > 0]
    return float(np.median(w) / Wf) if w and Wf else None


def leaf(m, stem_px):
    """the largest leaf once the stem is opened away (min then max filter wider than the stem): length/width and angle from upright (PCA)"""
    from scipy import ndimage
    if m is None or m.sum() < 50:
        return None
    k = int(max(3, 2 * stem_px + 1)) | 1
    im = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k))
    o = np.asarray(im) > 127
    lb, n = ndimage.label(o)
    if n == 0:
        return None
    sz = ndimage.sum(o, lb, range(1, n + 1))
    ys, xs = np.nonzero(lb == 1 + int(np.argmax(sz)))
    if len(ys) < 30:
        return None
    C = np.cov(np.vstack([xs, ys]))
    ev, evec = np.linalg.eigh(C)
    lw = math.sqrt(ev[1] / max(ev[0], 1e-6))
    vx, vy = evec[:, 1]
    ang = math.degrees(math.atan2(abs(vx), abs(vy)))
    return lw, ang


def green(a):
    a = np.asarray(a).astype(float)
    mx, mn = a.max(-1), a.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    return (a[..., 1] > a[..., 0] + 8) & (a[..., 1] > a[..., 2] + 8) & (sat > .15)


def measure_cell(stage, cell, fam=''):
    """the measures of one rendered cell for its stage: {kind: value} (fam 'grappe': the silhouette of an inflorescence, the body colour)"""
    if cell is None:
        return {}
    k = (KINDS_G if fam else KINDS)[stage]
    if 'lab' in k and fam:
        m = closed(rmask(cell))
        return {'lab': {'corps': body_lab(cell, m)}} if m is not None else {}
    if 'lab' in k:
        c, cf = colours(cell)
        return {'lab': c} if c else {}
    m = rmask(cell)
    if 'stem' in k:
        r = stem_ratio(m)
        return {'stem': r} if r is not None else {}
    if 'leaflw' in k:
        r = leaf(green(cell) & m, 3)
        return {'leaflw': r[0], 'leafang': r[1]} if r else {}
    if fam and 'taper' in k:
        return thyrse(m) or {}
    s = shape(m)
    if not s:
        return {}
    return {'hw': s['H/W']} if 'hw' in k else {'wh': s['W/H'], 'ang': s['angle']}


# ---------------------------------------------------------------- targets, cost
def active(T, cwid):
    """the measures a fit uses: shapes and plant for every colourway, colours only for the fitted colourway (or untagged ones)"""
    return [m for m in T['m'] if m['kind'] != 'lab' or not m.get('cw') or m['cw'] == cwid]


def stage_cells(T, ms):
    """the cells one candidate needs: each stage of the active measures, with its seeds (heads) or one plant"""
    out = []
    for st in sorted({m['stage'] for m in ms}, key=list(STAGES).index):
        c = dict(STAGES[st], **T.get('stages', {}).get(st, {}))
        for sd in (SEEDS if c['k'] == 'head' and st != 'face' else SEEDS[:1]):
            out.append((st, dict(c, seed=sd)))
    return out


def aggregate(cells, imgs, fam=''):
    """the measures of one candidate: per stage and kind, the mean over its seeds ({stage.kind[.part]: value})"""
    acc = {}
    for (st, c), im in zip(cells, imgs):
        for k, v in measure_cell(st, im, fam).items():
            if k == 'lab':
                for part, L in v.items():
                    acc.setdefault('%s.lab.%s' % (st, part), []).append(L)
            else:
                acc.setdefault('%s.%s' % (st, k), []).append(v)
    return {k: (np.mean(v, 0).round(2).tolist() if isinstance(v[0], list) else round(float(np.mean(v)), 4)) for k, v in acc.items()}


def mkey(m):
    return '%s.%s%s' % (m['stage'], m['kind'], '.' + m['part'] if m.get('part') else '')


def devs(meas, ms):
    """each measure's deviation from its target, in tolerances (a colour: its Lab distance)"""
    d = {}
    for m in ms:
        r = meas.get(mkey(m))
        if r is None:
            d[m['id']] = 10.
        elif m['kind'] == 'lab':
            d[m['id']] = float(np.linalg.norm(np.array(r) - np.array(m['v']))) / m['tol']
        else:
            d[m['id']] = (r - m['v']) / m['tol']
    return d


def resid(meas, ms):
    """the residual vector in tolerances (a colour: its three Lab differences), in the order of the measures"""
    out = []
    for m in ms:
        r = meas.get(mkey(m))
        if m['kind'] == 'lab':
            out += [10.] * 3 if r is None else list((np.array(r) - np.array(m['v'])) / m['tol'])
        else:
            out.append(10. if r is None else (r - m['v']) / m['tol'])
    return out


def cost(dv, ms):
    w = {m['id']: m.get('w', 1.) for m in ms}
    return sum(w[k] * v * v for k, v in dv.items()) / max(1e-9, sum(w.values()))


# ---------------------------------------------------------------- the space of free settings (normalised to 0..1, quantised to their step)
class Space:
    def __init__(self, sp):
        self.spec = sp['spec']
        self.free = [s for s in sp['set'] if 'link' not in s]
        self.links = [{'path': s['path'], 'to': s['link'], 'k': s.get('k'), 'b': s.get('b', 0)} for s in sp['set'] if 'link' in s]
        self.d = len(self.free)

    def isb(self, i):
        return self.free[i].get('type') == 'bool'

    def q(self, i):
        s = self.free[i]
        if self.isb(i):
            return 1.
        return min(1., (s.get('step') or (s['max'] - s['min']) / 100.) / (s['max'] - s['min']))

    def snap(self, u):
        return tuple(min(1., max(0., round(round(x / self.q(i)) * self.q(i), 9))) for i, x in enumerate(u))

    def val(self, i, x):
        s = self.free[i]
        if self.isb(i):
            return bool(x >= .5)
        v = s['min'] + x * (s['max'] - s['min'])
        if s.get('step'):
            v = s['min'] + round((v - s['min']) / s['step']) * s['step']
        v = round(min(s['max'], max(s['min'], v)), 9)
        return int(round(v)) if s.get('type') == 'int' else v

    def norm(self, i, v):
        s = self.free[i]
        if self.isb(i):
            return 1. if v else 0.
        return min(1., max(0., (float(v) - s['min']) / (s['max'] - s['min'])))

    def cand(self, u):
        return {s['path']: self.val(i, x) for i, (s, x) in enumerate(zip(self.free, u))}


# ---------------------------------------------------------------- the search: batched Levenberg-Marquardt (one Chrome per batch)
class Search:
    """each batch: the forward-difference sweep around the best point (the Jacobian of the measures, in tolerances) and the
    Levenberg-Marquardt steps from the best point with the latest Jacobian, for several dampings; the sweep step halves on a stall.
    Coordinate descent alone stalls in the valleys of coupled settings (two settings moving one measure); this does not."""
    LAMBDAS = (1e-4, 1e-2, .1, 1.)

    def __init__(self, space, evalf, budget):
        self.S, self.ev, self.budget = space, evalf, budget
        self.cache, self.order = {}, []
        self.h = [1. if space.isb(i) else max(space.q(i), .06) for i in range(space.d)]
        self.J = None

    def run_batch(self, us):
        new = []
        for u in us:
            k = self.S.snap(u)
            if k not in self.cache and k not in new:
                new.append(k)
        new = new[:max(0, self.budget - len(self.cache))]
        if new:
            for k, r in zip(new, self.ev([self.S.cand(k) for k in new])):
                self.cache[k] = r
                self.order.append(k)
        return len(new)

    def best(self):
        return min(self.order, key=lambda k: (self.cache[k]['cost'], self.order.index(k)))

    def moved(self, c, i):
        u = list(c)
        if self.S.isb(i):
            u[i] = 1. - c[i]
        else:
            u[i] = c[i] + self.h[i] if c[i] + self.h[i] <= 1 else c[i] - self.h[i]
        return self.S.snap(u)

    def sweep(self, c):
        return [self.moved(c, i) for i in range(self.S.d)]

    def jacobian(self, c):
        """columns: change of the residuals per unit of each normalised setting (None where the sweep is missing)"""
        r0 = np.array(self.cache[c]['res'])
        J = np.zeros((len(r0), self.S.d))
        for i in range(self.S.d):
            k = self.moved(c, i)
            if k in self.cache and k[i] != c[i]:
                J[:, i] = (np.array(self.cache[k]['res']) - r0) / (k[i] - c[i])
            elif self.J is not None:
                J[:, i] = self.J[:, i]
        return J

    def steps(self, c):
        r = np.array(self.cache[c]['res'])
        J = self.J
        A, g = J.T @ J, J.T @ r
        dg = np.maximum(np.diag(A), 1e-9)
        out = []
        for lam in self.LAMBDAS:
            try:
                dlt = -np.linalg.solve(A + lam * dg.mean() * np.eye(self.S.d) + lam * np.diag(dg), g)
            except np.linalg.LinAlgError:
                continue
            out.append(self.S.snap([min(1., max(0., x + d)) for x, d in zip(c, dlt)]))
        return out

    def run(self, u0, coarse=()):
        u0 = self.S.snap(u0)
        self.run_batch([u0] + list(coarse) + self.sweep(u0))
        stall, ctr = 0, u0
        while len(self.cache) < self.budget:
            c = self.best()
            if self.cache[c]['ok']:
                break
            prev = self.cache[c]['cost']
            self.J = self.jacobian(ctr)  # from the last sweep's centre (its missing columns: the previous Jacobian)
            ctr = c
            if not self.run_batch(self.steps(c) + self.sweep(c)):
                stall += 1
            elif self.cache[self.best()]['cost'] >= prev - 1e-6:
                stall += 1
            else:
                stall = 0
                continue
            if all(h <= self.S.q(i) + 1e-9 or self.S.isb(i) for i, h in enumerate(self.h)) or stall >= 3:
                break
            self.h = [h if self.S.isb(i) else max(self.S.q(i), h / 2) for i, h in enumerate(self.h)]
        return self.best()


# ---------------------------------------------------------------- the fit
def evaluator(R, cells, ms, links, probe, log, fam=''):
    def ev(cands):
        imgs, base = R.run([c for _, c in cells], cands, links, probe)
        log['base'] = log.get('base') or base
        out = []
        for row in imgs:
            meas = aggregate(cells, row, fam)
            dv = devs(meas, ms)
            out.append({'meas': meas, 'dev': dv, 'res': resid(meas, ms), 'cost': cost(dv, ms), 'ok': all(abs(v) <= 1 for v in dv.values())})
        return out
    return ev


def sheet(R, cands, views, path, D=80):
    """before / after: for each view a row of the start and a row of the best, bud to wilt; 1000 px wide at most"""
    st = [(.08, 0), (.4, 0), (.75, 0), (1, 0), (1, .6)]
    cells = [{'k': 'head', 'op': op, 'wl': wl, 'view': v, 'seed': 3} for v in views for op, wl in st]
    imgs, _ = R.run(cells, cands, R.links, (), D=D, cols=len(st))
    g = int(round(D * 2.3))
    lw = 64
    out = Image.new('RGB', (lw + g * len(st), g * 2 * len(views)), BG)
    dr = ImageDraw.Draw(out)
    for vi, v in enumerate(views):
        for ci, lab_ in enumerate(('avant', 'apres')):
            y = g * (2 * vi + ci)
            dr.text((4, y + g // 2 - 6), '%s v%d' % (lab_, v), fill=(60, 50, 40))
            for si in range(len(st)):
                im = imgs[ci][vi * len(st) + si]
                if im is not None:
                    out.paste(im, (lw + g * si, y))
    k = 1000 / max(out.size)
    if k < 1:
        out = out.resize((int(out.width * k), int(out.height * k)), Image.LANCZOS)
    out.save(path)


def linked(S, vals, base):
    out = {}
    for L in S.links:
        tv = vals.get(L['to'], base.get(L['to']))
        k = L['k'] if L['k'] is not None else (base.get(L['path']) or 0) / (base.get(L['to']) or 1)
        out[L['path']] = round(k * tv + L['b'], 6) if tv is not None else None
    return out


def sens(srch, k0, ms):
    """how far each setting moves each measure (in tolerances) over a tenth of its range, from the start's sweep: which settings matter"""
    J = srch.jacobian(k0) * .1
    rows, i = [], 0
    for m in ms:
        n = 3 if m['kind'] == 'lab' else 1
        rows.append((m['id'], np.linalg.norm(J[i:i + n], axis=0) if n == 3 else J[i]))
        i += n
    return {s['path']: {mid: round(float(r[j]), 2) for mid, r in rows if abs(r[j]) >= .05} for j, s in enumerate(srch.S.free)}


def fit(sid, o):
    t0 = time.time()
    sp, T = jload(o['space']), jload(o['targets'])
    S = Space(sp)
    out = o.get('out') or os.path.join(ROOT, 'fleur', 'out', 'fit-' + sid)
    os.makedirs(out, exist_ok=True)
    R = Renderer(sid, S.spec, o.get('cw', sp.get('cw', '0')), 'fit_' + re.sub(r'\W', '', sid)[:14])
    R.links = S.links
    probe = sorted({s['path'] for s in S.free} | {L['path'] for L in S.links} | {L['to'] for L in S.links})
    start = {s['path']: s['x0'] for s in S.free if 'x0' in s}
    log = {}
    if len(start) < S.d:  # a first run reads the current values of the settings without a start
        _, log['base'] = R.run([{'k': 'head', 'op': 1, 'wl': 0, 'view': 0, 'seed': 3}], [{}], S.links, probe, D=40)
        for s in S.free:
            if s['path'] not in start:
                b = log['base'].get(s['path'])
                start[s['path']] = (bool(b) if s.get('type') == 'bool' else b if b is not None else s['min'])
    else:
        R.cwid = R.cw if not str(R.cw).isdigit() else None
    if R.cwid is None and any(m['kind'] == 'lab' for m in T['m']):  # the colourway's id (a rank in CWS[sid]) comes back from a render
        R.run([{'k': 'head', 'op': 1, 'wl': 0, 'view': 0, 'seed': 3}], [{}], (), (), D=40)
    ms = active(T, R.cwid)
    fam = fam_of(o.get('family') or T.get('family'))
    cells = stage_cells(T, ms)
    ev = evaluator(R, cells, ms, S.links, probe, log, fam)
    k0 = S.snap([S.norm(i, start[s['path']]) for i, s in enumerate(S.free)])
    x0, start = start, S.cand(k0)  # the start on the settings' steps: the first point of the search
    srch = Search(S, ev, int(o.get('budget', 60)))
    coarse = []
    if S.d <= 2:
        lv = [0, .25, .5, .75, 1]
        coarse = [(a,) for a in lv] if S.d == 1 else [(a, b) for a in lv for b in lv]
    bk = srch.run(k0, coarse)
    r0, rb = srch.cache[k0], srch.cache[bk]
    best = S.cand(bk)
    base = log.get('base') or {}
    sheet(R, [start, best], [int(v) for v in o.get('view', '2,0,3').split(',')], os.path.join(out, 'fit.png'))
    dev = {m['id']: {'cible': m['v'], 'tol': m['tol'], 'avant': r0['meas'].get(mkey(m)), 'apres': rb['meas'].get(mkey(m)),
                     'ecart_avant': round(r0['dev'][m['id']], 2), 'ecart': round(rb['dev'][m['id']], 2), 'ok': abs(rb['dev'][m['id']]) <= 1} for m in ms}
    res = {'sid': sid, 'spec': S.spec, 'cw': R.cwid, 'best': best, 'lies': linked(S, best, base), 'start': start, 'x0': x0, 'base': base, 'dev': dev,
           'cout_avant': round(r0['cost'], 3), 'cout': round(rb['cost'], 3), 'ok': rb['ok'], 'rendus': len(srch.cache), 'lancements': R.launches,
           'cases': R.cells, 'duree_s': round(time.time() - t0, 1), 'erreurs': getattr(R, 'errs', [])[:5]}
    res['sens'] = sens(srch, k0, ms)
    jsave(os.path.join(out, 'fit.json'), res)
    print('fit %s (%s, %s) : %d reglages, %d mesures, %d rendus en %d lancements, %.0f s' % (sid, S.spec, R.cwid, S.d, len(ms), res['rendus'], R.launches, res['duree_s']))
    for k, v in list(dev.items())[:10]:
        print('  %-22s cible %-18s avant %-18s apres %-18s ecart %+.2f tol %s' % (k, fmt(v['cible']), fmt(v['avant']), fmt(v['apres']), v['ecart'], v['tol']))
    for p, v in list(best.items())[:6]:
        print('  %s = %s (depart %s)' % (p, v, start.get(p)))
    print('%s : cout %.3f -> %.3f ; %s' % ('DANS LA TOLERANCE' if rb['ok'] else 'HORS TOLERANCE', r0['cost'], rb['cost'], os.path.join(out, 'fit.json')))
    return res


def fmt(v):
    if v is None:
        return '-'
    if isinstance(v, list):
        return '/'.join('%.0f' % x for x in v)
    return '%.3f' % v


# ---------------------------------------------------------------- targets
SKIP = re.compile(r'tuber|seed|fruit|scan|lifecycle|plant|sheet|kavb', re.I)
EN = {'blue': 'bleu', 'navy': 'bleu', 'red': 'rouge', 'white': 'blanc', 'purple': 'violet', 'pink': 'rose', 'yellow': 'jaune', 'orange': 'orange'}


def cwmap(refs):
    """colourway of a file name: the free variety names of the census table (recensement.md), then plain colour words"""
    out = []
    p = os.path.join(refs, 'recensement.md')
    ids = set()
    if os.path.exists(p):
        for ln in open(p, encoding='utf-8'):
            c = [x.strip() for x in ln.strip().strip('|').split('|')]
            if len(c) >= 3 and re.match(r'^[a-z][a-z-]*$', c[0]) and c[0] not in ('coloris',):
                ids.add(c[0])
                for w in re.findall(r'[A-Za-z]{4,}', c[2]):
                    if w.lower() not in ('forme', 'blanche', 'sauvage', 'coeur', 'sombre', 'die', 'mister', 'the'):
                        out.append((w.lower(), c[0]))
    out += [(k, v) for k, v in EN.items() if not ids or v in ids]
    return out


def photo_list(refs):
    """(path, tags, name): the kept photos of refs.py (keep.json, thumbnails t%03d.jpg) or, without it, the files of img/ (tags from the names)"""
    kj = os.path.join(refs, 'keep.json')
    if os.path.exists(kj):
        for x in jload(kj):
            tags = dict(t.split(':', 1) for t in x.get('tags', []) if ':' in t)
            if 'stade' in tags:  # refs.py says « ouvert », the stages here say « ouverte »
                tags['stade'] = STAGE_NAME.get(tags['stade'].strip().lower(), tags['stade'])
            yield os.path.join(refs, 't%03d.jpg' % x['i']), tags, '%d %s' % (x['i'], x['title'][:30])
        return
    cm = cwmap(refs)
    for p in sorted(glob.glob(os.path.join(refs, 'img', '*'))):
        n = os.path.basename(p).lower()
        if not re.search(r'\.(jpe?g|png|webp)$', n):
            continue
        if SKIP.search(n):
            yield p, None, n
            continue
        t = {'stade': 'bouton' if re.search(r'bud|bouton|closed|knop', n) else 'ouverte'}
        if re.search(r'side|profil', n):
            t['vue'] = 'profil'
        if re.search(r'leaf|leaves|feuille|blad', n):
            t['organe'] = 'feuille'
        for w, c in cm:
            if w in n:
                t['coloris'] = c
                break
        yield p, t, n


def measure_photo(p, t, fam=''):
    """{key: value} of one photograph by its tags, or the reason it is left out (fam 'grappe': inflorescence silhouettes instead of cup measures)"""
    if t is None:
        return None, 'pas une tete (graine, tubercule, planche...)'
    if not os.path.exists(p):
        return None, 'vignette absente (refs.py la retelecharge)'
    im = Image.open(p).convert('RGB')
    st, vue, org = t.get('stade', ''), t.get('vue', ''), t.get('organe', '')
    out = {}
    if org.startswith('feuille'):
        sm = im.copy()
        sm.thumbnail((240, 240))
        gm = green(sm)
        if not .05 < gm.mean() < .8:
            return None, 'feuille introuvable (vert %.2f)' % gm.mean()
        r = leaf(gm, 2)
        if r:
            out.update({'feuille.leaflw': r[0], 'feuille.leafang': r[1]})
        return (out or None), ('' if out else 'feuille introuvable')
    m = pmask(im)
    cf, why = conf_shape(m)
    if 'tige' in org and cf:
        r = stem_ratio(m)
        if r:
            out['tige.stem'] = r
    if fam:
        return measure_grappe(im, st, org, t.get('coloris', ''), out)
    s = shape(m) if cf else None
    if st.startswith('bouton'):
        if not s:
            return None, why
        out['bouton.hw'] = s['H/W']
        return out, ''
    if st not in ('ouverte', 'entrouverte'):
        return None, 'stade %s non mesure' % (st or '?')
    view = vue or ('?' if not s else 'face' if .7 <= s['W/H'] <= 1.45 else 'profil' if s['W/H'] > 1.6 else '?')
    if s and view == 'profil':
        out.update({st + '.wh': s['W/H'], st + '.ang': s['angle']})
    if st == 'ouverte' and view in ('face', 'trois-quarts', '?'):
        c, k = colours(im)
        if c and k >= .5:
            cw = t.get('coloris', '')
            for part, L in (c.items() if cw else ()):
                out['face.lab.%s@%s' % (part, cw)] = L
        elif not out:
            return None, 'couleurs peu sures (confiance %.2f)' % k
    return (out or None), (why or 'rien de mesurable')


def gcomps(im, warm=False, size=320):
    """the complete inflorescences of a photograph, one mask each, on a copy 320 px wide at most (returned with it): what is far from the colour of
    the border and is not foliage (green, yellow-green hues, shadows), specks opened away. A body is kept when it touches no edge of the frame,
    covers 2 to 60 % of it and is nearly convex (area over convex hull .72 at least: two panicles run together, a bush, a branch with its leaves
    do not pass), then only those at least half as large as the largest (a highlight or a patch of sky is not a second panicle). Foliage hues
    run from 35 degrees (bark, soil, dry grass count as background) or, for a yellow or orange colourway (warm), from 65."""
    from scipy import ndimage, spatial
    im = im.copy()
    im.thumbnail((size, size))
    A = np.asarray(im).astype(float)
    bg = np.median(np.concatenate([A[0], A[-1], A[:, 0], A[:, -1]]), 0)
    H = np.asarray(im.convert('HSV')).astype(float)
    hue, sat, val = H[..., 0] * 360 / 255, H[..., 1] / 255, H[..., 2]
    foliage = green(A) | (val < 70) | ((hue >= (65 if warm else 35)) & (hue <= 170) & (sat > .12))
    m = (np.sqrt(((A - bg) ** 2).sum(-1)) > 40) & ~foliage
    m = ndimage.binary_opening(ndimage.binary_closing(m, iterations=1), iterations=1)
    lb, n = ndimage.label(m)
    out = []
    for i in range(1, n + 1):
        c = ndimage.binary_fill_holes(lb == i)
        a = c.mean()
        if not .02 <= a <= .6 or c[0].any() or c[-1].any() or c[:, 0].any() or c[:, -1].any():
            continue
        ys, xs = np.nonzero(c)
        try:
            hull = spatial.ConvexHull(np.stack([xs, ys], 1)).volume
        except Exception:
            continue
        if c.sum() / hull >= .72:
            out.append(c)
    big = max([c.sum() for c in out], default=0)
    return [c for c in out if c.sum() >= .5 * big], im


def measure_grappe(im, st, org, cw, out):
    """an inflorescence photograph: hw, taper, fill of the silhouettes of its complete clusters (the median of those of one photograph) per stage
    (bud, half open, open: stage tags only, any view) and the body colour of an open one, for its colourway. Photographs of an organ (winter bud,
    twig, leaf) are not portraits of the cluster: stem and leaf only."""
    if st not in ('bouton', 'entrouverte', 'ouverte'):
        return (out or None), 'stade %s non mesure' % (st or '?')
    if any(w in org for w in ('bourgeon', 'tige', 'feuille')):
        return (out or None), 'organe %s : pas le portrait de la grappe' % org
    cs, th = gcomps(im, bool(re.search(r'jaune|orange|creme|abricot|saumon|dore', cw)))
    S = [(thyrse(c), c) for c in cs]
    S = [(s, c) for s, c in S if s]
    if not S:
        return (out or None), 'aucune grappe entiere et isolee'
    for k in ('hw', 'taper', 'fill'):
        out['%s.%s' % (st, k)] = float(np.median([s[k] for s, _ in S]))
    if st == 'ouverte' and cw:
        L = np.median([body_lab(th, closed(c)) for _, c in S], 0)
        out['face.lab.corps@%s' % cw] = [round(float(x), 1) for x in L]
    return out, ''


def build(vals, src, fam=''):
    """targets from the gathered values: median, spread (MAD), tolerance = max(minimum of its kind, spread)"""
    ms = []
    for key in sorted(vals):
        v = vals[key]
        base, _, cw = key.partition('@')
        p = base.split('.')
        st, kind, part = p[0], p[1], (p[2] if len(p) > 2 else None)
        if kind == 'lab':
            A = np.array(v)
            med = np.median(A, 0)
            sd = float(np.median(np.linalg.norm(A - med, axis=1))) * 1.4826 if len(v) > 1 else 0.
            vv = [round(float(x), 1) for x in med]
        else:
            med = float(np.median(v))
            sd = float(np.median(np.abs(np.array(v) - med))) * 1.4826 if len(v) > 1 else 0.
            vv = round(med, 4)
        floor = max(TOL[kind], .06 * vv) if fam and kind == 'hw' else TOL[kind]  # a cluster's length/width is 2 to 6: a relative floor
        m = {'id': key.replace('@', '.') if cw else key, 'stage': st, 'kind': kind, 'v': vv, 'tol': round(max(floor, sd), 3), 'w': 1, 'n': len(v), 'sd': round(sd, 3)}
        if part:
            m['part'] = part
        if cw:
            m['cw'] = cw
        if src:
            m['src'] = src.get(key, [])[:8]
        ms.append(m)
    return ms


def targets(sid, o):
    out = o.get('out') or os.path.join(ROOT, 'fleur', 'out', 'targets-%s.json' % sid)
    fam = fam_of(o.get('family'))
    if o.get('family') and not fam:
        print('famille %s : pas une grappe, mesures de fleur radiale' % o['family'])
    if o.get('render'):
        sp = jload(o['space'])
        R = Renderer(sid, sp['spec'], o.get('cw', sp.get('cw', '0')), 'tg_' + re.sub(r'\W', '', sid)[:14])
        sts = ['bouton', 'entrouverte', 'ouverte', 'face'] + (['tige', 'feuille'] if o.get('plant') else [])
        cells = stage_cells({'stages': sp.get('stages', {})}, [{'stage': s} for s in sts])
        imgs, _ = R.run([c for _, c in cells], [{}], (), ())
        meas = aggregate(cells, imgs[0], fam)
        vals = {}
        for k, v in meas.items():
            p = k.split('.')
            vals[(k + '@' + R.cwid) if p[1] == 'lab' else k] = [v]
        T = {'sid': sid, 'src': 'dessin', 'cw': R.cwid, 'stages': {s: STAGES[s] for s in sts}, 'm': build(vals, None, fam), 'dropped': []}
    else:
        refs = o['refs']
        vals, src, drop, used = {}, {}, [], 0
        for p, t, name in photo_list(refs):
            r, why = measure_photo(p, t, fam)
            if not r:
                drop.append([name, why])
                continue
            used += 1
            for k, v in r.items():
                vals.setdefault(k, []).append(v)
                src.setdefault(k, []).append(name)
        ms = build(vals, src, fam)
        T = {'sid': sid, 'src': 'photos', 'refs': refs.replace('\\', '/'), 'stages': {s: STAGES[s] for s in sorted({m['stage'] for m in ms}, key=list(STAGES).index)},
             'm': ms, 'dropped': drop}
        print('%s : %d photos mesurees, %d ecartees (faible confiance ou hors sujet ; voir dropped)' % (sid, used, len(drop)))
    if fam:
        T['family'] = fam
    jsave(out, T)
    for m in sorted(T['m'], key=lambda m: m['kind'] == 'lab')[:17]:
        print('  %-26s %-16s tol %-6s n %d' % (m['id'], fmt(m['v']), m['tol'], m['n']))
    print(out)


def cmp(a, b):
    A, B = jload(a), jload(b)
    bm = {m['id']: m for m in B['m']}
    n = 0
    print('%-26s %-16s %-16s ecart/tol (tol de %s)' % ('mesure', A.get('src', 'a'), B.get('src', 'b'), A.get('src', 'a')))
    for m in A['m']:
        if m['id'] not in bm or n >= 18:
            continue
        x, y = m['v'], bm[m['id']]['v']
        d = float(np.linalg.norm(np.array(x) - np.array(y))) if isinstance(x, list) else y - x
        print('%-26s %-16s %-16s %+.2f (n %d)' % (m['id'], fmt(x), fmt(y), d / m['tol'], m['n']))
        n += 1


if __name__ == '__main__':
    o, p = opts(sys.argv[1:])
    if not p:
        print(__doc__)
    elif p[0] == 'targets':
        targets(p[1], o)
    elif p[0] == 'cmp':
        cmp(p[1], p[2])
    else:
        fit(p[0], o)
