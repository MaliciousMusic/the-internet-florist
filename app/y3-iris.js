/* ================= y3-iris.js : pieces for the irises and their kin, laid on svBloom's heart hook (the engine y3.js is not touched) =================
   - svWhorlMat: a second material for the inner whorl (an iris's standards, the inner tepals of any flower whose two whorls differ in colour), derived
     exactly as svBloom derives the outer's (the individual's hue shift, the green of the young bud, the margins browning in decline);
   - svReskin: lays it on the inner whorl's sheets, keeping their veins' paths (their colour changed);
   - svFurl: the inner whorl still furled round the axis while the outer opens (a half-open iris: the standards rolled into a spindle round the style arms);
   - svStyleArms: the petaloid style branches of an iris, one over the haft of each outer piece, keeled, ending in a two-lobed crest;
   - svSpathe: the spathe of two bracts sheathing the foot of the flower (iris, gladiolus, freesia), green, papery and rosy at the tips;
   - svTubeIris: the column under the flower (ovary in the spathe, perianth tube, its flare into the hafts).
   Every size x R0 (half the flower's spread). */
function svWhorlMat(P,g,op,dec,cw){const gt=P.green[0]*(1-svSm((op-P.green[1])/P.green[2])),
    sh=c=>{const x=svShift(c,g.dh,g.ds,g.dl);return gt>0?mix(x,P.greenC,gt):x},shv=(c,v)=>{const x=svShift(c,g.dh,g.ds,g.dl),k=gt*(1-P.greenTip*v);return k>0?mix(x,P.greenC,k):x},
    body=cw.st[Math.min(3,cw.st.length-1)][1],[h0,s1,l1]=h2l(body),light=l1>.78,redish=(h0<20||h0>335)&&s1>.5&&l1<.6,
    st=cw.st.map(([v,c],i)=>[i<2?v*g.ring:v,i>=3&&dec>0?mix(shv(c,v),light?P.edge.light:redish?P.edge.red:P.edge.other,(i===3?P.edge.a[0]:P.edge.a[1])*dec):shv(c,v)]);
  return Object.assign({st,stops:st,bstops:cw.bst.map(([v,c])=>[v,shv(c,v)]),shade:sh(cw.shade),lite:cw.lite,bshade:cw.bshade,blite:cw.blite,
    rim:dec>0?mix(cw.rim,light?'#b08a58':'#ffffff',.6*dec):cw.rim,cast:cw.cast,vc:sh(cw.vein),bvc:cw.bvein},P.light,{trans:P.trans[0]+P.trans[1]*dec,rw:P.rim[0]+P.rim[1]*dec,ro:P.rim[2]+P.rim[3]*dec})}
/* the inner whorl's sheets take the second material: their blotch and band from it (none by default), their veins re-coloured */
function svReskin(pieces,ks,m2,cw){for(const k of ks){const p=pieces[k];if(!p||!p.mat)continue;const old=p.mat,vf=old.veins;
  p.mat=Object.assign({},old,m2,{blot:cw.blot||null,band:cw.band||null,flames:null,veins:vf?(s,front)=>vf(s,front).map(([set,w,c,op])=>[set,w,front?m2.vc:m2.bvc,op]):null})}}
/* a sheet rebuilt on a new surface S2 (same grid and material) */
const svRebuild=(p,S2)=>svSheet(p.B,p.O,S2,{nu:p.nu,nv:p.nv,mat:p.mat,ao:p.ao,zb:p.zb});
/* furled: the piece at angle phi rolled round the axis into a spindle of radius rf (x R0), height h (x R0) from z0, wrapping hw radians, turning spin
   radians up its length; f 0 (as drawn) .. 1 (furled) */
function svFurl(p,phi,f,o){if(!(f>0))return p;const S0=p.S,{R0}=o,rf=o.rf*R0,H=o.h*R0,z0=(o.z0||0)*R0,hw=o.hw,spin=o.spin||0;
  const Sf=(u,v)=>{const r=rf*Math.pow(Math.sin(Math.PI*(.05+.9*Math.pow(v,o.k||.85))),o.p||.8)+R0*.01*(1-v),th=phi+u*hw+spin*v;return[Math.cos(th)*r,Math.sin(th)*r,z0+H*v]};
  return svRebuild(p,(u,v)=>{const a=S0(u,v),b=Sf(u,v);return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f]})}
/* a plain material for the heart's own sheets (style arms, bracts, tube): ramps along v, the light of svBloom's pieces */
function svPlainMat(P,st,bst,o={}){const body=st[Math.min(2,st.length-1)][1],[h,s,l]=h2l(body);
  return Object.assign({stops:st,bstops:bst,shade:o.shade||l2h(h,Math.min(1,s*1.05),l*.38),lite:o.lite||mix(body,'#ffffff',.38),bshade:o.bshade||l2h(h,s*.9,l*.45),
    blite:o.blite||mix(bst[bst.length-1][1],'#ffffff',.4),rim:o.rim||mix(body,'#ffffff',.3),cast:o.cast||l2h(h,s,l*.25)},P.light,{darkLo:[.78],litLo:[],trans:o.trans??.22,rw:DET>=1.5?o.rw??.006:0,ro:o.ro??.25,veins:DET>=1.5?o.veins||null:null})}
/* ---------- the style arms ----------
   One over the haft of each outer piece (falls: list of {phi, a (the haft's angle from the axis)}): rising from the centre a little above the haft,
   keeled (convex above, its margins drooping round the haft), widening, then the crest: two rounded lobes parted by a notch, flaring and turned up.
   op: closed (pressed up the axis, inside the bud and the furled standards) .. open (lying over the hafts). */
const SVSA_DEF={L:.7,w0:.3,w1:.46,keel:.3,z0:.07,r0:.025,aC:.16,dA:.06,bend:.35,lift:.6,flare:.45,notch:.26,nu:6,nv:9};
function svStyleArms(ctx,falls,o0,mat){const o=Object.assign({},SVSA_DEF,o0),{B,O,R0,o2,bud,det,pieces}=ctx;if(bud>.55)return;const ns=14,out=[];
  for(const fa of falls){const ph=fa.phi,rad=[Math.cos(ph),Math.sin(ph),0],T=[-Math.sin(ph),Math.cos(ph),0],L=R0*o.L*(fa.k||1)*(1-.5*bud),aA=o.aC+(fa.a-o.dA-o.aC)*o2+(fa.da||0);
    const sp=[],dv=[];let p=[rad[0]*R0*o.r0,rad[1]*R0*o.r0,R0*o.z0];
    for(let j=0;j<=ns;j++){const v=j/ns,a=aA+o.bend*o2*Math.pow(v,1.6)-o.lift*o2*svSm((v-.62)/.38)+(fa.droop||0)*v*v,d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];if(j)p=V3.add(p,V3.sc(d,L/ns));sp.push(p);dv.push(d)}
    const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))},
      Lu=u=>1-o.notch*Math.exp(-u*u/.045)-.14*Math.pow(Math.abs(u),4);
    const S=(u,v)=>{const vv=v*Lu(u),c=at(sp,vv),d=V3.nz(at(dv,vv)),e=V3.nz(V3.cr(T,d)),hw=L*(o.w0+(o.w1-o.w0)*svSm(vv/.7))/2*(1+o.flare*o2*svSm((vv-.7)/.3)),
        up=o.keel*hw*u*u*(1-.7*svSm((vv-.72)/.28))-o.flare*.5*o2*hw*Math.abs(u)*svSm((vv-.75)/.25);
      return V3.add(V3.add(c,V3.sc(T,u*hw)),V3.sc(e,up))};
    out.push(svSheet(B,O,S,{nu:o.nu,nv:Math.round(o.nv*det),mat}))}
  pieces.push(...out)}
/* ---------- the spathe ----------
   Two bracts round the foot of the flower, the outer wrapping more than half the axis, the inner opposite; lanceolate, pointed, green, their margins
   and tips papery (rosy tan), more so as the flower opens and fades. z0 its foot, L its length, r its radius at the foot, fl the flare of the tips. */
const SVSP_DEF={z0:-.6,L:1,r:.085,wrap:[1.85,1.5],fl:.07,tipP:1.7,ph:0,nu:7,nv:8};
function svSpathe(ctx,o0,mats){const o=Object.assign({},SVSP_DEF,o0),{B,O,R0,pieces}=ctx;
  for(let b=0;b<(o.one?1:2);b++){const phs=o.ph+b*Math.PI*(1+(o.dph||0)),A0=o.one?2.75:o.wrap[b],rr=R0*o.r*(1+.14*(1-b)),L=R0*o.L*(b?.86:1),z0=R0*o.z0,fl=R0*o.fl*(1+.4*b),lean=o.lean||0;
    const S=(u,v)=>{const A=A0*Math.pow(1-svSm((v-.22)/.78),.8)+.03,th=phs+u*A,r=Math.max(rr*(1-.25*v)+fl*svSm((v-.45)/.55),o.rz?R0*o.rz(o.z0+o.L*(b?.86:1)*v)*(1+.07*(1-b)):0)+R0*.012*Math.abs(u),
        out=lean*L*v*v;return[Math.cos(th)*r+Math.cos(phs)*out,Math.sin(th)*r+Math.sin(phs)*out,z0+L*v]};
    pieces.push(svSheet(B,O,S,{nu:o.nu,nv:o.nv,mat:mats[b]}))}}
/* the perianth tube (and the ovary inside the spathe): a slim green column from z0 to z1, r its radius (x R0); o.prof(v) a profile along it (the ovary's
   swell, the narrow tube, the flare into the flower's hafts), by default a slight taper; o.nu, o.nv its grid; o.face: the half seen only */
function svTubeIris(ctx,z0,z1,r,mat,o={}){const{B,O,R0,pieces}=ctx,pf=o.prof||(v=>1+.25*(1-v)),th0=Math.atan2(B[1][2],B[0][2]);
  /* o.face: only the half turned to the viewer (a little more), one region to draw instead of two */
  pieces.push(svSheet(B,O,(u,v)=>{const a=o.face?th0+u*Math.PI*.56:(u+1)*Math.PI,rr=R0*r*pf(v);return[Math.cos(a)*rr,Math.sin(a)*rr,R0*(z0+(z1-z0)*v)]},{nu:o.nu||8,nv:o.nv||2,mat}))}
/* ---------- svBladeLite: a light channelled strap leaf clasping its stem (Dutch iris; any narrow-leaved cut flower: gladiolus, crocosmia, freesia) ----------
   A handful of elements per leaf instead of svStrapLeaf's lit mesh. The blade: one outline with a lengthwise gradient (the sheath's green, the face seen
   along the leaf, the tip drying), the shaded half of its gutter (one wash), its midrib, a lit rim. The sheath: a sleeve of the same green round the stem,
   its mouth rising toward the blade, the line of its margins. pos: the foot on the stem's axis; H: the stem there, upward; Out: the way the blade leaves
   it (unit vectors, view space, y up); o.sr: the stem's radius there, o.stem its colour (the sheath takes after it). Returns {blade, sheath, front}: two drawers (par) and whether the blade comes
   toward the viewer, so that the caller orders them about its stem (the sheath always in front of it, the blade in front or behind). */
const SVBL_DEF={len:100,w:.05,wp:[[0,.8],[.15,.95],[.35,1],[.65,.84],[.88,.5],[1,0]],sheath:.18,sr:2,mouth:.55,lean:.42,droop:.35,tw:.5,gut:.55,wav:.012,wavN:2,
  up:'#5f7c4a',low:'#8da57a',sh:'#22331c',stem:null,lt:'#e2ead2',dry:'#c4ae5c',brown:'#8e6c3c',wl:0,sd:1,lite:false};
/* o.lite: below DET 1.5, a leaf partly hidden by its neighbours (the inner leaves of a tuft, a short upper leaf) keeps its outline, a two-stop gradient,
   the shade of its gutter and its sheath's fill: no midrib, no shade nor rim on the sheath */
function svBladeLite(pos,H,Out,o0){const o=Object.assign({},SVBL_DEF,o0),r=svRng(o.sd),wl=o.wl||0,len=o.len,W=len*o.w,limp=svSm((wl-.15)/.6),ns=12,
    dn=[0,-1,0],Hn=V3.nz(H),P2=q=>[q[0],-q[1]],VZ=[0,0,1];
  let e1=V3s(Out,V3.sc(Hn,V3.dot(Out,Hn)));e1=V3l(e1)>1e-3?V3.nz(e1):V3.nz(V3.cr(Hn,VZ));const e2=V3.cr(Hn,e1),side0=V3.nz(V3.cr(e1,Hn));
  const ph=r()*6.3,tw=o.tw*(r()*2-1)*(1+1.5*limp),lean=o.lean*(1+.3*limp),dr=Math.min(.95,o.droop*(1+1.2*limp)),gut=o.gut*(1-.55*limp),wav=o.wav*(1+.6*limp),
    hs=len*o.sheath,rs=o.sr*1.05,v0=o.sheath*.7;
  const prof=v=>{const P=o.wp;for(let i=1;i<P.length;i++)if(v<=P[i][0]){const t=svSm((v-P[i-1][0])/(P[i][0]-P[i-1][0]));return P[i-1][1]+(P[i][1]-P[i-1][1])*t}return 0};
  /* the spine: up the stem inside the sheath, out at its mouth, then bending toward the ground (more as it wilts) */
  const sp=[],dv=[];let p=V3.add(pos,V3.sc(e1,o.sr));
  for(let j=0;j<=ns;j++){const v=j/ns,t=svSm((v-o.sheath*.6)/.22),a=lean*t,d0=V3.nz(V3.add(V3.sc(Hn,Math.cos(a)),V3.sc(e1,Math.sin(a)))),
      k=dr*Math.pow(Math.max(0,(v-o.sheath)/(1-o.sheath)),1.6),d=V3.nz(V3.add(V3.sc(d0,1-k),V3.sc(dn,k)));if(j)p=V3.add(p,V3.sc(d,len/ns));sp.push(p);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))};
  /* a cross-section: the midrib c, the two margins lifted toward the upper face (the gutter), twisting along the leaf, a slow wave */
  const ring=(th,h)=>V3.add(V3.add(pos,V3.sc(Hn,h)),V3.add(V3.sc(e1,Math.cos(th)*rs),V3.sc(e2,Math.sin(th)*rs))),hTop=th=>hs*(1-o.mouth*(1-Math.cos(th))/2),
    thc=Math.atan2(e2[2],e1[2]),nrm=th=>V3.add(V3.sc(e1,Math.cos(th)),V3.sc(e2,Math.sin(th))),lerp=(a,b,t)=>V3.add(V3.sc(a,1-t),V3.sc(b,t));
  const sec=v=>{const c=at(sp,v),d=V3.nz(at(dv,v)),s0=V3.nz(V3s(side0,V3.sc(d,V3.dot(side0,d)))),n0=V3.cr(s0,d),a=tw*v,s=V3.add(V3.sc(s0,Math.cos(a)),V3.sc(n0,Math.sin(a))),
      n=V3.cr(s,d),hw=W/2*prof(v),lift=gut*hw*(1-.5*svSm((v-.6)/.4)),wf=wav*W*svSm((v-o.sheath)/.2),wa=wf*Math.sin(Math.PI*o.wavN*v+ph+.6),wb=wf*Math.sin(Math.PI*o.wavN*v+ph-.6);
    /* at its base the blade is still the sheath, folded round the stem: it widens out of it, then flattens */
    const tb=svSm((v-v0)/(o.sheath*1.4)),A=V3.add(V3.add(c,V3.sc(s,hw)),V3.sc(n,lift+wa)),B=V3.add(V3.add(c,V3.sc(s,-hw)),V3.sc(n,lift+wb));
    return{c,d,s,n,A:tb<1?lerp(ring(-Math.PI*.55,len*v),A,tb):A,B:tb<1?lerp(ring(Math.PI*.55,len*v),B,tb):B}};
  const vs=[v0];for(let j=1;j<=ns;j++)if(j/ns>v0+.02)vs.push(j/ns);const X=vs.map(sec);
  /* the face seen: the upper one (inside the gutter, darker) or the lower one (paler, glaucous) */
  const face=x=>mix(o.low,o.up,svSm(.5+x.n[2]*2.5)),sheathC=o.stem?mix(o.stem,mix(o.low,o.up,.5),.6):mix(o.low,o.up,.5),
    y=svSm(wl/.85),vy=1-(.12+.5*y),tipC=mix(mix(face(X[X.length-1]),o.dry,.22+.6*svSm(wl/.7)),o.brown,.55*svSm((wl-.55)/.4));
  /* the half of the gutter turned from the light gets the wash, the other the lit rim */
  const xm=sec(.5),lit=E2=>{let N=V3.nz(V3.cr(V3s(E2,xm.c),xm.d));if(N[2]<0)N=V3.sc(N,-1);return V3.dot(N,LIGHT)},darkA=lit(xm.A)<lit(xm.B),upSeen=xm.n[2]>0;
  /* the outline is the silhouette of each cross-section (margins AND midrib): a channelled blade turned edgewise still shows the depth of its gutter,
     it never pinches to nothing where its twist passes edge-on (the blade would break in two) */
  const sil=X.map((x,i)=>{const a=P2(x.A),b=P2(x.B),c=P2(x.c);let dd=P2(x.d),l=Math.hypot(dd[0],dd[1]);if(l<1e-3){dd=[1,0];l=1}
    const m=[-dd[1]/l,dd[0]/l],pr=q=>(q[0]-c[0])*m[0]+(q[1]-c[1])*m[1],pa=pr(a),pb=pr(b);let L=pa>=pb?(pa>0?a:c):(pb>0?b:c),R=pa<=pb?(pa<0?a:c):(pb<0?b:c);
    const wd=pr(L)-pr(R),tm=W*.07*Math.min(1,prof(vs[i])/.3);if(wd<tm){const k=(tm-wd)/2;L=[L[0]+m[0]*k,L[1]+m[1]*k];R=[R[0]-m[0]*k,R[1]-m[1]*k]}return[L,R]});
  const blade=par=>{const out=sil.map(q=>q[0]).concat(sil.slice().reverse().map(q=>q[1])),F=P2(X[0].c),T=P2(X[X.length-1].c),dx=T[0]-F[0],dy=T[1]-F[1],l2=dx*dx+dy*dy||1,
      tp=v=>{const q=P2(sec(v).c);return Math.max(0,Math.min(1,((q[0]-F[0])*dx+(q[1]-F[1])*dy)/l2))};
    const lt2=o.lite&&DET<1.5;
    /* a fresh inner leaf below DET 1.5: one flat green (its foot is in the sleeve, its tip not yet drying) */
    if(lt2&&wl<=.05){E('path',{d:svSpl(out),fill:mix(sheathC,mix(face(sec(.5)),tipC,.25),.75)},par)}else{
    const t1=tp(.42),t2=Math.max(t1+.02,tp(vy)),id='bl'+(gid++),gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(F[0]),y1:svF(F[1]),x2:svF(T[0]),y2:svF(T[1])},GDEF||defs);
    stops(gr,lt2?[[0,sheathC],[1,mix(face(sec(.5)),tipC,wl>.05?.6:.25)]]:wl>.05?[[0,sheathC],[svF(t1),face(sec(.42))],[svF(Math.min(.98,t2)),face(sec(vy))],[1,tipC]]:[[0,sheathC],[svF(t1),face(sec(.42))],[1,tipC]]);
    E('path',{d:svSpl(out),fill:`url(#${id})`},par)}
    if(lt2&&wl<=.05)return;const dk=X.map(x=>P2(x.c)).concat(X.slice().reverse().map(x=>P2(darkA?x.A:x.B)));E('path',{d:svSpl(dk),fill:mix(o.up,o.sh,.55),'fill-opacity':svF(.3+.12*limp)},par);
    if(lt2)return;const n9=X.filter((x,i)=>vs[i]<=.9);E('path',{d:svSpl(n9.map(x=>P2(x.c)),false),fill:'none',stroke:upSeen?mix(o.up,o.sh,.45):mix(o.low,o.lt,.45),'stroke-opacity':upSeen?.42:.5,
      'stroke-width':svF(Math.max(.22,W*.07)),'stroke-linecap':'round'},par);
    if(DET>=1.5)E('path',{d:svSpl(X.filter((x,i)=>vs[i]<=.94).map(x=>P2(darkA?x.B:x.A)),false),fill:'none',stroke:o.lt,'stroke-opacity':.3,'stroke-width':svF(Math.max(.18,W*.045))},par)};
  /* the sheath: the visible half of a sleeve round the stem, from the foot to its mouth (highest on the blade's side, lowest where its margins meet) */
  const sheath=par=>{if(o.nosheath)return;const m=8,bot=[],top=[];for(let i=0;i<=m;i++){const th=thc-Math.PI/2+Math.PI*i/m;bot.push(P2(ring(th,0)));top.push(P2(ring(th,hTop(th))))}
    E('path',{d:svSpl(bot.concat(top.slice().reverse())),fill:sheathC},par);
    if(!(o.lite&&DET<1.5)){const sd=V3.dot(nrm(thc+Math.PI/2),LIGHT)<V3.dot(nrm(thc-Math.PI/2),LIGHT)?1:-1,b2=[],t2=[];for(let i=0;i<=4;i++){const th=thc+sd*(Math.PI/2-Math.PI*.42*i/4);b2.push(P2(ring(th,0)));t2.push(P2(ring(th,hTop(th))))}
    E('path',{d:svSpl(b2.concat(t2.reverse())),fill:o.sh,'fill-opacity':.3},par)}
    /* its mouth's rim, and the line where its margins meet when that side faces the viewer */
    if(o.lite&&DET<1.5)return;let d=svSpl(top,false);const thm=Math.PI,cm=Math.cos(thm-thc);if(cm>.15){const a=P2(ring(thm,hs*.04)),b=P2(ring(thm,hTop(thm)));d+='M'+svJ([svR(a[0]),svR(a[1])])+'L'+svJ([svR(b[0]),svR(b[1])])}
    E('path',{d,fill:'none',stroke:mix(sheathC,o.sh,.5),'stroke-opacity':.45,'stroke-width':svF(Math.max(.18,o.sr*.1))},par)};
  return{blade,sheath,front:e1[2]>0}}
