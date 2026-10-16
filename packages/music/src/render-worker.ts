import { Renderer, wav } from "./dsp.ts";
import { Score } from "./score.ts";
import type { Recipe } from "./model.ts";
import { decodeBank, type BankPayload } from "./bank.ts";

const scope = globalThis as unknown as { onmessage: ((event: MessageEvent) => void) | null;
  postMessage: (message: unknown, transfer?: Transferable[]) => void };
scope.onmessage = event => {
  try {
    const { recipe, at, seconds, bank } = event.data as { recipe: Recipe; at: number; seconds: number; bank: BankPayload };
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 180) throw new Error("Invalid excerpt duration");
    const rate = 24000; const frames = Math.round(seconds * rate);
    const left = new Float32Array(frames); const right = new Float32Array(frames);
    const renderer = new Renderer(new Score(recipe), decodeBank(bank));
    for (let offset = 0; offset < frames; offset += 128) {
      const end = Math.min(offset + 128, frames);
      renderer.render(left.subarray(offset, end), right.subarray(offset, end), at + offset / rate, rate);
      if (offset % (128 * 1000) === 0) scope.postMessage({ progress: offset / frames });
    }
    // Playback fades are local and do not alter the living score.
    for (let i = 0; i < frames; i++) {
      const fade = Math.min(1, i / rate / 1.4, (frames - 1 - i) / rate / 1.4);
      left[i] = left[i]! * fade; right[i] = right[i]! * fade;
    }
    const bytes = wav([left, right], rate);
    scope.postMessage({ bytes: bytes.buffer }, [bytes.buffer]);
  } catch (error) { scope.postMessage({ error: String(error) }); }
};
