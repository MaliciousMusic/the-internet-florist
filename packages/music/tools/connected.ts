import { mkdir,readFile,writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { CONNECTED_CATALOGUE,connectedRecipe,REFERENCE_SKUS } from "../src/connected-catalogue.ts";
import { CONNECTED_VERSION,ConnectedScore,noteName } from "../src/connected-score.ts";
import { renderConnected } from "../src/connected-dsp.ts";
import { recipeHash } from "../src/identity.ts";
import { wav } from "../src/dsp.ts";
import { DAY } from "../src/model.ts";
import { SAMPLE_MANIFEST } from "../src/bank.ts";
import { waitForAudioResources } from "./resources.ts";

await waitForAudioResources();
const { bank } = await import("./read-bank.ts");
const directory = new URL("../dist/connected/",import.meta.url); await mkdir(directory,{ recursive: true });
const rows = (await readFile(new URL("../../../catalogue/skus.csv",import.meta.url),"utf8")).trim().split(/\r?\n/).slice(1);
const references = rows.map(row => row.split(";")).filter(row => REFERENCE_SKUS.includes(Number(row[0]) as typeof REFERENCE_SKUS[number]))
  .map(row => ({ sku: Number(row[0]),species: row[2]!,colourName: row[3]!,colour: row[4]! }));
if (references.length !== REFERENCE_SKUS.length) throw new Error("Unknown catalogue reference");
const items = []; const only = process.argv.find(arg => arg.startsWith("--only="))?.slice(7);
for (const specimen of CONNECTED_CATALOGUE) {
  if (only && specimen.id !== only) continue;
  await waitForAudioResources();
  const start = performance.now(); const score = new ConnectedScore(connectedRecipe(specimen));
  const atUTC = score.recipe.originAt + Math.ceil(45 * DAY / score.world.cycleSeconds) * score.world.cycleSeconds;
  const seconds = score.world.cycleSeconds; const rate = 24_000;
  const channels = renderConnected(score,atUTC,seconds,bank,rate);
  let peak = 0; let power = 0; let dc = 0;
  for (const channel of channels) for (const value of channel) { peak = Math.max(peak,Math.abs(value)); power += value ** 2; dc += value; }
  const bytes = wav(channels,rate);
  const events = score.notesBetween(atUTC,atUTC + seconds).map(note => ({ ...note,at: note.at - atUTC }));
  const parts = score.parts.map(part => ({ ...part,anchor: events.find(note => note.stemId === part.stemId && note.at >= 0)?.midi ?? null,
    notes: [...new Set(events.filter(note => note.stemId === part.stemId && note.midi !== null).map(note => note.midi!))].sort((a,b) => a - b),
    strength: score.lifeAt(atUTC).get(part.stemId)! }));
  const metadata = { version: CONNECTED_VERSION,...specimen,world: score.world,atUTC,seconds,sampleRate: rate,
    recipeHash: await recipeHash(score.recipe),librarySha256: SAMPLE_MANIFEST.sha256,
    wavSha256: createHash("sha256").update(bytes).digest("hex"),
    metrics: { renderMs: performance.now() - start,peak,rms: Math.sqrt(power / (channels[0].length * 2)),dc: dc / (channels[0].length * 2),
      events: events.length,participatingFlowers: new Set(events.map(note => note.stemId)).size },
    references: references.filter(ref => score.recipe.stems.some(stem => stem.sku === ref.sku)),
    parts,events,recipe: score.recipe };
  if (metadata.metrics.participatingFlowers !== specimen.count) throw new Error("Unconnected flowers");
  await writeFile(new URL(`${specimen.id}.wav`,directory),bytes);
  const json = JSON.stringify(metadata); await writeFile(new URL(`${specimen.id}.json`,directory),json);
  const { parts: ignoredParts,events: ignoredEvents,recipe: ignoredRecipe,...item } = metadata;
  items.push({ ...item,jsonSha256: createHash("sha256").update(json).digest("hex"),key: noteName(60 + score.world.tonic) });
  console.log(JSON.stringify({ id: specimen.id,seconds,...metadata.metrics }));
}
if (!only) {
  if (new Set(items.map(item => item.wavSha256)).size !== 10) throw new Error("Repeated connected composition");
  await writeFile(new URL("index.json",directory),JSON.stringify({ version: CONNECTED_VERSION,items }) + "\n");
}
