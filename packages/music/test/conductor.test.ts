import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture } from "../src/fixtures.ts";
import { Score, SLOT } from "../src/score.ts";
import { DAY } from "../src/model.ts";
import { counterline, FORM } from "../src/conductor.ts";
import { instrumentFor } from "../src/library.ts";
import { CATALOGUE, specimenRecipe } from "../src/catalogue.ts";

test("the long form develops a second theme, rests and returns without depending on playback history", () => {
  const score = new Score(fixture(80)); const period = score.world.sectionSlots * SLOT;
  const scenes = Array.from({ length: 8 }, (_, i) => score.sceneAt(i * period + .001));
  assert.deepEqual(scenes.map(scene => scene.name), FORM.map(part => part.name));
  assert.equal(scenes[0]!.theme, "A"); assert.equal(scenes[3]!.theme, "B"); assert.equal(scenes[6]!.theme, "A");
  assert(scenes[5]!.density < scenes[4]!.density / 2);
  assert.equal(score.world.theme.length, score.world.answer.length); assert(score.world.theme.length >= 8);
  assert.notDeepEqual(score.world.theme, score.world.answer);
  const seek = 173 * DAY + 17.28;
  score.voicesBetween(3 * DAY, 3 * DAY + 120);
  assert.deepEqual(score.voicesAt(seek), new Score(score.recipe).voicesAt(seek));
});

test("counterpoint keeps consonances, contrary or oblique movement and avoids parallel fifths", () => {
  const lead = [72, 74, 76, 74, 72, 71, 72, 76];
  const candidates = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72];
  const line = counterline(lead, lead.map(midi => midi - 8), candidates);
  let independent = 0;
  for (let i = 0; i < line.length; i++) {
    const interval = Math.abs(lead[i]! - line[i]!) % 12;
    assert([3, 4, 7, 8, 9].includes(interval));
    if (i) {
      const leadMotion = Math.sign(lead[i]! - lead[i - 1]!); const counterMotion = Math.sign(line[i]! - line[i - 1]!);
      if (leadMotion !== counterMotion) independent++;
      const prior = Math.abs(lead[i - 1]! - line[i - 1]!) % 12;
      assert(!(interval === 7 && prior === 7 && leadMotion === counterMotion && leadMotion !== 0));
    }
  }
  assert(independent >= 3); assert.notDeepEqual(line.map((note, i) => note - lead[i]!), Array(line.length).fill(-7));
});

test("orchestration keeps a stable lead within a section and gives large bouquets more independent roles", () => {
  const peaks: number[] = [];
  for (const count of [5, 12, 40, 80]) {
    const score = new Score(specimenRecipe(CATALOGUE.find(item => item.count === count)!));
    const start = (Math.floor(45 * DAY / SLOT / score.world.sectionSlots / 8) * 8 + 4) * score.world.sectionSlots * SLOT + .001;
    const events = score.voicesBetween(start, start + score.world.sectionSlots * SLOT - .01);
    const theme = events.filter(voice => voice.role === "theme" && voice.start >= start);
    assert(theme.length >= 3); assert.equal(new Set(theme.map(voice => voice.stemId)).size, 1);
    const peak = Math.max(...Array.from({ length: 60 }, (_, i) => score.voicesAt(start + i / 2)
      .filter(voice => ["theme", "counter", "answer"].includes(voice.role)).length));
    peaks.push(peak);
    assert(peak <= 12);
    for (const voice of events) for (const note of voice.notes) {
      const midi = 69 + 12 * Math.log2(note.hz / 440); const range = instrumentFor(voice.timbre).range;
      assert(midi >= range[0] - 1e-6 && midi <= range[1] + 1e-6);
      assert(note.velocity >= .24 && note.velocity <= .82);
    }
  }
  assert(peaks[0]! < peaks.at(-1)!); assert(peaks.at(-1)! >= 4);
});

test("breathing sections soften the layers while keeping every flower connected", () => {
  const score = new Score(fixture(350)); const section = score.world.sectionSlots * SLOT;
  const density = (start: number): number => Array.from({ length: 20 }, (_, i) => score.voicesAt(start + 5 + i / 2)
    .reduce((sum, v) => sum + v.gain, 0)).reduce((sum, gain) => sum + gain, 0) / 20;
  assert(density(section * 5) < density(section * 4) * .75);
  const heard = new Set<string>();
  for (const voice of score.voicesAt(section * 5 + 10)) heard.add(voice.stemId);
  assert.equal(heard.size, 350);
});

test("newly opening and fading flowers change the ensemble without resetting musical time", () => {
  const source = fixture(12); const at = 10 * DAY;
  const recipe = { ...source, stems: source.stems.map((stem, i) => i ? stem : { ...stem,
    opening: { ...stem.opening, from: source.originAt + at - 60, until: source.originAt + at + 60 } }) };
  const score = new Score(recipe);
  assert.deepEqual(score.sceneAt(at), new Score(recipe).sceneAt(at));
  const end = recipe.stems[0]!.expiresAt - recipe.originAt;
  assert(!score.voicesAt(end).some(voice => voice.stemId === recipe.stems[0]!.id));
  assert(score.voicesBetween(at, at + 180).some(voice => voice.stemId === recipe.stems[0]!.id));
});

test("individual registers remain audible when both contours fit the instrument", () => {
  const source = fixture(1); const stem = source.stems[0]!;
  const recipe = (register: number) => ({ ...source, stems: [{ ...stem, profile: { ...stem.profile, timbre: "halo" as const, register } }] });
  const low = new Score(recipe(0)).voicesBetween(0, 60)[0]!;
  const high = new Score(recipe(1)).voicesBetween(0, 60)[0]!;
  assert.equal(low.notes.length, high.notes.length);
  assert(high.notes.some((note, i) => note.hz > low.notes[i]!.hz * 1.5));
});
