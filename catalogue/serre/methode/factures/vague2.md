# Vague 2 du pilote « Printemps à la carpe » : bilan et facture (8 et 9 octobre 2026)

Trois chantiers lancés en parallèle de la vague 1 le 8 octobre à 19 h 26 UTC : branches, iris-pois, clochettes.
Méthode `/fleur` : un chef Sonnet par chantier, modeleurs Opus en relais, agents Haiku pour les photos, les coloris et la QA.
Points de vigilance : `catalogue/serre/methode/vague2-points.md`. État par sorte : `catalogue/serre/pilote-printemps/PLAN.md`, section « Vague 2 ».

## Par sorte

Le « Total » de `bill.py report` compte aussi, dans la fenêtre de la sorte, les appels de l'orchestrateur et des autres chantiers qui tournaient en même temps (trou de méthode, voir plus bas). Le coût propre d'une sorte est celui de ses sous-agents, plus une part de la session de son chef (environ 10 M par sorte d'après le chef « branches »).

| Sorte | Publiée | Planches (`pilote-printemps/sheets/`) | Coloris en boutique (niveau) | Total bill.py | Sous-agents (dont Opus) | Durée |
|---|---|---|---|---|---|---|
| Fritillaire | oui (a9c9aad) | `fritillaire-meleagris-sku-v1`, `-plante-v1` | 6 modelés : damier B, Alba B, crème ret:1, lavande B fragile, Charon D, Saturnus C | 44,12 M | ≈ 17,0 M (11,4) | 6 h 03 |
| Viorne 'Roseum' | oui (a9c9aad) | `viburnum-roseum-sku-v1`, `-plante-v1` | 5 phases d'une courbe : vert B, vert tendre C, blanc B, blanc-crème ret:1, blanc rosé (texte seul) | 32,48 M | ≈ 8,7 M (6,2) | 4 h 17 |
| Alchémille | oui (a9c9aad) | `alchemille-sku-v1`, `-plante-v1` | Vert acide B, Jaune-vert (ex-Thriller®), vert tendre ret:1 | 28,01 M | ≈ 7,7 M (6,4) | 3 h 57 |
| Cerisier Sato-zakura | oui (9f98878) | `cerisier-du-japon-sato-zakura-sku-v1`, `-sku-v2`, `-plante-v1` | 10 : 5 du catalogue et 5 nouveaux (late:5) ; 'Pink Perfection' B | 48,26 M | 18,1 M | 7 h 39 |
| Cognassier | oui (9f98878) | `cognassier-du-japon-sku-v1`, `-sku-v2`, `-plante-v1` | 4 en B ('Salmon Horizon', Crimson and Gold, Cameo, Kinshiden late:5) ; 4 du catalogue en C ou D | 34,62 M | 8,8 M | 5 h 01 |
| Forsythia | oui (9f98878) | `forsythia-sku-v1`, `-sku-v2`, `-plante-v1` | 4 en B ('Lynwood Variety', Spectabilis, Beatrix Farrand et Spring Glory en late:5) | 32,27 M | 6,5 M | 5 h 02 |
| Iris hollandais | oui (49d22a4) | `iris-hollandais-sku-v3`, `-plante-v3`, `-coloris-v3` | 16 : 10 du catalogue et 6 nouveaux (late:6) ; noms A par le KAVB, mesures surtout C | 50,97 M | 18,69 M (12,77) | 8 h 35 |
| Pois de senteur | oui, v2 (reprise) | `pois-de-senteur-sku-v2`, `-plante-v2`, `-coloris-v2`, `-bouquet-v2` (v1 retenue) | 22 : 16 du catalogue et 6 nouveaux (late:7) ; 'Banty' C, 'Jacqueline Ann' C/B | v1 40,65 M + reprise 9,74 M | v1 12,45 M (7,67) + reprise 7,1 M (6,67) | 6 h 01 + 1 h 26 |

Numéros de SKU : 3 823 avant la vague 2, 3 843 après les quatre publications. Aucun numéro existant n'a bougé (contrôle par la liste complète avant et après chaque fusion). Les coloris nouveaux sont en fin de liste : SKU 3824 à 3831 (late:5), 3832 à 3837 (late:6), 3838 à 3843 (late:7).

## Ce qui reste imparfait (détail dans le PLAN)

- **Fritillaire** : damier un peu « carrelage » ; capsule non dessinée ; cloche à 1/12 de la tige au lieu de 1/6 à 1/8, la taille étant bornée par le hasard des bouquets.
- **Viorne** : boule verte un peu « trèfle » ; rosé et brun déduits sans photo.
- **Alchémille** : boutons lourds au stade 0,2 ; gouttes de tailles trop égales.
- **Cerisier** : lenticelles trop régulières ; fané de 'Pink Perfection' gris-lilas ; 4,8 rustines par tête ; pas de tapis de pétales.
- **Cognassier** : fané sans photo ; stipules jamais photographiées.
- **Forsythia** : fané de face trop proche de l'ouvert ; pas de lignes orange dans la gorge.
- **Iris** : fané en lanières avec un coude au col ; aucune photo d'iris hollandais fané, de dos ni de dessous.
- **Pois de senteur** : la v1, illisible dans un bouquet, a été retenue. La v2 est publiée : étendard un peu bas de face, ailes un peu courtes, rose pâle voilé par la profondeur du bouquet.

## Charge du PC (relevés `fleur/res/vague1.csv` et `vague2.csv`, toutes les 15 s, du 8 octobre 19 h 24 au 9 octobre 4 h 11 UTC)

- CPU : 42 % en moyenne, 87 % au 95e centile, 100 % au maximum.
- RAM libre : 4,86 Go en moyenne, 1,91 Go au minimum ; sous 4 Go 16 % du temps, sous 3 Go 5 % du temps.
  - Le modeleur de l'iris a attendu 26 minutes ; la porte des rendus a bloqué environ une heure dans deux chantiers.
  - Gros consommateurs relevés (hors relevé, le 8 octobre vers 21 h 45 UTC) : Chrome de l'utilisateur 4,4 Go, sessions Claude 2,9 Go, 112 shells bash 0,95 Go.
- GPU 3D : 8 % en moyenne, 61 % au maximum.
- Chrome sans fenêtre : 3 au plus (la porte a tenu), 0,4 en moyenne.

## Quota (`fleur/quota.csv`, compte partagé avec la vague 1 qui tournait en même temps)

- Hebdomadaire : 24 % au départ, 60 % à la fin des trois premières publications (9 octobre 4 h 14 UTC), 62 % après la reprise du pois (5 h 44 UTC), soit 38 points en 10 h 20 pour les deux vagues.
- Fenêtre de 5 heures : 16 %, puis 75 % au plus haut ; elle s'est remise à zéro deux fois pendant la vague.
- Le garde-fou de 60 % a été levé par le porteur pour ces 8 sortes.

## Projection pour le catalogue (535 espèces)

- **Coût mesuré** : environ 7 à 19 M de sous-agents par sorte, plus environ 10 M de session de chef et une part d'orchestration. Soit **20 à 30 M d'équivalent entrée Opus par sorte**, contre une cible de 2 à 3 M.
- **En quota** : les deux vagues ont fait environ 19 sortes pour 36 points de quota hebdomadaire, soit à peu près 2 points par sorte. Une semaine pleine de quota ferait une cinquantaine de sortes, et les 535 espèces environ 11 semaines à ce rythme. Ce chiffre est approximatif : le quota est partagé entre les sessions et ne se répartit pas par sorte.
- **Où gagner**, sans réduire l'exhaustivité :
  - le recensement par API sans modèle (`census.py`) ;
  - un représentant par coloris distinct ;
  - des rapports de sous-agents de 5 lignes ;
  - des chefs aux attentes longues plutôt qu'aux allers-retours ;
  - moins de relais de modeleur, grâce aux contrôles de jonction et de proportion faits dès le premier rendu.
  
  Le modeleur Opus reste le plus gros poste : 6 à 13 M par sorte.

## Questions en suspens pour le porteur

1. **Viorne** :
   - Le SKU ~0 « vert anis » est un stade, pas un coloris. Proposition : garder le SKU sous le nom « Vert anis (cueillie verte) », puisque la viorne se vend verte et blanchit en vase.
   - Ou faut-il fusionner les phases en un seul SKU ?
2. **Fritillaire** :
   - Garder provisoires 'Charon' (D), 'Saturnus' (C) et 'Poseidon' (B fragile), ou les retirer ?
   - Agrandir la cloche jusqu'à ses proportions réelles (de 1/6 à 1/8 de la tige), même si les bouquets qui la contiennent changent ?
3. **Cognassier** : 'Pink Lady', 'Nivalis', 'Orange Trail' et 'Toyo-Nishiki' sont des SKU du catalogue en C ou D. Les garder provisoires, ou les remplacer par des variétés libres prouvées en B (par exemple 'Jet Trail' pour 'Nivalis') ?
4. **Cerisier** :
   - 'Ichiyo' (SKU 2, C, beige ou rose ?) : le garder provisoire, ou passer à 'Hanagasa' (B) ?
   - 'Kanzan' s'affiche « Rose (Kanzan) », d'après la mesure, et non « rose vif » : à confirmer.
   - Faut-il un tapis de pétales tombés au pied du vase ?
5. **Iris et pois** :
   - Le niveau A ou B porte sur le nom et les photos, mais la mesure des couleurs reste souvent en C, à cause des lumières des studios de vendeurs. Cela suffit-il pour la boutique ?
   - 'Banty' (SKU 3 du pois, une seule photo) : le garder en C, ou prendre un autre rose prouvé ?
6. **Coloris nouveaux qui « captent » les bouquets** : 6 coloris prouvés (iris 'Sapphire Beauty' et 'H.C. van Vliet' ; pois 'Little Red Riding Hood', 'Ella Mountbatten', 'Evie Jones', 'Helen Millar') ne sont pas ajoutés. La fonction commune `cwNear` (s0.js) leur attribuerait des couleurs de bouquets existants. Faut-il qu'elle ne prenne un coloris late que sur sa couleur exacte ?

## Trous de méthode (détail dans `vague2-points.md`)

- `bill.py` mêle à la sorte les appels de l'orchestrateur et des autres chantiers de la même fenêtre, et ne compte pas la session du chef.
- La recherche web des sous-agents s'épuise (environ 200 appels). Parades : les API ouvertes (iNaturalist, GBIF), WebFetch sur les pages connues, quelques recherches de l'orchestrateur.
- TMview bloque les recherches en série : les marques se vérifient à la main, et seulement pour les noms affichés.
- La QA « flottantes » ne voit ni un jour à la jonction, ni une pièce mince vue de chant coupée en deux. Le contrôle visuel d'un bouquet doit être fait par un modèle qui voit bien (l'orchestrateur ou le modeleur Opus), pas par un agent Haiku.
- Publication :
  - l'outil de fusion `chantier.sh merge` ramasse les fichiers de travail (`git add -A`) ; il faut un commit sélectif ;
  - les fins de ligne CRLF ajoutées par les outils Windows provoquent des conflits de fichier entier ;
  - un doublon de nom entre deux kits (`SVBL_DEF`) cassait l'application assemblée. Il faut une fusion d'essai dans une copie jetable, avec le contrôle de syntaxe de `mkapp.sh`, avant la vraie fusion.
- L'arbre de l'atelier principal portait des modifications non commitées d'une autre session : témoins et publication faits depuis des copies propres du HEAD.
