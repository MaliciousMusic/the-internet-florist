# Lot 49 « grands bulbes » — rapport (agent bulbes)

Fichier : `s49a.js`. Tous les noms globaux sont préfixés `l49` / `L49_`. Aucune copie moteur, aucun diff moteur.
Moteurs réutilisés : `lsTurtle`/`lsPlant`/`lsNeck`/`lsHeadS` (l0), `ligule` (s5a), `drawLig` (s7a), `spBud`/`spFrame`/`cwPick` (s8a), `spGrow`/`spLeafPart`/`spLeafUp` (r5a), `l41StemP` (s41a). Les ombelles suivent `umbelPlant` (r2a) et `cyrPlant` (s41a), le lis suit `lilyPlant` (r2a).
Dessins communs : `l49Trumpet` (6 tépales en ligules, gorge teintée, étamines déclinées, ovaire), `l49TBud` (bouton en massue côtelé), `l49Pet` (pétales avec gorge, pointes, bande, veines, liseré), `l49Leaf` (feuille lancéolée légère, 3 tracés).

## Espèces

**amaryllis-hippeastrum** (Hippeastrum hybrides). Hampe creuse épaisse (≈ 0,11 D) ; au sommet, une spathe à 2 valves et une ombelle de 3 à 4 grandes trompettes (4 dans la spathe fermée), tenues à l'horizontale et tournées en croix. 6 tépales soudés en une gorge courte, l'inférieur interne plus étroit ; 6 étamines déclinées et un style plus long au stigmate trilobé.
- Stades : bouton = spathe fermée et renflée ; mi-ouvert = spathe fendue, boutons rouge bronze dressés puis tournés vers l'extérieur, une fleur qui s'ouvre ; ouvert = 2 à 3 fleurs et 1 à 2 boutons.
- 13 coloris : Red Lion, Ferrari, Benfica (bordeaux), Mont Blanc, Apple Blossom (pointes et veines roses), Pink Surprise, Rilona, Terra Cotta Star, Minerva (étoile blanche), Picotee (liseré rouge), et les doubles Double Dragon, Alfresco et Dancing Queen.
- Tailles (Ø de fleur) : 14, 16, 17, 18 et 20 cm.

**amaryllis** (fiche « Printemps & bulbes »). Le catalogue la décrit comme « Hippeastrum hybrides », comme la fiche précédente : elle est donc faite en **Amaryllis belladonna**, la vraie amaryllis.
- Hampe pleine et nue, pourpre ; couronne de 6 à 8 trompettes roses parfumées à gorge pâle, tournées vers l'extérieur et un peu vers le haut ; boutons dressés au centre ; spathe en 2 valves qui pendent.
- 6 coloris : rose type, rose pâle, Johannesburg, × Amarygia magenta, Alba, Hathor.
- Tailles (envergure de l'ombelle, cm de la recette = 16) : 12, 14, 16, 16 et 18 cm. Les trompettes mesurent 0,58 × l'envergure, soit environ 9 cm.

**lis-longiflorum-trompette** (L. longiflorum et hybrides trompettes, div. VI). Tige raide garnie de nombreuses feuilles lancéolées éparses ; grappe de 1 à 3 longues trompettes (≈ 1 D) horizontales, aux tépales évasés et recourbés à la pointe, avec étamines à pollen jaune ; longs boutons vert blanc, les plus jeunes en haut.
- 7 coloris : White Heaven, White Fox, crème, African Queen, Golden Splendor, Pink Perfection, L. regale (revers pourpre).
- Tailles : 12, 13, 14, 15 et 17 cm.

**tubereuse** (Polianthes tuberosa). Épi sur tige (moteur `spGrow`, renvoie `{k,bw,bc}`) : 5 feuilles étroites engainantes qui raccourcissent vers le haut ; fleurs **par paires** avec une petite bractée, chacune formée d'un tube cireux légèrement courbe et d'une étoile à 6 lobes (2 à 3 rangs pour les doubles).
- Ouverture du bas vers le haut ; boutons fins rosés au sommet, verdissants à la pointe.
- 5 coloris : Mexican Single, The Pearl (double), crème ivoire, Pink Sapphire (double rosé), Sensation (boutons rosés).
- Tailles (longueur d'épi) : 18, 22, 25, 25 et 30 cm.

**pavot-islande** (Papaver nudicaule). Hampe nue et velue (frange de poils en un seul tracé derrière la tige, dans la couche des tiges) ; bouton velu penché au bout de sa crosse, qui se redresse en s'ouvrant (sépales fendus sur la couleur froissée).
- 4 pétales froissés en coupe (2 externes larges, 2 internes), avec une tache jaune à la base ; au centre, une couronne d'étamines jaunes et l'ovaire coiffé de son disque stigmatique rayonnant.
- 10 coloris : orange, jaune, blanc, rose, saumon, rouge, crème citron, abricot, corail, Champagne Bubbles (rose bordé crème).
- Tailles : 6, 7, 8, 8 et 9 cm.

Registres : `CWS`, `SZG`, `GHI` (amaryllis : étoile, taille 3 ; belladone : grappe ; lis : étoile ; tubéreuse : épi `k:'plant'` ; pavot : disque) et `GH_BUDS` pour les 5 espèces.

## QA
- Planches : 9 vues × 3 stades regardées, avec des zooms `fz` ; coloris et tailles. Livrables : `sheets/*_vues.png`, `sheets/*_coloris.png`, `cartes_composer.png` et `bouquets.png`.
- Corrections faites pendant la revue :
  - pointes des tépales en épine → pointe fine ;
  - étamines et gorge dessinées par-dessus la paroi du tube vu de 3/4 → ordre de dessin selon l'orientation ;
  - cœur du pavot visible de dos → ordre de dessin selon l'orientation ;
  - crosse du bouton de pavot trop serrée (kinks) → rayon ≥ 3 largeurs de tige.
- Bouquets composés `inc=` les 5 espèces, graines 5, 11 et 23 × 20 : **0 F, 0 U, 0 kink**. Deux captures de bouquets regardées.
- Modèles : aucun des 76 modèles n'utilise ces espèces (`models_of.py` → `ns=` vide). Contrôle de non-régression sur les modèles 1 à 10 : 0 F, 0 U, 0 kink.
- Perf (`perf=1`, 76 modèles) : 8 463 éléments par bouquet, identique à la base sans le lot ; 170 ms contre 165 ms sur la base, sur la même machine (bruit).
- Éléments SVG par tête à DET 1 (bouton / mi / ouvert) :
  - hippeastrum 36 / 68 / 108 ;
  - belladone 39 / 81 / 161 ;
  - lis 78 / 90 / 138 ;
  - pavot 63 / 73 / 76 ;
  - tubéreuse (épi entier) 113 / 140 / 148.

## Doutes
- La fiche `amaryllis` porte le nom latin « Hippeastrum hybrides » et des couleurs d'hippeastrum dans `k0.js`, que je ne peux pas modifier. Elle est dessinée en belladone, comme demandé. Si la propriétaire préfère deux fiches d'hippeastrum, il suffit de remplacer `l49Bel` par `l49Hip` dans le registre.
- La belladone ouverte compte environ 160 éléments, un peu au-dessus de la cible de 150, à cause de ses 6 à 8 trompettes.
- La tubéreuse est à l'échelle réelle : sur la planche entière, avec une tige de 75 cm, ses fleurs de 4 cm restent petites ; elles se lisent bien en zoom (`fz=0,.3`).
- Le lis trompette est fait par ligules, sans `sheet3` : son volume tient dans les silhouettes et la gorge, pas dans un modelé fin.
