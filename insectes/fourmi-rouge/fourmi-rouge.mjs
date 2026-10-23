// Red ant worker (Myrmica rubra), measured (mesures.json, ETAT.md): a rusty head and mesosoma sculpted with rugae, the head's
// longitudinal (period 0.06 mm), the mesosoma's a coarse mesh (0.145 mm); two short propodeal spines; a waist of two smooth glossy
// nodes, the petiole and the postpetiole; a smooth, very glossy amber gaster with sparse erect hairs; long amber legs.
// Lengths read on the AntWeb workers casent0104804, 0172750, 0922785 (scale bars, outils/echelle.py); the sculpture by its
// spectrum (outils/sculpture.py); the living posture and the colours on the living workers c013, c115, c123, c124 (refs-organes.json).
// Body frame: x forward, y to the left, z up, mm; the origin on the axis at the rear of the mesosoma (the propodeal lobes).
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation (PROTOCOLE §3.6).
// The body is built here, with the kit, and not in moteur/fourmi.mjs (kept for the black garden ant, session 05).
import { readFileSync } from 'node:fs';
import { add, sub, mul, dot, norm, cross, clamp, camera, rng, fmt } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, surf, normalAt } from '../moteur/insecte.mjs';
import { frame0, env, pitched, legChain, tripod, segment, articleLeg, fringe } from '../moteur/kit.mjs';

const MES = JSON.parse(readFileSync(new URL('./mesures.json', import.meta.url), 'utf8'));
const grid = (n) => { try { return JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8')); } catch { return null; } };
// measured colour grids (outils/plat_corps.py + grille_corps.py on the living c013 and c123), flat colours until they exist
// a grid's albedo scaled (étalonnage: outils/delta.py, the render's region against the photos' mean)
const lift = (g, k) => g && { ...g, rows: g.rows.map((r) => r.map((h) => '#' + [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * k)).toString(16).padStart(2, '0')).join(''))) };
// a grid tuned in CIELAB: lightness moved by dL, chroma scaled by kC (the hue kept)
const toLab = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92));
  const X = (0.4124 * c[0] + 0.3576 * c[1] + 0.1805 * c[2]) / 0.9505, Y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2], Z = (0.0193 * c[0] + 0.1192 * c[1] + 0.9505 * c[2]) / 1.089;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const fromLab = ([L, a, b]) => {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, g = (t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const X = g(fx) * 0.9505, Y = g(fy), Z = g(fz) * 1.089;
  const r = [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.204 * Y + 1.057 * Z];
  return '#' + r.map((v) => Math.round(255 * Math.min(1, Math.max(0, v > 0.0031308 ? 1.055 * v ** (1 / 2.4) - 0.055 : 12.92 * v))).toString(16).padStart(2, '0')).join('');
};
const tune = (g, dL, kC) => g && { ...g, rows: g.rows.map((r) => r.map((h) => { const [L, a, b] = toLab(h); return fromLab([L + dL, a * kC, b * kC]); })) };
// étalonnage (judges 2026-10-23, twice: "brun chocolat" against a ferruginous photo): the grids are the mean of four exposures, the
// studio pair c123 / c115 sets the hue: chroma raised by 30 to 40 %, lightness a little; the small round nodes lifted too (delta.py)
const smoothT = (g, r) => g && { ...g, rows: g.rows.map((row, i) => row.map((_, j) => {
  let acc = [0, 0, 0], n = 0;
  for (let k = Math.max(0, i - r); k <= Math.min(g.rows.length - 1, i + r); k++) { const L = toLab(g.rows[k][j]); acc = acc.map((v, c) => v + L[c]); n++; }
  return fromLab(acc.map((v) => v / n));
})) };
const G = { tete: tune(grid('tete'), -2, 1.3), mesosome: tune(grid('mesosome'), 7, 1.32), gastre: tune(smoothT(grid('gastre'), 9), 6, 1.4), noeud: tune(lift(grid('noeud'), 1.12), 3, 1.3) };
const C = {
  head: '#5c2414', meso: '#6e2c14', node: '#7a3416', gaster: '#7c3a14', mandible: '#843818',
  // the legs and antennae amber and lighter toward the tarsi (c013, c123), translucent
  coxa: '#8e4a1c', leg: '#9a5622', tib: '#aa662c', tar: '#bc7a3a', ant: '#a46228',
  eye: '#2e2b28', hair: '#e6c890', claw: '#3a1a0a',
};
// the cuticle: the sculpted head and mesosoma satin, the nodes and the gaster lacquered (c123: a window reflected whole on the gaster)
const MAT = {
  // the sculpted head and mesosoma: a dark rim (little wrap), a satin sheen, the sharp glints on the crests of the rugae
  sculpt: { ks: 0.1, p: 120, ks2: 0.04, p2: 6, env: 0.05, wrap: 0.1, mottle: 0.09, specColor: '#ffe6cc', trans: { color: '#a0400e', k: 0.08 } },
  node: { ks: 0.8, p: 420, ks2: 0.12, p2: 24, env: 0.22, wrap: 0.12, mottle: 0.04, trans: { color: '#c05a16', k: 0.2 } },
  // the gaster lacquered: small sharp highlights rather than one broad oval, the amber light through its rim
  gaster: { ks: 1.1, p: 900, ks2: 0.14, p2: 40, env: 0.09, wrap: 0.12, mottle: 0.03, trans: { color: '#cc681c', k: 0.38 } },
  limb: { ks: 0.4, p: 200, ks2: 0.05, p2: 12, env: 0.1, wrap: 0.15, mottle: 0.04, trans: { color: '#c86a1e', k: 0.16 } },
  eye: { ks: 0.7, p: 260, ks2: 0.1, p2: 14, env: 0.3, wrap: 0.12, amb: 0.3, mottle: 0.14, specColor: '#f2eee6' },
};

// a profile from a table of rows [t, x, zc, ry, rz], each row read from the measures, joined by a Catmull-Rom spline (smooth
// through the rows: no facet, no ridge between them, judge 2026-10-23)
function table(rows) {
  const n = rows.length;
  return (t) => {
    let i = 0;
    while (i < n - 2 && t > rows[i + 1][0]) i++;
    const r0 = rows[Math.max(0, i - 1)], r1 = rows[i], r2 = rows[i + 1], r3 = rows[Math.min(n - 1, i + 2)];
    const h = r2[0] - r1[0], f = clamp((t - r1[0]) / h);
    const f2 = f * f, f3 = f2 * f;
    const v = (k) => {
      const m1 = ((r2[k] - r0[k]) / Math.max(1e-6, r2[0] - r0[0])) * h, m2 = ((r3[k] - r1[k]) / Math.max(1e-6, r3[0] - r1[0])) * h;
      return (2 * f3 - 3 * f2 + 1) * r1[k] + (f3 - 2 * f2 + f) * m1 + (-2 * f3 + 3 * f2) * r2[k] + (f3 - f2) * m2;
    };
    return { x: v(1), zc: v(2), ry: Math.max(0.005, v(3)), rz: Math.max(0.005, v(4)) };
  };
}

// Rugae (PROTOCOLE §4.1: the sculpture measured, drawn as relief): each ridge runs over the surface of a body, along t at a fixed
// spacing around the section (longitudinal rugae) and, for a mesh, across too. A ridge is lit as relief: at every point its two
// flanks lean by ±30° across it, the flank that faces the lamp is drawn as a light crest on its side, the other as a groove's shadow
// on the far side, and where the lit flank mirrors the lamp the crest glints (the small sharp highlights of a sculpted cuticle).
// Only where a ridge spans 3 px or more: in an atlas cell the sculpture is under a pixel (§6.1). Three paths per body, lean.
function rugae(R) {
  return (sc, b) => {
    const P = R.period, px = P * sc.k;
    if (px < 3) return '';
    const cam = sc.cam, rnd = rng(R.seed || 7);
    let dk = '', lt = '', gl = '';
    const off = Math.max(0.3, px * 0.16);
    const line = (ts, ths) => {
      let on = false, d1 = '', d2 = '', prev = null;
      for (let i = 0; i < ts.length; i++) {
        const t = ts[i], th = ths[i];
        const n = normalAt(b, t, th), vis = dot(n, cam.c), p3 = surf(b, t, th);
        if (vis < 0.12 || (R.where && !R.where(t, th))) { on = false; prev = p3; continue; }
        const nx = i + 1 < ts.length ? surf(b, ts[i + 1], ths[i + 1]) : p3;
        const tg = norm(sub(nx, prev || p3)); prev = p3;
        let c = norm(cross(n, tg));
        if (dot(c, cam.L) < 0) c = mul(c, -1);
        const q = sc.S(p3), q1 = sc.S(add(p3, mul(c, 0.01)));
        let ox = q1[0] - q[0], oy = q1[1] - q[1]; const ol = Math.hypot(ox, oy) || 1; ox = (ox / ol) * off; oy = (oy / ol) * off;
        d1 += (on ? 'L' : 'M') + fmt(q[0] - ox) + ' ' + fmt(q[1] - oy);
        d2 += (on ? 'L' : 'M') + fmt(q[0] - ox * 0.3) + ' ' + fmt(q[1] - oy * 0.3);
        on = true;
        const g = dot(norm(add(n, mul(c, 0.58))), cam.H);
        if (g > (R.glint ?? 0.9) && rnd() < 0.22) {
          // a glint: a short dash on the lit crest, along the ridge
          const qa = sc.S(add(p3, mul(tg, P * 0.2))), cx = q[0] + ox * 0.55, cy = q[1] + oy * 0.55;
          gl += 'M' + fmt(cx) + ' ' + fmt(cy) + 'l' + fmt(qa[0] - q[0]) + ' ' + fmt(qa[1] - q[1]);
        }
        // a ruga is broken now and then (an irregular sculpture, not a combed one)
        if (rnd() < (R.gaps ?? 0.06)) on = false;
      }
      dk += d1; lt += d2;
    };
    // the body's mean circumference sets the number of ridges around it
    let circ = 0;
    for (let i = 1; i < 10; i++) { const p = b.profile(i / 10); circ += Math.PI * (3 * (p.ry + p.rz) - Math.sqrt((3 * p.ry + p.rz) * (p.ry + 3 * p.rz))) / 9; }
    const nRing = Math.round(circ / P), nT = Math.max(8, Math.round((Math.abs(b.profile(1).x - b.profile(0).x) / P) * 3));
    const t0 = R.t0 ?? 0.04, t1 = R.t1 ?? 0.96;
    for (let j = 0; j < nRing; j++) {
      const th0 = (j / nRing) * 2 * Math.PI + (rnd() - 0.5) * (R.jitter ?? 0.8) * (2 * Math.PI / nRing);
      const ts = [], ths = [];
      const ph = rnd() * 6.28, wob = (R.wobble ?? 0.25) * (2 * Math.PI / nRing);
      // longitudinal rugae diverge toward the rear (R.spread: extra angle at t0); a mesh breaks them into irregular cells
      for (let i = 0; i <= nT; i++) {
        const t = t0 + (t1 - t0) * (i / nT);
        ts.push(t); ths.push(th0 * (1 + (R.spread ?? 0) * (1 - t)) + wob * Math.sin(t * 17 + ph) + wob * 0.6 * Math.sin(t * 41 + 2 * ph));
      }
      line(ts, ths);
    }
    if (R.mesh) {
      const L = Math.abs(b.profile(1).x - b.profile(0).x), nX = Math.round(L / P);
      for (let i = 0; i < nX; i++) {
        const tc = t0 + (t1 - t0) * ((i + 0.5 + (rnd() - 0.5) * 0.5) / nX);
        const ts = [], ths = [];
        for (let j = 0; j <= nRing * 3; j++) { ts.push(clamp(tc + 0.45 * (P / L) * Math.sin(j * 1.9 + i * 2.3) + 0.2 * (P / L) * Math.sin(j * 4.1 + i)), 0, 1); ths.push((j / (nRing * 3)) * 2 * Math.PI); }
        line(ts, ths);
      }
    }
    const w = P * sc.k, a = R.a ?? 0.55;
    // the groove's shadow wide and soft, its crease thin and dark (the relief's own shadow between the ridges)
    return `<path d="${dk}" fill="none" stroke="${R.dark}" stroke-width="${fmt(Math.max(0.6, w * 0.34))}" stroke-linejoin="round" stroke-linecap="round" opacity="${fmt(a * 0.45)}"/>` +
      `<path d="${lt}" fill="none" stroke="${R.dark}" stroke-width="${fmt(Math.max(0.4, w * 0.1))}" stroke-linejoin="round" stroke-linecap="round" opacity="${fmt(a)}"/>` +
      (gl ? `<path d="${gl}" stroke="#fff6ea" stroke-width="${fmt(Math.max(0.5, w * 0.07))}" stroke-linecap="round" opacity="0.65"/>` : '');
  };
}

// sparse erect setae, pale gold (c013, c123: long on the head, the mesosoma and the nodes, shorter over the gaster)
// a seta is a few microns thick (0.003 mm drawn: under a pixel at 200 px/mm, the engine keeps it visible with less opacity)
const setae = (n, len, lean = 0.25) => ({ n, len, w: 0.005, lean, a: 0.95, droop: 0.2, twist: 0.7, curl: 0.32, wave: 0.12, pile: 0, fleece: 0, locks: 0.1,
  sheen: 0.55, sheenP: 24, color: () => C.hair });
// the legs' appressed pubescence: short hairs lying along the article
const pubescence = (n) => ({ n, len: 0.05, w: 0.003, lean: 1.25, a: 0.7, twist: 0.3, pile: 0, fleece: 0, color: () => C.hair });

// ---------------------------------------------------------------------------------------------------------------
// The trunk, in the living posture (c013, c115: the head level, its face a little down; the mesosoma's back sloping to the
// propodeum; the petiole low, the postpetiole higher; the gaster level)
// ---------------------------------------------------------------------------------------------------------------
const M = MES.mesosome, H = MES.tete, PE = MES.petiole, PP = MES.postpetiole, V = MES.vivant, GA = V.gastre;
// the living worker is stouter than the dried specimens (mesures.json vivant): widths and heights brought to it
const MW = V.mesosome_largeur_pronotum / M.largeur_pronotum, MH = V.mesosome_hauteur_pronotum / 0.6;
// the head held a little down (c013, c124), on a short neck
const HEAD = { o: [1.53, 0, 0.5], pitch: -22 };

function mesosoma(sc) {
  sc.part = 'mesosome';
  const W = M.longueur_Weber;
  // rows rear (propodeal lobes) to front (the neck): [t, x, zc, ry, rz]; the hump of the pronotum, the metanotal groove at
  // 0.62 mm from the front (mesures.json), the propodeum narrower
  // half-widths of the living worker (mesures.json vivant: the promesonotum a broad oval, 0.78 of the head's width; the propodeum
  // narrow), heights from the profiles (c141, c013: the pronotum convex and high, the propodeum lower)
  const hp = V.mesosome_largeur_pronotum / 2 + 0.05, hz = V.mesosome_hauteur_pronotum / 2 + 0.03;
  const rows = [
    [0, 0, 0.33, 0.1, 0.12], [0.03, 0.025, 0.34, 0.18, 0.2], [0.1, 0.12, 0.35, M.largeur_propodeum / 2, 0.24], [0.2, 0.28, 0.35, M.largeur_propodeum / 2 + 0.02, 0.25],
    [0.42, 0.62, 0.37, M.largeur_propodeum / 2 + 0.05, 0.26], [0.56, 0.86, 0.42, hp * 0.78, hz * 0.82],
    [0.7, 1.06, 0.48, hp * 0.97, hz], [0.84, 1.26, 0.49, hp * 1.02, hz * 0.98], [0.93, 1.4, 0.47, hp * 0.92, hz * 0.8], [1, W, 0.44, 0.12, 0.12],
  ];
  const prof = table(rows);
  drawBody(sc, {
    name: 'mesosoma', frame: frame0([0, 0, 0]), depthAt: [0.75, 0, 0.4], color: C.meso, seed: 5, grid: G.mesosome, mat: MAT.sculpt,
    profile: (t) => { const p = prof(t); const dip = 1 - 0.24 * Math.exp(-(((t - 0.5) / 0.04) ** 2)); return { ...p, rz: p.rz * dip }; },
    // laterally compressed, the back a little flat (c148 from above, c140 in profile)
    shape: (th) => [1, Math.sin(th) > 0 ? 1.0 : 0.92],
    paint: rugae({ period: MES.sculpture.mesosome.periode, mesh: true, dark: '#1e0904', light: '#f4c49a', a: 0.45, seed: 11, wobble: 0.7, gaps: 0.12, t0: 0.08, t1: 0.94 }),
    hair: setae(170, 0.22, 0.3),
  });
  // the propodeal spines: short, raised and diverging (mesures.json: 0.27 mm, 30 deg up, 22 deg out)
  const E = M.epines, el = (E.elevation_deg * Math.PI) / 180, dv = (E.divergence_deg * Math.PI) / 180;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'epine-g' : 'epine-d';
    const b0 = [0.1, 0.09 * s, 0.54];
    const tip = add(b0, mul(norm([-Math.cos(el) * Math.cos(dv), s * Math.cos(el) * Math.sin(dv), Math.sin(el)]), E.longueur));
    drawTube(sc, [b0, add(b0, mul(sub(tip, b0), 0.35)), add(b0, mul(sub(tip, b0), 0.7)), tip], [0.045, 0.03, 0.018, 0.005], { color: C.meso, gloss: 0.45, bias: 0.01 });
  }
}

function waist(sc) {
  // the petiole: a forward peduncle, then the rounded node (its front concave), smooth and glossy (laevinodis)
  sc.part = 'petiole';
  const x0 = 0.07, L = PE.longueur + 0.05;
  drawBody(sc, {
    name: 'petiole', frame: frame0([x0 - L, 0, 0]), depthAt: [x0 - L * 0.6, 0, 0.3], color: C.node, seed: 9, grid: G.noeud, mat: MAT.node,
    // rear to front: the node a high rounded dome over its rear half, the peduncle a slender stalk in front (c140, c141, c013)
    profile: table([[0, 0, 0.3, 0.06, 0.07], [0.1, 0.05, 0.33, 0.11, 0.15], [0.28, 0.13, 0.4, PE.largeur / 2, PE.hauteur / 2 + 0.03],
      [0.44, 0.21, 0.34, PE.largeur / 2 - 0.02, PE.hauteur / 2 - 0.04], [0.54, 0.26, 0.28, 0.08, 0.095], [0.62, 0.3, 0.25, 0.06, 0.065], [0.8, 0.38, 0.24, 0.06, 0.065], [1, L, 0.24, 0.055, 0.06]]),
    hair: setae(14, 0.14, 0.2),
  });
  sc.part = 'postpetiole';
  const x1 = x0 - L;
  drawBody(sc, {
    name: 'postpetiole', frame: frame0([x1 + 0.05 - PP.longueur, 0, 0]), depthAt: [x1 - PP.longueur * 0.5, 0, 0.3], color: C.node, seed: 10, grid: G.noeud, mat: MAT.node,
    // globular, wider than the petiole (mesures.json: 0.4 against 0.27 mm)
    profile: table([[0, 0, 0.3, 0.1, 0.1], [0.15, 0.04, 0.31, 0.18, 0.17], [0.45, 0.14, 0.32, PP.largeur / 2 + 0.02, PP.hauteur / 2],
      [0.75, 0.24, 0.31, 0.16, 0.15], [1, PP.longueur - 0.04, 0.29, 0.06, 0.06]]),
    hair: setae(16, 0.14, 0.2),
  });
  return x1 + 0.05 - PP.longueur;
}

function gaster(sc, xf) {
  sc.part = 'gastre';
  const L = GA.longueur;
  // an ovoid widest at 0.62 of its length from the tip, the first tergite covering most of it; the three posterior segments
  // telescoped under it, each a step narrower (c123, c013); held a little down at the rear
  // its front on the postpetiole, its rear lowered by 6 deg (c115, c013), its belly just clear of the ground
  const pg = 6, ca = Math.cos((pg * Math.PI) / 180), sa = Math.sin((pg * Math.PI) / 180);
  const seg = [0.13, 0.22, 0.31], F = pitched([xf + 0.18 - L * ca, 0, 0.34 - L * sa], pg);
  drawBody(sc, {
    name: 'gaster', frame: F, color: C.gaster, seed: 3, grid: G.gastre, mat: MAT.gaster,
    profile: (t) => {
      // the front blunt, where the postpetiole sits in the first tergite's hollow
      const u = t < 0.62 ? (0.62 - t) / 0.62 : (t - 0.62) / 0.38, e = t < 0.62 ? 2.4 : 2.7;
      let w = Math.pow(Math.max(0, 1 - Math.pow(u, e)), 1 / e);
      for (const st of seg) w *= 1 - 0.035 * (1 - clamp((t - st) / 0.012 + 0.5));
      return { x: L * t, zc: -0.04 * (1 - t), ry: Math.max(0.01, (GA.largeur / 2) * w), rz: Math.max(0.01, (GA.hauteur / 2) * w) };
    },
    // each tergite's hind margin: a thin translucent amber rim over the dark seam of the next
    bands: seg.flatMap((t) => [{ t0: t - 0.005, t1: t + 0.002, color: '#3a1606' }, { t0: t + 0.002, t1: t + 0.014, color: '#c27a34' }]), feather: 0.004,
    rim: { color: '#f2c48a', w: 0.018, a: 0.45 },
    hair: setae(80, 0.17, 0.45),
  });
  // the sting: retracted, only its tip at the gaster's apex
  sc.part = 'aiguillon';
  const tip = add(F.o, [0, 0, -0.04]);
  drawTube(sc, [add(tip, mul(F.ax, 0.03)), add(tip, mul(F.ax, -0.04))], [0.014, 0.004], { color: '#5a2408', gloss: 0.5, bias: -0.02 });
}

// ---------------------------------------------------------------------------------------------------------------
// The head (c082 full face, c140 profile): longer than wide (CL 1.13, CW 0.94 mm), widest behind the eyes, the occiput gently
// rounded, the frons striate; the eyes at 0.55 CL; the frontal lobes over the antennal sockets; the glossy clypeus; the mandibles
// ---------------------------------------------------------------------------------------------------------------
function head(sc, pose, frame) {
  sc.part = 'tete';
  const F = pitched(HEAD.o, HEAD.pitch), CL = H.longueur_CL, hw = H.largeur_CW_sans_yeux / 2, hd = V.tete_hauteur / 2;
  const at = (x, y, z) => add(add(add(F.o, mul(F.ax, x)), mul(F.ay, y)), mul(F.az, z));
  drawBody(sc, {
    name: 'head', frame: F, color: C.head, seed: 7, grid: G.tete, mat: MAT.sculpt,
    // a rounded square-oval from above (c082, c123): the occipital corners round, the sides nearly parallel, the front a little narrower
    profile: table([[0, 0, 0.03, 0.12, 0.1], [0.03, 0.02, 0.03, hw * 0.62, hd * 0.6], [0.1, 0.08, 0.02, hw * 0.9, hd * 0.86], [0.25, 0.25, 0.01, hw * 0.99, hd * 0.98],
      [0.5, 0.55, 0.0, hw, hd], [0.75, 0.84, -0.03, hw * 0.97, hd * 0.86], [0.92, 1.03, -0.06, hw * 0.9, hd * 0.68], [1, CL, -0.07, hw * 0.78, hd * 0.42]]),
    // the head a little flat on the face and the vertex, round on the sides
    shape: (th) => [1, Math.sin(th) > 0 ? 0.94 : 0.9],
    paint: rugae({ period: MES.sculpture.tete_dessus.periode, dark: '#1a0703', light: '#f0bc90', a: 0.5, seed: 17, spread: 0.12, wobble: 0.45, gaps: 0.1, t0: 0.05, t1: 0.9,
      where: (t, th) => Math.sin(th) > -0.3 }),
    hair: setae(170, 0.21, 0.35),
  });
  // the neck: the occipital foramen on the pronotum's collar
  drawTube(sc, [[1.42, 0, 0.47], [1.52, 0, 0.49], [1.6, 0, 0.5]], [0.09, 0.08, 0.09], { color: '#7a3a1a', gloss: 0.3, bias: -0.08 });
  // the clypeus: a raised glossy plate between the antennal sockets, its front margin over the mandibles (c124: it shines)
  sc.part = 'tete';
  drawBody(sc, {
    name: 'clypeus', frame: pitched(at(1.0, 0, hd * 0.3), HEAD.pitch - 30), color: C.head, seed: 8, grid: G.tete, mat: MAT.sculpt,
    profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: 0.19 * (2 * t - 1), zc: 0, ry: 0.2 * s, rz: 0.04 * s }; }, bias: 0.03,
    paint: rugae({ period: 0.03, dark: '#1a0703', light: '#f0bc90', a: 0.4, seed: 19, wobble: 0.2 }),
  });
  // the frontal lobes are in the head's outline and its grid (drawn apart, they read as a hollow ellipse on the vertex: judge 3)
  // eyes: oval, dark grey, set at mid-height on the side of the head (H.oeil)
  const E = H.oeil;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const c = at(CL * E.centre_depuis_occiput_CL, (hw - 0.06) * s, 0.04);
    drawBody(sc, {
      name: 'eye', frame: { o: sub(c, mul(F.ax, E.grand_axe / 2)), ax: F.ax, ay: F.ay, az: F.az }, color: C.eye, seed: 21 + s, mat: MAT.eye,
      profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: E.grand_axe * 0.9 * t, zc: 0, ry: 0.06 * q, rz: (E.petit_axe / 2) * 0.9 * q }; },
      facets: E.facette, bias: 0.03, rim: { color: '#9a968e', w: 0.006, a: 0.35 },
    });
  }
  // mandibles: closed, flat triangular blades under the clypeus, their apical teeth crossing at the midline (c082, c124): each a flat
  // body from its outer base to its apex, widest over the masticatory margin
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'mandibule-g' : 'mandibule-d';
    const b0 = at(CL - 0.14, 0.31 * s, -0.09), tip = at(CL + H.mandibules_au_dela_du_clypeus - 0.02, -0.05 * s, -0.12);
    const ax = norm(sub(tip, b0)), ay = norm(cross(F.az, ax)), az = cross(ax, ay), L = Math.hypot(...sub(tip, b0));
    drawBody(sc, {
      name: 'mandible', frame: { o: b0, ax, ay, az }, color: C.mandible, seed: 31 + s, mat: MAT.node, bias: 0.02,
      profile: table([[0, 0, 0, 0.06, 0.035], [0.2, L * 0.2, 0, 0.11, 0.032], [0.6, L * 0.6, 0, 0.105, 0.026], [0.88, L * 0.88, 0, 0.06, 0.018], [1, L, 0, 0.012, 0.008]]),
      // the blade's inner margin forward, toward the other mandible: shifted toward the midline
      shape: (th) => [Math.cos(th) * s < 0 ? 1.35 : 0.6, 1],
    });
    // the masticatory margin: six teeth along the inner edge, the apical one longest (c082)
    const inward = mul(ay, -s);
    for (let i = 0; i < (fine(sc) ? 6 : 0); i++) {
      const f = 0.3 + 0.13 * i, q = add(add(b0, mul(ax, L * f)), mul(inward, 0.075 * (1.3 - 0.5 * f)));
      const dt = norm(add(mul(inward, 1), mul(ax, 0.6))), tl = i === 5 ? 0.05 : 0.025;
      drawTube(sc, [q, add(q, mul(dt, tl))], [0.012, 0.002], { color: '#4a1a08', gloss: 0.5, bias: 0.025 });
    }
  }
  antennae(sc, at, F, pose, frame);
}

// Antennae: geniculate, 12 articles (the scape, then 11 of the funiculus ending in a club of 3), the scape back and out along the
// head, the funiculus forward and down. In a walk they sweep the ground ahead; stopped, they tap it in turn (palpe).
function antennae(sc, at, F, pose, frame) {
  const A = MES.antenne;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const base = at(0.9, 0.26 * s, 0.1);
    const ph = (frame + (s > 0 ? 0 : 0.5)) % 1;
    let swing = 0, dip = 0;
    if (pose === 'marche') swing = 0.35 * Math.sin(2 * Math.PI * ph);
    if (pose === 'palpe') { dip = 0.5 * Math.max(0, Math.sin(2 * Math.PI * ph)); swing = 0.15 * Math.sin(2 * Math.PI * ph + 1); }
    // the scape: out, a little back and up from the socket (c124, c013)
    const sd = norm([-0.35 + 0.25 * swing, (0.85 - 0.15 * swing) * s, 0.22]);
    const elbow = add(base, mul(sd, A.scape));
    // the funiculus: forward, out, then down toward the ground ahead
    let d = norm([0.9, (0.2 + 0.4 * swing) * s, -0.2 - 0.55 * dip]);
    // the scape: slender, bent near its base, thickening toward the elbow
    const bend = add(base, mul(norm(add(sd, [0, 0, 0.5])), A.scape * 0.12));
    const pts = [base, bend, add(bend, mul(sd, A.scape * 0.45)), elbow], rad = [0.03, 0.026, 0.034, 0.04];
    const segL = [];
    for (let i = 0; i < 11; i++) segL.push(i < 8 ? (A.funicule - A.massue_3_articles) / 8 : A.massue_3_articles / 3);
    let p = elbow;
    for (let i = 0; i < 11; i++) {
      // each article swollen in its middle and narrow at its joint: the funiculus reads segmented; the club grows over 3 articles
      const rm = i < 8 ? 0.03 + 0.0015 * i : 0.05 + 0.011 * (i - 8);
      p = add(p, mul(d, segL[i] * 0.5)); pts.push(p); rad.push(rm);
      p = add(p, mul(d, segL[i] * 0.5)); pts.push(p); rad.push(i === 10 ? 0.018 : rm * 0.88);
      d = norm(add(d, [0.0, 0.01 * s, -0.05 - 0.04 * dip]));
    }
    drawTube(sc, pts, rad, { color: (i) => (i > 18 ? C.tib : C.ant), gloss: 0.5, bias: 0.02 });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Legs (mesures.json): coxa, femur (clavate), tibia, five tarsomeres, two claws; the feet set wide, the knees up and out (c123,
// c013). The walk is an alternating tripod (L1 R2 L3 against R1 L2 R3): stride and lift from COMPORTEMENT.md.
// ---------------------------------------------------------------------------------------------------------------
const GROUND = -0.4;
const LEGS = {
  // the coxae under the sides of the mesosoma; the knees out and a little up, about level with the back (c013, c115, c123)
  // the feet where c123 sets them: the fore ones beside the head, the mid ones out to the side, the hind ones back to the gaster's
  // middle; the tarsus slanting to the ground, so the femur and the tibia open instead of folding into a zigzag
  front: { base: [1.3, 0.2, -0.04], foot: [2.1, 1.25], tdir: [0.6, 0.55, -0.45], pole: [0.3, 1, 0.5] },
  mid: { base: [0.8, 0.25, -0.04], foot: [0.75, 1.75], tdir: [0.1, 0.9, -0.35], pole: [0, 1, 0.55] },
  hind: { base: [0.34, 0.25, 0.0], foot: [-1.55, 1.5], tdir: [-0.6, 0.5, -0.4], pole: [-0.3, 1, 0.55] },
};
// the foot's sweep against the body over its stance: duty factor 0.5 times the stride length, 0.67 body length (Clifton et al. 2020:
// 1.8 to 2.6 mm for a 3 mm ant), so 0.5 x 0.67 x 4.9 mm; the foot lifts by a fifth of the hind tibia
const STRIDE = 1.6, LIFT = 0.24;
// the articles, teeth and spurs are drawn one by one only where they span a few pixels
const fine = (sc) => sc.k * (sc.detail ?? 1) >= 22;
function legs(sc, pose, frame) {
  const P = MES.pattes, key = { front: 'avant', mid: 'milieu', hind: 'arriere' };
  for (const s of [1, -1]) for (const k of ['front', 'mid', 'hind']) {
    sc.part = `patte-${k}-${s > 0 ? 'g' : 'd'}`;
    const D = LEGS[k], L = { base: D.base, fem: P[key[k]].femur, tib: P[key[k]].tibia, tar: P[key[k]].tarse };
    let [fx, fy] = D.foot, lift = 0;
    if (pose === 'marche') { const g = tripod(k, s, frame, STRIDE, LIFT); fx += g.dx; lift = g.lift; }
    const td = norm(D.tdir);
    const ankle = sub([fx, fy, GROUND + lift], mul(td, L.tar * 0.9));
    const ch = legChain(L, s, ankle, D.tdir, D.pole, [0.36, 0.16, 0.14, 0.12, 0.22], 0.07);
    const r = (v) => v;
    const A = {
      // the coxa a cone hanging from the mesosoma (the fore coxa the largest), not a disc
      coxa: { from: k === 'front' ? [0.06, -0.1, 0.3] : [0.0, -0.1, 0.26], r: k === 'front' ? [0.1, 0.12, 0.075] : [0.085, 0.1, 0.065], c: C.coxa },
      // the femur clavate: thin at its base, swollen beyond the middle, narrowing to the knee
      fem: { r: [0.045, 0.1, 0.07], c: C.leg, flat: 0.8, hair: pubescence(26) },
      tib: { r: [0.034, 0.042, 0.05], c: C.tib, flat: 0.9, hair: pubescence(24) },
      bas: { r: [r(0.028), 0.026, 0.024], c: C.tar, hair: pubescence(12) },
      tar: { r: 0.022, c: C.tar }, claw: 0.032,
    };
    if (fine(sc)) articleLeg(sc, drawBody, drawTube, ch.pts, ch.dir, ch.tip, A, s, MAT.limb);
    else {
      // small on screen (an atlas cell): the same articles as one shaded tube, its radii and colours those of the articles; a leg
      // of meshed articles weighed 60 Ko of SVG for a few pixels (PROTOCOLE §3.5, §6.1)
      const q = ch.pts, cox = add(q[0], A.coxa.from.map((v, i) => (i === 1 ? v * s : v)));
      const P2 = [cox, q[0], mul(add(q[0], q[1]), 0.5), q[1], mul(add(q[1], q[2]), 0.5), q[2], q[4], q[6], q[8], q[10], ch.tip].filter(Boolean);
      const R2 = [A.coxa.r[1], A.fem.r[0], A.fem.r[1], A.fem.r[2], A.tib.r[1], A.tib.r[2], A.bas.r[1], A.tar.r, A.tar.r * 0.94, A.tar.r * 0.88, A.tar.r * 0.8].slice(0, P2.length);
      const col = (i) => (i < 1 ? C.coxa : i < 3 ? C.leg : i < 5 ? C.tib : C.tar);
      drawTube(sc, P2, R2, { color: col, gloss: 0.55, bias: 0.01 });
      continue;
    }
    // the pectinate spur at the end of the mid and hind tibiae
    if (k !== 'front') drawTube(sc, [ch.pts[2], add(ch.pts[2], mul(norm(add(ch.dir, [0, 0, -0.4])), 0.09))], [0.01, 0.002], { color: C.tar, gloss: 0.3, bias: 0.005 });
  }
}

export function ant(az, el, opts = {}) {
  const { size = 128, k = 40, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light } = opts;
  const sc = new Scene(camera(az, el, light), k, size / 2, size / 2, 61, idp);
  sc.detail = detail;
  mesosoma(sc); const xg = waist(sc); gaster(sc, xg); head(sc, pose, frame); legs(sc, pose, frame);
  sc.part = '';
  return sc.svg(size, size, bg);
}

export const POSES = { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], palpe: [0, 0.25, 0.5, 0.75] };
export const META = {
  id: 'fourmi-rouge', bodyMm: MES.longueur_totale_tendue, span: 7.6,
  el: [-15, 10, 35, 60, 90], poses: POSES,
  lod: { S: { cell: 20, az: 15, poses: ['pose', 'marche', 'palpe'] }, L: { cell: 56, az: 30, poses: ['pose', 'marche', 'palpe'] } },
};
export const draw = (az, el, opts = {}) => ant(az, el, opts);
