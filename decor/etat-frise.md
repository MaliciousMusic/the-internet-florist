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
- **La caméra** : glissé libre au doigt, à la souris, au pavé tactile ou à la molette, avec inertie, qui s'arrête où il veut.
  Un swipe rapide passe au bouquet suivant. Les flèches du clavier et les points du pager voyagent jusqu'à une place (par
  le chemin le plus court). Un toucher sur un bouquet de côté l'amène au centre.
- **Le nom du bouquet** face à la caméra s'écrit dans le ciel en Nunito ExtraLight, blanc. Il glisse plus lentement que les
  piliers et s'efface quand son bouquet quitte le centre. Il est caché en gros plan.
- **Le pager** a 21 points (un par place). Le bouton « Open », la bulle Acheter et le gros plan suivent le bouquet face à la
  caméra au repos ; ils se cachent pendant un déplacement. En gros plan, la caméra est figée.
- **Ordinateur** : 2 400 unités de large (3 bouquets entiers, et le 1ᵉʳ et le 5ᵉ coupés par les bords). **Téléphone debout** :
  1 180 unités de large (`?vue=` pour essayer), pour voir le bord des colonnes et des bouquets voisins. Le monde est alors
  moins haut que l'écran : le ciel continue au-dessus, en dégradé jusqu'au zénith.

### Comment c'est fait

| Étape | Commande | Produit |
|---|---|---|
| Sol | `node decor/frise_sol.mjs` | `out/frise/src/<tranche>.svg` : une bande par tranche, aussi longue que sa boucle (sources, ignorées par git) |
| Horizon | `node decor/frise_horizon.mjs` | `out/frise/src/horizon.svg` |
| Piliers | `node decor/frise_piliers.mjs` | `out/frise/piliers/<place>.svg` et `piliers.json` |
| Tuiles | `node decor/frise_tuiles.mjs [--verifie]` | `out/frise/<tranche>/<j>.svg` (1 600 unités chacune), `tuiles.json`, `frise.json` (le manifeste de la page) |
| Aperçus | `sh ws/gate.sh node decor/frise_cuisson.mjs` | `<j>.webp` à côté de chaque tuile et de chaque pilier (1,2 px par unité), ajoutés à `frise.json` |
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
| Après l'arrêt | — | 0,6-0,8 s d'à-coup quand le bouquet suivant se pose (0,9 s après l'arrêt) |

Poids : les tuiles SVG du sol pèsent 4,2 Mo gzip pour toute la boucle ; les aperçus WebP 14,8 Mo ; chaque pilier 140 Ko
gzip. Un écran d'ordinateur charge environ 8,7 Mo de décor (en local, sans compression) ; un téléphone 5,6 Mo.

### Pas encore sur la frise

- **Les insectes, les porteuses du HUD et le bourdon d'Open** : ils sont faits pour un cadre fixe. Ils sont éteints sur la
  frise (`?insectes=1` pour les rallumer, sans garantie). Le dock, le pager et la mention « Legal » sont posés d'emblée.
  À faire : que l'essaim suive la caméra (chaque insecte et chaque fleur décalés de c × 4,37 / d), et des têtes de fleurs
  (`tetes.json`) pour toute la boucle.
- **La couture de la boucle** : chaque bande montre un raccord en face du pilier d'ouverture, vers c = 6 720 (entre les
  places 10 et 11). C'est le lot F4.

### Questions pour le porteur

1. **Téléphone** : 1 180 unités de large montrent bien le bord des colonnes et des bouquets voisins, mais le bouquet est plus
   petit et le haut de l'écran n'est que du ciel. À 1 000 unités, on ne voit que le bord des bouquets larges. *Proposition :*
   1 180, et la moitié haute du ciel servira au nom et, plus tard, à la bulle des abeilles.
2. **À-coup après l'arrêt** sur téléphone, le temps de poser le bouquet suivant. *Proposition :* poser ses images une à une,
   entre deux images de l'écran (à faire dans `eclosion.js`).
3. **Finesse de l'herbe du premier plan** : la frise la dessine partout au niveau des flancs de l'ancienne scène, un peu moins
   fin que l'ancienne colonne du téléphone. *Proposition :* garder ce niveau, et mesurer le poids d'un niveau plus fin si
   l'herbe proche te gêne.
