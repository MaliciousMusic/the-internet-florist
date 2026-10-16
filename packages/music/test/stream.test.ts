import { test } from "node:test";
import assert from "node:assert/strict";
import { Score } from "../src/score.ts";
import { StreamScore } from "../src/stream-score.ts";
import { fixture } from "../src/fixtures.ts";
import { DAY } from "../src/model.ts";
import { Renderer, renderExcerpt } from "../src/dsp.ts";
import { bank } from "../tools/read-bank.ts";

test("prepared windows render the same PCM as direct composition across a refill", () => {
  const score = new Score(fixture(80)); const at = 45 * DAY + 12.5;
  const stream = new StreamScore(score.recipe);
  stream.append({ from: at, until: at + 14, voices: score.voicesBetween(at, at + 14) }, at);
  const renderer = new Renderer(stream, bank);
  const left = new Float32Array(128); const right = new Float32Array(128);
  renderer.render(left, right, at + 8, 48000);
  const [reference] = renderExcerpt(score, at + 8, 128 / 48000, 48000, bank);
  assert.deepEqual(left, reference);
  stream.append({ from: at + 7, until: at + 21, voices: score.voicesBetween(at + 7, at + 21) }, at + 7);
  renderer.render(left, right, at + 14, 48000);
  const [refill] = renderExcerpt(score, at + 14, 128 / 48000, 48000, bank);
  assert.deepEqual(left, refill);
  assert.equal(new Set(stream.voicesBetween(at + 8, at + 12).map(v => v.id)).size, stream.voicesBetween(at + 8, at + 12).length);
});

test("the stream discards obsolete voices and rejects unknown stems and oversized windows", () => {
  const score = new Score(fixture(12)); const at = 45 * DAY; const stream = new StreamScore(score.recipe);
  stream.append({ from: at, until: at + 14, voices: score.voicesBetween(at, at + 14) }, at);
  stream.append({ from: at + 90, until: at + 104, voices: score.voicesBetween(at + 90, at + 104) }, at + 90);
  assert.equal(stream.voicesBetween(at, at + 10).length, 0);
  assert.throws(() => stream.append({ from: at, until: at + 31, voices: [] }, at));
  const voice = score.voicesBetween(at, at + 14)[0]!;
  assert.throws(() => stream.append({ from: at, until: at + 14, voices: [{ ...voice, stemId: "unknown" }] }, at));
});
