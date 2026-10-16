# Lot 78 « lauriers » — rapport

Fichier : `s78a.js` (préfixe `l78` / `L78_`). Aucune copie moteur, aucun diff moteur.
Aucune ancienne version de ces 5 sids dans `demo/src` (seulement les recettes génériques de `k0.js`) : ce lot les crée.

## Moteurs réutilisés
- `fgGrow` / `fgAxis` / `fgCw` (lot 24) : axe le long de l'épine du Composer (`from`), debout sur une planche, en botte sur une carte ; il renvoie `{k, bw, bw1, bc, neck, nd}`.
- `g35Leaf` / `g35Prof` / `g35Lim` / `g35Run` (lot 35) : feuilles 3D en deux moitiés, face et revers de couleurs propres, ondulation, brillance et nervures.
- `l39Ovoid` (lot 39) pour les bourgeons, `l41C` (lot 41) et `l45Line` (lot 45).
- Ajouts du lot :
  - `l78Prof` : contour denté, les dents tournées vers la pointe ;
  - `l78Veins` : nervures pennées ;
  - `l78Leaf` : un pétiole courbe d'au moins 1,15 part toujours du rameau. Une feuille qui pointe vers l'œil se penche de côté, pour ne pas lire comme un disque sombre. Une feuille peut aussi se retourner (`flip`) ;
  - `l78Florets` : boutons, fleurs et baies groupés en 2 bacs de profondeur, quelques chemins par grappe ;
  - `l78Cyme` (corymbe ou ombelle) et `l78Raceme` (grappe) : chaque fleur est au bout de son pédicelle (≥ 1,15), lui-même tracé depuis un rayon qui part du rameau ;
  - `l78Bud` : bourgeon terminal à écailles, avec la couleur des pétales qui perce.

## Espèces
| sid | botanique (résumé) | coloris (CWS) | tailles SZG (longueur de feuille, cm) |
|---|---|---|---|
| `laurus-nobilis-laurier-sauce` | Feuilles alternes en spirale, lancéolées, 5–10 × 2–3,5 cm, coriaces, bord entier légèrement ondulé, vert sombre mat, revers plus pâle, pétiole court rougeâtre. Ombelles axillaires de 4–6 boutons et fleurs crème à 4 tépales (pieds mâles, fin d'hiver). | vert sombre mat ; Angustifolia (feuille étroite, olive) ; Aurea (doré) ; en boutons floraux | 6, 8, 8, 10 |
| `prunus-laurocerasus-laurier-cerise` | Feuilles alternes, grandes, oblongues, 10–15 (25) × 4–6 cm, très luisantes, vert profond, revers vert-jaune pâle, quelques dents espacées, pétiole vert. Grappes axillaires dressées de 7–12 cm, fleurs blanches à 5 pétales (avril). | vert profond ; Otto Luyken (étroite, petite) ; Etna (pousses bronze) ; Castlewellan (marbré crème) ; en fleurs | 10, 12, 12, 15 |
| `viburnum-tinus-laurier-tin` | Feuilles opposées décussées, ovales-oblongues, 4–10 cm, entières, vert sombre luisant, pétiole rougeâtre. Corymbes terminaux plats de 5–10 cm : boutons rose carmin, fleurs blanches à 5 lobes, le centre s'ouvre d'abord. Puis drupes bleu métallique. Dans `GH_BUDS` (stade choisi par le Composer). | boutons roses (type) ; Eve Price (carmin) ; French White ; baies bleu métallique | 5, 7, 7, 9 |
| `magnolia-grandiflora-feuillage` | Feuilles alternes groupées vers le bout des pousses, elliptiques, 12–20 cm, épaisses, bord un peu enroulé, vert sombre luisant, revers feutré brun roux. Un tiers à 40 % des feuilles se retournent (vues des fleuristes). Bourgeon terminal soyeux roux, rameau stout. | vert à revers roux ; Brackens Brown Beauty ; Little Gem (feuilles plus petites) ; stabilisé bronze | 12, 16, 16, 20 |
| `camellia-japonica-feuillage` | Feuilles alternes, ovales à elliptiques, 5–10 cm, acuminées, finement dentées, vert sombre luisant, revers mat plus clair. Boutons floraux terminaux à bractées vert-brun, la couleur des pétales perce à mi-ouvert (les jeunes feuilles de cette pointe lui cèdent la place). | vert sombre ; boutons rouges ; boutons roses ; boutons blancs | 6, 8, 8, 10 |

GHI : `form:'feuillage'`, `k:'plant'`, `self` de 45 à 50 cm, `fx` de 18 à 20.
- Des `fx` de 40 à 52 (la portée réelle des grandes feuilles) faisaient rejeter toutes les tiges par le Composer : `hidesUnder` échouait toujours.
- Les feuilles basses sont donc tenues au-dessus de la lèvre par `g35Lim` (elles rétrécissent ou disparaissent avec leur pétiole), comme au lot 45.

## Vérification
- **Planches** : 9 vues × 3 stades regardées pour les 5 espèces, et zooms à `det=2`. Corrections faites :
  - disques sombres de face : feuilles pointées vers l'œil, réglées par `l78Leaf` ;
  - camélia trop plat de profil : passé en phyllotaxie spirale, `face` .6 ;
  - reflets en bandes trop marqués : brillance ramenée à .4–.55 ;
  - boutons du camélia cachés derrière les jeunes feuilles ;
  - corymbes du laurier-tin trop clairsemés.
- **Cartes** : `sheets/cartes_composer.png`. Le rendu en `cols=8` montre 20 cartes sur 21 : il manque « laurier-cerise en fleurs », visible seule (`cards=prunus…`) et dans les bouquets.
- **QA composée** `inc=` des 5 sids, 3 graines × 20 (5, 11, 23) : **0 F, 0 U, 0 kink**. Captures regardées : graine 3 (8 bouquets) et un zoom du bouquet C0 (laurier-cerise en fleurs).
- **Modèles** : `models_of.py` → aucun des 76 modèles n'utilise ces espèces (`ns=` vide), il n'y a donc pas de QA de modèles à faire.
- **Perf** (`perf=1`), sur la même machine cloud :
  - ce lot : 192 ms, 8 295 éléments ;
  - build de référence sans ce lot : 193 ms, 8 295 éléments.
  - Aucun écart : ces espèces n'apparaissent dans aucun modèle. La machine est plus lente que la référence du brief (142 ms).
- **Éléments SVG par tige** (DET 1, sur une épine) : 124 à 510 selon le coloris. Le loropetalum, à titre de comparaison, en compte 360 à 530.

## Doutes
- Castlewellan : le marbré est rendu comme un liseré crème irrégulier, alors que la vraie panachure est mouchetée.
- Laurier-cerise en fleurs et laurier-sauce en boutons : ce sont des tiges réelles mais rares en fleuristerie. Je les ai gardées comme formes « f » : une couleur de modèle ne tombe jamais dessus.
- Taille des fleurs de laurier-cerise : un peu grosse en bouquet, pour rester lisible à DET 1.
- Magnolia : ses grandes feuilles dominent les petits vases. C'est réaliste, mais le Composer en place jusqu'à 5.
