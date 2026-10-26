// frise_tetes.mjs: the flower heads of the frieze's ground where the shop's insects can land (tetes.mjs for the single
// scene's ground), read from the strips of frise_sol.mjs.
//
//   node decor/frise_tetes.mjs        -> decor/out/frise/tetes.json (after frise_sol.mjs)
//
// Each strip (out/frise/src/<slice>.svg) is drawn in its own units, one loop long ([x0, x0 + w), frise.mjs) plus a margin
// on each side that repeats the other end: only the heads inside the loop are kept. A head is a <use> of a tp/ or tm/ piece
// whose matrix places its receptacle and scales it by 2.852 / Z (fleurs.mjs plant), as in the single scene's ground.
//
// tetes.json: { bandes: { "<slice>": [[x, y, r, Z]...] } }: x in the strip's units, y and r in world units, Z in m.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LIB } from './fleurs.mjs';
import { SLICES, stripX0 } from './frise.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const K = 2.852;
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const mat = (s) => s.trim().split(/[\s,]+/).map(Number);
const at = ([a, b, c, d, e, f], u, v) => [a * u + c * v + e, b * u + d * v + f];

const ids = JSON.parse(readFileSync(join(OUT, 'sol-fleuri.json'), 'utf8')).fleurs.ids;
const bandes = {};
const counts = [];
for (const s of SLICES) {
  const file = join(OUT, 'frise', 'src', `${s.id}.svg`);
  if (!existsSync(file)) continue;
  const svg = readFileSync(file, 'utf8');
  const x0 = stripX0(s), x1 = x0 + s.w;
  const heads = [];
  for (const m of svg.matchAll(/<use href="#(F[0-9a-z]+_)" transform="matrix\(([^)]+)\)"/g)) {
    const v = LIB[ids[m[1]]];
    if (!v) continue;
    const M = mat(m[2]), sc = Math.hypot(M[0], M[1]);
    const [x, y] = at(M, v.head[0] + v.head[2] / 2, v.head[1] + v.head[3] / 2);
    if (x < x0 || x >= x1) continue;
    heads.push([r1(x), r1(y), r1((v.head[2] / 2) * sc), r2(K / sc)]);
  }
  if (!heads.length) continue;
  bandes[s.id] = heads;
  counts.push(`${s.id} ${heads.length}`);
}
writeFileSync(join(OUT, 'frise', 'tetes.json'), JSON.stringify({ bandes }));
console.log(`frise/tetes.json: ${counts.join(', ')}`);
