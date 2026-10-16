# Lot 80 « persistants 2 » : rapport

Fichier : `s80a.js` (préfixe `l80` / `L80_` / `CW_L80`). Aucune copie moteur et aucun diff moteur.
Moteurs réutilisés :
- `fgAxis` et `fgGrow` (lot 24) : axe sur l'épine du Composer, sur une planche et sur une carte ; L-système avec nœuds, rameaux latéraux, organes terminaux et axillaires ; contrat `{k, bw, bw1, bc, neck, nd}` ;
- `g35Leaf`, `g35Surf`, `g35Pet`, `g35Run` et `g35Lim` (lot 35) : nappes 3D à deux faces, panachure, brillance, feuilles gardées au-dessus du col ;
- `bzFruit` (lot 20) : les baies.

Ajouts propres au lot :
- `l80Prof` : contours dentés (dents penchées vers la pointe) ou à base oblique.
- `l80Leaf` : enveloppe de `g35Leaf`, qui pose sur la surface de la feuille des taches d'or (face supérieure) et des écailles rousses (revers), une seule `path` par moitié.
- Panachures en liseré (`l80Mg`) ou en cœur éclaboussé (`l80Splash`).
- `l80At` avec `fan` : chez les espèces à feuilles opposées, les paires qui pointent vers l'avant ou l'arrière du rameau s'écartent un peu sur les côtés, comme le fleuriste étale un rameau.
- Tous les pédoncules, pétioles et rayons font au moins 1,15 de large et partent de leur nœud ou de leur rayon porteur.

Aucune de ces espèces n'avait d'ancienne version (`grep` vide) : les sid sont nouveaux, et les recettes existent déjà dans `k0.js`.

## Espèces
| sid | botanique | coloris (CWS) | tailles (SZG, longueur de feuille en cm) |
|---|---|---|---|
| `photinia-red-robin` | *Photinia × fraseri*. Rameaux rouge-brun. Feuilles alternes oblongues, coriaces, luisantes et finement serrulées, sur de courts pétioles. Les pousses du sommet sont rouge vif, puis bronze, puis vert foncé (suivant la position sur la tige ; plus rouge au stade bouton). Corymbes blancs en dôme (fleurs à 5 pétales, boutons vert-blanc), seulement sur le coloris « en fleurs ». | Red Robin, Little Red Robin, Carré Rouge, Louise (liseré blanc, pousses roses), Pink Marble, Red Robin en fleurs | 7, 9, 9, 11 |
| `elaeagnus-chalef` | *E. × submacrophylla* (× ebbingei). Rameaux bruns écailleux (écailles visibles sur les planches). Feuilles alternes ovales, à marge entière un peu ondulée, vert sombre dessus, argentées et ponctuées de roux dessous (les revers se montrent nettement de profil). Jeunes feuilles argentées dessus. Fleurs d'automne tubulaires argentées, pendantes à l'aisselle (coloris « fleuri »). | Type, Limelight (cœur or-lime), Gilt Edge (liseré or), Compacta, Fleuri d'automne | 5, 7, 7, 9 |
| `euonymus-japonicus-fusain` | *Euonymus japonicus*. Tiges vertes. Feuilles opposées décussées, obovales, épaisses, très luisantes et finement crénelées-dentées. | Type, Aureomarginatus, Président Gauthier, Aureopictus, Bravo, Microphyllus Albovariegatus (petites feuilles) | 4, 5, 5, 6 |
| `griselinia-littoralis` | *Griselinia littoralis*. Tiges vert-jaune. Feuilles alternes largement ovales, à base oblique, épaisses et vert pomme brillant, sur des pétioles clairs et épais. | Vert pomme, Variegata (liseré crème), Dixon's Cream (cœur crème), Green Jewel | 5, 7, 7, 9 |
| `aucuba-japonica` | *Aucuba japonica*. Tiges vertes épaisses. Grandes feuilles opposées elliptiques, luisantes, à grosses dents dans leur moitié supérieure. Taches d'or posées sur la nappe. Baies rouges ellipsoïdes (vertes, puis rouges selon le stade), en grappe au sommet des pousses, seulement sur les coloris à baies : 'Variegata' est un clone femelle et 'Rozannie' est autofertile. | Type, Variegata, Crotonifolia, Picturata (cœur or), Variegata à baies, Rozannie à baies | 10, 13, 13, 16 |

- **Longueurs de tige** (GHI.self) : 50, 50, 40, 50 et 45 cm, d'après les recettes.
- **Stades** : `op` règle les jeunes pousses et les fleurs ou baies. Un rameau feuillé n'a pas de « bouton » au sens propre.
- **Couleurs uniques** : chaque coloris a un hex `c` différent, pour que le produit du Composer retombe sur le bon coloris (`fgCw`).

## QA
- **Planches** (vues × stades, coloris, tailles) : regardées en grand et zoomées (det=2). Elles sont dans `sheets/` avec les cartes et un bouquet.
- **Bouquets composés** avec `inc=` les 5 sid, graines 5, 11 et 23, 20 bouquets chacune : **60 bouquets, 0 F, 0 U, 0 kink.** J'ai aussi regardé deux captures (graines 3 et 7).
- **Modèles** : `models_of.py` ne renvoie aucun modèle du catalogue pour ces 5 sid (`ns=` vide). Il n'y avait donc rien à lancer.
- **Perf** (`perf=1`, 76 modèles) : 218 ms et 8 295 éléments, contre 212 ms et 8 295 éléments pour la base sans le lot sur la même machine. Les éléments sont identiques puisqu'aucun modèle n'utilise ces espèces ; l'écart de temps est du bruit, et la machine cloud est plus lente que la référence de 142 ms.
- **Poids d'une carte** (3 tiges) : 330 à 1 180 éléments, contre 1 060 pour le loropetalum et 1 340 pour le pittosporum.

## Doutes
- **Coude d'une autre espèce.** Dans un bouquet de la graine 3 (C1, coupe-pied-rosée), une graminée sèche d'un autre lot fait un coude net à la sortie du vase, et la QA ne le signale pas comme kink. Ce n'est pas une espèce du lot 80.
- **Profils plus étroits.** Chez l'aucuba et le fusain, l'étalement des paires de feuilles (`fan`) rend la vue de profil plus étroite que la face. C'est voulu (rameau arrangé de face), mais à valider.
- **Stades.** Les corymbes du photinia et les fleurs du chalef ne poussent que sur leur coloris « en fleurs » ou « fleuri », pas sur la version feuillage seule.
