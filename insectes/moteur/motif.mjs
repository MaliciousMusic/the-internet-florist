// Wing patterns measured on spread specimens (outils/aile.py plat, porteur 2026-10-23: « contours extraits »), drawn as a lean
// SVG (porteur, same day: « net et optimisé », not thousands of pieces): each zone one smooth path with its measured gradient;
// the scattered scales of one zone over another as a few density levels, each filled with a small seamless tile of grains;
// the fringe as a handful of stroked paths. Nothing of the photograph is kept: contours, colours and counts only.
import { readFileSync } from 'node:fs';
import { rng } from './geo.mjs';

export const loadMotif = (url) => JSON.parse(readFileSync(url, 'utf8'));

// sRGB hex <-> CIE Lab (D65), to apply a calibration measured in Lab
function hex2lab(h) {
  const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((u) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)));
  const X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047, Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2], Z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
export function lab2hex(L, a, b) {
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const f = (t) => (t > 6 / 29 ? t * t * t : 3 * (6 / 29) ** 2 * (t - 4 / 29));
  const X = 0.95047 * f(fx), Y = f(fy), Z = 1.08883 * f(fz);
  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, bb = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  const gam = (u) => Math.round(255 * Math.min(1, Math.max(0, u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055)));
  return '#' + [r, g, bb].map((u) => gam(u).toString(16).padStart(2, '0')).join('');
}
const shift = (h, d) => { if (!d) return h; const l = hex2lab(h); return lab2hex(l[0] + d[0], l[1] + d[1], l[2] + d[2]); };

const f2 = (x) => (Math.round(x * 100) / 100).toString();
const f3 = (x) => (Math.round(x * 1000) / 1000).toString();

// Numbers as short as they can be written: two decimals, no leading zero, the sign as separator.
const nm = (x) => { const v = Math.round(x * 100) / 100; return (v === 0 ? '0' : v.toString()).replace(/^(-?)0\./, '$1.'); };
const pair = (a, b) => { const A = nm(a), B = nm(b); return A + (B[0] === '-' ? '' : ' ') + B; };
const join = (v) => v.reduce((s, x, i) => { const t = nm(x); return s + (i && t[0] !== '-' ? ' ' : '') + t; }, '');

// A closed polygon as a smooth closed curve (Catmull-Rom through its points), written as relative cubic Béziers.
function smooth(P, k) {
  const n = P.length, p = (i) => P[(i + n) % n].map((v) => v * k);
  let [x, y] = p(0), d = `M${pair(x, y)}c`;
  const segs = [];
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    // relative to the current point, rounded the way it is written so that the error does not add up
    const v = [c1[0] - x, c1[1] - y, c2[0] - x, c2[1] - y, p2[0] - x, p2[1] - y].map((u) => Math.round(u * 100) / 100);
    segs.push(join(v)); x += v[4]; y += v[5];
  }
  return d + segs.join(' ').replace(/ -/g, '-') + 'z';
}
const smoothAll = (polys, k) => polys.map((P) => smooth(P, k)).join('');

// A seamless tile of grains for one dust group: n grains on a torus of side T, spread evenly (random throw, relaxation with
// wrap-around), then ordered farthest-first, so that the first m grains of the list are themselves evenly spread: the density
// levels of the group share one tile, each taking the first grains (nested subsets). Each grain an oval of axes maj x mnr (a
// short round-capped stroke) turned about `ang` degrees; grains near an edge are drawn again across it (no cut grains).
// Returns the strokes of the grains in rank order, one string per grain.
function grainTile(n, T, maj, mnr, ang, seed) {
  const R = rng(seed), P = [];
  for (let i = 0; i < n; i++) P.push([R() * T, R() * T]);
  const wrap = (dx) => dx - T * Math.round(dx / T);
  const sp = T / Math.sqrt(Math.max(1, n));
  for (let it = 0; it < 6; it++) {
    const mv = P.map(() => [0, 0]);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = wrap(P[i][0] - P[j][0]), dy = wrap(P[i][1] - P[j][1]), d = Math.hypot(dx, dy);
      if (d > 0 && d < sp) { const f = ((sp - d) / d) * 0.25; mv[i][0] += dx * f; mv[i][1] += dy * f; }
    }
    P.forEach((p, i) => { p[0] = (((p[0] + mv[i][0]) % T) + T) % T; p[1] = (((p[1] + mv[i][1]) % T) + T) % T; });
  }
  // farthest-first order
  const order = [0], dmin = P.map((p) => Math.hypot(wrap(p[0] - P[0][0]), wrap(p[1] - P[0][1])));
  while (order.length < n) {
    let bi = -1, bd = -1;
    for (let i = 0; i < n; i++) if (dmin[i] > bd && !order.includes(i)) { bd = dmin[i]; bi = i; }
    order.push(bi);
    for (let i = 0; i < n; i++) dmin[i] = Math.min(dmin[i], Math.hypot(wrap(P[i][0] - P[bi][0]), wrap(P[i][1] - P[bi][1])));
  }
  const l = Math.max(0, maj - mnr);
  return order.map((i) => {
    const [x, y] = P[i];
    const th = ((ang + (R() - 0.5) * 30) * Math.PI) / 180, ll = l * (0.75 + 0.5 * R());
    const ux = 0.5 * ll * Math.cos(th), uy = 0.5 * ll * Math.sin(th);
    let d = '';
    for (const ox of [0, -T, T]) for (const oy of [0, -T, T]) {
      const cx = x + ox, cy = y + oy;
      if (cx < -maj || cx > T + maj || cy < -maj || cy > T + maj) continue;
      d += `M${pair(cx - ux, cy - uy)}l${pair(2 * ux, 2 * uy)}`;
    }
    return d;
  });
}

// The wing's outline and its paint, from a measured record. opt.k scales the record and opt.rot turns it (degrees, about the
// hinge): a face measured on another specimen laid on this one (aile.py alignement); opt.seed places the grains; opt.dustK
// holds the calibration per group ('grains/zone', from poudre.py); opt.dust (default 1) and opt.fringe weigh dust and fringe.
export function motif(rec, opt = {}) {
  const k = opt.k ?? 1;
  // the zones' colours corrected by their calibration (poudre.py: dustK.zones, Lab offsets per zone)
  const ZC = opt.dustK?.zones || {};
  // opt.live {below, dL}: a dried specimen's blacks are greyer than the living butterfly's (machaon: L* 16.5 on c032 against 7
  // to 10 on the living c131, c086): every colour under `below` L* is taken down by dL
  const live = (h) => { if (!opt.live) return h; const l = hex2lab(h); if (l[0] >= opt.live.below) return h; const f = 1 - l[0] / opt.live.below;
    return lab2hex(Math.max(2, l[0] + opt.live.dL * f), l[1], l[2]); };
  const zones = rec.zones.map((z) => ({ ...z, c: live(shift(z.c, ZC[z.zone])),
    degrade: z.degrade && { ...z.degrade, stops: z.degrade.stops.map(([o, c]) => [o, live(shift(c, ZC[z.zone]))]) } }));
  const outline = smooth(rec.contour, k);
  const base = zones[0].c;
  const paint = (sc) => {
    let s = '';
    const clip = {};
    const fill = (z) => {
      if (!z.degrade) return z.c;
      const g = z.degrade, id = sc.id('mgr');
      sc.defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f2(g.p0[0] * k)}" y1="${f2(g.p0[1] * k)}" x2="${f2(g.p1[0] * k)}" y2="${f2(g.p1[1] * k)}">` +
        g.stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('') + '</linearGradient>');
      return `url(#${id})`;
    };
    zones.forEach((z, i) => {
      const d = i === 0 ? outline : smoothAll(z.poly, k);
      const dust = (rec.poussiere || []).filter((D) => D.sur === z.zone);
      const shared = dust.length && (opt.dust ?? 1) > 0;
      // a zone with dust is written once in the defs, then used for its fill and for the clip of its grains
      let ref = null;
      if (shared) { ref = sc.id('mzd'); sc.defs.push(`<path id="${ref}" d="${d}" fill-rule="evenodd" clip-rule="evenodd"/>`); }
      const draw = (f) => (ref ? `<use href="#${ref}" fill="${f}"/>` : `<path d="${d}" fill="${f}" fill-rule="evenodd"/>`);
      if (i > 0 || z.degrade) s += draw(fill(z));
      if (!shared) return;
      if (!clip[z.zone]) {
        clip[z.zone] = sc.id('mz');
        sc.defs.push(`<clipPath id="${clip[z.zone]}"><use href="#${ref}"/></clipPath>`);
      }
      let g = '';
      for (const D of dust) {
        const kd = (opt.dustK?.[`${D.de}/${D.sur}`] ?? 1) * (opt.dust ?? 1);
        const [maj, mnr] = D.grain.map((v) => (v + (opt.edge ?? 0.02)) * k);
        const lv = D.niveaux.map((L) => ({ ...L, dens: (L.densite * kd) / (k * k) })).filter((L) => L.dens > 0);
        if (!lv.length) continue;
        // one tile for the group, sized for its densest level (about 90 grains, at least 0.9 mm a side), the levels nested
        const dmax = Math.max(...lv.map((L) => L.dens));
        // (a tile of about 260 grains, at least 2.4 mm a side: its repeat does not show as a mesh)
        const T = Math.max(2.4 * k, Math.sqrt(260 / dmax)), N = Math.max(1, Math.round(dmax * T * T));
        const grains = grainTile(N, T, maj, mnr, D.angle ?? 0, (opt.seed ?? 7) * 101 + D.de * 13 + D.sur * 7);
        const counts = [...new Set(lv.map((L) => Math.max(1, Math.min(N, Math.round(L.dens * T * T)))))].sort((a, b) => a - b);
        // the grains in slices: slice i holds the grains from counts[i-1] to counts[i]; a level uses the slices up to its count
        const sid = counts.map(() => sc.id('mgs'));
        counts.forEach((c, i) => sc.defs.push(`<path id="${sid[i]}" d="${grains.slice(i ? counts[i - 1] : 0, c).join('')}"/>`));
        const pat = {};
        counts.forEach((c, i) => {
          const pid = sc.id('mp'); pat[c] = pid;
          sc.defs.push(`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${f3(T)}" height="${f3(T)}">` +
            `<g stroke="${live(D.c)}" stroke-width="${f3(mnr)}" stroke-linecap="round" fill="none">` + sid.slice(0, i + 1).map((id) => `<use href="#${id}"/>`).join('') + '</g></pattern>');
        });
        for (const L of lv) g += `<path d="${smoothAll(L.poly, k)}" fill="url(#${pat[Math.max(1, Math.min(N, Math.round(L.dens * T * T)))]})" fill-rule="evenodd"/>`;
      }
      if (g) s += `<g clip-path="url(#${clip[z.zone]})">${g}</g>`;
    });
    // the long hairs over the base and the inner margin: per measured cell, light and dark hairs along the measured direction
    // (pointing away from the hinge), their number from the cover the light hairs take; two paths
    // the veins: measured strokes, one path per width and colour, over the zones and the dust
    for (const V of rec.nervures || []) {
      const d = V.traits.map((P) => 'M' + P.map((p) => pair(p[0] * k, p[1] * k)).join('L')).join('');
      s += `<path d="${d}" stroke="${live(V.c)}" stroke-width="${f3(V.largeur * k)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    }
    return opt.rot ? `<g transform="rotate(${f2(opt.rot)})">${s}</g>` : s;
  };
  // the hairs are drawn over the wing's filtered paint, not inside it (sharper, and resvg failed on them in a squeezed filter)
  const top = (sc) => {
    let s = '';
    const H = rec.poils;
    if (H && (opt.hair ?? 1) > 0) {
      const [s0, q1] = rec.origine, c = H.cellule, R = rng((opt.seed ?? 7) * 7 + 3);
      const hw = (opt.hairW ?? 0.018), hl = (opt.hairL ?? 2.2), per = (c * c) / (hw * hl);
      let dl = '', dd = '';
      for (const [gx, gy, ang, coh, cover] of H.cases) {
        const x0 = s0 + gx * c, y0 = q1 - (gy + 1) * c;
        let a = (ang * Math.PI) / 180;
        if (Math.cos(a) * (x0 + c / 2) + Math.sin(a) * (y0 + c / 2) < 0) a += Math.PI;   // away from the hinge
        // each hair dark at its root and light at its tip (the photo's hairs: dark, tipped with yellow): the dark stroke runs its
        // whole length, the light one its outer 45 %
        const seg = (x, y, ex, ey, t, b, f) => {
          const p0 = [x - ex / 2 + ex * f, y - ey / 2 + ey * f], e2 = [ex * (1 - f), ey * (1 - f)];
          return `M${pair(p0[0] * k, p0[1] * k)}q${pair((e2[0] / 2 - Math.sin(t) * b * (1 - f)) * k, (e2[1] / 2 + Math.cos(t) * b * (1 - f)) * k)} ${pair(e2[0] * k, e2[1] * k)}`;
        };
        const nh = Math.round(per * (opt.hairK ?? 1) * 1.2);
        for (let i = 0; i < nh; i++) {
          const x = x0 + R() * c, y = y0 + R() * c, t = a + (R() - 0.5) * (0.3 - 0.2 * coh), l = hl * (0.6 + 0.8 * R());
          const ex = Math.cos(t) * l, ey = Math.sin(t) * l, b = (R() - 0.5) * 0.08 * l;
          dd += seg(x, y, ex, ey, t, b, 0);
          if (R() < cover + 0.25) dl += seg(x, y, ex, ey, t, b, 0.55);
        }
      }
      // not clipped by their region: the hairs spill past it, so the mass ends in wisps as on the photo
      s += `<g fill="none" stroke-linecap="round"><path d="${dd}" stroke="${live(H.sombre)}" stroke-width="${f3(hw * 1.3 * k)}" opacity="0.8"/>` +
        `<path d="${dl}" stroke="${H.clair}" stroke-width="${f3(hw * k)}" opacity="0.7"/></g>`;
    }
    return opt.rot ? `<g transform="rotate(${f2(opt.rot)})">${s}</g>` : s;
  };
  const paint2 = (sc) => {
    let s = '';
    // the fringe: the measured colour just inside the edge, segment by segment along the outline, one path per colour
    const F = rec.frange;
    if (F && (opt.fringe ?? 1) > 0) {
      const P = rec.contour, n = F.couleurs.length, pts = [];
      let acc = 0;
      for (let i = 0; i < P.length && pts.length < n + 1; i++) {
        const a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        while (acc <= L && pts.length < n + 1) { const t = L ? acc / L : 0; pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); acc += F.pas; }
        acc -= L;
      }
      const by = {};
      // the outer margin only: near the hinge the edge meets the body or the other wing, a light fringe there drew a seam
      const L0 = rec.longueur * 0.42;
      for (let i = 0; i + 1 < pts.length && i < n; i++) {
        if (Math.hypot(pts[i][0], pts[i][1]) < L0) { delete by[F.couleurs[i]]?.last; continue; }
        const c = F.couleurs[i], prev = by[c];
        const seg = `${f2(pts[i + 1][0] * k)} ${f2(pts[i + 1][1] * k)}`;
        // consecutive segments of one colour join into one polyline
        if (prev && prev.last === i) { prev.d += `L${seg}`; prev.last = i + 1; }
        else by[c] = { d: (prev ? prev.d : '') + `M${f2(pts[i][0] * k)} ${f2(pts[i][1] * k)}L${seg}`, last: i + 1 };
      }
      for (const [c, v] of Object.entries(by)) s += `<path d="${v.d}" stroke="${live(c)}" stroke-width="${f2(F.largeur * 2 * k)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    }
    return paint(sc) + (opt.rot && s ? `<g transform="rotate(${f2(opt.rot)})">${s}</g>` : s);
  };
  // the outline is written in relative steps: its box is given apart (the engine sizes filters and rows of scales by it)
  const xs = rec.contour.map((p) => p[0] * k), ys = rec.contour.map((p) => p[1] * k);
  return { outline, base, paint: paint2, top, length: rec.longueur * k, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
}
