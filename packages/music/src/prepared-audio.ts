import { Renderer } from "./dsp.ts";
import { PCM_RATE, type PcmWindow } from "./pcm-stream.ts";
import type { Score } from "./score.ts";
import type { SampleBank } from "./bank.ts";

export function prepareAudio(score: Score, from: number, until: number, bank?: SampleBank): PcmWindow {
  if (!Number.isFinite(from) || !Number.isFinite(until) || from < 0 || until < from || until - from > 30) {
    throw new Error("Invalid ensemble preparation window");
  }
  const firstFrame = Math.max(0, Math.floor(from * PCM_RATE) - 2);
  const length = Math.ceil(until * PCM_RATE) + 3 - firstFrame;
  const left = new Float32Array(length); const right = new Float32Array(length); const renderer = new Renderer(score, bank);
  for (let offset = 0; offset < length; offset += 128) {
    const end = Math.min(length, offset + 128);
    renderer.render(left.subarray(offset, end), right.subarray(offset, end), (firstFrame + offset) / PCM_RATE, PCM_RATE);
  }
  return { firstFrame, left, right };
}
