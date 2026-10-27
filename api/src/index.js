// index.js: the shop's account and gift server (decor/COMPTE.md), a Cloudflare Worker. It answers the site's pages,
// which are served elsewhere (GitHub Pages today), with their cookie when they come from env.ORIGINES; and Belai Bureau,
// with a bearer token. Lot C2: the account; lot C3: the purchase and the copies; lot C9: the invoices, the exchange within
// 24 hours and the account's credit. Lots C4, C5 add the gifts.
import { demande, verifie, moi, deconnexion, menage } from './compte.js';
import { collection } from './collection.js';
import { achat, commande, webhook, fauxStripe, menageCommandes } from './achat.js';
import { echange } from './echange.js';
import { factures, facture } from './factures.js';
import { erreur } from './outils.js';

const ROUTES = {
  'POST /api/sms/demande': demande,
  'POST /api/sms/verifie': verifie,
  'GET /api/moi': moi,
  'POST /api/moi': moi,
  'DELETE /api/moi': moi,
  'POST /api/deconnexion': deconnexion,
  'GET /api/collection': collection,
  'POST /api/achat': achat,
  'POST /api/stripe/webhook': webhook,
  'POST /api/echange': echange,
  'GET /api/factures': factures,
};
// routes with an identifier in their path
const AVEC_ID = [
  [/^GET \/api\/commande\/([\w-]{8,40})$/, commande],
  [/^(?:GET|POST) \/api\/faux-stripe\/([\w-]{8,40})$/, fauxStripe],
  [/^GET \/api\/facture\/(\d{1,9})$/, facture],
];
function route(cle) {
  if (ROUTES[cle]) return ROUTES[cle];
  for (const [re, fn] of AVEC_ID) {
    const m = re.exec(cle);
    if (m) return (req, env) => fn(req, env, m[1]);
  }
  return null;
}

// the site's origins may call with their cookie; anyone else gets no CORS headers (Belai Bureau is not a browser page)
function cors(req, env) {
  const o = req.headers.get('origin');
  const ok = o && (env.ORIGINES || '').split(',').map((s) => s.trim()).includes(o);
  return ok
    ? {
        'access-control-allow-origin': o,
        'access-control-allow-credentials': 'true',
        'access-control-allow-headers': 'content-type, authorization',
        'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
        'access-control-max-age': '600',
        vary: 'origin',
      }
    : {};
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const h = cors(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    const fn = route(`${req.method} ${url.pathname}`);
    let res;
    try {
      res = fn ? await fn(req, env) : erreur('introuvable', 404);
    } catch (err) {
      console.error('[api]', err);
      res = erreur(err.config ? 'configuration' : 'serveur', 500);
    }
    for (const [k, v] of Object.entries(h)) res.headers.set(k, v);
    return res;
  },
  async scheduled(_ev, env) {
    await menage(env);
    await menageCommandes(env);
  },
};
