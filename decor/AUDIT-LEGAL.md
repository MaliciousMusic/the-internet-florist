# Audit légal, accessibilité et référencement du site (16 octobre 2026)

Audit du site de la boutique (`decor/scene/`). Il recense ce qui est fait, ce que le porteur doit encore fournir ou
décider, et ce qui reste à construire. Je ne suis pas avocat : les textes de `legal.html` sont à faire relire par un
juriste avant l'ouverture des ventes. C'est la version française qui fait foi.

## Ce qui est fait

- **Cinq langues**, chacune avec ses adresses propres :
  - anglais à la racine ;
  - français, espagnol, chinois simplifié et allemand dans `fr/`, `es/`, `zh/` et `de/`.
- **Choix automatique de la langue** par `_worker.js` sur Cloudflare Pages :
  - le pays de l'adresse IP décide ;
  - dans les pays à plusieurs langues (Belgique, Suisse, Canada, Luxembourg) et les pays non listés, la langue du
    navigateur décide ;
  - sinon, l'anglais ;
  - un choix fait à la main dans le pied de page est gardé dans le cookie `lang` (un an) ;
  - les robots ne sont jamais redirigés.

  Ces règles sont vérifiées par `worker-test.mjs`.
- **Prix** : en ETH, sans TVA (art. 293 B du CGI), puis le même prix en euros dans la zone euro et en dollars ailleurs. C'est
  ce qui règle l'obligation d'afficher les euros en France.
- **Mentions légales complètes** : entrepreneur individuel Hadrien Lonjaret (nom commercial Agent 33), adresse,
  e-mail, téléphone, SIREN, RCS, numéro de TVA, directeur de la publication, hébergeur.
- **CGV** :
  - prix sans TVA (franchise en base, art. 293 B du CGI) ;
  - le bouquet appartient à qui détient le jeton, sans licence particulière ; seuls les droits d'auteur sur le dessin
    restent à l'auteur, comme pour un tableau ;
  - livraison et reçu ;
  - rétractation ;
  - conformité ;
  - droit applicable, avec la version française qui prévaut.
- **Case de renonciation** au droit de rétractation (L221-28, 13°) :
  - « Acheter » ouvre un volet « Avant de payer » ;
  - la case n'est pas cochée par défaut, et « Confirmer et payer » refuse de continuer tant qu'elle ne l'est pas ;
  - la mention « En payant, vous confirmez être majeur et accepter les CGV » l'accompagne ;
  - l'heure et le texte du consentement sont gardés pour le reçu.
- **Reçu sur support durable** (L221-13) : `Boutique.recu()` produit une page à télécharger, dans la langue du
  visiteur, avec le bouquet, le prix (sans TVA), la date, le portefeuille, la transaction, le vendeur, la renonciation et le
  lien des CGV. Il sera appelé après le paiement Seaport, qui n'est pas encore câblé : pour l'instant, « bientôt ».
- **Confidentialité** :
  - pays lu à la volée et jamais stocké ;
  - un seul cookie, celui de la langue, que la CNIL exempte de consentement ;
  - CoinGecko, portefeuille, droits, CNIL.
- **Accessibilité et SEO/GEO** :
  - textes alternatifs et noms parlés dans chaque langue ;
  - `hreflang` sur chaque page et dans `sitemap.xml` ;
  - JSON-LD par langue ;
  - FAQ ;
  - `llms.txt` et `robots.txt` ouvert aux robots des assistants ;
  - en-têtes de sécurité, posés par le worker.
- **Outils** :
  - `node decor/scene/build.mjs` écrit les 20 pages depuis `gabarits/` et `langues/<code>.mjs` (plus `sitemap.xml` et
    `llms.txt`), à lancer après chaque `predessin.mjs` ;
  - `node decor/scene/worker-test.mjs` teste le worker.

## Reste au porteur

1. **Médiateur de la consommation** : l'adhésion est obligatoire, et l'article 11 des CGV attend son nom. Sans lui,
   l'amende peut aller jusqu'à 3 000 € pour une personne physique. CM2C affichait 40 € HT pour trois ans en 2022 pour
   moins de 10 salariés ; tarif à confirmer.
2. **Activité déclarée** : l'entreprise est immatriculée en conseil (APE 7022Z). Il faut ajouter l'activité de vente
   d'œuvres numériques sur le guichet unique (INPI).
3. **TVA** : micro-entreprise en franchise en base (porteur, 16 octobre). Aucune TVA n'est facturée, et les pages et
   le reçu portent « TVA non applicable, art. 293 B du CGI » dans les cinq langues.
   - À surveiller : le seuil de la franchise pour les services, environ 37 500 € par an, à vérifier chaque année.
     Au-delà, la TVA s'applique.
   - Au-delà de 10 000 € par an de ventes à des particuliers d'autres pays de l'UE, c'est la TVA de leur pays qui
     s'applique, par le guichet OSS, même en franchise.
   - Payée en ETH, une vente compte dans le chiffre d'affaires pour sa valeur en euros au jour de l'encaissement.
4. **Coordonnées publiées** : l'adresse du domicile et le portable sont maintenant publics, comme la loi l'exige. Une
   adresse de domiciliation et un numéro dédié les remplaceraient si besoin.
5. **Relecture** des CGV par un juriste, en particulier la version française.

## À faire ensuite

- **Paiement Seaport** : il faudra appeler `Boutique.recu()` après la transaction et ajouter les hôtes de Seaport,
  d'OpenSea et du réseau Base à la CSP du worker.
- **Belai Bureau** est en français alors que la page le présente dans cinq langues : le dire suffit pour l'instant, la
  page le dit. À traduire dans le chantier du widget.
- **CoinGecko** : clé de démonstration, à servir par le worker plutôt que par le navigateur.
- **Déploiement** : la racine publiée doit être `scene/`, avec le dossier `out/` copié dedans (les pages lisent
  `../out/`, ce qui donne `/out/` à la racine).
- **Nom et domaine** : « Belai's Garden » et `belai.garden` sont provisoires. Ils sont écrits dans `build.mjs`,
  `robots.txt` et `site.webmanifest`.
- **Noms des bouquets** : restés en français dans toutes les langues.
- **Vase aux danseuses** : le modèle de René Lalique (1927) est dans le domaine public, mais ne jamais employer le nom
  « Lalique », qui est une marque.
- **Accessibilité** : l'European Accessibility Act exempte les microentreprises. Un test au lecteur d'écran reste à faire
  quand l'achat sera câblé.

## Sources

- [Information sur les prix, préfecture des Hauts-de-Seine](https://www.hauts-de-seine.gouv.fr/contenu/telechargement/23864/169784/file/L'information%20sur%20les%20prix.pdf)
- [Fermeture de la plateforme RLL, CMS](https://cms.law/en/svk/legal-updates/the-odr-platform-is-closing-what-businesses-need-to-know)
- [Tarifs de l'API CoinGecko (attribution exigée)](https://www.coingecko.com/en/api/pricing)
- [Rescrit TVA sur les NFT, Deloitte Avocats](https://blog.avocats.deloitte.fr/nft-rescrit-tva/)
- [Médiation de la consommation, tarifs CM2C (fiche CAPEB 2022)](https://www.capeb.fr/www/capeb/media//eure/document/CAPEB%20%20Mediation%20Consommation%20janv%202022.pdf)
- [Médiation et micro-entrepreneurs, Copeps](https://copeps.fr/actualites/mediateur-consommation-auto-entrepreneur/)
