# Lot 89 — capsules et gousses 2 (agent capsules2)

Branche `serre/89-capsules2`, fichier `s89a.js` (préfixe `l89`), aucune copie moteur.
Les 5 espèces sont nouvelles (aucune ancienne version dans `demo/src`). Elles ont toutes une recette et une fiche dans `k0.js`, que je n'ai pas modifié. Tous les coloris des recettes sont repris tels quels comme `c`. Les coloris ajoutés portent `f`, donc aucun modèle ne les choisit.

## Les espèces

### `scabieuse-etoilee-capsules` (Lomelosia stellata, syn. Scabiosa stellata)
- **Botanique.** Annuelle à tiges grêles, fourchues par paires, presque sans feuilles à la vente. La tête est une sphère de 3 à 4,5 cm faite de 40 à 60 akènes. Chaque akène porte une collerette papyracée : un entonnoir qui s'ouvre en coupe nervurée. Au fond de la coupe, les 5 soies noires du calice dessinent une petite étoile autour d'une gorge brune.
- **Dessin.**
  - Les fruits sont répartis sur la sphère selon une spirale de Fibonacci, et chaque coupe est en 3D : extérieur de l'entonnoir, intérieur, gorge et étoile.
  - Les coupes sont triées en profondeur, sur un cœur plus sombre.
  - Le nombre de coupes suit la taille de la tête.
  - `lsHeadS` donne une tige fine, avec 2 nœuds opposés et des rameaux en fourche qui portent des têtes plus jeunes.
- **Stades.** Bouton : petite boule verte serrée. Mi-ouvert : coupes à demi ouvertes. Ouvert : étoiles ouvertes.
- **Coloris.**
  - Ceux de la recette : vert tendre (frais), crème naturel, bronze et beige doré (Sternkugel).
  - Ajoutés (`f`) : blanchi, teinté bleu et teinté rose.
  - Les tiges sont paille pour les coloris secs, et verte pour le coloris frais.
- **Tailles** (`SZG`) : têtes de 3 à 4,5 cm.

### `amour-en-cage` (Alkekengi officinarum, syn. Physalis alkekengi)
- **Botanique.**
  - Tige simple de 40 à 70 cm, avec des feuilles alternes ovales sur un court pétiole.
  - À chaque aisselle haute, un pédicelle courbé porte une lanterne pendante : c'est le calice accrescent, papyracé, à 5 angles et 10 nervures. Il est cordé à la base autour du pédicelle et se ferme en pointe sur une baie rouge.
  - La lanterne passe du vert au jaune, puis à l'orange et à l'orange-rouge. Après l'hiver, il n'en reste qu'un squelette de nervures autour de la baie.
- **Dessin.**
  - L'axe suit l'épine du Composer. Le L-système fait pousser, à chaque nœud, le pétiole de la feuille et le pédicelle, qui se courbe sous le poids du fruit.
  - La lanterne est un corps de révolution à 5 lobes (`gsRev` du lot 28), avec 5 nervures fortes et 5 faibles. Ses épaules remontent au-dessus du point d'attache, et elle reste accrochée au bout de son pédicelle.
  - Le squelette est un réseau de 10 nervures reliées par des anastomoses irrégulières. La baie se voit à travers.
  - Les lanternes du haut sont plus jeunes : plus petites et plus vertes.
- **Coloris.** Orange lanterne, orange-rouge (Gigantea), vert (jeune) et squelette dentelle (sans feuilles), plus jaune orangé (mûrissant, `f`).
- **Tailles** : lanternes de 3,5 à 5 cm.

### `coton` (Gossypium hirsutum)
- **Botanique.**
  - Rameaux ligneux secs sans feuilles. Chaque capsule (4 à 6 cm) s'ouvre en 4 ou 5 valves brunes, pointues et raides, qui s'écartent et se recourbent.
  - De chaque loge sort une mèche de fibre blanche, et l'ensemble forme une boule.
  - Sous la capsule, 3 bractéoles sèches et frangées.
- **Dessin.**
  - La recette est `exotic` : le Composer place donc le coton comme une **tête**. Il est dessiné par `lsHeadS` : une capsule au sommet d'un rameau ligneux, et 1 ou 2 rameaux latéraux en zigzag qui portent des capsules plus jeunes. La tige du bouquet rejoint le col.
  - Une capsule est une seule pièce, ordonnée en interne : bractéoles, puis valves, puis mèches. L'ordre s'inverse quand on la voit par-dessous.
  - Les mèches sont des nuages bosselés, éclairés en haut à gauche.
  - Un chemin « épine » existe aussi, au cas où un modèle en fournirait une.
- **Stades.** Bouton : capsule fermée, verte virant au brun, serrée par les bractéoles. Mi-ouvert : valves entrouvertes, mèches qui pointent. Ouvert : boule pleine.
- **Coloris.** Blanc naturel et écru, comme dans la recette.
- **Tailles** : capsules de 4 à 6 cm.

### `asclepias` (A. tuberosa, A. curassavica, A. incarnata)
- **Botanique.**
  - Tige dressée, couverte de feuilles lancéolées étroites. Au sommet, des ombelles de 5 à 8 cm, souvent plusieurs ensemble.
  - Chaque fleur, d'environ 1 cm, rabat ses 5 lobes de corolle vers le bas et dresse une couronne de 5 capuchons autour du gynostège.
- **Dessin.**
  - Les rayons de l'ombelle, poussés par la tortue, forment un dôme.
  - Chaque fleur est en 3D, orientée selon son rayon : lobes réfléchis, capuchons dressés et colonne.
  - Les boutons sont ovoïdes. `lsHeadS` donne 4 nœuds feuillés et des ombelles latérales plus jeunes. `GH_BUDS` est déclaré.
  - Au détail de l'appli, un rayon est un seul trait.
- **Coloris.**
  - Ceux de la recette : orange (tuberosa), jaune (Hello Yellow), rouge et or (curassavica : lobes rouges, capuchons dorés), rose (incarnata Cinderella), mauve (Soulmate) et blanc (Ice Ballet).
  - Ajouté (`f`) : jaune d'or (Silky Gold).
- **Tailles** : ombelles de 5 à 8 cm.

### `gomphocarpus` (G. physocarpus, arbre à ballons)
- **Botanique.**
  - Tige à feuilles linéaires par paires. Des nœuds du haut pendent, sur des pédicelles courbes de 2 à 4 cm, des follicules gonflés de 5 à 8 cm.
  - Ces fruits sont vert pâle, à paroi mince, couverts de soies souples, avec une suture et un petit bec.
- **Dessin.**
  - Les ballons pendent sur des pédicelles poussés par le L-système, 1 ou 2 par nœud.
  - Chaque ballon a une suture et un bec courbe, qui passe derrière le corps quand la pointe se détourne.
  - Les soies, courbes, partent de la surface visible et dépassent de la silhouette.
  - Les feuilles sont en `bzBlade`.
- **Coloris.** Vert tendre et vert pomme (recette), plus vert rosé (mûr, `f`).
- **Tailles** : ballons de 5 à 8 cm.

### Règles tenues partout
- Les tiges sont courbes, sans coude.
- Chaque fruit pendant part du bout de son pédicelle.
- Tous les traits font au moins 1,1 unité au détail de l'appli : rayons, soies, étoiles, réseau du squelette.
- Dans un bouquet :
  - les tiges en grappe (amour-en-cage, arbre à ballons) partent de `o.from` ;
  - un fruit qui descendrait trop près de la lèvre n'est pas poussé ;
  - les rameaux du coton partent du côté haut de la tige.

## QA
- **Bouquets composés.** `run=composed&n=20&inc=<les 5>`, graines 5, 7 et 11 : 60 bouquets, **0 F, 0 U, 0 kink**.
  - Au premier passage, il y avait 1 U : un rameau de coton passait sur l'épaule d'un vase en cœur. C'est corrigé par le passage du coton en tête.
  - J'ai regardé deux captures de 8 bouquets et le livrable `bouquets.png`.
- **Modèles.** `models_of.py` ne renvoie aucun modèle pour ces 5 espèces : il n'y a pas de QA de modèles à faire.
- **Perf.** `perf=1` sur les 76 modèles, sur cette machine cloud : 201 ms et 8 295 éléments avec le lot, contre 197 ms et 8 295 éléments sans. Rien ne change.
- **Éléments SVG par tige entière** au détail de l'appli (DET 1), moyenne sur 12 dessins, tige, feuilles et têtes latérales comprises :

  | Espèce | Éléments |
  |---|---|
  | scabieuse étoilée (3 têtes) | 189 |
  | amour-en-cage | 163 |
  | coton | 225 |
  | asclépiade (2 à 3 ombelles) | 229 |
  | arbre à ballons | 219 |

  Pour comparer : sandersonia 646, agapanthe 696, buisson ardent 332.
- **Planches** : 9 vues × 3 stades, tous les coloris et 3 tailles, regardées en grand et zoomées (`det=2`, `fz=`).

## Diffs moteur
Aucun.

## Doutes
- Dans les cartes du Composer, les tiges du bouquet sont dessinées vertes par `bunchArt` (`SG`, commun à toutes les espèces). Elles ne reprennent donc pas la paille de la scabieuse sèche ni le bois du coton.
- Le coton est une tête, parce que sa recette est `exotic`. Si la propriétaire veut de longues branches en ligne, il faut que la recette passe à `a:'line'` dans `k0.js`. Le chemin « épine » est déjà prêt.
- Le squelette de l'amour-en-cage est un coloris, pas un stade. Je n'ai pas trouvé de coloris teinté (doré, argent) assez courant chez les grossistes pour l'ajouter.
