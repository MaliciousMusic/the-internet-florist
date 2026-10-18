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
  - `--late N` : la vague `late:N` des coloris ajoutés (1 par défaut). `--juge-tours` : allers-retours juge → comparaison avant le refus (2).
  - `--opus-effort` : force un autre effort que `xhigh` pour toutes les étapes Opus.
  - `--views "profil:8,bouton:8"` : vues de la grille des paires de tête pour cette sorte (gardées dans `pipe-state.json`). Sans elle : `PAIRS`, puis la
    table `VIEWS_FAMILY` (orchidées et spathes : profil et bouton en vue 8 ; famille lue dans `--family`, le module `--kit`, puis le genre).
    La vue retenue et sa source sont écrites dans `pairs.json` (`view`, `view_from`).
- `python fleur/pipe.py status <sid>` : étapes, contrôles, facture. `bill <sid>` : le tableau par étape. `selftest` : 80 vérifications sans modèle ni Chrome.
- `python fleur/pipe.py models` : trois appels minuscules, un par modèle (facturés sous `refcache/pipe-test`).
- `--dry` : aucun modèle, aucune commande ; liste les étapes, les appels (modèle, effort, tours, délai, outils, taille du prompt) et les commandes.
- Codes de sortie : 0 fini, 2 un contrôle a échoué ou le juge a refusé, 3 plafond atteint, 4 trois sortes déjà en cours. Tout se reprend par
  `run <sid>` (première étape non finie) ou `--from`.

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
| refs | `refs.py find/sheet`, Sonnet choisit EN REGARDANT les planches et vignettes, puis complète, puis écrit `brief.md` | chaque photo gardée a été ouverte (sa vignette `t<NNN>.jpg` ou sa planche, lu dans le flux de l'appel) et porte un champ `vu: stade=… vue=… organe=…` qui contient ses étiquettes ; sinon elle sort de `keep.json` (`keep-ecartes.json` ; une sélection d'une version antérieure, sans « vu », sort au premier passage et le choix se refait). Minimum dur : 10 photos, bouton, ouvert, fané, feuille, tige, vues face, trois-quarts, profil |
| coloris | `refs.py auto` sur 3 photos par cultivar A, B ou C, médianes, ΔE ; Haiku pour les mesures douteuses | base, corps, pointe ; colonne marque dans `coloris.md` (nom générique si marque) |
| targets | `fit.py targets` (par `portwrap_p.py`) | au moins 3 mesures ; grappe : 3 mesures de silhouette |
| forme | Opus xhigh : `y-<genre>.js` (ou la fiche existante), pièces de kit, `space.json` ; relais par `etat-forme.md` ; avant lui : `skudump` « avant » et planches « avant » des sortes du kit | fichier, tête inscrite (`SV_HEAD`), `space.json`, construction ; `BONNES-PRATIQUES.md` ouverte dans l'étape |
| fit | `fit.py`, puis Opus xhigh : un regard sur `fit.png`, report de `best` | `fit.json` et `fit.png` |
| plante | Opus xhigh : tige et feuilles, `space-plante.json` ; puis `fit.py` et le regard | idem ; `BONNES-PRATIQUES.md` ouverte |
| finition | Sonnet : matières des coloris | éléments et Ko par tête à DET 1 : mesure seulement |
| comparaison | Python : 8 paires photo/rendu au même angle et au même stade par `img.py pair` (tête de face, trois-quarts, profil ; bouton ; fané .6 et .9 ; plante entière ; gros plan D 800), dans `refcache/<sid>/comparaison/` avec `pairs.md` et `refaire.sh` ; puis Opus xhigh (le modeleur) regarde chaque paire, corrige, refait les paires et écrit le tableau « contrôle 9.2 » en tête de `etat-comparaison.md` ; relais par `model_loop` | toutes les paires présentes (PNG non vides), refaites après la dernière retouche de `app/`, ouvertes par le modeleur ; une ligne par paire (`ok` ou l'écart) ; après un refus du juge : `app/` retouché et tableau réécrit |
| juge | Opus xhigh, appel neuf qui n'est pas le modeleur, lecture seule (Read, Glob, Grep, `python fleur/img.py`) : note chaque paire `ok`/`ko`, de façon adversariale (un doute = ko) ; sortie `{"verdict":"ok"\|"ko","lignes":[...],"ko":[...]}` | `ok` seulement si chaque paire a été ouverte, notée et jugée juste (un juge qui n'a pas jugé est relancé une fois, puis compte ko) ; un `ko` renvoie à comparaison avec `ko-<n>.json`, au plus `--juge-tours` allers-retours, puis REFUS : `comparaison/refus.md`, code 2 ; une sorte refusée le reste tant qu'on ne relance pas `--from comparaison` (ou `--from juge`) |
| temoins | `mkapp.sh` dit « app syntax ok » ; anémone contre `base_v2.png` (ou `base_before.png` avant d227daa) à 0,00 % ; `rtest` des SKU de la sorte et des sortes du kit IDENTIQUE (tulipes témoins pas pires que dans l'atelier principal) ; planches des sortes du kit à 0,00 % contre celles d'avant ; `skudump` après = avant (aucun SKU déplacé) ; budget mesuré | tous |
| qa | `qawatch.sh` par lots de 4, `ramwait.sh` avant chaque lot | flottants, sous le vase, plis : 0 |
| planches | sku et plante (graine 7), copiées dans `catalogue/serre/pilote-printemps/sheets/<sid>-sku-pN.png` et `-plante-pN.png` | refusé si le juge n'a pas accepté la sorte |
La plante reprend `targets.json`. Toutes les planches de pipe.py et des prompts portent `&seed=7`. Aucun commit ni fusion : les planches sont seulement copiées.
pipe.py ne déclare « FINI » qu'une sorte dont toutes les étapes sont faites et que le juge a acceptée.

## Les prompts
`fleur/pipe/prompts/` : `census`, `refs`, `brief`, `coloris`, `forme`, `fit`, `plante`, `finition`, `comparaison`, `juge` (40 lignes au plus chacun,
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
- Paires : la photo entière face à la case du rendu ; `img.py pair` mesure le sujet au centre (photo de jardin chargée : le modeleur refait la paire avec une boîte).
- Planches des sortes du kit : requête sans `cws` (coloris par défaut de la planche), même requête avant et après.
- `fit.json` : seul `best` est compté ; le reste est affiché tel quel.
