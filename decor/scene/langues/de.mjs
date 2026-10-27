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
    `Ein einzigartiger digitaler Blumenstrauß aus ${stems} handgezeichneten Stielen (${flowers}) in ${vase}. Er lebt drei Monate und bleibt danach für immer verblüht.`,

  pages: {
    index: {
      title: "Digitaler Blumenstrauß, von Hand gezeichnet | Belai's Garden",
      description: 'Digitale Blumensträuße, Stiel für Stiel nach echten Blumen gezeichnet. Einzigartig, jeden Tag neu, zum Sammeln auf Base und für Ihren Desktop.',
      ogTitle: 'Digitale Blumensträuße, Stiel für Stiel gezeichnet',
      ogDescription: 'Jeden Tag neue, einzigartige Blumensträuße, jeder in einer echten Vase. Sehen Sie sie erblühen, sammeln Sie einen, stellen Sie ihn auf Ihren Desktop.',
    },
    about: {
      title: "So entstehen unsere digitalen Blumensträuße | Belai's Garden",
      description: 'Digitale Blumensträuße: in Code nach echten Fotos gezeichnet, in echten Vasen, zum Preis der echten Stiele, mit drei Monaten Leben.',
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
  orgDescription: 'Digitale Blumensträuße, Stiel für Stiel nach echten Blumen gezeichnet, gesammelt auf Base.',
  listName: 'Blumensträuße des Tages',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden: lebendige digitale Blumensträuße",
    intro:
      'Digitale Blumensträuße, Stiel für Stiel nach echten Blumen gezeichnet. Jeden Tag neue, einzigartige Blumensträuße, jeder in einer echten Vase, gesammelt auf Base. Ein Blumenstrauß lebt drei Monate und bleibt danach für immer verblüht. Stellen Sie Ihren auf den Desktop Ihres Computers – mit Belai Bureau, einem kostenlosen Widget für Windows.',
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
  },

  // ---------- the About page
  about: {
    h1: 'Über uns',
    lead: 'Blumensträuße, Blume für Blume gezeichnet, die vor Ihren Augen erblühen.',
    body: `<h2>Nach dem Leben gezeichnete Blumen</h2>
  <p>Jede Blume in diesem Garten ist in Code gezeichnet, Linie für Linie, nach echten Fotos: die Form der Blütenblätter,
    ihre an jeder Sorte gemessenen Farben, die Knospen, die offene Blüte und die verblühte. Mehr als fünfhundert Arten
    sind bereits im Garten.</p>

  <h2>Jeden Tag einzigartige Blumensträuße</h2>
  <p>Jeden Tag werden neue Blumensträuße komponiert, jeder in einer echten Vase, wie der Bronzekarpfen. Jeder
    Blumenstrauß ist ein Unikat: Die Lage jedes Stiels, jeder Blüte und jedes Blattes findet sich in keinem anderen.</p>

  <h2>Ein lebendiger Blumenstrauß</h2>
  <p>Ein Blumenstrauß lebt ab seiner Prägung drei Monate: Ein Countdown in Stunden und Minuten zeigt, wie viel Zeit ihm
    bleibt. Danach bleibt er verblüht und unbewegt, für immer.</p>

  <h2>Der Preis echter Stiele</h2>
  <p>Der Preis eines Blumenstraußes ist die Summe dessen, was seine Stiele bei einem Floristen in Frankreich kosten. Die
    Vase gibt es gratis dazu. Beim Weiterverkauf nehmen wir nichts: 0 % Lizenzgebühren.</p>

  <h2>Einen Blumenstrauß sammeln</h2>
  <p>Die Blumensträuße sind NFTs im Base-Netzwerk, angeboten auf unserer OpenSea-Seite. Sie bezahlen sie direkt hier,
    aus Ihrer Wallet, ohne die Website zu verlassen.</p>

  <h2>Auf Ihrem Desktop</h2>
  <p>Mit <a href="{{p}}desktop.html">Belai Bureau</a>, einem kostenlosen Widget für Windows, steht der Blumenstrauß, den
    Sie gesammelt haben, auf dem Desktop Ihres Computers – in der Größe Ihrer Wahl, vor oder hinter Ihren Fenstern.</p>

  <h2>Den Garten wachsen lassen</h2>
  <p>Jeder gesammelte Blumenstrauß lässt den Garten wachsen: neue Arten, neue Vasen, neue Blumensträuße.</p>`,
    faqTitle: 'Fragen',
    faq: [
      ['Was ist ein digitaler Blumenstrauß?', 'Ein Strauß aus Blumen, die in Vektorgrafik nach echten Fotos gezeichnet sind, Stiel für Stiel, in einer echten Vase. Er erblüht auf dem Bildschirm, wiegt sich im Wind und verblüht nach drei Monaten. Jeder ist ein Unikat und wird als NFT auf Base gesammelt.'],
      ['Kann ich einen Blumenstrauß auf den Desktop meines Computers stellen?', 'Ja. Laden Sie Belai Bureau herunter (kostenlos, Windows 10 und 11), verknüpfen Sie Ihre Wallet, und der Blumenstrauß, der Ihnen gehört, steht als Widget auf Ihrem Desktop: Sie platzieren ihn, wählen seine Größe, fixieren ihn und stellen ihn vor oder hinter Ihre Fenster.'],
      ['Wie wird der Preis eines Blumenstraußes festgelegt?', 'Nach der Summe dessen, was seine Stiele bei einem Floristen in Frankreich kosten würden, umgerechnet in ETH, ohne Umsatzsteuer (gemäß Art. 293 B des französischen Steuergesetzbuchs nicht umsatzsteuerpflichtig). Die Vase gibt es gratis dazu. Der in Euro oder US-Dollar angezeigte Betrag ist ein Richtwert zum aktuellen Kurs.'],
      ['Was passiert nach drei Monaten?', 'Der Blumenstrauß verblüht und bleibt verblüht und unbewegt, für immer. Er gehört weiterhin Ihnen.'],
      ['Erheben Sie Lizenzgebühren beim Weiterverkauf?', 'Nein: 0 %. Es fallen nur die eigenen Gebühren des Marktplatzes und des Netzwerks an.'],
      ['Wer kann einen Blumenstrauß anzeigen?', 'Belai Bureau zeigt nur einen Blumenstrauß an, den die verknüpfte Wallet hält, nach einer kostenlosen Signatur (keine Transaktion).'],
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
    updated: 'Zuletzt aktualisiert: 16. Oktober 2026',
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
    <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, Vereinigte Staaten · +1 650 319 8930 ·
      cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Allgemeine Geschäftsbedingungen</h2>

    <h3>1. Anbieter und Kunden</h3>
    <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für jeden Blumenstrauß, den der im Impressum genannte Anbieter
      („wir“) auf dieser Website an eine volljährige Person („Sie“) verkauft. Mit der Bezahlung eines Blumenstraußes
      akzeptieren Sie diese AGB in der am Tag des Kaufs geltenden Fassung. Sie liegen in mehreren Sprachen vor; maßgeblich
      ist die französische Fassung.</p>

    <h3>2. Was ein Blumenstrauß ist</h3>
    <p>Ein Blumenstrauß ist ein einzigartiges digitales Kunstwerk: in Vektorgrafik gezeichnete Blumen in einer Vase,
      erfasst als nicht austauschbares Token (NFT) im Base-Netzwerk. Die Seite jedes Blumenstraußes zeigt vor dem Kauf
      seinen Namen, seine Vase, die Anzahl seiner Stiele und seinen Preis.</p>
    <p>Ein Blumenstrauß lebt ab seiner Prägung drei Monate: Er blüht und wiegt sich, und ein Countdown zeigt die
      verbleibende Zeit. Danach verblüht er und bleibt für immer verblüht und unbewegt. Dies ist Teil des Kunstwerks und
      kein Mangel.</p>
    <p>Ein Blumenstrauß ist ein Sammlerstück. Er begründet keinerlei Anspruch auf Einkünfte oder Beteiligungen.</p>

    <h3>3. Der Blumenstrauß gehört Ihnen</h3>
    <p>Als Inhaber des Tokens sind Sie Eigentümer des Blumenstraußes: Sie dürfen ihn zeigen, wo Sie möchten, behalten,
      verschenken oder weiterverkaufen, ohne weitere Formalitäten. Wie beim Kauf eines Gemäldes werden dabei keine
      Urheber- oder Verwertungsrechte an der Zeichnung übertragen: Die Herstellung und der Verkauf von Kopien oder
      Merchandising-Artikeln sind nicht inbegriffen.</p>

    <h3>4. Preis</h3>
    <p>Der Preis wird in ETH ohne Umsatzsteuer (gemäß Art. 293 B des französischen Steuergesetzbuchs nicht umsatzsteuerpflichtig) festgelegt und vor dem Kauf beim Blumenstrauß angezeigt. Der daneben
      in Euro oder US-Dollar angezeigte Betrag ist derselbe Preis zum aktuellen Kurs, abgerufen bei CoinGecko; Sie zahlen
      den Preis in ETH. Die Gebühren des Base-Netzwerks („Gas“) werden von Ihrer Wallet hinzugefügt und an das Netzwerk
      gezahlt, nicht an uns.</p>

    <h3>5. Bestellung und Zahlung</h3>
    <p>Sie zahlen aus Ihrer eigenen Wallet auf dieser Website über Seaport, das Protokoll des Marktplatzes OpenSea, auf
      dem unsere Blumensträuße angeboten werden. Vor der Zahlung setzen Sie ein Häkchen, um die sofortige Lieferung zu
      verlangen (siehe Artikel 7), und bestätigen dann; Ihre Wallet zeigt anschließend den genauen Betrag an, und mit der
      Bestätigung in Ihrer Wallet geben Sie eine zahlungspflichtige Bestellung auf. Eine im Netzwerk bestätigte
      Transaktion kann nicht rückgängig gemacht werden.</p>
    <p>Sie sind für Ihre Wallet, deren Schlüssel und die Adresse, mit der Sie kaufen, selbst verantwortlich. Wir
      verwahren niemals Ihre Schlüssel oder Ihre Gelder.</p>

    <h3>6. Lieferung und Beleg</h3>
    <p>Der Blumenstrauß wird in derselben Transaktion auf Ihre Wallet übertragen, sobald das Netzwerk sie bestätigt. Die
      Website stellt Ihnen anschließend einen Beleg zum Herunterladen bereit, der den Kauf, seinen Preis, die Transaktion
      und Ihr Verlangen nach sofortiger Lieferung bestätigt. Auch der Eintrag der Transaktion im Base-Netzwerk dient als
      Nachweis des Kaufs.</p>

    <h3>7. Widerrufsrecht</h3>
    <p>Wenn Sie Verbraucher in der Europäischen Union sind, steht Ihnen bei einem Fernabsatzvertrag grundsätzlich ein
      Widerrufsrecht von 14 Tagen zu. Ein Blumenstrauß ist ein digitaler Inhalt, der nicht auf einem körperlichen
      Datenträger geliefert und sofort bereitgestellt wird: Vor der Zahlung verlangen Sie ausdrücklich seine sofortige
      Lieferung und bestätigen Ihre Kenntnis davon, dass Sie dadurch Ihr Widerrufsrecht verlieren (französisches
      Verbrauchergesetzbuch – Code de la consommation –, Art. L221-28 Nr. 13; Richtlinie 2011/83/EU, Art. 16
      Buchst. m).</p>

    <h3>8. Gesetzliche Gewährleistung</h3>
    <p>Wenn Sie Verbraucher sind, gilt für digitale Inhalte die gesetzliche Gewährleistung der Vertragsmäßigkeit
      (französisches Verbrauchergesetzbuch, Art. L224-25-1 ff.): Entspricht der erhaltene Blumenstrauß nicht seiner
      Beschreibung, schreiben Sie uns, und wir stellen den vertragsgemäßen Zustand her oder erstatten Ihnen andernfalls
      den Preis.</p>

    <h3>9. Weiterverkauf</h3>
    <p>Bei einem Weiterverkauf erheben wir keine Lizenzgebühr (0 %). Es fallen nur die eigenen Gebühren des
      Marktplatzes und des Netzwerks an. Die Preise von Blumensträußen beim Weiterverkauf legen ihre Inhaber frei fest;
      wir geben dazu keinerlei Zusagen.</p>

    <h3>10. Haftung</h3>
    <p>Das Base-Netzwerk, die Wallets und der Marktplatz OpenSea werden von Dritten betrieben. Wir haften weder für deren
      Ausfälle, Gebühren oder Änderungen noch für einen Verlust infolge eines verlorenen Schlüssels oder einer falschen
      Adresse. Diese AGB schränken die gesetzlichen Rechte von Verbrauchern in keiner Weise ein.</p>

    <h3>11. Beschwerden und Schlichtung</h3>
    <p>Schreiben Sie uns zuerst (siehe <a href="{{legal}}#contact">Kontakt</a>); wir antworten innerhalb von 30 Tagen.
      Wird keine Lösung gefunden, können Verbraucher die Streitigkeit kostenlos unserer Verbraucherschlichtungsstelle
      vorlegen: <span class="a-remplir">[Name, Website und Postanschrift der Schlichtungsstelle]</span>.</p>

    <h3>12. Anwendbares Recht</h3>
    <p>Diese AGB unterliegen französischem Recht. Verbraucher behalten den Schutz der zwingenden Bestimmungen des Staates,
      in dem sie ihren gewöhnlichen Aufenthalt haben, und können eine Streitigkeit vor die Gerichte dieses Staates oder
      Frankreichs bringen.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Datenschutzerklärung</h2>
    <p>Verantwortlicher ist der im <a href="{{legal}}#notice">Impressum</a> genannte Anbieter. Wir erheben so wenige
      Daten wie möglich und keine, um ein Profil von Ihnen zu erstellen.</p>
    <h3>Was verarbeitet wird, wozu und auf welcher Rechtsgrundlage</h3>
    <ul>
      <li><strong>Verbindungsdaten</strong> (IP-Adresse, Browser, aufgerufene Seiten): von unserem Hoster Cloudflare in
        seinen technischen Protokollen gespeichert, um die Website bereitzustellen und vor Missbrauch zu schützen.
        Rechtsgrundlage: unser berechtigtes Interesse an einer funktionierenden, sicheren Website.</li>
      <li><strong>Ihr Land</strong>, bei jedem Besuch von Cloudflare aus Ihrer IP-Adresse abgeleitet, um die Website in
        Ihrer Sprache und den Preis in Ihrer Währung anzuzeigen. Es wird sofort verwendet und nie gespeichert.
        Rechtsgrundlage: unser berechtigtes Interesse an einer für Sie lesbaren Website.</li>
      <li><strong>Der ETH-Kurs:</strong> Um den Betrag in Ihrer Währung anzuzeigen, fragt Ihr Browser den aktuellen Kurs
        bei CoinGecko (api.coingecko.com) ab; CoinGecko sieht dabei Ihre IP-Adresse. Rechtsgrundlage: unser berechtigtes
        Interesse an der Anzeige eines aktuellen Betrags.</li>
      <li><strong>Ihre Wallet-Adresse</strong>, wenn Sie kaufen oder eine Wallet verknüpfen: gelesen, um den Kauf
        durchzuführen oder Ihre Blumensträuße anzuzeigen. Rechtsgrundlage: der Vertrag. Transaktionen im Base-Netzwerk
        sind öffentlich und dauerhaft: Weder wir noch sonst jemand kann sie löschen.</li>
    </ul>
    <h3>Cookies</h3>
    <p>Wenn Sie selbst eine Sprache wählen, merkt sich die Website diese ein Jahr lang in einem einzigen Cookie namens
      <code>lang</code>. Das ist alles: kein anderes Cookie, keine Reichweitenmessung, keine Werbung. Dieses Cookie
      speichert nur Ihre Wahl und erfordert daher kein Einwilligungsbanner.</p>
    <h3>Empfänger und Ort der Verarbeitung</h3>
    <p>Cloudflare, Inc. (Hosting, Vereinigte Staaten) und CoinGecko (Kurs, Singapur). Übermittlungen außerhalb der
      Europäischen Union stützen sich bei Cloudflare auf das EU-US Data Privacy Framework und im Übrigen auf die
      Standardvertragsklauseln der Europäischen Kommission.</p>
    <h3>Speicherdauer</h3>
    <p>Technische Protokolle von Cloudflare: nach den Vorgaben von Cloudflare, einige Tage bis einige Wochen. E-Mails,
      die Sie uns senden: so lange, wie es für die Antwort nötig ist, danach drei Jahre. Andere Daten speichern wir
      nicht.</p>
    <h3>Ihre Rechte</h3>
    <p>Sie können Auskunft über Ihre Daten, deren Berichtigung oder Löschung sowie die Einschränkung ihrer Verarbeitung
      verlangen, der Verarbeitung widersprechen und Ihre Daten in einem übertragbaren Format erhalten, indem Sie uns
      schreiben (siehe <a href="{{legal}}#contact">Kontakt</a>). Sie können sich außerdem bei der französischen
      Datenschutzaufsichtsbehörde CNIL (cnil.fr) beschweren.</p>
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
    <p>Die Blumen, Vasen, Blumensträuße, die Kulisse, die Texte, das Video und der Code dieser Website und von Belai
      Bureau sind Originalwerke. Jede Vervielfältigung ohne Genehmigung ist untersagt, soweit sie nicht in den
      <a href="{{legal}}#terms">Allgemeinen Geschäftsbedingungen</a> erlaubt ist. OpenSea, Base und CoinGecko sind
      Namen ihrer jeweiligen Inhaber. Der ETH-Kurs wird bereitgestellt von
      <a href="https://www.coingecko.com/" target="_blank" rel="noopener">CoinGecko</a>.</p>
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
    shelves: { bouquets: 'Blumensträuße des Tages', soliflores: 'Solitärvasen', vendus: 'Gesammelte Blumensträuße' },
    desktopTitle: 'Auf meinem Desktop',
    desktopLabel: 'Ihr Blumenstrauß auf Ihrem Desktop',
    openSeaTitle: 'Unsere Sammlung auf OpenSea',
    openSeaLabel: 'Unsere Sammlung auf OpenSea (neuer Tab)',
    about: 'Über uns',
    legal: 'Rechtliches',
    closeLegal: 'Rechtliche Hinweise schließen',
    footer:
      '<p>Jeder Blumenstrauß ist ein einzigartiges digitales Sammlerstück (ein NFT auf Base) mit einem Preis in ETH, ohne Umsatzsteuer (gemäß Art. 293 B des französischen Steuergesetzbuchs nicht umsatzsteuerpflichtig); der Betrag in Euro oder US-Dollar ist derselbe Preis zum aktuellen Kurs. Er lebt ab seiner Prägung drei Monate und bleibt danach für immer verblüht. Die Lieferung erfolgt sofort, daher besteht nach Ihrer Bestätigung kein Widerrufsrecht. Beim Weiterverkauf erheben wir keine Lizenzgebühr (0 %).</p><p>Kein Tracking, keine Werbung: höchstens ein Cookie, um sich die von Ihnen gewählte Sprache zu merken.</p>',
    links: { notice: 'Impressum', terms: 'AGB', privacy: 'Datenschutz', app: 'Lizenz von Belai Bureau', accessibility: 'Barrierefreiheit', contact: 'Kontakt' },
    credit: 'ETH-Kurs von {coingecko}.',
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
    buy: 'Kaufen',
    soon: 'Bald',
    soonMessage: 'Der Kauf direkt auf der Website ist bald möglich.',
    tickFirst: 'Setzen Sie zuerst das Häkchen: Ihr Blumenstrauß wird sofort geliefert.',
    receipt: {
      title: 'Beleg',
      download: 'Beleg herunterladen',
      bouquet: 'Blumenstrauß',
      token: 'Token',
      price: 'Preis',
      date: 'Datum',
      buyer: 'Wallet des Käufers',
      transaction: 'Transaktion',
      seller: 'Verkäufer',
      waiver: 'Vor der Zahlung haben Sie die sofortige Lieferung verlangt und zur Kenntnis genommen, dass Sie dadurch Ihr Widerrufsrecht verlieren (französisches Verbrauchergesetzbuch, Art. L221-28 Nr. 13).',
      terms: 'An diesem Tag akzeptierte AGB: {url}',
      taxes: 'Gemäß Art. 293 B des französischen Steuergesetzbuchs (CGI) wird keine Umsatzsteuer berechnet.',
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
