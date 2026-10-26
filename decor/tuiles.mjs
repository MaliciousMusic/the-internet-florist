// tuiles.mjs: cuts a wide SVG strip (a slice of the frieze, frise_sol.mjs) into tiles along x, each tile a standalone
// SVG holding only what it shows, so the page loads the tiles near the camera and the browser never reads the whole
// loop. Laid side by side, the tiles give back the strip: same drawing, same stacking order, same defs.
//
//   import { tiles } from './tuiles.mjs';  tiles(svg, [[a, b], ...], { margin }) -> [svg, ...]
//
// How each kind of element is cut:
// - a path is split into its subpaths (each restarted by an absolute moveto), and each tile keeps the subpaths whose
//   box (stroke included) meets the tile (+ margin). A subpath never changes the fill of a point outside its own box,
//   so the fill inside the tile is the strip's. A closed subpath much wider than a tile whose two ends stand on its
//   bottom (a deep-canopy mass, a far-meadow strip: a profile along x) is cut to the tile: the run of its segments
//   inside the tile, closed straight down to its bottom.
// - a <use> is kept when the box of what it draws (its target's, through the transforms) meets the tile; a target path
//   that is a wide profile is cut in that tile's defs (same id) like the paths above.
// - a group is kept when one of its children is, with only those children.
// - defs: only those the tile refers to, followed through their own references; a horizontal gradient in user space
//   much wider than the tile (the streaks of the deep canopy, the far meadow's colour along x) keeps only its stops over
//   the tile, the colours at the tile's edges interpolated.
// Path syntax handled: M L H V C S Q T Z (absolute and relative) and A (box from its end points and radii).

// ---------- a small XML tree (the generated SVG: no text, no comments) ----------
function parse(src) {
  const root = { name: '#root', attrs: '', kids: [] };
  const stack = [root];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let m;
  while ((m = re.exec(src))) {
    const [, close, name, attrs, self] = m;
    if (close) { stack.pop(); continue; }
    const n = { name, attrs, kids: [] };
    stack[stack.length - 1].kids.push(n);
    if (!self) stack.push(n);
  }
  return root;
}
const attr = (n, k) => { const m = new RegExp(`(?:^|\\s)${k}="([^"]*)"`).exec(n.attrs); return m ? m[1] : null; };
const setAttr = (attrs, k, v) => (new RegExp(`(\\s)${k}="[^"]*"`).test(attrs) ? attrs.replace(new RegExp(`(\\s)${k}="[^"]*"`), `$1${k}="${v}"`) : `${attrs} ${k}="${v}"`);
function write(n) {
  if (!n.kids.length && n.self !== false) return `<${n.name}${n.attrs}/>`;
  return `<${n.name}${n.attrs}>${n.kids.map(write).join('')}</${n.name}>`;
}

// ---------- affine transforms [a b c d e f] ----------
const I = [1, 0, 0, 1, 0, 0];
const mul = (p, q) => [p[0] * q[0] + p[2] * q[1], p[1] * q[0] + p[3] * q[1], p[0] * q[2] + p[2] * q[3], p[1] * q[2] + p[3] * q[3], p[0] * q[4] + p[2] * q[5] + p[4], p[1] * q[4] + p[3] * q[5] + p[5]];
function transformOf(s) {
  let t = I;
  if (!s) return t;
  for (const m of s.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)) {
    const v = m[2].split(/[\s,]+/).filter(Boolean).map(Number);
    let q = I;
    if (m[1] === 'matrix') q = v;
    else if (m[1] === 'translate') q = [1, 0, 0, 1, v[0], v[1] || 0];
    else if (m[1] === 'scale') q = [v[0], 0, 0, v[1] ?? v[0], 0, 0];
    else if (m[1] === 'rotate') {
      const a = (v[0] * Math.PI) / 180, c = Math.cos(a), s2 = Math.sin(a);
      q = [c, s2, -s2, c, 0, 0];
      if (v.length > 2) q = mul(mul([1, 0, 0, 1, v[1], v[2]], q), [1, 0, 0, 1, -v[1], -v[2]]);
    } else if (m[1] === 'skewX') q = [1, 0, Math.tan((v[0] * Math.PI) / 180), 1, 0, 0];
    else q = [1, Math.tan((v[0] * Math.PI) / 180), 0, 1, 0, 0];
    t = mul(t, q);
  }
  return t;
}
const apply = (t, x, y) => [t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5]];
// box [x0, y0, x1, y1] through a transform
function boxThrough(t, b) {
  if (!b) return null;
  const p = [apply(t, b[0], b[1]), apply(t, b[2], b[1]), apply(t, b[0], b[3]), apply(t, b[2], b[3])];
  return [Math.min(...p.map((q) => q[0])), Math.min(...p.map((q) => q[1])), Math.max(...p.map((q) => q[0])), Math.max(...p.map((q) => q[1]))];
}
const union = (a, b) => (!a ? b : !b ? a : [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])]);

// ---------- paths ----------
const NARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
const fmt = (v) => { const s = (Math.round(v * 100) / 100).toString(); return s.replace(/^(-?)0\./, '$1.'); };
// d -> subpaths: { d (standalone, absolute start), box, closed, segs: [{ x0, y0, x1, y1, text }] (absolute end points),
//                  line: only straight segments }
function subpaths(d) {
  const tok = d.match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
  const out = [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = null, cur = null;
  const begin = (x, y) => { cur = { start: [x, y], parts: [], box: [x, y, x, y], closed: false, segs: [] }; out.push(cur); };
  const grow = (x, y) => { const b = cur.box; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; };
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const C = cmd.toUpperCase(), rel = cmd !== C;
    if (C === 'Z') {
      if (cur) { cur.parts.push('z'); cur.closed = true; cur.segs.push({ x0: cx, y0: cy, x1: sx, y1: sy, text: null }); }
      cx = sx; cy = sy;
      cmd = null;
      continue;
    }
    const vs = tok.slice(i, i + NARGS[C]);
    const v = vs.map(Number);
    if (v.length < NARGS[C]) break;
    i += NARGS[C];
    if (C === 'M') {
      const x = rel ? cx + v[0] : v[0], y = rel ? cy + v[1] : v[1];
      begin(x, y);
      cx = sx = x; cy = sy = y;
      cmd = rel ? 'l' : 'L'; // implicit pairs after a moveto are linetos
      continue;
    }
    if (!cur || (cur.closed && cur.parts.length)) { begin(cx, cy); sx = cx; sy = cy; }
    // the numbers as written (a relative chain must not drift by rounding)
    const raw = cmd + vs.join(' ').replace(/ -/g, '-');
    const x0 = cx, y0 = cy;
    let pts = [];
    if (C === 'L' || C === 'T') { cx = rel ? cx + v[0] : v[0]; cy = rel ? cy + v[1] : v[1]; }
    else if (C === 'H') cx = rel ? cx + v[0] : v[0];
    else if (C === 'V') cy = rel ? cy + v[0] : v[0];
    else if (C === 'C') { pts = [[v[0], v[1]], [v[2], v[3]]]; if (rel) pts = pts.map(([a, b]) => [cx + a, cy + b]); cx = rel ? cx + v[4] : v[4]; cy = rel ? cy + v[5] : v[5]; }
    else if (C === 'S' || C === 'Q') { pts = [[v[0], v[1]]]; if (rel) pts = pts.map(([a, b]) => [cx + a, cy + b]); cx = rel ? cx + v[2] : v[2]; cy = rel ? cy + v[3] : v[3]; }
    else if (C === 'A') { const r = Math.max(Math.abs(v[0]), Math.abs(v[1])); const ex = rel ? cx + v[5] : v[5], ey = rel ? cy + v[6] : v[6]; pts = [[Math.min(cx, ex) - r, Math.min(cy, ey) - r], [Math.max(cx, ex) + r, Math.max(cy, ey) + r]]; cx = ex; cy = ey; }
    for (const [a, b] of pts) grow(a, b);
    grow(cx, cy);
    cur.parts.push(raw);
    cur.segs.push({ x0, y0, x1: cx, y1: cy, text: raw, line: C === 'L' || C === 'H' || C === 'V', abs: !rel });
  }
  for (const s of out) s.d = `M${fmt(s.start[0])} ${fmt(s.start[1])}${s.parts.join('')}`;
  return out;
}
// A closed profile wider than the tile, cut to [a, b]: the run of its segments inside, then straight down to its
// bottom and back. null when the subpath is not such a profile.
function cutProfile(s, a, b) {
  if (!s.closed || s.segs.length < 4) return null;
  const bottom = s.box[3];
  if (Math.abs(s.start[1] - bottom) > 0.6) return null;
  // the top run: segments between the first rise from the bottom and the last fall to it
  const run = [];
  for (const g of s.segs) if (g.text && Math.min(g.x0, g.x1) >= a && Math.max(g.x0, g.x1) <= b) run.push(g);
  if (!run.length) return '';
  // relative segments only can be laid again from a new start; absolute ones are kept as they are
  const first = run[0], last = run[run.length - 1];
  let d = `M${fmt(first.x0)} ${fmt(bottom)}L${fmt(first.x0)} ${fmt(first.y0)}`;
  let px = first.x0;
  for (const g of run) {
    // a gap in the run (a segment left out inside the tile): joined straight
    if (Math.abs(g.x0 - px) > 1e-6 && g !== first) d += `L${fmt(g.x0)} ${fmt(g.y0)}`;
    d += g.abs ? g.text : g.text;
    px = g.x1;
  }
  return `${d}L${fmt(last.x1)} ${fmt(bottom)}z`;
}

// ---------- gradients ----------
const hexRgb = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const rgbHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
// stops of a gradient element (as written by the decor modules: offset, stop-color, stop-opacity attributes)
function stopsOf(n) {
  return n.kids.filter((k) => k.name === 'stop').map((k) => ({ o: Number(attr(k, 'offset')), c: attr(k, 'stop-color') || '#000', a: attr(k, 'stop-opacity') }));
}
function cropStops(st, x1, x2, a, b) {
  const at = (x) => {
    const t = (x - x1) / (x2 - x1);
    let j = 0;
    while (j < st.length - 1 && st[j + 1].o < t) j++;
    const p = st[j], q = st[Math.min(j + 1, st.length - 1)];
    const u = q.o > p.o ? Math.min(1, Math.max(0, (t - p.o) / (q.o - p.o))) : 0;
    const c = hexRgb(p.c).map((v, i) => v + (hexRgb(q.c)[i] - v) * u);
    const al = p.a == null && q.a == null ? null : (Number(p.a ?? 1) + (Number(q.a ?? 1) - Number(p.a ?? 1)) * u).toFixed(3);
    return { c: rgbHex(c), a: al };
  };
  const out = [];
  const e0 = at(a), e1 = at(b);
  out.push({ o: 0, ...e0 });
  for (const s of st) {
    const x = x1 + s.o * (x2 - x1);
    if (x > a && x < b) out.push({ o: (x - a) / (b - a), c: s.c, a: s.a });
  }
  out.push({ o: 1, ...e1 });
  return out.map((s) => `<stop offset="${+s.o.toFixed(5)}" stop-color="${s.c}"${s.a != null ? ` stop-opacity="${s.a}"` : ''}/>`).join('');
}

// ---------- the cut ----------
export function tiles(svg, ranges, { margin = 24 } = {}) {
  const head = svg.match(/^<svg[^>]*>/)[0];
  const vb = attr({ attrs: ' ' + head.slice(4, -1) }, 'viewBox').split(/[\s,]+/).map(Number);
  const di = svg.indexOf('<defs>'), de = svg.indexOf('</defs>');
  const defsTree = parse(svg.slice(di + 6, de));
  const bodyTree = parse(svg.slice(de + 7, svg.lastIndexOf('</svg>')));
  const defs = defsTree.kids;
  // every id (nested too) -> its top-level def and its own node
  const owner = new Map(), node = new Map();
  const walk = (n, top) => { const id = attr(n, 'id'); if (id) { owner.set(id, top); node.set(id, n); } n.kids.forEach((k) => walk(k, top)); };
  defs.forEach((d, i) => walk(d, i));
  const refsIn = (s) => [...s.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] || m[2]);
  const defRefs = defs.map((d) => refsIn(write(d)));
  // the box a def draws in its own coordinates (cached), clip paths and the like ignored (conservative)
  const boxCache = new Map();
  function drawBox(n, t = I) {
    if (n.name === 'path') {
      let b = null;
      for (const s of subpaths(attr(n, 'd') || '')) b = union(b, s.box);
      const sw = Number(attr(n, 'stroke-width') || (attr(n, 'stroke') ? 1 : 0)) / 2;
      if (b) b = [b[0] - sw, b[1] - sw, b[2] + sw, b[3] + sw];
      return boxThrough(mul(t, transformOf(attr(n, 'transform'))), b);
    }
    if (n.name === 'use') {
      const id = (attr(n, 'href') || attr(n, 'xlink:href') || '').slice(1);
      const tt = mul(mul(t, transformOf(attr(n, 'transform'))), [1, 0, 0, 1, Number(attr(n, 'x') || 0), Number(attr(n, 'y') || 0)]);
      if (!boxCache.has(id)) boxCache.set(id, node.has(id) ? drawBox(node.get(id)) : null);
      return boxThrough(tt, boxCache.get(id));
    }
    if (n.name === 'rect') {
      const x = Number(attr(n, 'x') || 0), y = Number(attr(n, 'y') || 0);
      return boxThrough(mul(t, transformOf(attr(n, 'transform'))), [x, y, x + Number(attr(n, 'width') || 0), y + Number(attr(n, 'height') || 0)]);
    }
    if (n.name === 'circle' || n.name === 'ellipse') {
      const x = Number(attr(n, 'cx') || 0), y = Number(attr(n, 'cy') || 0), rx = Number(attr(n, 'r') || attr(n, 'rx') || 0), ry = Number(attr(n, 'r') || attr(n, 'ry') || 0);
      return boxThrough(mul(t, transformOf(attr(n, 'transform'))), [x - rx, y - ry, x + rx, y + ry]);
    }
    if (/^(clipPath|mask|linearGradient|radialGradient|pattern|filter|stop|fe\w+)$/.test(n.name)) return null;
    const tt = mul(t, transformOf(attr(n, 'transform')));
    let b = null;
    for (const k of n.kids) b = union(b, drawBox(k, tt));
    return b;
  }
  // the wide profile paths among the defs (used by the deep-canopy masses), cut per tile
  const wideDef = new Map();
  defs.forEach((d) => {
    if (d.name !== 'path' || !attr(d, 'id')) return;
    const sp = subpaths(attr(d, 'd'));
    if (sp.length === 1 && sp[0].box[2] - sp[0].box[0] > 3 * (ranges[0][1] - ranges[0][0])) wideDef.set(attr(d, 'id'), sp[0]);
  });

  return ranges.map(([a0, b0]) => {
    const a = a0 - margin, b = b0 + margin;
    const meets = (bx) => bx && bx[2] >= a && bx[0] <= b;
    // the body, cut
    function cut(n, t) {
      if (n.name === 'path') {
        const tt = mul(t, transformOf(attr(n, 'transform')));
        const sw = Number(attr(n, 'stroke-width') || (attr(n, 'stroke') ? 1 : 0)) / 2;
        const sp = subpaths(attr(n, 'd') || '');
        // the tile's range in the path's own coordinates (the transforms here are scales and translations)
        const inv = (x) => (x - tt[4]) / tt[0];
        const la = Math.min(inv(a), inv(b)), lb = Math.max(inv(a), inv(b));
        const keep = [];
        for (const s of sp) {
          const bx = boxThrough(tt, [s.box[0] - sw, s.box[1] - sw, s.box[2] + sw, s.box[3] + sw]);
          if (!meets(bx)) continue;
          if (s.box[2] - s.box[0] > 3 * (b - a) && Math.abs(tt[1]) < 1e-9 && Math.abs(tt[2]) < 1e-9) {
            const c = cutProfile(s, la, lb);
            if (c != null) { if (c) keep.push(c); continue; }
          }
          keep.push(s.d);
        }
        if (!keep.length) return null;
        return { name: 'path', attrs: setAttr(n.attrs, 'd', keep.join('')), kids: [] };
      }
      if (n.name === 'g' || n.name === 'a' || n.name === 'svg') {
        const tt = mul(t, transformOf(attr(n, 'transform')));
        const kids = n.kids.map((k) => cut(k, tt)).filter(Boolean);
        return kids.length ? { name: n.name, attrs: n.attrs, kids } : null;
      }
      return meets(drawBox(n, t)) ? n : null;
    }
    const body = bodyTree.kids.map((k) => cut(k, I)).filter(Boolean).map(write).join('');
    // the defs it needs
    const need = new Set(), stack = refsIn(body);
    while (stack.length) {
      const id = stack.pop();
      if (!owner.has(id)) continue;
      const i = owner.get(id);
      if (need.has(i)) continue;
      need.add(i);
      stack.push(...defRefs[i]);
    }
    const out = [];
    defs.forEach((d, i) => {
      if (!need.has(i) && attr(d, 'id')) return;
      const id = attr(d, 'id');
      if (id && wideDef.has(id)) {
        const c = cutProfile(wideDef.get(id), a, b);
        return out.push(write({ name: 'path', attrs: setAttr(d.attrs, 'd', c || 'M0 0'), kids: [] }));
      }
      if (d.name === 'linearGradient' && (attr(d, 'gradientUnits') === 'userSpaceOnUse') && attr(d, 'y1') === attr(d, 'y2')) {
        const x1 = Number(attr(d, 'x1')), x2 = Number(attr(d, 'x2'));
        if (x2 - x1 > 3 * (b - a)) {
          const st = stopsOf(d);
          let at = setAttr(setAttr(d.attrs, 'x1', fmt(a)), 'x2', fmt(b));
          // a template (no stops): the gradients built on it are cropped against its old span below
          if (!st.length) return out.push(`<linearGradient${at}/>`);
          return out.push(`<linearGradient${at}>${cropStops(st, x1, x2, a, b)}</linearGradient>`);
        }
      }
      if (d.name === 'linearGradient' && attr(d, 'href')) {
        const tpl = node.get(attr(d, 'href').slice(1));
        if (tpl && attr(tpl, 'gradientUnits') === 'userSpaceOnUse') {
          const x1 = Number(attr(tpl, 'x1')), x2 = Number(attr(tpl, 'x2'));
          if (x2 - x1 > 3 * (b - a)) return out.push(`<linearGradient${d.attrs}>${cropStops(stopsOf(d), x1, x2, a, b)}</linearGradient>`);
        }
      }
      out.push(write(d));
    });
    const h = vb[3], y0 = vb[1];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(a0)} ${fmt(y0)} ${fmt(b0 - a0)} ${fmt(h)}" width="${fmt(b0 - a0)}" height="${fmt(h)}"><defs>${out.join('')}</defs>${body}</svg>`;
  });
}
