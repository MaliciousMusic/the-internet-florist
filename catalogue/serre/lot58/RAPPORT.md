# Lot 58 « fougères » : rapport

Branche `serre/58-fougeres` · fichier `serre/ws/fougeres/s58a.js` · préfixe `l58` / `L58_` / `CW_L58` · **aucune copie moteur** (pas de diff moteur).

## Le moteur du lot
- **Fronde poussée par le L-système.** `l58Frond` s'appuie sur `l44Main` (lot 44) : le stipe et le rachis suivent l'axe (l'épine du Composer, ou l'arc d'une planche via `l58Axis`). Sur une planche, la fronde s'arque sur le côté et s'incurve vers l'arrière, si bien qu'elle reste lisible de profil.
  - Les nœuds portent des pennes alternées. Pour la fougère cuir, la règle `P(n) → F [±α Q] P(n−1)` pousse les pinnules ; sur les pennes basses, les pinnules basiscopes s'allongent et se ramifient en segments (fronde tripennée).
- **Crosse.** Aux stades bouton et mi-ouvert, `l58Curl` enroule le haut du rachis en spirale logarithmique vers la face supérieure (préfoliaison circinée). Dans la crosse, les pennes rapetissent et se replient. Dans un bouquet, la fronde est toujours ouverte : ces espèces ne sont pas dans `GH_BUDS`.
- **Pennes, pinnules, segments et lobes en 3D.** Chacun est une nappe (`l58Surf`) : pliée sur sa nervure, en cuvette, tordue, retombante, falquée.
  - Le contour (`l58Ol`) porte les dents (en scie ou crénelées), l'oreillette côté apex et une base décurrente.
  - Chaque moitié prend sa propre lumière, avec un reflet (half vector) pour les espèces coriaces.
  - Les sores sont posés au revers, sur la nervure courbe.
- **Budget.** Les polygones sont groupés par bande de profondeur et par ton (`l58Batch`, un chemin par couleur). Les axes des pennes sont des rubans d'au moins 1,15 unité. Toute pièce part de sa courbe porteuse : pinnule sur l'axe de sa penne, penne sur le rachis, sore dans son limbe.
- **Contrat des feuillages** inchangé : `{k, bw, bw1, bc, neck, nd}` (via `l44Out`), plus `GHI` `form:'feuillage'`, `k:'plant'`, `self`, `fx`.

## Les espèces
| sid | Morphologie rendue | Coloris (CWS) | Tailles (SZG, cm) |
|---|---|---|---|
| `rumohra-adiantiformis-leatherleaf` | Stipe raide aussi long que le limbe, écailles brunes au pied. Limbe deltoïde, tripenné, coriace et brillant. Pennes ascendantes, les plus basses les plus grandes, avec des pinnules basiscopes allongées. Pinnules oblongues à lobes crénelés ; sores ronds près des marges, au revers. | Vert sombre brillant, Vert profond (Costa Rica), Vert vif (Floride), Peint or*, Peint argent* | 40 / 50 / 55 / 65 |
| `nephrolepis-exaltata-boston` | Longue fronde étroite et arquée, une fois pennée, stipe court. 40 à 60 paires de pennes serrées, presque sessiles, finement crénelées, à oreillette, inclinées. Limbe rétréci à la base, effilé au sommet. 'Bostoniensis' est stérile : pas de sores. | Vert tendre (Boston), Vert franc, Vert pomme (Green Lady), Vert dense (Dallas) | 45 / 60 / 60 / 75 |
| `asplenium-nidus` | Feuille entière, lancéolée, longuement atténuée vers le pied, ondulée, vert pomme brillant. Nervure médiane noire, en relief au revers. Nervures fines, parallèles et obliques ; sores linéaires au revers. Court stipe noir. Le bouton est une jeune feuille aux marges enroulées. | Vert pomme brillant, Vert profond, Ondulé (Crispy Wave), Étroit ondulé (Osaka) | 40 / 55 / 55 / 70 |
| `phlebodium-aureum-blue-star` | Long stipe lisse, brun doré. Limbe profondément pennatifide, à lobes en lanière ondulés, réunis par une aile le long du rachis ; lobe terminal aussi long que les latéraux. Bleu-vert glauque. Une rangée de sores dorés de chaque côté de la nervure du lobe, montrée aussi au détail de l'appli. | Bleu-vert glauque (Blue Star), Bleu argenté ondulé (Davana), Vert (type) | 35 / 50 / 50 / 60 |
| `polystichum-munitum-sword-fern` | Fronde en épée, lancéolée, une fois pennée. Stipe d'un quart de la fronde, couvert d'écailles rousses. Pennes linéaires-lancéolées, acuminées, falquées, dentées en scie, à oreillette côté apex, coriaces et brillantes. Sores ronds en deux rangées au revers des pennes supérieures. | Vert sombre, Vert profond, Vert olive (fronde d'été) | 60 / 80 / 80 / 100 |

\* Les coloris peints portent `f:1` : un modèle ne tombe jamais dessus par couleur voisine.

Sources : connaissances botaniques générales et usages des grossistes (cuir de Floride et du Costa Rica en bottes de 25, sword fern du Nord-Ouest pacifique, cultivars Crispy Wave, Osaka, Davana, Green Lady et Dallas). Aucune photo n'a été téléchargée.

## Vérifications
- **Planches.** Regardées en grand et zoomées (`fz=`) : 9 vues × 3 stades pour chaque espèce, coloris, tailles 0,7/1/1,3, détail 1 et 2.
  - Défauts corrigés : sores hors du limbe chez la fougère épée (décalage de la nervure falquée oublié), aile en « échelle » chez la fougère bleue, ombrage en damier du nid d'oiseau (devenu un aplat par moitié avec des lentilles d'ondulation), fougère cuir trop maigre.
- **Cartes du Composer :** `sheets/cartes_composer.png`.
- **QA composée** (`inc=` les 5 sids, n=20) :
  - graine 5 : 0 F, 0 U, 0 kink ;
  - graine 11 : 0 F, 0 U, 0 kink ;
  - graine 23 : 0 F, 0 U, 0 kink.
  - J'ai regardé 3 captures de bouquets (graines 3, 7 et 19) : toutes à F0 U0.
- **QA des modèles.** `models_of.py` renvoie `ns=` vide : aucun des 76 modèles n'utilise ces espèces, il n'y a donc pas de QA de modèles à faire.
- **Perf** (même machine, `perf=1`) :
  - workspace vide : 183 ms, 8 306 éléments ;
  - avec le lot : 185 ms, 8 306 éléments.
  - Le lot n'a donc aucun impact ; la machine cloud est plus lente que la référence de 142 ms.
- **Éléments par fronde au détail de l'appli (DET 1)** : cuir 22, Boston 23, nid d'oiseau 13, bleue 16, épée 32 (détail 2 : 15 à 38).
  - Le poids des chemins au DET 1 est réduit par un échantillonnage allégé : cuir ≈ 114 Ko, Boston ≈ 41 Ko, épée ≈ 51 Ko, les autres ≈ 10 Ko.

## Doutes
- **Fougère cuir.** C'est la plus lourde en données de chemin (≈ 114 Ko par fronde au DET 1), à cause de ses centaines de pinnules lobées. Le nombre d'éléments reste bas.
- **Nid d'oiseau.** Pas de crosse : la jeune feuille est rendue roulée par ses marges et plus claire. La vraie jeune feuille se déroule aussi depuis la pointe.
- **Profil.** Une fronde vue strictement de profil reste mince, comme l'adiantum du lot 44. La courbure arrière et le dièdre des pennes lui donnent du volume, mais elle reste plus étroite qu'en face.
- **Crispy Wave.** Son ondulation serrée est rendue par des lentilles de lumière et d'ombre ; de face, la silhouette reste peu frisée.
