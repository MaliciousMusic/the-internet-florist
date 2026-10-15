# Facture en tokens : glycine

Fenêtre 2026-10-08T16:43:07 → 2026-10-09T00:52:11 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 701 | 341 k | 797 k | 238 | 21 (0.94 M) | 30.57 M | 63 % |
| general-purpose : glycine : recensement inventaire | sonnet | 97 | 203 k | 48 k | 0 | 4 (0.06 M) | 1.72 M | 4 % |
| general-purpose : glycine : photos de référence | haiku | 19 | 80 k | 5 k | 8 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : glycine : modelage (grappe pendante et plante) | opus | 88 | 215 k | 31 k | 24 | 0 (0.00 M) | 2.36 M | 5 % |
| general-purpose : glycine : modelage relais 2 | opus | 109 | 194 k | 33 k | 7 | 3 (0.05 M) | 4.07 M | 8 % |
| general-purpose : glycine : coloris | haiku | 33 | 89 k | 8 k | 2 | 1 (0.00 M) | 0.09 M | 0 % |
| general-purpose : glycine : preuves du lot 1 | haiku | 16 | 88 k | 14 k | 0 | 3 (0.01 M) | 0.06 M | 0 % |
| general-purpose : glycine : modelage relais 3 | opus | 96 | 172 k | 19 k | 8 | 3 (0.07 M) | 2.01 M | 4 % |
| general-purpose : glycine : modelage relais 4 (finir) | opus | 174 | 190 k | 30 k | 23 | 4 (0.09 M) | 3.74 M | 8 % |
| general-purpose : glycine : finition des coloris | sonnet | 101 | 156 k | 19 k | 12 | 2 (0.02 M) | 1.16 M | 2 % |
| general-purpose : glycine : contrôle qualité | haiku | 9 | 65 k | 1 k | 0 | 1 (0.00 M) | 0.04 M | 0 % |
| general-purpose : glycine : contrôle qualité reprise | haiku | 30 | 72 k | 4 k | 0 | 1 (0.00 M) | 0.06 M | 0 % |
| general-purpose : glycine : modelage relais 5 (tiges flottantes) | opus | 105 | 197 k | 24 k | 6 | 3 (0.07 M) | 2.89 M | 6 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 16:49:17 → 00:47:16 | 477 min 59 s | 50 / 100 % | 1.5 Go | 10 / 63 % | 3 |
| general-purpose : glycine : recensement inventaire | 16:51:52 → 17:30:54 | 39 min 02 s | 28 / 85 % | 1.5 Go | 5 / 48 % | 2 |
| general-purpose : glycine : photos de référence | 19:20:54 → 19:29:28 | 8 min 34 s | 35 / 87 % | 4.1 Go | 8 / 17 % | 1 |
| general-purpose : glycine : modelage (grappe pendante et plante) | 20:14:53 → 20:35:55 | 21 min 02 s | 47 / 94 % | 2.9 Go | 11 / 43 % | 2 |
| general-purpose : glycine : modelage relais 2 | 20:48:09 → 22:10:17 | 82 min 08 s | 62 / 100 % | 1.9 Go | 12 / 40 % | 3 |
| general-purpose : glycine : coloris | 22:11:09 → 22:14:43 | 3 min 34 s | 69 / 100 % | 3.8 Go | 20 / 26 % | 3 |
| general-purpose : glycine : preuves du lot 1 | 22:11:09 → 22:13:52 | 2 min 43 s | 74 / 100 % | 3.8 Go | 20 / 26 % | 3 |
| general-purpose : glycine : modelage relais 3 | 22:22:10 → 22:42:59 | 20 min 49 s | 69 / 100 % | 3.4 Go | 20 / 55 % | 3 |
| general-purpose : glycine : modelage relais 4 (finir) | 22:49:41 → 23:15:07 | 25 min 26 s | 53 / 100 % | 3.2 Go | 9 / 45 % | 3 |
| general-purpose : glycine : finition des coloris | 23:16:12 → 23:33:09 | 16 min 57 s | 50 / 96 % | 3.4 Go | 8 / 47 % | 2 |
| general-purpose : glycine : contrôle qualité | 23:34:28 → 23:45:00 | 10 min 32 s | 60 / 97 % | 3.3 Go | 8 / 13 % | 3 |
| general-purpose : glycine : contrôle qualité reprise | 23:45:44 → 23:54:31 | 8 min 47 s | 68 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| general-purpose : glycine : modelage relais 5 (tiges flottantes) | 23:55:22 → 00:49:51 | 54 min 29 s | 54 / 100 % | 3.4 Go | 9 / 63 % | 3 |

Durée totale : 481 min. Somme des durées des groupes : 772 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 667 | 18.91 M | 39 % | 25 appels, 0.63 M |
| navigateur | 134 | 5.82 M | 12 % | 7 appels, 0.30 M |
| image | 132 | 3.90 M | 8 % | 0 appels, 0.00 M |
| réponse | 88 | 3.27 M | 7 % | 1 appels, 0.03 M |
| orchestration | 59 | 3.15 M | 6 % | 0 appels, 0.00 M |
| édition code | 83 | 2.63 M | 5 % | 3 appels, 0.12 M |
| qa | 69 | 2.42 M | 5 % | 0 appels, 0.00 M |
| lecture code | 77 | 1.96 M | 4 % | 8 appels, 0.21 M |
| build | 54 | 1.86 M | 4 % | 0 appels, 0.00 M |
| rendu | 78 | 1.60 M | 3 % | 0 appels, 0.00 M |
| git | 35 | 1.21 M | 2 % | 1 appels, 0.04 M |
| web | 37 | 0.54 M | 1 % | 0 appels, 0.00 M |
| bill | 9 | 0.32 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 6 | 0.27 M | 1 % | 0 appels, 0.00 M |
| get_usage | 8 | 0.27 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 12 | 0.22 M | 0 % | 1 appels, 0.00 M |
| AskUserQuestion | 4 | 0.22 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 6 | 0.12 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 10 | 0.05 M | 0 % | 0 appels, 0.00 M |
| mesure | 8 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Monitor | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |

**Total : 48.81 M**, dont 46 appels de retouche après erreur (1.33 M, 3 %).
