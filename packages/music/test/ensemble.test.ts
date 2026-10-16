import { test } from "node:test";
import assert from "node:assert/strict";
import { Score, SLOT } from "../src/score.ts";
import { fixture } from "../src/fixtures.ts";
import { DAY } from "../src/model.ts";
import { bank } from "../tools/read-bank.ts";
import { Renderer, renderExcerpt } from "../src/dsp.ts";
import { prepareAudio } from "../src/prepared-audio.ts";
import { PcmStream, PCM_RATE } from "../src/pcm-stream.ts";

test("the whole bouquet has simultaneous parts and melodic flowers stay connected during their rests", () => {
  for (const count of [5,12,80,350]) {
    const score = new Score(fixture(count)); const at = 45 * DAY;
    for (let offset = 0; offset < 30; offset += .37) {
      const events = score.voicesAt(at + offset);
      assert.equal(new Set(events.map(v => v.stemId)).size, count);
      for (const v of events) assert(v.notes.length && v.gain > 0);
    }
    if (count >= 80) {
      const events = score.voicesBetween(at, at + 30);
      const roles = new Set<string>(events.map(v => v.role));
      for (const role of ["theme","counter","pulse","choir","drone","bass","effect"]) assert(roles.has(role), role);
      const pulse = events.find(v => v.role === "pulse")!; const choir = events.find(v => v.role === "choir")!;
      assert(pulse.notes.length >= 2); assert(choir.notes[0]!.duration > SLOT * .9);
      assert(pulse.notes.every(n => n.duration < choir.notes[0]!.duration / 8));
    }
  }
});

test("choir and drone parts remain audibly sustained long after an instrument's transient", () => {
  const score = new Score(fixture(80)); const base = Math.ceil(45 * DAY / SLOT) * SLOT;
  for (const role of ["choir","drone"] as const) {
    const voices = score.voicesBetween(base, base + SLOT).filter(v => v.role === role && v.start === base);
    assert(voices.length);
    const renderer = new Renderer({ recipe: score.recipe, world: score.world,
      voicesBetween: (from, until) => voices.filter(v => v.start < until && v.end > from) }, bank);
    const left = new Float32Array(4800); const right = new Float32Array(4800);
    renderer.render(left, right, base + 4.5, 24000);
    const rms = Math.sqrt(left.reduce((sum, value) => sum + value * value, 0) / left.length);
    assert(rms > .0002 && rms < .3, `${role}: ${rms}`);
    assert(left.every(Number.isFinite));
  }
});

test("prepared full-ensemble PCM matches direct seeking and overlapping refills, expires and bounds its queue", () => {
  const score = new Score(fixture(12)); const at = 45 * DAY + 12.5;
  const stream = new PcmStream(100 * DAY); stream.append(prepareAudio(score, at, at + .9, bank), at);
  const left = new Float32Array(128); const right = new Float32Array(128);
  const check = (time: number) => {
    stream.render(left, right, time, 48000);
    const reference = renderExcerpt(score, time, 128 / 48000, 48000, bank);
    for (let i = 0; i < left.length; i++) {
      assert(Math.abs(left[i]! - reference[0][i]!) < .00003);
      assert(Math.abs(right[i]! - reference[1][i]!) < .00003);
    }
  };
  check(at + .17); stream.append(prepareAudio(score, at + .4, at + 1.3, bank), at + .4);
  check(at + .72); check(at + 1.1);
  stream.render(left, right, at + 5, 48000); assert(left.every(n => n === 0));
  assert.throws(() => stream.append({ firstFrame: 0, left: new Float32Array(31 * PCM_RATE), right: new Float32Array(31 * PCM_RATE) }, at));
  const expired = new PcmStream(1); const ones = new Float32Array(30000).fill(.1);
  expired.append({ firstFrame: 0, left: ones, right: ones }, 0);
  expired.render(left, right, 1, 48000); assert(left.every(n => n === 0) && right.every(n => n === 0));
});
