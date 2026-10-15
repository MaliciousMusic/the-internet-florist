// planche_d2.mjs: renders of the stepping-stone path (decor/out/chemin.svg) for the D2 board and the measures.
//
//   node decor/planche_d2.mjs [--svg decor/out/chemin.svg] [--outdir decor/out/d2]
//
// The path is set (as a <g>, never a nested <svg>: resvg loses tones there) over a provisional plain meadow, with a
// grey rectangle standing for the pillar (x 1100-1300, plateau y 700, foot y 1040, front of the foot y 1058), then:
//   col.png      the phone column x 820-1580, y 700-1350 at 1.8 px per unit
//   near.png     the nearest whole stone and its grass at 2 px per unit (2x the world)
//   edge.png     the front side and the top of the same stone, closer crop at 2x
//   alone.png    the path alone on transparent at 1x (for measures), and grass.png / stone.png the parts alone
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCrop, png } from './compose.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i < 0 ? d : args[i + 1];
};
const svgPath = opt('--svg', join(here, 'out', 'chemin.svg'));
const outdir = opt('--outdir', join(here, 'out', 'd2'));
mkdirSync(outdir, { recursive: true });
const meta = JSON.parse(readFileSync(svgPath.replace(/\.svg$/, '.json'), 'utf8'));

export const MEADOW = '#4e6a26';
const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const scene = (svg) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 1350" width="2400" height="1350">' +
  `<rect width="2400" height="722" fill="#b9d2e6"/><rect y="722" width="2400" height="628" fill="${MEADOW}"/>` +
  '<path d="M1100 700h200v340a100 18 0 0 1-200 0z" fill="#55565b"/>' +
  inner(svg) +
  '</svg>';

const t0 = performance.now();
const svg = readFileSync(svgPath, 'utf8');
const full = scene(svg);
const save = (name, img) => writeFileSync(join(outdir, name), png(img));
// resvg panics on a crop that leaves a clipped group wholly outside the canvas: render a band holding every stone,
// then cut the pixels
const allX = meta.info.flatMap((s) => s.top.map((p) => p[0]));
const band = [Math.floor(Math.min(820, ...allX) - 60), 690, Math.ceil(Math.max(1580, ...allX) + 60), 1350];
const cut = (img, box, sc) => {
  const ox = Math.round((box[0] - band[0]) * sc);
  const oy = Math.round((box[1] - band[1]) * sc);
  const w = Math.round((box[2] - box[0]) * sc);
  const h = Math.round((box[3] - box[1]) * sc);
  const px = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) px.set(img.px.subarray(((oy + y) * img.w + ox) * 4, ((oy + y) * img.w + ox + w) * 4), y * w * 4);
  return { w, h, px };
};
const b18 = renderCrop(full, band, 1.8);
save('col.png', cut(b18, [820, 700, 1580, 1350], 1.8));
const b2 = renderCrop(full, band, 2);
// nearest stone whose top is wholly in the frame
const st = meta.info.find((s) => Math.max(...s.side.map((p) => p[1])) < 1330) || meta.info[0];
const xs = st.top.map((p) => p[0]);
const ys = st.top.map((p) => p[1]).concat(st.side.map((p) => p[1]));
const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const padX = (x1 - x0) * 0.12;
const padY = (y1 - y0) * 0.45;
const near = [x0 - padX, y0 - padY, x1 + padX, Math.min(1350, y1 + padY * 0.6)].map(Math.round);
save('near.png', cut(b2, near, 2));
// front side and top: the middle 55 % of the stone width, from the top's middle to under the side
const cx = (x0 + x1) / 2;
const hw = (x1 - x0) * 0.27;
const edge = [cx - hw, (y0 + y1) / 2 - (y1 - y0) * 0.35, cx + hw, Math.min(1350, y1 + 10)].map(Math.round);
save('edge.png', cut(b2, edge, 2));
save('alone.png', cut(renderCrop(svg, band, 1), [band[0], 700, band[2], 1350], 1));
writeFileSync(join(outdir, 'crops.json'), JSON.stringify({ near, edge, stone: st.k, Z0: st.Z0, w: st.w, stone_px: x1 - x0 }));
console.log(`planche_d2: col, near ${near}, edge ${edge} (dalle ${st.k}) en ${(performance.now() - t0).toFixed(0)} ms`);
