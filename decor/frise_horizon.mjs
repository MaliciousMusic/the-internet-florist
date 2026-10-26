// frise_horizon.mjs: the horizon of the catalogue frieze (frise.mjs HORIZON), one looping strip drawn by horizon.mjs
// at the width of its loop, the opening pillar's axis at HORIZON.cx: out/frise/src/horizon.svg. Same seed and sky as
// the single scene's horizon (seed 1, sky #dde6ee at the horizon line, the sky of ciel.svg).
//
//   node decor/frise_horizon.mjs [--out <file>]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { horizon } from './horizon.mjs';
import { HORIZON } from './frise.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const out = a.includes('--out') ? a[a.indexOf('--out') + 1] : join(HERE, 'out', 'frise', 'src', 'horizon.svg');
const t0 = performance.now();
const svg = horizon(1, { sky: '#dde6ee', largeur: HORIZON.w + 2 * HORIZON.margin, axe: HORIZON.cx });
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, svg);
console.log(`${out}: ${HORIZON.w + 2 * HORIZON.margin} u, ${(svg.length / 1024).toFixed(0)} Ko, ${(gzipSync(svg, { level: 9 }).length / 1024).toFixed(1)} Ko gzip, ${Math.round(performance.now() - t0)} ms`);
