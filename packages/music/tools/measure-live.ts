import {readFile,writeFile} from 'node:fs/promises';
import {waitForAudioResources} from './resources.ts';
import {fixture,fixtureSeed} from '../src/fixtures.ts';
import {DAY,createProfile} from '../src/model.ts';
import {SignatureScore} from '../src/signature-score.ts';
import {signatureForSKU,SIGNATURE_STYLES,nearestEdges} from '../src/signature.ts';
import {LiveRenderer} from '../src/live-dsp.ts';
import {bank as original} from './read-bank.ts';
import {colours} from './read-colour-bank.ts';
import {UNIVERSE_MANIFEST} from '../src/universe-manifest.ts';
import {decodeUniverses} from '../src/universe-bank.ts';
await waitForAudioResources();const raw=await readFile(new URL('../assets/universes.pcm',import.meta.url));
const chunks=Object.entries(UNIVERSE_MANIFEST.instruments).map(([instrument,metadata])=>{const start=UNIVERSE_MANIFEST.samples.find(sample=>sample.instrument===instrument)!.offset;
  return {instrument,bank:'universes' as const,bytes:raw.buffer.slice(raw.byteOffset+start,raw.byteOffset+start+metadata.bytes) as ArrayBuffer};});
const bank={...original,colours:new Map([...colours,...decodeUniverses({chunks})])};const results=[];
for(const count of [1,5,12,40,80,350]){
  await waitForAudioResources();const base=fixture(count);const recipe={...base,stems:base.stems.map((stem,i)=>{const sku=1+i%3771,gene=signatureForSKU(sku),style=SIGNATURE_STYLES.find(style=>style.id===gene.style)!;
    return {...stem,sku,profile:{...createProfile(fixtureSeed(i+1)),timbre:style.palette[i%style.palette.length]!}};})};
  const score=new SignatureScore(recipe,nearestEdges(recipe)),renderer=new LiveRenderer(score,bank),at=45*DAY;
  const start=performance.now(),first=renderer.render(at,at+24),initialMs=performance.now()-start;
  const again=performance.now(),next=renderer.render(at+8,at+32),refillMs=performance.now()-again;
  let peak=0,squares=0;for(const sample of first.left){peak=Math.max(peak,Math.abs(sample));squares+=sample*sample;}
  const result={count,initialMs,refillMs,peak,rms:Math.sqrt(squares/first.left.length),frames:next.left.length};results.push(result);console.log(JSON.stringify(result));
  await writeFile(new URL('../out/live-measures.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
}
await writeFile(new URL('../out/live-measures.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
