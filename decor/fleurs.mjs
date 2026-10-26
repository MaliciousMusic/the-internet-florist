// fleurs.mjs: the flowers of the shop scene's meadow, all drawn by our flower engine (decor/out/fleurs/, extracted by
// fleurs_moteur.mjs + fleurs_page.js from decor/scene/engine.js, list in fleurs/bibliotheque.mjs), planted through the
// common camera of decor/PLAN.md.
//
//   node decor/fleurs.mjs touffes [seed] [--bas y]   the flowered foreground clumps: out/touffe-fleurie-N.svg and their entries in
//                                              the "touffes" key of out/scene.json (other entries and keys untouched)
//   node decor/fleurs.mjs sol [seed] [--split 8.5,3]
//                                              the meadow's flowers laid by depth through sol.mjs (its `inserts` entry), the
//                                              ground cut into three depth files laid over one another in the page:
//                                              out/sol-loin.svg (beyond z1), out/sol-milieu.svg (z2-z1), out/sol-pres.svg
//                                              (nearer than z2), and their sum out/sol-fleuri.svg (+ .json: counts, weights)
//   import { plant, touffesFleuries } from './fleurs.mjs'
//
// Only the finished species of the bouquet « Printemps à la carpe » that grow and flower together in the ground in spring:
// tulips (single, double, parrot, fringed), daffodils (trumpet, small trumpet and tazetta), hyacinths, grape hyacinths,
// anemones, ranunculus, Dutch iris, snake's head fritillaries; no branch, shrub or climber. Planted in natural drifts, one
// species and colourway each, denser toward the front, never on the trodden walk; drifts close round the pillar's foot.
//
// Second chantier (15 Oct., evening; critique of the site manager and of the owner):
// - the heads are drawn WITHOUT their neck (the engine's NECK_X: the plant heads' thick axis, 0.29 of a tulip's width, is
//   left out) and each planted copy gets its OWN STEM here: a thin ribbon at the share of the head's width measured on
//   the reference photos (bibliotheque.mjs STEM_W: tulip 1/8), following the head's neck path then bending to its foot,
//   in the engine's stem colours of the species (GHI sc) lit above the grass and shaded by it below (a vertical gradient
//   that turns to the canopy's inner green where the grass begins); the grass in front hides most of it;
// - several drawings per colourway (opening, tilt, view from above, facing direction) and, per copy, its own tilt, lean,
//   width and size; real HEIGHTS per species (low bulbs at the grass's height, long-stemmed tulips and irises well above)
//   with a height of its own per drift and a spread inside it;
// - the low bulbs (grape hyacinths, anemones, fritillaries, small trumpet daffodils, hyacinths) carpet LOW-GRASS PATCHES
//   (herbe.mjs option `low`), the grass is thinned under the drifts where the heads hide it (option `thin`);
// - the walk is narrower (sol.mjs setWalk: trodden ±0.25 m, a short rise, then flowers and hay) and drifts close round
//   the pillar's foot, sides and back;
// - the foreground clumps stand at 0.75-1.4 m: big whole plants of the engine (head, thin stem bending from its foot,
//   broad leaves where the frame shows them) whose heads overflow the frame's bottom and the walk's edges.
//
// Levels of detail, by the head's height on screen (1 cm at Z metres = 18.54 / Z units; the engine draws 6.5 units per cm,
// so an engine drawing stands at scale 2.852 / Z):
//   tp   the engine's head at full detail, heads of 30 units and more (1.9 to ~3.5 m);
//   tm   the engine's own reduced head (LOD 1), heads of 9 to 30 units;
//   sil  silhouettes in two or three tones measured on the engine's heads (bibliotheque.json `tons`), under 9 units;
//        in the far meadow (beyond 14.5 m) the heads are dots of their tones mixed with the green.
// Path data is re-quantised per level (fleurs/chemins.mjs) to the precision its scale needs. Light: the engine lights its
// flowers from the shop's light (top left), the azimuth of SUN; nothing is added (no halo, no glow).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { CAM, project, canopyAt, tuft, MID, bottom } from './herbe.mjs';
import { requantAll } from './fleurs/chemins.mjs';
import { STEM_W } from './fleurs/bibliotheque.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTF = join(HERE, 'out', 'fleurs');
const { F, Y0, EYE, CX, W, H } = CAM;
const UPC = 6.5; // engine units per cm
export const LIB = JSON.parse(readFileSync(join(OUTF, 'bibliotheque.json'), 'utf8'));
// grid of the re-quantised paths, in engine units, per level: tp is seen at most at scale 1.5 (2.7 px per unit on a
// phone), tm at 0.85, the foreground plants at 3.8 (6.8 px)
export const GRID = { tp: 0.6, tm: 0.7, pl: 0.3 };
// the ground's pieces drop the blurs finer than this (engine units: at most 1.7 px on a phone at the frame's bottom)
export let MIN_BLUR = 0.75;
export const setMinBlur = (v) => { MIN_BLUR = v; };

// ---------- small maths, seeded chance ----------
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function hash(...v) {
  let h = 0x2545f491;
  for (const x of v) {
    h ^= Math.imul((x * 1000003) | 0, 0x85ebca6b) ^ ((x * 7919.13) | 0);
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
    h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
}
function rng(...seed) {
  let a = (hash(...seed) * 4294967296) >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (lo, hi) => lo + (hi - lo) * next();
  next.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * next());
  next.pick = (arr) => arr[Math.floor(next() * arr.length)];
  next.gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += next(); return (s - 2) * 1.732; };
  next.wpick = (pairs) => { let s = 0; for (const [, w] of pairs) s += w; let u = next() * s; for (const [v, w] of pairs) { u -= w; if (u <= 0) return v; } return pairs[pairs.length - 1][0]; };
  return next;
}
function vnoise(seed, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const c = (i, j) => hash(seed, xi + i, yi + j) * 2 - 1;
  return lerp(lerp(c(0, 0), c(1, 0), u), lerp(c(0, 1), c(1, 1), u), v);
}
const n1 = (v) => { const s = (Math.round(v * 10) / 10).toString(); return s.startsWith('0.') ? s.slice(1) : s.startsWith('-0.') ? '-' + s.slice(2) : s; };
const n3 = (v) => { const s = (Math.round(v * 1000) / 1000).toString(); return s.startsWith('0.') ? s.slice(1) : s.startsWith('-0.') ? '-' + s.slice(2) : s; };
const gz = (s) => +(gzipSync(s, { level: 9 }).length / 1024).toFixed(1);
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a, b, t) => '#' + hexRgb(a).map((v, i) => Math.round(lerp(v, hexRgb(b)[i], t)).toString(16).padStart(2, '0')).join('');

// ---------- the engine's drawings as reusable pieces ----------
// One variant of the library -> its defs and one <g> whose origin is the plant's foot (whole plants) or the head's
// receptacle (heads, where its stem joins it), ids made short and unique by a prefix, the paths re-quantised for its
// level. Shared by every planted copy (<use>).
const short = (i) => i.toString(36);
// the top-level elements of a markup string
export function splitTop(t) {
  const out = [];
  let depth = 0, start = 0;
  for (const m of t.matchAll(/<(\/?)[a-zA-Z][^>]*?(\/?)>/g)) {
    if (m[1]) depth--;
    else if (!m[2]) depth++;
    if (depth === 0) { out.push(t.slice(start, m.index + m[0].length)); start = m.index + m[0].length; }
  }
  return out;
}
export function piece(name, prefix, grid, minBlur = 0) {
  const v = LIB[name];
  if (!v) throw new Error('variante absente : ' + name);
  let s = readFileSync(join(OUTF, name + '.svg'), 'utf8').replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
  const m = s.match(/^<svg[^>]*><defs>([\s\S]*?)<\/defs>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error('svg inattendu : ' + name);
  let body = m[2];
  // a few heads (the tazetta's florets) are drawn as markers at the start of an invisible path: each such marker becomes
  // a group at its place (resvg, which renders our boards, skips the markers of an invisible path; the result is the same)
  const markers = new Map();
  let defsRaw = m[1].replace(/<marker[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/marker>/g, (a, id, inner) => {
    const rx = +((a.match(/refX="([^"]+)"/) || [])[1] || 0), ry = +((a.match(/refY="([^"]+)"/) || [])[1] || 0);
    markers.set(id, { rx, ry, inner });
    return '';
  });
  if (markers.size) {
    const unwrap = (t) => t.replace(/<path d="M(-?[\d.]+)[ ,](-?[\d.]+)h[^"]*"[^>]*marker-start="url\(#([^)]+)\)"[^>]*\/>/g, (a, x, y, id) => {
      const mk = markers.get(id);
      return mk ? `<g transform="translate(${n1(+x - mk.rx)} ${n1(+y - mk.ry)})">${mk.inner}</g>` : a;
    });
    body = unwrap(body);
    defsRaw = unwrap(defsRaw);
  }
  // the page's defs may repeat an element the drawing itself holds (the same id in the body): a top-level copy is
  // dropped, a nested one loses its id (every reference finds the body's element, the same drawing)
  const seen = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map((x) => x[1]));
  let defs = splitTop(defsRaw).filter((e) => { const id = (e.match(/^<[^>]*\bid="([^"]+)"/) || [])[1]; return !id || !seen.has(id); }).join('');
  defs = defs.replace(/\bid="([^"]+)"/g, (a, id) => { if (seen.has(id)) return ''; seen.add(id); return a; });
  // short ids
  const ids = new Map();
  for (const x of (defs + body).matchAll(/\bid="([^"]+)"/g)) if (!ids.has(x[1])) ids.set(x[1], prefix + short(ids.size));
  const re = (t) => t.replace(/\bid="([^"]+)"/g, (a, id) => `id="${ids.get(id)}"`).replace(/url\(#([^)]+)\)/g, (a, id) => `url(#${ids.get(id) || id})`).replace(/href="#([^"]+)"/g, (a, id) => `href="#${ids.get(id) || id}"`);
  defs = re(defs); body = re(body);
  if (grid && grid > 0.1) { defs = requantAll(defs, grid); body = requantAll(body, grid); }
  // blurs finer than minBlur (engine units) are below a pixel where the piece is seen: dropped (the browser rasterises
  // every filtered element on its own)
  if (minBlur > 0) {
    const fine = new Set();
    for (const f of splitTop(defs)) {
      const m2 = f.match(/^<filter[^>]*\bid="([^"]+)"[^>]*>\s*<feGaussianBlur stdDeviation="([\d.]+)"\/>\s*<\/filter>$/);
      if (m2 && +m2[2] < minBlur) fine.add(m2[1]);
    }
    const drop = (t) => t.replace(/ filter="url\(#([^)]+)\)"/g, (a, id) => (fine.has(id) ? '' : a));
    body = drop(body);
    defs = splitTop(drop(defs)).filter((e) => { const id = (e.match(/^<filter[^>]*\bid="([^"]+)"/) || [])[1]; return !id || !fine.has(id); }).join('');
  }
  const [fx, fy] = v.foot || [0, 0];
  // the drawing's top above its origin, in engine units (for the plant's height on screen)
  const top = fy - v.vb[1];
  const g = fx || fy ? `<g id="${prefix}" transform="translate(${n1(-fx)} ${n1(-fy)})">${body}</g>` : `<g id="${prefix}">${body}</g>`;
  return { name, id: prefix, defs, g, top, v };
}

// ---------- the flowered foreground clumps (plane z9) ----------
// 0.75-1.4 m from the eye (heads at 80-100 % of the frame's height and below it, as in the owner's mock-up): big whole
// plants of the engine of several colourways, each clump on its own file with its grass (a back tuft reaching up the
// stems, a lower front tuft). The frame's bottom edge is the ground at 2.2 m, i.e. 0.75 - 0.339 Z m high at depth Z:
// nearer than ~1.3 m only the heads and the top of the stems show, the plants are taken without their leaves (`-nu`).
// Two clumps flank the walk inside the phone's column (x 820-1580), their heads over the frame's bottom and over the
// first stone's edges; two more lean over the walk's edges a little further; the others fill the desktop's flanks.
// Each file is framed on itself, its foot (the clump's base on the ground, below the frame) at the bottom centre: the page
// swings it about that point (<= 1.5 deg).
// Z: the clump's depth (m); fl: [plant, screen x of its head, dZ (cm), height of its top (cm), lean (deg)]: each plant's
// foot is found so that its head lands at that x once leaned (the clumps flanking the walk keep their heads off the
// stones' middle, x 1110-1290, and overflow their edges)
export const TOUFFES_FLEURIES = [
  // the phone's column, left and right of the walk, from the frame's bottom up
  { Z: 0.76, grass: 'vulpin', a: 1.2, t: 3.8, fl: [['ts-jaune-4', 905, 6, 58, -2], ['ts-rouge-1', 860, 2, 56, -3], ['ts-rose-1', 950, -3, 53, 2], ['td-rose-1', 1040, 4, 50, 4]] },
  { Z: 0.78, grass: 'raygrass', a: 1.3, t: 4.1, fl: [['ts-orange-1', 1360, 3, 55, 3], ['ts-jaune-1', 1440, -2, 57, -1], ['nt-jaune-1', 1520, 4, 52, -3], ['ts-rouge-5', 1580, -3, 54, 2]] },
  { Z: 1.02, grass: 'houlque', a: 1.1, t: 4.0, fl: [['nt-jaune-2', 845, 3, 47, -2], ['ts-blanc-1', 925, -2, 52, 2], ['ts-fuchsia-1', 1000, 4, 49, 3], ['ts-rose-pale', 1070, -3, 50, 4]] },
  { Z: 1.05, grass: 'flouve', a: 1.0, t: 3.7, fl: [['ts-rouge-2', 1335, 2, 53, -4], ['ts-corail', 1410, -3, 49, -1], ['td-blanc', 1485, 4, 46, 2], ['ts-rose-3', 1555, -2, 51, 3]] },
  { Z: 1.42, grass: 'dactyle', a: 1.1, t: 3.9, fl: [['ts-ecarlate', 880, 2, 48, -2], ['tf-rose', 955, -3, 50, 1], ['nt-jaune-or', 1035, 3, 44, 3]] },
  { Z: 1.46, grass: 'paturin', a: 1.2, t: 4.2, fl: [['ts-orange-2', 1370, 2, 49, -3], ['tp-rouge', 1450, -3, 51, 0], ['ts-jaune-2', 1525, 3, 50, 2]] },
  // the desktop's flanks
  { Z: 0.85, grass: 'dactyle', a: 1.4, t: 3.6, fl: [['ts-ecarlate-2', 470, 2, 55, -3], ['ts-jaune-3', 560, -3, 53, -1], ['td-rose-2', 650, 4, 49, 2], ['nt-jaune-3', 735, -2, 50, 4]] },
  { Z: 0.88, grass: 'paturin', a: 1.2, t: 4.3, fl: [['ts-rose-2', 1670, 3, 54, -4], ['tp-abricot', 1760, -2, 55, 0], ['ts-orange-3', 1850, 4, 52, 2], ['ts-rouge-3', 1940, -3, 54, 4]] },
  { Z: 1.25, grass: 'houlque', a: 1.1, t: 3.9, fl: [['ts-blanc-2', 120, 2, 52, -3], ['ts-fuchsia-2', 200, -3, 49, 1], ['nb-avalanche', 280, 3, 45, 3], ['ts-rouge-4', 360, -2, 53, 2]] },
  { Z: 1.22, grass: 'vulpin', a: 1.3, t: 4.2, fl: [['td-jaune', 2040, 2, 47, -3], ['ts-rouge-feu', 2120, -3, 52, 1], ['nt-jaune-4', 2200, 3, 46, 3], ['ts-corail-2', 2280, -2, 51, 2]] },
  // a little further, their broad leaves showing at the frame's bottom
  { Z: 1.66, grass: 'flouve', a: 1.0, t: 4.0, fl: [['ts-fuchsia-3', 635, 2, 48, -2], ['nt-blanc', 712, -3, 44, 2], ['ts-blanc-3', 790, 3, 50, 3]] },
  { Z: 1.7, grass: 'raygrass', a: 1.1, t: 3.8, fl: [['ts-rose-pale-2', 1615, 2, 49, -3], ['td-rose-3', 1695, -3, 45, 0], ['nt-jaune-or-2', 1775, 3, 44, 3]] },
];

// one engine plant placed in the world: foot at (X, ground, Z) sunk so that its top stands `h` cm high, leaning `lean`
// degrees about its foot; returns the <use> and its screen box
function plantAt(p, X, Z, hcm, lean, extra = '') {
  const s = (F * 0.01) / (UPC * Z); // engine units -> world units at depth Z
  const drawn = p.top / UPC;
  const sink = Math.max(0, drawn - hcm) / 100; // metres below the ground
  const [x, y] = project(X, -sink, Z);
  const a = (lean * Math.PI) / 180, c = Math.cos(a) * s, sn = Math.sin(a) * s;
  const v = p.v, fx = v.foot[0], fy = v.foot[1];
  // the drawing's corners relative to the foot, transformed
  const pts = [[v.vb[0] - fx, v.vb[1] - fy], [v.vb[0] + v.vb[2] - fx, v.vb[1] - fy], [v.vb[0] - fx, v.vb[1] + v.vb[3] - fy], [v.vb[0] + v.vb[2] - fx, v.vb[1] + v.vb[3] - fy]]
    .map(([u, w]) => [x + c * u - sn * w, y + sn * u + c * w]);
  const box = [Math.min(...pts.map((q) => q[0])), Math.min(...pts.map((q) => q[1])), Math.max(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[1]))];
  const tr = lean ? `matrix(${n3(c)} ${n3(sn)} ${n3(-sn)} ${n3(c)} ${n1(x)} ${n1(y)})` : `translate(${n1(x)} ${n1(y)}) scale(${n3(s)})`;
  return { use: `<use href="#${p.id}" transform="${tr}"${extra}/>`, box, x, y, s };
}

// the svg of a tuft (herbe.mjs) -> its defs, body and box (world frame)
function tuftParts(seed, spec) {
  const r = tuft(seed, spec);
  const m = r.svg.match(/^<svg[^>]*><defs>([\s\S]*?)<\/defs>([\s\S]*)<\/svg>$/);
  return { defs: m[1], body: m[2], box: r.box, base: r.base };
}
// the frame's bottom edge is the ground at 2.2 m (lower on the frieze: herbe.mjs setBottom): at depth Z it stands this
// high (m)
const cutHeight = (Z) => EYE - ((bottom() - Y0) * Z) / F;

export function touffesFleuries(seed = 1, budget = 59 * 1024) {
  const out = [];
  TOUFFES_FLEURIES.forEach((T, i) => {
    const pieces = new Map();
    // the plants' leaves show only where the frame's edge passes below ~25 cm
    const nu = cutHeight(T.Z) > 0.25 ? '-nu' : '';
    const pc = (name) => { if (!pieces.has(name)) pieces.set(name, piece(`pl/${name}${nu}`, `f${i + 1}${short(pieces.size)}`, GRID.pl, 0.3)); return pieces.get(name); };
    // each plant's foot from the screen x of its head: x_head = x_foot + s (cos l hx - sin l hy), (hx, hy) the head's
    // middle from the foot in the drawing (engine units), s its scale, l its lean
    const fl = T.fl.map(([name, hx, dz, h, lean]) => {
      const p = pc(name), v = p.v, Z = T.Z + dz / 100, s = (F * 0.01) / (UPC * Z);
      const qx = v.head[0] + v.head[2] / 2 - v.foot[0], qy = v.head[1] + v.head[3] / 2 - v.foot[1];
      const l = (lean * Math.PI) / 180, xf = hx - s * (Math.cos(l) * qx - Math.sin(l) * qy);
      return { p, X: ((xf - CX) * Z) / F, Z, h, lean };
    }).sort((a, b) => b.Z - a.Z);
    const X = fl.reduce((a, f) => a + f.X, 0) / fl.length;
    const placed = fl.map((f) => plantAt(f.p, f.X, f.Z, f.h, f.lean));
    // the heads' lowest screen line: the grass stays below it (the back tuft reaches up the stems, the front one lower)
    const headLow = Math.min(...fl.map((f) => project(f.X, f.h / 100 - 0.08, f.Z)[1]));
    let leaves = [70, 34], best = null;
    for (let pass = 0; pass < 10; pass++) {
      const back = tuftParts(seed * 100 + i, { sp: T.grass, X, Z: T.Z + 0.05, size: 1.05, tall: 1.25, top: headLow + 30, id: 40 + i, leaves: leaves[0] });
      const front = tuftParts(seed * 100 + 50 + i, { sp: T.grass, X: X + 0.02, Z: T.Z - 0.06, size: 0.95, tall: 1.05, top: headLow + 50, id: 60 + i, leaves: leaves[1], culms: 1 });
      // frame on the clump's base (X, ground, Z): bottom centre
      const [bx, by] = project(X, 0, T.Z);
      const boxes = [back.box, front.box, ...placed.map((q) => q.box)];
      const half = Math.ceil(Math.max(...boxes.map((b) => Math.max(Math.abs(b[0] - bx), Math.abs(b[2] - bx)))) + 3);
      const top = Math.floor(Math.min(...boxes.map((b) => b[1])) - 3);
      const bottom = Math.ceil(Math.max(by + 2, ...boxes.map((b) => b[3])));
      const vb = [bx - half, top, 2 * half, bottom - top];
      const defs = back.defs + front.defs + [...pieces.values()].map((p) => p.defs + p.g).join('');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(n1).join(' ')}" width="${n1(vb[2])}" height="${n1(vb[3])}"><defs>${defs}</defs>${back.body}${placed.map((q) => q.use).join('')}${front.body}</svg>`;
      best = { svg, vb, kb: gz(svg) };
      if (best.kb * 1024 <= budget) break;
      leaves = leaves.map((v) => Math.round(v * 0.85));
    }
    // scene.css: left = x %, bottom = b %, width = w % of the world; the foot is the file's bottom centre
    const [ox, oy, w, h] = best.vb;
    const place = { src: `touffe-fleurie-${i + 1}.svg`, x: +((ox / W) * 100).toFixed(3), b: +(((H - (oy + h)) / H) * 100).toFixed(3), w: +((w / W) * 100).toFixed(3), a: T.a, t: T.t };
    out.push({ ...best, place, n: fl.length, nu: !!nu });
  });
  return out;
}

// ---------- the meadow: species, heights, drifts ----------
// Per species in the field: real height (cm, ground to the flower's top: growers' and field figures, the low bulbs at the
// grass's height, long-stemmed tulips and irises well above it), the head's height (cm, far silhouettes), how many stems
// per m2 a drift shows (thinned to what the eye separates; grape hyacinths carpet), its far silhouette, and for the low
// bulbs the height factor of the grass in their patch (they carpet patches of short grass: herbe.mjs option `low`).
export const FIELD = {
  'tulipe-simple': { h: [34, 62], head: 6, dens: 16, kind: 'cup' },
  'tulipe-double': { h: [30, 46], head: 7, dens: 14, kind: 'bowl' },
  'tulipe-perroquet': { h: [38, 56], head: 8, dens: 12, kind: 'bowl' },
  'tulipe-frangee': { h: [38, 58], head: 6.5, dens: 14, kind: 'cup' },
  'narcisse-trompette': { h: [32, 50], head: 6, dens: 14, kind: 'trumpet' },
  'narcisse-bouquet': { h: [30, 45], head: 6, dens: 12, kind: 'umbel' },
  jacinthe: { h: [20, 30], head: 11, dens: 12, kind: 'spike', low: 0.72 },
  muscari: { h: [12, 20], head: 4, dens: 48, kind: 'spike', low: 0.45 },
  'anemone-coronaria': { h: [18, 32], head: 5, dens: 18, kind: 'disc', low: 0.55 },
  'renoncule-classique': { h: [26, 42], head: 5.5, dens: 12, kind: 'bowl' },
  'iris-hollandais': { h: [48, 66], head: 8, dens: 12, kind: 'iris' },
  'fritillaire-meleagris': { h: [20, 32], head: 4.5, dens: 18, kind: 'bell', low: 0.55 },
};
// the small trumpet daffodil (miniature trumpets of division 1 such as 'W.P. Milner', pale sulphur, 15-22 cm, flowers of
// 4-5 cm): the trumpet's drawing of the colourway « citron » at 0.62, in low patches
export const MINI = { 'narcisse-trompette~citron': { k: 0.62, h: [14, 22], low: 0.5 } };
const miniOf = (sid, cw) => MINI[sid + '~' + cw] || null;
const lowOf = (sid, cw) => (miniOf(sid, cw) || {}).low || FIELD[sid].low || 0;
// the drifts: species and colourway, weight (tulips first, as in a spring flower field and the mock-up; the double,
// parrot and fringed tulips in several colourways; grape hyacinths in carpets)
export const PLAQUES = [
  ['tulipe-simple', 'rouge', 9], ['tulipe-simple', 'rouge-feu', 4], ['tulipe-simple', 'rose', 6], ['tulipe-simple', 'jaune', 7],
  ['tulipe-simple', 'orange', 5], ['tulipe-simple', 'blanc', 4], ['tulipe-simple', 'fuchsia', 4], ['tulipe-simple', 'corail', 3],
  ['tulipe-double', 'rose-vif', 4], ['tulipe-double', 'blanc', 3], ['tulipe-double', 'jaune', 2],
  ['tulipe-perroquet', 'abricot', 3], ['tulipe-perroquet', 'rouge', 2], ['tulipe-frangee', 'rose', 3], ['tulipe-frangee', 'blanc', 2],
  ['narcisse-trompette', 'jaune', 7], ['narcisse-trompette', 'jaune-or', 3], ['narcisse-trompette', 'blanc', 2], ['narcisse-trompette', 'citron', 3],
  ['narcisse-bouquet', 'avalanche', 3],
  ['jacinthe', 'bleu', 4], ['jacinthe', 'rose', 3], ['muscari', 'bleu', 6],
  ['anemone-coronaria', 'bleu', 3], ['anemone-coronaria', 'rouge', 3], ['anemone-coronaria', 'blanc', 2],
  ['renoncule-classique', 'orange', 3], ['renoncule-classique', 'rose', 3],
  ['iris-hollandais', 'bleu', 4], ['fritillaire-meleagris', 'damier', 3], ['fritillaire-meleagris', 'blanc', 1],
];
// the drawings of the library for one species and colourway, per level
const VCACHE = new Map();
function variantsOf(sid, cw) {
  const k = sid + '~' + cw;
  if (VCACHE.has(k)) return VCACHE.get(k);
  const by = { tp: [], tm: [] };
  for (const [name, v] of Object.entries(LIB)) if (v.sid === sid && v.cw === cw && by[v.tier]) by[v.tier].push(name);
  VCACHE.set(k, by);
  return by;
}
// the tones of a colourway (far silhouettes): from its full head, else from its reduced one
function tonesOf(sid, cw) {
  const all = Object.values(LIB).filter((v) => v.sid === sid && v.cw === cw && v.tons);
  const v = all.find((x) => x.tier === 'tp') || all[0];
  return v && v.tons;
}
// the engine's stem colours of a species ([dark, body, light, highlight]: GHI sc, else the head's neck colours)
function scOf(sid) {
  const v = Object.values(LIB).find((x) => x.sid === sid && x.sc);
  return v ? v.sc : ['#3c5a2e', '#5f8a3e', '#92b662', '#cfe2a8'];
}

// Drifts laid on the ground: rows of cells across the frame, from 1.9 m to the far meadow; a cell holds a drift with
// the probability `cover(Z)` (generous, as in the mock-up); cells grow with distance (the eye cannot tell a 2 m drift
// from a 6 m one at 60 m, and the file stays light). Each drift: an irregular blob (noise on its radius), one species and
// colourway, never the same as its left neighbour, a height of its own (t: 0 the species' shortest, 1 its tallest) and a
// breeze that leans its heads a little the same way.
const ZNEAR = 1.6, ZFAR = 90;
// The strip of the frame planted, in screen units (default the frame and 30 units beyond each side). The frieze
// (frise_sol.mjs) plants a strip as long as its loop: setStrip([x0, x1]).
let STRIP = [-30, W + 30];
export const setStrip = (xr) => { STRIP = xr || [-30, W + 30]; };
const PZ = 4.37, RB = 0.235 * 1.08; // the pillar's axis and foot radius (sol.mjs)
function mkDrift(r, sid, cw, X, Z, rx, rz, row, extra = {}) {
  const low = lowOf(sid, cw);
  // grape hyacinths spread in wide low carpets
  const kc = sid === 'muscari' ? 1.35 : 1;
  return { sid, cw, X, Z, rx: rx * kc, rz: rz * kc, rot: r.range(-0.4, 0.4), seed: r.int(1, 1e6), row, t: r.range(0.08, 0.92), wind: r.range(-6, 6), low, ...extra };
}
// in the near file (nearer than SPLIT[1], heads of 30-70 units) only the colourways whose full head is planted there
// (SOL_TP): the heavy ones (hyacinths, ranunculus, anemones, tazetta, iris) begin behind it
const nearOK = (sid, cw) => Object.keys(LIB).some((nm) => SOL_TP.has(nm) && LIB[nm].sid === sid && LIB[nm].cw === cw);
export function drifts(seed = 1, okAt = () => 1, split = SPLIT) {
  const r = rng(seed, 4243);
  const out = [];
  const cover = (Z) => (Z < 6 ? 0.92 : Z < 15 ? 0.85 : 0.65);
  let Z = ZNEAR, row = 0;
  while (Z < ZFAR) {
    // cells of 1.2 m at the front (several drifts across the frame), growing past 9 m
    const g = Math.max(0.72, Z / 9);
    const dz = 0.62 * g * r.range(0.8, 1.2);
    const dx = 1.7 * g;
    const Zc = Z + dz / 2;
    const xa = ((STRIP[0] - 30 - CX) * Zc) / F, xb = ((STRIP[1] + 30 - CX) * Zc) / F;
    let X = xa - r.range(0, dx), prev = null;
    while (X < xb) {
      const cx = X + dx * r.range(0.2, 0.8), cz = Z + dz * r.range(0.25, 0.75);
      X += dx * r.range(0.75, 1.25);
      if (r() > cover(cz)) { prev = null; continue; }
      if (okAt(cx, cz) < 0.3) continue;
      const cands = PLAQUES.filter(([sid, cw]) => !(prev && prev[0] === sid && prev[1] === cw) && (cz > split[1] + 0.25 || nearOK(sid, cw)));
      const [sid, cw] = r.wpick(cands.map((c) => [c, c[2]]));
      prev = [sid, cw];
      out.push(mkDrift(r, sid, cw, cx, cz, dx * r.range(0.32, 0.55) * lerp(1.25, 1, smooth(3, 8, cz)), dz * r.range(0.38, 0.62) * lerp(1.3, 1, smooth(3, 8, cz)), row));
    }
    Z += dz;
    row++;
  }
  // the walk's edges: where the trodden sward rises to the hay (okAt 0.35-0.9), short bulbs naturalised along it
  // (grape hyacinths, anemones, fritillaries, hyacinths, small daffodils), small drifts on both sides from the frame
  // bottom to the pillar; behind them, in the hay, the tall ones (tulips, daffodils, irises)
  const BORD = [['muscari', 'bleu', 3], ['anemone-coronaria', 'bleu', 3], ['anemone-coronaria', 'rouge', 3], ['anemone-coronaria', 'blanc', 2],
    ['fritillaire-meleagris', 'damier', 2], ['jacinthe', 'bleu', 2], ['jacinthe', 'rose', 2], ['narcisse-trompette', 'citron', 2]];
  const TALL = PLAQUES.filter(([sid]) => sid.startsWith('tulipe') || sid === 'iris-hollandais' || sid === 'narcisse-trompette');
  let prevB = null;
  for (let Zb = 1.75; Zb < 4.15; Zb += r.range(0.2, 0.3)) {
    for (const side of [-1, 1]) {
      // walk outward from the walk's middle until the sward turns to hay
      let X = null;
      for (let t = 0; t < 1.6; t += 0.02) { const x = side * t; const k = okAt(x, Zb); if (k >= 0.35 && k <= 0.9) { X = x; break; } if (k > 0.9) { X = x; break; } }
      if (X == null || r() < 0.08) continue;
      const cands = BORD.filter(([sid, cw]) => !(prevB && prevB[0] === sid && prevB[1] === cw) && (Zb > split[1] + 0.2 || nearOK(sid, cw)));
      const [sid, cw] = r.wpick(cands.map((c) => [c, c[2]]));
      prevB = [sid, cw];
      out.push(mkDrift(r, sid, cw, X + side * r.range(0.06, 0.16), Zb, r.range(0.18, 0.32), r.range(0.1, 0.18), -1, { bord: true }));
      if (r() < 0.75) {
        const [ts, tc] = r.wpick(TALL.filter(([a, b]) => Zb > split[1] + 0.2 || nearOK(a, b)).map((c) => [c, c[2]]));
        out.push(mkDrift(r, ts, tc, X + side * r.range(0.32, 0.55), Zb + r.range(-0.1, 0.1), r.range(0.25, 0.42), r.range(0.12, 0.2), -1, { bord: true }));
      }
    }
  }
  // round the pillar's foot, sides and back (the walk arrives in front): a ring of small drifts, low bulbs against the
  // stone, tulips and daffodils a little further (owner's mock-up: flowers all round the pillar's foot). Angle from the
  // direction of the eye (0 in front, 90 on the right, 180 behind), gap from the foot (m).
  const AROUND = [
    [-62, 0.06, 'muscari', 'bleu', 0.16, 0.1], [-88, 0.09, 'narcisse-trompette', 'jaune', 0.16, 0.1], [-112, 0.28, 'tulipe-simple', 'rouge', 0.22, 0.12],
    [-140, 0.12, 'anemone-coronaria', 'blanc', 0.16, 0.1], [-74, 0.42, 'tulipe-simple', 'rose', 0.24, 0.13], [-165, 0.3, 'tulipe-simple', 'jaune', 0.24, 0.14],
    [64, 0.06, 'narcisse-trompette', 'jaune', 0.16, 0.1], [90, 0.1, 'anemone-coronaria', 'rouge', 0.16, 0.1], [116, 0.3, 'tulipe-simple', 'rouge', 0.22, 0.12],
    [142, 0.12, 'muscari', 'bleu', 0.18, 0.1], [76, 0.44, 'tulipe-double', 'rose-vif', 0.24, 0.13], [168, 0.3, 'tulipe-simple', 'orange', 0.24, 0.14],
    [-48, 0.5, 'jacinthe', 'bleu', 0.2, 0.1], [50, 0.52, 'narcisse-trompette', 'jaune-or', 0.2, 0.11],
  ];
  for (const [a, gap, sid, cw, rx, rz] of AROUND) {
    const rad = (a * Math.PI) / 180, d = RB + gap + rx * 0.5;
    out.push(mkDrift(r, sid, cw, Math.sin(rad) * d, PZ - Math.cos(rad) * d, rx, rz, -2, { pilier: true, rot: rad * 0.3 }));
  }
  return out;
}
// inside a drift: its blob radius at an angle (noisy outline), and whether a ground point falls in it (0..1, soft edge);
// k widens the blob (the low-grass patch round a carpet)
function inDrift(d, X, Z, k = 1) {
  const c = Math.cos(d.rot), s = Math.sin(d.rot);
  const u = ((X - d.X) * c + (Z - d.Z) * s) / (d.rx * k), v = (-(X - d.X) * s + (Z - d.Z) * c) / (d.rz * k);
  const rr = Math.hypot(u, v);
  if (rr > 1.6) return 0;
  const a = Math.atan2(v, u);
  const edge = 1 + 0.28 * vnoise(d.seed, Math.cos(a) * 1.6 + 5, Math.sin(a) * 1.6 + 5) + 0.12 * vnoise(d.seed + 9, Math.cos(a) * 4 + 9, Math.sin(a) * 4 + 9);
  return 1 - smooth(0.72 * edge, 1.05 * edge, rr);
}
// A field over the ground from a list of drifts (bucketed by 0.5 m cells): fn(drift, X, Z) -> value, combined by `op`
function driftField(list, k, fn, op, init) {
  const cell = 0.5, map = new Map();
  for (const d of list) {
    const R = Math.max(d.rx, d.rz) * k * 1.6;
    for (let i = Math.floor((d.X - R) / cell); i <= Math.floor((d.X + R) / cell); i++)
      for (let j = Math.floor((d.Z - R) / cell); j <= Math.floor((d.Z + R) / cell); j++) {
        const key = i * 100003 + j;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(d);
      }
  }
  return (X, Z) => {
    const L = map.get(Math.floor(X / cell) * 100003 + Math.floor(Z / cell));
    let v = init;
    if (L) for (const d of L) v = op(v, fn(d, X, Z));
    return v;
  };
}
// the low-grass patches: under each low bulb's drift (and a little round it) the grass stands at `low` of its height
export function lowField(D) {
  const L = D.filter((d) => d.low > 0 && d.Z - d.rz < MID[1] + 1);
  return driftField(L, 1.3, (d, X, Z) => lerp(1, d.low, inDrift(d, X, Z, 1.3)), Math.min, 1);
}
// the grass thinned under the drifts from 3.4 m on (the heads and their stems hide it): half of the hatch kept at the
// heart of a drift beyond 5.5 m
export function thinField(D) {
  const L = D.filter((d) => d.Z + d.rz > 3.4 && d.Z - d.rz < MID[1] + 1);
  const f = driftField(L, 1, (d, X, Z) => inDrift(d, X, Z), Math.max, 0);
  // and, everywhere, a fifth of the hatch from 2.6 m and a third from 8 m (its blades finer than a pixel there)
  return (X, Z) => (Z < 2.6 ? 1 : Math.min(Z < 3.4 ? 1 : 1 - 0.5 * smooth(3.4, 5.5, Z) * f(X, Z), 0.75) * (Z > 8 ? 0.7 : 1));
}

// ---------- far silhouettes (heads under 9 units) ----------
// Drawn in cm, the head's foot at the origin, up is -y; two or three tones of the engine's own head (tonesOf): lit
// (upper left, the sun's side), body, shade (lower right); `coeur` the anemone's dark heart. Unit shapes are scaled by the
// head's height H and width.
const SIL = {
  cup: { w: 0.72, parts: [['corps', 'M-.5-.95C-.52-.4-.3 0 0 0C.3 0 .52-.4 .5-.95C.35-1 .2-.92 0-.98C-.2-.92-.35-1-.5-.95Z'],
    ['clair', 'M-.5-.95C-.52-.45-.32-.08-.08-.04C-.17-.35-.19-.7-.14-.95C-.26-.99-.38-.99-.5-.95Z'], ['ombre', 'M.5-.95C.52-.4 .3 0 0 0C.22-.12 .35-.45 .33-.92Z']] },
  bowl: { w: 1.05, parts: [['corps', 'M-.5-.7C-.5-.25-.25 0 0 0C.25 0 .5-.25 .5-.7C.42-.98 .2-1 0-.98C-.2-1-.42-.98-.5-.7Z'],
    ['clair', 'M-.5-.7C-.5-.35-.32-.1-.1-.06C-.2-.4-.18-.75-.08-.98C-.25-.99-.43-.95-.5-.7Z'], ['ombre', 'M.5-.7C.5-.25 .25 0 0 0C.2-.1 .38-.35 .4-.75Z']] },
  trumpet: { w: 1.1, parts: [['corps', 'M-.5-.55C-.5-.85-.25-1 0-1C.25-1 .5-.85 .5-.55C.5-.25 .25-.1 0-.1C-.25-.1-.5-.25-.5-.55Z'],
    ['clair', 'M-.5-.55C-.5-.85-.25-1 0-1C-.1-.85-.15-.6-.12-.25C-.32-.3-.5-.4-.5-.55Z'], ['ombre', 'M-.05-.68L.32-.74C.4-.7 .42-.48 .34-.42L-.04-.4Z']] },
  umbel: { w: 1.2, parts: [['corps', 'M-.55-.55a.2 .2 0 1 0 .4 0a.2 .2 0 1 0-.4 0M-.15-.8a.2 .2 0 1 0 .4 0a.2 .2 0 1 0-.4 0M.15-.45a.2 .2 0 1 0 .4 0a.2 .2 0 1 0-.4 0M-.3-.25a.18 .18 0 1 0 .36 0a.18 .18 0 1 0-.36 0'],
    ['clair', 'M-.5-.6a.12 .12 0 1 0 .24 0a.12 .12 0 1 0-.24 0M-.1-.86a.12 .12 0 1 0 .24 0a.12 .12 0 1 0-.24 0'], ['ombre', 'M.02-.8a.07 .07 0 1 0 .14 0a.07 .07 0 1 0-.14 0M.32-.45a.07 .07 0 1 0 .14 0a.07 .07 0 1 0-.14 0M-.42-.55a.07 .07 0 1 0 .14 0a.07 .07 0 1 0-.14 0']] },
  spike: { w: 0.5, parts: [['corps', 'M0-1C.3-1 .55-.75 .5-.4C.48-.15 .3 0 0 0C-.3 0-.48-.15-.5-.4C-.55-.75-.3-1 0-1Z'],
    ['clair', 'M0-1C-.3-1-.55-.75-.5-.4C-.48-.2-.36-.08-.2-.03C-.24-.4-.2-.8 0-1Z'], ['ombre', 'M.5-.4C.48-.15 .3 0 0 0C.2-.12 .32-.3 .34-.6C.42-.55 .5-.48 .5-.4Z']] },
  disc: { w: 1.15, parts: [['corps', 'M-.5-.55C-.5-.8-.25-.95 0-.95C.25-.95 .5-.8 .5-.55C.5-.35 .25-.22 0-.22C-.25-.22-.5-.35-.5-.55Z'],
    ['clair', 'M-.5-.55C-.5-.8-.25-.95 0-.95C-.12-.82-.2-.65-.2-.5C-.35-.48-.48-.5-.5-.55Z'], ['ombre', 'M.5-.55C.5-.35 .25-.22 0-.22C.2-.32 .38-.42 .46-.6Z'],
    ['coeur', 'M-.13-.6a.13 .09 0 1 0 .26 0a.13 .09 0 1 0-.26 0']] },
  iris: { w: 1.0, parts: [['corps', 'M-.08-1C-.2-.75-.12-.55-.05-.45C-.3-.5-.55-.45-.5-.2C-.3-.25-.15-.3 0-.2C.15-.3 .3-.25 .5-.2C.55-.45 .3-.5 .05-.45C.12-.55 .2-.75 .08-1Z'],
    ['clair', 'M-.08-1C-.2-.75-.12-.55-.05-.45C-.3-.5-.55-.45-.5-.2C-.38-.26-.25-.32-.12-.32C-.15-.5-.15-.75-.08-1Z'], ['ombre', 'M.05-.45C.3-.5 .55-.45 .5-.2C.38-.24 .25-.3 .12-.3Z']] },
  bell: { w: 0.62, parts: [['corps', 'M.08-.98C.3-.98 .42-.85 .44-.6L.5-.12C.35-.02 .12-.02-.02-.1L.0-.6C0-.85 .02-.98 .08-.98Z'],
    ['clair', 'M.08-.98C-.0-.95 0-.85 0-.6L-.02-.1C.06-.05 .14-.04 .2-.04C.16-.4 .14-.75 .08-.98Z'], ['ombre', 'M.44-.6L.5-.12C.44-.08 .38-.06 .32-.05C.36-.3 .38-.5 .36-.75Z']] },
};
// one symbol per colourway, in cm (head height H): <g id> with its tones
function silhouette(id, sid, cw) {
  const f = FIELD[sid], k = SIL[f.kind], t = tonesOf(sid, cw);
  if (!t) return null;
  const Hh = f.head * ((miniOf(sid, cw) || {}).k || 1), Wd = k.w * Hh;
  const col = { corps: t.corps, clair: t.clair, ombre: t.ombre, coeur: '#24182c' };
  // the unit shapes scaled: x by the width, y by the height (a transform on the group keeps the strings short)
  const body = k.parts.map(([tone, d]) => `<path d="${d}" fill="${col[tone]}"/>`).join('');
  return { id, sid, cw, H: Hh, g: `<g id="${id}" transform="scale(${n3(Wd)} ${n3(Hh)})">${body}</g>`, col };
}

// ---------- the stems ----------
// A planted head's stem in screen units: from its receptacle R along the head's own neck path (np, turned and scaled as
// the head), then a cubic bending down to its lower end B (vertical there), which lies inside the grass (hidden).
// th: the head's tilt (radians), s/sx: its scale; returns the centreline, top first.
function stemLine(v, R, th, s, sx, B) {
  const c = Math.cos(th), sn = Math.sin(th);
  const tr = ([u, w]) => [R[0] + (c * u * sx - sn * w) * s, R[1] + (sn * u * sx + c * w) * s];
  const np = (v.np || [[0, 0]]).map(tr);
  // keep the neck's points spaced >= 2.5 units, stop above the lower end
  const pts = [np[0]];
  for (let i = 1; i < np.length; i++) {
    const p = np[i];
    if (p[1] > B[1] - 2) break;
    const q = pts[pts.length - 1];
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= 2.5 || i === np.length - 1) pts.push(p);
  }
  const E = pts[pts.length - 1];
  const nd = v.nd || [0, 1];
  let t = [c * nd[0] * sx - sn * nd[1], sn * nd[0] * sx + c * nd[1]];
  const tl = Math.hypot(t[0], t[1]) || 1;
  t = [t[0] / tl, t[1] / tl];
  const d = Math.hypot(B[0] - E[0], B[1] - E[1]);
  if (d > 3) {
    const P1 = [E[0] + t[0] * d * 0.38, E[1] + t[1] * d * 0.38], P2 = [B[0], B[1] - d * 0.36];
    const n = clamp(Math.round(d / 14), 2, 6);
    for (let i = 1; i <= n; i++) {
      const q = i / n, a = (1 - q) ** 3, b = 3 * (1 - q) ** 2 * q, cc = 3 * (1 - q) * q * q, dd = q ** 3;
      pts.push([a * E[0] + b * P1[0] + cc * P2[0] + dd * B[0], a * E[1] + b * P1[1] + cc * P2[1] + dd * B[1]]);
    }
  }
  return pts;
}
// relative path data of a polyline, rounded to `g`
function relPath(P, g, close) {
  const q = (v) => Math.round(v / g) * g;
  let px = q(P[0][0]), py = q(P[0][1]), t = 'M' + n1(px) + ' ' + n1(py);
  for (let i = 1; i < P.length; i++) {
    const x = q(P[i][0]), y = q(P[i][1]);
    if (x === px && y === py) continue;
    t += 'l' + n1(x - px) + ' ' + n1(y - py);
    px = x; py = y;
  }
  return t + (close ? 'z' : '');
}
// the stem's outline: a ribbon round its centreline, w0 wide at the top, w1 at its lower end
function ribbon(P, w0, w1) {
  const n = P.length, Lf = [], Rt = [];
  for (let i = 0; i < n; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    const w = lerp(w0, w1, i / (n - 1)) / 2;
    Lf.push([P[i][0] - ty * w, P[i][1] + tx * w]);
    Rt.push([P[i][0] + ty * w, P[i][1] - tx * w]);
  }
  return relPath(Lf.concat(Rt.reverse()), 0.2, true);
}
// the stem's tones: the engine's (GHI sc: dark, body, light, highlight), lit above the grass, then the grass's shade
// (the light that reaches inside the canopy has crossed its leaves: dark, green), down to its inner green
// Above the grass a stem also takes the light the sunlit grass round it sends back (green): its body is the engine's
// tone with 30 % of the meadow's lit green (MEADOW_LIT, herbe.mjs's lit blades), its sunlit edge the engine's light tone
const CANOPY_IN = '#2a4412', CANOPY_DEEP = '#1d300c', MEADOW_LIT = '#5a8a2a';
const stemTones = (sc) => { const body = mixHex(sc[1], MEADOW_LIT, 0.3); return { lit: mixHex(body, sc[2], 0.12), body, sh: mixHex(sc[1], CANOPY_IN, 0.7), deep: CANOPY_DEEP, hl: mixHex(body, sc[2], 0.55) }; };

// ---------- planting ----------
// The meadow's flowers as sol.mjs inserts: in the mid band (ZNEAR to 14.5 m) one insert per 1 % of depth (its grass in
// front hides the feet and most of the stems), the far meadow's flowers in one insert at 14.5 m (drawn over the far
// grass, so only what stands above the grass is drawn there). okAt(X, Z): 1 in the hay meadow, 0 on the mown walk, -1 on
// a stone or the pillar (sol.mjs mowField); canopy(X, Z): the grass's height there; low(X, Z): the low patches' factor.
const FAR_GREEN = '#86955a'; // the far meadow's mean tone (prairie-loin, measured on its render at 30-80 m)
const TM_MIN = 9; // head height on screen (units) under which a head is a silhouette
export let TM_FAR = 7; // beyond it (m), silhouettes, but for the heads still TM_BIG units high or more
export let TM_BIG = 13;
const TM_LOIN = new Set(['tulipe-double', 'tulipe-perroquet', 'iris-hollandais', 'jacinthe']);
export const setTmBig = (v) => { TM_BIG = v; };
export const setTmFar = (v) => { TM_FAR = v; };
// The drawings planted in the ground, by depth file (each drawing lives in one file only: a drawing used by two files
// weighs in both). Near file (nearer than SPLIT[1]): the full heads, one per colourway (the clumps in front of it
// bring their own); the heavy full heads (hyacinths, ranunculus, anemones, tazetta, iris: 6-10 Ko each)
// stay reduced. Middle file: the reduced heads, two for the commonest colourways. Far file: silhouettes and dots.
export const SOL_TP = new Set(['ts-rouge-a', 'ts-jaune-a', 'ts-rose-a', 'ts-orange-a', 'ts-blanc-a', 'ts-fuchsia-a',
  'ts-rouge-feu-a', 'ts-corail-a', 'td-rose-a', 'td-blanc-a', 'td-jaune-a', 'tp-abricot-a', 'tf-rose-a', 'nt-jaune-a', 'nt-jaune-or-a',
  'nt-blanc-a', 'nt-citron-a', 'fr-damier-a'].map((c) => 'tp/' + c));
export const SOL_TM = new Set(Object.keys(LIB).filter((n) => n.startsWith('tm/') && !/(ts-(rouge|jaune)-c|ts-(rouge-feu|orange|blanc|fuchsia|corail)-b|td-rose-b|tp-abricot-b|tf-rose-b|nt-jaune-or-b|nb-avalanche-b|ja-bleu-b|an-bleu-b|re-orange-b|fr-damier-b)$/.test(n)));
export function plant(seed = 1, { okAt = () => 1, canopy = (X, Z) => canopyAt(X, Z, 1), low = () => 1, D = null, split = SPLIT, stats = {} } = {}) {
  D = D || drifts(seed, okAt, split);
  const pieces = new Map(), sils = new Map(), grads = new Map();
  const pc = (name, tier) => { if (!pieces.has(name)) pieces.set(name, piece(name, `F${short(pieces.size)}_`, GRID[tier], MIN_BLUR)); return pieces.get(name); };
  const sl = (sid, cw) => { const k = sid + '~' + cw; if (!sils.has(k)) sils.set(k, silhouette(`L${short(sils.size)}`, sid, cw)); return sils.get(k); };
  // the full stems' gradients (object bounding box, top to bottom): one per species and share f of the stem above the grass
  const grad = (sid, f) => {
    const k = sid + '~' + f;
    if (!grads.has(k)) {
      const T = stemTones(scOf(sid)), id = `S${short(grads.size)}`;
      const st = [[0, T.lit], [Math.max(0.02, f - 0.04), T.body], [Math.min(0.99, f + 0.08), T.sh], [1, T.deep]];
      grads.set(k, { id, def: `<linearGradient id="${id}" x2="0" y2="1">${st.map(([o, c]) => `<stop offset="${n3(o)}" stop-color="${c}"/>`).join('')}</linearGradient>` });
    }
    return grads.get(k).id;
  };
  const bins = new Map(); // bin -> { z, items: [{Z, ...}] }
  const far = []; // far meadow: [{ Z, svg }]
  const n = { tp: 0, tm: 0, sil: 0, far: 0, bandes: 0, low: 0 };
  const binOf = (Z) => Math.floor(Math.log(Z / ZNEAR) / Math.log(1.01));
  const push = (Z, item) => { const b = binOf(Z); if (!bins.has(b)) bins.set(b, { z: ZNEAR * 1.01 ** b, items: [] }); bins.get(b).items.push({ Z, ...item }); };
  for (const d of D) {
    const f = FIELD[d.sid], mini = miniOf(d.sid, d.cw), vv = variantsOf(d.sid, d.cw), r = rng(seed, d.seed, 7);
    const S = sl(d.sid, d.cw), sc = scOf(d.sid), T = stemTones(sc);
    const hr = mini ? mini.h : f.h, k0 = mini ? mini.k : 1;
    const isLow = d.low > 0;
    if (d.Z - d.rz < MID[1]) {
      // the mid band: every stem of the drift (jittered grid at the drift's density), denser at the front
      const dens = f.dens * lerp(1.3, 1, smooth(3, 8, d.Z));
      const step = 1 / Math.sqrt(dens), R = Math.max(d.rx, d.rz) * 1.15;
      for (let gx = -R; gx < R; gx += step) for (let gz = -R; gz < R; gz += step) {
        const X = d.X + gx + r.range(-0.45, 0.45) * step, Z = d.Z + gz + r.range(-0.45, 0.45) * step;
        if (Z < ZNEAR || Z >= MID[1]) continue;
        if (r() > inDrift(d, X, Z)) continue;
        const m = okAt(X, Z);
        // the walk stays trodden (okAt under 0.3); in the sward's rise to the hay the mower spared the bulbs: the tall
        // ones from 0.55 on, the low ones from 0.3
        // (round the pillar the gardener's bulbs stand right up to the mown collar)
        if (m < (isLow || d.pilier ? 0.3 : 0.55)) continue;
        const [sx0] = project(X, 0, Z);
        if (sx0 < STRIP[0] - 30 || sx0 > STRIP[1] + 30) continue;
        const can = canopy(X, Z) * low(X, Z) * (m < 1 ? lerp(0.45, 1, m) : 1);
        // its height: its head and a share of stem over the grass, the drift's own (t: from just over the grass to
        // well above it), spread inside it, within the species' range; its size grows a little with it
        const t = clamp(d.t + 0.2 * r.gauss(), 0, 1);
        const Hm = clamp(can + (f.head * k0) / 100 + lerp(0.005, 0.24, t), (hr[0] * 0.85) / 100, hr[1] / 100);
        const k = k0 * r.range(0.9, 1.1) * (0.95 + 0.1 * t);
        // a flower whose top stays in the grass is not seen
        if (Hm < can * 0.82) continue;
        const sEng = (F * 0.01) / (UPC * Z) * k; // engine units -> screen units
        // the level by the depth file it falls in (near: full heads, middle: reduced ones, far: silhouettes) and, in the
        // middle, by the head's height on screen
        const tps = vv.tp.filter((x) => SOL_TP.has(x)), tms = vv.tm.filter((x) => SOL_TM.has(x));
        let name = null, tier = 'sil';
        const ref = tms[0] || tps[0];
        const hs = ref ? LIB[ref].head[3] * sEng : 0;
        // (the file is the one of the plant's depth slice)
        const zb = ZNEAR * 1.01 ** binOf(Z);
        if (zb < split[1]) {
          if (tps.length) { tier = 'tp'; name = tps[Math.floor(r() * tps.length)]; }
          else if (tms.length) { tier = 'tm'; name = tms[Math.floor(r() * tms.length)]; }
        } else if (zb < TM_FAR && hs >= TM_MIN && tms.length) { tier = 'tm'; name = tms[Math.floor(r() * tms.length)]; }
        // beyond TM_FAR (the far file) the big heads whose silhouette would read as a blob keep one reduced drawing
        // (double and parrot tulips, irises, hyacinths: the same drawing then lives in the middle and far files)
        else if (zb >= TM_FAR && TM_LOIN.has(d.sid) && hs >= TM_BIG && tms.length) { tier = 'tm'; name = tms[tms.length - 1]; }
        const th = (clamp(d.wind + 5 * r.gauss(), -16, 16) * Math.PI) / 180;
        if (tier !== 'sil') {
          const v = LIB[name], p = pc(name, tier);
          const sx = r.range(0.93, 1.07);
          // the receptacle: below the head's top by the head's own reach above it; the stem leans with the head
          const headTop = (Math.max(0, -v.head[1]) / UPC / 100) * k;
          const Hr = Math.max(can * 0.6, Hm - headTop);
          const dX = Math.sin(th) * 0.5 * Hr;
          // (the grass's tallest blades stand above its mean canopy: the shade begins a little higher)
          const Rp = project(X + dX, Hr, Z), B = project(X, can * 0.45, Z), yCan = project(X, can * 1.12, Z)[1];
          const cs = Math.cos(th), sn = Math.sin(th);
          const head = `<use href="#${p.id}" transform="matrix(${n3(cs * sEng * sx)} ${n3(sn * sEng * sx)} ${n3(-sn * sEng)} ${n3(cs * sEng)} ${n1(Rp[0])} ${n1(Rp[1])})"/>`;
          const P = stemLine(v, Rp, th, sEng, sx, B);
          const w = (STEM_W[d.sid] || [0.4, 0.5]).map((cm) => ((cm / 100) * F * k) / Z);
          const item = { head };
          if (tier === 'tp' && w[0] >= 1.4) {
            // a full stem: its outline, its gradient lit above the grass and shaded below, a highlight on its sunlit
            // side above the grass
            const fq = clamp(Math.round(((yCan - Rp[1]) / Math.max(1, B[1] - Rp[1])) * 8) / 8, 0, 1);
            item.stem = `<path d="${ribbon(P, w[0], w[1])}" fill="url(#${grad(d.sid, fq)})"/>`;
            const lit = P.filter((q) => q[1] < yCan - 2);
            if (w[0] >= 2.4 && lit.length >= 2) item.stem += `<path d="${relPath(lit.map((q, i) => [q[0] - w[0] * 0.22, q[1] + (i === 0 ? w[0] * 0.8 : 0)]), 0.2)}" stroke="${T.hl}" stroke-width="${n1(Math.max(0.5, w[0] * 0.22))}" fill="none" stroke-linecap="round"/>`;
          } else {
            // a thin stem: two strokes merged with the bin's others, lit above the grass, shaded in it
            // (the neck's bend kept, the rest straightened: at most four points above the grass, two inside it)
            const at = (y) => { for (let i = 1; i < P.length; i++) if (P[i][1] >= y) { const a = P[i - 1], b = P[i], u = (y - a[1]) / Math.max(1e-6, b[1] - a[1]); return [lerp(a[0], b[0], u), y]; } return P[P.length - 1]; };
            const yc = clamp(yCan, Rp[1], B[1]), Pc = at(yc), Pe = at(lerp(yc, B[1], 0.5));
            const above = P.filter((q) => q[1] < yc);
            const up = (above.length > 3 ? [above[0], above[1], above[Math.floor(above.length * 0.6)]] : above).concat([Pc]);
            // (a stroke's antialiased edges read wider than a filled ribbon's: 0.85 of the width)
            const wq = Math.max(0.45, Math.round(w[0] * 0.85 * 4) / 4);
            item.strokes = [];
            if (up.length >= 2 && yc - Rp[1] > 0.5) item.strokes.push([T.body, wq, relPath(up, 0.2)]);
            if (Pe[1] - Pc[1] > 0.5 && Z < 5.5) item.strokes.push([T.sh, wq, relPath([Pc, Pe], 0.2)]);
          }
          push(Z, item);
          n[tier]++;
          if (isLow) n.low++;
        } else if (S) {
          const Hh = (f.head / 100) * k;
          const yh = f.kind === 'bell' ? Hm : Hm - Hh;
          const [x, y] = project(X + Math.sin(th) * 0.3 * yh, yh, Z), [x0, y0] = project(X, can * 0.5, Z), s = (F * 0.01 * k) / Z;
          const yc = project(X, can, Z)[1];
          const wq = Math.max(0.4, Math.round((((STEM_W[d.sid] || [0.4])[0] / 100) * F * k) / Z * 4) / 4);
          // (at this size the stem shows only above the grass)
          const strokes = yc - y > 0.6 ? [[T.body, wq, `M${n1(x)} ${n1(y)}l${n1(lerp(x, x0, (yc - y) / Math.max(1, y0 - y)) - x)} ${n1(yc - y)}`]] : [];
          push(Z, { strokes, head: `<use href="#${S.id}" transform="translate(${n1(x)} ${n1(y)}) scale(${n3(s)})"/>` });
          n.sil++;
          if (isLow) n.low++;
        }
      }
    } else if (S) {
      // the far meadow: the eye no longer separates the stems; each drift is a scatter of its heads as dots (the body
      // tone, mixed with the green between them as distance grows, and a lit dot over the upper left of some), rows
      // as deep as the drift is on screen, gaps of grass between them
      const s = ((F * 0.01) / d.Z) * k0, Hs = f.head * s, Ws = Hs * SIL[f.kind].w;
      const share = lerp(0.9, 0.62, smooth(15, 80, d.Z));
      const body = mixHex(FAR_GREEN, S.col.corps, share), lit = mixHex(FAR_GREEN, S.col.clair, Math.min(1, share + 0.08));
      const dots = [], lits = [];
      const cr = Math.cos(d.rot), sr = Math.sin(d.rot);
      const nRows = clamp(Math.round((F * EYE * 2 * d.rz) / (d.Z * d.Z) / Math.max(0.6, Hs * 0.35)), 1, 5);
      for (let kk = 0; kk < nRows; kk++) {
        const v = nRows === 1 ? 0 : -0.8 + (1.6 * kk) / (nRows - 1);
        const span = Math.sqrt(Math.max(0, 1 - v * v)) * (0.85 + 0.25 * vnoise(d.seed, v * 3, 2));
        const Zr = d.Z + v * d.rz;
        const sp = Math.max(1.6, Ws * r.range(1.7, 2.4));
        for (let u = -span; u < span; u += (sp * Zr) / F / d.rx) {
          if (r() < 0.18) continue; // a gap of grass
          const X = d.X + u * d.rx * cr - v * d.rz * sr, Zp = Zr + u * d.rx * sr;
          const hm = (hr[0] * 0.85 + r() * (hr[1] - hr[0] * 0.85)) / 100 - (f.head * k0) / 200;
          const [x, y] = project(X, hm, Zp);
          if (x < STRIP[0] + 25 || x > STRIP[1] - 25) continue;
          dots.push([x, y]);
          if (r() < 0.55) lits.push([x - Ws * 0.15, y - Hs * 0.18]);
        }
      }
      if (!dots.length) continue;
      // one path per tone, the dots as zero-length round-capped strokes in relative moves (sorted along x)
      // (on a half-unit grid: a far head is one to three units wide)
      const rel = (Pp) => { Pp.sort((a, b) => a[0] - b[0]); let px = 0, py = 0, t = ''; for (const [x, y] of Pp) { const X = Math.round(x * 2) / 2, Y = Math.round(y * 2) / 2; if (t && X === px && Y === py) continue; t += (t ? 'm' + n1(X - px) + ' ' + n1(Y - py) : 'M' + n1(X) + ' ' + n1(Y)) + 'h0'; px = X; py = Y; } return t; };
      let svg = `<path d="${rel(dots)}" stroke="${body}" stroke-width="${n1(Math.max(0.9, Hs * 0.75))}" stroke-linecap="round"/>`;
      if (lits.length) svg += `<path d="${rel(lits)}" stroke="${lit}" stroke-width="${n1(Math.max(0.6, Hs * 0.42))}" stroke-linecap="round"/>`;
      n.far += dots.length;
      far.push({ Z: d.Z, svg });
      n.bandes++;
    }
  }
  // the inserts, far to near
  const inserts = [];
  if (far.length) inserts.push({ z: MID[1], svg: '<g>' + far.sort((a, b) => b.Z - a.Z).map((q) => q.svg).join('') + '</g>' });
  for (const [, b] of [...bins.entries()].sort((a, b2) => b2[0] - a[0])) {
    b.items.sort((p, q) => q.Z - p.Z);
    // the thin stems of this slice, merged by colour and width, under the heads
    const st = new Map();
    for (const it of b.items) for (const [c, w, dd] of it.strokes || []) { const key = c + '|' + w; if (!st.has(key)) st.set(key, { c, w, d: [] }); st.get(key).d.push(dd); }
    const stems = [...st.values()].map((v) => `<path d="${v.d.join('')}" stroke="${v.c}" stroke-width="${n3(v.w)}" fill="none" stroke-linecap="round"/>`).join('');
    const svg = stems + b.items.map((it) => (it.stem || '') + it.head).join('');
    inserts.push({ z: b.z, svg });
  }
  // the shared drawings go with the first insert
  const defs = [...pieces.values()].map((p) => p.defs + p.g).join('') + [...sils.values()].filter(Boolean).map((q) => q.g).join('') + [...grads.values()].map((g) => g.def).join('');
  if (inserts.length) inserts[0].defs = defs;
  const all = inserts.map((i) => i.svg).join('');
  Object.assign(stats, n, { ids: Object.fromEntries([...pieces.values()].map((p) => [p.id, p.name])), drifts: D.length, pieces: pieces.size, silhouettes: sils.size, gradients: grads.size, kB: { defs: gz(defs), uses: gz(all), total: gz(defs + all) } });
  return inserts;
}

// ---------- the ground in three depth files ----------
// The flowered ground (sol.mjs, its pieces in painting order with their depth) cut at z1 and z2 into three files of about
// the same drawing cost, laid in this order in the page (each <img> is rasterised on its own): sol-loin (the far meadow
// and everything beyond z1), sol-milieu (z2 to z1), sol-pres (nearer than z2). Each file carries only the defs its
// pieces use (followed through their references); laid over one another they give back sol-fleuri.svg.
export const SPLIT = [7, 3.3];
// beyond 14.5 m single blades are finer than a pixel: two thirds of the far meadow's hatch are drawn (herbe farMeadow)
export const FAR_THIN = 0.6;
// the walk of the flowered ground (sol.mjs setWalk): trodden ±0.25 m round the stones' line, a short rise to the hay,
// a mown collar of a few centimetres round the pillar's foot (critique of 15 Oct.: the walk filled the phone's column)
export const WALK_FLEURI = { half: 0.25, disc: 0.02, ret: [0.1, 0.03], edge: [0.03, 0.02, 0.012], trod: [0.05, 0.25] };
export function splitSol(r, z1 = SPLIT[0], z2 = SPLIT[1]) {
  const els = splitTop(r.defs);
  const owner = new Map(); // every id (nested ones too) -> its top-level element
  els.forEach((e, i) => { for (const m of e.matchAll(/\bid="([^"]+)"/g)) owner.set(m[1], i); });
  const refs = (t) => [...t.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] || m[2]);
  const parts = [[], [], []];
  for (const c of r.chunks) parts[c.z >= z1 ? 0 : c.z >= z2 ? 1 : 2].push(c.svg);
  return parts.map((P) => {
    const body = P.join('');
    const need = new Set(), stack = refs(body);
    while (stack.length) {
      const id = stack.pop();
      if (!owner.has(id)) continue;
      const i = owner.get(id);
      if (need.has(i)) continue;
      need.add(i);
      stack.push(...refs(els[i]));
    }
    const defs = els.filter((e, i) => need.has(i) || !/\bid="/.test(e)).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;
    // every reference must find its element in the same file
    const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    const lost = [...new Set(refs(svg))].filter((id) => !ids.has(id));
    if (lost.length) throw new Error('références perdues : ' + lost.slice(0, 8).join(' '));
    return svg;
  });
}

// ---------- command line ----------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
  const split = opt('--split', SPLIT.join(',')).split(',').map(Number);
  // --bas y: the frame's bottom for the clumps (the frieze: 1460, herbe.mjs setBottom)
  const bas = opt('--bas', null);
  if (bas) (await import('./herbe.mjs')).setBottom(Number(bas));
  const [cmd = 'touffes', seedArg] = args;
  const seed = Number(seedArg || 1);
  const out = join(HERE, 'out');
  if (cmd === 'touffes') {
    const T = touffesFleuries(seed);
    T.forEach((t, i) => {
      writeFileSync(join(out, `touffe-fleurie-${i + 1}.svg`), t.svg);
      console.log(`touffe-fleurie-${i + 1}.svg : ${t.n} fleurs${t.nu ? ' (sans feuilles)' : ''}, ${(t.svg.length / 1024).toFixed(1)} Ko, ${t.kb} Ko gzip, ${JSON.stringify(t.place)}`);
    });
    // scene.json: the "touffes" key keeps every other entry; ours are replaced or appended (nearest last)
    const sj = join(out, 'scene.json');
    const scene = existsSync(sj) ? JSON.parse(readFileSync(sj, 'utf8')) : {};
    const keep = (scene.touffes || []).filter((e) => !/^touffe-fleurie-\d+\.svg$/.test(e.src));
    scene.touffes = keep.concat(T.map((t, i) => [TOUFFES_FLEURIES[i].Z, t.place]).sort((a, b) => b[0] - a[0]).map((e) => e[1]));
    writeFileSync(sj, JSON.stringify(scene, null, 1));
    console.log(`scene.json : ${keep.length} touffes d'herbe gardées, ${T.length} touffes fleuries`);
  } else if (cmd === 'sol') {
    // the ground with its flowers, through sol.mjs's entry (its walk, narrowed, and stones as it lays them)
    const { sol, mowField, setWalk } = await import('./sol.mjs');
    const { stones } = await import('./dalles.mjs');
    setWalk(WALK_FLEURI);
    const Dd = stones(7, { lawn: true, lawnH: 0.06 });
    const okAt = mowField(1, Dd.layout, Dd.stones);
    const stats = {};
    const t0 = performance.now();
    const D = drifts(seed, okAt, split);
    const low = lowField(D), thin = thinField(D);
    const ins = plant(seed, { okAt, low, D, split, stats });
    const t1 = performance.now();
    const r = sol({ inserts: ins, low, thin, farThin: () => FAR_THIN });
    // the far silhouettes of the library, one standalone file each (head of 10 cm drawn 20 units per cm, foot at 0)
    mkdirSync(join(OUTF, 'loin'), { recursive: true });
    for (const [sid, cw] of PLAQUES) {
      const S = silhouette('L', sid, cw);
      if (!S) continue;
      const w = SIL[FIELD[sid].kind].w * S.H;
      writeFileSync(join(OUTF, 'loin', `${FIELD[sid].kind}-${sid}-${cw}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n1(-w * 0.75)} ${n1(-S.H * 1.1)} ${n1(w * 1.5)} ${n1(S.H * 1.2)}" width="${n1(w * 30)}" height="${n1(S.H * 24)}"><defs>${S.g}</defs><use href="#L"/></svg>`);
    }
    writeFileSync(join(out, 'sol-fleuri.svg'), r.svg);
    const files = splitSol(r, split[0], split[1]);
    const names = ['sol-loin.svg', 'sol-milieu.svg', 'sol-pres.svg'];
    const kb = {};
    files.forEach((svg, i) => { writeFileSync(join(out, names[i]), svg); kb[names[i]] = { brut: +(svg.length / 1024).toFixed(1), gzip: gz(svg) }; });
    const info = { coupes: split, fichiers: kb, total3: +Object.values(kb).reduce((a, v) => a + v.gzip, 0).toFixed(1), fleurs: stats, sol: r.kB, ms: { plantation: Math.round(t1 - t0), sol: Math.round(r.ms) } };
    writeFileSync(join(out, 'sol-fleuri.json'), JSON.stringify(info, null, 1));
    console.log(`sol-fleuri.svg : ${(r.svg.length / 1024).toFixed(0)} Ko, ${r.kB.total} Ko gzip ; fleurs ${stats.kB.total} Ko gzip (dessins ${stats.kB.defs}, plantation ${stats.kB.uses})`);
    console.log(`  ${names.map((nm) => `${nm} ${kb[nm].gzip}`).join(', ')} Ko gzip ; total ${info.total3} Ko (coupes à ${split.join(' et ')} m)`);
    console.log(`  ${stats.tp} têtes entières, ${stats.tm} réduites, ${stats.sil} silhouettes (${stats.low} bulbes bas), ${stats.far} têtes lointaines ; ${stats.drifts} plaques, ${stats.pieces} dessins du moteur, ${stats.gradients} dégradés de tige`);
    console.log(`  parts du sol (gzip seul) : prairie ${r.kB.prairie}, loin ${r.kB.loin}, pilier ${r.kB.pilier}, dalles ${r.kB.dalles}`);
  }
}
