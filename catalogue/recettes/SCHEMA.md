# Recettes Belai's Flowers — format

Deux types de fichiers JSON (UTF-8, tableaux) alimentent le générateur SVG paramétrique de l'app :

- `fleurs_XX.json` : une recette de dessin par fiche du catalogue (`catalogue/catalogue.json`, 509 fiches, liste des id dans `ids.tsv`).
- `bouquets_XX.json` : une recette de recréation par bouquet de référence (`Composition reference/*.jpg` + annotations `etude_compositions/annotations/lot*.json`).

Unités : centimètres réels. Angles en degrés, mesurés depuis l'axe de la fleur (0 = pétale dressé dans l'axe / fleur fermée, 90 = pétale à plat, >90 = pétale réfléchi vers l'arrière). Couleurs en hexadécimal `#rrggbb`. Ne pas inventer de clés hors de ce document.

---

## 1. Recette de fleur

```json
{
  "id": "rose-standard",
  "a": "double",
  "cm": 7,
  "stem": {"cm": 60, "w": 5, "col": "#4f7a34", "leaf": "compound"},
  "cols": ["#c8102e", "#f4d2bd", "#ffffff"],
  "c2": "#e8c040",
  "p": { "n": 45, "w": 0.6, "tip": "round", "a0out": 60, "a1out": 100, "a0in": 10, "a1in": -10, "cup": -0.6 },
  "price": 60
}
```

| clé | sens |
|---|---|
| `id` | id exact de la fiche du catalogue |
| `a` | archétype (liste ci-dessous) |
| `cm` | taille réelle : diamètre de la tête (radial, double, cup, star, globe, protea, exotic, fleur d'orchidée), longueur de la spathe, longueur de la partie fleurie d'un épi, longueur d'une feuille/fronde, longueur d'une retombée, longueur d'une ligne |
| `stem` | tige : `cm` longueur coupée typique (30–90), `w` épaisseur en mm (2–15), `col` couleur, `leaf` feuilles portées : `none`, `lanceolate`, `ovate`, `cordate`, `compound` (rose), `grass`, `needle`, `palmate`, `lobed`, `whorl` (lys) |
| `cols` | 1 à 6 couleurs principales des variétés vendues (la première = couleur par défaut), tirées du champ `couleurs` |
| `c2` | couleur secondaire facultative : cœur, disque, œil, spadice, labelle, étamines, baies |
| `p` | paramètres de l'archétype (facultatifs, valeurs par défaut sensées) |
| `price` | prix de la variété en centimes : commune 20–40, rare 50–90, précieuse 100–160, légendaire 200–300 (d'après `rarete_jeu` et `gamme_prix`) |

### Archétypes et paramètres `p`

- **`radial`** — fleur simple à couronne de pétales + cœur (marguerite, cosmos, anémone, gerbera, tournesol, échinacée, rudbeckia, zinnia simple, hellébore ouvert, aster simple, ostéospermum, pavot ouvert à plat) : `n` pétales (5–40), `w` largeur/longueur (0.1–0.7), `tip` (`round`|`point`|`notch`|`fringe`|`teeth`), `a0`,`a1` (ouverture base/pointe, ex. 75→95 marguerite plate, 40→65 coupe ouverte), `cup` (−0.8…0.3, négatif = pétale creux), `layers` (1–3 rangs), `disc` `{ "r": 0.1–0.5 du rayon, "h": hauteur du dôme 0–0.6 (0.6 = cône d'échinacée), "type": "flat|dome|cone|eye|stamens|none", "col": "#hex" }`.
- **`double`** — fleur pleine à nombreux pétales (rose, pivoine, renoncule, dahlia, œillet, chrysanthème, camélia, gardénia, lisianthus, tulipe double, zinnia double, rose d'Inde, aster double, tagète) : `n` (20–120), `w` (0.2–0.9), `tip`, `a0out`,`a1out` (pétales extérieurs), `a0in`,`a1in` (pétales intérieurs, petits ou négatifs = refermés sur le cœur), `cup` (−1…0), `fan` (0, ou 6–12 = bord large frangé comme l'œillet), `ruf` (ondulation 0–0.25), `quill` (0/1 : pétales roulés en tube, chrysanthème araignée, dahlia cactus), `center` (`closed`|`eye`|`button`|`disc`), `eye` `"#hex"`.
- **`cup`** — quelques larges pétales en coupe (tulipe, pavot, crocus, hellébore, magnolia, lotus, nénuphar, pivoine simple, renoncule simple, fritillaire en clochette avec `nod`) : `n` (4–9), `w` (0.4–0.8), `a0`,`a1`, `cup`, `open` (0–1), `center` (`stamens`|`pistil`|`dark`|`none`), `nod` (0/1 tête penchée).
- **`star`** — tépales en étoile ou trompette (lys, amaryllis, alstroemère, gloriosa, nérine, agapanthe, hémérocalle, clématite, hibiscus, narcisse, freesia, tubéreuse, eucharis, ornithogale, tulipe étoilée) : `n` (5–8), `w`, `a0`,`a1` (lys 28→115 réfléchi, trompette 15→45, clématite 85→95), `ruf`, `spots` (`"#hex"` ou null), `corona` `{ "cm", "w", "col" }` (narcisse), `stamens` (0–12), `anther` `"#hex"`, `cluster` (1 = une tête ; 3–9 = plusieurs têtes au sommet de la tige : alstroemère, amaryllis, agapanthe en grappe lâche), `nod` (0/1).
- **`spathe`** — `kind` : `anthurium`|`calla`|`peace` (spathiphyllum)|`arum`.
- **`orchid`** — `kind` : `phal`|`cymb`|`dend`|`onc`|`vanda`|`catt`|`paph`|`mokara`|`ascocenda`, `spray` (fleurs par tige 1–15), `lip` `"#hex"`, `spots` (`"#hex"` ou null), `veins` (0/1).
- **`spike`** — fleurons le long d'un axe (delphinium, pied-d'alouette, muflier, giroflée, glaïeul, digitale, lupin, véronique, sauge, lavande, liatris, érémurus, jacinthe, muscari, astilbe, célosie plume, kniphofia, molucelle, tubéreuse en épi, campanule) : `n` fleurons (8–80), `fl` fleuron `{ "a": "radial|bell|tube|lip|star|ball|cup", "cm", "n" }`, `taper` (0–1), `buds` (boutons fermés au sommet), `dense` (0–1), `side` (0 = tout autour, 1 = d'un seul côté comme le glaïeul).
- **`globe`** — fleurons sur sphère, dôme ou ombelle plate (allium, agapanthe en boule, hortensia, viorne boule-de-neige, ammi, achillée, orpin, craspedia, échinops, gomphréna, astrance, panicaut, trachélium, aneth) : `shape` (`sphere`|`dome`|`flat`|`ball`), `n` (20–300), `fl` `{ "a": "star|radial|cup|dot|spike", "cm", "n" }`, `bracts` `{ "n", "cm", "col" }` (collerette du panicaut, de l'astrance), `rays` (0/1 rayons d'ombelle visibles).
- **`spray`** — tige ramifiée de petites fleurs (gypsophile, statice, solidago, waxflower, rose branchue, santini, matricaire, aster, phlox, lilas, pois de senteur, freesia en grappe, stéphanotis, bouvardia) : `branches` (2–12), `n` (10–200), `fl` `{ "a": "radial|double|cup|dot|star|pea|tube|bell", "cm", "n" }`, `shape` (`airy`|`panicle`|`corymb`|`raceme`), `len` (cm).
- **`drape`** — retombant (amarante queue-de-renard, héliconia pendant, passiflore, jasmin, smilax, lierre, collier de perles, fille de l'air) : `type` (`chenille`|`vine`|`beads`|`moss`), `len` (cm), `leaf` (forme des feuilles de liane), `fl` (fleurs portées, facultatif).
- **`line`** — tiges utilisées comme lignes (herbe d'ours, steel grass, lily grass, roseau, saule, cornouiller, bouleau, noisetier tortueux, branches fleuries cerisier/pommier/magnolia/forsythia/cognassier, pampa, phalaris, sétaire, blé, millet, lagurus) : `type` (`grass`|`loop`|`branch`|`twig`|`curly`|`plume`|`seedhead`|`blossom`), `len` (cm), `col` (couleur de la tige/branche), `fl` (fleurs portées `{ "a": "cup|radial|star", "cm", "n" }`), `berries` `{ "n", "cm", "col" }`, `leaves` `{ "shape", "cm", "n" }`.
- **`protea`** — `kind` : `king`|`queen`|`pin` (leucospermum)|`leucadendron`|`banksia`|`serruria`|`brunia`|`berzelia`.
- **`exotic`** — `kind` : `strelitzia`|`heliconia-erect`|`heliconia-hanging`|`ginger`|`torch-ginger`|`lotus-pod`|`cotton`|`pineapple`|`kangaroo-paw`.
- **`foliage`** — feuilles et tiges feuillues (monstera, palmier en éventail ou penné, aspidistra, eucalyptus rond/à graines/baby blue/parvifolia, ruscus, salal, pittosporum, fougères, asparagus plumosus/setaceus, capillaire, lierre, magnolia feuille, cotinus, physocarpus, caladium, croton, calathéa, philodendron, alocasia, bananier, olivier, myrte, buis, pistachier, camélia feuille, cordyline, dracaena, phormium, galax, hosta) : `leaf` `{ "shape": "lanceolate|ovate|cordate|round|elliptic|palmate|pinnate|fan|strap|needle|lobed|split|feathery", "cm": longueur de feuille, "w": largeur/longueur, "teeth": 0/1, "gloss": 0–1, "var": "#hex" panachure ou null, "c2": "#hex" revers ou nervures }`, `arr` (`single`|`alternate`|`opposite`|`whorl`|`rosette`|`frond`|`clustered`), `n` (feuilles par tige 1–40), `len` (cm de la tige feuillue).
- **`berries`** — baies et fruits (millepertuis, houx, symphorine, viorne en baies, cynorhodon, faux-poivrier, troène, callicarpa, cotonéaster, piment ornemental, physalis, grenade, figue, kumquat, litchi, coton) : `type` (`cluster`|`umbel`|`spike`|`single`|`lantern`|`pod`), `n` (3–60), `cm` (diamètre d'une baie/fruit), `gloss` (0–1), `leaves` `{ "shape", "cm", "n" }`.
- **`accessory`** — matières (fil d'aluminium, plume, strass, papier, ruban) : `kind` (`wire`|`feather`|`pearls`|`paper`|`ribbon`).
- **`custom`** — une espèce déjà dessinée à la main dans l'app ; à utiliser quand la fiche correspond exactement : `fn` parmi `xAnth`, `xCalla`, `xPhalCluster`, `xCymbCluster`, `xRose`, `xRanunc`, `xDahlia`, `xCarn`, `xMum`, `xNerine`, `xGlor`, `xPea`, `xScab`, `xLily`, `xDelph`, `xAllium`, `amaranthPlant`, `tulip`, `peony`, `anemone`, `cosmos`, `hydrangea`, `sunflower`, `strelitzia`, `cattleya`, `paphio`, `oncidium` (les autres clés de `p` sont alors ignorées, sauf `cols`, `c2`, `cm`, `stem`, `price`).

---

## 2. Recette de bouquet de référence

```json
{
  "ref": "014bdcb3de295e5762ec91fe006534e6.jpg",
  "n": 1,
  "nom": "Brasier d'automne",
  "occ": ["anniv", "bravo"],
  "tpl": "libre",
  "asp": 1.1,
  "vase": "noue",
  "vcol": "#c6b8ab",
  "bg": "#e9e2d8",
  "plinth": "none",
  "side": -1,
  "els": [
    {"id": "anthurium", "col": "#e08a6a", "n": 5, "role": "focal", "pos": "core", "h": 0.6, "ang": "mixed"},
    {"id": "amarante-queue-de-renard", "col": "#a8324e", "n": 4, "role": "drape", "pos": "right", "h": 0, "ang": "side"}
  ],
  "notes": "Masse dense sur la droite, amarantes en cascade, branches de baies qui s'échappent vers le haut."
}
```

| clé | sens |
|---|---|
| `ref`, `n` | fichier image et numéro de l'annotation |
| `nom` | nom poétique français, 2 à 4 mots, sans nom de fleuriste ni de marque |
| `occ` | 1 à 3 occasions parmi `amour`, `anniv`, `merci`, `bravo`, `courage`, `juste` |
| `tpl` | silhouette : `eventail`, `libre`, `triangle`, `cascade`, `dome`, `vertical`, `lcroissant` |
| `asp` | largeur/hauteur de la masse (0.6–1.6) |
| `vase` | contenant le plus proche parmi : `coupe-blanche`, `coupe-noire`, `boule-chocolat`, `boule-sapin`, `verre`, `calice`, `balustre`, `urne`, `cobalt`, `jarre`, `soliflore`, `kenzan`, `noue` (bouquet tenu/lié, ruban), `papier` (emballé) |
| `vcol` | couleur réelle du contenant (ou du ruban / papier) |
| `bg` | ton du fond de la photo (mur) |
| `plinth` | `beton`, `blanc`, `noir`, `bois` ou `none` |
| `side` | côté où penche la masse : −1 gauche, 1 droite |
| `els` | tous les éléments visibles, du plus important au plus discret |
| `notes` | une phrase sur ce qui fait le bouquet |

Élément : `id` = id exact d'une fiche du catalogue (voir `ids.tsv` ; prendre la plus proche si l'espèce exacte manque), `col` = couleur observée, `n` = nombre de tiges visibles estimé, `role` (`focal`|`second`|`filler`|`line`|`drape`|`foliage`|`accent`), `pos` (`core`|`left`|`right`|`top`|`bottom`|`rim`|`around`), `h` hauteur relative dans la silhouette (0 = au ras du col, 1 = sommet), `ang` (`face`|`tq`|`side`|`mixed`).
