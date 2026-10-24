// Hummingbird hawk-moth (Macroglossum stellatarum): a broad furry body, grey-brown above and white below, the white face, big
// dark eyes, clubbed and hooked antennae, the abdomen with white and black flank patches and a fan-shaped tail tuft; narrow
// grey-brown forewings crossed by dark wavy lines, orange hindwings with a dark border. It feeds hovering in front of the
// flower, its proboscis unrolled; at rest its wings lie in a low roof, the forewings over the hindwings.
// The four wing faces are measured on the spread specimen of MHNT (porteur 2026-10-23, « contours extraits »): the upper side on
// c186, the underside on c188 (85.2 px/mm on their 1 cm bar), by outils/aile.py plat (zones, tones, dust, fringe), calibrated
// against the flattened photos with aile.py paire and poudre.py (ETAT.md). Wing frame: s outward from the hinge, perpendicular
// to the body axis; q toward the head; mm. The body is measured on the same specimen (grids by plat_corps.py) and on the
// living c014, c037, c073, c074, c076 and c153 (ETAT.md).
import { readFileSync, existsSync } from 'node:fs';
import { flapAxes } from '../moteur/papillon.mjs';
import { motif, loadMotif, lab2hex } from '../moteur/motif.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { frame0, env, pitched, ik, articleLeg, fringe } from '../moteur/kit.mjs';
import { add, sub, mul, norm, dot, cross, rad, rng, camera, tiltCam } from '../moteur/geo.mjs';

// ---------------------------------------------------------------------------------------------------------------
// Wings
// ---------------------------------------------------------------------------------------------------------------
const recUrl = (n) => new URL(`./ailes/${n}.json`, import.meta.url);
const rec = (n) => (existsSync(recUrl(n)) ? loadMotif(recUrl(n)) : null);
const R_FU = rec('avant-dessus'), R_FD = rec('avant-dessous'), R_HU = rec('arriere-dessus'), R_HD = rec('arriere-dessous');
// The underside is the same specimen seen from below, its right wings: aile.py fitted one outline on the other (alignement: the
// scale and turn that bring the face seen whole onto the face completed from it). U: underside record -> upper frame.
const aF = R_FD?.alignement, aH = R_HU?.alignement;
const U_F = aF ? { k: 1 / aF.echelle, rot: -aF.angle } : { k: 1, rot: 0 };
const U_H = aH ? { k: aH.echelle, rot: aH.angle } : { k: 1, rot: 0 };
const E = rec('etalonnage') || {};
// a dried specimen keeps its colours here (grey-brown scales, no black field): no `live` correction (ETAT.md)
// the fringe's palette (aile.py frange, 0.1 mm inside the edge) takes in the white plate where the fringe is thin: a colour over
// L* 80 there is the plate, not the fringe (the moro's palest fringe, the hindwing's yellow one, reads L* 71 to 78 on c186): it
// gives way to the nearest darker colour of the palette
function cleanFringe(R) {
  const F = R.frange; if (!F) return R;
  const pal = [...new Set(F.couleurs)], L = (h) => hex2lab(h)[0];
  const ok = pal.filter((h) => L(h) <= 80).sort((x, y) => L(y) - L(x));
  const map = Object.fromEntries(pal.map((h) => [h, L(h) <= 80 ? h : ok[0] ?? h]));
  return { ...R, frange: { ...F, couleurs: F.couleurs.map((h) => map[h]) } };
}
const face = (R, seed, key, U = {}) => (R ? motif(cleanFringe(R), { seed, dustK: E[key], fringe: 0, ...U }) : null);   // no fringe stroke: it drew a pale halo (judge)
const M_FU = face(R_FU, 11, 'avant-dessus'), M_FD = face(R_FD, 12, 'avant-dessous', U_F);
const M_HU = face(R_HU, 13, 'arriere-dessus'), M_HD = face(R_HD, 14, 'arriere-dessous', U_H);

// The scales as fibres (outils/fibres.py): long narrow scales running out from the hinge, their direction, contrast, length and
// width measured per cell of 0.6 mm on each flattened face. Each scale a short stroke laid along the measured direction (the field
// interpolated between the cells, so no cell edge shows), lighter or darker than the zone under it in soft-light (the hue kept),
// its opacity by the cell's contrast level, calibrated against the photo's grain (fibres.py --etalonne). Their number follows the
// size on screen (none under 8 px/mm, where a scale is under a pixel): one path per level and tone. Numbers only, no pixel.
const fib = (n) => (existsSync(recUrl(n + '-fibres')) ? loadMotif(recUrl(n + '-fibres')) : null);
function fibres(F, seed, U = { k: 1, rot: 0 }) {
  if (!F) return () => '';
  const c = F.cellule, [s0, q1] = F.origine;
  const grid = new Map();
  for (const x of F.cases) grid.set(`${x[0]},${x[1]}`, x);
  const at = (s, q) => grid.get(`${Math.floor((s - s0) / c)},${Math.floor((q1 - q) / c)}`);
  // the direction field: doubled angles averaged over the four nearest cells (an axis, not a vector)
  const dirAt = (s, q) => {
    const fx = (s - s0) / c - 0.5, fy = (q1 - q) / c - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy);
    let cx = 0, cy = 0;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const g = grid.get(`${x0 + dx},${y0 + dy}`);
      if (!g) continue;
      const w = (dx ? fx - x0 : 1 - (fx - x0)) * (dy ? fy - y0 : 1 - (fy - y0)), a = (2 * g[2] * Math.PI) / 180;
      cx += w * Math.cos(a); cy += w * Math.sin(a);
    }
    return Math.atan2(cy, cx) / 2;
  };
  const cache = new Map();
  const r3 = (x) => Math.round(x * 1000) / 1000;
  return (sc) => {
    if (sc.k < 8) return '';
    const kk = Math.min(1, sc.k / 30), key = Math.round(kk * 10);
    if (!cache.has(key)) {
      // fine strokes (at most 0.035 mm: wider ones read as brush touches on the silky underside, judge)
      const R = rng(seed * 7919 + key), l = F.longueur, w = Math.min(0.035, Math.max(0.022, F.largeur * 0.55)) / Math.sqrt(kk);
      // scales overlap like shingles: about half the surface carries a stroke lighter or darker than its zone
      const dens = (0.5 / (l * w)) * kk;
      const xs = F.cases.map((x) => x[0]), ys = F.cases.map((x) => x[1]);
      const S0 = s0 + Math.min(...xs) * c, S1 = s0 + (Math.max(...xs) + 1) * c, Q1 = q1 - Math.min(...ys) * c, Q0 = q1 - (Math.max(...ys) + 1) * c;
      const n = Math.round(dens * (S1 - S0) * (Q1 - Q0));
      const P = { };
      for (let i = 0; i < n; i++) {
        const s = S0 + R() * (S1 - S0), q = Q0 + R() * (Q1 - Q0), g = at(s, q);
        if (!g) continue;
        const a = dirAt(s, q) + ((R() - 0.5) * 12 * Math.PI) / 180, ll = l * (0.6 + 0.8 * R());
        const ux = (Math.cos(a) * ll) / 2, uy = (Math.sin(a) * ll) / 2, tone = R() < 0.5 ? 'l' : 'd', k2 = `${g[7]}${tone}`;
        P[k2] = (P[k2] || '') + `M${r3(s - ux)} ${r3(q - uy)}l${r3(2 * ux)} ${r3(2 * uy)}`;
      }
      cache.set(key, { P, w });
    }
    const { P, w } = cache.get(key);
    let out = '';
    for (const [k2, d] of Object.entries(P)) {
      const lv = +k2[0], a = Math.min(1, (F.niveaux[lv] / 14) * (F.k?.[lv] ?? 1));
      out += `<path d="${d}" stroke="${k2[1] === 'l' ? '#fff' : '#000'}" stroke-width="${r3(w)}" stroke-opacity="${Math.round(a * 100) / 100}"/>`;
    }
    out = `<g fill="none" stroke-linecap="round" style="mix-blend-mode:soft-light">${out}</g>`;
    return U.k === 1 && !U.rot ? out : `<g transform="rotate(${Math.round(U.rot * 100) / 100}) scale(${Math.round(U.k * 1e4) / 1e4})">${out}</g>`;
  };
}
const F_FU = fibres(fib('avant-dessus'), 21), F_FD = fibres(fib('avant-dessous'), 22, U_F);
const F_HU = fibres(fib('arriere-dessus'), 23), F_HD = fibres(fib('arriere-dessous'), 24, U_H);
const withTop = (fb, M) => (sc, up) => fb(sc) + (M.top ? M.top(sc, up) : '');

const wing = (U, D, under, fu, fd) => (U && D ? {
  span: U.length, opaque: true, outline: U.outline, box: U.box, base: U.base, baseUnder: D.base,
  paint: U.paint, paintUnder: D.paint, top: withTop(fu, U), topUnder: withTop(fd, D), under,
  // no grain filter (porteur: no grain): the scales' texture is the measured fibres; the zones' edges soft as the scales blur
  // them (0.04 mm, about one scale's width)
  soft: 0.025, grain: 0, veins: null, sheen: '#f6f1e6',
} : null);
const FORE = wing(M_FU, M_FD, U_F, F_FU, F_FD), HIND = wing(M_HU, M_HD, U_H, F_HU, F_HD);

// ---------------------------------------------------------------------------------------------------------------
// The body. Frame: x forward, y to the left, z up, mm; the origin on the axis at the forewings' hinge line.
// Lengths on the spread specimen c186 (85.2 px/mm, the forewings' hinge line at y = 815 px): the frons tuft at x 5.26, the
// thorax from 1.94 to -5.7 (its fur 7.1 mm across), the abdomen to -14.3 and its tail tuft to -16.7 (body 21.9 mm). The width
// of the living abdomen from c037 (5.2 mm: the spread specimen's is pressed to 7.2 mm). The head from the macros with a scale
// bar: c074 (profile, 135.4 px/mm), c076 (front, 157.6 px/mm), c073 (eye, 457 px/mm): eyes 1.5 to 2 mm across, the head 4.9
// mm wide over the eyes, the antennae 10.6 mm long, their bases 2.9 mm apart, the club 0.6 mm thick from 1 to 5 mm before
// the hooked tip. The proboscis 25 to 28 mm (Faucheux 2013).
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation.
// ---------------------------------------------------------------------------------------------------------------
const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
// The specimen's pale scales have yellowed (the abdomen's flank patches: b* 25 on c186): on the living they are white (c153: L* 78,
// b* 7; c037, c014). Every cell over L* 60 keeps 30 % of its chroma above that white; the darker cells are left as measured.
function hex2lab(h) {
  const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((u) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)));
  const X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], Z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
const whiten = (G) => ({ ...G, rows: G.rows.map((r) => r.map((h) => { const [L, a, bb] = hex2lab(h); if (L < 60) return h; const w = Math.min(1, (L - 60) / 8);
  return lab2hex(L, a * (1 - 0.7 * w), bb - (bb - 7) * 0.7 * w); })) });
// the thorax's grey-brown flanks reach lower than the dorsal flattening shows (c153, c014: the white is the chest only): the
// dorsal columns stretched 45° below the equator
const lowerFlank = (G, sh) => ({ ...G, rows: G.rows.map((r) => r.map((_, j) => { const n = r.length, u = j / (n - 1), m = 0.5 - sh;
  const v = u < m ? (u * 0.5) / m : 0.5 + ((u - m) * 0.5) / (0.5 + sh); return r[Math.min(n - 1, Math.round(v * (n - 1)))]; })) });
const G_HEAD = grid('tete'), G_THX = lowerFlank(whiten(grid('thorax')), 0.25), G_ABD = whiten(grid('abdomen'));   // plat_corps.py + grille_corps.py, c186 / c188
const pick = (R, a) => a[Math.floor(R() * a.length) % a.length];
// hair colours read on the photos: the grey-brown fur of the back (c186, c037), the white of the face and chest (c188, c073)
const FUR = ['#5e5647', '#6d6555', '#7d7563', '#4c463b'], WHITE = ['#ece8de', '#e2ddd0', '#f4f1ea', '#d4cfc2'];
const LEGMAT = { ks: 0.35, p: 50, ks2: 0.06, p2: 6, env: 0.25, mottle: 0.05, specColor: '#fff4e6' };
// the eye: satin dark brown, its facets seen in close-up (c073); the pseudopupil, the facets that look at the camera, darker
const EYEMAT = { ks: 0.3, p: 60, ks2: 0.1, p2: 7, env: 0.25, wrap: 0.12, amb: 0.3, mottle: 0.04, specColor: '#f2eee6' };

export const B = {
  // the head sunk into the thorax's fur, a cone forward (c186): no neck shows
  head: [3.1, 0, -0.05], headR: [2.0, 1.85], eye: [2.9, 1.22, -0.25], eyeR: 0.78,
  antBase: [3.15, 1.15, 1.45], antLen: 10.6,
  thorax: [1.6, -5.2], thoraxR: [3.0, 2.8], thoraxZ: 0.4,
  abdomen: [-3.6, -14.3], abdomenR: [2.65, 2.4], tuft: 2.4,
  proboscis: 25,
  hingeFore: [0, 3.05, 1.05], hingeHind: [-2.17, 3.0, 0.85],
};

function head(sc, pose) {
  sc.part = 'tete';
  // the capsule under its scales: grey-brown crown, white frons and cheeks (grid of c186 and c188)
  drawBody(sc, {
    name: 'head', frame: frame0(B.head), color: '#6a6252', seed: 11, grid: G_HEAD, mat: { ks: 0.06, p: 14, env: 0.04, wrap: 0.35 },
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.5); return { x: -1.5 + 3.1 * t, zc: 0.1 * t, ry: B.headR[0] * e, rz: B.headR[1] * e }; },
    hair: { n: 1500, len: 0.5, w: 0.02, lean: 0.55, a: 0.85, droop: 0.4, twist: 0.7, fleece: 0.3, pile: 0.5, color: 'grid', gridK: 1.0,
      // the frons tuft, longer between the antennae (c074, c186)
      // and the scales of the vertex over the eyes' upper half (c037, c186: the eyes half hidden from above; judge 2026-10-24)
      lenAt: (t, th) => (t > 0.7 && Math.sin(th) > -0.2 ? 1.5 : Math.sin(th) > 0.2 && Math.abs(Math.cos(th)) > 0.45 ? 1.6 : t < 0.2 ? 1.6 : 1) },
  });
  for (const s of [1, -1]) {
    const o = [B.eye[0], B.eye[1] * s, B.eye[2]], R = B.eyeR;
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    // the dark spot of the facets aimed at the viewer (seen on c014, c066, c068): where the eye's normal meets the camera
    const c = sc.cam.c;
    drawBody(sc, {
      name: 'eye', frame: frame0(o), color: '#2c241a', seed: 15 + s, mat: EYEMAT, facets: 0.022, bias: 0.05,
      profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: R * (2 * t - 1), zc: 0, ry: R * q, rz: R * q }; },
      albedo: (t, th) => {
        const x = 2 * t - 1, q = Math.sqrt(Math.max(0, 1 - x * x)), n = [x, q * Math.cos(th), q * Math.sin(th)];
        const f = Math.max(0, (dot(n, c) - 0.86) / 0.14);
        return f > 0 ? mixHex('#5a4632', '#0d0b09', Math.min(1, f * 1.6)) : '#5a4632';
      },
    });
    // the labial palps: broad, clothed in white scales, meeting under the face, their outer lower edge dark (c073, c076)
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    drawBody(sc, {
      name: 'palp', frame: pitched([3.55, 0.48 * s, -1.05], 22), color: '#d9d3c5', seed: 17 + s, mat: { ks: 0.04, p: 10, env: 0.02, wrap: 0.4 },
      profile: (t) => { const e = Math.pow(env(t, 0.45, 0.6) * 2.1, 0.7); return { x: -0.4 + 2.15 * t, zc: 0, ry: 0.55 * e, rz: 0.72 * e }; },
      albedo: (t, th) => (Math.cos(th) * s > 0.55 && Math.sin(th) < 0.1 ? '#5a554c' : '#d6d0c2'),
      hair: { n: 260, len: 0.32, w: 0.02, lean: 0.9, a: 0.9, pile: 0.4, fleece: 0.4, color: (t, th, R) => (Math.cos(th) * s > 0.6 && Math.sin(th) < 0 ? pick(R, ['#55504a', '#3e3a34', '#bdb8ac']) : pick(R, WHITE)) },
      bias: 0.06,
    });
    // antennae: dark grey-brown, thickening to a spindle club and ending in a fine hook (c074, c076, c037)
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const pts = [[B.antBase[0], B.antBase[1] * s, B.antBase[2]]];
    let d = norm([0.86, 0.4 * s, 0.32]), p = pts[0];
    const n = 26, hookAt = 0.94;
    for (let i = 0; i < n; i++) {
      const f = i / n;
      p = add(p, mul(d, B.antLen / n)); pts.push(p);
      d = norm(add(d, f > hookAt ? [-0.35, 0.3 * s, -0.25] : f > 0.55 ? [0.0, 0.004 * s, -0.02] : [0.0, 0.0, -0.012]));
    }
    // radius: 0.11 at the base, the club widest (0.29) from 0.55 to 0.9 of the length, the hook thin
    // the club thick to its end (c074: 0.55 to 0.6 mm across the flattened male club, seen edge on 0.4: c153), then the short hook
    const rr = pts.map((_, i) => { const f = i / n; return f < 0.3 ? 0.09 : f < 0.6 ? 0.09 + 0.12 * (f - 0.3) / 0.3 : f < 0.94 ? 0.21 : 0.21 - 0.12 * Math.min(1, (f - 0.94) / 0.06); });
    // grey-brown, white-scaled at the base (c076), the club darker (c074)
    drawTube(sc, pts, rr, { color: (i) => (i < 3 ? '#8a8272' : i < 10 ? '#5a534a' : '#38332d'), gloss: 0.25, bias: 0.02 });
  }
}

// The proboscis: coiled in a flat spiral between the palps at rest and in transit; unrolled to feed, 25 mm, leaving the head
// forward and down (the body pitched up 32° in hover, c153) so that it reaches the corolla nearly level, bending down a little
// at its tip (c153, c011).
export function proboscisPath(pose) {
  const P = [];
  if (pose === 'butine') {
    let p = [4.55, 0, -1.25], d = norm([0.82, 0, -0.57]);
    const n = 30, L = B.proboscis;
    P.push(p);
    for (let i = 0; i < n; i++) { p = add(p, mul(d, L / n)); P.push(p); d = norm(add(d, [0, 0, i < n * 0.3 ? 0.012 : -0.024])); }
  } else {
    const c = [4.6, 0, -1.55], turns = 2.4, N = 54;
    P.push([4.35, 0, -1.05]);
    for (let i = 0; i <= N; i++) {
      const f = i / N, a = Math.PI * 0.55 + f * turns * 2 * Math.PI, r = 0.62 * (1 - 0.78 * f);
      P.push([c[0] + r * Math.cos(a), 0, c[2] + r * Math.sin(a)]);
    }
  }
  return P;
}
function proboscis(sc, pose) {
  sc.part = 'trompe';
  const P = proboscisPath(pose);
  drawTube(sc, P, P.map((_, i) => 0.12 - 0.06 * (i / P.length)), { color: '#191510', gloss: 0.55, bias: 0.03 });
}

function thorax(sc) {
  sc.part = 'thorax';
  const [x0, x1] = B.thorax, L = x0 - x1, [ry, rz] = B.thoraxR;
  drawBody(sc, {
    name: 'thorax', frame: frame0([x1, 0, B.thoraxZ]), color: '#5a5446', seed: 21, grid: G_THX, mat: { ks: 0.05, p: 12, env: 0.04, wrap: 0.4 },
    // blunt at both ends, as the fur rounds it (c186 from above, c153 and c014 in profile)
    profile: (t) => { const e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1.08), 2.6)), 0.5); return { x: L * t, zc: 0.25 * Math.sin(Math.PI * t), ry: ry * e, rz: rz * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.9 : 1],
    // the thick fur in the colours of its grid: grey-brown above, white beneath (c186, c188, c014)
    hair: { n: 7500, len: 1.0, w: 0.022, lean: 0.95, a: 0.88, droop: 0.8, twist: 0.6, wave: 0.12, curl: 0.18, fleece: 0.1, pile: 0.5, locks: 0.3,
      sheen: 0.04, sheenP: 40, color: 'grid', gridK: 1.0, lenAt: (t, th) => (t > 0.85 ? 0.75 : t < 0.18 ? 1.7 : Math.sin(th) < -0.3 ? 1.2 : 1) },   // the rear fur over the abdomen's base
  });
  // the tegulae: long-haired scales over the forewings' bases, grey-brown like the back (c186: they hide the hinges)
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegula-g' : 'tegula-d';
    drawBody(sc, {
      name: 'tegula', frame: pitched([-0.6, 2.05 * s, 1.85], -10), color: '#5e5748', seed: 23 + s,
      profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -1.9 + 3.6 * t, zc: 0, ry: 0.7 * e, rz: 0.4 * e }; },
      // olive-brown like the back, lying flat, small (judges: no grey tufts at the wings' bases)
      hair: { n: 500, len: 0.6, w: 0.022, lean: 1.25, a: 0.85, droop: 1.0, twist: 0.6, fleece: 0.1, pile: 0.3, color: (t, th, R) => pick(R, ['#5a523e', '#4e4736', '#665c46', '#433d2e']) },
      bias: 0.06,
    });
  }
}

function abdomen(sc, pose) {
  sc.part = 'abdomen';
  const [x0, x1] = B.abdomen, L = x0 - x1, [Ry, Rz] = B.abdomenR;
  // in flight the abdomen hangs a little more (c153: the tail lower than the body's line)
  const droop = pose === 'pose' ? -3 : -9;
  const F = pitched([x1, 0, 0.0], droop);
  drawBody(sc, {
    name: 'abdomen', frame: F, color: '#4a4438', seed: 31, grid: G_ABD, mat: { ks: 0.015, p: 10, env: 0, ks2: 0.005, wrap: 0.4, mottle: 0.1 },
    // t from the tip (0) to the base (1): broad, widest at two thirds, rounded at the tip under the tuft
    profile: (t) => {
      // its base slips under the thorax's fur, narrowing (no seam: the thorax rounds over it)
      const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.55)), 0.55), b = t > 0.72 ? 1 - 0.38 * ((t - 0.72) / 0.28) ** 2 : 1;
      const e = Math.max(0.2, a * b);
      return { x: L * t, zc: 0.15 * (1 - t), ry: Ry * e, rz: Rz * e };
    },
    // dense short pile; the flank patches are tufts of longer scales standing out sideways (c188, c185, c037)
    // a dense pile of scales, not a smooth tube (judge 2026-10-24)
    hair: { n: 6500, len: 0.5, w: 0.02, lean: 1.15, a: 0.88, fleece: 0.15, pile: 0.7, sheen: 0.01, color: 'grid', gridK: 1.0,
      lenAt: (t, th) => (Math.abs(Math.cos(th)) > 0.9 && Math.sin(th) < 0.1 && t > 0.25 && t < 0.62 ? 1.4 : t > 0.85 && Math.sin(th) > 0 ? 2.4 : 1) },
  });
  // the tail tuft: a flat fan of long dark scales, spread sideways, pale-tipped at its edges (c037, c186, c188)
  const tip = add(F.o, mul(F.ax, 0.15));
  drawBody(sc, {
    name: 'tuft', frame: { o: add(tip, mul(F.ax, -B.tuft * 0.55)), ax: F.ax, ay: F.ay, az: F.az }, color: '#2d2922', seed: 33,
    mat: { ks: 0.03, p: 10, env: 0.02, wrap: 0.45 },
    // a brush tapering back from the abdomen's end (c186, c037), not a ball
    profile: (t) => { const e = Math.pow(Math.min(1, t * 2.5), 0.5) * (0.55 + 0.45 * t); return { x: B.tuft * 0.95 * t, zc: 0, ry: 1.7 * e + 0.2, rz: 0.6 * e }; },
    // compact, brown-black, pale at its sides (judge: not a broom)
    hair: { n: 1800, len: 1.05, w: 0.022, lean: 1.4, a: 0.9, droop: 0.15, twist: 0.25, fleece: 0, pile: 0.4,
      color: (t, th, R) => (Math.abs(Math.cos(th)) > 0.85 && R() < 0.35 ? pick(R, ['#cfc9bb', '#9a9384']) : pick(R, ['#2e281f', '#3b3428', '#252019', '#4d4436'])),
      lenAt: (t) => (t < 0.45 ? 1.25 : 0.8) },
    bias: -0.02,
  });
}

// Legs: six walking legs, the femora clothed in long white hairs, the tibiae grey-white, the tarsi grey-brown ringed with pale
// scales and spined (c014, c046, c188). Lengths estimated on c188 and c014 against the body (ETAT.md: not measured on a bar).
const LEGS = {
  front: { coxa: [2.2, 0.55, -2.0], fem: 3.0, tib: 2.6, tar: 4.0 },
  mid: { coxa: [0.4, 0.7, -2.2], fem: 3.4, tib: 3.6, tar: 4.4 },
  hind: { coxa: [-1.4, 0.65, -2.1], fem: 3.6, tib: 4.0, tar: 4.6 },
};
// standing they show their pale hair (c014, c046); folded in flight they read fine and dark against the body (c153, judge)
const legArt = (fly) => ({
  fem: { r: fly ? [0.12, 0.13, 0.1] : [0.15, 0.16, 0.12], c: fly ? '#6e665a' : '#a9a294', hair: fringe(fly ? 20 : 40, fly ? 0.25 : 0.38, () => (fly ? '#9a9284' : '#ddd8cc'), 0.3) },
  tib: { r: fly ? [0.09, 0.1, 0.085] : [0.12, 0.13, 0.11], c: fly ? '#5e574c' : '#8e877a', hair: fringe(fly ? 14 : 28, 0.2, () => (fly ? '#857d70' : '#c8c2b6'), 0.5) },
  bas: { r: [0.075, 0.07, 0.065], c: '#4a443a', flat: 0.85 },
  tar: { r: 0.055, c: '#433d34' },
});
function legs(sc, pose) {
  const G = -5.3;
  for (const [k, L] of Object.entries(LEGS)) for (const s of [1, -1]) {
    sc.part = `patte-${k}-${s > 0 ? 'g' : 'd'}`;
    const sy = (p) => [p[0], p[1] * s, p[2]];
    const base = sy(L.coxa);
    let ankle, tdir, pole;
    if (pose === 'pose') {
      // standing: the feet a little wider than the body, the knees out and up (c033, c034, c046)
      const foot = sy(k === 'front' ? [6.2, 2.8, G] : k === 'mid' ? [1.4, 3.8, G] : [-4.4, 3.4, G]);
      tdir = norm([k === 'front' ? 0.5 : k === 'mid' ? 0.15 : -0.45, 0.5 * s, -0.7]);
      ankle = sub(foot, mul(tdir, L.tar * 0.9));
      pole = sy([k === 'hind' ? -0.5 : 0.4, 1, 0.9]);
    } else {
      // in flight: folded under the chest, the tarsi trailing back under the abdomen (c153, c154)
      ankle = add(base, [k === 'front' ? -2.2 : k === 'mid' ? -2.8 : -3.4, 0.5 * s, -0.35]);
      tdir = norm([-0.97, 0.04 * s, -0.12]);
      pole = sy([-0.3, 1, 1]);   // the knees up against the chest, hidden in its fur (c153)
    }
    const fb = add(base, [0, 0.3 * s, -0.45]);
    const { knee, ankle: an } = ik(fb, ankle, L.fem, L.tib, pole);
    const q = [fb, knee, an];
    const fr = [0.38, 0.16, 0.15, 0.14, 0.17];
    let pp = an;
    for (const f of fr) { const nx = add(pp, mul(tdir, L.tar * f)); q.push(add(pp, mul(tdir, L.tar * f * 0.5)), nx); pp = nx; }
    const A = legArt(pose !== 'pose');
    A.coxa = { from: [0.1, -0.3, 0.5], r: [0.28, 0.3, 0.2], c: '#d8d3c7', hair: fringe(40, 0.45, () => '#ebe7dd', 0.1) };
    articleLeg(sc, drawBody, drawTube, q, tdir, pp, A, s, LEGMAT);
  }
}

export function sphinxBody(S, sc, pose) {
  head(sc, pose); proboscis(sc, pose); thorax(sc); abdomen(sc, pose); legs(sc, pose);
  sc.part = '';
}

// ---------------------------------------------------------------------------------------------------------------
// Wing attitudes
// ---------------------------------------------------------------------------------------------------------------
// Hovering stroke: the wings beat 77 to 86 times a second (Kihlström et al. 2020, filmed at 600 fps) in a stroke plane about 30°
// off the horizontal (same paper), the body pitched up 32° (c153): in the body frame the plane stands 62° from the body's axis,
// the downstroke running from above the back to forward and below. phi: the wing's angle in that plane (negative: up over the
// back), alpha: the chord's angle from the stroke direction toward the plane's normal (62° lies it flat in the body's plane;
// under 62° the leading edge dips), up: the upstroke (the costa leads backward, the wing turned over).
export const STROKE = { plane: 62, amp: 116 };
export function beatAxes(side, phiDeg, alphaDeg, up = false) {
  const b = rad(STROKE.plane), phi = rad(phiDeg), a = rad(alphaDeg);
  const v = [Math.cos(b), 0, -Math.sin(b)], np = [Math.sin(b), 0, Math.cos(b)], y = [0, side, 0];
  const e1 = norm(add(mul(y, Math.cos(phi)), mul(v, Math.sin(phi))));
  const t = norm(add(mul(y, -Math.sin(phi)), mul(v, Math.cos(phi))));
  const e2 = norm(add(mul(t, (up ? -1 : 1) * Math.cos(a)), mul(np, Math.sin(a))));
  // e2 made orthogonal to e1 (it already is), and the forewing's own sweep forward kept (the record's frame)
  return { e1, e2 };
}
// The traditional fake of a fast beat (DECISIONS): three drawings looping 0 1 2 1, each two wing sets along the arc, the first
// one firmer; the hindwing lags the forewing by 6°. Top: the wings up over the back turning over (pronation); middle: the
// downstroke; bottom: forward and below, turning back (supination).
export const FLIGHT = [
  [{ phi: -56, alpha: 80, a: 0.66 }, { phi: -40, alpha: 58, a: 0.38 }],
  [{ phi: -8, alpha: 42, a: 0.66 }, { phi: 12, alpha: 40, a: 0.38 }],
  [{ phi: 56, alpha: 80, a: 0.66 }, { phi: 42, alpha: 60, a: 0.38, up: true }],
];
// At rest: a low roof, the forewings drawn back over the hindwings (c037, c038, c005).
// c037 (135 px/mm): the forewing's apex 14.7 mm behind its hinge and 6.75 mm out from it, 24.7° off the axis; the apex leaves
// the hinge 16° ahead of the record's s axis, so the wing is drawn back 81°. The hindwing, 66° and lower (-16°), lies under it, beside the abdomen (c037: the abdomen bare; c005: a sliver of
// orange by the abdomen).
export const REST = { flap: -10, sweepFore: 81, sweepHind: 66, flapHind: -16 };

function wingsAt(sc, attitude, frame) {
  if (!FORE || !HIND) return;
  for (const s of [1, -1]) {
    const lr = s > 0 ? 'g' : 'd';
    const fo = [B.hingeFore[0], B.hingeFore[1] * s, B.hingeFore[2]], ho = [B.hingeHind[0], B.hingeHind[1] * s, B.hingeHind[2]];
    if (attitude === 'beat') {
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const f = beatAxes(s, w.phi, w.alpha, w.up), h = beatAxes(s, w.phi + 6, w.alpha, w.up);
        sc.part = `aile-arriere-${lr}`;
        drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, alpha: w.a, bias: -0.02 });
        sc.part = `aile-avant-${lr}`;
        drawWing(sc, FORE, fo, f.e1, f.e2, { side: s, alpha: w.a, bias: 0.02 });
      }
    } else {
      const { flap, sweepFore, sweepHind } = attitude;
      const f = flapAxes(s, flap, sweepFore), h = flapAxes(s, attitude.flapHind ?? flap - 2, sweepHind);
      sc.part = `aile-arriere-${lr}`;
      drawWing(sc, HIND, ho, h.e1, h.e2, { side: s, bias: -0.03 });
      sc.part = `aile-avant-${lr}`;
      drawWing(sc, FORE, fo, f.e1, f.e2, { side: s, bias: 0.03 });
    }
    sc.part = '';
  }
}

// The moth: opts.pose 'vol' (transit, proboscis coiled), 'butine' (hovering at a flower, proboscis unrolled), 'pose' (at rest);
// opts.frame the flight drawing; opts.wings: false for the atlas at rest (its wings are runtime quads), 'etale' spreads them as
// on the specimen; opts.pitch tilts the body head up (the runtime does it for the atlas); opts.flap/sweep give a rest attitude.
export function sphinx(az, el, opts = {}) {
  const { size = 256, k = 6, pose = 'butine', frame = 0, bg = null, detail = 1, idp = '', light, wings = true, pitch = 0 } = opts;
  const cam = tiltCam(camera(az, el, light), pitch);
  const sc = new Scene(cam, k, size / 2, size / 2, 41, idp);
  sc.detail = detail;
  // the spread specimen: legs folded against the body (no stance), proboscis coiled
  sphinxBody(null, sc, pose === 'etale' ? 'vol' : pose);
  if (wings === 'etale' || pose === 'etale') wingsAt(sc, { flap: 0, sweepFore: 0, sweepHind: 0 });
  else if (pose === 'vol' || pose === 'butine') wingsAt(sc, 'beat', frame);
  else if (wings) wingsAt(sc, { ...REST, ...(opts.flap !== undefined ? { flap: opts.flap } : {}), ...(opts.sweep !== undefined ? { sweepFore: opts.sweep, sweepHind: opts.sweepHind ?? opts.sweep * 0.75 } : {}) });
  return sc.svg(size, size, bg);
}

function mixHex(a, b, t) {
  const A = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), Bb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + A.map((v, i) => Math.round(v + (Bb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

export const META = {
  // span: the cell holds the unrolled proboscis, its tip 29.3 mm from the origin (64 mm across)
  id: 'moro-sphinx', bodyMm: 21.9, span: 64, wingspan: 40,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], vol: [0, 1, 2], butine: [0, 1, 2] },
  lod: {
    S: { cell: 56, az: 15, poses: ['pose', 'vol', 'butine'] },
    L: { cell: 112, az: 30, poses: ['pose', 'butine'] },
  },
  // runtime wings at rest: textures baked by outils/ailes.mjs, hinges in the body frame (mm)
  wings: { fore: { hinge: B.hingeFore, span: FORE?.span, sweep: 0 }, hind: { hinge: B.hingeHind, span: HIND?.span, sweep: 0 } },
};
// The atlas: in flight the beating wings are baked in the cell (the fake of DECISIONS), at rest the body only.
export const draw = (az, el, opts = {}) => sphinx(az, el, { ...opts, wings: opts.pose === 'pose' ? false : true });
// Sheets and pairs (gros.mjs): the whole moth, its body pitched up 32° when it hovers, as the runtime holds it (c153).
export const whole = (az, el, opts = {}) => sphinx(az, el, { wings: true, pitch: opts.pose === 'butine' ? 32 : 0, ...opts });
export const WINGS = { fore: FORE, hind: HIND };
