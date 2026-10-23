# Rapport du chantier « plan du vase »

Branche `ch/vases-plan`. Le plan et les décisions du porteur sont dans [PLAN.md](PLAN.md).

## Étape 1 : la fiche-plan (validée par le porteur le 2026-10-23)

- **Module** : `app/z7-plan.js`, avec `vPlan(v)`. Il calcule la cavité, le fond, la bouche, la gorge, le pincement, le cône « fond + lèvre », le repos des tiges, la capacité, la silhouette proposée, les côtés et les anneaux du socle.
- **Planche** : `planche-etape1.svg`, générée par `node vases5/plan-vase/planche.js`.
- **Chiffres** : dans `plans.json`.

## Étape 2 : le cône dans le compositeur

### Branchement

Le module s'appelle `z7-plan.js` et non `z7.js`, à la demande de la coordination des lys. Il est chargé par le motif `z7-*`, ajouté à
`mkqa.sh` et `decor/scene/mkengine.sh` à l'identique de `mkapp.sh` sur `ch/lys-chevauchements`.

**Dans c4**, il y a cinq crochets, tous hors des fonctions des chantiers D et I :
- **compose** : `VPL = vpUse(vid)`. Le plan est nul pour un bouquet tenu à la main, un pique-fleurs, un vase à plusieurs bouches, ou avec `?noplan=1`.
- **baseAt** : une ligne, une branche ou un feuillage entre au point que le plan lui donne. Son inclinaison est gardée dans `VP_T0`.
- **spineFor** : la tige part dans cette inclinaison.
- **leanP** : la tige d'une tête part du point d'entrée, dans l'inclinaison du cône. Cela passe par `vpLean`.
- **candidate** : l'éventail des têtes vient du cône du vase (`fan *= VPL.fan / FAN`). Il vaut le bord du cône plus 25° de flexion, et 64° au plus.

**Dans v1f** : dans le verre, chaque tige va droit jusqu'à son pied sur le fond (`vpFeet`).

**c5 n'est pas touché** : une tige de tête passe par leanP.

### Règle de la tige

Une tige visée à l'angle θ entre dans la bouche à θ / bord du chemin vers la lèvre, de son côté.
- Elle sort aussi près de θ que le cône le permet à ce point.
- Elle se tient droite sous la bouche jusqu'à son pied.
- Au-delà du cône, elle sort au bord du cône et fléchit au-dessus de la lèvre.

Deux cas particuliers :
- **Col plus étroit que la lèvre** (soliflore) : l'entrée s'arrête au dernier point qu'une tige peut atteindre (`rE`).
- **Tige courte** (une tête posée à la lèvre, dont le col finit déjà à la bouche) : elle garde l'ancien tracé jusqu'à 20 unités de corde, puis le plan prend le relais jusqu'à 70 unités. Sans ce passage progressif, ces tiges devaient revenir sur elles-mêmes : 19 cassures au lieu de 2.

### Mesures

Mêmes vases, avant (`?noplan=1`) et après.

**qa13**, 10 bouquets composés dans les 5 vases, graine 1 :

| | Parties flottantes | Sous le bord | Cassures |
|---|---|---|---|
| Avant | 0 | 0 | 2 |
| Après | 0 | 0 | 5 |

Les 5 cassures d'après sont toutes des fleurs posées sur la lèvre (`front`), la famille déjà présente avant. Les compositions diffèrent
entre avant et après, donc le compte n'est pas apparié. Ce résidu est mis de côté après deux essais.

**Tiges nues** : 4 modèles (18, 33, 68, 13) × 3 graines par vase, part de tige au-dessus de la lèvre qu'aucune tête ne couvre
(`nues_plan.js`).

| Vase | Tige nue | Hauteur | Largeur | Inclinaison au col |
|---|---|---|---|---|
| bronze-carpe | 0,222 → 0,217 | 223 → 224 | 275 → 282 | 18,2° → 16,5° |
| verre-danseuses | 0,126 → 0,129 | 222 → 229 | 296 → 299 | 11,0° → 19,8° |
| gres-chauve-souris | 0,271 → 0,248 | 220 → 216 | 206 → 180 | 18,0° → 13,6° |
| cylindre-verre-clair | 0,216 → 0,190 | 237 → 238 | 288 → 289 | 13,9° → 22,9° |
| soliflore-balustre-noir | 0,225 → 0,195 | 213 → 221 | 310 → 291 | 20,9° → 15,6° |

L'inclinaison au col suit maintenant le vase : les bouches larges et peu profondes penchent davantage, les cols étroits redressent.

**Planche** : `planche-etape2_s23.jpg`, un modèle par vase, avant | après. Elle est produite par `rendus.sh`, puis `montage.py`.

### Questions ouvertes

- **Versionnage.** Le plan déplace toutes les tiges. Il est réservé à la version 3 du compositeur (`CMP_V`, chantier I) : `vpUse`
  rend `null` si `CMP_V < 3`. Il faut passer `CMP_VMAX` à 3 quand I et ce chantier seront fusionnés.
- **Flexion de 25° au-delà du cône.** C'est une proposition, qui donne l'éventail de la carpe : 47° au lieu de 58°. À juger sur la planche.
- **Gravité dans les bouches larges.** Avec peu de tiges, elles devraient toutes tomber contre la lèvre (`vpRest`, étape 1). C'est
  prévu à l'étape 4 (silhouette), pas branché ici.

## Étape 3 : capacité du col et jauge du Composer

Décision du porteur : la capacité est une limite pour nous quand nous composons. Le Composer agrandit le vase, ou indique combien de
tiges il prend au plus.

### Calcul (`app/z7-plan.js`)

- **Section d'une tige** : elle vient de la fiche de l'espèce, `rec.stem.w` en mm (6 mm si la fiche n'en a pas). Par exemple : rose 5,
  tulipe 7, lys 10, tournesol 12, amaryllis 15.
- **Charge d'un bouquet** (`vpLoad`) : la somme des sections de toutes ses tiges composées, celles du joueur comme le feuillage ajouté par
  le compositeur (`P.cnt`).
- **Capacité du vase** : la section du pincement × 0,6.
  - Le pincement est la section la plus étroite au-dessus du dixième le plus bas de la profondeur. Là où un bol se resserre sur son pied,
    les tiges penchent : elles ne s'y serrent pas.
- **Remplissage** : la charge divisée par la capacité. « Au plus » : le nombre de tiges de ce bouquet que le col prend.
- **Agrandissement** (`vpFit`) : le vase grandit par pas de 0,05, jusqu'à ×1,5 (`VP_GROW`).
  - La paroi garde son épaisseur, donc le col s'ouvre plus vite que le vase ne grandit. Le pas est donc vérifié sur le vase agrandi
    lui-même, pas tiré d'une racine carrée.
- **Vase agrandi** (`vpScaled`) : `VZ['<id>~<k>']` est une copie de l'entrée du catalogue, toutes longueurs × k. Elle n'apparaît pas dans
  la liste des vases, et elle a son propre `id`, pour que le cache d'un corps coulé ne la confonde pas avec le vase d'origine.
  - `vpVid` réenregistre ces copies sur une autre page : un cadeau ouvert, le jardin, le widget.

### Composer (`u2`, `u3`, `w1`)

- **Dessin** : `drawFlowBq` et `renderModel` dessinent dans le vase ajusté (`FIT = flowFit()`).
- **Étape « composition »** : la ligne d'état porte la jauge.
- **Étape « contenant »** : chaque vase porte la sienne (« col 22 % », « agrandi ×1,25 », « trop étroit »), et la phrase du vase choisi
  dit ce qui se passe.
- **Cadeau** : il garde le vase ajusté (`curGift`, `vase: FIT.vid`).
- **Vérifié dans la page de l'appli** (`mkui.sh`, capture `ui_contenant.png`) : modèle M77 dans le soliflore, « Vase agrandi ×1,3 pour
  tenir ses 15 tiges (6 au plus à sa taille) ».

### Les modèles du catalogue

77 modèles, chacun dans son vase (`capa_plan.js`, résultat dans `qa/capa.json`). Remplissage médian 0,18, 90e centile 0,77.
5 modèles dépassent :

| Modèle | Vase | Tiges | Remplissage | Au plus | Composer |
|---|---|---|---|---|---|
| M77 | soliflore-balustre-noir | 15 | 216 % | 6 (22 à ×1,5) | agrandi ×1,3 |
| M30 | balustre-argent-patine | 12 | 121 % | 9 (29 à ×1,5) | agrandi ×1,1 |
| M24 | tube-acier-disque | 34 | 576 % | 5 (20 à ×1,5) | trop étroit |
| M28 | calice-souffle-col-tube | 22 | 463 % | 4 (14 à ×1,5) | trop étroit |
| M66 | calice-souffle-col-tube | 20 | 329 % | 6 (17 à ×1,5) | trop étroit |

Le tube acier a 1,9 cm de diamètre intérieur, le col tube du calice 2,4 cm : ces bouquets n'y tiennent pas, même agrandis.

Planche : `planche-etape3.jpg`, chaque modèle tel quel et dans le vase agrandi, produite par `rendus3.sh` puis `montage3.py`.

### Questions ouvertes

- **Les 3 modèles trop étroits : décision du porteur (2026-10-23)** : un vase plus large de la même famille, le plus proche par la matière et
  l'allure (`app/k1.js`, `VWIDE`), mesuré avec `capa_plan.html?capa=1&alt=24,28,66` :
  - M24 → `cylindre-inox-miroir` (même inox poli), col rempli à 10 % ;
  - M28 → `calice-celadon-pans` (le plus haut de la famille, ton bleuté proche du verre soufflé), 35 % ;
  - M66 → `calice-etain`, 32 %.
  Planche : `planche-etape3-vases.jpg`. Les 77 modèles tiennent désormais : deux dans un vase agrandi (M77 ×1,3, M30 ×1,1).
  M24 est un grand bouquet sur un cylindre de 11,5 cm : la proportion entre bouquet et vase relève de l'étape 4. Le cylindre chinoiserie,
  de 20 cm et rempli à 5 %, serait l'autre choix.
- **Taux de remplissage d'une botte, 0,6** : à vérifier sur des photos de vrais vases pleins.
- **Agrandissement au plus ×1,5** : c'est une proposition.
- **Moteur sur chaîne** (`packages/engine`, côté Codex) : il désigne un vase par son numéro et ne connaît pas encore `~k`. À lui
  transmettre avec la décision, si le Composer y passe.
- **Cache du plan.** `vPlan` est mis en cache tant que le vase garde sa taille (clé : h, mo, vs). Le banc des lys (`?vs=1.35`) agrandit la
  carpe sur place avec `vScaleBy` : le plan suit (vérifié : rM 28,1 → 37,9). Un vase agrandi par le Composer porte `_vs = 1`, donc
  `vScale` ne le remet pas à l'échelle une seconde fois.
- **Coulée.** Un vase coulé agrandi (la carpe de bronze, `id~k`) relance sa propre coulée, son cache étant indexé par id. Pour l'instant,
  aucun modèle n'agrandit la carpe : son col prend 124 tiges de 6 mm. Si cela arrive, il faudra réutiliser la coulée du vase d'origine
  à l'échelle.

## Étape 4 : la silhouette que le vase appelle

### Principe

La masse du bouquet reste dimensionnée par ses fleurs (c4 : la surface réelle des têtes), jamais étirée. Le vase n'agit que de deux
façons.

1. **La classe du vase façonne la masse, à surface égale** (`vpAspK`, une ligne neuve dans `candidate`).
   - La classe vient de la pente des tiges au repos : `droit` sous 12°, `eventail` jusqu'à 30°, `dome` au-delà.
   - `droit` rend la masse plus étroite et plus haute (largeur / hauteur × 0,82) ; `dome` la rend plus large (× 1,15).
   - La portée des tiges garde le dernier mot : un bouquet limité par ses tiges ne s'élance pas plus haut. C'est le cas du modèle 33 sur
     la chauve-souris, identique au pixel.
   - `?noasp=1` permet de comparer.
2. **Le Composer dit la proportion du bouquet** (`vpProp`) : la hauteur au-dessus de la lèvre, comparée à la plus grande taille du vase
   (sa hauteur, ou sa largeur pour une coupe basse).
   - « Bouquet bas pour ce vase » sous 1 fois, « haut » au-delà de 3,5 fois.
   - Le message s'affiche à l'étape « composition » et sous le vase choisi à l'étape « contenant ».

**Seuils calés sur le catalogue.** La règle des fleuristes (1 à 2 fois) ne tient pas sur les 77 compositions de référence, tirées de
photos : leur médiane est à 2,17 fois et 45 seraient « hautes ». Les seuils retenus sont 1 et 3,5 (`VP_PROP`). Ils ne signalent que les
écarts nets : 5 bouquets bas (M16 à 0,34, M56, M32, M11, M38) et 3 hauts (M34 à 3,96, M25 à 3,97, M24 à 5,5 sur son cylindre inox).

### Côtés

Rien à rebrancher. Les vases sculptés ont déjà leurs côtés par `sil` dans c4 : fleurs de bord et retombées du côté libre. Un vase
tourné a ses deux côtés libres. `vPlan(v).sides` les expose pour le futur protocole des fleurs.

L'indicateur `env.cascade` n'est pas fiable : `mo` n'est pas toujours le rayon extérieur de la lèvre (cylindre : `mo` 50,8 pour un
profil à 54,9). Il n'est pas utilisé.

### Mesures

Mêmes 4 modèles × 3 graines par vase, sans → avec la classe :

| Vase | Classe | Tige nue | Hauteur | Largeur |
|---|---|---|---|---|
| bronze-carpe | eventail | 0,217 → 0,217 | 224 → 224 | 282 → 282 |
| verre-danseuses | eventail | 0,129 → 0,129 | 229 → 229 | 299 → 299 |
| gres-chauve-souris | droit | 0,248 → 0,230 | 216 → 223 | 180 → 179 |
| cylindre-verre-clair | dome | 0,190 → 0,185 | 238 → 232 | 289 → 306 |
| soliflore-balustre-noir | eventail | 0,195 → 0,195 | 221 → 221 | 291 → 291 |

**qa13** (10 bouquets, graine 1) : 0 partie flottante, 0 débord sous le bord, 6 cassures, toutes des fleurs posées sur la lèvre (5 à
l'étape 2).

**Classes des 77 modèles :** 37 `eventail`, 36 `dome`, 1 `droit`, 3 sans plan : tiges plantées sur un pique-fleurs (M2, M57, M69), où le cône ne s’applique pas. La moitié du
catalogue s'élargit donc un peu.

Planche : `planche-etape4.jpg`, produite par `rendus4.sh`. Sans en haut, avec en bas.

### Questions ouvertes

- **Les coefficients 0,82 et 1,15** sont une proposition.
- **Les 8 bouquets hors proportion** : c'est au porteur de dire s'il faut leur proposer un autre vase, comme pour l'étape 3.

## Étape 5 : le socle des pétales tombés (avec le chantier D des lys)

### Interface (`app/z7-plan.js`)

- **`vpSocle(v)`** donne ce que le vase offre à un pétale qui tombe :
  - son pied (`rFoot`) ;
  - son point le plus large (`rWide`) ;
  - ses anneaux de pose (`rings` : lèvre, épaule, glissade, sol) ;
  - le facteur de profondeur du sol (`KZ` = 0,16, comme z1).
- **`vpRestOn(v, X, Z, len)`** donne où un pétale de longueur `len`, lâché au-dessus de (X, Z), vient se poser : `{X, Z, h, kind}`.
  - **Lèvre ou épaule douce** (pente sous 35°) : il y reste si la partie douce fait au moins 0,4 fois sa longueur.
  - **Sinon** : il glisse sur le corps et tombe au sol juste au-delà du point le plus large.
  - **Sol sous une panse qui déborde du pied** : jamais atteint en tombant. Le plus près qu'un pétale repose au sol est `rWide`.
  - **`in`** : il tombe dans la bouche, parmi les tiges.

### Constat

La règle actuelle de `lifeScatter` (z1, 9c6705d) pose chaque pétale au sol, à partir du rayon du pied + 0,45 de pétale + 4. Planche
`planche-etape5.svg` (`node vases5/plan-vase/planche5.js`) : 40 pétales de 4,6 cm lâchés sous la couronne, avec la règle actuelle
simplifiée à sa distance minimale.

| Vase | Pied → panse (rayon) | Règle actuelle : au sol sous la panse | Avec le plan |
|---|---|---|---|
| bronze-carpe | 5,6 → 10,3 cm | 14 / 40 | 39 au sol au-delà de la panse, 1 dans la bouche |
| verre-danseuses | 6,6 → 10,1 cm | 2 / 40 | 38 au sol, 2 dans la bouche |
| gres-chauve-souris | 4,2 → 11,3 cm | 35 / 40 | 18 au sol, 20 sur l'épaule plate autour de la bouche, 2 dans la bouche |
| cylindre-verre-clair | 8,2 → 8,5 cm | 0 / 40 | 39 au sol, 1 dans la bouche |
| soliflore-balustre-noir | 5,7 → 5,8 cm (le pied est le plus large) | 0 / 40 | 40 au sol |
| pot-agate-rose | 2,6 → 6,7 cm | 9 / 40 | 38 au sol, 2 dans la bouche |

### Intégration dans z1 (chantier D) : en attente de la coordination des lys

Proposition envoyée à la session de coordination : deux lignes neuves dans `lifeScatter`, sans réécrire les longues lignes.
- `need` au moins égal à `rWide + 0,3 len` ;
- `vpRestOn` sur le meilleur emplacement retenu, en dessinant à `y = FL − h + Z·KZ` quand le pétale repose sur le vase.

Réponse de la coordination (2026-10-23) : D pose les crochets dans z1, la coordination fusionne dans ch/lis-oriental après avoir montré la planche au porteur ; `vpSocle` et `vpRestOn` rendent null si `CMP_V < 3`. Questions posées :
- Qui modifie z1 ?
- Le porteur avait-il validé des pétales sous la panse ?

**Décision du porteur (2026-10-23)** : « un pétale tombé ne se pose jamais sous la panse, il va au-delà du point le plus large ou reste
sur l'épaule. Applique le plan du vase dans la chute des pétales. » Elle est transmise à la coordination des lys pour le chantier D, qui
pose les deux crochets dans `lifeScatter`.

### Vérification sur les vrais pétales du chantier D (d7cea77, ch/lys-compo, lecture seule)

D a posé les deux crochets derrière `LIFE_PET_VER` 3. Écart avec ma proposition : `vpRestOn` est appelé sur le point de lâcher brut, pas
sur la place finale.

Rendus au fané (`life=3`, graine 23) dans une copie temporaire de d7cea77 : v2 (`?petv=2`) contre v3. Positions relevées par
`lifeLandOf()` :

| Vase (modèle) | Pétales | Au sol sous la panse : v2 → v3 | Distance mini à l'axe : v2 → v3 | Sur le vase (v3) |
|---|---|---|---|---|
| bronze-carpe (M33) | 9 | 2 → 0 | 57 → 78 | 0 |
| verre-danseuses (M18) | 13 | 1 → 0 | 59 → 75 | 0 |
| gres-chauve-souris (M18) | 13 | 4 → 0 | 47 → 85 | 0 |
| cylindre-verre-clair (M18) | 14 | 0 → 0 | 62 → 62 | 2, sur la lèvre |
| soliflore-balustre-noir (M13) | 8 | 0 → 0 | 47 → 47 | 0 |

Planche : `planche-etape5-fane.jpg`.

Le modèle 68 ne perd aucun pétale au fané : la chauve-souris a donc été rendue avec le modèle 18.

## Étape 6 : le plan sur les 73 vases

`vPlan` a tourné sur les 73 vases du catalogue, tels que le moteur les lit dans la page, cavités mesurées (`SVGB`) comprises :
`plans73.js` (page `mkplans.sh`, `?plans=1`), puis `plans73.py`. Aucune erreur.

- Tableau complet, avec chaque vase et ses raisons : [plans73.md](plans73.md).
- Planche des coupes : `planche-etape6.svg`. Cadre rouge : à mesurer ; orange : à vérifier ; gris : hors du plan ; vert : sans remarque.

### Verdicts

| Verdict | Nombre | Signaux |
|---|---|---|
| **À mesurer à part** | 13 | Le profil ne décrit pas la cavité. Vases sculptés dont le profil à la bouche est la sculpture (cavité à prendre sur le modèle 3D) ; formes non tournées (contour, boîte : bouche allongée ou rectangulaire) ; profondeur utile sous 3 cm. |
| **À vérifier** | 18 | Lecture plausible mais incertaine. Sculptés lus sur le profil extérieur ; fond haut (pied plein supposé) ; étranglement bas (pied plein ou cavité ?) ; col très étroit ; coupes très ouvertes (plus de 55°, où les tiges se couchent sans pique). |
| **Hors du plan** | 5 | Les 4 pique-fleurs, où les tiges sont piquées et non posées au fond, et le vase à plusieurs bouches (prismes-bronze). |
| **Sans remarque** | 37 | — |

### À mesurer à part (13)

- **Sculptés**, cavité à prendre sur le modèle 3D avec `compo.py` (`vases5`), qui mesure déjà la bouche, le devant et la fente :
  bronze-bambous, bronze-lys, calla-gres, coque-verte, gres-chauve-souris, gui-argent, jardiniere-cristaux.
  - La chauve-souris est l'un des 5 vases du chantier : sa cavité était lue sur son profil, ce qui était connu dès l'étape 1.
  - La jardinière n'a que 1,7 cm de profondeur utile, d'après la lecture.
- **Non tournés**, coupe et bouche à décrire : suiban-lobe-rose, suiban-ovale-peint, vase-coeur-anthracite, vase-tete-veine-sable,
  prisme-jaune, colonne-blanche.

### Proposition pour la suite

Une surcharge mesurée `v.plan = {yF, cav}`, déjà prévue dans `vPlan`, à remplir vase par vase :
- **sculptés** : depuis le modèle 3D, en ajoutant la cavité à `compo.py` ;
- **non tournés** : depuis la photo.

Les 18 à vérifier se règlent à l'œil sur leur planche, avec le porteur.

Ce travail n'est pas lancé : il attend la décision du porteur.

### Les 13 vases mesurés à part (demande du porteur, 2026-10-23)

Les mesures vont dans `app/z7-plan-mesures.js` (`VPLAN_OV`), que `vPlan` lit à la place du profil. Le fichier est généré par
`mesures.js` et chargé par le motif `z7-*`.
- **Format** : échelle 1, points [hauteur, demi-largeur, centre x], rééchantillonnés sur les hauteurs du plan, puis raccordés à la bouche.
- **Cavité décentrée** : elle est permise (`cav[i][2]`), et le cône en tient compte.
- **Bouche ovale ou carrée** : elle donne sa vraie section à la capacité (`zk`, profondeur sur largeur).
- **Planche** : `planche-etape6-mesures.svg` montre la cavité lue sur le profil (tirets rouges) et la cavité mesurée (bleu).

**Sculptés, sur leur modèle 3D** (`cavite_glb.py`).
- **Méthode** : coupes horizontales du maillage (`trimesh.mesh_plane`, sans `rtree`). À chaque hauteur, l'axe du creux est le point le plus
  loin des parois ; le rayon est la moyenne de 48 rayons vers la paroi intérieure ; le fond est la hauteur où l'axe entre dans la matière.
- **Échelle** : la hauteur 1 du modèle vaut `h` du vase. Le haut du creux retrouve la bouche de `compo.py` à quelques unités près.
- **Résultats** :
  - **mesurés** : chauve-souris (34,5 cm de creux), bambous (49,7 cm), coque (18 cm, cavité décentrée) ;
  - **mesurés en partie** : calla (la spathe est ouverte au-dessus de 9 cm, raccordée à la bouche) et gui (creux de 6 à 17 cm, bouche de
    1,1 cm d'après `compo.py`).
  - **non mesurables** : le modèle 3D du **lys** et celui de la **jardinière** ne sont pas creusés, on n'y trouve qu'une cuvette de 0,1 à
    6 cm. J'ai posé une hypothèse, marquée `suppose` : une cavité droite de la largeur de la bouche, avec un fond au dixième de la hauteur.
    Elle est à confirmer sur une photo de l'intérieur, ou à remplacer par la décision du porteur.

**Non tournés, depuis le contour relevé sur la photo** (`ol`).
- **Méthode** : à chaque hauteur, l'intérieur du contour de face moins la paroi, avec son centre ; profondeur sur largeur pour la section.
- **Fond** : il est posé au-dessus d'un pied plein quand une partie étroite a une partie plus large en dessous d'elle (le cou de la tête
  veinée), ou pour les suibans posés sur pieds. Le cœur, qui se resserre jusqu'à sa pointe, reste creux jusqu'en bas.
  - La photo de référence de la tête montre 30 tiges, que son cou ne pourrait pas laisser passer : c'est elle qui a tranché.
- **Colonne blanche** : cavité carrée, demi-côté moins la paroi. Le profil prenait la demi-diagonale du carré.

### Après les mesures

- **Verdicts des 73 vases** : 8 mesurés à part, 23 à vérifier (dont lys et jardinière, supposés), 5 hors du plan, 37 sans remarque.
- **Modèles du catalogue** : les 77 tiennent tous dans leur vase. M7 (tête veinée) demande un vase agrandi ×1,15, en plus de M77 (×1,3)
  et de M30 (×1,1).
- **Changements notables** :
  - calla : profondeur utile 15,7 → 39 cm ;
  - cœur : 145 → 38 tiges de 6 mm (bouche ovale de profondeur 0,53) ;
  - suiban ovale : 2264 → 1290 tiges ;
  - colonne : 186 → 237 tiges.
