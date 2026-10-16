"""Document a conservative faithful-copy queue after verified directory moves."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
records = json.loads((ROOT / 'inventaire.json').read_text(encoding='utf-8-sig'))
SAFE = {
    '013': ('Bacchantes', 1927, 'https://www.musee-lalique.com/en/exhibit-month/bacchantes-vase/'),
    '076': ('Serpent', 1924, 'https://www.musee-lalique.com/oeuvre-du-mois/vase-serpent/'),
}
REASONS = {
    'R': 'Création récente ou piste contemporaine : droits non résolus.',
    'A': 'Piste ancienne, mais modèle exact, auteur ou durée des droits non établis.',
    'U': 'Origine non résolue : aucun fondement acquis pour une copie fidèle.',
    'G': 'Type de forme courant ; copie exacte du modèle et du décor non autorisée par cette seule observation.',
}
common = '''Les noms Safe et Unsafe désignent une décision de travail, en droit français/UE au 5 octobre 2026. **Safe ne signifie pas « aucun recours possible ». Unsafe ne signifie pas « reproduction certainement interdite ».** Une nouvelle preuve peut déplacer un dossier.

La copie reste un dessin SVG autonome : aucune photographie incorporée, aucune signature ou marque commerciale reprise, aucune présentation comme produit officiel de la manufacture. L’attribution du dessin historique est conservée. Les variantes contemporaines et les autres territoires ne sont pas déclarés libres par ce classement.
'''
for record in records:
    ident = record['id']
    group = 'Safe' if ident in SAFE else 'Unsafe'
    folder = ROOT / group / ident
    source = folder / record['original']
    if not source.exists():
        raise SystemExit(f'Missing moved original: {source}')
    record['previous_path'] = record.get('previous_path', record['path'])
    record['path'] = f'{group}/{ident}/{record["original"]}'
    record['group'] = group
    record['classification_date'] = '2026-10-05'
    if group == 'Safe':
        name, year, url = SAFE[ident]
        reason = f'Dessin historique {name} ({year}), attribué à René Lalique par un musée ; décès 1945, durée ordinaire des droits patrimoniaux personnels achevée fin 2015.'
        proof = f'''## Fondement du classement

- [Notice du musée : {name}, {year}, René Lalique]({url}).
- [Historique du fabricant : décès de René Lalique en 1945](https://fr.lalique.com/pages/histoire-de-lalique).
- [CPI L123-1 : durée ordinaire](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278937). Calcul : fin de l’année 1945 + 70 années, soit fin 2015 ; dessin historique retenu à partir du 1er janvier 2016 selon cette règle.
- [CPI L121-1 : respect de l’auteur et de l’œuvre](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278891).

**Périmètre exact : le dessin historique de {year}, dans une reproduction fidèle et attribuée.** Le classement ne couvre pas une signature, une photographie de tiers, une nouvelle version remaniée ou une prétendue affiliation à la marque. La photo locale a été comparée au type historique ; elle ne permet pas de certifier la date de fabrication de l’exemplaire photographié.
'''
        if ident == '013':
            proof += '\nLa notice distingue la fabrication historique en verre, les fabrications en cristal depuis 1947 et la version Révélation Bacchantes dans un cube créée en 2010. Notre reprise doit viser la ronde et le corps historiques, pas ce cube contemporain.\n'
        else:
            proof += '\nLa [notice du musée Teien](https://www.teien-art-museum.ne.jp/en/museum/collection/detail/?id=445) confirme le modèle de 1924 en verre rouge profond. Le flacon de parfum Serpent créé en 2010 est une œuvre différente, hors classement.\n'
    else:
        reason = REASONS[record['category']]
        proof = f'''## Pourquoi ce dossier reste à vérifier

{reason}

{record['attribution']}.

Lire [FICHE.md](FICHE.md) pour les observations et les sources. Il faut établir une correspondance fiable avec le modèle, son ou ses créateurs, la version concernée et un fondement pour la copie (expiration applicable, autorisation ou caractéristiques non protégées). Une modification du dessin reste une autre démarche, distincte de la reproduction fidèle demandée.
'''
    record['classification_reason'] = reason
    (folder / 'CLASSEMENT.md').write_text(f'# Vase {ident} — {group}\n\n{reason}\n\n{common}\n{proof}\n[Étude détaillée](FICHE.md) · [Critères communs](../../CLASSEMENT.md)\n',encoding='utf-8')
    fiche = folder / 'FICHE.md'
    text = fiche.read_text(encoding='utf-8-sig')
    text = text.replace('](../METHODE.md)', '](../../METHODE.md)').replace('](../_tests/index.html)', '](../../_tests/index.html)')
    if '[Classement de travail]' not in text:
        heading, rest = text.split('\n',1)
        text = heading+f'\n\n**{group} — [Classement de travail](CLASSEMENT.md)**\n'+rest
    fiche.write_text(text,encoding='utf-8')

(ROOT / 'inventaire.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT / 'classification.json').write_text(json.dumps([{
    key:record[key] for key in ('id','label','group','path','sha256','classification_reason')
} for record in records],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

for group in ('Safe','Unsafe'):
    subset = [record for record in records if record['group']==group]
    rows = '\n'.join(f'| [{r["id"]}]({r["id"]}/CLASSEMENT.md) | {r["label"]} | {r["classification_reason"]} |' for r in subset)
    text = f'''# {group} — {len(subset)} références

{common}
[Critères et bilan](../CLASSEMENT.md) · [Index complet](../README.md)

| Dossier | Référence | Motif de classement |
|---|---|---|
{rows}
'''
    (ROOT / group / 'README.md').write_text(text,encoding='utf-8')

(ROOT / 'CLASSEMENT.md').write_text(f'''# Reproduction fidèle — classement des 116 références

**2 Safe, 114 Unsafe.** Les dossiers et leurs numéros sont conservés ; seuls leur groupe et les liens ont changé. Les 116 originaux doivent conserver leur SHA-256.

{common}
## Safe : dessins historiques retenus

- [013 — Bacchantes](Safe/013/CLASSEMENT.md), René Lalique, 1927.
- [076 — Serpent](Safe/076/CLASSEMENT.md), René Lalique, 1924.

Les notices de musée attribuent les dessins à René Lalique ; le fabricant documente son décès en 1945. La règle ordinaire française sur ses droits patrimoniaux personnels aboutit à fin 2015. Cette base porte sur les dessins historiques. Le droit moral, les marques, les versions modifiées et les photographies sont traités séparément dans chaque fiche.

## Unsafe : copie fidèle non retenue en l’état

- 18 références récentes ou pistes contemporaines.
- 56 pistes anciennes sans identification/durée suffisamment établies pour le modèle exact.
- 26 origines non résolues.
- 14 types de formes courants, dont le décor, la surface ou la série exacte ne sont pas libérés par le caractère courant de la forme.

Ces 96 derniers dossiers ne sont pas déclarés contrefaisants. Ils restent en attente de preuves. Un motif japonais traditionnel, une forme simple ou une vente indiquant « Art nouveau » ne donnent pas, seuls, un feu vert sur l’exemplaire précis.

## Traitement du test 005

La qualité du rendu SVG a été validée par le porteur le 5 octobre 2026. Cette validation graphique sert de niveau de soin pour les prochains dessins. L’origine du vase 005 reste non résolue : il se trouve donc dans [Unsafe/005](Unsafe/005/CLASSEMENT.md). Son étude privée n’est pas un modèle autorisé du catalogue.

Les premiers essais 001/003/005/038 et la reprise à facettes ont été refusés. Ils sont conservés comme traces privées ; leur existence ne vaut pas validation. Le nouvel essai fidèle reste une étude native 2D en SVG, sans photographie incorporée.

## Sources communes

- [Musée Lalique : Bacchantes, 1927](https://www.musee-lalique.com/en/exhibit-month/bacchantes-vase/).
- [Musée Lalique : Serpent, 1924](https://www.musee-lalique.com/oeuvre-du-mois/vase-serpent/).
- [Musée Teien : Serpent, verre rouge, 1924](https://www.teien-art-museum.ne.jp/en/museum/collection/detail/?id=445).
- [Fabricant : histoire de Lalique, décès en 1945](https://fr.lalique.com/pages/histoire-de-lalique).
- [CPI L123-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278937), [CPI L121-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278891).
- [Méthode, autres droits et limites des recherches](METHODE.md).
''',encoding='utf-8')

index = '''# Vases — références privées

**[Safe : 2 modèles](Safe/README.md)** · **[Unsafe : 114 modèles](Unsafe/README.md)**

116 dossiers numérotés, un original inchangé, une fiche sourcée, un journal de recherche et un classement individuel par dossier. Safe signifie « dessin historique retenu pour une reprise fidèle avec attribution », pas une immunité. Unsafe inclut les origines encore incertaines.

- [Critères et bilan de classement](CLASSEMENT.md).
- [Méthode juridique et limites](METHODE.md).
- [Inventaire et empreintes](inventaire.json).
- [Classement lisible par programme](classification.json).
- [Étude SVG 005 : niveau graphique validé](_tests/fidele/005-verre-vert.svg).
- [Premiers essais refusés, conservés comme traces](_tests/index.html).

Les références, recherches et essais restent privés et exclus de Git. La copie du dessin historique est distincte de la reprise d'une photographie, d'une signature ou d'un ajout contemporain.

| Dossier | Groupe | Référence |
|---|---|---|
'''
index += '\n'.join(f'| [{r["id"]}]({r["group"]}/{r["id"]}/FICHE.md) | {r["group"]} | {r["label"]} |' for r in records)+'\n'
(ROOT / 'README.md').write_text(index,encoding='utf-8')

gallery = ROOT / '_tests/index.html'
text = gallery.read_text(encoding='utf-8')
for record in records:
    ident = record['id']
    text = text.replace(f'../{ident}/',f'../{record["group"]}/{ident}/')
if 'Essais refusés' not in text:
    text = text.replace('<h1>Atelier des vases</h1>','<h1>Essais refusés — archive privée</h1>')
gallery.write_text(text,encoding='utf-8')
print('2 Safe, 114 Unsafe. Inventory, classification sheets and local links updated.')
