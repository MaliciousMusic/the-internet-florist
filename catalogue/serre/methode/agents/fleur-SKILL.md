---
name: fleur
description: Runs the token-lean flower method of Belai's Flowers for one species or a lot of up to 5 (refs and colourways on Haiku, modelling on Opus in a fresh context, QA on Haiku, the bill measured). Use when the user asks to redo or finish a flower species in SVG at the anemone's level, or types /fleur <sid...>.
---
# /fleur <sid> [<sid>…] : une espèce au niveau de l'anémone, au moindre coût en tokens

Lots de 5 espèces au plus, chacune finie avant la suivante. Réponds en français. Méthode complète :
`C:/Users/agent/Desktop/flower/flower-atelier/catalogue/serre/methode/METHODE.md`.
Atelier : `SP=C:/Users/agent/Desktop/flower/flower-atelier`.

## Pourquoi cette méthode
- **Ce que coûtait l'anémone.** 312 appels sur un contexte moyen de 486 000 tokens, soit 18,9 millions de tokens « équivalent entrée Opus » (`fleur/bill.py`). Les relectures du contexte en faisaient 80 %.
- **D'où viennent les économies.**
  - Contexte : la session qui orchestre reste courte, et le gros du travail se fait dans des sous-agents au contexte neuf.
  - Appels : une seule commande par tour de rendu.
  - Modèles : Haiku pour les tâches mécaniques.
  - Écriture : une fiche de paramètres pour le moteur `svBloom` plutôt que du code neuf.
- **Cible :** 2 à 3 millions de tokens « équivalent entrée Opus » par espèce.

## Déroulé, pour chaque espèce
Au début de chaque étape, l'orchestrateur la marque : `python $SP/fleur/bill.py step <sid> <n-nom>` (`1-refs`, `2-modelage`, `3-avis`, `4-qa`,
`5-fin`). Les sous-agents sont comptés à part, chacun d'après son journal.
1. `python $SP/fleur/bill.py mark <sid> start`. Vérifie que le serveur de l'atelier tourne (`preview_start atelier`), ainsi que `bronze/recv.py`.
2. Sourcing, selon `docs/STANDARD-SOURCES.md`. Lance en parallèle, en arrière-plan :
   - `fleur-recensement` (Sonnet) : taxonomie, inventaire des cultivars, preuves du nom, photos nommées, niveau de preuve, couverture, puis
     `catalogue/serre/sources/<sid>.json` ;
   - `fleur-refs` (Haiku) : photos de forme, de stades et d'organes de la sorte.
   Quand le recensement est rendu, lance `fleur-coloris` (Haiku), qui mesure les photos qu'il désigne.
   Avant la production, revérifie toi-même 10 % des coloris sur leurs sources. Seuls les niveaux A et B entrent en boutique.
3. Lance `fleur-modeleur` (premier plan) avec :
   - sid, nom latin, genre ;
   - les chemins des deux briefs ;
   - l'organe à ajouter au kit s'il manque (voir METHODE, « Kit par famille ») ;
   - les critiques connues du porteur.
   Il rend 15 lignes et des planches.
4. Montre au porteur une planche, `img.py small` (1 000 px). Une seule image dans ce contexte.
   S'il a des critiques, transmets-les au même modeleur avec SendMessage : il garde son contexte, ne relance pas un agent neuf.
5. Lance `fleur-qa` avec le sid et deux coloris. S'il répond ROUGE, renvoie la cause au modeleur.
6. Fin :
   - `sh $SP/sync_demo.sh` ;
   - commit dans `C:/Users/agent/Desktop/flower/flower-atelier` (main) : uniquement `demo/` et les fichiers de l'espèce, jamais `git add -A` ; ajoute la ligne « Co-Authored-By » demandée ;
   - push ;
   - `python $SP/fleur/refs.py clean <sid>` ;
   - `bill.py mark <sid> end` puis `bill.py report <sid>` ;
   - compte rendu au porteur : planche, coloris, facture en tokens, défauts restants, questions.

## Règles permanentes
- **Rendu :** SVG seulement, aucune 3D ni image incorporée. Pas de rubans ni de nœuds.
- **Photos de tiers :** jamais dans un dépôt.
- **Ressources du PC :** une tâche lourde à la fois, 3 Chrome sans fenêtre au plus. Contrôle qualité sous `ws/qawatch.sh`, par lots de 4 ou 10 selon la mémoire libre.
- **Port :** jamais le 8766.
- **Vocabulaire du jeu** partout.
- **Décisions :** une décision qui n'est pas la tienne s'écrit comme une question dans le compte rendu.
- **Le contexte de cette session est une dépense.** Pas de relecture de gros fichiers ici, pas d'image en double ; ce que les sous-agents ont lu reste chez eux.
