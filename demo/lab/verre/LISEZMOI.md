# Atelier du vase en verre aux danseuses

Outils qui produisent le corps SVG du vase `verre-danseuses` (`demo/src/v1i.js`) et sa fiche dans `demo/src/v0.js`. Ils tournent dans l'atelier de dessin (`C:/Users/agent/Desktop/flower-atelier/verre/`). Leurs entrées privées restent dans `out/`, hors du dépôt :
- la photographie de référence ;
- les quatre guides calés sur elle : figures isolées, squelettes, normal map, depth map.

- `mk2.py` : le générateur. Il lit les guides et calcule la lumière de la boutique : verre dépoli, translucidité, reflets du studio, réfraction des contours, paroi du dos vue à travers. Il écrit chaque forme en courbes et en bandes de ton. `photo` donne le cadrage de la photo, `shop` la projection de la boutique (vase 1,5 fois sa taille de catalogue face aux fleurs).
- `build_body.py` : fixe les réglages retenus et écrit `v1i.js` (corps, intérieur du col, cavité où l'on voit les tiges). Avec `--v0`, il écrit aussi la fiche.
- `mk.py` et `trace*.py`, `tubes.py`, `bezfit.py`, `seeds.py`, `seg2.py`, `sil.py` : géométrie mesurée (silhouette, appareil photo, col et pied) et premières méthodes (tracé à la main, segmentation guidée), gardées pour la mémoire du procédé.
- `prev.sh` : aperçu des couleurs sans navigateur.
- `eng.sh` : rendu dans le moteur.
- `shot.sh` : rendu d'un SVG.
- `../vbq.js` : un bouquet modèle dans un vase choisi, par exemple `qa13.html?vbq=26&vase=verre-danseuses`.
