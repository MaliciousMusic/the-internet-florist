import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {signatureForSKU,signatureSound,nearestEdges,moveFlower,relaxFlowers,freezeEdges,SIGNATURE_SOUNDS} from '../src/signature.ts';
import {SignatureScore} from '../src/signature-score.ts';
import {SIGNATURE_MANIFEST} from '../src/signature-manifest.ts';
import {UNIVERSE_MANIFEST} from '../src/universe-manifest.ts';
import {decodeUniverses,verifyUniverses,type UniversePayload} from '../src/universe-bank.ts';
import {freezeComposition,compositionHash,type Composition} from '../src/composition-identity.ts';
import {fixture,fixtureSeed} from '../src/fixtures.ts';
import {createProfile,DAY} from '../src/model.ts';
import {LiveRenderer} from '../src/live-dsp.ts';
import {bank as original} from '../tools/read-bank.ts';
import {colours} from '../tools/read-colour-bank.ts';

const raw=await readFile(new URL('../assets/universes.pcm',import.meta.url));
const chunks=Object.entries(UNIVERSE_MANIFEST.instruments).map(([instrument,metadata])=>{
  const start=UNIVERSE_MANIFEST.samples.find(record=>record.instrument===instrument)!.offset;
  return {instrument,bank:'universes' as const,bytes:raw.buffer.slice(raw.byteOffset+start,raw.byteOffset+start+metadata.bytes) as ArrayBuffer};
});
const payload:UniversePayload={chunks};
const bank={...original,colours:new Map([...colours,...decodeUniverses(payload)])};
const realFixture=(count:number)=>{const recipe=fixture(count);return {...recipe,stems:recipe.stems.map((stem,i)=>({...stem,sku:i+1}))};};
const exact=():Composition=>{const recipe=realFixture(5);return freezeComposition({version:'belai-composition/1',recipe,edges:nearestEdges(recipe),drawingSha256:'a'.repeat(64),musicSha256:'b'.repeat(64),vaseId:'cylindre-verre-clair'});};

test('all 3771 references have distinct contours and distinct compiled solo melodies, with a pinned grammar',async()=>{
  const catalogue=(await readFile(new URL('../assets/signature-catalogue.json',import.meta.url),'utf8')).trimEnd();
  assert.equal(createHash('sha256').update(catalogue).digest('hex'),SIGNATURE_MANIFEST.sha256);
  const contours=new Set<string>(),melodies=new Set<string>();const base=fixture(1);
  for(let sku=1;sku<=3771;sku++){
    const gene=signatureForSKU(sku);contours.add(JSON.stringify(gene.contour));
    const profile={...createProfile(fixtureSeed(1)),timbre:'piano' as const,register:0};
    const recipe={...base,stems:base.stems.map(stem=>({...stem,sku,profile}))};const score=new SignatureScore(recipe,[]);
    const skeleton=Array.from({length:16},(_,bar)=>score.notesForBar(bar).map(note=>[note.midi,Number((note.duration/score.world.barSeconds).toFixed(5))]));
    melodies.add(JSON.stringify(skeleton));
  }
  assert.equal(contours.size,3771);assert.equal(melodies.size,3771);assert.throws(()=>signatureForSKU(0));assert.throws(()=>signatureForSKU(3772));
});

test('moving and editing explicit connections changes the composition and reception while preserving all exemplar profiles',async()=>{
  const before=exact(),moved=freezeComposition({...before,recipe:moveFlower(before.recipe,before.recipe.stems[0]!.id,.95,-.8)});
  assert.notEqual(await compositionHash(before),await compositionHash(moved));
  const connected=new SignatureScore(before.recipe,before.edges),cut=new SignatureScore(before.recipe,[]);
  assert(connected.parts.some(part=>part.influence>0));assert(cut.parts.every(part=>part.links.length===0&&part.influence===0));
  assert.deepEqual(connected.parts.map(part=>part.soundColour),cut.parts.map(part=>part.soundColour));
  const relaxed=relaxFlowers(before.recipe,before.edges);assert.notDeepEqual(relaxed.stems.map(stem=>stem.position),before.recipe.stems.map(stem=>stem.position));
  assert.deepEqual(relaxed.stems.map(stem=>stem.profile),before.recipe.stems.map(stem=>stem.profile));
  const shuffled=freezeComposition({...before,recipe:{...before.recipe,stems:[...before.recipe.stems].reverse()},edges:[...before.edges].reverse().map(edge=>({a:edge.b,b:edge.a}))});
  assert.equal(await compositionHash(before),await compositionHash(shuffled));
  assert.notEqual(await compositionHash(before),await compositionHash({...before,vaseId:'coupe-blanche'}));
  const native=freezeComposition({...before,drawing:{seed:7,preferences:[['rose/0',{side:0,depth:0}]]}});
  assert(Object.isFrozen(native.drawing));assert(Object.isFrozen(native.drawing!.preferences));
  assert.notEqual(await compositionHash(native),await compositionHash({...native,drawing:{...native.drawing,seed:8}}));
  assert.throws(()=>freezeEdges(before.recipe,[{a:'0',b:before.recipe.stems[0]!.id}]));assert.throws(()=>freezeEdges(before.recipe,[before.edges[0]!,before.edges[0]!]));
});

test('361 additional takes are licensed, bounded, verified and cannot accept a damaged or duplicate bank',async()=>{
  assert.equal(UNIVERSE_MANIFEST.samples.length,361);assert.equal(UNIVERSE_MANIFEST.families.length,92);assert.equal(SIGNATURE_SOUNDS.length,332);
  assert.equal(createHash('sha256').update(raw).digest('hex'),UNIVERSE_MANIFEST.sha256);
  assert(UNIVERSE_MANIFEST.samples.every(record=>record.license==='CC0-1.0'&&record.seconds<=5.001));
  await verifyUniverses(payload);
  const first=chunks[0]!,bytes=first.bytes.slice(0);new Uint8Array(bytes)[100]!^=1;
  await assert.rejects(verifyUniverses({chunks:[{...first,bytes}]}));await assert.rejects(verifyUniverses({chunks:[first,first]}));
});

test('every individual sound produces finite audible held and attacked PCM, including short recordings',()=>{
  const base=realFixture(1),at=45*DAY;
  for(const sound of SIGNATURE_SOUNDS){
    const recipe={...base,stems:base.stems.map(stem=>({...stem,profile:{...stem.profile,timbre:sound.parent}}))};
    const score=new SignatureScore(recipe,[]),part={...score.parts[0]!,soundColour:sound.id,gain:.2};
    for(const articulation of ['held','plucked'] as const){
      const renderer=new LiveRenderer({recipe:score.recipe,parts:[part],acousticSpace:.1,notesBetween:()=>[
        {stemId:part.stemId,sku:part.sku,role:'theme',timbre:sound.parent,at:recipe.originAt+at,duration:2,midi:60,velocity:.8,articulation,bar:0}
      ]},bank);
      const pcm=renderer.render(at,at+2.2);
      assert(pcm.left.every(Number.isFinite),sound.id);assert(pcm.left.some(value=>Math.abs(value)>.00001),`${sound.id}/${articulation}`);
    }
  }
});

test('live samples remain continuous across UTC windows and disappear at expiry without omitting any flower',()=>{
  const recipe=realFixture(12),score=new SignatureScore(recipe,nearestEdges(recipe));const renderer=new LiveRenderer(score,bank);
  const at=45*DAY+score.world.barSeconds*2;
  const first=renderer.render(at,at+2),overlap=renderer.render(at+.8,at+2.8);
  assert(first.left.some(value=>Math.abs(value)>.0001));assert(first.left.every(Number.isFinite));
  const shift=overlap.firstFrame-first.firstFrame;let error=0;
  for(let i=0;i<first.left.length-shift;i++)error=Math.max(error,Math.abs(first.left[i+shift]!-overlap.left[i]!));
  assert(error<.00008,`overlap error ${error}`);
  const events=score.notesBetween(recipe.originAt+at,recipe.originAt+at+score.world.cycleSeconds);
  assert.equal(new Set(events.map(note=>note.stemId)).size,12);
  const expiry=Math.max(...recipe.stems.map(stem=>stem.expiresAt))-recipe.originAt;
  assert(renderer.render(expiry,expiry+1).left.every(value=>value===0));
});

test('a recorded unpitched soliflore retains a varied pitched melody and its original sound',()=>{
  const base=realFixture(1);let found:ReturnType<typeof createProfile>|undefined;
  for(let i=1;i<20000;i++){const profile={...createProfile(fixtureSeed(i)),timbre:'woodblock-soft' as const};if(signatureSound(profile).percussive){found=profile;break;}}
  assert(found);const recipe={...base,stems:base.stems.map(stem=>({...stem,profile:found!}))};const score=new SignatureScore(recipe,[]);
  const events=Array.from({length:12},(_,bar)=>score.notesForBar(bar)).flat();assert(new Set(events.map(note=>note.midi)).size>2);
  const at=45*DAY;assert(new LiveRenderer(score,bank).render(at,at+2).left.some(value=>Math.abs(value)>.001));
});
