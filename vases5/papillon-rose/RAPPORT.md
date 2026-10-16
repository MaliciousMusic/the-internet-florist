# Papillon rose à deux crosses (réf. 026) : rapport

## État à la pause (16 octobre 2026)

1. **Où j'en suis.** La copie mesurée est en place, sur décision du porteur : silhouette, lèvres, fente, crosses et papillon relevés sur la photo (`trace.py` → `traces.json`), lumière de la photo ajustée par moindres carrés (`relight.py`) et albédos calés par peinture (`calib.py`). Le SVG est écrit en bandes de ton, une région par peinture (`svgout.py`). La vue boutique, la planche et le rapport complet restent à faire.
2. **Derniers chiffres de `mesure.py cmp`** (SVG à une région par peinture, rendu par Chrome, cadrage de la photo) : IoU 0,968 ; ΔE2000 adouci 6,8 (ombre 7,2, demi-teinte 6,1, lumière 7,2) ; SSIM adoucie 0,816 ; arêtes 0,56 / 0,35 ; SVG photo de 564 Ko, 173 bandes. Sur le champ calculé (avant SVG) : IoU 0,971, ΔE 6,6, SSIM adoucie 0,80. Seuils encore non atteints : IoU (0,97), ΔE ≤ 4 et arêtes ≥ 0,75.
3. **Les plus gros écarts, par peinture :** le mauve de la résille (ΔE 10), les lèvres mauves (8,6), l'orangé (8,3), le pied (7,2), le haut du col et les crosses (lignes 40 à 360 de la photo, trop sombres de 7 à 20 en L). Le pied (y > 920) est trop clair : sur la photo il s'enfonce dans le tissu.
4. **Fichiers clés** : `geom.py` (modèle mesuré), `bfly.py` (papillon tracé), `mk.py` (échantillonnage, occlusion, lumière, `prev` / `photo` / `shop`), `svgout.py`, `trace.py`, `relight.py`, `calib.py`, `traces.json`, `calib.json`, `light_photo.json` ; diagnostics dans `work/` (`dediag.py`, `mesure_cmp.jpg`). La commande lancée avant la pause est terminée (chiffres ci-dessus) ; rien ne tourne.
5. **Prochaine étape** : reprendre la largeur et la teinte des lèvres et de la résille, éclaircir le haut du col et recaler les crosses (de 3 à 5 px trop hautes). Enfin, rendre `mk.py shop` (body.json, fiche.json), faire la planche avec les chiffres et compléter ce rapport.

*(Le rapport complet suivra cette section.)*
