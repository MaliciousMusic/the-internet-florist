# Fiche morphologique d'une sorte : schéma `fiche-morpho/1`

Proposition de l'audit V4 (18 octobre 2026) ; format retenu par le porteur le même jour (Q1 d'`AUDIT-V4.md` : un JSON par sorte, contrôlé
par `fiche.py`). Révision du chantier `outils-v4b` : héritage `suit`, unités `jours`/`rad`/`hex`, repère des angles, constantes en dur
(`code: "const"`), écarts typés, méthode `regle` (faiblesses W1, W3, W4, W5, W6, W10, W12, W13, W14 de `fiches/RAPPORT-pilote.md`).
Une fiche décrit la plante comme un botaniste la décrirait à un dessinateur : chaque organe, sa forme, sa matière, ses zones de
couleur et ce qui change d'un stade à l'autre et d'une variété à l'autre. Chaque nombre dit d'où il vient. Le dessin se règle
d'après la fiche, et un contrôle (`fleur/fiche.py check`) signale tout écart entre la fiche et le code.

On recrée, on ne décalque pas : les photos servent à mesurer (proportions, angles, courbures, zones, couleurs), jamais à copier
un contour. Les photos de tiers restent dans `refcache/` ; la fiche ne garde que leurs identifiants et les mesures.

## 1. Fichier

`catalogue/serre/fiches/<sid>.json`, en UTF-8 et LF, une fiche par sorte, versionnée par git. Champs de tête :

| Champ | Sens |
|---|---|
| `schema` | `"fiche-morpho/1"` |
| `sid`, `nom`, `taxon` | identifiant de la sorte, nom français, nom botanique (genre, espèce, groupe horticole) |
| `kit` | moteur qui la dessine (`svBloom`, `svRose`, `svorDraw`, `grDraw`, `svSpd`, `svcap`, …) et module de la fiche de dessin (`app/y-*.js`) |
| `photos` | registre des photos citées (§3) |
| `organes` | description par organe (§4) |
| `varietes` | ce qui change d'un coloris à l'autre, forme comprise (§6) |
| `stades` | table des stades de vie (§5) |
| `rendu` | réglages qui ne sont pas de la botanique : bouquet, niveau de détail, budget (§7) |
| `questions` | ce qui manque ou reste à décider : liste de `{"id": "Q1", "organe", "question", "proposition"}` ; un texte de la fiche qui cite `Q1` doit trouver la question (contrôlé) |
| `etat` | facultatif : `{pilote, date, auteur, note}` |

## 2. La valeur et sa provenance

Toute valeur mesurable est un objet `V`, jamais un nombre nu :

```json
{"v": 0.64, "plage": [0.58, 0.70], "unite": "L", "n": 4,
 "methode": "segmente", "photos": ["anemone-coronaria:3f9a1c2e", "anemone-coronaria:77b0d415"],
 "conf": "B", "code": "SVB_DEF.vb", "retenu": 0.64, "ecart": null}
```

- `v` : valeur retenue pour le dessin ; `plage` : étendue observée (individus, photos) ; `n` : nombre de mesures.
- `unite` : `L` (part de la longueur de la pièce), `R0` (demi-diamètre de la fleur ouverte), `D`, `deg`, `rad`, `mm`, `cm`, `n`
  (compte), `ratio`, `jours` (durée de vie en vase), `hex` (une couleur `#rrggbb`, ou une liste ; sa `plage` est la liste des mesures
  par photo), ou rien pour un mot.
- `repere` : obligatoire pour un angle (`deg`, `rad`), refusé sinon : `axe` (de l'axe de la fleur), `plan` (élévation au-dessus du
  plan de la fleur), `horizontale`, `tige` (de la ligne de la tige ou du pédicelle droit), `piece` (autour de l'axe propre de la
  pièce : une torsion). Un angle relevé sans repère connu prend le plus probable et le dit dans `ecart`.
- `methode`, du plus sûr au moins sûr : `mesure-echelle` (photo avec échelle connue), `segmente` (masque de l'organe, pixels
  comptés : `fleur/organ.py`, `fit.py targets`, `img.py pair`), `regle` (une règle en pixels sur la photo, sans masque : deux
  photos concordantes = confiance B), `oeil` (lu à l'œil sur photo, ±25 %), `reference` (flore, registre, obtenteur : le texte
  va dans `ref`), `code` (valeur qui n'existe que dans le code, sans source : à mesurer), `hypothese` (aucune photo ni référence :
  à dire au porteur). `mesure-echelle`, `segmente` et `regle` exigent leurs `photos`.
- `conf` : A (plusieurs photos concordantes ou référence botanique), B (2 à 3 photos), C (une photo ou l'œil), D (hypothèse).
- `code` : chemin de l'expression qui porte la valeur dans le dessin (`SVA_GENES.n`, `S_ANEM.a1[0][1]`, évaluée par
  `fleur/fiche_eval.js`) ; ou `"const"` pour une constante écrite en dur dans une fonction, avec `ligne` :
  `"app/<fichier>.js:<n>"` (le contrôle relit la ligne : chaque nombre de `retenu` doit y figurer, sinon le code a bougé).
  `retenu` : la valeur lue dans le code au dernier contrôle.
- `ecart` : pourquoi le code (ou `v`) s'écarte de la mesure, typé : `{"type": "confirme" | "divergence" | "budget", "texte": "..."}`.
  `confirme` : le code est dans la plage ou l'incertitude de la mesure, le texte le montre ; `divergence` : le code ou les sources
  s'écartent de la mesure (une question `Qn` le plus souvent) ; `budget` : un choix de rendu (niveau de détail), pas de botanique.
  Un écart en texte libre est refusé.
- Raccourci admis pour un mot ou une liste sans mesure : `{"v": "aigue", "methode": "oeil", "photos": [...]}`.

## 3. Les photos

Clé portable `<sid>:<8 premiers hex du sha1 de l'URL source>` (et non l'index de `kept.jpg`, qui change d'un chantier à
l'autre). Entrée : `{"titre", "auteur", "licence", "url", "local": "ch/<chantier>/refcache/<sid>/<fichier>", "tags":
["stade:ouvert", "vue:face", "organe:tepale", "coloris:bleu"], "vu": "ce qu'on y voit, en une phrase", "echelle": null |
{"mm_par_px": 0.08, "methode": "règle visible"}}`. Les champs viennent de `refs.py keep` (`keep.json`). Une photo n'est
citée que si elle montre la sorte (BONNES-PRATIQUES 1.7) ; les photos d'une autre espèce ou d'un hybride voisin portent
`"groupe": "autre"` et ne servent pas aux mesures. Clé : sha1 de `url_image` quand elle existe, sinon de `url` (la page), sinon de
`"File:" + titre` (`"cle_depuis": "url_image" | "url" | "titre"`). Dans `pipe.py`, l'étape `fiche` pose le registre d'après
`keep.json` (photos regardées, champ « vu ») : la fiche ne cite que des photos gardées.

## 4. Les organes

`organes` est un objet dont chaque clé nomme un organe (`tepale`, `petale.externe`, `labelle`, `coeur.etamines`,
`coeur.pistils`, `receptacle`, `bouton`, `calice`, `collerette`, `feuille`, `tige`, `pedicelle`, …). Chaque organe porte les
rubriques de son rôle (table ci-dessous) ; une rubrique sans objet s'omet, une rubrique inconnue s'écrit `{"v": null, "methode":
"hypothese"}` et part dans `questions`. Un organe que le dessin ne trace pas (la feuille d'une tige coupée) porte `"dessinee": false`.
Héritage : une rubrique ou une valeur identique à celle d'un organe frère s'écrit `{"suit": "<organe>.<rubrique>[.<clé>...]"}`
(ex. `{"suit": "tepale.externe.matiere"}`) ; le renvoi doit exister (contrôlé), la couverture compte la cible.

| Rôle | Rubriques attendues |
|---|---|
| `perianthe`, `bractee` | nombre, disposition, contour, taille, courbure, matiere, nervation, zones, jointures, stades |
| `coeur`, `calice` | nombre, disposition, contour, taille, matiere, zones, jointures, stades (une autre rubrique reste admise) |
| `receptacle` | taille, matiere, zones, jointures, stades |
| `bouton` | disposition, contour, taille, matiere, zones, jointures, stades |
| `tige`, `pedicelle` | taille, courbure, matiere, zones, jointures, section, stades |
| `feuille` | toutes, section comprise (pétiole) |

| Rubrique | Contenu |
|---|---|
| `role` | `perianthe`, `coeur`, `bouton`, `bractee`, `calice`, `receptacle`, `pedicelle`, `tige`, `feuille` |
| `nombre` | `V` (compte, ou loi `[[n, poids], …]` dans `v`) |
| `disposition` | `type` (`verticilles`, `spirale`, `capitule`, `grappe`, `opposees`, `alternes`, `verticillees`, `rosette`), `verticilles`, `recouvrement` (part de largeur recouverte par la voisine), `ordre` (qui passe devant) ; la structure des couches (porteur, 2026-10-18) : `insertion` (hauteur d'insertion de chaque verticille ou rang sur le réceptacle, en L de la pièce, l'externe à 0), `decalage_deg` (décalage angulaire d'un verticille au suivant), `differences` (ce qui distingue les verticilles : largeur, marge, ondulation, couleur, nervure, réflexion), `profondeur_gorge` (profondeur de l'entonnoir sous l'ouverture, en L de la pièce, mesurée de profil avec fleur/volume.py) |
| `contour` | `base` (`onglet`, `cunee`, `arrondie`, `cordee`, `tronquee`, `engainante`), `epaules`, `pointe` {`type` : `aigue`, `acuminee`, `arrondie`, `obtuse`, `echancree`, `mucronee`, `ondulee` ; `angle_deg` ; `recourbee`}, `profil_largeur` (`[[v, demi-largeur en L]…]`, base 0, pointe 1), `vb` (plus grande largeur), `L_sur_l`, `asymetrie`, `marge` (`entiere`, `dentee`, `frangee`, `ondulee`, `crenelee` ; dents : nombre, profondeur) |
| `taille` | longueur, largeur (`R0`, `D` ou `cm`), rapport à la tête ou à la tige |
| `courbure` | `longitudinale` {`pied_deg`, `pointe_deg`, `profil` : `droite`, `arquee`, `en-S`, `reflechie`}, `transversale` {`type` : `plat`, `gouttiere`, `creux`, `revers`, `roule`, `carene` ; `profondeur`}, `torsion_deg`, `ondulation` {`n`, `amplitude`} |
| `matiere` | `epaisseur` (`fine`, `moyenne`, `epaisse`, ou `mm`), `translucidite` (0 opaque … 1 voile), `texture` (`cire`, `velours`, `satin`, `papier-de-soie`, `papier-froisse`, `cuir`, `mat`, `glauque`), `brillance` (0…1), `grain` (`lisse`, `papilleux`, `scintillant`) |
| `nervation` | `type` (`parallele`, `pennee`, `palmee`, `reticulee`, `eventail`), `n`, `relief` (`creux`, `relief`, `plat`), `visible` (`face`, `dos`, `les-deux`, `contre-jour`), `fourches`, `couleur` (`plus-sombre`, `plus-claire`, `coloree`) |
| `zones` | liste `{zone, etendue {v: [a,b], u: [a,b]}, motif {type, densite, taille, direction}, bord (net / fondu)}`, zones `base`, `corps`, `pointe`, `marge`, `nervures`, `mouchetures`, `flammes`, `oeil`, `halo`, `macule`. Les couleurs ne sont pas ici : elles sont par coloris (`catalogue/serre/sources/<sid>.json`) ; la fiche dit où sont les zones et comment elles se fondent |
| `jointures` | liste `{vers, type, params}` : `insertion` (rayon, hauteur, épaisseur, cicatrice), `onglet`, `articulation`, `gaine`, `petiole`, `noeud`, `col` ; voir `AUDIT-V4.md` §3.3 |
| `section` | pour tige, pédicelle, pétiole : `ronde`, `carree`, `ailee`, `plate`, `cotelee`, `creuse` ; diamètre (`D` ou `mm`), effilement, côtes, poils, voile |
| `stades` | ce qui change à chaque stade (§5), en surcharge des rubriques ci-dessus |
| `code` | correspondance libre `rubrique → expression du code` quand elle n'est pas déjà dans les `V` |

## 5. Les stades de vie

`stades.table` : une ligne par stade commercial, de `bouton` à `fane`, avec `jours` (vie en vase, d'après `catalogue/fanaison`
et `LIFE_SP`), la plage d'`op` et de `wl` qui le dessine, les photos de ce stade et un `statut` : `mesure`, `herite:<sid>`
(courbes empruntées à une autre sorte : BONNES-PRATIQUES 2.2, à remplacer), `hypothese`. Les stades obligatoires : `bouton`,
`gonfle`, `entrouvert`, `ouvert`, `plein`, `declin`, `fane`, `sec` si la sorte sèche sur tige.
Dans chaque organe, `stades.<stade>` décrit ce qui change : angles, taille, couleur relative, pièces tombées, port de la tête
(« le fané pend de côté, le col s'arque, la tige ne traverse rien »). La continuité est celle des deux pilotes du moteur (`op`,
`wl`) : la fiche donne les états, le moteur interpole.

## 6. Les variétés

`varietes.<id de coloris>` surcharge les organes pour ce coloris : forme du cœur, labelle, macule, œil, pointe, nombre de
pièces (BONNES-PRATIQUES 2.12 : « selon les espèces et variantes la forme du centre change »). Chaque surcharge porte ses photos
de la variété. Une variété sans surcharge suit l'espèce, et le dit : `"forme": "espece"` quand sa forme a été comparée à celle de
l'espèce et la suit, `"forme": "non-mesure"` quand personne ne l'a encore comparée (W11).

## 7. Le rendu, séparé de la botanique

`rendu` garde ce qui relève du dessin et non de la plante : niveau de détail (`DET`), profils de bouquet (`noTip`, `_BQ`, boîte
de l'ancien dessin pour `rtest`), fiches de fané allégées, budget mesuré. Une valeur de `rendu` n'est jamais citée comme une
mesure.

## 8. Contrôles

`python fleur/fiche.py check <sid>` :
1. le fichier suit le schéma (rubriques, `V` bien formés, clés de photos présentes dans `photos`) ;
2. il liste les valeurs sans provenance (`methode` `code` ou `hypothese`) par organe et par rubrique : c'est la liste des
   mesures à faire ;
3. il lit dans le code les expressions `code` (app construite par `mkapp.sh`, évaluée par node) et signale tout `retenu`
   différent du code, et tout `v` qui sort de sa `plage` sans `ecart` écrit ;
4. il imprime le tableau de couverture organe × rubrique (S sourcé, U chiffré sans source, C code seul, M manquant), le même que
   celui d'`audit-v4/notes-morpho-stades.md` §6 ;
5. avec `--lien tete|plante|tout` : chaque valeur chiffrée des organes dessinés du groupe (tête : périanthe, cœur, réceptacle,
   bouton, bractée, calice ; plante : tige, pédicelle, feuille) porte un `code` ou un `ecart` typé.
Il ne rend rien et ne lance aucun navigateur. Sa dernière ligne est un objet JSON (valide, erreurs, valeurs, mesures, part de
`code`, rôles, écarts par type, valeurs non reliées) que lit `pipe.py`.

Dans `pipe.py` : l'étape `fiche` (après `targets`, avant `forme`) remplit la fiche d'une sorte nouvelle ; elle est finie quand
`check` sort à 0, que les valeurs `code` font moins de 30 % des valeurs des organes, qu'au moins 8 valeurs sont mesurées
(`segmente`, `mesure-echelle`, `regle`) avec les outils de mesure lancés dans l'étape, et que les rôles périanthe, bouton, tige et
feuille sont décrits. `forme` lit la fiche et finit sur `check --lien tete`, `plante` sur `check --lien tout`.
