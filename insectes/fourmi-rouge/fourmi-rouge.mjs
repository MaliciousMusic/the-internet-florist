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
// the small round nodes shade darker than the photos' (delta.py: ΔE 6.1 against a spread of 5.1): their albedo lifted by 12 %
const G = { tete: grid('tete'), mesosome: grid('mesosome'), gastre: grid('gastre'), noeud: lift(grid('noeud'), 1.12) };
const C = {
  head: '#5c2414', meso: '#6e2c14', node: '#7a3416', gaster: '#7c3a14', mandible: '#843818', leg: '#82461c', legHi: '#8e5022',
  eye: '#3a3632', hair: '#d2b282', claw: '#3a1a0a',
};
// the cuticle: the sculpted head and mesosoma satin, the nodes and the gaster lacquered (c123: a window reflected whole on the gaster)
const MAT = {
  sculpt: { ks: 0.16, p: 45, ks2: 0.05, p2: 6, env: 0.07, wrap: 0.22, mottle: 0.09, specColor: '#ffe2c4' },
  node: { ks: 0.6, p: 160, ks2: 0.08, p2: 10, env: 0.28, wrap: 0.22, mottle: 0.04, trans: { color: '#b04a14', k: 0.12 } },
  gaster: { ks: 0.75, p: 260, ks2: 0.08, p2: 12, env: 0.32, wrap: 0.2, mottle: 0.04, trans: { color: '#b8460e', k: 0.16 } },
  limb: { ks: 0.45, p: 90, ks2: 0.06, p2: 8, env: 0.2, mottle: 0.04, trans: { color: '#c05a1c', k: 0.14 } },
  eye: { ks: 0.35, p: 80, ks2: 0.1, p2: 8, env: 0.3, wrap: 0.15, amb: 0.3, mottle: 0.1, specColor: '#f2eee6' },
};

// a profile from a table of rows [t, x, zc, ry, rz], smooth between rows (cosine), each row read from the measures
function table(rows) {
  return (t) => {
    let i = 0;
    while (i < rows.length - 2 && t > rows[i + 1][0]) i++;
    const a = rows[i], b = rows[i + 1], f = clamp((t - a[0]) / (b[0] - a[0])), s = 0.5 - 0.5 * Math.cos(Math.PI * f);
    const v = (k) => a[k] + (b[k] - a[k]) * s;
    return { x: v(1), zc: v(2), ry: v(3), rz: v(4) };
  };
}

// Rugae (PROTOCOLE §4.1: the sculpture measured): ridges drawn on the surface of a body as thin grooves and lit crests, along t at
// a fixed spacing around the section (longitudinal rugae), and, for a mesh, across too. Only where a ridge spans 3 px or more: in
// an atlas cell the sculpture is under a pixel and only the satin of the material remains (§6.1). Two paths per body, lean.
function rugae(R) {
  return (sc, b) => {
    const P = R.period, px = P * sc.k;
    if (px < 3) return '';
    const cam = sc.cam, rnd = rng(R.seed || 7);
    let dk = '', lt = '';
    const lift = [dot(cam.L, cam.r) * 0, -1];
    const off = Math.max(0.35, px * 0.12);
    const line = (ts, ths) => {
      let on = false, d1 = '', d2 = '';
      for (let i = 0; i < ts.length; i++) {
        const t = ts[i], th = ths[i];
        const n = normalAt(b, t, th), vis = dot(n, cam.c);
        if (vis < 0.12 || (R.where && !R.where(t, th))) { on = false; continue; }
        const q = sc.S(surf(b, t, th));
        d1 += (on ? 'L' : 'M') + fmt(q[0]) + ' ' + fmt(q[1]);
        d2 += (on ? 'L' : 'M') + fmt(q[0] + lift[0] * off) + ' ' + fmt(q[1] + lift[1] * off);
        on = true;
      }
      dk += d1; lt += d2;
    };
    // the body's mean circumference sets the number of ridges around it
    let circ = 0;
    for (let i = 1; i < 10; i++) { const p = b.profile(i / 10); circ += Math.PI * (3 * (p.ry + p.rz) - Math.sqrt((3 * p.ry + p.rz) * (p.ry + 3 * p.rz))) / 9; }
    const nRing = Math.round(circ / P), nT = Math.max(8, Math.round((Math.abs(b.profile(1).x - b.profile(0).x) / P) * 3));
    const t0 = R.t0 ?? 0.04, t1 = R.t1 ?? 0.96;
    for (let j = 0; j < nRing; j++) {
      const th0 = (j / nRing) * 2 * Math.PI + (rnd() - 0.5) * 0.3 / nRing;
      const ts = [], ths = [];
      const ph = rnd() * 6.28, wob = (R.wobble ?? 0.25) * (2 * Math.PI / nRing);
      // longitudinal rugae diverge toward the rear (R.spread: extra angle at t0)
      for (let i = 0; i <= nT; i++) {
        const t = t0 + (t1 - t0) * (i / nT);
        ts.push(t); ths.push(th0 * (1 + (R.spread ?? 0) * (1 - t)) + wob * Math.sin(t * 17 + ph) + wob * 0.6 * Math.sin(t * 41 + 2 * ph));
      }
      line(ts, ths);
    }
    if (R.mesh) {
      // the cross ridges of a reticulate mesh, at the same spacing along the axis, broken into cells
      const L = Math.abs(b.profile(1).x - b.profile(0).x), nX = Math.round(L / P);
      for (let i = 0; i < nX; i++) {
        const tc = t0 + (t1 - t0) * ((i + 0.5 + (rnd() - 0.5) * 0.5) / nX);
        const ts = [], ths = [];
        for (let j = 0; j <= nRing * 3; j++) { ts.push(clamp(tc + 0.35 * (P / L) * Math.sin(j * 1.9 + i)), 0, 1); ths.push((j / (nRing * 3)) * 2 * Math.PI); }
        line(ts, ths);
      }
    }
    const w = P * sc.k;
    return `<path d="${dk}" fill="none" stroke="${R.dark}" stroke-width="${fmt(Math.max(0.5, w * 0.2))}" stroke-linejoin="round" stroke-linecap="round" opacity="${R.a ?? 0.55}"/>` +
      `<path d="${lt}" fill="none" stroke="${R.light}" stroke-width="${fmt(Math.max(0.4, w * 0.1))}" stroke-linejoin="round" stroke-linecap="round" opacity="${fmt((R.a ?? 0.55) * 0.4)}"/>`;
  };
}

// sparse erect setae, pale gold (c013, c123: long on the head, the mesosoma and the nodes, shorter over the gaster)
const setae = (n, len, lean = 0.25) => ({ n, len, w: 0.008, lean, a: 0.6, droop: 0.15, twist: 0.6, curl: 0.15, wave: 0.05, pile: 0, fleece: 0, locks: 0.1,
  sheen: 0.35, sheenP: 30, color: () => C.hair });

// ---------------------------------------------------------------------------------------------------------------
// The trunk, in the living posture (c013, c115: the head level, its face a little down; the mesosoma's back sloping to the
// propodeum; the petiole low, the postpetiole higher; the gaster level)
// ---------------------------------------------------------------------------------------------------------------
const M = MES.mesosome, H = MES.tete, PE = MES.petiole, PP = MES.postpetiole, V = MES.vivant, GA = V.gastre;
// the living worker is stouter than the dried specimens (mesures.json vivant): widths and heights brought to it
const MW = V.mesosome_largeur_pronotum / M.largeur_pronotum, MH = V.mesosome_hauteur_pronotum / 0.6;
const HEAD = { o: [1.47, 0, 0.5], pitch: -14 };

function mesosoma(sc) {
  sc.part = 'mesosome';
  const W = M.longueur_Weber;
  // rows rear (propodeal lobes) to front (the neck): [t, x, zc, ry, rz]; the hump of the pronotum, the metanotal groove at
  // 0.62 mm from the front (mesures.json), the propodeum narrower
  // half-widths of the living worker (mesures.json vivant: the promesonotum a broad oval, 0.78 of the head's width; the propodeum
  // narrow), heights from the profiles (c141, c013: the pronotum convex and high, the propodeum lower)
  const hp = V.mesosome_largeur_pronotum / 2 + 0.05, hz = V.mesosome_hauteur_pronotum / 2 + 0.03;
  const rows = [
    [0, 0, 0.32, 0.05, 0.05], [0.06, 0.06, 0.34, 0.17, 0.21], [0.2, 0.28, 0.35, M.largeur_propodeum / 2 + 0.02, 0.25],
    [0.42, 0.62, 0.37, M.largeur_propodeum / 2 + 0.05, 0.27], [0.56, 0.86, 0.42, hp * 0.8, hz * 0.84],
    [0.7, 1.06, 0.46, hp * 0.97, hz], [0.82, 1.24, 0.46, hp, hz * 0.98], [0.93, 1.4, 0.45, hp * 0.75, hz * 0.7], [1, W, 0.44, 0.08, 0.08],
  ];
  const prof = table(rows);
  drawBody(sc, {
    name: 'mesosoma', frame: frame0([0, 0, 0]), depthAt: [0.75, 0, 0.4], color: C.meso, seed: 5, grid: G.mesosome, mat: MAT.sculpt,
    profile: (t) => { const p = prof(t); const dip = 1 - 0.12 * Math.exp(-(((t - 0.5) / 0.05) ** 2)); return { ...p, rz: p.rz * dip }; },
    // laterally compressed, the back a little flat (c148 from above, c140 in profile)
    shape: (th) => [1, Math.sin(th) > 0 ? 1.0 : 0.92],
    paint: rugae({ period: MES.sculpture.mesosome.periode, mesh: true, dark: '#1e0904', light: '#f4c49a', a: 0.5, seed: 11, wobble: 0.45, t0: 0.08, t1: 0.94 }),
    hair: setae(70, 0.16, 0.3),
  });
  // the propodeal spines: short, raised and diverging (mesures.json: 0.27 mm, 30 deg up, 22 deg out)
  const E = M.epines, el = (E.elevation_deg * Math.PI) / 180, dv = (E.divergence_deg * Math.PI) / 180;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'epine-g' : 'epine-d';
    const b0 = [0.18, 0.11 * s, 0.54];
    const tip = add(b0, mul(norm([-Math.cos(el) * Math.cos(dv), s * Math.cos(el) * Math.sin(dv), Math.sin(el)]), E.longueur));
    drawTube(sc, [b0, add(b0, mul(sub(tip, b0), 0.5)), tip], [0.055, 0.032, 0.008], { color: C.meso, gloss: 0.3, bias: 0.01 });
  }
}

function waist(sc) {
  // the petiole: a forward peduncle, then the rounded node (its front concave), smooth and glossy (laevinodis)
  sc.part = 'petiole';
  const x0 = -0.04, L = PE.longueur;
  drawBody(sc, {
    name: 'petiole', frame: frame0([x0 - L, 0, 0]), depthAt: [x0 - L * 0.6, 0, 0.3], color: C.node, seed: 9, grid: G.noeud, mat: MAT.node,
    profile: table([[0, 0, 0.22, 0.05, 0.05], [0.12, 0.05, 0.24, 0.11, 0.13], [0.35, 0.16, 0.33, PE.largeur / 2, PE.hauteur / 2],
      [0.55, 0.27, 0.3, PE.largeur / 2 - 0.02, PE.hauteur / 2 - 0.05], [0.78, 0.38, 0.25, 0.08, 0.08], [1, L, 0.25, 0.06, 0.06]]),
    paint: rugae({ period: 0.03, dark: '#2a0e04', light: '#f6caa0', a: 0.3, seed: 13, t0: 0.55, t1: 0.95 }),
    hair: setae(14, 0.14, 0.2),
  });
  sc.part = 'postpetiole';
  const x1 = x0 - L;
  drawBody(sc, {
    name: 'postpetiole', frame: frame0([x1 - PP.longueur, 0, 0]), depthAt: [x1 - PP.longueur * 0.5, 0, 0.3], color: C.node, seed: 10, grid: G.noeud, mat: MAT.node,
    profile: table([[0, 0, 0.26, 0.1, 0.1], [0.15, 0.04, 0.27, 0.15, 0.17], [0.5, 0.17, 0.3, PP.largeur / 2, PP.hauteur / 2],
      [0.85, 0.3, 0.3, 0.12, 0.15], [1, PP.longueur, 0.28, 0.06, 0.06]]),
    hair: setae(16, 0.14, 0.2),
  });
  return x1 - PP.longueur;
}

function gaster(sc, xf) {
  sc.part = 'gastre';
  const L = GA.longueur;
  // the first tergite covers most of it, three short segments to the tip (c123, c013); widest at a third from the front
  drawBody(sc, {
    name: 'gaster', frame: pitched([xf - L + 0.06, 0, 0.32], 6), color: C.gaster, seed: 3, grid: G.gastre, mat: MAT.gaster,
    profile: (t) => { const w = Math.pow(env(t, 0.55, 0.42) / 0.515, 0.62); return { x: L * t, zc: -0.05 * (1 - t), ry: (GA.largeur / 2) * w, rz: (GA.hauteur / 2) * w * (0.95 + 0.05 * t) }; },
    bands: [0.14, 0.24, 0.33].map((t) => ({ t0: t - 0.008, t1: t + 0.008, color: '#4a1c08' })),
    hair: setae(110, 0.13, 0.55),
  });
  // the sting, its tip out of the last segment
  sc.part = 'aiguillon';
  const tip = [xf - L + 0.04, 0, 0.22];
  drawTube(sc, [add(tip, [0.06, 0, 0.01]), add(tip, [-0.05, 0, -0.01]), add(tip, [-0.12, 0, -0.03])], [0.025, 0.014, 0.004], { color: '#3a1608', gloss: 0.5, bias: -0.02 });
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
    profile: table([[0, 0, 0.02, 0.14, 0.12], [0.05, 0.03, 0.02, hw * 0.82, hd * 0.72], [0.2, 0.15, 0.02, hw * 0.98, hd * 0.95], [0.5, 0.52, 0.0, hw, hd],
      [0.75, 0.82, -0.03, hw * 0.92, hd * 0.86], [0.92, 1.03, -0.07, hw * 0.74, hd * 0.62], [1, CL, -0.09, hw * 0.48, hd * 0.3]]),
    // the head a little flat on the face and the vertex, round on the sides
    shape: (th) => [1, Math.sin(th) > 0 ? 0.94 : 0.9],
    paint: rugae({ period: MES.sculpture.tete_dessus.periode, dark: '#1a0703', light: '#f0bc90', a: 0.55, seed: 17, spread: 0.12, wobble: 0.1, t0: 0.05, t1: 0.9,
      where: (t, th) => Math.sin(th) > -0.3 }),
    hair: setae(60, 0.15, 0.35),
  });
  // the clypeus: a raised glossy plate between the antennal sockets, its front margin over the mandibles (c124: it shines)
  sc.part = 'tete';
  drawBody(sc, {
    name: 'clypeus', frame: pitched(at(0.98, 0, hd * 0.5), HEAD.pitch - 22), color: C.head, seed: 8, mat: MAT.node,
    profile: (t) => { const s = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: 0.15 * (2 * t - 1), zc: 0, ry: 0.19 * s, rz: 0.04 * s }; }, bias: 0.02,
  });
  // frontal lobes over the antennal sockets
  for (const s of [1, -1]) drawBody(sc, {
    name: 'lobe', frame: pitched(at(0.85, 0.24 * s, 0.24), HEAD.pitch), color: C.head, seed: 12 + s, mat: MAT.sculpt,
    profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: 0.13 * (2 * t - 1), zc: 0, ry: 0.07 * q, rz: 0.05 * q }; }, bias: 0.02,
  });
  // eyes: oval, dark grey, set at mid-height on the side of the head (H.oeil)
  const E = H.oeil;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const c = at(CL * E.centre_depuis_occiput_CL, (hw - 0.065) * s, 0.06);
    drawBody(sc, {
      name: 'eye', frame: { o: sub(c, mul(F.ax, E.grand_axe / 2)), ax: F.ax, ay: F.ay, az: F.az }, color: C.eye, seed: 21 + s, mat: MAT.eye,
      profile: (t) => { const q = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: E.grand_axe * t, zc: 0, ry: 0.07 * q, rz: (E.petit_axe / 2) * q }; },
      facets: E.facette, bias: 0.03,
    });
  }
  // mandibles: closed, flat triangular blades under the clypeus, their apical teeth crossing at the midline (c082, c124): each a flat
  // body from its outer base to its apex, widest over the masticatory margin
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'mandibule-g' : 'mandibule-d';
    const b0 = at(CL - 0.12, 0.27 * s, -0.08), tip = at(CL + H.mandibules_au_dela_du_clypeus, -0.04 * s, -0.12);
    const ax = norm(sub(tip, b0)), ay = norm(cross(F.az, ax)), az = cross(ax, ay), L = Math.hypot(...sub(tip, b0));
    drawBody(sc, {
      name: 'mandible', frame: { o: b0, ax, ay, az }, color: C.mandible, seed: 31 + s, mat: MAT.node, bias: 0.02,
      profile: table([[0, 0, 0, 0.05, 0.04], [0.2, L * 0.2, 0, 0.085, 0.045], [0.6, L * 0.6, 0, 0.075, 0.035], [0.88, L * 0.88, 0, 0.04, 0.022], [1, L, 0, 0.008, 0.008]]),
      // the blade's inner margin forward, toward the other mandible: shifted toward the midline
      shape: (th) => [Math.cos(th) * s < 0 ? 1.25 : 0.7, 1],
      paint: rugae({ period: 0.025, dark: '#2a0e04', light: '#f6caa0', a: 0.3, seed: 33 + s }),
    });
  }
  antennae(sc, at, F, pose, frame);
}

// Antennae: geniculate, 12 articles (the scape, then 11 of the funiculus ending in a club of 3), the scape back and out along the
// head, the funiculus forward and down. In a walk they sweep the ground ahead; stopped, they tap it in turn (palpe).
function antennae(sc, at, F, pose, frame) {
  const A = MES.antenne;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const base = at(0.88, 0.27 * s, 0.22);
    const ph = (frame + (s > 0 ? 0 : 0.5)) % 1;
    let swing = 0, dip = 0;
    if (pose === 'marche') swing = 0.35 * Math.sin(2 * Math.PI * ph);
    if (pose === 'palpe') { dip = 0.5 * Math.max(0, Math.sin(2 * Math.PI * ph)); swing = 0.15 * Math.sin(2 * Math.PI * ph + 1); }
    // the scape: out, a little back and up from the socket (c124, c013)
    const sd = norm([-0.2 + 0.25 * swing, (0.85 - 0.15 * swing) * s, 0.42]);
    const elbow = add(base, mul(sd, A.scape));
    // the funiculus: forward, out, then down toward the ground ahead
    let d = norm([0.9, (0.2 + 0.4 * swing) * s, -0.2 - 0.55 * dip]);
    const pts = [base, add(base, mul(sd, A.scape * 0.5)), elbow], rad = [0.045, 0.055, 0.048];
    const segL = [];
    for (let i = 0; i < 11; i++) segL.push(i < 8 ? (A.funicule - A.massue_3_articles) / 8 : A.massue_3_articles / 3);
    let p = elbow;
    for (let i = 0; i < 11; i++) {
      p = add(p, mul(d, segL[i] * 0.5)); pts.push(p); rad.push(i < 8 ? 0.036 + 0.002 * i : 0.058 + 0.012 * (i - 8));
      p = add(p, mul(d, segL[i] * 0.5)); pts.push(p); rad.push(i < 8 ? 0.031 + 0.002 * i : (i === 10 ? 0.03 : 0.054 + 0.012 * (i - 8)));
      d = norm(add(d, [0.0, 0.01 * s, -0.05 - 0.04 * dip]));
    }
    drawTube(sc, pts, rad, { color: C.legHi, gloss: 0.35, bias: 0.02 });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Legs (mesures.json): coxa, femur (clavate), tibia, five tarsomeres, two claws; the feet set wide, the knees up and out (c123,
// c013). The walk is an alternating tripod (L1 R2 L3 against R1 L2 R3): stride and lift from COMPORTEMENT.md.
// ---------------------------------------------------------------------------------------------------------------
const GROUND = -0.5;
const LEGS = {
  // the coxae under the sides of the mesosoma; the knees out and a little up, about level with the back (c013, c115, c123)
  front: { base: [1.3, 0.22, -0.02], foot: [2.45, 1.45], tdir: [0.75, 0.45, -0.5], pole: [0.25, 1, 0.45] },
  mid: { base: [0.8, 0.27, -0.02], foot: [0.85, 1.85], tdir: [0.2, 0.85, -0.5], pole: [0, 1, 0.45] },
  hind: { base: [0.34, 0.26, 0.02], foot: [-1.05, 1.75], tdir: [-0.7, 0.55, -0.45], pole: [-0.25, 1, 0.45] },
};
// the foot's sweep against the body over its stance: duty factor 0.5 times the stride length, 0.67 body length (Clifton et al. 2020:
// 1.8 to 2.6 mm for a 3 mm ant), so 0.5 x 0.67 x 4.9 mm; the foot lifts by a fifth of the hind tibia
const STRIDE = 1.6, LIFT = 0.24;
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
      coxa: { from: k === 'front' ? [0.1, -0.12, 0.24] : [0.02, -0.12, 0.2], r: k === 'front' ? [0.13, 0.15, 0.1] : [0.12, 0.13, 0.09], c: C.leg },
      fem: { r: [0.06, 0.09, 0.05], c: C.leg, flat: 0.8, hair: fringe(14, 0.07, C.hair, 0.5, 0.007) },
      tib: { r: [0.04, 0.05, 0.055], c: C.legHi, flat: 0.9, hair: fringe(16, 0.07, C.hair, 0.4, 0.007) },
      bas: { r: [r(0.036), 0.033, 0.03], c: C.legHi, hair: fringe(10, 0.05, C.hair, 0.3, 0.006) },
      tar: { r: 0.028, c: C.legHi }, claw: 0.05,
    };
    articleLeg(sc, drawBody, drawTube, ch.pts, ch.dir, ch.tip, A, s, MAT.limb);
    // the pectinate spur at the end of the mid and hind tibiae
    if (k !== 'front') drawTube(sc, [ch.pts[2], add(ch.pts[2], mul(norm(add(ch.dir, [0, 0, -0.4])), 0.09))], [0.012, 0.003], { color: C.legHi, gloss: 0.3, bias: 0.005 });
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
