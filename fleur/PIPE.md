# pipe.py : une sorte de fleur, de bout en bout, sans chef de chantier (v3)

`pipe.py` fait passer UNE sorte par la méthode /fleur. Chaque étape qui demande un modèle est un appel `claude -p` neuf (prompt court dans
`fleur/pipe/prompts/`, contexte vide, liste d'outils fermée, tours plafonnés). Entre deux étapes, des contrôles chiffrés en Python.
v3 (2026-10-17, décision du porteur : « mieux organisé, plus sévère, pour la meilleure qualité possible ») : Opus en effort `xhigh`, comparaison
photo/rendu paire par paire, puis un juge adversarial qui n'est pas le modeleur. Le poids des SVG et la facture sont des mesures, plus des limites.

## Commandes (depuis la copie de chantier ; serveur de l'atelier sur 8805 et recv.py sur 8781 allumés pour les rendus)
- `python fleur/pipe.py run <sid> --taxon "Genre espèce" [--family F] [--genus G] [--group "..."] [--kavb] [--skus "lilas~0:Nom du cultivar:2,..."]`
  `[--ch <copie>] [--from <étape>] [--only <étape>] [--skip-census] [--kit <module>] [--late N] [--juge-tours 2] [--opus-effort xhigh] [--cap <M>] [--dry]`
  - `--skus` : SKU du bouquet, cultivar, nombre de tiges (sinon `sku_bouquet` de `catalogue/serre/sources/<sid>.json`, en lecture).
  - `--family` : famille de forme ; `grappe` (aussi panicule, thyrse, racème, épi) fait mesurer l'inflorescence entière (FIT.md), le reste : fleur radiale.
  - `--skip-census` : un recensement existe déjà ; `refcache/<sid>/census/census.json` est pris tel quel, sinon les coloris de
    `catalogue/serre/sources/<sid>.json` (ou `<sid>-coloris.json`) sont importés en lecture (alias souples, photos nommées où qu'elles soient, id du
    catalogue gardés). L'étape census est notée « skipped ». `--from refs` fait de même quand census.json est là.
  - `--kit <module>` (ex. `y3-rose.js`, `y3-capitule.js`, `y3-spathe.js`) : la sorte étend une pièce de kit publiée. Préfixe de la famille déduit des noms
    du module (`svRose|SVROSE_` ; `--kit-prefix` pour forcer), sortes déjà faites avec elle trouvées dans `app/y-*.js` et `yz-*.js` (`--kit-sids`
    pour forcer). Le prompt forme demande d'étendre la pièce sans changer ces sortes ; les témoins le contrôlent.
  - `--rtest-bouge "<raison>"` : le porteur admet que la sorte fasse bouger les bouquets (tête en vraie taille, col fané courbé) : un `rtest`
    changé de la sorte se dit au journal sans bloquer (forme, témoins). Sans lui, une sorte qui remplace un ancien dessin suit la même règle.
  - `--groupes "hybride-de-coupe,jardin"` : les groupes de photos admis dans les paires (une sorte sauvage : `espece-sauvage`).
  - `--late N` : la vague `late:N` des coloris ajoutés (1 par défaut). `--juge-tours` : allers-retours juge → comparaison avant le refus (2).
  - `--opus-effort` : force un autre effort que `xhigh` pour toutes les étapes Opus.
  - `--views "profil:8,bouton:8"` : vues de la grille des paires de tête pour cette sorte (gardées dans `pipe-state.json`). Sans elle : `PAIRS`, puis la
    table `VIEWS_FAMILY` (orchidées et spathes : profil et bouton en vue 8 ; famille lue dans `--family`, le module `--kit`, puis le genre).
    La vue retenue et sa source sont écrites dans `pairs.json` (`view`, `view_from`).
- `python fleur/pipe.py status <sid>` : étapes, contrôles, facture. `bill <sid>` : le tableau par étape. `selftest` : 174 vérifications sans modèle ni Chrome.
- `python fleur/pipe.py locbox <rendu.json> feuille|tige` : la boîte de recadrage d'un rendu `plant=1&loc=1` (refaire.sh s'en sert).
- `python fleur/pipe.py pbox <boxes.json> <paire> <photo> [n°]` : la boîte de la photo d'une paire pour `img.py pair` (celle de `comparaison/boxes.json`, rognée à la photo, sinon la photo entière) ; `refaire.sh` s'en sert pour chaque paire.
- `python fleur/pipe.py rtsum <fichier>` : la ligne de journal d'un rtest (« rtest | IDENTIQUE » ou « rtest | n bouquets changés sur N ») ; `rtest.sh` l'imprime.
- `python fleur/pipe.py models [--which haiku,sonnet,opus] [--opus-effort xhigh]` : P14, trois appels minuscules sur le binaire choisi, chacun avec
  l'effort d'un vrai passage (Haiku `low`, Sonnet `medium`, Opus `--effort xhigh`), facturés sous `refcache/pipe-test` (colonne `effort` de
  `pipe-bill.json`) ; à lancer avant le premier vrai passage.
- `--dry` : aucun modèle, aucune commande ; liste les étapes, les appels (modèle, effort, tours, délai, outils, taille du prompt) et les commandes.
- Codes de sortie : 0 fini, 2 un contrôle a échoué ou le juge a refusé, 3 plafond atteint, 4 trois sortes déjà en cours. Tout se reprend par
  `run <sid>` (première étape non finie) ou `--from`.

## Rendus (O9)
- `fleur/shot.sh` (et donc sa copie privée `shot_p.sh`) reconstruit d'abord ce qui est périmé : `mkapp.sh` quand un `app/*.js` (ou `p2-p4.js`,
  `mkapp.sh`) est plus récent que `demo7.html`, puis `pilote/mksv.py` quand `demo7.html` ou `pilote/svtest.js` est plus récent que `pilote/sv.html`.
  Une construction ratée s'imprime « ERREUR DE CONSTRUCTION : ... » (et « PAS D'IMAGE »).
- Une page qui lève une exception ne donne plus « NO OUTPUT » : `mksv.py` pose avant l'application un petit script qui garde les erreurs JavaScript
  (`window.SVT_ERR` : message et premiers appels, fonction@ligne) ; `svtest.js` les écrit à la place des mesures 3 s après le début si aucune mesure
  n'est venue (`{"jserr":[...],"fallback":1}`, remplacé si les mesures arrivent ensuite) et les joint aux mesures sinon ; `shot.sh` imprime
  « ERREUR JS : ... » (ou « avertissement JS (image faite) »). `pipe.py` remonte cette ligne dans ses messages, `refaire.sh` aussi.
- `mkapp.sh`, `mkqa.sh`, `mkpl.sh` : les modules `y3-*.js`, `y-*.js`, `yz-*.js` triés sur le nom avant « .js », octet par octet
  (`LC_ALL=C /usr/bin/sort -t. -k1,1`), quelle que soit la locale du shell : `demo7.html` identique à l'octet à celui de main du 18 octobre
  (vérifié sous C et en_US) ; un `ls` nu sous `LC_ALL=C` mettait `y3-plante-nar.js` avant `y3-plante.js`. `fleur/fiche_eval.js` lit le même ordre.

## Port, scripts privés, mémoire
- Le serveur de l'atelier est sur `FLEUR_PORT` (8805 par défaut). Le port 8765 sert une autre application du porteur : pipe.py ne l'utilise ni ne le sonde
  jamais (8765 et 8766 sont refusés dans `FLEUR_PORT` et interdits aux modèles par `--disallowedTools`).
- Les scripts communs `fleur/shot.sh`, `skudump.sh`, `offerdump.sh` (et tout autre `fleur/*.sh` qui viserait `localhost:8765` hors commentaire) ne sont
  jamais modifiés : à chaque `run`, pipe.py écrit dans la copie visée une copie privée `fleur/<nom>_p.sh` (même contenu, port remplacé, fins de ligne LF,
  en-tête « PRIVATE COPY ») et ne se sert que d'elle. `fleur/portwrap_p.py` (copie de `fleur/pipe/portwrap.py`) lance un outil Python commun
  (`fit.py`) en envoyant ses appels à `shot.sh` vers `shot_p.sh`. Ces fichiers ne se committent pas.
- Avant chaque appel Opus et chaque rendu lourd (planches, paires, rtest, skudump, fit, lots de QA) : `fleur/res/ramwait.sh` de l'atelier principal
  (attend 4,5 Go libres, 30 min au plus ; `PIPE_RAMWAIT` le remplace, vide = coupé). QA par lots de 4 (RAM libre ≥ 4,5 Go). Trois sortes au plus en parallèle.

## Les étapes (M = modèle ; le reste est du Python)
| étape | travail | contrôle chiffré |
|---|---|---|
| census | `census.py`, puis Haiku sur les lots douteux réduits aux coloris du catalogue et aux coloris documentés par le négoce (`lot-<n>.json`) ; les cultivars de registre sans photo ne sont pas prouvés | par SKU du bouquet : niveau A, B **ou C** (règle du porteur), un SKU au niveau D, introuvable ou sous marque (nom de couleur générique) devient une question (`questions.md`), sans bloquer ; lot 900 : une recherche ciblée d'une photo nommée pour un SKU au niveau D |
| refs | `refs.py find/sheet`, Sonnet choisit EN REGARDANT les planches et vignettes, puis complète, puis écrit `brief.md` | chaque photo gardée a été ouverte (sa vignette `t<NNN>.jpg` ou sa planche, lu dans le flux de l'appel) et porte un champ `vu: stade=… vue=… organe=…` qui contient ses étiquettes ; sinon elle sort de `keep.json` (`keep-ecartes.json` ; une sélection d'une version antérieure, sans « vu », sort au premier passage et le choix se refait). Minimum dur : 10 photos, bouton, ouvert, fané, feuille, tige, vues face, trois-quarts, profil ; P7 : le champ « vu » dit aussi `groupe=` (hybride-de-coupe, jardin, espece-sauvage, autre) ; une photo de paire est d'un groupe admis (`--groupes`, par défaut hybride-de-coupe et jardin ; jamais autre) et a une copie `p<NNN>.jpg` d'au moins 1 000 px de côté court (l'original, téléchargé par pipe.py : `pair-photos.json`) ; audit des photos `coloris:` : médiane de la fleur (`refs.py auto`, confiance ≥ 0,5) contre la couleur du coloris (`coloris.json` après l'étape coloris, sinon le catalogue) : ΔE > 15 écarte la photo des paires de ce coloris et le dit (`coloris-photos.json`, `questions.md`) ; refait à la fin de l'étape coloris ; P11 : les paires fixes de la comparaison (face, trois-quarts, profil, bouton, fanés, plante, feuille, tige, gros plan) ont chacune une photo utilisable dès refs, sinon l'appel « fill » reçoit la liste avec les raisons, puis refs échoue (manque dur) ; `run <sid> --only refs --dry` les annonce d'après le disque |
| coloris | `refs.py auto` sur 3 photos par cultivar A, B ou C, médianes, ΔE ; Haiku pour les mesures douteuses | base, corps, pointe ; colonne marque dans `coloris.md` (nom générique si marque) |
| targets | `fit.py targets` (par `portwrap_p.py`) | au moins 3 mesures ; grappe : 3 mesures de silhouette |
| fiche | P15 : pipe.py pose `catalogue/serre/fiches/<sid>.json` (schéma `fiche-morpho/1`, `catalogue/serre/methode/fiche/SCHEMA.md`) avec le registre des photos gardées (`keep.json`, clé `<sid>:<sha1 de l'image>[:8]`) ; Sonnet la remplit en mesurant sur ces photos (`organ.py`, `img.py pair`, `fit.py targets`, `refs.py ring/pal`) | `python fleur/fiche.py check <sid>` sort à 0 ; valeurs `code` < 30 % ; au moins 8 valeurs mesurées (`segmente`, `mesure-echelle`, `regle`) et 3 commandes de mesure lancées dans l'étape (lues dans le flux, gardées dans `fiche-mesures.json`) ; rôles périanthe, bouton, tige, feuille ; aucune photo hors `keep.json` ; `SCHEMA.md` ouvert |
| forme | Opus xhigh : `y-<genre>.js` (ou la fiche existante), pièces de kit, `space.json` ; lit le résumé de la fiche morphologique (`refcache/<sid>/fiche-resume.md`, `fiche.py resume`, 200 lignes au plus, refait avant chaque appel ; la fiche JSON seulement pour une valeur précise) et relie la fiche au code (`code`, `ligne`, ou un `ecart` à lui) ; ses 10 derniers tours sur 60 gardés pour écrire `etat-forme.md` ; relais par `etat-forme.md` ; avant lui : `skudump` « avant » et planches « avant » des sortes du kit | clôture sans modèle avant le contrôle (œillet, 18 octobre : douze relais Opus finis à 61 tours sur elle) : `fiche.py sync <sid> --lien tete --write`, puis `refaire.sh face` et `rtest.sh` refaits s'ils sont plus vieux que `app/`, et leurs lignes au journal écrites par pipe.py (« pipe.py (auto) \| paire face \| photo W/H x \| rendu W/H y », « pipe.py (auto) \| rtest \| … ») ; le contrôle n'échoue plus que sur un vrai problème : une ligne ERR, une erreur JS ou pas d'image de face (la raison remonte), une fiche encore non valide après sync ; fichier, tête inscrite (`SV_HEAD`), `space.json`, construction ; `BONNES-PRATIQUES.md` et `fiche-resume.md` ouverts dans l'étape ; `fiche.py check <sid> --lien tete --souple-const` sort à 0 (chaque valeur chiffrée de la tête a son `code`, ou un `ecart` typé ; une constante en dur sortie de sa ligne est « à relier » : écrite au journal et dans `questions.md`, non bloquante ici, dite au rapport final) ; P8 : la paire de face (`comparaison/refaire.sh face`, faite après la dernière retouche de `app/`) et sa ligne au journal « paire face \| photo W/H x \| rendu W/H y » égale à `face.txt` ; le `rtest` de la sorte (`refcache/<sid>/rtest.sh`, après la dernière retouche) IDENTIQUE, ou, si la sorte remplace un ancien dessin (son sid dans `sku-avant.csv`) ou avec `--rtest-bouge "<raison>"` (porteur, 18 octobre : anthurium, cols fanés courbés), changé mais écrit au journal (« rtest \| n bouquets changés sur N », le nombre du fichier) ; une ligne ERR bloque toujours |
| fit | `fit.py`, puis Opus xhigh : un regard sur `fit.png`, report de `best` | `fit.json` et `fit.png` |
| plante | Opus xhigh : tige et feuilles, `space-plante.json` ; paires `feuille`, `tige`, `plante` par `refaire.sh` ; puis `fit.py` et le regard | idem ; `BONNES-PRATIQUES.md` et `fiche-resume.md` ouverts ; clôture sans modèle : `fiche.py sync --lien tout --write`, puis `fiche.py check <sid> --lien tout --souple-const` ; P5 : `fleur/jgap.py` sur une planche `plant=1` (6 stades, 40 cm) : 0 pièce détachée, au contrôle du modeleur et encore après `fit.py` |
| finition | Sonnet : matières des coloris | éléments et Ko par tête à DET 1 : mesure seulement ; P6 : chaque coloris de `coloris.json`, tête ouverte (.85) de face à D 200, par `fleur/cwmed.py` contre son `corps` : \|dL\| ≤ 7 et \|dh\| ≤ 10° ; cible de chroma < 15 (blancs, crèmes, gris) : \|dL\| ≤ 7 et \|dC\| ≤ 6, sans la teinte (BONNES-PRATIQUES 4.4) ; les coloris hors écart reviennent nommés à la finition (`couleur.md`, `couleur.json`) |
| temoins | P13 : AVANT la comparaison (aucun lot de QA, aucun modèle) ; refaits sans modèle sur le code jugé quand la comparaison a retouché `app/` (au ok du juge : rouges, la sorte n'est pas acceptée) ; `mkapp.sh` dit « app syntax ok » ; anémone contre `base_v2.png` (ou `base_before.png` avant d227daa) à 0,00 % ; `rtest` des SKU de la sorte et des sortes du kit IDENTIQUE (tulipes témoins pas pires que dans l'atelier principal) ; planches des sortes du kit à 0,00 % contre celles d'avant ; `skudump` après = avant (aucun SKU déplacé) ; budget mesuré | tous |
| comparaison | Python : 10 paires photo/rendu au même angle et au même stade par `img.py pair` (tête de face, trois-quarts, profil ; bouton ; fané .6 et .9 ; plante entière ; feuille dessus et tige/jonction, P5 : un seul rendu `plant=1&cell=900&loc=1` où svtest situe la tige et les feuilles, recadré par `pipe.py locbox` sur la plus grande feuille et sur son attache ; gros plan D 800 ; un rendu se réutilise tant qu'il est plus récent que `app/*.js` et `svtest.js` et fait par la même requête), dans `refcache/<sid>/comparaison/` avec `pairs.md` et `refaire.sh` (vignettes de 1 100 px de haut, 2 400 px de large au plus : `img.py pair --h 1100 --w 2400`) ; puis Opus xhigh (le modeleur) regarde chaque paire, corrige, refait les paires et écrit le tableau « contrôle 9.2 » en tête de `etat-comparaison.md` ; relais par `model_loop` | toutes les paires présentes (PNG non vides), refaites après la dernière retouche de `app/`, ouvertes par le modeleur ; une ligne par paire (`ok` ou l'écart) ; après un refus du juge : `app/` retouché et tableau réécrit |
| juge | Opus xhigh, appel neuf qui n'est pas le modeleur, lecture seule (Read, Glob, Grep, `python fleur/img.py`) : note chaque paire `ok`/`ko`, de façon adversariale (un doute = ko) ; sortie `{"verdict":"ok"\|"ko","lignes":[...],"ko":[...]}` | 60 tours ; `BONNES-PRATIQUES.md` ouverte par le juge (sinon il n'a pas jugé) ; le tableau du modeleur lu seulement après la dernière paire (anti-ancrage, ordre des Read contrôlé) ; `ok` seulement si chaque paire a été ouverte, notée et jugée juste (un juge qui n'a pas jugé est relancé une fois, puis compte ko) ; un `ko` renvoie à comparaison avec `ko-<n>.json`, au plus `--juge-tours` allers-retours, puis REFUS : `comparaison/refus.md`, code 2 ; une sorte refusée le reste tant qu'on ne relance pas `--from comparaison` (ou `--from juge`) |
| qa | `qawatch.sh` par lots de 4, `ramwait.sh` avant chaque lot | flottants, sous le vase, plis : 0 |
| planches | sku et plante (graine 7), copiées dans `catalogue/serre/pilote-printemps/sheets/<sid>-sku-pN.png` et `-plante-pN.png` | refusé si le juge n'a pas accepté la sorte, ou si `app/*.js` ou `pilote/svtest.js` ont changé depuis son `ok` (empreinte sha1 `fp` gardée dans `pipe-state.json` au verdict) ; avant elles, `fiche.py sync --lien tout` puis `check --lien tout --souple-const` : une fiche non valide, ou une constante à relier sans `ecart`, les arrête |
Une paire de tête (face, trois-quarts, profil, bouton, fanés, gros plan) rend le coloris que dit la balise `coloris:` de sa photo (id ou cultivar de `coloris.json`, égalité stricte, hors photos écartées par l'audit de couleur ; une photo qui en a une est préférée à égalité), sinon le premier coloris ; les paires plante gardent le premier (un seul rendu). `pairs.md` dit le coloris rendu et d'où il vient.
Boîte de la photo d'une paire : `refcache/<sid>/comparaison/boxes.json`, `{"face": [x0, y0, x1, y1]}` en pixels de la photo de la paire (`p<NNN>.jpg`), ou `{"face": {"box": [...], "photo": 6}}` (la boîte ne sert qu'à cette photo) ; le chef de chantier ou le modeleur l'écrit, `refaire.sh` la lit à chaque passage (une photo à plusieurs têtes donne sinon un W/H sans sens : œillet, photo 6).
Paires `cw-<id>` : une photo gardée balisée `coloris:` du même nom (id ou cultivar, normalisés, égalité stricte : « rose » ne prend pas « rose-vif ») ;
un coloris sans photo à lui devient une question (`questions.md`, section « Coloris sans paire »), jamais un saut silencieux.
La plante reprend `targets.json`. Toutes les planches de pipe.py et des prompts portent `&seed=7`. Aucun commit ni fusion : les planches sont seulement copiées.
pipe.py ne déclare « FINI » qu'une sorte dont toutes les étapes sont faites et que le juge a acceptée, avec le code qu'il a jugé (même empreinte), les témoins
verts sur ce même code ;
sinon « NOT FINISHED » et le code 2.

## Les prompts
`fleur/pipe/prompts/` : `census`, `refs`, `brief`, `coloris`, `fiche`, `forme`, `fit`, `plante`, `finition`, `comparaison`, `juge` (40 lignes au plus chacun,
contrôlé). Forme, plante, comparaison et juge rendent `BONNES-PRATIQUES.md` obligatoire (lue en entier au premier appel, relue au relais ; copie du
fichier de l'atelier principal dans `refcache/<sid>/ref/`) et listent les pièges connus : pétales transparents ou contours vus au travers (blancs),
forme « papier découpé » sans lumière ni volume par pièce (3.10), profil illisible, fané où la tige traverse la tête ou en « sac », traits de bord et
nervures grossiers ou qui flottent (3.6b), planches sans graine fixe.

## État et facture
- `refcache/<sid>/pipe-state.json` : étape courante, sorties, messages (juge : `trips`, `refused`, `report`). `pipe-bill.json` : une ligne par appel (étape, modèle,
  effort, outils, tokens d'entrée, cache écrit, cache lu, sortie, équivalent Opus, tours, durée, pic de contexte, outils refusés) : c'est la mesure qui sert au porteur.
  `pipe-logs/` : le flux de chaque appel (`.jsonl`, avec les appels d'outils lus par les contrôles) et la sortie des commandes. `questions.md` : les questions ouvertes.
- Équivalent Opus : entrée 1, cache écrit 1,25, cache lu 0,1, sortie 5 ; Sonnet 0,6, Haiku 0,2 (poids de `bill.py`), depuis l'événement `result`.
- `--cap` (40 M par défaut) : une mesure, pas une contrainte de qualité ; au-delà, l'appel suivant est refusé (état gardé, reprise avec `--cap` plus haut).

## Le CLI
- Binaire : le plus récent de l'application de bureau (`%APPDATA%/Claude/claude-code/<version>/*/claude.exe`), ou `PIPE_CLAUDE`. Aucune mise à jour d'installation.
- Contexte de départ réduit : `--strict-mcp-config --disable-slash-commands --setting-sources ""`, `--tools` fermé, `--system-prompt` court. Jamais
  `--dangerously-skip-permissions` : `--allowedTools` fermé, `--disallowedTools` (kill, rm -rf, git commit/push/merge/reset, `:8765`, 8766, `sh fleur/shot.sh`),
  `--max-turns` (Opus 60), `--effort` (Opus xhigh). Délai par appel : Opus 5 400 s ; au-delà, l'arbre du processus lancé par pipe.py (et lui seul) est terminé.

## Règles tenues
- Un seul Opus à la fois par copie : le verrou `ws/locks/opus-<copie>` couvre forme, fit, plante, finition, comparaison, juge, temoins, qa, planches.
- Trois sortes au plus sur le PC : `ws/locks/pipe-1..3`. Les rendus passent par `shot_p.sh` (la porte `ws/gate.sh`).
- Jamais de bulbe, de racine ni de terre ; marques selon STANDARD-SOURCES ; photos de tiers (paires comprises) dans refcache seulement.
- Aucun processus étranger n'est touché ; ports 8765 et 8766 jamais utilisés ; aucun secret.

## Hypothèses à confirmer
- Forme de `census.json` lue avec des alias (`nom`, `niveau_provisoire`, `marque.indice`, `photos[]`, `synonymes`) ; import `--skip-census` : niveaux
  `niveau_retenu|niveau|niveau_preuve|niveau_provisoire`, marque d'après `marque.statut` (« à vérifier » → a_verifier), photos d'autres variétés écartées.
- La règle des marques reste bloquante pour un SKU du bouquet au recensement (inchangée) ; les coloris sous marque sont mesurés, leur nom ne s'affiche pas.
- Paires : la photo entière face à la case du rendu, sauf boîte de `comparaison/boxes.json` ; `img.py pair` mesure le sujet au centre.
- Planches des sortes du kit : requête sans `cws` (coloris par défaut de la planche), même requête avant et après.
- `fit.json` : seul `best` est compté ; le reste est affiché tel quel.
