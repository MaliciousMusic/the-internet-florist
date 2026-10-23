# Moro-sphinx : comportement (runtime/moro-sphinx.mjs, SPHINX)

Chaque chiffre porte sa source. Ceux qui n'en ont pas encore de solide sont marqués « à mesurer » : ils sont à reprendre sur
vidéo.

## Chiffres

| chiffre | valeur | source |
|---|---|---|
| battement en vol stationnaire | 77,2 ; 78,4 ; 86,4 Hz (3 individus filmés à 600 i/s) | Kihlström, Aiello, Warrant, Sponberg, Stöckl 2020, *Wing damage affects flight kinematics but not flower tracking performance in hummingbird hawkmoths*, bioRxiv 10.1101/2020.08.16.252759 |
| plan de battement | 30,2° de l'horizontale (écart interquartile 3,8°) | même article (mesures non publiées citées) |
| tangage du corps en vol stationnaire | 32° tête haute | mesuré sur c153 (axe queue-tête) ; c154 donne le même ordre |
| trompe | 25 à 28 mm | Faucheux 2013, *Annales de la Société entomologique de France* (cité par Wikipédia) |
| envergure | 39,6 mm sur le spécimen étalé MHNT c186 (barre de 1 cm) ; 40 à 45 mm (Wikipédia, sans source) ; 43 à 58 mm (Doremi) ; 50 à 58 mm (Wildlife Trusts) | mesuré, puis les fiches |
| longueur du corps | 21,9 mm, touffe comprise | mesuré sur c186 (85,2 px/mm) |
| durée d'une visite | 3 à 10 s en vol stationnaire devant une inflorescence | G. Doremi, fiche *Macroglossum stellatarum* (sans source primaire) : à mesurer |
| nombre de fleurs avant de partir | 3 à 9 | à mesurer (choix de travail) |
| vitesse de transit | 620 px/s à la taille du site, sauts de 420 px/s entre fleurs voisines | à mesurer (ordre de grandeur : le plus rapide des visiteurs du bouquet) |
| à l'écran | 1 au plus | DECISIONS |

## États

- **Arrivée.** Il entre par un bord ou depuis le pré du fond, d'un vol rapide et droit (atlas « vol », trompe enroulée), puis
  s'arrête net devant la fleur choisie, en commençant par les plus proches.
- **Vol stationnaire.** Il se place de côté, un peu devant la fleur, le corps relevé de 32°. La position est calculée pour que la
  pointe de la trompe (25 mm, pose d'atlas « butine ») tombe dans le cœur de la fleur. Il garde sa place avec de petites
  corrections de quelques dixièmes de millimètre, entre 1 et 2 Hz, comme les sphinx qui suivent une fleur qui bouge
  (Kihlström et al. 2020). Il sonde la fleur plusieurs fois : il recule d'un dixième de la trompe, puis replonge.
- **Battement.** C'est le faux de DECISIONS : 3 dessins cuits dans l'atlas, rejoués 0 1 2 1 à chaque image. Chaque dessin
  superpose deux jeux d'ailes le long de l'arc, dans un plan de battement à 62° de l'axe du corps (30° de l'horizontale plus 32° de
  tangage). On montre le haut du battement (retournement de l'aile au-dessus du dos), la descente, puis le bas (l'aile en avant
  et sous le corps). Il n'y a pas de flou.
- **Fleur suivante.** Il fait un saut de côté vers une fleur voisine. Après 3 à 9 fleurs, il repart aussi vite qu'il est venu.
- **Repos (rare, 8 %).** Il se pose sur la fleur qu'il vient de visiter, ailes repliées en toit bas. Les antérieures sont tirées
  en arrière de 65° au-dessus des postérieures (c037, c038, c005). À partir de là, les ailes sont des quads au runtime
  (`b.wingsOff = false`). Il reste 4 à 10 s, puis repart.
- **Clic.** Il file aussitôt hors de l'écran, à 1,8 fois sa vitesse.
