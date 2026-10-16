import { clamp, lifeAt } from "./model.ts";
import { instrumentFor } from "./library.ts";
import type { Sample, SampleBank } from "./bank.ts";
import { pcmAt } from "./granular.ts";
import { synthesisSample } from "./dsp.ts";
import { phraseSpace, prepareStudySample, studySample, type PreparedSample } from "./study-dsp.ts";
import { ConnectedScore, hzForMidi } from "./connected-score.ts";
import { soundColourFor } from "./sound-colours.ts";

type RenderableScore=Pick<ConnectedScore,"recipe"|"parts"|"notesBetween"> & {readonly acousticSpace?:number};

/** Absolute sample grid, fixed mix gain and a reverb prelude preserve seeking and overlapping captures. */
export function renderConnected(score: RenderableScore,atUTC: number,seconds: number,bank: SampleBank & {readonly colours?:ReadonlyMap<string,readonly Sample[]>},rate = 24_000,
  fades = true,selected?: readonly string[]): readonly [Float32Array,Float32Array] {
  if (!Number.isFinite(atUTC) || !Number.isFinite(seconds) || seconds <= 0 || seconds > 130 || ![12_000,24_000,48_000].includes(rate)) {
    throw new Error("Invalid connected render window");
  }
  const count = Math.ceil(seconds * rate); const prelude = rate * 8;
  const firstFrame = Math.round((atUTC - score.recipe.originAt) * rate) - prelude;
  const originUTC = score.recipe.originAt + firstFrame / rate;
  const frames = count + prelude;
  const mix = [new Float32Array(frames),new Float32Array(frames)] as const;
  const stems = new Map(score.recipe.stems.map(stem => [stem.id,stem]));
  const parts = new Map(score.parts.map(part => [part.stemId,part]));
  const latestExpiry = Math.max(0,...score.recipe.stems.map(stem => stem.expiresAt));
  if (atUTC >= latestExpiry || atUTC + seconds <= score.recipe.originAt) return [new Float32Array(count),new Float32Array(count)];
  const prepared = new Map<string,PreparedSample>(); const synths = new Map<string,Float32Array>();
  let synthBytes = 0;
  for (const note of score.notesBetween(originUTC,originUTC + frames / rate)) {
    if (selected && !selected.includes(note.stemId)) continue;
    const stem = stems.get(note.stemId)!; const part = parts.get(note.stemId)!;
    const colourId="soundColour" in part ? part.soundColour : undefined;
    const colour=typeof colourId==="string" ? soundColourFor(colourId) : undefined;
    const instrument = instrumentFor(note.timbre); const texture = instrument.kind === "texture";
    const unpitched=colour?.percussive===true;
    const synth = instrument.kind === "synth" && !colour?.recording;
    const plucked = note.articulation === "plucked" || instrument.attack < .03;
    const release = texture ? .2 : plucked ? .46 : .23;
    const attack = (texture ? .16 : Math.min(.13,(plucked ? .004 : instrument.attack * .34) * (.75 + stem.profile.attack * .12))) * (colour?.attack??1);
    const noteFrame = Math.round((note.at - score.recipe.originAt) * rate);
    const start = noteFrame - firstFrame;
    const duration = note.duration + release * (.65 + stem.profile.release * .12);
    const stop = Math.min(Math.ceil(duration * rate),frames - start);
    const midi = note.midi ?? 69;
    let source: Sample | undefined; let recording: PreparedSample | undefined; let wave: Float32Array | undefined;
    if (synth) {
      // Short notes do not need five-second buffers; the legacy render retains its exact waveform allocation.
      const waveSeconds=colour?Math.min(8,Math.max(1,2**Math.ceil(Math.log2(duration+.04)))):note.duration>4.5?8:5;
      const key = `${note.timbre}/${midi}/${waveSeconds}`;
      wave = synths.get(key);
      if (!wave) {
        wave = Float32Array.from({ length: Math.ceil(rate * waveSeconds) },(_,i) => synthesisSample({ phase: 0,brightness: .5,modulation: .003 },instrument,hzForMidi(midi),i / rate) * 1.5);
        synths.set(key,wave); synthBytes += wave.byteLength;
        while (synthBytes > 32 * 1024 ** 2 && synths.size > 1) { const oldest = synths.keys().next().value!; synthBytes -= synths.get(oldest)!.byteLength; synths.delete(oldest); }
      }
    } else {
      const samples = colour?.recording?bank.colours?.get(colour.recording):bank.samples.get(note.timbre);
      if (!samples?.length) throw new Error(`Missing individual sound: ${colour?.recording??note.timbre}`);
      const ordered = samples.map(sample => ({ sample,cost: texture || unpitched ? 0 : Math.abs(sample.root! - midi) + Math.abs(sample.velocity - Math.min(.55,note.velocity)) * 3 }))
        .sort((a,b) => a.cost - b.cost || a.sample.id.localeCompare(b.sample.id));
      const takes = ordered.filter(item => item.cost - ordered[0]!.cost < .1);
      source = takes[(Math.floor(stem.profile.phase * 101) + note.bar) % takes.length]!.sample;
      if (!texture && !unpitched) {
        const key = source.id + String(plucked); recording = prepared.get(key);
        if (!recording) { recording = prepareStudySample(source,plucked); prepared.set(key,recording); }
      }
    }
    const cents = (stem.profile.phase - .5) * 5;
    const step = (source?.rate ?? rate) / rate * 2 ** ((texture || unpitched ? 0 : midi - (source?.root ?? midi) + cents / 100) / 12);
    const amplitude = part.gain * note.velocity * (recording?.gain ?? (texture ? 2.2 : unpitched ? 3 : 1));
    const left = Math.cos((part.pan + 1) * Math.PI / 4) * amplitude;
    const right = Math.sin((part.pan + 1) * Math.PI / 4) * amplitude;
    const lifeStart = lifeAt(stem,note.at).strength; const lifeEnd = lifeAt(stem,note.at + duration).strength;
    const filter = 1 - Math.exp(-2 * Math.PI * (1700 + part.brightness * 6200) * (colour?.cutoff??1) / rate);
    let low = 0;
    for (let i = 0; i < stop; i++) {
      const age = i / rate; const absolute = note.at + age;
      if (absolute >= stem.expiresAt) break;
      let value = 0;
      if (wave) {
        const coordinate = i * step + stem.profile.phase * rate / hzForMidi(midi);
        const frame = Math.floor(coordinate); const fraction = coordinate - frame;
        value = (wave[frame] ?? 0) + ((wave[frame + 1] ?? 0) - (wave[frame] ?? 0)) * fraction;
      } else if (recording) value = studySample(recording,i * step,plucked);
      else if (source && unpitched) {
        value=pcmAt(source.pcm,i*step);
        // A percussion-only soliflore still sings its written melody with a quiet pitched resonator.
        if(note.midi!==null)value=value*.35+Math.sin(age*hzForMidi(midi)*Math.PI*2)*.22*Math.exp(-age*1.3);
      } else if (source) {
        const length = source.pcm.length; const fade = Math.min(source.rate * .15,length * .15);
        const reach = length - fade - 2;
        const coordinate = ((note.at - score.recipe.originAt + age) * source.rate + (stem.profile.phase+(colour?.scan??0)) * length) % reach;
        if (coordinate < fade) {
          const blend = .5 - .5 * Math.cos(Math.PI * coordinate / fade);
          value = pcmAt(source.pcm,reach + coordinate) * (1 - blend) + pcmAt(source.pcm,coordinate) * blend;
        } else value = pcmAt(source.pcm,coordinate);
        if (note.midi !== null) value = value * .28 + Math.sin(age * hzForMidi(midi) * Math.PI * 2) * .33;
      }
      if(colour&&!texture&&!unpitched) {
        const phase=age*hzForMidi(midi)*Math.PI*2;
        const chorus=colour.chorus;
        if(chorus&&recording)value=value*(1-chorus)+studySample(recording,Math.max(0,(i-rate*.004)*step),plucked)*chorus;
        else if(chorus)value=value*(1-chorus)+Math.sin(phase*1.0006)*chorus;
        if(colour.damping)value*=Math.exp(-age*colour.damping*(note.articulation==="held"?.08:1));
        if(colour.octave)value+=Math.sin(phase*2)*colour.octave*Math.exp(-age*.25);
        if(colour.transient)value+=Math.sin(phase*3)*colour.transient*Math.exp(-age*24);
        if(colour.vowel)value=value*.82+(.12*Math.sin(phase*2)+.07*Math.sin(phase*3)+.035*Math.sin(phase*5))*colour.vowel;
      }
      low += (value - low) * filter;
      const enter = clamp(age / attack);
      const leave = age <= note.duration ? 1 : clamp((duration - age) / (duration - note.duration)) ** 2;
      const life = lifeStart + (lifeEnd - lifeStart) * age / duration;
      const rendered = low * enter * leave * Math.max(0,life);
      const frame = start + i;
      if (frame >= 0) { mix[0][frame]! += rendered * left; mix[1][frame]! += rendered * right; }
    }
  }
  phraseSpace(mix,rate,score.acousticSpace??.23);
  const output = [new Float32Array(count),new Float32Array(count)] as const;
  const previous = [0,0]; const dc = [0,0];
  for (let i = 0; i < frames; i++) for (let ch = 0; ch < 2; ch++) {
    const value = mix[ch]![i]!;
    dc[ch] = value - previous[ch]! + .9948 ** (24_000 / rate) * dc[ch]!; previous[ch] = value;
    if (i < prelude) continue;
    const frame = i - prelude; const absolute = originUTC + i / rate;
    const envelope = fades ? clamp(Math.min(frame / rate / .8,(count - 1 - frame) / rate / 1.3)) : 1;
    const final = absolute < latestExpiry && absolute >= score.recipe.originAt ? .82 * Math.tanh(dc[ch]! * 1.35 / .82) * envelope : 0;
    if (!Number.isFinite(final)) throw new Error("Nonfinite connected PCM");
    output[ch]![frame] = final;
  }
  return output;
}
