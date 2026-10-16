# Consignes pour les agents — the-internet-florist

Librairie de fleurs et de vases en SVG, site de vente des NFT, widget bureau. Lis d'abord le [README](README.md), puis les
standards [STANDARD-RENDU](docs/STANDARD-RENDU.md) et [STANDARD-SOURCES](docs/STANDARD-SOURCES.md), et la méthode des
fleurs [catalogue/serre/methode/METHODE.md](catalogue/serre/methode/METHODE.md). Le site a son plan dans
[decor/PLAN.md](decor/PLAN.md).

## Règles permanentes

- **Que du SVG.** Pas de 3D, pas de rendu raster dans les produits.
- **Le dessin reste à Claude** : modules `app/` et `demo/src`, vases, décor. Un autre agent les utilise sans les modifier.
- **Les numéros des fleurs ne bougent pas** : ne jamais régénérer `k0.js` depuis les sources du catalogue.
- **Photos de tiers jamais ajoutées à git** (voir le README). On peut décrire une référence, jamais la publier.
- **Vocabulaire** : bouquets, tiges, collectionner, composer, offrir. Jamais « investissement », « rendement »,
  « plus-value », « bourse », « trading », « spéculation » ou « token sale ».
- **Aucun secret dans le dépôt** : clés dans `.env` (ignoré) ou dans les variables d'environnement. Jamais le port 8766.
- **Une tâche lourde à la fois** sur le PC du porteur, au plus 3 navigateurs headless (verrou `ws/gate.sh`) et plus de
  4 Go de RAM libre. Le PC a déjà planté.

## Conventions

- **Langues** : docs, rapports et messages de commit en français ; code et commentaires en anglais.
- **Publication des modules** : on travaille dans `app/`, puis `sh sync_demo.sh "message"` copie vers `demo/src`, reconstruit
  la page et ne committe que `demo/`.
- **Chantiers** : un chantier de fleurs a sa branche `ch/<nom>` et sa copie dans `ch/<nom>` (ignorée) ; il est fusionné dans
  `main` quand ses planches sont validées.
- **Décisions** : si une décision manque, ne la prends pas. Écris la question et ta proposition, puis continue.
