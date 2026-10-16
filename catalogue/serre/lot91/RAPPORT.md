# Lot 91 — graminées 2 (agent graminees2)

Fichier : `s91a.js`, préfixe `l91` / `L91`. Aucune copie moteur, aucun diff moteur.
Aucune de ces 5 espèces n'avait de version GH : elles passaient par les recettes génériques (`line`, `spray`). Les nouvelles versions remplacent ces dessins sous les mêmes sids.

## Moteur commun du lot
- `l91Grow` : le culme est poussé par le L-système dans le repère de la ligne (`lnAxis`, `lnHug`/`lnSink` via `l40Lay`). Il compte 6 ou 7 entrenœuds qui s'allongent vers le haut, avec des nœuds annelés. Les feuilles sont alternes et distiques : une gaine enroulée jusqu'à la ligule (`lnTube`), puis un limbe en ruban 3D (`lnRibbon`) qui s'arque et retombe en vrillant un peu. L'inflorescence est poussée par la même tortue (règles propres à chaque espèce).
- Les axes passent tous par `lnSub` (Catmull-Rom) : aucun coude net.
- En bouquet, les rachis, rameaux et pédicelles font au moins 1,1 unité de large, et les détails partent tous de leur courbe porteuse : épillets à l'extrémité des pédicelles, poils dans le corps de l'épi.
- Il y a trois stades. Bouton : l'inflorescence sort de la gaine de la feuille paniculaire (`l91Boot`), compacte et verte. Mi-ouvert : elle s'étale, encore verdie. Ouvert : elle est mûre, au coloris vendu (`l91Ripe`).

## Espèces
- **setaria** (Setaria italica, 'Lowrey', 'Red Jewel'). Fausse grappe cylindrique et dense de 12 à 16 cm × 1,5 à 2 cm, arquée et de plus en plus penchée en mûrissant. Le corps laineux reprend `g37LagSpike` (lot 37), avec un halo soyeux de soies et, sur les planches, les soies rudes peignées vers la pointe. Trois feuilles larges (1,5 à 2 cm).
  - Coloris : vert (Lowrey), vert foncé, vert anis, doré (séché), bronze (mûr), pourpre fumé (Red Jewel), teint bordeaux.
  - Tailles : 60 à 90 cm.
- **phalaris** (Phalaris canariensis). Tête ovoïde compacte de 2,5 à 3,2 cm × 1,3 à 1,8 cm, en 3D : les épillets carénés sont posés sur un ellipsoïde, chacun éclairé par sa normale, avec la carène verte au milieu. Ceux du dos sont masqués. Culme raide, deux feuilles étroites.
  - Coloris : vert pâle (frais), naturel crème, blanchi, grège, teint terracotta, teint chocolat.
  - Tailles : 40 à 60 cm.
- **briza** (Briza maxima). Panicule lâche qui penche, aux rameaux capillaires alternes, parfois fourchus. Les épillets en médaillons ovales et cordés (1,7 à 2,2 cm) pendent sur des pédicelles courbes. Leurs lemmes arrondies se croisent en deux rangs (effet tressé), avec une marge pâle.
  - Coloris : vert tendre (frais), vert olive, vert teinté pourpre, doré naturel (séché), blanchi, teint framboise.
  - Tailles de panicule (unité de la recette) : 10 à 18 cm ; plante entière ≈ ×3.
- **miscanthus** (M. sinensis 'Silberfeder', 'Rotsilber', 'Malepartus', 'Flamingo'). Plume en éventail de 22 à 28 cm : un axe court porte 13 à 17 grappes soyeuses (`l40Veil`), serrées et cuivrées au bouton, étalées et recourbées à l'ouverture. Longues feuilles rubanées à nervure médiane blanche.
  - Coloris : argenté, blanc crème, crème doré (séché), vieux rose, pêche, rouge cuivré, bordeaux.
  - Tailles : 60 à 120 cm.
- **chasmanthium** (C. latifolium). Culme arqué, 5 feuilles lancéolées larges, à la manière d'un bambou. Panicule lâche qui penche, aux rameaux ployés. Les épillets sont vraiment plats (2,6 à 3,3 cm × 1,4 à 1,8 cm) : ils s'amincissent quand on les voit de chant, avec un bord denté par les fleurons et des fleurons en arête de poisson sur les planches.
  - Coloris : vert (frais), vert bronze, bronze cuivré, brun doré, paille (séché).
  - Tailles de panicule : 18 à 30 cm ; plante ≈ ×2,8.

Toutes les espèces sont en GHI `form:'ligne'`, `k:'plant'` : les épis dépassent la masse et ne passent jamais sous la lèvre.

## QA
- Bouquets composés, `inc=setaria,phalaris,briza,miscanthus,chasmanthium`, graines 5, 6 et 7, n=20 : **0 F, 0 U, 0 kink** sur les 60 bouquets. Captures regardées : graine 3 (8 bouquets) et `sheets/bouquets.png`.
- Modèles : `models_of.py` renvoie une liste vide, car aucun des 76 modèles n'utilise ces espèces. Il n'y a donc rien à tester de ce côté.
- Perf (`perf=1`) : 195 ms et 8 295 éléments par bouquet. Une base sans le lot, mesurée sur la même machine, donne 198 ms et 8 295 éléments : l'effet du lot est nul (cette machine cloud est plus lente que la référence de 142 ms).
- Éléments SVG par plante entière au DET 1 (culme, feuilles et inflorescence) : sétaire 34 à 41, alpiste 56 à 57, amourette 50 à 57, chasmanthium 93 à 110, miscanthus 111 à 127.

## Doutes
- Miscanthus séché : les feuilles restent vertes (tige coupée fraîche). Pour les coloris séchés, on pourrait les retirer ou les sécher.
- Phalaris « blanchi » et briza « blanchi » sont très pâles sur fond crème. Le liseré est léger, mais ils restent lisibles.
- Sétaire en bouquet : sur les épines très ouvertes, l'épi penché peut se coucher presque à l'horizontale. C'est botaniquement juste, mais on peut le redresser si on le juge trop lourd.
