# Lot 14 « globes et hampes » : rapport de l'agent alliums

**Fichier du lot :** `ws/alliums/s14a.js` (261 lignes, chargé avant c4.js). Aucun fichier moteur n'a été copié ni modifié, donc il n'y a **aucun diff moteur**.

**Planches :** `ws/alliums/sheets/`
- `<sid>_vues.png` : 9 vues × 3 stades ;
- `<sid>_coloris.png` : tous les coloris, puis 3 tailles réelles avec un trait de 5 cm ;
- `cartes_composer.png` : les 40 produits ;
- `bouquets.png` : 8 bouquets composés et 4 modèles.

## Espèces

### 1. `ail-serpent` (Allium sativum var. ophioscorodon, hampe d'ail d'hiver)

**Botanique**
- La hampe est ronde, pleine et pruineuse (glauque), épaisse de 4 à 6 mm, sans feuille.
- Elle fait 1 à 2 boucles, puis se redresse.
- L'ombelle reste close dans une spathe papyracée : un renflement de 1,2 à 1,6 × 3 à 4 cm, suivi d'un long bec effilé de 6 à 9 cm.
- On la vend en fleuristerie d'avril à septembre, en 40 à 60 cm.

**Dessin**
- La hampe pousse par L-système :
  - `R(i)` monte le long de l'axe ;
  - `C(i)` fait la boucle (`+κ` en cloche, total 360° × tours, et `&τ` aller-retour pour qu'elle se croise en profondeur) ;
  - `Q` poursuit l'axe ;
  - `Sp [P … Tp]` porte la spathe sur son propre axe.
- La boucle varie : 1 à 1,85 tour, parfois double.
- La hampe est un seul tube en 4 tons, avec un reflet de pruine.
- Au croisement, le brin de devant est redessiné, découpé en disque : il n'y a pas de couture.
- La spathe est verte à la base et pâlit vers le bec, qui s'affine jusqu'à la pointe sans casse.

**Composer :** c'est une ligne (xSnake ∈ SPINE_FN) qui suit l'épine (`{k,bw,bc}`), avec `GHI.fx` = 5 cm et `tip` = 0,95.

**Coloris (6) :** vert glauque, vert tendre, vert tilleul (jeune), vert olive (rocambole), spathe violacée, vert d'eau pruiné.

**Tailles :** 40 à 60 cm.

### 2. `allium-petit`

**Botanique**
- Hampe nue.
- La spathe à 2 valves papyracées se fend au stade bouton (fente visible sur la planche).
- Fleurettes à 6 tépales sur pédicelles.

**Trois formes**
- **Œuf « drumstick »** (sphaerocephalon) :
  - clochettes serrées qui virent du vert au bordeaux, du haut vers le bas ;
  - en bouton, la tête est encore dans sa spathe fendue.
- **Boule d'étoiles** (caeruleum, 'Purple Sensation', 'Pink Jewel').
- **Ombelle lâche sur pédicelles visibles** (cowanii, moly, 'Graceful Beauty', 'Silver Spring').

**Coloris (11) :**
- Bordeaux et vert (drumstick)
- Bordeaux mûr
- Vert jeune
- Bordeaux à houppe blanche (Red Mohican)
- Pourpre (Purple Sensation)
- Bleu (caeruleum)
- Rose (Pink Jewel)
- Blanc étoilé (Graceful Beauty)
- Blanc à cœur pourpre (Silver Spring)
- Blanc (cowanii)
- Jaune (moly)

**Tailles :** grades de 3 à 4,5 cm, multipliés par un facteur de cultivar. Par exemple, Purple Sensation ×1,9 donne 6 à 8,5 cm.

### 3. `allium-grosse-tete`

**Botanique**
- Sphère de 10 à 20 cm faite de centaines de fleurettes étoilées (jusqu'à 1 500 chez Globemaster).
- Hampe épaisse.
- En bouton : spathe en bulbe à bec court, qui se fend.
- Au stade mi-ouvert : boule de boutons, avec 2 valves pendantes.

**Technique de rendu**
- Les fleurettes sont projetées sur la sphère : 420 en DET 2, 260 en DET 1.
- Chaque fleurette a un contour en étoile (tépales elliptiques quand elle est assez grande).
- Elles sont regroupées en environ 25 chemins, par bande de profondeur × couleur × palier de lumière.
- Un cœur sombre figure la masse des pédicelles, et une frange se forme au contour.

**Composer**
- C'est une tête focale.
- Quand un modèle en fait une ligne (modèles 76 et 78), elle suit l'épine, comme l'ancien xAllium.

**Coloris (8) :**
- Violet (Globemaster)
- Pourpre profond (Ambassador)
- Lilas à cœur vert (Gladiator)
- Blanc (Mount Everest)
- Lilas rosé (giganteum)
- Lilas clair (His Excellency)
- Lavande bleutée (Purple Rain)
- Étoile de Perse (cristophii) : étoiles métalliques sur longs pédicelles

**Tailles :** de 12 à 18 cm, multipliées par un facteur de cultivar.

### 4. `eryngium`

**Botanique**
- Cône de 1,5 à 3 cm fait de minuscules fleurs, chacune dans une bractéole épineuse : la tête est hérissée.
- Collerette de 6 à 12 bractées linéaires, dentées et épineuses, dressées sur les jeunes têtes et étalées et vrillées sur les mûres.
- Tige glauque bleutée ramifiée en cyme dichotome, qui porte 3 à 7 têtes d'âges différents.
  - Règle du L-système : `N(o) → [Lv][Lv][F N(o+1) F K(o)] …`, sur 2 ordres.
  - La tête terminale est la plus bleue.
- Feuilles sessiles épineuses, à 3 ou 5 lobes, aux fourches.

**Coloris (10) :**
- Bleu acier (Orion)
- Bleu profond (Magical Blue Lagoon)
- Bleu ciel argenté
- Argent (Silver Ghost)
- Blanc (Sirius)
- Vert à pointe verte (Supernova)
- Bleu-vert (jeune)
- Turquoise, rose et violet : coloris teintés, tige teintée comprise

**Tailles :** cône de 2 à 3,5 cm.

### 5. `echinops`

**Botanique**
- Sphère parfaite de 3 à 5 cm faite de capitules uniflores aux bractées épineuses.
  - Les touffes sont des pyramides tournées au hasard, ce qui donne un aspect métallique.
  - En bouton, elles sont vert-gris et piquantes.
  - Les fleurons bleus à 5 lobes sortent du haut vers le bas.
- Tige laineuse grise ramifiée, qui porte 3 ou 4 têtes d'âges différents (`lsHeadS` avec rameaux).
- Feuilles pennatifides épineuses, vert sombre dessus, avec le feutre blanc du revers visible.

**Coloris (5) :** bleu acier (Veitch's Blue), bleu violet (Taplow Blue), gris bleuté métallique, blanc (Arctic Glow), vert (boutons).

**Tailles :** de 3 à 5 cm.

## Vérification

Les QA ont été relancées après la mise à jour de l'app (r6a, s20a, l0, c5).

**Bouquets composés**
- 3 graines (5, 7, 11) × 20 bouquets avec `inc=` les 5 espèces.
- Résultat : **0 F, 0 U, 0 kink** (`final_c*.json`).

**Modèles**
- Les 18 modèles (2, 8, 15, 19, 21, 24, 25, 29, 49, 50, 52, 60, 68, 70, 72, 76, 78, 81), en graine 7 puis en graine 3.
- Résultat : **0 F, 0 U, 0 kink** (`final_m*.json`).

**Perf** en bouquet (DET 1, perf2 et perf3 sur les 18 modèles) :

| Espèce | Éléments SVG par tige | Temps par tige |
|---|---|---|
| ail-serpent | 25 | 3,2 ms |
| allium-petit | 67 | 2,5 ms |
| allium-grosse-tete | 64 (57 en ligne) | 4,2 ms |
| echinops | 77 pour 3 ou 4 boules | 1,7 ms |
| eryngium | 144 pour une cyme de 5 à 7 têtes, soit environ 20 par tête | 3,5 ms |

- Pour comparer, les espèces les plus lentes de l'app prennent de 15 à 24 ms par tige.
- Dégradés : un `rad` partagé par coloris, plus 2 ou 3 par spathe d'ail.

## Points douteux

- **Ail serpent sur la planche.** La hampe reste verticale à l'écran et c'est la boucle qui tourne avec la vue. De profil, la boucle est vue par la tranche, ce qui est juste mais moins lisible.
- **Facteur de cultivar.** La taille des coloris passe par ce facteur. Le rayon que le Composer calcule à partir du grade sous-estime donc un peu Purple Sensation et cowanii.
- **Espèce non dessinée.** Nectaroscordum siculum, cité dans la liste latine, n'a pas sa forme propre (cloches pendantes).
- **Audit des lignes.** L'audit de kinks ne couvre pas les lignes. La continuité de la hampe d'ail est garantie par la tortue, mais elle n'a pas été mesurée.
- **Eryngium.** 144 éléments par tige est au-dessus de 100, mais cela fait environ 20 par tête.
