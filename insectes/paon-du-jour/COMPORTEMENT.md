# Paon-du-jour : comportement (runtime/papillon.mjs, PAON)

Chiffres sourcés quand une mesure existe. Les autres sont des chiffres de travail, notés comme tels, à affiner sur vidéo.

## Ouverture brusque des ailes (réaction au clic)
Dérangé alors qu'il est posé, le paon-du-jour ouvre brusquement les ailes et montre ses quatre ocelles. Il les referme et les
rouvre ensuite par battements, tout en produisant un sifflement et des clics ultrasonores.
- **Ouverture.** Elle dure 0,2 s (médiane, écart interquartile 0,15 à 0,23 s) d'après Olofsson et al. 2013,
  *Behavioral Ecology* 24 : 305-310 (« Eyespot display in the peacock butterfly triggers antipredator behaviors in naïve adult
  fowl »). Au runtime : `startle.open` 0,2 s.
- **Battements.** Il y en a 11 par 30 s (médiane, écart interquartile 8,5 à 12), soit un toutes les 2,7 s environ (même
  source). Au runtime : `startle.every` 2,7 s, de 2 à 4 battements par dérangement.
- **Ailes ouvertes entre deux battements.** Olofsson et al. 2012 (*PLoS ONE* 7 : e47092) décrivent les deux modes du paon : des
  ouvertures et fermetures répétées, ou des ailes ouvertes d'un coup puis gardées ouvertes en « pulsant ». Au runtime, les ailes
  restent ouvertes à 4° avec une légère pulsation (balayage de 5°, 1,6 Hz). **Chiffre de travail.**
- **Déclencheur.** Le prédateur à proximité immédiate (Vallin et al. 2005, *Proc. R. Soc. B* 272 : 1203-1207, mésanges
  bleues). Sur le site, c'est le clic sur un papillon posé. Ensuite, un tiers des papillons s'envolent (`startle.flee` 0,35) et
  les autres se reposent ailes fermées. **Chiffre de travail.**
- **Son.** Les clics sont produits par l'ouverture des ailes (Møhl et Miller 1976, *J. Exp. Biol.* 64 : 639). Il n'y a pas de
  son sur le site (question ouverte dans l'ETAT).

## Attitudes posé
- **Repos et butinage, ailes fermées.** Au butinage, le paon garde ses ailes le plus souvent fermées et ne les ouvre que pour
  écarter un autre insecte (Wiklund 2005, *Entomologica Fennica* 16 : 17-22, paons sur prunes). Au runtime, le butinage bat
  donc lentement (0,45 Hz) entre 40 et 86°, au lieu des 18 à 62° du machaon.
- **Repos fermé.** Les ailes sont fermées au-dessus du dos (88°), les antérieures tirées en arrière de 40° entre les
  postérieures. Mesuré à l'œil sur les vivants c374, c140 et c223 : la côte de l'aile avant est à environ 45° de la verticale.
- **Au soleil.** Ailes ouvertes à plat (2°), antérieures un peu en avant (6°), comme sur c016 et c167.

## Vol
- **Battements.** 8 par seconde, avec une descente rapide (45 % du cycle). **Chiffre de travail.** Aucune mesure publiée n'a
  été trouvée pour *Aglais io*. Brodsky 1991 (*J. Exp. Biol.* 161 : 77-95) a filmé l'espèce en soufflerie, mais le texte n'était
  pas lisible (accès refusé). Pour comparer, Dudley 1990 donne 11 Hz en moyenne sur 37 papillons néotropicaux. Le paon,
  plus petit que le machaon (envergure 55 contre 78 mm), bat plus vite que lui (5,5 par seconde).
- **Planés.** Planés de 0,2 à 0,5 s entre des séries de 0,6 à 1,6 s. **Chiffre de travail.**
- **Fleurs.** Une visite dure de 5 à 20 s. **Chiffre de travail.**

## Nombre
Deux paons au plus à l'écran (DECISIONS), et trois papillons en tout avec les machaons (`demo.mjs` : `?paon=2`).
