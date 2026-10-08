
/* ================= Le jardin v3: an endless floral installation on a concrete planter, one colour per bay ================= */
const ZONES=[['blanc','Blancs & crèmes','#efe9dc'],['peche','Pêches & corails','#f2a27e'],['rose','Roses poudrés','#efb7c0'],['fuchsia','Fuchsias','#c2387f'],['rouge','Rouges','#c8162a'],
 ['bordeaux','Bordeaux & vins','#7a1430'],['noir','Noirs & aubergines','#3a0c22'],['violet','Violets & mauves','#8a5ac0'],['bleu','Bleus & lavandes','#7f9ee0'],['vert','Verts & chartreuses','#8fae4a'],
 ['jaune','Jaunes & ors','#f2c832'],['orange','Oranges & cuivres','#ef7a26'],['lignes','Lignes & retombées','#6a3a2a']];
const NZ=ZONES.length,GL={far:[],mid:[],front:[]},SPD={far:.42,mid:1,front:1.4},PT=690;
let GX=0,PW=500,GVW=400,curZone=-1,gStarted=0;
const ut=(x,y,r,s,sy)=>`translate(${f(x)},${f(y)}) rotate(${f(r)}) scale(${f(s)},${f(sy??s)})`;
function use(par,id,x,y,r,s,sy){return E('use',{href:'#'+id,transform:ut(x,y,r,s,sy)},par)}
/* far: warm plaster wall, window light and soft leaf shadows */
function farPanel(s){E('rect',{x:-4,y:0,width:908,height:1000,fill:lin([[0,'#f1ebe2'],[.62,'#e7dfd3'],[1,'#d8cdbe']],0,0,0,1)},s);
  E('ellipse',{cx:f(R(250,650)),cy:f(R(160,320)),rx:f(R(300,420)),ry:f(R(230,320)),fill:rad([[0,'#fffaf0',.6],[1,'#fffaf0',0]])},s);
  for(let k=0;k<24;k++)E('circle',{cx:f(R(0,900)),cy:f(R(0,820)),r:f(R(30,100)),fill:rad([[0,rnd()<.5?'#ffffff':'#b9ab98',.1],[1,'#ffffff',0]])},s);
  for(let k=0;k<6;k++){const x=R(-40,940),y=R(60,560),a=R(-58,-28);for(let j=0;j<4;j++){const dx=Math.cos(a*D)*j*42,dy=Math.sin(a*D)*j*42;
    E('ellipse',{cx:f(x+dx),cy:f(y+dy),rx:f(R(26,46)),ry:f(R(9,15)),fill:rad([[0,'#5a4a3a',.09],[1,'#5a4a3a',0]]),transform:`rotate(${f(a+R(-30,30))} ${f(x+dx)} ${f(y+dy)})`},s)}}}
/* species leaves along a garden stem */
function gLeaves(g,p,P){const f0=p.f,at=(u,side,fn)=>{const q=bz(P,u),q2=bz(P,Math.min(1,u+.02)),a=Math.atan2(q2[1]-q[1],q2[0]-q[0])/D+90;fn(G(g,{transform:`translate(${f(q[0])},${f(q[1])}) rotate(${f(a+side*R(38,62))})`}))};
  if(f0==='xRose'||f0==='peony')for(const[u,sd]of[[.32,-1],[.55,1]])at(u,sd,h=>{for(const[dx,dy,r,sc]of[[0,0,0,1],[-7,8,-38,.72],[7,8,38,.72],[-6,22,-50,.56],[6,22,50,.56]])leaf3(h,26*sc,10*sc,LG.rose,{tr:`translate(${dx},${-dy}) rotate(${r})`,teeth:7,nv:4,va:.08,vw:.45,mr:.8})});
  else if(f0==='xCarn')for(const u of[.3,.52,.72])for(const sd of[-1,1])at(u,sd,h=>leaf3(h,34,3.6,LG.glauc,{prof:sinP(.4,.05),nv:0,bend:sd*.2,mr:.5}));
  else if(f0==='xLily'||f0==='xGlor')for(let i=0;i<5;i++)at(.25+i*.12,i%2?1:-1,h=>leaf3(h,36,6.5,LG.dark,{prof:sinP(.6,.05),nv:3,va:.1,bend:R(-.2,.2),mr:.7}));
  else if(f0==='xDahlia'||f0==='xMum'||f0==='xRanunc'||f0==='xScab'||f0==='anemone'||f0==='cosmos'||f0==='marigold')for(const[u,sd]of[[.38,-1],[.6,1]])at(u,sd,h=>leaf3(h,30,13,LG.rose,{teeth:5,nv:4,va:.12,mr:.9}));
  else if(f0==='xAnth')at(.5,rnd()<.5?-1:1,h=>xAnthLeaf(h,0,{L:90,W:40,pl:24,rot:0}));
  else if(f0==='tulip'||f0==='sunflower'||f0==='hydrangea')at(.45,-1,h=>leaf3(h,52,13,LG.rose,{nv:5,va:.12}))}
/* one clump of a single variety: stems rising from behind the planter */
function clump(p,cx,n,heads){const sp=SP[p.f]||{k:'head',r:40};
  for(let j=0;j<n;j++){const x=cx+R(-62,62),back=rnd(),y=sp.k==='plant'?PT+30:PT-R(110,400)*(.55+.45*back)-(sp.r||40)*.2,sc=sp.k==='plant'?R(1.05,1.3):R(1.15,1.55)*(1-back*.2);heads.push({p,sp,x,y,sc,back,v:j})}}
function drawHead(s,h){const{p,sp,x,y,sc}=h,g=G(s),m=h.v%2?-1:1;
  if(sp.k==='plant'||sp.k==='spray'){const pk=G(g,{class:'pk','data-id':p.id});use(pk,`h-${p.id}-0`,x,y,R(-6,6),sc*m,sc);E('rect',{x:f(x-60),y:f(y-260*sc),width:120,height:f(260*sc),fill:'transparent'},pk);return}
  const bx=x+R(-30,30),P=[[bx,PT+40],[bx+R(-10,10),PT-(PT-y)*.4],[x+R(-14,14),y+(PT-y)*.35],[x,y+6]];
  stem3(g,P,f(5.2*Math.min(1.2,sc)),3.2,SG,14);gLeaves(g,p,P);
  const pk=G(g,{class:'pk','data-id':p.id});ao(pk,x+6,y+10,(sp.r||40)*sc,(sp.r||40)*sc*.9,.22);
  if(p.rar==='l')E('circle',{cx:f(x),cy:f(y),r:f((sp.r||40)*sc*1.5),fill:rad([[0,'#ffe9b0',.55],[1,'#ffe9b0',0]])},pk);
  use(pk,`h-${p.id}-0`,x,y,R(-14,14)+(p.f==='xAnth'?pick([0,25,-25,160]):0),sc*m,sc*R(.82,1));E('circle',{cx:f(x),cy:f(y),r:f((sp.r||40)*sc*.95),fill:'transparent'},pk)}
/* concrete planter: hides every stem base; the bays join like modules */
function planter(s){E('path',{d:`M-4,${PT-6}L904,${PT-6}L904,${PT+14}L-4,${PT+14}Z`,fill:lin(['#d9d3ca','#c6bfb5'],0,0,0,1)},s);
  E('rect',{x:-4,y:PT+14,width:908,height:200,fill:lin([[0,'#bdb6ab'],[.25,'#b1aa9f'],[1,'#958e84']],0,0,0,1)},s);
  E('path',{d:`M-4,${PT-5.5}H904`,stroke:'#f4f0ea','stroke-width':2,'stroke-opacity':.8},s);E('path',{d:`M-4,${PT+14}H904`,stroke:'#7d776e','stroke-width':1.5,'stroke-opacity':.5},s);
  for(let k=0;k<70;k++)E('circle',{cx:f(R(0,900)),cy:f(R(PT+16,1000)),r:f(R(.6,2.4)),fill:rnd()<.5?'#857f76':'#d6d0c7',opacity:f(R(.2,.55))},s);
  E('path',{d:`M.5,${PT-6}V1000`,stroke:'#8a847b','stroke-width':1,'stroke-opacity':.45},s)}
function midPanel(s,i){const[z,name,col]=ZONES[i],prods=CAT.filter(p=>p.fam===z),heads=[];
  E('ellipse',{cx:450,cy:540,rx:560,ry:440,fill:rad([[0,col,.2],[.55,col,.07],[1,col,0]])},s);
  const T=G(s,{class:'zt'});E('text',{x:450,y:118,class:'zn'},T).textContent=`Nº ${String(i+1).padStart(2,'0')}`;E('text',{x:450,y:180,class:'zh'},T).textContent=name;
  if(prods.length)E('text',{x:450,y:216,class:'zs'},T).textContent=`${prods.length} variétés · dès ${eur(Math.min(...prods.map(p=>p.p)))}`;
  const xs=prods.map((p,k)=>70+(k+.5)*(760/prods.length)+R(-18,18));
  prods.forEach((p,k)=>{const sp=SP[p.f]||{};if(sp.form==='retombante')return;clump(p,xs[k],sp.k==='plant'?2:pick([3,4,4]),heads)});
  heads.sort((a,b)=>(b.back-a.back)||(a.y-b.y)).forEach(h=>drawHead(s,h));
  planter(s);
  prods.forEach((p,k)=>{const sp=SP[p.f]||{};if(sp.form!=='retombante')return;const g=G(s),pk=G(g,{class:'pk','data-id':p.id}),x=xs[k];
    if(p.f==='xPhalSpray')xPhalSpray(G(pk,{transform:`translate(${f(x)},${PT-4})`}),0,Object.assign({},p.o,{hang:1,side:1,len:200,n:5}));
    else{for(const[dx,len,sw]of[[-14,170,-24],[0,210,12],[16,150,30]])amaranth(G(pk,{transform:`translate(${f(x+dx)},${PT-4})`}),0,Object.assign({},p.o,{len,sway:sw}));
      use(pk,`h-${p.id}-0`,x,PT+2,0,1.25,1.25)}
    E('rect',{x:f(x-40),y:PT-200,width:80,height:420,fill:'transparent'},pk)});
  prods.forEach((p,k)=>{const L=G(s,{class:'lab','data-id':p.id});const ly=PT+(k%2?96:44);E('text',{x:f(xs[k]),y:ly,class:'ln'},L).textContent=p.n;E('text',{x:f(xs[k]),y:ly+22,class:'lp','data-p':eur(p.p)},L).textContent=eur(p.p)})}
/* front: a few out-of-focus blooms passing close to the lens */
function frontPanel(s,i){const prods=CAT.filter(p=>p.fam===ZONES[i][0]&&(SP[p.f]||{}).k==='head');if(!prods.length)return;
  for(let k=0;k<2;k++){const p=pick(prods),x=k?R(620,900):R(0,260),y=k?R(880,1000):R(-40,60);use(s,`h-${p.id}-0`,x,y,R(0,360),R(2.4,3.2))}}
function gardenInit(){seed=2026;
  for(const[k,id,fn]of[['far','gFar',farPanel],['mid','gMid',midPanel],['front','gFront',frontPanel]])for(let i=0;i<NZ;i++){const s=E('svg',{viewBox:'0 0 900 1000',preserveAspectRatio:'xMidYMax slice','aria-hidden':'true'},$(id));renderStatic(()=>fn(s,i));GL[k].push(s)}
  grain();gardenLayout();setGX(PW*.5-GVW/2);markPicked();
  const gw=$('gw');let v=0,drag=0,lx=0,lt=0,mv=0,raf=0,down=null,dxy=null;
  const hideHint=()=>{if(!gStarted){gStarted=1;$('ghint').style.opacity=0}};
  gw.addEventListener('pointerdown',e=>{cancelAnimationFrame(raf);cancelAnimationFrame(zoneRaf);drag=1;mv=0;v=0;lx=e.clientX;lt=e.timeStamp;down=e.target.closest?e.target.closest('.pk'):null;dxy=[e.clientX,e.clientY];try{gw.setPointerCapture(e.pointerId)}catch(_){}});
  gw.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dt=Math.max(8,e.timeStamp-lt);setGX(GX-dx);v=-dx/dt;mv+=Math.abs(dx);lx=e.clientX;lt=e.timeStamp;if(mv>20)hideHint()});
  const up=()=>{if(!drag)return;drag=0;if(mv<8&&down){pickFlower(down,dxy[0],dxy[1]);hideHint()}else{const gl=()=>{setGX(GX+v*16);v*=.95;if(Math.abs(v)>.02)raf=requestAnimationFrame(gl)};raf=requestAnimationFrame(gl)}down=null};
  gw.addEventListener('pointerup',up);gw.addEventListener('pointercancel',up);
  gw.addEventListener('wheel',e=>{setGX(GX+(e.deltaX||e.deltaY));hideHint();e.preventDefault()},{passive:false});
  gw.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){setGX(GX+(e.key==='ArrowRight'?1:-1)*PW/3);e.preventDefault()}});
  $('chips').onclick=e=>{const b=e.target.closest('.chip');if(b)goZone(+b.dataset.z)};
  addEventListener('resize',()=>{clearTimeout(gardenInit.t);gardenInit.t=setTimeout(gardenLayout,200)})}
function gardenLayout(){const gw=$('gw'),H=gw.clientHeight||560;GVW=gw.clientWidth||400;const mid=PW?GX+GVW/2:0,oldPW=PW;PW=Math.round(H*.9);
  for(const k in GL)GL[k].forEach(s=>{s.style.width=PW+'px';s.style.height=H+'px'});setGX(oldPW?mid/oldPW*PW-GVW/2:GX)}
function setGX(x){GX=x;const T=NZ*PW;for(const k in GL){const sp=SPD[k];GL[k].forEach((s,i)=>{let p=((i*PW-x*sp)%T+T)%T;if(p>T-PW)p-=T;s.style.transform=`translate3d(${f(p)}px,0,0)`})}
  const z=Math.floor(((((x+GVW/2)%T)+T)%T)/PW);if(z!==curZone){curZone=z;zoneChips()}}
function zoneChips(){const c=$('chips');c.innerHTML=ZONES.map(([id,n,col],i)=>`<button class="chip${curZone===i?' on':''}" data-z="${i}" type="button" role="tab" aria-selected="${curZone===i}"><i style="--c:${col}"></i>${n}</button>`).join('');
  const on=c.querySelector('.on');if(on)c.scrollTo({left:on.offsetLeft-c.clientWidth/2+on.clientWidth/2,behavior:'smooth'})}
let zoneRaf=0;
function goZone(i){const T=NZ*PW;let tx=i*PW+PW/2-GVW/2;tx+=Math.round((GX-tx)/T)*T;const x0=GX,t0=performance.now();cancelAnimationFrame(zoneRaf);
  const st=now=>{const u=Math.min(1,(now-t0)/800);setGX(x0+(tx-x0)*eio(u));if(u<1)zoneRaf=requestAnimationFrame(st)};zoneRaf=requestAnimationFrame(st)}
function gardenNudge(){if(RM)return;const x0=GX,t0=performance.now();const st=now=>{const k=Math.min(1,(now-t0)/1500);setGX(x0+70*Math.sin(k*Math.PI));if(k<1)zoneRaf=requestAnimationFrame(st)};zoneRaf=requestAnimationFrame(st)}
function markPicked(){document.querySelectorAll('.lab[data-id]').forEach(l=>{const on=S.cart.has(l.getAttribute('data-id')),pp=l.querySelector('.lp');l.classList.toggle('on',on);if(pp)pp.textContent=on?'✓ CUEILLIE':pp.getAttribute('data-p')})}
/* ---------- picking: one pick per variety, the composer decides how many stems ---------- */
function pickFlower(pk,cx,cy){const id=pk.getAttribute('data-id'),p=BYID[id];if(!p)return;
  if(S.cart.has(id)){floatLabel(p,cx,cy,'Déjà cueillie');toast(`${p.n} est déjà dans ton bouquet`,()=>{S.cart.delete(id);update()},'Retirer');return}
  if(!canAdd(p))return;S.cart.set(id,1);seen(id);pk.classList.remove('picked');void pk.getBoundingClientRect();pk.classList.add('picked');
  flyIcon(p,cx,cy);floatLabel(p,cx,cy);try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}update();react(p)}
function flyIcon(p,cx,cy){if(RM)return;const s=document.createElementNS(NS,'svg'),sz=92,sp=SP[p.f]||{};s.setAttribute('viewBox',sp.k==='plant'?'-90 -260 180 270':'-62 -62 124 124');E('use',{href:`#h-${p.id}-0`},s);
  s.style.cssText=`position:fixed;left:${cx-sz/2}px;top:${cy-sz/2}px;width:${sz}px;height:${sz}px;z-index:70;pointer-events:none;overflow:visible`;document.body.appendChild(s);
  const b=$('pill').getBoundingClientRect(),dx=b.left+18-cx,dy=b.top+14-cy;
  s.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${f(dx*.4)}px,${f(dy*.5-60)}px) scale(.78) rotate(-12deg)`,offset:.45},{transform:`translate(${f(dx)}px,${f(dy)}px) scale(.14) rotate(-30deg)`,opacity:.4}],{duration:760,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>{s.remove();const pl=$('pill');pl.classList.remove('bump');void pl.offsetWidth;pl.classList.add('bump')}}
function floatLabel(p,cx,cy,note){const d=document.createElement('div');d.className='flab';d.innerHTML=`<i class="dot ${RAR[p.rar][1]}"></i>${esc(p.n)} <b>${note?esc(note):eur(p.p)}</b>`;d.style.left=cx+'px';d.style.top=(cy-40)+'px';document.body.appendChild(d);
  d.animate([{transform:'translate(-50%,0) scale(.8)',opacity:0},{transform:'translate(-50%,-10px) scale(1)',opacity:1,offset:.18},{transform:'translate(-50%,-10px) scale(1)',opacity:1,offset:.6},{transform:'translate(-50%,-44px) scale(1)',opacity:0}],{duration:1700,easing:'ease-out'}).onfinish=()=>d.remove()}
function grain(){try{const c=document.createElement('canvas');c.width=c.height=140;const x=c.getContext('2d'),im=x.createImageData(140,140);for(let i=0;i<im.data.length;i+=4){const v=Math.random()*255;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}x.putImageData(im,0,0);$('grain').style.backgroundImage=`url(${c.toDataURL()})`}catch(_){}}
