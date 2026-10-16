import { bank } from "./read-bank.ts";
import { waitForAudioResources } from "./resources.ts";
import { performance } from "node:perf_hooks";
import { mkdir, writeFile } from "node:fs/promises";
import { CATALOGUE, specimenRecipe } from "../src/catalogue.ts";
import { Score } from "../src/score.ts";
import { prepareAudio } from "../src/prepared-audio.ts";
import { PcmStream } from "../src/pcm-stream.ts";
import { DAY, VERSION } from "../src/model.ts";

const reports = [];
for (const specimen of CATALOGUE.filter(item => item.count === 350 || item.count === 80 && item.variant === 0)) {
  await waitForAudioResources();
  const preparing = performance.now(); const score = new Score(specimenRecipe(specimen)); const at = 45 * DAY + 12.5;
  const audio = prepareAudio(score, at, at + 24, bank);
  const prepareMs = performance.now() - preparing;
  const renderer = new PcmStream(Math.max(...score.recipe.stems.map(stem => stem.expiresAt - score.recipe.originAt)));
  renderer.append(audio, at);
  const left = new Float32Array(128); const right = new Float32Array(128); const times = [];
  const start = performance.now();
  for (let i = 0; i < 2250; i++) {
    const before = performance.now();
    renderer.render(left, right, 45 * DAY + 12.5 + i * 128 / 48000, 48000);
    times.push(performance.now() - before);
  }
  const renderMs = performance.now() - start; times.sort((a, b) => a - b);
  const report = { id: specimen.id, count: specimen.count, prepareMs, renderMs, seconds: 6, sampleRate: 48000,
    blockBudgetMs: 128 / 48, p95Ms: times[Math.floor(times.length * 0.95)], p99Ms: times[Math.floor(times.length * 0.99)], maxMs: times.at(-1) };
  reports.push(report); console.log(JSON.stringify(report));
}
await mkdir("out", { recursive: true });
await writeFile("out/variation-performance.json", JSON.stringify({ version: VERSION, node: process.version, reports }, null, 2) + "\n");
