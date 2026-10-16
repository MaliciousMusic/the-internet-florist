import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { STUDY_IDS, STUDY_VERSION, createStudy } from "../src/studies.ts";
import { renderStudy } from "../src/study-dsp.ts";
import { wav } from "../src/dsp.ts";
import { SAMPLE_MANIFEST } from "../src/bank.ts";
import { waitForAudioResources } from "./resources.ts";

await waitForAudioResources();
const { bank } = await import("./read-bank.ts");
const directory = new URL("../dist/studies/",import.meta.url);
await mkdir(directory,{ recursive: true });
const items = [];
for (const id of STUDY_IDS) {
  await waitForAudioResources();
  const study = createStudy(id); const start = performance.now(); const sampleRate = 24_000;
  const channels = renderStudy(study,bank,sampleRate);
  let peak = 0; let power = 0; let dc = 0;
  for (const channel of channels) for (const value of channel) {
    if (!Number.isFinite(value)) throw new Error("Invalid study output");
    peak = Math.max(peak,Math.abs(value)); power += value ** 2; dc += value;
  }
  const count = channels[0].length * 2;
  const bytes = wav(channels,sampleRate);
  const scoreSha256 = createHash("sha256").update(JSON.stringify(study)).digest("hex");
  const metadata = { ...study, sampleRate, wav: `${id}.wav`,
    wavSha256: createHash("sha256").update(bytes).digest("hex"), scoreSha256,
    librarySha256: SAMPLE_MANIFEST.sha256, metrics: { renderMs: performance.now() - start,
      peak, rms: Math.sqrt(power / count), dc: dc / count, noteCount: study.notes.length,
      participatingFlowers: study.parts.reduce((sum,part) => sum + part.flowers.length,0),
      sectionRms: study.sections.map((section,index) => {
        const stop = study.sections[index + 1]?.seconds ?? study.seconds - 4;
        const a = Math.floor(section.seconds * sampleRate); const b = Math.floor(stop * sampleRate);
        let sum = 0; for (const channel of channels) for (let i = a; i < b; i++) sum += channel[i]! ** 2;
        return Math.sqrt(sum / ((b - a) * 2));
      }) } };
  await writeFile(new URL(`${id}.wav`,directory),bytes);
  await writeFile(new URL(`${id}.json`,directory),JSON.stringify(metadata,null,2) + "\n");
  const { notes, parts, ...item } = metadata;
  items.push(item);
  console.log(JSON.stringify({ id, seconds: study.seconds, ...metadata.metrics }));
}
await writeFile(new URL("index.json",directory),JSON.stringify({ version: STUDY_VERSION, items },null,2) + "\n");
console.log("Trois études originales prêtes dans dist/studies.");
