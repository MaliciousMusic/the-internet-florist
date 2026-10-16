# Lot 77 — dracænas et lin (agent « dracaenas »)

Fichier : `serre/ws/dracaenas/s77a.js`. Préfixe `l77` / `L77`. Aucune copie moteur, aucun diff moteur.
Aucune des 5 espèces n'avait d'ancienne version (seulement les recettes de `k0.js`) : elles sont branchées sous leur sid.
Aucun des 76 modèles du catalogue ne les utilise (`models_of.py` → `ns=` vide).

Moteurs réutilisés :
- `fgAxis`/`fgGrow` (lot 24) pour les cannes ;
- `l44Main`/`l44Out`/`l44Ring` (lot 44) pour les cannes de surculosa et l'axe du phormium ;
- `g35Surf`/`g35Prof`/`g35Lim` (lot 35) ;
- `t34S`/`t34Blade`/`t34P`/`t34In` (lot 34) ;
- `sheet3` (s0).

Ajouts du lot :
- `l77Leaf` : g35Leaf avec des bandes de panachure emboîtées (`vrs`) et des taches peintes (`spots`) ;
- `l77Scars` : cicatrices foliaires de la canne nue, regroupées en quelques parts ;
- `l77Div` : écarte les feuilles basses d'une couronne ;
- `l77Band` : bandes et rayures peintes sur une nappe ;
- `l77Fit` : la nappe t34 reste au-dessus du col dans un bouquet ;
- `l77PhS` : la feuille d'épée le long de la chaîne poussée par la tortue, pliée en V.

Contrat `{k, bw, bw1, bc, neck, nd}` respecté sur l'épine du Composer, sur la planche et sur la carte.

## Espèces

Les tailles du registre `SZG` sont des longueurs de feuille, comme pour la cordyline et le bambou de la chance. La canne grandit avec elles.

**`dracaena-reflexa-song-of-india`** (D. reflexa « Song of India »)
- Morphologie : tige ligneuse fine qui se courbe (arc de 12 à 24 %). Feuilles lancéolées, sessiles et embrassantes, de 10 à 20 cm sur 1,5 à 2,5 cm, en spirale serrée, réfléchies et arquées vers le bas. Les plus jeunes sont dressées et pliées au sommet. Le bas de la canne est nu, avec ses cicatrices.
- Coloris : bordé jaune d'or (Song of India), vert foncé à centre vert tendre (Song of Jamaica), vert uni (Anita). La panachure apparaît aussi au revers, plus pâle, à DET 2.
- Tailles : feuilles de 12, 15 et 18 cm (tiges de 40 à 55 cm environ).

**`dracaena-marginata`**
- Morphologie : canne nue, gris-brun, courbe, marquée de cicatrices en croissant de plus en plus serrées vers le haut. Au sommet, une touffe en étoile de feuilles linéaires (moins de 1 cm de large) qui se tordent et retombent, les plus jeunes dressées au cœur.
- Coloris : vert liseré rouge (Marginata), bordeaux (Magenta), rose vif (Colorama), tricolore crème, vert et rouge (Tricolor).
- Tailles : feuilles de 30, 40 et 45 cm.

**`dracaena-fragrans`**
- Morphologie : canne trapue avec ses cicatrices. Rosette de larges feuilles en ruban (nappes 3D t34) qui montent puis s'arquent, à marge légèrement ondulée. Les jeunes feuilles sont enroulées et dressées au cœur.
- Coloris : vert foncé uni (Janet Craig), bande centrale jaune ondulée (Massangeana), citron vert liseré de vert foncé et de filets blancs (Lemon Lime), vert gris rayé de blanc (Warneckii).
- Tailles : feuilles de 45, 60 et 75 cm.

**`dracaena-surculosa`** (gold dust)
- Morphologie : cannes fines et ramifiées par la règle B(n) du L-système, avec un anneau à chaque nœud. Faux verticilles de 2 ou 3 feuilles elliptiques et acuminées, dont la base se rétrécit en court pétiole. Deux jeunes feuilles pliées terminent chaque pousse.
- Coloris : taché d'or (Gold Dust), constellé crème (Florida Beauty : feuille crème, îlots verts), strié or et taché (Juanita).
- Tailles : feuilles de 6, 8 et 10 cm.

**`phormium-lin-nz`** (lin de Nouvelle-Zélande)
- Morphologie : une feuille coupée en épée. Sa ligne médiane est la chaîne poussée par la tortue le long de l'épine ou de l'arc. Elle est pliée en V serré à la base et s'ouvre presque à plat vers le tiers de sa longueur. Elle se tord lentement, s'arque à la pointe et porte un liseré de marge et de carène orange-rouge chez tenax.
- Coloris : vert (tenax), bronze pourpré (Purpureum), rayé rose et bronze (Maori Queen), jaune or rayé vert (Yellow Wave), panaché crème et vert (Variegatum), presque noir (Platt's Black).
- Tailles : 70, 100 et 130 cm.
- Composer : forme `ligne` (comme les graminées du lot 18).
- Stades : la feuille jeune est plus étroite et plus pliée.

## QA
- Planches : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées. Sont corrigés :
  - l'orientation de la nappe du phormium (le revers était vu comme la face, et les rayures n'apparaissaient pas) ;
  - la touffe de marginata, qui partait d'un seul côté (ajout de `l77Div`) ;
  - le revers de Song of India, qui virait au brun ;
  - les couleurs de Juanita et de Florida Beauty.
- Composer : `inc=` des 5 espèces, 3 graines × 20 (graines 5, 6 et 7) : **0 F, 0 U, 0 kink**. J'ai regardé 3 captures de bouquets (graines 3, 9 et 11).
- Modèles concernés : aucun.
- Perf du catalogue (`perf=1`) : 265 ms et 8 295 éléments par bouquet, identique à un build sans le lot (machine cloud plus lente que la référence de 142 ms).
- Poids d'une tige à DET 1 dans un bouquet (moyenne sur 12 tirages, éléments SVG dont les dégradés) :

  | Espèce | Éléments |
  | --- | --- |
  | Song of India | ~210 |
  | marginata | ~235 |
  | fragrans | ~360 (pas de gloss, de nervures ni de lumière transverse à DET 1) |
  | surculosa | ~225 |
  | phormium | ~37 |

  Pour comparer : cordyline 435, grevillea 118.

## Doutes
- Une tige de ces espèces porte 20 à 30 feuilles. Elle dépasse donc le repère de 100 à 150 éléments d'une tête, tout en restant sous la cordyline déjà au catalogue.
- Song of Jamaica : vert foncé à centre plus clair, d'après les descriptions de producteurs. Les variantes commerciales sont nombreuses.
- Le phormium est livré en feuille seule (recette `arr: single`). Un éventail de 2 à 3 feuilles chevauchantes serait possible si on le souhaite.
- `sheets/` suit les commandes du brief (`ncol=8`) : avec 3 à 6 coloris, les vignettes des planches de coloris sont petites.
