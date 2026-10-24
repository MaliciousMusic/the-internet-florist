# Fourmi rouge (Myrmica rubra, ouvrière) : état au 2026-10-23

## Question au porteur, en tête
- **L'espèce.** *Myrmica rubra* est proposée, pas encore confirmée. Tout le travail est fait sur elle : photos, mesures, grilles et
  comportement. **Proposition** : la garder. C'est la « fourmi rouge » commune des jardins d'Europe, qui vit près des fourmis noires.
  Elle est documentée en macro (AntWeb, iNaturalist) et ses chiffres de marche sont publiés pour l'espèce même (Cammaerts et al.
  2012).

## Fait

### 1. Photos par organe (PROTOCOLE §1)
41 photos inscrites dans `refcache/myrmica-rubra/refs-organes.json`, hors git, chacune avec sa source, son auteur et sa licence.
- **Ouvrières vivantes en HD**, iNaturalist de grade recherche, CC BY ou CC0, 1250 à 2048 px :
  - c115 et c113, profil sur fond blanc ;
  - c123, dessus sur fond blanc, très net, CC0 ;
  - c124, face ;
  - c119 à c122, macros studio de la tête et du mésosome ;
  - c126, c130, c131, c134, c136, c137.
  Elles s'ajoutent à c012 à c016 (Commons, dont c013, profil de 3840 px).
- **Ouvrières AntWeb** (spécimens à barre d'échelle, CC BY 4.0) : casent0104804, 0172750, 0010684, 0179930 et 0922785, en
  profil, dessus et tête.
  - Elles ne font que 808 px de haut : refqc les note « ko » pour la taille seule.
  - Elles servent à la forme et à la sculpture, mesurées à l'échelle.
  - Les reines et les mâles des mêmes lots sont écartés (ocelles, ailes).
- **Couverture** (`refs_hd.py couverture`) : complète pour la tête, les yeux, les antennes, les pièces buccales, le thorax,
  l'abdomen et les pattes.
  - Il manque la vue de dessous (voir les résidus).
  - Le vol et les ailes ne concernent pas une ouvrière.
- **Outil** : `outils/refs_ext.py`, qui inscrit des photos hors Commons (iNaturalist, AntWeb) comme candidates.

### 2. Mesures et formes (PROTOCOLE §2)
- **Longueurs en mm** (`mesures.json`), lues à la grille millimétrée sur les spécimens AntWeb (`outils/echelle.py`). L'échelle est
  lue sur la barre de chaque photo (227 à 524 px/mm).
  - Tête : CL 1,13 et CW 0,94 mm ; œil de 0,25 × 0,20 mm, centré à 0,55 CL de l'occiput.
  - Mésosome : 1,5 mm ; épines de 0,27 mm, relevées de 30°.
  - Nœuds : pétiole de 0,48 × 0,40 mm, postpétiole de 0,35 × 0,45 mm.
  - Antenne : 12 articles, scape de 0,85 mm.
  - Fémurs : 0,9, 1,05 et 1,3 mm.
- **Proportions de l'ouvrière vivante** (`mesures.json`, clé `vivant`), rapportées à la largeur de la tête, qui est rigide. Le
  gastre sec des spécimens se rétracte, celui des vivantes est distendu. Gastre de 1,62 × 1,35 × 1,25 mm ; pronotum large de
  0,78 mm.
- **Sculpture mesurée au spectre** (`outils/sculpture.py`) :

| zone | rides | période |
|---|---|---|
| tête dessus | longitudinales, ordre 0,5 | 0,06 mm |
| joues | fines | 0,028 mm |
| mésosome | réticulées, ordre 0,22 | 0,145 mm |
| côtés du propodéum | fines | 0,025 mm |
| gastre | lisse | — |

- **Cartes SAM et profondeur.** L'outil est écrit (`outils/forme.py`, `outils/formes.sh` : six photos, deux par vue). Elles n'ont
  **pas pu tourner** : le gate exige plus de 5,5 Go de RAM libre, et la RAM est restée entre 2,8 et 4,7 Go toute la session (voir les
  résidus). Les formes sont donc validées par les mesures à l'échelle et par les paires, pas par les cartes.

### 3. Grilles (PROTOCOLE §3)
- **Outil** : `outils/grille_fourmi.py` (72 × 18). Il met la pièce à plat comme `plat_corps.py`, mais lit l'albédo hors des reflets
  des lampes du photographe : le gastre de c123 reflète une lampe annulaire entière. Il gère aussi un masque pour les fonds clairs.
- **Sources** : tête, mésosome, nœuds et gastre, mesurés sur c123 (dessus) et c115 (profil), puis moyennés en Lab
  (`outils/moyenne.py`).
- **Étalonnage dans le module** (`tune`, en Lab) :
  - chroma +30 à +40 %, car la moyenne de quatre expositions ternit la teinte (les juges lisent « brun chocolat ») ;
  - nœuds remontés de 12 % ;
  - grille du gastre lissée le long de l'axe, pour retirer les bandes laissées par la lampe annulaire.

### 4. Modèle SVG (PROTOCOLE §3.5, §3.6, §4)
- **Construction.** Le corps est construit dans `fourmi-rouge.mjs` avec le kit. `moteur/fourmi.mjs` n'est pas touché.
  - Les profils sont des splines passant par les rangs mesurés.
  - Les rides sont tracées en relief sur la surface : sillon et pli sombre, éclats en tirets sur les crêtes. Elles ne sont tracées
    que si leur période couvre 3 px ou plus.
  - Les soies ont leur vrai diamètre. Les dents des mandibules et l'éperon des tibias sont dessinés.
- **20 groupes `p-<organe>`** : tete, oeil-g/d, mandibule-g/d, antenne-g/d, mesosome, epine-g/d, petiole, postpetiole, gastre,
  aiguillon, patte-front/mid/hind-g/d.
- **Poids** :

| rendu | SVG | éléments |
|---|---|---|
| gros plan à 150 px/mm | 1,8 Mo | 5 700 |
| cellule S | 193 Ko | 730 |
| cellule L | 202 Ko | 810 |

  Sous 22 px/mm, les pattes sont un tube ombré et non des articles maillés : la cellule S est passée de 657 à 193 Ko.

### 5. Paires photo | rendu et mesure par région (PROTOCOLE §5)
- **Vues** (`paires.json`) : profil c013, trois-quarts c115, dessus c123 (tourné, clé `rot`) et face c124.
- **Mesure par région** : `outils/delta.py` (tête, mésosome, nœuds, gastre, pattes ; ΔE2000, contraste, grain). Le détail est dans
  `delta.json`.
- **Synthèse** : rendu moyen contre photo moyenne. Les photos s'écartent elles-mêmes de 3,8 à 5,6 de leur moyenne.

| région | ΔE moyen | dispersion des photos | verdict |
|---|---|---|---|
| tête | 4,0 | 5,6 | ok |
| mésosome | 4,9 | 4,3 | ok (≤ 6) |
| nœuds | 2,6 | 5,1 | ok |
| gastre | 3,2 | 4,5 | ok |
| pattes | 4,7 | 3,8 | ok (≤ 6) |

Chiffres après la cinquième passe de forme (résidu 5). Avant cette passe : tête 3,4, mésosome 3,9, nœuds 1,7, gastre 3,4, pattes
4,9. Les volumes plus hauts montrent plus de flancs dans l'ombre, d'où un rendu un peu plus sombre sur le tronc.

- **Grain.** Celui du rendu est 1,2 à 3 fois celui des photos de profil (soies et rides plus contrastées). Il est de 0,5 à 0,8 sur
  la photo de dessus c123, plus nette.

### 6. Juge neuf (§5.3) : quatre passages, un juge neuf à chaque fois
| passage | verdict | note | ce qui a été corrigé ensuite |
|---|---|---|---|
| 1 | ko | — | matière, relief des rides, tête, taille, gastre ovoïde, pattes, soies, posture |
| 2 | ko | 2,5/10 | couleur ferrugineuse (étalonnage), soies au vrai diamètre, pieds d'après c123, taille continue |
| 3 | ko | 3/10 | couronne d'épines, bloc du cou, ellipse du vertex, reflet rectangulaire, bandes du gastre |
| 4 | ko | 3/10 | trou de la « bouche », antennes en boucle, pattes plates, griffes noires (corrigés, sans cinquième passage) |

Le juge reste **ko**. Les causes restantes sont dans les résidus 1 à 4.

### 7. Sortie
- **Planche d'animation** : `planches/anim.jpg` (`outils/planche-marche.mjs`).
  - Marche en tripode, 8 dessins, vue de trois-quarts et vue de dessus.
  - Palpation, 4 dessins.
  - Pose de profil et de face.
  - Les 5 élévations de l'atlas.
- **Comportement** : `runtime/fourmi-rouge.mjs` (fichier neuf) et `COMPORTEMENT.md` (chiffres sourcés). La simulation
  (`outils/simule.mjs`) donne :
  - en exploration, 8,7 mm/s (cible 8,5 à 9,6) et 159°/cm (cible 154 à 162) ;
  - en alarme, 21,6 mm/s (cible 18 à 25) et 91°/cm (cible 77 à 115).
- **Atlas** : S 199 Ko (1,3 Mo sur le GPU), L 437 Ko (5,5 Mo) ; détail dans la section suivante.
- **Démo** :
  - adresse : `insectes/demo/index.html?n=0&fourmi-rouge=8&taille=3` ;
  - serveur : `insectes-06`, `python -m http.server 8826`, déclaré dans `.claude/launch.json` du dossier (non committé, propre au
    dossier) ;
  - les fourmis marchent sur la table au pied du vase, dans le canvas de devant.

## Atlas
Recuit le 2026-10-24 après la cinquième passe de forme (`outils/cuisson.mjs fourmi-rouge` puis `outils/atlas.py`, derrière le verrou corrigé de `ch/insectes-suite`,
`GATE_MAX=1`) : 1300 cellules en 380 s.


| LOD | cellule | azimuts | cellules | feuille | WebP | GPU |
|---|---|---|---|---|---|---|
| S | 20 px | 15° | 845 | 600 × 580 | 199 Ko | 1,3 Mo |
| L | 56 px | 30° | 455 | 1232 × 1176 | 437 Ko | 5,5 Mo |

- **Poses** : `pose`, `marche` (8 dessins) et `palpe` (4 dessins), aux 5 élévations (−15, 10, 35, 60, 90°).
- **Total** : 636 Ko à télécharger, 6,8 Mo sur le GPU.
- **Dans git** : les feuilles WebP, `fourmi-rouge.json` et `cells.json`. Les cellules PNG (`atlas/cells/`, 7,2 Mo) restent ignorées,
  comme pour les autres espèces.

## Résidus (garés : quatre passages du juge, PROTOCOLE §17.1)
1. **Réalisme en gros plan : 3/10 au juge.** À 150 à 200 px/mm, des corps maillés et des tubes ombrés, avec une sculpture tracée par
   dessus, se lisent encore comme une « illustration ». Les juges demandent trois choses :
   - une sculpture en vrai relief, mate, aux micro-reflets nombreux ;
   - une translucidité ambrée du gastre et des pattes ;
   - des volumes plus organiques (pronotum en écusson, pas de « tube »).
   **Proposition** : un ombrage de sculpture dans le moteur, derrière une clé nouvelle (`b.relief` : une carte de hauteur des rides
   perturbant la normale de chaque quad, avant `shadePoint`), et une transmission plus forte sur les bords minces. Cela touche
   `moteur/insecte.mjs`, qui est partagé : c'est à la coordinatrice ou au porteur de décider.
2. **Vue de face** (c124) : ΔE 13,4. La photo est une ouvrière plus orangée sous une lumière chaude. Le contour de la tête vu de face
   reste trop en U.
3. **Pattes et antennes** : elles restent des articles lisses. Les juges demandent un funicule annelé plus marqué et des tarses
   poilus.
4. **Posture** : les juges trouvent le corps « long et bas » de trois-quarts et les pattes « en échasses ». Les longueurs sont
   mesurées sur AntWeb : c'est la pose des pattes qui est en cause.
5. **Cartes SAM et profondeur : faites le 2026-10-24**, sur le verrou corrigé (`GATE_MAX=1`), pour six photos.
   - Résultats dans `refcache/myrmica-rubra/cartes/`, hors git.
   - Les rendus des paires sont mesurés par le même outil (`forme.py rendu`, puis `forme.py table --ref 2`, plage des deux photos
     élargie de 25 %).
   - Résultat : **7 stations sur 12 hors plage**, de profil comme de dessus. L'écart est le même que celui des juges, un corps
     « long et bas ». Hauteur ou largeur du tronc, en fraction de la longueur L :

   | vue | station | photos | rendu | lecture |
   |---|---|---|---|---|
   | profil | 0,39 à 0,55 (mésosome) | 0,17 à 0,25 | 0,09 à 0,14 | mésosome trop bas d'environ 30 % |
   | profil | 0,05 à 0,14 (tête) | 0,17 à 0,22 | 0,08 à 0,12 | tête trop basse, les mandibules trop en avant |
   | dessus | 0,14 (tête) | 0,22 à 0,28 | 0,18 | tête trop étroite |
   | dessus | 0,72 (avant du gastre) | 0,11 à 0,18 | 0,22 | gastre trop large à l'avant |
   | dessus | 0,55 (pétiole) | 0,06 à 0,12 | 0,08 | dans la plage |

   - Réserves : les pattes repliées sous le corps des photos gonflent un peu leur hauteur de profil ; c013 a la tête levée.
   - **Cinquième passe de forme, faite le 2026-10-24** (deux essais, puis garée). Les facteurs sont dans la constante `SH` de
     `fourmi-rouge.mjs`. Les fichiers du moteur ne sont pas touchés.
     - mésosome plus haut de 25 % (`SH.meso`), propodéum plus épais de 18 % vers l'arrière (`SH.propodeum`), axe relevé d'un
       huitième de demi-hauteur ;
     - tête plus haute de 25 % (`SH.headH`) et plus large de 20 % (`SH.headW`), avant de la tête resserré ;
     - mandibules plus courtes de 0,08 L ;
     - avant du gastre plus étroit (exposant de la courbe de 3,0 avant 0,62, `SH.gasterW` 0,96).
     - Mesure : `sh outils/mesure-rendus.sh` (rendus des paires contre les cartes, 12 stations). **Hors plage : 7 → 6 de profil,
       7 → 4 de dessus.**

   | vue | station | photos | rendu (passe 5) | lecture |
   |---|---|---|---|---|
   | profil | 0,05 (mandibules) | 0,170 à 0,182 | 0,133 | la tête est encore basse à sa pointe |
   | profil | 0,39 | 0,230 à 0,249 | 0,164 | mésosome encore trop bas |
   | profil | 0,47 | 0,182 à 0,195 | 0,148 | idem |
   | profil | 0,55 | 0,165 à 0,231 | 0,114 | la taille du rendu est plus en arrière |
   | profil | 0,64 (postpétiole) | 0,104 à 0,202 | 0,072 | idem |
   | profil | part éclairée | 0,079 à 0,088 | 0,074 | à peine sous la plage |
   | dessus | 0,05 | 0,173 à 0,173 | 0,189 | les deux photos coïncident : la plage est presque nulle |
   | dessus | 0,30 | 0,168 à 0,171 | 0,185 | plage étroite, écart de 8 % |
   | dessus | 0,47 | 0,135 à 0,140 | 0,122 | mésosome un peu étroit à l'arrière |
   | dessus | 0,64 (postpétiole) | 0,071 à 0,090 | 0,050 | taille décalée vers l'arrière |

   - Rentrées dans la plage : de profil, la tête (0,14) et le gastre (0,89, 0,97) ; de dessus, la tête (0,14) et l'avant du
     gastre (0,72).
   - **Ce qui reste.** Ce n'est plus une question d'épaisseur, mais de position le long de l'axe. Le mésosome du rendu est plus
     long, et sa taille (pétiole, postpétiole) tombe plus en arrière que sur les photos. Les stations 0,55 et 0,64 mesurent donc
     un creux là où les photos ont encore du nœud. S'y ajoutent deux stations de dessus dont la plage est presque nulle.
   - **Proposition** (non faite, garée après deux essais) : raccourcir le mésosome de 6 à 8 % de L, en avançant les nœuds d'autant,
     puis remesurer. Cela change les proportions mesurées sur AntWeb (`HEAD`, `MESO`) : c'est au porteur de décider s'il faut
     suivre AntWeb ou les cartes SAM.
   - La vue de face (c124) monte à ΔE 16,4 (13,4 avant) : la tête plus large et plus haute rend la face plus sombre que la
     photo orangée (résidu 2).
6. **Vue de dessous** : aucune photo d'ouvrière vivante vue de dessous. Le dessous du gastre est vu de profil seulement.
7. **resvg plante à 500 px/mm** sur le dessin entier (`geom.rs:27`), mais pas sur chaque organe seul. Jusqu'à 320 px/mm, le rendu
   passe. Pour les gros plans, rester à 320 px/mm au plus, ou rendre par organe.
8. **Chiffres de travail** : la durée des arrêts, celle des rencontres et la palpation (2,2 battements par seconde) sont à mesurer
   sur vidéo (COMPORTEMENT.md).

## Fichiers communs touchés (pour l'intégration)
- **`insectes/outils/paires.py`** : deux ajouts sans effet pour les autres espèces.
  - Une clé optionnelle `rot`, qui tourne la photo avant le recadrage.
  - Un bord hors champ rempli en beige au lieu du noir.
- **`insectes/demo/demo.mjs`** : un ajout derrière la clé `?fourmi-rouge=N` (import, `kind`, bande de sol, colonie).
- **`insectes/runtime/fourmi-rouge.mjs`** : un fichier neuf. Il n'est pas commun, mais il est rangé dans `runtime/`.
- **`moteur/fourmi.mjs`** : non touché. Aucune clé de la session 06 n'y entre ; il reste à la fourmi noire (session 05).
- **`moteur/insecte.mjs`, `kit.mjs`, `geo.mjs`, `runtime/essaim.mjs`, `vue.mjs`, `papillon.mjs`** : non touchés. Le machaon est
  identique au pixel : trois cellules hachées avant et après (`preuve/machaon-avant.json`, `preuve/machaon-apres.json`).
