// The site's words in English: the source of the other languages (fr, es, zh, de have the same keys). build.mjs writes
// the pages from gabarits/ with them; the runtime strings (js) go into each page as a JSON block read by entete.js and
// boutique.js. In the HTML strings: {{p}} is the page's language prefix ('' or 'fr/'...), {{legal}} the legal page with
// that prefix; in the runtime strings, {name} and the like are filled in by the scripts. Product names stay as they are.
export default {
  code: 'en',
  name: 'English',
  locale: 'en-US',
  ogLocale: 'en_US',
  // a list of words as the language writes it: "a, b and c"
  list: (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`),
  more: 'more',
  describe: ({ stems, flowers, vase }) =>
    `A one-of-a-kind digital bouquet of ${stems} hand-drawn stems (${flowers}) in ${vase}. It lives three months, then stays faded for good.`,

  pages: {
    index: {
      title: "Digital flower bouquets, drawn stem by stem | Belai's Garden",
      description: 'Digital flower bouquets drawn stem by stem from real flowers. One of a kind, new every day, to collect on Base and set on your desktop.',
      ogTitle: 'Digital flower bouquets, drawn stem by stem',
      ogDescription: 'New one-of-a-kind bouquets every day, each in a real vase. Watch them bloom, collect one, set it on your desktop.',
    },
    about: {
      title: "About: digital bouquets drawn from real flowers | Belai's Garden",
      description: 'How our digital bouquets are made: flowers drawn in code from real photos, real vases, priced at what the stems cost, living three months.',
      ogTitle: 'About our digital bouquets',
      ogDescription: 'Every flower drawn in code from real photos. One-of-a-kind bouquets, in real vases, that bloom and then fade.',
    },
    desktop: {
      title: 'Flower bouquet widget for your Windows desktop | Belai Bureau',
      description: 'Belai Bureau, a free Windows 10 and 11 widget: set the digital flower bouquet you collected on your desktop. Place it, size it, pin it.',
      ogTitle: 'Your flower bouquet on your desktop',
      ogDescription: 'A free Windows widget for your digital bouquet: place it, size it, pin it.',
    },
    legal: {
      title: "Legal notice, terms of sale and privacy | Belai's Garden",
      description: "Legal notice, terms of sale of the digital bouquets, privacy policy, Belai Bureau licence and accessibility statement of Belai's Garden.",
      ogTitle: 'Legal notice, terms of sale and privacy',
      ogDescription: 'Who we are, how a bouquet is sold, what we do with data.',
    },
  },
  shareAlt: 'The Ronde bleue bouquet: lilac, irises, anemones and hyacinths in a frosted-glass vase with dancers',
  orgDescription: 'Digital flower bouquets drawn stem by stem from real flowers, collected on Base.',
  listName: 'Bouquets of the day',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden: living digital flower bouquets",
    intro:
      'Digital flower bouquets drawn stem by stem from real flowers. New one-of-a-kind bouquets every day, each in a real vase, collected on Base. A bouquet lives three months, then stays faded forever. Set yours on your computer’s desktop with Belai Bureau, a free widget for Windows.',
    noscript:
      'This garden needs JavaScript to let the bouquets bloom. Read <a href="{{p}}about.html">about the bouquets</a>, see <a href="{{p}}desktop.html">how to set one on your desktop</a>, or the <a href="{{legal}}">legal notice and terms</a>.',
    galleryLabel: 'Bouquets of the day',
    lookCloser: 'Look closer at the bouquet',
    open: 'Open',
    shelvesLabel: 'Shelves',
    budVases: 'Bud vases are coming soon: a single flower in its vase.',
    noneCollected: 'No bouquet has found its collector yet.',
    seeOpenSea: 'See the collection on OpenSea',
    onDesktop: 'On your desktop',
    buy: 'Buy',
    royalties: '0% royalties on resale',
    demoTitle: 'Your bouquet on your desktop',
    closeVideo: 'Close the video',
    videoMissing: 'The video is on its way: it will show how to set your bouquet on your computer’s desktop.',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: 'Before you pay',
    waiver: 'I ask for my bouquet to be delivered right away, and I understand that I then lose my 14-day right of withdrawal.',
    accept: 'By paying, you confirm that you are of legal age and accept the <a href="{{legal}}#terms">terms of sale</a>.',
    confirm: 'Confirm and pay',
    cancel: 'Cancel',
  },

  // ---------- the About page
  about: {
    h1: 'About',
    lead: 'Bouquets drawn flower by flower, that bloom before your eyes.',
    body: `<h2>Flowers drawn from life</h2>
  <p>Every flower in this garden is drawn in code, line by line, from real photos: the shape of the petals, their
    colours measured on each variety, the buds, the open flower and the faded one. More than five hundred species are
    already in the garden.</p>

  <h2>One-of-a-kind bouquets every day</h2>
  <p>Every day, new bouquets are composed, each in a real vase, like the bronze carp. Every bouquet is one of a kind:
    the place of each stem, each flower and each leaf is found in no other.</p>

  <h2>A living bouquet</h2>
  <p>A bouquet lives three months from its minting: a countdown, in hours and minutes, shows how long it has left.
    Then it stays faded and still, for good.</p>

  <h2>The price of real stems</h2>
  <p>A bouquet’s price is the sum of what its stems cost at a florist in France. The vase comes free. On resale, we take
    nothing: 0% royalties.</p>

  <h2>Collecting a bouquet</h2>
  <p>The bouquets are NFTs on the Base network, listed on our OpenSea page. You will pay for them right here, from your
    wallet, without leaving the site.</p>

  <h2>On your desktop</h2>
  <p>With <a href="{{p}}desktop.html">Belai Bureau</a>, a free widget for Windows, the bouquet you collected stands on your
    computer’s desktop, at the size you choose, in front of or behind your windows.</p>

  <h2>Growing the garden</h2>
  <p>Every bouquet collected helps the garden grow: new species, new vases, new bouquets.</p>`,
    faqTitle: 'Questions',
    faq: [
      ['What is a digital bouquet?', 'A bouquet of flowers drawn in vector graphics from real photos, stem by stem, in a real vase. It blooms on screen, sways in the breeze, and fades after three months. Each one is unique and is collected as an NFT on Base.'],
      ['Can I put a flower bouquet on my computer’s desktop?', 'Yes. Download Belai Bureau (free, Windows 10 and 11), link your wallet, and the bouquet you own stands on your desktop as a widget: you place it, size it, pin it, and set it in front of or behind your windows.'],
      ['How is a bouquet priced?', 'At the sum of what its stems would cost at a florist in France, converted to ETH, with no VAT (VAT not applicable, art. 293 B of the French General Tax Code). The vase comes free. The amount shown in euros or US dollars is an indication at the current rate.'],
      ['What happens after three months?', 'The bouquet fades and stays faded, still, for good. It remains yours.'],
      ['Do you take royalties on resale?', 'No: 0%. Only the marketplace’s and the network’s own fees apply.'],
      ['Who can show a bouquet?', 'Belai Bureau only shows a bouquet held by the wallet you link, after a free signature (no transaction).'],
    ],
    back: '← Back to the bouquets',
  },

  // ---------- the desktop page
  desktop: {
    h1: 'Your bouquet on your desktop',
    lead: 'Set the bouquet you collected on your computer’s desktop, with Belai Bureau, a free widget for Windows.',
    videoLabel: 'How-to video: setting your bouquet on your desktop, step by step (music only; the steps are written beside it)',
    stepsTitle: 'In five steps',
    steps: [
      'Download and install Belai Bureau.',
      'Link your wallet from the Belai icon next to the clock.',
      'Choose your bouquet and put it on your screen: one signature, free, no transaction.',
      'Place it, size it, set it in front of or behind your windows, then pin it with ✓.',
      'To move it again, hold the click on the bouquet for six seconds.',
    ],
    download: 'Download Belai Bureau',
    downloadSmall: 'Windows 10 and 11 · 3 MB · free',
    note: 'Only the wallet that holds a bouquet can show it. On first launch, Windows may warn that it does not know the app yet: “More info”, then “Run anyway”.',
    appLanguage: 'The app itself is in French for now.',
    fingerprint: 'Version {v} · SHA-256',
    licence: 'Licence and privacy',
    back: '← Back to the bouquets',
    appDescription: 'A free desktop widget for Windows that shows the digital flower bouquet you collected on your desktop: place it, size it, pin it, in front of or behind your windows.',
    videoName: 'How to set your bouquet on your desktop',
    videoDescription: 'A one-minute how-to: download Belai Bureau, link your wallet, put your bouquet on screen, place, size and pin it, hold six seconds to move it again.',
    howToName: 'How to set a digital flower bouquet on your Windows desktop',
    howToTools: ['Belai Bureau (free, Windows 10 and 11)', 'A wallet that holds a bouquet'],
  },

  // ---------- the legal page
  legal: {
    h1: 'Legal',
    updated: 'Last updated: October 16, 2026',
    onThisPage: 'On this page',
    toc: { notice: 'Legal notice', terms: 'Terms of sale', privacy: 'Privacy policy', app: 'Belai Bureau licence', ip: 'Intellectual property', accessibility: 'Accessibility', contact: 'Contact' },
    reference: '',
    body: `<section id="notice" aria-labelledby="t-notice">
    <h2 id="t-notice">Legal notice</h2>
    <h3>Publisher</h3>
    <p>Hadrien Lonjaret, sole trader (entrepreneur individuel), trading as Agent 33<br>
      35 cours Sablon, 63000 Clermont-Ferrand, France<br>
      Email: <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Phone: +33 6 18 55 81 22<br>
      SIREN 853 801 488 · RCS Clermont-Ferrand · VAT number FR69853801488</p>
    <h3>Publication director</h3>
    <p>Hadrien Lonjaret</p>
    <h3>Hosting</h3>
    <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States · +1 650 319 8930 ·
      cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Terms of sale</h2>

    <h3>1. Who sells, to whom</h3>
    <p>These terms apply to every bouquet sold on this site by the publisher named in the legal notice (“we”) to any
      person of legal age (“you”). Paying for a bouquet means accepting these terms, as they read on the day of the
      purchase. They exist in several languages; the French version prevails.</p>

    <h3>2. What a bouquet is</h3>
    <p>A bouquet is a one-of-a-kind digital artwork: flowers drawn in vector graphics, in a vase, recorded as a
      non-fungible token (NFT) on the Base network. Each bouquet’s page shows its name, its vase, its number of stems
      and its price before you buy.</p>
    <p>A bouquet lives three months from its minting: it blooms and sways, and a countdown shows the time left. Then it
      fades and stays faded and still, for good. This is part of the artwork, not a defect.</p>
    <p>A bouquet is a collectible. It gives no right to any income or share.</p>

    <h3>3. The bouquet is yours</h3>
    <p>Holding its token, you own the bouquet: you may show it wherever you like, keep it, give it or resell it, with no
      other formality. As with a painting, buying it does not transfer the copyright in the drawing: making and selling
      copies or merchandise of it is not included.</p>

    <h3>4. Price</h3>
    <p>The price is set in ETH, with no VAT (VAT not applicable, art. 293 B of the French General Tax Code), and shown on the bouquet before you buy. The amount shown beside it
      in euros or US dollars is the same price at the current rate, read from CoinGecko; you pay the ETH price. The
      Base network’s fees (“gas”) are added by your wallet and paid to the network, not to us.</p>

    <h3>5. Order and payment</h3>
    <p>You pay from your own wallet, on this site, through Seaport, the protocol of the OpenSea marketplace where our
      bouquets are listed. Before paying, you tick a box to ask for immediate delivery (see article 7), then confirm;
      your wallet then shows the exact amount, and confirming in your wallet places the order with an obligation to
      pay. A transaction confirmed on the network cannot be cancelled.</p>
    <p>You are responsible for your wallet, its keys and the address you buy with. We never hold your keys or your
      funds.</p>

    <h3>6. Delivery and receipt</h3>
    <p>The bouquet is transferred to your wallet in the same transaction, as soon as the network confirms it. The site
      then gives you a receipt to download, which confirms the purchase, its price, the transaction and your request
      for immediate delivery. The transaction’s record on the Base network is also proof of the purchase.</p>

    <h3>7. Right of withdrawal</h3>
    <p>If you are a consumer in the European Union, you normally have 14 days to withdraw from a distance purchase.
      A bouquet is digital content not supplied on a tangible medium and delivered at once: before paying, you ask
      expressly for its immediate delivery and acknowledge that you thereby lose your right of withdrawal (French
      Consumer Code, article L221-28, 13°; EU Directive 2011/83, article 16(m)).</p>

    <h3>8. Conformity</h3>
    <p>If you are a consumer, you benefit from the legal guarantee of conformity for digital content (French Consumer
      Code, articles L224-25-1 and following): if the bouquet you received does not match its description, write to
      us and we will bring it into conformity or, failing that, refund you.</p>

    <h3>9. Resale</h3>
    <p>We take no royalty on resale (0%). Only the marketplace’s and the network’s own fees apply. The prices of
      bouquets on resale are set freely by their holders; we make no promise about them.</p>

    <h3>10. Liability</h3>
    <p>The Base network, the wallets and the OpenSea marketplace are run by third parties. We are not liable for their
      outages, their fees or their changes, nor for a loss caused by a lost key or a mistaken address. Nothing in these
      terms limits the rights that consumers hold under the law.</p>

    <h3>11. Complaints and mediation</h3>
    <p>Write to us first (see <a href="{{legal}}#contact">Contact</a>); we answer within 30 days. If no solution is
      found, a consumer may refer the dispute, free of charge, to our consumer mediator:
      <span class="a-remplir">[name, website and postal address of the mediator]</span>.</p>

    <h3>12. Applicable law</h3>
    <p>These terms are governed by French law. A consumer keeps the protection of the mandatory rules of the country
      where they live, and may bring a dispute before the courts of that country or of France.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Privacy policy</h2>
    <p>The data controller is the publisher named in the <a href="{{legal}}#notice">legal notice</a>. We collect as
      little as we can, and nothing to profile you.</p>
    <h3>What is processed, why, on what basis</h3>
    <ul>
      <li><strong>Connection data</strong> (IP address, browser, pages asked): kept by our host Cloudflare in its
        technical logs, to deliver the site and protect it from abuse. Basis: our legitimate interest in a working,
        secure site.</li>
      <li><strong>Your country</strong>, deduced by Cloudflare from your IP address on each visit, to show the site in
        your language and the price in your currency. It is used on the spot and never stored. Basis: our legitimate
        interest in a site you can read.</li>
      <li><strong>The ETH rate:</strong> to show the amount in your currency, your browser asks CoinGecko
        (api.coingecko.com) for the current rate; CoinGecko sees your IP address. Basis: our legitimate interest in
        showing an up-to-date amount.</li>
      <li><strong>Your wallet address</strong>, when you buy or link a wallet: read to carry out the purchase or to
        show your bouquets. Basis: the contract. Transactions on the Base network are public and permanent: neither
        we nor anyone can erase them.</li>
    </ul>
    <h3>Cookies</h3>
    <p>If you choose a language yourself, the site remembers it in one cookie, named <code>lang</code>, for one year.
      That is all: no other cookie, no audience measurement, no advertising. This cookie only keeps your choice, so it
      needs no consent banner.</p>
    <h3>Who receives data, where</h3>
    <p>Cloudflare, Inc. (hosting, United States) and CoinGecko (rate, Singapore). Transfers outside the European Union
      rely on the EU–US Data Privacy Framework for Cloudflare and on the European Commission’s standard contractual
      clauses.</p>
    <h3>How long</h3>
    <p>Cloudflare’s technical logs: as set by Cloudflare, a few days to a few weeks. Emails you send us: as long as
      needed to answer, then three years. We keep no other data.</p>
    <h3>Your rights</h3>
    <p>You may ask to access, correct or erase your data, to restrict or object to its processing, and to receive it
      in a portable form, by writing to us (see <a href="{{legal}}#contact">Contact</a>). You may also complain to the
      French data protection authority, the CNIL (cnil.fr).</p>
  </section>

  <section id="app" aria-labelledby="t-app">
    <h2 id="t-app">Belai Bureau licence</h2>
    <p>Belai Bureau is free software for Windows 10 and 11 that shows on your desktop the bouquets held by a wallet
      you link to it. We grant you a free, personal, non-exclusive licence to install and use it. You may not sell
      it, nor distribute modified copies.</p>
    <p><strong>What it does with data:</strong> it keeps on your computer a random code for this computer, the address
      of the wallet you link and your settings. It asks the Base network (mainnet.base.org, run by Base) which
      bouquets your wallet holds, and opens this site in your browser when you link a wallet. It sends us nothing and
      measures nothing.</p>
    <p>The app is provided as is. Uninstalling it (Windows Settings, Apps) removes it and its settings.</p>
  </section>

  <section id="ip" aria-labelledby="t-ip">
    <h2 id="t-ip">Intellectual property</h2>
    <p>The flowers, vases, bouquets, decor, texts, video and code of this site and of Belai Bureau are original
      works. Any reproduction without permission is forbidden, except as allowed in the <a href="{{legal}}#terms">terms
      of sale</a>. OpenSea, Base and CoinGecko are the names of their owners. The ETH rate is provided by
      <a href="https://www.coingecko.com/" target="_blank" rel="noopener">CoinGecko</a>.</p>
  </section>

  <section id="accessibility" aria-labelledby="t-accessibility">
    <h2 id="t-accessibility">Accessibility</h2>
    <p>We aim for the Web Content Accessibility Guidelines (WCAG) 2.1, level AA. The site works with a keyboard
      (arrows to change bouquet, Escape to step back), every button has a name for screen readers, and the
      animations stop when your system asks for reduced motion. Known limits: the meadow and the bouquets are artworks,
      described in words rather than in detail; the how-to video has no voice, and its steps are written beside it.
      If something blocks you, write to us and we will help.</p>
  </section>

  <section id="contact" aria-labelledby="t-contact">
    <h2 id="t-contact">Contact</h2>
    <p>Email: <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Phone: +33 6 18 55 81 22 ·
      Post: Hadrien Lonjaret, 35 cours Sablon, 63000 Clermont-Ferrand, France</p>
  </section>`,
    back: '← Back to the bouquets',
  },

  // ---------- the strings of the scripts (entete.js, boutique.js), with {placeholders}
  js: {
    menu: 'Menu',
    shelves: { bouquets: 'Bouquets of the day', soliflores: 'Bud vases', vendus: 'Bouquets collected' },
    desktopTitle: 'On my desktop',
    desktopLabel: 'Your bouquet on your desktop',
    openSeaTitle: 'Our collection on OpenSea',
    openSeaLabel: 'Our collection on OpenSea (new tab)',
    about: 'About',
    legal: 'Legal',
    closeLegal: 'Close the legal panel',
    footer:
      '<p>Each bouquet is a one-of-a-kind digital collectible (an NFT on Base), priced in ETH, with no VAT (VAT not applicable, art. 293 B of the French General Tax Code); the amount in euros or US dollars is the same price at the current rate. It lives three months from its minting, then stays faded for good. Delivery is immediate, so the right of withdrawal does not apply once you confirm. We take no royalty on resale (0%).</p><p>No tracking, no advertising: one cookie at most, to remember the language you chose.</p>',
    links: { notice: 'Legal notice', terms: 'Terms of sale', privacy: 'Privacy', app: 'Belai Bureau licence', accessibility: 'Accessibility', contact: 'Contact' },
    credit: 'ETH rate by {coingecko}.',
    language: 'Language',
    lookCloser: 'Look closer at the bouquet',
    stepBack: 'Step back',
    planeLabel: '{name}, on the pillar. {alt}',
    frameLabel: '{name}, {eth}, about {fiat}, {life}. {alt}',
    buyLabel: 'Buy “{name}”, {eth}, about {fiat}',
    lifeLeft: '{h} h {m} min',
    fadesIn: 'Fades in {t}',
    fadesInLower: 'fades in {t}',
    faded: 'Faded',
    fadedLower: 'faded',
    fadedForGood: 'Faded for good',
    buy: 'Buy',
    soon: 'Soon',
    soonMessage: 'Buying from the site is coming soon.',
    tickFirst: 'Tick the box first: your bouquet is delivered at once.',
    receipt: {
      title: 'Receipt',
      download: 'Download your receipt',
      bouquet: 'Bouquet',
      token: 'Token',
      price: 'Price',
      date: 'Date',
      buyer: 'Buyer’s wallet',
      transaction: 'Transaction',
      seller: 'Seller',
      waiver: 'Before paying, you asked for immediate delivery and acknowledged that you thereby lose your right of withdrawal (French Consumer Code, article L221-28, 13°).',
      terms: 'Terms of sale accepted on that day: {url}',
      taxes: 'VAT not applicable, art. 293 B of the French General Tax Code.',
    },
  },

  // ---------- the names the bouquet descriptions use
  vases: {
    'bronze-carpe': 'a cast-bronze carp vase',
    'verre-danseuses': 'a frosted-glass vase with dancers',
    'coupe-cobalt-mouchetee': 'a speckled cobalt bowl',
    'coupe-pied-blanche-mate': 'a matte white footed bowl',
    'cylindre-inox-miroir': 'a mirror steel cylinder',
    'bulbe-pied-sable': 'a sand-coloured footed bulb vase',
    'calice-mouchete': 'a speckled chalice vase',
  },
  flowers: {
    'cerisier-du-japon-sato-zakura': 'Japanese cherry blossom',
    'cognassier-du-japon': 'Japanese quince',
    forsythia: 'forsythia',
    'iris-hollandais': 'Dutch iris',
    lilas: 'lilac',
    'tulipe-perroquet': 'parrot tulip',
    'tulipe-double': 'double tulip',
    'tulipe-simple': 'tulip',
    'tulipe-frangee': 'fringed tulip',
    'renoncule-classique': 'ranunculus',
    'narcisse-trompette': 'trumpet daffodil',
    'narcisse-bouquet': 'bunch-flowered narcissus',
    jacinthe: 'hyacinth',
    'anemone-coronaria': 'anemone',
    'anemone-sauvage': 'wood anemone',
    freesia: 'freesia',
    'pois-de-senteur': 'sweet pea',
    muscari: 'grape hyacinth',
    'fritillaire-meleagris': 'snake’s head fritillary',
    glycine: 'wisteria',
    'viburnum-roseum': 'snowball viburnum',
    alchemille: 'lady’s mantle',
    'anthurium-obake': 'obake anthurium',
    'saule-a-chatons': 'pussy willow',
    'liriope-lily-grass': 'lily grass',
    'cymbidium-grandes-fleurs': 'cymbidium orchid',
    'rose-de-jardin': 'garden rose',
    sanguisorbe: 'burnet',
    phalaenopsis: 'phalaenopsis orchid',
    'arum-calla': 'calla lily',
    'hortensia-boule': 'hydrangea',
    'giroflee-matthiole': 'stock',
    'oeillet-de-poete-dianthus': 'sweet william',
    'anthurium-cristal': 'crystal anthurium',
    'jasminum-liane-jasmin': 'jasmine',
    'cyclamen-fleur-coupee': 'cyclamen',
    'ruscus-seche-teint': 'dyed ruscus',
    lisianthus: 'lisianthus',
    germini: 'germini daisy',
    'reine-marguerite': 'China aster',
    bromeliacees: 'bromeliad',
  },
};
