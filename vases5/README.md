# Les cinq vases du 16 octobre 2026

Le porteur a demandé de concevoir cinq vases « avec le même protocole et soin que pour le vase poisson et le vase Lalique ».
Il a donné une photo pour chacun. Un chantier = un dossier ; chaque photo est dans `<dossier>/out/ref.jpg`, privée et ignorée par git.

| Dossier | Réf. `Vases/` | Vase | Forme dans le moteur |
|---|---|---|---|
| `coque-verte/` | 022 | Céramique mate vert sauge, disque dressé et coque enroulée devant | `outline` + `back` |
| `carpes-dorees/` | 014 | Bronze globulaire patiné brun-orangé, carpes dorées en relief | `lathe` |
| `torsade-turquoise/` | 087 | Verre turquoise en torsade montante, pied sombre | `outline` |
| `ginkgo/` | 114 | Grès brun ovoïde, feuilles de ginkgo jaunes émaillées en relief, **sans le socle en bois** | `lathe` |
| `prisme-jaune/` | 072 | Verre jaune citrine taillé en prisme biseauté, cavité en goutte suspendue | `outline` |

## Ce que le porteur attend

Le niveau : [docs/STANDARD-RENDU.md](../docs/STANDARD-RENDU.md), sections 1 et 2. Les dix étapes s'appliquent toutes : lire, mesurer,
tracer, modéliser la forme, calculer la lumière, comparer, diagnostiquer par passes isolées, optimiser, intégrer, faire juger.

Ses verdicts sur les deux vases de référence :
- **Carpe en bronze** : le niveau. Matière lisible à 1:1, relief, ombres portées par les reliefs, aucun artefact. Leçon : établir
  le point de vue avant de modeler (la carpe était vue de dos).
- **Danseuses en verre** (`../verre/`, `../demo/lab/verre/LISEZMOI.md`) :
  - refusé : un relief mesuré sur l'ombrage de la photo et des couleurs calibrées sur elle. « En essayant de reproduire tous
    les recoins et en se fiant aux couleurs, le rendu d'ensemble est moins bon. »
  - retenu : **une recréation qui isole les formes, comprend la structure et la retranscrit intelligemment**. Un modèle
    propre (orientation, profondeur, parties nettes), la lumière de la boutique calculée dessus, écrit en courbes.
  - critiques à ne pas refaire : rendu « plâtre » au lieu de verre ; figures trop lourdes ; manque de transparence ;
    bords flottants ; trop ou trop peu de bleu.

### Décision du porteur, 16 octobre 2026 (après les premières planches) : des copies parfaites, mesurées

> « Je ne peux pas me permettre d'approximation, je veux des copies parfaites : texture, lumière, transparence, matières. Tu dois
> passer par des mesures précises, l'analyse des depth maps, la spectrographie. »

Cette décision remplace la consigne de recréation ci-dessus. On **copie la référence** : la forme, le décor (chaque carpe,
chaque feuille, chaque papillon à sa place, dans sa pose et à sa taille), les couleurs, la texture, la lumière et la
transparence. La leçon des danseuses tient toujours : on copie en **comprenant** la structure (formes isolées, modèle
propre), jamais en décalquant les pixels de la photo. Les dix dossiers sont classés « Unsafe » dans l'étude `Vases/` ; la
copie fidèle est le choix du porteur, à rappeler dans chaque rapport.

### Le protocole de mesure, obligatoire pour chaque vase

1. **Cartes de profondeur et de normales** (modèle local Depth Anything V2, choisi par le porteur) : `out/depth.npy`,
   `out/depth16.png`, `out/normal.png`, `out/depth_viz.jpg` sont déjà calculés pour chaque photo
   (`.venv-depth/Scripts/python depth.py <vase> [--k 160]` pour refaire ; `--k` règle la raideur des normales). Ce sont des
   guides : la profondeur est relative (à une transformation affine près). Cale-la sur la géométrie mesurée (silhouette,
   ellipses du col et du pied, appareil photo) avant de t'en servir pour le relief, les creux, l'épaisseur du verre et les
   normales des décors.
2. **Mesures de forme** : silhouette au sous-pixel, appareil photo (focale, hauteur de l'œil, plongée) ajusté sur les ellipses,
   profil ou contour, position et taille de chaque élément du décor relevées sur la photo (points, angles, longueurs).
3. **Spectrographie des couleurs** : `python mesure.py spectre <img> [masque]` donne les statistiques CIELAB (percentiles de L,
   a et b médians, histogrammes, grille 8 × 8) de la référence, région par région (passe tes propres masques : corps, décor,
   lèvre, ombre, reflets). Les couleurs du rendu se calent sur ces cibles, matière par matière (albédo, demi-teinte, ombre,
   reflets spéculaires).
4. **Texture** : `python mesure.py grain <ref> <rendu> x0 y0 x1 y1 [boîte du rendu]` compare le spectre de puissance radial du
   grain fin (et son contraste) dans une même zone. Le grain SVG se règle jusqu'à ce que les deux spectres se superposent.
5. **Comparaison chiffrée** au cadrage de la photo : `python mesure.py cmp <ref> <rendu> --mask <masque> --out out/` écrit
   `mesure_cmp.jpg` (référence | rendu | carte des ΔE2000 | silhouettes | arêtes) et `mesure_cmp.json`.

**Seuils de réception** (au cadrage de la photo, masque du vase) :
- silhouette : IoU ≥ 0,97 ;
- couleur : ΔE2000 moyen (image adoucie de 2 px) ≤ 4, et ≤ 5 dans chacune des zones ombre, demi-teinte, lumière ;
- structure : SSIM ≥ 0,80 sur les images adoucies de 2 px (`ssim_lisse`) ; la SSIM brute est notée sans seuil, car un grain
  calé par son spectre (non copié pixel par pixel) la fait baisser ; arêtes : précision et rappel ≥ 0,75 ;
- grain : écart log moyen des spectres ≤ 0,15 ;
- décor : chaque élément (carpe, feuille, papillon…) à moins de 1 % de la hauteur du vase de sa place sur la photo.

Chaque planche porte ces chiffres. Un vase qui ne les atteint pas n'est pas livré : on diagnostique par passes isolées
(forme seule, lumière seule, couleur seule, grain seul) et on corrige la cause.

## Technique : que du SVG

- Sortie : chemins, dégradés, masques, découpes, filtres SVG (flou, `feTurbulence` pour un grain de matière). Aucune image
  incorporée, aucun maillage 3D rendu.
- Permis comme outil de calcul : un modèle géométrique (profil tourné, champ de hauteur, surfaces analytiques) évalué par pixel
  pour obtenir normales, profondeurs et masques, puis la lumière de la boutique. Seules des courbes sortent : bandes de ton
  (iso-lignes du champ éclairé) découpées par partie et adoucies d'un petit flou, contours nets. C'est la méthode validée des
  danseuses (`../verre/mk2.py`).
- Kit commun : [svgkit.py](svgkit.py) (constantes de la boutique, `contour_paths`, `bands`, `poly_mask`, `write_body`).

## Conventions de la boutique

- `UPC = 9,75` unités par cm (vases à 1,5 fois leur taille de catalogue face aux fleurs). Axe `VX = 500`, le pied posé sur
  `FL = 990`.
- Vue de la boutique : orthographique ; un cercle horizontal de rayon r devient une ellipse r × 0,16 r (œil ~9° au-dessus).
- Lumière unique : `L3 = (-0,5 ; -0,62 ; 0,6)` normalisé, repère écran (x à droite, y vers le bas, z vers l'œil). Reflets d'un
  studio cohérent : grande boîte à lumière en haut à gauche, sol sombre, plafond clair, léger contre-jour.
- Fond de la boutique : un ton clair uni ; le vase pose sur un socle que le moteur dessine (ombre portée aplatie comprise).
  Ne dessine ni fond, ni sol, ni ombre portée au sol.
- Le bouquet : les tiges entrent par la bouche (centre `VX + mx`, hauteur `mh`, demi-largeur `mo`). Ce qui est **derrière** le
  bouquet (une paroi qui monte plus haut que la bouche, le bord arrière d'une ouverture) va dans `back` ; le reste dans `body`.
  Dans un verre, les tiges se voient à travers : fournir `inner` (chemin de la cavité, coordonnées boutique) et `cavb` (bas
  de la cavité).

## Ce que livre chaque chantier

Dans `<dossier>/` :
1. `mk.py` : le générateur (code et commentaires en anglais). `python mk.py photo` rend dans le cadrage de la référence (pour
   comparer), `python mk.py shop` dans la vue de la boutique.
2. `out/body.json` (par `svgkit.write_body`) et `out/fiche.json` : la fiche du catalogue, sur le modèle de `verre-danseuses`
   ou d'une fiche `outline` de `../app/v0.js` (`id`, `n`, `m`, `fam`, `shape`, `mat`, `col`, `col2`, `lip`, `lipw`, `why`,
   `prof` ou `ol`, `h`, `mo`, `mx`, `mh`, `svgb`). Les nombres en unités boutique.
3. `out/planche.jpg` : référence | notre rendu au même cadrage | vue boutique, puis gros plans à 1:1 et 300 %.
4. `RAPPORT.md` (en français, court) : lecture de la référence et point de vue, mesures (taille réelle estimée et sa
   source), choix du modèle, mesures de réception (les chiffres de `mesure.py`), passes isolées et défauts corrigés, poids (brut et gzip),
   questions pour le porteur.

Budget : 120 Ko gzip au plus pour `body.json` (les danseuses : 110 Ko).

## Règles de travail

- Ne touche qu'à ton dossier. Pas `../app/`, `../demo/`, `../verre/`, ni les autres vases : l'intégration au moteur se fait
  ensuite, d'un seul tenant. Aucune opération git.
- **PC fragile** : lance chaque calcul lourd et chaque rendu Chrome à travers le verrou, `sh ../ws/gate.sh <commande>` (il
  attend un créneau et plus de 3,8 Go de RAM libre). Images de travail de 1600 px au plus. Un seul calcul à la fois.
- Rendu d'un SVG : `sh ../verre/shot.sh <svg> <png> [L H]` (Chrome headless, déjà sous verrou). Aperçu sans navigateur :
  écrire le champ de couleur calculé en PNG.
- Python : `python` (numpy, opencv, scikit-image). Jamais le port 8766.
- La photo de référence ne sort jamais de `out/`, et le générateur ne contient que des nombres.

## Deuxième série (demandée le 16 octobre, à lancer après la première)

| Dossier | Réf. `Vases/` | Vase |
|---|---|---|
| `papillon-rose/` | 026 | Porcelaine crème à deux pointes recourbées, papillon orangé en relief |
| `coupes-empilees/` | 006 | Quatre anneaux de verre massif empilés et décalés (ambre, orange, rose, jaune-vert) |
| `art-nouveau-vert/` | 080 | Grand vase Art nouveau en grès à cristallisations vert-gris, anses ajourées, volutes |
| `chauve-souris/` | 102 | Grès vert peint, chauve-souris sculptée aux ailes déployées sur le col |
| `dragon-turquoise/` | 020 | Bouteille bleu-noir côtelée, dragon turquoise enroulé autour du col |
