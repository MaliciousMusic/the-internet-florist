# fit.py : ajuster les réglages d'une fleur sur ses mesures (2026-10-08)

Opus pose la structure (forme, pièces, réglages libres et bornes) ; `fit.py` trouve les valeurs par rendus headless et mesures d'image ;
Opus ne regarde que `fit.png`. Aucun modèle de langage dans la boucle, aucun tirage : mêmes entrées, même résultat.

## Commandes (depuis la copie de travail, serveur 8765 et recv.py 8781 allumés)
- `python fleur/fit.py <sid> --space space.json --targets targets.json [--cw i] [--view 2,0,3] [--budget 60] [--out dir]`
- `python fleur/fit.py targets <sid> --refs <refcache/<sid>> --out targets.json [--family grappe]` : mesure les photos gardées.
- `python fleur/fit.py targets <sid> --render --space space.json --out t.json [--cw i] [--plant] [--family grappe]` : mesure le dessin actuel.
`--family grappe` (aussi panicule, thyrse, racème, épi) : inflorescence au lieu de fleur radiale, voir « Famille grappe » ; `targets.json` le garde (`family`), le fit le relit.
- `python fleur/fit.py cmp photos.json dessin.json` : les deux côte à côte, écart en tolérances.
`--cw` : id ou rang dans `CWS[sid]`. `--view` : vues de la planche avant/après. `--budget` : jeux de réglages essayés au plus.

## space.json (écrit par Opus)
```json
{"spec":"SVT_SIMPLE","cw":"0","set":[
 {"path":"L.0","min":1.2,"max":2.2,"step":0.02,"x0":1.6},
 {"path":"L.1","link":"L.0"},
 {"path":"$SVT_GENES.tep.dL.0","min":0.9,"max":1,"step":0.01},
 {"path":"cupArc","type":"bool"},
 {"path":"mat.st.3.1:l","min":-0.1,"max":0.1,"step":0.01}]}
```
- `spec` : nom global de la fiche (`SVA_P`, `SVT_SIMPLE`...) ; elle est modifiée en place le temps d'un candidat, puis rendue intacte.
- Chemins : `L.0`, `a1.0.1`, `light.ks` = réglage de svBloom (pris dans `SVB_DEF` si la fiche ne l'a pas) ; `$NOM.a.b` = clé de tout objet
  global (table de gènes `$SVA_GENES.tep.dL.0`, plante `$GHI.tulipe-simple.sw`, feuilles `$SVL_DEF.w`) ; `mat.<champ>` = matière du coloris ;
  suffixe `:h` `:s` `:l` = décalage de couleur (`svShift`, départ 0).
- `x0` : départ (sinon la valeur actuelle, lue par un premier rendu). `type` : `bool` ou `int`. `step` : pas (les valeurs y sont arrondies).
- Lien : `{"path":"L.1","link":"L.0","k":0.94,"b":0}` donne L.1 = k·L.0 + b ; sans `k`, le rapport actuel est gardé.

## targets.json (écrit par `targets`)
`{"stages":{...},"m":[{"id","stage","kind","v","tol","w","n","sd","cw"?,"part"?}],"dropped":[[photo, raison]]}`.
| stade | case rendue | mesures |
|---|---|---|
| bouton | op .08, vue 7 (profil), tête x2, graines 3 et 8 | `hw` hauteur/largeur |
| entrouverte, ouverte | op .55 / .9, vue 7 | `wh` largeur/hauteur, `ang` angle des flancs (degrés) |
| face | op 1, vue 0 | `lab` base / corps / pointe (refs.py auto), par coloris |
| tige | plante entière sans tige longue | `stem` épaisseur de tige / largeur de fleur |
| feuille | plante avec `full=30` | `leaflw` longueur/largeur, `leafang` angle à la verticale |
Les ops et vues se changent dans `stages` du fichier. Silhouette rognée de ses rangées étroites (tige, col), mesurée par `img.py measure` ;
la même fonction sert au dessin et aux photos. Tolérance : max(plancher du genre, dispersion des photos) ; planchers hw/wh .06, ang 3,
lab 5 (ΔE), stem .02, leaflw .3, leafang 6. Poids `w` (1 par défaut) : à monter sur la mesure qui compte (le stade vendu).
Photos : `keep.json` de refs.py (étiquettes `stade:` `vue:` `organe:` `coloris:`) ou, à défaut, `img/*` (étiquettes tirées des noms ; vue
devinée : face si l/h .7 à 1,45, profil au-delà de 1,6). Écartées et notées : silhouette coupée ou fond confondu, couleurs peu sûres (< .5).

## Famille grappe (lilas, jacinthe, muscari, glycine, freesia)
Pas de coupe, de bouton ni d'ouverture : la tête est l'inflorescence entière, mesurée en rapports (aucune taille absolue), mêmes fonctions pour le dessin et les photos
(`thyrse`, `gcomps`, `body_lab` de fit.py). Stades `bouton`, `entrouverte`, `ouverte` (étiquettes `stade:` seules, vue ignorée) :
| mesure | sens | plancher de tolérance |
|---|---|---|
| `hw` | longueur/largeur de la boîte, lue dans les axes principaux (une photo penchée vaut une grappe dressée) | .06 x valeur (.06 au moins) |
| `taper` | largeur du tiers étroit / largeur du tiers large ; 1 = cylindre ; sans sens haut-bas (lilas dressé ou glycine pendante) | .08 |
| `fill` | aire / boîte | .06 |
| `face.lab.corps` | couleur du corps (Lab de la couleur médiane de la silhouette), par coloris | 5 (ΔE) |
Les rangées étroites aux deux bouts (tige, col, pointe fine : moins d'un cinquième du plus large) sont retirées. Photo : on garde les corps isolés qui ne touchent aucun bord,
couvrent 2 à 60 % du cadre et sont presque convexes (aire/enveloppe .72), loin de la couleur de la bordure et hors feuillage (vert, teintes de 35 à 170 degrés, ombres ;
dès 65 pour un coloris jaune ou orange) ; une photo = la médiane de ses grappes. Écartées : photos d'organe (`bourgeon`, `tige`, `feuille`), portraits gros plan, bouquets confondus,
arbustes entiers. Il en reste souvent 3 à 6 : les tolérances montent avec la dispersion. Les mesures de tige et de feuille restent celles du tableau ci-dessus.

## Ce que fait le fit
- Coût = moyenne pondérée de (écart / tolérance)² ; arrêt dès que tout est dans la tolérance, au budget, ou quand le pas est au plus fin.
- Recherche : grille 5 ou 5x5 si 1 ou 2 réglages, puis Levenberg-Marquardt groupé : chaque lot = balayage du meilleur point (un pas par
  réglage, la jacobienne des mesures) + 4 pas amortis depuis la jacobienne précédente ; pas du balayage divisé par deux si un lot n'apporte rien.
  (La descente par coordonnées seule cale quand deux réglages couplés font la même mesure.)
- Un lancement de Chrome par lot (une case par candidat et par stade, 120 cases au plus), toujours par `shot.sh` (la porte : 3 Chrome, RAM).
- Sorties : `<dir>/fit.json` (`best`, `lies`, `dev` par mesure avec cible/avant/après/écart, coûts, rendus, lancements, durée),
  `sens` (de combien chaque réglage bouge chaque mesure, en tolérances, pour un dixième de sa plage : les réglages qui comptent),
  `<dir>/fit.png` (avant/après par vue, du bouton au fané, 1 000 px), 20 lignes de console. `FIT_KEEP=1` garde les planches de lot. fit.py n'écrit jamais dans les fiches :
  Opus ou pipe.py reportent `best` et `lies`.

## Limites
- Les mesures de profil voient la silhouette, pas le détail (marges, nervures, cœur) : Opus juge sur `fit.png`.
- Une photo non découpée, en gros plan ou sur fond chargé donne peu de silhouettes sûres : garder des photos de profil isolées (refs.py
  `keep` avec `vue:profil`) pour le bouton et la coupe. Les couleurs ne valent que pour le coloris étiqueté.
- Grappe : le fit ne voit que la silhouette ; la densité des fleurons, leur taille et le détail de la tige restent à l'œil d'Opus sur `fit.png`. Peu de photos propres : poids `w` à garder à 1.
- Le cœur (`heart`) est une fermeture : ses réglages ne se fittent que s'il lit un objet global (`$...`).
