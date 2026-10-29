// rosee_planche.mjs: the morning dew's sheet (lot C1, decor/CYCLE.md): each bouquet drawn as the shop draws it, at several amounts of dew
// (DEW_SET, app/y3-rosee.js), whole and in a vector close-up on its wettest place; one PNG row per bouquet, plus the numbers.
//
//   sh decor/scene/mkengine.sh            (engine.js from demo/src)
//   GATE_MAX=2 sh ws/gate.sh node decor/rosee_planche.mjs [ids...] [--rosee 1,0.5,0] [--cell 760] [--zoom .2] [--sortie <dir>]
//
// One Chrome, its own throwaway profile and port, closed at the end whatever happens; refuses to start under 3.5 GB of free memory.
// Its own static server serves decor/scene (port RS_PORT, 8874 by default). Rows are written to --sortie (default: TEMP/rosee).
import { spawn } from 'node:child_process';
import { freemem } from 'node:os';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = join(dirname(fileURLToPath(import.meta.url)), 'scene');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const CDP_PORT = Number(process.env.RS_CDP || 9371);
const HTTP_PORT = Number(process.env.RS_PORT || 8874);
const PROFILE = join(process.env.TEMP || '.', 'rosee-chrome');
const argv = process.argv.slice(2);
const argOf = (k, d) => {
  const i = argv.indexOf(k);
  if (i < 0) return d;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const LEVELS = argOf('--rosee', '1,0.5,0').split(',').map(Number);
const CELL = Number(argOf('--cell', 760));
const ZOOM = Number(argOf('--zoom', 0.2));
// --k: the drops' size scale (DEW_K, 1 = real size); --nom: suffix of the rows' files
const KDEW = Number(argOf('--k', 1));
const SUFFIX = argOf('--nom', '');
// --fenetre cx,cy: the close-up's centre in the drawing's units (default: the wettest place)
const WIN = argOf('--fenetre', '');
const OUT = resolve(argOf('--sortie', join(process.env.TEMP || '.', 'rosee')));
const WANT = argv.filter((a) => !a.startsWith('--'));
const IDS = WANT.length ? WANT : ['printemps-a-la-carpe', 'citrine', 'ronde-bleue', 'neige-de-mars'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 3.5 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 3,5 Go : pas de Chrome`);
  process.exit(2);
}
if (!existsSync(join(HERE, 'engine.js'))) {
  console.error('engine.js absent : sh decor/scene/mkengine.sh');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

// ---------- the page: the shop's drawing (predessin.mjs draw(), unchanged) at each amount of dew, then a close-up clone of each
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#e9e4dc;font:600 15px system-ui;color:#2a2020}
.row{display:flex;gap:6px;padding:6px}
.cell{position:relative;width:${CELL}px;height:${Math.round(CELL * 1.25)}px;background:radial-gradient(ellipse 85% 70% at 50% 38%,#f6f1ea,#efe8de 78%);overflow:hidden}
.cell svg{position:absolute;inset:0;width:100%;height:100%}
.cell b{position:absolute;left:8px;top:6px;background:#fff9;padding:1px 6px;z-index:2}
</style></head><body><script src="engine.js"></script><script src="__rosee.js"></script></body></html>`;
const SCRIPT = `(async () => {
  const NS = 'http://www.w3.org/2000/svg', Q = new URLSearchParams(location.search), LV = Q.get('dew').split(',').map(Number), ZM = +Q.get('zoom');
  DEW_K = +Q.get('k') || 1;
  const cfg = await fetch('boutique.json').then((r) => r.json()), p = cfg.produits.find((x) => x.id === Q.get('p'));
  CAST_S = cfg.scene.bronzeS || 3;
  for (const v of VZ0) if (v.cast) for (const s of [6, 2.5]) if (s !== CAST_S) CAST_JOBS[v.id + '|' + s] = Promise.resolve(null);
  const vz = VZ[p.vase]; if (vz && vz.cast && vz.prof) await castRequest(vz, profSamples(vz.prof, 90), CAST_S);
  function draw(svg) {
    const L0 = LOD; LOD = 0; const v = VZ[p.vase], keep = v ? { st: v.st, sf: v.sf } : null; if (v) { v.st = null; v.sf = 'none'; }
    DEPTH_BG = cfg.scene.fondProfondeur || DEPTH_BG; let c = null;
    try { renderStatic(() => {
      if (p.recette) { const ids = p.recette.map((r) => r[0]).filter((id) => PBY[id]);
        PLANOPT = { qty: new Map(p.recette.map((r) => [r[0], r[1]])), pos: new Map(p.recette.map((r) => [r[0], r[2]])), noAdds: true };
        c = buildBq(svg, ids, p.graine, p.vase, 0, 'juste', null);
      } else { const m = MODELS.find((x) => x.n === p.modele); c = buildBq(svg, [], p.graine, p.vase, 0, null, m); } });
    } finally { PLANOPT = null; DEPTH_BG = '#efe8de'; LOD = L0; if (typeof idle !== 'undefined') idle.length = 0; if (v) Object.assign(v, keep); }
    for (const q of svg.querySelectorAll('[data-l=vback] path[fill^="url(#vs"], [data-svgb="s"]')) q.setAttribute('display', 'none');
    return c;
  }
  const row = document.createElement('div'); row.className = 'row'; document.body.append(row);
  const cells = [], stats = [];
  for (const dew of LV) {
    const cell = document.createElement('div'); cell.className = 'cell'; row.append(cell);
    const svg = document.createElementNS(NS, 'svg'); cell.append(svg);
    DEW_SET = dew; const n0 = typeof DEW_N !== 'undefined' ? DEW_N : 0, t0 = performance.now(); let cq = null; try { cq = draw(svg); } finally { DEW_SET = null; }
    const painted = (typeof DEW_N !== 'undefined' ? DEW_N : 0) - n0;
    const ms = performance.now() - t0;
    const gs = [...svg.querySelectorAll('g[data-dew]')], drops = gs.reduce((s, g) => s + +g.getAttribute('data-dew'), 0);
    const els = gs.reduce((s, g) => s + g.querySelectorAll('*').length, 0), kb = gs.reduce((s, g) => s + new XMLSerializer().serializeToString(g).length, 0) / 1024;
    const leafDrops = gs.filter((g) => g.getAttribute('data-dewk') === 'f').reduce((s, g) => s + +g.getAttribute('data-dew'), 0);
    const xs = new XMLSerializer().serializeToString(svg);let hh = 2166136261;for (let q = 0; q < xs.length; q++) { hh ^= xs.charCodeAt(q); hh = Math.imul(hh, 16777619); }
    const byLayer = {};for (const g of gs) { const l = g.closest('[data-l]'), k = (l ? l.getAttribute('data-l') : '?') + (g.closest('[data-in]') ? '/in' : ''); byLayer[k] = (byLayer[k] || 0) + +g.getAttribute('data-dew'); }
    const sidOf = (n) => { const e = n && n.closest('[data-o]'), o = e && cq && cq.list ? cq.list[+e.getAttribute('data-o')] : null; return o && o.it && o.it.p ? o.it.p.sid : '?'; };
    const bySid = {};for (const o of (cq && cq.list) || []) if (o.it && o.it.p && o.kind !== 'garnish') bySid[o.it.p.sid] = bySid[o.it.p.sid] || 0;
    for (const g of gs) { const k = sidOf(g); bySid[k] = (bySid[k] || 0) + +g.getAttribute('data-dew'); }
    stats.push({ dew, painted, bySid, byLayer, hash: (hh >>> 0).toString(16) + '/' + xs.length, drops, leafDrops, faces: gs.length, dewEls: els, dewKB: Math.round(kb), allEls: svg.querySelectorAll('*').length, ms: Math.round(ms) });
    const b = document.createElement('b'); b.textContent = p.nom + ' · rosée ' + dew; cell.append(b); cells.push({ cell, svg, dew, gs });
  }
  /* the close-up: the wettest place of the first drawing (each drop's sparkle, the last path of its face, counted on a grid), the same
     window for every amount */
  const A = cells[0], vb = A.svg.viewBox.baseVal, n = 12, grid = new Float64Array(n * n), pts = [];
  for (const g of A.gs) { const sp = g.lastElementChild, M = A.svg.getScreenCTM().inverse().multiply(sp.getScreenCTM()), d = sp.getAttribute('d') || '';
    for (const m of d.matchAll(/M(-?[0-9.]+)[ ,](-?[0-9.]+)/g)) { const pt = new DOMPoint(+m[1], +m[2]).matrixTransform(M), k = 1;
      const i = Math.max(0, Math.min(n - 1, Math.floor((pt.x - vb.x) / vb.width * n))), j = Math.max(0, Math.min(n - 1, Math.floor((pt.y - vb.y) / vb.height * n)));
      grid[j * n + i] += k; pts.push([pt.x, pt.y, k, j * n + i]); } }
  let best = 0; for (let q = 1; q < n * n; q++) if (grid[q] > grid[best]) best = q;
  let sx = 0, sy = 0, sw = 0; for (const [x, y, k, q] of pts) if (q === best) { sx += x * k; sy += y * k; sw += k; }
  const zw = vb.width * ZM, zh = zw * 1.25, W0 = (Q.get('win') || '').split(',').map(Number), cx = W0.length === 2 ? W0[0] : sw ? sx / sw : vb.x + vb.width / 2, cy = W0.length === 2 ? W0[1] : sw ? sy / sw : vb.y + vb.height / 2;
  for (const c of cells) {
    const cell = document.createElement('div'); cell.className = 'cell'; row.append(cell);
    const z = c.svg.cloneNode(true); z.setAttribute('viewBox', [cx - zw / 2, cy - zh / 2, zw, zh].map((x) => Math.round(x * 10) / 10).join(' ')); cell.append(z);
    const b = document.createElement('b'); b.textContent = 'gros plan ×' + Math.round(vb.width / zw * 10) / 10 + ' · rosée ' + c.dew; cell.append(b);
  }
  window.RS = { dbg: { vb: [vb.x, vb.y, vb.width, vb.height], n: pts.length, best, cnt: grid[best], some: pts.slice(0, 4).map((q) => q.slice(0, 2).map(Math.round)) }, stats, zoom: [cx, cy, zw, zh].map((x) => Math.round(x)), w: row.scrollWidth, h: row.scrollHeight };
})().catch((e) => { window.RS = { err: String(e && e.stack || e) }; });`;

// ---------- the small static server
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path === '/__rosee.html') return res.writeHead(200, { 'content-type': 'text/html' }), res.end(PAGE);
  if (path === '/__rosee.js') return res.writeHead(200, { 'content-type': 'text/javascript' }), res.end(SCRIPT);
  const file = resolve(HERE, '.' + path);
  if (!file.startsWith(HERE) || !existsSync(file) || statSync(file).isDirectory()) return res.writeHead(404), res.end();
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(HTTP_PORT, '127.0.0.1', r));

// ---------- one headless Chrome through the DevTools protocol (as predessin.mjs)
mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${PROFILE}`, '--window-size=1600,1200', 'about:blank'], { stdio: 'ignore' });
let exited = false;
chrome.on('exit', () => (exited = true));
let ws, seq = 0;
const wait = new Map();
const send = (method, params = {}) => { const i = ++seq; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((res, rej) => wait.set(i, { res, rej, method })); };
async function connect() {
  for (let k = 0; k < 80; k++) {
    try {
      const page = (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((r) => r.json())).find((t) => t.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
        ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { const w = wait.get(m.id); wait.delete(m.id); m.error ? w.rej(new Error(`${w.method}: ${m.error.message}`)) : w.res(m.result); } };
        return;
      }
    } catch (_) {}
    await sleep(250);
  }
  throw new Error('Chrome ne répond pas');
}
async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
async function closeChrome() {
  try {
    const v = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`).then((r) => r.json());
    const b = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((res) => (b.onopen = res));
    b.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
  } catch (_) {}
  for (let k = 0; k < 40 && !exited; k++) await sleep(100);
  if (!exited) chrome.kill();
}

const report = {};
try {
  await connect();
  await send('Page.enable');
  for (const id of IDS) {
    const w = (CELL + 6) * LEVELS.length * 2 + 6, h = Math.round(CELL * 1.25) + 12;
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/__rosee.html?p=${encodeURIComponent(id)}&dew=${LEVELS.join(',')}&zoom=${ZOOM}&k=${KDEW}&win=${WIN}` });
    const t0 = Date.now();
    let rs = null;
    while (Date.now() - t0 < 240000) { await sleep(500); try { rs = await evaluate('window.RS || null'); } catch (_) {} if (rs) break; }
    if (!rs || rs.err) { console.log(id, 'ERREUR', rs ? rs.err : 'délai'); report[id] = rs; continue; }
    await evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 400))))');
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
    writeFileSync(join(OUT, `rosee-${id}${SUFFIX}.png`), Buffer.from(shot.data, 'base64'));
    report[id] = rs;
    console.log(id, JSON.stringify(rs.stats), 'gros plan', rs.zoom.join(' '), JSON.stringify(rs.dbg || {}));
  }
} finally {
  await closeChrome();
  server.close();
  writeFileSync(join(OUT, `rosee${SUFFIX}.json`), JSON.stringify(report, null, 1));
  console.log('sortie', OUT);
}
