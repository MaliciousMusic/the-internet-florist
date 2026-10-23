// Butterfly builder (peacock, swallowtail): the body is baked in the view atlas, the four wings are not. Each wing is
// drawn once, flat, upper side and underside, baked as its own texture, and placed by an affine matrix at runtime with
// any flap angle (DECISIONS: flat wings as textured planes). The same drawings serve the sheets through drawWing.
import { add, sub, mul, norm, cross, rot, rad } from './geo.mjs';
import { camera } from './geo.mjs';
import { Scene, drawBody, drawTube, drawWing } from './insecte.mjs';
import { X, Y, Z, frame0, env, legChain, sphere, pitched } from './kit.mjs';

// Wing axes of a butterfly wing for a flap angle (0: spread flat, +90: closed above the back) and a sweep (positive:
// swept back). side +1 for the left wings. The leading edge (q) points forward.
export function flapAxes(side, flapDeg, sweepDeg, twistDeg = 0) {
  // the wing turned in its own plane by the sweep (about the body's z, as the wing is drawn back over the hindwing), then raised
  // by the flap about the body's x axis: at rest (flap near 90) the sweep turns the wing within the plane of the closed wings
  const fl = rad(flapDeg), sw = rad(sweepDeg);
  const e1 = [-Math.sin(sw), side * Math.cos(sw) * Math.cos(fl), Math.cos(sw) * Math.sin(fl)];
  let e2 = [Math.cos(sw), side * Math.sin(sw) * Math.cos(fl), Math.sin(sw) * Math.sin(fl)];
  if (twistDeg) e2 = rot(e2, side > 0 ? e1 : mul(e1, -1), -rad(twistDeg));
  return { e1, e2 };
}

// Body of the butterfly: head with big eyes, palps and clubbed antennae, a furry thorax, a slender abdomen, and the
// four walking legs (the front pair is reduced in these species and folded against the chest).
export function butterflyBody(S, sc, pose, opts = {}) {
  const C = S.colors;
  const flying = pose === 'vol';
  drawBody(sc, {
    name: 'thorax', frame: frame0([1.6, 0, 0.3]), color: C.body, seed: 21,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.55); return { x: -2.0 + 4.0 * t, zc: 0, ry: S.thorax * e, rz: S.thorax * 1.05 * e }; },
    shade: { hl: 0.12, dark: 0.6 },
    hair: { n: 1600, len: S.fur, w: 0.035, lean: 0.6, a: 0.8, droop: 1.3, twist: 1.4, color: (t, th, R) => (R() < 0.5 ? C.fur : R() < 0.5 ? C.furHi : C.body) },
  });
  drawBody(sc, {
    name: 'abdomen', frame: pitched([-0.2, 0, 0.1], flying ? -6 : -10), color: C.abdomen, seed: 31,
    profile: (t) => { const e = env(t, 0.4, 0.3) / 0.62; return { x: -S.abdomen * (1 - t), zc: -0.2 * (1 - t), ry: S.thorax * 0.62 * e, rz: S.thorax * 0.66 * e }; },
    bands: S.abdomenBands,
    shade: { hl: 0.12, dark: 0.55 },
    hair: { n: 900, len: S.fur * 0.5, w: 0.03, lean: 1.0, a: 0.75, color: (t, th, R) => (S.abdomenHair ? S.abdomenHair(t, th, R) : R() < 0.6 ? C.fur : C.body) },
  });
  const H = [4.1, 0, 0.6];
  drawBody(sc, {
    name: 'head', frame: frame0(H), color: C.body, seed: 11,
    profile: (t) => { const e = Math.pow(env(t, 0.5, 0.5) * 2, 0.6); return { x: -0.7 + 1.4 * t, zc: 0, ry: 1.0 * e, rz: 0.95 * e }; },
    shade: { hl: 0.12, dark: 0.55 },
    hair: { n: 300, len: S.fur * 0.6, w: 0.03, lean: 0.4, a: 0.8, color: (t, th, R) => (R() < 0.6 ? C.fur : C.furHi) },
  });
  for (const s of [1, -1]) {
    drawBody(sc, { ...sphere('eye', add(H, [0.3, 0.75 * s, 0.15]), 0.62, C.eye, 0.5), bias: 0.04 });
    // palps, hairy, pointing forward and up
    drawTube(sc, [add(H, [0.6, 0.22 * s, -0.5]), add(H, [1.3, 0.25 * s, -0.2]), add(H, [1.8, 0.2 * s, 0.3])], [0.2, 0.18, 0.1],
      { color: C.palp, hair: [{ n: 10, len: 0.3, w: 0.04, color: C.palp, side: [0, 0, 1], both: true }, { n: 8, len: 0.25, w: 0.04, color: C.palp, side: [0, 0, 1], both: true }], seed: 5 + s });
    // clubbed antennae
    const pts = [add(H, [0.55, 0.3 * s, 0.75])];
    let d = norm([0.75, 0.35 * s, 0.55]), p = pts[0];
    for (let i = 0; i < 14; i++) { p = add(p, mul(d, S.antenna / 14)); pts.push(p); d = norm(add(d, [0, 0, -0.01])); }
    drawTube(sc, pts, pts.map((_, i) => (i > 11 ? 0.22 : i > 10 ? 0.15 : 0.075)), { color: C.antenna, bias: 0.02 });
    if (S.antennaTip) drawBody(sc, { ...sphere('club', pts[pts.length - 1], 0.18, S.antennaTip, 0.3), bias: 0.03 });
  }
  // Legs: middle and hind pairs stand; the reduced forelegs fold under the head.
  const G = -3.2;
  for (const s of [1, -1]) for (const [k2, base, foot, len] of [['mid', [2.0, 0.6, -0.9], [3.6, 3.2], [2.6, 2.8, 2.6]], ['hind', [1.0, 0.7, -0.9], [-1.6, 3.4], [2.8, 3.0, 2.8]]]) {
    const L = { base, fem: len[0], tib: len[1], tar: len[2] };
    const tip = flying ? [base[0] - 2.8, base[1] + 0.8, base[2] - 2.2] : [foot[0], foot[1], G];
    const td = norm(flying ? [-0.8, 0.2, -0.5] : [0.3 * Math.sign(foot[0] - base[0]), 0.6, -0.5]);
    const ch = legChain(L, s, sub(tip, mul(td, L.tar)), td, [0, 0.5, 1], [0.4, 0.2, 0.15, 0.25], 0.04);
    drawTube(sc, ch.pts, [0.13, 0.1, 0.08, 0.07, 0.06, 0.06, 0.05, 0.05, 0.04, 0.04, 0.035], { color: C.leg, gloss: 0.3, seed: 60 + s });
  }
  for (const s of [1, -1]) drawTube(sc, [[3.2, 0.5 * s, -0.7], [3.9, 0.7 * s, -1.3], [4.4, 0.5 * s, -1.0]], [0.12, 0.1, 0.07], { color: C.palp, hair: [{ n: 8, len: 0.3, w: 0.04, color: C.palp, side: [0, 0, 1], both: true }], seed: 70 + s });
}

// The whole butterfly for sheets and previews: body plus the four wings at a given flap.
export function butterfly(S, az, el, opts = {}) {
  const { size = 256, k = 6, pose = 'vol', frame = 0, bg = null, detail = 1, idp = '', light, wings = true, flap, sweep } = opts;
  const cam = camera(az, el, light);
  const sc = new Scene(cam, k, size / 2, size / 2, S.seed, idp);
  sc.detail = detail;
  (S.body || butterflyBody)(S, sc, pose === 'soleil' ? 'pose' : pose);
  if (wings) {
    const fl = flap ?? (pose === 'etale' ? 0 : pose === 'soleil' ? 3 : pose === 'vol' ? 20 : 85); // etale: spread flat as a set specimen; soleil: basking
    const sw = sweep ?? 0;
    // per pose, the forewings swing back over the hindwings when the wings close (S.sweepPose, measured on resting photos)
    // (an explicit sweep, as the animation sheet gives, replaces the pose's own)
    const sp = sweep === undefined ? (S.sweepPose?.[pose] ?? { fore: 0, hind: 0 }) : { fore: 0, hind: 0 };
    for (const s of [1, -1]) {
      const f = flapAxes(s, fl, sw + S.sweep.fore + sp.fore, 0), h = flapAxes(s, fl - 3, sw + S.sweep.hind + sp.hind, 0);
      const lr = s > 0 ? 'g' : 'd';
      sc.part = `aile-arriere-${lr}`;
      drawWing(sc, S.hind, [S.hingeHind[0], S.hingeHind[1] * s, S.hingeHind[2]], h.e1, h.e2, { side: s, bias: -0.02 });
      sc.part = `aile-avant-${lr}`;
      drawWing(sc, S.fore, [S.hingeFore[0], S.hingeFore[1] * s, S.hingeFore[2]], f.e1, f.e2, { side: s, bias: 0.02 });
      sc.part = '';
    }
  }
  return sc.svg(size, size, bg);
}
