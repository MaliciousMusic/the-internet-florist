# Lot 24 — Feuillages 2 (agent feuillages2)

Fichiers : `s24a.js` (le lot) et `c5.js` (copie moteur, une ligne modifiée). Les planches sont dans `sheets/`.

## Le moteur commun (dans `s24a.js`)
- **`fgGrow`** fait pousser une tige feuillée avec le L-système (`lsDerive` et `lsTurtle`).
  - Règles : `A` pour l'axe principal, `N` pour un nœud, `B` pour un rameau latéral, `T` pour l'apex, `X` pour un organe axillaire.
  - Phyllotaxie : spirale à 137,5°, distique ou opposée-décussée.
  - Chaque axe se termine par ses jeunes feuilles.
  - Les rameaux latéraux sont remis à plat vers l'avant de la gerbe avec `$`, puis inclinés au hasard pour garder du volume de profil.
- **Contrat d'appel** : le même que l'archétype `foliage` de c4, c5 et e5.
  - Dans un bouquet, l'axe suit l'épine du Composer (`o.spine`) à partir de `o.from`.
  - La fonction renvoie `{k,bw,bc}` : `bw` et `bc` sont la largeur et les couleurs de la tige, pour la partie dessinée sous `from`.
  - Sur une planche, la plante se tient dans le repère de la vue (`o.ax`), arquée.
  - Sur une carte du Composer (`o.up`), la tige part du lien de raphia, avec sa propre couleur.
  - `GHI` n'est pas défini : `isClu` et `SPINE_A` traitent ces espèces comme avant, c'est-à-dire comme des tiges en grappe qui suivent une épine.
- **`fgBlade`** dessine une feuille en 3D sur la surface `lsLeafS` du moteur.
  - La feuille est dessinée en deux moitiés, chacune éclairée par sa propre normale ; la pliure entre les deux se lit comme la nervure médiane.
  - Elle porte des dents (marge en zigzag), un pétiole, et sur les planches (DET 2) des nervures et un brillant.
  - Elle n'utilise aucun dégradé : 2 éléments par feuille, pour tenir le budget.
  - Je n'ai pas pris `lsLeafParts`, qui coûte environ 18 éléments par feuille avec ses dégradés.

## Espèces
| Espèce | Ce qui est fait | Coloris (CWS) | Tailles (SZG) |
|---|---|---|---|
| `sun-palm-seche` (Licuala grandis / Saribus rotundifolius séché) | Long pétiole plat. L'éventail orbiculaire est plissé en accordéon : 28 facettes à DET 1, 40 à DET 2, avec arêtes et vallées. Les rayons sont pointus aux arêtes et encochés aux vallées. Une hastule, une légère cuvette. Le pétiole est teint avec la feuille. Stades : éventail fermé, à demi ouvert, ouvert. | 13 : naturel paille, blanchi, crème, noir, rose poudré, fuchsia, rouge, bordeaux, terracotta, orange brûlé, lilas, bleu nuit, doré | diamètre 22, 30, 38 et 45 cm, pour des tiges de 50 à 80 cm |
| `physocarpus-opulifolius` | Rameaux arqués, écorce brune. Feuilles alternes en spirale, trilobées, doublement dentées, palmatinervées. Les jeunes pousses sont plus rouges, ou plus jaunes pour Dart's Gold. Corymbes en dôme de fleurs blanches à étamines roses, en bouton puis ouvertes. Grappes de follicules rouges. | 10 : Diabolo, Red Baron, Lady in Red, Coppertina, Amber Jubilee, Dart's Gold, vert ; plus Diabolo fleuri, Dart's Gold fleuri et Diabolo en fruits rouges | feuille de 5 à 8 cm, pour des tiges de 50 à 80 cm |
| `danae-racemosa-ruscus-italien` | Tiges souples très arquées. Cladodes alternes, distiques, lancéolés et acuminés, sessiles, tordus, brillants sur les deux faces. Rameaux secondaires sur les nœuds médians. Les cladodes du sommet sont encore repliés au stade bouton. | 3 : vert franc, vert profond, vert tendre (jeunes pousses) | cladode de 6 à 9 cm, pour des tiges de 60 à 90 cm |
| `pelargonium-geranium-odorant` | Tige épaisse et poilue. Feuilles alternes à long pétiole, palmatiséquées en 5 lobes eux-mêmes découpés, sinus basal cordé, légèrement creusées. Un liseré pâle rend l'aspect duveteux. Ombelles de 5 à 9 fleurs roses : les 2 pétales supérieurs, plus grands, sont veinés de pourpre. | 5 : rosat, Mabel Grey, Lady Plymouth (panaché crème), Chocolate Peppermint (maculé), rosat fleuri | feuille de 6 à 8 cm, pour des tiges de 30 à 50 cm |
| `fusain-aile` (Euonymus alatus) | Rameaux rigides, opposés-décussés. Quatre ailes liégeuses brunes sur l'axe, deux sur les rameaux à DET 1. Feuilles elliptiques acuminées, finement serretées, aux teintes d'automne variées. Capsules de 1 à 4 lobes rouge pourpré qui s'ouvrent sur des arilles orange (stade ouvert). | 7 : rouge carmin, écarlate, rose fuchsia, corail orangé, vieux rose, vert (été), rameaux à capsules orangées | feuille de 4 à 7 cm, pour des tiges de 50 à 80 cm |

Les formes fleuries ou en fruits ont `f:1` : la couleur d'un modèle tombe toujours sur une forme simple, jamais sur une forme rare (`fgCw`, sur le modèle de `cwPick`).

Notes botaniques (sources : RHS et grossistes) :
- Le Danae porte des cladodes, c'est-à-dire des rameaux aplatis, et non des feuilles.
- Le *sun palm* du commerce est une feuille de Licuala ou de Saribus taillée en disque, séchée puis blanchie ou teinte.
- Le fusain ailé montre ses ailes surtout sur les jeunes rameaux vigoureux.

## Vérifications
- **Planches.** J'ai regardé 9 vues × 3 stades pour chaque espèce, plus des zooms (`fz`), tous les coloris et 3 tailles.
- **Cartes du Composer :** `sheets/cartes_composer.png`.
- **Bouquets composés** (`inc=` avec les 5 espèces, graines 5, 17 et 29, 20 bouquets chacune) : **60 bouquets, 0 F, 0 U, 0 kink**. J'ai regardé 3 captures, dont `sheets/bouquets.png`.
- **Modèles** 1, 6, 11, 12, 13, 15, 34, 36, 57, 60 et 75 : **0 F, 0 U, 0 kink**. J'ai vérifié à l'œil les palmiers des modèles 36 et 57, le physocarpe du modèle 6 et le fusain du modèle 1.
- **Perf** (`perf=1`, 76 modèles), mesurée sur cette machine :
  - référence `main` : 174 ms et 10 150 éléments ;
  - avec le lot : 175 ms et 10 137 éléments.
- **Éléments par tige** (`perf2`, DET 1) : fusain 130, Danae 98, géranium 78, physocarpe 60, palmier 48.

## Diff moteur : `c5.js` (une ligne, rétro-compatible)
Dans le Composer, la partie basse d'une tige en grappe (sous `o.from`) reprend la largeur et les couleurs que l'espèce renvoie (`bw`, `bc`) au lieu du vert `SC`. Sans ce changement, un palmier teint en bordeaux aurait un bas de tige vert.
- Seules les espèces qui renvoient `bw` sont concernées. Les épis de s8a renvoient aussi `bw`, mais ce sont des lignes, et les lignes n'ont pas de `from` : elles ne changent pas.
```diff
-      if(o.spine&&o.from){const st=stem3(L.stems,bseg(...,0,Math.min(1,o.from+.03)),3.4,2.4,SC,12);...
+      if(o.spine&&o.from){const sb=o.sb||{},st=stem3(L.stems,bseg(...,0,Math.min(1,o.from+.03)),sb.w?Math.max(sb.w*1.15,2.4):3.4,sb.w||2.4,sb.c||SC,12);...
```

## Doutes
- **Palmier et Danae rares dans les bouquets composés.** Le Composer les place peu : le filtre `FOUR` exclut `palm`, et `hidesUnder` écarte des tiges. Ces deux comportements viennent du moteur et je n'y ai pas touché. On voit bien les palmiers dans les modèles.
- **Feuilles vues par la tranche.** Une feuille vue exactement par la tranche se réduit à un trait fin. C'est juste géométriquement, mais ça peut surprendre en plongée.
- **Taille des capsules du fusain.** Elles mesurent environ 1 cm, ce qui est fidèle, mais elles restent discrètes dans un grand bouquet.
- **Tailles dans SZG.** Elles sont exprimées dans l'unité de la recette : diamètre de l'éventail ou longueur de feuille. Sur les planches, la tige entière suit la même échelle.
