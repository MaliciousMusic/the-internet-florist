// Black garden ant, worker (Lasius niger), 4.0 mm from the mandibles to the tip of the gaster: dark brown cuticle under a fine
// grey pubescence, a single upright scale at the waist, the gaster in four tergites with pale hind margins, the formicine acidopore.
// Measured (ETAT.md, refcache/lasius-niger): the lengths on the AntWeb worker casent0178774 at scale (c033 head 0.2 mm bar,
// c095 dorsal and c138 profile 0.5 mm bar), the proportions and the stance on the living workers c254 (profile), c248 (above),
// c107 (profile, natural light), the head and its organs on c237, c238, c257 to c260, c245, c230.
// The colours are the grids of outils/grille_fourmi.py on c248 (studio light taken off), brought to the level of the living ants.
// Body frame: x forward, y to the left, z up, mm; the ground at z = 0; the origin under the waist.
// Every organ is drawn under its own name (sc.part), and the SVG keeps one group per organ (PROTOCOLE §3.6).
// The model is drawn here, not in moteur/fourmi.mjs, which stays the red ant's (session 06).
import { readFileSync } from 'node:fs';
import { add, sub, mul, dot, cross, norm, len, rot, clamp, camera, mix } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube } from '../moteur/insecte.mjs';
import { env, ik, segment } from '../moteur/kit.mjs';

const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
const G_GASTER = grid('gastre'), G_MESO = grid('mesosome'), G_HEAD = grid('tete');

// ---------------------------------------------------------------------------------------------------------------
// Measures (mm). CL / CW / SL on c033 (0.2 mm bar: 608 px/mm): head 0.95 long (occiput to the clypeus' margin), 0.93 wide over the
// eyes, 0.70 wide at the clypeus; eye 0.24 x 0.17, its centre at 35 % of CL from the occiput; antennal sockets 0.35 apart at 74 % of
// CL; scape 0.90 mm, 0.055 thick at its base and 0.07 at its tip; funiculus of 11 articles thickening from 0.05 to 0.075.
// c095 (0.5 mm bar: 347 px/mm): pronotum 0.65 wide, mesonotum 0.49, propodeum 0.47, petiole scale 0.28, gaster 1.25.
// c254 (profile, along the body axis): head 22 %, mesosoma 36 %, petiole 4.5 %, gaster 38 % of the length; petiole scale 17 % of
// the length high; the scale's top lower than the propodeum's dorsum; the gaster's top level with the pronotum.
// ---------------------------------------------------------------------------------------------------------------
export const B = {
  len: 4.0,
  head: { CL: 1.0, CW: 0.86, CWeyes: 0.93, depth: 0.64, pitch: 40, eyeT: 0.42, eye: [0.26, 0.18], socketT: 0.64, socketY: 0.17 },
  scape: 0.88, funi: [0.13, 0.085, 0.08, 0.08, 0.08, 0.082, 0.084, 0.086, 0.088, 0.09, 0.16],
  neck: [1.16, 0, 0.98],
  meso: { x0: -0.30, x1: 1.20, groove: 0.30 },
  petiole: { x: -0.38, base: 0.62, top: 1.06, w: 0.30, th: 0.09, lean: 14 },
  gaster: { x0: -0.46, x1: -2.02, w: 1.2, h: 1.1, zFront: 0.92, zTip: 0.6 },
  // legs: coxa, femur, tibia, tarsus (basitarsus 40 %); from c095, c248, c254 and the AntWeb profile
  legs: {
    fore: { coxa: [0.92, 0.12, 0.60], fem: 0.86, tib: 0.74, tar: 0.88, foot: [1.8, 1.2], knee: [0.6, 0.8, 0.7] },
    mid: { coxa: [0.30, 0.17, 0.56], fem: 0.96, tib: 0.86, tar: 0.98, foot: [0.0, 1.85], knee: [-0.25, 1, 0.8] },
    hind: { coxa: [-0.04, 0.17, 0.58], fem: 1.12, tib: 1.04, tar: 1.22, foot: [-1.95, 1.5], knee: [-0.7, 0.8, 0.6] },
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Colours and materials. Albedo levels set on the living workers in daylight (c107, c245: the gaster L* 20 in its middle tones,
// 45 to 55 in its lights); hues from the grids (h 60 to 70, a little redder on the mesosoma, h 50).
// ---------------------------------------------------------------------------------------------------------------
// one daylight tone for the three pieces (L* 20, a* 3, b* 4: c107, c245, c237); the red-brown kept for the joints and mandibles
const C = {
  body: '#3a2a1e', meso: '#3b2a1e', head: '#37281e', leg: '#45311f', legPale: '#5c4129', tarsus: '#6e5236', mand: '#4e2412',
  mandTip: '#2a1208', antenna: '#3a2d22', antTip: '#4a3a2c', eye: '#3e3c38', pub: '#b8a070', seta: '#c8ac7a', clypeus: '#30271f',
};
// the cuticle: a broad soft sheen under the pubescence (the gaster) or a finely microreticulate matt surface (head, mesosoma)
// a diffuse satin, warm, soft-edged (no hard white patch: the pubescence spreads the light)
const MAT_GASTER = { ks: 0.24, p: 48, ks2: 0.05, p2: 5, env: 0.02, wrap: 0.28, amb: 0.36, mottle: 0.012, specColor: '#f2e2c8' };
const MAT_TRUNK = { ks: 0.2, p: 32, ks2: 0.05, p2: 6, env: 0.06, wrap: 0.25, amb: 0.36, mottle: 0.012, specColor: '#f2eee8' };
const MAT_LEG = { ks: 0.26, p: 34, ks2: 0.06, p2: 6, env: 0.08, wrap: 0.3, amb: 0.4, mottle: 0.01, specColor: '#f6f0e6' };
const MAT_EYE = { ks: 0.16, p: 30, ks2: 0.06, p2: 6, env: 0.1, wrap: 0.15, amb: 0.32, mottle: 0.08, specColor: '#ffffff' };

const deg = (d) => (d * Math.PI) / 180;
const Y = [0, 1, 0], Z = [0, 0, 1];
// a frame from an origin, an axis and an up hint (az orthogonal to ax, ay = az x ax: right-handed like frame0)
function frameOf(o, dir, up = Z) {
  const ax = norm(dir); let az = sub(up, mul(ax, dot(up, ax)));
  if (len(az) < 1e-4) az = sub(Y, mul(ax, dot(Y, ax)));
  az = norm(az);
  return { o, ax, ay: cross(az, ax), az };
}
const sy = (p, s) => [p[0], p[1] * s, p[2]];
const lerp = (a, b, t) => a + (b - a) * t;

// pubescence (fine appressed hairs, lying back along the cuticle) and erect setae, as hair layers of the engine
const pub = (n, lenMm, extra = {}) => ({ n, len: lenMm, w: 0.0024, lean: 1.5, a: 0.45, droop: 0.05, twist: 0.04, curl: 0.03, wave: 0.01,
  fleece: 0, pile: 0, locks: 0.1, sheen: 0.25, sheenP: 40, color: () => C.pub, ...extra });
const setae = (n, lenMm, density, extra = {}) => ({ n, len: lenMm, w: 0.0028, lean: 0.5, a: 0.62, droop: 0.2, twist: 0.3, curl: 0.1, wave: 0.03,
  fleece: 0, pile: 0, locks: 0, sheen: 0.3, sheenP: 30, color: () => C.seta, density, ...extra });

// ---------------------------------------------------------------------------------------------------------------
// Head: the capsule, the eyes, the clypeus and its sockets, the mandibles, the palps, the antennae.
// The capsule is long-oval in face view, the occipital margin almost straight, the sides gently convex, narrowing to the clypeus;
// held face down at 38 deg in walking (c254, c107). P: pose parameters (head pitch, mandible gape, antenna angles).
// ---------------------------------------------------------------------------------------------------------------
function headFrame(P) {
  const pitch = B.head.pitch + (P.headPitch || 0);
  const ax = [Math.cos(deg(pitch)), 0, -Math.sin(deg(pitch))];
  const F = frameOf(add(B.neck, [0.02, 0, 0.10 + (P.headLift || 0)]), ax, Z);
  // a turn of the head (yaw) around the neck, for the antennation of an encounter
  if (P.headYaw) { const a = deg(P.headYaw); F.ax = rot(F.ax, Z, a); F.ay = rot(F.ay, Z, a); F.az = rot(F.az, Z, a); }
  return F;
}
// a point of the head frame: u along the head (0 occiput, CL clypeus), v to the left, w up (toward the vertex)
const hp = (F, u, v, w) => add(add(add(F.o, mul(F.ax, u)), mul(F.ay, v)), mul(F.az, w));

function head(sc, P) {
  const H = B.head, F = headFrame(P), CL = H.CL;
  sc.part = 'tete';
  drawBody(sc, {
    name: 'head', frame: F, color: C.head, seed: 7, grid: G_HEAD, mat: MAT_TRUNK,
    profile: (t) => {
      // rear: a short rounded cap (the occipital margin); front: the clypeus, cut short where the mandibles hang
      const back = Math.pow(clamp(t / 0.12), 0.5), front = Math.pow(clamp((1 - t) / 0.07), 0.6);
      // a superellipse in face view: broadest at the eyes (t 0.45), the sides convex, 0.75 of the width at the clypeus (c033, c237)
      const wide = t < 0.42 ? Math.pow(1 - Math.pow((0.42 - t) / 0.62, 2.2), 1 / 2.2) : Math.sqrt(1 - 0.62 * Math.pow((t - 0.42) / 0.58, 2));
      return { x: CL * t, zc: 0.03 * Math.sin(Math.PI * t) - 0.06 * t * t, ry: (H.CW / 2) * wide * back * Math.max(0.3, front), rz: (H.depth / 2) * back * Math.max(0.3, front) * Math.sqrt(Math.max(0.12, 1 - Math.pow((t - 0.38) / 0.7, 2))) };
    },
    // flatter on the vertex and on the underside, rounder at the sides
    shape: (th) => [1, Math.sin(th) > 0 ? 0.9 : 0.94],
    punct: { n: 1400, r: 0.0042, color: '#140c08', a: 0.24, glint: '#e0d0b0' },
    // dense appressed pubescence, a few erect setae on the vertex (c238, c257, c258)
    hair: pub(11000, 0.028, { a: 0.4, color: () => '#a89068' }), hairMore: [setae(40, 0.055, (t, th) => 1, { color: () => '#b9ad96', a: 0.45, lean: 0.75 }), setae(12, 0.09, (t, th) => (Math.sin(th) > 0.3 ? 1 : 0.25))],
    bias: 0.0,
  });
  // eyes: oval, slightly convex, dark grey with the facets' sheen; at 35 % of CL, on the side a little above the midline
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const [el, ew] = H.eye, u = H.eyeT * CL;
    const c = hp(F, u, s * (H.CW / 2) * 0.9, 0.05);
    const out = norm(add(mul(F.ay, s), mul(F.az, 0.32)));
    // the eye's frame: its long axis along the head, its bulge outward
    const ax = F.ax, az = out, ay = cross(az, ax);
    drawBody(sc, {
      name: 'eye', frame: { o: sub(c, mul(ax, el / 2)), ax, ay, az }, color: C.eye, seed: 31 + s, mat: MAT_EYE,
      profile: (t) => { const e = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: el * t, zc: -0.012, ry: (ew / 2) * e, rz: 0.04 * e }; },
      facets: 0.017, facetsA: 3.5, bias: 0.03,
    });
  }
  // clypeus: the median plate of the face, from 72 % of CL to the anterior margin (a quarter of the face), convex, with a median
  // carina and a convex anterior margin (c033, c238); its pubescence dense (the mark of L. niger against L. platythorax)
  sc.part = 'tete';
  drawBody(sc, {
    name: 'clypeus', frame: frameOf(hp(F, CL * 0.70, 0, H.depth * 0.2), F.ax, F.az), color: C.clypeus, seed: 41, grid: G_HEAD, mat: MAT_TRUNK,
    profile: (t) => { const e = Math.pow(env(t, 0.45, 0.3) / 0.42, 0.6); return { x: CL * 0.3 * t, zc: -0.1 * t * t, ry: 0.2 * e * (1 - 0.2 * t), rz: 0.05 * e }; },
    shape: (th) => [1, 1 + 0.5 * Math.pow(Math.max(0, Math.sin(th)), 8)], // the median carina, a ridge along the top
    hair: pub(900, 0.03, { a: 0.42, lean: 1.35, color: () => '#a8a094' }), hairMore: [setae(8, 0.1, () => 1, { lean: 0.9 })], bias: 0.02,
  });
  mandibles(sc, F, P);
  palps(sc, F, P);
  antennae(sc, F, P);
  sc.part = '';
  return F;
}

// Mandibles: triangular blades hinged at the front corners of the head, closed across each other under the clypeus at rest; their
// masticatory margin with 7 to 8 teeth, the apical one longest; reddish brown, darker at the teeth (c033, c230, c245).
function mandibles(sc, F, P) {
  const CL = B.head.CL, gape = P.gape || 0;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'mandibule-g' : 'mandibule-d';
    const base = hp(F, CL * 0.86, s * 0.23, -0.12);
    // closed: toward the midline and a little forward; open: swung outward by the gape
    const dir = norm(rot(add(mul(F.ax, 0.86), mul(F.ay, -s * 0.5)), F.az, deg(s * gape)));
    const fr = frameOf(base, dir, add(F.az, mul(F.ax, -0.35)));
    const Lm = 0.42;
    drawBody(sc, {
      // dark at the base, red-orange on the blade, darker again along the teeth (c245, c230, c237)
      name: 'mandible', frame: fr, color: C.mand, seed: 60 + s, mat: { ...MAT_LEG, ks: 0.22, p: 40, env: 0.06 },
      albedo: (t) => (t < 0.35 ? mix('#261810', C.mand, t / 0.35) : mix(C.mand, '#8a4a1c', Math.min(1, (t - 0.35) / 0.55))),
      // a blade: broad at its base, tapering to the apical tooth; flat (rz small)
      profile: (t) => { const w = 0.1 * (1 - 0.6 * t) * Math.pow(clamp(t / 0.08), 0.5); return { x: Lm * t, zc: -0.04 * Math.sin(Math.PI * t * 0.8), yc: s * 0.03 * Math.sin(Math.PI * t), ry: w, rz: 0.03 * (1 - 0.5 * t) * Math.pow(clamp(t / 0.08), 0.5) }; },
      paint: (scn, b) => teeth(scn, b, s), hairMore: [setae(10, 0.08, () => 1, { lean: 0.8, color: () => '#c9a868' })], bias: 0.05,
    });
  }
}
// the teeth along the masticatory (inner) margin of a mandible: eight dark triangles, the apical one longest, seen in close-ups
function teeth(sc, b, s) {
  if (sc.k < 40) return '';
  const F = b.frame, at = (t, out) => { const p = b.profile(t); return sc.S(add(add(add(F.o, mul(F.ax, p.x)), mul(F.az, p.zc)), mul(F.ay, (p.yc || 0) - s * (p.ry + out)))); };
  let d = '';
  for (let i = 0; i < 8; i++) {
    const t0 = 0.3 + 0.7 * (i / 8), t1 = 0.3 + 0.7 * ((i + 1) / 8), h = i === 7 ? 0.05 : 0.024 + 0.003 * i;
    const a = at(t0, -0.004), c = at(t1, -0.004), m = at((t0 + t1) / 2 + 0.02, h);
    d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${m[0].toFixed(1)} ${m[1].toFixed(1)}L${c[0].toFixed(1)} ${c[1].toFixed(1)}Z`;
  }
  return `<path d="${d}" fill="${C.mandTip}" opacity="0.92"/>`;
}

// Palps: the maxillary (6 articles) and labial (4) palps hang under the head, pale brown (c254, c245)
function palps(sc, F, P) {
  const CL = B.head.CL;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    for (const [k, n, L0] of [[0.07, 6, 0.3], [0.03, 4, 0.16]]) {
      const pts = [hp(F, CL * 0.86, s * k * 1.4, -B.head.depth * 0.42)];
      let d = norm(add(mul(F.az, -0.85), add(mul(F.ax, -0.35), mul(F.ay, s * 0.25)))), p = pts[0];
      for (let i = 0; i < n; i++) { p = add(p, mul(d, L0 / n)); pts.push(p); d = norm(add(d, mul(F.ax, 0.05))); }
      drawTube(sc, pts, pts.map((_, i) => 0.017 - 0.004 * (i / n)), { color: C.legPale, gloss: 0.3, bias: 0.01 });
    }
  }
}

// Antennae: geniculate, 12 articles. The scape from its socket, held back and out along the head; the funiculus from the elbow,
// forward and down, palpating the ground ahead (P.ant: [scape yaw, scape lift, funiculus pitch] per side, P.tap phase).
function antennae(sc, F, P) {
  const H = B.head, CL = H.CL;
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const A = (P.ant && P.ant[s > 0 ? 0 : 1]) || [0, 0, 0];
    const base = hp(F, H.socketT * CL, s * H.socketY, H.depth * 0.36);
    // the scape: forward, out and a little up from its socket (c254, c107, c248); its condyle sunk in the socket
    let sd = norm(add(add(mul([1, 0, 0], 0.5), mul(Y, s * 0.72)), mul(Z, 0.48)));
    sd = norm(rot(sd, Z, deg(s * A[0])));
    sd = norm(add(sd, [0, 0, A[1]]));
    const elbow = add(base, mul(sd, B.scape));
    const sp = [base, add(base, mul(sd, B.scape * 0.5)), elbow];
    const sh = { n: 7, len: 0.05, w: 0.004, color: C.seta, side: [0, 0, 1], both: true, lean: 0.35, a: 0.65 };
    drawTube(sc, sp, [0.016, 0.023, 0.031], { color: C.antenna, gloss: 0.25, bias: 0.012, hair: [sh, sh], seed: 70 + s });
    // the funiculus: 11 articles from the elbow, forward and down, gently curved; each article a capsule narrowed at its joints,
    // the last four a little thicker (a light club, no true club in Lasius), the last one tapering to a rounded tip
    let fd = norm(add(add(mul([1, 0, 0], 0.85), mul(Y, s * -0.12)), mul(Z, -0.62 + A[2])));
    if (P.headYaw) fd = rot(fd, Z, deg(P.headYaw * 0.6));
    const pts = [elbow], rr = [0.025]; let p = elbow;
    const n = B.funi.length;
    B.funi.forEach((l, i) => {
      const r = 0.021 + 0.011 * Math.pow(i / (n - 1), 1.6);
      pts.push(add(p, mul(fd, l * 0.5))); rr.push(r);
      p = add(p, mul(fd, l));
      pts.push(p); rr.push(i === n - 1 ? r * 0.45 : r * 0.82);
      fd = norm(add(fd, [0.0, -s * 0.01, -0.035]));
    });
    const fh = { n: 4, len: 0.03, w: 0.003, color: '#9a8e7c', side: [0, 0, 1], both: true, lean: 1.0, a: 0.5 };
    // each article's distal half a little darker: the joints read as rings
    drawTube(sc, pts, rr, { color: (i) => (i % 2 ? (i > 15 ? '#3a2c20' : '#2a1f17') : (i > 15 ? C.antTip : C.antenna)), gloss: 0.25, bias: 0.012, hair: pts.map(() => fh), seed: 72 + s });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Mesosoma in three humps (the judge's first pass, c254, c138, c095): the pronotum (40 % of the length), domed and broadest; the
// mesonotum (30 %), its dorsum continuing the pronotum's a little lower; a distinct metanotal groove; the propodeum (30 %), 15 % lower,
// its short dorsum rounding into a steep declivity. Three bodies, each convex in outline (no gap and no ground seen through the
// engine's convex clip); their meeting lines are the sutures. Widths from c095: pronotum 0.62, mesonotum 0.5, propodeum 0.47 mm.
// ---------------------------------------------------------------------------------------------------------------
const PLEURA = (th) => [1, Math.sin(th) < 0 ? 1.22 : 1]; // a deeper lower half: the pleura and the coxae's insertions
function mesosoma(sc) {
  sc.part = 'thorax';
  const hair = (n) => ({ hair: pub(n * 2, 0.03), punct: { n: Math.round(n * 0.6), r: 0.0045, color: '#140c08', a: 0.24, glint: '#e0d0b0' } });
  // promesonotum: one dome (Lasius), t = 0 at the metanotal groove (x 0.2), t = 1 at the collar under the head (x 1.24). The
  // pronotum (t 0.55 to 1) broad and high; the mesonotum (t 0.1 to 0.5) narrower and a little lower, the promesonotal suture a
  // shallow saddle between them; behind it the dorsum drops into the metanotal groove.
  drawBody(sc, {
    name: 'promesonotum', frame: frameOf([0.2, 0, 0.86], [1, 0, 0.12]), color: C.meso, seed: 11, mat: MAT_TRUNK,
    profile: (t) => {
      const pro = Math.exp(-(((t - 0.72) / 0.24) ** 2)), mes = Math.exp(-(((t - 0.32) / 0.2) ** 2));
      const back = Math.pow(clamp(t / 0.14), 0.55), collar = t > 0.86 ? 1 - 0.5 * ((t - 0.86) / 0.14) ** 1.3 : 1;
      const ry = Math.max(0.26 * pro, 0.21 * mes, 0.18), rz = Math.max(0.265 * pro, 0.245 * mes, 0.2);
      return { x: 1.04 * t, zc: 0.02 * Math.sin(Math.PI * t) - 0.03 * (1 - t), ry: ry * back * collar, rz: rz * back * collar };
    },
    shape: PLEURA, ...hair(2400), hairMore: [setae(10, 0.11, (t, th) => (Math.sin(th) > 0.6 ? 1 : 0.02))], bias: 0.01,
    // the promesonotal suture, a faint line across the saddle
    decals: [{ t: 0.52, th: Math.PI / 2, r: 0.012, r2: 0.2, color: '#1a120c', a: 0.45 },
      ...[1, -1].map((s) => ({ t: 0.4, th: s > 0 ? -0.35 : Math.PI + 0.35, r: 0.18, r2: 0.01, rot: 0.6 * s, color: '#160e09', a: 0.5 }))],
  });
  // propodeum: t = 0 at the declivity's foot (x -0.30), t = 1 at the groove (x 0.2); 15 % lower than the pronotum
  drawBody(sc, {
    name: 'propodeum', frame: frameOf([-0.31, 0, 0.72], [1, 0, 0.16]), color: C.meso, seed: 12, mat: MAT_TRUNK,
    profile: (t) => {
      const rear = Math.pow(clamp(t / 0.38), 0.42), front = Math.pow(clamp((1 - t) / 0.3), 0.5);
      return { x: 0.55 * t, zc: 0.0, ry: 0.2 * rear * Math.max(0.55, front), rz: 0.225 * rear * Math.max(0.55, front) };
    },
    shape: PLEURA,
    // the propodeal spiracle: a small dark oval on the side, high on the declivity (c138)
    decals: [1, -1].map((s) => ({ t: 0.4, th: s > 0 ? 0.55 : Math.PI - 0.55, r: 0.02, r2: 0.014, color: '#120a07', a: 0.85 })),
    ...hair(600), hairMore: [setae(4, 0.11, (t, th) => (Math.sin(th) > 0.6 && t > 0.4 ? 1 : 0.02))], bias: -0.01,
  });
  // the metapleural gland: a rounded bulla above the hind coxa, fringed with a few hairs (Formicinae)
  for (const s of [1, -1]) drawBody(sc, {
    name: 'bulla', frame: frameOf([-0.18, s * 0.18, 0.6], [1, 0, 0.2]), color: C.meso, seed: 14 + s, mat: MAT_TRUNK,
    profile: (t) => { const e = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: 0.2 * t, zc: 0, ry: 0.07 * e, rz: 0.07 * e }; },
    hair: pub(30, 0.03), hairMore: [setae(5, 0.07, () => 1)], bias: 0.005,
  });
  sc.part = '';
}

// Petiole: a peduncle low between the propodeum and the gaster, and one upright scale, thin in profile, its top rounded and a
// little emarginate seen from the front, leaning forward (c254, c138, c095); erect setae on its crest
function petiole(sc) {
  sc.part = 'petiole';
  const T = B.petiole;
  // the peduncle: short and low, lit like the body (not a dark tube)
  drawBody(sc, segment('peduncle', [-0.28, 0, 0.66], [-0.5, 0, 0.68], [0.065, 0.055, 0.07], { color: C.body, mat: MAT_TRUNK, seed: 16, hair: pub(40, 0.025) }));
  // the scale: 70 % of the propodeum's height, a quarter of it thick, wedge-shaped in profile (thicker at the base), its crest rounded
  const ax = norm([Math.sin(deg(T.lean)), 0, Math.cos(deg(T.lean))]);
  drawBody(sc, {
    name: 'scale', frame: { o: [T.x, 0, T.base], ax, ay: Y, az: cross(ax, Y) }, color: C.body, seed: 17, mat: MAT_TRUNK,
    profile: (t) => {
      const H = T.top - T.base, top = Math.pow(clamp((1 - t) / 0.3), 0.5), base = 0.8 + 0.2 * Math.pow(clamp(t / 0.25), 0.5);
      return { x: H * t, zc: 0, ry: (T.w / 2) * top * base, rz: (T.th / 2) * (1 - 0.45 * t) * base * Math.max(0.5, top) };
    },
    hair: pub(140, 0.025), hairMore: [setae(8, 0.1, (t) => (t > 0.8 ? 1 : 0.02), { lean: 0.15 })], bias: -0.01,
  });
  sc.part = '';
}

// Gaster: ovate seen from above (its width 75 % of its length), four visible tergites overlapping like tiles, each hind margin a
// paler line with the shadow of the overlap just behind it (c248: margins at 33, 60, 80 and 93 % from the front); the measured grid
// gives the tone between them. Erect setae in a row before each margin; the acidopore, small and discreet, at the tip.
const TERG = [0.33, 0.6, 0.8, 0.93]; // the tergites' hind margins, from the front of the gaster (c248)
// the grid of a body, sampled as the engine does (rows from the rear, columns from the belly over the flank to the back)
function gridHex(G, t, th) {
  const u = (Math.asin(clamp(Math.sin(th), -1, 1)) + Math.PI / 2) / Math.PI, rows = G.rows;
  const y = clamp(t, 0, 1) * (rows.length - 1), x = u * (rows[0].length - 1);
  return mix(mix(rows[Math.floor(y)][Math.floor(x)], rows[Math.floor(y)][Math.ceil(x)], x % 1), mix(rows[Math.ceil(y)][Math.floor(x)], rows[Math.ceil(y)][Math.ceil(x)], x % 1), y % 1);
}
function gaster(sc, P) {
  sc.part = 'gastre';
  const g = B.gaster, Lg = g.x0 - g.x1;
  const full = 1 + (P.repletion || 0);
  // t from the tip (0) to the front (1): an ellipsoid centred at 56 %, its front rounded off into the first tergite's face
  const prof = (t) => {
    const ell = Math.sqrt(Math.max(0, 1 - ((t - 0.56) / 0.56) ** 2));
    const front = t > 0.84 ? Math.sqrt(Math.max(0.06, 1 - ((t - 0.84) / 0.16) ** 2)) : 1;
    const e = Math.max(0.05, Math.pow(ell, 0.9) * front);
    return { x: Lg * t, zc: lerp(g.zTip, g.zFront, t) + 0.05 * Math.sin(Math.PI * t), ry: (g.w / 2) * e * full, rz: (g.h / 2) * e * Math.sqrt(full) };
  };
  drawBody(sc, {
    name: 'gaster', frame: frameOf([g.x1, 0, 0], [1, 0, 0]), color: C.body, seed: 21, mat: MAT_GASTER,
    profile: prof, shape: (th) => [1, Math.sin(th) < 0 ? 0.9 : 1],
    albedo: (t, th) => {
      const f = 1 - t; let c = gridHex(G_GASTER, t, th);
      for (const m of TERG) {
        const d = f - m;
        if (d > -0.022 && d <= 0) c = mix(c, '#7a6450', 0.7 * (1 - Math.abs(d + 0.011) / 0.011 * 0.5));   // the pale, translucent hind margin
        else if (d > 0 && d < 0.035) c = mix(c, '#100a06', 0.5 * (1 - d / 0.035));                        // the step of the overlap behind it
      }
      return c;
    },
    hair: pub(15000, 0.03, { a: 0.42, color: () => '#b09468' }),
    punct: { n: 2600, r: 0.004, color: '#120b07', a: 0.18, glint: '#e8d8b8' },
    hairMore: [setae(48, 0.12, (t, th) => { const f = 1 - t; let m = 0; for (const c of TERG) m = Math.max(m, Math.exp(-(((f - (c - 0.025)) / 0.012) ** 2))); return Math.sin(th) > -0.2 ? m : 0.1 * m; }, { lean: 0.55 })],
    bias: 0,
  });
  // the acidopore: a short round nozzle just at the tip, a little under the axis, fringed with fine setae (the coronula)
  const tip = [g.x1 + 0.03, 0, g.zTip - 0.04];
  drawTube(sc, [add(tip, [0.04, 0, 0.01]), tip], [0.035, 0.026], { color: C.body, gloss: 0.2, bias: 0.02,
    hair: [{ n: 10, len: 0.045, w: 0.003, color: C.seta, side: [0, 0, 1], both: true, lean: 1.2, a: 0.7 }], seed: 23 });
  sc.part = '';
}

// ---------------------------------------------------------------------------------------------------------------
// Legs: coxa, trochanter, femur, tibia (with its apical spur, the pectinate calcar of the foreleg), five tarsomeres, two claws and
// the arolium. Femora and tibiae dark brown, paler at the joints, the tarsi amber (c107, c248, c254). Erect setae on the hind
// tibia's outer face (a mark of L. niger), fine pubescence elsewhere.
// ---------------------------------------------------------------------------------------------------------------
const TRI = { fore: 0, mid: 0.5, hind: 0 }; // tripod L1 R2 L3 against R1 L2 R3
// one leg's foot offset along x and lift at the walking phase ph (stance 60 %: duty factor of a walking ant; swing 40 %)
export function stepOf(k, side, ph, stride, liftH, duty = 0.6) {
  const tri = (k === 'mid') === (side > 0) ? 0.5 : 0;
  const q = (ph + tri) % 1;
  if (q < duty) return { dx: stride * (0.5 - q / duty), lift: 0 };
  const s = (q - duty) / (1 - duty);
  return { dx: stride * (-0.5 + (s * s * (3 - 2 * s))), lift: Math.sin(Math.PI * s) * liftH };
}

function legs(sc, P) {
  for (const k of ['fore', 'mid', 'hind']) for (const s of [1, -1]) {
    const L = B.legs[k];
    sc.part = `patte-${k === 'fore' ? 'avant' : k === 'mid' ? 'milieu' : 'arriere'}-${s > 0 ? 'g' : 'd'}`;
    let [fx, fy] = L.foot, lift = 0;
    if (P.walk !== undefined) { const g = stepOf(k, s, P.walk, P.stride ?? 0.95, 0.16); fx += g.dx; lift = g.lift; }
    if (P.feet?.[k]) { fx += P.feet[k][0]; fy += P.feet[k][1]; }
    const foot = [fx, fy * s, lift];
    const cx = sy(L.coxa, s);
    // the coxa hangs down and out from the chest; the trochanter a short knob; then femur and tibia by two-bone IK to the tarsus base
    const hip = add(cx, [k === 'fore' ? 0.06 : 0, 0.08 * s, k === 'fore' ? -0.28 : -0.22]);
    const tdir = norm([Math.sign(fx - L.coxa[0] + 0.001) * 0.55, 0.42 * s, -0.55]);
    const ankle = sub(foot, mul(tdir, L.tar * 0.9));
    const { knee, ankle: an } = ik(hip, ankle, L.fem, L.tib, sy(L.knee, s));
    // the femur clavate (slender at the trochanter, thick in its distal two thirds), the tibia widening to its apex (c107, c138)
    // femora and tibiae compressed from side to side: broad in profile, narrow from above (flat > 1 along the vertical)
    const A = { fem: k === 'fore' ? [0.044, 0.064, 0.04] : [0.042, 0.06, 0.037], tib: [0.03, 0.036, 0.045] };
    // coxa
    const cr = k === 'fore' ? [0.13, 0.11, 0.07] : k === 'mid' ? [0.1, 0.09, 0.065] : [0.11, 0.1, 0.07];
    drawBody(sc, segment('coxa', cx, hip, cr, { color: C.meso, mat: MAT_TRUNK, seed: 80, hair: pub(40, 0.04) }));
    // trochanter
    const tro = add(hip, mul(norm(sub(knee, hip)), 0.09));
    drawBody(sc, segment('trochanter', hip, tro, [0.055, 0.06, 0.05], { color: C.legPale, mat: MAT_LEG, seed: 81 }));
    drawBody(sc, segment('femur', tro, knee, A.fem, { color: C.leg, mat: MAT_LEG, seed: 82, up: Z, flat: 1.35, hair: pub(320, 0.025, { lean: 1.3 }) }));
    drawBody(sc, segment('tibia', knee, an, A.tib, { color: C.leg, mat: MAT_LEG, seed: 83, up: Z, flat: 1.2,
      hair: pub(240, 0.025, { lean: 1.3 }), hairMore: k === 'hind' || k === 'mid' ? [setae(14, 0.06, (t, th) => (Math.cos(th) * s > 0 ? 1 : 0.2), { lean: 0.8 })] : undefined }));
    // the apical spur(s) of the tibia: on the foreleg the curved, comb-like calcar that cleans the antennae
    const tibDir = norm(sub(an, knee));
    const spurDir = norm(add(mul(tibDir, 0.6), [0, 0, -0.5]));
    drawTube(sc, [an, add(an, mul(spurDir, k === 'fore' ? 0.09 : 0.06))], [0.012, 0.004], { color: C.legPale, gloss: 0.3, bias: 0.01 });
    // tarsus: basitarsus 40 %, then four tarsomeres, curving down to the claws
    let p = an, d = norm(sub(foot, an));
    const fr = [0.40, 0.17, 0.14, 0.12, 0.17];
    fr.forEach((f, j) => {
      const nx = add(p, mul(d, L.tar * f));
      const r = j === 0 ? [0.028, 0.027, 0.024] : [0.02, 0.022 - 0.001 * j, 0.018];
      drawBody(sc, segment(j ? 'tarsomere' : 'basitarsus', p, nx, r, { color: j ? C.tarsus : C.legPale, mat: MAT_LEG, seed: 84 + j, hair: j === 0 ? pub(20, 0.03) : undefined }));
      p = nx; d = norm(add(d, [0, 0, -0.05]));
    });
    // two claws and the arolium between them
    const out = norm(cross(d, Z));
    for (const c of [1, -1]) {
      const d1 = norm(add(add(mul(d, 0.6), [0, 0, -0.5]), mul(out, 0.35 * c)));
      const c1 = add(p, mul(d1, 0.035)), c2 = add(c1, mul(norm(add(d1, [0, 0, -0.9])), 0.03));
      drawTube(sc, [p, c1, c2], [0.010, 0.007, 0.002], { color: '#1e120a', gloss: 0.5, bias: 0.01 });
    }
  }
  sc.part = '';
}

// ---------------------------------------------------------------------------------------------------------------
// The carried load: a fragment of a faded petal fallen from the bouquet (the widget's event), about 2.4 x 1.6 mm, thin, curled,
// gripped by its edge between the open mandibles and held up in front of the head. Drawn nearly white with brown, wilted
// margins and fine veins, so that the runtime tints it with the bouquet's petal colour (a separate sprite, same cell, same origin).
// ---------------------------------------------------------------------------------------------------------------
export function petalGrip(P) {
  const F = headFrame(P), CL = B.head.CL;
  return { F, at: hp(F, CL * 0.9 + 0.36, 0, -0.16) };
}
function petal(sc, P) {
  sc.part = 'petale';
  const { at } = petalGrip(P);
  // the fragment's long axis forward and up from the grip, tilted a little sideways; curled across its width
  const ax = norm(add(add(mul([1, 0, 0], 0.75), [0, 0.12, 0]), mul(Z, 0.66)));
  const fr = frameOf(sub(at, mul(ax, 0.12)), ax, add(Z, [-0.3, 0.25, 0]));
  const R = (t) => 0.5 + 0.5 * Math.sin(t * 17.3) * Math.sin(t * 7.1 + 1);
  drawBody(sc, {
    name: 'petal', frame: fr, color: '#f2ece2', seed: 91,
    mat: { ks: 0.1, p: 16, ks2: 0.04, p2: 4, env: 0.03, wrap: 0.6, amb: 0.5, mottle: 0.06, trans: { color: '#fff0dc', k: 0.55 } },
    // a torn outline: the width wavers along the length; rounded at the free end, broken short where it was torn from the petal
    profile: (t) => { const e = Math.pow(Math.sin(Math.PI * Math.min(1, 0.1 + t * 0.92)), 0.4) * (0.72 + 0.28 * R(t)); return { x: 1.5 * t, zc: 0.1 * Math.sin(Math.PI * t), ry: 0.55 * e, rz: 0.008 * e }; },
    // the margins turned up a little, as a wilted petal curls
    shape: (th) => [1, 1 + 6 * Math.pow(Math.cos(th), 4)],
    albedo: (t, th) => {
      const edge = Math.pow(Math.abs(Math.cos(th)), 6), tip = Math.pow(Math.max(0, t - 0.75) / 0.25, 2);
      // veins fanning from the torn base, brown spots of wilting, the margins browned
      const vein = 0.22 * Math.pow(Math.abs(Math.cos(Math.cos(th) * 9 + t * 1.5)), 30) * (0.4 + 0.6 * t);
      const spot = 0.25 * Math.pow(Math.max(0, Math.sin(t * 13 + 1.3) * Math.sin(Math.cos(th) * 7 + 0.4)), 6);
      const brown = Math.min(1, 0.7 * edge + 0.5 * tip + vein + spot);
      return mix('#ece0d0', '#8a6a44', brown);
    },
    bias: 0.08,
  });
  sc.part = '';
}

// ---------------------------------------------------------------------------------------------------------------
// Poses. 'pose': standing, antennae forward. 'marche': the alternating tripod, 8 frames per stride (stance 60 %), the antennae
// palpating in alternation, the body bobbing a little. 'porte': walking with a load: the head raised, the mandibles open on the
// carried fragment, the antennae held higher (the fragment itself is drawn by the runtime, tinted by the bouquet). 'palpe': a
// stop, antennae sweeping the ground or another ant (antennation), 4 frames.
// ---------------------------------------------------------------------------------------------------------------
function poseOf(pose, frame) {
  const P = {};
  if (pose === 'marche' || pose === 'porte') {
    P.walk = frame; P.stride = 1.5; // the feet's sweep in stance: 2.5 mm per cycle x duty 0.6 (COMPORTEMENT.md); a load keeps it
    // the antennae beat in alternation, twice per stride, sweeping 18 deg sideways and tapping the ground ahead
    const tap = (s) => 0.3 * Math.sin(2 * Math.PI * (2 * frame + (s > 0 ? 0 : 0.5)));
    P.ant = [[4 + 18 * Math.sin(2 * Math.PI * frame), 0, tap(1)], [4 - 18 * Math.sin(2 * Math.PI * frame + 0.6), 0, tap(-1)]];
    P.headYaw = 4 * Math.sin(2 * Math.PI * frame);
    if (pose === 'porte') { P.headPitch = -22; P.headLift = 0.05; P.gape = 24; P.ant = P.ant.map((a) => [a[0] - 6, 0.12, a[2] + 0.35]); }
  } else if (pose === 'palpe') {
    const a = 2 * Math.PI * frame;
    P.ant = [[34 * Math.sin(a), 0, -0.2 + 0.45 * Math.sin(a + 1)], [-34 * Math.sin(a + 1.6), 0, -0.2 + 0.45 * Math.sin(a + 2.9)]];
    P.headPitch = 6 * Math.sin(a); P.headYaw = 6 * Math.sin(a * 0.5);
  } else {
    P.ant = [[0, 0, 0], [0, 0, 0]];
  }
  return P;
}

export function ant(az, el, opts = {}) {
  const { size = 256, k = 40, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light, center = [0, 0, 0] } = opts;
  const cam = camera(az, el, light);
  // the ant's centre (mm) at the middle of the image
  const q = cam.proj(center);
  const sc = new Scene(cam, k, size / 2 - q[0] * k, size / 2 + q[1] * k, 23, idp);
  sc.detail = detail;
  // 'petale': the carried fragment alone, in the cell of the 'porte' pose (the runtime lays it over the ant, tinted)
  const P = poseOf(pose === 'petale' ? 'porte' : pose, frame);
  if (pose === 'petale') { petal(sc, P); return sc.svg(size, size, bg); }
  gaster(sc, P); petiole(sc); mesosoma(sc); head(sc, P); legs(sc, P);
  if (opts.petale && pose === 'porte') petal(sc, P);
  return sc.svg(size, size, bg);
}

export const META = {
  id: 'fourmi-noire', bodyMm: B.len, span: 7.2,
  el: [-10, 15, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], porte: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], palpe: [0, 0.25, 0.5, 0.75], petale: [0] },
  lod: { S: { cell: 20, az: 15, poses: ['pose', 'marche', 'porte', 'palpe', 'petale'] }, L: { cell: 48, az: 30, poses: ['marche', 'porte', 'petale'] } },
};
export const draw = (az, el, opts = {}) => ant(az, el, opts);
