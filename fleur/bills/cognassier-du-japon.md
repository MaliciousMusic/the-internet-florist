# Facture en tokens : cognassier-du-japon

Fenêtre 2026-10-08T21:46:48 → 2026-10-09T03:11:51 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 266 | 282 k | 253 k | 33 | 5 (0.14 M) | 9.37 M | 27 % |
| general-purpose : cognassier-du-japon : photos (refs) | haiku | 56 | 107 k | 26 k | 22 | 0 (0.00 M) | 0.18 M | 1 % |
| general-purpose : cognassier-du-japon : recensement (court, par coloris distinct) | sonnet | 71 | 126 k | 20 k | 0 | 6 (0.07 M) | 0.71 M | 2 % |
| general-purpose : cognassier-du-japon : preuves des représentants | haiku | 86 | 137 k | 20 k | 5 | 2 (0.01 M) | 0.29 M | 1 % |
| general-purpose : cognassier-du-japon : preuves des représentants (reprise) | haiku | 54 | 120 k | 14 k | 7 | 1 (0.00 M) | 0.17 M | 0 % |
| general-purpose : cognassier-du-japon : photos d'organes (complément) | haiku | 56 | 118 k | 16 k | 14 | 2 (0.01 M) | 0.20 M | 1 % |
| general-purpose : cognassier-du-japon : modelage | opus | 83 | 199 k | 33 k | 12 | 3 (0.07 M) | 2.11 M | 6 % |
| orchestrateur · 2-modelage | opus | 233 | 486 k | 320 k | 21 | 7 (0.41 M) | 13.47 M | 39 % |
| general-purpose : cognassier-du-japon : preuves des représentants (reprise 2) | haiku | 45 | 110 k | 13 k | 3 | 2 (0.01 M) | 0.14 M | 0 % |
| general-purpose : cognassier-du-japon : coloris (mesure, règle ΔE et teinte) | haiku | 43 | 135 k | 14 k | 2 | 1 (0.00 M) | 0.17 M | 0 % |
| general-purpose : cognassier-du-japon : preuves des représentants (reprise 3) | haiku | 61 | 124 k | 21 k | 12 | 2 (0.01 M) | 0.21 M | 1 % |
| general-purpose : cognassier-du-japon : coloris (2e passe) | haiku | 42 | 123 k | 14 k | 2 | 2 (0.00 M) | 0.15 M | 0 % |
| general-purpose : cognassier-du-japon : modelage (relais 1, finition de la forme) | opus | 93 | 168 k | 25 k | 21 | 1 (0.03 M) | 1.94 M | 6 % |
| general-purpose : cognassier-du-japon : recensement (temps 2b, fusion et sondage) | sonnet | 48 | 138 k | 28 k | 0 | 4 (0.04 M) | 0.61 M | 2 % |
| general-purpose : cognassier-du-japon : modelage (relais 2, jonctions DET 1) | opus | 81 | 140 k | 16 k | 6 | 1 (0.03 M) | 1.42 M | 4 % |
| general-purpose : cognassier-du-japon : finition (coloris) | sonnet | 50 | 125 k | 12 k | 4 | 2 (0.02 M) | 0.53 M | 2 % |
| orchestrateur · 4-qa | opus | 42 | 437 k | 26 k | 1 | 1 (0.05 M) | 2.96 M | 9 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 21:52:43 → 23:35:11 | 102 min 28 s | 59 / 100 % | 1.9 Go | 14 / 55 % | 3 |
| general-purpose : cognassier-du-japon : photos (refs) | 22:05:48 → 22:32:03 | 26 min 15 s | 65 / 100 % | 3.1 Go | 20 / 34 % | 3 |
| general-purpose : cognassier-du-japon : recensement (court, par coloris distinct) | 22:32:33 → 22:47:44 | 15 min 11 s | 67 / 100 % | 3.4 Go | 18 / 55 % | 3 |
| general-purpose : cognassier-du-japon : preuves des représentants | 22:50:07 → 23:03:48 | 13 min 41 s | 58 / 100 % | 3.7 Go | 12 / 45 % | 3 |
| general-purpose : cognassier-du-japon : preuves des représentants (reprise) | 23:04:13 → 23:11:10 | 6 min 57 s | 48 / 100 % | 3.2 Go | 5 / 17 % | 2 |
| general-purpose : cognassier-du-japon : photos d'organes (complément) | 23:14:27 → 23:35:06 | 20 min 39 s | 50 / 97 % | 3.4 Go | 8 / 47 % | 2 |
| general-purpose : cognassier-du-japon : modelage | 23:35:49 → 23:54:51 | 19 min 02 s | 62 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| orchestrateur · 2-modelage | 23:35:57 → 01:42:21 | 126 min 24 s | 48 / 100 % | 3.3 Go | 8 / 63 % | 3 |
| general-purpose : cognassier-du-japon : preuves des représentants (reprise 2) | 23:48:20 → 23:54:43 | 6 min 23 s | 68 / 100 % | 3.3 Go | 9 / 28 % | 3 |
| general-purpose : cognassier-du-japon : coloris (mesure, règle ΔE et teinte) | 23:59:00 → 00:10:32 | 11 min 32 s | 43 / 88 % | 3.9 Go | 5 / 12 % | 1 |
| general-purpose : cognassier-du-japon : preuves des représentants (reprise 3) | 00:29:42 → 00:40:54 | 11 min 12 s | 58 / 88 % | 3.6 Go | 10 / 17 % | 3 |
| general-purpose : cognassier-du-japon : coloris (2e passe) | 00:49:53 → 00:57:18 | 7 min 25 s | 49 / 90 % | 4.4 Go | 9 / 18 % | 2 |
| general-purpose : cognassier-du-japon : modelage (relais 1, finition de la forme) | 00:57:32 → 01:15:42 | 18 min 10 s | 42 / 100 % | 3.9 Go | 7 / 16 % | 3 |
| general-purpose : cognassier-du-japon : recensement (temps 2b, fusion et sondage) | 00:58:01 → 01:07:46 | 9 min 45 s | 36 / 77 % | 4.0 Go | 6 / 12 % | 2 |
| general-purpose : cognassier-du-japon : modelage (relais 2, jonctions DET 1) | 01:25:57 → 01:41:43 | 15 min 46 s | 32 / 83 % | 3.8 Go | 7 / 21 % | 2 |
| general-purpose : cognassier-du-japon : finition (coloris) | 01:47:13 → 01:54:42 | 7 min 29 s | 21 / 74 % | 4.4 Go | 8 / 10 % | 2 |
| orchestrateur · 4-qa | 02:47:58 → 02:53:41 | 5 min 43 s | 37 / 82 % | 3.9 Go | 6 / 14 % | 2 |

Durée totale : 301 min. Somme des durées des groupes : 424 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 648 | 12.07 M | 35 % | 23 appels, 0.34 M |
| navigateur | 119 | 5.33 M | 15 % | 6 appels, 0.24 M |
| image | 163 | 3.26 M | 9 % | 0 appels, 0.00 M |
| réponse | 49 | 2.63 M | 8 % | 0 appels, 0.00 M |
| édition code | 67 | 1.94 M | 6 % | 3 appels, 0.12 M |
| build | 38 | 1.80 M | 5 % | 1 appels, 0.05 M |
| git | 40 | 1.61 M | 5 % | 1 appels, 0.04 M |
| qa | 22 | 1.21 M | 3 % | 0 appels, 0.00 M |
| orchestration | 24 | 1.13 M | 3 % | 0 appels, 0.00 M |
| lecture code | 43 | 0.83 M | 2 % | 5 appels, 0.10 M |
| rendu | 37 | 0.82 M | 2 % | 0 appels, 0.00 M |
| get_usage | 7 | 0.71 M | 2 % | 0 appels, 0.00 M |
| web | 115 | 0.56 M | 2 % | 3 appels, 0.01 M |
| SendUserFile | 6 | 0.24 M | 1 % | 0 appels, 0.00 M |
| bill | 5 | 0.20 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 14 | 0.18 M | 1 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 3 | 0.02 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 6 | 0.02 M | 0 % | 0 appels, 0.00 M |
| mesure | 2 | 0.01 M | 0 % | 0 appels, 0.00 M |
| read_widget_context | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 34.62 M**, dont 42 appels de retouche après erreur (0.89 M, 3 %).
