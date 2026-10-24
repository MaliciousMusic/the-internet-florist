// The render of one membrane wing alone, flat and face on, over the plate's measured colour, in the frame and scale of its
// flattened photo (membrane.py plat), for membrane.py paire.
// node aile-plat.mjs <fore|hind> <record.json> <plate #hex> <out.png>
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { espece } from '../../outils/espece.mjs';
import { Scene, drawWing } from '../../moteur/insecte.mjs';
import { camera } from '../../moteur/geo.mjs';
const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');

const [which, recp, plate, out] = process.argv.slice(2);
const { WINGS } = await espece('abeille');
const rec = JSON.parse(readFileSync(recp, 'utf8'));
const [s0, q1] = rec.origine, r = rec.r, [W, H] = rec.taille;
// seen from above (el 90): screen x is the model's y, screen up its -x; the wing laid with s along y and q along -x
const sc = new Scene(camera(0, 90), r, -s0 * r, q1 * r, 1, 'p');
const w = WINGS[which];
drawWing(sc, { ...w, irid: 0 }, [0, 0, 0], [0, 1, 0], [-1, 0, 0], {});
writeFileSync(out, new Resvg(sc.svg(W, H, plate)).render().asPng());
console.log(out, W, H);
