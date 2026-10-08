#!/usr/bin/env python
"""census.py: model-free census of the cultivars of a taxon (Belai's Flowers, sourcing standard docs/STANDARD-SOURCES.md).

  python census.py <sid> --taxon "<Genus species>" [--genus G] [--group "<horticultural group>"] [--kavb] [--max N] --out <dir>

Writes <dir>/census.json (cultivars with proofs, named photos, trademark hint, provisional level A-D, doubts) and
<dir>/douteux-<n>.json (batches of at most 20 doubtful cultivars for a Haiku agent). Cache and resume: <dir>/cache/.
Sources, all without account and without browser, polite (clear User-Agent, >= 1 s between two requests to a host, 3 tries with
backoff, a host that keeps failing is given up for the run): Wikidata, Wikimedia Commons, iNaturalist, GBIF, the KAVB register (--kavb,
read-only, through kavb.py), and the per-genus adapters of census-sources.json (see CENSUS.md). No photo is downloaded: only URLs."""
import sys, os, re, json, time, gzip, hashlib, argparse, unicodedata, threading, subprocess, difflib, tempfile, shutil
import html as htmlmod
import urllib.request, urllib.parse, urllib.error
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'BelaisFlowersCensus/0.1 (read-only reference census for a plant game; contact: github.com/MaliciousMusic)'
RANK = {'N1': 1, 'N2': 2, 'N3': 3, 'N4': 4}
KAVB_FORM = 'https://login.kavb.nl/siergewassen'
QOPEN, QCLOSE = "‘ʽ'`\"“«", "’ʼ'´\"”»"
ABBR = {'mme': 'madame', 'mlle': 'mademoiselle', 'pres': 'president', 'prof': 'professor', 'dr': 'doctor', 'st': 'saint', 'ste': 'sainte', 'mrs': 'mrs'}


# ---------------------------------------------------------------- text helpers
def fold(s):
    s = unicodedata.normalize('NFKD', s or '')
    return ''.join(c for c in s if not unicodedata.combining(c)).lower()


def ckey(name):
    """normal form of a cultivar name used to merge spellings (accents, quotes, case, Mme/Madame...)"""
    s = fold(name).replace('&', ' and ')
    s = re.sub(r'\bcv\b\.?', ' ', s)
    s = re.sub('[' + re.escape(QOPEN + QCLOSE) + ']', '', s)
    toks = [ABBR.get(t, t) for t in re.sub(r'[^a-z0-9]+', ' ', s).split()]
    return ' '.join(toks)


def tidy(s):
    """text of an html fragment: no tags, entities decoded, single spaces"""
    s = re.sub(r'<(script|style).*?</\1>', ' ', s or '', flags=re.S | re.I)
    s = htmlmod.unescape(re.sub(r'<[^>]+>', ' ', s))
    return re.sub(r'\s+', ' ', s).strip()


def dec(b):
    try:
        return b.decode('utf-8')
    except UnicodeDecodeError:
        return b.decode('cp1252', 'replace')


def parse_quoted(title):
    """"File:Syringa vulgaris 'Charles Joly' 02.jpg" -> ("Syringa vulgaris", "Charles Joly"); (None, None) if no quoted name"""
    t = re.sub(r'^(File|Category|Fichier|Catégorie):', '', (title or '').strip())
    t = re.sub(r'\.(jpe?g|png|tiff?|webp|gif|svg|pdf)$', '', t, flags=re.I)
    m = re.match(r"^(?P<pre>[^" + re.escape(QOPEN) + r"]*?)\s*[" + re.escape(QOPEN) + r"](?P<nom>.+)[" + re.escape(QCLOSE) + r"]", t)
    if not m:
        return None, None
    nom = re.sub(r'\s+', ' ', m.group('nom')).strip(' ,;')
    if not (2 <= len(nom) <= 60):
        return None, None
    return m.group('pre').strip(), nom


def taxon_of(pre):
    """"Syringa × hyacinthiflora" / "Syringa vulgaris var. alba" -> binomial; "Syringa" -> genus only"""
    pre = re.sub(r'\s+', ' ', (pre or '').replace('×', ' × ')).strip()
    m = re.match(r'^([A-Z][a-z]+)(?: (× )?([a-z][a-z-]+))?', pre)
    if not m:
        return None
    return m.group(1) + (' ' + (m.group(2) or '') + m.group(3) if m.group(3) else '')


def norm_tax(x):
    return fold(x).replace('×', '').replace('  ', ' ').strip()


def in_taxon(found, wanted):
    """None / genus only = unspecified, kept; otherwise the binomials must agree"""
    if not found or ' ' not in found.strip():
        return True
    return norm_tax(found) == norm_tax(wanted)


def clean_name(n):
    n = re.sub(r'[®™]|\((?:R|TM)\)', '', n or '')
    n = re.sub('^[' + re.escape(QOPEN) + r'\s]+|[' + re.escape(QCLOSE) + r'\s,;]+$', '', n)
    return re.sub(r'\s+', ' ', n).strip()


MARK_RE = re.compile(r'[®™]|\((?:R|TM)\)|\btrade ?mark\b|\bmarque d[ée]pos[ée]e\b|\bregistered trademark\b', re.I)


def mark_hint(text):
    m = MARK_RE.search(text or '')
    if not m:
        return None
    g = m.group(0)
    return '™' if g == '™' or g.upper() == '(TM)' or 'mark' in g.lower() or 'marque' in g.lower() else '®'


VUES = [('bouton', r'\bbuds?\b|bouton|knospe'), ('fruit', r'fruit|seed|capsule'), ('feuille', r'\bleaf\b|leaves|foliage|feuille'),
        ('tige', r'\bstems?\b|bark|branch|trunk|twig'), ('fleur', r'flower|inflorescence|panicle|bloom|blossom|cluster|floret|blüte'),
        ('plante', r'bush|shrub|habit|whole plant|\btree\b|hedge')]


def vue_of(txt):
    t = fold(txt)
    for v, rx in VUES:
        if re.search(rx, t):
            return v
    return None


# ---------------------------------------------------------------- polite cached HTTP
class Net:
    """GET only. Disk cache (resume), >= delay seconds between two requests to a host, 3 tries with backoff (Retry-After obeyed),
    a host that fails 4 times in a row (after its tries) is given up for the run."""

    def __init__(self, outdir, deadline):
        self.dir = os.path.join(outdir, 'cache')
        os.makedirs(self.dir, exist_ok=True)
        self.deadline = deadline
        self.stat = defaultdict(Counter)
        self.errors = defaultdict(list)
        self.last, self.fails, self.dead = {}, Counter(), {}
        self.hlock = defaultdict(threading.Lock)
        self.glock = threading.Lock()

    def _file(self, key):
        h = hashlib.sha1(key.encode('utf-8')).hexdigest()
        d = os.path.join(self.dir, h[:2])
        os.makedirs(d, exist_ok=True)
        return os.path.join(d, h)

    def _count(self, src, k):
        with self.glock:
            self.stat[src][k] += 1

    def _err(self, src, msg):
        with self.glock:
            if len(self.errors[src]) < 5:
                self.errors[src].append(msg[:160])

    def get(self, src, url, headers=None, delay=1.0, backoff=(6, 20, 60), timeout=45, tries=3, data=None):
        """data: urlencoded body of a read-only POST, only for the endpoints the owner authorised (KAVB form, listing of a grower)"""
        f = self._file(url if data is None else url + '\n' + data.decode('utf-8', 'replace'))
        if os.path.exists(f):
            raw = open(f, 'rb').read()
            head, _, body = raw.partition(b'\n')
            self._count(src, 'cache')
            if json.loads(head).get('status') == 200:
                self._count(src, 'ok')
                return body
            return None
        host = urllib.parse.urlsplit(url).netloc
        msg = ''
        for i in range(tries):
            if host in self.dead:
                self._err(src, 'hote abandonne: ' + self.dead[host])
                return None
            if self.deadline and time.time() > self.deadline:
                self._err(src, 'duree max atteinte')
                return None
            with self.hlock[host]:      # the lock is kept during the backoff on purpose: nobody else hits a host that says stop
                wait = self.last.get(host, 0) + delay - time.time()
                if wait > 0:
                    time.sleep(wait)
                req = urllib.request.Request(url, data=data, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip', **(headers or {})})
                self._count(src, 'req')
                code, ra, body = None, None, b''
                try:
                    with urllib.request.urlopen(req, timeout=timeout) as r:
                        body = r.read()
                        if r.headers.get('Content-Encoding') == 'gzip':
                            body = gzip.decompress(body)
                        code = r.status
                except urllib.error.HTTPError as e:
                    code, ra, msg = e.code, e.headers.get('Retry-After'), 'HTTP %d' % e.code
                except Exception as e:
                    msg = type(e).__name__ + ' ' + str(e)[:80]
                self.last[host] = time.time()
                if code == 200:
                    self.fails[host] = 0
                    self._count(src, 'ok')
                    self._store(f, 200, url, body)
                    return body
                if code in (404, 410):
                    self._store(f, code, url, b'')
                    self._count(src, 'st%d' % code)
                    self._err(src, 'HTTP %d %s' % (code, url[:90]))
                    return None
                self._count(src, 'st%s' % (code or 'exc'))
                self._err(src, '%s %s' % (msg, url[:90]))
                if code is not None and code < 500 and code != 429:
                    return None
                pause = backoff[min(i, len(backoff) - 1)]
                if ra and ra.isdigit():
                    pause = max(pause, min(int(ra), 120))
                if i < tries - 1:
                    time.sleep(pause)
        with self.glock:
            self.fails[host] += 1
            if self.fails[host] >= 4:
                self.dead[host] = msg or 'echecs repetes'
        self._count(src, 'err')
        return None

    def _store(self, f, status, url, body):
        tmp = f + '.tmp%d' % threading.get_ident()
        with open(tmp, 'wb') as o:
            o.write(json.dumps({'url': url, 'status': status, 'ts': int(time.time())}).encode() + b'\n' + body)
        os.replace(tmp, f)

    def json(self, src, url, **kw):
        b = self.get(src, url, **kw)
        if b is None:
            return None
        try:
            return json.loads(dec(b))
        except ValueError:
            self._err(src, 'json illisible ' + url[:80])
            return None

    def text(self, src, url, **kw):
        b = self.get(src, url, **kw)
        return None if b is None else dec(b)


def pdf_text(net, src, url):
    """text of a PDF register: pdftotext, else PyMuPDF, else pypdf (the extracted text is cached next to the PDF)"""
    b = net.get(src, url, delay=2.0, timeout=120)
    if b is None:
        return None
    cf = net._file('pdftext:' + url)
    if os.path.exists(cf):
        return dec(open(cf, 'rb').read()).replace('\r\n', '\n').replace('\r', '\n')
    txt = None
    tmpd = tempfile.mkdtemp(prefix='census-pdf-')
    try:
        pf = os.path.join(tmpd, 'in.pdf')
        open(pf, 'wb').write(b)
        if shutil.which('pdftotext'):
            r = subprocess.run(['pdftotext', '-layout', '-enc', 'UTF-8', pf, '-'], capture_output=True, timeout=300)
            if r.returncode == 0:
                txt = dec(r.stdout)
        if txt is None:
            try:
                import fitz
                txt = '\n'.join(p.get_text() for p in fitz.open(pf))
            except Exception:
                import pypdf
                txt = '\n'.join((p.extract_text() or '') for p in pypdf.PdfReader(pf).pages)
    except Exception as e:
        net._err(src, 'pdf illisible: %s' % str(e)[:80])
    finally:
        shutil.rmtree(tmpd, ignore_errors=True)
    if txt:
        txt = txt.replace('\r\n', '\n').replace('\r', '\n')
        open(cf, 'wb').write(txt.encode('utf-8'))
    return txt


# ---------------------------------------------------------------- findings (what each source returns)
def finding(nom, taxon=None, **kw):
    f = {'nom': nom, 'taxon': taxon, 'synonymes': [], 'groupe': None, 'obtenteur': None, 'annee': None, 'couleur': None,
         'preuves': [], 'photos': [], 'marque': None, 'extra': {}, 'doutes': []}
    f.update(kw)
    return f


def photo(img, page, licence, auteur, source, niveau, thumb=None, vue=None):
    return {'img': img, 'page': page, 'licence': licence, 'auteur': auteur, 'source': source, 'niveau': niveau, 'thumb': thumb, 'vue': vue}


class Ctx:
    def __init__(self, a, net):
        self.sid, self.taxon, self.group, self.net, self.a = a.sid, a.taxon, a.group, net, a
        self.genus = a.genus or a.taxon.split()[0]
        self.epithet = a.taxon.split()[1] if len(a.taxon.split()) > 1 else ''
        self.out = a.out
        self.photos_par = a.photos_par


# ---------------------------------------------------------------- source 1: Wikidata
WD_LANGS = '"en","mul","fr","de","nl","ru","sv","es","it","pl"'
WD_QUERY = '''SELECT ?c (SAMPLE(?l) AS ?label) (SAMPLE(?cat) AS ?commons) (GROUP_CONCAT(DISTINCT ?img; separator="|") AS ?imgs)
 (SAMPLE(?inc) AS ?inception) (GROUP_CONCAT(DISTINCT ?devl; separator="|") AS ?devs) (SAMPLE(?par) AS ?parent)
WHERE {
  ?c wdt:P31 wd:Q4886 .
  { ?c rdfs:label ?l . FILTER(LANG(?l) IN (%(langs)s) && STRSTARTS(?l, "%(genus)s")) }
  UNION { ?c wdt:P171 ?t . ?t wdt:P225 "%(taxon)s" . ?c rdfs:label ?l . FILTER(LANG(?l) IN (%(langs)s)) }
  OPTIONAL { ?c wdt:P373 ?cat } OPTIONAL { ?c wdt:P18 ?img } OPTIONAL { ?c wdt:P571 ?inc }
  OPTIONAL { ?c wdt:P178 ?dev . ?dev rdfs:label ?devl FILTER(LANG(?devl)="en") }
  OPTIONAL { ?c wdt:P171 ?p . ?p wdt:P225 ?par }
} GROUP BY ?c'''


def src_wikidata(ctx):
    info = {'nom': 'Wikidata', 'url': 'https://query.wikidata.org', 'n': 0, 'statut': ''}
    q = WD_QUERY % {'langs': WD_LANGS, 'genus': ctx.genus, 'taxon': ctx.taxon}
    url = 'https://query.wikidata.org/sparql?' + urllib.parse.urlencode({'query': q, 'format': 'json'})
    # wdqs rate limit: 1 query a minute at the worst, hence one query per run and a long backoff
    j = ctx.net.json('wikidata', url, headers={'Accept': 'application/sparql-results+json'}, delay=2, backoff=(45, 75), timeout=110)
    if j is None:
        info['statut'] = 'sans reponse: ' + '; '.join(ctx.net.errors['wikidata'][:1])
        return [], info, {}
    out, skipped = [], 0
    for b in j['results']['bindings']:
        g = lambda k: b.get(k, {}).get('value', '')
        pre, nom = parse_quoted(g('label'))
        if not nom:
            skipped += 1
            continue
        tx = taxon_of(pre)
        if (not tx or ' ' not in tx) and g('parent'):
            tx = g('parent')
        f = finding(nom, tx, obtenteur=g('devs').split('|')[0] or None, annee=(re.search(r'\d{4}', g('inception')) or [None])[0])
        f['preuves'].append({'niveau': 'N4', 'source': 'Wikidata', 'url': g('c')})
        for u in [x for x in g('imgs').split('|') if x][:4]:
            fn = urllib.parse.unquote(u.rsplit('/', 1)[-1])
            f['photos'].append(photo(u.replace('http://', 'https://'), 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(fn.replace(' ', '_')),
                                     'voir la page Commons', None, 'Wikidata P18', 'N4', vue=vue_of(fn)))
        if g('commons'):
            f['extra']['commons_categorie'] = g('commons')
        out.append(f)
    info['n'] = len(out)
    info['statut'] = 'ok' + (' (%d sans nom entre guillemets)' % skipped if skipped else '')
    return out, info, {}


# ---------------------------------------------------------------- source 2: Wikimedia Commons
CM = 'https://commons.wikimedia.org/w/api.php?'
SKIP = re.compile(r'stamp|briefmarke|timbre|postage|envelope|herbarium|drawing|illustrat|plate|botanical art|\.svg|\.tif|\.pdf|\bmap\b|logo|coat of arms|painting|poster|label', re.I)


def commons_api(ctx, **p):
    p.update(format='json', formatversion='2')
    return ctx.net.json('commons', CM + urllib.parse.urlencode(p), delay=1.2, backoff=(8, 25, 60))


def commons_subcats(ctx, title):
    out, cont = [], None
    for _ in range(4):
        p = dict(action='query', list='categorymembers', cmtitle=title, cmtype='subcat', cmlimit=500)
        if cont:
            p['cmcontinue'] = cont
        j = commons_api(ctx, **p)
        if not j:
            break
        out += [m['title'] for m in j.get('query', {}).get('categorymembers', [])]
        cont = j.get('continue', {}).get('cmcontinue')
        if not cont:
            break
    return out


def commons_photos(pages, src='Wikimedia Commons'):
    out = []
    for pg in pages:
        ii = (pg.get('imageinfo') or [{}])[0]
        title = pg.get('title', '')
        if not ii.get('url') or SKIP.search(title) or not str(ii.get('mime', '')).startswith('image/') or ii.get('mime') in ('image/svg+xml', 'image/tiff'):
            continue
        if (ii.get('width') or 0) < 400:
            continue
        md = ii.get('extmetadata') or {}
        v = lambda k: tidy((md.get(k) or {}).get('value', ''))
        out.append(photo(ii['url'], ii.get('descriptionurl') or 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')),
                         v('LicenseShortName') or None, v('Artist') or None, src, 'N4', thumb=commons_thumb(ii['url']),
                         vue=vue_of(title + ' ' + v('ImageDescription'))))
    return out


def commons_thumb(url, w=500):
    """the 500 px rendering of a Commons file, from the file URL (asking the API for thumburl makes it render each thumbnail: 5 s a request)"""
    # Commons serves only its standard thumbnail widths (https://w.wiki/GHai: 330, 500, 960, 1280...); the API's file URL may carry a ?utm query
    m = re.match(r'^(https://upload\.wikimedia\.org/wikipedia/commons)/([0-9a-f]/[0-9a-f]{2}/([^/]+))$', url.split('?')[0])
    return '%s/thumb/%s/%dpx-%s' % (m.group(1), m.group(2), w, m.group(3)) if m else None


IIPROP = dict(prop='imageinfo', iiprop='url|extmetadata|mime|size', iiextmetadatafilter='LicenseShortName|Artist|ImageDescription')


def src_commons(ctx):
    info = {'nom': 'Wikimedia Commons', 'url': 'https://commons.wikimedia.org', 'n': 0, 'statut': ''}
    roots = []
    for r in ('Category:%s cultivars' % ctx.genus, 'Category:%s' % ctx.taxon, 'Category:%s cultivars' % ctx.taxon):
        if r not in roots:
            roots.append(r)
    seen, queue, cultcats, other = set(), [(r, 0) for r in roots], {}, []
    while queue:
        title, d = queue.pop(0)
        if title in seen or ctx.net.stat['commons']['req'] > ctx.a.commons_req:
            continue
        seen.add(title)
        for s in commons_subcats(ctx, title):
            pre, nom = parse_quoted(s)
            if nom:
                tx = taxon_of(pre)
                if tx and tx.split()[0] == ctx.genus:
                    cultcats[s] = (nom, tx)
            elif d + 1 < 2 and re.search(r'cultivar|hybrid|variet|group|by ', s, re.I):
                queue.append((s, d + 1))
    out, hors = [], []
    byname = {}
    for cat, (nom, tx) in cultcats.items():
        if not in_taxon(tx, ctx.taxon):
            hors.append({'nom': nom, 'taxon': tx, 'source': 'Wikimedia Commons'})
            continue
        byname[ckey(nom)] = (cat, nom, tx)
    for k, (cat, nom, tx) in byname.items():
        if ctx.net.stat['commons']['req'] > ctx.a.commons_req or ctx.net.dead.get('commons.wikimedia.org'):
            break
        j = commons_api(ctx, action='query', generator='categorymembers', gcmtitle=cat, gcmtype='file', gcmlimit=ctx.photos_par + 4, **IIPROP)
        pages = (j or {}).get('query', {}).get('pages', [])
        f = finding(nom, tx if ' ' in tx else None)
        f['preuves'].append({'niveau': 'N4', 'source': 'Wikimedia Commons', 'url': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(cat.replace(' ', '_'))})
        f['photos'] = commons_photos(pages)[:ctx.photos_par]
        out.append(f)
    # cultivar names that only appear in file titles of the species category
    known = set(byname)
    titles = []
    for root in roots[1:]:
        j = commons_api(ctx, action='query', list='categorymembers', cmtitle=root, cmtype='file', cmlimit=500)
        titles += [m['title'] for m in (j or {}).get('query', {}).get('categorymembers', [])]
    pend = defaultdict(list)
    for t in titles:
        pre, nom = parse_quoted(t)
        if nom and ckey(nom) not in known and in_taxon(taxon_of(pre), ctx.taxon) and not SKIP.search(t):
            pend[nom].append(t)
    batch = [t for nom in pend for t in pend[nom][:2]][:150]
    pages = []
    for i in range(0, len(batch), 40):
        j = commons_api(ctx, action='query', titles='|'.join(batch[i:i + 40]), **IIPROP)
        pages += (j or {}).get('query', {}).get('pages', [])
    for nom, ts in pend.items():
        ph = commons_photos([p for p in pages if p.get('title') in ts])
        f = finding(nom, None)
        f['preuves'].append({'niveau': 'N4', 'source': 'Wikimedia Commons', 'url': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(ts[0].replace(' ', '_'))})
        f['photos'] = ph[:ctx.photos_par]
        f['doutes'].append('nom_tire_dun_titre_de_fichier')
        out.append(f)
    info['n'] = len(out)
    dead = ctx.net.dead.get('commons.wikimedia.org')
    info['statut'] = ('ok' if not dead else 'partiel: hote abandonne (%s), relancer pour reprendre' % dead) + \
                     (', %d categories de cultivars' % len(cultcats))
    return out, info, {'hors_taxon': hors}


# ---------------------------------------------------------------- source 3: iNaturalist
def src_inat(ctx):
    info = {'nom': 'iNaturalist', 'url': 'https://www.inaturalist.org', 'n': 0, 'statut': ''}
    base = 'https://api.inaturalist.org/v1'
    kw = dict(delay=1.2, backoff=(8, 25, 60))
    j = ctx.net.json('inat', base + '/taxa?' + urllib.parse.urlencode({'q': ctx.taxon, 'per_page': 6}), **kw)
    tid = None
    for t in (j or {}).get('results', []):
        if fold(t.get('name', '')) == fold(ctx.taxon):
            tid = t['id']
            break
    if not tid:
        info['statut'] = 'taxon introuvable' if j else 'sans reponse'
        return [], info, {}
    tp = []
    stages = [('fleur', 13), ('bouton', 15), ('fruit', 14), (None, None)]
    for stade, tv in stages:
        p = {'taxon_id': tid, 'quality_grade': 'research', 'photos': 'true', 'photo_license': 'cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa',
             'per_page': ctx.a.inat_par, 'order_by': 'votes'}
        if tv:
            p.update(term_id=12, term_value_id=tv)
        jo = ctx.net.json('inat', base + '/observations?' + urllib.parse.urlencode(p), **kw)
        for o in (jo or {}).get('results', []):
            for ph in (o.get('photos') or [])[:1]:
                u = ph.get('url') or ''
                if not u:
                    continue
                d = photo(u.replace('/square.', '/large.'), o.get('uri'), (ph.get('license_code') or o.get('license_code') or 'cc').upper().replace('CC-', 'CC '),
                          ph.get('attribution') or (o.get('user') or {}).get('login'), 'iNaturalist', 'N3', vue=stade or vue_of(o.get('description') or ''))
                d['stade'] = stade
                d['observe'] = o.get('observed_on')
                tp.append(d)
    # infraspecific taxa that carry a quoted cultivar epithet (rare)
    out = []
    ji = ctx.net.json('inat', base + '/taxa?' + urllib.parse.urlencode({'taxon_id': tid, 'rank': 'variety,form,subspecies,infrahybrid', 'per_page': 100}), **kw)
    for t in (ji or {}).get('results', []):
        pre, nom = parse_quoted(t.get('name', ''))
        if nom:
            f = finding(nom, taxon_of(pre))
            f['preuves'].append({'niveau': 'N3', 'source': 'iNaturalist', 'url': 'https://www.inaturalist.org/taxa/%s' % t['id']})
            out.append(f)
    info['n'] = len(tp)
    info['statut'] = 'ok: %d photos du taxon (fleur, bouton, fruit, plante), %d cultivars' % (len(tp), len(out))
    return out, info, {'photos_taxon': tp}


# ---------------------------------------------------------------- source 4: GBIF
def src_gbif(ctx):
    info = {'nom': 'GBIF', 'url': 'https://api.gbif.org', 'n': 0, 'statut': ''}
    base = 'https://api.gbif.org/v1'
    kw = dict(delay=1.0)
    m = ctx.net.json('gbif', base + '/species/match?' + urllib.parse.urlencode({'name': ctx.taxon, 'kingdom': 'Plantae'}), **kw)
    if not m or not m.get('usageKey'):
        info['statut'] = 'taxon introuvable' if m is not None else 'sans reponse'
        return [], info, {}
    key = m.get('acceptedUsageKey') or m['usageKey']
    syn = ctx.net.json('gbif', base + '/species/%s/synonyms?limit=100' % key, **kw)
    names = sorted({s.get('scientificName', '') for s in (syn or {}).get('results', []) if s.get('scientificName')})
    out = []
    sr = ctx.net.json('gbif', base + '/species/search?' + urllib.parse.urlencode({'q': ctx.taxon, 'rank': 'CULTIVAR', 'limit': 100}), **kw)
    for r in (sr or {}).get('results', []):
        pre, nom = parse_quoted(r.get('scientificName') or r.get('canonicalName') or '')
        if nom and in_taxon(taxon_of(pre), ctx.taxon):
            f = finding(nom, taxon_of(pre))
            f['preuves'].append({'niveau': 'N4', 'source': 'GBIF', 'url': 'https://www.gbif.org/species/%s' % r.get('key')})
            out.append(f)
    info['n'] = len(out)
    info['statut'] = 'ok: nom accepte %s, %d synonymes, %d cultivars' % (m.get('scientificName', '?'), len(names), len(out))
    return out, info, {'taxon_info': {'gbif_cle': key, 'nom_accepte': m.get('scientificName'), 'statut': m.get('status'), 'synonymes': names[:60],
                                      'url': 'https://www.gbif.org/species/%s' % key}}


# ---------------------------------------------------------------- source 5: KAVB register (read-only, through kavb.py)
def src_kavb(ctx, names):
    """one kavb.py run per chunk of 25 names: it holds the shared lock and the 2 s delay. Results are kept in <out>/kavb-cache.json."""
    info = {'nom': 'KAVB (registre)', 'url': KAVB_FORM, 'n': 0, 'statut': ''}
    cf = os.path.join(ctx.out, 'kavb-cache.json')
    cache = json.load(open(cf, encoding='utf-8')) if os.path.exists(cf) else {}
    todo = [n for n in names if n not in cache]
    stat = ctx.net.stat['kavb']
    for i in range(0, len(todo), 25):
        chunk = todo[i:i + 25]
        nf, of = os.path.join(ctx.out, 'kavb-noms.txt'), os.path.join(ctx.out, 'kavb-out.json')
        open(nf, 'w', encoding='utf-8').write('# genus: %s\n' % ctx.genus + '\n'.join(chunk) + '\n')
        if os.path.exists(of):
            os.remove(of)
        try:
            p = subprocess.run([sys.executable, os.path.join(HERE, 'kavb.py'), ctx.genus, nf, of], capture_output=True, text=True,
                               encoding='utf-8', errors='replace', timeout=25 * 8 + 900)
        except subprocess.TimeoutExpired:
            info['statut'] = 'delai depasse'
            break
        stat['req'] += len(chunk) + 1
        if p.returncode != 0 or not os.path.exists(of):
            info['statut'] = ((p.stderr or p.stdout or 'echec').strip().splitlines() or ['echec'])[-1][:120]
            stat['err'] += 1
            break
        cache.update(json.load(open(of, encoding='utf-8')).get('resultats', {}))
        stat['ok'] += len(chunk)
        json.dump(cache, open(cf, 'w', encoding='utf-8'), ensure_ascii=False)
    out = []
    for n in names:
        res = cache.get(n)
        if res is None:
            continue
        f = finding(n)
        if isinstance(res, list) and res:
            row = next((r for r in res if norm_tax(((r.get('genus') or '') + ' ' + (r.get('species') or '')).strip()) == norm_tax(ctx.taxon)), res[0])
            d = row.get('registered', '')
            an = (re.search(r'(\d{4})\s*$', d) or re.search(r'(\d{4})', d) or [None, None])[1]
            f['preuves'].append({'niveau': 'N1', 'source': 'KAVB', 'url': KAVB_FORM, 'registre': True})
            f['obtenteur'], f['annee'], f['groupe'] = row.get('registrant') or None, an, row.get('group') or None
            f['extra']['kavb'] = {'statut': 'enregistré', 'nb_fiches': len(res), 'source': KAVB_FORM, 'consulte': time.strftime('%Y-%m-%d'),
                                  'nom_registre': row.get('cultivar'), 'groupe': row.get('group') or '', 'enregistrant': row.get('registrant') or '',
                                  'date_enregistrement': d, 'annee_registre': an, 'non_cultive_depuis': row.get('no_cultivation_since') or ''}
            info['n'] += 1
        elif isinstance(res, dict) and res.get('absent'):
            f['extra']['kavb'] = {'statut': 'absent', 'proches': res.get('proches'), 'source': KAVB_FORM, 'consulte': time.strftime('%Y-%m-%d')}
        else:
            continue
        out.append(f)
    info['statut'] = info['statut'] or 'ok: %d/%d noms interroges, %d au registre' % (len([n for n in names if n in cache]), len(names), info['n'])
    return out, info


# ---------------------------------------------------------------- source 6: per-genus adapters (census-sources.json)
def rxf(s):
    return sum({'i': re.I, 's': re.S, 'm': re.M, 'x': re.X}[c] for c in s)


def expand_taxon(v, genus):
    if not v:
        return None
    v = re.sub(r'\s+', ' ', v.replace('×', ' × ')).strip()
    v = re.sub(r'^([A-Z][a-z]+) ([A-Z])', lambda m: m.group(1) + ' ' + m.group(2).lower(), v)
    m = re.match(r'^([A-Z])\. ?(.*)$', v)
    if m and genus.startswith(m.group(1)):
        v = genus + ' ' + m.group(2)
    elif re.match(r'^[×a-z]', v):
        v = genus + ' ' + v
    return taxon_of(v) or v


def fill(tpl, ctx, **kv):
    vs = dict(genre=ctx.genus, genre_lc=ctx.genus.lower(), taxon=ctx.taxon, taxon_lc=ctx.taxon.lower().replace(' ', '-'), espece=ctx.epithet,
              groupe=ctx.group or '', **kv)
    return re.sub(r'\{(\w+)\}', lambda m: urllib.parse.quote(str(vs[m.group(1)]), safe='-_.~') if m.group(1) in vs else m.group(0), tpl)


def year_of(v):
    m = re.search(r'(1[4-9]\d\d|20\d\d)', v or '')
    if not m:
        return None
    return ('avant ' if re.search(r'pre|before|avant|vor', (v or '')[:m.start()], re.I) else '') + m.group(1)


def enrich(block, regexes, flags):
    """named groups of the first regex that matches, then those of the following ones (they only add what is still missing)"""
    g = {}
    for rx in regexes:
        m = re.search(rx, block, flags)
        if m:
            for k, v in m.groupdict().items():
                if v is not None and k not in g:
                    g[k] = v
    return g


def names_from_list(v):
    if '`' in v or '‘' in v:
        ns = re.findall(r"[`‘](.+?)['’](?=[\s,;.)(]|$)", v)
    else:
        ns = [x.strip() for x in re.split(r'[;,]', v)]
    return [clean_name(x) for x in ns if clean_name(x) and clean_name(x).lower() not in ('etc', 'etc.', '?')]


def jget(item, path):
    cur = item
    for k in path.split('.'):
        if isinstance(cur, dict):
            cur = cur.get(k)
        elif isinstance(cur, list) and k.isdigit() and int(k) < len(cur):
            cur = cur[int(k)]
        else:
            return ''
    return '' if cur is None else str(cur)


def json_entries(text, L):
    """liste.format "json": liste.chemin (dotted path of the list) and liste.champs {group: template with {dotted.path} of the item}"""
    try:
        items = json.loads(text)
    except ValueError:
        return
    for k in (L.get('chemin') or '').split('.'):
        if k:
            items = items.get(k, []) if isinstance(items, dict) else []
    for it in items or []:
        g = {}
        for champ, tpl in L['champs'].items():
            vals = [jget(it, m[0]) for m in re.findall(r'\{([\w.]+)(\|slug)?\}', tpl)]
            if all(vals):
                g[champ] = re.sub(r'\{([\w.]+)(\|slug)?\}', lambda m: urllib.parse.quote(jget(it, m.group(1)).replace(' ', '-')) if m.group(2) else jget(it, m.group(1)), tpl).strip()
        yield g, json.dumps(it, ensure_ascii=False)


def adapter_entries(text, L, fl):
    if L.get('format') == 'json':
        yield from json_entries(text, L)
        return
    regs =L['entree'] if isinstance(L['entree'], list) else [L['entree']]
    if L.get('decoupe'):
        starts = [m.start() for m in re.finditer(L['decoupe'], text, rxf(L.get('decoupe_flags', 'm')))]
        for s, e in zip(starts, starts[1:] + [len(text)]):
            b = text[s:e]
            m = re.search(regs[0], b, fl)
            if m:
                g = {k: v for k, v in m.groupdict().items() if v is not None}
                for k, v in enrich(b, regs[1:], fl).items():
                    g.setdefault(k, v)
                yield g, b
    else:
        for m in re.finditer(regs[0], text, fl):
            g = {k: v for k, v in m.groupdict().items() if v is not None}
            for k, v in enrich(m.group(0), regs[1:], fl).items():
                g.setdefault(k, v)
            yield g, m.group(0)


def adapter_finding(ctx, ad, g, raw, page):
    pdf = ad['liste'].get('format') == 'pdf'
    nom0 = tidy(g.get('nom', ''))
    nom = nom0
    for pat, rep in ad.get('nettoyage_nom', []):
        nom = re.sub(pat, rep, nom)
    nom = clean_name(nom)
    if not nom or len(nom) > 70:
        return None
    mark = mark_hint(nom0) or (None if pdf else mark_hint(raw))
    G = {k: (re.sub(r'\s+', ' ', v).strip() if pdf else tidy(v)) for k, v in g.items()}
    for k, mp in ad.get('legendes', {}).items():
        if k in G:
            if k == 'couleur':
                G[k] = re.sub(r'[IVX]+', lambda m: mp.get(m.group(0), m.group(0)), G[k])
            else:
                G[k] = mp.get(G[k], G[k])
    for k, pairs in ad.get('nettoyage_champs', {}).items():
        if k in G:
            for pat, rep in pairs:
                G[k] = re.sub(pat, rep, G[k]).strip()
            if not G[k]:
                del G[k]
    url = urllib.parse.urljoin(page, htmlmod.unescape(g['url'])) if g.get('url') else page
    f = finding(nom, expand_taxon(G.get('espece'), ctx.genus), groupe=G.get(ad.get('groupe_depuis', 'groupe')), obtenteur=G.get('obtenteur'),
                annee=year_of(G.get('annee')), couleur=G.get('couleur'))
    if f['couleur'] and G.get('x_rgb_fleur'):
        f['couleur'] += ' (RGB %s)' % G['x_rgb_fleur']
    f['synonymes'] = names_from_list(G['syn']) if G.get('syn') else []
    f['preuves'].append({'niveau': ad['niveau'], 'source': ad['nom'], 'url': url, 'registre': bool(ad.get('registre')) and ad['niveau'] == 'N1'})
    if g.get('img'):
        f['photos'].append(photo(urllib.parse.urljoin(page, htmlmod.unescape(g['img'])), url, ad.get('licence', 'droits réservés (mesure locale seulement)'),
                                 ad['nom'], ad['id'], ad['niveau'], vue='fleur'))
    if mark:
        f['marque'] = {'indice': mark, 'ou': ad['nom'], 'url': url}
    for k, v in G.items():
        if k.startswith('x_'):
            f['extra'][k[2:]] = v
    for rule in ad.get('doutes_si', []):
        if re.search(rule['regex'], G.get(rule['champ'], ''), re.I):
            f['doutes'].append(rule['doute'])
    return f


def run_adapter(ctx, ad):
    info = {'nom': ad['nom'], 'url': ad.get('url', ''), 'n': 0, 'statut': '', 'niveau': ad['niveau']}
    src = 'adapter:' + ad['id']
    L = ad['liste']
    delay = ad.get('delai', 1.5)
    fl = rxf(L.get('flags', 'is'))
    pdf = L.get('format') == 'pdf'
    entries, pages, seen_nom = [], 0, set()
    it = L.get('iter') or {}
    plan = []
    for tpl in L['urls']:
        if 'n' in it:
            plan.append((tpl, 'n', range(it['n'][0], it['n'][1] + 1)))
        elif 'lettre' in it:
            a, b = it['lettre'].split('-')
            plan.append((tpl, 'lettre', [chr(c) for c in range(ord(a), ord(b) + 1)]))
        else:
            plan.append((tpl, None, [None]))
    for tpl, var, vals in plan:
        for v in vals:
            url = fill(tpl, ctx, **({var: v} if var else {}))
            before, guard = len(entries), 0
            while url and guard < ad.get('pages_max', 60):
                guard += 1
                if L.get('post'):       # read-only POST of a listing the owner authorised (no account, no personal data, >= 2 s)
                    kv = {var: v} if var else {}
                    body = urllib.parse.urlencode({k: fill(str(x), ctx, **kv) for k, x in L['post'].items()}).encode()
                    text = ctx.net.text(src, url, data=body, delay=max(delay, 2.0),
                                        headers={'X-Requested-With': 'XMLHttpRequest', 'Referer': ad.get('url', url)})
                else:
                    text = pdf_text(ctx.net, src, url) if pdf else ctx.net.text(src, url, delay=delay)
                pages += 1
                if text is None:
                    break
                got = list(adapter_entries(text, L, fl))
                fresh = [(g, raw) for g, raw in got if g.get('nom') not in seen_nom]      # a page past the end may repeat the last one
                seen_nom |= {g.get('nom') for g, _ in got}
                got = fresh
                if not got:
                    break
                entries += [(g, raw, url) for g, raw in got]
                nxt = re.search(L['suivant'], text, fl) if L.get('suivant') else None
                url = urllib.parse.urljoin(url, htmlmod.unescape(nxt.group(1))) if nxt else None
            if var == 'n' and len(entries) == before:
                break
    out = [f for f in (adapter_finding(ctx, ad, g, raw, page) for g, raw, page in entries) if f]
    fc = ad.get('fiche')
    if fc and out:
        ffl = rxf(fc.get('flags', 'is'))
        for f in out[:fc.get('max', 30)]:
            u = f['preuves'][0]['url']
            t = ctx.net.text(src, u, delay=delay)
            if not t:
                continue
            g = {k: tidy(v) for k, v in enrich(t, fc.get('entree', []), ffl).items()}
            f['couleur'] = f['couleur'] or g.get('couleur')
            f['obtenteur'] = f['obtenteur'] or g.get('obtenteur')
            f['annee'] = f['annee'] or year_of(g.get('annee'))
            for im in (re.findall(fc['images'], t, ffl)[:4] if fc.get('images') else []):
                f['photos'].append(photo(urllib.parse.urljoin(u, htmlmod.unescape(im)), u, ad.get('licence', 'droits réservés (mesure locale seulement)'),
                                         ad['nom'], ad['id'], ad['niveau']))
    info['n'] = len(out)
    errs = ctx.net.errors[src]
    info['statut'] = ('ok: %d entrées, %d pages' % (len(out), pages)) if out else ('aucune entrée: ' + ('; '.join(errs[:1]) or 'motif sans résultat'))
    return out, info


# ---------------------------------------------------------------- merge, provisional level, doubts
GENERIC = set('white blue pink red yellow purple orange green black lilac violet rose mauve dark light double single early late mix mixed '
              'blanc bleu rouge jaune noir wit blauw roze rood geel paars'.split())


def pick(cands):
    """the value from the best source level (N1 first), ties by first seen"""
    return min(cands, key=lambda c: c[0])[2] if cands else None


def merge(findings, ctx, cfg):
    pool = {}
    for src, f in findings:
        nom = clean_name(f['nom'])
        k = ckey(nom)
        if len(k) < 2:
            continue
        lv = min([RANK[p['niveau']] for p in f['preuves']] or [4])
        if f['taxon'] and ' ' in f['taxon'].strip() and not in_taxon(f['taxon'], ctx.taxon):
            k += '|' + norm_tax(f['taxon'])         # a homonym of another taxon is not the same cultivar
        r = pool.setdefault(k, {'cle': k, 'noms': [], 'tax': {}, 'obt': [], 'an': [], 'grp': [], 'col': [], 'syn': set(), 'preuves': [], 'photos': [],
                                'marques': [], 'extra': {}, 'doutes': set(), 'srcs': set(), 'colsrc': {}})
        r['noms'].append((lv, nom))
        if f['taxon'] and ' ' in f['taxon'].strip():
            r['tax'][f['taxon']] = min(r['tax'].get(f['taxon'], 9), lv)
        for key, fld in (('obt', 'obtenteur'), ('an', 'annee'), ('grp', 'groupe'), ('col', 'couleur')):
            if f[fld]:
                r[key].append((lv, src, f[fld]))
        if f['couleur']:
            r['colsrc'][src] = f['couleur']
        r['syn'] |= set(f['synonymes'])
        r['preuves'] += f['preuves']
        r['photos'] += f['photos']
        if f['marque']:
            r['marques'].append(f['marque'])
        for kx, vx in f['extra'].items():
            r['extra'].setdefault(kx, vx)
        r['doutes'] |= set(f['doutes'])
        r['srcs'].add(src)
    cults, hors = [], []
    for k, r in pool.items():
        # taxon: the best-level attestation decides
        tx = min(r['tax'], key=lambda t: (r['tax'][t], not in_taxon(t, ctx.taxon))) if r['tax'] else None
        nom = min(r['noms'], key=lambda x: x[0])[1]
        if tx and not in_taxon(tx, ctx.taxon):
            hors.append({'nom': nom, 'taxon': tx, 'sources': sorted(r['srcs'])})
            continue
        seen_p, preuves = set(), []
        for p in sorted(r['preuves'], key=lambda p: RANK[p['niveau']]):
            kk = p['source']
            if kk not in seen_p:
                seen_p.add(kk)
                preuves.append({x: p[x] for x in ('niveau', 'source', 'url')})
        seen_i, photos = set(), []
        for ph in sorted(r['photos'], key=lambda p: RANK[p['niveau']]):
            kk = urllib.parse.unquote(re.sub(r'^https?://', '', ph['page'] or ph['img'])).lower()
            if kk in seen_i or ph['img'] in seen_i:
                continue
            seen_i.add(kk)
            seen_i.add(ph['img'])
            photos.append({x: ph[x] for x in ('img', 'page', 'licence', 'auteur', 'source', 'niveau', 'thumb', 'vue') if ph.get(x)})
        spell = Counter(n for _, n in r['noms'])
        syn = sorted((r['syn'] | set(spell)) - {nom})
        mk = next((m for m in r['marques'] if m['indice']), None)
        regs = sorted({p['source'] for p in r['preuves'] if p.get('registre') and p['niveau'] == 'N1'})
        c = {'nom': nom, 'cle': k, 'registres': regs, 'synonymes': syn, 'groupe': pick(r['grp']), 'obtenteur': pick(r['obt']), 'annee': pick(r['an']),
             'taxon': tx, 'preuves': preuves, 'photos': photos, 'couleur_texte': pick(r['col']),
             'marque': dict(mk) if mk else {'indice': None, 'ou': None, 'url': None},
             'kavb': r['extra'].pop('kavb', None), 'doutes': set(r['doutes']), 'extra': r['extra']}
        if len(set(r['colsrc'].values())) > 1:
            c['extra']['couleurs_par_source'] = r['colsrc']
        yrs = {re.sub(r'\D', '', str(a)) for lv, s, a in r['an'] if lv <= 2}
        if len(yrs) > 1:
            c['doutes'].add('annee_discordante')
        cults.append(c)
    return cults, hors


def photo_key(p):
    return ('commons', p.get('auteur') or '?') if p['source'].startswith(('Wikimedia', 'Wikidata')) else (p['source'],)


def level(c):
    """provisional evidence level A-D (STANDARD-SOURCES.md section 3, as asked for the census):
    A: a name proof N1 and a photo from an N2 source, or a name proof N1/N2 and two independent named photos one of which is N2/N3;
    B: a photo and one N2/N3 piece of evidence plus another independent source; C: one named photo (N3/N4, or several N4); D: no photo."""
    ph = c['photos']
    if not ph:
        return 'D'
    nl = {p['niveau'] for p in c['preuves']}
    pl = {p['niveau'] for p in ph}
    indep = {photo_key(p) for p in ph}
    if 'N1' in nl and 'N2' in pl:
        return 'A'
    if nl & {'N1', 'N2'} and len(indep) >= 2 and pl & {'N2', 'N3'}:
        return 'A'
    sources = {p['source'] for p in c['preuves']} | {p['source'] for p in ph}
    if (nl | pl) & {'N2', 'N3'} and len(sources) >= 2:
        return 'B'
    return 'C'


def doubts(cults, cfg):
    """doubts that call for a Haiku agent: marque / nom / photo / couleur"""
    exempt = set(cfg.get('registres_denomination', ['KAVB']))
    series = [fold(s) for s in cfg.get('series_commerciales', [])]
    keys = defaultdict(list)
    for c in cults:
        keys[c['cle'][:1]].append(c)
    for bucket in keys.values():
        for i, a in enumerate(bucket):
            for b in bucket[i + 1:]:
                if min(len(a['cle']), len(b['cle'])) >= 6 and abs(len(a['cle']) - len(b['cle'])) <= 3:
                    sm = difflib.SequenceMatcher(None, a['cle'], b['cle'])
                    if sm.quick_ratio() >= 0.9 and sm.ratio() >= 0.9:
                        a['doutes'].add('nom_proche:' + b['nom'])
                        b['doutes'].add('nom_proche:' + a['nom'])
    for c in cults:
        c['niveau_provisoire'] = level(c)
        reg = set(c['registres']) | ({p['source'] for p in c['preuves'] if p['niveau'] == 'N1'} & exempt)   # an ICRA register's name is a free denomination
        if c['kavb'] and c['kavb'].get('statut') == 'enregistré':
            reg.add('KAVB')
        if c['marque']['indice']:
            if reg:
                c['marque']['note'] = 'dénomination au registre %s : le signe du vendeur ne fait pas une marque de la variété' % sorted(reg)[0]
            else:
                c['doutes'].add('marque_incertaine')
        elif any(re.search(r'\b' + re.escape(s) + r'\b', fold(c['nom'])) for s in series):
            c['doutes'].add('marque_serie_possible')
        toks = set(c['cle'].split())
        if toks and toks <= GENERIC or re.fullmatch(r'[\d ]+', c['cle']):
            c['doutes'].add('nom_generique')
        if len(c['photos']) == 1:
            c['doutes'].add('une_seule_photo')
        if c['photos'] and not c['couleur_texte']:
            c['doutes'].add('couleur_inconnue')
        c['doutes'] = sorted(c['doutes'])


def doubt_class(d):
    return 0 if d.startswith('marque') else 1 if d.startswith('nom_') or d == 'annee_discordante' else 2 if d == 'une_seule_photo' else 3 if d == 'couleur_inconnue' else None


def batches(cults, nmax, out, sid, taxon):
    """doubtful cultivars (with a photo or an N1/N2 proof, or a trademark hint) in batches of 20, trademark doubts first"""
    cand = []
    for c in cults:
        cls = [x for x in (doubt_class(d) for d in c['doutes']) if x is not None]
        if not cls:
            continue
        real = c['photos'] or any(p['niveau'] in ('N1', 'N2') for p in c['preuves'])
        if not real and min(cls) != 0:
            continue
        cand.append((min(cls), 'ABCD'.index(c['niveau_provisoire']), c['nom'], c))
    cand.sort(key=lambda x: x[:3])
    kept = [x[3] for x in cand[:nmax]]
    files = []
    consigne = ('Pour chaque cultivar, tranche les doutes listés (marque : cherche ®/™ près du nom sur deux pages de vendeurs, un registre des marques '
                'tranche seul ; photo : trouve une 2e photo nommée indépendante ; nom : confirme l\'orthographe au registre ; couleur : lis la source). '
                'Écris le résultat dans douteux-<n>.resultat.json, même forme, sans rien inventer. Jamais de place de marché ni de formulaire.')
    for i in range(0, len(kept), 20):
        lot = []
        for c in kept[i:i + 20]:
            lot.append({'nom': c['nom'], 'synonymes': c['synonymes'][:6], 'groupe': c['groupe'], 'obtenteur': c['obtenteur'], 'annee': c['annee'],
                        'couleur_texte': c['couleur_texte'], 'marque': c['marque'], 'niveau_provisoire': c['niveau_provisoire'], 'doutes': c['doutes'],
                        'preuves': c['preuves'][:5], 'photos': [{x: p.get(x) for x in ('img', 'page', 'source', 'niveau', 'licence')} for p in c['photos'][:4]]})
        fn = os.path.join(out, 'douteux-%d.json' % (i // 20 + 1))
        json.dump({'sid': sid, 'taxon': taxon, 'lot': i // 20 + 1, 'consigne': consigne, 'cultivars': lot}, open(fn, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        files.append(fn)
    return files, len(cand) - len(kept)


# ---------------------------------------------------------------- main
def load_cfg(path):
    return json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {'adapteurs': []}


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('sid')
    ap.add_argument('--taxon', required=True)
    ap.add_argument('--genus')
    ap.add_argument('--group')
    ap.add_argument('--kavb', action='store_true', help='look the cultivars up in the KAVB register (read-only, 1 request every 2 s)')
    ap.add_argument('--max', type=int, default=400, help='most KAVB lookups of the run (names are taken from the best documented)')
    ap.add_argument('--out', required=True)
    ap.add_argument('--config', default=os.path.join(HERE, 'census-sources.json'))
    ap.add_argument('--sources', default='wikidata,commons,inat,gbif,adapters', help='comma list, to restrict a run')
    ap.add_argument('--duree-max', type=float, default=40, help='minutes before the run stops asking and writes what it has')
    ap.add_argument('--douteux-max', type=int, default=120)
    ap.add_argument('--photos-par', type=int, default=6, help='photos kept per cultivar from Commons')
    ap.add_argument('--inat-par', type=int, default=12, help='iNaturalist photos per stage')
    ap.add_argument('--commons-req', type=int, default=700, help='most Commons requests of the run')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    t0 = time.time()
    net = Net(a.out, t0 + a.duree_max * 60)
    ctx = Ctx(a, net)
    cfg = load_cfg(a.config)
    want = set(a.sources.split(','))
    tasks = []
    for nm, fn in (('wikidata', src_wikidata), ('commons', src_commons), ('inat', src_inat), ('gbif', src_gbif)):
        if nm in want:
            tasks.append((nm, lambda fn=fn: fn(ctx)))
    if 'adapters' in want:
        for ad in cfg.get('adapteurs', []):
            if ctx.genus in ad.get('genres', []) or '*' in ad.get('genres', []):
                tasks.append(('adapter:' + ad['id'], lambda ad=ad: run_adapter(ctx, ad) + ({},)))
    findings, infos, extras = [], [], {}
    stop = threading.Event()

    def heartbeat():        # <out>/progress.json: requests so far per source, to follow a long run without a console flood
        while not stop.wait(15):
            with net.glock:
                snap = {k: dict(v) for k, v in net.stat.items()}
            json.dump({'depuis_s': round(time.time() - t0), 'requetes': snap, 'hotes_abandonnes': dict(net.dead)}, open(os.path.join(a.out, 'progress.json'), 'w'))
    threading.Thread(target=heartbeat, daemon=True).start()
    with ThreadPoolExecutor(max_workers=max(1, len(tasks))) as ex:
        futs = [(nm, ex.submit(fn)) for nm, fn in tasks]
        for nm, fu in futs:
            try:
                fs, info, ex_ = fu.result()
            except Exception as e:      # one broken source never stops the others
                fs, info, ex_ = [], {'nom': nm, 'url': '', 'n': 0, 'statut': 'erreur: %s %s' % (type(e).__name__, str(e)[:100])}, {}
            info['_src'] = nm
            infos.append(info)
            findings += [(nm, f) for f in fs]
            for k, v in ex_.items():
                extras.setdefault(k, v)
    if a.kavb:
        cults, _ = merge(findings, ctx, cfg)
        kc = os.path.join(a.out, 'kavb-cache.json')
        done = set(json.load(open(kc, encoding='utf-8'))) if os.path.exists(kc) else set()
        cults.sort(key=lambda c: (c['nom'] not in done, -len(c['photos']) - len(c['preuves']), c['nom']))     # names already looked up are free: first
        names = [c['nom'] for c in cults][:a.max]
        if names:
            fs, info = src_kavb(ctx, names)
            info['_src'] = 'kavb'
            infos.append(info)
            findings += [('kavb', f) for f in fs]
    cults, hors = merge(findings, ctx, cfg)
    if a.group:
        keep = []
        for c in cults:
            if c['groupe'] and fold(a.group) not in fold(c['groupe']) and fold(c['groupe']) not in fold(a.group):
                hors.append({'nom': c['nom'], 'taxon': c['taxon'], 'groupe': c['groupe'], 'sources': []})
            else:
                keep.append(c)
        cults = keep
    doubts(cults, cfg)
    # colour words and mixtures are not cultivars: kept apart with the reason
    ecartes = [{'nom': c['nom'], 'raison': 'nom générique ou mélange', 'sources': [p['source'] for p in c['preuves']]} for c in cults
               if 'nom_generique' in c['doutes'] or re.search(r'\b(mix|mixture|mixed|melange|mengsel)\b', fold(c['nom']))]
    gone = {e['nom'] for e in ecartes}
    cults = [c for c in cults if c['nom'] not in gone]
    cults.sort(key=lambda c: ('ABCD'.index(c['niveau_provisoire']), c['nom'].lower()))
    for old in os.listdir(a.out):
        if re.fullmatch(r'douteux-\d+\.json', old):
            os.remove(os.path.join(a.out, old))
    files, over = batches(cults, a.douteux_max, a.out, a.sid, a.taxon)
    src_rows = []
    for i in infos:
        st = net.stat.get(i['_src'], Counter())
        i = {k: v for k, v in i.items() if k != '_src'}
        i['requetes'] = st['req']
        i['cache'] = st['cache']
        src_rows.append(i)
    cnt = Counter(c['niveau_provisoire'] for c in cults)
    res = {'sid': a.sid, 'taxon': a.taxon, 'genre': ctx.genus, 'groupe_demande': a.group, 'consulte': time.strftime('%Y-%m-%d'),
           'duree_s': round(time.time() - t0), 'sources_interrogees': src_rows, 'niveaux': dict(cnt),
           'taxon_info': extras.get('taxon_info', {}), 'photos_taxon': extras.get('photos_taxon', []),
           'hors_taxon': hors, 'ecartes': ecartes, 'douteux': {'lots': len(files), 'hors_lots': over}, 'cultivars': cults,
           'limites': sorted({'%s : %s' % (n, e) for n, es in net.errors.items() for e in es[:2]})[:20]}
    json.dump(res, open(os.path.join(a.out, 'census.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    answered = sum(st['ok'] for st in net.stat.values())
    L = ['census %s (%s) : %d cultivars en %d s, niveaux A=%d B=%d C=%d D=%d, hors taxon/groupe %d, écartés %d' %
         (a.sid, a.taxon, len(cults), res['duree_s'], cnt['A'], cnt['B'], cnt['C'], cnt['D'], len(hors), len(ecartes))]
    for s in src_rows[:12]:
        L.append('  %-26s n=%-5s req=%-4s cache=%-4s %s' % (s['nom'][:26], s['n'], s['requetes'], s['cache'], s['statut'][:70]))
    pr = sum(1 for c in cults if c['marque']['indice'])
    L.append('marque : %d avec indice ®/™ ; photos du taxon (iNaturalist) : %d' % (pr, len(res['photos_taxon'])))
    L.append('douteux : %d lots de 20 au plus%s -> %s' % (len(files), ' (+%d hors lots)' % over if over else '', os.path.join(a.out, 'douteux-1.json') if files else '-'))
    L.append('fichier : ' + os.path.join(a.out, 'census.json'))
    print('\n'.join(L[:20]))
    return 0 if answered else 2


if __name__ == '__main__':
    sys.exit(main())
