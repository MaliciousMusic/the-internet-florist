# Lot 98 « bois graphiques » — rapport de l'agent « bois »

Branche `serre/98-bois`. Fichier du lot : `serre/ws/bois/s98a.js` (préfixe `l98`/`L98`/`CW_L98`). **Aucun module moteur modifié** (pas de copie, pas de diff).
Aucune des 5 espèces n'avait d'ancienne version en Serre (`grep` vide dans `demo/src`) : seules leurs recettes génériques de `k0.js` existaient. Elles sont désormais dessinées sous leurs sids.

## Moteurs réutilisés
- **Bois tordu** (`l98Grow`, nouveau, sur le modèle du saule tortueux de `s18a.js`) : L-système 3D où chaque entre-nœud est un **arc de q petits pas** qui tournent tous du même côté, d'où l'absence de coude ; de nœud en nœud, l'arc repart de l'autre côté (probabilité `ps`) ou continue à s'enrouler, et le plan de courbure peut rouler à chaque pas (`rl` : l'hélice du noisetier). La branche est posée sur `lnAxis`/`lnHug`/`lnSink` (lot 18), donc tenue à son épine dans un bouquet. L'option fasciée enregistre la face de la tige à chaque pas (organe `u`) et donne un **ruban plat** (`lnRibbon`) qui s'élargit, se vrille et finit en **crosse** (les derniers entre-nœuds tournent dans le plan du ruban, de plus en plus serrés).
- Branches feuillées : `l39Sprig` (lot 39), avec les feuilles opposées et décussées (érable) ou des organes de nœud (rameaux courts du mélèze) ; écorce `l39Bark`, lenticelles `l39Lenti`, bourgeons `l39Ovoid`.
- Chatons : `b29Catkin` (chatons argentés du lot 29) pour le Sekka, `l39Catkin` (chatons pendants du bouleau) pour le noisetier.
- Pin : `fgGrow` (lot 24), aiguilles en faisceaux `l45Needles` et bourgeons `l45PinBuds` (lot 45).
- **Cône à écailles** (`l98Cone`, nouveau) : écailles disposées selon l'angle d'or, couchées le long de l'axe (cône fermé) ou écartées (cône ouvert), avec une lèvre ronde (mélèze, « rose ») ou un écusson rhombique avec son ombilic (pin) ; dessinées de l'arrière vers l'avant. Au détail de l'appli, les écailles d'un même ton sont fusionnées en un seul chemin.

## Par espèce

### `saule-fascie-sekka` — Salix udensis 'Sekka' (saule dragon)
- **Botanique.** Clone mâle aux tiges fasciées : plates, élargies vers le haut (2 à 5 cm), striées en long, vrillées et enroulées en crosse au sommet, souvent deux crosses côte à côte. Écorce lisse et luisante, brun-rouge à châtaigne ; jeunes rameaux ronds plus rouges. Chatons argentés soyeux de 1,5 à 2,5 cm à la fin de l'hiver, qui sortent de leur coiffe brun-rouge le long des tiges et sur les bords des rubans, puis montrent des étamines jaunes.
- **Fait.** Tige principale ronde au pied, puis ruban plat (largeur 3,6 à 4,8 cm à 100 cm) strié (sillons sombres et une crête claire), crosse de 300 à 420° ; une deuxième tige fasciée (1 ou 2), des rameaux ronds tordus. Bourgeons pressés ou chatons tous les 2 à 3 cm sur les arêtes du ruban (posés sur l'arête, jamais à côté). Bout de la crosse arrondi.
  - Stades : bouton = chatons sous leur coiffe ; mi-ouvert = argentés ; ouvert = pleins, quelques-uns avec étamines.
  - Dans un bouquet : la fasciation commence à au moins 14 cm de la lèvre ; pour une épine courte, crosse plus petite et entre-nœuds plus courts (sinon toute la tige se roulait au col).
- **Coloris (5).** Brun-rouge luisant · brun-rouge à chatons argentés · acajou · peint blanc (modelé en gris) · peint or (reflets métalliques).
- **Tailles.** 60, 80, 100, 120 et 150 cm.

### `noisetier-tortueux-chatons` — Corylus avellana 'Contorta' (et 'Red Majestic')
- **Botanique.** Rameaux en tire-bouchon et en boucles, écorce gris-brun duveteuse à lenticelles claires. Chatons mâles pendants, par 1 à 3 sur de courts pédoncules : serrés, gris-vert, 2 à 3 cm en hiver, puis lâches, 5 à 8 cm, jaune pâle de pollen. Fleurs femelles : un bourgeon avec une houppe de styles cramoisis. 'Red Majestic' a le bois et les chatons pourpres.
- **Fait.** Hélice continue : chaque entre-nœud (3 à 4 cm) tourne de 80 à 100° et le plan roule de 16 à 24° à chaque pas. Rameaux et brindilles aussi tordus. Chatons répartis sur toute la branche. Fleurs femelles rares, styles d'au moins 1,15 unité. Bourgeons ovoïdes vert-brun.
  - Stades : chatons serrés et tenus, puis qui s'allongent, puis pendants et jaunes avec leur pollen.
- **Coloris (3).** Brun gris à chatons jaunes · pourpre à chatons pourpres (Red Majestic) · brun gris (rameaux nus).
- **Tailles.** 50, 60, 80 et 100 cm.

### `erable-du-japon` — Acer palmatum (et groupe Dissectum)
- **Botanique.** Rameaux grêles verts ou rouge-pourpre (corail chez 'Sango-kaku'), nœuds opposés-décussés. Pétiole de 3 à 5 cm, souvent rouge. Limbe de 5 à 8 cm, palmé, découpé profondément en 5 à 7 lobes lancéolés, acuminés et doublement dentés ; les Dissectum ont 9 lobes découpés jusqu'à la base, en dentelle. Feuillage vert l'été, pourpre toute la saison ('Bloodgood', 'Atropurpureum'), écarlate, orange ou or à l'automne, souvent de plusieurs teintes sur un même rameau.
- **Fait.** Chaque lobe est une lame 3D (`lsLeafS`) qui part du sommet du pétiole. Les lobes se recouvrent au cœur, donc aucun ne flotte. Chaque moitié est éclairée par sa propre normale ; marge dentée, nervures claires sur les planches. Au détail de l'appli : une feuille = pétiole + un seul chemin, et le contour est tracé à 1,1 unité, si bien qu'un lobe vu de chant ne devient jamais un fil.
  - Stades : jeunes feuilles petites, pliées et teintées de bronze, puis feuilles adultes.
- **Coloris (9).** Vert · rouge écarlate · orange · jaune d'or · pourpre foncé · mélange d'automne · Sango-kaku (vert tendre, bois corail) · Dissectum vert · Dissectum pourpre.
- **Tailles.** Branches de 40, 50, 60 et 80 cm. Une valeur `o.cm` ≤ 15 (unité de la recette) règle la taille de la feuille.

### `meleze-a-cones` — Larix decidua, L. kaempferi
- **Botanique.** Conifère caduc. Pousses longues souples, jaune paille à brun-rouge (pourpres chez L. kaempferi), rameaux latéraux pendants. Sur le vieux bois, des rameaux courts en bouton (brachyblastes), chacun portant au printemps une rosette de 20 à 40 aiguilles molles de 2 à 3,5 cm, vert tendre, dorées à l'automne. Cônes dressés sur ces rameaux courts, 2 à 4 cm, ovoïdes à ronds, à écailles fines et arrondies (retournées en rose chez L. kaempferi) : rouge-rose jeunes, puis bruns. Ils restent des années sur le bois nu et y grisonnent.
- **Fait.** Rameaux courts à tous les nœuds (1,2 à 1,7 cm), rosettes d'aiguilles (traits de 1,15 unité partant du rameau court), cônes « en rose » dressés sur leur rameau court. Lichen clair sur le coloris gris. Au détail de l'appli : rameaux courts et rosettes d'une branche fusionnés en quelques chemins (457 → 135 éléments).
- **Coloris (5).** Brun naturel à cônes (nu) · gris argenté (vieux rameaux, cônes anciens) · vert tendre (aiguilles de printemps, jeunes cônes roses) · or d'automne · mélèze du Japon (rameaux pourpres, écailles retournées).
- **Tailles.** 50, 60, 70 et 90 cm.

### `pin-a-cones` — Pinus spp.
- **Botanique.** Aiguilles en faisceaux engainés à la base : 2 chez le pin sylvestre (4 à 7 cm, vert bleuté, tordues) et le pin noir (8 à 14 cm, raides, vert foncé), 5 aiguilles fines et souples chez le pin de Weymouth (8 à 13 cm). Verticille de bourgeons résineux au bout de la pousse. Cônes pendants sur un court pédoncule : verts et fermés la 2ᵉ année, puis bruns et fermés, puis ouverts, avec leurs écailles ligneuses en spirales croisées, chacune terminée par son écusson rhombique (apophyse) et son ombilic. Taille des cônes : sylvestre 3 à 7 cm, noir 5 à 8 cm (blond luisant), Weymouth 8 à 15 cm (longs, étroits, arqués).
- **Fait.** Rameau `fgGrow` + `l45Needles`, cônes `l98Cone` pendants, pédoncule enraciné sur le rameau, placés dans la partie haute.
  - Stades : bouton = cônes verts fermés (et chandelles) ; mi-ouvert = cônes bruns fermés ; ouvert = cônes ouverts.
- **Coloris (5).** Pin sylvestre à cônes bruns · pin noir à cônes blonds · pin de Weymouth à longs cônes · givré blanc (aiguilles blanchies, givre sur les écailles) · cônes dorés.
- **Tailles.** Branches de 40, 50, 60 et 80 cm. Une valeur `o.cm` ≤ 15 (unité de la recette, 7 cm) règle la taille du cône, d'où les cônes de 5, 7 et 9 cm sur la planche des tailles.

## Composer (GHI)
- Sekka, noisetier et mélèze : `form:'ligne'`, comme le saule tortueux et le bouleau (épine propre, `tip`, `fx`, `rch`).
- Érable et pin : `form:'feuillage'`, comme le hêtre et `pinus-pins`.

## QA
- Planches : 9 vues × 3 stades (même plante sous tous les angles grâce à la graine hachée `g35Run`/`l39Sprig`), tous les coloris, 3 tailles. Regardées en grand et zoomées (crosses, chatons, cônes, lobes).
- Cartes du Composer : `sheets/cartes_composer.png`.
- **Bouquets composés** (`inc=` les 5 sids, n = 20) : **0 F, 0 U, 0 kink** sur 4 graines × 20 bouquets (graines 5, 11, 23, 41 ; 80 bouquets). Captures regardées : graines 3 et 9 (`sheets/bouquets.png` = graine 9), avec zoom sur les crosses du Sekka au col. Corrigé en route : un lobe d'érable vu de chant (fil détaché), du givre en traits flottants sur le pin, une fasciation trop basse au col (U) et une crosse qui roulait toute une tige courte.
- **Modèles du catalogue** : `python3 serre/models_of.py <5 sids>` donne `ns=` vide. Aucun des 76 modèles n'utilise ces espèces, il n'y a donc rien à vérifier.
- **Perf** : le lot ne touche aucun moteur. `perf=1` sur les 76 modèles donne 193 ms et 8 295 éléments par bouquet, identique à une base sans le lot mesurée sur la même machine (194 ms, 8 295). Par tige dans un bouquet (DET 1, 12 tirages le long d'une épine, coloris, tailles et stades variés) : Sekka 114 éléments (5,3 ms), noisetier 170 (5,0), érable 116 (8,8), mélèze 135 (4,5), pin 224 (5,0). Repères : saule tortueux 71, bouleau 120, hêtre 102, `pinus-pins` 194.

## Doutes
- Le saule 'Sekka' peint (blanc, or) existe dans le commerce surtout pour les fêtes. L'acajou est une teinte naturelle sombre plutôt qu'un cultivar.
- Les chatons du noisetier sont dessinés depuis le nœud. En réalité, ils sortent aussi au bout de courts rameaux latéraux.
- Le pin n'a pas de « tailles » au sens du commerce : il se vend à la longueur. L'unité de la recette (7 cm) désigne le cône, d'où la double lecture de `o.cm`.
- Le mélèze vert porte à la fois des rosettes et de jeunes cônes roses ; les cônes bruns de l'an passé n'y sont pas mêlés.
