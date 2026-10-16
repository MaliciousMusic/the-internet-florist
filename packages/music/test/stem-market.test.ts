import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateOffers,type StemOffer} from '../src/stem-market.ts';
import {anniversary,createProfile} from '../src/model.ts';
const seed='0x'+'12'.repeat(32),issuedAt=1_760_000_000,now=issuedAt+100;
const offer:StemOffer={source:'inventory',stem:{id:'12',sku:23,issuedAt,expiresAt:anniversary(issuedAt),opening:{from:issuedAt,until:issuedAt+20,opens:true},position:{x:0,y:0,z:0},profile:createProfile(seed)}};
test('catalogue selection retains an immutable exemplar and permits only placement changes',()=>{
  const frozen=validateOffers([offer],23,'inventory',new Map(),now)[0]!;
  assert.ok(Object.isFrozen(frozen.stem.profile));
  const known=new Map([['12',frozen]]);
  assert.doesNotThrow(()=>validateOffers([{...offer,stem:{...offer.stem,position:{x:.4,y:0,z:.2}}}],23,'inventory',known,now));
  assert.throws(()=>validateOffers([{...offer,stem:{...offer.stem,profile:{...offer.stem.profile,brightness:.2}}}],23,'inventory',known,now),/Changed exemplar/);
});
test('catalogue rejects duplicate, expired, future and mismatched exemplars before selection',()=>{
  assert.throws(()=>validateOffers([offer,offer],23,'inventory',new Map(),now),/repeated/);
  assert.throws(()=>validateOffers([offer],24,'inventory',new Map(),now),/Wrong/);
  assert.throws(()=>validateOffers([offer],23,'hotel',new Map(),now),/Wrong/);
  assert.throws(()=>validateOffers([offer],23,'inventory',new Map(),offer.stem.expiresAt),/Unavailable/);
  assert.throws(()=>validateOffers([offer],23,'inventory',new Map(),issuedAt-1),/Unavailable/);
});
