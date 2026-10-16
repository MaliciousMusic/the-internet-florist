# Standard de sourcing : recenser et documenter chaque espèce et chaque coloris

**Objectif du porteur (8 octobre 2026).** Couvrir chaque espèce et chaque coloris, y compris les hybrides récents et de niche, dès qu'ils sont
documentés par une photo de référence. Le sourcing est rigoureux et passe par des sites spécialisés.

Ce standard dit :
- ce qu'on recense ;
- où chercher ;
- quelle preuve suffit ;
- comment mesurer ;
- ce qu'on enregistre.

L'annuaire des sources par genre est dans `catalogue/serre/methode/SOURCES.md`. Le dessin suit `docs/STANDARD-RENDU.md`.

**L'exhaustivité prime sur la vitesse** (porteur, 8 octobre 2026). Un recensement qui ramène toutes les variétés documentées de la sorte, avec leurs noms
prouvés, n'est pas trop long. Il en va de même pour des photos sous tous les angles de la fleur, du bouton, du fané, des feuilles, de la tige et
du port. On n'écourte jamais le sourcing pour gagner du temps ; on ne gagne que sur la façon de travailler (outils, modèles, parallélisme).

Ce qu'une sorte doit réunir :
- **toutes les variétés documentées** par une photo nommée, avec leur niveau de preuve ; celles sans photo sont listées à part ;
- **pour la forme**, des photos :
  - de la fleur de face, de trois-quarts, de profil et de dos ;
  - de chaque stade, du bouton au fané ;
  - des feuilles (dessus, dessous, attache) ;
  - de la tige (épaisseur, surface, port) ;
  - de la plante entière ou de la tige coupée.
- **les limites rencontrées**, écrites : pas de registre pour le genre, base fermée (Floricode demande un compte professionnel, que nous ne créons pas), etc.

## 1. Ce qu'on recense

On suit l'arbre botanique et horticole : **genre → espèce → groupe horticole (ou division) → cultivar**.

- **Une sorte du catalogue** est une espèce botanique ou un groupe horticole qui a sa forme propre. Exemples : tulipe simple tardive, tulipe
  fleur de lys, *Tulipa kaufmanniana*. Chaque sorte a sa fiche de dessin (voir `STANDARD-RENDU.md`, section 4 ter, point 4 bis).
- **Un coloris du catalogue** est un cultivar nommé, ou une forme sauvage décrite, avec son nom enregistré. Un coloris générique comme « rouge »
  n'est qu'un nom affiché qui doit pointer vers un cultivar réel.
- **Classifications de référence :**
  - les noms d'espèces acceptés de POWO (Kew) ;
  - les groupes de l'autorité d'enregistrement : les 15 groupes du registre des tulipes (KAVB), les 13 divisions des narcisses (RHS), etc.

## 2. Où chercher : niveaux de source

| Niveau | Sources | Ce qu'elles prouvent |
|---|---|---|
| **N1 Autorité** | Registre de l'autorité internationale d'enregistrement du genre (ICRA, liste de l'ISHS : KAVB, RHS…) ; obtentions végétales (CPVO, UPOV PLUTO) ; POWO pour les espèces | Le nom exact, l'existence, l'obtenteur, l'année, le groupe, la description officielle de la couleur |
| **N2 Profession** | Floricode (base des produits de Royal FloraHolland, photo officielle des variétés vendues en fleur coupée) ; fiche variété de l'obtenteur ; fiches des exportateurs professionnels de bulbes (Jan de Wit en Zonen, décision du porteur du 2026-10-08 : peu de références, mais elles valent preuve) | Que la variété est vendue, et à quoi elle ressemble officiellement |
| **N3 Spécialistes** | Bulbiculteurs et grossistes spécialisés ; sociétés savantes du genre ; jardins botaniques ; observations iNaturalist de qualité « recherche » (espèces sauvages) | Des photos nommées, prises par des gens du métier |
| **N4 Libre** | Wikimedia Commons, Flickr sous licence CC | Des photos, à condition que le nom soit confirmé par N1 à N3 |
| **Exclu** | Places de marché (Amazon, AliExpress, Temu, Etsy, Wish…) ; images générées ; banques d'images sans nom de cultivar ; Pinterest et autres reprises sans source ; photos manifestement retouchées (bulbes « arc-en-ciel », saturation forcée) | Rien. Ces sources ne comptent jamais comme preuve, même en appoint |

**Accès autorisés par le porteur (2026-10-08).** On peut interroger le formulaire de recherche de la base des cultivars du KAVB
(`login.kavb.nl/siergewassen`), seulement en lecture : genre et nom, sans compte, sans mot de passe, sans donnée personnelle. S'il demande un compte,
on s'arrête et on le signale. Les bases sur abonnement (Floricode, UPOV PLUTO) restent fermées : ouvrir un compte relève du porteur.

**Liste des variétés de Jan de Wit en Zonen** (porteur, 2026-10-08) : `fleur/census.py` peut l'interroger par sa requête POST, en lecture seule, aux mêmes conditions que le KAVB : sans compte ni donnée personnelle, une requête toutes les 2 s, depuis l'outil seulement.

**Aucune fleur sous marque déposée en jeu** (porteur, 2026-10-08).
- Une variété vendue sous une marque (®, ™, série commerciale : Mistral, Galilee, Rainbow, Rax, Butterfly, etc.) n'est ni modelée ni vendue.
- Chaque cultivar recensé porte un champ `marque` : la série ou le nom déposé et sa preuve, ou `null`.
- Un nom de cultivar enregistré (la dénomination variétale au registre) n'est pas une marque.
- **Lecture par le registre KAVB** (porteur, 2026-10-08) : un nom inscrit au KAVB est une dénomination de variété, librement utilisable. Le ® d'un vendeur n'en fait pas une marque de la variété.
- **Étendue à toute autorité d'enregistrement** (porteur, 2026-10-08) : il en va de même pour un nom enregistré par l'ICRA de son genre (liste de l'ISHS : International Lilac Society pour *Syringa*, RHS pour les narcisses, etc.). Le ® d'un vendeur vise une marque commerciale voisine, qu'on n'utilise pas.
- **Coloris sous marque** (porteur, 2026-10-08) : le nom déposé n'apparaît jamais dans le jeu. Le coloris prend un nom de couleur générique (une couleur n'est pas une marque), ou il est retiré ; au choix, car les références libres abondent.
- **La preuve d'une marque** (porteur, 2026-10-08) : seule une marque trouvée dans un registre des marques (TMview, EUIPO, INPI, WIPO) exclut une variété. L'orchestrateur consulte ces registres en lecture seule, depuis la session principale. Un ® ou un ™ vu seulement chez un vendeur donne « à vérifier » : la variété attend, sans être dessinée ni retirée, et son nom entre dans `refcache/<sid>/marques-a-verifier.txt`.
- Un coloris du catalogue né d'une série déposée est refondé sur la variété libre la plus proche par la couleur et le motif, sans nom de série. S'il n'a pas d'équivalent libre, il est retiré.
- La forme d'une sorte n'est jamais une marque.

## 3. Preuve exigée pour chaque coloris

1. **Le nom.** Orthographe enregistrée (N1), synonymes, groupe, obtenteur, année, numéro au registre ou à l'office des obtentions.
2. **L'existence.** Au moins une source N1 ou N2. Pour une nouveauté pas encore au registre, la fiche de l'obtenteur et l'office des obtentions
   (CPVO) font foi.
3. **La couleur.**
   - Au moins deux photos nommées, indépendantes, dont au moins une de niveau N2 ou N3.
   - Mesure sur chaque photo, puis valeur retenue : la médiane.
   - Si deux mesures s'écartent de plus de ΔE 10, on cherche une troisième photo.
   - L'éclairage (studio, plein soleil, ombre) et toute correction de balance des blancs sur un neutre de l'image sont notés.
4. **La forme et le motif.** Liseré, flammes, macule, bicolore, frange, double : la description du registre plus la photo. Une variété
   double ou frangée appartient à une autre sorte que la simple.
5. **Niveau de preuve.**
   - **A** : N1 et une photo N2 concordants.
   - **B** : N2 ou N3, plus une autre source indépendante.
   - **C** : une seule photo nommée de niveau N3 ou N4.
   - **D** : estimé.

   **En production : A ou B seulement.** Un coloris C reste « à confirmer » et n'entre pas en boutique. D ne sert que de brouillon.

La photo de la variété prime sur le nom affiché du catalogue. Un nom affiché trompeur se corrige (`STANDARD-RENDU.md`, section 4 ter, point 10).

## 4. Mesurer

- **Outils :** `refs.py` (`ring` du centre vers le bord ; `pal` sur une zone) sur des photos regardées en local, jamais stockées dans un dépôt.
- **Zones :** base, corps et pointe de la face ; revers ; macule ; cœur (étamines, pistil) ; et par stade quand la photo le montre : bouton,
  ouvert, fané.
- **Photo :** sur fond neutre de préférence. Une photo de champ ou d'emballage n'est qu'un appoint, marqué « approché ».

## 5. Enregistrer

Chaque sorte a son fichier `catalogue/serre/sources/<sid>.json`, lisible par les outils. Chaque coloris y porte :
- id, nom affiché, nom enregistré, synonymes, groupe, obtenteur, année, numéros de registre ou d'obtention ;
- les sources : URL de la page, niveau, date de consultation, auteur et licence de la photo ;
- les mesures : zones, valeurs, éclairage, écart entre sources ;
- le niveau de preuve ;
- le statut : en production, à confirmer, ou écarté (avec la raison).

Les photos ne sont jamais stockées dans un dépôt ni publiées : seulement leurs adresses et les chiffres qu'on en tire.

## 6. Couvrir un genre : le recensement

1. **Taxonomie.** Espèces acceptées (POWO) et groupes horticoles (classification de l'autorité). On en tire la liste des sortes.
2. **Inventaire.**
   - Les cultivars du registre (N1), triés par sorte.
   - Croisés avec l'assortiment vendu en fleur coupée (Floricode) et les catalogues des obtenteurs.
   - Plus les nouveautés des cinq dernières années (CPVO, obtenteurs, salons professionnels).
3. **Filtre de documentation.** Ne reste que ce qui a au moins une photo nommée fiable. Le reste est listé « sans photo » et revu au recensement
   suivant.
4. **Ordre de production :**
   - l'assortiment actuel de fleur coupée ;
   - puis les classiques du jardin ;
   - puis les récents ;
   - puis les variétés de niche.
5. **Rapport de couverture**, par sorte : nombre de cultivars enregistrés, documentés, prouvés A ou B, au catalogue. Le rapport dit ce qui
   manque, et pourquoi.
6. **Mise à jour.** Les registres changent chaque année : on refait un recensement par genre une fois par an.

## 7. Qui fait quoi (méthode `/fleur`)

| Agent | Modèle | Rôle |
|---|---|---|
| `fleur-recensement` | Sonnet | Taxonomie, inventaire, preuves du nom (N1, N2), sources des photos, niveau de preuve |
| `fleur-coloris` | Haiku | Mesure des couleurs sur les photos désignées par le recensement |
| `fleur-refs` | Haiku | Photos de forme, de stades et d'organes de la sorte (Commons, iNaturalist, sources N3) |
| Orchestrateur | Opus | Contrôle par sondage : 10 % des coloris revérifiés à la main sur leurs sources avant le passage en production |

## 8. Pièges connus

- **Photos truquées des places de marché :** bulbes « arc-en-ciel », couleurs impossibles.
- **Synonymes et noms commerciaux :** une même variété vendue sous deux noms ; on retient le nom enregistré.
- **Classement de groupe contradictoire d'une source à l'autre :** le registre tranche.
- **Couleurs saturées des catalogues :** il faut au moins une photo N3 pour les recouper.
- **Fleurs de champ prises au soleil :** les blancs et les roses y sont faussés.
- **Variétés doubles ou frangées mêlées aux simples** dans les recherches.
