# Moro-sphinx (Macroglossum stellatarum) : état au 2026-10-24

Session 07 du chantier insectes. Reprise réaliste par la méthode du machaon (PROTOCOLE §1 à §7, §3.4 à §3.6).

## Fait

### Photos par organe
Le registre `refcache/macroglossum/refs-organes.json` couvre tous les besoins (`refs_hd.py couverture`). La seule ligne
manquante, « ailes à plat », vient du verdict ko que refqc donne au fond blanc des planches MHNT. Ce sont pourtant bien les
spécimens étalés à barre d'échelle qu'il faut :
- **ailes et corps à plat** : c186 (dos) et c188 (ventre), même spécimen MHNT, barre de 1 cm = 852 px, soit 85,2 px/mm ;
- **tête** : macros à barre c073 (œil, 1 mm = 457 px), c074 (profil, 5 mm = 677 px), c076 (face, 5 mm = 788 px) ;
- **vivants** : c037 et c038 (repos de dessus), c005 (repos), c153 et c154 (vol stationnaire de profil, trompe déroulée),
  c014 (profil, pattes, œil), c046 (face, pattes), c033 et c034 (repos sur pierre).

### Mesures du corps
Sur c186, le spécimen fait 21,9 mm, touffe comprise : tête 3,3 mm, thorax 7,7 mm (7,1 mm de large avec sa fourrure), abdomen
11 mm. Sur les macros, les yeux font 1,5 à 2 mm, la tête 4,9 mm de large aux yeux. Les antennes font 10,6 mm, avec des bases
écartées de 2,9 mm, une massue fusiforme de 0,6 mm d'épaisseur entre 1 et 5 mm de la pointe, et un crochet. Sur le vivant c037,
l'abdomen fait 5,2 mm de large ; le spécimen étalé, aplati, donne 7,2 mm.

### Grilles 72 × 18
Mesurées par `plat_corps.py` et `grille_corps.py` sur c186 et c188 (`grilles/`) :
- **tête** : dessus gris-brun, face et dessous blancs ;
- **thorax** : dos gris-brun, poitrine blanche ;
- **abdomen** : base grise, taches latérales blanches puis noires, touffe sombre.

Les écailles pâles du spécimen ont jauni (b* 25). Sur le vivant c153, les taches sont blanches (L* 78, b* 7). Le module leur
rend donc ce blanc au-dessus de L* 60 (`whiten`), comme le `live` du machaon pour les noirs.

### Ailes (`ailes/`)
Les quatre faces sont relevées par `aile.py plat`, avec les cadres de `ailes/cadres.json`.
- **Coupes** : les limites entre ailes et la colonne du corps sont lues sur la grille.
- **Bandes cachées** : elles sont complétées par l'autre face. L'antérieure dessous, complétée par la face dessus, s'ajuste
  à 0,066 mm, échelle 1,000. La postérieure dessus, complétée par la face dessous (l'aile droite du même spécimen, épinglée
  autrement), s'ajuste avec une échelle de 0,955 et une rotation de 9,5°.
- **Base sous le corps** : elle est comblée.
- **Fibres** (`outils/fibres.py`, nouveau) : les écailles du moro-sphinx sont longues et étroites, presque des poils sur la
  postérieure, et rayonnent depuis la charnière (10 à 13° d'écart médian au rayon). On mesure par case de 0,6 mm leur direction,
  leur cohérence, leur contraste (le grain d'`aile.py paire`), leur longueur (0,15 mm) et leur largeur. Le module les dessine en
  traits fins orientés par le champ interpolé, avec un mélange `soft-light` qui garde la teinte. L'opacité de chaque niveau est
  étalonnée sur le grain de la photo. Le nombre de traits suit la taille à l'écran : aucun sous 8 px/mm.
- **Étalonnage** : `ailes/etalonne-tout.sh` enchaîne les fibres (3 tours), puis les zones et la poudre (2 tours, fibres
  comprises), puis les fibres (1 tour).

Paires à plat (ΔE2000 par case de 3 mm) :

| face | ΔE médian | p90 | cases ko | contraste | grain |
|---|---|---|---|---|---|
| avant-dessus | 1,6 | 2,0 | 0 / 11 | 1,00 | 0,99 |
| avant-dessous | 2,1 | 3,0 | 0 / 11 | 0,99 | 1,00 |
| arriere-dessus | 3,0 | 4,0 | 0 / 6 | 0,96 | 0,99 |
| arriere-dessous | 3,0 | 4,3 | 0 / 7 | 1,18 | 0,94 |

Les valeurs sont celles d'après le juge : sans frange, avec des fibres de 0,035 mm au plus.

Repères du machaon : ΔE 2,8 à 4,4, grain 0,53 à 0,72.

### Moteur partagé (pour l'intégration)
- `runtime/essaim.mjs` : clé nouvelle `b.wingsOff`. Les quads d'ailes sont masqués quand les ailes sont cuites dans la cellule
  (le faux battement du moro-sphinx en vol).
- `demo/demo.mjs` : clé `?sphinx=1` (1 au plus). Elle charge l'atlas `moro-sphinx` et ses ailes, et crée un `Sphinx`.
- Machaon identique au pixel : `outils/temoin-machaon.mjs` rend ses trois cellules L (pose, vol, butine) depuis l'arbre 223d2c9
  et depuis l'arbre actuel, et 0 pixel diffère.
- Fichiers propres : `runtime/moro-sphinx.mjs`, `outils/fibres.py`, `outils/planche-sphinx.mjs`, `outils/vues-sphinx.mjs`,
  `outils/temoin-machaon.mjs`.

### Paires de l'insecte entier (`paires.json`, `outils/paires.py`)
Quatre vues :
- **étalé** : c186 ;
- **dessous** : c188 ;
- **repos de dessus** : c037, le vivant ;
- **vol stationnaire de profil** : c153, corps relevé de 32°, trompe déroulée, dessin 0 du battement.

Les planches `refcache/macroglossum/paires.jpg` contiennent les photos : elles restent hors de git.

### Juge neuf (deux passages, deux juges différents)
- **Premier passage : ko.** Yeux en billes noires, massues trop fines, pattes blanches en vol, abdomen lisse, pinceau en balai,
  épaulettes grises, halo autour des ailes, sous-face en touches de pinceau.
  Corrigé ensuite :
  - yeux bruns, plus petits, à demi couverts par les écailles du vertex ;
  - massue épaisse jusqu'au crochet ;
  - pattes fines et sombres en vol, repliées contre la poitrine ;
  - velours d'écailles de l'abdomen ;
  - pinceau en brosse fuselée ;
  - tête enfoncée dans la fourrure du thorax ;
  - flanc du thorax gris-brun ;
  - frange des ailes supprimée, fibres plus fines dessous.
- **Second passage : ko sur le corps.** Les ailes vues de dessus et la palette générale sont justes (antérieure dessus : ok ;
  antérieure dessous : ko léger). Deux points ont eu leur premier essai : la bande crème réduite aux flancs, les tégulae plus
  petites. Le reste est garé ci-dessous.

### Repos et vol
- **Repos** (`REST`, `SPHINX.rest`) : toit bas (−10°). Les antérieures sont tirées de 81° : sur c037, l'apex est à 24,7° de
  l'axe. Les postérieures, à 66° et plus basses (−16°), sont rangées dessous, et l'abdomen reste à découvert comme sur c037.
- **Vol** : le faux battement est cuit dans l'atlas, en 3 dessins rejoués 0 1 2 1. Chaque dessin superpose 2 jeux d'ailes dans
  un plan à 62° de l'axe du corps (`STROKE`, `FLIGHT`).

### Atlas et démo
- **Atlas du corps** (`atlas/`). Poses vol (3 dessins), butine (3 dessins, trompe déroulée) et pose (corps seul). L'étendue est de
  64 mm, pour que la trompe déroulée (pointe à 29,3 mm de l'origine) tienne dans la cellule.
  - S : 546 cellules de 56 px, 1344 × 1288, 288 Ko, 6,6 Mo GPU ;
  - L : 168 cellules de 112 px (butine et pose), 1456 × 1456, 260 Ko, 8,1 Mo GPU.
- **Ailes du repos** (quads du runtime) : `moro-sphinx-ailes.webp`, 582 × 96 à 10 px/mm, 14 Ko, 0,2 Mo GPU.
- **Total** : 562 Ko, 14,9 Mo GPU (machaon : 405 Ko, 8,4 Mo).
- **Planche d'animation** : `planches/anim.jpg`. Le battement est montré en 4 temps (0 1 2 1) de profil et de trois-quarts, le
  transit en 3 dessins, le repos sous quatre vues.
- **Démo** : `insectes/demo/index.html?n=0&sphinx=1&taille=3`, serveur `insectes-07`, port 8827.
  - Vérifiée seule : arrivée, vol stationnaire au niveau L, repos (les quads apparaissent aux angles du toit), reprise (les quads
    se masquent), fuite au clic.
  - Vérifiée avec 2 abeilles et 1 machaon : aucune erreur, 72 i/s, 0,27 ms de JS par image.

## Résidus (garés après deux essais, §17.1)
1. **Pattes** : vues de près, elles restent des tubes articulés trop nets. Le juge veut des pattes effilées, brunes et poilues,
   aux articulations souples, et non un treillis plaqué sous le spécimen vu de dessous. À la taille de l'atlas (1 à 2 px/mm),
   elles ne font plus que quelques pixels.
2. **Antennes** : la massue est épaissie, mais le juge la voit encore droite et noire en gros plan. Il faudrait une massue
   plus marquée et un crochet plus visible, sans perdre les 10,6 mm mesurés.
3. **Raccords du corps** : la tête, le thorax et l'abdomen sont des pièces jointes, que le juge lit en trois blocs. Le
   pinceau tient encore de la pièce collée au bout. La face, avec ses palpes blancs, fait « bec » de profil.
4. **Abdomen vu de dessous** : il est trop rayé, en guêpe. La photo est marbrée : la grille 72 × 18 lisse les touffes
   irrégulières.
5. **Aile postérieure dessus** : la bande rouille sous-marginale n'est pas séparée. Les k-moyennes, avec k = 5, la fondent dans
   le brun. La bande cachée sous l'antérieure, complétée par étirement (méthode du machaon), donne une base brune trop large
   vers la côte.
6. **Aile postérieure dessous** : les nervures sombres sont à peine relevées (11 traits) et la zone orange est trop unie. Le
   liseré clair vient du masque de la photo (pixels du bord mêlés au blanc de la planche).
7. **En vol** : la postérieure est ocre terne. La photo c153 la montre cuivre-rouille translucide, en contre-jour, et le
   moteur ne fait pas passer la lumière à travers une aile opaque.
8. **Teinte du repos** : le vivant c037 est gris-brun froid. Le spécimen MHNT, plus brun-olive, fait le motif. C'est
   peut-être la lumière de c037 : à comparer sur c038 et c015.
9. **Trompe** : 25 mm (Faucheux 2013), droite. Sur c153, elle ne montre qu'une douzaine de millimètres, incurvée.

## Questions au porteur
- Le moro-sphinx est-il validé au niveau des ailes ? Faut-il pousser encore le corps (résidus 1 à 4) avant les autres espèces ?
- Les masques des ailes ont été faits sans SAM, faute de RAM. Faut-il refaire SAM au prochain créneau libre ? *Proposition* :
  oui, pour la forme ; les chiffres ne devraient pas bouger.
- La durée d'une visite (3 à 10 s) n'a qu'une source sans référence primaire. *Proposition* : la mesurer sur deux ou trois
  vidéos libres de moro-sphinx au butinage.

## Écarts à la méthode (décisions manquantes, notées ici)
1. **SAM n'a pas tourné.** Il passe par le créneau unique (`GATE_MAX=1`) et réclame 5,5 Go libres. Avec neuf sessions, la RAM
   est restée entre 3,4 et 4,4 Go pendant toute la session. Sur ces planches à fond blanc neutre, le masque a été fait sans SAM :
   la région de l'aile (`region` dans les cadres, écrite en `sam.png`), puis le fond neutre de la planche (`ground` d'aile.py)
   et les lignes de coupe lues sur la grille. Les contrôles `refcache/macroglossum/ailes/*/controle.jpg` sont propres.
   *Question* : refaire SAM (`aile.py plat … --sam`) quand le PC sera libre ? *Proposition* : oui, pour la forme ; les chiffres
   ne devraient pas bouger, puisque le bord vient du fond.
2. **Cartes de profondeur (§2) non faites**, pour la même raison (un modèle à la fois, RAM sous le seuil). Les proportions
   viennent des barres d'échelle du spécimen et des macros. *Proposition* : les passer avec SAM au prochain créneau libre.
3. **Découpes PNG** des planches (`hd/c186-ailes.png`, `hd/c188-ailes.png`, dans refcache) : la mémoire d'`aile.py` est divisée
   par trois.

## Défaut d'un outil partagé, à signaler
`grille_corps.py --flip` ne retourne que la grille dorsale. La grille ventrale reste dans l'ordre de `plat_corps.py` (de l'avant
vers l'arrière), donc tête-bêche par rapport au dos. Le moro-sphinx contourne avec des copies retournées (`grilles/*-ventre-r.json`).
Les grilles `thorax.json` et `abdomen.json` du machaon, faites avec `--flip`, ont sans doute le ventre inversé : à vérifier à
l'intégration.
