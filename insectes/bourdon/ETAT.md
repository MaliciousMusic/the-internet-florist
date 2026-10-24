# Bourdon terrestre (*Bombus terrestris*, ouvrière) : état au 2026-10-25

Seconde passe, faite avec la méthode du machaon (PROTOCOLE §1 à §7), après le refus de la première par le porteur le 2026-10-23.
Mesures et références dans `FICHE.md`, comportement dans `COMPORTEMENT.md`.

## Fait

### Mesures
- **Cartes de forme** (`outils/forme.py`, nouveau : SAM et profondeur) : 7 photos en 4 vues (`formes.sh`). *À compléter quand
  les cartes auront tourné.*
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
après les changements de cette session : 0 pixel différent, SVG identiques.

## Résidus

1. **Nervures externes de l'aile avant.** Une partie des nervures des cellules submarginales extérieures n'est pas relevée : le
   squelette du rendu fait 38 mm contre bien plus sur la photo, où les papilles se mêlent à la mesure.
2. **Zones de la membrane.** Leurs contours, tirés d'un k-means sur la lumière transmise, font des plaques là où la photo montre
   une teinte ambrée le long des nervures de la côte. L'ambre de la côte reste trop pâle.
3. **Vol vu de profil.** À plusieurs phases du battement, les ailes sont vues par la tranche et ne se voient presque plus
   (`planches/anim.png`). C'est juste en géométrie, mais la photo de vol c014 garde toujours une aile lisible.
4. **Corps à plat en vol.** Le corps reste horizontal, alors que les sources le donnent relevé de 46,8° en vol stationnaire.

## En attente (RAM du PC)
Depuis 06:40, le PC n'a qu'environ 1,4 Go de RAM libre, alors que la porte en demande 4,4 pour les paires, 5,0 pour l'atlas et
5,5 pour SAM. Ces travaux sont dans la file :
- les paires rendues à la nouvelle échelle, puis leurs mesures et le juge neuf sur les paires recadrées (`recadre.py`) ;
- la cuisson de l'atlas et sa pesée ;
- les cartes de forme SAM (`formes.sh`).

## Questions au porteur

1. **Longueur de l'aile avant.** Mesurée à 10,56 mm, alors qu'un guide (bumblebee.org) donne 13 mm. L'échelle vient des rapports
   aile / corps des vivants ailes repliées (0,69 à 0,70 sur c024 et c126). Proposition : garder la mesure.
2. **Caste du spécimen étalé c115.** Elle n'est pas notée. Ses proportions sont ramenées à une ouvrière de 15 mm. Proposition :
   garder.
