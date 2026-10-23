// The render of one membranous wing alone, flat, face on, over the plate it was measured on (its fitted light, fond.png), in the
// frame and scale of its flattened photo (membrane.py plat), for membrane.py paire.
// node insectes/bourdon/aile-plat.mjs <avant|arriere> <out.png>
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { membrane, membranePaint } from './membrane.mjs';

const require = createRequire(new URL('../outils/package.json', import.meta.url));
const { Resvg } = require('@resvg/resvg-js');
const [name, out] = process.argv.slice(2);
const W = membrane(name), rec = W.R;
const [s0, q1] = rec.origine, r = rec.r, [w, h] = rec.taille;
const sc = { k: r, defs: [], uid: 0, id(p) { return `${p}${this.uid++}`; } };
// the paint is in the wing's turned frame: turned back to the record's (the photo's) frame
const body = `<g transform="rotate(${W.turn})">` + membranePaint(sc, W, { fres: 0, sky: 0, irid: 0, glint: 0, thick: 1 }, r) + '</g>';
const fond = 'data:image/png;base64,' + readFileSync(new URL(`../../refcache/bombus-terrestris/ailes/${name}/fond.png`, import.meta.url)).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<image href="${fond}" width="${w}" height="${h}"/><defs>${sc.defs.join('')}</defs><g transform="matrix(${r} 0 0 ${-r} ${-s0 * r} ${q1 * r})">${body}</g></svg>`;
writeFileSync(out, new Resvg(svg).render().asPng());
console.log(out, w, h, (svg.length / 1024).toFixed(0) + ' Ko');
