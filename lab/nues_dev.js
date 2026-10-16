/* nues_dev.js — tuning the settling of c4 on the bronze spring bouquet (ch/apercu/bronze/bqp.html), compose only, no drawing.
   evalC(c): the modelled bare stem of a composed candidate (share, by height above the rim: 0-40, 40-90, 90-160, 160+);
   runC(seeds): compose the bouquet for each seed; comp(sv, settleFn): one candidate with another settle; schem(cs): discs and stems. */
window.evalC=function(c){const v=VZ[BZ_V.id],BP=c.BP,mw=vMouth(v)||26,rx=c.W/2,rimY=x=>Math.min(FL,vSilTop(v,x));const H=c.heads.filter(h=>h.o&&h.o.kind==='head');let bare=0,vis=0;const band=[0,0,0,0],bandV=[0,0,0,0];
 for(const h of H){if(h.o.rim||h.o.front)continue;const s=stemSamples(h.X,h.Y,BP,mw,rx,rimY);for(const p of s.S){const hg=BP[1]-p[1],b=hg<40?0:hg<90?1:hg<160?2:3;vis+=p[2];bandV[b]+=p[2];let cov=false;for(const o of c.heads)if(!o.gar&&o.c.some(a=>(p[0]-a[0])**2+(p[1]-a[1])**2<(a[2]*SET_K/.92)**2)){cov=true;break}if(!cov){bare+=p[2];band[b]+=p[2]}}}
 const top=Math.min(...H.map(h=>h.y-h.r));return{share:+(bare/vis).toFixed(3),bare:Math.round(bare),band:band.map((b,i)=>+(b/Math.max(1,bandV[i])).toFixed(2)),Ht:Math.round(BP[1]-top),Wd:Math.round(Math.max(...H.map(h=>h.x+h.r))-Math.min(...H.map(h=>h.x-h.r))),n:H.length,front:H.filter(h=>h.o.front||h.Y>BP[1]-h.r*.95-2).length,clash:c.clash,score:+c.score.toFixed(2)}};
window.settleN=window.settleN||(typeof settle==='function'?settle:null);
window.comp=(sv,set,air)=>{const ids=BZ_R.map(r=>r[0]).filter(id=>PBY[id]),qty=new Map(BZ_R.map(r=>[r[0],r[1]])),pos=new Map(BZ_R.map(r=>[r[0],r[2]]));if(set)window.settle=set;PLANOPT={qty,pos,noAdds:true,air};let c;try{c=compose(ids,sv,'juste',BZ_V.id,null,null)}finally{PLANOPT=null;window.settle=settleN}return c};
window.runC=(seeds,set)=>seeds.map(sv=>{const c=comp(sv,set);return Object.assign({sv,tk:c.tk},evalC(c))});
window.sumC=a=>{const m=k=>+(a.reduce((s,x)=>s+(typeof k==='function'?k(x):x[k]),0)/a.length).toFixed(3);return{share:m('share'),b0:m(x=>x.band[0]),b1:m(x=>x.band[1]),b2:m(x=>x.band[2]),b3:m(x=>x.band[3]),Ht:Math.round(m('Ht')),Wd:Math.round(m('Wd')),low:m('front'),clash:m('clash')}};
/* a variant of settle by text replacement of its source: [[from, to], ...] */
window.varS=rep=>{let s=settleN.toString();for(const[a,b]of rep){if(!s.includes(a))throw new Error('miss '+a);s=s.replace(a,b)}return(0,eval)('('+s+')')};
window.schem=function(cs,W=480,css=780,span=760){const cv=document.createElement('canvas');cv.width=W*cs.length;cv.height=W;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);
 cs.forEach((c,ci)=>{const v=VZ[BZ_V.id],BP=c.BP,mw=vMouth(v),rx=c.W/2,rimY=x=>Math.min(FL,vSilTop(v,x));const sc=W/span,ox=ci*W+W/2-BP[0]*sc,oy=W*.86-BP[1]*sc,T=(x,y)=>[ox+x*sc,oy+y*sc];
  g.fillStyle='#555';g.beginPath();for(let x=-120;x<=120;x+=4){const p=T(BP[0]+x,vSilTop(v,BP[0]+x));x===-120?g.moveTo(...p):g.lineTo(...p)}g.lineTo(...T(BP[0]+120,FL));g.lineTo(...T(BP[0]-120,FL));g.fill();
  const H=c.heads.filter(h=>!h.gar);
  for(const h of H){if(!h.o||h.o.kind!=='head')continue;const s=stemSamples(h.X,h.Y,BP,mw,rx,rimY);for(const p of s.S){let cov=false;for(const o of H)if(o.c.some(a=>(p[0]-a[0])**2+(p[1]-a[1])**2<(a[2]*SET_K/.92)**2)){cov=true;break}g.fillStyle=cov?'#9c9':'#f0f';const q=T(p[0],p[1]);g.fillRect(q[0]-1.5,q[1]-1.5,3,3)}}
  for(const h of H.slice().sort((a,b)=>a.z-b.z))for(const a of h.c){const q=T(a[0],a[1]);g.beginPath();g.arc(q[0],q[1],a[2]*sc,0,7);g.fillStyle=h.o&&h.o.front?'rgba(230,140,40,.75)':h.o&&h.o.settled?'rgba(60,170,90,.55)':h.focal?'rgba(60,90,200,.6)':'rgba(120,150,230,.45)';g.fill();g.strokeStyle='#335';g.lineWidth=.5;g.stroke()}
  for(const o of c.out)if(o.kind==='self'&&o.spine){g.strokeStyle='#a87';g.lineWidth=1;g.beginPath();o.spine.forEach((p,i)=>{const q=T(o.x+p[0],o.y+p[1]);i?g.lineTo(...q):g.moveTo(...q)});g.stroke()}
  g.fillStyle='#000';g.font='12px sans-serif';g.fillText((c.label||'')+' share '+evalC(c).share,ci*W+6,14)});
 const im=new Image();im.src=cv.toDataURL();im.id='schem';im.style.cssText='position:fixed;left:0;top:0;z-index:100;width:'+css+'px';document.getElementById('schem')?.remove();document.body.append(im);return 'ok'};

/* the full audit of the drawn bouquet on this page (bqp.html): bare stem, hearts covered, stems run through; kept in sessionStorage AUD3 */
window.AUD=async(tag='')=>{for(const f of['nues.js','coeurs.js']){const s=document.createElement('script');s.src='/lab/'+f+'?'+Date.now();document.head.append(s);await new Promise(r=>s.onload=r)}
  const svg=[...document.querySelectorAll('svg')].find(s=>s.dataset.tpl),r=BZ_OUT.r,C=await coeurs(svg,r,{vid:BZ_V.id}),m=await nues(svg,r,{vid:BZ_V.id}),q=new URLSearchParams(location.search);
  const res={tag,sv:+q.get('s'),hits:C.hits.length,deep:C.deep,veil:C.veil,pierce:C.pierce.length,bare:m.share,b0:m.bands[0],left:r.heartsLeft,clash:r.clash,bad:BZ_OUT.bad.length,H:Math.round(r.BP[1]-Math.min(...r.out.filter(o=>o.kind==='head').map(o=>o.y)))};
  const A=JSON.parse(sessionStorage.getItem('AUD3')||'[]');A.push(res);sessionStorage.setItem('AUD3',JSON.stringify(A));window.LASTC=C;return res};
