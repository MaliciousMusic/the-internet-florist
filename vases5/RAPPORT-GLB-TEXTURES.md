# Sept vases refaits en SVG d'après leurs GLB texturés (16 octobre 2026)

Demande du porteur : refaire les vases en SVG fidèlement, dans l'angle de leur photo, la photo ne servant qu'à placer le GLB,
les textures refaites en SVG d'après celles des GLB. Exception : un vase « bien fait en verre, avec la transparence ».

## Appariement

| Dossier | Réf. | GLB | Matière |
|---|---|---|---|
| `chauve-souris/` | 102 | Midnight_Bat (texturé) | texture GLB |
| `dragon-turquoise/` | 020 | Turquoise_Dragon (texturé) | texture GLB |
| `papillon-rose/` | 026 | Butterfly_Bloom (texturé) | texture GLB |
| `calla-verte/` | 050 | Verdant_Calla (texturé) | texture GLB |
| `bambou-brun/` | 047 | Bamboo_Elegance (texturé) | texture GLB, pose sur la photo 047 de `Vases/` |
| `cristal-violet/` | 046 | Amethyst_Blossom (texturé) | **verre** : la texture donne la carte des gravures |
| `lys-mauves/` | 011 | Pink_Lily_Glass (`Vases/`, sans texture) | **verre** (pâte de verre) |

À confirmer par le porteur : la photo 2 (lys, 011) n'avait pas son GLB parmi les fichiers donnés, et le GLB « Bamboo » n'avait
pas sa photo. J'ai pris le GLB des lys dans `Vases/` et la photo 047 pour le bambou. Le vase « en verre » : j'ai traité les lys
**et** le cristal en verre. Rendu d'après la texture GLB, le cristal donnait un bloc violet opaque.

## Chaîne

1. `photomask.py` : silhouette de la photo par SAM (boîte autour du vase) ; retouches pour le reflet du cristal et l'ombre du dragon.
2. `posefit.py` : pose du GLB, par une recherche conjointe (Nelder-Mead) du tour, de la plongée, du roulis, de l'étirement, de
   l'échelle, de la perspective et de la position. Le score combine l'IoU des silhouettes et la corrélation du décor (CIELAB).
   IoU : 0,971 à 0,993.
3. `glbsvg.py` (vases peints) :
   - **Peinture** : la texture GLB vue par la caméra de la photo, suréchantillonnée, sans niveaux de mip. Les coutures de
     l'atlas sont bouchées par les sauts d'UV. La texture est vectorisée par vtracer, chaque aplat bordé de sa propre couleur.
   - **Lumière**, calculée sur les normales du GLB :
     - ombre douce avec occlusion ;
     - intérieur assombri (`inner`) ;
     - studio de boîtes à lumière réfléchi selon la rugosité de la carte MR ;
     - environnement aux angles rasants.
   - **Écriture** : couches emboîtées floues, découpées par la silhouette, dont les micro-fentes du GLB sont bouchées.
4. `verrelys.py` (verre) :
   - **Épaisseur** : faces avant et arrière du GLB.
   - **Transparence** : vrai masque SVG.
   - **Lys** : dégradé SVG mesuré le long de la hauteur (palette de la seule colonne centrale de la photo), plus ombre, lait
     et lueur en couches.
   - **Cristal** :
     - gravures dépolies tirées de la texture GLB ;
     - cavité modélisée à partir de la forme du GLB, réduite et arrondie ;
     - studio vu à travers le verre, par réfraction ;
     - teinte selon l'épaisseur ;
     - reflets nets.
5. `glbplanche.py` : planche référence | recouvrement des silhouettes | SVG rendu par Chrome | gros plan.
   Ensemble : `_apercu/vases6_v1.jpg`.

Réglages par vase : `<vase>/glbsvg.json` et `<vase>/verre.json`. SVG livrés : `<vase>/out/glbsvg_v1.svg`, au cadrage de la photo.

## Poids (cadrage photo, pleine définition)

chauve-souris 2,3 Mo gzip · dragon 1,0 Mo · papillon 0,39 Mo · calla 0,75 Mo · bambou 2,0 Mo · cristal 2,0 Mo (calcul à 2×) ·
lys 0,81 Mo. Le poids suit la définition : en vue boutique (vase de ~250 unités de haut au lieu de 600 à 2 400 px), il
baisse d'un facteur 5 à 20. Le budget de 120 Ko n'est pas encore tenu.

## Défauts connus

- Les textures Meshy sont moins riches que les photos : moucheté bleu de la chauve-souris, nervures argent du bambou. On
  reproduit la texture du GLB telle quelle, comme demandé. La carte de normales du GLB n'apportait que du bruit : elle est
  désactivée (`usenmap=1` pour l'essayer).
- Dragon : IoU 0,951 à 0,97. La perspective retenue est forte (caméra proche) ; en contraignant la distance, l'IoU tombait à 0,95-0,96.
- Papillon : la corne gauche du GLB est plus fine que sur la photo (forme Meshy).
- Cristal : la cavité est un ovale modélisé (le GLB est plein) et son fond reste un peu anguleux.

## Questions pour le porteur

1. Lequel des deux verres visais-tu (lys ou cristal) ? Les deux sont faits en verre ; je peux refaire l'autre d'après sa texture.
2. Faut-il passer ces vases en vue boutique (moteur, budget de poids) ou les garder en vues « photo » ?

## Suite du 16 octobre (soir) : bronze aux lys, vue boutique, bouquets

- Le porteur précise que le vase aux lys est en **bronze patiné**, comme son GLB. Il est rendu par `glbsvg.py` avec une seule
  matière (`base`) : la patine fonce dans les creux et s'éclaircit sur les reliefs, avec des reflets satinés dorés.
  Réglages dans `lys-mauves/glbsvg.json`, fiche `bronze-lys`.
- **Vue boutique** : `view=shop s=3` (glbsvg.py) et `vase=cristal-violet view=shop s=3` (verrelys.py). Même tour que la
  photo, œil à 9°, hauteur réelle (`hcm`). Les flous sont mis à l'échelle des unités boutique. Le module `glbsvg_shop.py`
  écrit `body.json` et `fiche.json`. Bouches relevées sur la vue boutique (`mh_u`, `mx_u`, `mo_u`).
- **Moteur** (atelier, rien de commité) : `build_engine.py` a ajouté les sept vases dans `app/v1j.js` (bouche et lèvre
  dessinées par le vase, `own`) et leurs fiches dans `app/v0.js`. Sauvegardes d'avant :
  `scratchpad/v0_before.js` et `v1j_before.js`.
  Fiches : `gres-chauve-souris`, `bouteille-dragon`, `porcelaine-papillon`, `calla-gres`, `bronze-bambous`, `bronze-lys`,
  `cristal-ginkgo`.
- **Bouquets modèles** (`lab/qa13.html?vbq=<n>&vase=<id>`) : 22, 26, 29, 30, 3, 0, 5. Planche :
  `_apercu/vases6_bouquets.jpg`.
- **Poids** : `v1j.js` pèse 12,7 Mo brut, et les corps des vases boutique de 0,22 à 0,94 Mo gzip. Il faudra les alléger
  avant de publier (budget de 120 Ko).

## Deuxième série (16 octobre, nuit) : six vases de plus

| Dossier | GLB | Fiche | Bouquet modèle |
|---|---|---|---|
| `jardiniere-cristaux/` | Smoky_Art_Nouveau_Lil | `jardiniere-cristaux` (**de face**, `front.py`) | 4 |
| `prismes-bronze/` | Geometric_Ascension | `prismes-bronze` | 17 |
| `narcisses-bronze/` | Bronze_Iris | `narcisses-bronze` (tour fixé à 348° : fleurs de face) | 6 |
| `coque-verte/` | Verdant_Spiral | `coque-verte` (remplace l'ancien chantier ; ancien GLB `model_ancien.glb`) | 37 |
| `gui-argent/` | Verdant_Vine | `gui-argent` | 13 |
| `feuilles-vertes/` | Verdant_Art_Nouveau_V | `feuilles-vertes` | 20 |

- **Poses** : IoU 0,954 à 0,992.
- **Correctif** : fuite de mémoire de `glbkit.Renderer.render` (texture et tampon de profondeur jamais libérés ; le calage avait
  atteint 5,4 Go). Les calages tournent désormais sous `scratchpad/ramguard.ps1`.
- **Planches** : `_apercu/vases7_v1.jpg` (référence | SVG) et `_apercu/vases7_bouquets.jpg` (moteur + bouquets).
- **Poids** : `v1j.js` fait 17,2 Mo pour 16 vases ; il reste à alléger.

## Troisième série (16 octobre, nuit) : trois vases calés sur des captures du visualiseur Meshy

| Dossier | GLB | Fiche | Bouquet modèle |
|---|---|---|---|
| `dragon-cloisonne/` | Dragon_Vase | `dragon-cloisonne` | 7 |
| `ronces-noires/` | Blackberry_Elegance | `ronces-noires` | 41 |
| `colonne-art-nouveau/` | Verdant_Art_Nouveau_V (n° 2) | `colonne-art-nouveau` (bouche à 0,93 de la hauteur) | 32 |

- **Poses** : IoU 0,961 à 0,991. Rendus photo calculés à 2× (`s=2`).
- **Correctif** : `glbsvg.py` cadrait trop petit les rendus photo calculés avec s ≠ 1.
- **Planches** : `_apercu/vases8_v1.jpg` et `_apercu/vases8_bouquets.jpg`.
- **Poids** : `v1j.js` fait 23,4 Mo pour 19 vases.
