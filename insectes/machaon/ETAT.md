# Machaon (Papilio machaon) : état au 2026-10-23

L'espèce pilote de la reprise réaliste des papillons (PROTOCOLE §3.4 à §3.6). Les sessions des autres papillons (paon-du-jour,
moro-sphinx) suivent cette méthode.

## Fait

### Ailes
Les quatre faces sont mesurées sur les spécimens étalés du MHNT : dessus sur c255 (43,5 px/mm), dessous sur c032 (42,6 px/mm).
Elles passent par `aile.py plat`, et les chiffres sont dans `ailes/*.json`.

- **Masques.** SAM, puis le fond neutre de la planche. Les cadres (`ailes/cadres.json`) contiennent :
  - les limites lues sur la grille entre les deux ailes ;
  - la bande cachée, complétée par l'autre face recalée sur les vrais bords. L'écart moyen est de 0,43 mm sur l'aile avant et de
    0,46 mm sur l'aile arrière ;
  - la base sous le corps, comblée (5,2 mm² sur l'aile avant vue de dessus).
- **Zones, poudre et matière.** On mesure les zones et leur dégradé. Le bleu de l'aile arrière est traité en poudre de grains
  seulement. On mesure aussi la poudre (axes, angle et espacement des grains), les rangées d'écailles (période 0,092 à 0,113 mm,
  centre ajusté à 4 à 6° près), la frange et les longs poils de la base.
- **Étalonnage.** La poudre et la couleur des zones sont étalonnées (`ailes/etalonnage.json`, 3 tours). Les noirs du dessous,
  mesurés sur un spécimen sec, sont ramenés à ceux des vivants : L* 16,5 sur c032 contre 7 à 10 sur c131 et c086.
- **Paires à plat** (ΔE2000 par case de 3 mm) :

| face | ΔE médian | p90 | cases ko | contraste | grain |
|---|---|---|---|---|---|
| avant-dessus | 2,8 | 4,9 | 4 / 74 | 0,96 | 0,64 |
| avant-dessous | 2,8 | 6,2 | 9 / 68 | 0,92 | 0,53 |
| arriere-dessus | 4,4 | 9,4 | 18 / 69 | 0,90 | 0,72 |
| arriere-dessous | 3,2 | 7,0 | 9 / 70 | 0,96 | 0,68 |

Les nervures sont relevées en traits mesurés (black-hat, puis squelette), avec leur largeur et leur couleur. Les poils de la base
sont sombres, à pointe claire.

### Juge neuf (§11.4)
Premier passage : **ko**. Corrigé ensuite :
- la charnière : le balayage se fait dans le plan de l'aile, puis le battement ; au repos, l'aile avant est tirée en arrière ;
- les noirs vivants sur les deux faces ;
- le moiré des rangées d'écailles (supprimées) et la tuile de poudre répétée (2,4 mm, 260 grains) ;
- les nervures, et la frange claire de la base, qui faisait couture ;
- les yeux (satinés et écartés), les palpes, les pattes sous le corps, l'abdomen (bout rond, mat), les poils du thorax couchés ;
- la pose au soleil (ailes avant tirées en arrière).
Le second passage du juge n'a pas encore été fait.

### Corps
Mesuré sur c255 et c032 pour les longueurs, et sur les vivants c041, c120, c125, c038 et c147 pour l'œil, la trompe et la tenue.

- **Thorax et abdomen.** Leurs grilles de 72 × 18 viennent de `plat_corps.py` et `grille_corps.py` : dos noir entre deux bandes
  jaunes, flancs crème à lignes noires dessous.
- **Tête.** Yeux noirs brillants à facettes, palpes crème rayés de noir, touffes jaunes du front.
- **Appendices.** Antennes de 12,4 mm à massue de 2,4 mm ; trompe enroulée sur deux tours et demi, ou déroulée pour butiner ;
  tégulae poilues sur la base des ailes antérieures ; six pattes marcheuses en articles.

### Organisation, atlas et animation
- **SVG par organe.** Chaque organe a son groupe `p-<organe>`. Le papillon entier en gros plan fait 3,8 Mo (19 Mo avant
  l'optimisation), une cellule L de l'atlas 0,8 Mo de SVG.
- **Atlas du corps.** Poses vol, pose et butine. Le niveau S fait 100 Ko (234 cellules, 1,2 Mo GPU), le niveau L 211 Ko
  (126 cellules, 5,4 Mo GPU).
- **Ailes au runtime.** Une feuille de 94 Ko (1,8 Mo GPU), quatre quads par papillon (`essaim.placeWings`).
- **Comportement** (`runtime/papillon.mjs`) :
  - vol en battements (5,5 par seconde) coupés de planés ;
  - arrivée sur une fleur, atterrissage ;
  - butinage trompe déroulée, ailes battant lentement ;
  - ailes ouvertes au soleil, ailes fermées au repos ;
  - envol, puis départ ; fuite au clic.
- **Démo** : `insectes/demo/index.html?n=0&machaon=2&taille=3`, serveur `insectes-suite`, port 8812.

## Résidus (garés après deux essais, §17.1)
1. **Bleu de l'aile arrière** (arriere-dessus, 18 cases ko). La lunule bleue de la photo est une poudre très dense de grains bleu
   clair sur noir. Le rendu la donne plus éparse et plus grise, et l'ocelle orange est un peu plus pâle que sur la photo.
2. **Dessous en vue entière.** Il paraît plus gris que la photo en vue entière, à cause de l'éclairage du dessous (lam), alors qu'à
   plat il est à ΔE 3,1. Il faut le comparer sur une photo vivante ailes fermées (c131).
3. **Longs poils de la base.** Leur direction est juste, mais ils restent moins denses et plus raides que sur la photo.
4. **Abdomen.** Les bandes sont mesurées. Sa largeur vient des vivants (rayon 2,1 mm), car le spécimen étalé l'aplatit
   jusqu'à 5,8 mm. De près, sa matière reste plus lisse que les écailles de la photo, et les lignes noires des flancs restent dans
   l'ombre.
6. **Aile vue de chant au runtime.** Elle donne une ligne pointillée fine (mipmap du quad écrasé). C'est juste physiquement, mais
   on pourrait la masquer sous 5° d'incidence.
5. **Pose repos.** Les ailes antérieures sont tirées en arrière de 62° dans leur plan, d'après c131, c086 et c013. On n'a pas de mesure plus
   fine : le recouvrement exact se juge sur une paire à angle égal.

## Questions au porteur
- Valider le machaon (planche des paires, planche d'animation, démo) avant les autres insectes.
- La méthode des ailes repose sur les spécimens étalés du MHNT (CC BY-SA), dont on extrait des chiffres seulement. Le porteur l'a
  validée le 2026-10-23.
7. **Lunules du dessous** : gris-bleu pâle en aplat, au lieu de grains bleus. **Nervures fines du dessous de l'aile avant** :
   relevées en partie seulement.
8. **De face** : la tête et la trompe sont encore schématiques. Le juge les a vues avant la correction des yeux et des palpes.
