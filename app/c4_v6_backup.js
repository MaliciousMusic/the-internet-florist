
/* ================= Composer v4 — real sizes, stems radiating from the mouth, every flower visible ================= */
const OCCS={amour:{n:"Je t'aime",N:39,w:{dome:1.3,eventail:1.4,cascade:1.6},dr:1.4,ln:.8,gar:.18},anniv:{n:'Anniversaire',N:35,w:{libre:1.5,eventail:1.3},dr:1,ln:1.2,gar:.18},
 bravo:{n:'Félicitations',N:33,w:{libre:1.4,vertical:1.5,lcroissant:1.3},dr:.9,ln:1.5,gar:.14},merci:{n:'Merci',N:29,w:{libre:1.4,vertical:1.2,triangle:1.2},dr:.8,ln:1.2,gar:.16},
 courage:{n:'Courage',N:25,w:{dome:1.2,triangle:1.4},dr:.7,ln:.8,gar:.18},juste:{n:'Juste comme ça',N:31,w:{},dr:1,ln:1,gar:.16}};
/* silhouettes measured on the references: asp = width/height of the mass */
const TPL={eventail:{w:.24,asp:1.35,lines:[3,5],drape:'l',dec:[.15,.3]},libre:{w:.2,asp:1.2,lines:[3,7],drape:'lL',dec:[.2,.4]},triangle:{w:.16,asp:1,lines:[1,3],drape:'l',dec:[.25,.4]},
 cascade:{w:.12,asp:1.1,lines:[1,3],drape:'L',dec:[.15,.3]},dome:{w:.11,asp:1.12,lines:[0,1],drape:'l',dec:[0,.1]},vertical:{w:.08,asp:.78,lines:[3,5],drape:'l',dec:[.1,.25]},lcroissant:{w:.09,asp:1.25,lines:[1,3],drape:'l',dec:[.35,.5]}};
const VSHAPE={low:['coupe-blanche','coupe-noire','urne','jarre','boule-chocolat','boule-sapin','cobalt'],tall:['soliflore','balustre','calice','verre'],hand:['noue','papier'],kenzan:['kenzan']};
function sd(v){seed=(Math.abs(Math.round(v))*48271+12345)%2147483647||1;rnd();rnd();rnd()}
const odd=n=>{n=Math.max(1,Math.round(n));return n%2?n:n+1};
const hueD=(a,b)=>{const d=Math.abs(a-b)%360;return d>180?360-d:d};
function hsl(hex){const[r,g,b]=hx(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=(mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4)*60}return[h,s,l]}
function wpick(w){let t=0;for(const k in w)t+=w[k];let u=rnd()*t;for(const k in w){u-=w[k];if(u<=0)return k}return Object.keys(w)[0]}
function prof3(p){const sp=SP[p.f]||{form:'disque',size:2,k:'head',r:40},[H,S,L]=hsl(p.col||'#cccccc');return{p,f:p.f,sp,form:sp.form,size:sp.size,H,S,L,d3:D3.has(p.f)}}
/* overlap area of two discs (visibility) */
function lens(d,a,b){if(d>=a+b)return 0;if(d<=Math.abs(a-b))return Math.PI*Math.min(a,b)**2;const a2=a*a,b2=b*b;
  return a2*Math.acos(Math.max(-1,Math.min(1,(d*d+a2-b2)/(2*d*a))))+b2*Math.acos(Math.max(-1,Math.min(1,(d*d+b2-a2)/(2*d*b))))-.5*Math.sqrt(Math.max(0,(-d+a+b)*(d+a-b)*(d-a+b)*(d+a+b)))}
/* roles and stem counts from the occasion; no limit on the number of varieties */
function plan(ids,occ){const O=OCCS[occ]||OCCS.juste,items=ids.map(id=>prof3(BYID[id])),r={drape:[],line:[],focal:[],second:[],filler:[]};
  for(const it of items){if(it.form==='retombante')r.drape.push(it);else if(it.form==='ligne'||it.form==='epi')r.line.push(it)}
  const heads=items.filter(it=>!r.drape.includes(it)&&!r.line.includes(it)).sort((a,b)=>b.size-a.size||rnd()-.5);
  const nf=Math.max(1,Math.min(3,heads.filter(h=>h.size>=2.5).length||1));r.focal=heads.slice(0,nf);for(const it of heads.slice(nf))(it.size>=1.9?r.second:r.filler).push(it);
  const nv=items.length,mono=nv===1,N=Math.min(64,Math.max(O.N+(nv<=2?-6:0),Math.round(nv*2.6))),budget=N*(1-O.gar),cnt=new Map();
  const W={focal:5,second:5,filler:6,line:3,drape:2},lim={focal:[3,7],second:[3,9],filler:[3,11],line:[1,5],drape:[1,3]};let raw=0;for(const k in r)for(const it of r[k])raw+=W[k];
  for(const k in r)for(const it of r[k]){let n=mono?budget*.85:W[k]*budget/Math.max(1,raw);if(k==='line')n*=O.ln;if(k==='drape')n*=O.dr;
    let[a,b]=lim[k];if(nv>9&&k!=='line'&&k!=='drape')a=1;n=Math.min(mono&&k!=='line'&&k!=='drape'?25:b,Math.max(a,n));cnt.set(it,k==='drape'?Math.max(1,Math.round(n)):nv>9&&n<2.5?Math.max(1,Math.round(n)):odd(n))}
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items,r,cnt,N,tot,gar:Math.max(5,Math.round(N-tot+N*O.gar))}}
function pickTpl(P,vid){const w={};for(const k in TPL)w[k]=TPL[k].w*(P.O.w[k]||1);const{r}=P;
  if(r.drape.length){w.cascade*=3;w.libre*=1.3}else w.cascade*=.15;if(r.line.length>=2){w.vertical*=1.8;w.libre*=1.5;w.eventail*=1.3}if(!r.line.length){w.vertical*=.4;w.libre*=.7}
  const vs=Object.keys(VSHAPE).find(k=>VSHAPE[k].includes(vid))||'low';
  if(vs==='low'){w.dome*=1.2;w.eventail*=1.3;w.cascade*=1.3;w.vertical*=.5}if(vs==='tall'){w.vertical*=1.6;w.triangle*=1.3;w.lcroissant*=1.3;w.dome*=.6}
  if(vs==='hand'){w.eventail*=1.5;w.libre*=1.3;w.cascade*=1.2;w.dome*=.7}if(vs==='kenzan'){w.vertical*=1.4;w.libre*=1.3;w.lcroissant*=1.4}return wpick(w)}
function basePoint(vid){const v=VZ[vid]||VZ['coupe-blanche'];return v.kind==='hand'||v.kind==='wrap'?[VX,830]:[VX,FL-vH(v)]}
/* real size of one stem: diameter in cm with natural spread and opening stage */
function stemSize(it,st){const c0=CM[it.f]||7,cm=c0*R(.9,1.1)*(st==='bud'?.5:st==='half'?.78:1);return{cm,r:(it.sp.r||c0/2*UPC)*cm/c0}}
function pickStage(it,edge){const w={open:edge?.55:.85};if(it.d3&&BUD3.has(it.f)){w.half=edge?.35:.18;w.bud=edge?.3:.06}else if(hasView(it.f,'bud')){w.bud=edge?.25:.05;if(hasView(it.f,'half'))w.half=.15}return wpick(w)}

function candidate(P,sv,vid,tk){sd(sv);const T=TPL[tk],s=rnd()<.5?-1:1,BP=basePoint(vid),v=VZ[vid]||{},mw=vMouth(v)||26,{r}=P,cnt=new Map(P.cnt),out=[],heads=[];
  /* every head stem at its real size: the mass is sized from the flowers, not the flowers from the mass */
  const pool=[];for(const k of['focal','second','filler'])for(const it of r[k])for(let j=0;j<cnt.get(it);j++)pool.push({it,role:k,j});
  let area=0;for(const q of pool){const st=pickStage(q.it,q.j>0&&rnd()<.25);Object.assign(q,{st},stemSize(q.it,st));area+=Math.PI*q.r*q.r}
  const ry=Math.max(60,Math.sqrt(area*.6/(Math.PI*T.asp))),rx=ry*T.asp,dec=R(T.dec[0],T.dec[1]),FP=[BP[0]+s*dec*rx*.5,BP[1]-ry*.82],H=ry*2.1;
  /* three-lobed envelope: main mass, a lower lobe on the other side, a higher lobe toward the apex — never a ball */
  const lobes=[{cx:FP[0],cy:FP[1],rx,ry},{cx:FP[0]-s*rx*.72,cy:FP[1]+ry*.3,rx:rx*.48,ry:ry*.5},{cx:FP[0]+s*rx*.28,cy:FP[1]-ry*.62,rx:rx*.42,ry:ry*.48}];
  const inEnv=(x,y,k=1)=>lobes.some(l=>((x-l.cx)/(l.rx*k))**2+((y-l.cy)/(l.ry*k))**2<=1);
  const AP=[BP[0]-s*rx*R(.05,.2),FP[1]-ry*R(1.5,1.9)],DP=[BP[0]+s*mw*R(.3,.85),BP[1]+2];
  /* visibility: a head may hide only part of what is behind it, and must stay visible itself */
  const vis=h=>{let occ=0;for(const o of heads)if(o!==h&&o.z>h.z)occ+=lens(Math.hypot(o.x-h.x,o.y-h.y),o.r*.92,h.r*.92);return 1-occ/(Math.PI*(h.r*.92)**2)};
  const fits=(x,y,rr,z,need)=>{if(vis({x,y,r:rr,z})<need)return false;for(const o of heads){if(o.z>=z)continue;const ov=lens(Math.hypot(o.x-x,o.y-y),o.r*.92,rr*.92)/(Math.PI*(o.r*.92)**2);if(ov>(o.focal?.25:.5))return false;if(vis(o)-ov<(o.focal?.72:.38))return false}return true};
  const axFor=(x,y,z,form)=>{const dx=x-BP[0],dy=BP[1]-y,l=Math.hypot(dx,dy)||1;let fz=.3+1.1*z;if(form==='cornet')fz*=.45;if(form==='orchidee'||form==='disque'||form==='coeur'||form==='etoile')fz=Math.max(fz,.6);return V3.nz([dx/l,dy/l,fz])};
  const push=(q,x,y,z,extra={})=>{out.push(Object.assign({it:q.it,role:q.role,kind:'head',x,y,z,cm:q.cm,st:q.st,ax:axFor(x,y,z,q.it.form),rr:q.r,rot:Math.atan2(x-BP[0],BP[1]-y)/D*.8},extra));heads.push({x,y,r:q.r,it:q.it,z,focal:q.role==='focal'})};
  /* lines first: the tallest to the apex, others fanned, never parallel */
  const lines=[];for(const it of r.line)for(let i=0;i<cnt.get(it);i++)lines.push(it);const angs=[];
  lines.forEach((it,i)=>{let th;if(i===0)th=Math.atan2(AP[0]-BP[0],BP[1]-AP[1])/D;else for(let k=0;k<40;k++){th=(rnd()<.65?-s:s)*R(8,70);if(angs.every(a=>Math.abs(a-th)>=14))break}
    angs.push(th);const len=(i===0?1:R(.62,.92))*(BP[1]-AP[1])*(1-Math.abs(th)/170),ex=BP[0]+Math.sin(th*D)*len,ey=BP[1]-Math.cos(th*D)*len,nat=it.sp.self;
    out.push({it,role:'line',kind:'self',x:BP[0]+R(-8,8),y:BP[1]-6,rot:th,scale:nat?Math.min(2.4,Math.max(.8,len/nat)):1,len,ex,ey,z:.1})});
  /* focal flowers: zigzag at three heights, biggest first so the smaller ones find room around them */
  const TRI=[[-.04,.1],[.2,-.15],[-.24,-.32],[.32,.12],[-.36,.04],[.1,-.48],[-.12,.3]];let fi=0;
  for(const q of pool.filter(q=>q.role==='focal').sort((a,b)=>b.r-a.r)){let ok=false,x,y,z;
    for(let k=0;k<40&&!ok;k++){const o=TRI[(fi+k)%TRI.length];x=FP[0]+s*o[0]*rx*2+R(-12,12)*(1+k*.1);y=FP[1]+o[1]*ry*2+R(-12,12)*(1+k*.1);z=fi<3?R(.8,1):R(.55,.85);ok=fits(x,y,q.r,z,.8)}
    if(ok){push(q,x,y,z);fi++}else q.skip=1}
  /* the mass in drifts: dark varieties near the core, light ones outward; small flowers forward, big ones back */
  const rest=pool.filter(q=>q.role!=='focal').sort((a,b)=>a.it.L-b.it.L),byV=new Map();for(const q of rest){if(!byV.has(q.it))byV.set(q.it,[]);byV.get(q.it).push(q)}
  [...byV.values()].forEach((grp,gi,all)=>{const dark=gi/Math.max(1,all.length-1),lb=lobes[gi%3===2?1:gi%3===1?2:0],phi=R(0,6.283),dc=[lb.cx+Math.cos(phi)*lb.rx*(.1+.55*dark),lb.cy+Math.sin(phi)*lb.ry*(.1+.55*dark)];
    grp.forEach((q,j)=>{let ok=false,x,y,z;const edge=q.st!=='open';for(let k=0;k<60&&!ok;k++){const a=j*2.39+R(-.7,.7),d=q.r*(.6+.5*Math.sqrt(j+1))*(1+k*.04);
        if(edge&&k<30){const l=pick(lobes),t=R(0,6.283);x=l.cx+Math.cos(t)*l.rx*R(.85,1.15);y=l.cy+Math.sin(t)*l.ry*R(.85,1.15)}else{x=dc[0]+Math.cos(a)*d;y=dc[1]+Math.sin(a)*d*.85}
        y=Math.min(y,BP[1]-q.r*.3);if(y>BP[1]-ry*.45)x=Math.max(BP[0]-mw-q.r*1.1,Math.min(BP[0]+mw+q.r*1.1,x));
        z=q.r<34?R(.45,.95):R(.15,.7);ok=(edge?inEnv(x,y,1.25):inEnv(x,y,1.05))&&fits(x,y,q.r,z,k<30?.55:.45)}
      if(ok)push(q,x,y,z);else q.skip=1})});
  /* rim flowers: stems resting on the lip, one spilling over the front, so the bouquet sits IN the vessel */
  if(v.kind!=='hand'&&v.kind!=='wrap'){const rim=rest.filter(q=>q.skip).slice(0,3),extra=rest.filter(q=>!q.skip&&q.r<44);for(let i=0;rim.length<2&&i<extra.length;i++)rim.push(Object.assign({},extra[i]));
    rim.forEach((q,i)=>{const sd2=i%2?-s:s;push(q,BP[0]+sd2*mw*R(.4,1.05),BP[1]-q.r*R(.15,.4),.97,{front:i===0,ax:V3.nz([sd2*.85,-.15,.55])});q.skip=0})}
  /* garnish fills the holes inside the envelope: free berries, buds, burnet and grasses picked from the palette */
  const gk=garnishKinds(P.items);let ng=0;for(let k=0;k<400&&ng<P.gar;k++){const l=pick(lobes),t=R(0,6.283),q=Math.sqrt(rnd())*.95,x=l.cx+Math.cos(t)*l.rx*q,y=l.cy+Math.sin(t)*l.ry*q,rr=14;
    if(y>BP[1]-8)continue;if(heads.some(h=>Math.hypot(h.x-x,h.y-y)<(h.r+rr)*.7))continue;out.push({role:'garnish',kind:'garnish',type:gk[ng%gk.length],x,y,rot:R(-40,40),scale:R(.8,1.05),z:R(.02,.3)});heads.push({x,y,r:rr,gar:1,z:.1,it:{p:{id:'g'},L:.3,S:.3}});ng++}
  /* drapes on the mass side, opposite the apex, hanging from the lip */
  const dl=(T.drape==='L'?1.1:.82)*(H+150);for(const it of r.drape)for(let i=0;i<cnt.get(it);i++)out.push({it,role:'drape',kind:'drape',x:DP[0]+s*R(-6,22)+i*s*16,y:DP[1]-R(6,18),len:R(.32,.5)*dl,sway:s*R(26,70),side:s,z:2});
  for(const o of out){if(o.kind!=='head')continue;o.behind=heads.some(h=>h.z<o.z-.05&&Math.hypot(h.x-o.x,h.y-o.y)<(h.r+o.rr)*.75);o.outer=!inEnv(o.x,o.y,.8)}
  return{out,heads,tk,T,s,H,W:rx*2,FP,AP,DP,BP,ell:{cx:FP[0],cy:FP[1],rx,ry},lobes,P,cnt}}
function garnishKinds(items){const L=items.reduce((a,it)=>a+it.L,0)/Math.max(1,items.length),warm=items.filter(it=>it.S>.2&&(it.H<60||it.H>300)).length>=items.length/2;
  return L<.5?['baies','sanguisorbe','boutons']:warm?['sanguisorbe','boutons','graminee','baies']:['boutons','graminee','baies']}
/* ---------- quality control: balance, every variety visible, density, lines, drapes, grouping ---------- */
function scoreC(c){const{heads,out,BP,ell}=c,hh=heads.filter(h=>!h.gar);let Lw=0,Rw=0;
  for(const h of hh){const w=h.r*h.r*(.6+.8*(1-h.it.L));if(h.x<BP[0])Lw+=w;else Rw+=w}
  const bal=Math.max(Lw,Rw)/Math.max(1,Lw+Rw),sBal=bal<.54?Math.max(0,1-(.54-bal)*4):bal>.72?Math.max(0,1-(bal-.72)*4):1;
  const visOf=h=>{let occ=0;for(const o of heads)if(o!==h&&o.z>h.z)occ+=lens(Math.hypot(o.x-h.x,o.y-h.y),o.r*.92,h.r*.92);return 1-occ/(Math.PI*(h.r*.92)**2)};
  const ids=new Set(c.P.items.filter(it=>it.form!=='retombante'&&it.form!=='ligne'&&it.form!=='epi').map(it=>it.p.id));let shown=0;for(const id of ids)if(hh.some(h=>h.it.p.id===id&&visOf(h)>.6))shown++;
  const sShow=ids.size?shown/ids.size:1,sVisMin=hh.length?Math.min(...hh.map(visOf)):1;
  let inside=0,cov=0;for(let i=0;i<18;i++)for(let j=0;j<14;j++){const x=ell.cx-ell.rx+(i+.5)*ell.rx/9,y=ell.cy-ell.ry+(j+.5)*ell.ry/7;if(((x-ell.cx)/ell.rx)**2+((y-ell.cy)/ell.ry)**2>.75)continue;inside++;if(heads.some(h=>Math.hypot(h.x-x,h.y-y)<=h.r*.95))cov++}
  const sDens=Math.min(1,(inside?cov/inside:0)/.85),lines=out.filter(o=>o.role==='line').length,sLines=c.tk==='dome'?1:Math.min(1,lines/2);
  let same=0,tot=0;for(const h of hh){let nb=null,bd=1e9;for(const o of hh){if(o===h)continue;const d=Math.hypot(o.x-h.x,o.y-h.y);if(d<bd){bd=d;nb=o}}tot++;if(nb&&nb.it.p.id===h.it.p.id)same++}
  const gi=tot?same/tot:.5,sGrp=gi>=.3&&gi<=.75?1:.6,sDrape=c.P.r.drape.length?1:(c.tk==='cascade'?0:.8),skipped=c.P.tot-hh.length;
  return 3*sBal+4*sShow+2*Math.max(0,sVisMin)+3*sDens+2*sLines+2*sDrape+1*sGrp-.08*Math.max(0,skipped)}
function compose(ids,sv,occ,vid){const P=plan(ids,occ);sd(sv*31+7);const tk=pickTpl(P,vid);let best=null;for(let k=0;k<8;k++){const c=candidate(P,sv*97+k*13+1,vid,tk),sc=scoreC(c);if(!best||sc>best.score){best=c;best.score=sc}}return best}
