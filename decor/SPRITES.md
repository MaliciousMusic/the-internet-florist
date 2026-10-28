# La frise en sprites PixiJS

Branche `ch/sprites`, copie de travail `ch/sprites/`. Commencé le 27 octobre 2026.

## Pourquoi

Les mesures du 27 octobre (`decor/scene/perf.mjs`, tableau publié pour le porteur) montrent une frise à 11 bouquets bloquée :

- **Ordinateur :** 15 images par seconde au repos, 24 en glissant, premier bouquet visible à 2,4 s.
- **Téléphone milieu de gamme :** 1 image par seconde au repos, 3 en glissant, premier bouquet à 8,1 s.

Les causes viennent de la façon d'afficher, pas d'un élément en particulier :

- 466 calques à recomposer à chaque image ;
- 362 morceaux de bouquets et 108 tuiles lus comme documents SVG sur le fil principal ;
- 1 908 filtres SVG à tramer ;
- 9 toiles WebGL d'insectes empilées.

Sur téléphone, éteindre un seul poste n'aide pas.

## Décisions du porteur (27 octobre 2026)

- **Sources et site.** Les vases, les bouquets, les piliers et le décor restent dessinés en SVG : c'est la source. Le site ne
  montre que leurs **sprites haute définition, dans une seule toile PixiJS**, comme les insectes.
- **Deux niveaux de définition.** Des sprites nets sur la frise. Des sprites plus fins chargés seulement pour le bouquet du gros
  plan, nets jusqu'au zoom 2,6.
- **La brise.** Les bouquets ne se balancent **qu'en gros plan**. Sur la frise, ils sont immobiles.
- **Le décor.** Chaque tuile de chaque plan devient un sprite dans la même toile, avec la même parallaxe qu'aujourd'hui. Les
  piliers sont aussi des sprites.
- **Les herbes hautes.** Les tiges à épillets gardent leur longueur, mais ne se couchent plus : 45° de la verticale au plus.
- **Les insectes.** Certains sont trop flous (la sauterelle, par exemple) : leurs atlas sont à refaire plus fins.
- **Les vases.** Ils doivent être en SVG pur. Seul le vase en bronze à la carpe contient encore une image (son corps coulé).

## Lots

1. **S1, cuisson des bouquets** (`decor/sprites.mjs`). Pour chaque bouquet, à partir de son ouvert.json :
   - niveau frise : une seule image du bouquet entier, vase compris ;
   - niveau gros plan : un atlas de ses morceaux, avec articulation et brise ;
   - en WebP, avec un index JSON.
2. **S2, une seule toile.** La frise passe dans une application Pixi : bandes de tuiles avec parallaxe, piliers, bouquets,
   touffes de premier plan. Les insectes et les porteuses entrent dans la même toile.
3. **S3, le gros plan.** Le zoom se fait dans Pixi. On charge l'atlas fin du bouquet choisi, et ses morceaux se balancent.
4. **S4, le décor en haute définition.** On vérifie la finesse des aperçus actuels (1,2 pixel par unité) à 2 pixels par point,
   et on recuit si besoin.
5. **S5, les herbes.** Dans `herbe.mjs`, on limite l'inclinaison des tiges à épillets à 45°, puis on recuit les touffes et les
   tuiles concernées.
6. **S6, les insectes flous.** Atlas refaits plus fins.
7. **S7, la mesure.** On relance `perf.mjs`. Les objectifs sont 60 images par seconde sur ordinateur, 30 au moins sur téléphone,
   et le premier bouquet en moins d'une seconde sur ordinateur.

## État (27 octobre 2026)

- **S1 à S3 faits** (commit cdfb31c) :
  - `sprites.mjs` cuit les 11 bouquets : de 30 à 72 Ko pour la frise, de 177 à 602 Ko pour le gros plan ;
  - `toile.mjs` porte la toile unique ;
  - `frise.js`, `boutique.js` et `insectes.mjs` y sont branchés ;
  - l'essaim range ses insectes dans les plans de la toile.
- **Mesures en local** (`perf.mjs`, même protocole que le tableau du porteur) :

  | | Avant | Après |
  |---|---|---|
  | Ordinateur au repos | 15 i/s | 139 i/s |
  | Ordinateur en glissant | 24 i/s | 142 i/s |
  | Téléphone ralenti 4 fois, au repos | 1 i/s | 117 i/s |
  | Téléphone ralenti 4 fois, en glissant | 3 i/s | 124 i/s |
  | Premier bouquet, ordinateur | 2,4 s | 1,1 s |
  | Premier bouquet, téléphone | 8,1 s | 2,8 s |
  | Calques | 466 | 20 |

- **S5** : la tige à épillets est plafonnée à 45° dans `herbe.mjs` (`CULM_MAX`), puis le sol et les touffes sont recuits.
- **S6** : l'insecte prend son grand niveau de détail dès que le petit serait agrandi, en pixels réels (le seuil comptait en
  pixels CSS, ×1,25). Le grand niveau se charge à la première demande.
- **Corrigé au passage** : la cétoine des porteuses plantait à son premier vol (phase de battement non définie).

## Chargement de l'arrivée (28 octobre 2026)

Décisions du porteur : la page arrive entière tout de suite, puis gagne en netteté (« à l'œil ce sera trompeur et ça fera
le job ») ; le ciel passe en CSS pur ; jamais plus de 20 bouquets sur la frise.

- **Ciel en CSS pur** (`scene/ciel_css.mjs`). Les deux dégradés de `out/ciel.svg` (vertical et voile solaire en diagonale)
  sont recalculés en deux `linear-gradient` posés point pour point au même endroit du monde, sur une seule boîte `.ciel`,
  du haut de `ciel-haut.svg` (1 400 unités au-dessus du monde) jusqu'en bas. `build.mjs` l'inscrit dans la page (1,5 Ko) :
  le ciel s'affiche avec les premiers octets. `ciel.svg` reste la source ; `ciel-haut.svg` n'est plus lu.
- **L'affiche de l'arrivée** (`scene/amorce.py`, dans `out/frise/amorce/`). Une image de ce que la toile montre au repos
  sur la première place : tuiles, piliers et bouquets en vue, composés dans l'ordre de la toile, sur un ciel transparent.
  Deux versions : le monde entier pour un ordinateur (0,45 pixel par unité, 92 Ko en AVIF) et la colonne d'un téléphone
  (0,75 pixel par unité, 87 Ko). La page la porte dans son HTML (`<picture id="affiche">`), sous la toile, avant tout
  script. Les sprites nets viennent par-dessus, aux mêmes places (vérifié au pixel près sur ordinateur et téléphone).
  L'affiche s'en va quand le décor net et les bouquets nets de l'arrivée sont tous là, ou tout de suite si la caméra bouge.
- **Les planches légères** (même script). Tous les sprites de la frise au sixième de leur définition, sur une planche
  (665 Ko en AVIF, 1 Mo en WebP). Partout où l'affiche ne couvre pas (après un glissement, un lien `?b=`), une pièce montre
  son sprite léger jusqu'à l'arrivée du net. On les charge en priorité basse derrière les sprites nets de l'arrivée.
- **Les index des bouquets** sont tous dans `amorce.json`, préchargé dans l'en-tête : plus de fichier à attendre par bouquet.
- **AVIF d'abord, WebP en repli.** Une `<picture>` avec des sources WebP typées faisait télécharger les deux formats :
  l'image demande l'AVIF seul, et un navigateur qui ne sait pas le lire prend le WebP de la même image.
- **`scene.js` en `defer`.** Le script bloquant retardait le premier affichage de son aller-retour.
- **Mesures en local** (serveur `servir.py`, ordinateur 1280 × 720) : premier affichage à 1,43 s avant, puis 0,58 s ;
  l'arrivée entière (affiche, plus grand affichage) à 0,65 s ; tout net vers 2,8 à 3,2 s. Sur un lien `?b=`, le ciel
  d'abord, la scène légère vers 1,9 s, puis le net.
- **Textures compressées (KTX2), sur écran tactile seulement** (`scene/ktx2.py`, porteur le 28 octobre : « je prends »).
  Chaque tuile et chaque pilier a un KTX2 Basis ETC1S à côté de son WebP, avec ses mipmaps : 16,9 Mo pour toute la boucle,
  contre 15,5 Mo en WebP. `toile.mjs` charge `loadKTX2` de PixiJS et son transcodeur `libktx` (930 Ko, servi depuis
  `insectes/runtime/vendor/ktx/`, voir son SOURCE.md) quand la carte graphique lit un format compressé.
  - Mesures (arrivée, mémoire des textures) : ordinateur 178 → 76 Mo, téléphone émulé 88 → 42 Mo. Mais sur ordinateur,
    l'arrivée est nette 0,7 s plus tard (4,8 s contre 3,3 à 4,1 s en local), avec une fois une tâche de 250 ms au
    démarrage du transcodeur. À l'écran, la différence ne se voit pas.
  - D'où le choix : KTX2 sur écran tactile (`pointer: coarse`), où c'est la mémoire qui fait planter un onglet ; WebP sur
    ordinateur. `?ktx2=oui|non` force l'un ou l'autre.
  - Les bouquets restent en WebP : l'ETC1S tache leurs pétales (erreur moyenne 4,4 contre 3,3 sur l'herbe, vu à l'œil).
  - L'outil `ktx` (KTX-Software 4.4.2, Apache 2.0) est extrait dans `~/.belai-ktx/` (hors dépôt) : le Python du Microsoft
    Store ne voit pas les fichiers de `AppData/Local`.
  - Non mesuré sur un vrai téléphone.
- **Ordre de fabrication :** `frise_cuisson.mjs` / `frise_versions.mjs`, `sprites.mjs`, `python scene/ktx2.py`, puis
  `python scene/amorce.py`, puis `node scene/build.mjs`.

## Entrée d'un bloc (28 octobre 2026, soir)

Le porteur a filmé l'arrivée : flou au départ, puis « une vague d'éléments déployés », un goût de produit bas de gamme. Il
préfère encore un écran d'attente à ça ; il a choisi « affiche nette, bascule d'un bloc » et le cache des retours.

- **Règle :** la première image montrée est complète et nette ; ensuite rien ne change que par le mouvement (brise, insectes,
  fourmis qui apportent le dock).
- **Affiche nette** (`amorce.py`) : à la définition de l'écran, le navigateur choisissant par `srcset` (1280, 1920 et 2880
  pixels de large pour un ordinateur, 141 à 487 Ko en AVIF ; 2400 et 3360 pour la colonne d'un téléphone, 141 et 227 Ko).
  Elle comprend les touffes de premier plan, au repos.
- **Rien à moitié :** l'affiche et le nom du bouquet (écrit dans la page par `build.mjs`, sa police préchargée) restent
  cachés jusqu'au décodage complet de l'image (`html.entree`, posée par la tête de la page). Avant, le ciel seul.
- **Bascule d'un bloc** (`frise.js`) : la toile reste cachée jusqu'à ce que tout ce qui est en vue soit net (décor, bouquets
  des places en vue, touffes), puis elle prend la place de l'affiche en une image ; les deux coïncident au pixel près.
  Si le visiteur bouge avant, la toile vient tout de suite, avec des sprites légers là où les nets manquent.
- **Touffes :** `frise.js` les pose dès le départ ; `insectes.mjs` les reprend en une image quand toutes les siennes sont là
  (`Frise.touffesPrises`). La brise monte sur 2,5 s après la bascule (`Frise.brise`), pour que rien ne saute.
- **Fourmis du dock :** elles partent quand la scène est entrée (`window.ENTREE`), plus sur un ciel vide. La classe
  `porteuses` est posée par la tête de la page (`scene.js` est désormais différé).
- **Ciel :** prolongé sous le monde (une bande bleue apparaissait en bas d'un téléphone avant l'entrée).
- **Priorités :** tout ce qui n'est pas l'affiche (PixiJS, les JSON, la toile) est demandé en priorité basse.
- **Service worker** (`scene/sw.js`, enregistré après le chargement ; jamais en local sauf `?sw=oui`, `?sw=non` le retire) :
  les fichiers à empreinte (`?v=`) gardés pour de bon, une version par fichier ; pages, données et scripts depuis le réseau,
  le cache s'il ne répond pas en 3 s ; le reste depuis le cache, rafraîchi derrière ; sons et vidéos laissés au navigateur.
  Les images des bouquets portent maintenant leur empreinte dans `amorce.json`.
- **Filmé** (`scene/film.mjs` + `film_planche.py` : Chrome sans en-tête, profil vierge, réseau 4G, chaque image peinte gardée) :

  | | Ciel seul jusqu'à | Scène complète et nette | Changements visibles ensuite |
  |---|---|---|---|
  | Ordinateur, 1re visite | 1,0 s | 1,03 s | aucun (bascule invisible à 1,6 s) |
  | Téléphone ralenti ×4, 1re visite | 2,0 s | 2,0 s | aucun |
  | Téléphone, retour (service worker, 0 octet) | 0,79 s | 0,79 s | aucun |
  | Ordinateur, retour | 0,5 s | 0,5 s | aucun |
  | Téléphone, lien `?b=5`, 1re visite | 7,3 s | 7,3 s | aucun |

  En 1,6 Mb/s, l'ordinateur reste 6,2 s sur le ciel. Le serveur local ne compresse rien et ne suit pas les priorités :
  c'est un majorant.
- **Défauts trouvés en filmant et corrigés :** la reprise des touffes libérait leurs textures, que les insectes partagent
  (toile vide à 4,9 s) ; l'ancienne amorce posait les sprites nets un à un sur l'image (les piliers disparaissaient à 0,67 s).
- Au début, sur téléphone émulé, le ciel seul se décale une fois vers 0,5 s, avant l'entrée. C'est probablement l'émulation
  (`dvh`) : à vérifier sur un vrai téléphone.

## Reste

- Les porteuses du bandeau gardent leurs deux canvases, au-dessus du bandeau HTML. On peut les réunir en une seule.
- `ouvert.json`, `p*.svg` et `vignette.svg` restent publiés comme sources, mais la page ne les lit plus.
- La cétoine des porteuses plante encore à son vol (`cetoine.mjs` ligne 109, `strokeWings` : `main` indéfini), vu dans la
  console le 28 octobre ; hors de ce lot.
- Les liens `?b=` (ceux des vidéos) attendent toute la toile nette (7,3 s sur téléphone ralenti) : une affiche par bouquet
  les rendrait instantanés (environ 0,4 Mo en AVIF par bouquet, colonne et 1920 seulement).

## Questions ouvertes

- Le vase en bronze à la carpe : refaire son corps coulé en SVG pur ? Il est hors du chantier sprites, et le porteur en décide.
