// frise_sol.mjs: the flowered meadow of the catalogue frieze (frise.mjs, decor/FRISE.md), one looping strip per depth
// slice, drawn with the very modules of the single-bouquet ground (sol.mjs: herbe.mjs, fleurs.mjs, dalles.mjs).
//
//   node decor/frise_sol.mjs [--only z1,avant] [--flank 0.5] [--bas 1460] [--out <dir>]   (default dir: decor/out/frise/src)
//     writes <id>.svg for each slice of frise.mjs SLICES (screen units, x from stripX0 to stripX0 + w, plus a margin
//     on each side for the tiles), and frise_sol.json (their boxes, weights, counts).
//
// What changes from the single ground:
// - each slice is a strip f x LOOP long, the grass, flowers and far meadow drawn along all of it (herbe.mjs x0/x1,
//   fleurs.mjs setStrip); every place of the loop is drawn at one level of detail (setFlank, default 0.5: the
//   computer sees each pillar at about 0.8 px per unit, the phone at about 1.2);
// - no pillar in the ground: the pillars are sprites of their own (frise_piliers.mjs), laid between the slices
//   "arriere" and "avant"; the ground keeps, round each pillar's foot, its mown collar, the blades standing in its cast
//   shadow and the ring of flowers at its foot, all drawn in that pillar's own head-on frame (frise.mjs);
// - the stepping stones and the trodden walk only lead to the opening pillar (place 0, owner 2026-10-26);
// - the nearest slice goes down to y 1460 (--bas), below the single scene's frame: a phone held upright shows the bouquet
//   in the middle of its screen and the ground down to its bottom edge (owner 2026-10-26);
// - each slice is cut at the bottom where the next nearer slice's first deep-canopy mass covers it whatever the
//   camera does (the camera only travels sideways: what covers a point below that line always covers it).
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { CAM, grassBand, farMeadow, MID, rowZ, rowsIn, RATIO, lawnAt, groundY, setFlank, setBottom, bottom } from './herbe.mjs';
import { stones as dallesStones } from './dalles.mjs';
import { mowField, lawnField, setWalk } from './sol.mjs';
import { drifts, lowField, thinField, plant, setStrip, SPLIT, FAR_THIN, WALK_FLEURI } from './fleurs.mjs';
import { CX, PZ, PLACES, PITCH, SLICES, stripX0 } from './frise.mjs';

const { F, H } = CAM;
const HERE = dirname(fileURLToPath(import.meta.url));
const PR = 0.235, RB = PR * 1.08;
const SHIFT = [0.5 / 1.2, 0.6 / 1.2]; // the cast shadow's run per metre of height (sol.mjs)
const MARGIN = 240; // drawn beyond each end of a strip, so a tile's edge never cuts a missing blade

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
const prefixIds = (s, p) =>
  s.replace(/\bid="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`).replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
const gz = (s) => +(gzipSync(s, { level: 9 }).length / 1024).toFixed(1);

// The pillar nearest a ground point of slice s, and the point in that pillar's own frame: [place (0..PLACES-1), local X]
function nearPillar(s, X, Z) {
  const u = (F * X) / Z; // screen offset from the opening pillar's axis
  const i = Math.round(u / (PITCH * s.f));
  const p = ((i % PLACES) + PLACES) % PLACES;
  return [p, X - (i * PITCH * s.f * Z) / F];
}

// The mown ground's edge on the frieze (owner 2026-10-26: « la séparation entre herbe haute et gazon ras n'est pas assez
// fondue »): the hay grows back over about half a metre instead of 10 cm (seen from the front, 30 cm of depth at the
// pillars is only some 26 units of screen: still a line), from an edge that wanders some 20 cm back and forth (the flowered
// ground's walk, fleurs.mjs WALK_FLEURI, had ret [0.1, 0.03] and edge [0.03, 0.02, 0.012])
const WALK_FRISE = { ...WALK_FLEURI, ret: [0.5, 0.15], edge: [0.08, 0.2, 0.04] };
// The mown collar round a pillar without a walk (mowField of sol.mjs, its pillar part alone): 1 in the hay, 0 mown,
// -1 in the foot
function collar(seed, X, Z) {
  const dP = Math.hypot(X, Z - PZ) - RB;
  if (dP < 0.004) return -1;
  const d = dP - WALK_FRISE.disc;
  const e = WALK_FRISE.edge[0] + WALK_FRISE.edge[1] * fbm(seed * 7 + 1, X / 0.22, Z / 0.22) + WALK_FRISE.edge[2] * vnoise(seed * 7 + 3, X / 0.06, Z / 0.06);
  const w = WALK_FRISE.ret[0] + WALK_FRISE.ret[1] * fbm(seed * 7 + 5, X / 0.4, Z / 0.4);
  const th = Math.atan2(X, PZ - Z);
  const ring = 0.6 * (1 - smooth(0.02, 0.13, dP)) * smooth(-0.2, 0.5, vnoise(seed * 7 + 9, th * 2.2, 0.5));
  return Math.max(smooth(e, e + w, d), ring);
}
// blades standing in a pillar's cast shadow (sol.mjs shade), in its own frame
function inShadow(X, Z) {
  if (Z >= PZ || Z < PZ - RB - 0.02) return false;
  const t = clamp((X * SHIFT[0] + (Z - PZ) * SHIFT[1]) / (0.8 * (SHIFT[0] ** 2 + SHIFT[1] ** 2)), 0, 1);
  return Math.hypot(X - t * 0.8 * SHIFT[0], Z - PZ - t * 0.8 * SHIFT[1]) < PR * 1.02 && X > 0;
}

// One slice: { id, svg, box: [x0, y0, x1, y1], kB, counts }
export function slice(s, { seed = 1, dalles = 7 } = {}) {
  const t0 = performance.now();
  const x0 = stripX0(s), xr = [x0 - MARGIN, x0 + s.w + MARGIN];
  const [zMin, zMax] = s.z;
  // the opening pillar's walk and stones, as the flowered ground has them
  setWalk(WALK_FRISE);
  const Dd = dallesStones(dalles, { lawn: true, lawnH: 0.06 });
  const mowOpen = mowField(1, Dd.layout, Dd.stones);
  const lawnOpen = lawnField(1, Dd.stones, Dd.layout);
  const mow = (X, Z) => {
    const [p, Xl] = nearPillar(s, X, Z);
    return p === 0 ? mowOpen(Xl, Z) : collar(1, Xl, Z);
  };
  const lawn = (X, Z) => {
    const [p, Xl] = nearPillar(s, X, Z);
    return p === 0 ? lawnOpen(Xl, Z) : lawnAt(X, Z, 1);
  };
  const shade = (X, Z) => inShadow(nearPillar(s, X, Z)[1], Z);
  // the flowers: the drifts of the whole strip, each pillar's ring of flowers moved to its own foot
  setStrip(xr);
  const D0 = drifts(seed, mow, SPLIT);
  const ring = D0.filter((d) => d.pilier);
  const D = D0.slice();
  for (let i = 1; i < PLACES; i++)
    for (const [k, d] of ring.entries()) {
      // the same ring, its own colours drawn again for each pillar (a seed of its own), shifted to its foot
      const X = d.X + (i * PITCH * s.f * d.Z) / F;
      D.push({ ...d, X, seed: (d.seed + 7919 * i + 104729 * k) % 1e6 });
    }
  // and the same ring on the far side of the strip's seam (place PLACES = place 0 again)
  const inStrip = (d) => { const x = CX + (F * d.X) / d.Z; return x > xr[0] - 200 && x < xr[1] + 200; };
  const Dk = D.filter((d) => d.Z + d.rz >= zMin - 0.3 && d.Z - d.rz < zMax + 0.3 && (!d.pilier || inStrip(d)));
  const low = lowField(Dk), thin = thinField(Dk);
  const stats = {};
  const planted = plant(seed, { okAt: mow, low, D: Dk, split: SPLIT, stats });
  // (the engine drawings shared by the flowers ride on the first insert, whatever its depth)
  const fdefs = (planted.find((i) => i.defs) || {}).defs || '';
  const ins = planted.filter((i) => i.z >= zMin && i.z < zMax);
  setStrip(null);
  // the objects of the slice by depth: the flowers and the stones of the walk
  const slots = [];
  for (const it of Dd.items) if (it.zmax >= zMin && it.zmax < zMax) slots.push({ z: it.zmax, zmin: it.zmin - 0.01, svg: prefixIds(it.ground + it.body, 'd'), defs: true });
  ins.forEach((i, n) => slots.push({ z: i.z, zmin: i.z, svg: i.svg, n }));
  slots.sort((a, b) => b.z - a.z || (a.n ?? 0) - (b.n ?? 0));
  const cuts = [...new Set(slots.map((q) => q.z))].sort((a, b) => b - a);
  const body = [];
  let defs = '';
  const counts = { fleurs: stats, dalles: slots.filter((q) => q.defs).length };
  if (zMax === Infinity) {
    // the far meadow (z4: plages and the finest blades), its far drifts' dots laid over it
    const far = farMeadow(seed, { x0: xr[0], x1: xr[1], thin: () => FAR_THIN });
    const m = far.match(/^<svg[^>]*>\s*<defs>([\s\S]*?)<\/defs>([\s\S]*)<\/svg>\s*$/);
    defs += m[1];
    body.push(m[2]);
    for (const q of slots) body.push(q.svg);
  } else {
    // the grass of the slice, cut at each object's depth (sol.mjs): masses at the slice's far row and every 4th row
    const ks = rowsIn(Math.max(zMin, MID[0]), Math.min(zMax, MID[1]));
    const kFar = ks[ks.length - 1];
    const mass = (k) => {
      if (!(k === kFar || k % 4 === 0)) return false;
      const over = slots.filter((q) => rowZ(k) < q.z && rowZ(k) * RATIO > q.zmin);
      return { at: Math.max(0, ...over.map((q) => q.z + 1e-4)) };
    };
    const band = grassBand(Math.max(zMin, MID[0]), Math.min(zMax, MID[1]), { seed: 1, prefix: `${s.id}_`, x0: xr[0], x1: xr[1], mow, lawn, shade, cuts, mass, low, thin });
    defs += band.defs;
    band.bodies.forEach((b, j) => {
      body.push(b);
      if (j < cuts.length) for (const q of slots) if (q.z === cuts[j]) body.push(q.svg);
    });
  }
  if (slots.some((q) => q.defs)) defs += prefixIds(Dd.defs, 'd');
  if (ins.length) defs += fdefs;
  // the bottom: the next nearer slice's first mass covers everything below the ground line of its farthest row
  const next = SLICES[SLICES.indexOf(s) + 1];
  const y1 = next ? Math.min(H, Math.ceil(groundY(next.z[1] / RATIO) + 2)) : bottom();
  const box = [xr[0], 0, xr[1], y1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box[0]} 0 ${box[2] - box[0]} ${y1}" width="${box[2] - box[0]}" height="${y1}"><defs>${defs}</defs>${body.join('')}</svg>`;
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set(), dup = new Set();
  for (const v of ids) (seen.has(v) ? dup : seen).add(v);
  if (dup.size) throw new Error(`${s.id}: ids en double : ${[...dup].slice(0, 8).join(' ')}`);
  return { id: s.id, svg, box, counts, ms: Math.round(performance.now() - t0) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const out = opt('--out', join(HERE, 'out', 'frise', 'src'));
  const only = opt('--only', null);
  setFlank(Number(opt('--flank', 0.5)));
  // the nearest slice goes down to y 1460 (owner 2026-10-26: a phone shows the bouquet centred, the ground to its bottom)
  setBottom(Number(opt('--bas', 1460)));
  mkdirSync(out, { recursive: true });
  const info = {};
  for (const s of SLICES) {
    if (only && !only.split(',').includes(s.id)) continue;
    const r = slice(s);
    writeFileSync(join(out, `${s.id}.svg`), r.svg);
    info[s.id] = { box: r.box, f: s.f, w: s.w, x0: stripX0(s), Ko: Math.round(r.svg.length / 1024), gzipKo: gz(r.svg), ms: r.ms, fleurs: r.counts.fleurs.kB, dalles: r.counts.dalles };
    console.log(`${s.id}: ${s.w} u, ${info[s.id].Ko} Ko, ${info[s.id].gzipKo} Ko gzip, ${r.ms} ms, bas y ${r.box[3]}`);
  }
  writeFileSync(join(out, 'frise_sol.json'), JSON.stringify(info, null, 1));
}
