# Lot 56 — conifères (agent « coniferes »)

Fichier : `s56a.js`, préfixe `l56` / `L56` / `CW_L56`. Aucun module moteur modifié, donc aucun diff moteur.

## Moteur du lot
- **Rameaux.** La branche est poussée par le L-système via `fgGrow` (lot 24), comme le pin du lot 45 :
  - axe principal sur l'épine du Composer, ou dressé dans la vue sur une planche ;
  - rameaux latéraux ramenés dans le plan de la branche (`alt2`), ou en spirale pour le cèdre et le cyprès ;
  - bourgeons en bout de pousse (`T`) et cônes à l'aisselle (`X`).
- **Ordres suivants (`l56Kids`).** Les rameaux des rameaux sont alternes dans le plan (sapins, faux-cyprès) ou disposés en spirale (cyprès, cèdre).
  - Chacun part exactement d'un point de sa courbe porteuse et s'arque vers l'avant.
  - Il raccourcit vers la pointe du porteur.
- **Feuillage (`l56Fol`).**
  - Aiguilles : traits quadratiques de 1,2 à 1,7 unité, jamais sous 1,1. Elles sont triées par ton (ombre, mi-teinte, lumière, dessous), ce qui donne quelques chemins par tronçon.
  - Écailles : chaque rameau devient un ruban vert, avec une texture d'écailles en pointillés posée par-dessus.
  - Tout part de son axe : rien ne flotte.
  - En bouquet, rien ne descend sous la lèvre du vase (`g35Lim`).
- **Budget mesuré** (12 tiges sur épine, DET 1, harnais local) :

  | Espèce | Éléments par tige | Temps par tige |
  |---|---|---|
  | Nordmann | 244 | 12,9 ms |
  | Noble | 222 | 12,5 ms |
  | Cèdre | 244 | 12,4 ms |
  | Lawson | 170 | 7,4 ms |
  | Cyprès | 202 | 13,9 ms |
  | Pin du lot 45 (même mesure) | 202 | 5,7 ms |

## Espèces
- **abies-nordmanniana-nordmann (sapin de Nordmann).**
  - Morphologie : rameaux plats et raides, les latéraux dans le plan. Aiguilles courtes de 2 à 3 cm, disposées en peigne : deux rangs étalés, plus des aiguilles plus courtes couchées vers l'avant sur le dessus.
  - Couleur : vert sombre luisant dessus. Vu de dos, chaque aiguille montre ses bandes stomatiques blanches.
  - Bourgeons : ovoïdes, bruns, non résineux, par trois.
  - Stades : au stade bouton ou mi-ouvert, les bourgeons éclatent en touffes vert tilleul.
  - Pas de cône : sur l'arbre, les cônes sont dressés en hauteur et se désarticulent sur place.
  - Coloris : vert sapin brillant, vert bleuté, floqué blanc (enneigé, coloris non « nature »).
  - Tailles (longueur d'aiguille, cm) : 2,2 / 2,6 / 3.
- **abies-procera-nobilis (sapin noble).**
  - Morphologie : aiguilles de 2,5 à 3,5 cm, bleu-vert glauque sur les deux faces. Elles sortent de côté puis se relèvent en crosse de hockey, en brosse dense au-dessus du rameau.
  - Rameaux : raides, brun-rouge, dont le dessous reste à demi nu.
  - Bourgeons : petits, résineux.
  - Coloris : bleu-vert glauque, bleu argenté (Glauca), vert gris.
  - Tailles (cm) : 2,2 / 2,5 / 3.
- **cedrus-cedre (cèdre).**
  - Rameaux longs : aiguilles isolées en spirale, sur la pousse de l'année.
  - Rameaux courts : un éperon brun porte une rosette d'aiguilles (8 en DET 1, 14 en DET 2).
  - C. deodara : aiguilles plus longues (3,6 cm) et rameaux retombants (tropisme négatif, arc plus marqué).
  - Cônes mâles : en automne (stade ouvert), cylindres dressés et pâles de 3 à 4 cm. Les cônes femelles en tonnelet ne sont pas sur les rameaux coupés.
  - Coloris : bleu argenté (C. atlantica Glauca), vert gris retombant (deodara), doré (deodara Aurea), bleu-vert (atlantica).
  - Tailles (cm) : 2 / 2,5 / 3.
- **chamaecyparis-lawsoniana (faux-cyprès de Lawson).**
  - Morphologie : rameaux aplatis en éventail, ramifiés trois ou quatre fois en alternance, comme une fronde.
  - Écailles : en rubans texturés. Le dessous est plus pâle, avec ses marques blanches.
  - Cônes : globuleux de 8 à 10 mm, à 4 écailles peltées avec leur umbo. Bleu-vert, puis brun-roux à maturité.
  - Cônes mâles : cramoisis en bout de ramille au stade bouton.
  - Coloris : vert, bleu (Pembury Blue), bleu-vert (Columnaris), doré (Stardust).
  - Tailles (largeur de rameau, cm) : 10 / 12 / 14.
- **cupressus-cypres-bleus (cyprès bleus).**
  - Morphologie : ramification en 3D, cylindrique et touffue, aux écailles bleu argenté pointillées de glandes blanches. Les jeunes rameaux sont prune (Blue Ice).
  - Leyland et Castlewellan : rameaux plus plats.
  - Cônes : globuleux de 1,5 à 2,5 cm, à 6 écailles peltées avec leur pointe centrale. Glauques, puis gris-brun.
  - Coloris : bleu argenté (Blue Ice), bleu-vert (Carolina Sapphire), vert (× Cuprocyparis leylandii), doré (Castlewellan Gold).
  - Tailles (cm) : 6 / 8 / 10.
- **Composer.** `GHI` : feuillage de 48 à 55 cm le long de l'épine, `fx` de 22 à 28.

## QA
- **Bouquets composés**, `inc=` les 5 espèces, 3 graines × 20 (graines 5, 11 et 23) : **0 F, 0 U, 0 kink**.
  - Bouquets regardés : graines 3 et 7.
- **Modèles.** `models_of.py` renvoie `ns=` vide : aucun des 76 modèles n'utilise ces espèces, il n'y a donc rien à tester.
- **Perf** (`perf=1`) :
  - avec mon lot : 181 ms et 8 306 éléments en moyenne ;
  - sans mon lot (workspace `_test`), sur la même machine : 183 ms et 8 306 éléments.
  - C'est identique : aucun modèle n'est touché, et la machine cloud est plus lente que la référence de 142 ms.
- **Planches** : `sheets/<sid>_vues.png`, `sheets/<sid>_coloris.png`, `sheets/cartes_composer.png`, `sheets/bouquets.png`.

## Doutes
- **Tailles.** L'unité de `SZG` suit le `cm` des recettes : la longueur d'aiguille pour les sapins et le cèdre, la largeur du rameau pour le Lawson, une pousse pour le cyprès. Dans le commerce, ces verdures se vendent surtout en rameaux de 40 à 80 cm, ou au poids. La longueur de tige dessinée, de 50 à 55 cm, varie peu avec la taille.
- **Floqué.** Ce coloris de Noël (`f:1`) est volontairement exclu du choix automatique des modèles.
- **Sapin noble en bouquet.** De près, on voit encore un peu le dessous brun des rameaux. C'est conforme au vrai, mais à surveiller.
- **Vue de profil.** Les rameaux plats (Nordmann, Lawson) paraissent très minces : c'est la réalité d'une branche plate vue par la tranche.
