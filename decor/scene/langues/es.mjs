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
    `Un ramo digital único de ${stems} tallos dibujados a mano (${flowers}) en ${vase}. Vive treinta días y luego queda marchito para siempre.`,

  pages: {
    index: {
      title: "Ramo de flores digital, dibujado tallo a tallo | Belai's Garden",
      description: 'Ramos de flores digitales dibujados tallo a tallo a partir de flores reales. Una colección cada mes, en series limitadas, para regalar y poner en tu pantalla.',
      ogTitle: 'Ramos de flores digitales, dibujados tallo a tallo',
      ogDescription: 'Cada mes, una colección de ramos en series limitadas, cada uno en un jarrón real. Míralos florecer, regala uno, ponlo en tu pantalla.',
    },
    about: {
      title: "Acerca de: ramos digitales de flores reales | Belai's Garden",
      description: 'Cómo nacen nuestros ramos digitales: flores dibujadas en código a partir de fotos reales, jarrones reales, el precio de los tallos, treinta días de vida.',
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
  orgDescription: 'Ramos de flores digitales dibujados tallo a tallo a partir de flores reales, para regalar y poner en tu pantalla.',
  listName: 'Ramos del día',

  // ---------- the shop page
  index: {
    h1: "Belai's Garden: ramos de flores digitales que viven",
    intro:
      'Ramos de flores digitales dibujados tallo a tallo a partir de flores reales. Cada mes, una nueva colección de ramos en series limitadas, cada uno en un jarrón real. Un ramo vive treinta días y luego queda marchito para siempre. Regálalo, o ponlo en tu pantalla con Belai Bureau.',
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
    signInTitle: 'Tu cuenta, por SMS',
    phone: 'Número de móvil',
    sendCode: 'Recibir el código',
    code: 'Código recibido',
    firstName: 'Nombre (opcional)',
  },

  // ---------- the About page
  about: {
    h1: 'Acerca de',
    lead: 'Ramos dibujados flor a flor, que florecen ante tus ojos.',
    body: `<h2>Flores dibujadas del natural</h2>
  <p>Cada flor de este jardín está dibujada en código, trazo a trazo, a partir de fotos reales: la forma de los pétalos,
    sus colores medidos en cada variedad, los capullos, la flor abierta y la flor marchita. En el jardín ya hay más de
    quinientas especies.</p>

  <h2>Ramos compuestos tallo a tallo</h2>
  <p>Cada ramo se compone tallo a tallo, cada uno en un jarrón real, como la carpa de bronce. El lugar de cada tallo, de cada flor y de cada hoja no se repite en ningún otro ramo.</p>

  <h2>Un ramo que vive</h2>
  <p>Un ramo vive treinta días desde su compra: una cuenta atrás, en horas y minutos, indica el tiempo que le queda. Después queda marchito e inmóvil para siempre.</p>

  <h2>El precio de los tallos reales</h2>
  <p>El precio de un ramo es la suma de lo que cuestan sus tallos en una floristería de Francia. El jarrón es un regalo. Se paga con tarjeta.</p>

  <h2>Una colección cada mes</h2>
  <p>Cada mes tiene su colección. Cada ramo existe en un número limitado de ejemplares, indicado bajo su nombre, y el ramo que compras es exactamente el que ves.</p>

  <h2>Regalar un ramo</h2>
  <p>Al comprar, puedes regalar el ramo: un mensaje corto que llevan los insectos, una música y un código para transmitir. La persona a quien lo regalas lo recibe en «Mis regalos» con tu nombre y ese código.</p>

  <h2>En tu escritorio</h2>
  <p>Con <a href="{{p}}desktop.html">Belai Bureau</a>, un widget gratuito para Windows, el ramo que coleccionaste se queda
    en el escritorio de tu ordenador, del tamaño que elijas, delante o detrás de tus ventanas.</p>

  <h2>Hacer crecer el jardín</h2>
  <p>Cada ramo coleccionado ayuda a que el jardín crezca: nuevas especies, nuevos jarrones, nuevos ramos.</p>`,
    faqTitle: 'Preguntas',
    faq: [
      ['¿Qué es un ramo digital?', 'Un ramo de flores dibujado en gráficos vectoriales a partir de fotos reales, tallo a tallo, en un jarrón real. Florece en la pantalla, se mece con la brisa y se marchita a los treinta días.'],
      ['¿Puedo poner un ramo de flores en mi pantalla?', 'Sí. Descarga Belai Bureau (gratis), inicia sesión una vez con tu número de teléfono y el código recibido por SMS: los ramos de tu cuenta se posan en tu pantalla, donde los colocas, ajustas su tamaño y los fijas.'],
      ['¿Cómo se fija el precio de un ramo?', 'Es la suma de lo que costarían sus tallos en una floristería de Francia. El jarrón es un regalo. El precio se muestra en euros (en dólares estadounidenses fuera de la zona euro) y se paga con tarjeta.'],
      ['¿Qué pasa a los treinta días?', 'El ramo se marchita y queda marchito e inmóvil para siempre. Sigue siendo tuyo.'],
      ['¿Cómo regalo un ramo?', 'Al comprar, elige regalarlo: escribe un mensaje corto, elige una música y los insectos que lo llevarán. Recibes un enlace y un código; la persona los introduce en «Mis regalos» con tu nombre, y el ramo pasa a su cuenta.'],
      ['¿Cuántos ejemplares hay de cada ramo?', 'Cada ramo de la colección del mes existe en un número limitado de ejemplares, indicado bajo su nombre. Cuando se acaban, no hay más.'],
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
    updated: 'Última actualización: 27 de octubre de 2026',
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
    <p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Estados Unidos · github.com.
      El servidor de las cuentas y los regalos está alojado por Cloudflare, Inc., 101 Townsend Street, San Francisco,
      CA 94107, Estados Unidos · cloudflare.com</p>
  </section>

  <section id="terms" aria-labelledby="t-terms">
    <h2 id="t-terms">Condiciones generales de venta</h2>

    <h3>1. Partes y ámbito de aplicación</h3>
    <p>Estas condiciones generales de venta se aplican a todo ramo vendido en este sitio por el editor indicado en el
      aviso legal («nosotros») a toda persona mayor de edad («usted»). El pago de un ramo implica la aceptación de estas
      condiciones, en su versión vigente el día de la compra. Existen en varios idiomas; prevalece la versión francesa.</p>

    <h3>2. Objeto: el ramo</h3>
    <p>Un ramo es una obra digital: flores dibujadas en gráficos vectoriales, en un jarrón, animadas en la pantalla. Cada
      ramo pertenece a la colección de un mes y solo se vende en un número limitado de ejemplares, indicado bajo su
      nombre junto con los ejemplares que quedan. El ramo que compra es exactamente el que ve, sin variación. Su página
      indica, antes de la compra, su nombre, su jarrón, su colección y su precio.</p>
    <p>Un ramo vive treinta días desde su compra: florece y se mece, y una cuenta atrás indica el tiempo que le queda.
      Después se marchita y queda marchito e inmóvil para siempre. Esta evolución forma parte de la obra y no es un
      defecto.</p>
    <p>Un ramo no otorga ningún derecho a ingresos ni a participación alguna, y no se revende en este sitio.</p>

    <h3>3. Su cuenta</h3>
    <p>Para comprar o recibir un ramo, crea una cuenta con su número de teléfono móvil, verificado mediante un código
      enviado por SMS. Los ramos comprados o recibidos quedan vinculados a esa cuenta. Usted es responsable del acceso a
      su número: avísenos si lo cambia.</p>

    <h3>4. Lo que obtiene</h3>
    <p>La compra le da el derecho personal y no exclusivo de ver el ramo en este sitio y de mostrarlo en sus pantallas
      con Belai Bureau, para uso privado. Este derecho solo se transmite regalando el ramo (artículo 8). Como con un
      cuadro, la compra no implica la cesión de los derechos de autor del dibujo: la fabricación y venta de copias o de
      productos derivados, así como todo uso comercial, no están incluidas.</p>

    <h3>5. Precio</h3>
    <p>El precio se fija en euros, sin IVA (IVA no aplicable, art. 293 B del Código General de Impuestos francés), y se
      muestra en el ramo antes de la compra; es la suma de lo que cuestan sus tallos en una floristería de Francia, con
      el jarrón de regalo. Fuera de la zona euro, el importe en dólares estadounidenses es orientativo: el pago se
      realiza en euros y su banco puede añadir gastos de cambio.</p>

    <h3>6. Pedido y pago</h3>
    <p>Usted paga con tarjeta, o con Apple Pay o Google Pay, en la página de pago de nuestro proveedor Stripe (Stripe
      Payments Europe, Ltd., Dublín, Irlanda). Nunca vemos ni conservamos los números de su tarjeta. Antes de pagar,
      marca una casilla para pedir la entrega inmediata (véase el artículo 9). La validación del pago constituye un
      pedido con obligación de pago. Se le reserva un ejemplar mientras la página de pago está abierta, treinta minutos
      como máximo.</p>

    <h3>7. Entrega y recibo</h3>
    <p>El ramo se añade a su cuenta en cuanto Stripe confirma el pago. Recibe un recibo con el ramo, su precio, la fecha
      y su solicitud de entrega inmediata.</p>

    <h3>8. Regalar un ramo</h3>
    <p>Al comprar, puede regalar el ramo y componer su llegada: un mensaje corto que llevan los insectos, una música y
      los insectos que lo llevan. Recibe un enlace y un código, que usted mismo transmite a la persona que elija. El
      código es válido hasta que el ramo se marchita, para un solo uso; tras cinco intentos erróneos, la introducción
      queda bloqueada una hora. Cuando la persona introduce su nombre y el código, el ramo pasa a su cuenta y deja la
      suya; mientras el código no se use, el ramo sigue en su cuenta. Usted es responsable del contenido del mensaje,
      que no debe infringir la ley ni los derechos de nadie.</p>

    <h3>9. Derecho de desistimiento</h3>
    <p>Si es usted un consumidor residente en la Unión Europea, dispone en principio de 14 días para desistir de una
      compra a distancia. Un ramo es un contenido digital que no se suministra en un soporte material y se entrega de
      inmediato: antes de pagar, usted pide expresamente su entrega inmediata y reconoce perder así su derecho de
      desistimiento (Código de Consumo francés, artículo L221-28, 13°; Directiva 2011/83/UE, artículo 16, letra m).</p>

    <h3>10. Conformidad</h3>
    <p>Si es usted un consumidor, goza de la garantía legal de conformidad aplicable a los contenidos digitales (Código
      de Consumo francés, artículos L224-25-1 y siguientes): si el ramo recibido no corresponde a su descripción,
      escríbanos y lo pondremos en conformidad o, en su defecto, le reembolsaremos.</p>

    <h3>11. Responsabilidad</h3>
    <p>El pago lo gestiona Stripe y los SMS los envía OVHcloud. No somos responsables de sus interrupciones ni de sus
      cambios. Ninguna estipulación de estas condiciones limita los derechos que la ley otorga a los consumidores.</p>

    <h3>12. Reclamaciones y mediación</h3>
    <p>Escríbanos primero (véase <a href="{{legal}}#contact">Contacto</a>); respondemos en 30 días. Si no se encuentra
      solución, el consumidor puede someter gratuitamente el litigio a nuestro mediador de consumo:
      <span class="a-remplir">[nombre, sitio web y dirección postal del mediador]</span>.</p>

    <h3>13. Ley aplicable</h3>
    <p>Estas condiciones se rigen por el derecho francés. El consumidor conserva la protección que le otorgan las
      disposiciones imperativas del país donde reside y puede llevar un litigio ante los tribunales de ese país o de
      Francia.</p>
  </section>

  <section id="privacy" aria-labelledby="t-privacy">
    <h2 id="t-privacy">Política de privacidad</h2>
    <p>El responsable del tratamiento es el editor indicado en el <a href="{{legal}}#notice">aviso legal</a>. Recogemos
      los menos datos posibles, y ninguno para elaborar perfiles.</p>
    <h3>Datos tratados, finalidades y bases jurídicas</h3>
    <ul>
      <li><strong>Datos de conexión</strong> (dirección IP, navegador, páginas solicitadas): conservados por nuestros
        proveedores de alojamiento en sus registros técnicos, para servir el sitio y protegerlo de abusos. Base jurídica:
        nuestro interés legítimo en un sitio que funcione y sea seguro.</li>
      <li><strong>Su idioma y su país</strong>, deducidos en su dispositivo a partir de la configuración de idioma de su
        navegador, para mostrar el sitio en su idioma y el precio en su moneda. No se envía ni se conserva nada.</li>
      <li><strong>Su cuenta</strong>: su número de teléfono móvil, el nombre que elija y la fecha de creación de la
        cuenta, para identificarle y vincular sus ramos a su cuenta. El número se guarda cifrado; una huella de este
        número sirve para encontrar su cuenta. Nunca se muestra a otra persona. Base jurídica: el contrato.</li>
      <li><strong>Los códigos enviados por SMS</strong>, para verificar su número: válidos diez minutos y después
        borrados. Base jurídica: el contrato.</li>
      <li><strong>Sus compras</strong>: el ramo, su precio, la fecha, la referencia y el estado del pago enviados por
        Stripe, y su solicitud de entrega inmediata. Base jurídica: el contrato y nuestras obligaciones contables.</li>
      <li><strong>Sus regalos</strong>: el mensaje, la música y los insectos elegidos, el nombre del remitente y el estado
        del regalo; el código solo se guarda en forma de huella. Quien recibe el ramo ve el nombre y el mensaje; el
        remitente solo ve que el ramo ha sido reclamado. Base jurídica: el contrato.</li>
    </ul>
    <h3>Pago</h3>
    <p>Los datos de su tarjeta se introducen en la página de Stripe y los trata Stripe, según su propia política de
      privacidad. Solo recibimos la referencia del pago, su importe y su estado.</p>
    <h3>Cookies</h3>
    <p>Si elige usted mismo un idioma, el sitio lo recuerda en una cookie llamada <code>lang</code>, durante un año.
      Mientras está conectado a su cuenta, una cookie de sesión le mantiene conectado. Nada más: ninguna medición de
      audiencia, ninguna publicidad. Estas cookies son necesarias para el servicio que usted pide, por lo que no
      requieren aviso de consentimiento.</p>
    <h3>Destinatarios y lugares de tratamiento</h3>
    <p>GitHub, Inc. (alojamiento del sitio, Estados Unidos), Cloudflare, Inc. (servidor de cuentas y regalos, Estados
      Unidos), Stripe (pago, Irlanda y Estados Unidos) y OVHcloud (envío de SMS, Francia). Las transferencias fuera de
      la Unión Europea se basan en el Marco de Privacidad de Datos UE-EE. UU. y en las cláusulas contractuales tipo de la
      Comisión Europea.</p>
    <h3>Plazos de conservación</h3>
    <p>Registros técnicos de los proveedores de alojamiento: de unos días a unas semanas, según su configuración. Cuenta:
      mientras la conserve; al suprimirla, se borra en 30 días. Regalos: mientras el ramo esté en una cuenta. Compras:
      diez años, plazo de conservación de los justificantes contables (Código de Comercio francés, artículo L123-22).
      Correos que nos envíe: el tiempo necesario para responder y después tres años.</p>
    <h3>Sus derechos</h3>
    <p>Puede solicitar el acceso a sus datos, su rectificación o supresión, la limitación de su tratamiento, oponerse a
      él y recibir sus datos en un formato portable, escribiéndonos (véase <a href="{{legal}}#contact">Contacto</a>).
      Puede suprimir su cuenta en cualquier momento. También puede presentar una reclamación ante la autoridad francesa
      de protección de datos, la CNIL (cnil.fr).</p>
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
    <p>Las flores, jarrones, ramos, decorados, textos, vídeo y código de este sitio y de Belai Bureau son obras
      originales. Queda prohibida toda reproducción sin autorización, salvo en los límites previstos por las
      <a href="{{legal}}#terms">condiciones generales de venta</a>. Stripe, OVHcloud, GitHub, Cloudflare y Base son
      nombres que pertenecen a sus respectivos titulares.</p>
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
    appTitle: 'Belai Bureau',
    appLabel: 'Descargar Belai Bureau, la app que pone tu ramo en tu pantalla',
    openSeaTitle: 'Nuestra colección en OpenSea',
    openSeaLabel: 'Nuestra colección en OpenSea (nueva pestaña)',
    about: 'Acerca de',
    legal: 'Legal',
    closeLegal: 'Cerrar el panel legal',
    footer:
      '<p>Cada ramo es un ramo digital de serie limitada, pagado con tarjeta, sin IVA (IVA no aplicable, art. 293 B del Código General de Impuestos francés). Vive treinta días desde su compra y luego queda marchito para siempre. La entrega es inmediata: el derecho de desistimiento deja de aplicarse una vez confirmada tu compra.</p><p>Sin rastreo ni publicidad: como mucho una cookie, para recordar el idioma que has elegido.</p>',
    links: { notice: 'Aviso legal', terms: 'Condiciones de venta', privacy: 'Privacidad', app: 'Licencia de Belai Bureau', accessibility: 'Accesibilidad', contact: 'Contacto' },
    credit: '',
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
    // the month's collection and the copies left, under the bouquet's name ({month}: the month in the page's language)
    series: 'Colección de {month} · quedan {left} de {total}',
    buy: 'Comprar',
    soon: 'Pronto',
    soonMessage: 'Pronto podrás comprar desde el sitio.',
    tickFirst: 'Marca primero la casilla: tu ramo se entrega al instante.',
    signInFirst: 'Inicia sesión primero: tu ramo quedará vinculado a tu número.',
    codeSent: 'Código enviado por SMS: introdúcelo y confirma.',
    wrongNumber: 'Este número no parece válido.',
    wrongCode: 'Código incorrecto: quedan {n} intento(s).',
    tooMany: 'Demasiados intentos: vuelve a intentarlo en unos minutos.',
    codeExpired: 'Este código ha caducado: pide uno nuevo.',
    soldOut: 'No queda ningún ejemplar de este ramo.',
    payError: 'El pago no se ha podido completar. Inténtalo de nuevo en un momento.',
    redirecting: 'Hacia la página de pago…',
    paid: 'Tu ramo es tuyo: ejemplar n.º {n} de {total}.',
    paymentPending: 'Confirmando el pago…',
    cancelled: 'Pago cancelado: el ejemplar vuelve a estar a la venta.',
    receipt: {
      title: 'Recibo',
      download: 'Descarga tu recibo',
      bouquet: 'Ramo',
      price: 'Precio',
      date: 'Fecha',
      seller: 'Vendedor',
      waiver: 'Antes de pagar, solicitaste la entrega inmediata y reconociste que, por ello, pierdes tu derecho de desistimiento (Código de Consumo francés, artículo L221-28, 13.º).',
      terms: 'Condiciones de venta aceptadas ese día: {url}',
      taxes: 'IVA no aplicable, art. 293 B del Código General de Impuestos francés.',
      copy: 'Ejemplar',
      copyOf: 'n.º {n} de {total}, {month}',
      order: 'Pedido',
      payment: 'Pago',
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
    'gres-chauve-souris': 'un jarrón de gres con un murciélago esmaltado',
    'balustre-perce-neige': 'un jarrón balaustre con campanillas de invierno',
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
