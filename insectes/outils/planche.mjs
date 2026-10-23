// Test sheet of an insect: a grid of views and poses, rendered by resvg to PNG.
// node planche.mjs <out.png> <tile px> <cols> <view list: pose:az:el[:frame] ...>
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { bee } from '../abeille/abeille.mjs';

const [out, tileS, colsS, ...views] = process.argv.slice(2);
const tile = +tileS, cols = +colsS, rows = Math.ceil(views.length / cols);
const k = tile / 15;
let body = '';
views.forEach((v, i) => {
  const [pose, az, el, fr] = v.split(':');
  const svg = bee(+az, +el, { pose, frame: +(fr || 0), size: tile, k, pollen: pose === 'vol' });
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const x = (i % cols) * tile, y = Math.floor(i / cols) * tile;
  body += `<g transform="translate(${x} ${y})">${inner}<text x="8" y="18" font-family="Arial" font-size="13" fill="#6a5a48">${pose} az ${az} el ${el}${fr ? ' f' + fr : ''}</text></g>`;
});
const W = cols * tile, H = rows * tile;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out.replace(/\.png$/, '.svg'), svg);
const png = new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng();
writeFileSync(out, png);
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' KB svg');
