# Lot 31 « été 3 : panicules, ombelles et clochettes » (agent ete3)

Fichier : `s31a.js`, préfixe `l31` / `L31_`. Aucun module moteur modifié, donc aucun diff moteur.
Les 5 espèces poussent par le L-système :
- astilbe et campanule le long de l'épine du Composer, avec `spGrow`, `spStemP` et `spLeafPart` de r5a ;
- pentas, achillée et trachélium en têtes sur leur tige, avec `chpHeadS` de s17a.

Elles remplacent les anciennes recettes génériques `spike` et `globe`.

## Par espèce
**Astilbe** (*A. × arendsii*, *chinensis*, *japonica*)
- Morphologie : tige brun-rouge et 2 ou 3 feuilles bi-ternées, à folioles ovales acuminées et doublement dentées. Panicule de 15 à 30 cm, pyramidale chez arendsii, plus étroite et dressée chez chinensis. Les rameaux sont alternes et longs en bas ; ils portent à leur tour des rameaux secondaires (L-système `B → F [&θ B'] F Tp`).
- Rendu de chaque rameau : un corps plumeux, des fleurettes en points (claires et ombrées) et un halo d'étamines en traits fins.
- Floraison de la base vers le haut. Au stade bouton, la plume est serrée et plus sombre.
- 11 coloris : Europa, Washington, Bridal Veil, Peach Blossom, Rheinland, Gloria Purpurea, Montgomery, Fanal, Amethyst, chinensis Visions et Purpurlanze.
- Plumes de 15 à 30 cm. GHI `epi` / `plant`.

**Pentas** (*P. lanceolata*)
- Morphologie : cyme bombée faite d'étoiles à 5 lobes ovales pointus, avec une gorge pâle et un tube de corolle visible de profil ou de dos. Les boutons en massue sont serrés au cœur. Feuilles opposées ovales en 3D (sheet3), aux nervures pennées en creux. Des cymes plus jeunes poussent aux aisselles hautes.
- 10 coloris de la série Graffiti (Benary) : True Pink, White, Appleblossom, Pink, Fuchsia, Bright Red, Red Velvet, Lavender Pink, Violet, ainsi que Flirty Pink en bicolore.
- Tailles de 6 à 10 cm. GHI `sphere`, se vend en bouton.
- Coût : **724 → 240 éléments** par plante entière, divisé par 3.

**Achillée** (*A. millefolium* et *filipendulina*)
- Morphologie : corymbe plat de grappes de minuscules capitules. À DET 2, chaque capitule est une marguerite à 5 rayons autour d'un disque crème.
  - *filipendulina* : plateau doré plus dense et bombé, en boutons, avec des feuilles pennées dentées gris-vert.
  - *millefolium* : feuilles en plume très finement découpées (`l31Feather`).
- 11 coloris : Moonshine, blanc, Summer Pastels, Cloth of Gold, Parker's Variety, Terracotta, Salmon Beauty, Pink Grapefruit, Cerise Queen, Paprika et Lilac Beauty.
- Tailles de 7 à 14 cm. GHI `disque`.
- Coût : **3004 → 85 éléments**.

**Trachélium** (*T. caeruleum*)
- Morphologie : dôme corymbiforme vaporeux. Les fleurettes tubulaires ont des styles longs et saillants terminés par un stigmate pâle. Des têtes satellites poussent sur les rameaux latéraux. Les feuilles sont ovales et dentées ; la tige est teintée de pourpre pour les coloris violets.
- 10 coloris des séries Lake Michigan, Lake Louise, Devotion et Corporate, du pourpre noir au blanc verdi et au vert.
- Tailles de 9 à 15 cm. GHI `disque`.
- Coût : **3004 → 92 éléments**.
- Pour les deux corymbes, chaque moitié de tête (lointaine puis proche) est dessinée en quelques chemins regroupés.

**Campanule** (*C. medium* et *persicifolia*)
- Morphologie : grappe qui s'ouvre de bas en haut, avec des boutons verts puis colorés, pointus et à 5 angles. Une bractée sous chaque fleur ; feuilles lancéolées.
- La cloche est une surface de révolution (sheet3) à 5 nervures et 5 lobes recourbés. Quand la bouche se tourne vers l'œil, on voit l'intérieur pâle, le style blanc et ses 3 stigmates.
- Le calice a 5 sépales et, chez *medium*, 5 appendices réfléchis. Le type cup-and-saucer (*calycanthema*) a une soucoupe colorée et ondulée.
- *persicifolia* : coupes larges sur des pédicelles plus longs.
- 12 coloris : la série Champion (Blue, Lavender, Pink, White), bleu violet, mauve, 3 tasses et soucoupes, et 3 *persicifolia*.
- Grappes de 20 à 35 cm. GHI `epi` / `plant`.

## QA et perf
- Composés avec `inc=` les 5 espèces, graines 5, 11 et 17 × 20 bouquets : **0 F, 0 U, 0 kink**. J'ai regardé les captures des graines 3 et 8.
- Modèles concernés (`ns=2,6,27,28,31,61,75`) : **0 F, 0 U, 0 kink**.
- Perf `perf=1` mesurée sur cette machine cloud, plus lente que la référence. Mêmes conditions sans le lot : 177 ms, 9593 éléments et 436 dégradés. Avec le lot : 177 à 188 ms, **9420 éléments** et 443 dégradés. L'écart de temps vient du bruit de la machine.
- Coût par plante entière à DET 1 (moyenne sur 12 vues) :
  - astilbe 234 éléments (73 avant, mais l'ancienne n'était qu'un épi sans rameaux) ;
  - campanule 331, max 519 (212 avant) : chaque cloche est en 3D ;
  - pentas, achillée et trachélium : voir plus haut.

## Doutes
- Les plumes d'astilbe restent un peu stylisées : rameaux en corps plumeux plutôt que des centaines de fleurettes distinctes. Le choix tient le budget.
- Les cloches de campanule sont à l'échelle réelle (5 cm), donc elles paraissent grandes dans les petits vases.
- Le coût de la campanule et de l'astilbe augmente par rapport aux anciennes versions, très pauvres. Le total d'éléments par bouquet baisse quand même, grâce au pentas, à l'achillée et au trachélium.
- Dans les cartes du Composer, les feuilles passent devant les têtes, comme pour les autres espèces en tête (lisianthus, reine-marguerite). C'est le comportement du moteur des cartes.
