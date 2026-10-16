// worker-test.mjs: checks _worker.js without Cloudflare (node decor/scene/worker-test.mjs): the language picked from the
// country, the redirects, the cookie, the bots, the country written on <html>, the security headers.
import assert from 'node:assert/strict';
import worker, { pickLanguage } from './_worker.js';

// the files of the site, as Cloudflare Pages would serve them
const env = {
  ASSETS: {
    fetch: async (req) => {
      const path = new URL(req.url).pathname;
      if (path.endsWith('.txt')) return new Response('# llms', { headers: { 'Content-Type': 'text/plain' } });
      return new Response('<!doctype html>\n<html lang="fr">\n<head></head></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    },
  },
};
async function get(path, { country = '', lang = '', cookie = '', ua = 'Mozilla/5.0 (Windows NT 10.0)' } = {}) {
  const req = new Request(`https://belai.garden${path}`, { headers: { 'Accept-Language': lang, Cookie: cookie, 'User-Agent': ua } });
  Object.defineProperty(req, 'cf', { value: { country } });
  return worker.fetch(req, env);
}

// the language of a country, and of the countries of several languages
assert.equal(pickLanguage('FR', 'en-US'), 'fr');
assert.equal(pickLanguage('MX', ''), 'es');
assert.equal(pickLanguage('TW', ''), 'zh');
assert.equal(pickLanguage('AT', ''), 'de');
assert.equal(pickLanguage('US', 'en-US,en;q=0.9'), 'en');
assert.equal(pickLanguage('CH', 'fr-CH,fr;q=0.9,en;q=0.5'), 'fr');
assert.equal(pickLanguage('CH', 'it-CH'), 'de');
assert.equal(pickLanguage('BE', 'nl-BE,de;q=0.8'), 'de');
assert.equal(pickLanguage('CA', 'fr-CA'), 'fr');
assert.equal(pickLanguage('JP', 'ja,zh-CN;q=0.8'), 'zh');
assert.equal(pickLanguage('JP', 'ja'), 'en');
assert.equal(pickLanguage('', ''), 'en');

// a visitor from France on the English shop: to /fr/, the query kept
let r = await get('/?b=ronde-bleue', { country: 'FR' });
assert.equal(r.status, 302);
assert.equal(r.headers.get('Location'), 'https://belai.garden/fr/?b=ronde-bleue');
r = await get('/legal.html', { country: 'DE' });
assert.equal(r.headers.get('Location'), 'https://belai.garden/de/legal.html');
r = await get('/desktop', { country: 'CN' });
assert.equal(r.headers.get('Location'), 'https://belai.garden/zh/desktop');
// a language chosen by hand wins, English included
r = await get('/about.html', { country: 'FR', cookie: 'lang=en' });
assert.equal(r.status, 200);
r = await get('/about.html', { country: 'US', cookie: 'theme=x; lang=es' });
assert.equal(r.headers.get('Location'), 'https://belai.garden/es/about.html');
// a page asked for in a language is never moved; nor are the files, nor the bots
assert.equal((await get('/fr/about.html', { country: 'US', cookie: 'lang=en' })).status, 200);
assert.equal((await get('/boutique.json', { country: 'FR' })).status, 200);
assert.equal((await get('/', { country: 'FR', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1)' })).status, 200);
assert.equal((await get('/', { country: 'FR', ua: 'Mozilla/5.0 ClaudeBot/1.0' })).status, 200);

// the country on <html>, the security headers
r = await get('/fr/', { country: 'FR' });
const html = await r.text();
assert.match(html, /<html lang="fr" data-pays="FR">/);
assert.match(r.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
assert.equal(r.headers.get('X-Content-Type-Options'), 'nosniff');
assert.equal((await get('/llms.txt')).headers.get('Content-Type'), 'text/plain; charset=utf-8');
console.log('worker-test.mjs: all good');
