# Audit V4 : vers des fleurs presque indiscernables des vraies

18 octobre 2026. Passe d'analyse demandée par le porteur avant toute nouvelle sorte (PASSATION-VAGUE3 §0). Lecture du code,
des fiches, des journaux et des factures de la vague 3 ; aucune sorte publiée n'a été modifiée. Le détail et les preuves ligne
à ligne sont dans quatre notes de travail, `audit-v4/notes-*.md` ; ce document en tire les constats, les causes et la liste des
améliorations atomiques.

| Note | Sujet (PASSATION §0) |
|---|---|
| [notes-morpho-stades.md](audit-v4/notes-morpho-stades.md) | 1. description morphologique ; 5. stades de vie |
| [notes-matiere-feuilles.md](audit-v4/notes-matiere-feuilles.md) | 2. matière et lumière ; 4. feuillages et tiges |
| [notes-jointures.md](audit-v4/notes-jointures.md) | 3. intégrité structurelle : jointures et sections |
| [notes-processus.md](audit-v4/notes-processus.md) | 6. processus, coûts, outils |

## 0. Le verdict en cinq lignes

1. **La description de la plante n'existe pas en dehors du code.** La forme est réglée par essais contre quelques photos ; les
   nombres ne gardent pas leur source, les briefs sont « à l'œil, ±25 % », et sept formats se partagent ce qui est écrit.
2. **La matière est celle d'un papier peint en dégradé.** Le moteur commun ne connaît qu'une rampe le long de la pièce et des
   lavis en escalier ; zones en travers, lumière transmise, ombre de contact, nervures en creux, reflets nets n'existent que dans
   un ou deux noyaux, recodés chacun pour soi (8 modèles de lumière, 10 ombres portées, 9 tracés de nervures).
3. **Les jointures sont dessinées sorte par sorte.** Il n'y a ni moteur de liaisons ni section de tige autre que ronde ; la
   tenue « rien ne flotte » n'est mesurée que pour les branches et l'hortensia.
4. **Les feuilles et les tiges ont un temps de retard** : une trentaine de générateurs de feuilles en cinq techniques, dont
   l'ancien `lsLeafParts` qui a valu à l'amarante « bien trop mauvaise qualité » et qui sert encore.
5. **Le contrôle de qualité arrive après la dépense.** Les trois sortes les plus chères (hortensia 27 M, phalaenopsis 26 M, rose
   standard 20 M) sont celles dont le défaut a été vu par le porteur ou l'orchestrateur après un premier livrable. `pipe.py`
   n'appelle aucun des outils de mesure qui existent, et ses étapes comparaison et juge n'ont jamais tourné ; telles quelles,
   elles auraient refusé la première orchidée pour une erreur de vue.

## 1. Description morphologique (sujet 1)

**Constat.** Le JS des fiches est la seule description que le code lit. `catalogue/serre/sources/<sid>.json` ne contient aucune
forme pour les sortes de la vague 3 (nom, preuve, couleur par coloris seulement). Les seules données de forme sourcées valeur
par valeur sont la tulipe (`REFERENCES.md:147-155`, ovaire 0,42 R0, stigmate 0,09…) et la polyligne de la spathe
(`SVSPD_HEART`, `y3-spathe.js:9`). Aucune case n'est sourcée pour les courbures, la section, l'épaisseur ou la nervation
(tableau de couverture, notes-morpho §6).

**Preuves.**
- Le type de pointe n'est pas une donnée mais un exposant de superellipse réglé après critique : cymbidium, « le bout des pétales
  n'est pas en pointe » (BONNES-PRATIQUES 2.11).
- Les chiffres divergent sans que rien ne le voie : étamines d'anémone 80 à 150 documentées (`REFERENCES.md:109`), 90 à 140 en
  en-tête (`y2.js:7`), 165 à 220 codées (`y2.js:72`) ; L interne de la tulipe 1,62 documenté, 1,6 codé.
- Les photos sont citées par leur index dans `kept.jpg`, propre à chaque chantier : « photo 27 » désigne des fichiers différents
  d'un chantier à l'autre.
- Le cœur ne change pas de forme d'une variété à l'autre (BONNES-PRATIQUES 2.12, aucune sorte conforme) ; seules les couleurs,
  la densité des taches et l'œil des roses de jardin varient.

**Cause.** Il n'y a pas de lieu où écrire « l'organe X a telle forme, mesurée sur telles photos » : le modeleur écrit
directement des réglages.

**Réponse proposée.** Une fiche morphologique par sorte, au schéma commun versionné `fiche-morpho/1`
([fiche/SCHEMA.md](fiche/SCHEMA.md)) : chaque organe décrit par rubriques (nombre, disposition, contour et pointe, courbures,
matière, nervation, zones, jointures, section), chaque valeur avec sa méthode (`mesure-echelle`, `segmente`, `oeil`, `reference`,
`code`, `hypothese`), ses photos à clé portable et le chemin de l'expression du code qui la porte. Un contrôle sans rendu
(`fleur/fiche.py check`) liste les valeurs à mesurer et les écarts fiche/code. Pilote : l'anémone, la référence, décrite
entièrement (`catalogue/serre/fiches/anemone-coronaria.json`).

## 2. Matière et lumière (sujet 2)

**Constat.** Un seul vrai moteur de matière, `svSheet`/`svDraw` (`app/y1.js`) :
- remplissage = un `linearGradient` du pied à la pointe (`svFaceFill`, y1.js:109), rien en travers ;
- modelé = lignes de niveau de la lumière en 6 ombres et 3 lumières à couleur et opacité fixes (y1.js:134, 159) ;
- ombre entre pièces = un seul décalage, quel que soit l'écart de profondeur (y1.js:126-131) ;
- translucidité = un scalaire `trans` et un liseré clair (y1.js:70, 166), sans couleur transmise ;
- reflets fondus dans le lavis, jamais nets ; aucun grain hors de l'orchidée.

**Où l'on retombe sur du papier découpé** (notes-matière A3) : chaque pétale de rosette est un aplat `it.tone`
(`y3-rosette.js:242`), et c'est le produit phare (roses). Même chose pour le rayon de capitule (`ramp(.6)`, `y3-capitule.js:158`),
les folioles et feuilles 2D (aplat + une moitié ombrée à 0,3), les grappes et la boule (tons quantifiés), l'orchidée hors lod 2.
Les chemins allégés de DET 1 sont des reliquats du budget que le porteur a levé (« le poids je m'en fiche »).

**Ce qui marche déjà, enfermé dans un noyau :** l'orchidée lod 2 (rainure et crête, satin, grain), la bande de contre-jour de
l'hortensia (y3-hortensia.js:109-116, la meilleure translucidité), les cloques laquées de la spathe, la mosaïque de relief de la
feuille d'amarante retombante (`amaLeafSheet`).

**Réponse proposée.** Une primitive commune par effet, réglée par la matière du coloris ou la fiche, absente = rendu actuel à
l'octet près (notes-matière A5) : `svCross` (zones en travers), `svTrans` (lumière transmise et bord éclairé par derrière),
`svShadow` (ombre de contact et ombre portée selon l'écart de profondeur), `svSheen` (cire, satin, velours, brillant), `svRelief`
(nervures en creux ou en relief), `svMosaic` (gaufrage, froissé), `svGrain`, et `svTone` qui remplace les huit fonctions
« lumière → couleur ». Les deux premières sont en cours dans le chantier `matiere-v4`, avec planches avant/après (§8).

## 3. Intégrité structurelle : jointures et sections (sujet 3)

**Constat.** Pas de moteur de jointures. Seuls `frameOf`/`neckPart`/`neckOut` (s0.js:35-58), `svStemLine` (y1.js:172) et `STEML`
sont partagés.
- `svBloom` pose chaque pétale sur un cercle sans épaisseur ni cicatrice (y3.js:66, 74).
- La tige ne sait être que ronde ; seul le narcisse a une tige plate et creuse, par un aiguillage à part.
- Trois sortes ont un nœud de tige, chacune avec son propre code (dahlia, hortensia, orchidée).
- La gaine d'une feuille en sangle a un rayon constant qui ignore la largeur de la tige (`sr`, y3.js:167).
- En bouquet, tige et cou sont deux tracés bout à bout (c5.js:183, 253).
- Le cou du fané qui s'arque (`rosaNeck`, `tulNeckBend`) est coupé en bouquet pour garder `rtest`, et remplacé par une rotation
  rigide (`nod`, c5.js:215-228) : le fané n'a pas la même jointure en planche et en bouquet.

**Contrôles.** `jn=1` ne mesure que `svBranch` ; `jgap.py` a servi à l'hortensia, `conn.py` vit hors de `fleur/`. Orchidées,
roses, capitules, spathes, tulipes, anémone : jonction tête-tige jugée à l'œil (notes-jointures §3).

**Défauts ouverts** : nœud papillon du fané des roses de jardin, boutons précoces de l'arum, anthurium .4 et profil en bande,
coude de 22° de l'iris fané, jours de 0,8 à 1 mm du cognassier et du cerisier fanés, calice de grappe rattrapé par une rustine.

**Réponse proposée.** Quatorze types de jointure paramétrés, dessinés par quelques fonctions partagées, les cas actuels devenant
leurs réglages par défaut (notes-jointures §5) :
- insertion de pièce, réceptacle, calice, involucre ;
- pédicelle articulé, nœud renflé ou engainant, gaine, pétiole à pulvinus ;
- fourche, cou, raccord tige-cou, spadice ;
- section de tige (`ronde | carree | ailee | plate | cotelee | creuse`) ;
- moignon de coupe.

Base à réutiliser : `svTubeN` (y3-couronne.js:36), qui balaie déjà un tube de section quelconque. Priorité aux besoins de la
suite : nœuds de l'œillet, tige creuse du delphinium, feuilles verticillées du lis.

## 4. Feuillages et tiges (sujet 4)

**Constat.** Une trentaine de fonctions de feuille en cinq techniques sans lien (notes-matière B1). Seule la famille des sangles
passe par la vraie lumière du moteur. La critique de la feuille d'amarante s'explique ligne à ligne (notes-matière B2) :
`lsLeafParts` (l0.js:50) est une grille de 4 × 6 à DET 1, avec un profil à 6 nœuds symétrique, 4 à 7 nervures droites et
parallèles, et une seule rangée de dégradé. Ce chemin sert encore à l'amarante dressée (r6a.js:218) et à toutes les feuilles
génériques des bouquets (`stemLeaf`/`pinnateLeaf`, s0.js:197-214) des sortes sans `STEML.sv`. La retombante a déjà la feuille la
plus riche du dépôt (`amaLeafSheet`, y-amaranthus.js:117), mais personne d'autre n'en profite. Tiges : un seul dessinateur riche
(`svStemLine`) ; l'ancien dessin garde un ruban à quatre bandes (l0.js:35). Il n'y a ni nœud, ni voile glauque, ni lenticelle,
ni teinte le long de la tige, ni ombre des feuilles et des têtes sur les tiges en bouquet.

**Réponse proposée.** Un moteur de feuille commun `svLeaf` sur `svSheet`/`svDraw` :
- le contour paramétré de `svbLeaf` : pointe, dents, cordée, lobée, composée ;
- le relief d'`amaLeafSheet` (`svMosaic`), les nervures arquées en creux (`svRelief`), le reflet (`svSheen`) et le contre-jour
  (`svTrans`) ;
- l'insertion par la jointure `petiole` ou `gaine`.

Migration : d'abord les sangles (iso-pixel), puis l'amarante dressée et les feuilles génériques des bouquets, puis les copies 2D.
Côté tiges, `c.sv` gagne en option `section`, `nodes`, `bloom`, `tint` et l'ombre reçue.

## 5. Stades de vie (sujet 5)

**Constat.** La continuité bouton → fané est assurée par construction : deux pilotes `op`, `wl` et des fenêtres lisses. Mais les
courbes sont souvent empruntées (notes-morpho §5.2), contre BONNES-PRATIQUES 2.2 :
- tulipes simple, perroquet et frangée : fané et chute de l'anémone et de la tulipe botanique v1 ;
- roses intermédiaire et sweetheart : fané de l'hybride de thé, avoué en commentaire (y-rosa.js:187) ;
- orchidées : courbes du kit, et le cymbidium fane sans aucune photo ;
- gerbera, germini, anthurium, calla : déclin et fané génériques de leur kit.

Le fané change aussi de fiche à un seuil (perroquet, frangée à `wl` .3 : un saut possible), et sept fonctions de couleur fanée
sont écrites en seuils HSL. Il n'existe aucun lien écrit entre les jours de vase, `op`/`wl` et les fenêtres de la fiche.

**Réponse proposée.** La table `stades` de la fiche (`statut` mesuré, hérité ou hypothèse, photos par stade, jours ↔ `op`/`wl`),
puis, sorte par sorte, des courbes propres là où l'héritage est marqué, avec la paire photo/rendu du déclin et du fané (§7, P5).

## 6. Processus (sujet 6)

**Où est parti l'argent** (13 sorties facturées, 194,7 M eq) : modelage 50 %, orchestrateur 30 % (majorant), recensement 15 %,
coloris 3 %, finition, QA et photos 3 % ; la lecture d'images pèse 19 % de tout. Un relais Opus coûte 0,3 à 3,4 M (moyenne 1,7 M).

**Ce qui a raté, et ce qui l'aurait attrapé plus tôt** (notes-processus §2) :

| Défaut de la vague 3 | Vu par | Contrôle ou paire qui l'aurait vu au premier tour |
|---|---|---|
| Rose lot 1 : pétales transparents (113 paires en conflit), 7,2 M de relais | porteur | rapport de visibilité par pièce, paires en conflit comptées (O2) |
| Phalaenopsis : pétales en étoile, labelle à 1/10, « terne et pauvre », « toutes de face » ; 26 M | tour 14, puis porteur | paire de face exigée dès `forme` avec W/H (P8) ; contrôle couleur chiffré (P6) ; histogramme lacet/tangage de la hampe |
| Cymbidium : cœur « figurine », labelle réglé une dizaine de fois à l'aveugle | porteur, journal | vue des axes et normales des pièces (O1) ; paire par coloris contre SA photo |
| Hortensia : fleurons épais, blancs gris, bas de boule fantomatique ; 11 relais, 27 M | orchestrateur, porteur | gros plan D 800 lisible (P2) ; contrôle couleur (P6) ; `jgap.py` dès `plante` |
| Dahlia : « pomme de pin », trois tours dans le mauvais sens | journal | mesure du profil h/w (O4) |
| Amarante : feuille réécrite 4 fois | porteur | paire feuille photo/rendu (P5) |
| Écarts de `rtest` découverts en plein modelage (6 chantiers sur 7) | chaque modeleur | `rtest` de la sorte exigé à la fin de `forme` (P8) |
| Photos d'une autre espèce prises pour référence (cymbidium 122, Taisuco blanc rangé fuchsia) | modeleur, tard | audit ΔE des photos `coloris:` et champ `groupe` (P7) |

**pipe v3** : selftest 80/80, mais la comparaison et le juge n'ont jamais tourné sur une vraie sorte, et rien du code n'appelle
`cwmed`, `jgap`, `hmed`, `sil`, `prof` ou `organ`. Risques certains au premier passage (notes-processus §4.2) :
- vue de profil codée à 7, alors que le vrai profil des orchidées et des spathes est la vue 8 : refus garanti, et le modeleur ne
  peut pas corriger, `pairs.json` étant réécrit à chaque tour ;
- paires réduites à 420 px de haut : le gros plan D 800 n'apporte rien et les pointes, zones et translucidités ne se jugent pas ;
- fourchettes de la tulipe imprimées sur toute paire ;
- verdict du juge sans lien avec l'état du code ;
- juge à 40 tours pour 18 paires, et `ko` sans issue ;
- aucune paire de feuille ni de tige.

À la publication, les témoins sont imprimés, pas jugés : `publier.sh fin` avance `main` sans relire les verdicts.

## 7. Améliorations atomiques, classées

Chaque ligne = une modification, son contrôle ou sa planche avant/après, son témoin. Témoin commun à toute retouche du moteur :
planche de l'anémone à 0,00 % contre `fleur/out/base_v2.png` et `rtest` IDENTIQUE ; toute primitive est en option (clé absente =
rendu actuel). Une amélioration qui changerait une sorte publiée se propose au porteur avec planches avant/après et ne s'impose
pas.

### 7.1 Préalables : sans eux, le premier `pipe.py` gaspille au moins 8 M

| # | Modification | Contrôle | Témoin | État |
|---|---|---|---|---|
| P1 | vues des paires par famille (profil, bouton : vue 8 pour orchidées et spathes) | selftest : orchidée → 8, tulipe → 7 | selftest | en cours (`outils-v4`) |
| P2 | paires à 1 100 px de haut, 2 400 de large ; gros plan D 800 vraiment 1:1 | tailles avant/après d'une paire | aucun rendu touché | en cours |
| P3 | fourchettes du brief de la sorte, plus celles de la tulipe partout | `img.py pair` sur une rose | tulipe inchangée | en cours |
| P4 | empreinte de `app/` liée au verdict du juge ; `planches` et `FINI` la recontrôlent | retouche après juge → refus | selftest | en cours |
| P10 | `temoins.sh` écrit un verdict vert/rouge, `publier.sh fin` refuse le rouge | cas rouge fabriqué | rtest existants | en cours |
| P9 | juge : 60 tours, BONNES-PRATIQUES lues, tableau du modeleur après ses propres verdicts | selftest | selftest | en cours |
| P12 | appariement `cw-*` exact, paire manquante dite en question | « rose » ne prend plus « rose-vif » | — | en cours |
| P14 | `pipe.py models` sur le binaire actuel avec `--effort xhigh` | les 3 appels répondent, `effort` facturé | — | à faire (5 k eq) |

### 7.2 Réalisme, par gain attendu

| # | Modification | Planche avant/après ou contrôle | Gain attendu | État |
|---|---|---|---|---|
| R1 | `svCross` : zones de couleur en travers de la pièce (centre, marge, nervure médiane) | cymbidium et anémone D 800, face et 3/4, sans/avec | 4.8d « aplats avec zones » : toutes les sortes `svDraw` | en cours (`matiere-v4`) |
| R2 | `svTrans` : lumière transmise colorée selon une carte de minceur, bord éclairé par derrière | même planche | 4.8e « légères transparences », 4.8b « terne » | en cours |
| R3 | rosette : un dégradé le long et en travers de chaque pétale au lieu d'un aplat | rose standard blanche et rouge D 800 | le produit phare quitte le papier découpé (3.10) | à faire, proposition pour les roses publiées |
| R4 | `svRelief` : nervures en rainure et arête, cloques | pétale d'anémone, feuille de rose, gros plan | nervures en creux (feuilles, 7.5) | à faire |
| R5 | `svLeaf`, étape 1 : `amaLeafSheet` promue en préréglage commun, appliquée à l'amarante dressée et aux feuilles génériques `stemLeaf` | feuille dressée avant/après contre photo | critique amarante, et ~28 sortes de bouquet | à faire |
| R6 | `svShadow` : ombre de contact serrée + ombre portée douce selon l'écart de profondeur | cœur et recouvrements d'une rose, d'une orchidée | volume entre pièces (4.8b « ombres portées nettes ») | à faire |
| R7 | `svSheen` : cire, satin, velours, brillant distincts, reflet net | tulipe, rose, anthurium | matière reconnaissable sans légende (3.10) | à faire |
| R8 | sections de tige et nœuds (`c.sv.section`, `c.sv.nodes`) sur `svTubeN` | tige d'œillet et de delphinium contre photo | prérequis œillet 14, delphinium 12, lis | à faire avant ces sortes |
| R9 | pédicelle articulé ombré (remplace les aplats d'orchidée et les traits de grappe) | hampe de phalaenopsis, grappe de lilas à 200 % | rien ne flotte, pédicelles en volume | à faire |
| R10 | cou unique : arc à longueur conservée, gravité au fané, « figé en bouquet » à `ex,ey` égaux | rose et tulipe fanées, planche et bouquet | le fané en bouquet pend comme en planche | question Q4 |
| R11 | cœur par variété : bloc `varietes` de la fiche lu par les fiches de dessin | cymbidium : 4 cœurs contre leurs photos | BONNES-PRATIQUES 2.12 | à faire, sorte par sorte |
| R12 | plein détail à DET 1 (rosette, capitule, boule, feuilles 2D) | bouquet à la taille de la boutique, avant/après | les fleurs de la boutique au niveau des planches | question Q3 |
| R13 | ombre des têtes et des feuilles sur les tiges en bouquet (filtre de `c5.js`, sans géométrie) | 3 bouquets à 2 400 px | intégrité globale du bouquet | question Q6 |
| R14 | courbes de déclin et de fané propres pour les sortes qui empruntent (tulipes, roses intermédiaires, orchidées, gerbera, spathes) | paires déclin et fané contre photos | stades crédibles | à faire, sorte par sorte |

### 7.3 Outils de mesure (rendent le réalisme contrôlable)

| # | Outil | Pour | État |
|---|---|---|---|
| O1 | `svtest &axes=1` : nervure médiane, sens de +u, normale de chaque pièce | fin des réglages à l'aveugle (cymbidium) | en cours (`outils-v4`) |
| O2 | rapport de visibilité par pièce et nombre de paires en conflit d'ordre | pétales transparents (rose) | à faire |
| O3 | montage photo/rendu grand format, détourage par teinte sur fond chargé | comparaison, juge | à faire |
| O4 | `img.py prof` (h/w du profil) et mesures d'organe versées dans la fiche | forme (dahlia), feuilles, tiges | à faire |
| O5 | sonde de jointure pour `lsHeadS`, `svorScape`, `grDraw` ; `conn.py` dans `fleur/` | « rien ne flotte » mesuré partout | à faire |
| O6 | coudes de `qa13` étendus aux axes et feuilles, total dans `qawatch` | tiges cassées | à faire |
| O7 | audit « tige qui traverse sa tête » | fanés de rose et de tulipe | à faire |
| O8 | fond sombre pour `bq=1` | bouquet modèle sur fond sombre (9.2) | à faire |
| O9 | `shot_p.sh` qui reconstruit et renvoie l'exception JS au lieu de « NO OUTPUT » | rendus perdus | à faire |
| O10 | `fleur/fiche.py check` : schéma, valeurs sans source, écarts fiche/code, couverture | fiche morphologique | en cours (pilote) |

### 7.4 Processus, suite (après les préalables)

| # | Modification | Contrôle |
|---|---|---|
| P5 | paires feuille (dessus), coupe de tige et jonction dans `PAIRS` | `plant=1` à l'échelle de la photo, `jgap.py` 0 pièce détachée |
| P6 | contrôle couleur chiffré dans `finition` : `cwmed.py` par coloris, dL ≤ 7, dh ≤ 10° | coloris volontairement faussé refusé |
| P7 | audit ΔE des photos `coloris:` à `refs` ; champs « vu » `groupe=` et côté court ≥ 1 000 px | la photo 122 du cymbidium est écartée |
| P8 | `forme` exige une paire de face mesurée et un `rtest` de la sorte avant « fait » | `check_forme` lit les deux lignes |
| P11 | photos des paires exigées vérifiées dès `refs`, pas après le modelage | `--only refs --dry` annonce les manques |
| P13 | témoins légers (rtest, anémone) avant `comparaison`, `qa` après le juge | ordre affiché par `--dry` |
| P15 | fiche morphologique remplie à l'étape `refs`, lue par `forme` (dès que Q1 est tranchée) | `fiche.py check` sans erreur, valeurs `code` < 30 % |

## 8. Appliqué dans cette passe

Trois chantiers, chacun commité à part, publiés seulement quand les témoins sont verts :
- `ch/outils-v4` : P1 à P4, P9, P10, P12, O1 ;
- `ch/matiere-v4` : R1 `svCross`, R2 `svTrans`, en option, avec planches avant/après sur le cymbidium et l'anémone (sans
  changer les sortes publiées : la démonstration passe par `svfx=` dans la page pilote) ;
- fiche pilote de l'anémone et `fleur/fiche.py`.

Les résultats et les planches sont relevés au §10 quand ils sont relus.

## 9. Questions au porteur

1. **Format de la fiche morphologique** : JSON versionné par sorte, lu et contrôlé à part (proposition), ou garder le JS comme
   seule source en y ajoutant des commentaires de provenance ?
2. **Formes sans photo** (cymbidium fané, hampe entière du phalaenopsis) : les marquer `hypothese` et les garder, ou les retirer
   des planches jusqu'à ce qu'on ait des photos ?
3. **Plein détail à DET 1** : dessiner les fleurs de la boutique (têtes de 30 à 80 px) avec le plein détail des planches, sorte
   par sorte, puisque le poids ne compte plus ? Proposition : oui, avec un budget de sécurité par bouquet mesuré en QA.
4. **Le fané en bouquet** : courber le cou comme en planche, à longueur égale pour garder les compositions (proposition), ou
   garder la rotation rigide actuelle ?
5. **Refontes qui changent les sortes publiées** (zones, contre-jour, rosette en dégradé) : les appliquer sorte par sorte après
   validation de leurs planches avant/après, ou ne les donner qu'aux sortes nouvelles ?
6. **Ombre des têtes et feuilles sur les tiges** en bouquet : un essai sur 3 bouquets avant décision ?
7. **Contre-jour** : la lumière transmise doit-elle réchauffer et saturer la couleur (proposition, mesurée sur photos à
   contre-jour) ou seulement l'éclaircir ?
8. **Juge** : le garder en Opus (même famille que le modeleur, risque d'ancrage) ou essayer un autre modèle ?
9. **Anthurium en bouquet** : accepter que les bouquets qui en contiennent bougent un peu (`ANTH_BOX=false`) ou exiger la boîte
   de l'ancien dessin ? (question déjà posée)
10. **Trois nœuds de tige** (dahlia, hortensia, orchidée) : les unifier dans le moteur de jointures, au risque de retoucher des
    planches validées, ou laisser ces trois sortes telles quelles ?
