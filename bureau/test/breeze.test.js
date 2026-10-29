import { test } from 'node:test';
import assert from 'node:assert/strict';
import { angle, parseLayer, transform } from '../ui/js/breeze.js';
import { safeHref } from '../ui/js/clean.js';

test('reads the marks of the swaying layers', () => {
  assert.deepEqual(parseLayer('1.2,500,900,120'), { a: 1.2, x: 500, y: 900, lag: 120 });
  assert.deepEqual(parseLayer('1,2,3'), { a: 1, x: 2, y: 3, lag: 0 });
  assert.equal(parseLayer(null), null);
  assert.equal(parseLayer('1,2'), null);
  assert.equal(parseLayer('1,x,3'), null);
});

test('the breeze rises gently and stays within the amplitude', () => {
  const l = { a: 2, x: 0, y: 0, lag: 0 };
  assert.equal(angle(l, 0), 0);
  let max = 0;
  for (let t = 0; t < 120000; t += 37) max = Math.max(max, Math.abs(angle(l, t)));
  assert.ok(max <= 2 && max > 1.2, `max ${max}`);
  // a lagging layer waits for the wind
  assert.equal(angle({ ...l, lag: 1000 }, 900), 0);
});

test('the same moment gives the same picture as the « Vase animé » file', () => {
  const l = { a: 1.5, x: 512.4, y: 980, lag: 60 };
  const t = 7321;
  const u = t - l.lag;
  const k = (0.7 * Math.sin(u * 0.000898) + 0.3 * Math.sin(u * 0.00203 + 1.3)) * Math.min(Math.min(1, t / 4000), Math.max(0, u / 4000));
  assert.equal(transform(l, t), `rotate(${(l.a * k).toFixed(3)} 512.4 980)`);
});

test('only links inside the drawing or embedded pictures stay', () => {
  assert.ok(safeHref('#grad3'));
  assert.ok(safeHref(' data:image/png;base64,AAA'));
  assert.ok(!safeHref('javascript:alert(1)'));
  assert.ok(!safeHref('https://exemple.org/x.svg#a'));
  assert.ok(!safeHref('data:image/svg+xml;base64,AAA'));
  assert.ok(!safeHref('data:text/html,<b>'));
});

import { isQuiet, placeOf, plan, usesOf } from '../ui/js/layers.js';

test('the drawing is cut into still and swaying layers, in painting order', () => {
  const P = (xml, bz = null, quiet = false, ids = []) => ({ xml, bz, quiet, ids, uses: usesOf(xml) });
  const layers = plan('<svg>', [
    P('<defs/>', null, true),
    P('<g id="a"><use href="#z"/></g>', null, false, ['a']),
    P('<g b/>'),
    P('<g s1 fill="url(#a)"/>', '1,2,3'),
    P('<g c/>'),
    P('<g s2/>', '1,2,3'),
    P('<g s3/>', '0.5,2,3'),
    P('<g id="z"/>', null, false, ['z']),
  ]);
  assert.deepEqual(layers.map(l => l.bz), [null, '1,2,3', null, '1,2,3', '0.5,2,3', null]);
  assert.equal(layers[0].svg, '<svg><defs/><g id="a"><use href="#z"/></g><g b/><g visibility="hidden"><g id="z"/></g></svg>');
  // a layer keeps hidden what it points at, and what that points at; the others drop it
  assert.equal(layers[1].svg, '<svg><defs/><g visibility="hidden"><g id="a"><use href="#z"/></g></g><g s1 fill="url(#a)"/><g visibility="hidden"><g id="z"/></g></svg>');
  assert.equal(layers[3].svg, '<svg><defs/><g s2/></svg>');
  assert.deepEqual(usesOf('<path fill="url(#g1)" xlink:href="#u2" href="#g1"/>'), ['g1', 'u2']);
  assert.equal(plan('<svg>', [P('<defs/>', null, true)]).length, 0);
  assert.ok(isQuiet('linearGradient') && isQuiet('defs') && !isQuiet('g') && !isQuiet('path'));
});

test('the picture keeps the bouquet standing on the bottom, centred', () => {
  assert.deepEqual(placeOf([0, 0, 100, 200], 100, 400), { s: 1, ox: 0, oy: 200 });
  assert.deepEqual(placeOf([10, 10, 100, 100], 300, 100), { s: 1, ox: 100, oy: 0 });
});
