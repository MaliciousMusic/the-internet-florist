// The animation sheet of the bumblebee (outils/planche-anim.mjs adapted): the true stroke in eight phases (one set of wings each:
// the flat figure of eight of STROKE), then the three drawings of the false wingbeat that loop in flight (two sets each), seen from
// the side and three-quarter, then the walk and the attitudes on a flower, for the owner's check.
// node insectes/bourdon/planche-anim.mjs <out.png> [k = 9]
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { bumblebee, META, STROKE } from './bourdon.mjs';

const require = createRequire(new URL('../outils/package.json', import.meta.url));
const { Resvg } = require('@resvg/resvg-js');
const [out, kS] = process.argv.slice(2);
const k = +(kS ?? 9), cell = Math.ceil(META.span * 1.05 * k);
const T = [];
for (let i = 0; i < 8; i++) T.push({ label: `battement ${i + 1}/8 (phase ${(i / 8).toFixed(2)})`, pose: 'vol', az: 90, el: 8, phases: [i / 8] });
for (let f = 0; f < 3; f++) T.push({ label: `dessin ${f + 1}/3 · profil`, pose: 'vol', az: 90, el: 8, frame: f });
for (let f = 0; f < 3; f++) T.push({ label: `dessin ${f + 1}/3 · trois-quarts`, pose: 'vol', az: 40, el: 28, frame: f });
for (const f of [0, 0.25, 0.5, 0.75]) T.push({ label: `marche ${f}`, pose: 'marche', az: 90, el: 15, frame: f });
T.push({ label: 'posé', pose: 'pose', az: 120, el: 25 });
T.push({ label: 'butine (langue sortie)', pose: 'butine', az: 60, el: 20 });
const cols = 4, rows = Math.ceil(T.length / cols);
let body = '';
T.forEach((t, i) => {
  const svg = bumblebee(t.az, t.el, { pose: t.pose, frame: t.frame ?? 0, phases: t.phases, size: cell, k, detail: 1, idp: `a${i}_` });
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 22);
  body += `<g transform="translate(${x} ${y + 22})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
    `<text x="${x + 8}" y="${y + 16}" font-family="sans-serif" font-size="14" fill="#5a4a38">${t.label}</text>`;
});
const W = cols * cell, H = rows * (cell + 22) + 26;
const note = `Battement : amplitude ${STROKE.amp}°, plan incliné de ${STROKE.plane}° sur le corps, écart en huit ±${STROKE.dev}°, incidence ${STROKE.aoa}° (155 Hz : les 3 dessins se suivent à chaque image).`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}` +
  `<text x="8" y="${H - 8}" font-family="sans-serif" font-size="14" fill="#5a4a38">${note}</text></svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko');
