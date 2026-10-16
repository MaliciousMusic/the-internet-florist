# Lot 34 : feuillages tropicaux (agent « tropicaux »)

Branche `serre/34-tropicaux`. Fichier du lot : `s34a.js` (préfixe `t34` / `T34_` / `CW_T34…`). Copie moteur : `c4.js` (une ligne, voir plus bas).

## Principe commun
- Chaque feuille est une nappe 3D `sheet3` posée au bout de son pétiole. Le pétiole est poussé par le L-système, avec `fgGrow` et `fgAxis` du lot 24 (même chemin que le palmier soleil) : il suit l'épine du Composer dans un bouquet, et le cadre de la vue sur une planche.
- La surface `t34S` porte la nervure médiane, qui s'incline en arrière (`th0`) et se courbe (`ka`). Le limbe :
  - se plie en V sur la nervure (ou se bombe pour la calathea) ;
  - se vrille le long de la feuille (0,4 à 0,85 rad), ce qui rend la feuille lisible de profil et en plongée ;
  - s'incline dans son plan (`lean`) et retombe sous son poids ;
  - a parfois une marge ondulée ;
  - est roulé quand la feuille est jeune : c'est le stade « bouton », la feuille encore enroulée en cornet.
- Le profil de largeur peut différer d'un côté à l'autre, pour les lobes de Xanadu et les déchirures du strelitzia.
- Les nervures sont gravées avec `veins3` : médiane en relief clair, latérales pennées ou parallèles. La brillance passe par `gloss3`, réglée par espèce.
- Les motifs sont peints dans l'espace (u,v) du limbe via `paint`, et découpés à la bande de face visible (`t34Clip`). Ils ne débordent donc jamais sur le revers.
- Le revers a sa propre palette : pourpre pour la plupart des calatheas, vin pour les philodendrons rouges.
- Dans un bouquet, le pétiole s'arrête avant le bout de l'épine. Le limbe se pose ainsi au bord de la masse au lieu de la dépasser de toute sa longueur.

## Espèces
- **philodendron-hybrides** (Philodendron autoporteurs hybrides, Thaumatophyllum 'Xanadu')
  - Limbe oblong-ovale coriace, très lustré, base tronquée à subcordée, sur un long pétiole (40 cm).
  - 'Xanadu' : profondément pennatifide, 7 lobes par côté dirigés vers l'apex, nervures dans les lobes.
  - Pétiole rouge pour les formes rouges ; les jeunes feuilles de 'Rojo Congo' sont plus rouges.
  - Coloris : Imperial Green, Xanadu, Imperial Red, Rojo Congo, Black Cardinal, Moonlight (chartreuse), Prince of Orange.
  - Tailles du limbe : 25, 30, 40 cm.
- **aspidistra-elatior**
  - Feuille solitaire sur pétiole raide (24 cm), limbe elliptique-lancéolé de 50 cm, acuminé, coriace, vert foncé, nervures parallèles fines.
  - Coloris : vert foncé, 'Milky Way' (moucheté crème), 'Variegata' (rayures crème), 'Asahi' (pointe blanchissante), 'Okame' (rayures jaunes), teintée lilas (demandée par le modèle 34), blanchie crème.
  - En composition, 30 % des feuilles sont bouclées : la nervure s'enroule sur environ 310° et la feuille garde tout son pétiole pour que la boucle reste au-dessus de la lèvre.
  - Tailles : 40, 50, 60 cm.
- **cordyline-fruticosa-ti**
  - Canne ligneuse annelée de cicatrices foliaires (organes `Nd`), couronnée d'une rosette spiralée de 7 à 10 feuilles lancéolées sur pétioles canaliculés, ascendantes puis arquées.
  - Les feuilles les plus jeunes se dressent au centre, encore pliées.
  - Coloris : vert, 'Red Sister' (bordeaux, jeunes feuilles fuchsia, liseré rose), 'Red Dragon', 'Black Mystique', 'Pink Diamond', 'Chocolate Queen', 'Kiwi' (rayé crème, marge rose), 'Black Magic' (presque noir, demandé par le modèle 70).
  - Tailles : 35, 45, 55 cm (les plus longues feuilles).
- **goeppertia-calathea** (Goeppertia, syn. Calathea)
  - Limbe ovale sur pétiole grêle terminé par un pulvinus renflé plus sombre ; revers pourpre (vert pâle pour orbifolia).
  - Motifs : 'Medallion' (couronne argentée plumeuse et cœur clair), orbifolia (bandes argentées, feuille ronde), makoyana (plumes de paon sombres sur fond pâle), lancifolia (écailles alternées grandes et petites, longue feuille au bord ondulé), zebrina (barres sombres, mate), 'Rosy' (cœur rose, marge verte), musaica 'Network' (mosaïque).
  - Tailles : 20, 28, 35 cm.
- **strelitzia-feuilles** (Strelitzia reginae)
  - Grande pagaie oblongue vert bleuté glauque et mate, sur long pétiole robuste (60 cm).
  - Large nervure médiane crème, nombreuses nervures latérales parallèles.
  - Bord déchiré en lanières le long des nervures : encoches tirées au hasard de chaque côté, chacune marquée d'une fente sombre.
  - Coloris : vert bleuté, gris-vert glauque, vert sombre.
  - Tailles : 30, 38, 50 cm.

Sources des coloris et des tailles : catalogues de producteurs et de grossistes de feuillages coupés, et recettes du dépôt (`k0.js`). Pas de photo copiée.

## QA
- **Planches.** Vues 9 × 3 stades, coloris et tailles regardés en grand et zoomés pour les 5 espèces. Aucune pièce flottante, aucune feuille plate de profil (la vrille et le pli restent lisibles).
- **Bouquets composés** (`inc=` les 5 espèces, n=20) : graines 3, 5 et 7, chacune à **0 F, 0 U, 0 kink**. Captures regardées : graines 3 et 11.
  - Au premier passage, 11 U venaient de l'aspidistra bouclée qui passait sous la lèvre. C'est corrigé : la feuille bouclée garde tout son pétiole et la boucle est plus serrée.
- **Modèles 21, 34, 52, 55 et 70** : **0 F, 0 U, 0 kink**. Les feuilles de calathea (21) et les feuilles chocolat du philodendron (52) apparaissent maintenant.
- **Perf** (`perf=1`, 76 modèles), comparée à un build de `main` sur la même machine : **183 ms / 9 595 éléments** contre 186 ms / 9 593.
- **Éléments par plante à DET 1** (bouquets) :

  | Espèce | Moyenne | Maximum |
  |---|---|---|
  | Feuilles simples | 16 à 22 | 36 |
  | Cordyline (rosette de 7 à 10 feuilles) | 79 | 100 |

## Diff moteur : `c4.js` (rétro-compatible, opt-in)
Avant ce lot, le Composer jetait **toutes** les feuilles de foliage `single` ou `rosette` dans les vases. Le test `hidesUnder(v,S,B,ext)` avec ext ≈ 64 échouait toujours. Ces 5 espèces n'apparaissaient donc jamais en bouquet composé, et le modèle 52 perdait ses « grandes feuilles chocolat ».

Une espèce peut maintenant déclarer `GH[sid].bigLeaf={ext,k0}`. Seul le haut de son épine, là où commence le limbe, doit alors dégager la lèvre. Les autres espèces ne changent pas.
```diff
-    const fr=…arr==='frond',chk=S2=>{if(!fr)return hidesUnder(v,S2,B,ext);…
+    /* a big leaf drawn by its species (GH[sid].bigLeaf = {ext, k0}) rises on its petiole: only the top of its spine, where the blade starts, must clear the lip */
+    const fr=…arr==='frond',bl=(GH[it.p.sid]||{}).bigLeaf,chk=S2=>{if(bl)return hidesUnder(v,S2,B,bl.ext,bl.k0);if(!fr)return hidesUnder(v,S2,B,ext);…
```
Dans `s34a.js`, les 5 fonctions portent `bigLeaf={ext:14,k0:12}`.

## Doutes
- **Taille dans les bouquets.** Les feuilles sont à l'échelle réelle (aspidistra de 50 cm, strelitzia de 38 cm). Dans les petits vases, quand le Composer en met 5 de la même espèce, elles dominent le bouquet. Réduire ce nombre relève de c4 (le compte des feuillages), pas de ce lot.
- **Autres grandes feuilles.** Le même défaut de c4 touche les autres grandes feuilles `single` encore dessinées par `gFoliage` (anthurium-feuilles, bananier…). Elles profiteront de `bigLeaf` quand leur lot les reprendra.
- **Déchirures du strelitzia.** Ce sont des encoches en V étroites avec une fente sombre, pas de vraies lanières séparées.
- **Cartes du Composer.** Les cartes n'affichent que 4 coloris par espèce (`k=4`).
