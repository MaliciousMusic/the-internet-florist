import { test } from "node:test";
import assert from "node:assert/strict";
import { STUDY_IDS, createStudy } from "../src/studies.ts";
import { instrumentFor } from "../src/library.ts";
import { renderStudy, studySample } from "../src/study-dsp.ts";
import { bank } from "../tools/read-bank.ts";

test("authored studies have complete, deterministic ensembles and one shared musical clock",() => {
  for (const id of STUDY_IDS) {
    const study = createStudy(id); assert.deepEqual(study,createStudy(id));
    assert.equal(study.chords.length,32); assert.equal(study.chords[31],"C");
    const flowers = study.parts.flatMap(part => part.flowers.map(flower => flower.id));
    assert.equal(flowers.length,study.count); assert.equal(new Set(flowers).size,study.count);
    for (const part of study.parts) {
      const events = study.notes.filter(note => note.part === part.id);
      assert(events.length > 0,`${id}: unused part ${part.id}`);
      const range = instrumentFor(part.instrument).range;
      for (const note of events) {
        assert(note.at + 1e-10 >= note.bar * 180 / study.tempo && note.at < (note.bar + 1) * 180 / study.tempo);
        assert(note.duration > 0 && note.duration <= 180 / study.tempo);
        assert(note.midi >= range[0] && note.midi <= range[1],`${part.instrument}: ${note.midi}`);
        assert(note.velocity > 0 && note.velocity <= 1);
      }
    }
    const final = study.notes.filter(note => note.part === "chant" && note.bar === 31);
    assert.equal(final.length,id === "solo" ? 7 : 1);
    assert.equal(final[0]!.midi,72 + study.tonic);
  }
});

test("a recognizable theme returns while the bridge and orchestration develop it",() => {
  const signatures: string[] = [];
  for (const id of STUDY_IDS) {
    const study = createStudy(id);
    const melody = (bar: number) => study.notes.filter(note => note.bar === bar && (note.part === "chant" || note.part === "reponse"))
      .map(note => [note.midi,note.duration]);
    assert.deepEqual(melody(0),melody(8));
    assert.notDeepEqual(melody(0),melody(16));
    assert(Math.abs(study.sections[3]!.seconds - 144 * 30 / study.tempo) < 1e-10);
    signatures.push(JSON.stringify(melody(0)));
  }
  assert.equal(new Set(signatures).size,3);
  const full = createStudy("orchestra");
  const t = (25 * 6 + 4.25) * 30 / full.tempo;
  const active = new Set(full.notes.filter(note => note.at <= t && note.at + note.duration > t).map(note => note.part));
  assert.equal(full.parts.filter(part => active.has(part.id)).reduce((sum,part) => sum + part.flowers.length,0),80);
});

test("long recorded sustain overlaps preserve phase and do not introduce boundary steps",() => {
  const pcm = Int16Array.from({ length: 100_000 },(_,i) => Math.round(15000 * Math.sin(i * Math.PI * 2 / 80)));
  const prepared = { source: { pcm,root: 60,rate: 24_000,id: "sustain",velocity: .5 },gain: 1,begin: 26400,end: 69600,fade: 2160 };
  const cycle = prepared.end - prepared.begin - prepared.fade;
  for (const boundary of [prepared.end - prepared.fade,prepared.end - prepared.fade + cycle,prepared.end - prepared.fade + cycle * 2]) {
    const left = studySample(prepared,boundary - .01,false);
    const right = studySample(prepared,boundary + .01,false);
    assert(Math.abs(left - right) < .002);
  }
});

test("the recorded studies render finite stereo with headroom, tails and reproducible PCM",() => {
  for (const id of STUDY_IDS) {
    const study = createStudy(id); const channels = renderStudy(study,bank);
    assert.equal(channels[0].length,Math.ceil(study.seconds * 24_000));
    let power = 0; let difference = 0;
    for (let i = 0; i < channels[0].length; i++) {
      for (const channel of channels) { assert(Number.isFinite(channel[i])); assert(Math.abs(channel[i]!) < .79); power += channel[i]! ** 2; }
      difference += Math.abs(channels[0][i]! - channels[1][i]!);
    }
    assert(power / (channels[0].length * 2) > .001); assert(difference > 1);
    for (const channel of channels) { assert.equal(Math.abs(channel[0]!),0); assert.equal(Math.abs(channel.at(-1)!),0); }
    if (id === "solo") {
      const short = { ...study, seconds: 4, notes: study.notes.filter(note => note.at < 2) };
      assert.deepEqual(renderStudy(short,bank),renderStudy(short,bank));
    }
  }
});
