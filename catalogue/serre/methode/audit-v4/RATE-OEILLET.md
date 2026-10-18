# Le raté de l'œillet standard : où sont partis 5 h et 7 % de la semaine

2026-10-18. Écrit par l'orchestrateur après l'arrêt du pipe, sur les chiffres de `ch/oeillet/refcache/pipe-run.log`.

**Objectif du porteur** : une fleur complète (tête, tige, feuillage, bouton, fané, tous ses coloris) pour **8 M de crédit**,
soit 1 % du crédit hebdomadaire.

**Résultat** : 7 % de la semaine (de 77 à 84 %) et environ 5 h, pour une tête seulement. Elle avait des trous, que le porteur a
vus en dix secondes. Le fané était faux. Ni la tige, ni le feuillage, ni la finition, ni le juge n'ont abouti.

## 1. Les chiffres

Ce que le pipe a mesuré (unité : M eq-Opus, la mesure de `pipe.py`) :

| Étape | Appels | Coût | Durée | Arrêts sur la limite de tours | Produit |
|---|---|---|---|---|---|
| recensement, photos, coloris, fiche | 8 | 0,41 M | 15 min | 0 | oui : 23 photos, 5 coloris mesurés, fiche de 144 valeurs |
| **forme (tête)** | **19** | **16,08 M** | **187 min** | **15** | une tête en 90 tours, trous compris |
| fit (réglage chiffré) | 1 | 0,13 M | 3 min | 0 | oui : coût 51 → 19 |
| plante (tige, feuilles) | 2 | 2,16 M | 11 min | 2 | **rien** : l'état n'a jamais été mis à jour |
| **total du pipe** | 30 | **18,75 M** | 216 min | 17 | |

Le reste des 7 % ne passe pas par le pipe : environ 35 M, à la louche. Il se partage entre deux postes :
- l'audit V4 de la nuit : notes, chantiers matière, nœuds et outils ;
- la session d'orchestration : un long contexte, une compaction, des rendus et des relectures pendant le run.

Ce poste-là n'a pas de compteur : c'est un trou de mesure à lui seul (point 6).

Les étapes peu chères (Haiku/Sonnet, et du script pour le reste) ont tenu leur budget : 0,4 M pour toute la documentation de la
fleur. **85 % de la dépense du pipe est la forme.**

## 2. Les causes, de la plus chère à la moins chère

1. **La forme a tourné sans plafond utile.** J'ai lancé le run avec `--cap 40`, cinq fois l'objectif. Le pipe a enchaîné
   5 séries de 4 relais Opus en effort *xhigh*. 15 relais sur 19 se sont arrêtés sur la limite de 61 tours, et chacun repartait
   en relisant 100 à 250 k de contexte. Un relais coûte 0,5 à 1,7 M. Rien n'arrêtait la dépense avant 40 M.
2. **Quatre séries sur cinq ont échoué sur la tenue des comptes, pas sur le dessin. Coût : environ 12 M.** Le contrôle de
   sortie exigeait trois choses :
   - une paire de face ;
   - un rtest ;
   - une fiche dont chaque valeur `retenu` égale la constante du code, à sa ligne.

   À chaque retouche, le code bougeait : la ligne changeait, la valeur aussi. Le contrôle tombait, et le pipe relançait 4 relais
   Opus pour refaire de la comptabilité. La correction est venue tard : la clôture faite par le pipe (0fba893), puis la
   recherche à ±60 lignes. Et elle reste incomplète : un écart `retenu` ≠ code bloque encore au lieu d'être recopié.
3. **90 tours de polissage, aucune mesure des défauts grossiers.** Le modèle jugeait sur des rendus regardés à l'œil : coûteux
   en lecture d'images et aveugle aux trous de quelques pixels à D 110. Aucun contrôle chiffré ne comptait les trous, la
   silhouette face à la photo ni la taille du fané. Le juge (Opus, anti-ancrage) passe après la forme : il n'a donc jamais
   tourné. Ce que le porteur a vu tout de suite, 16 M de relais ne l'avaient pas vu.

   Le compteur de trous écrit ce matin (fond vert, pixels de fond qui ne touchent pas le bord) a trouvé et confirmé la
   correction en 3 rendus, sans un seul appel de modèle.
4. **La forme faisait le travail de la finition, au prix d'Opus.** Ses relais ont réglé les flammes de la picotee et
   d'antigua, l'ombre des blancs et 26 coloris. Ce travail est prévu pour Sonnet à l'étape finition. Et ils ont tout créé de
   zéro :
   - un module de genre (237 lignes denses) ;
   - un kit de franges ;
   - des crochets dans le kit des roses.

   Un parent existant (la rosette, l'ancien œillet) aurait servi de point de départ.
5. **L'étape plante a répété le même schéma.** Deux relais Opus, 2,2 M, tous deux arrêtés sur la limite de tours sans écrire
   leur état. Or la tige et les feuilles se font avec des pièces du kit (`svStemLine`, nœuds V4) : un travail de Sonnet.
6. **L'orchestrateur, c'est-à-dire moi, n'a pas de compteur.** J'ai réparé l'outillage pendant le run (Commons 400/429 : trois
   relances des photos, une heure perdue), relancé moi-même les séries, et rendu et relu des planches. Le porteur n'a été
   consulté qu'à la fin, alors qu'une planche de la v1 à 1,5 M aurait suffi pour voir les trous et le fané.

## 3. Ce qui change : une fleur complète à 8 M

Un budget par étape, coupé net par le pipe. Une étape qui atteint son plafond s'arrête et montre sa planche : elle ne relance
pas.

| Étape | Modèle | Plafond |
|---|---|---|
| recensement, photos, coloris, fiche | Haiku / Sonnet + scripts | 0,6 M (tenu cette fois : 0,4) |
| forme : tête, bouton, fané, **2 coloris** (un saturé, un blanc) | Opus, effort *high* | **3,0 M** : 3 relais d'au plus 1 M et 40 tours, contexte d'au plus 80 k |
| **regard du porteur sur la planche v1 de la forme** | — | 0 |
| fit | script | 0,2 M |
| plante : tige, feuilles, nœuds, avec le kit seulement | Sonnet | 1,0 M |
| finition : tous les coloris, d'après les mesures | Sonnet | 0,8 M |
| juge | Opus, anti-ancrage | 0,4 M |
| témoins, comparaison, QA, planches | scripts | 0 |
| orchestrateur : lancer, regarder la fin, présenter | — | 1,0 M |
| marge | | 1,0 M |
| **total** | | **8,0 M** |

Les mécanismes, à faire dans `fleur/pipe.py` avant la prochaine fleur :

- **M1. `--cap 8` par défaut et un plafond par étape** (table ci-dessus). Arrivé au plafond, le pipe s'arrête avec la planche
  et les chiffres. Un contrôle qui échoue deux fois ne relance plus : il pose la question.
- **M2. La comptabilité n'arrête jamais le dessin.** Après chaque relais, `fiche.py sync` recopie dans `retenu` la valeur et la
  ligne trouvées dans le code, et l'écart est consigné. La paire de face, le rtest et les témoins restent faits par le pipe.
  Un écart signalé ne coûte plus de relais.
- **M3. Des contrôles chiffrés après chaque relais, à 0 token.** Le relais suivant reçoit ces nombres, pas seulement des
  images :
  - les trous (compteur sur fond vert, sur tous les stades, 4 vues et 2 graines) ;
  - la silhouette face à la photo de la paire ;
  - la taille et la largeur du fané face au plein ;
  - `getBBox` ;
  - les cassures de tige.

  Le juge passe sur la planche v1, pas seulement à la fin.
- **M4. Un départ de relais d'au plus 20 k** : le résumé de la fiche, l'état, les derniers chiffres, et les rendus en petit
  format. Ni le module entier, ni le journal entier.
- **M5. Un parent obligatoire dans le brief de forme** : la sorte existante la plus proche, dont on adapte le dessin au lieu de
  le recréer. La forme ne fait que 2 coloris. Le reste revient à la finition.
- **M6. Le regard du porteur après la forme v1** : une planche et les chiffres, avant tout polissage.
- **M7. L'orchestrateur ne répare plus pendant le run.** Les outils sont essayés à vide d'abord (`pipe.py selftest`, une
  photo de chaque source). Pendant le run : un lancement, une lecture de la fin, pas de rendus en double.

## 4. L'œillet, d'ici là

- **Fait** (`ch/oeillet`, 1e97f1c) : trous bouchés par une jupe sous le rang externe et la zone pâle des onglets réduite. Sur
  le rouge, la mesure est passée de 121 et 108 pixels de fond enfermés à 0, par case de D 300. Sur tout le balayage
  (rouge + picotee, 9 stades, 4 vues, 2 graines), il reste des poches de moins de 250 px en bord de silhouette, entre deux
  pétales qui pendent.
- **Faux** : le fané. La tête reste aussi large que la fleur ouverte et se hérisse de pointes. Un œillet coupé qui fane fait
  l'inverse : ses pétales mollissent et se replient, la tête se resserre en houppe froissée sur le calice, et les bords
  brunissent d'abord. Il n'y a qu'une photo de fané, et c'est un œillet de jardin.
- **Reste** : le fané, la plante, la finition des coloris, le juge, les témoins des roses (le kit `y3-rosette.js` a des
  crochets nouveaux). Déjà dépensé : 18,75 M. Je ne relance rien tant que M1 à M4 ne sont pas dans le pipe. Le reste de
  l'œillet doit tenir dans les 8 M de la table, par étapes, comme une fleur neuve.
