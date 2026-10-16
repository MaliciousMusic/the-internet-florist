import { bank } from "../tools/read-bank.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { anniversary, createProfile, DAY, freezeRecipe, lifeAt, VERSION, type Recipe } from "../src/model.ts";
import { fixture, fixtureSeed, replaceStem } from "../src/fixtures.ts";
import { voiceBudgetFor, Score } from "../src/score.ts";
import { Renderer, renderExcerpt, wav } from "../src/dsp.ts";
import { recipeHash } from "../src/identity.ts";
import { createBouquetAudio } from "../../engine/music.ts";
import { CATALOGUE, SIZES, specimenRecipe } from "../src/catalogue.ts";
import { BIOMES } from "../src/world.ts";

test("UTC calendar anniversary preserves the hour, including leap years and century rules", () => {
  for (const [from, until] of [
    ["2024-02-29T18:13:42Z", "2025-02-28T18:13:42Z"],
    ["2023-03-01T00:00:00Z", "2024-03-01T00:00:00Z"],
    ["2099-03-01T23:59:59Z", "2100-03-01T23:59:59Z"],
    ["2399-02-28T12:00:00Z", "2400-02-28T12:00:00Z"],
  ]) assert.equal(anniversary(Date.parse(from!) / 1000), Date.parse(until!) / 1000);
  assert.throws(() => anniversary(NaN));
});

test("all seed bytes contribute; profiles and the exact recipe remain immutable", () => {
  const seed = fixtureSeed(7);
  assert.deepEqual(createProfile(seed), createProfile(seed));
  assert.notDeepEqual(createProfile(seed), createProfile(seed.slice(0, -2) + (seed.endsWith("00") ? "01" : "00")));
  const source = fixture(); const recipe = freezeRecipe(source);
  assert.notEqual(recipe, source);
  assert.throws(() => { (recipe.stems[0]!.position as { x: number }).x = 0.7; });
  assert.throws(() => { (recipe.stems[0]!.profile.motif as number[]).push(1); });
});

test("reject duplicates, unknown fields, changed anniversaries, nonfinite inputs and unsupported versions", () => {
  const original = fixture(2);
  const invalid: unknown[] = [
    { ...original, version: "other" }, { ...original, session: 123 },
    { ...original, stems: [original.stems[0], original.stems[0]] },
    { ...original, stems: [{ ...original.stems[0], expiresAt: original.stems[0]!.expiresAt + 1 }] },
    { ...original, stems: [{ ...original.stems[0], position: { x: NaN, y: 0, z: 0 } }] },
    { ...original, stems: [{ ...original.stems[0], profile: { ...original.stems[0]!.profile, injected: true } }] },
    { ...original, seed: "0xBAD" }, { ...original, originAt: 1.5 },
  ];
  for (const recipe of invalid) assert.throws(() => new Score(recipe as Recipe));
});

test("neither species nor colour determine a sound profile", () => {
  const recipe = fixture(8); const changed = { ...recipe, stems: recipe.stems.map(stem => ({ ...stem, sku: 3770 })) };
  const events = (r: Recipe) => new Score(r).voicesBetween(40 * DAY, 40 * DAY + 120)
    .map(({ lifeStem: _lifeStem, ...event }) => event);
  assert.deepEqual(events(recipe), events(changed));
});

test("opening, fixed closed buds and seven final days are audible, with exact expiry", () => {
  const stem = fixture(1).stems[0]!;
  assert.equal(lifeAt(stem, stem.issuedAt - 1).strength, 0);
  assert(lifeAt(stem, stem.issuedAt + DAY).strength < lifeAt(stem, stem.issuedAt + 40 * DAY).strength);
  assert.equal(lifeAt({ ...stem, opening: { ...stem.opening, opens: false } }, stem.issuedAt + 40 * DAY).openness, 0);
  assert.equal(lifeAt(stem, stem.expiresAt - 7 * DAY).strength, 1);
  assert(lifeAt(stem, stem.expiresAt - 3 * DAY).strength < 1);
  assert.equal(lifeAt(stem, stem.expiresAt).strength, 0);
});

test("seek, reopening and different window sizes retrieve the same evolving events", () => {
  const a = new Score(fixture(80)); const b = new Score(fixture(80));
  const at = 157 * DAY + 31.33;
  assert.deepEqual(a.voicesAt(at), b.voicesAt(at));
  const wide = a.voicesBetween(at - 20, at + 20).filter(v => v.start <= at && v.end > at);
  assert.deepEqual(a.voicesAt(at), wide);
  assert.notDeepEqual(a.voicesAt(at), a.voicesAt(at + 480));
  assert.throws(() => a.voicesBetween(0, 3600));
});

test("every living flower participates together; the voice budget scales with the whole bouquet", () => {
  for (const count of [1, 2, 12, 80, 350]) {
    const score = new Score(fixture(count)); const heard = new Set<string>();
    const start = 40 * DAY;
    for (const voice of score.voicesBetween(start, start + 60)) heard.add(voice.stemId);
    assert.equal(heard.size, count);
    for (let t = start; t < start + 60; t += 0.7) {
      const voices = score.voicesAt(t); assert(voices.length <= voiceBudgetFor(count));
      if (count > 1) assert.equal(new Set(voices.map(v => v.stemId)).size, count);
    }
    assert(score.links.every(links => links.length <= 4));
  }
});

test("positions, emitter and receiver properties influence real notes and modulation", () => {
  const recipe = fixture(12); const score = new Score(recipe);
  const changed = { ...recipe, stems: recipe.stems.map((stem, i) => i === 0
    ? { ...stem, position: { x: 1, y: -1, z: 1 }, profile: { ...stem.profile, emit: 0, receive: 0 } } : stem) };
  assert.notDeepEqual(score.voicesBetween(40 * DAY, 40 * DAY + 120), new Score(changed).voicesBetween(40 * DAY, 40 * DAY + 120));
  const mutedLinks = new Score({ ...recipe, stems: recipe.stems.map(stem => ({ ...stem,
    profile: { ...stem.profile, emit: 0, receive: 0 } })) });
  assert(mutedLinks.links.flat().every(link => link.weight === 0));
  assert.notDeepEqual(score.voicesBetween(40 * DAY, 40 * DAY + 120).map(v => v.modulation),
    mutedLinks.voicesBetween(40 * DAY, 40 * DAY + 120).map(v => v.modulation));
});

test("replacing one stem changes the score while preserving the other exact profiles", () => {
  const recipe = fixture(12); const changed = replaceStem(recipe, "4");
  assert.deepEqual(recipe.stems[0]!.profile, changed.stems[0]!.profile);
  assert.notDeepEqual(new Score(recipe).voicesBetween(40 * DAY, 40 * DAY + 120),
    new Score(changed).voicesBetween(40 * DAY, 40 * DAY + 120));
});

test("PCM is finite, bounded, stereo and non-silent; rendering is independent of block history", () => {
  const score = new Score(fixture(12)); const at = 40 * DAY + 12.5;
  const [left, right] = renderExcerpt(score, at, 2, 8000, bank);
  let square = 0; let peak = 0; let stereo = 0;
  for (let i = 0; i < left.length; i++) {
    assert(Number.isFinite(left[i]));
    peak = Math.max(peak, Math.abs(left[i]!), Math.abs(right[i]!));
    square += left[i]! ** 2; stereo += Math.abs(left[i]! - right[i]!);
  }
  assert(peak < 0.8 && peak > 0.005); assert(Math.sqrt(square / left.length) > 0.002); assert(stereo > 1);
  const l = new Float32Array(128); const r = new Float32Array(128);
  new Renderer(score, bank).render(l, r, at, 8000);
  assert.deepEqual(l, left.subarray(0, 128));
  const after = new Float32Array(128); const afterR = new Float32Array(128);
  new Renderer(score, bank).render(after, afterR, at + 128 / 8000, 8000);
  for (let i = 0; i < after.length; i++) assert(Math.abs(after[i]! - left[i + 128]!) < 1e-6);
  const bytes = wav([left, right], 8000);
  assert.equal(new TextDecoder().decode(bytes.subarray(0, 4)), "RIFF");
  assert.equal(bytes.length, 44 + left.length * 4);
});

test("a finished bouquet is strictly silent, with no reflection leaking after expiry", () => {
  const recipe = fixture(12);
  const end = Math.max(...recipe.stems.map(s => s.expiresAt)) - recipe.originAt;
  const channels = renderExcerpt(new Score(recipe), end, 0.1, 8000, bank);
  assert(channels.every(channel => channel.every(sample => sample === 0)));
  const empty = renderExcerpt(new Score({ version: VERSION, seed: fixtureSeed(0), originAt: 0,
    harmony: "clear", stems: [] }), 0, 0.1, 8000, bank);
  assert(empty.every(channel => channel.every(sample => sample === 0)));
});

test("sound commitment and adapter preserve the preview, ignoring transport and input order", async () => {
  const recipe = fixture(12); const reordered = { ...recipe, stems: [...recipe.stems].reverse() };
  assert.equal(await recipeHash(recipe), await recipeHash(reordered));
  assert.notEqual(await recipeHash(recipe), await recipeHash(replaceStem(recipe, "4")));
  const adapter = createBouquetAudio(recipe, { workletUrl: "unused-in-offline-test" });
  assert.equal(await adapter.identity(), await recipeHash(recipe));
  assert.deepEqual(adapter.eventsAt(recipe.originAt + 45 * DAY), new Score(recipe).voicesAt(45 * DAY));
  adapter.volume(0.2); adapter.stop();
  assert.equal(await adapter.identity(), await recipeHash(recipe));
  assert.deepEqual(new Score(recipe).voicesBetween(45 * DAY, 45 * DAY + 120),
    new Score(reordered).voicesBetween(45 * DAY, 45 * DAY + 120));
  assert.throws(() => adapter.volume(NaN));
});

test("before its musical origin a bouquet stays silent; invalid audio requests are rejected", () => {
  const score = new Score(fixture(1));
  assert.deepEqual(score.voicesAt(-1), []);
  const channels = renderExcerpt(score, -2, 0.1, 8000, bank);
  assert(channels.every(channel => channel.every(sample => sample === 0)));
  assert.throws(() => renderExcerpt(score, 0, 500, 8000));
  assert.throws(() => renderExcerpt(score, 0, 1, NaN));
  assert.throws(() => new Renderer(score, bank).render(new Float32Array(1), new Float32Array(2), 0, 8000));
});

test("a soliflore develops a melodic contour, variations and complete breaths", () => {
  const score = new Score(fixture(1));
  const at = 45 * DAY;
  const first = score.voicesBetween(at, at + 60); const later = score.voicesBetween(at + 240, at + 300);
  assert(first.length > 0 && first.every(voice => voice.notes.length >= 4));
  assert(new Set(first.flatMap(voice => voice.notes.map(note => note.hz))).size > 2);
  assert.notDeepEqual(first.map(voice => voice.notes.map(note => note.hz)), later.map(voice => voice.notes.map(note => note.hz)));
  assert(Array.from({ length: 60 }, (_, i) => score.voicesAt(at + i).length).some(count => count === 0));
});

test("18 fixed specimens cover six sizes and fourteen worlds with distinct tonal signatures", () => {
  assert.equal(CATALOGUE.length, 18);
  const signatures = new Set<string>();
  for (const size of SIZES) {
    const specimens = CATALOGUE.filter(item => item.count === size);
    assert.equal(specimens.length, 3);
    const pitches = new Set<number>();
    for (const specimen of specimens) {
      const recipe = specimenRecipe(specimen); const score = new Score(recipe);
      assert.deepEqual(recipe, specimenRecipe(specimen));
      assert.equal(score.recipe.stems.length, size);
      assert.equal(score.world.biome.id, BIOMES[specimen.biome]!.id);
      assert(Object.isFrozen(score.world.theme));
      signatures.add(JSON.stringify([score.world.biome.id, score.root, score.world.theme]));
      if (size === 1) pitches.add(score.voicesBetween(45 * DAY, 45 * DAY + 60)[0]!.notes[0]!.hz);
      else assert(recipe.stems.some(stem => score.world.biome.palette.includes(stem.profile.timbre)));
    }
    if (size === 1) assert.equal(pitches.size, 3);
  }
  assert.equal(signatures.size, 18);
  assert.equal(new Set(CATALOGUE.filter(item => item.count > 1).map(item => item.biome)).size, 14);
});

test("large bouquets gain simultaneous voices and richer phrases, with a budget proportional to their stems", () => {
  let previousDensity = 0; let previousNotes = 0;
  for (const size of SIZES) {
    let density = 0; let notes = 0;
    for (const specimen of CATALOGUE.filter(item => item.count === size)) {
      const score = new Score(specimenRecipe(specimen)); const at = 45 * DAY + 12.5;
      const events = score.voicesBetween(at, at + 120);
      const themes = events.filter(voice => voice.role === "theme");
      // Responses deliberately shorten some phrases; compare the developed theme's available contour.
      notes += Math.max(...themes.map(voice => voice.notes.length)) / 3;
      for (let i = 0; i < 240; i++) {
        const active = score.voicesAt(at + i / 2).length;
        assert(active <= voiceBudgetFor(size)); density += active / 240 / 3;
      }
    }
    assert(density > previousDensity, `${size}: density ${density} <= ${previousDensity}`);
    if (size > 5) assert(notes > previousNotes, `${size}: notes ${notes} <= ${previousNotes}`);
    previousDensity = density; previousNotes = notes;
  }
  assert(previousDensity > 10);
  assert(previousNotes >= 8);
});

test("new palettes and world reflections produce finite distinct PCM", () => {
  const fingerprints = new Set<string>();
  for (const specimen of CATALOGUE.filter(item => item.count <= 12)) {
    const score = new Score(specimenRecipe(specimen));
    const at = score.voicesBetween(45 * DAY + 12.5, 45 * DAY + 30)[0]!.start + 0.08;
    const [left, right] = renderExcerpt(score, at, 0.12, 8000, bank);
    assert(left.every(value => Number.isFinite(value) && Math.abs(value) < 0.8));
    assert(right.every(value => Number.isFinite(value) && Math.abs(value) < 0.8));
    assert(left.some(value => value !== 0));
    fingerprints.add(Array.from(left.subarray(0, 128)).join(","));
  }
  assert.equal(fingerprints.size, 9);
});

test("dense 48 kHz playback interpolation preserves exact seeking and expiry", () => {
  const score = new Score(specimenRecipe(CATALOGUE.find(item => item.count === 80)!));
  const at = 45 * DAY + 12.5;
  const [wide] = renderExcerpt(score, at, 0.25, 48000, bank);
  const [seek] = renderExcerpt(new Score(score.recipe), at + 256 / 48000, 0.1, 48000, bank);
  for (let i = 0; i < seek.length; i++) assert(Math.abs(seek[i]! - wide[i + 256]!) < 2e-6);
  const end = Math.max(...score.recipe.stems.map(stem => stem.expiresAt)) - score.recipe.originAt;
  const expired = renderExcerpt(score, end, 0.02, 48000, bank);
  assert(expired.every(channel => channel.every(sample => sample === 0)));
});
