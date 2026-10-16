export const PCM_RATE = 24_000;
export interface PcmWindow { readonly firstFrame: number; readonly left: Float32Array; readonly right: Float32Array }

/** All flowers are mixed off the audio thread; this small queue only reads their common absolute sample clock. */
export class PcmStream {
  private windows: readonly PcmWindow[] = [];
  private readonly expires: number;
  until = -Infinity;
  constructor(expires: number) { this.expires = expires; }
  append(window: PcmWindow, now: number): void {
    if (!Number.isSafeInteger(window.firstFrame) || window.left.length !== window.right.length
      || window.left.length < 2 || window.left.length > 30 * PCM_RATE + 8 || !Number.isFinite(now)) {
      throw new Error("Invalid ensemble audio window");
    }
    this.windows = [...this.windows.filter(item => (item.firstFrame + item.left.length) / PCM_RATE > now - 1), window].slice(-4);
    this.until = Math.max(this.until, (window.firstFrame + window.left.length - 2) / PCM_RATE);
  }
  render(left: Float32Array, right: Float32Array, from: number, rate: number): void {
    if (left.length !== right.length || !Number.isFinite(from) || !Number.isFinite(rate) || rate < 8000 || rate > 192000) {
      throw new Error("Invalid ensemble audio block");
    }
    for (let i = 0; i < left.length; i++) {
      const time = from + i / rate; left[i] = 0; right[i] = 0;
      if (time < 0 || time >= this.expires) continue;
      const position = time * PCM_RATE; const frame = Math.floor(position); const mix = position - frame;
      for (let j = this.windows.length - 1; j >= 0; j--) {
        const window = this.windows[j]!; const k = frame - window.firstFrame;
        if (k < 0 || k + 1 >= window.left.length) continue;
        left[i] = window.left[k]! + (window.left[k + 1]! - window.left[k]!) * mix;
        right[i] = window.right[k]! + (window.right[k + 1]! - window.right[k]!) * mix;
        break;
      }
    }
  }
}
