"""inat.py: reference photos of a species from iNaturalist (research grade, CC licences: N3 of docs/STANDARD-SOURCES.md), for the
organs Commons lacks (the underside, the hind wing). Pixels stay in refcache/<sid>/inat/ (never in git); only the observation page,
author and licence are written, into refcache/<sid>/cands.json as ordinary candidates (refs_hd.py then registers them).

  python insectes/coccinelle/outils/inat.py find <sid> <taxon_id> <word>... [--n 30]   candidates whose description or tags hold a word
  python insectes/coccinelle/outils/inat.py sheet <sid> <from> [--n 30]                 numbered contact sheet of the iNat candidates
  python insectes/coccinelle/outils/inat.py hd <sid> <i>...                             original size into refcache/<sid>/hd/c<i>.jpg"""
import sys, os, json, io, time, urllib.request, urllib.parse
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', 'refcache')
UA = {'User-Agent': 'BelaisFlowersRefs/0.2 (reference photo measurement, low rate)'}
LIC = {'cc-by': 'CC BY', 'cc-by-sa': 'CC BY-SA', 'cc0': 'CC0'}


def get(u):
    for t in range(3):
        try: return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40).read()
        except Exception:
            if t == 2: raise
            time.sleep(3 + 5 * t)


def cands(sid):
    p = os.path.join(ROOT, sid, 'cands.json')
    return p, json.load(open(p, encoding='utf-8'))


def find(sid, taxon, words, n):
    p, C = cands(sid); have = {c['title'] for c in C}; new = 0
    for w in words:
        q = {'taxon_id': taxon, 'q': w, 'search_on': 'description,tags', 'quality_grade': 'research', 'photo_license': 'cc-by,cc-by-sa,cc0', 'per_page': n}
        R = json.loads(get('https://api.inaturalist.org/v1/observations?' + urllib.parse.urlencode(q)))['results']
        for o in R:
            for ph in o['photos']:
                if ph.get('license_code') not in LIC: continue
                t = 'File:inat-%d-%d.jpg' % (o['id'], ph['id'])
                if t in have: continue
                have.add(t); new += 1
                C.append({'title': t, 'thumb': ph['url'].replace('square', 'medium'), 'page': 'https://www.inaturalist.org/observations/%d' % o['id'],
                          'w': 0, 'h': 0, 'author': ph.get('attribution', '')[:80], 'lic': LIC[ph['license_code']], 'q': 'inat:' + w,
                          'orig': ph['url'].replace('square', 'original')})
        time.sleep(1.2)
    json.dump(C, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(new, 'new,', len(C), 'candidates')


def sheet(sid, f, n, tile=230):
    _, C = cands(sid); idx = [i for i in range(f, min(len(C), f + n))]
    cols = 6; rows = (len(idx) + cols - 1) // cols
    S = Image.new('RGB', (cols * tile, rows * tile), '#202020'); d = ImageDraw.Draw(S)
    os.makedirs(os.path.join(ROOT, sid, 'inat'), exist_ok=True)
    for k, i in enumerate(idx):
        tp = os.path.join(ROOT, sid, 'inat', 't%03d.jpg' % i)
        if not os.path.exists(tp):
            try: Image.open(io.BytesIO(get(C[i]['thumb']))).convert('RGB').save(tp, quality=85)
            except Exception as e: print('skip', i, e); continue
        im = Image.open(tp); im.thumbnail((tile - 4, tile - 4))
        x, y = (k % cols) * tile, (k // cols) * tile
        S.paste(im, (x + (tile - im.width) // 2, y + (tile - im.height) // 2)); d.rectangle([x, y, x + 30, y + 14], fill='#000'); d.text((x + 3, y + 2), str(i), fill='#ff0')
    out = os.path.join(ROOT, sid, 'inat', 'sheet_%d.jpg' % f); S.save(out, quality=85); print(out)


def hd(sid, idx):
    p, C = cands(sid); os.makedirs(os.path.join(ROOT, sid, 'hd'), exist_ok=True)
    for i in idx:
        out = os.path.join(ROOT, sid, 'hd', 'c%03d.jpg' % i)
        if not os.path.exists(out):
            im = Image.open(io.BytesIO(get(C[i]['orig']))).convert('RGB'); im.save(out, quality=95)
            C[i]['w'], C[i]['h'] = im.size
        print(i, Image.open(out).size, C[i]['lic'], C[i]['page'])
    json.dump(C, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    n = int(a[a.index('--n') + 1]) if '--n' in a else 30
    if '--n' in a: i = a.index('--n'); del a[i:i + 2]
    if a[0] == 'find': find(a[1], int(a[2]), a[3:], n)
    elif a[0] == 'sheet': sheet(a[1], int(a[2]), n)
    elif a[0] == 'hd': hd(a[1], [int(x) for x in a[2:]])
