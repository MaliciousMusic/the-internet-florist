// frise_apercu.mjs: a still of the catalogue frieze for checks and boards, composed here from its SVG sources by
// resvg (no Chrome): the sky, the horizon, the depth slices of frise_sol.mjs each moved by its own factor, and the
// pillars (pilier.mjs, one seed per place). The bouquets are not drawn (they live in the page).
//
//   node decor/frise_apercu.mjs <out.png> [--c 0] [--vue 2400] [--scale 0.5] [--sans piliers]
//     --c     the camera (frise.mjs units: 0 = the opening pillar, PITCH = the next one)
//     --vue   the width of world seen (2400: a computer at 16:9; about 1000: a phone held upright)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCrop, over, png } from './compose.mjs';
import { pilier } from './pilier.mjs';
import { CX, PLACES, PITCH, LOOP, SLICES, HORIZON, stripX0 } from './frise.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const H = 1350;
const a = process.argv.slice(2);
const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const file = a[0];
const c = Number(opt('--c', 0));
const vue = Number(opt('--vue', 2400));
const scale = Number(opt('--scale', 0.5));
const half = vue / 2;
const seedOf = (i) => 1 + i; // the pillars' seeds (frise_piliers.mjs)

const blank = () => ({ w: Math.round(vue * scale), h: Math.round(H * scale), px: new Uint8Array(Math.round(vue * scale) * Math.round(H * scale) * 4) });
const img = blank();
// a strip that loops on its width w from x0, from its tiles (frise_tuiles.mjs): the screen shows [centre - half,
// centre + half) of it; each tile is laid at its places (k loops) inside that box
const TU = JSON.parse(readFileSync(join(OUT, 'frise', 'tuiles.json'), 'utf8'));
function strip(id, centre) {
  const t = TU[id];
  const a0 = centre - half;
  const dst = blank();
  t.tuiles.forEach((q, j) => {
    for (let k = Math.floor((a0 - q.x - q.w) / t.w); q.x + k * t.w < a0 + vue; k++) {
      if (q.x + k * t.w + q.w <= a0) continue;
      // (resvg is given the whole tile: it fails on a crop that leaves some of its pieces out)
      const r = renderCrop(readFileSync(join(OUT, 'frise', id, `${j}.svg`), 'utf8'), [q.x, 0, q.x + q.w, t.h], scale);
      blit(dst, r, Math.round((q.x + k * t.w - a0) * scale), 0);
    }
  });
  over(img, dst);
}
// lays a rendered picture on a blank of the screen's size at (ox, oy) pixels, cut to it, then over dst
function blit(dst, r, ox, oy) {
  const piece = blank();
  for (let y = 0; y < r.h; y++) {
    const yy = y + oy;
    if (yy < 0 || yy >= piece.h) continue;
    const x0 = Math.max(0, -ox), x1 = Math.min(r.w, piece.w - ox);
    if (x1 > x0) piece.px.set(r.px.subarray((y * r.w + x0) * 4, (y * r.w + x1) * 4), (yy * piece.w + ox + x0) * 4);
  }
  over(dst, piece);
}
const read = (f) => readFileSync(join(OUT, f), 'utf8');
blit(img, renderCrop(read('ciel.svg'), [0, 0, 2400, H], scale), Math.round(-(CX - half) * scale), 0);
// the horizon: its strip (frise_horizon.mjs) or, until it exists, the single scene's
if (TU.horizon) strip('horizon', HORIZON.cx + c * HORIZON.f);
else blit(img, renderCrop(read('horizon.svg'), [0, 0, 2400, H], scale), Math.round((-c * HORIZON.f - (CX - half)) * scale), 0);
const pillars = () => {
  if (a.includes('--sans') && opt('--sans') === 'piliers') return;
  for (let i = 0; i < PLACES; i++) {
    let dx = i * PITCH - c;
    dx = ((((dx + LOOP / 2) % LOOP) + LOOP) % LOOP) - LOOP / 2;
    if (Math.abs(dx) > half + 200) continue;
    blit(img, renderCrop(pilier(seedOf(i)), [0, 0, 2400, H], scale), Math.round((dx - (CX - half)) * scale), 0);
  }
};
for (const s of SLICES) {
  strip(s.id, CX + c * s.f);
  if (s.id === 'arriere') pillars();
}
writeFileSync(file, png(img));
console.log(`${file}: c ${c}, vue ${vue}, ${img.w} x ${img.h}`);
