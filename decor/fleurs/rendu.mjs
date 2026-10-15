// rendu.mjs: the scene's planes composited like the page's <img> stack (sky, horizon, a ground file, the clumps of
// scene.json), rendered by resvg plane by plane (decor/compose.mjs).
//   node decor/fleurs/rendu.mjs <out.png> [--sol sol-fleuri.svg] [--box x0,y0,x1,y1] [--scale 1] [--col] [--notouffes]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCrop, over, png } from '../compose.mjs';
const W = 2400, H = 1350;
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const a = process.argv.slice(2);
const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const out = a[0];
const box = opt('--box', `0,0,${W},${H}`).split(',').map(Number);
const scale = Number(opt('--scale', 1));
// resvg panics on some crops of the flowered ground (a filtered group outside the crop): the whole frame is rendered,
// then cropped here
const crop = box;
const [x0, y0, x1, y1] = [0, 0, W, H];
const w = Math.round((x1 - x0) * scale), h = Math.round((y1 - y0) * scale);
const t0 = performance.now();
const img = { w, h, px: new Uint8Array(w * h * 4) };
for (const f of ['ciel.svg', 'horizon.svg', opt('--sol', 'sol-fleuri.svg')]) {
  const p = join(dir, f);
  if (!existsSync(p)) continue;
  if (f === 'horizon.svg' && y0 > 745) continue;
  over(img, renderCrop(readFileSync(p, "utf8"), [x0, y0, x1, y1], scale));
}
if (!a.includes('--notouffes')) {
  const scene = JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8'));
  for (const t of scene.touffes || []) {
    const svg = readFileSync(join(dir, t.src), 'utf8');
    const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/[ ,]+/).map(Number);
    const bw = (t.w / 100) * W, bh = (bw * vb[3]) / vb[2];
    const bx = (t.x / 100) * W, by = H - (t.b / 100) * H - bh;
    if (bx > x1 || bx + bw < x0 || by > y1 || by + bh < y0) continue;
    const k = vb[2] / bw;
    over(img, renderCrop(svg, [vb[0] + (x0 - bx) * k, vb[1] + (y0 - by) * k, vb[0] + (x1 - bx) * k, vb[1] + (y1 - by) * k], scale / k));
  }
}
if (a.includes('--col')) over(img, renderCrop(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path d="M820 0V1350M1580 0V1350" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/></svg>`, [x0, y0, x1, y1], scale));
let res = img;
if (crop.join() !== `0,0,${W},${H}`) {
  const cx0 = Math.round(crop[0] * scale), cy0 = Math.round(crop[1] * scale), cw = Math.round((crop[2] - crop[0]) * scale), ch = Math.round((crop[3] - crop[1]) * scale);
  res = { w: cw, h: ch, px: new Uint8Array(cw * ch * 4) };
  for (let y = 0; y < ch; y++) res.px.set(img.px.subarray(((cy0 + y) * w + cx0) * 4, ((cy0 + y) * w + cx0 + cw) * 4), y * cw * 4);
}
writeFileSync(out, png(res));
console.log(`${out}: ${w}x${h}, ${(performance.now() - t0).toFixed(0)} ms`);
