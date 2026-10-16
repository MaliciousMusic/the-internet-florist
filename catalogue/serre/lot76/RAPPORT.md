# Lot 76 — feuillages tropicaux 4 (agent tropicales4)

Fichier : `s76a.js`, avec le préfixe `l76` / `L76` / `CW_L76`. Aucun module moteur n'est modifié : pas de diff moteur.
Moteurs réutilisés :
- `l38M`, `l38Half`, `l38Paint`, `l38Vein`, `l38Pet`, `l38Saw` et `l38Plant` (lot 38) ;
- `fgGrow`, `fgAxis`, `fgFace` et `fgCw` (lot 24).

`l76Blade` est une copie de `l38Blade` pour un limbe entier. Elle ajoute un crochet `edge`, qui dessine les épines sur la marge, bande par bande.

Les 5 sids existaient déjà, mais seulement dans la recette générique `foliage` de k0 : leurs nouvelles versions passent par `GH`, sous le même sid. Toutes les nervures et tous les traits ont une épaisseur d'au moins 1,05 unité.

## Espèces

**`musa-feuille-bananier` (Musa spp.)**
- Ce qui est fait :
  - grand limbe oblong, arrondi ou tronqué à la base, obtus à la pointe ;
  - pétiole épais (L-système) ;
  - large nervure centrale pâle, avec, de chaque côté, 20 à 30 nervures latérales serrées et presque droites ;
  - déchirures en lanières le long des nervures, qui ne traversent jamais la nervure centrale ; il n'y en a pas sur la jeune feuille ;
  - jeune feuille roulée en cigare (stade bouton), puis à demi déroulée.
- Coloris : vert franc, vert tendre (jeune feuille), Zebrina (taches bordeaux, revers rougeâtre), Siam Ruby (rubis taché de vert), Ae Ae (secteurs blancs).
- Tailles : 60, 100 et 140 cm de limbe.
- Dans un bouquet, le limbe est recoupé à 75 % au plus de la longueur de l'épine. `bigLeaf = {ext:14, k0:12}`.

**`pandanus` (vaquois)**
- Ce qui est fait :
  - canne grise annelée de cicatrices foliaires ;
  - couronne de feuilles en lanière, sur trois rangs qui tournent en spirale (pas de 127,5°) ;
  - les feuilles externes sont longues et étalées, les internes dressées et pliées ;
  - chaque feuille embrasse la tige par sa base engainante, est canaliculée sur une carène et porte des épines sur ses deux marges, tournées vers la pointe (rouges chez P. utilis).
- Coloris : vert à épines rouges (utilis), Veitchii (marges et raies crème), Sanderi (raies jaune d'or), pandan (sans épines).
- Tailles : 60, 90 et 120 cm.
- Dans un bouquet : 9 feuilles au plus, de 65 % de l'épine au plus, et une canne plus fine.

**`alpinia-zerumbet-variegata` (gingembre coquille panaché)**
- Ce qui est fait :
  - canne de gaines ;
  - feuilles distiques et alternes, à pétiole court ;
  - limbe lancéolé acuminé et luisant ;
  - nervures latérales serrées, qui partent en angle aigu ;
  - panachure en rayures de largeurs variées qui suivent les nervures, partant de la nervure centrale ou de plus loin, visibles aussi, atténuées, au revers ;
  - feuille terminale roulée.
- Coloris : Variegata rayé jaune, Variegata rayé crème, jaune d'or rayé de vert, Chinese Beauty (marbré vert tendre).
- Tailles : 30, 45 et 60 cm.

**`codiaeum-variegatum-croton` (croton)**
- Ce qui est fait :
  - rameau ligneux aux feuilles spiralées, coriaces et très luisantes, sur des pétioles robustes ;
  - la forme suit le cultivar : ovale (Petra), étroite et spiralée en tire-bouchon (Mammy), linéaire et arquée (Zanzibar), lobée en chêne (Excellent), elliptique (Gold Dust, Mrs Iceton) ;
  - nervures jaunes qui tournent à l'orange sur les feuilles âgées, taches, piqûres d'or, raies et marge verte selon le cultivar ;
  - nervures visibles aussi au revers.
- Coloris : Petra, Mammy, Gold Dust, Zanzibar, Excellent, Mrs Iceton.
- Tailles : 15, 22 et 30 cm.

**`fatsia-japonica-aralia` (aralia du Japon)**
- Ce qui est fait :
  - limbe palmé à 7 ou 9 lobes (au hasard), qui rayonnent du sommet d'un long pétiole rond ;
  - près du centre, les lobes se recouvrent en un seul limbe ; les sinus descendent à environ 40 % ;
  - lobes dentés, chacun avec sa nervure médiane pâle et ses secondaires ;
  - limbe en dôme incliné vers l'arrière, pour que le profil ne soit jamais plat ;
  - jeune feuille repliée comme une main fermée.
- Coloris : vert laqué, Spider's Web (moucheté de blanc), Variegata (bord crème).
- Tailles : 20, 30 et 40 cm d'envergure.
- `bigLeaf = {ext:30, k0:12}`, car les lobes basaux pendent sous le pétiole.

**Composer.** `GHI` est fixé pour pandanus, alpinia et croton (`self`, `fx` de 18 à 20). Sans lui, le contrôle de la lèvre du vase (`ext` par défaut = 64) écartait ces trois feuillages de tous les bouquets en vase.

## QA
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées et zoomées (épines du pandanus, déchirures du bananier, motifs du croton).
- Cartes du Composer : OK.
- Bouquets composés avec `inc=` les 5 sids, graines 5, 11, 23 et 31 (4 × 20 bouquets) : **0 F, 0 U, 0 kink**. Deux graines supplémentaires (31 et 47), avec seulement pandanus, croton et alpinia : 0 partout.
  - Captures regardées : graines 3, 7, 9, 11 et 31.
  - Les 3 graines sur 5 espèces ne font pas apparaître tous les sids, car `inc=` n'en tire que 3 par bouquet. D'où la seconde série, et une vérification au navigateur que chacun entre bien dans les bouquets en vase.
- Modèles : `models_of.py` ne renvoie aucun modèle qui utilise ces sids, donc il n'y a pas de QA modèles à faire.
- Perf (76 modèles), mesurée sur cette machine : 215 ms et 8 295 éléments en moyenne. La référence `_test`, sans le lot, mesurée au même moment donne 220 ms et 8 295 éléments : aucun écart, puisqu'aucun modèle n'utilise ces espèces.
- Éléments SVG par tige au DET 1 (maximum sur les coloris), feuillages sur épine :

  | Espèce | Éléments |
  |---|---|
  | bananier | 31 |
  | fatsia | 91 |
  | alpinia | 94 |
  | pandanus | 145 |
  | croton | 160 à 212 (selon le coloris) |

  Le croton a été allégé de 408 à 212 en espaçant les nœuds. Pour comparaison, le coléus du lot 38 monte à 259.

## Doutes
- La feuille de bananier coupée mesure vraiment 1 m. Dans un bouquet, elle est recoupée à 75 % de l'épine, sinon elle écraserait tout.
- Le rouge du Siam Ruby sort un peu framboise à la lumière de la palette.
- Les lobes du croton Excellent restent assez ondulés : la découpe n'est pas aussi nette que chez un chêne.
- Les épines rouges du pandanus forment un liseré rougeâtre à l'échelle d'un bouquet. C'est juste pour P. utilis.
- La cible de 100 à 150 éléments par tête est dépassée par le croton (rameau de 10 à 12 feuilles), comme pour les autres feuillages en tige.
