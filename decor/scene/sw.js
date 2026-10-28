// sw.js: the shop's service worker (owner, 2026-10-28: the second visit, which the month's bouquets bring back, comes from
// the device). Registered by the home page's head (build.mjs ENTREE) once the page has loaded; never on localhost unless
// ?sw=oui; ?sw=non unregisters it. Same-origin GET requests only (the shop's server, Stripe and the rest go by):
//   - a file whose address carries a digest of its content (?v=): from the cache, else fetched and kept for good (an older
//     version of the same file is dropped then): the pictures, sprites, atlases, the landing's picture, the styles;
//   - the pages, the data and the scripts without a digest (boutique.json, frise.json, amorce.json, frise.js's modules):
//     from the network, the cache when it does not answer within 3 s (or offline);
//   - the rest (fonts, the KTX2 transcoder, the insects' atlases): from the cache at once, refreshed behind;
//   - sounds and videos are left to the browser (ranges, sizes).
const CACHE = 'belai-boutique-1';
const MEDIA = /\.(mp4|webm|m4a|mp3|ogg|wav)$/i;
const FRESH = /\.(html?|json|m?js|css|txt|xml)$/i;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) =>
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
      await self.clients.claim();
    })(),
  ),
);

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || MEDIA.test(u.pathname) || u.pathname.endsWith('/sw.js')) return;
  if (u.searchParams.has('v')) e.respondWith(kept(r, u));
  else if (r.mode === 'navigate' || FRESH.test(u.pathname) || u.pathname.endsWith('/')) e.respondWith(fresh(r));
  else e.respondWith(soon(e, r));
});

const store = async (r, res) => {
  if (res && res.ok && res.type === 'basic') await (await caches.open(CACHE)).put(r, res.clone());
  return res;
};

async function kept(r, u) {
  const c = await caches.open(CACHE);
  const hit = await c.match(r);
  if (hit) return hit;
  const res = await fetch(r);
  if (res.ok) {
    // one version a file: the others of the same path go
    for (const k of await c.keys()) {
      const ku = new URL(k.url);
      if (ku.pathname === u.pathname && ku.search !== u.search) await c.delete(k);
    }
    await c.put(r, res.clone());
  }
  return res;
}

async function fresh(r) {
  const net = fetch(r).then((res) => store(r, res));
  const late = new Promise((ok) => setTimeout(ok, 3000));
  try {
    const res = await Promise.race([net, late]);
    if (res) return res;
  } catch (_) {}
  const hit = await caches.match(r);
  return hit || net;
}

async function soon(e, r) {
  const hit = await caches.match(r);
  const net = fetch(r).then((res) => store(r, res));
  if (hit) {
    e.waitUntil(net.catch(() => {}));
    return hit;
  }
  return net;
}
