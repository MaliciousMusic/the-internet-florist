# Audit v4 : description morphologique et stades de vie (lecture seule, 2026-10-18)

Périmètre : anémone, tulipes (simple, perroquet, frangée, double), roses (standard, intermédiaire/sweetheart, aspect-jardin, de jardin),
phalaenopsis, cymbidium, hortensia boule, amarante retombante, gerbera/germini, dahlia, chrysanthème, anthurium, calla.
Méthode : lecture de `fleur/KIT.md`, `BONNES-PRATIQUES.md`, `vague2/3-points.md`, des fiches `app/y*.js`, des kits `y3-*.js`, de
`catalogue/serre/pilote-printemps/REFERENCES.md`, de `catalogue/serre/sources/*.json`, des briefs et journaux sous `ch/*/refcache/`.
Aucun rendu, aucun fichier modifié hors ce rapport. Photos de tiers : identifiants seulement.

Légende des cotes : **S** = valeur chiffrée avec identifiant de photo ou référence attachés à la valeur (même ligne, même tableau) ;
**U** = valeur chiffrée mais source seulement globale (en-tête de fichier, section) ou absente ; **C** = implicite dans le code
(défaut hérité d'un kit, valeur déduite d'une fonction) ; **M** = manquant.

## 1. Résumé

1. La description de forme n'a pas de lieu unique ni de format : elle est répartie entre commentaires d'en-tête des `y-*.js`
   (anglais, avec numéros de photos), tables chiffrées dans la fiche (`pk`, `SVB_DEF`, `GRB_FORMS`), `REFERENCES.md` (prose
   française, 1776 lignes), briefs `ch/*/refcache/*/brief.md` (tableaux Markdown « à l'œil ») et journaux de tours.
2. `catalogue/serre/sources/<sid>.json` ne contient AUCUNE morphologie pour les sortes auditées (clés `forme`/`feuilles`/`hauteur_cm`
   seulement pour 14 tulipes botaniques, en prose) : il décrit nom, preuve et couleur par coloris.
3. La couleur est la couche la mieux décrite et sourcée (mesures par zone, ΔE, photos retenues) ; la forme, les courbures, la coupe,
   la matière et les organes de la fleur sont réglés par essais successifs contre quelques photos, et les chiffres de la fiche ne
   gardent pas leur provenance.
4. La forme par variété n'existe presque pas : une fiche = une forme, les coloris ne changent que couleurs et motifs. Seules les
   roses de jardin (`ROSA_ASP_ST`, `ROSA_JAR_ST`) et les formes de capitule (`GRB_FORMS`, `DAH_FORMS`, `CHRY_FORMS`) en portent un début.
   La règle BP 2.12 (« le cœur dépend de la variété ») n'est respectée par aucune sorte.
5. Stades : deux pilotes continus (`op` 0..1 bouton→ouvert, `wl` 0..1 frais→sec), fenêtres `svSm` `[début, durée]` : continuité
   garantie par construction. Mais la plupart des sortes héritent de courbes qu'elles n'ont pas mesurées (cf. §5), et le fané a du
   code ad hoc (changements de fiche à un seuil, drapeaux de contexte).

## 2. Où vit la description, par sorte, et dans quel format

| Sorte | Forme (fiche) | Forme (documents) | Couleur |
|---|---|---|---|
| Anémone | `app/y2.js:3-9` (en-tête prose) ; réglages = défauts `SVB_DEF` (`app/y3.js:7`) ; `SVA_GENES` `y2.js:70` | `pilote-printemps/REFERENCES.md:5-123` (prose, listes, « Traits » l.93) ; `ch/anemones/refcache/anemone-coronaria-organes/organes.md` (tableau de photos, « aucune mesure chiffrée ») | `SVA_CW` `y2.js:~12` ; `sources/anemone-coronaria.json` |
| Tulipes | `app/y-tulipa.js:1-17` (en-tête) ; `SVT_BOTA` l.82, `SVT_SIMPLE` l.98 ; `yz-tulipa-perroquet/frangee/double.js` | `REFERENCES.md:124-165` (« Mesures retenues », fractions de R0), l.265-323 perroquet, l.500-558 frangée, l.753 double ; `refcache/tulipe-simple/{brief,coloris,journal}.md` | `TULS` `y-tulipa.js:18` ; pas de `sources/tulipe-simple.json` |
| Roses | `app/y-rosa.js:1-7,183-191` ; kit `y3-rose.js:16-60` (`SVROSE_DEF`, tables par rang `[[f,v]...]`) ; `y3-rose2/3.js`, `y3-rosette.js` | `ch/roses/refcache/rose-standard/brief.md` (§4 « Proportions (à l'œil, ±20 %) ») ; `rose-intermediaire-kenya/etat.md` ; `ch/roses-jardin/…` | `ROSA_STD_CWX` l.55, `ROSA_INT_CWX` l.196, `ROSA_ASP_CWX` l.252 ; `sources/rose-*.json` |
| Phalaenopsis | `y-phalaenopsis.js:100-125` (`PHAL_S.pk`, `cal`, `col`, `scape`, `sideV`) sur `SVOR_DEF` (`y3-orchidee.js:19`) | `ch/orchidees/refcache/phalaenopsis/brief.md` §3 « Proportions (à l'œil, sans échelle) » ; `journal.md` (tours 14-18 : paires W/H) | `PHAL_CW` l.9 (champ `src:` par coloris) ; `coloris.md` ; `sources/phalaenopsis.json` |
| Cymbidium | `y-cymbidium.js:97-125` (`CYMB_S.pk`, `CYMB_TEP`) | `…/cymbidium-grandes-fleurs/brief.md` §3 (à l'œil) ; `journal.md` (tours v2-1 à v2-21 : lobes du labelle « à l'aveugle ») | `CYMB_CW` l.11 (`src:`) ; `coloris.md` |
| Hortensia | `y-hydrangea.js:125-132` (`HYD_SPEC`, commentaire « Measures (kept photos, at the eye ±25 %) ») ; kit `y3-boule.js`, `y3-hortensia.js` | `ch/hortensia/refcache/hortensia-boule/brief.md` §« Forme et stades (à l'œil) » | `HYD_MAT` l.28 (tuples LCh `[L,C,h]`) ; `sources/hortensia-boule.json` |
| Amarante | cordon : `amaRf` `y-amaranthus.js:47` (profil de rayon) ; trajectoire = ancien dessin `r6a.js:140` (`amarCord`) ; feuille `y-amaranthus.js:76` | `ch/amarante/refcache/amarante-retombante/brief-refs.md` (« Mesures (œil, sauf couleurs) ») | `AMA_MAT` l.14 (`o,m,l,k`) |
| Gerbera/germini | `y-gerbera.js:1-16` (en-tête par forme avec photos) ; `GRB_FORMS` l.57 ; kit `y3-capitule.js:21` | `ch/capitules/refcache/gerbera/brief.md` §« Mesures » (tableau Mesure/Valeur/Photos) | `GRB_MAT` ; `sources/gerbera.json` |
| Dahlia, chrysanthème | `y-dahlia.js:1-22`, `DAH_FORMS` l.61 ; `y-chrysanthemum.js:1-20`, `CHRY_FORMS` l.47 | `ch/capitules-doubles/refcache/*/brief.md` §« Mesures (à l'œil) » ; `journal.md` | `DAH_MAT`, `CHRY_MAT` ; `mesures-a/b.json` |
| Anthurium, calla | `y-anthurium.js:25-29`, `y-zantedeschia.js:42` sur `SVSPD_DEF` (`y3-spathe.js:14`) ; contours en polylignes `SVSPD_HEART/CORNET/LANCE` (l.9-12) | `ch/spathes/refcache/*/brief.md` §« Proportions (à l'œil) » | `ANTH_MAT` l.~12 (`src:`), `SVZAN_MAT` (`src:`) |

Formats rencontrés (7) : (a) commentaire anglais d'en-tête avec numéros de photos ; (b) objets JS de réglages ; (c) tables par rang
`[[f,valeur]...]` ; (d) prose française de `REFERENCES.md` avec séparation « Mesures / Déduit (aucune photo) / Reste à trouver »
(l.894-948, l.1034, l.1129) ; (e) tableaux Markdown de brief (Mesure | Valeur | Photos, `brief.md` gerbera) ; (f) journaux de tours
(texte libre, une ligne par essai) ; (g) JSON de cibles `targets.json`/`space.json` (`fleur/FIT.md`), qui n'existe que pour le lilas
(`ch/lilas/refcache/lilas/targets.json` : 7 mesures `{kind,v,tol,n,src}`) ; aucune sorte du périmètre n'en a.

Constat de format : aucune fiche ne lit un fichier de description ; la forme n'est lue que dans le code. Il n'y a donc pas de
description autonome que le code consommerait : le JS EST la description (et la seule version vérifiable par rendu).

## 3. Attributs par organe : explicite chiffré, implicite, manquant

### 3.1 Tépales, pétales, sépales, labelle, ligules

- **Nombre, disposition, recouvrement.** Explicite et chiffré presque partout, mais sous forme de loi de tirage : `SVA_GENES.n`
  `[[5,.06],[6,.44],...]` (`y2.js:70`), `ROSA_GENES.n` `[[30,.25],[34,.45],[38,.3]]` (`y-rosa.js:9`), `PHAL_GENES.n` `[[8,1]]`,
  `GRB_FORMS.*.n` par rang (`y-gerbera.js:57-86`). La source de la loi est absente : les poids `.06/.44/.24` de l'anémone n'ont pas
  de photo ; `REFERENCES.md:96` dit « 6, parfois 5 à 8 », l'en-tête `y2.js:3` « five to nine ». Recouvrement : `lap`, `lap:.1`
  (`SVT_SIMPLE`), « environ un tiers » en prose (`REFERENCES.md:148`) sans lien avec `lap`.
- **Contour (base, épaules, pointe), profil de largeur.** Explicite en nombres : `vb` (plus grande largeur), `claw`/`clawK`
  (onglet), `tip` (exposant de superellipse), `notch`, `prof:[[v,w]...]` (orchidées, `PHAL_S.pk.pt.prof`, `CYMB_TEP`
  `y-cymbidium.js:96`), `Wd`. Le type de pointe (aigu, acuminé, arrondi, émarginé, ondulé) n'est PAS une donnée : il est codé
  par un exposant (`tip:1.7` = presque rond, `1.25` = aigu) ou un `notch`, sans nom ni mesure d'angle. Cas rare de contour
  en points : `SVSPD_HEART` (`y3-spathe.js:9`, « checked on photos 2, 19, 62 »), seul contour de tout le dépôt qui soit une
  donnée de courbe indépendante du code de rendu. Cymbidium : `journal.md` tour v2-8 « lobe médian arrondi (vb .56, pointe 2) »
  et BP 2.11 (2026-10-18) « le bout des pétales n'est pas en pointe » : le type de pointe est une correction de critique, pas un champ.
- **Courbure longitudinale / transversale (gouttière, creux, réflexe).** Explicite : `a0`/`a1` (angle de la nervure au pied et à la
  pointe, fermé/ouvert), `aPow`, `cup`/`cupW`/`cupArc`, `rev`, `curl`, `roll`, `hook`, `camb`/`cup` des spathes (`SVSPD_DEF`).
  Sources : seules quelques valeurs ont des angles mesurés (tulipe op .6 : 26° ; `REFERENCES.md:150`) ; les orchidées sont
  réglées « à l'aveugle » (`ch/orchidees/refcache/cymbidium-grandes-fleurs/journal.md`, « Trous de la méthode v2 » : placement
  des lobes du labelle par `at, phi, a0/a1, roll`, sans vue fil de fer).
- **Section, épaisseur, texture, nervation.** Épaisseur : aucune donnée ; la minceur n'existe que par `trans` (translucidité, `SVB_DEF`
  `[.26,.2]`), `rim` (liseré) et `light`. Texture/nervation : nombres explicites mais décoratifs (`veinN:[16,8]`, `veinNet`,
  `veinFork` ; `pat.vein {n,w,op,net,wob}` orchidées ; `tex {n,w,op...}`). Source unique : `REFERENCES.md:104` (« 12 à 20
  nervures fines » anémone) ; pas de lien entre ce 12-20 et `veinN:[16,8]`.
- **Zones de couleur** (base, corps, pointe, marge, nervures, mouchetures, flammes). Meilleure couche : `PHAL_CW` (21 coloris,
  `body/base/tip/back/sep/sepL/lip/side/cal/dot/vein/spot/blot/band/eye` + `src:` de coloris), `CYMB_CW` (22, `src:`), `ANTH_MAT` (15,
  `src:`), `SVZAN_MAT` (19, `src:`), `TULS` (blotch `bl:[couleur, bord, hauteur, largeur, opacité, arrondi]`, bande, flammes),
  `GRB_MAT` (`haloV`, `tipsV`), `HYD_MAT` (LCh). Le tableau source `ch/orchidees/refcache/phalaenopsis/coloris.md` (colonnes pétale
  base/corps/bord, sépale, lobes, callosité, motif « densité / sens », niveau, photos, ΔE) est un vrai schéma de mesure.
  Limite : motif = prose qualitative (« densité faible à forte », « sens : du centre au bord ») ; le code reçoit `spot:{n:14,r:[…]}`
  réglé à la main, et la valeur retenue diverge de la mesure brute sans trace structurée (blanc mesuré `#dadada`, retenu
  `#f9f7f1` : `coloris.md` 1403 vs `PHAL_CW.blanc` ; justification en commentaire seulement, `y-phalaenopsis.js:6-8`).

### 3.2 Cœur (réceptacle, colonne, étamines, disque, labelle)

- **Anémone** : dôme `0,12 R0`, couronne d'étamines `stN [165,220]` (`y2.js:72`). Les documents disent autre chose : `y2.js:7`
  « 90 to 140 », `REFERENCES.md:109` « 80 à 150 étamines, anneau 0,30 à 0,36 D ». Pas de vérité unique (écart 40 %).
- **Tulipe** : `TUL_HEART {ovH:.42,sgR:.09,filL:.26,anL:.3,filA:.1}` (`y-tulipa.js:77`), chiffré, avec mesure en prose
  (`REFERENCES.md:151` : ovaire 0,42 R0, stigmate 0,09, filets 0,26, anthères 0,30). Unique correspondance chiffre-à-chiffre du dépôt.
- **Orchidées** : colonne `col{L,R,bend,a,cap...}`, callosité `cal`, cirres `cir`, lobes `sl`/`ml` : tout est numérique mais réglé
  par paires à l'œil (journal phal tour 14-18 : « W/H 1,37 contre 1,46 »). Fiche unique pour tous les coloris.
- **Roses** : étamines `stN`, `stO`, `heartK`, quartiers de la rose de jardin (`SVROSE2_Q`, `y3-rose2.js`), chiffrés sans source de
  mesure ; photos citées en commentaire (191, 196, 179, 180).
- **Capitules** : `heart:{r,disc,crownL,crownRows,crownN}` par forme (`GRB_FORMS`), proportions en brief (« Disque / diamètre ≈ 0,25
  (0,2 à 0,3), photos 107, 105, 79 »).
- **Variété** : la forme du cœur est identique pour tous les coloris d'une sorte ; seule varie la couleur (`dome`, `pist`, `fil`,
  `anth` ; `lip`, `side`, `cal`, `col`, `colDot`, `thr`). Exceptions partielles : bloc de tulipe `bl` (hauteur, largeur par coloris,
  `y-tulipa.js:18+`), `n` (densité de taches du labelle), `ROSA_ASP_ST` (`eye`, `heartF`, `band`, `y-rosa.js:284`).

### 3.3 Bouton

Explicite et chiffré, avec mesures de H/L : tulipe `budH:[1.55,.25]`, `budR`, `budK`, `budP`, `budE` (« 1,6 à 2 fois plus haut que
large » : `SVT_SIMPLE`, `y-tulipa.js:98+`, `REFERENCES.md:149`), cymbidium `budR:.4` « H/L about 1.25, about .4 of the open flower
across » (`y-cymbidium.js:100`), phal `budR:.43`. La forme n'est pas un profil mais une famille de paramètres d'œuf. Le vert du
bouton (`green`, `greenC`, `greenTip`) est commun et réglé à l'œil.

### 3.4 Tige, feuille, bractées, spathe

- **Tige** : `GHI[sid].sc/.sv/.sw` et `{hair, ribs, swell, gloss, red}` (`KIT.md` §6.2) ; épaisseur en part de D, parfois mesurée
  (`BP 7.3` : anémone 0,051 D, iris 0,1, fritillaire 0,08-0,09), parfois « à l'œil » (phal : `y-phalaenopsis.js:67` « à l'œil »).
- **Feuilles** : `svStrapLeaf` (`SVL_DEF`, `KIT.md` §6.1), `svRoseLeaf` (3/5/7 folioles), `SVC_DEF` (anémone), `HYD_LFS.leaf`, feuilles
  d'amarante : nombreux champs (gouttière `gut`, onde `wav`, `serr`, `quilt`), peu de lien avec une mesure (organ.py existe mais
  les sorties de `fleur/organ.py` ne sont pas conservées sous forme de données : voir `ch/anemones/…/organes.md`, « aucune mesure
  de longueur chiffrée »).
- **Bractées / spathe** : `SVSPD_DEF` est le kit le mieux documenté (chaque champ commenté avec son unité) ; anthurium et calla n'écrivent
  que les écarts (`ANTH_SPEC` l.28, `SVZAN_SPEC` l.42). Mais `ANTH_MAT` annonce « first guesses from kept.jpg, src 'auto' : replace
  them with measured ones » (`y-anthurium.js:8-9`) : l'aveu d'un état provisoire inscrit dans le code.

## 4. Traçabilité des valeurs (source par valeur ?)

- Une source est attachée **au coloris** (`src:` dans `PHAL_CW`, `CYMB_CW`, `ANTH_MAT`, `SVZAN_MAT` ; `late:N`, niveau A-D), jamais à
  un paramètre de forme. Exemple : `PHAL_CW.rose.src = '1407 B ph. 19-21 : rose-mauve…'` (`y-phalaenopsis.js:12`).
- Les paramètres de forme n'ont qu'une source de commentaire (« photographs 27, 13, 3, 29 » au-dessus de `PHAL_S.pk`,
  `y-phalaenopsis.js:88-98` ; « photographs 84, 98 » `y-cymbidium.js:112` ; « photos 35, 36, 54 » `y-anthurium.js:26`), pour un
  bloc entier, sans dire quel nombre vient de quelle photo ni de quelle mesure. Toutes les photos sont des numéros d'index de
  `kept.jpg` propres à un chantier (« 27 » désigne des fichiers différents selon `ch/*/refcache/<sid>`), donc non portables.
- Le plus proche d'une valeur sourcée : `REFERENCES.md:147-155` (tulipe : « L = 1,72 R0 (externes) et 1,62 R0 », « photos 25, 26 : 1,4
  à 1,45 ; 177 : 1,8 ») et le tableau Mesure/Valeur/Photos du brief gerbera. Mais ces chiffres sont recopiés à la main dans le code
  (`L:[1.72,1.6]`), sans test ni lien : deux valeurs déjà divergentes (interne 1,62 documenté, 1,6 codé).
- Précision déclarée : tous les briefs auditées portent « à l'œil, ±20-25 % » (phal §3, cymbidium §3, rose §4, hortensia, anthurium §« Proportions
  (à l'œil) », dahlia « sauf mention »). Aucune photo n'a d'échelle (gerbera brief : « aucune valeur n'est mesurée en millimètres »).
  Seule `fleur/fit.py targets` mesure les photos (hw, wh, ang, lab, stem, leaflw, leafang) ; elle n'a été lancée que pour le lilas.
- Déduit vs mesuré : la séparation existe dans REFERENCES.md (« Déduit (aucune photo) ») et dans les en-têtes « hypothèse » du
  cymbidium (`y-cymbidium.js:3,76`) et du phalaenopsis (`y-phalaenopsis.js:3`), pas dans les valeurs.
- Données de variété hors couleur (hauteur, tenue, saison) : `catalogue/fanaison/lotNN.json` (fanaison, `tenue_vase_jours`, avec URL de
  sources) ; seules 5 valeurs en sortent (`LIFE_SP[sid] = [k, nod, shed, dry, days]`, `app/z2.js:3`).

## 5. Stades de vie : courbes propres ou héritées

Mécanique commune. `op` (0 bouton .. 1 ouvert) et `wl` (0 frais .. ~0,95) pilotent chaque pièce par fenêtres lisses `svSm((x-a)/b)`
(`open`, `bud`, `dec`, `fan`, `shed`, `tip`). Le bouquet fournit `wl` par `lifeWEl(LIFE, lifeProfile(sid))` (`app/z1.js:12-36`) :
stade 0-3 aux seuils 3/20/30 jours, `lifeW = .22+.28u` (déclin), `.62+.3u` (fané), mis à l'échelle par `LIFE_SP[sid] = [k, nod, shed, dry, days]`
(`z2.js`, 500+ sortes, issu de `catalogue/fanaison`) ou, à défaut, par des expressions régulières (`z1.js:25-33`). Donc la **continuité
entre stades est portée par les données** (deux scalaires + fenêtres), sauf aux endroits listés en 5.3.

### 5.1 Table des courbes par sorte

| Sorte | Courbes propres | Courbes héritées | Photos de fané citées |
|---|---|---|---|
| Anémone | aucune (c'est la référence : `SVB_DEF` `y3.js:8`) | — | fiche fanaison, `REFERENCES.md:63-92` |
| Tulipe simple | `open [.3,.7]`, `bud [.2,.35]`, `dec [.22,.33]` (`y-tulipa.js:98+`) | `fan [.55,.17]` de `SVB_DEF` ; `shed [.8,.14]`, `tip`, `limp`, `curl`, `tw`, `wav`, `fanL`, `fanW`, `shedW`, `edge` de `SVT_BOTA` (la v1 « en étoile », `y-tulipa.js:82-91`) | 85, 194, 198, 203 |
| Tulipe perroquet | `dec`, `open [.6,.5]`, `tip` (`yz-tulipa-perroquet.js:94-104`) | `fan`, `shed`, `limp`… de `SVT_SIMPLE` → `SVT_BOTA` → `SVB_DEF` | non vérifié (`REFERENCES.md:265-323`) ; la tulipe simple n'a que 85, 194, 198, 203 |
| Tulipe frangée | seuils du bord frangé `TFRG_FRINGE.dec/fan` seulement | tout le reste de `SVT_SIMPLE` | pas de photo de frangée fanée trouvée (`REFERENCES.md:509`) |
| Tulipe double | jeu complet (`dec,fan,shed,limp,tip,sag`, `yz-tulipa-double.js:123-125`) | — | 44, 49, 52, 53, 96 (`REFERENCES.md:800`) |
| Rose standard | rien : tout dans `SVROSE_DEF` (`y3-rose.js:39-41`) | — | 1396, 1403, 1411, 1399, 590 (`y-rosa.js:3-4`) |
| Rose intermédiaire / sweetheart | rien | tout `SVROSE_DEF` ; « the wilt is the hybrid tea's (rosaWiltCol, tip, limp, shed) » (`y-rosa.js:187-188`) | aucune de la variété |
| Rose aspect-jardin | `rosaAspWiltCol` (couleurs seules) | courbes de `SVROSE_DEF` | 160, 162, 156 (`y-rosa.js:287-290`) |
| Phalaenopsis | `tip [.2,.7]`, `budTip`, `budPt`, `budR`, `wClose [8,26]`, `wLimp`, `wFold`, `wCrk`, `wWav`, `wShrink`, `wCol` (`y-phalaenopsis.js:100`) | `open [.3,.6]`, `bud [.26,.3]`, `dec [.1,.4]`, `fan [.5,.38]`, `blast` de `SVOR_DEF` (`y3-orchidee.js:19-27`) | `fane-inat` 2, 3, 6, 7, 9, 10 : pas de série complète (« hypothèse », l.3) |
| Cymbidium | `bud [.3,.28]`, `budS`, `budR`, `lipBud`, `innerBud`, `tip [.1,.4]` | `open`, `dec`, `fan` et tout `w*` de `SVOR_DEF` | aucune (`y-cymbidium.js:3,76` « hypothèse, no photograph ») |
| Hortensia | `dec,fan,shed,tip,grow,sz,droop,shriv,crum` (`y-hydrangea.js:128-131`) | `SVBOU_DEF` pour le reste | 35, 81, 85 |
| Amarante | loi unique de `w` (`amaFadeTone`, `amaRf`, `amaJobs`) ; pas de bouton (jeune vert `green`) | — | 266, 64, 37, 18 |
| Gerbera / germini | `open,grow,budL,col`, `wVar,wTone,wQuill,wCurl,wA0/1,shed` (`GRB_LIFE`, `y-gerbera.js:87`) | `dec [.1,.4]`, `fan [.48,.28]`, `tip` de `SVCAP_DEF` (`y3-capitule.js:24`) | 121, 70, 15, 137 |
| Dahlia, chrysanthème | jeu complet `open,dec,fan,shed,tip` (`DAH_LIFE` l.78-83, `CHRY_LIFE` l.68-72) | — | « fané (f) : observations » briefs |
| Anthurium | `openT`, `fanCamb`, `fanCup`, `fanHem`, `wav` (`y-anthurium.js:28-31`) | `dec [.12,.4]`, `fan [.35,.5]`, `open`, `green`, `bud` de `SVSPD_DEF` | 29, 42 |
| Calla | `open [.15,.6]`, `green`, `fanRoll`, `fanCamb`… (`y-zantedeschia.js:42-44`) | `dec`, `fan` de `SVSPD_DEF` | photo 84 |

### 5.2 Emprunts de courbes (BONNES-PRATIQUES 2.2, « ne jamais hériter »)

- Tulipes simple/perroquet/frangée héritent du `fan`/`shed` de l'anémone (`SVB_DEF`) et de la v1 « étoile » (`SVT_BOTA`) pour `tw`,
  `curl`, `wav`, `fanL`, `fanW` ; `KIT.md` §9.1 interdit l'héritage de la courbe d'ouverture, mais le déclin et le fané ne sont pas
  couverts par la règle.
- Roses intermédiaire, sweetheart : fané du hybrid tea, aveu en commentaire (`y-rosa.js:187-188`).
- Phalaenopsis et cymbidium : `open/dec/fan` du kit orchidée, réglés pour le phalaenopsis ; le cymbidium ajoute sa forme de bouton
  mais fane sans photo (« hypothèse »).
- Gerbera, germini : `dec/fan/tip` génériques du kit capitule (le dahlia et le chrysanthème ont les leurs).
- Anthurium, calla : `dec/fan` génériques du kit spathe.
- Les seuils `bud`, `open`, `dec`, `fan` n'ont dans aucune fiche de lien avec les stades commerciaux (jours) ; la correspondance
  `op ↔ stade` est dans `lifeOp` (`z1.js:56` : bouton .1/.3, mi-ouvert .22-.85, ouvert 1), donc séparée de la fiche.

### 5.3 Continuité pilotée par les données, ou code ad hoc ?

Données (bien) : fenêtres `[début, durée]` partagées par toutes les pièces d'une fleur ; tables par rang pour roses et capitules ;
`GHI[sid].wilt` pour les couleurs.
Ad hoc (à répertorier) :
- **Changement de fiche à un seuil** : `svBloom(..., w<.3?SVT_PARROT:...SVT_PARROT_FAN, ...)` (`yz-tulipa-perroquet.js:120`) ; frangée
  `SVT_FRINGE_FAN` « from this wilt on » (`yz-tulipa-frangee.js:77,115`). La fiche du fané change `nu,nv,pmin,wav,crk,tw,curl` : le
  critère est le budget de poids, pas la botanique, et un saut est possible à `wl = .3`.
- **Drapeaux de contexte** : `TUL_DK` (variable globale posée pendant le rendu, `y-tulipa.js:56-66`), `noTip` des roses en bouquet
  (`ROSA_STD_BQ`), `tulNeckBend` actif seulement si `SVA_LIFE` est posé (planches seulement, `s9a.js:91`), `SVA_LIFE` « nom d'anémone
  partagé par toutes les sortes » (`KIT.md` §1.8). Le fané des planches et celui du bouquet peuvent donc différer volontairement
  (contrainte `rtest`).
- **Fanés par famille de couleur en code** : `tulWiltCol`, `phalWiltCol`, `cymbWiltCol`, `svaWiltCol`, `rosaWiltCol`, `rosaAspWiltCol`,
  `amaFadeTone` : sept fonctions de seuils HSL écrites à la main, avec constantes `#rrggbb` (ex. `y-phalaenopsis.js:76-85`),
  documentées par photos en commentaire, aucune en table de mesures.

## 6. Tableau de couverture (sorte × organe × attribut)

Colonnes : **N** nombre/disposition/recouvrement ; **O** contour (base, épaules, pointe, profil de largeur) ; **K** courbures ;
**M** section, épaisseur, texture, nervation ; **Z** zones de couleur ; **V** variation par variété ; **T** variation par stade.
V : `c` couleur seule, `f` forme (hors couleur), `0` aucune.

| Sorte / organe | N | O | K | M | Z | V | T |
|---|---|---|---|---|---|---|---|
| Anémone / tépales | U | U | U | U | S (`SVA_CW`, `sources/anemone-coronaria.json`) | c | C |
| Anémone / cœur | U (écart 40 %) | C | C | M | S | c | C |
| Anémone / bouton | C | C | C | M | U | 0 | C |
| Anémone / collerette-feuille | U (`SVC_DEF`) | U | U | U | U | 0 | C |
| Tulipe simple / tépales | U (`REFERENCES.md:148`) | U | S (op .6 : 26°, flancs 7-11° : photos 25, 123, 308) | M | U (`TULS`, pas de json) | c + macule | C (hérite BOTA) |
| Tulipe / cœur | S (ovaire .42, stigmate .09…) | C | C | M | U | c | C |
| Tulipe / bouton | S (H/L 1,4-1,8 : photos 25, 26, 177 ; `REFERENCES.md:149`) | S | C | M | U | 0 | C |
| Tulipe / feuille-tige | U (`REFERENCES.md:153`) | C | C | M | U | 0 | C |
| Tulipe perroquet, frangée, double | U | U | U | M | U | c | C, saut à .3 |
| Rose standard / pétales | C (tables par rang) | C | C | M | S (`sources/rose-standard.json`) | c | C (`SVROSE_DEF`) |
| Rose standard / sépales, urne | C (`sep`, `urn`) | C | C | M | U | 0 | C |
| Rose intermédiaire, sweetheart | U (brief « 25 à 32 pétales ») | U | U | M | S (`rose-intermediaire-kenya.json`) | c | C (fané de la HT) |
| Rose aspect-jardin, de jardin / pétales | C | C | C | M | S | c + `ROSA_*_ST` (œil, bande) | C |
| Phalaenopsis / pétales, sépales | U (8 pièces) | U | U (journal) | M | S (`coloris.md`, 21 `src:`) | c | C (hérite SVOR_DEF) |
| Phalaenopsis / labelle, colonne, callosité | U | U | U | M | S | c (`n`, `spN`) | C |
| Phalaenopsis / bouton, hampe | U | U | U | M | U | 0 | U |
| Cymbidium / tépales | U (« à l'œil ») | U | U | M | S (22 `src:`) | c | M (aucune photo) |
| Cymbidium / labelle, colonne | U | U | U | M | S | c | M |
| Hortensia / fleurons (sépales) | S (« 6 à 7 fleurons… (45, 44, 33) ») | S (`hy.xm`, `tipP`) | U | U (`vN,vn`) | S (LCh) | c | U (photos 35, 81, 85) |
| Hortensia / tête (dôme, grappe) | S (`HYD_SPEC` l.125) | — | C | C | S | 0 | U |
| Amarante / cordon | U (brief : « 1/8-1/12 »; code `amaRf`) | C | C | C (grain) | U (`AMA_MAT`) | c | U (loi de `w`) |
| Amarante / feuille | U (L/l 1,2-1,5) | C | C | C | U | 0 | U |
| Gerbera / ligules | U (par forme) | U | U | C | S (`GRB_MAT`) | f (3 formes) | C (hérite dec/fan) |
| Gerbera / cœur, involucre | U | U | C | C | S | c | C |
| Dahlia, chrysanthème / ligules | U (formel/informel : 2:1 vs 3:1) | U | U | C | S | f (2-3 formes) | U (propre) |
| Anthurium / spathe | U | S (polyligne, photos 2, 19, 62) | U | C | S provisoire (`src:'auto'`) | c | C |
| Anthurium / spadice | U | C | C | C | U | c | C |
| Calla / spathe | U (`SVZAN_HW` table) | U | U | C | U (catalogue C) | c | C |

Lecture : aucune case « S » en K ou M ; sources de Z disponibles dans le dépôt mais non liées par identifiant à la fiche ; V ne contient
la forme que pour les capitules, V en O/K est partout absent.

## 7. Lacunes : ce qu'un schéma commun versionné devrait contenir

Ce que rien ne contient aujourd'hui :
1. **Un fichier de description par sorte, autonome et lu par le code** (aujourd'hui le JS est la description). Il fixerait
   `schema_version`, `sid`, `provenance` de chaque champ (cf. 3), et se vérifierait sans rendu (tolérances, unités).
2. **Un identifiant de photo stable et portable** : `{sid, photo_id, auteur, licence, url}` référencé par les valeurs (aujourd'hui
   index de `kept.jpg` par chantier, à l'œil). `refs.py keep` écrit déjà tags, mesure et titre : base prête.
3. **Mesure / cible / réglage séparés** pour chaque champ : `mesure {v, n, sd, méthode, photos[], échelle}`, `retenu` (la valeur
   du code), `écart` et `raison` (aujourd'hui seul `fit.py targets` a ce triplet, pour le lilas). Les « à l'œil ±25 % » deviennent
   un niveau de confiance (`oeil | segmenté | mesuré à l'échelle`).
4. **Types de pièce et d'outline** : `type_pointe` (aigu/acuminé/arrondi/émarginé/ondulé) + exposant ; profil `[[v, demi-largeur]]`
   avec bases, épaules et pointe nommées (calqué sur `SVSPD_HEART` et `prof` des orchidées) ; règle de recouvrement.
5. **Courbures et section** nommées : gouttière, creux, réflexe, enroulé, avec angles mesurés pour les angles de vue de l'`img.py pair`
   (aujourd'hui `a0/a1/cup/roll/hook` sans mesure).
6. **Matière** : épaisseur (ou translucidité mesurée), nervation (nombre, ramification, direction) et motifs (`spot`, `flames`, `band`,
   `blot`) comme objets quantifiés (densité, taille, direction) et non prose (« densité faible à forte »).
7. **Description par variété** (cœur, labelle, macule, œil, étamines, forme de la pointe) au même niveau que la couleur : BP 2.12
   l'exige, aucune sorte ne le fait. `ROSA_ASP_ST`, `bl` de `TULS`, `thrC`/`n` du cymbidium sont les embryons.
8. **Stades en table** : pour chaque stade (bouton, entrouvert, ouvert, déclin, fané) l'état de chaque organe (angles, tailles, couleurs)
   avec photo par stade et indicateur `héritée de <sid> / hypothèse / mesurée`. Aujourd'hui l'héritage n'est visible que dans
   `Object.assign` (tulipes) et `Object.assign({},SVOR_DEF,S)` (orchidées).
9. **Correspondance stades commerciaux** (jours, `LIFE_SP`) ↔ `op/wl` ↔ fenêtres de la fiche : aujourd'hui trois endroits (`z1.js`, `z2.js`,
   fiche).
10. **Organes secondaires** (tige, feuille, bractée, sépale, pédicelle) sous le même schéma, avec leurs variantes de stade (jaunissement,
    amincissement) et leurs mesures par `organ.py` conservées en données.
11. **Variantes de rendu séparées de la botanique** : `FAN`, `FANL`, `_BQ`, `noTip`, `TUL_DK`, `lo`/`DET` sont du budget et du contexte, pas
    des stades ; ils doivent vivre dans une couche « profil de rendu », pas dans des fiches parallèles.
12. **Détection d'incohérences** entre documents et code (`stN` 165-220 contre 80-150 documenté ; `L` interne tulipe 1,6 contre 1,62) : un
    contrôle automatique champ à champ.

## 8. Décisions manquantes (à trancher par le porteur)

- Quel format pour la description autonome (JSON versionné par sorte, ou garder le JS comme source et y ajouter une couche `src`) ?
- Que faire des formes hypothétiques (cymbidium fané, phalaenopsis hampe entière) : les marquer `hypothèse` dans le schéma, ou les
  retirer des SKU jusqu'à photos ?
- Les héritages (tulipe ← anémone ; rose intermédiaire ← hybrid tea) : accepter comme provisoires nommés, ou refaire les courbes ?
- Photos : la règle « jamais de photo de tiers dans git » interdit de stocker les crops de référence ; seuls les identifiants et
  mesures sont versionnables (cohérent avec ce schéma).

Fichiers de référence : `app/y3.js:7`, `app/y2.js:3-116`, `app/y-tulipa.js:1-129`, `app/yz-tulipa-*.js`, `app/y-rosa.js`, `app/y3-rose.js:16-60`,
`app/y-phalaenopsis.js`, `app/y-cymbidium.js`, `app/y3-orchidee.js:19-27`, `app/y-hydrangea.js:125-132`, `app/y-amaranthus.js`, `app/y3-capitule.js:21-40`,
`app/y-gerbera.js`, `app/y-dahlia.js`, `app/y-chrysanthemum.js`, `app/y3-spathe.js:9-40`, `app/y-anthurium.js`, `app/y-zantedeschia.js`,
`app/z1.js:12-62`, `app/z2.js:3`, `catalogue/serre/pilote-printemps/REFERENCES.md`, `catalogue/serre/sources/*.json`, `catalogue/fanaison/`,
`fleur/FIT.md`, `fleur/fit.py`, `ch/*/refcache/*/{brief,coloris,journal}.md`.
