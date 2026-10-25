// Sheet of a whole butterfly (body + wings at chosen flaps): node papillon-planche.mjs <species> <out.png> <tile> <cols> <pose:az:el:flap ...>
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { espece } from './espece.mjs';

const [id, out, tileS, colsS, ...views] = process.argv.slice(2);
const m = await espece(id);
const tile = +tileS, cols = +colsS, rows = Math.ceil(views.length / cols), k = tile / 70;
let body = '';
views.forEach((v, i) => {
  const [pose, az, el, flap] = v.split(':');
  const svg = m.whole(+az, +el, { pose, size: tile, k, flap: flap === undefined ? undefined : +flap, idp: `t${i}_` });
  const x = (i % cols) * tile, y = Math.floor(i / cols) * tile;
  body += `<g transform="translate(${x} ${y})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}<text x="8" y="18" font-family="Arial" font-size="13" fill="#6a5a48">${pose} az ${az} el ${el} battement ${flap ?? ''}</text></g>`;
});
const W = cols * tile, H = rows * tile;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out);
