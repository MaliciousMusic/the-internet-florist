// voiles.mjs: the light veils and streaks of the lower third of the daytime sky (layers z1 and z2 of the shop scene).
//
//   node decor/voiles.mjs [--seed 5]
//        -> decor/out/voiles-haut.svg (z1), decor/out/voiles-bas.svg (z2), decor/out/voiles-moyenne.json (their mean
//           whitening by height, which ciel.mjs takes out of the sky), and the "nuages" key of decor/out/scene.json.
//
// Measures: decor/refs/voiles.md (21 photos, 11 in 1920 px). The two thirds above stay clear; the streaks live in the
// lower third, thin, stretched 5-16:1, tilted 0-10 deg and sub-parallel in a bank, gaussian in section (no edge),
// adding about .20 of white at their core (never #fff), with 1-2 low-contrast fibres, and they melt into the pale band
// before the horizon. Coverage ~40 % of the band where they live.
//
// Each band is ONE image, 4800 wide and periodic every 2400: its tile (the world's width) is written once and shown
// four times through <use> (x -2400, 0, 2400, 4800, unclipped), so a wisp that spills over a seam is continued by the
// next copy. The image slides left to right by 2400 and loops (scene.js, "boucle"): only a horizontal translation,
// nothing inside moves, no seam, never an empty sky. The lower band is slower (farther away): parallax.
//
// Shape: a wisp is a faint wide body plus a bundle of 2-5 thin filaments (sub-parallel, fanning a little, uneven
// lengths, their density coming and going) and sometimes a fine striation; wisps gather in clusters along meandering
// banks (heights .10 of the sky apart), with stretches of bare sky between clusters; a few broad faint sheets and long
// thin strata near the horizon. Every streak is a chain of overlapping ellipses along a gently bent spine (a blunter
// head, a long fading tail), filled by one shared radial gradient whose stops follow a windowed gaussian: its section
// is gaussian-like (20-80 % ramp = .43 x its thickness, photos .44-.48), the sum along the chain is smooth (spacing
// .45 of a link, < 1.2 sigma). Perspective: lower streaks are farther, so thinner, shorter and flatter.
//
// Light, computed: a streak is a sheet (depth ~5 x its thickness) lit by SUN, single scattering with Beer-Lambert along
// the sun path and the view path (litEdge): the sun-side edge (top) comes out a little brighter, the peak of the
// visible section sits ~.1 sigma above the density peak; this is the focal shift of the shared gradient. Across the
// world, the brightness of the veils follows the phase of the scattering angle (brighter on the sun side, left): that
// one cannot be baked into a sliding image, so it is a static mask of the band's container ("lumiere" in scene.json),
// capped at +-10 % (voiles.md).
//
// The vertical fade is a mask that only depends on y, so it stays right while the image slides.
// SVG native only: ellipses, gradients, masks. No filter, no turbulence, no image, no animated opacity.
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { W, HORIZON, SUN, FOCAL, rng, clamp, lerp, pchip, adaptiveStops, viewDir } from './ciel.mjs';
import { renderCrop, over } from './compose.mjs';

const TAU = Math.PI * 2;
const U = (R, a, b) => a + (b - a) * R();
const gauss = (R) => Math.sqrt(-2 * Math.log(Math.max(1e-9, R()))) * Math.cos(TAU * R());
const lognorm = (R, m, s) => m * Math.exp(s * gauss(R));
const tOf = (y) => y / HORIZON;
const yOf = (t) => t * HORIZON;

// Colour of the veils: sunlit ice with the blue dome above, a cool white; the core never reaches #fff (alpha < .45).
export const VCOL = '#e9f0f7';

// ---------- light ----------
// Single scattering across the section of a streak seen at elevation e (deg): a sheet, gaussian in height (sigma 1)
// and in depth (sigma `aspect`), optical depth tau0 along the view through its core. Returns the shift of the peak
// of the visible excess over the sky (in sigma of the projected section) and the drop of its contrast.
export function litEdge(eDeg = 6, aspect = 5, tau0 = 0.36, ratio = 1.38) {
  const e = (eDeg * Math.PI) / 180;
  const dv = [Math.sin(e), -Math.cos(e)]; // view ray (Y up, Z towards the viewer), from the eye
  const nn = [Math.cos(e), Math.sin(e)]; // screen-up, across the ray
  const rho = (Y, Z) => Math.exp(-(Y * Y) / 2 - (Z * Z) / (2 * aspect * aspect));
  const S = [SUN[1], SUN[2]];
  const L = 5 * aspect;
  const ds = 0.08;
  let col = 0;
  for (let s = -L; s <= L; s += ds) col += rho(s * dv[0], s * dv[1]) * ds;
  const k = tau0 / col;
  const tauSun = (Y, Z) => {
    let t = 0;
    for (let l = 0; l < 6 * aspect; l += 0.15) t += rho(Y + l * S[0], Z + l * S[1]) * 0.15;
    return k * t;
  };
  const us = [];
  const dens = [];
  const exc = [];
  for (let u = -4; u <= 4.0001; u += 0.1) {
    let front = 0;
    let rad = 0;
    for (let s = -L; s <= L; s += ds) {
      const Y = u * nn[0] + s * dv[0];
      const Z = u * nn[1] + s * dv[1];
      const r = k * rho(Y, Z);
      rad += r * Math.exp(-tauSun(Y, Z) - front) * ds;
      front += r * ds;
    }
    const a = 1 - Math.exp(-front);
    us.push(u);
    dens.push(a);
    // excess over the sky when the sunlit veil is `ratio` x as bright as the sky behind, as an alpha of that colour
    exc.push((ratio * rad - a) / (ratio - 1));
  }
  const centroid = (p) => p.reduce((s, v, i) => s + v * us[i], 0) / p.reduce((s, v) => s + v, 0);
  const sd = Math.sqrt(dens.reduce((s, v, i) => s + v * us[i] ** 2, 0) / dens.reduce((s, v) => s + v, 0));
  return { shift: (centroid(exc) - centroid(dens)) / sd, contrast: Math.max(...exc) / Math.max(...dens), sigma: sd };
}

// Phase of the scattering angle along the world at a height y: Henyey-Greenstein (g .7, as the sky's sun veil),
// normalised to its maximum, then brought to +-10 % (the cap of voiles.md); the shape is computed, the amplitude capped.
export function lumiere(y, n = 9) {
  const HG = (cg, g = 0.7) => (1 - g * g) / (1 + g * g - 2 * g * cg) ** 1.5;
  const v = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * W;
    const d = viewDir(x, y);
    v.push(HG(d[0] * SUN[0] + d[1] * SUN[1] + d[2] * SUN[2]));
  }
  const mx = Math.max(...v);
  const mn = Math.min(...v);
  return v.map((p, i) => [Math.round((i / (n - 1)) * 1000) / 10, Math.round((1 - (0.2 * (mx - p)) / (mx - mn)) * 1000) / 1000]);
}

// ---------- the shared section ----------
// Windowed gaussian on the ellipse radius r (0 centre .. 1 edge): g = exp(-r^2/2s^2) (1 - r^2)^2, s set so that the
// half maximum sits at r = .47 (thickness at half height = .94 ry, i.e. ry = 1.06 x the thickness, as the brief).
function sectionSigma() {
  let lo = 0.2;
  let hi = 0.8;
  for (let k = 0; k < 50; k++) {
    const s = (lo + hi) / 2;
    const g = Math.exp(-(0.47 * 0.47) / (2 * s * s)) * (1 - 0.47 * 0.47) ** 2;
    if (g < 0.5) lo = s;
    else hi = s;
  }
  return (lo + hi) / 2;
}
const SIG = sectionSigma();
const section = (r) => Math.exp(-(r * r) / (2 * SIG * SIG)) * Math.max(0, 1 - r * r) ** 2;

export function gradientDef(id, fy) {
  const stops = adaptiveStops((u) => [0, 0, 0, section(u)], 0.6)
    .map(([u, c]) => `<stop offset="${u.toFixed(3)}" stop-color="${VCOL}" stop-opacity="${c[3].toFixed(3)}"/>`)
    .join('');
  return `<radialGradient id="${id}" fy="${fy.toFixed(3)}">${stops}</radialGradient>`;
}

// ---------- one streak ----------
// A chain of gaussian ellipses along a bent spine. len, th (thickness at half height), pk (peak alpha), angle (deg),
// centre (cx, cy). Returns the ellipses [cx, cy, rx, ry, rot, alpha].
export function streak(R, { cx, cy, len, th, pk, angle, most = 9, breakup = 0.28, bend = 0.025 }) {
  const out = [];
  // n links of along-axis size `link` (at half height), spaced .45 of it (< 1.2 sigma: a smooth sum, no beads);
  // about one link per 3 thicknesses, so the thickness and density can wander along the streak
  const n = clamp(Math.round(len / (3 * th)), 3, most);
  const link = len / (1 + 0.45 * (n - 1));
  const step = 0.45 * link;
  // envelope along the streak: a blunter head and a long fading tail, on either end
  let p = U(R, 0.35, 1.0);
  let q = U(R, 0.9, 2.4);
  if (R() < 0.5) [p, q] = [q, p];
  const env = (u) => {
    const m = (p / (p + q)) ** p * (q / (p + q)) ** q;
    return (u ** p * (1 - u) ** q) / m;
  };
  // smooth random walks for the spine offset, the thickness and the density along the length
  const walk = (amp, nk) => {
    const k = [];
    for (let i = 0; i <= nk; i++) k.push([i / nk, gauss(R) * amp]);
    return pchip(k);
  };
  // the spine wanders a little: a few units, more on long thin filaments
  const off = walk(0.06 * th + 0.006 * len, Math.max(2, Math.min(8, Math.round(len / (4 * th)))));
  const thk = walk(0.22, Math.max(2, Math.round(len / (3 * th))));
  const den = walk(breakup, Math.max(3, Math.min(9, Math.round(len / (2 * th)))));
  // a gentle sag or rise over the length (2-3 % of it)
  const bow = gauss(R) * bend * len;
  const a = (angle * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  // per-link alpha so that the chain's sum peaks at pk (links at `step`, each a section of radius rx along the axis)
  const rx = 1.064 * link;
  let sum = 0;
  for (let i = -8; i <= 8; i++) sum += section(Math.min(1, Math.abs(i * step) / rx));
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n;
    const e = env(clamp(u, 0.02, 0.98));
    const span = len - link * 0.5;
    const along = (u - 0.5) * span;
    const across = off(u) + bow * 4 * u * (1 - u) - bow;
    // the screen is y down: a positive angle lifts the right end
    const x = cx + along * ca + across * sa;
    const y = cy - along * sa + across * ca;
    const t = th * (0.35 + 0.65 * Math.sqrt(e)) * Math.exp(thk(u));
    const al = (pk * e * Math.exp(den(u)) * U(R, 0.85, 1.15)) / sum;
    // SVG rotation of the link: the bank angle (counter-clockwise on screen) plus the local slope of the spine
    const du = 0.5 / n;
    const slope = (off(clamp(u + du)) - off(clamp(u - du)) + bow * 4 * (1 - 2 * u) * 2 * du) / (2 * du * span);
    const rot = -angle + (Math.atan(slope) * 180) / Math.PI;
    out.push([x, y, rx, 1.064 * t, rot, al]);
  }
  return out;
}

// ---------- a band ----------
// Perspective: a veil at height t is farther the lower it is; its apparent size goes as the elevation (length) and
// the square of the elevation for its depth (thickness), softened (thin layers are also thinner far away). k(t) is
// the scale relative to t .70.
const elev = (t) => Math.max(0.004, (HORIZON - yOf(t)) / FOCAL);
const kLen = (t) => (elev(t) / elev(0.7)) ** 0.45;
const kTh = (t) => (elev(t) / elev(0.7)) ** 0.6;

function band(seed, cfg) {
  const R = rng(seed * 31 + cfg.salt);
  const els = [];
  const push = (arr, z) => els.push(...arr.map((e) => ({ e, z })));
  const banks = [];
  // banks: centre heights spaced .16 +- .06 of the sky (voiles.md), sub-parallel (a common tilt for the whole sky,
  // +- a little per bank), each with a slow periodic wave so the tile loops
  const bias = cfg.tiltBias * U(R, 0.7, 1.3);
  let t = U(R, cfg.t0[0], cfg.t0[1]);
  while (t < cfg.t1) {
    banks.push({ t, tilt: bias + clamp(gauss(R) * cfg.tilt, -2 * cfg.tilt, 2 * cfg.tilt), wave: [U(R, 0, TAU), U(R, 0, TAU), U(R, 14, 34) * kTh(t), U(R, 5, 14) * kTh(t), U(R, 0, TAU), U(R, 2, 6) * kTh(t)] });
    t += clamp(lognorm(R, cfg.gap, 0.3), cfg.gap * 0.6, cfg.gap * 1.6);
  }
  // a bank meanders (three periodic harmonics, so the tile still loops)
  const bankY = (b, x) => yOf(b.t) + b.wave[2] * Math.sin((TAU * x) / W + b.wave[0]) + b.wave[3] * Math.sin((2 * TAU * x) / W + b.wave[1]) + b.wave[5] * Math.sin((5 * TAU * x) / W + b.wave[4]);
  const rot = (cx, cy, along, across, a) => [cx + along * Math.cos(a) + across * Math.sin(a), cy - along * Math.sin(a) + across * Math.cos(a)];
  for (const b of banks) {
    const kL = kLen(b.t);
    const kT = kTh(b.t);
    // walk along the tile: wisps of the bank and gaps of bare sky, until the tile is covered (it wraps)
    let x = U(R, 0, W);
    const end = x + W;
    while (x < end) {
      const L = clamp(lognorm(R, cfg.wisp.len, 0.45), 0.35 * cfg.wisp.len, 2.2 * cfg.wisp.len) * kL;
      const angle = (b.tilt + gauss(R) * 2.5) * Math.sqrt(kL);
      const a = (angle * Math.PI) / 180;
      const thB = clamp(lognorm(R, cfg.body.th, 0.25), 0.6 * cfg.body.th, 1.6 * cfg.body.th) * kT;
      const cx = x + L / 2;
      const cy = bankY(b, cx) + gauss(R) * (0.6 * thB + 8 * kT);
      // the body: a faint wide veil (gaussian section), not always there
      if (R() < cfg.body.p) push(streak(R, { cx, cy, len: L * U(R, 0.9, 1.15), th: thB, pk: U(R, cfg.body.pk[0], cfg.body.pk[1]), angle, most: 7 }), R());
      // the bundle: 2-5 thin filaments, sub-parallel (+-1 deg, so they fan a little), of uneven lengths, spread over
      // the body, at least 1.3 of their thickness apart; their density comes and goes along them
      const m = 2 + Math.floor(R() * (cfg.fil.m - 1));
      const thF = clamp(lognorm(R, cfg.fil.th, 0.3), 0.5 * cfg.fil.th, 2 * cfg.fil.th) * kT;
      const spread = Math.max(0.9 * thB, 1.5 * m * thF);
      const offs = [];
      for (let k = 0; k < 40 && offs.length < m; k++) {
        const o = (R() - 0.5) * spread;
        if (offs.every((v) => Math.abs(v - o) > 1.3 * thF)) offs.push(o);
      }
      for (const o of offs) {
        const len = L * U(R, 0.45, 1.05);
        const along = (R() - 0.5) * (L - len) * 0.9;
        const [fx, fy] = rot(cx, cy, along, o, a);
        const th = thF * U(R, 0.7, 1.3);
        push(streak(R, { cx: fx, cy: fy, len, th, pk: U(R, cfg.fil.pk[0], cfg.fil.pk[1]), angle: angle + clamp(gauss(R), -1.5, 1.5) * 1.0, most: 6, breakup: 0.45 }), 1 + R());
      }
      // fine fibres (2.5-6 units, at the resolution of the photos' fibres): 2-4 per wisp, bent, diverging a little,
      // some running past the wisp's ends (the frayed look of cirrus); low contrast each
      const nfine = 2 + Math.floor(R() * 3);
      for (let k = 0; k < nfine; k++) {
        const len = L * U(R, 0.2, 0.6);
        const [fx, fy] = rot(cx, cy, (R() - 0.5) * L * 0.8, (R() - 0.5) * 0.9 * thB, a);
        // sub-parallel to the wisp (+-1 deg): fibres never cross in an X (voiles.md, traps)
        push(streak(R, { cx: fx, cy: fy, len, th: U(R, 2.5, 6) * Math.sqrt(kT), pk: U(R, cfg.fine.pk[0], cfg.fine.pk[1]), angle: angle + clamp(gauss(R), -1.5, 1.5) * 0.7, most: 4, breakup: 0.7, bend: 0.04 }), 2 + R());
      }
      // gaps: mostly short (wisps in a cluster), sometimes a long stretch of bare sky, so a bank never runs
      // as a stripe across the whole sky
      x += L + (R() < cfg.breaks ? clamp(lognorm(R, 520 * kL, 0.4), 250 * kL, 1100 * kL) : clamp(lognorm(R, cfg.space * kL, 0.6), 0.15 * cfg.space, 3 * cfg.space));
    }
  }
  // broad faint sheets: the milky part of the veil, wide and very light
  for (let i = 0; i < cfg.sheets.n; i++) {
    const tt = U(R, cfg.sheets.t[0], cfg.sheets.t[1]);
    const len = lognorm(R, cfg.sheets.len, 0.3) * kLen(tt);
    const th = lognorm(R, cfg.sheets.th, 0.25) * kTh(tt);
    push(streak(R, { cx: U(R, 0, W), cy: yOf(tt), len, th, pk: U(R, cfg.sheets.pk[0], cfg.sheets.pk[1]), angle: bias * 0.3 + gauss(R) * 1, most: 6 }), R() - 1);
  }
  // free strata: thin, long and faint, alone between the wisps (the striped look of the pale band)
  for (let i = 0; i < cfg.fibres.n; i++) {
    const tt = U(R, cfg.fibres.t[0], cfg.fibres.t[1]);
    const len = lognorm(R, cfg.fibres.len, 0.35) * kLen(tt);
    const th = lognorm(R, cfg.fibres.th, 0.25) * kTh(tt);
    push(streak(R, { cx: U(R, 0, W), cy: yOf(tt), len, th, pk: U(R, cfg.fibres.pk[0], cfg.fibres.pk[1]), angle: (bias + gauss(R) * cfg.tilt) * Math.sqrt(kLen(tt)), most: 6, breakup: 0.4 }), R());
  }
  els.sort((p, q) => p.z - q.z);
  return els.map((o) => o.e);
}

// ---------- SVG of a band ----------
const r1 = (v) => (Math.abs(v) < 20 ? (Math.round(v * 10) / 10).toString() : Math.round(v).toString());
function ellipseSvg([x, y, rx, ry, rot, al], dx = 0) {
  const X = Math.round(x + dx);
  const Y = Math.round(y);
  const r = Math.round(rot * 10) / 10;
  const tr = r ? ` transform="rotate(${r} ${X} ${Y})"` : '';
  return `<ellipse cx="${X}" cy="${Y}" rx="${r1(rx)}" ry="${r1(ry)}" fill-opacity="${al.toFixed(3)}"${tr}/>`;
}

// vertical fade of a band, by t: [[t, mask], ...]
export function bandSvg(name, cfg, els, lit) {
  const id = cfg.id;
  const [y0, y1] = cfg.box;
  const fade = pchip(cfg.fade);
  const fstops = adaptiveStops((u) => [255, 255, 255, fade(tOf(lerp(y0, y1, u)))], 0.5)
    .map(([u, c]) => `<stop offset="${u.toFixed(4)}" stop-color="#fff" stop-opacity="${c[3].toFixed(3)}"/>`)
    .join('');
  // the tile is periodic: written once, unclipped, and shown four times (x -2400, 0, 2400, 4800) inside the 4800-wide
  // image, so whatever spills over a seam is supplied by the neighbouring copy (no clip, no seam duplicates)
  const body = [];
  for (const e of els) {
    if (e[1] + e[3] * 1.2 < y0 || e[1] - e[3] * 1.2 > y1) continue;
    body.push(ellipseSvg([((e[0] % W) + W) % W, ...e.slice(1)]));
  }
  const h = y1 - y0;
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 ${y0} ${2 * W} ${h}" width="${2 * W}" height="${h}">
<defs>${gradientDef(`${id}g`, 0.5 - lit)}
<linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}">${fstops}</linearGradient>
<mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="${y0}" width="${2 * W}" height="${h}"><rect y="${y0}" width="${2 * W}" height="${h}" fill="url(#${id}f)"/></mask>
<g id="${id}t" fill="url(#${id}g)">
${body.join('\n')}
</g></defs>
<g mask="url(#${id}m)"><use xlink:href="#${id}t" x="-${W}"/><use xlink:href="#${id}t"/><use xlink:href="#${id}t" x="${W}"/><use xlink:href="#${id}t" x="${2 * W}"/></g>
</svg>
`,
    n: body.length,
  };
}

// Local alpha ceiling: render the band (tile, fade mask included), find the spots above `cap`; every ellipse that
// covers a spot with its core (r < .6) is scaled once by (cap / alpha there)^1.2, the smallest factor of its spots;
// repeat until no spot is left (a few passes). Ellipses away from the spots keep their value. Returns how many
// ellipses were lowered.
function capAlpha(name, cfg, els, lit, cap) {
  const [y0, y1] = cfg.box;
  const sc = 0.5;
  const lowered = new Set();
  for (let it = 0; it < 6; it++) {
    const { svg } = bandSvg(name, cfg, els, lit);
    const r = renderCrop(svg, [0, y0, W, y1], sc);
    const hot = [];
    for (let i = 3; i < r.px.length; i += 4) {
      const al = r.px[i] / 255;
      if (al > cap) {
        const p = (i - 3) / 4;
        hot.push([(p % r.w) / sc, y0 + Math.floor(p / r.w) / sc, (cap / al) ** 1.2]);
      }
    }
    if (!hot.length) break;
    for (const [k, e] of els.entries()) {
      const [ex, ey, rx, ry, rot] = e;
      const ca = Math.cos((rot * Math.PI) / 180);
      const sa = Math.sin((rot * Math.PI) / 180);
      const xx = ((ex % W) + W) % W;
      let f = 1;
      for (const [px, py, fh] of hot) {
        if (fh >= f) continue;
        for (const o of [-W, 0, W]) {
          const dx = px - xx - o;
          const dy = py - ey;
          const u = (dx * ca + dy * sa) / rx;
          const v = (-dx * sa + dy * ca) / ry;
          if (u * u + v * v < 0.36) {
            f = fh;
            break;
          }
        }
      }
      if (f < 1) {
        e[5] *= f;
        lowered.add(k);
      }
    }
  }
  return lowered.size;
}

// ---------- the two bands ----------
// z1, the streaks of the top of the lower third; z2, thin veils that whiten the horizon's edge, slower.
// Sizes in world units at t .70 (scaled by perspective), alpha = peak of one link before the chain's sum.
export const BANDES = {
  haut: {
    id: 'vh',
    salt: 1,
    box: [300, 730],
    t0: [0.58, 0.62],
    t1: 0.87,
    gap: 0.1,
    tiltBias: 3,
    tilt: 2.5,
    wisp: { len: 600 },
    body: { p: 0.85, th: 60, pk: [0.12, 0.2] },
    fil: { m: 6, th: 11, pk: [0.16, 0.28] },
    fine: { pk: [0.08, 0.15] },
    space: 70,
    breaks: 0.2,
    sheets: { n: 3, t: [0.66, 0.82], len: 1300, th: 120, pk: [0.05, 0.08] },
    fibres: { n: 12, t: [0.6, 0.86], len: 500, th: 7, pk: [0.06, 0.1] },
    // nothing above t .50, full from .60 to .72, .5 at .85, .2 at .95, 0 at the horizon (voiles.md)
    fade: [[0, 0], [0.5, 0], [0.555, 0.35], [0.6, 0.85], [0.64, 1], [0.72, 1], [0.79, 0.78], [0.85, 0.5], [0.9, 0.31], [0.95, 0.17], [0.98, 0.07], [1, 0], [1.2, 0]],
    duree: 420,
  },
  bas: {
    id: 'vb',
    salt: 2,
    box: [470, 740],
    t0: [0.76, 0.79],
    t1: 0.97,
    gap: 0.065,
    tiltBias: 1,
    tilt: 1.5,
    wisp: { len: 800 },
    body: { p: 0.6, th: 45, pk: [0.08, 0.14] },
    fil: { m: 4, th: 9, pk: [0.1, 0.18] },
    fine: { pk: [0.07, 0.13] },
    space: 90,
    breaks: 0.3,
    sheets: { n: 5, t: [0.82, 0.95], len: 1600, th: 80, pk: [0.05, 0.09] },
    fibres: { n: 14, t: [0.8, 0.95], len: 900, th: 6, pk: [0.05, 0.1] },
    // the lowest veils fade later and keep 10-40 % of their contrast in the last tenth (voiles.md)
    fade: [[0, 0], [0.66, 0], [0.71, 0.4], [0.76, 0.9], [0.8, 1], [0.86, 0.8], [0.92, 0.5], [0.96, 0.3], [0.99, 0.15], [1, 0.12], [1.2, 0.12]],
    duree: 660,
  },
};

// ---------- command line ----------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const seed = Number(a.includes('--seed') ? a[a.indexOf('--seed') + 1] : 5);
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'out');
  mkdirSync(dir, { recursive: true });
  const scene = existsSync(join(dir, 'scene.json')) ? JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8')) : {};
  const nuages = [];

  for (const [name, cfg] of Object.entries(BANDES)) {
    const tm = tOf((cfg.box[0] + cfg.box[1]) / 2);
    const eDeg = (Math.atan(elev(tm)) * 180) / Math.PI;
    const L = litEdge(eDeg);
    // focal shift of the shared gradient (bounding-box units, radius .5): the peak moves up by `shift` sigma of the
    // section, sigma = SIG x ry and ry = .5 of the box
    const lit = L.shift * SIG * 0.5;
    const els = band(seed, cfg);
    // never #fff: where stacked wisps would pass alpha .42, the ellipses whose core covers the spot are lowered
    const capped = capAlpha(name, cfg, els, lit, Number(process.env.CAP || 0.42));
    const { svg, n } = bandSvg(name, cfg, els, lit);
    writeFileSync(join(dir, `voiles-${name}.svg`), svg);
    const yTop = cfg.box[0];
    nuages.push({
      src: `voiles-${name}.svg`,
      rang: name === 'haut' ? 'hauts' : 'bas',
      boucle: true,
      y: Math.round((yTop / 1350) * 10000) / 100,
      t: cfg.duree,
      d: -Math.round(U(rng(seed + cfg.salt), 0, cfg.duree)),
      lumiere: lumiere(yOf(tm)),
    });

    console.log(`voiles-${name}.svg: ${n} ellipses, ${svg.length} octets, ${capped} abaissees (plafond .42) ; bord soleil calcule a e ${eDeg.toFixed(1)} deg : pic decale de ${L.shift.toFixed(3)} sigma vers le haut, contraste x${L.contrast.toFixed(2)} (fy ${(0.5 - lit).toFixed(3)})`);
  }
  scene.nuages = nuages;
  writeFileSync(join(dir, 'scene.json'), `${JSON.stringify(scene, null, 1)}\n`);
  console.log('scene.json : cle nuages remplacee (' + nuages.map((n) => `${n.src} ${n.t} s`).join(', ') + ')');
  // mean opacity of the veils by height (one period of each band = its time average), light mask included:
  // ciel.mjs takes it out of the sky (out/voiles-moyenne.json)
  const sc = 0.25;
  const acc = { w: 600, h: Math.round(HORIZON * sc), px: new Uint8Array(600 * Math.round(HORIZON * sc) * 4) };
  for (const n of nuages) {
    const layer = renderCrop(readFileSync(join(dir, n.src), 'utf8'), [0, 0, W, HORIZON], sc);
    for (let x = 0; x < layer.w; x++) {
      const xp = ((x + 0.5) / layer.w) * 100;
      const L = n.lumiere;
      let j = 0;
      while (j < L.length - 2 && xp > L[j + 1][0]) j++;
      const f = L[j][1] + (L[j + 1][1] - L[j][1]) * clamp((xp - L[j][0]) / (L[j + 1][0] - L[j][0]));
      for (let y = 0; y < layer.h; y++) for (let c = 0; c < 4; c++) layer.px[(y * layer.w + x) * 4 + c] *= f;
    }
    over(acc, layer);
  }
  // per-row means, then smoothed over +-.05 of t (a few banks make a lumpy mean; the sky takes out a smooth one)
  const rowMean = [];
  for (let y = 0; y < acc.h; y++) {
    let s = 0;
    for (let x = 0; x < acc.w; x++) s += acc.px[(y * acc.w + x) * 4 + 3];
    rowMean.push(s / acc.w / 255);
  }
  const hw = Math.round(0.05 * acc.h);
  const prof = [];
  for (let k = 0; k <= 40; k++) {
    const y = Math.round((k / 40) * (acc.h - 1));
    let s = 0;
    let wsum = 0;
    for (let d = -2 * hw; d <= 2 * hw; d++) {
      const yy = y + d;
      if (yy < 0 || yy >= acc.h) continue;
      const w = Math.exp(-(d * d) / (2 * hw * hw));
      s += rowMean[yy] * w;
      wsum += w;
    }
    prof.push([Math.round((k / 40) * 1000) / 1000, Math.round((s / wsum) * 10000) / 10000]);
  }
  writeFileSync(join(dir, 'voiles-moyenne.json'), `${JSON.stringify({ couleur: VCOL, profil: prof })}\n`);
  console.log('voiles-moyenne.json : opacite moyenne ' + prof.filter((q, i) => i % 4 === 0).map(([t, v]) => `t${t} ${v.toFixed(3)}`).join(' '));
}
