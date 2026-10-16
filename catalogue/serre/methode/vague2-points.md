# Vague 2 : points de vigilance et trous de méthode

Vague 2 du pilote « Printemps à la carpe » (8 octobre 2026), en trois chantiers : branches (cerisier, cognassier, forsythia), iris-pois
(iris hollandais, pois de senteur), clochettes (fritillaire, viorne, alchémille). Ce fichier complète `docs/STANDARD-RENDU.md` (4 ter) et
`docs/STANDARD-SOURCES.md` sans les modifier ; ce qui s'y trouve est à reporter dans les standards par le porteur.

## Sourcing et marques

- **TMview n'est pas un outil d'automatisation.**
  - La recherche par adresse (`#/tmview/results?...&basicSearch=<nom>`) marche pour quelques noms.
  - Mais l'application ne recharge pas toujours ses résultats quand seule l'adresse change : il faut vérifier que les lignes lues portent bien le nom cherché.
  - Après une dizaine de recherches, le site renvoie « Problem detected » (blocage anti-robot, 8 octobre 2026).
  - On ne le contourne pas : les marques se vérifient à la main, peu à la fois, et seulement pour les noms qui seraient affichés dans le jeu.
- **Les noms de vente n'ont pas besoin d'être vérifiés quand le jeu affiche le nom enregistré.** C'est le cas des cerisiers : Pink Champagne pour 'Ichiyo', Spring Snow pour 'Beni-tamanishiki', etc. Seuls les noms affichés passent au registre des marques.
- **« Royal Burgundy » (cerisier) est une marque enregistrée en classe 31** : USPTO 87886385 et CIPO 1033243-00, au nom de Leo E. Gentry. Le brevet de plante expiré (USPP 6520) n'y change rien. C'est un exemple de cultivar dont le nom est aussi une marque : il est exclu du jeu sous ce nom.
- **Le KAVB se relance par différence.** Un recensement fait grossir sa liste de noms par étapes (46 noms, puis 256 pour l'iris). L'orchestrateur n'interroge que les nouveaux noms, puis les fusionne dans `kavb.json`.
- **Le budget WebSearch s'épuise sur les gros genres.**
  - L'iris hollandais compte 254 cultivars en 13 lots. Après 3 lots, la recherche web du chef et de ses agents était épuisée (environ 200 requêtes partagées).
  - Les lots suivants sortent avec une seule photo (niveau C) ; on passe alors en lecture directe des pages connues (wiki de l'AIS, exportateurs, KAVB).
  - **Trou de méthode** : il faudrait d'abord les pages-catalogues des exportateurs et des sociétés savantes, une page par dizaines de cultivars, et WebSearch seulement pour les manques. Les SKU du bouquet passent avant le reste de l'inventaire.
- **Le budget WebSearch est par agent, pas par session.**
  - Les agents de deux chantiers sur trois étaient bloqués au bout d'environ 200 appels, alors que la recherche de l'orchestrateur marchait encore.
  - Parade : les API ouvertes, sans compte ni clé, avec 1 requête par seconde. iNaturalist v1 renvoie des observations avec photo, auteur et licence, filtrables par phénologie (`term_id=12&term_value_id=13`, en fleur). GBIF renvoie les occurrences avec médias.
  - Ensuite, WebFetch sur les pages connues : wiki de la Pacific Bulb Society, fiches RHS, exportateurs.
  - Vérifié le 8 octobre 2026 : 1 053 observations « recherche » en fleur pour *Fritillaria meleagris*, et 14 611 occurrences avec images sur GBIF.
  - À écrire dans `fleur-refs.md` et `fleur-preuves.md` : commencer par les API, garder WebSearch pour les cultivars introuvables autrement.
- **Des vendeurs publient des images générées.**
  - Chez Harding and Bloom (hardingandbloom.co.uk), les noms des fichiers d'images contiennent « generated-high-fidelity » : ce sont des images générées, exclues par STANDARD-SOURCES (section 2).
  - À ajouter au filtre des agents : lire le nom de fichier et les métadonnées. Tout vendeur dont les images sont générées est exclu en entier, même en appoint.
- **Écart de lumière entre deux photos nommées.**
  - Pour les iris du bouquet, l'écart était de ΔE 16 à 29 entre Jan de Wit et Thursd. Le niveau tombe alors à C jusqu'à une troisième photo en lumière neutre (STANDARD-SOURCES 3.3).
  - Les meilleures troisièmes photos viennent des pages produit des bulbiculteurs, qui ont une image pleine taille : chez John Scheepers, retirer le segment `cache/<hash>/` de l'URL donne l'original (environ 500 Ko).
- **Concordance des couleurs entre studios** (question au porteur, appliquée en attendant sa réponse).
  - Les SKU du bouquet de l'iris restaient en C : leurs photos, prises dans des studios aux lumières différentes, s'écartaient de ΔE 16 à 29.
  - Lecture appliquée : le ΔE au-delà de 10 déclenche une 3e photo, et on retient la médiane (STANDARD-SOURCES 3.3). La concordance qui fixe le niveau se juge sur la teinte, à 10° près en LCh, et sur une saturation du même ordre. La clarté reste libre et l'écart d'éclairage est noté. Si la teinte diverge, le niveau reste C.
  - **Validé par le porteur le 2026-10-09** : « le but c'est la bonne couleur overall ». La règle est à écrire dans STANDARD-SOURCES §3.
- **SOURCES.md § 15 (Lathyrus) est à corriger** (trouvé par le chantier iris-pois, détail dans `refcache/lathyrus/autorite.md` de la copie) :
  - l'ICRA de la liste de l'ISHS, fiche n°39, est l'Internationale Stauden-Union, sans preuve qu'elle enregistre *L. odoratus* ;
  - le registre de fait est la Checklist of Epithets de la National Sweet Pea Society (sweetpeas.org.uk/epithets/) : un xlsx de 7 416 lignes avec une colonne de couleur, la bonne source pour census.py ;
  - recensement du pois : 953 cultivars, 65 coloris distincts.
- **Un nom « introuvable » doit d'abord passer par la RHS et les pépinières.**
  - Le recensement du cognassier déclarait « Salmon Horizon », SKU du bouquet, introuvable après Weber 1963, Plantago, MoBot, Cornell, Commons et GBIF. Il proposait de le renommer.
  - Une seule recherche le trouve : fiche RHS 154370, Denolf, Bluebell Nursery, catalogue polonais des pépinières.
  - **Trou de méthode** : avant de dire « introuvable », chercher « <Genre> '<nom>' » dans la liste des plantes de la RHS (rhs.org.uk/plants/<id>) et chez deux pépinières spécialisées. Les monographies anciennes ne connaissent pas les cultivars récents.

## Facture

- **Fritillaire : 26,40 M d'équivalent entrée Opus en 3 h 47, mais la facture est gonflée.**
  - `bill.py report` attribue au sid tous les appels « orchestrateur » de la fenêtre, environ 11 M. Il compte aussi les appels de l'orchestrateur de la vague 2 et ceux des autres chantiers qui tournent en même temps.
  - Les agents du chantier font environ 15 M, dont 9,9 M pour les modeleurs Opus, en 4 contextes.
  - C'est encore 5 fois la cible de 2 à 3 M.
  - **Trou de méthode** : avec plusieurs chantiers en parallèle, la facture doit compter les journaux des agents du chantier seulement (`match` par description), sans la fenêtre de temps de la session principale.

## Couleurs (suite)

- **Une couleur d'espèce type ou de forme sauvage** (damier de la fritillaire, Alba) se mesure sur au moins 5 photos indépendantes : observations iNaturalist de qualité « recherche » et une photo N2.
  - On corrige la balance des blancs, puis on prend la médiane LCh. Si au moins 4 photos sur 5 sont à 10° de teinte au plus de la médiane, N2 comprise, le coloris est B.
- **Les blancs et les crèmes** se comparent sur la saturation et la clarté relative, pas sur la teinte : la teinte d'un blanc n'a pas de sens. Deux blancs que la médiane ne sépare pas sont fusionnés, et l'autre coloris est marqué ret:1.

## Dessin : retours du porteur

- **Iris v1, refusé (2026-10-09) : « pourquoi la fleur flotte dans le vide et pourquoi est-elle aussi petite au bout de sa tige ? »**
  - *Jonction* : entre la spathe et la fleur, il y avait un vide. Il manquait le tube du périanthe et l'ovaire, et les onglets partaient dans l'air. Le contrôle « tête flottante » de la QA ne le voit pas : il cherche des têtes loin de la tige dans les bouquets, pas un jour de quelques pixels sur la planche. Il faut contrôler la jonction à la loupe à chaque stade et sous chaque vue.
  - *Proportions* : l'envergure de la fleur faisait 1/15 de la hauteur de la tige, au lieu d'environ 0,13 à 0,18 (fleur de 8 à 10 cm, tige de 50 à 65 cm). Le rapport tête sur tige se mesure sur 2 ou 3 photos de tiges entières (`img.py pair`), comme la silhouette de la tête.
  - *Feuilles* : elles alternaient tout le long de la tige comme celles d'une graminée. La disposition des feuilles vient des photos de la sorte, jamais d'un motif générique.
  - L'orchestrateur avait vu la planche et ne l'avait pas relevé : une planche « finie » se regarde aussi à l'échelle de la plante entière, pas seulement tête par tête.
- **Pois de senteur v1, retenu par l'orchestrateur (2026-10-09).**
  - La planche de la fleur seule était lisible. Dans un bouquet, à la taille de la boutique, les fleurs se lisaient comme des pétales roses plats et détachés, et les folioles étaient aussi grandes qu'une fleur d'iris.
  - Le contrôle visuel d'un bouquet à 2 400 px n'avait pas été conclu par le chantier : un agent Haiku n'y arrive pas.
  - **Règle** : avant de publier une sorte, rendre un bouquet qui la contient (`svtest.js ?bq=1&rc=<sku>:<n>,...`) et le regarder. C'est à l'orchestrateur de le faire.
- **Doublons de noms entre kits.** `SVBL_DEF` était déclaré à la fois dans `y3-branche.js` (publié) et dans `y3-iris.js`, ajouté après le contrôle des noms. L'application assemblée ne passait plus le contrôle de syntaxe.
  - **Règle** : une fusion d'essai dans une copie jetable du HEAD, puis `mkapp.sh` (« app syntax ok »), avant de fusionner dans l'atelier principal.
  - Les constantes d'un kit portent le préfixe de leur famille (`SVIL_` pour l'iris, `SVBL_` pour les branches).
- **Une reprise ciblée coûte peu.** Le pois de senteur v2 a coûté 9,74 M en 1 h 26, dont 6,67 M pour 4 modeleurs Opus, contre 40,65 M pour la v1.
  - Elle a réutilisé le sourcing, et porté trois critiques précises : structure lisible, proportions mesurées, forme vendue de la tige.
  - Le contrôle de bouquet était obligatoire, et c'est le modeleur Opus qui l'a regardé.
  - **Leçon** : le contrôle du bouquet et les mesures de proportion, dès le premier modelage, auraient évité la v1.
