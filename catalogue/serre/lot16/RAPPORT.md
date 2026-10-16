# Lot 16 — Protéacées (agent « proteas »)

## Fichiers
- **`ws/proteas/s16a.js`** : le lot, en un seul fichier (≈ 43 Ko). Il est construit par `src/mk.sh` à partir de `src/p1.js` (moteur commun du lot), `p2.js` (leucadendrons), `p3.js` (leucospermum) et `p4.js` (protées et registres). `src/zdbg.js` est un harnais de debug et de perf ; il est hors build.
- **`sheets/`** :
  - `<sid>_vues.png` : 9 vues × 3 stades, plante entière ;
  - `<sid>_vues_tetes.png` : les mêmes vues, cadrées sur la tête ;
  - `<sid>_coloris.png` : tous les coloris en 3/4, puis 3 tailles à l'échelle ;
  - `cartes_composer.png`, `bouquets.png` (8 bouquets composés), `modeles.png` (les 9 modèles qui utilisent ces espèces).
- **`qa/`** : les JSON de QA finaux (`qf_c5`, `qf_c11`, `qf_c23`, `qf_c37`, `qf_m1`) et de perf (`perf_final`, `perf_old_final`, `perf_new_final`). Les essais intermédiaires sont dans `tmp/`.
- **Moteur : aucun fichier modifié**, donc pas de diff. Tous les noms du lot sont préfixés (`prot…`, `leucad…`, `leucosp…`, `CW_PROT_…`, `CW_LEUCAD_…`). Le lot 24 déclare déjà `CW_PHY`.

## Ce que le lot apporte au moteur (dans `s16a.js`)
- **`protGrow`, la plante par le L-système** (`lsDerive` + `lsTurtle`) :
  - règles : `S → F(nu) A(n)` ; `A(n) → +ε F N(n) A(n−1)` ; `A(0) → F F(aim) K` ; `N(i) → [ /137,5°·i &α Lv ]`, plus parfois `[ /φ+180 &β Bn(m) ]` ; `Bn → F M Bn` ; `Bn(0) → F Kl` ;
  - tige ligneuse, feuilles coriaces en spirale serrée, rameaux feuillés terminés par une tête plus jeune (au plus le stade de la tige) ;
  - dans un bouquet, axes et feuilles vont dans `EXT` (la couche des tiges) et la plante garde au plus 40 % du chemin vers sa base ;
  - dans une carte (poignée), la tige ligneuse descend jusqu'au lien, effeuillée près de lui ;
  - tête posée sur la lèvre : seulement un pédoncule court.
- **`protAlong`** : la même plante le long d'une épine du Composer. Elle sert au rôle « foliage » d'un modèle (le modèle 47 met le leucadendron en feuillage) et renvoie `{k,bw,bc}`.
- **`protLeaf`** : une feuille 3D (`lsLeafS`) dessinée en une silhouette par face visible, avec sa nervure, en 2 à 3 éléments et sans dégradé. Options :
  - pétiole (protée royale) ;
  - apex arrondi à dents cornées (leucospermum) ;
  - pointe qui rougit en deux paliers (leucadendron) ;
  - marge panachée (Jester).
- **Têtes** :
  - `protLig` dessine les bractées : face et revers, ombrage partagé, base et pointe teintées, liseré, poils soyeux, frange et soies en gros plan ;
  - `protDome` : le dôme de fleurons en spirales, à pointe rosée, avec l'anneau de fleurons ouverts ;
  - `protCone` : cône femelle à écailles, ou capitule mâle ;
  - `protBody` / `protBodyR` : le réceptacle. Chaque bractée est posée sur lui (`r0 ≤` son rayon), donc rien ne flotte, même vu de chant.

## Espèces : botanique, coloris, tailles
### `leucadendron-rouges` (L. salignum × L. laureolum)
- **Morphologie** :
  - tige ligneuse rouge-brun, feuilles entières lancéolées-oblongues (≈ 7,5 × 2 cm) en spirale serrée, ascendantes, vert olive à marge rouge, qui rougissent vers le sommet ;
  - la « fleur » est une coupe en tulipe de 13 à 17 feuilles involucrales colorées, posées en spirale sur l'apex renflé, autour d'un cône femelle à écailles spiralées (2–3 cm), avec un reflet jaune à la base intérieure ;
  - stades : bouton = fuseau pointu, les feuilles externes enveloppant les internes ; mi-ouvert = tulipe ; ouvert = coupe étoilée, cône visible ;
  - tige ramifiée (62 %) : 1 à 3 têtes latérales feuillées.
- **Coloris** (7) : Rouge vin (Safari Sunset), Rouge bronze (Red Gem, cœur crème), Cramoisi (Red Devil), Framboise à feuillage pourpre (Burgundy Sunset), Bordeaux profond, Pourpre noir, Rouge à feuillage panaché crème (Jester).
- **Tailles** : tête de 6, 7, 8 ou 9 cm ; tiges de 50 à 80 cm.

### `leucadendron-jaunes-verts`
- **Morphologie** : même architecture. Inca Gold et Discolor sont des formes mâles (capitule de petites fleurs) ; Jubilee Crown et Pisa sont des formes femelles (cône).
- **Coloris** (7) : Jaune d'or liseré de rouge (Inca Gold), Jaune vif (Safari Goldstrike, tiges rouges), Crème à cœur rouge (Discolor), Vert à cône rubis (Jubilee Crown), Vert argenté à cônes argentés (Pisa), Vert anis, Jaune crème.
- **Tailles** : 5, 6, 7 ou 8 cm.

### `leucospermum` (L. cordifolium et hybrides)
- **Morphologie** :
  - tête en globe aplati de ≈ 120 fleurs (66 au détail de l'appli) sur un coussin de périanthes recourbés en rubans ;
  - styles longs (4,5–6 cm) qui jaillissent puis se courbent vers le sommet, terminés par le présentateur de pollen, un bouton plus sombre ;
  - les fleurs s'ouvrent de l'extérieur vers le centre : au stade mi-ouvert, le centre reste un bouquet de périanthes fermés ; le bouton est une boule feutrée gris-vert teintée ;
  - petites bractées grises dessous ;
  - feuilles ovales à base large (≈ 5,5 × 2,5 cm), gris-vert duveteuses, avec 3 à 5 dents cornées rouges à l'apex (les deux plus hautes sont entières) ;
  - parfois une tête latérale (35 %).
- **Coloris** (6) : Orange (Tango), Jaune d'or (High Gold), Orange rouge (Succession), Rouge écarlate (Scarlet Ribbon), Saumon, Jaune à rubans rouges (Veldfire). Veldfire est une forme bicolore ; la couleur d'un modèle ne tombe jamais dessus.
- **Tailles** : 8, 9, 10, 11 ou 12 cm.

### `protea-cynaroides` (protée royale)
- **Morphologie** :
  - coupe de bractées en trois rangs spiralés :
    - externes : courtes, larges, brunes et soyeuses ;
    - médianes ;
    - internes : longues, lancéolées-acuminées, roses à reflet argenté, poilues soyeuses au bord ;
  - écailles brunes imbriquées sous le réceptacle ;
  - dôme haut de fleurons soyeux en spirales, à pointe rosée, avec un anneau de styles quand la tête est ouverte ;
  - bouton en artichaut, mi-ouvert en gobelet ;
  - tige ligneuse épaisse rouge-brun, 4 à 6 feuilles ovales coriaces vert foncé luisant, marge rouge, sur long pétiole rouge ;
  - une seule tête.
- **Coloris** (7) : Rose argenté, Rose soutenu, Rouge (Red King), Blanc crème (Arctic Ice), Rose saumoné, Rose rouge à petite tête (Madiba, ×0,72), Rouge à cœur blanc à petite tête (Little Prince, ×0,6).
- **Tailles** : 14, 16, 18, 20, 22 ou 25 cm.

### `protea-hybrides`
- **Morphologie** :
  - gobelet allongé (longueur ≈ hauteur de coupe) de bractées spatulées imbriquées : externes courtes et brunâtres, appliquées ; internes longues ;
  - pointes « givrées » d'une frange de duvet argenté ; Niobe porte une barbe pourpre noir ;
  - dôme caché, visible une fois ouvert ;
  - feuilles étroites oblongues (≈ 10 × 2,4 cm), coriaces, gris-bleu, à marge rougeâtre, serrées le long de la tige ;
  - parfois un bouton latéral (18 %). La petite protée a des têtes multiples (60 %) et de petites feuilles.
- **Coloris** (7) : Rose givré (Pink Ice), Cerise (Sylvia), Crème à barbe pourpre (Niobe), Rouge (Cardinal), Rose crème (Susara), Rose framboise (Brenda), Petite protée vert crème (P. scolymocephala, ×0,42).
- **Tailles** : 8, 9, 10, 11 ou 12 cm.

### Registres
- `GH`, `CWS`, `SZG`.
- `GHI` :
  - leucadendrons : `cornet`, size 2, rk 0,9 ;
  - leucospermum : `sphere`, size 2,5 ;
  - protée royale : `disque`, size 3 ;
  - hybrides : `cornet`, size 2,5, rk 0,85.
- `GH_BUDS` : les 5 espèces.

## QA (build du workspace sur l'app du 04/10, 00 h 25 : lots 14, 17, 19 à 22, 24 et 27 compris)
- **Bouquets composés** avec `inc=` les 5 espèces, graines 5, 11, 23 et 37 × 20 = 80 bouquets : **0 F, 0 U, 0 kink**.
  - Une première passe avait trouvé 1 F (graine 23) : une feuille involucrale de leucadendron, vue de chant, flottait à côté de l'apex.
  - Correction : toutes les bractées sont désormais posées sur leur réceptacle (`protBodyR`).
- **Modèles** 26, 45, 46, 47, 50, 54, 57, 63 et 81 (`models_of.py`) : **0 F, 0 U, 0 kink**.
  - Le modèle 47 met le leucadendron en rôle feuillage, donc le long d'une épine.
  - Les couleurs de modèle tombent sur les formes courantes, jamais sur Veldfire ni sur les petites têtes.
- Captures regardées : `sheets/bouquets.png` (8 bouquets) et `sheets/modeles.png` (9 modèles).

## Perf (DET 1)
- **Par plante**, en mode bouquet, moyenne de 16 tirages (tête, têtes latérales comprises / tiges et feuilles dans `EXT`) :

  | Espèce | Tête | Tiges et feuilles |
  |---|---|---|
  | leucadendron rouges | 61 | 84 |
  | leucadendron jaunes | 60 | 80 |
  | leucospermum | 19 | 40 |
  | protée royale | 89 | 23 |
  | protées hybrides | 115 | 53 |

  - 0 dégradé propre : seuls les dégradés partagés `budFill` (un par couleur) et `floretShade` sont utilisés.
  - Les styles du leucospermum sont groupés par chemins (3 profondeurs × styles, boutons et reflets).
- **Sur les 9 modèles** (`perf=1`, même app, sans → avec le lot) :
  - 6 852 → 6 648 éléments par bouquet (−3 %) ;
  - 267 → 256 dégradés (−4 %) ;
  - 237 → 247 ms : dans le bruit, car d'autres rendus tournaient en parallèle.

## Ce qui reste douteux
- **Cartes.** Sous le lien de raphia, les tiges restent celles de `bunchArt` (`u1.js`, non modifié) : vertes et fines sous les tiges ligneuses. Il faudrait que `bunchArt` lise `ncols` et `nw` du `lsNeck`.
- **Noms.** « Vert anis », « Jaune crème », « Bordeaux profond », « Pourpre noir », « Saumon », « Rose soutenu » et « Rose saumoné » sont des coloris de commerce sans cultivar certain.
- **Protée royale.** Vu de profil, la tête ouverte reste une couronne assez ébouriffée. De loin, le dôme se lit comme une boule blanche.
- **Petite protée.** Vue de 3/4, la petite tête ouverte (scolymocephala) peut évoquer une petite marguerite.
