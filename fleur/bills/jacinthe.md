# Facture en tokens : jacinthe

Fenêtre 2026-10-08T13:19:19 → 2026-10-09T00:52:00 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : jacinthe : photos de référence | haiku | 50 | 103 k | 18 k | 42 | 3 (0.01 M) | 0.24 M | 0 % |
| general-purpose : jacinthe : recensement | sonnet | 129 | 252 k | 56 k | 37 | 5 (0.07 M) | 2.90 M | 5 % |
| orchestrateur · 1-refs | opus | 49 | 383 k | 72 k | 0 | 0 (0.00 M) | 2.41 M | 4 % |
| general-purpose : jacinthe : coloris | haiku | 86 | 203 k | 42 k | 49 | 6 (0.03 M) | 0.52 M | 1 % |
| general-purpose : jacinthe : modelage | opus | 178 | 303 k | 49 k | 47 | 0 (0.00 M) | 6.15 M | 11 % |
| general-purpose : jacinthe : contrôle qualité | haiku | 31 | 85 k | 4 k | 0 | 1 (0.00 M) | 0.07 M | 0 % |
| orchestrateur · 4-qa | opus | 796 | 353 k | 931 k | 239 | 22 (1.00 M) | 35.59 M | 64 % |
| general-purpose : jacinthe : contrôle qualité v1b | haiku | 23 | 81 k | 4 k | 2 | 0 (0.00 M) | 0.06 M | 0 % |
| general-purpose : jacinthe : recensement fusion KAVB et marques | sonnet | 67 | 183 k | 32 k | 12 | 3 (0.04 M) | 1.03 M | 2 % |
| general-purpose : jacinthe muscari : règle des marques révisée | sonnet | 52 | 157 k | 30 k | 0 | 4 (0.05 M) | 0.71 M | 1 % |
| general-purpose : jacinthe : photos d'organes | haiku | 25 | 97 k | 8 k | 15 | 1 (0.00 M) | 0.08 M | 0 % |
| general-purpose : jacinthe : modelage plante v2 (sans bulbe) | opus | 158 | 224 k | 37 k | 20 | 2 (0.04 M) | 4.05 M | 7 % |
| general-purpose : jacinthe : contrôle qualité v2 | haiku | 18 | 66 k | 2 k | 0 | 1 (0.00 M) | 0.03 M | 0 % |
| general-purpose : jacinthe : contrôle qualité v2 (reprise) | haiku | 18 | 67 k | 3 k | 0 | 0 (0.00 M) | 0.04 M | 0 % |
| general-purpose : jacinthe : modelage relais (tige flottante et budget) | opus | 93 | 176 k | 15 k | 4 | 4 (0.08 M) | 2.01 M | 4 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : jacinthe : photos de référence | 13:19:48 → 14:15:35 | 55 min 47 s | 27 / 77 % | 5.6 Go | 7 / 28 % | 1 |
| general-purpose : jacinthe : recensement | 13:19:50 → 15:13:37 | 113 min 47 s | 33 / 100 % | 2.9 Go | 7 / 33 % | 1 |
| orchestrateur · 1-refs | 13:44:05 → 14:55:06 | 71 min 01 s | 35 / 100 % | 2.9 Go | 7 / 28 % | 1 |
| general-purpose : jacinthe : coloris | 13:48:43 → 14:10:53 | 22 min 10 s | 30 / 65 % | 5.6 Go | 8 / 28 % | 1 |
| general-purpose : jacinthe : modelage | 14:16:21 → 15:01:47 | 45 min 26 s | 40 / 100 % | 2.9 Go | 7 / 27 % | 1 |
| general-purpose : jacinthe : contrôle qualité | 14:55:29 → 14:59:21 | 3 min 52 s | 43 / 67 % | 5.6 Go | 5 / 10 % | 1 |
| orchestrateur · 4-qa | 14:55:50 → 00:47:16 | 591 min 26 s | 48 / 100 % | 1.5 Go | 9 / 63 % | 3 |
| general-purpose : jacinthe : contrôle qualité v1b | 15:03:11 → 15:06:49 | 3 min 38 s | 34 / 51 % | 6.2 Go | 5 / 8 % | 1 |
| general-purpose : jacinthe : recensement fusion KAVB et marques | 16:12:03 → 16:28:33 | 16 min 30 s | 33 / 71 % | 3.2 Go | 7 / 25 % | 0 |
| general-purpose : jacinthe muscari : règle des marques révisée | 17:31:50 → 17:41:42 | 9 min 52 s | 31 / 71 % | 7.0 Go | 8 / 12 % | 1 |
| general-purpose : jacinthe : photos d'organes | 18:56:05 → 19:06:34 | 10 min 29 s | 30 / 73 % | 4.2 Go | 8 / 30 % | 1 |
| general-purpose : jacinthe : modelage plante v2 (sans bulbe) | 19:41:36 → 20:13:00 | 31 min 24 s | 49 / 100 % | 3.3 Go | 8 / 41 % | 2 |
| general-purpose : jacinthe : contrôle qualité v2 | 20:40:51 → 20:42:00 | 1 min 09 s | 70 / 88 % | 4.1 Go | 9 / 10 % | 1 |
| general-purpose : jacinthe : contrôle qualité v2 (reprise) | 22:11:09 → 22:21:17 | 10 min 08 s | 60 / 100 % | 3.8 Go | 19 / 28 % | 3 |
| general-purpose : jacinthe : modelage relais (tige flottante et budget) | 22:22:11 → 22:48:41 | 26 min 30 s | 67 / 100 % | 3.4 Go | 19 / 55 % | 3 |

Durée totale : 687 min. Somme des durées des groupes : 1013 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 673 | 18.26 M | 33 % | 26 appels, 0.52 M |
| navigateur | 134 | 5.82 M | 10 % | 7 appels, 0.30 M |
| réponse | 141 | 5.78 M | 10 % | 1 appels, 0.03 M |
| image | 188 | 5.38 M | 10 % | 2 appels, 0.01 M |
| orchestration | 74 | 4.10 M | 7 % | 0 appels, 0.00 M |
| rendu | 99 | 2.98 M | 5 % | 1 appels, 0.02 M |
| git | 63 | 2.64 M | 5 % | 2 appels, 0.09 M |
| édition code | 66 | 2.27 M | 4 % | 4 appels, 0.15 M |
| build | 40 | 1.78 M | 3 % | 0 appels, 0.00 M |
| lecture code | 67 | 1.57 M | 3 % | 7 appels, 0.18 M |
| qa | 64 | 1.38 M | 2 % | 0 appels, 0.00 M |
| web | 54 | 1.05 M | 2 % | 0 appels, 0.00 M |
| SendUserFile | 13 | 0.68 M | 1 % | 0 appels, 0.00 M |
| AskUserQuestion | 9 | 0.46 M | 1 % | 0 appels, 0.00 M |
| get_usage | 11 | 0.44 M | 1 % | 0 appels, 0.00 M |
| bill | 11 | 0.43 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 16 | 0.31 M | 1 % | 0 appels, 0.00 M |
| ToolSearch | 11 | 0.18 M | 0 % | 0 appels, 0.00 M |
| mesure | 9 | 0.17 M | 0 % | 1 appels, 0.00 M |
| wikimedia | 19 | 0.16 M | 0 % | 0 appels, 0.00 M |
| Monitor | 10 | 0.04 M | 0 % | 1 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |

**Total : 55.88 M**, dont 52 appels de retouche après erreur (1.31 M, 2 %).
