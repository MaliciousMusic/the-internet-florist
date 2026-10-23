// The elytra's surface as numbers for the measuring tools (outils/elytre.py): per t (apex 0 to base 1) the half-width, the crest and
// the rim heights, and the section's exponent, in mm, from the module itself, so the photos are read on the very surface drawn.
// node insectes/coccinelle/outils/surface.mjs  -> insectes/coccinelle/forme/surface.json
import { writeFileSync } from 'node:fs';
import { DIM, PRON } from '../coccinelle.mjs';
import { readFileSync } from 'node:fs';
const M = JSON.parse(readFileSync(new URL('../forme/modele.json', import.meta.url), 'utf8'));
const n = 400, T = Array.from({ length: n + 1 }, (_, i) => i / n);
const r3 = (v) => Math.round(v * 1000) / 1000;
writeFileSync(new URL('../forme/surface.json', import.meta.url), JSON.stringify({
  _doc: 'surface.mjs : la surface des élytres du module, en mm (t de l\'apex à la base)', W: r3(DIM.W), EL: r3(DIM.EL), H: r3(DIM.H),
  n_sec: M.valeurs.n_sec ?? 2.2, t: T.map(r3), demi: T.map((t) => r3(DIM.halfW(t))), crete: T.map((t) => r3(DIM.crestZ(t))), rebord: T.map((t) => r3(DIM.rimZ(t))),
  pronotum: { PW: r3(DIM.PW), PL: r3(DIM.PL), t: T.map(r3), y: T.map((t) => r3(PRON(t).y)), xc: T.map((t) => r3(PRON(t).xc)), rx: T.map((t) => r3(PRON(t).rx)) },
}));
console.log('surface', DIM.W.toFixed(2), DIM.EL.toFixed(2), DIM.H.toFixed(2));
