# Audit v4 : matière et lumière (sujet 2), feuillage et tiges (sujet 4)

Lecture seule, 2026-10-18. Tout est lu dans le code (rien rendu, rien lancé). Références `fichier:ligne` dans `app/`.
DET 1 = boutique (`s0.js:11`, têtes de 30 à 80 px), DET 1.5 = planches et exports. Noyau = module `y3-*.js`.
Rappel du cadre : le porteur a levé la limite de poids (BONNES-PRATIQUES 8.5, « le poids je m'en fiche »), alors que
plusieurs chemins « lean » de DET 1 sont des reliquats de budget (voir A3).

## Résumé en dix lignes
1. Un seul vrai moteur de matière existe : `svSheet`/`svDraw` (y1.js). Il donne rampe le long de v, lavis par lignes de niveau,
   ombre entre pièces, nervures, liseré. Il n'a ni dégradé en travers, ni ombre de contact, ni relief des nervures, ni carte
   d'épaisseur pour le contre-jour, ni reflet net, ni grain.
2. Les noyaux qui ont leur propre rendu (rosette, capitule, grappe, boule, chenille, hortensia, orchidée lean) recodent chacun
   lumière, ton, ombre et bord : je compte 8 modèles de lumière, 8 fonctions « lumière relative vers couleur », 10 ombres portées.
3. Le meilleur matériau du dépôt est l'orchidée en lod 2 (`tex` rainure + crête, satin, poussière, grain `<pattern>`, bande
   `edge+glow`), mais il est enfermé dans `y3-orchidee.js`.
4. Papier découpé : chaque pétale de rosette est UN aplat (`y3-rosette.js:242`), le rayon de capitule `ramp(.6)` (`y3-capitule.js:158`),
   les folioles de rose/chrysanthème/viorne/ecume un aplat + une moitié ombrée à .3 (`y3-rose.js:278-279`).
5. La translucidité (4.8e) n'existe que comme liseré clair (`y1.js:166`), bande `glow` d'orchidée (`y1.js:149-155`) et bande
   d'hortensia (`y3-hortensia.js:109-116`) ; aucun calcul de lumière transmise colorée.
6. Feuillage : une trentaine de fonctions de feuille en 5 techniques sans lien ; seule la famille 1 (sangle, découpée, lilas) passe par
   `svDraw`. Seuls 14 sorts ont un `STEML[sid].sv` ; les autres dessinent `stemLeaf`/`pinnateLeaf` (`s0.js:197,214`), maillage 4×6 à DET 1.
7. Critique « amarante » : c'est ce chemin ancien (`lsLeafParts`, `l0.js:50`) que l'amarante dressée utilise toujours
   (`r6a.js:218`) ; l'amarante retombante a déjà une feuille refaite (`amaLeafSheet`, `y-amaranthus.js:117`), la plus riche du dépôt.
8. Tiges : un seul dessinateur riche (`svStemLine`, y1.js:172) avec 8 réglages ; les sorts de l'ancien dessin gardent le ruban à
   quatre bandes (`stemPoly`, `l0.js:35`). Pas de nœud, de lenticelle, de voile glauque, de variation de teinte le long de la tige.
9. Proposition : neuf primitives opt-in (A5) lues dans une feuille de sorte `S.fx` ; absence de `fx` = rendu actuel à l'octet près.
10. Moteur de feuille commun proposé : `svLeaf` sur `svSheet`/`svDraw`, contour de `svbLeaf`, relief de `amaLeafSheet` (B3).

## A. Matière et lumière

### A1. Comment chaque effet est rendu aujourd'hui (moteur commun)
- **Remplissage de base** : `svFaceFill` (y1.js:109-111) = UN `linearGradient` userSpace du pied au bout de la pièce, stops aux
  `v` de `mat.stops/bstops`. Rampe 1-D le long de v ; rien en travers de u. Tout le reste du modelé vient des lavis.
- **Lumière** : `svLight` (y1.js:69-70) = diffus enveloppé (`wrap`), ambiant, ciel `.5+.5·n.y`, transmission scalaire
  `trans` si la normale tourne le dos (`dl<0`), spéculaire `pow(n·H,gloss)·ks`, le tout × `ao`. `svShade` (y1.js:113-114) divise
  par la face de plein jour. Une seule `LIGHT` (e1.js:7), pas de rebond coloré.
- **Modelé (lavis)** : `wash` (y1.js:134-135, appel 159) = lignes de niveau de K (`svIso`), 6 sombres + 3 clairs à DET 1.5, 4 + 2
  à DET 1 (`dark/lit`, `darkLo/litLo`, défauts y3.js:27). Couleur et opacité fixes par niveau (`da`,`la`), UN flou `Ls*soft` pour la
  pièce. Donc escalier fondu, pas de dégradé de teinte (l'ombre est toujours `mat.shade`, la lumière toujours `mat.lite`).
- **Occlusion** : `ao(u,v,front)` analytique injectée dans K (y1.js:114 ; défaut svBloom y3.js:96 = assombrit le pied selon v).
  Pas d'occlusion de proximité entre pièces ; exceptions locales : spathe `svSpdOvlAO` (y3-spathe.js:211), orchidée `p.aoU`
  (y3-orchidee.js:422-426), hortensia `ao` par fleuron (y3-hortensia.js:38-40), rosette `foot` (y3-rosette.js:261-262).
- **Ombre portée entre pièces** : y1.js:126-131 = contour décalé de `Dm·sd` suivant la lumière, flou `sb`, opacité `so`, découpé à l'union
  des pièces (jamais sur le fond). UN décalage pour toutes les paires : indépendant de l'écart de profondeur, donc pas d'ombre de
  contact serrée distincte de l'ombre lointaine. **Hors fleur** : seulement c5.js:138-141 (filtre feFlood/feOffset/feGaussianBlur,
  3 plans) et seulement pour les têtes (c5.js:200,216) ; calque `stems` (tiges et feuilles) sans aucune ombre.
- **Translucidité / contre-jour (4.8e)** : trois mécanismes partiels. (a) `trans` scalaire (y1.js:70). (b) liseré `rw/ro/rim` =
  trait du contour clippé, largeur et clarté constantes (y1.js:166). (c) bande `band` avec `edge:1` + `glow` (y1.js:149-155), posée
  par les coloris d'orchidée (y-phalaenopsis.js:11,14,18,29 ; y-cymbidium.js:23). Pas de carte d'épaisseur, pas de couleur de
  transmission : le bord devient « plus clair », il ne s'éclaire pas par derrière.
- **Spéculaire / satin / cire** : intégré à K (y1.js:70), donc rendu par un lavis clair flou : jamais de reflet net. `ks` de .05
  (y-ranunculus.js:103) à .32 (y-zantedeschia.js:47), .28 cymbidium (y-cymbidium.js:103). Reflets nets ailleurs, un par noyau :
  spathe (y3-spathe.js:69-84 éclats de cloques, :178-181 reflet large), orchidée (traînées satinées = `flames` détournées,
  y3-orchidee.js:125), chenille (calottes, y3-chenille.js:92-97), capitule (`lit` radial, y3-capitule.js:171-174), feuille
  `svbLeaf` (traînée, y3-branche.js:551), legacy `gloss3` (s0.js:118-129). Cire, satin, velours : aucun terme dédié (grep
  `sheen|satin|velvet` dans y3-rose/rosette : commentaires seulement ; le velours de la rose ne tient qu'à ses couleurs).
- **Grain / texture** : aucun `feTurbulence`, `feDiffuseLighting`, `feSpecularLighting` dans `app/` (grep 0). Un seul grain :
  `svorGrain` (y3-orchidee.js:353-364, deux `<pattern>` de pas incommensurables) posé par le crochet `m.over` (y1.js:164-165 ; usage
  y3-orchidee.js:141-144).
- **Nervures** : `m.veins` (y1.js:160-163) = traits à largeur constante `Dm·w`, opacité qui s'éteint de 1 à .3 vers la pointe, bouts ronds ;
  tracé `svVeins` (y3.js:36-45) = éventail ondulé (±.006 à .016) + liaisons courtes, rendu en 1 à 2 quadratiques (`svQuad`,
  y1.js:28-30). Jamais en creux ni en relief. Creux + crête (rainure sombre et arête claire décalées) : orchidée `tex`
  (y3-orchidee.js:118-124), spathe (y3-spathe.js:69-84), legacy `veins3` (s0.js:108-117), amarante (y-amaranthus.js:140-152).
- **Bord / liseré** : y1.js:166 ; `band` (y1.js:148-155, option `edge`/`glow` ajoutée pour 3.6b) ; rosette `rim` + `edge` (y3-rosette.js:240-250,
  276-279) ; rose `svRoseRun` (marge à largeur constante, y3-rose.js:97-130).
- **Découpe, ordre, intégrité** : `cg` clip par pièce (y1.js:133), rustines `SV_PATCH` (y1.js:96,123-129). Rosette : `zvis`
  (y3-rosette.js:207-212), `wclip` (264), `lclip` (235), `pedge` (228), `patchLate` (230,290), tous options de `svrDraw` que seul `svRose`
  active (y3-rose.js:230-232).

### A2. Par noyau : ce qu'il utilise, recode ou n'a pas
- **svBloom + svDraw** (anémone, tulipes, iris, narcisse, viorne...) : moteur complet (A1). Manque : gradient en travers, ombre de contact,
  relief des nervures, contre-jour, reflet net. Matière fixée par `P.light` (y3.js:27), un `mat(cw)` par coloris (y3.js:52-57).
- **Rosette / rose** (y3-rosette.js, y3-rose.js) : ne passe pas par `svDraw`. Chaque pétale = UN aplat `it.tone` choisi par rang
  (y3-rosette.js:98,115-117 ; trait `fill:it.tone` :242). Modelé = lavis par série de 9 à 12 pétales (258-265), pied sombre
  (261-262), ombre de série (238), nervures = 5 lignes d'éventail en gros plan seulement (280-281), pli (284-289). Aucun dégradé le long
  du pétale (seuls dégradés : l'urne radiale y3-rose.js:137-138 ; la bande/flammes `svRoseRun`). À DET 1 : grille 4×6 (62), pétales
  fins sautés (141), lavis supprimés pour les petits (258 `big`). Pas de sheen, velours, ni contre-jour. Le fané dispose de réglages de netteté
  (`fanM`, y3-rose.js:53-57) que le frais n'a pas.
- **Orchidée** (y3-orchidee.js) : lod 2 = `svDraw` (:443) + `P.cast` (`so/sd/sb`), `tex` rainure/crête, satin, poussière, grain, `AO` par pièce.
  Les sorts imposent `lod:2` (y-phalaenopsis.js:100, y-cymbidium.js:104). Le lod 1 (`svorLeanPiece` 378-406) est du papier découpé : un chemin
  par pièce, dégradé 3 stops figé en 8 secteurs de direction (`svorLeanFill` 366-372).
- **Hortensia** (`svHySep`, y3-hortensia.js:23-) : tout recodé. Dégradé 3 à 6 stops tonés par la normale (97-103), moitié d'ombre le long de la
  nervure (104-108), bande de contre-jour de largeur constante modulée par le côté éclairé (109-116 : la meilleure translucidité du dépôt),
  nervures en fuseaux effilés `svHyLens` (20, 117-121), ombre de fleuron en 2 passes (88-91) + ombre de sépale (92-95), union clippée (62, 83-87).
- **Boule** (y3-boule.js) : tons = dégradés radiaux sur toute la boule (62-67), noyau creux (68-), bandes de profondeur (89-), ombres =
  ellipses par bande (111, 271), un chemin par ton et par bande. Efficace, mais le fleuron n'a pas de modelé propre.
- **Chenille** (y3-chenille.js) : Lambert maison sur cylindre + relief des grumeaux, 5 classes de ton × 3 profondeurs (74-97), calottes
  claires, ombre sur les cordons déjà peints (`under`, 69-73), duvet (98-106). Excellent grain, mécanisme non réutilisable hors cordon.
- **Capitule** (y3-capitule.js) : `svcapI`/`svcapTone` (58-60) ; corps du rayon = `ramp(.6)` aplat (158-159) + zones plates (halo, pointes,
  162-164) ; dégradé radial `lit` optionnel (171-174, `svcapLitG` 130) ; ombre de pied et de rangée (176-178, 258-261) ; nervures en gros plan (197).
- **Spathe** (y3-spathe.js) : `svDraw` + cloques éclairées (69-84), reflet laqué (178-181), gorge radiale (96-99), ombre du spadice (94). Deuxième
  meilleur relief après l'orchidée.
- **Grappe** (y3-grappe.js) : aplats « peintures » partagées, rampes à 5 ancres (`grRamp` 116-117), `lit(n)` Lambert (146-168), tranches
  de profondeur (`S.slabs` 175-178), volume par couches `P.vol` (675). Zéro dégradé, zéro flou, par choix de budget.
- **Panicule, écume, branche lod 1, papilio** : tons quantifiés (5 niveaux, `y3-branche.js:148,176`), un chemin par ton ; pas de modelé continu.

### A3. Où le rendu retombe en aplat ou « papier découpé »
- Rosette et rose : un aplat par pétale + lavis (A2). C'est le cas du produit phare ; DET 1 pousse encore plus loin (nu 4, nv 6).
- Capitule (gerbera, dahlia, chrysanthème) : rayon = aplat, modelé = une moitié ombrée + un lavis de pied (y3-capitule.js:158-178).
- Toutes les feuilles 2D (B1 famille 2) : aplat + une moitié à `fill-opacity .3` + veines en quadratiques.
- Orchidée lod 1, branche lod 1 (y3-branche.js:4), grappes, panicules, boule : aplats par ton par construction de budget.
- DET 1 dans `svDraw` même : `lit` 1 à 2 niveaux, 4 `dark` au lieu de 6 (y1.js:159), nervures plus pâles (`op·.7`, y1.js:163) ;
  `svStrapLeaf` sans ombre ni liseré (y3.js:176,181).
- Reliquats de budget à ré-ouvrir (porteur : poids sans importance) : `lod:2` déjà imposé aux orchidées ; à étendre aux autres noyaux
  qui ont un chemin riche sous `DET>=1.5` : rosette (`nu/nv`, `thin`, `big`), capitule (`veins`, `shadeLo/F`), boule (`hi`), `svbLeaf` (`!hi`
  s'arrête à y3-branche.js:529), `svDraw` (niveaux de lavis).
- Sorts de l'ancien dessin (plantes `s*a.js` sans `.sv`) : `sheet3`/`render3` (s0.js:62-107) = dégradés baked sur 7 stations + 1 dégradé
  en travers à la rangée la plus large (s0.js:92-104), ombre de pièce sans clip lissé. Même les tiges : `stemPoly` ruban (l0.js:35).

### A4. Duplication (ordre de grandeur)
- Modèle de lumière normale → intensité : 8 (`svLight` y1.js:69 ; `lightI` s0.js:18 ; `svcapI` y3-capitule.js:58 ; `lam` y3-grappe.js:146 ;
  `Iof` y3-hortensia.js:59 ; Lambert de chenille y3-chenille.js:74-90 ; `shade` de y3-papilio.js:291 ; `lk` des feuilles 2D y3-rose.js:276,
  y3-capitule.js:314, y3-lobee.js:42, y3-ecume.js:154).
- « Lumière relative K → couleur » (mélange vers `shade`/`lite`) : 8 (`svrTone` y3-rosette.js:98 ; `svcapTone` y3-capitule.js:60 ; `tone`
  d'orchidée lean y3-orchidee.js:387 ; `tone` de `svDrawLean` y3-damier.js:110 ; `nbqRegCol` yz-narcissus-bouquet.js:125 ; `tone` d'hortensia
  y3-hortensia.js:29 ; `toneAt`/`pal7` s0.js:13-15 ; `grRamp`+`lit` grappe).
- Ombre portée : 10 (svDraw y1.js:126 ; svrDraw y3-rosette.js:238 ; capitule 258 ; hortensia 88-95 ; boule 111,271 ; chenille 69-73 ; spathe 94 ;
  `render3` s0.js:62-70 ; recherche DOM de `ranLeafSvg` y-ranunculus.js:207 ; filtre de bouquet c5.js:138).
- Liseré / bande de bord : 6 (y1.js:166 ; y1.js:148-155 ; rosette 276-279 ; rose 97-130 ; hortensia 109-116 ; boule bord picotée).
- Nervures : 9 (voir A1 + svbLeaf, amarante, hortensia, orchidée `svorVeinNet` y3-orchidee.js:97, legacy `veins3`).
- Reflet / satin : 8 (A1). Grain : 1. Copies du pilote lui-même : `svDrawP` (y3-damier.js:7, copie complète de `svDraw`, utilisée par y-fritillaria.js:66),
  `svDrawLean` (y3-damier.js:99, substituée à `svDraw` par réaffectation globale, y-fritillaria.js:134), `nbqLean` (yz-narcissus-bouquet.js:129,
  idem), lean orchidée (`svorLean`), lean capitule/branche : 5 variantes « lean » de `svDraw`.
- Conséquence : toute amélioration de matière doit aujourd'hui être refaite noyau par noyau ; la roue tourne 6 à 10 fois.

### A5. Primitives communes proposées (une par effet, lues dans une feuille de sorte)
Convention : un bloc optionnel `fx` dans la fiche de sorte (`S.fx`) et/ou dans le coloris (`mat(cw).fx`). Absent = chemin actuel. Tout hasard par
`pxHashS`/`svRng` (jamais `R()`, règle rtest). Toute géométrie ajoutée est découpée à la pièce ou à l'union (le `getBBox` des têtes ne bouge pas :
c5 le mesure). Chaque primitive a un interrupteur URL `?svfx=off,<nom>` à l'image de `svroff=` (BONNES-PRATIQUES 3.4).
1. **`svTone(c, K, t)`** (entrées : couleur, lumière relative, `{shade,lite,kd,kl,cap}`) : une seule fonction « K → couleur » avec les constantes
   de `svrTone` en défaut. Adoptants : rosette, capitule, orchidée lean, `svDrawLean`/`nbqLean`, hortensia, `svbLeaf`, grappe. Risque nul si chaque
   appelant passe ses propres `kd/kl` (refonte à iso-sortie, vérifiable par diff). Supprime 8 copies.
2. **`svCross(sh, m.cross)`** (`[[|u|, couleur, alpha]...]`, `m.vr` pour la rosette) : second dégradé perpendiculaire à l'axe, stops alpha, par-dessus
   `svFaceFill` (y1.js:132), clippé à la pièce ; pour la rosette : un dégradé le long du pétale à la place de l'aplat (y3-rosette.js:242). Donne
   centre/marge, pied/pointe, chroma et clarté qui bougent en travers (4.8d « zones »). Adoptants : tous les `svDraw`, rosette, capitule (`ramp`).
   Risque : nul si `m.cross` absent ; coût = 1 dégradé par pièce (le porteur accepte le poids).
3. **`svTrans(it, m.trans)`** (entrées : carte d'épaisseur `thin(u,v)` 0..1, couleur de transmission `tc` plus chaude et plus saturée que `lite`,
   largeur, opacité) : (a) lavis de lumière transmise sur le champ `Kt = max(0,-dl)·trans·thin` (même machinerie `wash`, y1.js:134) en `tc` ;
   (b) `svEdgeLight` = bande de largeur constante dans le contour, modulée par le côté éclairé = généralisation de y3-hortensia.js:109-116 et de
   `band edge+glow` (y1.js:149-155). Adoptants : `svDraw` (pétales fins : anémone, pavot, tulipe), orchidée (remplace `band`), rosette (bord de pétale),
   hortensia (remplace son code). Risque : (b) doit rester dans la pièce ; défaut `tc` absent.
4. **`svShadow(pieces, o.passes)`** (`[[offset, flou, opacité, zEcart]...]`) : ombre à plusieurs passes, décalage proportionnel à l'écart de profondeur
   émetteur/récepteur (contact net + portée douce) ; défaut = la passe unique actuelle (y1.js:126-131). Adoptants : `svDraw`, `svrDraw` (:238),
   capitule (:258), hortensia (88-95, a déjà 2 passes), boule, chenille, spathe. Ajout : `c5.js` peut mettre aussi le filtre d'ombre sur les calques
   tiges/feuilles (filtre, pas de géométrie : rtest intact, coût CPU seul).
5. **`svSheen(it, K, m.sheen)`** (`{type:'wax'|'satin'|'velvet'|'gloss', c, op, w, anis}`) : crée un second champ depuis `sh.F` et `sh.N` et trace UN
   contour net, non flou : *gloss* = iso-contour haut du seul terme spéculaire de `svLight` (y1.js:70) ; *satin* = bande anisotrope le long de v, suit les
   fibres (remplace le détournement de `flames`, y3-orchidee.js:125) ; *velvet* = champ `(1-|F|)^p` (bord rasant clair, centre profond) ; *wax* = lobe large
   à faible contraste. Adoptants : rose (velours), anémone (satin), tulipe (cire), spathe/anthurium (gloss), feuilles.
6. **`svRelief(set, rel)`** (6e champ du tuple `m.veins`, `{h, sens:'creux'|'relief'}`) : un trait devient rainure sombre + arête claire décalées selon
   `LIGHT` (comme `veins3` s0.js:108-117 et `tex` y3-orchidee.js:121-124) ; variante cloques `m.quilt` (y3-spathe.js:69-84). Adoptants : tous
   les `svDraw`, rosette (`veinW` y3-rosette.js:280), feuilles. Risque nul si absent.
7. **`svMosaic(sh, H(u,v), o)`** (hauteur de relief haute résolution) : promotion de `amaLeafSheet`/`amaLqH` (y-amaranthus.js:105-110,117-157) : maillage fin
   (jusqu'à 156×58 à DET 1), normale perturbée, cellules quantifiées en bacs de ton, flou léger clippé. Pour feuilles gaufrées, papier froissé du pavot,
   crêpé de renoncule, cloques d'anthurium. Hors de portée de la grille de `svDraw` (nu ≤ 18). Coût fort : réservé à DET 1.5 et aux sorts qui en ont besoin.
8. **`svGrain(it, m.grain)`** : promotion de `svorGrain` (y3-orchidee.js:353-364) hors du noyau orchidée ; un `<rect>` à motif par pièce, motifs partagés.
   Adoptants : phalaenopsis (déjà), rose/anémone (velouté fin), hortensia, tulipe (cire). Risque : un grain trop haut dans l'image donne du bruit à 200 %
   (critère 3.9) : plafonner `r` par `D`.
9. **`svLean` = option de `svDraw`** (`o.lod:'lean'`) qui remplace `svDrawP`, `svDrawLean`, `nbqLean`, la réaffectation globale de `svDraw` et le lean
   d'orchidée. Ce n'est pas un nouvel effet : c'est la suppression de 5 copies. Priorité basse puisque le poids ne compte plus : mieux vaut retirer le
   lean (A3) que le factoriser.
Ordre conseillé (impact / risque) : 1 puis 2 puis 3 (un seul code, ~30 sorts gagnent), 6 et 5 ensuite, 4, puis 7 et 8 sort par sort.

### A6. Risque pour les sorts publiés et garde-fous
- L'anémone (référence) passe par `svBloom`→`svDraw` : tout ajout y est opt-in ; la refonte 1 (`svTone`) et 9 touchent le code qu'elle exécute : à faire
  derrière une copie propre (`ws/pub-avant`/`pub-apres`, vague3-points) puis `img.py diff` = 0,00 % et `rtest` IDENTIQUE avant fusion.
- Rosette/rose : les options de `svrDraw` sont déjà opt-in (vague3-points, retouche v3) ; ajouter `fx` ne change pas les roses publiées tant que
  les fiches `ROSA_*` ne le posent pas. Le piège connu : un coloris par id partagé entre sorts (cache `rosaMat(cw,key)`) ; garder la clé par sorte.
- `getBBox` : une ombre ou un halo qui dépasse l'union d'une tête change sa boîte et donc le placement (c5, règle de la tête reculée) : toujours
  clipper (modèle `inB()` y3-hortensia.js:83-87).
- Budget d'éléments : noter le coût de chaque primitive par tête (`svrstat=1` existe, y3-rosette.js:184).
- Identifiants SVG : `gid` croît quand on ajoute des éléments ; sans effet de pixels, mais les comparaisons par hachage de fichier cassent (utiliser `diff`).

## B. Feuillage et tiges

### B1. Inventaire des générateurs de feuilles (une trentaine de fonctions, 5 techniques)
Famille 1, **3D `svSheet` + `svDraw`** (lumière du moteur, ombres entre pièces, rustines) :
- `svStrapLeaf` (y3.js:154-181), moteur de 9 sorts par enveloppes : `tulLeafSv` (y-tulipa.js:125), `narLeafSv` (y-narcissus.js:174), `tdbLeaf1`
  (yz-tulipa-double.js:154), `tulFrgLeafSv`, `tulParLeafSv`, `frmLeafSv` (y-fritillaria.js:142), `hyaLeaf` (y-hyacinthus.js:111), `muLeaf`
  (y-muscari.js:112), `frsBlade` (y-freesia.js:114). Forme : profil `wp` par nœuds, gaine `sheath/sr` serrée sur la tige (166-169), capuchon `hood`.
  3D : `lean`, `droop` (160), gouttière `gut`, ondulation `wav/wavN`, torsion `tw` (163-165) ; pas de dents, pas de gaufrage. Nervures : 8 parallèles
  courbes + médiane épaisse, `veinLo` (174-175). Dessous `low`/`bstops`, voile glauque = seulement une couleur de lavis (`bloom`, 172-173). Insertion
  : gaine continue. Fané : `limp`, tip qui jaunit (`tipY`), `dry` (177-180).
- `svStrapLeafX` (y3-plante-nar.js:73-101) : copie à environ 70 % de `svStrapLeaf` + carène `keel`, pli `fold`, flétrissure en front `fade`. Troisième
  copie : `svBladeLite` (y3-iris.js:73). Quatre implémentations de la même surface.
- Feuilles découpées : `svCutLeaf` (y3-anemone.js:36), `acoCutLeaf` (y3-anemone2.js:74), `svaBract3` (y2.js:124) = segments `svSheet` (arc + chute +
  torsion + gouttière), lobes et pinnules, veines = médiane seulement (+ latérales au zoom). Pas de nervation réticulée.
- `syrLeaf` (y-syringa.js:145-171) : une feuille ovale en `svSheet`, pétiole par `svStemLine`, nervures
  médiane + 12 latérales (`syrLeafMat` 127-138), face dessus/dessous, jaunit puis brunit (`yel`, `brn`), `ks` fondant avec la flétrissure.
Famille 2, **2D en coordonnées d'écran** (aplat + moitié ombrée + veines en `svQuad`, pas de `svDraw` donc pas d'ombre entre folioles ni de rustine) :
- `svRoseLeaf` (y3-rose.js:239-285), `svcapLeaf` (y3-capitule.js:293) : même structure, copie l'une de l'autre ; `svcapLobed` (:335) ; `svLobedLeaf`
  (y3-lobee.js:13) ; `svEcLeaf` (y3-ecume.js:136, + gouttes d'eau) ; `glySvLeaf` (y-wisteria.js:109) ; `svPapLeaf` (y3-papilio.js:287) ; `asvLeafSv`
  (yz-anemone-sauvage.js:116).
- `svbLeaf` (y3-branche.js:494-565) : la plus complète de la famille (voir B3).
Famille 3, **noyau rosette** : `ranLeafSvg` (y-ranunculus.js:164) = folioles en `svrItem`/`svrDraw` + ombre posée par recherche DOM (:207).
Famille 4, **relief haute résolution** : `amaLeafSheet` (y-amaranthus.js:117-157) + `amaLeafS` (85) + `amaLqVeins/amaLqH` (101-110).
Famille 5, **ancien dessin `sheet3`** : `stemLeaf` (s0.js:197), `pinnateLeaf` (s0.js:214), `lsLeafParts` (l0.js:50) via `lsLeafS` (l0.js:47).
Pour chacun, les critères demandés :
| Critère | Famille 1 (strap/cut) | Famille 2 (2D) | Famille 4 (amarante) | Famille 5 (legacy) |
|---|---|---|---|---|
| Contour | profil par nœuds `wp` | demi-largeur analytique (+dents `svbLeaf`: `serr/tooth/dbl/aris`) | profil lisse `amaLeafW` | `LS_OVATE` 6 nœuds |
| 3D | arc, chute, torsion, gouttière, ondulation | pli + chute en 2D (`fold`,`droop`) | chute intégrée en 48 pas, balancement, roulé, gaufrage | arc `ar` + pli `fo` analytiques |
| Nervures | parallèles courbes ou médiane | médiane + latérales en quadratiques; `svbLeaf` courbes + creux | rainures effilées `amaTaper`, 12 latérales arquées | médiane + 4 à 7 lignes presque droites |
| Dessous | `low` (aplat de lavis) | `up/low` + moitié | palette dédiée, reflets nus | `pal7` du vert assombri et pâli |
| Brillance | `ks`,`gloss` dans K | bande `sheen` (`svbLeaf` seul) | spéculaire par cellule | ellipses `gloss3` |
| Insertion | gaine ou pétiole | pétiole + stipules (rose), glandes (`svbLeaf`) | pétiole du L-système | point sur la tige |
| Fané | affaissement, jaune par la pointe | pli, brun de marge, couleur par `WILT` | jaune → rouge → rouille + brun de marge | couleur par `WILT` seule |

### B2. Pourquoi la feuille d'amarante a été jugée « bien trop mauvaise qualité »
Historique : PASSATION-VAGUE3.md:162-163 et `ch/amarante/refcache/amarante-retombante/etat.md` (relais 5, tour 37-38). Le défaut vient du chemin ancien :
- **Plate** : `lsLeafParts` (l0.js:50-53) passe par `sheet3` avec `nu 5`, `nv 9` ; `DT` (s0.js:11) ramène cela à 4 × 6 à DET 1 : 7 rangées de bord
  seulement (s0.js:73-86). Surface analytique (l0.js:47-49) = arc `ar` + pli `fo·|u|` + chute : aucun gaufrage, aucune cloque entre nervures.
- **Schématique** : profil `LS_OVATE` à 6 nœuds (l0.js:44) ; gauche et droite identiques ; éclairage = 7 stations le long de la médiane + UN dégradé en
  travers à la rangée la plus large (s0.js:92-104) ; aucune différence entre dessus et dessous hors `pal7` plus pâle (l0.js:51).
- **Nervures en traits droits** : `VL` (l0.js:51-52 ; même idée dans `stemLeaf`, s0.js:199) = 4 à 7 lignes de 4 points `[u(1-.6v), .03+.92v]`, symétriques,
  parallèles, sans fourche ni réseau ; tracées comme rainure en décalant le même tracé (`veins3`, s0.js:108-117), donc trait à largeur constante.
- **Reflets** : `gloss3` (s0.js:118-129) = quelques ellipses sur une grille de 8 × 14 seulement si `o.gloss`.
Où cela se voit encore : amarante dressée (`amdPlant`, r6a.js:218 `lsLeafParts(... LS_OVATE, droop .26, arch .06, fold .16, par:1 ...)`), amarante retombante
quand `SV_ON` est faux (`amaPlant`, y-amaranthus.js:179), et toutes les feuilles génériques des bouquets (`stemLeaves` s0.js:205 → `stemLeaf`/`pinnateLeaf`)
pour les sorts sans `STEML[sid].sv`.
Ce qui a été corrigé pour la seule retombante (y-amaranthus.js:76-157) : profil lisse acuminé, médiane intégrée avec pose par graine, 12 latérales arquées à ~50° (`amaLqVeins`),
hauteur `amaLqH` (panneaux bombés, pli net, aréoles gaufrées), mosaïque lumineuse floutée clippée aux bandes, rainures `amaTaper`, bord fin. Reste à faire : la dressée,
et aucune autre sorte ne profite de ce travail (la mosaïque est locale à `y-amaranthus.js`).

### B3. Quel générateur peut devenir le moteur commun de feuille
Candidats : (a) `svStrapLeaf`/`svStrapLeafX` : meilleure intégration (vraie lumière, ombres, rustines, gaine) mais uniquement sangle et sans gaufrage ;
(b) `svbLeaf` : le plus riche des 2D : contour ovale à pointe `acu`/`ovB`, dents `serr/tooth/dbl/aris`, deux moitiés éclairées chacune par ses normales, bande de
marge éclairée à part (534-535), nervures latérales courbes (536-538), `quilt` (creux, crête, panneaux, éclats, 539-550), traînée `sheen` (551-557), couleurs
jeune/mûre/dessous (`und/undK`), vieillissement et fané (`wk`, `open`, `hang`) ; mais 2D d'écran et deux moitiés seulement ; (c) `amaLeafSheet` : le plus réaliste en surface, trop
spécialisé et lourd (156 × 58 cellules à DET 1).
**Recommandation : `svLeaf`**, construit sur le noyau (a) pour la lumière, le langage de paramètres de (b) pour le contour, et (c) pour le relief :
- géométrie `S(u,v)` en `svSheet` (arc, chute, torsion, gouttière asymétrique, roulé, comme `amaLeafS`) avec un contour par fonction de demi-largeur + dents
  (gabarits : sangle, ovale/acuminé, cordé, lobé par `svlbR`, composé pinné par pièces comme `acoCutLeaf`) ;
- graphe de nervures : médiane, latérales arquées à angle et espacement par sorte (`amaLqVeins`), réseau tertiaire par hachage ; dessinées par `svRelief` (A5-6), en creux dessus,
  en relief dessous ;
- relief `H(u,v)` → `svMosaic` (A5-7) ou, à DET 1, juste les lavis ; reflet par `svSheen` ; contre-jour par `svTrans` (feuille mince) ; dessus/dessous par `bstops` ;
- fané : pose, roulé, jaunissement en front depuis la pointe (comme `fade` de `svStrapLeafX`), brun de marge de largeur constante, tout piloté par `wl` ;
- insertion : pétiole en `svStemLine`, stipules, gaine, nœud avec léger renflement de la tige.
Migration : (1) enveloppes de sangle déjà homogènes : `svStrapLeafX`, `svBladeLite`, `svStrapLeaf` deviennent des préréglages de `svLeaf` (iso-pixel testable sur la
tulipe et le narcisse) ; (2) `lsLeafParts`/`stemLeaf`/`pinnateLeaf` (amarante dressée, ~28 STEML génériques) ; (3) familles 2 (`svRoseLeaf`... : une seule copie à garder, `svbLeaf`) ;
(4) `amaLeafSheet` devient préréglage + `svMosaic`. La flétrissure par couleur (`WILT`, `lifeWilt` z1.js:52) continue de s'appliquer en aval.
Risque : `rtest` (la feuille ne consomme que `svRng`/hachage, jamais `R()` : respecter l'idiome `svNoR`/`STEML.sv`, y-rosa.js:159, s0.js:209) ; la boîte de la tige
(`stemLeaves`, `lim` c5.js:255) ne doit pas bouger.

### B4. Tiges
- **Rendu riche** : `svStemLine` (y1.js:172-206) = contour d'une pièce, ondulation de largeur `swell` (174, sinus de période fixe `w·9`/`w·3.1` : périodique, déphasage seul),
  lavis latéral sombre / clair / reflet (187-188), stries `ribs` (190), teinte vers la tête `red/redF/redA` (193-194), poils `hair*` (197-203), coupe `cut` (182,191), crochet `post`
  (205). `lean` (186) = un seul lavis, ni clip ni flou. `svStem3` (208) la lie à une cubique. Réglages par sorte : `sv={swell,gloss,ribs,hair,red,post}` (27 fichiers, ex. y-rosa.js:176,
  y-dahlia.js:110-111, y-hyacinthus.js:93).
- **Variantes** : `svStemLineN` (narcisse, aplatie à deux arêtes, creuse, y3-plante-nar.js:13, branchement y-narcissus.js:161) ; `svorAxisCut` (y3-orchidee.js:447-451) et
  `svStemCut` (y3-plante.js:25-30) = la coupe en équerre redessinée par clip pour éviter le « bouchon » (7.9) ; épines/cicatrices `svRoseThorns` (y3-rose.js:289-301) ; verrues
  `hydStemPost` (y-hydrangea.js:161) ; duvet `acoFuzz` (y3-anemone2.js:109).
- **Hors `.sv`** : `stem3` (d1.js:40) retombe sur `stemPoly` ruban à quatre bandes aux décalages fixes (l0.js:35-36) ; `tube3` (s0.js:130) pour les cols. Les sorts de l'ancien dessin (la
  majorité) n'ont pas `.sv`.
- **Manques par rapport à la plante réelle** : nœuds (renflement, anneau, gaine ; seulement via `post` ad hoc) ; voile glauque / cire (aucun, `gloss` seulement) ; lenticelles et
  pores ; variation de teinte vert → jaune-brun au pied coupé, rouge sous la tête seulement ; section creuse visible (narcisse seul) ; translucidité des tiges fines ; ombre des
  feuilles et des têtes sur la tige (calque `stems` sans filtre d'ombre, c5.js:200,216) ; reflet en bande unique (`gloss`) ; fané de la tige sans géométrie (couleur via `WILT`
  seulement ; mollesse déléguée au col, `rosaNeck`/`tulNeckBend`).
- **Proposition** : étendre `c.sv` (opt-in) de `bloom`, `nodes:[{s,w,ring}]`, `lent`, `tint:[stops le long de la tige]`, `trans`, `sheen` (A5), `shadowOn` (feuilles/têtes) ; migrer
  les sorts sans `.sv` vers `svStemLine` avec un jeu de présets (herbacé, ligneux, creux, épineux) ; garder `lean` pour la plante entière à DET 1.

## C. Questions pour le porteur (je ne tranche pas)
1. La boutique est à DET 1 : pour les têtes de 30 à 80 px faut-il tout de même passer à plein détail (rosette `nu/nv`, capitule, boule, `svbLeaf`) puisque « le poids
   je m'en fiche » ? Ma proposition : oui, sort par sort, avec un budget de sécurité par bouquet mesuré par `qawatch`.
2. Le contre-jour (4.8e) doit-il réchauffer et saturer la lumière transmise (`tc`) ou seulement l'éclaircir ? Proposition : réchauffer, valeur par famille de couleur mesurée sur les
   photos de fond clair (comme `refs.py ring`).
3. Feuille commune `svLeaf` : accepter un chantier de migration des ~28 STEML génériques et de l'amarante dressée avant de continuer d'ajouter des sorts ? Proposition : oui, en commençant
   par les enveloppes de sangle (iso-pixel) puis l'amarante dressée (critique déjà énoncée).
4. Faut-il une ombre des têtes et feuilles sur les tiges (filtre du bouquet) malgré le coût de rendu ? Proposition : essai sur 3 bouquets, comparer à 2400 px avant décision.
