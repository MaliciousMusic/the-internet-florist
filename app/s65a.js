/* ================= Serre, lot 65 — Orchidées 6 : cypripedium, phragmipedium, masdevallia, disa, ludisia (moteur des orchidées, L-système) ================= */
/* ---------- shared: a strap (petal, sepal, ribbon, tail) along a 3D Bézier spine P[0..3]; half-width W*wp(v); across = the constant direction A (a spine curving in the plane
   normal to A: a hood) or spine × N0 (a spine curving in the face plane: a hanging ribbon); tw twist (deg over the length), cup (<0 hollow toward the face), ruf ruffle ---------- */
function l65Strap(o){const P=o.P,bz=t=>{const a=(1-t)**3,b=3*(1-t)**2*t,c=3*(1-t)*t*t,d=t**3;return[0,1,2].map(i=>a*P[0][i]+b*P[1][i]+c*P[2][i]+d*P[3][i])},n=28,sp=[],tg=[];
  for(let i=0;i<=n;i++)sp.push(bz(i/n));for(let i=0;i<=n;i++)tg.push(V3.nz(V3s(sp[Math.min(n,i+1)],sp[Math.max(0,i-1)])));
  const N0=o.N0||[0,0,1],wp=o.wp||(v=>Math.sin(Math.PI*Math.min(.98,.04+.96*v))**.7),tw=(o.tw||0)*D,ruf=o.ruf||0,rk=o.rk||5,rph=R(0,6);
  return(u,v)=>{const x=v*n,i=Math.min(n-1,Math.floor(x)),fr=x-i,p=V3.add(sp[i],V3.sc(V3s(sp[i+1],sp[i]),fr)),T=V3.nz(V3.add(tg[i],V3.sc(V3s(tg[i+1],tg[i]),fr)));
    let A=o.A?V3s(o.A,V3.sc(T,V3.dot(o.A,T))):V3.cr(T,N0);if(V3l(A)<1e-6)A=V3.cr(T,[0,1,0]);A=V3.nz(A);let N=V3.cr(A,T);
    if(tw){const a=tw*v,c=Math.cos(a),s=Math.sin(a),A2=V3.add(V3.sc(A,c),V3.sc(N,s));N=V3.add(V3.sc(N,c),V3.sc(A,-s));A=A2}
    const w=Math.max(o.wmin||0,o.W*wp(v)),cu=(o.cup||0)*w*(1-u*u)+(ruf?ruf*w*Math.pow(Math.abs(u),3)*Math.sin(v*rk*Math.PI+rph+u*2):0);
    return V3.add(V3.add(p,V3.sc(A,u*w)),V3.sc(N,cu))}}
/* stripes along a segment (u,v lines), painted on its front face, never finer than 1.1 */
/* a width profile never narrower than m units (a tail, a tongue: one piece at the app's detail) */
const l65Wp=(wp,W,m=.62)=>v=>Math.max(m/W,wp(v));
const l65Lines=(F,S,us,v0,v1,c,w,op)=>(g,front,X)=>{if(!front||LOD)return;let d='';for(const u of us){const q=[];for(let i=0;i<=8;i++){const v=v0+(v1-v0)*i/8;q.push(PJ3(F,S(u*(.4+.6*Math.min(1,v*2.4)),v)))}d+=smooth(q.map(p=>[p[0],p[1]]),false)}
  E('path',{d,stroke:c,'stroke-width':f(Math.max(1.1,w)),'stroke-opacity':op,fill:'none','stroke-linecap':'round'},g)};
/* spots scattered on a segment (u,v box), on its front face */
const l65Dots=(F,S,n,u0,u1,v0,v1,c,rr,op,seed)=>(g,front)=>{if(!front||LOD)return;let d='';for(let k=0;k<n;k++){const u=u0+(u1-u0)*(.5+.5*Math.sin(k*12.9898+seed)),v=v0+(v1-v0)*(.5+.5*Math.sin(k*78.233+seed*1.7)),p=PJ3(F,S(u,v)),r=Math.max(.7,rr*(.6+.5*Math.abs(Math.sin(k*3.1+seed))));
  d+=`M${f(p[0]-r)},${f(p[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`}E('path',{d,fill:c,opacity:op},g)};
/* ---------- the slipper (labellum of the lady's slippers): an inflated ovoid, its true outline on the screen; tilt tips its toe forward; its mouth opens on top, the margin rolled in;
   o: c centre, ax ay az half-axes, tilt (rad), toe (the toe drawn out forward), col, vein (lines from the mouth), spots, mouth {k (share of the height), rx rz, back}, gloss ---------- */
function l65Pouch(F,o){const ct=Math.cos(o.tilt||0),st=Math.sin(o.tilt||0),rot=p=>[p[0],p[1]*ct-p[2]*st,p[1]*st+p[2]*ct],toe=o.toe||0,
    pt=(th,ph)=>{const s=Math.sin(th),c=Math.cos(th),fz=Math.sin(ph)>0?1+toe*Math.sin(ph)*sm01((-c+.2)/1.2):1;return[s*Math.cos(ph)*o.ax*(1-.12*toe*Math.max(0,-c)),c*o.ay,s*Math.sin(ph)*o.az*fz]},
    at=(th,ph)=>V3.add(o.c,rot(pt(th,ph))),nrm=(th,ph)=>{const e=.01,a=V3s(at(th+e,ph),at(th-e,ph)),b=V3s(at(th,ph+e),at(th,ph-e));return V3.nz(toV(F.B,V3.cr(a,b)))},P=pal7(o.col);
  const sc=[];for(let i=0;i<=12;i++)for(let j=0;j<18;j++){const p=PJ3(F,at(Math.PI*i/12,j/18*6.283));sc.push([p[0],p[1]])}const h=hull2(sc),zc=PJ3(F,o.c)[2];
  const mk=o.mouth?o.mouth.k:.3,th0=Math.acos(1-2*mk),mn=toV(F.B,rot([0,1,-(o.mouth&&o.mouth.back)||0]));
  return{z:zc+(o.zb||0),sil:h,cast:o.cast??.9,fn:par=>{const g=G(par),d=smooth(h);let cx=0,cy=0,ext=0;for(const p of h){cx+=p[0];cy+=p[1]}cx/=h.length;cy/=h.length;for(const p of h)ext=Math.max(ext,Math.hypot(p[0]-cx,p[1]-cy));
    if(LOD){E('path',{d,fill:P.b},g);return}
    const id='q'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:f(cx-ext*.32),cy:f(cy-ext*.38),r:f(ext*1.5)},GDEF||defs);stops(gr,[[0,P.l2],[.3,P.l1],[.62,P.b],[1,P.d2]]);E('path',{d,fill:`url(#${id})`},g);
    /* the veins and spots of the slipper, where its skin faces the eye */
    if(o.vein){let vd='';const nv=o.nv||11;for(let j=0;j<nv;j++){const ph=Math.PI*(.08+.84*j/(nv-1)),q=[];for(let i=0;i<=8;i++){const th=th0+(Math.PI*.93-th0)*i/8;if(nrm(th,ph)[2]>.05){const p=PJ3(F,at(th,ph));q.push([p[0],p[1]])}else if(q.length>1)break;else q.length=0}
        if(q.length>1)vd+=smooth(q,false)}if(vd)E('path',{d:vd,stroke:o.vein,'stroke-width':f(Math.max(1.1,o.ax*.035)),'stroke-opacity':o.vo??.5,fill:'none','stroke-linecap':'round'},g)}
    if(o.spots){let sd='';for(let k=0;k<(o.ns||26);k++){const th=th0+.1+(Math.PI*.6)*Math.abs(Math.sin(k*12.9898)),ph=Math.PI*(.12+.76*Math.abs(Math.sin(k*78.233))),n=nrm(th,ph);if(n[2]<.15)continue;const p=PJ3(F,at(th,ph)),r=Math.max(.75,o.ax*.045*(.6+.5*Math.abs(Math.sin(k*3.7))));
      sd+=`M${f(p[0]-r)},${f(p[1])}a${f(r)},${f(r*.8)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r*.8)} 0 1,0 ${f(-2*r)},0`}if(sd)E('path',{d:sd,fill:o.spots,opacity:.8},g)}
    /* the mouth: seen when its opening faces the eye; the inside dark, the rolled-in margin lighter */
    if(o.mouth&&mn[2]>.04){const rim=[];for(let j=0;j<20;j++){const ph=j/20*6.283,p=PJ3(F,V3.add(at(th0,ph),rot([0,0,-(o.mouth.back||0)*o.az*Math.max(0,-Math.sin(ph))])));rim.push([p[0],p[1]])}
      const md=smooth(rim),ins=o.inside||shd(o.col,-.5);E('path',{d:md,fill:ins},g);E('path',{d:md,fill:'none',stroke:o.rimc||P.l1,'stroke-width':f(Math.max(1.2,o.ax*.09)),'stroke-opacity':.95},g);
      E('path',{d:md,fill:'none',stroke:P.ink,'stroke-width':.5,'stroke-opacity':.35},g)}
    if(o.gloss!==0){const gx=cx-ext*.3,gy=cy-ext*.12;E('ellipse',{cx:f(gx),cy:f(gy),rx:f(ext*.12),ry:f(ext*.24),fill:glossFill(),opacity:f(o.gloss??.55),transform:`rotate(${f(-24)} ${f(gx)} ${f(gy)})`},g)}
    E('path',{d,fill:'none',stroke:P.ink,'stroke-width':.55,'stroke-opacity':.38},g)}}}
/* the sepaline cup of the masdevallias: a flaring cylinder on the flower's axis (z0, r0 at its base behind, z1, r1 at its mouth), its mouth dark inside when it faces the eye */
function l65Cup(F,o){const C=(z,r,n=14)=>{const q=[];for(let j=0;j<n;j++){const a=j/n*6.283;q.push(PJ3(F,[Math.cos(a)*r,Math.sin(a)*r*(o.fl||1),z]))}return q},a=C(o.z0,o.r0),b=C(o.z1,o.r1),h=hull2(a.concat(b).map(p=>[p[0],p[1]])),P=pal7(o.col),zc=(a[0][2]+b[0][2])/2;
  return{z:zc+(o.zb||0),sil:h,cast:.6,fn:par=>{const g=G(par),d=smooth(h);E('path',{d,fill:LOD?P.b:P.d1},g);if(toV(F.B,[0,0,1])[2]>.05){const m=C(o.z1,o.r1*.78);E('path',{d:smooth(m.map(p=>[p[0],p[1]])),fill:o.inside||P.d2},g)}
    E('path',{d,fill:'none',stroke:P.ink,'stroke-width':.5,'stroke-opacity':.35},g)}}}
/* ---------- the orchid stem (moteur r3a, orchidPlant), grown by the L-system with what these orchids carry besides their flowers: leaves along the stem (Lv), a leafy bract
   under each flower (Br), a single flower or a successive raceme; the buds are drawn by the species.
   Rules: S → [F(li) N(j)]… F A(0)   N(j) → [ /φ &α Lv(j) ]   A(i<n) → F(li) [ Br ] [ /φ &α F(pedicel) K|Kb ] /(180±δ) A(i+1) ---------- */
function l65Spray(g,t,o,P){const cw=o.cw||P.list.find(w=>w.c===o.col)||cwNear(P.list,o.col)||P.list[0],op=Math.max(.05,Math.min(1,o.op??1)),D0=(o.cm||P.cm)*UPC,k=G(g),sc=P.scol||['#2e3f22','#4f6534','#76884a','#a8b878'];
  if(o.rim){const r=lsHeadS(k,o,{D:D0,w:Math.max(1.6,D0*P.sw*1.4),cols:sc,op,rr:.3,nodes:0,lp:.45,flower:(par,B,O,D2,op2)=>P.flower(par,B,O,D2,cw,op2)});open(k,t,1000,10,.3);return r}
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],face=B[2];let U0=V3s(face,V3.sc(up,V3.dot(face,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const[nf,nb]=P.count(op),n=nf+nb,Lv=P.leaves,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D0*(P.pd0+.5)))):1,li=D0*P.li*kr,sd=rnd()<.5?-1:1,sw=q=>Math.max(1.15,D0*P.sw*q);
  const rules={S:()=>{const out=[],nl=Lv?Lv.n:0,L0=D0*P.pd0*kr,ph0=R(0,360);let done=0;
      for(let j=0;j<nl;j++){const q=Lv.at[0]+(Lv.at[1]-Lv.at[0])*j/Math.max(1,nl-1),l=L0*q-done;done+=l;
        out.push(['F',{l,w1:sw(1.5-.2*q),e:.012}],['[',{}],['/',{a:ph0+j*(Lv.phy||150)+R(-15,15)}],['&',{a:(Lv.ang||32)+R(-6,6)}],['Lv',{j,q}],[']',{}])}
      out.push(['F',{l:Math.max(1,L0-done),w0:nl?undefined:sw(1.5),w1:sw(1.3),e:.02}],['+',{a:sd*(P.lean||22)*R(.8,1.2)}],['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return P.noTip?[]:[['F',{l:li*.45,w1:sw(.55),e:P.e}]];const fl=p.i<nf,age=fl?1-.1*p.i:.34*(1-(p.i-nf)/Math.max(1,nb)),q=p.i/Math.max(1,n-1),ro=(p.i%2?90:-90)*sd+R(-15,15);
      return[['F',{l:li*(fl?1:.62)*R(.9,1.1)*(p.i?1:P.l0??1),w1:sw(1.25-.6*q),e:p.i?P.e:.01}]].concat(P.bract?[['[',{}],['/',{a:ro+180}],['&',{a:P.bract.ang||28}],['Br',{fl,i:p.i}],[']',{}]]:[],
        [['[',{w:sw(.6)}],['/',{a:ro}],['&',{a:(fl?P.pa:P.pa*.7)+R(-6,6)}],['F',{l:D0*(fl?P.ped:P.ped*.75)*kr,w1:sw(.5),e:fl?.05:-.04}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:R(-12,12)}],['A',{i:p.i+1}]])}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+4),{p:[0,0,0],H:up,U:U0,wig:.022,seg:D0*.12,T:[0,1,0],e:.01,w:sw(1.5)});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.find(q=>q.t==='Kb'),apex=main.pos;
  /* every flower faces the spray's side, its lip down (resupinate): its axis between the face and its pedicel, its top toward the sky */
  const fFrame=og=>{const Z=V3.nz(V3.add(V3.add(V3.sc(face,.82),V3.sc(og.H,P.fh??.3)),[R(-.08,.08),R(-.06,.06),0]));let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),j=R(-.12,.12),c=Math.cos(j),s=Math.sin(j);return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){const sz=1-P.grade*og.p.i/Math.max(1,nf),Bf=fFrame(og);/* the flower before its own pedicel, which joins it from behind */return{parts:[{z:pos[2]+Bf[2][2]*D0*.3,fn:par=>P.flower(par,Bf,pos,D0*sz,cw,op)}]}}
    if(og.t==='Kb'){const a=og.p.age,Bf=lsFrame(og,null,0),s=D0*P.bs*(.45+1.6*a);return{parts:[{z:pos[2],fn:par=>P.bud(par,Bf,pos,s,cw,a)}]}}
    if(og.t==='Lv'&&Lv){const pt=Lv.draw(Object.assign({},og,{pos}),D0*Lv.len*kr*(1-.35*og.p.q),cw);return pt?{ext:1,parts:[].concat(pt)}:null}
    if(og.t==='Br'&&P.bract){const pt=P.bract.draw(Object.assign({},og,{pos}),D0*P.bract.len*kr*(og.p.fl?1:.7),cw);return pt?{parts:[].concat(pt)}:null}
    return null}});
  open(k,t,1000,10,.3);return lsNeck(res,[0,0,0],apex)}
/* a leaf on the stem (fgBlade: its two halves lit by their normals), with lines along it always drawn (the pleats of the slipper orchids, the nerves of the jewel orchid); vc their colour */
function l65Blade(og,len,wr,c,cb,o={}){const pt=fgBlade(og,len,wr,c,cb,o);if(LOD||!o.lines)return pt;const S=lsLeafS(og,len,wr,o),fn0=pt.fn,nn=V3.nz(V3.cr(og.H,og.L));
  pt.fn=par=>{fn0(par);let d='';for(const L of o.lines)d+='M'+L.map(([u,v])=>{const q=S(u,v);return f(q[0])+','+f(-q[1])}).join('L');
    const fr=V3.dot(nn,[0,0,1])>-.25;E('path',{d,stroke:fr?o.vc:shd(cb,-.25),'stroke-width':f(Math.max(1.1,o.vw||1.1)),'stroke-opacity':fr?(o.vo??.55):.35,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par)};return pt}
/* parallel nerves from base to tip (u fractions), curving with the blade's outline */
const l65Nerves=(us,wp,n=8)=>us.map(u=>{const q=[];for(let i=0;i<=n;i++){const v=.02+.94*i/n;q.push([u*Math.min(1,wp(v)/.95)*.92,v])}return q});
/* ---------- Cypripedium (sabot de Vénus rustique, C. calceolus, C. parviflorum, C. reginae, C. kentuckiense et hybrides de culture, Cypripedium Gisela, Ulla Silkens…):
   a leafy stem of 3 or 4 broad elliptic leaves, pleated along their nerves and sheathing the stem; at its top one flower (sometimes two) above a leafy bract, on a curved downy ovary.
   The flower: the dorsal sepal erect, ovate-lanceolate, arching forward over the slipper; the two lateral sepals fused into one synsepal hidden under the slipper;
   two lateral petals, narrow, spirally twisted, spreading down and out; the lip an inflated ovoid slipper, glossy, its mouth on top with the margin rolled in,
   the staminode a yellow shield spotted red over the mouth. Colourways: c the slipper, tp tepals (st their stripes), sv slipper veins ---------- */
const L65_CYPCW=[
 {id:'jaune',n:'Sabot jaune, tépales brun pourpre (C. parviflorum, Inge)',c:'#f2cc2e',tp:'#6a3a26',st:'#3e1c12',sv:'#d89a18',sp:'#b2401e'},
 {id:'kentucky',n:'Jaune pâle, tépales verts striés (C. kentuckiense, Hank Small)',c:'#f2df7a',tp:'#8a8a3e',st:'#5a3a1e',sv:'#d8b040',sp:'#a8502a'},
 {id:'rose',n:'Sabot rose, tépales bruns (Gisela)',c:'#dc6c9c',tp:'#6e4030',st:'#40201a',sv:'#a8306a',sp:'#7a1a40'},
 {id:'reginae',n:'Blanc à sabot rose (C. reginae, Ventricosum)',c:'#ec98ba',tp:'#f8f4ee',st:'#e8dcd0',sv:'#c4467e',sp:'#a8205a',wl:'#fbf3f4'},
 {id:'pourpre',n:'Pourpre (Michael, Philipp)',c:'#9a2c5c',tp:'#5a2a2e',st:'#2e1018',sv:'#6a103a',sp:'#4a0a24'},
 {id:'blanc',n:'Blanc pur (Ulla Silkens)',c:'#f8f5ee',tp:'#eef0dc',st:'#d4dcb4',sv:'#dcd6c4',sp:'#c84a3a'}];
const L65_CYPSEP=prof([[0,.35],[.15,.75],[.4,1],[.7,.82],[.9,.42],[1,.06]]),L65_CYPPET=prof([[0,.4],[.12,.8],[.3,1],[.65,.75],[.9,.4],[1,.1]]),L65_CYPLF=prof([[0,.34],[.12,.7],[.38,1],[.66,.86],[.88,.45],[1,.04]]);
function l65CypFlower(par,B,O,dm,cw,op){const F={k:G(par),B,O,parts:[],so:.18,sd:null},r=dm/2,o2=sm01((op-.25)/.75),A=a=>a*(.5+.5*o2),gr=1-o2,
    tp=mix(cw.tp,'#9aa860',gr*.5),Pt=pal7(tp),PtB=pal7(mix(shd(tp,.1),'#b8b890',.22)),lc=mix(cw.c,'#c8d098',gr*.45),seg=(S,pa,pb,paint,o={})=>F.parts.push(...sheet3(F,S,Object.assign({pal:pa,palB:pb,nu:7,nv:12,across:1.2,ew:.5,eo:.3,cast:1,paint},o)));
  /* the dorsal sepal, erect and hooding forward over the slipper; striped along */
  const SD=petS({phi:90+R(-3,3),r0:dm*.02,z0:-dm*.03,L:r*.86,W:r*.27,wp:L65_CYPSEP,a0:A(98),a1:A(64),cup:-.22,ruf:.03});seg(SD,Pt,PtB,l65Lines(F,SD,[-.6,-.3,0,.3,.6],.06,.9,cw.st,dm*.012,.5));
  /* the synsepal under the slipper, pointing down and back */
  const SS=petS({phi:270,r0:dm*.02,z0:-dm*.05,L:r*.6,W:r*.19,wp:L65_CYPSEP,a0:A(104),a1:A(128),cup:-.15});seg(SS,Pt,PtB,null,{nv:8,cast:.6});
  /* the lateral petals, narrow and spirally twisted, spreading down and out */
  for(const s of[-1,1]){const SP=petS({phi:270+s*(58+R(-5,5)),r0:dm*.03,z0:-dm*.01,L:r*(1.02+R(-.04,.04)),W:r*.11,wp:L65_CYPPET,a0:A(88),a1:A(102),cup:-.1,tw:s*(330+R(-40,60))*(.4+.6*o2),pw:1.1});
    seg(SP,Pt,PtB,l65Lines(F,SP,[-.4,0,.4],.05,.85,cw.st,dm*.011,.55),{nv:16,nu:5})}
  /* the slipper: hanging under the column, its toe forward; small and green in the half-open flower */
  const ps=.72+.28*o2;F.parts.push(l65Pouch(F,{c:[0,-r*.46*ps,r*.2*ps],ax:r*.33*ps,ay:r*.37*ps,az:r*.42*ps,tilt:.55,toe:.18,col:lc,vein:cw.sv,nv:11,vo:.45,
    mouth:{k:.2,back:0},inside:shd(lc,-.45),rimc:cw.wl||lt(lc,.25),zb:dm*.03,gloss:.55}));
  /* the staminode over the mouth: a yellow shield spotted red, on the column */
  if(op>.3){const SM=petS({phi:270,r0:dm*.015,z0:dm*.02,L:r*.2,W:r*.11,a0:A(40),a1:A(78),cup:-.25});seg(SM,pal7('#f2d24a'),pal7('#d8b840'),l65Dots(F,SM,9,-.6,.6,.25,.85,cw.sp,dm*.012,.85,3.3),{nv:6,nu:5,cast:.5,zb:dm*.06})}
  render3(F,dm*.5);return F}
/* a bud: drooping, pointed, the tepals still green round the slipper */
function l65CypBud(par,B,O,s,cw,a){phalBud(par,B,O,s*.9,{c:mix(cw.tp,'#a8b870',.65-.4*a)})}
const L65_CYPLEAF=(og,len,cw)=>l65Blade(og,len,.52,'#5a8a42',mix('#7a9a5a','#c8d4a8',.3),{wp:L65_CYPLF,fold:.28,arch:.1,droop:.12,face:.6,nv:12,lines:l65Nerves([-.75,-.5,-.25,.25,.5,.75],L65_CYPLF),vc:'#2e4e22',vo:.45,vw:len*.012});
const L65_CYP={list:L65_CYPCW,cm:8,count:op=>{const nf=op<.3?0:rnd()<.3?2:1;return[nf,op<.3?1:nf<2&&rnd()<.35?1:0]},pd0:2.4,li:.55,l0:.4,ped:.42,pa:36,e:-.02,lean:8,sw:.05,grade:.08,bs:.36,fh:.2,
  leaves:{n:4,at:[.1,.55],len:1.65,ang:30,phy:160,draw:L65_CYPLEAF},bract:{len:.6,ang:14,draw:(og,len)=>l65Blade(og,len,.36,'#5f8f46','#a8bc88',{wp:L65_CYPLF,fold:.3,arch:.06,droop:.05,face:.6,nv:8,zb:-len*.9})},
  flower:l65CypFlower,bud:l65CypBud,scol:['#2e4a22','#4f7a38','#76a052','#a8c47e']};
GH['cypripedium']=(g,t,o)=>l65Spray(g,t,o,L65_CYP);CWS['cypripedium']=L65_CYPCW;SZG['cypripedium']=[6,7,8,8,9,10];GH_BUDS.add('cypripedium');
/* ---------- Phragmipedium (P. besseae et ses hybrides Eric Young, Hanne Popow, Jason Fischer ; P. × Sedenii, Cardinale ; P. caudatum, P. Grande aux pétales-rubans):
   a tall leafless scape with sheathing bracts, the flowers opening one after the other (one or two open at a time, the next buds above). The flower: the dorsal sepal
   lanceolate, erect and a little hooded; the synsepal behind the slipper; the petals long, narrow ribbons, wavy at the base, twisting as they hang; the slipper long,
   its toe forward, its side lobes rolled in at the mouth, the hairy staminode on the column. Colourways: c tepals, lip slipper, pc petals, vn veins, pl petal length (×r) ---------- */
const L65_PHRCW=[
 {id:'rouge',n:'Rouge (Hanne Popow, Jason Fischer)',c:'#c8222c',lip:'#b81c2a',pc:'#c8222c',vn:'#8a0e1a',pl:1.5,pw:.15},
 {id:'orange',n:'Orange (Eric Young, Don Wimber)',c:'#e8642c',lip:'#e0582a',pc:'#e8642c',vn:'#b8381a',pl:1.45,pw:.15},
 {id:'saumon',n:'Saumon (Fritz Schomburg)',c:'#f29a7a',lip:'#e8785e',pc:'#f08a6c',vn:'#c85a4a',pl:1.6,pw:.14},
 {id:'rose',n:'Rose et blanc (Sedenii, Cardinale)',c:'#f6dde2',lip:'#e07898',pc:'#e888a8',vn:'#d0809a',pl:2,pw:.11,tip:'#d85a86'},
 {id:'jaune',n:'Jaune (besseae flavum)',c:'#f2cc3a',lip:'#eebc2c',pc:'#f2c838',vn:'#c8901a',pl:1.45,pw:.15},
 {id:'vert-brun',n:'Vert et brun à longs rubans (Grande, caudatum)',c:'#c8c88a',lip:'#9a7a3c',pc:'#8a3a26',vn:'#6a4a1e',pl:3.4,pw:.08,tip:'#5a1e14'}];
const L65_PHRSEP=prof([[0,.3],[.15,.72],[.4,1],[.7,.78],[.9,.38],[1,.05]]),L65_RIB=prof([[0,.55],[.08,1],[.25,.86],[.6,.58],[.9,.4],[1,.12]]);
function l65PhrFlower(par,B,O,dm,cw,op){const F={k:G(par),B,O,parts:[],so:.18,sd:null},r=dm*.6,o2=sm01((op-.25)/.75),A=a=>a*(.5+.5*o2),gr=1-o2,
    tc=mix(cw.c,'#b8c890',gr*.45),Pt=pal7(tc),PtB=pal7(mix(shd(tc,.1),'#c8c0a0',.2)),pc=mix(cw.pc,'#a8b878',gr*.45),Pp=pal7(pc),PpB=pal7(mix(shd(pc,.08),'#c0b090',.2)),lc=mix(cw.lip,'#b8c890',gr*.5),
    seg=(S,pa,pb,paint,o={})=>F.parts.push(...sheet3(F,S,Object.assign({pal:pa,palB:pb,nu:7,nv:12,across:1.2,ew:.5,eo:.3,cast:1,paint},o)));
  const SD=petS({phi:90+R(-3,3),r0:dm*.02,z0:-dm*.03,L:r*.8,W:r*.25,wp:L65_PHRSEP,a0:A(96),a1:A(72),cup:-.18,ruf:.05});seg(SD,Pt,PtB,l65Lines(F,SD,[-.62,-.34,0,.34,.62],.05,.9,cw.vn,dm*.011,.5));
  const SS=petS({phi:270,r0:dm*.02,z0:-dm*.05,L:r*.62,W:r*.24,wp:L65_PHRSEP,a0:A(102),a1:A(122),cup:-.18});seg(SS,Pt,PtB,null,{nv:8,cast:.6});
  /* the petals: out to the side, then hanging, twisting; the long ribbons of the caudatum types reach far below the flower */
  const pl=cw.pl*(.55+.45*o2);
  for(const s of[-1,1]){const sw=R(.85,1.15),P3=[[s*r*.05,r*.02,-dm*.01],[s*r*.55,r*.02*sw,r*.02],[s*r*(.62+.15*pl)*sw,-r*.5*pl,r*.06],[s*r*(.42+.12*pl)*sw,-r*pl*R(.95,1.08),r*.1]];
    const SP=l65Strap({P:P3,W:r*cw.pw,wmin:.6,wp:L65_RIB,tw:s*(120+50*pl)*R(.8,1.2),ruf:.22,rk:7,cup:-.1});seg(SP,Pp,PpB,(g,front,X)=>{if(!front||LOD)return;
      if(cw.tip)E('path',{d:X.d,fill:ugrad(...PJ3(F,SP(0,.2)).slice(0,2),...PJ3(F,SP(0,1)).slice(0,2),[[0,cw.tip,0],[.5,cw.tip,.5],[1,cw.tip,.9]])},g);l65Lines(F,SP,[-.4,0,.4],.03,.6,cw.vn,dm*.01,.45)(g,front,X)},{nu:5,nv:Math.round(14+5*pl),across:1})}
  /* the slipper: long, its toe forward and down; the mouth wide, its rolled-in side lobes paler */
  const ps=.72+.28*o2;F.parts.push(l65Pouch(F,{c:[0,-r*.46*ps,r*.22*ps],ax:r*.24*ps,ay:r*.34*ps,az:r*.5*ps,tilt:.5,toe:.5,col:lc,vein:shd(cw.lip,-.2),nv:9,vo:.35,mouth:{k:.15,back:.35},inside:shd(lc,-.5),rimc:lt(lc,.35),zb:dm*.03,gloss:.45}));
  if(op>.3){const SM=petS({phi:270,r0:dm*.015,z0:dm*.02,L:r*.17,W:r*.1,a0:A(42),a1:A(80),cup:-.3});seg(SM,pal7(mix('#e8d060',cw.lip,.25)),pal7('#c8b050'),l65Dots(F,SM,10,-.7,.7,.2,.9,shd(cw.lip,-.3),dm*.008,.7,5.1),{nv:6,nu:5,cast:.5,zb:dm*.06})}
  render3(F,dm*.5);return F}
const L65_PHR={list:L65_PHRCW,cm:9,count:op=>op<.3?[0,3]:[rnd()<.5?2:1,2],pd0:2.2,li:.8,ped:.36,pa:40,e:-.03,lean:10,sw:.045,grade:.05,bs:.28,fh:.2,
  bract:{len:.3,ang:12,draw:(og,len)=>l65Blade(og,len,.3,'#5f7f3e','#9ab07a',{fold:.5,arch:.02,droop:0,face:.3,nv:6,zb:-len})},
  flower:l65PhrFlower,bud:(par,B,O,s,cw,a)=>phalBud(par,B,O,s,{c:mix(cw.c,'#9ab070',.6-.4*a)}),scol:['#2e3f22','#4f6534','#76884a','#a8b878']};
GH['phragmipedium']=(g,t,o)=>l65Spray(g,t,o,L65_PHR);CWS['phragmipedium']=L65_PHRCW;SZG['phragmipedium']=[7,8,9,9,10,12];GH_BUDS.add('phragmipedium');
/* ---------- Masdevallia (M. veitchiana, M. coccinea et hybrides Copper Angel, Angel Frost, Redwing…): one flower on a slender leafless stem from the tuft.
   The flower is all sepals: fused at their base into a short cup, the free parts broad triangles that narrow into long fine tails (caudae), the dorsal one erect,
   the two lateral ones joined most of their length into a broad lower blade, their tails diverging down; the petals and lip tiny, hidden in the mouth of the cup.
   Colourways: c sepals, tl tails, vn veins, dots papillae (veitchiana) ---------- */
const L65_MASCW=[
 {id:'orange',n:'Orange (M. veitchiana, Copper Angel)',c:'#ef7022',tl:'#e86a1e',vn:'#c8481a',dots:'#9a2a5a'},
 {id:'rouge',n:'Rouge (Redwing)',c:'#d8302a',tl:'#c8282a',vn:'#a01a1e'},
 {id:'magenta',n:'Magenta (M. coccinea)',c:'#c0287a',tl:'#b02470',vn:'#8a1858'},
 {id:'jaune',n:'Jaune (Angel Frost, coccinea xanthina)',c:'#f2c838',tl:'#e8a82a',vn:'#d8981e'},
 {id:'creme',n:'Blanc crème (coccinea alba)',c:'#f2ecd8',tl:'#e8dcb0',vn:'#d8ccaa'},
 {id:'rose',n:'Rose vif',c:'#e8508e',tl:'#d84080',vn:'#b82868'}];
const L65_MASD=prof([[0,.5],[.16,.95],[.26,1],[.44,.34],[.56,.1],[1,.05]]),L65_MASL=prof([[0,.55],[.16,.96],[.3,1],[.48,.36],[.6,.1],[1,.05]]);
function l65MasFlower(par,B,O,dm,cw,op){const F={k:G(par),B,O,parts:[],so:.16,sd:null},r=dm/2,o2=sm01((op-.25)/.75),A=a=>a*(.4+.6*o2),gr=1-o2,
    c=mix(cw.c,'#b8c890',gr*.4),Pc=pal7(c),PcB=pal7(mix(shd(c,.1),'#d8d0b0',.2)),seg=(S,paint,o={})=>F.parts.push(...sheet3(F,S,Object.assign({pal:Pc,palB:PcB,nu:7,nv:20,across:1.2,ew:.5,eo:.32,cast:1,paint},o)));
  /* the tails: the tip of each sepal, never finer than 1.2 (wmin), toned to their own colour */
  const deco=(S,sd)=>(g,front,X)=>{if(!front||LOD)return;E('path',{d:X.d,fill:ugrad(...PJ3(F,S(0,.3)).slice(0,2),...PJ3(F,S(0,.62)).slice(0,2),[[0,cw.tl,0],[1,cw.tl,.85]])},g);
    l65Lines(F,S,[-.5,0,.5],.03,.42,cw.vn,dm*.012,.5)(g,front,X);if(cw.dots)l65Dots(F,S,30,-.75,.75,.05,.4,cw.dots,dm*.0055,.65,sd)(g,front,X)};
  const tl=R(.95,1.1);F.parts.push(l65Cup(F,{z0:-dm*.09,r0:r*.1,z1:dm*.015,r1:r*.17,fl:.85,col:c,inside:shd(cw.vn,-.45),zb:-dm*.02}));
  const SD=petS({phi:90+R(-4,4),r0:dm*.06,z0:0,L:r*1.25*tl,W:r*.36,wp:l65Wp(L65_MASD,r*.36),a0:A(48),a1:A(96),pw:.9,cup:-.25});
  F.parts.push(...sheet3(F,(u,v)=>SD(u,v),{pal:Pc,palB:PcB,nu:7,nv:20,across:1.2,ew:.5,eo:.32,cast:1,paint:deco(SD,1.7)}));
  for(const s of[-1,1]){const SL=petS({phi:270+s*(24+R(-3,3)),r0:dm*.06,z0:0,L:r*1.45*tl,W:r*.42,wp:l65Wp(L65_MASL,r*.42),a0:A(50),a1:A(100),pw:.9,cup:-.2,tw:s*-8});seg(SL,deco(SL,2+s))}
  /* the mouth of the cup: the little lip and petals, the column */
  if(op>.3){const cq=[[0,-dm*.01,dm*.01],[0,-dm*.03,dm*.06],[0,-dm*.05,dm*.09]];F.parts.push(tube3(F,cq,q=>dm*.026*(1-.3*q),{cols:[shd(cw.vn,-.3),shd(cw.vn,-.45)],cap:1,hl:.3,dk:.4,spec:.3,ink:shd(cw.vn,-.7),eo:.35,cast:.5,zb:dm*.08}));
    F.parts.push(tube3(F,[[0,dm*.01,dm*.01],[0,dm*.005,dm*.07]],dm*.02,{cols:['#f6f0e4','#fffaf0'],cap:1,hl:.4,dk:.3,spec:.4,ink:'#a89888',eo:.35,cast:0,zb:dm*.07}))}
  render3(F,dm*.5);return F}
/* the bud: a pointed ovoid, its three tails already showing at its tip */
function l65MasBud(par,B,O,s,cw,a){phalBud(par,B,O,s,{c:mix(cw.c,'#9ab070',.55-.4*a)})}
const L65_MAS={list:L65_MASCW,cm:6,count:op=>op<.3?[0,1]:[1,0],pd0:2.6,li:.4,l0:.5,ped:.3,pa:30,e:-.01,lean:10,sw:.032,grade:0,bs:.42,fh:.25,noTip:1,
  bract:{len:.2,ang:8,draw:(og,len)=>l65Blade(og,len,.35,'#6a8a4a','#a8b888',{fold:.5,arch:.02,droop:0,face:.3,nv:5,zb:-len})},
  flower:l65MasFlower,bud:l65MasBud,scol:['#2e3f22','#4f6534','#76884a','#a8b878']};
GH['masdevallia']=(g,t,o)=>l65Spray(g,t,o,L65_MAS);CWS['masdevallia']=L65_MASCW;SZG['masdevallia']=[4,5,6,6,7];GH_BUDS.add('masdevallia');
/* ---------- Disa uniflora (« pride of Table Mountain ») et ses hybrides (Kewensis, Watsonii, Diores…): a leafy stem, lanceolate leaves along it, two to five large flowers in a short raceme.
   The flower: the two lateral sepals large, ovate, spreading flat, the showy part, scarlet; the dorsal sepal a deep erect hood (galea) drawn back into a short spur,
   paler inside and netted with dark red veins; the petals small, inside the hood, yellow spotted red; the lip a narrow tongue between the laterals; the column in the hood.
   Colourways: c lateral sepals, hd the inside of the hood, vn its veins, pt petals ---------- */
const L65_DISCW=[
 {id:'ecarlate',n:'Rouge écarlate (D. uniflora)',c:'#e0302a',hd:'#f4b484',vn:'#b81a1e',pt:'#f2c844'},
 {id:'carmin',n:'Rouge carmin (Kewensis)',c:'#c01e3a',hd:'#f0a8a8',vn:'#8a0e24',pt:'#f2c844'},
 {id:'orange',n:'Orange (Diores)',c:'#f07a2a',hd:'#f8cc8a',vn:'#c8481a',pt:'#f4d050'},
 {id:'rose',n:'Rose (Watsonii)',c:'#e888a8',hd:'#f8dce4',vn:'#c04a72',pt:'#f2d060'},
 {id:'jaune',n:'Jaune (uniflora aurata)',c:'#f0c038',hd:'#f8e6a0',vn:'#c88a1e',pt:'#f6dc6a'},
 {id:'mauve',n:'Mauve',c:'#c88ab0',hd:'#f2dcea',vn:'#8a4a7a',pt:'#f2d470'}];
const L65_DISL=prof([[0,.36],[.18,.82],[.45,1],[.72,.86],[.9,.5],[1,.06]]),L65_DISH=prof([[0,.4],[.2,.85],[.5,1],[.8,.82],[1,.3]]);
function l65DisFlower(par,B,O,dm,cw,op){const F={k:G(par),B,O,parts:[],so:.18,sd:null},r=dm/2,o2=sm01((op-.25)/.75),A=a=>a*(.45+.55*o2),gr=1-o2,
    c=mix(cw.c,'#b8c890',gr*.4),Pc=pal7(c),PcB=pal7(mix(shd(c,.08),'#d8c8b0',.18)),hd=mix(cw.hd,'#d8e0b0',gr*.4),Ph=pal7(hd);
  /* the lateral sepals, flat and spreading, a little mucro at the tip */
  for(const s of[-1,1]){const SL=petS({phi:270+s*(66+R(-4,4)),r0:dm*.03,z0:-dm*.01,L:r*1,W:r*.42,wp:L65_DISL,a0:A(84),a1:A(97),cup:-.08,ruf:.03,tw:s*-6});
    F.parts.push(...sheet3(F,SL,{pal:Pc,palB:PcB,nu:8,nv:12,across:1.2,ew:.5,eo:.3,cast:1,paint:l65Lines(F,SL,[-.5,0,.5],.05,.8,shd(c,-.12),dm*.01,.35)}))}
  /* the hood: deep, erect, its inside (front) pale and netted with dark veins, its outside the colour of the flower */
  const SH=petS({phi:90+R(-3,3),r0:dm*.02,z0:-dm*.03,L:r*.86,W:r*.44,wp:L65_DISH,a0:A(82),a1:A(42),pw:1,cup:-.62});
  F.parts.push(...sheet3(F,SH,{pal:Ph,palB:Pc,nu:8,nv:12,across:1.4,ew:.5,eo:.32,cast:1,paint:(g,front,X)=>{if(!front||LOD)return;
    let d='';for(let k=0;k<7;k++){const u=-.84+1.68*k/6,q=[];for(let i=0;i<=8;i++){const v=.04+.9*i/8;q.push(PJ3(F,SH(u*(.3+.7*Math.min(1,v*1.8)),v)))}d+=smooth(q.map(p=>[p[0],p[1]]),false)}
    for(const v of[.3,.5,.7]){const q=[];for(let i=0;i<=8;i++)q.push(PJ3(F,SH(-.85+1.7*i/8,v)));d+=smooth(q.map(p=>[p[0],p[1]]),false)}
    E('path',{d,stroke:cw.vn,'stroke-width':f(Math.max(1.1,dm*.012)),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},g)}}));
  /* the spur behind the hood, up and back */
  const sp0=SH(0,.42),spq=[V3.add(sp0,[0,0,-dm*.02]),V3.add(sp0,[0,dm*.05,-dm*.09]),V3.add(sp0,[0,dm*.12,-dm*.13])];F.parts.push(tube3(F,spq,q=>Math.max(.7,dm*.028*(1-.7*q)),{cols:[Pc.b,Pc.d1],cap:1,hl:.3,dk:.4,spec:.2,ink:Pc.ink,eo:.3,cast:0,zb:-dm*.1}));
  /* the petals in the hood, the column, the narrow lip */
  if(op>.3){for(const s of[-1,1]){const SP=petS({phi:90+s*30,r0:dm*.025,z0:dm*.005,L:r*.24,W:r*.08,a0:A(40),a1:A(18),cup:-.4,tw:s*20});
      F.parts.push(...sheet3(F,SP,{pal:pal7(cw.pt),palB:pal7(shd(cw.pt,-.1)),nu:5,nv:6,across:1,ew:.45,eo:.35,cast:.5,zb:dm*.04,paint:l65Dots(F,SP,6,-.6,.6,.3,.9,cw.vn,dm*.01,.8,4+s)}))}
    const cl=[[0,dm*.005,dm*.01],[0,dm*.03,dm*.05],[0,dm*.05,dm*.07]];F.parts.push(tube3(F,cl,q=>dm*.024*(1-.2*q),{cols:['#f4ecd8','#fffaf0'],cap:1,hl:.4,dk:.3,spec:.4,ink:'#a89070',eo:.35,cast:.5,zb:dm*.05}));
    const SLp=petS({phi:270,r0:dm*.02,z0:dm*.01,L:r*.32,W:r*.05,wp:l65Wp(v=>Math.sin(Math.PI*Math.min(.98,.04+.96*v))**.7,r*.05),a0:A(70),a1:A(100),cup:-.2});F.parts.push(...sheet3(F,SLp,{pal:Pc,palB:PcB,nu:4,nv:6,across:1,ew:.45,eo:.35,cast:.5,zb:dm*.03}))}
  render3(F,dm*.5);return F}
const L65_DISLEAF=(og,len,cw)=>l65Blade(og,len,.16,'#4f7a36','#8aa86a',{wp:LS_LANCE,fold:.35,arch:.12,droop:.18,face:.5,nv:10});
const L65_DIS={list:L65_DISCW,cm:9,count:op=>op<.3?[0,3]:op<.7?[1,2]:[Math.round(R(2,3.4)),1],pd0:2.1,li:.8,ped:.4,pa:42,e:-.04,lean:14,sw:.045,grade:.06,bs:.34,fh:.25,
  leaves:{n:4,at:[.12,.8],len:1.3,ang:24,phy:150,draw:L65_DISLEAF},bract:{len:.5,ang:16,draw:(og,len)=>l65Blade(og,len,.22,'#5a8040','#9ab07a',{wp:LS_LANCE,fold:.4,arch:.04,droop:.03,face:.4,nv:6,zb:-len})},
  flower:l65DisFlower,bud:(par,B,O,s,cw,a)=>phalBud(par,B,O,s,{c:mix(cw.c,'#9ab070',.6-.4*a)}),scol:['#2e4a22','#4f7034','#76984a','#a8c078']};
GH['disa']=(g,t,o)=>l65Spray(g,t,o,L65_DIS);CWS['disa']=L65_DISCW;SZG['disa']=[8,9,10,10,11];GH_BUDS.add('disa');
/* ---------- Ludisia discolor (orchidée bijou, « jewel orchid »): a fleshy creeping stem that turns up, its leaves in a loose rosette at the base of the shoot, ovate, pointed,
   velvety (matt, no gloss), deep maroon to black-green above with five fine nerves lit pink-copper (red-silver in Nigrescens, pale on the green Alba), wine-red beneath;
   from the rosette an erect downy spike of small white flowers, each with its dorsal sepal and petals in a hood, the lateral sepals spread, the lip twisted aside,
   the column twisted the other way with its yellow anther. Sold as foliage, by the shoot, with or without its spike. Colourways: c leaf, v nerves, b underside ---------- */
const L65_LUDCW=[
 {id:'pourpre',n:'Pourpre à nervures cuivrées',c:'#4a1e2a',v:'#d4687a',b:'#7a2a3a'},
 {id:'nigrescens',n:'Noir velours (Nigrescens)',c:'#241a1e',v:'#c8a0a0',b:'#5a2430'},
 {id:'alba',n:'Vert à nervures claires (Alba)',c:'#3a5a32',v:'#e8dcc8',b:'#6a8a5a'}];
const L65_LUDLF=prof([[0,.36],[.14,.78],[.4,1],[.7,.82],[.9,.42],[1,.04]]);
/* the nerves: the midrib and two pairs arching from the base to the tip, with a few cross-veins on the big leaves */
const L65_LUDNV=l65Nerves([-.62,-.3,0,.3,.62],L65_LUDLF,9);
/* one small flower of the spike, in 2D at the app's detail: hood, spread laterals, twisted lip, yellow anther; s its size, d its direction on the screen, a its age (bud < .5) */
function l65LudFl(par,p,d,s,a,flip){const w='#fbfaf4',ink='#8a8478',fy=flip?-1:1,st={stroke:ink,'stroke-width':.4,'stroke-opacity':.5};
  if(a<.5){const g=G(par,{transform:`translate(${f(p[0])},${f(p[1])}) rotate(${f(Math.atan2(d[1],d[0])/D)})`}),L=s*(.4+.45*a);E('path',Object.assign({d:`M0,${f(-L*.3)}Q${f(L*.75)},${f(-L*.3)} ${f(L)},0Q${f(L*.75)},${f(L*.3)} 0,${f(L*.3)}Z`,fill:mix('#c8d0a8',w,a*1.4)},st),g);return}
  /* the open flower faces out from the spike: hood up, laterals spread down, the lip twisted aside below, the anther yellow in the middle */
  const g=G(par,{transform:`translate(${f(p[0])},${f(p[1])}) scale(${f(fy)},1)`}),q=v=>f(v*s);
  E('path',Object.assign({d:`M0,0Q${q(-.42)},${q(.1)} ${q(-.46)},${q(.42)}Q${q(-.2)},${q(.34)} 0,0ZM0,0Q${q(.42)},${q(.08)} ${q(.5)},${q(.36)}Q${q(.22)},${q(.32)} 0,0Z`,fill:'#efede2'},st),g);
  E('path',Object.assign({d:`M${q(-.2)},${q(.02)}Q${q(-.24)},${q(-.42)} 0,${q(-.46)}Q${q(.24)},${q(-.42)} ${q(.2)},${q(.02)}Q0,${q(.1)} ${q(-.2)},${q(.02)}Z`,fill:w},st),g);
  E('path',Object.assign({d:`M${q(-.06)},${q(.04)}Q${q(.12)},${q(.3)} ${q(.3)},${q(.5)}L${q(.42)},${q(.44)}L${q(.4)},${q(.6)}L${q(.22)},${q(.6)}Q${q(.02)},${q(.36)} ${q(-.1)},${q(.1)}Z`,fill:w},st),g);
  E('ellipse',{cx:q(-.06),cy:q(-.06),rx:f(Math.max(.8,s*.08)),ry:f(Math.max(.9,s*.11)),fill:'#f0c838',stroke:'#b88a18','stroke-width':.35},g)}
function l65Lud(g,t,o){const cw=fgCw(L65_LUDCW,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=6,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l65lud',()=>{const Lt=o.spine?blen(o.spine):30*UPC*(.75+.25*ks),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.03,.08)),st=mix(cw.b,'#5a3a2a',.4),cols=[shd(st,-.6),shd(st,-.3),st,shd(st,.3)],lim=g35Lim(o);
    const spike=!o.spine||o.from>0?1:rnd()<.85,uS=.46;let nl=0;
    const r=fgGrow(k,A,{li:1.6*UPC*kl,liT:.1,w0:4.2*kl,w1:1.4,cols,uL:o.spine?.06:0,phy:'spiral',la:64,face:.75,lift:.3,seg:8,wig:.03,tipLv:0,
      leaf:(og,p)=>{if(p.o||p.u>uS||og.pos[1]<(lim??-1e9)+4)return null;nl++;const L=cm0*UPC*kl*R(.85,1.12)*(p.u>uS*.8?.75:1);
        return[l65Blade(og,L,.6,cw.c,cw.b,{wp:L65_LUDLF,fold:.12,arch:.06,droop:.14,face:.7,nv:10,lines:L65_LUDNV,vc:cw.v,vo:.8,vw:Math.max(1.1,L*.016),zb:.2,dI:-.16})]},
      post:(res,parts)=>{if(!spike)return;const c=res.chains[0],N=c.pts.length,i0=Math.floor(N*.62),nf=Math.max(7,Math.round((N-i0)*1.25)),s=1.85*UPC*kl,no=op<.3?0:Math.round(nf*(op<.7?.4:.8));
        for(let j=0;j<nf;j++){const q=j/(nf-1),i=Math.min(N-2,i0+Math.round(q*(N-1-i0))),pt=c.pts[i],dn=V3s(c.pts[i+1],pt),sd=j%2?1:-1,dir=[-dn[1]*sd+dn[0]*.5,dn[0]*sd+dn[1]*.5],l=Math.hypot(dir[0],dir[1])||1,
            dd=[dir[0]/l,-dir[1]/l],p0=[pt[0],-pt[1]],a=j<no?1:.15+.3*(1-(j-no)/Math.max(1,nf-no)),ss=s*(1-.25*q),pe=[p0[0]+dd[0]*ss*.5,p0[1]+dd[1]*ss*.5];
          parts.push({z:pt[2]+(j%3-1)*.1+.3,cast:false,fn:par=>{E('path',{d:`M${f(p0[0])},${f(p0[1])}L${f(pe[0])},${f(pe[1])}`,stroke:cols[2],'stroke-width':f(Math.max(1.15,ss*.12)),'stroke-linecap':'round'},par);l65LudFl(par,pe,dd,ss,a,sd<0)}})}}});
    open(k,t,1000,0,.4);return r})}
GH['ludisia']=l65Lud;CWS['ludisia']=L65_LUDCW;SZG['ludisia']=[4,5,6,6,7];GHI['ludisia']={form:'feuillage',size:1,k:'plant',rk:.44,self:30*UPC,fx:8*UPC};
