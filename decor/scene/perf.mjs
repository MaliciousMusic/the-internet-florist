// perf.mjs: what the shop scene costs, piece by piece. Drives one headless Chrome through the DevTools protocol on a page
// of the site, records a trace (every thread: page, compositor, raster workers, graphics process) and a sampled profile of
// the scripts, through three phases: load (0-12 s), rest (12-22 s), drag (22-34 s, four swipes), and prints a JSON summary.
// Run it through the gate (one Chrome at a time):
//
//   sh ws/gate.sh node decor/scene/perf.mjs <url> <out.json> [--phone] [--css '<rule>'] [--label <name>]
//
//   --phone : 390 x 844, 3 device pixels per CSS pixel, touch, processor slowed 4 times (a mid-range phone)
//   --css   : a style sheet added to the page before it loads (to switch a layer off and measure what it costs)
//   --js    : a script run once the page has loaded, for a layer the style sheet cannot reach
//
// Its own throwaway profile (CHROME_PROFILE), its own port (CHROME_PORT, 9351); Chrome is closed at the end.
import { spawn } from 'node:child_process';
import { freemem } from 'node:os';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = Number(process.env.CHROME_PORT || 9351);
const PROFILE = process.env.CHROME_PROFILE || join(process.env.TEMP || '.', `perf-chrome-${process.pid}`);
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
const phone = flag('--phone');
const css = opt('--css', '');
const js = opt('--js', ''); // a script run in the page once it has loaded (to stop a layer the style sheet cannot reach)
const label = opt('--label', 'complet');
const [url, outFile] = args;
const W = phone ? 390 : 1440;
const H = phone ? 844 : 900;
const DPR = phone ? 3 : 1;
const PHASES = [
  ['chargement', 0],
  ['repos', 12000],
  ['glisser', 22000],
];
const END = 34000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 2.5 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 2,5 Go : pas de Chrome`);
  process.exit(2);
}

mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(
  CHROME,
  ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, `--window-size=${W},${H}`, 'about:blank'],
  { stdio: 'ignore' },
);
let exited = false;
chrome.on('exit', () => (exited = true));

// ---------- the protocol, one browser connection with flattened sessions
let ws;
let id = 0;
const wait = new Map();
const handlers = [];
function send(method, params = {}, sessionId) {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((res, rej) => wait.set(i, { res, rej, method }));
}
async function connect() {
  for (let k = 0; k < 80; k++) {
    try {
      const v = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
      ws = new WebSocket(v.webSocketDebuggerUrl);
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
    } catch (_) {}
    await sleep(250);
  }
  throw new Error('Chrome ne répond pas');
}
async function close() {
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

// ---------- the trace, reduced as it streams in
const threads = new Map(); // "pid:tid" -> name
const procs = new Map(); // pid -> process name
const events = []; // [key, ts, dur, name, url]
const openB = new Map(); // "pid:tid" -> stack of B events
const marks = {}; // phase -> trace ts
const frames = []; // [ts, kind] kind: draw | drop
const profiles = new Map(); // id -> { nodes: Map, t }
const samples = []; // [ts, url, fn]
let traceDoneRes;
const traceDone = new Promise((r) => (traceDoneRes = r));
const urlOf = (a) => (a && (a.data?.url || a.data?.scriptName || a.url || a.fileName || a.data?.stackTrace?.[0]?.url)) || '';
function onTrace(list) {
  for (const e of list) {
    const key = `${e.pid}:${e.tid}`;
    if (e.ph === 'M') {
      if (e.name === 'thread_name') threads.set(key, e.args.name);
      else if (e.name === 'process_name') procs.set(e.pid, e.args.name);
      continue;
    }
    if (e.name === 'TimeStamp' && e.args?.data?.message?.startsWith('phase:')) {
      marks[e.args.data.message.slice(6)] = e.ts;
      continue;
    }
    if (e.name === 'DrawFrame') frames.push([e.ts, 'draw']);
    else if (e.name === 'DroppedFrame' || e.name === 'PipelineReporter' && e.args?.chrome_frame_reporter?.state === 'STATE_DROPPED') frames.push([e.ts, 'drop']);
    if (e.name === 'Profile') {
      profiles.set(e.id, { nodes: new Map(), t: e.args.data.startTime });
      continue;
    }
    if (e.name === 'ProfileChunk') {
      const P = profiles.get(e.id);
      if (!P) continue;
      const cp = e.args.data.cpuProfile || {};
      for (const n of cp.nodes || []) P.nodes.set(n.id, n.callFrame);
      const d = e.args.data.timeDeltas || [];
      (cp.samples || []).forEach((s, i) => {
        P.t += d[i] || 0;
        const f = P.nodes.get(s);
        if (f) samples.push([P.t, f.url || `(${f.functionName || 'program'})`, f.functionName || '(anonyme)']);
      });
      continue;
    }
    if (e.ph === 'X' && e.dur > 0) events.push([key, e.ts, e.dur, e.name, urlOf(e.args)]);
    else if (e.ph === 'B') {
      if (!openB.has(key)) openB.set(key, []);
      openB.get(key).push(e);
    } else if (e.ph === 'E') {
      const b = openB.get(key)?.pop();
      if (b && e.ts > b.ts) events.push([key, b.ts, e.ts - b.ts, b.name, urlOf(b.args) || urlOf(e.args)]);
    }
  }
}
handlers.push((m) => {
  if (m.method === 'Tracing.dataCollected') onTrace(m.params.value);
  else if (m.method === 'Tracing.tracingComplete') traceDoneRes();
});

// ---------- buckets of the page's main thread
const JS = /^(FunctionCall|EvaluateScript|v8\.|V8\.Execute|V8\.Compile|TimerFire|FireAnimationFrame|EventDispatch|RunMicrotasks|FireIdleCallback|XHRReadyStateChange|XHRLoad|ResourceReceivedData|v8\.run|v8\.compile|v8\.produceCache|CacheScript|ParseScriptOnBackground|HandlePostMessage|RunTask\.js)/;
const GC = /GC|Sweep|Mark|Scavenge|Finaliz/;
function bucketOf(name) {
  if (GC.test(name) && /GC|V8\.GC|BlinkGC|MinorGC|MajorGC|Scavenge/.test(name)) return 'gc';
  if (/^(UpdateLayoutTree|RecalculateStyles|ScheduleStyleRecalculation|ParseAuthorStyleSheet|StyleInvalidator)/.test(name)) return 'style';
  if (/^(Layout|InvalidateLayout|ScheduleLayout)$/.test(name)) return 'layout';
  if (/^(Paint|PrePaint|PaintImage|UpdateLayer|UpdateLayerTree|Layerize|Commit|CompositeLayers|PaintSetup|Rasterize)$/.test(name)) return 'paint';
  if (/Decode|ImageDecode|Resize Image/.test(name)) return 'decode';
  if (/^ParseHTML/.test(name)) return 'html';
  if (JS.test(name)) return 'js';
  return 'autre';
}

// self time per event on each thread (a parent loses what its children take)
function selfTimes(list) {
  list.sort((a, b) => a[1] - b[1] || b[2] - a[2]);
  const stack = [];
  const out = [];
  for (const e of list) {
    while (stack.length && stack[stack.length - 1].end <= e[1]) stack.pop();
    const parent = stack[stack.length - 1];
    const rec = { ts: e[1], dur: e[2], self: e[2], name: e[3], url: e[4] || parent?.url || '', depth: stack.length, end: e[1] + e[2] };
    if (parent) parent.self -= Math.min(e[2], parent.end - e[1]);
    stack.push(rec);
    out.push(rec);
  }
  return out;
}

function phaseOf(ts) {
  let p = null;
  for (const [n] of PHASES) if (marks[n] != null && ts >= marks[n]) p = n;
  return ts > (marks.fin ?? Infinity) ? null : p;
}
const phaseLen = (n, i) => ((PHASES[i + 1] ? marks[PHASES[i + 1][0]] : marks.fin) - marks[n]) / 1000; // ms

// ---------- the run
const pageNote = `(() => {
  const F = (window.__PERF = { frames: [], marks: {} });
  const loop = (t) => { F.frames.push(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  window.__perfMark = (n) => { F.marks[n] = performance.now(); console.timeStamp('phase:' + n); };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) F.lcp = Math.round(e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (_) {}
})();`;

try {
  await connect();
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId: S } = await send('Target.attachToTarget', { targetId, flatten: true });
  const P = (m, p) => send(m, p, S);
  const net = new Map();
  handlers.push((m) => {
    if (m.sessionId !== S) return;
    const p = m.params;
    if (m.method === 'Network.responseReceived') net.set(p.requestId, { url: p.response.url, mime: p.response.mimeType, bytes: 0, body: 0, status: p.response.status });
    else if (m.method === 'Network.dataReceived' && net.has(p.requestId)) net.get(p.requestId).body += p.dataLength;
    else if (m.method === 'Network.loadingFinished' && net.has(p.requestId)) net.get(p.requestId).bytes = p.encodedDataLength;
  });
  await P('Network.enable');
  await P('Network.setCacheDisabled', { cacheDisabled: true });
  await P('Page.enable');
  await P('Runtime.enable');
  await P('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: phone });
  if (phone) {
    await P('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await P('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  await P('Page.addScriptToEvaluateOnNewDocument', { source: pageNote });
  if (css)
    await P('Page.addScriptToEvaluateOnNewDocument', {
      source: `document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s); });`,
    });
  if (js) await P('Page.addScriptToEvaluateOnNewDocument', { source: `addEventListener('load', () => { ${js} });` });
  const gpu = await send('SystemInfo.getInfo').catch(() => null);

  await send('Tracing.start', {
    transferMode: 'ReportEvents',
    traceConfig: {
      recordMode: 'recordAsMuchAsPossible',
      includedCategories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame', 'v8.execute', 'blink', 'cc', 'gpu', 'viz', 'toplevel', 'disabled-by-default-v8.cpu_profiler', 'v8', 'blink.user_timing', '__metadata'],
    },
  });
  const cpu0 = await send('SystemInfo.getProcessInfo').catch(() => null);
  const t0 = Date.now();
  await P('Page.navigate', { url });
  const at = async (ms) => {
    const d = ms - (Date.now() - t0);
    if (d > 0) await sleep(d);
  };
  const ev = (expr) => P('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }).then((r) => r.result?.value);
  await sleep(300);
  await ev(`window.__perfMark && __perfMark('chargement')`);
  const cpuAt = { chargement: cpu0 };
  const heapAt = {};
  const metrics = async (n) => {
    cpuAt[n] = await send('SystemInfo.getProcessInfo').catch(() => null);
    const m = await P('Performance.getMetrics').catch(() => ({ metrics: [] }));
    heapAt[n] = Object.fromEntries(m.metrics.map((x) => [x.name, x.value]));
  };
  await P('Performance.enable');
  await at(PHASES[1][1]);
  await ev(`__perfMark('repos')`);
  await metrics('repos');
  await at(PHASES[2][1]);
  await ev(`__perfMark('glisser')`);
  await metrics('glisser');
  // four swipes, one bouquet each way, 2.5 s apart
  for (let k = 0; k < 4; k++) {
    const dir = k % 2 ? 1 : -1;
    const x0 = W / 2 - (dir * W) / 4;
    const y = H * 0.6;
    const steps = 20;
    if (phone) {
      await P('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
      for (let s = 1; s <= steps; s++) {
        await P('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (dir * W * 0.5 * s) / steps, y }] });
        await sleep(16);
      }
      await P('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      await P('Input.dispatchMouseEvent', { type: 'mousePressed', x: x0, y, button: 'left', buttons: 1, clickCount: 1 });
      for (let s = 1; s <= steps; s++) {
        await P('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x0 + (dir * W * 0.5 * s) / steps, y, button: 'left', buttons: 1 });
        await sleep(16);
      }
      await P('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x0 + dir * W * 0.5, y, button: 'left', buttons: 1, clickCount: 1 });
    }
    await sleep(2500);
  }
  await at(END);
  await ev(`__perfMark('fin')`);
  await metrics('fin');

  // what the page holds at the end
  const page = await ev(`(() => {
    const dpr = devicePixelRatio, F = window.__PERF;
    const vis = (r) => r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
    const imgs = [...document.images].map((i) => { const r = i.getBoundingClientRect();
      const svg = /\\.svg(\\?|$)/.test(i.currentSrc || i.src);
      return { src: (i.currentSrc || i.src).replace(location.origin, ''), svg, w: r.width, h: r.height, nw: i.naturalWidth, nh: i.naturalHeight, vis: vis(r), done: i.complete };
    });
    const canv = [...document.querySelectorAll('canvas')].map((c) => ({ cls: c.className, w: c.width, h: c.height }));
    const anims = document.getAnimations().map((a) => (a.effect && a.effect.target && (a.effect.target.className?.baseVal ?? a.effect.target.className)) || '?');
    const byCls = {}; for (const a of anims) byCls[a] = (byCls[a] || 0) + 1;
    const willChange = [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).willChange !== 'auto').length;
    // the load: first paints, the shop's own milestones, every file with when it ended (ms after navigation)
    const paint = Object.fromEntries(performance.getEntriesByType('paint').map((e) => [e.name, Math.round(e.startTime)]));
    const res = performance.getEntriesByType('resource').map((e) => [e.name.replace(location.origin, ''), e.transferSize, e.decodedBodySize, Math.round(e.startTime), Math.round(e.responseEnd)]);
    const BM = window.BOUTIQUE_MESURES || {};
    const load = { paint, lcp: F.lcp, premiere: BM.premiere && { ...BM.premiere, echelle: undefined }, suivantes: BM.suivantes, decor: window.FRISE_TEMPS && window.FRISE_TEMPS.pieces, res };
    return { load, dpr, nodes: document.getElementsByTagName('*').length, imgs, canv, anims: byCls, willChange, F: { frames: F.frames, marks: F.marks }, mem: performance.memory && { used: performance.memory.usedJSHeapSize, total: performance.memory.totalJSHeapSize } };
  })()`);
  const layers = await (async () => {
    let list = null;
    const h = (m) => m.sessionId === S && m.method === 'LayerTree.layerTreeDidChange' && m.params.layers && (list = m.params.layers);
    handlers.push(h);
    await P('LayerTree.enable').catch(() => {});
    for (let k = 0; k < 20 && !list; k++) await sleep(100);
    await P('LayerTree.disable').catch(() => {});
    return list ? { count: list.length, px: Math.round(list.reduce((s, l) => s + (l.drawsContent ? l.width * l.height : 0), 0)) } : null;
  })();
  await send('Tracing.end');
  await Promise.race([traceDone, sleep(60000)]);
  marks.fin ??= Math.max(...events.map((e) => e[1]));

  // ---------- reduce
  const renderer = [...procs].filter(([, n]) => /Renderer/.test(n)).map(([p]) => p);
  const gpuPids = [...procs].filter(([, n]) => /GPU/.test(n)).map(([p]) => p);
  const role = (key) => {
    const pid = +key.split(':')[0];
    const n = threads.get(key) || '';
    if (gpuPids.includes(pid)) return /CrGpuMain/.test(n) ? 'gpu' : /Viz/.test(n) ? 'viz' : 'gpu-autre';
    if (!renderer.includes(pid)) return /Viz/.test(n) ? 'viz' : null;
    if (/CrRendererMain/.test(n)) return 'main';
    if (/Compositor$/.test(n)) return 'compositor';
    if (/CompositorTileWorker|Raster/.test(n)) return 'raster';
    if (/Decode/.test(n)) return 'decode';
    if (/DedicatedWorker|Worker/.test(n)) return 'worker';
    return 'renderer-autre';
  };
  const byThread = new Map();
  for (const e of events) {
    const r = role(e[0]);
    if (!r) continue;
    if (!byThread.has(e[0])) byThread.set(e[0], []);
    byThread.get(e[0]).push(e);
  }
  const res = { label, url, phone, W, H, DPR, gpu: gpu?.gpu?.devices?.[0] && `${gpu.gpu.devices[0].vendorString || ''} ${gpu.gpu.devices[0].deviceString || ''}`.trim(), phases: {} };
  for (const [n] of PHASES) res.phases[n] = { ms: 0, main: {}, js: {}, threads: {}, frames: {} };
  PHASES.forEach(([n], i) => (res.phases[n].ms = Math.round(phaseLen(n, i) * 1000) / 1000));
  const add = (o, k, v) => (o[k] = (o[k] || 0) + v);
  const short = (u) => (u || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/the-internet-florist/, '').replace(/\?.*$/, '');
  for (const [key, list] of byThread) {
    const r = role(key);
    for (const e of selfTimes(list)) {
      const p = phaseOf(e.ts);
      if (!p || e.self <= 0) continue;
      const ph = res.phases[p];
      add(ph.threads, r, e.self / 1000);
      if (r === 'main') {
        const b = bucketOf(e.name);
        add(ph.main, b, e.self / 1000);
        if (b === 'js') add(ph.js, short(e.url) || '(sans fichier)', e.self / 1000);
        if (b === 'autre') add(ph.main, `autre:${e.name}`, e.self / 1000);
      }
      if (r === 'raster' || r === 'gpu') add(ph.threads, `${r}:${e.name}`, e.self / 1000);
    }
  }
  // frames the compositor drew or dropped, and the page's own requestAnimationFrame
  for (const [ts, kind] of frames) {
    const p = phaseOf(ts);
    if (p) add(res.phases[p].frames, kind, 1);
  }
  const fr = page.F.frames;
  const pm = page.F.marks;
  PHASES.forEach(([n], i) => {
    const a = pm[n];
    const b = PHASES[i + 1] ? pm[PHASES[i + 1][0]] : pm.fin;
    const f = fr.filter((t) => t >= a && t < b);
    const gaps = f.slice(1).map((t, j) => t - f[j]);
    const ph = res.phases[n];
    ph.raf = {
      fps: Math.round((f.length / ((b - a) / 1000)) * 10) / 10,
      longues: gaps.filter((g) => g > 50).length,
      pire: Math.round(Math.max(0, ...gaps)),
      p95: Math.round(gaps.sort((x, y) => x - y)[Math.floor(gaps.length * 0.95)] || 0),
    };
  });
  // the scripts' functions (sampled profile), per phase
  for (const [ts, u, fn] of samples) {
    const p = phaseOf(ts);
    if (!p) continue;
    const ph = res.phases[p];
    ph.fn ??= {};
    add(ph.fn, `${short(u)} ${fn}`, 1);
  }
  // processes' CPU over each phase (seconds of CPU per second)
  const cpuOf = (info) => {
    const o = {};
    for (const p of info?.processInfo || []) add(o, p.type, p.cpuTime);
    return o;
  };
  const cps = ['chargement', 'repos', 'glisser', 'fin'];
  res.cpu = {};
  for (let i = 0; i < 3; i++) {
    const a = cpuOf(cpuAt[cps[i]]);
    const b = cpuOf(cpuAt[cps[i + 1]]);
    const dt = i === 0 ? PHASES[1][1] / 1000 : (i === 1 ? PHASES[2][1] - PHASES[1][1] : END - PHASES[2][1]) / 1000;
    res.cpu[cps[i]] = Object.fromEntries(Object.keys(b).map((k) => [k, Math.round(((b[k] - (a[k] || 0)) / dt) * 100) / 100]));
  }
  res.heap = heapAt;
  res.layers = layers;
  // network by kind and folder
  const nets = [...net.values()];
  const kind = (u) => {
    const s = short(u);
    if (/\/frise\/[^/]+\/\d+\.svg/.test(s)) return 'frise: tuiles SVG';
    if (/\/frise\/.*\.webp/.test(s)) return 'frise: aperçus WebP';
    if (/\/frise\/piliers/.test(s)) return 'frise: piliers';
    if (/\/premier\//.test(s)) return 'premier plan (touffes)';
    if (/\/bouquets\//.test(s)) return 'bouquets';
    if (/\/insectes\/.*\.(webp|png|json)/.test(s)) return 'insectes: atlas';
    if (/\/insectes\//.test(s)) return 'insectes: code';
    if (/\/out\//.test(s)) return 'décor (ciel, nuages, scene.json)';
    if (/\.(woff2?|ttf)/.test(s)) return 'polices';
    if (/\.(m?js)$/.test(s)) return 'scripts du site';
    if (/coingecko/.test(u)) return 'cours (CoinGecko)';
    return 'autre';
  };
  res.reseau = {};
  for (const r of nets) {
    const k = kind(r.url);
    res.reseau[k] ??= { n: 0, octets: 0, decode: 0 };
    res.reseau[k].n++;
    res.reseau[k].octets += r.bytes;
    res.reseau[k].decode += r.body;
  }
  res.reseauTop = nets
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 25)
    .map((r) => [short(r.url), r.bytes]);
  // pictures held: decoded pixels (an SVG is rasterised at its drawn size times the pixel ratio)
  const imgs = page.imgs.filter((i) => i.done && i.w > 0);
  const group = {};
  for (const i of imgs) {
    const k = kind(i.src);
    const px = i.svg ? i.w * i.h * DPR * DPR : i.nw * i.nh;
    group[k] ??= { n: 0, svg: 0, visibles: 0, mo: 0 };
    group[k].n++;
    if (i.svg) group[k].svg++;
    if (i.vis) group[k].visibles++;
    group[k].mo += (px * 4) / 2 ** 20;
  }
  for (const g of Object.values(group)) g.mo = Math.round(g.mo);
  res.images = group;
  res.canvas = page.canv;
  res.anims = page.anims;
  res.noeuds = page.nodes;
  res.willChange = page.willChange;
  res.jsHeapMo = page.mem && Math.round(page.mem.used / 2 ** 20);
  res.chargement = { ...page.load, res: page.load.res.map(([u, t, d, a, b]) => [short(u), t, d, a, b, kind(u)]) };
  // round
  for (const ph of Object.values(res.phases)) {
    for (const o of [ph.main, ph.js, ph.threads]) for (const k in o) o[k] = Math.round(o[k]);
    if (ph.fn) ph.fn = Object.fromEntries(Object.entries(ph.fn).sort((a, b) => b[1] - a[1]).slice(0, 25));
    ph.js = Object.fromEntries(Object.entries(ph.js).sort((a, b) => b[1] - a[1]));
  }
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(res, null, 1));
  console.log(`${label} ${phone ? 'téléphone' : 'ordinateur'} : ${outFile}`);
} catch (e) {
  console.error(e.stack || e);
  process.exitCode = 1;
} finally {
  await close();
}
