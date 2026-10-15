# Facture en tokens : narcisse-trompette

Fenêtre 2026-10-08T16:07:35 → 2026-10-09T00:36:42 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : narcisse-trompette : recensement inventaire | sonnet | 46 | 115 k | 26 k | 0 | 4 (0.07 M) | 0.51 M | 1 % |
| orchestrateur · 1-recensement | opus | 30 | 500 k | 40 k | 0 | 0 (0.00 M) | 1.76 M | 4 % |
| general-purpose : narcisse-trompette : photos | haiku | 26 | 84 k | 7 k | 13 | 1 (0.00 M) | 0.08 M | 0 % |
| orchestrateur · 2-refs | opus | 23 | 491 k | 26 k | 0 | 0 (0.00 M) | 1.30 M | 3 % |
| general-purpose : narcisse-trompette : preuves lot 1 | haiku | 18 | 99 k | 13 k | 0 | 4 (0.02 M) | 0.07 M | 0 % |
| orchestrateur · 3-preuves | opus | 19 | 640 k | 13 k | 0 | 3 (0.21 M) | 1.30 M | 3 % |
| general-purpose : narcisse-trompette : preuves lot 2 | haiku | 12 | 86 k | 8 k | 0 | 2 (0.01 M) | 0.05 M | 0 % |
| general-purpose : narcisse-trompette : photos complément | haiku | 26 | 92 k | 8 k | 4 | 3 (0.01 M) | 0.08 M | 0 % |
| general-purpose : narcisse-trompette : modelage | opus | 99 | 213 k | 26 k | 9 | 2 (0.05 M) | 2.59 M | 6 % |
| general-purpose : narcisse-trompette : preuves lot 3 | haiku | 12 | 82 k | 5 k | 0 | 4 (0.01 M) | 0.04 M | 0 % |
| general-purpose : narcisse-trompette : modelage relais 1 | opus | 92 | 160 k | 20 k | 17 | 1 (0.03 M) | 1.84 M | 4 % |
| orchestrateur · 4b-modelage-relais1 | opus | 11 | 658 k | 14 k | 3 | 0 (0.00 M) | 1.51 M | 4 % |
| orchestrateur · 5-qa-plante-sourcing | opus | 39 | 181 k | 55 k | 185 | 1 (0.06 M) | 1.41 M | 3 % |
| general-purpose : narcisse-trompette : photos d'organes | haiku | 17 | 82 k | 4 k | 7 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : narcisse-trompette : recensement fusion | sonnet | 51 | 139 k | 24 k | 2 | 4 (0.06 M) | 0.79 M | 2 % |
| orchestrateur · 6-organes-fusion | opus | 37 | 182 k | 28 k | 0 | 2 (0.04 M) | 0.87 M | 2 % |
| general-purpose : narcisse-trompette : coloris | haiku | 27 | 99 k | 13 k | 2 | 2 (0.01 M) | 0.10 M | 0 % |
| general-purpose : narcisse-trompette : plante v2 | opus | 136 | 212 k | 31 k | 20 | 3 (0.06 M) | 3.36 M | 8 % |
| orchestrateur · 7-plante-v2-coloris | opus | 27 | 173 k | 33 k | 0 | 0 (0.00 M) | 0.77 M | 2 % |
| general-purpose : narcisse-trompette : finition | sonnet | 101 | 175 k | 20 k | 10 | 3 (0.03 M) | 2.26 M | 5 % |
| orchestrateur · 8-finition | opus | 162 | 250 k | 151 k | 1 | 4 (0.12 M) | 5.12 M | 12 % |
| orchestrateur · 9-qa | opus | 351 | 368 k | 439 k | 44 | 11 (0.52 M) | 15.98 M | 38 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : narcisse-trompette : recensement inventaire | 16:07:39 → 16:30:08 | 22 min 29 s | 37 / 83 % | 3.2 Go | 8 / 25 % | 2 |
| orchestrateur · 1-recensement | 16:07:47 → 16:34:29 | 26 min 42 s | 36 / 83 % | 3.2 Go | 8 / 25 % | 2 |
| general-purpose : narcisse-trompette : photos | 16:37:43 → 17:01:58 | 24 min 15 s | 26 / 76 % | 3.7 Go | 3 / 14 % | 1 |
| orchestrateur · 2-refs | 16:40:06 → 17:12:57 | 32 min 51 s | 26 / 85 % | 1.5 Go | 4 / 48 % | 2 |
| general-purpose : narcisse-trompette : preuves lot 1 | 17:02:29 → 17:05:24 | 2 min 55 s | 20 / 37 % | 1.5 Go | 0 / 0 % | 1 |
| orchestrateur · 3-preuves | 17:13:16 → 17:24:07 | 10 min 51 s | 31 / 57 % | 5.0 Go | 8 / 19 % | 2 |
| general-purpose : narcisse-trompette : preuves lot 2 | 17:13:37 → 17:16:12 | 2 min 35 s | 33 / 48 % | 6.3 Go | 7 / 12 % | 0 |
| general-purpose : narcisse-trompette : photos complément | 17:40:26 → 17:46:20 | 5 min 54 s | 30 / 65 % | 6.8 Go | 8 / 11 % | 1 |
| general-purpose : narcisse-trompette : modelage | 17:40:27 → 18:08:46 | 28 min 19 s | 38 / 82 % | 4.9 Go | 8 / 26 % | 2 |
| general-purpose : narcisse-trompette : preuves lot 3 | 18:27:25 → 18:28:44 | 1 min 19 s | 39 / 56 % | 5.9 Go | 21 / 52 % | 1 |
| general-purpose : narcisse-trompette : modelage relais 1 | 18:27:26 → 18:44:35 | 17 min 09 s | 39 / 96 % | 3.7 Go | 7 / 52 % | 3 |
| orchestrateur · 4b-modelage-relais1 | 18:45:05 → 18:50:24 | 5 min 19 s | 28 / 74 % | 5.4 Go | 8 / 15 % | 1 |
| orchestrateur · 5-qa-plante-sourcing | 19:13:58 → 19:29:49 | 15 min 51 s | 36 / 87 % | 3.1 Go | 8 / 33 % | 1 |
| general-purpose : narcisse-trompette : photos d'organes | 19:32:44 → 19:37:13 | 4 min 29 s | 42 / 80 % | 4.2 Go | 4 / 5 % | 1 |
| general-purpose : narcisse-trompette : recensement fusion | 19:32:46 → 20:09:12 | 36 min 26 s | 46 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| orchestrateur · 6-organes-fusion | 19:32:53 → 20:08:25 | 35 min 32 s | 46 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| general-purpose : narcisse-trompette : coloris | 20:10:13 → 20:14:39 | 4 min 26 s | 44 / 88 % | 3.5 Go | 2 / 12 % | 2 |
| general-purpose : narcisse-trompette : plante v2 | 20:10:15 → 20:38:35 | 28 min 20 s | 47 / 94 % | 2.9 Go | 9 / 43 % | 2 |
| orchestrateur · 7-plante-v2-coloris | 20:13:58 → 20:36:45 | 22 min 47 s | 47 / 94 % | 2.9 Go | 10 / 43 % | 2 |
| general-purpose : narcisse-trompette : finition | 20:39:51 → 22:02:44 | 82 min 53 s | 59 / 100 % | 1.9 Go | 10 / 40 % | 3 |
| orchestrateur · 8-finition | 20:41:14 → 22:49:04 | 127 min 50 s | 63 / 100 % | 1.9 Go | 15 / 55 % | 3 |
| orchestrateur · 9-qa | 22:53:19 → 00:36:37 | 103 min 18 s | 54 / 100 % | 3.2 Go | 8 / 63 % | 3 |

Durée totale : 509 min. Somme des durées des groupes : 642 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 618 | 17.29 M | 41 % | 34 appels, 0.69 M |
| navigateur | 116 | 4.61 M | 11 % | 7 appels, 0.30 M |
| image | 128 | 3.48 M | 8 % | 0 appels, 0.00 M |
| réponse | 90 | 3.41 M | 8 % | 1 appels, 0.03 M |
| orchestration | 51 | 2.10 M | 5 % | 0 appels, 0.00 M |
| rendu | 58 | 2.06 M | 5 % | 0 appels, 0.00 M |
| build | 39 | 1.60 M | 4 % | 0 appels, 0.00 M |
| édition code | 41 | 1.51 M | 4 % | 6 appels, 0.20 M |
| git | 40 | 1.47 M | 4 % | 1 appels, 0.04 M |
| qa | 20 | 1.01 M | 2 % | 0 appels, 0.00 M |
| lecture code | 33 | 0.73 M | 2 % | 1 appels, 0.03 M |
| SendUserFile | 11 | 0.54 M | 1 % | 0 appels, 0.00 M |
| AskUserQuestion | 8 | 0.36 M | 1 % | 0 appels, 0.00 M |
| web | 30 | 0.34 M | 1 % | 3 appels, 0.01 M |
| bill | 9 | 0.32 M | 1 % | 0 appels, 0.00 M |
| mesure | 20 | 0.31 M | 1 % | 0 appels, 0.00 M |
| get_usage | 6 | 0.21 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 13 | 0.18 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 24 | 0.17 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 4 | 0.08 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Monitor | 1 | 0.01 M | 0 % | 1 appels, 0.01 M |

**Total : 41.83 M**, dont 54 appels de retouche après erreur (1.31 M, 3 %).
