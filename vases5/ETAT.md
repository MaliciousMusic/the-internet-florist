# État des vases à la pause (16 octobre 2026, ~14 h 45)

Le porteur a mis tout le chantier en pause. Rien n'est commité ni poussé.

## Chantiers (un dossier par vase, `RAPPORT.md` de chacun porte une section « État à la pause »)

| Vase | Réf. | Où il en est |
|---|---|---|
| prisme-jaune | 072 | Jugé « MAGNIFIQUE » ; passait le protocole de mesure sans changer l'aspect. |
| ginkgo | 114 | v5 (feuilles triangulaires, feuille tombante isolée, sans socle ni ombre portée) ; passage en copie exacte des feuilles commencé. |
| carpes-dorees | 014 | Version finie jugée bien ; recomposition en copie exacte des carpes en cours (état intermédiaire laid, normal). |
| coque-verte | 022 | Copie mesurée : ΔE 2,7, SSIM adoucie 0,94, IoU 0,968, arêtes 0,59 ; reste arêtes, grain, marche au pied, vue boutique. |
| torsade-turquoise | 087 | Copie mesurée : ΔE 4,2, SSIM adoucie 0,87, IoU 0,980, arêtes 0,75/0,78 ; reste ombres de la panse. |
| papillon-rose | 026 | Début : forme, fente, crosses justes ; couleurs et motif des ailes à faire. |
| coupes-empilees | 006 | Début : anneaux posés, verre encore opaque. |
| art-nouveau-vert, chauve-souris, dragon-turquoise | 080, 102, 020 | Pas lancés (photos et cartes de profondeur prêtes). |

## Outillage

- Protocole et seuils : [README.md](README.md) (copie fidèle mesurée, décision du porteur du 16 octobre).
- `depth.py` (Depth Anything V2 dans `.venv-depth`) : cartes calculées pour les 10 photos.
- `mesure.py` : `spectre`, `grain`, `cmp` (SSIM jugée sur images adoucies), `align`.
- `build_engine.py` → `app/v1j.js` + fiches dans `app/v0.js` (prisme, ginkgo, carpes ancienne version y sont).

## Moteur modifié, non commité

`app/v1d.js` (`vOutlineSvg`), `app/v1f.js` (`own`, verre clair `clear`), `app/v1i.js` et `verre/build_body.py` (`back`), `app/v1j.js`,
`app/v0.js`, `mkapp.sh`/`mkqa.sh`/`mkpl.sh` (v1j.js), `verre/shot.sh` (fichier HTML par appel), `.gitignore`.

## Question ouverte

Le porteur envisage de fournir un GLB texturé (Meshy) par vase : il servirait d'outil de mesure (profondeur, normales,
parties, vue boutique exacte), le produit reste du SVG. Proposé : un essai comparatif sur la coque dès réception de son GLB.

## Questions des chantiers en pause

- **coupes-empilees** (en pause, ΔE 13,5, SSIM adoucie 0,64, 140 Ko gzip) : (1) l'anneau du haut n'a pas d'alésage visible, un alésage de 1,8 cm de rayon a été ajouté pour la bouche ; (2) les stries internes du verre fait main ne sortent pas du modèle physique : faut-il un calque de stries relevé sur la photo pour tenir les seuils ?

## Reprise du 16 octobre (après-midi) : carpes refaites d'après le GLB Meshy

Le porteur a fourni `carpes-dorees/out/model.glb`. Chaîne nouvelle, sans projeter la photo sur le modèle :
1. `glbkit.py fit|maps` : pose du GLB calée sur la photo (rotation 53°, IoU 0,968), cartes photo et boutique (normales, positions, UV…).
2. `unwrap.py` : surface du vase déroulée (angle × hauteur, rayon du maillage) ; `segdecor.py` : score relief + agitation ;
   `samdecor.py` : détourage des carpes par SAM (`facebook/sam-vit-base`, téléchargé avec l'accord du porteur) sur la carte des
   pentes → `out/unwrap_decor.png`, relu par chaque vue.
3. `glbvase.py <vase> shop|photo` (+ `glbvase.json`) : éléments (panse tournée parfaite, décor, lèvre, intérieur), matières aux
   palettes mesurées dans des zones sûres de la photo, lumière de la boutique + studio + creux + ombres du relief, SVG en bandes
   par élément (`mode=bands`) ; fiche écrite ; `build_engine.py carpes-dorees` l'intègre.
   Réglage retenu : `ddy=7 dstep=1.6 dy=4 step=3 q=.1 rdp=.5` → 360 Ko gzip, ΔE(svg, champ) 2,4.
- Verdicts : les trous des nageoires sont corrigés par le détourage SAM ; la carpe centrale du déroulé est hors de la vue (ignorée).
- À faire : faire valider les carpes ; appliquer la même chaîne aux autres vases à partir de leurs GLB ; reprendre les chantiers en pause.
- **Prisme jaune publié (soir)** : version v1 validée (« MAGNIFIQUE »), générateur `prisme-jaune/mk_v1.py`, fiche `prisme-jaune`, verre clair.
- **Clos et publié (soir)** : vase `jarre-carpes` (svgb `carpes-dorees`), carpes en terre cuite comme la panse (matière `or` = `patine`), version retenue par le porteur. `fixdecor.py` (bouchage des encoches, calage des bords sur l'arête du relief par ligne de partage des eaux) a servi avant ce choix.

## 16 octobre (soir) : GLB des 15 vases, perce-neige (063) lancé

- Le porteur a déposé 15 GLB dans `Vases/` et leurs photos : appariement dans [GLB.md](GLB.md). La carpe est finie (porteur).
- **Règle du porteur** : le GLB donne la forme (et la pose), la photo placée par la pose donne la peinture. Ne jamais
  empiler le tracé de la photo et celui du GLB (texture Meshy, relief des normales) : un seul tracé du décor.
- `perce-neige/` (063, GLB Snowdrop) : pose IoU 0,980 ; chaîne `paint.py` (peinture depuis la photo sur le corps tourné
  déroulé) + `mk.py` ; SVG boutique 102 Ko gzip ; SVG/photo ΔE 6,2, SSIM 0,77, arêtes 0,79/0,80. Point d'étape montré au
  porteur, finition à faire (cernes en relief, lavis en dégradés, arches crème-pêche). Détails : `perce-neige/RAPPORT.md`.
- `glbkit.py fit <vase> lab` : rotation calée sur un décor peint (corrélation CIELAB) au lieu de l'or des carpes.

### Perce-neige (063) : retenu et prêt pour le catalogue (16 octobre, soir)

- Version retenue : la texture du GLB vectorisée par vtracer, éclairée par la boutique (glaçure, col brillant).
- Ombre portée vraie : `shadow.py`, et le moteur prend l'ombre fournie par un vase (`app/v1f.js`).
- Fiche `balustre-perce-neige`. Modules recopiés dans `demo/src`, démo reconstruite. 245 Ko gzip.
- Non commité, en attente de l'accord du porteur. Détails : `perce-neige/RAPPORT.md`.
- Leçon pour les vases suivants (porteur) :
  - quand le GLB a une texture, la reproduire à l'identique (vtracer), sans réinterpréter ;
  - la photo sert à poser la vue ;
  - ne jamais peindre les reflets du studio de la photo.
