// The render of one wing face alone, flat, face on and evenly lit, in the frame and scale of its flattened photo
// (aile.py plat), for aile.py paire.  node aile-plat.mjs <species> <fore|hind> <upper|under> <record.json> <out.png>
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { espece } from './espece.mjs';
import { wingSkin } from '../moteur/insecte.mjs';

const [id, which, face, recp, out] = process.argv.slice(2);
const { WINGS } = await espece(id);
const w = WINGS[which];
const rec = JSON.parse(readFileSync(recp, 'utf8'));
const [s0, q1] = rec.origine, r = rec.r;
const [W, H] = rec.taille;
const sc = { k: r, defs: [], uid: 0, id(p) { return `${p}${this.uid++}`; } };
const body = wingSkin(sc, w, face === 'upper', 1, 0);
// a face measured on another specimen is drawn in the upper side's frame (w.under: its record -> upper): brought back to its own
const U = face === 'under' && w.under ? w.under : null;
const inv = U ? `<g transform="scale(${1 / U.k}) rotate(${-U.rot})">` : '<g>';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#efe9df"/>` +
  `<defs>${sc.defs.join('')}</defs><g transform="matrix(${r} 0 0 ${-r} ${-s0 * r} ${q1 * r})">${inv}${body}</g></g></svg>`;
writeFileSync(out, new Resvg(svg).render().asPng());
console.log(out, W, H, (svg.length / 1024).toFixed(0) + ' Ko');
