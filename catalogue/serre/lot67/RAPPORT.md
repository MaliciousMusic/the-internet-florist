# Lot 67 « printemps 6 » (agent printemps6)

Fichier : `s67a.js`. Tous les noms globaux sont préfixés `l67` / `L67_`. Aucun module moteur n'est modifié (pas de copie moteur, pas de diff).
Les moteurs réutilisés sont la boule de neige (`vibPlant`/`vibLeaf`, lot 41) pour le lilas, le cyrtanthus et `fritBell` (lot 41) pour la fritillaire impériale, l'iris de Hollande (`irisSpathes`, `ligule`, `spPetals`, lot 22) pour l'iris barbu, et l'eremurus (`spGrow`, `l41StemP`, épi dessiné par bandes, lot 41) pour camassia et ornithogale.

## Espèces

### lilas (Syringa vulgaris), `l67Lilac`
- **Fait.** Un rameau ligneux gris-brun avec deux paires de feuilles en cœur opposées-décussées (`l67Heart` : long pétiole, base cordée, pointe acuminée, moitié ombrée, nervures). Au bout, le thyrse conique, et une fois sur deux son jumeau issu de l'aisselle haute, plus petit et plus jeune, comme sur un vrai lilas.
- **Le thyrse** (`l67Pan`) : 96 fleurons (150 en `det=2`) posés sur un cône bosselé, les grappes latérales en relief. Ils sont dessinés du fond vers l'avant par paquets de 4 à 6 (un chemin chacun), sur un cœur sombre qui descend jusqu'au pédoncule. La corolle a 4 lobes en capuchon et un œil au tube. Pour les doubles, un second verticille est tourné de 45°.
- **Stades.** Bouton : cône de boutons ronds plus foncés, teintés de vert. Mi-ouvert : la bande ouverte monte depuis la base, quelques fleurons s'ouvrent au bord, la pointe reste en bouton.
- **Coloris (9).** Lilas mauve (Ruhm von Horstenstein), blanc (Mme Florent Stepman), pourpre (Andenken an Ludwig Späth), pourpre double (Charles Joly), bleu lavande double (Président Grévy), lilas double (Michel Buchner), rose (Lucie Baltet), pourpre liseré de blanc (Sensation), blanc double (Mme Lemoine).
- **Tailles.** Panicule de 14 à 24 cm (lilas forcé hollandais : 40 à 70 cm de tige).

### iris-barbu (Iris germanica et grands iris barbus hybrides), `l67Iris`
- **Fait.** Une tige robuste, avec à sa base l'éventail de 3 feuilles en épée dans un plan. Une ou deux ramifications, chacune avec une courte feuille engainante, portent un bouton ou une fleur plus jeune ; la fleur terminale sort de spathes vertes. La fleur et le bouton d'une même tige coexistent.
- **La fleur** (`l67IrisF`) :
  - 3 sabots sur un onglet étroit veiné (`basec`), qui retombent presque à la verticale, ondulés ;
  - la barbe, une bande pileuse épaisse le long de l'onglet, avec un trait plus clair au centre en `det=2` ;
  - 3 étendards dressés, ondulés, qui se referment en dôme ;
  - 3 branches du style à crête.
  Les plicatas ont un liseré cousu (`edgec`).
- **Coloris (12).** Bleu violet (Victoria Falls), pourpre noir (Superstition), blanc (Immortality), jaune (Harvest of Memories), abricot (Orange Harvest), rose (Beverly Sills), jaune et violet (Edith Wolford), jaune et brun-rouge (Rajah), blanc et bleu (Stairway to Heaven), plicata blanc liseré de violet (Going My Way), rouge cuivré (Sultan's Palace), bleu pâle (Blue Sapphire). Chacun a sa couleur de barbe.
- **Tailles.** Fleur de 11 à 15 cm (tige de 60 à 90 cm).

### fritillaire-imperiale (Fritillaria imperialis), `l67Crown`
- **Fait.** Une hampe robuste vert pourpré. En bas, 3 verticilles de feuilles lancéolées luisantes (espacés) ; au-dessus, la hampe est nue.
- **La couronne.** Une couronne de 5 à 8 clochettes pendantes sur des pédicelles verts arqués (`fritBell`, avec un reflet lustré au lieu de la pruine), aux veines plus sombres. Les 6 étamines jaunes dépassent de la bouche avec le style. Au-dessus, la touffe (coma) de 13 feuilles (18 en `det=2`) en deux rangs, dressée.
- **Stades.** Bouton : clochettes vertes, à demi pendantes, plus petites.
- **Coloris (6).** Orange (Aurora), rouge orangé (Rubra Maxima), jaune (Maxima Lutea), orange vif (Garland Star), orange pâle (Premier), rouge brique (Rubra).
- **Tailles.** Clochette de 4,5 à 6,5 cm, l'unité de `rec.cm` = 5. La couronne mesure environ 2,8 fois la clochette (hampe de 60 à 100 cm).

### camassia (C. leichtlinii, C. quamash, C. cusickii), `l67Camassia`
- **Fait.** Une hampe nue et une grappe élancée (`l67Raceme`, dessinée par bandes comme l'eremurus).
- **Les fleurs** sont des étoiles de 5 cm à 6 tépales étroits un peu inégaux, avec 6 étamines à anthères dorées. Elles s'ouvrent de la base. Les fleurs fanées tordent leurs tépales autour de l'ovaire, comme chez le vrai camassia. Les boutons sont étroits et bleutés, sur des pédicelles ascendants avec une bractée.
- **Coloris (5).** Bleu violet (leichtlinii Caerulea), bleu indigo (quamash), bleu pâle (cusickii), lavande (Blue Heaven), blanc crème (Alba).
- **Tailles.** Grappe de 15 à 28 cm (tige de 60 à 80 cm).

### ornithogale (O. thyrsoides, O. arabicum, O. saundersiae, O. dubium), `l67Ornith`
- **Fait.** Une hampe nue, et le même moteur de grappe :
  - thyrsoides : épi conique dense d'étoiles en coupe à 6 tépales larges avec une nervure verte, ovaire vert-jaune, filets blancs, anthères jaunes ; boutons blanc-vert serrés en cône au sommet ;
  - arabicum et saundersiae : grappe courte à sommet plat (corymbe), grandes étoiles plates à ovaire noir brillant ;
  - dubium : orange ou jaune, à œil brun-vert.
- **Coloris (7).** Blanc (thyrsoides), blanc crème (Mount Fuji), blanc verdâtre, blanc à œil noir (arabicum), blanc à œil noir-vert (saundersiae), orange et jaune (dubium).
- **Tailles.** Épi de 7 à 13 cm (tige de 40 à 60 cm).

## Composer
- **`GHI`.**
  - lilas : `grappe`, tête, rk 1,15 ;
  - iris barbu : `etoile`, tête, rk 0,95 ;
  - fritillaire impériale : `cornet`, tête, rk 1 ;
  - camassia et ornithogale : `epi`, plante sur épine (`self`, `tip`, `fx`).
- **`GH_BUDS`.** Lilas, iris barbu et fritillaire impériale (vendus en bouton ou mi-ouverts).
- **Le lilas.** Il pousse en tige ligneuse. Sur la lèvre (`o.rim`), chaque tête garde seulement un court pédoncule (`lsHeadS`).

## QA
- **Planches.** 9 vues × 3 stades, tous les coloris et 3 tailles ont été regardés, en grand et zoomés (`det=2`, `fz=`).
  - Corrigé : la coma de la fritillaire retombait au hasard (variable `D` masquée), les feuilles d'iris étaient trop longues, l'œil d'arabicum était trop gros, l'échelle de la fritillaire était fausse.
- **Bouquets composés**, `inc=` des 5 espèces, 3 graines × 20 (5, 11, 23) : **0 F, 0 U, 0 kink**. Deux captures ont été regardées (`seed=3`, `seed=7`).
- **Modèles du catalogue.** Aucun modèle n'utilise ces 5 espèces (`models_of.py` renvoie `ns=` vide), donc il n'y a pas de QA modèles à faire.
- **Perf.** Le moteur n'est pas touché. Éléments SVG par tête au détail de l'appli (DET 1, tige et feuilles dans la couche des tiges), moyenne de 10 rendus :

  | Espèce | Éléments | Temps |
  |---|---|---|
  | lilas | 34 | 5,7 ms |
  | iris barbu | 49 | 3,9 ms |
  | fritillaire impériale | 127 | 5,9 ms |
  | camassia (épi complet) | 63 | 2,6 ms |
  | ornithogale (épi complet) | 68 | 3,0 ms |

## Doutes
- **Lilas : fleurons regroupés.** Les fleurons d'un même paquet partagent un ton. Les contours de deux fleurons voisins d'un même paquet peuvent donc se croiser (c'est invisible à l'échelle du bouquet, et léger en `det=2`).
- **Lilas : place dans le bouquet.** Le thyrse se lit comme un volume fermé, peu ajouré. Avec rk 1,15, les gros thyrses dominent un bouquet : c'est réaliste, mais à surveiller.
- **Fritillaire impériale : tige.** La tige coupée garde ses verticilles bas. Le commerce les ôte souvent ; dans un bouquet, ils vont de toute façon dans la couche des tiges.
- **Iris barbu : fleur ouverte.** Une seule fleur est ouverte par tige ; la seconde ramification porte un bouton.
