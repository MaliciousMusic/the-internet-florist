# Chantier insectes — décisions

QCM du 2026-10-23 avec le propriétaire. Ce fichier fait foi pour le chantier. Les questions encore ouvertes sont à la fin.

## Espèces

Abeille, bourdon, coccinelle, fourmi noire et rouge, moro-sphinx (*Macroglossum stellatarum*), paon-du-jour (*Aglais io*),
machaon (*Papilio machaon*), cétoine dorée, sauterelle.

## Rendu

- **Source en SVG**, aussi réaliste que possible, avec le même protocole que les fleurs : photos de référence nommées,
  mesures, fiche par pièce, planches de test, budget, contrôle de sortie en gros plan.
- **Modèle assemblé par pièces** (tête, thorax, abdomen, segments de pattes, ailes, antennes) placées en 2,5D. Il doit
  rester juste sur toute la sphère 24 × 24 (576 facettes).
- **Atlas réduit aux vues utiles, symétrie comprise** : environ 9 azimuts dessinés, l'autre moitié en miroir, 6 élévations
  sans le dessous, soit une centaine de vues. Le nombre final est fixé par un test de saut entre vues. Deux tailles
  d'image : petite pour les insectes au loin, grande pour les passages près de l'écran.
- **Ailes plates en plans texturés** : papillons, moro-sphinx au repos, élytres ouvertes. Chaque face est dessinée une fois en
  SVG, puis mise en perspective par WebGL. Aucune case d'atlas pour elles.
- **Battements rapides** (abeille, bourdon, moro-sphinx en vol) : un faux d'animation traditionnelle, avec 2 ou 3 dessins
  qui bouclent. Chaque dessin superpose deux jeux d'ailes en arc. Les positions suivent le vrai mouvement de l'espèce
  (aller-retour en huit, pas un haut-bas). Pas de flou gaussien.
- **Exception à « que du SVG »** (accord du propriétaire, 2026-10-23) : la source reste en SVG ; les atlas WebP en sont
  une sortie compilée. Règle amendée dans `AGENTS.md`.
- **Affichage** : canvas WebGL (PixiJS). Les images sont calculées hors ligne avec resvg, pas avec Chrome headless.
- **Profondeur** : un canvas intercalé entre chaque plan de profondeur du bouquet SVG. Chaque fleur expose ses points de pose.

## Nombre à l'écran (au plus, en même temps)

| Espèce | Max |
|---|---|
| Abeille | 4 |
| Bourdon | 3 |
| Coccinelle | 4 |
| Fourmis | 7–8 |
| Moro-sphinx | 1 |
| Cétoine | 1 |
| Sauterelle | 3 |
| Paon-du-jour | 2 |
| Machaon | 1 |

Soit une vingtaine au total.

## Surfaces

- **Site boutique** (scène de jour, `decor/`).
- **Widget Belai Bureau** (`bureau/`), avec deux petits événements :
  - un insecte (abeille, papillon ou coccinelle) sort du pot, s'envole puis revient. L'événement ne se déclenche que si
    le bouquet est visible à l'écran, non masqué par une autre fenêtre ;
  - un clic sur les fourmis les fait ramasser les pétales fanés.
- Fonctions cachées du bouquet : à concevoir plus tard, dans leur propre QCM.

## Comportement

Libre, selon une grille par espèce (plans d'avant en arrière, vol vers l'écran ou hors de l'écran, pose sur les fleurs).
Pas de contrôle par le joueur ; un clic déclenche un état (saut, envol, fuite…).

## Pilote

**L'abeille**, de bout en bout : SVG, modèle, atlas, Pixi, comportement de butinage, pose sur le bouquet, battement en
2 ou 3 dessins.

## Questions ouvertes

- Grille de comportement détaillée de chaque espèce (états, vitesses, durées) : à mesurer sur vidéos, puis à valider.
- Détection « bouquet non masqué » du widget : à vérifier selon la technique de `bureau/`.
- Fonctions cachées du bouquet.
