# Lot 88 — ombelles et vert acide (agent ombelles2)

Fichier : `s88a.js` (préfixe `l88`). Aucun module moteur n'est modifié, donc aucun diff moteur.
Ces cinq espèces n'avaient pas de version 3D. Chacune passait par la recette générique (`spray` / `globe`).
Moteurs réutilisés :
- `chpHeadS`, `chpEll` et `chpDot` (lot 17, carotte et ammi) ;
- `l31Fr` (lot 31) ;
- `l30Batch`, `l30Twigs` et `l30Hull` (lot 30, matricaire) ;
- `bzShoot` et `bzGrow` (lot 20) ;
- `lsLeaf2D` et `stemPoly` (l0).

Règle de dessin : tout trait qui porte quelque chose (rayon, pédicelle, rameau, rachis) mesure au moins 1,1 unité. Chaque fleuron, bouton ou bractéole est posé sur sa courbe porteuse.

## Espèces

### aneth — *Anethum graveolens* (tête, `globe`)
- **Fait :**
  - tige creuse, striée, vert bleuté ;
  - grande ombelle plate de 30 rayons fins et inégaux, sans involucre ni involucelles ;
  - ombellules en petits dômes de fleurons jaunes, avec des rayonnules visibles sur la planche ;
  - feuilles 3–4 fois découpées en lanières filiformes (`l88Cut`, option `fork`) sur une gaine large ;
  - ombelles plus jeunes sur des rameaux latéraux ;
  - stades : bouton (boule vert-jaune serrée), coupe, ombelle plate. Le coloris « en graines » porte des fruits aplatis et côtelés.
- **Coloris :** jaune verdâtre (Bouquet), jaune vif (Mammoth), jaune d'or (Dukat), vert en graines.
- **Tailles (ombelle, cm) :** 10, 12, 15, 18.

### orlaya — *Orlaya grandiflora* 'White Lace' (tête, `globe`)
- **Fait :**
  - ombelle plate de 9 rayons ;
  - les fleurons du bord des ombellules extérieures portent un très grand pétale externe obcordé, bilobé et tourné vers l'extérieur, plus deux petits pétales latéraux : c'est l'anneau de dentelle ;
  - ombellules centrales petites ;
  - involucre de bractées lancéolées à marge blanche ;
  - feuilles 2–3 fois découpées en lobes étroits ;
  - en fruits : fruits verts ovoïdes, sans pétales.
- **Coloris :** blanc pur (White Lace), blanc verdi (jeune), en fruits (vert).
- **Tailles (ombelle, cm) :** 6, 7, 8, 10.

### tanaisie — *Tanacetum vulgare* (tête, `globe`)
- **Fait :**
  - corymbe plat ou à peine bombé, fait de grappes de boutons ronds jaune d'or sans rayons ;
  - chaque bouton est en volume : involucre vert dessous, dôme, centre déprimé, grain des fleurons visible sur la planche ;
  - rameaux du corymbe partant plus bas vers le bord, pour mettre les boutons de niveau ;
  - tige forte, brun-vert ;
  - feuilles pennées (`l88Fern`) à nombreuses paires de segments lancéolés dentés ;
  - corymbes plus jeunes sur des rameaux latéraux ;
  - bouton vert olive, puis jaune.
- **Coloris :** jaune d'or, jaune citron (jeune), ocre doré (mûr), jaune d'or à feuillage doré (Isla Gold).
- **Tailles (corymbe, cm) :** 6, 8, 9, 12.

### bupleurum — *Bupleurum rotundifolium* / 'Griffithii' (spray le long de l'épine)
- **Fait :**
  - tige glauque ramifiée ;
  - chaque rameau traverse une feuille perfoliée ronde-ovale, mucronée, glauque (`l88Disc`) :
    - la tige perce le limbe près de sa base, et des nervures fines partent de ce point ;
    - le tronçon de tige qui passe devant le limbe est redessiné du côté visible ;
  - les rameaux, alternes et plus longs en bas, se courbent et finissent en petites ombelles de 4 à 7 rayons ;
  - chaque ombellule est une coupe de 5 bractéoles larges et pointues vert-jaune, colorées selon la face visible, autour d'un nœud de fleurons jaunes ;
  - fourches avec petite feuille perfoliée (au détail planche) ;
  - grandes feuilles plus bas, au-dessus de la lèvre du vase dans un bouquet.
- **Coloris :** vert acide (Green Gold), jaune-vert (Griffithii), vert tendre (Garden Green).
- **Tailles (spray, cm) :** 20, 25, 30.

### alchemille — *Alchemilla mollis* (spray le long de l'épine)
- **Fait :**
  - tige ramifiée en cymes dichasiales lâches, avec une fleur à chaque fourche et des glomérules de 3 à 5 fleurs aux extrémités ;
  - fleurs sans pétales en étoile à 8 pointes (4 sépales et 4 lobes de calicule), avec un disque jaune ;
  - boutons verts ;
  - feuilles caulinaires rondes et réniformes (`l88Disc`) :
    - 7 à 9 lobes arrondis, dentés, avec un sinus basal ;
    - plissées en éventail le long des nervures, qui sont dans les creux ;
    - creusées en coupe ;
    - portées par un pétiole, avec une stipule foliacée au nœud.
- **Coloris :** vert acide (mollis), jaune-vert (Thriller), vert tendre (Robusta).
- **Tailles (spray, cm) :** 12, 15, 18.

Registres :
- `CWS`, `SZG` et `GHI` pour les 5 espèces : `disque`/`head` pour les têtes, `grappe`/`plant` pour les sprays ;
- `GH_BUDS` pour aneth, orlaya et tanaisie.

## Vérifications
- **Planches :**
  - 9 vues × 3 stades, regardées pour chaque espèce, avec des gros plans (rendus à 2400 px recadrés) des ombelles, des corymbes, des coupes du buplèvre et des feuilles plissées ;
  - coloris et tailles vérifiés ;
  - aucune erreur JS.
- **Livrables `sheets/` :**
  - `<sid>_vues.png` et `<sid>_coloris.png` pour les 5 espèces ;
  - `cartes_composer.png` ;
  - `bouquets.png` (graine 7).
- **QA composée** `inc=bupleurum,alchemille,aneth,orlaya,tanaisie`, graines 5, 11 et 3 × 20, sur le code final : **60 bouquets, 0 F, 0 U, 0 kink**. Chaque bouquet impose jusqu'à 3 produits de ces espèces. Captures regardées (graines 3 et 7).
- **QA des modèles :** `models_of.py` ne renvoie aucun modèle (`ns=` vide). Aucun modèle du catalogue n'utilise ces espèces.
- **Perf (`perf=1`, 76 modèles) :**
  - 173–176 ms et 8 295 éléments par bouquet, identiques à une construction témoin sans le lot sur la même machine (175 ms et 8 295 éléments) ;
  - cette machine cloud est plus lente que la référence de 142 ms.
- **Éléments SVG à DET 1** (plante entière, tige complète hors bouquet, moyenne de 6 tirages) :

  | Espèce | Éléments |
  |---|---|
  | aneth | ≈ 49 |
  | orlaya | ≈ 74 |
  | tanaisie | ≈ 89 |
  | alchémille | ≈ 108 |
  | buplèvre | ≈ 135 |

  Pour le buplèvre, j'ai allégé le rendu au détail de l'appli : la traversée de la tige est un seul trait, et les nervures et les feuilles de fourche ne sont dessinées qu'au détail planche. Dans un bouquet, les feuilles basses sous la lèvre ne sont pas dessinées.

## Doutes
- **Fruits d'orlaya :** ce sont des ovoïdes verts lisses. Les épines crochues ne sont pas dessinées.
- **Tanaisie de profil :** l'ombelle orientée vers l'œil montre les rameaux du corymbe en éventail. C'est plausible, mais moins lisible qu'en face.
- **Rameaux d'alchémille :** au minimum de 1,1 unité, ils sont plus épais qu'en vrai (0,5 mm). J'ai compensé avec des glomérules plus denses.
- **Coloris du commerce :** ils sont rares pour ces espèces, souvent une seule teinte. Les variantes proposées sont des stades (jeune, mûr, en graines) ou des cultivars connus (Green Gold, Thriller, Robusta, Mammoth, Dukat, Isla Gold).
