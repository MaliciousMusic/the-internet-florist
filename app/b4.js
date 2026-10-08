
/* ================= La serre : une allée en perspective par couleur, voûte de fer, statue, tapis de mousse ================= */
const ZONES=[['blanc','Blancs & crèmes','#efe9dc'],['peche','Pêches & corails','#f2a27e'],['rose','Roses poudrés','#efb7c0'],['fuchsia','Fuchsias','#c2387f'],['rouge','Rouges','#c8162a'],
 ['bordeaux','Bordeaux & vins','#7a1430'],['noir','Noirs & aubergines','#3a0c22'],['violet','Violets & mauves','#8a5ac0'],['bleu','Bleus & lavandes','#7f9ee0'],['vert','Verts & chartreuses','#8fae4a'],
 ['jaune','Jaunes & ors','#f2c832'],['orange','Oranges & cuivres','#ef7a26'],['lignes','Lignes & retombées','#6a3a2a']];
const NZ=ZONES.length,GL={far:[],mid:[],front:[]},SPD={far:.3,mid:1,front:1.45},VPX=450,VPY=470,GZ=1.55;
let GX=0,PW=500,GVW=400,curZone=-1,gStarted=0;
const ut=(x,y,r,s,sy)=>`translate(${f(x)},${f(y)}) rotate(${f(r)}) scale(${f(s)},${f(sy??s)})`;
function use(par,id,x,y,r,s,sy){return E('use',{href:'#'+id,transform:ut(x,y,r,s,sy)},par)}
const yAt=s=>VPY+530*s;/* ground height for a perspective scale s (1 = at the viewer's feet, 0 = vanishing point) */
/* far: daylight through the glass */
function farPanel(s){E('rect',{x:-4,y:0,width:908,height:1000,fill:lin([[0,'#f6f9f3'],[.5,'#e4ece0'],[1,'#cddbc8']],0,0,0,1)},s)}
/* the corridor: glass end wall, iron vault, statue, moss path, beds */
function corridor(s){
  E('rect',{x:-4,y:-4,width:908,height:1008,fill:lin([[0,'#eef3ea'],[.45,'#f7faf4'],[.47,'#dfe8da'],[1,'#c6d4bf']],0,0,0,1)},s);
  const arch=`M210,${VPY}V230A240,240 0 0 1 690,230V${VPY}`;E('path',{d:arch+'Z',fill:rad([[0,'#ffffff',.95],[.6,'#f3f8ef',.7],[1,'#e2ecdd',.4]],.5,.55,.6)},s);
  let mu='';for(let x=240;x<=660;x+=30){const yt=230-Math.sqrt(Math.max(0,240*240-(x-450)**2))+0;mu+=`M${x},${VPY}V${f(Math.max(yt,-20))}`}for(let y=430;y>0;y-=42){const w=y<230?Math.sqrt(Math.max(0,240*240-(230-y)**2)):240;mu+=`M${f(450-w)},${y}H${f(450+w)}`}
  E('path',{d:mu,stroke:'#55705f','stroke-width':1.2,'stroke-opacity':.35},s);E('path',{d:arch,stroke:'#3e5a4c','stroke-width':4,fill:'none','stroke-opacity':.55},s);
  /* iron ribs of the vault, receding toward the end wall */
  for(let k=0;k<7;k++){const sc=1-k*.13,rho=560*sc,yc=VPY-300*sc,o=.18+.4*sc;E('path',{d:`M${f(VPX-rho)},${f(yAt(sc*.98))}V${f(yc)}A${f(rho)},${f(rho)} 0 0 1 ${f(VPX+rho)},${f(yc)}V${f(yAt(sc*.98))}`,stroke:'#2e473c','stroke-width':f(1+5*sc),'stroke-opacity':f(o),fill:'none'},s)}
  E('ellipse',{cx:VPX,cy:VPY-60,rx:260,ry:220,fill:rad([[0,'#ffffff',.55],[1,'#ffffff',0]])},s);
  E('ellipse',{cx:VPX,cy:VPY+10,rx:34,ry:6,fill:'#3a4a30',opacity:.35},s);use(s,'fz-statue',VPX,VPY+9,0,.7);
  /* moss path */
  const pth=`M${VPX-180},1004L${VPX-9},${VPY+6}L${VPX+9},${VPY+6}L${VPX+180},1004Z`;E('path',{d:pth,fill:lin([[0,'#c9df84'],[.35,'#a9cc56'],[1,'#7ea83a']],0,0,0,1)},s);
  for(let i=0;i<150;i++){const sc=Math.pow(rnd(),.8),y=yAt(sc),hw=170*sc+6,x=VPX+R(-hw,hw);E('ellipse',{cx:f(x),cy:f(y),rx:f(1+7*sc),ry:f(.6+3*sc),fill:rnd()<.5?'#d6e99a':'#6f9a2c',opacity:f(R(.25,.55))},s)}
  E('path',{d:`M${VPX-180},1004L${VPX-9},${VPY+6}M${VPX+180},1004L${VPX+9},${VPY+6}`,stroke:'#2c3a1c','stroke-width':3,'stroke-opacity':.5},s);
  /* beds: dark leafy ground either side of the path */
  for(const sd of[-1,1])E('path',{d:`M${VPX+sd*9},${VPY+6}L${VPX+sd*180},1004L${VPX+sd*560},1004L${VPX+sd*560},${VPY+10}Z`,fill:lin([[0,'#5f7e58'],[.3,'#2e4a2c'],[1,'#1b2d1a']],0,0,0,1)},s)}
/* one flower stem in a bed (real size x perspective) */
function bedHead(s,p,sp,bx,by,sc,side,v){const g=G(s),c0=CM[p.f]||7,stemH=R(28,55)*UPC*GZ*sc,hx=bx+side*R(4,16)*sc,hy=by-stemH,dim=D3.has(p.f),k=GZ*sc*R(.9,1.1)*(dim?1:artK(p.f));
  if(sp.k==='plant'||sp.k==='spray'){const pk=G(g,{class:'pk','data-id':p.id});use(pk,`h-${p.id}-0`,bx,by,R(-6,6),GZ*sc*.9);E('rect',{x:f(bx-40*sc),y:f(by-280*sc),width:f(80*sc),height:f(280*sc),fill:'transparent'},pk);return}
  stem3(g,[[bx,by],[bx+R(-6,6)*sc,by-stemH*.4],[hx+R(-8,8)*sc,by-stemH*.75],[hx,hy+c0*UPC*k*.25]],f(Math.max(1.2,5*sc*GZ*.6)),f(Math.max(.8,3*sc*GZ*.6)),SG,10);
  if(sc>.45&&rnd()<.6)leaf3(G(g,{transform:`translate(${f(bx+R(-3,3))},${f(by-stemH*R(.25,.5))}) rotate(${f(side*R(30,60))}) scale(${f(sc*GZ*.8)})`}),34,9,LG.rose,{nv:4,va:.1,mr:.8});
  const pk=G(g,{class:'pk','data-id':p.id}),id=dim?(v==='b'&&document.getElementById(`h-${p.id}-b`)?`h-${p.id}-b`:document.getElementById(`h-${p.id}-${v}`)?`h-${p.id}-${v}`:`h-${p.id}-0`):`h-${p.id}-0`;
  use(pk,id,hx,hy,dim?0:R(-15,15),k*(v==='b'?.8:1));E('circle',{cx:f(hx),cy:f(hy),r:f(Math.max(14,(sp.r||40)*k*.9)),fill:'transparent'},pk)}
function midPanel(s,i){const z=ZONES[i][0],prods=CAT.filter(p=>p.fam===z);corridor(s);
  const items=[];/* tall framing plants and foliage at all depths */
  for(const sd of[-1,1]){for(const[sc,off,k]of[[R(.82,.9),R(190,280),1.3],[R(.52,.6),R(130,220),1.5],[R(.3,.36),R(70,150),1.7]])items.push({s:sc,fn:sc=>use(s,`fz-tf${rnd()<.5?0:1}`,VPX+sd*(180*sc+off*sc),yAt(sc),R(-4,4)+sd*4,-sd*sc*k,sc*k)});
    items.push({s:R(.4,.5),fn:sc=>use(s,`fz-palm${rnd()<.5?0:1}`,VPX+sd*(180*sc+R(160,260)*sc),yAt(sc),sd*R(5,15),sc*2.6)});
    items.push({s:R(.62,.72),fn:sc=>use(s,`fz-palm${rnd()<.5?0:1}`,VPX+sd*(180*sc+R(260,380)*sc),yAt(sc),sd*R(5,20),sc*2.4)});
    items.push({s:R(.88,.98),fn:sc=>use(s,`fz-ban${rnd()<.5?0:1}`,VPX+sd*(180*sc+R(220,330)*sc),yAt(sc),sd*R(10,35),sc*1.9)});
    for(let k=0;k<9;k++){const sc=R(.1,1);items.push({s:sc,fn:sc=>use(s,`fz-${pick(['pl0','pl1','nf0','nf1','fern','fern1','pl0'])}`,VPX+sd*(180*sc+R(10,360)*sc),yAt(sc)+2,sd*R(-20,20),sc*GZ*R(.8,1.15))})}}
  /* the flowers of this colour: every variety near the path at the front, then repeated deeper in the beds */
  prods.forEach((p,k)=>{const sp=SP[p.f]||{k:'head',r:40},n=sp.k==='plant'?2:4;for(let j=0;j<n;j++){const sc=j===0?R(.78,1):j===1?R(.5,.75):R(.18,.5),sd=(k+j)%2?1:-1,off=j===0?R(20,140):R(20,330),
    v=sd<0?(rnd()<.6?'r':'0'):(rnd()<.6?'l':'0'),bud=BUD3.has(p.f)&&rnd()<.25;
    items.push({s:sc,fn:sc=>{const bx=VPX+sd*(180*sc+off*sc),by=yAt(sc)+R(-4,4);for(let m=0;m<(sp.k==='head'?R(1,3)|0:1)+1;m++)bedHead(s,p,sp,bx+R(-28,28)*sc,by+R(-4,4)*sc,sc*R(.92,1.05),sd,bud&&m===0?'b':v)}})}});
  items.sort((a,b)=>a.s-b.s).forEach(it=>it.fn(it.s));
  E('rect',{x:-4,y:VPY-260,width:908,height:330,fill:lin([[0,'#f4f8f1',0],[.6,'#f4f8f1',.28],[1,'#f4f8f1',0]],0,0,0,1)},s)}
/* front: out-of-focus fronds close to the lens */
function frontPanel(s,i){if(i%2)use(s,'fz-fern1',R(-40,60),R(1000,1060),R(-60,-35),R(2,2.4));else use(s,`fz-ban${i%4?1:0}`,R(840,940),R(1010,1070),R(-40,-15),R(1.4,1.7))}
function gardenInit(){seed=2026;serreDefs();
  for(const[k,id,fn]of[['far','gFar',farPanel],['mid','gMid',midPanel],['front','gFront',frontPanel]])for(let i=0;i<NZ;i++){const s=E('svg',{viewBox:'0 0 900 1000',preserveAspectRatio:'xMidYMax slice','aria-hidden':'true'},$(id));LOD=1;renderStatic(()=>fn(s,i));LOD=0;GL[k].push(s)}
  gardenLayout();setGX(PW*.5-GVW/2);
  const gw=$('gw');let v=0,drag=0,lx=0,lt=0,mv=0,raf=0,down=null,dxy=null;
  const hideHint=()=>{if(!gStarted){gStarted=1;$('ghint').style.opacity=0}};
  gw.addEventListener('pointerdown',e=>{cancelAnimationFrame(raf);cancelAnimationFrame(zoneRaf);drag=1;mv=0;v=0;lx=e.clientX;lt=e.timeStamp;down=e.target.closest?e.target.closest('.pk'):null;dxy=[e.clientX,e.clientY];try{gw.setPointerCapture(e.pointerId)}catch(_){}});
  gw.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dt=Math.max(8,e.timeStamp-lt);setGX(GX-dx);v=-dx/dt;mv+=Math.abs(dx);lx=e.clientX;lt=e.timeStamp;if(mv>20)hideHint()});
  const up=()=>{if(!drag)return;drag=0;if(mv<8&&down){pickFlower(down,dxy[0],dxy[1]);hideHint()}else{const gl=()=>{setGX(GX+v*16);v*=.95;if(Math.abs(v)>.02)raf=requestAnimationFrame(gl);else snap()};raf=requestAnimationFrame(gl)}down=null};
  gw.addEventListener('pointerup',up);gw.addEventListener('pointercancel',up);
  gw.addEventListener('wheel',e=>{setGX(GX+(e.deltaX||e.deltaY));hideHint();clearTimeout(gardenInit.w);gardenInit.w=setTimeout(snap,180);e.preventDefault()},{passive:false});
  gw.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){goZone((curZone+(e.key==='ArrowRight'?1:NZ-1))%NZ);e.preventDefault()}});
  addEventListener('resize',()=>{clearTimeout(gardenInit.t);gardenInit.t=setTimeout(gardenLayout,200)})}
/* settle on the nearest corridor so its vanishing point sits in the middle of the screen */
function snap(){const T=NZ*PW,c=GX+GVW/2,i=Math.round((c-PW/2)/PW);goZone(((i%NZ)+NZ)%NZ)}
function gardenLayout(){const gw=$('gw'),H=gw.clientHeight||560;GVW=gw.clientWidth||400;const mid=PW?GX+GVW/2:0,oldPW=PW;PW=Math.round(H*.9);
  for(const k in GL)GL[k].forEach(s=>{s.style.width=PW+'px';s.style.height=H+'px'});setGX(oldPW?mid/oldPW*PW-GVW/2:GX)}
function setGX(x){GX=x;const T=NZ*PW;for(const k in GL){const sp=SPD[k];GL[k].forEach((s,i)=>{let p=((i*PW-x*sp)%T+T)%T;if(p>T-PW)p-=T;s.style.transform=`translate3d(${f(p)}px,0,0)`})}
  const z=Math.floor(((((x+GVW/2)%T)+T)%T)/PW);if(z!==curZone)curZone=z}
function zoneChips(){}
let zoneRaf=0;
function goZone(i){const T=NZ*PW;let tx=i*PW+PW/2-GVW/2;tx+=Math.round((GX-tx)/T)*T;const x0=GX,t0=performance.now();cancelAnimationFrame(zoneRaf);
  const st=now=>{const u=Math.min(1,(now-t0)/650);setGX(x0+(tx-x0)*eio(u));if(u<1)zoneRaf=requestAnimationFrame(st)};zoneRaf=requestAnimationFrame(st)}
function gardenNudge(){if(RM)return;const x0=GX,t0=performance.now();const st=now=>{const k=Math.min(1,(now-t0)/1500);setGX(x0+70*Math.sin(k*Math.PI));if(k<1)zoneRaf=requestAnimationFrame(st)};zoneRaf=requestAnimationFrame(st)}
function markPicked(){}
/* ---------- picking: one pick per variety, the composer decides how many stems ---------- */
function pickFlower(pk,cx,cy){const id=pk.getAttribute('data-id'),p=BYID[id];if(!p)return;
  if(S.cart.has(id)){floatLabel(p,cx,cy,'Déjà cueillie');toast(`${p.n} est déjà dans ton bouquet`,()=>{S.cart.delete(id);update()},'Retirer');return}
  if(!canAdd(p))return;S.cart.set(id,1);seen(id);pk.classList.remove('picked');void pk.getBoundingClientRect();pk.classList.add('picked');
  flyIcon(p,cx,cy);floatLabel(p,cx,cy);try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}update();react(p)}
function flyIcon(p,cx,cy){if(RM)return;const s=document.createElementNS(NS,'svg'),sz=92,sp=SP[p.f]||{};s.setAttribute('viewBox',sp.k==='plant'?'-90 -260 180 270':'-62 -62 124 124');E('use',{href:`#h-${p.id}-0`},s);
  s.style.cssText=`position:fixed;left:${cx-sz/2}px;top:${cy-sz/2}px;width:${sz}px;height:${sz}px;z-index:70;pointer-events:none;overflow:visible`;document.body.appendChild(s);
  const b=$('pill').getBoundingClientRect(),dx=b.left+18-cx,dy=b.top+14-cy;
  s.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${f(dx*.4)}px,${f(dy*.5-60)}px) scale(.78) rotate(-12deg)`,offset:.45},{transform:`translate(${f(dx)}px,${f(dy)}px) scale(.14) rotate(-30deg)`,opacity:.4}],{duration:760,easing:'cubic-bezier(.4,0,.2,1)'}).onfinish=()=>{s.remove();const pl=$('pill');pl.classList.remove('bump');void pl.offsetWidth;pl.classList.add('bump')}}
function floatLabel(p,cx,cy,note){const d=document.createElement('div');d.className='flab';d.innerHTML=`<i class="dot ${RAR[p.rar][1]}"></i>${esc(p.n)} <b>${note?esc(note):'✓'}</b>`;d.style.left=cx+'px';d.style.top=(cy-40)+'px';document.body.appendChild(d);
  d.animate([{transform:'translate(-50%,0) scale(.8)',opacity:0},{transform:'translate(-50%,-10px) scale(1)',opacity:1,offset:.18},{transform:'translate(-50%,-10px) scale(1)',opacity:1,offset:.6},{transform:'translate(-50%,-44px) scale(1)',opacity:0}],{duration:1700,easing:'ease-out'}).onfinish=()=>d.remove()}
function grain(){}
