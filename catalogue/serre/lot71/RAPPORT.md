# Lot 71 « lianes vertes » : rapport

Fichier : `s71a.js`. Préfixe des noms globaux : `l71` et `L71`. Aucun module moteur n'a été modifié : il n'y a ni copie ni diff moteur.

## Le moteur commun : `l71Vine`
- **Chemin de l'axe principal**, `l71Path`, en trois modes :
  - **drapé** (`DRAPEX` de c5.js, et cartes avec `o.len`) : le brin sort du col, passe la lèvre par une crête au-dessus d'elle, puis retombe jusqu'à la table. Il ne passe jamais sous la lèvre. La logique reprend `jasmStrand` (s25a).
  - **épine du Composer** : le brin suit `o.spine` à partir de `o.from`.
  - **planche** : guirlande dans le repère de la vue, qui monte, s'arque puis pend, à la longueur exacte demandée.
- **Forme de la tige.** Elle s'enroule un peu sur elle-même (hélice douce, comme une tige volubile) et zigzague souplement aux nœuds (cosinus, sans coude).
- **L-système** (`lsDerive` / `lsTurtle` de l0.js) :
  - l'axe principal est fait de cordes exactes (`aim`, k=1), comme dans `l39Sprig` ;
  - règles : `A → F… N A`, `N → Nd [Lv]… [X] [B]`, `B → F Nd [Lv] B`, `B(0) → F Ap` ;
  - phyllotaxie alterne distique, opposée décussée ou spiralée ;
  - les rameaux latéraux retombent (tropisme vers le sol).
  - Les organes sont : Lv (feuille), Nd (nœud, racines aériennes), X (cymes, ombelles, paires axillaires) et Ap (apex enroulé, tête florale, ombelles de baies).
- **Feuilles en 3D**, `l71Leaf` et `l71Sheet` :
  - le contour est donné par sa demi-feuille, puis posé sur une surface arquée, pliée sur la nervure, retombante et vrillée ;
  - chaque moitié est éclairée par sa propre normale (Newell), et le revers est plus pâle ;
  - le pétiole part du nœud ;
  - sur la face supérieure : panachure (contour intérieur), nervures et bande de reflet étroite, qui n'apparaît qu'en DET 2.
- **Contrat** : la fonction renvoie `{k, bw, bw1, bc, neck, nd}` dans les trois modes. Il est vérifié sur une épine de test pour les 5 espèces.
- **Pièces flottantes.** Tous les traits isolés (pédicelles, vrilles, racines, filets, apex) font au moins 1,1 unité. Chaque détail part de sa courbe porteuse.
- **Économie au détail de l'appli (DET 1)** :
  - les fleurs voisines partagent leurs tracés (tons arrondis, groupes de 6) ;
  - les tronçons de tige sont plus longs ;
  - les pétioles de moins de 0,6 cm sont fondus dans le limbe ;
  - les lèvres du chèvrefeuille sont en une seule pièce.
- **Rôle dans le Composer** : `GHI` vaut `{form:'retombante', k:'drape'}`. En bouquet, les lianes sont donc toujours des drapés, sur 3 brins.

## Espèces (sid, botanique, coloris, tailles)
### `asparagus-asparagoides-smilax` : smilax des fleuristes
- **Botanique.** Tige volubile très fine, verte, en léger zigzag. À chaque nœud, un cladode alterne et presque sessile : ovale, de 2 à 3 cm, à base arrondie ou subcordée, aigu, vert vif luisant, à fines nervures parallèles. Quelques rameaux courts. L'apex s'enroule.
- **Coloris** : vert brillant ; vert tendre (jeunes pousses) ; Myrtifolius (baby smilax, cladodes de 1,5 cm).
- **Tailles** : 100, 150, 200 et 250 cm (brins vendus de 1,5 à 2,5 m).

### `smilax-smallii-southern-smilax` : smilax du Sud (Jackson vine)
- **Botanique.** Longues tiges vertes et raides. Feuilles alternes de 5 à 9 cm, lancéolées-ovales, acuminées, coriaces, vert foncé brillant, avec 3 (à 5) nervures arquées de la base à la pointe. Pétiole court dont la gaine porte des vrilles enroulées. L'apex s'enroule.
- **Coloris** : vert foncé brillant ; vert franc ; vert olive (fin d'hiver).
- **Tailles** : 150, 180, 240 et 300 cm.

### `hedera-helix-lierre` : lierre
- **Forme juvénile.** Tige rampante brun-vert, avec des touffes de racines aériennes du côté ombragé des nœuds. Feuilles alternes distiques, à long pétiole, à 3–5 lobes (le terminal plus long) et base cordée. Le limbe, tenu à plat vers la lumière, est vert foncé luisant à nervures palmées claires.
- **Forme adulte (arborescente).** Ni racines ni lobes : les feuilles sont entières, ovales-rhombiques, en spirale. Au bout des rameaux, des ombelles de baies, vertes puis pourpres puis noires selon le stade, avec la cicatrice du calice.
- **Coloris** :
  - vert foncé à nervures claires ;
  - Glacier (panaché gris-crème : marge crème, centre gris-vert) ;
  - Goldchild (bordé doré) ;
  - Goldheart (cœur doré) ;
  - arborescent en baies noires ;
  - arborescent en baies vertes.
- **Tailles** : 60, 90, 120 et 150 cm.

### `trachelospermum-jasmin-etoile` : jasmin étoilé
- **Botanique.**
  - Tige volubile brun-rouge. Feuilles opposées décussées, elliptiques à ovales, de 4 à 7 cm, coriaces, vert sombre très luisant.
  - Cymes axillaires et terminales sur un long pédoncule (2,5 à 3,5 cm), qui se ramifient en trois.
  - Fleurs blanches : tube de 8 mm, cinq lobes obliquement tronqués, tordus en hélice (2,5 cm) ; œil crème et petit calice vert.
  - Boutons fuselés, aux lobes enroulés en spirale. Le stade fixe la part de boutons.
- **Coloris** :
  - fleuri blanc ;
  - en boutons ;
  - Star of Toscana (fleurs crème) ;
  - feuillage vert sombre ;
  - Variegatum (bordé crème) ;
  - rougi d'hiver.
- **Tailles** : 60, 80, 100 et 120 cm.

### `lonicera-chevrefeuille` : chèvrefeuille
- **Botanique.**
  - Tige volubile rougeâtre. Feuilles opposées, ovales à elliptiques, obtuses, glauques au revers.
  - Au bout des rameaux, des têtes en verticilles de 8 à 13 fleurs, sur une dernière paire de feuilles.
  - Fleurs tubulaires de 4 à 5 cm, légèrement arquées. Elles ont deux lèvres enroulées en arrière : la supérieure à 4 lobes, l'inférieure en lanière. Chaque lèvre a une face interne crème et une face externe de la couleur du tube.
  - 5 étamines et un style, longs, sortis de la gorge.
  - Les fleurs vieillissent vers le jaune.
  - Boutons en massue arquée.
  - 'Halliana' (L. japonica) porte en plus des paires de fleurs axillaires.
  - Les baies rouges sont groupées en tête : vertes, puis orange, puis écarlates selon le stade.
- **Coloris** :
  - Serotina (pourpre et crème) ;
  - Belgica (rose et crème) ;
  - Japonica Halliana (blanc puis jaune) ;
  - Graham Thomas (jaune) ;
  - en baies rouges ;
  - feuillage glauque.
- **Tailles** : 60, 80, 100 et 120 cm.

Aucune de ces espèces n'avait de version antérieure dans `demo/src`. Elles n'existaient que comme recettes génériques `a:'drape'` dans `k0.js`. Elles reçoivent leur dessin sous leur sid.

## Vérifications
- **Planches.** 9 vues × 3 stades, coloris et tailles, regardées en grand et zoomées (brins de 20 à 30 cm, page de debug à fort grossissement pour les fleurs).
- **Défauts corrigés en cours de route** :
  - face interne des lèvres du chèvrefeuille inversée, puis lèvre coupée en deux pans éclairés séparément ;
  - stigmate dessiné en anneau ;
  - boutons du jasmin étoilé deux fois trop longs ;
  - ombelles de lierre trop chargées ;
  - reflet qui doublait la feuille ;
  - feuille d'apex détachée quand le pétiole est fondu.
- **Cartes du Composer** : 22 coloris, `sheets/cartes_composer.png`.
- **QA composée** avec `inc=` aux 5 sids, graines 5, 6, 7 et 8 × 20 : **80 bouquets, 0 F, 0 U, 0 kink**.
- **QA des modèles** : aucun des 76 modèles n'utilise ces espèces (`models_of.py` renvoie `ns=` vide). Il n'y a donc rien à lancer.
- **Perf** (`perf=1`) :
  - 172 ms et 8 295 éléments sans le lot, contre 180 ms et 8 295 éléments avec. Les éléments sont identiques ; l'écart de temps est du bruit, puisque aucun modèle n'utilise ces espèces. Cette machine cloud est plus lente que la référence de 142 ms.
  - Un drapé de 3 brins (180, 144 et 112 unités) compte, à DET 1 :
    - smilax : 175 éléments ;
    - smilax du Sud : 126 ;
    - lierre : 179 à 314 ;
    - jasmin étoilé : 136 à 349 ;
    - chèvrefeuille : 190 à 422.
  - Cela fait au plus 141 éléments par brin, pour un rendu de 4 à 17 ms par drapé.

## Doutes
- Le drapé en 3 brins est imposé par c5.js. Pour le chèvrefeuille fleuri 'Halliana', le drapé reste le plus lourd (422 éléments), contre 60 à 70 pour le jasmin de s25a, qui est entièrement regroupé par lumière. Le regrouper davantage coûterait l'ordre de dessin entre les fleurs.
- Sur planche, la liane est dessinée à sa vraie longueur (100 à 180 cm). Les feuilles y sont donc petites. Les détails se lisent dans les tailles courtes ou avec `fz=`.
- Southern smilax : je n'ai pas fait de coloris en baies, car les guirlandes du commerce sont vendues en feuillage seul.
