# Reprise 5 — les épis poussent (L-système)

Espèces : delphinium, pied-d'alouette annuel, muflier, giroflée (matthiole), glaïeul.

**Fichier livré : `ws/epis/r5a.js`** (34 Ko). Il remplace seulement les 5 entrées `GH` de `s8a.js` et se charge n'importe où après `s8a.js`. Les sources découpées (`src/*.part` et `src/mk.sh`) assemblent ce fichier.

Ce qui reste celui de `s8a.js`, sans changement :
- les fleurons, les boutons, les spathes ;
- les coloris (`CWS`), les tailles (`SZG`) et les infos du Composer (`GHI`) ;
- le contrat `{k,bw,bc}`, le mode `it.short`, la partie fleurie en haut de la ligne et `A.zk`.

**Aucun fichier moteur n'est modifié, il n'y a donc aucun diff moteur.**

## Le moteur commun (dans r5a.js)

**`spGrow`** fait pousser chaque plante par le L-système, avec `lsDerive` et `lsTurtle` de `l0.js` :
- `A(i) → F N(i) A(i+1)` ;
- `N(i) → [/φ &α Lv]×m [/φ &β F F La] +κ`.

La plante pousse droite dans le repère de son axe, puis elle est couchée le long de l'épine du Composer, ou du cadre de la vue sur la planche :
- la tige ondule un peu (`wig` et tropisme `e`) et tourne légèrement à chaque nœud ;
- la base garde la direction de l'épine et le sommet tombe exactement au bout de l'épine.

Les autres fonctions :
- **`axPoly`** : un axe en polyligne, avec la même interface que `spAxis`, utilisé pour la tige principale et les latérales ;
- **`spStemP`** : la tige est dessinée en ruban `stemPoly`, en pièces ordonnées pour `A.zk`. La partie nue de la tige est d'un seul tenant, ce qui évite les coutures visibles ;
- **`spLeafPart`** : chaque feuille est dessinée en 2D selon le repère 3D de son nœud. Elle est raccourcie dans l'axe de la vue, montre son limbe (tordu vers la lumière) et laisse retomber sa pointe du côté où elle penche ;
- **`spHalf`** : rend un fleuron mi-ouvert avec le même dessin que le fleuron ouvert, les ligules refermées et les anneaux resserrés ;
- **`spAges`** et **`spQ`** : l'âge descend le long de l'épi. Les entre-nœuds raccourcissent vers le haut, si bien que les boutons verts se serrent au sommet.

Règles propres aux bouquets :
- les feuilles commencent à 10 cm au moins au-dessus de la base, se tournent vers le haut et restent au moins 22 unités au-dessus de la bouche du vase ;
- les latérales partent au-delà de 30 % de la ligne et disparaissent en mode `short` ;
- chaque fleuron garde son pédicelle.

## Par espèce

### Delphinium (*D. elatum*, *D. × belladonna*)

**Botanique :**
- tige creuse, dressée ;
- feuilles alternes, longuement pétiolées en bas, palmatiséquées en 5 à 7 segments en coin, eux-mêmes découpés en lobes aigus ; elles sont plus petites et moins découpées en montant ;
- grappe dense, avec des fleurons en spirale : 5 sépales dont le supérieur porte l'éperon, et une « abeille » au centre ;
- floraison de bas en haut, boutons éperonnés ;
- le fruit est fait de 3 follicules.

**Ce qui est fait :**
- 4 feuilles basses (7 puis 5 segments), et des feuilles hautes réduites à 3 lobes ;
- elatum : 0 à 2 grappes latérales plus courtes et plus jeunes, aux aisselles juste sous l'épi ;
- belladonna : 2 ou 3 latérales plus lâches ;
- boutons verts serrés au sommet, puis boutons colorés, 2 fleurons qui s'ouvrent, puis fleurons ouverts ;
- en bas, parfois 1 ou 2 fleurons défleuris : il ne reste que les 3 follicules verts.

**Coloris :** 17, ceux de s8a, dont 3 belladonna et le Green Twist.

**Tailles :** 40, 45, 50, 55 et 60 cm (s8a).

### Pied-d'alouette annuel (*Consolida ajacis*)

**Botanique :**
- tige grêle, ramifiée dans sa moitié haute ;
- feuilles alternes, très découpées en lanières linéaires filiformes ;
- grappes lâches de fleurons doubles à long éperon ;
- le fruit est un seul follicule pubescent de 15 à 20 mm.

**Ce qui est fait :**
- 5 feuilles basses filiformes, fourchues trois fois ;
- 2 ou 3 rameaux latéraux, le plus bas le plus long, chacun à l'aisselle d'une feuille plus petite ;
- les grappes latérales sont plus jeunes ;
- le follicule reste parfois en bas de l'épi.

**Coloris :** 12, dont le Frosted Skies.

**Tailles :** 35, 40, 45 et 50 cm.

### Muflier (*Antirrhinum majus*)

**Botanique :**
- feuilles lancéolées, entières, glabres, de 1 à 7 cm ;
- feuilles opposées et décussées en bas, puis alternes ;
- épi dense de fleurs à deux lèvres, la gorge fermée par le palais ;
- floraison de bas en haut ; quand la corolle tombe, il reste le calice et la capsule.

**Ce qui est fait :**
- 8 nœuds : 3 paires croisées, puis 5 feuilles alternes de plus en plus petites ;
- dans 35 % des cas, une pousse latérale en boutons ;
- 1 bouton coloré prêt à s'ouvrir ;
- parfois, la plus basse corolle est tombée : on voit le calice, la capsule et le style.

**Coloris :** 17, dont le bicolore « pommier ».

**Tailles :** 25, 28, 30, 32 et 35 cm.

### Giroflée (*Matthiola incana*)

**Botanique :**
- tige robuste et feutrée ;
- feuilles oblongues-lancéolées à spatulées, gris-vert, tomenteuses (poils étoilés), sessiles, de 8 à 15 cm sur 1 à 2 cm, serrées en bas ;
- colonne de fleurs doubles ;
- les types « colonne » ne sont pas ramifiés, les types spray le sont.

**Ce qui est fait :**
- 9 feuilles feutrées : liseré et nervure pâles, pointe obtuse ;
- dans 18 % des cas, une courte latérale (type spray) ;
- 2 fleurons à demi ouverts ;
- parfois, le fleuron le plus bas est fané : plus pâle, papier beige ;
- en bouton, un cône serré de boutons tout de suite au-dessus des feuilles. Cela ne concerne que les stades bouton et mi-ouvert de la planche : dans les bouquets, l'ouverture est de 0,72 à 1 et rien ne change.

**Coloris :** 15.

**Tailles :** 18, 20, 22, 24 et 26 cm.

### Glaïeul (*Gladiolus × hortulanus*)

**Botanique :**
- tige simple et raide ;
- 1 à 3 feuilles ensiformes à gaine, nervurées ;
- épi unilatéral de fleurons en entonnoir, chacun pris dans 2 spathes vertes ;
- les boutons du haut sont verts et engainés en pointe.

**Ce qui est fait :**
- 2 à 3 feuilles en épée sur les planches, 2 dans les bouquets, distiques ;
- leur gaine épouse la tige, puis le limbe s'écarte de quelques degrés ;
- pas de latérale ;
- 1 fleuron à demi ouvert sous les boutons colorés.

**Coloris :** 19, dont Traderhorn, Priscilla et Black Star.

**Tailles :** 40, 45, 50, 55 et 60 cm.

## Contrôles

### QA des bouquets composés (`inc=` les 5 espèces)

Le résultat est de **0 F, 0 U et 0 kink** à chaque passage :
- sur le build du 04/10 vers 0 h 30 : 120 bouquets (graines 5, 1, 9, 2, 3 et 4, 20 chacune) ;
- puis sur le dernier build (1 346 Ko, avec les lots 14 à 27 fusionnés) : 60 bouquets (graines 5, 1 et 9).

Défauts trouvés en route, tous corrigés :
- un fleuron de pied-d'alouette mi-ouvert vu de chant se détachait de son pédicelle ;
- un fleuron de delphinium vu de face était dessiné sans pédicelle. Ce cas existait déjà dans s8a.

### QA des modèles

18 modèles (5, 9, 12, 19, 27, 29, 33, 42, 43, 45, 46, 54, 58, 72, 75, 76, 79, 81) :
- avec les graines 7 et 11 : 36 bouquets, **0 F, 0 U et 0 kink** ;
- sur le dernier build : de nouveau 18 bouquets, à 0.

### Debug L-système (`lsdbg`)

Aucune erreur. Organes poussés :

| Espèce | Feuilles | Latérales |
|---|---|---|
| Delphinium | 5 | 1 |
| Pied-d'alouette | 7 | 2 |
| Muflier | 11 | 0 |
| Giroflée | 9 | 0 |
| Glaïeul | 3 | 0 |

### Performance (`sptime`, éléments par épi au détail de l'appli, DET 1)

| Espèce | Avant | Après |
|---|---|---|
| Delphinium | 287 | 310 |
| Pied-d'alouette | 159 | 150 |
| Muflier | 228 | 229 |
| Giroflée | 181 | 188 |
| Glaïeul | 130 | 123 |

Les temps restent du même ordre, de 5 à 20 ms par épi. Ils varient avec la charge du PC, partagé avec les autres agents.

Sur les 18 modèles, mesurés avant puis après dans les mêmes conditions :
- 12 374 éléments avant, 12 425 après, soit +0,4 % ;
- 407 dégradés avant, 410 après.

## Planches (`ws/epis/sheets/`)

- `<sid>_vues.png` : 9 vues × 3 stades, pour chacune des 5 espèces ;
- `<sid>_coloris.png` : tous les coloris ;
- `cartes_composer.png` : 30 cartes ;
- `bouquets.png` : 8 bouquets composés ;
- `bouquets_modeles.png` : 8 modèles du catalogue.

## Points douteux

- **`spHalf` réassigne temporairement `ligule` et `spRing`.** C'est fait dans un try/finally, ce qui est sûr, mais c'est un procédé à connaître.
- **Les fleurons passés.** On voit parfois les follicules du delphinium ou du pied-d'alouette, la capsule du muflier ou une fleur fanée de giroflée. Botaniquement c'est juste, mais l'œil d'une cliente peut les prendre pour un défaut. Pour les retirer, il suffit de mettre `nS` à 0.
- **Les coutures de la hampe.** Entre deux pièces de la hampe florale, il reste un liseré de 1 px seulement au zoom maximal de la planche. Il est caché par les fleurons.
- **Les feuilles sont dessinées en 2D, orientées en 3D**, comme `lsLeaf2D`, et non comme des surfaces `sheet3`.
- **Les vues « dressée »** montrent l'épi couché en diagonale, comme dans s8a.

**Intégration :** copier `ws/epis/r5a.js` dans `app/` et l'ajouter aux listes de `mkpl.sh` et `mkqa.sh` n'importe où après `s8a.js`, par exemple après `r4a.js`.

## Sources botaniques

- Wikipedia : *Antirrhinum majus* et *Gladiolus* ;
- NC State Extension : *Matthiola incana* ;
- nzflora : *Consolida ajacis* ;
- Go Botany : *Consolida ajacis* ;
- RHS : *Delphinium elatum*.
