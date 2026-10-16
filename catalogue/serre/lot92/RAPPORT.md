# Lot 92 — céréales (agent « cereales »)

Fichier : `s92a.js` (préfixe `l92` / `L92_`). Aucune copie moteur, donc aucun diff moteur. Les cinq sids existaient seulement comme recettes génériques de `k0.js` : aucune ancienne version dessinée. `GH`, `CWS`, `SZG` et `GHI` sont enregistrés sous les mêmes sids.

## Moteur commun
- **L-système et pose.** Chaque plante est poussée par `lsTurtle` dans son repère droit (`lnAxis`, lot 18), puis posée par `l40Lay` : dans un bouquet, elle colle à son épine et ne descend jamais sous la lèvre.
- **Chaumes et nœuds.** Les chaumes sont des tubes (`lnTube`). Les entre-nœuds s'allongent vers le haut, le pédoncule est le plus long. Les nœuds sont des bagues renflées et plus sombres, dessinées sur le chaume lui-même.
- **Feuilles.** Ce sont des rubans 3D (`lnRibbon`) poussés pas à pas par la tortue (organes `b`). Elles se tordent et s'arquent, et deviennent sèches et frisées dans les coloris séchés.
- **Têtes.** Une tête est faite de petites pièces triées de l'arrière vers l'avant, puis réparties en 3 bandes de profondeur dans l'appli (6 sur les planches), avec un chemin par ton dans chaque bande.
- **Traits fins.** Dans un bouquet, aucun trait n'est plus fin que 1,05 unité (barbes, pédicelles, rameaux). Chaque pièce part de sa courbe porteuse.
- **Courbure.** L'inclinaison d'un épi est répartie sur les 4 ou 5 premiers entre-nœuds du rachis, puis la gravité le courbe : il n'y a aucun coude.

## Espèces
- **`ble` — blé** (*Triticum aestivum*, *T. turgidum*)
  - Morphologie : épi distique de 7 à 9,5 cm, avec 16 à 20 épillets alternes. Chaque épillet porte 3 ou 4 fleurons en éventail dans le plan perpendiculaire au rachis. Barbes de 5 à 7,5 cm, ou une simple pointe pour le blé sans barbe. Botte de 3 chaumes (1 ou 2 dans un bouquet).
  - Stades : en gaine (feuille paniculaire, barbes qui pointent), vert, mûr (l'épi penche un peu).
  - Coloris : doré barbu, doré sans barbe, paille, vert frais, Black Beard (barbes noires), blanchi, teint bordeaux.
  - Tailles : 50 à 80 cm.
- **`avoine` — avoine** (*Avena sativa*)
  - Morphologie : panicule lâche de 17 à 23 cm, en demi-verticilles de 5 à 2 rameaux, rameaux secondaires. Épillets pendants de 2 à 2,4 cm en clochette : glume arrière, grains, glume avant, parfois une courte arête.
  - Stades : panicule serrée en gaine, rameaux dressés, rameaux étalés et épillets pendants.
  - Coloris : vert pâle, paille, blanchi, teints jaune, orange, rouge et rose.
  - Tailles : 50 à 80 cm.
- **`orge` — orge** (*Hordeum vulgare*, à deux rangs)
  - Morphologie : épi compact de 5,5 à 7,5 cm. Grains fertiles sur deux rangs, encadrés par des épillets stériles en lamelles. Barbes de 10 à 14 cm, en pinceau qui suit l'épi : droit quand il est vert, courbé avec lui quand il est mûr.
  - Coloris : doré, vert, blond pâle, noir (Black Barley), blanchi, stabilisé sauge.
  - Tailles : 50 à 70 cm.
- **`sorgho-a-balai` — sorgho à balai** (*Sorghum bicolor* var. *technicum*)
  - Morphologie : canne de 5 à 6 mm (au moins 3 unités), dont les nœuds sont gainés de gaines papyracées (feuilles ôtées comme dans le commerce). Panicule de 32 à 42 cm : un axe très court, 14 à 19 longues fibres raides en balai qui s'arquent au bout, et des grappes de grains ronds d'environ 3 mm sur la moitié haute, avec ramilles.
  - Coloris : doré, rouge brique, bronze, bordeaux, brun, crème, vert.
  - Tailles : 60 à 100 cm.
- **`broom-bloom` — broom bloom**
  - Recherche : les grossistes (Atlas Flowers, Floristry Warehouse, Brie Saan Zee, Essentially Hops) vendent sous ce nom le genêt à balais séché (*Cytisus scoparius*), récolté en Italie. Il existe en naturel, blanchi et teint, en bottes de 40 à 50 cm (6 à 9 tiges).
  - Morphologie dessinée : une tige anguleuse ramifiée dans sa moitié haute en verges dressées, presque sans feuilles, portant les calices et boutons séchés (1 à 3 par nœud, en bouquet au bout des verges). La teinte couvre toute la plante.
  - Coloris : naturel olive, blanchi, jaune, orange brûlé, rouge, rose, lilas, mauve, bleu foncé, vert, paille.
  - Tailles : 40 à 60 cm.

## QA et perf
- **Bouquets composés** avec `inc=ble,avoine,orge,sorgho-a-balai,broom-bloom` : graines 1, 5 et 7 × 20 → **0 F, 0 U, 0 kink**. J'ai regardé deux captures (graines 3 et 9) : les épis dépassent la masse et rien ne passe sous la lèvre.
- **Modèles du catalogue :** `models_of.py` ne renvoie aucun modèle (`ns=` vide), donc il n'y avait rien à tester.
- **Perf sur 76 modèles :** 191 ms et 8 295 éléments, que le lot soit chargé ou non (ce conteneur est plus lent que la référence de 142 ms). Aucun impact.
- **Éléments par tige** au DET 1 dans un bouquet :
  - blé : 82 ;
  - avoine : 40 ;
  - orge : 90 ;
  - sorgho : 32 ;
  - broom bloom : 40 (300 avant le regroupement des ramilles par bandes).

## Doutes
- **Identité de broom bloom.** Les vendeurs citent *Cytisus scoparius*, mais aucune page n'a pu être ouverte (proxy) : l'identité repose sur les extraits de recherche. Si le produit visé était un sorgho ou un millet à balai, il faudrait redessiner la tête.
- **Barbes sur les planches.** Elles sont à 0,55 unité sur les planches, pour la finesse en zoom, et à 1,05 dans les bouquets, comme l'exige la règle des pièces flottantes.
- **Orge mûre.** Les barbes s'ouvrent en éventail depuis l'épi courbé. Le rendu est plausible, mais plus spectaculaire que certaines photos.
- **Cellules des coloris.** Dans les planches de coloris, le haut des épis frôle l'étiquette de la cellule, à cause du cadrage carré de `pl.js`.
