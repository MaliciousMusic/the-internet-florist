# Lot 107 « printemps 8 » : rapport

Agent cloud `printemps8`, branche `serre/107-printemps8`. Fichier du lot : `s107a.js`, préfixe `l107` partout (`L107_*`, `l107*`). Aucun module moteur n'est copié ni modifié.

Les 5 sids n'avaient pas encore de version de la Serre (seulement la recette générique de `k0.js`). Ils sont neufs ici. Aucun modèle du catalogue n'utilise ces espèces (`models_of.py` renvoie `ns=` vide).

## Moteurs réutilisés
- **Pousse.** Les 5 plantes poussent avec `lsDerive`/`lsTurtle`, comme le muscari et le muguet (lot 66).
  - D'abord une hampe, puis la grappe ou l'ombelle, nœud par nœud.
  - Chaque fleur pousse au bout de son pédicelle F, et la tropie courbe les pédicelles.
  - `lsPlant` coupe l'axe à la première fleur (`N0`) ou à la spathe, et le reste part dans les tiges du bouquet (`EXT`).
  - `lsNeck` donne le col.
- **Ombelle de la triteleia.** C'est celle de l'agapanthe (`umbelPlant`, r2a) : une spathe de bractées scarieuses, puis des pédicelles en spirale de longueurs inégales, avec boutons, fleurs qui s'ouvrent et fleurs ouvertes ensemble.
- **Grappe arquée de la jacinthe des bois.** C'est celle du muguet : une grappe d'un seul côté qui s'arque, avec des clochettes pendantes.
  - L'arc est obtenu par une visée progressive (`aim`, `k=.09`) puis une tropie négative, sans `&` brusque : la tige se courbe et ne fait jamais de coude net.
- **Nouveau dans le lot :**
  - `l107Grow` retire de `res.chains` les chaînes-pédicelles poussées par la tortue. Chacune est dessinée avec sa fleur, en partant de son nœud sur l'axe, donc chaque détail part de sa courbe porteuse.
  - Les fleurs sont triées en profondeur et dessinées par petits paquets (`chunk`), comme les bandes de `l67Raceme`.
  - `l107Pack` dessine un paquet de fleurs étoilées en 3D :
    - six tépales sur un cône évasé (`l107At`), séparés face interne et face externe ;
    - les marques : nervure, anneau, œil ;
    - les étamines (traits de 1,1 au moins) et les anthères, posées sur le tépale quand la fleur est petite ;
    - le tube derrière ou devant selon l'orientation.
  - `l107Bell` dessine les clochettes de la jacinthe des bois.
- Tous les traits font 1,05 unité ou plus (pédicelles, étamines, nervures de la clochette).

## Espèces
### triteleia — Triteleia laxa (syn. Brodiaea laxa), T. ixioides
- **Botanique.**
  - Une hampe fine, sans feuilles (les feuilles basales sont fanées à la floraison), de 40 à 60 cm.
  - En haut, 2 à 4 bractées scarieuses, puis une ombelle lâche de 10 à 25 fleurs, sur des pédicelles inégaux de 2 à 6 cm.
  - Chaque fleur est un entonnoir de 2,5 à 4 cm : un tube étroit, puis 6 lobes oblongs étalés, chacun avec une nervure médiane plus sombre.
  - Les 6 étamines sont sur deux rangs, à la gorge.
  - Boutons, fleurs mi-ouvertes et fleurs ouvertes coexistent.
- **Coloris :**
  - Bleu violet (Queen Fabiola) ;
  - Violet profond (Corrina) ;
  - Blanc strié de violet (Rudy) ;
  - Blanc argenté (Silver Queen) ;
  - Bleu ciel (Aquarius) ;
  - Jaune pâle (T. ixioides Starlight).
- **Tailles (diamètre de l'ombelle).** 8, 9, 10, 11 et 12 cm.

### jacinthe-des-bois — Hyacinthoides non-scripta, H. hispanica
- **Botanique.** La forme suit le coloris (`fm`).
  - non-scripta : la grappe s'arque au sommet, avec 6 à 12 clochettes étroites, toutes d'un côté. Les tépales sont roulés en arrière et les anthères sont crème.
  - hispanica : la hampe est droite, avec 9 à 13 clochettes plus larges et évasées, tout autour, à peine recourbées. Les anthères sont bleues.
  - Les boutons sont en haut, vert bleuté.
  - Sur la planche, deux feuilles en lanière entourent le pied (absentes en bouquet).
- **Coloris :**
  - Bleu violet (non-scripta) ;
  - Bleu (hispanica Excelsior) ;
  - Bleu porcelaine (hispanica Blue Queen) ;
  - Blanc (hispanica White City) ;
  - Rose (hispanica Queen of the Pinks) ;
  - Blanc (non-scripta Alba).
- **Tailles (longueur de la grappe).** 8, 10, 12, 14 et 15 cm.

### scille — Scilla peruviana, S. siberica, S. mischtschenkoana
- **Botanique.** La forme suit le coloris.
  - peruviana : une hampe forte, puis un large cône de 40 à 52 étoiles plates de 2 cm.
    - Les pédicelles sont longs et étalés à la base, courts en haut. Les boutons sont serrés en cône sombre au sommet.
    - Les filets sont bleus et les anthères jaunes. Les feuilles sont larges.
  - siberica / Tubergeniana : une hampe grêle rougeâtre, puis 3 à 5 étoiles en clochette de 1,5 cm, pendantes sur de courts pédicelles arqués, avec une nervure médiane sombre.
- **Coloris :**
  - Bleu violet (peruviana) ;
  - Blanc (peruviana Alba) ;
  - Bleu lilas (peruviana Lilacina) ;
  - Bleu gentiane (siberica Spring Beauty) ;
  - Blanc (siberica Alba) ;
  - Bleu pâle strié (mischtschenkoana Tubergeniana).
- **Tailles.** 6, 8, 10, 11 et 12 cm : c'est le diamètre du cône de peruviana. La grappe de siberica fait 0,42 × cette taille.

### sparaxis — Sparaxis tricolor et hybrides
- **Botanique.**
  - Une tige grêle, puis un épi lâche de 3 à 5 fleurs, alternes, chacune sortant de deux bractées scarieuses déchirées et striées de brun.
  - La fleur est une étoile plate de 4 à 6 cm : 6 tépales obovales, un centre jaune cerclé de marques noires en flèche (pourpres sur les clairs), 3 étamines aux anthères sombres.
  - Le bouton du sommet est fermé dans ses bractées. Sur la planche, une feuille en lanière.
- **Coloris :**
  - Orange ;
  - Rouge ;
  - Rose vif ;
  - Blanc crème (cercle pourpre) ;
  - Jaune ;
  - Pourpre ;
  - Saumon.
  - Les hybrides se vendent en mélange, sous la couleur, sans nom de cultivar stable.
- **Tailles (diamètre de la fleur).** 4, 4,5, 5, 5,5 et 6 cm.

### ixia — Ixia hybrides, I. viridiflora
- **Botanique.**
  - Une tige fine et raide, puis un épi de 10 à 14 fleurs en spirale, sessiles.
  - La fleur est un tube fin, puis une étoile de 3 cm : 6 tépales elliptiques pointus et un cœur sombre (pourpre, cramoisi, brun ; presque noir, cerclé de pourpre, chez viridiflora).
  - Les fleurs s'ouvrent de la base vers le haut. Les boutons sont fins et alignés vers la pointe.
- **Coloris :**
  - Blanc à cœur pourpre (Panorama) ;
  - Crème (Giant) ;
  - Rose cerise (Mabel) ;
  - Rose tendre (Rose Emperor) ;
  - Jaune (Yellow Emperor) ;
  - Rouge carmin (Castor) ;
  - Orange (Hogarth) ;
  - Bleu-vert à œil noir (viridiflora).
- **Tailles (longueur de l'épi).** 8, 10, 12, 13 et 15 cm.

Registres :
- `GH_BUDS` contient les cinq espèces ;
- `GHI` :
  - triteleia : sphere ;
  - jacinthe des bois, scille et ixia : grappe ;
  - sparaxis : etoile ;
  - les cinq sont en `k:'head'`.

## QA
- **Bouquets composés**, `inc=triteleia,jacinthe-des-bois,scille,sparaxis,ixia`, sur les graines 5, 11 et 17 × 20 bouquets, soit **60 bouquets : 0 F, 0 U, 0 kink**.
  - Les captures ont été regardées : graines 3, 11 et 7 (`sheets/bouquets.png`).
- **Modèles du catalogue.** Aucun modèle n'utilise ces 5 espèces (`models_of.py` renvoie une liste vide), donc il n'y a rien à tester.
- **Éléments SVG par tête** (`lsdbg`, planche avec feuilles) :
  - triteleia : 54 ;
  - jacinthe des bois : 83 ;
  - scille peruviana : 106 ;
  - sparaxis : 74 ;
  - ixia : 70.
- **Perf** (`perf=1`, 76 modèles) : 8 295 éléments par bouquet en moyenne, sous la référence de 10 150.
  - Le temps moyen est de 265 ms sur cette machine cloud, contre une référence d'environ 142 ms. Cette machine est plus lente.
  - Le lot ne touche ni le moteur ni ces modèles, donc ses fonctions ne s'exécutent pas pendant ce test.
- **Diffs moteur :** aucun.

## Doutes
- Les noms de cultivars de sparaxis ne sont pas stables dans le commerce : les coloris portent leur seul nom de couleur.
- « Hogarth » (ixia) est crème à cœur pourpre selon certaines sources, et orange-jaune selon d'autres. Je l'ai gardé pour l'orange.
- Les formes de la scille (siberica, petite, et peruviana, grande) partagent un seul `SZG`. La taille est celle du cône de peruviana, et siberica est réduite à 0,42 de cette taille.
- En vue « dressée », l'axe de face pointe vers le ciel. Les fleurs plates (sparaxis, ixia) se voient alors presque de chant. C'est cohérent en 3D, mais moins lisible.
