// Buff-tailed bumblebee, worker (Bombus terrestris), second pass (porteur 2026-10-23: the machaon's method, end to end).
// Measures (FICHE.md, ETAT.md): the body of 15 mm (FICHE: worker), its lengths and widths read on the spread specimen c115 and the
// living c024, c126 (outils/forme.py maps); the colours of its hair from the grids of c115 (plat_corps.py, grille_corps.py: the
// collar, the band of the second tergite, the white tail with its buff edge); the wings from their records (outils/membrane.py on
// c115: outline, veins, the membrane's light, the papillae); the eyes, face and mouthparts from c084 and c082; the legs and the pollen
// basket from c102, c120 and c115.
// Body frame: x forward, y to the left, z up, mm; the origin on the axis at the forewings' hinge line.
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation.
import { readFileSync } from 'node:fs';
import { add, sub, mul, dot, cross, norm, clamp, rad, rot, camera } from '../moteur/geo.mjs';
import { Scene, drawBody, drawTube } from '../moteur/insecte.mjs';
import { frame0, env, pitched, ik, articleLeg, fringe, segment, tripod } from '../moteur/kit.mjs';
import { membrane, drawMembrane } from './membrane.mjs';

const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
const G_THX = grid('thorax'), G_ABD = grid('abdomen');   // plat_corps.py + grille_corps.py on c115 (nettoie_grille.py for the wing cells)

// Colours measured (sample on c115 under its neutral plate, c120 for the underside; FICHE.md)
const C = {
  black: '#2a2a2e', blackLo: '#1c1b1d', cuticle: '#151314', belly: '#1e1b1a',
  eye: '#2b231c', clypeus: '#141112', mandible: '#2a1810', mandibleTip: '#5a2c14',
  leg: '#171413', tibia: '#100d0c', basitarsus: '#2a1a14', tarsus: '#5a3524', tarsusHair: '#8a5a3a',
  antenna: '#151110', tongue: '#7a4a24', galea: '#3a2416',
};
const pick = (R, a) => a[Math.floor(R() * a.length) % a.length];

// The wings, measured on c115 (membrane.py): the forewing 10.56 mm from its hinge, the hindwing 7.84 mm.
const FORE = membrane('avant', { seed: 11 }), HIND = membrane('arriere', { seed: 13 });

// Lengths (mm). Along the axis on c115 (55 px/mm at half size, the body brought to 15 mm): head front +4.4, the collar's front
// +2.4, the thorax's rear -3.0, the tail's tip -10.6; widths with the hair: head 3.6 (c084), thorax 6.5, abdomen 6.8 (c115).
// The fur: 1.0 mm on the thorax, 0.55 on the abdomen, 0.8 at the tail (c046, c126).
const B = {
  thorax: [2.35, -3.0], thoraxR: [2.45, 2.35], thoraxZ: 0.45,
  abdomen: [-2.7, -10.05], abdomenR: [2.95, 2.45], abdomenZ: -0.35,
  head: [3.15, 0, 0.75],                     // the vertex, from which the head's axis runs down to the mouth
  headAx: norm([0.36, 0, -1]), headLen: 3.35, headR: 1.75,
  eyeLen: 2.35, eyeW: 0.72, eyeBulge: 0.42,
  hingeFore: [0, 2.2, 2.35], hingeHind: [-0.85, 2.1, 2.1],
};

// satin black eyes with the window of the sky mirrored on their curve (c082, c120); the cuticle of the clypeus glossier (c084)
const EYEMAT = { ks: 0.35, p: 60, ks2: 0.1, p2: 7, env: 0.55, wrap: 0.18, amb: 0.3, mottle: 0.1, specColor: '#f2efe8' };
const GLOSS = { ks: 0.55, p: 90, ks2: 0.12, p2: 8, env: 0.5, wrap: 0.2, mottle: 0.05, specColor: '#f4f0ea' };
const LEGMAT = { ks: 0.5, p: 70, ks2: 0.1, p2: 6, env: 0.4, mottle: 0.05, specColor: '#f2eee8' };

// The head's frame: ax from the vertex down to the mouth (a little forward: the face is long and leans forward), ay to the
// left, az forward out of the face. th = pi/2 is the face, -pi/2 the back of the head, 0 the left side.
function headFrame() {
  const ax = B.headAx, ay = [0, 1, 0], az = norm(cross(ax, ay));
  return { o: B.head, ax, ay, az };
}
const HF = headFrame();
const onHead = (t, th, r = 1) => {          // a point on the head's surface (t along the axis, th around it), r times out
  const p = headProfile(t), s = headShape(th, t);
  return add(add(add(HF.o, mul(HF.ax, p.x)), mul(HF.ay, p.ry * Math.cos(th) * s[0] * r)), mul(HF.az, p.zc + p.rz * Math.sin(th) * s[1] * r));
};
function headProfile(t) {
  // widest at the eyes' middle (t 0.4), the clypeus narrower, the vertex rounded
  const w = t < 0.4 ? 0.72 + 0.28 * Math.sin((Math.PI / 2) * (t / 0.4)) : 1 - 0.42 * Math.pow((t - 0.4) / 0.6, 1.6);
  const cap = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, 0.08 - t) / 0.08, 2)));
  const end = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, t - 0.94) / 0.06, 2)));
  return { x: B.headLen * t, zc: 0.1 * Math.sin(Math.PI * t), ry: B.headR * w * cap * end, rz: 1.02 * (1 - 0.25 * t) * cap * end };
}
// the face flatter than the back of the head
const headShape = (th) => [1, Math.sin(th) > 0 ? 0.82 : 1.05];

// A window mirrored on a glossy curved surface: the mesh quads whose reflected view ray falls in the softbox (top, a little to the
// front), drawn pale, two panes parted by a bar; the curve stretches it (c082: a long pale band on the eye).
function windowPaint(sc, b, g) {
  const { cam } = sc;
  let d = '';
  for (let i = 0; i < g.nt; i++) for (let j = 0; j < g.nth; j++) {
    const j1 = (j + 1) % g.nth;
    const n = norm(add(add(g.N[i][j], g.N[i + 1][j]), add(g.N[i + 1][j1], g.N[i][j1])));
    const nv = dot(n, cam.c);
    if (nv < 0.08) continue;
    const r = sub(mul(n, 2 * nv), cam.c);
    const ru = dot(r, cam.u), rr = dot(r, cam.r);
    if (ru < 0.52 || ru > 0.9 || Math.abs(rr) > 0.32 || Math.abs(rr) < 0.035) continue;
    const P = [g.P[i][j], g.P[i + 1][j], g.P[i + 1][j1], g.P[i][j1]].map((p) => sc.S(p));
    d += `M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}L${P[1][0].toFixed(1)} ${P[1][1].toFixed(1)}L${P[2][0].toFixed(1)} ${P[2][1].toFixed(1)}L${P[3][0].toFixed(1)} ${P[3][1].toFixed(1)}Z`;
  }
  return d ? `<path d="${d}" fill="#dfe6ec" stroke="#dfe6ec" stroke-width=".4" opacity="${(b.window ?? 0.5).toFixed(2)}"/>` : '';
}

function head(sc, pose) {
  sc.part = 'tete';
  drawBody(sc, {
    name: 'head', frame: HF, color: C.cuticle, seed: 11, mat: { ks: 0.25, p: 40, ks2: 0.06, env: 0.2, mottle: 0.05 },
    profile: headProfile, shape: headShape,
    // long black hair over the vertex and the back of the head, short on the frons; none on the eyes and the clypeus (c084, c082)
    hair: { n: 2600, len: 0.75, w: 0.022, lean: 0.55, a: 0.85, droop: 0.6, twist: 0.9, wave: 0.15, curl: 0.2, fleece: 0.3, pile: 0.5,
      color: (t, th, R) => pick(R, [C.black, C.black, C.blackLo, '#3c3a3e']),
      density: (t, th) => { const c = Math.cos(th), s = Math.sin(th); if (Math.abs(c) > 0.62 && t > 0.12 && t < 0.86) return 0; if (s > 0.45 && t > 0.6) return 0; return t > 0.55 ? 0.5 : 1; },
      lenAt: (t, th) => (t < 0.25 ? 1.2 : Math.sin(th) > 0.3 ? 0.55 : 0.9) },
  });
  // the clypeus: a broad, smooth, shining plate on the lower face, the labrum under it (c084)
  const cl = onHead(0.8, Math.PI / 2, 0.97);
  drawBody(sc, {
    name: 'clypeus', frame: { o: cl, ax: B.headAx, ay: [0, 1, 0], az: HF.az }, color: C.clypeus, seed: 13, mat: { ...GLOSS, ks: 0.3, env: 0.3, mottle: 0.12 }, bias: 0.05,
    profile: (t) => { const e = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: -0.55 + 1.1 * t, zc: 0, ry: 0.95 * e * (1 - 0.25 * t), rz: 0.16 * e }; },
  });
  const lb = onHead(0.985, Math.PI / 2, 0.75);
  drawBody(sc, {
    name: 'labrum', frame: { o: lb, ax: B.headAx, ay: [0, 1, 0], az: HF.az }, color: '#1c1412', seed: 14, mat: GLOSS, bias: 0.06,
    profile: (t) => { const e = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: -0.15 + 0.3 * t, zc: 0, ry: 0.55 * e, rz: 0.16 * e }; },
    hair: { n: 60, len: 0.22, w: 0.016, lean: 0.3, a: 0.8, pile: 0, fleece: 0, color: () => '#8a5a34' },
  });
  // the ocelli: three small glassy lenses in a triangle on the vertex (c084, c082)
  for (const [t, th] of [[0.1, Math.PI / 2], [0.06, Math.PI / 2 + 0.55], [0.06, Math.PI / 2 - 0.55]]) {
    const p = onHead(t, th, 1.0);
    drawBody(sc, { name: 'ocellus', frame: frame0(p), color: '#0e0b09', seed: 15, mat: { ks: 0.8, p: 200, ks2: 0.1, env: 0.6, mottle: 0 }, bias: 0.08,
      profile: (u) => { const e = Math.sqrt(Math.max(0, 1 - (2 * u - 1) ** 2)); return { x: 0.11 * (2 * u - 1), zc: 0, ry: 0.11 * e, rz: 0.11 * e }; } });
  }
  for (const s of [1, -1]) {
    // compound eyes: long ovals on the sides of the head, from near the vertex to near the mandibles (c084: 2.35 x 0.72 mm)
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    const ec = onHead(0.47, s > 0 ? 0.12 : Math.PI - 0.12, 0.86);
    const out = norm(sub(ec, add(HF.o, mul(HF.ax, 0.47 * B.headLen))));
    const ey = norm(sub(HF.az, mul(out, dot(HF.az, out))));
    drawBody(sc, {
      name: 'eye', frame: { o: ec, ax: B.headAx, ay: ey, az: out }, color: C.eye, seed: 21 + s, mat: EYEMAT, bias: 0.05,
      profile: (t) => { const e = Math.pow(Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)), 0.9); return { x: B.eyeLen * (t - 0.5), zc: 0, ry: B.eyeW / 2 * e * (1 - 0.15 * t), rz: B.eyeBulge * e }; },
      facets: 0.025, paint: windowPaint, window: 0.45, rim: { color: '#7a7268', w: 0.04, a: 0.3 },
    });
    // mandibles: dark, toothed at their reddish tips, crossing under the labrum (c082)
    sc.part = s > 0 ? 'mandibule-g' : 'mandibule-d';
    const m0 = onHead(0.93, Math.PI / 2 + 0.95 * s, 0.95);
    const m1 = add(m0, add(mul(B.headAx, 0.45), [0.12, -0.42 * s, 0])), m2 = add(m1, [0.05, -0.32 * s, -0.08]);
    drawTube(sc, [m0, m1, m2], [0.2, 0.15, 0.07], { color: C.mandible, gloss: 0.6, glossColor: '#c08a60', bias: 0.07 });
    // antennae: elbowed, the scape up and forward from the middle of the face, the flagellum of ten articles curving out (c082, c120)
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const a0 = onHead(0.42, Math.PI / 2 + 0.42 * s, 0.98);
    const fly = pose === 'vol';
    const scape = add(a0, mul(norm(fly ? [0.7, 0.25 * s, 0.75] : [0.45, 0.28 * s, 0.85]), 1.45));
    const pts = [a0, add(a0, mul(sub(scape, a0), 0.5)), scape];
    let d = norm(fly ? [0.9, 0.38 * s, 0.1] : [0.75, 0.45 * s, 0.35]), p = scape;
    for (let i = 0; i < 11; i++) { p = add(p, mul(d, i === 0 ? 0.22 : 0.3)); pts.push(p); d = norm(add(d, [-0.02, 0.012 * s, -0.075])); }
    drawTube(sc, pts, pts.map((_, i) => (i < 3 ? 0.09 : i === 3 ? 0.075 : 0.085)), { color: C.antenna, gloss: 0.35, glossColor: '#8a7a6e', seed: 50 + s, bias: 0.04 });
  }
  // the tongue: folded back under the head at rest; out to drink (the glossa amber, sheathed by the dark galeae: c082)
  sc.part = 'langue';
  const t0 = onHead(1.0, Math.PI / 2, 0.4);
  if (pose === 'butine') {
    const P = [t0];
    for (let i = 1; i <= 10; i++) { const f = i / 10; P.push(add(t0, add(mul(B.headAx, 6.2 * f), [0.6 * f, 0, -0.4 * f * f]))); }
    for (const s of [1, -1]) drawTube(sc, P.slice(0, 7).map((q) => add(q, [0, 0.09 * s, 0.03])), P.slice(0, 7).map((_, i) => 0.11 - 0.008 * i), { color: C.galea, gloss: 0.5, glossColor: '#b07850', bias: 0.03 });
    drawTube(sc, P, P.map((_, i) => 0.07 - 0.004 * i), { color: C.tongue, gloss: 0.7, glossColor: '#f0c890', bias: 0.025 });
  } else {
    const P = [t0, add(t0, mul(B.headAx, 0.45)), add(t0, add(mul(B.headAx, 0.6), [-0.6, 0, 0])), add(t0, add(mul(B.headAx, 0.55), [-1.5, 0, 0]))];
    drawTube(sc, P, [0.13, 0.12, 0.11, 0.08], { color: C.galea, gloss: 0.5, glossColor: '#b07850', bias: -0.05 });
  }
}

function thorax(sc) {
  sc.part = 'thorax';
  const [x0, x1] = B.thorax, L = x0 - x1, [ry, rz] = B.thoraxR;
  drawBody(sc, {
    name: 'thorax', frame: frame0([x1, 0, B.thoraxZ]), color: C.cuticle, belly: C.belly, seed: 21, grid: G_THX,
    mat: { ks: 0.05, p: 16, env: 0.03, wrap: 0.35, mottle: 0.06 },
    profile: (t) => { const e = Math.pow(env(t, 0.45, 0.5) / 0.61, 0.62); return { x: L * t, zc: 0.15 * Math.sin(Math.PI * t), ry: ry * e, rz: rz * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.86 : 1],
    // the long dense pile in the colours of its grid: the collar over the front and down the sides, the black scutum (c115, c046)
    hair: { n: 9000, len: 1.0, w: 0.022, lean: 0.75, a: 0.9, droop: 0.7, twist: 0.9, wave: 0.22, curl: 0.35, fleece: 0.35, pile: 0.8, pileLen: 0.5,
      locks: 0.35, sheen: 0.015, sheenP: 50, color: 'grid', gridK: 0.78,
      lenAt: (t, th) => (Math.sin(th) < -0.4 ? 0.75 : t > 0.86 ? 0.8 : 1) },
  });
  // the tegulae: small glossy brown-black scales over the forewings' bases, half in the hair (c115)
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegula-g' : 'tegula-d';
    drawBody(sc, {
      name: 'tegula', frame: pitched([0.15, 2.15 * s, 2.05], -10), color: '#1d1512', seed: 23 + s, mat: GLOSS, bias: 0.05,
      profile: (t) => { const e = Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)); return { x: -0.55 + 1.1 * t, zc: 0, ry: 0.42 * e, rz: 0.2 * e }; },
    });
  }
}

function abdomen(sc, pose) {
  sc.part = 'abdomen';
  const [x0, x1] = B.abdomen, L = x0 - x1, [ry, rz] = B.abdomenR;
  drawBody(sc, {
    name: 'abdomen', frame: pitched([x1, 0, B.abdomenZ], pose === 'vol' ? -4 : -9), color: C.cuticle, seed: 31, grid: G_ABD,
    mat: { ks: 0.05, p: 14, env: 0.03, wrap: 0.35, mottle: 0.08 },
    // t from the tip (0) to the base (1): round at the tip, widest at 60 %, narrowing to the waist where it meets the thorax (c115, c024)
    profile: (t) => {
      const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.6)), 0.55), b = t > 0.6 ? 1 - 0.38 * ((t - 0.6) / 0.4) ** 2.2 : 1;
      const e = Math.max(0.1, a * b);
      return { x: L * t, zc: -0.3 * (1 - t) ** 2, ry: ry * e, rz: rz * e };
    },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.82 : 1],
    hair: { n: 9000, len: 0.6, w: 0.022, lean: 1.0, a: 0.9, droop: 0.6, twist: 0.8, wave: 0.18, curl: 0.3, fleece: 0.3, pile: 0.7, pileLen: 0.5,
      locks: 0.3, sheen: 0.015, sheenP: 50, color: 'grid', gridK: 0.78,
      // longer at the tail and the sides of the tail, sparse on the shining sternites (c120)
      lenAt: (t, th) => (t < 0.35 ? 1.35 : 1) * (Math.sin(th) < -0.5 ? 0.6 : 1),
      density: (t, th) => (Math.sin(th) < -0.65 ? 0.25 : 1) },
  });
}

// Legs (c102, c115, c120): black, with long black hair; the hind tibia broad, flat and shining, the pollen basket, fringed with long
// black hairs; the broad hind basitarsus; reddish-brown tarsi. Lengths (mm) on c115: femur, tibia, tarsus.
const LEGS = {
  front: { coxa: [1.55, 0.55, -1.55], fem: 2.3, tib: 2.15, tar: 2.6 },
  mid: { coxa: [0.05, 0.95, -1.85], fem: 2.65, tib: 2.75, tar: 2.95 },
  hind: { coxa: [-1.55, 1.05, -1.75], fem: 3.3, tib: 3.8, tar: 3.6 },
};
const blackHair = (t, th, R) => (R() < 0.7 ? C.black : '#3a3638');
const ARTICLES = {
  front: { coxa: { from: [0.05, -0.3, 0.4], r: [0.3, 0.32, 0.25], c: C.leg, hair: fringe(70, 0.6, blackHair, 0) },
    fem: { r: [0.2, 0.26, 0.17], c: C.leg, hair: fringe(110, 0.6, blackHair, 0.3, 0.02) }, tib: { r: [0.13, 0.17, 0.19], c: C.leg, hair: fringe(60, 0.35, blackHair, 0.5) },
    bas: { r: [0.13, 0.12, 0.09], c: C.tarsus, flat: 0.6, hair: fringe(50, 0.18, C.tarsusHair, 0.2) }, tar: { r: 0.075, c: C.tarsus, hair: fringe(6, 0.14, C.tarsusHair, 0) }, claw: 0.12 },
  mid: { coxa: { from: [0.05, -0.3, 0.4], r: [0.3, 0.32, 0.25], c: C.leg, hair: fringe(70, 0.6, blackHair, 0) },
    fem: { r: [0.21, 0.28, 0.18], c: C.leg, hair: fringe(130, 0.65, blackHair, 0.3, 0.02) }, tib: { r: [0.13, 0.19, 0.22], c: C.leg, hair: fringe(80, 0.45, blackHair, 0.5) },
    bas: { r: [0.15, 0.14, 0.1], c: C.tarsus, flat: 0.55, hair: fringe(60, 0.2, C.tarsusHair, 0.2) }, tar: { r: 0.08, c: C.tarsus, hair: fringe(6, 0.14, C.tarsusHair, 0) }, claw: 0.12 },
  hind: { coxa: { from: [0.05, -0.3, 0.4], r: [0.32, 0.34, 0.26], c: C.leg, hair: fringe(70, 0.6, blackHair, 0) },
    fem: { r: [0.22, 0.3, 0.2], c: C.leg, hair: fringe(140, 0.7, blackHair, 0.3, 0.02) },
    // the corbicula: smooth and glossy on its face, the long hairs only along its two edges (fringe edge 0.82), curving over it
    tib: { r: [0.15, 0.4, 0.56], c: C.tibia, flat: 0.32, mat: { ...LEGMAT, ks: 0.75, p: 110, env: 0.5 }, hair: fringe(220, 1.0, blackHair, 0.84, 0.022) },
    bas: { r: [0.36, 0.36, 0.27], c: C.basitarsus, flat: 0.38, hair: fringe(120, 0.25, '#6a4430', 0.3) }, tar: { r: 0.085, c: C.tarsus, hair: fringe(6, 0.14, C.tarsusHair, 0) }, claw: 0.13 },
};

function legs(sc, pose, ph = 0) {
  const G = -4.4;
  const SET = {
    // [foot target (standing), pole of the knee]: the feet wide of the body, the knees out and up (c126, c060, c024)
    front: [[5.2, 2.2], [0.3, 1, 0.8]],
    mid: [[1.0, 3.9], [0, 1, 0.9]],
    hind: [[-4.6, 3.5], [-0.3, 1, 0.9]],
  };
  for (const [k, [foot, pole]] of Object.entries(SET)) for (const s of [1, -1]) {
    sc.part = `patte-${k === 'front' ? 'avant' : k === 'mid' ? 'milieu' : 'arriere'}-${s > 0 ? 'g' : 'd'}`;
    const L = LEGS[k], sy = (p) => [p[0], p[1] * s, p[2]];
    const base = sy(L.coxa);
    let ankle, tdir;
    if (pose === 'vol') {
      // in flight the legs hang under the body, the hind ones trailing (c014, c013)
      const hang = { front: [1.2, 0.9, -1.9], mid: [-1.3, 1.3, -2.3], hind: [-3.4, 1.0, -2.2] }[k];
      ankle = add(base, sy(hang)); tdir = norm(sy(k === 'front' ? [0.2, 0.2, -1] : [-0.6, 0.15, -0.8]));
    } else {
      let [fx, fy] = foot, lift = 0;
      if (pose === 'marche') { const g = tripod(k, s, ph, 1.6, 0.7); fx += g.dx; lift = g.lift; }
      tdir = norm(sy([k === 'hind' ? -0.7 : k === 'mid' ? 0.15 : 0.5, 0.45, -0.7]));
      ankle = sub(sy([fx, fy, G + lift]), mul(tdir, L.tar * 0.92));
    }
    const fb = add(base, sy([0, 0.3, -0.45]));
    const { knee, ankle: an } = ik(fb, ankle, L.fem, L.tib, sy(pole));
    const q = [fb, knee, an];
    const fr = [0.42, 0.15, 0.13, 0.13, 0.17];
    let pp = an, d = tdir;
    for (const f of fr) { const nx = add(pp, mul(d, L.tar * f)); q.push(add(pp, mul(d, L.tar * f * 0.5)), nx); pp = nx; d = norm(add(d, [0, 0, -0.05])); }
    articleLeg(sc, drawBody, drawTube, q, d, pp, ARTICLES[k], s, LEGMAT);
  }
}

// ---- Wings --------------------------------------------------------------------------------------------------------------------
// At rest, folded flat over the abdomen on its hair, the forewings over the hindwings, their inner margins overlapping on the
// midline, the tips at the tail (c024, c126, c056).
function restAxes(s, dir, lead) {
  const e1 = norm([dir[0], dir[1] * s, dir[2]]), l = [lead[0], lead[1] * s, lead[2]];
  return { e1, e2: norm(sub(l, mul(e1, dot(l, e1)))) };
}
// In flight: the stroke of Bombus terrestris hovering (Dudley & Ellington 1990, as used by Sun & Xiong 2005): amplitude 116 deg,
// 155 Hz, the stroke plane nearly horizontal with the body raised about 47 deg (less in forward flight). The tip draws a flat figure
// of eight: down a little at mid stroke, up at the reversals. phase 0 at the back of the stroke, 0.5 at the front; the leading
// edge leads both ways, the wing turned (pronation, supination) at the reversals.
export const STROKE = { amp: 116, plane: 32, dev: 9, aoa: 38 };
export function strokeAxes(s, ph) {
  const A = STROKE.amp / 2, phi = -A * Math.cos(2 * Math.PI * ph);                 // degrees, + forward
  const dev = -STROKE.dev * Math.cos(4 * Math.PI * ph);
  const vphi = Math.sin(2 * Math.PI * ph);                                           // + downstroke (moving forward)
  const p = rad(phi), dv = rad(dev);
  let e1 = norm([Math.sin(p) * Math.cos(dv), s * Math.cos(p) * Math.cos(dv), Math.sin(dv)]);
  // the stroke plane tilted front-down in the body frame (the body flies raised)
  const tilt = (v) => rot(v, [0, 1, 0], rad(STROKE.plane));
  e1 = tilt(e1);
  // the direction of motion in the plane, and the wing's chord turned from it by the angle of attack (the costa ahead)
  const mv = tilt(norm([Math.cos(p) * Math.sign(vphi || 1), -s * Math.sin(p) * Math.sign(vphi || 1), 0]));
  const up = tilt([0, 0, 1]);
  const rev = 1 - Math.min(1, Math.abs(vphi) * 1.6);                                 // near the reversals the wing stands on edge
  const aoa = rad(STROKE.aoa + 45 * rev);
  const e2 = norm(add(mul(mv, Math.cos(aoa)), mul(up, Math.sin(aoa))));
  return { e1, e2: norm(sub(e2, mul(e1, dot(e2, e1)))) };
}
// Three drawings, each two sets of wings at nearby phases (the second fainter): the false wingbeat of traditional animation
// (DECISIONS: two or three drawings that loop, no blur).
export const FLIGHT = [[0.06, 0.18], [0.36, 0.48], [0.66, 0.8]];

function wings(sc, pose, frame) {
  for (const s of [1, -1]) {
    const lr = s > 0 ? 'g' : 'd';
    const fo = [B.hingeFore[0], B.hingeFore[1] * s, B.hingeFore[2]], ho = [B.hingeHind[0], B.hingeHind[1] * s, B.hingeHind[2]];
    if (pose === 'vol') {
      FLIGHT[frame % FLIGHT.length].forEach((ph, i) => {
        const al = i === 0 ? 0.85 : 0.45;
        const f = strokeAxes(s, ph), h = strokeAxes(s, ph - 0.02);
        sc.part = `aile-arriere-${lr}`; drawMembrane(sc, HIND, ho, h.e1, h.e2, { alpha: al, bias: -0.01 });
        sc.part = `aile-avant-${lr}`; drawMembrane(sc, FORE, fo, f.e1, f.e2, { alpha: al });
      });
    } else {
      // the wings' plane rises a little outward over the dome of the abdomen's hair
      const h = restAxes(s, [-0.99, 0.13, 0.06], [0.06, 1, 0.12]);
      sc.part = `aile-arriere-${lr}`; drawMembrane(sc, HIND, ho, h.e1, h.e2, { bias: 0.4 });
      const f = restAxes(s, [-0.996, 0.08, 0.07], [0.05, 1, 0.1]);
      sc.part = `aile-avant-${lr}`; drawMembrane(sc, FORE, fo, f.e1, f.e2, { bias: 0.5 + (s > 0 ? 0.05 : 0) });
    }
  }
}

// ---- Assembly -----------------------------------------------------------------------------------------------------------------
export function bumblebee(az, el, opts = {}) {
  const { size = 512, k = 20, pose = 'pose', frame = 0, bg = null, detail = 1, idp = '', light, wing = true } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, 9, idp);
  sc.detail = detail;
  // in flight the body is raised (forward flight at low speed: Dudley & Ellington 1990), drawn here by turning the camera's
  // view of it: the scene is built level and seen pitched
  head(sc, pose); thorax(sc); abdomen(sc, pose);
  legs(sc, pose, pose === 'marche' ? frame : 0);
  if (wing) wings(sc, pose, frame);
  sc.part = '';
  return sc.svg(size, size, bg);
}

export const META = {
  id: 'bourdon', bodyMm: 15, span: 26,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], marche: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875], vol: [0, 1, 2], butine: [0] },
  lod: {
    S: { cell: 40, az: 15, poses: ['pose', 'marche', 'vol', 'butine'] },
    L: { cell: 112, az: 30, poses: ['pose', 'vol', 'butine'] },
  },
};
export const draw = (az, el, opts = {}) => bumblebee(az, el, opts);
