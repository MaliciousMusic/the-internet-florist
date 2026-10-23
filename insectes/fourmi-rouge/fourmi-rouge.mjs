// Red ant worker (Myrmica rubra), 4.8 mm: rusty red-brown, rugose head and mesosoma, glossy gaster, propodeal spines,
// a petiole and a postpetiole at the waist. Measures and colours: FICHE.md. Built by moteur/fourmi.mjs.
import { ant, legs, POSES } from '../moteur/fourmi.mjs';

const f = 4.8 / 4.2;
const SPEC = {
  scale: f, seed: 29, legs: legs(f), rugose: true, spines: true,
  head: '#4e1e0e', body: '#6a2a12', gaster: '#6a2c12', gasterLo: '#3a160a', mandible: '#8a4220', gasterK: 0.82, trans: '#c86a2a',
  limb: '#8a4420', limbHi: '#a85a2a', limbGloss: '#e8b088', hair: '#e0c8b0',
  waist: [[0.1, 0.16, 0.13, 0.9], [-0.18, 0.14, 0.15, 0.9]], waistLen: 0.4, // petiole and postpetiole nodes
};
export const META = {
  id: 'fourmi-rouge', bodyMm: 4.8, span: 8.5,
  el: [-15, 10, 35, 60, 90], poses: POSES,
  lod: { S: { cell: 20, az: 15, poses: ['pose', 'marche'] }, L: { cell: 56, az: 30, poses: ['pose', 'marche'] } },
};
export const draw = (az, el, opts = {}) => ant(SPEC, az, el, opts);
