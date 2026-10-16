# Lot 86 — succulentes et broméliacées (agent epiphytes)

Fichier : `s86a.js`, préfixe `l86`. Aucun module moteur modifié, donc pas de diff moteur. Les moteurs réutilisés sont `lsTurtle`, `lsDerive`, `lsPlant`, `lsNeck` et `lsHeadS` (l0), `x33Fr`, `x33Blade`, `X33_VBR` et `X33_GBR` (s33a), `g35Run` (s35a), `sheet3` et `tube3` (s0), ainsi que le contexte `DRAPEX` (c5), qu'ils lisent comme `jasmStrand` (s25a).
Aucune des 5 espèces n'avait d'ancienne version GH : elles n'existaient que comme recettes génériques dans `k0.js`.

## Espèces
**Collier de perles** (*Curio rowleyanus*), en drapé.
- Botanique : fils de 1 mm qui retombent ; perles de 6 à 7 mm, alternes sur un court pétiole ; chaque perle porte une petite pointe et une fenêtre translucide (une bande claire du pied à la pointe).
- Dessin : chaque fil est poussé par la tortue (pas guidés sur la courbe lèvre → chute) et porte de rares rameaux qui s'écartent en courbe puis tombent sous leur poids.
- Coloris : vert perle, vert bleuté, panaché crème et rose (Variegata, tiges pourprées).
- Tailles : longueur de 30 à 80 cm.

**Rhipsalis** (*R. baccifera*, *R. cassutha*, *R. cereuscula*), en drapé.
- Botanique : tiges cylindriques de 3 à 6 mm, articles ramifiés en 2 à 4 à leur extrémité, touffes terminales ; petites baies blanches translucides et sessiles.
- Dessin : un L-système de ramification, `B(n) → F J [B(n−1)]…`. Chaque rameau diverge par petits virages successifs, sans coude net. Les articles sont dessinés comme des cylindres sur 3 largeurs et 2 profondeurs.
- Coloris : Baccifera vert vif, Baccifera en baies blanches, Cassutha vert tendre, Cereuscula (cactus corail).
- Tailles : 40 à 100 cm.

**Plantes de l'air** (*Tillandsia xerographica*, *T. ionantha*, *T. aeranthos*), en tête (rosette sur pique, sans racines).
- Feuille épaisse 3D (`l86Leaf`) : gouttière, carène, recourbure et spirale ; la face supérieure ou le dos s'affichent selon la portion de feuille visible.
- Xerographica : feuilles larges à la base, à longues pointes qui s'enroulent.
- Ionantha : touffe dense de feuilles épaisses ; le cœur rougit à la floraison ; fleurs violettes en tube à étamines jaunes.
- Aeranthos : spirale de feuilles raides, épi de bractées roses et pétales bleu-violet.
- Coloris (7) : Xerographica argentée et rosée ; Ionantha vert argenté, rougissante, Fuego ; Aeranthos gris-vert et en fleur.
- Tailles : diamètres vendus de 6 à 25 cm. Chaque espèce reste dans sa gamme réelle : ionantha de 4 à 9 cm, aeranthos de 7 à 15 cm, xerographica de 12 à 30 cm.

***Tillandsia cyanea* en fleur** (syn. *Wallisia cyanea*), en tête, vendue en bouton (`GH_BUDS`).
- Rosette de feuilles étroites en gouttière, à pied brun ; courte hampe.
- Épi plat elliptique d'environ 20 bractées distiques carénées (14 au détail de l'appli).
- 1 à 3 fleurs à trois pétales violet-bleu autour d'un œil blanc, sorties du bord de l'épi.
- Coloris : rose classique, rose vif (Anita), rouge, rose pâle.
- Tailles : épi de 10 à 18 cm.

**Ananas ornemental** (*A. comosus* var. *bracteatus*, var. *nanus*, Champaca), en tête.
- Hampe portant des bractées étroites dentées.
- Fruit de révolution couvert d'yeux hexagonaux en spirale (137,5°), chacun avec sa bractéole et sa fleur sèche.
- Collerette de bractées dentées recourbées sous le fruit ; couronne spiralée de feuilles raides dentées, panachées pour Tricolor.
- Coloris : rose (bracteatus), rose à feuilles panachées (Tricolor), rouge (Champaca), vert (nanus), doré (nanus mûr).
- Tailles : fruit de 5 à 12 cm.

Composer :
- Drapés : `{form:'retombante', k:'drape'}`. Le fil part de la lèvre, passe en crête au-dessus d'elle, puis tombe devant le vase jusqu'à la table ; il ne passe jamais sous la lèvre.
- Têtes : elles rendent le col `lsNeck`. Les feuilles et les bractées de hampe vont dans la couche des tiges (`EXT`).
- Les drapés renvoient `{k}`.

## QA
- Planches : 9 vues × 3 stades, coloris et tailles regardés et zoomés. Elles ont été corrigées : perles moins pointues, xerographica plus enroulée, ionantha épaissie, épi de cyanea élargi et aplati, ramifications du rhipsalis courbées.
- Bouquets composés avec `inc=` les 5 espèces, graines 5, 11 et 17, 20 bouquets chacune : **0 F, 0 U, 0 kink** (60/60). Captures regardées : `sheets/bouquets.png` et deux autres jeux.
- Modèles : `models_of.py` renvoie `ns=` vide. Aucun des 76 modèles n'utilise ces espèces, il n'y a donc rien à tester.
- Perf, au détail de l'appli (DET 1), moyenne et maximum par dessin :

  | Espèce | Éléments (moyenne) | Éléments (max) | Temps |
  |---|---|---|---|
  | Collier de perles | 41 | 72 | 2,7 ms |
  | Rhipsalis | 20 | 23 | 2,6 ms |
  | Plantes de l'air | 50 | 67 | 2,5 ms |
  | Cyanea (hors feuilles en couche tiges) | 73 | 73 | 2,2 ms |
  | Ananas | 61 | 83 | 3,4 ms |

  `perf=1` sur les 76 modèles : 224 ms et 8 295 éléments. Ces espèces n'entrent dans aucun modèle : l'écart avec les 142 ms de référence vient de la machine cloud, pas du lot.

## Doutes
- Les tailles des plantes de l'air sont un seul registre `SZG` pour trois espèces, ramené à la gamme de chaque espèce. Le rayon que le Composer suppose peut donc dépasser la taille réelle d'une ionantha.
- Les feuilles de cyanea sont raccourcies (environ 1,1 × l'épi, au lieu de 25 à 35 cm) pour ne pas envahir le bouquet.
- Les coloris rose pâle de cyanea et doré d'ananas viennent des producteurs, sans fiche RHS.
