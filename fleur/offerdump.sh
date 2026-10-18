#!/bin/sh
# offerdump.sh <tag> : what the shop list, the swap sheet and the composer's fillers OFFER (retired colourways, ret:1, must be absent),
# written to refcache/offer-<tag>.txt. Builds lab/offerdump.html = demo7.html (run mkapp.sh first) + lab/offerdump_ids.js, one headless Chrome through the gate.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1
REL="$(pwd -W 2>/dev/null | sed 's#.*/flower-atelier/##')"
cat > lab/offerdump_ids.js <<'JS'
<script>
setTimeout(()=>{const L=[],out=s=>L.push(s);
try{
const SIDS=['anemone-coronaria','anemone-sauvage'],flat=r=>r.flatMap(x=>x[1]);
IO.observe=function(){};/* debug page: no card is drawn */
for(const sid of SIDS){const cw=CWS[sid]||[],ps=PRODUCTS.filter(p=>p.sid===sid);
  out(`${sid} : coloris dans CWS=${cw.length}, retires=${cw.filter(w=>w.ret).length}, offerts=${cw.filter(w=>!w.ret).length} ; produits dans PRODUCTS=${ps.length}, retires=${ps.filter(p=>p.ret).length}, offerts=${ps.filter(p=>!p.ret).length}`)}
out(`PRODUCTS=${PRODUCTS.length}, retires=${PRODUCTS.filter(p=>p.ret).length}, PBY retires=${Object.values(PBY).filter(p=>p.ret).length}`);
/* 1. the shop list (flowerList), by sort, search and occasion */
const cnt=(l,sid)=>l.filter(p=>p.sid===sid).length,retN=l=>l.filter(p=>p.ret).length;
for(const fs of['col','prix','nom']){S.fsort=fs;S.q='';S.cocc='tous';const l=flat(flowerList());out(`boutique tri=${fs} : ${l.length} produits, dont retires ${retN(l)} ; coronaria ${cnt(l,SIDS[0])}, sauvage ${cnt(l,SIDS[1])}`)}
S.fsort='col';S.cocc='tous';for(const q of['anémone','anemone sauvage','blanc','lilas']){S.q=q;const l=flat(flowerList());out(`boutique recherche « ${q} » : ${l.length} produits, dont retires ${retN(l)} ; coronaria ${cnt(l,SIDS[0])}, sauvage ${cnt(l,SIDS[1])}`)}
S.q='';for(const o of Object.keys(OCCS)){S.cocc=o;const l=flat(flowerList());out(`boutique occasion=${o} : ${l.length} produits, dont retires ${retN(l)} ; coronaria ${cnt(l,SIDS[0])}, sauvage ${cnt(l,SIDS[1])}`)}
S.cocc='tous';
/* 2. the shop as drawn into the page: cards and the counters of the family sections */
renderFlowers();const cards=[...document.querySelectorAll('#fList .fcard')],ids=cards.map(c=>c.dataset.p),secN=[...document.querySelectorAll('#fList .fsec small')].reduce((a,s)=>a+(parseInt(s.textContent)||0),0);
out(`page boutique : ${cards.length} cartes, somme des compteurs de familles ${secN}, cartes retirees ${ids.filter(i=>PBY[i].ret).length} ; cartes coronaria ${ids.filter(i=>i.startsWith(SIDS[0]+'~')).length} (${ids.filter(i=>i.startsWith(SIDS[0]+'~')).map(i=>i.split('~')[1]).join(',')}), cartes sauvage ${ids.filter(i=>i.startsWith(SIDS[1]+'~')).length} (${ids.filter(i=>i.startsWith(SIDS[1]+'~')).map(i=>i.split('~')[1]).join(',')})`);
/* 3. the swap sheet of a model (Echanger), every element of the models that hold an anemone, plus the first element of three other models */
const sl=Array.prototype.slice;Array.prototype.slice=function(a,b){return a===0&&b===60?sl.call(this):sl.apply(this,arguments)};/* the sheet keeps 60 cards: lift that cap to see the whole list */
let nSw=0,swRet=0;const swSeen={};
try{const picks=[];MODELS.forEach((m,mi)=>{if(m.els.some(e=>SIDS.includes(e.id)))m.els.forEach((e,i)=>picks.push([mi,i]))});let extra=0;MODELS.forEach((m,mi)=>{if(extra<3&&!m.els.some(e=>SIDS.includes(e.id))){picks.push([mi,0]);extra++}});
  for(const[mi,i]of picks){S.model=JSON.parse(JSON.stringify(MODELS[mi]));try{swapSheet(i)}catch(e){out('swapSheet erreur '+e.message);continue}
    const g=[...document.querySelectorAll('#swG .fcard')].map(c=>c.dataset.p);nSw++;swRet+=g.filter(x=>PBY[x].ret).length;for(const x of g)if(SIDS.some(s=>x.startsWith(s+'~')))swSeen[x]=1}}
finally{Array.prototype.slice=sl}
closeSheet();
out(`feuille Echanger : ${nSw} feuilles testees, cartes retirees ${swRet} ; produits anemone vus : ${Object.keys(swSeen).sort().join(' ')||'aucun'}`);
/* 4. the composer's proposed fillers (pickFour): a test kind that only accepts the two anemones, with the first colourways retired in turn */
FOUR.__t=(r,m)=>SIDS.includes(r.id);
const pk=(label)=>{const seen={};for(let k=0;k<400;k++){sd(k+1);const p=pickFour('__t',['#f7f5f0','#f2c4cf','#b8a2d8','#c8102e','#5b4aa8','#ee1414'][k%6],'juste',new Set());if(p)seen[p.sid+' '+p.col]=(seen[p.sid+' '+p.col]||0)+1}out(`fillers ${label} : ${Object.entries(seen).map(([k,v])=>k+' x'+v).join(' ; ')||'aucun'}`)};
pk('etat reel');
const cw1=CWS[SIDS[0]][1],r1=cw1.ret;cw1.ret=1;pk('coloris 0 et 1 retires (essai)');if(r1)cw1.ret=1;else delete cw1.ret;
delete FOUR.__t;
/* 5. what a retired colourway still does: the models and the resolution of a colour into a colourway (unchanged) */
for(const m of MODELS)for(const e of m.els){const cw=CWS[e.id];if(!cw)continue;const w=cwNear(cw,e.col);if(w&&w.ret)out(`modele « ${m.nom} » : ${e.id} ${e.col} se dessine en coloris retire « ${w.id} »`)}
for(const sid of SIDS){const cw=CWS[sid];PRODUCTS.filter(p=>p.sid===sid&&!p.ret).forEach(p=>{const ci=+p.id.split('~')[1],w=cwNear(cw,p.col);if(cw.indexOf(w)!==ci)out(`produit ${p.id} (${p.col}) se dessine avec le coloris « ${w.id} »${w.ret?' (retire)':''}, pas le sien « ${cw[ci].id} »`)})}
let mis=0;for(const p of PRODUCTS){const cw=CWS[p.sid];if(!cw||p.id.indexOf('~')<0)continue;if(cw.indexOf(cwNear(cw,p.col))!==+p.id.split('~')[1])mis++}
out(`toute la boutique : ${mis} produits dont la couleur se resout vers un autre coloris que le leur (information)`);
}catch(e){out('ERREUR '+e.message+' '+(e.stack||'').slice(0,300))}
const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=L.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
JS
python - <<'PY'
s=open('demo7.html',encoding='utf-8').read()
i=s.rindex('</body>')
open('lab/offerdump.html','w',encoding='utf-8').write(s[:i]+open('lab/offerdump_ids.js',encoding='utf-8').read()+s[i:])
PY
sh C:/Users/agent/Desktop/flower/flower-atelier/ws/gate.sh sh C:/Users/agent/Desktop/flower/flower-atelier/ws/dbgdump.sh "http://localhost:8805/${REL}/lab/offerdump.html" > "refcache/offer-$1.txt"
cat "refcache/offer-$1.txt"
