import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { bank, bankBytes } from "../tools/read-bank.ts";
import { decodeBank, verifyBank, loadRecipeBank, instrumentUrl, SAMPLE_MANIFEST, type BankPayload } from "../src/bank.ts";
import { LIBRARY, ACOUSTIC, NATURE, instrumentFor } from "../src/library.ts";
import { fixture } from "../src/fixtures.ts";
import { DAY } from "../src/model.ts";
import { Score } from "../src/score.ts";
import { renderExcerpt, Renderer } from "../src/dsp.ts";

test("recorded sound bank is complete, traceable and byte-verified", async () => {
  await verifyBank(bankBytes);
  assert.deepEqual(JSON.parse(await readFile(new URL("../assets/manifest.json", import.meta.url), "utf8")), SAMPLE_MANIFEST);
  assert.equal(LIBRARY.length, 100); assert(SAMPLE_MANIFEST.samples.length > 250);
  assert.equal(new Set(LIBRARY.map(sound => sound.id)).size, LIBRARY.length);
  assert.equal(new Set(LIBRARY.map(sound => sound.family)).size, 8);
  let cursor = 0;
  for (const record of SAMPLE_MANIFEST.samples) {
    assert.equal(record.offset, cursor); cursor += record.frames * 2;
    const pcm = new Uint8Array(bankBytes, record.offset, record.frames * 2);
    assert.equal(createHash("sha256").update(pcm).digest("hex"), record.sha256);
    assert.match(record.sourceSha256, /^[a-f0-9]{64}$/);
    assert(record.author && record.file && record.source.startsWith("https://"));
    assert(["CC0-1.0", "CC-BY-4.0"].includes(record.license));
    assert.equal(record.rate, 24000);
  }
  assert.equal(cursor, bankBytes.byteLength);
  for (const id of [...ACOUSTIC, ...NATURE]) assert(bank.samples.get(id)?.length);
  assert.equal(SAMPLE_MANIFEST.samples.filter(sample => sample.license === "CC-BY-4.0").length, 12);
  assert.equal(Object.keys(SAMPLE_MANIFEST.pitchMappings).length, 32);
  // This source uses C3=60, unlike the piano's octave convention. Filename-only tuning is wrong.
  const flute = SAMPLE_MANIFEST.samples.find(sample => sample.instrument === "flute" && sample.file.includes("_C3_"));
  assert(flute); assert.equal(flute.root, 60);
});

test("soft and medium articulations retain distinct takes and authoritative dynamic layers", () => {
  const samples = SAMPLE_MANIFEST.samples.filter(sample => sample.instrument === "flute-short");
  const root = samples[0]!.root;
  const variants = samples.filter(sample => sample.root === root);
  assert(new Set(variants.map(sample => sample.velocity)).size >= 2);
  assert(new Set(variants.map(sample => sample.sha256)).size >= 4);
  assert(samples.every(sample => sample.velocity >= 0 && sample.velocity <= 1));
});

test("selected instruments reproduce the full bank exactly and reject corrupt or duplicate chunks", async () => {
  const records = SAMPLE_MANIFEST.samples.filter(sample => sample.instrument === "piano");
  const first = records[0]!.offset; const last = records.at(-1)!;
  const payload: BankPayload = { chunks: [{ instrument: "piano", bytes: bankBytes.slice(first, last.offset + last.frames * 2) }] };
  await verifyBank(payload); const selected = decodeBank(payload);
  assert.equal(selected.samples.size, 1);
  assert.deepEqual(selected.samples.get("piano"), bank.samples.get("piano"));
  const broken = payload.chunks[0]!.bytes.slice(0); const changed = new Uint8Array(broken); changed[20] = changed[20]! ^ 1;
  await assert.rejects(verifyBank({ chunks: [{ instrument: "piano", bytes: broken }] }), /integrity/);
  assert.throws(() => decodeBank({ chunks: [...payload.chunks, ...payload.chunks] }), /duplicate/);
  const recipe = fixture(1); const stem = recipe.stems[0]!;
  const harp = new Score({ ...recipe, stems: [{ ...stem, profile: { ...stem.profile, timbre: "harp" } }] });
  assert.throws(() => new Renderer(harp, selected), /bibliothèque/);
});

test("recipe loading fetches only necessary instruments, reuses verified data and leaves synthesis offline", async t => {
  const originalFetch = globalThis.fetch; const requests: string[] = [];
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async input => {
    const url = String(input); requests.push(url);
    const instrument = ["piano", "harp"].find(id => url.endsWith(instrumentUrl(id as "piano" | "harp")));
    assert(instrument, url);
    const records = SAMPLE_MANIFEST.samples.filter(sample => sample.instrument === instrument);
    const last = records.at(-1)!;
    return new Response(bankBytes.slice(records[0]!.offset, last.offset + last.frames * 2));
  };
  const source = fixture(2);
  const recipe = { ...source, stems: source.stems.map((stem, i) => ({ ...stem, profile: { ...stem.profile, timbre: i ? "harp" as const : "piano" as const } })) };
  const partial = await loadRecipeBank(recipe, "https://belai-library-test.invalid/");
  assert.equal(requests.length, 2); assert.equal(decodeBank(partial).samples.size, 2);
  await loadRecipeBank(recipe, "https://belai-library-test.invalid/"); assert.equal(requests.length, 2);
  const synth = { ...source, stems: source.stems.map(stem => ({ ...stem, profile: { ...stem.profile, timbre: "ocarina" as const } })) };
  const empty = await loadRecipeBank(synth); assert.equal(requests.length, 2); assert.equal(decodeBank(empty).samples.size, 0);
  const at = 45 * DAY; const [full] = renderExcerpt(new Score(recipe), at, .2, 8000, bank);
  const [selection] = renderExcerpt(new Score(recipe), at, .2, 8000, decodeBank(partial));
  assert.deepEqual(full, selection);
});

test("missing, truncated and tampered banks fail explicitly", async () => {
  assert.throws(() => decodeBank(new ArrayBuffer(24)));
  const changed = bankBytes.slice(0); const bytes = new Uint8Array(changed); bytes[0] = bytes[0]! ^ 1;
  await assert.rejects(verifyBank(changed), /integrity/);
  const recipe = fixture(1); const stem = recipe.stems[0]!;
  const sampled = new Score({ ...recipe, stems: [{ ...stem, profile: { ...stem.profile, timbre: "piano" } }] });
  assert.throws(() => new Renderer(sampled), /bibliothèque/);
});

test("every library entry makes finite audible PCM and expires completely", () => {
  const source = fixture(1); const stem = source.stems[0]!;
  const fingerprints = new Set<string>();
  for (const instrument of LIBRARY) {
    const score = new Score({ ...source, stems: [{ ...stem, profile: { ...stem.profile, timbre: instrument.id } }] });
    const at = score.voicesBetween(45 * DAY, 45 * DAY + 60)[0]!.start + 0.1;
    const channels = renderExcerpt(score, at, 0.7, 8000, bank);
    assert(channels.every(channel => channel.every(value => Number.isFinite(value) && Math.abs(value) < 0.8)), instrument.id);
    assert(channels.some(channel => channel.some(value => Math.abs(value) > 1e-5)), `Silent ${instrument.id}`);
    fingerprints.add(createHash("sha256").update(new Uint8Array(channels[0].buffer)).digest("hex"));
    const end = stem.expiresAt - source.originAt;
    assert(renderExcerpt(score, end, 0.01, 24000, bank).every(channel => channel.every(value => value === 0)), instrument.id);
  }
  assert.equal(fingerprints.size, LIBRARY.length, "Duplicated sound identity");
});

test("every nature module contributes together with a shared bounded layer gain", () => {
  const source = fixture(80);
  const recipe = { ...source, stems: source.stems.map((stem, i) => ({ ...stem, profile: { ...stem.profile, timbre: NATURE[i % NATURE.length]! } })) };
  const score = new Score(recipe); const heard = new Set<string>(); const at = 45 * DAY;
  for (const voice of score.voicesAt(at + .25)) heard.add(voice.stemId);
  assert.equal(heard.size, 80);
  assert(score.voicesAt(at + .25).reduce((sum, v) => sum + v.gain, 0) < .4);
});

test("melodic soliflores contain actual quiet intervals and continuous note attacks", () => {
  const source = fixture(1); const stem = source.stems[0]!;
  for (const timbre of ["piano", "harp", "flute"] as const) {
    const score = new Score({ ...source, stems: [{ ...stem, profile: { ...stem.profile, timbre } }] });
    const at = 45 * DAY; const [left] = renderExcerpt(score, at, 24, 24000, bank);
    let peak = 0; let jump = 0; let quiet = 0;
    for (let i = 1; i < left.length; i++) {
      peak = Math.max(peak, Math.abs(left[i]!)); jump = Math.max(jump, Math.abs(left[i]! - left[i - 1]!));
      if (Math.abs(left[i]!) < 1e-6) quiet++;
    }
    assert(peak > 0.001 && peak < 0.3, timbre);
    assert(quiet / left.length > 0.08, `${timbre}: no breathing room`);
    assert(jump < 0.1, `${timbre}: discontinuous attack`);
    assert(instrumentFor(timbre).kind === "recorded");
  }
});
