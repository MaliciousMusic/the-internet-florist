# Lot 51 — héliconias 2 (agent heliconias2)

Fichiers : `s51a.js` (préfixe `l51`) et une copie moteur `v1f.js` (voir « Diff moteur »). Le dessin réutilise le moteur du lot 19 (`s19a.js` : `HB_W`, `HB_D`, la grammaire de `heliPlant`) et `s0.js`/`l0.js`.

## Le moteur du lot
- `l51Plant` reprend `heliPlant` (axe en zigzag, deux rangs de bractées en bateau, pédoncule en crosse pour les pendants, coupe au pédoncule `Q` pour le col), avec en plus : l'épaisseur du rachis (`rw`), la palette du pédoncule (`sc`, caribaea glauque), les profils de bractée par espèce (`wp`, `dp`), la cire (`wax`) et les fleurs (`fl`).
- `l51Bract` reprend `heliBract`, avec des zones peintes **sur** la bractée, chaque couche peinte (motifs et nervure) étant coupée (`clipPath`) à la silhouette de la pièce qu'elle décore (bandes en coordonnées (u, v) de la feuille, coupées aux rangées que la pièce montre) : pointe d'une autre couleur en fondu (`tc`, `te`), lèvre le long de la marge libre (`m`, `mw`), liseré fin du bord (`ec`, `ew`), carène au dos (`kc`). Toutes ces zones sont des surfaces remplies à l'intérieur de la bractée : aucun trait fin, rien de flottant.
- Les fleurs (psittacorum) partent du creux de la bractée (base à v = 0,1, dans le bateau) et sortent par la bouche : tube jaune ou orange, bande sombre sous la pointe, pointe verte, rayon ≥ 0,62 (trait ≥ 1,24 unité).

## Par espèce
| sid | port | coloris (noms du commerce) | tailles (cm d'inflorescence) |
|---|---|---|---|
| `heliconia-rostrata` | pendant, 8–11 bractées sur rachis rouge en zigzag, crosse rouge | Pince de homard rouge et jaune (rouge, pointe jaune, liseré vert) | 30, 35, 40, 45, 50, 60 |
| `heliconia-caribaea` | dressé, 5–8 grandes bractées larges triangulaires, imbriquées, cireuses ; pédoncule glauque | Purpurea rouge, Black Magic bordeaux, Gold jaune, Jacquinii (× bihai) rouge à lèvre jaune, Crème, Chartreuse | 25, 30, 35, 40, 45 |
| `heliconia-psittacorum` | dressé, petit, 3–5 bractées étroites lancéolées et écartées, rachis coloré, 1 à 2 fleurs saillantes par bractée | St. Vincent Red, Lady Di rouge, Andromeda orange, Golden Torch jaune, Sassy rose, Rouge sombre | 10, 12, 14, 16, 18 |
| `heliconia-stricta` | dressé, court, 5–7 bractées serrées (entre-nœuds courts), pointe verte en fondu, liseré vert | Dwarf Jamaican rouge, Tagami rose, Fire Bird rouge orangé, Bucky orange (lèvre jaune), Jaune | 12, 14, 16, 20, 24 |
| `heliconia-wagneriana` | dressé, 6–9 bractées larges très imbriquées, cireuses ; centre rose-rouge, marge jaune pâle, bord vert | Rouge corail classique, Big Red, Rainbow rose, Turbo crème et rose, Verte | 20, 25, 28, 30, 35, 45 |

Notes botaniques (sources : NYBG, CTAHR Hawaï, NParks, Chicago Botanic Garden, TopTropicals) :
- rostrata : inflorescence pendante, bractées cymbiformes rouges à apex jaune et marge verte ; fleurs jaune-vert, peu visibles (non dessinées : elles flottaient visuellement hors des bractées).
- caribaea : 6–15 bractées imbriquées, largement triangulaires, distiques, jusqu'à 25 cm à la base ; rouges, parfois bordeaux, jaunes, crème ou vertes ; tige cireuse blanchâtre.
- psittacorum : petites inflorescences dressées ; fleurs jaune-vert à orange, tache sombre près de l'apex (« langue de perroquet »), pointe verte.
- stricta : bractées rouges ou orange bordées de vert au bord supérieur (Dwarf Jamaican), inflorescence courte.
- wagneriana : épi dressé, cireux, imbriqué jusqu'à envelopper le rachis ; bractées rose-rouge à bord jaune pâle et marge verte (11–14 × 7–9 cm).

Toutes les espèces se vendent en bouton (`GH_BUDS`). Pas de `GHI` (comme bihai et velues, rôle « head »).

## Corrections de cette reprise
- Nervures : `veins3` (s0.js) trace la nervure entière sur chaque bande de la feuille ; de profil, sur les bractées en bateau, elle dépassait du contour (traits pâles flottant sous les bractées de caribaea). La nervure est maintenant dessinée dans `paint`, limitée aux rangées de la pièce et coupée à sa silhouette (trait ≥ 1,1 unité).
- Motifs (pointe, lèvre, liseré, carène) coupés à la silhouette de la pièce : les rangées courbes d'un bateau pouvaient sortir du contour approché de `sheet3`.
- Sommet du rachis : le dernier entre-nœud nu (0,35 × entre-nœud) faisait un moignon au-dessus de la dernière bractée ; ramené à 0,08 (caché par la jeune bractée).
- Planches revues en grand et zoomées (9 vues × 3 stades, coloris, 3 tailles) pour les 5 espèces ; cartes du Composer refaites avec les 27 coloris (`k=6`).

## QA
- Bouquets composés, `inc=` les 5 espèces, n = 20 × graines 5, 11, 23 : **0 F, 0 U, 0 kink** (60 bouquets) ; graines 31 et 47 également à 0 (vérifiées par l'autre session). Avant la copie de `v1f.js`, la graine 23 donnait 1 F (C3, papier) : un pli aléatoire du papier d'emballage (trait 0,8) sortait du bord du papier ; le QA l'attribuait au caribaea voisin.
- Modèles : aucun modèle du catalogue n'utilise ces 5 espèces (`models_of.py` → `ns=` vide). Comme `v1f.js` est touché, QA des 4 modèles en papier (`ns=8,14,15,55`) : 0 F, 0 U, 0 kink.
- Perf (76 modèles, cette machine) : 182 ms, 8 463 éléments par bouquet ; `main` sans le lot sur la même machine : 186 ms, 8 463 éléments (machine plus lente que la référence de 142 ms ; aucun écart dû au lot).
- Éléments SVG par inflorescence (DET 1, après l'allègement 3b2a373 : rostrata 8–11 bractées, wagneriana 6–9, psittacorum 2 fleurs par bractée) : psittacorum 83–141, stricta 96–110, caribaea 114, wagneriana 128, rostrata 170–206 (bihai du lot 19 : 126, velues : 186–226). QA et planches refaites après cet allègement. La coupe des motifs coûte 2 éléments par pièce, compensés en traçant la nervure d'un seul trait.

## Diff moteur (`v1f.js`, `wrapFront`)
Les 4 plis du papier sont tracés dans un groupe coupé à la forme du papier ; mêmes tirages `R()` dans le même ordre, donc aucun autre bouquet ne change.
```diff
-  E('path',{d:`M${x-22},${y+44}${edge}L${x+22},${y+44}Z`,fill:lin([[0,lt(c,.3)],[.5,c],[1,dk(c,.18)]],0,0,1,0)},g);
+  const pd=`M${x-22},${y+44}${edge}L${x+22},${y+44}Z`,cid='u'+(gid++);E('path',{d:pd},E('clipPath',{id:cid},GDEF||defs));
+  E('path',{d:pd,fill:lin([[0,lt(c,.3)],[.5,c],[1,dk(c,.18)]],0,0,1,0)},g);
@@
-  for(let i=0;i<4;i++)E('path',{d:`M${f(x+R(-hw*.6,hw*.6))},...`,stroke:dk(c,.25),'stroke-width':.8,'stroke-opacity':.22},g);return g}
+  /* the creases stay on the paper (a random one could run past its edge) */
+  const gc=G(g,{'clip-path':`url(#${cid})`});for(let i=0;i<4;i++)E('path',{d:`M${f(x+R(-hw*.6,hw*.6))},...`,stroke:dk(c,.25),'stroke-width':.8,'stroke-opacity':.22},gc);return g}
```

## Doutes
- Deux sessions ont travaillé en même temps sur ce lot et cette branche (session_01TZVQ… et session_016gFs…) ; leurs commits ont été fusionnés sans push forcé (allègement des têtes de l'une, nervures/motifs coupés, rachis sans moignon et `v1f.js` de l'autre). Planches et QA refaites sur le code fusionné.
- Rostrata : jusqu'à ~200 éléments par inflorescence (8–11 bractées, chacune en deux moitiés 3D), au-dessus de la cible de 100–150 ; la réduire davantage appauvrirait la pince de homard.
- Les planches `_vues.png` au format imposé (1100×900) coupent le bas de la rangée « ouvert ».
- Rostrata : un seul coloris réel dans le commerce (rouge/jaune) ; aucun autre ajouté.
- Noms « Crème » (caribaea), « Rouge sombre » (psittacorum), « Jaune » (stricta), « Verte » (wagneriana) et « Turbo crème et rose » : coloris de la recette `k0.js`, cultivars exacts non confirmés ; noms génériques.
- Psittacorum : vendu parfois avec une feuille lancéolée sur la tige (recette `leaf: lanceolate`) ; non dessinée.
