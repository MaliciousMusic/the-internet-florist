// ciel.mjs: the daytime sky of the shop scene (layer z0), one SVG file drawn once by the browser (<img>).
//
//   node decor/ciel.mjs [--variante maquette|mesure] [--ras #dde6ee] [--seed 9] [--out f]   (maquette: owner's choice)
//        -> decor/out/ciel-mesure.svg, decor/out/ciel-maquette.svg and decor/out/ciel.svg (the chosen variant,
//           default "mesure"); with --out, only that file.
//
// World frame 2400 x 1350; horizon (foot of the hedges) at y = 722, the gradient runs on to 782 (hidden by z3).
// Profile (decor/refs/voiles.md, owner's mock-up): the STRUCTURE of the mock-up, clear blue over the top half,
// whitening that starts around mid-sky (25 % of the fall at t .50, half at t .71) and is nearly white at t .85, then a
// neutral daylight white at the horizon (RAS, default #dde6ee, adjustable). The whitening is a haze mixed in linear
// light over a clear-sky blue that itself lightens a little and turns ~5 deg towards cyan downwards (ciel.md).
// Two top blues for the owner to choose: "mesure" (median of the soft daylight photos, #4e90ca) and "maquette" (the
// mock-up's #7da4d0 brought back to a daylight blue: hue 212, the warm grey taken out, #7ba4d4).
// Sun high (~57 deg), left and a little behind the viewer: the left of the sky is a little paler (sunVeil, computed).
// Banding: every gradient is written with adaptive stops (linear sRGB interpolation within 0.2 of a level of the
// smooth curve, no slope breaks), so the 8-bit steps are single levels spread over tens of units.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const W = 2400;
export const H = 1350;
export const HORIZON = 722;
export const SKY_BOTTOM = HORIZON + 60;

// One sun for the whole shop scene (x right, y up, z towards the viewer): same azimuth as LV in
// demo/src/v1a.js, about 57 deg high, left and a little behind the viewer.
const n3 = (v) => {
  const l = Math.hypot(...v);
  return v.map((x) => x / l);
};
export const SUN = n3([-0.5, 1.2, 0.6]);
// Pinhole of the world frame: horizon through y = 722, horizontal field of view ~88 deg (focal 1250 world units).
export const FOCAL = 1250;
export const viewDir = (x, y) => n3([(x - W / 2) / FOCAL, (HORIZON - y) / FOCAL, -1]);

// ---------- small shared helpers (also used by voiles.mjs and abandon/nuages.mjs) ----------
export function rng(seed) {
  let a = (seed * 2654435761) >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
export const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const hex = (c) => '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => hex(rgb(a).map((v, i) => lerp(v, rgb(b)[i], t)));
export const num = (v) => {
  const s = (Math.round(v * 10) / 10).toString();
  return s === '-0' ? '0' : s;
};
// sRGB <-> linear light, on 0..255
export const toLin = (v) => {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
export const toSrgb = (l) => 255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055);

export function toHsv([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, mx ? d / mx : 0, mx];
}
export function fromHsv([h, s, v]) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const k = Math.floor(h / 60) % 6;
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][k];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}
export const hueShift = (h, deg) => {
  const [hh, s, v] = toHsv(rgb(h));
  return hex(fromHsv([(hh + deg + 360) % 360, s, v]));
};

// Monotone cubic (Fritsch-Carlson) through control points [[x, y], ...]: smooth, no overshoot.
export function pchip(P) {
  const n = P.length;
  const d = [];
  for (let i = 0; i < n - 1; i++) d.push((P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]));
  const m = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  // Fritsch-Carlson limiter
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      m[i] = k * a * d[i];
      m[i + 1] = k * b * d[i];
    }
  }
  return (x) => {
    if (x <= P[0][0]) return P[0][1];
    if (x >= P[n - 1][0]) return P[n - 1][1];
    let i = 0;
    while (x > P[i + 1][0]) i++;
    const h = P[i + 1][0] - P[i][0];
    const t = (x - P[i][0]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * P[i][1] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * P[i + 1][1] + (t3 - t2) * h * m[i + 1];
  };
}

// Gradient stops by adaptive subdivision: f(u) -> [r, g, b, a] (0..255, a 0..1), u in [0, 1]; a segment is split
// until the linear interpolation between its ends stays within `tol` levels of f everywhere (a in levels of 255).
export function adaptiveStops(f, tol = 0.2, minStep = 0.004) {
  const err = (a, b, fa, fb) => {
    let e = 0;
    for (let k = 1; k < 8; k++) {
      const u = a + ((b - a) * k) / 8;
      const fu = f(u);
      const li = fa.map((v, i) => lerp(v, fb[i], k / 8));
      e = Math.max(e, ...fu.map((v, i) => Math.abs(v - li[i]) * (i === 3 ? 255 : 1)));
    }
    return e;
  };
  const out = [[0, f(0)]];
  const rec = (a, b, fa, fb) => {
    if (b - a > minStep && err(a, b, fa, fb) > tol) {
      const m = (a + b) / 2;
      const fm = f(m);
      rec(a, m, fa, fm);
      rec(m, b, fm, fb);
    } else out.push([b, fb]);
  };
  // start from 8 even segments so no feature is skipped
  for (let k = 0; k < 8; k++) rec(k / 8, (k + 1) / 8, f(k / 8), f((k + 1) / 8));
  return out;
}

// ---------- the profile, t = 0 top of the frame .. 1 horizon ----------
export const VARIANTES = {
  // median of the soft daylight skies (voiles.md: 93 166 173 213 67 368 372 144 135), top of the frame
  mesure: { top: '#4e90ca' },
  // the owner's mock-up, #7da4d0 (S .40, hue 212, late light) brought back to daylight: hue 212, S .42, V .83
  maquette: { top: '#7ba4d4' },
};
export const RAS = '#dde6ee';

// Whitening, as the share of the fall of saturation from the top to the horizon (the measure of voiles.md): the
// structure of the mock-up (25 % of the fall at t .50, half at .71, S < .10 from .82; its rows at t .63 and .78 read
// 34 % and 60 % of the fall) and "nearly white at 85 %" (owner: 93 % of the fall there); nothing above t .15. The haze share mixed in linear light is solved from it for each top blue (fallMix).
export const FALL = [
  [0, 0],
  [0.15, 0],
  [0.3, 0.06],
  [0.42, 0.15],
  [0.5, 0.25],
  [0.6, 0.37],
  [0.71, 0.52],
  [0.78, 0.66],
  [0.82, 0.8],
  [0.85, 0.93],
  [0.88, 0.975],
  [0.92, 0.993],
  [0.96, 1],
  [1, 1],
]

export function skyParams(seed = 9, o = {}) {
  const R = rng(seed * 7 + 11);
  const variante = o.variante ?? 'maquette'; // owner's choice, 2026-10-15
  const top = o.top ?? VARIANTES[variante].top;
  const ras = o.ras ?? RAS;
  // the seed moves the whole whitening by +-.02 of t and the hue by +-2 deg; nothing else
  const shift = o.shift ?? (R() * 2 - 1) * 0.02;
  const hue = o.hue ?? (R() * 2 - 1) * 2;
  // `under`: mean opacity of the drifting veils by t (their time average, colour VCOL), measured by voiles.mjs
  // (out/voiles-moyenne.json); the sky is solved so that sky + mean veil keeps the profile, the veils carrying part
  // of the whitening as in the photos (voiles.md: the gradient is cumulative)
  const under = o.under ?? null;
  return { seed, variante, top, ras, shift, hue, under, side: o.side ?? 'left' };
}

const fallCurve = pchip(FALL);
const satOf = (c) => {
  const mx = Math.max(...c);
  return mx ? (mx - Math.min(...c)) / mx : 0;
};
// clear-sky blue at t: turns ~5 deg towards cyan, a little lighter and less saturated downwards (ciel.md, haze removed)
function blueAt(t, p) {
  const [h0, s0, v0] = toHsv(rgb(p.top));
  const u = clamp(t, 0, 1);
  return fromHsv([(h0 + p.hue - 5 * u + 360) % 360, s0 * (1 - 0.1 * u), Math.min(1, v0 + 0.05 * u)]);
}
const blend = (c, r, w) => c.map((v, i) => toSrgb(lerp(toLin(v), toLin(r[i]), w)));
// haze share w (linear light) at t whose saturation fall matches FALL, the mean veil (p.under) included; solved by
// bisection, cached per params
const VCOL = rgb('#e9f0f7');
const veilOver = (c, a) => c.map((v, i) => v + (VCOL[i] - v) * a);
const mixCache = new Map();
export function fallMix(t, p) {
  const key = `${p.top}|${p.ras}|${p.hue}|${p.under ? 'u' : ''}`;
  let tab = mixCache.get(key);
  if (!tab) {
    const r = rgb(p.ras);
    const s0 = satOf(blueAt(0, p));
    const s1 = satOf(r);
    tab = [];
    for (let i = 0; i <= 200; i++) {
      const tt = i / 200;
      const goal = s0 - fallCurve(tt) * (s0 - s1);
      const b = blueAt(tt, p);
      const av = p.under ? clamp(p.under(tt), 0, 0.9) : 0;
      const sAt = (m) => satOf(veilOver(blend(b, r, m), av));
      let lo = 0;
      let hi = 1;
      if (sAt(0) <= goal) {
        tab.push([tt, 0]);
        continue;
      }
      if (sAt(1) >= goal) {
        tab.push([tt, 1]);
        continue;
      }
      for (let k = 0; k < 40; k++) {
        const m = (lo + hi) / 2;
        if (sAt(m) > goal) lo = m;
        else hi = m;
      }
      tab.push([tt, (lo + hi) / 2]);
    }
    tab = pchip(tab);
    mixCache.set(key, tab);
  }
  return tab(clamp(t, 0, 1));
}
export function whitening(t, p) {
  return t >= 1 ? 1 : fallMix(clamp(t - p.shift, 0, 1), p);
}

// colour of the sky at t, before the sun veil, as floats 0..255
export function skyRGB(t, p) {
  return blend(blueAt(t, p), rgb(p.ras), whitening(t, p));
}
export const skyAt = (t, p) => hex(skyRGB(t, p));

// The sun-side veil, computed: aerosol (Mie) scattering seen along each line of sight, Henyey-Greenstein phase
// (g = .7) of the angle between the view and SUN, over the visible sky. The field is fitted by the best linear gradient
// (direction searched, profile = mean of each band, smoothed). Only its DIFFERENCE across the sky is kept: the base
// gradient is darkened by the inverse of the veil at the centre column (x 1200), so the centre keeps the profile above,
// the left (sun side) comes out paler and the right deeper. Strength: on the "mesure" variant, the left is paler than
// the right by dS = -.05 at mid-height (ciel.md: |dS| .03-.06 when the sun is not in the frame); the same strength
// serves both variants (same sun, same air).
const HG = (cg, g = 0.7) => (1 - g * g) / (1 + g * g - 2 * g * cg) ** 1.5;
const veilCache = new Map();
const VEIL = '#f2f6fb';
const VC = rgb(VEIL);
// colour c (0..255) seen through the veil of opacity a, and the inverse
const over = (c, a) => c.map((v, i) => v + (VC[i] - v) * a);
const unover = (c, a) => c.map((v, i) => (v - a * VC[i]) / (1 - a));
const sat = (c) => {
  const mx = Math.max(...c);
  return mx ? (mx - Math.min(...c)) / mx : 0;
};
export function sunVeil(p) {
  const key = `${p.side}|${p.shift}|${p.hue}|${p.ras}`;
  if (veilCache.has(key)) return veilCache.get(key);
  const s = p.side === 'left' ? SUN : [-SUN[0], SUN[1], SUN[2]];
  const pts = [];
  for (let y = 10; y < HORIZON; y += 18) {
    for (let x = 10; x < W; x += 30) {
      const v = viewDir(x, y);
      pts.push([x, y, HG(v[0] * s[0] + v[1] * s[1] + v[2] * s[2])]);
    }
  }
  const lo = Math.min(...pts.map((q) => q[2]));
  const hi = Math.max(...pts.map((q) => q[2]));
  for (const q of pts) q[2] = (q[2] - lo) / (hi - lo);
  const NB = 24;
  let best = null;
  for (let a = 0; a < 180; a += 1) {
    const d = [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
    const pr = pts.map((q) => q[0] * d[0] + q[1] * d[1]);
    const p0 = Math.min(...pr);
    const p1 = Math.max(...pr);
    const sum = new Array(NB + 1).fill(0);
    const cnt = new Array(NB + 1).fill(0);
    pr.forEach((t, i) => {
      const b = Math.round(((t - p0) / (p1 - p0)) * NB);
      sum[b] += pts[i][2];
      cnt[b]++;
    });
    const prof = sum.map((v, b) => (cnt[b] ? v / cnt[b] : 0));
    const err = pts.reduce((e, q, i) => e + (q[2] - prof[Math.round(((pr[i] - p0) / (p1 - p0)) * NB)]) ** 2, 0) / pts.length;
    if (!best || err < best.err) best = { a, d, p0, p1, prof, err };
  }
  // smooth the banded means (binomial 1-4-6-4-1, ends held) and read them as a C1 curve
  const pr = best.prof;
  const sm = pr.map((v, i) => {
    if (i < 2 || i > NB - 2) return v;
    return (pr[i - 2] + 4 * pr[i - 1] + 6 * v + 4 * pr[i + 1] + pr[i + 2]) / 16;
  });
  const curve = pchip(sm.map((v, i) => [i / NB, v]));
  const field = (x, y) => curve(clamp((x * best.d[0] + y * best.d[1] - best.p0) / (best.p1 - best.p0)));
  // strength from the measured left/right gap, on the "mesure" variant, centre kept
  const ref = { ...p, top: VARIANTES.mesure.top, under: null };
  const ym = HORIZON / 2;
  const target = skyRGB(0.5, ref);
  const gap = (A) => {
    const base = unover(target, A * field(W / 2, ym));
    return sat(over(base, A * field(0.12 * W, ym))) - sat(over(base, A * field(0.88 * W, ym)));
  };
  let A = 0;
  while (A < 0.6 && gap(A) > -0.05) A += 0.0025;
  const stops = adaptiveStops((u) => [...VC, A * curve(u)], 0.15)
    .map(([u, c]) => `<stop offset="${u.toFixed(4)}" stop-color="${VEIL}" stop-opacity="${c[3].toFixed(4)}"/>`)
    .join('');
  const out = {
    def:
      `<linearGradient id="csv" gradientUnits="userSpaceOnUse" x1="${num(best.p0 * best.d[0])}" y1="${num(best.p0 * best.d[1])}"` +
      ` x2="${num(best.p1 * best.d[0])}" y2="${num(best.p1 * best.d[1])}">${stops}</linearGradient>`,
    alpha: (x, y) => A * field(x, y),
    angle: best.a,
    rms: Math.sqrt(best.err),
    A,
  };
  veilCache.set(key, out);
  return out;
}

// The whole sky as an SVG string (world frame). Ids are prefixed "cs" so the plane can be inlined next to others.
export function sky(seed = 9, o = {}) {
  const p = skyParams(seed, o);
  const v = sunVeil(p);
  const T1 = SKY_BOTTOM / HORIZON; // the gradient runs from y 0 (t 0) to SKY_BOTTOM (t 1.083)
  // base = profile with the centre column's veil taken out
  const stops = adaptiveStops((u) => [...unover(skyRGB(u * T1, p), v.alpha(W / 2, u * SKY_BOTTOM)), 1], 0.2)
    .map(([u, c]) => `<stop offset="${u.toFixed(4)}" stop-color="${hex(c.slice(0, 3))}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><linearGradient id="csg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${SKY_BOTTOM}">${stops}</linearGradient>
${v.def}</defs>
<rect width="${W}" height="${SKY_BOTTOM}" fill="url(#csg)"/>
<rect width="${W}" height="${SKY_BOTTOM}" fill="url(#csv)"/>
</svg>
`;
}

// ---------- command line ----------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const get = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const seed = Number(get('--seed', 9));
  const ras = get('--ras', RAS);
  const chosen = get('--variante', 'maquette');
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'out');
  mkdirSync(dir, { recursive: true });
  // the veils' mean whitening, if voiles.mjs has measured it (out/voiles-moyenne.json)
  let under = null;
  try {
    const { readFileSync } = await import('node:fs');
    const m = JSON.parse(readFileSync(join(dir, 'voiles-moyenne.json'), 'utf8'));
    under = pchip(m.profil);
  } catch {
    under = null;
  }
  const outs = a.includes('--out') ? [[chosen, get('--out')]] : [
    ['mesure', join(dir, 'ciel-mesure.svg')],
    ['maquette', join(dir, 'ciel-maquette.svg')],
    [chosen, join(dir, 'ciel.svg')],
  ];
  for (const [variante, f] of outs) {
    const o = { variante, ras, under };
    const svg = sky(seed, o);
    writeFileSync(f, svg);
    const p = skyParams(seed, o);
    const v = sunVeil(p);
    const n = (svg.match(/<stop/g) || []).length;
    console.log(`${f}: ${variante}, haut ${p.top}, ras ${p.ras}, graine ${seed} (decalage ${p.shift.toFixed(3)}, teinte ${p.hue.toFixed(1)}), voile solaire ${v.angle} deg force ${v.A.toFixed(3)}, ${n} arrets, ${under ? 'voiles deduits' : 'sans deduction des voiles'}, ${svg.length} octets`);
  }
}
