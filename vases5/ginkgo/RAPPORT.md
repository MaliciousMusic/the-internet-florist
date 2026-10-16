# Vase en grès aux feuilles de ginkgo (réf. 114)

## État à la pause (16 octobre)

- **Où j'en suis** : passage à la copie mesurée. Le décor de la photo est relevé : glaçure isolée en CIELAB, bourrelets en
  lignes de crête, glaçure sur la lèvre et dans la bouche. La pose de nos feuilles gabarit directement sur la photo est
  abandonnée (couverture 0,865 seulement).
- **Lumière et matière** : la lumière de la photo est mesurée sur le grès (azimut −35°, élévation 45°, chute en cos⁴).
  Le grès et la glaçure sont calés sur la référence. Les normales des feuilles viennent d'une forme par ombrage
  (shape from shading), avec une carte d'épaisseur de glaçure mesurée.
- **Derniers chiffres** (`mesure.py cmp`, au-dessus du socle, dernière passe terminée) :
  - IoU 0,987 et SSIM lissée 0,887 : seuils atteints ;
  - arêtes 0,70 / 0,83 : précision sous 0,75 ;
  - ΔE2000 lissé 5,26 : au-dessus de 4 (ombre 3,7, demi-teinte 5,2, lumière 6,9) ;
  - ΔE par matière : grès 3,6, glaçure 7,1, dessus de la lèvre 10,8 ;
  - la glaçure est devenue trop saturée (b 41 contre 35,5 sur la référence) : il faut revenir à mi-chemin ;
  - grain : spectre pas encore mesuré.
- **Fichiers clés** : `trace.py` (mesures → `out/decor_maps.npz`), `mk.py` (`decor_layer`, `load_decor` avec la forme par
  ombrage, `stone_shade` mesuré, `photo_light`), `measure_run.sh` (rendu sur fond magenta + `mesure.py cmp`),
  `fit_leaves.py` (essai de pose des gabarits, abandonné).
- **Prochaine étape** :
  - mesurer la dernière passe, en cours au moment de la pause (glaçure plus saturée, glaçure sur l'avant de la lèvre) ;
  - descendre le ΔE de la glaçure et de la lèvre sous 4–5 ;
  - grain au spectre (`mesure.py grain`) ;
  - vérifier la vue boutique, le poids, puis refaire la planche chiffrée et ce rapport.

16 octobre 2026. Générateur : `mk.py` (`python mk.py shop`, `python mk.py photo`). Planche : `out/planche.jpg` (`planche.py`).
Rendus Chrome : `shot.sh`, une copie de `../verre/shot.sh` qui écrit sa page dans `out/work/` : la page partagée
`verre/out/_shot.html` aurait été écrasée par les autres chantiers. Tout calcul et tout Chrome passent par `ws/gate.sh`.

## Lecture de la référence

- Vue de face, appareil presque orthographique : l'ellipse du col et celle de l'anneau du socle ont le même rapport, 0,185 (œil
  à environ 10,7° au-dessus). L'axe penche de 7 px sur la hauteur, ce qui est corrigé dans la caméra de la photo.
- Corps ovoïde allongé : épaule arrondie haute (rayon maximal vers 18,6 cm), col très court presque droit, lèvre arrondie.
  Le corps s'effile en cône légèrement galbé jusqu'au socle.
- Grès brun rosé mat, au grain sableux fin. Des feuilles de ginkgo en léger relief sous une glaçure moutarde brillante :
  - bord cerné plus clair, là où la glaçure est mince sur l'arête ;
  - pétioles fins et pâles ;
  - reflets nets du studio.
- **Socle en bois retiré**, comme demandé. Le socle cache le pied à partir de y = 645 px. Le vase repose dans son creux,
  à environ 1 cm de profondeur. Notre pied prolonge donc le cône en le resserrant un peu plus : la pente mesurée sur le
  dernier tronçon, multipliée par 1,4 puis 1,7. Il finit par un talon arrondi (rayon 0,28 cm) et un fond plat en retrait :
  - rayon d'appui : 3,35 cm ;
  - rayon de l'épaule : 6,04 cm.

## Mesures

- Silhouette relevée ligne par ligne :
  - séparation du fond corrigée de son vignettage ;
  - teinte (R − B) pour le bas, où l'ombre portée gêne ;
  - relief des feuilles (1,5 px) retiré là où elles bordent la silhouette.
- Le profil superposé à la photo tombe sur le bord, écart inférieur à 1 % : `out/work/check_sil.png`.
- **Taille réelle estimée : 25,3 cm de haut sans socle, 12,1 cm de diamètre à l'épaule.** Aucune dimension n'est publiée
  (fiche 114). L'estimation croise trois indices :
  - les feuilles de la photo mesurent environ 4,9 cm de large à cette échelle, dans la fourchette basse d'une vraie feuille
    de ginkgo (5 à 8 cm) ;
  - l'ouverture fait 9 cm ;
  - les vases de poterie d'art de ce type mesurent en général 20 à 30 cm.
- Fiche boutique, en unités boutique : `h` 246,6, rayon maximal 58,9, `mo` 41,8, `lipw` 3,7.
- Couleurs relevées sur une grille, prises comme repères :
  - grès éclairé (128, 113, 105), ombre propre (76, 62, 48) ;
  - glaçure en plein (206, 175, 92), arête pâle vers (230, 218, 150).

## Modèle (recréation, pas décalque)

- **Corps** : un profil tourné (`lathe`) mesuré, sa normale exacte, la lumière de la boutique `L3`, un grès mat sans
  reflet. Le grès a :
  - un diffus enveloppé ;
  - un ciel tiède par le haut ;
  - une occlusion près du pied ;
  - un léger lustre sableux en lumière rasante.
- **Grain** (v4) : vectoriel, sans image, calé à 1:1 sur la référence. L'écart-type du passe-haut sur le flanc éclairé, à
  l'échelle de la boutique, vaut 4,1 chez nous et 3,6 sur la référence. Il combine deux choses :
  - un mouchetis de turbulence SVG, en points clairs et sombres ;
  - 3 484 grains vectoriels posés uniformément sur la surface tournée, plus serrés vers les bords (ils suivent la
    courbure), de trois tailles dont quelques gros grains ; les grains clairs sont plus nombreux sur le flanc éclairé.

  Un masque le renforce en lumière rasante et l'atténue dans l'ombre.
- **Décor dessiné par nous** (v3, après deux contrôles de la planche) :
  - aucune branche : les tiges arrivent par-dessus la lèvre, depuis six points juste au-delà du bord ; leur départ est caché,
    sans aucun angle vif ;
  - 11 feuilles, toutes de taille et d'angle différents ; la plus grande fait environ 45 % de la largeur du vase ;
  - elles couvrent le tiers supérieur sur tout le tour visible, le grès restant visible entre elles ;
  - masse principale en haut à gauche, trois grandes feuilles au centre-droit et à droite, coupées par la silhouette ;
  - à gauche, deux feuilles seulement, espacées, l'une plus avant que l'autre ;
  - deux tiges descendantes : une longue tige fine et courbe jusqu'au milieu de la panse, une seconde à droite vers 40 % de
    la hauteur ;
  - la composition n'est pas celle de la photo.
- **Morphologie d'une feuille** (v5, gabarit relevé sur quatre feuilles nettes de la photo) :
  - éventail en coin presque triangulaire : étroit et en pointe au pétiole, côtés presque droits ;
  - ouverture de 95 à 115° (la référence est entre 90 et 120°) ;
  - bord supérieur large et peu bombé (rayon en 1/cos^0,4), légèrement ondulé, aux coins à peine arrondis ;
  - échancrure centrale nette, profonde de 30 à 45 % de la hauteur, et une ou deux petites encoches par lobe ;
  - largeur sur hauteur de 1,4 à 1,7 ;
  - nervures dichotomes fines ;
  - taille et angle propres à chaque feuille.
- Chaque feuille est posée sur la surface comme une décalcomanie, en arc et en méridien. Elle suit ainsi la courbure du
  vase et se raccourcit vers les bords. Une feuille coupée au bord de la silhouette en dépasse de son épaisseur
  (parallaxe).
- **Deux feuilles posées sur la lèvre** (v4). Leur géométrie continue au-delà du bord, par-dessus la bague, jusqu'à l'arête
  intérieure. Elles recouvrent le bord et la tranche ; un reflet doux marque la glaçure qui s'arrondit sur la lèvre.
- **Relief et glaçure** :
  - glaçure moutarde pâle, calée sur les tons mesurés de la référence : lumière (212, 190, 115), demi-teinte (186, 163, 91),
    accumulation (134, 112, 55), bourrelet crème (207, 197, 152). Le modelé reste celui de la lumière de la boutique ;
  - glaçure unie et lisse. Le bombé vient d'un « coussin » flou du limbe, et non plus de la distance au bord, qui creusait
    des plis nuageux. Les plis ne servent plus qu'aux reflets ;
  - bourrelet de la même glaçure, fondu (plus clair côté lumière, ambré côté ombre) ;
  - pas de tige dessinée sur le dessus de la lèvre ;
  - reflets en filets, contre-jour doux sur le bourrelet des feuilles à l'ombre ;
  - **aucune ombre portée** (consigne du porteur) : le relief se lit par le seul modelé de la glaçure.
- **Lèvre discrète** : paroi de 3,8 mm, arrondi de 1,2 mm, bague teintée comme le grès vu de biais.

## Sortie SVG

- Bandes de ton (iso-lignes) découpées par partie et adoucies par un flou.
- Contours ajustés en courbes de Bézier.
- Nervures et arêtes en traits.
- Reflets en formes nettes.
- Bouche à part : bague arrière et paroi intérieure, derrière les tiges.
- `own: true` dans `body.json`, pour que le moteur ne redessine pas son bord simple.

## Passes isolées et défauts corrigés

1. **Grain trop fort et trop régulier** (retour du porteur) :
   - avant : un bruit blanc uniforme et des taches nuageuses ;
   - correction : micro-relief éclairé, intensité divisée par 3 à 4, plus de marbrure, masque de lumière rasante.
2. **Teinte gris-violet, modelé écrasé** : nouvel albédo brun rosé, ciel plus chaud, diffus plus fort, ambiant plus faible.
   Le clair à gauche et l'ombre propre à droite se lisent.
3. **Pied trop large** : le cône est prolongé et resserré sous le socle (voir plus haut).
4. **Composition en « lustre »** :
   - avant : des pétioles droits et symétriques, des feuilles pendues toutes à la verticale ;
   - correction : une vraie branche, des rameaux inclinés, des feuilles qui rayonnent, des pétioles en S plus fins
     (0,95 mm).
5. **Reflets en taches blanches** :
   - avant : les plis entraient dans le diffus, avec une boîte trop large ;
   - correction : diffus calculé sur la forme large seule, plis et arête réservés aux reflets, boîte resserrée, bande et
     plafond ajoutés. Les reflets deviennent des filets qui suivent le galbe.
6. **Bandes visibles sur le corps** au cadrage photo : les bandes sont calculées au-delà de la silhouette (le champ tourné
   s'y prolonge) et adoucies d'un flou de 3,2 unités. Plus aucun escalier ni bord sombre.
7. **Poids** : de 161 Ko gzip à 114 Ko, en retirant les plis du diffus et avec un pas de ton de 11 et une simplification de
   0,15 unité.

8. **Décor en guirlande de décalcomanie** (contrôle v1) : branche supprimée, feuilles moins nombreuses et plus grandes.
9. **Contrôle v2 et retour du porteur** : couverture élargie, bourrelet fondu, départs des tiges cachés, deux feuilles à
   gauche, ombres réduites.
10. **v4, décisions du porteur** :
    - glaçure refroidie vers le moutarde pâle mesuré, unie et sans taches nuageuses ;
    - ombres portées supprimées ;
    - grain lisible à 1:1, mesuré contre la référence. Le micro-relief éclairé de la v3 faisait des bosses de « peau
      d'orange » au zoom : il est remplacé par un mouchetis ;
    - deux feuilles par-dessus la lèvre.
11. **v5, retour du porteur** :
    - les feuilles étaient des « nuages festonnés » : elles prennent le gabarit triangulaire de la référence ;
    - la feuille qui tombe est isolée, avec du grès tout autour ; son long pétiole (11,6 cm) part de la masse, s'écarte puis
      s'incurve en S souple, et porte la feuille vers le milieu de la panse ;
    - la seconde feuille descendante, à droite, est décalée pour ne plus la toucher.

## Poids

`out/body.json` : 398 Ko bruts, **102,8 Ko gzip**, sous le plafond de 120 Ko. Les grains vectoriels pèsent environ 16 Ko.

## Défauts restants

- **Le passage d'une feuille sur la lèvre est peu visible.** Vu à 9° au-dessus, la bague ne fait que 0,4 unité de haut.
- **Grain un peu plus marqué que la référence sur le flanc éclairé** (4,1 contre 3,6), comme demandé.

## Questions pour le porteur

1. **Intégration** :
   - `own: true` évite que le moteur redessine son bord simple ;
   - aucun `<use>`, car `svgbPut` ne renomme pas les `href`.
