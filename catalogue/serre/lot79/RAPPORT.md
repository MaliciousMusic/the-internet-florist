# Lot 79 « persistants » — rapport

Fichier : `s79a.js` (préfixe `l79` / `L79_` / `CW_L79`). Aucun module moteur n'est modifié : pas de diff moteur.
Les cinq espèces n'avaient pas de version 3D (`grep "'<sid>'"` ne trouvait rien ; seul `k0.js` les décrivait en `foliage` générique). Elles sont désormais dessinées par `GH[sid]` sous le même sid.
Moteurs repris : `fgGrow`/`fgAxis` (lot 24), `g35Leaf` (feuilles 3D en deux moitiés, brillance, panachure, lot 35), `bzFruit` (lot 20).
Ajouts du lot :
- `l79Grow` : `fgGrow` + un axe principal qui ondule de nœud en nœud (`zig`) pour le salal. La visée est douce (k 0,4), donc la tige se courbe sans coude ;
- `l79Prof` : un contour de limbe finement denté en scie, avec des dents orientées vers la pointe ;
- `l79Cluster` : une grappe pendante à l'aisselle, avec des pédicelles ≥ 1,15 qui partent chacun du pédoncule ;
- `l79PisLeaf` : une feuille paripennée.

Tous les traits font ≥ 1,15. Les nervures plus fines restent dans le limbe et ne servent qu'au détail de planche.
Contrat : `{k,bw,bw1,bc,neck,nd}` (fgGrow), sur l'épine du Composer, sur une planche et sur une carte.

## Espèces
| sid | morphologie dessinée | coloris (CWS) | tailles SZG (cm de feuille) | tige |
|---|---|---|---|---|
| `pittosporum-tobira` | rameaux gris-brun étagés ; feuilles obovales (pointe arrondie, base en coin) groupées en fausses verticilles au bout des pousses, coriaces, très luisantes, nervure médiane pâle, bord enroulé (cup < 0) | vert brillant, panaché crème (Variegatum : centre gris-vert, marge crème), vert tendre | 5, 7, 7, 9 | 48 cm |
| `gaultheria-shallon-salal` | tige rouge-brun en zigzag doux, feuilles alternes distiques, ovales et larges, finement dentées en scie, nervation pennée arquée, luisantes ; pétiole court | vert profond (lemon leaf), vert (salal), vert tendre (salal tips, tige courte sans rameaux, pousses claires) | 6, 8, 8, 10 | 45 cm (tips 30) |
| `vaccinium-ovatum-huckleberry` | longues frondes arquées, rameaux rouges, petites feuilles ovales-lancéolées dentées, distiques et serrées, pousses bronze-rouge ; baies noir pourpré par 2 à 4 aux aisselles | vert à tiges rouges, vert à pousses bronze-rouge, vert à baies noires | 2,5, 3, 3, 4 | 50 cm |
| `olea-europaea-olivier` | rameaux gris, feuilles opposées décussées, étroites et lancéolées (l/L ≈ 0,2), gris-vert mat dessus, argentées dessous (torsion visible), bord enroulé ; olives ellipsoïdes de 1,5 à 2 cm, isolées ou par 2 à 3 sur un court pédoncule | gris-vert argenté, olives vertes, olives noires (maturité inégale : vert, violine, noir), vert sombre (Picual) | 5, 6, 6, 8 | 58 cm |
| `pistacia-lentiscus-pistachier` | tiges et rachis rouges, feuilles paripennées (pas de foliole terminale) de 2 à 5 paires de folioles elliptiques, coriaces et luisantes ; drupes de 4 mm en grappes denses, rouges puis noires | vert profond, vert olive (plein soleil), vert à baies rouges | 6, 8, 8, 10 | 48 cm |

Sources botaniques (connaissances générales, RHS, flores) :
- *P. tobira* : feuilles de 5 à 10 cm ;
- *G. shallon* : feuilles de 5 à 10 cm, finement serrulées ;
- *V. ovatum* : feuilles de 2 à 5 cm, baies de 5 à 9 mm ;
- *O. europaea* : feuilles de 4 à 8 cm, à écailles argentées dessous ;
- *P. lentiscus* : feuilles paripennées à 2 à 6 paires de folioles, drupe d'environ 4 mm.

Les coloris à fruits ont leur propre couleur clé : `fgCw` choisit d'abord la couleur exacte, donc deux coloris de même `c` se masquaient.

## QA
- Planches : 9 vues × 3 stades, coloris et 3 tailles, regardées en grand et zoomées à `det=2`. Les livrables sont dans `sheets/`.
- Composés `inc=` des 5 espèces, graines 5, 7 et 11 × 20 bouquets : **60 bouquets, 0 F, 0 U, 0 kink**. Captures `w/b.png` (graine 3, 8 bouquets) et `sheets/bouquets.png` (graine 7) regardées.
- Modèles : `models_of.py` renvoie `ns=` vide, car aucun des 76 modèles n'utilise ces espèces. Il n'y a rien à tester.
- Perf (`perf=1`, 76 modèles) : 168 ms et 8 295 éléments par bouquet en moyenne (référence ≈ 142 ms et 10 150). Le moteur est intact et aucun modèle n'utilise ces espèces : l'écart de temps vient de la machine cloud, pas du lot.

## Doutes
- Huckleberry : les baies sont à l'échelle réelle (environ 8 mm). À l'échelle du bouquet elles restent discrètes.
- Olivier, coloris « olives vertes » : les olives se fondent dans le gris-vert, ce qui est fidèle mais peu lisible sur la carte.
- Olivier : des traits fins et parasites sortaient des feuilles avec la nervure médiane explicite (la cause exacte n'a pas été trouvée). La nervure est donc laissée au tracé par défaut de `g35Leaf`, qui est propre.
- Le salal n'a pas de coloris à baies : le commerce ne vend que le feuillage.
