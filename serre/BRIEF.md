# La Serre : brief des agents (cloud ou local)

Toutes les commandes se lancent depuis la racine du dépôt.

## Le produit
Belai's Flowers est une boutique de bouquets numériques haut de gamme : une application web mobile en SVG procédural, en JavaScript pur, avec 76 modèles au catalogue, un Composer (le client compose son bouquet) et un Jardin.

« La Serre » reprend chaque espèce, une par une, jusqu'à ce qu'elle soit **absolument parfaite**, au niveau d'une planche botanique :
- botanique juste ;
- tous les coloris vendus dans le commerce, avec leurs vrais motifs (liserés, flammes, barres, cœurs) ;
- toutes les tailles commerciales, à l'échelle réelle (UPC = 6.5 unités par cm) ;
- tous les angles, avec des volumes en 3D ;
- tous les stades : bouton, mi-ouvert, ouvert ;
- plusieurs têtes sur une tige quand l'espèce en porte, ouvertes et fermées ensemble ;
- des tiges et des feuilles organiques, poussées par le L-système 2,5D (`demo/src/l0.js`).

La propriétaire est exigeante : un défaut visible est un échec.

**Niveau de qualité (6 octobre 2026).** Le vase en bronze à la carpe fixe le niveau à atteindre et le procédé à suivre : lire `docs/STANDARD-RENDU.md` avant de reprendre une espèce.

## Règles absolues
- **Ton workspace.** Écris uniquement dans `serre/ws/<ton-nom>/`. Ne modifie jamais `demo/`, `catalogue/`, `serre/*.sh`, `serre/*.py`, ce brief, ni le workspace d'un autre agent.
- **Moteur partagé.** Pour modifier un module moteur (s0.js, l0.js, c4.js, c5.js…) :
  - copie-le dans ton workspace (`cp demo/src/c5.js serre/ws/<nom>/`) et modifie la copie ; le build de ton workspace l'utilise à la place de l'original ;
  - reste minimal et rétro-compatible : les autres espèces ne doivent pas changer ;
  - donne le diff dans ton rapport.
- **Git** :
  - travaille sur une branche `serre/<lot>-<nom>` (par exemple `serre/19-aracees`), créée depuis `main` ;
  - commite tes livrables régulièrement : le fichier du lot, les copies moteur, `sheets/` et `RAPPORT.md`. `pl.html`, `qa13.html` et les captures de travail lourdes n'ont pas leur place dans le commit : ne commite que `sheets/` ;
  - pousse ta branche (`git push -u origin <branche>`) à chaque étape importante et à la fin ;
  - ne pousse jamais sur `main` et ne force jamais un push. Termine les messages de commit par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Données tierces.** Ne télécharge ni ne copie aucune photo dans le dépôt. Les photos de référence de composition ne sont pas dans le dépôt, et ne doivent jamais y entrer. N'envoie aucune donnée personnelle nulle part.
- **Recherche.** WebSearch et WebFetch sont permis pour les faits botaniques et les coloris du commerce : producteurs, grossistes, RHS.
- **Noms globaux.** Plusieurs lots sont développés en même temps et chargés ensemble. Préfixe donc **tous** tes noms de premier niveau (fonctions, `const`, `let`) par un préfixe propre à ton lot, par exemple `l28` ou `gsk` : `const L28_CW=…`, `function l28Pod(…)`. Un `const` déclaré deux fois casse l'application. Une `function` déclarée deux fois remplace silencieusement celle d'un autre lot.
- **Style.** Garde le style du code : lignes denses, commentaires en anglais `/* ---------- espèce (nom latin): ... ---------- */`, en-tête du fichier en français.
- **Esthétique :** pas de grain, pas de glow, pas de fleuriste ; des ombres nettes ; le seul mouvement est la brise (`open(k,t,...)`).

## Outils
- **Installation.** `sh serre/setup.sh` trouve ou installe un Chrome headless (Chromium de Playwright si besoin), puis vérifie qu'une page se construit. Lance-le une fois au début.
- **Build.** `sh serre/build.sh <nom>` construit `serre/ws/<nom>/pl.html` et `qa13.html` depuis `demo/src`, avec ton workspace par-dessus.
  - Tout `.js` de ton workspace qui ne remplace pas un module est chargé juste avant c4.js, donc après tous les lots et toutes les reprises.
  - Le build affiche le résultat de la vérification de syntaxe.
- **Captures.** `sh serre/shot.sh <nom> pl "<query>" fichier.png [W] [H]` écrit l'image dans ton workspace et affiche les erreurs JS de la page.
  - Regarde l'image avec l'outil Read, qui affiche les images.
  - Pour zoomer, recadre avec Python et PIL (`pip install pillow` si besoin).
  - Sur une machine cloud, tu peux lancer 2 rendus en parallèle au plus.
- **Planche** (`pl=`), avec ses paramètres :
  - `pl=<sid>&sec=views,cols,sizes` ;
  - `vw=face,3/4%20gauche,3/4%20droite,profil,dos,plongée,contre-plongée,dressée,dressée%20g` filtre les vues ;
  - `stg=bouton,mi-ouvert,ouvert` filtre les stades ;
  - `col=rrggbb` fixe le coloris des vues ;
  - `cv=f|1|d` donne les coloris en une seule vue : face, 3/4 ou dressée ;
  - `ncol=` fixe le nombre de colonnes, `det=2` le détail des planches, `seed=` la graine ;
  - `fz=a,b` cadre une bande de la hauteur (de 0 à 1 depuis le haut) pour voir un détail de près.
- **Cartes du Composer :** `sh serre/shot.sh <nom> pl "cards=sid1,sid2&k=4&cols=8" cartes.png 1600 900`.
- **Bouquets composés.** Cette capture montre les bouquets avec leurs défauts cerclés :
  - `sh serre/shot.sh <nom> qa13 "run=composed&n=8&seed=3&inc=sid1,sid2&keep=1&all=1&cols=4" b.png 1600 1700`.
- **QA automatique** :
  - `sh serre/run.sh <nom> "run=composed&n=20&seed=5&inc=sid1,sid2,..." c1.json`, puis `python3 serre/qasum.py serre/ws/<nom>/c1.json` ;
  - le résumé donne F (pièces flottantes), U (fleur sous la lèvre du vase) et KINKS (tige cassée) ;
  - l'objectif est **0 partout**.
- **Modèles du catalogue.** `python3 serre/models_of.py sid1,sid2` donne `ns=…`. Lance ensuite `sh serre/run.sh <nom> "run=models&ns=<liste>" m1.json` (par lots d'environ 10 modèles).
- **Debug d'une plante L-système :** `sh serre/run.sh <nom> "lsdbg=<sid>" d.json pl`.
- **Perf** (pour le lot qui touche le moteur) : `sh serre/run.sh <nom> "perf=1" perf.json` donne le temps moyen et les éléments par bouquet sur les 76 modèles. La référence est d'environ 142 ms et 10 150 éléments. Une tête doit rester sous environ 100 à 150 éléments SVG au détail de l'appli (DET 1).

## Le moteur (à lire avant de coder)
- **`demo/src/l0.js`** (13 Ko, à lire en entier) : le L-système.
  - `lsDerive` et `lsTurtle` (tortue 3D : tropisme, `aim`, `wig`, branches, organes).
  - `lsPlant` (l'axe principal est coupé à la fleur principale : dessous, il part dans la couche des tiges du bouquet via `EXT`) et `lsNeck`.
  - `lsHeadS` : une tige à une fleur, avec nœuds, feuilles, rameaux latéraux en bouton ou jeune fleur, et mode `rim`.
  - Feuilles : `lsLeafParts` (3D) et `lsLeaf2D`.
  - `lsAsFlower` et `GH_BUDS`.
- **Lots à imiter :**
  - `demo/src/s13a.js` : pois de senteur (grappe faite main), lisianthus, clématite, chrysanthèmes avec `mumLeaf` ;
  - `s12a.js` (pivoines), `s10a.js` (marguerites : `capDisc`, `capBracts`, `capBud`), `s11a.js` (renoncules).
- **Reprises :**
  - `r1a.js` à `r4a.js` (dahlias, roses, œillets, hortensias, gloriosa, lis, ombelles `umbelPlant`, orchidées `orchidPlant`, anthurium, arum) ;
  - `s8a.js` : le moteur des épis, dessinés le long d'une épine (`o.spine`) et qui renvoient `{k,bw,bc}`.
- **`demo/src/s0.js`** (le moteur 3D). Liste ses fonctions avec `grep -o "function [A-Za-z0-9_]*" demo/src/s0.js` :
  - `frameOf` et `neckPart`/`neckOut` ;
  - `sheet3` et `tube3` ;
  - `ligule` (dans s5a.js) et `drawLig` (dans s7a.js) ;
  - `prof`, `pal7`, `shd`/`mix`/`lt`, `PJ`, `drawParts` ;
  - registres `CWS`, `SZG`, `GH`, `GHI`, `STEML` ;
  - feuilles `pinnateLeaf` et `palmLeaf` (dans s8a.js).
- **Composer et bouquets :**
  - `c4.js` : rôles, épines, `GHI`, `pickStage` ;
  - `c5.js` : tiges, cols, lien, contrôle du bord du vase.
- **Données :**
  - `k0.js` contient `RECIPES` (une recette par espèce) et `MODELS` (76 modèles) ;
  - `k1.js` crée un produit du Composer par coloris de `CWS[sid]`.
- **Anciennes versions.** Pour retrouver celle d'une espèce : `grep -n "<sid>" demo/src/*.js`.
- **L'ordre de chargement** est donné par `demo/src/build.sh`.

## Brancher une espèce
Le fichier du lot est dans ton workspace (par exemple `serre/ws/<nom>/s19a.js`). Il contient :
- **Le dessin.** `GH['<sid>']=(g,t,o)=>…` dessine la plante.
  - `o` contient : `col`, `cw`, `op` (0 à 1), `cm`, `ax`, `up` et `reach` (dans un bouquet), `rim`, `spine` (épines du Composer)…
  - La fonction renvoie le col : `lsNeck(...)`, la valeur de `lsHeadS`, ou `neckOut(...)`. Pour une espèce sur épine, elle renvoie `{k,bw,bc}`.
- **Les registres :**
  - `CWS['<sid>']` = coloris avec leurs noms du commerce en français ;
  - `SZG['<sid>']` = tailles commerciales en cm ;
  - `GHI['<sid>']` = infos pour le Composer (cherche « GHI » dans c4.js et c5.js) ;
  - `GH_BUDS.add('<sid>')` si l'espèce se vend en bouton ;
  - `STEML` si besoin.

## Protocole de vérification (obligatoire)
1. **Botanique.** Note dans le rapport la morphologie, les coloris vendus et les tailles commerciales.
2. **Planche par espèce, regardée en grand et zoomée :**
   - 9 vues × 3 stades ;
   - tous les coloris ;
   - 3 tailles.
   Corrige jusqu'à la perfection : pas de pétale qui traverse, d'ordre de dessin faux, de pièce flottante, de tige cassée, ni de feuille plate de profil.
3. **Cartes du Composer.**
4. **QA des bouquets composés** avec `inc=` (au moins 3 graines × 20) : 0 F, 0 U et 0 kink. Regarde au moins 2 captures de bouquets.
5. **QA des modèles** qui utilisent tes espèces : 0 partout.
6. **Perf** dans le budget.

## Livrables (dans ton workspace, commités et poussés sur ta branche)
- Le fichier du lot (`.js`), plus les copies moteur modifiées s'il y en a.
- `sheets/` :
  - `<sid>_vues.png` (`sec=views&vw=face,3/4%20gauche,profil,dos&ncol=4`, 1100×900) ;
  - `<sid>_coloris.png` (`sec=cols&cv=f&ncol=8`, 1500×1000) ;
  - `cartes_composer.png` ;
  - `bouquets.png` (`run=composed&n=4&seed=…&inc=…&keep=1&all=1&cols=4`, 1500×560).
- `RAPPORT.md`, court, en français :
  - par espèce : ce qui est fait, les notes botaniques, les coloris et les tailles ;
  - la QA et la perf ;
  - les diffs moteur s'il y en a ;
  - les doutes.
- **Message final.** Ton dernier message tient en 10 lignes au plus : la branche poussée, le dernier commit et l'essentiel.
