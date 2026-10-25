// The animation sheet of the bush-cricket: the walk cycle (6 frames at 1.4 Hz), the jump (crouch, push, take-off with the wings
// opening) and the flight (the three wing drawings in turn), drawn by the engine with the runtime's wing angles
// (runtime/sauterelle.mjs), for the owner's check.  node planche-sauterelle.mjs <out.png> [az = 300] [el = 20] [k = 6] [sexe = m]
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { espece } from './espece.mjs';
import { SAUTERELLE as S } from '../runtime/sauterelle.mjs';

const [out, azS, elS, kS, sex = 'm'] = process.argv.slice(2);
const { whole, META } = await espece('sauterelle');
const az = +(azS ?? 300), el = +(elS ?? 20), k = +(kS ?? 6);
const cell = Math.ceil(META.span * 0.92 * k);
const frames = [{ label: 'pose', pose: 'pose', frame: 0 }];
META.poses.marche.forEach((f, i) => frames.push({ label: `marche ${i + 1}/6`, pose: 'marche', frame: f }));
frames.push({ label: 'saut 1/3 : accroupi', pose: 'saut', frame: 0 }, { label: 'saut 2/3 : poussée (30 ms)', pose: 'saut', frame: 1 },
  { label: 'saut 3/3 : envol, ailes ouvertes', pose: 'saut', frame: 2, wings: S.wings[0], pitch: 30 });
S.wings.forEach((w, i) => frames.push({ label: `vol ${i + 1}/3`, pose: 'vol', frame: 0, wings: w, pitch: 32 }));
const cols = 4, rows = Math.ceil(frames.length / cols);
let body = '';
frames.forEach((f, i) => {
  const svg = whole(az, el, { pose: f.pose, frame: f.frame, wings: f.wings ?? null, pitch: f.pitch, size: cell, k, detail: 1, idp: `f${i}_`, sex });
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 22);
  body += `<g transform="translate(${x} ${y + 22})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
    `<text x="${x + 8}" y="${y + 16}" font-family="sans-serif" font-size="14" fill="#5a4a38">${f.label}</text>`;
});
const W = cols * cell, H = rows * (cell + 22);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko');
