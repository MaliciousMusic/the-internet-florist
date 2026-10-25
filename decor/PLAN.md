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
- 2026-10-16 (porteur) : une icône « Sur mon bureau » dans le dock (un écran avec un vase) ouvre `scene/bureau.html`,
  sur le fond fleuri immobile comme « À propos » : la vidéo tuto du bureau (`scene/videos/fond-ecran.mp4`, faite dans
  belai-studio, lot T10, version qui sera mise à jour) et le bouton « Télécharger Belai Bureau »
  (`scene/telechargements/`, copie de `bureau/livrables`, 3 Mo, Windows 10 et 11). La même vidéo sert au bouton
  « En fond d'écran » de la boutique.
- 2026-10-16 (porteur) : site en anglais (« Voir » devient « Open »), prix en ETH puis en dollars (cours CoinGecko,
  repli `coursUsd` de `boutique.json`). Pages renommées `about.html` et `desktop.html`, nouvelle page `legal.html`
  (mentions, CGV, confidentialité, licence de Belai Bureau, accessibilité ; brouillon à compléter), pied de page qui la
  résume. Référencement et moteurs de réponse : métadonnées, JSON-LD, FAQ, `sitemap.xml`, `robots.txt`, `llms.txt`
  (écrits par `scene/seo.mjs` après chaque `predessin.mjs`), `_headers` de sécurité, icônes, `share.jpg`. Audit et
  décisions attendues : `decor/AUDIT-LEGAL.md` (identité de l'éditeur, médiateur, euros pour la France, TVA, droits du
  bouquet, case de renonciation et reçu à l'achat, version française). Nom « Belai's Garden » et domaine
  `belai.garden` provisoires.
- 2026-10-16, suite (porteur) : site en cinq langues (anglais à la racine ; `fr/`, `es/`, `zh/`, `de/`), choisie
  automatiquement par `scene/_worker.js` selon le pays de l'adresse IP (cookie `lang` pour un choix à la main, robots
  jamais redirigés ; `worker-test.mjs`). Les pages sont écrites par `scene/build.mjs` depuis `scene/gabarits/` et
  `scene/langues/<code>.mjs` (`seo.mjs` retiré). Prix en ETH TTC puis en euros dans la zone euro, en dollars ailleurs.
  Mentions légales remplies (EI Hadrien Lonjaret, Agent 33), pas de licence : le bouquet appartient au détenteur du
  jeton. Volet « Avant de payer » avec la case de renonciation, et reçu à télécharger (`Boutique.recu`), en attente
  du paiement Seaport. Reste : médiateur de la consommation, activité à déclarer, TVA avec un comptable
  (`decor/AUDIT-LEGAL.md`).
- 2026-10-16, suite 2 (porteur) : micro-entreprise en franchise de TVA ; « toutes taxes comprises » devient « TVA non
  applicable, art. 293 B du CGI » dans les cinq langues, le pied de page et le reçu.
- 2026-10-16, performances (porteur : « le site est trop lent ») : mesuré sur téléphone simulé et PC ; le décor fixe en
  SVG (26 000 éléments, lus et dessinés en entier même hors champ) faisait l'essentiel du blocage. Sans rien changer au
  dessin : le téléphone charge le décor recadré sur sa colonne (`decor/out/colonne/`, écrit par `scene/recadre.mjs`,
  vérifié au pixel près, à relancer après tout changement d'une couche) ; le chargement est étagé (ciel et horizon, puis
  voiles et sol d'un coup, puis le bouquet préparé entier avant sa pousse, puis les touffes et vignettes à l'écran
  seulement). Téléphone : premier affichage 5,3 → 0,7 s, plus grand affichage 13,8 → 2,6 s, pousse 1 → 50 images/s.
  Ordinateur : plus grand affichage 20,9 → 3,0 s, mais la pousse reste à 12 images/s et le bouquet part vers 10 à 13 s.
  Question ouverte au porteur : servir le décor fixe en WebP pré-rendu depuis les SVG (le produit reste en SVG) ?
- 2026-10-24 (porteur) : les insectes finis volent sur le site, à leur vraie taille (`scene/insectes.mjs`) : 4 abeilles, le
  machaon, 2 paons-du-jour (3 papillons au plus), la cétoine, le moro-sphinx et la sauterelle. Ce sont des sprites de leurs
  atlas WebP, posés par PixiJS dans des canvas intercalés entre les plans :
  - derrière le bouquet ;
  - entre ses quatre boîtes de profondeur (`eclosion.js`, option `plans`) ;
  - devant lui ;
  - devant les touffes du premier plan.
  La perspective suit la caméra commune : point de fuite au milieu de l'horizon, distance d = 4,37 m × (1 − z / 1400).
  La taille suit la distance : vraie taille contre la prairie (1,854 / d unités par mm). Au bouquet, dessiné 1,8 fois plus
  grand que nature, c'est la vraie taille contre ses fleurs, et l'insecte passe en douceur de l'une à l'autre en s'éloignant.
  Chargement et comportement :
  - ils arrivent après la première éclosion ; l'éclosion part toujours à 4,1 s, avec ou sans eux ;
  - le gros plan les redessine nets et charge les grands niveaux de détail ;
  - quand le bouquet se replie, ils s'envolent ;
  - un clic sur un insecte le fait fuir sans ouvrir le gros plan ;
  - `?insectes=0` les retire ; il n'y en a aucun avec prefers-reduced-motion.
  Mesuré dans le panneau du navigateur : 55 images/s sur ordinateur (1,4 ms par image pour les insectes), 140 sur téléphone
  émulé. À faire pour le dépôt du site : y copier `insectes/runtime` et les atlas (aujourd'hui lus à la racine du dépôt,
  serveur « insectes-site », port 8830).
- 2026-10-24, suite (porteur) : les touffes animées du premier plan passent en sprites PixiJS. Les insectes vont surtout
  dans le parterre et un peu sur le bouquet ; la sauterelle reste au sol ; les fourmis n'y sont pas, elles auront un rôle
  dans le HUD, à définir.
  - **Touffes** : `decor/premier.mjs` cuit les 20 touffes de `out/scene.json` en WebP (`out/premier/`, 1 Mo, 1,6 px par
    unité, coupées au bord bas du cadre plus la portée du balancement). `insectes.mjs` les dessine dans la couche avant :
    c'est le canvas même du moteur, dessiné sans copie, où elles balancent comme le faisait le CSS et se trient en
    profondeur avec les insectes de moins de 2 m. `scene.js` ne charge plus les touffes SVG que si cette couche ne démarre
    pas (prefers-reduced-motion, `?insectes=0` ou échec).
  - **Où se posent les insectes** : sur les têtes du parterre et des touffes, lues dans les fichiers du sol par
    `decor/tetes.mjs` (`out/tetes.json` : 552 têtes au sol, 44 dans les touffes). La distance de chaque tête se lit sur
    l'échelle de sa matrice. S'y ajoutent les têtes du bouquet une fois qu'il a poussé.
  - **Réglages par espèce** : chaque espèce ne vise que les fleurs où son corps fait au moins 3 px, et ne connaît qu'un
    quart des fleurs du bouquet. Mesuré sur 30 s : 92 % des visites au sol, 8 % au bouquet. La sauterelle ne connaît que
    les fleurs du sol à moins de 6 m.
  - **Mesure** : 135 images/s dans le panneau du navigateur.
- 2026-10-24, QCM des fourmis (porteur) : sur le site, des paires de fourmis noires portent le HUD, à chaque fois, en
  procession et à vraie vitesse : la barre d'outils, les cases de la bulle de prix et la pastille Legal. Sur téléphone, deux
  papillons posent la barre d'outils en haut. Une fourmi magique d'environ 16 cm apporte le bouton Open au pilier, une fois
  par visite. Le détail est dans `insectes/DECISIONS.md`, section « Fourmis du HUD ». La production n'a pas commencé.
- 2026-10-24, prototype des porteuses (porteur : « reprends d'abord la fourmi noire, puis le prototype des porteuses ») :
  - **`decor/scene/porteuses.mjs`** : des paires de fourmis noires, vues de dessus sur la vitre de l'écran, apportent à chaque
    fois la pastille Legal et le dock (ordinateur) à l'ouverture, puis les trois cases de la bulle au gros plan, et les
    remportent quand on recule. Elles déplient et replient aussi le panneau Legal en tirant son bord. Elles marchent à vraie
    vitesse, en procession de gauche à droite, et les pièces restent cliquables en route. Les fourmis sont dessinées sur un
    canvas PixiJS posé sur le HUD (niveau H de l'atlas), les pièces bougent par les propriétés CSS `translate` et `rotate`.
  - **Téléphone** : un machaon et un paon-du-jour posent le dock en haut (un essaim à eux, ailes en quads).
  - **`decor/scene/fourmi-open.mjs`** : une fois par visite, une fourmi de 16 cm sort du bas du cadre avec le bouton Open,
    passe sur les quatre dalles (`out/chemin.json`), monte le pilier et pose le bouton. Elle est un insecte de l'essaim de la
    scène (niveau O de dos, H de dessus sur le pilier), qui reçoit deux clés nouvelles : `b.lod` et `b.view`.
  - **Repli** : la classe `porteuses`, ou `fourmi-open`, est posée par `scene.js` dès le premier affichage. Elle ne l'est pas avec
    prefers-reduced-motion, `?porteuses=0` ou `?insectes=0`, et elle est retirée si les fourmis ne partent pas à temps (6 s,
    45 s pour Open). `?lent=8` ralentit tout pour regarder.
- 2026-10-24, deuxième prototype des porteuses (porteur : de profil sur le rebord, jamais en paire, les fourmis se montent
  dessus, attention aux chevauchements) :
  - une fourmi par case, la case levée au-dessus d'elle ;
  - des piles de fourmis pour monter sur le dock puis sur Buy ;
  - des sauts au bout des rebords pour repartir ;
  - 22 px de place entre les pièces empilées.
  Le détail et les durées mesurées sont dans `insectes/DECISIONS.md`. La fourmi d'Open revient à chaque chargement et part dès
  que le bouquet a poussé. Les papillons du téléphone tiennent le dock par ses bouts et sont 25 % plus petits.
- 2026-10-25, panneau Legal (porteur) : il s'ouvre et se referme seul, sans fourmis. Les fourmis n'apportent que la pastille.
- 2026-10-25, pager (porteur : « apporté par une coccinelle et une cétoine en volant ») : une fois par chargement, après le
  dock, une coccinelle et une cétoine l'apportent en volant, une à chaque bout, jusqu'à sa place : au-dessus du dock sur
  ordinateur, sous lui sur téléphone. `porteuses.mjs` le garde hors de l'écran (classe `porteuses`) jusqu'à leur arrivée, et
  attend que `boutique.js` le montre. Le pager lui-même vient de la branche `ch/site-leger`. Taille des insectes validée
  par le porteur : 2,5 px/mm, coccinelle 18 px, cétoine 45 px. Après le gros plan et l'étagère, il réapparaît seul,
  sans les insectes (porteur).
- 2026-10-25, retour du porteur sur les volants et la fourmi d'Open : cétoine nette (grand niveau d'atlas), coccinelle qui
  bat des ailes au lieu de faire l'hélice, pager qui penche du côté de la coccinelle pendant le trajet. Fourmi d'Open trois
  fois plus petite, qui tient le bouton par son bord inférieur et repart par le côté du pilier. Elle garde le vrai pas
  d'une ouvrière : bouton posé vers 18 s (porteur). Détails dans `insectes/DECISIONS.md`.
