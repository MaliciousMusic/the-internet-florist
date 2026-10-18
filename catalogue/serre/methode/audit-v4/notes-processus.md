# Audit V4, sujet 6 : le processus (notes de l'auditeur, lecture seule)

Date : 18 octobre 2026. Rien n'a été lancé (ni rendu, ni `pipe.py`, ni serveur). Sources lues : `PASSATION-VAGUE3.md`, `fleur/PIPE.md`,
`fleur/pipe.py` (comparaison, juge, témoins, planches, `call_model`), `fleur/img.py` (`pair`), `fleur/bills/*.md` (13 sorties de la
vague 3, aucun `cymbidium.md`), `factures/vague3.md`, `vague3-points.md`, `fleur/orch/*`, les journaux de `ch/roses`, `ch/roses-jardin`,
`ch/capitules-doubles`, `ch/spathes`, `ch/hortensia`, `ch/amarante`, `ch/orchidees` (`refcache/<sid>/journal.md`, `_vague3-points.md`).
Les chemins de journal sont relatifs à `ch/<chantier>/refcache/<sid>/`. « eq » = équivalent entrée Opus (unité de `bill.py`).

Réserve sur les chiffres : les fenêtres de facture se recouvrent (une même session orchestratrice figure dans les factures de
plusieurs sorties) ; les parts « orchestrateur » ci-dessous sont donc un majorant. Le cymbidium n'a pas de facture propre
(`fleur/bills.json` : une seule étape « 2-modelage » ; ses ~8 relais Opus sont dans son journal, pas dans la facture).

## 1. Où part l'argent (13 sorties, `fleur/bills/*.md`, total 194,7 M eq)

| Poste | eq | Part |
|---|---|---|
| Modelage (sous-agents Opus, relais compris) | 96,9 M | 50 % |
| Orchestrateur (relecture de gros plans, relais, publication) | 57,7 M | 30 % (majorant) |
| Recensement et preuves (Sonnet, Haiku) | 28,8 M | 15 % |
| Coloris | 5,8 M | 3 % |
| Finition, QA, photos/refs | 5,4 M | 3 % (1 % chacun) |
| dont lecture d'images (toutes étapes, 2 036 appels) | 37,1 M | 19 % |

Par sorte : hortensia-boule 27,0 M (11 lignes Opus), phalaenopsis 26,0 M (8), rose-standard 20,3 M (5), dahlia 20,1 M (6),
amarante 14,5 M (7), rose-de-jardin 14,6 M, gerbera 12,9 M, chrysanthème 12,8 M, aspect-jardin 12,7 M, anthurium 12,3 M,
germini 8,2 M, kenya 6,9 M, arum 6,3 M. Le quota est passé de 47 % à 77 % en un jour (`fleur/quota.csv`) : environ 2,3 points
par sorte, orchestrateur compris.

Constat de fond : **les trois sorties les plus chères (hortensia, phalaenopsis, rose-standard) sont celles où le défaut a été vu par le
porteur ou par l'orchestrateur après un premier « livrable »**, pas par un contrôle de la chaîne. La relecture orchestrateur coûte
elle-même cher (anthurium : 7,4 M d'orchestrateur pour 3,7 M de modelage ; hortensia : 9,6 M contre 16,5 M).

## 2. Étape par étape

### 2.1 Recensement (census)
- **Ce qui a raté.** Rose-standard : 3 passes Sonnet (155 + 93 + 42 appels, `bills/rose-standard.md`), des centaines de fiches
  HelpMeFind (`vague3-points.md` l.26, l.94-95) ; HelpMeFind bloque l'IP vers 1 200 requêtes, Commons répond 429, Thursd est une
  place de marché B2B (l.35, l.50). 13 lots de preuves du chef dahlia lancés avant la consigne d'économie (`factures/vague3.md` l.38).
  Un lot de preuves relancé a écrasé l'ancien (`ch/capitules-doubles/refcache/_etat-chef.md` l.4 ; leçon du lot 2 dans `brief-chefs.md`).
- **Coût.** 28,8 M (15 %). Rose-standard 6,9 M sur 20,3 M (34 %), chrysanthème 3,1 M sur 12,8 M, kenya 2,3 M sur 6,9 M. Contre 0,7 à
  0,9 M pour hortensia, amarante, anthurium, arum, une fois le recensement « ciblé » appliqué : l'économie existe, elle est acquise.
- **Contrôle chiffré.** Déjà en place dans pipe v3 (`pipe.py:829` `check_census` : niveau A/B/C par SKU du bouquet, D = question).
  Manque : un plafond d'appels par SKU (arrêt dès qu'un SKU a 3 photos nommées) et la liste des sources bloquantes (HMF, Commons
  429) en tête d'étape pour ne pas les retenter.
- **Outils manquants.** Aucun nouveau ; la source principale reste du scraping ad hoc par sorte (`refcache/gerbera/scrape_*.py`,
  `rosa/outils`) sans module commun.

### 2.2 Photos (refs)
- **Ce qui a raté.** Photos hors sujet gardées puis utilisées comme référence : cymbidium (photo 122 = jaune sauvage, `bud_ref` = bouton
  de phalaenopsis, `fane-inat` = espèces sauvages : `orchidees/.../cymbidium-grandes-fleurs/journal.md` « Trous v2-5 ») ; phalaenopsis
  (3/4 et profil c1, c4, c5 = espèces tigrées ou orangées, `phalaenopsis/journal.md` tour v5-7 ; « Taisuco Kaaladian » blanc rangé
  fuchsia, tour v3-1) ; photos de jardin au fond chargé pour les roses (`vague3-points.md` l.20) ; les photos de face du blanc et
  du vert du cymbidium n'existent qu'en vignette 640 px (journal v2-8). Haiku appelle des outils de navigateur malgré l'interdiction
  (3 appels roses lot 1, puis 2 autres : `vague3-points.md` l.8, l.107).
- **Coût direct** faible : photos/refs 1,6 M (1 %). **Coût indirect** élevé : la mesure de couleur du phalaenopsis refaite par Sonnet
  « à la main » 1,38 M (`bills/phalaenopsis.md`), reprises de coloris des roses (rose-standard ~0,6 M, aspect-jardin 1,2 M,
  rose-de-jardin 0,9 M), puis fuchsia remesuré sur 8 photos après la critique du porteur « terne et pauvre ».
- **Contrôle chiffré qui aurait attrapé.** (a) Pour toute photo balisée `coloris:<x>` : ΔE entre la médiane de la fleur sur la photo et
  l'hex mesuré/attendu du coloris ; au-delà de 15, la photo sort de la liste des paires. Le test existe déjà en pièces
  (`refs.py auto`, `pipe.py:1140` `AUTO_RE`, `cwmed.py`) mais `refs_audit` (`pipe.py:978-1004`) ne contrôle QUE les balises
  `stade/vue/organe` contre le champ « vu » : les balises `coloris:` ne sont jamais auditées, alors que le choix des paires `cw-*`
  (`pipe.py:1676`) repose dessus. (b) Une étiquette « vu » de plus : `groupe=` (hybride de coupe / espèce sauvage / jardin) et la
  taille réelle de l'image (côté court ≥ 1 000 px pour toute photo destinée à une paire).
- **Paire qui aurait attrapé.** La planche de contact PAR COLORIS avant la médiane (déjà demandée dans `phalaenopsis/journal.md`
  « Trous v3 », jamais outillée).

### 2.3 Coloris
- **Ce qui a raté.** `mesures-A/B` ne gardent que la médiane par coloris, sans hex par photo (`vague3-points.md` l.98) : une mauvaise
  photo ne se retrouve pas. Couleurs du catalogue contredites par les photos (gerbera 1001, 1012, 1014 ; rose 5 « mondial » et 11
  « fuchsia » remis au catalogue après coup, l.105). Le contrôle « rendu contre mesure » est arrivé tard et par sorte : `hmed.py`
  (roses v3), `cwmed.py` (amarante tour 22), `hst.py`/`qt.py` (hortensia tours 27 et 47), « contrôle couleur chiffré » du phalaenopsis
  seulement au tour v3-6 (après « terne et pauvre »).
- **Coût.** 5,8 M (3 %) ; mais la couleur du rendu est la cause de plusieurs relais Opus : hortensia tours 8, 9, 19, 27, 30, 32, 43-45, 47
  (blanc « kaki », rose-pâle « mauve terne », ombres grises).
- **Contrôle chiffré.** `cwmed.py` existe dans `fleur/` : médiane L/C/h du rendu par coloris contre la cible (dL, dh). Il n'est appelé
  par aucune étape de `pipe.py` (`grep` de `cwmed|gstat|jgap|hmed|sil.py|prof.py` : 0 occurrence). L'étape `finition`
  (`pipe.py:1489-1497`) ne vérifie que le poids (`budget`, « mesure seulement ») : la seule étape censée garantir la couleur n'a
  aucun contrôle de couleur. Seuil proposé, repris des journaux : dL ≤ 7 et dh ≤ 10° sur la tête ouverte de face, par coloris
  (amarante tour 22 : « écarts dL ≤ 7, dh ≤ 11 »).

### 2.4 Forme (forme, fit, modelage)
- **Ce qui a raté, avec preuve.**
  - Rose lot 1, pétales transparents : cause = traits et lavis posés dans l'ordre de peinture, 113 paires en conflit, 4 rustines
    (`roses/refcache/rose-standard/journal.md`, « retouche v2 » tour 1 ; `vague3-points.md` l.110-117). Deux retouches Opus (v2, v3), puis
    relais 5 (« défauts partagés ») : relais 2 à 5 = 7,2 M sur 20,3 M (`bills/rose-standard.md`).
  - Phalaenopsis : v1 « pas aussi bien que d'habitude » ; pétales étroits en étoile, labelle 1/10 du diamètre trouvés seulement au
    tour 14 par la paire 27 (W/H rendu 1,13 contre photo 1,48) ; puis « terne et pauvre », « toutes de face », « fléchettes », « motte
    de beurre » : v2 à v6, 8 lignes Opus = 14,5 M plus 7,3 M d'orchestrateur (`bills/phalaenopsis.md`).
  - Cymbidium : cœur « figurine » (v2 refusée, `journal.md` « Relais v2-6 »), puis 8 relais v2-1 à v2-8 sur le seul labelle ; une dizaine
    d'essais « à l'aveugle » de placement (`at`, `phi`, `roll`) : « lobes passés derrière les pétales », « capuchon caché derrière la
    colonne », « signe de u inversé » (tours v2-17, v2-6-3, v2-20). Cause racine dite en toutes lettres : pas de vue des axes et des
    normales (« Trous v2 », « Trous v2-4 »).
  - Hortensia : fleurons épais (« pas fins ni légers », tour 31), 10 relais, 27,0 M ; les relais 6 à 9 (6,5 M) viennent des
    critiques « ombres grises, fleurons petits, blanc gris » (tour 27) et « bas de boule fantomatique » (tour 33).
  - Dahlia : 3 tours dans le mauvais sens (« pomme de pin », F2.1 à F2.5) faute d'une mesure de silhouette de profil ; la photo 171
    montrait un dôme bas (h/w ~ 0,65 contre ~ 1 rendu) ; verdict du journal : « Aucune mesure de silhouette de profil » (« Trous F2 »).
  - Anthurium/arum : le rtest bougeait (5 anthuriums au lieu de 4) : tours 6 à 10 pour comprendre l'encombrement (`getBBox`, `c5.js`).
- **Coût.** 96,9 M (50 %). Relais Opus par sortie : hortensia 11, phalaenopsis 8, amarante 7, dahlia 6, rose-standard 5.
  Un relais coûte 0,3 à 3,4 M ; la moyenne tourne autour de 1,7 M.
- **Contrôle chiffré / paire qui aurait attrapé, et où.**
  - Au 1er rendu de `forme` : la paire face (déjà dans `PAIRS`) avec W/H, H/W, solidité (`sil.py`), nombre de pièces visibles ; l'écart
    « pétales étroits en étoile » (phalaenopsis tour 14, cymbidium pair98, dahlia F2.5) se lit à ce moment. Aujourd'hui `check_forme`
    (`pipe.py:1348-1377`) ne vérifie que l'existence des fichiers, la syntaxe, `space.json` : aucun rendu n'est exigé avant la
    comparaison, qui vient après `fit`, `plante` et `finition` (`pipe.py:26`).
  - Transparence : nombre de paires de pièces en conflit d'ordre par tête (rose : 113 → 4) et nombre de traits hors de leur pièce ;
    le journal lui-même le réclame (« un `svroff` + `dbgp` qui imprime le nombre de paires en conflit », roses « Trous v2 »).
  - Étoile/cœur : `svroff=wash,shadow` (géométrie seule) « a montré la cause du cœur en étoile en un tour » (roses « Trous relais 3 ») ;
    à rendre d'office pour toute rosette au tour 1.
  - Orientation d'une hampe (« toutes de face ») : histogramme lacet/tangage des fleurs d'une hampe (`&ordbg=1` existe depuis le tour
    v4-1 du phalaenopsis) ; seuil : écart-type du lacet ≥ 15° et au moins une fleur de dos ou de profil sur cinq.
  - rtest : jamais exigé avant la fin de `forme` ; le prompt `forme.md` ne parle ni de `rtest` ni de boîte de l'ancien dessin
    (`grep rtest fleur/pipe/prompts/forme.md` : vide), alors que 6 chantiers sur 7 ont découvert le problème en cours de route
    (voir 2.9).

### 2.5 Plante (tige, feuilles)
- **Ce qui a raté.** Feuille d'amarante « bien trop mauvaise qualité » (porteur) : 4 réécritures, relais 4 à 6, tours 33, 37, 40 ; coût
  2,2 M plus orchestrateur 3,1 M (`bills/amarante-retombante.md`). Feuilles d'hortensia : « mates », « régulières » (tours 41, 46, ordre 2
  du chef ; `PASSATION-VAGUE3.md` l.239 : « feuilles régulières » restent). Feuille de rose « laurier » (rose-standard tour 6),
  dents perdues (M = 28 points pour 13 dents, tour 8 : « vu seulement au gros plan »). Jonction tête-tige jugée « à l'œil » pour les
  hampes d'orchidées car `jn=1` ne mesure que `svBranch` (phalaenopsis et cymbidium, « Trous »). `jgap.py` (pièces détachées, jour en mm,
  col) n'est né qu'au tour 50 de l'hortensia, après une tête flottante en QA.
- **Contrôle chiffré.** (a) Statistiques de feuille sur le masque : écart-type de L dans la feuille (une feuille plate « schématique »
  a un écart-type très bas), part de pixels de nervure sombre en creux, courbure moyenne des latérales (droites = schématique),
  rapport longueur/largeur contre la photo. Rien de tout cela n'existe : `PAIRS` (`pipe.py:1613-1624`) n'a **aucune paire de
  feuille** ni de coupe de tige, alors que `organe:feuille-dessus` est au minimum dur de `refs` (`pipe.py:945`). (b) `jgap.py` (déjà
  dans `fleur/`) à l'étape `plante` : 0 pièce détachée, jour 0 mm, largeur de col mesurée.
- **Paire qui aurait attrapé.** Photo de feuille / rendu de feuille au même grossissement, dès le premier tour de `plante`.

### 2.6 Finition
- Le `pipe.py` prévoit une finition Sonnet qui recopie les matières mesurées et ne contrôle que le poids (`pipe.py:1489`). Dans les
  faits, la finition de la vague 3 a été faite par des relais Opus après critique : matière « papier découpé » du dahlia et du
  chrysanthème (3.10, tours M1 à M10), fané des roses (v3, 2 relais), orchidées v2 à v6. Coût de la finition Sonnet : 2,0 M (1 %) ;
  coût de la finition réelle : non mesuré à part, mais c'est la majorité des relais postérieurs au premier livrable (voir 2.4).
- Contrôle chiffré manquant : un bilan « matière » par pièce (écart-type de L, nombre de teintes, part de pixels > L 95 sur les
  blancs) comparé à la photo ; `gstat.py` (stats par case) est la base.

### 2.7 Comparaison photo/rendu
- **Ce qui a raté en vague 3.** La comparaison n'existait pas comme étape : elle fut faite à la main par chaque modeleur, tard et avec
  des scripts jetables (`comp.py`, `mont.py`, `cellpair.py`, `lipy.py`, `lip3.py`, `cz.py`, `cmpc.py`, `facev.py`, `cu.sh`,
  `lfcmp.py`). Premières paires mesurées : phalaenopsis tour 14 (v1, après 3 relais) ; cymbidium tour 7 ; hortensia tour 19 ;
  dahlia tour F2.5. Les montages manuels qui ont servi étaient grands (`phalaenopsis/refcache/phalaenopsis/comparaison/face-v2.jpg`
  4146 x 700 px ; `face-v6.jpg` 1800 x 2038 px).
- **Défauts de l'outil `img.py pair` (déjà notés 8 fois dans les journaux) :**
  - fond chargé : la silhouette prend tout le cadre (au moins 8 occurrences : roses, cymbidium, phalaenopsis, freesia, pois de
    senteur, tulipe frangée… : « pair inutilisable ») ;
  - `img.py:59` `BRIEF` = fourchettes de la tulipe (bouton H/W 1,6-2, coupe W/H 0,85-1,05, flancs 0-18°), affichées sur chaque paire,
    quelle que soit la sorte (`img.py:133-137`) ;
  - `img.py:138` `h = 420` px par vignette et `img.py:141` plafond de 900 px de large : une paire « D 800 » est réduite à 420 px de haut ;
    le `refaire.sh` généré (`pipe.py:1717`) ne passe pas `--h`. Le gros plan D 800 de `PAIRS` (`pipe.py:1622`) n'apporte donc pas plus
    de détail que la paire de face ; pointes, nervures, translucidité (les points 2.11, 4.8d, 4.8e du porteur) n'y sont pas lisibles ;
  - `img.py:108-117` `cellbox` : géométrie de la grille de la tulipe ; « boîte décalée d'environ 20 px » sur gerbera
    (`vague3-points.md` l.146) ; chiffres faux sans erreur quand les cases se chevauchent (journal pois).
- **Coût.** Non mesuré séparément ; il est contenu dans les relais. Un montage manuel coûte au moins un tour de rendu et une image.

### 2.8 Juge
- **Jamais exécuté.** Voir la section 4.

### 2.9 Témoins
- **Ce qui a raté.** (a) Les écarts de rtest sont découverts en plein modelage, un par un : phalaenopsis tour 4 (`o.room`) ; spathes
  tours 6 à 10 et r4 (boîte de l'ancien dessin) ; rose-de-jardin tours 9 et 11 (`rosaOldBox`) ; hortensia tour 39 (`getBBox` des ombres
  découpées) ; rose-standard v2 tour 10-11 (cou long) ; kenya (`ROSA_M` partagé par id). Chaque cas coûte 2 à 5 tours de rendu (0,3 à
  1 M). (b) Référence mouvante : « main avance, ses empreintes changent » (`phalaenopsis/journal.md` « Trous »), rtest des
  renoncules différent du chantier avant toute retouche (`vague3-points.md` l.120), témoin freesia à 0,90 % par un autre modeleur
  sur le même kit (journal glycine). (c) Requête du témoin anémone : `base_q.txt` sans graine (avec graine : 10,96 %, « faux défaut »,
  cymbidium tour 4) ; requête de `base_v2.png` « notée nulle part » (spathes tour 19) ; requête viorne perdue (hortensia tour 13).
  (d) `ramwait.sh` a affiché « RAM OK » à 0,42 Go puis à 2,9 Go (journal phalaenopsis v2-14 et v3-6).
- **Ce que fait déjà pipe v3** : anémone contre `base_v2.png`, rtest de la sorte, des sortes du kit et des tulipes (comparées à
  l'atelier principal), SKU déplacés, planches du kit à 0,00 % (`pipe.py:1928-2014`).
- **Ce qui manque.** (1) Ces témoins arrivent après `juge` (ordre de `STEPS`, `pipe.py:26`), donc après tout le coût Opus ; un rtest
  de la sorte avant/après devrait tourner au fil de `forme` (le prompt `forme.md` ne l'exige pas). (2) Rien ne lie un jugement
  « ok » à l'état du code : voir 4.6.

### 2.10 Publication (`publier.sh`, `temoins.sh`)
- Les témoins sont **imprimés, pas jugés** : `temoins.sh` écrit `head -c 600` des JSON (lignes 20 et 24) et rend le code du dernier
  `echo` ; `publier.sh fin` (lignes 44-51) committe et avance `main` sans relire `sku-apres-*.txt`, `rtest-*-*.json` ni le diff de l'anémone.
  La règle « tous verts avant `fin` » (passation l.188) repose sur la lecture de l'orchestrateur. Chaque appel `G()` jette sa sortie
  (`>/dev/null 2>&1`) et son code (`timeout 1700`) : un rendu raté ne s'y voit que par un fichier manquant.
- Fusions à la main : conflit de `pilote/svtest.js` (orchidées), `REFERENCES.md` (les deux côtés gardés par regex), `late` à renuméroter,
  `VERSIONS` de `inventaire/inv.js` à tenir (passation l.295). Le coût est dans l'orchestrateur (30 %).
- Le tour de rendu perdu type : `mkapp.sh` seul ne reconstruit pas `pilote/sv.html` et `shot_r.sh` ne reconstruit pas l'app (trois
  tours de rendu sur six perdus au relais 4 des roses, un sur kenya, un au 1er rendu de la tâche bouquet du phalaenopsis). pipe v3 le
  mitige : ses propres contrôles reconstruisent (`pipe.py:1371-1374`, `1930-1933`) et `forme.md` chaîne `mkapp.sh && mksv.py && shot_p.sh`
  en une commande ; `shot_p.sh` appelé seul reste exposé.

## 3. Outils manquants (cités dans les journaux), par ordre de gain

| # | Outil | Preuve | Étape touchée |
|---|---|---|---|
| 1 | Montage photo/rendu général, grande image (`img.py contact`/`mont`), recadrage sans fond uni | `phalaenopsis/journal.md` « Trous » ; amarante `mont.py` ; dahlia `cellpair.py` ; 9 scripts jetables | comparaison, juge |
| 2 | Détourage de la fleur sur photo à fond chargé (masque par teinte, boîte donnée = silhouette) | ≥ 8 occurrences : roses, cymbidium, phalaenopsis, freesia, pois, tulipe frangée… | photos, comparaison |
| 3 | Affichage des axes et normales des pièces (`svtest &axes=1`, fil de fer, u+ et normale) | cymbidium « Trous v2 » et « v2-4 » ; ~10 essais à l'aveugle | forme |
| 4 | Rapport de visibilité par pièce (aire visible, paires en conflit d'ordre, traits hors pièce) | roses « Trous v2 » ; cymbidium tours v2-17 à v2-20 | forme |
| 5 | Mesure du profil (`img.py prof` : h/w, largeur à 80 % de la hauteur) et mesure d'organe (`img.py organ` : largeur de feuille, de tige) | dahlia « Trous F2 » (3 tours perdus) ; pois, tulipe-frangée, phalaenopsis | forme, plante |
| 6 | Mesure de chenille (taille et densité des glomérules par cm, nombre de lobes au bord) | amarante tours 2 à 8, 24 à 27 (« perles », « étoiles », « bandes »), « Trou relais 4 » (échelle d'écran inconnue) ; citée en §0 de la passation | forme, plante |
| 7 | Fond sombre pour `bq=1` | `svtest.js:174` n'applique `bg` qu'au `snap` ; dahlia, chrysanthème, cymbidium, phalaenopsis « fond sombre non rendu » | QA, comparaison |
| 8 | Rendu qui renvoie l'exception JS au lieu de « NO OUTPUT » | cymbidium « Trous v2-8 » (3 rendus perdus), amarante tour 41, 5 autres cas de portée/TDZ | tous les rendus |
| 9 | `shot_r.sh`/`shot_p.sh` qui reconstruisent app puis `sv.html` | roses relais 4 et kenya ; phalaenopsis tour 22 | tous les rendus |
| 10 | Poids par pièce et par balise (`kb_tail.js`, `?dbgel=1`) | 6 journaux ; mesure seulement depuis le 17 octobre | finition |
| 11 | Montage de planche SKU (`planche_rose.py` n'est qu'à la rose) et `cols=N` du `grid` | roses, hortensia `cwsheet.py`, cymbidium `v3c.py` | planches |
| 12 | `rtest` par sorte (empreinte des seules têtes de la sorte) et requête consignée avec chaque rendu | phalaenopsis « Trous » ; roses relais 5 (requêtes retrouvées dans l'historique SQLite de Chrome) | témoins |
| 13 | Fiche des options du kit orchidée dans `KIT.md` (−25 k par relais) | cymbidium « Trous v2-3 », « v2-7 » | forme |
| 14 | `shot.sh` qui montre l'attente de la porte et la file | amarante, 50 min de blocage ; cymbidium | rendus |

Déjà versés dans `fleur/` : `hmed.py`/`heads.py`, `jgap.py`, `gstat.py`, `qt.py`, `cwmed.py`, `sil.py`, `prof.py`, `organ.py`, `meas.py`.
Aucun n'est appelé par `pipe.py`.

## 4. pipe v3 : comparaison et juge n'ont jamais tourné sur une vraie sorte

### 4.1 Preuves
- `PASSATION-VAGUE3.md` l.138 : « selftest 80/80, jamais encore lancé sur une vraie sorte ».
- Les seuls `pipe-state.json` du dépôt : `ch/lilas/refcache/lilas/` (9 octobre, v1, s'arrête à `planches`, 2,92 M eq en 21 appels),
  `refcache/glycine/` (recensement seul), `ch/outils/refcache/pipe-test/` (appels `models` du 8 octobre). Aucun ne contient
  `comparaison` ni `juge`. Tous les `effort` des factures valent `None` : l'effort `xhigh` n'a jamais été exercé en vrai.
- Le binaire choisi par `find_claude` (`pipe.py:123-133`) est le plus récent du bureau : aujourd'hui `2.1.299` (dossiers 2.1.295 et
  2.1.299 présents) ; le v1 a tourné en 2.1.293. Les indicateurs `--strict-mcp-config`, `--disable-slash-commands`, `--setting-sources ""`,
  `--tools`, `--effort` ne sont validés que par `fakeclaude.py`. Le lilas v1 : 2 relais sur 4 de `forme`, 1 sur 2 de `plante` et 1
  regard de `fit` ont fini en `error_max_turns` (plafond de l'époque ≈ 36 tours, 60 aujourd'hui) ; cet état v1 a ensuite demandé une
  retouche Opus complète (mémoire du projet : « pipe.py donne un ~3 M v1, toujours suivi d'une retouche »).

### 4.2 Risques du premier passage réel (fichier:ligne)
1. **Vue de profil codée en dur à 7** (`pipe.py:1617`, bouton `1618`). Pour les orchidées le vrai profil est la vue 8 (« un défaut a été
   jugé sur la mauvaise vue », phalaenopsis « Trous »), pour l'anthurium « profil illisible avec la vue 7 » (spathes tour 3, vues 0, 4, 8).
   La paire « profil » compare alors deux angles différents ; le juge, qui ne peut pas refaire de rendu, mettra `ko`. Le modeleur ne peut
   pas corriger : `pairs.json` et `refaire.sh` sont réécrits à chaque `step_comparaison` (`pipe.py:1696-1722`, « never edit »).
   Résultat attendu : deux allers-retours Opus xhigh gâchés puis `refus.md`. Variante vue/paire par famille indispensable.
2. **Détail perdu** (`img.py:138-141` + `pipe.py:1717`) : paires réduites à 420 px de haut et 900 px de large. Le juge ne verra ni les
   pointes (2.11), ni les zones fines (4.8d), ni la translucidité (4.8e) que le porteur reproche ; « agrandir » une paire déjà
   réduite (`img.py zoom` sur le `.png` de la paire) ne rend rien. Les montages manuels de la vague 3 faisaient 1 800 à 4 146 px.
3. **Mesures hors sujet** (`img.py:59`, `133-137`) : fourchettes de tulipe imprimées pour toute sorte ; `juge.md` ligne 10 demande de
   comparer « les mesures de img.py pair contre celles de la photo ». Sur photo à fond chargé, la mesure de la photo est celle du cadre
   entier (`pipe.py:1710` : boîte = image entière). Un juge adversarial prendra ces chiffres au sérieux.
4. **Choix de la photo non vérifié** (`pipe.py:1640-1686`) : la paire « profil ouvert » retombe sur `vue:profil` quelle que soit le stade ;
   la paire « plante » retombe sur `organe:tige` (gros plan de tige) face à un rendu de plante entière `full=40` (échelles incompatibles) ;
   la sélection `cw-*` utilise une inclusion de sous-chaîne (`pipe.py:1676` : `t[8:] in n or n in t[8:]`) qui fait coïncider « rose » avec
   « rose-vif », et dépend de la balise `coloris:` jamais auditée (voir 2.2) ; si le SKU porte un nom générique (`cultivar` vide), la paire
   `cw-*` n'est pas faite, en silence (`continue`, ligne 1678). Les photos fausses du cymbidium et du phalaenopsis (2.2) y seraient
   passées telles quelles.
5. **Pas de paire de feuille, de coupe de tige ni de jonction** : les défauts de l'amarante et de l'hortensia (§2.5) ne seraient pas
   jugés ; le juge ne juge que les clés de `pairs.json`.
6. **Invalidation totale par la date** (`pipe.py:1753-1767`) : la moindre retouche d'un fichier de `app/` rend toutes les paires « plus
   anciennes » (jusqu'à 8 + 10 = 18 rendus Chrome par la porte à refaire à chaque tour du modeleur). Le coût de rendu et de lecture
   d'images (19 % de la facture) est multiplié ; le modeleur sera tenté de rendre un lot sans regarder.
7. **Juge à 40 tours** (`pipe.py:1823`) pour jusqu'à 18 paires : lire BONNES-PRATIQUES (183 lignes), `pairs.md`, le tableau, puis pour
   chaque paire un `Read` du `.png` et du `.txt` fait 40 appels sans aucun agrandissement ; si les `Read` ne sont pas groupés, le juge
   s'arrête à `error_max_turns`, sans verdict. Le code le relance une fois (`pipe.py:1847-1852`, double coût Opus) puis le compte `ko`
   avec la raison « le juge n'a pas pu juger », que le modeleur ne peut pas corriger : `check_comparaison` exige pourtant une retouche
   de `app/` et une table réécrite (`pipe.py:1778-1783`) : une retouche factice est la seule issue.
8. **Juge pas obligé de lire BONNES-PRATIQUES** : `model_loop` applique `must_read` au modeleur, `judge_once` ne vérifie que les paires
   (`pipe.py:1835`). Le juge est un autre appel de la même famille de modèle, et il lit d'abord le tableau du modeleur (prompt
   `juge.md` ligne 4) : risque d'ancrage.
9. **Ancien rapport table/paires** : clé `cw-` tronquée à 20 caractères (`pipe.py:1680`) contre la clé de table normalisée
   (`pipe.py:1747`, sans tirets finaux) ; une clé qui se termine par un tiret après troncature n'est jamais retrouvée (« no line in
   the table »). Cas rare mais silencieux.
10. **Échec tardif pour manque de photo** : `step_comparaison` lève `StepFailed` si une paire n'a pas de photo (`pipe.py:1790-1795`),
    donc après `forme`, `fit`, `plante` et `finition` (plusieurs M eq d'Opus). Le contrôle équivalent doit se faire à `refs`
    (`REFS_HARD`, `pipe.py:945`, n'exige pas `stade:declin` ni `organe:plante`, que `PAIRS` accepte par repli).

### 4.3 Trous de cohérence (à corriger avant de faire confiance au « FINI »)
- **Jugement périmé.** `STEPS` met `temoins`, `qa`, `planches` après `juge`. Si un témoin échoue et que le modeleur retouche `app/`,
  les paires deviennent périmées mais `juge` reste « done » ; `step_planches` ne vérifie que le statut (`pipe.py:2085-2087`) et le
  message `FINI` aussi (`pipe.py:2277`). Rien n'enregistre l'empreinte de `app/` au moment du verdict.
- `check_forme` (`pipe.py:1348`) : fichiers et syntaxe seulement ; aucune image n'est exigée avant l'étape comparaison.
- `step_finition` : voir 2.3 ; le contrôle de couleur est absent.
- `step_qa` ne produit rien qui compare au vrai bouquet de modèle (fond sombre non supporté, 2.7 et §3 n° 7).

### 4.4 Estimation du premier passage (à partir des factures)
Pas de mesure. Un relais de modeleur xhigh = 0,3 à 3,4 M (moyenne 1,7 M). Comparaison : au moins un relais ; chaque aller-retour du juge =
un juge (≈ 0,6 à 1,2 M : contexte 130 k, 40 tours, 18 images) plus un relais de comparaison. Pour une sorte de plus de 10 paires, compter
4 à 9 M de plus par passage ; refus après 2 allers-retours = ≈ 8 M perdus. Estimation de l'auditeur, non mesurée.

## 5. Améliorations atomiques classées

Chaque ligne : une modification, un contrôle, un témoin ; le gain attendu est qualitatif, le coût en eq approximatif. « Témoin » =
anémone 0,00 %, rtest identique, comme le veut la passation.

| Rang | Modification | Contrôle | Témoin | Gain | Coût |
|---|---|---|---|---|---|
| 1 | `PAIRS` : vue de profil et de bouton **par famille** (champ `views` de `pipe.py` ou lu dans le brief), écrite dans `pairs.json` | Une planche `grid` vues 0, 2, 7, 8 d'une orchidée et d'une tulipe : le profil lisible est celui retenu | Planches tulipes inchangées (pas de changement de moteur) | Évite le refus certain du premier passage orchidée/spathe (§4.2-1) | 1 à 2 h de code, 0 eq |
| 2 | `refaire.sh` : `--h` 900 à 1 200 par défaut (au lieu de 420) et plafond de largeur 2 400 ; image du gros plan à D 800 réelle | `python fleur/img.py pair` sur une paire existante : la taille de la vignette double, le pixel du rendu à D 800 reste 1:1 | Aucun fichier de rendu modifié | Le juge voit enfin pointes, zones, translucidité (§4.2-2) | 0,5 h, 0 eq ; un peu plus de tokens par image (≈ 3 k) |
| 3 | `img.py pair` : `BRIEF` lu dans `brief.md` de la sorte (sinon « pas de fourchette ») ; sortie sans fourchettes de tulipe | `img.py pair` sur une rose : plus de ligne « brief: coupe… » | Tulipe : mêmes lignes qu'avant | Plus de chiffres hors sujet pour le juge (§4.2-3) | 1 h, 0 eq |
| 4 | Enregistrer l'empreinte (`sha1` des `app/*.js` de la sorte) dans `pipe-state.json` au verdict `ok` du juge ; `planches` et `FINI` la recontrôlent | Retoucher un fichier de `app/` après `juge` : `planches` refuse | selftest 80/80 (ajouter 2 cas) | Évite de publier un code non jugé (§4.3) | 1 h, 0 eq |
| 5 | Paires **feuille** (dessus) et **coupe de tige / jonction** dans `PAIRS` (photos `organe:feuille-dessus`, `organe:tige`) | Vérifier qu'une planche `plant=1` rend la feuille à l'échelle de la photo ; `jgap.py` : 0 pièce détachée | Planches existantes inchangées | Attrape les défauts amarante/hortensia/rose (§2.5) avant l'orchestrateur ; ≈ 2 à 3 M eq évités par sorte | 2 h, 0,3 M eq par passage |
| 6 | Contrôle de couleur chiffré dans `finition` : `cwmed.py` sur la face ouverte de chaque coloris, dL ≤ 7 et dh ≤ 10° | Une planche à 3 coloris : écart affiché ; un coloris volontairement faussé est refusé | Anémone 0,00 % | Coupe les relais « terne », « kaki », « mauve » (hortensia 8 tours, phalaenopsis) | 2 h, 0,1 M eq |
| 7 | `refs` : audit des balises `coloris:` (ΔE médiane de la photo contre l'hex ; > 15 = photo écartée des paires et signalée) ; champs « vu » `groupe=` et `côté court ≥ 1 000 px` | Sur le lot cymbidium : la photo 122 (jaune sauvage) est écartée | Aucun rendu | Évite les fausses paires (phalaenopsis/cymbidium) | 3 h, ≈ 0,1 M eq |
| 8 | `forme` : exiger, avant « done », une paire de face avec W/H/solidité (`sil.py`) écrite dans `journal.md`, et un `rtest` de la sorte (prompt `forme.md`) | Le contrôle de `check_forme` lit les deux lignes | rtest identique | Les écarts d'étoile/proportion vus au tour 1 et non au tour 14 ; rtest en tête et non en fin (§2.9) | 1 h, ≈ 0,5 M eq par sorte |
| 9 | Rapport de visibilité par pièce + nombre de paires en conflit (`svroff=…`, `dbgp`) dans `svtest` | Rose : 113 → 4 retrouvé sur v1 ; `dbgp` imprime le décompte | Planche rose v3 identique | Attrape les « pétales transparents » avant la comparaison (§2.4) | 4 h, ≈ 1 M eq pour l'outil |
| 10 | `svtest &axes=1` : axes u, normale et sens de `wU` en fil de fer par pièce | Un cymbidium : le sens de `u` s'affiche, concordant avec le commentaire de `wU` | Aucune sorte publiée ne change (option opt-in) | Évite ~10 essais à l'aveugle par labelle (§2.4) | 4 h, ≈ 1 M eq |
| 11 | Paire de comparaison de la plante à la même échelle : `organe:plante` seulement, sinon la paire est notée « absente » (pas de repli sur `tige`) | `pair_plan` : plante absente → refs complétées | Aucun | §4.2-4 | 0,5 h |
| 12 | Vérifier à `refs` les paires exigées (`stade:declin`, `organe:plante`, `coloris:`) au lieu de `comparaison` (`pipe.py:1790`) | `python fleur/pipe.py run <sid> --only refs --dry` annonce les paires manquantes | selftest | Évite l'échec après plusieurs M eq (§4.2-10) | 1 h |
| 13 | Juge : `turns` 60, groupement des `Read`, vérification de `BONNES-PRATIQUES` lue, tableau du modeleur donné **après** les verdicts (ou pas du tout) | selftest : juge sans lecture refusé ; un juge de 18 paires finit sans `error_max_turns` (essai à blanc en `--dry`) | selftest 80/80 | Évite le `ko` sans issue (§4.2-7, 8) | 1 h, 0 eq |
| 14 | `pipe.py models` sur le binaire actuel (2.1.299) avec `--effort xhigh` | Les 3 appels répondent, `effort` apparaît dans `pipe-bill.json` | — | Vérifie les indicateurs avant la première vraie sorte (§4.1) | 5 k eq |
| 15 | `shot_p.sh`/`shot_r.sh` : reconstruire app puis `sv.html` si plus vieux que `app/*.js` ; renvoyer l'exception JS | Rendu d'un module modifié : la sortie change sans `mksv.py` | Aucun rendu modifié | Les prompts pipe chaînent déjà la reconstruction ; reste l'exception JS (3 rendus perdus au cymbidium) ; ≈ 0,3 M eq par sorte | 1 h |
| 16 | `temoins.sh` : écrit `temoins-verdict.json` (vert/rouge par ligne) et `publier.sh fin` refuse si rouge | Un SKU déplacé volontairement : `fin` refuse | anémone 0,00 % | Retire du jugement humain le plus fréquent (§2.10) ; orchestrateur −1 à −2 M par publication | 2 h |
| 17 | Cache d'images : l'orchestrateur et le juge lisent `img.py small` ; le juge en plus la paire pleine | Mesurer la taille d'une lecture avant/après | — | 19 % de la facture est de la lecture d'image ; −20 à −30 % possible | 0,5 h |
| 18 | `cw-*` : appariement par égalité de balise normalisée (pas de sous-chaîne), paire manquante annoncée en question | Un coloris « rose » ne prend pas « rose-vif » | Aucun | §4.2-4 | 0,5 h |
| 19 | Bilan par sorte versé dans `fleur/bills/` pour le cymbidium et pour chaque relais postérieur au livrable | `bill.py report cymbidium-grandes-fleurs` | — | Coût de la sévérité, connu | 1 h |
| 20 | Ordre des étapes : `temoins` (rtest + anémone, SANS Chrome lourd) avant `comparaison`, `qa` après le juge | `python fleur/pipe.py run <sid> --dry` affiche l'ordre | selftest | Écarts de composition vus avant les M eq de comparaison | 1 h |

Les rangs 1 à 4 sont à faire avant tout lancement de `pipe.py` sur une vraie sorte (le premier passage échouerait ou gaspillerait au
moins 8 M eq). Les rangs 5 à 8 traitent les défauts qui ont le plus coûté en relais. Les rangs 9, 10, 13 améliorent les outils du
modeleur.

## 6. Décisions qui ne sont pas les nôtres

- Q1 : accepter qu'une paire D 800 fasse 1 200 px de haut (plus d'images à relire, donc plus de tokens), ou garder 420 px et ne juger que
  les formes ?
- Q2 : le juge peut-il être un autre modèle (Sonnet/Codex) pour sortir de l'ancrage, au prix d'un jugement moins fin ? (ancrage :
  même famille que le modeleur, §4.2-8).
- Q3 : mettre dans `pipe.py` les chantiers de couleur sans photo de la variété (C) comme « paire absente » plutôt que bloquer.
- Q4 : corriger `shot.sh`, `skudump.sh`, `offerdump.sh`, `chantier.sh` (port 8765 en dur, refus du garde-fou : `PASSATION-VAGUE3.md`
  l.115-118) : cause de copies privées dans tous les chantiers.

## 7. Limites de cet audit

- Aucun rendu relancé ; les valeurs de pourcentage de coût proviennent des tableaux des factures (agrégées par un petit script de lecture
  seule) ; les parts sont approximatives (fenêtres communes, cymbidium absent).
- Les risques de la section 4 sont lus dans le code ; aucun n'a été vérifié à l'exécution. Les plus certains : 4.2-1, 4.2-2, 4.3.
- Les coûts estimés des rangs 9 et 10 (outils) sont des ordres de grandeur d'après le coût moyen d'un relais (1,7 M).
