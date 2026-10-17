# Passation de la vague 3 : refaire les fleurs du catalogue, session neuve

Écrit le 17 octobre 2026 par la session qui a mené les lots 1 à 3 de la vague 3. La session neuve reprend d'ici ; elle n'a pas
besoin de relire l'ancienne. **Décision du porteur (17 octobre, soir)** : finir les chantiers en cours, puis passer sur une
session neuve « mieux organisée, plus sévère, pour la meilleure qualité possible », sans chefs de chantier, avec `pipe.py`.

## 1. Ce que veut le porteur

- **Refaire les sortes du catalogue au niveau de l'anémone** (docs/STANDARD-RENDU.md 4 bis et 4 ter) : fleur, tige, feuilles,
  boutons quand la sorte en a, fané, **tous les coloris**.
- **La qualité d'abord.** Les bouquets se vendent au prix des vraies fleurs : chaque fleur doit être magnifique. « Le poids je
  m'en fiche, le SVG est léger, je veux surtout la meilleure qualité possible. » Sur les orchidées v1 : « c'est bien, mais pas
  aussi bien que d'habitude : resserre la vis sur le contrôle qualité. » Le budget en éléments et en Ko n'est qu'une mesure.
- **Ordre** : les sortes les plus utilisées dans les 76 recettes (`catalogue/recettes/bouquets_*.json`, compte des `els[].id`),
  en groupant celles d'une même pièce du kit. « Enchaîner pour finir le plus de fleurs possibles, en parallélisant autant que
  possible. »
- **Coloris** : validés jusqu'au niveau C. « Tant qu'il y a des photos et que le coloris est référencé, ça suffit ; le but, c'est
  d'avoir de belles variétés de couleurs et de motifs. » Pas de recherche C → B ; seuls les D sont des questions. Dans les ajouts
  `late:N`, privilégier la variété des couleurs et des motifs (bicolores, bordés, striés, tachetés, veinés, dégradés).
- **Quota** : 80 % de la semaine au plus, le porteur garde 20 % pour un autre projet. Le relever à chaque jalon dans
  `fleur/quota.csv`. Coût mesuré de la vague 3 : 6 à 26 M d'équivalent entrée Opus par sorte (environ 1,75 % du quota).
- **Opus modeleur en effort `xhigh`** (agent `fleur-modeleur`, et pipe v3).

## 2. Règles permanentes

- SVG natif seulement : 3D interdite, aucune image incorporée. Pétales organiques, opaques, sans faux chevauchements.
- Une tige coupée en vase : jamais de bulbe, de racine ni de terre. Ni ruban ni nœud.
- Formes, couleurs, tige, feuilles, boutons et fané d'après des photos, jamais d'imagination. N'invente jamais une source.
- Marques : un nom enregistré dans un registre (N1) est libre ; sinon un nom de couleur générique, ou `ret:1`. Les SKU ne se
  renumérotent jamais. Les coloris nouveaux vont en fin, vague `late:N` (N = maximum dans main + 1 au moment de publier).
- Photos de tiers : jamais commitées ni publiées, elles restent dans `refcache/`.
- Sous-agents et appels de pipe.py : aucun navigateur, aucun compte, aucun formulaire. KAVB seulement depuis la session principale,
  en lecture (`fleur/kavb.py`). Cookies non essentiels refusés. Jamais l'adresse e-mail du porteur envoyée à un service.
- Vocabulaire du jeu, aucun secret, jamais le port 8766. Ne jamais tuer un processus qu'on n'a pas lancé.
- Commits : chemins exacts (jamais `git add -A` ni `git add .`), message en français terminé par
  « Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> ». Ne jamais lancer `build_app_data.py`, ne jamais régénérer `k0.js`,
  ne jamais lancer `sync_demo.sh` tel quel : l'atelier principal porte des modifications non commitées de la session des vases
  (`app/c4.js`, `v0.js`, `v1*.js`, `revue-vases/`, `vases5/`) qui ne sont pas à nous.
- Ne pas modifier STANDARD-RENDU.md ni STANDARD-SOURCES.md. Pousser main sur GitHub : seulement sur accord du porteur (question
  posée, sans réponse au 17 octobre ; main est en avance sur origin).
- Une décision qui n'est pas la nôtre s'écrit comme une question, et le travail continue.

## 3. Le PC (il a planté le 17 octobre à 18 h 25)

Plantage avec 4 chantiers en parallèle (RAM libre entre 2 et 2,5 Go juste avant). Depuis :
- **3 sortes au plus en parallèle**, 2 sous-agents à la fois au plus par sorte, un seul rendu lourd (planche de plus de 30 têtes,
  bouquet, QA) à la fois par sorte, QA par lots de 4 bouquets.
- `sh fleur/res/ramwait.sh` avant chaque modelage et chaque rendu lourd : il attend 4,5 Go libres. Ne jamais lancer une sorte
  sous 4,5 Go (le plantage a suivi un lancement à 4,1 Go).
- Rendus seulement par `ws/gate.sh` (3 Chrome headless au plus).

**Services à tenir allumés** (et à relancer après un plantage) :
- serveur de l'atelier sur **8805** : `preview_start` avec la configuration `atelier-8805` de `Desktop/flower/.claude/launch.json`.
  Le port 8765 sert une autre application du porteur (Rune Radar) : n'y touche pas. `fleur/shot.sh`, `skudump.sh`,
  `offerdump.sh` et `chantier.sh` visent encore 8765 ; les modifier a été refusé par le garde-fou : on utilise des copies
  privées (`sed s/8765/8805/`, par exemple `fleur/shot_p.sh` dans la copie de chantier). Question au porteur : corriger les
  scripts communs.
- `python bronze/recv.py` (port 8781), en tâche de fond.
- relevé de charge : `powershell -NoProfile -ExecutionPolicy Bypass -File fleur/res.ps1 <atelier>/fleur/res/vague3.csv 15`
  (heures en UTC), lu par ramwait.sh.
- Après un plantage, vider aussi `ws/locks/slot*` et les verrous `ws/locks/pipe-*` périmés ; `fleur/bills.json` a été corrompu
  (octets nuls) au plantage : vérifier qu'il se lit en JSON.

## 4. La nouvelle organisation

Mesures de la vague 3 (factures `fleur/bills.json`, `catalogue/serre/methode/factures/vague3.md`) : le modelage fait 47 à 57 % du
coût, la recherche 8 à 37 %, et l'orchestrateur 13 à 60 % (son contexte de 500 000 tokens relu à chaque tour). Les chefs Sonnet
ajoutaient peu de jugement : dépassements de sous-agents, relais, comptes rendus trop tôt. Et le contrôle de qualité arrivait trop
tard : les défauts n'étaient vus qu'à la relecture des gros plans par l'orchestrateur, d'où des retouches en chaîne.

**Désormais :**
1. **L'orchestrateur reste léger.** Il choisit les sortes, lance `pipe.py`, relit les planches finales et publie. Il ne relit pas
   les fichiers de travail ni les journaux des appels ; il regarde les images en copie allégée (`python fleur/img.py small`,
   `zoom`) plutôt qu'en pleine taille. Il passe la main à une session neuve dès que son contexte dépasse environ 250 000 tokens,
   en mettant à jour ce fichier (section 7).
2. **`pipe.py` à la place des chefs** (`fleur/PIPE.md`) : chaque étape est un `claude -p` neuf à contexte vide, les contrôles
   entre étapes sont chiffrés en Python. **pipe v3** (fusionné dans main le 17 octobre, 5f52e8e ; selftest 80/80, jamais encore lancé sur une vraie sorte : surveiller la
   première) ajoute :
   Opus en `xhigh` ; port 8805 et copie privée de shot.sh ; recensement allégé (A, B ou C par SKU ; D, introuvable ou sous marque en question, nom générique) ; photos choisies par Sonnet ; choix des
   photos en les regardant (champ « vu ») ; bonnes pratiques citées dès la v1 ; `--kit` et `--late` ; et deux étapes de sévérité :
   - **comparaison** : paires photo/rendu au même angle et au même stade (face, 3/4, profil, bouton, fané, plante entière, gros
     plan D 800 d'une tête ouverte) dans `refcache/<sid>/comparaison/` ; le modeleur corrige jusqu'à ce que chaque ligne du
     tableau « contrôle 9.2 » soit `ok` ;
   - **juge** : un Opus neuf, qui n'est pas le modeleur, en lecture seule, note chaque paire de façon adversariale (« un doute =
     ko ») ; un ko renvoie à la comparaison, deux allers-retours au plus, puis la sorte s'arrête en question. pipe.py ne déclare
     jamais « fini » une sorte refusée par le juge.
3. **L'orchestrateur est le dernier juge.** Il refuse toute sorte sans planches de comparaison, et regarde lui-même les gros
   plans D 800 (tête ouverte de face, profil, fané, un blanc, un bicolore) avant de publier. Liste des défauts déjà vus, à
   chercher à chaque fois (BONNES-PRATIQUES.md) :
   - pétales transparents, contours ou lavis du dessous visibles à travers, surtout sur les blancs (rose lot 1) ;
   - matière plate « papier découpé », sans lumière ni volume par pièce (dahlia, chrysanthème, 3.10) ;
   - profil illisible : pomme de pin, papillon, table (dahlia, anthurium) ; arum trop plat ;
   - fané où la tige traverse la tête, fané en « sac » ou en tache plate (rose, chrysanthème) ;
   - traits de bordure et de nervure grossiers, ou qui flottent hors de leur pièce (3.6b, critique du porteur sur la rose de
     jardin : traits fins dans la teinte assombrie du pétale, découpés à leur pièce) ;
   - lignes en « X » ou éclats dans un cœur à quartiers (roses de jardin) ;
   - couleurs ternes et dessin pauvre face à la photo (phalaenopsis, porteur : « très terne et pauvre face aux vraies
     fleurs », 4.8b) ;
   - fleurs d'une même hampe ou grappe toutes de face (phalaenopsis : « pas très crédible », 8.1b) ;
   - fleurons épais, mous, cernés au lieu de fins et légers (hortensia, porteur, 4.8c) ;
   - feuille plate, schématique, nervures en traits droits (amarante, porteur : « bien trop mauvaise qualité ») : une feuille
     se courbe, se gaufre, a des nervures en creux et des reflets (section 7) ;
   - colonne, labelle et veines absents ou génériques (orchidées : « jupe » au lieu d'un labelle trilobé).
4. **La recherche hors des modèles chers** : recensement et photos en Haiku, ou par Codex si le porteur le décide (question posée,
   sans réponse). Une **bibliothèque de références par genre** (photos d'organes triées : face, profil, bouton, fané, feuille,
   tige) se constitue une fois et sert à toutes les sortes du genre. Pl@ntNet : inutile pour les cultivars et le fané ; il ne
   servirait qu'à vérifier l'espèce d'une photo, et il faut une clé à un compte au nom du porteur (sa décision).

## 5. Publier une sorte finie

`sh fleur/orch/publier.sh prep <chantier> <tag> "<rc>" "<modules>"`, relire les témoins, écrire `PLAN.md` et
`factures/vague3.md` dans `ws/pub-apres`, puis `sh fleur/orch/publier.sh fin "<message>"`. Le script :
- prend le verrou `ws/locks/publier` ;
- fait les copies propres `ws/pub-avant` (main) et `ws/pub-apres` (main + chantier, en `--no-ff`), garde les deux côtés des
  conflits de `REFERENCES.md` ;
- relève les SKU avant ;
- lance `fleur/orch/temoins.sh` : SKU déplacés, anémone contre `fleur/out/base_v2.png`, rtest tulipes et renoncules avant/après ;
- compare le rtest des sortes avant/après ;
- copie les modules nommés vers `demo/src` (`fleur/orch/pub.sh`) et reconstruit `demo/index.html`.
`fin` committe dans `ws/pub-apres`, avance main par `git merge --ff-only`, retire les copies et rend le verrou. `abandon` défait
tout sans toucher main.

**Témoins obligatoires, tous verts avant `fin`** : 0 SKU déplacé, anémone à 0,00 %, rtest des tulipes et renoncules identique
avant/après, rtest des sortes et de leurs voisines identique avant/après. Pour garder le rtest, la tête neuve se pose dans la boîte
de l'ancien dessin (`svSpdKeepBox` et `svSpdFitPlant` de `app/y3-spathe.js`). Le rc des sortes : leurs SKU et quelques voisines,
par exemple `"anthurium-andraeanum~0:6,arum-calla~0:6,rose-standard~0:4,gerbera~0:4"`.

Avant `prep`, committer le chantier sur sa branche `ch/<nom>` (chemins exacts : modules `app/`, `pilote/svtest.js`, planches
et `REFERENCES.md` de `catalogue/serre/pilote-printemps/`, `catalogue/serre/sources/<sid>-coloris.json`). Les planches publiées
ne contiennent que nos rendus, jamais une photo de tiers (les planches de comparaison restent dans refcache).

## 6. Ce qui est fait (vague 3, 17 octobre)

Publié dans main (non poussé), témoins verts à chaque fois :

| Lot | Sortes (coloris) | late | SKU ajoutés | Commit | Pièces |
|---|---|---|---|---|---|
| 1 | rose-standard 30, rose-intermediaire-kenya 15, gerbera 26, germini 22 | 8 | 3844-3857 | d23e361 | y3-rose.js, y3-capitule.js |
| 2 | dahlia-decoratif 23, chrysantheme-disbud 17 | 9 | 3858-3865 | df68e68 | y3-capitule.js (`lit`) |
| 2 | rose-aspect-jardin 28, rose-de-jardin 27 | 10 | 3866-3873 | 84b0cb9 | y3-rose2.js, y3-rose3.js |
| 3 | anthurium-andraeanum 15, arum-calla 19 | 11 | 3874-3876 | ecba018 | y3-spathe.js |

Avant la vague 3, le pilote de printemps avait refait les 22 espèces du bouquet bronze (anémone, tulipes, narcisses, renoncules,
jacinthe, muscari, lilas, glycine, freesia, iris, cerisier, cognassier, forsythia, pois de senteur, fritillaire, viorne,
alchémille) : `catalogue/serre/pilote-printemps/sheets/`.

**Finitions dues** (à faire passer par l'étape comparaison et le juge) : traits du fané de la rose standard blanche (3.6b) ;
« nœud papillon » de la tête seule fanée de profil des roses de jardin ; facettes du fané du dahlia ; boutons précoces de l'arum
(.06 et .2 un peu larges) ; anthurium au stade .4 et profil ouvert en bande.

## 7. Au moment de la bascule (à remplir quand les trois chantiers en cours sont finis)

Chantiers en cours au 17 octobre, 20 h :
- **orchidées** (`ch/orchidees`) : phalaenopsis et cymbidium-grandes-fleurs, passe de finition (colonne, labelle trilobé, veines,
  pédicelles de la hampe, sépales cireux éclairés, fleurs plus grandes au bouquet modèle 12) avec planches de comparaison. À
  publier ensemble ; renuméroter leur `late` au maximum de main + 1. Noms corrigés d'après les photos : phalaenopsis 1414, 1415,
  1417, 1418, 1419, 1420 ; cymbidium 1426, 1428, 1432, 1436.
- **hortensia** (`ch/hortensia`) : hortensia-boule (demandé par le porteur : « super hâte de voir la boule refaite »).
- **amarante** (`ch/amarante`) : amarante-retombante (SKU 2172-2183), pièce `y3-chenille.js` ; puis amarante-dressee (2184-2198).

État à la bascule : _à remplir_.

## 8. La suite, dans l'ordre

Usage dans les recettes, sortes pas encore refaites (regroupées par pièce probable) :
1. **gloriosa** 18 ;
2. **œillet-standard** 14 (avec giroflee-matthiole 6 ?) ;
3. **lis** : nerine 14, lis-oriental 10, lis-asiatique-la 9, lis-oriental-double 7, lis-tigre 6 (une pièce `y3-lis`) ;
4. **delphinium** 12 (grappe) ;
5. **capitules simples** : scabieuse 11, cosmos 8, chrysantheme-araignee 6 (pièce `y3-capitule.js`) ;
6. **oncidium** 10 (pièce des orchidées) ; anthurium-obake 5 (pièce `y3-spathe.js`, lance) ;
7. lisianthus 10, pensee 9, pivoine-herbacee-double 7, clematite 7, celosie-crete-de-coq 5 ;
8. feuillages et tiges : eucalyptus-stabilise 8, ail-serpent 8, allium-petit 7, asparagus-setaceus-plumosus 7,
   saule-tortueux 6, leucadendron-rouges 6.

`ruban-soie-mousseline` (7 recettes) est un ruban : la règle « ni ruban ni nœud » l'exclut. Question au porteur : le retirer des
recettes ?

## 9. Questions ouvertes au porteur

- Pousser main sur GitHub.
- Codex pour les briefs de recherche (gloriosa, nérine, œillet, delphinium).
- Corriger le port 8765 en dur des scripts communs.
- Coloris : 1054 chrysanthème bleu teinté (garder ou retirer) ; 703 Bridezilla (nymphéa chez l'obtenteur) ; 711 « lilas
  lavande » ; roses de jardin 88 et 89 (D) ; doublons 57/58 et 68/69 ; couleurs du catalogue corrigées par les photos (gerbera
  1001, 1012, 1014). Le détail est dans `factures/vague3.md`.
- Ruban de soie dans les recettes (section 8).

## 10. Où lire

- `catalogue/serre/methode/BONNES-PRATIQUES.md` : les règles vérifiables, obligatoires dès la v1 (§9 : contrôle avant compte rendu).
- `fleur/PIPE.md` : pipe.py ; `fleur/KIT.md` : les pièces ; `fleur/orch/brief-chefs.md` : les consignes des chefs de la vague 3.
- `catalogue/serre/pilote-printemps/PLAN.md` (section Vague 3), `catalogue/serre/methode/factures/vague3.md`,
  `catalogue/serre/methode/vague3-points.md`.
- Agents : `~/.claude/agents/fleur-*.md` (modeleur en opus `xhigh`).

## 11. Pour démarrer la session neuve

Ouvrir une session dans `C:/Users/agent/Desktop/flower/flower-atelier` et lui donner :

> Lis `catalogue/serre/methode/PASSATION-VAGUE3.md` et applique-le. Tu es l'orchestrateur léger de la vague 3 : vérifie les
> services (section 3), puis lance les sortes de la section 8 avec `pipe.py`, trois au
> plus. Sois sévère : rien n'est publié sans planches de comparaison, verdict ok du juge et ta propre relecture des gros plans.
