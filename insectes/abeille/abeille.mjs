// Honeybee worker (Apis mellifera), second pass (porteur 2026-10-23: « absolument irréprochable »). Every organ is drawn under
// its own name (sc.part) and grouped in the SVG for animation (PROTOCOLE §3.6). Numbers: ETAT.md, FICHE.md, formes/, grilles/, ailes/.
// Body frame: x forward (the head), y to the bee's left, z up, mm. The origin sits on the axis at the thorax-petiole junction.
import { readFileSync, existsSync } from 'node:fs';
import { add, sub, mul, dot, cross, norm, clamp, rad, rot, mix } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from '../moteur/insecte.mjs';
import { camera } from '../moteur/geo.mjs';
import { X, Y, Z, frame0, env, legChain, segment, articleLeg, sphere, lens, pitched, strokeAxes, curve, lines } from '../moteur/kit.mjs';

const here = (p) => new URL(p, import.meta.url);
const grid = (n) => JSON.parse(readFileSync(here(`./grilles/${n}.json`), 'utf8'));
// measured grids (plat_corps.py + grille_corps.py): c282 dorsal (white plate, even light), the belly from the sternites of c278
const G_ABD = grid('abdomen'), G_THX = grid('thorax');

// ---------------------------------------------------------------------------------------------------------------
// Measures (mm). Worker morphometrics: forewing 9.1 x 3.0, hindwing 6.6, hind femur 2.8, tibia 3.0 (1.2 wide), metatarsus 2.5 x 1.2,
// head width 3.7 (Al-Kahtani & Taha 2021, PLoS ONE 16:e0247262, A. m. carnica; a NW Himalaya survey: head 3.19 x 3.68, forewing
// 9.13 x 3.00, tibia 2.91). Proportions along the body: formes/*.json (SAM on c282, c134 above, c181, c311 in profile).
// ---------------------------------------------------------------------------------------------------------------
const B = {
  abd: [-6.25, -0.3], abdR: 2.1, abdH: 1.86,          // tip to petiole; half width 2.1 (4.2 across), half height
  thx: [-0.2, 3.7], thxR: 1.9, thxH: 1.78,            // propodeum to pronotum
  head: [4.62, 0, 0.42], headT: 0.95, headR: 1.85, headH: 1.72, tilt: 22,
};

const C = {
  cuticle: '#241a14', leg: '#2a1d15', legHi: '#3d2a1c', tarsus: '#4a2c18', claw: '#1a0f08',
  eye: ['#352723', '#4d3c38', '#66534d'],           // c214, c256, c311 (couleur.py: ombre, milieu, lumière hors reflets)
  furPale: '#d9bf8f', furGold: '#c99b5f', furDeep: '#8b6337', faceHair: '#9b7e68', rim: '#f0c789',
  mandible: '#7a4a22', proboscis: '#5a3a1e', glossa: '#b98c5a',
};

// ---- head: a hypognathous capsule, flat front to back, triangular seen from the front (c214: 3.7 mm across the eyes, 3.45 high
// to the clypeus' edge, 2.2 mm across at the mandibles); the face turned down by B.tilt ----------------------------------------
const HR = (v) => rot(v, Y, rad(B.tilt));
const HF = (o) => ({ o, ax: HR(X), ay: Y, az: HR(Z) });
const HP = (v) => add(B.head, HR(v));

function head(sc, pose) {
  sc.part = 'tete';
  drawBody(sc, {
    name: 'head', frame: HF(B.head), color: C.cuticle, seed: 11,
    profile: (t) => { const e = Math.pow(env(t, 0.55, 0.42) / 0.5, 0.62); return { x: -B.headT + 1.95 * t, zc: -0.08, ry: B.headR * Math.min(1, e), rz: B.headH * Math.min(1, e) }; },
    shape: (th) => { const u = Math.sin(th); return [u > 0 ? 1 + 0.05 * u : 1 + 0.42 * u, u < 0 ? 1.1 : 1]; },
    mat: { ks: 0.18, p: 50, ks2: 0.04, env: 0.12, wrap: 0.25, mottle: 0.05, specColor: '#efe8e0' },
    hair: {
      // frons and vertex: dense pale-brown hair (c214 #785b49 .. #9b7e68), the genae behind the eyes long and pale, the clypeus bare
      n: 2600, len: 0.36, w: 0.014, lean: 0.7, a: 0.8, droop: 0.5, twist: 1.0, curl: 0.35, wave: 0.15, pile: 0.4, fleece: 0.35, locks: 0.3,
      sheen: 0.2, rim: { v: 0.25, color: C.rim, k: 0.4 },
      color: (t, th, R) => { const up = Math.sin(th), r = R(); if (t < 0.45) return r < 0.6 ? C.furPale : C.furGold; if (up > 0.35) return r < 0.5 ? '#9b7e68' : r < 0.8 ? '#785b49' : '#c2a37a'; return r < 0.55 ? '#b49a7c' : '#d6c2a0'; },
      density: (t, th) => { const u = Math.sin(th); if (t > 0.62 && u < -0.2) return 0.08; if (t > 0.7 && u < 0.25) return 0.55; return 1; },
      lenAt: (t, th) => (t < 0.45 ? 1.35 : Math.sin(th) > 0.5 ? 1.1 : 0.8),
    },
  });
  // compound eyes: reniform, 2.6 mm long, grey-brown marbled (c214, c256, c311), satin with the window drawn out along the curve,
  // the ommatidia (0.022 mm) seen in close-up, short hairs between them
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const o = HP([0.02, 1.4 * s, 0.08]);
    drawBody(sc, {
      name: 'eye', frame: { o, ax: HR(Z), ay: HR(X), az: [0, s, 0] }, seed: 21 + s, color: C.eye[1],
      profile: (t) => { const r = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -1.32 + 2.64 * t, zc: 0, yc: -0.2 * Math.sin(Math.PI * t), ry: 0.62 * r * (0.82 + 0.3 * t), rz: 0.44 * r }; },
      albedo: (t, th) => {
        // marbling: low-frequency patches about 0.3 mm across, between the measured shadow and light of the eye
        const n = 0.5 + 0.28 * Math.sin(t * 17 + 2.1 * s) * Math.sin(th * 5 + 1.3) + 0.22 * Math.sin(t * 31 - th * 7 + 0.7 * s);
        return n < 0.5 ? mix(C.eye[0], C.eye[1], n * 2) : mix(C.eye[1], C.eye[2], (n - 0.5) * 2);
      },
      mat: { ks: 0.32, p: 70, ks2: 0.07, p2: 7, env: 0.5, wrap: 0.22, amb: 0.42, mottle: 0.04, specColor: '#f2eee8',
        window: { k: 0.85, x: [-0.3, 0.12], y: [0.4, 0.82], soft: 0.06 } },
      ommatidia: { d: 0.022, a: 0.32, ga: 0.45, window: { x: [-0.3, 0.12], y: [0.4, 0.82] } },
      hair: { n: 700, len: 0.13, w: 0.007, lean: 0.45, a: 0.5, pile: 0, fleece: 0, twist: 0.6, curl: 0.1, color: (t, th, R) => (R() < 0.6 ? '#c9b597' : '#9d8a70') },
      bias: 0.05,
    });
  }
  // three ocelli on the vertex, glossy
  sc.part = 'ocelles';
  drawBody(sc, { ...sphere('ocellus', HP([0.22, 0, 1.5]), 0.12, '#1d140e', 0.9), bias: 0.06 });
  for (const s of [1, -1]) drawBody(sc, { ...sphere('ocellus', HP([0.02, 0.42 * s, 1.42]), 0.11, '#1d140e', 0.9), bias: 0.06 });
  // the clypeus: a shining black plate with sparse pale hairs (c214), the labrum under it, the mandibles at the corners
  sc.part = 'clypeus';
  drawBody(sc, {
    ...lens('clypeus', HP([0.8, 0, -0.85]), 0.14, 0.72, 0.62, '#2a211f'), frame: HF(HP([0.8, 0, -0.85])),
    shape: (th) => [1 + 0.18 * Math.sin(th), 1],
    mat: { ks: 0.45, p: 90, ks2: 0.08, env: 0.35, mottle: 0.06, specColor: '#f4efe8' },
    hair: { n: 160, len: 0.16, w: 0.009, lean: 0.4, a: 0.6, pile: 0, fleece: 0, color: () => '#cdb895' },
  });
  sc.part = 'labre';
  drawBody(sc, { ...lens('labrum', HP([0.92, 0, -1.42]), 0.1, 0.36, 0.14, '#4a3020'), mat: { ks: 0.4, p: 70, env: 0.25 } });
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'mandibule-g' : 'mandibule-d';
    drawTube(sc, [HP([0.6, 0.66 * s, -1.38]), HP([0.86, 0.42 * s, -1.6]), HP([0.98, 0.16 * s, -1.7])], [0.15, 0.1, 0.04],
      { color: (i) => (i < 1 ? C.mandible : '#3a2212'), gloss: 0.6, glossColor: '#c98a58', bias: 0.04 });
  }
  antennae(sc, pose);
  proboscis(sc, pose);
}

// Antennae: elbowed, the scape 1.1 mm, the pedicel and ten flagellomeres 2.7 mm (FICHE), dark satin grey-brown with a fine
// pile; the joints show as slight narrowings (c214). Sockets 0.73 mm apart at mid-height of the face.
function antennae(sc, pose) {
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const base = HP([0.92, 0.37 * s, 0.1]);
    const fly = pose === 'vol';
    const scape = norm(fly ? [0.75, 0.25 * s, 0.6] : pose === 'butine' ? [0.45, 0.22 * s, 0.85] : [0.5, 0.2 * s, 0.84]);
    const elbow = add(base, mul(scape, 1.1));
    const pts = [base, add(base, mul(scape, 0.55)), elbow];
    let d = norm(fly ? [0.95, 0.32 * s, 0.05] : pose === 'butine' ? [0.6, 0.28 * s, -0.55] : [0.82, 0.32 * s, 0.1]);
    let p = elbow;
    const seg = 2.7 / 11;
    for (let i = 0; i < 11; i++) {
      pts.push(add(p, mul(d, seg * 0.5))); p = add(p, mul(d, seg)); pts.push(p);
      d = norm(add(d, [0, 0, fly ? -0.03 : -0.085]));
    }
    const radii = pts.map((_, i) => (i < 3 ? 0.072 - 0.01 * (i === 2) : (i % 2 ? 0.08 : 0.069) - 0.0006 * i));
    drawTube(sc, pts, radii, { color: (i) => (i < 2 ? '#2f241e' : '#2a2320'), gloss: 0.3, glossColor: '#8f857e', seed: 50 + s, bias: 0.03 });
  }
}

// The proboscis: folded back under the head at rest and in flight (the brown galeae show as a rod, c262, c278); in the 'butine'
// pose the glossa reaches out into the flower, hairy, between the galeae and the labial palps (c140: 6.3 mm in all).
function proboscis(sc, pose) {
  sc.part = 'trompe';
  if (pose !== 'butine') {
    drawTube(sc, [HP([0.75, 0, -1.72]), HP([0.25, 0, -1.92]), HP([-0.4, 0, -1.95]), HP([-0.95, 0, -1.78])], [0.1, 0.13, 0.12, 0.07],
      { color: C.proboscis, gloss: 0.55, glossColor: '#d8a070', bias: -0.05 });
    return;
  }
  const m0 = HP([0.95, 0, -1.72]), dir = norm(HR([0.55, 0, -0.84]));
  for (const s of [1, -1]) {
    // galeae: brown sheaths along the first half; labial palps beside them
    drawTube(sc, [add(m0, [0, 0.06 * s, 0]), add(add(m0, mul(dir, 0.9)), [0, 0.07 * s, 0]), add(add(m0, mul(dir, 1.7)), [0, 0.03 * s, 0])], [0.09, 0.075, 0.03],
      { color: '#6a4220', gloss: 0.6, glossColor: '#e0a870', bias: 0.03 });
  }
  const gl = [];
  for (let i = 0; i <= 8; i++) { const f = i / 8; gl.push(add(add(m0, mul(dir, 1.2 + 2.4 * f)), [0, 0, -0.12 * f * f])); }
  drawTube(sc, gl, gl.map((_, i) => 0.055 - 0.003 * i), {
    color: C.glossa, gloss: 0.35, glossColor: '#f0d8b0', bias: 0.02,
    hair: gl.slice(0, -1).map(() => ({ n: 14, len: 0.07, w: 0.006, color: '#e6d2b0', side: [0, 1, 0], both: true, lean: 0.6, a: 0.8 })),
  });
  // the flabellum: the small spoon at the tip
  drawBody(sc, { ...sphere('flabellum', gl[gl.length - 1], 0.06, '#d8b88c', 0.4), bias: 0.03 });
}

// ---- thorax: nearly a sphere, 3.9 mm long, 3.8 wide, 3.6 high (c282, c181), its fur in the measured colours of its grid:
// the dense golden-brown fur of the pleura, the scutum darker and shorter haired (c282, c256), the collar of the pronotum pale --
function thorax(sc) {
  sc.part = 'thorax';
  const [x1, x0] = B.thx, L = x0 - x1;
  drawBody(sc, {
    name: 'thorax', frame: frame0([x1, 0, 0.12]), color: C.cuticle, seed: 21, grid: G_THX,
    mat: { ks: 0.07, p: 18, env: 0.05, wrap: 0.35, mottle: 0.06 },
    profile: (t) => { const e = Math.pow(env(t, 0.46, 0.5) / 0.5, 0.6); return { x: L * t, zc: 0.12 + 0.22 * Math.sin(Math.PI * Math.pow(t, 0.8)), ry: B.thxR * Math.min(1, e), rz: B.thxH * Math.min(1, e) }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.86 : 1],
    hair: {
      // c256, c181, c214: hairs 0.4 mm on the scutum to 0.75 mm on the pleura and the collar, curved back along the body, plumose
      n: 11000, len: 0.56, w: 0.015, lean: 0.95, a: 0.88, droop: 0.75, twist: 1.0, wave: 0.18, curl: 0.38, fleece: 0.45, pile: 0.55, locks: 0.38,
      sheen: 0.22, sheenP: 30, color: 'grid', gridK: 1.18, rim: { v: 0.24, color: C.rim, k: 0.45 },
      lenAt: (t, th) => { const u = Math.sin(th); return u > 0.75 && t > 0.25 && t < 0.85 ? 0.72 : t > 0.88 ? 1.25 : u < -0.2 ? 1.2 : 1; },
      density: (t, th) => (Math.sin(th) > 0.8 && t > 0.35 && t < 0.8 ? 0.7 : 1),
    },
  });
  // tegulae: small shining brown scales over the forewings' bases
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegula-g' : 'tegula-d';
    drawBody(sc, {
      name: 'tegula', frame: pitched([2.62, 1.5 * s, 1.2], -8), color: '#3a2616', seed: 23 + s,
      profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -0.3 + 0.6 * t, zc: 0, ry: 0.22 * e, rz: 0.1 * e }; },
      mat: { ks: 0.5, p: 80, env: 0.35, specColor: '#ffe8cc' }, bias: 0.08,
    });
  }
}

// ---- abdomen: six tergites, each overlapping the next toward the tip (a lip and its shadow), the amber cuticle of T1-T3 letting
// the light through, dark hind margins, the pale felt bands (tomentum) and a short pile; long hairs on T1 (c282, c134, c311) -----
const TERG = [[0.8, 1.0], [0.62, 0.8], [0.45, 0.62], [0.3, 0.45], [0.16, 0.3], [0, 0.16]]; // t from the tip (0) to the petiole (1)
const gridLC = (G, t, th) => {
  const u = (Math.asin(clamp(Math.sin(th), -1, 1)) + Math.PI / 2) / Math.PI;
  const h = G.rows[Math.round(clamp(t, 0, 1) * (G.rows.length - 1))][Math.round(u * (G.rows[0].length - 1))];
  const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const mx = Math.max(...v), mn = Math.min(...v);
  return { L: (v[0] + v[1] + v[2]) / 3, C: mx - mn };
};
function abdomen(sc, pose) {
  sc.part = 'abdomen';
  const [xt, x0] = B.abd, L = x0 - xt;
  const step = (t) => { for (const [a, b] of TERG) if (t >= a && t <= b) return 1 + 0.06 * Math.pow((b - t) / (b - a), 1.5); return 1; };
  const edgeD = (t) => Math.min(...TERG.map(([a]) => Math.abs(t - a)));
  drawBody(sc, {
    name: 'abdomen', frame: pitched([x0, 0, -0.12], pose === 'vol' ? -14 : -6), color: '#3a2a1c', seed: 41, grid: G_ABD,
    // t from the tip to the petiole: round at the tip, widest at 55 % (c282), narrowing into the petiole
    profile: (t) => {
      const e = Math.pow(env(t, 0.55, 0.3) / 0.62, 0.9) * step(t);
      return { x: -L * (1 - t), zc: -0.08 - 0.5 * Math.pow(1 - t, 1.7), ry: B.abdR * e, rz: B.abdH * e };
    },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.84 : 1],
    mat: { ks: 0.2, p: 55, ks2: 0.05, p2: 6, env: 0.12, wrap: 0.38, mottle: 0.05, specColor: '#fff2dc', transAlb: { k: 0.42, g: 1.6, core: 0.18, p: 0.6 } },
    hair: {
      n: 3000, len: 0.2, w: 0.01, lean: 1.35, a: 0.62, twist: 0.6, wave: 0.12, curl: 0.2, fleece: 0, pile: 0.3, locks: 0.2, sheen: 0.12,
      color: 'grid', gridK: 1.0, rim: { v: 0.2, color: '#e9c88e', k: 0.3 },
      // dense where the grid shows the pale felt (light, unsaturated), sparse on the bare amber and on the dark margins
      density: (t, th) => { if (t > 0.86) return 1; const g = gridLC(G_ABD, t, th); return g.C < 0.16 && g.L > 0.42 ? 1 : edgeD(t) < 0.025 ? 0.7 : 0.3; },
      lenAt: (t) => (t > 0.86 ? 2.6 : t < 0.1 ? 1.4 : 1),
    },
  });
}

// ---- legs: coxa, trochanter-femur, tibia, basitarsus, four tarsomeres, two claws (PROTOCOLE §4.5). Black-brown glossy cuticle,
// long pale hairs on the femora, the hind tibia widening into the corbicula (a smooth glossy plate fringed with long curved hairs),
// the broad hind basitarsus with its golden pollen brush (c273, c181, c256) --------------------------------------------------------
const LEGS = {
  front: { base: [3.05, 0.55, -1.28], fem: 1.9, tib: 1.9, tar: 2.0, segs: [0.48, 0.13, 0.11, 0.11, 0.17] },
  mid: { base: [2.0, 0.85, -1.48], fem: 2.3, tib: 2.3, tar: 2.4, segs: [0.5, 0.13, 0.11, 0.1, 0.16] },
  hind: { base: [0.95, 0.88, -1.38], fem: 2.8, tib: 3.0, tar: 3.9, segs: [0.64, 0.09, 0.08, 0.07, 0.12] },
};
const LEGMAT = { ks: 0.55, p: 75, ks2: 0.08, p2: 6, env: 0.4, mottle: 0.05, specColor: '#fff2e6' };
const fr = (n, len, color, edge = 0.75, w = 0.012, lean = 0.75) => ({ n, len, w, lean, a: 0.85, twist: 0.6, curl: 0.3, pile: 0, fleece: 0.3, color: typeof color === 'function' ? color : () => color, density: (t, th) => (Math.abs(Math.cos(th)) > edge ? 1 : 0.1) });
const ART = {
  front: { coxa: { from: [0.05, -0.28, 0.35], r: [0.22, 0.25, 0.2], c: C.leg, hair: fr(80, 0.4, C.furPale, 0) }, fem: { r: [0.15, 0.2, 0.13], c: C.leg, hair: fr(110, 0.38, C.furPale, 0.3) },
    tib: { r: [0.1, 0.13, 0.15], c: C.legHi, hair: fr(60, 0.22, '#c9a477', 0.5) }, bas: { r: [0.11, 0.1, 0.08], c: C.tarsus, flat: 0.6, hair: fr(60, 0.14, '#c89a5a', 0.2) },
    tar: { r: 0.06, c: C.tarsus, hair: fr(8, 0.1, '#b48a5c', 0) }, claw: 0.075 },
  mid: { coxa: { from: [0.05, -0.3, 0.35], r: [0.24, 0.27, 0.22], c: C.leg, hair: fr(80, 0.45, C.furPale, 0) }, fem: { r: [0.16, 0.22, 0.14], c: C.leg, hair: fr(130, 0.4, C.furPale, 0.3) },
    tib: { r: [0.1, 0.14, 0.16], c: C.legHi, hair: fr(70, 0.24, '#c9a477', 0.5) }, bas: { r: [0.13, 0.12, 0.09], c: C.tarsus, flat: 0.55, hair: fr(70, 0.15, '#c89a5a', 0.2) },
    tar: { r: 0.062, c: C.tarsus, hair: fr(8, 0.1, '#b48a5c', 0) }, claw: 0.08 },
  hind: { coxa: { from: [0.05, -0.3, 0.35], r: [0.26, 0.29, 0.24], c: C.leg, hair: fr(80, 0.45, C.furPale, 0) }, fem: { r: [0.18, 0.25, 0.16], c: C.leg, hair: fr(140, 0.42, C.furPale, 0.3) },
    // the corbicula: 1.2 mm wide at its end, a glossy plate, fringed on both edges with long hairs bent over it
    tib: { r: [0.12, 0.3, 0.5], c: '#2e1d12', flat: 0.26, hair: fr(220, 0.62, (t, th, R) => (R() < 0.6 ? '#d9b98a' : '#b8925e'), 0.88, 0.012, 1.05) },
    bas: { r: [0.4, 0.46, 0.38], c: '#3a2414', flat: 0.24, hair: fr(200, 0.2, (t, th, R) => (R() < 0.6 ? '#c8945a' : '#e0b878'), 0.15, 0.012, 0.9) },
    tar: { r: 0.07, c: C.tarsus, hair: fr(8, 0.1, '#b48a5c', 0) }, claw: 0.09 },
};
const CORBMAT = { ks: 0.7, p: 110, ks2: 0.12, p2: 8, env: 0.55, mottle: 0.04, specColor: '#fff6ea' };

function poseLegs(pose, side, ph = 0) {
  const G = -3.3; // ground under the standing bee
  if (pose === 'vol') {
    // in flight the legs hang, the hind pair trailing (c018, c026, c321)
    return {
      front: [[4.2, 0.95, -2.5], [0.4, 0.15, -1], [0.2, 0.6, 1]],
      mid: [[2.1, 1.5, -3.4], [-0.3, 0.2, -1], [0, 1, 0.6]],
      hind: [[-1.2, 1.3, -3.6], [-0.6, 0.12, -1], [0, 1, 0.8]],
    };
  }
  const feet = { front: [5.2, 1.35], mid: [2.9, 2.6], hind: [-3.4, 2.0] };
  const tdir = { front: [0.5, 0.2, -0.85], mid: [0.35, 0.5, -0.8], hind: [-0.75, 0.25, -0.6] };
  const res = {};
  for (const k of ['front', 'mid', 'hind']) {
    let [fx, fy] = feet[k]; let lift = 0;
    if (pose === 'butine' && k === 'front') { fx += 0.5; fy -= 0.2; }
    if (pose === 'marche') {
      const tri = (k === 'mid') === (side > 0) ? 0 : 0.5;
      const q = (ph + tri) % 1, stride = 1.1;
      if (q < 0.5) fx += stride * (0.5 - 2 * q);
      else { const u = (q - 0.5) * 2; fx += stride * (-0.5 + u); lift = Math.sin(Math.PI * u) * 0.55; }
    }
    const Lg = LEGS[k], td = norm(tdir[k]);
    const tip = [fx, fy, G + lift];
    const ankle = sub(tip, mul(td, Lg.tar * 0.95));
    res[k] = [ankle, tdir[k], k === 'hind' ? [-0.2, 0.3, 1] : k === 'mid' ? [-0.3, 0.6, 1] : [0.2, 0.5, 1]];
  }
  return res;
}

function legs(sc, pose, frame, pollen) {
  for (const s of [1, -1]) {
    const P = poseLegs(pose, s, pose === 'marche' ? frame : 0);
    for (const k of ['front', 'mid', 'hind']) {
      sc.part = `patte-${k === 'front' ? 'avant' : k === 'mid' ? 'milieu' : 'arriere'}-${s > 0 ? 'g' : 'd'}`;
      const [ankle, td, pole] = P[k];
      const ch = legChain(LEGS[k], s, ankle, td, pole, LEGS[k].segs, 0.06);
      const A = ART[k];
      articleLeg(sc, drawBody, drawTube, ch.pts, ch.dir, ch.tip, A, s, LEGMAT);
      if (k === 'hind') {
        // the corbicula's glossy face over the tibia, a little out from it (the outer face, concave and bare)
        const q = ch.pts, mid = mul(add(q[1], q[2]), 0.5), out = [0, 0.16 * s, 0.02];
        sc.part = `corbeille-${s > 0 ? 'g' : 'd'}`;
        drawBody(sc, segment('corbicula', add(add(q[1], mul(sub(q[2], q[1]), 0.35)), out), add(q[2], out), [0.12, 0.27, 0.33], { color: '#24160e', mat: CORBMAT, seed: 77 + s, up: [0, s, 0], flat: 0.12, bias: 0.04 }));
        if (pollen) {
          sc.part = `pelote-${s > 0 ? 'g' : 'd'}`;
          drawBody(sc, { ...sphere('pollen', add(mid, [0, 0.45 * s, 0.05]), 0.62, '#d9a93e', 0.05), shade: { hl: 0.1, dark: 0.45 }, mat: { ks: 0.02, env: 0, mottle: 0.15 },
            hair: { n: 500, len: 0.05, w: 0.045, lean: 0.1, a: 0.7, pile: 0, fleece: 0, color: (t, th, R) => (R() < 0.5 ? '#f0cd6a' : '#c8962e') }, bias: 0.06 });
        }
      }
    }
  }
}

// ---- wings: the membrane measured on spread specimens (ailes/*.json, outils/membrane.py) when present; otherwise the drawn pair --
// The drawn pair stays exported unchanged as FOREWING and HINDWING: the bumblebee module scales it (bourdon.mjs).
export const FOREWING = {
  span: 9.2, tint: '#9a7a5c', vein: '#6a4424', edge: '#7b6246', membrane: 0.07, vw: 0.05, ew: 0.035, irid: 0.14,
  outline: curve([[0, 0.22], [1.2, 0.45], [2.8, 0.68], [4.6, 0.82], [6.4, 0.84], [7.8, 0.62], [8.8, 0.2], [9.2, -0.35],
    [9.0, -0.95], [8.3, -1.6], [7.1, -2.12], [5.6, -2.36], [4.1, -2.24], [2.7, -1.75], [1.5, -1.05], [0.6, -0.48], [0.05, -0.12]]),
  veins: lines([
    [[0.05, 0.12], [2.6, 0.5], [5.1, 0.76]], [[0.15, 0.02], [2.9, 0.3], [4.45, 0.46], [5.15, 0.62]],
    [[5.1, 0.76], [6.9, 0.58], [8.15, 0.36], [8.55, 0.22], [8.25, 0.14], [7.0, 0.28], [6.0, 0.45], [5.15, 0.62]],
    [[2.9, 0.3], [3.35, -0.62]], [[0.25, -0.12], [1.8, -0.4], [3.35, -0.62], [4.95, -0.98], [6.75, -1.22], [7.6, -1.32]],
    [[4.45, 0.46], [4.35, -0.18], [5.6, -0.36], [6.6, -0.46], [7.35, -0.56], [7.65, 0.2]],
    [[5.4, 0.55], [5.6, -0.36]], [[6.4, 0.43], [6.6, -0.46]],
    [[4.35, -0.18], [4.95, -0.98]], [[5.6, -0.36], [5.75, -1.06]], [[6.6, -0.46], [6.75, -1.22]],
    [[0.35, -0.32], [1.6, -0.78], [2.8, -1.12], [4.6, -1.52], [6.2, -1.82]], [[2.8, -1.12], [3.35, -0.62]], [[4.6, -1.52], [4.95, -0.98]],
    [[0.45, -0.45], [1.4, -0.98], [2.25, -1.35]],
  ]),
};
export const HINDWING = {
  span: 6.4, tint: '#9a7a5c', vein: '#6a4424', edge: '#7b6246', membrane: 0.06, vw: 0.045, ew: 0.03, irid: 0.14,
  outline: curve([[0, 0.12], [1.4, 0.34], [3.3, 0.48], [5.0, 0.44], [6.0, 0.2], [6.4, -0.18], [6.1, -0.62], [5.0, -1.05],
    [3.6, -1.32], [2.2, -1.3], [1.5, -1.05], [1.2, -1.12], [0.7, -0.82], [0.2, -0.4], [0.02, -0.1]]),
  veins: lines([
    [[0.05, 0.08], [1.8, 0.32], [3.4, 0.44]], [[0.15, -0.08], [1.4, -0.28], [2.5, -0.42], [4.2, -0.62], [5.6, -0.7]],
    [[2.5, -0.42], [2.7, 0.3]], [[0.3, -0.3], [1.3, -0.62], [2.5, -0.42]], [[1.3, -0.62], [2.4, -1.02], [3.6, -1.22]],
  ]),
};

// A measured membrane (membrane.py plat) as an engine wing: the outline as a smooth path, the veins grouped by width, the tint and
// opacity that give over a white plate the transmission measured (T per channel: alpha = 1 - min T, the tint C = 1 - (1 - T) / alpha).
function measuredWing(name, drawn) {
  const p = here(`./ailes/${name}.json`);
  if (!existsSync(p)) return drawn;
  const R = JSON.parse(readFileSync(p, 'utf8'));
  const sm = (P) => curve(P.map(([s, q]) => [Math.round(s * 1000) / 1000, Math.round(q * 1000) / 1000]));
  const T = R.membrane?.transmission ?? [0.9, 0.86, 0.78];
  const a = clamp(1 - Math.min(...T), 0.04, 0.6);
  const tint = '#' + T.map((t) => Math.round(255 * Math.pow(clamp(1 - (1 - t) / a, 0, 1), 1 / 2.2)).toString(16).padStart(2, '0')).join('');
  const groups = (R.nervures || []).map((g) => ({ w: g.largeur, c: g.c, d: g.traits.map((l) => 'M' + l.map((q) => q.join(' ')).join('L')).join('') }));
  const box = R.contour.reduce((b, [s, q]) => [Math.min(b[0], s), Math.min(b[1], q), Math.max(b[2], s), Math.max(b[3], q)], [1e9, 1e9, -1e9, -1e9]);
  return { ...drawn, span: R.longueur, outline: sm(R.contour), box, veinGroups: groups, tint, membrane: a, edge: R.couleur_nervures || drawn.edge, ew: 0.025, vein: R.couleur_nervures || drawn.vein, measured: true };
}
const FORE = measuredWing('avant', FOREWING), HIND = measuredWing('arriere', HINDWING);

// Flight (DECISIONS: a fake of 2 or 3 drawings, two wing sets each, no blur). The positions follow the bee's stroke (Altshuler et
// al. 2005, PNAS 102:18213: about 230 Hz, a short amplitude of about 90 degrees in a nearly horizontal stroke plane, the wing turning
// over at each reversal; the tip draws a flat figure of eight). phi: the stroke angle about the vertical (negative forward), psi:
// the chord's pitch about the span, dev: the deviation out of the stroke plane (deg).
export const FLIGHT = [
  [{ phi: -46, psi: 100, dev: 5, a: 0.62 }, { phi: -34, psi: 62, dev: 1, a: 0.34 }],   // front reversal, the wing turning over
  [{ phi: -6, psi: 42, dev: -5, a: 0.62 }, { phi: 12, psi: 40, dev: -3, a: 0.34 }],    // mid stroke
  [{ phi: 38, psi: 112, dev: 3, a: 0.62 }, { phi: 47, psi: 92, dev: 6, a: 0.34 }],     // back reversal
];
const HINGE = { fore: [2.62, 1.3, 1.42], hind: [1.5, 1.3, 1.28] };

function wings(sc, pose, frame) {
  for (const s of [1, -1]) {
    const lr = s > 0 ? 'g' : 'd';
    const fo = [HINGE.fore[0], HINGE.fore[1] * s, HINGE.fore[2]], ho = [HINGE.hind[0], HINGE.hind[1] * s, HINGE.hind[2]];
    if (pose === 'vol') {
      for (const w of FLIGHT[frame % FLIGHT.length]) {
        const f = strokeAxes(s, w.phi, w.psi, 8 + w.dev);
        sc.part = `aile-avant-${lr}`;
        drawWing(sc, FORE, fo, f.e1, f.e2, { alpha: w.a });
        // the hindwing hooked to the forewing (hamuli, 21 to 23): the same stroke, a few degrees behind
        const h = strokeAxes(s, w.phi + 6, w.psi, 6 + w.dev);
        sc.part = `aile-arriere-${lr}`;
        drawWing(sc, HIND, ho, h.e1, h.e2, { alpha: w.a, bias: -0.01 });
      }
    } else {
      // at rest: folded flat over the abdomen, a little apart, the forewing over the hindwing (c311, c181, c166)
      const e1 = norm([-0.985, 0.14 * s, -0.06]);
      const e2 = norm(sub([0, s, -0.1], mul(e1, dot([0, s, -0.1], e1))));
      sc.part = `aile-avant-${lr}`;
      drawWing(sc, FORE, fo, e1, e2, { bias: 0.03 + (s > 0 ? 0.01 : 0) });
      const h1 = norm([-0.99, 0.1 * s, -0.05]);
      const h2 = norm(sub([0, s, -0.1], mul(h1, dot([0, s, -0.1], h1))));
      sc.part = `aile-arriere-${lr}`;
      drawWing(sc, HIND, ho, h1, h2, { bias: 0.015 });
    }
  }
}

// ---- assembly ---------------------------------------------------------------------------------------------------
// opts: pose 'pose' | 'vol' | 'marche' | 'butine', frame (flight drawing 0..2, walk phase 0..1), pollen
export function bee(az, el, opts = {}) {
  const { size = 512, k = 30, pose = 'pose', frame = 0, pollen = false, bg = null, detail = 1, idp = '', light } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 7, idp);
  sc.detail = detail;
  thorax(sc);
  abdomen(sc, pose);
  head(sc, pose);
  legs(sc, pose, frame, pollen);
  wings(sc, pose, frame);
  sc.part = '';
  return sc.svg(size, size, bg);
}

export const META = {
  id: 'abeille', bodyMm: 12.5, span: 22, wingspan: 22,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0, 1, 2], butine: [0] },
  lod: {
    S: { cell: 64, az: 15, poses: ['pose', 'marche', 'vol', 'butine'] },
    L: { cell: 152, az: 30, poses: ['pose', 'vol'] },
  },
};
export const draw = (az, el, opts = {}) => bee(az, el, { pollen: false, ...opts });
export const WINGS = { fore: FORE, hind: HIND };
