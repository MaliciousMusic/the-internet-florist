# Facture en tokens : renoncule-butterfly

Fenêtre 2026-10-08T14:04:19 → 2026-10-08T15:53:14 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : renoncule-butterfly : recensement | sonnet | 160 | 342 k | 80 k | 31 | 11 (0.24 M) | 3.94 M | 37 % |
| orchestrateur · 1-refs | opus | 50 | 334 k | 89 k | 0 | 0 (0.00 M) | 2.31 M | 22 % |
| general-purpose : renoncule-butterfly : photos | haiku | 70 | 168 k | 27 k | 37 | 2 (0.00 M) | 0.36 M | 3 % |
| general-purpose : renoncule-butterfly : coloris | haiku | 190 | 324 k | 85 k | 52 | 6 (0.03 M) | 1.43 M | 13 % |
| general-purpose : renoncule-butterfly : modelage | opus | 59 | 186 k | 21 k | 10 | 1 (0.01 M) | 1.50 M | 14 % |
| orchestrateur · 2-modelage | opus | 23 | 421 k | 30 k | 0 | 1 (0.06 M) | 1.16 M | 11 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : renoncule-butterfly : recensement | 14:04:23 → 15:08:15 | 63 min 52 s | 37 / 100 % | 2.9 Go | 6 / 27 % | 1 |
| orchestrateur · 1-refs | 14:04:27 → 15:31:24 | 86 min 57 s | 34 / 100 % | 2.9 Go | 5 / 33 % | 1 |
| general-purpose : renoncule-butterfly : photos | 14:11:10 → 15:32:15 | 81 min 05 s | 35 / 100 % | 2.9 Go | 5 / 33 % | 1 |
| general-purpose : renoncule-butterfly : coloris | 14:49:38 → 15:21:30 | 31 min 52 s | 34 / 97 % | 4.0 Go | 5 / 33 % | 1 |
| general-purpose : renoncule-butterfly : modelage | 15:33:21 → 15:43:58 | 10 min 37 s | 34 / 79 % | 5.3 Go | 4 / 11 % | 2 |
| orchestrateur · 2-modelage | 15:34:05 → 15:53:12 | 19 min 07 s | 37 / 90 % | 3.9 Go | 6 / 25 % | 2 |

Durée totale : 109 min. Somme des durées des groupes : 294 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 294 | 4.86 M | 45 % | 16 appels, 0.18 M |
| réponse | 29 | 1.33 M | 12 % | 0 appels, 0.00 M |
| image | 83 | 1.00 M | 9 % | 1 appels, 0.01 M |
| web | 35 | 0.72 M | 7 % | 1 appels, 0.02 M |
| git | 14 | 0.57 M | 5 % | 1 appels, 0.06 M |
| édition code | 22 | 0.55 M | 5 % | 2 appels, 0.07 M |
| orchestration | 10 | 0.54 M | 5 % | 0 appels, 0.00 M |
| lecture code | 19 | 0.38 M | 4 % | 0 appels, 0.00 M |
| wikimedia | 26 | 0.20 M | 2 % | 0 appels, 0.00 M |
| AskUserQuestion | 2 | 0.14 M | 1 % | 0 appels, 0.00 M |
| ToolSearch | 5 | 0.14 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 6 | 0.13 M | 1 % | 0 appels, 0.00 M |
| mesure | 2 | 0.06 M | 1 % | 0 appels, 0.00 M |
| build | 2 | 0.05 M | 0 % | 0 appels, 0.00 M |
| rendu | 3 | 0.04 M | 0 % | 0 appels, 0.00 M |

**Total : 10.71 M**, dont 21 appels de retouche après erreur (0.34 M, 3 %).
