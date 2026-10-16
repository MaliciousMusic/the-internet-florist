# The Internet Florist

Bouquets vivants dessinés en SVG natif : la librairie de fleurs et de vases, le site de vente des NFT et le widget qui pose
un bouquet sur le bureau Windows. Le tableau de bord des courts (shorts) est dans le dépôt séparé `belai-studio`, qui lit
cette librairie en lecture seule. Le jeu Belai's Garden est en pause : il est archivé dans `belais-flowers`.

## Contenu

| Dossier | Rôle |
|---|---|
| `app/`, `p2.js`–`p4.js`, `mk*.sh` | Modules de dessin en cours de travail (l'atelier) et leurs assemblages |
| `demo/` | Modules validés (`demo/src`), page de l'app (`demo/index.html`) et outils de contrôle (`demo/lab`). `sync_demo.sh` y publie l'atelier |
| `catalogue/` | Catalogue des SKU, recettes, profondeurs, saisons, fanaison, et la serre : sources, méthode et planches de toutes les espèces |
| `fleur/`, `pilote/`, `lab/`, `ws/`, `serre/` | Méthode des fleurs : références, coloris, modelage, planches, contrôle qualité, verrou des navigateurs |
| `bronze/`, `verre/`, `vases/` | Vases : rendu du bronze, verre dépoli, et l'étude des 116 références (fiches, méthode, concepts, essais, outils) |
| `decor/` | Site de la boutique : la scène SVG (ciel, horizon, herbe, dalles, pilier), les bouquets pré-dessinés et les pages |
| `bureau/` | Widget Windows (Tauri) et ses livrables d'essai |
| `packages/engine` | Moteur de dessin empaqueté (`build.sh`), ponts vers la musique et placement des tiges |
| `packages/music` | Moteur musical : outils, banque de sons (VCSL, VSCO), écriture et gènes. Le studio y lit sa banque de sons |
| `docs/` | Standards de rendu et de sources |
| `etude_compositions/`, `research_notes/`, `reports/` | Études de composition et notes sur le marché des bouquets numériques |

## Hors du dépôt

Les photos de tiers restent sur le disque local et ne sont jamais ajoutées : originaux des vases (`../Vases/`),
`refcache/`, `baybayin-refs/`, planches de référence du décor, comparaisons du verre et les quelques planches de fleurs
qui posent une photo à côté du dessin (voir `.gitignore`).
