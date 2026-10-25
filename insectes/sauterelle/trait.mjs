// Small strokes of the bush-cricket drawn straight into the SVG (spines, short hairs): tapered outlines in screen pixels, then
// gathered by colour into a few paths (porteur 2026-10-23: « net et optimisé », not one element per spine).

const f1 = (v) => { const r = Math.round(v * 10) / 10; return (r === 0 ? '0' : r.toString()).replace(/^(-?)0\./, '$1.'); };
const jn = (v) => v.map(f1).reduce((o, t, i) => o + (i && t[0] !== '-' ? ' ' : '') + t, '');

// A tapered stroke from a (root, width w) through m to a sharp tip z, as a filled outline (the engine's hair, in relative steps).
export function taperPath(a, m, z, w) {
  const d0x = m[0] - a[0], d0y = m[1] - a[1], d1x = z[0] - m[0], d1y = z[1] - m[1];
  const l0 = Math.hypot(d0x, d0y), l1 = Math.hypot(d1x, d1y);
  if (l0 + l1 < 0.25) return '';
  const n0 = l0 > 1e-6 ? [-d0y / l0, d0x / l0] : [-d1y / l1, d1x / l1];
  const n1x = -(z[1] - a[1]), n1y = z[0] - a[0], l2 = Math.hypot(n1x, n1y) || 1;
  const nm = [n1x / l2, n1y / l2];
  const h0 = w / 2, hm = w * 0.32;
  const sx = a[0] + n0[0] * h0, sy = a[1] + n0[1] * h0;
  const P = [m[0] + nm[0] * hm - sx, m[1] + nm[1] * hm - sy, z[0] - sx, z[1] - sy, m[0] - nm[0] * hm - sx, m[1] - nm[1] * hm - sy, a[0] - n0[0] * h0 - sx, a[1] - n0[1] * h0 - sy];
  return `M${jn([sx, sy])}q${jn(P.slice(0, 4))}Q${jn([P[4] + sx, P[5] + sy, P[6] + sx, P[7] + sy])}z`;
}

// [{ d, c, op? }] -> one path per colour and opacity, in the order the colours first appear.
export function groupPaths(list) {
  const g = new Map();
  for (const x of list) {
    const key = x.c + '|' + (x.op ?? 1);
    if (!g.has(key)) g.set(key, []);
    g.get(key).push(x.d);
  }
  let s = '';
  for (const [key, ds] of g) { const [c, o] = key.split('|'); s += `<path d="${ds.join('')}" fill="${c}"${o === '1' ? '' : ` opacity="${o}"`}/>`; }
  return s;
}
