# Bourdon terrestre (*Bombus terrestris*, ouvrière) : état au 2026-10-24

Seconde passe, faite avec la méthode du machaon (PROTOCOLE §1 à §7), après le refus de la première par le porteur le 2026-10-23.
Mesures et références dans `FICHE.md`, comportement dans `COMPORTEMENT.md`.

## Fait

### Mesures
- **Cartes de forme** (`outils/forme.py`, nouveau : SAM et profondeur) : 7 photos en 4 vues (`formes.sh`), toutes tirées. Table
  par vue : `python insectes/outils/forme.py table bombus-terrestris`. Les cartes des rendus ne sont pas tirées (résidu 7).
- **Grilles 72 × 18 du thorax et de l'abdomen**, sur le spécimen étalé c115 :
  - le contour du corps est lu sur la grille de la photo, ailes et pattes exclues (`plat_corps.py --masque`, option ajoutée) ;
  - les cases où l'on voit une aile sont remplacées par la case propre la plus proche vers la ligne médiane
    (`nettoie_grille.py`) ;
  - le ventre vient de c120.
- **Ailes à plat** (`outils/membrane.py`, nouveau : `aile.py` adapté à une membrane transparente) :
  - la lumière transmise, canal par canal, devient une couleur sous une opacité, ajustée par moindres carrés sur tous les fonds ;
  - nervures : 75 traits sur l'aile avant, 14 groupes sur l'aile arrière ;
  - papilles de la partie distale : 114 par mm².

### Nervures recalées (remarque du porteur : « marron et trop foncé »)
Ajustées comme un filtre, les nervures partaient vers des rouges saturés (`#3b0000`) qui brillaient sur le corps noir, et les plus
grosses étaient trop larges. Elles sont maintenant un tube fin de leur propre brun, mesuré sur les ailes à plat de c115, le long du
squelette des nervures :

| | photo | avant | maintenant |
|---|---|---|---|
| largeur à mi-creux, médiane / p90 | 0,048 / 0,095 mm | jusqu'à 0,20 mm | 0,048 / 0,095 mm |
| teinte du quart le plus sombre (b*) | 10,6 | 16 | 9 |
| membrane à plat (L*) | 94,6 et 93,4 | 89 | 93,4 et 91,8 |

### Proportions et jaunes des vivants
Les premières paires montraient un rendu trop petit d'environ 0,9 et trop élancé (hauteur / longueur 0,42 contre 0,56 sur c060).
- **Échelle.** L'abdomen de c115 est étiré : aile / corps vaut 0,63 sur ce spécimen, contre 0,70 sur les vivants c024 et c126.
  Le modèle est maintenant tracé 1,11 fois plus grand (`S_LIVE`). L'abdomen est raccourci pour garder 15 mm, et les ailes restent à
  leur longueur mesurée.
- **Jaunes** (`vivant.py`, nouveau). Sur c115, le poil sec a passé au brun orangé. Le collier et la bande du 2e tergite sont ramenés
  au jaune pur des vivants c024 et c126 : teinte 83°, et la luminance de chaque bande rapportée à celle de la queue.
  - Bande du 2e tergite : L* 68,5 a 7,5 b 61.
  - Collier : L* 58,6 a 6,4 b 52.
  - La queue et sa lisière chamois restent comme elles ont été mesurées.
- **Fourrure.** 1,6 mm sur le thorax et 1,0 mm sur l'abdomen, dressée et hirsute (c060, c126).
- **Ailes sur le corps.** Elles disparaissaient sur la fourrure noire. Elles portent maintenant :
  - le reflet chaud du ciel (L* 45 sur le corps noir, c060) ;
  - une ombre de 0,28 sous chaque aile (c024 : la lumière y traverse la membrane deux fois) ;
  - au repos, une position repliée qui se croise sur la ligne médiane.
- **Matières.** Pattes noires mates et velues, tarses roux, yeux noirs, face velue. Clypéus et tégulae plus petits.

### Juge neuf : deux passes
Première passe sur les paires recadrées (`recadre.py`) : 20 KO sur 20. Mesuré, puis corrigé :
- **Noir.** L* 16 à 26 sur le rendu, contre 4 à 12 sur les photos. Les cases noires des grilles, et le noir des poils de la
  tête et des pattes, sont ramenés au noir des vivants (`vivant.py`).
- **Ailes sur le corps.** Sur c024, les ailes repliées ne laissent passer qu'environ 0,09 de ce qu'elles couvrent : noir,
  jaune et blanc, ajusté en linéaire sur les trois. Elles y ajoutent leur propre reflet, chaud, de L* 27. Au-dessus d'un fond
  lointain, elles restent claires (c060). Chaque aile ombre maintenant le corps à 0,62 et lui cache aussi le ciel
  (clé `occ`, nouvelle dans le moteur).
- **Corps plus haut.** De profil, la hauteur faisait 0,46 de la longueur, contre 0,56 à 0,6 sur c060 et c126. Le thorax est
  devenu un dôme et l'abdomen a une section à peu près ronde, largeurs inchangées.
- **Face (c084).**
  - Front nu et brillant, poils bruns sur le bas de la face et sur le clypéus.
  - Clypéus et ocelles plus petits.
  - Antennes dirigées vers l'avant et l'extérieur.
- **Pattes et ventre.** Poils dressés sur les fémurs et les tibias, sternites nus au milieu du ventre.

Seconde passe, faite par un autre juge neuf : 18 KO, 2 OK (l'arrière du corps, dans les deux profils). Ce qui reste est dans les
résidus.

Mesures des paires (`paires_mesure.py`, insecte entier ; cibles : ΔE2000 ≤ 6, contraste et grain entre 0,7 et 1,4) :

| vue | ΔE | L* photo / rendu | contraste | grain |
|---|---|---|---|---|
| dessus (c024) | 4,1 | 27,1 / 29,2 | 1,23 | 1,94 |
| profil (c126) | 6,1 | 24,2 / 24,3 | 1,01 | 1,03 |
| profil2 (c060) | 6,5 | 15,8 / 24,9 | 1,25 | 0,78 |
| face (c084) | 8,3 | 7,9 / 19,8 | 1,33 | 1,32 |
| dessous (c120) | 16,1 | 41,4 / 21,7 | 0,93 | 0,84 |

Les régions où le ΔE dépasse 20 sont celles où la pose diffère : une patte sur la photo, du fond sur le rendu. Le dessous de c120
est pris au flash.

### Atlas
Recuit après les corrections de la première passe (`cuisson.mjs bourdon`, `atlas.py`) :
- S : 1 014 cellules, 1280 × 1280, 635 Ko, 6,2 Mo sur le GPU ;
- L : 210 cellules, 1680 × 1568, 726 Ko, 10,0 Mo sur le GPU.

Démo vérifiée (`?n=0&bourdon=3`) : trois bourdons arrivent, puis butinent, à environ 47 images par seconde, sans erreur
dans la console.

### Modèle (`bourdon.mjs`, `membrane.mjs`)
- **Tête.** Penchée en avant. Yeux ovales de 2,35 × 0,72 mm, à facettes, avec le reflet d'une fenêtre. Trois ocelles, clypéus
  brillant, labre, mandibules qui se croisent. Antennes coudées (scape et 11 articles). Langue repliée, ou sortie pour butiner.
- **Corps.** Fourrure longue de poils effilés et courbes qui suivent le corps, dans les couleurs des grilles :
  - collier jaune ;
  - bande jaune d'or du 2e tergite ;
  - queue blanche à lisière chamois.
- **Pattes.** En articles. Corbeille à pollen lisse et brillante, frangée de longs poils noirs.
- **Ailes.** Au repos, repliées sur l'abdomen. En vol, un battement en huit sur 3 dessins de 2 jeux d'ailes chacun, sans flou
  (`STROKE`, `FLIGHT`).
- **Organisation.** Chaque organe a son groupe `p-<organe>`. Les ombres portées ne tombent qu'entre les pièces.

### Comportement et démo
- `runtime/bourdon.mjs` : arrivée en vol lourd et ondulant, pose lourde, butinage et marche, envol qui décroche avant de monter,
  fuite au clic, 3 au plus à l'écran. Chiffres sourcés dans `COMPORTEMENT.md`.
- Démo : `insectes/demo/index.html?n=0&bourdon=3`, serveur `insectes-02`, port 8822.

### Machaon inchangé
Ses trois cellules témoins et la vue entière (`pose_30_40_L`, `vol_120_20_L`, `butine_90_0_S`, `whole_120_25`), rendues avant puis
après les changements de cette session, la clé `occ` du moteur comprise : 0 pixel différent, SVG identiques.

## Résidus

1. **Nervures externes de l'aile avant.** Une partie des nervures des cellules submarginales extérieures n'est pas relevée : le
   squelette du rendu fait 38 mm contre bien plus sur la photo, où les papilles se mêlent à la mesure.
2. **Zones de la membrane.** Leurs contours, tirés d'un k-means sur la lumière transmise, font des plaques là où la photo montre
   une teinte ambrée le long des nervures de la côte. L'ambre de la côte reste trop pâle.
3. **Vol vu de profil.** À plusieurs phases du battement, les ailes sont vues par la tranche et ne se voient presque plus
   (`planches/anim.png`). C'est juste en géométrie, mais la photo de vol c014 garde toujours une aile lisible.
4. **Corps à plat en vol.** Le corps reste horizontal, alors que les sources le donnent relevé de 46,8° en vol stationnaire.

Résidus de la seconde passe du juge (deux essais faits pour les ailes et les nervures) :

5. **Ailes repliées encore trop claires.** De profil, elles ne font pas la bande sombre que l'on voit le long du dos. De dessus,
   les nervures restent trop épaisses et rosées. L'ombre portée du moteur suit une ellipse et ne prend pas l'épaisseur de
   l'empilement. Proposition : une couche de membrane propre au repos, brun fumé, ajustée sur c024 et c060.
6. **Pattes et ventre.**
   - Les franges des pattes se lisent peu.
   - Le dessous ne montre pas encore de sternites noirs luisants, et une bande jaune y passe, qui vient des lignes ventrales
     de la grille de c120.
   - La queue paraît gris-brun dans les vues de dessus.
7. **Tête.**
   - Le clypéus forme encore un dôme, les mandibules sont des tubes coudés, et le poil du vertex est trop gros.
   - Les cartes de forme des rendus ne sont pas tirées : il faudrait des axes posés sur chaque rendu. La comparaison de forme
     photo | rendu reste donc à faire.

## Questions au porteur

1. **Longueur de l'aile avant.** Mesurée à 10,56 mm, alors qu'un guide (bumblebee.org) donne 13 mm. L'échelle vient des rapports
   aile / corps des vivants ailes repliées (0,69 à 0,70 sur c024 et c126). Proposition : garder la mesure.
2. **Caste du spécimen étalé c115.** Elle n'est pas notée. Ses proportions sont ramenées à une ouvrière de 15 mm. Proposition :
   garder.

- **Intégration (2026-10-24).** La session de l'abeille avait aussi créé un `outils/membrane.py`, un autre outil. Celui
  du bourdon devient donc `outils/membrane_bourdon.py` ; il est appelé de la même façon.
