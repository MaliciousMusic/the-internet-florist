// collection.js: the copies left of each bouquet in a month's collection, for the line under its name (« Collection
// d'octobre 2026 · 73 sur 100 »). Public. A copy is taken once paid (bouquets), or held while its payment page is open
// (commandes "en_attente" not yet expired, lot C3).
//
//   GET /api/collection?mois=2026-10&produits=a,b,c   -> { mois, exemplaires, restants: { a: 100, b: 73, ... } }
import { json, erreur } from './outils.js';

export async function collection(req, env, now = Date.now()) {
  const url = new URL(req.url);
  const mois = url.searchParams.get('mois') || '';
  if (!/^\d{4}-\d{2}$/.test(mois)) return erreur('mois_invalide');
  const produits = (url.searchParams.get('produits') || '').split(',').filter((p) => /^[a-z0-9-]{1,60}$/.test(p)).slice(0, 60);
  const col = await env.DB.prepare('SELECT exemplaires FROM collections WHERE mois = ?').bind(mois).first();
  const base = col ? col.exemplaires : 100;
  const restants = {};
  for (const p of produits) {
    const propre = await env.DB.prepare('SELECT nombre FROM exemplaires WHERE produit = ? AND mois = ?').bind(p, mois).first();
    const total = propre ? propre.nombre : base;
    const pris = await env.DB.prepare(
      "SELECT (SELECT COUNT(*) FROM bouquets WHERE produit = ?1 AND mois = ?2 AND origine = 'achat') + (SELECT COUNT(*) FROM commandes WHERE produit = ?1 AND mois = ?2 AND etat = 'en_attente' AND expire > ?3) AS n",
    )
      .bind(p, mois, now)
      .first();
    restants[p] = { total, restants: Math.max(0, total - (pris ? pris.n : 0)) };
  }
  return json({ mois, exemplaires: base, restants }, 200, { 'cache-control': 'public, max-age=30' });
}
