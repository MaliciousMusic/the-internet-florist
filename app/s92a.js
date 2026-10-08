/* ================= Serre, lot 92 — céréales, poussées par le L-système : blé, avoine, orge, sorgho à balai, broom bloom (genêt à balais séché) ================= */
/* ---------- shared: a cereal grows upright in its own frame (lnAxis of lot 18) and is laid along its axis by l40Lay (in a bouquet hugging its spine, never sinking under it).
   The culms are round tubes with marked nodes, the leaves 3D ribbons (lnRibbon) grown step by step by the turtle; a head is many small pieces sorted far to near
   and cut into a few depth bands, one path per tone in each band (few elements, the right order). Every fine stroke is at least 1.05 wide, every piece starts on its carrier ---------- */
const L92_UP=[0,1,0],L92_W=1.05;
/* the width of an awn: in a bouquet never under L92_W (a finer stroke would read as a loose piece), on a sheet as fine as it is */
const l92Aw=bq=>bq?L92_W:.55;
/* the frame of an organ in view space: its point (laid), heading, face and left */
function l92Fr(A,og,Wq){const P=Wq(og.pos),H=A.Wv(og.pos,og.H),U0=A.Wv(og.pos,og.U),U=V3.nz(V3s(U0,V3.sc(H,V3.dot(U0,H))));return{P,H,U,L:V3.cr(U,H)}}
/* the base of a cereal: its axis, its spread round the spine and how far it may hang (GHI) */
function l92Base(o,sid,cm0,bow){const bq=!!o.spine,Lf=(o.cm||cm0)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt,{bow:bow??R(-.04,.04),face:R(-.9,.9)}),gi=GHI[sid];
  return{bq,A,L:A.L,Rm:gi.rch,fd:gi.fx*.92,op:Math.max(.05,Math.min(1,o.op??1))}}
/* the painter of a head: items {z,k,d,st,o} sorted far to near, cut into nb bands, one path per key in each band (keys in their order o) */
function l92Bands(items,nb){items.sort((a,b)=>a.z-b.z);const out=[],per=Math.max(1,Math.ceil(items.length/nb));
  for(let i=0;i<items.length;i+=per){const M=new Map();for(const it of items.slice(i,i+per)){let e=M.get(it.k);if(!e){e={d:[],st:it.st,o:it.o||0};M.set(it.k,e)}e.d.push(it.d)}out.push([...M.values()].sort((a,b)=>a.o-b.o))}
  return par=>{for(const B of out)for(const e of B)E('path',Object.assign({d:e.d.join('')},e.st),par)}}
const l92Z=(items)=>items.length?items.reduce((s,it)=>s+it.z,0)/items.length:0;
/* a lanceolate or boat-shaped piece on the screen from its base P (view space) along h, length l, width w: widest at pk, pointed (tip), blunt at its foot (foot) */
function l92Lance(P,h,l,w,pk=.5,n=10,tip=1,foot=.25){const s=[h[0],-h[1]],sl=Math.hypot(s[0],s[1])||1,u=[s[0]/sl,s[1]/sl],v=[-u[1],u[0]],L=l*Math.max(.3,sl),b=[P[0],-P[1]],A=[],B=[];
  for(let i=0;i<=n;i++){const t=i/n,wt=t<pk?foot+(1-foot)*Math.sin(t/pk*Math.PI/2):Math.pow(Math.cos((t-pk)/(1-pk)*Math.PI/2),tip),x=t*L,y=w*.5*wt;A.push([b[0]+u[0]*x+v[0]*y,b[1]+u[1]*x+v[1]*y]);B.push([b[0]+u[0]*x-v[0]*y,b[1]+u[1]*x-v[1]*y])}
  return A.concat(B.reverse())}
const l92Path=Q=>'M'+Q.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z';
/* a fine stroke (awn, pedicel) through view-space points, never under L92_W */
const l92Line=Q=>'M'+Q.map(p=>f(p[0])+','+f(-p[1])).join('L');
/* three tones of a part lit by its normal n */
const l92Ti=(n,j=0)=>{const I=lightI(n)+j;return I<.5?0:I<.78?1:2};
/* the turtle rules shared by the culms: internodes longer upward (the peduncle longest), a node (Nd) at each, a leaf blade (Lf → b organs) from the chosen nodes */
const L92_IN=[.07,.1,.14,.19,.22,.28];
function l92Leaf(id,len,n,tw,e,side){return[['[',{c:'leaf'}],['/',{a:side}],['&',{a:R(26,40)}],['Lf',{id,j:0,n,l:len/n,tw,e}],[']',{}]]}
const L92_LF=p=>{const out=[['b',{id:p.id,j:p.j}]];if(p.j<p.n)out.push(['/',{a:p.tw*R(.6,1.4)}],['F',{l:p.l,e:p.e*Math.pow((p.j+1)/p.n,1.3),wig:.012}],['Lf',Object.assign({},p,{j:p.j+1})]);return out};
/* the culms and leaves of a plant grown by the turtle: culm tubes (cut at the head when cut(ch) gives an index), node rings, leaf ribbons */
function l92Stalks(A,res,Wq,o,parts){const{bq,st:stc,leaf,dry,wid,cut}=o,cul=lnCols(stc,'#fffaf0'),ink=h2l(stc)[2]>.66?shd(stc,-.5):null,heads=[];
  for(const ch of res.chains){if(ch.c!=='culm')continue;const ci=cut?cut(ch):-1,n=ci>0?ci+1:ch.pts.length;
    lnTube(ch.pts.slice(0,n).map(Wq),ch.ws.slice(0,n),()=>cul,parts,{gloss:.3,piece:24,min:bq?.56:.53,ink});if(ci>0)heads.push(ch.pts.slice(ci))}
  /* the leaves: each blade a ribbon (keeled at its midrib on the sheets), long and narrow, pointed, twisting as it arches */
  const bl=new Map();for(const og of res.organs)if(og.t==='b'){let a=bl.get(og.p.id);if(!a)bl.set(og.p.id,a=[]);a[og.p.j]=og}
  const pl=lnPals(leaf,mix(leaf,dry?'#c8bc98':'#b4c19a',.3),mix(leaf,dry?'#e8dcb8':'#d8dcb0',.45));let bi=0;
  for(const a of bl.values()){const q=a.filter(Boolean);if(q.length<3)continue;const P=[],U=[],V=[],W=[];
    q.forEach((og,j)=>{const H=A.Wv(og.pos,og.H),U0=A.Wv(og.pos,og.U);P.push(Wq(og.pos));U.push(V3.nz(V3s(U0,V3.sc(H,V3.dot(U0,H)))));const v=j/(q.length-1);V.push(v);
      W.push(wid*(v<.08?.55+5.6*v:Math.max(.05,Math.pow(1-(v-.08)/.92,.75))))});
    lnRibbon(P,U,W,V,{pal:pl.pal,palB:pl.palB,th:bq?.85:.4,piece:14,dI:DET>=1.5?.07:.12,mid:1,pale:dry,zb:(bi++)*.001},parts)}
  /* the nodes: a ring a little swollen and darker round the culm (part of it, never apart) */
  for(const og of res.organs){if(og.t!=='Nd')continue;const P=Wq(og.pos),H=A.Wv(og.pos,og.H),w=Math.max(bq?1.2:1.12,og.w*1.3)/2,a=[P[0]-H[0]*1.1,-(P[1]-H[1]*1.1)],b=[P[0]+H[0]*1.3,-(P[1]+H[1]*1.3)],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],Pc=pal7(stc);
    parts.push({z:P[2]+.03,fn:par=>{E('path',{d:polyRibbon([a,m,b],i=>w*(i===1?1.08:.94)),fill:toneAt(Pc,.36)},par);if(!LOD&&DET>=1.5)E('path',{d:polyRibbon([a,m,b],i=>w*.3,i=>w*.45),fill:toneAt(Pc,.7),opacity:.8},par)}})}
  return heads}
/* the sheath of the flag leaf round a head still in the boot: from b0 to t0 (view space), half-width w */
function l92Sheath(parts,b0,t0,w,col){const B=[b0[0],-b0[1]],T=[t0[0],-t0[1]],dx=T[0]-B[0],dy=T[1]-B[1],ll=Math.hypot(dx,dy)||1,nx=-dy/ll*w,ny=dx/ll*w;
  parts.push({z:Math.max(b0[2],t0[2])+2,fn:par=>{E('path',{d:`M${f(B[0]+nx*.8)},${f(B[1]+ny*.8)}C${f(B[0]+dx*.4+nx*1.05)},${f(B[1]+dy*.4+ny*1.05)} ${f(B[0]+dx*.85+nx*.6)},${f(B[1]+dy*.85+ny*.6)} ${f(T[0])},${f(T[1])}C${f(B[0]+dx*.8-nx*.45)},${f(B[1]+dy*.8-ny*.45)} ${f(B[0]+dx*.4-nx)},${f(B[1]+dy*.4-ny)} ${f(B[0]-nx*.8)},${f(B[1]-ny*.8)}Z`,fill:toneAt(pal7(col),.62),stroke:shd(col,-.5),'stroke-width':.3,'stroke-opacity':.5},par);
    if(!LOD)E('path',{d:`M${f(B[0]+dx*.1)},${f(B[1]+dy*.1)}L${f(B[0]+dx*.9+nx*.15)},${f(B[1]+dy*.9+ny*.15)}`,stroke:toneAt(pal7(col),.86),'stroke-width':.5,'stroke-opacity':.6,fill:'none'},par)}})}
/* a rachis or branch (view-space points) as items: pieces of a tapered ribbon, each at its depth */
function l92Axis(items,P,w0,w1,col,k,o=0){const S=P.map(p=>[p[0],-p[1]]),n=S.length;for(let a=0;a<n-1;a+=3){const b=Math.min(n-1,a+4),Q=S.slice(a,b+1);let z=0;for(let i=a;i<=b;i++)z+=P[i][2];
    items.push({z:z/(b-a+1)-.01,k,o,st:{fill:col},d:polyRibbon(Q,i=>Math.max(L92_W/2,(w0+(w1-w0)*(a+i)/(n-1))/2))})}}
/* an awn: from p0 along d (view space), bending toward the ground by bend, l long; m points */
function l92Awn(p0,d,l,bend,m=6){const Q=[p0];let p=p0,h=V3.nz(d);for(let i=0;i<m;i++){h=V3.nz(V3.add(h,[0,-bend/m,0]));p=V3.add(p,V3.sc(h,l/m));Q.push(p)}return Q}

/* ---------- blé (Triticum aestivum, T. turgidum, T. durum): fine hollow culms, straw yellow, with dark swollen nodes; long narrow blades from the nodes (dry and curling in a dried bunch);
   at the top a two-sided spike 7–10 cm: 16–22 spikelets set alternately on the two faces of a zigzag rachis, each of three or four florets in two glumes, fanned in the plane across the spike;
   bearded wheats carry a straight awn 4–8 cm on each lemma, the beardless ones a mere point. Stages: in the boot (the spike in the sheath of the flag leaf, awns peeping), green in ear, ripe (golden, nodding a little).
   Sold dried in bunches (gold, bleached, black-bearded, dyed) or fresh green ---------- */
const L92_CW_BLE=[
 {id:'dore',n:'Doré barbu (séché)',c:'#d6b25e',st:'#d8c07a',aw:'#c8a24e',b:1},
 {id:'dore-nu',n:'Doré sans barbe (séché)',c:'#d9b866',st:'#dcc583',aw:'#c8a24e',b:0},
 {id:'naturel',n:'Paille naturel',c:'#e2d0a2',st:'#ddcf9e',aw:'#c9b27a',b:1},
 {id:'vert',n:'Vert (frais)',c:'#9fb168',st:'#a7b878',aw:'#8ea25a',b:1,fresh:1},
 {id:'barbe-noire',n:'Barbe noire (Black Beard)',c:'#d8bf86',st:'#d6c38c',aw:'#3a2a26',b:1},
 {id:'blanchi',n:'Blanchi',c:'#f0e9d6',st:'#e6dcc0',aw:'#ddd0ae',b:1},
 {id:'bordeaux',n:'Teint bordeaux',c:'#6a3b4a',st:'#7a5058',aw:'#5a3440',b:1}];
function l92Ble(g,t,o){const cw=cwPick(L92_CW_BLE,o),k=G(g),parts=[],{bq,A,L,Rm,fd,op}=l92Base(o,'ble',60),st=op<.3?0:op<.75?1:2,
    as=Math.max(.7,Math.min(1.25,L/(60*UPC))),nc=bq?(o.short?1:2):3,ns=Math.round(R(16,20)),Ls=R(7.5,9.5)*UPC*Math.pow(as,.4)*[.72,.94,1][st],wc=Math.max(2.1,.34*UPC*Math.pow(as,.3)),
    Lc=L-Ls*(st===0?.35:1),dry=!cw.fresh,nod=st===2?R(.014,.03):st===1?.004:0;
  const rules={S:()=>{const out=[];for(let c=0;c<nc;c++)out.push(['[',{c:'culm',w:wc*R(.92,1.05)}],['/',{a:c*137.5+R(-20,20)}],['&',{a:c?R(2,4.5):R(0,1.2)}],['C',{i:0,h:c?R(.85,.96):1,c}],[']',{}]);return out},
    C:p=>{if(p.i>=L92_IN.length)return[['Hd',{c:p.c}],['K',{j:0,c:p.c,h:p.h,hp:[R(0,1),R(1,3),R(3,7)][st]}]];const top=p.i>=5,out=[['F',{l:Lc*p.h*L92_IN[p.i]*R(.94,1.06),w1:wc*(1-.3*(p.i+1)/6),aim:top?null:L92_UP,k:.12,wig:.004,e:top?nod*.4:0}],['Nd',{c:p.c}]];
      const y=Lc*p.h*L92_IN.slice(0,p.i+1).reduce((s,x)=>s+x,0);if(p.i>=1&&p.i<=3&&(!bq||y>L*.42)&&(p.c===0||rnd()<.6))out.push(...l92Leaf(p.c+'-'+p.i,(dry?R(11,17):R(15,22))*UPC*as*(p.i===3?.8:1),9,dry?R(-30,30):R(-10,10),dry?R(.06,.12):R(.04,.08),p.i*170+p.c*60+R(-30,30)));
      out.push(['C',{i:p.i+1,c:p.c,h:p.h}]);return out},
    Lf:L92_LF,
    /* the rachis: short internodes, a spikelet organ at each (k), nodding with the ripe weight */
    K:p=>p.j>ns?[]:[['&',{a:p.j<4?p.hp/4:0}],['F',{l:Ls*p.h/(ns+1)*(p.j<2?1.3:1),w1:.1*UPC,e:nod*(.4+p.j/ns),wig:.002,seg:1e6}],['k',{j:p.j,c:p.c}],['K',Object.assign({},p,{j:p.j+1})]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,L92_IN.length+ns+14),{p:[0,0,0],H:L92_UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:Math.max(4,L/40),w:wc}),Wq=l40Lay(A,bq,L,Rm,fd);
  const hd=new Set(res.organs.filter(og=>og.t==='Hd').map(og=>og.pos));
  l92Stalks(A,res,Wq,{bq,st:cw.st,leaf:dry?mix(cw.st,'#b8ac80',.35):'#6f8f48',dry,wid:R(.95,1.25)*UPC*Math.pow(as,.3),cut:ch=>ch.pts.findIndex(q=>hd.has(q))},parts);
  /* the spikes: spikelets alternate on the two faces of the rachis (L), their florets fanned across it (U); the awns behind and before them by depth */
  const col=st===0?mix(cw.c,'#8fae5a',cw.fresh?.2:.62):st===1&&!cw.fresh?mix(cw.c,'#a9bb6c',.32):cw.c,P=pal7(col),tn=[toneAt(P,.36),toneAt(P,.58),toneAt(P,.8)],ink=shd(col,-.5),
    Pa=pal7(st===0&&cw.aw!=='#3a2a26'?mix(cw.aw,'#8fae5a',.5):cw.aw),an=[toneAt(Pa,.5),toneAt(Pa,.76)],lf=R(.95,1.1)*UPC*Math.pow(as,.3),wf=lf*.48,La=R(5,7.5)*UPC*Math.pow(as,.3)*[.45,.85,1][st],
    stk=(c,j)=>({fill:c,stroke:LOD?'none':ink,'stroke-width':.28,'stroke-opacity':.55,'stroke-linejoin':'round'});
  for(let c=0;c<nc;c++){const ks=res.organs.filter(og=>og.t==='k'&&og.p.c===c);if(!ks.length)continue;const items=[];
    const ra=[ks[0].pos,...ks.map(og=>og.pos)].map(Wq);l92Axis(items,ra,.16*UPC,.1*UPC,toneAt(P,.4),'ra',0);
    for(const og of ks){const fr=l92Fr(A,og,Wq),j=og.p.j,u=j/ns,s=j%2?1:-1,top=j===ns,sz=(.72+.28*Math.sin(Math.PI*Math.min(1,.12+u*.95)))*(top?.85:1),an0=(st===0?12:st===1?20:28)*D*R(.85,1.15)*(top?.2:1),
        B=V3.add(fr.P,V3.sc(fr.L,s*.06*UPC)),d0=V3.nz(V3.add(V3.sc(fr.H,Math.cos(an0)),V3.sc(fr.L,s*Math.sin(an0)))),nf=st===0?3:4;
      for(let m=0;m<nf;m++){const q=m===3?0:m-1,lift=m===3?.42:q?0:.22,b=V3.add(V3.add(B,V3.sc(d0,lf*lift*sz)),V3.sc(fr.U,q*wf*.42*sz)),dir=V3.nz(V3.add(d0,V3.sc(fr.U,q*(st===0?.12:.3)))),
          n=V3.nz(V3.add(V3.add(V3.sc(fr.L,s*.5),V3.sc(fr.U,.4+.5*q)),[0,0,.25])),ti=l92Ti(n,R(-.05,.05)),l=lf*sz*(m===3?.85:1),Q=l92Lance(b,dir,l,wf*sz*(m===3?.85:1),.42,DET>=1.5?10:6,.8,.45),zc=b[2]+dir[2]*l*.5;
        items.push({z:zc,k:'g'+ti,o:2+ti,st:stk(tn[ti]),d:l92Path(Q)});
        if(DET>=1.5&&!LOD&&l>3){const m0=V3.add(b,V3.sc(dir,l*.2)),m1=V3.add(b,V3.sc(dir,l*.85));items.push({z:zc+.01,k:'cr',o:6,st:{fill:'none',stroke:ink,'stroke-width':.3,'stroke-opacity':.45},d:l92Line([m0,m1])})}
        /* the awn: from the tip of the lemma, closer to the axis than the floret, splaying a little; the beardless a short point */
        if(cw.b?(m===1||m===3||(m===0&&rnd()<.35)):(top&&m===1)){const tp=V3.add(b,V3.sc(dir,l*.92)),da=V3.nz(V3.add(V3.add(dir,V3.sc(fr.H,1.2)),V3.sc(fr.L,s*R(.05,.3)*(.6+.8*u)))),la=cw.b?La*R(.8,1.1)*(.6+.4*sz):lf*.6,Q2=l92Awn(tp,da,la,st===2?R(.06,.16):.02,5);
          items.push({z:(tp[2]+Q2[5][2])/2,k:'a'+(ti>1?1:0),o:1,st:{fill:'none',stroke:an[ti>1?1:0],'stroke-width':l92Aw(bq),'stroke-linecap':'round','stroke-linejoin':'round'},d:l92Line(Q2)})}}}
    const z0=l92Z(items),dr=l92Bands(items,DET>=1.5?6:3);parts.push({z:z0,fn:dr});
    if(st===0){const e=ks[Math.round(ks.length*.55)],b0=Wq(ks[0].pos),t0=Wq(e.pos);l92Sheath(parts,V3.add(b0,V3.sc(A.Wv(ks[0].pos,ks[0].H),-Ls*.35)),t0,wf*1.15,dry?mix(cw.st,'#9aa070',.3):'#7f9f56')}}
  drawParts(k,parts);open(k,t,1100,0,.4);return{k,bw:2.2,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}

/* ---------- avoine (Avena sativa): a culm with three or four nodes and broad soft blades; at its top a loose panicle 15–25 cm, its branches in half-whorls of two to five,
   fine and drooping, each ending in a pendant spikelet 2–2.5 cm — two big papery glumes like a little bell (a lantern) round two grains, sometimes a short kneed awn.
   Stages: in the boot (the panicle tight in the sheath), green and upright (branches held up), ripe and pale straw (branches spread, spikelets hanging). Sold fresh green, dried straw, bleached or dyed ---------- */
const L92_CW_AVO=[
 {id:'vert',n:'Vert pâle (frais)',c:'#a6b77a',st:'#9fb06e',fresh:1},
 {id:'paille',n:'Paille naturel',c:'#d8c58f',st:'#cdbb86'},
 {id:'blanchi',n:'Blanchi',c:'#f1ece0',st:'#e2d9c2'},
 {id:'jaune',n:'Teint jaune',c:'#e6c84c',st:'#d0b44a'},
 {id:'orange',n:'Teint orange',c:'#df853b',st:'#c27238'},
 {id:'rouge',n:'Teint rouge',c:'#b0373a',st:'#94343a'},
 {id:'rose',n:'Teint rose',c:'#e3a6b4',st:'#c79aa2'}];
function l92Avoine(g,t,o){const cw=cwPick(L92_CW_AVO,o),k=G(g),parts=[],{bq,A,L,Rm,fd,op}=l92Base(o,'avoine',60),st=op<.3?0:op<.75?1:2,
    as=Math.max(.7,Math.min(1.25,L/(60*UPC))),nc=bq?1:2,Lp=R(17,23)*UPC*Math.pow(as,.5)*[.55,.85,1][st],wc=Math.max(2,.32*UPC*Math.pow(as,.3)),Lc=L-Lp*(st===0?.3:.88),dry=!cw.fresh,nW=5,
    spread=[.08,.45,1][st];
  const rules={S:()=>{const out=[];for(let c=0;c<nc;c++)out.push(['[',{c:'culm',w:wc*R(.92,1.05)}],['/',{a:c*150+R(-20,20)}],['&',{a:c?R(3,6):R(0,1.5)}],['C',{i:0,h:c?R(.8,.92):1,c}],[']',{}]);return out},
    C:p=>{if(p.i>=L92_IN.length)return[['Hd',{c:p.c}],['Ra',{j:0,c:p.c,h:p.h}]];const out=[['F',{l:Lc*p.h*L92_IN[p.i]*R(.94,1.06),w1:wc*(1-.3*(p.i+1)/6),aim:L92_UP,k:.12,wig:.004}],['Nd',{c:p.c}]];
      const y=Lc*p.h*L92_IN.slice(0,p.i+1).reduce((s,x)=>s+x,0);if(p.i>=1&&p.i<=3&&(!bq||y>L*.42)&&(p.c===0||rnd()<.5))out.push(...l92Leaf(p.c+'-'+p.i,R(14,22)*UPC*as*(p.i===3?.75:1),9,dry?R(-30,30):R(-12,12),dry?R(.07,.13):R(.05,.1),p.i*170+p.c*60+R(-30,30)));
      out.push(['C',{i:p.i+1,c:p.c,h:p.h}]);return out},
    Lf:L92_LF,
    /* the rachis of the panicle: a half-whorl at each node, the lower ones longest; branches arching out under their spikelets */
    Ra:p=>{if(p.j>=nW)return[['F',{l:Lp*p.h*.08,w1:.06*UPC,e:.01*spread}],['sp',{c:p.c,tip:1}]];const q=p.j/(nW-1),nb=[5,4,3,2,2][p.j],out=[['F',{l:Lp*p.h*(.24-.06*q)*R(.9,1.1),w1:wc*.5*(1-.6*q),e:.01*spread,wig:.004}]];
      for(let b=0;b<nb;b++){const bl=Lp*p.h*(.55-.35*q)*R(.7,1.1),a=(4+50*spread*(1-.3*q))*R(.75,1.25);
        out.push(['[',{c:'br'+p.c,w:.09*UPC}],['/',{a:p.j*97+b*360/nb+R(-20,20)}],['&',{a}],['Bo',{j:0,n:4,l:bl/4,c:p.c,sub:b<2&&q<.6}],[']',{}])}
      out.push(['Ra',{j:p.j+1,c:p.c,h:p.h}]);return out},
    Bo:p=>{if(p.j>=p.n)return[['sp',{c:p.c}]];const out=[['F',{l:p.l*R(.85,1.15),w1:.07*UPC,e:(.02+.09*p.j/p.n)*spread,wig:.01}]];
      if(p.j>=1&&(p.sub&&p.j===1||rnd()<.35*spread))out.push(['[',{c:'br'+p.c,w:.07*UPC}],['/',{a:R(60,300)}],['&',{a:(6+30*spread)*R(.7,1.2)}],['F',{l:p.l*R(.5,.9),w1:.07*UPC,e:.08*spread}],['sp',{c:p.c}],[']',{}]);
      out.push(['Bo',Object.assign({},p,{j:p.j+1})]);return out}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,L92_IN.length+nW+12),{p:[0,0,0],H:L92_UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:Math.max(4,L/40),w:wc}),Wq=l40Lay(A,bq,L,Rm,fd);
  const hd=new Set(res.organs.filter(og=>og.t==='Hd').map(og=>og.pos));
  l92Stalks(A,res,Wq,{bq,st:cw.st,leaf:dry?mix(cw.st,'#b8ac80',.3):'#76944c',dry,wid:R(1.2,1.6)*UPC*Math.pow(as,.3),cut:ch=>ch.pts.findIndex(q=>hd.has(q))},parts);
  /* the panicle: its rachis and branches as fine tubes, the spikelets hanging from their tips: the back glume, the grains, the front glume (a bell open downward) */
  const col=st===0?mix(cw.c,'#8fae5a',cw.fresh?.2:.6):st===1&&!cw.fresh?mix(cw.c,'#b4c47e',.35):cw.c,P=pal7(col),ink=shd(col,-.48),Pg=pal7(shd(col,-.18)),br=toneAt(pal7(mix(cw.st,col,.4)),.48),
    ls=R(2,2.4)*UPC*Math.pow(as,.3)*[.75,.92,1][st],ws=ls*.36,stk=c=>({fill:c,stroke:LOD?'none':ink,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'});
  for(let c=0;c<nc;c++){const items=[];
    for(const ch of res.chains){if(ch.c==='culm'){const i=ch.pts.findIndex(q=>hd.has(q));if(i<0)continue;const og=res.organs.find(o2=>o2.t==='Hd'&&o2.pos===ch.pts[i]);if(!og||og.p.c!==c)continue;
        l92Axis(items,ch.pts.slice(i).map(Wq),Math.max(1.4,ch.ws[i]*.7),.07*UPC*2,br,'br')}}
    for(const ch of res.chains)if(ch.c==='br'+c)l92Axis(items,ch.pts.map(Wq),ch.ws[0],ch.ws[ch.ws.length-1],br,'br');
    for(const og of res.organs){if(og.t!=='sp'||og.p.c!==c)continue;const B=Wq(og.pos),Hf=og.H,dF=st===0?Hf:V3.nz(V3.add(V3.sc(Hf,st===1?.8:.15),[0,st===1?-.45:-1,0])),d=A.Wv(og.pos,dF),
        Sd=V3.nz(V3.cr(d,[0,0,1])),flare=(st===0?.06:.18)*R(.8,1.2),g1=V3.nz(V3.add(d,V3.sc(Sd,flare))),g2=V3.nz(V3.add(d,V3.sc(Sd,-flare))),l=ls*R(.88,1.08)*(og.p.tip?.9:1),
        n=V3.nz(V3.add(Sd,[0,0,.6])),ti=l92Ti(n,R(-.08,.08)),zc=B[2]+d[2]*l*.5,nd=DET>=1.5?10:6;
      items.push({z:zc-.02,k:'gb',o:3,st:stk(toneAt(Pg,.42)),d:l92Path(l92Lance(B,g2,l,ws,.58,nd,.9,.12))});
      if(st>0)items.push({z:zc-.01,k:'gr',o:4,st:stk(toneAt(P,.3)),d:l92Path(l92Lance(V3.add(B,V3.sc(d,l*.1)),d,l*.7,ws*.5,.5,nd,1,.3))});
      items.push({z:zc,k:'gf'+ti,o:5+ti,st:stk(toneAt(P,[.5,.68,.86][ti])),d:l92Path(l92Lance(B,g1,l*R(.92,1),ws*.95,.6,nd,.9,.12))});
      if(st===2&&rnd()<.3){const tp=V3.add(B,V3.sc(d,l*.75)),Q=l92Awn(tp,V3.nz(V3.add(d,V3.sc(Sd,.5))),l*.7,-.4,4);items.push({z:zc+.01,k:'aw',o:8,st:{fill:'none',stroke:toneAt(P,.35),'stroke-width':L92_W,'stroke-linecap':'round'},d:l92Line(Q)})}}
    if(!items.length)continue;parts.push({z:l92Z(items),fn:l92Bands(items,DET>=1.5?6:3)});
    if(st===0){const og=res.organs.find(o2=>o2.t==='Hd'&&o2.p.c===c);if(og){const b0=Wq(og.pos),H=A.Wv(og.pos,og.H),t0=V3.add(b0,V3.sc(H,Lp*.6));l92Sheath(parts,V3.add(b0,V3.sc(H,-Lp*.25)),t0,ws*1.1,dry?mix(cw.st,'#9aa070',.3):'#7f9f56')}}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:2.2,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}

/* ---------- orge (Hordeum vulgare, two-rowed H. distichon): a culm with three nodes and blades clasping it with their auricles; at its top a compact spike 5–8 cm,
   one fertile spikelet per node of the rachis (two rows) flanked by two small sterile ones; each grain carries a stiff rough awn 10–15 cm, all of them in a long silky brush
   that follows the spike: upright when green, bent over with it when ripe. Sold fresh green, dried natural gold, black (Black Barley) or bleached ---------- */
const L92_CW_ORG=[
 {id:'dore',n:'Doré naturel',c:'#d8c48a',st:'#d6c58e',aw:'#d2bd80'},
 {id:'vert',n:'Vert (frais)',c:'#9eb36a',st:'#a6b878',aw:'#a3b672',fresh:1},
 {id:'blond',n:'Blond pâle',c:'#e6d9b0',st:'#ddd0a4',aw:'#e2d4a8'},
 {id:'noir',n:'Noir (Black Barley)',c:'#3e2a3e',st:'#b8a47a',aw:'#2e2230'},
 {id:'blanchi',n:'Blanchi',c:'#f1ebdc',st:'#e5dcc4',aw:'#ece4d0'},
 {id:'teint-vert',n:'Stabilisé vert sauge',c:'#8a9e78',st:'#8c9a74',aw:'#94a684'}];
function l92Orge(g,t,o){const cw=cwPick(L92_CW_ORG,o),k=G(g),parts=[],{bq,A,L,Rm,fd,op}=l92Base(o,'orge',55),st=op<.3?0:op<.75?1:2,
    as=Math.max(.7,Math.min(1.25,L/(55*UPC))),nc=bq?(o.short?1:2):3,ns=Math.round(R(18,24)),Ls=R(5.5,7.5)*UPC*Math.pow(as,.4)*[.75,.95,1][st],wc=Math.max(2,.3*UPC*Math.pow(as,.3)),
    La=R(10,14)*UPC*Math.pow(as,.35)*[.5,.9,1][st],Lc=L-Ls*(st===0?.3:.8)-(st===2?La*.15:La*.5),dry=!cw.fresh,nod=[0,.012,R(.03,.045)][st];
  const rules={S:()=>{const out=[];for(let c=0;c<nc;c++)out.push(['[',{c:'culm',w:wc*R(.92,1.05)}],['/',{a:c*137.5+R(-20,20)}],['&',{a:c?R(2,5):R(0,1.5)}],['C',{i:0,h:c?R(.86,.96):1,c}],[']',{}]);return out},
    C:p=>{if(p.i>=L92_IN.length)return[['Hd',{c:p.c}],['K',{j:0,c:p.c,h:p.h,hp:[R(0,1),R(3,6),R(8,14)][st]}]];const top=p.i>=5,out=[...(top&&st===2?[['&',{a:R(1,2)}]]:[]),['F',{l:Lc*p.h*L92_IN[p.i]*R(.94,1.06),w1:wc*(1-.3*(p.i+1)/6),aim:top?null:L92_UP,k:.12,wig:.004,e:top?nod*.25:0}],['Nd',{c:p.c}]];
      const y=Lc*p.h*L92_IN.slice(0,p.i+1).reduce((s,x)=>s+x,0);if(p.i>=1&&p.i<=3&&(!bq||y>L*.42)&&(p.c===0||rnd()<.55))out.push(...l92Leaf(p.c+'-'+p.i,(dry?R(10,15):R(13,20))*UPC*as*(p.i===3?.75:1),9,dry?R(-30,30):R(-10,10),dry?R(.06,.12):R(.05,.09),p.i*170+p.c*60+R(-30,30)));
      out.push(['C',{i:p.i+1,c:p.c,h:p.h}]);return out},
    Lf:L92_LF,
    K:p=>p.j>ns?[]:[['&',{a:p.j<5?p.hp/5:0}],['F',{l:Ls*p.h/(ns+1),w1:.09*UPC,e:nod*(1+p.j/ns),seg:1e6}],['k',{j:p.j,c:p.c}],['K',Object.assign({},p,{j:p.j+1})]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,L92_IN.length+ns+14),{p:[0,0,0],H:L92_UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:Math.max(4,L/40),w:wc}),Wq=l40Lay(A,bq,L,Rm,fd);
  const hd=new Set(res.organs.filter(og=>og.t==='Hd').map(og=>og.pos));
  l92Stalks(A,res,Wq,{bq,st:cw.st,leaf:dry?mix(cw.st,'#b8ac80',.35):'#6f9050',dry,wid:R(1,1.3)*UPC*Math.pow(as,.3),cut:ch=>ch.pts.findIndex(q=>hd.has(q))},parts);
  /* the spike: the grains pressed to the rachis in two rows, the sterile spikelets as slivers beside them; the awns from every grain run on with the spike and bend with it */
  const col=st===0?mix(cw.c,'#8fae5a',cw.fresh?.2:.6):st===1&&!cw.fresh?mix(cw.c,'#a9bb6c',.3):cw.c,P=pal7(col),dk=h2l(col)[2]<.35,tn=[toneAt(P,dk?.5:.36),toneAt(P,dk?.66:.58),toneAt(P,dk?.84:.8)],ink=shd(col,dk?.25:-.5),
    Pa=pal7(st===0?mix(cw.aw,'#8fae5a',.4):cw.aw),an=[toneAt(Pa,dk?.5:.4),toneAt(Pa,dk?.72:.66)],lg=R(.85,1)*UPC*Math.pow(as,.3),wg=lg*.4,
    stk=c=>({fill:c,stroke:LOD?'none':ink,'stroke-width':.28,'stroke-opacity':.55,'stroke-linejoin':'round'});
  for(let c=0;c<nc;c++){const ks=res.organs.filter(og=>og.t==='k'&&og.p.c===c);if(!ks.length)continue;const items=[];
    l92Axis(items,[ks[0].pos,...ks.map(og=>og.pos)].map(Wq),.14*UPC,.09*UPC,toneAt(P,.4),'ra',0);
    for(let i=0;i<ks.length;i++){const og=ks[i],fr=l92Fr(A,og,Wq),j=og.p.j,u=j/ns,s=j%2?1:-1,sz=.8+.2*Math.sin(Math.PI*Math.min(1,.1+u)),an0=(st===0?8:13)*D*R(.85,1.15),
        B=V3.add(fr.P,V3.sc(fr.L,s*.05*UPC)),dir=V3.nz(V3.add(V3.sc(fr.H,Math.cos(an0)),V3.sc(fr.L,s*Math.sin(an0)))),l=lg*sz,n=V3.nz(V3.add(V3.sc(fr.L,s*.6),[0,0,.5])),ti=l92Ti(n,R(-.05,.05)),zc=B[2]+dir[2]*l*.5;
      for(const q of[-1,1]){const b2=V3.add(B,V3.sc(fr.U,q*wg*.42)),d2=V3.nz(V3.add(dir,V3.sc(fr.U,q*.25)));items.push({z:b2[2]+d2[2]*l*.35-.02,k:'st',o:2,st:stk(tn[0]),d:l92Path(l92Lance(b2,d2,l*.7,wg*.42,.4,6,.8,.4))})}
      items.push({z:zc,k:'g'+ti,o:3+ti,st:stk(tn[ti]),d:l92Path(l92Lance(B,dir,l,wg*sz,.45,DET>=1.5?10:6,.85,.4))});
      /* the awn follows the spike: its heading is the rachis' a little further on, bending as much again */
      const tp=V3.add(B,V3.sc(dir,l*.9)),ah=V3.nz(V3.add(V3.sc(fr.H,1),V3.sc(dir,.12))),Q=l92Awn(tp,V3.nz(V3.add(ah,V3.sc(fr.L,s*R(.01,.05)))),La*R(.88,1.08)*(.7+.3*sz),[.01,.05,R(.1,.18)][st],6);
      items.push({z:(tp[2]+Q[6][2])/2-.005,k:'a'+(ti>1?1:0),o:1,st:{fill:'none',stroke:an[ti>1?1:0],'stroke-width':l92Aw(bq),'stroke-linecap':'round','stroke-linejoin':'round'},d:l92Line(Q)})}
    parts.push({z:l92Z(items),fn:l92Bands(items,DET>=1.5?6:3)});
    if(st===0){const e=ks[Math.round(ks.length*.6)],H=A.Wv(ks[0].pos,ks[0].H);l92Sheath(parts,V3.add(Wq(ks[0].pos),V3.sc(H,-Ls*.3)),Wq(e.pos),wg*1.3,dry?mix(cw.st,'#9aa070',.3):'#7f9f56')}}
  drawParts(k,parts);open(k,t,1100,0,.4);return{k,bw:2.2,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}

/* ---------- sorgho à balai (Sorghum bicolor var. technicum, broomcorn): a stout cane-like culm 1 cm thick, its nodes clasped by papery sheaths (the blades stripped from a dried stem);
   the panicle 30–60 cm: a very short axis from which spring long stiff fibrous branches, upright like a broom and gently arching at their tips, beset in their upper half
   with clusters of round grains 3–4 mm in shiny glumes — burgundy, rust, bronze, gold or cream, green when young. Stages: emerging (a tight sheaf), spreading, full broom ---------- */
const L92_CW_SOR=[
 {id:'dore',n:'Doré',c:'#d4b97a',st:'#cdb47c'},
 {id:'rouille',n:'Rouge brique',c:'#b9502e',st:'#c8a870'},
 {id:'bronze',n:'Bronze',c:'#a0532e',st:'#bfa06a'},
 {id:'bordeaux',n:'Bordeaux',c:'#5e2b3e',st:'#b89e6c'},
 {id:'brun',n:'Brun chocolat',c:'#7a5234',st:'#bba06e'},
 {id:'creme',n:'Crème',c:'#ece0c0',st:'#d7c79c'},
 {id:'vert',n:'Vert (frais)',c:'#8fa25a',st:'#a7b06e',fresh:1}];
function l92Sorgho(g,t,o){const cw=cwPick(L92_CW_SOR,o),k=G(g),parts=[],{bq,A,L,Rm,fd,op}=l92Base(o,'sorgho-a-balai',80,R(-.03,.03)),st=op<.3?0:op<.75?1:2,
    as=Math.max(.7,Math.min(1.3,L/(80*UPC))),Lp=Math.min(L*.5,R(32,42)*UPC*Math.pow(as,.6))*[.7,.9,1][st],wc=Math.max(3,R(.75,.9)*UPC*Math.pow(as,.4)),Lc=L-Lp*.92,nb=Math.round(R(14,19)*(bq?.85:1)),
    spread=[.12,.5,1][st];
  const rules={C:p=>{if(p.i>=5)return[['Hd',{}],['F',{l:Lp*.06,w1:wc*.55,aim:L92_UP,k:.1}],['W',{}]];const out=[['F',{l:Lc*[.12,.16,.2,.22,.3][p.i]*R(.95,1.05),w1:wc*(1-.28*(p.i+1)/5),aim:L92_UP,k:.14,wig:.003}],['Nd',{}]];out.push(['C',{i:p.i+1}]);return out},
    /* the broom: all the branches from a short axis, the outer ones leaning out more; each a stiff fibre arching at its tip, grain clusters up its upper part */
    W:()=>{const out=[];for(let b=0;b<nb;b++){const r=b/nb,a=(3+(6+20*spread)*Math.sqrt(r))*R(.8,1.2),bl=Lp*R(.78,1)*(1-.1*r);
        out.push(['[',{c:'br',w:.18*UPC}],['/',{a:b*137.5+R(-15,15)}],['F',{l:Lp*.04*r,w1:.16*UPC}],['&',{a}],['Bs',{j:0,n:8,l:bl/8}],[']',{}])}return out},
    Bs:p=>{if(p.j>=p.n)return[['cl',{tip:1}]];const out=[['F',{l:p.l*R(.92,1.08),w1:.14*UPC*(1-.55*(p.j+1)/p.n),e:(.004+.05*Math.pow(p.j/p.n,2))*spread,aim:p.j<3?L92_UP:null,k:.05,wig:.01}]];
      if(p.j>=2){out.push(['cl',{}]);for(let q=0;q<(p.j>=4?2:1);q++)if(rnd()<.75)out.push(['[',{c:'tw',w:.08*UPC}],['/',{a:R(0,360)}],['&',{a:R(16,34)}],['F',{l:p.l*R(.3,.65),w1:.07*UPC,e:.02*spread}],['cl',{h:1}],[']',{}])}
      out.push(['Bs',Object.assign({},p,{j:p.j+1})]);return out}};
  const res=lsTurtle(lsDerive([['C',{i:0}]],rules,24),{p:[0,0,0],H:L92_UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:Math.max(4,L/40),w:wc}),Wq=l40Lay(A,bq,L,Rm,fd);
  res.chains[0].c='culm';const hd=new Set(res.organs.filter(og=>og.t==='Hd').map(og=>og.pos));
  l92Stalks(A,res,Wq,{bq,st:cw.st,leaf:'#7a8a4a',dry:true,wid:1,cut:ch=>ch.pts.findIndex(q=>hd.has(q))},parts);
  /* the papery sheaths clasping the culm above its nodes */
  for(const og of res.organs){if(og.t!=='Nd'||og.pos[1]>Lc*.9||(bq&&og.pos[1]<L*.3))continue;const P0=Wq(og.pos),H=A.Wv(og.pos,og.H),P1=V3.add(P0,V3.sc(H,R(6,9)*UPC*as)),S=[P0,V3.add(P0,V3.sc(H,R(6,9)*UPC*as*.5)),P1].map(p=>[p[0],-p[1]]),w=og.w*.62,sc=mix(cw.st,'#c8b88a',.4);
    parts.push({z:P0[2]+.04,fn:par=>{E('path',{d:polyRibbon(S,i=>w*[1.05,.98,.9][i]),fill:toneAt(pal7(sc),.62),stroke:shd(sc,-.45),'stroke-width':.3,'stroke-opacity':.5},par);
      if(!LOD)E('path',{d:polyRibbon(S,i=>w*.25,i=>w*.5),fill:toneAt(pal7(sc),.84),opacity:.7},par)}})}
  /* the broom: fibres and twigs as fine tubes, grains in clusters round their points, each touching its fibre */
  const items=[],col=st===0?mix(cw.c,'#8fae5a',cw.fresh?.2:.55):cw.c,P=pal7(col),dk=h2l(col)[2]<.4,tn=[toneAt(P,dk?.42:.34),toneAt(P,dk?.6:.56),toneAt(P,dk?.8:.78)],fib=toneAt(pal7(mix(cw.st,col,.25)),.5),
    rg=R(.19,.23)*UPC*Math.pow(as,.2)*(st===0?.8:1),hl=mix(col,'#ffffff',dk?.3:.5);
  {const c0=res.chains[0],i=c0.pts.findIndex(q=>hd.has(q));if(i>=0)l92Axis(items,c0.pts.slice(i).map(Wq),c0.ws[i],c0.ws[c0.ws.length-1],fib,'f')}
  for(const ch of res.chains)if(ch.c==='br'||ch.c==='tw')l92Axis(items,ch.pts.map(Wq),ch.ws[0],ch.ws[ch.ws.length-1],fib,'f');
  for(const og of res.organs){if(og.t!=='cl')continue;const C=Wq(og.pos),H=A.Wv(og.pos,og.H),n=Math.round((og.p.tip?R(6,9):og.p.h?R(4,7):R(4,6))*(st===0?.7:1));
    for(let i=0;i<n;i++){const r=V3.nz([R(-1,1),R(-1,1),R(-1,1)]),off=V3.add(V3.sc(r,rg*R(.4,.9)),V3.sc(H,rg*R(-.8,1.6))),p=V3.add(C,off),ti=l92Ti(V3.nz(V3.add(r,[0,0,.4])),R(-.08,.08)),rr=rg*R(.85,1.1);
      items.push({z:p[2],k:'s'+ti,o:2+ti,st:{fill:tn[ti],stroke:LOD?'none':shd(col,-.5),'stroke-width':.25,'stroke-opacity':.5},d:l23Cir(p[0],-p[1],rr)});
      if(DET>=1.5&&!LOD&&ti>0)items.push({z:p[2]+.001,k:'h',o:6,st:{fill:hl,opacity:.55},d:l23Cir(p[0]-rr*.32,-p[1]-rr*.32,rr*.3)})}}
  parts.push({z:l92Z(items),fn:l92Bands(items,DET>=1.5?6:3)});
  if(st===0){const og=res.organs.find(o2=>o2.t==='Hd');if(og){const b0=Wq(og.pos),H=A.Wv(og.pos,og.H);l92Sheath(parts,V3.add(b0,V3.sc(H,-Lp*.15)),V3.add(b0,V3.sc(H,Lp*.45)),wc*1.1,mix(cw.st,'#9aa070',.35))}}
  drawParts(k,parts);open(k,t,1200,0,.35);return{k,bw:wc,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}

/* ---------- broom bloom: the dried flowering switches of common broom (Cytisus scoparius, grown and dried in Italy, sold under this name natural, bleached or dyed):
   a slender green stem, five-angled, branching in its upper half into many erect wand-like twigs, almost leafless; along the twigs the small papery calyces and buds
   of the fallen flowers, single or paired at the nodes, and at the tips little clusters. Dyed it is coated all over in one colour. Stages: a sparse young switch, half full, full ---------- */
const L92_CW_BRM=[
 {id:'naturel',n:'Naturel vert olive',c:'#a0a060',st:'#7f8a4c'},
 {id:'blanchi',n:'Blanchi',c:'#f1ede2',st:'#e2dbc8'},
 {id:'jaune',n:'Teint jaune',c:'#e7c83c',st:'#d0b238'},
 {id:'orange',n:'Teint orange brûlé',c:'#e0803b',st:'#c46e34'},
 {id:'rouge',n:'Teint rouge',c:'#b3333b',st:'#9a2e36'},
 {id:'rose',n:'Teint rose',c:'#e8a9bb',st:'#d495a8'},
 {id:'lilas',n:'Teint lilas',c:'#b9a3d4',st:'#a28fbe'},
 {id:'mauve',n:'Teint mauve',c:'#8e5a8e',st:'#7a4c7a'},
 {id:'bleu',n:'Teint bleu foncé',c:'#34508e',st:'#2c4478'},
 {id:'vert',n:'Teint vert',c:'#5e8c46',st:'#4f7a3c'},
 {id:'paille',n:'Naturel paille',c:'#d7c47b',st:'#c2b070'}];
function l92Broom(g,t,o){const cw=cwPick(L92_CW_BRM,o),k=G(g),parts=[],{bq,A,L,Rm,fd,op}=l92Base(o,'broom-bloom',45,R(-.05,.05)),st=op<.3?0:op<.75?1:2,
    as=Math.max(.7,Math.min(1.3,L/(45*UPC))),wc=Math.max(1.6,.26*UPC*Math.pow(as,.3)),Lb=L*.42,full=[.55,.8,1][st];
  const rules={
    /* the stem: straight, the branches from about two fifths of its height, alternate on a 2/5 spiral, the lower ones longest */
    S:p=>{if(p.i>=4)return[['M',{j:0,n:11,w:wc*.7}]];return[['F',{l:Lb/4*R(.9,1.1),w1:wc*(1-.1*(p.i+1)),aim:L92_UP,k:.12,wig:.004}],['S',{i:p.i+1}]]},
    M:p=>{if(p.j>=p.n)return[['bd',{tip:1}]];const q=p.j/p.n,out=[['F',{l:(L-Lb)/p.n*R(.9,1.1),w1:p.w*(1-.6*(p.j+1)/p.n),aim:L92_UP,k:.08,wig:.006}]];
      for(let q=0;q<(rnd()<.45*full?2:1);q++)if(rnd()<.96*full)out.push(['[',{c:'tw',w:p.w*.55}],['/',{a:p.j*144+q*160+R(-15,15)}],['&',{a:R(16,26)*(.7+.3*full)}],['T',{j:0,n:Math.max(2,Math.round((8-4*q)*full)),l:(L-Lb)*R(.09,.13)*(1-.4*q),w:p.w*.55,o:1}],[']',{}]);
      out.push(['bd',{}],['M',Object.assign({},p,{j:p.j+1})]);return out},
    /* a twig: wand-like, bending back up; now and then a twig of its own; a bud or a calyx at its nodes, a little cluster at its tip */
    T:p=>{if(p.j>=p.n)return[['bd',{tip:1}]];const out=[['F',{l:p.l*R(.85,1.15),w1:p.w*(1-.6*(p.j+1)/p.n),aim:L92_UP,k:.07,wig:.012}],['bd',{}]];
      if(p.o<3&&p.j>=1&&rnd()<.55*full)out.push(['[',{c:'tw',w:p.w*.6}],['/',{a:R(90,270)}],['&',{a:R(14,24)}],['T',{j:0,n:Math.max(1,p.n-p.j-1),l:p.l*.75,w:p.w*.6,o:p.o+1}],[']',{}]);
      out.push(['T',Object.assign({},p,{j:p.j+1})]);return out}};
  const res=lsTurtle(lsDerive([['[',{c:'culm',w:wc}],['S',{i:0}],[']',{}]],rules,40),{p:[0,0,0],H:L92_UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:Math.max(3,L/50),w:wc}),Wq=l40Lay(A,bq,L,Rm,fd);
  /* the stem and twigs: angled, so a darker rib down the lit band; dyed, the same colour as the buds */
  const sc=cw.st,cul=lnCols(sc,'#fffaf0'),ink=h2l(sc)[2]>.66?shd(sc,-.5):null;
  const items=[],tc=toneAt(pal7(sc),.5),tl=toneAt(pal7(sc),.74);
  for(const ch of res.chains){const P=ch.pts.map(Wq);if(ch.c==='culm'){lnTube(P,ch.ws,()=>cul,parts,{gloss:.2,piece:20,min:bq?.56:.53,ink});continue}
    l92Axis(items,P,ch.ws[0],ch.ws[ch.ws.length-1],tc,'tw',0);if(DET>=1.5&&!LOD&&ch.ws[0]>1.6)l92Axis(items,P,ch.ws[0]*.3,ch.ws[ch.ws.length-1]*.3,tl,'tl',1)}
  /* the buds and calyces: small ovoid bodies leaning out from the twig, single or paired, a cluster of three to five at the tips */
  const P=pal7(cw.c),dk=h2l(cw.c)[2]<.4,tn=[toneAt(P,dk?.44:.36),toneAt(P,dk?.62:.58),toneAt(P,dk?.82:.8)],ink2=shd(cw.c,-.5),lb=R(.42,.52)*UPC*Math.pow(as,.2);
  for(const og of res.organs){if(og.t!=='bd')continue;const C=Wq(og.pos),H=A.Wv(og.pos,og.H),n=og.p.tip?Math.round(R(3,6)*(.6+.4*full)):rnd()<.9*full?Math.round(R(1,3)):0;
    for(let i=0;i<n;i++){const r=V3.nz(V3.cr(H,V3.nz([R(-1,1),R(-1,1),R(-1,1)]))),d=V3.nz(V3.add(V3.sc(H,og.p.tip?.9:.55),V3.sc(r,og.p.tip?.5:.8))),l=lb*R(.8,1.15)*(og.p.tip?.9:1),b=V3.add(C,V3.sc(d,-l*.12)),
        ti=l92Ti(V3.nz(V3.add(r,[0,0,.5])),R(-.06,.06));
      items.push({z:b[2]+d[2]*l*.5,k:'b'+ti,o:2+ti,st:{fill:tn[ti],stroke:LOD?'none':ink2,'stroke-width':.25,'stroke-opacity':.5,'stroke-linejoin':'round'},d:l92Path(l92Lance(b,d,l,l*.62,.55,DET>=1.5?8:6,.7,.5))})}}
  parts.push({z:l92Z(items)+.02,fn:l92Bands(items,DET>=1.5?7:4)});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:wc,bc:[shd(sc,-.5),shd(sc,-.2),sc,shd(sc,.4)]}}

/* ---------- registers: lines on their own spine (form 'ligne'), self = natural length, tip = how far the tip leans past the chord, fx = how far below its spine a line may hang,
   rch = how far it spreads round its spine in a bouquet ---------- */
Object.assign(GH,{'ble':l92Ble,'avoine':l92Avoine,'orge':l92Orge,'sorgho-a-balai':l92Sorgho,'broom-bloom':l92Broom});
Object.assign(CWS,{'ble':L92_CW_BLE,'avoine':L92_CW_AVO,'orge':L92_CW_ORG,'sorgho-a-balai':L92_CW_SOR,'broom-bloom':L92_CW_BRM});
Object.assign(SZG,{'ble':[50,60,60,70,70,80],'avoine':[50,60,60,70,80],'orge':[50,55,60,60,70],'sorgho-a-balai':[60,70,80,80,90,100],'broom-bloom':[40,45,50,50,55,60]});
Object.assign(GHI,{'ble':{form:'ligne',size:1,k:'plant',self:60*UPC,tip:.95,fx:3.5*UPC,rch:4*UPC},'avoine':{form:'ligne',size:1,k:'plant',self:60*UPC,tip:.92,fx:4*UPC,rch:7*UPC},
 'orge':{form:'ligne',size:1,k:'plant',self:55*UPC,tip:.9,fx:4*UPC,rch:5*UPC},'sorgho-a-balai':{form:'ligne',size:1,k:'plant',self:80*UPC,tip:.95,fx:4*UPC,rch:9*UPC},
 'broom-bloom':{form:'ligne',size:1,k:'plant',self:45*UPC,tip:.92,fx:3.5*UPC,rch:7*UPC}});
