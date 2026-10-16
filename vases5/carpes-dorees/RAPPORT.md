# Vase 014 : jarre en bronze aux carpes dorées (`carpes-dorees`)

## État à la pause (16 octobre)
- **Arrêt (reprise GLB, 16 octobre)** : mon passage au GLB était en chantier quand le coordinateur a repris la chaîne de zéro. Ce que j'avais commencé : `work/glb_maps.py`, `render_glb.py`, `vec_glb.py`, `mk_glb.py`, `work/fit_light_glb.py`. Un premier calage de la lumière sur le GLB était faux : ΔE 7,3 sur la patine, à cause d'ombres auto-portées de la panse ; je l'ai corrigé dans le code, mais le refit n'avait pas tourné. `out/body.json` et `out/fiche.json` sont ceux de la version précédente : je ne les ai pas modifiés depuis la pause.
- Où j'en suis : copie fidèle en cours. Les 5 carpes de la photo sont relevées (`traces.py`) et calées à travers le relief (`traces_fit.py`, contours à 1 px en moyenne, yeux < 1 px). La lumière et les couleurs sont mesurées sur la référence (`light_fit.json`), le réseau d'écailles est ajusté (`scales_fit.json`). Le dernier calage (relief de la carpe C abaissé, contours, yeux, lumière) s'est terminé après l'arrêt demandé ; aucune autre commande n'a été lancée.
- Derniers chiffres de `mesure.py cmp` (fin de ce calage) : IoU 0,982 ; ΔE2000 lissé 4,42 (ombre 3,92, demi-teinte 3,87, lumière 5,48) ; SSIM lissée 0,860 (brute 0,614) ; arêtes 0,64 / 0,61. Le calage précédent faisait mieux en couleur (ΔE lissé 4,20, lumière 5,28, SSIM lissée 0,868). La lumière n'a pas encore été recalée après le changement de relief : une passe `work/loop.sh iter` de plus devrait rattraper l'écart.
- Seuils encore manqués : ΔE lissé (≤ 4), zone lumière (≤ 5), arêtes (≥ 0,75) ; grain non mesuré. Atteints : IoU, SSIM lissée ; contours des carpes à moins de 0,75 % de la hauteur en moyenne, yeux à moins de 1 px de leur place mesurée.
- Fichiers clés : `mk.py`, `carp.py` (TracedCarp), `traces.py` / `traces_fit.py`, `light.py` + `light_fit.json`, `work/fit_outline.py`, `work/fit_eyes.py`, `work/fit_light.py`, `work/fit_scales.py`, `work/loop.sh` ; mesures dans `out/etude/` (`mesure_cmp.json`, `decor_check.json`).
- Prochaine étape : relire le résultat du calage en cours (`sh work/loop.sh iter`), mesurer le grain, rendre la vue boutique (poids ≤ 120 Ko), refaire la planche avec les chiffres (`work/shots.sh`), puis le rapport final.


16 octobre 2026. Chantier de `vases5/`, forme `lathe`, corps en SVG pur (`svgb: "carpes-dorees"`).

## Lecture de la référence et point de vue
- Bronze japonais, piste Meiji : jarre globulaire plus large que haute, épaule haute, col très court, lèvre roulée, petit pied
  en retrait. Patine lisse et brillante, brun chocolat à l'épaule, caramel orangé sur la panse.
- Carpes en haut-relief d'alliage doré, de l'or pâle au bronze sombre (une tête presque noire), écailles gravées en réseau,
  nageoires à rayons, yeux incrustés. Elles nagent en biais vers la droite et le bas ; deux sont coupées par la silhouette.
- Point de vue des carpes : **profil légèrement roulé vers le spectateur** (on voit le flanc, le haut du dos et la dorsale
  couchée le long du dos ; l'œil est sur le flanc, la bouche en bas de la tête). Pas une vue de dos comme la carpe du bronze.

## Mesures
- Silhouette relevée sur la photo et corrigée de la caméra : objectif décentré, œil à ~54 cm de haut et ~370 cm de l'axe
  (ellipses de la lèvre 0,077 et du pied 0,147). Profil ajusté par moindres carrés sur l'enveloppe des cercles inclinés :
  écart 2,9 px RMS (0,6 % de la hauteur), hors arrière de la lèvre et ombre du pied (`work/fitprof2.py`).
- Taille estimée : **26 cm de haut, 29,4 cm à la panse**, lèvre 13,9 cm, pied 14 cm. Source : bronzes Meiji aux carpes
  comparables : Oriental Treasure Box, vase globulaire 9 ½" × 9" (24 × 23 cm) ; BADA, vase signé Unsho, 32 × 18,5 cm (plus
  élancé). Notre jarre est plus large que haute (1,13), d'où 26 cm.
- Boutique : 253,5 unités de haut, bouche `mo` 56,6, lèvre roulée `lipw` 5,4.

## Le modèle (recréé, pas décalqué)
- `geom.py` : le tour (profil mesuré, nombres seuls), le plan méridien en distance signée, les texels de la surface.
- `carp.py` : **nos carpes**, construites sur l'anatomie de *Cyprinus carpio* : hauteur du corps ≈ 1/3 de la longueur
  standard, dos arqué derrière une tête courte et massive, museau bas, opercule en plaque saillante, œil en petite perle
  sertie (Ø ≈ 1/9 de la hauteur de tête), narine, bouche en bas, deux paires de barbillons, longue dorsale à épine, anale
  courte, caudale large et fourchue qui ondule, pectorales et pelviennes en lames posées sur le ventre ; écailles en tuiles
  (réseau en quinconce qui suit la courbure, pas qui rétrécit vers la queue), ligne latérale.
- Composition à nous : trois carpes entières en biais vers le bas, espacées (une nageoire nette par endroit), la queue de la
  carpe basse posée sur la carpe sombre (ombre portée de l'une sur l'autre) ; une carpe sombre à tête noire qui arrive par le bord gauche,
  une dorée qui repart derrière le bord droit ; le bas de la panse laissé en bronze nu.
- `light.py` : la lumière unique de la boutique ; rayons qui trouvent le relief (les carpes débordent de la silhouette),
  ombres douces portées par le relief, occlusion à deux échelles ; patine vernie (Fresnel, grande boîte à lumière en haut à
  gauche de la panse, plafond, sol sombre, contre-jour) ; alliage doré aux reflets teintés, creux brunis, points hauts polis ;
  nageoires qui laissent voir la patine vers leur bord libre.
- `vec.py` : bandes de ton découpées par partie (fond, nageoires arrière, corps, nageoires avant de chaque carpe) et adoucies,
  ombre du relief en voiles empilés, puis le trait : réseau d'écailles en chaînes de quadratiques (sillon sombre + liseré
  clair côté lumière, en 3 classes), rayons, opercule, bouche, barbillons, œil, contre-dépouille sombre le long des contours.

## Passes et défauts corrigés
- Champ seul (`render.preview`), carpe seule à plat (`work/fishsheet.py`), échantillonnage des couleurs ref/rendu, poids
  par couche.
- Corrigés : carpes en « sardines » (contours refaits deux fois), carpe sombre en requin, paquet confus en bas à droite,
  yeux de dessin animé (refaits en perles sombres), bouche en sourire et barbillons en « dents », nageoires noires en pointes,
  halos sombres d'occlusion sur la patine, patine brique uniforme (dégradé chocolat → caramel, poli), têtes bouchées dans
  l'ombre, marche à la jonction de la queue adoucie, poids de 178 à 112 Ko gzip.
- Finitions du 16 octobre (après) : têtes modelées (fente buccale basse sous une lèvre charnue, deux paires de barbillons à la
  lèvre et à la commissure, opercule en arc net avec l'ombre de son bord libre, joue, léger chanfrein du museau), marbrures des
  têtes supprimées (normales plus lissées, îlots de ton de moins de 22 px retirés), œil lissé (28 points), nageoires entre les
  carpes du haut et du milieu désempilées, carpe de droite reposée à mi-hauteur, droite, raccourcie régulièrement par la panse.

## Poids
- `out/body.json` : 388 Ko brut, **112 Ko gzip** (budget 120). 0 image.

## Défauts restants
- Les têtes vues en bas à droite (carpe du milieu) restent sombres : elles regardent le sol du studio.
- Le recouvrement entre la carpe du haut et celle du milieu a été retiré pour désempiler les nageoires ; il reste un seul
  recouvrement (carpe basse sur la carpe sombre).
- Pas encore vu dans le vrai moteur ni avec un bouquet (intégration hors de ce dossier) : la lèvre du moteur (`rolled`,
  couleur tirée de `col`) est à vérifier contre notre col.

## Décisions (réponses par défaut du coordinateur, sauf avis contraire du porteur)
- On garde la carpe coupée à droite (le banc continue), la tête sombre shakudō et la taille de 26 cm.

## Fichiers
- `mk.py photo|shop` (générateur), `geom.py`, `carp.py`, `light.py`, `render.py`, `vec.py`, `planche.py`, `shot.sh`.
- `out/body.json`, `out/fiche.json`, `out/planche.jpg`, `out/vase_shop.svg`, `out/vase_photo.svg` ; études privées
  dans `out/etude/` (dérivées de la photo, jamais publiées).
