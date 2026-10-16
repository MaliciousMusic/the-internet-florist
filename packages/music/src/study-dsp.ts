import type { Sample, SampleBank } from "./bank.ts";
import { pcmAt } from "./granular.ts";
import type { Study, StudyNote, StudyPart } from "./studies.ts";

export interface PreparedSample { readonly source: Sample; readonly gain: number; readonly begin: number; readonly end: number; readonly fade: number }
export function prepareStudySample(source: Sample, plucked: boolean): PreparedSample {
  const start = Math.round(source.rate * (plucked ? .02 : .2));
  const stop = Math.min(source.pcm.length, Math.round(source.rate * (plucked ? .36 : 1.4)));
  let power = 0;
  for (let i = start; i < stop; i++) power += (source.pcm[i]! / 32768) ** 2;
  const rms = Math.sqrt(power / (stop - start));
  if (!Number.isFinite(rms) || rms < .0001 || source.root === null) throw new Error("Invalid pitched study source");
  const period = source.rate / (440 * 2 ** ((source.root - 69) / 12));
  const begin = Math.round(source.rate * 1.1 / period) * period;
  const end = Math.min(Math.round(source.rate * 2.9 / period) * period, source.pcm.length - 2);
  const fade = Math.round(source.rate * .09 / period) * period;
  return { source, gain: Math.min(10, 1 / rms), begin, end, fade };
}

/** Original recorded attacks and sustain, with a long phase-aligned overlap only when necessary. */
export function studySample(prepared: PreparedSample, coordinate: number, plucked: boolean): number {
  const { source, begin, end, fade } = prepared;
  if (plucked || coordinate < end - fade) return pcmAt(source.pcm, coordinate);
  const phase = (coordinate - (end - fade)) % (end - begin - fade);
  if (phase >= fade) return pcmAt(source.pcm, begin + phase);
  const blend = .5 - .5 * Math.cos(Math.PI * phase / fade);
  return pcmAt(source.pcm, end - fade + phase) * (1 - blend) + pcmAt(source.pcm, begin + phase) * blend;
}

function select(bank: SampleBank, part: StudyPart, note: StudyNote, take: number): Sample {
  const sources = bank.samples.get(part.instrument);
  if (!sources?.length) throw new Error(`Missing study instrument: ${part.instrument}`);
  const sorted = sources.filter(source => source.root !== null).map(source => ({ source,
    cost: Math.abs(source.root! - note.midi) + Math.abs(source.velocity - Math.min(.55,note.velocity)) * 3,
  })).sort((a,b) => a.cost - b.cost || a.source.id.localeCompare(b.source.id));
  const closest = sorted[0]; if (!closest) throw new Error("Study requires a pitched recording");
  const takes = sorted.filter(item => Math.abs(item.cost - closest.cost) < .1);
  return takes[take % takes.length]!.source;
}

/** Offline note accumulation avoids scanning every flower on every output frame. */
export function renderStudy(study: Study, bank: SampleBank, rate = 24_000): readonly [Float32Array, Float32Array] {
  if (!Number.isInteger(rate) || rate < 12_000 || rate > 48_000 || study.seconds > 120) throw new Error("Invalid study render size");
  const frames = Math.ceil(study.seconds * rate);
  const channels = [new Float32Array(frames),new Float32Array(frames)] as const;
  const parts = new Map(study.parts.map(part => [part.id,part]));
  const cache = new Map<string, PreparedSample>();
  for (const note of study.notes) {
    const part = parts.get(note.part)!; const plucked = note.articulation === "plucked" || part.instrument === "piano" || part.instrument === "harp";
    const strings = ["violin","viola","cello"].includes(part.instrument);
    const release = plucked ? .62 : strings ? .28 : .13;
    const attack = plucked ? .003 : strings ? .065 : .018;
    const duration = note.duration + release;
    for (let f = 0; f < part.flowers.length; f++) {
      const flower = part.flowers[f]!;
      const source = select(bank,part,note,f + note.bar);
      const key = source.id + String(plucked);
      let prepared = cache.get(key); if (!prepared) { prepared = prepareStudySample(source,plucked); cache.set(key,prepared); }
      const step = source.rate / rate * 2 ** ((note.midi - source.root! + flower.cents / 100) / 12);
      const onset = note.at + flower.delay + (plucked && note.articulation === "plucked" ? .005 : 0);
      const origin = Math.round(onset * rate); const count = Math.min(Math.ceil(duration * rate),frames - origin);
      const amplitude = prepared.gain * part.gain * note.velocity / part.flowers.length ** .92;
      const panL = Math.cos((flower.pan + 1) * Math.PI / 4) * amplitude;
      const panR = Math.sin((flower.pan + 1) * Math.PI / 4) * amplitude;
      for (let i = 0; i < count; i++) {
        const age = i / rate;
        const enter = Math.min(1,age / attack);
        const leave = age <= note.duration ? 1 : Math.max(0,1 - (age - note.duration) / release) ** 2;
        const swell = plucked ? 1 : .9 + .1 * Math.sin(Math.PI * Math.min(1,age / note.duration));
        const value = studySample(prepared,i * step,plucked) * enter * leave * swell;
        channels[0][origin + i]! += value * panL; channels[1][origin + i]! += value * panR;
      }
    }
  }
  phraseSpace(channels,rate,study.id === "solo" ? .19 : study.id === "chamber" ? .18 : .24);
  let peak = 0;
  const dc = [0,0]; const prior = [0,0];
  for (let i = 0; i < frames; i++) for (let ch = 0; ch < 2; ch++) {
    const input = channels[ch]![i]!;
    dc[ch] = input - prior[ch]! + .9948 ** (24_000 / rate) * dc[ch]!; prior[ch] = input;
    const fade = Math.min(1,i / rate / .035,(frames - 1 - i) / rate / .85);
    const value = dc[ch]! * Math.max(0,fade);
    if (!Number.isFinite(value)) throw new Error("Nonfinite study PCM");
    channels[ch]![i] = value; peak = Math.max(peak,Math.abs(value));
  }
  // One fixed gain for the whole piece preserves its written dynamics and headroom.
  const level = Math.min(2.2,.78 / Math.max(.001,peak));
  for (const channel of channels) for (let i = 0; i < frames; i++) channel[i]! *= level;
  return channels;
}

export function phraseSpace(channels: readonly [Float32Array,Float32Array], rate: number, wet: number): void {
  const delays = [.0311,.0379,.0437,.0533,.0617,.0713];
  const banks = [0,1].map(ch => delays.map((seconds,index) => {
    const duration = seconds + ch * (.0013 + index * .00011);
    return { pcm: new Float32Array(Math.round(duration * rate)), cursor: 0, damp: 0,
      feedback: Math.exp(-6.9078 * duration / 1.85) };
  }));
  const diffusers = [0,1].map(ch => [.0051,.0017].map(seconds => ({ pcm: new Float32Array(Math.round((seconds + ch * .0002) * rate)), cursor: 0 })));
  const pre = [new Float32Array(Math.round(rate * .018)),new Float32Array(Math.round(rate * .018))];
  let preCursor = 0;
  for (let i = 0; i < channels[0].length; i++) {
    const inputs = [channels[0][i]!,channels[1][i]!];
    for (let ch = 0; ch < 2; ch++) {
      const input = pre[ch]![preCursor]!;
      pre[ch]![preCursor] = inputs[ch]! * .84 + inputs[1 - ch]! * .16;
      let reverberated = 0;
      for (const comb of banks[ch]!) {
        const delayed = comb.pcm[comb.cursor]!;
        comb.damp += .38 * (delayed - comb.damp);
        comb.pcm[comb.cursor] = input + comb.damp * comb.feedback;
        comb.cursor = (comb.cursor + 1) % comb.pcm.length;
        reverberated += delayed / delays.length;
      }
      for (const allpass of diffusers[ch]!) {
        const delayed = allpass.pcm[allpass.cursor]!;
        const value = delayed - reverberated * .5;
        allpass.pcm[allpass.cursor] = reverberated + value * .5;
        allpass.cursor = (allpass.cursor + 1) % allpass.pcm.length;
        reverberated = value;
      }
      channels[ch]![i] = inputs[ch]! * .93 + reverberated * wet;
    }
    preCursor = (preCursor + 1) % pre[0]!.length;
  }
}
