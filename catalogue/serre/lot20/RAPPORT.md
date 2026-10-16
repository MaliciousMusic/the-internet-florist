# Lot 20 « baies » : rapport

Fichier : `s20a.js`. Copie moteur : `c5.js` (diff plus bas). Branche : `serre/20-baies`.

## Le moteur commun du lot
- **`bzShoot`** : l'axe principal suit l'épine du Composer (`o.spine`, à partir de `o.from`), ou se dresse dans la vue (planches, cartes) via `spAxis`. La fonction renvoie `{k,bw,bw1,bc}`, comme les épis de s8a.js.
- **`bzGrow`** : le L-système (`lsDerive`/`lsTurtle`) fait pousser les rameaux depuis les nœuds de cet axe : cymes, corymbes, panicules, pétioles, stolons. Il applique la phyllotaxie (137,5°, décussée ou alterne 2/5) et un tropisme (lumière pour les rameaux, gravité pour les pédicelles des fraises).
- **`bzFruit`** : la baie est un sphéroïde projeté exactement, avec une option œuf ou cône.
  - Elle est éclairée en haut à gauche par un dégradé radial partagé par couleur.
  - Son **reflet est net** : une ellipse blanche, placée au point où la normale vaut le demi-vecteur lumière–œil.
  - Au détail de l'appli (DET 1), les petites baies portent ce reflet dans leur propre remplissage : un seul élément SVG par baie.
  - Le sommet reçoit un « œil » (styles, stigmate, couronne de sépales) seulement s'il est tourné vers l'œil.
- **`bzBlade`** : la feuille 3D (`lsLeafS`) est pliée sur sa nervure. Chaque moitié est teintée selon sa propre orientation, ce qui donne du volume et aucune feuille plate de profil. Les dents de la marge sont exactes, les nervures latérales ou plissées apparaissent au détail planche, et les feuilles coriaces portent un trait de brillance.
- **Maturité** : `op` (bouton, mi-ouvert, ouvert) règle la maturité. Les baies d'une même tige ont des âges différents (`bzRipe` : vert, puis stade pâle, puis coloris).

## Les espèces
- **Millepertuis** (`hypericum`, Hypericum × inodorum). C'est la 5e espèce, choisie parce qu'elle est à égalité en tête des modèles avec le troène (1 modèle chacune, n°24 contre n°15) et qu'elle est de loin la baie la plus vendue du commerce : séries Magical, Flair et Coco.
  - Tiges rouge-brun, feuilles ovales sessiles en paires décussées.
  - Cyme terminale et cymes axillaires. Baies ovoïdes de 1 à 1,4 cm, avec 5 sépales étroits à la base et 3 styles persistants au sommet.
  - 7 coloris : rouge (Magical Red), rouge profond (Red Flame), chocolat (Coco), rose (Magical Beauty), pêche (Magical Pumpkin), ivoire (Magical Ivory), vert (Magical Greenfall).
  - Tailles : grappe de 5 à 8 cm, tiges de 50 à 70 cm.
- **Houx verticillé** (`houx-verticille-ilex`, Ilex verticillata).
  - Rameaux nus gris-brun avec 2 à 4 pousses latérales alternes et raides, parfois un éperon.
  - Baies rondes de 6 à 9 mm, 1 à 3 par nœud selon une phyllotaxie 2/5, serrées contre le bois, avec un point noir de stigmate.
  - Coloris : Winter Red, Berry Heavy (rouge orangé), Winter Gold (orange et saumon rosé), Berry Heavy Gold (jaune or).
  - Dans le Composer, c'est une ligne (`form:'ligne'`). Tailles : 40 à 70 cm de partie fructifère.
- **Skimmia** (`skimmia-japonica`).
  - Tige forte et rosette de 8 à 11 feuilles elliptiques coriaces et brillantes (8 à 11 cm), en spirale, sous une panicule conique dense.
  - Boutons ronds de 3 à 5 mm sur pédicelles rouges (ou verts pour Kew Green). Ils s'ouvrent en petites étoiles blanches à 4 pétales et anthères jaunes ; en « ouvert », environ un tiers des fleurs est ouvert, comme dans le commerce.
  - Le pied femelle porte une grappe de baies rondes rouges et brillantes (8 à 9 mm).
  - Coloris : Rubella, pourpre foncé, Magic Marlot (crème rosé), Kew Green, baies rouges. Tailles : panicule de 5 à 8 cm.
- **Rosier à cynorrhodons** (`rosier-a-cynorrhodons`, Rosa canina, R. rugosa).
  - Bois rouge-brun portant des aiguillons crochus, des feuilles pennées de 5 folioles dentées (dont certaines jaunissantes) et des corymbes de 2 à 4 cynorrhodons.
  - Cynorrhodons ovoïdes et brillants de 1,6 à 2,4 cm, avec un col sur le pédicelle et une couronne de 5 sépales séchés brun-noir, recourbés.
  - Coloris : rouge, rouge orangé, orange, bordeaux, vert (fruits verts). Tailles : 6 à 10 cm.
- **Fraisier des bois** (`fraisier-des-bois`, Fragaria vesca).
  - Hampe fine en cyme dichasiale. Le fruit le plus âgé est mûr et pend ; les suivants sont blancs puis verts ; les derniers sont en fleur (5 pétales ronds blancs, cœur jaune) ou en bouton.
  - Fraises coniques couvertes d'akènes, au calice étalé (10 pièces avec le calicule). Feuille trifoliée, grossièrement dentée et plissée, sur un long pétiole. Stolon rouge arqué, avec une petite plantule.
  - Coloris : rouge, vermillon (Mara des bois), blanc (White Soul), jaune pâle (Yellow Wonder), fruits verts et fleurs. Tailles : 6 à 10 cm.

## Le Composer
- `GHI` : `form:'baie'` et `k:'plant'`. Les espèces vont en remplissage ou en texture, et `isClu` les dessine le long de leur épine.
- Le houx a `form:'ligne'`, donc le rôle ligne, avec `tip:.95` et `fx`.
- Dans les modèles, les rôles `line`, `accent` et `drape` passent par `planModel` (dans le modèle 44, le fraisier en `drape` devient une ligne).
- Les cartes sont dessinées comme des bottes de tiges dressées (`k:'plant'`).

## QA et perf
- **Bouquets composés** avec `inc=` (les 5 espèces) : 3 graines × 20 (5, 11, 23). Résultat : **0 F, 0 U, 0 kink**. J'ai regardé deux captures de bouquets, dont `sheets/bouquets.png`.
- **Modèles concernés** (1, 15, 24, 26, 28, 42, 44, 53, 63), graines 7 et 23 : **0 F, 0 U, 0 kink**.
- **Perf** sur les 76 modèles, comparée sur la même machine à un workspace vide : 219 ms dans les deux cas (la machine cloud est plus lente que la référence de 142 ms), et **10 227 éléments contre 10 150** (+0,8 %).
- **Éléments par plante entière** en planche (DET 1, tige et feuilles comprises) : fraisier 134, millepertuis 196, cynorrhodons 241, skimmia 291, houx 309 (la ligne). Pour comparer, le delphinium compte 304. Dans un bouquet, le bas de la tige est coupé (`from`), ce qui en retire une partie.

## Diff moteur (c5.js)
La partie basse de la tige d'une grappe sur épine, du col jusqu'à `from`, prend désormais la couleur et la largeur que l'espèce renvoie (`bc`, `bw`, `bw1`). Le bois brun ne passe donc plus au vert à mi-tige. L'effet est nul pour toutes les autres espèces : seules les grappes `isClu` ont un `from`, et aucune espèce existante ne renvoyait `bw`.
```
-  if(rs&&rs.bw)o.sb={w:rs.bw,c:rs.bc}
+  if(rs&&rs.bw)o.sb={w:rs.bw,bw1:rs.bw1,c:rs.bc}
-  if(o.spine&&o.from){const st=stem3(L.stems,bseg(...),3.4,2.4,SC,12)
+  if(o.spine&&o.from){const sb=o.sb||{},st=stem3(L.stems,bseg(...),sb.bw1?sb.w:3.4,sb.bw1||2.4,sb.c||SC,12)
```

## Doutes
- **Stade intermédiaire** : pour le millepertuis et le cynorrhodon rouge, le passage du vert au rouge donne un ton brun olive. C'est fidèle au bronze réel, mais un peu terne sur la planche.
- **Stolon** : il part du bas de la hampe, alors qu'en réalité il part de la couronne. C'est un compromis pour une tige coupée.
- **Skimmia** : la taille du lot, les SZG, désigne le diamètre de la panicule. Les grandes tailles agrandissent aussi les feuilles.
- **Noms des coloris** : ils viennent des séries commerciales (Magical, Winter Red/Gold, Berry Heavy, Rubella, Kew Green, Magic Marlot). Les teintes exactes sont des estimations.
