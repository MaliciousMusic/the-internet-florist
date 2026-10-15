// predessin.mjs: pre-draws the bouquets of the shop (decor/scene) once, so the page never runs the flower engine.
//
//   GATE_MAX=2 sh flower-atelier/ws/gate.sh node decor/scene/predessin.mjs [product ids...] [--verifier]
//       [--vignettes-seules] [--seuils '{"TINY":1.5,...}'] [--sortie <dir>] [--sonde]
//
// For each product of boutique.json (or the ids given), it runs the engine (engine.js, built by mkengine.sh from
// flower-claude/demo/src, never edited) in one headless Chrome, draws the bouquet exactly as the shop drew it (buildBq at
// LOD 0, the vessel's own stage and plinth left out, the table shadow hidden), cuts it exactly as growBq / aliveBq do
// (z5.js: same runs, same stacking order, same growth order and times, same breeze), and writes, instead of canvases,
// one folder per bouquet in decor/scene/bouquets/<id>/:
//   - vase-dos.svg, vase.svg: the vessel behind the stems and in front of them (whole from the first frame);
//   - p<NNN>.svg: every other piece of the cut, its exact subset of elements and the defs it uses;
//   - manifeste.json: each piece's box, the origin of its growth, its growth and breeze timings (read by eclosion.js):
//       vb (the drawing's viewBox), boite (its box in the world, 2400 x 1350), courbes (easings), finCroissanceMs, and
//       pieces in stacking order: { f: file, b: [x, y, w, h] its box (user units), t: vase | dedans | tige | ligne | tete,
//       e: the engine element it belongs to (c.list index), o: [x, y] the origin of its growth (and of its breeze), p: for
//       a moving line or drape, its foot, where its growth starts (o is then its joint, round which it sways),
//       g: [delay, duration, easing index] its growth (scale .001 -> 1), z: [degrees, period, delay] its breeze };
//   - vignette.svg: the light thumbnail of the card (the same bouquet at LOD 1, without what cannot be seen at 120 px).
// It also writes the prices into boutique.json (the sum of the real prices of the stems, the vessel offered, in ETH at the
// configured rate): the page no longer computes them.
// --verifier: the assembled pieces (eclosion.js in its final state) against the whole drawing, both drawn by Chrome at
// the same size, pixel by pixel (result in manifeste.json "verification", images in PD_SCRATCH).
// --vignettes-seules: only the thumbnails, written to PD_SCRATCH with a side-by-side image (LOD 1 | light) to tune the
// thresholds given by --seuils (see TH). --sortie <dir>: bouquets written elsewhere, boutique.json untouched.
// --sonde: prints what the drawing is made of. Later, at minting: one product object in boutique.json, then its id here.
//
// One Chrome, its own throwaway profile (CHROME_PROFILE) and port; closed at the end, whatever happens. It refuses to start
// under 5 GB of free memory. Its own small static server serves decor/scene (port PD_PORT, 8797 by default).
import { spawn } from 'node:child_process';
import { freemem } from 'node:os';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const CDP_PORT = Number(process.env.PD_CDP || 9362);
const HTTP_PORT = Number(process.env.PD_PORT || 8797);
const PROFILE = process.env.CHROME_PROFILE || join(process.env.TEMP || '.', 'predessin-chrome');
const SCRATCH = process.env.PD_SCRATCH || join(process.env.TEMP || '.', 'predessin');
const argv = process.argv.slice(2);
const argOf = (k) => {
  const i = argv.indexOf(k);
  if (i < 0) return null;
  const v = argv[i + 1];
  argv.splice(i, 2);
  return v;
};
// --sortie <dir>: write the bouquets elsewhere (trials), boutique.json untouched
const OUT_ARG = argOf('--sortie');
const OUT = OUT_ARG ? resolve(OUT_ARG) : join(HERE, 'bouquets');
const VERIFY = argv.includes('--verifier');
const SEUILS = argOf('--seuils');
const THUMBS_ONLY = argv.includes('--vignettes-seules');
const PROBE = argv.includes('--sonde');
const WANT = argv.filter((a) => !a.startsWith('--'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (freemem() < 5 * 2 ** 30) {
  console.error(`mémoire libre ${(freemem() / 2 ** 30).toFixed(1)} Go < 5 Go : pas de Chrome`);
  process.exit(2);
}

// ---------- the small static server (decor/scene, plus a few pages made here)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.css': 'text/css', '.png': 'image/png' };
const virtual = new Map();
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (virtual.has(path)) {
    const [type, body] = virtual.get(path);
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
    return res.end(body);
  }
  const file = resolve(HERE, '.' + path);
  if (!file.startsWith(HERE) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(HTTP_PORT, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${HTTP_PORT}`;
virtual.set('/__pd.html', ['text/html', '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#fff"><script src="engine.js"></script></body></html>']);

// ---------- one headless Chrome through the DevTools protocol
mkdirSync(PROFILE, { recursive: true });
const chrome = spawn(CHROME, ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${PROFILE}`, '--window-size=1600,1200', 'about:blank'], { stdio: 'ignore' });
let exited = false;
chrome.on('exit', () => (exited = true));
let ws;
let seq = 0;
const wait = new Map();
const handlers = [];
function send(method, params = {}) {
  const i = ++seq;
  ws.send(JSON.stringify({ id: i, method, params }));
  return new Promise((res, rej) => wait.set(i, { res, rej, method }));
}
async function connect() {
  for (let k = 0; k < 80; k++) {
    try {
      const list = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((r) => r.json());
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
async function navigate(url) {
  await send('Page.navigate', { url });
  await until(`document.readyState === 'complete'`, 60000, 100);
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

// ---------- what runs in the page, next to the engine
function pageCode() {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const XS = new XMLSerializer();
  const PD = (window.PD = {});
  let CFG = null;
  const r1 = (x) => Math.round(x * 10) / 10;

  PD.init = (cfg) => {
    CFG = cfg;
    // the cast bronze at the scene's size only, as the shop did (the engine would also make it at its own two sizes)
    CAST_S = cfg.scene.bronzeS || 3;
    for (const v of VZ0) if (v.cast) for (const s of [6, 2.5]) if (s !== CAST_S) CAST_JOBS[`${v.id}|${s}`] = Promise.resolve(null);
    return { castS: CAST_S };
  };

  // ---- the shop's own drawing (boutique.js before 2026-10-15 evening, unchanged)
  function draw(svg, p, lod) {
    const L0 = LOD;
    LOD = lod;
    const v = VZ[p.vase];
    const keep = v ? { st: v.st, sf: v.sf } : null;
    if (v) {
      v.st = null;
      v.sf = 'none';
    }
    DEPTH_BG = CFG.scene.fondProfondeur || DEPTH_BG;
    let c = null;
    try {
      renderStatic(() => {
        if (p.recette) {
          const ids = p.recette.map((r) => r[0]).filter((id) => PBY[id]);
          PLANOPT = { qty: new Map(p.recette.map((r) => [r[0], r[1]])), pos: new Map(p.recette.map((r) => [r[0], r[2]])), noAdds: true };
          c = buildBq(svg, ids, p.graine, p.vase, 0, 'juste', null);
        } else {
          const m = MODELS.find((x) => x.n === p.modele);
          c = buildBq(svg, [], p.graine, p.vase, 0, null, m);
        }
      });
    } finally {
      PLANOPT = null;
      DEPTH_BG = '#efe8de';
      LOD = L0;
      idle.length = 0;
      if (v) Object.assign(v, keep);
    }
    return c;
  }
  function checkStems(c, p) {
    const got = {};
    for (const o of c.out) if (o.kind !== 'garnish' && o.it && o.it.p) got[o.it.p.sid] = (got[o.it.p.sid] || 0) + 1;
    const bad = p.tiges.filter(([sid, n]) => (got[sid] || 0) !== n).map(([sid, n]) => `${sid} ${got[sid] || 0}/${n}`);
    const extra = Object.keys(got).filter((sid) => !p.tiges.some((t) => t[0] === sid));
    const price = p.tiges.filter(([sid, , cts]) => RBY[sid] && RBY[sid].price !== cts).map(([sid]) => sid);
    return { bad, extra, price, dessinees: got };
  }
  function hideTableShadow(svg) {
    for (const p of svg.querySelectorAll('[data-l=vback] path[fill^="url(#vs"]')) p.setAttribute('display', 'none');
  }
  // the bouquet's box in the world (2400 x 1350): the vessel's foot (VX, FL) on the pillar's top, at the configured scale,
  // reduced only when it would rise into the cards or overflow the phone's column (the shop's place())
  function place(vb) {
    const [vx, vy, vw, vh] = vb;
    const sc = CFG.scene;
    const [fx, fy] = sc.pied;
    let s = sc.echelle;
    const why = [];
    if (fy - (FL - vy) * s < sc.sommetMin) {
      s = (fy - sc.sommetMin) / (FL - vy);
      why.push('hauteur');
    }
    const half = Math.max(VX - vx, vx + vw - VX);
    if (half * s > sc.largeurMax / 2) {
      s = sc.largeurMax / 2 / half;
      why.push('largeur');
    }
    const x0 = fx - (VX - vx) * s;
    const y0 = fy - (FL - vy) * s;
    return { boite: [x0, y0, vw * s, vh * s].map((x) => Math.round(x * 100) / 100), s, naturel: Math.round(FL - vy), demiLargeur: Math.round(half), sommet: Math.round(y0), reduit: why.join('+') || null };
  }
  const castReady = {};
  function cast(vid, s) {
    const v = VZ[vid];
    if (!v || !v.cast || !v.prof) return Promise.resolve();
    return (castReady[vid + '|' + s] ||= castRequest(v, profSamples(v.prof, 90), s));
  }

  // ---- a drawing in a host laid out at K pixels per unit, so boxes can be measured
  function mount(svg, K) {
    const vb = svg.getAttribute('viewBox').trim().split(/[\s,]+/).map(Number);
    const host = svg.parentNode;
    host.style.cssText = `position:absolute;left:0;top:0;width:${vb[2] * K}px;height:${vb[3] * K}px;overflow:visible`;
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;overflow:visible';
    return vb;
  }
  function newHost() {
    document.querySelectorAll('.pd-host').forEach((h) => h.remove());
    const host = document.createElement('div');
    host.className = 'pd-host';
    const svg = document.createElementNS(NS, 'svg');
    host.append(svg);
    document.body.append(host);
    return svg;
  }

  // ---- the defs a piece refers to (gradients, clips, masks, filters), with those they refer to in turn (z5.js defsOf)
  function defsOf(svg, xml) {
    const find = (id) => {
      const q = '#' + CSS.escape(id);
      return svg.querySelector(q) || document.getElementById(id) || (typeof defs !== 'undefined' && defs.querySelector && defs.querySelector(q));
    };
    let out = '';
    const seen = new Set();
    const add = (x) => {
      for (const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)) {
        const id = m[1] || m[2];
        if (seen.has(id)) continue;
        seen.add(id);
        const el = find(id);
        if (el) {
          const s = clean(XS.serializeToString(el));
          out += s;
          add(s);
        }
      }
    };
    add(xml);
    return out;
  }
  // lossless cleaning of a serialized node: the namespace repeated on every node (the file declares it once), the
  // engine's data-* tags (they draw nothing)
  function clean(s) {
    return s.replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '').replace(/ data-[a-z]+="[^"]*"/g, '');
  }
  // a node as it draws: elements set to display="none" draw nothing and go (the table shadow of the old shop)
  function serialize(n) {
    if (n.getAttribute && n.getAttribute('display') === 'none') return '';
    if (!n.querySelector || !n.querySelector('[display=none]')) return clean(XS.serializeToString(n));
    const k = n.cloneNode(true);
    for (const h of k.querySelectorAll('[display=none]')) h.remove();
    return clean(XS.serializeToString(k));
  }
  const svgFile = (box, defsXml, body) =>
    `<svg xmlns="${NS}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${box.join(' ')}" width="${box[2]}" height="${box[3]}" preserveAspectRatio="none">${defsXml ? `<defs>${defsXml}</defs>` : ''}${body}</svg>`;

  // ---- the cut of growBq / aliveBq (z5.js), with the growth of growIn and the breeze, for pieces instead of canvases
  PD.build = async (p, opt = {}) => {
    const PAD = opt.pad ?? 30; // the engine pads each image by 16 screen pixels: about 30 units at the scene's scale
    await cast(p.vase, CAST_S);
    const svg = newHost();
    const t0 = performance.now();
    const c = draw(svg, p, 0);
    const vb = mount(svg, 1);
    hideTableShadow(svg);
    const tDraw = performance.now() - t0;
    const chk = checkStems(c, p);
    // the whole drawing as the engine made it, for the check
    const refWhole = [...svg.children].filter((n) => n.tagName !== 'defs').map(serialize).join('');
    const ref = svgFile(vb, defsOf(svg, refWhole), refWhole);
    // the runs, exactly as aliveBq builds them when the bouquet grows in
    const STEMLY = { stems: 1, fst: 1 };
    const owner = (n) => (!n.getAttribute ? null : n.hasAttribute('data-in') ? 'in' : n.getAttribute('data-so') != null ? n.getAttribute('data-so') : n.getAttribute('data-o'));
    const runs = [];
    let cur = null;
    const still = (n, l) => {
      const g = owner(n);
      if (!cur || cur.m || cur.l !== l || cur.g !== g) {
        cur = { nodes: [], m: null, l, g };
        runs.push(cur);
      }
      cur.nodes.push(n);
    };
    for (const g of [...svg.children]) {
      const l = g.getAttribute && g.getAttribute('data-l');
      if (!l) continue;
      if (!ALIVE_DYN[l]) {
        if (STEMLY[l]) {
          for (const ch of [...g.children]) still(ch, l);
        } else {
          if (!cur || cur.m || cur.l !== l) {
            cur = { nodes: [], m: null, l, g: null };
            runs.push(cur);
          }
          cur.nodes.push(g);
        }
        continue;
      }
      for (const ch of [...g.children]) {
        const k = ch.getAttribute('data-o');
        const mo = k != null ? aliveMotion(c.list[+k]) : null;
        if (mo) {
          if (!cur || cur.key !== k) {
            cur = { nodes: [], m: mo, key: k, i: +k, l };
            runs.push(cur);
          }
          cur.nodes.push(ch);
        } else still(ch, l);
      }
    }
    // each run's box in user units: its nodes' boxes, padded, kept within the drawing's frame (padded too)
    const inv = svg.getScreenCTM().inverse();
    const U = (x, y) => {
      const q = svg.createSVGPoint();
      q.x = x;
      q.y = y;
      return q.matrixTransform(inv);
    };
    const done = [];
    for (const r of runs) {
      let x0 = 1e9;
      let y0 = 1e9;
      let x1 = -1e9;
      let y1 = -1e9;
      for (const n of r.nodes) {
        const b = n.getBoundingClientRect();
        if (!b.width && !b.height) continue;
        x0 = Math.min(x0, b.left);
        y0 = Math.min(y0, b.top);
        x1 = Math.max(x1, b.right);
        y1 = Math.max(y1, b.bottom);
      }
      if (x1 <= x0 || y1 <= y0) continue;
      const a = U(x0, y0);
      const b = U(x1, y1);
      const bx0 = Math.floor(Math.max(vb[0] - PAD, a.x - PAD));
      const by0 = Math.floor(Math.max(vb[1] - PAD, a.y - PAD));
      const bx1 = Math.ceil(Math.min(vb[0] + vb[2] + PAD, b.x + PAD));
      const by1 = Math.ceil(Math.min(vb[1] + vb[3] + PAD, b.y + PAD));
      if (bx1 <= bx0 || by1 <= by0) continue;
      done.push({ r, box: [bx0, by0, bx1 - bx0, by1 - by0] });
    }
    // growIn: the order and times of every element, the origin of each piece's growth
    const VES = { plinth: 1, vback: 1, vase: 1 };
    const BP = c.BP || [VX, FL - 100];
    const list = c.list;
    const foot = (o) => (o.stemP && o.stemP[0] ? o.stemP[0] : o.spine && o.spine[0] ? [o.x + o.spine[0][0], o.y + o.spine[0][1]] : BP);
    const els = new Set();
    for (const d of done) {
      const i = d.r.m ? d.r.i : d.r.g != null && d.r.g !== 'in' ? +d.r.g : NaN;
      if (i >= 0 && list[i]) els.add(i);
    }
    const pr = (o) => (o.kind === 'self' || o.kind === 'drape' ? 0 : o.kind === 'head' ? (o.role === 'focal' ? 1 : o.role === 'second' ? 2 : 3) : 2.5);
    const hs = (i) => Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
    const order = [...els].sort((a, b) => pr(list[a]) - pr(list[b]) || hs(a) - hs(b));
    const n = order.length;
    const t0m = new Map();
    order.forEach((i, k) => t0m.set(i, GROW.from + (n > 1 ? k / (n - 1) : 0) * GROW.spread));
    const EASE = { stem: 'cubic-bezier(.22,.6,.3,1)', open: 'cubic-bezier(.3,1.35,.45,1)', inside: 'cubic-bezier(.25,.1,.3,1)' };
    const courbes = [EASE.stem, EASE.open, EASE.inside];
    const ei = (e) => courbes.indexOf(e);
    for (const d of done) {
      const r = d.r;
      d.kind = 'fixe';
      if (!r.m && VES[r.l]) {
        d.kind = 'vase';
        continue;
      }
      if (r.g === 'in') {
        d.kind = 'dedans';
        d.o = BP;
        d.g = [GROW.from, GROW.inside, ei(EASE.inside)];
        continue;
      }
      const i = r.m ? r.i : r.g != null ? +r.g : NaN;
      const o = list[i];
      if (!o || !t0m.has(i)) continue;
      const ts = t0m.get(i);
      d.e = i;
      if (!r.m || o.kind === 'self' || o.kind === 'drape') {
        d.kind = r.m ? 'ligne' : 'tige';
        d.o = foot(o);
        d.g = [ts, GROW.stem, ei(EASE.stem)];
        if (r.m) {
          d.end = ts + GROW.stem;
          // a moving line or drape keeps its foot: it grows out of the mouth from it (growIn), and sways round its joint
          d.pied = foot(o);
          if (o.kind === 'drape') d.drape = true;
        }
        continue;
      }
      d.kind = 'tete';
      d.o = r.m.j;
      d.g = [ts + GROW.lag, GROW.open, ei(EASE.open)];
      d.end = ts + GROW.lag + GROW.open;
    }
    // the breeze (aliveBq): each moving piece swings round its joint, from rest, after its growth and a light hold;
    // its transform origin is the joint for the growth too (the engine sets it last, over the growth's own)
    for (const d of done) {
      const r = d.r;
      if (!r.m) continue;
      const { A, T, j } = r.m;
      const h = Math.abs(Math.sin((r.i + 1) * 12.9898) * 43758.5453) % 1;
      const sg = h < 0.5 ? -1 : 1;
      const a2 = +(A * (0.85 + 0.3 * h)).toFixed(3);
      const T2 = T * (0.88 + 0.24 * ((h * 7) % 1));
      d.o = j;
      d.z = [sg * a2, Math.round(T2 * 2000), Math.round((d.end || 0) + h * 1500)];
    }
    // pieces: consecutive vessel runs make one file (the plinth and the back of the vessel, all still from the first frame)
    const pieces = [];
    const files = {};
    let vesselN = 0;
    let k = 0;
    const tSer = performance.now();
    for (let a = 0; a < done.length; a++) {
      const d = done[a];
      let group = [d];
      if (d.kind === 'vase') while (done[a + 1] && done[a + 1].kind === 'vase') group.push(done[++a]);
      const body = group.map((x) => x.r.nodes.map(serialize).join('')).join('');
      if (!body) continue;
      let box = group[0].box;
      if (group.length > 1) {
        const x0 = Math.min(...group.map((x) => x.box[0]));
        const y0 = Math.min(...group.map((x) => x.box[1]));
        const x1 = Math.max(...group.map((x) => x.box[0] + x.box[2]));
        const y1 = Math.max(...group.map((x) => x.box[1] + x.box[3]));
        box = [x0, y0, x1 - x0, y1 - y0];
      }
      const name = d.kind === 'vase' ? (vesselN++ === 0 ? 'vase-dos.svg' : vesselN === 2 ? 'vase.svg' : `vase-${vesselN}.svg`) : `p${String(++k).padStart(3, '0')}.svg`;
      files[name] = svgFile(box, defsOf(svg, body), body);
      const pc = { f: name, b: box, t: d.kind };
      if (d.e != null) pc.e = d.e;
      if (d.o) pc.o = [r1(d.o[0]), r1(d.o[1])];
      if (d.g) pc.g = d.g.map((x) => Math.round(x));
      if (d.z) pc.z = d.z;
      if (d.pied) pc.p = [r1(d.pied[0]), r1(d.pied[1])];
      pieces.push(pc);
    }
    const pl = place(vb);
    const stats = {
      dessinMs: Math.round(tDraw),
      decoupeMs: Math.round(performance.now() - tSer),
      elements: svg.getElementsByTagName('*').length,
      runs: runs.length,
      pieces: pieces.length,
      parCouche: pieces.reduce((a, x) => ((a[x.t] = (a[x.t] || 0) + 1), a), {}),
      drapes: done.filter((d) => d.drape).length,
    };
    const fin = Math.max(...pieces.map((x) => (x.g ? x.g[0] + x.g[1] : 0)));
    const manifest = {
      version: 1,
      produit: p.id,
      vb,
      pied: [VX, FL],
      boite: pl.boite,
      echelle: { s: +pl.s.toFixed(4), naturel: pl.naturel, demiLargeur: pl.demiLargeur, sommet: pl.sommet, reduit: pl.reduit },
      courbes,
      finCroissanceMs: Math.round(fin),
      tiges: chk,
      pieces,
    };
    return { manifest, files, ref, stats };
  };

  // ---- the light thumbnail of a card: the same bouquet at LOD 1 (the engine's own light level), without what cannot be
  // seen on a card (an art box of 113.5 x 101.8 CSS pixels at most, at 2 device pixels per CSS pixel): elements under
  // TINY device pixels, strokes thinner than HAIR, blurs under BLUR, gradients on elements under FLAT (their mean colour
  // instead); every path redrawn as a polyline within TOL device pixels of it, on a grid of about that. Nothing is drawn
  // by hand: every kept element is the engine's, only made coarser.
  const TH = { TINY: 1.5, HAIR: 0.6, CONTRAST: 60, MICRO: 0.6, SPECK: 0, BLUR: 1.5, FLAT: 12, SPREAD: 10, FAINT: 0.15, TOL: 0.5, ART: [113.5, 101.8], DPR: 2 };
  const scaleOf = (e) => {
    const M = e.getCTM();
    return M ? Math.sqrt(Math.abs(M.a * M.d - M.b * M.c)) || 1 : 1;
  };
  // the scale of the transforms between an element and an ancestor (inside a marker, which has no CTM of its own)
  const scaleIn = (e, top) => {
    let k = 1;
    for (let n = e; n && n !== top; n = n.parentNode) {
      const t = n.transform && n.transform.baseVal && n.transform.baseVal.consolidate();
      if (t) k *= Math.sqrt(Math.abs(t.matrix.a * t.matrix.d - t.matrix.b * t.matrix.c)) || 1;
    }
    return k;
  };
  // a paint's mean colour and opacity: a gradient's stops averaged along it (radial: by area)
  function rgbOf(s) {
    const m = /^rgba?\(([^)]+)\)/.exec(s);
    if (m) {
      const v = m[1].split(/[\s,/]+/).map(Number);
      return [v[0], v[1], v[2], v[3] ?? 1];
    }
    return null;
  }
  function meanPaint(svg, url) {
    const id = /url\(["']?#([^"')]+)/.exec(url);
    if (!id) return null;
    const find = (x) => svg.querySelector('#' + CSS.escape(x)) || document.getElementById(x);
    const g = find(id[1]);
    if (!g || !/Gradient$/.test(g.tagName)) return null;
    const radial = g.tagName === 'radialGradient';
    let stopsEl = g;
    for (let n = 0; n < 5 && !stopsEl.querySelector('stop'); n++) {
      const h = stopsEl.getAttribute('href') || stopsEl.getAttribute('xlink:href');
      if (!h) break;
      stopsEl = find(h.slice(1)) || stopsEl;
    }
    const st = [...stopsEl.querySelectorAll('stop')].map((s) => {
      const cs = getComputedStyle(s);
      const c = rgbOf(cs.stopColor) || [0, 0, 0, 1];
      return [Math.max(0, Math.min(1, parseFloat(s.getAttribute('offset')) || 0)), c[0], c[1], c[2], c[3] * parseFloat(cs.stopOpacity)];
    });
    if (!st.length) return null;
    // piecewise linear, flat before the first stop and after the last; premultiplied by opacity, weighted by t for radial
    const N = 48;
    let r = 0;
    let gg = 0;
    let b = 0;
    let a = 0;
    let w = 0;
    for (let i = 0; i < N; i++) {
      const t = (i + 0.5) / N;
      let k = 0;
      while (k < st.length - 1 && st[k + 1][0] < t) k++;
      const A = st[k];
      const B = st[Math.min(st.length - 1, k + 1)];
      const u = t <= A[0] ? 0 : B[0] > A[0] ? Math.min(1, (t - A[0]) / (B[0] - A[0])) : 1;
      const v = [1, 2, 3, 4].map((j) => A[j] + (B[j] - A[j]) * u);
      const wt = radial ? t : 1;
      r += v[0] * v[3] * wt;
      gg += v[1] * v[3] * wt;
      b += v[2] * v[3] * wt;
      a += v[3] * wt;
      w += wt;
    }
    if (a <= 0) return { color: '#000', alpha: 0, spread: 0 };
    const hex = (x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0');
    const mc = [r / a, gg / a, b / a, a / w];
    // how far its stops stray from that mean (0-255): a gradient that hardly changes is a flat colour at any size
    const spread = Math.max(...st.map((x) => Math.max(Math.abs(x[1] - mc[0]), Math.abs(x[2] - mc[1]), Math.abs(x[3] - mc[2]), 255 * Math.abs(x[4] - mc[3]))));
    return { color: `#${hex(mc[0])}${hex(mc[1])}${hex(mc[2])}`, alpha: mc[3], spread };
  }
  // ---- paths: parsed to absolute segments, flattened, simplified (Ramer-Douglas-Peucker), written back as polylines
  function parsePath(d) {
    const out = [];
    let i = 0;
    const n = d.length;
    const ws = () => {
      while (i < n && (d[i] === ' ' || d[i] === ',' || d[i] === '\n' || d[i] === '\t' || d[i] === '\r')) i++;
    };
    const RE = /[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/y;
    const num = () => {
      ws();
      RE.lastIndex = i;
      const m = RE.exec(d);
      if (!m) return null;
      i += m[0].length;
      return +m[0];
    };
    const flag = () => {
      ws();
      const ch = d[i];
      if (ch === '0' || ch === '1') {
        i++;
        return +ch;
      }
      return null;
    };
    const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
    let cmd = null;
    for (;;) {
      ws();
      if (i >= n) break;
      if (/[a-zA-Z]/.test(d[i])) cmd = d[i++];
      else if (!cmd || cmd === 'z' || cmd === 'Z') return null;
      const k = ARGS[cmd.toLowerCase()];
      if (k == null) return null;
      if (!k) {
        out.push([cmd]);
        continue;
      }
      const args = [];
      for (let j = 0; j < k; j++) {
        const v = cmd.toLowerCase() === 'a' && (j === 3 || j === 4) ? flag() : num();
        if (v == null) return null;
        args.push(v);
      }
      out.push([cmd, ...args]);
      if (cmd === 'm') cmd = 'l';
      else if (cmd === 'M') cmd = 'L';
    }
    return out;
  }
  // subpaths as point lists (closed or not), curves sampled finely enough for the tolerance
  function flatten(segs, tol) {
    const subs = [];
    let cur = null;
    let x = 0;
    let y = 0;
    let sx = 0;
    let sy = 0;
    let lc = null;
    let lq = null;
    const samp = (pts, fn, len) => {
      const k = Math.max(1, Math.min(32, Math.ceil(Math.sqrt(len / Math.max(tol, 1e-3)))));
      for (let s = 1; s <= k; s++) pts.push(fn(s / k));
    };
    for (const sg of segs) {
      const c = sg[0];
      const rel = c === c.toLowerCase() && c !== 'z';
      const C = c.toUpperCase();
      const a = sg.slice(1);
      const P = (j) => [a[j] + (rel ? x : 0), a[j + 1] + (rel ? y : 0)];
      if (C === 'M') {
        [x, y] = P(0);
        sx = x;
        sy = y;
        cur = { pts: [[x, y]], closed: false };
        subs.push(cur);
        lc = lq = null;
        continue;
      }
      if (!cur) {
        cur = { pts: [[x, y]], closed: false };
        subs.push(cur);
      }
      if (C === 'Z') {
        cur.closed = true;
        x = sx;
        y = sy;
        cur = null;
        lc = lq = null;
        continue;
      }
      if (C === 'L') {
        [x, y] = P(0);
        cur.pts.push([x, y]);
        lc = lq = null;
      } else if (C === 'H') {
        x = a[0] + (rel ? x : 0);
        cur.pts.push([x, y]);
        lc = lq = null;
      } else if (C === 'V') {
        y = a[0] + (rel ? y : 0);
        cur.pts.push([x, y]);
        lc = lq = null;
      } else if (C === 'C' || C === 'S') {
        const p0 = [x, y];
        let p1;
        let p2;
        let p3;
        if (C === 'C') {
          p1 = P(0);
          p2 = P(2);
          p3 = P(4);
        } else {
          p1 = lc ? [2 * x - lc[0], 2 * y - lc[1]] : [x, y];
          p2 = P(0);
          p3 = P(2);
        }
        const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) + Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
        samp(
          cur.pts,
          (t) => {
            const u = 1 - t;
            return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
          },
          len,
        );
        lc = p2;
        lq = null;
        [x, y] = p3;
      } else if (C === 'Q' || C === 'T') {
        const p0 = [x, y];
        let p1;
        let p2;
        if (C === 'Q') {
          p1 = P(0);
          p2 = P(2);
        } else {
          p1 = lq ? [2 * x - lq[0], 2 * y - lq[1]] : [x, y];
          p2 = P(0);
        }
        const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        samp(
          cur.pts,
          (t) => {
            const u = 1 - t;
            return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
          },
          len,
        );
        lq = p1;
        lc = null;
        [x, y] = p2;
      } else if (C === 'A') {
        // an elliptical arc, sampled through its centre parametrisation
        const [rx0, ry0, phi, fa, fs] = a;
        const [x2, y2] = P(5);
        let rx = Math.abs(rx0);
        let ry = Math.abs(ry0);
        if (!rx || !ry) cur.pts.push([x2, y2]);
        else {
          const cp = Math.cos((phi * Math.PI) / 180);
          const sp = Math.sin((phi * Math.PI) / 180);
          const dx = (x - x2) / 2;
          const dy = (y - y2) / 2;
          const x1p = cp * dx + sp * dy;
          const y1p = -sp * dx + cp * dy;
          const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
          if (lam > 1) {
            rx *= Math.sqrt(lam);
            ry *= Math.sqrt(lam);
          }
          const nu = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
          const de = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
          let co = de ? Math.sqrt(Math.max(0, nu / de)) : 0;
          if (fa === fs) co = -co;
          const cxp = (co * rx * y1p) / ry;
          const cyp = (-co * ry * x1p) / rx;
          const cx = cp * cxp - sp * cyp + (x + x2) / 2;
          const cy = sp * cxp + cp * cyp + (y + y2) / 2;
          const ang = (ux, uy, vx, vy) => {
            const s = ux * vy - uy * vx < 0 ? -1 : 1;
            return s * Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy) || 1))));
          };
          const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
          let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
          if (!fs && dt > 0) dt -= 2 * Math.PI;
          else if (fs && dt < 0) dt += 2 * Math.PI;
          samp(
            cur.pts,
            (t) => {
              const th = t1 + dt * t;
              return [cx + rx * Math.cos(th) * cp - ry * Math.sin(th) * sp, cy + rx * Math.cos(th) * sp + ry * Math.sin(th) * cp];
            },
            Math.abs(dt) * Math.max(rx, ry),
          );
        }
        [x, y] = [x2, y2];
        lc = lq = null;
      }
    }
    return subs;
  }
  function rdp(pts, tol) {
    if (pts.length < 3) return pts;
    const keep = new Uint8Array(pts.length);
    keep[0] = keep[pts.length - 1] = 1;
    const st = [[0, pts.length - 1]];
    while (st.length) {
      const [a, b] = st.pop();
      const [ax, ay] = pts[a];
      const [bx, by] = pts[b];
      const dx = bx - ax;
      const dy = by - ay;
      const L = Math.hypot(dx, dy);
      let best = -1;
      let bi = -1;
      for (let i = a + 1; i < b; i++) {
        const [px, py] = pts[i];
        const dd = L ? Math.abs(dx * (ay - py) - dy * (ax - px)) / L : Math.hypot(px - ax, py - ay);
        if (dd > best) {
          best = dd;
          bi = i;
        }
      }
      if (best > tol) {
        keep[bi] = 1;
        st.push([a, bi], [bi, b]);
      }
    }
    return pts.filter((_, i) => keep[i]);
  }
  // numbers on a decimal grid near the tolerance, written short (".5", "-3"), joined with the fewest separators
  function writePoly(subs, tol, minDim = 0) {
    const D = Math.max(0, Math.min(2, Math.ceil(-Math.log10(Math.max(tol, 1e-3)))));
    const fmtN = (v, d = D) => {
      let s = (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);
      if (d) s = s.replace(/0+$/, '').replace(/\.$/, '');
      s = s.replace(/^(-?)0\./, '$1.');
      return s === '-0' ? '0' : s;
    };
    const join = (nums) => {
      let s = '';
      let dot = false;
      for (const t of nums) {
        if (s && !(t[0] === '-' || (t[0] === '.' && dot))) s += ' ';
        s += t;
        dot = t.includes('.');
      }
      return s;
    };
    let out = '';
    let px = 0;
    let py = 0;
    let pD = D;
    let first = true;
    for (const sp of subs) {
      let pts = sp.pts;
      // a small shape (a floret, a speck) keeps its shape: its own tolerance is a fifth of its size at most
      let sx0 = Infinity;
      let sy0 = Infinity;
      let sx1 = -Infinity;
      let sy1 = -Infinity;
      for (const [x, y] of pts) {
        sx0 = Math.min(sx0, x);
        sy0 = Math.min(sy0, y);
        sx1 = Math.max(sx1, x);
        sy1 = Math.max(sy1, y);
      }
      const size = Math.max(sx1 - sx0, sy1 - sy0);
      if (minDim > 0 && size < minDim) continue;
      const t2 = Math.min(tol, Math.max(size * 0.2, tol * 0.05));
      const D2 = Math.max(D, Math.min(D + 1, 3, Math.ceil(-Math.log10(Math.max(t2, 1e-3)))));
      const G2 = 10 ** D2;
      if (sp.closed && pts.length > 3) {
        // a closed outline: split at its farthest point from the start, so both halves simplify well
        let fi = 0;
        let fd = -1;
        for (let i = 1; i < pts.length; i++) {
          const dd = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]);
          if (dd > fd) {
            fd = dd;
            fi = i;
          }
        }
        pts = rdp(pts.slice(0, fi + 1), t2).concat(rdp(pts.slice(fi).concat([pts[0]]), t2).slice(1, -1));
      } else pts = rdp(pts, t2);
      const R = pts.map(([x, y]) => [Math.round(x * G2) / G2, Math.round(y * G2) / G2]);
      // the repeats rounding made go
      const P = R.filter((p, i) => i === 0 || p[0] !== R[i - 1][0] || p[1] !== R[i - 1][1]);
      if (P.length < 2 && !sp.closed) continue;
      const m = P[0];
      if (first) {
        out += 'M' + join([fmtN(m[0], D2), fmtN(m[1], D2)]);
        first = false;
      } else out += 'm' + join([fmtN(m[0] - px, Math.max(pD, D2)), fmtN(m[1] - py, Math.max(pD, D2))]);
      pD = D2;
      px = m[0];
      py = m[1];
      if (P.length > 1) {
        const nums = [];
        for (let i = 1; i < P.length; i++) {
          nums.push(fmtN(P[i][0] - px, D2), fmtN(P[i][1] - py, D2));
          px = P[i][0];
          py = P[i][1];
        }
        out += 'l' + join(nums);
      }
      if (sp.closed) {
        out += 'z';
        px = m[0];
        py = m[1];
      }
    }
    return out;
  }
  function simplifyD(d, tol, minDim = 0) {
    const segs = parsePath(d);
    if (!segs) return d;
    const w = writePoly(flatten(segs, tol / 3), tol, minDim);
    if (minDim > 0 && !w) return '';
    return w && w.length < d.length ? w : d;
  }

  // the drawing at the card's size, some elements left out, as pixels (over nothing: the sky is put under it by the caller)
  const SKY = [157, 191, 224];
  async function renderAt(svg, vb, q, hide) {
    const old = hide.map((e) => e.getAttribute('display'));
    for (const e of hide) e.setAttribute('display', 'none');
    const whole = [...svg.children].filter((n) => n.tagName !== 'defs').map(serialize).join('');
    const src = svgFile(vb, defsOf(svg, whole), whole);
    hide.forEach((e, i) => (old[i] == null ? e.removeAttribute('display') : e.setAttribute('display', old[i])));
    const W = Math.max(1, Math.ceil(vb[2] * q));
    const H = Math.max(1, Math.ceil(vb[3] * q));
    const im = await new Promise((res, rej) => {
      const x = new Image();
      x.onload = () => res(x);
      x.onerror = rej;
      x.src = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }));
    });
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(im, 0, 0, W, H);
    return cx.getImageData(0, 0, W, H);
  }

  PD.thumb = async (p, o = {}) => {
    const T = Object.assign({}, TH, o.seuils || {});
    const sCast = o.castS ?? 1;
    await cast(p.vase, sCast);
    const keepS = CAST_S;
    CAST_S = sCast;
    const svg = newHost();
    let c;
    try {
      c = draw(svg, p, 1);
    } finally {
      CAST_S = keepS;
    }
    const vb = mount(svg, 1);
    const q = T.DPR * Math.min(T.ART[0] / vb[2], T.ART[1] / vb[3]);
    const wholeLod1 = [...svg.children].filter((n) => n.tagName !== 'defs').map(serialize).join('');
    const lod1 = svgFile(vb, defsOf(svg, wholeLod1), wholeLod1);
    const st = { tiny: 0, hair: 0, strokeOff: 0, flat: 0, blur: 0, paths: 0 };
    const isDefs = (e) => !!e.closest('defs,clipPath,mask,pattern,marker,symbol');
    const leaves = [...svg.querySelectorAll('path,ellipse,circle,rect,polygon,polyline,line,use,image')].filter((e) => !isDefs(e));
    const info = new Map();
    for (const e of leaves) {
      const b = e.getBoundingClientRect();
      info.set(e, { dim: Math.max(b.width, b.height) * q, k: scaleOf(e), cs: getComputedStyle(e) });
    }
    // what cannot be seen at the card's size goes (an element carrying markers is kept whole: its markers are drawings)
    const hasMarker = (e) => e.hasAttribute('marker-start') || e.hasAttribute('marker-mid') || e.hasAttribute('marker-end') || getComputedStyle(e).markerStart !== 'none' || getComputedStyle(e).markerMid !== 'none' || getComputedStyle(e).markerEnd !== 'none';
    // a small element goes only if it does not stand out from what lies under it (the drawing without the small ones, at
    // the card's size, over the sky): a white floret on a leaf or a speck on a white vessel stays, a speck of leaf on a leaf
    // goes. Standing out: its contrast with what lies under it (0-255) x its opacity, at least CONTRAST
    const isHair = (e) => {
      const { k, cs } = info.get(e);
      const stroked = cs.stroke !== 'none' && parseFloat(cs.strokeOpacity) > 0 && parseFloat(cs.strokeWidth) > 0;
      const filled = cs.fill !== 'none' && parseFloat(cs.fillOpacity) > 0;
      return stroked && !filled && parseFloat(cs.strokeWidth) * k * q < T.HAIR;
    };
    const small = leaves.filter((e) => e.tagName !== 'image' && !hasMarker(e) && (info.get(e).dim < T.TINY || isHair(e)));
    const keepSmall = new Set();
    if (T.CONTRAST > 0 && small.length) {
      const under = await renderAt(svg, vb, q, small);
      for (const e of small) {
        const { cs } = info.get(e);
        const filled = cs.fill !== 'none' && parseFloat(cs.fillOpacity) > 0;
        const paint = filled ? cs.fill : cs.stroke;
        let c = rgbOf(paint);
        let al = (filled ? parseFloat(cs.fillOpacity) : parseFloat(cs.strokeOpacity)) * parseFloat(cs.opacity);
        if (!c) {
          const mp = meanPaint(svg, paint);
          if (!mp) continue;
          c = rgbOf(`rgb(${parseInt(mp.color.slice(1, 3), 16)}, ${parseInt(mp.color.slice(3, 5), 16)}, ${parseInt(mp.color.slice(5, 7), 16)})`);
          al *= mp.alpha;
        } else al *= c[3];
        const b = e.getBoundingClientRect();
        const sr = svg.getBoundingClientRect();
        const px = Math.max(0, Math.min(under.width - 1, Math.round((b.left + b.width / 2 - sr.left) * q)));
        const py = Math.max(0, Math.min(under.height - 1, Math.round((b.top + b.height / 2 - sr.top) * q)));
        const i = (py * under.width + px) * 4;
        const ua = under.data[i + 3] / 255;
        const bg = [0, 1, 2].map((j) => under.data[i + j] * ua + SKY[j] * (1 - ua));
        const contrast = Math.max(...[0, 1, 2].map((j) => Math.abs(c[j] - bg[j])));
        // many small specks make a texture (a vessel's speckles, a spray's florets): a small element that stands out is
        // kept whatever its size, down to MICRO device pixels
        if (contrast * al >= T.CONTRAST && Math.max(b.width, b.height) * q >= T.MICRO) keepSmall.add(e);
      }
      st.keptSmall = keepSmall.size;
    }
    // a stroke taken off: its attributes go, and "none" is written only when the element would inherit one
    const noStroke = (e) => {
      for (const a of ['stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray']) e.removeAttribute(a);
      if (getComputedStyle(e).stroke !== 'none') e.setAttribute('stroke', 'none');
    };
    for (const e of leaves) {
      const { dim, k, cs } = info.get(e);
      if (e.tagName === 'image' || hasMarker(e) || keepSmall.has(e)) continue;
      if (dim < T.TINY) {
        e.remove();
        st.tiny++;
        continue;
      }
      const stroked = cs.stroke !== 'none' && parseFloat(cs.strokeOpacity) > 0 && parseFloat(cs.strokeWidth) > 0;
      const filled = cs.fill !== 'none' && parseFloat(cs.fillOpacity) > 0;
      // a stroke that draws nothing (no width, no opacity) is written for nothing
      if (!stroked && e.hasAttribute('stroke')) {
        noStroke(e);
        if (!filled) {
          e.remove();
          st.tiny++;
          continue;
        }
      }
      if (stroked && parseFloat(cs.strokeWidth) * k * q < T.HAIR) {
        if (!filled) {
          e.remove();
          st.hair++;
          continue;
        }
        noStroke(e);
        st.strokeOff++;
      }
      if (filled && /url\(/.test(cs.fill)) {
        const mp = meanPaint(svg, cs.fill);
        if (mp && (dim < T.FLAT || mp.spread < T.SPREAD)) {
          e.setAttribute('fill', mp.color);
          const fo = parseFloat(cs.fillOpacity) * mp.alpha;
          if (fo < 0.999) e.setAttribute('fill-opacity', +fo.toFixed(3));
          else e.removeAttribute('fill-opacity');
          st.flat++;
        }
      }
    }
    // a stack of layers on one outline (a petal's body, its shading, its light: the same path drawn again and again) is,
    // once every layer is a flat colour, one outline of their composite colour
    const flatPaint = (e) => {
      const cs = getComputedStyle(e);
      if (cs.stroke !== 'none' && parseFloat(cs.strokeOpacity) > 0 && parseFloat(cs.strokeWidth) > 0) return null;
      if (e.hasAttribute('clip-path') || e.hasAttribute('mask') || e.hasAttribute('filter')) return null;
      const c = rgbOf(cs.fill);
      if (!c) return null;
      return [c[0], c[1], c[2], c[3] * parseFloat(cs.fillOpacity) * parseFloat(cs.opacity)];
    };
    const geom = (e) => (e.tagName === 'path' ? 'p' + e.getAttribute('d') : e.tagName === 'use' ? 'u' + (e.getAttribute('href') || e.getAttribute('xlink:href')) : null) + '|' + (e.getAttribute('transform') || '');
    for (const parent of T.MERGE === false ? [] : [...svg.querySelectorAll('g')]) {
      if (isDefs(parent)) continue;
      const kids = [...parent.children];
      for (let i = 0; i < kids.length; i++) {
        const a = kids[i];
        if (a.tagName !== 'path' && a.tagName !== 'use') continue;
        const pa = flatPaint(a);
        if (!pa) continue;
        const key = geom(a);
        let j = i + 1;
        const paints = [pa];
        while (j < kids.length && kids[j].tagName === a.tagName && geom(kids[j]) === key) {
          const pj = flatPaint(kids[j]);
          if (!pj) break;
          paints.push(pj);
          j++;
        }
        if (j - i < 2) continue;
        let [r, g, b, al] = [0, 0, 0, 0];
        for (const [cr, cg, cb, ca] of paints) {
          const na = ca + al * (1 - ca);
          if (na > 0) {
            r = (cr * ca + r * al * (1 - ca)) / na;
            g = (cg * ca + g * al * (1 - ca)) / na;
            b = (cb * ca + b * al * (1 - ca)) / na;
          }
          al = na;
        }
        const hx2 = (x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0');
        a.setAttribute('fill', `#${hx2(r)}${hx2(g)}${hx2(b)}`);
        a.removeAttribute('opacity');
        if (al < 0.999) a.setAttribute('fill-opacity', +al.toFixed(3));
        else a.removeAttribute('fill-opacity');
        for (let m = i + 1; m < j; m++) kids[m].remove();
        st.merged = (st.merged || 0) + j - i - 1;
        i = j - 1;
      }
    }
    // faint and small: a light wash on a few pixels
    for (const e of [...svg.querySelectorAll('path,ellipse,circle,use')]) {
      if (isDefs(e) || !info.has(e) || !e.isConnected) continue;
      const pa = flatPaint(e);
      if (pa && pa[3] < T.FAINT && info.get(e).dim < T.FLAT) {
        e.remove();
        st.faint = (st.faint || 0) + 1;
      }
    }
    // blurs too fine to be seen
    for (const e of [...svg.querySelectorAll('[filter]')]) {
      if (isDefs(e)) continue;
      const id = /url\(["']?#([^"')]+)/.exec(e.getAttribute('filter'));
      const f = id && (svg.querySelector('#' + CSS.escape(id[1])) || document.getElementById(id[1]));
      if (!f) continue;
      const prims = [...f.children];
      if (prims.length !== 1 || prims[0].tagName !== 'feGaussianBlur') continue;
      const sd = parseFloat(prims[0].getAttribute('stdDeviation')) || 0;
      if (sd * scaleOf(e) * q < T.BLUR) {
        e.removeAttribute('filter');
        st.blur++;
      }
    }
    // the joins of a stroke under a device pixel are not seen (its caps stay: a dot is a round cap on nothing)
    for (const e of [...svg.querySelectorAll('[stroke-linejoin]')]) {
      if (isDefs(e) || !e.isConnected) continue;
      if (parseFloat(getComputedStyle(e).strokeWidth) * scaleOf(e) * q < 1) e.removeAttribute('stroke-linejoin');
    }
    // groups left empty
    for (let pass = 0; pass < 6; pass++) {
      const empty = [...svg.querySelectorAll('g')].filter((g) => !g.children.length && !isDefs(g) && !g.id);
      if (!empty.length) break;
      for (const g of empty) g.remove();
    }
    // every path as a polyline within TOL device pixels; a path in the defs at the finest scale it is used at
    const kOf = new Map();
    const note = (id, k) => {
      if (id) kOf.set(id, Math.max(kOf.get(id) || 0, k));
    };
    for (const e of svg.querySelectorAll('use')) if (!isDefs(e)) note((e.getAttribute('href') || e.getAttribute('xlink:href') || '').slice(1), scaleOf(e));
    // a marker's drawing is in the user space of the element carrying it (markerUnits userSpaceOnUse)
    for (const e of svg.querySelectorAll('[marker-start],[marker-mid],[marker-end]'))
      for (const a of ['marker-start', 'marker-mid', 'marker-end']) {
        const id = /url\(["']?#([^"')]+)/.exec(e.getAttribute(a) || '');
        if (id) note(id[1], scaleOf(e));
      }
    for (const e of svg.querySelectorAll('[clip-path]')) {
      if (isDefs(e)) continue;
      const id = /url\(["']?#([^"')]+)/.exec(e.getAttribute('clip-path'));
      if (id) note(id[1], scaleOf(e));
    }
    // a clip's <use> points to a path: that path at the clip's scale
    for (const cp of svg.querySelectorAll('clipPath'))
      if (kOf.has(cp.id)) for (const u of cp.querySelectorAll('use')) note((u.getAttribute('href') || u.getAttribute('xlink:href') || '').slice(1), kOf.get(cp.id));
    const tolMap = new Map();
    for (const e of svg.querySelectorAll('path')) {
      let k = null;
      if (!isDefs(e)) k = scaleOf(e);
      else if (e.id && kOf.has(e.id)) k = kOf.get(e.id);
      else {
        const cp = e.closest('clipPath,marker');
        if (cp && kOf.has(cp.id)) k = kOf.get(cp.id) * (cp.tagName === 'marker' ? scaleIn(e, cp) : 1);
      }
      if (!k) continue;
      const d = e.getAttribute('d');
      if (!d) continue;
      // specks inside a drawn path (SPECK device pixels; 0: kept, as a vessel's speckles or a spray's florets drawn as
      // one path stand out together; not inside a clip: what it lets through is not drawn by it)
      const nd = simplifyD(d, T.TOL / (k * q), isDefs(e) || !T.SPECK ? 0 : T.SPECK / (k * q));
      if (!nd) {
        e.remove();
        st.tiny++;
        continue;
      }
      e.setAttribute('d', nd);
      tolMap.set(e, T.TOL / (k * q));
      st.paths++;
    }
    // opaque neighbours of one colour make one path, each outline turned the same way so their union fills as each did
    const turned = (d, tol) => {
      if (!/^M[^Mm]*z$/.test(d)) return null;
      const sub = flatten(parsePath(d) || [], 1e9)[0];
      if (!sub || !sub.closed) return null;
      const P = sub.pts;
      let A = 0;
      for (let i = 0; i < P.length; i++) {
        const [x1, y1] = P[i];
        const [x2, y2] = P[(i + 1) % P.length];
        A += x1 * y2 - x2 * y1;
      }
      return A >= 0 ? d : writePoly([{ pts: P.slice().reverse(), closed: true }], tol);
    };
    const mergeable = (e) => {
      if (e.tagName !== 'path' || !tolMap.has(e)) return false;
      for (const a of e.attributes) if (!['d', 'fill', 'transform'].includes(a.name)) return false;
      const f = e.getAttribute('fill');
      return !!f && /^#[0-9a-f]{6}$/i.test(f) && getComputedStyle(e).stroke === 'none' && parseFloat(getComputedStyle(e).fillOpacity) === 1;
    };
    for (const parent of T.JOIN === false ? [] : [...svg.querySelectorAll('g')]) {
      if (isDefs(parent)) continue;
      const kids = [...parent.children];
      for (let i = 0; i < kids.length; i++) {
        const a = kids[i];
        if (!mergeable(a)) continue;
        let da = turned(a.getAttribute('d'), tolMap.get(a));
        if (!da) continue;
        let j = i + 1;
        while (j < kids.length && mergeable(kids[j]) && kids[j].getAttribute('fill') === a.getAttribute('fill') && (kids[j].getAttribute('transform') || '') === (a.getAttribute('transform') || '')) {
          const dj = turned(kids[j].getAttribute('d'), tolMap.get(kids[j]));
          if (!dj) break;
          da += dj;
          kids[j].remove();
          st.joined = (st.joined || 0) + 1;
          j++;
        }
        if (j > i + 1) a.setAttribute('d', da);
        i = j - 1;
      }
    }
    const whole = [...svg.children].filter((n) => n.tagName !== 'defs').map(serialize).join('');
    let out = svgFile(vb, defsOf(svg, whole), whole);
    // shorter: no stop-opacity of 1, offsets and gradient ends to 2 decimals, short ids
    out = out.replace(/ stop-opacity="1"/g, '').replace(/ (offset|x1|y1|x2|y2|cx|cy|r|fx|fy)="(-?\d+\.\d{3,})"/g, (m0, a, v) => ` ${a}="${+(+v).toFixed(2)}"`);
    const ids = new Map();
    let nid = 0;
    out = out.replace(/ id="([^"]+)"/g, (m0, id) => {
      if (!ids.has(id)) ids.set(id, (nid++).toString(36));
      return ` id="${ids.get(id)}"`;
    });
    out = out.replace(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g, (m0, a, b) => {
      const n2 = ids.get(a || b);
      if (n2 == null) return m0;
      return a ? `url(#${n2})` : `href="#${n2}"`;
    });
    return { svg: out, lod1, q: +q.toFixed(3), stats: st, vb };
  };

  // ---- two drawings side by side at a given size (device pixels), and how far apart they are, pixel by pixel
  PD.compare = async (a, b, W, H, zoom = 3) => {
    const load = (src) =>
      new Promise((res, rej) => {
        const im = new Image();
        const u = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }));
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = u;
      });
    const [A, B] = await Promise.all([load(a), load(b)]);
    const px = (im) => {
      const cv = document.createElement('canvas');
      cv.width = W;
      cv.height = H;
      const cx = cv.getContext('2d');
      // contain, bottom-centred, as the card shows it
      const s = Math.min(W / im.width, H / im.height);
      const w = im.width * s;
      const h = im.height * s;
      cx.fillStyle = '#9dbfe0';
      cx.fillRect(0, 0, W, H);
      cx.drawImage(im, (W - w) / 2, H - h, w, h);
      return { cv, d: cx.getImageData(0, 0, W, H).data };
    };
    const pa = px(A);
    const pb = px(B);
    let sum = 0;
    let n = 0;
    let big = 0;
    const hist = new Uint32Array(256);
    for (let i = 0; i < pa.d.length; i += 4) {
      const dd = Math.max(Math.abs(pa.d[i] - pb.d[i]), Math.abs(pa.d[i + 1] - pb.d[i + 1]), Math.abs(pa.d[i + 2] - pb.d[i + 2]));
      hist[dd]++;
      sum += dd;
      n++;
      if (dd > 32) big++;
    }
    let acc = 0;
    let p99 = 0;
    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (acc >= n * 0.99) {
        p99 = v;
        break;
      }
    }
    const out = document.createElement('canvas');
    out.width = W * zoom * 2 + 8;
    out.height = H * zoom;
    const ox = out.getContext('2d');
    ox.imageSmoothingEnabled = false;
    ox.fillStyle = '#fff';
    ox.fillRect(0, 0, out.width, out.height);
    ox.drawImage(pa.cv, 0, 0, W * zoom, H * zoom);
    ox.drawImage(pb.cv, W * zoom + 8, 0, W * zoom, H * zoom);
    return { moyenne: +(sum / n).toFixed(2), p99, plusDe32: +((100 * big) / n).toFixed(2), png: out.toDataURL('image/png') };
  };

  // ---- the probe: what the drawing is made of
  PD.probe = async (p) => {
    await cast(p.vase, CAST_S);
    const svg = newHost();
    const c = draw(svg, p, 0);
    mount(svg, 1);
    hideTableShadow(svg);
    const tags = {};
    const attrs = {};
    for (const e of svg.getElementsByTagName('*')) {
      tags[e.tagName] = (tags[e.tagName] || 0) + 1;
      for (const a of e.attributes) attrs[a.name] = (attrs[a.name] || 0) + 1;
    }
    const layers = [...svg.children].map((g) => ({ l: g.getAttribute('data-l'), tag: g.tagName, attrs: [...g.attributes].map((a) => a.name + '=' + a.value.slice(0, 40)), n: g.children.length }));
    const xml = XS.serializeToString(svg);
    const nums = xml.match(/-?\d+\.\d+/g) || [];
    const dec = {};
    for (const x of nums) {
      const d = x.split('.')[1].length;
      dec[d] = (dec[d] || 0) + 1;
    }
    const blend = [...svg.querySelectorAll('[style*=blend],[mix-blend-mode]')].length;
    const images = [...svg.querySelectorAll('image')].map((im) => (im.getAttribute('href') || im.getAttribute('xlink:href') || '').slice(0, 30) + '… ' + Math.round((im.getAttribute('href') || '').length / 1024) + ' Ko');
    const uses = [...svg.querySelectorAll('use')].map((u) => u.getAttribute('href') || u.getAttribute('xlink:href'));
    const pageDefs = document.getElementById('defs').children.length;
    return { tags, attrs, layers, ko: Math.round(xml.length / 1024), decimals: dec, blend, images, uses: uses.slice(0, 10), nUses: uses.length, pageDefs, list: c.list.length };
  };
}

// ---------- prices: the sum of the real prices of the stems (the vessel is offered), in ETH at the rate of configuration,
// to 3 significant digits; the euros are that ETH price at the same rate (as the page computed them until 2026-10-15)
const nEth = new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 3 });
const nEur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
function priceOf(p, cfg) {
  const cts = p.tiges.reduce((a, [, n, c]) => a + n * c, 0);
  const rate = cfg.cours.eurParEth;
  const eth = Number((cts / 100 / rate).toPrecision(cfg.prix.chiffresEth || 3));
  const eur = Math.round(eth * rate);
  return { centimes: cts, eth, eur, ethTxt: `${nEth.format(eth)} ETH`, eurTxt: `≈ ${nEur.format(eur)}`, tiges: p.tiges.reduce((a, t) => a + t[1], 0) };
}
// boutique.json as it is written by hand: arrays of plain values on one line, small flat objects on one line
function fmt(v, ind = '') {
  const flat = (x) => x === null || typeof x !== 'object';
  const NL = '\n';
  if (Array.isArray(v)) return v.every(flat) ? JSON.stringify(v) : '[' + NL + v.map((x) => `${ind}  ${fmt(x, ind + '  ')}`).join(',' + NL) + NL + ind + ']';
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    const one = `{ ${ks.map((k) => `${JSON.stringify(k)}: ${JSON.stringify(v[k])}`).join(', ')} }`;
    if (ks.every((k) => flat(v[k]) || (Array.isArray(v[k]) && v[k].every(flat))) && one.length < 120) return one;
    return '{' + NL + ks.map((k) => `${ind}  ${JSON.stringify(k)}: ${fmt(v[k], ind + '  ')}`).join(',' + NL) + NL + ind + '}';
  }
  return JSON.stringify(v);
}

// ---------- the check: the pieces assembled by eclosion.js (final state) against the whole drawing, both drawn by Chrome
// at the same size (0.6 CSS pixel per unit, 2 device pixels per CSS pixel, over the sky), compared pixel by pixel
const refs = new Map();
async function shotOf(html, W, H, ready) {
  const id = `/__v${Math.random().toString(36).slice(2)}.html`;
  virtual.set(id, ['text/html', html]);
  await send('Emulation.setDeviceMetricsOverride', { width: W + 40, height: H + 40, deviceScaleFactor: 2, mobile: false });
  await navigate(BASE + id);
  await until(ready, 60000, 100);
  await evaluate('new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300))))');
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 20, y: 20, width: W, height: H, scale: 1 } });
  virtual.delete(id);
  return 'data:image/png;base64,' + r.data;
}
async function verify(p) {
  const m = JSON.parse(readFileSync(join(OUT, p.id, 'manifeste.json'), 'utf8'));
  const [vx, vy, vw, vh] = m.vb;
  const W = Math.round(vw * 0.6);
  const H = Math.round(vh * 0.6);
  const page = (body) => `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#8fb8da"><div id="h" style="position:absolute;left:20px;top:20px;width:${W}px;height:${H}px;overflow:hidden">${body}</div></body></html>`;
  // the whole drawing framed on whole units and scaled by one transform, exactly as eclosion.js frames its pieces
  const X0 = Math.floor(vx);
  const Y0 = Math.floor(vy);
  const Wc = Math.ceil(vx + vw) - X0;
  const Hc = Math.ceil(vy + vh) - Y0;
  const e = W / vw;
  const ref = refs.get(p.id).replace(/^<svg ([^>]*?)viewBox="[^"]*" width="[^"]*" height="[^"]*"/, `<svg $1viewBox="${X0} ${Y0} ${Wc} ${Hc}" width="${Wc}" height="${Hc}"`);
  virtual.set(`/__ref/${p.id}.svg`, ['image/svg+xml', ref]);
  const a = await shotOf(
    page(`<div style="position:absolute;left:0;top:0;width:${Wc}px;height:${Hc}px;overflow:hidden;transform-origin:0 0;transform:translate(${(-(vx - X0) * e).toFixed(3)}px,${(-(vy - Y0) * e).toFixed(3)}px) scale(${e.toFixed(6)})"><img id="r" src="/__ref/${p.id}.svg" style="position:absolute;left:0;top:0;width:${Wc}px;height:${Hc}px"></div>`),
    W,
    H,
    `document.getElementById('r').complete`,
  );
  const b = await shotOf(
    page(`</div><script src="/eclosion.js"></script><script>Eclosion.ouvre(document.getElementById('h'), '/bouquets/${p.id}/manifeste.json', { final: true }).then((b) => b.tout).then(() => (window.READY = 1));</script><div>`),
    W,
    H,
    'window.READY',
  );
  const cmp = await evaluate(`(async () => {
    const load = (u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = u; });
    const [A, B] = await Promise.all([load(${JSON.stringify(a)}), load(${JSON.stringify(b)})]);
    const W = A.width, H = A.height;
    const px = (im) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, W, H).data; };
    const a = px(A), b = px(B);
    const diff = document.createElement('canvas'); diff.width = W; diff.height = H; const dx = diff.getContext('2d'); const out = dx.createImageData(W, H);
    let sum = 0, n = 0, max = 0, over8 = 0, over32 = 0; const hist = new Uint32Array(256);
    for (let i = 0; i < a.length; i += 4) {
      const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
      hist[d]++; sum += d; n++; if (d > max) max = d; if (d > 8) over8++; if (d > 32) over32++;
      const g = 255 - Math.min(255, d * 4); out.data[i] = 255; out.data[i + 1] = g; out.data[i + 2] = g; out.data[i + 3] = 255;
    }
    dx.putImageData(out, 0, 0);
    let acc = 0, p999 = 0; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= n * 0.999) { p999 = v; break; } }
    return { moyenne: +(sum / n).toFixed(3), max, p999, pctPlusDe8: +((100 * over8) / n).toFixed(3), pctPlusDe32: +((100 * over32) / n).toFixed(3), carte: diff.toDataURL('image/png') };
  })()`);
  mkdirSync(SCRATCH, { recursive: true });
  writeFileSync(join(SCRATCH, `${p.id}-ecart.png`), Buffer.from(cmp.carte.split(',')[1], 'base64'));
  writeFileSync(join(SCRATCH, `${p.id}-ref.png`), Buffer.from(a.split(',')[1], 'base64'));
  writeFileSync(join(SCRATCH, `${p.id}-pieces.png`), Buffer.from(b.split(',')[1], 'base64'));
  delete cmp.carte;
  m.verification = { date: new Date().toISOString().slice(0, 10), taille: [W * 2, H * 2], ...cmp };
  writeFileSync(join(OUT, p.id, 'manifeste.json'), JSON.stringify(m));
  return { produit: p.id, ecartRendu: m.verification };
}

// ---------- the run
const cfgPath = join(HERE, 'boutique.json');
const CFG = JSON.parse(readFileSync(cfgPath, 'utf8'));
const products = CFG.produits.filter((p) => !WANT.length || WANT.includes(p.id));
if (!products.length) {
  console.error('aucun produit');
  process.exit(1);
}
const kb = (n) => Math.round(n / 1024);
const report = [];
try {
  await connect();
  await send('Page.enable');
  await send('Runtime.enable');
  handlers.push((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) console.log(`[console ${m.params.type}]`, m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300));
    if (m.method === 'Runtime.exceptionThrown') console.log('[exception]', (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').slice(0, 300));
  });
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });
  await navigate(`${BASE}/__pd.html`);
  await until('window.ENGINE_OK', 60000);
  await evaluate(`(${pageCode.toString()})()`);
  console.log('moteur prêt', JSON.stringify(await evaluate(`PD.init(${JSON.stringify(CFG)})`)));
  for (const p of products) {
    if (PROBE) {
      console.log(p.id, JSON.stringify(await evaluate(`PD.probe(${JSON.stringify(p)})`), null, 1));
      continue;
    }
    const t0 = Date.now();
    if (THUMBS_ONLY) {
      const th = await evaluate(`PD.thumb(${JSON.stringify(p)}, ${JSON.stringify({ seuils: SEUILS ? JSON.parse(SEUILS) : {} })})`);
      const cmp = await evaluate(`PD.compare(${JSON.stringify(th.lod1)}, ${JSON.stringify(th.svg)}, 227, 204)`);
      mkdirSync(SCRATCH, { recursive: true });
      writeFileSync(join(SCRATCH, `${p.id}-vignette.png`), Buffer.from(cmp.png.split(',')[1], 'base64'));
      writeFileSync(join(SCRATCH, `${p.id}-vignette.svg`), th.svg);
      writeFileSync(join(SCRATCH, `${p.id}-lod1.svg`), th.lod1);
      console.log(p.id, JSON.stringify({ ko: kb(Buffer.byteLength(th.svg)), gzipKo: +(gzipSync(th.svg, { level: 9 }).length / 1024).toFixed(1), ecart: [cmp.moyenne, cmp.p99, cmp.plusDe32], retire: th.stats }));
      continue;
    }
    const r = await evaluate(`PD.build(${JSON.stringify(p)})`);
    const dir = join(OUT, p.id);
    if (existsSync(dir)) for (const f of readdirSync(dir)) if (/^(p\d+|vase(-[\w]+)?)\.svg$|^manifeste\.json$/.test(f)) rmSync(join(dir, f));
    mkdirSync(dir, { recursive: true });
    let raw = 0;
    let gz = 0;
    for (const [name, s] of Object.entries(r.files)) {
      writeFileSync(join(dir, name), s);
      raw += Buffer.byteLength(s);
      gz += gzipSync(s, { level: 9 }).length;
    }
    const refGz = gzipSync(r.ref, { level: 9 }).length;
    mkdirSync(SCRATCH, { recursive: true });
    writeFileSync(join(SCRATCH, `${p.id}-reference.svg`), r.ref);
    refs.set(p.id, r.ref);
    r.manifest.poids = { fichiers: Object.keys(r.files).length, ko: kb(raw), gzipKo: kb(gz), dessinEntierKo: kb(Buffer.byteLength(r.ref)), dessinEntierGzipKo: kb(refGz) };
    writeFileSync(join(dir, 'manifeste.json'), JSON.stringify(r.manifest));
    // the light thumbnail of the card, and how far it is from the LOD 1 drawing at the card's size
    const th = await evaluate(`PD.thumb(${JSON.stringify(p)})`);
    writeFileSync(join(dir, 'vignette.svg'), th.svg);
    const thGz = gzipSync(th.svg, { level: 9 }).length;
    const cmp = await evaluate(`PD.compare(${JSON.stringify(th.lod1)}, ${JSON.stringify(th.svg)}, 227, 204)`);
    writeFileSync(join(SCRATCH, `${p.id}-vignette.png`), Buffer.from(cmp.png.split(',')[1], 'base64'));
    r.manifest.vignette = { ko: kb(Buffer.byteLength(th.svg)), gzipKo: +(thGz / 1024).toFixed(1), lod1Ko: kb(Buffer.byteLength(th.lod1)), lod1GzipKo: kb(gzipSync(th.lod1, { level: 9 }).length), ecart: { moyenne: cmp.moyenne, p99: cmp.p99, pctPlusDe32: cmp.plusDe32 }, retire: th.stats };
    writeFileSync(join(dir, 'manifeste.json'), JSON.stringify(r.manifest));
    // the product in boutique.json: its price (computed here, no longer in the page), its manifest and thumbnail
    p.prix = priceOf(p, CFG);
    p.bouquet = `bouquets/${p.id}/manifeste.json`;
    p.vignette = `bouquets/${p.id}/vignette.svg`;
    const tg = r.manifest.tiges;
    if (tg.bad.length || tg.extra.length || tg.price.length) console.warn(`[predessin] ${p.id}: tiges ${tg.bad.join(', ') || 'ok'}; en plus ${tg.extra.join(', ') || 'rien'}; prix changés ${tg.price.join(', ') || 'aucun'}`);
    const line = { produit: p.id, ...r.stats, ...r.manifest.poids, vignette: r.manifest.vignette, prix: p.prix.ethTxt, secondes: Math.round((Date.now() - t0) / 100) / 10, tiges: tg.bad.length || tg.extra.length ? tg : 'ok' };
    report.push(line);
    console.log(JSON.stringify(line));
  }
  if (!PROBE && !THUMBS_ONLY && !OUT_ARG) writeFileSync(cfgPath, fmt(CFG) + '\n');
  if (VERIFY && !OUT_ARG) for (const p of products) console.log(JSON.stringify(await verify(p)));
} catch (err) {
  console.error('ERREUR', err.message);
  process.exitCode = 1;
} finally {
  await closeChrome();
  ws?.close();
  server.close();
}
