// compte.js: the account (decor/COMPTE.md, owner 2026-10-27): a first name and a mobile number verified by a code sent by
// text message (the first name required for a new account), sessions for the site (a cookie) and for Belai Bureau (a bearer
// token, signed in once).
//
//   POST   /api/sms/demande   { numero, langue? }                 -> { ok, expire }          a code is sent
//   POST   /api/sms/verifie   { numero, code, prenom, client? }   -> { compte, jeton? }      signed in (account made if new;
//                                                                    without a first name, prenom_requis: the code holds)
//   GET    /api/moi                                               -> { compte, bouquets }    its bouquets, its credit
//   POST   /api/moi           { prenom }                          -> { compte }
//   POST   /api/deconnexion                                      -> { ok }
//   DELETE /api/moi                                               -> { ok }                  erased 30 days later
import { empreinte, chiffre, sha256, jeton, identifiant, codeChiffres, egal, numero, prenom, json, erreur, cookies } from './outils.js';
import { envoie } from './sms.js';

const MIN = 60 * 1000;
const H = 60 * MIN;
const J = 24 * H;
export const COOKIE = 'belai_session';
const CODE_VIE = 10 * MIN;
const ESSAIS = 5;
const SESSION = { site: 30 * J, bureau: 365 * J };
// how many texts: one a minute and five an hour for a number, ten an hour for an address
const LIMITES = [
  ['sms1', MIN, 1],
  ['sms60', H, 5],
];
const LIMITE_IP = [H, 10];

const MESSAGES = {
  fr: (c) => `Belai's Garden : votre code est ${c}. Il est valable 10 minutes. Ne le donnez à personne.`,
  en: (c) => `Belai's Garden: your code is ${c}. It is valid for 10 minutes. Do not share it.`,
  es: (c) => `Belai's Garden: tu código es ${c}. Es válido durante 10 minutos. No lo compartas.`,
  de: (c) => `Belai's Garden: Ihr Code lautet ${c}. Er ist 10 Minuten gültig. Geben Sie ihn nicht weiter.`,
  zh: (c) => `Belai's Garden：你的验证码是 ${c}，10 分钟内有效。请勿告诉他人。`,
};

function secrets(env) {
  if (!env.POIVRE || !env.CLE_NUMEROS) throw Object.assign(new Error('POIVRE ou CLE_NUMEROS manquant'), { config: true });
  return env;
}

// a counter in its window: true while under the limit (counts this one), false once over
async function compte1(db, cle, fenetre, max, now) {
  const row = await db.prepare('SELECT nombre, debut FROM limites WHERE cle = ?').bind(cle).first();
  if (!row || now - row.debut >= fenetre) {
    await db.prepare('INSERT INTO limites (cle, nombre, debut) VALUES (?, 1, ?) ON CONFLICT(cle) DO UPDATE SET nombre = 1, debut = excluded.debut').bind(cle, now).run();
    return { ok: true };
  }
  if (row.nombre >= max) return { ok: false, attendre: Math.ceil((row.debut + fenetre - now) / 1000) };
  await db.prepare('UPDATE limites SET nombre = nombre + 1 WHERE cle = ?').bind(cle).run();
  return { ok: true };
}

const lireJson = async (req) => {
  try {
    return await req.json();
  } catch (_) {
    return {};
  }
};
const vueCompte = (c) => ({ prenom: c.prenom || null, depuis: c.cree, cagnotte: c.cagnotte || 0 });
const J30 = 30 * 24 * 60 * 60 * 1000;
const ECHANGE = 24 * 60 * 60 * 1000;

export async function demande(req, env, now = Date.now()) {
  secrets(env);
  const corps = await lireJson(req);
  const n = numero(corps.numero, env.PAYS);
  if (!n) return erreur('numero_invalide');
  const fp = await empreinte(env.POIVRE, n);
  for (const [nom, fenetre, max] of LIMITES) {
    const r = await compte1(env.DB, `${nom}:${fp}`, fenetre, max, now);
    if (!r.ok) return erreur('trop_de_demandes', 429, { attendre: r.attendre });
  }
  const ip = req.headers.get('cf-connecting-ip') || '';
  if (ip) {
    const r = await compte1(env.DB, `ip:${await sha256(ip)}`, LIMITE_IP[0], LIMITE_IP[1], now);
    if (!r.ok) return erreur('trop_de_demandes', 429, { attendre: r.attendre });
  }
  const code = codeChiffres(6);
  const expire = now + CODE_VIE;
  await env.DB.prepare('INSERT INTO codes_sms (empreinte, code_hash, expire, essais) VALUES (?, ?, ?, 0) ON CONFLICT(empreinte) DO UPDATE SET code_hash = excluded.code_hash, expire = excluded.expire, essais = 0')
    .bind(fp, await sha256(`${fp}:${code}`), expire)
    .run();
  await envoie(env, n, (MESSAGES[corps.langue] || MESSAGES.fr)(code));
  return json({ ok: true, expire });
}

export async function verifie(req, env, now = Date.now()) {
  secrets(env);
  const corps = await lireJson(req);
  const n = numero(corps.numero, env.PAYS);
  if (!n) return erreur('numero_invalide');
  const client = corps.client === 'bureau' ? 'bureau' : 'site';
  const fp = await empreinte(env.POIVRE, n);
  const row = await env.DB.prepare('SELECT code_hash, expire, essais FROM codes_sms WHERE empreinte = ?').bind(fp).first();
  if (!row || row.expire <= now) return erreur('code_expire');
  if (row.essais >= ESSAIS) {
    await env.DB.prepare('DELETE FROM codes_sms WHERE empreinte = ?').bind(fp).run();
    return erreur('trop_d_essais', 429);
  }
  const code = String(corps.code || '').replace(/\D/g, '');
  if (!egal(await sha256(`${fp}:${code}`), row.code_hash)) {
    await env.DB.prepare('UPDATE codes_sms SET essais = essais + 1 WHERE empreinte = ?').bind(fp).run();
    return erreur('code_faux', 400, { reste: Math.max(0, ESSAIS - row.essais - 1) });
  }
  // the account: found by its fingerprint, made if new (a deletion asked for is cancelled by signing in again). A new one
  // needs a first name: without one the code is kept, to be sent again with it
  let c = await env.DB.prepare('SELECT * FROM comptes WHERE empreinte = ?').bind(fp).first();
  if (!c && !prenom(corps.prenom)) return erreur('prenom_requis');
  await env.DB.prepare('DELETE FROM codes_sms WHERE empreinte = ?').bind(fp).run();
  let nouveau = false;
  if (!c) {
    nouveau = true;
    c = { id: identifiant(), prenom: prenom(corps.prenom), cree: now };
    await env.DB.prepare('INSERT INTO comptes (id, empreinte, numero_chiffre, prenom, cree) VALUES (?, ?, ?, ?, ?)')
      .bind(c.id, fp, await chiffre(env.CLE_NUMEROS, n), c.prenom, now)
      .run();
  } else if (c.supprime) {
    await env.DB.prepare('UPDATE comptes SET supprime = NULL WHERE id = ?').bind(c.id).run();
  }

  const t = jeton();
  const expire = now + SESSION[client];
  await env.DB.prepare('INSERT INTO sessions (jeton_hash, compte, client, cree, expire) VALUES (?, ?, ?, ?, ?)').bind(await sha256(t), c.id, client, now, expire).run();
  const corpsOut = { compte: { ...vueCompte(c), nouveau } };
  if (client === 'bureau') return json({ ...corpsOut, jeton: t, expire });
  return json(corpsOut, 200, { 'set-cookie': cookie(t, SESSION.site / 1000) });
}

const cookie = (valeur, age) => `${COOKIE}=${valeur}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Lax`;

// the session behind a request: its cookie (the site) or its bearer token (Belai Bureau)
export async function session(req, env, now = Date.now()) {
  const auth = req.headers.get('authorization') || '';
  const t = auth.startsWith('Bearer ') ? auth.slice(7).trim() : cookies(req)[COOKIE];
  if (!t) return null;
  const h = await sha256(t);
  const s = await env.DB.prepare('SELECT s.jeton_hash, s.expire, c.* FROM sessions s JOIN comptes c ON c.id = s.compte WHERE s.jeton_hash = ?').bind(h).first();
  if (!s || s.expire <= now || s.supprime) return null;
  return { hash: h, compte: s };
}

export async function moi(req, env, now = Date.now()) {
  const s = await session(req, env, now);
  if (!s) return erreur('non_connecte', 401);
  if (req.method === 'POST') {
    const corps = await lireJson(req);
    const p = prenom(corps.prenom);
    if (!p) return erreur('prenom_invalide');
    await env.DB.prepare('UPDATE comptes SET prenom = ? WHERE id = ?').bind(p, s.compte.id).run();
    return json({ compte: vueCompte({ ...s.compte, prenom: p }) });
  }
  if (req.method === 'DELETE') {
    await env.DB.prepare('UPDATE comptes SET supprime = ? WHERE id = ?').bind(now, s.compte.id).run();
    await env.DB.prepare('DELETE FROM sessions WHERE compte = ?').bind(s.compte.id).run();
    return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });
  }
  // the bouquets it holds (not those given back or taken back), each with its fading and whether it may still be exchanged
  // (echange.js: within 24 hours, once, never offered)
  const { results } = await env.DB.prepare(
    `SELECT b.id, b.produit, b.mois, b.numero, b.achat, b.origine, b.fin, b.echange_de,
            (SELECT COUNT(*) FROM cadeaux k WHERE k.bouquet = b.id) AS offert
     FROM bouquets b WHERE b.compte = ? AND b.etat = 'actif' ORDER BY b.achat DESC`,
  )
    .bind(s.compte.id)
    .all();
  const bouquets = (results || []).map(({ offert, echange_de, ...b }) => ({
    ...b,
    fin: b.fin || b.achat + J30,
    echangeable: b.origine === 'achat' && !echange_de && !offert && now - b.achat < ECHANGE ? b.achat + ECHANGE : null,
  }));
  return json({ compte: vueCompte(s.compte), bouquets });
}

export async function deconnexion(req, env, now = Date.now()) {
  const s = await session(req, env, now);
  if (s) await env.DB.prepare('DELETE FROM sessions WHERE jeton_hash = ?').bind(s.hash).run();
  return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });
}

// once a day: expired codes, sessions and counters go; an account deleted 30 days ago is anonymised (its purchases are
// kept ten years for the accounts, without the number or the name)
export async function menage(env, now = Date.now()) {
  await env.DB.prepare('DELETE FROM codes_sms WHERE expire <= ?').bind(now).run();
  await env.DB.prepare('DELETE FROM sessions WHERE expire <= ?').bind(now).run();
  await env.DB.prepare('DELETE FROM limites WHERE debut <= ?').bind(now - 2 * H).run();
  await env.DB.prepare("UPDATE comptes SET empreinte = 'efface:' || id, numero_chiffre = '', prenom = NULL WHERE supprime IS NOT NULL AND supprime <= ? AND empreinte NOT LIKE 'efface:%'")
    .bind(now - 30 * J)
    .run();
}
