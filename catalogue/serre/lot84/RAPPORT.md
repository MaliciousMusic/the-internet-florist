# Lot 84 — argentés et velours (agent « argentes »)

Fichier : `s84a.js` (préfixe `l84` / `L84_` / `CW_L84…`). Aucun module moteur n'est modifié, donc pas de diff moteur.
Les cinq sids existaient dans `k0.js` (recettes génériques), mais aucun lot ne les dessinait encore. Ce lot les dessine sous les mêmes sids.

## Moteurs réutilisés
- Tiges feuillées : `fgGrow` et `fgAxis` (lot 24). Le contrat `{k,bw,bw1,bc,neck,nd}` fonctionne sur l'épine du Composer, sur la planche et sur la carte.
- Feuilles en deux moitiés : `g35Leaf`, `g35Surf` et `g35Prof` (lot 35).
- Grande feuille : `t34Plant`, `t34S` et `sheet3`, avec la peinture découpée par bande `t34Clip`/`t34P` (lot 34).
- Épis de labiées : `l60Spike`, plus les tiges carrées `l60Square`, `l60Half` et `l60Veins` (lot 60).
- Le reflet argenté est rendu par des dégradés nets, sans grain :
  - `l84Leaf` ajoute à `g35Leaf` des bandes satinées nettes sur la moitié la mieux éclairée (une large et douce, une étroite et vive à DET 2), ou une seule bande feutrée ;
  - `l84Sheet`, un `sheet3` à surface libre, donne les dégradés de lumière en long et en travers, le brillant spéculaire et les bandes métalliques.

## Espèces
- **Arbre d'argent** (*Leucadendron argenteum*, Protéacées) :
  - Tige épaisse et veloutée. Feuilles lancéolées sessiles de 8 à 15 cm, en spirale serrée, dressées et imbriquées, soyeuses sur les deux faces : bande satinée et liseré net.
  - Les rameaux fertiles portent soit un cône femelle argenté (écailles feutrées en spirale, 6 cm), soit une tête mâle jaune crème (4,5 cm). Les feuilles involucrales sont plus petites.
  - Coloris : argent satiné, argent bleuté, argent vert tendre, avec cône femelle, avec tête mâle.
  - Tailles (feuille) : 9, 11 et 14 cm. Tige de 50 cm.
- **Oreille d'ours** (*Stachys byzantina*) :
  - Tige carrée et laineuse. Feuilles opposées, oblongues, crénelées, épaisses, avec un feutre en bande douce et un liseré.
  - Les tiges fleuries portent des feuilles plus petites vers le haut, puis un épi laineux de 12 verticilles interrompus : calices et bractées laineux, petites fleurs labiées mauves ou roses.
  - Coloris : gris argent, fleuri mauve, fleuri rose pâle, Big Ears, Silver Carpet, Primrose Heron.
  - Tailles : 6, 8 et 10 cm.
- **Astelia 'Silver Spear'** (*A. chathamica*) :
  - Épées carénées en V, arquées. La feuille principale suit l'épine ; une ou deux feuilles plus courtes partent de la même gaine, en touffe, et ploient sous leur poids. Au stade bouton, la feuille est encore pliée et seule.
  - Aspect métallique : fort contraste en travers, brillant spéculaire, bandes nettes le long de la carène, revers presque blanc, nervures parallèles.
  - Coloris : Silver Spear, Silver Shadow, Red Gem (*A. nivicola*), banksii.
  - Tailles : 60 à 90 cm.
- **Feuilles d'hosta** :
  - Long pétiole charnu. Limbe ovale-cordé dont la base est échancrée autour du pétiole (surface `t34S` remappée, voir `l84HosS`).
  - Nervures parallèles courbes et profondes (sillon sombre et crête claire). Mat glauque pour les bleues, brillant pour les vertes. Feuille enroulée au stade bouton.
  - Coloris : vert (Royal Standard), bleu (Halcyon), chartreuse (Sum and Substance), Francee, Patriot, Frances Williams, June, Undulata. Marges et cœurs sont irréguliers.
  - Tailles du limbe : 18, 25 et 32 cm. `bigLeaf` est réglé comme les feuilles du lot 34.
- **Thym** (*Thymus vulgaris*) :
  - Rameaux ligneux brun-rouge très ramifiés. Feuilles minuscules, opposées-décussées, avec leurs fascicules axillaires, regroupées par lots et larges d'au moins 1,15 unité.
  - Les tiges fleuries portent des glomérules terminaux : dôme de calices pourpres et petites corolles à lobes.
  - Coloris : vert gris, fleuri mauve pâle, fleuri rose, citron doré (Aureus), argenté (Silver Queen).
  - Tailles (feuille) : 0,6 à 1 cm. Botte de 22 cm.

## QA
- Composée, `inc=` les 5 espèces, graines 5, 7 et 11 × 20 : **0 F, 0 U, 0 kink**, refaite après les derniers changements.
- Captures regardées : `run=composed&n=8&seed=3` et `n=4&seed=9` (`sheets/bouquets.png`).
- Modèles : `models_of.py` renvoie une liste vide, car aucun des 76 modèles n'utilise ces espèces. En contrôle, `run=models&ns=1..10` : 0 F, 0 U, 0 kink.
- Perf :
  - `perf=1` : 169 ms et 8 295 éléments avec le lot, contre 170 ms et 8 295 éléments sans lui sur la même machine cloud. Le budget de 142 ms vaut pour la machine de référence.
  - Coût par tige à DET 1 (12 tiges sur une épine) :

    | Espèce | Éléments | Temps |
    | --- | --- | --- |
    | Arbre d'argent | 289 | 10,8 ms |
    | Oreille d'ours | 195 | 7 ms |
    | Astelia | 37 | 1,4 ms |
    | Hosta | 56 | 1,3 ms |
    | Thym | 622 | 32 ms |

    Pour comparaison, l'origan du lot 60 coûte 789 éléments.
- Cartes : vérifiées (`sheets/cartes_composer.png`). Chaque coloris a son propre hex, parce que `fgCw` choisit le coloris d'après la couleur.

## Doutes
- Thym : il reste le plus lourd du lot (≈ 620 éléments), mais il pèse moins que ses voisins aromatiques. À DET 1, les feuilles sont regroupées par rameau, ce qui donne un ordre de profondeur plus grossier.
- Hosta : à l'échelle réelle (limbe de 25 cm), la feuille domine les petits bouquets, comme l'aspidistra. En vue « dressée », le limbe est vu presque par la tranche.
- Arbre d'argent : un cône femelle argenté sur un feuillage argenté reste discret sur les cartes.
- Épi de stachys : le contour des corolles vient de `l60Spike` (lot 60, non modifié). Il est un peu marqué à fort zoom.
