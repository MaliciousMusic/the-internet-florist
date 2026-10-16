# Atelier des matières — reprise après le retour humain

Le premier ensemble a été évalué à 35/100 par le porteur. La validation des 400 ébauches est conservée ; elle ne valide pas les finitions. L’objectif de cette reprise est d’augmenter la précision de la sculpture et de distinguer les matières. Le jugement esthétique reste celui du porteur.

Les huit planches privées 001–116 et l’étude native 005 servent à l’observation. Elles ne sont ni copiées dans les SVG, ni servies par la page locale. La première passe est conservée dans `iterations/v4/`.

## Décomposition du dessin

Chaque pièce est traitée en quatre niveaux : profil et appuis ; ouverture et épaisseur ; décor avec parties anatomiques ou végétales ; surface et lumière. La direction principale est commune, depuis le haut à gauche. La largeur des reflets suit les variations du col et de la panse.

Le corps utilise une peinture vectorielle calculée à partir de la courbure des courbes de Bézier. Les couleurs et opacités des bandes vectorielles sont calculées selon le type de matière : absorption et transmission pour le verre ; diffusion pour le satiné ; réflexion plus contrastée pour les métaux ; diffusion et reflet de glaçure pour la céramique ; lumière diffuse et nuages internes pour le jade. Le raccord entre les bandes est lissé par un filtre SVG natif.

Les végétaux et les animaux utilisent des cartes de hauteur dessinées en chemins et dégradés SVG. Les filtres `feDiffuseLighting` et `feSpecularLighting` éclairent ces formes sous la même direction. Les nervures et creux sont dessinés à une échelle distincte du volume principal. Les matières satinées, les patines et les glaçures reçoivent un grain procédural SVG mesuré. Il n’y a aucune image ou texture bitmap incorporée.

Ces procédés restent une interprétation graphique en 2D. Ils ne constituent pas une simulation optique complète de la réfraction d’une scène extérieure.

## Traits travaillés par pièce

| Pièce | Construction et détail |
|---|---|
| C040 — Verre teinté | Rubans d’anses à sections visibles, jonctions avec la panse, puits intérieur, absorption des bords, épaisseur du fond et appuis translucides. |
| C001 — Verre satiné | Contours de ginkgo différenciés, deux lobes, nervures rayonnantes à division fine, plis doux et diffusion de surface. |
| C159 — Verre irisé | Coques bombées, vingt-et-une côtes par coque, franges et irisation limitée aux angles lumineux. |
| C089 — Cristal taillé | Flûtes suivant la poire, deux ceintures de lentilles croisées, trois roues taillées, arêtes et col cannelé. |
| C253 — Verre camée | Quatre plans d’arbres, branches effilées, feuilles gravées, écorces, nœuds, racines et fougères du sous-bois. |
| C003 — Porcelaine | Gui à feuilles charnues et nervures fines ; groupes de baies bombées ; bord fin, anses et cavité. |
| C021 — Céladon | Feuilles de lierre lobées, nerf principal et nervures secondaires ; tige en relief et glaçure dans les creux. |
| C042 — Grès émaillé | Spathe creusée, bord roulé, revers, faisceau de nervures, spadice granuleux, tiges et talon céramique. |
| C295 — Émail cristallin | Dendrites radiales avec ramifications secondaires et lamelles, cristaux de plusieurs tailles, halos et craquelures sous glaçure. |
| C074 — Émail cloisonné | Iris en cellules individuelles, pétales dressés et retombants, feuilles recourbées, médaillons et fils dorés à ombre de contact. |
| C043 — Bronze patiné | Ramures principales et brindilles, nœuds, patine irrégulière, creux plus verts et arêtes usées. |
| C136 — Cuivre | Stries de révolution, marques de tournage, reflet chaud large, lumière de retour et oxydation locale. |
| C076 — Laiton | Impressions concaves de plusieurs dimensions, positions irrégulières suivant la courbure, aplatissement latéral, lèvre façonnée, contraste des reflets. |
| C007 — Argent | Corps et opercule du poisson-lune, nageoires dorsale/anal/pectorale, rayons, bouche, œil et ponctuation de peau ; faces et biseaux du vase. |
| C084 — Jade vert | Deux grues : épaules, cous continus, becs, yeux, longues rémiges dirigées vers l’arrière, petites scapulaires, jarrets et doigts. |
| C017 — Métal ajouré | Douze ouvertures découpées par masque, biseaux, structure arrière, ramures avant et arêtes intérieures. |

## Examen

Les contrôles techniques sont séparés du jugement artistique. Les SVG sont examinés sur fond ivoire et vert sombre, puis en agrandissement. La page présente les ébauches originales, la nouvelle reprise et, sur demande dans l’agrandissement, le premier essai. Les avis sont enregistrés séparément pour cette révision et exportables avec l’empreinte du SVG correspondant.

Le reste des 400 ne sera pas fini avant le retour du porteur sur ces exemples.

## Reproduction locale

Depuis la racine du projet, utiliser le Python et le Node déjà fournis par Codex : `sculpter.py`, puis `verifier.py`, puis `rendre.cjs`, puis `verifier-preview.cjs`. Le serveur dédié est `serve.py --port 8788` ; il écoute seulement sur `127.0.0.1` et ne sert qu’une liste explicite de fichiers.

Les rendus et le navigateur de contrôle sont successifs. Le garde-fou exige plus de 4 000 000 000 octets libres, conformément au seuil utilisé dans les contrôles du projet. Les rendus peuvent reprendre depuis leur cache d’empreintes après une baisse de mémoire. Aucun outil ne ferme les applications du porteur.
