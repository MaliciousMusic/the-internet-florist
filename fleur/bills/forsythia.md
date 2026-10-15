# Facture en tokens : forsythia

Fenêtre 2026-10-08T21:46:49 → 2026-10-09T03:11:54 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 499 | 377 k | 573 k | 54 | 12 (0.55 M) | 22.84 M | 71 % |
| general-purpose : forsythia : photos (refs) | haiku | 75 | 140 k | 15 k | 34 | 1 (0.01 M) | 0.28 M | 1 % |
| general-purpose : forsythia : recensement (court, par coloris distinct) | sonnet | 70 | 134 k | 27 k | 2 | 1 (0.01 M) | 0.77 M | 2 % |
| general-purpose : forsythia : coloris (mesure, règle ΔE et teinte) | haiku | 55 | 116 k | 12 k | 2 | 4 (0.01 M) | 0.20 M | 1 % |
| general-purpose : forsythia : photos d'organes (complément) | haiku | 54 | 119 k | 17 k | 13 | 3 (0.01 M) | 0.18 M | 1 % |
| general-purpose : forsythia : preuves des représentants | haiku | 63 | 117 k | 19 k | 5 | 1 (0.00 M) | 0.20 M | 1 % |
| general-purpose : forsythia : coloris (2e passe) | haiku | 36 | 131 k | 24 k | 16 | 0 (0.00 M) | 0.16 M | 0 % |
| general-purpose : forsythia : recensement (temps 2b, fusion et sondage) | sonnet | 37 | 133 k | 29 k | 0 | 2 (0.03 M) | 0.51 M | 2 % |
| general-purpose : forsythia : modelage | opus | 91 | 193 k | 23 k | 9 | 0 (0.00 M) | 2.15 M | 7 % |
| general-purpose : forsythia : modelage (relais 1, planches et mesures) | opus | 79 | 146 k | 22 k | 7 | 1 (0.02 M) | 1.46 M | 5 % |
| general-purpose : forsythia : finition (coloris) | sonnet | 52 | 137 k | 12 k | 5 | 2 (0.02 M) | 0.56 M | 2 % |
| orchestrateur · 3-finition | opus | 42 | 437 k | 26 k | 1 | 1 (0.05 M) | 2.96 M | 9 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 21:52:43 → 01:42:21 | 229 min 38 s | 53 / 100 % | 1.9 Go | 11 / 63 % | 3 |
| general-purpose : forsythia : photos (refs) | 23:20:18 → 23:42:53 | 22 min 35 s | 53 / 97 % | 3.3 Go | 8 / 47 % | 3 |
| general-purpose : forsythia : recensement (court, par coloris distinct) | 23:48:21 → 00:08:23 | 20 min 02 s | 54 / 100 % | 3.3 Go | 7 / 28 % | 3 |
| general-purpose : forsythia : coloris (mesure, règle ΔE et teinte) | 00:11:05 → 00:26:12 | 15 min 07 s | 54 / 96 % | 3.7 Go | 9 / 63 % | 3 |
| general-purpose : forsythia : photos d'organes (complément) | 00:11:17 → 00:28:52 | 17 min 35 s | 56 / 100 % | 3.4 Go | 10 / 63 % | 3 |
| general-purpose : forsythia : preuves des représentants | 00:29:42 → 00:39:28 | 9 min 46 s | 59 / 88 % | 3.6 Go | 10 / 17 % | 3 |
| general-purpose : forsythia : coloris (2e passe) | 00:49:53 → 00:57:01 | 7 min 08 s | 50 / 90 % | 4.4 Go | 9 / 18 % | 2 |
| general-purpose : forsythia : recensement (temps 2b, fusion et sondage) | 00:58:02 → 01:06:45 | 8 min 43 s | 35 / 77 % | 4.0 Go | 6 / 12 % | 2 |
| general-purpose : forsythia : modelage | 02:02:26 → 02:20:17 | 17 min 51 s | 18 / 48 % | 4.8 Go | 6 / 11 % | 1 |
| general-purpose : forsythia : modelage (relais 1, planches et mesures) | 02:26:00 → 02:40:17 | 14 min 17 s | 24 / 63 % | 4.6 Go | 5 / 9 % | 2 |
| general-purpose : forsythia : finition (coloris) | 02:45:41 → 02:54:21 | 8 min 40 s | 31 / 82 % | 3.9 Go | 5 / 14 % | 2 |
| orchestrateur · 3-finition | 02:47:58 → 02:53:41 | 5 min 43 s | 37 / 82 % | 3.9 Go | 6 / 14 % | 2 |

Durée totale : 302 min. Somme des durées des groupes : 377 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 539 | 11.89 M | 37 % | 15 appels, 0.29 M |
| navigateur | 114 | 5.09 M | 16 % | 6 appels, 0.24 M |
| réponse | 51 | 2.66 M | 8 % | 0 appels, 0.00 M |
| image | 109 | 2.28 M | 7 % | 0 appels, 0.00 M |
| build | 37 | 1.80 M | 6 % | 1 appels, 0.05 M |
| git | 41 | 1.61 M | 5 % | 1 appels, 0.04 M |
| édition code | 43 | 1.43 M | 4 % | 1 appels, 0.08 M |
| qa | 22 | 1.21 M | 4 % | 0 appels, 0.00 M |
| orchestration | 20 | 0.94 M | 3 % | 0 appels, 0.00 M |
| get_usage | 7 | 0.71 M | 2 % | 0 appels, 0.00 M |
| lecture code | 40 | 0.62 M | 2 % | 3 appels, 0.02 M |
| SendUserFile | 12 | 0.58 M | 2 % | 0 appels, 0.00 M |
| rendu | 27 | 0.57 M | 2 % | 0 appels, 0.00 M |
| web | 19 | 0.22 M | 1 % | 0 appels, 0.00 M |
| bill | 5 | 0.20 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 12 | 0.14 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 29 | 0.10 M | 0 % | 0 appels, 0.00 M |
| mesure | 9 | 0.06 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 5 | 0.04 M | 0 % | 1 appels, 0.00 M |
| AskUserQuestion | 1 | 0.04 M | 0 % | 0 appels, 0.00 M |
| Monitor | 6 | 0.02 M | 0 % | 0 appels, 0.00 M |
| read_widget_context | 2 | 0.01 M | 0 % | 0 appels, 0.00 M |
| read | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| tabs_context_mcp | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 32.27 M**, dont 28 appels de retouche après erreur (0.72 M, 2 %).
