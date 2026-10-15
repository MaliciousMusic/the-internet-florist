# Facture en tokens : tulipe-perroquet

Fenêtre 2026-10-08T13:19:10 → 2026-10-09T00:36:34 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : tulipe-perroquet : photos | haiku | 99 | 162 k | 27 k | 24 | 6 (0.02 M) | 0.58 M | 1 % |
| general-purpose : tulipe-perroquet : recensement | sonnet | 227 | 390 k | 74 k | 17 | 6 (0.16 M) | 5.99 M | 11 % |
| orchestrateur · 1-refs | opus | 20 | 468 k | 18 k | 0 | 0 (0.00 M) | 1.08 M | 2 % |
| general-purpose : tulipe-perroquet : coloris | haiku | 79 | 225 k | 49 k | 66 | 8 (0.06 M) | 0.48 M | 1 % |
| orchestrateur · 2-coloris | opus | 30 | 319 k | 56 k | 0 | 0 (0.00 M) | 1.35 M | 2 % |
| general-purpose : tulipe-perroquet : modelage | opus | 133 | 264 k | 39 k | 30 | 0 (0.00 M) | 4.11 M | 7 % |
| orchestrateur · 3-modelage | opus | 34 | 369 k | 54 k | 0 | 1 (0.06 M) | 1.60 M | 3 % |
| orchestrateur · 4-qa | opus | 80 | 496 k | 100 k | 1 | 0 (0.00 M) | 4.60 M | 8 % |
| general-purpose : tulipe-perroquet : contrôle qualité | haiku | 29 | 79 k | 5 k | 0 | 1 (0.00 M) | 0.06 M | 0 % |
| general-purpose : tulipe-perroquet : marques déposées | sonnet | 129 | 222 k | 41 k | 0 | 11 (0.16 M) | 2.06 M | 4 % |
| orchestrateur · 5-kavb-fusion | opus | 19 | 640 k | 13 k | 0 | 3 (0.21 M) | 1.30 M | 2 % |
| general-purpose : tulipe-perroquet : recensement fusion KAVB | sonnet | 49 | 177 k | 28 k | 9 | 2 (0.05 M) | 0.77 M | 1 % |
| general-purpose : tulipe-perroquet : finition | sonnet | 130 | 259 k | 38 k | 6 | 3 (0.08 M) | 2.39 M | 4 % |
| orchestrateur · 6-finition | opus | 11 | 658 k | 14 k | 3 | 0 (0.00 M) | 1.51 M | 3 % |
| general-purpose : tulipe-perroquet : photos d'organes | haiku | 22 | 93 k | 6 k | 6 | 1 (0.00 M) | 0.07 M | 0 % |
| orchestrateur · 7-plante-sourcing | opus | 39 | 181 k | 55 k | 185 | 1 (0.06 M) | 1.41 M | 3 % |
| general-purpose : tulipe-perroquet : plante v2 | opus | 112 | 202 k | 24 k | 15 | 2 (0.04 M) | 2.68 M | 5 % |
| orchestrateur · 8-plante-v2 | opus | 162 | 207 k | 167 k | 0 | 5 (0.12 M) | 4.59 M | 8 % |
| orchestrateur · 9-niveaux-stricts | opus | 414 | 355 k | 483 k | 44 | 12 (0.55 M) | 18.08 M | 33 % |
| general-purpose : tulipe-perroquet : niveaux de preuve stricts | sonnet | 43 | 148 k | 19 k | 0 | 1 (0.01 M) | 0.59 M | 1 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : tulipe-perroquet : photos | 13:19:27 → 15:06:22 | 106 min 55 s | 33 / 100 % | 2.9 Go | 7 / 28 % | 1 |
| general-purpose : tulipe-perroquet : recensement | 13:19:29 → 14:38:01 | 78 min 32 s | 30 / 100 % | 2.9 Go | 7 / 28 % | 1 |
| orchestrateur · 1-refs | 13:44:05 → 14:38:36 | 54 min 31 s | 33 / 100 % | 2.9 Go | 7 / 28 % | 1 |
| general-purpose : tulipe-perroquet : coloris | 14:38:47 → 14:53:30 | 14 min 43 s | 42 / 80 % | 4.9 Go | 9 / 20 % | 1 |
| orchestrateur · 2-coloris | 14:38:47 → 14:55:50 | 17 min 03 s | 40 / 80 % | 4.9 Go | 8 / 20 % | 1 |
| general-purpose : tulipe-perroquet : modelage | 14:56:23 → 15:39:41 | 43 min 18 s | 33 / 97 % | 4.0 Go | 4 / 33 % | 2 |
| orchestrateur · 3-modelage | 14:59:12 → 15:47:40 | 48 min 28 s | 32 / 97 % | 3.9 Go | 4 / 33 % | 2 |
| orchestrateur · 4-qa | 15:47:45 → 17:12:57 | 85 min 12 s | 34 / 93 % | 1.5 Go | 6 / 48 % | 2 |
| general-purpose : tulipe-perroquet : contrôle qualité | 15:47:45 → 15:56:02 | 8 min 17 s | 48 / 90 % | 3.7 Go | 9 / 28 % | 2 |
| general-purpose : tulipe-perroquet : marques déposées | 15:57:46 → 16:33:47 | 36 min 01 s | 37 / 93 % | 3.2 Go | 7 / 25 % | 2 |
| orchestrateur · 5-kavb-fusion | 17:13:16 → 17:24:07 | 10 min 51 s | 31 / 57 % | 5.0 Go | 8 / 19 % | 2 |
| general-purpose : tulipe-perroquet : recensement fusion KAVB | 17:13:39 → 17:26:40 | 13 min 01 s | 29 / 57 % | 5.0 Go | 7 / 19 % | 2 |
| general-purpose : tulipe-perroquet : finition | 17:40:28 → 18:26:21 | 45 min 53 s | 38 / 82 % | 4.1 Go | 8 / 35 % | 2 |
| orchestrateur · 6-finition | 18:45:05 → 18:50:24 | 5 min 19 s | 28 / 74 % | 5.4 Go | 8 / 15 % | 1 |
| general-purpose : tulipe-perroquet : photos d'organes | 19:11:24 → 19:19:23 | 7 min 59 s | 36 / 61 % | 3.1 Go | 7 / 33 % | 1 |
| orchestrateur · 7-plante-sourcing | 19:13:58 → 19:29:49 | 15 min 51 s | 36 / 87 % | 3.1 Go | 8 / 33 % | 1 |
| general-purpose : tulipe-perroquet : plante v2 | 19:32:45 → 20:00:42 | 27 min 57 s | 45 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| orchestrateur · 8-plante-v2 | 19:32:53 → 22:02:40 | 149 min 47 s | 52 / 100 % | 1.9 Go | 9 / 43 % | 3 |
| orchestrateur · 9-niveaux-stricts | 22:03:26 → 00:36:30 | 153 min 04 s | 58 / 100 % | 3.1 Go | 12 / 63 % | 3 |
| general-purpose : tulipe-perroquet : niveaux de preuve stricts | 22:23:28 → 22:31:52 | 8 min 24 s | 69 / 100 % | 4.7 Go | 22 / 34 % | 2 |

Durée totale : 677 min. Somme des durées des groupes : 931 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 951 | 25.46 M | 46 % | 36 appels, 0.79 M |
| réponse | 140 | 5.60 M | 10 % | 1 appels, 0.03 M |
| navigateur | 120 | 4.85 M | 9 % | 7 appels, 0.30 M |
| image | 131 | 3.47 M | 6 % | 0 appels, 0.00 M |
| orchestration | 59 | 2.62 M | 5 % | 0 appels, 0.00 M |
| git | 60 | 2.19 M | 4 % | 2 appels, 0.09 M |
| rendu | 67 | 1.93 M | 3 % | 0 appels, 0.00 M |
| édition code | 54 | 1.92 M | 3 % | 9 appels, 0.28 M |
| build | 41 | 1.56 M | 3 % | 0 appels, 0.00 M |
| qa | 25 | 1.02 M | 2 % | 0 appels, 0.00 M |
| web | 54 | 1.00 M | 2 % | 3 appels, 0.05 M |
| lecture code | 35 | 0.72 M | 1 % | 1 appels, 0.01 M |
| AskUserQuestion | 11 | 0.54 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 10 | 0.50 M | 1 % | 0 appels, 0.00 M |
| get_usage | 11 | 0.44 M | 1 % | 0 appels, 0.00 M |
| bill | 11 | 0.43 M | 1 % | 0 appels, 0.00 M |
| wikimedia | 34 | 0.28 M | 1 % | 3 appels, 0.01 M |
| SubagentHandback | 12 | 0.27 M | 0 % | 0 appels, 0.00 M |
| mesure | 15 | 0.26 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 9 | 0.18 M | 0 % | 1 appels, 0.00 M |
| Monitor | 9 | 0.04 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |

**Total : 55.32 M**, dont 63 appels de retouche après erreur (1.56 M, 3 %).
