# Lot 69 « myrtacées » — rapport (agent myrtacees)

Fichier : `s69a.js` (préfixe `l69` / `L69_`). Aucune copie moteur, aucun diff moteur.
Les 5 sids avaient une ancienne version générique (`a:"foliage"` de `k0.js`, sans `GH`). Ma version les remplace sous le même sid via `GH`/`CWS`/`SZG`/`GHI`.

## Moteur commun du lot : `l69Sprig`
- Il dérive de `f15Sprig` (lot 15) : L-système nœud par nœud, avec l'axe sur l'épine du Composer ou dressé sur une planche, des rameaux et des feuilles en nappes 3D (`f15BladeS`/`f15Blade`). Il réutilise aussi `eucApex`, `EU_VR` et `f15DyeStem`.
- Ajouts propres au lot :
  - un module `Fl` pour la fleur axillaire et un module `Sp` pour l'anneau d'épi ;
  - l'écart des rameaux en cm (`gapC`) ;
  - une phyllotaxie distique alternée (`alt`), pour les « pages » de la kruseana ;
  - l'échelle des feuilles sur planche (`o.cm` ≤ 15 = taille de feuille ; > 15 = longueur de tige) ;
  - des axes larges d'au moins 1,15 unité (règle des 1,05) ;
  - le retour du contrat complet `{k, bw, bw1, bc, neck, nd}`.
- Les feuilles minuscules (aiguilles, écailles) et les fleurs nombreuses passent en lots (`l30Batch`/`l30Flowers` du lot 30). Les clés de tons sont faces et revers × 3 lumières.
- Chaque détail part de sa courbe porteuse :
  - feuilles ancrées dans l'axe ;
  - fleurs sessiles, pétales posés sur le rameau ;
  - étamines du goupillon issues de l'axe, sur un cœur crème qui les relie ;
  - pétiole du polyanthemos d'au moins 1,15 unité de large.

## Espèces
| sid | botanique (ce qui est dessiné) | coloris (`CWS`) | tailles (`SZG`, tige cm) |
|---|---|---|---|
| `eucalyptus-polyanthemos` | Tiges brun-rouge ; feuilles adultes alternes, pétiole de 1 à 1,5 cm courbé, limbe ovale à orbiculaire de 4 à 8 cm (6 cm × échelle), pendant et un peu de chant ; pruine, nervure claire, nervures latérales aiguës sur les planches. | gris-vert argenté, bleu argenté, vert-gris ; stabilisés vert, bleu, bordeaux | 50 · 60 · 70 · 80 |
| `eucalyptus-kruseana` | Feuilles juvéniles persistantes, opposées, sessiles, orbiculaires de 1 à 2 cm, très serrées (entre-nœud de 0,55 à 0,85 cm), posées presque à plat, en paires distiques à peine alternées (± 28°) : les « pages d'un livre ». Gris argenté poudré, jeunes paires plus pâles ; tige rouge-gris pruineuse. | gris argenté poudré, bleu-gris, vert-de-gris | 40 · 50 · 60 |
| `melaleuca-feuillage` | Rameaux souples très ramifiés ; feuilles linéaires en aiguille de 1,5 à 2,3 cm, en spirale dense, dirigées vers l'avant. Coloris « en fleur » : épis en goupillon crème autour de l'axe, qui continue feuillé au-delà (anneaux de 6 touffes d'étamines). Stades : bouton (cylindre de boutons ronds vert-crème), puis ouvert. Dans un bouquet, 30 % des tiges des autres coloris fleurissent aussi. | vert vif en fleur (épis crème), vert vif (Revolution Green), vert doré (Revolution Gold), gris-vert (alternifolia) | 50 · 60 · 70 |
| `leptospermum-arbre-a-the` | Rameaux grêles brun-rouge ; feuilles minuscules de 0,7 à 1,1 cm, lancéolées et piquantes, en spirale (vert sombre, bronze pour les rouges). Fleurs sessiles, solitaires à l'aisselle, de 1,4 à 1,9 cm : 5 pétales ronds étalés, disque sombre et anneau d'étamines ; doubles en rosettes (3 rangs). Boutons ronds vers les extrémités ; les stades règlent le mélange boutons / fleurs. | blanc simple cœur vert, blanc double (Snow White), rose cœur sombre (Martini), rose pâle double (Apple Blossom), rouge rubis simple (Nanum Ruby), rouge double (Red Damask) | 40 · 50 · 60 |
| `lophomyrtus` | Tiges rouges ; feuilles opposées, presque sessiles, ovales-rondes de 1,5 à 2 cm, gaufrées (nervures creusées entre les cloques) et luisantes (un reflet côté lumière). Panachés : centre vert irrégulier sur une marge crème, rosée vers les pousses. | bordeaux (Red Dragon), pourpre noir (Black Stallion), pourpre bronze (Kathryn), vert panaché crème et rose (Magic Dragon), panaché crème vert rose (Little Star, feuilles plus petites) | 40 · 50 · 60 |

`GHI` : `{form:'feuillage', k:'plant', rk:.44, self}`, comme pour les lots 15 et 35. Aucune espèce n'est dans `GH_BUDS` : ce sont des feuillages coupés.

## QA
- **Planches.** 9 vues × 3 stades, coloris et 3 tailles, regardés en grand et zoomés (`fz=`). Le contrôle des tailles a servi en feuille (`cm=4,5,7`) et en tige (`cm=40,50,60`). Corrections faites en route :
  - rameaux concentrés à la base, d'où l'écart en cm ;
  - épi du melaleuca trop long : ramené de 15 à environ 3 cm ;
  - pétales gris au revers ;
  - reflets en pois du lophomyrtus ;
  - marge panachée trop saumon.
- **Cartes du Composer.** `sheets/cartes_composer.png`.
- **Bouquets composés** avec `inc=` les 5 sids :
  - graine 5 : 20 bouquets, 0 F, 0 U, 0 kink ;
  - graine 11 : 20 bouquets, 0 F, 0 U, 0 kink ;
  - graine 23 : 20 bouquets, 0 F, 0 U, 0 kink.

  4 captures regardées (graines 3, 17 et 7 ; `sheets/bouquets.png`), sans défaut cerclé.
- **Modèles.** `models_of.py` renvoie `ns=` vide : aucun des 76 modèles n'utilise ces espèces, donc il n'y a rien à lancer.
- **Perf** (`perf=1`, 76 modèles) :
  - mon espace : 191 ms, 8 295 éléments ;
  - espace vierge `_test` sur la même machine : 186 ms, 8 295 éléments.

  Le nombre d'éléments est identique ; l'écart de temps est du bruit de machine (la machine cloud est plus lente que la référence de 142 ms).
- **Éléments par tige entière** sur planche au DET 1 :

  | espèce | éléments |
  |---|---|
  | polyanthemos | 101 |
  | kruseana | 63 (feuilles en lots au DET 1) |
  | melaleuca | 157 |
  | leptospermum | 157 |
  | lophomyrtus | 198 |

  Pour comparer : cinerea 99, parvifolia 132, pittosporum 416, agonis 446.

## Doutes
- Le nom commercial « silver dollar » désigne aussi E. cinerea (déjà au catalogue). Ici, polyanthemos porte des feuilles adultes alternes pétiolées, pour le distinguer de la cinerea (paires sessiles).
- La planche des tailles de leptospermum par défaut (`cm` de la recette = 1) arrondit à 1 · 1 · 1 cm. Les vraies tailles se lisent avec `&cm=40,50,60`.
- Kruseana au DET 1 : l'ordre de dessin des feuilles en lots se fait par tranches de profondeur (10). La tige reste visible par endroits entre les « pages », ce qui est plausible.
- Lophomyrtus : les fleurs blanches estivales et les baies ne sont pas dessinées, car elles sont rares dans le commerce du feuillage coupé.
