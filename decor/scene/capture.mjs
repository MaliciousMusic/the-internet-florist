// capture.mjs: drives one headless Chrome on the shop scene (decor/scene) through the DevTools protocol, for the boards and
// the measures. Run it through the gate (one Chrome at a time, only with more than 4 GB of free memory):
//
//   sh flower-atelier/ws/gate.sh node decor/scene/capture.mjs <mode> <url> <W> <H> [options]
//
//   mesure  <url> <W> <H> [--dpr 3 --mobile --cpu 4 --trace] -> waits for window.BOUTIQUE_MESURES.fini, prints it as JSON
//                                                   (--cpu 4: the processor slowed 4 times, roughly a mid-range phone)
//   shot    <url> <W> <H> <out.png> [--dpr 1 --mobile] -> once the bouquet has grown and the cards' thumbnails are in
//   change  <url> <W> <H> <out.png> [--carte 1]       -> picks another card once the first bouquet sways: the fold
//                                                      half-way (<out>-repli.png), then the new bouquet grown
//   essai   <url> <W> <H> '<js expression>'          -> evaluates it once the first bouquet grows, prints the result
//   eclosion <url> <W> <H> <out.png> [--t 300,1500,2800,6000] [--crop x0,y0,x1,y1]
//                                                   -> the first growth frozen at those times (ms after it starts),
//                                                      side by side in one image
//
// Its own throwaway profile (CHROME_PROFILE, default in the session's scratchpad), its own port (CHROME_PORT, 9347); Chrome is closed at
// the end, whatever happens. Console errors and warnings of the page are printed.
import { execFileSync, spawn } from 'node:child_process';
import { freemem } from 'node:os';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CHROME_PORT || 9347);
const PROFILE = process.env.CHROME_PROFILE || join(process.env.TEMP || '.', 'boutique-chrome');
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const flag = (k) => {
  const i = args.indexOf(k);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
};
const dpr = Number(opt('--dpr', 1));
const mobile = flag('--mobile');
const cpu = Number(opt('--cpu', 1)); // CPU slowed down this many times (4: roughly a mid-range phone)
// --trace (mesure): also the frames the compositor drew while the bouquet grew and swayed, read from a trace; the frames per
// second of the page (requestAnimationFrame) count the main thread, which a growth on the graphics card does not need
const traced = flag('--trace');
const times = opt('--t', '300,1500,2800,6000').split(',').map(Number);
const crop = opt('--crop', '');
const [mode, url, W, H, out] = args;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 4 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 4 Go : pas de Chrome`);
  process.exit(2);
}

mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
let exited = false;
chrome.on('exit', () => (exited = true));

let ws;
let id = 0;
const wait = new Map();
const handlers = [];
const traceEvents = [];
let traceDoneRes;
const traceDone = new Promise((r) => (traceDoneRes = r));
handlers.push((m) => {
  if (m.method === 'Tracing.dataCollected') traceEvents.push(...m.params.value);
  else if (m.method === 'Tracing.tracingComplete') traceDoneRes();
});
function send(method, params = {}) {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params }));
  return new Promise((res, rej) => wait.set(i, { res, rej, method }));
}
async function connect() {
  for (let k = 0; k < 60; k++) {
    try {
      const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
      const page = list.find((t) => t.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
          ws.onopen = res;
          ws.onerror = rej;
        });
        ws.onmessage = (e) => {
          const m = JSON.parse(e.data);
          if (m.id && wait.has(m.id)) {
            const w = wait.get(m.id);
            wait.delete(m.id);
            if (m.error) w.rej(new Error(`${w.method}: ${m.error.message}`));
            else w.res(m.result);
          } else if (m.method) for (const h of handlers) h(m);
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
async function until(expr, ms = 60000, every = 100) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await evaluate(`!!(${expr})`)) return true;
    await sleep(every);
  }
  throw new Error(`délai dépassé : ${expr}`);
}
async function screenshot(file) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(r.data, 'base64'));
  return file;
}
async function close() {
  try {
    const v = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
    const b = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((res) => (b.onopen = res));
    b.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
  } catch (_) {}
  for (let k = 0; k < 40 && !exited; k++) await sleep(100);
  if (!exited) chrome.kill();
}

const READY = `window.BOUTIQUE_MESURES && BOUTIQUE_MESURES.premiere`;
// the bouquet has grown and every card on screen has its thumbnail
const SETTLED = `(() => { const M = BOUTIQUE_MESURES; if (!M.premiere) return false;
  const vis = [...document.querySelectorAll('.carte')].filter((b) => { const r = b.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; });
  return vis.every((b) => b.querySelector('img').complete && b.querySelector('img').naturalWidth > 0); })()`;
// the growth is over: every animation of the bouquet's pieces is finished, or is the endless breeze
const GROWN = `(() => { const bq = document.getElementById('bouquet'); return document.getAnimations().filter((a) => a.effect && a.effect.target && bq.contains(a.effect.target)).every((a) => a.effect.getTiming().iterations === Infinity || a.playState === 'finished'); })()`;
const FREEZE = (t) => `(() => { const bq = document.getElementById('bouquet'); let n = 0;
  for (const a of document.getAnimations()) { const el = a.effect && a.effect.target; if (!el || !bq.contains(el)) continue; a.pause(); a.currentTime = ${t}; n++; }
  return n; })()`;

try {
  await connect();
  await send('Page.enable');
  await send('Runtime.enable');
  // a first visit every time: nothing from the cache of an earlier run
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  handlers.push((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type))
      console.log(`[console ${m.params.type}]`, m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 400));
    if (m.method === 'Runtime.exceptionThrown') console.log('[exception]', (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').slice(0, 400));
  });
  await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: dpr, mobile });
  if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (cpu > 1) await send('Emulation.setCPUThrottlingRate', { rate: cpu });
  if (traced) await send('Tracing.start', { categories: 'benchmark,viz,loading,blink.user_timing', transferMode: 'ReportEvents' });
  await send('Page.navigate', { url });

  if (mode === 'mesure') {
    await until('window.BOUTIQUE_MESURES && (BOUTIQUE_MESURES.fini || BOUTIQUE_MESURES.erreur)', 120000, 250);
    const M = await evaluate('BOUTIQUE_MESURES');
    if (traced) {
      await send('Tracing.end');
      await traceDone;
      const nav = traceEvents.find((e) => e.name === 'navigationStart');
      const fr = traceEvents.filter((e) => e.name === 'SubmitCompositorFrameToPresentationCompositorFrame' && e.ph === 'b').map((e) => (e.ts - nav.ts) / 1000).sort((a, b) => a - b);
      const win = (w) => {
        if (!w || w.debutMs == null) return null;
        const a = w.debutMs;
        const b = a + w.dureeMs;
        const f = fr.filter((t) => t >= a && t <= b);
        let worst = f.length ? Math.max(f[0] - a, b - f[f.length - 1]) : b - a;
        for (let i = 1; i < f.length; i++) worst = Math.max(worst, f[i] - f[i - 1]);
        return { ips: Math.round((f.length * 1000) / (b - a)), pireMs: Math.round(worst) };
      };
      M.compositeur = { eclosion: win(M.eclosion), brise: win(M.brise) };
    }
    console.log(JSON.stringify(M, null, 1));
  } else if (mode === 'shot') {
    await until(READY, 90000);
    // past the growth, then the thumbnails
    await until(GROWN, 60000, 200);
    await until(SETTLED, 60000, 200);
    await sleep(800);
    console.log('ok', await screenshot(out));
  } else if (mode === 'eclosion') {
    await until(READY, 90000, 20);
    const files = [];
    for (const [k, t] of times.entries()) {
      const n = await evaluate(FREEZE(t));
      await sleep(350);
      files.push(await screenshot(out.replace(/\.png$/, `-${k + 1}.png`)));
      console.log(`t = ${t} ms : ${n} animations figées`);
    }
    // side by side, each with its time
    const py = `
import sys
from PIL import Image, ImageDraw
files, times, out, crop = sys.argv[1].split('|'), sys.argv[2].split(','), sys.argv[3], sys.argv[4]
ims = [Image.open(f).convert('RGB') for f in files]
if crop:
    box = tuple(int(v) for v in crop.split(','))
    ims = [im.crop(box) for im in ims]
w, h = ims[0].size
sheet = Image.new('RGB', (w * len(ims) + 8 * (len(ims) - 1), h + 28), '#f4f1ec')
d = ImageDraw.Draw(sheet)
for i, im in enumerate(ims):
    x = i * (w + 8)
    sheet.paste(im, (x, 28))
    d.text((x + 6, 8), 't = %s ms' % times[i], fill='#333')
sheet.save(out)
print('ok', out, sheet.size)
`;
    console.log(execFileSync('python', ['-c', py, files.join('|'), times.join(','), out, crop], { encoding: 'utf8' }).trim());
  } else if (mode === 'essai') {
    // a script of checks (argument 5: a JS expression, awaited) once the first bouquet grows
    await until(READY, 90000);
    console.log(JSON.stringify(await evaluate(out)));
  } else if (mode === 'change') {
    // another card while the first bouquet sways: the fold (frozen half-way), then the new bouquet grown
    await until(READY, 90000);
    await sleep(6500);
    await evaluate(`document.querySelectorAll('.point')[${+(opt('--carte', 1))}].click()`);
    await sleep(380);
    await evaluate(`document.getAnimations().forEach((a) => { const el = a.effect && a.effect.target; if (el && document.getElementById('bouquet').contains(el)) a.pause(); })`);
    await screenshot(out.replace(/\.png$/, '-repli.png'));
    await evaluate(`document.getAnimations().forEach((a) => { const el = a.effect && a.effect.target; if (el && document.getElementById('bouquet').contains(el) && a.playState === 'paused') a.play(); })`);
    await until('BOUTIQUE_MESURES.suivantes && BOUTIQUE_MESURES.suivantes.length', 60000, 100);
    await sleep(6500);
    console.log(JSON.stringify(await evaluate('BOUTIQUE_MESURES.suivantes')));
    console.log('ok', await screenshot(out));
  } else throw new Error(`mode inconnu : ${mode}`);
} catch (err) {
  console.error('ERREUR', err.message);
  process.exitCode = 1;
} finally {
  await close();
  ws?.close();
}
