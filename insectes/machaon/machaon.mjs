// Old World swallowtail (Papilio machaon): cream-yellow wings veined and barred with black, a black band along the
// margins holding yellow lunules, blue scales on the hindwing band, the orange-red eye-spot at the inner angle, the tails.
// The four wing faces are measured on spread specimens of MHNT (porteur 2026-10-23, « contours extraits »): the upper side on
// c255 (43.5 px/mm), the underside on c032 (42.6 px/mm), by outils/aile.py plat (zones, tones per cell, dust, rows of
// scales, fringe), calibrated against the flattened photos with aile.py paire and poudre.py (ETAT.md).
// Wing frame: s outward from the hinge, perpendicular to the body axis; q toward the head; mm.
import { readFileSync } from 'node:fs';
import { butterfly, butterflyBody } from '../moteur/papillon.mjs';
import { motif, loadMotif } from '../moteur/motif.mjs';
import { drawBody, drawTube } from '../moteur/insecte.mjs';
import { frame0, env, sphere, pitched, ik, articleLeg, fringe } from '../moteur/kit.mjs';
import { add, sub, mul, norm } from '../moteur/geo.mjs';

const rec = (n) => loadMotif(new URL(`./ailes/${n}.json`, import.meta.url));
const R_FU = rec('avant-dessus'), R_FD = rec('avant-dessous'), R_HU = rec('arriere-dessus'), R_HD = rec('arriere-dessous');
// The underside is another specimen, spread at its own angle: aile.py fitted one outline on the other (alignement: the scale
// and turn that bring the face seen whole onto the face that completes from it). U: underside record -> upper frame.
const aF = R_FD.alignement, aH = R_HU.alignement;
const U_F = { k: 1 / aF.echelle, rot: -aF.angle }, U_H = { k: aH.echelle, rot: aH.angle };
// the dust of each face calibrated against its photo (poudre.py --ecrire: ailes/etalonnage.json)
const E = (() => { try { return rec('etalonnage'); } catch { return {}; } })();
// both faces measured on dried specimens (c255, c032): their blacks brought to the living ones (L* 7 to 10 on c054, c131, c086)
const LIVE = { below: 34, dL: -9 };
const M_FU = motif(R_FU, { seed: 11, dustK: E['avant-dessus'], live: LIVE });
const M_FD = motif(R_FD, { seed: 12, dustK: E['avant-dessous'], live: LIVE, ...U_F });
const M_HU = motif(R_HU, { seed: 13, dustK: E['arriere-dessus'], live: LIVE });
const M_HD = motif(R_HD, { seed: 14, dustK: E['arriere-dessous'], live: LIVE, ...U_H });

// rows of scales per face: their centre and period measured on each face (aile.py, rangees), brought to the upper frame
const toUp = (p, U) => { const c = Math.cos((U.rot * Math.PI) / 180), sn = Math.sin((U.rot * Math.PI) / 180); return [U.k * (c * p[0] - sn * p[1]), U.k * (sn * p[0] + c * p[1])]; };
const rows = (R, U = { k: 1, rot: 0 }) => ({ period: (R.rangees.periode || 0.09) * U.k, centre: toUp(R.rangees.centre, U), from: -110, to: 110, dark: '#000', light: '#fff', k: 0.09, kl: 0.3, w: 0.45 });

const FORE = {
  span: M_FU.length, opaque: true, outline: M_FU.outline, box: M_FU.box, base: M_FU.base, baseUnder: M_FD.base,
  paint: M_FU.paint, paintUnder: M_FD.paint, top: M_FU.top, topUnder: M_FD.top, under: U_F,
  soft: 0.01, grain: 0.04, veins: null, sheen: '#fffbe8',
};
const HIND = {
  span: M_HU.length, opaque: true, outline: M_HU.outline, box: M_HU.box, base: M_HU.base, baseUnder: M_HD.base,
  paint: M_HU.paint, paintUnder: M_HD.paint, top: M_HU.top, topUnder: M_HD.top, under: U_H,
  soft: 0.01, grain: 0.04, veins: null, sheen: '#fffbe8',
};

// ---------------------------------------------------------------------------------------------------------------
// The body, measured (ETAT.md): on the spread specimens c255 (above, 43.5 px/mm) and c032 (below, 42.6 px/mm) for its
// lengths and widths, on the living c041 (front), c120, c125 (head and thorax, three-quarter and side), c038 (head from
// above) and c147 (legs) for what a dried specimen loses: the glossy black eyes, the coiled proboscis, the stance.
// Body frame: x forward, y to the left, z up, mm; the origin on the axis at the forewings' hinge line.
// Every organ is drawn under its own name (sc.part): the SVG keeps one group per organ, for animation.
// ---------------------------------------------------------------------------------------------------------------
const grid = (n) => JSON.parse(readFileSync(new URL(`./grilles/${n}.json`, import.meta.url), 'utf8'));
const G_ABD = grid('abdomen'), G_THX = grid('thorax');           // plat_corps.py + grille_corps.py on c255 and c032
const BLACK = '#1a1712', CREAM = '#e7dcb6', YEL = '#e2cf86';
// satin, not chrome (c041, c120): a broad soft highlight, little mirror
const EYEMAT = { ks: 0.32, p: 45, ks2: 0.12, p2: 6, env: 0.22, wrap: 0.15, amb: 0.32, mottle: 0.06, specColor: '#f4efe6' };
const LEGMAT = { ks: 0.5, p: 70, ks2: 0.08, p2: 6, env: 0.35, mottle: 0.05, specColor: '#fff4e6' };
const pick = (R, a) => a[Math.floor(R() * a.length) % a.length];

// lengths (mm) measured on c255 / c032: head front x 7.0, eyes x 5.2 (4.0 mm across), thorax x 4.4 to -5.8 (4.9 mm wide),
// the abdomen's width from the living c131 and c086 (the spread specimen's abdomen is pressed flat, 5.8 mm wide),
// abdomen x -5.6 to -17.2 (4.6 mm at its widest, the female's), antennae 12.4 mm with a club of 2.4 mm, legs about 14 mm
const B = {
  head: [5.2, 0, 0.55], eye: [5.25, 1.22, 0.62], eyeR: 0.8,
  thorax: [4.5, -5.9], thoraxR: [2.45, 2.35], abdomen: [-5.0, -17.6], abdomenR: 2.1,
  antBase: [5.85, 0.42, 1.25], antLen: 12.4, club: 2.4,
};

function head(sc) {
  sc.part = 'tete';
  drawBody(sc, {
    name: 'head', frame: frame0(B.head), color: BLACK, seed: 11, mat: { ks: 0.15, p: 20, env: 0.1 },
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -1.05 + 2.1 * t, zc: 0, ry: 1.0 * e, rz: 1.05 * e }; },
    // the frons and the crown: yellow tufts between and above the eyes, black behind (c041, c038)
    hair: { n: 900, len: 0.55, w: 0.022, lean: 0.35, a: 0.85, droop: 0.4, twist: 0.8, fleece: 0.3,
      color: (t, th, R) => (t > 0.55 || Math.sin(th) > 0.6 ? pick(R, [YEL, YEL, '#f0e2a6', '#c9b46a']) : pick(R, [BLACK, '#2b261c', YEL])) },
  });
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'oeil-g' : 'oeil-d';
    drawBody(sc, { ...sphere('eye', [B.eye[0], B.eye[1] * s, B.eye[2]], B.eyeR, '#110e0a', 0), mat: EYEMAT, facets: 0.018, bias: 0.04 });
    // labial palps: hairy, cream with a black stripe on the outer face, forward and up between the eyes (c041, c032)
    sc.part = s > 0 ? 'palpe-g' : 'palpe-d';
    drawTube(sc, [[5.95, 0.32 * s, -0.4], [6.45, 0.34 * s, -0.2], [6.75, 0.3 * s, 0.1]], [0.2, 0.18, 0.1], {
      color: '#4a3e2a', hair: [{ n: 40, len: 0.32, w: 0.026, color: CREAM, side: [0, 0, 1], both: true }, { n: 30, len: 0.3, w: 0.026, color: BLACK, side: [0, s, 0], both: false }], seed: 5 + s });
    // antennae: slender, black, curving gently outward, a club of 2.4 mm that thickens and bends a little down (c120, c041)
    sc.part = s > 0 ? 'antenne-g' : 'antenne-d';
    const pts = [[B.antBase[0], B.antBase[1] * s, B.antBase[2]]];
    let d = norm([0.66, 0.36 * s, 0.66]), p = pts[0];
    const n = 24;
    for (let i = 0; i < n; i++) {
      p = add(p, mul(d, B.antLen / n)); pts.push(p);
      const clubbing = i > n * (1 - B.club / B.antLen);
      d = norm(add(d, clubbing ? [0.02, 0.012 * s, -0.06] : [0.004, 0.004 * s, -0.012]));
    }
    const rad = pts.map((_, i) => { const f = i / n, c0 = 1 - B.club / B.antLen; return f < c0 ? 0.075 - 0.01 * f : 0.07 + 0.16 * Math.sin(Math.min(1, (f - c0) / (1 - c0)) * Math.PI * 0.62); });
    drawTube(sc, pts, rad, { color: BLACK, gloss: 0.35, bias: 0.02 });
  }
}

// The proboscis: coiled under the head at rest (two and a half turns, in the plane of symmetry); uncoiled to feed.
function proboscis(sc, pose) {
  sc.part = 'trompe';
  const P = [];
  if (pose === 'butine') {
    for (let i = 0; i <= 16; i++) { const t = i / 16; P.push([6.2 + 9.5 * t, 0, -0.6 - 6.5 * t - 1.2 * t * t]); }
  } else {
    const c = [6.55, 0, -1.25], turns = 2.6, N = 60;
    P.push([6.15, 0, -0.55]);
    for (let i = 0; i <= N; i++) {
      const f = i / N, a = Math.PI * 0.6 + f * turns * 2 * Math.PI, r = 0.85 * (1 - 0.8 * f);
      P.push([c[0] + r * Math.cos(a), 0, c[2] + r * Math.sin(a)]);
    }
  }
  drawTube(sc, P, P.map((_, i) => 0.085 - 0.03 * (i / P.length)), { color: '#16120d', gloss: 0.5, bias: 0.03 });
}

function thorax(sc) {
  sc.part = 'thorax';
  const [x0, x1] = B.thorax, L = x0 - x1, [ry, rz] = B.thoraxR;
  drawBody(sc, {
    name: 'thorax', frame: frame0([x1, 0, 0.25]), color: BLACK, seed: 21, grid: G_THX, mat: { ks: 0.1, p: 16, env: 0.08 },
    profile: (t) => { const e = Math.pow(env(t, 0.42, 0.5) / 0.6, 0.6); return { x: L * t, zc: 0.15 * Math.sin(Math.PI * t), ry: ry * e, rz: rz * e }; },
    shape: (th) => [1, Math.sin(th) < 0 ? 0.88 : 1],
    // long fur in the colours of its grid: the black back between the yellow stripes, the yellow flanks (c255, c120, c038)
    hair: { n: 6500, len: 0.95, w: 0.024, lean: 1.15, a: 0.9, droop: 0.9, twist: 0.5, wave: 0.12, curl: 0.15, fleece: 0.1, pile: 0.4, locks: 0.25,
      sheen: 0.03, sheenP: 50, color: 'grid', gridK: 0.95, lenAt: (t, th) => (t > 0.85 ? 0.7 : 1) },
  });
  // the tegulae: hairy scales over the forewings' bases, cream-yellow in front, black behind (c255: they hide the hinge)
  for (const s of [1, -1]) {
    sc.part = s > 0 ? 'tegula-g' : 'tegula-d';
    drawBody(sc, {
      name: 'tegula', frame: pitched([0.9, 2.15 * s, 1.2], -12), color: BLACK, seed: 23 + s,
      profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.7); return { x: -1.4 + 3.0 * t, zc: 0, ry: 0.85 * e, rz: 0.45 * e }; },
      hair: { n: 900, len: 1.3, w: 0.024, lean: 0.85, a: 0.85, droop: 1.6, twist: 1.1, fleece: 0.4, pile: 0.3,
        color: (t, th, R) => (t > 0.5 ? pick(R, [YEL, YEL, '#cdb86e', BLACK]) : pick(R, [BLACK, BLACK, '#3a3328', YEL])) },
      bias: 0.06,
    });
  }
}

function abdomen(sc, pose) {
  sc.part = 'abdomen';
  const [x0, x1] = B.abdomen, L = x0 - x1, R0 = B.abdomenR;
  drawBody(sc, {
    name: 'abdomen', frame: pitched([x1, 0, -0.6], pose === 'vol' ? -4 : -8), color: BLACK, seed: 31, grid: G_ABD, mat: { ks: 0.03, p: 10, env: 0.0, ks2: 0.01, wrap: 0.35, mottle: 0.12 },
    // widest at a third from the thorax, tapering to the tip (c032)
    // t from the tip (0) to the base (1): round at the tip, widest at two thirds, still 80 % wide where it meets the thorax
    profile: (t) => {
      const a = Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.6)), 0.5), b = t > 0.6 ? 1 - 0.18 * ((t - 0.6) / 0.4) ** 2 : 1;
      const e = Math.max(0.12, a * b);
      return { x: L * t, zc: -0.25 * (1 - t), ry: R0 * e, rz: R0 * 0.92 * e };
    },
    // scales more than hairs: a short sparse pile, so the yellow flanks stay flat and bright (c255); longer hairs at the base
    hair: { n: 1800, len: 0.3, w: 0.02, lean: 1.2, a: 0.8, fleece: 0, pile: 0.5, sheen: 0.02, color: 'grid', gridK: 1.0,
      lenAt: (t, th) => (t > 0.85 && Math.sin(th) > 0 ? 3.5 : 1) },
  });
}

// Legs: six, all walking in the swallowtails (the forelegs are not reduced), black with a cream line along the front face
// (c032, c147), femur 4.2, tibia 4.4, tarsus 4.6 mm; the pose sets where the feet are.
const LEG = { coxa: 1.0, fem: 4.2, tib: 4.4, tar: 4.6 };
const legArt = (c) => ({
  fem: { r: [0.17, 0.19, 0.14], c: BLACK, hair: fringe(30, 0.16, CREAM, 0.6) },
  tib: { r: [0.13, 0.13, 0.11], c: BLACK, hair: fringe(30, 0.14, '#3a3226', 0.6) },
  bas: { r: [0.09, 0.08, 0.07], c: '#2a221a', flat: 0.8 },
  tar: { r: 0.06, c: '#2a221a' },
});
function legs(sc, pose) {
  const G = -5.6;
  const SET = {
    // [coxa on the chest, foot target (standing), pole of the knee]
    // the feet a little wider than the body, the knees out and up (c041 front, c147, c131)
    front: [[2.7, 0.45, -1.7], [7.4, 2.4, G], [0.4, 1, 0.9]],
    mid: [[1.0, 0.6, -1.95], [2.4, 3.3, G], [0, 1, 0.9]],
    hind: [[-0.8, 0.55, -1.85], [-3.6, 3.1, G], [-0.4, 1, 0.9]],
  };
  for (const [k, [cb, foot, pole]] of Object.entries(SET)) for (const s of [1, -1]) {
    sc.part = `patte-${k}-${s > 0 ? 'g' : 'd'}`;
    const sy = (p) => [p[0], p[1] * s, p[2]];
    const base = sy(cb);
    let ankle, tdir;
    if (pose === 'etale') {
      // a set specimen: the legs folded along the chest and the abdomen
      ankle = add(base, [k === 'front' ? 2.2 : -1.5, 1.2 * s, -1.6]); tdir = norm([k === 'front' ? 0.9 : -0.9, 0.15 * s, -0.25]);
    } else if (pose === 'vol') {
      ankle = add(base, [-2.6, 1.4 * s, -1.9]); tdir = norm([-0.9, 0.2 * s, -0.3]);
    } else {
      const f = sy(foot); tdir = norm([Math.sign(foot[0] - cb[0]) * 0.55, 0.45 * s, -0.7]);
      ankle = sub(f, mul(tdir, LEG.tar * 0.92));
    }
    const fb = add(base, [0, 0.35 * s, -0.55]);
    const { knee, ankle: an } = ik(fb, ankle, LEG.fem, LEG.tib, sy(pole));
    // the chain of points: femur base, knee, ankle, then the tarsus (basitarsus 40 %, four tarsomeres)
    const q = [fb, knee, an];
    const fr = [0.4, 0.15, 0.15, 0.14, 0.16];
    let pp = an;
    for (const f of fr) { const nx = add(pp, mul(tdir, LEG.tar * f)); q.push(add(pp, mul(tdir, LEG.tar * f * 0.5)), nx); pp = nx; }
    // the coxa as its own article, from the chest to the femur's base
    const A = legArt(); A.coxa = { from: [0, -0.35, 0.55], r: [0.28, 0.3, 0.22], c: BLACK, hair: fringe(40, 0.3, CREAM, 0.2) };
    articleLeg(sc, drawBody, drawTube, q, tdir, pp, A, s, LEGMAT);
  }
}

export function machaonBody(S, sc, pose) {
  head(sc); proboscis(sc, pose); thorax(sc); abdomen(sc, pose); legs(sc, pose);
  sc.part = '';
}

export const SPEC = {
  seed: 41, body: machaonBody,
  fore: FORE, hind: HIND,
  // the hinges where the wings leave the hair of the tegulae (c255: the fore 3.36 mm off the axis, the hind 2.76 mm behind it
  // and 2.67 mm off the axis)
  hingeFore: [0, 3.36, 1.0], hingeHind: [-2.76, 2.67, 0.85], sweep: { fore: 0, hind: 0 },
  // at rest the wings close over the back, the forewing swung back over the hindwing (c131, c086, c013: its costa about 40° back)
  // (c131, c086, c013: the forewing's costa about 40 deg back from the vertical, the hindwing's inner margin along the abdomen;
  // c054: basking, the forewings drawn back over the hindwings)
  sweepPose: { pose: { fore: 62, hind: 4 }, butine: { fore: 22, hind: 2 }, soleil: { fore: 14, hind: 0 } },
};

export const META = {
  id: 'machaon', bodyMm: 24.2, span: 36, wingspan: 78,
  el: [-25, 0, 20, 40, 65, 90],
  poses: { pose: [0], vol: [0], butine: [0] },
  lod: { S: { cell: 36, az: 15, poses: ['pose', 'vol', 'butine'] }, L: { cell: 104, az: 30, poses: ['pose', 'vol', 'butine'] } },
  // runtime wings: textures baked by outils/ailes.mjs, hinges in the body frame (mm)
  wings: { fore: { hinge: SPEC.hingeFore, span: FORE.span, sweep: 0 }, hind: { hinge: SPEC.hingeHind, span: HIND.span, sweep: 0 } },
};
// The atlas holds the body only; sheets show the whole butterfly with opts.wings.
export const draw = (az, el, opts = {}) => butterfly(SPEC, az, el, { wings: false, ...opts });
export const whole = (az, el, opts = {}) => butterfly(SPEC, az, el, { wings: true, ...opts });
export const WINGS = { fore: FORE, hind: HIND };
export { butterflyBody };
