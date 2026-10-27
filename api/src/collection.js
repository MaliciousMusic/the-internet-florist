// collection.js: the copies left of each bouquet in a month's collection, for the line under its name (« Collection
// d'octobre 2026 · 73 sur 100 »). Public. A copy is taken once paid (bouquets), or held while its payment page is open
// (commandes "en_attente" not yet expired, achat.js).
//
//   GET /api/collection?mois=2026-10&produits=a,b,c   -> { mois, restants: { a: { total, restants }, ... } }
import { json, erreur } from './outils.js';
import { catalogue } from './catalogue.js';

// the copies of a bouquet in a month: set for it in the database, else for the month, else the catalogue's (boutique.json)
export async function total(env, produit, mois, defaut = 100) {
  const propre = await env.DB.prepare('SELECT nombre FROM exemplaires WHERE produit = ? AND mois = ?').bind(produit, mois).first();
  if (propre) return propre.nombre;
  const col = await env.DB.prepare('SELECT exemplaires FROM collections WHERE mois = ?').bind(mois).first();
  return col ? col.exemplaires : defaut;
}

export async function collection(req, env, now = Date.now()) {
  const url = new URL(req.url);
  const mois = url.searchParams.get('mois') || '';
  if (!/^\d{4}-\d{2}$/.test(mois)) return erreur('mois_invalide');
  const produits = (url.searchParams.get('produits') || '').split(',').filter((p) => /^[a-z0-9-]{1,60}$/.test(p)).slice(0, 60);
  let C = null;
  try {
    C = await catalogue(env, now);
  } catch (_) {}
  const restants = {};
  for (const p of produits) {
    const fiche = C && (C.produits || []).find((x) => x.id === p);
    const tot = await total(env, p, mois, (fiche && fiche.exemplaires) || (C && C.collection && C.collection.exemplaires) || 100);
    const pris = await env.DB.prepare(
      "SELECT (SELECT COUNT(*) FROM bouquets WHERE produit = ?1 AND mois = ?2 AND origine = 'achat') + (SELECT COUNT(*) FROM commandes WHERE produit = ?1 AND mois = ?2 AND etat = 'en_attente' AND expire > ?3) AS n",
    )
      .bind(p, mois, now)
      .first();
    restants[p] = { total: tot, restants: Math.max(0, tot - (pris ? pris.n : 0)) };
  }
  return json({ mois, restants }, 200, { 'cache-control': 'public, max-age=30' });
}
