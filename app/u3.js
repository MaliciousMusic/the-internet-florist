
/* ================= Révélation (enveloppe, éclosion, confettis, papillons), musique, paiement, jardin ================= */
let AC=null,MT=0,MOUT=null,pvT=0;
const SONGS={box:{w:'sine',b:.26,d:1.5,g:.16,n:[76,79,83,88,83,79,77,81,84,89,84,81,74,77,81,86,81,77,72,76,79,84,79,76]},
 lofi:{w:'triangle',b:.44,d:1.1,g:.13,lp:1500,n:[60,64,67,71,69,65,62,69,59,62,67,71,64,67,72,76]},
 romance:{w:'triangle',b:.36,d:1.7,g:.13,n:[69,73,76,81,78,74,71,74,73,76,81,85,76,73,69,64]}};
function playMusic(k){stopMusic();const s=SONGS[k];if(!s)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(_){return}
  const out=AC.createGain();out.gain.value=s.g;if(s.lp){const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=s.lp;out.connect(lp);lp.connect(AC.destination)}else out.connect(AC.destination);MOUT=out;let i=0,next=AC.currentTime+.06;
  const note=(fr,t,d,v,type)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=fr;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05)};
  const sched=()=>{while(next<AC.currentTime+.35){const fr=440*Math.pow(2,(s.n[i%s.n.length]-69)/12);note(fr,next,s.d,1,s.w);if(i%4===0)note(fr/4,next,s.d*1.4,.5,'sine');next+=s.b;i++}};sched();MT=setInterval(sched,120)}
function stopMusic(){clearInterval(MT);if(MOUT&&AC){try{MOUT.gain.setTargetAtTime(0,AC.currentTime,.08)}catch(_){}}MOUT=null}
function preview(k){playMusic(k);clearTimeout(pvT);pvT=setTimeout(stopMusic,5200)}
/* ---------- confetti: hearts, petals or golden stars drifting down ---------- */
const HPATH='M16 29C6 21 0 15 0 8.5 0 3.6 3.7 0 8.4 0 11.7 0 14.5 1.8 16 4.6 17.5 1.8 20.3 0 23.6 0 28.3 0 32 3.6 32 8.5 32 15 26 21 16 29Z';
const CCOL={coeurs:['#6d1028','#a8324e','#d98a8e','#ecc9c0','#8e1a3a','#e8b09a','#c9a46a','#b85a6e'],petales:['#f2c4cc','#ecb0bc','#f8dcd6','#e8a0b0','#fbe8e4','#d88aa0'],etoiles:['#c9a050','#e0c070','#f2dc9a','#b88a3a']};
function confetti(box,kind,n){if(kind==='aucun'||!box)return;const W=box.clientWidth||300,H=box.clientHeight||500,cols=CCOL[kind]||CCOL.coeurs;
  for(let i=0;i<n;i++){const sz=MR(10,26),d=document.createElement('div');d.className='conf';d.style.width=f(sz)+'px';d.style.height=f(sz)+'px';const c=cols[i%cols.length];
    d.innerHTML=kind==='coeurs'?`<svg viewBox="0 0 32 30" width="100%" height="100%"><path d="${HPATH}" fill="${c}"/><ellipse cx="9.5" cy="8" rx="4" ry="2.3" fill="#fff" opacity=".45" transform="rotate(-35 9.5 8)"/></svg>`
      :kind==='petales'?`<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M15,2C24,8 24,22 15,28C6,22 6,8 15,2Z" fill="${c}"/><path d="M15,4V26" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/></svg>`
      :`<svg viewBox="0 0 30 30" width="100%" height="100%"><path d="M15,2l3.6,9 9.4.8-7.2 6 2.3 9.2L15,22l-8.1 5 2.3-9.2-7.2-6 9.4-.8z" fill="${c}"/></svg>`;box.appendChild(d);
    const x=MR(-10,W-10),y0=MR(-H*.9,-30),dur=MR(6500,10500)*(H+40-y0)/(H*1.6),r0=MR(-180,180),r1=r0+MR(-360,360);
    d.animate([{transform:`translate3d(${f(x)}px,${f(y0)}px,0) rotate(${f(r0)}deg)`},{transform:`translate3d(${f(x+MR(-60,60))}px,${f(H+40)}px,0) rotate(${f(r1)}deg)`}],{duration:dur,easing:'linear',fill:'forwards'}).onfinish=()=>d.remove()}}
/* ---------- butterflies: five real species at their real wingspan, at most three, slow flight that lands on the flowers, rests, opens and closes its wings, and leaves again ---------- */
const BSP={
 machaon:{n:'Machaon',cm:7.5,g:['#f6e394','#e9cc66'],edge:'#2a2018',body:'#231a12',
  fw:'M-2,-7C-10,-15 -28,-28 -45,-31C-47.5,-24 -47,-13 -42,-3C-30,-1 -15,0 -2,0Z',
  hw:'M-2,1C-13,0 -27,2 -35,9C-38.5,15 -37,22 -33,26C-31,29 -30,33 -29,39C-27.5,40 -26,39.5 -25.5,37C-25,33 -24,30 -22,28C-15,27 -8,22 -3,12Z',
  fm:'<path d="M0,-8C-8,-14 -15,-18 -21,-20L-17,-2L0,0Z" fill="#1d1712" opacity=".92"/><path d="M-23,-24L-21,-13M-31,-27L-29,-15M-39,-29L-37,-17" stroke="#1d1712" stroke-width="3"/><path d="M-46,-30C-47,-22 -46,-12 -41,-3" stroke="#1d1712" stroke-width="7.5" fill="none"/>'+
   '<g fill="#f4de86"><circle cx="-44.6" cy="-25" r="1.15"/><circle cx="-45" cy="-19" r="1.15"/><circle cx="-44" cy="-13" r="1.15"/><circle cx="-42.3" cy="-7.5" r="1.1"/></g><path d="M-3,-2L-44,-27M-3,-2L-45,-20M-3,-1L-44,-12M-3,-1L-41,-5" stroke="#2a2018" stroke-width=".5" opacity=".55"/>',
  hm:'<path d="M-2,1C-8,1 -14,4 -16,10L-6,19Z" fill="#1d1712" opacity=".9"/><path d="M-35,9C-38.5,16 -36,23 -31,28C-28,31 -24,30 -21,28" stroke="#1d1712" stroke-width="7.5" fill="none"/>'+
   '<g fill="#6f93dc"><ellipse cx="-32.6" cy="14" rx="1.9" ry="1.3"/><ellipse cx="-33" cy="19.5" rx="1.9" ry="1.3"/><ellipse cx="-29.5" cy="25" rx="1.8" ry="1.2"/></g><g fill="#f4de86"><circle cx="-36.5" cy="13" r="1"/><circle cx="-36.6" cy="19.5" r="1"/><circle cx="-33.5" cy="26.5" r="1"/></g>'+
   '<circle cx="-20.5" cy="26.8" r="2.7" fill="#1d1712"/><circle cx="-20.5" cy="26.8" r="1.8" fill="#d8402a"/><path d="M-3,3L-34,12M-3,4L-33,21M-3,6L-28,28" stroke="#2a2018" stroke-width=".5" opacity=".5"/>'},
 morpho:{n:'Morpho',cm:13,g:['#6cc0ff','#1a5fd0'],edge:'#0e0c14',body:'#1a1620',
  fw:'M-2,-7C-12,-18 -32,-31 -49,-30C-53,-22 -52,-10 -45,-1C-31,1 -15,1 -2,0Z',
  hw:'M-2,1C-16,1 -34,5 -41,14C-44,22 -40,30 -30,32C-20,33 -9,27 -3,12Z',
  fm:'<path d="M-30,-30C-40,-32 -48,-31 -50,-27C-53,-19 -51,-9 -45,-1" stroke="#14121a" stroke-width="9" fill="none"/><path d="M-4,-8C-14,-17 -28,-27 -41,-30" stroke="#14121a" stroke-width="2.6" fill="none"/>'+
   '<g fill="#f2f0f6"><circle cx="-46.5" cy="-26" r="1.2"/><circle cx="-49.4" cy="-18" r="1.2"/><circle cx="-47.6" cy="-9.5" r="1.1"/></g><path d="M-6,-3L-34,-24L-40,-14Z" fill="#ffffff" opacity=".18"/>',
  hm:'<path d="M-41,14C-44,22 -40,30 -30,32C-22,33 -14,30 -8,24" stroke="#14121a" stroke-width="7" fill="none"/><g fill="#f2f0f6"><circle cx="-41" cy="18.5" r="1.1"/><circle cx="-39" cy="25.5" r="1.1"/><circle cx="-33" cy="30" r="1.1"/></g><path d="M-6,4L-30,10L-24,22Z" fill="#ffffff" opacity=".14"/>'},
 paon:{n:'Paon du jour',cm:5.6,g:['#c4402e','#8e2a20'],edge:'#2a1a16',body:'#2a1c18',
  fw:'M-2,-7C-11,-16 -29,-28 -44,-30C-45,-27 -43.5,-24 -45,-21C-44,-15 -46,-11 -42,-4C-30,-1 -15,0 -2,0Z',
  hw:'M-2,1C-12,0 -26,3 -34,10C-36,15 -34,18 -36,22C-33,28 -26,31 -19,30C-11,28 -6,21 -3,12Z',
  fm:'<path d="M-44,-30C-45,-22 -45,-12 -42,-4" stroke="#3a2420" stroke-width="3.5" fill="none"/><path d="M0,-6C-6,-10 -10,-12 -14,-12L-10,0Z" fill="#4a2a22" opacity=".8"/><path d="M-19,-21L-17,-13M-26,-25L-24,-17" stroke="#2a1a18" stroke-width="2.6"/>'+
   '<circle cx="-36" cy="-22" r="6" fill="#ecdcae"/><circle cx="-36" cy="-22" r="4.3" fill="#5a78c8"/><circle cx="-36" cy="-22" r="2.7" fill="#1a1418"/><circle cx="-34.8" cy="-23.4" r=".9" fill="#dfe6f6"/>',
  hm:'<path d="M-34,10C-36,15 -34,18 -36,22C-33,28 -26,31 -19,30" stroke="#3a2420" stroke-width="3.5" fill="none"/><path d="M-2,1C-8,2 -12,5 -13,9L-5,14Z" fill="#4a2a22" opacity=".8"/>'+
   '<circle cx="-24" cy="17" r="7.6" fill="#1a1418"/><circle cx="-26.2" cy="14.6" r="2" fill="#7a90d8"/><circle cx="-21.6" cy="19.4" r="1.6" fill="#9aa8d8"/><path d="M-29,19C-27,22 -23,23 -20,22" stroke="#cfd2da" stroke-width="1" fill="none"/>'},
 citron:{n:'Citron',cm:6,g:['#eee772','#d4d154'],edge:'#a8a438',body:'#3a3a22',
  fw:'M-2,-7C-12,-17 -30,-29 -45,-34C-44,-27 -44.5,-17 -41,-4C-29,-1 -15,0 -2,0Z',
  hw:'M-2,1C-14,1 -30,4 -38,12L-41.5,17C-39,25 -30,32 -19,31C-10,29 -5,20 -3,11Z',
  fm:'<circle cx="-25" cy="-14" r="1.7" fill="#e8902a"/><path d="M-3,-2L-43,-30M-3,-2L-43,-19M-3,-1L-41,-8" stroke="#9aa83a" stroke-width=".55" opacity=".55"/>',
  hm:'<circle cx="-24" cy="15" r="2.1" fill="#e8902a"/><path d="M-3,3L-38,13M-3,5L-33,24M-3,7L-22,30" stroke="#9aa83a" stroke-width=".55" opacity=".55"/>'},
 monarque:{n:'Monarque',cm:9.5,g:['#f08a2a','#d8650f'],edge:'#140e0c',body:'#1a1210',
  fw:'M-2,-7C-14,-19 -36,-33 -52,-33C-55,-25 -52,-12 -45,-2C-31,0 -15,1 -2,0Z',
  hw:'M-2,1C-15,1 -32,4 -39,12C-42,20 -38,29 -28,31C-18,32 -8,26 -3,12Z',
  fm:'<path d="M-3,-2L-48,-31M-3,-2L-50,-20M-3,-1L-47,-10M-3,0L-44,-3M-20,-14L-26,-6" stroke="#1a1210" stroke-width="1.5" fill="none"/><path d="M-36,-32C-46,-35 -53,-33 -54,-28C-55,-20 -52,-10 -45,-2" stroke="#1a1210" stroke-width="7" fill="none"/><path d="M-3,-7C-14,-18 -30,-29 -42,-32" stroke="#1a1210" stroke-width="2.6" fill="none"/>'+
   '<g fill="#f6f2ea"><circle cx="-50" cy="-28" r="1"/><circle cx="-52" cy="-21" r="1"/><circle cx="-50" cy="-13" r="1"/><circle cx="-46.5" cy="-6" r="1"/><circle cx="-44" cy="-29" r=".9"/></g><g fill="#f4b45a"><circle cx="-43" cy="-24" r="1.3"/><circle cx="-46" cy="-19" r="1.2"/></g>',
  hm:'<path d="M-3,3L-36,12M-3,4L-37,20M-3,6L-32,27M-3,8L-22,30" stroke="#1a1210" stroke-width="1.5" fill="none"/><path d="M-39,12C-42,20 -38,29 -28,31C-20,32 -12,29 -7,22" stroke="#1a1210" stroke-width="6" fill="none"/><g fill="#f6f2ea"><circle cx="-39.6" cy="17" r=".95"/><circle cx="-39" cy="24" r=".95"/><circle cx="-34" cy="29" r=".95"/><circle cx="-27" cy="31" r=".9"/></g>'}};
let bfN=0;
/* one butterfly drawn at rest, body upright; the two wing groups (.wl, .wr) fold toward the body when their x-scale shrinks */
function bfArt(k){const s=BSP[k]||BSP.machaon,u='b'+(bfN++),w=`<g clip-path="url(#cf${u})"><path d="${s.fw}" fill="url(#gf${u})"/>${s.fm}</g><g clip-path="url(#ch${u})"><path d="${s.hw}" fill="url(#gh${u})"/>${s.hm}</g><path d="${s.fw}" fill="none" stroke="${s.edge}" stroke-width=".55" opacity=".7"/><path d="${s.hw}" fill="none" stroke="${s.edge}" stroke-width=".55" opacity=".7"/>`;
  return`<defs><clipPath id="cf${u}"><path d="${s.fw}"/></clipPath><clipPath id="ch${u}"><path d="${s.hw}"/></clipPath><radialGradient id="gf${u}" cx="0" cy="0" r="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${s.g[0]}"/><stop offset="1" stop-color="${s.g[1]}"/></radialGradient><radialGradient id="gh${u}" cx="0" cy="0" r="44" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${s.g[0]}"/><stop offset="1" stop-color="${s.g[1]}"/></radialGradient><linearGradient id="ba${u}" x1="0" x2="1"><stop offset="0" stop-color="${lt(s.body,.25)}"/><stop offset=".5" stop-color="${s.body}"/><stop offset="1" stop-color="${dk(s.body,.4)}"/></linearGradient></defs>`+
   `<g class="wl">${w}</g><g transform="scale(-1,1)"><g class="wr">${w}</g></g><ellipse cx="0" cy="8" rx="2.3" ry="10.5" fill="url(#ba${u})"/><ellipse cx="0" cy="-3.5" rx="3.1" ry="5.2" fill="${s.body}"/><circle cx="0" cy="-10.2" r="2.5" fill="${s.body}"/>`+
   `<path d="M-.8,-11.6C-3,-18 -7,-24 -10,-27M.8,-11.6C3,-18 7,-24 10,-27" stroke="${s.body}" stroke-width=".6" fill="none"/><circle cx="-10.2" cy="-27.3" r="1" fill="${s.body}"/><circle cx="10.2" cy="-27.3" r="1" fill="${s.body}"/>`}
function bfSVG(k){return`<svg viewBox="-58 -44 116 88" aria-hidden="true">${bfArt(k)}</svg>`}
const BFLY=[];let bfRaf=0;
/* box: the layer they fly in; spots: where they may land ({x,y} in box pixels); pxcm: pixels per centimetre, so each one keeps its real wingspan */
function butterflies(box,kind,W,H,spots,pxcm){if(!box||kind==='aucun')return;const n=kind==='un'?1:3;W=W||box.clientWidth||300;H=H||box.clientHeight||400;
  if(!spots||!spots.length){spots=[];for(let i=0;i<5;i++)spots.push({x:MR(W*.15,W*.85),y:MR(H*.45,H*.85)})}pxcm=pxcm||Math.max(3.2,Math.min(7,W/70));
  const kinds=Object.keys(BSP).sort(()=>Math.random()-.5);
  for(let i=0;i<n;i++){const k=kinds[i%kinds.length],span=BSP[k].cm*pxcm,el=document.createElement('div');el.className='bf2';el.style.width=f(span*1.16)+'px';el.style.height=f(span*.88)+'px';el.innerHTML=bfSVG(k);box.appendChild(el);
    const side=i%2?1:-1,b={el,box,W,H,spots,span,k,x:side>0?W+span:-span,y:MR(H*.15,H*.6),hd:side>0?-90:90,v:0,st:'wait',tw:i*1.7+MR(0,.6),t:0,ph:MR(0,6),glide:0,tg:null,rest:0,flap:1,wl:el.querySelector('.wl'),wr:el.querySelector('.wr')};
    if(RM){const s=spots[i%spots.length];Object.assign(b,{x:s.x,y:s.y,hd:MR(-20,20),st:'rest',rest:1e9});bfDraw(b,.9);continue}
    BFLY.push(b)}
  if(!bfRaf&&BFLY.length)bfRaf=requestAnimationFrame(bfLoop)}
function bfDraw(b,sx){b.flap=sx;b.el.style.transform=`translate3d(${f(b.x-b.span*.58)}px,${f(b.y-b.span*.44)}px,0) rotate(${f(b.hd)}deg)`;const t=`scale(${sx.toFixed(3)},1)`;b.wl.setAttribute('transform',t);b.wr.setAttribute('transform',t)}
function bfNext(b){const free=b.spots.filter(s=>!BFLY.some(o=>o!==b&&o.tg===s));if(free.length&&Math.random()<.7){b.tg=free[Math.floor(Math.random()*free.length)];b.land=1;b.rh=MR(-28,28)}
  else{b.tg={x:MR(b.W*.1,b.W*.9),y:MR(b.H*.08,b.H*.55)};b.land=0}}
function bfLoop(now){bfRaf=0;for(let i=BFLY.length-1;i>=0;i--){const b=BFLY[i];if(!b.el.isConnected){BFLY.splice(i,1);continue}bfStep(b,now)}if(BFLY.length)bfRaf=requestAnimationFrame(bfLoop)}
function bfStep(b,now){const dt=Math.min(.05,b.last?(now-b.last)/1000:.016);b.last=now;b.t+=dt;
  if(b.st==='wait'){if(b.t<b.tw){b.el.style.opacity=0;return}b.el.style.opacity=1;b.st='fly';bfNext(b)}
  if(b.st==='rest'){b.rest-=dt;/* resting: wings open and close slowly, pausing open to bask */const c=.5+.5*Math.cos(b.t*2*Math.PI/3.4),sx=.18+.82*Math.pow(c,.6);bfDraw(b,sx);
    if(b.rest<=0){b.st='fly';b.v=b.span*.5;b.tg={x:b.x+MR(-1,1)*b.span*2,y:b.y-b.span*R(1.5,2.5)};b.land=0}return}
  const dx=b.tg.x-b.x,dy=b.tg.y-b.y,d=Math.hypot(dx,dy),cruise=b.span*1.15;
  /* final approach: it glides in, slows down and settles upright, wings beating softly */
  if(b.land&&d<b.span*1.6){const k=Math.min(1,dt*1.7);b.x+=dx*k;b.y+=dy*k;const dh=((b.rh-b.hd+540)%360)-180;b.hd+=dh*Math.min(1,dt*2.2);b.ph+=dt*2*Math.PI*3.6;b.v=b.span*.4;
    bfDraw(b,.3+.7*(.5+.5*Math.cos(b.ph)));if(d<1.5){b.st='rest';b.rest=R(4,8)}return}
  /* flight: slow, turning gently (slower in sharp turns), a soft bob, wings beating about three times a second with glides */
  const want=Math.atan2(dx,-dy)/D,dh=((want-b.hd+540)%360)-180;b.hd+=Math.max(-130*dt,Math.min(130*dt,dh));b.hd=((b.hd+540)%360)-180;
  const vt=cruise*Math.max(.35,Math.cos(Math.min(Math.abs(dh),110)*D*.8));b.v+=(vt-b.v)*Math.min(1,dt*1.5);
  b.x+=Math.sin(b.hd*D)*b.v*dt;b.y+=-Math.cos(b.hd*D)*b.v*dt+Math.sin(b.t*2*Math.PI*.9)*b.span*.7*dt;
  if(b.glide>0)b.glide-=dt;else if(Math.random()<dt*.35)b.glide=R(.4,.9);b.ph+=dt*2*Math.PI*(b.glide>0?0:3.2);
  bfDraw(b,b.glide>0?.92:.2+.8*(.5+.5*Math.cos(b.ph)));
  if(!b.land&&d<b.span*.9)bfNext(b);
  if(b.x<-b.span*3||b.x>b.W+b.span*3||b.y<-b.span*3||b.y>b.H+b.span*2){b.tg={x:b.W/2,y:b.H*.35};b.land=0}}
/* landing spots: the most visible flower heads of the bouquet, in pixels of the layer the butterflies fly in, and the pixels per centimetre of the drawing */
function bfSpots(svg,c,box){try{const M=svg.getScreenCTM(),br=box.getBoundingClientRect();if(!M||!c)return[[],0];const hs=c.out.filter(o=>o.kind==='head'&&(o.rr||0)>12).sort((a,b)=>b.z-a.z).slice(0,10);
  return[hs.map(o=>{const y=o.y-(o.rr||20)*.3;return{x:M.a*o.x+M.c*y+M.e-br.left,y:M.b*o.x+M.d*y+M.f-br.top}}),M.a*UPC]}catch(_){return[[],0]}}
const bfKind=k=>k==='quelques'||k==='nuee'?'trois':k||'aucun';
/* ---------- reveal overlay ---------- */
const today=()=>new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
function curGift(){return{to:S.to||'Belai',from:S.from||'Moi',msg:S.msg.trim()||'Pour toi, avec tout mon amour.',route:S.route,ids:expand(),model:S.route==='model'?S.model:null,seed:SEED,vase:S.vase,bg:S.bg,occ:S.occ,conf:S.conf,bf:S.bf,music:S.music}}
function openOv(mode,d){d=d||curGift();OV={mode,d};stopIdle();stopMusic();const o=$('ov');o.classList.add('on');o.classList.remove('rec');o.setAttribute('aria-hidden','false');
  {const c=bgCol(d.bg),o2=$('ov');o2.style.background=bgCss(c);o2.classList.toggle('dark',isDark(c))}
  $('ovTitle').textContent=mode==='preview'?`Voici ce que verra ${d.to}`:`Un bouquet de ${d.from}`;$('ovBq').innerHTML='';$('ovHearts').innerHTML='';$('ovCard').classList.remove('show');$('ovAct').innerHTML='';$('ovWid').hidden=true;$('env').hidden=false;$('envTo').textContent='pour '+d.to;
  $('cTo').textContent=d.to+',';$('cMsg').textContent=d.msg;$('cFrom').textContent=d.from}
$('env').onclick=()=>{if(!OV)return;const d=OV.d;$('env').hidden=true;tw.length=0;idle.length=0;DEPTH_BG=bgCol(d.bg);const c=buildBq($('ovBq'),d.ids||[],d.seed||7,d.vase,100,d.occ,d.model||null);DEPTH_BG='#efe8de';lastOvC=c;play();playMusic(d.music);
  setTimeout(()=>OV&&confetti($('ovHearts'),d.conf||'coeurs',RM?12:40),900);setTimeout(()=>{if(!OV)return;const[sp,px]=bfSpots($('ovBq'),c,$('ovHearts'));butterflies($('ovHearts'),bfKind(d.bf),0,0,sp,px)},1400);setTimeout(()=>OV&&$('ovCard').classList.add('show'),2300);setTimeout(actions,2700)};
function actions(){if(!OV)return;const a=$('ovAct'),fr=OV.d.from;
  if(OV.mode==='preview'){a.innerHTML=`<button class="btn2" type="button" id="aEdit">Modifier</button><button class="cta" type="button" id="aPay"><span>Payer</span><b>${eur(total())}</b></button>`;$('aEdit').onclick=closeOv;$('aPay').onclick=pay}
  else{$('ov').classList.add('rec');$('ovWid').hidden=false;a.innerHTML=`<button class="btn2" type="button" id="aThanks">Dire merci</button><button class="btn2" type="button" id="aKeep">Garder</button><button class="cta" type="button" id="aBack"><span>Répondre avec un bouquet</span><b>→</b></button>`;
    $('aThanks').onclick=()=>toast(`Merci envoyé à ${fr} !`);$('aKeep').onclick=()=>{const d=OV.d;if(!GARDEN.includes(d)){GARDEN.unshift(Object.assign({},d,{kind:'recu',date:today()}));saveGarden()}toast('Rangé dans ton jardin')};
    $('aBack').onclick=()=>{closeOv();S.to=fr;go('models');toast(`Choisis un bouquet pour ${fr}`)}}}
function closeOv(){OV=null;stopMusic();stopIdle();const o=$('ov');o.classList.remove('on','rec');o.setAttribute('aria-hidden','true');$('ovHearts').innerHTML='';tw.length=0;idle.length=0;if(FLOW)drawFlowBq()}
$('ovClose').onclick=closeOv;
/* ---------- checkout (demo) and sharing ---------- */
function pay(){const t=total();sheet(`<h2 class="h2">Paiement</h2><span class="demo">Démo : aucun paiement réel</span><div class="sum">${sums()}</div>
  <label class="chk"><input type="checkbox" id="waive"><span>Je veux que mon bouquet soit envoyé tout de suite et je renonce à mon droit de rétractation de 14 jours.</span></label>
  <button class="cta" type="button" id="payBtn" disabled><span>Payer par carte</span><b>${eur(t)}</b></button><p class="center" style="font-size:12px;color:var(--ink2);margin-top:8px">Carte bancaire · Apple Pay · Google Pay</p>`);
  $('waive').onchange=e=>$('payBtn').disabled=!e.target.checked;$('payBtn').onclick=paid}
function paid(){const d=Object.assign({kind:'envoye',date:today()},OV.d);GARDEN.unshift(d);saveGarden();if(S.route==='compose')S.cart.clear();update();closeFlow();
  const link=location.href.split('#')[0]+'#recu',txt=`${d.to}, j'ai un bouquet pour toi 💐 ${link}`;
  sheet(`<div class="ok">✓</div><h2 class="h2 center">Ton bouquet est prêt !</h2><p class="center">Envoie-le à ${esc(d.to)} :</p><div class="share"><a class="sh wa" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">WhatsApp</a><a class="sh" href="sms:?&body=${encodeURIComponent(txt)}">SMS</a><button class="sh" type="button" id="copy">Copier le lien</button></div>
  <input class="linkbox" id="lnk" readonly value="${esc(link)}" aria-label="Lien du bouquet"><button class="btn2" type="button" id="seeRec" style="width:100%;margin-top:10px">Voir comme ${esc(d.to)} le verra</button>`);
  const pick2=()=>{$('lnk').select();toast('Sélectionne le lien pour le copier')};$('copy').onclick=()=>{try{navigator.clipboard.writeText(link).then(()=>toast('Lien copié'),pick2)}catch(_){pick2()}};
  $('seeRec').onclick=()=>{closeSheet();openOv('recipient',d)}}
/* ---------- the garden: bouquets received and sent ---------- */
let GARDEN=store.get('bf4-garden',null),GT='recu';
function saveGarden(){store.set('bf4-garden',GARDEN.slice(0,24))}
if(!GARDEN){const m0=MODELS[0],m1=MODELS[Math.min(5,MODELS.length-1)];GARDEN=[];
  if(m0)GARDEN.push({kind:'recu',to:'Toi',from:'Belai',msg:'Félicitations pour ton nouveau job, mon amour ♥',route:'model',model:m0,seed:42,vase:m0.vase,occ:'bravo',conf:'coeurs',bf:'quelques',music:'box',date:'2 oct.'});
  if(m1)GARDEN.push({kind:'envoye',to:'Maman',from:'Moi',msg:'Bonne fête maman, je t’aime fort !',route:'model',model:m1,seed:77,vase:m1.vase,occ:'merci',conf:'petales',bf:'aucun',music:'none',date:'26 mai'})}
function enterGarden(){const L=GARDEN.filter(b=>b.kind===GT),g=$('bGrid');$('gTabs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.g===GT));
  g.innerHTML=L.length?L.map(b=>`<button class="bcard" type="button" data-i="${GARDEN.indexOf(b)}"><div class="art" style="background:${bgCss(bgCol(b.bg))}"><svg viewBox="0 0 10 10" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg></div><b>${b.kind==='recu'?'De '+esc(b.from):'Pour '+esc(b.to)}</b><small>${b.model?esc(b.model.nom):(b.ids||[]).length+' fleurs'} · ${esc(b.date||'')}</small></button>`).join(''):`<p class="emptyg" style="grid-column:1/-1">${GT==='recu'?'Les bouquets qu’on t’offre arriveront ici.':'Les bouquets que tu envoies seront gardés ici.'}</p>`;
  g.querySelectorAll('.bcard').forEach(c=>{const b=GARDEN[+c.dataset.i];LOD=1;try{renderStatic(()=>buildBq(c.querySelector('svg'),b.ids||[],b.seed||7,b.vase,0,b.occ,b.model||null))}catch(_){}LOD=0})}
$('gTabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;GT=b.dataset.g;enterGarden()};
$('bGrid').onclick=e=>{const c=e.target.closest('.bcard');if(c)openOv('recipient',GARDEN[+c.dataset.i])};
/* ---------- start ---------- */
{const h=location.hash.slice(1);go(['flowers','garden'].includes(h)?h:'models');if(h==='recu'){const r=GARDEN.find(b=>b.kind==='recu');if(r)openOv('recipient',r)}}
</script>
</body>
</html>
