# État du pilier (lot D2) — relais, 15 octobre 2026 (reprise du soir)

- Module : `decor/pilier.mjs` (graine → SVG). `node decor/pilier.mjs [graine] [--part all|corps|ombre|pied] [--layers modele,relief,grain,arete,alveoles,lichens,fissures,mousse,ombre,pied] [--out f]` → `out/pilier.svg`. `pilierGeom(graine)` inchangé (graine 1 : plateau x 1112,7 à 1288,4, y 702,1 ; pied 1200, 1040,2). Planche : `python decor/planche_pilier.py [graine]` → `planches/d2-pilier.png` (rangée 3 : téléphone 1,8 px/unité au cadrage exact de la maquette, maquette à la même taille ; rangée 2 : la face au soleil en gros plan 2× contre la photo 86, même champ de 60 × 48 mm).
- Caméra commune, silhouette, profil, méplats, alvéoles en trois tailles : inchangés.

## Reprise (passes isolées)

1. **Modelé du cylindre.** Ciel clair plus lumineux côté soleil (`AN_SKY` 0,3 : une face tournée vers l'azimut du soleil reçoit 1,8 fois le ciel d'une face opposée) ; masquage de Smith de la matrice rugueuse (`ROUGH` 0,85, normalisé sur la face la plus éclairée, n·S 0,56) : la lumière tombe plus vite vers le terminateur et l'arête haute, tournée vers le soleil, s'éclaire ; rebond vert du pré renforcé en bas (`bounceAt` 1 + 2,3 e^(−h/0,26)). Bandes du corps de 4 u, fondues par un flou horizontal de 1,8 u (une seule région, qui couvre la colonne). Facettes de taille ramenées à des voiles relatifs à la lumière locale (opacités 1,5 à 13,5 %, flou 1,3) : elles ne s'éclaircissent plus dans l'ombre propre. Grain : piqûres foncées (tuiles 37 et 53) + crêtes, nodules (2-4 mm) et bosses (5-8 mm, ombre, épaule éclairée, sommet) éclairés, en taches groupées, effacés progressivement au-delà du terminateur ; albédo « roche pleine » 1,75 fois la matrice (les pores sous le millimètre assombrissent la matrice). Alvéoles vues en perspective : cœur sombre décalé vers la caméra de 0,5 × profondeur × tan(angle de vue), paroi du fond visible, lentille au soleil seulement si la caméra la voit.
2. **Mousse.** Coussinets de 5 à 38 mm placés en Poisson dans un champ (ligne à 0,12 m côté soleil, 0,33 m côté ombre, bruit, îlots au-dessus, rien dans l'encoche) ; agrandis 1,3 fois, leur union fait des plaques (une `path` par couleur). Couches : ombre portée de la plaque (décalée à l'opposé du soleil), creux sombre, mottes de 2 à 5 mm et pointes éclairées (deux petites tuiles aléatoires de 31 et 37 u, décalées par couleur), frange de pointes en contour, bombé de chaque plaque calculé (bord côté soleil plus clair). Quatre teintes : vert-jaune, olive, olive sombre, brun sec. Au sol : coussinets écrasés par la perspective, 16 à 24 brins en deux tons, 3 à 5 trèfles.
3. **Lichens.** Croûtes grises rugueuses (albédo 0,34, partie épaisse 0,52), contour lobé à encoches fines, étirées le long de l'arête haute, bord effiloché de granules sur les grandes ; 2 à 4 taches orangées discrètes ; dessinées sous les alvéoles, qui les trouent.
4. **Arête et fente.** Bande d'usure de l'arête haute (dégradé calculé sur l'arrondi de 3,2 cm, pierre moins poreuse, opacité 0 → 0,72), épaufrures en cassure fraîche éclairée avec l'ombre de leur ressaut. Encoche de la maquette (4-6 × 7-10 cm, à 13-21 cm, à droite du front) : cicatrice de cassure, cavité dans l'ombre profonde, sol éclairé par le ciel, paroi au soleil en lanière piquée, lèvre éclairée ; fente qui en descend jusqu'au pied et en remonte.
5. **Matière (critique « granit, terrazzo »).** Plus d'éclats clairs : les bosses (5-8 mm) et nodules ne dessinent plus de sommet plat éclairé, seulement le croissant d'ombre qu'elles portent côté opposé au soleil (`crescent`, un seul polygone par bosse, direction calculée au milieu de la face éclairée) ; les nodules de 2-4 mm sont retirés ; crêtes claires 130 → 40, à 1,3 fois la matrice éclairée. La texture passe aux creux : trous sombres de 2,5-5 mm en tuile (`gH`, 89 u, 290 trous) avec une lèvre éclairée fine (0,55 u, 1,8 fois la matrice) sous leur bord opposé au soleil, éteinte par bande au-delà du terminateur ; fond des trous et des alvéoles plus sombre (occlusion 0,17-0,05, L ≈ 0,3 de la matrice). Grain fin à bas contraste : pores et piqûres en noir translucide (12 et 9 %, assombrissement proportionnel, le modelé est gardé) ; rugosité en traînées obliques floues (`gS`, 380 traits de 2-4 mm, noir 55 % au soleil, 41 % à l'ombre propre, flou 0,7 u dans un filtre qui couvre la colonne). Alvéoles : lèvres 0,45-1,3 mm (avant 0,7-2,4) à 1,15 fois au lieu de 1,37, paroi du fond au soleil ×0,42, haut de paroi ×0,52, paroi rasante ×0,65 ; moins de gros trous (5-10 mm 0,17 /cm², 10-20 mm 0,038, 20-34 mm 0,002, d'après la maquette). Albédo de la matrice 0,238 → 0,272 pour garder la médiane.
6. **Arête (critique « gruyère »).** Sur les 6 derniers centimètres, les alvéoles se raréfient (garde 10 % au ras de l'arrondi, tirage déterministe), rapetissent (×0,45 à ×1) et perdent de la profondeur : plus de rangée de trous noirs. Bande d'usure à l'albédo de la matrice (×1 au lieu de ×1,3) et opacité 0,78 ; les lichens et les épaufrures sont inchangés.

## Mesures de la reprise matière (graine 1, rangées h 0,30-0,62 m, zone éclairée = 8 à 50 % de la largeur ; scripts `mes.py`, `edge.py`, `prof.py` dans le brouillon de la session)

| | avant | après | maquette (3,2 mm/px) |
|---|---|---|---|
| Médiane du fût (2,5 mm/px) | #4d5053 (L 80) | **#444647 (L 70)** | #414139 (L 64), soir |
| Pixels clairs L > 140 : fût / zone éclairée | 8,9 % / 14,1 % | **0,3 % / 0,5 %** | 0,6 % / 1,2 % |
| Zone éclairée : L > 110 ; p5/p50/p95 | 31 % ; 32/93/157 | **14 %** ; 30/83/121 | 8 % ; 24/72/117 |
| Contraste du grain σ/moyenne (zone ; fenêtres de 25 mm) à 2,5 mm/px | 0,375 ; 0,336 | **0,334 ; 0,316** | — |
| Idem à 3,2 mm/px | 0,351 ; 0,329 | 0,321 ; 0,297 | 0,386 ; 0,320 |
| Qui porte le contraste (p95−p50 / p50−p5) | 64 / 60 (clairs) | **37 / 54 (creux)** | 45 / 48 |
| Creux L < 40 | 9,6 % | 12,9 % | 15,0 % |
| Profil par dixième (côté soleil d'abord) | 0,95 1,00 1,00 0,94 0,94 0,90 0,75 0,66 0,62 0,49 | 0,95 0,97 1,00 0,93 0,93 0,87 0,77 0,66 0,61 0,53 | |
| Arête, 4 cm du haut : trous L < 40 ; médiane | 8,2 % ; L 128 | **2,1 %** ; L 141 | |
| Poids gzip (graines 1 ; 2 à 5) | 145,7 ; 143,3-146,2 Ko | **141,0 ; 138,6-141,6 Ko** | |

Photo 86 mesurée de la même façon (2,5 mm/px) : #3f4246, L > 140 2,1 %, σ 0,44 (zone), 0,38 (fenêtres) ; ses lèvres au plein soleil font un réseau clair serré que le rendu, calé sur la maquette, ne reprend pas.

## Mesures précédentes (graine 1 ; rendu 1× = 2,35 mm/px, rangées h 0,30-0,62 m ; avant la reprise matière)

- Profil par dixième de largeur (côté soleil d'abord), rapport au pic : 0,92 0,97 1,00 0,93 0,90 0,87 0,71 0,66 0,61 **0,51** (avant : … 0,78 0,70 0,67 0,54 ; maquette, éclairée de l'autre côté : 1,00 0,92 0,87 0,71 0,67 0,68 0,60 0,57 0,54 0,59). Le terminateur reste à 88 % de la largeur : c'est le `SUN` commun (soleil haut, un peu derrière le spectateur) ; la maquette, au soleil rasant, l'a vers 35 %.
- Grain en pleine lumière : σ(L)/moyenne à 2,5 mm **0,38** (avant 0,28 ; maquette 0,38 à 3,2 mm/px ; photo 86 : 0,45) ; p5/p50/p95 32/93/157 (86 : 16/66/115).
- Médiane du fût #4a4e50 (visée #4f5054) ; creux (L < 40) 10,3 % (maquette 13,4).
- Reflet vert, ombre propre en bas à droite : #2c3332 (G−R +7) contre #292f30 en haut.
- Alvéoles au centre / aux bords (15 % de chaque côté) : largeur/hauteur 1,18 / 0,75, densité à l'écran × 1,4, aire sombre par trou −25 % aux bords (croissant).
- Mousse (couverture par cinquième de largeur) : 12 9 9 12 30 % ; plaques continues jusqu'à 0,07-0,11 m côté soleil, 0,25 m côté ombre, îlots jusqu'à 0,35 m.
- Lichens à l'échelle téléphone : 10 % du quart haut, 3 % du fût ; L 148 (contraste +35).
- Poids : **145,7 Ko gzip** (corps 15,1 ; facettes 10,8 ; grain 12,6 ; alvéoles 62 ; lichens 9,1 ; fissures 0,9 ; mousse 16,9 ; arête 2,8 ; pied 5,3 ; défs communes) ; graines 2 à 5 : 143,3 à 146,2 Ko. Génération 0,65 à 1,2 s ; rendu resvg 0,35 s (2400 px), 0,83 s (4800 px).

## Pièges resvg-js

(1) Un groupe `clip-path` ou un `filter` entièrement hors du cadre rendu fait paniquer le processus : les deux filtres (`fB` corps, `fR` facettes) couvrent toute la colonne. (2) Un `mask` ou un `clip-path` imbriqué dans le corps découpé disparaît sur fond opaque : aucun n'est utilisé. (3) Des rectangles de motif qui se chevauchent doublent le grain et tracent des lignes verticales : bords arrondis partagés et `shape-rendering="crispEdges"`.

## Défauts restants (passe critique, standard § 1)

- Matière : plus d'éclats clairs, matrice plus sombre et plus unie ; le contraste du grain (0,33 à 2,5 mm, 0,32 à 3,2 mm) reste sous les 0,38-0,39 de la maquette. Le pousser par les creux (trous plus nombreux ou plus noirs) rendait la face soit trop sombre (médiane L 64), soit criblée de points noirs. À l'échelle téléphone, la face reste un peu plus piquée que la maquette (photo floue, lumière du soir). Gros plan 2× : scorie rugueuse à trous sombres et lèvres fines, plus calme que la photo 86.
- Arête : la bande d'usure éclairée et ses lichens (L 141 médiane sur 4 cm) restent plus clairs que le fût ; c'est le soleil haut commun (dessus N·S 0,84) et non la maquette (soleil rasant du soir, dessus sombre). Question au chef de chantier : faut-il l'assombrir au-delà de la lumière calculée ?
- Plaques de mousse encore un peu plates (pas d'épaisseur visible au bord éclairé) ; brins d'herbe simples ; mousse basse côté soleil (maquette : environ 20 %).
- Lichens discrets (3 % du fût, le brief dit 5 à 15 %) ; paroi éclairée de l'encoche en aplat.
- Ombre du vase sur le plateau et mesure dans Chrome : à l'intégration.
