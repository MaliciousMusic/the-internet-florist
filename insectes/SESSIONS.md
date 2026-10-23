# Sessions parallèles du chantier insectes

Demande du porteur, le 2026-10-23 : finir complètement le machaon, animation comprise, le faire valider, puis lancer une
sous-session numérotée par insecte. La méthode est celle du machaon (`machaon/ETAT.md`, PROTOCOLE §1 à §7, avec §3.4 à §3.6).

| n° | espèce | module | refcache | port de démo |
|---|---|---|---|---|
| 00 | machaon (pilote) | `machaon/` | `papilio-machaon` | 8812 |
| 01 | abeille domestique, ouvrière | `abeille/` | `apis-mellifera` | 8821 |
| 02 | bourdon terrestre | `bourdon/` | `bombus-terrestris` | 8822 |
| 03 | coccinelle à sept points | `coccinelle/` | `coccinella-7` | 8823 |
| 04 | cétoine dorée | `cetoine/` | `cetonia-aurata` | 8824 |
| 05 | fourmi noire des jardins | `fourmi-noire/` | `lasius-niger` | 8825 |
| 06 | fourmi rouge (Myrmica rubra, proposée) | `fourmi-rouge/` | `myrmica-rubra` | 8826 |
| 07 | moro-sphinx | `moro-sphinx/` | `macroglossum` | 8827 |
| 08 | paon-du-jour | `paon-du-jour/` | `aglais-io` | 8828 |
| 09 | grande sauterelle verte | `sauterelle/` | `tettigonia-viridissima` | 8829 |

## Règles communes

### Branche, photos et outils
- Chaque session a sa branche `ch/insectes-NN-<id>`, partie de `ch/insectes-suite` au commit du machaon (8f0bc99), dans son
  dossier `flower-atelier/ch/insectes-NN-<id>`. Elle ne touche que son module, ses outils propres et sa fiche. Elle committe sur
  sa branche, ne pousse rien et ne fusionne rien : la session coordinatrice intègre.
- Son serveur de démo tourne sur le port de la table, déclaré dans le `.claude/launch.json` de son dossier.
- Les photos de référence restent hors de git. Elles sont dans
  `C:/Users/agent/Desktop/flower/flower-atelier/ch/insectes-suite/refcache/`, partagé, et chaque session n'écrit que dans le dossier
  de son espèce.
- Dans le worktree, deux jonctions :
  - `mklink /J refcache <ce chemin>` ;
  - `mklink /J insectes\outils\node_modules` vers celui de `ch/insectes-suite`.
  Les modèles SAM et Depth Anything sont dans `C:/Users/agent/Desktop/flower/flower-atelier/vases5/.venv-depth`.

### Le PC du porteur
- Il a déjà planté. On garde plus de 4 Go de RAM libre.
- Un seul modèle à la fois pour tout le chantier : SAM ou profondeur passent par `GATE_MAX=1 sh ws/gate.sh <commande>`.
- Une cuisson d'atlas ou un rendu resvg lourd passe par `sh ws/gate.sh <commande>` (3 au plus).
- `node --max-old-space-size=900` pour les cuissons.

### Le moteur partagé
`moteur/insecte.mjs`, `moteur/motif.mjs`, `moteur/papillon.mjs`, `moteur/fourmi.mjs`, `runtime/essaim.mjs`, `runtime/vue.mjs`,
`runtime/papillon.mjs` et `demo/demo.mjs` sont partagés. Une session n'y fait que des ajouts derrière une clé nouvelle, sans
changer le rendu des autres espèces. Le machaon reste identique au pixel : trois cellules rendues avant et après le prouvent.
Les sessions 05 et 06 partagent `moteur/fourmi.mjs` ; chacune y ajoute derrière ses propres clés. Tout changement commun
s'écrit dans l'ETAT, pour l'intégration.

### Sortie d'une espèce (PROTOCOLE §7)
- Photos HD par organe : la tête et l'œil, les antennes, les pièces buccales, le thorax, l'abdomen dessus, dessous et profil, les
  pattes, et les ailes ou élytres dessus et dessous.
- Grilles 72 × 18 mesurées.
- Motifs relevés en chiffres : `aile.py` pour les ailes. Pour les élytres et les taches, la même méthode est à adapter.
- Organes groupés pour l'animation.
- Paires photo | rendu sur toutes les vues.
- Planche d'animation.
- Comportement runtime avec ses chiffres sourcés (`COMPORTEMENT.md`).
- Atlas recuit et pesé.
- Entrée dans la démo.
- `ETAT.md` avec ses résidus.
- Un juge neuf sur les paires.
- La session s'arrête sur une image pour le porteur. Elle ne passe pas à une autre espèce.
