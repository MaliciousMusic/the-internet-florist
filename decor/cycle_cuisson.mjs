// cycle_cuisson.mjs: bakes the accelerated cycle of a bouquet (lot C2, decor/CYCLE.md): 30 days in 30 s, drawn by the engine frame by frame
// (its continuous life LIFE.cont, the morning dew DEW_SET), whole and still, the view starting close on the wettest place and pulling back,
// then encoded as one stacked-alpha MP4 (colour premultiplied on top, alpha as grey below) that every browser plays.
//
//   sh decor/scene/mkengine.sh            (engine.js from demo/src)
//   GATE_MAX=2 sh ws/gate.sh node decor/cycle_cuisson.mjs <id> [--fps 24] [--h 960] [--de 0] [--a 720] [--pas 1] [--sortie <dir>]
//       [--images-seules] [--crf 24]
//
// Frames are PNG (transparent) in <sortie>/<id>/f0000.png...; a frame that draws the same as the one before
// is copied, not drawn (the faded hold). Then <sortie>/<id>/cycle.mp4 and cycle.json (the time map, the box, the sizes). One Chrome, its own profile and port,
// closed whatever happens; refuses to start under 3.5 GB of free memory. Its own static server serves decor/scene (port CC_PORT, 8875).
import { spawn, spawnSync } from 'node:child_process';
import { freemem } from 'node:os';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync, copyFileSync } from 'node:fs';
import { dirname, join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = join(dirname(fileURLToPath(import.meta.url)), 'scene');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const CDP_PORT = Number(process.env.CC_CDP || 9372);
const HTTP_PORT = Number(process.env.CC_PORT || 8875);
const PROFILE = join(process.env.TEMP || '.', 'cycle-chrome');
const argv = process.argv.slice(2);
const argOf = (k, d) => {
  const i = argv.indexOf(k);
  if (i < 0) return d;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
const FPS = Number(argOf('--fps', 24));
const HPX = Number(argOf('--h', 960));
const PAS = Number(argOf('--pas', 1));
const CRF = Number(argOf('--crf', 24));
const OUT0 = resolve(argOf('--sortie', join(process.env.TEMP || '.', 'cycle')));
const DUR = 30;
const N = DUR * FPS;
const DE = Number(argOf('--de', 0));
const A = Number(argOf('--a', N));
const ONLY_FRAMES = argv.includes('--images-seules');
const ID = argv.filter((a) => !a.startsWith('--'))[0];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!ID) {
  console.error('usage : node decor/cycle_cuisson.mjs <id du bouquet> [options]');
  process.exit(2);
}
if (freemem() < 3.5 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 3,5 Go : pas de Chrome`);
  process.exit(2);
}
const OUT = join(OUT0, ID);
mkdirSync(OUT, { recursive: true });

// ---------- the time map (decor/CYCLE.md, owner 2026-10-29: a slow first morning, bloom and decline quick, the fading slowed at the end)
// keys [cycle seconds, bouquet age in days]; linear between them, the last stretch eased out
const KEYS = [[0, 3], [3, 3.25], [11, 20], [18, 30], [29, 60], [30, 60]];
const ZOOM = { hold: 0.8, end: 4, w: 0.2 }; // close on the wettest place until 0.8 s, back to the whole bouquet by 4 s; the window 0.2 of its width
const PAGE_MAP = `{const K=${JSON.stringify(KEYS)};window.CC_AGE=t=>{for(let i=1;i<K.length;i++)if(t<=K[i][0]){const[a0,b0]=K[i-1],[a1,b1]=K[i],s=(t-a0)/((a1-a0)||1);
  return b0+(b1-b0)*(i===4?1-(1-s)*(1-s):s)}return K[K.length-1][1]}}`;

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:transparent}
#h{position:absolute;left:0;top:0}#h svg{position:absolute;inset:0;width:100%;height:100%;display:block}</style></head>
<body><div id="h"></div><script src="engine.js"></script><script src="__cc.js"></script></body></html>`;
const SCRIPT = `${PAGE_MAP}
(async () => {
  const NS = 'http://www.w3.org/2000/svg', Q = new URLSearchParams(location.search), HPX = +Q.get('h');
  const cfg = await fetch('boutique.json').then((r) => r.json()), p = cfg.produits.find((x) => x.id === Q.get('p'));
  CAST_S = cfg.scene.bronzeS || 3;
  for (const v of VZ0) if (v.cast) for (const s of [6, 2.5]) if (s !== CAST_S) CAST_JOBS[v.id + '|' + s] = Promise.resolve(null);
  const vz = VZ[p.vase]; if (vz && vz.cast && vz.prof) await castRequest(vz, profSamples(vz.prof, 90), CAST_S);
  const host = document.getElementById('h');
  /* the shop's drawing (predessin.mjs draw(), unchanged), at a life and an amount of dew */
  function draw(svg, life, dew) {
    const L0 = LOD; LOD = 0; const v = VZ[p.vase], keep = v ? { st: v.st, sf: v.sf } : null; if (v) { v.st = null; v.sf = 'none'; }
    DEPTH_BG = cfg.scene.fondProfondeur || DEPTH_BG; LIFE = life; DEW_SET = dew; let c = null;
    try { renderStatic(() => {
      if (p.recette) { const ids = p.recette.map((r) => r[0]).filter((id) => PBY[id]);
        PLANOPT = { qty: new Map(p.recette.map((r) => [r[0], r[1]])), pos: new Map(p.recette.map((r) => [r[0], r[2]])), noAdds: true };
        c = buildBq(svg, ids, p.graine, p.vase, 0, 'juste', null);
      } else { const m = MODELS.find((x) => x.n === p.modele); c = buildBq(svg, [], p.graine, p.vase, 0, null, m); } });
    } finally { PLANOPT = null; DEPTH_BG = '#efe8de'; LOD = L0; LIFE = null; DEW_SET = null; if (typeof idle !== 'undefined') idle.length = 0; if (v) Object.assign(v, keep); }
    for (const q of svg.querySelectorAll('[data-l=vback] path[fill^="url(#vs"], [data-svgb="s"]')) q.setAttribute('display', 'none');
    return c;
  }
  const lifeOf = (age) => Object.assign(lifeAt(age), { cont: true });
  const dewOfAge = (age) => dewOf(age - 3);
  const fresh = () => { host.innerHTML = ''; const s = document.createElementNS(NS, 'svg'); host.append(s); return s; };
  /* the box: the fresh bouquet's, widened to the fully faded one's (its nodding heads, its fallen petals), padded */
  let s = fresh(); draw(s, lifeOf(60), 0); const b1 = s.getBBox();
  s = fresh(); draw(s, lifeOf(3), 1); const b0 = s.getBBox(), vb0 = s.viewBox.baseVal;
  const x0 = Math.min(b0.x, b1.x, vb0.x), y0 = Math.min(b0.y, b1.y, vb0.y), x1 = Math.max(b0.x + b0.width, b1.x + b1.width, vb0.x + vb0.width), y1 = Math.max(b0.y + b0.height, b1.y + b1.height, vb0.y + vb0.height);
  const pad = 0.02 * (x1 - x0), VB = [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
  let W = Math.round(HPX * VB[2] / VB[3]); W += W % 2;
  /* the close-up's centre: the wettest place at full dew (each drop's sparkle, counted on a grid) */
  const n = 12, grid = new Float64Array(n * n), pts = [];
  for (const g of s.querySelectorAll('g[data-dew]')) { const sp = g.lastElementChild, M = s.getScreenCTM().inverse().multiply(sp.getScreenCTM());
    for (const m of (sp.getAttribute('d') || '').matchAll(/M(-?[0-9.]+)[ ,](-?[0-9.]+)/g)) { const pt = new DOMPoint(+m[1], +m[2]).matrixTransform(M);
      const i = Math.max(0, Math.min(n - 1, Math.floor((pt.x - VB[0]) / VB[2] * n))), j = Math.max(0, Math.min(n - 1, Math.floor((pt.y - VB[1]) / VB[3] * n)));
      grid[j * n + i]++; pts.push([pt.x, pt.y, j * n + i]); } }
  let best = 0; for (let q = 1; q < n * n; q++) if (grid[q] > grid[best]) best = q;
  let sx = 0, sy = 0, sw = 0; for (const [x, y, q] of pts) if (q === best) { sx += x; sy += y; sw++; }
  const zc = sw ? [sx / sw, sy / sw] : [VB[0] + VB[2] / 2, VB[1] + VB[3] / 2];
  const Z = ${JSON.stringify(ZOOM)};
  /* the view at t: the close window held, then eased out to the whole box (its centre kept inside the box) */
  const viewAt = (t) => { const k = t <= Z.hold ? 0 : t >= Z.end ? 1 : (() => { const u = (t - Z.hold) / (Z.end - Z.hold); return u * u * (3 - 2 * u); })();
    const w = VB[2] * (Z.w + (1 - Z.w) * k), h = w * VB[3] / VB[2], cx0 = Math.min(Math.max(zc[0], VB[0] + VB[2] * Z.w / 2), VB[0] + VB[2] * (1 - Z.w / 2)),
      cy0 = Math.min(Math.max(zc[1], VB[1] + VB[3] * Z.w / 2), VB[1] + VB[3] * (1 - Z.w / 2)), cx = cx0 + (VB[0] + VB[2] / 2 - cx0) * k, cy = cy0 + (VB[1] + VB[3] / 2 - cy0) * k;
    return [cx - w / 2, cy - h / 2, w, h]; };
  host.style.width = W + 'px'; host.style.height = HPX + 'px';
  /* one frame: the age and the dew at t, a key telling a frame that draws as the one before (the still bloom, the faded hold) */
  window.CC = {
    W, H: HPX, VB, zc,
    plan(t) { const age = CC_AGE(t), L = lifeOf(age), dew = dewOfAge(age), v = viewAt(t);
      /* (the bloom is not still: the snowball turns from green to white, the lady's mantle ages through it) */
      const still = age >= 60 && t >= Z.end ? 'end' : null;
      return { t, age, stage: L.stage, u: L.u, dew, view: v, still }; },
    frame(t) { const P = this.plan(t), svg = fresh(); const n0 = DEW_N; draw(svg, lifeOf(P.age), P.dew); svg.setAttribute('viewBox', P.view.map((x) => Math.round(x * 100) / 100).join(' '));
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'); return Object.assign(P, { drops: DEW_N - n0, els: svg.querySelectorAll('*').length }); },
  };
  window.CC_READY = true;
})().catch((e) => { window.CC_ERR = String(e && e.stack || e); });`;

// ---------- the small static server
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path === '/__cc.html') return res.writeHead(200, { 'content-type': 'text/html' }), res.end(PAGE);
  if (path === '/__cc.js') return res.writeHead(200, { 'content-type': 'text/javascript' }), res.end(SCRIPT);
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

const log = [];
let meta = null;
const fname = (i) => join(OUT, `f${String(i).padStart(4, '0')}.png`);
try {
  await connect();
  await send('Page.enable');
  await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/__cc.html?p=${encodeURIComponent(ID)}&h=${HPX}` });
  const t0 = Date.now();
  while (Date.now() - t0 < 300000) { await sleep(500); let st = null; try { st = await evaluate('window.CC_ERR || (window.CC_READY ? "ok" : null)'); } catch (_) {} if (st === 'ok') break; if (st) throw new Error(st); }
  meta = await evaluate('({ W: CC.W, H: CC.H, VB: CC.VB, zc: CC.zc })');
  await send('Emulation.setDeviceMetricsOverride', { width: meta.W, height: meta.H, deviceScaleFactor: 1, mobile: false });
  console.log(`${ID} : ${meta.W} x ${meta.H} px, boîte ${meta.VB.map((x) => Math.round(x)).join(' ')}, gros plan sur ${meta.zc.map(Math.round).join(' ')}`);
  let prev = null, drawn = 0;
  const tS = Date.now();
  for (let i = DE; i < A; i += PAS) {
    const t = i / FPS;
    const plan = await evaluate(`CC.plan(${t})`);
    if (plan.still && prev && prev.still === plan.still && existsSync(fname(prev.i))) {
      copyFileSync(fname(prev.i), fname(i));
      log.push({ i, t, age: +plan.age.toFixed(3), dew: +plan.dew.toFixed(3), copie: prev.i });
      continue;
    }
    const fr = await evaluate(`CC.frame(${t})`);
    await evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))');
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: meta.W, height: meta.H, scale: 1 } });
    writeFileSync(fname(i), Buffer.from(shot.data, 'base64'));
    drawn++;
    prev = { i, still: plan.still };
    log.push({ i, t, age: +fr.age.toFixed(3), stage: fr.stage, u: +fr.u.toFixed(3), dew: +fr.dew.toFixed(3), drops: fr.drops, els: fr.els });
    if (drawn % 24 === 0) console.log(`  image ${i} (${t.toFixed(2)} s, âge ${fr.age.toFixed(2)} j) : ${((Date.now() - tS) / drawn / 1000).toFixed(2)} s par image`);
  }
  console.log(`${drawn} images dessinées, ${log.length - drawn} copiées, en ${((Date.now() - tS) / 1000).toFixed(0)} s`);
} finally {
  await closeChrome();
  server.close();
  writeFileSync(join(OUT, 'cycle.json'), JSON.stringify({ id: ID, fps: FPS, duree: DUR, cles: KEYS, zoom: ZOOM, ...(meta || {}), images: log }, null, 1));
}

// ---------- the stacked-alpha MP4: colour premultiplied (no dark fringe where the alpha falls), alpha as grey under it
if (!ONLY_FRAMES && DE === 0 && A === N && PAS === 1) {
  const mp4 = join(OUT, 'cycle.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(OUT, 'f%04d.png'),
    '-filter_complex', '[0:v]format=rgba,split[a][b];[a]premultiply=inplace=1,format=rgb24[c];[b]alphaextract,format=rgb24[m];[c][m]vstack,format=yuv420p[v]',
    '-map', '[v]', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF), '-tune', 'animation', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
  if (r.status === 0) console.log(`${mp4} : ${(statSync(mp4).size / 1024 / 1024).toFixed(2)} Mo`);
  else console.log('ffmpeg a échoué');
}
