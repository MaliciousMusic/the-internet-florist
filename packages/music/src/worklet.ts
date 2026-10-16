import { smooth, type Recipe } from "./model.ts";
import type { ScorePacket } from "./stream-score.ts";
import { PcmStream } from "./pcm-stream.ts";

declare const sampleRate: number;
declare function registerProcessor(name: string, processor: typeof BouquetProcessor): void;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor(options?: unknown);
}

interface Options {
  processorOptions: { recipe: Recipe; at: number; packet: ScorePacket };
}

class BouquetProcessor extends AudioWorkletProcessor {
  private readonly renderer: PcmStream;
  private readonly start: number;
  private requestedUntil = -Infinity;
  private frames = 0;
  private closed = false;
  private buffering = false;
  private readonly expires: number;

  constructor(options: Options) {
    super(options);
    this.start = options.processorOptions.at;
    this.expires = Math.max(0, ...options.processorOptions.recipe.stems.map(stem => stem.expiresAt - options.processorOptions.recipe.originAt));
    this.renderer = new PcmStream(this.expires);
    const audio = options.processorOptions.packet.audio;
    if (!audio) throw new Error("Missing ensemble audio");
    this.renderer.append(audio, this.start);
    this.port.onmessage = event => {
      if (event.data === "close") this.closed = true;
      else if (event.data.type === "prepared") this.renderer.append(event.data.audio, this.start + this.frames / sampleRate);
    };
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    if (this.closed) return false;
    const channels = outputs[0];
    if (!channels || !channels[0] || !channels[1]) return true;
    const at = this.start + this.frames / sampleRate;
    const buffering = at < this.expires && this.renderer.until <= at;
    if (buffering !== this.buffering) {
      this.buffering = buffering;
      this.port.postMessage({ type: "state", state: buffering ? "buffering" : "playing" });
    }
    if (this.renderer.until - at < 16 && this.requestedUntil <= this.renderer.until) {
      this.requestedUntil = at + 24;
      this.port.postMessage({ type: "prepare", from: Math.max(0, at), until: Math.max(0, at + 24) });
    }
    this.renderer.render(channels[0], channels[1], at, sampleRate);
    const remaining = smooth((this.renderer.until - at) / .2);
    if (remaining < 1) for (let i = 0; i < channels[0].length; i++) { channels[0][i]! *= remaining; channels[1][i]! *= remaining; }
    this.frames += channels[0].length;
    return true;
  }
}

registerProcessor("belai-bouquet", BouquetProcessor);
