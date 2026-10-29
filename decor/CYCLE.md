# Le cycle accéléré : rosée du matin et fanaison complète

Branche `ch/cycle`, copie de travail `ch/cycle/`. Ouvert le 29 octobre 2026.

## Demande du porteur

Dans l'essai « Try on your desktop », proposer de lancer le cycle accéléré du bouquet : la rosée du matin, puis la fanaison
complète. Dessiner pour cela les stades qui manquent.

## Décisions du porteur (QCM du 29 octobre 2026)

- **La rosée** : de petites gouttes rondes, chacune avec son reflet, posées sur les pétales et les feuilles tournés vers le
  haut, plus nombreuses sur les feuilles. Elles sèchent pendant la première matinée du cycle.
- **Le cycle** : 30 jours en 30 secondes, en continu, sans à-coup. La rosée le premier matin, la pleine floraison, le
  déclin, la fanaison. Le bouquet reste fané un instant, puis revient tel qu'il était.
- **Les bouquets** : les 11 de la vitrine.
- **Où** : dans l'essai seulement. L'abeille le propose à la fin : « Voir ses 30 jours en 30 secondes ».

## Ce qui existe

- **La fanaison** : le moteur suit pour chaque fleur refaite une vie continue, de 0 (fraîche) à 1 (sèche) : `LIFE` et
  `lifeWEl` pour un bouquet, `SVA_LIFE` pour forcer une valeur (planches). Chaque espèce refaite a son déclin et son fané
  d'après des photos et sa fiche de fanaison (`catalogue/fanaison/`) : l'anémone par exemple (`svaWiltCol`, tépales qui
  tombent, cœur qui reste).
- **La rosée** : rien. Ni dans le moteur, ni dans le décor.
- **Les sprites du site** : l'état ouvert seulement (`predessin.mjs`, `sprites.mjs`).

## Les bouquets

| Bouquet | Espèces | État |
|---|---|---|
| Printemps à la carpe | 22 | prêt |
| Citrine | 9 | prêt |
| Ronde bleue | 12 | prêt |
| Neige de mars | 9 | prêt |
| Aube au jardin | 8 | attend hortensia boule, scabieuse |
| Nuit d'ambre | 9 | attend amarante retombante, cymbidium, œillet, scabieuse |
| Ciel de faïence | 9 | attend delphinium, scabieuse |
| Souffle du dragon | 9 | attend gloriosa |
| Vol de nuit | 9 | attend delphinium, phalaenopsis, scabieuse |
| Étang d'abricot | 9 | attend cymbidium, œillet |
| Bronze poudré | 9 | attend nérine, œillet, phalaenopsis, scabieuse |

Les espèces en attente ne sont pas encore refaites au niveau de l'anémone. Sept ont leur chantier ouvert (`ch/scabieuse`,
`ch/oeillet`, `ch/delphinium`, `ch/hortensia`, `ch/amarante`, `ch/gloriosa`, `ch/nerine`) ; phalaenopsis et cymbidium
n'en ont pas encore.

## Lots

1. **C1, la rosée** (dessin, méthode des fleurs : références d'abord).
   - Références : photos de rosée sur pétales et feuilles (tailles des gouttes rapportées au pétale, reflet, ombre portée,
     lentille sur la nervure), hors du dépôt, mesurées.
   - Un module du moteur : des gouttes posées sur les faces tournées vers le haut des pétales et des feuilles (le kit
     commun), plus denses sur les feuilles, avec une quantité de 0 à 1 qui sèche pendant la première matinée.
   - Planche sur les 4 bouquets prêts, validée par le porteur avant la suite.
2. **C2, la cuisson du cycle.**
   - `predessin.mjs` dessine un bouquet à un âge donné (la vie du bouquet, la rosée) ; assez d'images pour un mouvement
     continu (de l'ordre de 12 par seconde, soit 360 pour 30 s), à la taille de l'essai.
   - Encodage léger, chargé seulement quand le visiteur demande le cycle : une vidéo avec transparence (WebM VP9, et une
     autre pour Safari), à mesurer ; cible de l'ordre de 2 Mo par bouquet.
   - Aucun fondu entre deux images : le mouvement vient des images elles-mêmes (règle de l'éclosion).
3. **C3, dans l'essai.** À la fin, l'abeille propose « Voir ses 30 jours en 30 secondes » ; le cycle joue sur le bureau du
   visiteur, l'abeille nomme les moments (rosée, floraison, déclin, fané), puis le bouquet revient.
4. **C4, les 7 bouquets en attente**, au fil des chantiers de leurs fleurs.

## État

- 29 octobre 2026 : décisions prises, plan écrit. Rien n'est dessiné.
- 29 octobre 2026, C1 (la rosée), première étape faite, **en attente de la validation du porteur** :
  - **Références** : 10 photos de Commons mesurées (tailles, densité, forme, lumière dans la goutte, ombre, lentille, séchage),
    dans [ROSEE-REFERENCES.md](ROSEE-REFERENCES.md). Les photos restent dans `refcache/rosee/`, hors du dépôt.
  - **Module** `app/y3-rosee.js` (copié dans `demo/src`), branché sur le kit commun par une ligne de `svDraw` (`y1.js`). Sur chaque
    face visible tournée vers le haut, il pose des gouttes rondes : ombre portée douce, bande sombre du côté de la lampe, lumière
    concentrée de l'autre côté, liseré de contact, éclat blanc. Les gouttes ont leur taille réelle (0,4 à 3 mm sur les pétales, à
    4 mm sur les feuilles), deux fois plus de couverture sur les tissus verts, et ne se chevauchent pas. Il n'y en a ni sur le vase
    ni sur ce qu'on voit sous l'eau. La quantité va de 0 à 1 : `DEW_SET` pour une planche, `DEW_LIFE` pour le cycle. Avec
    `DEW_LIFE`, elle suit l'âge du bouquet (`LIFE`) : entière à l'aube, sèche vers 11 h (`dewOf`, `lifeDays`). Les petites gouttes
    sèchent d'abord, celles au soleil plus vite.
  - **Rien ne change sans rosée** : sans `DEW_SET` ni `DEW_LIFE`, la boutique, le widget et les planches de stades dessinent comme
    avant. Les 4 bouquets dessinés par le moteur de `HEAD` et par le nouveau ont la même empreinte, au caractère près (donc le même
    flux du hasard).
  - **Planche** [out/cycle/planche-rosee-c1.jpg](out/cycle/planche-rosee-c1.jpg) : les 4 bouquets prêts, entiers à pleine rosée et à
    mi-séchage, puis un gros plan ×5 sans rosée, à pleine rosée et à mi-séchage. Planche d'échelle
    [out/cycle/planche-rosee-echelle.jpg](out/cycle/planche-rosee-echelle.jpg) : vraie grandeur contre gouttes ×2,5. Outils :
    `rosee_planche.mjs` (un Chrome, à passer par `ws/gate.sh`) et `planche_rosee.py`.
  - **Chiffres** à pleine rosée (après le branchement des autres peintres, ci-dessous) : 7 810 gouttes sur Printemps à la carpe,
    2 134 sur Citrine, 5 745 sur Ronde bleue, 2 483 sur Neige de mars. Cela fait 1,1 à 4 Mo de SVG en plus et 0,3 à 1,2 s de
    dessin. À mi-séchage, il reste environ un tiers des gouttes.
  - **Couverture** : `svDraw` couvre l'iris, le lilas, les tulipes simple, perroquet et frangée, les anémones, le narcisse trompette,
    le pois de senteur, l'arum et les feuilles en lanière. Depuis le 29 octobre au soir, les autres peintres ont leur crochet :
    `svrDraw` (`y3-rosette.js` : renoncule, rose, tulipe double), `svDrawP` et `svDrawLean` (`y3-damier.js` : fritillaire et ses
    feuilles), les fleurs des branches à la taille du bouquet (`y3-branche.js`, lod 1 : cerisier, cognassier, forsythia) et le
    narcisse bouquet (`yz-narcissus-bouquet.js`). Ses fleurons regardent de face et ne retiennent presque pas de gouttes, ce qui
    est juste.
  - **Restent sèches** : jacinthe, muscari, glycine et freesia (kit des grappes, `y3-grappe.js`), viorne (`svBoule`) et
    chrysanthème. Le kit des grappes peint ses fleurons en primitives 2D, rangées par tranche de profondeur et par couche, sans
    ordre entre fleurons d'une même tranche : une goutte risquerait d'y flotter par-dessus le fleuron voisin. Il faut un
    branchement propre à ce kit (par fleuron, dans sa couche la plus haute, avec un test de recouvrement). C'est la prochaine
    étape. L'alchémille garde ses propres perles d'eau.
  - **`sync_demo.sh` n'a pas été lancé** : il est câblé sur l'atelier principal et pousse `main`. `app/` et `demo/src` divergent
    dans les deux sens sur une trentaine de modules (certains modules d'`app/` sont plus anciens que `demo/src`). Seuls
    `y3-rosee.js`, la ligne de `y1.js` et `build.sh` ont été portés à la main dans `demo/src`.

- 29 octobre 2026, **décision du porteur sur l'échelle : vraie grandeur** (`DEW_K` reste à 1). La rosée se verra de près dans le
  cycle (C2 ou C3 : gros plan pendant le premier matin).
- 29 octobre 2026, **le porteur valide l'aspect de la goutte** et demande de brancher la rosée sur les espèces restées sèches (voir
  Couverture ci-dessus).

### Questions au porteur (C1)

1. **L'aspect d'une goutte (validé le 29 octobre)**.
2. **L'échelle (tranché : vraie grandeur)** : en vraie grandeur, une goutte de 2 mm fait 1 à 2 px quand le bouquet entier tient sur l'écran. La rosée ne se
   voit alors qu'en gros plan, comme sur un vrai bouquet vu à un mètre. *Proposition :* garder la vraie grandeur et laisser le
   cycle montrer la rosée de près (C2 ou C3 : un zoom pendant le premier matin). Sinon, grossir les gouttes (`DEW_K`, ×2,5 sur
   la planche d'échelle), ce qui les rend visibles de loin mais plus rares.
3. **Le temps du premier matin** : à 30 jours en 30 s, la matinée dure 0,2 s. *Proposition (C2) :* une horloge non linéaire, où
   le premier matin prend environ 3 s et les 30 jours le reste.
4. **La loi de séchage** : la vraie loi (durée en r²) fait disparaître 9 gouttes sur 10 dans le premier quart de la matinée.
   Le module étale les disparitions sur toute la matinée (les petites d'abord, l'aire de chaque goutte baissant à vitesse
   constante). *Proposition :* garder cet étalement.
5. **La lentille sur la nervure** (nervures grossies sous la goutte) n'est pas dessinée : elle ne se voit que sur des gouttes de
   plus de 2 mm en gros plan. *Proposition :* l'ajouter seulement si le cycle montre un gros plan.
