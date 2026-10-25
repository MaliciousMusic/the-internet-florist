# Chantier insectes — décisions

QCM du 2026-10-23 avec le propriétaire. Ce fichier fait foi pour le chantier. Les questions encore ouvertes sont à la fin.

## Espèces

Abeille, bourdon, coccinelle, fourmi noire et rouge, moro-sphinx (*Macroglossum stellatarum*), paon-du-jour (*Aglais io*),
machaon (*Papilio machaon*), cétoine dorée, sauterelle.

## Rendu

- **Source en SVG**, aussi réaliste que possible, avec le même protocole que les fleurs : photos de référence nommées,
  mesures, fiche par pièce, planches de test, budget, contrôle de sortie en gros plan.
- **Modèle assemblé par pièces** (tête, thorax, abdomen, segments de pattes, ailes, antennes) placées en 2,5D. Il doit
  rester juste sur toute la sphère 24 × 24 (576 facettes).
- **Atlas réduit aux vues utiles, symétrie comprise** : environ 9 azimuts dessinés, l'autre moitié en miroir, 6 élévations
  sans le dessous, soit une centaine de vues. Le nombre final est fixé par un test de saut entre vues. Deux tailles
  d'image : petite pour les insectes au loin, grande pour les passages près de l'écran.
- **Ailes plates en plans texturés** : papillons, moro-sphinx au repos, élytres ouvertes. Chaque face est dessinée une fois en
  SVG, puis mise en perspective par WebGL. Aucune case d'atlas pour elles.
- **Battements rapides** (abeille, bourdon, moro-sphinx en vol) : un faux d'animation traditionnelle, avec 2 ou 3 dessins
  qui bouclent. Chaque dessin superpose deux jeux d'ailes en arc. Les positions suivent le vrai mouvement de l'espèce
  (aller-retour en huit, pas un haut-bas). Pas de flou gaussien.
- **Exception à « que du SVG »** (accord du propriétaire, 2026-10-23) : la source reste en SVG ; les atlas WebP en sont
  une sortie compilée. Règle amendée dans `AGENTS.md`.
- **Affichage** : canvas WebGL (PixiJS). Les images sont calculées hors ligne avec resvg, pas avec Chrome headless.
- **Lumière** (validée le 2026-10-23) : du haut et de face, sans composante latérale, fixe dans le repère de la caméra.
  Le miroir des vues reste donc exact.
- **Taille à l'écran** (2026-10-23) : vraie taille, à l'échelle du bouquet. Une abeille de 12,5 mm fait environ 9 px à
  côté d'une tulipe de 5 cm. Pas de facteur d'agrandissement sur le site.
- **Lumière face au décor** (2026-10-23) : l'atlas garde la lumière haut-avant, même si le soleil du décor de la boutique
  vient de la gauche (`SUN` de `decor/PLAN.md`).
- **Profondeur** : un canvas intercalé entre chaque plan de profondeur du bouquet SVG. Chaque fleur expose ses points de pose.

## Nombre à l'écran (au plus, en même temps)

| Espèce | Max |
|---|---|
| Abeille | 4 |
| Bourdon | 3 |
| Coccinelle | 4 |
| Fourmis | 7–8 |
| Moro-sphinx | 1 |
| Cétoine | 1 |
| Sauterelle | 3 |
| Paon-du-jour | 2 |
| Machaon | 1 |

Soit une vingtaine au total.

## Surfaces

- **Site boutique** (scène de jour, `decor/`).
- **Widget Belai Bureau** (`bureau/`), avec deux petits événements :
  - un insecte (abeille, papillon ou coccinelle) sort du pot, s'envole puis revient. L'événement ne se déclenche que si
    le bouquet est visible à l'écran, non masqué par une autre fenêtre ;
  - un clic sur les fourmis les fait ramasser les pétales fanés.
- Fonctions cachées du bouquet : à concevoir plus tard, dans leur propre QCM.

## Comportement

Libre, selon une grille par espèce (plans d'avant en arrière, vol vers l'écran ou hors de l'écran, pose sur les fleurs).
Pas de contrôle par le joueur ; un clic déclenche un état (saut, envol, fuite…).

## Pilote

**L'abeille**, de bout en bout : SVG, modèle, atlas, Pixi, comportement de butinage, pose sur le bouquet, battement en
2 ou 3 dessins.

## Fourmis du HUD (site)

QCM du 2026-10-24 avec le propriétaire. Sur le site, les fourmis ne butinent pas : elles portent les pièces du HUD.

- **Espèce** : la fourmi noire (*Lasius niger*). La fourmi rouge n'a pas de rôle sur le site pour l'instant.
- **Taille** : le HUD est sur un plan tout proche de l'œil. À l'écran, une fourmi a la longueur du bouton Open, environ
  50 à 60 px sur un écran d'ordinateur (une ouvrière de 5 mm vue à une douzaine de centimètres).
- **Par deux** : chaque pièce est portée par deux fourmis, dans leurs mandibules :
  - la barre d'outils (le dock d'icônes), d'un seul tenant ;
  - dans le gros plan, chaque case de la bulle : « Fades in… », « On your desktop », le bouton Buy avec son prix ;
  - la pastille Legal du bas. Elles la déplient et la replient en tirant dessus (remplacé le 2026-10-25 : le panneau
    s'ouvre seul, voir le deuxième prototype).
- **Sans fourmis** : la ligne de revente apparaît seule, une fois Buy posé. Les cartes des rayons s'ouvrent seules.
- **À chaque fois** : une paire fait chaque arrivée et chaque départ de ces pièces. C'est le cas au chargement, à l'entrée
  et à la sortie du gros plan, et à chaque dépli de la pastille.
- **En procession** : les fourmis entrent par la gauche et longent le bord de l'écran. Elles posent la pièce, puis
  ressortent par la droite. Quand une pièce s'en va, une paire vient la prendre et l'emporte par le même chemin.
- **Vraie vitesse** : celle d'une ouvrière à ce plan, soit 2 à 3 s pour venir du bord. Une pièce répond aux clics dès
  qu'elle entre dans l'écran, même portée.
- **Sans charge**, les fourmis ne se montrent pas.
- **Téléphone** : la barre d'outils est en haut. Deux papillons la posent, un machaon et un paon-du-jour, un à chaque bout.
  Des paires de fourmis portent le reste, comme sur ordinateur.
- **Le bouton Open** : une fourmi le pose une seule fois par visite, à la première vue large. Elle mesure environ 16 cm dans
  le décor : c'est une fourmi magique, qui a ainsi la taille du bouton au pilier. On la voit d'abord grosse au premier
  plan (environ 240 px). Puis elle marche sur les pierres du sol, rapetisse avec la perspective, monte le pilier et y pose
  le bouton. Ensuite, le bouton revient seul.

Retour du porteur sur le premier prototype (2026-10-24, soir) :
- les fourmis marchent **vues de profil, sur le rebord**, jamais vues de dessus ;
- **jamais en paire** : une fourmi par élément, qu'elle tient levé comme les fourmis tiennent leurs feuilles ;
- pour atteindre la hauteur du dépôt, **les fourmis se montent dessus** ;
- **attention aux chevauchements** ;
- la fourmi d'Open revient **à chaque chargement** de la page ;
- les papillons tiennent le dock **par ses extrémités**, et ils sont **25 % plus petits**.

Deuxième prototype (`decor/scene/porteuses.mjs`) :
- **Rebords** : le bas de l'écran est un rebord, et le dessus de chaque pièce posée en est un aussi.
- **Port** : la fourmi porte sa case au-dessus d'elle, tête levée (pose « feuille » de l'atlas, niveau P de profil), la case
  toujours droite.
- **Piles** : pour monter d'un rebord à l'autre, d'autres fourmis s'empilent, couchées l'une sur le dos de l'autre, contre la
  gauche de la pièce du dessus. La porteuse grimpe la pile.
- **Chemin** : une case arrive tenue derrière sa porteuse par son bout droit ; une case qui part est tenue devant elle, par
  son bout gauche. Les fourmis qui repartent se laissent tomber du bout des rebords, comme le font les fourmis.
- **Chevauchements** : la porteuse lève sa case au-dessus de ce qui est sur son chemin (pastille, piles), en se cabrant.
  Chaque porteuse attend au pied des piles que la précédente soit passée. Le contrôle automatique, image par image, ne
  relève aucun chevauchement entre cases. Il reste des contacts de fourmis de 15 à 20 px de côté, surtout dans les coins
  arrondis des pièces.
- **Place** : pour qu'une fourmi passe sous une pièce sans la toucher, la classe `porteuses` laisse 22 px entre les pièces
  empilées : le dock 12 px plus haut sur ordinateur, les deux petites cases 14 px plus haut au-dessus de Buy.
- **Durées** (à vraie vitesse, mesurées image par image) :

  | séquence | durée |
  |---|---|
  | ouverture sur ordinateur (dock posé à 3,5 s, pastille à 7,6 s) | 9,5 s |
  | bulle sur ordinateur, assemblage (Buy à 6,7 s, petites cases à 14 et 16,9 s) | 26 s |
  | bulle sur ordinateur, départ | 38 s |
  | bulle sur téléphone (Buy à 2,5 s, petites cases à 8,2 et 10,3 s) | 20 s |
  | départ sur téléphone | 29 s |

  Ces durées comptent les piles qui se défont.
- **Panneau Legal** (décision du porteur, 2026-10-25) : il s'ouvre et se referme seul, sans fourmis. De profil, rien ne se
  trouve au-dessus du panneau pour qu'une fourmi s'y accroche et le tire. Les fourmis n'apportent que la pastille.

Le pager (demande du porteur, 2026-10-25, relayée par la session « Optimisation site marchand ») : « le pager en haut où en bas
est apporté par une coccinelle et une cétoine en volant ».
- **Qui** : la coccinelle tient le bout gauche, la cétoine le bout droit, celui qui va devant. Elles le tiennent par-dessus,
  pattes sur le bord haut, et volent avec leur propre vol : élytres levées et ailes battantes pour la coccinelle, élytres closes
  et ailes sorties pour la cétoine, corps cabré.
- **Chemin** : elles entrent par la gauche, le pager à plat entre elles. Sur ordinateur, elles descendent jusqu'au-dessus du
  dock ; sur téléphone, elles montent jusque sous le dock. Elles le posent, le lâchent et repartent vers la droite.
- **Quand** : une fois par chargement, après le dock (posé par la fourmi sur ordinateur, par les papillons sur téléphone), et
  dès que le pager a ses points (il en faut au moins deux).
- **Durées** (mesurées image par image) : pager posé 3,9 s après le dock sur ordinateur, 2,1 s après sur téléphone. Les deux
  insectes ont quitté l'écran 3 s plus tard.
- **Taille** (décision du porteur, 2026-10-25) : 2,5 px/mm, soit une coccinelle de 18 px et une cétoine de 45 px (constante
  `BEETLE_PXMM`). À l'échelle des papillons du dock (1,125 px/mm), la coccinelle n'aurait fait que 8 px sous un pager de 22 px.
  Les deux coléoptères sont donc plus près de l'œil que les papillons, et la cétoine reste plus petite qu'une fourmi du HUD
  (56 px).
- **Code** : `airlift()` de `decor/scene/porteuses.mjs` sert maintenant aux deux duos volants, les papillons du dock et les
  coléoptères du pager.

Question au porteur, avec ma proposition :
- **Gros plan et étagère** : le pager est masqué en gros plan et sous l'étagère ouverte. Je propose qu'il réapparaisse seul,
  sans que les deux insectes le rapportent à chaque fois. Sinon, une coccinelle et une cétoine voleraient à chaque retour du
  gros plan.

Propositions, à valider sur le premier prototype :
- ~~**Pose** : les fourmis marchent de profil sur le bord bas de l'écran comme sur un sol. Elles tiennent la case levée
  devant elles.~~ Remplacée par la vue de dessus, voir plus haut.
- **Vitesse de la fourmi d'Open** : autant de longueurs de corps par seconde qu'une vraie ouvrière. Elle va donc du premier
  plan au pilier en 4 s environ, et le bouton est cliquable en route.
- **Accessibilité** : avec prefers-reduced-motion, ni fourmis ni papillons, et les pièces apparaissent directement. Les
  pièces sont dans la page dès le départ, pour le clavier et les lecteurs d'écran.
- **Technique** : le HUD reste en HTML. Une couche PixiJS posée dessus, qui laisse passer les clics, dessine les porteuses.
  À chaque image, la case suit la pointe des mandibules par une transformation.
- **Préalable** : le troisième juge a encore noté la fourmi noire « ko » sur ses six vues (`fourmi-noire/ETAT.md`). Ces
  défauts se verront à 60 px, et plus encore à 240 px. La vue de profil et son grand niveau de détail sont à reprendre avant
  le site.
- **Durée** : à vraie vitesse, une paire met 6 à 7 s pour traverser tout l'écran. Quand on quitte le gros plan, les cases
  de la bulle restent donc visibles quelques secondes, le temps qu'on les emporte.

## Questions ouvertes

- Grille de comportement détaillée de chaque espèce (états, vitesses, durées) : à mesurer sur vidéos, puis à valider.
- Détection « bouquet non masqué » du widget : à vérifier selon la technique de `bureau/`.
- Fonctions cachées du bouquet.
