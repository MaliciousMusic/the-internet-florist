// The animation sheet of the hummingbird hawk-moth: the three drawings of the fake beat as the runtime loops them (0 1 2 1), in
// hover (proboscis unrolled, body pitched 32°) and in transit, at two views; then the rest roof, with the same angles as
// runtime/moro-sphinx.mjs. node planche-sphinx.mjs <out.png> [k = 8]
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { sphinx, META } from '../moro-sphinx/moro-sphinx.mjs';
import { SPHINX } from '../runtime/moro-sphinx.mjs';

const [out, kS] = process.argv.slice(2);
const k = +(kS ?? 8), cell = Math.ceil(META.span * 1.15 * k);
const names = ['haut (retournement)', 'descente', 'bas (retournement)', 'descente'];
const frames = [];
for (const [az, el] of [[90, 5], [130, 30]]) {
  SPHINX.seq.forEach((f, i) => frames.push({ label: `butine ${i + 1}/4 · ${names[i]}`, pose: 'butine', frame: f, az, el, pitch: SPHINX.pitch }));
}
for (const f of [0, 1, 2]) frames.push({ label: `vol (transit) ${f + 1}/3`, pose: 'vol', frame: f, az: 60, el: 20, pitch: 12 });
frames.push({ label: 'repos, de dessus', pose: 'pose', az: 180, el: 90 });
frames.push({ label: 'repos, de trois-quarts', pose: 'pose', az: 140, el: 35 });
frames.push({ label: 'repos, de profil', pose: 'pose', az: 90, el: 10 });
frames.push({ label: 'repos, de face', pose: 'pose', az: 0, el: 15 });
const cols = 4, rows = Math.ceil(frames.length / cols);
let body = '', kb = 0;
frames.forEach((f, i) => {
  const svg = sphinx(f.az, f.el, { pose: f.pose, frame: f.frame ?? 0, pitch: f.pitch ?? 0, size: cell, k, detail: 1, idp: `f${i}_` });
  kb += svg.length / 1024;
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 22);
  body += `<g transform="translate(${x} ${y + 22})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
    `<text x="${x + 8}" y="${y + 16}" font-family="sans-serif" font-size="14" fill="#5a4a38">${f.label} · az ${f.az} él ${f.el}</text>`;
});
const W = cols * cell, H = rows * (cell + 22);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (kb / 1024).toFixed(1) + ' Mo svg');
