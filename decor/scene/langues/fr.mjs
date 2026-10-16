// The site's words in French: the source of the other languages (fr, es, zh, de have the same keys). build.mjs writes
// the pages from gabarits/ with them; the runtime strings (js) go into each page as a JSON block read by entete.js and
// boutique.js. In the HTML strings: {{p}} is the page's language prefix ('' or 'fr/'...), {{legal}} the legal page with
// that prefix; in the runtime strings, {name} and the like are filled in by the scripts. Product names stay as they are.
export default {
  code: 'fr',
  name: 'Français',
  locale: 'fr-FR',
  ogLocale: 'fr_FR',
  // a list of words as the language writes it: "a, b et c"
  list: (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} et ${a[a.length - 1]}`),
  more: 'autres',
  describe: ({ stems, flowers, vase }) =>
    `Un bouquet numérique unique de ${stems} tiges dessinées à la main (${flowers}) dans ${vase}. Il vit trois mois, puis reste fané pour de bon.`,

  pages: {
    index: {
      title: "Bouquet de fleurs numérique, dessiné tige à tige | Belai's Garden",
      description: 'Bouquets de fleurs numériques dessinés tige à tige d’après de vraies fleurs. Uniques, nouveaux chaque jour, à collectionner sur Base et à poser sur le bureau.',
      ogTitle: 'Bouquets de fleurs numériques, dessinés tige à tige',
      ogDescription: 'Chaque jour, de nouveaux bouquets uniques, chacun dans un vrai vase. Regardez-les fleurir, collectionnez-en un, posez-le sur votre bureau.',
    },
    about: {
      title: "À propos : bouquets numériques d’après nature | Belai's Garden",
      description: 'Comment naissent nos bouquets numériques : des fleurs dessinées en code d’après de vraies photos, de vrais vases, le prix des tiges, trois mois de vie.',
      ogTitle: 'À propos de nos bouquets numériques',
      ogDescription: 'Chaque fleur dessinée en code d’après de vraies photos. Des bouquets uniques, dans de vrais vases, qui fleurissent puis fanent.',
    },
    desktop: {
      title: 'Widget bouquet de fleurs pour le bureau Windows | Belai Bureau',
      description: 'Belai Bureau, widget gratuit pour Windows 10 et 11 : posez sur votre bureau le bouquet de fleurs numérique que vous avez collectionné. Placez, ajustez, fixez.',
      ogTitle: 'Votre bouquet de fleurs sur votre bureau',
      ogDescription: 'Un widget Windows gratuit pour votre bouquet numérique : placez-le, ajustez sa taille, fixez-le.',
    },
    legal: {
      title: "Mentions légales, CGV et confidentialité | Belai's Garden",
      description: "Mentions légales, conditions générales de vente des bouquets numériques, politique de confidentialité, licence Belai Bureau et accessibilité de Belai's Garden.",
      ogTitle: 'Mentions légales, CGV et confidentialité',
      ogDescription: 'Qui nous sommes, comment un bouquet est vendu, ce que nous faisons des données.',
    },
  },
  shareAlt: 'Le bouquet Ronde bleue : lilas, iris, anémones et jacinthes dans un vase en verre dépoli aux danseuses',
  orgDescription: 'Des bouquets de fleurs numériques dessinés tige à tige d’après de vraies fleurs, à collectionner sur Base.',
  listName: 'Bouquets du jour',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden : des bouquets de fleurs numériques vivants",
    intro:
      'Des bouquets de fleurs numériques dessinés tige à tige d’après de vraies fleurs. Chaque jour, de nouveaux bouquets uniques, chacun dans un vrai vase, à collectionner sur Base. Un bouquet vit trois mois, puis reste fané pour toujours. Posez le vôtre sur le bureau de votre ordinateur avec Belai Bureau, un widget gratuit pour Windows.',
    noscript:
      'Ce jardin a besoin de JavaScript pour faire fleurir les bouquets. Lisez <a href="{{p}}about.html">la présentation des bouquets</a>, découvrez <a href="{{p}}desktop.html">comment en poser un sur votre bureau</a>, ou consultez les <a href="{{legal}}">mentions légales et conditions de vente</a>.',
    galleryLabel: 'Bouquets du jour',
    lookCloser: 'Regarder le bouquet de plus près',
    open: 'Ouvrir',
    shelvesLabel: 'Étagères',
    budVases: 'Les soliflores arrivent bientôt : une seule fleur dans son vase.',
    noneCollected: 'Aucun bouquet n’a encore trouvé son collectionneur.',
    seeOpenSea: 'Voir la collection sur OpenSea',
    onDesktop: 'Sur votre bureau',
    buy: 'Acheter',
    royalties: '0 % de royalties à la revente',
    demoTitle: 'Votre bouquet sur votre bureau',
    closeVideo: 'Fermer la vidéo',
    videoMissing: 'La vidéo arrive bientôt : elle montrera comment poser votre bouquet sur le bureau de votre ordinateur.',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: 'Avant de payer',
    waiver: 'Je demande que mon bouquet me soit livré immédiatement, et je reconnais perdre ainsi mon droit de rétractation de 14 jours.',
    accept: 'En payant, vous confirmez être majeur et accepter les <a href="{{legal}}#terms">conditions générales de vente</a>.',
    confirm: 'Confirmer et payer',
    cancel: 'Annuler',
  },

  // ---------- the About page
  about: {
    h1: 'À propos',
    lead: 'Des bouquets dessinés fleur par fleur, qui s’épanouissent sous vos yeux.',
    body: `<h2>Des fleurs dessinées d’après nature</h2>
  <p>Chaque fleur de ce jardin est dessinée en code, trait par trait, d’après de vraies photos : la forme des pétales, leurs
    couleurs mesurées sur chaque variété, les boutons, la fleur ouverte et la fleur fanée. Plus de cinq cents espèces
    poussent déjà dans le jardin.</p>

  <h2>Des bouquets uniques chaque jour</h2>
  <p>Chaque jour, de nouveaux bouquets sont composés, chacun dans un vrai vase, comme la carpe en bronze. Chaque bouquet est
    unique : la place de chaque tige, de chaque fleur et de chaque feuille ne se retrouve dans aucun autre.</p>

  <h2>Un bouquet vivant</h2>
  <p>Un bouquet vit trois mois à compter de sa frappe : un compte à rebours, en heures et en minutes, indique le temps
    qu’il lui reste. Il reste ensuite fané et immobile, pour de bon.</p>

  <h2>Le prix des vraies tiges</h2>
  <p>Le prix d’un bouquet est la somme de ce que coûtent ses tiges chez un fleuriste en France. Le vase est offert. À la
    revente, nous ne prenons rien : 0 % de royalties.</p>

  <h2>Collectionner un bouquet</h2>
  <p>Les bouquets sont des NFT sur le réseau Base, proposés sur notre page OpenSea. Vous les réglerez ici même, depuis
    votre portefeuille, sans quitter le site.</p>

  <h2>Sur votre bureau</h2>
  <p>Avec <a href="{{p}}desktop.html">Belai Bureau</a>, un widget gratuit pour Windows, le bouquet que vous avez collectionné
    trône sur le bureau de votre ordinateur, à la taille de votre choix, devant ou derrière vos fenêtres.</p>

  <h2>Faire grandir le jardin</h2>
  <p>Chaque bouquet collectionné aide le jardin à grandir : de nouvelles espèces, de nouveaux vases, de nouveaux bouquets.</p>`,
    faqTitle: 'Questions',
    faq: [
      ['Qu’est-ce qu’un bouquet numérique ?', 'Un bouquet de fleurs dessiné en graphisme vectoriel d’après de vraies photos, tige à tige, dans un vrai vase. Il fleurit à l’écran, se balance dans la brise et fane au bout de trois mois. Chacun est unique et se collectionne sous la forme d’un NFT sur Base.'],
      ['Puis-je mettre un bouquet de fleurs sur le bureau de mon ordinateur ?', 'Oui. Téléchargez Belai Bureau (gratuit, Windows 10 et 11), liez votre portefeuille, et le bouquet que vous possédez se pose sur votre bureau en widget : vous le placez, ajustez sa taille, le fixez, devant ou derrière vos fenêtres.'],
      ['Comment le prix d’un bouquet est-il fixé ?', 'À la somme de ce que coûteraient ses tiges chez un fleuriste en France, convertie en ETH, sans TVA (TVA non applicable, art. 293 B du CGI). Le vase est offert. Le montant affiché en euros ou en dollars américains est indicatif, au cours du moment.'],
      ['Que se passe-t-il au bout de trois mois ?', 'Le bouquet fane et reste fané, immobile, pour de bon. Il reste à vous.'],
      ['Prenez-vous des royalties à la revente ?', 'Non : 0 %. Seuls s’appliquent les frais propres à la place de marché et au réseau.'],
      ['Qui peut afficher un bouquet ?', 'Belai Bureau n’affiche qu’un bouquet détenu par le portefeuille que vous liez, après une signature gratuite (sans transaction).'],
    ],
    back: '← Retour aux bouquets',
  },

  // ---------- the desktop page
  desktop: {
    h1: 'Votre bouquet sur votre bureau',
    lead: 'Posez le bouquet que vous avez collectionné sur le bureau de votre ordinateur, avec Belai Bureau, un widget gratuit pour Windows.',
    videoLabel: 'Vidéo explicative : poser votre bouquet sur votre bureau, pas à pas (musique seule ; les étapes sont écrites à côté)',
    stepsTitle: 'En cinq étapes',
    steps: [
      'Téléchargez et installez Belai Bureau.',
      'Liez votre portefeuille depuis l’icône Belai, à côté de l’horloge.',
      'Choisissez votre bouquet et affichez-le à l’écran : une signature, gratuite, sans transaction.',
      'Placez-le, ajustez sa taille, mettez-le devant ou derrière vos fenêtres, puis fixez-le avec ✓.',
      'Pour le déplacer à nouveau, maintenez le clic sur le bouquet pendant six secondes.',
    ],
    download: 'Télécharger Belai Bureau',
    downloadSmall: 'Windows 10 et 11 · 3 Mo · gratuit',
    note: 'Seul le portefeuille qui détient un bouquet peut l’afficher. Au premier lancement, Windows peut signaler qu’il ne connaît pas encore l’application : « Informations complémentaires », puis « Exécuter quand même ».',
    appLanguage: '',
    fingerprint: 'Version {v} · SHA-256',
    licence: 'Licence et confidentialité',
    back: '← Retour aux bouquets',
    appDescription: 'Un widget de bureau gratuit pour Windows qui affiche sur votre bureau le bouquet de fleurs numérique que vous avez collectionné : placez-le, ajustez sa taille, fixez-le, devant ou derrière vos fenêtres.',
    videoName: 'Comment poser votre bouquet sur votre bureau',
    videoDescription: 'Une minute pour tout comprendre : téléchargez Belai Bureau, liez votre portefeuille, affichez votre bouquet, placez-le, ajustez sa taille et fixez-le, maintenez six secondes pour le déplacer.',
    howToName: 'Comment poser un bouquet de fleurs numérique sur votre bureau Windows',
    howToTools: ['Belai Bureau (gratuit, Windows 10 et 11)', 'Un portefeuille qui détient un bouquet'],
  },

  // ---------- the legal page
  legal: {
    h1: 'Mentions légales',
    updated: 'Dernière mise à jour : 16 octobre 2026',
    onThisPage: 'Sur cette page',
    toc: { notice: 'Mentions légales', terms: 'Conditions générales de vente', privacy: 'Politique de confidentialité', app: 'Licence de Belai Bureau', ip: 'Propriété intellectuelle', accessibility: 'Accessibilité', contact: 'Contact' },
    reference: '',
    body: `<section id="notice" aria-labelledby="t-notice">
    <h2 id="t-notice">Mentions légales</h2>
    <h3>Éditeur</h3>
    <p>Hadrien Lonjaret, entrepreneur individuel, exerçant sous le nom commercial Agent 33<br>
      35 cours Sablon, 63000 Clermont-Ferrand, France<br>
      Courriel : <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Téléphone : +33 6 18 55 81 22<br>
      SIREN 853 801 488 · RCS Clermont-Ferrand · N° de TVA intracommunautaire FR69853801488</p>
    <h3>Directeur de la publication</h3>
    <p>Hadrien Lonjaret</p>
    <h3>Hébergeur</h3>
    <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis · +1 650 319 8930 ·
      cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Conditions générales de vente</h2>

    <h3>1. Parties et champ d’application</h3>
    <p>Les présentes conditions générales de vente s’appliquent à tout bouquet vendu sur ce site par l’éditeur désigné
      dans les mentions légales (« nous ») à toute personne majeure (« vous »). Le paiement d’un bouquet emporte
      acceptation des présentes conditions, dans leur version en vigueur au jour de l’achat. Elles existent en plusieurs
      langues ; la version française prévaut.</p>

    <h3>2. Objet : le bouquet</h3>
    <p>Un bouquet est une œuvre numérique unique : des fleurs dessinées en graphisme vectoriel, dans un vase, enregistrées
      sous la forme d’un jeton non fongible (NFT) sur le réseau Base. La page de chaque bouquet indique, avant l’achat,
      son nom, son vase, son nombre de tiges et son prix.</p>
    <p>Un bouquet vit trois mois à compter de sa frappe : il fleurit et se balance, et un compte à rebours indique le
      temps restant. Il fane ensuite et demeure définitivement fané et immobile. Cette évolution fait partie de l’œuvre
      et ne constitue pas un défaut.</p>
    <p>Un bouquet est un objet de collection. Il ne confère aucun droit à un revenu ni à une quelconque part.</p>

    <h3>3. Propriété du bouquet</h3>
    <p>Détenteur de son jeton, vous êtes propriétaire du bouquet : vous pouvez l’exposer où bon vous semble, le conserver,
      l’offrir ou le revendre, sans autre formalité. Comme pour un tableau, l’achat n’emporte pas cession des droits
      d’auteur sur le dessin : la fabrication et la vente de copies ou de produits dérivés n’y sont pas comprises.</p>

    <h3>4. Prix</h3>
    <p>Le prix est fixé en ETH, sans TVA (TVA non applicable, art. 293 B du CGI), et affiché sur le bouquet avant l’achat. Le montant indiqué à côté
      en euros ou en dollars américains correspond au même prix au cours du moment, relevé auprès de CoinGecko ; vous
      payez le prix en ETH. Les frais du réseau Base (« gas ») sont ajoutés par votre portefeuille et versés au réseau,
      et non à nous.</p>

    <h3>5. Commande et paiement</h3>
    <p>Vous payez depuis votre propre portefeuille, sur ce site, par l’intermédiaire de Seaport, le protocole de la place
      de marché OpenSea où nos bouquets sont proposés. Avant de payer, vous cochez une case pour demander la livraison
      immédiate (voir l’article 7), puis vous confirmez ; votre portefeuille affiche alors le montant exact, et la
      confirmation dans votre portefeuille vaut commande avec obligation de paiement. Une transaction confirmée sur le
      réseau ne peut pas être annulée.</p>
    <p>Vous êtes responsable de votre portefeuille, de ses clés et de l’adresse avec laquelle vous achetez. Nous ne
      détenons jamais vos clés ni vos fonds.</p>

    <h3>6. Livraison et reçu</h3>
    <p>Le bouquet est transféré dans votre portefeuille au cours de la même transaction, dès sa confirmation par le
      réseau. Le site vous remet ensuite un reçu à télécharger, qui confirme l’achat, son prix, la transaction et votre
      demande de livraison immédiate. L’inscription de la transaction sur le réseau Base constitue également une preuve
      de l’achat.</p>

    <h3>7. Droit de rétractation</h3>
    <p>Si vous êtes un consommateur résidant dans l’Union européenne, vous disposez en principe d’un délai de 14 jours
      pour exercer votre droit de rétractation à la suite d’un achat à distance. Un bouquet est un contenu numérique
      non fourni sur un support matériel et livré immédiatement : avant de payer, vous demandez expressément sa
      livraison immédiate et reconnaissez renoncer ainsi à votre droit de rétractation (Code de la consommation,
      article L221-28, 13° ; Directive 2011/83/UE, article 16(m)).</p>

    <h3>8. Conformité</h3>
    <p>Si vous êtes un consommateur, vous bénéficiez de la garantie légale de conformité applicable aux contenus
      numériques (Code de la consommation, articles L224-25-1 et suivants) : si le bouquet reçu ne correspond pas à sa
      description, écrivez-nous et nous le mettrons en conformité ou, à défaut, nous vous rembourserons.</p>

    <h3>9. Revente</h3>
    <p>Nous ne percevons aucune redevance (royalties) sur la revente (0 %). Seuls s’appliquent les frais propres à la
      place de marché et au réseau. Les prix des bouquets à la revente sont fixés librement par leurs détenteurs ; nous
      ne prenons aucun engagement à leur sujet.</p>

    <h3>10. Responsabilité</h3>
    <p>Le réseau Base, les portefeuilles et la place de marché OpenSea sont exploités par des tiers. Nous ne sommes pas
      responsables de leurs interruptions, de leurs frais ou de leurs modifications, ni d’une perte due à une clé
      égarée ou à une erreur d’adresse. Aucune stipulation des présentes conditions ne limite les droits que les
      consommateurs tiennent de la loi.</p>

    <h3>11. Réclamations et médiation</h3>
    <p>Écrivez-nous d’abord (voir <a href="{{legal}}#contact">Contact</a>) ; nous répondons sous 30 jours. À défaut de
      solution, le consommateur peut soumettre gratuitement le litige à notre médiateur de la consommation :
      <span class="a-remplir">[nom, site internet et adresse postale du médiateur]</span>.</p>

    <h3>12. Droit applicable</h3>
    <p>Les présentes conditions sont soumises au droit français. Le consommateur conserve la protection que lui assurent
      les dispositions impératives du droit du pays où il réside, et peut porter un litige devant les juridictions de
      ce pays ou de la France.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Politique de confidentialité</h2>
    <p>Le responsable du traitement est l’éditeur désigné dans les <a href="{{legal}}#notice">mentions légales</a>. Nous
      collectons le moins de données possible, et aucune pour vous profiler.</p>
    <h3>Données traitées, finalités et bases légales</h3>
    <ul>
      <li><strong>Données de connexion</strong> (adresse IP, navigateur, pages demandées) : conservées par notre hébergeur
        Cloudflare dans ses journaux techniques, pour fournir le site et le protéger contre les abus. Base légale : notre
        intérêt légitime à disposer d’un site fonctionnel et sécurisé.</li>
      <li><strong>Votre pays</strong>, déduit par Cloudflare de votre adresse IP à chaque visite, pour afficher le site
        dans votre langue et le prix dans votre devise. Il est utilisé sur le moment et n’est jamais conservé. Base
        légale : notre intérêt légitime à proposer un site que vous pouvez lire.</li>
      <li><strong>Le cours de l’ETH :</strong> pour afficher le montant dans votre devise, votre navigateur demande le
        cours du moment à CoinGecko (api.coingecko.com) ; CoinGecko voit alors votre adresse IP. Base légale : notre
        intérêt légitime à afficher un montant à jour.</li>
      <li><strong>Votre adresse de portefeuille</strong>, lorsque vous achetez ou liez un portefeuille : lue pour exécuter
        l’achat ou afficher vos bouquets. Base légale : le contrat. Les transactions sur le réseau Base sont publiques et
        permanentes : ni nous ni personne ne pouvons les effacer.</li>
    </ul>
    <h3>Cookies</h3>
    <p>Si vous choisissez vous-même une langue, le site la retient dans un seul cookie, nommé <code>lang</code>, pendant
      un an. C’est tout : aucun autre cookie, aucune mesure d’audience, aucune publicité. Ce cookie sert uniquement à
      conserver votre choix ; il ne requiert donc pas de bandeau de consentement.</p>
    <h3>Destinataires et lieux de traitement</h3>
    <p>Cloudflare, Inc. (hébergement, États-Unis) et CoinGecko (cours, Singapour). Les transferts hors de l’Union
      européenne reposent sur le cadre de protection des données UE–États-Unis (Data Privacy Framework) pour Cloudflare
      et sur les clauses contractuelles types de la Commission européenne.</p>
    <h3>Durées de conservation</h3>
    <p>Journaux techniques de Cloudflare : selon les paramètres de Cloudflare, de quelques jours à quelques semaines.
      Courriels que vous nous adressez : le temps nécessaire pour y répondre, puis trois ans. Nous ne conservons aucune
      autre donnée.</p>
    <h3>Vos droits</h3>
    <p>Vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, la limitation de leur
      traitement, vous opposer à celui-ci et recevoir vos données dans un format portable, en nous écrivant (voir
      <a href="{{legal}}#contact">Contact</a>). Vous pouvez également introduire une réclamation auprès de la Commission
      nationale de l’informatique et des libertés, la CNIL (cnil.fr).</p>
  </section>

  <section id="app" aria-labelledby="t-app">
    <h2 id="t-app">Licence de Belai Bureau</h2>
    <p>Belai Bureau est un logiciel gratuit pour Windows 10 et 11 qui affiche sur votre bureau les bouquets détenus par
      un portefeuille que vous y liez. Nous vous concédons une licence gratuite, personnelle et non exclusive pour
      l’installer et l’utiliser. Vous ne pouvez ni le vendre ni en distribuer des copies modifiées.</p>
    <p><strong>Ce que l’application fait des données :</strong> elle conserve sur votre ordinateur un code aléatoire
      propre à cet ordinateur, l’adresse du portefeuille que vous liez et vos réglages. Elle interroge le réseau Base
      (mainnet.base.org, exploité par Base) pour savoir quels bouquets détient votre portefeuille, et ouvre ce site dans
      votre navigateur lorsque vous liez un portefeuille. Elle ne nous envoie rien et ne mesure rien.</p>
    <p>L’application est fournie en l’état. La désinstaller (Paramètres de Windows, Applications) la supprime ainsi que
      ses réglages.</p>
  </section>

  <section id="ip" aria-labelledby="t-ip">
    <h2 id="t-ip">Propriété intellectuelle</h2>
    <p>Les fleurs, vases, bouquets, décors, textes, vidéo et code de ce site et de Belai Bureau sont des œuvres
      originales. Toute reproduction sans autorisation est interdite, sauf dans les limites prévues par les
      <a href="{{legal}}#terms">conditions générales de vente</a>. OpenSea, Base et CoinGecko sont des noms appartenant
      à leurs titulaires respectifs. Le cours de l’ETH est fourni par
      <a href="https://www.coingecko.com/" target="_blank" rel="noopener">CoinGecko</a>.</p>
  </section>

  <section id="accessibility" aria-labelledby="t-accessibility">
    <h2 id="t-accessibility">Accessibilité</h2>
    <p>Nous visons le niveau AA des règles pour l’accessibilité des contenus web (WCAG) 2.1. Le site s’utilise au
      clavier (flèches pour changer de bouquet, Échap pour prendre du recul), chaque bouton porte un nom pour les
      lecteurs d’écran, et les animations s’arrêtent lorsque votre système demande à réduire les animations. Limites
      connues : la prairie et les bouquets sont des œuvres, décrites par des mots plutôt que dans le détail ; la vidéo
      explicative n’a pas de voix, et ses étapes sont écrites à côté. Si quelque chose vous bloque, écrivez-nous et
      nous vous aiderons.</p>
  </section>

  <section id="contact" aria-labelledby="t-contact">
    <h2 id="t-contact">Contact</h2>
    <p>Courriel : <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Téléphone : +33 6 18 55 81 22 ·
      Courrier : Hadrien Lonjaret, 35 cours Sablon, 63000 Clermont-Ferrand, France</p>
  </section>`,
    back: '← Retour aux bouquets',
  },

  // ---------- the strings of the scripts (entete.js, boutique.js), with {placeholders}
  js: {
    menu: 'Menu',
    shelves: { bouquets: 'Bouquets du jour', soliflores: 'Soliflores', vendus: 'Bouquets collectionnés' },
    desktopTitle: 'Sur mon bureau',
    desktopLabel: 'Votre bouquet sur votre bureau',
    openSeaTitle: 'Notre collection sur OpenSea',
    openSeaLabel: 'Notre collection sur OpenSea (nouvel onglet)',
    about: 'À propos',
    legal: 'Mentions légales',
    closeLegal: 'Fermer le panneau des mentions légales',
    footer:
      '<p>Chaque bouquet est un objet de collection numérique unique (un NFT sur Base), dont le prix est fixé en ETH, sans TVA (TVA non applicable, art. 293 B du CGI) ; le montant en euros ou en dollars américains correspond au même prix au cours du moment. Il vit trois mois à compter de sa frappe, puis reste fané pour de bon. La livraison est immédiate : le droit de rétractation ne s’applique donc plus une fois votre achat confirmé. Nous ne percevons pas de royalties sur la revente (0 %).</p><p>Aucun pistage, aucune publicité : un cookie au plus, pour retenir la langue que vous avez choisie.</p>',
    links: { notice: 'Mentions légales', terms: 'Conditions générales de vente', privacy: 'Confidentialité', app: 'Licence de Belai Bureau', accessibility: 'Accessibilité', contact: 'Contact' },
    credit: 'Cours de l’ETH fourni par {coingecko}.',
    language: 'Langue',
    lookCloser: 'Regarder le bouquet de plus près',
    stepBack: 'Prendre du recul',
    planeLabel: '{name}, sur le pilier. {alt}',
    frameLabel: '{name}, {eth}, environ {fiat}, {life}. {alt}',
    buyLabel: 'Acheter « {name} », {eth}, environ {fiat}',
    lifeLeft: '{h} h {m} min',
    fadesIn: 'Fane dans {t}',
    fadesInLower: 'fane dans {t}',
    faded: 'Fané',
    fadedLower: 'fané',
    fadedForGood: 'Fané pour toujours',
    buy: 'Acheter',
    soon: 'Bientôt',
    soonMessage: 'L’achat depuis le site arrive bientôt.',
    tickFirst: 'Cochez d’abord la case : votre bouquet est livré immédiatement.',
    receipt: {
      title: 'Reçu',
      download: 'Télécharger votre reçu',
      bouquet: 'Bouquet',
      token: 'Jeton',
      price: 'Prix',
      date: 'Date',
      buyer: 'Portefeuille de l’acheteur',
      transaction: 'Transaction',
      seller: 'Vendeur',
      waiver: 'Avant de payer, vous avez demandé la livraison immédiate et reconnu renoncer ainsi à votre droit de rétractation (Code de la consommation, article L221-28, 13°).',
      terms: 'Conditions générales de vente acceptées à cette date : {url}',
      taxes: 'TVA non applicable, art. 293 B du CGI.',
    },
  },

  // ---------- the names the bouquet descriptions use
  vases: {
    'bronze-carpe': 'un vase carpe en bronze coulé',
    'verre-danseuses': 'un vase en verre dépoli aux danseuses',
    'coupe-cobalt-mouchetee': 'une coupe cobalt mouchetée',
    'coupe-pied-blanche-mate': 'une coupe sur pied blanche mate',
    'cylindre-inox-miroir': 'un cylindre en inox poli miroir',
    'bulbe-pied-sable': 'un vase boule sur pied couleur sable',
    'calice-mouchete': 'un vase calice moucheté',
  },
  flowers: {
    'cerisier-du-japon-sato-zakura': 'fleur de cerisier du Japon',
    'cognassier-du-japon': 'cognassier du Japon',
    forsythia: 'forsythia',
    'iris-hollandais': 'iris de Hollande',
    lilas: 'lilas',
    'tulipe-perroquet': 'tulipe perroquet',
    'tulipe-double': 'tulipe double',
    'tulipe-simple': 'tulipe',
    'tulipe-frangee': 'tulipe frangée',
    'renoncule-classique': 'renoncule',
    'narcisse-trompette': 'narcisse trompette',
    'narcisse-bouquet': 'narcisse à bouquet',
    jacinthe: 'jacinthe',
    'anemone-coronaria': 'anémone',
    'anemone-sauvage': 'anémone des bois',
    freesia: 'freesia',
    'pois-de-senteur': 'pois de senteur',
    muscari: 'muscari',
    'fritillaire-meleagris': 'fritillaire pintade',
    glycine: 'glycine',
    'viburnum-roseum': 'viorne boule-de-neige',
    alchemille: 'alchémille',
    'anthurium-obake': 'anthurium obake',
    'saule-a-chatons': 'chatons de saule',
    'liriope-lily-grass': 'liriope',
    'cymbidium-grandes-fleurs': 'orchidée cymbidium',
    'rose-de-jardin': 'rose de jardin',
    sanguisorbe: 'sanguisorbe',
    phalaenopsis: 'orchidée phalaenopsis',
    'arum-calla': 'arum',
    'hortensia-boule': 'hortensia',
    'giroflee-matthiole': 'giroflée',
    'oeillet-de-poete-dianthus': 'œillet de poète',
    'anthurium-cristal': 'anthurium cristal',
    'jasminum-liane-jasmin': 'jasmin',
    'cyclamen-fleur-coupee': 'cyclamen',
    'ruscus-seche-teint': 'ruscus teinté',
    lisianthus: 'lisianthus',
    germini: 'germini',
    'reine-marguerite': 'reine-marguerite',
    bromeliacees: 'broméliacée',
  },
};
