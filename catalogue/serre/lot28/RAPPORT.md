# Lot 28 : gousses, capsules et matières (agent « gousses »)

Fichier : `s28a.js`, chargé avant c4.js. Aucun module moteur n'est modifié, donc pas de diff moteur.
Outils communs du lot :
- `gsRev` : solide de révolution à lobes et côtes (capsule, gousse), dessiné par fuseaux et bandes tonés selon leur orientation. Les fuseaux arrière, orientés dans le même sens, forment la silhouette. Au détail de l'appli (DET 1), le corps est un seul remplissage en dégradé partagé, avec ses côtes et ses rayures par-dessus.
- `gsProf` : profil Catmull-Rom, sans paliers aux nœuds.
- `gsCapF` : la capsule suit sa tige ; sur la planche, plongée et contre-plongée inclinent son sommet.

## Pavot, `pavot-capsules` (Papaver somniferum, P. setigerum)
- **Botanique** :
  - capsule glabre en urne, de 2 à 5 cm, vert glauque et poudrée quand elle est fraîche ;
  - côtes fines jusqu'au disque stigmatique : 8 rayons au détail de l'appli, 11 sur la planche (de 8 à 16 dans la nature). Les rayons se terminent en lobes arrondis qui débordent du col ;
  - petit réceptacle renflé sous la capsule ;
  - séchée, elle porte une couronne de pores sous le disque ;
  - tige raide et glauque, sans feuilles (comme dans le commerce), avec parfois un rameau qui porte une capsule plus jeune.
- **L-système** : `lsHeadS`. En ligne de modèle, la tige suit l'épine du Composer.
- **Stades** : jeune capsule plus petite et plus verte, capsule pleine, capsule mûre. Les coloris séchés ou teintés ne changent que de taille.
- **Coloris (11)** : vert glauque (frais), vert (frais), vert tendre (setigerum), naturel séché, brun doré séché, blanchi, teinté noir, peint or, teinté rose, teinté lilas, teinté orange.
- **Tailles** : de 2,5 à 5 cm (SZG `[2.5,3,3.5,4,4,4.5,5]`).

## Nigelle, `nigelle-capsules` (Nigella damascena ; N. orientalis)
- **Botanique** :
  - capsule en ballon, formée de 5 follicules soudés : lobes arrondis, sillons nets ;
  - rayures pourpres le long des follicules ;
  - 5 styles persistants qui forment des cornes ;
  - collerette de bractées filiformes, divisées au détail planche (« cheveux de Vénus ») ;
  - feuilles plumeuses et rameaux qui portent des capsules plus jeunes.
- **'Transformer' (N. orientalis)** : pas de collerette ; ses follicules sont libres en haut, avec de longs becs étalés.
- **Coloris (9)** : vert rayé pourpre (frais), vert olive rayé (mûrissant), pourpre noir ('Albion Black Pod'), vert ('Albion Green Pod'), beige séché, brun séché, blanchi, teinté noir, N. orientalis 'Transformer'.
- **Tailles** : de 2 à 3,5 cm.

## Baptisia, `baptisia-gousses` (Baptisia australis)
- **Botanique** :
  - légumes gonflés, oblongs, de 3 à 5 cm sur 1,5 à 2 cm ;
  - chaque gousse porte un stipe court au-dessus du calice persistant, et se termine par un bec court et raide ;
  - suture ventrale en fine couture ;
  - gousses alternes (2/5) et ascendantes, sur une grappe terminale et 2 ou 3 grappes latérales ;
  - tiges gris foncé.
- **Les anciennes « boules lisses » sont remplacées.** Gris anthracite à noir mat, avec une pruine poudrée sur les lumières.
- **Coloris (7)** : noir mat (séché), gris anthracite (séché), gris ardoise poudré (le #5a606a du modèle 25), brun noir (séchant), brun (séchant), vert (frais), vert glauque (frais).
- **Tailles** : partie fructifère de 20 à 40 cm, sur des tiges de 50 à 80 cm.

## Mousse espagnole, `tillandsia-usneoides-mousse-espagnole`
- **Botanique** :
  - fins filaments écailleux, gris argenté, ramifiés et emmêlés en barbe ;
  - à chaque nœud, le fil repart en zigzag dans l'espace et porte une feuille filiforme courbe de 2 à 5 cm ;
  - les écailles sont rendues par un trait clair interrompu.
- **Drapé** : quelques fils sont repliés par-dessus la lèvre, puis la barbe tombe devant le vase et suit la brise. Elle ne part jamais de dessous la lèvre.
- **Coût** : 3 profondeurs × 2 ou 3 chemins, soit environ 8 éléments par tracé (26 mesurés par drapé).
- **Coloris (4)** : gris argenté, gris vert, beige naturel (préservée, le #9a8e7a du modèle 25), vert mousse teintée.
- **Tailles** : de 30 à 60 cm.

## Branche lichénée, `branche-lichen` (remplace `xLichen`)
- **Botanique** :
  - rameau sec gris-brun de prunellier : ramifications larges, ergots courts et petits zigzags ;
  - lichens foliacés : rosettes de lobes arrondis, plaquées et enroulées autour de l'écorce, au cœur plus gris ;
  - lichens fruticuleux : touffes de lanières qui fourchent ;
  - lichens crustacés : plaques pâles ;
  - les lichens sont plus denses sur le vieux bois.
- **Coût** : par rameau, une couche derrière et une couche devant, avec un chemin par sorte et par ton.
- **Pied dégagé** : en bouquet, le pied qui entre dans le col reste sans lichen (on le verrait sous la lèvre).
- **Coloris (5)** : vert-de-gris pâle, gris argenté, vert sauge, gris beige (bouleau, le #a49d8b du modèle 25), vert jaune (Flavoparmelia).
- **Tailles** : de 40 à 70 cm.

## QA
- **Bouquets composés**, avec `inc=` les 5 espèces : seed 5, 11 et 23, 20 bouquets chacune, soit **0 F, 0 U, 0 kink**. J'ai aussi vérifié seed 12 (8 bouquets) : 0 partout. Corrections faites en cours de route :
  - une corne de nigelle « flottait » : les cornes sont maintenant un seul trait ;
  - du lichen apparaissait sous la lèvre : le pied de la branche est maintenant dégagé.
- **Modèles 15, 25 et 39**, seeds 7 et 23 : **0 F, 0 U, 0 kink**.
- **Perf** : 76 modèles, 9 724 éléments et 181 ms par bouquet. Le même build sans le lot donne 9 731 éléments et 174 ms. Le temps de cette machine cloud est bruité : deux mesures identiques ont varié de 174 à 180 ms.
- **Coût par élément** (perf2) : branche de baptisia ≈ 273 éléments, branche lichénée ≈ 269, nigelle en ligne ≈ 85, pavot en ligne ≈ 52, drapé ≈ 26.
- **Planches** (`sheets/`) : `*_vues.png`, `*_coloris.png`, `*_tailles.png`, des zooms des coloris pour le pavot et la nigelle, `cartes_composer.png`, `bouquets.png`.

## Doutes
- **Baptisia et lichen** : environ 270 éléments par branche. C'est dans la moyenne des lignes (forsythia ≈ 4 200, statice ≈ 1 170), mais on peut alléger si besoin.
- **Taille de la baptisia** : `o.cm` = longueur de la partie fructifère. La recette garde 30 cm, la tige entière en dessine environ 1,75 fois plus.
- **Drapé trop long** : la longueur vient du Composer (c4.js). Sur un socle bas, le drapé peut descendre plus bas que le dessus du socle (modèle 25). Ce lot ne le corrige pas.
- **Cartes** : comme pour toutes les espèces, la carte du Composer dessine des tiges vertes (bunchArt dans u1.js), même pour les coloris séchés.
