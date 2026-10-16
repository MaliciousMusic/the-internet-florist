# Atelier privé des 116 références

## Correction humaine : dessins légers et stylisés

La vectorisation dense a été refusée. La précision attendue porte sur le dessin, les courbes, le soin des matières et des motifs ; elle ne demande pas une transcription photographique au pixel près. Les anciens fichiers de `svg/`, leurs contrôles et les outils de transcription sont des essais abandonnés, pas des assets à réutiliser ou à livrer. Ne pas relancer `transcrire.py` ni `contours_fins.py` pour les 116.

La méthode corrigée est dans `stylisees/` : dessin explicite de silhouettes en Bézier, couches séparées pour la matière et les ornements, motifs réutilisables et nuances douces. L'étude 009 démontre cette méthode ; un tube fleuri et une boule à l'aigrette en explorent les variations. Les trois SVG font environ 10 ko chacun. La série des 116 reste en pause à la demande du porteur ; la présente correction n'en relance pas la production.

Le porteur a consulté les trois dessins et répondu « ouais absolument nickel ». La méthode corrigée est donc validée comme base graphique. Les empreintes correspondantes sont conservées dans `stylisees/VALIDATION-METHODE.json`. Ce retour ne termine pas la série des 116 et ne réactive pas les essais de transcription photographique.

## Historique de l'approche abandonnée

La demande humaine remplace la généralisation aux 400 : préparer 116 copies fidèles pour servir de matière première aux fusions. Les 400 ébauches restent intactes. Les petits pieds cylindriques sont exclus ; leur suppression sur 079 est une exception explicite à la copie.

Les études utilisent une transcription vectorielle des références privées : séparation de la silhouette, contours colorés ajustés en courbes de Bézier et nuances conservées dans de nombreuses couches natives. Ce procédé s'appuie sur les photographies pour préserver les proportions et détails ; il ne constitue pas une sculpture 3D ni un dessin entièrement tracé à la main. Aucun pixel, bitmap ou lien vers une photographie n'est incorporé dans les fichiers SVG.

Les photographies ne sont ni modifiées, ni publiées, ni ajoutées à Git. Les images intermédiaires et aperçus sont séparés des SVG. Une comparaison privée permettra de distinguer la photographie source et son interprétation vectorielle. Les silhouettes, les éventuels ajours et les transitions de matière doivent être inspectés avant livraison.

Un seul traitement à la fois, un seul worker et garde de mémoire libre supérieure à 4 Go. Les fichiers ne sont pas destinés au moteur du jeu à ce stade : l'extraction de motifs réutilisables et les fusions constituent une étape ultérieure.
