# Vase en verre torsadé turquoise (réf. 087) — rapport

## État à la pause (16 octobre 2026)

- **Où j'en suis** : la copie mesurée (v4) est en place, conformément à la décision du porteur. Le vase est isolé
  (`seg.py`), les plis sont tracés (`trace.py`, 180 lignes), et la matière est inversée en épaisseur, dépoli et lumière,
  lissés à 2,5 px (`photo_model.py`). Les courbes sont écrites en SVG avec des régions par chroma (`mk.py`). Les mesures
  passent par `cmp_svg.py`, qui rend le SVG lui-même sur fond noir et sur fond blanc dans Chrome.
- **Derniers chiffres** (`ck=.25 dop=.65 lop=.6`) :
  - IoU 0,980 ; SSIM adoucie 0,866 ; arêtes 0,754 / 0,781 ;
  - **ΔE2000 adouci 4,24 (> 4)**, avec par zone : ombre 4,9, demi-teinte 4,1, lumière 3,7 ;
  - grain : écart log 0,24 au col et 0,63 sur la panse, **hors seuil** (0,15).
- **Les trois variantes du dernier test** (ΔE adouci, SSIM adoucie, arêtes précision / rappel) :
  - `ck=.25 dop=.65 lop=.6` : 4,24 ; 0,866 ; 0,754 / 0,781 ;
  - **`ck=.4 dop=.65 lop=.6`, la meilleure** : 4,21 ; 0,867 ; 0,766 / 0,784 ;
  - `ck=.25 dop=.75 lop=.5` : 4,25 ; 0,861 ; 0,764 / 0,746.
  - `out/mk_photo.svg` est celui de la 3e variante.
- **Fichiers clés** :
  - `mk.py`, `photo_model.py`, `trace.py`, `traces.json`, `seg.py`, `cmp_svg.py`, `planche.py` ;
  - `out/mesure_cmp.json`, `out/planche.jpg` ;
  - `out/body.json` à 119,6 Ko gzip. Il date de la passe précédente (`ck=0`) : à régénérer avec les réglages retenus.
- **Prochaine étape** :
  - fixer les réglages par défaut (`ck`, `dop`, `lop`) ;
  - ramener le ΔE sous 4 : les ombres sont trop claires (dL +2,7) et les lumières trop sombres (−2,5) ;
  - travailler le grain fin de la panse et du col ;
  - régénérer la vue boutique, la planche (avec `ssim_lisse`) et ce rapport. Le reste de ce rapport décrit la v3 et
    est à réécrire.

16 octobre 2026. Planche : `out/planche.jpg`. Fichiers moteur : `out/body.json`, `out/fiche.json` (`id` `verre-torsade-turquoise`,
`shape` `outline`, `mat` `glass`, `svgb` `torsade`).

## Lecture de la référence et point de vue

- Image très probablement de synthèse : la paroi n'a ni bouche lisible ni fond plausible. On garde la structure et les
  proportions, et on refait la torsade, la bouche et le haut.
- Vue presque de face, l'appareil à peu près à mi-hauteur. Le vase se lit comme une seule paroi soufflée :
  - un grand S qui penche à droite en bas, puis à gauche en haut ;
  - une panse basse en toupie, à fond conique bleu nuit ;
  - un col fin, tordu en plis côtelés en hélice, plats sur la panse et raides dans le col ;
  - des bords libres seulement en haut.
- Les branches et les fleurs ne sont pas dessinées.

## Mesures

- **Silhouette** : relevée sur la photo par segmentation teinte et chroma, avec 10,75 px par cm.
  - Centre et demi-largeur relevés tous les 20 px, puis ramenés perpendiculairement à l'axe penché.
  - Le centre se décale de +1,7 cm à 14 cm de hauteur et de −6,5 cm à 31 cm.
  - La panse mesure 17 cm de large à 9 cm de hauteur, soit 37 % de la hauteur. Le pied mesure 5,4 cm.
  - Pour éviter une marche, la panse est adoucie : le lobe bas du S est réduit de 2,4 à 1,7 cm.
- **Taille réelle estimée** : 45 cm au sommet de la voile principale, avec la bouche à 42 cm.
  - Il n'existe pas d'objet réel. L'estimation vient des fleurs de la photo (orchidées de 5,5 à 8,5 cm, d'où un vase
    de 37 à 57 cm) et de l'usage des vases sculptures soufflés (35 à 50 cm).
  - En boutique, à 9,75 unités par cm : h 439, bouche à mh 409,5, mx −31, mo 28.

## Modèle (recréation, pas de calque)

Fichiers : `model.py` pour la forme, `render.py` pour la lumière, `mk.py` pour les courbes SVG.

Troisième version, après les retours du porteur.

- **Corps** : un tube creux soufflé autour de l'épine en S mesurée (lobe bas +2,4 cm, lobe haut −6,5 cm).
  - La panse est une toupie lisse et tendue, au maximum à 7,5 cm de hauteur, avec une longue épaule en diagonale.
  - Les côtes sont fines, régulières et parallèles, en spirale vers la gauche ; les 4 plis n'apparaissent qu'au-dessus de 13 cm.
  - Le haut se termine en languettes basses à bord roulé fin.
- **Voiles (élément principal)** : 3 voiles minces (0,16 à 0,32 cm). Chacune :
  - part de la panse en bas à droite et monte en hélice vers la gauche autour du col (0,95, 0,8 et 0,6 tour) ;
  - naît de la paroi le long d'un pli naturel, car seule la partie hors de la paroi existe ;
  - a un bord libre qui se décolle, ondule et se retourne, avec un bourrelet fin qui porte le fil clair ;
  - est plus claire et un peu plus dépolie que le corps, et dépasse le contour du tube des deux côtés.
- **Verre** :
  - le turquoise ne fonce qu'avec l'épaisseur traversée (Beer-Lambert), le pied est bleu nuit, et le fond plein est
    rendu par sa corde ;
  - dépoli léger, un peu plus laiteux en haut ;
  - le dos et l'intérieur se voient à travers, adoucis par le dépoli ;
  - Fresnel, reflets fins du studio, fil clair aux bords rasants.
- **SVG** :
  - champ suréchantillonné ×2 et découpé en régions de couches superposées ;
  - bandes de ton en clarté gamma ;
  - couche de détails nets (filets clairs et sombres) ;
  - transparence par un masque en bandes de gris, sur le corps comme sur `back`.

## Passes isolées et défauts corrigés

- **Coutures fines entre régions** : les régions étaient tracées au trait, et une ancienne option de trait était restée
  active. Les régions se recouvrent maintenant de 2 px, sous une découpe de silhouette exacte.
- **Liseré sombre au bord des régions** : il venait du pixel de bord antialiasé. Les couleurs sont désormais prises dans
  la région érodée, puis prolongées.
- **Pointillés en escalier** sur les bords des couches : corrigés par le suréchantillonnage.
- **Rayures parasites** : les côtes trop fines étaient sous-échantillonnées. Amplitude et nombre réduits.
- **Plaques rectangulaires** : elles venaient des bases droites des anciens voiles, supprimés.
- **Bourrelet horizontal de la panse** : il venait de la transition givré/clair à hauteur fixe et d'une épaule trop
  brusque. La transition suit désormais la spirale et l'épaule est adoucie.
- **Ellipse claire du fond** : c'était l'interface sous le fond plein. Le fond de la cavité est maintenant en cuvette et
  fondu.
- **Halo de silhouette** : le flou du masque débordait. Le masque est désormais dilaté sous la découpe nette.
- **Languette blanche opaque sur fond sombre** : `back` était opaque. Il est désormais masqué comme le reste.

## Poids

`body.json` pèse 300,7 Ko bruts et **100,2 Ko en gzip**, pour un budget de 120 Ko : 37 régions, 453 bandes, plus la couche
de détails et le masque. Les bandes sont espacées de 12 et les coordonnées arrondies à 0,2 unité pour tenir le budget.

## Contrôles

- Rendus Chrome sous verrou, sur fond clair et sur fond sombre.
- Essai avec tiges : `test_bq.py` imite l'ordre du moteur (dos, tiges dans `inner` floutées, corps, tiges au-dessus).
- Non fait : l'intégration au vrai moteur (`vOutline` ne lit pas encore `svgb`) et la QA de la boutique.

## Défauts restants

- La panse reste un peu molle par endroits, avec une tache de reflet atténuée mais présente.
- À droite de la panse, une voile ressort en aileron.
- La transition vers le pied bleu nuit est assez nette.
- Le col est plus étroit que sur la référence dans le cadrage photo.
- À 300 %, les bandes sont lisibles comme des à-plats doux. Il n'y a ni marche ni couture visibles.

## Décisions du porteur

- Les tiges restent droites, coupées par `inner`. `cavs` est fourni pour l'intégration.
- Un peu plus de laiteux en haut : appliqué (dépoli de 0,5 au sommet).

## Questions pour le porteur

1. Le compose de bouquets doit-il tenir compte du décalage de la bouche, à 6 cm à gauche du pied dans la vue boutique
   (`mx` −31) ?
