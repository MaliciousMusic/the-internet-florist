# Facture en tokens : pois-de-senteur

Fenêtre 2026-10-08T21:32:32 → 2026-10-09T04:07:11 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : pois-de-senteur : photos (refs) | haiku | 20 | 84 k | 6 k | 0 | 0 (0.00 M) | 0.06 M | 0 % |
| general-purpose : pois-de-senteur : recensement (temps 1) | sonnet | 67 | 120 k | 26 k | 0 | 4 (0.03 M) | 0.66 M | 2 % |
| orchestrateur · 1-refs | opus | 343 | 301 k | 381 k | 36 | 8 (0.32 M) | 13.06 M | 32 % |
| general-purpose : pois-de-senteur : preuves lot 1 | haiku | 52 | 124 k | 36 k | 26 | 2 (0.02 M) | 0.21 M | 1 % |
| general-purpose : pois-de-senteur : photos relais | haiku | 27 | 118 k | 22 k | 25 | 0 (0.00 M) | 0.20 M | 0 % |
| general-purpose : pois-de-senteur : preuves lot 2 | haiku | 45 | 158 k | 47 k | 36 | 1 (0.01 M) | 0.25 M | 1 % |
| general-purpose : pois-de-senteur : preuves lot 3 | haiku | 80 | 161 k | 29 k | 20 | 2 (0.01 M) | 0.34 M | 1 % |
| general-purpose : pois-de-senteur : recensement (temps 2, regroupement) | sonnet | 53 | 185 k | 38 k | 0 | 2 (0.03 M) | 0.89 M | 2 % |
| general-purpose : pois-de-senteur : photos 2 (organes, vues, déclin) | haiku | 28 | 135 k | 17 k | 8 | 4 (0.02 M) | 0.13 M | 0 % |
| general-purpose : pois-de-senteur : preuves lot 4 (représentants) | haiku | 45 | 136 k | 32 k | 18 | 3 (0.02 M) | 0.20 M | 0 % |
| general-purpose : pois-de-senteur : preuves lot 5 (représentants) | haiku | 41 | 121 k | 28 k | 29 | 1 (0.02 M) | 0.17 M | 0 % |
| general-purpose : pois-de-senteur : coloris (représentants, règle LCh) | haiku | 26 | 138 k | 19 k | 9 | 1 (0.02 M) | 0.14 M | 0 % |
| general-purpose : pois-de-senteur : coloris relais | haiku | 43 | 127 k | 28 k | 6 | 1 (0.01 M) | 0.18 M | 0 % |
| general-purpose : pois-de-senteur : recensement (temps 3, sondage et fusion) | sonnet | 29 | 131 k | 19 k | 0 | 1 (0.01 M) | 0.39 M | 1 % |
| orchestrateur · 2-modelage | opus | 169 | 517 k | 200 k | 18 | 4 (0.23 M) | 10.10 M | 25 % |
| general-purpose : pois-de-senteur : modelage | opus | 104 | 217 k | 30 k | 17 | 0 (0.00 M) | 2.76 M | 7 % |
| general-purpose : pois-de-senteur : modelage (relais 2) | opus | 93 | 165 k | 19 k | 8 | 1 (0.03 M) | 1.87 M | 5 % |
| orchestrateur · 2-modelage-relais2 | opus | 5 | 454 k | 8 k | 0 | 0 (0.00 M) | 0.28 M | 1 % |
| general-purpose : pois-de-senteur : modelage (relais 3) | opus | 75 | 149 k | 18 k | 11 | 1 (0.03 M) | 1.41 M | 3 % |
| general-purpose : pois-de-senteur : modelage (relais 4, finitions et planches) | opus | 88 | 146 k | 27 k | 5 | 3 (0.06 M) | 1.63 M | 4 % |
| general-purpose : pois-de-senteur : finition (coloris) | sonnet | 62 | 164 k | 16 k | 1 | 0 (0.00 M) | 0.81 M | 2 % |
| orchestrateur · 3-finition | opus | 42 | 437 k | 26 k | 1 | 1 (0.05 M) | 2.96 M | 7 % |
| general-purpose : pois-de-senteur : contrôle qualité | haiku | 50 | 105 k | 10 k | 6 | 0 (0.00 M) | 0.15 M | 0 % |
| orchestrateur · 4-qa | opus | 34 | 486 k | 19 k | 1 | 0 (0.00 M) | 1.80 M | 4 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : pois-de-senteur : photos (refs) | 21:33:02 → 21:45:49 | 12 min 47 s | 71 / 93 % | 2.2 Go | 8 / 25 % | 0 |
| general-purpose : pois-de-senteur : recensement (temps 1) | 21:33:03 → 21:46:18 | 13 min 15 s | 71 / 93 % | 2.2 Go | 8 / 25 % | 0 |
| orchestrateur · 1-refs | 21:36:30 → 23:56:42 | 140 min 12 s | 60 / 100 % | 1.9 Go | 12 / 55 % | 3 |
| general-purpose : pois-de-senteur : preuves lot 1 | 21:51:11 → 22:01:16 | 10 min 05 s | 60 / 94 % | 1.9 Go | 8 / 24 % | 0 |
| general-purpose : pois-de-senteur : photos relais | 21:51:12 → 22:24:39 | 33 min 27 s | 64 / 100 % | 1.9 Go | 16 / 29 % | 3 |
| general-purpose : pois-de-senteur : preuves lot 2 | 22:03:51 → 22:13:20 | 9 min 29 s | 73 / 100 % | 3.1 Go | 19 / 29 % | 3 |
| general-purpose : pois-de-senteur : preuves lot 3 | 22:25:06 → 22:35:31 | 10 min 25 s | 72 / 100 % | 4.3 Go | 23 / 34 % | 3 |
| general-purpose : pois-de-senteur : recensement (temps 2, regroupement) | 22:36:08 → 22:52:19 | 16 min 11 s | 65 / 100 % | 3.4 Go | 16 / 55 % | 2 |
| general-purpose : pois-de-senteur : photos 2 (organes, vues, déclin) | 22:36:27 → 22:48:30 | 12 min 03 s | 62 / 100 % | 3.4 Go | 16 / 55 % | 2 |
| general-purpose : pois-de-senteur : preuves lot 4 (représentants) | 22:53:47 → 23:02:57 | 9 min 10 s | 54 / 100 % | 3.7 Go | 11 / 45 % | 2 |
| general-purpose : pois-de-senteur : preuves lot 5 (représentants) | 22:53:47 → 23:02:05 | 8 min 18 s | 54 / 100 % | 4.8 Go | 11 / 45 % | 2 |
| general-purpose : pois-de-senteur : coloris (représentants, règle LCh) | 23:05:46 → 23:16:10 | 10 min 24 s | 44 / 97 % | 3.5 Go | 7 / 23 % | 2 |
| general-purpose : pois-de-senteur : coloris relais | 23:24:17 → 23:33:04 | 8 min 47 s | 52 / 96 % | 3.8 Go | 9 / 47 % | 2 |
| general-purpose : pois-de-senteur : recensement (temps 3, sondage et fusion) | 23:35:31 → 23:43:40 | 8 min 09 s | 55 / 79 % | 3.3 Go | 9 / 13 % | 3 |
| orchestrateur · 2-modelage | 23:56:49 → 01:32:07 | 95 min 18 s | 48 / 100 % | 3.4 Go | 9 / 63 % | 3 |
| general-purpose : pois-de-senteur : modelage | 23:57:27 → 00:22:14 | 24 min 47 s | 50 / 96 % | 3.7 Go | 7 / 45 % | 3 |
| general-purpose : pois-de-senteur : modelage (relais 2) | 01:41:31 → 01:59:52 | 18 min 21 s | 19 / 74 % | 4.4 Go | 9 / 16 % | 2 |
| orchestrateur · 2-modelage-relais2 | 01:41:38 → 01:42:21 | 0 min 43 s | 19 / 43 % | 5.5 Go | 14 / 16 % | 0 |
| general-purpose : pois-de-senteur : modelage (relais 3) | 02:04:42 → 02:17:57 | 13 min 15 s | 14 / 48 % | 4.8 Go | 6 / 11 % | 1 |
| general-purpose : pois-de-senteur : modelage (relais 4, finitions et planches) | 02:22:02 → 02:38:26 | 16 min 24 s | 23 / 63 % | 4.6 Go | 5 / 9 % | 2 |
| general-purpose : pois-de-senteur : finition (coloris) | 02:39:22 → 02:55:04 | 15 min 42 s | 25 / 82 % | 3.9 Go | 5 / 14 % | 2 |
| orchestrateur · 3-finition | 02:47:58 → 02:53:41 | 5 min 43 s | 37 / 82 % | 3.9 Go | 6 / 14 % | 2 |
| general-purpose : pois-de-senteur : contrôle qualité | 02:55:51 → 03:07:16 | 11 min 25 s | 23 / 62 % | 4.9 Go | 4 / 8 % | 2 |
| orchestrateur · 4-qa | 03:12:36 → 03:34:23 | 21 min 47 s | 13 / 55 % | 3.3 Go | 4 / 11 % | 1 |

Durée totale : 361 min. Somme des durées des groupes : 526 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 778 | 14.97 M | 37 % | 15 appels, 0.27 M |
| navigateur | 118 | 5.33 M | 13 % | 6 appels, 0.24 M |
| image | 161 | 3.63 M | 9 % | 2 appels, 0.01 M |
| réponse | 71 | 3.05 M | 7 % | 0 appels, 0.00 M |
| build | 54 | 2.26 M | 6 % | 3 appels, 0.08 M |
| édition code | 74 | 2.20 M | 5 % | 8 appels, 0.16 M |
| git | 49 | 2.02 M | 5 % | 1 appels, 0.04 M |
| qa | 37 | 1.35 M | 3 % | 0 appels, 0.00 M |
| lecture code | 73 | 1.22 M | 3 % | 4 appels, 0.08 M |
| orchestration | 25 | 1.05 M | 3 % | 0 appels, 0.00 M |
| rendu | 43 | 0.93 M | 2 % | 0 appels, 0.00 M |
| get_usage | 8 | 0.76 M | 2 % | 0 appels, 0.00 M |
| SendUserFile | 13 | 0.63 M | 2 % | 0 appels, 0.00 M |
| web | 61 | 0.49 M | 1 % | 1 appels, 0.01 M |
| SubagentHandback | 21 | 0.26 M | 1 % | 0 appels, 0.00 M |
| bill | 5 | 0.20 M | 1 % | 0 appels, 0.00 M |
| AskUserQuestion | 2 | 0.08 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 11 | 0.07 M | 0 % | 0 appels, 0.00 M |
| Monitor | 7 | 0.06 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| mesure | 2 | 0.03 M | 0 % | 0 appels, 0.00 M |
| wikimedia | 3 | 0.02 M | 0 % | 0 appels, 0.00 M |
| dismiss_task | 2 | 0.00 M | 0 % | 0 appels, 0.00 M |
| spawn_task | 2 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 40.65 M**, dont 40 appels de retouche après erreur (0.89 M, 2 %).
