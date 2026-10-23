# Coccinelle : comportement (runtime/coccinelle.mjs, COCCINELLE)

La coccinelle n'est jamais pilotée. Elle arrive en vol, se pose sur une fleur, la parcourt à pied, puis repart vers une autre fleur
ou quitte la vue. Un clic la fait s'envoler et fuir.

## Chiffres et sources

| Grandeur | Valeur | Source |
|---|---|---|
| Longueur du corps | 7,2 mm | Baungaard 1980 (femelles 7,4 ± 0,1 mm, mâles plus petits) ; Iqbal et al. 2024, BDJ : 6,5 à 7,8 mm |
| Battement des ailes postérieures | 72,5 Hz | Étude du vol ascendant de *C. septempunctata*, PMC11117773 (5 cycles filmés à grande vitesse) |
| Amplitude, plan de battement | 190°, plan à 61° de l'axe du corps | même étude |
| Aile postérieure | 11,4 mm de la base à l'apex, corde moyenne 3,5 mm | même étude ; contour relevé sur c365 (ailes/aile.json) |
| Dépliage, repli des ailes | environ 0,1 s et 0,2 s | Saito et al. 2017, PNAS (ailes déployées « en un dixième de seconde », repliées en deux) |
| Élytres en vol | tenus levés vers 42° et écartés sur le côté, immobiles | photos c365, c366, c372, c495 |
| Corps en vol | incliné, tête haute (environ 40°) | photos c495, c369 |
| Marche | environ 8 mm/s, foulée de 1,6 mm | chiffre de travail : larves de *C. septempunctata* à 3,8 à 5,1 mm/s (Marks 1977) ; l'adulte, plus grand, marche plus vite ; à affiner sur vidéo |
| Nombre à l'écran | 4 au plus | DECISIONS.md |

## États

| État | Ce qu'elle fait | Durée | Sortie |
|---|---|---|---|
| `away` (absente) | hors de la vue | 4 à 14 s (0,5 à 3,5 s au départ) | entre par un bord, par le haut ou depuis le fond |
| `transit` (vol) | vole droit, lourde, élytres levés, ailes battant (phase tirée à chaque image : 72,5 Hz contre 60 images par seconde, l'œil voit un flou de positions, montré par une aile à 55 % d'opacité) | selon la distance | arrive au-dessus de la fleur |
| `land` (pose) | se pose en ralentissant | 0,35 s | repli |
| `fold` (repli) | replie les ailes sous les élytres (0,22 s), puis les élytres se ferment (0,12 s) ; l'atlas reprend alors le dôme fermé | 0,34 s | marche |
| `walk` (sur la fleur) | alterne des arrêts (0,4 à 2,5 s) et des marches (0,6 à 2,2 s) vers un point du cœur ou du bord, trépied calé sur la distance parcourue | 6 à 18 s | envol |
| `open` (envol) | ouvre les élytres (0,12 s), déplie les ailes à partir de 60 % de l'ouverture (0,1 s) | 0,17 s | décollage |
| `takeoff` (décollage) | s'élève | 0,4 s | autre fleur, ou départ |
| `leave` (départ) | quitte la vue par un côté ou vers le fond | selon la distance | absente |

## Choix

- **Fleur suivante** : une fleur libre autre que la précédente, de probabilité `1 / (distance + 120)` (les sauts courts dominent, sans la
  constance d'une butineuse).
- **Départ** : après chaque envol, 20 % de chances de partir, plus 8 % par fleur visitée (au plus 50 %).

## Clic

- **Posée ou en train de marcher** : elle ouvre ses élytres, déplie ses ailes, décolle plus vite (× 1,6) et quitte la vue.
- **En vol** : un écart de côté, puis elle reprend sa route.

## Plans du runtime

Les élytres ouverts et les ailes postérieures sont des quads (`essaim.placeWings`), textures de `outils/plans.mjs`. Trois clés nouvelles
d'`essaim.placeWings` servent à la coccinelle seule : `b.wingsHidden` (posée, aucun plan), `unfold` (l'aile se déplie) et `alpha` (l'aile
qui bat). Au début de l'envol, les élytres sont des couvercles plats posés sur le corps (`ferme` : battement 0, balayage 90°), la cellule
`vol` de l'atlas n'ayant plus le dôme : vu de dessus le passage est invisible ; vu de profil, le couvercle est plat pendant 0,12 s.
