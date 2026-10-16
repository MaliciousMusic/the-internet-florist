# Lot 104 « australes » : rapport

Branche `serre/104-australes`, fichier `s104a.js` (préfixe `l104` / `L104_`). Aucun moteur modifié : le lot réutilise `protGrow`/`protAlong`/`protLeaf`/`protCone`/`protBody`/`protLig` (lot 16), `l53Grow`/`l53Cut` (lot 53) et `polyRibbon`/`lsTurtle` (l0). Aucune de ces espèces n'avait de dessin : elles n'existaient que dans `k0.js` (`RECIPES`, `CATMETA`). Les 4 sont dans `GH_BUDS`.

## Espèces

### `aulax` (Aulax cancellata)
- **Botanique.** Arbuste dioïque du fynbos. Rameaux dressés, chargés de feuilles en aiguilles canaliculées (5 à 7 cm).
  - Femelle : coupe globuleuse terminale faite de 20 à 38 faisceaux de rameaux incurvés, rougis, autour d'un axe court de fleurs femelles qui mûrit en cône ligneux.
  - Mâle : grappes de 5 à 15 racèmes lâches de 3 à 5 cm, plumeux et jaunes.
- **Ce qui est fait.**
  - Aiguilles en ruban 3D effilé (`l104Needle`), avec un sillon en gros plan.
  - Coupe femelle : des ligules étroites incurvées, fermées en bouton puis ouvertes en globe, avec un cône pâle puis brun au cœur.
  - Racèmes mâles : arqués sous leur poids, plumeux (étamines qui partent de l'épi), plus courts et verdâtres en bouton.
  - Rameaux latéraux avec des têtes plus jeunes.
- **Coloris.** Coupe rouge, coupe bordeaux, coupe verte rougie (femelle) ; épis jaunes plumeux, épis jaune citron (mâle).
- **Tailles.** La recette donne 25 cm pour toute la branche. La coupe femelle en vaut 1/5 (environ 5 cm) et la grappe mâle 1,7 fois plus. `SZG` = 18, 20, 25, 28 et 30 cm de branche.

### `anigozanthos` (patte de kangourou)
- **Botanique.** Hampe nue et veloutée qui se ramifie au sommet en 2 à 4 racèmes unilatéraux. Chaque fleur est un tube courbe de 3 à 6 cm, feutré, fendu dessous, qui s'ouvre en 6 lobes étalés (la « griffe ») avec les étamines dans la gorge. Les fleurs s'ouvrent depuis la base du rameau et les boutons courbes restent serrés à son bout.
- **Ce qui est fait.**
  - La hampe (L-système, 3 bractées) se prolonge dans le premier rameau ; les autres rameaux en partent bas et se courbent vers le haut. Aucun coude.
  - Les tubes sont en 3D, avec l'ombrage du velours, la frange feutrée et les étamines en gros plan.
  - La tête ne tourne qu'à 40 % vers la vue demandée : la hampe reste dressée.
- **Coloris.** Rouge (Big Red), jaune (Bush Gold), orange (Orange Cross), rose (Pink Joey), vert à tige rouge (A. manglesii, base des tubes rouge), vert chartreuse (Kings Park), bordeaux (Bush Ruby).
- **Tailles.** Inflorescence de 7, 8, 10, 12 et 14 cm.

### `isopogon` (I. anemonifolius, I. formosus, I. dubius)
- **Botanique.** Tête ronde d'une centaine de fleurs fines et velues. Chaque fleur finit en massue, qui se fend en 4 segments recourbés et libère un style fin. Les fleurs s'ouvrent du bord vers le centre. Le réceptacle conique mûrit en cône gris (« drumstick »), vendu séché. Les feuilles sont divisées en lobes étroits et plats (anemonifolius), fins et piquants chez formosus.
- **Ce qui est fait.**
  - Tête en 3D : boule de boutons en massue, puis tubes, styles et segments recourbés, avec les bractées involucrales.
  - Les têtes des rameaux latéraux les plus âgés sont des cônes secs (environ 30 %).
  - Feuilles divisées par `l53Cut` (avec fourche).
- **Coloris.** Jaune (I. anemonifolius), jaune citron, rose (I. formosus), rose magenta (I. dubius), cône séché naturel, cône séché gris argent.
- **Tailles.** 3, 3,5, 4, 4,5 et 5 cm.

### `hakea` (Hakea laurina, « pincushion »)
- **Botanique.** Glomérules globuleux axillaires près des extrémités. Les périanthes cramoisis forment une boule d'où les longs styles crème jaillissent droits dans toutes les directions. En bouton, chaque style reste pris dans son périanthe et forme une boucle. Les styles dorent avec l'âge. Les feuilles sont étroitement elliptiques, gris-vert et coriaces.
- **Ce qui est fait.**
  - Boule cramoisie texturée.
  - Styles droits (avec stigmate) libérés progressivement ; les autres restent en boucle.
  - Bractées brunes à la base.
  - Têtes axillaires sur des rameaux très courts (`lat.nodes=0`) plus une tête terminale.
  - Feuilles `protLeaf` pétiolées, à marge jaunâtre.
- **Coloris.** Rouge à épingles crème, cramoisi à épingles dorées (styles âgés), rose à épingles blanches (jeune), rouge rosé à épingles roses.
- **Tailles.** 4, 4,5, 5, 5,5 et 6 cm.

## Vérifications
- **Planches** : 9 vues × 3 stades, coloris et tailles, regardées en grand et zoomées (`fz`, `det=2`).
  - Corrigé en cours de route : le peigne de boutons d'anigozanthos, le bouton terminal flottant hors du rameau, la hampe pliée en profil, les bractées de hakea dessinées devant la boule, les racèmes mâles d'aulax trop raides, la taille d'aulax (25 cm pris pour la tête), les feuilles devant les têtes (`zhk`).
- **QA composée** `inc=aulax,anigozanthos,isopogon,hakea`, graines 5, 11, 23 et 42 × 20 bouquets : **80 bouquets, 0 F, 0 U, 0 kink**. Captures regardées : graines 7 et 23.
- **Modèles** : `models_of.py` ne renvoie aucun modèle (`ns=` vide). Il n'y a donc pas de QA de modèles à faire.
- **Perf** (`perf=1`, 76 modèles) : 178 ms et 8 295 éléments en moyenne. Le lot ne touche pas au moteur et n'entre dans aucun modèle : ce chiffre est la base de cette machine, pas un effet du lot.
- **Éléments SVG à DET 1**, plante entière avec ses feuilles et ses têtes latérales : aulax 72 à 113, anigozanthos 58 à 181 (le maximum avec un rameau latéral), isopogon 48 à 122, hakea 68 à 102. Chaque tête seule reste sous 100.
- Tous les traits porteurs de détails font au moins 1,1 unité. Chaque détail (style, stigmate, lobe, étamine, aiguille) part de sa courbe porteuse.

## Doutes
- **Couleur de la coupe femelle d'aulax.** Les sources décrivent une coupe de rameaux incurvés, sans dire nettement qu'elle est rouge. Les coloris rouge et bordeaux suivent le commerce (« Aulax red »).
- **Feuilles d'hakea.** Seule la nervure médiane est dessinée ; les deux nervures longitudinales faibles ne le sont pas.
- **Têtes d'hakea.** Elles sont toutes au bout de rameaux courts, ce qui simplifie un peu les glomérules sessiles en série le long du rameau.
- **Composer.** `GHI.k='head'` sort aulax du mode « spray » des grappes : c'est voulu, la branche porte une tête.
