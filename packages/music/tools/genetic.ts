import {mkdir,readFile,writeFile,copyFile,unlink} from "node:fs/promises";
import {createHash} from "node:crypto";
import {performance} from "node:perf_hooks";
import {GENETIC_CATALOGUE,geneticRecipe} from "../src/genetic-catalogue.ts";
import {GENETIC_VERSION} from "../src/genetic-vocabulary.ts";
import {GENETIC_MANIFEST} from "../src/genetic-manifest.ts";
import {GeneticScore} from "../src/genetic-score.ts";
import {noteName} from "../src/connected-score.ts";
import {renderConnected} from "../src/connected-dsp.ts";
import {recipeHash} from "../src/identity.ts";
import {wav} from "../src/dsp.ts";
import {DAY} from "../src/model.ts";
import {SAMPLE_MANIFEST} from "../src/bank.ts";
import {COLOUR_MANIFEST} from '../src/colour-bank.ts';
import {waitForAudioResources} from "./resources.ts";

await waitForAudioResources();const {bank:original}=await import("./read-bank.ts");
const {colours}=await import('./read-colour-bank.ts');const bank={...original,colours};
const only=process.argv.find(arg=>arg.startsWith("--only="))?.slice(7);
const directory=new URL(only?'../dist/connected-0.2/':'../dist/connected-0.2-preparing/',import.meta.url);await mkdir(directory,{recursive:true});
const references=(await readFile(new URL("../../../catalogue/skus.csv",import.meta.url),"utf8")).trim().split(/\r?\n/).slice(1)
  .map(row=>row.split(";")).map(row=>({sku:Number(row[0]),species:row[2]!,colourName:row[3]!,colour:row[4]!}));
const items=[];
for(const specimen of GENETIC_CATALOGUE){
  if(only&&specimen.id!==only)continue;await waitForAudioResources();const start=performance.now();
  const score=new GeneticScore(geneticRecipe(specimen));
  if(score.world.style!==specimen.style)throw new Error(`Unexpected negotiated style: ${specimen.id}/${score.world.style}`);
  const atUTC=score.recipe.originAt+Math.ceil(45*DAY/score.world.cycleSeconds)*score.world.cycleSeconds;
  const seconds=score.world.cycleSeconds;const rate=24_000;const channels=renderConnected(score,atUTC,seconds,bank,rate);
  let peak=0,power=0,dc=0;for(const channel of channels)for(const value of channel){peak=Math.max(peak,Math.abs(value));power+=value*value;dc+=value;}
  const bytes=wav(channels,rate);const events=score.notesBetween(atUTC,atUTC+seconds).map(note=>({...note,at:note.at-atUTC}));
  const parts=score.parts.map(part=>({...part,anchor:events.find(note=>note.stemId===part.stemId&&note.at>=0)?.midi??null,
    notes:[...new Set(events.filter(note=>note.stemId===part.stemId&&note.midi!==null).map(note=>note.midi!))].sort((a,b)=>a-b),strength:score.lifeAt(atUTC).get(part.stemId)!}));
  const metadata={version:GENETIC_VERSION,...specimen,world:score.world,atUTC,seconds,sampleRate:rate,recipeHash:await recipeHash(score.recipe),
    librarySha256:SAMPLE_MANIFEST.sha256,colourSha256:COLOUR_MANIFEST.sha256,writingSha256:GENETIC_MANIFEST.sha256,wavSha256:createHash("sha256").update(bytes).digest("hex"),
    metrics:{renderMs:performance.now()-start,peak,rms:Math.sqrt(power/(channels[0].length*2)),dc:dc/(channels[0].length*2),
      events:events.length,participatingFlowers:new Set(events.map(note=>note.stemId)).size},
    references:references.filter(reference=>score.recipe.stems.some(stem=>stem.sku===reference.sku)),parts,events,recipe:score.recipe};
  if(metadata.metrics.participatingFlowers!==specimen.count)throw new Error("Missing genetic flower");
  await writeFile(new URL(`${specimen.id}.wav`,directory),bytes);const json=JSON.stringify(metadata);await writeFile(new URL(`${specimen.id}.json`,directory),json);
  const {parts:ignoredParts,events:ignoredEvents,recipe:ignoredRecipe,...item}=metadata;
  items.push({...item,jsonSha256:createHash("sha256").update(json).digest("hex"),key:`${noteName(60+score.world.tonic).replace(/\d+$/,"")} ${score.world.modeName}`});
  console.log(JSON.stringify({id:specimen.id,style:score.world.style,seconds,...metadata.metrics}));
}
if(!only){
  if(new Set(items.map(item=>item.wavSha256)).size!==10||new Set(items.map(item=>item.world.style)).size!==10)throw new Error("Repeated musical universe");
  const published=new URL('../dist/connected-0.2/',import.meta.url);await mkdir(published,{recursive:true});
  // Keep the previous complete collection available while the next one is rendering.
  for(const item of items)for(const extension of ['wav','json']){
    const source=new URL(`${item.id}.${extension}`,directory);await copyFile(source,new URL(`${item.id}.${extension}`,published));await unlink(source);
  }
  await writeFile(new URL("index.json",published),JSON.stringify({version:GENETIC_VERSION,writing:GENETIC_MANIFEST,items})+"\n");
}
