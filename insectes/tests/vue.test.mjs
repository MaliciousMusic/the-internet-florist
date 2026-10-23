// node --test tests/vue.test.mjs : the view picked for an orientation matches the engine camera.
import test from 'node:test';
import assert from 'node:assert/strict';
import { bodyFrame, viewOf } from '../runtime/vue.mjs';
import { camera } from '../moteur/geo.mjs';

const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;

test('heading right, upright: the viewer sees the right side (az 270), sprite upright', () => {
  const v = viewOf(bodyFrame([1, 0, 0]));
  assert.ok(near(v.az, 270), v.az); assert.ok(near(v.el, 0)); assert.ok(near(v.rotation, 0));
});

test('heading toward the viewer: the face (az 0)', () => {
  const v = viewOf(bodyFrame([0, 0, 1]));
  assert.ok(near(v.az, 0) || near(v.az, 360), v.az);
});

test('seen from above when the bee flies straight down the screen depth', () => {
  const v = viewOf(bodyFrame([0, 0, -1], 0, [0, 1, 0]), [0, 1, 0]);
  assert.ok(near(v.el, 90, 1e-4), v.el);
});

test('banking toward the viewer turns the sprite in the screen plane; across the screen it shows back or belly', () => {
  const facing = viewOf(bodyFrame([0, 0, 1], 0.4));
  assert.ok(near(Math.abs(facing.rotation), 0.4, 1e-6), facing.rotation);
  const across = viewOf(bodyFrame([1, 0, 0], 0.4));
  assert.ok(near(Math.abs(across.el), 0.4 * 180 / Math.PI, 1e-6), across.el);
  assert.ok(near(across.rotation, 0, 1e-6), across.rotation);
});

test('any orientation: the view vector rebuilt from (az, el) is the eye in the body frame', () => {
  for (let i = 0; i < 200; i++) {
    const f = [Math.sin(i), Math.cos(i * 1.7), Math.sin(i * 0.3)];
    const fr = bodyFrame(f, (i % 7) * 0.2);
    const v = viewOf(fr);
    const c = camera(v.az, v.el).c;
    const cb = [fr.f[2], fr.l[2], fr.u[2]]; // eye = +Z
    for (let k = 0; k < 3; k++) assert.ok(near(c[k], cb[k], 1e-6));
  }
});

import { pickCell } from '../runtime/vue.mjs';

test('views past 180 are mirrored, and a mirrored walk swaps its tripods (half a cycle)', () => {
  const keys = {};
  let i = 0;
  for (const f of [0, 1, 2, 3, 4, 5, 6, 7]) for (const az of [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180]) keys[`marche/${f}/${az}/0`] = i++;
  const lod = { az: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180], keys };
  const a = pickCell(lod, [0], 'marche', 1, 8, { az: 272, el: 3 });
  assert.equal(a.flip, true); assert.equal(a.az, 90); assert.equal(a.i, keys['marche/5/90/0']);
  const b = pickCell(lod, [0], 'marche', 1, 8, { az: 88, el: 3 });
  assert.equal(b.flip, false); assert.equal(b.i, keys['marche/1/90/0']);
});
