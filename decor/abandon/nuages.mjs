// ABANDONED 2026-10-15 (owner: no near cumulus; light veils instead, see ../voiles.mjs). Kept for the record only:
// do not run it, it would rewrite the "nuages" key of scene.json (in abandon/out/).
// nuages.mjs: fair-weather cumulus of the shop scene (layers z1 and z2). Each cloud is its own SVG file, shown by an
// <img> that only slides (CSS translateX): nothing moves inside, no animated opacity or filter.
//
//   node decor/nuages.mjs            -> decor/out/nuage-a1.svg ... nuage-c1.svg ..., and the "nuages" key of scene.json
//
// Measures: decor/refs/nuages.md and the 1600 px pairs (decor/etat-d1.md). Sun high, left and a little behind the
// viewer (SUN of ciel.mjs): lit tops look up-left, the cloud's own shade sits low, in the middle and on the right.
//
// Geometry: a cauliflower of lobes in three generations (masses, bumps, fine bumps; log-normal sizes, bumps in
// clusters so the outline is never a string of equal beads), torn ends (detached shreds and filaments), a flat base
// with steps and hanging scraps. A tower is a leaning stack of turrets narrower than the body, each tier lumpy.
// Light, computed from SUN at two scales:
// - bulk: the silhouette is inflated into a volume (half-thickness from its distance transform, the base kept thick);
//   each point of the face gets sky light (by its normal) plus sunlight through the cloud (Beer-Lambert along SUN
//   from a point under the face, wrapped Lambert). That field is drawn as nested shade regions (iso-bands) under one
//   blur: smooth, no round stains, dark where the way to the sun is long.
// - lobes: each lobe is a sphere in wrapped Lambert (radial gradient fitted by least squares), opaque and crisp on its
//   upper side, fading out on its lower side; painted higher first, so every lit cap cuts sharply over the shaded
//   underside of the lobe behind it: thin dark creases between bright caps.
// SVG native only: paths, gradients, masks, feGaussianBlur. No turbulence, no displacement, no image.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rng, clamp, mix, num, rgb, W, H, HORIZON, SUN } from '../ciel.mjs';

const TAU = Math.PI * 2;
const U = (R, a, b) => a + (b - a) * R();
const gauss = (R) => Math.sqrt(-2 * Math.log(Math.max(1e-9, R()))) * Math.cos(TAU * R());
const lognorm = (R, m, s) => m * Math.exp(s * gauss(R));
const lumOf = (h) => {
  const [r, g, b] = rgb(h);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// ---------- palettes by distance d (height of the base above the horizon / visible sky height) ----------
// High clouds: lit tops #f0f5f6-#f6f9fb (never pure white), flank #bec6ce, base #9ca8b6, deepest core #708290 (photo 38,
// hue 206, S .22). Towards the horizon: cloud brightness -20 % while the sky brightens +28 %, contrast / 6, grey-lavender
// band at the very bottom (#aaaeb4 on photo 1). `shade` is the colour of the bulk shade regions (laid over the lobes).
const PAL = [
  { d: 0.0, top: '#d2d6de', lit: '#cbd0d9', flank: '#bec4ce', base: '#b2b8c3', core: '#a8aebb', shade: '#9aa1b0' },
  { d: 0.08, top: '#e2e6ec', lit: '#d6dbe3', flank: '#c0c6d0', base: '#a9b1be', core: '#96a0af', shade: '#7f8a9d' },
  { d: 0.25, top: '#edf0f4', lit: '#e0e5eb', flank: '#c1c8d1', base: '#a1acb9', core: '#8593a3', shade: '#64768b' },
  { d: 0.5, top: '#f2f4f7', lit: '#e4e8ed', flank: '#bfc7d0', base: '#97a4b3', core: '#748699', shade: '#4f647b' },
  { d: 1.0, top: '#f4f6f8', lit: '#e6eaee', flank: '#bdc5ce', base: '#93a1b1', core: '#6c7f93', shade: '#475d75' },
];
export function palette(d) {
  d = clamp(d);
  let i = 0;
  while (i < PAL.length - 2 && d > PAL[i + 1].d) i++;
  const a = PAL[i];
  const b = PAL[i + 1];
  const t = clamp((d - a.d) / (b.d - a.d));
  const o = {};
  for (const k of Object.keys(a)) if (k !== 'd') o[k] = mix(a[k], b[k], t);
  return o;
}
// value v in [0, 1] -> colour: 0 core, .3 base, .55 flank, .8 lit, 1 top
const RAMP = [
  [0, 'core'],
  [0.3, 'base'],
  [0.55, 'flank'],
  [0.8, 'lit'],
  [1, 'top'],
];
const ramp = (P, v) => {
  v = clamp(v);
  let i = 0;
  while (i < RAMP.length - 2 && v > RAMP[i + 1][0]) i++;
  const [a, ka] = RAMP[i];
  const [b, kb] = RAMP[i + 1];
  return mix(P[ka], P[kb], (v - a) / (b - a));
};

// ---------- grids: distance transform, iso-lines ----------
// 1-D squared distance transform (Felzenszwalb & Huttenlocher) of f into d.
function dt1(f, n, v, z, d) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}
// Euclidean distance (in cells) of every inside cell to the nearest outside cell.
function edt(inside, nx, ny) {
  const m = Math.max(nx, ny);
  const f = new Float64Array(m);
  const d = new Float64Array(m);
  const v = new Int32Array(m);
  const z = new Float64Array(m + 1);
  const g = new Float64Array(nx * ny);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) f[j] = inside[j * nx + i] ? 1e12 : 0;
    dt1(f, ny, v, z, d);
    for (let j = 0; j < ny; j++) g[j * nx + i] = d[j];
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) f[i] = g[j * nx + i];
    dt1(f, nx, v, z, d);
    for (let i = 0; i < nx; i++) g[j * nx + i] = Math.sqrt(d[i]);
  }
  return g;
}
// Box blur of radius r (cells), separable, in place on a copy; three passes approach a Gaussian of sigma ~ r.
function smooth2(F, nx, ny, r) {
  let a = Float32Array.from(F);
  const b = new Float32Array(a.length);
  r = Math.max(1, Math.round(r));
  for (let pass = 0; pass < 3; pass++) {
    for (let j = 0; j < ny; j++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += a[j * nx + clamp(i, 0, nx - 1)];
      for (let i = 0; i < nx; i++) {
        b[j * nx + i] = s / (2 * r + 1);
        s += a[j * nx + Math.min(nx - 1, i + r + 1)] - a[j * nx + Math.max(0, i - r)];
      }
    }
    for (let i = 0; i < nx; i++) {
      let s = 0;
      for (let j = -r; j <= r; j++) s += b[clamp(j, 0, ny - 1) * nx + i];
      for (let j = 0; j < ny; j++) {
        a[j * nx + i] = s / (2 * r + 1);
        s += b[Math.min(ny - 1, j + r + 1) * nx + i] - b[Math.max(0, j - r) * nx + i];
      }
    }
  }
  return a;
}
// Closed outlines of {F >= t} (marching squares, saddles split), in cell coordinates. The border must be below t.
function isoLoops(F, nx, ny, t) {
  const pt = new Map();
  const P = (i, j, dir) => {
    const k = ((j * (nx + 1) + i) << 1) | dir;
    if (!pt.has(k)) {
      const a = F[j * nx + i];
      const b = dir ? F[(j + 1) * nx + i] : F[j * nx + i + 1];
      const s = clamp((t - a) / (b - a || 1e-9));
      pt.set(k, dir ? [i, j + s] : [i + s, j]);
    }
    return k;
  };
  const segs = [];
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const c =
        (F[j * nx + i] >= t ? 8 : 0) | (F[j * nx + i + 1] >= t ? 4 : 0) | (F[(j + 1) * nx + i + 1] >= t ? 2 : 0) | (F[(j + 1) * nx + i] >= t ? 1 : 0);
      if (c === 0 || c === 15) continue;
      const T = () => P(i, j, 0);
      const B = () => P(i, j + 1, 0);
      const Lf = () => P(i, j, 1);
      const Rt = () => P(i + 1, j, 1);
      if (c === 1 || c === 14) segs.push([Lf(), B()]);
      else if (c === 2 || c === 13) segs.push([B(), Rt()]);
      else if (c === 3 || c === 12) segs.push([Lf(), Rt()]);
      else if (c === 4 || c === 11) segs.push([T(), Rt()]);
      else if (c === 6 || c === 9) segs.push([T(), B()]);
      else if (c === 7 || c === 8) segs.push([Lf(), T()]);
      else if (c === 5) segs.push([T(), Rt()], [Lf(), B()]);
      else segs.push([Lf(), T()], [B(), Rt()]);
    }
  }
  const adj = new Map();
  segs.forEach(([a, b], s) => {
    for (const k of [a, b]) {
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k).push(s);
    }
  });
  const used = new Uint8Array(segs.length);
  const loops = [];
  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    used[s0] = 1;
    const start = segs[s0][0];
    const loop = [start];
    let cur = segs[s0][1];
    while (cur !== start) {
      loop.push(cur);
      const nx2 = adj.get(cur).find((s) => !used[s]);
      if (nx2 === undefined) break;
      used[nx2] = 1;
      cur = segs[nx2][0] === cur ? segs[nx2][1] : segs[nx2][0];
    }
    loops.push(loop.map((k) => pt.get(k)));
  }
  return loops;
}
// Douglas-Peucker on an open polyline.
function dp(pts, eps) {
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const l = Math.hypot(dx, dy) || 1e-9;
    let m = -1;
    let md = eps;
    for (let i = a + 1; i < b; i++) {
      const dd = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / l;
      if (dd > md) {
        md = dd;
        m = i;
      }
    }
    if (m > 0) {
      keep[m] = 1;
      st.push([a, m], [m, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}
function simplifyLoop(loop, eps) {
  if (loop.length < 6) return loop;
  let far = 0;
  let fd = -1;
  for (let i = 1; i < loop.length; i++) {
    const d = (loop[i][0] - loop[0][0]) ** 2 + (loop[i][1] - loop[0][1]) ** 2;
    if (d > fd) {
      fd = d;
      far = i;
    }
  }
  const a = dp(loop.slice(0, far + 1), eps);
  const b = dp([...loop.slice(far), loop[0]], eps);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}
const area2 = (pts) => pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0);
// Path data of loops (world coordinates), relative moves on a 1/q grid without drift.
function loopsPath(loops, q = 1) {
  const r = (v) => Math.round(v * q);
  const f = (v) => num(v / q);
  let s = '';
  for (const lp of loops) {
    let [px, py] = [r(lp[0][0]), r(lp[0][1])];
    s += `M${f(px)} ${f(py)}`;
    let first = true;
    for (let i = 1; i < lp.length; i++) {
      const x = r(lp[i][0]);
      const y = r(lp[i][1]);
      if (x === px && y === py) continue;
      s += (first ? 'l' : ' ') + `${f(x - px)} ${f(y - py)}`;
      first = false;
      px = x;
      py = y;
    }
    s += 'z';
  }
  return s.replace(/ -/g, '-');
}

// ---------- geometry ----------
// A lobe: { x, y, rx, ry, g } with g the generation (0 mass, 1 bump, 2 fine bump); local frame: x from 0 to L, base
// line at y = hc, tops at hc - env(x / L).
const L0 = (x, y, r, flat, g) => ({ x, y, rx: r, ry: r * flat, g });
const inside = (lobes, x, y, m = 1) => lobes.some((l) => ((x - l.x) / (l.rx * m)) ** 2 + ((y - l.y) / (l.ry * m)) ** 2 < 1);

// Height profile of a cloudlet: a main dome and secondary domes, dying out towards both ends.
function envelope(R, o) {
  const { hc } = o;
  // a main dome, secondary domes of comparable height (a massif, not a bun), a lower shoulder on one side
  const domes = [{ c: o.up ?? U(R, 0.36, 0.62), w: o.w ?? U(R, 0.32, 0.46), a: 1, p: o.p ?? U(R, 0.45, 0.9) }];
  const nSec = o.nSec ?? Math.round(U(R, 2, 4.4));
  for (let i = 0; i < nSec; i++) domes.push({ c: U(R, 0.1, 0.9), w: U(R, 0.14, 0.3), a: U(R, 0.5, 0.92), p: U(R, 0.5, 1.1) });
  if (o.nSec == null) domes.push({ c: R() < 0.5 ? U(R, 0.1, 0.25) : U(R, 0.75, 0.9), w: U(R, 0.2, 0.3), a: U(R, 0.4, 0.6), p: 0.4 });
  const shoulder = o.eMin ?? U(R, 0.18, 0.3);
  return (u) => {
    u = clamp(u);
    let e = 0;
    for (const d of domes) {
      const q = (u - d.c) / d.w;
      if (Math.abs(q) < 1) e = Math.max(e, d.a * (1 - q * q) ** d.p);
    }
    return hc * Math.max(e * Math.sqrt(clamp(1 - (2 * u - 1) ** 4)), shoulder * Math.sqrt(clamp(1 - (2 * u - 1) ** 6)));
  };
}

// A turret of a tower (photo 107): a leaning stack of tiers narrower than the body, each tier two or three lobes side
// by side (lumpy sides), a slight neck, a head a little wider. t: { u, w (fraction of L), h (top above the base), lean }.
function turret(R, t, top, L, hc) {
  const out = [];
  const W0 = t.w * L;
  const x0 = t.u * L;
  const y0 = top(x0) + 0.3 * hc;
  const yTop = hc - t.h;
  const n = Math.max(3, Math.round((y0 - yTop) / (W0 * U(R, 0.34, 0.42))));
  for (let k = 0; k < n; k++) {
    const f = k / (n - 1); // 0 root .. 1 head
    const wk = W0 * (f < 0.72 ? 1 - 0.24 * (f / 0.72) + gauss(R) * 0.05 : U(R, 0.86, 0.98));
    const m = wk > 0.18 * L ? 3 : 2;
    const r = (wk / (m + 0.5)) * 1.08;
    const cx = x0 + (t.lean ?? 0) * (y0 - (y0 + (yTop - y0) * f)) + gauss(R) * 0.04 * W0;
    const cy = f < 1 ? y0 + (yTop + r - y0) * f + gauss(R) * 0.08 * r : yTop + r;
    for (let i = 0; i < m; i++) {
      const ri = r * U(R, 0.85, 1.12);
      const yi = k === n - 1 ? Math.max(yTop + ri, cy + (i === (m - 1) / 2 ? -0.1 : 0.12) * r) : cy + gauss(R) * 0.1 * r;
      out.push({ ...L0(cx + ((i - (m - 1) / 2) * (wk - 2 * r)) / Math.max(1, m - 1) + gauss(R) * 0.05 * r, yi, ri, 1, 0), tall: true });
    }
  }
  return out;
}

// One cloudlet. Returns { lobes (paint order), shreds, fils, hang, base(x), env, hc, L, hTop, xMin, xMax }.
// o: L, hc, flat (rows), big (mass size / L), nb (bumps per mass), towers, ends (0..1, how torn the ends are).
function cauli(R, o) {
  const { L, hc } = o;
  const flat = o.flat ?? 1;
  const env = envelope(R, o);
  const top = (x) => hc - env(x / L);
  const big = o.big ?? 0.065;
  // the base: flat on the whole, stepped where two cells meet, sagging here and there; tongues of longer fade
  const steps = [];
  for (let k = 0, n = Math.round(U(R, 0.6, 2.6)); k < n; k++) steps.push({ x: U(R, 0.15, 0.85) * L, dy: (R() < 0.5 ? -1 : 1) * U(R, 0.02, 0.06) * hc });
  const sags = [];
  for (let k = 0, n = Math.round(U(R, 1.5, 4.4)); k < n; k++) sags.push({ c: U(R, 0.08, 0.92) * L, w: U(R, 0.06, 0.16) * L, a: U(R, -0.03, 0.08) * hc });
  const base = (x) =>
    hc + steps.reduce((s, st) => s + st.dy * clamp((x - st.x) / (0.05 * L) + 0.5), 0) + sags.reduce((s, g) => s + g.a * Math.exp(-(((x - g.c) / g.w) ** 2)), 0);
  const tongues = [];
  for (let k = 0, n = Math.round(U(R, 2, 5.4)); k < n; k++) tongues.push({ x: U(R, 0.08, 0.92) * L, w: L * U(R, 0.04, 0.14), d: hc * U(R, 0.03, 0.12) });
  const hang = [];
  for (let k = 0, n = Math.round(U(R, 0.5, 3.4)); k < n; k++) {
    const x = U(R, 0.12, 0.88) * L;
    hang.push({ x, y: base(x) + U(R, -0.03, 0.01) * hc, rx: L * U(R, 0.04, 0.1), ry: hc * U(R, 0.02, 0.045), op: U(R, 0.2, 0.4) });
  }
  const masses = [];
  // outline course: masses along the envelope, three sizes mixed
  for (let x = U(R, 0.01, 0.05) * L; x < 0.98 * L; ) {
    const e = env(x / L);
    let r = clamp(lognorm(R, big, 0.4), 0.022, 0.12) * L;
    if (R() < 0.25) r *= 0.6;
    r = Math.min(r, (0.6 * e) / flat);
    if (r > 0.018 * L) masses.push(L0(x, top(x) + r * flat * U(R, 0.85, 1.1), r, flat, 0));
    x += Math.max(r, 0.025 * L) * U(R, 0.75, 1.4);
  }
  // face courses: masses lower down and in front (their caps make the creases across the face)
  const nIn = o.nIn ?? Math.round((1.3 * L * hc * 0.5) / (Math.PI * (big * L) ** 2 * flat));
  for (let k = 0, tries = 0; k < nIn && tries < 600; tries++) {
    const x = U(R, 0.06, 0.94) * L;
    const e = env(x / L);
    const r = Math.min(clamp(lognorm(R, big * 1.1, 0.3), 0.035, 0.16) * L, (0.5 * e) / flat);
    if (r < 0.02 * L) continue;
    const y = U(R, top(x) + r * flat, hc - 0.3 * r * flat);
    if (y > top(x) + 0.9 * r * flat && masses.every((m) => Math.hypot(m.x - x, (m.y - y) / flat) > 0.55 * (m.rx + r))) {
      masses.push(L0(x, y, r, flat, 0));
      k++;
    }
  }
  // base course: wide lobes whose lower half is cut by the base
  for (let x = 0.03 * L; x < 0.97 * L; ) {
    const e = env(x / L);
    const r = Math.min(clamp((0.5 * e) / flat, 0.03 * L, 0.15 * L) * U(R, 0.8, 1.1), 0.5 * Math.min(x, L - x) + 0.02 * L);
    masses.push({ ...L0(x, base(x) - r * flat * U(R, 0.55, 0.8), r, flat, 0), base: true });
    x += r * U(R, 0.65, 1.0);
  }
  for (const t of o.towers || []) masses.push(...turret(R, t, top, L, hc));
  // fill the volume: any point under the envelope not yet inside a mass gets one
  const step = Math.max(0.045 * L, 0.2 * hc, 6);
  for (let x = 0.07 * L; x < 0.93 * L; x += step) {
    for (let y = top(x) + 0.15 * env(x / L); y < hc - 0.1 * hc; y += step * flat) {
      if (inside(masses, x, y, 0.92)) continue;
      const r = Math.min(clamp(Math.min((y - top(x)) / flat, 0.1 * L), Math.max(0.04 * L, 0.3 * hc), 0.1 * L), 0.8 * Math.min(x, L - x));
      masses.push(L0(x + (R() - 0.5) * step * 0.4, y + 0.15 * r * flat, r, flat, 0));
    }
  }
  // bumps on a lobe p: n children around directions drawn by dir(), size sz of the parent (log-normal)
  const kids = (p, n, sz, g, dir) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = dir();
      const r = p.rx * clamp(lognorm(R, sz, 0.35), sz * 0.45, sz * 1.8);
      const k = r * U(R, 0.3, 0.7);
      const kid = L0(p.x + Math.cos(a) * (p.rx - k), p.y + Math.sin(a) * (p.ry - k * flat), r, flat, g);
      kid.ry *= U(R, 0.78, 1.0);
      kid.a = a;
      out.push(kid);
    }
    return out;
  };
  // where a mass grows its bumps: up and a little towards the sun; ends and towers also on their outer sides
  const dirOf = (p) => {
    const u = p.x / L;
    if (p.tall) return () => (R() < 0.5 ? -Math.PI + 0.3 : -0.3) + gauss(R) * 0.45 + (R() < 0.35 ? (R() < 0.5 ? 0.9 : -0.9) : 0);
    if (u < 0.15) return () => clamp(-Math.PI / 2 - 0.6 + gauss(R) * 0.7, -Math.PI - 0.45, -0.1);
    if (u > 0.85) return () => clamp(-Math.PI / 2 + 0.6 + gauss(R) * 0.7, -Math.PI + 0.1, 0.45);
    return () => clamp(-Math.PI / 2 - 0.25 + gauss(R) * 0.65, -Math.PI + 0.1, -0.1);
  };
  masses.sort((u, v) => u.y - u.ry - (v.y - v.ry));
  const units = masses.map((m) => {
    const end = m.x < 0.15 * L || m.x > 0.85 * L;
    const high = m.y - m.ry < hc - 0.55 * env(m.x / L);
    const n = m.base ? (end ? Math.round(U(R, 0.5, 2.5)) : 0) : Math.round(clamp(lognorm(R, (o.nb ?? 3) * (high || m.tall ? 1 : 0.5), 0.45), 0, 6));
    const bs = m.rx < (o.rMin ?? 2.5) / 0.3 ? [] : kids(m, n, 0.4, 1, dirOf(m)).sort((u, v) => u.y - v.y);
    // a few fine bumps straight on a mass that has few bumps (breaks its arc)
    if (n < 2 && !m.base && R() < 0.5) bs.push(...kids(m, Math.round(U(R, 2, 4)), 0.2, 2, dirOf(m)));
    return [m, ...bs];
  });
  // fine bumps in clusters, on about half of the bumps (the others keep a smooth arc)
  const all0 = units.flat();
  const onEdge = (l) => {
    for (let k = 0; k < 9; k++) {
      const a = -Math.PI * (0.06 + (0.88 * k) / 8);
      if (!inside(all0, l.x + Math.cos(a) * l.rx * 1.02, l.y + Math.sin(a) * l.ry * 1.02)) return true;
    }
    return false;
  };
  for (const unit of units) {
    for (let i = unit.length - 1; i > 0; i--) {
      const b = unit[i];
      if (b.g !== 1 || b.rx * 0.36 < (o.rMin ?? 2.5)) continue;
      const edge = onEdge(b);
      const high = b.y < hc - 0.6 * env(b.x / L);
      if (R() > (edge ? 0.7 : high ? 0.3 : 0)) continue;
      const a0 = (b.a ?? -Math.PI / 2) + gauss(R) * 0.5;
      const fine = kids(b, Math.round(U(R, 2, 5.4)), 0.36, 2, () => a0 + gauss(R) * 0.45);
      unit.splice(i + 1, 0, ...fine.sort((u, v) => u.y - v.y));
    }
  }
  // grain: small lumps on the lit upper faces (the cottony texture of photo 38 at 1:1)
  const rf = o.fuzz ?? 0.0055;
  if (rf > 0) {
    for (const unit of units) {
      for (let i = unit.length - 1; i >= 0; i--) {
        const p = unit[i];
        if (p.g > 1 || p.base || p.rx < 5 * rf * L || p.y - p.ry > hc - 0.42 * env(p.x / L)) continue;
        const n = Math.round(U(R, 0, (p.rx / (rf * L)) * 0.35));
        const gr = [];
        for (let k = 0; k < n; k++) {
          const a = -Math.PI * U(R, 0.25, 0.95);
          const q = U(R, 0.3, 0.85);
          const r = clamp(lognorm(R, rf * 1.5, 0.4), rf * 0.6, rf * 4) * L;
          gr.push(L0(p.x + Math.cos(a) * q * p.rx, p.y + Math.sin(a) * q * p.ry, r, flat * U(R, 0.75, 1), 3));
        }
        unit.splice(i + 1, 0, ...gr.sort((u, v) => u.y - v.y));
      }
    }
  }
  const lobes = units.flat();
  // fuzz: the fine scallops of the outline (photo 38 at 1:1: bumps of 0.4 to 1.3 % of the width along the top), in
  // runs along the exposed upper rims; painted over the body's outline
  const fuzz = [];
  if (rf > 0) {
    for (const l of lobes) {
      if (l.rx < 3 * rf * L || l.base || l.x > 0.88 * L) continue;
      const n = Math.max(5, Math.round(((Math.PI - 0.5) * l.rx) / (1.8 * rf * L)));
      let on = R() < 0.6;
      let run = Math.round(U(R, 1, 5));
      for (let k = 0; k <= n; k++) {
        if (--run <= 0) {
          on = !on;
          run = Math.round(on ? U(R, 2, 8) : U(R, 1, 4));
        }
        if (!on) continue;
        const a = -Math.PI + 0.25 + ((Math.PI - 0.5) * k) / n + gauss(R) * 0.04;
        const px = l.x + Math.cos(a) * l.rx;
        const py = l.y + Math.sin(a) * l.ry;
        if (py > base(px) - 0.15 * hc) continue;
        if (lobes.some((m) => m !== l && ((px - m.x) / m.rx) ** 2 + ((py - m.y) / m.ry) ** 2 < 0.97)) continue;
        const r = clamp(lognorm(R, rf, 0.45), rf * 0.4, rf * 3) * L;
        const k2 = r * U(R, 0.45, 0.85);
        fuzz.push(L0(px - Math.cos(a) * k2, py - Math.sin(a) * k2 * flat, r, flat * U(R, 0.75, 1), 3));
      }
    }
  }
  // torn ends: detached shreds (translucent puffs, smaller outwards) and filaments pulled by the wind
  const shreds = [];
  const fils = [];
  const ends = o.ends ?? 1;
  const xs0 = lobes.map((l) => [l.x - l.rx, l.x + l.rx]).flat();
  const xl = Math.min(...xs0);
  const xr = Math.max(...xs0);
  for (const side of [-1, 1]) {
    const n = Math.round(ends * U(R, side > 0 ? 4 : 2, side > 0 ? 8 : 5));
    // the extreme lobe of that end (not a base lobe): the shreds come off its upper half
    let ex = null;
    for (const l of lobes) if (!l.base && l.g < 3 && (!ex || side * (l.x + side * l.rx) > side * (ex.x + side * ex.rx))) ex = l;
    let y = ex ? ex.y - U(R, 0.05, 0.45) * ex.ry : hc - 0.4 * hc;
    let x = ex ? ex.x + side * ex.rx * U(R, 0.35, 0.6) : side > 0 ? xr : xl;
    const x00 = x;
    for (let k = 0; k < n; k++) {
      const f = k / Math.max(1, n - 1);
      const r = L * (k ? U(R, 0.014, 0.034) : U(R, 0.03, 0.045)) * (1 - 0.5 * f) * (o.shredScale ?? 1);
      x += side * r * U(R, 0.55, 1.15);
      y += gauss(R) * 0.06 * hc - U(R, 0, 0.04) * hc;
      const s0 = L0(x, y, r, flat * U(R, 0.6, 0.85), 2);
      shreds.push({ ...s0, side, op: clamp(U(R, 0.7, 0.95) - 0.55 * f, 0.22, 0.95) });
      if (R() < 0.45) shreds.push({ ...L0(x + side * r * 0.5, y - r * U(R, 0.3, 0.8), r * U(R, 0.35, 0.6), flat, 2), side, op: clamp(0.85 - 0.55 * f, 0.2, 0.9) });
    }
    // the veil that binds the shreds: thin cloud, translucent
    if (n) shreds.veils = [...(shreds.veils || []), { x: (x00 + x) / 2, y: y + 0.02 * hc, rx: Math.abs(x - x00) / 2 + 0.03 * L, ry: 0.08 * hc, op: 0.2 }];
    const nf = Math.round(ends * U(R, 0.5, 3.4));
    for (let k = 0; k < nf; k++) {
      const len = L * U(R, 0.05, 0.13);
      const x1 = x - side * U(R, 0.02, 0.08) * L;
      fils.push({ x: x1, y: y - U(R, -0.08, 0.15) * hc, len, th: L * U(R, 0.005, 0.011), dir: side, rise: U(R, -0.04, 0.16), bend: U(R, -0.25, 0.25), op: U(R, 0.3, 0.55) });
    }
  }
  const hTop = Math.max(...lobes.map((l) => hc - (l.y - l.ry)));
  const xs = [...lobes, ...shreds].map((l) => [l.x - l.rx, l.x + l.rx]).flat();
  for (const f of fils) xs.push(f.x + f.dir * f.len * 1.05);
  return { lobes, fuzz, shreds, fils, hang, steps, tongues, base, env, hc, L, flat, hTop, xMin: Math.min(...xs), xMax: Math.max(...xs) };
}

// ---------- light at the scale of a lobe ----------
// A lobe is a sphere lit by SUN in wrapped Lambert, b = (n.SUN + WRAP) / (1 + WRAP) (a cloud scatters many times, so
// the wrap is wider than for the shop's solid materials, .4 in v1a.js). Its radial gradient (objectBoundingBox) has its
// end circle GC shifted down and wider than the lobe: the opacity, a function of t, then stays 1 over the upper part of
// the lobe (crisp cap against what lies behind) and fades out over its lower part (into the shade below it). The focus
// is fitted by least squares to the Lambert field, the colour profile b(t) is the mean of each band of t.
const WRAP = 0.6;
const GC = { cx: 0.5, cy: 0.4, r: 0.63 };
const tOf = (fx, fy, x, y) => {
  const dx = x - fx;
  const dy = y - fy;
  const l = Math.hypot(dx, dy);
  if (l < 1e-9) return 0;
  const ux = dx / l;
  const uy = dy / l;
  const b = ux * (fx - GC.cx) + uy * (fy - GC.cy);
  const c = (fx - GC.cx) ** 2 + (fy - GC.cy) ** 2 - GC.r * GC.r;
  return l / (-b + Math.sqrt(b * b - c));
};
const OP = [
  [0.62, 1],
  [0.74, 0.7],
  [0.84, 0.25],
  [0.92, 0],
];
const opAt = (t) => {
  if (t <= OP[0][0]) return 1;
  for (let i = 1; i < OP.length; i++) if (t <= OP[i][0]) return OP[i - 1][1] + ((OP[i][1] - OP[i - 1][1]) * (t - OP[i - 1][0])) / (OP[i][0] - OP[i - 1][0]);
  return 0;
};
const LOBE = (() => {
  const S = SUN;
  const samples = [];
  for (let j = -24; j <= 24; j++) {
    for (let i = -24; i <= 24; i++) {
      const px = i / 24;
      const py = j / 24;
      const r2 = px * px + py * py;
      if (r2 >= 1) continue;
      const n = [px, -py, Math.sqrt(1 - r2)];
      samples.push([0.5 + 0.5 * px, 0.5 + 0.5 * py, clamp((n[0] * S[0] + n[1] * S[1] + n[2] * S[2] + WRAP) / (1 + WRAP))]);
    }
  }
  const NB = 24;
  let best = null;
  for (let fy = 0.0; fy <= 0.5; fy += 0.02) {
    for (let fx = 0.1; fx <= 0.6; fx += 0.02) {
      if ((fx - GC.cx) ** 2 + (fy - GC.cy) ** 2 > (0.9 * GC.r) ** 2) continue;
      const sum = new Array(NB + 1).fill(0);
      const cnt = new Array(NB + 1).fill(0);
      const ks = samples.map(([x, y, b]) => {
        const t = clamp(tOf(fx, fy, x, y));
        const k = Math.round(t * NB);
        const w = opAt(t);
        sum[k] += b * w;
        cnt[k] += w;
        return [k, w];
      });
      const prof = sum.map((s, k) => (cnt[k] > 1e-6 ? s / cnt[k] : NaN));
      let err = 0;
      let wt = 0;
      samples.forEach(([, , b], i) => {
        const [k, w] = ks[i];
        if (w > 0) {
          err += w * (b - prof[k]) ** 2;
          wt += w;
        }
      });
      err /= wt;
      // the cap must sit high: the opaque part must hold the upper half of the rim
      const rimTop = Math.max(...[-2.6, -2.0, -1.57, -1.1, -0.55].map((a) => tOf(fx, fy, 0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a))));
      if (rimTop > 0.8) continue;
      if (!best || err < best.err) best = { fx, fy, prof, err };
    }
  }
  const p = best.prof;
  for (let k = 0; k <= 24; k++) if (Number.isNaN(p[k])) p[k] = k ? p[k - 1] : 1;
  for (let k = 1; k <= 24; k++) p[k] = Math.min(p[k], p[k - 1]);
  const rim = [-1.57, -0.5, 0.5, 1.57, 2.6, 3.6].map((a) => +tOf(best.fx, best.fy, 0.5 + 0.5 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)).toFixed(2));
  return { fx: best.fx, fy: best.fy, rms: Math.sqrt(best.err), at: (t) => p[Math.round(clamp(t) * 24)], rim };
})();
export const lobeFit = () => ({ fx: LOBE.fx, fy: LOBE.fy, rms: LOBE.rms, rim: LOBE.rim, b: [0, 0.2, 0.4, 0.6, 0.8].map(LOBE.at) });

// Small bumps show less modelling than big ones (light diffuses inside the cloud over a few percent of its width).
const KCLASS = [1, 0.62, 0.34];
const kClass = (r, L) => {
  const k = (r * r) / (r * r + (0.035 * L) ** 2);
  return k > 0.7 ? 0 : k > 0.3 ? 1 : 2;
};
// Exposure levels: a lobe in the cloud's own shade has no sun on its cap, only sky light, so its modelling fades into
// the shade tone (S_E: share of the under-tone in its colours). The level comes from the bulk light at its cap.
const S_E = [0, 0.2, 0.4, 0.6];
function lobeDefs(id, P, used, mod = 0.55, under = ramp(P, 0.45)) {
  let s = '';
  const ts = [0, 0.2, 0.4, 0.52, 0.62, 0.74, 0.84, 0.92];
  for (const key of [...used].sort()) {
    const c = +key[0];
    const e = +key[1];
    const st = ts.map((t) => {
      const o = opAt(t);
      const col = mix(ramp(P, 1 - mod * KCLASS[c] * (1 - LOBE.at(t))), under, S_E[e]);
      return `<stop offset="${t}" stop-color="${col}"${o < 1 ? ` stop-opacity="${num(o * 100) / 100}"` : ''}/>`;
    });
    s += `<radialGradient id="${id}${key}" cx="${GC.cx}" cy="${GC.cy}" r="${GC.r}" fx="${LOBE.fx.toFixed(2)}" fy="${LOBE.fy.toFixed(2)}">${st.join('')}</radialGradient>`;
  }
  return s;
}

// ---------- light at the scale of the cloud ----------
// lobes in world coordinates, each with cut(x) its base line. Returns the grid, the cloud cells and the shade field.
// The silhouette is inflated into a volume: half-thickness Zh = th * sqrt(2 Rp d - d^2) from the distance d to the
// outline, the base kept thick (the cloud goes on under the base line for the distance transform). Light at a point of
// the face: sky A (0.55 + 0.45 n_up) + sun S T wrap(n.SUN), T = exp(-kappa tau), tau the length inside the cloud along
// SUN from a point at depth f Zh under the face, in cloud heights.
function bulkField(lobes, o) {
  const { cell, hc } = o;
  const pad = 8;
  let xa = Infinity;
  let xb = -Infinity;
  let ya = Infinity;
  let yb = -Infinity;
  for (const l of lobes) {
    xa = Math.min(xa, l.x - l.rx);
    xb = Math.max(xb, l.x + l.rx);
    ya = Math.min(ya, l.y - l.ry);
    yb = Math.max(yb, l.cut(l.x));
  }
  const x0 = xa - pad * cell;
  const y0 = ya - pad * cell;
  const extRows = Math.ceil(hc / cell);
  const nx = Math.ceil((xb - xa) / cell) + 2 * pad;
  const ny = Math.ceil((yb - ya) / cell) + 2 * pad + extRows;
  const N = nx * ny;
  const cov = new Uint8Array(N);
  const cutC = new Float32Array(nx).fill(-Infinity);
  for (const l of lobes) {
    const i0 = Math.max(0, Math.floor((l.x - l.rx - x0) / cell));
    const i1 = Math.min(nx - 1, Math.ceil((l.x + l.rx - x0) / cell));
    const j0 = Math.max(0, Math.floor((l.y - l.ry - y0) / cell));
    const j1 = Math.min(ny - 1, Math.ceil((l.y + l.ry - y0) / cell));
    for (let i = i0; i <= i1; i++) {
      const px = x0 + (i + 0.5) * cell;
      const cb = l.cut(px);
      for (let j = j0; j <= j1; j++) {
        const py = y0 + (j + 0.5) * cell;
        if (py < cb && ((px - l.x) / l.rx) ** 2 + ((py - l.y) / l.ry) ** 2 < 1) {
          cov[j * nx + i] = 1;
          cutC[i] = Math.max(cutC[i], cb);
        }
      }
    }
  }
  // holes of sky closed over by bumps belong to the cloud (a crevice): close narrow channels, flood the outside
  const dil = Math.max(1, Math.round((o.channel ?? 0.01 * o.L) / cell));
  const wall = new Uint8Array(N);
  const disk = [];
  for (let dj = -dil; dj <= dil; dj++) for (let di = -dil; di <= dil; di++) if (di * di + dj * dj <= dil * dil) disk.push([di, dj]);
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      if (!cov[j * nx + i]) continue;
      for (const [di, dj] of disk) {
        const a = i + di;
        const b = j + dj;
        if (a >= 0 && a < nx && b >= 0 && b < ny) wall[b * nx + a] = 1;
      }
    }
  }
  const out = new Uint8Array(N);
  const stack = [];
  for (let i = 0; i < nx; i++) stack.push(i, (ny - 1) * nx + i);
  for (let j = 0; j < ny; j++) stack.push(j * nx, j * nx + nx - 1);
  while (stack.length) {
    const k = stack.pop();
    if (out[k] || wall[k]) continue;
    out[k] = 1;
    const i = k % nx;
    if (i > 0) stack.push(k - 1);
    if (i < nx - 1) stack.push(k + 1);
    if (k >= nx) stack.push(k - nx);
    if (k < N - nx) stack.push(k + nx);
  }
  const out2 = out.slice();
  for (let k = 0; k < N; k++) {
    if (!out[k]) continue;
    const i = k % nx;
    const j = (k - i) / nx;
    for (const [di, dj] of disk) {
      const a = i + di;
      const b = j + dj;
      if (a >= 0 && a < nx && b >= 0 && b < ny) out2[b * nx + a] = 1;
    }
  }
  const cl = new Uint8Array(N);
  for (let k = 0; k < N; k++) cl[k] = cov[k] || (!out2[k] && wall[k]) ? 1 : 0;
  // short gaps of sky between two cloud cells of a column are a crevice too (no thin overhang)
  const gapMax = Math.max(1, Math.round((0.05 * hc) / cell));
  for (let i = 0; i < nx; i++) {
    let last = -1;
    for (let j = 0; j < ny; j++) {
      if (!cl[j * nx + i]) continue;
      if (last >= 0 && j - last - 1 <= gapMax) for (let q = last + 1; q < j; q++) cl[q * nx + i] = 1;
      last = j;
    }
  }
  // the volume is the silhouette closed over its crevices and holes (radius ~4 % of h): small gaps between lobes
  // must not dig craters into the light field
  const rc = Math.max(1.5, (0.04 * hc) / cell);
  const dOut = edt(cl.map((v) => 1 - v), nx, ny);
  const dil2 = new Uint8Array(N);
  for (let k = 0; k < N; k++) dil2[k] = cl[k] || dOut[k] <= rc ? 1 : 0;
  const dIn = edt(dil2, nx, ny);
  const vol = new Uint8Array(N);
  for (let k = 0; k < N; k++) vol[k] = cl[k] || (dil2[k] && dIn[k] > rc) ? 1 : 0;
  {
    const seen = new Uint8Array(N);
    const st = [];
    for (let i = 0; i < nx; i++) st.push(i, (ny - 1) * nx + i);
    for (let j = 0; j < ny; j++) st.push(j * nx, j * nx + nx - 1);
    while (st.length) {
      const k = st.pop();
      if (seen[k] || vol[k]) continue;
      seen[k] = 1;
      const i = k % nx;
      if (i > 0) st.push(k - 1);
      if (i < nx - 1) st.push(k + 1);
      if (k >= nx) st.push(k - nx);
      if (k < N - nx) st.push(k + nx);
    }
    for (let k = 0; k < N; k++) if (!seen[k]) vol[k] = 1;
  }
  // distance transform with the base carried on downwards (the base is a cut through a thick cloud)
  const ext = vol.slice();
  for (let i = 0; i < nx; i++) {
    let jb = -1;
    for (let j = ny - 1; j >= 0; j--) {
      if (vol[j * nx + i]) {
        jb = j;
        break;
      }
    }
    if (jb < 0 || y0 + (jb + 1.5) * cell < cutC[i] - 3 * cell) continue;
    for (let j = jb + 1; j < Math.min(ny - 1, jb + extRows); j++) ext[j * nx + i] = 1;
  }
  const dist = edt(ext, nx, ny);
  let Rp = 0;
  for (let k = 0; k < N; k++) if (cl[k]) Rp = Math.max(Rp, dist[k]);
  Rp = Math.min(Rp, (o.rpMax ?? 0.6) * (hc / cell));
  const th = o.thick ?? 1;
  const Zh = new Float32Array(N);
  for (let k = 0; k < N; k++) {
    if (!ext[k]) continue;
    const d = Math.min(dist[k], Rp);
    Zh[k] = th * cell * Math.sqrt(Math.max(0, 2 * Rp * d - d * d));
  }
  const zMax = th * cell * Rp;
  const D = [SUN[0], -SUN[1], SUN[2]];
  const f = o.depth ?? 0.6;
  const kappa = o.kappa ?? 2;
  const A = o.sky ?? 0.4;
  const Sw = o.sun ?? 0.8;
  const B = new Float32Array(N).fill(NaN);
  const Zs = smooth2(Zh, nx, ny, ((o.nSmooth ?? 0.06) * hc) / cell / 1.7);
  const tilt = o.tilt ?? 0.7;
  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      const k = j * nx + i;
      if (!cl[k]) continue;
      // a cloud has no hard edge-on rim: the normal is taken on the smoothed volume, its tilt softened
      const gx = (tilt * (Zs[k + 1] - Zs[k - 1])) / (2 * cell);
      const gy = (tilt * (Zs[k + nx] - Zs[k - nx])) / (2 * cell);
      const nl = Math.hypot(gx, gy, 1);
      const n = [-gx / nl, gy / nl, 1 / nl];
      let x = x0 + (i + 0.5) * cell;
      let y = y0 + (j + 0.5) * cell;
      let z = Zh[k] * (1 - f);
      let len = 0;
      for (let s = 0; s < 4000; s++) {
        x += D[0] * cell;
        y += D[1] * cell;
        z += D[2] * cell;
        if (z > zMax) break;
        const a = Math.floor((x - x0) / cell);
        const b = Math.floor((y - y0) / cell);
        if (a < 0 || a >= nx || b < 0) break;
        const q = b * nx + a;
        if (ext[q] && y < cutC[a] && Math.abs(z) < Zh[q]) len += cell;
      }
      const T = Math.exp((-kappa * len) / hc);
      const lam = clamp((n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2] + WRAP) / (1 + WRAP));
      B[k] = A * (0.55 + 0.45 * n[1]) + Sw * T * lam;
      if (process.env.NUAGE_PROBE && process.env.NUAGE_PROBE.split(';').includes(`${i},${j}`))
        console.log(`probe ${i},${j}: d ${dist[k].toFixed(1)} Rp ${Rp.toFixed(1)} Zh ${Zh[k].toFixed(1)} n ${n.map((v) => v.toFixed(2))} len ${len.toFixed(0)} T ${T.toFixed(2)} lam ${lam.toFixed(2)} B ${B[k].toFixed(2)}`);
    }
  }
  if (process.env.NUAGE_DEBUG) {
    // q = B / p97 as a PGM, for checking the light field
    const v = [...B].filter((x) => !Number.isNaN(x)).sort((a, b) => a - b);
    const ref = v[Math.floor(0.97 * (v.length - 1))];
    const px = Buffer.alloc(N);
    for (let k = 0; k < N; k++) px[k] = Number.isNaN(B[k]) ? 0 : Math.round(255 * clamp(B[k] / ref));
    writeFileSync(process.env.NUAGE_DEBUG, Buffer.concat([Buffer.from(`P5 ${nx} ${ny} 255
`), px]));
  }
  return { x0, y0, nx, ny, cell, cl, vol, B, cutC };
}

// Shade regions from the light field: a in [0, aMax] where the face is darker than its brightest parts, nested bands
// of equal steps of alpha (each band's opacity set so that k bands stacked give k steps).
function shadeBands(F, o) {
  const { nx, ny, cl, B, cell, x0, y0 } = F;
  const N = nx * ny;
  const vals = [];
  for (let k = 0; k < N; k++) if (cl[k] && !Number.isNaN(B[k])) vals.push(B[k]);
  vals.sort((a, b) => a - b);
  const ref = vals[Math.floor(0.97 * (vals.length - 1))];
  const aMax = o.aMax ?? 0.7;
  const K = o.K ?? 7;
  const [qLo, qHi] = o.q ?? [0.3, 0.9];
  let a = new Float32Array(N).fill(NaN);
  for (let k = 0; k < N; k++) {
    if (!cl[k] || Number.isNaN(B[k])) continue;
    a[k] = aMax * clamp((qHi - B[k] / ref) / (qHi - qLo)) ** (o.gamma ?? 1);
  }
  // carry the field down under the base (the fade must stay dark) and outwards (the blur must not lighten the rim)
  for (let i = 0; i < nx; i++) {
    let last = NaN;
    for (let j = 0; j < ny; j++) {
      const k = j * nx + i;
      if (!Number.isNaN(a[k])) last = a[k];
      else if (!Number.isNaN(last) && y0 + (j + 0.5) * cell > F.cutC[i] - 2 * cell) a[k] = last;
    }
  }
  for (let it = 0; it < 10; it++) {
    const b = a.slice();
    for (let j = 1; j < ny - 1; j++) {
      for (let i = 1; i < nx - 1; i++) {
        const k = j * nx + i;
        if (!Number.isNaN(a[k])) continue;
        let s = 0;
        let c = 0;
        for (const q of [k - 1, k + 1, k - nx, k + nx]) {
          if (!Number.isNaN(a[q])) {
            s += a[q];
            c++;
          }
        }
        if (c) b[k] = s / c;
      }
    }
    a = b;
  }
  const sm = new Float32Array(N);
  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      let s = 0;
      let c = 0;
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const v = a[(j + dj) * nx + i + di];
          if (!Number.isNaN(v)) {
            s += v;
            c++;
          }
        }
      }
      sm[j * nx + i] = c ? s / c : 0;
    }
  }
  const bands = [];
  const step = aMax / K;
  for (let k = 1; k <= K; k++) {
    const loops = isoLoops(sm, nx, ny, (k - 0.5) * step)
      .map((lp) => simplifyLoop(lp, o.eps ?? 0.6).map(([i, j]) => [x0 + (i + 0.5) * cell, y0 + (j + 0.5) * cell]))
      .filter((lp) => lp.length > 2 && Math.abs(area2(lp)) > 8 * cell * cell);
    if (!loops.length) break;
    bands.push({ d: loopsPath(loops, cell < 2 ? 10 : 1), op: step / (1 - (k - 1) * step) });
  }
  return { bands, ref, aMax, sm };
}

// ---------- SVG writing ----------
const circ = (l) =>
  `M${num(l.x - l.rx)} ${num(l.y)}a${num(l.rx)} ${num(l.ry)} 0 1 0 ${num(2 * l.rx)} 0a${num(l.rx)} ${num(l.ry)} 0 1 0 ${num(-2 * l.rx)} 0`;
const shape = (l, fill, op) => {
  const q = l.rx > 8 ? (v) => String(Math.round(v)) : num;
  const o = op != null && op < 0.995 ? ` opacity="${num(op * 100) / 100}"` : '';
  return Math.abs(l.rx - l.ry) < 0.04 * l.rx
    ? `<circle cx="${q(l.x)}" cy="${q(l.y)}" r="${q(l.rx)}" fill="${fill}"${o}/>`
    : `<ellipse cx="${q(l.x)}" cy="${q(l.y)}" rx="${q(l.rx)}" ry="${q(l.ry)}" fill="${fill}"${o}/>`;
};
const blur = (id, s, pad = 10) =>
  `<filter id="${id}" x="-${pad}%" y="-${pad}%" width="${100 + 2 * pad}%" height="${100 + 2 * pad}%"><feGaussianBlur stdDeviation="${num(Math.max(0.3, s))}"/></filter>`;
// a filament: a thin curved lens pulled out of a torn end
const filament = (f, fill) => {
  const x1 = f.x + f.dir * f.len;
  const y1 = f.y - f.rise * f.len;
  const mx = (f.x + x1) / 2;
  const my = (f.y + y1) / 2;
  const nx = -(y1 - f.y) / f.len;
  const ny = (x1 - f.x) / f.len;
  const c = f.bend * f.len * 0.3;
  const p = (x, y) => `${num(x)} ${num(y)}`;
  return `<path d="M${p(f.x, f.y)}Q${p(mx + nx * (c + f.th), my + ny * (c + f.th))} ${p(x1, y1)}Q${p(mx + nx * (c - f.th), my + ny * (c - f.th))} ${p(f.x, f.y)}Z" fill="${fill}" opacity="${num(f.op * 100) / 100}"/>`;
};

// A layer: one or more cloudlets sharing a palette (one high cumulus, or one stratum of a low row).
// items: [{ pf, ox, oy }], each cloudlet's local frame moved by (ox, oy) in the file.
function layer(id, items, P, R, o) {
  const lobes = [];
  const shreds = [];
  let hT0 = Infinity;
  let hT1 = -Infinity;
  for (const { pf, ox, oy } of items) {
    const cut = (x) => pf.base(x - ox) + oy;
    for (const l of [...pf.lobes, ...(pf.fuzz || [])]) lobes.push({ ...l, x: l.x + ox, y: l.y + oy, cut, Lc: pf.L });
    for (const l of pf.shreds) shreds.push({ ...l, x: l.x + ox, y: l.y + oy, Lc: pf.L });
    hT0 = Math.min(hT0, oy + pf.hc - pf.hTop);
    hT1 = Math.max(hT1, oy + pf.hc);
  }
  const hcs = items.map((i) => i.pf.hc).sort((a, b) => a - b);
  const hcRef = hcs[Math.floor(hcs.length / 2)];
  const hT = hT1 - hT0;
  const Lmax = Math.max(...items.map((i) => i.pf.L));
  const cell = o.cell ?? clamp(Math.min(hT / 110, Lmax / 230), 0.7, 3);
  const F = bulkField(lobes, { ...o, cell, hc: hcRef, L: Lmax });
  const { bands, ref } = shadeBands(F, o);
  // silhouette: the cloud cells (one cell inside) and the circles of the lobes that reach the outline
  const { nx, ny, cl, x0, y0 } = F;
  // the silhouette's core is the closed volume (crevices between lobes are cloud further back, never pinholes of sky)
  const sc = F.vol.slice();
  const below = Math.ceil((0.3 * hcRef) / cell);
  const based = [];
  for (let i = 0; i < nx; i++) {
    let jb = -1;
    for (let j = ny - 1; j >= 0; j--) {
      if (sc[j * nx + i]) {
        jb = j;
        break;
      }
    }
    based.push(jb >= 0 && y0 + (jb + 1.5) * cell >= F.cutC[i] - 3 * cell);
  }
  const taper = Math.max(2, Math.round((0.12 * hcRef) / cell));
  for (let i = 0; i < nx; i++) {
    let run = taper;
    for (let q = 1; q <= taper; q++) if (!based[i - q] || !based[i + q]) run = Math.min(run, q - 1);
    const ext = Math.round((below * run) / taper);
    let jb = -1;
    for (let j = ny - 1; j >= 0; j--) {
      if (cl[j * nx + i]) {
        jb = j;
        break;
      }
    }
    if (!based[i]) continue;
    for (let j = jb + 1; j < Math.min(ny - 1, jb + ext); j++) sc[j * nx + i] = 1;
  }
  const er = new Float32Array(nx * ny);
  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      const k = j * nx + i;
      er[k] = sc[k] && sc[k - 1] && sc[k + 1] && sc[k - nx] && sc[k + nx] ? 1 : 0;
    }
  }
  const at = (x, y) => {
    const i = Math.floor((x - x0) / cell);
    const j = Math.floor((y - y0) / cell);
    return i >= 0 && i < nx && j >= 0 && j < ny && sc[j * nx + i];
  };
  const core = isoLoops(er, nx, ny, 0.5)
    .map((lp) => simplifyLoop(lp, 0.5).map(([i, j]) => [x0 + (i + 0.5) * cell, y0 + (j + 0.5) * cell]))
    .filter((lp) => lp.length > 2)
    .map((lp) => (area2(lp) > 0 ? lp.reverse() : lp));
  for (const l of lobes) {
    l.edge = false;
    const n = Math.round(clamp(l.rx / 2, 12, 40));
    for (let k = 0; k < n && !l.edge; k++) {
      const a = (k / n) * TAU;
      const x = l.x + Math.cos(a) * (l.rx * 1.03 + 0.7 * cell);
      const y = l.y + Math.sin(a) * (l.ry * 1.03 + 0.7 * cell);
      if (y < l.cut(x) - cell && !at(x, y)) l.edge = true;
    }
  }
  let sil = loopsPath(core, cell < 2 ? 10 : 1);
  for (const l of lobes) if (l.edge) sil += circ(l);
  // drop the lobes that the opaque caps painted after them hide entirely
  const opaque = (m, x, y) => {
    const u = (x - (m.x - m.rx)) / (2 * m.rx);
    const v = (y - (m.y - m.ry)) / (2 * m.ry);
    return (u - 0.5) ** 2 + (v - 0.5) ** 2 < 0.25 && tOf(LOBE.fx, LOBE.fy, u, v) < 0.62;
  };
  const ring = [[0, 0]];
  for (const [f, n] of [
    [0.4, 6],
    [0.7, 10],
    [0.92, 14],
  ])
    for (let k = 0; k < n; k++) ring.push([f * Math.cos((k / n) * TAU), f * Math.sin((k / n) * TAU)]);
  const shown = lobes.filter((l, i) => {
    for (const [u, v] of ring) {
      if (tOf(LOBE.fx, LOBE.fy, 0.5 + 0.5 * u, 0.5 + 0.5 * v) > 0.9) continue; // that part of l is transparent anyway
      const x = l.x + u * l.rx;
      const y = l.y + v * l.ry;
      if (y > l.cut(x) + 0.3 * l.ry) continue;
      let hid = false;
      for (let j = i + 1; j < lobes.length && !hid; j++) {
        const m = lobes[j];
        if (Math.abs(m.x - x) < m.rx && Math.abs(m.y - y) < m.ry && opaque(m, x, y)) hid = true;
      }
      if (!hid) return true;
    }
    return false;
  });
  // painting
  const g = `${id}g`;
  let paint = '';
  const used = new Set();
  const qAt = (x, y) => {
    for (let d = 0; d < 12; d++) {
      const i = Math.floor((x - x0) / cell);
      const j = Math.floor((y - y0) / cell) + d;
      if (i >= 0 && i < nx && j >= 0 && j < ny && !Number.isNaN(F.B[j * nx + i])) return F.B[j * nx + i] / ref;
    }
    return 1;
  };
  const LV = o.levels ?? [0.8, 0.62, 0.46];
  const level = (q) => (q > LV[0] ? 0 : q > LV[1] ? 1 : q > LV[2] ? 2 : 3);
  let soft = '';
  for (const l of shown) {
    const e = level(qAt(l.x - 0.25 * l.rx, l.y - 0.55 * l.ry));
    const key = `${kClass(l.rx, l.Lc)}${e}`;
    used.add(key);
    // lobes in the shade are soft (no sun to draw their caps), lobes in the sun keep crisp caps
    if (e >= 2) soft += shape(l, `url(#${g}${key})`);
    else paint += shape(l, `url(#${g}${key})`);
  }
  let shade = '';
  for (const b of bands) shade += `<path d="${b.d}" fill-opacity="${num(b.op * 1000) / 1000}"/>`;
  // base: every cloudlet's base line, rather crisp, and tongues hanging under it with a long fade (the softness of
  // the base varies along it)
  let bm = '';
  let tg = '';
  for (const { pf, ox, oy } of items) {
    const xa = ox + pf.xMin - 0.15 * pf.L;
    const xb = ox + pf.xMax + 0.15 * pf.L;
    const pts = [];
    const n = Math.max(12, Math.round((xb - xa) / Math.max(2, cell * 2)));
    for (let k = 0; k <= n; k++) {
      const x = xb - ((xb - xa) * k) / n;
      const u = x - ox;
      pts.push([x, pf.base(u) + oy]);
    }
    bm += `M${num(xa)} ${num(oy + pf.hc - pf.hTop - 20)}H${num(xb)}` + pts.map(([x, y]) => `L${num(x)} ${num(y)}`).join('') + 'Z';
    for (const t of pf.tongues) tg += shape({ x: ox + t.x, y: oy + pf.base(t.x) + 0.15 * t.d, rx: t.w / 2, ry: t.d }, '#fff', 0.85);
  }
  const fill = o.under ?? ramp(P, 0.45);
  const mx = Math.min(...items.map((i) => i.ox + i.pf.xMin)) - 40;
  const mw = Math.max(...items.map((i) => i.ox + i.pf.xMax)) + 40 - mx;
  const my = hT0 - 30;
  const mh = hT + 0.6 * hcRef + 60;
  const mr = `maskUnits="userSpaceOnUse" x="${num(mx)}" y="${num(my)}" width="${num(mw)}" height="${num(mh)}"`;
  // torn ends, behind the body: shreds and filaments
  let torn = '';
  for (const { pf, ox, oy } of items) for (const v of pf.shreds.veils || []) torn += shape({ ...v, x: v.x + ox, y: v.y + oy }, mix(P.lit, P.flank, 0.5), v.op);
  const qSide = (x, y, side) => {
    for (let d = 0; d < 60; d++) {
      const i = Math.floor((x - side * d * cell - x0) / cell);
      const j = Math.floor((y - y0) / cell);
      if (i >= 0 && i < nx && j >= 0 && j < ny && !Number.isNaN(F.B[j * nx + i])) return F.B[j * nx + i] / ref;
    }
    return 1;
  };
  for (const s of shreds) {
    // thin, so a little brighter than the body beside it
    const key = `2${Math.min(2, Math.max(0, level(qSide(s.x, s.y, s.side)) - 1))}`;
    used.add(key);
    torn += shape(s, `url(#${g}${key})`, s.op);
  }
  for (const { pf, ox, oy } of items) for (const f of pf.fils) torn += filament({ ...f, x: f.x + ox, y: f.y + oy }, mix(P.lit, P.flank, 0.35));
  // scraps hanging under the base
  let hang = '';
  for (const { pf, ox, oy } of items) for (const h of pf.hang) hang += shape({ ...h, x: h.x + ox, y: h.y + oy }, P.base, h.op);
  const defs =
    lobeDefs(g, P, used, o.mod, fill) +
    `<path id="${id}s" d="${sil}"/>` +
    blur(`${id}e`, (o.edge ?? 0.005) * hT, 5) +
    blur(`${id}l`, (o.lobeBlur ?? 0.0025) * hT, 5) +
    blur(`${id}o`, (o.softBlur ?? 0.008) * hT, 5) +
    blur(`${id}b`, (o.shadeBlur ?? 0.035) * hT, 15) +
    blur(`${id}f`, (o.fade ?? 0.03) * hcRef, 20) +
    `<mask id="${id}c" ${mr}><use href="#${id}s" fill="#fff" filter="url(#${id}e)"/></mask>` +
    blur(`${id}k`, (o.tongueBlur ?? 0.07) * hcRef, 40) +
    `<mask id="${id}m" ${mr}><path d="${bm}" fill="#fff" filter="url(#${id}f)"/>${tg ? `<g filter="url(#${id}k)">${tg}</g>` : ''}</mask>`;
  const body =
    `<g mask="url(#${id}m)"><g mask="url(#${id}c)">` +
    `<use href="#${id}s" fill="${fill}"/><g filter="url(#${id}o)">${soft}</g><g filter="url(#${id}l)">${paint}</g><g filter="url(#${id}b)" fill="${P.shade}">${shade}</g></g></g>`;
  const tid = `${id}t`;
  return {
    defs: defs + blur(tid, (o.tornBlur ?? 0.006) * Lmax, 30) + blur(`${id}h`, 0.03 * hcRef, 40),
    body: (torn ? `<g filter="url(#${tid})">${torn}</g>` : '') + body + (hang ? `<g filter="url(#${id}h)">${hang}</g>` : ''),
    stats: { lobes: lobes.length, shown: shown.length, edge: lobes.filter((l) => l.edge).length, bands: bands.length },
  };
}

// ---------- cloud kinds ----------
// A high cumulus (z1), B tower (z1), P small translucent puff (z1), C low row of 2-4 strata (z2).
// Returns { svg, vw, vh, baseY } with baseY the (lowest) base line in the file's viewBox (world units).
export function cloud(name, kind, seed, o) {
  const R = rng(seed);
  const P = palette(o.d);
  if (kind === 'A' || kind === 'B' || kind === 'P') {
    const L = o.L;
    const hc = L / (o.ar ?? U(R, 1.75, 2.64));
    const towers = [];
    if (kind === 'B') {
      const lean = U(R, 0.08, 0.2);
      towers.push({ u: U(R, 0.4, 0.55), w: U(R, 0.2, 0.24), h: hc * U(R, 2.1, 2.4), lean });
      towers.push({ u: towers[0].u + (R() < 0.5 ? -1 : 1) * U(R, 0.2, 0.26), w: U(R, 0.15, 0.18), h: hc * U(R, 1.4, 1.65), lean: lean * 0.8 });
    }
    const small = kind === 'P';
    const pf = cauli(R, { L, hc, towers, ...(small ? { nSec: 1, nb: 1.6, ends: 0.4 } : {}), ...(o.geo || {}) });
    const padX = 0.04 * L;
    const padT = 0.04 * pf.hTop + 4;
    const padB = 0.25 * hc + 4;
    const ox = padX - pf.xMin;
    const oy = padT + pf.hTop - hc;
    const lay = layer(name, [{ pf, ox, oy }], P, R, { kappa: o.kappa ?? U(R, 1.8, 2.6), ...(small ? { aMax: 0.35, fade: 0.2 } : {}), ...(o.light || {}) });
    let { defs, body } = lay;
    if (small) {
      // a small cumulus is translucent all over, soft on every side (photos 57, 58)
      defs += blur(`${name}p`, 0.008 * L, 15);
      body = `<g filter="url(#${name}p)" opacity=".85">${body}</g>`;
    }
    return { ...wrap(defs, body, pf.xMax - pf.xMin + 2 * padX, oy + hc + padB, oy + hc), stats: lay.stats };
  }
  if (kind === 'C') {
    // A low row: 2-4 strata; lower (farther) strata smaller, flatter, paler, closer together (gap x .7 each). Each
    // stratum is dense: cloudlets overlap, with small elements between them and few gaps of blue. Far strata first,
    // so the grey underside of a nearer stratum lies over the lit tops of the farther one (photo 1).
    const L = o.L;
    const n = o.strata ?? Math.round(U(R, 2.6, 4.2));
    const h0 = o.h0 ?? L / U(R, 8, 11);
    const hs = Array.from({ length: n }, (_, j) => h0 * 0.7 ** j);
    const bases = [];
    let y = 0;
    for (let j = n - 1; j >= 0; j--) {
      bases[j] = y; // relative to the lowest base, upwards negative
      y -= hs[j] * U(R, 0.45, 0.6);
    }
    const padX = 0.03 * L;
    const oyAll = 6 + Math.max(...hs.map((h, j) => h * 1.35 - bases[j]));
    let defs = '';
    let body = '';
    let xr = 0;
    const stats = [];
    for (let j = n - 1; j >= 0; j--) {
      const P = palette((HORIZON - (o.base + bases[j])) / HORIZON);
      const items = [];
      let x = U(R, 0, 0.1) * L;
      const xEnd = L * U(R, 0.88, 1.0);
      while (x < xEnd - 0.04 * L) {
        const far = j === n - 1 && n > 2;
        const hc = hs[j] * clamp(lognorm(R, far ? 0.6 : 0.85, 0.3), 0.35, 1.2);
        const lw = Math.min(xEnd - x, hc * (far ? U(R, 4, 7) : U(R, 2.4, 5.2)));
        if (lw < 1.6 * hc) break;
        const pf = cauli(R, {
          L: lw,
          hc,
          flat: U(R, 0.55, 0.72) - 0.03 * j,
          p: U(R, 0.5, 0.95),
          nSec: Math.round(U(R, 0.8, 3.2)),
          big: 0.15,
          nb: j ? 1.4 : 2.2,
          rMin: 3.5,
          eMin: U(R, 0.22, 0.38),
          ends: j ? 0.35 : 0.6,
          shredScale: 1.4,
        });
        const ox = padX + x;
        const oy = oyAll + bases[j] - hc + gauss(R) * 0.08 * hc;
        items.push({ pf, ox, oy });
        xr = Math.max(xr, ox + pf.xMax);
        // mostly overlapping cloudlets, now and then a gap of blue
        x += R() < 0.72 ? lw * U(R, 0.5, 0.9) : lw + hc * clamp(lognorm(R, 1.6, 0.5), 0.5, 6);
      }
      if (!items.length) continue;
      const id = `${name}_${j}`;
      const lay = layer(id, items, P, R, {
        kappa: 1.8,
        aMax: 0.62 * 0.78 ** j,
        fade: U(R, 0.1, 0.16),
        shadeBlur: 0.05,
        tornBlur: 0.004,
        mod: 0.7,
      });
      defs += lay.defs;
      body += lay.body;
      stats.push(lay.stats);
    }
    return { ...wrap(defs, body, xr + padX, oyAll + 0.35 * hs[n - 1] + 6, oyAll), stats };
  }
  throw new Error('kind ' + kind);
}

const wrap = (defs, body, vw, vh, baseY) => ({
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(vw)} ${num(vh)}" width="${num(vw)}" height="${num(vh)}"><defs>${defs}</defs>${body}</svg>\n`,
  vw,
  vh,
  baseY,
});

// ---------- the scene's clouds ----------
// base: world y of the cloud's (lowest) base line, horizon at 722; L: width of the cloud body (frame 2400 wide);
// phase: where it starts along its crossing (0 just off the left edge .. 1 just off the right edge).
export const PLAN = [
  { name: 'a1', kind: 'A', seed: 11, L: 560, ar: 2.0, base: 350, phase: 0.45, kappa: 2.4 },
  { name: 'a2', kind: 'A', seed: 23, L: 400, ar: 1.75, base: 300, phase: 0.86 },
  { name: 'a3', kind: 'B', seed: 37, L: 420, ar: 2.6, base: 450, phase: 0.18 },
  { name: 'a4', kind: 'A', seed: 41, L: 360, ar: 2.3, base: 425, phase: 0.98 },
  { name: 'a5', kind: 'A', seed: 53, L: 470, ar: 2.5, base: 485, phase: 0.66 },
  { name: 'a6', kind: 'A', seed: 67, L: 290, ar: 1.8, base: 265, phase: 0.06 },
  { name: 'a7', kind: 'P', seed: 71, L: 170, ar: 2.3, base: 175, phase: 0.3 },
  { name: 'c1', kind: 'C', seed: 101, L: 880, base: 712, h0: 80, phase: 0.35 },
  { name: 'c2', kind: 'C', seed: 113, L: 760, base: 698, h0: 70, phase: 0.8 },
  { name: 'c3', kind: 'C', seed: 127, L: 820, base: 716, h0: 76, phase: 0.08 },
  { name: 'c4', kind: 'C', seed: 131, L: 640, base: 690, h0: 64, phase: 0.58 },
];

export function build(plan = PLAN, only = null) {
  return plan
    .filter((c) => !only || only.includes(c.name))
    .map((c) => {
      const d = (HORIZON - c.base) / HORIZON;
      const r = cloud(c.name, c.kind, c.seed, { L: c.L, ar: c.ar, d, h0: c.h0, base: c.base, kappa: c.kappa, geo: c.geo, light: c.light });
      return { ...c, d, ...r, top: c.base - r.baseY };
    });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'out');
  mkdirSync(dir, { recursive: true });
  const ai = process.argv.indexOf('--only');
  const only = ai > 0 ? process.argv[ai + 1].split(',') : null;
  const clouds = build(PLAN, only);
  const sp = join(dir, 'scene.json');
  const old = existsSync(sp) ? JSON.parse(readFileSync(sp, 'utf8')) : {};
  const prev = new Map((old.nuages || []).map((n) => [n.src, n]));
  let nh = 0;
  let nb = 0;
  const scene = [];
  for (const c of PLAN) {
    const haut = c.kind !== 'C';
    const i = haut ? nh++ : nb++;
    const k = clouds.find((x) => x.name === c.name);
    if (!k) {
      if (prev.has(`nuage-${c.name}.svg`)) scene.push(prev.get(`nuage-${c.name}.svg`));
      continue;
    }
    writeFileSync(join(dir, `nuage-${c.name}.svg`), k.svg);
    // high clouds cross in 150-240 s, low rows twice slower (parallax); negative delays spread them from the start
    const t = haut ? 150 + ((i * 47) % 91) : 2 * (150 + ((i * 53) % 91));
    scene.push({ src: `nuage-${c.name}.svg`, rang: haut ? 'hauts' : 'bas', y: +((k.top / H) * 100).toFixed(2), w: +((k.vw / W) * 100).toFixed(2), t, d: -Math.round(c.phase * t) });
    console.log(`nuage-${c.name}.svg: ${c.kind} d ${k.d.toFixed(2)} ${Math.round(k.vw)}x${Math.round(k.vh)} ${(k.svg.length / 1024).toFixed(1)} Ko ${JSON.stringify(k.stats)}`);
  }
  old.nuages = scene;
  writeFileSync(sp, JSON.stringify(old, null, 1) + '\n');
}
