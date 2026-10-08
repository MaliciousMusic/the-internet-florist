
/* ================= Belai's Flowers — demo app ================= */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const eur=c=>(c/100).toFixed(2).replace('.',',')+' €';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RAR={c:['Commune','r-c'],r:['Rare','r-r'],p:['Précieuse','r-p'],l:['Légendaire','r-l']};
const FAM=[['tout','Tout','conic-gradient(#ff5d9e,#ffb020,#ffe14d,#5bd18b,#3d8bff,#9b5cff,#ff5d9e)'],['rose','Roses','#ff7fb0'],['rouge','Rouges','#e3263f'],['orange','Oranges','#ff8a1f'],['jaune','Jaunes','#ffd21f'],['blanc','Blancs','#fffaf2'],['violet','Violets','#9b5cff'],['bleu','Bleus','#2f7bff'],['vert','Verts','#6fae3a']];
/* catalogue: price p in cents, k = role in the bouquet */
const CAT=[
 {id:'rose-peche',n:'Rose pêche',fam:'rose',rar:'c',p:20,f:'rose',k:'focal',o:{}},
 {id:'rose-poudre',n:'Rose poudrée',fam:'rose',rar:'c',p:20,f:'rose',k:'focal',o:{c:['#fff0f5','#ffc1d9','#ff7fb0','#d84a86']}},
 {id:'rose-rouge',n:'Rose rouge',fam:'rouge',rar:'c',p:25,f:'rose',k:'focal',o:{c:['#ff9a9a','#f0394a','#c8102e','#7d0016']}},
 {id:'rose-blanche',n:'Rose blanche',fam:'blanc',rar:'c',p:20,f:'rose',k:'focal',o:{c:['#ffffff','#fdf8f0','#efe3cf','#c9b393']}},
 {id:'dahlia-rose',n:'Dahlia pompon',fam:'rose',rar:'c',p:30,f:'dahlia',k:'focal',o:{n:48}},
 {id:'dahlia-magenta',n:'Dahlia magenta',fam:'violet',rar:'r',p:50,f:'dahlia',k:'focal',o:{n:48,c:['#ffd6f2','#ff5fcf','#c2189b','#7a0a5c']}},
 {id:'dahlia-corail',n:'Dahlia corail',fam:'orange',rar:'c',p:30,f:'dahlia',k:'focal',o:{n:48,c:['#ffe2d6','#ff9a7a','#f2555a','#b8233a']}},
 {id:'dahlia-citron',n:'Dahlia citron',fam:'jaune',rar:'r',p:45,f:'dahlia',k:'focal',o:{n:48,c:['#fffbe0','#ffe680','#f2c200','#a87b00']}},
 {id:'anthurium-rose',n:'Anthurium',fam:'rose',rar:'r',p:60,f:'anthurium',k:'focal',o:{}},
 {id:'anthurium-rouge',n:'Anthurium rubis',fam:'rouge',rar:'r',p:60,f:'anthurium',k:'focal',o:{c:['#fff3a0','#ffb35c','#ff4d4d','#d0102e','#8a0018']}},
 {id:'protea',n:'Protéa royale',fam:'rose',rar:'l',p:150,f:'protea',k:'focal',o:{}},
 {id:'lys',n:'Lys tigré',fam:'orange',rar:'c',p:25,f:'lily',k:'focal',o:{}},
 {id:'lys-blanc',n:'Lys blanc',fam:'blanc',rar:'c',p:25,f:'lily',k:'focal',o:{c:['#ffe27a','#fffaf0','#ffffff','#d9cfbf']}},
 {id:'banksia',n:'Banksia',fam:'orange',rar:'r',p:70,f:'banksia',k:'focal',o:{c:['#fff2c4','#ffd25a','#f2a516','#b87a0a']}},
 {id:'orchidee',n:'Orchidée lilas',fam:'violet',rar:'p',p:90,f:'orchidStem',k:'spray',o:{}},
 {id:'orchidee-fuchsia',n:'Orchidée fuchsia',fam:'violet',rar:'p',p:90,f:'orchidStem',k:'spray',o:{c:['#ffe6fb','#f59ae6','#d43fc2'],v:'#8a1478'}},
 {id:'strelitzia',n:'Oiseau de paradis',fam:'orange',rar:'p',p:120,f:'strelitzia',k:'tall',o:{}},
 {id:'heliconia',n:'Héliconia',fam:'rouge',rar:'r',p:80,f:'heliconia',k:'tall',o:{}},
 {id:'physalis',n:'Lanternes',fam:'orange',rar:'r',p:40,f:'lanternStem',k:'tall',o:{}},
 {id:'palme-rose',n:'Palme soleil',fam:'rose',rar:'r',p:50,f:'palmFan',k:'tall',o:{}},
 {id:'palme-lilas',n:'Palme lilas',fam:'violet',rar:'r',p:50,f:'palmFan',k:'tall',o:{c:['#f3c4ff','#c46bff','#6a2fc9']}},
 {id:'palme-bleue',n:'Palmier bleu',fam:'bleu',rar:'r',p:40,f:'blades',k:'tall',o:{a:[-30,30],n:5,l:200,bw:13}},
 {id:'pampa',n:'Pampa rose',fam:'rose',rar:'c',p:15,f:'pampas',k:'tall',o:{}},
 {id:'craspedia',n:'Billy ball',fam:'jaune',rar:'c',p:10,f:'craspedia',k:'filler',o:{}},
 {id:'statice',n:'Statice',fam:'violet',rar:'c',p:10,f:'statice',k:'filler',o:{}},
 {id:'ballon',n:'Ballon vert',fam:'vert',rar:'c',p:15,f:'balloon',k:'filler',o:{}},
 {id:'fougere',n:'Queue de renard',fam:'vert',rar:'c',p:10,f:'foxtail',k:'filler',o:{}}
];
const BYID=Object.fromEntries(CAT.map(p=>[p.id,p]));
const BASE=90,MIN=200,CAP=2000,MAXF=30;
const VASES=[{id:'classique',n:'Classique',p:0},{id:'verre',n:'Verre lilas',p:50},{id:'rose',n:'Céramique',p:90},{id:'or',n:'Or',p:150}];
const MUS=[{id:'none',n:'Silence',p:0},{id:'box',n:'Boîte à musique',p:50},{id:'lofi',n:'Lo-fi doux',p:50},{id:'romance',n:'Romance',p:50}];
const S={cart:new Map(),vase:'classique',music:'none',seed:7,fam:'tout',view:'shop',to:'',from:'',msg:''};
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const SEEN=new Set(store.get('bf-seen',[]));
function seen(id){if(!SEEN.has(id)){SEEN.add(id);store.set('bf-seen',[...SEEN])}}
function count(){let n=0;for(const q of S.cart.values())n+=q;return n}
function expand(){const a=[];for(const[id,q]of S.cart)for(let i=0;i<q;i++)a.push(id);return a}
function flowersCost(){let c=0;for(const[id,q]of S.cart)c+=BYID[id].p*q;return c}
function total(){if(!count())return 0;return flowersCost()+BASE+VASES.find(v=>v.id===S.vase).p+MUS.find(m=>m.id===S.music).p}

/* composite stems (used by shop and bouquets) */
function orchidStem(g,t,o){const P=[[0,0],[-14,-90],[26,-170],[78,-188]];E('path',{d:cp(P),stroke:'#7b8f45','stroke-width':3,fill:'none','stroke-linecap':'round'},g);
  [[.42,.95],[.6,.9],[.76,.84],[.88,.76]].forEach(([u,s],i)=>{const q=bz(P,u);orchid(G(g,{transform:`translate(${f(q[0])},${f(q[1])}) scale(${s})`}),t+i*130,o)});
  [[.95,.9],[1,.75]].forEach(([u,s])=>{const q=bz(P,u);bud(G(g,{transform:`translate(${f(q[0])},${f(q[1])}) scale(${s})`}),t+650,o)})}
function lanternStem(g,t,o){const P=[[0,0],[8,-110],[70,-175],[125,-150]];E('path',{d:cp(P),stroke:'#7a6a2a','stroke-width':2.4,fill:'none','stroke-linecap':'round'},g);
  [[.45,1],[.63,.95],[.8,.9],[.97,.75,1]].forEach(([u,s,gr],i)=>{const q=bz(P,u);lantern(G(g,{transform:`translate(${f(q[0])},${f(q[1])}) scale(${s})`}),t+i*120,gr?{c:['#eef7c0','#bcd96a','#86a83f']}:o)})}
const FN={rose,dahlia,anthurium,protea,lily,banksia,orchidStem,strelitzia,heliconia,lanternStem,palmFan,blades,pampas,craspedia,statice,balloon,foxtail,leaf,sleaf};

/* draw once with every animation already finished */
function renderStatic(fn){const a=tw.length,b=idle.length;fn();for(const w of tw.splice(a))w.fn(1,1);idle.length=b}
function hd(g,fn,x,y,r,s,o){const h=G(g,{transform:tr(x,y,r,s)});FN[fn](h,0,Object.assign({},o||{}));return h}
function st(g,x1,y1,x2,y2,w){E('path',{d:`M${f(x1)},${f(y1)}Q${f((x1+x2)/2+R(-10,10))},${f((y1+y2)/2)} ${f(x2)},${f(y2)}`,stroke:pick(['#5d8c37','#6f9e41','#4e7a2e']),'stroke-width':w||3.4,fill:'none','stroke-linecap':'round'},g)}
const SAGE={l:80,lw:22,lc:['#3d6b4a','#6f9a6a','#b9d4a5']};
function shopArt(g,p){const o=p.o;
  switch(p.f){
  case'rose':case'dahlia':case'lily':st(g,0,30,0,-170,4);hd(g,'leaf',-2,-60,-48,.7,{l:80,lw:24});hd(g,'leaf',2,-92,44,.62,{l:80,lw:24});hd(g,p.f,0,-178,R(-8,8),p.f==='dahlia'?.92:1,o);break;
  case'anthurium':st(g,0,30,4,-140,4);hd(g,'leaf',0,-50,-40,.75,{l:90,lw:28});hd(g,p.f,4,-152,12,.95,o);break;
  case'protea':st(g,0,30,0,-112,5);hd(g,'leaf',0,-40,-50,.7,SAGE);hd(g,'leaf',0,-62,48,.6,SAGE);hd(g,p.f,0,-112,0,1.02,o);break;
  case'banksia':st(g,0,30,0,-86,5);hd(g,'leaf',0,-30,-55,.6,SAGE);hd(g,p.f,0,-86,0,1.08,o);break;
  case'craspedia':[[-34,-150,.95],[6,-208,.95],[38,-128,.9]].forEach(([x,y,s])=>{st(g,0,30,x,y,2.2);hd(g,p.f,x,y,0,s,o)});break;
  case'balloon':[[-26,-140,.95],[28,-190,.85]].forEach(([x,y,s])=>{st(g,0,30,x,y,2.4);hd(g,p.f,x,y,0,s,o)});break;
  case'statice':st(g,0,30,-20,-120,2);st(g,0,30,24,-150,2);hd(g,p.f,-20,-120,-10,1.25,o);hd(g,p.f,24,-150,12,1.25,o);break;
  case'foxtail':[[-24,-50,-16],[0,-80,0],[24,-46,16]].forEach(([x,y,r])=>{st(g,0,30,x,y,2);hd(g,p.f,x,y,r,1.4,o)});break;
  case'heliconia':st(g,0,30,0,-30,4);hd(g,p.f,0,-30,0,1.12,o);break;
  case'strelitzia':st(g,0,30,-56,-176,4.5);hd(g,p.f,-58,-180,-10,.95,o);break;
  case'palmFan':st(g,0,30,0,-150,3.5);hd(g,p.f,0,-158,0,1.05,o);break;
  case'blades':hd(g,p.f,0,-10,0,1,o);break;
  case'pampas':st(g,0,30,0,-20,2.2);hd(g,p.f,0,-20,-8,1.45,Object.assign({P:[[0,0],[10,-50],[30,-100],[55,-150]]},o));break;
  case'orchidStem':st(g,0,30,-30,-40,3);hd(g,p.f,-30,-40,0,1.08,o);break;
  case'lanternStem':st(g,0,30,-44,-60,2.4);hd(g,p.f,-44,-60,0,.95,o);break}}
const VB='-120 -300 240 330';
function buildSymbols(){for(const p of CAT){const s=E('symbol',{id:'s-'+p.id,viewBox:VB},defs);renderStatic(()=>shopArt(G(s),p))}}

/* ---------- looping shelves (own drag + inertia, GPU translate only) ---------- */
const IW=118;
function itemHTML(p){const[rn,rc]=RAR[p.rar];return`<button class="it${p.rar==='l'?' leg':''}" data-id="${p.id}" type="button" aria-label="${p.n}, ${rn}, ${eur(p.p)}"><span class="rar ${rc}">${rn}</span><svg class="fl" viewBox="${VB}" aria-hidden="true"><use href="#s-${p.id}" x="-120" y="-300" width="240" height="330"/></svg><span class="bucket"></span><span class="tag"><i>${p.n}</i><b>${eur(p.p)}</b></span></button>`}
function shelf(label,items,dir){const el=document.createElement('div');el.className='shelf';el.innerHTML=`<span class="lbl">${label}</span><div class="track"></div>`;
  const track=el.lastChild;let base=items.slice();while(base.length*IW<Math.max(innerWidth,440)*1.25)base=base.concat(items);
  const html=base.map(itemHTML).join('');track.innerHTML=html+html;const W=base.length*IW;
  let x=dir>0?0:W*.37,v=0,drag=0,lx=0,lt=0,mv=0,raf=0,down=null;
  const set=()=>{track.style.transform=`translate3d(${f(-(((x%W)+W)%W))}px,0,0)`};
  const glide=()=>{x+=v*16;v*=.94;set();if(Math.abs(v)>.02)raf=requestAnimationFrame(glide)};
  el.addEventListener('pointerdown',e=>{cancelAnimationFrame(raf);drag=1;mv=0;v=0;lx=e.clientX;lt=e.timeStamp;down=e.target.closest('.it');try{el.setPointerCapture(e.pointerId)}catch(_){}});
  el.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dt=Math.max(8,e.timeStamp-lt);x-=dx;v=-dx/dt;mv+=Math.abs(dx);lx=e.clientX;lt=e.timeStamp;set()});
  const up=()=>{if(!drag)return;drag=0;if(mv<8&&down)add(down.dataset.id,down);else raf=requestAnimationFrame(glide);down=null};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.addEventListener('click',e=>{if(e.detail===0){const it=e.target.closest('.it');if(it)add(it.dataset.id,it)}});
  el.addEventListener('wheel',e=>{x+=e.deltaX||e.deltaY;set();e.preventDefault()},{passive:false});
  el.nudge=d=>{if(RM)return;const x0=x,t0=performance.now();const step=now=>{const k=Math.min(1,(now-t0)/1400);x=x0+d*Math.sin(k*Math.PI);set();if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
  set();return el}
function chips(){$('chips').innerHTML=FAM.map(([id,n,c])=>`<button class="chip${S.fam===id?' on':''}" data-f="${id}" type="button" role="tab" aria-selected="${S.fam===id}"><i style="--c:${c}"></i>${n}</button>`).join('')}
function shop(){const w=$('shop');w.innerHTML='';const items=CAT.filter(p=>S.fam==='tout'||p.fam===S.fam),A=items.filter(p=>p.k==='focal'),B=items.filter(p=>p.k!=='focal');
  if(A.length)w.append(shelf('Fleurs',A,1));if(B.length)w.append(shelf('Exotiques & feuillages',B,-1))}

/* ---------- cart ---------- */
function add(id,el){const p=BYID[id];if(count()>=MAXF)return toast(`Ton bouquet est plein (${MAXF} fleurs maximum)`);
  if(total()+p.p+(count()?0:BASE)>CAP)return toast('20 € maximum par bouquet');
  S.cart.set(id,(S.cart.get(id)||0)+1);seen(id);
  if(el){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');fly(el)}
  try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}
  update();react(p)}
function fly(el){const s=el.querySelector('svg.fl');if(!s||RM)return;const a=s.getBoundingClientRect(),b=$('pill').getBoundingClientRect(),c=s.cloneNode(true);
  c.style.cssText=`position:fixed;left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px;z-index:70;pointer-events:none;overflow:visible`;document.body.appendChild(c);
  const dx=b.left+18-(a.left+a.width/2),dy=b.top+14-(a.top+a.height*.3);
  c.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${f(dx*.45)}px,${f(dy*.55-70)}px) scale(.6) rotate(-14deg)`,opacity:1,offset:.5},{transform:`translate(${f(dx)}px,${f(dy)}px) scale(.12) rotate(-32deg)`,opacity:.3}],{duration:680,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>{c.remove();const pl=$('pill');pl.classList.remove('bump');void pl.offsetWidth;pl.classList.add('bump')}}
