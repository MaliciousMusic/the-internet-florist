# Facture en tokens : muscari

Fenêtre 2026-10-08T14:16:51 → 2026-10-09T00:52:05 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : muscari : photos de référence | haiku | 45 | 138 k | 17 k | 18 | 3 (0.01 M) | 0.25 M | 1 % |
| general-purpose : muscari : recensement | sonnet | 209 | 288 k | 62 k | 7 | 2 (0.04 M) | 4.23 M | 8 % |
| orchestrateur · 1-refs | opus | 42 | 333 k | 78 k | 0 | 0 (0.00 M) | 1.96 M | 4 % |
| general-purpose : muscari : coloris | haiku | 59 | 173 k | 32 k | 8 | 2 (0.01 M) | 0.30 M | 1 % |
| orchestrateur · 2-modelage | opus | 50 | 432 k | 73 k | 1 | 1 (0.06 M) | 2.61 M | 5 % |
| general-purpose : muscari : modelage | opus | 121 | 253 k | 37 k | 40 | 1 (0.02 M) | 3.63 M | 7 % |
| general-purpose : muscari : contrôle qualité | haiku | 30 | 70 k | 3 k | 0 | 0 (0.00 M) | 0.06 M | 0 % |
| orchestrateur · 4-qa | opus | 734 | 347 k | 841 k | 238 | 21 (0.94 M) | 32.42 M | 64 % |
| general-purpose : muscari : recensement fusion KAVB et marques | sonnet | 63 | 192 k | 38 k | 1 | 1 (0.02 M) | 1.03 M | 2 % |
| general-purpose : jacinthe muscari : règle des marques révisée | sonnet | 52 | 157 k | 30 k | 0 | 4 (0.05 M) | 0.71 M | 1 % |
| general-purpose : muscari : photos d'organes | haiku | 26 | 82 k | 4 k | 2 | 3 (0.01 M) | 0.06 M | 0 % |
| general-purpose : muscari : modelage plante v2 (sans bulbe) | opus | 102 | 166 k | 21 k | 13 | 3 (0.06 M) | 2.04 M | 4 % |
| general-purpose : muscari : contrôle qualité v2 | haiku | 7 | 64 k | 1 k | 0 | 1 (0.00 M) | 0.02 M | 0 % |
| general-purpose : muscari : preuves du lot 1 | haiku | 12 | 78 k | 4 k | 0 | 1 (0.00 M) | 0.04 M | 0 % |
| general-purpose : muscari : contrôle qualité v2 (reprise) | haiku | 16 | 66 k | 2 k | 0 | 0 (0.00 M) | 0.04 M | 0 % |
| general-purpose : muscari : modelage relais (tige flottante graine 28) | opus | 58 | 116 k | 11 k | 3 | 0 (0.00 M) | 0.88 M | 2 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : muscari : photos de référence | 14:16:53 → 15:05:01 | 48 min 08 s | 39 / 100 % | 2.9 Go | 6 / 27 % | 1 |
| general-purpose : muscari : recensement | 14:16:54 → 15:15:28 | 58 min 34 s | 38 / 100 % | 2.9 Go | 6 / 33 % | 1 |
| orchestrateur · 1-refs | 14:38:36 → 15:09:43 | 31 min 07 s | 39 / 97 % | 4.9 Go | 7 / 20 % | 1 |
| general-purpose : muscari : coloris | 15:15:41 → 15:26:26 | 10 min 45 s | 25 / 65 % | 4.8 Go | 0 / 3 % | 1 |
| orchestrateur · 2-modelage | 15:29:25 → 16:07:25 | 38 min 00 s | 40 / 90 % | 3.7 Go | 7 / 28 % | 2 |
| general-purpose : muscari : modelage | 15:29:44 → 16:00:46 | 31 min 02 s | 42 / 90 % | 3.7 Go | 7 / 28 % | 2 |
| general-purpose : muscari : contrôle qualité | 16:07:26 → 16:11:12 | 3 min 46 s | 60 / 93 % | 5.2 Go | 9 / 18 % | 2 |
| orchestrateur · 4-qa | 16:07:47 → 00:47:16 | 519 min 29 s | 49 / 100 % | 1.5 Go | 10 / 63 % | 3 |
| general-purpose : muscari : recensement fusion KAVB et marques | 16:51:52 → 17:09:33 | 17 min 41 s | 23 / 73 % | 1.5 Go | 1 / 11 % | 2 |
| general-purpose : jacinthe muscari : règle des marques révisée | 17:31:50 → 17:41:42 | 9 min 52 s | 31 / 71 % | 7.0 Go | 8 / 12 % | 1 |
| general-purpose : muscari : photos d'organes | 18:56:05 → 18:59:33 | 3 min 28 s | 36 / 73 % | 4.2 Go | 8 / 30 % | 1 |
| general-purpose : muscari : modelage plante v2 (sans bulbe) | 19:41:37 → 20:02:13 | 20 min 36 s | 49 / 100 % | 3.3 Go | 8 / 41 % | 2 |
| general-purpose : muscari : contrôle qualité v2 | 20:40:52 → 20:41:11 | 0 min 19 s | 82 / 88 % | 4.4 Go | 8 / 9 % | 0 |
| general-purpose : muscari : preuves du lot 1 | 22:22:10 → 22:23:14 | 1 min 04 s | 58 / 93 % | 6.1 Go | 19 / 23 % | 2 |
| general-purpose : muscari : contrôle qualité v2 (reprise) | 22:49:40 → 22:55:31 | 5 min 51 s | 67 / 100 % | 4.3 Go | 13 / 20 % | 2 |
| general-purpose : muscari : modelage relais (tige flottante graine 28) | 23:16:11 → 23:29:49 | 13 min 38 s | 50 / 96 % | 3.4 Go | 8 / 47 % | 2 |

Durée totale : 630 min. Somme des durées des groupes : 813 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 777 | 20.83 M | 41 % | 21 appels, 0.57 M |
| navigateur | 131 | 5.65 M | 11 % | 7 appels, 0.30 M |
| réponse | 128 | 5.18 M | 10 % | 1 appels, 0.03 M |
| image | 122 | 3.62 M | 7 % | 0 appels, 0.00 M |
| orchestration | 62 | 2.71 M | 5 % | 0 appels, 0.00 M |
| git | 58 | 2.18 M | 4 % | 2 appels, 0.09 M |
| édition code | 53 | 1.69 M | 3 % | 4 appels, 0.12 M |
| build | 38 | 1.61 M | 3 % | 0 appels, 0.00 M |
| rendu | 53 | 1.47 M | 3 % | 0 appels, 0.00 M |
| qa | 61 | 1.45 M | 3 % | 0 appels, 0.00 M |
| lecture code | 31 | 0.74 M | 1 % | 6 appels, 0.11 M |
| SendUserFile | 13 | 0.68 M | 1 % | 0 appels, 0.00 M |
| web | 25 | 0.54 M | 1 % | 0 appels, 0.00 M |
| AskUserQuestion | 9 | 0.46 M | 1 % | 0 appels, 0.00 M |
| bill | 11 | 0.43 M | 1 % | 0 appels, 0.00 M |
| get_usage | 9 | 0.33 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 14 | 0.23 M | 0 % | 0 appels, 0.00 M |
| mesure | 8 | 0.16 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 13 | 0.15 M | 0 % | 1 appels, 0.00 M |
| ToolSearch | 7 | 0.13 M | 0 % | 1 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Monitor | 2 | 0.01 M | 0 % | 0 appels, 0.00 M |

**Total : 50.27 M**, dont 43 appels de retouche après erreur (1.23 M, 2 %).
