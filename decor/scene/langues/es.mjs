// The site's words in Spanish: the source of the other languages (fr, es, zh, de have the same keys). build.mjs writes
// the pages from gabarits/ with them; the runtime strings (js) go into each page as a JSON block read by entete.js and
// boutique.js. In the HTML strings: {{p}} is the page's language prefix ('' or 'fr/'...), {{legal}} the legal page with
// that prefix; in the runtime strings, {name} and the like are filled in by the scripts. Product names stay as they are.
export default {
  code: 'es',
  name: 'Español',
  locale: 'es-ES',
  ogLocale: 'es_ES',
  // a list of words as the language writes it: "a, b y c" ("e" before a word that starts with the sound i: "lila e iris")
  list: (a) => {
    if (a.length < 2) return a.join('');
    const last = a[a.length - 1];
    const and = /^h?[ií](?![aeoáéó])/i.test(last) ? 'e' : 'y';
    return `${a.slice(0, -1).join(', ')} ${and} ${last}`;
  },
  more: 'más',
  describe: ({ stems, flowers, vase }) =>
    `Un ramo digital único de ${stems} tallos dibujados a mano (${flowers}) en ${vase}. Vive tres meses y luego queda marchito para siempre.`,

  pages: {
    index: {
      title: "Ramo de flores digital, dibujado tallo a tallo | Belai's Garden",
      description: 'Ramos de flores digitales dibujados tallo a tallo a partir de flores reales. Únicos, nuevos cada día, para coleccionar en Base y poner en tu escritorio.',
      ogTitle: 'Ramos de flores digitales, dibujados tallo a tallo',
      ogDescription: 'Nuevos ramos únicos cada día, cada uno en un jarrón real. Míralos florecer, colecciona uno y ponlo en tu escritorio.',
    },
    about: {
      title: "Acerca de: ramos digitales de flores reales | Belai's Garden",
      description: 'Cómo se hacen nuestros ramos digitales: flores dibujadas en código a partir de fotos reales, jarrones reales, al precio de sus tallos, tres meses de vida.',
      ogTitle: 'Acerca de nuestros ramos digitales',
      ogDescription: 'Cada flor, dibujada en código a partir de fotos reales. Ramos únicos, en jarrones reales, que florecen y luego se marchitan.',
    },
    desktop: {
      title: 'Widget de escritorio para Windows: ramo de flores | Belai Bureau',
      description: 'Belai Bureau, un widget gratis para Windows 10 y 11: pon en tu escritorio el ramo de flores digital que coleccionaste. Colócalo, ajústalo y fíjalo.',
      ogTitle: 'Tu ramo de flores en tu escritorio',
      ogDescription: 'Un widget gratuito para Windows para tu ramo digital: colócalo, ajusta su tamaño y fíjalo.',
    },
    legal: {
      title: "Aviso legal, condiciones de venta y privacidad | Belai's Garden",
      description: "Aviso legal, condiciones de venta de los ramos digitales, política de privacidad, licencia de Belai Bureau y accesibilidad de Belai's Garden.",
      ogTitle: 'Aviso legal, condiciones de venta y privacidad',
      ogDescription: 'Quiénes somos, cómo se vende un ramo y qué hacemos con los datos.',
    },
  },
  shareAlt: 'El ramo Ronde bleue: lilas, iris, anémonas y jacintos en un jarrón de vidrio esmerilado con bailarinas',
  orgDescription: 'Ramos de flores digitales dibujados tallo a tallo a partir de flores reales, coleccionados en Base.',
  listName: 'Ramos del día',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden: ramos de flores digitales que viven",
    intro:
      'Ramos de flores digitales dibujados tallo a tallo a partir de flores reales. Nuevos ramos únicos cada día, cada uno en un jarrón real, para coleccionar en Base. Un ramo vive tres meses y luego queda marchito para siempre. Ponlo en el escritorio de tu ordenador con Belai Bureau, un widget gratuito para Windows.',
    noscript:
      'Este jardín necesita JavaScript para que los ramos florezcan. Lee <a href="{{p}}about.html">más sobre los ramos</a>, descubre <a href="{{p}}desktop.html">cómo poner uno en tu escritorio</a> o consulta el <a href="{{legal}}">aviso legal y las condiciones</a>.',
    galleryLabel: 'Ramos del día',
    lookCloser: 'Ver el ramo más de cerca',
    shelvesLabel: 'Estantes',
    budVases: 'Muy pronto, los floreros solitarios: una sola flor en su jarrón.',
    noneCollected: 'Ningún ramo ha encontrado todavía a su coleccionista.',
    seeOpenSea: 'Ver la colección en OpenSea',
    onDesktop: 'En tu escritorio',
    buy: 'Comprar',
    demoTitle: 'Tu ramo en tu escritorio',
    closeVideo: 'Cerrar el vídeo',
    videoMissing: 'El vídeo está en camino: mostrará cómo poner tu ramo en el escritorio de tu ordenador.',
    // the purchase sheet: the express waiver of the right of withdrawal (French Consumer Code L221-28, 13°)
    sheetTitle: 'Antes de pagar',
    waiver: 'Pido que mi ramo se entregue de inmediato y entiendo que, por ello, pierdo mi derecho de desistimiento de 14 días.',
    accept: 'Al pagar, confirmas que eres mayor de edad y aceptas las <a href="{{legal}}#terms">condiciones de venta</a>.',
    confirm: 'Confirmar y pagar',
    cancel: 'Cancelar',
  },

  // ---------- the About page
  about: {
    h1: 'Acerca de',
    lead: 'Ramos dibujados flor a flor, que florecen ante tus ojos.',
    body: `<h2>Flores dibujadas del natural</h2>
  <p>Cada flor de este jardín está dibujada en código, trazo a trazo, a partir de fotos reales: la forma de los pétalos,
    sus colores medidos en cada variedad, los capullos, la flor abierta y la flor marchita. En el jardín ya hay más de
    quinientas especies.</p>

  <h2>Ramos únicos cada día</h2>
  <p>Cada día se componen ramos nuevos, cada uno en un jarrón real, como la carpa de bronce. Cada ramo es único:
    la posición de cada tallo, de cada flor y de cada hoja no se repite en ningún otro.</p>

  <h2>Un ramo que vive</h2>
  <p>Un ramo vive tres meses desde su acuñación: una cuenta atrás, en horas y minutos, muestra cuánto tiempo le queda.
    Después queda marchito e inmóvil, para siempre.</p>

  <h2>El precio de los tallos reales</h2>
  <p>El precio de un ramo es la suma de lo que cuestan sus tallos en una floristería de Francia. El jarrón es gratis.
    En la reventa, no nos quedamos con nada: 0 % de regalías.</p>

  <h2>Coleccionar un ramo</h2>
  <p>Los ramos son NFT en la red Base, publicados en nuestra página de OpenSea. Los pagarás aquí mismo, desde tu
    monedero, sin salir del sitio.</p>

  <h2>En tu escritorio</h2>
  <p>Con <a href="{{p}}desktop.html">Belai Bureau</a>, un widget gratuito para Windows, el ramo que coleccionaste se queda
    en el escritorio de tu ordenador, del tamaño que elijas, delante o detrás de tus ventanas.</p>

  <h2>Hacer crecer el jardín</h2>
  <p>Cada ramo coleccionado ayuda a que el jardín crezca: nuevas especies, nuevos jarrones, nuevos ramos.</p>`,
    faqTitle: 'Preguntas',
    faq: [
      ['¿Qué es un ramo digital?', 'Un ramo de flores dibujado en gráficos vectoriales a partir de fotos reales, tallo a tallo, en un jarrón real. Florece en la pantalla, se mece con la brisa y se marchita al cabo de tres meses. Cada uno es único y se colecciona como NFT en Base.'],
      ['¿Puedo poner un ramo de flores en el escritorio de mi ordenador?', 'Sí. Descarga Belai Bureau (gratis, Windows 10 y 11), vincula tu monedero y el ramo que tienes se queda en tu escritorio como widget: lo colocas, ajustas su tamaño, lo fijas y lo pones delante o detrás de tus ventanas.'],
      ['¿Cómo se fija el precio de un ramo?', 'Es la suma de lo que costarían sus tallos en una floristería de Francia, convertida a ETH, sin IVA (IVA no aplicable, art. 293 B del Código General de Impuestos francés). El jarrón es gratis. El importe mostrado en euros o dólares estadounidenses es orientativo, al cambio actual.'],
      ['¿Qué pasa al cabo de tres meses?', 'El ramo se marchita y queda marchito e inmóvil para siempre. Sigue siendo tuyo.'],
      ['¿Cobráis regalías en la reventa?', 'No: 0 %. Solo se aplican las comisiones propias del mercado y de la red.'],
      ['¿Quién puede mostrar un ramo?', 'Belai Bureau solo muestra un ramo que esté en el monedero que vinculas, tras una firma gratuita (sin transacción).'],
    ],
    back: '← Volver a los ramos',
  },

  // ---------- the desktop page
  desktop: {
    h1: 'Tu ramo en tu escritorio',
    lead: 'Pon el ramo que coleccionaste en el escritorio de tu ordenador con Belai Bureau, un widget gratuito para Windows.',
    videoLabel: 'Vídeo tutorial: cómo poner tu ramo en el escritorio, paso a paso (solo música; los pasos están escritos al lado)',
    stepsTitle: 'En cinco pasos',
    steps: [
      'Descarga e instala Belai Bureau.',
      'Vincula tu monedero desde el icono de Belai, junto al reloj.',
      'Elige tu ramo y ponlo en la pantalla: una sola firma, gratuita, sin transacción.',
      'Colócalo, ajusta su tamaño, ponlo delante o detrás de tus ventanas y fíjalo con ✓.',
      'Para volver a moverlo, mantén pulsado el clic sobre el ramo durante seis segundos.',
    ],
    download: 'Descargar Belai Bureau',
    downloadSmall: 'Windows 10 y 11 · 3 MB · gratis',
    note: 'Solo el monedero que tiene un ramo puede mostrarlo. La primera vez que la abras, Windows puede avisarte de que aún no conoce la aplicación: «Más información» y después «Ejecutar de todas formas».',
    appLanguage: 'Por ahora, la aplicación está en francés.',
    fingerprint: 'Versión {v} · SHA-256',
    licence: 'Licencia y privacidad',
    back: '← Volver a los ramos',
    appDescription: 'Un widget de escritorio gratuito para Windows que muestra en tu escritorio el ramo de flores digital que coleccionaste: colócalo, ajusta su tamaño y fíjalo, delante o detrás de tus ventanas.',
    videoName: 'Cómo poner tu ramo en tu escritorio',
    videoDescription: 'Un tutorial de un minuto: descarga Belai Bureau, vincula tu monedero, pon tu ramo en pantalla, colócalo, ajusta su tamaño y fíjalo; mantén pulsado seis segundos para volver a moverlo.',
    howToName: 'Cómo poner un ramo de flores digital en tu escritorio de Windows',
    howToTools: ['Belai Bureau (gratis, Windows 10 y 11)', 'Un monedero que tenga un ramo'],
  },

  // ---------- the legal page
  legal: {
    h1: 'Legal',
    updated: 'Última actualización: 16 de octubre de 2026',
    onThisPage: 'En esta página',
    toc: { notice: 'Aviso legal', terms: 'Condiciones de venta', privacy: 'Política de privacidad', app: 'Licencia de Belai Bureau', ip: 'Propiedad intelectual', accessibility: 'Accesibilidad', contact: 'Contacto' },
    reference: '',
    body: `<section id="notice" aria-labelledby="t-notice">
    <h2 id="t-notice">Aviso legal</h2>
    <h3>Editor</h3>
    <p>Hadrien Lonjaret, entrepreneur individuel (empresario individual conforme al derecho francés), con el nombre
      comercial Agent 33<br>
      35 cours Sablon, 63000 Clermont-Ferrand, Francia<br>
      Correo electrónico: <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Teléfono: +33 6 18 55 81 22<br>
      SIREN 853 801 488 · RCS Clermont-Ferrand · Número de IVA FR69853801488</p>
    <h3>Director de la publicación</h3>
    <p>Hadrien Lonjaret</p>
    <h3>Alojamiento</h3>
    <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, Estados Unidos · +1 650 319 8930 ·
      cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Condiciones de venta</h2>

    <h3>1. Quién vende y a quién</h3>
    <p>Las presentes condiciones se aplican a todo ramo vendido en este sitio por el editor identificado en el aviso
      legal («nosotros») a cualquier persona mayor de edad («tú»). Pagar un ramo supone aceptar estas condiciones en la
      redacción vigente el día de la compra. Existen en varios idiomas; en caso de discrepancia, prevalece la versión
      francesa.</p>

    <h3>2. Qué es un ramo</h3>
    <p>Un ramo es una obra de arte digital única: flores dibujadas en gráficos vectoriales, en un jarrón, registradas
      como token no fungible (NFT) en la red Base. La página de cada ramo muestra, antes de la compra, su nombre, su
      jarrón, su número de tallos y su precio.</p>
    <p>Un ramo vive tres meses desde su acuñación: florece y se mece, y una cuenta atrás muestra el tiempo restante.
      Después se marchita y queda marchito e inmóvil para siempre. Esto forma parte de la obra y no constituye un
      defecto.</p>
    <p>Un ramo es un objeto de colección. No otorga derecho a ningún ingreso ni participación.</p>

    <h3>3. El ramo es tuyo</h3>
    <p>Quien posee su token es propietario del ramo: puedes mostrarlo donde quieras, conservarlo, regalarlo o revenderlo,
      sin ninguna otra formalidad. Como ocurre con un cuadro, su compra no transmite los derechos de autor sobre el
      dibujo: no incluye la facultad de fabricar ni vender copias o productos derivados.</p>

    <h3>4. Precio</h3>
    <p>El precio se fija en ETH, sin IVA (IVA no aplicable, art. 293 B del Código General de Impuestos francés), y se muestra en el ramo antes de la compra. El
      importe que aparece al lado en euros o en dólares estadounidenses es el mismo precio al cambio actual, obtenido de
      CoinGecko; pagas el precio en ETH. Las comisiones de la red Base («gas») las añade tu monedero y se pagan a la red,
      no a nosotros.</p>

    <h3>5. Pedido y pago</h3>
    <p>Pagas desde tu propio monedero, en este sitio, a través de Seaport, el protocolo del mercado OpenSea en el que
      están publicados nuestros ramos. Antes de pagar, marcas una casilla para solicitar la entrega inmediata (véase el
      artículo 7) y después confirmas; tu monedero muestra entonces el importe exacto, y la confirmación en tu monedero
      formaliza el pedido con obligación de pago. Una transacción confirmada en la red no puede anularse.</p>
    <p>Eres responsable de tu monedero, de sus claves y de la dirección con la que compras. Nunca custodiamos tus claves
      ni tus fondos.</p>

    <h3>6. Entrega y recibo</h3>
    <p>El ramo se transfiere a tu monedero en la misma transacción, en cuanto la red la confirma. A continuación, el
      sitio te ofrece un recibo descargable que acredita la compra, su precio, la transacción y tu solicitud de entrega
      inmediata. El registro de la transacción en la red Base también constituye prueba de la compra.</p>

    <h3>7. Derecho de desistimiento</h3>
    <p>Si eres consumidor en la Unión Europea, dispones en principio de 14 días para desistir de una compra a
      distancia. Un ramo es un contenido digital que no se suministra en soporte material y se entrega de inmediato:
      antes de pagar, solicitas expresamente su entrega inmediata y reconoces que, por ello, pierdes tu derecho de
      desistimiento (Código de Consumo francés, artículo L221-28, 13.º; Directiva 2011/83/UE, artículo 16, letra m).</p>

    <h3>8. Conformidad</h3>
    <p>Si eres consumidor, te beneficias de la garantía legal de conformidad de los contenidos digitales (Código de
      Consumo francés, artículos L224-25-1 y siguientes): si el ramo que has recibido no se ajusta a su descripción,
      escríbenos y lo pondremos en conformidad o, en su defecto, te reembolsaremos.</p>

    <h3>9. Reventa</h3>
    <p>No cobramos ninguna regalía por la reventa (0 %). Solo se aplican las comisiones propias del mercado y de la red.
      Los precios de los ramos en reventa los fijan libremente sus titulares; no asumimos ningún compromiso al
      respecto.</p>

    <h3>10. Responsabilidad</h3>
    <p>La red Base, los monederos y el mercado OpenSea son gestionados por terceros. No somos responsables de sus
      interrupciones, sus comisiones ni sus cambios, ni de las pérdidas causadas por la pérdida de una clave o por una
      dirección errónea. Nada de lo dispuesto en estas condiciones limita los derechos que la ley reconoce a los
      consumidores.</p>

    <h3>11. Reclamaciones y mediación</h3>
    <p>Escríbenos primero (véase <a href="{{legal}}#contact">Contacto</a>); respondemos en un plazo de 30 días. Si no se
      encuentra una solución, el consumidor puede someter el litigio, de forma gratuita, a nuestro mediador de consumo:
      <span class="a-remplir">[nombre, sitio web y dirección postal del mediador]</span>.</p>

    <h3>12. Ley aplicable</h3>
    <p>Estas condiciones se rigen por el derecho francés. El consumidor conserva la protección de las normas
      imperativas del país en el que reside y puede presentar un litigio ante los tribunales de ese país o de
      Francia.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Política de privacidad</h2>
    <p>El responsable del tratamiento es el editor identificado en el <a href="{{legal}}#notice">aviso legal</a>.
      Recogemos los menos datos posibles y ninguno para elaborar tu perfil.</p>
    <h3>Qué se trata, con qué fin y con qué base jurídica</h3>
    <ul>
      <li><strong>Datos de conexión</strong> (dirección IP, navegador, páginas solicitadas): los conserva nuestro
        proveedor de alojamiento, Cloudflare, en sus registros técnicos, para servir el sitio y protegerlo de abusos.
        Base jurídica: nuestro interés legítimo en un sitio operativo y seguro.</li>
      <li><strong>Tu país</strong>, que Cloudflare deduce de tu dirección IP en cada visita, para mostrarte el sitio en tu
        idioma y el precio en tu moneda. Se usa en el momento y nunca se almacena. Base jurídica: nuestro interés
        legítimo en un sitio que puedas leer.</li>
      <li><strong>El cambio de ETH:</strong> para mostrar el importe en tu moneda, tu navegador consulta a CoinGecko
        (api.coingecko.com) el cambio actual; CoinGecko ve tu dirección IP. Base jurídica: nuestro interés legítimo en
        mostrar un importe actualizado.</li>
      <li><strong>La dirección de tu monedero</strong>, cuando compras o vinculas un monedero: se lee para realizar la
        compra o para mostrar tus ramos. Base jurídica: el contrato. Las transacciones en la red Base son públicas y
        permanentes: ni nosotros ni nadie puede borrarlas.</li>
    </ul>
    <h3>Cookies</h3>
    <p>Si eliges tú mismo un idioma, el sitio lo recuerda en una única cookie, llamada <code>lang</code>, durante un
      año. Eso es todo: ninguna otra cookie, ninguna medición de audiencia, ninguna publicidad. Esta cookie solo guarda
      tu elección, por lo que no requiere banner de consentimiento.</p>
    <h3>Quién recibe los datos y dónde</h3>
    <p>Cloudflare, Inc. (alojamiento, Estados Unidos) y CoinGecko (cambio, Singapur). Las transferencias fuera de la
      Unión Europea se basan en el Marco de Privacidad de Datos UE-EE. UU. en el caso de Cloudflare y en las cláusulas
      contractuales tipo de la Comisión Europea.</p>
    <h3>Durante cuánto tiempo</h3>
    <p>Registros técnicos de Cloudflare: según lo que establezca Cloudflare, de unos días a unas semanas. Correos
      electrónicos que nos envíes: el tiempo necesario para responder y, después, tres años. No conservamos ningún otro
      dato.</p>
    <h3>Tus derechos</h3>
    <p>Puedes solicitar el acceso, la rectificación o la supresión de tus datos, la limitación de su tratamiento u
      oponerte a él, y recibirlos en un formato portable, escribiéndonos (véase <a href="{{legal}}#contact">Contacto</a>).
      También puedes presentar una reclamación ante la autoridad francesa de protección de datos, la CNIL (cnil.fr).</p>
  </section>

  <section id="app" aria-labelledby="t-app">
    <h2 id="t-app">Licencia de Belai Bureau</h2>
    <p>Belai Bureau es un programa gratuito para Windows 10 y 11 que muestra en tu escritorio los ramos que tiene un
      monedero que vinculas con él. Te concedemos una licencia gratuita, personal y no exclusiva para instalarlo y
      usarlo. No puedes venderlo ni distribuir copias modificadas.</p>
    <p><strong>Qué hace con los datos:</strong> guarda en tu ordenador un código aleatorio propio de ese ordenador, la
      dirección del monedero que vinculas y tus ajustes. Consulta a la red Base (mainnet.base.org, gestionado por Base)
      qué ramos tiene tu monedero y abre este sitio en tu navegador cuando vinculas un monedero. No nos envía nada ni
      mide nada.</p>
    <p>La aplicación se ofrece tal cual. Al desinstalarla (Configuración de Windows, Aplicaciones) se eliminan la
      aplicación y sus ajustes.</p>
  </section>

  <section id="ip" aria-labelledby="t-ip">
    <h2 id="t-ip">Propiedad intelectual</h2>
    <p>Las flores, los jarrones, los ramos, el decorado, los textos, el vídeo y el código de este sitio y de Belai Bureau
      son obras originales. Queda prohibida cualquier reproducción sin autorización, salvo en lo permitido por las
      <a href="{{legal}}#terms">condiciones de venta</a>. OpenSea, Base y CoinGecko son nombres de sus respectivos
      titulares. El cambio de ETH lo proporciona
      <a href="https://www.coingecko.com/" target="_blank" rel="noopener">CoinGecko</a>.</p>
  </section>

  <section id="accessibility" aria-labelledby="t-accessibility">
    <h2 id="t-accessibility">Accesibilidad</h2>
    <p>Nuestro objetivo son las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, nivel AA. El sitio funciona
      con el teclado (flechas para cambiar de ramo, Escape para alejarse), cada botón tiene un nombre para los lectores
      de pantalla y las animaciones se detienen cuando tu sistema pide reducir el movimiento. Limitaciones conocidas: el
      prado y los ramos son obras de arte, descritas con palabras y no en detalle; el vídeo tutorial no tiene voz y sus
      pasos están escritos al lado. Si algo te lo impide, escríbenos y te ayudaremos.</p>
  </section>

  <section id="contact" aria-labelledby="t-contact">
    <h2 id="t-contact">Contacto</h2>
    <p>Correo electrónico: <a href="mailto:lonjaret.hadrien@proton.me">lonjaret.hadrien@proton.me</a> · Teléfono: +33 6 18 55 81 22 ·
      Correo postal: Hadrien Lonjaret, 35 cours Sablon, 63000 Clermont-Ferrand, Francia</p>
  </section>`,
    back: '← Volver a los ramos',
  },

  // ---------- the strings of the scripts (entete.js, boutique.js), with {placeholders}
  js: {
    menu: 'Menú',
    shelves: { bouquets: 'Ramos del día', soliflores: 'Floreros solitarios', vendus: 'Ramos coleccionados' },
    desktopTitle: 'En mi escritorio',
    desktopLabel: 'Tu ramo en tu escritorio',
    openSeaTitle: 'Nuestra colección en OpenSea',
    openSeaLabel: 'Nuestra colección en OpenSea (nueva pestaña)',
    about: 'Acerca de',
    legal: 'Legal',
    closeLegal: 'Cerrar el panel legal',
    footer:
      '<p>Cada ramo es un objeto de colección digital único (un NFT en Base), con precio en ETH, sin IVA (IVA no aplicable, art. 293 B del Código General de Impuestos francés); el importe en euros o dólares estadounidenses es el mismo precio al cambio actual. Vive tres meses desde su acuñación y luego queda marchito para siempre. La entrega es inmediata, por lo que el derecho de desistimiento no se aplica una vez que confirmas. No cobramos regalías en la reventa (0 %).</p><p>Sin rastreo ni publicidad: como mucho una cookie, para recordar el idioma que elegiste.</p>',
    links: { notice: 'Aviso legal', terms: 'Condiciones de venta', privacy: 'Privacidad', app: 'Licencia de Belai Bureau', accessibility: 'Accesibilidad', contact: 'Contacto' },
    credit: 'Cambio de ETH por {coingecko}.',
    language: 'Idioma',
    lookCloser: 'Ver el ramo más de cerca',
    stepBack: 'Alejarse',
    planeLabel: '{name}, sobre el pilar. {alt}',
    frameLabel: '{name}, unos {fiat}, {life}. {alt}',
    buyLabel: 'Comprar «{name}», unos {fiat}',
    lifeLeft: '{h} h {m} min',
    fadesIn: 'Se marchita en {t}',
    fadesInLower: 'se marchita en {t}',
    faded: 'Marchito',
    fadedLower: 'marchito',
    fadedForGood: 'Marchito para siempre',
    buy: 'Comprar',
    soon: 'Pronto',
    soonMessage: 'Pronto podrás comprar desde el sitio.',
    tickFirst: 'Marca primero la casilla: tu ramo se entrega al instante.',
    receipt: {
      title: 'Recibo',
      download: 'Descarga tu recibo',
      bouquet: 'Ramo',
      token: 'Token',
      price: 'Precio',
      date: 'Fecha',
      buyer: 'Monedero del comprador',
      transaction: 'Transacción',
      seller: 'Vendedor',
      waiver: 'Antes de pagar, solicitaste la entrega inmediata y reconociste que, por ello, pierdes tu derecho de desistimiento (Código de Consumo francés, artículo L221-28, 13.º).',
      terms: 'Condiciones de venta aceptadas ese día: {url}',
      taxes: 'IVA no aplicable, art. 293 B del Código General de Impuestos francés.',
    },
  },

  // ---------- the names the bouquet descriptions use
  vases: {
    'bronze-carpe': 'un jarrón de carpa en bronce fundido',
    'verre-danseuses': 'un jarrón de vidrio esmerilado con bailarinas',
    'coupe-cobalt-mouchetee': 'un cuenco cobalto moteado',
    'coupe-pied-blanche-mate': 'una copa con pie blanca mate',
    'cylindre-inox-miroir': 'un cilindro de acero pulido espejo',
    'bulbe-pied-sable': 'un jarrón bulboso con pie color arena',
    'calice-mouchete': 'un jarrón cáliz moteado',
    'prisme-jaune': 'un prisma de cristal citrino tallado con corazón suspendido',
    'jardiniere-cristaux': 'una jardinera modernista de esmalte cristalizado',
    'prismes-bronze': 'un jarrón de prismas de bronce verdín',
    'colonne-art-nouveau': 'una columna modernista de gres',
    'bouteille-dragon': 'una botella azul noche con un dragón turquesa',
    'jarre-carpes': 'una tinaja de terracota con carpas en relieve',
    'bronze-lys': 'un jarrón de bronce patinado con lirios',
  },
  flowers: {
    'cerisier-du-japon-sato-zakura': 'flor de cerezo japonés',
    'cognassier-du-japon': 'membrillero japonés',
    forsythia: 'forsitia',
    'iris-hollandais': 'iris holandés',
    lilas: 'lila',
    'tulipe-perroquet': 'tulipán loro',
    'tulipe-double': 'tulipán doble',
    'tulipe-simple': 'tulipán',
    'tulipe-frangee': 'tulipán de flecos',
    'renoncule-classique': 'ranúnculo',
    'narcisse-trompette': 'narciso trompeta',
    'narcisse-bouquet': 'narciso de ramillete',
    jacinthe: 'jacinto',
    'anemone-coronaria': 'anémona',
    'anemone-sauvage': 'anémona de bosque',
    freesia: 'fresia',
    'pois-de-senteur': 'guisante de olor',
    muscari: 'nazareno',
    'fritillaire-meleagris': 'fritilaria tablero de damas',
    glycine: 'glicina',
    'viburnum-roseum': 'viburno bola de nieve',
    alchemille: 'alquemila',
    'anthurium-obake': 'anturio obake',
    'saule-a-chatons': 'sauce con amentos',
    'liriope-lily-grass': 'liriope',
    'cymbidium-grandes-fleurs': 'orquídea cymbidium',
    'rose-de-jardin': 'rosa de jardín',
    sanguisorbe: 'sanguisorba',
    phalaenopsis: 'orquídea phalaenopsis',
    'arum-calla': 'cala',
    'hortensia-boule': 'hortensia',
    'giroflee-matthiole': 'alhelí',
    'oeillet-de-poete-dianthus': 'clavel del poeta',
    'anthurium-cristal': 'anturio cristal',
    'jasminum-liane-jasmin': 'jazmín',
    'cyclamen-fleur-coupee': 'ciclamen',
    'ruscus-seche-teint': 'rusco teñido',
    lisianthus: 'lisianthus',
    germini: 'minigerbera',
    'reine-marguerite': 'reina margarita',
    bromeliacees: 'bromelia',
    'rose-standard': 'rosa',
    'rose-aspect-jardin': 'rosa de aire jardinero',
    gerbera: 'gerbera',
    'dahlia-decoratif': 'dalia',
    'chrysantheme-disbud': 'crisantemo de flor grande',
    'anthurium-andraeanum': 'anturio',
    'amarante-retombante': 'amaranto colgante',
    nerine: 'nerine',
    'oeillet-standard': 'clavel',
    delphinium: 'espuela de caballero',
    gloriosa: 'gloriosa',
    scabieuse: 'escabiosa',
  },
};
