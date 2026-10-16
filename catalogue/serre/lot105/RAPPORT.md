# Lot 105 « jardin » — fleurs tropicales et de jardin

Branche `serre/105-jardin`. Fichier du lot : `s105a.js`, préfixe `l105` / `L105_`. Aucune copie moteur, aucun diff moteur.
Ces cinq sids n'avaient pas de version en 3D : elles étaient dessinées par leur recette générique (`k0.js`). Les nouvelles versions passent par `GH` sous le même sid.

## Espèces

### hibiscus — Hibiscus rosa-sinensis
- **Ce qui est fait.** Plante `lsHeadS` : tige ligneuse, 3 nœuds, feuilles `bzBlade` ovales, dentées et luisantes, boutons ou fleur plus jeune aux aisselles.
  - Fleur : 5 pétales `sheet3` en entonnoir, qui se recouvrent, avec la marge ondulée et des nervures dessinées par bande.
  - Œil sombre peint sur la face interne, anneau clair pour 'Fiesta' et la lavande.
  - Colonne staminale `tube3` saillante : anthères jaunes sur pédicelles, partant de la colonne, puis 5 stigmates rouges.
  - Derrière la fleur : calice à 5 lobes et calicule de 7 bractéoles.
  - Bouton : fuseau torsadé, avec une couture en spirale, qui sort du calice.
- **Botanique.** Fleur de 10 à 18 cm, solitaire à l'aisselle. Pétales obovales tordus dans le bouton. Colonne de 5 à 8 cm.
- **Coloris (11).** Rouge (Brilliant), Rouge sang (Adonicus Red), Rose (Seminole Pink), Rose saumon (Adonicus Salmon), Orange à cœur blanc et rouge (Fiesta), Jaune à œil rouge (Hula Girl), Jaune d'or (Adonicus Yellow), Pêche, Blanc à cœur rouge, Lavande (hybride tahitien), Bordeaux (Black Dragon).
- **Tailles (cm).** 10, 12, 14, 15, 18.
- **Registres.** `GHI` etoile 2.6 head, `GH_BUDS`.

### plumeria — frangipanier (Plumeria rubra, P. obtusa)
- **Ce qui est fait.** Plante `chpHeadS`, comme l'ixora : branche épaisse gris-vert, rosette de grandes feuilles oblancéolées aux nervures nombreuses, puis la cyme sur son long pédoncule.
  - Fleurs disposées en dôme. Chaque fleur a un tube et 5 pétales en hélice : chaque pétale est coupé en deux moitiés, la moitié relevée passe sur le pétale voisin, et l'ordre de dessin suit la profondeur.
  - Cœur jaune en 3 lavis le long de l'onglet de chaque pétale.
  - Boutons en cigare torsadé, plus roses que les fleurs.
  - Branches de la cyme en un seul trait épais d'au moins 1,3 unité.
- **Botanique.** Fleurs cireuses de 5 à 9 cm, feuilles de 20 à 35 cm groupées au bout des rameaux. Les feuilles sont réduites ici à 1,7–2,5 fois la fleur pour le bouquet.
- **Coloris (10).** Celadine, Singapore (P. obtusa), Daisy Wilcox (revers rose), Kaneohe Sunburst, Aztec Gold, Sunset (liseré rose), Pink Pearl, Vera Cruz Rose, Hilo Beauty, Black Tiger.
- **Tailles (cm).** 5, 6, 7, 8, 9.
- **Registres.** `GHI` sphere 2 head, `GH_BUDS`.

### bougainvillea — bougainvillier (B. glabra, B. spectabilis, B. × buttiana)
- **Ce qui est fait.** Rameau `bzShoot` sur l'épine du Composer : nœuds alternes avec une feuille ovale, une épine courbe à certaines aisselles et des rameaux florifères poussés par `bzGrow` dans les aisselles hautes.
  - Triplets de 3 bractées papyracées en cœur, creusées et finement nervurées. Chaque bractée porte sur sa nervure médiane sa fleur tubulaire, terminée par une petite étoile blanche à 5 lobes.
  - Âge des triplets : les jeunes sont petits, verdâtres et fermés.
  - Au détail de l'appli (DET 1), les bractées sont dessinées par lots de profondeur : un chemin par teinte. Avant ce regroupement, le rameau faisait 810 éléments ; il en fait maintenant 262.
- **Botanique.** Bractées de 2,5 à 5 cm, fleur de 1,5 à 2 cm soudée à la bractée.
- **Coloris (11).** Glabra Sanderiana, Scarlett O'Hara, Barbara Karst, Pink Pixie, Thai Delight, Purple Queen, Blueberry Ice, California Gold, Rosenka, Golden Glow, Alba (nervures vertes).
- **Tailles (cm).** Rameau de 30 à 60.
- **Registres.** `GHI` grappe plant.

### glaieul-nain — Gladiolus nanus, G. × colvillei
- **Ce qui est fait.** Moteur du glaïeul de la reprise 5 (`spGrow`, `spStemP`, `swordLeaf`, `gladBracts`, `spHalf`), en plus court : tige de 4,6 unités, 2 à 3 feuilles en épée, épi unilatéral de 5 à 9 fleurons de 6,2 cm.
  - Nouveau fleuron `l105GnFloret` : 6 tépales pointus en entonnoir ouvert.
  - Macule en fer de pique sur les 3 tépales inférieurs, bordée quand le coloris le veut ('Nymph', 'Spitfire'…).
  - Anthères violettes.
- **Botanique.** Tige de 40 à 60 cm, épi de 15 à 25 cm, fleurons de 5 à 6 cm, floraison précoce.
- **Coloris (11).** Nymph, The Bride, Blushing Bride, Prins Claus, Impressive, Charm, Elvira, Amanda Mahy, Spitfire, Robinetta, Atom.
- **Tailles (cm).** Épi de 16 à 25.
- **Registres.** `GHI` epi plant (self 55 cm), `GH_BUDS`.

### rose-ancienne-parfumee — roses anciennes et anglaises
- **Ce qui est fait.** Plante `lsHeadS` : tige épineuse (`rose2Thorns`) et feuilles composées **en 3D** (`l105RoseLeaf` : rachis et 5 ou 7 folioles `bzBlade` dentées). Sur les rameaux latéraux, des boutons ou une fleur plus jeune.
  - Fleur `l105RoseFlower` : 8 à 11 pétales de garde en coupe profonde, dont la marge se roule un peu à l'ouverture.
  - À l'intérieur, 4 quartiers de pétales pliés, ouverts vers le centre, séparés par des plis sombres, autour d'un œil de bouton (vert pour 'Madame Hardy').
  - Stries cramoisies pour 'Ferdinand Pichard'.
  - Bouton rond, aux sépales longs et découpés.
  - À DET 1, les pétales des quartiers sont en aplat, sans dégradé : 129 éléments par tête, contre 865 pour la rose anglaise existante.
- **Botanique.** Fleur de 7 à 12 cm, de 60 à 150 pétales, quartée autour d'un œil de bouton.
- **Coloris (10).** Constance Spry, Madame Alfred Carrière, Gertrude Jekyll, Ferdinand Pichard, Souvenir de la Malmaison, Rose de Resht, Charles de Mills, Reine des Violettes, Madame Hardy, Cardinal de Richelieu.
- **Tailles (cm).** 7, 8, 9, 10, 12.
- **Registres.** `GHI` rosette 2 head, `GH_BUDS`, `STEML` pennée.

## QA
- **Planches.** Regardées en grand et zoomées : 9 vues × 3 stades, tous les coloris, 3 tailles. Défauts corrigés en cours de route :
  - nervures d'hibiscus qui sortaient des pétales ;
  - face interne de l'hibiscus inversée ;
  - cœur du frangipanier trop anguleux ;
  - rose trop plate de profil ;
  - quartiers lus comme de « petites roses ».
- **Bouquets composés.** `inc=` des 5 sids, n=20, graines 5, 11 et 23 : **0 F, 0 U, 0 kink** (60 bouquets). Captures regardées : `bq1` et `bq2`, plus `sheets/bouquets.png`.
- **Modèles.** `models_of.py` renvoie une liste vide : aucun des 76 modèles n'utilise ces sids, il n'y a donc pas de QA modèles à faire.
- **Éléments par tête, DET 1** (moyenne sur 12 tirages, toutes vues et tous stades) :

  | espèce | éléments |
  |---|---|
  | hibiscus | 142 |
  | frangipanier | 88 |
  | glaïeul nain | 78 (glaïeul : 85) |
  | rose ancienne | 129 |
  | bougainvillier (rameau entier, environ 40 triplets) | 262 |

- **Perf** (`perf=1`, lancée seule) : 274 ms et 8 295 éléments par bouquet. La base sans le lot donne 271 ms et 8 295 éléments sur la même machine : rien ne change, puisque le moteur n'est pas modifié et qu'aucun modèle n'utilise ces sids. La machine cloud est plus lente que la référence de 142 ms.

## Doutes
- **Bougainvillier.** À 262 éléments, il dépasse le budget d'une tête, mais c'est un rameau entier. On peut encore réduire le nombre de lots de profondeur si besoin.
- **Frangipanier.** Les feuilles sont réduites par rapport au réel (20–35 cm) pour rester lisibles dans un bouquet.
- **Cultivars.** Quelques noms viennent de la mémoire botanique sans vérification en ligne : 'Adonicus' (série danoise en pot), 'Black Dragon', 'Atom'. Les coloris restent justes.
- **Rose ancienne de profil.** La coupe a une profondeur d'environ 0,5 diamètre. Les quartiers sont une stylisation : 4 éventails de pétales pliés, plus le pli entre les quartiers.
