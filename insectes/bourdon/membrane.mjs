// The membranous wings of the bumblebee, drawn from their measured records (outils/membrane.py plat on the spread specimen c115):
// the outline and the zones of the membrane as smooth paths, each a colour over its measured opacity (the pair that best passes
// the light the membrane lets through over any ground); the veins as measured strokes (width, and the opacity of their dark cuticle
// that gives the colour read on the plate); the papillae of the distal membrane as a small seamless tile of dark points, seen in
// close-ups only. Over the measured paint, the light of the moment: the sky mirrored at grazing angles (Fresnel), thin-film colours,
// the lamp's glint. Nothing of the photograph is kept: contours, colours and counts only.
// Wing frame: s outward from the hinge, q toward the head (the costa), mm. The point (s, q) is o + s e1 + q e2.
import { readFileSync } from 'node:fs';
import { add, mul, dot, cross, norm, clamp, smooth, rng, fmt, hex2rgb, rgb2hex } from '../moteur/geo.mjs';

const load = (n) => JSON.parse(readFileSync(new URL(`./ailes/${n}.json`, import.meta.url), 'utf8'));
const nm = (x) => { const v = Math.round(x * 100) / 100; return (v === 0 ? '0' : v.toString()).replace(/^(-?)0\./, '$1.'); };
const pair = (a, b) => { const A = nm(a), B = nm(b); return A + (B[0] === '-' ? '' : ' ') + B; };
const f3 = (x) => (Math.round(x * 1000) / 1000).toString();
const fmt4 = (x) => (Math.round(x * 10000) / 10000).toString();

function smoothClosed(P) {
  const n = P.length, p = (i) => P[(i + n) % n];
  let [x, y] = p(0), d = `M${pair(x, y)}c`;
  const segs = [];
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const v = [p1[0] + (p2[0] - p0[0]) / 6 - x, p1[1] + (p2[1] - p0[1]) / 6 - y, p2[0] - (p3[0] - p1[0]) / 6 - x, p2[1] - (p3[1] - p1[1]) / 6 - y, p2[0] - x, p2[1] - y]
      .map((u) => Math.round(u * 100) / 100);
    segs.push(v.map(nm).reduce((s, t, k) => s + (k && t[0] !== '-' ? ' ' : '') + t, '')); x += v[4]; y += v[5];
  }
  return d + segs.join(' ').replace(/ -/g, '-') + 'z';
}

// linear sRGB
const lin = (h) => hex2rgb(h).map((v) => Math.pow(v / 255, 2.2));
const hexl = (c) => rgb2hex(c.map((v) => 255 * Math.pow(clamp(v, 0, 1), 1 / 2.2)));

// A vein read on the plate (colour c over the plate's light f): the colour over opacity that best passes, over any ground from
// black to white, the light it let through there (membrane.py over_pair, the same least squares).
function overPlate(c, f) {
  const C = lin(c), F = lin(f);
  const T = C.map((v, i) => clamp(v / Math.max(1e-3, F[i]), 0, 1));
  let best = null;
  for (let a = 0.002; a <= 1; a += 0.002) {
    const Cc = T.map((t) => clamp((t - 1 + a) / (2 * a), 0, 1));
    let e = 0;
    for (let i = 0; i < 3; i++) { const k0 = a * Cc[i], k1 = 1 - a - T[i]; e += k0 * k0 + k0 * k1 + k1 * k1 / 3; }
    if (!best || e < best.e) best = { e, a, Cc };
  }
  return { a: best.a, c: hexl(best.Cc) };
}

// A seamless tile of n points on a torus of side T (relaxed throw), as round dots of diameter dd.
function dotTile(n, T, dd, seed) {
  const R = rng(seed), P = [];
  for (let i = 0; i < n; i++) P.push([R() * T, R() * T]);
  const wrap = (dx) => dx - T * Math.round(dx / T), sp = T / Math.sqrt(n);
  for (let it = 0; it < 5; it++) {
    const mv = P.map(() => [0, 0]);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = wrap(P[i][0] - P[j][0]), dy = wrap(P[i][1] - P[j][1]), d = Math.hypot(dx, dy);
      if (d > 0 && d < sp) { const f = ((sp - d) / d) * 0.25; mv[i][0] += dx * f; mv[i][1] += dy * f; }
    }
    P.forEach((p, i) => { p[0] = (((p[0] + mv[i][0]) % T) + T) % T; p[1] = (((p[1] + mv[i][1]) % T) + T) % T; });
  }
  let d = '';
  for (const [x, y] of P) for (const ox of [0, -T, T]) for (const oy of [0, -T, T]) {
    const cx = x + ox, cy = y + oy;
    if (cx < -dd || cx > T + dd || cy < -dd || cy > T + dd) continue;
    d += `M${pair(cx, cy)}h0`;
  }
  return d;
}

// A vein: a fine tube of its own brown (CORE: the darkest quarter of the veins on the flat wings of c115, L* 38 a 10 b 11) over
// the opacity that gives, over the plate's light f, the colour c read there (least squares over the channels), lowered by VA, its
// width capped at WMAX (the 90th centile of the widths at half depth along the veins of the photo). Fitted as a filter the veins
// went to saturated reds glowing over the black body; the cap and VA bring the median depth along the veins to the photo's.
const CORE = '#6f5349', VA = 0.8, WMAX = 0.095;
function veinOver(c, f) {
  const V = lin(c), F = lin(f), K = lin(CORE);
  let num = 0, den = 0;
  for (let i = 0; i < 3; i++) { num += (F[i] - V[i]) * (F[i] - K[i]); den += (F[i] - K[i]) ** 2; }
  return { a: clamp(VA * num / Math.max(1e-6, den), 0, 0.9), c: CORE };
}

// One wing's record prepared once: its paths and colours.
export function membrane(name, opt = {}) {
  const R = load(name);
  const k = opt.scale ?? 1;
  // the record's frame is the specimen's (the wing pulled forward when it was set): turned about the hinge so that the wing's axis
  // is the span axis s: halfway between the line to its apex (outermost point) and the line of its outer costa (the line from the
  // hinge that the outline's outer part lies under), the costa on the side of q > 0
  const apex = R.contour.reduce((b, p) => (p[0] > b[0] ? p : b));
  const far = 0.35 * apex[0];
  let cang = -Math.PI / 2;
  for (const p of R.contour) if (p[0] > far) cang = Math.max(cang, Math.atan2(p[1], p[0]));
  const ang = (Math.atan2(apex[1], apex[0]) + cang) / 2;
  const ca = Math.cos(-ang), sa = Math.sin(-ang);
  const S = (P) => P.map(([s, q]) => [(ca * s - sa * q) * k, (sa * s + ca * q) * k]);
  const outline = smoothClosed(S(R.contour));
  const CT = S(R.contour), xs = CT.map((p) => p[0]), ys = CT.map((p) => p[1]);
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  // the zones' opacity halved: rendered flat over the plate, the measured pairs left the membrane at L* 89 against the photo's 94.6
  // (the fit counts the dark veins and papillae inside each zone); halved, 93.4 and 91.8 against 94.6 and 93.4
  const zones = R.zones.map((z) => ({ c: z.c, a: z.a * 0.5, d: z.poly ? z.poly.map((P) => smoothClosed(S(P))).join('') : outline }));
  // veins grouped again by their colour over opacity (a few strokes of one width and colour each)
  const veins = R.nervures.map((V) => ({ w: Math.min(V.largeur, WMAX) * k, ...veinOver(V.c, R.fond), d: V.traits.map((P) => 'M' + S(P).map((p) => pair(p[0], p[1])).join('L')).join('') }));
  const pap = R.papilles && { ...R.papilles, d: R.papilles.poly.map((P) => smoothClosed(S(P))).join(''), ...overPlate(R.papilles.c, R.fond) };
  return { name, R, k, outline, box, zones, veins, pap, length: Math.max(...xs), turn: (ang * 180) / Math.PI, seed: opt.seed ?? 7 };
}

// The paint of the wing in its own plane (mm): zones, papillae, veins, then the light (sheen, thin film, glint).
// light: { fres, sky, irid, glint, sh } computed by drawMembrane for the view; px: screen px per mm (for the close-up details).
export function membranePaint(sc, W, light = { fres: 0.05, sky: 0.5, irid: 0, glint: 0 }, px = 10, alpha = 1) {
  let s = '';
  // the membrane gets denser seen edge on (more of it along the line of sight), as smoked glass does
  const thick = light.thick ?? 1;
  for (const z of W.zones) s += `<path d="${z.d}" fill="${z.c}" fill-opacity="${fmt(clamp(1 - Math.pow(1 - z.a, thick), 0, 0.95))}" fill-rule="evenodd"/>`;
  // papillae: a tile of dark points, only where they are larger than a third of a pixel
  if (W.pap && px * W.pap.taille > 0.35) {
    const T = Math.max(0.5, Math.sqrt(220 / W.pap.densite)), n = Math.max(4, Math.round(W.pap.densite * T * T));
    const pid = sc.id('pp'), dd = W.pap.taille * W.k;
    sc.defs.push(`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${f3(T * W.k)}" height="${f3(T * W.k)}">` +
      `<path d="${dotTile(n, T * W.k, dd, W.seed * 31 + 5)}" stroke="${W.pap.c}" stroke-width="${f3(dd)}" stroke-linecap="round" fill="none"/></pattern>`);
    s += `<path d="${W.pap.d}" fill="url(#${pid})" opacity="${fmt(clamp(W.pap.a * 1.4, 0.1, 0.8))}"/>`;
  }
  // the reflected sky and the thin-film colours, over the membrane, under the veins
  if (light.fres > 0.004) s += `<path d="${W.outline}" fill="#e6d3b4" fill-opacity="${fmt(light.fres * light.sky)}"/>`;
  if (light.irid > 0.01) {
    const [x0, y0, x1, y1] = W.box, iid = sc.id('mi'), cx = (x0 + x1) / 2 + (x1 - x0) * 0.25 * (light.ish ?? 0);
    sc.defs.push(`<radialGradient id="${iid}" gradientUnits="userSpaceOnUse" cx="${fmt(cx)}" cy="${fmt((y0 + y1) / 2)}" r="${fmt((x1 - x0) * 0.6)}">` +
      `<stop offset="0" stop-color="#ffd27a" stop-opacity="0"/><stop offset="0.35" stop-color="#ff8ad0" stop-opacity="${fmt(light.irid)}"/>` +
      `<stop offset="0.55" stop-color="#ffe07a" stop-opacity="${fmt(light.irid * 0.8)}"/><stop offset="0.72" stop-color="#7ef0c0" stop-opacity="${fmt(light.irid)}"/>` +
      `<stop offset="0.9" stop-color="#86b4ff" stop-opacity="${fmt(light.irid * 0.7)}"/><stop offset="1" stop-color="#c088ff" stop-opacity="0"/></radialGradient>`);
    s += `<path d="${W.outline}" fill="url(#${iid})"/>`;
  }
  // veins: thinner than a fifth of a pixel they would only shimmer: widened to it, their opacity lowered as much
  for (const V of W.veins) {
    let w = V.w, a = V.a;
    const minw = 0.35 / px;
    if (w < minw) { a *= w / minw; w = minw; }
    s += `<path d="${V.d}" stroke="${V.c}" stroke-opacity="${fmt(clamp(1 - Math.pow(1 - a, thick), 0, 1))}" stroke-width="${f3(w)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }
  if (light.glint > 0.01) s += `<path d="${W.outline}" fill="#fffdf6" fill-opacity="${fmt(light.glint * 0.35)}"/>`;
  return alpha < 1 ? `<g opacity="${fmt(alpha)}">${s}</g>` : s;
}

// One wing in the scene: an affine image of its plane (an orthographic view of a plane is exactly affine), registered as an
// occluder (its smoked membrane shades what lies under it) and sorted with the pieces by the depth of its middle.
export function drawMembrane(sc, W, o, e1, e2, opt = {}) {
  const { cam, k } = sc;
  const [x0, y0, x1, y1] = W.box;
  const alpha = opt.alpha ?? 1;
  // what lies under the wing gets the light through it twice: T about 0.85 flat, so 0.72 (on c024 the stacked wings over the
  // midline take the band of the 2nd tergite from L* 37 to 22)
  sc.wings.push({ o, e1, e2, n: norm(cross(e1, e2)), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, rx: (x1 - x0) / 2 * 0.95, ry: (y1 - y0) / 2 * 0.9, shadow: 0.28 * alpha });
  const a = k * dot(e1, cam.r), b = -k * dot(e1, cam.u), c = k * dot(e2, cam.r), d = -k * dot(e2, cam.u);
  const det = Math.abs(a * d - b * c) / (k * k);
  const q = sc.S(o);
  const nw = norm(cross(e1, e2)), facing = Math.abs(dot(nw, cam.c));
  const light = {
    // the sky mirrored on the membrane: over the black abdomen the folded wing of c060 reads L* 45 a 4 b 15 (a warm sheen of
    // about a tenth of the sky, the back surface's share tinted by the membrane), brighter toward grazing
    fres: 0.1 + 0.15 * Math.pow(1 - facing, 4),
    sky: 0.5 + 0.5 * Math.abs(dot(nw, cam.u)),
    irid: 0.12 * Math.pow(1 - facing, 1.2) * (opt.irid ?? 1),
    ish: dot(nw, cam.H) * 0.5,
    glint: smooth(0.95, 1, Math.abs(dot(nw, cam.H))),
    // the optical thickness grows as 1 / cos of the angle of view, capped (a wing seen nearly edge on reads as a dark line)
    thick: Math.min(2.2, 1 / Math.max(0.45, facing)),
  };
  if (det < 0.015) return;
  const s = `<g transform="matrix(${fmt4(a)} ${fmt4(b)} ${fmt4(c)} ${fmt4(d)} ${fmt(q[0])} ${fmt(q[1])})">` + membranePaint(sc, W, light, k * Math.sqrt(det), alpha) + '</g>';
  sc.push(dot(add(o, mul(e1, W.length * 0.5)), cam.c) + (opt.bias || 0), s);
}
