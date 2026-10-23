// Black garden ant worker (Lasius niger), 4.2 mm: glossy black-brown, a single upright scale at the waist.
// Measures and colours: FICHE.md. Built by moteur/fourmi.mjs.
import { ant, legs, POSES } from '../moteur/fourmi.mjs';

const f = 1;
const SPEC = {
  scale: f, seed: 23, legs: legs(f),
  head: '#211c19', body: '#241e1a', gaster: '#1e1916', gasterLo: '#3a302a', mandible: '#6a4a2a',
  limb: '#2e2420', limbHi: '#4a3a2e', limbGloss: '#8a7a6a', hair: '#c8c0b0',
  waist: [[0.12, 0.16, 0.16, 0.4]], // one thin upright scale
};
export const META = {
  id: 'fourmi-noire', bodyMm: 4.2, span: 7.5,
  el: [-15, 10, 35, 60, 90], poses: POSES,
  lod: { S: { cell: 20, az: 15, poses: ['pose', 'marche'] }, L: { cell: 56, az: 30, poses: ['pose', 'marche'] } },
};
export const draw = (az, el, opts = {}) => ant(SPEC, az, el, opts);
