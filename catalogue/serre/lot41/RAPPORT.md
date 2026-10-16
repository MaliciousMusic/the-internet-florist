# Lot 41 « printemps 3 » — rapport (agent printemps3)

Fichier : `s41a.js` (préfixe `l41` pour les aides partagées, plus les noms d'espèce `erem*`, `frit*`, `nar*`, `cyr*`, `vib*`, `CW_EREM`, `CW_FRIT`, `CW_NAR`, `CW_CYR`, `CW_VIB`). Aucun module moteur n'est modifié, donc pas de diff moteur.
Les cinq espèces poussent par le L-système : `spGrow` (r5a) pour les deux épis, `lsTurtle`/`lsPlant` pour les trois têtes.

## Par espèce

**Viburnum opulus 'Roseum', boule de neige (`viburnum-roseum`)**
- *Botanique.* Rameau ligneux. Feuilles opposées décussées, trilobées comme un érable, grossièrement dentées, nervation palmée, sur un pétiole. Boules (5 à 8 cm) de fleurettes stériles à 5 pétales (parfois 4), larges, arrondies et inégales. Elles sont vert anis au gonflement, puis crème, puis blanches, et rosissent en fin de saison.
- *Dessin.* Un rameau à deux nœuds de feuilles. Le nœud du haut lance 1 ou 2 rameaux courts, chacun avec une paire de petites feuilles et une boule plus jeune : 2 à 3 têtes par tige, à des âges différents.
- *Boule.* Elle reprend la projection des hortensias (`floretPath` de s4a.js) : des fleurettes posées sur une sphère et dessinées du fond vers l'avant, au-dessus d'une sous-couche d'ombre.
- *Stades.* Bouton = boule verte serrée de fleurettes fermées. Mi-ouvert = boule plus petite et verdie. Ouvert = la boule entière.
- *Coloris.* Vert anis (boule verte), vert tendre (virant au blanc), blanc, blanc crème, blanc rosé (fin de saison).
- *Tailles.* Boule de 5, 6, 7 ou 8 cm.

**Fritillaria persica (`fritillaire-persica`)**
- *Botanique.* Tige raide. Feuilles glauques lancéolées, nombreuses, en spirale sur les deux tiers inférieurs, plus petites vers le haut. Épi conique de 24 à 32 clochettes pendantes, chacune sur un pédicelle arqué né d'une petite bractée. Elles s'ouvrent de bas en haut ; au sommet, des boutons dressés.
- *Dessin.* Une clochette = deux chemins : le pédicelle avec sa bractée, et la cloche dans un dégradé pruineux partagé (`l41Bloom`). On voit la gorge sombre quand la cloche tourne son ouverture vers l'œil.
- *Coût.* 614 → 122 éléments (÷ 5), 14 → 4 ms.
- *Coloris.* Pourpre prune pruineux (Adiyaman), aubergine presque noir, pourpre lie-de-vin, vert crème (Ivory Bells), vert tendre.
- *Tailles.* Épi de 18, 22, 25 ou 30 cm, sur une tige d'environ 80 cm.

**Eremurus, lis des steppes (`eremurus`)**
- *Botanique.* Tige nue : les feuilles sont toutes basales et absentes de la tige coupée. Très long épi dense de petites étoiles à 6 tépales sur des pédicelles étalés, avec 6 étamines bien saillantes à anthères orange. L'ouverture monte de la base vers le haut ; un épi âgé porte des fleurons fanés à sa base, puis viennent des boutons colorés et un cône de boutons verdâtres au sommet.
- *Dessin.* L'épi est dessiné par bandes, sur le modèle des épis de s8a/r5a : chaque bande de l'épi, derrière ou devant l'axe, tient en 3 à 5 chemins (pédicelles, étoiles, étamines + anthères, ou boutons + reflets). 200 à 300 fleurons au total.
- *Coût.* 1555 → 71 éléments (÷ 22), 30,8 → 4 ms.
- *Coloris.* Orange (Cleopatra), orange doré (Pinokkio), jaune (stenophyllus), jaune pâle (Line Dance), saumon (Romance), abricot, rose (robustus), blanc (himalaicus).
- *Tailles.* Épi de 40, 50, 60 ou 70 cm.

**Narcisse trompette (`narcisse-trompette`, division 1)**
- *Botanique.* Hampe creuse glauque. Spathe papyracée brune au coude. Fleur tenue à l'horizontale, légèrement penchée : 6 tépales en étoile (3 externes plus larges, 3 internes devant) autour d'une trompette aussi longue qu'eux, évasée en bord frangé. L'ovaire vert est derrière.
- *Stades.* Le bouton pend dans sa spathe (stade « col de cygne »). À mi-ouverture, les tépales s'écartent vers l'avant autour d'une trompette encore courte.
- *Coût.* Environ 50 éléments.
- *Coloris.* Jaune (Dutch Master), jaune d'or (Golden Harvest), citron à trompette blanchissante (Spellbinder), blanc (Mount Hood), crème à trompette citron (Bravoure), bicolore blanc et jaune (Las Vegas).
- *Tailles.* Fleur de 7, 8, 9 ou 10 cm.

**Cyrtanthus (`cyrtanthus`, C. mackenii et hybrides d'elatus)**
- *Botanique.* Hampe creuse sans feuilles. Deux valves de spathe papyracées sous une ombelle de 5 à 8 fleurs tubulaires arquées et pendantes, sur des pédicelles qui s'arquent. Chaque tube s'élargit vers la bouche, avec 6 lobes courts évasés.
- *Stades.* Les boutons sont d'abord dressés dans la spathe, puis retombent quand les pédicelles s'allongent.
- *Coût.* Environ 95 éléments.
- *Coloris.* Rouge écarlate, rouge sang, orange, saumon, rose, crème (pointes verdâtres), jaune.
- *Tailles.* Ombelle de 6, 7, 8 ou 9 cm.

Toutes les espèces sont dans `GH_BUDS` : le Composer peut les couper en bouton ou mi-ouvertes. Les GHI sont : eremurus et fritillaire en `epi`/`plant` (sur l'épine du Composer), viburnum en `sphere`, narcisse en `etoile`, cyrtanthus en `grappe`.

## QA et perf
- **Bouquets composés** (`inc=` les 5 espèces, graines 5, 11 et 23 × 20) : 0 F, 0 U, 0 kink.
- **Modèles** 2, 14, 29, 34 et 49 (graines 7 et 23) : 0 F, 0 U, 0 kink.
- **Traits.** Les traits fins qui portent un détail (pédicelles, filets d'étamines, pétioles) font au moins 1,05 unité. Chaque détail part de sa courbe porteuse : pédicelle depuis le rachis, étamine depuis le centre de l'étoile, anthère au bout de son filet.
- **Éléments par tête** (DET 1, compteur maison sur 10 rendus) : viburnum 145 (2 à 3 boules), fritillaire 122, eremurus 71, cyrtanthus 94, narcisse 51.
- **Perf** (76 modèles, même machine, mesurés l'un après l'autre) :
  - sans le lot : 190 ms et 9 399 éléments ;
  - avec le lot : 192 ms et 9 345 éléments.
  - La machine cloud est plus lente que la référence de 142 ms ; l'écart dû au lot est nul.

## Planches (`sheets/`)
`<sid>_vues.png` et `<sid>_coloris.png` pour chaque espèce, `cartes_composer.png` et `bouquets.png`.

## Doutes
- **Fritillaire.** « Vert tendre » est une forme verte vendue sous divers noms ; je n'ai pas trouvé de cultivar sûr.
- **Eremurus.** « Abricot (Cleopatra clair) » reprend une couleur de la recette d'origine plutôt qu'un cultivar précis.
- **Boule de neige.** Le léger voile vert olive au bord ombré des boules vertes vient de la palette ; il reste discret.
- **Narcisse.** En vue « dressée », la fleur regarde vers le haut et la spathe passe devant le revers : c'est plausible, mais la vue est peu naturelle pour un narcisse.
