"""refs_ext.py: reference photos of the red ant from outside Commons (PROTOCOLE §1, STANDARD-SOURCES N3), added as candidates of
refcache/<sid>/cands.json and downloaded into refcache/<sid>/hd/c<i>.jpg; then insectes/outils/refs_hd.py notes and registers them.

  python insectes/fourmi-rouge/outils/refs_ext.py inat <sid> <observation id> <photo id>...   iNaturalist, research grade, original size
  python insectes/fourmi-rouge/outils/refs_ext.py antweb <sid> <specimen> <view>...            AntWeb specimen views (p_1, d_1, h_1: _high)

The candidate keeps the page, the author and the licence; pixels stay in refcache/ (never in git). Prints the candidate index of each."""
import sys, os, json, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..', '..', '..', 'refcache')
UA = {'User-Agent': 'BelaisFlowersRefs/0.2 (https://github.com/MaliciousMusic/the-internet-florist; reference photo measurement, low rate)'}
sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def add(sid, title, page, author, lic, url):
    P = os.path.join(ROOT, sid, 'cands.json')
    C = json.load(open(P, encoding='utf-8'))
    for i, c in enumerate(C):
        if c.get('thumb') == url: return i
    os.makedirs(os.path.join(ROOT, sid, 'hd'), exist_ok=True)
    i = len(C)
    open(os.path.join(ROOT, sid, 'hd', 'c%03d.jpg' % i), 'wb').write(get(url))
    C.append({'title': 'File:' + title, 'thumb': url, 'page': page, 'w': 0, 'h': 0, 'author': author, 'lic': lic, 'q': 'ext'})
    json.dump(C, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    time.sleep(0.4)
    return i


def inat(sid, obs, pids):
    o = json.loads(get('https://api.inaturalist.org/v1/observations/%s' % obs))['results'][0]
    for p in o['photos']:
        if str(p['id']) not in pids: continue
        url = p['url'].replace('square', 'original')
        i = add(sid, 'iNaturalist %s photo %s (%s)' % (obs, p['id'], o['taxon']['name']), 'https://www.inaturalist.org/observations/%s' % obs,
                o['user'].get('name') or o['user']['login'], p.get('license_code') or '', url)
        print(i, 'inat', obs, p['id'], p.get('original_dimensions'), p.get('license_code'), o['quality_grade'])


def antweb(sid, code, views):
    for v in views:
        f = '%s_%s_high.jpg' % (code, v)
        i = add(sid, 'AntWeb %s %s (Myrmica rubra)' % (code, v), 'https://www.antweb.org/specimen/%s' % code.upper(), 'AntWeb, California Academy of Sciences',
                'CC BY 4.0', 'https://static.antweb.org/images/%s/%s' % (code, f))
        print(i, 'antweb', code, v)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'inat': inat(a[1], a[2], a[3:])
    elif a[0] == 'antweb': antweb(a[1], a[2], a[3:])
