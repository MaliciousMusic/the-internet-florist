# Lot 50 : exotiques 4 (agent exotiques4)

Fichier : `s50a.js`, chargé avant c4.js. Tous les noms globaux sont préfixés `l50` / `L50_`. **Aucun module moteur n'est modifié** (pas de diff moteur).
Moteurs réutilisés : `gsRev`, `gsProf`, `gsCapF`, `gsCols` (lot 28), `chpHeadS`, `chpEll`, `chpTube`, `chpDot` (lot 17), le dôme du pentas (lot 31, `l31Fr`, `l31Pal`), le brin retombant du jasmin (lot 25), la tige-ligne de la sandersonia (lot 19), plus `lsHeadS`, `lsLeafS`, `lsLeafParts`, `sheet3` et `spAxis`/`spStem`.

## Espèces

### nelumbo-capsule : capsule de lotus
- **Botanique.** Réceptacle fructifère obconique, à sommet plat de 5 à 12 cm, percé de 15 à 30 alvéoles disposées en anneaux autour d'une alvéole centrale. Chaque alvéole porte une graine : verte et bombée quand la capsule est fraîche ; sèche, la graine devient brune et libre, et certaines tombent, ce qui laisse des alvéoles vides. Les flancs sont spongieux, finement nervurés, et descendent jusqu'à un pédoncule raide.
- **Rendu.** Corps de révolution `gsRev` avec ses méridiens nervurés. Le plateau est éclairé selon son orientation. Les alvéoles ont un rebord en relief et contiennent une graine avec son reflet ; environ 20 % sont vides sur les capsules sèches. La tige est longue et raide, sans feuilles (`lsHeadS`, `nodes:0`). Le plateau est tourné vers l'œil (`gsCapF`, inclinaison de 0,5). Forme `disque`.
- **Coloris (11).** Brun naturel, brun clair, vert frais (#8f9a45, celui du modèle 26), vert tendre, blanchie, peinte argent, peinte or, teintées noir, rouge, rose et bleu.
- **Tailles.** 5, 6, 7, 8, 9 et 10 cm.

### nelumbo-nucifera : fleur de lotus
- **Botanique.** Fleur solitaire de 15 à 25 cm. Elle porte 15 à 25 pétales obovales concaves, en cuiller, finement veinés, plus pâles à la base et souvent plus soutenus aux pointes. Au centre, le réceptacle jaune en cône renversé porte des pistils enfoncés, entouré d'une frange d'étamines jaunes à appendice blanc. Le bouton est une ogive pointue. Le pédoncule est rigide et sans feuilles.
- **Rendu.** Chaque pétale est une feuille `sheet3` en forme fermée. L'angle du pétale varie linéairement le long de sa longueur, avec un creux en cuiller.
  - 3 couronnes : 7+7+6 pétales en DET 2, 6+6+5 en DET 1.
  - Chaque pétale a un dégradé du coloris de base vers celui de la pointe, et des nervures.
  - Les stades vont d'une ogive fermée à une coupe, puis à un bol ouvert.
  - Le cœur comprend un torus, un réceptacle `gsRev` avec ses pistils, et des étamines réparties en deux groupes, l'un devant et l'autre derrière.
  - Vu de dos ou de profil, le cœur est masqué. Vu de face, les étamines passent au-dessus de la base des pétales internes.
  - Deux sépales verts au stade bouton. Forme `cornet`, `GH_BUDS`.
- **Coloris (6).** Rose (Rosea), rose pâle, rose foncé (Red Lotus), blanc (Alba Grandiflora), blanc liseré rose (Chawan Basu), jaune (N. lutea).
- **Tailles.** 14, 16, 18, 20 et 22 cm.

### ixora
- **Botanique.** Corymbe terminal de 6 à 12 cm, bombé presque en boule, qui porte 40 à 60 fleurs. Chaque fleur a un tube très grêle de 2,5 à 4 cm et une petite croix de 4 lobes oblongs pointus. Les boutons, en massue, occupent le cœur et la floraison progresse du bord vers le centre. Le corymbe repose sur une paire de feuilles coriaces, brillantes et oblongues, sessiles sur une tige ligneuse. Des rameaux axillaires portent de jeunes corymbes.
- **Rendu.** Dôme repris du pentas, à 4 lobes. Les tubes sont visibles sur le pourtour, les gorges sont regroupées en un seul tracé, et un coussin teinté évite les vides. Feuilles 3D vernissées (`l50Leaf`). La tige est faite par `chpHeadS` : 2 nœuds opposés et des rameaux à 60° qui ne traversent pas la tête.
- **Coloris (9).** Rouge (Super King), rouge orangé (coccinea), orange, saumon, jaune d'or (#dca21c, celui du modèle 40), jaune (Maui Yellow), rose (Nora Grant), rose vif, blanc (I. finlaysoniana).
- **Tailles.** 6, 7, 8, 9, 10 et 12 cm.

### passiflora : passiflore
- **Botanique.** Liane à feuilles alternes palmées, à 5 lobes (3 chez racemosa et edulis), avec une vrille enroulée à chaque aisselle.
  - La fleur mesure 6 à 10 cm et compte 10 tépales : 5 sépales, au revers vert, et 5 pétales.
  - La couronne de filaments, en anneaux, est rayée : pourpre, blanc puis bleu chez caerulea.
  - L'androgynophore porte 5 anthères pendantes en étoile, l'ovaire, et 3 styles en croix terminés par des stigmates.
  - Le bouton est ovoïde, entouré de 3 bractées.
- **Rendu.** En bouquet, chaque brin retombe comme le jasmin (`DRAPEX`) : il monte du col, passe par-dessus la lèvre et tombe. Pour l'économie, les éléments sont regroupés en lots : feuilles par plan et par lumière, vrilles, tépales par deux, filaments par bande de couleur.
  - L'ordre de dessin s'inverse quand la fleur tourne le dos.
  - Le nombre de fleurs par brin est limité à 1 par 22 cm.
  - Forme `retombante`.
- **Coloris (6).** Bleue (caerulea), blanche (Constance Elliott), lilas (Amethyst), pourpre (Purple Haze), rose (Lady Margaret), rouge (racemosa, couronne courte).
- **Tailles.** Brins de 60, 80, 100 et 120 cm. La fleur fait environ 8 cm, à l'échelle réelle.

### nepenthes : népenthès
- **Botanique.** Tige grimpante à feuilles alternes, sessiles et lancéolées. La nervure médiane se prolonge en vrille, qui pend puis se recourbe sous l'urne. L'urne comprend :
  - un bulbe, une taille, puis une partie cylindrique ;
  - deux ailes frangées sur la face avant ;
  - un péristome côtelé et brillant ;
  - un opercule relevé sur une charnière arrière, avec un éperon.
  
  Les jeunes urnes sont petites et fermées. Les tiges coupées portent 3 à 6 urnes.
- **Rendu.**
  - La tige suit l'épine du Composer (`spAxis` et `spStem`).
  - Les feuilles `lsLeafParts` portent une vrille en Bézier 3D (≥ 1,2 u) qui part de leur pointe.
  - L'urne est construite avec `gsRev` et porte des mouchetures, des ailes, un péristome côtelé et un opercule attaché à la lèvre.
  - L'âge des urnes diminue vers le haut de la tige.
  - Forme `ligne`, `GH_BUDS`.
- **Coloris (6).** Vert taché de rouge (ventrata), vert (alata), vert citron, jaune vert marbré (Miranda), rouge (Bloody Mary), bordeaux.
- **Tailles.** Urnes de 6 à 14 cm. Le paramètre `cm` correspond à l'urne, comme `rec.cm` = 6.

## Vérifications
- **Planches.** 9 vues × 3 stades pour chaque espèce, regardées en grand et zoomées, ainsi que tous les coloris et les tailles. Défauts corrigés en cours de route :
  - lotus : étamines qui sortaient de la coupe, causées par le paramètre `D` qui masquait la constante des degrés ; cœur visible à travers les pétales de dos (résolu par un torus et par le masquage du cœur) ; motif en étoile trop régulier ;
  - népenthès : opercule flottant ;
  - passiflore : revers des sépales ;
  - ixora : rameaux qui traversaient la tête.
- **QA des bouquets composés** avec `inc=` les 5 espèces, graines 5, 11 et 23, 20 bouquets chacune, soit 60 bouquets : **0 F, 0 U, 0 kink**. Captures regardées (graines 3 et 7, zooms).
- **QA des modèles concernés** (modèle 26 pour la capsule, modèle 40 pour l'ixora ; graines 7 et 23) : **0 F, 0 U, 0 kink**.
- **Perf** sur les 76 modèles : 171 à 177 ms et 8 425 éléments par bouquet, contre 175 ms et 8 463 éléments sur le build sans le lot, mesurés sur la même machine.
- **Éléments par plante au DET 1** :

  | Espèce | Éléments |
  |---|---|
  | Capsule | 23 |
  | Lotus | 60 à 138 |
  | Ixora (plante entière, rameaux et feuilles compris) | 81 à 134 |
  | Passiflore (un brin de 80 cm) | 16 à 61 |
  | Népenthès (tige entière de 5 à 6 urnes) | 118 à 147 |

## Doutes
- Dans les cartes du Composer, la tige brune de la capsule sèche prend la couleur verte de `bunchArt` (u1.js) sous la tête. C'est le même cas que le pavot sec du lot 28 ; dans les bouquets, la tige garde sa couleur.
- `rec.cm` vaut 6 cm pour le népenthès et 22 cm pour le lotus (k0.js n'a pas été modifié). Les planches de tailles suivent donc ces valeurs.
- Pour la passiflore, les 3 brins d'une retombée restent courts quand ils reposent sur un plateau (même logique que le jasmin). Les fleurs y sont alors groupées.
