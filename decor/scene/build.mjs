// build.mjs: writes the shop's pages in every language, and what search engines and answer engines read.
//
//   node decor/scene/build.mjs      (after predessin.mjs, after any change of gabarits/ or langues/)
//
// - The pages: gabarits/<page>.html filled with langues/<code>.mjs. English at the root (index.html, about.html,
//   desktop.html, legal.html), the other languages in <code>/ (fr/index.html...), each with <base href="../"> so the
//   same relative paths serve every language. {{a.b}} in a template is the text a.b of the language; the others
//   ({{head}}, {{ld}}, {{i18n}}, {{faq}}...) are written here.
// - In each page: the head (title, description, canonical, hreflang of the five languages, Open Graph), its JSON-LD,
//   and the scripts' strings as a JSON block (id="i18n") read by entete.js and boutique.js.
// - sitemap.xml with the language alternates, llms.txt (in English, today's bouquets).
// The language a visitor gets is picked by _worker.js (Cloudflare Pages) from the country of their IP address.
// The site's address is ORIGIN (decor/AUDIT-LEGAL.md: the domain is provisional).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ORIGIN = 'https://belai.garden';
const SITE = "Belai's Garden";
const CODES = ['en', 'fr', 'es', 'zh', 'de'];
const PAGES = ['index', 'about', 'desktop', 'legal'];
const HERE = dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().slice(0, 10);
const cfg = JSON.parse(readFileSync(join(HERE, 'boutique.json'), 'utf8'));

const langs = [];
for (const code of CODES) {
  const f = join(HERE, 'langues', `${code}.mjs`);
  if (!existsSync(f)) {
    console.warn(`build.mjs: langues/${code}.mjs missing, ${code} skipped`);
    continue;
  }
  langs.push((await import(pathToFileURL(f).href)).default);
}
const EN = langs.find((l) => l.code === 'en');

const prefix = (L) => (L.code === 'en' ? '' : `${L.code}/`);
// the public addresses, without .html: Cloudflare Pages serves /about.html at /about (and redirects the former)
const pageUrl = (L, page) => `${ORIGIN}/${prefix(L)}${page === 'index' ? '' : page}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
const ld = (obj, id) => `<script type="application/ld+json"${id ? ` id="${id}"` : ''}>\n${JSON.stringify(obj, null, 2).replace(/<\//g, '<\\/')}\n</script>`;

// the installer: the one file of telechargements/, its fingerprint shown on the desktop page
const installer = readdirSync(join(HERE, 'telechargements')).find((f) => f.endsWith('.exe'));
const sha256 = createHash('sha256').update(readFileSync(join(HERE, 'telechargements', installer))).digest('hex');
const version = (/(\d+\.\d+\.\d+)/.exec(installer) || [])[1] || '';

// ---------- the bouquets, described in a language
function describe(L, p) {
  const n = new Map();
  for (const [id, k] of p.tiges) {
    const name = L.flowers[id] || EN.flowers[id] || id.replace(/-/g, ' ');
    n.set(name, (n.get(name) || 0) + k);
  }
  const f = [...n].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  const shown = f.length > 6 ? [...f.slice(0, 6), L.more] : f;
  return L.describe({ stems: p.prix.tiges, flowers: L.list(shown), vase: L.vases[p.vase] || EN.vases[p.vase] || p.vase });
}

// ---------- the head of a page
function head(L, page) {
  const t = L.pages[page];
  const alt = langs.map((A) => `<link rel="alternate" hreflang="${A.code}" href="${pageUrl(A, page)}">`);
  alt.push(`<link rel="alternate" hreflang="x-default" href="${pageUrl(EN, page)}">`);
  const og = [
    ['og:type', 'website'],
    ['og:site_name', SITE],
    ['og:title', t.ogTitle],
    ['og:description', t.ogDescription],
    ['og:url', pageUrl(L, page)],
    ['og:image', `${ORIGIN}/share.jpg`],
    ['og:image:width', '1200'],
    ['og:image:height', '630'],
    ['og:image:alt', L.shareAlt],
    ['og:locale', L.ogLocale],
    ...langs.filter((A) => A !== L).map((A) => ['og:locale:alternate', A.ogLocale]),
  ];
  if (page === 'desktop')
    og.push(['og:video', `${ORIGIN}/videos/fond-ecran.mp4`], ['og:video:type', 'video/mp4'], ['og:video:width', '720'], ['og:video:height', '1280']);
  return [
    ...(L.code === 'en' ? [] : ['<base href="../">']),
    `<title>${esc(t.title)}</title>`,
    `<meta name="description" content="${esc(t.description)}">`,
    `<link rel="canonical" href="${pageUrl(L, page)}">`,
    ...alt,
    '<meta name="theme-color" content="#6c9bcf">',
    '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
    '<link rel="manifest" href="site.webmanifest">',
    ...og.map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`),
    '<meta name="twitter:card" content="summary_large_image">',
    ...(page === 'index' ? preloads() : []),
  ].join('\n');
}

// the home page's files, asked for from its head (and sent ahead by the host as early hints): the shop's data, the first
// bouquet's one file (paquet.mjs) and the decor's static layers. A phone held upright (the screen no wider than 28/45 of
// its height) sees only the world's central column and gets the cut layers (scene.js, recadre.mjs), the others the full ones.
// the compiled previews of the heavy static layers (calques.mjs): scene.js shows them first, then their SVG
const calquesFile = join(HERE, '..', 'out', 'calques.json');
const calques = existsSync(calquesFile) ? JSON.parse(readFileSync(calquesFile, 'utf8')) : {};
const apercu = (html) =>
  html.replace(/data-src="([\w-]+\.svg)"/g, (m, name) => {
    const a = calques[name];
    if (!a) return m;
    const v = Object.fromEntries(Object.entries(a).map(([k, o]) => [k, [o.src, ...o.box]]));
    return `${m} data-apercu='${JSON.stringify(v)}'`;
  });

function preloads() {
  // the first bouquet's sprites index (sprites.mjs); its picture is read by PixiJS's own loader (a worker), which a preload
  // would not serve
  const first = cfg.produits[0].bouquet.replace(/manifeste\.json$/, 'sprites/');
  const COL = '(max-aspect-ratio: 28/45)';
  const WIDE = '(min-aspect-ratio: 28.001/45)';
  // a layer with a compiled preview (calques.mjs) is asked for by its preview, which the page shows first
  const layer = (name, hi) => {
    const a = calques[name];
    const col = a ? a.colonne?.src : ['horizon.svg', 'sol-loin.svg', 'sol-milieu.svg', 'sol-pres.svg'].includes(name) && `colonne/${name}`;
    const full = a ? a.plein.src : name;
    const pri = hi ? ' fetchpriority="high"' : '';
    return col
      ? [
          `<link rel="preload" href="../out/${col}" as="image" media="${COL}"${pri}>`,
          `<link rel="preload" href="../out/${full}" as="image" media="${WIDE}"${pri}>`,
        ]
      : [`<link rel="preload" href="../out/${full}" as="image"${pri}>`];
  };
  return [
    '<link rel="preload" href="boutique.json" as="fetch" crossorigin>',
    ...layer('ciel.svg', true),
    // the catalogue frieze's manifest (frise.js): its strips' tiles follow
    '<link rel="preload" href="../out/frise/frise.json" as="fetch" crossorigin>',
    // the scene's canvas (toile.mjs) and PixiJS, asked for at once instead of after frise.js has started
    '<link rel="modulepreload" href="toile.mjs">',
    '<link rel="modulepreload" href="../../insectes/runtime/vendor/pixi-8.6.6.min.mjs">',
    `<link rel="preload" href="${first}sprites.json" as="fetch" crossorigin>`,
  ];
}

// ---------- the structured data of a page
function structured(L, page) {
  const org = { '@id': `${ORIGIN}/#org` };
  const site = { '@id': `${ORIGIN}/#site` };
  if (page === 'index') {
    const items = cfg.produits.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        '@id': `${pageUrl(L, 'index')}?b=${p.id}`,
        name: p.nom,
        url: `${pageUrl(L, 'index')}?b=${p.id}`,
        image: `${ORIGIN}/${p.vignette}`,
        description: describe(L, p),
        brand: { '@type': 'Brand', name: SITE },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'stems', value: p.prix.tiges },
          { '@type': 'PropertyValue', name: 'lifespan', value: 'P3M' },
          { '@type': 'PropertyValue', name: 'network', value: 'Base' },
        ],
        offers: { '@type': 'Offer', price: (p.prix.centimes / 100).toFixed(2), priceCurrency: 'EUR', url: `${pageUrl(L, 'index')}?b=${p.id}`, seller: org },
      },
    }));
    return [
      ld({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Organization', ...org, name: SITE, url: `${ORIGIN}/`, logo: `${ORIGIN}/icon-512.png`, description: L.orgDescription },
          { '@type': 'WebSite', ...site, name: SITE, url: `${ORIGIN}/`, inLanguage: CODES.filter((c) => langs.some((A) => A.code === c)), publisher: org },
        ],
      }),
      ld({ '@context': 'https://schema.org', '@type': 'ItemList', name: L.listName, inLanguage: L.code, itemListElement: items }, 'ld-bouquets'),
    ].join('\n');
  }
  if (page === 'about')
    return ld({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'AboutPage', '@id': pageUrl(L, 'about'), url: pageUrl(L, 'about'), name: L.pages.about.ogTitle, inLanguage: L.code, isPartOf: site },
        { '@type': 'FAQPage', inLanguage: L.code, mainEntity: L.about.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      ],
    });
  if (page === 'desktop') {
    const d = L.desktop;
    return ld({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': `${ORIGIN}/desktop#app`,
          name: 'Belai Bureau',
          applicationCategory: 'DesktopEnhancementApplication',
          operatingSystem: 'Windows 10, Windows 11',
          softwareVersion: version,
          fileSize: '3 MB',
          downloadUrl: `${ORIGIN}/telechargements/${installer}`,
          description: d.appDescription,
          inLanguage: L.code,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: org,
          screenshot: `${ORIGIN}/videos/fond-ecran.jpg`,
        },
      ],
    });
  }
  return ld({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': pageUrl(L, 'legal'), url: pageUrl(L, 'legal'), name: L.pages.legal.ogTitle, inLanguage: L.code, isPartOf: site, dateModified: today });
}

// ---------- the scripts' strings
function i18n(L, page) {
  const data = {
    code: L.code,
    locale: L.locale,
    page,
    p: prefix(L),
    langues: langs.map((A) => ({ code: A.code, name: A.name, href: `${prefix(A)}${page}.html` })),
    t: L.js,
    bureau: { installer, win: L.desktop.winSmall, soon: L.desktop.soon },
    alts: Object.fromEntries(cfg.produits.map((p) => [p.id, describe(L, p)])),
  };
  return `<script type="application/json" id="i18n">${JSON.stringify(data).replace(/<\//g, '<\\/')}</script>`;
}

// ---------- the pages
// The page's own stylesheets and scripts carry a digest of their content (?v=): a changed file is never taken from a
// browser's cache beside a new one (owner's captures of 2026-10-27: an old demo.css with a new script). The demo's module,
// loaded later by boutique.js, and the files it reads carry one digest of them all, on the page's <html data-demo-v>.
const digest = (...files) => createHash('sha256').update(files.map((f) => readFileSync(join(HERE, f))).join('\0')).digest('hex').slice(0, 10);
const DEMO_FILES = ['demo.mjs', 'demo.css', 'demo/apps.mjs', 'demo/laptop.svg', 'demo/imac.svg', 'demo/android.svg', 'demo/iphone.svg'];
const demoV = digest(...DEMO_FILES);
const versioned = (html) =>
  html
    .replace(/(<link rel="stylesheet" href=")([\w-]+\.css)(")/g, (m, a, f, b) => (existsSync(join(HERE, f)) ? `${a}${f}?v=${digest(f)}${b}` : m))
    .replace(/(<script src=")([\w-]+\.js)(")/g, (m, a, f, b) => (existsSync(join(HERE, f)) ? `${a}${f}?v=${digest(f)}${b}` : m))
    .replace(/<html /, `<html data-demo-v="${demoV}" `);
let written = 0;
for (const L of langs) {
  const p = prefix(L);
  if (p) mkdirSync(join(HERE, L.code), { recursive: true });
  for (const page of PAGES) {
    let html = readFileSync(join(HERE, 'gabarits', `${page}.html`), 'utf8').replace(/\r\n/g, '\n');
    const fill = {
      htmlLang: L.code === 'zh' ? 'zh-Hans' : L.code,
      head: head(L, page),
      ld: structured(L, page),
      i18n: i18n(L, page),
      faq: L.about.faq.map(([q, a]) => `    <dt>${q}</dt>\n    <dd>${a}</dd>`).join('\n'),
      steps: L.desktop.steps.map((s) => `        <li>${s}</li>`).join('\n'),
      toc: Object.entries(L.legal.toc).map(([id, label]) => `      <li><a href="{{legal}}#${id}">${label}</a></li>`).join('\n'),
      installer,
      sha256,
      fingerprint: L.desktop.fingerprint.replace('{v}', version),
    };
    // two passes: the texts may hold {{p}} and {{legal}}
    for (let pass = 0; pass < 2; pass++)
      html = html.replace(/\{\{([\w.]+)\}\}/g, (m, k) => {
        if (k === 'p') return pass ? p : m;
        if (k === 'legal') return pass ? `${p}legal.html` : m;
        const v = k in fill ? fill[k] : get(L, k);
        if (v == null) throw new Error(`build.mjs: ${L.code} ${page}: no text for {{${k}}}`);
        return String(v);
      });
    if (page === 'index') html = apercu(html);
    html = versioned(html);
    writeFileSync(join(HERE, p, `${page}.html`), html.replace(/\n/g, '\r\n'));
    written++;
  }
}

// ---------- sitemap.xml, with the language alternates of each page
const FREQ = { index: ['daily', '1.0'], desktop: ['monthly', '0.8'], about: ['monthly', '0.7'], legal: ['yearly', '0.3'] };
let sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
// (desktop.html only leads to the shop with Belai Bureau's downloads open: not in the sitemap)
for (const page of PAGES.filter((p) => p !== 'desktop'))
  for (const L of langs) {
    sm += `  <url>\n    <loc>${pageUrl(L, page)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${FREQ[page][0]}</changefreq>\n    <priority>${FREQ[page][1]}</priority>\n`;
    for (const A of langs) sm += `    <xhtml:link rel="alternate" hreflang="${A.code}" href="${pageUrl(A, page)}"/>\n`;
    sm += `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(EN, page)}"/>\n  </url>\n`;
  }
writeFileSync(join(HERE, 'sitemap.xml'), sm + '</urlset>\n');

// ---------- llms.txt
const usd = cfg.coursUsd && cfg.coursUsd.usdParEth;
const llms = `# ${SITE}

> Digital flower bouquets drawn stem by stem, in code, from photos of real flowers. New one-of-a-kind bouquets every day, each in a real vase, collected as NFTs on the Base network. Each bouquet lives three months, then stays faded for good. Belai Bureau, a free Windows widget, sets the bouquet you own on your computer's desktop.

Key facts:
- What it is: one-of-a-kind digital bouquets (vector artwork), more than five hundred flower species drawn from real photos, bud to faded.
- Price: the sum of what the stems would cost at a florist in France, set in ETH, with no VAT (French micro-enterprise, art. 293 B of the General Tax Code); the vase comes free. 0% royalties on resale.
- Lifespan: three months from minting, with a countdown; then the bouquet fades and stays still, for good.
- Where: listed on OpenSea, paid from the buyer's own wallet on this site (Seaport), on Base.
- Desktop widget: Belai Bureau, free, Windows 10 and 11, about 3 MB. It shows only bouquets held by the linked wallet; place, size, pin, in front of or behind windows; hold six seconds to move a pinned bouquet.
- Languages: ${langs.map((L) => `${L.name} (${ORIGIN}/${prefix(L)})`).join(', ')}.
- Publisher: Hadrien Lonjaret (Agent 33), Clermont-Ferrand, France. No tracking, no advertising.

## Pages

- [Bouquets of the day](${ORIGIN}/): the shop, a meadow where each bouquet blooms on a lava pillar
- [Belai Bureau](${ORIGIN}/telechargements/${installer}): the free Windows widget's installer (Mac coming soon)
- [About](${ORIGIN}/about): how the flowers are drawn, how a bouquet is priced, questions and answers
- [Legal](${ORIGIN}/legal): legal notice, terms of sale, privacy, app licence, accessibility

## Bouquets of the day (${today})

${cfg.produits.map((p) => `- ${p.nom}: ${describe(EN, p)} Price ${p.prix.eth} ETH${usd ? ` (about $${Math.round(p.prix.eth * usd)} at ${usd} USD per ETH)` : ''}.`).join('\n')}
`;
writeFileSync(join(HERE, 'llms.txt'), llms);

const missing = new Set();
for (const L of langs) for (const p of cfg.produits) for (const [id] of p.tiges) if (!L.flowers[id]) missing.add(`${L.code}:${id}`);
if (missing.size) console.warn(`build.mjs: flowers without a name: ${[...missing].join(', ')}`);
console.log(`build.mjs: ${written} pages (${langs.map((L) => L.code).join(', ')}), sitemap.xml, llms.txt (${today})`);
