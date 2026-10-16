import { test } from "node:test";
import assert from "node:assert/strict";
import { Score, SLOT } from "../src/score.ts";
import { CATALOGUE, specimenRecipe } from "../src/catalogue.ts";
import { DAY } from "../src/model.ts";
import { fixture } from "../src/fixtures.ts";
import { isNature } from "../src/library.ts";
const pc = (hz: number) => ((Math.round(69 + 12 * Math.log2(hz / 440)) % 12) + 12) % 12;
const sharp = new Set([1,2,6,10,11]);

test("all tableau modes build internally consonant harmonic beds and structural notes belong to that bed", () => {
  for (const item of CATALOGUE) for (const harmony of ["clear", "suspended"] as const) {
    const score = new Score(specimenRecipe(item, harmony)); const at = 45 * DAY;
    for (let t = at; t < at + 100; t += SLOT) {
      const chord = score.harmonyAt(t);
      for (const a of chord.tones) for (const b of chord.tones) assert(!sharp.has(Math.abs(a - b) % 12), item.id);
    }
    for (const voice of score.voicesBetween(at, at + 100)) for (const note of voice.notes) {
      if (note.kind === "structural") assert(score.harmonyAt(note.at).tones.includes(pc(note.hz)), `${item.id}: structural pitch`);
    }
  }
});

test("the central theme repeats recognisably and its instrument stays stable across the whole form", () => {
  const score = new Score(fixture(80)); const events = score.voicesBetween(0, 3 * SLOT);
  const first = events.find(v => v.role === "theme" && v.start === 0)!;
  const next = events.find(v => v.role === "theme" && v.start === SLOT)!;
  assert(first && next); assert.deepEqual(first.notes.map(n => n.hz), next.notes.map(n => n.hz));
  const heard = new Set<string>();
  for (let at = 0; at < score.world.sectionSlots * SLOT * 8; at += 60) {
    for (const voice of score.voicesBetween(at, Math.min(at + 60, score.world.sectionSlots * SLOT * 8))) {
      if (voice.role === "theme") heard.add(voice.timbre);
    }
  }
  assert.equal(heard.size, 1);
});

test("the network changes expression and spatial response while keeping the theme in its common harmonic language", () => {
  const source = fixture(80); const original = new Score(source);
  const moved = new Score({ ...source, stems: source.stems.map((s, i) => ({ ...s,
    position: { x: -s.position.x * .2, y: s.position.y * .2, z: s.position.z * .2 },
    profile: { ...s.profile, emit: i % 2 ? .2 : .9, receive: .9 } })) });
  const theme = (score: Score) => score.voicesBetween(40 * DAY, 40 * DAY + 60).filter(v => v.role === "theme");
  const a = theme(original); const b = theme(moved);
  assert.deepEqual(a.map(v => v.notes.map(n => n.hz)), b.map(v => v.notes.map(n => n.hz)));
  assert.notDeepEqual(a.map(v => [v.gain,v.pan,v.modulation]), b.map(v => [v.gain,v.pan,v.modulation]));
});

test("pitched accompaniment clears before changing harmony; tableaux have five intentions and distinct audible phrase plans", () => {
  const emotions = new Set<string>(); const plans = new Set<string>();
  for (const item of CATALOGUE.filter(item => item.count > 1)) {
    const score = new Score(specimenRecipe(item)); const at = 45 * DAY;
    emotions.add(score.world.tableau.emotion);
    const events = score.voicesBetween(at, at + 100);
    const theme = events.find(v => v.role === "theme" && v.start >= at)!;
    plans.add(JSON.stringify([theme.timbre,theme.notes.map(n => [pc(n.hz),+(n.at-theme.start).toFixed(2)])]));
    for (const voice of events.filter(v => !isNature(v.timbre))) {
      const before = score.harmonyAt(voice.start);
      for (let slot = Math.floor(voice.start / SLOT) + 1; slot * SLOT < voice.end; slot++) {
        assert.deepEqual(score.harmonyAt(slot * SLOT).tones, before.tones, `${item.id}: old bed spans a new chord`);
      }
    }
  }
  assert.equal(emotions.size, 5); assert(plans.size >= 14);
});
