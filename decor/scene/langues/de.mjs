// The site's words in German: the source of the other languages (fr, es, zh, de have the same keys). build.mjs writes
// the pages from gabarits/ with them; the runtime strings (js) go into each page as a JSON block read by entete.js and
// boutique.js. In the HTML strings: {{p}} is the page's language prefix ('' or 'fr/'...), {{legal}} the legal page with
// that prefix; in the runtime strings, {name} and the like are filled in by the scripts. Product names stay as they are.
export default {
  code: 'de',
  name: 'Deutsch',
  locale: 'de-DE',
  ogLocale: 'de_DE',
  // a list of words as the language writes it: "a, b und c"
  list: (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} und ${a[a.length - 1]}`),
  more: 'weitere',
  describe: ({ stems, flowers, vase }) =>
    `Ein einzigartiger digitaler Blumenstrauß aus ${stems} von Hand gezeichneten Stielen (${flowers}) in ${vase}. Er lebt dreißig Tage und bleibt dann für immer verblüht.`,

  pages: {
    index: {
      title: "Digitaler Blumenstrauß, von Hand gezeichnet | Belai's Garden",
      description: 'Digitale Blumensträuße, Stiel für Stiel nach echten Blumen gezeichnet. Jeden Monat eine Kollektion in limitierten Serien, zum Verschenken und für Ihren Bildschirm.',
      ogTitle: 'Digitale Blumensträuße, Stiel für Stiel gezeichnet',
      ogDescription: 'Jeden Monat eine Kollektion von Sträußen in limitierten Serien, jeder in einer echten Vase. Sehen Sie ihnen beim Blühen zu, verschenken Sie einen, stellen Sie ihn auf Ihren Bildschirm.',
    },
    about: {
      title: "So entstehen unsere digitalen Blumensträuße | Belai's Garden",
      description: 'Wie unsere digitalen Blumensträuße entstehen: Blumen in Code nach echten Fotos gezeichnet, echte Vasen, der Preis der Stiele, dreißig Tage Leben.',
      ogTitle: 'Über unsere digitalen Blumensträuße',
      ogDescription: 'Jede Blume in Code nach echten Fotos gezeichnet. Einzigartige Blumensträuße in echten Vasen, die erblühen und dann verblühen.',
    },
    desktop: {
      title: 'Blumen-Widget für den Windows-Desktop | Belai Bureau',
      description: 'Belai Bureau, ein kostenloses Widget für Windows 10 und 11: Ihr gesammelter digitaler Blumenstrauß auf dem Desktop. Platzieren, skalieren, fixieren.',
      ogTitle: 'Ihr Blumenstrauß auf Ihrem Desktop',
      ogDescription: 'Ein kostenloses Windows-Widget für Ihren digitalen Blumenstrauß: platzieren, Größe wählen, fixieren.',
    },
    legal: {
      title: "Impressum, AGB und Datenschutz | Belai's Garden",
      description: "Impressum, AGB für die digitalen Blumensträuße, Datenschutzerklärung, Lizenz von Belai Bureau und Erklärung zur Barrierefreiheit von Belai's Garden.",
      ogTitle: 'Impressum, AGB und Datenschutz',
      ogDescription: 'Wer wir sind, wie ein Blumenstrauß verkauft wird, was wir mit Daten tun.',
    },
  },
  shareAlt: 'Der Blumenstrauß Ronde bleue: Flieder, Iris, Anemonen und Hyazinthen in einer Milchglasvase mit Tänzerinnen',
  orgDescription: 'Digitale Blumensträuße, Stiel für Stiel nach echten Blumen gezeichnet, zum Verschenken und für Ihren Bildschirm.',
  listName: 'Blumensträuße des Tages',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden: lebendige digitale Blumensträuße",
    intro:
      'Digitale Blumensträuße, Stiel für Stiel nach echten Blumen gezeichnet. Jeden Monat eine neue Kollektion von Sträußen in limitierten Serien, jeder in einer echten Vase. Ein Strauß lebt dreißig Tage und bleibt dann für immer verblüht. Verschenken Sie ihn, oder stellen Sie ihn mit Belai Bureau auf Ihren Bildschirm.',
    noscript:
      'Dieser Garten braucht JavaScript, damit die Blumensträuße erblühen. Lesen Sie <a href="{{p}}about.html">mehr über die Blumensträuße</a>, sehen Sie, <a href="{{p}}desktop.html">wie Sie einen auf Ihren Desktop stellen</a>, oder lesen Sie <a href="{{legal}}">Impressum und AGB</a>.',
    galleryLabel: 'Blumensträuße des Tages',
    lookCloser: 'Den Blumenstrauß näher ansehen',
    shelvesLabel: 'Regale',
    budVases: 'Solitärvasen kommen bald: eine einzelne Blume in ihrer Vase.',
    noneCollected: 'Noch hat kein Blumenstrauß seinen Sammler gefunden.',
    seeOpenSea: 'Die Sammlung auf OpenSea ansehen',
    onDesktop: 'Auf Ihrem Desktop',
    buy: 'Kaufen',
    demoTitle: 'Ihr Blumenstrauß auf Ihrem Desktop',
    closeVideo: 'Video schließen',
    videoMissing: 'Das Video ist unterwegs: Es zeigt, wie Sie Ihren Blumenstrauß auf den Desktop Ihres Computers stellen.',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: 'Vor der Zahlung',
    waiver: 'Ich verlange die sofortige Lieferung meines Blumenstraußes und nehme zur Kenntnis, dass ich dadurch mein 14-tägiges Widerrufsrecht verliere.',
    accept: 'Mit der Zahlung bestätigen Sie, dass Sie volljährig sind, und akzeptieren die <a href="{{legal}}#terms">Allgemeinen Geschäftsbedingungen</a>.',
    confirm: 'Zahlungspflichtig bestellen',
    cancel: 'Abbrechen',
    signInTitle: 'Ihr Konto, per SMS',
    phone: 'Mobilnummer',
    sendCode: 'Code erhalten',
    code: 'Erhaltener Code',
    firstName: 'Vorname',
    giftsTitle: 'Meine Geschenke',
    giftsHelp: 'Geben Sie den Vornamen der Person ein, die Ihnen einen Strauß schenkt, und den Code, den sie Ihnen geschickt hat.',
    giftSender: 'Ihr Vorname',
    giftCode: 'Code',
    giftOpen: 'Geschenk öffnen',
    accountTitle: 'Mein Konto',
    accountHelp: 'Ihr Vorname und Ihre Mobilnummer: Sie erhalten einen Code per SMS.',
    invoices: 'Rechnungen',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
  },

  // ---------- the About page
  about: {
    h1: 'Über uns',
    lead: 'Blumensträuße, Blume für Blume gezeichnet, die vor Ihren Augen erblühen.',
    body: `<h2>Nach dem Leben gezeichnete Blumen</h2>
  <p>Jede Blume in diesem Garten ist in Code gezeichnet, Linie für Linie, nach echten Fotos: die Form der Blütenblätter,
    ihre an jeder Sorte gemessenen Farben, die Knospen, die offene Blüte und die verblühte. Mehr als fünfhundert Arten
    sind bereits im Garten.</p>

  <h2>Stiel für Stiel gebundene Sträuße</h2>
  <p>Jeder Strauß wird Stiel für Stiel gebunden, jeder in einer echten Vase, wie der Bronzekarpfen. Die Stelle jedes Stiels, jeder Blüte und jedes Blatts findet sich in keinem anderen Strauß.</p>

  <h2>Ein lebendiger Blumenstrauß</h2>
  <p>Ein Strauß lebt dreißig Tage ab dem Kauf: Ein Countdown in Stunden und Minuten zeigt die verbleibende Zeit. Danach bleibt er verblüht und unbewegt, für immer.</p>

  <h2>Der Preis echter Stiele</h2>
  <p>Der Preis eines Straußes ist die Summe dessen, was seine Stiele bei einem Floristen in Frankreich kosten. Die Vase gibt es dazu. Bezahlt wird mit Karte.</p>

  <h2>Eine Kollektion pro Monat</h2>
  <p>Jeder Monat hat seine Kollektion. Jeder Strauß darin gibt es in einer begrenzten Zahl von Exemplaren, angegeben unter seinem Namen, und der Strauß, den Sie kaufen, ist genau der, den Sie sehen.</p>

  <h2>Einen Strauß verschenken</h2>
  <p>Beim Kauf können Sie den Strauß verschenken: eine kurze Nachricht, von den Insekten getragen, eine Musik und ein Code zum Weitergeben. Die beschenkte Person erhält ihn unter „Meine Geschenke“ mit Ihrem Vornamen und diesem Code.</p>

  <h2>Auf Ihrem Desktop</h2>
  <p>Mit <a href="{{p}}desktop.html">Belai Bureau</a>, einem kostenlosen Widget für Windows, steht der Blumenstrauß, den
    Sie gesammelt haben, auf dem Desktop Ihres Computers – in der Größe Ihrer Wahl, vor oder hinter Ihren Fenstern.</p>

  <h2>Den Garten wachsen lassen</h2>
  <p>Jeder gesammelte Blumenstrauß lässt den Garten wachsen: neue Arten, neue Vasen, neue Blumensträuße.</p>`,
    faqTitle: 'Fragen',
    faq: [
      ['Was ist ein digitaler Blumenstrauß?', 'Ein Strauß aus Blumen, die in Vektorgrafik nach echten Fotos Stiel für Stiel gezeichnet sind, in einer echten Vase. Er blüht auf dem Bildschirm, wiegt sich im Wind und verblüht nach dreißig Tagen.'],
      ['Kann ich einen Blumenstrauß auf meinen Bildschirm stellen?', 'Ja. Laden Sie Belai Bureau herunter (kostenlos), melden Sie sich einmal mit Ihrer Telefonnummer und dem per SMS erhaltenen Code an: Die Sträuße Ihres Kontos erscheinen auf Ihrem Bildschirm, wo Sie sie platzieren, in der Größe anpassen und fixieren.'],
      ['Wie wird der Preis eines Blumenstraußes festgelegt?', 'Nach der Summe dessen, was seine Stiele bei einem Floristen in Frankreich kosten würden. Die Vase gibt es dazu. Der Preis wird in Euro angezeigt (außerhalb des Euroraums in US-Dollar) und mit Karte bezahlt.'],
      ['Was passiert nach dreißig Tagen?', 'Der Blumenstrauß verblüht und bleibt verblüht und unbewegt, für immer. Er bleibt Ihrer.'],
      ['Wie verschenke ich einen Strauß?', 'Wählen Sie beim Kauf „Verschenken“: Schreiben Sie eine kurze Nachricht, wählen Sie eine Musik und die Insekten, die sie tragen. Sie erhalten einen Link und einen Code; die Person gibt sie mit Ihrem Vornamen unter „Meine Geschenke“ ein, und der Strauß geht auf ihr Konto über.'],
      ['Wie viele Exemplare gibt es von jedem Strauß?', 'Jeder Strauß der Monatskollektion gibt es in einer begrenzten Zahl von Exemplaren, angegeben unter seinem Namen. Sind sie vergriffen, gibt es keine mehr.'],
    ],
    back: '← Zurück zu den Blumensträußen',
  },

  // ---------- the desktop page
  desktop: {
    h1: 'Ihr Blumenstrauß auf Ihrem Desktop',
    lead: 'Stellen Sie den Blumenstrauß, den Sie gesammelt haben, auf den Desktop Ihres Computers – mit Belai Bureau, einem kostenlosen Widget für Windows.',
    videoLabel: 'Anleitungsvideo: Ihren Blumenstrauß Schritt für Schritt auf den Desktop stellen (nur Musik; die Schritte stehen daneben)',
    stepsTitle: 'In fünf Schritten',
    steps: [
      'Laden Sie Belai Bureau herunter und installieren Sie es.',
      'Verknüpfen Sie Ihre Wallet über das Belai-Symbol neben der Uhr.',
      'Wählen Sie Ihren Blumenstrauß und holen Sie ihn auf den Bildschirm: eine Signatur, kostenlos, keine Transaktion.',
      'Platzieren Sie ihn, wählen Sie seine Größe, stellen Sie ihn vor oder hinter Ihre Fenster und fixieren Sie ihn dann mit ✓.',
      'Um ihn erneut zu verschieben, halten Sie die Maustaste auf dem Blumenstrauß sechs Sekunden lang gedrückt.',
    ],
    download: 'Belai Bureau herunterladen',
    downloadSmall: 'Windows 10 und 11 · 3 MB · kostenlos',
    note: 'Nur die Wallet, die einen Blumenstrauß hält, kann ihn anzeigen. Beim ersten Start warnt Windows möglicherweise, dass es die App noch nicht kennt: „Weitere Informationen“, dann „Trotzdem ausführen“.',
    appLanguage: 'Die App selbst ist vorerst nur auf Französisch verfügbar.',
    fingerprint: 'Version {v} · SHA-256',
    licence: 'Lizenz und Datenschutz',
    back: '← Zurück zu den Blumensträußen',
    appDescription: 'Ein kostenloses Desktop-Widget für Windows, das den digitalen Blumenstrauß, den Sie gesammelt haben, auf Ihrem Desktop zeigt: platzieren, Größe wählen, fixieren, vor oder hinter Ihren Fenstern.',
    videoName: 'So stellen Sie Ihren Blumenstrauß auf Ihren Desktop',
    videoDescription: 'Eine einminütige Anleitung: Belai Bureau herunterladen, Wallet verknüpfen, Blumenstrauß auf den Bildschirm holen, platzieren, Größe wählen und fixieren, sechs Sekunden gedrückt halten, um ihn erneut zu verschieben.',
    howToName: 'So stellen Sie einen digitalen Blumenstrauß auf Ihren Windows-Desktop',
    howToTools: ['Belai Bureau (kostenlos, Windows 10 und 11)', 'Eine Wallet, die einen Blumenstrauß hält'],
  },

  // ---------- the legal page
  legal: {
    h1: 'Rechtliches',
    updated: 'Zuletzt aktualisiert: 27. Oktober 2026',
    onThisPage: 'Auf dieser Seite',
    toc: { notice: 'Impressum', terms: 'Allgemeine Geschäftsbedingungen', privacy: 'Datenschutzerklärung', app: 'Lizenz von Belai Bureau', ip: 'Geistiges Eigentum', accessibility: 'Barrierefreiheit', contact: 'Kontakt' },
    reference: '',
    body: `<section id="notice" aria-labelledby="t-notice">
    <h2 id="t-notice">Impressum</h2>
    <h3>Anbieter</h3>
    <p>Hadrien Lonjaret, entrepreneur individuel (Einzelunternehmer nach französischem Recht), handelnd unter der
      Bezeichnung Agent 33<br>
      35 cours Sablon, 63000 Clermont-Ferrand, Frankreich<br>
      E-Mail: <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Telefon: +33 6 18 55 81 22<br>
      SIREN 853 801 488 · RCS Clermont-Ferrand · USt-IdNr. FR69853801488</p>
    <h3>Inhaltlich verantwortlich</h3>
    <p>Hadrien Lonjaret</p>
    <h3>Hosting</h3>
    <p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Vereinigte Staaten ·
      github.com. Der Server für Konten und Geschenke wird von Cloudflare, Inc., 101 Townsend Street, San Francisco,
      CA 94107, Vereinigte Staaten, gehostet · cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Allgemeine Verkaufsbedingungen</h2>

    <h3>1. Parteien und Geltungsbereich</h3>
    <p>Diese Allgemeinen Verkaufsbedingungen gelten für jeden Blumenstrauß, den der im Impressum genannte Herausgeber
      („wir“) auf dieser Website an volljährige Personen („Sie“) verkauft. Mit der Bezahlung eines Straußes akzeptieren
      Sie diese Bedingungen in ihrer am Kauftag geltenden Fassung. Sie liegen in mehreren Sprachen vor; maßgeblich ist
      die französische Fassung.</p>

    <h3>2. Gegenstand: der Blumenstrauß</h3>
    <p>Ein Blumenstrauß ist ein digitales Werk: in Vektorgrafik gezeichnete Blumen in einer Vase, auf dem Bildschirm
      animiert. Jeder Strauß gehört zur Kollektion eines Monats und wird nur in einer begrenzten Zahl von Exemplaren
      verkauft, die unter seinem Namen zusammen mit den verbleibenden Exemplaren angegeben ist. Der Strauß, den Sie
      kaufen, ist genau der, den Sie sehen, ohne Abweichung. Seine Seite zeigt vor dem Kauf seinen Namen, seine Vase,
      seine Kollektion und seinen Preis.</p>
    <p>Ein Strauß lebt dreißig Tage ab dem Kauf: Er blüht und wiegt sich, und ein Countdown zeigt die verbleibende Zeit.
      Danach verblüht er und bleibt endgültig verblüht und unbewegt. Diese Entwicklung ist Teil des Werks und kein
      Mangel.</p>
    <p>Ein Strauß gewährt keinerlei Anspruch auf Einnahmen oder Beteiligungen und wird auf dieser Website nicht
      weiterverkauft.</p>

    <h3>3. Ihr Konto</h3>
    <p>Um einen Strauß zu kaufen oder zu erhalten, legen Sie ein Konto mit Ihrem Vornamen und Ihrer Mobilnummer an, die
      durch einen per SMS gesendeten Code bestätigt wird. Ihre Sträuße, Ihre Rechnungen und Ihr Guthaben (Artikel 11)
      sind diesem Konto zugeordnet. Sie sind für den Zugang zu Ihrer Nummer verantwortlich: Teilen Sie uns mit, wenn Sie
      sie ändern. Wenn Sie Ihr Konto löschen, verschwinden Ihre Sträuße und Ihr Guthaben mit ihm.</p>

    <h3>4. Was Sie erhalten</h3>
    <p>Der Kauf gibt Ihnen das persönliche, nicht ausschließliche Recht, den Strauß auf dieser Website anzusehen und ihn
      mit Belai Bureau auf Ihren Bildschirmen anzuzeigen, zur privaten Nutzung. Dieses Recht lässt sich nur durch
      Verschenken des Straußes weitergeben (Artikel 8). Wie bei einem Gemälde überträgt der Kauf nicht das Urheberrecht
      an der Zeichnung: Herstellung und Verkauf von Kopien oder abgeleiteten Produkten sowie jede gewerbliche Nutzung
      sind nicht eingeschlossen.</p>

    <h3>5. Preis</h3>
    <p>Der Preis wird in Euro festgelegt, ohne Mehrwertsteuer (nicht anwendbar, Art. 293 B des französischen
      Steuergesetzbuchs), und vor dem Kauf am Strauß angezeigt; er ist die Summe dessen, was seine Stiele bei einem
      Floristen in Frankreich kosten, die Vase gibt es dazu. Außerhalb des Euroraums ist der Betrag in US-Dollar eine
      Orientierung: Bezahlt wird in Euro, und Ihre Bank kann Umrechnungsgebühren berechnen.</p>

    <h3>6. Bestellung und Zahlung</h3>
    <p>Sie bezahlen mit Karte, Apple Pay oder Google Pay auf der Zahlungsseite unseres Anbieters Stripe (Stripe Payments
      Europe, Ltd., Dublin, Irland). Wir sehen und speichern Ihre Kartennummern nie. Vor der Zahlung kreuzen Sie ein Feld
      an, um die sofortige Lieferung zu verlangen (siehe Artikel 9). Die Bestätigung der Zahlung gilt als
      zahlungspflichtige Bestellung. Ein Exemplar wird für Sie reserviert, solange die Zahlungsseite geöffnet ist,
      höchstens dreißig Minuten.</p>

    <h3>7. Lieferung und Rechnung</h3>
    <p>Der Strauß wird Ihrem Konto hinzugefügt, sobald Stripe die Zahlung bestätigt. Sie erhalten einen Beleg: Er nennt
      den Strauß, seinen Preis, das Datum und Ihr Verlangen nach sofortiger Lieferung. Eine nummerierte Rechnung steht in
      Ihrem Konto zum Drucken oder Speichern bereit.</p>

    <h3>8. Einen Strauß verschenken</h3>
    <p>Beim Kauf können Sie den Strauß verschenken und seine Ankunft gestalten: eine kurze Nachricht, von den Insekten
      getragen, eine Musik und die Insekten, die sie tragen. Sie erhalten einen Link und einen Code, die Sie selbst an
      eine Person Ihrer Wahl weitergeben. Der Code gilt bis zum Verblühen des Straußes und nur einmal; nach fünf
      Fehlversuchen wird die Eingabe für eine Stunde gesperrt. Gibt die Person Ihren Vornamen und den Code ein, geht der
      Strauß auf ihr Konto über und verlässt Ihres; solange der Code nicht genutzt wurde, bleibt der Strauß auf Ihrem
      Konto. Sie sind für den Inhalt der Nachricht verantwortlich, die weder gegen Gesetze noch gegen Rechte Dritter
      verstoßen darf.</p>

    <h3>9. Widerrufsrecht</h3>
    <p>Wenn Sie Verbraucher mit Wohnsitz in der Europäischen Union sind, haben Sie grundsätzlich 14 Tage Zeit, einen
      Fernabsatzkauf zu widerrufen. Ein Strauß ist ein digitaler Inhalt, der nicht auf einem körperlichen Datenträger
      geliefert und sofort bereitgestellt wird: Vor der Zahlung verlangen Sie ausdrücklich seine sofortige Lieferung und
      bestätigen, dass Sie dadurch Ihr Widerrufsrecht verlieren (französisches Verbrauchergesetzbuch, Artikel L221-28,
      13°; Richtlinie 2011/83/EU, Artikel 16 Buchstabe m).</p>

    <h3>10. Vertragsmäßigkeit</h3>
    <p>Als Verbraucher genießen Sie die gesetzliche Gewährleistung der Vertragsmäßigkeit für digitale Inhalte
      (französisches Verbrauchergesetzbuch, Artikel L224-25-1 ff.). Wird Ihnen der Strauß nicht bereitgestellt, oder wird
      er während seiner dreißig Tage nicht wie beschrieben angezeigt oder funktioniert er nicht, schreiben Sie uns: Wir
      stellen den vertragsmäßigen Zustand innerhalb angemessener Frist kostenlos her und verschieben sein Verblühen um so
      viele Tage, wie er nicht verfügbar war. Ist dies unmöglich, schlägt es fehl oder erfolgt es nicht innerhalb dieser
      Frist, oder ist der Mangel schwerwiegend, können Sie eine Minderung des Preises oder die Beendigung des Vertrags und
      die Erstattung verlangen, unter den gesetzlich vorgesehenen Bedingungen.</p>
    <p>Außerhalb dieser Fälle und des in Artikel 11 vorgesehenen Umtauschs wird keine Erstattung gewährt.</p>

    <h3>11. Umtausch innerhalb von 24 Stunden und Guthaben</h3>
    <p>Aus Kulanz, ohne dass dies ein Widerrufsrecht darstellt, können Sie einen gekauften Strauß einmal innerhalb von 24
      Stunden nach dem Kauf umtauschen, sofern er nicht verschenkt wurde. Der Umtausch erfolgt in Ihrem Konto gegen einen
      noch verfügbaren Strauß des Tages zum gleichen oder einem niedrigeren Preis. Der neue Strauß lebt dreißig Tage ab
      dem Umtausch; der zurückgegebene Strauß verlässt Ihr Konto und wird wieder angeboten.</p>
    <p>Kostet der neue Strauß weniger, wird die Differenz Ihrem Guthaben gutgeschrieben: Es wird kein Geld ausgezahlt. Das
      Guthaben wird automatisch von Ihren nächsten Käufen abgezogen; es ist weder erstattungsfähig noch übertragbar und
      erlischt mit dem Konto. Ein Umtausch ergibt eine Gutschrift für den zurückgegebenen Strauß und eine Rechnung für
      den neuen.</p>

    <h3>12. Anfechtung einer Zahlung</h3>
    <p>Wenn Sie bei Ihrer Bank die Zahlung für einen Ihnen gelieferten Strauß anfechten, übermitteln wir Stripe die
      Nachweise der Bestellung, darunter Ihr datiertes Verlangen nach sofortiger Lieferung. Wird die Anfechtung zu Ihren
      Gunsten entschieden, wird der Strauß entzogen, oder der im Umtausch erhaltene, auch aus dem Konto der Person, der er
      geschenkt wurde, und das Guthaben aus diesem Umtausch wird gestrichen. Schreiben Sie uns zuerst: Eine Schwierigkeit
      lässt sich so oft schneller lösen.</p>

    <h3>13. Haftung</h3>
    <p>Die Zahlung wird von Stripe abgewickelt, die SMS werden von OVHcloud versendet. Für deren Ausfälle oder Änderungen
      haften wir nicht. Keine Bestimmung dieser Bedingungen schränkt die gesetzlichen Rechte von Verbrauchern ein.</p>

    <h3>14. Beschwerden und Schlichtung</h3>
    <p>Schreiben Sie uns zuerst (siehe <a href="{{legal}}#contact">Kontakt</a>); wir antworten innerhalb von 30 Tagen.
      Findet sich keine Lösung, kann der Verbraucher den Streit kostenlos unserem Verbraucherschlichter vorlegen:
      <span class="a-remplir">[Name, Website und Postanschrift des Schlichters]</span>.</p>

    <h3>15. Anwendbares Recht</h3>
    <p>Diese Bedingungen unterliegen französischem Recht. Verbraucher behalten den Schutz der zwingenden Vorschriften des
      Landes, in dem sie wohnen, und können einen Rechtsstreit vor die Gerichte dieses Landes oder Frankreichs bringen.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Datenschutzerklärung</h2>
    <p>Verantwortlicher ist der im <a href="{{legal}}#notice">Impressum</a> genannte Herausgeber. Wir erheben so wenige
      Daten wie möglich und keine, um Profile zu erstellen.</p>
    <h3>Verarbeitete Daten, Zwecke und Rechtsgrundlagen</h3>
    <ul>
      <li><strong>Verbindungsdaten</strong> (IP-Adresse, Browser, aufgerufene Seiten): von unseren Hostern in ihren
        technischen Protokollen gespeichert, um die Website bereitzustellen und vor Missbrauch zu schützen.
        Rechtsgrundlage: unser berechtigtes Interesse an einer funktionierenden, sicheren Website.</li>
      <li><strong>Ihre Sprache und Ihr Land</strong>, auf Ihrem Gerät aus den Spracheinstellungen Ihres Browsers
        abgeleitet, um die Website in Ihrer Sprache und den Preis in Ihrer Währung anzuzeigen. Nichts wird gesendet oder
        gespeichert.</li>
      <li><strong>Ihr Konto</strong>: Ihre Mobilnummer, der von Ihnen gewählte Vorname und das Erstellungsdatum des Kontos,
        um Sie zu identifizieren und Ihre Sträuße Ihrem Konto zuzuordnen. Die Nummer wird verschlüsselt gespeichert; ein
        Fingerabdruck der Nummer dient dazu, Ihr Konto zu finden. Sie wird niemals einer anderen Person gezeigt.
        Rechtsgrundlage: der Vertrag.</li>
      <li><strong>Per SMS gesendete Codes</strong>, um Ihre Nummer zu bestätigen: zehn Minuten gültig, dann gelöscht.
        Rechtsgrundlage: der Vertrag.</li>
      <li><strong>Ihre Käufe</strong>: der Strauß, sein Preis, das Datum, die von Stripe übermittelte Zahlungsreferenz
        und der Zahlungsstatus sowie Ihr Verlangen nach sofortiger Lieferung. Rechtsgrundlage: der Vertrag und unsere
        Buchführungspflichten.</li>
      <li><strong>Ihre Geschenke</strong>: die gewählte Nachricht, Musik und Insekten, der Vorname des Absenders und der
        Status des Geschenks; der Code wird nur als Fingerabdruck gespeichert. Wer den Strauß erhält, sieht den Vornamen
        und die Nachricht; der Absender sieht nur, dass der Strauß abgeholt wurde. Rechtsgrundlage: der Vertrag.</li>
    </ul>
    <h3>Zahlung</h3>
    <p>Ihre Kartendaten werden auf der Seite von Stripe eingegeben und von Stripe nach dessen eigener Datenschutzerklärung
      verarbeitet. Wir erhalten nur die Zahlungsreferenz, den Betrag und den Status.</p>
    <h3>Cookies</h3>
    <p>Wenn Sie selbst eine Sprache wählen, merkt sich die Website diese in einem Cookie namens <code>lang</code>, ein Jahr
      lang. Solange Sie in Ihrem Konto angemeldet sind, hält ein Sitzungscookie Sie angemeldet. Wenn Sie den Ton einschalten, merkt sich Ihr Browser diese Wahl in seinem lokalen Speicher (Schlüssel <code>son</code>), ohne uns etwas zu senden. Das ist alles: keine
      Reichweitenmessung, keine Werbung. Diese Cookies sind für den von Ihnen gewünschten Dienst erforderlich und
      benötigen daher kein Einwilligungsbanner.</p>
    <h3>Empfänger und Orte der Verarbeitung</h3>
    <p>GitHub, Inc. (Hosting der Website, Vereinigte Staaten), Cloudflare, Inc. (Server für Konten und Geschenke,
      Vereinigte Staaten), Stripe (Zahlung, Irland und Vereinigte Staaten) und OVHcloud (SMS-Versand, Frankreich).
      Übermittlungen außerhalb der Europäischen Union stützen sich auf den EU-US-Datenschutzrahmen (Data Privacy
      Framework) und auf die Standardvertragsklauseln der Europäischen Kommission.</p>
    <h3>Speicherdauer</h3>
    <p>Technische Protokolle der Hoster: einige Tage bis einige Wochen, je nach deren Einstellungen. Konto: solange Sie es
      behalten; nach der Löschung wird es innerhalb von 30 Tagen entfernt. Geschenke: solange der Strauß einem Konto
      zugeordnet ist. Käufe: zehn Jahre, die Aufbewahrungsfrist für Buchungsbelege (französisches Handelsgesetzbuch,
      Artikel L123-22). E-Mails, die Sie uns senden: so lange wie für die Antwort nötig, danach drei Jahre.</p>
    <h3>Ihre Rechte</h3>
    <p>Sie können Auskunft über Ihre Daten, deren Berichtigung oder Löschung und die Einschränkung ihrer Verarbeitung
      verlangen, der Verarbeitung widersprechen und Ihre Daten in einem übertragbaren Format erhalten, indem Sie uns
      schreiben (siehe <a href="{{legal}}#contact">Kontakt</a>). Sie können Ihr Konto jederzeit löschen. Sie können sich
      außerdem bei der französischen Datenschutzbehörde CNIL (cnil.fr) beschweren.</p>
  </section>

  <section id="app" aria-labelledby="t-app">
    <h2 id="t-app">Lizenz von Belai Bureau</h2>
    <p>Belai Bureau ist eine kostenlose Software für Windows 10 und 11, die auf Ihrem Desktop die Blumensträuße anzeigt,
      die eine mit ihr verknüpfte Wallet hält. Wir räumen Ihnen eine kostenlose, persönliche, nicht ausschließliche
      Lizenz zur Installation und Nutzung ein. Sie dürfen die Software weder verkaufen noch veränderte Kopien
      verbreiten.</p>
    <p><strong>Was sie mit Daten macht:</strong> Sie speichert auf Ihrem Computer einen Zufallscode für diesen Computer,
      die Adresse der verknüpften Wallet und Ihre Einstellungen. Sie fragt beim Base-Netzwerk (mainnet.base.org,
      betrieben von Base) ab, welche Blumensträuße Ihre Wallet hält, und öffnet diese Website in Ihrem Browser, wenn Sie
      eine Wallet verknüpfen. Sie sendet uns nichts und misst nichts.</p>
    <p>Die App wird in ihrem jeweiligen Zustand bereitgestellt. Durch die Deinstallation (Windows-Einstellungen, Apps)
      werden sie und ihre Einstellungen entfernt.</p>
  </section>

  <section id="ip" aria-labelledby="t-ip">
    <h2 id="t-ip">Geistiges Eigentum</h2>
    <p>Die Blumen, Vasen, Sträuße, Kulissen, Texte, das Video und der Code dieser Website und von Belai Bureau sind
      Originalwerke. Jede Vervielfältigung ohne Genehmigung ist untersagt, außer in den Grenzen der
      <a href="{{legal}}#terms">Allgemeinen Verkaufsbedingungen</a>. Stripe, OVHcloud, GitHub, Cloudflare und Base sind
      Namen ihrer jeweiligen Inhaber.</p>
  </section>

  <section id="accessibility" aria-labelledby="t-accessibility">
    <h2 id="t-accessibility">Barrierefreiheit</h2>
    <p>Wir streben die Konformität mit den Web Content Accessibility Guidelines (WCAG) 2.1, Stufe AA, an. Die Website
      ist per Tastatur bedienbar (Pfeiltasten zum Wechseln des Blumenstraußes, Escape zum Zurücktreten), jede
      Schaltfläche hat einen Namen für Screenreader, und die Animationen stoppen, wenn Ihr System reduzierte Bewegung
      anfordert. Bekannte Einschränkungen: Die Wiese und die Blumensträuße sind Kunstwerke, die in Worten statt im Detail
      beschrieben werden; das Anleitungsvideo hat keine Sprecherstimme, seine Schritte stehen daneben. Wenn Sie auf ein
      Hindernis stoßen, schreiben Sie uns, und wir helfen Ihnen.</p>
  </section>

  <section id="contact" aria-labelledby="t-contact">
    <h2 id="t-contact">Kontakt</h2>
    <p>E-Mail: <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Telefon: +33 6 18 55 81 22 ·
      Post: Hadrien Lonjaret, 35 cours Sablon, 63000 Clermont-Ferrand, Frankreich</p>
  </section>`,
    back: '← Zurück zu den Blumensträußen',
  },

  // ---------- the strings of the scripts (entete.js, boutique.js), with {placeholders}
  js: {
    menu: 'Menü',
    shelves: { bouquets: 'Blumensträuße des Tages', soliflores: 'Solitärvasen', vendus: 'Gesammelte Blumensträuße', cadeaux: 'Meine Geschenke', profil: 'Mein Konto' },
    desktopTitle: 'Auf meinem Desktop',
    desktopLabel: 'Ihr Blumenstrauß auf Ihrem Desktop',
    appTitle: 'Belai Bureau',
    appLabel: 'Belai Bureau herunterladen, die App, die Ihren Strauß auf Ihren Bildschirm stellt',
    soundOn: 'Naturklang einschalten',
    soundOff: 'Naturklang ausschalten',
    openSeaTitle: 'Unsere Sammlung auf OpenSea',
    openSeaLabel: 'Unsere Sammlung auf OpenSea (neuer Tab)',
    about: 'Über uns',
    legal: 'Rechtliches',
    closeLegal: 'Rechtliche Hinweise schließen',
    footer:
      '<p>Jeder Blumenstrauß ist ein digitaler Strauß in limitierter Serie, mit Karte bezahlt, ohne Mehrwertsteuer (nicht anwendbar, Art. 293 B des französischen Steuergesetzbuchs). Er lebt dreißig Tage ab dem Kauf und bleibt dann für immer verblüht. Die Lieferung erfolgt sofort, daher gilt das Widerrufsrecht nach Bestätigung Ihres Kaufs nicht mehr.</p><p>Kein Tracking, keine Werbung: höchstens ein Cookie, um die gewählte Sprache zu speichern.</p>',
    links: { notice: 'Impressum', terms: 'AGB', privacy: 'Datenschutz', app: 'Lizenz von Belai Bureau', accessibility: 'Barrierefreiheit', contact: 'Kontakt' },
    credit: '',
    language: 'Sprache',
    lookCloser: 'Den Blumenstrauß näher ansehen',
    stepBack: 'Zurücktreten',
    planeLabel: '{name}, auf der Säule. {alt}',
    frameLabel: '{name}, etwa {fiat}, {life}. {alt}',
    buyLabel: '„{name}“ kaufen, etwa {fiat}',
    lifeLeft: '{h} Std. {m} Min.',
    fadesIn: 'Verblüht in {t}',
    fadesInLower: 'verblüht in {t}',
    faded: 'Verblüht',
    fadedLower: 'verblüht',
    fadedForGood: 'Für immer verblüht',
    // the month's collection and the copies left, under the bouquet's name ({month}: the month in the page's language)
    series: 'Kollektion {month} · noch {left} von {total}',
    fadeReminder: '(Sträuße verblühen in {n} Tagen)',
    copiesLeft: '{left}/{total} verfügbar',
    fadeShort: 'Verblüht in {n} Tagen',
    collectionEnds: 'Kollektion {month}, endet {when}',
    collectionDone: 'Kollektion {month}, beendet',
    buy: 'Kaufen',
    soon: 'Bald',
    soonMessage: 'Der Kauf direkt auf der Website ist bald möglich.',
    tickFirst: 'Setzen Sie zuerst das Häkchen: Ihr Blumenstrauß wird sofort geliefert.',
    signInFirst: 'Melden Sie sich zuerst an: Ihr Strauß wird Ihrer Nummer zugeordnet.',
    codeSent: 'Code per SMS gesendet: Geben Sie ihn ein und bestätigen Sie.',
    wrongNumber: 'Diese Nummer scheint ungültig zu sein.',
    wrongCode: 'Falscher Code: noch {n} Versuch(e).',
    tooMany: 'Zu viele Versuche: Versuchen Sie es in einigen Minuten erneut.',
    codeExpired: 'Dieser Code ist abgelaufen: Fordern Sie einen neuen an.',
    soldOut: 'Von diesem Strauß ist kein Exemplar mehr verfügbar.',
    payError: 'Die Zahlung konnte nicht abgeschlossen werden. Versuchen Sie es gleich noch einmal.',
    redirecting: 'Weiter zur Zahlungsseite…',
    paid: 'Ihr Strauß gehört Ihnen: Exemplar Nr. {n} von {total}.',
    paymentPending: 'Zahlung wird bestätigt…',
    cancelled: 'Zahlung abgebrochen: Das Exemplar ist wieder im Verkauf.',
    accountSoon: 'Ihr Konto kommt bald: Sie melden sich mit Ihrer Mobilnummer an und finden hier Ihre Sträuße.',
    accountSignIn: 'Anmelden',
    hello: 'Hallo {name}',
    firstNameNeeded: 'Geben Sie Ihren Vornamen an, um Ihr Konto anzulegen.',
    credit: 'Guthaben: {amount}, wird von Ihrem nächsten Kauf abgezogen.',
    exchangeUntil: 'Umtauschen (bis {t})',
    exchangeFor: 'Umtauschen gegen',
    exchangeConfirm: 'Umtausch bestätigen',
    exchangeDiff: 'Die Differenz von {amount} geht auf Ihr Guthaben.',
    exchangeSame: 'Gleicher Preis: nichts geht auf Ihr Guthaben.',
    exchangeNone: 'Kein Strauß des Tages ist zu diesem Preis oder günstiger verfügbar.',
    exchangeDone: 'Umgetauscht: Ihr neuer Strauß lebt dreißig Tage.',
    exchangeRefused: 'Dieser Umtausch ist nicht möglich.',
    copyNo: 'Exemplar Nr. {n}',
    noBouquet: 'Noch kein Strauß in Ihrem Konto.',
    giftsSoon: 'Geschenke kommen bald: Hier öffnen Sie den Strauß, den man Ihnen schenkt.',
    giftOpened: 'Ihr Geschenk ist angekommen.',
    giftWrong: 'Dieser Vorname und dieser Code passen zu keinem Geschenk.',
    receipt: {
      title: 'Beleg',
      download: 'Beleg herunterladen',
      bouquet: 'Blumenstrauß',
      price: 'Preis',
      date: 'Datum',
      seller: 'Verkäufer',
      waiver: 'Vor der Zahlung haben Sie die sofortige Lieferung verlangt und zur Kenntnis genommen, dass Sie dadurch Ihr Widerrufsrecht verlieren (französisches Verbrauchergesetzbuch, Art. L221-28 Nr. 13).',
      terms: 'An diesem Tag akzeptierte AGB: {url}',
      taxes: 'Gemäß Art. 293 B des französischen Steuergesetzbuchs (CGI) wird keine Umsatzsteuer berechnet.',
      copy: 'Exemplar',
      copyOf: 'Nr. {n} von {total}, {month}',
      order: 'Bestellung',
      payment: 'Zahlung',
    },
  },

  // ---------- the names the bouquet descriptions use (vases in the dative, after "in")
  vases: {
    'bronze-carpe': 'einer Karpfenvase aus Bronzeguss',
    'verre-danseuses': 'einer Milchglasvase mit Tänzerinnen',
    'coupe-cobalt-mouchetee': 'einer gesprenkelten Kobaltschale',
    'coupe-pied-blanche-mate': 'einer mattweißen Fußschale',
    'cylindre-inox-miroir': 'einem Zylinder aus spiegelndem Edelstahl',
    'bulbe-pied-sable': 'einer sandfarbenen Kugelvase mit Fuß',
    'calice-mouchete': 'einer gesprenkelten Kelchvase',
    'prisme-jaune': 'einem geschliffenen Citringlas-Prisma mit schwebendem Herz',
    'jardiniere-cristaux': 'einer Jugendstil-Jardinière mit Kristallglasur',
    'prismes-bronze': 'einer Vase aus grünspanigen Bronzeprismen',
    'colonne-art-nouveau': 'einer Jugendstil-Säule aus Steinzeug',
    'bouteille-dragon': 'einer nachtblauen Flasche mit türkisem Drachen',
    'jarre-carpes': 'einem Terrakotta-Krug mit Karpfen im Relief',
    'bronze-lys': 'einer patinierten Bronzevase mit Lilien',
    'gres-chauve-souris': 'einer Steinzeugvase mit glasierter Fledermaus',
    'balustre-perce-neige': 'einer Balustervase mit Schneeglöckchen',
  },
  flowers: {
    'cerisier-du-japon-sato-zakura': 'Japanische Zierkirsche',
    'cognassier-du-japon': 'Japanische Zierquitte',
    forsythia: 'Forsythie',
    'iris-hollandais': 'Holländische Iris',
    lilas: 'Flieder',
    'tulipe-perroquet': 'Papageientulpe',
    'tulipe-double': 'gefüllte Tulpe',
    'tulipe-simple': 'Tulpe',
    'tulipe-frangee': 'gefranste Tulpe',
    'renoncule-classique': 'Ranunkel',
    'narcisse-trompette': 'Trompeten-Narzisse',
    'narcisse-bouquet': 'Tazette',
    jacinthe: 'Hyazinthe',
    'anemone-coronaria': 'Anemone',
    'anemone-sauvage': 'Buschwindröschen',
    freesia: 'Freesie',
    'pois-de-senteur': 'Duftwicke',
    muscari: 'Traubenhyazinthe',
    'fritillaire-meleagris': 'Schachbrettblume',
    glycine: 'Blauregen',
    'viburnum-roseum': 'Schneeball',
    alchemille: 'Frauenmantel',
    'anthurium-obake': 'Obake-Anthurie',
    'saule-a-chatons': 'Kätzchenweide',
    'liriope-lily-grass': 'Lilientraube',
    'cymbidium-grandes-fleurs': 'Cymbidium-Orchidee',
    'rose-de-jardin': 'Gartenrose',
    sanguisorbe: 'Wiesenknopf',
    phalaenopsis: 'Phalaenopsis-Orchidee',
    'arum-calla': 'Calla',
    'hortensia-boule': 'Hortensie',
    'giroflee-matthiole': 'Levkoje',
    'oeillet-de-poete-dianthus': 'Bartnelke',
    'anthurium-cristal': 'Kristall-Anthurie',
    'jasminum-liane-jasmin': 'Jasmin',
    'cyclamen-fleur-coupee': 'Alpenveilchen',
    'ruscus-seche-teint': 'gefärbter Mäusedorn',
    lisianthus: 'Lisianthus',
    germini: 'Germini (Mini-Gerbera)',
    'reine-marguerite': 'Sommeraster',
    bromeliacees: 'Bromelie',
    'rose-standard': 'Rose',
    'rose-aspect-jardin': 'Rose im Gartenstil',
    gerbera: 'Gerbera',
    'dahlia-decoratif': 'Dahlie',
    'chrysantheme-disbud': 'großblumige Chrysantheme',
    'anthurium-andraeanum': 'Anthurie',
    'amarante-retombante': 'Garten-Fuchsschwanz',
    nerine: 'Nerine',
    'oeillet-standard': 'Nelke',
    delphinium: 'Rittersporn',
    gloriosa: 'Ruhmeskrone',
    scabieuse: 'Skabiose',
  },
};
