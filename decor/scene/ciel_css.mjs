// ciel_css.mjs: the sky as pure CSS (owner, 2026-10-28: « remplacé le ciel en css pur »), read from decor/out/ciel.svg
// (ciel.mjs), which stays its source. The SVG's two gradients, the vertical one (csg) and the sun's diagonal veil (csv),
// both in the world's units (2400 x 1350), become two CSS linear gradients over one box, .ciel: the world's width, from
// 1400 units above its top edge (what ciel-haut.svg covered, for a phone held upright) to its bottom. Each SVG stop is
// placed on the CSS gradient line at the very point of the world the SVG gave it, so the colours match point for point; the
// SVG's padding (the first and last stops' colours beyond the line) is CSS's own.
//
//   import { cielCss } from './ciel_css.mjs'    cielCss() -> the CSS text (build.mjs inlines it in the pages' head)
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 2400;
const WH = 1350;
const ABOVE = 1400; // the world's units of sky over its top edge
const BOX = { x: 0, y: -ABOVE, w: W, h: WH + ABOVE };

const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const pct = (v) => `${(v * 100).toFixed(3)}%`;
const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  return a == null || a === 1 ? `rgb(${rgb})` : `rgba(${rgb},${+a.toFixed(4)})`;
};

function gradients(svg) {
  const out = {};
  for (const m of svg.matchAll(/<linearGradient\b([^>]*)>([\s\S]*?)<\/linearGradient>/g)) {
    const a = attrs(m[1]);
    const stops = [...m[2].matchAll(/<stop\b([^>]*)\/?>/g)].map((s) => {
      const t = attrs(s[1]);
      return { o: +t.offset, c: t['stop-color'], a: t['stop-opacity'] == null ? 1 : +t['stop-opacity'] };
    });
    out[a.id] = { p1: [+a.x1, +a.y1], p2: [+a.x2, +a.y2], stops };
  }
  return out;
}

// an SVG userSpaceOnUse gradient as a CSS linear-gradient over BOX (y down, CSS angles clockwise from "to top")
function css(g) {
  const v = [g.p2[0] - g.p1[0], g.p2[1] - g.p1[1]];
  const len = Math.hypot(v[0], v[1]);
  const u = [v[0] / len, v[1] / len];
  const theta = Math.atan2(u[0], -u[1]);
  // the CSS gradient line: through the box's centre, as long as the box's projection on u
  const L = Math.abs(BOX.w * u[0]) + Math.abs(BOX.h * u[1]);
  const C = [BOX.x + BOX.w / 2, BOX.y + BOX.h / 2];
  const cp = (C[0] - g.p1[0]) * u[0] + (C[1] - g.p1[1]) * u[1];
  // a point at SVG offset t lies t * len from p1 along u; on the CSS line that is ((t * len - cp) / L + 0.5)
  const at = (t) => (t * len - cp) / L + 0.5;
  const deg = ((theta * 180) / Math.PI + 360) % 360;
  return `linear-gradient(${+deg.toFixed(4)}deg,${g.stops.map((s) => `${rgba(s.c, s.a)} ${pct(at(s.o))}`).join(',')})`;
}

export function cielCss(file = join(HERE, '..', 'out', 'ciel.svg')) {
  const g = gradients(readFileSync(file, 'utf8'));
  if (!g.csg || !g.csv) throw new Error(`${file}: gradients csg and csv expected`);
  return (
    `.ciel{position:absolute;left:0;width:100%;top:${pct(-ABOVE / WH)};height:${pct(BOX.h / WH)};z-index:0;pointer-events:none;` +
    `background:${css(g.csv)},${css(g.csg)}}`
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log(cielCss());
