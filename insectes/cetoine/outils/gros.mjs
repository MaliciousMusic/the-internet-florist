// Close-up of the rose chafer for a pair (PROTOCOLE §5): the whole beetle drawn at k px/mm on a canvas just big enough, then cut
// around a point of the model (mm) to w x h px. outils/gros.mjs cuts with the viewBox, which made resvg fail here (a filtered piece
// left wholly outside the canvas), so the canvas holds the whole beetle and the PNG is cut after.
// node gros.mjs <out.png> <k> <w> <h> <x,y,z mm> pose:az:el[:frame][:flap] [detail] [bg]
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { Resvg } from './resvg.mjs';
import { whole, META } from '../cetoine.mjs';
import { camera } from '../../moteur/geo.mjs';

const [out, kS, wS, hS, focus, view, detS, bg] = process.argv.slice(2);
const k = +kS, w = +wS, h = +hS;
const [pose, az, el, fr, flap] = view.split(':');
const size = Math.ceil((pose === 'vol' ? META.wingspan : META.span) * 1.6 * k);
const svg = whole(+az, +el, { pose, frame: +(fr || 0), flap: flap === undefined ? undefined : +flap, size, k, detail: +(detS || 1.5), bg: bg || '#efe9df' });
const cam = camera(+az, +el);
const q = cam.proj(focus.split(',').map(Number));
const x = Math.round(size / 2 + q[0] * k - w / 2), y = Math.round(size / 2 - q[1] * k - h / 2);
const full = out.replace(/\.png$/, '-plein.png');
writeFileSync(full, new Resvg(svg).render().asPng());
execFileSync('python', ['-c', `from PIL import Image
im=Image.open(r'${full}').convert('RGB'); c=Image.new('RGB',(${w},${h}),'${bg || '#efe9df'}'); c.paste(im,(${-x},${-y})); c.save(r'${out}')
import os; os.remove(r'${full}')`]);
console.log(out, (svg.length / 1024).toFixed(0) + ' Ko svg');
