import {fixtureSeed} from "./fixtures.ts";
import {createProfile,freezeRecipe,unit,type Profile,type Recipe} from "./model.ts";
import {connectedRecipe,CONNECTED_CATALOGUE,type ConnectedSpecimen} from "./connected-catalogue.ts";
import {styleFor} from "./genetic-vocabulary.ts";
import {GENETIC_POOLS} from "./genetic-references.ts";
import {instrumentFor} from "./library.ts";
import {soundGene} from './sound-colours.ts';
import type {ReferenceGenome} from "./genetic-vocabulary.ts";

interface GeneticReference {readonly sku:number;readonly species:string;readonly colourName:string;readonly colour:string;readonly genome:ReferenceGenome}
const pools:readonly {readonly style:string;readonly references:readonly GeneticReference[]}[]=GENETIC_POOLS;

const styleIds=["pastoral","music-box","town-waltz","library","folk-round","woodland","storybook","sky-lullaby","fairground","chorale"];
export const GENETIC_CATALOGUE=CONNECTED_CATALOGUE.map((specimen,i)=>Object.freeze({...specimen,style:styleIds[i]!}));
export const GENETIC_REFERENCES=pools.flatMap(pool=>pool.references);
function profileFor(specimen:ConnectedSpecimen,style:string,index:number):Profile {
  const palette=styleFor(style).palette;
  const anchors=[['harp','ukulele','music-box','toy-piano','piano','thumb-piano'],['oboe','clarinet','recorder','ocarina','flute'],
    ['flute','ocarina','piano','choir','clarinet'],['cello','felt-bass','bassoon','cello-pizz','piano'],['choir','viola','harmonium','strings','thumb-piano','harp','piano']];
  const preferred=anchors[index]?.find(id=>palette.some(timbre=>timbre===id));
  const base=25_000_000+specimen.count*1_000_000+specimen.variant*500_000+index*1000;
  for(let candidate=0;candidate<10000;candidate++){
    const profile=createProfile(fixtureSeed(base+candidate));
    if(palette.includes(profile.timbre)&&(!preferred||profile.timbre===preferred)&&(index>=5||instrumentFor(profile.timbre).kind!=="texture")&&(index>=3||!soundGene(profile).percussive))return profile;
  }
  throw new Error("Cannot prepare genetic sound identity");
}
export function geneticRecipe(specimen:typeof GENETIC_CATALOGUE[number]):Recipe {
  const base=connectedRecipe(specimen);const style=specimen.style;
  const pool=pools.find(pool=>pool.style===style)!;
  const secondary=pools[(pools.indexOf(pool)+3)%pools.length]!;
  const seed=fixtureSeed(16_000_000+specimen.count*10+specimen.variant);
  return freezeRecipe({...base,seed,stems:base.stems.map((stem,i)=>({...stem,
    sku:(i%5===4?secondary:pool).references[(i*5+specimen.variant)%6]!.sku,
    profile:profileFor(specimen,style,i),position:{...stem.position,z:stem.position.z*(.7+unit(seed,9690)*.3)},
  }))});
}
