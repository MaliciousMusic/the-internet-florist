import { test } from "node:test";
import assert from "node:assert/strict";
import { CONNECTED_CATALOGUE,connectedRecipe } from "../src/connected-catalogue.ts";
import { ConnectedScore } from "../src/connected-score.ts";
import { renderConnected } from "../src/connected-dsp.ts";
import { DAY,createProfile } from "../src/model.ts";
import { fixture,fixtureSeed } from "../src/fixtures.ts";
import { instrumentFor } from "../src/library.ts";
import { bank } from "../tools/read-bank.ts";

test("ten connected recipes conserve every exact profile and SKU while developing distinct scores",() => {
  const signatures = [];
  for (const specimen of CONNECTED_CATALOGUE) {
    const recipe = connectedRecipe(specimen); const score = new ConnectedScore(recipe);
    const time = recipe.originAt + Math.ceil(45 * DAY / score.world.cycleSeconds) * score.world.cycleSeconds;
    const notes = score.notesBetween(time,time + score.world.cycleSeconds);
    assert.equal(new Set(notes.map(note => note.stemId)).size,specimen.count);
    assert(new Set(recipe.stems.map(stem => stem.sku)).size >= 5);
    for (const part of score.parts) {
      const stem = recipe.stems.find(stem => stem.id === part.stemId)!;
      assert.deepEqual(score.recipe.stems.find(item => item.id === stem.id)!.profile,stem.profile);
      assert.equal(part.timbre,stem.profile.timbre); assert.equal(part.sku,stem.sku);
      assert.equal(part.links.length,Math.min(4,specimen.count - 1));
    }
    for (const note of notes) if (note.midi !== null) {
      const range = instrumentFor(note.timbre).range;
      assert(note.midi >= range[0] && note.midi <= range[1]);
      assert.equal(note.sku,recipe.stems.find(stem => stem.id === note.stemId)!.sku);
    }
    signatures.push(JSON.stringify({ cells: score.world.cells,key: score.world.tonic,meter: score.world.meter }));
  }
  assert.equal(new Set(signatures).size,10);
});

test("input order and SKU changes cannot substitute a sound identity or alter the musical network",() => {
  const recipe = connectedRecipe(CONNECTED_CATALOGUE[1]!); const score = new ConnectedScore(recipe);
  const time = recipe.originAt + 45 * DAY;
  const reordered = new ConnectedScore({ ...recipe,stems: [...recipe.stems].reverse() });
  assert.deepEqual(reordered.notesBetween(time,time + 20),score.notesBetween(time,time + 20));
  const changed = new ConnectedScore({ ...recipe,stems: recipe.stems.map(stem => ({ ...stem,sku: stem.sku + 100 })) });
  const musical = (value: ConnectedScore) => value.notesBetween(time,time + 20).map(({sku,...note}) => note);
  assert.deepEqual(musical(changed),musical(score));
});

test("geometric connections affect real PCM while preserving all flower timbres",() => {
  const recipe = connectedRecipe(CONNECTED_CATALOGUE[0]!);
  const changed = { ...recipe,stems: recipe.stems.map((stem,i) => i === 0 ? { ...stem,position: { x: -.91,y: .88,z: -.8 } } : stem) };
  const a = new ConnectedScore(recipe); const b = new ConnectedScore(changed); const time = recipe.originAt + 45 * DAY;
  assert.notDeepEqual(a.parts,b.parts);
  assert.deepEqual(a.parts.map(part => part.timbre),b.parts.map(part => part.timbre));
  const one = renderConnected(a,time,3,bank,24_000,false); const two = renderConnected(b,time,3,bank,24_000,false);
  let difference = 0; for (let i = 0; i < one[0].length; i++) difference += Math.abs(one[0][i]! - two[0][i]!);
  assert(difference / one[0].length > .0001);
});

test("continuous capture uses UTC seeking, bounded PCM and exact silence after all expiries",() => {
  const score = new ConnectedScore(connectedRecipe(CONNECTED_CATALOGUE[1]!));
  const time = score.recipe.originAt + 45 * DAY;
  const full = renderConnected(score,time,6,bank,24_000,false);
  const sought = renderConnected(score,time + 2,2,bank,24_000,false);
  let peakDifference = 0;
  for (let ch = 0; ch < 2; ch++) for (let i = 0; i < sought[ch]!.length; i++) {
    const value = sought[ch]![i]!; assert(Number.isFinite(value)); assert(Math.abs(value) <= .82);
    peakDifference = Math.max(peakDifference,Math.abs(value - full[ch]![i + 48000]!));
  }
  assert(peakDifference < .00002,`seek error: ${peakDifference}`);
  const expired = Math.max(...score.recipe.stems.map(stem => stem.expiresAt));
  assert(renderConnected(score,expired,2,bank).every(channel => channel.every(value => value === 0)));
  assert.throws(() => renderConnected(score,time,Number.NaN,bank));
  assert.throws(() => score.notesBetween(time,time + 181));
});

test("a natural-texture soliflore still carries melody and opening changes the actual rendered level",() => {
  let index = 0; let profile = createProfile(fixtureSeed(index));
  while (profile.timbre !== "forest") profile = createProfile(fixtureSeed(++index));
  const recipe = fixture(1); const stem = { ...recipe.stems[0]!,profile };
  const score = new ConnectedScore({ ...recipe,stems: [stem] });
  assert(score.notesForBar(1).some(note => note.midi !== null));
  const time = recipe.originAt + 45 * DAY;
  const open = renderConnected(score,time,3,bank);
  const closed = new ConnectedScore({ ...recipe,stems: [{ ...stem,opening: { ...stem.opening,opens: false } }] });
  const shut = renderConnected(closed,time,3,bank);
  const power = (channels: readonly Float32Array[]) => channels.reduce((sum,channel) => sum + channel.reduce((a,b) => a + b * b,0),0);
  assert(power(open) > power(shut) * 2); assert(power(open) > 1);
});

test("isolating a flower keeps its exact ensemble score and needs only its own library chunk",() => {
  const score = new ConnectedScore(connectedRecipe(CONNECTED_CATALOGUE[0]!));
  const part = score.parts.find(part => instrumentFor(part.timbre).kind === "recorded")!;
  const time = score.recipe.originAt + 45 * DAY;
  const subset = { samples: new Map([[part.timbre,bank.samples.get(part.timbre)!]]) };
  const a = renderConnected(score,time,2,bank,24_000,false,[part.stemId]);
  const b = renderConnected(score,time,2,subset,24_000,false,[part.stemId]);
  assert.deepEqual(a,b); assert(a[0].some(value => Math.abs(value) > .0001));
});
