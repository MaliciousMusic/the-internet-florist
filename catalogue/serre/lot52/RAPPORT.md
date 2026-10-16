# Lot 52 — Protéacées 2 (agent proteas2)

Fichier : `s52a.js`, préfixe `l52` / `L52_`. Le lot réutilise tel quel le moteur du lot 16 (`s16a.js`) : `protGrow`/`protAlong` (tige ligneuse poussée par le L-système, feuilles en spirale à 137,5°, rameaux latéraux), `protLeaf`, `protLig`, `protDome`, `protBody`, `protZ`. **Aucun module moteur n'est modifié.**

Ajouts propres au lot :
- `l52Leaf` : une feuille coriace dont la marge est découpée en dents (une encoche, puis une dent penchée vers l'apex). La découpe va de la dent de scie peu profonde jusqu'au lobe qui descend à la nervure. Le contour est pris rang par rang sur les points extrêmes, comme dans `protLeaf`, si bien que les dents se resserrent quand on voit la feuille de profil.
- `l52Cup` : la coupe générique d'une protée. Elle prend des rangs de bractées paramétrés (longueur bouton → ouvert, ouverture à la base et à la pointe, « oreilles »), le réceptacle et le dôme. Option `gloss` : un reflet sur chaque bractée.
- `l52BankHead` : l'épi des banksias.

## Par espèce
| sid | fait | coloris (CWS) | tailles (SZG, cm) |
|---|---|---|---|
| `banksia` | Épi de révolution (cylindre, tambour ou globe selon l'espèce). Les fleurs sont réparties en rangs réguliers le long du profil, d'un pôle à l'autre, donc les deux bouts sont garnis, et en colonnes proportionnelles au tour de l'épi : droites chez coccinea (les bandes verticales), en légère spirale chez les autres. Fermées, leurs styles font un crochet ; elles s'ouvrent de bas en haut (style droit et présentateur de pollen). Le bout reste laineux chez prionotes et hookeriana (l'aspect « gland »). L'épi suit la ligne de la tige et ne se tourne que partiellement vers la face demandée (`tk`). Feuilles dentées propres à chaque espèce. | Rouge écarlate (B. coccinea), Orange gland (B. prionotes), Jaune-vert (B. baxteri), Orange et crème (B. hookeriana), Crème jaune (B. speciosa), Bordeaux et or (B. menziesii) | 9, 10, 12, 12, 14 (plus grande dimension de l'épi) |
| `protea-eximia` | Bractées en cuillère, larges, étalées en coupe ouverte ; les plus longues forment des oreilles sur deux côtés. Dôme haut, pourpre foncé, à pointes presque noires, avec un anneau de styles à l'ouverture. Feuilles sessiles ovales-cordées, glauques, bordées de pourpre. | Rose saumoné, Rose carmin, Rose tendre, Rouge (Fiery Duchess), Corail | 9, 10, 11, 12, 14 |
| `protea-magnifica` | Grande coupe de longues bractées dressées et incurvées, crème à carmin, frangées de poils blancs (avec les poils eux-mêmes en DET 2). Dôme large et aplati, noir velouté sur une couronne laineuse blanche. Feuilles oblongues, sessiles, gris-bleu, bordées de rouge. | Crème, Vert pâle, Rose pâle, Rose, Carmin | 12, 14, 16, 18, 20 |
| `protea-neriifolia` | Coupe allongée ; les bractées intérieures s'incurvent à la pointe, qui porte une barbe noire (ou blanche) dense. Rangs moyens soyeux, dôme caché. Feuilles étroites et oblongues, serrées le long de la tige. | Rose à barbe noire (Pink Mink), Rose foncé à barbe noire, Blanc à barbe noire (White Mink), Vert crème à barbe noire, Rose à barbe blanche, Saumon à barbe noire | 9, 10, 11, 12, 13 |
| `protea-repens` | Entonnoir de bractées lisses et glabres, avec un reflet collant et brillant ; fermé en bouton, puis la lèvre s'évase. Fleurons crème dans l'entonnoir, rameaux latéraux en bouton. Feuilles linéaires, vert vif, dressées. | Rouge, Rose, Crème à pointes rouges, Blanc crème, Rose pâle | 7, 8, 9, 10, 12 |

GHI : banksia `sphere` 2,5 ; eximia `disque` 2,5 ; magnifica `disque` 3 ; neriifolia `cornet` 2,5 ; repens `cornet` 2. Les 5 espèces sont dans `GH_BUDS`.

### Notes botaniques
- **Banksia.** L'inflorescence est un épi de centaines à milliers de fleurs groupées par paires, en rangs serrés autour d'un axe ligneux. Le style reste pris dans le limbe du périanthe et se courbe en crochet jusqu'à l'anthèse, puis se libère. Selon l'espèce :
  - *coccinea* : épi court et large (4–8 × 8–10 cm), périanthes gris et styles écarlates en colonnes verticales ; feuilles obovales tronquées (3–9 cm), dentées, au revers blanchâtre ;
  - *prionotes* : épi cylindrique de 8–15 cm, orange en bas et laineux blanc en haut (« acorn banksia ») ; feuilles linéaires de 15–27 cm, à dents triangulaires ;
  - *baxteri* : épi globuleux jaune-vert de 8–9 cm ; feuilles découpées en lobes triangulaires jusqu'à la nervure ;
  - *hookeriana* : épi orange à bout crème ;
  - *speciosa* : épi crème-jaune de 12–15 cm ; feuilles longues à lobes triangulaires ;
  - *menziesii* : épi bordeaux et or.
- **P. eximia** : capitule de 9–14 cm ; bractées intérieures spatulées, rose saumoné à rouge, étalées ; fleurons à pointes pourpre noir ; feuilles cordées et embrassantes, glauques à bord pourpre. « Fiery Duchess » (eximia × susannae) est la forme rouge du commerce.
- **P. magnifica** (reine, syn. *barbigera*) : capitule de 12–20 cm, bractées crème, vert pâle, rose ou carmin, frangées de poils soyeux ; dôme de fleurons laineux blancs à pointes noires ; feuilles oblongues gris-bleu à bord rouge.
- **P. neriifolia** : capitule oblong de 9–13 × 5–8 cm ; bractées incurvées à barbe noire, ou blanche selon les sélections (Pink Mink, White Mink) ; feuilles de 10–18 × 1,5–2,5 cm.
- **P. repens** (sugarbush) : capitule en entonnoir de 9–12 cm ; bractées glabres, visqueuses et brillantes, rouges, roses ou crème (souvent à pointes rouges) ; feuilles linéaires de 5–15 cm.

## QA
- **Composés** avec `inc=` les 5 sids, `n=20` : graine 5, graine 3 et graine 11 donnent **0 F, 0 U, 0 kink**.
- **Captures regardées** : bouquets de la graine 3 (8 bouquets) et de la graine 7, plus `sheets/bouquets.png` (graine 3).
- **Modèles** : `models_of.py` ne renvoie aucun modèle (aucun des 76 modèles n'utilise ces espèces), donc pas de QA de modèles.
- **Perf** (`perf=1`, 76 modèles) :
  - avec le lot : 175 ms et 8 431 éléments ;
  - sans le lot (même machine) : 186 ms et 8 431 éléments.

  Rien n'a changé. Les temps sont ceux de la machine cloud, plus lente que la référence d'environ 142 ms.
- **Éléments SVG à DET 1** (moyenne sur 6 coloris, plante entière tige et feuilles comprises) :

  | espèce | tête | plante |
  |---|---|---|
  | banksia | 10 | 73 |
  | eximia | 76 | 148 |
  | magnifica | 92 | 139 |
  | neriifolia | 89 | 180 |
  | repens | 68 | 180 |

  Les fleurs des banksias tiennent dans quelques chemins seulement.

## Doutes
- **Banksia, épi tourné vers l'œil.** L'épi ne fait que s'incliner vers la face demandée. En vue de face, on voit donc surtout son flanc, ou son sommet chez coccinea et baxteri.
- **Duchesse, ombres.** Pour un rose saumoné très saturé, la palette du moteur (`shd`) fonce les ombres vers le rouge ; le lot éclaircit ses bractées (`lift`). Une bractée vue tout à fait de champ peut encore paraître rouge vif.
- **Reine en bouton.** Le bouton est déjà gros et peu pointu : un bouton en artichaut plus fermé serait plus juste.
- **Données du catalogue.** Les recettes de `k0.js` (cm et cols) sont reprises telles quelles. Les coloris viennent de `CWS`.
