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
    `A one-of-a-kind digital bouquet of ${stems} hand-drawn stems (${flowers}) in ${vase}. It lives thirty days, then stays faded for good.`,

  pages: {
    index: {
      title: "Digital flower bouquets, drawn stem by stem | Belai's Garden",
      description: 'Digital flower bouquets drawn stem by stem from real flowers. A new collection every month, to give and to set on your screen.',
      ogTitle: 'Digital flower bouquets, drawn stem by stem',
      ogDescription: 'Every month, a collection of bouquets, each in a real vase. Watch them bloom, give one, set it on your screen.',
    },
    about: {
      title: "About: digital bouquets drawn from real flowers | Belai's Garden",
      description: 'How our digital bouquets are made: flowers drawn in code from real photos, real vases, priced at what the stems cost, living thirty days.',
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
  orgDescription: 'Digital flower bouquets drawn stem by stem from real flowers, to give and to set on your screen.',
  listName: 'Bouquets of the day',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden: living digital flower bouquets",
    intro:
      'Digital flower bouquets drawn stem by stem from real flowers. Every month, a new collection of bouquets, each in a real vase. A bouquet lives thirty days, then stays faded forever. Give it, or set it on your screen with Belai Bureau.',
    noscript:
      'This garden needs JavaScript to let the bouquets bloom. Read <a href="{{p}}about.html">about the bouquets</a>, see <a href="{{p}}desktop.html">how to set one on your desktop</a>, or the <a href="{{legal}}">legal notice and terms</a>.',
    galleryLabel: 'Bouquets of the day',
    lookCloser: 'Look closer at the bouquet',
    shelvesLabel: 'Shelves',
    budVases: 'Bud vases are coming soon: a single flower in its vase.',
    noneCollected: 'No bouquet has found its collector yet.',
    seeOpenSea: 'See the collection on OpenSea',
    onDesktop: "Try on my device",
    buy: 'Buy',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: 'Before you pay',
    waiver: 'I ask for my bouquet to be delivered right away, and I understand that I then lose my 14-day right of withdrawal.',
    accept: 'By paying, you confirm that you are of legal age and accept the <a href="{{legal}}#terms">terms of sale</a>.',
    confirm: 'Confirm and pay',
    cancel: 'Cancel',
    signInTitle: 'Your account, by text message',
    phone: 'Mobile number',
    sendCode: 'Get the code',
    code: 'Code received',
    firstName: 'First name',
    giftsTitle: 'My gifts',
    giftsHelp: 'Enter the first name of the person giving you a bouquet, and the code they sent you.',
    giftSender: 'Their first name',
    giftCode: 'Code',
    giftOpen: 'Open the gift',
    accountTitle: 'My account',
    accountHelp: 'Your first name and mobile number: a code is sent to you by text message.',
    invoices: 'Invoices',
    tabProfile: 'Profile',
    tabHelp: 'Help',
    noInvoice: 'No invoice yet.',
    invoicePrint: 'Print or PDF',
    invoiceClose: 'Close the invoice',
    helpExchangeTitle: 'Exchange within 24 hours.',
    helpExchange: 'Once, for a bouquet you bought and never offered, for a bouquet of the day at the same price or less, from the Profile tab. The difference goes into your credit.',
    helpDefectTitle: 'A problem with a bouquet?',
    helpDefect: 'If it does not display or work, write to us: we fix it, and it gets back the days it lost.',
    helpWrite: 'Write to customer service',
    helpTerms: 'Terms of sale',
    signIn: 'Sign in',
    signOut: 'Sign out',
  },

  // ---------- the About page
  about: {
    h1: 'About',
    lead: 'Bouquets drawn flower by flower, that bloom before your eyes.',
    body: `<h2>Flowers drawn from life</h2>
  <p>Every flower in this garden is drawn in code, line by line, from real photos: the shape of the petals, their
    colours measured on each variety, the buds, the open flower and the faded one. More than five hundred species are
    already in the garden.</p>

  <h2>Bouquets composed stem by stem</h2>
  <p>Each bouquet is composed stem by stem, each in a real vase, like the bronze carp. The place of every stem, flower and leaf is found in no other bouquet.</p>

  <h2>A living bouquet</h2>
  <p>A bouquet lives thirty days from its purchase: a countdown in hours and minutes shows the time it has left. Then it stays faded and still, for good.</p>

  <h2>The price of real stems</h2>
  <p>A bouquet costs what its stems would cost at a florist in France. The vase comes free. You pay by card.</p>

  <h2>A collection every month</h2>
  <p>Every month has its collection, and the bouquet you buy is exactly the one you see.</p>

  <h2>Giving a bouquet</h2>
  <p>When you buy, you can give the bouquet: a short message carried by the insects, a piece of music, and a code to pass on. The person you give it to receives it in “My gifts” with your first name and that code.</p>

  <h2>On your desktop</h2>
  <p>With <a href="{{p}}index.html?bureau">Belai Bureau</a>, a free widget for Windows, the bouquet you collected stands on your
    computer’s desktop, at the size you choose, in front of or behind your windows.</p>

  <h2>Growing the garden</h2>
  <p>Every bouquet collected helps the garden grow: new species, new vases, new bouquets.</p>`,
    faqTitle: 'Questions',
    faq: [
      ['What is a digital bouquet?', 'A bouquet of flowers drawn in vector graphics from real photos, stem by stem, in a real vase. It blooms on screen, sways in the breeze and fades after thirty days.'],
      ['Can I put a flower bouquet on my screen?', 'Yes. Download Belai Bureau (free), sign in once with your phone number and the code sent by text message: the bouquets of your account settle on your screen, where you place them, size them and pin them.'],
      ['How is a bouquet priced?', 'At the sum of what its stems would cost at a florist in France. The vase comes free. The price is shown in euros (in US dollars outside the euro area) and paid by card.'],
      ['What happens after thirty days?', 'The bouquet fades and stays faded, still, for good. It remains yours.'],
      ['How do I give a bouquet?', 'When you buy, choose to give it: write a short message, pick a piece of music and the insects that will carry it. You get a link and a code; the person enters them in “My gifts” with your first name, and the bouquet moves to their account.'],
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
    winSmall: '10 and 11 · 3 MB · free',
    soon: 'Coming soon',
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
    updated: 'Last updated: 27 October 2026',
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
    <h3>Host</h3>
    <p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States · github.com.
      The server for accounts and gifts is hosted by Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107,
      United States · cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Terms of sale</h2>

    <h3>1. Parties and scope</h3>
    <p>These terms of sale apply to every bouquet sold on this site by the publisher named in the legal notice (“we”) to
      any adult (“you”). Paying for a bouquet means accepting these terms, in their version in force on the day of
      purchase. They exist in several languages; the French version prevails.</p>

    <h3>2. The bouquet</h3>
    <p>A bouquet is a digital work: flowers drawn in vector graphics, in a vase, animated on screen. Each bouquet belongs
      to a month’s collection. The bouquet you buy is exactly the one you see, with no variation. Its page shows, before purchase,
      its name, its vase, its collection and its price.</p>
    <p>A bouquet lives thirty days from its purchase: it blooms and sways, and a countdown shows the time left. It then
      fades and stays faded and still for good. This change is part of the work and is not a defect.</p>
    <p>A bouquet gives no right to any income or share, and cannot be resold on this site.</p>

    <h3>3. Your account</h3>
    <p>To buy or receive a bouquet, you create an account with your first name and your mobile phone number, verified
      by a code sent by text message. Your bouquets, your invoices and your credit (article 11) are attached to this
      account. You are responsible for access to your number: let us know if you change it. If you delete your account,
      your bouquets and your credit go with it.</p>

    <h3>4. What you get</h3>
    <p>The purchase gives you the personal, non-exclusive right to view the bouquet on this site and to display it on
      your screens with Belai Bureau, for private use. This right can only be passed on by giving the bouquet (section
      8). As with a painting, the purchase does not transfer the copyright in the drawing: making or selling copies or
      derived products, and any commercial use, are not included.</p>

    <h3>5. Price</h3>
    <p>The price is set in euros, with no VAT (VAT not applicable, art. 293 B of the French General Tax Code), and shown
      on the bouquet before purchase; it is the sum of what its stems cost at a florist in France, the vase coming free.
      Outside the euro area, the amount shown in US dollars is indicative: payment is made in euros, and your bank may
      add currency conversion fees.</p>

    <h3>6. Order and payment</h3>
    <p>You pay by card, or with Apple Pay or Google Pay, on the payment page of our provider Stripe (Stripe Payments
      Europe, Ltd., Dublin, Ireland). We never see or keep your card numbers. Before paying, you tick a box to ask for
      immediate delivery (see section 9). Confirming the payment is an order with an obligation to pay.</p>

    <h3>7. Delivery and invoice</h3>
    <p>The bouquet is added to your account as soon as Stripe confirms the payment. You receive a receipt: it states the
      bouquet, its price, the date and your request for immediate delivery. A numbered invoice is available in your
      account, to print or save.</p>

    <h3>8. Giving a bouquet</h3>
    <p>When you buy, you can give the bouquet and compose its arrival: a short message carried by the insects, a piece
      of music and the insects that carry it. You receive a link and a code, which you pass on yourself to the person of
      your choice. The code is valid until the bouquet fades, for a single use; after five wrong attempts, entry is
      blocked for one hour. When the person enters your first name and the code, the bouquet moves to their account and
      leaves yours; until the code is used, the bouquet stays on your account. You are responsible for the content of
      the message, which must not break the law or anyone’s rights.</p>

    <h3>9. Right of withdrawal</h3>
    <p>If you are a consumer living in the European Union, you normally have 14 days to withdraw from a distance
      purchase. A bouquet is digital content not supplied on a tangible medium and delivered immediately: before paying,
      you expressly ask for its immediate delivery and acknowledge that you thereby lose your right of withdrawal
      (French Consumer Code, article L221-28, 13°; Directive 2011/83/EU, article 16(m)).</p>

    <h3>10. Conformity</h3>
    <p>If you are a consumer, you benefit from the legal guarantee of conformity for digital content (French Consumer
      Code, articles L224-25-1 et seq.). If the bouquet is not supplied to you, or does not display or work as described
      during its thirty days, write to us: we bring it into conformity free of charge within a reasonable time, and we
      push its fading back by as many days as it was unavailable. If bringing it into conformity is impossible, fails or
      does not happen within that time, or if the defect is serious, you may obtain a price reduction or the termination
      of the contract and a refund, under the conditions provided by law.</p>
    <p>Outside these cases and the exchange provided for in article 11, no refund is granted.</p>

    <h3>11. Exchange within 24 hours and credit</h3>
    <p>As a commercial gesture, which is not a right of withdrawal, you may exchange a bouquet you bought once, within 24
      hours of its purchase, if it has not been offered. The exchange is made from your account, for a bouquet of the day
      still available at the same price or less. The new bouquet lives thirty days from the exchange; the bouquet given
      back leaves your account and goes back on sale.</p>
    <p>If the new bouquet costs less, the difference is added to your credit: no money is paid out to you. The credit is
      taken off your next purchases automatically; it can be neither refunded nor transferred, and goes with the account.
      An exchange gives a credit note for the bouquet given back and an invoice for the new one.</p>

    <h3>12. Disputing a payment</h3>
    <p>If you dispute with your bank the payment for a bouquet that was delivered to you, we send Stripe the proofs of the
      order, including your dated request for immediate delivery. If the dispute is decided in your favour, the bouquet,
      or the one received in exchange, is withdrawn, including from the account of the person it was offered to, and the
      credit from that exchange is cancelled. Write to us first: a difficulty is often settled faster that way.</p>

    <h3>13. Liability</h3>
    <p>Payment is operated by Stripe and text messages are sent by OVHcloud. We are not liable for their outages or
      changes. Nothing in these terms limits the rights consumers hold under the law.</p>

    <h3>14. Complaints and mediation</h3>
    <p>Write to us first (see <a href="{{legal}}#contact">Contact</a>); we answer within 30 days. If no solution is
      found, consumers may refer the dispute free of charge to our consumer mediator:
      <span class="a-remplir">[name, website and postal address of the mediator]</span>.</p>

    <h3>15. Governing law</h3>
    <p>These terms are governed by French law. Consumers keep the protection given by the mandatory provisions of the law
      of the country where they live, and may bring a dispute before the courts of that country or of France.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Privacy policy</h2>
    <p>The data controller is the publisher named in the <a href="{{legal}}#notice">legal notice</a>. We collect as
      little data as possible, and none to profile you.</p>
    <h3>Data processed, purposes and legal bases</h3>
    <ul>
      <li><strong>Connection data</strong> (IP address, browser, pages requested): kept by our hosts in their technical
        logs, to serve the site and protect it from abuse. Legal basis: our legitimate interest in a working, secure site.</li>
      <li><strong>Your language and country</strong>, worked out on your device from your browser’s language settings, to
        show the site in your language and the price in your currency. Nothing is sent or kept.</li>
      <li><strong>Your account</strong>: your mobile phone number, the first name you choose and the account’s creation
        date, to identify you and attach your bouquets to your account. The number is stored encrypted; a fingerprint of
        it is used to find your account. It is never shown to anyone else. Legal basis: the contract.</li>
      <li><strong>Codes sent by text message</strong>, to verify your number: valid for ten minutes, then erased. Legal
        basis: the contract.</li>
      <li><strong>Your purchases</strong>: the bouquet, its price, the date, the payment reference and status sent by
        Stripe, and your request for immediate delivery. Legal basis: the contract and our accounting obligations.</li>
      <li><strong>Your gifts</strong>: the message, music and insects chosen, the sender’s first name and the gift’s
        status; the code is only kept as a fingerprint. The person who receives the bouquet sees the first name and the
        message; the sender only sees that the bouquet was claimed. Legal basis: the contract.</li>
    </ul>
    <h3>Payment</h3>
    <p>Your card details are entered on Stripe’s page and processed by Stripe, under its own privacy policy. We only
      receive the payment reference, its amount and its status.</p>
    <h3>Cookies</h3>
    <p>If you choose a language yourself, the site remembers it in a cookie named <code>lang</code>, for one year. While
      you are signed in to your account, a session cookie keeps you signed in. If you turn the sound on, your browser remembers it in its local storage (key <code>son</code>), sending us nothing. That is all: no audience measurement, no
      advertising. These cookies are needed for the service you ask for, so they require no consent banner.</p>
    <h3>Recipients and places of processing</h3>
    <p>GitHub, Inc. (site hosting, United States), Cloudflare, Inc. (accounts and gifts server, United States), Stripe
      (payment, Ireland and United States) and OVHcloud (text messages, France). Transfers outside the European Union
      rely on the EU–US Data Privacy Framework and on the European Commission’s standard contractual clauses.</p>
    <h3>Retention</h3>
    <p>Hosts’ technical logs: from a few days to a few weeks, depending on their settings. Account: as long as you keep
      it; once deleted, it is erased within 30 days. Gifts: as long as the bouquet is on an account. Purchases: ten
      years, the retention period for accounting records (French Commercial Code, article L123-22). Emails you send us:
      as long as needed to answer, then three years.</p>
    <h3>Your rights</h3>
    <p>You may ask for access to your data, its correction or erasure, the restriction of its processing, object to it
      and receive your data in a portable format, by writing to us (see <a href="{{legal}}#contact">Contact</a>). You
      can delete your account at any time. You may also lodge a complaint with the French data protection authority,
      the CNIL (cnil.fr).</p>
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
    <p>The flowers, vases, bouquets, decor, texts, video and code of this site and of Belai Bureau are original works.
      Any reproduction without permission is forbidden, except within the limits set by the
      <a href="{{legal}}#terms">terms of sale</a>. Stripe, OVHcloud, GitHub, Cloudflare and Base are names belonging to
      their respective owners.</p>
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
    shelves: { bouquets: 'Bouquets of the day', soliflores: 'Bud vases', vendus: 'Bouquets collected', cadeaux: 'My gifts', profil: 'My account' },
    desktopTitle: 'On my desktop',
    desktopLabel: 'Your bouquet on your desktop',
    appTitle: 'Belai Bureau',
    appLabel: 'Download Belai Bureau, the app that sets your bouquet on your screen',
    soundOn: 'Turn on the sound of nature',
    soundOff: 'Turn off the sound of nature',
    openSeaTitle: 'Our collection on OpenSea',
    openSeaLabel: 'Our collection on OpenSea (new tab)',
    about: 'About',
    legal: 'Legal',
    closeLegal: 'Close the legal panel',
    footer:
      '<p>Each bouquet is a digital bouquet, paid by card, with no VAT (VAT not applicable, art. 293 B of the French General Tax Code). It lives thirty days from its purchase, then stays faded for good. Delivery is immediate, so the right of withdrawal no longer applies once you confirm your purchase.</p><p>No tracking, no advertising: one cookie at most, to remember the language you chose.</p>',
    links: { notice: 'Legal notice', terms: 'Terms of sale', privacy: 'Privacy', app: 'Belai Bureau licence', accessibility: 'Accessibility', contact: 'Contact' },
    credit: '',
    language: 'Language',
    lookCloser: 'Look closer at the bouquet',
    stepBack: 'Step back',
    planeLabel: '{name}, on the pillar. {alt}',
    frameLabel: '{name}, about {fiat}, {life}. {alt}',
    buyLabel: 'Buy “{name}”, about {fiat}',
    lifeLeft: '{h} h {m} min',
    fadesIn: 'Fades in {t}',
    fadesInLower: 'fades in {t}',
    faded: 'Faded',
    fadedLower: 'faded',
    fadedForGood: 'Faded for good',
    // the month's collection and the copies left, under the bouquet's name ({month}: the month in the page's language)
    series: '{month} collection',
    fadeReminder: '(Bouquets fade in {n} days)',
    fadeShort: 'Fades in {n} days',
    collectionEnds: '{month} collection, ends {when}',
    collectionDone: '{month} collection, closed',
    buy: 'Buy',
    soon: 'Soon',
    soonMessage: 'Buying from the site is coming soon.',
    tickFirst: 'Tick the box first: your bouquet is delivered at once.',
    signInFirst: 'Sign in first: your bouquet will be attached to your number.',
    codeSent: 'Code sent by text message: enter it, then confirm.',
    wrongNumber: 'This number does not look valid.',
    wrongCode: 'Wrong code: {n} attempt(s) left.',
    tooMany: 'Too many attempts: try again in a few minutes.',
    codeExpired: 'This code has expired: ask for a new one.',
    soldOut: 'No copy of this bouquet is left.',
    payError: 'The payment could not go through. Try again in a moment.',
    redirecting: 'Going to the payment page…',
    paid: 'Your bouquet is yours: copy no. {n}.',
    paymentPending: 'Confirming the payment…',
    cancelled: 'Payment cancelled.',
    accountSoon: 'Your account is coming soon: you will sign in with your mobile number and find your bouquets here.',
    accountSignIn: 'Sign in',
    hello: 'Hello {name}',
    firstNameNeeded: 'Enter your first name to create your account.',
    creditBalance: 'Credit: {amount}, taken off your next purchase.',
    exchangeUntil: 'Exchange (until {t})',
    exchangeFor: 'Exchange for',
    exchangeConfirm: 'Confirm the exchange',
    exchangeDiff: 'The difference, {amount}, will go into your credit.',
    exchangeSame: 'Same price: nothing goes into your credit.',
    exchangeNone: 'No bouquet of the day at this price or less is available.',
    exchangeDone: 'Exchanged: your new bouquet lives thirty days.',
    exchangeRefused: 'This exchange is not possible.',
    helpSubject: 'Belai’s Garden customer service',
    essai: {
      titre: "Try the bouquet on your desktop",
      fermer: "Close",
      annuler: "Not now",
      partager: "Click your <b>screen</b>, then <b>Share</b>: I look at it once, and nothing leaves your computer.",
      partagerEncore: "To set this bouquet on your own desktop, share your <b>entire screen</b>: I look at it once, and nothing leaves your computer.",
      partagerBouton: "Share my screen",
      pasEcran: "That’s a window, not your screen. Choose <b>Entire screen</b>, please.",
      reduire: "Now <b>minimise</b> this window (the <b>–</b> at the top), then <b>open it again</b>: I’ll take your desktop just as it is.",
      encore: "I still see this page. Once more: your desktop has to be in view.",
      pret: "I have your desktop. <b>Click anywhere</b> to set the bouquet on it.",
      pretTel: "I have your home screen. Shall we set the bouquet on it?",
      montrer: "Show me",
      glisser: "Here it is, on your desktop. <b>Drag it</b> wherever you like.",
      glisserTel: "Here it is, on your home screen. <b>Drag it</b> wherever you like.",
      taille: "<b>Pull a corner</b> to make it larger or smaller.",
      ok: "Just right? Press <b>✓</b> to set it.",
      appui: "It’s set. To change it later, as in Belai Bureau: <b>press and hold</b> the bouquet for 6 seconds.",
      revalider: "Free again: move it or size it, then <b>✓</b> to set it once more.",
      valider: "Set it here",
      fin: "That’s how it lives on your desktop, for {jours} days. To keep it there for real: <b>Belai Bureau</b>, free for Windows.",
      finAutre: "That’s how it lives on your desktop, for {jours} days. Belai Bureau is coming soon to your system.",
      finTel: "That’s how it would look on your phone. Belai Bureau for phones is coming soon.",
      telecharger: "Get Belai Bureau",
      retour: "Back to the bouquets",
      capture: "Let’s see it on your phone. Go to your home screen, <b>take a screenshot</b>, then come back here and pick it.<small>It stays on your phone: nothing is sent.</small>",
      choisir: "Pick my screenshot",
    },
    copyNo: 'copy no. {n}',
    noBouquet: 'No bouquet on your account yet.',
    giftsSoon: 'Gifts are coming soon: you will open here the bouquet someone gives you.',
    giftOpened: 'Your gift has arrived.',
    giftWrong: 'This first name and code match no gift.',
    receipt: {
      title: 'Receipt',
      download: 'Download your receipt',
      bouquet: 'Bouquet',
      price: 'Price',
      date: 'Date',
      seller: 'Seller',
      waiver: 'Before paying, you asked for immediate delivery and acknowledged that you thereby lose your right of withdrawal (French Consumer Code, article L221-28, 13°).',
      terms: 'Terms of sale accepted on that day: {url}',
      taxes: 'VAT not applicable, art. 293 B of the French General Tax Code.',
      copy: 'Copy',
      copyOf: 'no. {n}, {month}',
      order: 'Order',
      payment: 'Payment',
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
    'prisme-jaune': 'a cut citrine-glass prism with a suspended heart',
    'jardiniere-cristaux': 'an Art Nouveau crystalline-glaze jardinière',
    'prismes-bronze': 'a vase of verdigris bronze prisms',
    'colonne-art-nouveau': 'an Art Nouveau stoneware column',
    'bouteille-dragon': 'a midnight-blue bottle with a turquoise dragon',
    'jarre-carpes': 'a terracotta jar with carp in relief',
    'bronze-lys': 'a patinated bronze vase with lilies',
    'gres-chauve-souris': 'a stoneware vase with a glazed bat',
    'balustre-perce-neige': 'a baluster vase with snowdrops',
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
    'rose-standard': 'rose',
    'rose-aspect-jardin': 'garden-style rose',
    gerbera: 'gerbera',
    'dahlia-decoratif': 'dahlia',
    'chrysantheme-disbud': 'disbud chrysanthemum',
    'anthurium-andraeanum': 'anthurium',
    'amarante-retombante': 'love-lies-bleeding',
    nerine: 'nerine',
    'oeillet-standard': 'carnation',
    delphinium: 'delphinium',
    gloriosa: 'gloriosa lily',
    scabieuse: 'scabious',
  },
};
