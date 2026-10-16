# Facture en tokens : tulipe-simple

Fenêtre 2026-10-08T11:50:49 → 2026-10-08T13:12:54 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 6 | 335 k | 9 k | 0 | 1 (0.04 M) | 0.26 M | 3 % |
| general-purpose : Références tulipe simple | haiku | 26 | 105 k | 16 k | 41 | 0 (0.00 M) | 0.12 M | 1 % |
| general-purpose : Coloris tulipe simple | haiku | 39 | 126 k | 10 k | 7 | 2 (0.00 M) | 0.16 M | 2 % |
| orchestrateur · 2-modelage | opus | 12 | 350 k | 14 k | 0 | 0 (0.00 M) | 0.51 M | 6 % |
| general-purpose : Modelage tulipe simple | opus | 161 | 304 k | 52 k | 31 | 5 (0.17 M) | 6.09 M | 67 % |
| orchestrateur · 3-avis | opus | 9 | 371 k | 12 k | 2 | 0 (0.00 M) | 0.41 M | 5 % |
| orchestrateur · 4-retouche-v2 | opus | 22 | 401 k | 35 k | 0 | 1 (0.04 M) | 1.10 M | 12 % |
| orchestrateur · 5-avis-v2 | opus | 2 | 427 k | 1 k | 1 | 0 (0.00 M) | 0.09 M | 1 % |
| orchestrateur · 6-qa | opus | 6 | 438 k | 9 k | 0 | 0 (0.00 M) | 0.33 M | 4 % |
| general-purpose : QA tulipe simple | haiku | 27 | 73 k | 4 k | 0 | 1 (0.00 M) | 0.06 M | 1 % |

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
| orchestrateur · 6-qa | 13:08:35 → 13:12:46 | 4 min 11 s | 35 / 97 % | 6.9 Go | 7 / 13 % | 1 |
| general-purpose : QA tulipe simple | 13:08:40 → 13:12:33 | 3 min 53 s | 35 / 97 % | 6.9 Go | 7 / 13 % | 1 |

Durée totale : 82 min. Somme des durées des groupes : 171 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| image | 70 | 2.71 M | 30 % | 1 appels, 0.04 M |
| bash | 90 | 2.00 M | 22 % | 6 appels, 0.15 M |
| rendu | 42 | 1.64 M | 18 % | 0 appels, 0.00 M |
| réponse | 13 | 0.60 M | 7 % | 0 appels, 0.00 M |
| édition code | 10 | 0.43 M | 5 % | 0 appels, 0.00 M |
| orchestration | 8 | 0.39 M | 4 % | 1 appels, 0.04 M |
| bill | 8 | 0.38 M | 4 % | 0 appels, 0.00 M |
| lecture code | 9 | 0.28 M | 3 % | 2 appels, 0.03 M |
| build | 7 | 0.16 M | 2 % | 0 appels, 0.00 M |
| SubagentHandback | 5 | 0.11 M | 1 % | 0 appels, 0.00 M |
| mesure | 11 | 0.09 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 2 | 0.09 M | 1 % | 0 appels, 0.00 M |
| qa | 13 | 0.09 M | 1 % | 0 appels, 0.00 M |
| wikimedia | 10 | 0.08 M | 1 % | 0 appels, 0.00 M |
| git | 1 | 0.06 M | 1 % | 0 appels, 0.00 M |
| web | 8 | 0.03 M | 0 % | 0 appels, 0.00 M |
| spawn_task | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| dismiss_task | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 9.12 M**, dont 10 appels de retouche après erreur (0.26 M, 3 %).
