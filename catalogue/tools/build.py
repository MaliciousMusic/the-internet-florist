"""Build catalogue/index.html (self-contained page, photos hot-linked from Wikimedia) and catalogue.csv."""
import csv, json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(BASE, 'catalogue.json'), encoding='utf-8'))
for e in data:
    e.pop('_file', None)
order = ['Roses', 'Printemps & bulbes', 'Été & classiques', 'Orchidées', 'Exotiques', 'Remplissage & textures', 'Feuillages', 'Branches & baies', 'Accessoires & matières']
data.sort(key=lambda e: (order.index(e.get('categorie')) if e.get('categorie') in order else 99, (e.get('nom_fr') or '').lower()))
tpl = open(os.path.join(BASE, 'tools', 'template.html'), encoding='utf-8').read()
js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
open(os.path.join(BASE, 'index.html'), 'w', encoding='utf-8').write(tpl.replace('__DATA__', js))
with open(os.path.join(BASE, 'catalogue.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f, delimiter=';')
    w.writerow(['categorie', 'nom_fr', 'latin', 'nom_en', 'famille', 'role', 'couleurs', 'nb_varietes', 'varietes', 'rarete_jeu', 'gamme_prix', 'saison', 'tenue_vase', 'photo', 'notes_dessin'])
    for e in data:
        v = e.get('varietes') or []
        w.writerow([e.get('categorie'), e.get('nom_fr'), e.get('latin'), e.get('nom_en'), e.get('famille'), e.get('role'),
                    ', '.join(e.get('couleurs') or []), len(v),
                    ' | '.join(x.get('nom', '') + (' (' + x['couleur'] + ')' if x.get('couleur') else '') for x in v),
                    e.get('rarete_jeu'), e.get('gamme_prix'), e.get('saison'), e.get('tenue_vase'),
                    ((e.get('img') or {}).get('main') or {}).get('src', ''), e.get('notes_dessin')])
print('index.html et catalogue.csv generes :', len(data), 'fiches,', sum(len(e.get('varietes') or []) for e in data), 'varietes')
