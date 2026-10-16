# Coque verte (réf. 022) : rapport de chantier

## État à la pause (16 octobre 2026)

1. **Où j'en suis.** La structure est validée par le coordinateur : une seule feuille balayée en volute (`model.py`), le bord en S calé à moins de 1,2 cm. La copie mesurée tourne au cadrage de la photo (`python mk.py photo`). La lumière de la photo est mesurée par régression sur les normales tirées de la profondeur Depth Anything calée en cm (`releve.py`, `releve_feats.py`). Il reste à régler le grain et les arêtes. La vue boutique, la planche et la fin de ce rapport ne sont pas faites.
2. **Derniers chiffres de `mesure.py cmp`** (avec grain) :
   - IoU 0,968. Le plafond est de 0,972, parce que le détourage GrabCut de la photo compte l'ombre sur la table.
   - ΔE lissé 2,70 : ombre 2,53, demi-teinte 2,45, lumière 3,12.
   - SSIM lissée 0,936 ; SSIM brute 0,736, notée sans seuil.
   - Arêtes : précision 0,64, rappel 0,57.
   - Grain (écart log) : flanc éclairé 0,23, plaque 0,26, avant 0,14.
   - Sans grain : SSIM 0,80, arêtes 0,71 / 0,68.
3. **Fichiers clés** :
   - `mk.py` : générateur, avec les modes `photo`, `shop` et `prev` ;
   - `model.py` : la feuille en volute et la plaque ;
   - `releve.py` et `releve_feats.py` : les mesures et le modèle de lumière ;
   - `out/releve.npz` et `out/releve.json` : les mesures, privées ;
   - `work/structure.png` (structure) et `work/mesure_cmp.jpg` (dernière comparaison) ;
   - `work/run.sh` : construit, rend et mesure en une commande.
4. **Prochaine étape** :
   - adoucir les bandes de la plaque, dont les marches font du bruit basse fréquence (filtre `blp`, en cours) ;
   - accorder le spectre du grain à deux échelles (fin et marbrure) ;
   - remonter le rappel des arêtes : liseré clair du flanc du tronc contre la plaque, bord gauche de la silhouette, lèvres ;
   - puis `python mk.py shop` (body.json, fiche.json), planche à 1:1 et 300 % avec les chiffres, et la suite de ce rapport.
5. **Questions ouvertes** :
   - les seuils sur les arêtes (≥ 0,75) et sur le grain (≤ 0,15) se gênent : le grain ajoute des arêtes de Canny absentes de la photo ;
   - la lumière de la vue boutique : celle de la photo (copie) ou la lumière unique de la boutique ?
