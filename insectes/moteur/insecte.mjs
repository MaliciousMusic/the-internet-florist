// Insect engine: an insect is a set of 3D pieces (bodies of elliptic sections, tubes, flat wings) that this module
// projects for one camera of the view sphere and paints as SVG. The SVG is the source; atlases are compiled from it.
import {
  add, sub, mul, dot, cross, norm, len, lerp, clamp, smooth, rot,
  rng, hull, resample, smoothPath, openPath, fmt, mix, scale,
} from './geo.mjs';

// ---------------------------------------------------------------------------------------------------------------
// Bodies: a generalised cylinder along a local axis. profile(t) gives, for t in [0, 1] (rear to front), the position
// along the axis x, the vertical offset zc and the two radii ry, rz of the elliptic section. shape(th) may bend the
// section (a head wider at the top, a flat belly). frame = { o, ax, ay, az } places the body in the model.
// ---------------------------------------------------------------------------------------------------------------

function surf(b, t, th) {
  const p = b.profile(t);
  const s = b.shape ? b.shape(th, t) : [1, 1];
  const ly = (p.yc || 0) + p.ry * Math.cos(th) * s[0];
  const lz = p.zc + p.rz * Math.sin(th) * s[1];
  const F = b.frame;
  return add(add(add(F.o, mul(F.ax, p.x)), mul(F.ay, ly)), mul(F.az, lz));
}

function sample(b, nt = 44, nth = 40) {
  const P = [], N = [];
  for (let i = 0; i <= nt; i++) {
    const t = i / nt, row = [], nrow = [];
    for (let j = 0; j < nth; j++) row.push(surf(b, t, (j / nth) * 2 * Math.PI));
    P.push(row);
  }
  for (let i = 0; i <= nt; i++) {
    const nrow = [];
    for (let j = 0; j < nth; j++) nrow.push(normalAt(b, i / nt, (j / nth) * 2 * Math.PI));
    N.push(nrow);
  }
  return { P, N, nt, nth };
}

function normalAt(b, t, th) {
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

// Light response of a surface normal: wrapped Lambert, between the shade colour and the lit colour.
function lit(col, n, cam, amb = 0.32) {
  const l = clamp(amb + (1 - amb) * dot(n, cam.L));
  return mix(scale(col, 0.42), col, l);
}

export class Scene {
  constructor(cam, k, cx, cy, seed = 1) {
    this.cam = cam; this.k = k; this.cx = cx; this.cy = cy; this.items = []; this.defs = []; this.uid = 0; this.seed = seed;
  }
  S(p) { const q = this.cam.proj(p); return [this.cx + q[0] * this.k, this.cy - q[1] * this.k, q[2]]; }
  id(p) { return `${p}${this.uid++}`; }
  push(depth, svg) { this.items.push({ depth, svg }); }
  svg(w, h, bg) {
    this.items.sort((a, b) => a.depth - b.depth);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') +
      `<defs>${this.defs.join('')}</defs>` + this.items.map((i) => i.svg).join('') + '</svg>';
  }
}

// One body: base colour, bands along t, shading, gloss spot and hairs.
export function drawBody(sc, b) {
  const { cam } = sc;
  const g = sample(b);
  const all = [];
  g.P.forEach((row) => row.forEach((p) => all.push(sc.S(p))));
  const sil = smoothPath(resample(hull(all), 72));
  const center = sc.S(surf(b, 0.5, 0));
  const depth = dot(b.depthAt || add(b.frame.o, mul(b.frame.ax, b.profile(0.5).x)), cam.c) + (b.bias || 0);
  const clip = sc.id('c');
  sc.defs.push(`<clipPath id="${clip}"><path d="${sil}"/></clipPath>`);
  let out = '';

  // Hairs that grow from the hidden side of the rim go behind the body.
  const hairs = b.hair ? makeHairs(sc, b, g) : { back: '', front: '' };
  out += hairs.back;

  // Albedo: base fill, then the bands painted from far to near.
  out += `<path d="${sil}" fill="${b.color}"/>`;
  if (b.bands) {
    const bands = b.bands.map((bd) => {
      const i0 = Math.round(bd.t0 * g.nt), i1 = Math.round(bd.t1 * g.nt);
      const pts = [];
      for (let i = i0; i <= i1; i++) g.P[i].forEach((p) => pts.push(sc.S(p)));
      const mid = g.P[Math.round((i0 + i1) / 2)];
      const dz = mid.reduce((s, p) => s + dot(p, cam.c), 0) / mid.length;
      return { d: smoothPath(resample(hull(pts), 56)), col: bd.color, dz };
    }).sort((a, b2) => a.dz - b2.dz);
    out += `<g clip-path="url(#${clip})">` + bands.map((x) => `<path d="${x.d}" fill="${x.col}" stroke="${x.col}" stroke-width="0.4"/>`).join('') + '</g>';
  }
  if (b.paint) out += `<g clip-path="url(#${clip})">${b.paint(sc, b, g)}</g>`;

  // Shading: a radial gradient fitted to the outline, its focus on the lit point.
  out += shade(sc, b, g, all, sil, clip);

  // Contact shadows where another piece meets this one.
  if (b.ao) out += `<g clip-path="url(#${clip})">` + b.ao.map((o) => ao(sc, o)).join('') + '</g>';
  // Gloss spot where the surface mirrors the light.
  if (b.gloss) out += gloss(sc, b, g);
  out += hairs.front;
  sc.push(depth, `<g>${out}</g>`);
}

function shade(sc, b, g, all, sil, clip) {
  const { cam } = sc;
  // Ellipse fit of the projected points (principal axes).
  let mx = 0, my = 0;
  all.forEach((p) => { mx += p[0]; my += p[1]; });
  mx /= all.length; my /= all.length;
  let sxx = 0, syy = 0, sxy = 0;
  all.forEach((p) => { const dx = p[0] - mx, dy = p[1] - my; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; });
  sxx /= all.length; syy /= all.length; sxy /= all.length;
  const tr = sxx + syy, det = sxx * syy - sxy * sxy, disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
  const l1 = tr / 2 + disc, l2 = Math.max(1e-6, tr / 2 - disc);
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const a1 = Math.sqrt(l1) * 1.9, a2 = Math.sqrt(l2) * 1.9;
  // Lit point: the visible sample that faces the light the most.
  let best = -2, hp = [mx, my];
  for (let i = 0; i <= g.nt; i++) for (let j = 0; j < g.nth; j++) {
    const n = g.N[i][j];
    if (dot(n, cam.c) < 0.05) continue;
    const v = dot(n, cam.L);
    if (v > best) { best = v; hp = sc.S(g.P[i][j]); }
  }
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const dx = hp[0] - mx, dy = hp[1] - my;
  const fx = clamp((dx * ca + dy * sa) / a1, -0.75, 0.75), fy = clamp((-dx * sa + dy * ca) / a2, -0.75, 0.75);
  const id = sc.id('g');
  const s = b.shade || {};
  const hl = s.hl ?? 0.16, dk = s.dark ?? 0.62;
  sc.defs.push(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" fx="${fmt(fx)}" fy="${fmt(fy)}" ` +
    `gradientTransform="matrix(${fmt(a1 * ca)} ${fmt(a1 * sa)} ${fmt(-a2 * sa)} ${fmt(a2 * ca)} ${fmt(mx)} ${fmt(my)})">` +
    `<stop offset="0" stop-color="#fff8e8" stop-opacity="${hl}"/><stop offset="0.28" stop-color="#fff8e8" stop-opacity="0"/>` +
    `<stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="0.86" stop-color="#140a02" stop-opacity="${fmt(dk * 0.55)}"/>` +
    `<stop offset="1" stop-color="#140a02" stop-opacity="${dk}"/></radialGradient>`);
  return `<path d="${sil}" fill="url(#${id})"/>`;
}

function ao(sc, o) {
  const q = sc.S(o.p), r = o.r * sc.k, id = sc.id('o');
  sc.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="#120802" stop-opacity="${o.a}"/>` +
    `<stop offset="0.55" stop-color="#120802" stop-opacity="${fmt(o.a * 0.4)}"/><stop offset="1" stop-color="#120802" stop-opacity="0"/></radialGradient>`);
  return `<circle cx="${fmt(q[0])}" cy="${fmt(q[1])}" r="${fmt(r)}" fill="url(#${id})"/>`;
}

function gloss(sc, b, g) {
  const { cam } = sc;
  let best = -2, bp = null, bn = null;
  for (let i = 0; i <= g.nt; i++) for (let j = 0; j < g.nth; j++) {
    const n = g.N[i][j];
    if (dot(n, cam.c) < 0.1) continue;
    const v = dot(n, cam.H);
    if (v > best) { best = v; bp = g.P[i][j]; bn = n; }
  }
  if (!bp || best < 0.8) return '';
  const q = sc.S(bp), gl = b.gloss;
  const r = gl.size * sc.k;
  const a = gl.a * smooth(0.8, 0.97, best);
  // Foreshortened along the projected normal.
  const pn = [dot(bn, cam.r), -dot(bn, cam.u)];
  const ang = Math.atan2(pn[1], pn[0]) * 180 / Math.PI;
  const squash = 0.35 + 0.65 * dot(bn, cam.c);
  const id = sc.id('s');
  sc.defs.push(`<radialGradient id="${id}"><stop offset="0" stop-color="${gl.color || '#fffaf0'}" stop-opacity="${fmt(a)}"/>` +
    `<stop offset="0.35" stop-color="${gl.color || '#fffaf0'}" stop-opacity="${fmt(a * 0.45)}"/><stop offset="1" stop-color="${gl.color || '#fffaf0'}" stop-opacity="0"/></radialGradient>`);
  return `<ellipse cx="${fmt(q[0])}" cy="${fmt(q[1])}" rx="${fmt(r * squash)}" ry="${fmt(r)}" transform="rotate(${fmt(ang)} ${fmt(q[0])} ${fmt(q[1])})" fill="url(#${id})"/>`;
}

// Hairs: sampled on the surface (area weighted), leaning toward the rear, lit by their root normal.
function makeHairs(sc, b, g) {
  const { cam } = sc;
  const H = b.hair, R = rng((sc.seed * 7919 + (b.seed || 1)) >>> 0);
  const back = [], front = [];
  const rmax = Math.max(...Array.from({ length: 21 }, (_, i) => { const p = b.profile(i / 20); return Math.max(p.ry, p.rz); }));
  const ax = b.frame.ax;
  let made = 0, tries = 0;
  const count = Math.round(H.n * (sc.detail ?? 1));
  while (made < count && tries < count * 8) {
    tries++;
    const t = R(), th = R() * 2 * Math.PI;
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
    const lean = (H.lean ?? 0.6) + (R() - 0.5) * 0.5;
    let d = norm(add(mul(n, Math.cos(lean)), mul(tan, Math.sin(lean))));
    d = rot(d, n, (R() - 0.5) * (H.twist ?? 0.9));
    const L = H.len * (0.6 + 0.7 * R()) * (H.lenAt ? H.lenAt(t, th) : 1);
    const tip = add(p, mul(d, L));
    const mid = add(add(p, mul(d, L * 0.55)), mul([0, 0, -1], L * 0.12 * (H.droop ?? 1)));
    const col0 = H.color(t, th, R);
    const col = lit(col0, norm(add(n, mul(d, 0.4))), cam, 0.38);
    const a = sc.S(p), m = sc.S(mid), z = sc.S(tip);
    const w = Math.max(0.28, H.w * sc.k);
    const op = (H.a ?? 0.85) * (vis < 0.05 ? 0.9 : 1);
    const s = `<path d="M${fmt(a[0])} ${fmt(a[1])}Q${fmt(m[0])} ${fmt(m[1])} ${fmt(z[0])} ${fmt(z[1])}" stroke="${col}" stroke-width="${fmt(w)}" stroke-linecap="round" fill="none" opacity="${fmt(op)}"/>`;
    (vis < 0.05 ? back : front).push({ z: a[2], s });
  }
  back.sort((x, y) => x.z - y.z); front.sort((x, y) => x.z - y.z);
  return { back: back.map((h) => h.s).join(''), front: front.map((h) => h.s).join('') };
}

// ---------------------------------------------------------------------------------------------------------------
// Tubes: legs, antennae. A chain of points with radii, painted segment by segment as lit capsules.
// ---------------------------------------------------------------------------------------------------------------
export function drawTube(sc, pts, radii, opt = {}) {
  const { cam } = sc;
  for (let i = 0; i < pts.length - 1; i++) {
    const P0 = pts[i], P1 = pts[i + 1];
    const r0 = radii[i] * sc.k, r1 = radii[i + 1] * sc.k;
    const a = sc.S(P0), b = sc.S(P1);
    const d3 = norm(sub(P1, P0));
    const col0 = typeof opt.color === 'function' ? opt.color(i) : opt.color;
    const bright = clamp(0.3 + 0.75 * Math.sqrt(Math.max(0, 1 - dot(d3, cam.L) ** 2)) * clamp(0.4 + dot(norm(sub(cam.L, mul(d3, dot(d3, cam.L)))), cam.c) * 0.6 + 0.4));
    const col = mix(scale(col0, 0.45), col0, bright);
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy);
    let s = '';
    if (l < 0.05) {
      s = `<circle cx="${fmt(a[0])}" cy="${fmt(a[1])}" r="${fmt(Math.max(r0, r1))}" fill="${col}"/>`;
    } else {
      dx /= l; dy /= l;
      const nx = -dy, ny = dx;
      s = `<path d="M${fmt(a[0] + nx * r0)} ${fmt(a[1] + ny * r0)}L${fmt(b[0] + nx * r1)} ${fmt(b[1] + ny * r1)}` +
        `A${fmt(r1)} ${fmt(r1)} 0 0 0 ${fmt(b[0] - nx * r1)} ${fmt(b[1] - ny * r1)}L${fmt(a[0] - nx * r0)} ${fmt(a[1] - ny * r0)}` +
        `A${fmt(r0)} ${fmt(r0)} 0 0 0 ${fmt(a[0] + nx * r0)} ${fmt(a[1] + ny * r0)}Z" fill="${col}"/>`;
    }
    // Fringe hairs along the segment.
    if (opt.hair && opt.hair[i]) {
      const H = opt.hair[i], R = rng(((opt.seed || 3) * 131 + i * 17 + sc.seed) >>> 0);
      for (let h = 0; h < H.n; h++) {
        const t = R();
        const p = add(P0, mul(sub(P1, P0), t));
        let side = norm(cross(d3, H.side || [0, 0, 1]));
        if (R() < (H.both ? 0.5 : 0)) side = mul(side, -1);
        const dir = norm(add(add(mul(side, 1), mul(d3, H.lean ?? 0.5)), [0, 0, (R() - 0.5) * 0.6]));
        const tip = add(add(p, mul(side, radii[i] * 0.8)), mul(dir, H.len * (0.6 + 0.6 * R())));
        const q0 = sc.S(add(p, mul(side, radii[i] * 0.6))), q1 = sc.S(tip);
        s += `<path d="M${fmt(q0[0])} ${fmt(q0[1])}L${fmt(q1[0])} ${fmt(q1[1])}" stroke="${lit(H.color, side, cam, 0.45)}" stroke-width="${fmt(Math.max(0.25, H.w * sc.k))}" stroke-linecap="round" opacity="${H.a ?? 0.8}"/>`;
      }
    }
    sc.push(dot(add(P0, P1), cam.c) / 2 + (opt.bias || 0), s);
  }
  // One continuous highlight along the side of the chain that faces the light.
  if (opt.gloss) {
    const hp = [];
    let dsum = 0, op = 0;
    for (let i = 0; i < pts.length; i++) {
      const d3 = norm(sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]));
      const nl = norm(sub(cam.L, mul(d3, dot(d3, cam.L))));
      const q = sc.S(add(pts[i], mul(nl, radii[i] * 0.55)));
      hp.push([q[0], q[1]]);
      dsum += dot(pts[i], cam.c); op += clamp(dot(nl, cam.c) + 0.3);
    }
    const hw = Math.max(0.3, Math.min(...radii) * sc.k * 0.5);
    sc.push(dsum / pts.length + (opt.bias || 0) + 0.3, `<path d="${openPath(hp)}" stroke="${opt.glossColor || '#e8c9a0'}" stroke-width="${fmt(hw)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${fmt(opt.gloss * op / pts.length)}"/>`);
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Flat wings: drawn once in their own plane (s along the span, q across, mm), placed by an affine matrix.
// An orthographic view of a plane is exactly affine, so the same drawing serves every angle (and WebGL quads).
// ---------------------------------------------------------------------------------------------------------------
export function drawWing(sc, w, o, e1, e2, opt = {}) {
  const { cam, k } = sc;
  const a = k * dot(e1, cam.r), b = -k * dot(e1, cam.u), c = k * dot(e2, cam.r), d = -k * dot(e2, cam.u);
  const q = sc.S(o);
  const nw = norm(cross(e1, e2));
  const facing = Math.abs(dot(nw, cam.c));
  const glint = smooth(0.95, 1, Math.abs(dot(nw, cam.H)));
  const alpha = opt.alpha ?? 1;
  const mem = (w.membrane ?? 0.2) + 0.22 * Math.pow(1 - facing, 2);
  const gid = sc.id('w');
  sc.defs.push(`<linearGradient id="${gid}" x1="0" y1="0" x2="${w.span}" y2="0" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="${w.tint}" stop-opacity="${fmt(mem * 1.25)}"/><stop offset="0.6" stop-color="${w.tint}" stop-opacity="${fmt(mem)}"/>` +
    `<stop offset="1" stop-color="${w.tint}" stop-opacity="${fmt(mem * 0.8)}"/></linearGradient>`);
  let s = `<g transform="matrix(${fmt4(a)} ${fmt4(b)} ${fmt4(c)} ${fmt4(d)} ${fmt(q[0])} ${fmt(q[1])})" opacity="${fmt(alpha)}">`;
  s += `<path d="${w.outline}" fill="url(#${gid})"/>`;
  if (glint > 0.01) s += `<path d="${w.outline}" fill="#fffdf6" opacity="${fmt(glint * 0.12)}"/>`;
  s += `<path d="${w.veins}" stroke="${w.vein}" stroke-width="${w.vw}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${fmt(0.75 + 0.25 * (1 - facing))}"/>`;
  s += `<path d="${w.outline}" stroke="${w.edge}" stroke-width="${w.ew}" fill="none" opacity="0.7"/>`;
  s += '</g>';
  const mid = add(o, mul(e1, w.span * 0.5));
  sc.push(dot(mid, cam.c) + (opt.bias || 0), s);
}

const fmt4 = (x) => (Math.round(x * 10000) / 10000).toString();

export { openPath };
