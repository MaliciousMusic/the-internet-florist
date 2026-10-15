# Facture en tokens : tulipe-frangee

Fenêtre 2026-10-08T13:48:21 → 2026-10-09T00:36:38 (UTC). Unité : token « équivalent entrée Opus » (M = million).

## Par étape et par agent

| Groupe | Modèle | Appels | Contexte moyen | Sortie | Images lues | Retouches après erreur | Équivalent | Part |
|---|---|---|---|---|---|---|---|---|
| general-purpose : tulipe-frangee : recensement | sonnet | 240 | 331 k | 67 k | 18 | 8 (0.19 M) | 5.70 M | 10 % |
| orchestrateur · 1-recensement | opus | 44 | 367 k | 68 k | 0 | 0 (0.00 M) | 2.12 M | 4 % |
| general-purpose : tulipe-frangee : photos | haiku | 106 | 169 k | 41 k | 13 | 9 (0.04 M) | 0.46 M | 1 % |
| general-purpose : tulipe-frangee : coloris | haiku | 69 | 192 k | 42 k | 19 | 5 (0.03 M) | 0.41 M | 1 % |
| orchestrateur · 2-coloris | opus | 87 | 446 k | 127 k | 1 | 1 (0.06 M) | 4.69 M | 8 % |
| general-purpose : tulipe-frangee : photos complément | haiku | 181 | 210 k | 47 k | 16 | 11 (0.05 M) | 0.94 M | 2 % |
| general-purpose : tulipe-frangee : marques déposées | sonnet | 175 | 298 k | 52 k | 0 | 11 (0.22 M) | 3.61 M | 6 % |
| general-purpose : tulipe-frangee : modelage | opus | 97 | 211 k | 25 k | 13 | 2 (0.04 M) | 2.46 M | 4 % |
| orchestrateur · 3-modelage | opus | 23 | 491 k | 26 k | 0 | 0 (0.00 M) | 1.30 M | 2 % |
| general-purpose : tulipe-frangee : modelage relais 1 | opus | 63 | 116 k | 13 k | 7 | 2 (0.04 M) | 0.94 M | 2 % |
| orchestrateur · 4-finition | opus | 30 | 646 k | 27 k | 3 | 3 (0.21 M) | 2.81 M | 5 % |
| general-purpose : tulipe-frangee : finition | sonnet | 94 | 247 k | 29 k | 10 | 4 (0.07 M) | 1.70 M | 3 % |
| general-purpose : tulipe-frangee : photos d'organes | haiku | 27 | 91 k | 7 k | 2 | 1 (0.00 M) | 0.07 M | 0 % |
| general-purpose : tulipe-frangee : recensement fusion KAVB | sonnet | 47 | 170 k | 30 k | 4 | 5 (0.06 M) | 0.73 M | 1 % |
| orchestrateur · 5-plante-sourcing | opus | 76 | 182 k | 83 k | 185 | 3 (0.10 M) | 2.28 M | 4 % |
| general-purpose : tulipe-frangee : plante v2 | opus | 126 | 193 k | 28 k | 26 | 7 (0.15 M) | 2.86 M | 5 % |
| orchestrateur · 6-plante-v2 | opus | 141 | 220 k | 150 k | 0 | 4 (0.12 M) | 4.24 M | 8 % |
| general-purpose : tulipe-frangee : finition budget fané | sonnet | 47 | 138 k | 9 k | 3 | 0 (0.00 M) | 0.54 M | 1 % |
| orchestrateur · 7-budget-fane | opus | 48 | 293 k | 34 k | 1 | 0 (0.00 M) | 1.65 M | 3 % |
| orchestrateur · 8-qa | opus | 278 | 323 k | 332 k | 39 | 8 (0.34 M) | 11.36 M | 20 % |
| general-purpose : tulipe-frangee : finition budget flammes | sonnet | 48 | 141 k | 10 k | 3 | 0 (0.00 M) | 0.56 M | 1 % |
| orchestrateur · 9-correctif-budget-flammes | opus | 72 | 537 k | 105 k | 4 | 3 (0.17 M) | 4.55 M | 8 % |

## Durée et charge du PC (relevé `res.ps1` toutes les 15 s ; « — » : pas de relevé sur cette fenêtre)

| Groupe | Début → fin (UTC) | Durée | CPU moyen / max | RAM libre min | GPU 3D moyen / max | Chrome sans fenêtre max |
|---|---|---|---|---|---|---|
| general-purpose : tulipe-frangee : recensement | 13:48:24 → 21:58:19 | 489 min 55 s | 39 / 100 % | 1.5 Go | 7 / 52 % | 3 |
| orchestrateur · 1-recensement | 13:52:49 → 15:03:29 | 70 min 40 s | 36 / 100 % | 2.9 Go | 7 / 28 % | 1 |
| general-purpose : tulipe-frangee : photos | 14:33:29 → 15:14:00 | 40 min 31 s | 39 / 97 % | 4.0 Go | 7 / 33 % | 1 |
| general-purpose : tulipe-frangee : coloris | 15:07:02 → 15:39:24 | 32 min 22 s | 32 / 82 % | 4.0 Go | 4 / 33 % | 2 |
| orchestrateur · 2-coloris | 15:07:02 → 16:34:29 | 87 min 27 s | 36 / 93 % | 3.2 Go | 6 / 33 % | 2 |
| general-purpose : tulipe-frangee : photos complément | 15:17:20 → 16:08:01 | 50 min 41 s | 37 / 93 % | 3.7 Go | 5 / 28 % | 2 |
| general-purpose : tulipe-frangee : marques déposées | 15:48:07 → 17:10:26 | 82 min 19 s | 34 / 93 % | 1.5 Go | 6 / 28 % | 2 |
| general-purpose : tulipe-frangee : modelage | 16:37:44 → 16:55:34 | 17 min 50 s | 29 / 59 % | 3.7 Go | 4 / 14 % | 1 |
| orchestrateur · 3-modelage | 16:40:06 → 17:12:57 | 32 min 51 s | 26 / 85 % | 1.5 Go | 4 / 48 % | 2 |
| general-purpose : tulipe-frangee : modelage relais 1 | 17:02:29 → 17:12:12 | 9 min 43 s | 32 / 85 % | 1.5 Go | 4 / 48 % | 2 |
| orchestrateur · 4-finition | 17:13:16 → 18:50:24 | 97 min 08 s | 35 / 96 % | 3.7 Go | 8 / 52 % | 3 |
| general-purpose : tulipe-frangee : finition | 17:13:39 → 17:39:03 | 25 min 24 s | 30 / 74 % | 5.0 Go | 8 / 19 % | 2 |
| general-purpose : tulipe-frangee : photos d'organes | 19:11:24 → 19:15:40 | 4 min 16 s | 35 / 61 % | 4.4 Go | 5 / 11 % | 1 |
| general-purpose : tulipe-frangee : recensement fusion KAVB | 19:11:25 → 19:31:37 | 20 min 12 s | 35 / 87 % | 3.1 Go | 8 / 33 % | 1 |
| orchestrateur · 5-plante-sourcing | 19:13:58 → 20:08:25 | 54 min 27 s | 42 / 100 % | 3.1 Go | 7 / 41 % | 2 |
| general-purpose : tulipe-frangee : plante v2 | 20:10:15 → 20:34:15 | 24 min 00 s | 46 / 88 % | 2.9 Go | 9 / 43 % | 2 |
| orchestrateur · 6-plante-v2 | 20:13:58 → 22:13:29 | 119 min 31 s | 58 / 100 % | 1.9 Go | 11 / 43 % | 3 |
| general-purpose : tulipe-frangee : finition budget fané | 22:23:28 → 22:38:04 | 14 min 36 s | 73 / 100 % | 4.3 Go | 22 / 34 % | 3 |
| orchestrateur · 7-budget-fane | 22:24:54 → 22:49:04 | 24 min 10 s | 68 / 100 % | 3.4 Go | 19 / 55 % | 3 |
| orchestrateur · 8-qa | 22:53:19 → 00:03:44 | 70 min 25 s | 54 / 100 % | 3.2 Go | 8 / 47 % | 3 |
| general-purpose : tulipe-frangee : finition budget flammes | 00:17:11 → 00:33:22 | 16 min 11 s | 59 / 100 % | 3.4 Go | 12 / 63 % | 3 |
| orchestrateur · 9-correctif-budget-flammes | 00:18:41 → 00:36:30 | 17 min 49 s | 61 / 100 % | 3.4 Go | 12 / 63 % | 3 |

Durée totale : 648 min. Somme des durées des groupes : 1402 min (au-dessus de la durée totale : du travail en parallèle).

## Par activité

| Activité | Appels | Équivalent | Part | Dont après erreur |
|---|---|---|---|---|
| bash | 1160 | 26.40 M | 47 % | 63 appels, 1.13 M |
| réponse | 137 | 5.82 M | 10 % | 1 appels, 0.03 M |
| navigateur | 115 | 4.57 M | 8 % | 6 appels, 0.26 M |
| image | 174 | 3.84 M | 7 % | 0 appels, 0.00 M |
| orchestration | 59 | 2.50 M | 4 % | 0 appels, 0.00 M |
| git | 61 | 2.23 M | 4 % | 2 appels, 0.09 M |
| build | 52 | 1.76 M | 3 % | 0 appels, 0.00 M |
| édition code | 59 | 1.76 M | 3 % | 9 appels, 0.31 M |
| rendu | 63 | 1.38 M | 2 % | 1 appels, 0.02 M |
| qa | 20 | 1.01 M | 2 % | 0 appels, 0.00 M |
| lecture code | 50 | 0.98 M | 2 % | 3 appels, 0.03 M |
| web | 39 | 0.85 M | 2 % | 0 appels, 0.00 M |
| AskUserQuestion | 11 | 0.54 M | 1 % | 0 appels, 0.00 M |
| SendUserFile | 10 | 0.50 M | 1 % | 0 appels, 0.00 M |
| bill | 11 | 0.43 M | 1 % | 0 appels, 0.00 M |
| get_usage | 9 | 0.36 M | 1 % | 0 appels, 0.00 M |
| SubagentHandback | 19 | 0.30 M | 1 % | 0 appels, 0.00 M |
| mesure | 19 | 0.29 M | 1 % | 0 appels, 0.00 M |
| wikimedia | 19 | 0.18 M | 0 % | 2 appels, 0.01 M |
| ToolSearch | 7 | 0.13 M | 0 % | 0 appels, 0.00 M |
| Monitor | 23 | 0.11 M | 0 % | 0 appels, 0.00 M |
| ListAgents | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |
| Skill | 1 | 0.02 M | 0 % | 0 appels, 0.00 M |

**Total : 55.99 M**, dont 87 appels de retouche après erreur (1.89 M, 3 %).
