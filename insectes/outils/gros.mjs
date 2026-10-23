// Close-up of one region of an insect, to compare with a cropped photo (PROTOCOLE §5): the insect drawn at k px/mm,
// cropped around a point of the model (mm) to a window of w x h px.
// node gros.mjs <species> <out.png> <k> <w> <h> <x,y,z mm> pose:az:el[:frame] [detail]
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { espece } from './espece.mjs';
import { camera } from '../moteur/geo.mjs';

const [id, out, kS, wS, hS, focus, view, detS] = process.argv.slice(2);
const { META, draw, whole } = await espece(id);
const k = +kS, w = +wS, h = +hS;
const [pose, az, el, fr] = view.split(':');
const size = Math.ceil((META.wingspan || META.span) * 1.6 * k);
const f = (whole || draw)(+az, +el, { pose, frame: +(fr || 0), size, k, detail: +(detS || 1.5) });
const cam = camera(+az, +el);
const P = focus.split(',').map(Number), q = cam.proj(P);
const x = size / 2 + q[0] * k - w / 2, y = size / 2 - q[1] * k - h / 2;
const svg = f.replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w} ${h}">`)
  .replace('<defs>', `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w}" height="${h}" fill="#efe9df"/><defs>`);
writeFileSync(out, new Resvg(svg).render().asPng());
console.log(out, (svg.length / 1024).toFixed(0) + ' KB svg');
