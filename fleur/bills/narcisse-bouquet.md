# Facture en tokens : narcisse-bouquet

Fenêtre 2026-10-08T18:26:52 → 2026-10-09T00:36:45 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : narcisse-bouquet : recensement inventaire | sonnet | 74 | 159 k | 33 k | 0 | 3 (0.04 M) | 1.14 M | 3 % |
| orchestrateur · 1-recensement | opus | 114 | 226 k | 130 k | 188 | 3 (0.10 M) | 4.57 M | 13 % |
| general-purpose : narcisse-bouquet : preuves lot 1 | haiku | 17 | 92 k | 11 k | 0 | 3 (0.01 M) | 0.07 M | 0 % |
| general-purpose : narcisse-bouquet : photos | haiku | 26 | 75 k | 4 k | 0 | 5 (0.01 M) | 0.07 M | 0 % |
| orchestrateur · 2-refs-preuves | opus | 98 | 225 k | 106 k | 0 | 3 (0.09 M) | 2.95 M | 8 % |
| orchestrateur · 2b-refs-retry-preuves2 | opus | 16 | 270 k | 12 k | 0 | 1 (0.03 M) | 0.51 M | 1 % |
| general-purpose : narcisse-bouquet : photos reprise | haiku | 28 | 77 k | 6 k | 4 | 0 (0.00 M) | 0.07 M | 0 % |
| general-purpose : narcisse-bouquet : preuves lot 2 | haiku | 15 | 78 k | 6 k | 0 | 3 (0.01 M) | 0.04 M | 0 % |
| general-purpose : narcisse-bouquet : recensement fusion | sonnet | 45 | 128 k | 28 k | 4 | 5 (0.08 M) | 0.57 M | 2 % |
| orchestrateur · 3-fusion | opus | 48 | 293 k | 34 k | 1 | 0 (0.00 M) | 1.65 M | 5 % |
| general-purpose : narcisse-bouquet : coloris | haiku | 20 | 77 k | 5 k | 1 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : narcisse-bouquet : photos complément | haiku | 19 | 75 k | 6 k | 1 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : narcisse-bouquet : modelage | opus | 135 | 213 k | 28 k | 16 | 0 (0.00 M) | 3.37 M | 10 % |
| orchestrateur · 4-modelage-coloris-refs2 | opus | 143 | 290 k | 132 k | 9 | 3 (0.07 M) | 5.16 M | 15 % |
| orchestrateur · 5-modelage-relais1 | opus | 77 | 300 k | 125 k | 23 | 3 (0.17 M) | 3.15 M | 9 % |
| general-purpose : narcisse-bouquet : modelage relais 1 | opus | 104 | 159 k | 21 k | 16 | 1 (0.01 M) | 1.98 M | 6 % |
| general-purpose : narcisse-bouquet : finition | sonnet | 72 | 149 k | 18 k | 5 | 1 (0.01 M) | 0.84 M | 2 % |
| orchestrateur · 6-finition | opus | 58 | 437 k | 76 k | 7 | 2 (0.10 M) | 3.05 M | 9 % |
| general-purpose : narcisse-bouquet : correctif contrôle qualité | opus | 57 | 128 k | 10 k | 4 | 0 (0.00 M) | 0.92 M | 3 % |
| orchestrateur · 7-correctif-qa | opus | 73 | 538 k | 106 k | 5 | 3 (0.17 M) | 4.62 M | 13 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : narcisse-bouquet : recensement inventaire | 18:27:27 → 19:10:00 | 42 min 33 s | 34 / 96 % | 3.7 Go | 7 / 52 % | 3 |
| orchestrateur · 1-recensement | 18:45:05 → 20:36:45 | 111 min 40 s | 40 / 100 % | 2.9 Go | 8 / 43 % | 2 |
| general-purpose : narcisse-bouquet : preuves lot 1 | 20:39:49 → 20:43:06 | 3 min 17 s | 60 / 90 % | 3.8 Go | 10 / 12 % | 1 |
| general-purpose : narcisse-bouquet : photos | 20:39:50 → 20:52:53 | 13 min 03 s | 58 / 100 % | 2.1 Go | 10 / 36 % | 2 |
| orchestrateur · 2-refs-preuves | 20:41:14 → 22:02:40 | 81 min 26 s | 59 / 100 % | 1.9 Go | 10 / 40 % | 3 |
| orchestrateur · 2b-refs-retry-preuves2 | 22:03:26 → 22:13:29 | 10 min 03 s | 71 / 100 % | 3.1 Go | 19 / 29 % | 3 |
| general-purpose : narcisse-bouquet : photos reprise | 22:04:04 → 22:07:51 | 3 min 47 s | 80 / 99 % | 3.1 Go | 20 / 29 % | 3 |
| general-purpose : narcisse-bouquet : preuves lot 2 | 22:04:04 → 22:05:45 | 1 min 41 s | 88 / 99 % | 3.2 Go | 22 / 29 % | 2 |
| general-purpose : narcisse-bouquet : recensement fusion | 22:23:53 → 22:49:56 | 26 min 03 s | 68 / 100 % | 3.4 Go | 19 / 55 % | 3 |
| orchestrateur · 3-fusion | 22:24:54 → 22:49:04 | 24 min 10 s | 68 / 100 % | 3.4 Go | 19 / 55 % | 3 |
| general-purpose : narcisse-bouquet : coloris | 22:51:12 → 22:54:01 | 2 min 49 s | 62 / 87 % | 4.3 Go | 12 / 19 % | 2 |
| general-purpose : narcisse-bouquet : photos complément | 22:51:12 → 22:53:13 | 2 min 01 s | 61 / 87 % | 4.3 Go | 13 / 19 % | 1 |
| general-purpose : narcisse-bouquet : modelage | 22:51:13 → 23:21:26 | 30 min 13 s | 51 / 100 % | 3.2 Go | 9 / 45 % | 3 |
| orchestrateur · 4-modelage-coloris-refs2 | 22:53:19 → 23:23:32 | 30 min 13 s | 50 / 100 % | 3.2 Go | 8 / 45 % | 3 |
| orchestrateur · 5-modelage-relais1 | 23:23:36 → 23:44:49 | 21 min 13 s | 55 / 97 % | 3.3 Go | 8 / 47 % | 3 |
| general-purpose : narcisse-bouquet : modelage relais 1 | 23:23:49 → 23:44:18 | 20 min 29 s | 55 / 97 % | 3.3 Go | 8 / 47 % | 3 |
| general-purpose : narcisse-bouquet : finition | 23:45:05 → 00:00:32 | 15 min 27 s | 63 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| orchestrateur · 6-finition | 23:45:31 → 00:03:44 | 18 min 13 s | 58 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| general-purpose : narcisse-bouquet : correctif contrôle qualité | 00:17:10 → 00:32:40 | 15 min 30 s | 60 / 100 % | 3.4 Go | 12 / 63 % | 3 |
| orchestrateur · 7-correctif-qa | 00:18:41 → 00:36:37 | 17 min 56 s | 61 / 100 % | 3.4 Go | 12 / 63 % | 3 |

Durée totale : 369 min. Somme des durées des groupes : 492 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 592 | 14.93 M | 43 % | 23 appels, 0.43 M |
| navigateur | 115 | 4.53 M | 13 % | 5 appels, 0.19 M |
| réponse | 75 | 2.54 M | 7 % | 1 appels, 0.03 M |
| image | 89 | 2.42 M | 7 % | 0 appels, 0.00 M |
| édition code | 45 | 1.67 M | 5 % | 5 appels, 0.20 M |
| orchestration | 42 | 1.49 M | 4 % | 0 appels, 0.00 M |
| build | 37 | 1.43 M | 4 % | 0 appels, 0.00 M |
| qa | 32 | 1.20 M | 3 % | 0 appels, 0.00 M |
| git | 32 | 1.10 M | 3 % | 1 appels, 0.04 M |
| lecture code | 42 | 0.82 M | 2 % | 1 appels, 0.01 M |
| rendu | 33 | 0.71 M | 2 % | 0 appels, 0.00 M |
| SendUserFile | 9 | 0.40 M | 1 % | 0 appels, 0.00 M |
| bill | 10 | 0.37 M | 1 % | 0 appels, 0.00 M |
| get_usage | 7 | 0.25 M | 1 % | 0 appels, 0.00 M |
| web | 13 | 0.21 M | 1 % | 2 appels, 0.01 M |
| wikimedia | 22 | 0.19 M | 1 % | 0 appels, 0.00 M |
| mesure | 16 | 0.17 M | 0 % | 0 appels, 0.00 M |
| SubagentHandback | 12 | 0.16 M | 0 % | 1 appels, 0.00 M |
| ToolSearch | 7 | 0.11 M | 0 % | 0 appels, 0.00 M |
| AskUserQuestion | 2 | 0.08 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Monitor | 4 | 0.01 M | 0 % | 0 appels, 0.00 M |
| read | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 34.84 M**, dont 39 appels de retouche après erreur (0.92 M, 3 %).
