# Grande sauterelle verte : comportement (runtime/sauterelle.mjs, SAUTERELLE)

Les chiffres sont sourcés quand une source existe. Sinon ce sont des ordres de grandeur, marqués « à mesurer sur vidéo ».

## Tailles
- **Corps du mâle** : 28 à 36 mm ; femelle 27 à 38 mm, sans l'oviscapte ([natur-in-nrw, Grünes Heupferd](https://www.natur-in-nrw.de/HTML/Tiere/Insekten/Heuschrecken/TH-54.html)).
- **Avec les ailes** : 40 à 55 mm ([orthoptera.org.uk](https://orthoptera.org.uk/node/3414)).
- **Mesures du modèle**, prises sur le mâle c087 posé sur papier millimétré (44,2 px/mm) et sur le spécimen étalé c090 (31,8 px/mm) :
  - 53,5 mm du fastigium au bout des tegmina ; corps de 32,4 mm (28,4 mm sur le spécimen sec, dont l'abdomen se rétracte) ;
  - pronotum de 7,1 mm ;
  - tegmen de 43 à 44,6 mm ;
  - fémur postérieur de 20,5 à 21 mm, tibia postérieur de 19,5 à 20 mm ;
  - antenne de 56 mm, soit 1,75 longueur de corps.
- Les ailes dépassent nettement les genoux postérieurs. Chez la femelle, elles sont à peu près aussi longues que l'oviscapte (natur-in-nrw).

## Saut
Burrows & Morris 2003, *Jumping and kicking in bush crickets*, J Exp Biol 206:1035 ([doi:10.1242/jeb.00214](https://doi.org/10.1242/jeb.00214)). L'espèce mesurée est une autre sauterelle, *Pholidoptera griseoaptera* :
- **décollage** : 2,1 m/s sous un angle de 34°, pour 300 mm parcourus ;
- **poussée** : accélération jusqu'à 114 m/s², les tibias postérieurs complètement étendus en 30 ms ;
- **pattes postérieures** : 1,5 fois la longueur du corps.

Pour *T. viridissima*, Brackenbury 1990 (J Zool 220:593) montre que les ailes s'ouvrent avant que les tarses postérieurs quittent le sol : le saut se prolonge en vol.

Dans le runtime :
- accroupi 0,28 s (ordre de grandeur, à mesurer sur vidéo) ;
- poussée de 30 ms, montrée sur au moins une image ;
- départ à 2,1 m/s sous 34° ;
- trajectoire balistique (g = 9,81 m/s²) pendant 0,12 s, ailes ouvertes, puis vol.

## Marche
Source : *Katydids shift to higher-stability gaits when climbing inclined substrates* (bioRxiv [2025.04.04.647231](https://www.biorxiv.org/content/10.1101/2025.04.04.647231.full)), sur sept genres de sauterelles, sur des pentes de 30 à 90°. On y lit un appui moyen de 0,48 s et un facteur de service de 0,67, soit un cycle de 0,72 s (1,39 Hz).

Dans le modèle :
- trépied alterné, avec un appui sur les deux tiers du cycle ;
- foulée de 10 mm (la portée des pattes antérieures du modèle), ce qui donne environ 14 mm/s ;
- les antennes balaient deux fois par cycle, en opposition de phase entre gauche et droite.

## Vol
- **Battement** : une sauterelle en vol libre bat des ailes à 20 à 29 Hz (Springer, chapitre *Insect Bioacoustics and Biotremology* ; l'espèce n'y est pas précisée). Le runtime dessine trois positions d'ailes à tour de rôle, environ 20 battements par seconde (DECISIONS : les battements rapides sont faits de quelques dessins).
- **Ailes** : tegmina et ailes postérieures sont des quads au runtime (`essaim.placeWings`). Ils sont masqués au repos par la clé `wingsShown`.
- **Attitude** : le corps est incliné tête haute, l'abdomen pendant et les pattes postérieures traînantes (c250).
- **Vitesse** : 0,9 m/s ; les vols durent 0,8 à 2,2 s. Ce sont des ordres de grandeur, à mesurer sur vidéo.

## Sur les fleurs
- **Visite** : la sauterelle se pose et reste longtemps, 10 à 28 s (à mesurer). Elle alterne l'immobilité, antennes en mouvement, et quelques pas sur la fleur.
- **Départ** : elle saute puis vole jusqu'à une fleur voisine. Une fois sur quatre, elle quitte la vue.
- **Clic** : saut et fuite.

## Nombre
Trois au plus à l'écran (DECISIONS). Démo : `insectes/demo/index.html?n=0&sauterelle=2&taille=3`, serveur `insectes-09` sur le port 8829.
