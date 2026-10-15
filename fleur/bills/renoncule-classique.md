# Facture en tokens : renoncule-classique

Fenêtre 2026-10-08T13:18:07 → 2026-10-09T00:35:13 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : renoncule-classique : photos | haiku | 89 | 138 k | 29 k | 18 | 4 (0.02 M) | 0.53 M | 1 % |
| general-purpose : renoncule-classique : recensement | sonnet | 276 | 464 k | 126 k | 53 | 12 (0.42 M) | 9.79 M | 16 % |
| orchestrateur · 1-refs | opus | 59 | 393 k | 87 k | 0 | 0 (0.00 M) | 2.94 M | 5 % |
| general-purpose : renoncule-classique : coloris | haiku | 79 | 209 k | 37 k | 14 | 3 (0.02 M) | 0.49 M | 1 % |
| general-purpose : renoncule-classique : modelage | opus | 173 | 380 k | 59 k | 46 | 2 (0.10 M) | 7.47 M | 12 % |
| orchestrateur · 2-modelage | opus | 49 | 427 k | 63 k | 1 | 1 (0.06 M) | 2.50 M | 4 % |
| general-purpose : renoncule-classique : contrôle qualité | haiku | 23 | 69 k | 4 k | 0 | 1 (0.00 M) | 0.05 M | 0 % |
| general-purpose : renoncule-classique : preuves lot 2 | haiku | 25 | 152 k | 13 k | 0 | 0 (0.00 M) | 0.14 M | 0 % |
| general-purpose : renoncule-classique : preuves lot 1 | haiku | 28 | 102 k | 17 k | 0 | 1 (0.00 M) | 0.11 M | 0 % |
| orchestrateur · 4-qa | opus | 18 | 488 k | 31 k | 0 | 0 (0.00 M) | 1.07 M | 2 % |
| general-purpose : renoncule-classique : coloris des références libres | haiku | 17 | 75 k | 2 k | 0 | 2 (0.00 M) | 0.05 M | 0 % |
| general-purpose : renoncule-classique : photos libres des coloris manquants | haiku | 22 | 70 k | 3 k | 5 | 0 (0.00 M) | 0.10 M | 0 % |
| general-purpose : renoncule-classique : modelage (relais 1) | opus | 66 | 136 k | 16 k | 9 | 2 (0.04 M) | 1.19 M | 2 % |
| orchestrateur · 3-relais-forme | opus | 58 | 532 k | 60 k | 0 | 3 (0.21 M) | 3.47 M | 6 % |
| general-purpose : renoncule-classique : coloris des références libres (reprise) | haiku | 12 | 79 k | 4 k | 0 | 2 (0.00 M) | 0.04 M | 0 % |
| general-purpose : renoncule-classique : modelage (relais 2) | opus | 53 | 139 k | 17 k | 7 | 1 (0.02 M) | 1.01 M | 2 % |
| general-purpose : renoncule-classique : modelage (relais 3) | opus | 37 | 95 k | 8 k | 5 | 0 (0.00 M) | 0.49 M | 1 % |
| general-purpose : renoncule-classique : finition | sonnet | 76 | 193 k | 17 k | 9 | 3 (0.04 M) | 1.09 M | 2 % |
| general-purpose : renoncule-classique : contrôle qualité (reprise) | haiku | 19 | 73 k | 3 k | 0 | 0 (0.00 M) | 0.05 M | 0 % |
| orchestrateur · 5-qa2 | opus | 11 | 658 k | 14 k | 3 | 0 (0.00 M) | 1.51 M | 2 % |
| general-purpose : renoncule-classique : photos d'organes | haiku | 24 | 81 k | 5 k | 5 | 3 (0.01 M) | 0.06 M | 0 % |
| general-purpose : renoncule-classique : modelage (relais 4, plante v2) | opus | 101 | 210 k | 27 k | 15 | 1 (0.02 M) | 2.57 M | 4 % |
| orchestrateur · 6-plante-v2 | opus | 121 | 180 k | 141 k | 185 | 3 (0.10 M) | 3.56 M | 6 % |
| general-purpose : renoncule-classique : photos corail | haiku | 17 | 92 k | 7 k | 1 | 1 (0.00 M) | 0.06 M | 0 % |
| orchestrateur · 7-marques-corail | opus | 144 | 258 k | 126 k | 1 | 4 (0.12 M) | 4.61 M | 8 % |
| general-purpose : renoncule-classique : coloris corail (mesure) | haiku | 19 | 83 k | 6 k | 7 | 0 (0.00 M) | 0.06 M | 0 % |
| orchestrateur · 7b-modeleurs-tulipes-attente | opus | 95 | 341 k | 65 k | 5 | 1 (0.04 M) | 3.77 M | 6 % |
| orchestrateur · 8-finition-marques-corail | opus | 108 | 238 k | 170 k | 27 | 4 (0.16 M) | 3.75 M | 6 % |
| general-purpose : renoncule-classique : finition (marques et corail) | sonnet | 51 | 129 k | 13 k | 8 | 0 (0.00 M) | 0.53 M | 1 % |
| orchestrateur · 9-qa | opus | 144 | 477 k | 199 k | 11 | 6 (0.32 M) | 8.19 M | 13 % |
| general-purpose : renoncule-classique : qa | haiku | 22 | 71 k | 5 k | 0 | 1 (0.00 M) | 0.05 M | 0 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : renoncule-classique : photos | 13:18:27 → 15:25:50 | 127 min 23 s | 32 / 100 % | 2.9 Go | 6 / 33 % | 1 |
| general-purpose : renoncule-classique : recensement | 13:18:27 → 16:04:01 | 165 min 34 s | 34 / 100 % | 2.9 Go | 6 / 33 % | 2 |
| orchestrateur · 1-refs | 13:18:52 → 15:08:38 | 109 min 46 s | 33 / 100 % | 2.9 Go | 7 / 28 % | 1 |
| general-purpose : renoncule-classique : coloris | 13:44:40 → 14:10:42 | 26 min 02 s | 30 / 65 % | 5.6 Go | 8 / 28 % | 1 |
| general-purpose : renoncule-classique : modelage | 15:09:01 → 16:03:26 | 54 min 25 s | 36 / 90 % | 3.7 Go | 5 / 33 % | 2 |
| orchestrateur · 2-modelage | 15:09:09 → 16:01:02 | 51 min 53 s | 36 / 90 % | 3.7 Go | 5 / 33 % | 2 |
| general-purpose : renoncule-classique : contrôle qualité | 16:03:41 → 16:09:41 | 6 min 00 s | 41 / 93 % | 4.7 Go | 7 / 18 % | 2 |
| general-purpose : renoncule-classique : preuves lot 2 | 16:04:24 → 16:15:08 | 10 min 44 s | 44 / 93 % | 4.5 Go | 7 / 18 % | 2 |
| general-purpose : renoncule-classique : preuves lot 1 | 16:04:24 → 16:10:55 | 6 min 31 s | 46 / 93 % | 4.7 Go | 7 / 18 % | 2 |
| orchestrateur · 4-qa | 16:04:34 → 16:14:49 | 10 min 15 s | 45 / 93 % | 4.5 Go | 7 / 18 % | 2 |
| general-purpose : renoncule-classique : coloris des références libres | 16:20:10 → 16:22:48 | 2 min 38 s | 36 / 62 % | 3.2 Go | 7 / 25 % | 0 |
| general-purpose : renoncule-classique : photos libres des coloris manquants | 16:20:10 → 17:03:30 | 43 min 20 s | 27 / 76 % | 3.2 Go | 5 / 25 % | 1 |
| general-purpose : renoncule-classique : modelage (relais 1) | 16:20:10 → 16:35:34 | 15 min 24 s | 29 / 71 % | 3.2 Go | 8 / 25 % | 0 |
| orchestrateur · 3-relais-forme | 16:21:42 → 17:24:07 | 62 min 25 s | 29 / 85 % | 1.5 Go | 6 / 48 % | 2 |
| general-purpose : renoncule-classique : coloris des références libres (reprise) | 17:05:18 → 17:07:00 | 1 min 42 s | 35 / 73 % | 6.7 Go | 0 / 0 % | 2 |
| general-purpose : renoncule-classique : modelage (relais 2) | 17:05:20 → 17:18:57 | 13 min 37 s | 36 / 85 % | 4.7 Go | 8 / 48 % | 2 |
| general-purpose : renoncule-classique : modelage (relais 3) | 18:07:13 → 18:14:04 | 6 min 51 s | 48 / 76 % | 4.1 Go | 8 / 24 % | 2 |
| general-purpose : renoncule-classique : finition | 18:23:17 → 18:34:59 | 11 min 42 s | 34 / 69 % | 4.8 Go | 12 / 52 % | 1 |
| general-purpose : renoncule-classique : contrôle qualité (reprise) | 18:36:10 → 18:43:45 | 7 min 35 s | 49 / 96 % | 3.7 Go | 4 / 11 % | 3 |
| orchestrateur · 5-qa2 | 18:45:05 → 18:50:24 | 5 min 19 s | 28 / 74 % | 5.4 Go | 8 / 15 % | 1 |
| general-purpose : renoncule-classique : photos d'organes | 18:52:16 → 18:57:29 | 5 min 13 s | 30 / 65 % | 4.4 Go | 9 / 30 % | 0 |
| general-purpose : renoncule-classique : modelage (relais 4, plante v2) | 19:08:21 → 19:37:39 | 29 min 18 s | 38 / 87 % | 3.1 Go | 7 / 33 % | 1 |
| orchestrateur · 6-plante-v2 | 19:13:58 → 20:44:15 | 90 min 17 s | 44 / 100 % | 2.9 Go | 8 / 43 % | 2 |
| general-purpose : renoncule-classique : photos corail | 20:47:18 → 20:52:47 | 5 min 29 s | 70 / 100 % | 2.1 Go | 13 / 36 % | 1 |
| orchestrateur · 7-marques-corail | 20:48:13 → 22:49:04 | 120 min 51 s | 64 / 100 % | 1.9 Go | 16 / 55 % | 3 |
| general-purpose : renoncule-classique : coloris corail (mesure) | 20:53:11 → 20:56:40 | 3 min 29 s | 46 / 66 % | 3.4 Go | 10 / 27 % | 1 |
| orchestrateur · 7b-modeleurs-tulipes-attente | 22:53:19 → 23:10:58 | 17 min 39 s | 52 / 100 % | 3.2 Go | 9 / 45 % | 3 |
| orchestrateur · 8-finition-marques-corail | 23:11:07 → 23:40:43 | 29 min 36 s | 51 / 97 % | 3.4 Go | 8 / 47 % | 3 |
| general-purpose : renoncule-classique : finition (marques et corail) | 23:11:29 → 23:22:23 | 10 min 54 s | 46 / 79 % | 3.4 Go | 7 / 23 % | 2 |
| orchestrateur · 9-qa | 23:41:00 → 00:35:06 | 54 min 06 s | 56 / 100 % | 3.3 Go | 8 / 63 % | 3 |
| general-purpose : renoncule-classique : qa | 23:41:13 → 23:49:44 | 8 min 31 s | 63 / 100 % | 3.3 Go | 8 / 12 % | 3 |

Durée totale : 677 min. Somme des durées des groupes : 1114 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 830 | 23.17 M | 38 % | 32 appels, 0.79 M |
| image | 217 | 6.70 M | 11 % | 0 appels, 0.00 M |
| réponse | 140 | 5.59 M | 9 % | 1 appels, 0.03 M |
| navigateur | 119 | 4.78 M | 8 % | 7 appels, 0.30 M |
| orchestration | 79 | 4.19 M | 7 % | 0 appels, 0.00 M |
| rendu | 106 | 3.26 M | 5 % | 0 appels, 0.00 M |
| édition code | 95 | 2.80 M | 5 % | 9 appels, 0.34 M |
| git | 58 | 2.13 M | 3 % | 2 appels, 0.09 M |
| build | 35 | 1.50 M | 2 % | 0 appels, 0.00 M |
| web | 72 | 1.38 M | 2 % | 0 appels, 0.00 M |
| lecture code | 64 | 1.36 M | 2 % | 5 appels, 0.12 M |
| qa | 43 | 1.06 M | 2 % | 0 appels, 0.00 M |
| AskUserQuestion | 11 | 0.54 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 28 | 0.51 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 10 | 0.50 M | 1 % | 0 appels, 0.00 M |
| bill | 10 | 0.38 M | 1 % | 0 appels, 0.00 M |
| get_usage | 9 | 0.38 M | 1 % | 0 appels, 0.00 M |
| wikimedia | 52 | 0.34 M | 1 % | 3 appels, 0.01 M |
| mesure | 25 | 0.33 M | 1 % | 1 appels, 0.00 M |
| ToolSearch | 19 | 0.29 M | 0 % | 1 appels, 0.01 M |
| Monitor | 11 | 0.07 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| read_widget_context | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 61.28 M**, dont 61 appels de retouche après erreur (1.69 M, 3 %).
