// Sheet of views of the hummingbird hawk-moth (moro-sphinx), whole or body only, for checking while modelling.
// node vues-sphinx.mjs <out.png> <tile px> <k px/mm> <cols> <pose:az:el[:frame[:pitch]]> ...   (pose suffix "!" = body only)
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { sphinx } from '../moro-sphinx/moro-sphinx.mjs';

const [out, tileS, kS, colsS, ...views] = process.argv.slice(2);
const tile = +tileS, k = +kS, cols = +colsS, rows = Math.ceil(views.length / cols);
let body = '', kb = 0;
views.forEach((v, i) => {
  const [p0, az, el, fr, pitch] = v.split(':');
  const bodyOnly = p0.endsWith('!'), pose = p0.replace('!', '');
  const svg = sphinx(+az, +el, { pose, frame: +(fr || 0), pitch: +(pitch || 0), size: tile, k, idp: `v${i}_`, wings: !bodyOnly });
  kb += svg.length / 1024;
  const x = (i % cols) * tile, y = Math.floor(i / cols) * tile;
  body += `<g transform="translate(${x} ${y})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}<text x="6" y="16" font-family="Arial" font-size="13" fill="#6a5a48">${v}</text></g>`;
});
const W = cols * tile, H = rows * tile;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, kb.toFixed(0) + ' Ko svg');
