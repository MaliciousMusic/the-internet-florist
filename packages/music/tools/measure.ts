import { bank } from "./read-bank.ts";
import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";
import { fixture, replaceStem } from "../src/fixtures.ts";
import { DAY } from "../src/model.ts";
import { Score } from "../src/score.ts";
import { renderExcerpt, wav } from "../src/dsp.ts";

await mkdir("out", { recursive: true });
const summaries: unknown[] = [];
for (const count of [1, 12, 80, 350]) {
  const start = performance.now(); const score = new Score(fixture(count));
  const prepared = performance.now(); const duration = 6;
  const channels = renderExcerpt(score, 45 * DAY + 12.5, duration, 24000, bank);
  const elapsed = performance.now() - prepared;
  let peak = 0; let sum = 0; let dc = 0;
  for (const channel of channels) for (const sample of channel) {
    peak = Math.max(peak, Math.abs(sample)); sum += sample ** 2; dc += sample;
  }
  summaries.push({ stems: count, prepareMs: prepared - start, renderMs: elapsed,
    seconds: duration, realTimeRatio: elapsed / (duration * 1000), peak,
    rms: Math.sqrt(sum / (channels[0].length * 2)), dc: dc / (channels[0].length * 2) });
}
const recipe = fixture(12);
for (const [name, data] of [["bouquet-A", recipe], ["bouquet-B", replaceStem(recipe, "4")],
  ["soliflore", fixture(1)], ["harmonie-suspendue", fixture(12, "suspended")]] as const) {
  const channels = renderExcerpt(new Score(data), 45 * DAY + 12.5, 25, 24000, bank);
  for (let i = 0; i < channels[0].length; i++) {
    const fade = Math.min(1, i / 24000 / 1.4, (channels[0].length - 1 - i) / 24000 / 1.4);
    channels[0][i] = channels[0][i]! * fade; channels[1][i] = channels[1][i]! * fade;
  }
  const bytes = wav(channels, 24000);
  await writeFile(`out/${name}.wav`, bytes);
}
const score = new Score(recipe);
// Inspect a whole day in bounded windows without rendering a full day's PCM.
const longStart = performance.now(); let events = 0; let digest = createHash("sha256");
for (let at = 45 * DAY; at < 46 * DAY; at += 240) {
  const voices = score.voicesBetween(at, at + 240).filter(voice => voice.start >= at && voice.start < at + 240);
  events += voices.length; digest.update(JSON.stringify(voices));
}
const report = { audio: summaries, scoreDay: { events, planMs: performance.now() - longStart, sha256: digest.digest("hex") },
  node: process.version, platform: process.platform, arch: process.arch, heapBytes: process.memoryUsage().heapUsed };
await writeFile("out/measures.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
