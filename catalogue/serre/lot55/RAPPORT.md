# Lot 55 — Branches fleuries 2 (agent branches3)

Fichier : `s55a.js`. Préfixe des globaux : `l55` / `L55_`. Aucun module moteur n'a été modifié, donc pas de diff moteur.
Le lot réutilise le moteur du lot 29 (`demo/src/s29a.js`), chargé avant lui : `b29Grow` (L-système des rameaux), `b29Wood`, `b29Marks`, `b29Nodes`, `b29Rev`, `b29Stamens`, `b29Disc`, `b29Ped`, `b29Spread`, `b29Silk`.

## Ce que le lot ajoute au moteur des branches (dans `s55a.js`)
- **`l55Petal`.** Le pétale de `b29Petal`, avec deux ajouts :
  - une pointe frangée (`fr` dents, profondeur `fd`) ;
  - le pied seul du pétale (`vmax`), qui sert de fard posé sur le pétale.
- **`l55Corolla`.** Une corolle à plusieurs verticilles, qui donne les fleurs doubles.
  - L'ordre de dessin : les faces tournées vers nous verticille par verticille, puis le centre, puis les revers.
  - Fard à la base des pétales, côté intérieur ou côté revers, avec un ou plusieurs dégradés empilés.
  - Au détail de l'appli, chaque verticille d'un côté tient en un seul chemin.
- **`l55Calyx`.** La coupe du calice et ses sépales en lobes pleins, visibles de dos.
- **`l55Leaf3`.** Une jeune feuille en 3D sur son pétiole :
  - pliée sur sa nervure et retombante ;
  - chaque moitié ombrée selon sa normale, le revers plus pâle ;
  - dentée au détail des planches ;
  - jamais plate de profil.
- **Bourgeons.** Bourgeons dormants (`l55Dorm`) et bourgeon duveteux du magnolia (`l55MagBud`, soie argentée qui se fend).
- **Rattachement.** Toute liaison fait au moins 1,15 unité : pédoncules, pédicelles, pétioles, rameaux courts, calices.
  - Chaque organe part de son nœud sur le bois (rameau court → pédoncule commun → pédicelles).
  - Les fleurs sessiles sont posées sur l'écorce.
- **En bouquet** (`o.spine`), comme au lot 29 :
  - pas d'organe sous 30 unités ;
  - pas de fleur ni de feuille qui pende sous 28 unités.

## Espèces

**`cerisier-du-japon-sato-zakura`** (*Prunus serrulata*, groupe Sato-zakura)
- **Morphologie.**
  - Bois brun-marron lustré, barré de lenticelles pâles.
  - Rameaux courts à écailles brunes, avec 1 à 3 jeunes feuilles en 3D : bronze pour 'Kanzan', bronze-vert pour les autres.
  - Corymbe pendant de 2 à 4 fleurs : pédoncule commun court, puis longs pédicelles (2,6 à 4 cm) qui retombent.
  - Fleurs de 5,4 cm, tournées vers l'extérieur et le bas.
  - Fleurs doubles à 3 verticilles (10 + 9 + 7 pétales) frangés et échancrés, les pétales intérieurs plus petits et dressés, avec les 2 pistils foliacés verts au centre.
  - 'Shirotae' et 'Ukon' sont semi-doubles (6 + 6 pétales), avec une couronne d'étamines jaunes.
  - Boutons ronds rose foncé. L'ouverture progresse depuis le pied de la branche.
- **Coloris (5) :** Rose vif (Kanzan), Rose (Pink Perfection), Rose tendre (Ichiyo), Blanc (Shirotae, Mont Fuji), Jaune verdâtre (Ukon).
- **Tailles :** 60 à 120 cm.

**`amandier-en-fleurs`** (*Prunus dulcis*)
- **Morphologie.**
  - Bois gris, rugueux sur le vieux bois (stries sombres, lenticelles pâles), brun-rouge vers les pointes.
  - Fleurs par 1 ou 2, presque sessiles contre le bois, sortant d'écailles brunes.
  - Fleur de 4,1 cm : 5 pétales obovales larges, un peu échancrés, blanc à rose pâle.
  - Fard rouge au pied des pétales (le cœur rouge), une trentaine d'étamines à filets rosés et anthères orangées, disque rouge, calice brun-rouge.
  - Boutons roses qui pâlissent en gonflant.
- **Coloris (3) :** Blanc à cœur rouge, Blanc rosé (Princesse), Rose tendre (Robijn).
- **Tailles :** 60 à 100 cm.

**`pecher-a-fleurs`** (*Prunus persica*, cultivars d'ornement)
- **Morphologie.**
  - Longues tiges droites, lisses, rouge-brun lustré, avec peu de rameaux.
  - Fleurs par 1 ou 2 à presque chaque nœud (tous les 1,4 à 2,2 cm), serrées contre le bois, sortant d'écailles gris-brun duveteuses.
  - Fleurs doubles de 3,7 cm, à 3 verticilles (5 + 8 + 7 pétales) qui gardent du volume de profil.
  - Fleurs simples de 3,1 cm : 5 pétales, œil plus foncé, étamines à filets roses.
  - Calice brun-rouge, boutons pointus rose foncé.
  - 'Peppermint Stick' est panaché par pétales : blancs, rosés et rouges, parfois une fleur entière rouge.
- **Coloris (6) :** Rose vif double (Klara Meyer), Rose vif simple, Rouge cerise double (Russell's Red), Rouge pourpre double (Melred), Blanc double (Iceberg), Blanc strié de rouge (Peppermint Stick).
- **Tailles :** 60 à 100 cm.

**`pommier-pommetier-en-fleurs`** (*Malus domestica*, *M. floribunda*, hybrides)
- **Morphologie.**
  - Bois gris-brun et rameaux courts noueux (avec leurs cicatrices annulaires au détail des planches).
  - Au bout de chaque rameau court : une rosette de 2 à 4 jeunes feuilles en 3D (vertes, bronze-pourpre chez 'Rudolph' et 'Royalty') et un corymbe de 3 à 5 fleurs sur des pédicelles de 1,8 à 2,8 cm.
  - La fleur centrale (la fleur reine) s'ouvre la première.
  - Fleur de 3,8 cm : 5 pétales ronds onguiculés qui se recouvrent, blancs ou lavés de rose dedans, plus roses au revers.
  - Étamines jaunes, styles crème, calice vert.
  - Boutons ronds carmin à rose foncé.
- **Coloris (5) :** Blanc (Evereste), Blanc rosé (pommier domestique), Rose tendre (Malus floribunda), Rose vif (Rudolph), Pourpre (Royalty).
- **Tailles :** 50 à 100 cm.

**`magnolia-branches`** (*M. × soulangeana*, *M. stellata*, *M. liliiflora* 'Nigra', 'Yellow Bird')
- **Morphologie.**
  - Bois gris lisse et épais (lenticelles pâles), avec peu de nœuds et des rameaux courts.
  - Les fleurs sont solitaires et dressées au bout des pousses (l'axe, ses rameaux et les rameaux courts).
  - Elles sortent d'un gros bourgeon duveteux gris argenté (la pérule) qui se fend, laissant voir la pointe des tépales.
  - Bourgeons à feuilles petits et duveteux le long du bois.
  - × soulangeana : tulipe de 9 tépales sur 14 cm.
    - Les 3 tépales externes, plus petits, s'étalent.
    - Les 6 internes, en cuillère, forment un gobelet qui se referme au sommet.
    - Ils sont blancs dedans et lavés de rose pourpre au revers, depuis le pied, en dégradé.
  - stellata : étoile de 15 tépales en lanière sur 10 cm, blancs ou rosés au revers.
  - Au centre : colonne de carpelles verts et couronne d'étamines crème rosé.
- **Coloris (6) :** Blanc lavé de rose pourpre (× soulangeana), Blanc (Alba Superba), Pourpre (liliiflora Nigra), Jaune primevère (Yellow Bird), Blanc étoilé (stellata), Rose tendre étoilé (stellata Rosea).
- **Tailles :** 60 à 120 cm.

Les coloris des recettes `k0.js` sont tous repris. `GH_BUDS` est déclaré pour le cerisier du Japon, le pêcher et le magnolia, qui se vendent aussi en bouton.

## Vérifications
- **Planches.** Vérifiées pour les 9 vues × 3 stades, tous les coloris et 3 tailles, avec des zooms `fz` au détail 2.
  Corrigé en cours de route :
  - sépales en pattes d'araignée ;
  - revers du magnolia entièrement pourpre ;
  - gobelet évasé au lieu de refermé ;
  - fleurs doubles du pêcher plates de profil ;
  - stade bouton trop nu chez l'amandier et le pêcher ;
  - contour trop pâle des fleurs blanches.
- **Cartes du Composer.** 25 coloris, dans `sheets/cartes_composer.png`.
- **QA composée** (`inc=` les 5 espèces, graines 3, 5, 11 et 21, 20 bouquets chacune) : 80 bouquets, **0 F, 0 U, 0 kink**.
- **QA des modèles.** `models_of.py` ne renvoie aucun modèle (`ns=` vide) : aucun des 76 modèles n'utilise ces espèces. Ils ne changent donc pas.
- **Perf** (`perf=1`, 76 modèles, sur cette machine cloud) :

  | Build | Temps moyen | Éléments par bouquet |
  |---|---|---|
  | Avec le lot | 227 ms | 8 431 |
  | Sans le lot | 224 ms | 8 431 |

  L'écart est du bruit : la machine est plus lente que la référence de 142 ms.
- **Coût par branche en bouquet** (DET 1, mesure sptime, 12 tirages) :

  | Espèce | Éléments par branche | Temps |
  |---|---|---|
  | Sato-zakura | 461 | 31 ms |
  | Pêcher | 476 | 27 ms |
  | Pommier | 476 | 17 ms |
  | Amandier | 249 | 12 ms |
  | Magnolia | 261 | 10 ms |
  | Cerisier hâtif du lot 29 (repère) | 250 | 13 ms |

  Une fleur coûte environ 8 à 10 éléments.

## Doutes
- **Coût des branches très fleuries.** Sato-zakura, pêcher et pommier coûtent environ deux fois le cerisier hâtif, à cause de leurs fleurs doubles ou de leurs corymbes nombreux.
  Si c'est trop, on peut réduire `n` par nœud, ou retirer le 3ᵉ verticille au détail de l'appli.
- **'Peppermint Stick'.** Il est panaché pétale par pétale ; les fines stries rouges ne sont pas dessinées.
- **Fard du magnolia.** Il est fait de 3 aplats translucides empilés plutôt que d'un vrai dégradé. Les bandes restent visibles de près, au détail 2.
- **Section « tailles » de la planche.** Elle suit la longueur de la recette (80 cm ± 30 %), pas `SZG`.
