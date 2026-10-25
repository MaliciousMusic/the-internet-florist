// tetes.mjs: the flower heads where the shop's insects can land, read from the drawn ground and foreground clumps.
//
//   node decor/tetes.mjs        -> decor/out/tetes.json (after fleurs.mjs sol or touffes)
//
// The meadow (out/sol-loin|milieu|pres.svg): every full or reduced head (tp/ and tm/ pieces) is a <use> whose matrix
// places the piece's origin (its receptacle) and scales it by sEng = 2.852 k / Z (fleurs.mjs plant, k about 1): its
// distance is read from that scale, its heart from the piece's head box (bibliotheque.json). Silhouettes and far dots
// are left out: no insect is seen landing at that distance.
// The foreground clumps (out/touffe-fleurie-N.svg, framed in world units): each plant is a <use> of a pl/ piece drawn
// about its foot (fleurs.mjs piece), scaled by exactly 2.852 / Z; the ids follow the order of the clump's plants in
// TOUFFES_FLEURIES.
//
// tetes.json: { sol: [[x, y, r, Z, file]...] (world units, r the head's half width, Z in m, file 0 far / 1 middle / 2 near),
//               touffes: { "touffe-fleurie-N.svg": [[x, y, r, Z]...] } }
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LIB, TOUFFES_FLEURIES } from './fleurs.mjs';
import { CAM } from './herbe.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const K = 2.852; // engine units to world units at 1 m (18.54 units per cm at 1 m / 6.5 engine units per cm)
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const mat = (s) => s.trim().split(/[\s,]+/).map(Number);
const at = ([a, b, c, d, e, f], u, v) => [a * u + c * v + e, b * u + d * v + f];

const ids = JSON.parse(readFileSync(join(OUT, 'sol-fleuri.json'), 'utf8')).fleurs.ids;
const sol = [];
['sol-loin.svg', 'sol-milieu.svg', 'sol-pres.svg'].forEach((file, fi) => {
  const svg = readFileSync(join(OUT, file), 'utf8');
  for (const m of svg.matchAll(/<use href="#(F[0-9a-z]+_)" transform="matrix\(([^)]+)\)"/g)) {
    const v = LIB[ids[m[1]]];
    if (!v) continue;
    const M = mat(m[2]), s = Math.hypot(M[0], M[1]);
    const [x, y] = at(M, v.head[0] + v.head[2] / 2, v.head[1] + v.head[3] / 2);
    sol.push([r1(x), r1(y), r1((v.head[2] / 2) * s), r2(K / s), fi]);
  }
});

const { F, H, Y0, EYE } = CAM;
const cutHeight = (Z) => EYE - ((H - Y0) * Z) / F;
const touffes = {};
TOUFFES_FLEURIES.forEach((T, i) => {
  const file = `touffe-fleurie-${i + 1}.svg`;
  const nu = cutHeight(T.Z) > 0.25 ? '-nu' : '';
  const names = [...new Set(T.fl.map((f) => f[0]))];
  const byId = new Map(names.map((n, k) => [`f${i + 1}${k.toString(36)}`, LIB[`pl/${n}${nu}`]]));
  const svg = readFileSync(join(OUT, file), 'utf8');
  const heads = [];
  for (const m of svg.matchAll(/<use href="#(f[0-9a-z]+)" transform="(matrix|translate)\(([^)]+)\)(?: scale\(([^)]+)\))?"/g)) {
    const v = byId.get(m[1]);
    if (!v) continue;
    let M;
    if (m[2] === 'matrix') M = mat(m[3]);
    else { const [tx, ty] = mat(m[3]), s = +m[4]; M = [s, 0, 0, s, tx, ty]; }
    const s = Math.hypot(M[0], M[1]), [fx, fy] = v.foot;
    const [x, y] = at(M, v.head[0] + v.head[2] / 2 - fx, v.head[1] + v.head[3] / 2 - fy);
    heads.push([r1(x), r1(y), r1((v.head[2] / 2) * s), r2(K / s)]);
  }
  touffes[file] = heads;
});

writeFileSync(join(OUT, 'tetes.json'), JSON.stringify({ sol, touffes }));
const byFile = [0, 1, 2].map((f) => sol.filter((h) => h[4] === f).length);
console.log(`tetes.json: ${sol.length} têtes au sol (loin ${byFile[0]}, milieu ${byFile[1]}, près ${byFile[2]}), ` +
  `${Object.values(touffes).reduce((a, h) => a + h.length, 0)} dans ${Object.keys(touffes).length} touffes`);
