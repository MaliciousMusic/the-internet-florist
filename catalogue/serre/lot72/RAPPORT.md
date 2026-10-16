# Lot 72 — ruscus et petits persistants (agent ruscus2)

Fichier : `s72a.js` (préfixe `l72`). Aucun module moteur modifié, donc aucun diff moteur.
Les 5 sids existaient déjà dans `k0.js` sous forme de recettes génériques (`a:"foliage"`, dessin 2D générique). Ma version les remplace sous le même sid par `GH`, `CWS`, `SZG` et `GHI` ; je n'ai touché ni aux recettes ni à `CATMETA`.

## Moteur réutilisé
- **Axe et pousse.** `fgAxis` et `fgGrow` (lot 24) : épine du Composer, planche et carte, et le contrat `{k, bw, bw1, bc, neck, nd}`.
- **Feuilles.** Surface `g35Surf` et feuille `g35Leaf` (lot 35), graine de planche `g35Run`, limite de lèvre `g35Lim`.
- **Fruits.** Baies dessinées par `bzFruit` (lot 20).
- **Ajout du lot : `l72Leaf`.**
  - Sur les planches (DET 2), c'est le `g35Leaf` complet : deux moitiés, nervures et brillance.
  - En bouquet, une seule silhouette pour la feuille. Le pli relève les marges, donc la feuille n'est jamais plate de profil.
  - L'option `inner` gère le galax « bordé de bronze » : le centre est réduit vers le milieu du limbe, ce qui donne un liseré d'épaisseur égale tout autour.
- **Ajout du lot : `l72Batch`.** Au détail de l'appli, les petites feuilles sont triées du fond vers l'avant, puis regroupées par séries de 7 à 20, avec un chemin par ton (lumière en 7 paliers). L'ordre du peintre tient, car une série est à profondeur quasi égale.
- **Rattachement.** Tous les pédicelles et pétioles font au moins 1,15. La baie du fragon chevauche son cladode. Les épines du fragon sont dessinées dans le contour même du cladode. Les étamines du myrte forment une seule étoile pleine, les anthères posées sur ses pointes. Rien ne flotte.

## Espèces
| sid | ce qui est fait | coloris | tailles (`SZG`, unité de la recette) |
|---|---|---|---|
| `ruscus-hypophyllum-israelien` | Tige arquée nue en bas. Cladodes alternes distiques tournés vers l'avant, ovales-lancéolés acuminés (rapport 0,42), plats, luisants, à nervures parallèles convergeant à la pointe, sans nervure médiane. Quelques rameaux courts. Pointe jeune pliée au stade bouton. | vert profond lustré, vert franc, vert bouteille | cladode 5 / 6 / 6 / 7,5 cm (tiges de 50 à 80 cm) |
| `ruscus-aculeatus-petit-houx` | Tige raide, ramifiée dans sa moitié haute en rameaux étalés. Petits cladodes rigides tordus dans tous les sens, terminés par une épine. Baie ronde posée au milieu de la face supérieure, verte puis orange puis écarlate selon le stade. | vert à baies rouges, vert sans baies | cladode 2 / 2,5 / 2,5 / 3 cm |
| `galax-urceolata` | Une feuille par tige, sur un long pétiole qui se courbe sans coude. Limbe presque rond, profondément cordé, bord crénelé (9 dents par moitié), coriace. Nervation palmée visible aussi en bouquet. Feuille jeune pliée au stade bouton. Branchement `bigLeaf` : seul le limbe est contrôlé au-dessus de la lèvre. | vert lustré, bronze rouge (hiver), vert bordé de bronze, bordeaux | largeur du limbe 5,5 / 7 / 7 / 10 cm (petite, moyenne, grande) |
| `myrtus-communis-myrte` | Feuilles opposées décussées, ovales-lancéolées pointues, luisantes, et nombreux rameaux. Fleurs axillaires blanches sur pédicelle : 5 pétales ronds creusés et une houppe d'étamines aux anthères jaunes ; boutons ronds blanc rosé au stade bouton. Baies ellipsoïdes bleu-noir pruinées, couronnées du calice. | vert (type), petites feuilles 'Tarentina', liseré crème 'Variegata', fleuri blanc, à baies bleu-noir | feuille 2,5 / 3 / 3 / 3,6 cm |
| `buxus-sempervirens-buis` | Rameaux très denses : feuilles opposées serrées, ovales, émarginées, pliées sur la nervure, luisantes dessus et plus claires dessous. Brindilles axillaires de 2 ou 3 paires pour la densité. | vert foncé lustré, vert tendre (pousses), panaché crème 'Elegantissima', stabilisé vert mat | feuille 1,6 / 2 / 2 / 2,4 cm |

**Notes botaniques**
- **R. hypophyllum.** Ses petites fleurs et ses baies rouges naissent sous les cladodes, mais on ne les voit pas sur les tiges coupées du commerce. Je ne les ai pas dessinées.
- **R. aculeatus.** Seuls les pieds femelles portent des baies (en hiver).
- **Galax.** Il se vend à la feuille, en bottes de 25.
- **Buis.** Ses fleurs printanières, minuscules, ne sont pas vendues. Pas de fleur dessinée.

## QA
- **Planches.** 9 vues × 3 stades, tous les coloris et 3 tailles, regardés en grand et zoomés : pas de pièce flottante, pas de tige coudée, pas de feuille plate de profil. Les vues et coloris sont dans `sheets/`.
- **Cartes du Composer.** 18 cartes, dans `sheets/cartes_composer.png`.
- **Bouquets composés** avec `inc=` les 5 sids, `n=20` :
  - seeds 5, 11 et 23 : **0 F, 0 U, 0 kink**, refait sur l'état commité ;
  - seeds 2 et 41 en plus : 0 partout ;
  - captures regardées : `sheets/bouquets.png` (seed 8) et un bouquet en grand.
- **Modèles.** `models_of.py` ne renvoie aucun modèle du catalogue pour ces 5 sids, donc il n'y a pas de QA modèles à faire.
- **Perf** (`perf=1`, 76 modèles, machine cloud) :
  - référence sans le lot : 217 ms, 8 295 éléments ;
  - avec le lot : 213 ms, 8 295 éléments ;
  - aucun écart. Le temps absolu vient de la machine : la référence du brief est de 142 ms.
- **Par tige en bouquet** (DET 1, moyenne de 6 tirages, éléments SVG / ms). Repères : pittosporum 390–690 / 10–19 ; loropetalum 290–470 / 7–12.

  | espèce | éléments | ms |
  |---|---|---|
  | ruscus israélien | 45–63 | 2–5 |
  | fragon | ~320 | 17–21 |
  | galax | ~31 | ~1 |
  | myrte | 135–330 | 7–17 |
  | buis | 310–410 | 13–17 |
  | buis 'Elegantissima' | ~720 | ~30 |

## Doutes
- **Buis 'Elegantissima'.** Il reste le plus lourd (environ 720 éléments par tige), car chaque centre panaché est un chemin de plus. On peut l'alléger en réduisant encore les brindilles.
- **Coloris peints.** Galax et ruscus peints or ou argent existent pour les fêtes. Je ne les ai pas ajoutés, faute de source fiable sur les teintes vendues.
