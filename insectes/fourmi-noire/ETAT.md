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
- Les cartes par seuil sont faites (c254, c248, c107, c033).
- Le lot SAM et profondeur (`refcache/lasius-niger/cartes/lot2.json`, 5 vues) a tourné le 2026-10-24, par le verrou corrigé
  de `ch/insectes-suite`. Au premier passage, SAM rendait le cadre entier (87 à 93 % de l'image) : le cadre donné couvrait toute
  la découpe, et le candidat le mieux noté était « tout le cadre ». L'outil interroge désormais SAM par les points seuls, et il
  écarte tout masque de plus de 60 % de l'image. Les masques sont alors justes sur c254, c107 et c248 (20 à 33 % du cadre,
  score 0,93 à 0,95). c095 est une macro déformée par le grand angle, et c033 une vue de face où l'axe ne mesure rien : ces deux
  cartes ne servent pas aux proportions.
- Le rendu du profil studio est mesuré avec le même outil (mode `rendu`, la paire détourée sur son fond). Longueurs et hauteurs
  en longueurs de corps :

  | mesure | c254 (studio) | c107 (jour) | rendu |
  |---|---|---|---|
  | tête, longueur | 0,24 | 0,24 | **0,19** |
  | mésosome, longueur | 0,33 | 0,25 | **0,40** |
  | pétiole, longueur | 0,05 | 0,08 | 0,05 |
  | gastre, longueur | 0,39 | 0,44 | 0,36 |
  | tête, hauteur | 0,21 | 0,22 | 0,20 |
  | mésosome, hauteur | 0,25 | 0,21 | **0,33** |
  | gastre, hauteur | 0,28 | 0,26 | 0,28 |
  | part des appendices | 0,01 | 0,01 | **0,08** |
  | grain | 6,3 | 5,4 | **9,1** |

  Le mésosome du rendu est trop long (+25 % sur c254) et trop haut (+30 %). Une partie de cette hauteur vient des hanches et des
  fémurs, trop épais pour que l'ouverture les ôte : la part des appendices est huit fois celle des photos. La tête est courte de
  20 % le long de l'axe, et le grain dépasse les photos de moitié. Ces mesures confirment les points 1, 3, 4 et 11 du troisième
  juge.
- La profondeur (Depth Anything) montre le gastre comme la pièce la plus bombée (médiane 0,73 sur c254, 0,82 sur c107), le
  mésosome plat en travers (0,2), et le propodéum dans la continuité du mésonotum, sans creux net.
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

Selon la règle des deux essais (§17.1), les écarts restants sont garés plus bas.

Troisième passage (2026-10-24, un juge neuf, sur le modèle tel que commité) : **ko** sur les six vues et sur la planche de
marche. À taille d'écran on lit « une fourmi », pas encore une *Lasius niger*. Ses défauts, du plus visible au moins visible :
1. **Taille à deux nœuds.** Le propodéum se lit comme un globe détaché du mésosome par un étranglement profond. Suivi du
   pétiole, il donne l'allure d'une Myrmicinae. Correction proposée : propodéum soudé au mésonotum, sillon métanotal à 5 % de
   la hauteur, face dorsale courte puis déclivité.
2. **Pétiole.** Il se lit comme une bobine noire sur une tige, plus sombre que le corps. Correction proposée : une écaille au ton
   du mésosome (L* à ±3), sans tige visible, épaisse du quart de sa hauteur.
3. **Mésosome.** On y lit encore trois bourrelets. Correction proposée : un seul dôme, pronotum à 0,7 fois la largeur de la tête.
4. **Pubescence.** Elle se lit comme de la paille et déborde la silhouette (grain de 1,2 à 3,6 fois la photo). Correction
   proposée : poils deux fois plus courts, deux à trois fois moins opaques, orientés par sclérite.
5. **Brillant.** Un reflet unique, large et bleuté, et des tons moyens trop clairs en lumière de jour (+7 à +12 L*).
6. **Antennes.** L'insertion paraît trop haute de profil, et l'antenne forme une équerre de face.
7. **Mandibules.** Pas de dents lisibles, et un orange trop saturé.
8. **Tête.** Les côtés paraissent encore droits, et le clypéus se lit comme un nez sombre.
9. **Œil.** Il est plat, trop en arrière de profil, et apparaît sur le dessus en vue de dessous.
10. **Gastre.** Contour en tonneau vu de dessus, stries en trop de profil.
11. **Pattes.** Elles se lisent comme des tubes, au ton du corps.
12. **Mésosome trop gris en studio.** ΔE de teinte de 10 environ.

Planche de marche : le juge confirme le tripode, le diagramme et l'absence de glissement des appuis. Il relève trois défauts : le
fragment porté se lit comme un bâtonnet, la palpation est trop faible, et les pattes avant se confondent avec les antennes vues de
dessus.

Juste, selon lui : la teinte brun-noir de jour (ΔE 2,7 sur le gastre vu de dessous, 2,9 sur la tête de face), les proportions
d'ensemble, et la marche.

Tous ces points avaient déjà été relevés et corrigés deux fois. Ils sont donc garés (§17.1), et l'atlas n'a pas été recuit.
Les points 1 à 3 changent la lecture de l'espèce : une reprise ciblée est posée en question au porteur.

### 5 bis. Reprise ciblée (2026-10-24, demande du porteur : « vue de profil et grand niveau de détail »)
Le porteur a dit oui à la reprise, pour le HUD du site, où la fourmi est vue jusqu'à 112 px de profil ou de dessus, et
jusqu'à 145 px de dos pour la fourmi du bouton Open. Deux passes, chacune avec ses paires et un juge neuf :
- **Silhouette.**
  - Le mésosome est fait de deux pièces au même contour inférieur : un promésonotum en un seul dôme, dont la couronne est au
    niveau du dos du gastre comme sur c254, et un propodéum plus bas, à la face dorsale courte et à la déclivité raide.
  - Il mesure 1,17 mm, soit 0,29 du corps (c254 0,33, c107 0,25 ; il en faisait 0,40). Ses contours sont des hauteurs mesurées le
    long de l'axe (`knots`).
  - Le sillon métanotal est un V, à la rencontre des deux contours. La suture promésonotale est marquée, et de dessus le
    pronotum fait 0,8 fois la tête.
- **Taille.** L'écaille est au ton du mésosome, aussi large que le bout du propodéum, et se lit de dessus comme une barre
  transversale. Le gastre est plaqué contre elle, et seul un court sternite reste dessous.
- **Tête.** Elle est tenue à 30° (40° avant) : de profil, elle fait 0,25 du corps le long de l'axe. L'œil est plus en avant
  et plus bombé, et les insertions des antennes sont plus basses. Le clypéus est plat et peu velu, et les mandibules couleur
  rouille.
- **Teintes et matière.**
  - Le mésosome est roux et le plus clair ; la tête et le gastre sont brun-noir, au reflet gris.
  - Le reflet est petit et net, sur un satin large.
  - La pubescence est 0,6 fois aussi longue et deux fois moins opaque, grise.
  - Les marges des tergites forment des arcs, et la quatrième est pâle.
- **Pattes.** Les fémurs sont clavés et un cinquième plus fins, avec des articulations plus claires. Les hanches sont plus
  petites, et les hanches antérieures sont rentrées sous le pronotum.

Quatrième juge (sur la première passe) : « mieux mais insuffisant » sur 10 des 11 points, la pubescence corrigée, la planche à
112 px de profil « ok pour une fourmi » et la marche ok. Selon lui, on lisait de profil plutôt une *Camponotus*, et de dessus
une Myrmicinae. La seconde passe a répondu à ses points 1 à 3, 5, 7 à 10 et à ses deux défauts de dessus (taille en deux
perles, hanches en disques). Elle n'a pas été rejugée : c'était le deuxième essai de cette reprise, et les écarts restants
sont garés, dans les résidus 8 à 10.

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
7. **Proportions mesurées par SAM.** Le lot a tourné le 2026-10-24, après la cuisson de l'atlas (§2). Il mesure un mésosome
   trop long (0,40 contre 0,25 à 0,33) et trop haut, une tête courte (0,19 contre 0,24), et des pattes trop épaisses. Ces écarts
   ne sont pas corrigés : ils entrent dans la reprise ciblée posée en question.

8. **De dos** (fourmi d'Open), selon le quatrième juge : le gastre se lit en pastille plate. La lumière de l'atlas vient du haut
   et de face, donc de dos elle frappe le gastre de face. Un halo clair restait sur l'occiput, et les pattes font araignée.
9. **Œil** : à 100 %, c'est un galet sombre sans facettes. Les facettes ne se dessinent qu'au-delà de 130 px/mm.
10. **Pattes** : elles restent régulières, avec des embouts ronds aux articulations (les bouts des `segment` du moteur).

## Niveaux du HUD (2026-10-24)
- **H** : la fourmi vue de dessus pour les porteuses du HUD, en un seul azimut, que le runtime tourne. Il compte 17 cellules de
  200 px, pour les poses pose, marche et porte (112 px de long à 2×). Il pèse 76 Ko et 3,1 Mo sur le GPU.
- **O** : la fourmi d'Open vue de dos, aux azimuts 165 et 180 et aux élévations 12 et 20, en 32 cellules de 260 px, pose porte.
- Pour chaque cellule, le point où les mandibules tiennent une charge est dans l'index de l'atlas (`grip`, exporté par
  `fourmi-noire.mjs`).
- Planche : `planches/hud.png` (`outils/planche-hud.mjs`).

## Questions au porteur
- **Une reprise ciblée de la silhouette ?** Le troisième juge et les cartes SAM s'accordent sur trois défauts. Le propodéum se
  détache du mésosome et donne une taille « à deux nœuds ». Le mésosome est trop long et trop haut. Les pattes sont trop
  épaisses. Ils font lire une autre sous-famille, alors que la règle des deux essais les a garés. Proposition : un troisième
  essai limité à ces points, mesuré contre `cartes/c254-profil` et `c107-profil` (cibles : mésosome 0,28 de long et 0,23 de
  haut, tête 0,24), puis une nouvelle cuisson de l'atlas (31 min, par le verrou).
- **Le pétale porté.** C'est un fragment de 1,5 mm découpé dans un pétale tombé, un sprite à part teinté de la couleur du
  pétale. Proposition : garder cette convention pour tous les bouquets, le fragment tirant sa teinte du pétale fané le plus
  proche.
- **Le nid.** Où se trouve-t-il sur le site et dans le widget ? Proposition : hors du cadre, aux deux bords de la bande de sol.
- **La foulée, les arrêts et le rythme des antennes.** Ce sont des propositions (COMPORTEMENT.md). Faut-il une mesure sur vidéo
  (une fourmi filmée de dessus à 240 i/s) avant la validation ?
