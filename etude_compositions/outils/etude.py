"""Aggregate the 82 bouquet annotations + palettes into synthese.json and a local study page etude.html."""
import collections, glob, html, json, os, re, unicodedata

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_REL = '../Composition reference/'
_TC = {}


def thumb(fname):
    """Small embedded JPEG so the page works anywhere (no external or relative image paths)."""
    if fname in _TC:
        return _TC[fname]
    import base64, io
    from PIL import Image
    try:
        im = Image.open(os.path.join(BASE, '..', 'Composition reference', fname)).convert('RGB')
        im.thumbnail((440, 560))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=72, optimize=True)
        _TC[fname] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    except Exception:
        _TC[fname] = IMG_REL + fname
    return _TC[fname]


def norm(s):
    s = unicodedata.normalize('NFD', str(s or '').lower())
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn')).strip()


def esc(s):
    return html.escape(str(s if s is not None else ''))


ann = []
for fp in sorted(glob.glob(os.path.join(BASE, 'annotations', 'lot*.json'))):
    try:
        ann += json.load(open(fp, encoding='utf-8'))
    except Exception as e:
        print('lot illisible', fp, e)
ann.sort(key=lambda a: int(a.get('n') or 0))
pal = {p['n']: p for p in json.load(open(os.path.join(BASE, 'palettes.json'), encoding='utf-8'))}
real = [a for a in ann if not a.get('doublon_de') and 'illustration' not in norm(a.get('type')) and 'scene' not in norm(a.get('type'))]


def dist(values):
    c = collections.Counter(v for v in values if v)
    tot = sum(c.values()) or 1
    return [(k, n, round(100 * n / tot)) for k, n in c.most_common()]


def first_word(v, choices):
    v = norm(v)
    for ch in choices:
        if norm(ch) in v:
            return ch
    return v.split(' ')[0] if v else None


SIL = ['dôme', 'sphère', 'croissant', 'asymétrique en L', 'triangle', 'vertical aérien', 'cascade', 'éventail', 'horizontale', 'libre/sauvage']
stats = {
    'nb_images': len(ann), 'nb_bouquets_reels': len(real),
    'type': dist(first_word(a.get('type'), ['bouquet tenu en main', 'bouquet en vase', 'ikebana', 'composition sur socle', 'bouquet emballé', 'illustration', 'scène de jardin']) for a in ann),
    'silhouette': dist(first_word((a.get('silhouette') or {}).get('forme'), SIL) for a in real),
    'symetrie': dist(first_word((a.get('silhouette') or {}).get('symetrie'), ['très asymétrique', 'équilibre asymétrique', 'symétrique']) for a in real),
    'espace_negatif': dist(first_word((a.get('silhouette') or {}).get('espace_negatif'), ['faible', 'moyen', 'fort']) for a in real),
    'debordement_bas': dist(first_word((a.get('silhouette') or {}).get('debordement_bas'), ['cascade longue', 'léger', 'aucun']) for a in real),
    'schema_couleur': dist(first_word((a.get('couleurs') or {}).get('schema'), ['monochrome', 'tonal', 'analogue', 'complémentaire', 'triade', 'neutres + accent', 'multicolore']) for a in real),
    'temperature': dist(first_word((a.get('couleurs') or {}).get('temperature'), ['chaude', 'froide', 'mixte']) for a in real),
    'feuillage': dist(first_word(a.get('feuillage'), ['aucun', 'rare', 'moyen', 'abondant']) for a in real),
}
num = lambda v: float(v) if isinstance(v, (int, float)) else None
for key in ('largeur_sur_hauteur', 'hauteur_bouquet_sur_contenant'):
    xs = sorted(x for x in (num((a.get('silhouette') or {}).get(key)) for a in real) if x)
    if xs:
        stats[key] = {'mediane': xs[len(xs) // 2], 'q1': xs[len(xs) // 4], 'q3': xs[3 * len(xs) // 4], 'n': len(xs)}
# flowers: in how many bouquets, and with which roles
fl = collections.defaultdict(lambda: {'n': 0, 'roles': collections.Counter(), 'latin': collections.Counter(), 'couleurs': collections.Counter(), 'fr': collections.Counter()})


def fkey(f):
    lat = re.sub(r'[\(\)\?×]|x', ' ', str(f.get('latin') or '')).strip()
    g = lat.split(' ')[0] if lat else ''
    if g and g[0].isupper() and len(g) > 2 and not g.lower().startswith(('sp', 'inconnu', 'non')):
        return g
    fr = norm(str(f.get('nom_fr') or '').replace('œ', 'oe'))
    return ' '.join(fr.split(' ')[:2]) or None


for a in real:
    seen = set()
    for f in a.get('fleurs') or []:
        k = fkey(f)
        if not k:
            continue
        d = fl[k]
        if k not in seen:
            d['n'] += 1
            seen.add(k)
        d['roles'][f.get('role')] += 1
        d['fr'][f.get('nom_fr')] += 1
        if f.get('latin'):
            d['latin'][f.get('latin')] += 1
        if f.get('couleur'):
            d['couleurs'][f.get('couleur')] += 1
flowers = sorted(({'nom': v['fr'].most_common(1)[0][0] if v['fr'] else k, 'genre': k, 'bouquets': v['n'], 'roles': v['roles'].most_common(3), 'latin': k if k[:1].isupper() else (v['latin'].most_common(1)[0][0] if v['latin'] else ''), 'couleurs': [c for c, _ in v['couleurs'].most_common(4)]} for k, v in fl.items()), key=lambda x: -x['bouquets'])
stats['fleurs'] = flowers
P = [pal[a['n']] for a in real if a.get('n') in pal]
if P:
    stats['palette_calc'] = {'part_fonce_moy': round(sum(p['part_fonce'] for p in P) / len(P), 3), 'part_chaude_moy': round(sum(p['part_chaude'] for p in P) / len(P), 3),
                             'type': dist(p['type_palette'] for p in P)}
rules = [r for a in real for r in (a.get('regles') or [])]
THEMES = {'nombres impairs': r'impair|par 3|trois|groupe', 'retombée / cascade': r'retomb|cascade|amarant|tomb', 'lignes qui dépassent': r'ligne|depass|courbe|elanc|tige',
          'asymétrie': r'asym|desequilib|decentr', 'palette tonale + accent': r'tonal|monochrom|accent|camaieu|ton sur ton', 'clair/foncé, profondeur': r'fonce|sombre|profondeur|clair|retrait|lumiere',
          'peu de feuillage': r'feuillage|vert', 'espace négatif / air': r'espace|air|vide|respir', 'orientations variées': r'orient|profil|face|regard', 'contenant / socle': r'vase|contenant|socle|pied'}
stats['themes_regles'] = sorted(((t, sum(1 for r in rules if re.search(p, norm(r)))) for t, p in THEMES.items()), key=lambda x: -x[1])
stats['nb_regles'] = len(rules)
json.dump(stats, open(os.path.join(BASE, 'synthese.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------- page ----------
def bars(title, rows, unit='%'):
    if not rows:
        return ''
    m = max(r[2] for r in rows) or 1
    return f'<div class="chart"><h3>{esc(title)}</h3>' + ''.join(f'<div class="row"><span class="lab">{esc(k)}</span><span class="bar"><i style="width:{100 * p / m:.0f}%"></i></span><span class="val">{p}{unit} <small>({n})</small></span></div>' for k, n, p in rows) + '</div>'


ROLEC = {'ligne': '#3f6b3a', 'focale': '#c2185b', 'secondaire': '#e07a9a', 'remplissage': '#b49a6a', 'retombée': '#7a2a8a', 'feuillage': '#5f8f4a', 'accent': '#e08a00'}
frag = lambda name: open(os.path.join(BASE, 'redaction', name), encoding='utf-8').read() if os.path.exists(os.path.join(BASE, 'redaction', name)) else '<p class="todo">Section en cours de rédaction.</p>'
cards = []
for a in ann:
    n = a.get('n')
    p = pal.get(n, {})
    sw = ''.join(f'<i style="background:{x["hex"]};flex:{max(.06, x["part"])}"></i>' for x in p.get('palette', []))
    fls = ''.join(f'<span style="--c:{ROLEC.get(f.get("role"), "#888")}">{esc(f.get("nom_fr"))}{" · " + esc(f.get("couleur")) if f.get("couleur") else ""}</span>' for f in (a.get('fleurs') or []))
    s = a.get('silhouette') or {}
    cards.append(f'''<article class="b"><a href="{esc(IMG_REL + str(a.get("fichier", "")))}" target="_blank"><img loading="lazy" src="{thumb(str(a.get("fichier", "")))}" alt="Bouquet {n}"></a>
<div class="bb"><h3>{n:02d} · {esc(s.get("forme"))}</h3><p class="meta">{esc(a.get("type"))}{" · doublon de " + esc(a.get("doublon_de")) if a.get("doublon_de") else ""} · {esc(s.get("symetrie"))} · espace négatif {esc(s.get("espace_negatif"))} · retombée {esc(s.get("debordement_bas"))}</p>
<div class="sw">{sw}</div><p class="small"><b>Couleurs :</b> {esc((a.get("couleurs") or {}).get("schema"))} — {esc((a.get("couleurs") or {}).get("valeurs"))}</p>
<div class="fl">{fls}</div><p class="small"><b>Pourquoi ça marche :</b> {esc(a.get("pourquoi_ca_marche"))}</p>
<ul>{"".join(f"<li>{esc(r)}</li>" for r in (a.get("regles") or []))}</ul></div></article>''')
top = ''.join(f'<tr><td>{esc(f["nom"])}</td><td><i>{esc(f["latin"])}</i></td><td class="num">{f["bouquets"]}</td><td>{", ".join(esc(r) + " " + str(c) for r, c in f["roles"] if r)}</td><td>{esc(", ".join(f["couleurs"]))}</td></tr>' for f in flowers[:45])
page = open(os.path.join(BASE, 'outils', 'etude_template.html'), encoding='utf-8').read()
page = (page.replace('__N__', str(len(ann))).replace('__NREAL__', str(len(real))).replace('__NREGLES__', str(len(rules)))
        .replace('__SYNTHESE__', frag('synthese.html')).replace('__ALGO__', frag('algorithme.html'))
        .replace('__CHARTS__', bars('Silhouettes', stats['silhouette']) + bars('Symétrie', stats['symetrie']) + bars('Espace négatif', stats['espace_negatif']) +
                 bars('Retombée sous le contenant', stats['debordement_bas']) + bars('Schéma de couleurs', stats['schema_couleur']) + bars('Feuillage', stats['feuillage']) +
                 bars('Thèmes des règles relevées', [(t, c, round(100 * c / max(1, len(rules)))) for t, c in stats['themes_regles']]))
        .replace('__TOP__', top).replace('__CARDS__', '\n'.join(cards)))
open(os.path.join(BASE, 'etude.html'), 'w', encoding='utf-8').write(page)
print('etude.html :', len(ann), 'annotations,', len(real), 'bouquets reels,', len(flowers), 'fleurs distinctes,', len(rules), 'regles')
