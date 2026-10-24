# Fourmi noire des jardins (*Lasius niger*), ouvrière : comportement au runtime

Le comportement est codé dans `insectes/runtime/fourmi.mjs` (classe `Fourmi`, préréglage `LASIUS`). Les poses de l'atlas
sont `pose`, `marche` (8 images), `porte` (8 images), `palpe` (4 images) et `petale` (le fragment porté seul).

## Chiffres et sources

| grandeur | valeur retenue | source |
|---|---|---|
| longueur du corps | 4,0 mm, des mandibules au bout du gastre | mesurée sur l'ouvrière AntWeb casent0178774 à l'échelle (c033, c095, c138) et sur les vivantes c254, c248 (ETAT.md) |
| vitesse de marche | 24 mm/s | moyennes de 23,5 et 26 mm/s sur piste, *L. niger* au laboratoire (préprint Research Square rs-7630446, 2025, « Pheromone trail following is not modulated by previous visit to food location… ») |
| allure | tripode alterné L1 R2 L3 / R1 L2 R3 | allure générale des fourmis sur une large plage de vitesses, 12 espèces dont *Lasius* (Zollikofer 1994, *J. Exp. Biol.* 192 : 95-106) |
| facteur de service | 0,6 (appui 60 %, vol de la patte 40 %) | marche lente à moyenne : il ne passe sous 0,5 qu'à la course (*Cataglyphis*, au-delà de 370 mm/s : Wahl et al. 2015, *J. Comp. Physiol. A*, doi 10.1007/s00359-015-0999-2) |
| longueur de foulée | 2,5 mm par cycle (0,62 longueur de corps) | proposition, à mesurer sur vidéo : la longueur de foulée suit une loi de puissance de la vitesse, d'exposant 0,3 à 0,6, et la longueur des pattes (Zollikofer 1994, partie II). Ici, le balayage d'une patte en appui (1,5 mm) tient dans la portée des pattes du modèle (fémur + tibia 1,6 à 2,2 mm). |
| cadence | environ 9,6 cycles par seconde (24 / 2,5) | cohérent avec les 14 Hz au plus mesurés chez *Linepithema humile*, plus petite, à 60 mm/s (suivi automatique à haute vitesse, SICB) |
| arrêt et rencontre | 0,45 s d'antennation par rencontre | temps perdu par contact de 0,43 à 0,48 s ; arrêt dans 95 à 99 % des rencontres frontales (Dussutour, Deneubourg et Fourcassié 2005, *J. Exp. Biol.* 208 : 2903, colonies à 25 °C) |
| charge | cadence × 0,7, foulée inchangée | la charge abaisse la vitesse par la cadence, pas par l'amplitude du pas (*Messor barbarus*, Merienne et al. 2020, *J. Exp. Biol.* 223, jeb205690). Le facteur 0,7 est une proposition pour un fragment de pétale très léger. |
| trajectoire | marche aléatoire corrélée (dérive de cap 1,6 rad/s) | les trajectoires de *L. niger* sur plan horizontal suivent un marcheur de Boltzmann isotrope (Khuong et al. 2013, *PLoS ONE* 8 : e76531) ; la valeur de dérive est réglée à l'œil, à reprendre sur leurs données |
| arrêts pour palper | toutes les 2,5 à 7 s, 0,4 à 1,6 s | proposition, à mesurer sur vidéo |
| antennes en marche | battement alterné, deux balayages par foulée | proposition : aucun chiffre trouvé pour les fourmis ; chez le phasme, le rythme antennaire est couplé à la marche (Dürr et al.) |
| nombre à l'écran | 7 à 8 | DECISIONS.md |

## États

- **walk** : marche sur la bande de sol au pied du vase. La phase de la foulée avance de la distance parcourue divisée par
  la foulée, donc les pieds ne glissent pas.
- **stop** : arrêt, les antennes palpent le sol (pose `palpe`).
- **meet** : deux fourmis à moins de 1,4 longueur de corps se font face et se palpent 0,45 s, puis repartent en s'écartant.
- **go** : après un clic, chaque fourmi va vers le pétale fané le plus proche (ou le deuxième, au hasard).
- **take** : elle palpe le pétale et en découpe un fragment (0,9 s).
- **carry** : elle repart vers une sortie du nid, tête levée, mandibules ouvertes sur le fragment (pose `porte`). Le fragment
  est un second sprite, la cellule `petale` de la même vue, teinté de la couleur du pétale (`essaim`, clé `carry`).
- **away** : hors champ, elle revient par un bord après quelques secondes.

Un clic sur une fourmi met toutes les fourmis au travail (DECISIONS : « un clic sur les fourmis les fait ramasser les
pétales fanés ») tant qu'il reste des fragments.

## Questions ouvertes

- La foulée (2,5 mm), la fréquence des arrêts et le rythme des antennes sont des propositions, à mesurer sur vidéo (une
  fourmi filmée de dessus à 240 i/s suffit).
- Sur le site et dans le widget, où est le nid ? Proposition : les deux bords de la bande de sol, hors du cadre.
