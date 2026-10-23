# Fourmi noire des jardins (*Lasius niger*), ouvrière : état au 2026-10-23

Session 05 du chantier insectes, reprise réaliste au niveau du machaon (PROTOCOLE §1 à §7). La première passe (17 lignes dans
`moteur/fourmi.mjs`) est remplacée par un modèle propre à l'espèce, `fourmi-noire.mjs`, mesuré sur photos.

## Fait

### 1. Photos par organe
37 photos inscrites dans `refcache/lasius-niger/refs-organes.json` (hors git), planche `refcache/lasius-niger/contact.jpg`.
`refs_hd.py couverture` : toutes les cases de l'ouvrière sont couvertes (insecte dessus 7, profil 10, face 2, trois-quarts 14,
dessous 1 ; tête 8 et face 5 ; yeux 5 ; antennes 5 ; pièces buccales 4 ; thorax 3 ; abdomen dessus 4 et profil 5 ; pattes 2). Les
cases « vol » et « ailes » sont sans objet : l'ouvrière n'a pas d'ailes.

- **Mesures à l'échelle** : l'ouvrière AntWeb casent0178774 (Commons, CC BY 4.0, April Nobile) en trois vues avec barre
  d'échelle : tête de face c033 (0,2 mm, 608 px/mm), dessus c095 et profil c138 (0,5 mm, 347 px/mm). Le petit côté de ces images
  fait 808 px (refqc les note « ko »), mais le sujet y est à 350 à 600 px/mm, bien plus fin que sur une photo de terrain.
- **Vivantes** : c254, c248, c247, c252, c256 (une même ouvrière sur fond blanc, iNaturalist 265077941), c107 à c122 et c183
  (Alicante, *L. niger* probable), c237, c238 et c257 à c260 (têtes en gros plan), c245, c230, c249 et c250 (dessous, portant une
  nymphe), c242, c233 à c235.
- **Exclues**, avec leur raison dans le registre :
  - c185, c108 et c089 : identification douteuse, sans lieu ; tête de *Camponotus*.
  - c232 et c236 : *Lasius americanus*, selon iNaturalist.
  - c229 : une gyne.
  - c239 à c241 et c244 : des reines désailées.
- Les photos iNaturalist sous licence NC servent à la mesure locale seulement (des chiffres, jamais l'image, comme le veut
  STANDARD-SOURCES).

### 2. Cartes de forme et grilles
- `outils/carte_fourmi.py` : SAM et Depth Anything (venv `vases5/.venv-depth`), plus un mode `seuil` sans modèle pour une fourmi
  sombre sur fond clair. Il mesure le profil du tronc (pattes et antennes ôtées par ouverture), les longueurs et hauteurs des
  pièces, et le ton (L* p10/p50/p90, lustre, contraste, grain).
- Le lot SAM et profondeur (`refcache/lasius-niger/cartes/lot1.json`, 5 vues) attend toujours le verrou : la RAM libre n'a pas
  dépassé 5,5 Go de la session. Les cartes par seuil sont faites (c254, c248, c107, c033).
- `outils/grille_fourmi.py` : grilles 72 × 18 lues le long de l'axe dans le masque de la carte. Options :
  - `--pct 35` : écarte les reflets et les poils clairs ;
  - `--plat 8` : retire la lumière propre de la photo (albédo) ;
  - `--lisse` : lissage ;
  - `--niveau`, `--ab` et `--chroma` : ramènent la lumière de studio à la lumière de jour.
- Grilles mesurées sur c248 : gastre (bords de tergites à 33, 60, 80 et 93 %), mésosome, tête.
- Niveaux réglés sur les photos de jour et sur la photo à fond gris neutre c250 : L* 21 à 23, a* 5,5 à 7, b* 8,5 à 9.

### 3. Modèle (`fourmi-noire.mjs`)
- **Mesures.**
  - Longueur 4,0 mm. Tête : CL 1,0 et CW 0,86 mm (0,93 avec les yeux), portée face en bas à 40°.
  - Œil 0,30 × 0,21 mm, à 42 % de CL.
  - Insertions antennaires à 64 % de CL, scape 0,88 mm, funicule de 11 articles en légère massue.
  - Mésosome : un dôme promésonotal (pronotum 0,58 mm de large, suture en léger creux), le sillon métanotal, puis le
    propodéum, 15 % plus bas, avec son stigmate.
  - Pétiole à une écaille mince et cunéiforme. Gastre ovale de 1,6 × 1,2 mm, à quatre tergites.
  - Pattes : hanche, trochanter, fémur et tibia comprimés latéralement, éperon (le calcar de la patte avant), cinq tarsomères et
    deux griffes.
- **Matière.**
  - Pubescence couchée, courte et dense (deux couches de poils par pièce, clé moteur `hairMore`).
  - Soies dressées en rangées devant le bord de chaque tergite, et sur le tibia arrière et le tibia médian (un caractère de
    *L. niger*).
  - Clypéus caréné, à pubescence dense ; lobes frontaux.
  - Mandibules dentées : 8 dents, brun-rouge, noires à la base.
  - Facettes de l'œil visibles en gros plan (clé moteur `facetsA`).
  - Satiné chaud et diffus sur le gastre ; microsculpture (ponctuation fine) sur la tête et le mésosome.
- **Organes groupés** (`p-<organe>`) : tete, oeil-g/d, antenne-g/d, mandibule-g/d, palpe-g/d, thorax, petiole, gastre,
  patte-avant/milieu/arriere-g/d, petale.
- **Poses** : `pose` ; `marche` (8 images, tripode alterné, facteur de service 0,6, balayage de 1,5 mm en appui, antennes
  battant en alternance) ; `porte` (tête levée, mandibules ouvertes) ; `palpe` (4 images) ; `petale` (le fragment seul, teinté
  au runtime).

### 4. Paires photo | rendu
Les paires sont dans `paires.json`. L'outil `outils/paires_fourmi.py` calcule ΔE2000, la teinte seule, l'écart de L*, le contraste
et le grain, par vue et par région, et fait les recadrages à 100 et 200 %. Les chiffres vont dans `paires-mesures.json`, les images
dans `refcache/lasius-niger/paires/` (hors git).

Mesures finales. La colonne « teinte » donne le ΔE de la teinte seule, à L* égal. Les vues studio sont éclairées par une boîte
à lumière blanche, bien plus claire que la lumière de jour de l'atlas : sur elles, seules la teinte et la forme comptent.

| vue | ΔE entier | teinte | ΔL* | contraste | grain | régions (ΔE) |
|---|---|---|---|---|---|---|
| profil studio (c254) | 22,1 | 6,3 | −25 | 2,11 | 1,17 | tête 22,0 (teinte 3,9), mésosome 24,2 (10,2), gastre 21,5 (4,5) |
| dessus studio (c248) | 24,8 | 7,1 | −29 | 1,75 | 0,75 | tête 23,9 (2,5), mésosome 26,8 (9,7), gastre 23,1 (6,9) |
| profil jour (c107) | 8,8 | 7,4 | +7 | 0,85 | 2,36 | gastre 8,3, mésosome 9,6, tête 9,9 |
| trois-quarts jour (c245) | 10,5 | 8,2 | −9 | 2,07 | 1,81 | tête 5,2 |
| face jour (c237) | 8,9 | 7,6 | −6 | 0,90 | 1,51 | tête 2,9 |
| dessous (c250) | 4,5 | 4,2 | +2 | 0,96 | 1,41 | gastre 2,7 (ok), tête 6,2 |

Les photos de jour s'écartent de ±10 en L* entre elles (exposition, reflets du décor). Le niveau du rendu se tient au milieu :
il est plus clair que c107 et plus sombre que c245 et c237. Le grain du rendu dépasse celui des photos floues (c107 est prise à
faible profondeur de champ), et reste proche de celui des photos nettes.

### 5. Juge neuf
Premier passage : **ko** sur toutes les vues, 14 défauts. Ils ont été corrigés :
- mésosome en boudin, puis en anneaux ;
- pétiole en tige noire ;
- gastre en cloche et ergot à l'apex ;
- reflet blanc dur ;
- pattes en tubes ;
- tête carrée ;
- mandibules soudées sans dents ;
- yeux plats ;
- cavité noire des insertions ;
- pubescence en pluie ;
- teintes disparates ;
- scape épais et funicule sans articles ;
- antennes raides et pétale en gélule ;
- cadrage de deux paires.

Second passage (un autre juge neuf) : **ko** encore. Les défauts relevés :
- cuticule « plastique » ;
- pubescence blanche, à l'orientation aléatoire ;
- mésosome encore annelé ;
- gastre trop allongé ;
- coude des antennes peu lisible ;
- yeux trop saillants et brillants ;
- mandibules sans dents visibles ;
- côtés de la tête droits et lobes frontaux en moustache ;
- pattes uniformes et palpes trop longs ;
- pétiole en boule ;
- pétale porté trop gros ;
- palpation peu lisible.

Corrigé ensuite, en un essai :
- ponctuation à éclats (`glint`), reflets plus courts ;
- pubescence crème-or, couchée vers l'arrière, deux fois plus dense ;
- mésosome d'un seul ton, pronotum à 60 % de la largeur de la tête et suture du mésopleuron ;
- gastre ovale (1,45 × la hauteur) avec des liserés de tergites marqués ;
- coude de 110° environ, scape effilé, anneaux aux articulations ;
- yeux mats, relief divisé par deux ;
- dents plus grandes, mandibules rentrées sous le clypéus ;
- côtés de la tête bombés, lobes ôtés ;
- pattes plus claires de 8 en L*, palpes réduits au tiers de la tête ;
- écaille haute et mince ;
- pétale de 1,5 mm, translucide et relevé ;
- palpation de ±34°.

Selon la règle des deux essais (§17.1), les écarts restants sont garés plus bas. Le troisième passage du juge n'a pas été fait.

### 6. Animation, comportement, atlas, démo
- **Planche** : `planches/marche.png`, faite par `outils/planche-marche.mjs`. Elle montre la marche de profil et de dessus, le
  diagramme des appuis, le port d'un pétale et l'arrêt où les antennes palpent.
- **Comportement** : `runtime/fourmi.mjs` (préréglage `LASIUS`), chiffres et sources dans `COMPORTEMENT.md`.
- **Démo** : `insectes/demo/index.html?n=0&fourmi=7`, serveur `insectes-05` (`python -m http.server 8825`, `.claude/launch.json`).
- **Atlas** : 2 025 cellules cuites en 31 min, passées par le verrou. Le niveau S compte 1 430 cellules de 20 px, à 13 azimuts et
  5 élévations, pour les poses pose, marche, porte, palpe et petale ; il pèse **287 Ko (2,2 Mo sur le GPU)**. Le niveau L compte
  595 cellules de 48 px, à 7 azimuts, pour les poses marche, porte et petale ; il pèse **385 Ko (5,3 Mo sur le GPU)**. Les
  8 fourmis partagent ces 672 Ko et 7,5 Mo.
- **Démo vérifiée** dans le navigateur, avec `?n=0&fourmi=7&taille=4`. Les fourmis marchent sur la bande de sol au pied du vase,
  s'arrêtent et se rencontrent. Après un clic, toutes vont aux pétales, prennent un fragment teinté (sprite `carry`) et
  l'emportent vers les bords. Les pétales rapetissent à mesure qu'on les découpe.

## Moteur partagé (pour l'intégration)
- `moteur/insecte.mjs`, deux ajouts derrière des clés nouvelles :
  - `b.hairMore` : d'autres couches de poils sur une pièce ;
  - `b.facetsA` : l'opacité des facettes.

  Le machaon reste identique à l'octet : trois cellules L (`pose 30/20`, `vol 120/40`, `butine 90/0`) rendues avec le moteur du
  commit 223d2c9 et avec celui-ci donnent des SVG et des PNG identiques (`outils/preuve-machaon.mjs`).
- `runtime/essaim.mjs`, un ajout derrière la clé `insect.carry` : le sprite du fragment porté, qui reprend la cellule `petale` de
  la même vue et la même échelle, teinté par `carryTint`.
- `runtime/fourmi.mjs` : un fichier nouveau. La classe `Fourmi` est générique et la session 06 peut y ajouter son préréglage.
- `demo/demo.mjs` : une clé nouvelle `?fourmi=N` (8 au plus). Elle ajoute une bande de sol au pied du vase, cinq pétales fanés
  sur leur propre canvas et deux sorties du nid.
- `moteur/fourmi.mjs` n'est **pas** touché : il reste celui de la session 06 (note `05-fourmi-noire.md` dans le dossier de notes
  partagé, et message envoyé à la 06).
- `.claude/launch.json` : l'entrée `insectes-05`, port 8825.

## Poids du SVG
| rendu | taille | éléments |
|---|---|---|
| gros plan à 30 px/mm | 1,8 Mo | 4 750 |
| gros plan à 120 px/mm | 2,5 Mo | 8 330 |
| cellule L (96 px) | 1,1 Mo | 3 900 |
| cellule S (40 px) | 0,64 Mo | 2 330 |

Le SVG compte 72 groupes `p-<organe>`. Il est plus lourd que celui du machaon (0,8 Mo pour une cellule L) : la fourmi a
62 pièces, dont 54 articles de pattes, chacun avec son maillage, son flou et sa découpe. Voir le résidu 6.

## Résidus (garés après deux essais, §17.1)
1. **Cuticule.** Le rendu reste plus lisse que la photo : la microsculpture réticulée de la tête et du mésosome n'est
   suggérée que par une ponctuation fine. Il faudrait une texture de réseau en relief, mesurée sur c033 et c138.
2. **Mésosome.** Le profil est juste (dôme, sillon, propodéum bas), mais les pleures restent lisses. Il manque les sutures
   mésopleurales nettes et la face déclive plane du propodéum.
3. **Pattes.** Les articles sont présents (hanche, trochanter, fémur, tibia, éperon, cinq tarsomères, griffes), mais à
   100 % ils se lisent encore comme des tubes. Il manque les soies du bord interne des tarses et le peigne du calcar.
4. **Bouche et antennes.** Les dents des mandibules ne se voient qu'au-delà de 200 %. Les palpes sont simplifiés en tubes
   articulés.
5. **Gastre.** La proportion de 1,45 (longueur sur hauteur) est entre la photo studio (1,35) et c107 (1,54), car les ouvrières
   varient avec leur réplétion. Les membranes intersegmentaires claires d'une ouvrière gorgée ne sont pas faites
   (`P.repletion` est prévu, à 0).
6. **Poids.** On pourrait alléger la cellule S de moitié en sautant les tarsomères et les griffes sous 1 px. Ce n'est pas fait,
   car cela ne change pas l'atlas WebP livré.
7. **Cartes SAM et profondeur.** Le lot est prêt, mais n'a pas tourné : le verrou demande 5,5 Go libres et la RAM est restée
   entre 3,4 et 4,7 Go, avec neuf sessions. Les mesures de forme viennent des cartes par seuil et des repères lus sur les grilles.

## Questions au porteur
- **Le pétale porté.** C'est un fragment de 1,5 mm découpé dans un pétale tombé, un sprite à part teinté de la couleur du
  pétale. Proposition : garder cette convention pour tous les bouquets, le fragment tirant sa teinte du pétale fané le plus
  proche.
- **Le nid.** Où se trouve-t-il sur le site et dans le widget ? Proposition : hors du cadre, aux deux bords de la bande de sol.
- **La foulée, les arrêts et le rythme des antennes.** Ce sont des propositions (COMPORTEMENT.md). Faut-il une mesure sur vidéo
  (une fourmi filmée de dessus à 240 i/s) avant la validation ?
