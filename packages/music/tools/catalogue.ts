import { bank } from "./read-bank.ts";
import { waitForAudioResources } from "./resources.ts";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { CATALOGUE, specimenRecipe } from "../src/catalogue.ts";
import { DAY, VERSION } from "../src/model.ts";
import { Score, SLOT } from "../src/score.ts";
import { renderExcerpt, wav } from "../src/dsp.ts";
import { recipeHash } from "../src/identity.ts";
import { SAMPLE_MANIFEST } from "../src/bank.ts";

const directory = new URL("../dist/catalogue/", import.meta.url);
await mkdir(directory, { recursive: true });
const seconds = 180; const sampleRate = 24_000; const at = 45 * DAY + 12.5;
const items = [];
const resume = process.argv.includes("--resume");
// Render serially: one CPU-heavy task, bounded PCM memory, no browser farm.
for (const specimen of CATALOGUE) {
  if (resume) {
    try {
      const previous = JSON.parse(await readFile(new URL(`${specimen.id}.json`, directory), "utf8"));
      if (previous.recipe.version === VERSION && previous.seconds === seconds && previous.sampleRate === sampleRate
        && previous.atUTC === previous.recipe.originAt + at && previous.librarySha256 === SAMPLE_MANIFEST.sha256
        && previous.recipeHash === await recipeHash(specimenRecipe(specimen))) {
        const digest = createHash("sha256");
        for await (const chunk of createReadStream(new URL(`${specimen.id}.wav`, directory))) digest.update(chunk);
        if (digest.digest("hex") === previous.wavSha256) {
          items.push(previous); console.log(JSON.stringify({ id: specimen.id, resumed: true })); continue;
        }
      }
    } catch { /* Missing or stale files are rendered normally. */ }
  }
  await waitForAudioResources();
  const start = performance.now(); const score = new Score(specimenRecipe(specimen));
  const prepared = performance.now(); const channels = renderExcerpt(score, at, seconds, sampleRate, bank);
  const rendered = performance.now();
  let peak = 0; let sum = 0; let dc = 0;
  for (let i = 0; i < channels[0].length; i++) {
    const fade = Math.min(1, i / sampleRate / 1.4, (channels[0].length - 1 - i) / sampleRate / 1.4);
    for (const channel of channels) {
      const value = channel[i]! * fade;
      if (!Number.isFinite(value)) throw new Error(`Nonfinite PCM in ${specimen.id}`);
      channel[i] = value; peak = Math.max(peak, Math.abs(value)); sum += value ** 2; dc += value;
    }
  }
  const bytes = wav(channels, sampleRate);
  const events = score.voicesBetween(at, at + seconds);
  const density = Array.from({ length: seconds * 4 }, (_, i) => score.voicesAt(at + i / 4).length);
  const participation = Array.from({ length: seconds * 4 }, (_, i) => new Set(score.voicesAt(at + i / 4).map(voice => voice.stemId)).size);
  const foreground = Array.from({ length: seconds * 4 }, (_, i) => score.voicesAt(at + i / 4).filter(voice => ["theme", "counter", "answer"].includes(voice.role)).length);
  const roles = Object.fromEntries([...new Set(events.map(event => event.role))].map(role => [role, events.filter(event => event.role === role).length]));
  const sections = [...new Set(events.map(event => event.section))];
  const noteKinds = Object.fromEntries(["structural", "passing", "suspension"].map(kind =>
    [kind, events.reduce((sum, voice) => sum + voice.notes.filter(note => note.kind === kind).length, 0)]));
  const metrics = { prepareMs: prepared - start, renderMs: rendered - prepared, peak,
    rms: Math.sqrt(sum / (channels[0].length * 2)), dc: dc / (channels[0].length * 2),
    meanVoices: density.reduce((a, b) => a + b, 0) / density.length, peakVoices: Math.max(...density),
    minParticipatingStems: Math.min(...participation), peakParticipatingStems: Math.max(...participation),
    peakMelodicLines: Math.max(...foreground),
    meanNotesPerPhrase: events.reduce((total, event) => total + event.notes.length, 0) / events.length, roles, sections,
    sectionsVisited: [...new Set(sections.map(section => score.sceneAt(section * score.world.sectionSlots * SLOT + .001).name))],
    noteKinds, granularPhrases: events.filter(voice => voice.granular).length,
    candidatePaths: events.reduce((sum, voice) => sum + voice.writing.alternatives, 0) };
  const recipe = score.recipe;
  const item = { ...specimen, biomeName: score.world.biome.name, root: score.root, theme: score.world.theme,
    tableau: score.world.tableau.title, emotion: score.world.tableau.emotion, intention: score.world.tableau.gesture,
    libraryVersion: SAMPLE_MANIFEST.version, librarySha256: SAMPLE_MANIFEST.sha256,
    seconds, sampleRate, atUTC: recipe.originAt + at, recipeHash: await recipeHash(recipe),
    themes: { A: score.world.theme, B: score.world.answer }, sectionSeconds: score.world.sectionSlots * SLOT,
    wav: `${specimen.id}.wav`, wavSha256: createHash("sha256").update(bytes).digest("hex"), metrics, recipe };
  await writeFile(new URL(`${specimen.id}.wav`, directory), bytes);
  await writeFile(new URL(`${specimen.id}.json`, directory), JSON.stringify(item, null, 2) + "\n");
  items.push(item);
  console.log(JSON.stringify({ id: specimen.id, biome: item.biomeName, ...metrics }));
}
if (new Set(items.map(item => item.wavSha256)).size !== 18) throw new Error("Duplicate excerpts");
await writeFile(new URL("index.json", directory), JSON.stringify({ version: VERSION, librarySha256: SAMPLE_MANIFEST.sha256, items }, null, 2) + "\n");
console.log("18 recettes et 18 extraits prêts dans dist/catalogue.");
