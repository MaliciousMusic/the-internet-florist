# Rapport du chantier outils-v4 (18 octobre 2026)

Branche `ch/outils-v4`, huit améliorations atomiques tirées de l'audit V4 (`catalogue/serre/methode/audit-v4/notes-processus.md`,
§4 et §5), un commit chacune. `python fleur/pipe.py selftest` : **80/80 au départ, 95/95 à la fin** (15 cas ajoutés). Aucun modèle
appelé, aucun `pipe.py run`, `publier.sh` jamais lancé. Trois rendus en tout, un à la fois, chacun après `ramwait.sh`, par la porte.

| # | Ce qui change | Contrôle | Fichiers |
|---|---|---|---|
| 1 | Vues des paires de tête par famille : table `VIEWS_FAMILY` (orchidées et spathes : profil et bouton en vue 8), famille lue dans `--family`, le module `--kit` (`y3-orchidee.js`), puis le genre ; surcharge `--views "profil:8,bouton:8"` gardée dans `pipe-state.json` ; `view` et `view_from` écrits dans `pairs.json` | selftest : tulipe vue 7, cymbidium (kit) vue 8 pour profil et bouton, phalaenopsis par le genre, `--views` d'une sorte prioritaire | `fleur/pipe.py`, `fleur/PIPE.md` (8ae37c1) |
| 2 | `img.py pair --w` (plafond de largeur, 900 par défaut) ; `refaire.sh` passe `--h 1100 --w 2400` | même paire (rendu D 800 et une découpe de ce rendu, rien de tiers) : avant 862 x 420 ; sans option après la modification 862 x 420, diff 0,00 % ; avec les options 2 246 x 1 100 ; selftest | `fleur/img.py`, `fleur/pipe.py`, `fleur/PIPE.md` (7ef45ae) |
| 3 | `img.py pair` lit les fourchettes dans un bloc ```` ```fourchettes ```` (JSON) du `brief.md` de la sorte (`--brief`, ou trouvé à côté de la photo `refcache/<sid>/`) ; sinon « pas de fourchette (raison) » ; `tulipe-simple` garde ses lignes ; `refaire.sh` passe `--brief` ; le prompt `brief` demande le bloc | tulipe : mêmes trois lignes qu'avant (bouton, coupe .6, coupe .85) ; rose sans bloc : « pas de fourchette » ; brief à bloc : ses valeurs, et « pas de cup.6 » quand la clé manque | `fleur/img.py`, `fleur/pipe.py`, `fleur/pipe/prompts/brief.md` (24257bf) |
| 4 | Empreinte sha1 des `app/*.js` et de `pilote/svtest.js` gardée (`juge.fp`) au `ok` du juge ; `planches` et le message FINI la recontrôlent (sinon « NOT FINISHED », code 2), aussi quand toutes les étapes sont déjà faites | 2 cas selftest : empreinte gardée et valable au `ok` ; `app/` retouché après : `planches` refuse et `fini()` dit NOT FINISHED | `fleur/pipe.py`, `fleur/PIPE.md` (2ba6b87) |
| 5 | `fleur/orch/verdict.py` : `ecrire` juge chaque témoin et écrit `fleur/res/temoins-verdict.json` ; `controler` pour `publier.sh fin` (vert, même étiquette, écrit après `prep`, ligne des compositions présente). `temoins.sh` efface d'abord ses anciennes sorties (un rendu manqué = rouge), garde la ligne de l'anémone dans `anem-<tag>.txt` et finit par le verdict ; `publier.sh prep` le réécrit avec `--own` ; `fin` refuse avant tout commit | fichiers réels v3or de `fleur/res` + anémone 0,00 % : 5 lignes VERT ; sans fichier anémone : ROUGE ; cas rouge fabriqué (un SKU déplacé, anémone 0,35 %, une ligne rtest DIFFERENT, une tulipe pire) : 4 lignes ROUGE, code 1 ; `controler` refuse aussi une autre étiquette, un verdict d'avant `prep`, un fichier absent ; `sh -n` des deux scripts | `fleur/orch/verdict.py`, `temoins.sh`, `publier.sh` (3fa3f03) |
| 6 | Juge : `--max-turns` 60 (`JUGE_TURNS`) ; sans Read de `BONNES-PRATIQUES.md` il n'a pas jugé (relancé une fois, puis ko) ; lire `etat-comparaison.md` avant la dernière paire = ancrage, ko (ordre des Read du flux) ; prompt `juge.md` : tableau APRÈS ses verdicts (il ajoute des ko, n'en retire pas), Read groupés | 4 cas selftest : sans BONNES-PRATIQUES ko ; tableau lu d'abord ko ; ordre juste ok ; appel à 60 tours et prompt dans le bon ordre | `fleur/pipe.py`, `fleur/pipe/prompts/juge.md`, `fleur/PIPE.md` (83d75b8) |
| 7 | Paires `cw-*` : noms de coloris normalisés comparés à l'égalité (id et cultivar), aussi pour la photo du premier coloris ; un coloris sans photo à lui va dans `questions.md` (« Coloris sans paire ») ; clé `cw-` tronquée sans tiret final (4.2-9) | 3 cas selftest : « rose » ne prend pas la photo de « rose-vif » ; question écrite ; clé tronquée retrouvée | `fleur/pipe.py`, `fleur/PIPE.md` (c2bab22) |
| 8 | `pilote/svtest.js` : drapeau `axes=1` de la planche `grid` ; `svDraw` enveloppé seulement avec le drapeau (app/ non touché) ; sur chaque pièce `svSheet` : nervure u=0 (point à la base), sens +u à v=.5 (point au bout), normale de la face interne au centre (tirets) ; une couleur par verticille (`tag` w<n>, sinon `zb`, sinon l'indice), mandataires des parties dessinées en gris tireté | `grid=1&sid=cymbidium-grandes-fleurs&st=.85:0&view=2&D=500&seed=3` : avec `axes=1` 703 éléments (`fleur/out/ov4_cymb_axes.png`), sans 647 (`ov4_cymb_noaxes.png`) ; sans drapeau, PNG identique à l'octet à celui de l'atelier principal (`ov4_cymb_main.png`, `img.py diff` 0,00 %) | `pilote/svtest.js`, `fleur/KIT.md` (27131a8) |

Les PNG des rendus sont dans `ch/outils-v4/fleur/out/` (non committés ; celui de l'atelier principal y a été déplacé pour ne rien
laisser dans `fleur/out/` du principal).

## Constat en chemin

- **`mkapp.sh` dépend de la locale** : `$(ls y3-*.js)` range `y3-plante-nar.js` avant `y3-plante.js` en locale C (Git Bash par
  défaut), après en `en_US`. Le `demo7.html` de l'atelier principal est dans l'ordre `en_US`, celui de cette copie était dans l'ordre C
  (même taille, octets différents). Pour comparer à l'octet, j'ai reconstruit la copie avec `LC_ALL=en_US.UTF-8 sh mkapp.sh` (alors
  identique au principal). `mkapp.sh` n'est pas modifié.

## Questions (décisions qui ne sont pas les miennes)

1. **Ordre de `mkapp.sh`** : fixer la locale dans le script ? Proposition : `LC_ALL=C` devant les `ls`, puis vérifier une fois que les
   témoins (anémone, rtest) ne bougent pas, car l'ordre de `y3-plante*.js` change pour le principal.
2. **Gros plan D 800 à 1 100 px** : la case D 800 fait 920 px, elle est donc agrandie 1,2 fois (pas 1:1) ; plus de tokens par image
   (audit Q1). Proposition : garder 1 100 pour toutes les paires, ou rendre le gros plan à D 950 pour rester 1:1.
3. **Bouton des spathes en vue 8** : la table met profil ET bouton en vue 8 pour les spathes comme pour les orchidées ; les journaux
   ne parlent que du profil de l'anthurium. Proposition : une planche `grid` vues 0, 2, 7, 8 d'un anthurium au stade bouton avant le
   premier passage.
4. **Juge qui n'a pas pu juger** (4.2-7, reste) : son ko renvoie toujours à `comparaison`, qui exige une retouche de `app/`.
   Proposition : un ko fait seulement de « le juge n'a pas pu juger » relance le juge sans exiger de retouche.
