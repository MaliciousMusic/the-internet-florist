# Facture en tokens : iris-hollandais

Fenêtre 2026-10-08T19:28:16 → 2026-10-09T04:07:11 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | opus | 139 | 197 k | 147 k | 0 | 5 (0.12 M) | 4.08 M | 8 % |
| general-purpose : iris-hollandais : photos (refs) | haiku | 37 | 115 k | 9 k | 12 | 1 (0.00 M) | 0.17 M | 0 % |
| general-purpose : iris-hollandais : recensement (temps 1) | sonnet | 66 | 153 k | 25 k | 0 | 3 (0.06 M) | 0.99 M | 2 % |
| general-purpose : iris-hollandais : preuves lot 1 | haiku | 58 | 181 k | 38 k | 16 | 2 (0.02 M) | 0.31 M | 1 % |
| general-purpose : iris-hollandais : preuves lot 2 | haiku | 28 | 143 k | 27 k | 0 | 2 (0.01 M) | 0.15 M | 0 % |
| general-purpose : iris-hollandais : preuves lot 3 | haiku | 39 | 135 k | 28 k | 0 | 2 (0.03 M) | 0.19 M | 0 % |
| general-purpose : iris-hollandais : photos 2 (organes, vues) | haiku | 42 | 142 k | 16 k | 17 | 4 (0.04 M) | 0.28 M | 1 % |
| general-purpose : iris-hollandais : preuves lot 4 | haiku | 44 | 136 k | 26 k | 0 | 3 (0.02 M) | 0.20 M | 0 % |
| general-purpose : iris-hollandais : preuves lot 5 | haiku | 56 | 150 k | 34 k | 12 | 5 (0.03 M) | 0.26 M | 1 % |
| general-purpose : iris-hollandais : coloris (SKU du bouquet) | haiku | 43 | 108 k | 20 k | 14 | 0 (0.00 M) | 0.14 M | 0 % |
| general-purpose : iris-hollandais : preuves lot 6 | haiku | 39 | 106 k | 20 k | 0 | 4 (0.02 M) | 0.13 M | 0 % |
| general-purpose : iris-hollandais : coloris relais (lot 1) | haiku | 25 | 124 k | 20 k | 10 | 1 (0.01 M) | 0.12 M | 0 % |
| general-purpose : iris-hollandais : preuves lot 7 | haiku | 60 | 114 k | 29 k | 0 | 2 (0.02 M) | 0.21 M | 0 % |
| general-purpose : iris-hollandais : coloris (3es photos des SKU) | haiku | 19 | 107 k | 9 k | 11 | 0 (0.00 M) | 0.08 M | 0 % |
| general-purpose : iris-hollandais : recensement (temps 2, regroupement) | sonnet | 41 | 129 k | 15 k | 0 | 6 (0.05 M) | 0.49 M | 1 % |
| orchestrateur · 2-modelage-attente-ram | opus | 29 | 258 k | 26 k | 0 | 0 (0.00 M) | 0.94 M | 2 % |
| general-purpose : iris-hollandais : coloris (représentants des lots 2 à 7) | haiku | 23 | 119 k | 17 k | 5 | 1 (0.01 M) | 0.11 M | 0 % |
| orchestrateur · 2-modelage | opus | 122 | 311 k | 86 k | 6 | 2 (0.07 M) | 4.40 M | 9 % |
| general-purpose : iris-hollandais : modelage | opus | 81 | 197 k | 27 k | 13 | 0 (0.00 M) | 2.03 M | 4 % |
| general-purpose : iris-hollandais : coloris (règle de teinte LCh) | haiku | 19 | 114 k | 10 k | 3 | 0 (0.00 M) | 0.09 M | 0 % |
| general-purpose : iris-hollandais : modelage (relais 2) | opus | 58 | 126 k | 14 k | 7 | 1 (0.02 M) | 0.96 M | 2 % |
| general-purpose : iris-hollandais : photos 3 (iNaturalist, organes) | haiku | 22 | 111 k | 14 k | 9 | 0 (0.00 M) | 0.09 M | 0 % |
| general-purpose : iris-hollandais : modelage (relais 3) | opus | 74 | 131 k | 17 k | 6 | 2 (0.04 M) | 1.23 M | 2 % |
| orchestrateur · 2-modelage-relais4-plante | opus | 89 | 256 k | 98 k | 7 | 2 (0.03 M) | 3.06 M | 6 % |
| general-purpose : iris-hollandais : modelage (relais 4, plante) | opus | 76 | 147 k | 19 k | 10 | 1 (0.02 M) | 1.42 M | 3 % |
| general-purpose : iris-hollandais : recensement (temps 3, sondage et fusion) | sonnet | 36 | 121 k | 17 k | 0 | 4 (0.05 M) | 0.41 M | 1 % |
| orchestrateur · 3-finition | opus | 49 | 270 k | 79 k | 20 | 1 (0.04 M) | 1.86 M | 4 % |
| general-purpose : iris-hollandais : finition (coloris) | sonnet | 58 | 142 k | 14 k | 2 | 1 (0.01 M) | 0.66 M | 1 % |
| general-purpose : iris-hollandais : contrôle qualité | haiku | 130 | 119 k | 17 k | 0 | 1 (0.00 M) | 0.40 M | 1 % |
| orchestrateur · 4-qa | opus | 111 | 441 k | 165 k | 7 | 5 (0.29 M) | 5.99 M | 12 % |
| general-purpose : iris-hollandais : photos 4 (fané) | haiku | 25 | 100 k | 10 k | 11 | 0 (0.00 M) | 0.09 M | 0 % |
| orchestrateur · 2-modelage-relais5-reprise | opus | 79 | 580 k | 98 k | 10 | 2 (0.12 M) | 5.24 M | 10 % |
| general-purpose : iris-hollandais : modelage (relais 5, reprise du porteur) | opus | 110 | 173 k | 28 k | 14 | 2 (0.04 M) | 2.29 M | 4 % |
| general-purpose : iris-hollandais : contrôle qualité (v2, jonction tête-tige) | haiku | 29 | 87 k | 6 k | 6 | 0 (0.00 M) | 0.08 M | 0 % |
| orchestrateur · 4-qa-v2 | opus | 6 | 448 k | 10 k | 2 | 0 (0.00 M) | 0.34 M | 1 % |
| general-purpose : iris-hollandais : modelage (relais 6, retours QA) | opus | 112 | 156 k | 23 k | 9 | 2 (0.05 M) | 2.11 M | 4 % |
| orchestrateur · 2-modelage-relais6-qa | opus | 19 | 426 k | 14 k | 2 | 0 (0.00 M) | 0.91 M | 2 % |
| general-purpose : iris-hollandais : contrôle qualité (v3) | haiku | 63 | 106 k | 9 k | 9 | 1 (0.00 M) | 0.18 M | 0 % |
| orchestrateur · 4-qa-v3 | opus | 60 | 446 k | 42 k | 2 | 1 (0.05 M) | 3.91 M | 8 % |
| general-purpose : iris-hollandais : modelage (relais 7, jonction au déclin et au fané) | opus | 83 | 145 k | 21 k | 13 | 4 (0.08 M) | 1.56 M | 3 % |
| orchestrateur · 2-modelage-relais7-gorge | opus | 28 | 489 k | 16 k | 0 | 0 (0.00 M) | 1.49 M | 3 % |
| general-purpose : iris-hollandais : contrôle qualité rapide (v4) | haiku | 16 | 69 k | 2 k | 0 | 0 (0.00 M) | 0.04 M | 0 % |
| orchestrateur · 4-qa-v4 | opus | 1 | 502 k | 0 k | 0 | 0 (0.00 M) | 0.05 M | 0 % |
| general-purpose : iris-hollandais : modelage (relais 8, budget de la plante) | opus | 76 | 119 k | 13 k | 3 | 1 (0.02 M) | 1.17 M | 2 % |
| general-purpose : iris-hollandais : contrôle qualité final (v5) | haiku | 20 | 72 k | 3 k | 0 | 0 (0.00 M) | 0.05 M | 0 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| orchestrateur · 1-refs | 19:28:16 → 21:23:03 | 114 min 47 s | 49 / 100 % | 2.1 Go | 9 / 43 % | 2 |
| general-purpose : iris-hollandais : photos (refs) | 19:29:17 → 20:15:59 | 46 min 42 s | 45 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| general-purpose : iris-hollandais : recensement (temps 1) | 19:29:18 → 20:06:31 | 37 min 13 s | 45 / 100 % | 3.3 Go | 7 / 41 % | 2 |
| general-purpose : iris-hollandais : preuves lot 1 | 20:13:55 → 20:27:26 | 13 min 31 s | 44 / 87 % | 2.9 Go | 9 / 43 % | 1 |
| general-purpose : iris-hollandais : preuves lot 2 | 20:13:55 → 20:21:39 | 7 min 44 s | 43 / 79 % | 3.7 Go | 7 / 13 % | 1 |
| general-purpose : iris-hollandais : preuves lot 3 | 20:25:12 → 20:35:48 | 10 min 36 s | 53 / 94 % | 2.9 Go | 13 / 43 % | 2 |
| general-purpose : iris-hollandais : photos 2 (organes, vues) | 20:25:12 → 21:31:59 | 66 min 47 s | 54 / 100 % | 2.1 Go | 10 / 43 % | 2 |
| general-purpose : iris-hollandais : preuves lot 4 | 20:28:43 → 20:48:54 | 20 min 11 s | 50 / 94 % | 3.5 Go | 9 / 21 % | 2 |
| general-purpose : iris-hollandais : preuves lot 5 | 20:37:20 → 20:49:50 | 12 min 30 s | 51 / 100 % | 2.1 Go | 8 / 36 % | 2 |
| general-purpose : iris-hollandais : coloris (SKU du bouquet) | 20:49:13 → 20:57:01 | 7 min 48 s | 59 / 100 % | 2.1 Go | 12 / 36 % | 1 |
| general-purpose : iris-hollandais : preuves lot 6 | 20:55:09 → 21:02:48 | 7 min 39 s | 59 / 93 % | 2.2 Go | 13 / 40 % | 0 |
| general-purpose : iris-hollandais : coloris relais (lot 1) | 21:04:07 → 21:12:36 | 8 min 29 s | 60 / 87 % | 3.0 Go | 10 / 34 % | 0 |
| general-purpose : iris-hollandais : preuves lot 7 | 21:04:07 → 21:14:37 | 10 min 30 s | 57 / 87 % | 2.9 Go | 10 / 34 % | 0 |
| general-purpose : iris-hollandais : coloris (3es photos des SKU) | 21:25:14 → 21:31:23 | 6 min 09 s | — | — | — | — |
| general-purpose : iris-hollandais : recensement (temps 2, regroupement) | 21:25:14 → 21:34:41 | 9 min 27 s | — | — | — | — |
| orchestrateur · 2-modelage-attente-ram | 21:36:30 → 22:02:40 | 26 min 10 s | 64 / 94 % | 1.9 Go | 9 / 25 % | 3 |
| general-purpose : iris-hollandais : coloris (représentants des lots 2 à 7) | 21:41:40 → 21:50:37 | 8 min 57 s | 64 / 90 % | 2.1 Go | 9 / 25 % | 0 |
| orchestrateur · 2-modelage | 22:03:26 → 23:04:53 | 61 min 27 s | 64 / 100 % | 3.1 Go | 17 / 55 % | 3 |
| general-purpose : iris-hollandais : modelage | 22:03:42 → 22:24:02 | 20 min 20 s | 65 / 100 % | 3.1 Go | 19 / 29 % | 3 |
| general-purpose : iris-hollandais : coloris (règle de teinte LCh) | 22:18:49 → 22:25:40 | 6 min 51 s | 62 / 93 % | 4.4 Go | 19 / 28 % | 3 |
| general-purpose : iris-hollandais : modelage (relais 2) | 22:24:53 → 22:36:58 | 12 min 05 s | 73 / 100 % | 4.3 Go | 23 / 34 % | 3 |
| general-purpose : iris-hollandais : photos 3 (iNaturalist, organes) | 22:27:17 → 22:35:59 | 8 min 42 s | 75 / 100 % | 4.3 Go | 24 / 34 % | 3 |
| general-purpose : iris-hollandais : modelage (relais 3) | 22:37:33 → 22:54:16 | 16 min 43 s | 64 / 100 % | 3.4 Go | 15 / 55 % | 2 |
| orchestrateur · 2-modelage-relais4-plante | 23:05:03 → 23:24:34 | 19 min 31 s | 47 / 100 % | 3.2 Go | 6 / 23 % | 2 |
| general-purpose : iris-hollandais : modelage (relais 4, plante) | 23:05:15 → 23:23:44 | 18 min 29 s | 47 / 100 % | 3.2 Go | 6 / 23 % | 2 |
| general-purpose : iris-hollandais : recensement (temps 3, sondage et fusion) | 23:06:00 → 23:13:01 | 7 min 01 s | 49 / 97 % | 3.5 Go | 6 / 15 % | 2 |
| orchestrateur · 3-finition | 23:24:37 → 23:37:25 | 12 min 48 s | 55 / 97 % | 3.8 Go | 8 / 47 % | 2 |
| general-purpose : iris-hollandais : finition (coloris) | 23:24:55 → 23:37:26 | 12 min 31 s | 55 / 97 % | 3.8 Go | 8 / 47 % | 2 |
| general-purpose : iris-hollandais : contrôle qualité | 23:37:57 → 23:53:00 | 15 min 03 s | 62 / 100 % | 3.3 Go | 8 / 28 % | 3 |
| orchestrateur · 4-qa | 23:38:15 → 00:25:14 | 46 min 59 s | 54 / 100 % | 3.3 Go | 8 / 63 % | 3 |
| general-purpose : iris-hollandais : photos 4 (fané) | 00:07:53 → 00:18:24 | 10 min 31 s | 48 / 96 % | 4.0 Go | 6 / 14 % | 3 |
| orchestrateur · 2-modelage-relais5-reprise | 00:25:34 → 00:47:16 | 21 min 42 s | 59 / 100 % | 3.4 Go | 12 / 29 % | 3 |
| general-purpose : iris-hollandais : modelage (relais 5, reprise du porteur) | 00:25:49 → 00:47:38 | 21 min 49 s | 59 / 100 % | 3.4 Go | 12 / 29 % | 3 |
| general-purpose : iris-hollandais : contrôle qualité (v2, jonction tête-tige) | 00:48:19 → 00:55:53 | 7 min 34 s | 53 / 90 % | 4.1 Go | 10 / 18 % | 2 |
| orchestrateur · 4-qa-v2 | 00:53:40 → 00:55:28 | 1 min 48 s | 38 / 63 % | 5.4 Go | 7 / 10 % | 0 |
| general-purpose : iris-hollandais : modelage (relais 6, retours QA) | 00:58:32 → 01:23:32 | 25 min 00 s | 38 / 100 % | 3.9 Go | 7 / 16 % | 3 |
| orchestrateur · 2-modelage-relais6-qa | 00:58:37 → 01:14:40 | 16 min 03 s | 42 / 100 % | 3.9 Go | 7 / 16 % | 3 |
| general-purpose : iris-hollandais : contrôle qualité (v3) | 01:24:20 → 01:37:04 | 12 min 44 s | 39 / 83 % | 3.8 Go | 7 / 21 % | 2 |
| orchestrateur · 4-qa-v3 | 01:26:54 → 03:13:02 | 106 min 08 s | 22 / 82 % | 3.8 Go | 6 / 21 % | 2 |
| general-purpose : iris-hollandais : modelage (relais 7, jonction au déclin et au fané) | 03:13:20 → 03:32:15 | 18 min 55 s | 13 / 55 % | 4.8 Go | 4 / 11 % | 1 |
| orchestrateur · 2-modelage-relais7-gorge | 03:13:21 → 03:17:26 | 4 min 05 s | 20 / 38 % | 4.8 Go | 7 / 11 % | 1 |
| general-purpose : iris-hollandais : contrôle qualité rapide (v4) | 03:33:03 → 03:35:57 | 2 min 54 s | 20 / 51 % | 3.3 Go | 4 / 10 % | 1 |
| orchestrateur · 4-qa-v4 | 03:34:23 → 03:34:23 | 0 min 00 s | — | — | — | — |
| general-purpose : iris-hollandais : modelage (relais 8, budget de la plante) | 03:42:33 → 03:56:48 | 14 min 15 s | 13 / 42 % | 5.0 Go | 4 / 7 % | 1 |
| general-purpose : iris-hollandais : contrôle qualité final (v5) | 03:59:59 → 04:02:51 | 2 min 52 s | 21 / 48 % | 4.1 Go | 6 / 9 % | 1 |

Durée totale : 515 min. Somme des durées des groupes : 940 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 1202 | 20.19 M | 40 % | 44 appels, 0.58 M |
| navigateur | 133 | 5.62 M | 11 % | 6 appels, 0.24 M |
| image | 219 | 4.19 M | 8 % | 0 appels, 0.00 M |
| réponse | 94 | 3.95 M | 8 % | 1 appels, 0.03 M |
| qa | 119 | 2.30 M | 5 % | 1 appels, 0.00 M |
| git | 54 | 2.22 M | 4 % | 1 appels, 0.04 M |
| orchestration | 57 | 2.19 M | 4 % | 0 appels, 0.00 M |
| édition code | 78 | 2.01 M | 4 % | 13 appels, 0.30 M |
| rendu | 112 | 1.95 M | 4 % | 1 appels, 0.02 M |
| build | 46 | 1.95 M | 4 % | 1 appels, 0.05 M |
| lecture code | 85 | 1.55 M | 3 % | 5 appels, 0.13 M |
| get_usage | 8 | 0.72 M | 1 % | 0 appels, 0.00 M |
| web | 42 | 0.40 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 33 | 0.39 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 8 | 0.32 M | 1 % | 0 appels, 0.00 M |
| bill | 8 | 0.31 M | 1 % | 0 appels, 0.00 M |
| Monitor | 82 | 0.22 M | 0 % | 0 appels, 0.00 M |
| ToolSearch | 12 | 0.15 M | 0 % | 1 appels, 0.00 M |
| wikimedia | 19 | 0.13 M | 0 % | 0 appels, 0.00 M |
| mesure | 22 | 0.12 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.05 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| read_widget_context | 2 | 0.00 M | 0 % | 0 appels, 0.00 M |
| read_me | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| ToolSearch_placeholder | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |
| mark_chapter | 1 | 0.00 M | 0 % | 0 appels, 0.00 M |

**Total : 50.97 M**, dont 74 appels de retouche après erreur (1.38 M, 3 %).
