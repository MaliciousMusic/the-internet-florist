"""kavb.py: read-only lookups in the KAVB cultivar register (the public search form of login.kavb.nl/siergewassen, no account, no personal data;
allowed by the owner on 2026-10-08 for the varieties of the bouquet, run from the main session only).

  python kavb.py <Genus> <names file (one cultivar a line)> <out.json>     every name looked up, 1 request every 2 s

For each name: the register's rows whose cultivar matches (exact, case and quotes ignored), with genus, species, group, cultivar, registrant,
registration date; « absent » when the register has nothing. The rows are an N1 proof of the name, group, raiser and year (STANDARD-SOURCES.md)."""
import sys, json, re, html, time, urllib.request, urllib.parse
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
UA = {'User-Agent': 'BelaisFlowersRefs/0.1 (local reference check)'}
FORM = 'https://login.kavb.nl/siergewassen'
POST = 'https://login.kavb.nl/zoekresultaten'
COLS = ['genus', 'species', 'group', 'cultivar', 'registrant', 'registered', 'no_cultivation_since']


def genus_value(name):
    pg = urllib.request.urlopen(urllib.request.Request(FORM, headers=UA), timeout=30).read().decode('utf-8', 'replace')
    sel = re.search(r'<select name="genus".*?</select>', pg, re.S).group(0)
    for v, t in re.findall(r'<option value="([^"]*)"[^>]*>([^<]*)', sel):
        if t.strip().lower() == name.lower():
            return v
    raise SystemExit('genre inconnu du KAVB : ' + name)


def rows(page):
    """the result table as rows of cells"""
    out = []
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', page, re.S):
        cells = [html.unescape(re.sub(r'<[^>]+>', '', c)).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', tr, re.S)]
        if cells and cells[0] and cells[0].lower() != 'genus':
            out.append(cells)
    return out


def norm(s):
    return re.sub(r"[‘’'\"]", '', s).strip().lower()


def look(gv, name):
    data = urllib.parse.urlencode({'zoek': '', 'genus': gv, 'cultivar': name, 'cultivargroup': '', 'regfrom': '', 'regto': '', 'maincolour': '',
                                   'secondarycolour': '', 'sportof': '', 'edibulbcode': ''}).encode()
    page = urllib.request.urlopen(urllib.request.Request(POST, data=data, headers=UA), timeout=40).read().decode('utf-8', 'replace')
    hits = [dict(zip(COLS, r)) for r in rows(page)]
    return [h for h in hits if norm(h.get('cultivar', '')) == norm(name)], len(hits)


if __name__ == '__main__':
    genus, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
    names = [l.strip() for l in open(src, encoding='utf-8') if l.strip() and not l.startswith('#')]
    gv = genus_value(genus)
    res = {'source': FORM, 'consulte': time.strftime('%Y-%m-%d'), 'genre': genus, 'resultats': {}}
    found = 0
    for n in names:
        try:
            ex, tot = look(gv, n)
        except Exception as e:
            res['resultats'][n] = {'erreur': str(e)[:120]}
            continue
        res['resultats'][n] = ex if ex else {'absent': True, 'proches': tot}
        found += bool(ex)
        time.sleep(2)
    json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{genus}: {found}/{len(names)} au registre -> {out}')
