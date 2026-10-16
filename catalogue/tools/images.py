"""Find reference photos for every catalogue entry on Wikipedia / Wikimedia Commons.

Reads catalogue/data/*.json, writes catalogue/catalogue.json with an `img` field per entry.
Only image URLs and metadata are fetched (images stay hosted on Wikimedia).
Re-runnable: Commons search results are cached in data/_img_cache.json.
"""
import glob, json, os, re, sys, time, urllib.parse, urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'BelaisFlowersCatalog/1.0 (personal botanical reference catalogue)'
BAD = re.compile(r'(map|distribution|herbar|stamp|logo|icon|diagram|chart|range|locator|flag|coat of arms|seed packet|\.svg|\.pdf|\.tif)', re.I)


_last = [0.0]


def get(url, params, tries=6):
    """Polite GET: at most ~1 request/second, honours 429 Retry-After. Returns None on failure (never cached)."""
    import urllib.error
    q = url + '?' + urllib.parse.urlencode(params)
    for i in range(tries):
        wait = 1.0 - (time.time() - _last[0])
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        try:
            req = urllib.request.Request(q, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            ra = e.headers.get('Retry-After') if e.headers else None
            time.sleep(float(ra) if ra and ra.isdigit() else 10 * (i + 1))
        except Exception:
            time.sleep(3 * (i + 1))
    return None


def strip(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h or '')).strip()


def commons(q, n=6):
    d = get('https://commons.wikimedia.org/w/api.php', {
        'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6,
        'gsrsearch': q + ' filetype:bitmap', 'gsrlimit': n + 6, 'prop': 'imageinfo',
        'iiprop': 'url|extmetadata|mime', 'iiurlwidth': 480,
        'iiextmetadatafilter': 'Artist|LicenseShortName'})
    if d is None:
        return None
    pages = sorted((d.get('query', {}).get('pages', {}) or {}).values(), key=lambda p: p.get('index', 99))
    out = []
    for p in pages:
        t = p.get('title', '')
        ii = (p.get('imageinfo') or [{}])[0]
        if BAD.search(t) or ii.get('mime') not in ('image/jpeg', 'image/png', 'image/webp'):
            continue
        em = ii.get('extmetadata', {})
        credit = ' · '.join(x for x in [strip(em.get('Artist', {}).get('value'))[:70], em.get('LicenseShortName', {}).get('value', '')] if x)
        out.append({'src': ii.get('thumburl') or ii.get('url'), 'page': ii.get('descriptionurl'), 'credit': credit, 'title': t[5:]})
        if len(out) >= n:
            break
    return out


def wiki_lead(titles):
    res = {}
    titles = [t for t in titles if t]
    for i in range(0, len(titles), 40):
        chunk = titles[i:i + 40]
        d = get('https://en.wikipedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'titles': '|'.join(chunk), 'prop': 'pageimages',
            'piprop': 'thumbnail|name', 'pithumbsize': 560, 'redirects': 1}) or {}
        q = d.get('query', {})
        norm = {r['from']: r['to'] for r in q.get('normalized', [])}
        red = {r['from']: r['to'] for r in q.get('redirects', [])}
        pages = {p.get('title'): p for p in q.get('pages', {}).values()}
        for t in chunk:
            n = norm.get(t, t)
            fin = red.get(n, n)
            p = pages.get(fin)
            if p and p.get('thumbnail') and not BAD.search(p.get('pageimage', '')):
                res[t] = {'src': p['thumbnail']['source'],
                          'page': 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(p.get('pageimage', '')),
                          'credit': 'Photo de l’article Wikipédia « ' + fin + ' »', 'title': p.get('pageimage', '')}
        time.sleep(.3)
    return res


ORDER = ['roses.json', 'printemps.json', 'ete.json', 'orchidees.json', 'exotiques.json', 'remplissage.json', 'feuillages.json', 'branches.json']


def _n(s):
    import unicodedata
    s = unicodedata.normalize('NFD', str(s or '').lower())
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn')).strip()


def merge_duplicates(entries):
    """Merge the same product found by two researchers: same id, or same Latin name AND same French name,
    coming from different files. The entry from the earlier category is kept; lists are united."""
    entries.sort(key=lambda e: ORDER.index(e['_file']) if e['_file'] in ORDER else 99)
    kept, by_id, by_name = [], {}, {}
    for e in entries:
        k1 = e.get('id')
        k2 = (_n(e.get('latin')), _n(e.get('nom_fr')))
        tgt = by_id.get(k1) or by_name.get(k2)
        if tgt is not None and tgt['_file'] != e['_file']:
            names = {_n(v.get('nom')) for v in tgt.get('varietes') or []}
            tgt.setdefault('varietes', []).extend(v for v in e.get('varietes') or [] if _n(v.get('nom')) not in names)
            for f in ('couleurs', 'sources', 'img_queries'):
                cur = tgt.setdefault(f, [])
                cur.extend(x for x in e.get(f) or [] if x not in cur)
            continue
        kept.append(e)
        if k1:
            by_id.setdefault(k1, e)
        by_name.setdefault(k2, e)
    if len(kept) < len(entries):
        print('doublons fusionnes :', len(entries) - len(kept))
    return kept


def main():
    entries = []
    for fp in sorted(glob.glob(os.path.join(BASE, 'data', '*.json'))):
        if os.path.basename(fp).startswith('_'):
            continue
        try:
            arr = json.load(open(fp, encoding='utf-8'))
        except Exception as e:
            print('JSON invalide :', fp, e)
            continue
        for e in arr:
            e['_file'] = os.path.basename(fp)
            entries.append(e)
    entries = merge_duplicates(entries)
    seen = set()
    for e in entries:
        i = e.get('id') or re.sub(r'[^a-z0-9]+', '-', (e.get('latin') or e.get('nom_fr', 'x')).lower()).strip('-')
        while i in seen:
            i += '-2'
        seen.add(i)
        e['id'] = i
    leads = wiki_lead(sorted({e.get('wiki') or e.get('latin') or '' for e in entries}))
    cpath = os.path.join(BASE, 'data', '_img_cache.json')
    cache = json.load(open(cpath, encoding='utf-8')) if os.path.exists(cpath) else {}
    for k, e in enumerate(entries):
        key = e.get('wiki') or e.get('latin') or e.get('nom_en') or e.get('nom_fr')
        gal = []
        for q in [key] + list(e.get('img_queries') or [])[:2]:
            if not q:
                continue
            if q not in cache:
                r = commons(q, 6 if q == key else 4)
                if r is None:
                    continue
                cache[q] = r
            for im in cache[q]:
                if all(im['src'] != g['src'] for g in gal):
                    gal.append(dict(im, q=q))
        lead = leads.get(key)
        e['img'] = {'main': lead or (gal[0] if gal else None), 'gallery': gal[:8]}
        if k % 25 == 0:
            json.dump(cache, open(cpath, 'w', encoding='utf-8'))
            print(k, '/', len(entries), flush=True)
    json.dump(cache, open(cpath, 'w', encoding='utf-8'))
    json.dump(entries, open(os.path.join(BASE, 'catalogue.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('termine :', len(entries), 'entrees,', sum(1 for e in entries if e['img']['main']), 'avec photo')


if __name__ == '__main__':
    main()
