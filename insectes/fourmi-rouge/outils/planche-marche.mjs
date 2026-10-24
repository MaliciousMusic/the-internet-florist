// The animation sheet of the red ant (outils/planche-anim.mjs adapted to a walker): the alternating tripod over its 8 frames seen
// three-quarter and from above (the feet in contact marked), the antennae tapping (palpe, 4 frames), the stance at every elevation
// of the atlas, drawn by the engine with the poses of the atlas, for the owner's check.
// node insectes/fourmi-rouge/outils/planche-marche.mjs <out.png> [k = 26]
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { draw, META, POSES } from '../fourmi-rouge.mjs';

// resvg lives with the chantier's tools (insectes/outils/node_modules)
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');

const [out, kS] = process.argv.slice(2);
const k = +(kS ?? 26), cell = Math.ceil(META.span * 1.05 * k);
const rows = [
  { title: 'marche, trois-quarts (az 60, él. 30)', items: POSES.marche.map((f, i) => ({ az: 60, el: 30, pose: 'marche', frame: f, label: `${i + 1}/8` })) },
  { title: 'marche, de dessus : tripode L1 R2 L3 puis R1 L2 R3', items: POSES.marche.map((f, i) => ({ az: 90, el: 90, pose: 'marche', frame: f, label: `${i + 1}/8` })) },
  { title: 'palpe (arrêt, antennes qui tâtent le sol) et pose', items: [...POSES.palpe.map((f, i) => ({ az: 30, el: 25, pose: 'palpe', frame: f, label: `palpe ${i + 1}/4` })), { az: 90, el: 10, pose: 'pose', frame: 0, label: 'pose, profil' }, { az: 0, el: 35, pose: 'pose', frame: 0, label: 'pose, face' }] },
  { title: 'élévations de l\'atlas (pose, az 45)', items: META.el.map((el) => ({ az: 45, el, pose: 'pose', frame: 0, label: `él. ${el}°` })) },
];
const cols = 8, head = 26, lab = 20;
let body = '', y = 0;
rows.forEach((r, ri) => {
  body += `<text x="10" y="${y + 18}" font-family="sans-serif" font-size="16" fill="#3b3228">${r.title}</text>`;
  y += head;
  r.items.forEach((it, i) => {
    const svg = draw(it.az, it.el, { pose: it.pose, frame: it.frame, size: cell, k, detail: 1, idp: `r${ri}c${i}_` });
    const x = i * cell;
    body += `<g transform="translate(${x} ${y})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
      `<text x="${x + 8}" y="${y + cell + 14}" font-family="sans-serif" font-size="13" fill="#5a4a38">${it.label}</text>`;
  });
  y += cell + lab;
});
const W = cols * cell, H = y;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko');
