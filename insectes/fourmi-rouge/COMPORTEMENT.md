# Fourmi rouge : comportement (runtime/fourmi-rouge.mjs, MYRMICA)

L'ouvrière de *Myrmica rubra* marche au sol, au pied du bouquet. Elle n'est jamais dirigée par le joueur. Un clic l'alarme.

## Chiffres sourcés

| grandeur | valeur retenue | source |
|---|---|---|
| vitesse en exploration | 8,5 à 9,6 mm/s | Cammaerts et al. 2012, tableau 1 (ouvrières de *M. rubra*, papier vierge : moyennes 9,6 et 8,5 mm/s selon la méthode, valeurs de 6 à 12,5) |
| sinuosité en exploration | 154 à 162°/cm | même tableau (vitesse angulaire, papier vierge) |
| vitesse en alarme | 18 à 25 mm/s | tableau 1 (tête de congénère, 18,3 à 18,9 mm/s) et tableau 4 (tête de *M. rubra*, 24,6 mm/s) |
| sinuosité en alarme | 77 à 115°/cm | tableaux 1 (115) et 4 (77) : la fourmi alarmée va plus droit |
| allure | tripode alterné (L1 R2 L3 contre R1 L2 R3) | Clifton et al. 2020, §2.3 ; Zollikofer 1994 (le tripode domine sur une large gamme de vitesses) |
| longueur de pas | 0,67 longueur de corps, soit 3,3 mm | Clifton et al. 2020 : 1,8 à 2,6 mm (moyenne 2 mm) pour une ouvrière de 3 mm, rapporté à 4,9 mm |
| cadence | v / pas : 2,7 Hz à 9 mm/s, 6 à 7 Hz en alarme | Clifton et al. 2020 : la vitesse se règle par la cadence plus que par le pas (R² 0,91 contre 0,50) |
| balayage du pied | ± 0,8 mm (1,6 mm sur l'appui) | facteur d'appui 0,5 × pas ; le facteur d'appui n'est pas mesuré dans Clifton et al. (§4.8) |

Sources :
- M.-C. Cammaerts, F. Morel, F. Martino, N. Warzée (2012). *An easy, cheap computerized method to assess two-dimensional trajectory
  parameters.* Belgian Journal of Zoology 142 (2) : 147-153.
- G. T. Clifton, D. Holway, N. Gravish (2020). *Uneven substrates constrain walking speed in ants through modulation of stride
  frequency more than stride length.* Royal Society Open Science 7 : 192068. doi:10.1098/rsos.192068 (fourmi d'Argentine, 3 mm).
- C. P. E. Zollikofer (1994). *Stepping patterns in ants I.* Journal of Experimental Biology 192 : 95-106.

## Chiffres de travail (à mesurer sur vidéo, comme ceux du machaon)
- **Arrêts.** Un arrêt toutes les 3 à 9 s, de 0,4 à 2,5 s. Pendant l'arrêt, la fourmi tâte le sol de ses antennes (pose « palpe »,
  4 dessins, 2,2 battements par seconde, en alternance gauche et droite).
- **Rencontres.** Deux fourmis, rouges ou noires, à moins de 1,4 longueur de corps et l'une devant l'autre : elles s'arrêtent face à
  face et s'antennent 0,8 à 2 s. Puis chacune repart, tournée de 70 à 125°, et ne rencontre plus personne pendant 2,5 s.
- **Alarme au clic.** Demi-tour de 110 à 250°, course de 3 à 5 s aux vitesses d'alarme, puis retour à l'exploration.
- **Bords.** La bande de sol a ses bords. À moins de 6 longueurs de corps d'un bord, la fourmi tourne vers l'intérieur, à 3 rad/s au plus.
  La bande est peu profonde (z de 95 à 160 dans la démo) : en profondeur, la marge vaut au plus un quart de la bande. Sinon, les deux
  bords la tourneraient en même temps.
- **Sol de la démo.** Le bord lointain de la bande est vu juste sous le pied du vase (0,92 H). La perspective étale la bande vers le
  bas à partir de là.

## Atlas et runtime
- **Poses de l'atlas.** `pose` (1 dessin), `marche` (8 dessins du tripode), `palpe` (4 dessins). Le dessin de marche suit la phase,
  qui avance de v / 3,3 mm par seconde. Le miroir d'une vue décale la marche d'un demi-cycle (`vue.pickCell`).
- **Nombre.** Sept à huit fourmis à l'écran, rouges et noires ensemble (DECISIONS). La démo en accepte 8 au plus (`?fourmi-rouge=8`).
- **Widget.** Le ramassage des pétales fanés au clic (DECISIONS, widget Belai Bureau) n'est pas fait ici. Il se construira sur ces
  états : marche vers un pétale, arrêt et palpe, puis retour.
