// fleurs_moteur.mjs: runs the flower engine (decor/scene/engine.js, built by scene/mkengine.sh, never edited here) in one
// headless Chrome, on a page of its own served locally, and calls one function of decor/fleurs_page.js with a job. The page
// sends its drawings back by POST to this server, which writes them under decor/out/fleurs/ (or --dir).
//
//   GATE_MAX=2 sh flower-atelier/ws/gate.sh node decor/fleurs_moteur.mjs <fn> [--job job.json] [--dir out/fleurs] [--out res.json]
//     fn: a function of window.__FLEURS (fleurs_page.js): inspect, plants...
//
// One Chrome, its own throwaway profile (CHROME_PROFILE, default in the session's TEMP), its own ports (page 8794,
// DevTools 9361); it refuses to start under 5 GB of free memory and is always closed at the end.
import { spawn } from 'node:child_process';
import { freemem } from 'node:os';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAGE_PORT = 8794, CDP_PORT = 9361;
const PROFILE = process.env.CHROME_PROFILE || join(process.env.TEMP || '.', 'fleurs-chrome');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const jobFile = opt('--job', '');
const dir = resolve(HERE, opt('--dir', 'out/fleurs'));
const outFile = opt('--out', '');
const fn = args[0] || 'inspect';
const job = jobFile ? JSON.parse(readFileSync(jobFile, 'utf8')) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 5 * 2 ** 30) { console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 5 Go : pas de Chrome`); process.exit(2); }

// ---------- the page server ----------
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>fleurs</title></head><body style="margin:0;background:#fff">
<script src="/engine.js"></script><script src="/fleurs_page.js"></script></body></html>`;
const FILES = { '/engine.js': join(HERE, 'scene', 'engine.js'), '/fleurs_page.js': join(HERE, 'fleurs_page.js') };
let saved = 0;
const server = createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (req.method === 'POST' && u.pathname === '/save') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const name = normalize(u.searchParams.get('name') || 'x.svg').replace(/^(\.\.[\\/])+/, '');
      const p = join(dir, name);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, Buffer.concat(chunks));
      saved++;
      res.writeHead(200, { 'content-type': 'text/plain' }).end('ok');
    });
    return;
  }
  if (u.pathname === '/' || u.pathname === '/index.html') return res.writeHead(200, { 'content-type': 'text/html' }).end(PAGE);
  // /decor/<path> serves a file of decor/ (layers, drawings), /sp/<path> one of the scratchpad (CHROME_PROFILE's parent)
  let f = FILES[u.pathname];
  if (!f && u.pathname.startsWith('/decor/')) f = join(HERE, decodeURIComponent(u.pathname.slice(7)));
  if (!f && u.pathname.startsWith('/sp/')) f = join(dirname(PROFILE), decodeURIComponent(u.pathname.slice(4)));
  if (f && /\.svg$/.test(f) && existsSync(f)) return res.writeHead(200, { 'content-type': 'image/svg+xml', 'cache-control': 'no-store' }).end(readFileSync(f));
  if (f && existsSync(f)) return res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' }).end(readFileSync(f));
  res.writeHead(404).end();
});
await new Promise((r) => server.listen(PAGE_PORT, '127.0.0.1', r));

// ---------- Chrome through the DevTools protocol ----------
mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${PROFILE}`, '--window-size=1400,1000', 'about:blank'], { stdio: 'ignore' });
let exited = false;
chrome.on('exit', () => (exited = true));
let ws, id = 0;
const wait = new Map();
function send(method, params = {}) { const i = ++id; ws.send(JSON.stringify({ id: i, method, params })); return new Promise((res, rej) => wait.set(i, { res, rej, method })); }
async function connect() {
  for (let k = 0; k < 80; k++) {
    try {
      const list = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((r) => r.json());
      const page = list.find((t) => t.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
        ws.onmessage = (e) => {
          const m = JSON.parse(e.data);
          if (m.id && wait.has(m.id)) { const w = wait.get(m.id); wait.delete(m.id); if (m.error) w.rej(new Error(`${w.method}: ${m.error.message}`)); else w.res(m.result); }
          else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning', 'log'].includes(m.params.type)) console.log(`[page ${m.params.type}]`, m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300));
          else if (m.method === 'Runtime.exceptionThrown') console.log('[exception]', (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').slice(0, 400));
        };
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
async function close() {
  try {
    const v = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`).then((r) => r.json());
    const b = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((res) => (b.onopen = res));
    b.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
  } catch (_) {}
  for (let k = 0; k < 50 && !exited; k++) await sleep(100);
  if (!exited) chrome.kill();
  server.close();
}

let code = 0;
try {
  await connect();
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: `http://127.0.0.1:${PAGE_PORT}/` });
  const t0 = Date.now();
  while (!(await evaluate('!!(window.ENGINE_OK && window.__FLEURS)').catch(() => false))) { if (Date.now() - t0 > 60000) throw new Error('moteur non chargé'); await sleep(150); }
  const r = await evaluate(`__FLEURS.${fn}(${JSON.stringify(job)})`);
  const txt = JSON.stringify(r, null, 1);
  if (outFile) { mkdirSync(dirname(resolve(outFile)), { recursive: true }); writeFileSync(outFile, txt); console.log(`résultat -> ${outFile} (${saved} fichiers écrits dans ${dir})`); }
  else console.log(txt.length > 20000 ? txt.slice(0, 20000) + ' ...' : txt, `\n(${saved} fichiers écrits)`);
} catch (e) { console.error('ERREUR', e.message); code = 1; }
await close();
process.exit(code);
