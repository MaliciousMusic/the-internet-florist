import {VERSION,freezeRecipe,type Stem} from './model.ts';

export type StemSource='inventory'|'criee'|'hotel'|'preview';
export interface StemOffer {readonly source:StemSource;readonly stem:Stem;readonly label?:string;readonly priceLabel?:string}
/** A read-only catalogue adapter. Selection does not buy, issue or transfer a stem. */
export interface StemMarket {list(query:{sku:number;source:Exclude<StemSource,'preview'>}):Promise<readonly StemOffer[]>}

const identity=(stem:Stem)=>JSON.stringify({...stem,position:{x:0,y:0,z:0}});
export function validateOffers(offers:readonly StemOffer[],sku:number,source:StemSource,
  known:ReadonlyMap<string,StemOffer>=new Map(),now=Math.floor(Date.now()/1000)):readonly StemOffer[] {
  if(!Array.isArray(offers)||offers.length>500)throw new Error('Invalid stem catalogue');
  const ids=new Set<string>();
  return Object.freeze(offers.map(offer=>{
    if(offer.source!==source||offer.stem.sku!==sku||ids.has(offer.stem.id))throw new Error('Wrong source, reference or repeated exemplar');
    ids.add(offer.stem.id);
    const stem=freezeRecipe({version:VERSION,seed:offer.stem.profile.seed,originAt:offer.stem.issuedAt,harmony:'clear',stems:[offer.stem]}).stems[0]!;
    if(stem.issuedAt>now||stem.expiresAt<=now)throw new Error('Unavailable stem');
    const previous=known.get(stem.id);if(previous&&identity(previous.stem)!==identity(stem))throw new Error('Changed exemplar identity');
    for(const text of[offer.label,offer.priceLabel])if(text!==undefined&&(typeof text!=='string'||text.length>180))throw new Error('Invalid offer label');
    return Object.freeze({...offer,stem});
  }));
}
