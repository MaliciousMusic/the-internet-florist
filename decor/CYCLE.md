# Le cycle accéléré : rosée du matin et fanaison complète

Branche `ch/cycle`, copie de travail `ch/cycle/`. Ouvert le 29 octobre 2026.

## Demande du porteur

Dans l'essai « Try on your desktop », proposer de lancer le cycle accéléré du bouquet : la rosée du matin, puis la fanaison
complète. Dessiner pour cela les stades qui manquent.

## Décisions du porteur (QCM du 29 octobre 2026)

- **La rosée** : de petites gouttes rondes, chacune avec son reflet, posées sur les pétales et les feuilles tournés vers le
  haut, plus nombreuses sur les feuilles. Elles sèchent pendant la première matinée du cycle.
- **Le cycle** : 30 jours en 30 secondes, en continu, sans à-coup. La rosée le premier matin, la pleine floraison, le
  déclin, la fanaison. Le bouquet reste fané un instant, puis revient tel qu'il était.
- **Les bouquets** : les 11 de la vitrine.
- **Où** : dans l'essai seulement. L'abeille le propose à la fin : « Voir ses 30 jours en 30 secondes ».

## Ce qui existe

- **La fanaison** : le moteur suit pour chaque fleur refaite une vie continue, de 0 (fraîche) à 1 (sèche) : `LIFE` et
  `lifeWEl` pour un bouquet, `SVA_LIFE` pour forcer une valeur (planches). Chaque espèce refaite a son déclin et son fané
  d'après des photos et sa fiche de fanaison (`catalogue/fanaison/`) : l'anémone par exemple (`svaWiltCol`, tépales qui
  tombent, cœur qui reste).
- **La rosée** : rien. Ni dans le moteur, ni dans le décor.
- **Les sprites du site** : l'état ouvert seulement (`predessin.mjs`, `sprites.mjs`).

## Les bouquets

| Bouquet | Espèces | État |
|---|---|---|
| Printemps à la carpe | 22 | prêt |
| Citrine | 9 | prêt |
| Ronde bleue | 12 | prêt |
| Neige de mars | 9 | prêt |
| Aube au jardin | 8 | attend hortensia boule, scabieuse |
| Nuit d'ambre | 9 | attend amarante retombante, cymbidium, œillet, scabieuse |
| Ciel de faïence | 9 | attend delphinium, scabieuse |
| Souffle du dragon | 9 | attend gloriosa |
| Vol de nuit | 9 | attend delphinium, phalaenopsis, scabieuse |
| Étang d'abricot | 9 | attend cymbidium, œillet |
| Bronze poudré | 9 | attend nérine, œillet, phalaenopsis, scabieuse |

Les espèces en attente ne sont pas encore refaites au niveau de l'anémone. Sept ont leur chantier ouvert (`ch/scabieuse`,
`ch/oeillet`, `ch/delphinium`, `ch/hortensia`, `ch/amarante`, `ch/gloriosa`, `ch/nerine`) ; phalaenopsis et cymbidium
n'en ont pas encore.

## Lots

1. **C1, la rosée** (dessin, méthode des fleurs : références d'abord).
   - Références : photos de rosée sur pétales et feuilles (tailles des gouttes rapportées au pétale, reflet, ombre portée,
     lentille sur la nervure), hors du dépôt, mesurées.
   - Un module du moteur : des gouttes posées sur les faces tournées vers le haut des pétales et des feuilles (le kit
     commun), plus denses sur les feuilles, avec une quantité de 0 à 1 qui sèche pendant la première matinée.
   - Planche sur les 4 bouquets prêts, validée par le porteur avant la suite.
2. **C2, la cuisson du cycle.**
   - `predessin.mjs` dessine un bouquet à un âge donné (la vie du bouquet, la rosée) ; assez d'images pour un mouvement
     continu (de l'ordre de 12 par seconde, soit 360 pour 30 s), à la taille de l'essai.
   - Encodage léger, chargé seulement quand le visiteur demande le cycle : une vidéo avec transparence (WebM VP9, et une
     autre pour Safari), à mesurer ; cible de l'ordre de 2 Mo par bouquet.
   - Aucun fondu entre deux images : le mouvement vient des images elles-mêmes (règle de l'éclosion).
3. **C3, dans l'essai.** À la fin, l'abeille propose « Voir ses 30 jours en 30 secondes » ; le cycle joue sur le bureau du
   visiteur, l'abeille nomme les moments (rosée, floraison, déclin, fané), puis le bouquet revient.
4. **C4, les 7 bouquets en attente**, au fil des chantiers de leurs fleurs.

## État

- 29 octobre 2026 : décisions prises, plan écrit. Rien n'est dessiné.
