// Finds the organ whose SVG makes resvg fail (a panic on an element without extent): renders the scene without each organ group.
// node insectes/coccinelle/outils/panne.mjs <k> <az> <el> [pose] [x,y,z w h]   (the window of gros.mjs when given)
import { createRequire } from 'node:module';
import { draw } from '../coccinelle.mjs';
import { camera } from '../../moteur/geo.mjs';
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const [k, az, el, pose = 'pose', focus, wS, hS] = process.argv.slice(2);
const size = Math.ceil(24 * 1.6 * +k);
let svg = draw(+az, +el, { pose, size, k: +k, detail: 1 });
if (focus) {
  const P = focus.split(',').map(Number), q = camera(+az, +el).proj(P), w = +wS, h = +hS;
  const x = size / 2 + q[0] * +k - w / 2, y = size / 2 - q[1] * +k - h / 2;
  svg = svg.replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w} ${h}">`);
}
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
// a panic of resvg kills the process: each try runs in its own node
const ok = (s) => { writeFileSync('_panne.svg', s); const r = spawnSync(process.execPath, ['-e', `const{Resvg}=require(${JSON.stringify(new URL('../../outils/node_modules/@resvg/resvg-js', import.meta.url).pathname.slice(1))});new Resvg(require('fs').readFileSync('_panne.svg','utf8')).render()`]); return r.status === 0; };
console.log('entier', ok(svg) ? 'ok' : 'PANNE');
const parts = [...new Set([...svg.matchAll(/<g class="p-([a-z0-9-]+)">/g)].map((m) => m[1]))];
for (const p of parts) {
  const re = new RegExp(`<g class="p-${p}">`, 'g');
  let s = svg.replace(re, `<g class="p-${p}" display="none">`);
  console.log(p, ok(s) ? 'sans : ok' : 'sans : panne');
}
