"""refs.py: reference photographs of a species from Wikimedia Commons, looked at and measured locally, never committed.

  python refs.py find  <sid> <query or Category:Name> [--n 60] [--depth 1]   candidates (title, thumbnail, author, licence) -> cands.json
  python refs.py url   <sid> <image url> [--title t] [--page p]               add any photo (a grower's product shot) as a candidate
  python refs.py sheet <sid> [--from 0] [--n 20] [--tile 230]                   numbered contact sheet of the candidates -> sheet_<from>.jpg
  python refs.py pal   <sid> <i> [--box x0,y0,x1,y1] [--k 6] [--grey]          dominant colours of a photo (or a box of it, fractions)
  python refs.py ring  <sid> <i> <cx,cy,r> [--n 5]                             colour from the centre outward (base -> tip): cx, cy as fractions of width and height, r of the width
  python refs.py auto  <sid> <i>                                              the flower found on its background (foliage excluded): base, body, tip, confidence
  python refs.py keep  <sid> <i> <tags...> [--m "measure"]                     keep a photo as a reference (its page, author, licence, tags) -> keep.json
  python refs.py kept  <sid> [--tile 220]                                       one sheet of the kept photos, numbered and tagged -> kept.jpg
  python refs.py list  <sid>                                                   the kept references, one line each (for REFERENCES.md)
  python refs.py clean <sid>                                                   delete the downloaded thumbnails and sheets (keep the json)

Thumbnails live in the atelier cache (refcache/<sid>/), outside the repository, and are deleted by `clean` once measured.
Only page addresses, authors, licences and numbers (colours, proportions) are ever written into the repository."""
import sys, os, json, re, urllib.request, urllib.parse, io, time
import numpy as np
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'refcache')
UA = {'User-Agent': 'BelaisFlowersRefs/0.1 (local reference measurement)'}
API = 'https://commons.wikimedia.org/w/api.php?'
SKIP = re.compile(r'stamp|марк|briefmarke|timbre|postage|envelope|herbarium|drawing|illustrat|k[oö]hler|plate|botanical|\.svg|\.tif|\.pdf|map|logo|coat of arms|painting', re.I)


def d(sid):
    p = os.path.join(ROOT, sid)
    os.makedirs(p, exist_ok=True)
    return p


def jload(p, dflt):
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else dflt


def jsave(p, o):
    json.dump(o, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def get(url, tries=3):
    for t in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
        except Exception as e:
            if t == tries - 1:
                raise
            time.sleep(2 + 3 * t)


def api(**q):
    q.update(format='json')
    return json.loads(get(API + urllib.parse.urlencode(q)))


def strip(h):
    return re.sub(r'<[^>]+>', '', h or '').strip()[:80]


def files_of(gen, n):
    """imageinfo for a generator query, following continuation"""
    out, cont = [], {}
    while len(out) < n:
        q = dict(gen, prop='imageinfo', iiprop='url|extmetadata|size|mime', iiurlwidth=400, **cont)
        r = api(**q)
        for p in (r.get('query', {}).get('pages', {}) or {}).values():
            ii = (p.get('imageinfo') or [{}])[0]
            if not ii or ii.get('mime') not in ('image/jpeg', 'image/png') or SKIP.search(p['title']):
                continue
            md = ii.get('extmetadata', {})
            out.append({'title': p['title'], 'thumb': ii.get('thumburl'), 'page': ii.get('descriptionurl'), 'w': ii.get('width'), 'h': ii.get('height'),
                        'author': strip(md.get('Artist', {}).get('value')), 'lic': strip(md.get('LicenseShortName', {}).get('value'))})
        if 'continue' not in r:
            break
        cont = {k: v for k, v in r['continue'].items() if k != 'continue'}
    return out[:n]


def find(sid, query, n=60, depth=1):
    P = os.path.join(d(sid), 'cands.json')
    C = jload(P, [])
    have = {c['title'] for c in C}
    got = []
    if query.startswith('Category:'):
        cats = [query]
        for _ in range(depth):
            sub = []
            for c in cats[-30:]:
                r = api(action='query', list='categorymembers', cmtitle=c, cmtype='subcat', cmlimit=50)
                sub += [m['title'] for m in r['query']['categorymembers']]
            cats += sub
        for c in cats:
            if len(got) >= n:
                break
            got += files_of({'action': 'query', 'generator': 'categorymembers', 'gcmtitle': c, 'gcmtype': 'file', 'gcmlimit': 50}, n - len(got))
    else:
        got = files_of({'action': 'query', 'generator': 'search', 'gsrsearch': query, 'gsrnamespace': 6, 'gsrlimit': 50}, n)
    new = [g for g in got if g['title'] not in have]
    for g in new:
        g['q'] = query
    C += new
    jsave(P, C)
    print(f'{len(new)} new, {len(C)} candidates ({P})')


def addurl(sid, url, title='', page=''):
    P = os.path.join(d(sid), 'cands.json')
    C = jload(P, [])
    C.append({'title': 'File:' + (title or url.rsplit('/', 1)[-1][:60]), 'thumb': url, 'page': page or url, 'w': 0, 'h': 0, 'author': '', 'lic': 'tiers (mesure locale)', 'q': 'url'})
    jsave(P, C)
    print(len(C) - 1)


def thumb(sid, i):
    C = jload(os.path.join(d(sid), 'cands.json'), [])
    p = os.path.join(d(sid), 't%03d.jpg' % i)
    if not os.path.exists(p):
        im = Image.open(io.BytesIO(get(C[i]['thumb']))).convert('RGB')
        im.thumbnail((640, 640))
        im.save(p, quality=88)
    return Image.open(p).convert('RGB')


def sheet(sid, f=0, n=20, tile=230):
    C = jload(os.path.join(d(sid), 'cands.json'), [])
    idx = list(range(f, min(len(C), f + n)))
    cols = 5
    rows = (len(idx) + cols - 1) // cols
    S = Image.new('RGB', (cols * tile, rows * tile), '#202020')
    dr = ImageDraw.Draw(S)
    for k, i in enumerate(idx):
        try:
            im = thumb(sid, i)
        except Exception as e:
            print('skip', i, e)
            continue
        im.thumbnail((tile - 4, tile - 4))
        x, y = (k % cols) * tile, (k // cols) * tile
        S.paste(im, (x + (tile - im.width) // 2, y + (tile - im.height) // 2))
        dr.rectangle([x, y, x + 30, y + 16], fill='#000')
        dr.text((x + 3, y + 2), str(i), fill='#ff0')
    p = os.path.join(d(sid), 'sheet_%d.jpg' % f)
    S.save(p, quality=85)
    print(p, f'{len(idx)} photos ({idx[0]}..{idx[-1]})' if idx else 'empty')


def kmeans(X, k, it=25):
    rng = np.random.default_rng(1)
    c = X[rng.choice(len(X), k, replace=False)]
    for _ in range(it):
        lab = ((X[:, None, :] - c[None]) ** 2).sum(-1).argmin(1)
        c = np.array([X[lab == j].mean(0) if (lab == j).any() else c[j] for j in range(k)])
    return c, np.bincount(lab, minlength=k)


def hexc(c):
    return '#%02x%02x%02x' % tuple(int(max(0, min(255, v))) for v in c)


def pal(sid, i, box=None, k=6, grey=False):
    im = thumb(sid, i)
    if box:
        W, H = im.size
        x0, y0, x1, y1 = box
        im = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    X = np.asarray(im, dtype=float).reshape(-1, 3)
    mx, mn = X.max(1), X.min(1)
    sat = (mx - mn) / np.maximum(mx, 1)
    if not grey:
        X = X[(sat > .18) & (mx > 40)]
    if len(X) < k * 10:
        print('too few coloured pixels (try --grey or a box)')
        return
    X = X[np.random.default_rng(2).choice(len(X), min(len(X), 20000), replace=False)]
    c, cnt = kmeans(X, k)
    o = np.argsort(-cnt)
    print(' '.join(f'{hexc(c[j])}:{cnt[j] / cnt.sum():.2f}' for j in o))


def ring(sid, i, cx, cy, r, n=5):
    im = thumb(sid, i)
    W, H = im.size
    A = np.asarray(im, dtype=float)
    yy, xx = np.mgrid[0:H, 0:W]
    dd = np.hypot(xx - cx * W, yy - cy * H) / (r * W)  # cx of the width, cy of the height, r of the width (any aspect)
    out = []
    for j in range(n):
        m = (dd >= j / n) & (dd < (j + 1) / n)
        if m.sum() < 5:
            out.append('-')
            continue
        out.append(hexc(np.median(A[m], 0)))
    print(' '.join(f'{(j + .5) / n:.1f}:{c}' for j, c in enumerate(out)))


def auto(sid, i):
    """the flower without a hand-given centre: pixels far from the border's colour, green foliage left out; median colour of the inner fifth
    (base), the middle (body) and the outer band (tip); confidence = how much of the found disc is flower"""
    im = thumb(sid, i)
    A = np.asarray(im, dtype=float)
    H, W = A.shape[:2]
    bg = np.median(np.concatenate([A[0], A[-1], A[:, 0], A[:, -1]]), 0)
    mx, mn = A.max(-1), A.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    green = (A[..., 1] > A[..., 0] + 8) & (A[..., 1] > A[..., 2] + 8) & (sat > .15)
    mask = (np.sqrt(((A - bg) ** 2).sum(-1)) > 40) & ~green
    if mask.sum() < 300:
        print('confiance 0.00 : pas de fleur trouvée (fond trop proche ?) ; mesure à la main')
        return
    ys, xs = np.nonzero(mask)
    cx, cy = np.median(xs), np.median(ys)
    r = np.percentile(np.hypot(xs - cx, ys - cy), 85)
    yy, xx = np.mgrid[0:H, 0:W]
    dd = np.hypot(xx - cx, yy - cy) / max(r, 1)
    out = []
    for a, b in ((0, .25), (.35, .65), (.75, 1)):
        m = mask & (dd >= a) & (dd < b)
        out.append(hexc(np.median(A[m], 0)) if m.sum() > 20 else '-')
    conf = min(1.0, mask[dd < 1].mean() * 1.15)
    print(f'base {out[0]} corps {out[1]} pointe {out[2]} confiance {conf:.2f} (centre {cx / W:.2f},{cy / H:.2f} rayon {r / W:.2f})')


def keep(sid, i, tags, m=''):
    C = jload(os.path.join(d(sid), 'cands.json'), [])
    P = os.path.join(d(sid), 'keep.json')
    K = jload(P, [])
    c = C[i]
    K = [x for x in K if x['title'] != c['title']] + [{'i': i, 'title': c['title'], 'page': c['page'], 'author': c['author'], 'lic': c['lic'], 'tags': tags, 'm': m}]
    jsave(P, K)
    print(len(K), 'kept')


def kept(sid, tile=220):
    K = jload(os.path.join(d(sid), 'keep.json'), [])
    cols = 5
    rows = (len(K) + cols - 1) // cols
    S = Image.new('RGB', (cols * tile, rows * (tile + 14)), '#202020')
    dr = ImageDraw.Draw(S)
    for k, x in enumerate(K):
        im = thumb(sid, x['i'])
        im.thumbnail((tile - 4, tile - 4))
        X, Y = (k % cols) * tile, (k // cols) * (tile + 14)
        S.paste(im, (X + (tile - im.width) // 2, Y + (tile - im.height) // 2))
        dr.text((X + 3, Y + tile), (str(x['i']) + ' ' + ' '.join(t.split(':')[-1] for t in x['tags']))[:36], fill='#ff0')
    p = os.path.join(d(sid), 'kept.jpg')
    S.save(p, quality=85)
    print(p, len(K), 'photos')


def lst(sid):
    for x in jload(os.path.join(d(sid), 'keep.json'), []):
        print(f"- {' '.join(x['tags'])} : [{x['title'][5:]}]({x['page']}) ({x['author']}, {x['lic']}){' : ' + x['m'] if x['m'] else ''}")


def clean(sid):
    n = 0
    for f in os.listdir(d(sid)):
        if f.endswith('.jpg'):
            os.remove(os.path.join(d(sid), f))
            n += 1
    print(n, 'images deleted')


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = {}
    pos = []
    j = 0
    while j < len(a):
        if a[j].startswith('--'):
            if j + 1 < len(a) and not a[j + 1].startswith('--') and a[j] not in ('--grey',):
                opt[a[j][2:]] = a[j + 1]
                j += 2
            else:
                opt[a[j][2:]] = True
                j += 1
        else:
            pos.append(a[j])
            j += 1
    cmd, sid = pos[0], pos[1]
    if cmd == 'find':
        find(sid, ' '.join(pos[2:]), int(opt.get('n', 60)), int(opt.get('depth', 1)))
    elif cmd == 'url':
        addurl(sid, pos[2], opt.get('title', ''), opt.get('page', ''))
    elif cmd == 'sheet':
        sheet(sid, int(opt.get('from', 0)), int(opt.get('n', 20)), int(opt.get('tile', 230)))
    elif cmd == 'pal':
        pal(sid, int(pos[2]), [float(v) for v in opt['box'].split(',')] if 'box' in opt else None, int(opt.get('k', 6)), 'grey' in opt)
    elif cmd == 'ring':
        cx, cy, r = [float(v) for v in pos[3].split(',')]
        ring(sid, int(pos[2]), cx, cy, r, int(opt.get('n', 5)))
    elif cmd == 'auto':
        auto(sid, int(pos[2]))
    elif cmd == 'keep':
        keep(sid, int(pos[2]), pos[3:], opt.get('m', ''))
    elif cmd == 'kept':
        kept(sid, int(opt.get('tile', 220)))
    elif cmd == 'list':
        lst(sid)
    elif cmd == 'clean':
        clean(sid)
