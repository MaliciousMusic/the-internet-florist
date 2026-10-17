// Vase review server: serves the atelier (the drawing modules) and the review page, keeps the review state (etat.json) and writes
// the correction requests (demandes/) that Claude reads; each request is also one line of boite.jsonl, which a session can watch.
//   node revue-vases/serveur.mjs   ->   http://127.0.0.1:8803/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readState, writeState, sheet, statusOf, STATE_FILE } from './state.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PORT = +(process.env.PORT || 8803);
const REQUESTS = path.join(HERE, 'demandes');
const INBOX = path.join(HERE, 'boite.jsonl');
// the annotated views of the send in progress, one request each (fifty views in one request passed the size limit)
const STAGED = path.join(REQUESTS, '_vues');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8' };

// the module order of the QA page (mkqa.sh is its source of truth), without the QA's own tail scripts
function modules() {
  const sh = fs.readFileSync(path.join(ROOT, 'mkqa.sh'), 'utf8');
  const line = sh.split('\n').find(l => l.includes(' cat ') && l.includes('v0.js'));
  const list = line.slice(line.indexOf(' cat ') + 5, line.indexOf('; echo'));
  const app = path.join(ROOT, 'app');
  const out = [];
  for (const m of list.matchAll(/\$\(ls ([^ )]+)[^)]*\)|(\S+)/g)) {
    if (m[1]) {
      const re = new RegExp('^' + m[1].replace(/[.]/g, '\\.').replace(/\*/g, '.*') + '$');
      for (const f of fs.readdirSync(app).filter(f => re.test(f)).sort()) out.push('/app/' + f);
    } else if (m[2].startsWith('../lab/')) continue;
    else if (m[2].startsWith('../')) out.push('/' + m[2].slice(3));
    else out.push('/app/' + m[2]);
  }
  return out;
}

// the engine is one script (its function declarations are hoisted across modules, as in mkqa.sh), rebuilt when a file changes
let built = null;
function page() {
  const files = modules().map(m => path.join(ROOT, m)).concat(path.join(HERE, 'revue.js'));
  const key = files.concat(path.join(HERE, 'page.html')).map(f => f + fs.statSync(f).mtimeMs).join('|');
  if (built && built.key === key) return built.html;
  const js = files.map(f => fs.readFileSync(f, 'utf8')).join('\n').replace(/<\/script/gi, '<\\/script');
  const html = fs.readFileSync(path.join(HERE, 'page.html'), 'utf8').replace('<!--MODULES-->', () => '<script>\n' + js + '\n</script>');
  built = { key, html };
  return html;
}

const readBody = req => new Promise((ok, ko) => {
  const b = []; let n = 0;
  req.on('data', c => { n += c.length; if (n > 60e6) { ko(new Error('too large')); req.destroy(); } else b.push(c); });
  req.on('end', () => { try { ok(b.length ? JSON.parse(Buffer.concat(b).toString('utf8')) : {}); } catch (e) { ko(e); } });
});
const json = (res, code, o) => { res.writeHead(code, { 'content-type': TYPES['.json'], 'cache-control': 'no-store' }); res.end(JSON.stringify(o)); };
const pct = x => String(Math.round(x * 100));
const cm = x => String(Math.round(x * 10) / 10).replace('.', ',');
const stamp = () => { const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`; };
const rel = f => path.relative(ROOT, f).replace(/\\/g, '/');

// one correction request (in French, for Claude): every vase with notes not yet sent or a new scale, and the validations since the last one
function send(body) {
  const s = readState();
  const ts = stamp(), dir = path.join(REQUESTS, ts);
  const blocks = [], ids = [], validated = [];
  for (const [id, f] of Object.entries(s.vases)) {
    const fresh = f.notes.filter(n => n.status === 'open');
    const scale = f.scale != null && !f.scaleSent;
    if (f.valid && !f.validSent) { validated.push(`${id} (v${f.valid.version})`); f.validSent = true; }
    if (!fresh.length && !scale) continue;
    const L = [`## ${id} — « ${f.name} » — version actuelle v${f.version}, à livrer en v${f.version + 1}`];
    if (scale) {
      const h0 = f.engineHeightCm, h1 = h0 != null ? h0 * f.scale / (f.engineScale || 1) : null;
      L.push(`- **Échelle** : ${f.engineScale || 1} → **${f.scale}**` + (h0 != null ? ` (hauteur ${cm(h0)} → ${cm(h1)} cm)` : '') +
        ' — à inscrire dans `VSC` (app/v1a.js) par `node revue-vases/version.mjs echelles`.');
      f.scaleSent = true;
    }
    for (const n of fresh) {
      const where = n.u != null ? ` — repère ${n.num} à ${pct(n.w)} % de la hauteur du vase, ${n.u < -0.04 ? 'à gauche' : n.u > 0.04 ? 'à droite' : 'au milieu'}` : '';
      L.push(`- **Note ${n.num}**${n.type ? ` [${n.type}]` : ''}${where} : ${(n.text || '').trim() || '(sans texte)'}`);
      n.status = 'sent'; n.sent = ts;
    }
    const staged = path.join(STAGED, id + '.png');
    if (fs.existsSync(staged)) {
      fs.mkdirSync(dir, { recursive: true });
      fs.renameSync(staged, path.join(dir, id + '.png'));
      L.push(`- Vue annotée : \`${rel(path.join(dir, id + '.png'))}\``);
    }
    blocks.push(L.join('\n'));
    ids.push(id);
  }
  if (!blocks.length && !validated.length) return null;
  const all = Object.values(s.vases), nValid = all.filter(f => statusOf(f) === 'valide').length;
  const msg = [`# Corrections des vases — envoi du ${ts.replace('_', ' à ').replace(/(\d\d)(\d\d)(\d\d)$/, '$1 h $2')}`, '',
    `Avancement : ${nValid} vases validés sur ${all.length}.`, '',
    'Pour chaque vase : corriger, puis `node revue-vases/version.mjs livrer <id> "<ce qui a changé>"` (version + 1, notes traitées, ' +
    'le vase revient « à revoir » dans la revue).', '',
    ...blocks.flatMap(b => [b, '']),
    ...(validated.length ? ['## Validés par le porteur', '', validated.map(v => '- ' + v).join('\n'), ''] : [])].join('\n');
  fs.mkdirSync(REQUESTS, { recursive: true });
  const file = path.join(REQUESTS, ts + '.md');
  fs.writeFileSync(file, msg);
  s.sends.push({ ts, vases: ids, validated });
  writeState(s);
  fs.appendFileSync(INBOX, JSON.stringify({ ts, fichier: rel(file), vases: ids, valides: validated }) + '\n');
  return { ts, message: msg, file: rel(file) };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = decodeURIComponent(url.pathname);
    if (p === '/') { res.writeHead(302, { location: '/revue-vases/' }); return res.end(); }
    if (p === '/revue-vases/' || p === '/revue-vases/index.html') {
      res.writeHead(200, { 'content-type': TYPES['.html'], 'cache-control': 'no-store' }); return res.end(page());
    }
    if (p === '/api/etat' && req.method === 'GET') return json(res, 200, readState());
    // the page declares the vases it found in the engine (name, engine scale and height): new ones get their sheet
    if (p === '/api/inventaire' && req.method === 'POST') {
      const { vases } = await readBody(req); const s = readState();
      for (const v of vases) { const f = sheet(s, v.id); f.name = v.name; f.engineScale = v.scale; f.engineHeightCm = v.heightCm;
        if (f.scale != null && Math.abs(f.scale - v.scale) < 1e-6) { f.scale = null; f.scaleSent = false; } }
      writeState(s); return json(res, 200, s);
    }
    const mv = p.match(/^\/api\/vase\/([\w-]+)$/);
    if (mv && req.method === 'PUT') {
      const o = await readBody(req); const s = readState(); const f = sheet(s, mv[1]);
      if ('scale' in o) { f.scale = o.scale == null || Math.abs(o.scale - (f.engineScale || 1)) < 1e-6 ? null : Math.round(o.scale * 1000) / 1000; f.scaleSent = false; }
      // the owner edits only the notes not yet sent; sent and treated ones stay as they were
      if ('notes' in o) f.notes = f.notes.filter(n => n.status !== 'open').concat(o.notes.filter(n => n.status === 'open').map(n => ({ ...n, v: f.version })));
      if ('reopen' in o) { const n = f.notes.find(n => n.num === o.reopen); if (n) { n.status = 'open'; n.v = f.version; delete n.sent; delete n.doneIn; } }
      if ('valid' in o) { f.valid = o.valid ? { version: f.version, date: new Date().toISOString() } : null; f.validSent = false; }
      writeState(s); return json(res, 200, { sheet: f, status: statusOf(f) });
    }
    // a working view saved for Claude (never part of the review state): _apercus/<name>.png
    if (p === '/api/apercu' && req.method === 'POST') {
      const { name, png } = await readBody(req);
      if (!/^[\w-]+$/.test(name || '') || typeof png !== 'string' || !png.startsWith('data:image/png;base64,')) return json(res, 400, { error: 'name/png' });
      const dir = path.join(HERE, '_apercus'); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, name + '.png'), Buffer.from(png.slice(22), 'base64'));
      return json(res, 200, { file: rel(path.join(dir, name + '.png')) });
    }
    if (p === '/api/vue' && req.method === 'POST') {
      const { id, png } = await readBody(req);
      if (!/^[\w-]+$/.test(id || '') || typeof png !== 'string' || !png.startsWith('data:image/png;base64,')) return json(res, 400, { error: 'id/png' });
      fs.mkdirSync(STAGED, { recursive: true });
      fs.writeFileSync(path.join(STAGED, id + '.png'), Buffer.from(png.slice(22), 'base64'));
      return json(res, 200, { ok: true });
    }
    if (p === '/api/envoyer' && req.method === 'POST') {
      const r = send(await readBody(req));
      return json(res, 200, r || { empty: true });
    }
    // static files of the atelier
    const file = path.resolve(ROOT, '.' + p);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end('introuvable'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch (e) { json(res, 500, { error: String(e && e.message || e) }); }
});
server.listen(PORT, '127.0.0.1', () => console.log(`revue des vases : http://127.0.0.1:${PORT}/  (état : ${rel(STATE_FILE)})`));
