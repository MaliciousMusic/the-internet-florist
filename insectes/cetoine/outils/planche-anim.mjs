// The animation sheet of the rose chafer (outils/planche-anim.mjs adapted): the faux of the wingbeat in flight (three drawings, each a
// set of wings and its ghost, as runtime/cetoine.mjs places the quads), the wings unfolding before take-off, the walk cycle on the
// flower (tripods), at rest, and buried head down in a flower. The views are those the runtime sees most (three-quarter from above).
// node planche-anim.mjs <out.png> [az = 120] [el = 30] [k = 9]
import { writeFileSync } from 'node:fs';
import { Resvg } from './resvg.mjs';
import { chafer, META } from '../cetoine.mjs';
import { CETOINE as S, Cetoine } from '../../runtime/cetoine.mjs';

const [out, azS, elS, kS] = process.argv.slice(2);
const az = +(azS ?? 120), el = +(elS ?? 30), k = +(kS ?? 9);
const cell = Math.ceil(META.wingspan * 1.15 * k);
const frames = [];
S.faux.forEach((d, i) => frames.push({ label: `vol, dessin ${i + 1}/3`, pose: 'vol', el: el - 25, sets: [{ ...d.main, alpha: 1 }, d.ghost] }));
// the unfolding, with the runtime's own law (Cetoine.strokeWings at open = u)
for (const u of [0.2, 0.5, 0.85]) {
  const c = new Cetoine({}, [], () => 0.5); c.phase = 0; c.strokeWings(0, u);
  frames.push({ label: `déploiement ${Math.round(u * 100)} %`, pose: 'vol', sets: [{ ...c.wingPose.hind, bias: -2.5 }] });
}
for (const f of [0, 0.25, 0.5, 0.75]) frames.push({ label: `marche ${f * 8 + 1}/8`, pose: 'marche', frame: f, sets: [] });
frames.push({ label: 'posée', pose: 'pose', sets: [] });
frames.push({ label: 'enfouie, tête en bas', pose: 'pose', el: el + 45, az: az - 60, sets: [] });
const cols = 4, rows = Math.ceil(frames.length / cols);
let body = '';
frames.forEach((f, i) => {
  const svg = chafer(f.az ?? az, f.el ?? el, { pose: f.pose, frame: f.frame ?? 0, wingSets: f.sets, size: cell, k, detail: 1, idp: `f${i}_` });
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + 22);
  body += `<g transform="translate(${x} ${y + 22})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
    `<text x="${x + 8}" y="${y + 16}" font-family="sans-serif" font-size="14" fill="#5a4a38">${f.label}</text>`;
});
const W = cols * cell, H = rows * (cell + 22);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko');
