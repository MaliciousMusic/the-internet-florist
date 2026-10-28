// film.mjs: films a page of the site as a first-time visitor sees it load (owner, 2026-10-28: a screen recording showed
// a blurry start, then a wave of pieces). One headless Chrome, a fresh profile (nothing cached), the network slowed as
// asked; every frame the page paints is kept (DevTools screencast) with its time since the navigation began, then laid
// out as a contact sheet, with the page's own times (FRISE_TEMPS, paints) in a JSON beside it. Through the gate:
//
//   sh ws/gate.sh node decor/scene/film.mjs <url> <out dir> [--phone] [--reseau 4g|lent|aucun] [--duree <ms>] [--revisite]
//
//   --phone    : 390 x 844, 3 device pixels per CSS pixel, touch, processor slowed 4 times (as perf.mjs)
//   --reseau   : 4g (20 Mb/s down, 60 ms) by default; lent (1.6 Mb/s, 150 ms, a poor 3G); aucun
//   --revisite : loads the page once, then films a second visit (the service worker's cache, the browser's)
import { spawn, execFileSync } from 'node:child_process';
import { freemem } from 'node:os';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const [url, outDir] = args;
if (!url || !outDir) {
  console.error('film.mjs <url> <out dir> [--phone] [--reseau 4g|lent|aucun] [--duree <ms>] [--revisite]');
  process.exit(1);
}
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const phone = args.includes('--phone');
const NET = { '4g': [20e6, 60], lent: [1.6e6, 150], aucun: null }[opt('--reseau', '4g')];
const DUREE = Number(opt('--duree', 9000));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CHROME_PORT || 9352);
const PROFILE = join(process.env.TEMP || '.', `film-chrome-${process.pid}`);
const W = phone ? 390 : 1600, H = phone ? 844 : 900, DPR = phone ? 3 : 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 2.5 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 2,5 Go : pas de Chrome`);
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });
mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(
  CHROME,
  ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, `--window-size=${W},${H}`, 'about:blank'],
  { stdio: 'ignore' },
);
let exited = false;
chrome.on('exit', () => (exited = true));

let ws, id = 0;
const wait = new Map(), handlers = [];
const send = (method, params = {}, sessionId) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((res, rej) => wait.set(i, { res, rej, method }));
};
async function connect() {
  for (let k = 0; k < 80; k++) {
    try {
      const v = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
      ws = new WebSocket(v.webSocketDebuggerUrl);
      await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
      ws.onmessage = (e) => {
        const m = JSON.parse(e.data);
        if (m.id && wait.has(m.id)) {
          const w = wait.get(m.id);
          wait.delete(m.id);
          m.error ? w.rej(new Error(`${w.method}: ${m.error.message}`)) : w.res(m.result);
        } else if (m.method) for (const h of handlers) h(m);
      };
      return;
    } catch (_) {}
    await sleep(250);
  }
  throw new Error('Chrome ne répond pas');
}

try {
  await connect();
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId: S } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, S);
  await send('Network.enable', {}, S);
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: phone }, S);
  if (phone) {
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, S);
    await send('Emulation.setCPUThrottlingRate', { rate: 4 }, S);
  }
  if (NET)
    await send('Network.emulateNetworkConditions', { offline: false, latency: NET[1], downloadThroughput: NET[0] / 8, uploadThroughput: NET[0] / 16 }, S);
  const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, S)).result.value;

  if (args.includes('--revisite')) {
    await send('Page.navigate', { url }, S);
    await sleep(DUREE);
    await send('Page.navigate', { url: 'about:blank' }, S);
    await sleep(500);
  }
  const frames = [];
  const erreurs = [];
  let t0 = null;
  await send('Runtime.enable', {}, S);
  handlers.push((m) => {
    if (m.sessionId === S && m.method === 'Runtime.exceptionThrown') erreurs.push(m.params.exceptionDetails.exception?.description?.slice(0, 300) || m.params.exceptionDetails.text);
    if (m.sessionId === S && m.method === 'Runtime.consoleAPICalled' && /error|warn/.test(m.params.type)) erreurs.push(m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
    if (m.method === 'Page.screencastFrame' && m.sessionId === S) {
      frames.push({ t: m.params.metadata.timestamp, data: m.params.data });
      send('Page.screencastFrameAck', { sessionId: m.params.sessionId }, S).catch(() => {});
    }
  });
  await send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: phone ? 390 : 800, everyNthFrame: 1 }, S);
  t0 = Date.now() / 1000;
  await send('Page.navigate', { url }, S);
  await sleep(DUREE);
  await send('Page.stopScreencast', {}, S);
  const temps = await evalJs(`({ frise: Object.fromEntries(Object.entries(window.FRISE_TEMPS || {}).filter(([k]) => k !== 'pieces')),
    paints: performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]),
    affiche: performance.getEntriesByType('resource').filter((r) => /affiche|feuille/.test(r.name)).map((r) => [r.name.split('/').pop(), Math.round(r.responseEnd), r.transferSize]),
    octets: Math.round(performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
    sw: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
    toile: window.TOILE ? { vis: window.TOILE.canvas.style.visibility, stage: window.TOILE.app.stage.visible, pivot: window.TOILE.app.stage.children.filter((c) => !c.visible).map((c) => c.label) } : null,
    classes: document.documentElement.className })`);
  const list = [];
  frames.forEach((f, k) => {
    const name = `f${String(k).padStart(3, '0')}.jpg`;
    writeFileSync(join(outDir, name), Buffer.from(f.data, 'base64'));
    list.push([name, Math.round((f.t - t0) * 1000)]);
  });
  writeFileSync(join(outDir, 'film.json'), JSON.stringify({ url, phone, reseau: opt('--reseau', '4g'), frames: list, temps, erreurs }, null, 1));
  execFileSync('python', [join(HERE, 'film_planche.py'), outDir], { stdio: 'inherit' });
  console.log(JSON.stringify({ images: list.length, temps, erreurs }));
} finally {
  try {
    ws.send(JSON.stringify({ id: ++id, method: 'Browser.close' }));
  } catch (_) {}
  for (let k = 0; k < 50 && !exited; k++) await sleep(100);
  if (!exited) chrome.kill();
  await sleep(500);
  try {
    rmSync(PROFILE, { recursive: true, force: true });
  } catch (_) {}
}
