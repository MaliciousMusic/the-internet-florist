# Facture en tokens : tulipe-simple

Fenêtre 2026-10-08T11:50:49 → 2026-10-09T00:35:14 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 6 | 335 k | 9 k | 0 | 1 (0.04 M) | 0.26 M | 1 % |
| general-purpose : Références tulipe simple | haiku | 26 | 105 k | 16 k | 41 | 0 (0.00 M) | 0.12 M | 0 % |
| general-purpose : Coloris tulipe simple | haiku | 39 | 126 k | 10 k | 7 | 2 (0.00 M) | 0.16 M | 0 % |
| orchestrateur · 2-modelage | opus | 12 | 350 k | 14 k | 0 | 0 (0.00 M) | 0.51 M | 1 % |
| general-purpose : Modelage tulipe simple | opus | 161 | 304 k | 52 k | 31 | 5 (0.17 M) | 6.09 M | 13 % |
| orchestrateur · 3-avis | opus | 9 | 371 k | 12 k | 2 | 0 (0.00 M) | 0.41 M | 1 % |
| orchestrateur · 4-retouche-v2 | opus | 22 | 401 k | 35 k | 0 | 1 (0.04 M) | 1.10 M | 2 % |
| orchestrateur · 5-avis-v2 | opus | 2 | 427 k | 1 k | 1 | 0 (0.00 M) | 0.09 M | 0 % |
| orchestrateur · 6-qa | opus | 477 | 330 k | 551 k | 190 | 11 (0.48 M) | 20.63 M | 44 % |
| general-purpose : QA tulipe simple | haiku | 27 | 73 k | 4 k | 0 | 1 (0.00 M) | 0.06 M | 0 % |
| general-purpose : tulipe-simple : photos de fané sombre | haiku | 49 | 99 k | 13 k | 21 | 0 (0.00 M) | 0.14 M | 0 % |
| general-purpose : tulipe-simple : modelage (fané et rtest) | opus | 94 | 149 k | 19 k | 3 | 1 (0.02 M) | 1.72 M | 4 % |
| orchestrateur · fane-rtest | opus | 347 | 365 k | 434 k | 43 | 11 (0.52 M) | 15.71 M | 33 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 11:50:56 → 12:03:17 | 12 min 21 s | — | — | — | — |
| general-purpose : Références tulipe simple | 11:51:17 → 12:01:45 | 10 min 28 s | — | — | — | — |
| general-purpose : Coloris tulipe simple | 11:51:17 → 12:03:04 | 11 min 47 s | — | — | — | — |
| orchestrateur · 2-modelage | 12:03:36 → 12:34:29 | 30 min 53 s | 20 / 52 % | 5.9 Go | 5 / 25 % | 9 |
| general-purpose : Modelage tulipe simple | 12:03:51 → 13:07:58 | 64 min 07 s | 18 / 54 % | 5.6 Go | 5 / 43 % | 9 |
| orchestrateur · 3-avis | 12:34:35 → 12:51:13 | 16 min 38 s | 10 / 34 % | 6.0 Go | 2 / 18 % | 0 |
| orchestrateur · 4-retouche-v2 | 12:51:29 → 13:08:14 | 16 min 45 s | 23 / 54 % | 5.6 Go | 8 / 43 % | 1 |
| orchestrateur · 5-avis-v2 | 13:08:20 → 13:08:31 | 0 min 11 s | 28 / 28 % | 8.5 Go | 11 / 11 % | 0 |
| orchestrateur · 6-qa | 13:08:35 → 22:49:04 | 580 min 29 s | 42 / 100 % | 1.5 Go | 9 / 55 % | 3 |
| general-purpose : QA tulipe simple | 13:08:40 → 13:12:33 | 3 min 53 s | 35 / 97 % | 6.9 Go | 7 / 13 % | 1 |
| general-purpose : tulipe-simple : photos de fané sombre | 22:25:44 → 22:43:40 | 17 min 56 s | 70 / 100 % | 3.4 Go | 20 / 55 % | 3 |
| general-purpose : tulipe-simple : modelage (fané et rtest) | 22:51:28 → 23:08:10 | 16 min 42 s | 54 / 100 % | 3.2 Go | 10 / 45 % | 3 |
| orchestrateur · fane-rtest | 22:53:19 → 00:35:06 | 101 min 47 s | 54 / 100 % | 3.2 Go | 8 / 63 % | 3 |

Durée totale : 764 min. Somme des durées des groupes : 884 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 425 | 15.33 M | 33 % | 16 appels, 0.61 M |
| réponse | 147 | 6.19 M | 13 % | 1 appels, 0.03 M |
| navigateur | 117 | 4.67 M | 10 % | 6 appels, 0.26 M |
| image | 119 | 4.28 M | 9 % | 1 appels, 0.04 M |
| orchestration | 67 | 3.03 M | 6 % | 1 appels, 0.04 M |
| édition code | 47 | 2.16 M | 5 % | 3 appels, 0.15 M |
| git | 54 | 2.16 M | 5 % | 2 appels, 0.09 M |
| rendu | 56 | 2.07 M | 4 % | 0 appels, 0.00 M |
| build | 41 | 1.62 M | 3 % | 1 appels, 0.02 M |
| qa | 34 | 1.15 M | 2 % | 0 appels, 0.00 M |
| bill | 19 | 0.80 M | 2 % | 0 appels, 0.00 M |
| lecture code | 27 | 0.75 M | 2 % | 2 appels, 0.03 M |
| SendUserFile | 14 | 0.69 M | 1 % | 0 appels, 0.00 M |
| AskUserQuestion | 11 | 0.54 M | 1 % | 0 appels, 0.00 M |
| web | 24 | 0.42 M | 1 % | 0 appels, 0.00 M |
| get_usage | 9 | 0.38 M | 1 % | 0 appels, 0.00 M |
| mesure | 18 | 0.22 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 23 | 0.21 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 8 | 0.15 M | 0 % | 0 appels, 0.00 M |
| SubagentHandback | 7 | 0.14 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| spawn_task | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| dismiss_task | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 47.00 M**, dont 33 appels de retouche après erreur (1.28 M, 3 %).
