// One atlas cell of a species, rendered as the bake does (cuisson.mjs: light top-front, twice the cell size), from a given module
// root: to prove a shared change leaves a species' pixels unchanged (render before and after, then compare).
// node cellule.mjs <module.mjs> <out.png> <lod cell> <span mm> pose:az:el[:frame] [detail]
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const [mod, out, cellS, spanS, view, detS] = process.argv.slice(2);
const m = await import(pathToFileURL(mod).href);
const [pose, az, el, fr] = view.split(':');
const px = +cellS * 2, k = px / +spanS;
const svg = m.draw(+az, +el, { pose, frame: +(fr || 0), size: px, k, light: [0, 0.78, 0.62], detail: +(detS || 1) });
writeFileSync(out, new Resvg(svg).render().asPng());
console.log(out, (svg.length / 1024).toFixed(0) + ' Ko');
