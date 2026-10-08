/* ================= Serre : L-système 2,5D — chaque plante pousse : axe, rameaux, pédicelles, feuilles, boutons et fleurs à leur âge ================= */
/* a module is [symbol, params]; a rule rewrites one symbol into a list of modules (its params decide, rnd varies it); a symbol without a rule stays */
function lsDerive(axiom,rules,steps){let s=axiom;for(let i=0;i<steps;i++){const o=[];let ch=0;for(const m of s){const r=rules[m[0]],out=r?r(m[1]||{},i):null;if(out){o.push(...out);ch=1}else o.push(m)}s=o;if(!ch)break}return s}
/* rotation of v round the unit axis ax by a (radians) */
const rotA=(v,ax,a)=>{const c=Math.cos(a),s=Math.sin(a),d=V3.dot(ax,v),cr=V3.cr(ax,v);return[v[0]*c+cr[0]*s+ax[0]*d*(1-c),v[1]*c+cr[1]*s+ax[1]*d*(1-c),v[2]*c+cr[2]*s+ax[2]*d*(1-c)]};
/* the turtle, in view space (x right, y up, z toward the eye): heading H, up U, left L = U × H.
   F(l, w0, w1, e, aim, k): grows an internode in short steps; every step bends toward the tropism T (e: how pliant; gravity, light) or toward aim (k of the way per step), and wanders a little (wig)
   + − yaw round U, & ^ pitch round L, / \ roll round H (degrees), $ rolls level, ! sets the width, [ ] branch; any other symbol is an organ, recorded with the turtle's frame */
function lsTurtle(mods,o={}){let st={p:o.p||[0,0,0],H:V3.nz(o.H||[0,1,0]),U:V3.nz(o.U||[0,0,1]),w:o.w||2};st.L=V3.cr(st.U,st.H);
  const T=o.T?V3.nz(o.T):null,e0=o.e??0,wig=o.wig??0,chains=[],organs=[],stack=[];let cur={pts:[st.p],ws:[st.w],ord:0,c:null};chains.push(cur);
  const ortho=()=>{st.H=V3.nz(st.H);st.U=V3s(st.U,V3.sc(st.H,V3.dot(st.U,st.H)));if(V3l(st.U)<1e-6)st.U=Math.abs(st.H[2])<.9?[0,0,1]:[0,1,0];st.U=V3.nz(V3s(st.U,V3.sc(st.H,V3.dot(st.U,st.H))));st.L=V3.cr(st.U,st.H)};
  const turn=(ax,a)=>{st.H=rotA(st.H,ax,a);st.U=rotA(st.U,ax,a);ortho()};
  for(const[sym,p0]of mods){const p=p0||{};switch(sym){
    case'F':{const L=p.l??10,n=Math.max(1,Math.round(L/(p.seg||o.seg||7))),e=p.e??e0,w0=p.w0??st.w,w1=p.w1??w0;if(p.c)cur.c=p.c;
      for(let i=0;i<n;i++){if(p.aim){const k=p.k??.3;st.H=V3.nz(V3.add(V3.sc(st.H,1-k),V3.sc(p.aim,k)));ortho()}
        else if(T&&e){const hx=V3.cr(st.H,T),m=V3l(hx);if(m>1e-6)turn(V3.sc(hx,1/m),e*m)}
        const wg=p.wig??wig;if(wg){turn(st.U,R(-wg,wg));turn(st.L,R(-wg,wg))}
        st.p=V3.add(st.p,V3.sc(st.H,L/n));st.w=w0+(w1-w0)*(i+1)/n;cur.pts.push(st.p);cur.ws.push(st.w)}break}
    case'f':st.p=V3.add(st.p,V3.sc(st.H,p.l??10));cur={pts:[st.p],ws:[st.w],ord:cur.ord,c:cur.c};chains.push(cur);break;
    case'+':turn(st.U,(p.a??25)*D);break;case'-':turn(st.U,-(p.a??25)*D);break;
    case'&':turn(st.L,(p.a??25)*D);break;case'^':turn(st.L,-(p.a??25)*D);break;
    case'/':turn(st.H,(p.a??25)*D);break;case'\\':turn(st.H,-(p.a??25)*D);break;
    case'$':{const V=p.v||[0,1,0],l=V3.cr(V,st.H);if(V3l(l)>1e-6){st.L=V3.nz(l);st.U=V3.cr(st.H,st.L)}break}
    case'!':st.w=p.w;cur.ws[cur.ws.length-1]=st.w;break;
    case'[':stack.push({st:Object.assign({},st),cur});cur={pts:[st.p],ws:[p.w??st.w],ord:cur.ord+1,c:p.c||cur.c};if(p.w!=null)st.w=p.w;chains.push(cur);break;
    case']':{const s0=stack.pop();if(s0){st=s0.st;cur=s0.cur}break}
    default:organs.push({t:sym,p,pos:st.p,H:st.H,U:st.U,L:st.L,w:st.w,ord:cur.ord})}}
  return{chains:chains.filter(c=>c.pts.length>1),organs}}
/* the frame of an organ: its face along H (or a given axis), its top toward U */
function lsFrame(og,ax,roll=0){const Z=V3.nz(ax||og.H);let Y=V3s(og.U,V3.sc(Z,V3.dot(og.U,Z)));if(V3l(Y)<1e-6)Y=V3s(og.L,V3.sc(Z,V3.dot(og.L,Z)));Y=V3.nz(Y);const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
/* ---------- drawing the axes: tapered ribbons along screen polylines, shaded like the bouquet stems (lit from the upper left, without flipping sides) ---------- */
function polyRibbon(P,wf,off){const A=[],B=[],n=P.length;for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,lit=Math.max(-1,Math.min(1,-(nx+ny)*1.4)),w=wf(i),c=off?off(i)*lit:0,cx=P[i][0]+nx*c,cy=P[i][1]+ny*c;
    A.push(f(cx+nx*w)+','+f(cy+ny*w));B.push(f(cx-nx*w)+','+f(cy-ny*w))}return'M'+A.join('L')+'L'+B.reverse().join('L')+'Z'}
function stemPoly(par,P,W,c=SG){if(c&&c.sv&&typeof svStemLine==='function')return svStemLine(par,P,W,c);const g=G(par),wf=i=>W[i]/2;E('path',{d:polyRibbon(P,wf),fill:c[0]},g);
  if(!LOD&&Math.max(...W)>1.2){E('path',{d:polyRibbon(P,i=>wf(i)*.7,i=>wf(i)*.22),fill:c[1]},g);E('path',{d:polyRibbon(P,i=>wf(i)*.28,i=>wf(i)*.42),fill:c[2],opacity:.9},g);E('path',{d:polyRibbon(P,i=>wf(i)*.09,i=>wf(i)*.5),fill:c[3],opacity:.55},g)}
  else if(!LOD)E('path',{d:polyRibbon(P,i=>wf(i)*.45,i=>wf(i)*.35),fill:c[2],opacity:.8},g);return g}
/* the axes as parts in the painter's order: each chain cut into short pieces, each piece at its own depth; O = view-space offset */
function lsChainParts(chains,O,cols,parts,o={}){const mx=o.piece||6;for(const ch of chains){const n=ch.pts.length,c=ch.c||cols;for(let a=0;a<n-1;a+=mx-1){const b=Math.min(n-1,a+mx-1),P=[],W=[];let z=0;
    /* each internode smoothed (Catmull-Rom, three steps) so the axis bends without facets */
    for(let i=a;i<=b;i++){const q=ch.pts[i];z+=q[2]+O[2];const sq=[q[0]+O[0],-(q[1]+O[1])];if(i===a){P.push(sq);W.push(ch.ws[i]);continue}
      const p0=ch.pts[Math.max(0,i-2)],p1=ch.pts[i-1],p3=ch.pts[Math.min(n-1,i+1)];for(const t of[1/3,2/3]){const t2=t*t,t3=t2*t,cr=j=>.5*((2*p1[j])+(-p0[j]+q[j])*t+(2*p0[j]-5*p1[j]+4*q[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*q[j]+p3[j])*t3);
        P.push([cr(0)+O[0],-(cr(1)+O[1])]);W.push(ch.ws[i-1]+(ch.ws[i]-ch.ws[i-1])*t)}P.push(sq);W.push(ch.ws[i])}
    parts.push({z:z/(b-a+1)+(o.zb||0),cast:false,ax:1,fn:par=>stemPoly(par,P,W,c)})}}}
/* ---------- a leaf on a node, in 3D: blade along H, its width along L, arched and folded on its midrib, drooping under its weight ---------- */
const LS_LANCE=prof([[0,.18],[.12,.62],[.35,1],[.6,.86],[.85,.42],[1,.03]]),LS_OVATE=prof([[0,.3],[.15,.78],[.4,1],[.7,.8],[.9,.4],[1,.05]]),LS_STRAP=prof([[0,.5],[.1,.86],[.5,1],[.85,.8],[1,.08]]);
function lsLeafS(og,len,wr,o={}){const H=og.H,P0=og.pos,fa=o.face?o.face*Math.atan2(og.L[2],og.U[2]):0,L=V3.add(V3.sc(og.L,Math.cos(fa)),V3.sc(og.U,-Math.sin(fa))),U=V3.add(V3.sc(og.U,Math.cos(fa)),V3.sc(og.L,Math.sin(fa))),wp=o.wp||LS_LANCE,W=len*wr*.5,dr=o.droop??.25,ar=o.arch??.08,fo=o.fold??.22,tw=o.tw||0;
  return(u,v)=>{const w=W*wp(v),a=tw*v,cu=Math.cos(a),su=Math.sin(a),Lr=V3.add(V3.sc(L,cu),V3.sc(U,su)),Ur=V3.add(V3.sc(U,cu),V3.sc(L,-su));
    return V3.add(V3.add(V3.add(P0,V3.sc(H,len*v)),V3.sc(Lr,u*w)),V3.add(V3.sc(Ur,len*ar*Math.sin(Math.PI*v)+w*fo*Math.abs(u)),[0,-len*dr*v*v,0]))}}
function lsLeafParts(og,len,wr,col,parts,o={}){const S=lsLeafS(og,len,wr,o),F={k:null,B:I3,O:o.O||[0,0,0],parts:[]},P=pal7(col),PB=pal7(mix(shd(col,.18),'#b8c8a0',.25));
  const VL=o.par?[-.55,-.28,.28,.55].map(u=>({pts:[0,.3,.6,.92].map(v=>[u*(1-.6*v),.03+v*.92]),w:.35,c:P.d1,o:.32})):[];
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:5,nv:9,across:1.4,ew:.45,eo:.4,cast:0,veins:[{pts:[[0,.01],[0,.5],[0,.97]],w:Math.max(.5,len*.012),c:P.l1,o:.5},...VL],
    gloss:o.gloss?{shin:30,k:o.gloss,thr:.25,cu:2,cv:5,nu:8,nv:14,lv:1.4,lu:.5,o:.55}:null});parts.push(...ps);return ps}
/* ---------- a plant head: the L-system grows the upper part of the plant (its flower, its buds, its side shoots and leaves); it hangs from the head's origin at its main flower;
   in a bouquet (NECK_X) the axes and leaves go to the stems layer (EXT), only the flowers and buds stay with the head; the base of the main axis is where the bouquet stem joins it ---------- */
/* species whose bouquet stems may be cut in bud or half open (the composer picks their stage) */
const GH_BUDS=new Set();
let EXT=null;/* collector of drawings the bouquet puts in its stems layer, in head-local coordinates */
/* the main axis is cut where it passes its main flower: below, it is the stem (with the bouquet's stems); above and in the branches, it is the inflorescence (with its flowers) */
function lsCut(res,apex){const c=res.chains[0];let bi=0,bd=1e18;for(let i=0;i<c.pts.length;i++){const d=V3l(V3s(c.pts[i],apex));if(d<bd){bd=d;bi=i}}return Math.max(1,bi)}
function lsPlant(k,res,o){const parts=[],ext=[],O=o.O,apex=o.apex||[0,0,0],off=V3s(O,apex),c0=res.chains[0],ci=lsCut(res,apex),low={pts:c0.pts.slice(0,ci+1),ws:c0.ws.slice(0,ci+1),c:c0.c,ord:0},
    high=ci<c0.pts.length-1?{pts:c0.pts.slice(ci),ws:c0.ws.slice(ci),c:c0.c,ord:0}:null;
  lsChainParts([low],off,o.cols||SG,NECK_X?ext:parts,{piece:o.piece});lsChainParts((high?[high]:[]).concat(res.chains.slice(1)),off,o.cols||SG,parts,{piece:o.piece});
  for(const og of res.organs){const pos=V3.add(og.pos,off),draw=o.organ&&o.organ(og,pos);if(!draw)continue;(draw.ext&&NECK_X?ext:parts).push(...(draw.parts||[]))}
  if(NECK_X&&EXT)EXT.push(par=>drawParts(par,ext));else parts.push(...ext);drawParts(k,parts)}
/* what a plant head hands back: the base of its main axis (where the bouquet stem arrives, along which direction) and the path of that axis down from its flower */
function lsNeck(res,O,apex){const c0=res.chains[0],ci=lsCut(res,apex||[0,0,0]),ch={pts:c0.pts.slice(0,ci+1),ws:c0.ws,c:c0.c},off=V3s(O,apex||[0,0,0]),sp=ch.pts.map(q=>[q[0]+off[0],-(q[1]+off[1])]).reverse(),e=sp[sp.length-1],e0=sp[Math.max(0,sp.length-3)],l=Math.hypot(e[0]-e0[0],e[1]-e0[1])||1;
  return{neck:e,nd:[(e[0]-e0[0])/l,(e[1]-e0[1])/l],np:sp,nw:ch.ws[0]/1.12,ncols:ch.c||SG,lsx:1}}
/* a leaf drawn on the screen at an organ: its base projected, its direction the projection of H, its length foreshortened (compound and cut leaves drawn in 2D) */
function lsLeaf2D(og,pos,len,draw){const p=[pos[0],-pos[1]],h=[og.H[0],-og.H[1]],hl=Math.hypot(h[0],h[1]),fs=Math.max(.3,hl),ang=Math.atan2(h[1],h[0]);
  return{z:pos[2]+og.H[2]*len*.4,cast:false,fn:par=>draw(par,p[0],p[1],ang,len*fs,og)}}
/* ---------- the stem of a flower that ends in one head: n nodes below it (leaves alternate or opposite, perhaps a side shoot in the axils ending in a bud or a younger flower),
   then the peduncle bending toward where the flower looks. The rules of the L-system:
     A(n>0) → F N(n) A(n−1)        A(0) → F F(aim) K
     N(i)   → [ /φ &α Lv ] (twice if opposite)  [ /φ' &β F Kb(age) ] (by chance, per axil)
   S: D flower size; w stem width under the flower; cols stem colours; nodes, li, lp (internode and peduncle, ×D); opp; leafAng; side {p, n, len, ang, age:[a,b]};
      flower(par,B,O,D,op), bud(par,B,O,size,age), budD (bud size ×D), leaf(og,pos) → part, node(og,pos) → part (a swelling, a thorn) ---------- */
function lsHeadS(k,o,S){const B=frameOf(o,S.rr??.25,!!S.axisFirst),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2],D=S.D,w=S.w,op=S.op;
  let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  /* a head resting on the lip keeps only its short peduncle */
  const nN=o.rim?0:S.nodes??1,li=D*(S.li??.5),lp=D*(S.lp??1)*(o.rim?.6:1),Lh=nN*li+lp,sc=B.reach?Math.min(1,Math.max(.12,B.reach*.4/Lh)):1,sd=S.side,ph0=R(0,360);
  const rules={A:p=>p.n>0?[['F',{l:li*sc*R(.85,1.15),w1:w*(1.06+.05*p.n)}],['N',{i:p.n}],['A',{n:p.n-1}]]:[['F',{l:lp*sc*.42,w1:w*1.04}],['F',{l:lp*sc*.58,w1:w,aim:ax,k:S.aimK??.24}],['K',{main:1}]],
    N:p=>{const out=[['Nd',{i:p.i}]],nl=S.whorl||(S.opp?2:1),r0=ph0+p.i*(nl===2?90:nl>2?180/nl:137.5);
      for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:r0+j*360/nl+R(-14,14)}],['&',{a:(S.leafAng??55)+R(-8,8)}],['Lv',{i:p.i,j}],[']',{}]);
      if(sd&&p.i<=(sd.top??1))for(let j=0;j<(sd.n||1);j++)if(rnd()<(sd.p??.5)){out.push(['[',{w:w*.62}],['/',{a:r0+(S.opp?90:60)+j*180+R(-20,20)}],['&',{a:(sd.ang||35)+R(-8,8)}],['F',{l:D*(sd.len||.6)*sc*R(.8,1.15),w1:w*.5,e:.07}],['Kb',{age:R(sd.age[0],sd.age[1]),i:p.i}],[']',{}])}
      return out}};
  const res=lsTurtle(lsDerive([['A',{n:nN}]],rules,nN+2),{p:[0,0,0],H:up,U:U0,wig:S.wig??.03,seg:D*.2,T:[0,1,0],e:S.e??.03,w:w*1.18}),main=res.organs.find(q=>q.t==='K'),apex=main.pos;
  res.chains[0].c=S.cols;for(const ch of res.chains)ch.c=S.cols;
  lsPlant(k,res,{O:[0,0,0],apex,cols:S.cols,organ:(og,pos)=>{
    if(og.t==='K')return{parts:[{z:pos[2],fn:par=>S.flower(par,B,pos,D,op)}]};
    if(og.t==='Kb'){const a=Math.min(og.p.age,(op??1)*1.1),Bf=lsFrame(og,null,R(-.3,.3));return{parts:[{z:pos[2],fn:par=>{if(a<(S.budMax??.4)||!S.young)S.bud(par,Bf,pos,D*(S.budD??.3)*(.75+.5*a),a);else S.young(par,Bf,pos,D*(.5+.3*a),a)}}]}}
    if(og.t==='Lv'&&S.leaf){const pt=S.leaf(og,pos);return pt?{ext:1,parts:[].concat(pt)}:null}
    if(og.t==='Nd'&&S.node){const pt=S.node(og,pos);return pt?{ext:1,parts:[].concat(pt)}:null}
    return null}});
  return lsNeck(res,[0,0,0],apex)}
/* any greenhouse head as the flower of a grown plant: drawn at O in the plant's frame, without its own neck */
const lsAsFlower=(fn,o)=>(par,B,O,D2,op2)=>{const g=O&&(O[0]||O[1])?G(par,{transform:`translate(${f(O[0])},${f(-O[1])})`}):par;NECK_SKIP=true;try{fn(g,0,Object.assign({},o,{Bf:B,op:op2,up:undefined}))}finally{NECK_SKIP=false}};
