// herbe_rendu.mjs: the meadow planes in place (sky, horizon, z4, z5, z9 clumps of scene.json), rendered by resvg
// plane by plane and composited like the page's <img> stack (no Chrome).
//
//   node decor/herbe_rendu.mjs <out.png> [--box x0,y0,x1,y1] [--scale 1] [--planes ciel,horizon,loin,milieu,touffes]
//                              [--dir <svg dir, default decor/out>] [--pilier] [--col]
//
// --pilier: a flat grey stand-in for the pillar (x 1100-1300 from its plateau at y 700 to its foot at y 1040), to judge
// the framing; --col: the phone column (x 820-1580). Clumps are placed like scene.css does: left = x %, bottom = b %,
// width = w % of the world; they are rendered at rest (no sway).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCrop, over, png } from './compose.mjs';

const W = 2400, H = 1350;
const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const out = a[0];
const box = opt('--box', `0,0,${W},${H}`).split(',').map(Number);
const scale = Number(opt('--scale', 1));
const dir = opt('--dir', join(here, 'out'));
const planes = opt('--planes', 'ciel,horizon,loin,milieu,touffes').split(',');
const [x0, y0, x1, y1] = box;
const w = Math.round((x1 - x0) * scale), h = Math.round((y1 - y0) * scale);
const t0 = performance.now();
let img = { w, h, px: new Uint8Array(w * h * 4) };
const file = { ciel: 'ciel.svg', horizon: 'horizon.svg', loin: 'prairie-loin.svg', milieu: 'prairie-milieu.svg' };
for (const p of planes) {
  if (p === 'touffes') {
    const scene = JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8'));
    for (const t of scene.touffes || []) {
      const svg = readFileSync(join(dir, t.src), 'utf8');
      const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/[ ,]+/).map(Number);
      // placed box in world units
      const bw = (t.w / 100) * W, bh = (bw * vb[3]) / vb[2];
      const bx = (t.x / 100) * W, by = H - (t.b / 100) * H - bh;
      // resvg 2.x panics on a crop that misses the whole drawing: skip clumps outside the box
      if (bx > x1 || bx + bw < x0 || by > y1 || by + bh < y0) continue;
      // the world crop seen through the clump's own coordinates
      const k = vb[2] / bw;
      const layer = renderCrop(svg, [vb[0] + (x0 - bx) * k, vb[1] + (y0 - by) * k, vb[0] + (x1 - bx) * k, vb[1] + (y1 - by) * k], scale / k);
      over(img, layer);
    }
    continue;
  }
  const f = join(dir, file[p]);
  if (!existsSync(f)) continue;
  // the horizon plane ends near y 740; resvg panics on its filtered groups when the crop misses them all
  if (p === 'horizon' && y0 > 745) continue;
  over(img, renderCrop(readFileSync(f, 'utf8'), box, scale));
}
const overlay = [];
if (a.includes('--pilier')) overlay.push('<rect x="1100" y="700" width="200" height="340" fill="#6b6b6b"/>');
if (a.includes('--col')) overlay.push('<path d="M820 0V1350M1580 0V1350" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/>');
if (overlay.length) over(img, renderCrop(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${overlay.join('')}</svg>`, box, scale));
writeFileSync(out, png(img));
console.log(`${out}: ${w}x${h}, ${(performance.now() - t0).toFixed(0)} ms`);
