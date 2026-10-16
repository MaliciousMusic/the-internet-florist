# Lot 70 « asparagus » : rapport

Fichier : `s70a.js`, préfixe `l70`. Aucun module moteur n'est modifié. Les cinq sids n'avaient pas d'ancienne version dédiée : seul le tracé générique des recettes était utilisé (`grep` ne les trouve que dans `k0.js`).

## Moteur du lot
- **Pousse.** `l44Main` (lot 44) fait pousser l'axe principal le long de son chemin (épine du Composer, arc d'une planche ou bouquet d'une carte). Les règles propres à chaque espèce font ensuite pousser rameaux, ramilles, éperons et organes (`T` pour les pointes, `X` pour les houppes, `K` pour les grappes de cladodes, `Sp` pour les épines, `Bx` pour les baies).
- **Axe arqué.** `l70Axis` dessine sur planche l'axe du sprengeri, qui monte puis retombe. C'est une courbe de Bézier continue, sans aucun coude.
- **Cladodes en lots.** `l70Clad` place les cladodes par fascicules en spirale. Chacune part de la surface de son axe et forme un trait courbe d'au moins 1,12. Les cladodes plates ont deux largeurs de trait : de face et de chant.
  - Houppes : `l70Puff` et `l70Pad` (nuages de houppes, chacune sur un cœur sombre).
  - Faucilles : `l70Sickle` (polygones éclairés selon leur face, vrille, reflet lustré, nervure sur les planches).
  - Le tout est dessiné par lots de chemins avec `l30Batch` (lot 30), par bandes de profondeur.
- **Axes fins.** Ce sont des traits groupés d'au moins 1,15 (`l30Twigs`). Les axes épais sont des rubans ombrés (`lsChainParts`).
- **Stades.**
  - Bouton : pointe en turion (lance à écailles teintée, `l70Spear`), et 30 % de chaque axe en jeunes cladodes pâles et courtes.
  - Mi-ouvert : 12 % de jeunes cladodes.
  - Ouvert : aucune jeune cladode ; baies mûres sur le coloris « à baies ».
- **Contrat.** `{k, bw, bw1, bc, neck, nd}` via `l44Out`. Dans un bouquet, tout reste au-dessus du col (`g35Lim`) : un rameau qui plongerait est arrêté.
- **Tailles.** Une taille au-dessus de 15 cm est une longueur de tige du commerce. En dessous, la taille de cladode de la recette fait varier la longueur, si bien que la section « tailles » montre 3 tailles.

## Espèces
| sid | Morphologie dessinée | Coloris | Tailles (cm de tige) |
|---|---|---|---|
| `asparagus-virgatus-tree-fern` | Tige grêle, dressée, nue au pied. Étages horizontaux de 3 à 5 rameaux, ramifiés dans le même plan. Aiguilles très fines de 0,5 à 1 cm, par 3, vert foncé : un petit arbre aérien. | Vert foncé, Vert | 50 / 60 / 80 |
| `asparagus-macowanii-ming-fern` | Tige ligneuse pâle, rameaux alternes étalés. Les éperons portent des nuages ronds de houppes d'aiguilles (2 à 4 houppes par nuage), comme les nuages d'un bonsaï. | Vert profond, Vert mousse | 40 / 50 / 60 |
| `asparagus-densiflorus-sprengeri` | Tige arquée ou retombante, rameaux courts. Cladodes plates linéaires de 1 à 3 cm, par 3 ou 4, vert clair. Petites épines aux nœuds (sur les planches). Baies vertes, orange puis rouges. | Vert tendre, Vert, Vert à baies rouges | 40 / 60 / 80 |
| `asparagus-densiflorus-myersii` | Plumeau dressé et raide (`GHI.tip`), cylindrique, dense. Les ramilles ascendantes sont en spirale serrée, leur portée maximale juste sous le milieu ; le plumeau s'effile en pointe. Un cœur sombre donne la densité. | Vert vif, Vert foncé | 30 / 45 / 60 |
| `asparagus-falcatus` | Longue tige pâle, ligneuse en bas. Épines recourbées aux nœuds. À chaque nœud, 3 à 5 cladodes en faucille de 5 à 8 cm × 5 à 8 mm, luisantes, avec nervure. Rameaux latéraux plus jeunes et plus petits vers la pointe. | Vert lustré, Vert | 60 / 70 / 100 |

Sources botaniques : connaissances générales (RHS, flores d'Afrique australe), sans recherche web dans ce lot. Le commerce vend ces feuillages au naturel ; aucun coloris teint n'est ajouté. Le registre `GHI` suit `F15_I` (`k:'plant'`, `rk:.44`, `self`, `fx`).

## QA
- **Bouquets composés**, `inc=` les 5 sids, 4 graines × 20 (5, 11, 23, 42) : **80 bouquets, 0 F, 0 U, 0 kink**.
  - Chaque espèce seule (`inc=<sid>`, graine 9, 20 bouquets chacune) : 0 / 0 / 0.
  - Un passage intermédiaire (graine 5) a montré 1 F, attribué à une garniture « boutons » d'un autre lot (tige fine décollée). Il a disparu après le réglage des densités.
- **Captures regardées.** Bouquets mélangés et bouquets par espèce ; planches en grand et zoomées au DET 2 (faucilles, houppes, baies, turions) ; cartes du Composer.
- **Modèles du catalogue.** `models_of.py` ne renvoie aucun modèle pour ces 5 sids : il n'y a pas de QA de modèles à faire.
- **Perf.**
  - Catalogue (`perf=1`) : 210 ms et 8 295 éléments, identiques avec et sans le lot sur cette machine (référence `_test` : 210 ms et 8 295 éléments). La machine cloud est plus lente que la référence du brief (142 ms).
  - Une tige le long d'une épine au DET 1 (`sptime` adapté, 12 tirages) :

    | Espèce | Temps | Éléments |
    |---|---|---|
    | sprengeri | 4,5 ms | 77 |
    | falcatus | 7 ms | 82 |
    | myersii | 12 à 14 ms | 112 |
    | Ming fern | 15 ms | 112 |
    | virgatus | 20 ms | 92 |

    Les éléments restent sous le budget de 150. Comparaison : picea-epicea 12 ms et 291 éléments, plumosus 4,5 ms et 75 éléments.

## Diffs moteur
Aucun.

## Doutes
- **Virgatus** : c'est la tige la plus coûteuse (20 ms au DET 1). Elle reste dans le budget d'éléments ; au DET 1, une ramille sur deux paires est omise.
- **Épaisseur des aiguilles** : le plancher de 1,12 unité (contrainte des pièces flottantes) rend les aiguilles un peu épaisses au zoom. À l'échelle d'une planche, elles se lisent fines.
- **Myersii dans un bouquet** : l'épine du Composer peut incliner le plumeau ; il reste droit grâce à `tip:1`, sans s'arquer.
