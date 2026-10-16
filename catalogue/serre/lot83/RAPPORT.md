# Lot 83 « aiguilles et australiennes » — agent aiguilles

Fichier : `s83a.js` (préfixe `l83`/`L83`). Aucune copie moteur, aucun diff moteur.

## Moteur du lot
- `l83Plant` : la branche est poussée par `fgGrow` (lot 24) sur l'épine du Composer, sur une planche ou sur une carte. Elle renvoie `{k,bw,bw1,bc,neck,nd}`. Les ordres plus jeunes viennent de `l56Kids` (lot 56) : ce sont des arcs qui partent de leur axe parent, donc sans coude.
- `l83Fol` habille chaque axe, pas à pas, avec ce que donne la fonction de l'espèce :
  - des limbes plats en 3D, en deux moitiés éclairées chacune par sa normale, avec nervure médiane saillante, nervures parallèles, brillance et pétiole ;
  - des traits pour les aiguilles et les lobes ;
  - des arilles sur leur pédoncule.
- Tout passe en items regroupés par lots (`l30Batch`) : 9 lots au DET 1, 16 au DET 2, un chemin par ton.
- Chaque organe part du point de son axe porteur, et tout trait porteur fait au moins 1,1 unité. Les traits plus fins (nervures, reflets soyeux) sont posés sur leur organe.
- Les stades (bouton, mi-ouvert, ouvert) donnent la part de pousses jeunes en bout d'axe. Deux coloris gardent leurs pousses à tous les stades : « pousses claires » du podocarpus et Purpurea de l'acacia.

## Espèces
| sid | botanique rendue | coloris | tailles (SZG, cm) |
|---|---|---|---|
| podocarpus-macrophyllus | Feuilles en spirale, serrées vers les pointes, linéaires-lancéolées de 7 à 12 × 0,7 à 1 cm. Pétiole court, nervure médiane saillante, dessus vert sombre luisant, dessous plus pâle et mat. Rameaux latéraux ascendants. | vert sombre lustré, vert franc (var. maki), vert sombre à jeunes pousses claires | 7 / 9 / 9 / 11 (longueur de feuille) |
| nageia-nagi | Feuilles opposées : décussées sur l'axe, dans un plan sur les rameaux. Ovales-lancéolées, coriaces, **sans nervure médiane**, 9 fines nervures parallèles de la base à la pointe, très luisantes. | vert sombre brillant, vert clair, panaché crème (Variegata) | 6 / 8 / 9 / 10 |
| taxus-baccata-if | Aiguilles plates de 1,5 à 3,5 cm, en deux rangs sur les rameaux et plus radiales sur l'axe, avec une pointe courte. Le pli dessine la nervure, le dessous vert-jaune est plus pâle. Rameaux verts puis brun-rouge. Arilles en coupe sous les rameaux, ouvertes sur une graine sombre : petit anneau vert au stade bouton, orange à mi-ouvert, rouge à l'ouvert. | vert sombre, doré (Aurea), vert sombre à arilles rouges (pied femelle) | 2 / 2,5 / 2,5 / 3 |
| acacia-feuillage | Trois formes selon le coloris : *A. baileyana*, feuilles bipennées de 2 à 4 paires de pinnules frangées, gris-bleu (Purpurea : pousses pourpres, rameaux mauves) ; *A. podalyriifolia* 'Pearl', phyllodes ronds argentés sur rameaux feutrés ; *A. cultriformis*, phyllodes triangulaires plaqués. | gris-bleu, gris-bleu à pousses pourpres, argenté Pearl, gris-vert cultriformis | 2 / 2,5 / 2,5 / 3,2 |
| adenanthos-sericeus-woolly-bush | Feuilles serrées tout autour des tiges, de 1,5 à 3 cm, divisées en 3 à 5 lobes linéaires. Le reflet soyeux est sur la face éclairée et les pointes jeunes sont presque blanches : on lit une fourrure gris-argent. | gris argenté soyeux, vert-gris | 3 / 4 / 4 / 5 |

## Vérifications
- **Planches** : 4 vues × 3 stades et tous les coloris, regardées en grand puis zoomées au DET 2. Corrections faites : reflet trop large qui ressemblait à une panachure, arilles cachées derrière le rameau, phyllodes du cultriformis trop étroits, reflets soyeux trop épais.
- **Cartes du Composer** : les 15 coloris sont en ordre (`sheets/cartes_composer.png`).
- **QA composée** avec `inc=` les 5 sid, graines 5, 11 et 23, 20 bouquets chacune : **0 F, 0 U, 0 kink**. J'ai regardé 3 captures de bouquets (graines 3, 7 et 12).
- **QA des modèles** : aucun des 76 modèles n'utilise ces sid (`models_of.py` renvoie une liste vide). Il n'y a donc rien à lancer.
- **Perf par branche**, sur une épine de 330 à 420, moyenne de 12 tirages :

  | sid | DET 1 | DET 2 (planche) |
  |---|---|---|
  | podocarpus | 6 ms, 111 éléments | 7 ms, 160 éléments |
  | nagi | 4 ms, 82 éléments | 9 ms, 133 éléments |
  | if | 10 ms, 132 éléments | 60 ms, 178 éléments |
  | acacia | 11 ms, 108 éléments | 11 ms, 145 éléments |
  | adenanthos | 16 ms, 141 éléments | 32 ms, 190 éléments |

  Pour comparer : Nordmann 13 ms et 207 éléments, mimosa 14 ms et 74 éléments. Au DET 1, les aiguilles d'if sont des traits ; elles ne deviennent des limbes 3D qu'au DET 2.
- **Perf globale** `perf=1` : 192 ms et 8 295 éléments par bouquet, contre 195 ms et 8 295 éléments sur l'espace `_test` vide de cette même machine. La différence vient de la machine (plus lente que la référence de 142 ms), pas du lot.

## Doutes
- Les graines du podocarpus sur leur réceptacle charnu ne sont pas dessinées : ce sont des pieds femelles, rares en fleuristerie. Même choix pour les petites fleurs rouges de l'adenanthos, rares sur tige coupée.
- Pour l'acacia, j'ai choisi la forme d'après le coloris. Le coloris vert de la recette (`#4c7a35`) se rapproche du cultriformis gris-vert.
- L'if au DET 2 coûte 60 ms, mais seulement sur les planches.
