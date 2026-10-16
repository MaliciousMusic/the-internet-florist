# Lot 75 « feuillages tropicaux 3 » (agent tropicales3)

Fichier : `s75a.js` (préfixe `l75` / `L75_` / `CW_L75`). Aucun module moteur modifié. Les cinq sid n'avaient pas encore de version dédiée (dessin générique `foliage`) : ils sont branchés dans `GH`, `CWS`, `SZG` et `bigLeaf`.

## Moteur du lot
- **Feuilles découpées** (monstera, selloum, Xanadu) : `l75CutBlade`. Chaque moitié du limbe est une nappe `sheet3`, courbée en 3D par `l38M` (lot 38) et soulevée par `dz` (`l75M`) pour onduler les lobes.
  - Ses rangées suivent les nervures latérales (`l75Row`) : elles partent de la nervure médiane (ou du pétiole, en éventail, pour les lobes basaux) et montent vers la pointe en s'arquant.
  - Une découpe raccourcit les rangées autour d'elle (`l75Rm`). Elle part donc de la marge le long d'une nervure, en coin, avec un fond arrondi (`g0`) et un évasement (`p`).
  - Les fenêtres du monstera sont de vrais trous : un `clip-path` evenodd par bande, qui laisse voir ce qu'il y a derrière.
  - La pétiole, les nervures médiane et latérales (une par lobe) et les panachures partent toutes de leur courbe porteuse.
  - Le lustre et les mouchetures sont coupés à la silhouette de la bande, pour qu'aucun reflet ne déborde dans une découpe.
- **Alocasia, anthurium** : le limbe en cœur ou en flèche du lot 38 (`l38Blade`, `l38Plant`), avec des contours et des nervures propres au lot.
- **Tiges** : pétiole poussé par le L-système (`l38Plant` → `fgGrow`), qui se courbe sans coude. Contrat `{k,bw,bw1,bc,neck,nd}` sur épine, planche et carte. Géniculum renflé sous le limbe du monstera et de l'anthurium.
- **Jeunes feuilles** (stade bouton) enroulées en cornet, comme elles sortent réellement chez ces aracées. Le jeune monstera, au stade bouton, n'a encore ni découpe ni fenêtre ; l'anthurium déroule une feuille bronze.
- **Dans un bouquet**, le limbe rétrécit jusqu'à ce que toute sa marge reste au-dessus de la lèvre (`lim`).
- **bigLeaf** : `{ext:14,k0:12}` pour monstera, Xanadu et anthurium ; `ext:30` pour le selloum et l'alocasia, dont les lobes basaux pendent sous le haut du pétiole.
- **Budget d'éléments** : `sheet3` pose un arrêt de dégradé par rangée, et une feuille découpée en a besoin de 40 à 60. `l75Thin` ramène ce dégradé à 12 arrêts après le dessin, car la lumière y varie doucement. Au détail de l'appli (DET 1), cela donne : monstera 99, selloum 104, Xanadu 83, alocasia 98, anthurium 93 éléments par feuille.

## Espèces
| sid | botanique | coloris (CWS) | tailles (limbe, cm) |
|---|---|---|---|
| monstera-deliciosa | Limbe cordé, presque aussi large que long, épais, très luisant. Découpé en 5 à 7 entailles par côté, plus profondes sous le milieu. Fenêtres ovales près de la nervure, entre les nervures latérales. Long pétiole terminé par un géniculum. | vert foncé brillant, vert profond, panachée blanc (Albo, secteurs le long des nervures), Thai Constellation (mouchetures crème) | 25 / 40 / 55 (Mini, Medium, Large) |
| philodendron-bipinnatifidum-selloum | *Thaumatophyllum bipinnatifidum*. Limbe ovale-sagitté, découpé presque jusqu'à la large nervure pâle en 9 à 11 paires de lobes arrondis, ondulés et relobés (bipennatifide). Lobes basaux lobés eux aussi. Pétiole fort et pâle. | Selloum, Pinnatifidum (vert franc), Hope (plus ondulé) | 40 / 60 / 75 |
| philodendron-xanadu | Plus petit et compact. 7 à 9 lobes étroits et raides par côté, aux bords droits, pointés vers l'avant. Vert un peu mat. Feuille dressée. | Xanadu, Winterbourn, reflets bronze cuivré | 20 / 30 / 40 |
| alocasia | Limbe sagitté, avec deux lobes basaux en arrière. Il est pelté (en bouclier) chez 'Polly' et 'Black Velvet'. Marge festonnée entre les nervures. | Polly, Amazonica (vert noir, nervures et nervure collectrice ivoire, revers pourpré), Frydek (velours mat, nervures blanches), odora (vert vif uni), Black Velvet (bronze), Variegata (secteurs crème) | 25 / 40 / 55 |
| anthurium-feuilles | Limbe cordé à sagitté, plus long que large, à sinus profond et pointe effilée. Épais, très luisant. Nervures latérales arquées et nervure collectrice. Géniculum. | Andreanum (vert foncé brillant), vert franc, Jungle King (plus long, ondulé), jeune feuille bronze | 20 / 30 / 40 |

Les couleurs des recettes (`k0.js`) retombent sur ces coloris par `fgCw`. Par exemple, `#d9ddc6` donne le monstera Albo et `#c9cba2` l'alocasia Variegata.

## QA
- **Planches** : 9 vues × 3 stades, coloris, tailles, regardées en grand et zoomées. Aucune pièce ne traverse, aucune tige n'est cassée, aucune feuille n'est plate de profil (pli et vrille).
- **Cartes du Composer** : `sheets/cartes_composer.png`.
- **Bouquets composés** avec `inc=` les 5 sid :
  - seeds 5, 6, 7, 8 et 9 × 20 : **0 F, 0 U, 0 kink** ;
  - deux défauts trouvés en cours de route, puis corrigés : une moucheture Thai qui débordait dans une découpe (F), et un lobe basal du selloum sous la lèvre (U). Le premier est réglé par le clip à la bande, le second par une vérification plus dense de `lim`.
- **Modèles** : `models_of.py` ne renvoie aucun modèle (`ns=` vide), donc il n'y a rien à tester.
- **Perf** (`perf=1`, 76 modèles) :
  - 188 ms et 8 295 éléments par bouquet ;
  - la base `_test`, sans le lot, donne 192 ms et 8 295 éléments sur la même machine cloud : il n'y a aucune différence, puisque aucun modèle n'utilise ces espèces ;
  - les écarts avec la référence du brief (142 ms, 10 150 éléments) viennent de la machine et de l'état actuel de `main`.

## Diffs moteur
Aucun.

## Doutes
- Les feuilles sont à l'échelle réelle (UPC). Dans les petits vases, un monstera ou un selloum de 40 à 60 cm domine donc beaucoup le bouquet. C'est juste, mais le Composer pourrait préférer la taille Mini.
- Les fenêtres laissent voir le fond de la planche, ce qui est correct. En bouquet, elles montrent les feuilles de derrière, souvent du même vert, et se lisent alors moins bien.
- Le jeune monstera « bouton » est enroulé et entier. En réalité, une feuille adulte déjà découpée sort aussi enroulée ; j'ai gardé la forme juvénile entière, plus lisible.
