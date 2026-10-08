
/* ================= Composer v2 — rules measured on 76 reference bouquets (etude_compositions) ================= */
const VH=150,BP=[500,846];
const TPL={eventail:{w:.24,lh:[.9,1.1],hc:[3,4],dec:[.15,.25],lines:[3,7],drape:'l',neg:[.15,.30]},
 libre:{w:.20,lh:[.8,1.0],hc:[3,5],dec:[.20,.35],lines:[4,8],drape:'lL',neg:[.20,.40]},
 triangle:{w:.16,lh:[.7,.9],hc:[2.7,4],dec:[.25,.35],lines:[2,4],drape:'l',neg:[.15,.30]},
 cascade:{w:.12,lh:[.5,.7],hc:[3,5],dec:[.15,.30],lines:[1,3],drape:'L',neg:[.15,.30]},
 dome:{w:.11,lh:[1.0,1.3],hc:[1.6,2.5],dec:[0,.10],lines:[0,2],drape:'l',neg:[.05,.15]},
 vertical:{w:.08,lh:[.5,.7],hc:[4,7],dec:[.10,.25],lines:[3,6],drape:'l',neg:[.30,.45]},
 lcroissant:{w:.09,lh:[.8,1.2],hc:[2.5,3.5],dec:[.35,.5],lines:[2,3],drape:'l',neg:[.15,.30]}};
const SC={cosmos:1,anemone:1.05,peony:1.08,tulip:1.05,calla:1.05,lilyStar:1,morningGlory:1,marigold:1,pansy:.95,hydrangea:1.05,spike:1.35,cattleya:1.05,paphio:1,oncidium:1.3,sunflower:1,strelitzia:1.15};
const PROF={peony:['disque',3],lilyStar:['etoile',3],cattleya:['orchidee',3],sunflower:['disque',3],hydrangea:['sphere',3],anemone:['disque',2],tulip:['cornet',2],calla:['cornet',2],
 morningGlory:['disque',2],marigold:['disque',2],paphio:['orchidee',2],cosmos:['disque',1],pansy:['disque',1],spike:['epi',1],oncidium:['grappe',1],strelitzia:['sculpt',2],
 amaranthPlant:['retombante',2],allium:['ligne',1],grassLoop:['ligne',1],willow:['ligne',1],bareLine:['ligne',1]};
const DEFC={cosmos:'#f06a9b',anemone:'#f2f2fa',peony:'#f7a8c4',tulip:'#e2232f',calla:'#f4f7ec',lilyStar:'#fbf3f6',morningGlory:'#3f5fe0',marigold:'#ff7a00',pansy:'#6a2cc4',hydrangea:'#8fa6f5',
 spike:'#7f9fff',cattleya:'#f3eefb',paphio:'#b0485a',oncidium:'#ffd21f',sunflower:'#ffc21a',strelitzia:'#ff9a1f',amaranthPlant:'#8e1235',allium:'#8f5ad6',grassLoop:'#7fae4a',willow:'#6b4a2e',bareLine:'#557a36'};
const SELF={spike:150,oncidium:170,allium:0,grassLoop:0,willow:0,bareLine:0};
function hsl(hex){const n=parseInt(String(hex).slice(1,7),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=(mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4)*60}return[h,s,l]}
function mainCol(p){const c=p.o&&p.o.c;if(Array.isArray(c)){const x=Array.isArray(c[0])?c[0][1]:c[1];if(typeof x==='string')return x}return DEFC[p.f]||'#cccccc'}
function prof(p){const pr=PROF[p.f]||['disque',2],[H,S,L]=hsl(mainCol(p));return{p,f:p.cf||p.f,form:pr[0],size:pr[1],H,S,L}}
const hueD=(a,b)=>{const d=Math.abs(a-b)%360;return d>180?360-d:d};
function wpick(w){let t=0;for(const k in w)t+=w[k];let u=rnd()*t;for(const k in w){u-=w[k];if(u<=0)return k}return Object.keys(w)[0]}

function roles(items){const r={drape:[],line:[],focal:[],second:[],filler:[]},rest=[];
  for(const it of items){if(it.form==='retombante')r.drape.push(it);else if(['ligne','epi','grappe','sculpt'].includes(it.form))r.line.push(it);else rest.push(it)}
  const rk={l:4,p:3,r:2,c:1};rest.sort((a,b)=>b.size-a.size||rk[b.p.rar]-rk[a.p.rar]||rnd()-.5);
  const nf=rest.length>=3?(items.length>=12&&rest.length>=6?5:3):Math.min(1,rest.length);
  r.focal=rest.slice(0,nf);for(const it of rest.slice(nf))(it.size>1?r.second:r.filler).push(it);return r}
function pickTpl(r,n){const w={};for(const k in TPL)w[k]=TPL[k].w;
  if(r.drape.length){w.cascade*=3.2;w.libre*=1.3}else w.cascade*=.12;
  if(r.line.length>=3){w.vertical*=2;w.libre*=1.6;w.eventail*=1.3}if(!r.line.length){w.vertical*=.35;w.libre*=.6}
  if(r.focal.filter(i=>i.size===3).length>=3){w.eventail*=1.4;w.dome*=1.5}
  if(n<=5){w.dome*=.4;w.vertical*=1.5;w.triangle*=1.4}if(n>=14){w.dome*=1.3;w.eventail*=1.2}return wpick(w)}

function candidate(items,sv){seed=sv;const r=roles(items),tk=pickTpl(r,items.length),T=TPL[tk],s=rnd()<.5?-1:1;
  const small=Math.min(1,items.length/14),hm=1+(1-small)*.35,H=Math.min(560,Math.max(290,R(T.hc[0],T.hc[1])*VH*.95))*(.68+.32*small),W=R(T.lh[0],T.lh[1])*H,dec=R(T.dec[0],T.dec[1]);
  const FP=[BP[0]+s*dec*W*.5,BP[1]-.30*H],AP=[BP[0]-s*R(.05,.15)*W,BP[1]-H],DP=[BP[0]+s*R(.12,.22)*W,BP[1]+4];
  const out=[],heads=[],ell={cx:FP[0]+s*.04*W,cy:FP[1]-.04*H,rx:.36*W,ry:.24*H};
  /* promote cups and stars to lines until the template's odd line count is met */
  let need=Math.round(R(T.lines[0],T.lines[1]));if(need%2===0&&need>0)need+=need<T.lines[1]?1:-1;
  while(r.line.length<need){const c=r.second.find(i=>i.form==='cornet'||i.form==='etoile')||r.filler.find(i=>i.form!=='disque');if(!c)break;r.second=r.second.filter(x=>x!==c);r.filler=r.filler.filter(x=>x!==c);r.line.push(c)}
  while(r.line.length>Math.max(need,T.lines[1])){r.second.push(r.line.pop())}
  /* 2. lines: tallest to the apex, the others never parallel (>=18deg apart), biased to the side opposite the mass */
  const angs=[];r.line.forEach((it,i)=>{let th;if(i===0)th=Math.atan2(AP[0]-BP[0],BP[1]-AP[1])/D;else{for(let k=0;k<40;k++){th=(rnd()<.65?-s:s)*R(8,72);if(angs.every(a=>Math.abs(a-th)>=18))break}}
    angs.push(th);const len=i===0?H:R(.6,.92)*H*(1-Math.abs(th)/160),ex=BP[0]+Math.sin(th*D)*len,ey=BP[1]-Math.cos(th*D)*len,mx=th<0;
    if(it.f in SELF){const nat=SELF[it.f];out.push({it,role:'line',kind:'self',x:BP[0]+R(-12,12),y:BP[1]-8,rot:th,scale:nat?Math.min(2.1,Math.max(.8,len/nat)):1,len,mx,ex,ey,z:1})}
    else{const sc=(SC[it.f]||1)*1.15;out.push({it,role:'line',kind:'head',x:ex,y:ey+(it.form==='cornet'?55*sc:0),rot:th*.6,tilt:1,scale:sc,mx,ex,ey,z:1});heads.push({x:ex,y:ey,r:40*sc,it})}});
  /* 3. focal trio: scalene triangle around F, three heights, face / three-quarter / profile */
  const TRI=[[-.05,.05],[.12,-.10],[-.16,-.20],[.2,-.3],[-.06,-.36]],TILT=[1,.82,.66,.9,.75],ROT=[R(-8,8),s*R(18,32),-s*R(30,48),R(-15,15),s*R(10,25)],SZ=[1,.9,.84,.8,.76];
  r.focal.forEach((it,i)=>{const o=TRI[i],sc=(SC[it.f]||1)*1.5*SZ[i]*hm,x=FP[0]+s*o[0]*W+R(-8,8),y=FP[1]+o[1]*H+R(-8,8);
    out.push({it,role:'focal',kind:'head',x,y:y+(it.form==='cornet'?55*sc:0),rot:ROT[i],tilt:TILT[i],scale:sc,z:3});heads.push({x,y,r:44*sc,it,focal:1})});
  /* accents: hue far from the dominant one -> three points in a triangle */
  let sx=0,sy=0;for(const it of items){const w=it.size*(it.S>.15?1:.2);sx+=Math.cos(it.H*D)*w;sy+=Math.sin(it.H*D)*w}const dom=(Math.atan2(sy,sx)/D+360)%360;
  const pool=r.second.concat(r.filler),acc=pool.filter(it=>it.S>.35&&hueD(it.H,dom)>90);const useAcc=acc.length&&acc.length<=Math.max(1,items.length*.3);
  const ACP=[[AP[0]+s*.08*W,BP[1]-.72*H],[BP[0]-s*.42*W,BP[1]-.42*H],[DP[0]+s*.06*W,BP[1]-.1*H]];
  /* 4. mass in drifts: darker species closer to the core, lighter ones further out, 1-2 isolated echoes */
  const groups={};for(const it of pool){if(useAcc&&acc.includes(it))continue;(groups[it.p.id]=groups[it.p.id]||[]).push(it)}
  const G2=Object.values(groups).sort((a,b)=>a[0].L-b[0].L);
  const free=(x,y,rr)=>heads.every(h=>Math.hypot(h.x-x,h.y-y)>=(h.r+rr)*.72);
  G2.forEach((grp,gi)=>{const dark=gi/Math.max(1,G2.length-1),phi=(dark<.5?R(10,170):R(-170,-10))*D;
    grp.forEach((it,j)=>{const sc=(SC[it.f]||1)*(it.size>1?1.3:1.15)*R(.85,1)*hm,rr=40*sc;let x,y,ok=false;const echo=j>=2&&j===grp.length-1&&rnd()<.6;
      for(let k=0;k<16&&!ok;k++){if(echo){const a=R(0,6.283),q=R(1.02,1.18);x=ell.cx+Math.cos(a)*ell.rx*q;y=ell.cy+Math.sin(a)*ell.ry*q}
        else{const d=20+dark*ell.rx*.55+j*R(30,44);x=FP[0]+Math.cos(phi)*d*1.2+R(-16,16);y=FP[1]+Math.sin(phi)*d*.8+R(-14,14)}
        y=Math.min(y,BP[1]-rr*.5);ok=free(x,y,rr)&&((x-ell.cx)/ell.rx)**2+((y-ell.cy)/ell.ry)**2<=1.45}
      out.push({it,role:it.size>1?'second':'filler',kind:'head',x,y:y+(it.form==='cornet'?55*sc:0),rot:R(-20,20),tilt:R(.75,1),scale:sc*(it.size>1?1:.9),z:it.size>1?2:1});heads.push({x,y,r:rr,it})})});
  if(useAcc)acc.forEach((it,i)=>{const q=ACP[i%3],sc=(SC[it.f]||1)*1.1*hm,x=q[0]+R(-20,20),y=q[1]+R(-20,20);out.push({it,role:'accent',kind:'head',x,y,rot:R(-20,20),tilt:.9,scale:sc,z:2});heads.push({x,y,r:40*sc,it})});
  /* 6. drapes on the mass side, opposite the apex */
  const dl=(T.drape==='L'?1.15:.85)*(H+VH);r.drape.forEach((it,i)=>out.push({it,role:'drape',kind:'drape',x:DP[0]+s*R(0,20)+i*s*14,y:DP[1]-R(4,16),len:R(.3,.48)*dl,sway:s*R(30,75),side:s,z:5}));
  /* 7. minimal, sculptural foliage behind the focal cluster */
  const nl=tk==='dome'?3:items.length>=8?2:1,darkPal=items.reduce((a,it)=>a+it.L,0)/items.length<.45;
  for(let i=0;i<nl;i++){const x=FP[0]+R(-.25,.25)*W,y=FP[1]+R(-.06,.1)*H;out.push({role:'leaf',kind:'leaf',type:darkPal?'monstera':pick(['alocasia','round']),x,y,rot:Math.atan2(x-BP[0],BP[1]-y)/D*1.3+R(-15,15),scale:R(.48,.62),z:0})}
  return{out,heads,tk,T,s,H,W,FP,AP,DP,ell,useAcc,acc,items,r}}

/* ---------- quality control (weights from the study) ---------- */
function scoreC(c){const{heads,T,H,W,ell,out,items}=c;let Lw=0,Rw=0;
  for(const h of heads){const w=h.r*h.r*(.6+.8*(1-h.it.L))*(1+.5*h.it.S);if(h.x<BP[0])Lw+=w;else Rw+=w}
  const bal=Math.max(Lw,Rw)/Math.max(1,Lw+Rw),bt=c.tk==='dome'?[.5,.56]:[.58,.70],sBal=bal<bt[0]?Math.max(0,1-(bt[0]-bal)*4):bal>bt[1]?Math.max(0,1-(bal-bt[1])*4):1;
  const lines=out.filter(o=>o.role==='line'),beyond=lines.filter(o=>((o.ex-ell.cx)/ell.rx)**2+((o.ey-ell.cy)/ell.ry)**2>1.3).length,lt=c.tk==='dome'?[0,2]:[2,8];
  const sLines=beyond>=lt[0]&&beyond<=lt[1]?1:lines.length?.4:.2;
  const gx=24,gy=24,x0=BP[0]-W/2-30,y0=BP[1]-H-20,cw=(W+60)/gx,ch=(H+40)/gy,grid=new Uint8Array(gx*gy);
  const mark=(x,y,rr)=>{for(let i=Math.max(0,Math.floor((x-rr-x0)/cw));i<=Math.min(gx-1,Math.floor((x+rr-x0)/cw));i++)for(let j=Math.max(0,Math.floor((y-rr-y0)/ch));j<=Math.min(gy-1,Math.floor((y+rr-y0)/ch));j++){const cx=x0+(i+.5)*cw,cy=y0+(j+.5)*ch;if(Math.hypot(cx-x,cy-y)<=rr)grid[j*gx+i]=1}};
  for(const h of heads)mark(h.x,h.y,h.r);for(const o of lines)for(let u=0;u<=1;u+=.08)mark(BP[0]+(o.ex-BP[0])*u,BP[1]+(o.ey-BP[1])*u,6);
  let cov=0;for(const v of grid)cov+=v;const ns=1-cov/grid.length,sNeg=ns>=T.neg[0]&&ns<=T.neg[1]+.15?1:Math.max(0,1-Math.min(Math.abs(ns-T.neg[0]),Math.abs(ns-T.neg[1]))*3);
  let sVis=1;const hs=heads;for(const f of hs.filter(h=>h.focal)){let ov=0;for(const h of hs){if(h===f||h.focal)continue;const d=Math.hypot(h.x-f.x,h.y-f.y);if(d<f.r+h.r)ov+=Math.min(1,(f.r+h.r-d)/(2*f.r))}if(ov>.4)sVis-=.35}
  const fs=heads.filter(h=>h.focal).map(h=>h.r),os=heads.filter(h=>!h.focal).map(h=>h.r),sHier=!fs.length||!os.length||Math.min(...fs)>=Math.max(...os)*.85?1:.5;
  let same=0,tot=0;for(const h of heads){const sp=heads.filter(o=>o.it.p.id===h.it.p.id);if(sp.length<2)continue;let nb=null,bd=1e9;for(const o of heads){if(o===h)continue;const d=Math.hypot(o.x-h.x,o.y-h.y);if(d<bd){bd=d;nb=o}}tot++;if(nb&&nb.it.p.id===h.it.p.id)same++}
  const gi=tot?same/tot:.55,sGrp=gi>=.4&&gi<=.7?1:.6;
  const sDrape=c.r.drape.length?1:(c.tk==='cascade'?0:.8);
  const sTex=Math.min(1,new Set(items.map(i=>i.form)).size/4);
  return 3*sBal+3*Math.max(0,sVis)+3*sHier+2*sLines+2*sDrape+2*sNeg+2+1*sGrp+1+1*sTex}
function compose(ids,sv){const items=ids.map(id=>prof(BYID[id]));let best=null;
  for(let k=0;k<16;k++){const c=candidate(items.map(x=>Object.assign({},x)),sv*97+k*13+1),sc=scoreC(c);if(!best||sc>best.score){best=c;best.score=sc}}return best}

/* ---------- render ---------- */
function layers(svg){svg.innerHTML='';const L={};for(const k of['stems','back','mid','focal','vase','front'])L[k]=G(svg);return L}
function buildBq(svg,ids,sv,vid,t0=150){const Ls=layers(svg),c=compose(ids,sv);seed=sv*7+3;vaseDraw(Ls.vase,vid,t0);
  const ord={leaf:0,line:1,focal:2,second:3,filler:3,accent:3,drape:4},list=c.out.slice().sort((a,b)=>ord[a.role]-ord[b.role]);let n=0;
  for(const o of list){const t=t0+250+n*Math.max(55,900/list.length);n++;
    if(o.kind==='leaf'){const g=G(Ls.back);FOL[o.type](g);bloom(g,o.x,o.y,o.rot,o.scale,t,900,-15);continue}
    if(o.kind==='drape'){const g=G(Ls.front);[[1,0,0],[.78,-22,-8],[.6,26,9]].forEach(([k,sw,dx],j)=>{const h=G(g,{transform:`translate(${dx*(o.side||1)},${j*3})`});amaranth(h,t+j*90,Object.assign({},o.it.p.o,{len:o.len*k,sway:o.sway+sw*(o.side||1)}))});bloom(g,o.x,o.y,0,1,t,1300,0);continue}
    const fn=FN[o.it.f],opt=Object.assign({},o.it.p.o);
    if(o.kind==='self'){if(SELF[o.it.f]===0)opt.len=o.len;const g=G(Ls.back),inner=o.mx&&o.it.f==='oncidium'?G(g,{transform:'scale(-1,1)'}):g;fn(inner,t,opt);bloom(g,o.x,o.y,o.rot,o.scale,t,1000,-10);continue}
    const bx=BP[0]+R(-16,16),dy=BP[1]-o.y,P=[[bx,BP[1]+10],[bx+R(-10,10),BP[1]-dy*.4],[o.x-(o.x-bx)*.25+R(-18,18),o.y+dy*.3],[o.x,o.y]];
    const sp=E('path',{d:cp(P),stroke:pick(['#4e7a2e','#5d8c37','#6f9e41']),'stroke-width':f(o.role==='line'?2.6:R(3,4.4)),fill:'none','stroke-linecap':'round'},Ls.stems);grow(sp,Math.max(0,t-500),600);
    const g=G(o.z>=3?Ls.focal:o.z===2?Ls.mid:Ls.back),inner=o.mx&&o.it.f==='strelitzia'?G(g,{transform:'scale(-1,1)'}):g,tl=G(inner,{transform:`scale(1,${f(o.tilt||1)})`});
    fn(tl,t,opt);bloom(g,o.x,o.y,o.rot,o.scale,t,1000,-22)}
  /* frame the view on the bouquet's real silhouette (lines, drapes and vase included) */
  let x0=BP[0]-110,x1=BP[0]+110,y0=BP[1]-c.H-30,y1=1000;
  for(const o of c.out){if(o.kind==='head'||o.kind==='leaf'){const r=(o.kind==='leaf'?120:48)*o.scale;x0=Math.min(x0,o.x-r);x1=Math.max(x1,o.x+r);y0=Math.min(y0,o.y-r)}
    if(o.role==='line'){x0=Math.min(x0,o.ex-30);x1=Math.max(x1,o.ex+30);y0=Math.min(y0,o.ey-40)}
    if(o.kind==='drape'){x0=Math.min(x0,o.x-Math.abs(o.sway)-30);x1=Math.max(x1,o.x+Math.abs(o.sway)+30);y1=Math.max(y1,o.y+o.len+20)}}
  const cx=(x0+x1)/2,hw=Math.max(BP[0]-x0,x1-BP[0])*.5+(x1-x0)*.25+20;svg.setAttribute('viewBox',`${f(Math.min(x0-20,cx-hw))} ${f(y0-20)} ${f(Math.max(x1-x0+40,hw*2))} ${f(y1-y0+40)}`);
  svg.dataset.tpl=c.tk;return c}
