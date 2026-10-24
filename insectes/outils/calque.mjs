// Tracing of a render over a photo, for fitting the shape (PROTOCOLE §2): the insect drawn at the photo's scale, a point of the
// model (mm) laid on its pixel in the photo, then the render's outline drawn over the photo (calque.py).
// node calque.mjs <species> <out.png> <W,H photo px> <scale> <px/mm of the photo> <x,y,z mm> <X,Y px> pose:az:el[:frame] [roll deg]
// The render is written at W*scale x H*scale on a transparent ground; roll turns it in the image plane (a photo taken tilted).
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { espece } from './espece.mjs';
import { camera } from '../moteur/geo.mjs';

const [id, out, wh, scS, pxmmS, anc, pix, view, rollS] = process.argv.slice(2);
const { draw, whole } = await espece(id);
const [W, H] = wh.split(',').map(Number), sc = +scS, k = +pxmmS * sc;
const [pose, az, el, fr] = view.split(':');
const size = Math.ceil(Math.max(W, H) * sc * 1.2);
const svg = (whole || draw)(+az, +el, { pose, frame: +(fr || 0), size, k, detail: 1 });
const q = camera(+az, +el).proj(anc.split(',').map(Number));
const [X, Y] = pix.split(',').map(Number);
const ax = size / 2 + q[0] * k, ay = size / 2 - q[1] * k;
const roll = +(rollS || 0);
const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const w = Math.round(W * sc), h = Math.round(H * sc);
const s2 = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<g transform="translate(${X * sc} ${Y * sc}) rotate(${roll}) translate(${-ax} ${-ay})">${inner}</g></svg>`;
writeFileSync(out, new Resvg(s2).render().asPng());
console.log(out, w + 'x' + h);
