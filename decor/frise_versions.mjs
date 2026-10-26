// frise_versions.mjs: stamps the frieze's manifest (out/frise/frise.json) with a short digest of each file it points to
// (each strip tile, each pillar, each compiled preview), so that the page asks for a file again whenever it changes
// (frise.js adds ?v=<digest> to its address). Without it a browser could keep an old picture under a new box: on
// 2026-10-26 the clumps baked down to y 1460 showed shifted and cut under their previous manifest.
//
//   node decor/frise_versions.mjs        (frise_tuiles.mjs and frise_cuisson.mjs call stamp() themselves)
//
// frise.json gets: bandes[].tuiles[j] = [x, w, v]; piliers[i].v; apercus/apercu src "<path>?v=<digest>".
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const digest = (file) => (existsSync(file) ? createHash('md5').update(readFileSync(file)).digest('hex').slice(0, 8) : null);
const bare = (src) => src.replace(/\?v=[0-9a-f]+$/, '');

export function stamp(M, dir) {
  for (const B of M.bandes) {
    B.tuiles.forEach((t, j) => (t[2] = digest(join(dir, B.id, `${j}.svg`))));
    for (const a of B.apercus || []) if (a) a[0] = `${bare(a[0])}?v=${digest(join(dir, bare(a[0])))}`;
  }
  for (const P of M.piliers) {
    P.v = digest(join(dir, P.src));
    if (P.apercu) P.apercu[0] = `${bare(P.apercu[0])}?v=${digest(join(dir, bare(P.apercu[0])))}`;
  }
  return M;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'out', 'frise');
  const f = join(dir, 'frise.json');
  writeFileSync(f, JSON.stringify(stamp(JSON.parse(readFileSync(f, 'utf8')), dir)));
  console.log('frise.json : empreintes posées');
}
