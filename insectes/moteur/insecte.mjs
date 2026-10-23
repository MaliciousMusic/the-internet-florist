// Insect engine: an insect is a set of 3D pieces (bodies of elliptic sections, tubes, flat wings) that this module
// projects for one camera of the view sphere and paints as SVG. The SVG is the source; atlases are compiled from it.
//
// Engine v2 (PROTOCOLE.md §4, 2026-10-23): every body is shaded sample by sample on its own mesh, not by one gradient:
// direct light wrapped around the form, sky and ground reflected with a Fresnel term, a two-lobe highlight, light
// through thin cuticle at the rims, and the occlusion and cast shadows of the other pieces of the insect. Pieces are
// registered first (as occluders) and painted when the scene is written, so that each one sees all the others.
import {
  add, sub, mul, dot, cross, norm, len, lerp, clamp, smooth, rot,
  rng, hull, resample, smoothPath, openPath, fmt, mix, scale, hex2rgb, rgb2hex,
} from './geo.mjs';

// ---------------------------------------------------------------------------------------------------------------
// Light, in linear RGB. The light is fixed in the camera frame (top-front), the sky is the camera's up hemisphere and
// the ground (the warm beige of the shop) its down hemisphere, so mirrored views stay exact.
// ---------------------------------------------------------------------------------------------------------------
const SUN = [1.0, 0.96, 0.9], SKY = [0.66, 0.68, 0.72], GROUND = [0.45, 0.38, 0.3];
const lin = (h) => hex2rgb(h).map((v) => Math.pow(v / 255, 2.2));
const hexl = (c) => rgb2hex(c.map((v) => 255 * Math.pow(clamp(v, 0, 1), 1 / 2.2)));
const vmul = (a, b) => [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vs = (a, s) => [a[0] * s, a[1] * s, a[2] * s];

// Material of a piece: explicit (b.mat), or read from the v1 fields (gloss, shade) so that every species gains it.
function material(b) {
  const m = b.mat || {}, g = b.gloss, dk = b.shade?.dark ?? 0.6;
  return {
    wrap: m.wrap ?? 0.3,
    amb: m.amb ?? clamp(0.5 - 0.35 * (dk - 0.5), 0.25, 0.6),
    ks: m.ks ?? (g ? 0.55 * g.a : 0.02), p: m.p ?? (g ? clamp(9 / Math.max(0.04, g.size), 10, 260) : 8),
    ks2: m.ks2 ?? (g ? 0.1 * g.a : 0.015), p2: m.p2 ?? 5,
    env: m.env ?? (g ? 0.45 * g.a : 0.04), metal: m.metal ?? 0,
    trans: m.trans ? { c: lin(m.trans.color), k: m.trans.k } : null,
    // structural colour of a metallic cuticle: the reflection turns toward this colour at grazing angles
    shift: m.shift ? { c: lin(m.shift.color), k: m.shift.k } : null,
    spec: lin(m.specColor ?? g?.color ?? '#fff4e4'),
    // the colour a metal mirrors (its reflectance), when it differs from its body colour
    rtint: m.tintColor ? lin(m.tintColor) : null,
    mottle: m.mottle ?? 0.07,
    // (coccinelle) the surround a varnish mirrors: box weighs the softbox around the lamp (1: as before), sky the band of the
    // horizon [from, to] in r.u (a narrow band: the crisp window line of a lacquered dome)
    box: m.box ?? 1, sky: m.sky ?? null,
  };
}

// Shade one surface point: albedo A (linear), normal n, light visibility sh, ambient occlusion occ.
// Returns the diffuse colour (linear) and the specular overlay (linear, added on top of decals).
function shadePoint(cam, M, A, n, sh, occ) {
  const nv = clamp(dot(n, cam.c), 0, 1), nl = dot(n, cam.L), nu = dot(n, cam.u);
  const wrapL = clamp((nl + M.wrap) / (1 + M.wrap));
  const amb = vadd(vs(SKY, 0.5 + 0.5 * nu), vs(GROUND, 0.6 * (0.5 - 0.5 * nu)));
  let E = vadd(vs(SUN, 0.92 * wrapL * sh), vs(amb, M.amb * occ));
  let D = vmul(A, E);
  if (M.trans) D = vadd(D, vs(M.trans.c, M.trans.k * Math.pow(1 - nv, 2) * (0.35 + 0.65 * clamp(nl + 0.3)) * (0.5 + 0.5 * sh)));
  const nh = clamp(dot(n, cam.H));
  let tint = M.metal ? vadd(vs(M.spec, 1 - M.metal), vs(M.rtint || vs(A, 2.2), M.metal)) : M.spec;
  if (M.shift) { const w = M.shift.k * Math.pow(1 - nv, 1.5); tint = vadd(vs(tint, 1 - w), vs(M.shift.c, w)); }
  let S = vs(tint, sh * (M.ks * Math.pow(nh, M.p) * (M.p + 2) / 16 + M.ks2 * Math.pow(nh, M.p2)));
  if (M.env > 0) {
    const r = sub(mul(n, 2 * dot(n, cam.c)), cam.c);
    const sky = M.sky ? smooth(M.sky[0], M.sky[1], dot(r, cam.u)) : smooth(-0.25, 0.55, dot(r, cam.u));
    // a structured surround: the ground, a darker horizon band, the sky, and a broad bright softbox around the lamp
    const ru = dot(r, cam.u), hor = 1 - 0.6 * smooth(-0.2, 0.05, ru) * (1 - smooth(0.12, 0.35, ru));
    const box = smooth(0.55, 0.92, dot(r, cam.L)) * (M.box ?? 1);
    const envC = vadd(vs(vadd(vs(GROUND, 0.55 * (1 - sky)), vs(SKY, 1.2 * sky)), hor), vs(SUN, 1.6 * box));
    const F = 0.18 + 0.82 * Math.pow(1 - nv, 3);
    S = vadd(S, vs(vmul(envC, tint), M.env * F * occ));
  }
  return { D, S };
}

// ---------------------------------------------------------------------------------------------------------------
// Bodies: a generalised cylinder along a local axis. profile(t) gives, for t in [0, 1] (rear to front), the position
// along the axis x, the vertical offset zc and the two radii ry, rz of the elliptic section. shape(th) may bend the
// section (a head wider at the top, a flat belly). frame = { o, ax, ay, az } places the body in the model.
// th = pi/2 is the back, -pi/2 the belly, 0 the left flank.
// ---------------------------------------------------------------------------------------------------------------

export function surf(b, t, th) {
  const p = b.profile(t);
  const s = b.shape ? b.shape(th, t) : [1, 1];
  const ly = (p.yc || 0) + p.ry * Math.cos(th) * s[0];
  const lz = p.zc + p.rz * Math.sin(th) * s[1];
  const F = b.frame;
  return add(add(add(F.o, mul(F.ax, p.x)), mul(F.ay, ly)), mul(F.az, lz));
}

// Angle of the j-th sample around a section: the whole turn, or th0..th1 for an open shell.
function thAt(b, j, nth) {
  if (b.th0 === undefined) return (j / nth) * 2 * Math.PI;
  return b.th0 + (b.th1 - b.th0) * (j / (nth - 1));
}

function sample(b, nt = 44, nth = 40) {
  const P = [], N = [];
  for (let i = 0; i <= nt; i++) {
    const t = i / nt, row = [];
    for (let j = 0; j < nth; j++) row.push(surf(b, t, thAt(b, j, nth)));
    P.push(row);
  }
  for (let i = 0; i <= nt; i++) {
    const nrow = [];
    for (let j = 0; j < nth; j++) nrow.push(normalAt(b, i / nt, thAt(b, j, nth)));
    N.push(nrow);
  }
  return { P, N, nt, nth };
}

export function normalAt(b, t, th) {
  const e = 1e-3;
  const t0 = clamp(t - e, 0, 1), t1 = clamp(t + e, 0, 1);
  const dt = sub(surf(b, t1, th), surf(b, t0, th));
  const dth = sub(surf(b, t, th + e), surf(b, t, th - e));
  let n = norm(cross(dt, dth));
  // Outward: away from the section centre.
  const p = surf(b, t, th), F = b.frame, pr = b.profile(t);
  const c = add(add(add(F.o, mul(F.ax, pr.x)), mul(F.az, pr.zc)), mul(F.ay, pr.yc || 0));
  if (dot(n, sub(p, c)) < 0) n = mul(n, -1);
  // At the very ends the section shrinks to a point: blend toward the axis.
  if (len(dt) < 1e-6) n = norm(sub(p, c));
  return n;
}

// Light response of a surface normal for small flat marks (decals): wrapped Lambert in the v2 light.
function lit(col, n, cam, amb = 0.32) {
  const r = shadePoint(cam, { wrap: 0.3, amb: amb * 1.4, ks: 0, ks2: 0, p: 1, p2: 1, env: 0, metal: 0, trans: null, spec: [1, 1, 1] }, lin(col), n, 1, 1);
  return hexl(r.D);
}

export class Scene {
  // idp prefixes every id, so that several scenes can share one SVG document (sheets).
  constructor(cam, k, cx, cy, seed = 1, idp = '') {
    this.cam = cam; this.k = k; this.cx = cx; this.cy = cy; this.items = []; this.defs = []; this.uid = 0; this.seed = seed; this.idp = idp;
    this.jobs = []; this.occ = []; this.wings = []; this.nbody = 0;
    // the organ being drawn (sc.part = 'trompe' ...): every piece carries it, and the SVG groups each organ's pieces under
    // <g class="p-<organ>"> so that an organ can be found and animated on its own (porteur 2026-10-23)
    this.part = '';
  }
  S(p) { const q = this.cam.proj(p); return [this.cx + q[0] * this.k, this.cy - q[1] * this.k, q[2]]; }
  id(p) { return `${this.idp}${p}${this.uid++}`; }
  push(depth, svg, part = this.part) { this.items.push({ depth, svg, part }); }
  svg(w, h, bg) {
    for (const j of this.jobs) j();
    this.jobs = [];
    this.items.sort((a, b) => a.depth - b.depth);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') +
      `<defs>${this.defs.join('')}</defs>` + this.grouped() + '</svg>';
  }
  // the sorted pieces, the consecutive ones of one organ in one group (an organ split by another in depth gets two groups)
  grouped() {
    let out = '', cur = null, buf = '';
    const flush = () => { if (buf) out += cur ? `<g class="p-${cur}">${buf}</g>` : buf; buf = ''; };
    for (const it of this.items) {
      if (it.part !== cur) { flush(); cur = it.part; }
      buf += it.svg;
    }
    flush();
    return out;
  }
  // Light reaching point p (normal n) past the other pieces: cast shadow (0..1) and sky occlusion (0..1).
  light(p, n, self) {
    // measurement aid: INS_DBG=nolight renders without cast shadows and occlusion
    if (globalThis.process?.env?.INS_DBG === 'nolight') return { sh: 1, occ: 1 };
    const L = this.cam.L, p0 = add(p, mul(n, 0.03));
    let sh = 1, ao = 0;
    for (const s of this.occ) {
      if (s.id === self) continue;
      const v = sub(s.c, p0), d2 = dot(v, v), tp = dot(v, L);
      if (tp > 0) {
        const d = Math.sqrt(Math.max(0, d2 - tp * tp)), pen = 0.45 * s.r + 0.12 * tp;
        sh = Math.min(sh, 0.3 + 0.7 * smooth(s.r - pen, s.r + pen, d));
      }
      const dist = Math.sqrt(d2), ct = dot(n, v) / (dist || 1);
      if (ct > 0) ao += ct * Math.min(1, (s.r * s.r) / Math.max(1e-4, d2)) * s.w;
    }
    for (const w of this.wings) {
      const dn = dot(L, w.n);
      if (Math.abs(dn) < 1e-3) continue;
      const s = dot(sub(w.o, p0), w.n) / dn;
      if (s <= 0) continue;
      const q = sub(add(p0, mul(L, s)), w.o);
      const u = (dot(q, w.e1) - w.cx) / w.rx, v = (dot(q, w.e2) - w.cy) / w.ry;
      const r = Math.hypot(u, v);
      if (r < 1.1) sh *= 1 - w.shadow * (1 - smooth(0.85, 1.1, r));
    }
    return { sh, occ: 1 - clamp(ao * 0.55, 0, 0.72) };
  }
}

// Albedo of a body at (t, th): a measured grid (PROTOCOLE §3), a function, or the v1 bands; then a faint mottle.
function albedoOf(b, M, t, th) {
  let c;
  if (b.albedo) c = lin(b.albedo(t, th));
  else if (b.grid) c = gridAt(b.grid, t, th);
  else {
    let h = b.color;
    if (b.bands) {
      const fe = Math.max(0.004, b.feather || 0.006);
      for (const bd of b.bands) {
        const w = smooth(bd.t0 - fe, bd.t0 + fe, t) * (1 - smooth(bd.t1 - fe, bd.t1 + fe, t));
        if (w > 0.001) h = mix(h, bd.color, w);
      }
    }
    c = lin(h);
  }
  if (M.mottle) {
    const s = (b.seed || 1) * 1.7;
    const nz = 0.55 * Math.sin(t * 23 + s) * Math.sin(th * 4 + s * 0.7) + 0.3 * Math.sin(t * 57 + th * 6 + s * 2.1) + 0.15 * Math.sin(t * 131 - th * 11 + s);
    c = vs(c, 1 + M.mottle * nz);
  }
  return c;
}

// A grid of 18 x 72 measured colours: rows from the rear (v = 0) to the front, columns from the belly (u = 0) over the
// flank to the back (u = 1); both flanks share it (bilateral symmetry). Bilinear.
function gridAt(G, t, th) {
  const u = (Math.asin(clamp(Math.sin(th), -1, 1)) + Math.PI / 2) / Math.PI;
  const rows = G.rows, nv = rows.length, nu = rows[0].length;
  const y = clamp(t, 0, 1) * (nv - 1), x = u * (nu - 1);
  const y0 = Math.floor(y), x0 = Math.floor(x), y1 = Math.min(nv - 1, y0 + 1), x1 = Math.min(nu - 1, x0 + 1);
  const fy = y - y0, fx = x - x0;
  if (!G._lin) G._lin = rows.map((r) => r.map(lin));
  const L = G._lin;
  const a = vadd(vs(L[y0][x0], 1 - fx), vs(L[y0][x1], fx)), c = vadd(vs(L[y1][x0], 1 - fx), vs(L[y1][x1], fx));
  return vadd(vs(a, 1 - fy), vs(c, fy));
}

// One body: registered now as an occluder, painted when the scene is written.
export function drawBody(sc, b) {
  const id = ++sc.nbody;
  // Occluder: spheres along the axis, of the mean radius of the section.
  for (let i = 0; i < 9; i++) {
    const t = (i + 0.5) / 9, p = b.profile(t);
    const r = Math.sqrt(Math.max(0, p.ry * p.rz)) * 0.92;
    if (r < 0.04) continue;
    const F = b.frame;
    sc.occ.push({ id, r, w: 1 / 3, c: add(add(add(F.o, mul(F.ax, p.x)), mul(F.az, p.zc)), mul(F.ay, p.yc || 0)) });
  }
  const part = b.part ?? sc.part;
  sc.jobs.push(() => { const was = sc.part; sc.part = part; paintBody(sc, b, id); sc.part = was; });
}

function paintBody(sc, b, id) {
  const { cam } = sc;
  const M = material(b);
  // Mesh of quads of about 4 px (3.3 px at detail 1.5): the blur that follows the quad's size hides its edges, and finer quads
  // only weighed the SVG down (porteur 2026-10-23: « net et optimisé »; a leg weighed 1.3 MB at 1.1 px).
  let ext = 0, rmax = 0;
  for (let i = 0; i <= 10; i++) { const p = b.profile(i / 10); rmax = Math.max(rmax, p.ry, p.rz); }
  ext = Math.abs(b.profile(1).x - b.profile(0).x);
  const q = 4 / Math.sqrt(Math.max(0.6, sc.detail ?? 1));
  // (coccinelle) b.fine { max, blur, q }: a smooth varnished shell seen in close-up needs more than 150 quads a turn, a wider blur
  // and finer colour steps (its terraces showed at 160 px/mm); the defaults are the engine's
  const FN = b.fine || {};
  const nt = Math.round(clamp((ext * sc.k) / q, 8, FN.max ?? 150));
  const nthFull = Math.round(clamp((2 * Math.PI * rmax * sc.k) / q, 12, FN.max ?? 150));
  // the blur follows the real size of a quad, so facets never show in close-ups
  const qpx = Math.max((ext * sc.k) / nt, (2 * Math.PI * rmax * sc.k) / nthFull);
  const nth = b.th0 === undefined ? nthFull : Math.max(6, Math.round(nthFull * (b.th1 - b.th0) / (2 * Math.PI)));
  const g = sample(b, nt, nth);
  const all = [];
  g.P.forEach((row) => row.forEach((p) => all.push(sc.S(p))));
  const sil = smoothPath(resample(hull(all), 72));
  const depth = dot(b.depthAt || add(b.frame.o, mul(b.frame.ax, b.profile(0.5).x)), cam.c) + (b.bias || 0);
  const clip = sc.id('c');
  sc.defs.push(`<clipPath id="${clip}"><path d="${sil}"/></clipPath>`);
  let out = '';

  // Hairs that grow from the hidden side of the rim go behind the body.
  const hairs = b.hair ? makeHairs(sc, b, M, id) : { back: '', front: '' };
  out += hairs.back;

  // The mesh: quads from far to near, each shaded at its centre.
  const open = b.th0 !== undefined, wrapJ = open ? nth - 1 : nth;
  const quads = [];
  let rimC = [0, 0, 0], rimN = 0;
  for (let i = 0; i < nt; i++) for (let j = 0; j < wrapJ; j++) {
    const j1 = (j + 1) % nth;
    const P = [g.P[i][j], g.P[i + 1][j], g.P[i + 1][j1], g.P[i][j1]];
    let n = norm(add(add(g.N[i][j], g.N[i + 1][j]), add(g.N[i + 1][j1], g.N[i][j1])));
    let vis = dot(n, cam.c);
    let inner = false;
    if (vis < -0.02) { if (!open) continue; n = mul(n, -1); vis = -vis; inner = true; }
    const c3 = mul(add(add(P[0], P[1]), add(P[2], P[3])), 0.25);
    const t = (i + 0.5) / nt, th = thAt(b, j + 0.5, nth);
    let A = albedoOf(b, M, t, th);
    if (inner) A = b.inner ? lin(b.inner) : vs(A, 0.45);
    const Lt = sc.light(c3, n, id);
    const r = shadePoint(cam, M, A, n, Lt.sh, Lt.occ * (inner ? 0.6 : 1));
    const S2 = P.map((p) => sc.S(p));
    quads.push({ z: dot(c3, cam.c), S2, D: r.D, S: r.S });
    if (vis < 0.35) { rimC = vadd(rimC, r.D); rimN++; }
  }
  quads.sort((x, y) => x.z - y.z);
  const qd = (S2) => `M${fmt(S2[0][0])} ${fmt(S2[0][1])}L${fmt(S2[1][0])} ${fmt(S2[1][1])}L${fmt(S2[2][0])} ${fmt(S2[2][1])}L${fmt(S2[3][0])} ${fmt(S2[3][1])}Z`;
  // Under the blurred mesh, the outline filled with the rim colour: no see-through at the edge.
  const under = rimN ? hexl(vs(rimC, 1 / rimN)) : b.color;
  out += `<path d="${sil}" fill="${under}"/>`;
  const blur = sc.id('f'), sd = clamp(qpx * 0.5, 0.35, FN.blur ?? 3);
  sc.defs.push(`<filter id="${blur}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${fmt(sd)}"/></filter>`);
  out += `<g clip-path="url(#${clip})"><g filter="url(#${blur})">` + quadPaths(quads, (x) => hexl(x.D), null, FN.q) + '</g>';
  // Decals: spots and flecks laid on the surface (ladybird spots, chafer flecks), lit with the surface.
  if (b.decals) out += b.decals.map((d) => decal(sc, b, M, d, id)).join('');
  if (b.punct && sc.k * b.punct.r > 0.35) out += punctures(sc, b, M);
  // Marks drawn by the species (a seam, a stripe), under the specular layer.
  if (b.paint) out += b.paint(sc, b, g, id);
  // Specular layer over the albedo and the decals: highlight lobes and the reflected sky.
  const spec = quads.filter((x) => Math.max(...x.S) > 0.012);
  if (spec.length) {
    out += `<g filter="url(#${blur})">` + quadPaths(spec, (x) => { const a = clamp(Math.max(...x.S)); return hexl(vs(x.S, 1 / Math.max(a, 1e-3))); },
      (x) => Math.round(clamp(Math.max(...x.S)) * 20) / 20, FN.q) + '</g>';
  }
  // (coccinelle) marks drawn by the species over the specular layer, clipped by the outline: a crisp glint of the lamp
  if (b.over) out += b.over(sc, b, g, id);
  // Grazing sheen just inside the outline (the facets of an eye catch the sky at the rim).
  if (b.rim) out += `<path d="${sil}" fill="none" stroke="${b.rim.color}" stroke-width="${fmt(b.rim.w * sc.k)}" opacity="${fmt(b.rim.a * 0.6)}"/>`;
  // Facets of a compound eye, seen in close-up only.
  if (b.facets && sc.k * b.facets > 2.2) out += facets(sc, b, g, nt, nth);
  // Contact shadows where another piece meets this one (v1 hand-placed spots, kept lighter).
  if (b.ao) out += b.ao.map((o) => ao(sc, { ...o, a: o.a * 0.55 })).join('');
  out += '</g>';
  out += hairs.front;
  sc.push(depth, `<g>${out}</g>`);
}

// Quads written lean: in depth order, cut in three slices, and within a slice gathered by colour (quantised to steps of 6 per
// channel: under the blur no step shows) and opacity: one path per group, in relative steps of a tenth of a pixel.
function quadPaths(quads, colOf, opOf = null, step = 6) {
  const st = step ?? 6;
  const q6 = (h) => '#' + [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) / st) * st).toString(16).padStart(2, '0')).join('');
  const f1 = (v) => { const r = Math.round(v * 10) / 10; return (r === 0 ? '0' : r.toString()).replace(/^(-?)0\./, '$1.'); };
  const jn = (v) => v.map(f1).reduce((o, t, i) => o + (i && t[0] !== '-' ? ' ' : '') + t, '');
  const qd = (S) => `M${jn([S[0][0], S[0][1]])}l${jn([S[1][0] - S[0][0], S[1][1] - S[0][1], S[2][0] - S[1][0], S[2][1] - S[1][1], S[3][0] - S[2][0], S[3][1] - S[2][1]])}z`;
  const nS = 3, out = [];
  for (let k = 0; k < nS; k++) {
    const part = quads.slice(Math.floor((k * quads.length) / nS), Math.floor(((k + 1) * quads.length) / nS));
    const g = new Map();
    for (const x of part) {
      const key = q6(colOf(x)) + '|' + (opOf ? opOf(x) : 1);
      if (opOf && opOf(x) <= 0) continue;
      if (!g.has(key)) g.set(key, []);
      g.get(key).push(qd(x.S2));
    }
    for (const [key, ds] of g) {
      const [c, o] = key.split('|');
      out.push(`<path d="${ds.join('')}" fill="${c}" stroke="${c}" stroke-width=".6"${o === '1' ? '' : ` opacity="${o}"`}/>`);
    }
  }
  return out.join('');
}

// A small patch of the surface around (t, th): an ellipse of radii r (along t) and r2 (around), in millimetres.
function decal(sc, b, M, d, id) {
  const { cam } = sc;
  const p = surf(b, d.t, d.th), n = normalAt(b, d.t, d.th);
  const vis = dot(n, cam.c);
  if (vis < -0.05) return '';
  const e = 1e-3;
  const et = norm(sub(surf(b, clamp(d.t + e, 0, 1), d.th), surf(b, clamp(d.t - e, 0, 1), d.th)));
  const eh = norm(cross(n, et));
  const r1 = d.r, r2 = d.r2 ?? d.r, rot0 = d.rot || 0;
  const pts = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * 2 * Math.PI + rot0;
    const wob = 1 + (d.wobble || 0) * Math.sin(3 * a + (d.seed || 0)) + (d.wobble || 0) * 0.4 * Math.sin(5 * a + 2 * (d.seed || 0));
    // follow the curved surface: each outline point is put back on the body by its local normal
    const q = add(p, add(mul(et, Math.cos(a) * r1 * wob), mul(eh, Math.sin(a) * r2 * wob)));
    const s2 = sc.S(q); pts.push([s2[0], s2[1]]);
  }
  let col;
  if (d.lit === false) col = d.color;
  else { const Lt = sc.light(p, n, id); col = hexl(shadePoint(cam, { ...M, ks: 0, ks2: 0, env: 0, trans: null }, lin(d.color), n, Lt.sh, Lt.occ).D); }
  return `<path d="${smoothPath(pts)}" fill="${col}" opacity="${fmt((d.a ?? 1) * smooth(-0.05, 0.25, vis))}"/>`;
}

// Punctures: small pits scattered over the shell (b.punct = { n, r, color, a }), darker, each lit by its normal;
// a pit catches a tiny highlight on its far lip. Only where the face is seen well enough.
function punctures(sc, b, M) {
  const { cam } = sc, P = b.punct, R = rng((b.seed || 3) * 977 + 13);
  let s = '';
  const n = Math.round(P.n * Math.min(1, (sc.detail ?? 1)));
  for (let i = 0; i < n; i++) {
    const t = 0.03 + 0.94 * R(), th = b.th0 === undefined ? R() * 2 * Math.PI : b.th0 + R() * (b.th1 - b.th0);
    const nrm = normalAt(b, t, th), vis = dot(nrm, cam.c);
    if (vis < 0.3) continue;
    if (P.where && !P.where(t, th)) continue;
    const q = sc.S(surf(b, t, th)), r = P.r * sc.k * (0.6 + 0.8 * R());
    const rr = r * (0.45 + 0.55 * vis);
    const ang = Math.atan2(-dot(nrm, cam.u), dot(nrm, cam.r)) * 180 / Math.PI;
    s += `<ellipse cx="${fmt(q[0])}" cy="${fmt(q[1])}" rx="${fmt(rr)}" ry="${fmt(r)}" transform="rotate(${fmt(ang)} ${fmt(q[0])} ${fmt(q[1])})" fill="${P.color}" opacity="${fmt((P.a ?? 0.5) * vis)}"/>`;
    // the lip of the pit that faces the lamp glints (the sparkle of a punctate metal)
    if (P.glint) {
      const g = Math.pow(clamp(dot(nrm, cam.H)), 6) * (0.4 + 0.6 * R());
      if (g > 0.12) s += `<circle cx="${fmt(q[0] - dot(cam.L, cam.r) * r * 0.6)}" cy="${fmt(q[1] - r * 0.6)}" r="${fmt(r * 0.55)}" fill="${P.glint}" opacity="${fmt(Math.min(1, g * 1.3))}"/>`;
    }
  }
  return s;
}

function ao(sc, o) {
  const q = sc.S(o.p), r = o.r * sc.k, id = sc.id('o');
  sc.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="#120802" stop-opacity="${o.a}"/>` +
    `<stop offset="0.55" stop-color="#120802" stop-opacity="${fmt(o.a * 0.4)}"/><stop offset="1" stop-color="#120802" stop-opacity="0"/></radialGradient>`);
  return `<circle cx="${fmt(q[0])}" cy="${fmt(q[1])}" r="${fmt(r)}" fill="url(#${id})"/>`;
}

// Ommatidia: a lattice of small rings on the visible face of the eye, foreshortened by the surface.
function facets(sc, b, g, nt, nth) {
  const { cam } = sc;
  const R = rng((b.seed || 5) * 31 + 7);
  let s = '';
  const f = b.facets;
  let rmax = 0;
  for (let i = 0; i <= 10; i++) { const p = b.profile(i / 10); rmax = Math.max(rmax, p.ry, p.rz); }
  const ext = Math.abs(b.profile(1).x - b.profile(0).x);
  const nT = Math.round(ext / f), nH = Math.round((2 * Math.PI * rmax) / f);
  for (let i = 1; i < nT; i++) for (let j = 0; j < nH; j++) {
    const t = i / nT, th = ((j + (i % 2) * 0.5) / nH) * 2 * Math.PI;
    const n = normalAt(b, t, th), vis = dot(n, cam.c);
    if (vis < 0.25) continue;
    const p = sc.S(surf(b, t, th));
    const r = 0.5 * f * sc.k * (0.55 + 0.45 * vis);
    s += `<circle cx="${fmt(p[0])}" cy="${fmt(p[1])}" r="${fmt(r * 0.8)}" fill="none" stroke="#000" stroke-width="${fmt(r * 0.28)}" opacity="${fmt(0.05 * vis + 0.02 * R())}"/>`;
  }
  return s;
}

// Hairs: sampled on the surface (area weighted), leaning toward the rear, tapered from root to tip, lit as fibres
// (Kajiya-Kay: diffuse by the angle to the light, a sheen band along them), shadowed by the other pieces, and
// brighter where they catch the light at the silhouette. A short dense pile lies under the guard hairs.
function makeHairs(sc, b, M, id) {
  const { cam } = sc;
  const H = b.hair, R = rng((sc.seed * 7919 + (b.seed || 1)) >>> 0);
  const back = [], front = [];
  const rmax = Math.max(...Array.from({ length: 21 }, (_, i) => { const p = b.profile(i / 20); return Math.max(p.ry, p.rz); }));
  const ax = b.frame.ax;
  // hairs counted for the size on screen: a fur set for a close-up (k about 30 px/mm) is thinned in a small atlas cell, where
  // thousands of hairs under a pixel only weigh the SVG down; each kept hair is widened as much, so the fur keeps its cover
  const kk = clamp(sc.k / 30, 0.06, 1);
  const det = (sc.detail ?? 1) * kk;
  const layers = [{ n: Math.round(H.n * det), lk: 1, wk: 1, ak: 1, dk: 1 }];
  if (H.pile !== 0) layers.unshift({ n: Math.round(H.n * (H.pile ?? 0.7) * det), lk: H.pileLen ?? 0.42, wk: 1.1, ak: 0.9, dk: 0.8 });
  // fleece: wide, faint strands that blend into a soft pile, as plumose hairs do
  if (H.fleece !== 0) layers.unshift({ n: Math.round(H.n * (H.fleece ?? 0.8) * det), lk: 0.85, wk: 3, ak: 0.2, dk: 0.92 });
  const hcache = new Map();
  for (const ly of layers) {
    let made = 0, tries = 0;
    while (made < ly.n && tries < ly.n * 8) {
      tries++;
      const t = R(), th = b.th0 === undefined ? R() * 2 * Math.PI : b.th0 + R() * (b.th1 - b.th0);
      const pr = b.profile(t);
      if (R() > Math.max(pr.ry, pr.rz) / rmax) continue;
      const dens = H.density ? H.density(t, th) : 1;
      if (R() > dens) continue;
      made++;
      const p = surf(b, t, th), n = normalAt(b, t, th);
      const vis = dot(n, cam.c);
      if (vis < -0.22) continue;
      const rear = mul(ax, -1);
      const tan = norm(sub(rear, mul(n, dot(n, rear))));
      const lean = (H.lean ?? 0.6) * (ly.lk < 1 ? 1.25 : 1) + (R() - 0.5) * 0.5;
      let d = norm(add(mul(n, Math.cos(lean)), mul(tan, Math.sin(lean))));
      // locks: neighbouring hairs share a direction and a shade (a smooth field over the surface), as fur clumps
      const s1 = (b.seed || 1) * 0.37;
      const fa = Math.sin(t * 19 + s1) * Math.cos(th * 3 + s1 * 2) + 0.5 * Math.sin(t * 43 - th * 5 + s1 * 3);
      const fb = Math.sin(t * 31 + th * 4 + s1 * 5) * Math.cos(t * 13 - s1);
      d = rot(d, n, (H.twist ?? 0.9) * (0.7 * fa + 0.45 * (R() - 0.5)));
      const lock = 1 + (H.locks ?? 0.25) * fb;
      const L = H.len * ly.lk * (0.6 + 0.7 * R()) * (H.lenAt ? H.lenAt(t, th) : 1);
      // the hair bends back toward the body and droops a little
      const tip0 = add(p, mul(d, L));
      const curl = (H.curl ?? 0.25) * L;
      const tip = add(add(tip0, mul(n, -curl * 0.5)), mul([0, 0, -1], L * 0.1 * (H.droop ?? 1)));
      // waves: the middle of the hair pushed sideways (H.wave, fraction of its length)
      const side = norm(cross(d, n));
      const mid = add(add(add(p, mul(d, L * 0.55)), mul([0, 0, -1], L * 0.06 * (H.droop ?? 1))), mul(side, (H.wave ?? 0.08) * L * (R() - 0.5) * 2));
      const T = norm(sub(tip, p));
      // Light: the root's shadow and occlusion (cached per coarse cell), then the fibre terms.
      const key = Math.round(t * 24) * 100 + Math.round(((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * 6);
      let Lt = hcache.get(key);
      if (!Lt) { Lt = sc.light(p, n, id); hcache.set(key, Lt); }
      const sh = 0.35 + 0.65 * Lt.sh;
      const tl = dot(T, cam.L), th2 = dot(T, cam.H);
      const diff = 0.55 * clamp((dot(n, cam.L) + 0.5) / 1.5) + 0.45 * Math.sqrt(Math.max(0, 1 - tl * tl));
      const shn = Math.pow(Math.sqrt(Math.max(0, 1 - th2 * th2)), H.sheenP ?? 36) * (H.sheen ?? 0.22);
      // hairs of a measured body take their colour from its grid (the photo shows the hair), varied hair to hair
      const A = H.color === 'grid' && b.grid ? vs(gridAt(b.grid, t, th), ly.dk * lock * (0.75 + 0.5 * R()) * (H.gridK ?? 1.1)) : vs(lin(H.color(t, th, R)), ly.dk * lock);
      let C = vadd(vmul(A, vadd(vs(SUN, 0.95 * diff * sh), vs(SKY, 0.42 * Lt.occ))), vs(SUN, shn * sh));
      if (vis < 0.3) C = vadd(C, vs(A, 0.55 * (1 - Math.max(0, vis) / 0.3) * (0.4 + 0.6 * sh)));
      const col = hexl(C);
      const a = sc.S(p), m = sc.S(mid), z = sc.S(tip);
      let w = (H.w * sc.k * 1.5 * ly.wk) / kk;
      let op = (H.a ?? 0.85) * ly.ak;
      if (w < 0.45) { op *= Math.max(0.25, w / 0.45); w = 0.45; }
      const s = taper(a, m, z, w);
      if (!s) continue;
      (vis < 0.05 ? back : front).push({ z: a[2] + (ly.lk < 1 ? -0.001 : 0), d: s, col, op });
    }
  }
  return { back: hairPaths(back), front: hairPaths(front) };
}

// Hairs written lean (porteur 2026-10-23: « net et optimisé »): sorted by depth, cut in four depth slices, and within a slice
// gathered by colour (quantised to steps of 12 per channel) and opacity (steps of 0.1): one path per group, not one per hair.
function hairPaths(list) {
  if (!list.length) return '';
  list.sort((x, y) => x.z - y.z);
  const q = (h) => '#' + [1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) / 12) * 12).toString(16).padStart(2, '0')).join('');
  const nS = 4, out = [];
  for (let k = 0; k < nS; k++) {
    const part = list.slice(Math.floor((k * list.length) / nS), Math.floor(((k + 1) * list.length) / nS));
    const g = new Map();
    for (const h of part) {
      const key = q(h.col) + '|' + (Math.round(h.op * 10) / 10);
      if (!g.has(key)) g.set(key, []);
      g.get(key).push(h.d);
    }
    for (const [key, ds] of g) { const [c, o] = key.split('|'); out.push(`<path d="${ds.join('')}" fill="${c}"${o === '1' ? '' : ` opacity="${o}"`}/>`); }
  }
  return out.join('');
}

// A tapered stroke from a (root, width w) through the control point m to a sharp tip z, as a filled outline.
function taper(a, m, z, w) {
  const d0x = m[0] - a[0], d0y = m[1] - a[1], d1x = z[0] - m[0], d1y = z[1] - m[1];
  const l0 = Math.hypot(d0x, d0y), l1 = Math.hypot(d1x, d1y);
  if (l0 + l1 < 0.2) return '';
  const n0 = l0 > 1e-6 ? [-d0y / l0, d0x / l0] : [-d1y / l1, d1x / l1];
  const n1x = -(z[1] - a[1]), n1y = z[0] - a[0], l2 = Math.hypot(n1x, n1y) || 1;
  const nm = [n1x / l2, n1y / l2];
  const h0 = w / 2, hm = w * 0.3;
  // pixels to a tenth, the curve in relative steps from its start: about half the characters of absolute coordinates
  const f1 = (v) => { const r = Math.round(v * 10) / 10; return (r === 0 ? '0' : r.toString()).replace(/^(-?)0\./, '$1.'); };
  const sx = a[0] + n0[0] * h0, sy = a[1] + n0[1] * h0;
  const P = [m[0] + nm[0] * hm - sx, m[1] + nm[1] * hm - sy, z[0] - sx, z[1] - sy, m[0] - nm[0] * hm - sx, m[1] - nm[1] * hm - sy, a[0] - n0[0] * h0 - sx, a[1] - n0[1] * h0 - sy];
  const j = (v) => v.map(f1).reduce((o, t, i) => o + (i && t[0] !== '-' ? ' ' : '') + t, '');
  return `M${j([sx, sy])}q${j(P.slice(0, 4))}Q${j([P[4] + sx, P[5] + sy, P[6] + sx, P[7] + sy])}z`;
}

// ---------------------------------------------------------------------------------------------------------------
// Tubes: legs, antennae. A chain of points with radii, painted segment by segment as capsules, each with a gradient
// across its width computed from the normals around the tube (so the cuticle shows its lit side, its highlight and
// its dark edge), and the shadow of the body above it.
// ---------------------------------------------------------------------------------------------------------------
export function drawTube(sc, pts, radii, opt = {}) {
  const part = opt.part ?? sc.part;
  sc.jobs.push(() => { const was = sc.part; sc.part = part; paintTube(sc, pts, radii, opt); sc.part = was; });
}

const ACROSS = [-1, -0.75, -0.4, 0, 0.4, 0.75, 1];

function paintTube(sc, pts, radii, opt) {
  const { cam } = sc;
  const gl = opt.gloss ?? 0.15;
  const M = { wrap: 0.3, amb: 0.42, ks: opt.mat?.ks ?? 0.6 * gl, p: opt.mat?.p ?? 46, ks2: 0.12 * gl, p2: 6, env: opt.mat?.env ?? 0.4 * gl, metal: 0, trans: null, spec: lin(opt.glossColor ? mix(opt.glossColor, '#fff4e4', 0.6) : '#fff4e4') };
  for (let i = 0; i < pts.length - 1; i++) {
    const P0 = pts[i], P1 = pts[i + 1];
    const r0 = radii[i] * sc.k, r1 = radii[i + 1] * sc.k;
    const a = sc.S(P0), b = sc.S(P1);
    const d3 = norm(sub(P1, P0));
    const col0 = typeof opt.color === 'function' ? opt.color(i) : opt.color;
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy);
    const midP = mul(add(P0, P1), 0.5);
    let s = '';
    // the across direction in 3D that projects onto the screen normal of the segment
    let s3 = norm(cross(d3, cam.c));
    if (len(cross(d3, cam.c)) < 1e-4) s3 = cam.r;
    const nx0 = l > 1e-6 ? -dy / l : 1, ny0 = l > 1e-6 ? dx / l : 0;
    if (dot(s3, cam.r) * nx0 - dot(s3, cam.u) * ny0 < 0) s3 = mul(s3, -1);
    let f3 = norm(cross(s3, d3));
    if (dot(f3, cam.c) < 0) f3 = mul(f3, -1);
    const Lt = sc.light(midP, f3, -1);
    const A = lin(col0);
    const stops = ACROSS.map((u) => {
      const n = norm(add(mul(s3, u), mul(f3, Math.sqrt(Math.max(0, 1 - u * u)))));
      const r = shadePoint(cam, M, A, n, Lt.sh, Lt.occ);
      return { u, c: hexl(vadd(r.D, r.S)) };
    });
    if (l < 0.05) {
      s = `<circle cx="${fmt(a[0])}" cy="${fmt(a[1])}" r="${fmt(Math.max(r0, r1))}" fill="${stops[3].c}"/>`;
    } else {
      dx /= l; dy /= l;
      const nx = -dy, ny = dx;
      const rm = Math.max(0.2, (r0 + r1) / 2), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const gid = sc.id('t');
      sc.defs.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${fmt(mx - nx * rm)}" y1="${fmt(my - ny * rm)}" x2="${fmt(mx + nx * rm)}" y2="${fmt(my + ny * rm)}">` +
        stops.map((st) => `<stop offset="${fmt((st.u + 1) / 2)}" stop-color="${st.c}"/>`).join('') + '</linearGradient>');
      s = `<path d="M${fmt(a[0] + nx * r0)} ${fmt(a[1] + ny * r0)}L${fmt(b[0] + nx * r1)} ${fmt(b[1] + ny * r1)}` +
        `A${fmt(r1)} ${fmt(r1)} 0 0 0 ${fmt(b[0] - nx * r1)} ${fmt(b[1] - ny * r1)}L${fmt(a[0] - nx * r0)} ${fmt(a[1] - ny * r0)}` +
        `A${fmt(r0)} ${fmt(r0)} 0 0 0 ${fmt(a[0] + nx * r0)} ${fmt(a[1] + ny * r0)}Z" fill="url(#${gid})"/>`;
    }
    // Fringe hairs along the segment, tapered and lit like the body hairs.
    if (opt.hair && opt.hair[i]) {
      const H = opt.hair[i], R = rng(((opt.seed || 3) * 131 + i * 17 + sc.seed) >>> 0);
      for (let h = 0; h < H.n; h++) {
        const t = R();
        const p = add(P0, mul(sub(P1, P0), t));
        let side = norm(cross(d3, H.side || [0, 0, 1]));
        if (R() < (H.both ? 0.5 : 0)) side = mul(side, -1);
        const dir = norm(add(add(mul(side, 1), mul(d3, H.lean ?? 0.5)), [0, 0, (R() - 0.5) * 0.6]));
        const Lh = H.len * (0.6 + 0.6 * R());
        const root = add(p, mul(side, radii[i] * 0.6));
        const tip = add(add(p, mul(side, radii[i] * 0.8)), mul(dir, Lh));
        const mid = add(add(root, mul(dir, Lh * 0.5)), mul(d3, Lh * 0.12));
        const tl = dot(dir, cam.L);
        const diff = 0.4 + 0.6 * Math.sqrt(Math.max(0, 1 - tl * tl));
        const C = vmul(lin(H.color), vadd(vs(SUN, 0.9 * diff * (0.4 + 0.6 * Lt.sh)), vs(SKY, 0.4 * Lt.occ)));
        let w = Math.max(0, H.w * sc.k * 1.5), op = H.a ?? 0.8;
        if (w < 0.45) { op *= Math.max(0.25, w / 0.45); w = 0.45; }
        const tp = taper(sc.S(root), sc.S(mid), sc.S(tip), w);
        if (tp) s += `<path d="${tp}" fill="${hexl(C)}" opacity="${fmt(op)}"/>`;
      }
    }
    sc.push(dot(add(P0, P1), cam.c) / 2 + (opt.bias || 0), s);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Flat wings: drawn once in their own plane (s along the span, q across, mm), placed by an affine matrix.
// An orthographic view of a plane is exactly affine, so the same drawing serves every angle (and WebGL quads).
// The 3D point of the wing coordinates (s, q) is o + s e1 + q e2.
// ---------------------------------------------------------------------------------------------------------------
function wingBox(w) {
  if (w._box) return w._box;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  // a measured pattern gives its box (its outline is written in relative steps); a drawn outline is read for its points
  if (w.box) [x0, y0, x1, y1] = w.box;
  else {
    const v = (w.outline.match(/-?\d*\.?\d+/g) || []).map(Number);
    for (let i = 0; i + 1 < v.length; i += 2) { x0 = Math.min(x0, v[i]); x1 = Math.max(x1, v[i]); y0 = Math.min(y0, v[i + 1]); y1 = Math.max(y1, v[i + 1]); }
  }
  w._box = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, rx: (x1 - x0) / 2, ry: (y1 - y0) / 2 };
  return w._box;
}

export function drawWing(sc, w, o, e1, e2, opt = {}) {
  const { cam, k } = sc;
  const sk = opt.scale || 1;
  // as an occluder: an ellipse in the wing plane that shades what lies under it
  const bx = wingBox(w);
  sc.wings.push({ o, e1, e2, n: norm(cross(e1, e2)), cx: bx.cx * sk, cy: bx.cy * sk, rx: bx.rx * sk * 0.95, ry: bx.ry * sk * 0.9, shadow: (w.opaque ? 0.8 : (w.shadow ?? 0.22)) * (opt.alpha ?? 1) });
  // opt.scale: the same drawing for a larger or smaller wing of a related species
  const ks = k * sk;
  const a = ks * dot(e1, cam.r), b = -ks * dot(e1, cam.u), c = ks * dot(e2, cam.r), d = -ks * dot(e2, cam.u);
  const q = sc.S(o);
  const nw = norm(cross(e1, e2));
  const facing = Math.abs(dot(nw, cam.c));
  const glint = smooth(0.95, 1, Math.abs(dot(nw, cam.H)));
  const alpha = opt.alpha ?? 1;
  // a wing seen edge on is a line a tenth of a millimetre thick: not drawn (its squeezed filters and patterns made resvg fail)
  const facingDet = Math.abs(a * d - b * c) / (ks * ks);
  if (w.opaque && facingDet < 0.02) return;
  let s = `<g transform="matrix(${fmt4(a)} ${fmt4(b)} ${fmt4(c)} ${fmt4(d)} ${fmt(q[0])} ${fmt(q[1])})" opacity="${fmt(alpha)}">`;
  if (w.opaque) {
    // seen obliquely (under a third face on), the wing is drawn without its filters: resvg fails on filter regions squeezed flat
    s += paintedWing(sc, facingDet < 0.33 ? { ...w, soft: 0, grain: 0 } : w, nw, glint, opt) + '</g>';
    sc.push(dot(add(o, mul(e1, w.span * 0.5 * sk)), cam.c) + (opt.bias || 0), s);
    return;
  }
  // Membrane: smoked glass. Its tint, more opaque seen edge-on; the sky it reflects (Fresnel); thin-film colours.
  const mem = (w.membrane ?? 0.2) + 0.22 * Math.pow(1 - facing, 2);
  const gid = sc.id('w');
  sc.defs.push(`<linearGradient id="${gid}" x1="0" y1="0" x2="${w.span}" y2="0" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="${w.tint}" stop-opacity="${fmt(mem * 1.35)}"/><stop offset="0.6" stop-color="${w.tint}" stop-opacity="${fmt(mem)}"/>` +
    `<stop offset="1" stop-color="${w.tint}" stop-opacity="${fmt(mem * 0.8)}"/></linearGradient>`);
  s += `<path d="${w.outline}" fill="url(#${gid})"/>`;
  const fres = 0.05 + 0.5 * Math.pow(1 - facing, 4);
  const skyw = 0.5 + 0.5 * Math.abs(dot(nw, cam.u));
  s += `<path d="${w.outline}" fill="#eef2f6" opacity="${fmt(fres * skyw * 0.6)}"/>`;
  const irid = (w.irid ?? 0.08) * Math.pow(1 - facing, 1.2); // thin-film colours show at grazing angles
  if (irid > 0) {
    const iid = sc.id('i'), sh = dot(nw, cam.H) * 0.5;
    sc.defs.push(`<radialGradient id="${iid}" gradientUnits="userSpaceOnUse" cx="${fmt(bx.cx + bx.rx * sh)}" cy="${fmt(bx.cy - bx.ry * 0.2)}" r="${fmt(bx.rx * 1.1)}">` +
      `<stop offset="0" stop-color="#ffd27a" stop-opacity="0"/><stop offset="0.3" stop-color="#ff86d0" stop-opacity="${fmt(irid)}"/>` +
      `<stop offset="0.5" stop-color="#ffe07a" stop-opacity="${fmt(irid * 0.8)}"/><stop offset="0.68" stop-color="#7ef0c0" stop-opacity="${fmt(irid)}"/>` +
      `<stop offset="0.86" stop-color="#86b4ff" stop-opacity="${fmt(irid * 0.8)}"/><stop offset="1" stop-color="#c088ff" stop-opacity="0"/></radialGradient>`);
    s += `<path d="${w.outline}" fill="url(#${iid})"/>`;
  }
  if (glint > 0.01) s += `<path d="${w.outline}" fill="#fffdf6" opacity="${fmt(glint * 0.3)}"/>`;
  // Veins: the basal ones thicker (veinsBase), all darker seen edge-on.
  if (w.veinsBase) s += `<path d="${w.veinsBase}" stroke="${w.vein}" stroke-width="${fmt(w.vw * 1.8)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
  s += `<path d="${w.veins}" stroke="${w.vein}" stroke-width="${w.vw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${fmt(0.78 + 0.22 * (1 - facing))}"/>`;
  if (w.stigma) s += `<path d="${w.stigma}" fill="${w.vein}" opacity="0.9"/>`;
  s += `<path d="${w.outline}" stroke="${w.edge}" stroke-width="${w.ew}" fill="none" opacity="0.6"/>`;
  s += '</g>';
  const mid = add(o, mul(e1, w.span * 0.5 * sk));
  sc.push(dot(mid, cam.c) + (opt.bias || 0), s);
}

// Scaled wings (butterflies) and elytra: the upper side or the underside, painted in the wing plane, flat-lit.
// opt.side: +1 for a left wing, -1 for a right one (their frames mirror, so the upper side's normal flips).
export function wingFace(nw, cam, side) {
  const up = mul(nw, side > 0 ? -1 : 1);
  return dot(up, cam.c) >= 0;
}

function paintedWing(sc, w, nw, glint, opt) {
  const { cam } = sc;
  const upper = wingFace(nw, cam, opt.side ?? 1);
  const lam = clamp(0.45 + 0.55 * Math.abs(dot(nw, cam.L)));
  return wingSkin(sc, w, upper, lam, glint);
}

// The painted face of a scaled wing in its own plane (mm): ground colour, pattern, scales, light. Also used flat, face on and
// evenly lit, to compare with a spread specimen laid flat (outils/aile.py paire).
export function wingSkin(sc, w, upper, lam, glint) {
  const cid = sc.id('wc');
  sc.defs.push(`<clipPath id="${cid}"><path d="${w.outline}"/></clipPath>`);
  let s = `<path d="${w.outline}" fill="${upper ? w.base : (w.baseUnder || w.base)}"/>`;
  // the pattern (a string, or a function of the scene for patterns with their own gradients), softened a little
  // inside the outline as scales blur the edges of a band
  const pat = upper ? (w.paint || '') : (w.paintUnder || w.paint || '');
  const pstr = typeof pat === 'function' ? pat(sc, upper) : pat;
  let soft = '';
  // the filter region in the wing's own units (a bounding-box region was cut short by resvg on large patterns)
  const wb = wingBox(w), fr = `filterUnits="userSpaceOnUse" x="${fmt(wb.cx - wb.rx - 1)}" y="${fmt(wb.cy - wb.ry - 1)}" width="${fmt(2 * wb.rx + 2)}" height="${fmt(2 * wb.ry + 2)}"`;
  // w.serrate [frequency per mm, displacement mm]: the edges of a pattern serrated at the scale of the scales (a band edge is a
  // row of scale tips, not a line), before the light blur
  if (w.soft || w.serrate) {
    soft = sc.id('ps');
    const sr = w.serrate && sc.k * w.serrate[1] > 0.6
      ? `<feTurbulence type="fractalNoise" baseFrequency="${fmt(w.serrate[0])}" numOctaves="1" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${fmt4(w.serrate[1])}" xChannelSelector="R" yChannelSelector="G" result="d"/>` : '';
    sc.defs.push(`<filter id="${soft}" ${fr} primitiveUnits="userSpaceOnUse">${sr}<feGaussianBlur ${sr ? 'in="d" ' : ''}stdDeviation="${fmt4(w.soft || 0.001)}"/></filter>`);
  }
  s += `<g clip-path="url(#${cid})">` + (soft ? `<g filter="url(#${soft})">${pstr}</g>` : pstr);
  // Scales: the velvet of a scaled wing, a fine light-and-dark texture measured in the wing's millimetres (so it
  // foreshortens with the wing). A material texture (§12.5), not an image grain.
  // Scale rows (w.scales): the rows of scales cross the veins, as arcs around the point the veins radiate from, one every
  // `period` mm (measured on the specimen by the spectrum of a flat patch: 0.09 mm on the swallowtail). Each row a darker band
  // (its shaded tip over the next row) and a lit band, in tones of the wing (not black: a darkening keeps the hue).
  const SC = upper ? w.scales : (w.scalesUnder ?? w.scales);
  if (SC && sc.k * SC.period > 1.4) {
    const S = SC, [cx, cy] = S.centre, P = S.period, R = rng(S.seed ?? 5);
    // only the radii that cross the wing (arcs far past the outline made resvg lose the soft layer under them)
    const wb = wingBox(w);
    let r1 = 0;
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) r1 = Math.max(r1, Math.hypot(wb.cx + x * wb.rx - cx, wb.cy + y * wb.ry - cy));
    // partial arcs over the wing's angular range only (full circles made resvg drop the layers under them)
    // whole circles, as two half arcs (only the radii that cross the wing are drawn)
    const f2 = (x) => (Math.round(x * 100) / 100).toString();
    const arc = (r) => `M${f2(cx + r)} ${f2(cy)}A${f2(r)} ${f2(r)} 0 0 1 ${f2(cx - r)} ${f2(cy)}A${f2(r)} ${f2(r)} 0 0 1 ${f2(cx + r)} ${f2(cy)}`;
    let r0 = 1e9;
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 0]]) r0 = Math.min(r0, Math.hypot(wb.cx + x * wb.rx - cx, wb.cy + y * wb.ry - cy));
    const inside = cx > wb.cx - wb.rx && cx < wb.cx + wb.rx && cy > wb.cy - wb.ry && cy < wb.cy + wb.ry;
    let dk = '', lt = '';
    for (let r = inside ? (S.r0 ?? 0.5) : Math.max(0.5, r0 - 1); r < r1; r += P * (0.94 + 0.12 * R())) { dk += arc(r); lt += arc(r + P * 0.5); }
    s += `</g><g clip-path="url(#${cid})"><path d="${dk}" stroke="${S.dark}" stroke-width="${fmt4(P * (S.w ?? 0.4))}" fill="none" opacity="${fmt(S.k ?? 0.2)}"/>`;
    s += `<path d="${lt}" stroke="${S.light ?? '#fff'}" stroke-width="${fmt4(P * (S.w ?? 0.4) * 0.8)}" fill="none" opacity="${fmt((S.k ?? 0.2) * (S.kl ?? 0.6))}"/>`;
  }
  const gr = w.grain ?? 0.2;
  if (gr > 0 && sc.k * (w.span || 10) > 40) {
    const fid = sc.id('sg');
    const f = w.grainF ?? 2.4;
    sc.defs.push(`<filter id="${fid}" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">` +
      `<feTurbulence type="fractalNoise" baseFrequency="${fmt(f)} ${fmt(f * 0.45)}" numOctaves="2" seed="${(w.span * 10) | 0}"/>` +
      `<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.25"/></filter>`);
    s += `<path d="${w.outline}" fill="#000" filter="url(#${fid})" opacity="${fmt(gr)}"/>`;
    sc.defs.push(`<filter id="${fid}b" x="0" y="0" width="1" height="1" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">` +
      `<feTurbulence type="fractalNoise" baseFrequency="${fmt(f * 1.3)} ${fmt(f * 0.6)}" numOctaves="2" seed="${((w.span * 10) | 0) + 7}"/>` +
      `<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.95  0 0 0 -2.4 1.3"/></filter>`);
    s += `<path d="${w.outline}" fill="#fff" filter="url(#${fid}b)" opacity="${fmt(gr * 0.7)}"/>`;
  }
  s += `<path d="${w.outline}" fill="#120a02" opacity="${fmt((1 - lam) * 0.55)}"/>`;
  // drawn over the light and the scales, under no filter: the long hairs of the wing's base (motif top)
  const top = upper ? w.top : (w.topUnder ?? null);
  if (top) s += typeof top === 'function' ? top(sc, upper) : top;
  if (glint > 0.01 && w.sheen) s += `<path d="${w.outline}" fill="${w.sheen}" opacity="${fmt(glint * 0.25)}"/>`;
  s += '</g>';
  // drawn veins, per face (a measured pattern carries its own: veins: null, veinsUnder for the face still drawn by hand)
  const vv = upper ? w.veins : (w.veinsUnder ?? w.veins);
  if (vv) s += `<path d="${vv}" stroke="${upper ? w.vein : (w.veinUnder || w.vein)}" stroke-width="${w.vw}" fill="none" stroke-linecap="round" opacity="${upper ? 0.5 : 0.65}"/>`;
  if (w.fringe) s += `<path d="${w.outline}" stroke="${w.fringe}" stroke-width="${w.fw || 0.12}" fill="none" opacity="0.9"/>`;
  return s;
}

const fmt4 = (x) => (Math.round(x * 10000) / 10000).toString();

export { openPath };
// (coccinelle) the light of the engine for marks a species draws itself (measured spots shaded like the surface they lie on)
export { shadePoint, lin as toLinear, hexl as fromLinear, gridAt, material };
