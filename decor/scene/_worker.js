// _worker.js: the site's front door on Cloudflare Pages (advanced mode: this file at the root of what is deployed; it is
// never served). Every request goes through it.
//
// - Language: a visitor who opens an English page (/, /about.html...) is sent to the same page in their language,
//   picked from the country of their IP address (Cloudflare's request.cf.country); in a country of several languages
//   (Belgium, Switzerland, Canada, Luxembourg) and in the countries not listed, the browser's languages decide; English
//   otherwise. A language chosen by hand in the footer (the cookie "lang") always wins, and a page asked for in a
//   language (/fr/...) is never moved. Search engines and answer engines are never redirected: they read every
//   language through the hreflang links.
// - Currency: every page gets <html data-pays="FR"> so boutique.js shows euros in the euro area, US dollars elsewhere.
// - Security headers on every response (they replace a _headers file, which does not apply to a worker's responses).
// Tested by worker-test.mjs (node decor/scene/worker-test.mjs).

const LANGS = ['en', 'fr', 'es', 'zh', 'de'];
// the English pages, with and without .html (Pages serves them without)
const PAGES = new Set(['/', '/index.html', '/about', '/about.html', '/desktop', '/desktop.html', '/legal', '/legal.html']);

const BY_COUNTRY = {};
const put = (lang, list) => list.split(' ').forEach((c) => (BY_COUNTRY[c] = lang));
put('fr', 'FR MC RE GP MQ GF YT PM BL MF NC PF WF SN CI CM ML BF NE TG BJ GA CG CD MG GN TD CF DJ KM HT BI RW');
put('es', 'ES MX AR CO CL PE VE EC GT CU BO DO HN PY SV NI CR PA UY GQ PR');
put('zh', 'CN TW HK MO');
put('de', 'DE AT LI');
// several languages: the browser's choice among them, else the first
const MIXED = { BE: ['fr', 'de'], CH: ['de', 'fr'], LU: ['fr', 'de'], CA: ['en', 'fr'] };

const BOTS = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|whatsapp|telegram|discord|linkedin|preview|google-extended|applebot|perplexity|claude|gpt|chatgpt|bytespider|ccbot/i;

const HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self' https://api.coingecko.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

// the browser's languages, in its order of preference, among ours
function fromBrowser(header, among) {
  const want = String(header || '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const q = params.map((x) => /^q=([\d.]+)$/.exec(x.trim())).find(Boolean);
      return { lang: tag.split('-')[0], q: q ? Number(q[1]) : 1 };
    })
    .filter((x) => x.lang && x.q > 0)
    .sort((a, b) => b.q - a.q);
  const hit = want.find((x) => among.includes(x.lang));
  return hit ? hit.lang : null;
}

export function pickLanguage(country, acceptLanguage) {
  const c = String(country || '').toUpperCase();
  if (BY_COUNTRY[c]) return BY_COUNTRY[c];
  if (MIXED[c]) return fromBrowser(acceptLanguage, MIXED[c]) || MIXED[c][0];
  return fromBrowser(acceptLanguage, LANGS) || 'en';
}

const cookie = (request, name) => {
  const m = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(request.headers.get('Cookie') || '');
  return m ? decodeURIComponent(m[1]) : null;
};

function secure(response) {
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries(HEADERS)) r.headers.set(k, v);
  return r;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const country = (request.cf && request.cf.country) || '';

    // an English page, asked for without a language: send the visitor to theirs
    if ((request.method === 'GET' || request.method === 'HEAD') && PAGES.has(url.pathname) && !BOTS.test(request.headers.get('User-Agent') || '')) {
      const chosen = cookie(request, 'lang');
      const lang = LANGS.includes(chosen) ? chosen : pickLanguage(country, request.headers.get('Accept-Language'));
      if (lang !== 'en') {
        const page = url.pathname === '/' ? '' : url.pathname.slice(1).replace(/^index\.html$/, '');
        const to = new URL(`/${lang}/${page}${url.search}`, url);
        return secure(new Response(null, { status: 302, headers: { Location: to.href, 'Cache-Control': 'private, no-store', Vary: 'Cookie, Accept-Language' } }));
      }
    }

    // the files themselves; in a language's folder, its index for /fr/
    let res = await env.ASSETS.fetch(request);
    const type = res.headers.get('Content-Type') || '';
    if (type.includes('text/html') && /^[A-Z]{2}$/.test(country)) {
      const html = (await res.text()).replace(/<html lang="([^"]+)"/, `<html lang="$1" data-pays="${country}"`);
      const headers = new Headers(res.headers);
      headers.delete('Content-Length');
      headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
      res = new Response(html, { status: res.status, statusText: res.statusText, headers });
    }
    if (url.pathname === '/llms.txt') {
      res = new Response(res.body, res);
      res.headers.set('Content-Type', 'text/plain; charset=utf-8');
    }
    if (url.pathname.startsWith('/telechargements/')) {
      res = new Response(res.body, res);
      res.headers.set('Content-Disposition', 'attachment');
      res.headers.set('X-Robots-Tag', 'noindex');
    }
    return secure(res);
  },
};
