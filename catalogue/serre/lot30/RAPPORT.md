# Lot 30 — remplissage fin 2 (agent remplissage2)

Fichier : `s30a.js` (préfixe `l30` / `L30_` / `CW_L30*`). Aucun module moteur modifié.
Réutilise `bzShoot`, `bzGrow` et `bzBlade` (lot 20), `spAxis` et `cwPick` (lot 8), `lsLeaf2D` (l0).

## Principe commun
Les tiges très ramifiées poussent par le L-système : `bzGrow` fait partir les rameaux de l'axe du Composer, `lsTurtle` dessine les dichasies, les rameaux et les pédicelles.
- Les axes fins, les aiguilles, les fleurettes et les boutons deviennent des items à leur profondeur. `l30Batch` les trie et les coupe en 4 à 9 tranches, avec un chemin par sorte (rameaux, ombre, base, reflet) : des centaines de fleurettes coûtent quelques dizaines d'éléments.
- Au détail planche, les fleurs « vraies » (fleur de cire, matricaire, tweedia) sont dessinées une par une (`l30Flowers`). Au détail de l'appli, elles sont regroupées par tranches.
- Les fleurs s'orientent dans le repère de la plante (`Fr` de l'axe) : en vue de dos, on voit leur revers, leur calice ou leur involucre.
- Les stades suivent `op` : les fleurs les plus âgées (fourches, bas des grappes) s'ouvrent en premier, et les boutons restent présents.

## Espèces
- **gypsophile** (*Gypsophila paniculata*)
  - Ce qui est fait : tige glauque à nœuds renflés, 2 paires de feuilles étroites décussées à 45°, panicule en dôme. Les rameaux sont opposés, puis se divisent en dichasies (4 à 5 niveaux, avec avortements). Les fleurettes doubles ont un contour festonné et un anneau intérieur au détail planche, et il reste des boutons verts.
  - Coloris : blanc Xlence (8–10 mm), blanc fin Million Star (fleurettes plus petites), rosé, et teintés rose, lilas, caramel, bleu ciel et arc-en-ciel (couleurs mêlées fleurette par fleurette).
  - Tailles : panicule de 30 à 50 cm.
- **waxflower** (*Chamelaucium uncinatum*)
  - Ce qui est fait : rameaux brun-rouge en spirale, aiguilles de 1,2 à 2,1 cm crochues au bout (en deux tons selon leur orientation). Les fleurs sont en grappes de 3 à 5 au bout des rameaux, avec quelques fleurs axillaires. Chacune a 5 pétales ronds en coupe et un hypanthe dont le disque passe du vert-jaune au bordeaux avec l'âge, entouré d'un anneau d'étamines. Les boutons sont des perles rondes ; 'Dancing Queen' est double.
  - Coloris : Snow Flakes, Blondie (bouton pourpre, fleur crème), Esperance Pearl, Lady Stephanie, Dancing Queen, mauve lilas, Purple Pride.
  - Tailles : 20 à 35 cm.
- **solidago** (*Solidago canadensis* et hybrides, × *Solidaster*)
  - Ce qui est fait : tige feuillue dont les feuilles lancéolées dentées diminuent vers le haut. La panicule est pyramidale ; ses rameaux montent puis s'arquent par gravitropisme, penchés d'un côté. Les capitules (3–5 mm) se serrent sur leur face supérieure, plus jeunes vers la pointe, du vert au jaune or. Quelques bractées foliacées.
  - Coloris : Tara, Golden Glory, Solidaster Lemore (citron pâle), Strahlenkrone (or foncé), teinté orange.
  - Tailles : 20 à 30 cm.
- **matricaire** (*Tanacetum parthenium*)
  - Ce qui est fait : feuilles pennatifides vert tendre, à lobes dentés. Le corymbe est fait de pédoncules qui se rejoignent à niveau, certains fourchus. Les capitules mesurent environ 1,7 cm : 13 ligules blanches autour d'un disque jaune en dôme pour les simples, ou un pompon de 3 couronnes de ligules pour les doubles. Les boutons sont verts et blanchissent ; l'involucre vert se voit de dos.
  - Coloris : Vegmo Single, Tetra White (double), crème double (Magic Snowball), Magic Lime Green (double vert anis), Golden Ball (pompon jaune).
  - Tailles : 12 à 18 cm.
- **tweedia** (*Oxypetalum caeruleum*)
  - Ce qui est fait : tige duveteuse gris-vert, feuilles opposées oblongues à base cordée (`L30_CORD`), décussées à 45°. Des cymes de 2 à 3 fleurs sortent des 4 aisselles supérieures. Les fleurs mesurent 2,4 cm, avec 5 pétales épais oblongs bleu poudré, une couronne de 5 écailles bleu cobalt et une colonne pâle. Les fleurs âgées virent au lilas ; les boutons sont pointus et rosés.
  - Coloris : Blue Star, Heaven Blue, Little Blue Star, lilas (fleurs mûres), Alba, Rosea.
  - Tailles : 12 à 18 cm.

GHI : `k:'plant'`, forme `grappe`. `rk` vaut 0,45 (1,1 pour tweedia) afin de garder les rayons du Composer d'avant.

## QA
- **Bouquets composés** avec `inc=` les 5 espèces, graines 5, 11 et 23 × 20 : 0 F, 0 U, 0 kink.
- **Modèles** 24, 27, 50 et 81 (ceux qui utilisent ces espèces) : 0 F, 0 U, 0 kink.
- **Éléments par tige** au détail de l'appli (12 tiges sur épine), moyenne / max :
  - gypsophile : 69 / 124
  - waxflower : 76 / 87
  - solidago : 88 / 100
  - matricaire : 63 / 65
  - tweedia : 95 / 99
- **Perf** (`perf=1`, 76 modèles, même machine cloud) : 195 ms et 9 496 éléments par bouquet, contre 194 ms et 9 593 sans le lot. La perf est neutre : cette machine est plus lente que la référence de 142 ms.

## Doutes
- Le gypsophile blanc (et Million Star) sur fond crème est peu contrasté sur les planches : c'est fidèle, mais discret.
- Le markup est lourd pour solidago (environ 130 Ko par tige) et gypsophile (environ 73 Ko), à cause du nombre de capitules et de fleurettes, mais le nombre d'éléments et le temps restent bons.
- Noms commerciaux : « Magic Snowball » (crème double) et les noms de tweedia (Heaven Blue, Little Blue Star) sont moins sûrs que Vegmo, Golden Ball, Purple Pride, Dancing Queen, Lady Stephanie et Blondie (vérifiés).
- Une feuille vue exactement de bout (planche, vue profil) reste une petite amande.
