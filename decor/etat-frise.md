# État de la frise du catalogue (lot F1, branche `ch/frise`)

Décisions et lots : [FRISE.md](FRISE.md). Ce fichier décrit ce qui est construit, comment le refaire, et ce qu'il mesure.

## 26 octobre : le moteur de frise sur la prairie

### Ce que voit le visiteur

- **21 piliers** de lave, posés tous les 640 unités du cadre du monde, sur une boucle de 13 440 unités. Chaque pilier a sa
  graine (alvéoles, mousse, lichens). Le pilier d'ouverture (place 0) garde la graine 1 et son chemin de dalles ; les autres
  sortent de la prairie avec leur collier de mousse et leur rond de fleurs à leurs pieds.
- **Les bouquets du jour** occupent les 21 places : chacun une fois par milieu (7 places par milieu), jamais deux fois côte à
  côte, même d'un milieu à l'autre ou à la couture de la boucle. En attendant les milieux, l'ordre est une rotation fixe.
- **Le travelling** : chaque tranche de profondeur défile à sa vitesse (facteur 0,3 pour l'horizon, 0,36 à 0,8 derrière les
  piliers, 1 pour les piliers et leurs pieds, 1,32 à 2,25 devant, environ 3,9 pour les touffes du premier plan). Le ciel ne
  bouge pas.
- **La caméra** : glissé libre au doigt, à la souris, au pavé tactile ou à la molette. Lâchée, elle glisse encore et
  s'arrête toujours face à un bouquet, d'un seul mouvement qui part de la vitesse du doigt (porteur, 26 octobre). Un swipe
  rapide passe au bouquet suivant ; un glissé lent revient au bouquet le plus proche de là où il s'arrêterait. Les flèches du clavier et les points du pager voyagent jusqu'à une place (par
  le chemin le plus court). Un toucher sur un bouquet de côté l'amène au centre.
- **Le nom du bouquet** face à la caméra s'écrit dans le ciel en Nunito ExtraLight, blanc. Il glisse plus lentement que les
  piliers et s'efface quand son bouquet quitte le centre. Il est caché en gros plan.
- **Le pager** a 7 points, un par bouquet en vente (porteur, 26 octobre : les 21 points sortaient des bords du téléphone).
  Le point du bouquet face à la caméra s'allonge, où qu'il soit dans la boucle ; un point fait voyager la caméra jusqu'à la
  place de ce bouquet la plus proche. Le bouton « Open », la bulle Acheter et le gros plan suivent le bouquet face à la
  caméra au repos ; ils se cachent pendant un déplacement. En gros plan, la caméra est figée.
- **Les insectes suivent la caméra** (26 octobre) : les 42 insectes, les touffes du premier plan qui se balancent avec
  eux, les porteuses du HUD et le bourdon d'Open, comme dans la scène simple. Un travelling est une translation du monde
  avant la perspective : chaque fleur est replacée à chaque image depuis la caméra (une tête du sol avec sa bande, une tête
  du bouquet avec son pilier, une touffe avec la bande des touffes), un insecte se déplace avec la fleur qu'il vise, et
  sans fleur avec le monde ; la perspective donne d'elle-même la parallaxe. Un insecte laissé loin hors de la vue s'en va,
  et revient comme les autres par les bords. Ils visitent les fleurs du sol proches de la vue et le bouquet face à la
  caméra. Posés, ils restent sur leur fleur pendant un glissé (écart mesuré de 1 à 15 px, toujours dans le cœur). Ils
  sont aussi nombreux par largeur de monde vue que sur un ordinateur : un téléphone, qui voit 850 unités sur 2 400, en a
  environ le tiers (l'essaim vit dans le cadre de l'écran ; les 42 serraient le téléphone et faisaient tomber la brise de 46 à
  17 images par seconde).
- **Ordinateur** : 2 400 unités de large (3 bouquets entiers, et le 1ᵉʳ et le 5ᵉ coupés par les bords). **Téléphone debout** :
  850 unités de large (`?vue=` pour essayer ; porteur, 26 octobre : à 1 180 les bouquets étaient trop petits et le ciel
  trop grand). Le bouquet est centré sur l'écran (le y 470 du monde à mi-hauteur), le bord des bouquets voisins larges se
  voit encore. Sous l'ancien cadre, le sol proche et les touffes sont dessinés jusqu'à y 1 460, pour que le sol fleuri
  descende jusqu'au bas de l'écran (porteur, 26 octobre : « bouquet centré », moins de ciel). Le ciel continue au-dessus du
  monde, en dégradé jusqu'au zénith ; le nom du bouquet y monte, juste sous le pager.

### Comment c'est fait

| Étape | Commande | Produit |
|---|---|---|
| Sol | `node decor/frise_sol.mjs` | `out/frise/src/<tranche>.svg` : une bande par tranche, aussi longue que sa boucle (sources, ignorées par git) |
| Horizon | `node decor/frise_horizon.mjs` | `out/frise/src/horizon.svg` |
| Piliers | `node decor/frise_piliers.mjs` | `out/frise/piliers/<place>.svg` et `piliers.json` |
| Tuiles | `node decor/frise_tuiles.mjs [--verifie]` | `out/frise/<tranche>/<j>.svg` (1 600 unités chacune), `tuiles.json`, `frise.json` (le manifeste de la page) |
| Aperçus | `sh ws/gate.sh node decor/frise_cuisson.mjs` | `<j>.webp` à côté de chaque tuile et de chaque pilier (1,2 px par unité), ajoutés à `frise.json` |
| Touffes du premier plan | `node decor/herbe.mjs --only touffes --bas 1460` puis `node decor/fleurs.mjs touffes --bas 1460`, et `sh ws/gate.sh node decor/premier.mjs --bas 1460` | les touffes dessinées et cuites jusqu'à y 1 460 (feuilles et tiges sous l'ancien cadre) |
| Têtes de fleurs | `node decor/frise_tetes.mjs` | `out/frise/tetes.json` : les 2 851 têtes où les insectes se posent, par tranche (unités de la bande) |
| Pages | `node decor/scene/build.mjs` | les pages des 5 langues |
| Contrôle | `node decor/frise_apercu.mjs <png> --c 0 --vue 2400` | une image de la frise pour une position de caméra (resvg, sans Chrome) |

- Les modules du décor n'ont changé que par des options neuves. Par défaut, ils redonnent l'octet près le sol et l'horizon
  de la scène simple (vérifié par empreinte md5) : `herbe.mjs` (`setFlank`, bandes plus larges que le cadre), `fleurs.mjs`
  (`setStrip`), `horizon.mjs` (`largeur`, `axe`).
- **Tranches** (`frise.mjs`) : loin (au-delà de 14,5 m), 8,5-14,5, 5,9-8,5, 5-5,9, la bande des pieds derrière (4,37-5)
  et devant (3,7-4,37), puis 2,95-3,7, 2,3-2,95, 1,6-2,3 m. Chaque tranche est coupée en bas, là où la première masse de la
  tranche suivante la couvre quelle que soit la caméra.
- **Autour de chaque pilier**, le sol est dessiné dans le repère de ce pilier vu de face (collier tondu, herbes à son ombre,
  rond de fleurs), pour être juste quand la caméra s'arrête devant lui.
- **Détail** : toute la boucle est dessinée au niveau de détail des flancs de la scène simple (`--flank 0.5`). La colonne du
  téléphone de la scène simple était plus fine ; voir la question 3.
- **Tuiles** (`tuiles.mjs`) : chaque tuile ne garde que ses morceaux (sous-chemins, masses coupées à la tuile, dégradés
  recadrés, defs utiles). Vérifié : rendues côte à côte, elles redonnent la bande, à l'anticrénelage des bords près. Elles
  débordent de 2 unités sur la suivante, pour qu'aucun fil clair ne passe entre elles.
- **La page** : `decor/scene/frise.js` (la caméra, les tuiles, les piliers, les touffes, le nom). `boutique.js` lui donne de
  quoi poser un bouquet par place et suit la place face à la caméra. Le décor arrive d'abord en WebP, puis chaque tuile ou
  pilier en vue passe en SVG, quand la caméra est au repos et la page inoccupée. Les touffes du premier plan restent en WebP
  (`out/premier/`, les images des sprites des insectes) : elles défilent presque 4 fois plus vite que les piliers, et lire
  leur SVG figeait un téléphone une seconde à chaque place.
- **Les bouquets** ne sont posés que caméra au repos, depuis 0,9 s, la place face à la caméra d'abord, puis jusqu'à deux
  places au-delà de la vue. Ceux qui sont à plus de trois places sont retirés. Poser un bouquet pendant un déplacement le
  bloquait (7 images par seconde sur téléphone ralenti).

### Mesures (Chrome sans tête, page servie en local)

| | Ordinateur 1600 × 900 | Téléphone 390 × 844, dpr 3, processeur ×4 |
|---|---|---|
| Décor à l'écran | 0,6-0,7 s | 1,4-1,7 s |
| Premier bouquet | 1,2 s | 3,4 s (5,4 s pour la scène à un bouquet du 25/10) |
| Bouquets voisins | tous à 2,9 s | un toutes les 1 à 2 s ensuite |
| Brise au repos | 138-142 images/s | 46-52 images/s |
| Pendant un déplacement | 51-70 images/s, pire image 139-285 ms | 21 images/s, pire image 90-132 ms |
| Avec les insectes (26 oct., vue 850) | — | 15 insectes : 27 images/s au repos, 16 pendant le glissé (46 et 25 sans insectes) |
| Après l'arrêt | — | 0,6-0,8 s d'à-coup quand le bouquet suivant se pose (0,9 s après l'arrêt) |

Poids : les tuiles SVG du sol pèsent 4,2 Mo gzip pour toute la boucle ; les aperçus WebP 14,8 Mo ; chaque pilier 140 Ko
gzip. Un écran d'ordinateur charge environ 8,7 Mo de décor (en local, sans compression) ; un téléphone 5,6 Mo.

### Pas encore sur la frise

- **La couture de la boucle** : chaque bande montre un raccord en face du pilier d'ouverture, vers c = 6 720 (entre les
  places 10 et 11). C'est le lot F4.

### Questions pour le porteur

1. ~~**Téléphone** : 1 180 ou 1 000 unités de large ?~~ **Tranché le 26 octobre : 1 180 unités**, puis **850** le même
   jour (bouquets trop petits, trop de ciel ; compromis qui garde le bord des bouquets voisins larges).
2. **À-coup après l'arrêt** sur téléphone, le temps de poser le bouquet suivant. *Proposition :* poser ses images une à une,
   entre deux images de l'écran (à faire dans `eclosion.js`).
3. **Finesse de l'herbe du premier plan** : la frise la dessine partout au niveau des flancs de l'ancienne scène, un peu moins
   fin que l'ancienne colonne du téléphone. *Proposition :* garder ce niveau, et mesurer le poids d'un niveau plus fin si
   l'herbe proche te gêne.
