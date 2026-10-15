// sol_rendu.mjs: renders of the ground (out/sol.svg) in the scene, by resvg (no Chrome), for the D3 board and checks.
//
//   node decor/sol_rendu.mjs [--svg decor/out/sol.svg] [--outdir decor/out/sol] [--planes ciel,horizon,sol]
//                            [--only scene,col,near]
//
// Every plane is rendered whole (full 2400 x 1350 frame) and the pixels are cut afterwards: resvg panics on a crop
// that leaves a clipped, masked or filtered group wholly outside the canvas (etat-*.md). Planes are composited like
// the page's <img> stack (premultiplied "over").
//   scene.png   the whole scene at 0.75 px per unit (desktop framing, 1800 px wide)
//   col.png     the phone column x 820-1580 at 1.8 px per unit (the phone's scale), whole height
//   near-*.png  2x close-ups (2 px per unit): the last stone before the pillar and the pillar's foot, then the nearest
//               whole stone; crops in sol-crops.json
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCrop, over, png } from './compose.mjs';

const W = 2400, H = 1350;
const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const opt = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const svgPath = opt('--svg', join(here, 'out', 'sol.svg'));
const outdir = opt('--outdir', join(here, 'out', 'sol'));
const planes = opt('--planes', 'ciel,horizon,sol').split(',');
const only = opt('--only', 'scene,col,near').split(',');
mkdirSync(outdir, { recursive: true });
const files = { ciel: join(here, 'out', 'ciel.svg'), horizon: join(here, 'out', 'horizon.svg'), sol: svgPath };
const meta = existsSync(svgPath.replace(/\.svg$/, '.json')) ? JSON.parse(readFileSync(svgPath.replace(/\.svg$/, '.json'), 'utf8')) : null;

function frame(scale) {
  const w = Math.round(W * scale), h = Math.round(H * scale);
  const img = { w, h, px: new Uint8Array(w * h * 4) };
  for (const p of planes) {
    if (!existsSync(files[p])) continue;
    over(img, renderCrop(readFileSync(files[p], 'utf8'), [0, 0, W, H], scale));
  }
  return img;
}
function cut(img, box, sc) {
  const ox = Math.round(box[0] * sc), oy = Math.round(box[1] * sc);
  const w = Math.min(img.w - ox, Math.round((box[2] - box[0]) * sc)), h = Math.min(img.h - oy, Math.round((box[3] - box[1]) * sc));
  const px = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) px.set(img.px.subarray(((oy + y) * img.w + ox) * 4, ((oy + y) * img.w + ox + w) * 4), y * w * 4);
  return { w, h, px };
}
const save = (name, img) => writeFileSync(join(outdir, name), png(img));
const t0 = performance.now();
if (only.includes('scene')) save('scene.png', frame(0.75));
if (only.includes('col')) save('col.png', cut(frame(1.8), [820, 0, 1580, H], 1.8));
if (only.includes('near') && meta) {
  const big = frame(2);
  const crops = {};
  // last stone before the pillar, with the pillar's foot
  const st = meta.stones;
  const last = st[st.length - 1];
  const xs = last.top.map((p) => p[0]), ys = last.top.map((p) => p[1]);
  const box1 = [Math.min(...xs, 1080) - 40, 990, Math.max(...xs, 1320) + 40, Math.max(...ys) + 45].map(Math.round);
  crops.dernier = box1;
  save('near-dernier.png', cut(big, box1, 2));
  // nearest whole stone
  const whole = st.find((s) => Math.max(...s.side.map((p) => p[1])) < 1330) || st[0];
  const xs2 = whole.top.map((p) => p[0]), ys2 = whole.top.map((p) => p[1]).concat(whole.side.map((p) => p[1]));
  const pad = (Math.max(...xs2) - Math.min(...xs2)) * 0.12;
  const box2 = [Math.min(...xs2) - pad, Math.min(...ys2) - 40, Math.max(...xs2) + pad, Math.min(H, Math.max(...ys2) + 30)].map(Math.round);
  crops.proche = box2;
  save('near-proche.png', cut(big, box2, 2));
  writeFileSync(join(outdir, 'sol-crops.json'), JSON.stringify(crops));
}
console.log(`sol_rendu: ${only.join(',')} en ${(performance.now() - t0).toFixed(0)} ms -> ${outdir}`);
