# Lot 96 — Arbustes à fleurs (agent arbustes)

Fichier : `s96a.js`. Préfixe des globaux : `l96` / `L96_`. Aucun module moteur modifié, donc pas de diff moteur.
Aucune des 5 espèces n'avait d'ancienne version (`GH`) : elles n'avaient qu'une recette générique dans `k0.js`. Elles sont maintenant dessinées par `GH[sid]`.
Le lot réutilise :
- le moteur des branches du lot 29 (`s29a.js`) : `b29Grow` (L-système des rameaux), `b29Wood`, `b29Marks`, `b29Nodes`, `b29Petal`, `b29Corolla`, `b29Stamens`, `b29Disc`, `b29Rev`, `b29Ped`, `b29Spread` ;
- les apports du lot 55 (`s55a.js`) : `l55Corolla` (fleurs doubles), `l55Calyx`, `l55Leaf3` (jeunes feuilles en 3D), `l55Dorm`, `l55Lats`, `l55W` ;
- les outils des épis (`s8a.js`) : `spBud`, `tubeFlat`, `spFrame`.

## Ce que le lot ajoute (dans `s96a.js`)
- `l96Band` : un ruban plat le long d'une ligne médiane en 3D, dont la largeur suit la vrille. Ce sont les pétales de l'hamamélis.
- `l96VibCluster` : une cyme en demi-sphère de fleurs tubulaires (tube, puis 5 lobes). En bouton, les boutons en massue sont serrés vers l'axe de la cyme.
- `l96Umbel` : une ombelle de spirée.
  - Au détail des planches, chaque fleur a ses 5 pétales, son disque et ses étamines.
  - Au détail de l'appli, une ombelle tient en 4 chemins : pédicelles, boutons, coupes festonnées, cœurs.
- `l96Leafy` + `l96Raceme` : un bois de l'an passé, avec des paires opposées de jeunes rameaux feuillés (feuilles opposées-décussées), chacun terminé par une grappe dressée. La grappe a un axe ombré, des pédicelles par paires croisées, des boutons et des fleurs.
- `l96Pairs` (rameaux par paires) et `l96Len` : la longueur d'un rameau sur la planche. Les recettes « spray » de `k0.js` donnent une taille de tête de 20 à 25 cm, lue comme la longueur par défaut mise à l'échelle.
- **Rattachement.** Toute liaison fait au moins 1,15 unité (pédicelles, pédoncules, pétioles). Un ruban d'hamamélis fait au moins 1,2 unité de large.
  - Chaque organe part de son nœud : rameau ou pédoncule, puis pédicelle, puis calice.
- **En bouquet** (`o.spine`), comme aux lots 29 et 55 : pas d'organe sous 30 unités, ni de fleur sous 28.

## Espèces

**`hamamelis`** (*Hamamelis × intermedia*, *H. mollis*)
- **Morphologie.**
  - Rameaux nus gris-brun, duveteux, en zigzag doux (pas de coude net), distiques ; quelques rameaux latéraux.
  - À presque chaque nœud, un glomérule de 2 à 4 fleurs presque sessiles.
  - Chaque fleur : un calice à 4 lobes, bordeaux à brun-rouge dedans et brun feutré dehors, et 4 pétales en rubans de 1,5 à 2 cm, ondulés et vrillés (la largeur visible change avec la vrille).
  - En bouton, la fleur est un bourgeon rond feutré gris-brun. Mi-ouverte, elle a des rubans courts et frisés, dressés.
  - Bourgeons foliaires nus, pédonculés, à la pointe des rameaux.
- **Coloris (7) :** Jaune vif (Arnold Promise), Jaune soufre (Pallida), Jaune d'or (H. mollis), Orange cuivré (Jelena, rouge au pied des rubans), Orange (Aphrodite), Rouge cuivré (Diane), Rouge orangé (Feuerzauber).
- **Tailles :** 40 à 80 cm.

**`viorne-d-hiver`** (*Viburnum × bodnantense*, *V. farreri*)
- **Morphologie.**
  - Rameaux dressés gris-brun à lenticelles pâles, bourgeons opposés (bourgeons foliaires étroits et pointus, brun-rouge).
  - Cymes arrondies de 3 à 5 cm, au bout des rameaux et par paires aux nœuds du haut, sur un court pédoncule.
  - De 12 (appli) à 22 (planches) fleurs tubulaires : un tube d'environ 1 cm, rose foncé, et 5 lobes étalés plus pâles.
  - Boutons en massue rose foncé, serrés en tête au stade bouton.
- **Coloris (4) :** Rose (Dawn), Rose vif (Charles Lamont), Blanc rosé (Deben), Blanc (V. farreri Candidissimum).
- **Tailles :** 40 à 80 cm.

**`spiree`** (*Spiraea × vanhouttei*, *S. thunbergii*, *S. × cinerea* 'Grefsheim')
- **Morphologie.**
  - Longs rameaux minces brun-rouge, arqués (comme le forsythia du lot 29), alternes.
  - Ombelles de petites fleurs blanches de 8 à 9 mm sur le dessus de l'arc.
  - *× vanhouttei* : 14 à 20 fleurs sur des pédicelles de 1 à 1,5 cm, au bout d'un court rameau, avec 2 petites feuilles rhombiques.
  - *thunbergii* et 'Grefsheim' : 7 à 11 fleurs presque sessiles, avec des feuilles étroites vert clair.
  - Fleurs : 5 pétales ronds et un disque jaune-vert. Boutons ronds, blanc verdâtre (roses chez 'Fujino Pink').
- **Coloris (4) :** Blanc (S. × vanhouttei), Blanc pur (Grefsheim), Blanc neige (S. thunbergii), Blanc rosé (Fujino Pink).
- **Tailles :** 50 à 100 cm.

**`deutzia`** (*D. gracilis*, *D. × hybrida*, *D. scabra*, *D. × rosea*, *D. × elegantissima*)
- **Morphologie.**
  - Bois brun de l'an passé, strié en long, avec des bourgeons dormants opposés.
  - De 4 à 5 paires de jeunes rameaux feuillés (feuilles lancéolées, opposées, retombantes en 3D). La pointe de la branche est elle aussi un jeune rameau.
  - Chaque rameau finit par une grappe dressée de 7 à 9 cm : 9 à 12 fleurs (14 à 19 sur les planches) de 1,9 cm.
  - Fleur en étoile (5 pétales oblongs étalés) ou en clochette ouverte (× rosea, 'Rosealind'), ou double à pétales crispés ('Pride of Rochester').
  - Revers rose à carmin chez les formes roses.
  - 10 étamines aux filets blancs ailés et anthères jaunes ; calice étoilé gris-vert ; boutons ovoïdes blancs ou roses.
- **Coloris (6) :** Blanc étoilé (D. gracilis Nikko), Rose étoilé (Mont Rose), Rose vif (Strawberry Fields), Blanc double (Pride of Rochester), Rose pâle en clochette (D. × rosea), Rose carmin en clochette (Rosealind).
- **Tailles :** 40 à 70 cm.

**`seringat`** (*Philadelphus coronarius* et hybrides)
- **Morphologie.**
  - Même port que le deutzia : de jeunes rameaux feuillés opposés (feuilles ovales, larges), chacun avec une courte grappe de 5 à 9 fleurs. La fleur terminale s'ouvre la première.
  - Fleur simple : 4 pétales larges et arrondis en coupe ouverte, blancs ou crème, avec une tache pourpre au pied chez 'Belle Étoile' et 'Sybille'.
  - Fleur double : 3 rangs ('Virginal', 'Minnesota Snowflake', 'Manteau d'Hermine', plus petit).
  - Cœur dense d'étamines dorées, 4 sépales verts ; boutons ovoïdes pointus blanc-vert.
  - Taille de la fleur selon le cultivar : de 2,6 à 4,2 cm.
- **Coloris (6) :** Blanc crème (P. coronarius), Blanc à cœur pourpre (Belle Étoile), Blanc à cœur rose pourpre (Sybille), Blanc pur double (Virginal), Blanc double (Minnesota Snowflake), Blanc ivoire double (Manteau d'Hermine).
- **Tailles :** 40 à 80 cm.

**Stades.**
- Tous : bouton, mi-ouvert, ouvert. L'ouverture progresse du pied de la branche vers sa pointe ; dans une grappe, des fleurs du bas vers celles du haut.
- `GH_BUDS` : les 5 espèces.

**Composer.** `GHI` en `ligne` (`k:'plant'`), comme les branches des lots 29 et 55. La spirée est arquée (`tip:false`).

## Vérification
- **Planches.** 9 vues × 3 stades regardées, avec des zooms (`fz`) sur chaque espèce, tous les coloris et les tailles 40, 60 et 80 cm (`cm=`).
  - Corrections faites :
    - rubans de l'hamamélis aplatis et vrillés, au lieu de traits ronds ;
    - grappes du deutzia plus fournies, avec moins de feuilles ;
    - ombelles de spirée plus blanches et plus larges, avec un œil plus petit ;
    - cymes de la viorne plus lâches, tubes visibles ;
    - jeune pointe verte des branches feuillées.
- **QA des bouquets composés** (`inc=` les 5 espèces, graines 5, 11 et 23, 20 bouquets chacune) : **60 bouquets, 0 F, 0 U, 0 kink**. Captures regardées : graine 3 (8 bouquets) et graine 7 (`sheets/bouquets.png`).
- **QA des modèles :** `models_of.py` ne renvoie aucun modèle pour ces 5 espèces, donc il n'y a rien à tester.
- **Perf.**
  - `perf=1` : 177 ms et 8 295 éléments en moyenne. Sur la même machine, la base sans le lot donne 170 ms et 8 295 éléments (machine cloud plus lente que la référence de 142 ms). Aucun modèle n'utilisant ces espèces, la perf du catalogue ne change pas.
  - Coût d'une branche le long d'une épine (sptime, DET 1, moyenne sur 12 dessins) :

    | Espèce | Temps | Éléments |
    |---|---|---|
    | hamamélis | 16 ms | 536 |
    | viorne | 22 ms | 483 |
    | spirée | 14 ms | 436 |
    | deutzia | 13 ms | 554 |
    | seringat | 15 ms | 450 |

    Références sur la même machine : pommier du lot 55, 12 ms et 519 éléments ; amandier, 9 ms et 274 éléments.

## Doutes
- Une branche coûte de 430 à 550 éléments. C'est une branche entière de plusieurs dizaines de fleurs, pas une tête ; c'est du même ordre que le pommier du lot 55.
- Les recettes « spray » de `k0.js` (viorne, deutzia, seringat) restent en `a:'spray'` avec `cm` 20 à 25. Je ne pouvais pas modifier `k0.js` ; `l96Len` lit cette valeur comme une taille de tête. Il faudrait peut-être passer ces recettes en `line` avec `cm` 60 lors de l'intégration.
- La tache de 'Belle Étoile' est un fard posé au pied des pétales. À fort zoom, elle se lit comme un carré pourpre au centre, ce qui est assez fidèle.
