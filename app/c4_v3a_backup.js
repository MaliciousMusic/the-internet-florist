
/* ================= Composer v3 — one pick per variety; the occasion decides the stems; dense contemporary masses ================= */
const OCCS={amour:{n:"Je t'aime",N:31,w:{dome:1.5,eventail:1.4,cascade:1.6},dr:1.4,ln:.8,gar:.2},anniv:{n:'Anniversaire',N:27,w:{libre:1.5,eventail:1.3},dr:1,ln:1.2,gar:.2},
 bravo:{n:'Félicitations',N:25,w:{libre:1.4,vertical:1.5,lcroissant:1.3},dr:.9,ln:1.5,gar:.15},merci:{n:'Merci',N:21,w:{libre:1.4,vertical:1.2,triangle:1.2},dr:.8,ln:1.2,gar:.16},
 courage:{n:'Courage',N:19,w:{dome:1.3,triangle:1.4},dr:.7,ln:.8,gar:.2},juste:{n:'Juste comme ça',N:23,w:{},dr:1,ln:1,gar:.18}};
const TPL={eventail:{w:.24,lh:[.95,1.15],hc:[2.6,3.2],dec:[.15,.25],lines:[3,5],drape:'l',neg:[.15,.30]},libre:{w:.20,lh:[.85,1.05],hc:[2.6,3.4],dec:[.2,.35],lines:[3,7],drape:'lL',neg:[.20,.40]},
 triangle:{w:.16,lh:[.75,.9],hc:[2.4,3.2],dec:[.25,.35],lines:[1,3],drape:'l',neg:[.15,.30]},cascade:{w:.12,lh:[.6,.75],hc:[2.4,3.2],dec:[.15,.3],lines:[1,3],drape:'L',neg:[.15,.30]},
 dome:{w:.11,lh:[1.05,1.3],hc:[1.9,2.4],dec:[0,.1],lines:[0,1],drape:'l',neg:[.05,.15]},vertical:{w:.08,lh:[.55,.7],hc:[3.2,4],dec:[.1,.25],lines:[3,5],drape:'l',neg:[.30,.45]},
 lcroissant:{w:.09,lh:[.85,1.15],hc:[2.4,3],dec:[.35,.5],lines:[1,3],drape:'l',neg:[.15,.30]}};
const VSHAPE={low:['coupe-blanche','coupe-noire','urne','jarre','boule-chocolat','boule-sapin','cobalt'],tall:['soliflore','balustre','calice','verre'],hand:['noue','papier'],kenzan:['kenzan']};
/* seed the LCG with a mixed value and warm it up: small seeds give tiny first draws */
function sd(v){seed=(Math.abs(Math.round(v))*48271+12345)%2147483647||1;rnd();rnd();rnd()}
const odd=n=>{n=Math.max(1,Math.round(n));return n%2?n:n+1};
const hueD=(a,b)=>{const d=Math.abs(a-b)%360;return d>180?360-d:d};
function hsl(hex){const[r,g,b]=hx(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=(mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4)*60}return[h,s,l]}
function wpick(w){let t=0;for(const k in w)t+=w[k];let u=rnd()*t;for(const k in w){u-=w[k];if(u<=0)return k}return Object.keys(w)[0]}
function prof3(p){const sp=SP[p.f]||{form:'disque',size:2,k:'head',r:40},[H,S,L]=hsl(p.col||'#cccccc');return{p,f:p.f,sp,form:sp.form,size:sp.size,H,S,L}}
/* roles and stem counts from the occasion */
function plan(ids,occ){const O=OCCS[occ]||OCCS.juste,items=ids.map(id=>prof3(BYID[id])),r={drape:[],line:[],focal:[],second:[],filler:[]};
  for(const it of items){if(it.form==='retombante')r.drape.push(it);else if(it.form==='ligne'||it.form==='epi')r.line.push(it)}
  const heads=items.filter(it=>!r.drape.includes(it)&&!r.line.includes(it)).sort((a,b)=>b.size-a.size||rnd()-.5);
  const nf=heads.length>=5?Math.min(3,heads.filter(h=>h.size>=2.5).length||1):Math.min(heads.length,heads.filter(h=>h.size>=2.5).length?2:1);
  r.focal=heads.slice(0,Math.max(1,nf));for(const it of heads.slice(r.focal.length))(it.size>=1.9?r.second:r.filler).push(it);
  const mono=items.length===1,N=O.N+Math.min(6,Math.max(0,items.length-5))-(items.length<=2?4:0),budget=N*(1-O.gar),cnt=new Map();
  const W={focal:5,second:5,filler:7,line:3,drape:2},lim={focal:[3,7],second:[3,9],filler:[3,11],line:[1,5],drape:[1,3]};let raw=0;
  for(const k in r)for(const it of r[k])raw+=W[k];
  for(const k in r)for(const it of r[k]){let n=mono?budget*.85:W[k]*budget/Math.max(1,raw);if(k==='line')n*=O.ln;if(k==='drape')n*=O.dr;
    const[a,b]=lim[k];n=Math.min(mono&&k!=='line'&&k!=='drape'?21:b,Math.max(a,n));cnt.set(it,k==='drape'?Math.max(1,Math.round(n)):odd(n))}
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items,r,cnt,N,tot,gar:Math.max(5,Math.round(N-tot+N*O.gar))}}
function pickTpl(P,vid){const w={};for(const k in TPL)w[k]=TPL[k].w*(P.O.w[k]||1);const{r}=P;
  if(r.drape.length){w.cascade*=3;w.libre*=1.3}else w.cascade*=.15;
  if(r.line.length>=2){w.vertical*=1.8;w.libre*=1.5;w.eventail*=1.3}if(!r.line.length){w.vertical*=.4;w.libre*=.7}
  const vs=Object.keys(VSHAPE).find(k=>VSHAPE[k].includes(vid))||'low';
  if(vs==='low'){w.dome*=1.4;w.eventail*=1.3;w.cascade*=1.3;w.vertical*=.5}if(vs==='tall'){w.vertical*=1.6;w.triangle*=1.3;w.lcroissant*=1.3;w.dome*=.6}
  if(vs==='hand'){w.eventail*=1.5;w.libre*=1.3;w.cascade*=1.2;w.dome*=.7}if(vs==='kenzan'){w.vertical*=1.4;w.libre*=1.3;w.lcroissant*=1.4}
  if(P.tot<=12){w.dome*=.6;w.triangle*=1.3}return wpick(w)}
function basePoint(vid){const v=VZ[vid]||VZ['coupe-blanche'];return v.kind==='hand'||v.kind==='wrap'?[VX,830]:[VX,FL-vH(v)]}

function candidate(P,sv,vid,tk){sd(sv);const T=TPL[tk],s=rnd()<.5?-1:1,BP=basePoint(vid),v=VZ[vid]||{};
  const fill=Math.min(1,P.tot/24),vh=Math.max(120,vH(v)||150),H=Math.min(600,Math.max(330,R(T.hc[0],T.hc[1])*vh*.95))*(.8+.25*fill),W=R(T.lh[0],T.lh[1])*H,dec=R(T.dec[0],T.dec[1]);
  const FP=[BP[0]+s*dec*W*.45,BP[1]-.3*H],AP=[BP[0]-s*R(.05,.15)*W,BP[1]-H],DP=[BP[0]+s*R(.1,.2)*W,BP[1]+4];
  const ell={cx:FP[0],cy:FP[1]-.03*H,rx:.36*W,ry:.27*H},out=[],heads=[],{r}=P,cnt=new Map(P.cnt);
  const inE=(x,y,k=1)=>((x-ell.cx)/(ell.rx*k))**2+((y-ell.cy)/(ell.ry*k))**2<=1;
  /* lines: promote cups when the template asks for more lines than were picked */
  const lines=[];for(const it of r.line)for(let i=0;i<cnt.get(it);i++)lines.push(it);
  let need=Math.round(R(T.lines[0],T.lines[1]));const cup=r.second.concat(r.focal).find(i=>i.sp.k==='cup');
  if(cup&&lines.length<need){const m=Math.min(need-lines.length,Math.max(1,(cnt.get(cup)>>1)));for(let i=0;i<m;i++)lines.push(cup);cnt.set(cup,Math.max(1,cnt.get(cup)-m))}
  const angs=[];lines.forEach((it,i)=>{let th;if(i===0)th=Math.atan2(AP[0]-BP[0],BP[1]-AP[1])/D;else for(let k=0;k<40;k++){th=(rnd()<.65?-s:s)*R(6,70);if(angs.every(a=>Math.abs(a-th)>=14))break}
    angs.push(th);const len=(i===0?1:R(.62,.92))*H*(1-Math.abs(th)/170),ex=BP[0]+Math.sin(th*D)*len,ey=BP[1]-Math.cos(th*D)*len;
    if(it.sp.k==='plant'){const nat=it.sp.self;out.push({it,role:'line',kind:'self',x:BP[0]+R(-10,10),y:BP[1]-6,rot:th,scale:nat?Math.min(2.2,Math.max(.8,len/nat)):1,len,ex,ey,z:.1})}
    else{const sc=1.15;out.push({it,role:'line',kind:'head',x:ex,y:ey,rot:th*.5,tilt:1,scale:sc,ex,ey,z:.5});heads.push({x:ex,y:ey,r:(it.sp.r||40)*sc,it,z:.5})}});
  /* focal flowers: scalene zigzag around F, three heights, face / three-quarter / profile, on top */
  const TRI=[[-.04,.04],[.16,-.12],[-.18,-.2],[.24,.06],[-.26,.02],[.06,-.34],[-.08,.2]],TILT=[1,.84,.7,.9,.78,.86,.92],SZ=[1,.92,.86,.84,.8,.78,.76];let fi=0;
  const fq=[];{const left=new Map(r.focal.map(it=>[it,cnt.get(it)]));while([...left.values()].some(v=>v>0))for(const it of r.focal)if(left.get(it)>0){fq.push(it);left.set(it,left.get(it)-1)}}
  for(const it of fq){{const o=TRI[fi%TRI.length],sz=SZ[Math.min(fi,SZ.length-1)]*(fi>=7?.85:1),sc=1.62*sz,x=FP[0]+s*o[0]*W+R(-10,10)+(fi>=7?R(-60,60):0),y=FP[1]+o[1]*H+R(-10,10)+(fi>=7?R(-40,40):0);
    const z=fi<3?R(.85,1):R(.6,.85);out.push({it,role:'focal',kind:'head',x,y,rot:R(-25,25)+(it.form==='coeur'?pick([0,150,-150,30,-30]):0),tilt:TILT[fi%TILT.length],scale:sc,z});heads.push({x,y,r:(it.sp.r||40)*sc,it,z,focal:1});fi++}}
  /* the mass in drifts: darker varieties near the core, lighter ones outward, a few echoes */
  const pool=r.second.concat(r.filler).sort((a,b)=>a.L-b.L);
  const ok=(x,y,rr,z)=>heads.every(h=>{const d=Math.hypot(h.x-x,h.y-y);if(h.focal&&z>h.z-.15)return d>=(h.r+rr)*.72;return d>=(h.r+rr)*.46});
  pool.forEach((it,gi)=>{const dark=gi/Math.max(1,pool.length-1),phi=(gi%2?R(15,165):R(-165,-15))*D,role=it.size>=1.9?'second':'filler',n=cnt.get(it),base=(role==='second'?1.42:1.26),rr0=(it.sp.r||40);
    const dc=[ell.cx+Math.cos(phi)*ell.rx*(.15+.6*dark),ell.cy+Math.sin(phi)*ell.ry*(.15+.6*dark)];
    for(let j=0;j<n;j++){const sc=base*R(.82,1.04),rr=rr0*sc;let x,y,z,good=false;const echo=j===n-1&&n>=3&&rnd()<.5;
      for(let k=0;k<30&&!good;k++){if(echo){const a=R(0,6.283),q=R(.75,1.05);x=ell.cx+Math.cos(a)*ell.rx*q;y=ell.cy+Math.sin(a)*ell.ry*q}
        else{const a=j*2.4+R(-.6,.6),d=rr*(.55+.42*Math.sqrt(j+1))*(1+k*.03);x=dc[0]+Math.cos(a)*d;y=dc[1]+Math.sin(a)*d*.85}
        y=Math.min(y,BP[1]-rr*.35);z=R(.12,.8);good=inE(x,y,1.12)&&ok(x,y,rr,z)}
      if(!good)continue;out.push({it,role,kind:'head',x,y,rot:R(-30,30),tilt:R(.72,1),scale:sc,z});heads.push({x,y,r:rr,it,z})}});
  /* garnish fills the holes left in the envelope: free berries, buds, burnet and grasses picked from the palette */
  const gx=16,gy=12,cw=2*ell.rx/gx,ch=2*ell.ry/gy,holes=[];
  for(let i=0;i<gx;i++)for(let j=0;j<gy;j++){const x=ell.cx-ell.rx+(i+.5)*cw,y=ell.cy-ell.ry+(j+.5)*ch;if(!inE(x,y,.95)||y>BP[1]-10)continue;if(heads.some(h=>Math.hypot(h.x-x,h.y-y)<h.r*.8))continue;holes.push([x,y])}
  for(let i=holes.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[holes[i],holes[j]]=[holes[j],holes[i]]}
  const gk=garnishKinds(P.items);let ng=0;for(const[x,y]of holes){if(ng>=P.gar)break;if(heads.some(h=>h.gar&&Math.hypot(h.x-x,h.y-y)<34))continue;
    const kind=gk[ng%gk.length],sc=R(1,1.3);out.push({role:'garnish',kind:'garnish',type:kind,x:x+R(-6,6),y:y+R(-6,6),rot:R(-40,40),scale:sc,z:R(.02,.25)});heads.push({x,y,r:22*sc,gar:1,z:.1,it:{p:{id:'g'},L:.3,S:.3}});ng++}
  /* drapes on the mass side, opposite the apex */
  const dl=(T.drape==='L'?1.1:.82)*(H+150);for(const it of r.drape)for(let i=0;i<cnt.get(it);i++)out.push({it,role:'drape',kind:'drape',x:DP[0]+s*R(-6,22)+i*s*16,y:DP[1]-R(6,18),len:R(.32,.5)*dl,sway:s*R(26,70),side:s,z:2});
  /* sculptural foliage: rare in the corpus */
  const darkPal=P.items.reduce((a,it)=>a+it.L,0)/Math.max(1,P.items.length)<.45,nl=tk==='dome'?2:rnd()<.45?1:0;
  for(let i=0;i<nl;i++){const x=FP[0]+R(-.3,.3)*W,y=FP[1]+R(-.05,.12)*H;out.push({role:'leaf',kind:'leaf',x,y,rot:Math.atan2(x-BP[0],BP[1]-y)/D*1.2+R(-15,15),scale:R(.7,.9),dark:darkPal,z:-1})}
  return{out,heads,tk,T,s,H,W,FP,AP,DP,BP,ell,P,cnt}}
function garnishKinds(items){const L=items.reduce((a,it)=>a+it.L,0)/Math.max(1,items.length),warm=items.filter(it=>it.S>.2&&(it.H<60||it.H>300)).length>=items.length/2;
  return L<.5?['baies','sanguisorbe','boutons']:warm?['sanguisorbe','boutons','graminee','baies']:['boutons','graminee','baies']}

/* ---------- quality control (weights from the study) ---------- */
function scoreC(c){const{heads,T,H,W,ell,out,BP}=c,hh=heads.filter(h=>!h.gar);let Lw=0,Rw=0;
  for(const h of hh){const w=h.r*h.r*(.6+.8*(1-h.it.L))*(1+.5*h.it.S);if(h.x<BP[0])Lw+=w;else Rw+=w}
  const bal=Math.max(Lw,Rw)/Math.max(1,Lw+Rw),bt=c.tk==='dome'?[.5,.57]:[.56,.7],sBal=bal<bt[0]?Math.max(0,1-(bt[0]-bal)*4):bal>bt[1]?Math.max(0,1-(bal-bt[1])*4):1;
  const lines=out.filter(o=>o.role==='line'),beyond=lines.filter(o=>((o.ex-ell.cx)/ell.rx)**2+((o.ey-ell.cy)/ell.ry)**2>1.2).length,sLines=lines.length?(beyond/lines.length):(c.tk==='dome'?1:.5);
  const gx=20,gy=16,x0=ell.cx-ell.rx,y0=ell.cy-ell.ry,cw=2*ell.rx/gx,ch=2*ell.ry/gy;let inside=0,cov=0;
  for(let i=0;i<gx;i++)for(let j=0;j<gy;j++){const x=x0+(i+.5)*cw,y=y0+(j+.5)*ch;if(((x-ell.cx)/ell.rx)**2+((y-ell.cy)/ell.ry)**2>.8)continue;inside++;if(heads.some(h=>Math.hypot(h.x-x,h.y-y)<=h.r*.9))cov++}
  const dens=inside?cov/inside:0,sDens=Math.min(1,dens/.9);
  let sVis=1;for(const f of hh.filter(h=>h.focal)){let ov=0;for(const h of heads){if(h===f||h.z<f.z)continue;const d=Math.hypot(h.x-f.x,h.y-f.y);if(d<f.r+h.r)ov+=Math.min(1,(f.r+h.r-d)/(2*f.r))}if(ov>.35)sVis-=.3}
  const fs=hh.filter(h=>h.focal).map(h=>h.r),os=hh.filter(h=>!h.focal).map(h=>h.r),sHier=!fs.length||!os.length||Math.min(...fs)>=Math.max(...os)*.85?1:.6;
  let same=0,tot=0;for(const h of hh){let nb=null,bd=1e9;for(const o of hh){if(o===h)continue;const d=Math.hypot(o.x-h.x,o.y-h.y);if(d<bd){bd=d;nb=o}}tot++;if(nb&&nb.it.p.id===h.it.p.id)same++}
  const gi=tot?same/tot:.55,sGrp=gi>=.35&&gi<=.75?1:.6,sDrape=c.P.r.drape.length?1:(c.tk==='cascade'?0:.8);
  return 3*sBal+3*Math.max(0,sVis)+3*sHier+2*sLines+2*sDrape+3*sDens+1*sGrp}
function compose(ids,sv,occ,vid){const P=plan(ids,occ);sd(sv*31+7);const tk=pickTpl(P,vid);let best=null;for(let k=0;k<10;k++){const c=candidate(P,sv*97+k*13+1,vid,tk),sc=scoreC(c);if(!best||sc>best.score){best=c;best.score=sc}}return best}
