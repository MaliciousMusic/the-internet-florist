# Lot 64 — Orchidées 5 (agent orchidees5)

Fichier : `s64a.js` (préfixe `l64`/`L64`). Aucune copie moteur : rien n'est modifié dans `demo/`.

## Le moteur du lot : `l64Plant`
Reprise d'`orchidPlant` (r3a.js) avec les mêmes règles de L-système, prolongées :
- base monopodiale feuillée : feuilles distiques (`Lv`), en V, échancrées au bout ;
- bractées engainantes sur le pédoncule (`Bt`), bractée florale à chaque nœud (`Nb`) ;
- fleurs distiques tournées vers la face de la grappe (comme orchidPlant) ou en spirale (137,5°) tournées vers l'extérieur (`out`) ;
- rachis pendant (tropisme négatif fort), boule de longs pédicelles (`paf` : angle selon le rang), fleur solitaire (`solo`) ;
- le coude du pédoncule vers la grappe est réparti sur 4 segments (pas d'angle vif) ;
- aucune tige plus fine que 1,15 unité (`L64_W`) : rien ne se détache au raster de la QA ;
- profondeur de chaque fleur décalée selon son axe (devant son pédicelle si elle regarde l'œil, derrière sinon).
Les petites fleurs des grappes denses (rhynchostylis, epidendrum) sont dessinées « légères » (`l64Grp`) : un contour par groupe de pièces (sépales, pétales, labelle), un ton selon l'orientation, les points par-dessus ; environ 4 éléments par fleur.

## Par espèce
### Ascocenda (× Ascocenda = Vanda × Ascocentrum)
- Grappe dressée de 8 à 11 fleurs rondes et plates, 3 boutons au sommet, sur une tige à 3 feuilles distiques (en V, arquées, bout échancré).
- Fleur : 5 pièces larges subégales qui se chevauchent (sépales latéraux plus foncés chez les réticulés), réticulation de Vanda (`orchDeco`), petit labelle charnu trilobé, éperon court derrière (héritage Ascocentrum), colonne blanche.
- Coloris (11) : orange, mandarine réticulé, rouge, rose vif, magenta réticulé, pourpre, bleu-violet réticulé, jaune, jaune tacheté de rouge, rose pâle réticulé, corail (gamme des exportateurs thaïlandais).
- Tailles : fleur 3,5 / 4 / 4,5 / 5 cm ; tige de 35 à 50 cm.

### Rhynchostylis (queue de renard : R. gigantea, R. retusa, R. coelestis)
- Grappe cylindrique dense et pendante de 38 à 46 fleurs en spirale, boutons verts à l'extrémité, pédoncule court arqué.
- Fleur 2 à 3 cm : sépale dorsal elliptique, latéraux ovales plus larges, pétales plus étroits, tous mouchetés ; labelle charnu entier, plus foncé, éperon aplati vers l'arrière ; colonne blanche.
- Coloris (5) : blanc moucheté de pourpre (gigantea), blanc pur (alba), rose pâle moucheté (retusa), rouge carmin (gigantea rubra), bleu lavande à pointes violettes (R. coelestis).
- Tailles : vendue à la longueur de grappe 20 / 25 / 30 cm (la fleur suit en racine, le nombre de fleurs presque linéairement).

### Epidendrum (E. ibaguense, E. radicans et hybrides)
- Boule de 20 à 26 petites fleurs étoilées et 7 boutons au sommet d'une tige de roseau longue et fine (3 gaines) ; les fleurs basses regardent dehors et vers le bas, les jeunes vers le haut.
- Fleur 2,5 à 3,5 cm : sépales et pétales étroits étalés ; labelle en croix (deux lobes latéraux en éventail, lobe médian échancré), bords frangés (un seul contour fermé : la frange part du labelle), cal jaune ; colonne soudée au labelle. Ovaires teintés de la couleur de la fleur.
- Coloris (8) : orange, rouge, rouge orangé, jaune, rose, fuchsia, lavande, blanc.
- Tailles : diamètre de la boule 6 / 8 / 10 cm ; tige 60 cm et plus.

### Coelogyne (C. cristata, C. flaccida, C. mooreana, C. pandurata, C. ochracea)
- Grappe arquée-pendante de 5 à 8 fleurs, bractée papyracée à chaque nœud, 2 boutons blancs dans leurs bractées.
- Fleur 5 à 8 cm : sépales et pétales oblongs ondulés, à demi étalés, cireux ; labelle trilobé, lobes latéraux dressés autour de la colonne, lobe médian récurvé, crêtes frangées (4 carènes à dents), tache du disque ; colonne blanche ailée.
- Coloris (6) : blanc à crêtes jaunes (cristata), blanc à crêtes citron (cristata 'Lemoniana'), blanc à gorge orangée (mooreana), crème à labelle brun (flaccida, nervures brunes), vert jade à labelle noir (pandurata), blanc à yeux ocre (ochracea).
- Tailles : 5 / 6,5 / 8 cm.

### Lycaste (L. skinneri = virginalis, L. aromatica, hybrides Shoalhaven)
- Une grande fleur triangulaire sur un pédoncule dressé à 3 gaines ; bouton : cône trigone à trois sépales carénés.
- Fleur 10 à 15 cm : trois sépales larges, épais et cireux (reflet, liseré clair) en triangle ; deux pétales bien plus petits, tenus en avant autour de la colonne, pointes évasées, souvent plus foncés ; petit labelle trilobé à cal en languette, piqueté chez les rosés.
- Coloris (7) : blanc (virginalis alba), rose (skinneri, pétales plus foncés), rose vif, rouge, jaune (aromatica), vert pomme, olive à pétales blancs (macrophylla).
- Tailles : 10 / 12 / 14 cm.

## QA
- Planches : 9 vues × 3 stades regardées par espèce, zooms `det=2` sur chaque fleur ; coloris et tailles vérifiés.
- Bouquets composés, `inc=` des 5 espèces, 3 graines × 20 : graine 11 → 0 F, 0 U, 0 kink ; graine 17 → 0 / 0 / 0 ; graine 5 → 0 U, 0 kink, 1 F sur `asparagus-macowanii-ming-fern` (fourrage d'un autre lot ajouté par le Composer, aucune pièce de ce lot). Captures `b.png` (8 bouquets) et `sheets/bouquets.png` regardées : 0 défaut cerclé.
- Modèles : aucun des 76 modèles n'utilise ces 5 espèces (`models_of.py` → vide) ; aucun moteur partagé n'est modifié, donc vanda, mokara et les autres orchidées sont inchangées.
- Perf (`perf=1`, 76 modèles) : 179 ms et 8 306 éléments par bouquet en moyenne (référence ≈ 142 ms / 10 150 él.). Le lot n'entre dans aucun modèle : l'écart de temps vient de la machine cloud. Têtes au DET 1 : ascocenda ≈ 25 él. par fleur (8 à 11 fleurs), rhynchostylis et epidendrum ≈ 4 à 5 él. par fleur (dessin léger), coelogyne ≈ 20 él. par fleur, lycaste ≈ 40 él.

## Diffs moteur
Aucun.

## Doutes
- Les grappes denses (rhynchostylis : 40 fleurs) dépassent le budget de 150 éléments par tête malgré le dessin léger (≈ 200).
- Le F de la graine 5 (asparagus) est à signaler au lot qui gère cette espèce.
- Rhynchostylis est surtout vendue en pot ; la grappe coupée existe en Thaïlande. Le bleu (R. coelestis) a une grappe dressée dans la nature : il est dessiné pendant comme les autres.
- Ascocenda : la tige feuillée est dessinée au pied de la grappe comme le demande la mission ; les tiges coupées du commerce sont souvent sans feuilles.
