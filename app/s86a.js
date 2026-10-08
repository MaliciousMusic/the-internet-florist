/* ================= Serre, lot 86 — succulentes et broméliacées : collier de perles, rhipsalis, plantes de l'air, Tillandsia cyanea, ananas ornemental (L-système) ================= */
/* shared: view space → screen; the light of a normal turned toward the eye */
const l86Q=p=>[p[0],-p[1]],l86I=n=>lightI(n[2]>=0?n:V3.sc(n,-1)),l86D=P=>'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L');
const l86Circ=(c,r)=>`M${f(c[0]-r)},${f(c[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* ---------- shared: a thick leaf in view space grown along a curling midrib: base P0, heading H, upper face N, length len, width W·wp(v);
   it recurves toward its back (curl, radians over its length, cp its law), spirals round the axis ax (sp, radians), its section a channel (cup) over a rounded keel (th × width).
   Drawn as its silhouette (the back's colour, every row's extreme points across the midrib) and, where the upper face looks at the eye, that face: a curling leaf shows face then back.
   o: tip {c, from, o} a coloured tip, base {c, to} a coloured foot, vr {c, k} a pale margin round a centre of colour c, teeth (a toothed margin), groove (the midrib's channel), zb ---------- */
function l86Leaf(P0,H,N,len,W,wp,c,cb,o={}){const det=DET>=1.5&&!LOD,nv=o.nv||(det?12:8),cu=o.curl||0,cp=o.cp||1.5,sp=o.sp||0,Ax=o.ax||[0,1,0],cup=o.cup??.25,th=o.th??.3,
    U=[-1,-.5,0,.5,1];
  let T=V3.nz(H),Nn=V3.nz(V3s(N,V3.sc(T,V3.dot(N,T)))),p=P0.slice();if(V3l(Nn)<1e-6)Nn=V3.nz(V3.cr(T,[1,0,0]));const rows=[];
  for(let i=0;i<=nv;i++){const v=i/nv,Wv=V3.cr(Nn,T),w=W*Math.max(.02,wp(v)),up=[],lo=[];
    for(const u of U){const q=V3.add(V3.add(p,V3.sc(Wv,u*w)),V3.sc(Nn,cup*w*u*u));up.push(q);lo.push(V3.add(q,V3.sc(Nn,-th*w*Math.sqrt(Math.max(0,1-u*u))-cup*w*u*u*.7)))}
    rows.push({c:p,N:Nn,W:Wv,w,up,lo});
    if(i<nv){const a=cu*(Math.pow((i+1)/nv,cp)-Math.pow(i/nv,cp));T=rotA(T,Wv,a);Nn=rotA(Nn,Wv,a);if(sp){T=rotA(T,Ax,sp/nv);Nn=rotA(Nn,Ax,sp/nv)}p=V3.add(p,V3.sc(T,len/nv))}}
  /* the silhouette, row by row */
  const Lf=[],Rt=[];let z=0;for(let i=0;i<=nv;i++){const a=l86Q(rows[Math.max(0,i-1)].c),b=l86Q(rows[Math.min(nv,i+1)].c);let px=-(b[1]-a[1]),py=b[0]-a[0];const m=Math.hypot(px,py);
    if(m<1e-6){const q=l86Q(rows[i].up[4]),r=l86Q(rows[i].up[0]);px=q[0]-r[0];py=q[1]-r[1]}const mm=Math.hypot(px,py)||1;px/=mm;py/=mm;
    const cc=l86Q(rows[i].c);let mn=1e9,mx=-1e9,pl=cc,pr=cc;for(const q3 of rows[i].up.concat(rows[i].lo)){const q=l86Q(q3),s=(q[0]-cc[0])*px+(q[1]-cc[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}
    Lf.push(pl);Rt.push(pr);z+=rows[i].c[2]}
  z=z/(nv+1)+(o.zb||0);
  /* the runs of rows whose upper face looks at the eye */
  const vis=rows.map(r=>r.N[2]>.02),runs=[];let a0=-1;for(let i=0;i<=nv;i++){if(vis[i]&&a0<0)a0=i;if((!vis[i]||i===nv)&&a0>=0){const b=vis[i]?i:i-1;if(b>a0)runs.push([a0,b]);a0=-1}}
  const P=pal7(c),PB=pal7(cb),nm=rows[nv>>1].N,cL=toneAt(PB,l86I(V3.sc(nm,-1))*.9+.04),sil=Lf.concat(Rt.slice().reverse());
  return{z,cast:false,fn:par=>{E('path',LOD?{d:smooth(sil),fill:cL}:{d:smooth(sil),fill:cL,stroke:PB.ink,'stroke-width':det?.32:.4,'stroke-opacity':.4,'stroke-linejoin':'round'},par);
    for(const[i0,i1]of runs){const nr=rows[(i0+i1)>>1].N,cU=toneAt(P,.62+(lightI(nr)-.6)*.95),fp=[];for(let i=i0;i<=i1;i++)fp.push(l86Q(rows[i].up[0]));for(let i=i1;i>=i0;i--)fp.push(l86Q(rows[i].up[4]));
      E('path',{d:smooth(fp),fill:cU,stroke:P.d1,'stroke-width':.3,'stroke-opacity':.3},par);
      /* a variegated margin: the centre in its own colour */
      if(o.vr&&!LOD){const k=o.vr.k||.5,ip=[];for(let i=i0;i<=i1;i++){const r=rows[i];ip.push(l86Q(V3.add(V3.add(r.c,V3.sc(r.W,-k*r.w)),V3.sc(r.N,cup*r.w*k*k))))}
        for(let i=i1;i>=i0;i--){const r=rows[i];ip.push(l86Q(V3.add(V3.add(r.c,V3.sc(r.W,k*r.w)),V3.sc(r.N,cup*r.w*k*k))))}E('path',{d:smooth(ip),fill:toneAt(pal7(o.vr.c),lightI(nr))},par)}
      if(det&&o.groove!==0){const q=[];for(let i=i0;i<=i1;i++)q.push(l86Q(rows[i].up[2]));if(q.length>1)E('path',{d:smooth(q,false),stroke:P.d1,'stroke-width':.4,'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},par)}}
    /* the coloured tip, the coloured foot (over both faces) */
    if(o.tip&&!LOD){const a=Math.round(o.tip.from*nv),q=Lf.slice(a).concat(Rt.slice(a).reverse());if(q.length>2)E('path',{d:smooth(q),fill:o.tip.c,opacity:o.tip.o??.7},par)}
    if(o.base&&!LOD){const b=Math.round(o.base.to*nv),q=Lf.slice(0,b+1).concat(Rt.slice(0,b+1).reverse());if(q.length>2)E('path',{d:smooth(q),fill:o.base.c,opacity:o.base.o??.55},par)}
    /* a toothed margin: small hooked spines along both edges, pointing to the tip */
    if(o.teeth&&det){let d='';for(const E0 of[Lf,Rt])for(let i=1;i<nv;i++){const p0=E0[i],p1=E0[i+1],dx=p1[0]-p0[0],dy=p1[1]-p0[1],l=Math.hypot(dx,dy)||1,cc=l86Q(rows[i].c),ox=p0[0]-cc[0],oy=p0[1]-cc[1],ol=Math.hypot(ox,oy)||1,
        tl=Math.min(1.1,rows[i].w*.42);d+=`M${f(p0[0]-dx/l*.6)},${f(p0[1]-dy/l*.6)}L${f(p0[0]+ox/ol*tl+dx/l*tl*.6)},${f(p0[1]+oy/ol*tl+dy/l*tl*.6)}L${f(p0[0]+dx/l*.6)},${f(p0[1]+dy/l*.6)}`}
      E('path',{d,fill:o.teeth,stroke:o.teeth,'stroke-width':.3,'stroke-linejoin':'round'},par)}}}}
/* ---------- shared: where a hanging strand goes. In a bouquet (DRAPEX) it leaves the clump at the lip, crests over it (never under it) and falls in front of the vessel,
   stopped by the table; on a sheet it hangs from its origin. Returns the guide (a cubic in the drape's own space, y up) for a strand of length factor k ---------- */
function l86Hang(o){const X=typeof DRAPEX!=='undefined'&&DRAPEX,side=X?X.side||1:(o.sway||0)<0?-1:1,Lv0=o.len||(o.cm||60)*UPC,sw=(o.sway??R(10,30)*side)*R(.7,1.3);
  let hc=R(6,12),dxc=side*R(8,18),Lh=Lv0*.88;
  if(X){hc=Math.max(5,X.y-(X.top-R(5,10)));if(!X.held)Lh=Math.min(Lh,X.FL-3-X.y);dxc=side*Math.max(6,Math.min(26,X.mw-Math.abs(X.x-X.mcx)+R(4,10)))}
  Lh=Math.max(40,Lh);return{X,side,sw,hc,dxc,Lh,B:o.ax?frameOf(o,0):I3}}
function l86Guide(Hg,k,x0,z0,dx=0){const{side,sw,hc,dxc}=Hg,Lh=Hg.Lh*k,s2=sw*(.6+.4*k),C=[[x0,-R(1,3),z0],[x0+dxc*.45,hc*1.5,z0+R(-3,3)],[x0+dxc+(s2-dxc)*.12+side*Lh*.08+dx*.3,-Lh*.32,z0+R(-8,8)],[x0+s2-side*Lh*.04+dx,-Lh,z0+R(-12,12)+dx*.5]],
    cb=s=>{const a=(1-s)**3,b=3*(1-s)**2*s,c=3*(1-s)*s*s,d=s**3;return[0,1,2].map(i=>a*C[0][i]+b*C[1][i]+c*C[2][i]+d*C[3][i])},N=48,P=[],cum=[0];
  for(let i=0;i<=N;i++){P.push(cb(i/N));if(i)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])))}
  const at=l=>{l=Math.max(0,Math.min(cum[N],l));let i=1;while(i<N&&cum[i]<l)i++;return{p:P[i],T:V3.nz(V3s(P[i],P[i-1]))}};return{L:cum[N],at,Lh}}
/* the turtle's modules for one strand: steps that follow the guide (each step turned a share of the way toward it, with a little wander); ev(j, l) inserts organs and branches after step j */
function l86Steer(Gd,step,ev){const n=Math.max(4,Math.round(Gd.L/step)),mods=[];for(let j=0;j<n;j++){const a=Gd.at((j+1)*Gd.L/n);mods.push(['F',{l:Gd.L/n,aim:a.T,k:.42}]);if(ev)mods.push(...ev(j,(j+1)*Gd.L/n,n))}return mods}

/* ---------- collier de perles (Curio rowleyanus, syn. Senecio rowleyanus, Asteraceae): a creeping and trailing succulent; thread-like stems (about 1 mm) that root where they touch
   and hang in curtains 30 to 90 cm long, branching now and then; along them, alternate on short petioles, the leaves are green spheres 6–8 mm across, each ending in a small point,
   with a narrow translucent window (a longitudinal band of clear tissue) that lets the light into the leaf. Sold as trailing pots and cut strands: plain green, a bluish green
   and the variegated form (cream and pink-flushed pearls on purplish stems). Rules: S → F(steered) [P] S, with now and then a branch [ +α F(gravity)… ] ---------- */
const L86_CWCUR=[
 {id:'vert',n:'Vert perle (classique)',c:'#6f9e4a',st:'#5f7a3c'},
 {id:'bleute',n:'Vert bleuté',c:'#7f9f8a',st:'#5e7462'},
 {id:'panache',n:'Panaché crème et rose (Variegata)',c:'#8fa86a',st:'#8a5a6a',v:['#d6dcaa','#e4c8b6']}];
function l86Curio(g,t,o){const cw=cwPick(L86_CWCUR,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.1,Math.min(1,o.op??1)),k=G(g);
  g35Run(o,'cur',()=>{const Hg=l86Hang(o),B=Hg.B,det=DET>=1.5&&!LOD,ns=det?5:3,V=p=>toV(B,p),pr0=UPC*.36*(.72+.28*op),stw=1.15,
      pals=[pal7(col)].concat((cw.v||[]).map(c=>pal7(c))),stc=cw.st;
    const strands=[];
    for(let s=0;s<ns;s++){const kk=s===0?1:R(.55,.95)*(.75+.25*op),Gd=l86Guide(Hg,kk,Hg.side*R(-3,6),R(-7,7),s?R(-1,1)*Hg.Lh*kk*.1:0),gap=R(9,12),pe=[];let acc=R(0,gap);
      /* a pearl after each step that passes its spacing; a branch now and then, falling under its own weight */
      const ev=(j,l,n)=>{const out=[];acc+=Gd.L/n;if(acc>=gap&&l>8){acc-=gap;out.push(['P',{l:l/Gd.L}])}
        if(j>n*.18&&j<n*.7&&rnd()<(det?.07:.05)){const bl=(Gd.L-l)*R(.25,.5),nb=Math.max(2,Math.round(bl/6));const ba=R(16,26);out.push(['[',{}],['/',{a:R(0,360)}]);
          for(let i=0;i<nb;i++){if(i<3)out.push(['+',{a:ba*[.45,.35,.2][i]}]);out.push(['F',{l:bl/nb,e:.12}]);if(i%2===1)out.push(['P',{l:Math.min(1,l/Gd.L+(i+1)/nb*bl/Gd.L)}])}out.push([']',{}])}return out};
      const res=lsTurtle(l86Steer(Gd,6,ev),{p:Gd.at(0).p.map((v,i)=>i===1?v:v),H:Gd.at(1).T,U:[0,0,1],wig:.035,seg:6,T:[0,-1,0],e:0,w:stw});
      strands.push({res,z:0})}
    /* paint each strand far to near: its pearls behind, the thread with its petioles, its pearls in front (pearls batched by colour and by light) */
    const out=[];
    for(const S0 of strands){const{res}=S0,chs=res.chains.map(ch=>ch.pts.map(p=>V(p)));let zs=0,nz=0;for(const ch of chs)for(const q of ch){zs+=q[2];nz++}const zm=zs/Math.max(1,nz);
      let dS='';for(const ch of chs)dS+=smooth(ch.map(l86Q),false);
      const bins=[{},{}],bin=(ly,pi)=>bins[ly][pi]||(bins[ly][pi]={b:'',m:'',h:'',w:'',t:''});let ph=R(0,6.28),ii=0;
      for(const og of res.organs){if(og.t!=='P')continue;ii++;const u=og.p.l,tipk=Math.min(1,(1-u)/.12),pr=pr0*R(.86,1.08)*(.5+.5*tipk),a=ph+ii*2.4,r=V3.nz(V3.add(V3.sc(og.U,Math.cos(a)),V3.sc(og.L,Math.sin(a)))),
          pd=V3.nz(V3.add(V3.sc(r,.85),V3.sc(og.H,.5))),b0=og.pos,c3=V3.add(b0,V3.sc(pd,pr+stw*.6+UPC*.12)),pc=V(c3),pb=V(b0),ly=pc[2]>=pb[2]?1:0,
          sc=l86Q(pc),sb=l86Q(pb),td=V(pd),tl=Math.hypot(td[0],td[1]),ux=tl>1e-4?td[0]/tl:0,uy=tl>1e-4?-td[1]/tl:-1,tip=pr*(.08+.26*tl),
          pi=pals.length>1?(rnd()<.55?0:rnd()<.6?1:2):0,bb=bin(ly,pi);
        /* the petiole joins the pearl to its thread */
        dS+=`M${f(sb[0])},${f(sb[1])}L${f(sc[0]-ux*pr*.6)},${f(sc[1]-uy*pr*.6)}`;
        /* the pearl: a sphere drawn out into its small point */
        const q=[];for(let m=0;m<14;m++){const th=m/14*6.283,cs=Math.cos(th),sn=Math.sin(th),rr=pr+tip*Math.pow(Math.max(0,cs),16);q.push([sc[0]+(ux*cs-uy*sn)*rr,sc[1]+(uy*cs+ux*sn)*rr])}
        bb.b+=smooth(q);bb.m+=l86Circ([sc[0]-pr*.2,sc[1]-pr*.24],pr*.7);if(!LOD)bb.h+=l86Circ([sc[0]-pr*.4,sc[1]-pr*.44],pr*.2);
        /* the window: a narrow clear band from the foot of the pearl to its point, on the side that faces the eye */
        if(!LOD&&tl>.25){const vx=-uy,vy=ux,o1=pr*.22,w1=pr*.11,A=[sc[0]-ux*pr*.62+vx*o1,sc[1]-uy*pr*.62+vy*o1],Bq=[sc[0]+ux*pr*.72+vx*o1*.6,sc[1]+uy*pr*.72+vy*o1*.6],m1=[sc[0]+vx*(o1+w1),sc[1]+vy*(o1+w1)],m2=[sc[0]+vx*(o1-w1),sc[1]+vy*(o1-w1)];
          bb.w+=`M${f(A[0])},${f(A[1])}Q${f(m1[0])},${f(m1[1])} ${f(Bq[0])},${f(Bq[1])}Q${f(m2[0])},${f(m2[1])} ${f(A[0])},${f(A[1])}Z`}}
      out.push({z:zm,fn:par=>{const lay=ly=>{for(const pi in bins[ly]){const bb=bins[ly][pi],P=pals[pi];if(!bb.b)continue;
          E('path',{d:bb.b,fill:toneAt(P,.34),stroke:P.ink,'stroke-width':.3,'stroke-opacity':.45},par);E('path',{d:bb.m,fill:toneAt(P,.66)},par);
          if(bb.w)E('path',{d:bb.w,fill:mix(P.d1,'#c8e0a0',.25),opacity:.7,stroke:mix(P.l2,'#ffffff',.3),'stroke-width':.3,'stroke-opacity':.8},par);if(bb.h)E('path',{d:bb.h,fill:P.l2,opacity:.75},par)}};
        lay(0);E('path',{d:dS,fill:'none',stroke:stc,'stroke-width':stw,'stroke-linecap':'round','stroke-linejoin':'round'},par);lay(1)}})}
    drawParts(k,out)});
  open(k,t,1100,0,0);return{k}}

/* ---------- rhipsalis (Rhipsalis baccifera, R. cassutha; mistletoe cactus, Cactaceae): an epiphytic cactus without spines; pendant stems 3–6 mm thick, cylindrical, bright green,
   made of joints 10–20 cm long that branch at their ends, in twos or in whorls of three or four, the last joints short and crowded so the tips end in tufts; on the stems, sessile
   and scattered, small round berries 5–8 mm, white and translucent like mistletoe. Sold as trailing plants and cut strands (vivid green, a soft green, with berries; R. cereuscula
   the coral cactus has short joints in whorls). Rules: S → F(steered) J S ; J → [ /φ +α B ]… ; B(n) → F(gravity) J [ /φ +α B(n−1) ]… ; B(0) → F(gravity) T ---------- */
const L86_CWRHI=[
 {id:'vif',n:'Baccifera vert vif',c:'#5f8f3e',be:0},
 {id:'baies',n:'Baccifera en baies blanches',c:'#58883a',be:1},
 {id:'tendre',n:'Cassutha vert tendre',c:'#8fb46a',be:.35},
 {id:'corail',n:'Cereuscula (cactus corail)',c:'#76a046',be:0,cer:1}];
function l86Rhip(g,t,o){const cw=cwPick(L86_CWRHI,o),col=o.cw?cw.c:(o.col||cw.c),op=Math.max(.1,Math.min(1,o.op??1)),k=G(g);
  g35Run(o,'rhi',()=>{const Hg=l86Hang(o),B=Hg.B,det=DET>=1.5&&!LOD,ns=det?5:3,V=p=>toV(B,p),Wc=[2.7,2.1,1.65],cer=!!cw.cer;
    /* the branches: an L-system of joints, each ending in a whorl */
    const rules={B:p=>{const a=p.a||30,out=[['+',{a:a*.4}],['F',{l:p.l*.18,e:.03}],['+',{a:a*.3}],['F',{l:p.l*.18,e:.04}],['+',{a:a*.2}],['F',{l:p.l*.2,e:.05}],['+',{a:a*.1}],['F',{l:p.l*.44,e:.07}]];if(p.n<=0)return out.concat([['T',{}]]);out.push(['J',{}]);
      const nb=cer?(rnd()<.5?3:4):rnd()<.62?2:3,ph=R(0,360);for(let i=0;i<nb;i++)out.push(['[',{}],['/',{a:ph+i*360/nb+R(-15,15)}],['B',{n:p.n-1,l:p.l*R(.55,.72),a:R(26,40)}],[']',{}]);return out}};
    const all=[];
    for(let s=0;s<ns;s++){const kk=s===0?1:R(.5,.92)*(.7+.3*op),Gd=l86Guide(Hg,kk,Hg.side*R(-3,6),R(-8,8),s?R(-1,1)*Hg.Lh*kk*.16:0),js=cer?R(14,22):R(30,48);let acc=R(js*.4,js*.8);
      const ev=(j,l,n)=>{acc+=Gd.L/n;if(acc<js||l<Gd.L*.16)return[];acc=0;const rest=Gd.L-l;if(rest<14)return[];const out=[['J',{}]];
        if(rnd()<(cer?.85:.6)){const nl=rest>110?2:1,l0=Math.min(rest*.42,(cer?R(14,22):R(26,40))*(.7+.3*op)),nb=rnd()<.7?1:2,ph=R(0,360);
          for(let i=0;i<nb;i++)out.push(['[',{}],['/',{a:ph+i*180+R(-20,20)}],...lsDerive([['B',{n:nl,l:l0,a:R(28,42)}]],rules,4),[']',{}])}return out};
      const mods=l86Steer(Gd,6,ev);
      /* the tip of the strand: a terminal whorl */
      mods.push(['J',{}]);{const nb=cer?4:rnd()<.6?2:3,ph=R(0,360);for(let i=0;i<nb;i++)mods.push(['[',{}],['/',{a:ph+i*360/nb}],...lsDerive([['B',{n:1,l:(cer?R(10,16):R(16,26))*(.7+.3*op),a:R(20,32)}]],rules,3),[']',{}])}
      all.push(lsTurtle(mods,{p:Gd.at(0).p,H:Gd.at(1).T,U:[0,0,1],wig:.03,seg:6,T:[0,-1,0],e:0,w:Wc[0]}))}
    /* two depths, three widths: each a stroked cylinder (dark body, its colour, a light line up-left); joints as a faint ring, the berries on the stems */
    const P=pal7(col),L2=[[ '','',''],['','','']],J=['',''],Br=[{b:'',h:''},{b:'',h:''}];
    for(const res of all){for(const ch of res.chains){const pts=ch.pts.map(V);let z=0;for(const q of pts)z+=q[2];z/=pts.length;const ly=z>=0?1:0,cl=Math.min(2,ch.ord);L2[ly][cl]+=smooth(pts.map(l86Q),false);
        /* berries: sessile, scattered on the younger joints */
        if(cw.be&&ch.ord>0&&op>.4)for(let i=2;i<pts.length;i++){if(rnd()>cw.be*.16)continue;const a=pts[i-1],b=pts[i],T=V3.nz(V3s(b,a)),q0=V3.nz(V3.cr(T,[R(-1,1),R(-1,1),R(-1,1)])),rb=UPC*R(.24,.32),
          c3=V3.add(b,V3.sc(q0,Wc[cl]*.5+rb*.55)),sc=l86Q(c3),bl=c3[2]>=b[2]?ly:0;Br[bl].b+=l86Circ(sc,rb);Br[bl].h+=l86Circ([sc[0]-rb*.35,sc[1]-rb*.38],rb*.32)}}
      if(det)for(const og of res.organs)if(og.t==='J'){const p=V(og.pos),h=V3.nz(V(og.H)),s=l86Q(p),hx=h[0],hy=-h[1],hl=Math.hypot(hx,hy)||1,nx=-hy/hl,ny=hx/hl,w=Wc[Math.min(2,og.ord)]*.42;
        J[p[2]>=0?1:0]+=`M${f(s[0]-nx*w)},${f(s[1]-ny*w)}L${f(s[0]+nx*w)},${f(s[1]+ny*w)}`}}
    const bP=pal7(mix('#f6f6ec',col,.08));
    const lay=ly=>{for(let cl=0;cl<3;cl++){const d=L2[ly][cl];if(!d)continue;const w=Wc[cl];
        E('path',{d,fill:'none',stroke:P.d2,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round'},k);
        if(!LOD)E('path',{d,fill:'none',stroke:ly?P.b:P.d1,'stroke-width':f(w*.62),'stroke-linecap':'round','stroke-linejoin':'round',transform:`translate(${f(-w*.1)},${f(-w*.12)})`},k);
        if(!LOD)E('path',{d,fill:'none',stroke:P.l2,'stroke-width':f(w*.2),'stroke-opacity':ly?.7:.4,'stroke-linecap':'round','stroke-linejoin':'round',transform:`translate(${f(-w*.24)},${f(-w*.28)})`},k)}
      if(J[ly])E('path',{d:J[ly],stroke:P.d2,'stroke-width':.5,'stroke-opacity':.55,fill:'none'},k);
      if(Br[ly].b){E('path',{d:Br[ly].b,fill:toneAt(bP,.55),stroke:bP.d1,'stroke-width':.3,'stroke-opacity':.6},k);if(!LOD)E('path',{d:Br[ly].h,fill:'#ffffff',opacity:.85},k)}};
    lay(0);lay(1)});
  open(k,t,1100,0,0);return{k}}

/* ---------- plantes de l'air (Tillandsia xerographica, T. ionantha, T. aeranthos; Bromeliaceae): epiphytes without roots, the leaves covered in silvery scales (trichomes) that drink the air.
   T. xerographica: a large rosette (15–30 cm and more) of broad-based silver leaves tapering into long thin tips that curl down and round in a spiral;
   T. ionantha: a small dense rosette (4–9 cm) of thick, stiff, recurved leaves, silver-green, flushing red at the heart when it flowers (violet tubular flowers, yellow stamens);
   T. aeranthos: a spiral of stiff narrow grey-green leaves up a short stem (7–15 cm), a pink bracted spike with deep violet-blue petals.
   Sold loose, or wired on a pick for bouquets. Rules: S → F K ; K → the rosette, its leaves in a 137.5° spiral from the outside in, then (in flower) the spike ---------- */
const L86_CWAIR=[
 {id:'xero',n:'Xerographica argentée',t:'x',c:'#b4bbb2',b:'#a2aaa0'},
 {id:'xero-rose',n:'Xerographica rosée',t:'x',c:'#c2b6b8',b:'#aaa4a6',tip:'#b98a9a'},
 {id:'ionantha',n:'Ionantha vert argenté',t:'i',c:'#8f9f88',b:'#a4b0a0'},
 {id:'rubra',n:'Ionantha rougissante (en fleur)',t:'i',c:'#9aa48e',b:'#aab2a2',heart:'#c8404e',fl:'#7a3aa0'},
 {id:'fuego',n:'Ionantha Fuego',t:'i',c:'#c45a6a',b:'#b48a8e',heart:'#d0304a',fl:'#6a2a98'},
 {id:'aeranthos',n:'Aeranthos gris-vert',t:'a',c:'#9aa494',b:'#aab2a6'},
 {id:'aeranthos-fleur',n:'Aeranthos en fleur (bractées roses)',t:'a',c:'#d98aa0',b:'#aab2a6',lf:'#98a292',spk:'#e07a98',fl:'#3a2a90'}];
const L86_AIRSZ={x:[12,30],i:[4,9],a:[7,15]},L86_TAP=v=>Math.pow(1-v,1.35)*(1-.1*v),L86_IOW=v=>Math.pow(1-v,.95)*(1+.15*Math.sin(Math.PI*v)),L86_AEW=v=>Math.pow(1-v,.7);
function l86AirRos(par,B,O,Dm,op,cw){const det=DET>=1.5&&!LOD,ty=cw.t,lc=cw.lf||cw.c,parts=[],ph=R(0,6.283),Vw=p=>V3.add(O,toV(B,p)),ax=V3.nz(toV(B,[0,0,1])),spS=rnd()<.5?-1:1,
    n=ty==='x'?(LOD?12:det?24:16):ty==='i'?(LOD?16:det?40:26):(LOD?12:det?26:18),o2=sm01(op/.8);
  for(let i=0;i<n;i++){const q=i/(n-1),a=ph+i*137.508*D;let len,W,el,cu,sp=0,th,cup,wp,hb;
    if(ty==='x'){len=Dm*.66*(1-.48*q)*R(.92,1.06);W=len*(.2+.05*q);el=(18+56*q+(1-o2)*25*(1-q))*D;cu=(3.4-2.4*q)*(.4+.6*o2)*R(.85,1.15);sp=spS*R(.8,1.5)*(1-q*.5);th=.2;cup=.38;wp=L86_TAP;hb=Dm*.06*q}
    else if(ty==='i'){len=Dm*.56*(1-.42*q)*R(.92,1.06);W=len*.17;el=(20+64*q+(1-o2)*20*(1-q))*D;cu=(1.1-.9*q)*R(.8,1.2);sp=spS*.2;th=.95;cup=.08;wp=L86_IOW;hb=Dm*.1*q}
    else{len=Dm*.58*(1-.3*q)*R(.92,1.06);W=len*.12;el=(30+48*q+(1-o2)*18*(1-q))*D;cu=(.55-.35*q)*R(.8,1.2);sp=spS*.25;th=.45;cup=.25;wp=L86_AEW;hb=Dm*.3*q}
    const d=[Math.cos(el)*Math.cos(a),Math.cos(el)*Math.sin(a),Math.sin(el)],N=[-Math.sin(el)*Math.cos(a),-Math.sin(el)*Math.sin(a),Math.cos(el)],base=[Math.cos(a)*Dm*.03*(1-q),Math.sin(a)*Dm*.03*(1-q),hb];
    /* the heart flushes red in flower; a rosy xerographica blushes at its tips */
    const hk=cw.heart?Math.pow(q,1.3)*(.3+.7*o2):0,c=mix(mix(lc,shd(lc,R(-.08,.06)),.5),cw.heart||lc,hk),cb=mix(cw.b,cw.heart||cw.b,hk*.6);
    parts.push(l86Leaf(Vw(base),toV(B,d),toV(B,N),len,W,wp,c,cb,{curl:cu,cp:ty==='x'?1.35:1.6,sp,ax,th,cup,nv:ty==='x'?(det?14:10):undefined,
      tip:cw.tip?{c:cw.tip,from:.6,o:.4}:ty==='i'&&cw.heart&&q<.5?{c:cw.heart,from:.7,o:.45}:null}))}
  /* in flower: ionantha's violet tubes with their yellow stamens; aeranthos' pink spike, deep blue petals between its bracts */
  if(cw.fl&&op>.55){const F={k:null,B,O,parts:[]},o3=sm01((op-.55)/.4);
    if(ty==='i'){const nf=det?3:2;for(let j=0;j<nf;j++){const a=ph+j*2.1,e=[Math.cos(a),Math.sin(a),0],d0=V3.nz(V3.add([0,0,1],V3.sc(e,.35))),b0=[0,0,Dm*.12],l=Dm*(.32+.12*o3),p1=V3.add(b0,V3.sc(d0,l*.5)),p2=V3.add(b0,V3.sc(d0,l));
        parts.push(tube3(F,[b0,p1,p2],t2=>Math.max(.7,Dm*.022*(1+.35*t2)),{cols:[shd(cw.fl,-.2),cw.fl,lt(cw.fl,.2)],cap:1,hl:.3,dk:.35,spec:.2,ink:shd(cw.fl,-.7),eo:.4,cast:.3,zb:.5}));
        const s0=V3.add(p2,V3.sc(d0,-Dm*.02)),s1=V3.add(p2,V3.sc(d0,Dm*.09));parts.push(tube3(F,[s0,V3.add(s0,V3.sc(d0,Dm*.05)),s1],Math.max(.6,Dm*.009),{cols:['#e8c840','#f4dc60'],cap:1,hl:.2,dk:.3,spec:0,ink:'#8a6a10',eo:.4,cast:0,zb:.6}))}}
    else{const Hs=Dm*(.28+.1*o3),b0=[0,0,Dm*.28],pk=cw.spk||'#e07a98';parts.push(tube3(F,[b0,V3.add(b0,[0,0,Hs*.5]),V3.add(b0,[0,0,Hs])],t2=>Math.max(.8,Dm*.03*(1-.6*t2)),{cols:[shd(pk,-.2),pk],cap:1,hl:.3,dk:.3,spec:.2,ink:shd(pk,-.7),eo:.4,cast:.3,zb:.3}));
      const nb=det?9:6;for(let j=0;j<nb;j++){const qq=j/(nb-1),a=ph+j*137.5*D,e=[Math.cos(a),Math.sin(a),0],s=V3.cr([0,0,1],e),bb=V3.add(b0,[e[0]*Dm*.02,e[1]*Dm*.02,Hs*.8*qq]),dd=V3.nz(V3.add([0,0,1],V3.sc(e,.55-.25*qq))),
          S=x33Blade(Vw(bb),toV(B,dd),toV(B,s),toV(B,V3.cr(dd,s)),Dm*(.17-.06*qq),Dm*.05,X33_GBR,{fold:.3,cup:-.6});
        parts.push(...sheet3({k:null,B:I3,O:[0,0,0],parts:[]},S,{pal:pal7(pk),palB:pal7(shd(pk,-.1)),nu:3,nv:4,across:0,flat:1,ew:.4,eo:.45,cast:0}));
        if(j>=nb-4&&j%2===0&&op>.7){const fb=V3.add(bb,V3.sc(dd,Dm*.06)),fd=V3.nz(V3.add([0,0,1],V3.sc(e,.3)));parts.push(tube3(F,[fb,V3.add(fb,V3.sc(fd,Dm*.04)),V3.add(fb,V3.sc(fd,Dm*.085))],t2=>Math.max(.7,Dm*.022*(1+.5*t2)),{cols:[cw.fl,lt(cw.fl,.15)],cap:1,hl:.3,dk:.3,spec:.2,ink:shd(cw.fl,-.7),eo:.4,cast:.3,zb:.2}))}}}}
  drawParts(par,parts)}
const L86_AIRST=['#4a5244','#7a8472','#a2aa98','#c8ccc0'];
function l86Air(g,t,o){const cw=cwPick(L86_CWAIR,o),op=Math.max(.05,Math.min(1,o.op??1)),rg=L86_AIRSZ[cw.t],Dm=Math.max(rg[0],Math.min(rg[1],o.cm||18))*UPC,k=G(g);
  const nk=g35Run(o,'air'+cw.id,()=>lsHeadS(k,o,{D:Dm,w:Math.max(2.4,Dm*.05),op,cols:L86_AIRST,nodes:0,lp:cw.t==='a'?.5:.42,aimK:.4,wig:.01,e:0,flower:(par,B,P,D2,op2)=>l86AirRos(par,B,P,D2,op2,cw)}));
  open(k,t,1000,0,.4);return nk}

/* ---------- Tillandsia cyanea en fleur (syn. Wallisia cyanea, « pink quill »; Bromeliaceae): a rosette of narrow arching leaves, channelled, green with fine reddish-brown lines at their foot;
   from its heart a short scape bears a flat paddle (10–20 cm) of two ranks of tightly overlapping keeled bracts, rose-pink, from whose edges come, a few at a time, the flowers:
   three spreading violet-blue petals round a white eye. Sold as a plant in flower and as cut paddles: rose, bright pink (Anita), coral, pale pink.
   Rules: S → F N(leaves) F N(leaves) F(scape) Q ; Q → the paddle, its bracts alternate on two ranks ---------- */
const L86_CWCYA=[
 {id:'rose',n:'Rose classique (cyanea)',c:'#e0609a',fl:'#4a3ab0'},
 {id:'anita',n:'Rose vif (Anita)',c:'#e8487e',fl:'#5a3ab8'},
 {id:'rouge',n:'Rouge',c:'#d0304a',fl:'#4a3aa8'},
 {id:'pale',n:'Rose pâle',c:'#eca2bc',fl:'#5a4ab8'}];
const L86_CYW=v=>Math.pow(Math.sin(Math.PI*Math.min(1,.12+v*.88)),.35)*(1-.5*v*v),L86_PET=prof([[0,.3],[.25,.8],[.6,1],[.85,.8],[1,.2]]);
function l86Cya(g,t,o){const cw=cwPick(L86_CWCYA,o),col0=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||12)*UPC,k=G(g),
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=['#2a4a1e','#4a7432','#6e9a48','#a0c47a'],lc='#3f6e34',col=op<.3?mix(col0,'#9aae6a',.5*(1-op/.3)):col0,
    kr=B.reach?Math.min(1,Math.max(.2,B.reach*.42/(Dm*.7))):1,ph=R(0,360);
  return g35Run(o,'cya',()=>{const nd=i=>{const out=[['Nd',{}]];for(let j=0;j<3;j++)out.push(['[',{}],['/',{a:ph+i*60+j*120+R(-12,12)}],['&',{a:(58+i*12)+R(-6,6)}],['Lv',{i,j}],[']',{}]);return out};
    const mods=[['F',{l:Dm*.08*kr,w0:Dm*.05,w1:Dm*.048}],...nd(0),['F',{l:Dm*.04*kr,w1:Dm*.046}],...nd(1),['F',{l:Dm*.04*kr,w1:Dm*.044}],...nd(2),['F',{l:Dm*.16*kr,w1:Dm*.036}],['Q',{}]];
    const res=lsTurtle(mods,{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.004,seg:Dm*.05,T:[0,1,0],e:0,w:Dm*.05});for(const ch of res.chains)ch.c=SC;
    const Q=res.organs.find(q=>q.t==='Q'),apex=Q.pos;
    lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
      /* the leaves: narrow channelled straps arching out and down, their foot lined with brown */
      if(og.t==='Lv'){const len=Dm*(1.15-.18*og.p.i)*R(.9,1.08);return{ext:1,parts:[l86Leaf(pos,og.H,og.U,len,len*.075,v=>Math.pow(1-v,.45)*(.8+.2*Math.sin(Math.PI*Math.min(1,v*2))),
        mix(lc,shd(lc,R(-.1,.06)),.5),'#6a8a5a',{curl:R(1,1.5),cp:1.7,cup:.45,th:.2,base:{c:'#7a4a3a',to:.12,o:.28}})]}}
      if(og.t!=='Q')return null;return{parts:l86Paddle(pos,Fr,Dm,col,cw,op)}}});
    open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)})}
/* the paddle: bracts alternate on two ranks, each a keeled boat whose keel makes the paddle's edge; broad in the middle, narrow at both ends; flowers leave its edges */
function l86Paddle(P0,Fr,Dm,col,cw,op){const F={k:null,B:I3,O:[0,0,0],parts:[]},pp=[],az=R(-.45,.45),Pp=V3.nz(V3.add(V3.sc(Fr.X,Math.cos(az)),V3.sc(Fr.Z,Math.sin(az))));let Qq=V3.cr(Pp,Fr.Y);const 
    o2=sm01(op/.9),Lsw=Dm*(.55+.45*o2),det=DET>=1.5&&!LOD,nb=LOD?10:det?20:14,P=pal7(col),PB=pal7(shd(col,-.12)),PG=pal7(mix(col,'#8aa860',.35));
  /* the core under the bracts */
  pp.push(tube3(F,[V3.add(P0,V3.sc(Fr.Y,-Dm*.02)),V3.add(P0,V3.sc(Fr.Y,Lsw*.4)),V3.add(P0,V3.sc(Fr.Y,Lsw*.84))],t2=>Math.max(.8,Dm*.04*(1-.6*t2)),{cols:[shd(col,-.25),col],cap:1,hl:.2,dk:.4,spec:0,ink:shd(col,-.7),eo:.35,cast:0,zb:-Dm*.08}));
  const nf=op>.85?(det?3:2):op>.5?1:0,fj=new Set();if(Qq[2]<0)Qq=V3.sc(Qq,-1);for(let i=0;i<nf;i++){let j=Math.round((nf===1?.45:.28+.32*i/(nf-1))*(nb-1));if(j%2!==i%2)j++;fj.add(j)}
  for(let j=0;j<nb;j++){const q=j/(nb-1),sg=j%2?1:-1,m=V3.sc(Pp,sg),b=V3.add(P0,V3.sc(Fr.Y,Lsw*.8*q)),hw=Math.sin(Math.PI*Math.min(1,.15+q*.85)),
      dd=V3.nz(V3.add(Fr.Y,V3.sc(m,Math.tan((50-22*q)*D)))),len=Lsw*(.2+.2*hw)*(1-.15*q),w=len*(.4+.12*hw),th=.42*Math.PI;
    const S=(u,v)=>{const a=u*th,h=w*X33_VBR(v),c=V3.add(b,V3.sc(dd,len*v));return V3.add(c,V3.add(V3.sc(m,h*(Math.cos(a)-.38)),V3.sc(Qq,h*Math.sin(a)*.22)))};
    pp.push(...sheet3(F,S,{pal:q<.12&&o2<.7?PG:P,palB:PB,nu:det?6:4,nv:det?7:5,across:det?.7:0,flat:!det,ew:.5,eo:.5,cast:.5,veins:det?[[[.5,.05],[.45,.5],[.3,.95]]]:null,vw:Math.max(.35,len*.01),vo:.3}));
    /* a flower from the bract's mouth: a short white tube, three violet-blue petals spread round a white eye */
    if(fj.has(j)){
      const e=V3.add(b,V3.add(V3.sc(dd,len*.6),V3.sc(m,w*.45))),fd=V3.nz(V3.add(V3.add(V3.sc(m,.8),V3.sc(Fr.Y,.4)),V3.sc(Qq,.4))),tl=Dm*.06,e2=V3.add(e,V3.sc(fd,tl));
      pp.push(tube3(F,[e,V3.add(e,V3.sc(fd,tl*.5)),e2],Math.max(.8,Dm*.016),{cols:['#e8e4f0','#f6f4fa'],cap:1,hl:.2,dk:.3,spec:0,ink:'#6a6a8a',eo:.35,cast:.3,zb:.05}));
      const n0=V3.nz(V3.add(V3.add(V3.sc(m,.35),V3.sc(Qq,.9)),V3.sc(Fr.Y,.2))),s0=V3.nz(V3.cr(n0,Fr.Y)),s1=V3.cr(n0,s0),pr=Dm*.15,fP=pal7(cw.fl);
      for(let i=0;i<3;i++){const a=i*2.094+R(-.1,.1),rd=V3.nz(V3.add(V3.sc(s0,Math.cos(a)),V3.sc(s1,Math.sin(a)))),sd=V3.cr(n0,rd),
          Sp=x33Blade(e2,V3.nz(V3.add(rd,V3.sc(n0,.15))),sd,n0,pr,pr*.62,L86_PET,{fold:0,cup:-.25,arch:-.1});
        pp.push(...sheet3(F,Sp,{pal:fP,palB:pal7(shd(cw.fl,.1)),nu:3,nv:4,across:0,flat:1,ew:.4,eo:.5,cast:.3,zb:.06}))}
      pp.push({z:PJ(I3,[0,0,0],e2)[2]+.2,cast:false,fn:par=>{const c=l86Q(e2);E('path',{d:l86Circ(c,Math.max(.7,pr*.24)),fill:'#f6f4fa',stroke:'#8a88b0','stroke-width':.25},par)}})}}
  return pp}

/* ---------- ananas ornemental (Ananas comosus var. bracteatus, var. nanus, « Champaca »; Bromeliaceae): on a stout scape set with a few narrow spiny bracts, a small fruit (5–12 cm)
   — a syncarp of hexagonal fruitlets (the « eyes ») in spiral rows, each with its small pointed bracteole — rose, red, or green ripening to gold; under it a whorl of
   long spreading bracts, toothed, flushed with the fruit's colour (vivid in bracteatus); on top the crown, a tight spiral of stiff toothed leaves (variegated cream and pink in
   bracteatus 'Tricolor'). Rules: S → F N(bracts) F N(bracts) F Q ; Q → bracts, the fruit, the crown ---------- */
const L86_CWANA=[
 {id:'rose',n:'Rose (var. bracteatus)',c:'#e0507a',br:'#e66a8a',lf:'#4f7a3a',bo:'#8a9a4a'},
 {id:'tricolor',n:'Rose, feuilles panachées (Tricolor)',c:'#d84a6a',br:'#ec7a96',lf:'#5f8a44',vr:'#ece4c0',bo:'#8a9a4a'},
 {id:'rouge',n:'Rouge (Champaca)',c:'#c42a3c',br:'#d0404e',lf:'#4a6e36',bo:'#7a8a3a'},
 {id:'vert',n:'Vert (var. nanus)',c:'#6aa040',br:'#7a9a48',lf:'#4f7a3a',bo:'#5a6a2a'},
 {id:'dore',n:'Doré (var. nanus mûr)',c:'#d4a83a',br:'#a8a848',lf:'#4f7a3a',bo:'#7a5a2a'}];
const L86_ANAW=v=>Math.pow(1-v,.65)*(.75+.25*Math.min(1,v*5)),L86_ABW=v=>Math.pow(1-v,.8);
function l86Ana(g,t,o){const cw=cwPick(L86_CWANA,o),col0=o.cw?cw.c:(o.col||cw.c),op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||8)*UPC,k=G(g),
    B=frameOf(o,.4,true),Fr=x33Fr(B,o),SC=['#2e4a22','#4e7034','#76984e','#a8c47e'],kr=B.reach?Math.min(1,Math.max(.25,B.reach*.42/(Dm*1.2))):1;
  return g35Run(o,'ana',()=>{const nd=i=>{const out=[['Nd',{}]],ph=R(0,360);for(let j=0;j<2;j++)out.push(['[',{}],['/',{a:ph+j*180+i*90}],['&',{a:R(28,40)}],['Bs',{i}],[']',{}]);return out};
    const w=Dm*.11,mods=[['F',{l:Dm*.5*kr,w0:w*1.1,w1:w*1.05}],...nd(0),['F',{l:Dm*.45*kr,w1:w}],...nd(1),['F',{l:Dm*.3*kr,w1:w*.95,aim:Fr.Y,k:.3}],['Q',{}]];
    const res=lsTurtle(mods,{p:[0,0,0],H:Fr.Y,U:Fr.Z,wig:.006,seg:Dm*.08,T:[0,1,0],e:0,w:w*1.1});for(const ch of res.chains)ch.c=SC;
    const Q=res.organs.find(q=>q.t==='Q'),apex=Q.pos;
    lsPlant(k,res,{O:[0,0,0],apex,cols:SC,organ:(og,pos)=>{
      if(og.t==='Bs'){const len=Dm*R(.5,.7);return{ext:1,parts:[l86Leaf(V3.add(pos,V3.sc(og.H,-w*.2)),og.H,og.U,len,len*.12,L86_ABW,mix(cw.br,cw.lf,.3),shd(mix(cw.br,cw.lf,.3),-.12),{curl:.5,cup:.35,th:.2,teeth:shd(cw.br,-.3),base:{c:cw.lf,to:.35,o:.5}})]}}
      if(og.t!=='Q')return null;return{parts:l86Fruit(pos,Fr,Dm,cw,col0,op)}}});
    open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)})}
function l86Fruit(P0,Fr,Dm,cw,col0,op){const det=DET>=1.5&&!LOD,pp=[],o2=sm01(op/.9),Hf=Dm*(.6+.4*o2),col=mix(col0,lt(col0,.25),.6*(1-o2)),Rm=Hf*.37,
    rf=h=>Rm*Math.pow(Math.max(0,Math.sin(Math.PI*Math.min(1,.06+h*.9))),.62)*(1-.1*h),X=Fr.X,Y=Fr.Y,Z=Fr.Z,
    S=(h,a)=>V3.add(V3.add(P0,V3.sc(Y,Hf*(.04+h*.96))),V3.add(V3.sc(X,Math.cos(a)*rf(h)),V3.sc(Z,Math.sin(a)*rf(h)))),ph=R(0,6.28);
  /* the whorl of bracts under the fruit, spreading and recurved, toothed */
  const nbr=LOD?6:det?9:7;for(let i=0;i<nbr;i++){const a=ph+i*6.283/nbr+R(-.15,.15),e=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Z,Math.sin(a))),el=(R(8,22)-14*(1-o2))*D,
      d=V3.nz(V3.add(V3.sc(e,Math.cos(el)),V3.sc(Y,Math.sin(el)+.25*(1-o2)))),N=V3.nz(V3.add(V3.sc(Y,Math.cos(el)),V3.sc(e,-Math.sin(el)))),len=Dm*R(.55,.75)*(.7+.3*o2);
    pp.push(l86Leaf(V3.add(P0,V3.add(V3.sc(Y,Hf*.08),V3.sc(e,Rm*.35))),d,N,len,len*.17,L86_ABW,cw.br,shd(cw.br,-.15),{curl:R(.7,1.1),cup:.3,th:.2,teeth:shd(cw.br,-.35),base:{c:cw.lf,to:.2,o:.45},zb:-.3}))}
  /* the fruit: its outline from the surface of revolution, shaded as a body; the eyes on it in spiral rows, the ones facing the eye only */
  const sil=[];for(let i=0;i<=14;i++)for(let j=0;j<24;j++){const p=l86Q(S(i/14,j/24*6.283));sil.push(p)}
  const hull=(()=>{const P=sil.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
    for(const p of P){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(let i=P.length-1;i>=0;i--){const p=P[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
    return lo.slice(0,-1).concat(up.slice(0,-1))})();
  const C3=V3.add(P0,V3.sc(Y,Hf*.5)),cz=C3[2],FP=pal7(col),ne=LOD?40:det?110:70,sp=Math.sqrt(2*Math.PI*Rm*.8*Hf/ne)*.56,eyes=[[],[],[]],ink=[],brt=[],dots=[];
  for(let i=0;i<ne;i++){const h=.04+.92*(i+.5)/ne,a=ph+i*137.508*D,c=S(h,a),du=V3s(S(h,a+.02),S(h,a-.02)),dv=V3s(S(Math.min(1,h+.01),a),S(Math.max(0,h-.01),a)),n=V3.nz(V3.cr(dv,du));
    if(V3.dot(n,V3s(c,C3))<0)continue;if(n[2]<.12)continue;const e1=V3.nz(du),e2=V3.nz(V3.cr(n,e1)),s=sp*(.75+.4*Math.sin(Math.PI*h)),q=[];
    for(let m=0;m<6;m++){const th=(30+m*60)*D;q.push(l86Q(V3.add(c,V3.add(V3.sc(e1,Math.cos(th)*s),V3.sc(e2,Math.sin(th)*s*.86)))))}
    const I=lightI(n),bi=I<.5?0:I<.72?1:2;eyes[bi].push(q);ink.push(q);
    /* the bracteole: a small point at the foot of the eye; the dried flower in its centre */
    const b0=V3.add(c,V3.sc(e2,-s*.55)),b1=V3.add(c,V3.add(V3.sc(e2,-s*1.05),V3.sc(n,s*.25))),bw=V3.sc(e1,s*.3);brt.push([l86Q(V3.add(b0,bw)),l86Q(b1),l86Q(V3s(b0,bw))]);if(det)dots.push([l86Q(V3.add(c,V3.sc(e2,s*.15))),s*.16*n[2]])}
  pp.push({z:cz,cast:false,fn:par=>{const g=G(par),d=smooth(hull),lo=l86Q(V3.add(C3,V3.add(V3.sc(X,-Rm*.6),V3.sc(Y,Hf*.25)))),hi=l86Q(V3.add(C3,V3.add(V3.sc(X,Rm*.7),V3.sc(Y,-Hf*.3))));
    E('path',{d,fill:LOD?FP.d1:ugrad(lo[0],lo[1],hi[0],hi[1],[[0,FP.l1,1],[.5,FP.b,1],[1,FP.d2,1]]),stroke:FP.ink,'stroke-width':.45,'stroke-opacity':.4},g);if(LOD)return;
    eyes.forEach((L,bi)=>{if(L.length)E('path',{d:L.map(q=>l86D(q)+'Z').join(''),fill:toneAt(FP,[.42,.62,.8][bi]),opacity:.9},g)});
    E('path',{d:ink.map(q=>l86D(q)+'Z').join(''),fill:'none',stroke:FP.d2,'stroke-width':det?.4:.5,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
    E('path',{d:brt.map(q=>l86D(q)+'Z').join(''),fill:cw.bo,stroke:shd(cw.bo,-.4),'stroke-width':.25,'stroke-opacity':.6},g);
    if(dots.length)E('path',{d:dots.map(([c,r])=>l86Circ(c,Math.max(.25,r))).join(''),fill:shd(cw.bo,-.45),opacity:.7},g)}});
  /* the crown: a tight spiral of stiff toothed leaves, the outer ones spreading, the inner erect */
  const T0=V3.add(P0,V3.sc(Y,Hf*.97)),nc=LOD?12:det?26:18;
  for(let i=0;i<nc;i++){const q=i/(nc-1),a=ph+i*137.508*D,e=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Z,Math.sin(a))),el=(38+48*q+(1-o2)*14*(1-q))*D,
      d=V3.nz(V3.add(V3.sc(e,Math.cos(el)),V3.sc(Y,Math.sin(el)))),N=V3.nz(V3.add(V3.sc(Y,Math.cos(el)),V3.sc(e,-Math.sin(el)))),len=Dm*(1.05-.55*q)*(.65+.35*o2)*R(.9,1.08);
    pp.push(l86Leaf(V3.add(T0,V3.add(V3.sc(e,Rm*.12*(1-q)),V3.sc(Y,-Hf*.06*(1-q)))),d,N,len,len*(.11+.03*q),L86_ANAW,mix(cw.lf,shd(cw.lf,R(-.08,.06)),.5),mix(cw.lf,'#9ab088',.35),
      {curl:(.45-.4*q)*R(.7,1.2),cup:.3,th:.25,teeth:det?shd(cw.lf,-.4):null,vr:cw.vr&&q<.85?{c:cw.lf,k:.5}:null,tip:cw.vr?{c:cw.br,from:.8,o:.4}:null,zb:.1}))}
  return pp}

/* ---------- registers ---------- */
Object.assign(GH,{'curio-rowleyanus-collier-de-perles':l86Curio,'rhipsalis':l86Rhip,'tillandsia-plantes-de-l-air':l86Air,'tillandsia':l86Cya,'ananas-ornemental':l86Ana});
Object.assign(CWS,{'curio-rowleyanus-collier-de-perles':L86_CWCUR,'rhipsalis':L86_CWRHI,'tillandsia-plantes-de-l-air':L86_CWAIR,'tillandsia':L86_CWCYA,'ananas-ornemental':L86_CWANA});
Object.assign(SZG,{'curio-rowleyanus-collier-de-perles':[30,40,50,60,60,80],'rhipsalis':[40,50,60,80,80,100],'tillandsia-plantes-de-l-air':[6,8,12,15,20,25],'tillandsia':[10,12,15,15,18],'ananas-ornemental':[5,6,8,8,10,12]});
Object.assign(GHI,{'curio-rowleyanus-collier-de-perles':{form:'retombante',size:2,k:'drape',self:60*UPC},'rhipsalis':{form:'retombante',size:2,k:'drape',self:80*UPC},
  'tillandsia-plantes-de-l-air':{form:'rosette',size:2,k:'head',rk:1},'tillandsia':{form:'sculpt',size:2.5,k:'head',rk:1.25},'ananas-ornemental':{form:'sculpt',size:2.5,k:'head',rk:1.5}});
GH_BUDS.add('tillandsia');
