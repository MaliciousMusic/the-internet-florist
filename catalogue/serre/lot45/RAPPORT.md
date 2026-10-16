# Lot 45 « verdures et matières » — rapport

Branche `serre/45-verdures`. Fichier du lot : `s45a.js` (préfixe `l45` / `L45_`). Copie moteur : `c4.js` (diff plus bas).
Contrat des feuillages repris des lots 15, 24 et 35 : `fgAxis` + `fgGrow` (L-système), `g35Leaf` / `f15Blade` pour les limbes,
`g35Lim` (rien sous la lèvre du vase), `g35Run` (même plante sous toutes les vues), et un retour `{k,bw,bw1,bc,neck,nd}`. Le troène passe par le moteur des baies du lot 20 (`bzShoot`, `bzGrow`, `bzFruit`, `bzBlade`).

## Espèces

### mousses-fraiches (tête basse, posée sur la lèvre)
- **Botanique.** On trouve trois mousses chez les fleuristes :
  - le coussinet *Leucobryum glaucum* (bun moss), en dômes denses vert vif à vert glauque ;
  - la mousse plate *Hypnum cupressiforme* (sheet moss), un tapis de rameaux plumeux ;
  - la mood moss *Dicranum scoparium*, en touffes de feuilles en faucille toutes peignées dans le même sens.
  
  On les vend levées avec leur feutre brun de rhizoïdes et de terre.
- **Dessin.** Dans le repère du coussin :
  - un feutre brun en prisme mince (anneau du haut, anneau du bas et la bande entre les deux, en un seul tracé) ;
  - au-dessus, 5 à 9 dômes, chacun avec sa silhouette exacte (le contour d'un sphéroïde, coupé à plat sur le feutre), un dégradé radial partagé par coloris et sa texture.
  
  La texture tient en deux tracés seulement, un clair et un sombre : un velours pointillé, des frondes plumeuses ou des traits peignés selon le type. On voit le dessous (terre et rhizoïdes) depuis le dos. Cela fait **30 éléments** au DET 1.
- **Composer.** `GHI.rim=1` : la mousse ne va jamais dans la masse. Elle se pose sur la lèvre du vase, au pied des tiges, avec le dôme tourné vers le haut et vers l'œil. Dans un bouquet tenu ou emballé, il n'y a pas de lèvre, donc pas de mousse.
- **Coloris (5).** Vert vif velouté (Leucobryum), vert tendre glauque (L. glaucum), mousse plate (Hypnum), vert sapin (Dicranum), vert olive (mousse plate des bois).
- **Tailles.** Largeur du coussin : 6, 8, 10 et 12 cm.

### pinus-pins
- **Botanique.** Les aiguilles sont groupées en faisceaux (fascicules), disposés en spirale serrée. Selon l'espèce :
  - *P. sylvestris* : 2 aiguilles de 4 à 7 cm, torsadées, vert bleuté ;
  - *P. nigra* : 2 aiguilles de 8 à 14 cm, raides, vert foncé ;
  - *P. contorta* : 2 aiguilles de 4 à 6 cm, torsadées ;
  - *P. strobus* : 5 aiguilles de 8 à 13 cm, souples.
  
  Chaque pousse finit sur un verticille de bourgeons résineux, qui s'allongent en « chandelles » pâles au printemps. Les cônes sont ovoïdes, à écailles en spirales croisées (apophyses rhombiques), portés par un court pédoncule et tournés vers l'arrière.
- **Dessin.**
  - Aiguilles : posées faisceau par faisceau le long de chaque axe du L-système. Par morceau d'axe, elles tiennent en trois traits (derrière le rameau, devant, côté lumière). Leur épaisseur vaut au moins 1,1.
  - Bourgeons : stade bouton = chandelles, stade ouvert = bourgeons serrés.
  - Cônes : 0 à 2 par rameau selon l'espèce, avec écailles losangées et contour denté. Chaque cône part du rameau par son pédoncule.
  - Coût : **215 éléments** par tige.
- **Coloris (4).** Pin sylvestre, pin de Weymouth, pin noir, pin tordu.
- **Tailles.** Échelle des aiguilles : 8, 10 et 12 (en cm de la recette).

### loropetalum
- **Botanique.** *L. chinense* f. *rubrum*.
  - Rameaux étalés, souvent en zigzag.
  - Feuilles alternes sur deux rangs, de 2 à 5 cm, ovales, à base oblique, mates, pourpre foncé. Les jeunes pousses sont rubis.
  - Au printemps, des bouquets de 3 à 6 fleurs, chacune à 4 pétales en rubans de 1,5 à 2,5 cm, froissés et tordus. Fleurs fuchsia (crème ou blanches chez la forme verte).
- **Dessin.**
  - Feuilles en limbes 3D `g35Leaf`, dont les nervures restent dans le limbe.
  - Fleurs au bout des rameaux et dans les aisselles hautes. Les pétales sont des rubans ondulés et vrillés, d'au moins 1,2 de large à l'écran. Ils partent d'un petit calice, sur un pédoncule.
  - Bouton : fuseau rose.
  - Coût : **572 éléments** (pittosporum, lot 35 : 768).
- **Coloris (7).** Burgundy, Fire Dance (en fleurs), Black Pearl, Ruby, Ever Red (en fleurs), vert type, Emerald Snow (en fleurs).
- **Tailles.** Feuille de 3, 4 ou 5 cm.

### robinier
- **Botanique.** *Robinia pseudoacacia*.
  - Rameaux en zigzag, avec une paire d'épines stipulaires à chaque nœud.
  - Feuilles imparipennées de 15 à 30 cm, à 7–19 folioles ovales et opposées, vert tendre ; dorées chez 'Frisia'.
  - Grappes pendantes de 10 à 20 cm, à fleurs papilionacées blanches : étendard relevé à tache jaune-vert, ailes et carène, calice en cloche.
- **Dessin.**
  - Rachis arqué et retombant ; folioles en paires, plus grandes au milieu, plus une terminale ; épines de nœud.
  - Grappes pendantes qui s'ouvrent depuis la base, boutons à la pointe, pédicelles d'au moins 1,15.
  - Coût : **450 éléments**.
- **Coloris (5).** Vert type, Frisia doré, Frisia chartreuse, vert en fleurs blanches, × margaretta 'Casque Rouge' (rose pourpré).
- **Tailles.** Foliole de 3, 3,5 ou 4,5 cm.

### troene-a-baies
- **Botanique.** *Ligustrum vulgare* et *L. ovalifolium*.
  - Feuilles opposées et décussées, elliptiques, de 3 à 6 cm, vert foncé et un peu luisantes.
  - Panicule terminale pyramidale de 4 à 8 cm, faite de baies rondes luisantes de 6 à 8 mm. Elles mûrissent du vert au violine, puis au noir bleuté pruiné.
  - De petites panicules dans les aisselles hautes.
- **Dessin.**
  - Moteur du lot 20 : panicule faite d'étages opposés de petites cymes. Le rachis principal est dessiné en pièces ombrées, les pédicelles fins en un seul trait par panicule, derrière les baies.
  - Coût : **299 éléments** (la première version en faisait 650).
- **Coloris (4).** Noir bleuté, bleu-noir pruiné, vert, mi-mûr vert et violine.
- **Tailles.** Panicule de 5, 6 ou 7 cm.

## QA
- **Bouquets composés**, avec `inc=` sur les 5 espèces, 3 graines × 20 bouquets : seed 5, seed 7 et seed 11 donnent chacune **0 F, 0 U, 0 kink**.
- **Modèles** `ns=1,5,15,73,81` : **0 F, 0 U, 0 kink**.
- **Captures regardées** : seeds 2, 3 et 9 (mousse sur la lèvre, pin, robinier Frisia et vert, loropetalum, troène). `sheets/bouquets.png` est faite avec la seed 2.
- **Perf** (`perf=1`, 76 modèles, sur cette machine plus lente que la référence) :
  - base sans le lot : 220 ms et 8 738 éléments ;
  - avec le lot : 218 à 224 ms et 8 741 éléments.
  
  Les deux mesures sont au bruit près.
- **Non-régression de la copie de c4** : sans mousse, `run=composed&n=12&seed=4` donne les mêmes bouquets qu'avec le c4 d'origine.

## Diff moteur (`c4.js`, rétro-compatible : seul `GHI[sid].rim` l'active, et seul le lot 45 le pose)
```diff
-  for(const q of pool.filter(q=>q.role==='focal').sort((a,b)=>b.r-a.r)){let ok=false,x,y,z;
+  for(const q of pool.filter(q=>q.role==='focal').sort((a,b)=>b.r-a.r)){if((GHI[q.it.p.sid]||{}).rim){q.skip=1;continue}let ok=false,x,y,z;
-    grp.forEach((q,j)=>{let ok=false,x,y,z;…
+    grp.forEach((q,j)=>{if((GHI[q.it.p.sid]||{}).rim){q.skip=1;return}let ok=false,x,y,z;…
-  …{const rim=rest.filter(q=>q.skip).slice(0,3),…
+  …{const rimF=q=>(GHI[q.it.p.sid]||{}).rim?1:0,rim=rest.filter(q=>q.skip).concat(pool.filter(q=>q.role==='focal'&&q.skip&&rimF(q))).sort((a,b)=>rimF(b)-rimF(a)).slice(0,3),…
```
Le tri est stable : sans espèce `rim`, l'ordre ne change pas.

## Doutes
- **Mousse, vues de profil et de plongée.** Le dôme suit `ax` redressé vers le haut. De profil, il paraît donc incliné d'environ 48° sur sa pique. C'est cohérent en 3D, mais c'est une convention propre à cette « tête ».
- **Mousse, cartes du Composer.** Elles montrent trois coussins sur piques liés, comme l'échévéria du lot 35, parce que `bunchArt` traite les têtes ainsi.
- **Mousse, bouquets tenus ou emballés** (modèle 1, « noue ») : la mousse n'est pas dessinée. Un choix contraire est possible, en la plaçant basse dans la masse.
- **Pin.** L'échelle `cm` agrandit tout le rameau. La longueur réelle des aiguilles vient de l'espèce (le coloris).
