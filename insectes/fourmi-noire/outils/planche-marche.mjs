// The animation sheet of the black garden ant: the stride in 8 frames seen from the side and from above, its footfall diagram
// (stance dark, swing light, tripods L1 R2 L3 against R1 L2 R3), the walk with a petal fragment, and the antennation stop, drawn by
// the engine with the frames of the atlas (META.poses), for the owner's check.
// node --max-old-space-size=900 insectes/fourmi-noire/outils/planche-marche.mjs <out.png> [k = 46]   (from the atelier's root)
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { draw, META, stepOf } from '../fourmi-noire.mjs';

// resvg lives in insectes/outils/node_modules (the shared tools' packages)
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
const [out, kS] = process.argv.slice(2);
const k = +(kS ?? 38), cell = Math.ceil(META.span * k), lab = 22;
const F = META.poses.marche;
const rows = [
  { title: 'marche, profil (az 90, élévation 12°)', pose: 'marche', az: 90, el: 12, frames: F },
  { title: 'marche, dessus (az 180, élévation 90°)', pose: 'marche', az: 180, el: 90, frames: F },
  { title: 'porte un fragment de pétale fané (az 60, élévation 25°)', pose: 'porte', az: 60, el: 25, frames: F, petale: true },
  { title: 'arrêt : les antennes palpent (az 30, élévation 30°)', pose: 'palpe', az: 30, el: 30, frames: META.poses.palpe },
];
const cols = 8, gaitH = 160;
let body = '', y = 0;
for (const [ri, r] of rows.entries()) {
  body += `<text x="10" y="${y + 16}" font-family="sans-serif" font-size="15" fill="#5a4a38">${r.title}</text>`;
  y += lab;
  r.frames.forEach((f, i) => {
    const svg = draw(r.az, r.el, { pose: r.pose, frame: f, size: cell, k, detail: 1, idp: `r${ri}f${i}_`, petale: r.petale });
    body += `<g transform="translate(${i * cell} ${y})">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>` +
      `<text x="${i * cell + 8}" y="${y + cell - 8}" font-family="sans-serif" font-size="12" fill="#8a7a68">${Math.round(f * 100)} %</text>`;
  });
  y += cell;
  if (ri === 1) {
    // the footfall diagram of one stride: a bar per leg, dark while the foot is on the ground
    const legsL = [['L1', 'fore', 1], ['L2', 'mid', 1], ['L3', 'hind', 1], ['R1', 'fore', -1], ['R2', 'mid', -1], ['R3', 'hind', -1]];
    const x0 = 60, w = cols * cell - 80, n = 96;
    body += `<text x="10" y="${y + 16}" font-family="sans-serif" font-size="15" fill="#5a4a38">appuis au sol sur une foulée (facteur de service 0,6, tripodes alternés L1 R2 L3 / R1 L2 R3)</text>`;
    legsL.forEach(([nm, kk, s], j) => {
      const yy = y + 28 + j * 20;
      body += `<text x="10" y="${yy + 12}" font-family="sans-serif" font-size="12" fill="#5a4a38">${nm}</text>`;
      const tri = (kk === 'mid') === (s > 0);
      for (let q = 0; q < n; q++) {
        const g = stepOf(kk, s, q / n, 1, 1);
        body += `<rect x="${(x0 + (q * w) / n).toFixed(1)}" y="${yy}" width="${(w / n + 0.6).toFixed(1)}" height="15" fill="${g.lift > 0 ? '#e6dac6' : tri ? '#7a5434' : '#33241a'}"/>`;
      }
    });
    y += gaitH;
  }
}
const W = cols * cell, H = y;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>${body}</svg>`;
writeFileSync(out, new Resvg(svg, { font: { loadSystemFonts: true } }).render().asPng());
console.log(out, W + 'x' + H, (svg.length / 1024).toFixed(0) + ' Ko');
