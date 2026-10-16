# Lot 99 « baies 3 » : rapport (agent baies3)

Fichier : `s99a.js` (préfixe `l99` / `L99_`). Aucun module moteur n'a été modifié : pas de diff. Le lot réutilise les moteurs des lots 20, 45 et 61 : `bzShoot`, `bzGrow`, `bzBlade`, `bzFruit`, `bzRipe`, `l45Axes`, `l61Clu`.
Aucune de ces cinq espèces n'avait d'ancienne version : `grep "'<sid>'" demo/src/*.js` ne trouve rien, en dehors de la recette dans `k0.js`.

Ce que le lot ajoute en commun :
- `l99Berry` : une baie sur son pédicelle, ovoïde ou ronde. À DET 2, elle reçoit un reflet propre au coloris : bleu métallique, lumière traversant une drupe translucide, ou joue rosée.
- `l99Pet` : un pétiole poussé par le L-système ; le limbe part de son extrémité.
- `l99Lobe` et `l99Teeth` : une feuille découpée en 3D, avec un contour libre posé sur la surface `lsLeafS`, des dents en scie et des nervures palmées. Elle sert à la feuille trilobée de *V. opulus*.
- `l99Valve` et `l99Cap` : la capsule du célastre. Elle est fermée (avec ses sutures) ou ouverte : trois valves en coque qui se réfléchissent derrière l'arille écarlate.

Les stades (bouton → ouvert) suivent `op` : baies vertes, puis en mûrissement, puis mûres ; pour le célastre, capsules fermées, puis fendues, puis ouvertes. Les tiges sont lissées par la tortue, avec tropisme et `aim` : aucun coude, chaque baie et chaque capsule tient à son pédicelle, et tous les pédicelles font au moins 1,15 unité de large.

## Espèces
- **laurier-tin-a-baies** (*Viburnum tinus*)
  - Botanique : jeunes tiges rougeâtres ; paires décussées de feuilles elliptiques, entières, coriaces, vert très sombre et brillantes ; corymbes terminaux plats de drupes ovoïdes de 6 à 7 mm, qui passent du vert au violet puis au bleu indigo métallique.
  - Dessin : le corymbe pousse en rayons primaires, chacun finissant en petite ombelle. Des rameaux latéraux, à l'aisselle des feuilles du haut, portent un corymbe plus petit. Dans les coloris « boutons », certains de ces corymbes sont en boutons roses ou blancs, comme en hiver.
  - Coloris : bleu métallique, bleu nuit (Gwenllian), bleu-noir, mi-mûr, baies et boutons roses (Eve Price), baies et boutons blancs.
  - Tailles (largeur du corymbe) : 6, 7, 8, 10 cm.
- **viornes-a-baies** (*V. opulus*, *V. dentatum*, *V. nudum*)
  - Botanique : feuilles opposées. Leur forme dépend du coloris : trilobées et dentées pour *opulus*, ovales à grosses dents et nervures plissées pour *dentatum*, entières et brillantes pour *nudum*.
  - Dessin : des cymes larges, au bout d'un pédoncule qui s'arque puis pend. Les drupes de 8 à 10 mm pendent sous leur poids ; celles d'*opulus* sont translucides.
  - Coloris : rouge translucide, rouge cerise (Compactum), orange corail (Aurantiacum), jaune ambré (Xanthocarpum), bleu (Blue Muffin), rose et bleu mêlés (Brandywine : crème, puis rose, puis bleu), rose.
  - Tailles (largeur de la cyme) : 7, 8, 9, 11 cm.
- **celastre-bittersweet** (*Celastrus orbiculatus*, *C. scandens*)
  - Botanique : liane ligneuse gris-brun, vendue sans feuilles ; petites cymes axillaires de 1 à 4 capsules de 8 à 10 mm. À maturité, les trois valves jaune orangé se rabattent et découvrent les arilles rouge vif.
  - Dessin : un ou deux rameaux volubiles, ondulés par la tortue. Dans le Composer, l'espèce est une « ligne », comme le callicarpa.
  - Coloris : orange, jaune d'or, orange vif (Autumn Revolution), vert (capsules fermées).
  - Tailles (longueur de la liane) : 40, 50, 60, 80 cm.
- **nandina-a-baies** (*Nandina domestica*)
  - Botanique : cannes fines ; grande feuille bipennée aux folioles lancéolées brillantes (pourprées en hiver dans un coloris) ; panicule lâche et ramifiée, penchée sous le poids de ses baies rondes de 7 à 8 mm.
  - Coloris : rouge vif, rouge corail, rouge à feuillage d'hiver pourpré, blanc crème (Alba), vert.
  - Tailles (longueur de la panicule) : 18, 22, 25, 30 cm.
- **symphorine** (*Symphoricarpos albus*, *S. × doorenbosii*)
  - Botanique : rameaux fins et arqués ; petites feuilles opposées vert bleuté mat ; grappes serrées de baies cireuses de 1 à 1,5 cm, à chaque nœud et au bout du rameau, avec un petit calice sombre à la pointe. Un rameau secondaire arqué part de la base.
  - Coloris : blanc (Magical Snowflake), blanc nacré rosé (Mother of Pearl, avec une joue rose), rose tendre (Magical Sweet), rose vif (Magical Candy), rose pourpré (Magical Pride), rose profond (Magical Galaxy).
  - Tailles (longueur de la partie fructifère) : 15, 20, 25 cm.

## QA et perf
- **Planches** : vues × stades, coloris et tailles, regardées en grand et zoomées à DET 2.
- **Bouquets composés** avec `inc=` les 5 espèces, graines 5, 11 et 23 × 20 : **60 bouquets, 0 F, 0 U, 0 kink**. Deux captures regardées (graines 3 et 7).
- **Modèles du catalogue** : `models_of.py` renvoie `ns=` vide. Aucun des 76 modèles n'utilise ces espèces, donc il n'y avait aucun modèle à tester.
- **Perf** (`perf=1`, 76 modèles) : 177 ms et 8 295 éléments en moyenne, contre 175 ms et 8 295 éléments sans le lot, mesurés sur la même machine cloud, plus lente que la référence de 142 ms.
- **Éléments par tige à DET 1** (moyenne sur 12 tiges sur épine) :

  | Espèce | Éléments | Temps |
  | --- | --- | --- |
  | laurier-tin | 397 | 6,9 ms |
  | viornes | 372 | 5,7 ms |
  | célastre | 362 | 6,7 ms |
  | nandina | 422 (avant la réduction finale de la panicule) | 6,9 ms |
  | symphorine | 357 | 5,0 ms |

  C'est dans la fourchette des branches à baies existantes, mesurées de la même façon : buisson ardent 342, callicarpa 411, sorbier 378, cotonéaster 382. C'est en revanche au-dessus du repère « une tête : 100 à 150 éléments », qui vaut pour une fleur seule, pas pour une branche feuillée.

## Doutes
- *V. tinus* : les boutons roses ou blancs à côté des baies correspondent à l'aspect d'hiver ; les noms de cultivars ne sont donnés qu'à titre indicatif.
- *V. nudum* « Brandywine » mêle volontairement des baies crème, roses et bleues sur une même cyme.
- Les cultivars de symphorine de la série Magical® ont été vérifiés auprès de pépiniéristes, mais leurs teintes exactes varient selon les lots.
- Les feuilles vues par la tranche, en profil, restent de fins croissants sombres : c'est voulu, puisque les feuilles sont en 3D.
