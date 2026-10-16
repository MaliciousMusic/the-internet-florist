import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {GeneticScore} from '../src/genetic-score.ts';
import {GENETIC_CATALOGUE,geneticRecipe} from '../src/genetic-catalogue.ts';
import {genomeForSKU,STYLES,MOTIFS,RHYTHMS,GENOME_VERSION} from '../src/genetic-vocabulary.ts';
import {GENETIC_MANIFEST} from '../src/genetic-manifest.ts';
import {soundGene,SOUND_COLOURS} from '../src/sound-colours.ts';
import {decodeColours,verifyColours,loadRecipeColours,COLOUR_MANIFEST,colourUrl} from '../src/colour-bank.ts';
import {renderConnected} from '../src/connected-dsp.ts';
import {bank as original} from '../tools/read-bank.ts';
import {colours,colourBytes} from '../tools/read-colour-bank.ts';
import {fixture,fixtureSeed} from '../src/fixtures.ts';
import {DAY,createProfile} from '../src/model.ts';
import {instrumentFor} from '../src/library.ts';
const bank={...original,colours};
const time=(score:GeneticScore)=>score.recipe.originAt+Math.ceil(45*DAY/score.world.cycleSeconds)*score.world.cycleSeconds;

test('writing database covers real SKU references and genuinely different musical grammars',async()=>{
  const text=(await readFile(new URL('../assets/writing-catalogue.json',import.meta.url),'utf8')).trimEnd();
  const data=JSON.parse(text) as {version:string;references:{sku:number;genome:ReturnType<typeof genomeForSKU>}[]};
  assert.equal(createHash('sha256').update(text).digest('hex'),GENETIC_MANIFEST.sha256);
  assert.equal(data.version,GENOME_VERSION);assert.equal(data.references.length,3771);
  for(const ref of data.references)assert.deepEqual(ref.genome,genomeForSKU(ref.sku));
  assert.equal(STYLES.length,12);assert.equal(MOTIFS.length,96);assert.equal(RHYTHMS.length,18);assert.equal(SOUND_COLOURS.length,240);
  assert.equal(new Set(MOTIFS.map(motif=>JSON.stringify(motif.contour))).size,96);
  assert.equal(new Set(STYLES.map(style=>JSON.stringify([style.meter,style.mode,style.form,style.progression]))).size,12);
  assert.throws(()=>genomeForSKU(-1));assert.throws(()=>genomeForSKU(1.5));
});

test('ten arrangements negotiate ten styles while all 974 flowers participate in their real registers',()=>{
  let participants=0;const styles=new Set<string>();const forms=new Set<string>();
  for(const specimen of GENETIC_CATALOGUE){
    const score=new GeneticScore(geneticRecipe(specimen));const at=time(score);const events=score.notesBetween(at,at+score.world.cycleSeconds);
    assert.equal(score.world.style,specimen.style);styles.add(score.world.style);forms.add(JSON.stringify(score.world.sections.map(section=>section.bars)));
    assert.equal(new Set(events.map(note=>note.stemId)).size,specimen.count);participants+=specimen.count;
    assert(events.some(note=>note.role==='theme'));assert(events.some(note=>note.role==='bass'||note.role==='harmony'));
    assert(score.parts.filter(part=>part.role==='bass').every(part=>instrumentFor(part.timbre).range[0]<=48));
    if(specimen.count===5){assert(new Set(score.parts.map(part=>part.timbre)).size>=4);assert(events.some(note=>note.role==='bass'&&note.midi!==null&&note.midi<=55));}
    for(const part of score.parts){
      const stem=score.recipe.stems.find(stem=>stem.id===part.stemId)!;
      assert.deepEqual(part.genome,genomeForSKU(stem.sku));assert.equal(part.soundColour,soundGene(stem.profile).id);assert.equal(part.timbre,stem.profile.timbre);
      const solo=new GeneticScore({...score.recipe,stems:[stem]});assert.equal(solo.parts[0]!.soundColour,part.soundColour);
    }
    for(const note of events)if(note.midi!==null){const range=instrumentFor(note.timbre).range;assert(note.midi>=range[0]&&note.midi<=range[1]);}
    const peakVoices=Math.max(...Array.from({length:100},(_,i)=>{
      const instant=at+i*score.world.cycleSeconds/100;return new Set(events.filter(note=>note.at<=instant&&note.at+note.duration>instant).map(note=>note.stemId)).size;
    }));
    assert(peakVoices>=Math.ceil(specimen.count*.4),`${specimen.id}: ${peakVoices} voices`);
  }assert.equal(participants,974);assert.equal(styles.size,10);assert(forms.size>=5);
});

test('reference genes change the score, input order is stable and individual sounds survive SKU replacement',()=>{
  const recipe=geneticRecipe(GENETIC_CATALOGUE[0]!);const score=new GeneticScore(recipe);const at=time(score);
  assert.deepEqual(new GeneticScore({...recipe,stems:[...recipe.stems].reverse()}).notesBetween(at,at+10),score.notesBetween(at,at+10));
  const changed=new GeneticScore({...recipe,stems:recipe.stems.map(stem=>({...stem,sku:stem.sku+2000}))});
  assert.deepEqual(changed.parts.map(part=>part.soundColour),score.parts.map(part=>part.soundColour));
  const music=(value:GeneticScore)=>value.notesForBar(4).map(({sku,stemId,...note})=>note);
  assert.notDeepEqual(music(changed),music(score));
});

test('licensed additional recordings have unique verified takes and selective chunks resist corruption',async()=>{
  assert.equal(COLOUR_MANIFEST.samples.length,25);assert.equal(new Set(COLOUR_MANIFEST.samples.map(sample=>sample.sha256)).size,25);
  assert.equal(colours.size,12);assert.equal(COLOUR_MANIFEST.bytes,colourBytes.byteLength);
  const id='recorded-claves';const records=COLOUR_MANIFEST.samples.filter(record=>record.instrument===id);const metadata=COLOUR_MANIFEST.instruments[id];
  const bytes=colourBytes.slice(records[0]!.offset,records[0]!.offset+metadata.bytes);const payload={chunks:[{instrument:id,bytes}]};
  await verifyColours(payload);assert.deepEqual(decodeColours(payload).get(id),colours.get(id));assert(colourUrl(id).includes(metadata.sha256.slice(0,12)));
  const damaged=bytes.slice(0);const view=new Uint8Array(damaged);view[100]=view[100]!^1;
  await assert.rejects(verifyColours({chunks:[{instrument:id,bytes:damaged}]}));
  assert.throws(()=>decodeColours({chunks:[...payload.chunks,...payload.chunks]}));assert.throws(()=>decodeColours({chunks:[{instrument:'invented',bytes}]}));
  assert.throws(()=>decodeColours(colourBytes.slice(2)));
});

test('new percussion is an unpitched recorded voice and a percussion soliflore still varies melodically',()=>{
  let profile=createProfile(fixtureSeed(0));let i=0;while(!soundGene(profile).percussive)profile=createProfile(fixtureSeed(++i));
  const recipe=fixture(1);const stem={...recipe.stems[0]!,profile};const score=new GeneticScore({...recipe,stems:[stem]});
  const events=Array.from({length:8},(_,bar)=>score.notesForBar(bar)).flat();assert(new Set(events.map(note=>note.midi)).size>=3);
  const at=time(score);const pcm=renderConnected(score,at,3,bank,12_000,false);assert(pcm[0].some(value=>Math.abs(value)>.002));
  assert.throws(()=>renderConnected(score,at,1,original,12_000),/Missing individual sound/);
  let melodic=createProfile(fixtureSeed(++i));while(melodic.timbre!=='flute')melodic=createProfile(fixtureSeed(++i));
  const ensemble=new GeneticScore({...recipe,stems:[stem,{...stem,id:'2',profile:melodic}]});
  const part=ensemble.parts.find(part=>part.stemId==='1')!;
  assert.equal(part.role,'pulse');assert(ensemble.notesForBar(1).filter(note=>note.stemId==='1').every(note=>note.midi===null));
});

test('isolated new voices fetch only their recorded identity, reuse verification and synthesis remains offline',async()=>{
  let i=0;let profile=createProfile(fixtureSeed(i));while(!soundGene(profile).recording)profile=createProfile(fixtureSeed(++i));
  const recipe=fixture(1);const input={...recipe,stems:[{...recipe.stems[0]!,profile}]};const recording=soundGene(profile).recording!;
  const saved=globalThis.fetch;const requests:string[]=[];
  globalThis.fetch=(async(resource:Parameters<typeof fetch>[0])=>{
    const url=String(resource);requests.push(url);assert(url.endsWith(colourUrl(recording)));
    const records=COLOUR_MANIFEST.samples.filter(record=>record.instrument===recording);
    const length=COLOUR_MANIFEST.instruments[recording as keyof typeof COLOUR_MANIFEST.instruments].bytes;
    return new Response(colourBytes.slice(records[0]!.offset,records[0]!.offset+length));
  }) as typeof fetch;
  try{
    const payload=await loadRecipeColours(input,'http://test.invalid/isolated/');assert.equal(decodeColours(payload).size,1);
    await loadRecipeColours(input,'http://test.invalid/isolated/');assert.equal(requests.length,1);
    let synth=createProfile(fixtureSeed(++i));while(instrumentFor(synth.timbre).kind!=='synth'||soundGene(synth).recording)synth=createProfile(fixtureSeed(++i));
    assert.equal(decodeColours(await loadRecipeColours({...input,stems:[{...input.stems[0]!,profile:synth}]})).size,0);assert.equal(requests.length,1);
  }finally{globalThis.fetch=saved;}
});

test('genetic audio seeks on UTC, responds to geometry and stays silent after expiry',()=>{
  const recipe=geneticRecipe(GENETIC_CATALOGUE[1]!);const score=new GeneticScore(recipe);const at=time(score);
  const full=renderConnected(score,at,5,bank,12_000,false);const sought=renderConnected(score,at+2,2,bank,12_000,false);
  let error=0;for(let ch=0;ch<2;ch++)for(let i=0;i<sought[ch]!.length;i++)error=Math.max(error,Math.abs(sought[ch]![i]!-full[ch]![i+24000]!));
  assert(error<.00003,`seek error ${error}`);
  const moved=new GeneticScore({...recipe,stems:recipe.stems.map((stem,i)=>i===0?{...stem,position:{x:-.95,y:.9,z:-.8}}:stem)});
  const movedPCM=renderConnected(moved,at,2,bank,12_000,false);assert.notDeepEqual(movedPCM[0],full[0].subarray(0,24000));
  const expires=Math.max(...recipe.stems.map(stem=>stem.expiresAt));assert(renderConnected(score,expires,1,bank,12_000).every(channel=>channel.every(value=>value===0)));
});
