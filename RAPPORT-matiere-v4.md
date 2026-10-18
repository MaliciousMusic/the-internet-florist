# Rapport du chantier matiere-v4 : zones en travers et lumière transmise (2026-10-18)

Branche `ch/matiere-v4`, copie `ch/matiere-v4`. Spécification : notes d'audit v4 A1, A5 (primitives 2 et 3), A6 ;
critiques du porteur 4.8b (« terne et pauvre »), 4.8d (« aplats avec zones »), 4.8e (« légères transparences »).
Décisions du porteur reçues en cours de chantier (2026-10-18) : la lumière transmise ne fait qu'**éclaircir la couleur
propre** de la pièce (ni plus chaude, ni plus saturée) ; les nouvelles matières iront aux **sortes nouvelles** seulement,
les sortes publiées restent telles quelles. La démonstration sur le cymbidium et l'anémone n'est donc qu'une proposition.

## 1. Ce qui a été fait

Deux couches opt-in dans le moteur commun `svDraw` (`app/y1.js`), lues dans la matière d'une pièce. Clé absente :
le rendu est identique à l'octet (vérifié, § 3). Aucun hasard (ni `R()`, ni `rnd()`), aucune géométrie hors de la pièce.

- **`svCross` (`m.cross`)** : zones de couleur **en travers** de la pièce (milieu plus foncé, marges plus pâles, teinte
  qui change du milieu au bord), alors que `svFaceFill` ne varie que le long de la pièce.
- **`svTrans` (`m.transmit`)** : lumière à travers le tissu mince. (a) un lavis là où la face visible se détourne de la
  lumière, pondéré par une carte de minceur ; (b) une lumière de bord de largeur constante dans le contour, plus forte du
  côté de la lumière (généralise la bande de l'hortensia, `y3-hortensia.js`, et la bande `edge + glow` des orchidées).
- **`svLevels`** (outil commun) : un champ de couverture 0..1 aux sommets de la grille de la pièce devient n courbes de
  niveau emboîtées (`svIso`, `svLoopsD`), qui forment la **luminance d'un masque** posé sur le **contour même de la pièce**
  (`<use href="#sp…" mask=…>`). Conséquence : rien ne peut dépasser la pièce, même par le débord d'une spline à une pointe,
  et le `getBBox` des têtes (c5 place les têtes du bouquet par lui) ne bouge pas. La première version, en chemins colorés
  directs, agrandissait la boîte de 0,5 à 1 px aux pointes du cymbidium (mesuré, corrigé par le masque).
- **Branchement** : `svBloom` (`y3.js`) et `svorMatOf` (`y3-orchidee.js`) transmettent `cross` et `transmit` depuis le
  coloris (svBloom) ou le genre de pièce (orchidées : `mat(cw).pet`, `.sep`…), couleurs décalées comme celles de
  l'individu, atténuées dans le bouton. Aucune fiche publiée (`y-*.js`) n'est touchée.
- **Pilote** : `pilote/sv.html?…&svfx=cross,trans` (ou `cross`, `trans` seul) applique les blocs de démonstration de
  `app/y3-fx.js` (anémone bleu et blanc, cymbidium blanc et rouge) par-dessus la matière, sans modifier les fiches.
  `svtest.js` appelle `svfxApply()` une fois au chargement ; sans `svfx=` il ne fait rien. `&bbox=1` ajoute aux mesures le
  `getBBox` de chaque tête. `y3-fx.js` est pris par le motif `y3-*.js` de `mkapp.sh`, `mkpl.sh`, `mkqa.sh` et
  `decor/scene/mkengine.sh`, donc présent dans la boutique, mais **inerte** : des données et une fonction jamais appelées
  hors du pilote (question 4).
- **Fiche du kit** : `fleur/KIT.md` § 6.3 (attributs `cross`, `transmit`) et § 8 (`svfx`, `bbox`).

Commits : `0c27206` (svCross + pilote), `b27eb9e` (svTrans, masque, mesure bbox), `021bdc9` (lumière transmise = couleur
propre éclaircie, décision du porteur ; réglages de coût ; fiche du kit), puis ce rapport et les planches.

## 2. Paramètres

### `m.cross` : une zone `{…}`, une liste de zones, ou les arrêts seuls `[[x, couleur, alpha]…]`
| Clé | Sens | Défaut |
|---|---|---|
| `st` | arrêts `[[x, couleur, alpha]…]`, x = \|u\| (0 nervure médiane .. 1 marge) | requis |
| `sg` | 1 : x = u signé (-1 .. 1), une moitié différente de l'autre | 0 |
| `tip` | à partir de v = tip, la pointe compte comme marge : x = max(\|u\|, (v-tip)/(1-tip)) | aucun |
| `v` | fenêtre le long de la pièce `[a,b]` (entrée) ou `[a,b,c,d]` (entrée, sortie) | toute la pièce |
| `bk` | facteur sur le dos | 0 (face seule) |
| `k` | facteur global (le kit y met le bouton) | 1 |
| `n` | paliers par couleur [zoom, normal] | [6,3] |
| `soft` | flou des paliers dans le masque (× longueur de la pièce) ; 0 = net | .025 |
Chaque couleur des arrêts est un champ à part (sa part de l'alpha) ; les zones se posent sous les lavis, flammes, taches
et liserés : la lumière modèle encore la zone.

### `m.transmit`
| Clé | Sens | Défaut |
|---|---|---|
| `a` | (a) alpha le plus fort du lavis transmis (absent : pas de lavis) | aucun |
| `thin` | carte de minceur `[t0,ku,kv]` : 1 - (1-t0)(1-\|u\|)^ku (1-v)^kv | [.3,1.4,1.2] |
| `dk` | détour de la face (-n·L) pour un lavis entier | .5 |
| `wr` | jusqu'où le lavis entre du côté éclairé (douce lueur des blancs à demi éclairés) | 0 |
| `n` | paliers [zoom, normal] | [4,2] |
| `lk` | [lavis, bord] : part du chemin vers le blanc de la **clarté** (TSL, teinte et saturation gardées) | [.4,.55] |
| `w` | (b) largeur de la lumière de bord, × D (absent : pas de bord) | aucun |
| `eo` | alpha du bord [côté lumière, côté opposé] (dégradé blanc dans le masque) | [.55,.2] |
| `ev` | le bord apparaît de v = ev[0] à ev[1] (pied épais sans bord) | [.06,.26] |
| `ep`, `en` | profil (1-d/w)^ep, paliers [zoom, normal] | 1.4, [4,3] |
| `tc`, `ec` | couleur imposée du lavis, du bord (non employées : décision du porteur) | aucune |
| `bk`, `k` | facteur sur le dos, facteur global | 1, 1 |
La distance au contour est mesurée le long de la feuille en 3D (rangée vers les marges, colonne vers la pointe) : le bord
ne longe jamais l'onglet ni un pli. Par défaut, lavis et bord sont la rampe propre de la face (`stops`/`bstops`) éclaircie.

### Démonstration (`app/y3-fx.js`, réglée à l'œil contre les photos gardées c16, 49, 58, 119, 15, 84 du cymbidium et les coloris mesurés ; photos restées dans refcache)
| Sorte, coloris | cross | transmit |
|---|---|---|
| anémone bleu | milieu #3a2a9c .3 → 0 à .28 ; marges #8c78ea 0 à .6 → .42 ; pointe dès .8 ; v .1-.3 | a .42, w .02, eo [.42,.15], lk [.35,.5] |
| anémone blanc | milieu crème #ece4cc .32 → 0 à .42 ; marges blanc .6 ; v .12-.34 / .86-1 | a .55, wr .35, w .022, eo [.55,.22], lk [.6,.8] |
| cymbidium blanc (sépales, pétales) | milieu #e8e6c4 .34 → 0 à .32 ; marges blanc .55 ; pointe dès .8 | a .5, wr .3, w .026, eo [.6,.25], lk [.6,.8] |
| cymbidium rouge (sépales, pétales) | nervure #a42a44 .46 → 0 à .22 ; marges #f0a0a6 .44 ; pointe dès .85 | a .38, w .022, eo [.5,.18], lk [.3,.45] |

## 3. Témoins (chaque commit)

Rendus un à un par `fleur/shot_p.sh` (serveur 8805), `ramwait.sh` avant chaque rendu, graine 3, pages reconstruites
(`LC_ALL=en_US.UTF-8 sh mkapp.sh` : avec cet ordre de tri des `y3-*.js`, la page de la copie avant travaux est identique
à l'octet à celle du principal, `cmp`). Référence « principal » : la copie avant travaux (page identique au principal),
le rendu direct de la page du principal ayant été refusé par le garde-fou.

| Témoin | 0c27206 | b27eb9e | 021bdc9 |
|---|---|---|---|
| Anémone, requête `base_q.txt`, `img.py diff` contre `fleur/out/base_v2.png` du principal | 0,00 % | 0,00 % | 0,00 % |
| Gros plan cymbidium sans svfx (blanc, rouge ; vues 0, 2 ; D 800) contre la référence | 0,00 %, balisage identique | 0,00 %, identique | 0,00 %, identique |
| Gros plan anémone sans svfx (bleu, blanc ; D 800) | — | 0,00 %, identique | 0,00 %, identique |
| rtest `anemone-coronaria~0:6` / `cymbidium-grandes-fleurs~0:6` / `tulipe-simple~0:4` (séparés) | = principal (10/10, 10/10, 9/10) | = principal | = principal |
| rtest `rc=anemone-coronaria~0:6,cymbidium-grandes-fleurs~0:6,tulipe-simple~0:4&sv=11` | = principal (6/10) | = principal | = principal |
| rtest avec `svfx=cross,trans` (anémone ~0 = blanc, cymbidium ~0 = blanc, coloris de la démo) | — | 10/10, 10/10 | 10/10, 10/10 |
| `getBBox` des têtes avec et sans svfx (`bbox=1`, D 300, 4 vues ; cymbidium 3 stades × 2 coloris, anémone 5 stades dont bouton et fané × 2) | — | 24/24 et 40/40 identiques | 24/24 et 40/40 identiques |

- Les « DIFFERENT » du rtest (tulipe seule : coupe à 2:0.5 ; mélange : 4 cas sur 10) existent au principal, avec les mêmes
  hachages à l'octet (fichiers JSON identiques) : ils ne viennent pas de ce chantier.
- Comparaison de balisage : une fois, les identifiants (`sp3` contre `sp2953`) commençaient plus loin, selon ce que la page
  avait dessiné au démarrage ; à identifiants renumérotés par ordre d'apparition, le balisage est identique. Comparer les
  balisages ainsi, pas à l'octet brut.

## 4. Planches avant | après (nos rendus seulement, aucune photo)

- `catalogue/serre/methode/audit-v4/planches/matiere-v4-cymbidium.png` : blanc et rouge, face et trois-quarts, D 800, op .85.
- `catalogue/serre/methode/audit-v4/planches/matiere-v4-anemone.png` : bleu et blanc, mêmes vues.
- `catalogue/serre/methode/audit-v4/planches/matiere-v4-details-200.png` : marges et pointes à 200 %, colonnes avant |
  cross | trans | cross + trans.
Requêtes : `grid=1&sid=<sid>&cws=<c1>,<c2>&st=.85:0&view=0,2&D=800&seed=3` puis la même avec `&svfx=cross,trans`.

Mon jugement à 200 % : zones lisibles (nervure plus foncée du rouge comme sur c16, milieu crème des blancs, marges plus
claires du bleu) ; marges minces plus lumineuses, dans la teinte de la pièce ; aucun halo hors de la pièce, aucun contour
de dessous visible, pièces opaques ; blancs jamais gris du fait des couches (voir limite 4) ; pas de marche visible entre
paliers (4 à 6 paliers, flou dans le masque pour les zones, profil adouci pour le bord).

## 5. Coût par tête (éléments / Ko ; rustines inchangées : 1,3 anémone, 7,8 cymbidium)

| | avant | cross | trans | cross + trans |
|---|---|---|---|---|
| Anémone, D 800, DET 1,5 (4 têtes) | 285 / 78 | 424 / 113 | 461 / 118 | 599 / 153 |
| Cymbidium, D 800, DET 1,5 (4 têtes) | 662 / 231 | 759 / 255 | 766 / 254 | 863 / 277 |
| Anémone, D 120, DET 1 (18 têtes) | 222 / 46 | 309 / 60 | 405 / 74 | 492 / 89 |
| Cymbidium, D 120, DET 1 (18 têtes) | 447 / 152 | 508 / 162 | 554 / 168 | 615 / 178 |
Par face de pièce et par couche : un masque, 2 à 6 chemins, un `use`, et pour la lumière transmise un dégradé de la
couleur propre (plus un dégradé blanc pour le bord).

## 6. Limites connues

1. Les zones suivent la grille de la pièce (environ 13 × 21 sommets en gros plan) : une zone plus étroite qu'une cellule
   (|u| < .08) sort grossière.
2. `cross` travaille en |u| relatif à la demi-largeur locale : une marge `|u| > .7` s'amincit vers l'onglet et la pointe.
   Pour une marge de largeur constante, seul le bord de `transmit` (distance 3D) le fait.
3. Le lavis transmis (a) est géométrique (normale contre lumière) : il ignore qu'une autre pièce, devant ou derrière,
   masque la lumière.
4. L'ombre lavande-gris de l'anémone blanche (`shade #868698`, matière de référence publiée) reste : la lumière transmise
   ne fait qu'éclaircir ; la teinte de l'ombre des blancs (3.7) est une question de matière, hors de ce chantier.
5. Coût : presque × 2 en éléments pour une tête du type anémone (DET 1 : 222 → 492), + 20 à 30 % pour le cymbidium ;
   un masque par couche et par face ; durée de rendu d'un bouquet entier non mesurée.
6. Seul `svDraw` en profite : `svDrawP`, `svDrawLean`, la rosette, le capitule, la grappe et l'hortensia ont leurs
   propres rendus (audit A4).
7. Couleurs de la démonstration réglées à l'œil sur les photos gardées, pas mesurées zone par zone : aucun outil ne
   mesure aujourd'hui le milieu et la marge d'une pièce sur photo.
8. Fané : les couches passent par le filtre `WILT` et les rampes du kit ; aucun comportement propre (un tissu fané plus
   translucide, par exemple) ; vérifié seulement sur une grille de stades à petite taille (aucun défaut vu).

## 7. Questions au porteur (je ne tranche pas)

1. **Boutique (DET 1)** : garder les couches dans les bouquets (anémone : environ × 2 éléments par tête) ou seulement en
   gros plan ? Proposition : les garder, sauter les faces de moins de 8 px environ, et mesurer d'abord la durée de rendu
   d'un bouquet de 30 tiges.
2. **Zones de largeur constante** : ajouter à `cross` une option en distance au contour (comme le bord de `transmit`)
   pour les marges et liserés qui ne s'amincissent pas ? Proposition : oui, quand une sorte nouvelle en a besoin.
3. **Mesure des zones** : ajouter à `refs.py` une mesure milieu / marge / pointe d'une pièce sur photo, pour remplir
   `cross` au lieu de régler à l'œil ? Proposition : oui, confiée à l'agent fleur-coloris.
4. **`y3-fx.js` dans la boutique** : il est inerte, mais pris par le motif `y3-*.js` de quatre scripts de construction.
   Le laisser (le plus simple) ou l'exclure de ces motifs ? Proposition : le laisser, ou le renommer hors du motif si
   l'on veut une boutique sans aucun octet de pilote.
5. **Démonstration** : les réglages du cymbidium et de l'anémone ne servent qu'à juger les primitives. Voulez-vous une
   planche photo / rendu par coloris (dans refcache, jamais dans git) avant la première sorte nouvelle qui les emploie ?
   Proposition : oui, sur la première sorte nouvelle.
