// achat.js: buying a bouquet (lot C3, decor/COMPTE.md): an order holds one copy of the month's series while its payment
// page is open (30 minutes), Stripe confirms the payment by a signed event, the bouquet is then added to the account with
// its copy number in the series.
//
//   POST /api/achat              { produit, renonce, texte, langue, retour } -> { commande, url }   (signed in)
//   GET  /api/commande/<id>                                                 -> the order, its bouquet once paid
//   POST /api/stripe/webhook     Stripe's events (checkout.session.completed / expired)
//   GET  /api/faux-stripe/<id>   the simulated payment page (env.PAIEMENT = "faux"); POST: pay or cancel
import { identifiant, json, erreur } from './outils.js';
import { session as stripeSession, evenement } from './stripe.js';
import { session as connecte } from './compte.js';
import { produit as produitDe } from './catalogue.js';
import { total } from './collection.js';

const MIN = 60 * 1000;
// Stripe keeps a Checkout session 30 minutes at least; a little more so it is always accepted
const TENUE = 31 * MIN;

const lireJson = async (req) => {
  try {
    return await req.json();
  } catch (_) {
    return {};
  }
};
const origines = (env) => (env.ORIGINES || '').split(',').map((s) => s.trim()).filter(Boolean);

export async function achat(req, env, now = Date.now()) {
  const s = await connecte(req, env, now);
  if (!s) return erreur('non_connecte', 401);
  const corps = await lireJson(req);
  const p = await produitDe(env, String(corps.produit || ''), now);
  if (!p) return erreur('produit_inconnu', 404);
  // the express request for immediate delivery and waiver of withdrawal (Code de la consommation L221-28, 13°)
  if (corps.renonce !== true || typeof corps.texte !== 'string' || corps.texte.length < 20) return erreur('renonciation_requise');
  // the page to come back to: one of the site's own
  let retour;
  try {
    retour = new URL(String(corps.retour || ''));
  } catch (_) {
    return erreur('retour_invalide');
  }
  if (!origines(env).includes(retour.origin)) return erreur('retour_invalide');
  retour.searchParams.delete('commande');
  retour.searchParams.delete('paiement');

  // the copy is held in one statement: two buyers of the last copy cannot both have it
  const id = identifiant();
  const expire = now + TENUE;
  const tot = await total(env, p.id, p.mois, p.exemplaires);
  const consent = JSON.stringify({ texte: corps.texte.slice(0, 600), le: new Date(now).toISOString() });
  const r = await env.DB.prepare(
    `INSERT INTO commandes (id, compte, produit, mois, centimes, etat, cree, expire, consentement, retour, langue)
     SELECT ?1, ?2, ?3, ?4, ?5, 'en_attente', ?6, ?7, ?8, ?9, ?10
     WHERE (SELECT COUNT(*) FROM bouquets WHERE produit = ?3 AND mois = ?4 AND origine = 'achat')
         + (SELECT COUNT(*) FROM commandes WHERE produit = ?3 AND mois = ?4 AND etat = 'en_attente' AND expire > ?6) < ?11`,
  )
    .bind(id, s.compte.id, p.id, p.mois, p.centimes, now, expire, consent, retour.href, String(corps.langue || 'fr').slice(0, 5), tot)
    .run();
  if (!r.meta || r.meta.changes !== 1) return erreur('epuise', 409);

  if ((env.PAIEMENT || 'faux') === 'faux') {
    const base = new URL(req.url).origin;
    return json({ commande: id, url: `${base}/api/faux-stripe/${id}` });
  }
  try {
    const st = await stripeSession(env, { commande: id, nom: p.nom, centimes: p.centimes, expire, retour: retour.href, langue: corps.langue });
    await env.DB.prepare('UPDATE commandes SET session_stripe = ? WHERE id = ?').bind(st.id, id).run();
    return json({ commande: id, url: st.url });
  } catch (err) {
    // the copy goes back at once
    await env.DB.prepare("UPDATE commandes SET etat = 'echec' WHERE id = ?").bind(id).run();
    throw err;
  }
}

// a payment confirmed: the order paid (once, whatever the number of events), the bouquet on the account with its number
export async function livre(env, id, reference, now = Date.now()) {
  const r = await env.DB.prepare("UPDATE commandes SET etat = 'payee', paye = ?, paiement = ? WHERE id = ? AND etat IN ('en_attente', 'expiree')").bind(now, reference, id).run();
  if (!r.meta || r.meta.changes !== 1) return false;
  const bid = identifiant();
  await env.DB.prepare(
    `INSERT INTO bouquets (id, compte, produit, mois, numero, achat, origine)
     SELECT ?1, c.compte, c.produit, c.mois,
            (SELECT COALESCE(MAX(numero), 0) + 1 FROM bouquets WHERE produit = c.produit AND mois = c.mois), ?2, 'achat'
     FROM commandes c WHERE c.id = ?3`,
  )
    .bind(bid, now, id)
    .run();
  await env.DB.prepare('UPDATE commandes SET bouquet = ? WHERE id = ?').bind(bid, id).run();
  return true;
}

export async function webhook(req, env, now = Date.now()) {
  const ev = await evenement(env, req, now);
  if (!ev) return erreur('signature', 400);
  const o = (ev.data && ev.data.object) || {};
  const id = (o.metadata && o.metadata.commande) || o.client_reference_id;
  if ((ev.type === 'checkout.session.completed' && o.payment_status === 'paid') || ev.type === 'checkout.session.async_payment_succeeded') {
    if (id) await livre(env, id, String(o.payment_intent || o.id), now);
  } else if (ev.type === 'checkout.session.expired' && id) {
    await env.DB.prepare("UPDATE commandes SET etat = 'expiree' WHERE id = ? AND etat = 'en_attente'").bind(id).run();
  }
  return json({ recu: true });
}

export async function commande(req, env, id, now = Date.now()) {
  const s = await connecte(req, env, now);
  if (!s) return erreur('non_connecte', 401);
  const c = await env.DB.prepare('SELECT * FROM commandes WHERE id = ? AND compte = ?').bind(id, s.compte.id).first();
  if (!c) return erreur('introuvable', 404);
  const b = c.bouquet ? await env.DB.prepare('SELECT id, numero, achat FROM bouquets WHERE id = ?').bind(c.bouquet).first() : null;
  const etat = c.etat === 'en_attente' && c.expire <= now ? 'expiree' : c.etat;
  return json({ id: c.id, etat, produit: c.produit, mois: c.mois, centimes: c.centimes, cree: c.cree, paye: c.paye, paiement: c.paiement, consentement: c.consentement ? JSON.parse(c.consentement) : null, bouquet: b });
}

// ---------- the simulated payment page (local work and tests, never online: env.PAIEMENT = "faux")
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export async function fauxStripe(req, env, id, now = Date.now()) {
  if ((env.PAIEMENT || 'faux') !== 'faux') return erreur('introuvable', 404);
  const c = await env.DB.prepare('SELECT * FROM commandes WHERE id = ?').bind(id).first();
  if (!c) return erreur('introuvable', 404);
  const retour = (etat) => {
    const u = new URL(c.retour);
    u.searchParams.set('commande', id);
    u.searchParams.set('paiement', etat);
    return u.href;
  };
  if (req.method === 'POST') {
    const f = await req.formData();
    if (f.get('action') === 'payer' && c.etat === 'en_attente' && c.expire > now) {
      await livre(env, id, `faux_${id}`, now);
      return Response.redirect(retour('ok'), 303);
    }
    await env.DB.prepare("UPDATE commandes SET etat = 'annulee' WHERE id = ? AND etat = 'en_attente'").bind(id).run();
    return Response.redirect(retour('annule'), 303);
  }
  const prix = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(c.centimes / 100);
  const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Paiement simulé</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:420px;margin:48px auto;padding:0 16px;color:#1d2420}
.n{background:#fff6dc;border:1px solid #e8cf7a;padding:10px 12px;border-radius:8px;font-size:14px}button{font:inherit;padding:10px 18px;border-radius:999px;border:1px solid #2f6b4f;margin:6px 6px 0 0}
.p{background:#2f6b4f;color:#fff}</style>
<p class="n">Paiement simulé : en ligne, cette page sera celle de Stripe. Aucune carte n'est demandée ici.</p>
<h1>${esc(c.produit)}</h1><p>${prix} · commande ${esc(id)}</p>
<form method="post"><button class="p" name="action" value="payer">Payer ${prix}</button><button name="action" value="annuler">Annuler</button></form></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}
