// Red ant worker (Myrmica rubra), 4.8 mm: rusty red-brown, rugose head and mesosoma, glossy gaster, propodeal spines,
// a petiole and a postpetiole at the waist. Measures and colours: FICHE.md. Built by moteur/fourmi.mjs.
import { ant, legs, POSES } from '../moteur/fourmi.mjs';

const f = 4.8 / 4.2;
const SPEC = {
  scale: f, seed: 29, legs: legs(f), rugose: true, spines: true,
  head: '#6e2c16', body: '#7a3218', gaster: '#9a4424', gasterLo: '#6a2a14', mandible: '#a8582a',
  limb: '#a24e26', limbHi: '#b8643a', limbGloss: '#e8b088', hair: '#e0c8b0',
  waist: [[0.12, 0.12, 0.12, 0.9], [-0.1, 0.1, 0.13, 0.9]], // petiole and postpetiole nodes
};
export const META = {
  id: 'fourmi-rouge', bodyMm: 4.8, span: 8.5,
  el: [-15, 10, 35, 60, 90], poses: POSES,
  lod: { S: { cell: 20, az: 15, poses: ['pose', 'marche'] }, L: { cell: 56, az: 30, poses: ['pose', 'marche'] } },
};
export const draw = (az, el, opts = {}) => ant(SPEC, az, el, opts);
