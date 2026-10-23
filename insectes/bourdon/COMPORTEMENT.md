# Bourdon terrestre : comportement (runtime/bourdon.mjs, BOURDON)

Une ouvrière qui butine le bouquet. Elle n'est jamais pilotée ; un clic la fait s'envoler et fuir, ou l'écarte si elle vole déjà.
Trois au plus à l'écran (`DECISIONS.md`).

## Chiffres et sources

| Chiffre | Valeur retenue | Source |
|---|---|---|
| Vitesse entre fleurs voisines | 0,5 m/s (`speed` 500 mm/s) | *B. terrestris* en arène de butinage : 0,47 ± 0,09 m/s à 24 °C, 0,55 ± 0,08 m/s à 32 °C ([PMC11521611](https://pmc.ncbi.nlm.nih.gov/articles/PMC11521611/)) |
| Durée d'une visite | 2,5 à 9 s, les courtes plus fréquentes | même étude : 7,0 ± 13,0 s à 24 °C, 4,4 ± 9,4 s à 32 °C (écart-type plus grand que la moyenne : beaucoup de visites courtes, quelques longues) |
| Fleurs par minute | 9 à 13 (en découle : visite + vol de 1 à 2 s) | même étude : 9 ± 8 et 13 ± 7 fleurs/min |
| Battement | 155 Hz, amplitude 116° | Dudley & Ellington 1990 (J. Exp. Biol. 148), valeurs du vol stationnaire reprises par Sun & Xiong 2005 ([J. Exp. Biol. 208](https://journals.biologists.com/jeb/article/208/3/447/15902/Dynamic-flight-stability-of-a-hovering-bumblebee)) |
| Corps relevé en vol | 46,8° en stationnaire, moins en avançant | mêmes sources ; l'angle du corps et du plan de battement varient avec la vitesse (Dudley & Ellington 1990) |
| Corps | 15 mm (ouvrière) | `FICHE.md` ; ouvrières de 11 à 17 mm (bumblebee.org, Wikipédia) |

À travailler sur vidéo (chiffres de travail, non sourcés) : la houle lente du vol (`bob`, 3,2 Hz, 1,2 mm), le stationnaire très court
avant de se poser (0,08 à 0,35 s), la vitesse de marche sur la fleur (12 mm/s), la vitesse de départ vers le pré (1,4 m/s ; les
vols de butinage en plein champ sont bien plus rapides que dans une arène).

## États

- **Arrivée** depuis les bords ou le pré du fond, en vol lourd et ondulant : grand méandre lent et houle du corps, plutôt que le
  zigzag de l'abeille.
- **Approche et pose.** Presque pas de vol stationnaire. Le bourdon se pose lourdement : la fleur cède un peu, il plonge d'un ou
  deux millimètres puis remonte.
- **Butinage.** Pose d'atlas « butine », langue sortie. Il marche d'un point à l'autre de la fleur (pose « marche », 8 images en
  trépied) et revient à la pose butine.
- **Envol.** Il décroche un peu avant de monter, comme une butineuse chargée. Puis fleur suivante, ou départ ; le départ est plus
  probable après plusieurs visites.
- **Clic.** Posé, il s'envole et fuit ; en vol, il fait un écart.

## Battement au runtime

À 155 Hz, un battement dure 6,5 ms, soit plus de deux battements par image à 60 i/s. Aucune image ne peut montrer une phase
vraie. On montre donc le faux de l'animation traditionnelle (`DECISIONS.md`) : les trois dessins de `bourdon.mjs` (`FLIGHT`),
chacun avec deux jeux d'ailes en arc à des phases voisines, se suivent à chaque image (`tick % 3`), sans flou. Les positions des
ailes suivent le vrai battement (`STROKE`) : plan presque horizontal quand le corps est relevé, tracé en huit aplati, bord d'attaque
en tête dans les deux sens.
