import { SignatureScore } from './signature-score.ts';
import { LiveRenderer } from './live-dsp.ts';
import { decodeBank, type BankPayload } from './bank.ts';
import { decodeUniverses, type UniversePayload } from './universe-bank.ts';
import type { Edge } from './signature.ts';
import type { Recipe } from './model.ts';
let renderer:LiveRenderer|undefined;
self.onmessage=(event:MessageEvent<{type:'init'|'prepare';recipe?:Recipe;edges?:readonly Edge[];bank?:BankPayload;universes?:UniversePayload;from:number;until:number}>)=>{
  try{
    const message=event.data;
    if(message.type==='init'){
      if(!message.recipe||!message.bank||!message.universes)throw new Error('Missing live ensemble');
      renderer=new LiveRenderer(new SignatureScore(message.recipe,message.edges),{...decodeBank(message.bank),colours:decodeUniverses(message.universes)});
    }
    if(!renderer)throw new Error('Live ensemble not initialized');
    const start=performance.now();const audio=renderer.render(message.from,message.until);
    self.postMessage({type:'prepared',from:message.from,until:message.until,voices:[],audio,preparationMs:performance.now()-start},{transfer:[audio.left.buffer,audio.right.buffer]});
  }catch(error){self.postMessage({type:'error',message:String(error)});}
};
