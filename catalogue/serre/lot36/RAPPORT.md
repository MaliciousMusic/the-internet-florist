# Lot 36 — feuillages des plantes à fleurs (agent feuillesfleurs)

Fichier : `s36a.js` (préfixe `ff36` / `FF36_`). Aucun module moteur modifié, donc pas de diff moteur.
Contrat des lots 15 et 24 : `fgAxis` + `fgGrow` (L-système, épine du Composer, `{k,bw,bc,neck,nd}`), feuilles 3D `fgBlade`, `open(k,t,…)` pour la brise.
Ajouts locaux : `ff36Sheet`, une feuille 3D tracée à partir d'un contour (pour le fer de flèche du calla) avec ses deux moitiés éclairées chacune par sa normale ; `ff36Over`, qui dessine sur la face supérieure (mouchetures, marbrures).
Stades (`op`) : bouton = jeunes feuilles pliées ou enroulées, mi-ouvert, ouvert.

## Espèces
- **gloriosa-feuillage** (*Gloriosa superba*) : rameau grimpant grêle. Feuilles sessiles, lancéolées, lustrées, alternes en spirale ; les feuilles supérieures se prolongent en vrille enroulée (`ff36Tendril`). Rameaux latéraux, pointe repliée. Feuille et tige reprises de `gloriosaPlant` (#4a7a34). Coloris : vert franc, vert profond, vert tendre. Tailles : feuilles de 10, 12 et 14 cm (tige d'environ 55 cm).
- **pivoine-feuillage** (*Paeonia lactiflora*) : tige rougeâtre (`PEO_SC` teintée de rouge), 3 à 5 feuilles alternes biternées. Le pétiole rouge se divise en 3, chaque branche porte 3 folioles ; les folioles terminales sont souvent recoupées en 2 ou 3 segments lancéolés, lustrés. La tige se termine par une petite feuille (bouton ôté). Coloris : vert lustré, vert foncé, vert à pétioles rouges (jeune), rougi d'automne, bronze cuivré. Tailles : feuilles de 12, 14 et 16 cm.
- **calla-feuilles** (*Zantedeschia aethiopica*, hybrides *albomaculata* et *elliottiana*) : une feuille sur un long pétiole charnu (tiges de `callaPlant`). Limbe sagitté à 2 lobes basaux, nervures fines arquées vers la marge, nervure médiane claire. Le limbe est arqué et retombe ; la jeune feuille est enroulée. Les hybrides ont un limbe plus étroit, moucheté de blanc translucide. Coloris : vert uni (aethiopica), vert tendre, moucheté de blanc. Tailles : limbes de 18, 24 et 30 cm.
- **hellebore-feuilles** (*Helleborus × hybridus*, *H. niger* et hybrides × *ericsmithii* / × *ballardiae*) : feuille basale pédalée à 7 ou 9 segments elliptiques dentés vers la pointe, coriaces, en parapluie, sur un long pétiole. Les segments extérieurs naissent sur les latéraux. La jeune feuille pend, pliée. Coloris : vert foncé, vert lustré, vert moyen (bractées de `hellPlant`), marbré argent, veiné crème. Tailles : feuilles de 12, 15 et 18 cm.
- **chrysantheme-feuilles** (*Chrysanthemum × morifolium*) : rameau aux feuilles alternes nombreuses, sur un court pétiole. Elles sont ovales, profondément lobées (le profil de `mumLeaf`), dentées, gris-vert dessous. Quelques rameaux latéraux en haut. Coloris : vert, vert grisé, vert foncé. Tailles : feuilles de 6, 8 et 10 cm.

`CWS` et `SZG` sont enregistrés pour les 5 espèces. Pas de `GHI` : le rôle feuillage par défaut convient, comme au lot 24. Un coloris de modèle tombe sur le coloris uni le plus proche (`fgCw`).

## Vérifications
- Planches : 9 vues × 3 stades regardées (face, 3/4, profil, dos, plongée, contre-plongée, dressées), coloris et 3 tailles, avec des zooms sur le calla et l'hellébore. Corrections faites :
  - mouchetures du calla alignées (suite pseudo-aléatoire corrélée) ;
  - nervures qui sortaient du limbe à la pointe ;
  - écart entre le pétiole et le limbe en profil ;
  - segments d'hellébore trop étroits ;
  - feuille d'hellébore plate de profil (elle est maintenant en dôme) ;
  - jeune feuille d'hellébore désordonnée (elle pend maintenant, pliée) ;
  - folioles de pivoine trop petites.
- Cartes du Composer : `sheets/cartes_composer.png`.
- QA composée avec `inc=` les 5 espèces, graines 5, 11 et 23 × 20 : **0 F, 0 U, 0 kink**. Captures regardées : `sheets/bouquets.png` et 2 planches de 8 bouquets.
- QA des modèles 18, 31, 43, 71, 74 et 81 : **0 F, 0 U, 0 kink**.
- Perf (`perf=1`, 76 modèles, machine cloud) : 274 ms et 9 396 éléments par bouquet, contre 287 ms et 9 399 éléments pour `main` sur la même machine. La machine est plus lente que la référence de 142 ms, mais l'écart relatif est nul. Sur les 6 modèles concernés : 8 368 éléments contre 8 399.

## Doutes
- Dans les modèles 18 (hellébore) et 43 (pivoine), le feuillage est presque caché par les fleurs : c'est la composition du modèle, pas le dessin.
- Le calla du modèle 31 est grand (24 cm de limbe), ce qui est fidèle à la recette.
- La feuille d'hellébore « mi-ouvert » reste un peu chiffonnée : c'est un stade transitoire, que le commerce ne vend guère.
- Les coloris d'automne de la pivoine et les hellébores marbrés et veinés sont des sélections de jardin, rares en fleuristerie.
