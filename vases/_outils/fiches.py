"""Build individual research assessments from explicitly reviewed notes."""
import json
import re
from collections import Counter
from pathlib import Path

root = Path(__file__).resolve().parents[1]
records = json.loads((root / 'inventaire.json').read_text(encoding='utf-8'))
if any('group' in record for record in records):
    raise SystemExit('Historical generator disabled after classification. Edit grouped sheets and run classer.py instead.')
notes = {}
for line in (root / 'analyses.tsv').read_text(encoding='utf-8').splitlines():
    ident, category, attribution, observed, changes = line.split('|')
    notes[ident] = dict(category=category, attribution=attribution, observed=observed, changes=changes)
queries = {row[0]: row for row in json.loads((root / 'requetes.json').read_text(encoding='utf-8'))}
categories = {
    'R': ('Création récente documentée ou piste contemporaine', 'Substantielle si création autonome ; autorisation si reproduction fidèle', 'Élevé ou à traiter comme élevé tant que les droits de la création récente ne sont pas résolus.'),
    'A': ('Piste ancienne à authentifier', 'Peut être nulle si modèle, auteurs et expiration des droits confirmés ; sinon décor/structure à redessiner', 'Indéterminé : une date de style ou une pièce ressemblante ne prouvent pas les droits du modèle local.'),
    'H': ('Dessin historique attribué par un musée', 'Pas de modification imposée par hypothèse sur le dessin historique ; vérifier version et droits résiduels', 'Piste favorable concernant les droits patrimoniaux du dessin historique ; aucune garantie sur marque, droit moral, photographie ou version récente.'),
    'G': ('Structure courante, décor individuel à recréer', 'Faible sur le type de forme ; créer proportions, texture et reflets propres', 'Plus limité pour la géométrie banale, non résolu pour une série précise, une surface individuelle ou une photographie.'),
    'U': ('Origine non résolue', 'À définir après identification ; provisoirement revoir les caractéristiques singulières', 'Indéterminé : absence d’auteur retrouvé ne signifie pas absence de droits.'),
}
overrides = {
    '001': [('Huevo, VGnewtrend, Artemest', 'https://artemest.com/es-es/products/huevo-de-cristal-con-ranas-grises')],
    '002': [('Rummikub, Bazar Bizar, La Redoute', 'https://www.laredoute.fr/ppdp/prod-602447682.aspx'), ('Rummikub, Bazar Bizar, Maisons du Monde', 'https://www.maisonsdumonde.com/IT/it/p/vaso-in-vetro-riciclato-grigio-scuro-11x11x30cm-rummikub-M26000918.htm')],
    '009': [('Magnolia Blossom Jasper Bud Vase, fabricant', 'https://www.wedgwood.com/en-us/products/magnolia-blossom-jasper-bud-vase')],
    '011': [('Daum Amaryllis, vente documentée', 'https://www.ebth.com/items/13793335-daum-amaryllis-amethyst-pate-de-verre-vase')],
    '013': [('Bacchantes, musée Lalique', 'https://www.musee-lalique.com/oeuvre-du-mois/vase-bacchantes/'), ('René Lalique, dates, musée Lalique', 'https://www.musee-lalique.com/en/discover/lalique-more-than-a-name/rene-lalique/')],
    '032': [('Van Briggle et Asano, notice de comparaison du Met', 'https://www.metmuseum.org/art/collection/search/698683')],
    '044': [('Precious, Malin Lindahl, Orrefors', 'https://www.orrefors.com/precious-vas-235mm')],
    '046': [('Diva fish, Moser', 'https://www.moser.com/en/diva-vase-fish-3-facets')],
    '055': [('Ginkgo vert, Daum', 'https://daum.fr/products/ginkgo-vase-moyen-modele-vert')],
    '063': [('Arums Rörstrand, notice de comparaison du Met', 'https://www.metmuseum.org/art/collection/search/208194')],
    '076': [('Serpent, musée Lalique', 'https://www.musee-lalique.com/oeuvre-du-mois/vase-serpent/'), ('Serpent, musée Teien, 1924', 'https://www.teien-art-museum.ne.jp/en/museum/collection/detail/?id=445'), ('René Lalique, dates, musée Lalique', 'https://www.musee-lalique.com/en/discover/lalique-more-than-a-name/rene-lalique/')],
    '077': [('Tourbillons, attribution à Suzanne, fabricant', 'https://fr.lalique.com/pages/tourbillons'), ('Tourbillons, musée Lalique', 'https://www.musee-lalique.com/oeuvre-du-mois/vase-tourbillons/'), ('Suzanne Lalique-Haviland, décès 1989, musée', 'https://www.musee-lalique.com/decouvrir/lalique-plus-quun-nom/suzanne-lalique-haviland/')],
    '104': [('Facet, Kateřina Doušová, Moser, depuis 2019', 'https://www.moser.com/en/facet-vase-28-cm')],
    '110': [('Magnolia Blossom Large Jasper Vase, fabricant', 'https://www.wedgwood.com/en-us/products/magnolia-blossom-large-jasper-vase')],
    '108': [('Cubism, Moser, modèle de comparaison', 'https://www.moser.com/en/cubism-vase-30-cm-6')],
}
for record in records:
    ident = record['id']
    note = notes[ident]
    category, level, risk = categories[note['category']]
    source_list = overrides.get(ident, [])[:]
    if not source_list:
        seen = set()
        for filename in ['RECHERCHE.md', 'COMPLEMENT.md', 'COMPLEMENT-2.md']:
            path = root / ident / filename
            if not path.exists():
                continue
            for title, url in re.findall(r'^([^\n]+) \((https?://[^\n]+)\)\s*$', path.read_text(encoding='utf-8'), re.MULTILINE):
                if url in seen or any(term in url for term in ['reddit.com', 'wikipedia.', 'artidentifier.', 'scribd.', 'rowenhomes.mom']):
                    continue
                if len(title) > 280:
                    title = title[:277] + '…'
                source_list.append((title.replace('[', '(').replace(']', ')'), url))
                seen.add(url)
                if len(source_list) == 3:
                    break
            if len(source_list) == 3:
                break
    sources = '\n'.join(f'- [{title}]({url})' for title, url in source_list) or '- Aucun résultat exploitable pour identifier le modèle ; voir le journal de recherche.'
    archive_links = '\n'.join(f'- [{name}]({name})' for name in ['RECHERCHE.md', 'COMPLEMENT.md', 'COMPLEMENT-2.md'] if (root / ident / name).exists())
    extra = ''
    if ident in ['001', '003', '005', '038']:
        extra = '\n## Essai graphique préparé\n\nUne étude SVG et ses variantes se trouvent dans [la galerie des quatre tests](../_tests/index.html). Ce test ne vaut ni validation du catalogue ni autorisation de reproduction.\n'
    if ident == '077':
        extra += '\n## Calcul de durée à vérifier\n\nLa documentation officielle attribue Tourbillons à Suzanne, décédée en 1989. La règle ordinaire « année du décès + 70 années » conduit au 1er janvier 2060. L’ancienne attribution à René, décédé en 1945, ne doit pas être utilisée pour déclarer ce modèle libre.\n'
    if ident in ['013', '076']:
        extra += '\n## Calcul de durée à vérifier\n\nLe musée attribue le dessin historique à René Lalique, décédé en 1945. La règle ordinaire conduit au 1er janvier 2016 pour ses droits patrimoniaux personnels. Il faut confirmer l’absence de coauteur, d’ajout créatif récent ou de règle spéciale ; le droit moral français et les marques ne disparaissent pas avec ce calcul.\n'
    text = f'''# Vase {ident} — {queries[ident][1]}

Étude du 5 octobre 2026, France/Union européenne. Fiche de préparation, pas certificat de libre reproduction.

## Référence conservée

- Fichier original : [{record['original']}]({record['original']}).
- SHA-256 : `{record['sha256']}`.
- Dimensions : {record['width']} × {record['height']} pixels.
- Image de référence privée, ni diffusée ni ajoutée au dépôt public.

## Attribution et qualité de preuve

{note['attribution']}.

Les sources ci-dessous documentent le modèle quand indiqué, sinon une famille ou un objet de comparaison. Une ressemblance et une fiche de revendeur ne prouvent pas l’identité de notre objet. Aucune recherche exhaustive dans les registres de dessins/modèles ou de marques n’a été effectuée ; aucune autorisation n’est acquise.

## Ce qui fait la forme

{note['observed']}

## Reproduction fidèle et niveau de modification

**Situation : {category}.**

**Modification proposée : {level}.**

**Exposition estimée : {risk}** Ce niveau concerne notre décision de création ; il ne prédit ni une action ni son résultat.

{note['changes']}

Le passage verre → bronze/céladon, la teinte et la position dans le bouquet sont des variantes esthétiques. Ils ne suffisent pas, à eux seuls, à écarter une reprise des caractéristiques protégées. Déplacer un animal sans refaire sa sculpture ni la combinaison peut également conserver la reprise.

## Ce qu’il reste à vérifier pour retenir une copie fidèle

- Correspondance du fichier avec l’objet exact, vue de profil, dimensions, marque ou signature éventuelle.
- Créateur de la forme **et** créateur du décor, dates de création, coauteurs et droits patrimoniaux applicables.
- Version ancienne ou remaniement contemporain ; droits sur dessin/modèle, marque/forme, respect de l’œuvre et éventuel parasitisme.
- Dessin SVG produit par nous, sans calque de l’éclairage, du fond ou d’une composition photographique originale.
- Pour une création encore protégée : autorisation couvrant représentation numérique, commercialisation dans le jeu, transfert des objets et variantes de matière/couleur.

Il n’existe pas de pourcentage légal de modification et cette fiche ne qualifie aucun vase de « non attaquable ». Voir [la méthode et les sources juridiques](../METHODE.md).

## Sources pour cette référence

{sources}

## Journal de recherche

{archive_links}
{extra}
'''
    (root / ident / 'FICHE.md').write_text(text, encoding='utf-8')
    record.update(label=queries[ident][1], category=note['category'], attribution=note['attribution'], sources=source_list)
(root / 'inventaire.json').write_text(json.dumps(records, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
counts = Counter(r['category'] for r in records)
summary = '\n'.join(f'- {categories[code][0]} : **{counts[code]}**.' for code in categories)
rows = '\n'.join(f"| [{r['id']}]({r['id']}/FICHE.md) | {r['label']} | {categories[r['category']][0]} |" for r in records)
index = f'''# Vases — références privées et étude de création

116 originaux rangés en dossiers 001–116, numérotation alphabétique stable à partir des noms d’origine. Chaque déplacement a été contrôlé par SHA-256. Aucun doublon exact trouvé.

Chaque dossier contient l’original, une fiche individuelle et le journal de sa recherche publique. Toute attribution non prouvée reste une piste. Cette étude fournit une direction de dessin, jamais une garantie d’immunité.

## Lire et comparer

- [Méthode juridique et limites](METHODE.md).
- [Galerie des quatre essais SVG]( _tests/index.html).
- [Inventaire et empreintes](inventaire.json).
- [Notes individuelles de création](analyses.tsv).
- Planches de contact dans `_planches/`, réservées à cette inspection locale.

## État de l’étude

{summary}

Les 116 références ont été examinées visuellement et recherchées individuellement. Des recherches complémentaires sont conservées pour les cas difficiles. Les pistes anciennes ne sont pas déclarées libres ; les résultats sans correspondance fiable restent non attribués. Aucune vérification exhaustive des registres ni demande de licence n’a eu lieu.

## Catalogue par référence

| Dossier | Référence visuelle | Situation |
|---|---|---|
{rows}

## Conservation

Tout ce dossier est ignoré par Git : photographies, planches, recherches et tests non validés restent privés. Aucun module du jeu ou catalogue officiel n’a été modifié. Les quatre essais attendent une validation visuelle avant toute série complète.
'''
(root / 'README.md').write_text(index.replace(']( _tests/', '](_tests/'), encoding='utf-8')
print(json.dumps(dict(counts), ensure_ascii=False))
