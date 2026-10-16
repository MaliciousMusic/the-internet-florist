# Lot 44 — feuillages 7 (`s44a.js`, préfixe `l44` / `L44_`)

Cinq espèces poussées par le L-système, au contrat des feuillages (`{k, bw, bw1, bc, neck, nd}`, épine du Composer, `fgAxis`, `g35Run` pour des planches stables).
- Les tiges feuillées (arroche, grevillea) passent par `fgGrow` (lot 24), avec des feuilles `g35Leaf` (lot 35).
- Pour le reste, un petit grower, `l44Main`, fait suivre exactement son chemin à l'axe principal : épine, arc ou hélice. Les règles propres à chaque espèce font pousser rameaux, pousses, pennes et grappes.
- Les nervures sont rééchantillonnées (`l44V`) pour suivre la nappe 3D au lieu de la couper en corde. Le côté de la nervure médiane des moitiés de limbe est dense (`L44_MID`).
- Aucun moteur modifié : pas de diff moteur.

## Espèces
**palm-spear-seche** — jeune feuille de palmier en éventail (Chamaerops, Trachycarpus), séchée.
- Morphologie : n+1 côtes, alternativement hautes (nervures des segments, qui finissent en pointe) et basses (plis, plus courts à l'ouverture).
- Fermée, c'est une lance au plissé profond, qui garde la vraie largeur du limbe replié. Ouverte, c'est un éventail étroit (≈ 46°) aux segments séparés en pointe.
- Stades : lance fermée (bouton), lance qui se desserre (mi-ouvert), éventail (ouvert). En bouquet, l'appli ne passe pas de stade aux feuillages : la forme y est tirée au hasard (45 % fermée).
- Coloris : naturel paille, blanchi, noir, bleu, bordeaux, doré, rouille, rose poudré, vert sauge. Le pétiole est teint avec la lance.
- Tailles : lance de 25, 30, 40 et 50 cm. La tige mesure ≈ 1,55 × la lance.

**dracaena-sanderiana-lucky-bamboo** — canne verte lisse.
- Morphologie : un nœud tous les ≈ 5,6 cm (anneau pâle bordé de la cicatrice), sommet coupé et ciré.
- Une ou deux pousses partent des derniers nœuds, chacune avec 4 à 6 feuilles lancéolées en spirale serrée : brillantes, un peu tordues, engainantes.
- Stades : les jeunes feuilles des pousses sont roulées, puis étalées.
- Coloris : vert, doré (canne jaune), panaché crème « Ribbon » (marge crème), vert en spirale, doré en spirale. La spirale est une hélice de ≈ 3,3 cm de rayon, au pas de ≈ 14 cm.
- Tailles : feuille de 14, 20 et 26 cm, soit des cannes de 35 à 65 cm.

**adiantum-capillaire** (A. raddianum).
- Morphologie : stipe et rachis d'un noir brillant (un seul ruban avec son reflet). Limbe deltoïde 2-pennatifide, aux pennes alternes, les plus basses ramifiées.
- Les pinnules sont en éventail, cunéiformes, au bord externe lobé. Chacune est inclinée hors du plan de la fronde, d'où sa lisibilité de profil. Elles tiennent sur un pétiolule noir (trait ≥ 1,1).
- Les sores sont en croissants sous les lobes (planches).
- Légèreté : les pinnules sont groupées par bandes de profondeur et par ton. Une fronde fait **13 éléments**.
- Coloris : vert tendre, vert franc, vert profond (Fritz Luth), jeunes frondes rosées.
- Tailles : fronde de 25, 35 et 45 cm.

**atriplex-hortensis-arroche**.
- Morphologie : tige dressée teintée, feuilles alternes longuement pétiolées. Le limbe est triangulaire à hasté, plus étroit vers le haut, farineux dessous.
- Sommet : panicule d'épis, avec des épis à l'aisselle des feuilles du haut. Les fruits sont des paires de bractéoles rondes et papyracées (disques ≈ 1,1 cm), posées contre l'axe.
- Tous les disques d'une tige sont regroupés en 2 ou 3 lots.
- Stades : jeunes épis à petits disques verdâtres, puis épis pleins.
- Coloris : rouge pourpre (Rubra), pourpre noir (Purple Plume), rouge vif (Red Plume), vert (type ; c'est la couleur de son modèle), vert doré (Gold).
- Tailles : feuille de 7, 10 et 13 cm, sur des tiges de 50 à 90 cm.

**grevillea-feuillage**.
- Morphologie : rameaux bruns soyeux, feuilles alternes pennatifides en peigne. Les lobes étroits et pointus sont alternes sur les deux côtés.
- Dessus vert, revers soyeux argenté ou roux : chaque moitié de limbe montre la face qu'elle tourne vers l'œil.
- Formes :
  - 'Ivanhoe' : lobes larges, jeunes pousses bronze-rouge ;
  - 'Moonlight' : lobes linéaires gris-vert, revers argent ;
  - robusta : lobes recoupés, revers doré.
- Coloris : vert profond (Ivanhoe), pousses bronze (Ivanhoe), gris-vert argenté (Moonlight), vert à revers doré (robusta).
- Tailles : référence de feuille de 12, 15, 18 et 22 cm. Elle est modulée par forme : Ivanhoe ≈ 0,65 ×, Moonlight ≈ 0,9 ×.

`GHI` :
- la lance et la canne sont des « lignes » rigides (`tip:1`) ;
- les trois autres sont des feuillages (`k:'plant'`), avec leur `fx` propre.

## QA
- **Planches** regardées en grand et zoomées : 9 vues × 3 stades, coloris, tailles. Les livrables sont dans `sheets/`, avec `cartes_composer.png` et `bouquets.png`.
- **Bouquets composés** (`inc=` les 5 espèces, 20 bouquets par graine) :
  - graines 11, 17, 23 et 29 : **0 F, 0 U, 0 kink** ;
  - graine 5 : 1 U sur une garniture `sanguisorbe` du moteur, sous un lobe du vase cœur. Elle ne vient pas de ce lot, et aucune de mes espèces n'est en défaut.
- **Modèles** 7, 11, 34, 49 et 60 : 0 F, 0 U, 0 kink.
- **Corrections faites pendant la QA** :
  - la feuille de grevillea commençait à 7 % de sa longueur, sans pétiole au DET 1, ce qui donnait 1 F. Elle part maintenant de la tige ;
  - la feuille du bambou part de sa pousse ;
  - les nervures en corde sont supprimées.
- **Perf** (même machine) : 171 ms et 8 723 éléments, contre 173 ms et 8 738 éléments pour la base sans le lot. Le lot est neutre.
- **Éléments par tige au DET 1** (épine de bouquet, moyenne et maximum) :

| Espèce | Moyenne | Maximum |
|---|---|---|
| Lance de palmier | 23 | 25 |
| Bambou | 83 | 130 |
| Capillaire | 13 | 13 |
| Arroche | 95 | 131 |
| Grevillea | 91 | 164 |

## Doutes
- En bouquet, la lance de palmier ne reçoit pas de stade (contrainte du moteur). Fermée et ouverte sont tirées au hasard.
- La plus longue tige de grevillea, avec ses rameaux, dépasse un peu 150 éléments.
- La planche `_vues` en 1100×900 coupe le bas de la 3ᵉ rangée de stades : c'est le format imposé par le brief.
