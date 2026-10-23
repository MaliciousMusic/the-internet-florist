# Cétoine dorée (Cetonia aurata) : état au 2026-10-24

Deuxième passe, après le refus de la première par le porteur, selon la méthode du machaon (PROTOCOLE §1 à §7). Session 04 du chantier
insectes, branche `ch/insectes-04-cetoine`.

## Fait

### Photos par organe (§1)
`refcache/cetonia-aurata/refs-organes.json` : la couverture est complète (`refs_hd.py couverture`). Dix photos ont été ajoutées :
- la série d'envol c061 à c071, dont la composition c071 ;
- le trois-quarts vivant c076 ;
- le dessus sur papier millimétré c110 ;
- le dessous c102 et le trois-quarts c197.

Quatre vidéos Commons (480p, CC BY-SA 4.0, `refcache/cetonia-aurata/videos/videos.json`) servent au comportement : marche, prise de
nourriture enfouie. Le vol élytres fermées est vérifié sur les photos c061 à c072 ; aucune vidéo de vol n'a été trouvée sur Commons.

### Forme (§2)
- **Contour de dessus.** Lu sur le spécimen de studio c114 (`outils/forme.py dessus`, `mesures/dessus-c114.json`) : demi-largeurs
  tous les 0,25 mm, axe redressé de 0,8°. Les rangs que croisent les pattes sont relevés à part.
- **Hauteurs.** Lues sur le profil épinglé c111 (`mesures/profil-c111.json`) et sur la face c109.
- **Longueur.** 18 mm du clypéus à l'apex, au milieu de la plage de l'espèce (14 à 20 mm). Les deux spécimens sur papier
  millimétré mesurent 20 à 21 mm (c107 : 81,9 px/mm ; c110 : environ 110 px/mm).
- **Cartes SAM et profondeur.** `outils/cartes.py` et `outils/cartes.json`, 26 photos. Le passage attend le verrou depuis le début
  de la session (RAM libre entre 2,6 et 4,6 Go, il en faut 5,5). La loi d'angle a donc été mesurée sans ces cartes (voir plus bas).

### Couleur : la loi d'angle (§3)
- **Méthode.** Le vert structural est mesuré en loi d'angle, et non en aplat :
  - `outils/loi_modele.mjs` place chaque point de la carapace du modèle mesuré sur la photo, avec la normale du modèle ;
  - `outils/loi_modele.py` lit la couleur de la photo et celle du rendu par intervalle de n.v ;
  - le calage de chaque photo se règle à l'œil (`outils/calage.py`).
- **Mesures.** Sur les vivants au soleil c130 et c013, et sur le studio c114 :
  - de face (n.v 0,9 à 1), or-cuivre, teinte 78 à 98 ;
  - entre 45 et 80°, vert-jaune puis vert émeraude, teinte 113 à 136, couleur éclairée L* 55 à 80, C* 40 à 57 ;
  - aux angles rasants, vert-bleu, teinte 135 à 145 (c013).
  C'est le décalage vers le bleu attendu d'un réflecteur multicouche.
- **Rampe.** `mesures/loi-angle.json` (`ramp`, `table_rampe`) donne la réflectance par n.v, lue sur la couleur éclairée des photos
  vivantes (85e centile de L*). Le moteur la lit par `mat.ramp` et `mat.fresnel`.
- **Tête et dessous.** La tête a sa propre loi, cuivre de face (c109). Le dessous est bronze-cuivre poli (c103, c106, c111).

### Motifs en chiffres (§3.3)
- **Taches blanches.** 21 taches des élytres relevées en contours sur c114, en mm du repère du corps (`outils/taches.py`,
  `mesures/taches.json`). Elles sont portées sur la carapace point par point (`d.poly`) et peintes au-dessus du spéculaire (cire
  mate).
- **Piqûres.**
  - Élytres : fers à cheval ouverts vers l'arrière, 0,2 × 0,24 mm, en doubles rangées. La période de 0,62 mm vient du spectre ;
    l'écart de 0,25 mm, le pas de 0,38 mm et la densité de 6/mm² sont relevés à l'œil sur un recadrage de 11,8 mm².
  - Pronotum : piqûres rondes, plus denses sur les côtés.
  - Chaque piqûre est logée dans une fossette (`b.bump`), qui fait scintiller la carapace.
- **Aile postérieure.** Mesurée sur c230, aile étalée sur la pierre (`outils/aile_membrane.py`, `ailes/aile.json`) :
  - contour ; opacité de la membrane de 0,41 à 0,46, mesurée par le grain de la pierre vu à travers ;
  - nervures et plis, relevés à l'œil sur l'aile mise à plat avec sa grille au mm ;
  - longueur portée à 15,8 mm d'après c228.

### Modèle SVG (§3.5, §3.6)
`cetoine.mjs` range chaque organe sous `p-<organe>` :

| groupe | organes |
|---|---|
| corps | `ventre`, `pygidium`, `pronotum`, `scutellum`, `epimere-g/d`, `elytre-g/d` |
| tête | `tete`, `oeil-g/d`, `antenne-g/d`, `palpe-g/d` |
| pattes | `patte-<avant/milieu/arriere>-g/d` |
| ailes | `aile-g/d` (planches seulement) |

Au runtime, les ailes sont des quads (`essaim.placeWings`). La texture `atlas/cetoine-ailes.webp` fait 0,06 Mo sur le GPU.

### Juges neufs (§6)
Trois sous-agents qui n'avaient pas vu le travail ont rendu leur verdict. Les trois ont dit **ko**.
- **Premier juge**, sur les paires recadrées. Ses points :
  - silhouette en dalle ;
  - stries de reflet ;
  - point chaud jaune sur le pronotum ;
  - dessous et pattes à faire bronze-cuivre ;
  - clypéus, antennes et yeux ;
  - ailes ;
  - scutellum en V.

  Tout a été corrigé (ce23f93), sauf la dalle, reprise en partie : arrière arrondi par `warp`.
- **Deuxième juge**, qui n'a vu que les rendus, faute de la bonne image. Ses points :
  - fers à cheval trop gras ;
  - taches jaunes floues des fossettes ;
  - tête beige ;
  - aile vue par la tranche sur le vol 2/3.

  Corrigé (1e4ace1).
- **Troisième juge**, sur la planche photo | rendu (`paires.jpg`). Ses points :
  - dos plat ;
  - pattes longues et grêles ;
  - ailes fantômes du faux de vol ;
  - or-cuivre absent ;
  - bords des taches en escalier.

  Corrigé ensuite : les bords des taches sont lissés (Chaikin), les tibias épaissis de 25 % et les pattes teintées cuivre. Les autres points sont gardés comme résidus, ci-dessous.

### Sortie
- **Atlas** (`outils/cuisson.mjs`, puis `outils/atlas.py`) : ATLAS_POIDS.
- **Ailes** : texture de membrane `atlas/cetoine-ailes.webp`, 197 × 74 px, 0,06 Mo sur le GPU.
- **Runtime** : `runtime/cetoine.mjs` (classe `Cetoine`, constante `CETOINE`). Ses états :
  - au loin, trajet, atterrissage ;
  - marche (atlas « marche », 8 phases) ;
  - enfouie (tête en bas vers le cœur) ;
  - déploiement des ailes, envol, départ ;
  - au clic, elle lâche prise et fuit.

  Une cétoine au plus.
- **Démo** : `insectes/demo/index.html?n=0&cetoine=1&taille=3`, serveur `insectes-04` sur le port 8824. Vérifiée au navigateur : en
  pas à pas, la cétoine passe par tous les états et revient ; LOD L à taille ×8 ; pas d'erreur dans la console.
- **Planches** :
  - `planches/anim.png` : faux de vol à 3 dessins, déploiement 20/50/85 %, marche 4 phases, posée, enfouie ;
  - `planches/g-zoom.png` : gros plan d'élytre à 120 px/mm.

  La planche des paires `refcache/cetonia-aurata/paires.jpg` contient des pixels de photos : elle reste hors de git.
- **Comportement** : `COMPORTEMENT.md`, chiffres sourcés ou marqués comme chiffres de travail.

## Résidus (deux essais faits, garés)
1. **Dos en dalle.** De profil et en 3/4, le dessus reste trop droit, et le bord inférieur des élytres trop horizontal. Il
   faudrait relire `Z_TOP` et `Z_MAR` sur c027 et c111 en suivant le bord jusqu'à l'apex : le bord remonte derrière l'échancrure.
2. **Or-cuivré de face trop jaune.** La rampe, lue au 85e centile de L*, donne une teinte de 84 de face. c013 montre un cuivre
   rosé que ce centile écrase. Il faudrait relire la rampe de face au 50e centile, sur c013 seul.
3. **Échancrure peu lisible de dessus.** Le contour mesuré sur c114 a un creux de 0,15 mm seulement ; les juges en attendent plus.
   Le spécimen est peut-être aplati par l'épinglage. La mesurer sur un second dessus (c110).
4. **Faux de vol.** Le fantôme de l'aile se lit comme une seconde paire d'ailes sur une planche fixe. À 30 images par seconde, il se
   fond. Le juger en démo plutôt que sur planche.
5. **Hanches en boules** vues de dessous, et pas de saillie mésosternale.
6. **Cartes SAM et profondeur, grilles 72×18.** Elles n'ont pas tourné : le verrou a été saturé toute la session (RAM libre
   entre 2,6 et 4,6 Go, il en faut 5,5). J'ai arrêté le lot (`outils/cartes.py` est prêt). La loi d'angle a été mesurée à travers les
   normales du modèle.

## Fichiers partagés touchés (pour l'intégration)
Tous les ajouts sont derrière des clés nouvelles. Le machaon est identique au pixel : `outils/temoin-machaon.mjs` compare trois
cellules, et le SVG comme le PNG sont identiques.
- **`moteur/insecte.mjs`** :
  - `mat.ramp`, `mat.fresnel`, `mat.lobeColor` ;
  - `b.bump`, `b.mesh`, `b.warp`, `b.paintTop` ;
  - décalques `d.poly` et `d.top`.
- **`runtime/essaim.mjs`** : `wingPose[w].alpha`.
- **`demo/demo.mjs`** : `?cetoine=1`.
- **Nouveau** : `runtime/cetoine.mjs`.

## Questions au porteur
1. **Taille.** 18 mm (milieu de la plage de l'espèce) ou 20,5 mm (les deux spécimens mesurés sur papier millimétré) ? Proposition :
   18 mm.
2. **Vitesse du vol.** À vraie vitesse, 2 m/s, la cétoine traverse la page en moins d'une seconde. Proposition : ralentir à
   l'écran trois fois (`CETOINE.slow`).
3. **« Enfouie dans une fleur ».** Le bouquet n'a pas de masque par fleur. Proposition : piquer la cétoine tête en bas au cœur de
   la fleur, devant elle. La cacher en partie demanderait que chaque fleur expose son cœur en calque, ce qui est hors de cette
   session.
