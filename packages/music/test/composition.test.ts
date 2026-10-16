import { test } from "node:test";
import assert from "node:assert/strict";
import { harmonyFor, planLine, phrasePoints, type PhrasePoint, type TimedPitch } from "../src/composition.ts";
import { sceneFor } from "../src/conductor.ts";
import { fixture } from "../src/fixtures.ts";
import { Score, SLOT } from "../src/score.ts";
import { DAY } from "../src/model.ts";
import { CATALOGUE, specimenRecipe } from "../src/catalogue.ts";
import { Renderer, renderExcerpt } from "../src/dsp.ts";
import { bank } from "../tools/read-bank.ts";
import { grainSample } from "../src/granular.ts";

const home = () => ({ bass: 48, tones: [0, 4, 7], tension: .1, arrival: true, name: "Repos" });
const point = (at: number, duration: number, strong = true): PhrasePoint => ({ at, duration, accent: .5, strong });
const held = (at: number, duration: number, midi: number): TimedPitch => ({ ...point(at, duration), midi, release: 0, kind: "structural" });

test("harmonic paths stay in the world's mode, move and prepare a home arrival", () => {
  for (const specimen of CATALOGUE.filter(item => item.count > 1)) {
    const score = new Score(specimenRecipe(specimen));
    const frames = Array.from({ length: score.world.sectionSlots }, (_, slot) => harmonyFor(score.world, score.recipe.seed, slot));
    assert(new Set(frames.map(frame => frame.bass)).size >= 2, specimen.id);
    for (const frame of frames) assert(frame.tones.every(pc => score.world.scale.includes(((pc - score.root) % 12 + 12) % 12)));
    assert(frames.at(-1)!.arrival); assert.equal(frames.at(-1)!.bass, score.root - 12);
    assert.deepEqual(score.harmonyAt(71 * DAY), new Score(score.recipe).harmonyAt(71 * DAY));
  }
});

test("voice rhythms are independent, expressive and lengthen the cadence", () => {
  const score = new Score(fixture(12)); const profile = score.recipe.stems[0]!.profile;
  const scene = sceneFor(score.world, score.recipe.seed, score.world.sectionSlots - 1);
  const lead = phrasePoints(profile, score.world, scene, "theme", 0, 0, 6, 8);
  const counter = phrasePoints(profile, score.world, scene, "counter", 1, 0, 6, 8);
  assert.notDeepEqual(lead.map(n => n.at), counter.map(n => n.at));
  assert(lead.at(-1)!.duration > lead[1]!.duration * 1.5);
  assert(new Set(lead.map(n => n.accent)).size >= 3);
  assert(lead.every(n => n.at >= 0 && n.at + n.duration <= 6 + .035));
});

test("counterpoint examines sustained overlaps rather than only corresponding note indices", () => {
  const line = planLine({ targets: [61, 64, 67], points: [point(.1, .6), point(1.1, .6), point(2.1, .6)],
    candidates: [59, 60, 62, 64, 67], occupied: [held(0, 3, 60)], role: "counter", release: 0, harmony: home });
  assert(line.notes.length === 3); assert(line.alternatives > line.notes.length * 2);
  for (const note of line.notes) assert([0, 3, 4, 5, 7, 8, 9].includes(Math.abs(note.midi - 60) % 12));
  const impossible = planLine({ targets: [61], points: [point(.1, 1)], candidates: [61],
    occupied: [held(0, 3, 60)], role: "counter", release: 0, harmony: home });
  assert.equal(impossible.notes.length, 0);
});

test("brief passing notes resolve by step and an unsupported dissonance becomes a rest", () => {
  const line = planLine({ targets: [60, 64, 62, 60], points: [point(0, .1), point(.2, .1), point(.4, .1, false), point(.6, .1)],
    candidates: [60, 62, 64], occupied: [held(0, 2, 60)], role: "counter", release: 0, harmony: home });
  assert.deepEqual(line.notes.map(n => n.midi), [60, 64, 62, 60]);
  assert.equal(line.notes[2]!.kind, "passing"); assert.equal(line.notes[3]!.kind, "structural");
  const unresolved = planLine({ targets: [64, 62], points: [point(0, .1), point(.3, .1, false)],
    candidates: [60, 62, 64], occupied: [held(0, 2, 60)], role: "counter", release: 0, harmony: () => ({ ...home(), arrival: false }) });
  assert(!unresolved.notes.some(n => n.kind !== "structural"));
});

test("a prepared suspension resolves downward against the new held note", () => {
  const line = planLine({ targets: [64, 64, 62], points: [point(.1, .1), point(.35, .1), point(.7, .1)],
    candidates: [62, 64], occupied: [held(0, .29, 60), held(.3, 1, 62)], role: "counter", release: 0,
    harmony: time => time < .3 ? { ...home(), arrival: false }
      : { bass: 50, tones: [2,5,9], tension: .2, arrival: false, name: "New harmony" } });
  assert.deepEqual(line.notes.map(n => n.midi), [64, 64, 62]);
  assert.equal(line.notes[1]!.kind, "suspension"); assert.equal(line.notes[2]!.kind, "structural");
});

test("real bouquet writing yields independent timings and reproducible full-phrase choices", () => {
  const score = new Score(specimenRecipe(CATALOGUE.find(item => item.count === 80)!)); const at = 45 * DAY;
  const events = score.voicesBetween(at, at + 120); const lead = events.find(v => v.role === "theme" && v.start >= at
    && events.some(other => other.role === "counter" && other.id.split(":")[0] === v.id.split(":")[0]))!;
  const counter = events.find(v => v.role === "counter" && v.id.split(":")[0] === lead.id.split(":")[0])!;
  assert(counter); assert.notDeepEqual(lead.notes.map(n => n.at - lead.start), counter.notes.map(n => n.at - counter.start));
  assert(events.every(v => Number.isFinite(v.writing.cost)));
  assert(events.filter(v => ["theme", "counter", "answer"].includes(v.role)).every(v => v.writing.alternatives > 0));
  assert(events.some(v => new Set(v.notes.map(n => n.velocity)).size >= 3));
  assert.deepEqual(events, new Score(score.recipe).voicesBetween(at, at + 120));
});

test("grains have smooth boundaries, bounded output and stable pitch independent of scan speed", () => {
  const rate = 24000; const frequency = 220;
  const pcm = Int16Array.from({ length: rate }, (_, i) => Math.round(20000 * Math.sin(i / rate * frequency * Math.PI * 2)));
  const settings = { mix: .3, length: .16, scan: .23, scatter: .07 };
  let crossings = 0; let previous = 0; let maxJump = 0;
  for (let i = 0; i < 4800; i++) {
    const age = .5 + i / rate;
    const sample = grainSample(pcm, rate, rate * 2, age, settings, 0, 912, rate / frequency);
    assert(Number.isFinite(sample) && Math.abs(sample) < .62);
    if (previous < 0 && sample >= 0) crossings++;
    maxJump = Math.max(maxJump, Math.abs(sample - previous)); previous = sample;
    assert(Math.abs(sample - grainSample(pcm, rate, rate * 2, age, { ...settings, scan: .71 }, 0, 912, rate / frequency)) < .002);
  }
  assert(Math.abs(crossings / .2 - 440) < 10); assert(maxJump < .09);
});

test("granular textures differ audibly while remaining stateless on seek and silent at expiry", () => {
  const source = fixture(1); const stem = source.stems[0]!;
  const score = new Score({ ...source, stems: [{ ...stem, profile: { ...stem.profile, timbre: "stream" } }] });
  const at = score.voicesBetween(45 * DAY, 45 * DAY + 60)[0]!.start + .6;
  const [whole] = renderExcerpt(score, at, .2, 24000, bank);
  const [seek] = renderExcerpt(new Score(score.recipe), at + 128 / 24000, .1, 24000, bank);
  for (let i = 0; i < seek.length; i++) assert(Math.abs(seek[i]! - whole[i + 128]!) < 1e-6);
  const dryScore = new Score(score.recipe); const voices = dryScore.voicesBetween(0, 1);
  assert.equal(voices.length, 1); assert(voices[0]!.granular);
  const original = dryScore.voicesBetween.bind(dryScore);
  dryScore.voicesBetween = (from, until) => original(from, until).map(v => ({ ...v, granular: null }));
  const [dry] = renderExcerpt(dryScore, at, .2, 24000, bank);
  assert(whole.some((n, i) => Math.abs(n - dry[i]!) > 1e-5));
  const end = stem.expiresAt - source.originAt;
  assert(renderExcerpt(score, end, .02, 24000, bank).every(channel => channel.every(n => n === 0)));
});

test("an earlier long note keeps sounding beneath a shorter intervening note", () => {
  const score = new Score(fixture(1)); const voice = score.voicesBetween(0, 60)[0]!;
  const note = voice.notes[0]!;
  const heldVoice = { ...voice, start: 0, end: 6, notes: [
    { ...note, at: 0, duration: 5 }, { ...note, at: .2, duration: .1 }, { ...note, at: 4, duration: .1 }] };
  score.voicesBetween = () => [heldVoice];
  const left = new Float32Array(128); const right = new Float32Array(128);
  new Renderer(score, bank).render(left, right, 1, 24000);
  assert(left.some(n => Math.abs(n) > 1e-5));
  assert(SLOT > heldVoice.end);
});
