// recadre.mjs: the phone's cut of the static decor layers. A phone (or a tablet held upright) sees only the central
// column of the world (scene.css: the world covers the screen, anchored at its centre), yet the browser reads, styles and
// records every element of an SVG layer, seen or not. This writes, for each static layer of decor/out/, a copy that keeps
// only the elements whose box meets the column (x COL[0]..COL[1] of the 2400-unit world, plus a margin for blurs and
// strokes), with the same viewBox: inside the column it draws the same picture (checked pixel by pixel below).
// The column holds the visible part of the world on any screen up to 0.62 wide for 1 high (every phone held upright: a
// 9:16 screen sees x 820..1580); a tablet held upright, or anything wider, gets the full layers.
//
//   sh flower-atelier/ws/gate.sh node decor/scene/recadre.mjs      (after any change of a layer in decor/out/)
//
// Writes decor/out/colonne/<layer>.svg and prints, per layer, the elements kept and the pixels that differ (by more than
// 3 levels of 255) inside the column between the full layer and its cut, rendered by one headless Chrome at 1 and 2
// pixels per unit. The same file always renders the same (RECADRE_BRUIT=1 renders each full layer twice: 0 pixel), but
// fewer elements in a raster tile can change how Chrome antialiases the hairlines left in it: a few isolated pixels on
// thin stems (2026-10-16, sol-milieu: 0.08 % of the column, at most 57 levels). The check allows 0.1 % of the pixels
// and no difference above 64 levels, and fails beyond. scene.js loads the cut when the whole visible part of the world lies in the column, the full layer otherwise
// (and swaps to the full one for good if the window grows past it).
import { execFileSync, spawn } from 'node:child_process';
import { freemem } from 'node:os';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// the column, in world units; scene.js has the same numbers (COLONNE)
export const COL = [780, 1620];
// kept beyond the column: the widest blur (3 sigma) and half the widest stroke of the layers, rounded up
const MARGIN = 32;
const LAYERS = ['horizon.svg', 'sol-loin.svg', 'sol-milieu.svg', 'sol-pres.svg'];

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'out');
const CUT = join(OUT, 'colonne');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CHROME_PORT || 9353);
const PROFILE = process.env.CHROME_PROFILE || join(process.env.TEMP || '.', 'recadre-chrome');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 4 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 4 Go : pas de Chrome`);
  process.exit(2);
}

// runs in the layer's own document: removes what lies wholly outside [x0, x1], then the definitions nothing uses
const CULL = (x0, x1) => {
  const svg = document.documentElement;
  const NON = new Set(['defs', 'clipPath', 'mask', 'pattern', 'symbol', 'linearGradient', 'radialGradient', 'filter', 'marker', 'style', 'title', 'desc', 'metadata']);
  const refsOf = (el, into) => {
    for (const a of el.attributes) {
      for (const m of a.value.matchAll(/url\(#([^)"']+)\)/g)) into.add(m[1]);
      if ((a.localName === 'href') && a.value[0] === '#') into.add(a.value.slice(1));
    }
  };
  const refd = new Set();
  for (const el of svg.querySelectorAll('*')) refsOf(el, refd);
  const holdsRef = (el) => (el.id && refd.has(el.id)) || [...el.querySelectorAll('[id]')].some((d) => refd.has(d.id));
  const before = svg.querySelectorAll('*').length;
  const walk = (parent) => {
    for (const c of [...parent.children]) {
      if (NON.has(c.localName)) continue;
      const r = c.getBoundingClientRect();
      const empty = r.width === 0 && r.height === 0;
      const outside = !empty && (r.right < x0 || r.left > x1);
      const group = c.localName === 'g' || c.localName === 'a' || c.localName === 'svg';
      if (outside && !holdsRef(c)) {
        c.remove();
        continue;
      }
      // a group across the edge (or outside but holding something used elsewhere): look inside
      if (group && (outside || r.left < x0 || r.right > x1)) walk(c);
    }
  };
  walk(svg);
  // the definitions still used: from every element outside <defs>, then from those definitions in turn
  const byId = new Map([...svg.querySelectorAll('[id]')].map((e) => [e.id, e]));
  const reached = new Set();
  const todo = [];
  const visit = (el) => {
    const s = new Set();
    refsOf(el, s);
    for (const d of el.querySelectorAll('*')) refsOf(d, s);
    for (const id of s) if (!reached.has(id) && byId.has(id)) (reached.add(id), todo.push(byId.get(id)));
  };
  for (const el of svg.querySelectorAll('*')) if (!el.closest('defs') && !NON.has(el.localName)) {
    const s = new Set();
    refsOf(el, s);
    for (const id of s) if (!reached.has(id) && byId.has(id)) (reached.add(id), todo.push(byId.get(id)));
  }
  while (todo.length) visit(todo.pop());
  for (const defs of svg.querySelectorAll('defs'))
    for (const d of [...defs.children]) if (!(d.id && reached.has(d.id)) && !holdsRefReached(d)) d.remove();
  function holdsRefReached(d) {
    return [...d.querySelectorAll('[id]')].some((x) => reached.has(x.id));
  }
  return { before, after: svg.querySelectorAll('*').length, text: new XMLSerializer().serializeToString(svg) };
};

mkdirSync(PROFILE, { recursive: true });
mkdirSync(CUT, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', '--no-first-run', '--disable-extensions', '--hide-scrollbars', '--allow-file-access-from-files', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--window-size=2400,1350', 'about:blank'], { stdio: 'ignore' });
let exited = false;
chrome.on('exit', () => (exited = true));
let ws;
let id = 0;
const wait = new Map();
const send = (method, params = {}) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params }));
  return new Promise((res, rej) => wait.set(i, { res, rej, method }));
};
async function connect() {
  for (let k = 0; k < 60; k++) {
    try {
      const page = (await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json())).find((t) => t.type === 'page');
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
        ws.onmessage = (e) => {
          const m = JSON.parse(e.data);
          if (m.id && wait.has(m.id)) {
            const w = wait.get(m.id);
            wait.delete(m.id);
            m.error ? w.rej(new Error(`${w.method}: ${m.error.message}`)) : w.res(m.result);
          }
        };
        return;
      }
    } catch (_) {}
    await sleep(250);
  }
  throw new Error('Chrome ne répond pas');
}
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
async function open(file) {
  await send('Page.navigate', { url: pathToFileURL(file).href });
  for (let k = 0; k < 600; k++) {
    if (await evaluate(`document.readyState === 'complete'`).catch(() => false)) return;
    await sleep(100);
  }
  throw new Error(`${file} ne se charge pas`);
}
// the column of the layer as rendered, at `scale` pixels per unit
async function shot(file, scale, png) {
  await send('Emulation.setDeviceMetricsOverride', { width: 2400, height: 1350, deviceScaleFactor: scale, mobile: false });
  await open(file);
  await sleep(300);
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: COL[0], y: 0, width: COL[1] - COL[0], height: 1350, scale: 1 } });
  writeFileSync(png, Buffer.from(r.data, 'base64'));
}
const DIFF = `
import sys
from PIL import Image, ImageChops
a, b = Image.open(sys.argv[1]).convert('RGBA'), Image.open(sys.argv[2]).convert('RGBA')
d = ImageChops.difference(a, b)
worst = max(hi for lo, hi in d.getextrema())
d = d.convert('L').point(lambda v: 255 if v > 3 else 0)
print(sum(d.histogram()[255:]), d.size[0] * d.size[1], worst)
`;

try {
  await connect();
  await send('Page.enable');
  await send('Runtime.enable');
  const tmp = join(PROFILE, 'diff');
  mkdirSync(tmp, { recursive: true });
  for (const name of LAYERS) {
    const src = join(OUT, name);
    const dst = join(CUT, name);
    await send('Emulation.setDeviceMetricsOverride', { width: 2400, height: 1350, deviceScaleFactor: 1, mobile: false });
    await open(src);
    const r = await evaluate(`(${CULL})(${COL[0] - MARGIN}, ${COL[1] + MARGIN})`);
    // the source's own head (its XML declaration, if any) is kept as is; the serializer writes the root element
    const head = (/^\s*<\?xml[^>]*\?>\s*/.exec(readFileSync(src, 'utf8')) || [''])[0];
    writeFileSync(dst, head + r.text);
    const diffs = [];
    for (const scale of [1, 2]) {
      const a = join(tmp, `${name}-${scale}-plein.png`);
      const b = join(tmp, `${name}-${scale}-colonne.png`);
      await shot(src, scale, a);
      await shot(process.env.RECADRE_BRUIT ? src : dst, scale, b);
      diffs.push(execFileSync('python', ['-c', DIFF, a, b], { encoding: 'utf8' }).trim().split(' ').map(Number));
    }
    const ko = (f) => Math.round(statSync(f).size / 1024);
    const drawn = (f) => readFileSync(f, 'utf8').replace(/<defs>[\s\S]*?<\/defs>/g, '').match(/<[a-zA-Z]/g).length;
    console.log(`${name}: ${drawn(dst)}/${drawn(src)} éléments dessinés (${r.after}/${r.before} avec les définitions), ${ko(dst)}/${ko(src)} Ko, pixels différents dans la colonne ${diffs.map(([n, , w]) => `${n} (max ${w})`).join(' / ')}${process.env.RECADRE_BRUIT ? ' (plein contre plein)' : ''}`);
    if (diffs.some(([n, total, w]) => n > total / 1000 || w > 64)) process.exitCode = 1;
  }
} catch (err) {
  console.error('ERREUR', err.message);
  process.exitCode = 1;
} finally {
  try {
    const v = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
    const b = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((res) => (b.onopen = res));
    b.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
  } catch (_) {}
  for (let k = 0; k < 40 && !exited; k++) await sleep(100);
  if (!exited) chrome.kill();
  ws?.close();
}
