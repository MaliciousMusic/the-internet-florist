# Scène de la boutique — plan

Demande du porteur, 15 octobre 2026 : le nouveau site de la boutique, où l'on retrouve les NFT frappés et mis en vente
chaque jour sur notre OpenSea, et où on les achète depuis le site. Le cadre du site est une scène entièrement en SVG :
un bouquet sur un pilier de pierre, au milieu d'une prairie fleurie, sous un ciel de plein jour.
Image de départ : capture du porteur (cartes en verre en haut, bouquet sur une colonne de lave, champ de tulipes).

## Décisions (QCM du 15 octobre)

- **Cadrage :** une scène panoramique pour l'ordinateur. Sa colonne centrale reprend le cadrage de l'image, et c'est
  elle seule que voit le téléphone. Rien ne sort de l'écran.
- **Bouquet :** celui de la carte choisie. Toucher une carte fait éclore ce bouquet sur le pilier (`growBq`).
  Le produit est le bouquet avec son vase (carpe en bronze, danseuses Lalique, puis les vases à venir).
  Le verre dépoli de l'image n'est pas à faire.
- **Lumière :** plein jour : ciel bleu franc, soleil haut, ombres courtes. Une seule version de chaque décor.
  Convention commune à tous les décors et au moteur : soleil à environ 57° de hauteur, à gauche et un peu derrière le
  spectateur (vecteur `SUN` du procédé, même azimut que la lumière de la boutique). Les faces gauches et les sommets sont éclairés ; les ombres portées sont courtes, vers la droite et un
  peu vers le fond, comme celles des fleurs. Le ciel est un peu plus pâle du côté gauche.
- **Pilier :** colonne ronde rustique, taillée grossièrement, arêtes usées, lichen et mousse au pied. Trapue comme
  l'image (hauteur ≈ 1,7 diamètre), en lave sombre très alvéolée comme l'image (voir État).
- **Dalles :** un pas japonais : des dalles plates irrégulières, espacées dans l'herbe, qui partent du premier plan
  et mènent au pied du pilier. L'herbe déborde sur leurs bords.
- **Horizon :** haies basses, bosquets et quelques arbres ronds, voilés par la distance. Horizon plat : ni montagne,
  ni colline, ni crête au loin (porteur). Les photos de référence n'ont pas besoin de venir d'Auvergne.
  Végétation « suggérée » : une lisière lointaine (500 m et au-delà), continue et étagée comme sur l'image ; pas
  d'arbre isolé proche (retiré après la première planche, où il faisait « taches de peinture »).
- **Échelle de jugement :** sur un téléphone à écran 3×, le monde s'affiche à environ 1,8 pixel par unité. Le détail
  des décors se juge donc rendu à 2× la taille du monde.
- **Nuages (porteur, après la première planche) :** pas de gros nuage proche. Le ciel est dégagé dans ses deux tiers
  hauts ; dans le tiers bas, des voiles et traînées très légers, minces et étirés, font presque un dégradé du blanc,
  au ras de l'horizon, vers le bleu, comme sur la maquette (en plein jour, sans la chaleur de fin de journée).
  Les cumulus de la première version sont abandonnés. Références : `decor/refs/voiles.md`.
  Planche vue par le porteur : bleu du haut « maquette » (#7ba4d4, plus doux que le bleu mesuré), ras #dde6ee,
  voiles gardés très discrets (presque un pur dégradé). La lisière de l'horizon est calée sur ce ras.
- **Prairie :** seulement nos espèces finies, celles du lot Printemps à la carpe : tulipes, renoncules, narcisses,
  jacinthes, anémones, iris, muscaris, fritillaires… Ni coquelicot ni lupin. Porteur, après le premier assemblage :
  « parmi nos plus belles et des espèces cohérentes » (fleurs de pleine terre de printemps, ni branches, ni arbustes,
  ni grimpantes), un champ généreusement fleuri. Porteur, sur la première prairie fleurie : tiges de tulipes beaucoup
  trop grosses ; plus grande variété de nos fleurs au sol, des plus petites et des plus longues ; « sinon on y arrive ».
- **Dalles (porteur, après le premier assemblage) :** enfoncées dans le sol avec de la mousse, et un passage fauché
  dans l'herbe jusqu'au pilier.

## Décors à créer, avec le soin des fleurs

Six décors : ciel, nuages, végétation de l'horizon, herbe (trois distances), pilier de Volvic, dalles.
Chacun suit le procédé du standard de rendu (`docs/STANDARD-RENDU.md`) :

1. **Références :** 15 à 25 vraies photos par décor (Commons, iNaturalist, Flickr), regardées et mesurées.
   Elles restent dans `refcache/`, jamais dans un dépôt. Pour les gros plans de matière (alvéoles, brins, franges),
   au moins 6 photos en 1600 px ou plus : les vignettes de 400 px ne se mesurent pas au millimètre.
2. **Relevés chiffrés :** couleurs par zone (lumière, ombre, reflet), proportions, tailles réelles, densités.
   Brief dans `decor/refs/<décor>.md`.
3. **Modèle :** un module SVG paramétrique, écrit par un modeleur Opus dans un contexte neuf. Une graine donne des
   variantes uniques, jamais un dessin figé. SVG natif seulement : ni image incorporée, ni 3D.
4. **Lumière calculée, pas peinte :** le modelé vient de la normale de la surface et du vecteur soleil commun,
   `SUN = normalize(-0.5, 1.2, 0.6)` (x à droite, y en haut, z vers le spectateur ; même azimut que `LV` de
   `v1a.js`, hauteur d'environ 57°). Les ombres portées en découlent.
5. **Comparaison :** côte à côte avec les références, à la même échelle, en entier et en gros plan à 1:1, par passes
   isolées (forme, matière, lumière, ombre).
6. **Critique indépendante :** un autre agent, qui n'a pas modélisé, confronte la planche aux photos et aux
   critères du standard (§ 1), et liste les défauts. Je regarde ensuite la planche à 100 %. Rien n'est montré au
   porteur avant ces deux passes.
7. **Contrôle :** aucun artefact ; poids et temps de rendu mesurés (resvg, puis Chrome quand la mémoire le permet).
8. **Validation** du porteur sur planche, image entière et gros plans.

Lots de trois décors au plus, chacun fini avant le suivant :
- **Lot D1, le fond :** ciel, nuages, horizon.
- **Lot D2, le sol :** herbe, pilier, dalles.
- **Lot D3, la scène :** prairie fleurie (fleurs du moteur en niveaux de détail), assemblage des plans,
  page de mesure des performances.

## La caméra commune (pour le sol, le pilier, les dalles, l'herbe et les fleurs)

Calée sur la maquette du porteur (plateau du pilier presque sur l'horizon, pied à 77 % de la hauteur, grosses tulipes
en bas de l'image) :
- focale `f = 1854` unités (40° de champ vertical sur 1350), ligne d'horizon `y = 722`, œil à `0,75 m` du sol ;
- un point du sol à la distance `z` (m) tombe en `y = 722 + 1854 × 0,75 / z` ; une hauteur `h` (m) à la distance `z`
  mesure `1854 × h / z` unités ;
- le bas du cadre (`y = 1350`) est le sol à 2,2 m ; les fleurs plus proches ont leur pied hors cadre, leurs têtes
  dedans (tulipe de 45 cm à 1,2 m : tête vers `y = 1185`) ;
- **pilier** : centre du pied en `x = 1200`, à `z = 4,37 m` (pied en `y = 1040`), hauteur 0,80 m (plateau vers
  `y = 700`), diamètre 0,47 m (environ 200 unités) ;
- **pas japonais** : du bas du cadre (2,2 m) au pied du pilier (4,4 m), donc 4 à 5 dalles de 30 à 45 cm, un pas de
  55 cm, une légère courbe ;
- la lisière de l'horizon (calculée avec un œil à 1,7 m) n'en dépend presque pas : elle est à plus de 480 m.

Le bouquet suit l'échelle de la maquette, plus grande que nature par rapport au pilier : c'est le produit, au centre.

**Assemblage du sol par profondeur.** Les plans fixes du sol (prairie, chemin, pilier) ne s'empilent pas plan par plan :
une herbe plus proche qu'une dalle doit la recouvrir. L'assembleur compose donc le sol par bandes de profondeur, du
plus loin au plus proche (prairie lointaine, herbe derrière le pilier, pilier, puis dalles et herbe intercalées selon
leur distance), et peut fusionner le tout en un seul fichier fixe. Le long du chemin, l'herbe est plus courte (foulée,
tondue) ; la prairie haute et ses fleurs sont de part et d'autre.

**À reprendre sur les dalles (planche D2, avis du chef de chantier) :** elles se lisent comme des galettes posées sur
l'herbe. Un pas japonais est posé à fleur du sol : 1 à 3 cm de tranche visible au plus, une arête irrégulière,
l'herbe qui mange les bords et un peu le dessus ; le dessus en lave moins régulier (pas de petits traits
horizontaux ni de points clairs uniformes). À faire pendant l'assemblage, sur la vraie prairie.

## Les plans, de l'horizon au premier plan

| z | Plan | Contenu | Mouvement |
|---|---|---|---|
| 0 | Ciel | dégradé du zénith à l'horizon, voile clair au ras de l'horizon | aucun |
| 1 | Voiles hauts | traînées très légères du haut du tiers bas du ciel | dérive très lente, en boucle |
| 2 | Voiles bas | voiles minces qui blanchissent le ras de l'horizon | dérive plus lente encore (parallaxe) |
| 3 | Horizon | haies, bosquets, arbres ronds, voile de distance | aucun |
| 4 | Prairie lointaine | herbe en texture, taches de fleurs | aucun |
| 5 | Prairie médiane | touffes d'herbe, fleurs du moteur en petit | aucun |
| 6 | Chemin | dalles du pas japonais, herbe qui déborde | aucun |
| 7 | Pilier | colonne de Volvic, mousse au pied, ombre courte | aucun |
| 8 | Bouquet | vase et bouquet du NFT choisi | éclosion `growBq`, puis brise |
| 9 | Premier plan | herbes hautes et tulipes en grand, par touffes | balancement de chaque touffe autour de sa base |
| 10 | Interface | cartes produit en verre, panneau d'achat | HTML |

Seuls trois plans bougent : les nuages, le bouquet et le premier plan, comme demandé.

## Pour que le site charge bien

- **Les plans fixes sont des fichiers SVG affichés par `<img>`.** Le navigateur les dessine une fois, les garde en
  texture et ne les retouche plus. Ils ne pèsent rien dans le DOM. Seul le bouquet vit dans le DOM, parce que le moteur
  le fait éclore.
- **On n'anime que des transformations** (translation, rotation), que la carte graphique compose seule. Jamais un tracé,
  un filtre ou une opacité (règle de l'éclosion). `will-change: transform` sur les plans animés seulement.
- **Voiles nuageux :** chaque voile est une `<img>` qui glisse en CSS. Aucun calcul par image côté JavaScript.
- **Premier plan :** 6 à 10 touffes, chacune une `<img>` qui tourne de 1,5° au plus autour de sa base, avec des phases
  décalées de gauche à droite : une rafale qui passe, pas une danse. Pas de brin animé seul.
- **Ordre de chargement :** ciel et horizon (quelques Ko), puis prairie, chemin et pilier, puis l'éclosion du bouquet,
  enfin le premier plan ; les nuages se mettent à dériver en dernier.
- **Sobriété :** animations arrêtées quand la scène sort de l'écran ou que l'onglet est caché ; avec
  `prefers-reduced-motion`, scène immobile et bouquet déjà ouvert.
- **Cadrage :** tous les plans partagent le même repère, 2400 × 1350. La colonne centrale fait 760 de large : c'est
  le cadrage 9:16 de l'image. L'essentiel (pilier et bouquet) tient dans ses 620 du milieu, pour les téléphones plus
  allongés (9:19,5). Les plans sont posés en `object-fit: cover` et centrés en bas : le téléphone recadre sur la
  colonne, sans recalcul.
- **Repères de l'image** (fractions de la hauteur) : cartes 5 à 18 %, sommet du bouquet 17 %, plateau du pilier 53 %,
  ligne des haies 53 à 55 %, pied du pilier 77 %, premier plan 80 à 100 %. Pilier : 26 % de la largeur de l'image,
  hauteur 1,7 fois son diamètre.
- **Budget visé :** décors fixes sous 400 Ko compressés au total, chaque nuage sous 15 Ko, chaque touffe sous 25 Ko.
  À mesurer en lot D3.

## Le site (QCM technique du 15 octobre)

- **Rôle :** le site sert à vendre les NFT et à soutenir le projet. Ce n'est pas la boutique physique du fil rouge des
  courts.
- **Achat :** on frappe et on met en vente chaque jour sur notre OpenSea. Le site lit nos annonces, et l'acheteur les
  règle depuis son portefeuille sans quitter le site (Seaport, le protocole d'OpenSea). Il faut une clé d'API OpenSea
  gratuite, prise avec le compte OpenSea de la boutique.
- **Chaîne :** Base.
- **Code :** un nouveau dépôt privé sur le GitHub du porteur, séparé du jeu et du studio ; déploiement sur
  Cloudflare Pages.

- **Cartes (porteur, 15 octobre) :** prix en ETH, avec son équivalent approximatif en euros dessous. Le prix d'un
  bouquet est la somme des prix réels de ses tiges ; le vase est offert. Toucher une carte fait éclore son bouquet sur
  le pilier, sans fiche ; un bouton « Acheter » fixe en bas de l'écran sert pour le bouquet affiché.

Encore ouverts : le nom et le domaine du site, et le format du bouquet NFT
(SVG fixe ou animé), qui conditionne la façon dont le site fait éclore le bouquet.

## Bouquets pré-dessinés (15 octobre)

Premier assemblage mesuré : le moteur complet dans la page (1,8 Mo gzip) fait attendre 30 s sur un téléphone moyen
avant l'éclosion. Décision de chantier : chaque bouquet est dessiné une fois à l'avance (plus tard, à la frappe de
chaque NFT), découpé en pièces SVG avec un manifeste ; la page ne charge que ces pièces et une éclosion légère qui
rejoue `growIn` et la brise par transformations. Les miniatures des cartes sont des versions allégées du même
bouquet, en SVG. Les prix sont calculés à la construction, sur les tiges réellement dessinées (le moteur n'en dessine
pas toujours autant que le modèle en prévoit : Ronde bleue 37 sur 54), prix de `catalogue/recettes/sens_prix_0X.json`.

Résultat mesuré (téléphone émulé 390 × 844, dpr 3, processeur ×4) : l'éclosion commence à 1,5-1,8 s au lieu de 30 s ;
ordinateur 1,1 s au lieu de 6,9 s ; animation composée par la carte graphique (croissance sur l'image, brise sur sa
boîte). Carpe pré-dessinée : 140 fichiers, 861 Ko gzip ; `eclosion.js` 5 Ko gzip. Miniatures 15 à 106 Ko gzip (carpe
106, Ronde bleue 89 : au-dessus des 80 visés, gardées en SVG). Lignes et drapés poussent depuis leur pied.

Points ouverts : le corps en bronze de la carpe reste l'image WebP calculée du moteur, intégrée au SVG du vase (règle
« que du SVG » : question à poser au porteur) ; les décors dépassent largement le budget de 400 Ko gzip visé au départ
(sol fleuri 711 Ko avant reprise) : mesurer sur un vrai réseau avec compression brotli, et alléger ce qui est caché.

## Après la scène (porteur, 15 octobre)

Une fois la scène assemblée : les menus, le pied de page avec les mentions légales, les polices, puis les
fonctionnalités complémentaires. À définir d'abord par QCM avec le porteur. Rappel : un site qui vend doit afficher
l'identité de son éditeur dans ses mentions légales.

## État

- 2026-10-15 : décisions prises, plan écrit, références des six décors mesurées (`decor/refs/*.md`) ; modelage du
  lot D1 (ciel, nuages, horizon) en cours.
- Tranché par le porteur avant le lot D2 :
  - **Pilier trapu comme l'image :** hauteur ≈ 1,7 fois le diamètre (les colonnes de jardin mesurées font 3,3).
  - **Lave sombre de l'image**, gris anthracite très alvéolé, plutôt que la Volvic de taille mesurée (gris chaud
    #86837f, pores fins). Références complémentaires de lave sombre : `decor/refs/lave.md`.
  - Mesuré sur le pilier de la maquette : médiane #3f3f37 (lumière du soir), creux sombres sur 16 % de la surface,
    trous lisibles un à un à 3 px/cm. On retient donc la lave fraîche (#4f5054 en plein jour, `lave.md`), des
    alvéoles moyennes et grosses (3 à 20 mm) tracées une à une sur un grain de scorie fine, lèvres éclairées côté
    soleil. La maquette est éclairée de droite ; chez nous, de gauche (`SUN`).
- 2026-10-15 soir : scène assemblée dans `scene/index.html` (servie par la configuration de lancement « decor »,
  port 8788). Ciel « maquette » et voiles, lisière, sol fleuri en trois fichiers (`sol-loin`, `sol-milieu`,
  `sol-pres`, 645 Ko gzip), pilier en lave, pas japonais enfoncé, 20 touffes au premier plan, bouquets pré-dessinés
  (éclosion à 1,5-1,8 s sur téléphone émulé), cartes en verre, bouton Acheter « Bientôt ». Rien n'est commité ; le
  dépôt privé du site n'est pas encore créé.
- Reste connu : têtes réduites un peu plates entre 3 et 5 m, quelques tiges visibles près de l'allée, pied droit du
  pilier peu fleuri ; corps de la carpe en image WebP (question au porteur) ; mesure sur vrai réseau avec brotli ;
  menus, pied de page, mentions légales, polices (QCM à venir).
- 2026-10-15 nuit (demande du porteur) : un clic sur le bouquet rapproche la caméra (toute la scène agrandie par une
  seule transformation, ×1,4 sur téléphone, ×2 sur ordinateur, redessinée nette à l'arrêt ; clic, Échap ou une icône
  pour reculer). En-tête : un dock d'icônes en verre (`entete.js`, `entete.css`) : vase fleuri (bouquets du jour), soliflore
  (rayon vide, « bientôt »), bouquets vendus (rayon vide, lien OpenSea), OpenSea, « À propos » (`scene/apropos.html`,
  texte provisoire). Pied de page : une pastille « Mentions légales » qui déplie un brouillon (identité de l'éditeur,
  droits attachés à un bouquet et lien de la collection OpenSea à compléter).
- 2026-10-15 nuit, suite (porteur) : en vue éloignée, le bouquet est dans un cadre en verre dépoli, un peu plus large
  que lui de chaque côté (7 % de sa largeur), pied sur le pilier, avec un bouton « Voir » dans le coin bas droit ;
  « Voir » (ou un clic sur le bouquet) ouvre le gros plan, où le cadre disparaît et la bulle prix (Acheter) monte en
  bas. En vue éloignée, la bulle prix est cachée.
- 2026-10-15 nuit, suite 2 (porteur, sur capture) : plus de bande de cartes en haut. Les bouquets sont une galerie de
  cadres en verre posés sur l'horizon, sous les plans du sol (le pilier et la prairie passent devant leur pied) : le
  bouquet choisi au milieu, sur le pilier devant son cadre ; les autres à gauche et à droite avec leur vignette à la
  taille réelle, les plus proches coupés par les bords de l'écran. La galerie tourne en boucle ; clic sur un cadre de
  côté, glissé du doigt ou flèches pour changer. Cadres de 460 × 595 unités, pas adapté à l'écran (voisins visibles sur
  environ 1/7 de la largeur). Le vase du dock ramène aux bouquets ; soliflores et vendus ouvrent leur panneau.
- 2026-10-15 nuit, suite 3 (porteur) : pied des cadres relevé à y 712, juste au-dessus de la prairie : leurs coins
  arrondis se voient, le pilier en cache le milieu. « Voir » centré sur la face du pilier, sous le cadre (y 736). Verre
  des cadres plus clair (voile 0,07 au lieu de 0,17 et plus, flou 3 px au lieu de 10). Bulle prix : le prix en ETH,
  puis sa valeur en euros, qui alternent toutes les 4 s (un rouleau qui glisse ; arrêté quand l'onglet est caché).
- 2026-10-15 nuit, suite 4 (porteur) : prix en euros exact au centime (prix ETH × cours en direct de CoinGecko, relu
  toutes les 5 min, sinon le cours de boutique.json) ; bascule ETH / euros toutes les 5 s, le nouveau prix descend
  d'en haut et écrase l'ancien. Dock plus grand (52 px, icônes de 40 px, 5 px d'air autour), à 14 px du haut. Gros plan
  centré sur l'axe du vase. Durée de vie : 3 mois après la frappe (champ `frappe` d'un produit ; à défaut, minuit UTC du
  jour, provisoire), compte à rebours en heures et minutes en haut des cadres de côté et
  au-dessus de la bulle prix ; ensuite « Fané » et bouquet montré immobile (son dessin fané reste à pré-dessiner).
  « 0 % de royalties à la revente » sous la bulle, dans les mentions et dans À propos. Bouton « En fond d'écran » qui
  ouvre la vidéo démo `scene/videos/fond-ecran.mp4` (à tourner ; en attendant, un message).
- 2026-10-15 nuit, suite 5 (porteur, version ordinateur) : sur un écran paysage de 900 px et plus, le dock passe en bas
  (au-dessus de la pastille des mentions ; les rayons s'ouvrent au-dessus de lui, la bulle prix aussi) ; jusqu'à cinq
  cadres visibles (le milieu, deux entiers de chaque côté, les deux derniers coupés par les bords : pas de 643 unités
  sur un écran 16:9 et plus large) ; le monde est abaissé d'un dixième de la hauteur de l'écran pour 10 % de ciel en plus
  au-dessus des cadres (couleur du zénith #6c9bcf au-dessus du ciel ; le bas du premier plan passe sous le bord).
  Téléphone inchangé.
- 2026-10-16 (porteur, sur captures plein écran / fenêtre) : sur ordinateur, le monde est accroché au bord haut de
  l'écran quelle que soit la forme de la fenêtre ; une fenêtre plus large que 16:9 cadre donc le ciel et les cadres comme
  le plein écran (référence du porteur) et montre seulement moins de premier plan. Le « dixième de ciel en plus » de la
  veille est retiré (sa capture plein écran n'en avait pas : feuille de style en cache) ; il reste réglable par
  `--ciel-en-plus` dans scene.css.
