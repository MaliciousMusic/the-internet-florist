# Abeille domestique, ouvrière (*Apis mellifera*) : état au 2026-10-24

Session 01 du chantier insectes : reprise réaliste après le rejet de la première passe (porteur, 2026-10-23). La méthode
est celle du machaon (PROTOCOLE §1 à §7). Les photos et les planches photo | rendu restent dans `refcache/apis-mellifera/`.
Les rendus seuls `planches/paire-*.png` restent sur disque, hors de git.

## Fait

### Photos par organe
La couverture de `refs_hd.py couverture apis-mellifera` est complète : 37 photos inscrites, dont 31 ok. Sources par organe :
- tête et œil de face : c213, c214, c215 (Diego Delso, CC BY-SA 4.0) ; de profil : c256 (USGS BIML, domaine public) ;
- antennes : c214, c255 ; pièces buccales et glosse : c140 (CC BY 2.0), c214 ;
- thorax : c256, c217, c105 ; abdomen vu de dessus : c282, c134 ; de profil : c311, c181, c304 ;
- pattes : c273 (patte arrière et corbeille, CC0), c166, c181 ;
- ailes : c278 et c282 (spécimens épinglés sur plaque blanche, nervures nettes), c083 (ailes coupées à plat), c091, c082,
  c089, c090 (microtriches au microscope).

### Mesures de référence (littérature)
- Aile antérieure 9,13 × 3,00 mm, tête 3,19 × 3,68 mm, tibia 2,91 mm (relevé de l'Himalaya du Nord-Ouest).
- Aile postérieure 6,74 mm, fémur 2,84 mm, tibia 3,09 mm (1,22 de large), métatarse 2,52 × 1,21 mm, 21 à 23 hamuli
  (Al-Kahtani et Taha 2021, *PLoS ONE* 16 : e0247262, *A. m. carnica* ; l'article fait l'objet d'une expression of concern
  de 2023).
- Battement : Altshuler et al. 2005, *PNAS* 102 : 18213.

### Ailes : membrane transparente mesurée (`outils/membrane.py`, nouvel outil partagé)
- **Mesure.** `aile.py` sert de bibliothèque, sans être modifié. `membrane.py plat` mesure l'aile sur sa plaque :
  - le masque vient de la plaque elle-même, sans modèle (`masque: "plaque"`) ;
  - l'aile est remise à plat malgré le raccourci des ailes relevées : l'échelle vient de la corde (3,00 mm), le cos de la
    portée du rapport longueur / largeur ;
  - le fond derrière l'aile est ajusté, puis la transmission est mesurée par canal ;
  - les nervures sont relevées par black-hat (nervures transverses comprises), avec leur largeur et leur couleur.
- **Aile avant** (`ailes/avant.json`, c278) :
  - 9,29 × 3,18 mm à 124,3 px/mm, relevée de 33° (cos 0,835) ;
  - transmission T = 0,944 / 0,925 / 0,861 ;
  - 43 traits de nervures.
- **Écart de l'aile remise à plat** : ΔE2000 médian 1,6, p90 8,8, 3 cases de 1 mm sur 18 au-dessus du seuil.
- **Aile arrière** (`ailes/arriere.json`) : 7,50 mm relevés, ramenés à la longueur publiée de 6,74 mm ; 13 traits ;
  transmission empruntée à l'aile avant.
- **Teinte.** Le SVG mélange en sRGB : la transmission est passée en sRGB avant d'en tirer l'opacité et la teinte. Le
  calcul en linéaire jaunissait la membrane (ΔE à plat 6,3 au lieu de 1,6).

### Corps : grilles mesurées sur c282
- Grilles 72 × 18 (`plat_corps.py` puis `grille_corps.py`) pour l'abdomen et le thorax.
- Les colonnes de bord sont coupées à |u| ≤ 0,8 : elles lisaient la plaque blanche.
- Le ventre vient de c278.
- Le thorax est étalonné en Lab (−6,8, +0,5, +1,3).
- Proportions (littérature et photos) : abdomen 6 tergites, le plus large vers 60 %, pointe conique ; thorax presque sphérique
  de 3,9 mm ; tête de 3,7 mm de large.

### Module (`abeille.mjs`), groupé `p-<organe>`
- **Yeux** gris-brun marbrés, avec :
  - un reflet de fenêtre étiré le long de la courbure ;
  - les facettes (0,022 mm), dessinées dès 1,5 px ;
  - des poils entre les facettes.
- **Tête** : trois ocelles ; clypéus noir luisant ponctué ; labre et mandibules.
- **Antennes** coudées : scape et 11 articles.
- **Glosse** déployée, avec galéas et flabellum, dans la pose `butine`.
- **Poils** courts, denses, effilés et courbes :
  - en bord de silhouette, frange dorée à contre-jour (`hair.rim`) ;
  - sur la face, couchés vers la bouche (`hair.toward`).
- **Abdomen** :
  - cuticule ambrée translucide (`transAlb`), où la lumière passe par les bords minces ;
  - bandes de tomentum, lèvres des tergites avec leur ombre ;
  - satiné, sans tache blanche.
- **Pattes** noires brillantes :
  - corbeille sur le tibia arrière, frangée de longs poils ;
  - brosse du basitarse ;
  - pelotes de pollen en option.
- **Ombres portées entre les pièces** : celles du moteur (tête sur thorax, ailes sur abdomen).
- **Vol** : trois dessins de deux jeux d'ailes sur le huit du battement (retournement avant, milieu de course, retournement
  arrière), sans flou. L'aile arrière suit l'aile avant à 6° près (hamuli).
- **Ailes au repos** posées à plat sur l'abdomen, relevées d'environ 4°.

### Comparaison photo | rendu et juge
- Paires : profil-311, profil-181, dessus-282, face-214. Leurs cadres sont calculés depuis des repères (tête, pointe) par
  `outils/cadrage.mjs`.
- `outils/regions.py` découpe chaque paire en régions. Il mesure, sur l'insecte seul, le ΔE médian, le contraste et le
  grain (rendu / photo).
- **Trois passes** :
  - premier juge neuf : ko ;
  - corrections, puis second juge neuf : ko, encore sur l'abdomen, la face et la patte arrière ;
  - nouvelles corrections, puis mesure.
- Le troisième juge n'a pas été lancé : après deux tentatives, les résidus sont parqués (règle de rythme).

ΔE2000 médian par région, avant puis après la dernière passe :

| paire | tête | thorax | abdomen | pattes | ailes |
|---|---|---|---|---|---|
| dessus-282 (spécimen d'étalonnage) | 17,1 → 17,6 | 10,1 → 8,9 | 10,4 → 10,6 | 10,4 → 9,2 | 10,6 → 10,3 |
| profil-311 (vivante) | 19,2 → 20,6 | 15,7 → 16,3 | 20,0 → 18,2 | 15,7 → 15,9 | 18,2 → 16,6 |
| profil-181 (vivante) | 17,3 → 18,8 | 21,6 → 21,8 | 19,5 → 16,1 | 12,2 → 14,7 | 17,4 → 17,6 |
| face-214 | 11,5 → 12,9 | | | | |

Sur dessus-282, l'écart de clarté de l'abdomen passe de −5,4 à −1,0, et son contraste de 0,86 à 0,96.

### Comportement et démo
- **Comportement** : `COMPORTEMENT.md` (sources des chiffres en fin de fiche).
- **Butinage** : pose `butine`, glosse sortie.
- **Nombre à l'écran** : quatre abeilles au plus (`MAX_VISIBLE` dans `runtime/abeille.mjs`). Au-delà, `?n=` fait attendre
  les autres hors de la vue.
- **Atlas** : voir « Atlas » plus bas.

### Le machaon est resté identique au pixel
Trois cellules sont rendues avant et après chaque changement du moteur (`outils/temoin.mjs`). Leurs empreintes ne changent
pas :
- S_pose_0_0_20 : svg 6badfe245d449b26, png 588637457893d7bc ;
- L_vol_0_90_40 : svg 80c6efa7d2d96e68, png 7f14c05faab715cb ;
- L_butine_0_150_65 : svg 5d728e6fb5047ac9, png 7468c677d0d125a9.

## Fichiers partagés touchés

- `insectes/moteur/insecte.mjs` : ajouts derrière des clés nouvelles seulement (+73/−1) :
  - `material.window` : reflet de fenêtre ;
  - `material.transAlb` : cuticule translucide ;
  - `body.ommatidia` : facettes, avec `min` ;
  - `hair.rim` : frange à contre-jour ;
  - `hair.toward` : sens de pose des poils, point par point ;
  - `wing.veinGroups` : nervures mesurées, groupées par largeur.
- `insectes/outils/membrane.py` : nouveau, ailes transparentes mesurées. Il utilise `aile.py` sans le modifier.
- `insectes/runtime/abeille.mjs` : propre à l'abeille (`MAX_VISIBLE`, pose `butine`).
- Non touchés : `runtime/essaim.mjs`, `runtime/vue.mjs`, `runtime/papillon.mjs`, `demo/demo.mjs`.
- `FOREWING` et `HINDWING` restent exportés tels quels : `bourdon.mjs` les importe.

## Résidus

1. **Race.** Les abeilles vivantes de référence (c311, c181) sont plus sombres que le spécimen d'étalonnage c282 : en profil,
   le rendu est plus clair de 14 à 27 en L sur le thorax, l'abdomen et les ailes. C'est surtout une différence de race et de
   lumière, pas de dessin.
2. **Yeux vus de dessus.** Ceux du spécimen séché c282 ont pâli : ΔE de la tête autour de 17, attendu.
3. **Cartes de forme SAM et profondeur** (`outils/forme.py`) : jamais lancées. Le verrou à une place (`GATE_MAX=1`) n'a
   pas trouvé de créneau, avec neuf sessions sur le PC. Les proportions viennent de la littérature et des repères des
   photos.
4. **Aile arrière** : relevée dans un autre plan que l'aile avant, ramenée à 6,74 mm ; sa transmission est celle de l'aile
   avant. Le bout plié de l'aile avant de c278 est remplacé par l'enveloppe convexe du contour.
5. **Second juge (ko), points restants** :
   - face : capsule encore peu triangulaire dans la boule de poils ;
   - stries régulières dans le poil du thorax vu de dessus (le champ de mèches du moteur est périodique en θ ; on ne le
     change pas, pour garder le machaon identique) ;
   - pointe de l'abdomen un peu facettée en profil.
6. **Abeille butinant en grand** : la pose `butine` n'est cuite qu'en S. Une abeille butinant en grand affiche donc la
   cellule S agrandie (repli d'`essaim.mjs`).

## Questions (avec propositions)

1. **Quelle race prendre pour cible ?** Proposition : garder l'étalonnage sur c282, ambrée et proche de *ligustica*, la plus
   courante en image. Une variante sombre de type *carnica* ne demanderait qu'un second jeu de grilles.
2. **Faut-il cuire la pose `butine` en L ?** Proposition : oui, si le poids le permet. Il faudrait 42 cellules de plus, et
   sans doute une seconde feuille L.
3. **Faut-il lancer les cartes SAM quand le PC est libre ?** Proposition : oui, en une passe de nuit
   (`GATE_MAX=1 sh ws/gate.sh sh sam.sh`), puis comparer les profils de forme aux rendus (`forme.py rendu`).
4. **Faut-il garder les durées de COMPORTEMENT ?** Elles restent à confirmer sur vidéos de butinage (question déjà ouverte
   dans la fiche).
