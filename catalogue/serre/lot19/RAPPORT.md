# Lot 19 « exotiques 2 » : rapport

Fichier : `s19a.js`, chargé avant c4.js. Aucun module moteur n'est modifié, donc pas de diff moteur. Les cinq espèces sont poussées par le L-système (`lsTurtle`/`lsDerive`) ou en reprennent les organes.

## Espèces

### anthurium-obake (*Anthurium × andraeanum*, groupe obake)
- **Ce qui est fait.** La spathe du lot 1 (`anthHalf`, capitons, nervures, laque) est reprise dans une fonction commune `anthSp`, plus longue (w 0,86) et à pointe étirée. Le vert envahit la couleur depuis la pointe et depuis les lobes, et suit les nervures, elles-mêmes vertes. Le revers est presque entièrement vert. La plante est `lsHeadS` sur une hampe, comme `anthPlant`.
- **Botanique.** « Obake » veut dire « qui change » : spathe bicolore, le vert s'étend avec l'âge et la taille. Spathe allongée, spadice crème.
- **Coloris (7).** Obake rouge, rose, rose vif, pêche, blanc, vert et rose, vert et rouge.
- **Tailles.** SZG 10 à 18 cm (spathe), 14 cm le plus courant. Les obakes sont plus grandes que les standards ; Anthura vend aussi des mini-obakes de 7 à 11 cm (Alero®).

### anthurium-tulipe (*A. amnicola* × *andraeanum*)
- **Ce qui est fait.** Contour propre `tulHalf` : base arrondie en coin, pas de lobes, sommet en pointe courte. Les moitiés s'enroulent en arc autour du spadice et s'évasent vers la pointe. Le spadice violet est droit et dressé, il reste caché dans le bouton.
- **Coloris (7).** Rose, fuchsia, violet, lilas, blanc, rouge, saumon, tous avec un spadice violet.
- **Tailles.** SZG 6 à 10 cm.

### sandersonia (*Sandersonia aurantiaca*, Colchicaceae)
- **Ce qui est fait.** Une espèce en ligne qui suit l'épine du Composer (`spAxis`, souple, arquée).
  - Les feuilles lancéolates sessiles sont en 3D (`lsLeafParts`) et se terminent par une vrille enroulée.
  - À chaque aisselle supérieure, le L-système pousse un pédicelle fin qui s'arque sous l'effet de la gravité.
  - Chaque lanterne pend au bout de son pédicelle : urne à 6 côtes, bouche resserrée à 6 dents ; la gorge est visible en contre-plongée.
  - Les boutons vers l'apex sont plus petits et plus verts.
- **Botanique.** Tige d'environ 75 à 80 cm ; feuilles d'environ 10 cm, souvent terminées par une vrille ; clochettes d'environ 2,5 cm.
- **Coloris (4).** Orange, abricot, jaune d'or, crème (Golden Lantern).
- **Tailles.** SZG 35 à 60 cm (partie fleurie). GHI : ligne, `tip` 0,55.

### heliconia-velues (*H. vellerigera*, *H. xanthovillosa*, *H. chartacea* 'Sexy Pink')
- **Ce qui est fait.** Un pédoncule s'arque, puis le rachis pend en zigzag (L-système : `aim` vers le bas, zig alternant). Les bractées sont distiques et un peu tordues (`/`).
  - Chaque bractée est un bateau 3D en deux moitiés (`heliBract`) qui s'ouvre vers le pédoncule.
  - Les velues ont une nappe de poils : un liseré pâle et un pointillé de poils sur le bord. 'Sexy Pink' et 'Sexy Scarlet' ont une lèvre verte.
  - Les fleurs jaunes sortent des bractées.
- **Coupe de la tige.** La tige est coupée au début de l'arche. L'arche appartient à l'inflorescence, sinon la QA la voit comme une tige qui revient en arrière.
- **Botanique.** Inflorescence pendante de 30 à 60 cm.
- **Coloris (5).** Vellerigera rouille, vellerigera orangé, xanthovillosa jaune, chartacea Sexy Pink, Sexy Scarlet.
- **Tailles.** SZG 35 à 60 cm.

### heliconia-bihai
- **Ce qui est fait.** Même moteur que les velues, mais l'inflorescence est dressée. De 5 à 7 bractées alternes en bateau, ouvertes vers le haut, qui raccourcissent vers l'apex.
  - La lèvre a sa propre couleur et la carène est verte au revers.
  - Le rachis en zigzag est coloré et le pédoncule est vert.
  - Bouton : les bractées sont serrées contre le rachis et teintées de vert.
- **Botanique.** De 5 à 12 bractées de 10 à 25 cm, inflorescence jusqu'à 60 cm.
- **Coloris (6).** Lobster Claw, Kamehameha, Chocolate Dancer, Yellow Dancer, Emerald Forest, Balisier orange.
- **Tailles.** SZG 20 à 40 cm.

## QA
- **Bouquets composés.** `inc=` les 5 espèces, graines 5, 11 et 23, 20 bouquets chacune : **0 F, 0 U, 0 kink**. Vu à l'œil : `bouquets.png` (graine 7) et une capture de 8 bouquets (graine 3).
- **Modèles.** `ns=2,5,7,12,14,19,31,34,47,68,70,72` (12 modèles) : **0 F, 0 U, 0 kink**.
- **Perf** (76 modèles, sur cette machine cloud) : 227 ms et 10 191 éléments par bouquet. La base, mesurée sur la même machine, donne 227 ms et 10 150 éléments (+0,4 % d'éléments). La machine est plus lente que la référence de 142 ms.
- **Bug corrigé en route.** Dans `heliPlant`, une variable locale `D` (la taille) masquait la constante des degrés. Elle s'appelle maintenant `Dm`.

## Doutes
- Le vert « boueux » à la transition des obakes rouges imite la vraie zone kaki, mais il reste à valider sur photo.
- Je n'ai pas trouvé les tailles commerciales exactes de *H. xanthovillosa* ni de 'Balisier orange'. Leurs noms et coloris sont plausibles, mais à vérifier chez le grossiste.
- Pour les velues, le velours est rendu par un liseré et un pointillé : c'est sobre, sans grain. Le pédoncule en crosse est fidèle à la plante, mais très graphique sur les cartes.
- Je n'ai pas compté les éléments d'une tête isolée au détail de l'appli (DET 1). L'héliconia pendant, avec ses 8 à 11 bractées en deux moitiés, est probablement au-dessus de 150 éléments, mais le total par bouquet reste stable.
