# La frise en sprites PixiJS

Branche `ch/sprites`, copie de travail `ch/sprites/`. Commencé le 27 octobre 2026.

## Pourquoi

Les mesures du 27 octobre (`decor/scene/perf.mjs`, tableau publié pour le porteur) montrent une frise à 11 bouquets bloquée :

- **Ordinateur :** 15 images par seconde au repos, 24 en glissant, premier bouquet visible à 2,4 s.
- **Téléphone milieu de gamme :** 1 image par seconde au repos, 3 en glissant, premier bouquet à 8,1 s.

Les causes viennent de la façon d'afficher, pas d'un élément en particulier :

- 466 calques à recomposer à chaque image ;
- 362 morceaux de bouquets et 108 tuiles lus comme documents SVG sur le fil principal ;
- 1 908 filtres SVG à tramer ;
- 9 toiles WebGL d'insectes empilées.

Sur téléphone, éteindre un seul poste n'aide pas.

## Décisions du porteur (27 octobre 2026)

- **Sources et site.** Les vases, les bouquets, les piliers et le décor restent dessinés en SVG : c'est la source. Le site ne
  montre que leurs **sprites haute définition, dans une seule toile PixiJS**, comme les insectes.
- **Deux niveaux de définition.** Des sprites nets sur la frise. Des sprites plus fins chargés seulement pour le bouquet du gros
  plan, nets jusqu'au zoom 2,6.
- **La brise.** Les bouquets ne se balancent **qu'en gros plan**. Sur la frise, ils sont immobiles.
- **Le décor.** Chaque tuile de chaque plan devient un sprite dans la même toile, avec la même parallaxe qu'aujourd'hui. Les
  piliers sont aussi des sprites.
- **Les herbes hautes.** Les tiges à épillets gardent leur longueur, mais ne se couchent plus : 45° de la verticale au plus.
- **Les insectes.** Certains sont trop flous (la sauterelle, par exemple) : leurs atlas sont à refaire plus fins.
- **Les vases.** Ils doivent être en SVG pur. Seul le vase en bronze à la carpe contient encore une image (son corps coulé).

## Lots

1. **S1, cuisson des bouquets** (`decor/sprites.mjs`). Pour chaque bouquet, à partir de son ouvert.json :
   - niveau frise : une seule image du bouquet entier, vase compris ;
   - niveau gros plan : un atlas de ses morceaux, avec articulation et brise ;
   - en WebP, avec un index JSON.
2. **S2, une seule toile.** La frise passe dans une application Pixi : bandes de tuiles avec parallaxe, piliers, bouquets,
   touffes de premier plan. Les insectes et les porteuses entrent dans la même toile.
3. **S3, le gros plan.** Le zoom se fait dans Pixi. On charge l'atlas fin du bouquet choisi, et ses morceaux se balancent.
4. **S4, le décor en haute définition.** On vérifie la finesse des aperçus actuels (1,2 pixel par unité) à 2 pixels par point,
   et on recuit si besoin.
5. **S5, les herbes.** Dans `herbe.mjs`, on limite l'inclinaison des tiges à épillets à 45°, puis on recuit les touffes et les
   tuiles concernées.
6. **S6, les insectes flous.** Atlas refaits plus fins.
7. **S7, la mesure.** On relance `perf.mjs`. Les objectifs sont 60 images par seconde sur ordinateur, 30 au moins sur téléphone,
   et le premier bouquet en moins d'une seconde sur ordinateur.

## État (27 octobre 2026)

- **S1 à S3 faits** (commit cdfb31c) :
  - `sprites.mjs` cuit les 11 bouquets : de 30 à 72 Ko pour la frise, de 177 à 602 Ko pour le gros plan ;
  - `toile.mjs` porte la toile unique ;
  - `frise.js`, `boutique.js` et `insectes.mjs` y sont branchés ;
  - l'essaim range ses insectes dans les plans de la toile.
- **Mesures en local** (`perf.mjs`, même protocole que le tableau du porteur) :

  | | Avant | Après |
  |---|---|---|
  | Ordinateur au repos | 15 i/s | 139 i/s |
  | Ordinateur en glissant | 24 i/s | 142 i/s |
  | Téléphone ralenti 4 fois, au repos | 1 i/s | 117 i/s |
  | Téléphone ralenti 4 fois, en glissant | 3 i/s | 124 i/s |
  | Premier bouquet, ordinateur | 2,4 s | 1,1 s |
  | Premier bouquet, téléphone | 8,1 s | 2,8 s |
  | Calques | 466 | 20 |

- **S5** : la tige à épillets est plafonnée à 45° dans `herbe.mjs` (`CULM_MAX`), puis le sol et les touffes sont recuits.
- **S6** : l'insecte prend son grand niveau de détail dès que le petit serait agrandi, en pixels réels (le seuil comptait en
  pixels CSS, ×1,25). Le grand niveau se charge à la première demande.
- **Corrigé au passage** : la cétoine des porteuses plantait à son premier vol (phase de battement non définie).

## Reste

- Les porteuses du bandeau gardent leurs deux canvases, au-dessus du bandeau HTML. On peut les réunir en une seule.
- Le ciel reste une image SVG dans la page (48 Mo décodés sur téléphone) : un dégradé CSS ou un sprite suffirait.
- `ouvert.json`, `p*.svg` et `vignette.svg` restent publiés comme sources, mais la page ne les lit plus.

## Questions ouvertes

- Le vase en bronze à la carpe : refaire son corps coulé en SVG pur ? Il est hors du chantier sprites, et le porteur en décide.
