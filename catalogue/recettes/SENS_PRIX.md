# Sens et prix des fleurs — format

Fichiers `sens_prix_XX.json` (UTF-8, tableaux), une entrée par id de `ids.tsv`. Ils alimentent :
- les cartes du catalogue « Composer » (sens affiché, occasions mises en avant) ;
- le prix réel des bouquets (prix à la tige × nombre de tiges décidé par l'algorithme).

```json
{
  "id": "rose-standard",
  "prix": 4.5,
  "sens": "Amour et admiration",
  "sens_couleur": {"rouge": "Amour passionné", "blanc": "Pureté, respect", "jaune": "Amitié joyeuse", "rose": "Tendresse, gratitude"},
  "occ": ["amour", "anniv", "merci"],
  "eviter": [],
  "note": "Fleur de Vénus ; le sens varie avec la couleur depuis le langage des fleurs du XIXe siècle."
}
```

| clé | sens |
|---|---|
| `id` | id exact de `ids.tsv` |
| `prix` | prix de détail TTC **d'une tige** chez un fleuriste en France en 2026, en euros, arrondi à 0,10 € |
| `sens` | signification dans un bouquet, en français, 38 caractères au plus, sans point final |
| `sens_couleur` | facultatif : seulement quand la couleur change vraiment le sens ; clés parmi `blanc`, `rose`, `fuchsia`, `rouge`, `bordeaux`, `peche`, `orange`, `jaune`, `vert`, `bleu`, `violet`, `noir` ; valeurs de 38 caractères au plus |
| `occ` | 1 à 3 occasions où la fleur a le plus de sens, parmi `amour` (Je t'aime), `anniv` (Anniversaire), `merci` (Merci), `bravo` (Félicitations), `courage` (Courage, réconfort), `juste` (Juste comme ça) |
| `eviter` | occasions où elle serait maladroite en France (liste éventuellement vide) |
| `note` | 90 caractères au plus : d'où vient ce sens (tradition, mythe, usage) ou « sens d'usage » si aucun sens traditionnel n'existe |

## Repères de prix (détail TTC à la tige, fleuriste en France, 2026)

Ajuster dans la fourchette avec `gamme_prix` (€ → bas, €€€€ → haut), `rarete_jeu`, la saison et la taille ; prendre le milieu en cas de doute.

- Roses : standard 3,50–5 ; intermédiaire courte 2,50–3,50 ; branchue 4,50–6,50 ; jardin, anglaise, japonaise 7–12 ; ancienne parfumée 5–8 ; stabilisée ou teintée 7–10.
- Tulipes : simple 2–2,80 ; française, double, perroquet, frangée, fleur de lis 3,50–5,50.
- Pivoine herbacée 6–10 ; arbustive 10–16. Renoncule 3,50–5 (Butterfly, Cloni 4,50–7). Anémone 3–4,50.
- Lis oriental 8–12 ; asiatique et LA 5–7 ; longiflorum 7–10 ; OT 9–13.
- Lisianthus 4,50–6,50. Œillet standard 2–3 ; spray 2,50–3,50 ; œillet de poète 3–4.
- Chrysanthème disbud 4–6 ; araignée 5–7 ; santini et spray 3–4,50.
- Gerbera 2,50–3,50 ; germini 2–2,50. Tournesol 3,50–5. Dahlia 4–7 (assiette, café au lait 6–9).
- Hortensia frais 9–15 ; stabilisé 12–20.
- Delphinium 5–8 ; muflier 3–4,50 ; glaïeul 3–5 ; érémurus 7–10 ; digitale 4–6.
- Freesia 2,50–3,50 ; muguet 1,50–2,50 le brin ; jacinthe 3–4 ; muscari 1,50–2,50 ; narcisse 1,50–2,50 ; iris 2,50–3,50 ; alstroemère 2,50–3,50.
- Orchidées : phalaenopsis (tige multiflore) 18–30 ; cymbidium 20–35 (mini 12–18) ; dendrobium 6–9 ; vanda 14–22 ; mokara et arachnis 6–9 ; oncidium 7–10 ; cattleya, paphiopedilum 15–25.
- Anthurium 7–12 ; calla 5–8 ; héliconia 10–18 ; strelitzia 7–10 ; gingembre 8–12 ; protée royale 15–25 ; autres protées 8–14 ; leucospermum 6–9 ; leucadendron 4–6 ; banksia 9–14.
- Remplissage : gypsophile 5–8 ; statice 3–4 ; solidago 2,50–3,50 ; ammi, carotte sauvage 3,50–4,50 ; matricaire 2,50–3,50 ; waxflower 4–6 ; astrance 4–5,50 ; scabieuse 3,50–5 ; panicaut 4–5,50 ; craspedia 3–4 ; échinops 4–5 ; achillée, orpin 3–4.
- Feuillages : eucalyptus 3–5 ; ruscus, danaé 2–3 ; pittosporum 3–4 ; salal 2–3 ; asparagus 3–4 ; fougères 2–3 ; monstera, philodendron, alocasia (feuille) 5–9 ; palmes 6–10 ; aspidistra 3–4,50 ; lierre 2–3 ; olivier 4–6.
- Branches : saule 3–5 ; cornouiller 3–5 ; noisetier tortueux 6–9 ; cerisier, pommier, prunus en fleurs 8–15 ; magnolia 12–20 ; mimosa 6–10 ; coton 7–12 ; bouleau 4–6.
- Baies : millepertuis 3–4,50 ; houx 5–8 ; symphorine 4–6 ; ilex verticillata 8–12 ; cynorhodon 5–7.
- Séchés et graminées : pampa 6–12 ; lagurus 2–3 ; phalaris 3–4 ; blé 1,50–2,50 ; monnaie-du-pape 5–8 ; capsules de pavot 3–5 ; massette 3–4.
- Accessoires (fil, ruban, papier, plume, perles) : 2–5 la pièce.

## Repères de sens

- Langage des fleurs français classique (Charlotte de La Tour, 1819) et usage moderne des fleuristes ; préférer le sens moderne quand ils divergent (rose jaune : amitié et joie, pas infidélité).
- En France, le chrysanthème est associé au deuil et à la Toussaint : mettre `amour`, `anniv`, `bravo` dans `eviter` sauf pour les petites variétés spray ou araignée très décoratives (alors seulement `amour`).
- Feuillages et branches ont aussi un sens (eucalyptus : protection, lierre : fidélité, olivier : paix, laurier : victoire, fougère : sincérité, saule : liberté…).
- Ne pas inventer de mythe ; si rien n'existe, écrire un sens sobre tiré du caractère de la plante et noter « sens d'usage ».
