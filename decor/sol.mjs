// sol.mjs: the ground of the shop scene as one fixed SVG (out/sol.svg), composed by depth: the far meadow (z4), then
// the meadow grass in depth bands with the pillar and each stepping stone laid between them at their own distance,
// so that grass nearer than an object passes in front of it (the pillar's foot and the stones' edges are eaten by the
// grass in front, the grass behind them is hidden by them). It replaces, in the page, prairie-loin + prairie-milieu
// + chemin + pilier (those files are still written by their own modules).
//
//   node decor/sol.mjs [--herbe 1] [--dalles 7] [--pilier 1] [--out decor/out/sol.svg] [--log]
//   import { sol } from './sol.mjs';  sol(opts) -> { svg, cuts, stones, kB }
//
// The walk: along the stones and round the pillar's foot the meadow is mown (herbe.mjs lawnAt, 8-12 cm, dense, no
// culms), with an uneven edge (3-10 cm beyond the stones, 24 cm either side of the path's line, 0.53-0.6 m round the
// pillar) and a progressive return to the hay meadow over 18-26 cm on both sides (mowField below, through the `mow`
// option of herbe.mjs grassBand). Nothing is rooted on a stone or inside the pillar's foot.
//
// Light: SUN = normalize(-0.5, 1.2, 0.6) everywhere. The pillar's cast shadow (pilier.mjs, part "ombre") is laid over
// the grass behind its axis and under the grass in front; the blades rooted in that shadow in front of the axis are
// lit by the sky only (`shade` option of grassBand). The stones carry the shadows of the lawn standing round them
// (dalles.mjs stones(seed, { lawn: true })).
//
// FLOWERS (next chantier): pass `inserts`, a list of objects laid in the meadow by depth,
//   sol({ inserts: [{ z, svg, defs, zmin }] })
//     z     ground depth (m) at which the object stands (its foot; for a wide object, its far edge): it is drawn after
//           the grass rooted beyond z and before the grass rooted nearer, which hides its foot;
//     svg   its drawing in the 2400 x 1350 world frame (body markup, no <svg> root); defs: its own defs (ids unique);
//     zmin  (optional) its nearest depth: the rows between zmin and z get no deep-canopy mass, which would cover the
//           object's near part. Objects at the same z keep the list's order.
// The bands are generated once whatever the number of cuts (each row is split by root depth, its tones unchanged).
//
// Second flower chantier (15 Oct., evening), every option off by default (sol.svg unchanged):
//   setWalk({ half, disc, ret, edge, trod })   the walk's width: trodden and mown `half` m either side of the stones'
//          line (default .42; the flowered ground uses .25), the mown disc round the pillar's foot (`disc`, default .3),
//          the return to the hay ([base, noise] m, default [.26, .05]), the uneven edge ([base, fbm, noise] m, default
//          [.065, .035, .02]) and the trodden line's rise ([from, to] m, default [.1, .42]);
//   sol({ low, thin, farThin })   passed to herbe.mjs grassBand: the low-grass patches where the low bulbs carpet, the
//          share of hatch blades kept under the flower drifts, and beyond 14.5 m (farMeadow) where single blades are
//          finer than a pixel;
//   the result also gives `chunks` ([{ z, svg }] in painting order, z the depth they stand at, Infinity for the far
//          meadow) and `defs`, so the ground can be cut into depth files laid over one another (fleurs.mjs).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { CAM, grassBand, farMeadow, MID, rowZ, rowsIn, RATIO, lawnAt } from './herbe.mjs';
import { stones as dallesStones } from './dalles.mjs';
import { pilier } from './pilier.mjs';

const { W, H } = CAM;
// pillar (PLAN.md): axis 4.37 m, radius .235 m, foot flared 5-8 %
const PZ = 4.37, PR = 0.235, RB = PR * 1.08;
// SUN in the ground frame (X right, Y up, Z away): a cast shadow shifts by (.417, .5) per metre of height
const SHIFT = [0.5 / 1.2, 0.6 / 1.2];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function hash(...v) {
  let h = 0x811c9dc5;
  for (const x of v) {
    h ^= Math.imul((x * 1000003) | 0, 0x85ebca6b) ^ ((x * 7919.13) | 0);
    h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d);
    h = Math.imul(h ^ (h >>> 12), 0x297a2d39);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
}
function vnoise(seed, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const c = (i, j) => hash(seed, xi + i, yi + j) * 2 - 1;
  const a = c(0, 0) + (c(1, 0) - c(0, 0)) * u, b = c(0, 1) + (c(1, 1) - c(0, 1)) * u;
  return a + (b - a) * v;
}
const fbm = (seed, x, y) => (vnoise(seed, x, y) + 0.5 * vnoise(seed + 1, x * 2.03, y * 2.03)) / 1.5;
const inPoly = (pts, x, y) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
function edgeDist(pts, x, y) {
  let best = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i += 2) {
    const [ax, ay] = pts[j], [bx, by] = pts[i];
    const ex = bx - ax, ey = by - ay;
    const t = clamp(((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey || 1), 0, 1);
    best = Math.min(best, Math.hypot(x - ax - t * ex, y - ay - t * ey));
  }
  return best;
}

// The walk's widths (setWalk): defaults are the first assembly's
export const WALK = { half: 0.42, disc: 0.3, ret: [0.26, 0.05], edge: [0.065, 0.035, 0.02], trod: [0.1, 0.42] };
export const setWalk = (o) => Object.assign(WALK, o);
// The mown walk: m = 0 on the lawn, 1 in the hay meadow, smooth between; -1 where nothing grows (stone, pillar).
export function mowField(seed, layout, list) {
  const bb = list.map((s) => {
    const xs = s.ground.map((p) => p[0]), zs = s.ground.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)];
  });
  // the passage: mown 0.42 m either side of its line (+ an uneven 3-10 cm), back to the hay over 22-30 cm more
  const HALF = WALK.half, DISC = WALK.disc, RET = WALK.ret.slice(), EDGE = WALK.edge.slice();
  return (X, Z) => {
    for (let i = 0; i < list.length; i++) {
      const b = bb[i];
      if (X > b[0] && X < b[2] && Z > b[1] && Z < b[3] && inPoly(list[i].ground, X, Z)) return -1;
    }
    const dP = Math.hypot(X, Z - PZ) - RB;
    if (dP < 0.004) return -1;
    let d = dP - DISC;
    // the walk's line, from out of frame to the pillar
    if (Z < PZ) d = Math.min(d, Math.abs(X - layout.centre(Z)) - HALF);
    for (let i = 0; i < list.length; i++) {
      const b = bb[i];
      if (X < b[0] - 0.5 || X > b[2] + 0.5 || Z < b[1] - 0.5 || Z > b[3] + 0.5) continue;
      d = Math.min(d, edgeDist(list[i].ground, X, Z));
    }
    // uneven edge: tufts left standing, bites into the lawn (3-10 cm), and a 18-26 cm return to the hay
    const e = EDGE[0] + EDGE[1] * fbm(seed * 7 + 1, X / 0.22, Z / 0.22) + EDGE[2] * vnoise(seed * 7 + 3, X / 0.06, Z / 0.06);
    const w = RET[0] + RET[1] * fbm(seed * 7 + 5, X / 0.4, Z / 0.4);
    // right against the pillar the mower leaves a collar of uncut grass, patchy round the foot
    const th = Math.atan2(X, PZ - Z);
    const ring = 0.6 * (1 - smooth(0.02, 0.13, dP)) * smooth(-0.2, 0.5, vnoise(seed * 7 + 9, th * 2.2, 0.5));
    return Math.max(smooth(e, e + w, d), ring);
  };
}

// The sward's height across the passage (owner, after the first assembly: "a real passage in the grass, read as a
// trodden walk"): short and pressed on its line and round the stones (TROD x 8-12 cm, 3-4 cm), rising progressively
// to the mown 8-12 cm 0.42 m out, then to the hay meadow (mowField).
export let TROD = 0.35;
export const setTrod = (v) => { TROD = v; };
export function lawnField(seed, list, layout) {
  const z0 = 0.8, z1 = PZ - RB + 0.02;
  const bb = list.map((s) => {
    const xs = s.ground.map((p) => p[0]), zs = s.ground.map((p) => p[1]);
    return [Math.min(...xs) - 0.12, Math.min(...zs) - 0.12, Math.max(...xs) + 0.12, Math.max(...zs) + 0.12];
  });
  const TR = WALK.trod.slice();
  return (X, Z) => {
    let d = 1;
    // the walked line fades out over the last 35 cm before the pillar: the foot stands in the mown sward
    if (layout && Z > z0 && Z < z1) d = Math.abs(X - layout.centre(Z)) + 0.5 * smooth(z1 - 0.4, z1 - 0.05, Z);
    for (let i = 0; i < list.length; i++) {
      const b = bb[i];
      if (X > b[0] && X < b[2] && Z > b[1] && Z < b[3]) d = Math.min(d, edgeDist(list[i].ground, X, Z) + 0.04);
    }
    return lawnAt(X, Z, seed) * (TROD + (1 - TROD) * smooth(TR[0], TR[1], d));
  };
}
// ids of a piece made unique by a prefix (ids, url(#..) and href="#..")
const prefixIds = (s, p) =>
  s.replace(/\bid="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`).replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
// <svg ...><defs>D</defs>B</svg> -> { defs, body }
function split(svg) {
  const m = svg.match(/^<svg[^>]*>\s*<defs>([\s\S]*?)<\/defs>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error('unexpected svg layout');
  return { defs: m[1], body: m[2] };
}

// flag: measures only (sol_mesure.py): the stones' faces and the pillar's column filled with flat flag colours, so the
// share left visible by the grass in front can be counted
export function sol({ herbe = 1, dalles = 7, pilierSeed = 1, inserts = [], flag = false, low = null, thin = null, farThin = null } = {}) {
  const t0 = performance.now();
  const kB = {};
  const gz = (s) => +(gzipSync(s, { level: 9 }).length / 1024).toFixed(1);
  // the stones (lawn mode: no grass of their own, the lawn's shadows on their tops)
  const D = dallesStones(dalles, { lawn: true, lawnH: 0.06 });
  const list = D.stones;
  const mow = mowField(herbe, D.layout, list);
  const lawn = lawnField(herbe, list, D.layout);
  // the pillar's cast shadow in front of its axis (for the blades standing in it): the foot disc swept along SHIFT
  const shade = (X, Z) => {
    if (Z >= PZ || Z < PZ - RB - 0.02) return false;
    const t = clamp(((X) * SHIFT[0] + (Z - PZ) * SHIFT[1]) / (0.8 * (SHIFT[0] ** 2 + SHIFT[1] ** 2)), 0, 1);
    return Math.hypot(X - t * 0.8 * SHIFT[0], Z - PZ - t * 0.8 * SHIFT[1]) < PR * 1.02 && X > 0;
  };
  // the slots: one per object, at its depth, far to near
  const slots = [{ z: PZ, zmin: PZ - RB - 0.02, kind: 'pilier' }];
  D.items.forEach((it) => slots.push({ z: it.zmax, zmin: it.zmin - 0.01, kind: 'dalle', it }));
  inserts.forEach((ins, i) => slots.push({ z: ins.z, zmin: ins.zmin ?? ins.z, kind: 'insert', ins, i }));
  slots.sort((a, b) => b.z - a.z || (a.i ?? 0) - (b.i ?? 0));
  const cuts = [...new Set(slots.map((s) => s.z))].sort((a, b) => b - a);
  // deep-canopy masses: the band's first row and every 4th; a row that overlaps an object in depth has its mass laid
  // before that object (a mass covers everything below its top, it must not cover the object's near part)
  const ks = rowsIn(MID[0], MID[1]);
  const kFar = ks[ks.length - 1];
  const mass = (k) => {
    if (!((k === kFar || k % 4 === 0) && rowZ(k) >= MID[0])) return false;
    const over = slots.filter((s) => rowZ(k) < s.z && rowZ(k) * RATIO > s.zmin);
    return { at: Math.max(0, ...over.map((s) => s.z + 1e-4)) };
  };
  const band = grassBand(MID[0], MID[1], { seed: herbe, prefix: 's', mow, lawn, shade, cuts, mass, ...(low ? { low } : {}), ...(thin ? { thin } : {}) });
  kB.prairie = gz(band.defs + band.body);
  // far meadow (z4)
  const far = split(farThin ? farMeadow(herbe, { thin: farThin }) : farMeadow(herbe));
  kB.loin = gz(far.defs + far.body);
  // pillar: cast shadow, column, moss collar (its defs and ids prefixed)
  const P = split(prefixIds(pilier(pilierSeed), 'p'));
  kB.pilier = gz(P.defs + P.body);
  const Dd = prefixIds(D.defs, 'd');
  const silD = (P.defs.match(/<clipPath id="psil"><path d="([^"]+)"/) || [])[1];
  const slotSvg = (s) => {
    if (s.kind === 'pilier') return flag && silD ? `<path d="${silD}" fill="#0ff"/>` : P.body;
    if (s.kind === 'dalle') {
      if (!flag) return prefixIds(s.it.ground + s.it.body, 'd');
      const poly = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
      return `<path d="${poly(s.it.info.top)}${poly(s.it.info.side)}" fill="rgb(255,0,${40 + 40 * s.it.k})"/>`;
    }
    return s.ins.svg;
  };
  kB.dalles = gz(Dd + D.items.map((it) => prefixIds(it.ground + it.body, 'd')).join(''));
  // interleave: bodies[j] is the grass rooted between cuts[j-1] and cuts[j]
  const body = [far.body];
  // the same pieces tagged with the depth they stand at (grass: its interval's far edge), for the depth files
  const chunks = [{ z: Infinity, svg: far.body }];
  band.bodies.forEach((b, j) => {
    body.push(b);
    chunks.push({ z: j === 0 ? MID[1] : cuts[j - 1], svg: b });
    if (j < cuts.length) for (const s of slots) if (s.z === cuts[j]) { const t = slotSvg(s); body.push(t); chunks.push({ z: cuts[j], svg: t, kind: s.kind }); }
  });
  const defs = far.defs + band.defs + P.defs + Dd + inserts.map((i) => i.defs || '').join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body.join('')}</svg>`;
  // ids must be unique across the pieces
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dup.length) throw new Error('duplicate ids: ' + [...new Set(dup)].slice(0, 10).join(' '));
  kB.total = gz(svg);
  return { svg, defs, chunks, cuts, stones: D.items.map((it) => it.info), layout: D.layout, mow, kB, ms: performance.now() - t0 };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const here = dirname(fileURLToPath(import.meta.url));
  const out = opt('--out', join(here, 'out', 'sol.svg'));
  const r = sol({ herbe: Number(opt('--herbe', 1)), dalles: Number(opt('--dalles', 7)), pilierSeed: Number(opt('--pilier', 1)), flag: a.includes('--flag') });
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, r.svg);
  writeFileSync(out.replace(/\.svg$/, '.json'), JSON.stringify({ cuts: r.cuts, stones: r.stones, kB: r.kB }));
  console.log(`${out}: ${(r.svg.length / 1024).toFixed(1)} Ko, ${r.kB.total} Ko gzip, ${(r.svg.match(/<path/g) || []).length} chemins, ${r.ms.toFixed(0)} ms`);
  console.log(`  parts (gzip seul) : prairie ${r.kB.prairie}, loin ${r.kB.loin}, pilier ${r.kB.pilier}, dalles ${r.kB.dalles} Ko ; coupes ${r.cuts.map((z) => z.toFixed(2)).join(' ')}`);
}
