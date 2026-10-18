/* ================= y3-orchidee.js : les orchidées (fleur zygomorphe : 3 sépales, 2 pétales, un labelle, une colonne) et leur hampe =================
   A kit for every orchid of the catalogue (phalaenopsis first; cymbidium, oncidium, dendrobium, vanda, paphiopedilum, cattleya next). Nothing
   species-bound lives here: a sort gives its sheet S (in y-<genre>.js), merged over SVOR_DEF (S.pk = {k:{...}} merges into the piece of key k).
   - svorFlower(par,B,O,D,S,cwx,op,seed,wl,lod): one flower in the frame B (B[2] its axis, toward the eye when it faces us; B[1] its top, the dorsal
     sepal) at O; D its span (petal tip to petal tip); op 0 a small round bud .. .3 the bud splits .. 1 open; wl 0 fresh .. 1 shrivelled.
     Every piece is a sheet S(u,v) in the flower's frame (x right, y up, z toward the front; u across -1..1, v foot 0 .. tip 1):
     at (its foot), phi (the azimuth of its spine in the face, degrees, 90 up), a0 / a1 (the spine's angle from the axis at the foot / the tip,
     [bud, open]: 90 flat in the face, less leans forward), L (x R0), W (full width x L), prof (half-width [[v,w]...] up to the broadest point vb),
     tip (the superellipse of the tip: 2 round, < 1.5 pointed), cup (the margins rise to the front; arc: as a true arc, a pouch or a tube), roll
     (the blade turned on its spine, degrees), wav / wk (a waved margin, its waves along), rev (margins rolled back), curl (the tip rolled back),
     bphi / bw / shell (its place in the round bud: azimuth, wrap, shell). pair: a left and a right piece (phi given for the right one).
     The lip: two side lobes (kind 'side') and a mid-lobe ('mid') as pieces; its callus (S.cal), cirri (S.cir), spur (S.spur) and the column
     (S.col) are drawn parts. lod 2: each piece a lit svSheet ordered by svDraw (close-ups, sheets); lod 1: one lit path per piece and one path
     per pattern (the shop: a stem of nine flowers within ~300 elements).
   - svorScape(par,S,cwx,op,seed,wl,o): the inflorescence: the peduncle from the cut (o.ped, view points), its nodes and sheathing bracts, the
     rachis arching over, the flowers on their pedicels opening from the foot to the tip, round buds at the tip; fading from the foot, flower by
     flower, the faded ones dropping and leaving their yellowed pedicel. (See below, with its settings S.scape.)
   The sheet S: genes(seed) -> {pc:[one per piece], op, dh, ds, dl, sd}; mat(cwx) -> colours by kind (svorMatOf); wilt(c,w): the sort's own fading. */
const SVOR_DEF={
  /* one flower's life: the opening, the bud, the decline and the shrivelled flower */
  open:[.3,.6],bud:[.26,.3],dec:[.1,.4],fan:[.5,.38],
  /* the bud: its height x R0 [smallest, + growth, op where grown], radius / height, the back pole behind the foot (x R0), the young bud's green */
  budS:[.16,.4,.28],budR:.5,budZ:.05,green:[.75,.1,.3],greenC:'#a8bc6a',
  /* a bud that will not open (the scape fading): it yellows, then browns, shrinks and wrinkles (bud blast; fane-inat 3, 7) */
  blast:['#cdb85a','#a08048'],
  /* the wilt: the pieces fold forward (degrees, [decline, faded]), go limp toward the ground (limpK per piece: the dorsal sepal stays up), crumple,
     wave, shrink and roll their margins back (the faded flower stays open enough to be read: never a bud nor a closed flower); the colour turns (S.wilt) */
  wClose:[6,18],wLimp:[.15,.55],wFold:[0,0],wCrk:[.04,.11],wWav:[.25,.8],wShrink:[.04,.3],wCol:[.35,.65],
  pieces:[
    {k:'ds',kind:'sep',at:[0,.03,-.03],phi:90,bphi:90,bw:1.22,shell:1,a0:[8,84],a1:[4,96],L:.96,W:.5,prof:[[0,.24],[.25,.6],[.65,.94],[1,1]],vb:.52,tip:1.7,cup:.12,wav:.03,wk:2,rank:1,limpK:.45,revF:-.12,curlF:.04,crkK:.4,wavF:.4},
    {k:'ls',kind:'sep',pair:1,at:[.025,-.02,-.035],phi:-52,bphi:-30,bw:1.22,shell:1,a0:[8,84],a1:[4,97],L:.9,W:.5,prof:[[0,.24],[.25,.6],[.65,.94],[1,1]],vb:.5,tip:1.6,cup:.1,wav:.03,wk:2,rank:0},
    {k:'pt',kind:'pet',pair:1,at:[.02,.01,-.014],phi:12,bphi:30,bw:.95,shell:.92,inner:1,a0:[6,82],a1:[2,94],L:.97,W:.85,prof:[[0,.1],[.2,.24],[.45,.66],[.75,.96],[1,1]],vb:.64,tip:2.2,cup:.06,wav:.045,wk:2.5,rank:2,limpK:.7},
    {k:'sl',kind:'side',pair:1,at:[.05,-.085,.05],phi:58,bphi:240,bw:.4,shell:.75,inner:1,a0:[10,42],a1:[0,22],L:.32,W:.8,roll:-32,prof:[[0,.45],[.3,.85],[1,1]],vb:.5,tip:2.2,cup:.3,rank:4},
    {k:'ml',kind:'mid',at:[0,-.12,.065],phi:-90,bphi:270,bw:.5,shell:.8,inner:1,a0:[10,62],a1:[0,100],L:.48,W:.62,prof:[[0,.22],[.2,.3],[.55,.85],[1,1]],vb:.5,tip:1.1,cup:.18,rank:5}],
  /* the lip's drawn parts: a two-lobed callus with dots, two cirri at the mid-lobe's tip, no spur; the column (length, radius, bend, angle off the axis, anther cap) */
  cal:{at:[0,-.2,.1],w:.06,h:.13,z:.04,n:1,notch:.3,tilt:25,dots:14},cir:{L:.15,w:.012,curl:.55,at:.97,u:.18},spur:null,col:{at:[0,.01,0],L:.2,R:.065,bend:.3,a:12,cap:.042},
  nu:[8,10],nv:12,pmin:3,
  light:{wrap:.32,amb:.3,dif:.68,sky:.14,ks:.12,gloss:18,dark:[.93,.84,.74,.64],da:.17,lit:[1.05,1.13],la:.2,darkLo:[.88,.72],daLo:.22,litLo:[1.1],laLo:.22,soft:.05}};
const SVOR_DEG=Math.PI/180;
const svorL=(a,t)=>Array.isArray(a)?a[0]+(a[1]-a[0])*t:a;
/* a smooth half-width profile through control points [[v,w]...] */
function svorProf(P){return v=>{v=Math.max(0,Math.min(1,v));let i=1;while(i<P.length-1&&P[i][0]<v)i++;const a=P[i-1],b=P[i],t=(v-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*svSm(t)}}
/* the sheet merged on the defaults, its pairs unfolded into a left and a right piece (cached on S) */
function svorSpec(S){if(S._om)return S._om;const P=Object.assign({},SVOR_DEF,S),list=[];
  for(const p0 of P.pieces){const p=Object.assign({},p0,(S.pk||{})[p0.k]||{});if(!p.pair){list.push(Object.assign({side:1},p));continue}
    list.push(Object.assign({},p,{side:1}));list.push(Object.assign({},p,{side:-1,phi:180-p.phi,bphi:180-(p.bphi??p.phi),at:[-p.at[0],p.at[1],p.at[2]],roll:-(p.roll||0)}))}
  P.list=list;return S._om=P}
/* one piece as a sheet S(u,v) in the flower's frame, at its stage (c: the flower's stage, t: the piece's genes) */
function svorPiece(p,c,t){const R0=c.R0,fan=c.fan,dec=c.dec,L=R0*p.L*t.dL*(1-c.shrink*.4),W=L*p.W*t.dW*(1-c.shrink),ph=(p.phi+t.dphi)*SVOR_DEG,
    rad=[Math.cos(ph),Math.sin(ph),0],Tz=[-Math.sin(ph),Math.cos(ph),0],at0=[p.at[0]*R0,p.at[1]*R0,p.at[2]*R0],o2=c.o2;
  /* the spine: from its foot at a0 to its tip at a1; the wilt folds it forward and lets it hang */
  const cl=c.close*(p.closeK??1),a0=svorL(p.a0,o2)+t.da0-cl*.55,a1=svorL(p.a1,o2)+t.da1-cl+(p.curlA||0)*o2,ns=14,sp=[],dv=[],limp=c.limp*(p.limpK??1);
  /* hook (degrees, open flower): the spine's end bending toward hookD (the right piece's; mirrored for the left: by default toward the flower's
     midline), from hookV on: a side lobe of the lip curling in over the column (phalaenopsis 27, cymbidium 84) */
  const hk=p.hook?p.hook*o2*(1-.4*fan)*SVOR_DEG:0,hkV=p.hookV??.3,hkD=hk?V3.nz(p.hookD?[p.hookD[0]*p.side,p.hookD[1],p.hookD[2]]:[-p.side,0,0]):null;
  let q=at0.slice();for(let j=0;j<=ns;j++){const v=j/ns,a=(a0+(a1-a0)*Math.pow(v,p.aPow||1.15))*SVOR_DEG;let d=[rad[0]*Math.sin(a),rad[1]*Math.sin(a),Math.cos(a)];
    if(hk&&v>hkV){const ax=V3.cr(d,hkD),al=V3l(ax);if(al>1e-3)d=rotA(d,V3.sc(ax,1/al),hk*svSm((v-hkV)/(1-hkV)))}
    if(limp>0){const hk=Math.min(.9,limp*Math.pow(v,.6)*(.6+.4*t.hang)),dn=c.dnL,cs=V3.dot(d,dn),an=Math.acos(Math.max(-1,Math.min(1,cs)));
      if(an>1e-3&&an<3.1){const s0=Math.sin(an);d=V3.nz(V3.add(V3.sc(d,Math.sin((1-hk)*an)/s0),V3.sc(dn,Math.sin(hk*an)/s0)))}}
    if(j)q=V3.add(q,V3.sc(d,L/ns));sp.push(q);dv.push(d)}
  const at=(A,v)=>{const x=Math.max(0,Math.min(1,v))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return V3.add(V3.sc(A[j],1-f2),V3.sc(A[j+1],f2))};
  const vb=p.vb,pr=svorProf(p.prof),half=l=>(l<vb?pr(l/vb):pr(1))*W/2,tp=p.tip*t.tip,Lu=u=>vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(Math.abs(u),tp)),1/tp),
    roll=(p.roll||0)*SVOR_DEG,tw=t.tw*p.side,cup=(p.cup+t.cup)*(1-.6*fan),wav=(p.wav||0)*(1+c.wav*(p.wavF??1)),wk=p.wk||2,crk=c.crk*(p.crkK??1),rev=(p.rev||0)+(p.revF??.22)*fan,curl=(p.curl||0)+(p.curlF??.2)*fan,
    /* the wilt's lengthwise fold (wFold, degrees [decline, faded]; foldK per piece, sepals and petals only by default): the limp piece folds
       along its midrib, its halves closing forward, so the faded flower reads as hanging tongues, not as round lobes (fane-inat 3, 10) */
    fo=c.fold*(p.foldK??((p.kind==='sep'||p.kind==='pet')?1:0)),
    /* the round bud: this piece's slice of it (sepals outside, petals and lip inside); budLag (op units, per piece): the inner pieces stay
       balled up a while after the sepals have split (a splitting bud shows its folded petals, never a tunnel) */
    bud=c.bud,Rb=c.Rb*p.shell,Hb=c.Hb*p.shell,bph=(p.bphi??p.phi)*SVOR_DEG,hwb=Math.PI/3*(p.bw||1);
  /* ruf: a ruffled margin in the piece's own plane (a cymbidium's or an oncidium's lip): its half-width scalloped along it (rk waves), its tip
     margin scalloped across (rkT); none on the pieces without it */
  const ruf=p.ruf||0,rk=p.rk||8,rkT=p.rkT||5,
    /* twist (degrees at the tip, mirrored on the left piece): the blade turning on its spine toward its tip, so that no view sees it wholly edge-on
       (a sepal seen from the side stays a rounded spoon, never a thorn: phalaenopsis c1, c4); 0 by default */
    twi=(p.twist||0)*SVOR_DEG*p.side*(1-.5*fan);
  /* wU: the half-width of the half u·side > 0 (for a piece pointing up on the right, its half toward the midline) over the other's: a side lobe
     of the lip a crescent, its inner margin lower than its outer one, its tip at the outer top (phalaenopsis 27); 1 by default */
  return(u,v)=>{const vv=v*Lu(u)*(ruf?1+ruf*.35*Math.pow(v,4)*Math.sin(rkT*Math.PI*u+t.wph):1),cc=at(sp,vv),d=V3.nz(at(dv,vv));let T=Tz;const r=roll+tw*vv+twi*vv*vv;if(r)T=rotA(Tz,d,r);T=V3.nz(V3s(T,V3.sc(d,V3.dot(T,d))));const N=V3.cr(d,T);
    const hw=half(vv)*(1+t.asym*Math.sign(u))*(u*p.side>0?(p.wU??1):1)*(ruf?1+ruf*Math.pow(Math.abs(u),3)*Math.sin(rk*Math.PI*vv+t.wph*1.7):1),ck=cup*(.15+.85*svSm(vv/.4)),phx=2*ck*u,arc=p.arc&&Math.abs(phx)>1e-4,tx=arc?hw*Math.sin(phx)/(2*ck):u*hw,
      lift=(arc?hw*(1-Math.cos(phx))/(2*ck):ck*u*u*hw)+wav*hw*Math.pow(Math.abs(u),1.6)*Math.sin(wk*Math.PI*vv+t.wph+u*.9)*svSm(vv/.3)
        +crk*hw*(Math.sin(u*Math.PI*(2.4+t.wk)*(1+.35*Math.sin(vv*4.3+t.wph))+t.wph*2+vv*7+1.6*Math.sin(vv*3.1+u*1.7+t.wph))+.6*Math.sin(u*Math.PI*(4.1+t.wk*1.7)-t.wph*3+vv*11.3+1.2*Math.sin(u*2.3+vv*5.7))*Math.sin(vv*5.3+t.wph))*svSm(vv/.2)-rev*hw*Math.pow(Math.abs(u),3)-curl*hw*.5*u*u*svSm((vv-.6)/.4);
    let tx2=tx,lf2=lift;if(fo){const fv=fo*svSm(vv/.18)*(.82+.18*Math.sin(vv*3.3+t.wph)),au=Math.sqrt(u*u+.004)-.063;tx2=tx*Math.cos(fv);lf2+=hw*au*Math.sin(fv)}
    const Pt=V3.add(V3.add(cc,V3.sc(T,tx2)),V3.sc(N,lf2));if(bud<=0)return Pt;
    /* (budTip: the splitting bud keeps its tips together, its seams parting first, and closes its pole: no hole at its top; budPt: its front
       pole drawn out into a short blunt point, an egg rather than a pearl) */
    const bt=c.budTip?Math.min(1,bud+(1-bud)*c.budTip*svSm((bud-.45)/.3)*v*v*v):bud;
    const th=Math.PI*(.05+(c.budTip?.95:.93)*v),az=bph+u*hwb*(.75+.25*svSm(v/.2)),rw=c.bwr?1+c.bwr*(Math.sin(az*5+th*3.3)+.6*Math.sin(az*9-th*5.1+1.3))*Math.sin(th):1,
      Pb=[Math.sin(th)*Math.cos(az)*Rb*rw,Math.sin(th)*Math.sin(az)*Rb*rw,c.zc-Math.cos(th)*Hb/2*(.85+.15*rw)+(c.budPt?c.budPt*Hb/2*Math.pow(Math.max(0,-Math.cos(th)),3):0)];
    return V3.add(V3.sc(Pt,1-bt),V3.sc(Pb,bt))}}
/* a colour along a ramp [[v,c]...] */
/* the side lobes' stripes: P.sideV {u: across the lobe, len: their lengths (share of the lobe), w (x D), op}; the default four even bars */
const SVOR_SIDEV={u:[-.55,-.2,.15,.5],len:[.62,.62,.62,.62],w:.0055,op:.75};
function svorSideV(P){return P.sideV||SVOR_SIDEV}
/* a reticulate vein net in (u,v) (a phalaenopsis' petal, 27, 13): n main veins fanning from the claw, wavy (V.wob: amplitude across, two
   frequencies), each forking once or twice toward the margin, and many short wavy links between neighbours (V.net: their density), so the
   blade reads as a fine crackle rather than a fan of strings; V.v0 where they start (their meeting at the claw hidden). Same output as svVeins ({main, fine}); used only where a sheet asks (wob) */
function svorVeinNet(r,n0,V){const main=[],fine=[],n=Math.max(3,Math.round(n0)),us=[],wob=V.wob||.02,net=V.net??.5,ph=[];for(let k=0;k<n;k++){us.push((-1+2*(k+.5)/n)*.93+r.in(-.03,.03));ph.push([r.in(0,6.3),r.in(0,6.3)])}
  const uAt=(k,v)=>{const t=svSm((v-.02)/.55),a=us[k]*.22+(us[k]-us[k]*.22)*t;return a+wob*(.25+.75*Math.min(1,v/.4))*(.6*Math.sin(v*17+ph[k][0])+.4*Math.sin(v*37+ph[k][1]))};
  const cl=u=>Math.max(-.97,Math.min(.97,u));
  for(let k=0;k<n;k++){const v1=r.in(.88,.97),v0=(V.v0??.02)+r.in(0,.06),pl=[];for(let s2=0;s2<=16;s2++){const v=v0+(v1-v0)*s2/16;pl.push([cl(uAt(k,v)),v])}main.push(pl);
    const nf=r()<.55?1:2;for(let f=0;f<nf;f++){const vb=r.in(.28,.72),sd=r()<.5?-1:1,q=[],du=r.in(.35,.7)/n,p2=r.in(0,6.3);for(let s2=0;s2<=8;s2++){const v=vb+(Math.min(.96,v1+r.in(-.04,.02))-vb)*s2/8;
        q.push([cl(uAt(k,v)+sd*du*svSm(s2/5)+wob*.5*Math.sin(v*23+p2)),v])}fine.push(q)}}
  for(let k=0;k<n-1;k++){const m=Math.round(r.in(4,8)*net);for(let q=0;q<m;q++){const v=r.in(.14,.9),dv=r.in(.02,.06)*(r()<.5?1:-1),a=uAt(k,v),b=uAt(k+1,v+dv),mu=(a+b)/2+r.in(-.25,.25)*(b-a);
      fine.push([[cl(a),v],[cl(mu),v+dv*.5+r.in(-.012,.012)],[cl(b),v+dv]])}}
  return{main,fine}}
function svorRamp(st,v){if(v<=st[0][0])return st[0][1];for(let i=1;i<st.length;i++)if(v<=st[i][0]){const a=st[i-1],b=st[i];return mix(a[1],b[1],(v-a[0])/((b[0]-a[0])||1))}return st[st.length-1][1]}
/* the material of one piece (the svDraw attributes) from the sort's colours by kind (S.mat(cwx)[kind] = {st, bst, shade, lite, bshade, blite, rim},
   a piece's own key p.mat (m0[p.mat], the lateral sepals' own colour) before its kind's; S.mat(cwx).pat = the patterns of the perianth: {on:{sep,pet,...}, vein:{c,n,w,op,net}, spot:{c,n,r:[a,b],v:[a,b],op,k}, blot:{c,n,r:[a,b],op},
   band:{c,w,v0,op}, eye:{c,v,w,op}}); every colour moved by the individual's shade, greened in the young bud, faded by the sort's wilt.
   lp: the same patterns for the lean drawing (lod 1) */
function svorMatOf(P,m0,kind,c,g,t,wf,mk){const base=(mk&&m0[mk])||m0[kind]||m0.pet,cf=(x,v)=>{if(!x)return x;let y=svShift(x,g.dh||0,g.ds||0,g.dl||0);if(c.gt>0)y=mix(y,P.greenC,c.gt*(v==null?.5:1-svSm(v/.55)));if(c.wc>0&&wf)y=wf(y,c.wc);if(c.wc>0&&P.wiltK&&P.wiltK[kind])y=P.wiltK[kind](y,c.wc);return y},
    st=base.st.map(([v,x])=>[v,cf(x,v)]),bst=(base.bst||base.st).map(([v,x])=>[v,cf(x,v)]),
    m=Object.assign({stops:st,bstops:bst,shade:cf(base.shade),lite:base.lite||'#ffffff',bshade:cf(base.bshade||base.shade),blite:base.blite||base.lite||'#ffffff',rim:cf(base.rim||st[st.length-1][1]),cast:m0.cast||'#2a1830',sdv:base.vein?cf(base.vein):null,sdvS:svorSideV(P)},
      P.light,{rw:.004+.006*c.dec,ro:.22+.2*c.dec});
  /* (the kind's own opt-in layers, svDraw's m.cross: its colours moved as every other, faded in the bud; none by default) */
  if(base.cross)m.cross=svCrossL(base.cross).map(z=>Object.assign({},z,{st:(z.st||z).map(([x,y,a])=>[x,cf(y),a]),k:(z.k??1)*(1-c.bud)}));
  /* the side lobes' stripes in full detail too (the lean drawing has its own, svorLeanPiece): converging toward the lobe's tip */
  if(kind==='side'&&m.sdv&&c.bud<.6&&(c.lod!=null?c.lod>1:DET>=1.5)){const sv=svorSideV(P),sl=sv.u.map((u,i)=>{const pl=[];for(let s=0;s<=5;s++)pl.push([u*(1-.3*s/5),.06+sv.len[i]*s/5]);return pl});
    m.veins=(sh,front)=>front?[[sl,sv.w,m.sdv,sv.op]]:[]}
  /* the tissue (P.tex {n, w, op, opL, k, lk, du, net, fine, sat, satW}, full detail): many fine veins from the claw, each a translucent groove (a shade
     of the body) beside a lit ridge (the body lightened), fading before the margin; and a few broad satin streaks in the washes: the sheen of
     the tissue without grain (phalaenopsis 3, 27; cymbidium 98) */
  let tex=null;if(P.tex&&(kind==='sep'||kind==='pet')&&(c.lod!=null?c.lod>1:DET>=1.5)&&c.bud<.6){const T=m0.tex?Object.assign({},P.tex,m0.tex):P.tex,r2=svRng((t.sd||1)+77),vn=T.wob?svorVeinNet(r2,Math.round(T.n*(kind==='sep'?.8:1))+r2.in(0,3),T):svVeins(r2,Math.round(T.n*(kind==='sep'?.8:1))+r2.in(0,3),T.net||0,.5),
      bc=svorRamp(st,.55),dk=mix(bc,m.shade,T.k??.4),li=mix(bc,'#ffffff',T.lk??.6),fd=1-c.bud,du=T.du??.03,
      sh2=vn.main.map(pl=>pl.map(([u,v])=>[Math.max(-1,Math.min(1,u+du*(1-v*.4))),v]));
    tex=[[vn.main,T.w,dk,T.op*fd],[sh2,T.w*1.1,li,(T.opL??T.op)*fd]];if(vn.fine.length&&T.fine)tex.push([vn.fine,T.w*.7,dk,T.op*T.fine*fd]);
    if(T.sat)m.flames={c:mix(bc,'#ffffff',.7),op:T.sat*fd,list:vn.main.filter((_,i)=>i%3===1).map(pl=>[pl,T.satW||.03])};
    /* T.dust {n, r (x D), op, lk}: the crystalline sparkle of the tissue (« diamond dust »: phalaenopsis 27, 13), tiny lit specks over the blade,
       thinning toward the claw; none by default (m0.tex: a colourway's own settings over P.tex) */
    if(T.dust){const Ds=T.dust,r3=svRng((t.sd||1)+91),pts=[],sl=Ds.sl??.004;for(let q=0;q<Ds.n*(kind==='sep'?.7:1);q++){const v=.12+.84*Math.sqrt(r3()),u=r3.in(-.92,.92)*(.4+.6*svSm(v/.35));pts.push([[u,v],[u+sl,v+sl/2]])}
      /* (Ds.cmp: the specks binned by v, each bin's opacity raised against the sheet's vein fade toward the tip (svFaceFill: .75 at v .55, .3 at 1),
         so the sparkle holds out to the margin as on 27; off by default) */
      if(Ds.cmp){const bins=[[0,.55,1],[.55,.75,1/.63],[.75,.9,1/.47],[.9,2,1/.35]];for(const[a0,a1,f]of bins){const ps=pts.filter(p=>p[0][1]>=a0&&p[0][1]<a1);if(ps.length)tex.push([ps,Ds.r,mix(bc,'#ffffff',Ds.lk??.8),Math.min(1,Ds.op*f)*fd])}}
      else tex.push([pts,Ds.r,mix(bc,'#ffffff',Ds.lk??.8),Ds.op*fd]);
      /* (Ds.n2, r2, op2, lk2: a second sprinkling, fewer and brighter specks crowding toward the margin, where the light catches the crystals: 27) */
      if(Ds.n2){const p2=[];for(let q=0;q<Ds.n2*(kind==='sep'?.7:1);q++){const v=.3+.67*Math.pow(r3(),.5),e=r3()<.6?(r3()<.5?-1:1)*r3.in(.62,.95):r3.in(-.7,.7);p2.push([[e,v],[e+sl*.75,v+sl*.375]])}
        if(Ds.cmp)for(const[a0,a1,f]of[[0,.55,1],[.55,.75,1/.63],[.75,.9,1/.47],[.9,2,1/.35]]){const ps=p2.filter(p=>p[0][1]>=a0&&p[0][1]<a1);if(ps.length)tex.push([ps,Ds.r2||Ds.r*1.5,mix(bc,'#ffffff',Ds.lk2??.92),Math.min(1,(Ds.op2??Ds.op)*f)*fd])}
        else tex.push([p2,Ds.r2||Ds.r*1.5,mix(bc,'#ffffff',Ds.lk2??.92),(Ds.op2??Ds.op)*fd])}
      /* (Ds.dn, dop, dk: a dark sprinkling among the lit one, the shaded side of the grain: 27 seen at full size is a fine salt and pepper, not
         white flakes; off by default; Ds.sl: the length of a speck along u, .004 by default) */
      if(Ds.dn){const p3=[];for(let q=0;q<Ds.dn*(kind==='sep'?.7:1);q++){const v=.1+.88*Math.sqrt(r3()),u=r3.in(-.94,.94)*(.4+.6*svSm(v/.35));p3.push([[u,v],[u+sl,v+sl/2]])}
        tex.push([p3,Ds.r,mix(bc,m.shade,Ds.dk??.4),(Ds.dop??Ds.op*.6)*fd])}}
    /* T.grain {s, n, r, op, lk, dn, dk, dop, hsl (lit and shaded at the body's own saturation, never a pale wash)}: the fine dense grain of the tissue (phalaenopsis 27 at full size: a salt and pepper of lit and
       shaded specks, never white flakes): one rect over the piece filled with two shared patterns of incommensurate tiles (svorGrain) */
    if(T.grain){const Gr=T.grain,hb=h2l(bc),lc=Gr.hsl?l2h(hb[0],hb[1],hb[2]+(1-hb[2])*(Gr.lk??.5)):mix(bc,'#ffffff',Gr.lk??.6),dc=Gr.hsl?l2h(hb[0],Math.min(1,hb[1]*1.05),hb[2]*(1-(Gr.dk??.4))):mix(bc,m.shade,Gr.dk??.45);
      m.over=(cg,it,sh,front,Dm)=>{const b=it.bb;for(const id of svorGrain(Dm,Gr,lc,dc))E('rect',{x:svF(b[0]-1),y:svF(b[1]-1),width:svF(b[2]-b[0]+2),height:svF(b[3]-b[1]+2),fill:`url(#${id})`,'fill-opacity':svF((front?1:.45)*fd)},cg)}}
    m.veins=(sh,front)=>front?tex:tex.slice(0,1).map(([s,w,x,o])=>[s,w,x,o*.5])}
  const own=m0.patK&&m0.patK[kind],pt=own||m0.pat;if(!pt||!own&&(!pt.on||!pt.on[kind])||c.bud>.6)return m;const r=svRng(t.sd),hi=c.lod!=null?c.lod>1:DET>=1.5,lp={},sets=[],fade=1-c.bud;
  if(pt.vein){const V=pt.vein,vn=V.wob?svorVeinNet(r,(hi?V.n:Math.max(5,V.n*.6))+r.in(0,2),V):svVeins(r,(hi?V.n:Math.max(5,V.n*.6))+r.in(0,2),V.net||0,.5),vc=cf(V.c);sets.push([vn.main,V.w,vc,Math.min(1,V.op*fade*(1+1.2*c.dec))]);if(hi&&vn.fine.length)sets.push([vn.fine,V.w*.65,vc,V.op*.7*fade]);
    /* the lean drawing (DET 1) keeps every vein only for a strong pattern (op >= .6, the striped ones); a fourth of them otherwise (budget) */
    lp.vein={pl:V.faint||V.op<.6?vn.main.filter((_,i,a)=>i%Math.max(1,Math.round(a.length/4))===1):vn.main,c:vc,w:V.w,op:Math.min(1,V.op*fade*(1+1.2*c.dec)),faint:!!V.faint}}
  /* (Sp.ring 0..1: the spots crowd toward the margins, a horseshoe round a paler middle (cymbidium 84, 98, 16); Sp.el: each spot a dash along
     the piece, el x its size long, a little skewed (blotches and streaks, never round stickers); both 0 by default) */
  if(pt.spot){const Sp=pt.spot,n=Math.round(Sp.n*(hi?1:.45)*r.in(.85,1.15)),pts=[];for(let q=0;q<n;q++){const v=Sp.v[0]+(Sp.v[1]-Sp.v[0])*Math.pow(r(),Sp.k||1),
      u=(Sp.ring?(r()<.5?-1:1)*Math.pow(r(),1-.8*Sp.ring)*.9:r.in(-.88,.88))*(.35+.65*svSm(v/.3)),s=r.in(Sp.r[0],Sp.r[1]);pts.push(Sp.el?[u,v,s,r.in(.4,1.6)*Sp.el,r.in(-.5,.5)]:[u,v,s,0,0])}
    const sc=cf(Sp.c);for(const[a,b]of[[0,.5],[.5,1.01]]){const L2=pts.filter(q=>(q[2]-Sp.r[0])/((Sp.r[1]-Sp.r[0])||1)>=a&&(q[2]-Sp.r[0])/((Sp.r[1]-Sp.r[0])||1)<b).map(q=>q[3]?[[q[0],q[1]],[q[0]+q[4]*q[2]*q[3],q[1]+q[2]*q[3]*1.5]]:[[q[0],q[1]],[q[0]+.006,q[1]+.003]]);
      if(L2.length)sets.push([L2,Sp.r[0]+(Sp.r[1]-Sp.r[0])*(a+.25),sc,Sp.op*fade])}lp.dot={pts,c:sc,r:(Sp.r[0]+Sp.r[1])/2,op:Sp.op*fade}}
  /* blotches (svor: round organic patches, a cluster of overlapping discs) and tiger bars (wavy strokes across the midrib); drawn with the veins
     and spots, so the piece clips them (the old flames made angular shards). Bl.v: the band of the piece they keep to (a pair at the claw) */
  if(pt.blot){const Bl=pt.blot,n=Math.round(r.in(Bl.n[0],Bl.n[1])),bl=[],dk=[],br=[],rg=[[],[],[],[]],bc=cf(Bl.c);for(let q=0;q<n;q++){
      const u1=r.in(-.8,.8),v1=r.in(.12,.92),rr=r.in(Bl.r[0],Bl.r[1]),ph=r.in(0,6.3),u0=Bl.bar?u1*.3:u1,v0=Bl.v?Bl.v[0]+(Bl.v[1]-Bl.v[0])*(v1-.12)/.8:v1;
      if(Bl.bar){const pl=[];for(let s=0;s<=6;s++){const x=(s-3)/3;pl.push([Math.max(-.96,Math.min(.96,u0+x*rr*2.2)),Math.max(.03,Math.min(.97,v0+rr*.12*Math.sin(ph+x*2.4)-rr*.06*x*x))])}br.push([pl,rr*.075])}
      /* (Bl.rag: a ragged blotch along the veins instead of the cluster of discs: strokes along v of three widths scattered in an ellipse longer
         along v, and fine streaks feathering out from its ends (harlequin and spotted whites, photographs 50-52, 68, 70: never round stickers);
         off by default) */
      else if(Bl.rag){const cl=(u,v)=>[Math.max(-.95,Math.min(.95,u)),Math.max(.03,Math.min(.97,v))],ns=Math.round(16+r.in(0,6));
        for(let j=0;j<ns;j++){const a=r.in(0,6.283),q2=Math.sqrt(r.in(0,1)),du=Math.cos(a)*rr*.55*q2,dv=Math.sin(a)*rr*.6*q2,L=rr*r.in(.2,.45)*(1-.4*q2),dr=r.in(-.04,.04);
          rg[j%3].push([cl(u0+du,v0+dv-L/2),cl(u0+du+dr*rr,v0+dv),cl(u0+du-dr*rr*.5,v0+dv+L/2)])}
        for(let j=0;j<3;j++){const du=r.in(-.4,.4)*rr,up=j%2?1:-1,L=rr*r.in(.3,.6),dr=r.in(-.06,.06)*rr;rg[3].push([cl(u0+du,v0+up*rr*.3),cl(u0+du+dr,v0+up*(rr*.3+L*.5)),cl(u0+du+dr*1.6,v0+up*(rr*.3+L))])}}
      else for(let j=0;j<5;j++){const a=ph+j*1.26,f=j?.38+.16*Math.sin(ph*3+j):0;dk.push([[Math.max(-.95,Math.min(.95,u0+Math.cos(a)*rr*f)),Math.max(.03,Math.min(.97,v0+Math.sin(a)*rr*f*.6))],rr*(j?.13+.05*Math.cos(ph*2+j):.2)])}
      bl.push([u0,v0,rr,ph,Bl.bar?1:0])}
    const rm=(Bl.r[0]+Bl.r[1])/2,dot=p0=>[p0,[p0[0]+.004,p0[1]+.002]];/* one stroke set per kind (budget): bars, cores, satellites */
    if(br.length)sets.push([br.map(x=>x[0]),rm*.15,bc,Bl.op*fade]);if(rg[0].length){[.42,.27,.15].forEach((w,i)=>sets.push([rg[i],rm*w,bc,Bl.op*fade*(1-.08*i)]));sets.push([rg[3],rm*.05,bc,Bl.op*fade*.55])}if(dk.length){sets.push([dk.filter((_,i)=>i%5===0).map(x=>dot(x[0])),rm*.62,bc,Bl.op*fade]);sets.push([dk.filter((_,i)=>i%5).map(x=>dot(x[0])),rm*.46,bc,Bl.op*fade])}
    lp.blob={list:bl,c:bc,op:Bl.op*fade}}
  /* (pt.mark {c, n (veins across), r:[a,b] (widths x D), len:[a,b] (along v), band:[d0,d1] (distance to the margin, share of L, where they crowd),
     clear (the pale margin left bare), mid (their density in the paler middle), bar (share of crossbars to the next vein), sw (the margin's
     distance across, share of L), v0, op}: a lip's marks (cymbidium 84, 98, 16): blotches and short curved bars along the radiating veins, crowding
     in a horseshoe band inside a pale margin, sparse in the middle; three widths, one path each; none by default) */
  if(pt.mark){const Mk=pt.mark,nv=Mk.n||14,bd=Mk.band||[.05,.26],clr=Mk.clear??.035,sw=Mk.sw??.65,gs=[[],[],[]],ctr=[],mc=cf(Mk.c),
      dm=(u,v)=>Math.min(sw*(1-Math.abs(u)),(1-v)*1.1);
    /* (Mk.jit: the marks' wander across their vein, default .025; Mk.cv: their bend; Mk.gap: the gaps along a vein; Mk.blot / Mk.com: shares of round blotches and of commas,
       a blot with a thin curved tail (cymbidium 84: blotches, commas and bars of uneven size, never even dashes); none by default) */
    const jt=Mk.jit??.025,cvA=Mk.cv??.022,cl2=a=>a.map(([x,y])=>[Math.max(-.97,Math.min(.97,x)),Math.min(.985,y)]);
    for(let i=0;i<nv;i++){const ui=-.95+1.9*(i+.5)/nv;let v=(Mk.v0??.1)+r.in(0,.06);
      while(v<.985){const u=Math.max(-.97,Math.min(.97,ui+r.in(-jt,jt))),d=dm(u,v),inB=d>=bd[0]&&d<=bd[1],pr=d<clr?0:inB?1:d<bd[0]?.55:(Mk.mid??.12),
          ln=r.in(Mk.len[0],Mk.len[1])*(inB?1:.7),k=r();
        if(r()<pr*(hi?1:.6)){const wi=k<.35?0:k<.75?1:2,cv=r.in(-cvA,cvA),kd=(Mk.blot||Mk.com)?r():1;
          if(kd<(Mk.blot||0)){const l2=ln*r.in(.08,.3);gs[k<.5?0:1].push(cl2([[u,v],[u+cv*.15,v+l2*.5],[u+cv*.3,v+l2]]));ctr.push([u,v])}
          else if(kd<(Mk.blot||0)+(Mk.com||0)){gs[0].push(cl2([[u,v],[u+cv*.05,v+ln*.06],[u+cv*.1,v+ln*.12]]));gs[2].push(cl2([[u,v+ln*.06],[u+cv*.7,v+ln*.45],[u+cv*1.8,v+ln*.75]]));ctr.push([u,v+ln*.2])}
          else{const pl=[[u,v],[u+cv,v+ln*.5],[u+cv*.3,v+ln]];
          if(r()<(Mk.bar??.22)&&i<nv-1){const u2=-.95+1.9*(i+1.5)/nv;pl.push([(u+u2)*.5,v+ln*1.15],[u2,v+ln*.9])}
          gs[wi].push(cl2(pl));ctr.push([u,v+ln*.4])}}
        v+=ln+r.in((Mk.gap||[.035])[0],(Mk.gap||[0,.09])[1])*(inB?1:1.6)}}
    const w3=[Mk.r[1],(Mk.r[0]+Mk.r[1])/2,Mk.r[0]];gs.forEach((g3,j)=>{if(g3.length)sets.push([g3,w3[j],mc,(Mk.op??.92)*fade*(1-.06*j),1])});
    lp.dot=lp.dot?Object.assign({},lp.dot,{pts:lp.dot.pts.concat(ctr)}):{pts:ctr,c:mc,r:w3[1],op:(Mk.op??.92)*fade}}
  if(sets.length){const tx=tex||[];m.veins=(sh,front)=>front?tx.concat(sets):tx.slice(0,1).map(([s,w,x,o])=>[s,w,x,o*.5]).concat(sets.slice(0,1).map(([s,w,x,o])=>[s,w*.8,x,o*.25]))}
  /* (pt.stripe {c, w, op, v}: one stripe down the piece's midrib, fading at both ends (cymbidium 84: the mid-lobe's red median line); none by default) */
  if(pt.stripe){const St=pt.stripe,v0=(St.v||[.04,.8])[0],v1=(St.v||[.04,.8])[1],tx=m.veins;const add=[[[[0,v0],[.004,(v0+v1)/2],[0,v1]]],St.w,cf(St.c),St.op*fade],add2=[[[[0,v0+.08],[.003,(v0+v1)/2],[0,v1-.1]]],St.w*1.8,cf(St.c),St.op*.45*fade];
    m.veins=(sh,front)=>{const L=tx?tx(sh,front):[];return front?L.concat([add2,add]):L}}
  if(pt.band){m.band=Object.assign({},pt.band,{c:cf(pt.band.c),op:pt.band.op*fade,bk:.6});lp.band=m.band}
  if(pt.eye){const e=pt.eye;m.blot={c:cf(e.c),e:cf(e.e||e.c),v:e.v,w:e.w,op:e.op*fade,k:2.2,cv:.6};lp.eye=m.blot}
  if(own)lp.own=1;m.lp=lp;return m}
/* a tube in the flower's frame (the column, a spur): its centre line, radii; the outline of its swept rings, lit across (lod 2: a highlight) */
function svorTube(par,B,O,C,Rr,col,lod,R0){const pts=[],n=C.length;let z=0;
  for(let i=0;i<n;i++){const d=V3.nz(V3s(C[Math.min(n-1,i+1)],C[Math.max(0,i-1)])),X=Math.abs(d[0])<.9?[1,0,0]:[0,1,0],Y=V3.nz(V3.cr(d,X)),X2=V3.cr(Y,d);
    for(let a=0;a<10;a++){const t=a/10*6.2832,p=V3.add(C[i],V3.add(V3.sc(X2,Math.cos(t)*Rr[i]),V3.sc(Y,Math.sin(t)*Rr[i])));const s=PJ(B,O,p);pts.push([s[0],s[1]]);z+=s[2]}}
  const h=hull2(pts);if(h.length<3)return;const nv=V3.nz(toV(B,V3.nz(V3s(C[n-1],C[0])))),side=V3.nz(V3.cr(nv,[0,0,1])),k=V3.dot(side,LIGHT);
  E('path',{d:svSpl(h),fill:col[1]},par);
  if(lod>1&&!LOD){const hl=[];for(let i=0;i<n;i++){const s=PJ(B,O,C[i]),o=Rr[i]*.45*(k>0?1:-1);hl.push([s[0]+side[0]*o,s[1]-side[1]*o])}E('path',{d:svSpl(hl,false),fill:'none',stroke:col[2],'stroke-width':svF(Math.max(.3,Rr[0]*.5)),'stroke-opacity':.55,'stroke-linecap':'round'},par)}}
/* the column drawn in volume (see svorParts; q.gl: its gloss, 1 by default, less for a column in the shade of the lip's tube, cymbidium): C its centre line, Rr its radii; colours m0.col (body), m0.colB (its foot, the flower's colour),
   m0.cap (the anther cap), m0.poll (pollinia under the cap's front), m0.colV (its underside), m0.colDot (spots and streaks there), m0.stig */
function svorColumn(k,B,O,R0,q,C,Rr,c,m0,g,cf,lod){const n=C.length-1,fl=q.fl||1.15,df=GDEF||defs,g2=G(k),hi=lod>1&&!LOD,
    cc=cf(m0.col),sh0=mix(shd(cc,-.22),'#6a5040',.15),gl=q.gl??1,lt=mix(cc,'#ffffff',.6*gl),capC=cf(m0.cap||mix(m0.col,'#f4ecd8',.5)),cB=m0.colB?cf(m0.colB):null,cV=m0.colV?cf(m0.colV):mix(cc,sh0,.35),
    F=C.map((p,i)=>{const d=V3.nz(V3s(C[Math.min(n,i+1)],C[Math.max(0,i-1)])),up=V3.nz(V3s([0,1,0],V3.sc(d,d[1])));return{d,up,x:V3.cr(up,d)}}),
    at=(i,u,w,r)=>V3.add(C[i],V3.add(V3.sc(F[i].x,u*r*fl),V3.sc(F[i].up,w*r))),pj=p=>{const s=PJ(B,O,p);return[s[0],s[1]]},vz=v=>toV(B,v)[2],
    ring=i=>{const pts=[];for(let t=0;t<16;t++){const th=t/16*6.2832;pts.push(pj(at(i,Math.cos(th),Math.sin(th),Rr[i])))}return pts},
    sw=Math.max(.25,R0*.005),tip=C[n],T=F[n],rT=Rr[n],dor=vz(T.up),L2=Math.hypot(LIGHT[0],LIGHT[1])||1,Ls=[LIGHT[0]/L2,-LIGHT[1]/L2];
  /* the body: the union of the hulls of its successive rings (an arch is not convex) */
  let bodyD='',rp=ring(0);for(let i=1;i<=n;i++){const rq=ring(i);bodyD+=svSpl(hull2(rp.concat(rq)));rp=rq}
  /* the anther cap: the upper half of an ellipsoid on the tip, a little back from it (q.capF: moved forward along the tip, x capL; q.capBall: a whole
     ellipsoid, the round cap seen at the end of a column arching toward the eye, cymbidium 98, 16) */
  const capR=R0*(q.cap||.05),capL=R0*(q.capL||q.cap||.05),capH=capR*(q.capH||.8),Cc=V3.add(tip,V3.add(V3.sc(T.up,rT*(.3-(q.capV||0))),V3.sc(T.d,capL*((q.capF||0)-.25)))),
    capAt=(ph,th)=>V3.add(Cc,V3.add(V3.add(V3.sc(T.x,Math.cos(ph)*Math.cos(th)*capR),V3.sc(T.d,Math.sin(ph)*Math.cos(th)*capL)),V3.sc(T.up,Math.sin(th)*capH))),
    drawCap=()=>{const pts=[];for(let i=0;i<16;i++)for(const th of(q.capBall?[-1.4,-1,-.5,0,.5,1,1.4]:[0,.5,1,1.4]))pts.push(pj(capAt(i/16*6.2832,th)));const cd=svSpl(hull2(pts));
      let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}const rr=Math.max(x1-x0,y1-y0)*.62;
      let fill=capC;if(hi&&rr>1.5){const id='svk'+(gid++),gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF((x0+x1)/2),cy:svF((y0+y1)/2),r:svF(rr),fx:svF((x0+x1)/2+Ls[0]*rr*.45),fy:svF((y0+y1)/2+Ls[1]*rr*.45)},df);
        stops(gr,[[0,mix(capC,'#ffffff',.6)],[.42,capC],[.85,shd(capC,-.14)],[1,shd(capC,-.24)]]);fill=`url(#${id})`}
      E('path',{d:cd,fill,stroke:shd(capC,-.3),'stroke-width':svF(sw),'stroke-opacity':.35},g2);
      if(hi&&dor>-.1&&!q.capBall){/* the median furrow over its top, and its rim on the column */const fu=[];for(let s=-1;s<=1.001;s+=.25)fu.push(pj(capAt(Math.PI/2*Math.sign(s||1),Math.PI/2*(1-Math.abs(s))*.98)));
        E('path',{d:svQuad(fu),fill:'none',stroke:shd(capC,-.32),'stroke-width':svF(sw*1.1),'stroke-opacity':.45,'stroke-linecap':'round'},g2);
        const rim=[];for(let i=0;i<=8;i++)rim.push(pj(capAt(Math.PI*i/8,.02)));E('path',{d:svQuad(rim),fill:'none',stroke:shd(capC,-.35),'stroke-width':svF(sw*1.2),'stroke-opacity':.3,'stroke-linecap':'round'},g2)}
    };
  /* the pollinia hanging under the cap's front rim, its rim over their tops (cymbidium 84: two yellow lumps in the hood's mouth, a little taller
     than wide, lit at the top left, shaded under; drawn after the body, before the cap) */
  const drawPoll=()=>{if(!(m0.poll&&hi))return;const pc=cf(m0.poll);let pd='',hd='';
    /* (the hood's mouth: its cream lining behind them, rimmed in shade) */
    {const lc=cf(m0.stig||mix(capC,'#f6ead8',.5)),m1=V3.add(tip,V3.add(V3.sc(T.d,capL*.05),V3.sc(T.up,-rT*.8))),e=[];for(let i=0;i<16;i++){const t=i/16*6.2832;e.push(pj(V3.add(m1,V3.add(V3.sc(T.x,Math.cos(t)*capR*.95),V3.sc(T.d,Math.sin(t)*capR*(t<3.1416?.6:.42))))))}
      E('path',{d:svSpl(e),fill:lc,stroke:mix(cc,'#2a0608',.4),'stroke-width':svF(sw*2.2),'stroke-opacity':.55},g2)}for(const s of[-1,1]){const p0=V3.add(tip,V3.add(V3.sc(T.x,s*capR*.23),V3.add(V3.sc(T.d,-capL*(q.pollD??.2)),V3.sc(T.up,-rT*.95))));const e=[],h=[];
      for(let i=0;i<12;i++){const t=i/12*6.2832,w=1-.18*Math.max(0,-Math.sin(t));e.push(pj(V3.add(p0,V3.add(V3.sc(T.x,Math.cos(t)*capR*.22*w),V3.sc(T.d,Math.sin(t)*capR*.4)))))}
      for(let i=0;i<5;i++){const t=1.9+i*.32;h.push(pj(V3.add(p0,V3.add(V3.sc(T.x,Math.cos(t)*capR*.16),V3.sc(T.d,Math.sin(t)*capR*.24)))))}pd+=svSpl(e);hd+=svQuad(h)}
    E('path',{d:pd,fill:pc,stroke:shd(pc,-.4),'stroke-width':svF(sw*1.2),'stroke-opacity':.6},g2);E('path',{d:hd,fill:'none',stroke:mix(pc,'#fffbe8',.6),'stroke-width':svF(Math.max(.3,capR*.07)),'stroke-opacity':.7,'stroke-linecap':'round'},g2)};
  /* the wings: two thin flaps along the tip's sides */
  if(q.wing){let wd='';for(const s of[-1,1]){const A=[],Bw=[];for(let i=Math.round(n*.4);i<=n;i++){const t=(i/n-.4)/.6,b=at(i,s*.85,-.1,Rr[i]),
      e=V3.add(b,V3.add(V3.sc(F[i].x,s*R0*q.wing*Math.pow(Math.sin(Math.PI*Math.min(1,.1+t*.95)),.7)),V3.sc(F[i].up,-R0*q.wing*.45*t)));A.push(pj(b));Bw.push(pj(e))}wd+=svSpl(A.concat(Bw.reverse()))}
    E('path',{d:wd,fill:mix(cc,lt,.3),stroke:sh0,'stroke-width':svF(sw),'stroke-opacity':.4},g2)}
  if(dor<-.15)drawCap();
  /* the body's light: across its axis on the screen (a dome's when it is seen end on) */
  const p0=pj(C[0]),p1=pj(tip),ax=[p1[0]-p0[0],p1[1]-p0[1]],al=Math.hypot(ax[0],ax[1]),pm=pj(C[n>>1]),wm=Math.max(.5,Rr[n>>1]*fl*1.15);let fill=cc;
  if(lod>1||al>R0*.08){const id='svk'+(gid++);let gr;if(al<wm*1.2){const r=Math.max(wm,rT*fl)*1.3;gr=E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF(p1[0]),cy:svF(p1[1]),r:svF(r),fx:svF(p1[0]+Ls[0]*r*.4),fy:svF(p1[1]+Ls[1]*r*.4)},df);
      stops(gr,[[0,lt],[.45,mix(cc,lt,.3)],[.8,cc],[1,sh0]])}
    else{let pp=[-ax[1]/al,ax[0]/al];if(pp[0]*Ls[0]+pp[1]*Ls[1]<0)pp=[-pp[0],-pp[1]];gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(pm[0]-pp[0]*wm),y1:svF(pm[1]-pp[1]*wm),x2:svF(pm[0]+pp[0]*wm),y2:svF(pm[1]+pp[1]*wm)},df);
      stops(gr,[[0,sh0],[.28,mix(cc,sh0,.35)],[.55,cc],[.8,lt],[.93,mix(lt,'#ffffff',.4)],[1,mix(lt,cc,.35)]])}fill=`url(#${id})`}
  E('path',{d:bodyD,fill},g2);
  if(hi){const cid='svk'+(gid++);E('path',{d:bodyD},E('clipPath',{id:cid},df));const cl=G(g2,{'clip-path':`url(#${cid})`});
    /* its foot in the flower's colour, fading toward the tip */
    if(cB&&al>R0*.04){const id='svk'+(gid++);stops(E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(p0[0]),y1:svF(p0[1]),x2:svF(p1[0]),y2:svF(p1[1])},df),[[0,cB,.85],[.35,cB,.45],[.7,cB,0]]);E('path',{d:bodyD,fill:`url(#${id})`},cl)}
    /* the underside: a darker band (or its own colour), seen when the column turns it toward the eye; a highlight along its lit top */
    if(!(q.helm&&q.helm.cav&&q.helm.cav.gut)){const vs=[];for(let i=0;i<=n;i++)vs.push(pj(at(i,0,-.92,Rr[i])));E('path',{d:svQuad(vs),fill:'none',stroke:cV,'stroke-width':svF(Math.max(.4,Rr[n>>1]*(m0.colV?1.3:.8))),'stroke-opacity':m0.colV?.75:.35,'stroke-linecap':'round'},cl)}
    const hs=[];for(let i=1;i<=n;i++)hs.push(pj(at(i,-.3,.62,Rr[i])));E('path',{d:svQuad(hs),fill:'none',stroke:'#ffffff','stroke-width':svF(Math.max(.3,Rr[n>>1]*.32)),'stroke-opacity':.38*gl,'stroke-linecap':'round'},cl)}
  /* its underside spotted and streaked (cymbidium: col.dots, m0.colDot), toward the eye only */
  /* (q.stk: every mark a fine streak along the column, 1 to stk segments long, q.stkW wide x R0: cymbidium 84's densely streaked underside) */
  /* (q.stkL [a,b]: the streaks' lengths as shares of the column, anywhere along it, wandering a little across (q.stkDot: share of plain stipples):
     a fine irregular stipple, never the bars of a barcode (cymbidium 84); none by default) */
  if(q.dots&&m0.colDot&&-vz(F[n>>1].up)>-.2){const dr2=svRng((g.sd||1)+9),pts=[],st=[],sk=q.stk||0;for(let i=0;i<q.dots*(lod>1?1:.5);i++){const s=dr2.in(.15,.92),j=Math.min(n-1,Math.floor(s*n)),u=dr2.in(-.8,.8),p=at(j,u,-Math.sqrt(Math.max(0,1-u*u))*.98,Rr[j]);
      if(q.stkL){const aS=(s1,u1)=>{const x=Math.max(0,Math.min(1,s1))*n,j1=Math.min(n-1,Math.floor(x)),f=x-j1,w1=-Math.sqrt(Math.max(0,1-u1*u1))*.98;return V3.add(V3.sc(at(j1,u1,w1,Rr[j1]),1-f),V3.sc(at(j1+1,u1,w1,Rr[j1+1]),f))};
        const l1=dr2.in(q.stkL[0],q.stkL[1]),u2=Math.max(-.85,Math.min(.85,u+dr2.in(-.1,.1)));if(dr2()<(q.stkDot||0)||!hi)pts.push(pj(aS(s,u)));else st.push([pj(aS(s,u)),pj(aS(s+l1,u2))]);continue}
      if((sk||i%3===0)&&hi){const j2=Math.min(n,j+(sk?1+Math.floor(dr2.in(0,sk)):1)),u2=sk?u*.97:u*.9,q2=at(j2,u2,-Math.sqrt(Math.max(0,1-u2*u2))*.98,Rr[j2]);st.push([pj(p),pj(q2)])}else pts.push(pj(p))}
    const dc=cf(m0.colDot);E('path',{d:svDots(pts),fill:'none',stroke:dc,'stroke-width':svF(Math.max(.35,R0*(q.dotW||.016))),'stroke-linecap':'round','stroke-opacity':.85},g2);
    if(st.length)E('path',{d:st.map(([a,b])=>'M'+svF(a[0])+','+svF(a[1])+'L'+svF(b[0])+','+svF(b[1])).join(''),fill:'none',stroke:dc,'stroke-width':svF(Math.max(.3,R0*(q.stkW||.011))),'stroke-linecap':'round','stroke-opacity':.7},g2)}
  /* the stigma: a glossy hollow under the tip, when the underside turns toward the eye */
  if(q.stig&&-vz(T.up)>.05&&hi){const sC=V3.add(at(n-1,0,-.95,Rr[n-1]),V3.sc(T.d,rT*.2)),e=[];for(let i=0;i<12;i++){const t=i/12*6.2832;e.push(pj(V3.add(sC,V3.add(V3.sc(T.x,Math.cos(t)*rT*fl*q.stig),V3.sc(T.d,Math.sin(t)*rT*q.stig*1.2)))))}
    const sc=cf(m0.stig||mix(m0.col,'#8a7a50',.4));E('path',{d:svSpl(e),fill:sc,stroke:shd(sc,-.3),'stroke-width':svF(sw),'stroke-opacity':.5},g2)}
  /* the rostellum's beak: a small tongue under the cap's front, pointing down */
  if(q.beak){const b0=V3.add(tip,V3.add(V3.sc(T.d,rT*.35),V3.sc(T.up,-rT*.25))),bd=V3.nz(V3.add(V3.sc(T.d,.4),V3.sc(T.up,-.92))),bl=R0*q.beak,hw=rT*.42,
      pl=[V3.add(b0,V3.sc(T.x,hw)),V3.add(V3.add(b0,V3.sc(bd,bl*.55)),V3.sc(T.x,hw*.5)),V3.add(b0,V3.sc(bd,bl)),V3.add(V3.add(b0,V3.sc(bd,bl*.55)),V3.sc(T.x,-hw*.5)),V3.add(b0,V3.sc(T.x,-hw))].map(pj);
    E('path',{d:svSpl(pl),fill:mix(cc,lt,.2),stroke:sh0,'stroke-width':svF(sw),'stroke-opacity':.45},g2)}
  /* (q.helm {w, l, h (half-axes x the tip's radius: across, along, up), up, fwd (its centre's offset, same unit), cav {w, h, dots} }: the column's
     tip a rounded, elongated helmet in the column's own waxy colour, the anther cap under its front rim; under it the cavity of the ventral face,
     yellowish (m0.colCav), shaded under the rim and densely spotted (m0.colDot) (cymbidium 16, 98: never a ball set on a post); off by default) */
  if(q.helm&&hi){const hm=q.helm,Ch=V3.add(tip,V3.add(V3.sc(T.up,rT*(hm.up||0)),V3.sc(T.d,rT*(hm.fwd||0)))),dn=V3.sc(T.up,-1);
    if(hm.cav&&-vz(T.up)>-.3){const cv=hm.cav,kc=cf(m0.colCav||m0.colV||m0.col);
      /* (cav.gut: the ventral face a gutter along the column, from under the helmet down to its foot (cav.i0, share of the column), cav.w of its
         half-width under the tip narrowing to cav.tw of that at the foot (a U), darkest under the helmet's rim, densely spotted, spots of two
         sizes (cymbidium 16, 98: never a box)) */
      if(cv.gut){const i0=Math.round(n*(cv.i0||0)),tw=cv.tw??.4,uw=x=>Math.min(.95,cv.w*(tw+(1-tw)*svSm((x-i0)/Math.max(1,n-i0)))),Lg=[],Rg=[],
          sAt=(x,u)=>{const i=Math.max(0,Math.min(n-1,Math.floor(x))),f=x-i,w=-Math.sqrt(Math.max(0,1-u*u))*.99;return V3.add(V3.sc(at(i,u,w,Rr[i]),1-f),V3.sc(at(i+1,u,w,Rr[i+1]),f))};
        for(let i=n;i>=i0;i--){const u=uw(i);Lg.push(pj(sAt(i,-u)));Rg.push(pj(sAt(i,u)))}
        const bt=pj(V3.add(sAt(i0,0),V3.sc(F[i0].d,-Rr[i0]*tw*cv.w*.7))),pt=pj(sAt(n,0)),pb=pj(sAt(i0,0)),id='svk'+(gid++);
        stops(E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(pt[0]),y1:svF(pt[1]),x2:svF(pb[0]),y2:svF(pb[1])},df),[[0,mix(kc,'#1a0a06',.62)],[.3,mix(kc,'#1a0a06',.32)],[.75,kc],[1,mix(kc,'#fff4d8',.2)]]);
        E('path',{d:svSpl(Lg.concat([bt],Rg.reverse())),fill:`url(#${id})`,stroke:mix(kc,'#1a0a06',.5),'stroke-width':svF(sw*1.3),'stroke-opacity':.45},g2);
        if(cv.dots&&m0.colDot){const dr3=svRng((g.sd||1)+13),pa=[],pb2=[];for(let k=0;k<cv.dots;k++){const x=i0+(n-i0)*Math.pow(dr3(),.8),u=dr3.in(-.82,.82)*uw(x);(dr3()<.3?pb2:pa).push(pj(sAt(x,u)))}
          const dc=cf(m0.colDot),dw=R0*(cv.dw||.014);E('path',{d:svDots(pa),fill:'none',stroke:dc,'stroke-width':svF(Math.max(.4,dw)),'stroke-linecap':'round','stroke-opacity':.85},g2);
          E('path',{d:svDots(pb2),fill:'none',stroke:dc,'stroke-width':svF(Math.max(.5,dw*1.9)),'stroke-linecap':'round','stroke-opacity':.8},g2)}}
      else{const c0=V3.add(Ch,V3.sc(dn,rT*hm.h*(cv.off??.55))),ax=rT*fl*hm.w*cv.w,ay=rT*hm.h*cv.h,e=[];for(let i=0;i<16;i++){const t=i/16*6.2832;e.push(pj(V3.add(c0,V3.add(V3.sc(T.x,Math.cos(t)*ax),V3.sc(dn,Math.sin(t)*ay)))))}
        const pc=pj(c0),pt=pj(V3.add(c0,V3.sc(dn,-ay))),id='svk'+(gid++);
        stops(E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(pt[0]),y1:svF(pt[1]),x2:svF(pc[0]),y2:svF(pc[1]+(pc[1]-pt[1]))},df),[[0,mix(kc,'#1a0a06',.55)],[.35,shd(kc,-.12)],[1,kc]]);
        E('path',{d:svSpl(e),fill:`url(#${id})`},g2);
        if(cv.dots&&m0.colDot){const dr3=svRng((g.sd||1)+13),pts=[];for(let i=0;i<cv.dots;i++){const a=dr3.in(0,6.2832),r=Math.sqrt(dr3())*.88;pts.push(pj(V3.add(c0,V3.add(V3.sc(T.x,Math.cos(a)*r*ax),V3.sc(dn,Math.sin(a)*r*ay)))))}
          E('path',{d:svDots(pts),fill:'none',stroke:cf(m0.colDot),'stroke-width':svF(Math.max(.4,R0*(cv.dw||.014))),'stroke-linecap':'round','stroke-opacity':.85},g2)}}}
    /* (hm.full: a whole ellipsoid, round all over with no flat rim, casting its own soft shade on the gutter under it (cymbidium 16, 98)) */
    const ths=hm.full?[-1.35,-.9,-.45,0,.45,.9,1.35]:[-.35,0,.45,.9,1.35],hp=(th,i,k)=>pj(V3.add(Ch,V3.add(V3.add(V3.sc(T.x,Math.cos(i/20*6.2832)*Math.cos(th)*rT*fl*hm.w*k),V3.sc(T.d,Math.sin(i/20*6.2832)*Math.cos(th)*rT*hm.l*k)),V3.sc(T.up,Math.sin(th)*rT*hm.h*k))));
    if(hm.full&&hm.sh){const sp=[],o=V3.sc(dn,rT*hm.h*hm.sh);for(let i=0;i<20;i++)for(const th of ths){const q2=hp(th,i,.78),q0=pj(V3.add(Ch,o)),c0=pj(Ch);sp.push([q2[0]+q0[0]-c0[0],q2[1]+q0[1]-c0[1]])}
      E('path',{d:svSpl(hull2(sp)),fill:'#1a0a06','fill-opacity':.2},g2)}
    const pts=[];for(let i=0;i<20;i++)for(const th of ths)pts.push(hp(th,i,1));
    let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}const rr=Math.max(x1-x0,y1-y0)*.6,id='svk'+(gid++);
    stops(E('radialGradient',{id,gradientUnits:'userSpaceOnUse',cx:svF((x0+x1)/2),cy:svF((y0+y1)/2),r:svF(rr),fx:svF((x0+x1)/2+Ls[0]*rr*(hm.full?.55:.4)),fy:svF((y0+y1)/2+Ls[1]*rr*(hm.full?.55:.4))},df),[[0,mix(lt,'#ffffff',.3)],[.4,mix(cc,lt,.45)],[.78,cc],[1,shd(cc,hm.full?-.3:-.16)]]);
    E('path',{d:svSpl(hull2(pts)),fill:`url(#${id})`,stroke:shd(cc,-.28),'stroke-width':svF(sw),'stroke-opacity':.3},g2)}
  drawPoll();if(dor>=-.15)drawCap();
  if(!hi)E('path',{d:bodyD,fill:'none',stroke:sh0,'stroke-width':svF(sw),'stroke-opacity':.4},g2)}
/* the callus (generic): q = P.cal {at, w (half-width x R0), h (length), z (its height), n (ridges side by side), gap, notch (its top split in two
   horns, share of h), nu (the split's half-width, share of w), tilt (degrees: its face turned up from the flower's face), prof, dots, shC / shK (its shade's
   colour and share: a brown-black .5 by default, a warm orange for a yellow callus)}: one lit
   cushion per ridge on the lip's foot, its top forked in two horns (phalaenopsis 3, 27) or two narrow parallel keels (cymbidium 84) */
function svorCalS(q,c,R0,x0){const t=(q.tilt??30)*SVOR_DEG,Y=[0,Math.cos(t),-Math.sin(t)],Z=[0,Math.sin(t),Math.cos(t)],pr=svorProf(q.prof||[[0,.6],[.3,.95],[.75,1],[1,.85]]),gr=c.o2,
    cen=[q.at[0]*R0+x0,q.at[1]*R0,q.at[2]*R0];
  /* (q.sl: the horns' tops slanting up toward their outer corners, share of h; 0 by default) */
  return(u,v)=>{const nt=q.notch||0,vv=v*(1-nt*Math.pow(Math.max(0,1-Math.abs(u)/(q.nu||.45)),1.4))+(q.sl||0)*Math.pow(Math.abs(u),1.5)*v*v,hw=q.w*R0*pr(vv)*(.7+.3*gr),
    zz=q.z*R0*Math.pow(Math.max(0,1-u*u),.55)*svSm(vv/.3)*(1-.2*svSm((vv-.8)/.2))*(.5+.5*gr);
    return V3.add(cen,V3.add(V3.add([-u*hw,0,0],V3.sc(Y,(vv-.5)*q.h*R0)),V3.sc(Z,zz)))}}
/* the lip's drawn parts and the column, as {fn, proxy, z} (proxy: a sheet standing for it in svDraw's order) */
function svorParts(P,B,O,c,m0,g,wf,lod,mid){const R0=c.R0,out=[],cf=x=>{let y=svShift(x,g.dh||0,g.ds||0,g.dl||0);if(c.wc>0&&wf)y=wf(y,c.wc);return y},show=1-svSm((c.bud-.25)/.25);
  if(show<=0)return out;const prox=(S2)=>svSheet(B,O,S2,{nu:3,nv:3,mat:{}});
  /* the column: a club from the heart, arching over the lip, wider toward its tip (q.Rt), its section wider than high (q.fl); at its tip the anther
     cap, a rounded hood with a median furrow; under the tip the rostellum's beak and the stigma's hollow; two small wings along the tip's sides
     (phalaenopsis 3, 27, 29; cymbidium 84: its front a hood, its underside streaked). In volume: lit across (light from the top left), its foot in
     the flower's colour (m0.colB), its underside darker, the cap a lit dome (svorColumn) */
  if(P.col&&!(P.hideB!=null&&B[2][2]<P.hideB)){const q=P.col,a=(q.a+30*(1-c.o2)+28*c.fan)*SVOR_DEG,d0=[0,-Math.sin(a),Math.cos(a)],L=R0*q.L*(.55+.45*show)*(1-.3*c.fan),n=8,C=[],Rr=[],Rt=q.Rt??q.R;
    for(let i=0;i<=n;i++){const s=i/n;C.push(V3.add([q.at[0]*R0,q.at[1]*R0,q.at[2]*R0],V3.add(V3.sc(d0,L*s),[0,-q.bend*L*s*s*.5,0])));
      Rr.push(R0*(q.R+(Rt-q.R)*svSm((s-.15)/.7))*(1-.22*svSm((s-.86)/.14))*(.75+.25*show))}
    const zc=PJ(B,O,C[n>>1])[2],eyF=V3.sc(V3.nz([B[0][2],B[1][2],B[2][2]]),R0*Math.max(q.R,Rt)*1.3);
    /* (its stand-in sheet on its front face, toward the eye: the side lobes' rolled margins, close behind it, never patched over it) */
    out.push({z:zc,zb:R0*(q.zb??.06),proxy:prox((u,v)=>V3.add(V3.add(C[Math.min(n,Math.round(v*n))],eyF),[u*R0*Math.max(q.R,Rt,q.cap),0,0])),fn:k=>svorColumn(k,B,O,R0,q,C,Rr,c,m0,g,cf,lod)})}
  /* (the callus is a lit sheet among the pieces: svorCalS, svorFlower) */
  /* the cirri: two tendrils from the mid-lobe's tip, curling outward (q.dir: their start, radians from straight down; q.curl), tapering, lit along
     one side (phalaenopsis 3, 27) */
  if(P.cir&&mid&&c.o2>.4){const q=P.cir,lines=[];for(const s of[-1,1]){const p0=mid(s*q.u,q.at);let p=p0,th=-Math.PI/2+s*(q.dir??.55);const pl=[PJ(B,O,p)];
      const nc=lod>1?9:4;for(let i=1;i<=nc;i++){th+=s*q.curl*Math.PI/nc*(1-c.fan*.5)*(.6+.8*i/nc);p=V3.add(p,V3.sc([Math.cos(th),Math.sin(th),q.zk??.2],R0*q.L/nc));pl.push(PJ(B,O,p))}lines.push(pl)}
    const cc=cf(m0.cir||m0.mid.st[2][1]),w0=Math.max(.35,R0*q.w);
    out.push({z:lines[0][2][2],proxy:prox((u,v)=>V3.add(mid(u*.3,.9),[0,-v*R0*q.L*.6,0])),fn:k=>{let d='',dh='';for(const pl0 of lines){const pl=pl0.map(s=>[s[0],s[1]]),m=pl.length,Lf=[],Rg=[],H=[];
        for(let i=0;i<m;i++){const a=pl[Math.max(0,i-1)],b=pl[Math.min(m-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,w=w0*.5*(1-.72*i/(m-1));
          Lf.push([pl[i][0]-dy/l*w,pl[i][1]+dx/l*w]);Rg.push([pl[i][0]+dy/l*w,pl[i][1]-dx/l*w]);if(i<m-1)H.push([pl[i][0]-dy/l*w*.35,pl[i][1]+dx/l*w*.35])}
        d+=svSpl(Lf.concat(Rg.reverse()));dh+=svSpl(H,false)}
      E('path',{d,fill:cc,stroke:shd(cc,-.25),'stroke-width':svF(Math.max(.2,w0*.12)),'stroke-opacity':.5},k);if(lod>1&&w0>1.2)E('path',{d:dh,fill:'none',stroke:mix(cc,'#ffffff',.5),'stroke-width':svF(w0*.22),'stroke-opacity':.55,'stroke-linecap':'round'},k)}})}
  /* a spur behind the lip (vanda, angraecum, aerides): a tapering tube backward and down */
  if(P.spur){const q=P.spur,C=[],Rr=[];for(let i=0;i<=6;i++){const s=i/6;C.push([0,(q.at[1]-q.bend*s*s)*R0,(q.at[2]-q.L*s)*R0]);Rr.push(R0*q.R*(1-.6*s))}
    const sc=cf(m0.spur||m0.mid.st[1][1]);out.push({z:PJ(B,O,C[3])[2],proxy:prox((u,v)=>V3.add(C[Math.min(6,Math.round(v*6))],[u*R0*q.R,0,0])),fn:k=>svorTube(k,B,O,C,Rr,[shd(sc,-.2),sc,mix(sc,'#ffffff',.5)],lod,R0)})}
  return out}
/* lod 1: each piece one lit path (its face's colour at mid-length, lit by its normal), then its patterns as one path each, drawn right after it
   (a piece in front covers them); pieces and parts ordered by depth (the inner half of each piece, where the overlaps are) */
/* the lean drawing's fill of a sepal or a petal: a gradient from its foot to its tip (the light baked in), its stops shared by every piece of
   the same colours (one small gradient per piece points it), colours rounded so that they can be shared */
/* colour quantisation for shared gradients: fine steps in the light channels (a coarse step turned a warm white grey, pink or green) */
const svorQ=(c,q=8)=>{if(typeof c!=='string'||c.length!==7)return c;let o='#';for(let i=1;i<7;i+=2){const v=parseInt(c.slice(i,i+2),16),qq=v>190?Math.min(q,4):q;o+=Math.min(255,Math.round(v/qq)*qq).toString(16).padStart(2,'0')}return o};
const SVOR_GR=new WeakMap();
/* the grain's patterns (T.grain), shared by every piece of the same colours and size in one <defs>: two tiles (s x D and 1.618 s x D, the second
   turned 37 degrees) so no period shows; in each, n lit and dn shaded specks of radius r x D (hashed, no draw of the bouquet's chance) */
const SVOR_GRN=new WeakMap();
function svorGrain(D,Gr,lc,dc){const df=GDEF||defs;let M=SVOR_GRN.get(df);if(!M){M=new Map();SVOR_GRN.set(df,M)}const key=[Math.round(D*2),lc,dc,Gr.s,Gr.n,Gr.dn].join('|');
  let ids=M.get(key);if(ids)return ids;ids=[];
  for(const[j,f,rot]of[[0,1,0],[1,1.618,37]]){const s=Gr.s*D*f,r=svRng(911+j*17),id='sgr'+(gid++),pa={id,patternUnits:'userSpaceOnUse',width:svF(s),height:svF(s)};if(rot)pa.patternTransform=`rotate(${rot})`;const pt=E('pattern',pa,df);
    for(const[n,c,op]of[[Gr.n,lc,Gr.op??.5],[Gr.dn||0,dc,Gr.dop??.35]]){if(!n)continue;let d='';for(let q=0;q<n;q++){const x=r()*s,y=r()*s;d+=`M${svF(x)} ${svF(y)}h.01`}
      E('path',{d,fill:'none',stroke:c,'stroke-opacity':op,'stroke-width':svF(Math.max(.05,2*Gr.r*D)),'stroke-linecap':'round'},pt)}
    ids.push(id)}
  M.set(key,ids);return ids}
/* the lean piece's gradient, base to tip: shared by colours and by direction (8 sectors, in the piece's own box), so the spray's many
   pieces reuse a few gradients (budget at DET 1) */
let svorThin=0;
function svorLeanFill(sh,cols,D){const pb=svAt(sh,0,0),pt=svAt(sh,0,.9),dx=pt[0]-pb[0],dy=pt[1]-pb[1];if(svorThin||dx*dx+dy*dy<(D*.05)**2)return cols[1];cols=cols.map(c=>svorQ(c,20));
  const df=GDEF||defs;let M=SVOR_GR.get(df);if(!M){M=new Map();SVOR_GR.set(df,M)}const key=cols.join('');let bid=M.get(key);
  if(!bid){bid='so'+(gid++);const gr=E('linearGradient',{id:bid},df);[[0,cols[0]],[.5,cols[1]],[1,cols[2]]].forEach(([o,c])=>E('stop',{offset:o,'stop-color':c},gr));M.set(key,bid)}
  const sec=((Math.round(Math.atan2(dy,dx)/(Math.PI/4))%8)+8)%8,k2=key+'/'+sec;let id=M.get(k2);
  if(!id){id='so'+(gid++);const a=sec*Math.PI/4,cx=Math.round(Math.cos(a)),cy=Math.round(Math.sin(a)),q=v=>v<0?1:v>0?0:.5;
    E('linearGradient',{id,href:'#'+bid,x1:q(cx),y1:q(cy),x2:1-q(cx),y2:1-q(cy)},df);M.set(k2,id)}return`url(#${id})`}
const svorOk=(sh,u,v,front)=>(front?1:-1)*svLerp(sh,sh.F,u,v)>.02;
/* the convex hull of projected points (monotone chain) */
function svorHull(P){const Q=P.map(p=>[p[0],p[1]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const p of Q){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
  for(let i=Q.length-1;i>=0;i--){const p=Q[i];while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
  lo.pop();up.pop();return lo.concat(up)}
function svorLeanPiece(k,sh,m,D,kind){const nu=sh.nu,nv=sh.nv,W=sh.W,Pp=sh.P,ring=[];
  for(let i=0;i<=nu;i++)ring.push(Pp[i]);for(let j=1;j<=nv;j++)ring.push(Pp[j*W+nu]);for(let i=nu-1;i>=0;i--)ring.push(Pp[nv*W+i]);for(let j=nv-1;j>=1;j--)ring.push(Pp[j*W]);
  /* a cupped piece seen end-on (a bud's sepals, face view) folds its outline over itself into a thin star: its convex hull instead */
  {let A=0;for(let i=0,n=ring.length;i<n;i++){const p=ring[i],q=ring[(i+1)%n];A+=p[0]*q[1]-q[0]*p[1]}const H=svorHull(Pp);let AH=0;for(let i=0,n=H.length;i<n;i++){const p=H[i],q=H[(i+1)%n];AH+=p[0]*q[1]-q[0]*p[1]}
    if(Math.abs(A)<.78*Math.abs(AH)){ring.length=0;for(const p of H)ring.push(p)}}
  /* the simplification follows the piece's own size (a bud's sepals are a fifth of D: at .012 D they turned to shards) */
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const[x,y]of ring){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  const d=svSpl(svSimp(ring,Math.max(.05,Math.min(D*.012,Math.max(x1-x0,y1-y0)*.025))));let fs=0;for(const x of sh.F)fs+=x;const front=fs>=0,q=Math.round(nv*.45)*W+(nu>>1),n0=sh.N[q],n=(sh.F[q]>=0)===front?n0:V3.sc(n0,-1),nf=front?n:V3.sc(n,1),
    K=svLight(front?n:V3.sc(n,1),m,1)/svLight([0,0,1],m,1),base=svorRamp(front?m.stops:m.bstops,.5),sd=front?m.shade:m.bshade,li=front?m.lite:m.blite,
    Kq=Math.round(K*6)/6,pk=kind==='sep'||kind==='pet',tone=c=>svorQ(Kq<1?mix(c,sd,Math.min(.8,(1-Kq)*(pk?1.4:.3))):mix(c,li,Math.min(.6,(Kq-1)*1.3))),col=tone(base),st=front?m.stops:m.bstops;
  /* its edge a shade of itself (never a drawn outline): where it lies over another piece the two read apart at the shop's size (white on white) */
  const lip=kind==='side'||kind==='mid';
  E('path',{d,fill:!LOD&&!lip?svorLeanFill(sh,[tone(svorRamp(st,0)),col,tone(svorRamp(st,1))],D):col,stroke:svorQ(mix(col,sd,lip?.6:.5)),...(lip?{'stroke-opacity':.6}:{})},k);
  /* the side lobes' stripes (the white's red lines on yellow, photographs 3, 29) */
  if(kind==='side'&&m.sdv&&front&&!LOD){let dd='';const sv=m.sdvS||SVOR_SIDEV;for(let i=0;i<sv.u.length;i++){const u=sv.u[i],pl=[];for(let s=0;s<=4;s++){const v=.06+sv.len[i]*s/4;if(svorOk(sh,u*(1-.3*s/4),v,front))pl.push(svAt(sh,u*(1-.3*s/4),v))}if(pl.length>1)dd+=svQuad(pl)}
    if(dd)E('path',{d:dd,fill:'none',stroke:m.sdv,'stroke-width':svF(Math.max(.3,D*sv.w)),'stroke-opacity':sv.op},k)}
  if(LOD||!m.lp)return;const lp=m.lp,ok=(u,v)=>(front?1:-1)*svLerp(sh,sh.F,u,v)>.02,at=(u,v)=>svAt(sh,u,v);
  /* a thin flower (behind the axis or half hidden, svorThin): its pattern lighter (every other blotch and dot, no band, faint veins only) */
  if(!front){if(lp.band&&!svorThin)E('path',{d,fill:'none',stroke:lp.band.c,'stroke-width':svF(D*lp.band.w*.6),'stroke-opacity':lp.band.op*.35},k);return}
  if(lp.eye){const e=lp.eye,L2=[],R2=[];for(let s=0;s<=6;s++){const v=e.v*s/6,hw=e.w*Math.pow(Math.max(0,1-Math.pow(s/6,2.2)),.55)+.02;L2.push(at(-hw,v));R2.push(at(hw,v))}E('path',{d:svSpl(L2.concat(R2.reverse())),fill:e.c,'fill-opacity':e.op*.8},k)}
  if(lp.blob){let dd='',db='',bw=0,bi=0;for(const[u0,v0,rr,ph,bar]of lp.blob.list){if(svorThin&&bi++%2||!ok(u0,v0))continue;
    /* a tiger bar: one stroke across the midrib (three points), not a filled outline (budget) */
    if(bar){const pl=[-1,0,1].map(x=>at(Math.max(-.96,Math.min(.96,u0+x*rr*2)),Math.max(.03,Math.min(.97,v0+rr*.12*Math.sin(ph+x*2.4)-rr*.06*x*x))));db+=svQuad(pl);bw+=rr;continue}const pl=[];for(let s=0;s<7;s++){const a=s/7*6.2832,f=1+.32*Math.sin(3*a+ph)+.14*Math.sin(5*a+2*ph);
      pl.push(at(Math.max(-.97,Math.min(.97,u0+Math.cos(a)*rr*f)),Math.max(.02,Math.min(.98,v0+Math.sin(a)*rr*f*(bar?.1:.55)))))}dd+=svSpl(pl)}if(dd)E('path',{d:dd,fill:lp.blob.c,'fill-opacity':lp.blob.op},k);
    if(db)E('path',{d:db,fill:'none',stroke:lp.blob.c,'stroke-width':svF(D*.15*bw/Math.max(1,lp.blob.list.length)),'stroke-linecap':'round','stroke-opacity':lp.blob.op},k)}
  if(lp.vein&&(lp.vein.op>=.6&&!lp.vein.faint||kind==='pet'&&!svorThin)){let dd='';for(const pl of lp.vein.pl){let run=[];const fl=()=>{if(run.length>1)dd+=svQuad(run);run=[]};for(const[u,v]of pl){if(ok(u,v))run.push(at(u,v));else fl()}fl()}
    if(dd)E('path',{d:dd,fill:'none',stroke:lp.vein.c,'stroke-width':svF(Math.max(.25,D*lp.vein.w)),'stroke-opacity':lp.vein.op},k)}
  if(lp.dot){const P2=[];let di=0;for(const[u,v]of lp.dot.pts)if(!(svorThin&&di++%2)&&ok(u,v))P2.push(at(u,v));if(P2.length)E('path',{d:svDots(P2),fill:'none',stroke:lp.dot.c,'stroke-width':svF(Math.max(.4,D*lp.dot.r)),'stroke-opacity':lp.dot.op},k)}
  if(lp.band&&!svorThin&&(kind==='pet'||lp.own)){const b=lp.band,pl=[],ns=4;for(let s=0;s<=ns;s++)pl.push([-.93,b.v0+(.97-b.v0)*s/ns]);for(let s=1;s<ns;s++)pl.push([-.93+1.86*s/ns,.97]);for(let s=0;s<=ns;s++)pl.push([.93,.97-(.97-b.v0)*s/ns]);
    E('path',{d:svSpl(pl.map(([u,v])=>at(u,v)),false),fill:'none',stroke:b.c,'stroke-width':svF(D*b.w*1.6),'stroke-opacity':b.op,'stroke-linejoin':'round'},k)}}
function svorLean(par,items,parts,D){const k=G(par,{'stroke-width':svF(Math.max(.35,D*.006)),'stroke-opacity':.42,'stroke-linecap':'round'}),all=[];
  for(const it of items){const sh=it.sh;let z=0,n=0;for(let j=0;j<=sh.nv*.5;j++)for(let i=0;i<=sh.nu;i++){z+=sh.Z[j*sh.W+i];n++}all.push({z:z/n+(it.p.zr||0)*D,it})}
  for(const p of parts)all.push({z:p.z,fn:p.fn});all.sort((a,b)=>a.z-b.z);
  for(const a of all){if(a.fn)a.fn(k);else svorLeanPiece(k,a.it.sh,a.it.m,D,a.it.p.kind)}return k}
/* one orchid flower (see the head of this file); lod 2 full (svDraw), 1 lean; null: 2 in the sheets and close-ups (DET >= 1.5), else the
   sheet's S.lod (2: the shop drawn in full detail too, the weight no longer a limit), else 1 */
function svorFlower(par,B,O,D,S,cwx,op,seed,wl,lod){const P=svorSpec(S),g=P.genes(seed),m0=P.mat(cwx),R0=D/2;wl=wl||0;if(lod==null)lod=DET>=1.5?2:(S.lod||1);
  const o2=svSm((op+(g.op||0)-P.open[0])/P.open[1]),bud=1-svSm((op-P.bud[0])/P.bud[1]),dec=svSm((wl-P.dec[0])/P.dec[1]),fan=svSm((wl-P.fan[0])/P.fan[1]);
  /* the faded flower hangs a little more on its pedicel (P.tip [decline, faded], radians, toward the ground) */
  if(P.tip){const tip=P.tip[0]*dec+P.tip[1]*fan,ax=V3.cr(B[2],[0,-1,0]),al=V3l(ax);if(tip>0&&al>.05){const A=V3.sc(ax,1/al);B=B.map(r=>rotA(r,A,tip))}}
  const blast=bud>.5&&wl>0&&P.blast?svSm((wl-.15)/.6):0,dn=[0,-1,0],dnL=V3.nz([V3.dot(B[0],dn),V3.dot(B[1],dn),V3.dot(B[2],dn)]),Hb=R0*(P.budS[0]+P.budS[1]*svSm(op/P.budS[2]))*(1-.28*blast),Rb=Hb*P.budR*(1-.12*blast),
    c={R0,lod,o2,bud,dec,fan,op,dnL,Hb,Rb,budTip:P.budTip||0,budPt:P.budPt||0,zc:Hb/2-R0*P.budZ,close:P.wClose[0]*dec+P.wClose[1]*fan,limp:P.wLimp[0]*dec+P.wLimp[1]*fan,fold:((P.wFold||[0,0])[0]*dec+(P.wFold||[0,0])[1]*fan)*SVOR_DEG,crk:P.wCrk[0]*dec+P.wCrk[1]*fan,
      wav:P.wWav[0]*dec+P.wWav[1]*fan,shrink:P.wShrink[0]*dec+P.wShrink[1]*fan,gt:P.green[0]*(1-svSm((op-P.green[1])/P.green[2]))*(1-blast),wc:P.wCol[0]*dec+P.wCol[1]*fan,bwr:.09*blast},
    wf=blast>0?(y,w)=>{let z=P.wilt?P.wilt(y,w):y;z=mix(z,P.blast[0],Math.min(1,blast*1.15));if(blast>.45)z=mix(z,P.blast[1],(blast-.45)*1.1);return z}:P.wilt||null,items=[],det=DET>=1.5?1.3:1;let mid=null;
  /* the occlusion toward each piece's foot: P.ao [front depth, front length, back depth, back length]; p.aoU [depth, from, sign]: a piece's own occlusion
     across, deepening toward its half u·side·sign > 0 from u·side·sign = from (a side lobe of a cymbidium's lip darker toward the column it wraps, 84); none by default */const AO=P.ao||[.4,.32,.18,.3];
  P.list.forEach((p,i)=>{if(bud>(P.innerBud??.82)&&p.inner)return;/* the lip stays folded inside until the sepals have parted (a splitting bud shows its petals, not its lip: kept 22, 24) */if(bud>(P.lipBud??.5)&&(p.kind==='side'||p.kind==='mid'))return;const t=g.pc[i%g.pc.length],Sf=svorPiece(p,p.budLag?Object.assign({},c,{bud:Math.max(c.bud,1-svSm((c.op-P.bud[0]-p.budLag)/P.bud[1]))}):c,t),m=svorMatOf(P,m0,p.kind,c,g,t,wf,p.mat);if(p.kind==='mid')mid=Sf;
    const sh=svSheet(B,O,Sf,lod>1?{nu:Math.round(P.nu[dec>.2?1:0]*det),nv:Math.round(P.nv*det),mat:m,zb:R0*.002*(p.rank||0),
      ao:p.aoU?(u,v,front)=>(front?1-AO[0]*(1-svSm(v/AO[1])):1-AO[2]*(1-svSm(v/AO[3])))*(1-p.aoU[0]*svSm((u*p.side*(p.aoU[2]??1)-p.aoU[1])/(1-p.aoU[1]))):(u,v,front)=>front?1-AO[0]*(1-svSm(v/AO[1])):1-AO[2]*(1-svSm(v/AO[3]))}:{nu:4,nv:6,mat:m});items.push({sh,m,p})});
  /* the callus: one lit cushion per ridge (svorCalS), spotted (m0.dot) as the sheet's own pattern; shown once the lip is out */
  /* (P.hideB: seen from behind, the flower's axis z under it, the callus and the column are behind the lip and the petals: not drawn; null by default) */
  const hid=P.hideB!=null&&B[2][2]<P.hideB;
  if(P.cal&&c.o2>.25&&bud<.5&&m0.cal&&!hid){const q=P.cal,lipC=m0.mid.st[1][1],cal=m0.cal,cfx=x=>{let y=svShift(x,g.dh||0,g.ds||0,g.dl||0);if(c.wc>0&&wf)y=wf(y,c.wc);return y},
      cst=[[0,cfx(mix(cal,lipC,q.foot??.45))],[q.footV??.3,cfx(cal)],[.8,cfx(cal)],[1,cfx(mix(cal,'#fff4c8',q.topL??.3))]],csd=cfx(mix(cal,q.shC||'#3a1806',q.shK??.5)),
      m=Object.assign({stops:cst,bstops:cst,shade:csd,lite:'#fff8e0',bshade:csd,blite:'#fff8e0',rim:cfx(shd(cal,-.15)),cast:m0.cast||'#2a1830'},P.light,{rw:.003,ro:.35}),
      nr=q.n||1,dr=svRng((g.sd||1)+5),pts=[],dw=q.dw||.006,dc=m0.dot?cfx(m0.dot):null;
    if(dc&&q.dots)for(let i=0;i<q.dots*(lod>1?1:.5);i++)pts.push([dr.in(-.8,.8),dr.in(.1,.95)]);
    if(pts.length){const sets=[[pts.map(p=>q.dl?[p,[p[0]+.004,p[1]+q.dl*(.6+.8*Math.abs(Math.sin(p[0]*37+p[1]*11)))]]:[p,[p[0]+.02,p[1]+.01]]),dw,dc,q.dop??.9]];/* (q.dl: the dots drawn as short streaks along the callus, its tiger stripes, phalaenopsis 27) */
      /* (q.mot [n, width x dw, opacity, longest]: a second set of fat short blots of uneven size, its red mottling; q.fur [opacity, width x dw]: its median furrow
         down from the fork, darker (phalaenopsis 27: an orange crest freckled and streaked with red, not tidy dashes); none by default) */
      if(q.mot){const bp=[];for(let i=0;i<q.mot[0]*(lod>1?1:.5);i++){const u=dr.in(-.95,.95),v=dr.in(.04,.94),l=dr.in(.012,q.mot[3]||.05);bp.push([[u,v],[u+dr.in(-.025,.025),v+l]])}sets.push([bp,dw*q.mot[1],dc,q.mot[2]])}
      if(q.fur)sets.push([[[[0,.03],[0,.5],[0,.97]]],dw*q.fur[1],dc,q.fur[0]]);
      m.veins=(sh,front)=>front?sets:[];m.lp={dot:{pts,c:dc,r:dw,op:.9}}}
    for(let r=0;r<nr;r++){const Sf=svorCalS(q,c,R0,(r-(nr-1)/2)*(q.gap||0)*R0),gn=q.gn||[8,8],sh=svSheet(B,O,Sf,lod>1?{nu:gn[0],nv:gn[1],mat:m,zb:R0*.004*8}:{nu:4,nv:4,mat:m});items.push({sh,m,p:{kind:'cal',rank:8}})}}
  const parts=svorParts(P,B,O,c,m0,g,wf,lod,mid?(u,v)=>mid(u,v):null);
  if(lod>1)return svDraw(par,items.map(it=>it.sh).concat(parts.map(q=>({fn:q.fn,proxy:q.proxy,zb:q.zb}))),Object.assign({D,pmin:P.pmin},P.cast||{}));
  return svorLean(par,items,parts,D)}
/* a stem cut square at its first point (the vase's cut, or the bouquet's stem going on below it at the same width and colour): svStemLine's
   closed outline would round its end; it is drawn on past the cut and clipped there */
function svorAxisCut(par,C,W,c){const u0=[C[1][0]-C[0][0],C[1][1]-C[0][1]],l=Math.hypot(u0[0],u0[1])||1,u=[u0[0]/l,u0[1]/l],nn=[-u[1],u[0]],p=C[0],e=W[0]*1.5,B=1e5,
    id='svoc'+(gid++),cp=E('clipPath',{id},GDEF||defs),q=(a,b)=>svF(p[0]+nn[0]*a+u[0]*b)+','+svF(p[1]+nn[1]*a+u[1]*b);
  E('path',{d:'M'+q(B,0)+'L'+q(-B,0)+'L'+q(-B,B)+'L'+q(B,B)+'Z'},cp);
  const g=G(par,{'clip-path':`url(#${id})`});svStemLine(g,[[p[0]-u[0]*e,p[1]-u[1]*e]].concat(C),[W[0]].concat(W),c);return g}
/* ---------- the scape (inflorescence), generic: a raceme of zygomorphic flowers ----------
   Settings S.scape over SVOR_SCAPE (lengths x D, the flower's span): n flowers [min, max] and nb buds; li the internode between flowers
   (shortening toward the tip by liK), lb the buds' [first, last]; one wide arch (kept 12, 25, 32, 40; fane-inat 3, 14, 15): the peduncle's top
   share pedLF leans by lean (degrees, [min, max]) into it, the rachis turns on by arc (degrees) at a curvature growing from curv to 2 - curv
   of its mean, tangent and curvature continuous at the joint; the flowers spread along the whole arch; kink (degrees) the small breaks at
   the nodes, alternately; ped / pedB the pedicel (with the ovary) of a flower / a bud, its width pw [foot, ovary]; grade (the
   last flower's size below the first); budOp [first bud, tip bud] (op of the buds); open law: flower i (t from 0 at the foot to 1) opens at
   (op - span·t) / (1 - span), the young ones big buds (op0); the wilt: w_i = wl·wK - wS·t ± wJ, the flower dropping when w_i > fall (its pedicel
   left, yellowed); sw / swTip the axis' width (x D) at the foot and its tip share; pnodes the peduncle's nodes and their sheathing bracts
   (count, [from, to] along it, bract length), fb the floral bract at each pedicel; lb0 the first bud's gap after the last flower (x lb[0]); stem colours (S.mat(cwx).stem or scape.stem). */
const SVOR_SCAPE={n:[5,9],nb:[2,4],li:[.6,.7],liK:.25,lb:[.2,.11],arc:[105,130],lean:[14,22],pedLF:.5,curv:.65,kink:7,ped:.48,pedB:.17,pw:[.022,.03],grade:.18,budOp:[.2,.04],
  span:.6,op0:.2,wK:1.75,wS:.75,wJ:.08,fall:1.06,sw:.05,swTip:.5,pnodes:[2,[.25,.8],.085],fb:.04,face:.62,alt:.28,hang:[.4,.75],droop:.9,
  stem:['#26341a','#4a6232','#7c9658','#c4d4a0'],bract:'#8a9258',dry:'#a8925a',
  hn:[4,6],hnb:[2,3],harc:.7,hfl:.48,hsk:.3};
/* (a sort's sheet may add, for the whole scape only (not a bouquet's head): pD the flower's size over the old drawing's D, pli the internodes,
   parc its arch (degrees) and pcurv its curvature's start) */
function svorScape(par,S,cwx,op,seed,wl,o){const P=svorSpec(S),Q=Object.assign({},SVOR_SCAPE,S.scape||{}),D=o.D,D0=D,r=svRng(seed),m0=P.mat(cwx),
    head=!!o.room,QN=head?Q.hn:Q.n,QB=head?Q.hnb:Q.nb,nf=Math.round(r.in(QN[0]-.49,QN[1]+.49)),nb=Math.round(r.in(QB[0]-.49,QB[1]+.49)),arc=(t=>r.in(t[0],t[1]))(head?Q.arc:(Q.parc||Q.arc))*SVOR_DEG*(head?Q.harc:1),cv=head?Q.curv:(Q.pcurv??Q.curv),li=(t=>r.in(t[0],t[1]))(head?Q.li:(Q.pli||Q.li))*D,lod=o.lod??(DET>=1.5?2:(S.lod||1)),fine=DET>=1.5||lod>1,
    up=V3.nz(o.up||[0,1,0]),
    /* (Q.faceE / Q.faceEH: the spray's face pulled toward the eye by that share, its arch turned broadside with it; for the whole scape / a
       bouquet's head, 0 by default: c7, a spray set facing the room shows its arch side-on and its flowers nearly to the front) */
    fE=head?Q.faceEH||0:Q.faceE||0,face=(f0=>fE?V3.nz(V3.add(V3.sc(f0,1-fE),[0,0,fE])):f0)(V3.nz(o.face||[0,0,1])),
    sv=V3.nz(V3.add((s0=>{if(!fE)return s0;const c2=V3.cr(face,up);return V3.sc(V3.nz(c2),(Math.sign(V3.dot(s0,c2))||1)*V3l(s0))})(o.sideV||[1,0,0]),V3.sc(face,.2))),I3=[[1,0,0],[0,1,0],[0,0,1]],O0=[0,0,0],k=G(par),
    stc=(m0.stem||Q.stem),wd=svSm((wl-.45)/.5);
  /* the peduncle: given (view points from the cut), else straight up */
  /* (head: the old peduncle and raceme, raw turtle points with a turn at their joint, smoothed as one line; its foot and first direction kept) */
  if(head&&o.ped&&o.rach&&o.rach.length>1){const n0=o.ped.length,L=o.ped.concat(o.rach.slice(1)),uN=L.length>2?V3.nz(V3s(L[2],L[0])):null;for(let it=0;it<6;it++){const M=L.map(q=>q.slice());for(let i=2;i<L.length-1;i++)L[i]=V3.add(V3.sc(M[i],.5),V3.sc(V3.add(M[i-1],M[i+1]),.25));}
    /* (the bouquet's stem arrives along the old chain's first two segments: lsNeck) */
    if(uN)L[1]=V3.add(L[0],V3.sc(uN,V3l(V3s(L[1],L[0]))));
    o.ped=L.slice(0,n0);o.rach=L.slice(n0-1)}
  let ped=o.ped;if(!ped){ped=[];const L0=(Q.pedL||1.2)*D;for(let i=0;i<=8;i++)ped.push(V3.add(o.base||[0,0,0],V3.sc(up,L0*i/8)))}
  /* the rachis: it leaves the peduncle along its last direction and turns over toward the side (most near its foot), a slight zigzag at the nodes */
  /* the given peduncle (the old drawing's, its top already turning) is kept by its foot, its first direction and its length: straight, then leaning */
  if(!head){let Lg=0;for(let i=1;i<ped.length;i++)Lg+=V3l(V3s(ped[i],ped[i-1]));let j=1,a=0;while(j<ped.length-1&&a+V3l(V3s(ped[j],ped[j-1]))<Lg*.3){a+=V3l(V3s(ped[j],ped[j-1]));j++}
    const u0=V3.nz(V3s(ped[j],ped[0])),s0=Lg*(1-Q.pedLF),m=Math.max(6,Math.round((Lg-s0)/(D*(fine?.08:.13)))),p0=ped[0];ped=[];
    for(let i=0;i<4;i++)ped.push(V3.add(p0,V3.sc(u0,s0*i/4)));for(let i=0;i<=m;i++)ped.push(V3.add(p0,V3.sc(u0,s0+(Lg-s0)*i/m)))}
  const ped0=ped,np0=ped0.length,pedA=[0];for(let i=1;i<np0;i++)pedA.push(pedA[i-1]+V3l(V3s(ped0[i],ped0[i-1])));const pedLen=pedA[np0-1],
    d00=V3.nz(V3s(ped0[np0-1],ped0[np0-2])),A=(()=>{if(head&&o.rach&&o.rach.length>1){const c=V3.nz(V3s(o.rach[o.rach.length-1],o.rach[0])),a=V3.cr(d00,c);if(V3l(a)>.15)return V3.nz(a)}return V3.nz(V3.cr(d00,sv))})(),lean=r.in(Q.lean[0],Q.lean[1])*SVOR_DEG,nodes=[];let Lr=li*.3,d0=d00;
  /* the peduncle's top leans into the arch: theta(u) a cubic, 0 and flat at its start, lean at its end with the rachis' first curvature kap */
  const bendPed=(ln,kap)=>{const s0=pedLen*(1-Q.pedLF),Lp=pedLen-s0,out=[ped0[0]];let p=ped0[0];
    for(let i=1;i<np0;i++){const v=V3s(ped0[i],ped0[i-1]),u=Math.max(0,((pedA[i]+pedA[i-1])/2-s0)/Lp),th=u>0?ln*(3*u*u-2*u*u*u)+kap*Lp*(u*u*u-u*u):0;p=V3.add(p,th?rotA(v,A,th):v);out.push(p)}return out};
  for(let i=0;i<nf;i++){nodes.push({s:Lr,i,fl:1,t:nf>1?i/(nf-1):0});Lr+=li*(1-Q.liK*i/Math.max(1,nf-1))*r.in(.9,1.1)}
  for(let j=0;j<nb;j++){Lr+=D*svorL(Q.lb,nb>1?j/(nb-1):0)*(j?1:(Q.lb0??.8));nodes.push({s:Lr,i:nf+j,fl:0,j})}Lr+=D*Q.lb[1]*.8;
  const ns=Math.max(12,Math.round(Lr/(D*(fine?.06:.14))));let C,T,atS,fl;
  /* in a bouquet (head) the rachis is the old drawing's raceme (o.rach, from the peduncle's top: inside the old box), resampled; the nodes spread on it */
  let RA=null,RT=null;if(head&&o.rach&&o.rach.length>1){const ra=o.rach,ac=[0];for(let i=1;i<ra.length;i++)ac.push(ac[i-1]+V3l(V3s(ra[i],ra[i-1])));const Lh=Math.max(ac[ac.length-1],D*.2);RA=[];RT=[];
    for(let q=0;q<=ns;q++){const x=Lh*q/ns;let j=1;while(j<ra.length-1&&ac[j]<x)j++;const f2=Math.max(0,Math.min(1,(x-ac[j-1])/((ac[j]-ac[j-1])||1)));RA.push(V3.add(ra[j-1],V3.sc(V3s(ra[j],ra[j-1]),f2)))}
    for(let q=0;q<=ns;q++)RT.push(V3.nz(V3s(RA[Math.min(ns,q+1)],RA[Math.max(0,q-1)])));for(const nd of nodes)nd.s*=Lh/Lr;Lr=Lh}
  const lay=(arc,sK=1,dK=1,lk=1)=>{ped=head?ped0:bendPed(lean*lk,arc*cv/(Lr*sK));d0=V3.nz(V3s(ped[np0-1],ped[np0-2]));C=[ped[np0-1]];T=[d0];let p=C[0];
  if(RA){C=RA.slice();T=RT.slice()}else for(let q=1;q<=ns;q++){const s=q/ns,sl=s*Lr;let kz=0;for(const nd of nodes)if(nd.fl&&nd.s>0)kz+=(nd.i%2?1:-1)*svSm((sl-nd.s)/(D0*.04)+.5);
    const th=arc*(cv*s+(1-cv)*s*s)+Q.kink*SVOR_DEG*kz,d=V3.nz(rotA(d0,A,th));p=V3.add(p,V3.sc(d,Lr*sK/ns));C.push(p);T.push(d)}
  atS=s=>{const x=Math.max(0,Math.min(1,s/Lr))*ns,j=Math.min(ns-1,Math.floor(x)),f2=x-j;return[V3.add(V3.sc(C[j],1-f2),V3.sc(C[j+1],f2)),V3.nz(V3.add(V3.sc(T[j],1-f2),V3.sc(T[j+1],f2)))]};
  /* each node: its flower (or bud) on its pedicel, facing the side of the spray; the alternate ones a little before and behind */
  /* (Q.altN / Q.altNH: the pedicels leaving the rachis alternately on its two sides in the arch's plane, the flowers a little above and below
     its line, as seen from the front (c7); for the whole scape / a bouquet's head; 0 by default) */
  /* (Q.pedT: the pedicel's lean up the rachis, .12 by default; cymbidium c28: about 45° from it) */
  /* Q.back [share, t from, t to] (none by default): that share of the flowers, among those between t from and t to along the rachis, turned away
     on the far side of the rachis, their backs seen (a spray seen from the front shows 3 or 4 of them where it crests: phalaenopsis c7); Q.backH
     the same share in a bouquet's head (0 by default). Chosen by the scape's hash, never the bouquet's chance */
  const bkS=new Set();if(Q.back){const sh=head?(Q.backH||0):Q.back[0],el=nodes.filter(nd=>nd.fl&&nd.t>=Q.back[1]&&nd.t<=Q.back[2]).sort((a,b)=>pxHashS(a.i,15,seed)-pxHashS(b.i,15,seed)),nB=Math.round(sh*nf);
    for(const nd of el.slice(0,nB))bkS.add(nd.i)}
  const fF=face;
  fl=[];for(const nd of nodes){const[q,t]=atS(nd.s),D=D0*dK,nIn=V3.nz(V3.cr(t,A)),alt=nd.i%2?1:-1,hs=pxHashS(nd.i,3,seed),bk=bkS.has(nd.i);
    if(nd.fl){const sz=1-Q.grade*nd.t,Df=D*sz*(.96+.08*pxHashS(nd.i,9,seed)),oi=svSm((op-Q.span*nd.t)/(1-Q.span)),opF=oi>0?Q.op0+(1-Q.op0)*oi:Q.op0*svSm(op/.12+.4),
        wi=wl>0?wl*Q.wK-Q.wS*nd.t+Q.wJ*(hs*2-1):0,pd=V3.nz(V3.add(V3.add(V3.sc(nIn,Q.hang[0]*(bk?.5:1)),V3.sc(fF,bk?-Q.face*.7:Q.face)),V3.add(V3.add(V3.sc(A,alt*Q.alt),V3.sc(t,Q.pedT??.12)),V3.add([0,-Q.hang[1]*(bk?.6:1),0],V3.sc(nIn,alt*(head?Q.altNH||0:Q.altN||0)))))),
        pl=D*Q.ped*(.8+.2*sz)*(oi>0?1:.75),dr=Q.droop*svSm((wi-.3)/.55),pd2=dr>0?V3.nz(V3.add(pd,[0,-dr,0])):pd,cen=V3.add(q,V3.sc(pd2,pl));
      fl.push({q,t,pd:pd2,dr,pl,cen,D:Df,op:opF,wl:Math.max(0,Math.min(1,wi)),gone:wi>Q.fall,w:wi,i:nd.i,bud:opF<.3,back:bk&&opF>=.3})}
    else{const tb=nb>1?nd.j/(nb-1):1,ob=svorL(Q.budOp,tb)*(.55+.45*svSm(op/.5)),pd=V3.nz(V3.add(V3.add(V3.sc(nIn,.6),V3.sc(fF,.45)),V3.add(V3.sc(A,alt*.25),V3.sc(t,.35)))),
        pl=D*Q.pedB*(1-.4*tb),wb=wl>0?svSm((wl-.3)/.5)*(.6+.4*tb):0;fl.push({q,t,pd,pl,cen:V3.add(q,V3.sc(pd,pl)),D:D*(1-Q.grade),op:ob,wl:wb,gone:false,w:wb,i:nd.i,bud:true,tb})}}
  /* (head: each flower kept inside the old box by its reach, its pedicel going to it from its node) */
  if(head)for(const f of fl){const[x0,x1,y0,y1]=o.room,rr=f.D*(f.op<.3?.25:.55),cl=(v,a,b)=>a>b?(a+b)/2:Math.max(a,Math.min(b,v)),c=[cl(f.cen[0],x0+rr,x1-rr),cl(f.cen[1],y0+rr,y1-rr),f.cen[2]],v=V3s(c,f.q),l=V3l(v);
    if(l>1e-6){f.cen=c;f.pd=V3.sc(v,1/l);f.pl=l}}
  /* the flower's frame: its axis toward the spray's face, a little along its pedicel; its top toward the sky */
  for(const f of fl){let Z=V3.nz(V3.add(V3.sc(fF,f.tb!=null?.4:f.op<.3?.6:.85),V3.add(V3.sc(f.pd,f.tb!=null?1:f.op<.3?.7:.35),[(pxHashS(f.i,5,seed)-.5)*.16,(pxHashS(f.i,6,seed)-.5)*.12,0])));
    /* each flower's own turn (Q.yaw [min, max] degrees, alternate sides; Q.prof the share turned nearly into profile; Q.pitch degrees face-down
       where the rachis descends, ± pitchJ; Q.rollK the top leaning back toward the arch where it descends, ± rollJ): a real arching spray shows
       its flowers in three-quarter view either way, some near profile, tilted along the arch (phalaenopsis c7, c3, c6). From the scape's hash
       (never the bouquet's chance); none by default */
    const alt=f.i%2?1:-1,hY=pxHashS(f.i,11,seed),hP=pxHashS(f.i,12,seed),hT=pxHashS(f.i,13,seed),hR=pxHashS(f.i,14,seed),dsc=Math.max(0,-f.t[1]);
    if(Q.yaw&&f.tb==null){const yw=(hP<(Q.prof||0)?Q.yawP||62:Q.yaw[0]+(Q.yaw[1]-Q.yaw[0])*hY)*alt*(f.op<.3?.6:1);
      /* (Q.yawAbs, whole scape only: the yaw taken from the eye's line, not added to the flower's own turn, so the flowers turn either way about the
         front: c7; off by default) */
      if(Q.yawAbs&&!head){const hy=Math.hypot(Z[0],Z[2]),a=yw*SVOR_DEG;Z=V3.nz([Math.sin(a)*hy,Z[1],Math.cos(a)*hy])}else Z=V3.nz(rotA(Z,[0,1,0],yw*SVOR_DEG))}
    if((Q.pitch||Q.pitchJ)&&f.tb==null){const pa=((Q.pitch||0)*dsc+(Q.pitchJ||0)*(hT*2-1))*SVOR_DEG,ax=V3.cr([0,1,0],Z);if(V3l(ax)>.05)Z=V3.nz(rotA(Z,V3.nz(ax),pa))}
    if(f.back)Z=V3.nz(rotA(Z,[0,1,0],Math.PI*(1-.12*alt)));
    /* Q.zMax (degrees): the flower's axis kept within it of the eye's line (the view's z: toward the eye, or away from it for a flower seen from
       behind): a flower near profile, never wholly edge-on (its pieces would read as thorns) */
    if(Q.zMax){const F=[0,0,Z[2]>=0?1:-1],cz=V3.dot(Z,F),cm=Math.cos(Q.zMax*SVOR_DEG);if(cz<cm){const pr=V3s(Z,V3.sc(F,cz)),pl=V3l(pr);if(pl>1e-4)Z=V3.nz(V3.add(V3.sc(F,cm),V3.sc(pr,Math.sqrt(1-cm*cm)/pl)))}}
    let Y=V3s([0,1,0],V3.sc(Z,Z[1]));if(V3l(Y)<1e-3)Y=V3s(f.t,V3.sc(Z,V3.dot(f.t,Z)));Y=V3.nz(Y);const rl=(pxHashS(f.i,7,seed)-.5)*.2+((Q.rollK||0)*dsc*Math.sign(f.t[0])+(Q.rollJ||0)*(hR*2-1))*SVOR_DEG,X0=V3.cr(Y,Z),c2=Math.cos(rl),s2=Math.sin(rl);
    f.B=[V3.add(V3.sc(X0,c2),V3.sc(Y,s2)),V3.add(V3.sc(Y,c2),V3.sc(X0,-s2)),Z];f.z=f.cen[2];f.front=f.cen[2]>=f.q[2]-D0*.02}};
  /* in a bouquet the head is the scape's flowering top only (o.room [x0,x1,y0,y1], view: the old drawing's box, so the composition does not move):
     hn open flowers and hnb buds on a short arch (harc of the full one) leaving the old peduncle's top along the old raceme. The flowers are sized
     like the old cluster's (a flower's span hfl of the room's longer side, never above D), then the rachis shortened (the flowers closer, more
     overlapped) and its arch lessened until the head keeps within the room; only then the flowers made smaller. The bouquet's stem, in the
     scape's colours, is the rest of the scape. A flower counts by its reach (.55 D), a bud by .25 D. */
  if(head){const[x0,x1,y0,y1]=o.room,fits=()=>{let l=1e9,h=-1e9,lo=1e9,hi=-1e9;for(const q of C){l=Math.min(l,q[0]);h=Math.max(h,q[0]);lo=Math.min(lo,q[1]);hi=Math.max(hi,q[1])}
      for(const f of fl)if(!f.gone){const rr=f.D*(f.op<.3?.25:.55);l=Math.min(l,f.cen[0]-rr);h=Math.max(h,f.cen[0]+rr);lo=Math.min(lo,f.cen[1]-rr);hi=Math.max(hi,f.cen[1]+rr)}
      return l>=x0&&h<=x1&&lo>=y0&&hi<=y1};
    let dK=o.fitK||Math.min(Q.hfl*Math.max(x1-x0,y1-y0),.92*Math.min(x1-x0,y1-y0),1.1*D0)/(1.1*D0);lay(arc,1,dK);for(let it=0;it<40&&!fits();it++){dK*=.95;lay(arc,1,dK)}o.fitG=dK}
  else lay(arc);
  if(typeof window!=='undefined'&&window.SVOR_DBGL)window.SVOR_DBGL.push({face:face.map(x=>+x.toFixed(2)),A:A.map(x=>+x.toFixed(2))},fl.map(f=>({i:f.i,t:+(f.t[0]).toFixed(2),bk:f.back?1:0,fr:f.front?1:0,op:+f.op.toFixed(2),Z:f.B[2].map(x=>+x.toFixed(2)),c:[Math.round(f.cen[0]),Math.round(-f.cen[1]),Math.round(f.cen[2])]})));
  /* the pedicels: tapered, lit; yellowing as their flower fades, a stub when it has dropped */
  const pedCol=f=>{const y=svSm((f.w-.5)/.45);let c0=mix(stc[1],m0.ped||stc[2],.35);if(y>0)c0=mix(c0,'#c8b04a',y*.85);if(f.gone)c0=mix(c0,'#a8884a',.6);return c0};
  const pedPath=f=>{const L=f.gone?f.pl*.22:f.pl,e=V3.add(f.q,V3.sc(f.pd,L)),dr=f.dr||0,m=V3.add(V3.add(V3.add(f.q,V3.sc(f.pd,L*.42)),V3.sc(f.t,L*(f.gone?.1:.26)*(1-dr))),[0,-L*.12*dr,0]),w0=D*Q.pw[0]*(f.bud&&!f.op?1:1),w1=D*(f.bud?Q.pw[0]:Q.pw[1]);
    const P3=[f.q,m,f.gone?e:V3.add(e,V3.sc(f.B[2],-D*.02))],L2=[],R2=[];for(let i=0;i<=6;i++){const s=i/6,a=(1-s)*(1-s),b=2*s*(1-s),cc=s*s,pt=[0,1,2].map(x=>a*P3[0][x]+b*P3[1][x]+cc*P3[2][x]),
      tg=V3.nz([0,1,2].map(x=>2*(1-s)*(P3[1][x]-P3[0][x])+2*s*(P3[2][x]-P3[1][x]))),n2=V3.nz([-tg[1],tg[0],0]),w=(w0+(w1-w0)*svSm(s))/2;L2.push([pt[0]+n2[0]*w,-(pt[1]+n2[1]*w)]);R2.push([pt[0]-n2[0]*w,-(pt[1]-n2[1]*w)])}
    return svSpl(L2.concat(R2.reverse()))};
  const drawPed=(g2,f)=>{const c0=pedCol(f);E('path',{d:pedPath(f),fill:c0},g2)};
  const W0=typeof WILT!=='undefined'?WILT:null;
  try{if(W0)WILT=null;
  /* the axis: the peduncle (into o.ext, the bouquet's stems layer, when given) and the rachis, one lit cylinder each; swollen nodes */
  const stCols=stc.slice();stCols.sv={swell:.03,gloss:.45};
  const pn=Q.pnodes,pnS=[];if(!head)for(let i=0;i<pn[0];i++)pnS.push(pedLen*(pn[1][0]+(pn[1][1]-pn[1][0])*(pn[0]>1?i/(pn[0]-1):.5)));
  const swAt=(s,base)=>{let w=base;for(const x of pnS)if(Math.abs(s-x)<D*.03)w*=1+.16*(1-Math.abs(s-x)/(D*.03));return w};
  /* (the axis is the bouquet's stem going on: the same colours, the same width at the joint (o.pw0), the bouquet's wilt; cut square at its foot) */
  const pw0=o.pw0||D*Q.sw*1.35,axis=fn=>{if(o.defer)return fn(k);WILT=W0;try{fn(k)}finally{WILT=null}};
  {const Cs=[],Wd=[],wAt=s=>swAt(s,pw0+(D*Q.sw-pw0)*Math.pow(Math.min(1,s/pedLen),.7));let acc=0;
    if(fine)ped.forEach((x,i)=>{if(i)acc+=V3l(V3s(x,ped[i-1]));Cs.push([x[0],-x[1]]);Wd.push(wAt(acc))});
    else{/* at DET 1: resampled sparse (a gentle curve, a spline through it), a point on each node and either side of it (its swelling) */
      const A2=[0];for(let i=1;i<ped.length;i++)A2.push(A2[i-1]+V3l(V3s(ped[i],ped[i-1])));const La=A2[A2.length-1],nU=Math.max(4,Math.round(La/(D*.4))),tg=[];
      for(let i=0;i<=nU;i++)tg.push(La*i/nU);for(const x of pnS)tg.push(x-D*.03,x,x+D*.03);tg.sort((a,b)=>a-b);const tq=[];for(const x of tg)if(x>=0&&x<=La&&(!tq.length||x-tq[tq.length-1]>D*.012))tq.push(x);
      if(tq[tq.length-1]<La)tq[tq.length-1]=La;let j=1;for(const x of tq){while(j<A2.length-1&&A2[j]<x)j++;const f=(x-A2[j-1])/((A2[j]-A2[j-1])||1),q=V3.add(ped[j-1],V3.sc(V3s(ped[j],ped[j-1]),Math.max(0,Math.min(1,f))));Cs.push([q[0],-q[1]]);Wd.push(wAt(x))}}
    if(o.defer)o.defer(p2=>svorAxisCut(p2,Cs,Wd,stCols));else axis(()=>svorAxisCut(k,Cs,Wd,stCols))}
  /* the flowers behind the axis first (each over its own pedicel: it faces us, its pedicel holds it from behind), then the axis, its bracts, then the flowers in front (their pedicels under them) */
  const back=fl.filter(f=>!f.front).sort((a,b)=>a.z-b.z),fr=fl.filter(f=>f.front).sort((a,b)=>a.z-b.z),put=f=>{if(f.gone)return;const ss=svSeed('svor',seed,f.i);
    svorThin=lod<2&&(f.thin||!f.front)?1:0;try{svorFlower(k,f.B,f.cen,f.D,S,cwx,f.op,ss,f.wl,lod)}finally{svorThin=0}};
  /* (at DET 1 the flowers behind the axis or half hidden by a nearer flower are drawn thin: flat pieces, no faint veins, their patterns kept) */
  {const ord=back.concat(fr).filter(f=>!f.gone);ord.forEach((f,i)=>{if(f.op<.3)return;for(let j=i+1;j<ord.length;j++){const g2=ord[j];if(g2.op<.3)continue;
    if(Math.hypot(f.cen[0]-g2.cen[0],f.cen[1]-g2.cen[1])<.42*(f.D+g2.D)){f.thin=1;break}}})}
  for(const f of back){drawPed(k,f);put(f)}
  {const Cs=[],Wd=[];for(let q=0;q<=ns;q++){const s=q/ns*Lr;let w=D*Q.sw*(1-(1-Q.swTip)*Math.pow(q/ns,.8));for(const nd of nodes)if(Math.abs(s-nd.s)<D*.025)w*=1+.12*(1-Math.abs(s-nd.s)/(D*.025));Cs.push([C[q][0],-C[q][1]]);Wd.push(w)}axis(()=>svStemLine(k,Cs,Wd,stCols))}
  /* the bracts: sheaths clasping the peduncle's nodes, a small scale under each pedicel */
  {let dd='';const sc=(q,t,len,w,side)=>{const n2=V3.nz([-t[1],t[0],0]),b0=V3.add(q,V3.sc(n2,side*w*.5)),tip=V3.add(V3.add(q,V3.sc(t,len)),V3.sc(n2,side*w*.62)),b1=V3.add(q,V3.sc(n2,-side*w*.45)),mdl=V3.add(V3.add(q,V3.sc(t,len*.5)),V3.sc(n2,side*w*.7));
      return svSpl([b0,mdl,tip,V3.add(V3.add(q,V3.sc(t,len*.55)),V3.sc(n2,side*w*.15)),b1].map(x=>[x[0],-x[1]]))};
    /* (in a bouquet the peduncle's sheaths stay off the head: the bouquet's stem carries its own nodes) */
    let acc=0;if(!head)for(let i=1;i<ped.length;i++){const a0=acc;acc+=V3l(V3s(ped[i],ped[i-1]));for(const x of pnS)if(x>a0&&x<=acc){const t=V3.nz(V3s(ped[i],ped[i-1])),fq=(x-a0)/((acc-a0)||1),q=V3.add(ped[i-1],V3.sc(V3s(ped[i],ped[i-1]),fq));dd+=sc(q,t,D*pn[2],D*Q.sw*1.5,pnS.indexOf(x)%2?1:-1)}}
    for(const f of fl){const n2=V3.nz([-f.t[1],f.t[0],0]),sd=V3.dot(n2,f.pd)>0?1:-1;dd+=sc(f.q,f.t,D*Q.fb,D*Q.sw*.9,sd)}
    if(dd)E('path',{d:dd,fill:mix(mix(Q.bract,stc[2],.35),Q.dry,.5*wd),stroke:mix(Q.bract,'#d8d0a0',.4),'stroke-width':svF(Math.max(.2,D*.003)),'stroke-opacity':.6},k)}
  /* (head: the flowers are close and overlapped, so every front pedicel goes under every front flower) */
  /* (Q.pedU: on the whole scape too, its flowers close and overlapped: a pedicel never crosses a flower's face, phalaenopsis c7) */
  if(head||Q.pedU){for(const f of fr)drawPed(k,f);for(const f of fr)put(f)}else for(const f of fr){drawPed(k,f);put(f)}
  const ctCols=stCols.slice();ctCols.sv=Object.assign({},stCols.sv,{cut:0,cutC:mix(stc[3],'#f4f0dc',.4)});
  return{k,fl,C,ped,Lr,cols:ctCols}
  }finally{if(W0)WILT=W0}}
/* ---------- a sort of the old drawing handed to the kit (the orchids of r3a.js orchidPlant: its P.sv hook) ----------
   svorPlant(k,t,o,P,x,S,sid,wl): the scape drawn by the kit along the old peduncle (the bouquet's neck unchanged). In a bouquet (NECK_X) the old
   drawing is made (its own chance), measured and removed, an empty rect keeps its box, and the scape's flowering top is fitted inside it
   (svorScape o.room; c5.js measures a head by its box). Elsewhere the old chance is drawn by count: 3 for each flower's frame, 13 or 10 for
   each flower (the old flower's draws). x: {res,apex,op,cw,D,face,up,sd,old} from orchidPlant; wl the sort's life (0 fresh .. 1 faded). */
function svorPlant(k,t,o,P,x,S,sid,wl){const{res,apex,op,cw,D,face,up,sd}=x,bq=typeof NECK_X!=='undefined'&&NECK_X;let room=null;
  if(bq&&x.old){const tmp=G(k),E0=EXT,S0=SV_ON;EXT=[];SV_ON=false;let b=null;try{x.old(tmp);b=tmp.getBBox()}finally{tmp.remove();EXT=E0;SV_ON=S0}
    E('rect',{x:b.x,y:b.y,width:b.width,height:b.height,fill:'none',stroke:'none'},k);room=[b.x,b.x+b.width,-(b.y+b.height),-b.y]}
  else{let nK=0;for(const og of res.organs)if(og.t==='K')nK++;const per=3+(op>.3?13:10);for(let i=0;i<nK*per;i++)R(0,1)}
  const c0=res.chains[0],ci=lsCut(res,apex),ped=c0.pts.slice(0,ci+1).map(q=>V3s(q,apex)),side=V3.nz(V3.cr(face,up)),
    seed=svSeed(sid,cw.id,Math.round(ped[0][0]*4),Math.round(ped[0][1]*4),Math.round(D*8));
  const so={D:room?D:D*((S.scape&&S.scape.pD)||1),ped,up,face,sideV:V3.sc(side,sd),room,rach:c0.pts.slice(ci).map(q=>V3s(q,apex)),pw0:c0.ws[0]};
  let sc=null;for(let it=0;it<3;it++){const ex=[];so.defer=bq&&EXT?fn=>ex.push(fn):null;sc=svorScape(k,S,cw,op,seed,wl,so);if(!room)break;
    const b=sc.k.getBBox(),w=room[1]-room[0],h=room[3]-room[2],q=Math.min(1,w/Math.max(1e-6,b.width),h/Math.max(1e-6,b.height),
      (b.x+b.width>room[1]+.5||b.x<room[0]-.5||-b.y>room[3]+.5||-(b.y+b.height)<room[2]-.5)?.92:1);
    if(q>=1||it===2){if(EXT)EXT.push(...ex);break}sc.k.remove();so.fitK=(so.fitG||1)*q*.98}
  if(typeof SVDBG!=='undefined'&&SVDBG)SVDBG.push({p:'plant',sid,cw:cw.id,D:Math.round(D),room:room&&room.map(Math.round),fitG:so.fitG&&+so.fitG.toFixed(2),bb:(b=>[b.x,b.y,b.width,b.height].map(Math.round))(sc.k.getBBox()),el:sc.k.querySelectorAll('*').length,kb:Math.round(new XMLSerializer().serializeToString(sc.k).length/102.4)/10});
  open(k,t,1000,10,.3);const r=lsNeck(res,[0,0,0],apex);r.ncols=sc.cols;return r}
