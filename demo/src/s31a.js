/* ================= Serre, lot 31 — été 3, poussés par le L-système : astilbe (panicule plumeuse), pentas (ombelle d'étoiles), achillée (corymbes plats), trachélium (dôme vaporeux), campanule (clochettes en grappe) ================= */
/* ---------- shared pieces ---------- */
/* a frame whose z is n (its x and y any pair across it) */
function l31Fr(n){const X=V3.nz(V3.cr(Math.abs(n[2])<.9?[0,0,1]:[1,0,0],n));return[X,V3.cr(n,X),n]}
/* palettes shared by colour inside one drawing */
const l31Pal=(c,cache)=>cache[c]||(cache[c]=pal7(c));
/* a leaf on a node in 3D with pinnate veins pressed into its blade (pentas, campanula): lsLeafS bent and folded, sheet3 shading, nv pairs of grooved side veins */
function l31Leaf3(og,pos,len,wr,col,o={}){const S=lsLeafS(Object.assign({},og,{pos}),len,wr,{wp:o.wp||LS_OVATE,droop:o.droop??.2,arch:o.arch??.08,fold:o.fold??.2,tw:o.tw??R(-.3,.3),face:o.face??.45}),
    F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(col),PB=pal7(mix(shd(col,.2),'#b4c49c',.3)),nv=o.nv||0,V=[];
  for(let i=0;i<nv;i++){const v=.12+.72*i/Math.max(1,nv-1);for(const s of[-1,1])V.push([[0,v],[s*.45,v+.1],[s*.82,v+.2]])}
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:5,nv:9,across:1.3,ew:.45,eo:.45,cast:0,veins:[{pts:[[0,.01],[0,.5],[0,.97]],w:Math.max(.5,len*.012),c:P.l1,o:.55},...V],vw:Math.max(.45,len*.012),vo:.5,vlo:.35});
  return ps}
/* ---------- astilbe (Astilbe × arendsii, A. chinensis, A. japonica; Saxifragaceae): a wiry reddish stem, two or three leaves twice or three times divided into toothed, pointed leaflets,
   then a panicle 15–30 cm: a rachis with alternate branches, long at its foot and shorter to its tip (pyramidal in arendsii, narrow and erect in chinensis and japonica, arching in thunbergii),
   each branch dense with tiny five-petalled flowers whose long stamens make the plume look feathery; it opens from its foot up, the top still in coloured buds.
   The L-system grows the stem and its leaves (spGrow), then each branch of the panicle: B(o,l) → F(l·.5) [ /137 &θ B(o+1, l·.4) ]? F(l·.5) Tp ---------- */
const CW_L31AST=[{id:'rose-pale',n:'Rose pâle (Europa)',c:'#f0b2c8'},{id:'blanc',n:'Blanc (Washington)',c:'#f6f3ea'},{id:'ivoire',n:'Ivoire (Bridal Veil)',c:'#efe7cf'},
  {id:'saumon',n:'Rose saumon (Peach Blossom)',c:'#f1a8a2'},{id:'rose',n:'Rose (Rheinland)',c:'#e47aa6'},{id:'rose-vif',n:'Rose vif (Gloria Purpurea)',c:'#d6457c'},
  {id:'rouge',n:'Rouge (Montgomery)',c:'#c8305a'},{id:'rouge-sombre',n:'Rouge sombre (Fanal)',c:'#8e1a3a',lc:'#3e4a2a'},{id:'lilas',n:'Lilas (Amethyst)',c:'#c9a6d6'},
  {id:'mauve',n:'Mauve framboise (chinensis Visions)',c:'#b0508e',k:'chi'},{id:'pourpre',n:'Pourpre (chinensis Purpurlanze)',c:'#93407a',k:'chi'}];
/* the biternate leaf: a reddish petiole forking into three, each fork a short rachis with a pair of leaflets and one at its tip; ovate, pointed, sharply double-toothed, glossy */
function l31AstLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.3,o.face??.7),pl=len*.3,bend=R(-.06,.06)*len;let dr=`M0,0Q${f(pl*.5)},${f(bend)} ${f(pl)},0`,dl='',ds='',dv='';
  const leaflet=(cx,cy,a,l,w)=>{const n=16,ca=Math.cos(a),sa=Math.sin(a),T=[],Bt=[];
    for(let i=0;i<=n;i++){const t=i/n,ww=w*Math.pow(Math.sin(Math.PI*Math.min(.98,.04+t*.96)),.85)*(1-.3*t*t),tooth=i%2?1.13:.95;T.push([t*l,-ww*tooth*ct]);Bt.push([t*l,ww*tooth*.92*ct])}
    T[n]=Bt[n]=[l*1.06,0];const tr=p=>[cx+p[0]*ca-p[1]*sa,cy+p[0]*sa+p[1]*ca],O=T.concat(Bt.slice(0,n).reverse()).map(tr);dl+='M'+O.map(p=>f(p[0])+','+f(p[1])).join('L')+'Z';
    const H=Bt.slice(0,n).map(tr);ds+='M'+tr([0,0]).map(f).join(',')+'L'+H.map(p=>f(p[0])+','+f(p[1])).join('L')+'L'+tr([l*1.06,0]).map(f).join(',')+'Z';
    const a0=tr([l*.04,0]),a1=tr([l*.92,0]);dv+=`M${f(a0[0])},${f(a0[1])}L${f(a1[0])},${f(a1[1])}`;
    for(let j=1;j<4;j++){const t=j/4.4,b=tr([l*t,0]);for(const s of[-1,1]){const e=tr([l*(t+.16),s*w*.62*ct*Math.sin(Math.PI*(t+.1))]);dv+=`M${f(b[0])},${f(b[1])}L${f(e[0])},${f(e[1])}`}}};
  const L1=len-pl;for(const[k,da]of[[0,0],[1,-.62],[2,.62]]){const a=da+R(-.08,.08),rl=L1*(k?.62:.75),x0=pl,y0=0,ex=x0+Math.cos(a)*rl,ey=y0+Math.sin(a)*rl*ct;dr+=`M${f(x0)},${f(y0)}L${f(ex)},${f(ey)}`;
    const lw=L1*.36;for(const s of[-1,1]){const t=.42,bx=x0+Math.cos(a)*rl*t,by=y0+Math.sin(a)*rl*t*ct,b=a+s*.85;leaflet(bx,by,b,lw*(k?.8:.9),lw*.36)}leaflet(ex,ey,a,lw*(k?.95:1.05),lw*.4)}
  E('path',{d:dr,stroke:o.pc||'#6a3a2c','stroke-width':f(Math.max(.6,len*.016)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:dl,fill:toneAt(P,.5+.15*ct),stroke:P.ink,'stroke-width':.38,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
  if(!LOD){E('path',{d:ds,fill:P.d1,opacity:.38},g);E('path',{d:dv,stroke:P.l1,'stroke-width':f(Math.max(.3,len*.006)),'stroke-opacity':.5,fill:'none'},g)}return g}
/* one branch of the plume along its points C3 (view space), Wb wide at its foot: a feathered body (wisps combed toward its tip), toned by how it faces the light;
   its florets as dots on the side facing the eye (the lit ones paler), the stamens a haze of short strokes; a: its age (buds tight and darker, the tip greener) */
function l31AstBranch(par,C3,Wb,cw,a,cache,o={}){const n=C3.length-1;if(n<1)return;const det=DET>=1.5,g=G(par),bud=a<.45,col=bud?mix(cw.c,o.bc||'#8a6a4a',(.45-a)*1.1):cw.c,P7=l31Pal(col,cache),lite=h2l(col)[2]>.8,
    rv=v=>Wb/2*.7*(.55+.45*Math.pow(1-v,.8))*(v>.85?Math.pow((1-v)/.15,.5)*.8+.2:1)*(bud?.78:1),C=C3.map(p=>[p[0],-p[1]]),rs=C3.map((p,i)=>Math.max(.45,rv(i/n)));
  const Tg=i=>V3.nz(V3s(C3[Math.min(n,i+1)],C3[Math.max(0,i-1)])),T0=Tg(n>>1),side=V3.nz(V3.cr(T0,[0,0,1])),I=.55+.2*Math.max(-1,Math.min(1,V3.dot(side,LIGHT)*1.2+V3.dot(T0,LIGHT)*.3));
  /* the body: the tube with wisps all round, combed toward the tip */
  const base=chpTube(C,rs,3),m=base.length,ax=[C[n][0]-C[0][0],C[n][1]-C[0][1]],al=Math.hypot(ax[0],ax[1])||1,ux=ax[0]/al,uy=ax[1]/al,cx=C.reduce((s,c)=>s+c[0],0)/C.length,cy=C.reduce((s,c)=>s+c[1],0)/C.length,fe=[];
  for(let i=0;i<m;i++){const p=base[i],q=base[(i+1)%m];fe.push(p);if(!bud&&i<m-1&&(det||i%2===0)){const mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,ox=mx-cx,oy=my-cy,ol=Math.hypot(ox,oy)||1,w=Wb*.26*R(.35,1.2);fe.push([mx+ox/ol*w+ux*w*.9,my+oy/ol*w+uy*w*.9])}}
  let dz='';if(!bud&&!LOD)for(let i=0;i<m;i+=det?1:2){const p=base[i],ox=p[0]-cx,oy=p[1]-cy,ol=Math.hypot(ox,oy)||1,w=Wb*R(.3,.55);dz+=`M${f(p[0])},${f(p[1])}l${f((ox/ol*.8+ux*.6)*w)},${f((oy/ol*.8+uy*.6)*w)}`}
  if(dz)E('path',{d:dz,stroke:lite?shd(col,-.12):mix(col,'#ffffff',.25),'stroke-width':f(Math.max(.4,Wb*.045)),'stroke-opacity':.8,fill:'none','stroke-linecap':'round'},g);
  E('path',{d:smooth(fe),fill:toneAt(P7,I-.06),stroke:lite?shd(col,-.35):P7.d1,'stroke-width':.38,'stroke-opacity':lite?.6:.5,'stroke-linejoin':'round'},g);if(LOD)return g;
  /* florets: dots in a spiral over the visible half, lit ones and shaded ones; stamens as fine strokes standing out */
  let dl='',dd='',ds='';const rr=Math.max(.4,Math.min(1.05,Wb*.11)),N=Math.min(det?260:110,Math.round((det?1:.55)*Math.max(8,al*Wb*.8/(rr*rr*4.5))));
  const FR=C3.map((p,i)=>{const T=Tg(i),X=V3.nz(V3.cr(Math.abs(T[2])<.9?[0,0,1]:[1,0,0],T));return[T,X,V3.cr(T,X)]});
  for(let k=0;k<N;k++){const v=(k+.5)/N,i=Math.min(n-1,Math.floor(v*n)),t=v*n-i,ps=k*2.39996+(o.ph||0),[T,X,Y]=FR[i],rad=V3.add(V3.sc(X,Math.cos(ps)),V3.sc(Y,Math.sin(ps)));if(rad[2]<.05)continue;
    const r=(rs[i]+(rs[i+1]-rs[i])*t)*.8,c=V3.add(C3[i],V3.sc(V3s(C3[i+1],C3[i]),t)),p=V3.add(c,V3.sc(rad,r)),s=[p[0],-p[1]],li=V3.dot(rad,LIGHT)>.05;
    const rj=rr*R(.7,1.15);if(li)dl+=chpDot(s[0]+R(-.3,.3)*rr,s[1]+R(-.3,.3)*rr,rj);else dd+=chpDot(s[0],s[1],rj*.9);
    if(!bud&&(det||k%2===0)){const e=V3.add(p,V3.add(V3.sc(rad,Wb*.2*R(.6,1.1)),V3.sc(T,Wb*.12))),q2=[e[0],-e[1]];ds+=`M${f(s[0])},${f(s[1])}L${f(q2[0])},${f(q2[1])}`}}
  if(dd)E('path',{d:dd,fill:P7.d1,opacity:lite?.35:.5},g);if(dl)E('path',{d:dl,fill:bud?P7.b:P7.l1,opacity:.85},g);
  if(ds)E('path',{d:ds,stroke:lite?shd(col,-.15):P7.l2,'stroke-width':f(Math.max(.3,Wb*.04)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},g);return g}
function l31AstPlant(g,t,o){const cw=cwPick(CW_L31AST,o),chi=cw.k==='chi',op=Math.max(.05,Math.min(1,o.op??R(.8,1))),k=G(g),parts=[],cache={},sp=!!o.spine,q=sm01((op-.08)/.9),
    Lf0=(o.cm||25)*UPC,Lt=sp?blen(o.spine):Lf0*2.1,SC=['#3a1e16','#6a3a2c','#8e5a44','#b88a70'],lc=cw.lc||'#3f5a2c';let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.7,.7),wig:.03,e:.05,seg:7,w:3.4,nodes:L=>{Lfl=Math.min(Lf0*(.6+.4*q),L*(sp?o.short?.62:.5:.48));Lb=L-Lfl;const ph0=R(0,360),N=[],n=sp?2:3;
    for(let j=0;j<n;j++){const u=j/Math.max(1,n-1);N.push({l:Lb*(.22+.5*u)*R(.95,1.05),phi:ph0+j*150,kink:R(1,2.5),leaf:{a:46-8*u+R(-5,5),len:Lf0*(.62-.18*u)*R(.9,1.08)}})}return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0*.5,s0],3.4,2.3,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.25,s0+(1-s0)*.5,s0+(1-s0)*.75,1],2.3,.7,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<11*UPC)continue;spLeafUp(lf,.12);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face)=>l31AstLeaf(par,x,y,ang,len,lc,{face})))}
  /* the branches of the panicle, alternate, from its foot to near its tip: long low down, shorter up (a pyramid), narrower in chinensis; buds hold them close to the rachis */
  const nb=Math.max(8,Math.round((chi?13:17)*(DET>=1.5?1.15:1))),Wb0=Lfl*(chi?.05:.056)*(.75+.25*q),ph=R(0,6.28);
  const rules={B:p=>{const out=[['F',{l:p.l*.5,w1:.9}]];if(p.o<1&&p.l>Lfl*.12&&rnd()<.85)out.push(['[',{w:.7}],['/',{a:137+R(-30,30)}],['&',{a:R(28,40)}],['B',{o:p.o+1,l:p.l*R(.42,.55)}],[']',{}]);out.push(['F',{l:p.l*.5,w1:.6}],['Tp',{o:p.o}]);return out}};
  const brs=[];
  for(let j=0;j<nb;j++){const u=(j+.3)/nb,s=s0+(1-s0)*(.02+.72*u),fr=A.at(s),az=(j*137.5+R(-15,15))*D,th=((chi?30:52)-(chi?8:22)*u)*(.45+.55*q)*D+R(-.06,.06),
      side=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)),V3.sc(fr.Sd,Math.sin(az)))),dir=V3.nz(V3.add(V3.sc(fr.T,Math.cos(th)),V3.sc(side,Math.sin(th)))),len=Lfl*((chi?.26:.44)*Math.pow(1-u,.85)+.07)*R(.88,1.1)*(.7+.3*q);
    const res=lsTurtle(lsDerive([['B',{o:0,l:len}]],rules,3),{p:fr.p,H:dir,U:fr.Fr,wig:.04,seg:Math.max(3,len/7),T:[0,1,0],e:chi?.03:-.012,w:1});
    for(const ch of res.chains){if(ch.pts.length<2)continue;let z=0;for(const p of ch.pts)z+=p[2];z/=ch.pts.length;const sub=ch.ord>0,age=Math.max(0,Math.min(1,op*1.15-.5*u*(1-q)));
      parts.push({z:A.zk(s,z),fn:par=>{chpTwig(par,ch.pts,sub?.7:1,.5,SC);l31AstBranch(par,ch.pts.slice(sub?0:1),Wb0*(sub?.75:1)*(1-.3*u),cw,age,cache,{ph:ph+j})}})}}
  /* the tip of the panicle: the rachis itself above the last branch, densest */
  const sT=s0+(1-s0)*.7,C3=[];for(let i=0;i<=10;i++)C3.push(A.cb(sT+(1-sT)*i/10));let zt=0;for(const p of C3)zt+=p[2];zt/=C3.length;
  parts.push({z:A.zk(sT,zt)+.02,fn:par=>l31AstBranch(par,C3,Wb0*1.15,cw,Math.max(0,op*1.1-.45),cache,{ph,bc:'#7a6a3a'})});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:3.4,bc:SC}}
/* ---------- pentas (Pentas lanceolata; Rubiaceae): a domed cyme 6–10 cm of 20–40 small stars — a slender corolla tube 1.5–2.5 cm and five spreading pointed lobes, the throat hairy and paler —
   with club-shaped buds packed in its heart; opposite ovate leaves, softly hairy, their veins deeply pressed in; side shoots in the upper axils end in younger cymes.
   Cost: each star one outline, its throat one dot when it faces the eye, its tube only when it shows (the old version drew 700 elements a head) ---------- */
const CW_L31PEN=[{id:'rose',n:'Rose vif (True Pink)',c:'#e8507a',eye:'#f6b8c8'},{id:'blanc',n:'Blanc (Graffiti White)',c:'#f6f4ef',eye:'#d9dfae'},{id:'rose-pale',n:'Rose pâle (Appleblossom)',c:'#f4c6d2',eye:'#fbe8ee'},{id:'rose-clair',n:'Rose (Graffiti Pink)',c:'#e89ab8',eye:'#f8dce6'},
  {id:'fuchsia',n:'Fuchsia',c:'#cc2a7a',eye:'#f0a0c4'},{id:'rouge',n:'Rouge (Bright Red)',c:'#c8202e',eye:'#f08a80'},
  {id:'cramoisi',n:'Rouge cramoisi (Red Velvet)',c:'#a01a36',eye:'#d8606e'},{id:'lilas',n:'Rose lavande (Lavender Pink)',c:'#d8a6d8',eye:'#f2e0f2'},{id:'violet',n:'Violet (Violet)',c:'#9a5aa8',eye:'#e0c8ea'},
  {id:'flirty',n:'Rose bicolore (Flirty Pink)',c:'#f3c2d4',c2:'#de5a8e',eye:'#fbeaf0'}];
/* the cyme in its frame B (z up its axis) on O, Dm across when open: florets on a dome, buds in its heart, all drawn far to near */
function l31PenHead(par,B,O,Dm,cw,op,o={}){const g=G(par),q=sm01((op-.08)/.86),rot=R(0,6.283),det=DET>=1.5,lod=LOD?.6:1,cache={},rf=Dm*.118*(o.sz||1),
    Rs=Dm*(.28+.2*q)*(o.sz||1),al=(38+30*q)*D,H0=Dm*.12,Cc=[0,0,H0-Rs],N=Math.max(8,Math.round((det?46:38)*lod*(o.nk||1))),nB=Math.round(N*(1-.75*q)),items=[],cB=1-Math.cos(al),tb=Math.min(cB,nB*.6*rf*rf/(2*Math.PI*Rs*Rs)),el=toV(B,[0,0,1])[2];
  /* the cushion: the bunched pedicels and calyces under the florets, so nothing floats */
  const cq=[];for(let i=0;i<14;i++){const a=i/14*6.283;for(const th of[0,al*.92]){const n=[Math.sin(th)*Math.cos(a),Math.sin(th)*Math.sin(a),Math.cos(th)],p=PJ(B,O,V3.add(Cc,V3.sc(n,Rs*.72)));cq.push([p[0],p[1]])}}
  const ob=PJ(B,O,[0,0,-Dm*.03]);cq.push([ob[0],ob[1]]);E('path',{d:smooth(hull2(cq)),fill:mix(shd(cw.c,-.3),'#5a7e40',.82),stroke:'#2e4420','stroke-width':.4,'stroke-opacity':.5},g);
  let dr='';for(let i=0;i<9;i++){const a=i/9*6.283+rot,n=[Math.sin(al*.8)*Math.cos(a),Math.sin(al*.8)*Math.sin(a),Math.cos(al*.8)],e=PJ(B,O,V3.add(Cc,V3.sc(n,Rs*.8))),c=PJ(B,O,V3.sc(V3.add(Cc,V3.sc(n,Rs*.8)),.45));
    dr+=`M${f(ob[0])},${f(ob[1])}Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}`}if(el<.5)E('path',{d:dr,stroke:'#4f7234','stroke-width':f(Math.max(.6,Dm*.012)),fill:'none','stroke-linecap':'round'},g);
  for(let i=0;i<N;i++){const t=(i+.5)/N,ib=i<nB,ct=1-(ib?(i+.5)/nB*tb:tb*.75+(i-nB+.5)/Math.max(1,N-nB)*(cB-tb*.75)),th=Math.acos(ct),ph=i*2.39996+rot,n=V3.nz([Math.sin(th)*Math.cos(ph)+R(-.05,.05),Math.sin(th)*Math.sin(ph)+R(-.05,.05),ct]),
      P=V3.add(Cc,V3.sc(n,Rs)),[X,Y]=l31Fr(n),nV=toV(B,n),z=PJ(B,O,P)[2];
    if(i<nB){/* a bud: a slim tube swelling into the folded, five-angled tip; coloured, greener the younger */const age=q*(1-i/Math.max(1,nB)),lb=rf*(.8+.55*age),bc=mix(cw.c2||cw.c,'#9ab070',.32-.28*age);
      const pr=prof([[0,.12],[.3,.16],[.6,.3],[.85,.36],[1,.05]]),bp=[];for(let a=0;a<=7;a++){const v=a/7,r=Math.max(.4,pr(v)*rf*(.9+.4*age));for(let m=0;m<8;m++){const w=m/8*6.283,s=PJ(B,O,V3.add(V3.add(P,V3.sc(n,lb*(v-.55))),V3.add(V3.sc(X,Math.cos(w)*r),V3.sc(Y,Math.sin(w)*r))));bp.push([s[0],s[1]])}}
      items.push({z:z+lb*.3*nV[2],fn:()=>E('path',{d:smooth(hull2(bp)),fill:budFill(bc),stroke:shd(bc,-.5),'stroke-width':.35,'stroke-opacity':.6},g)});continue}
    const sz=rf*(.82+.25*Math.pow(t,1.5))*(.75+.25*q),front=nV[2]>=0,col=cw.c2&&t>.55?mix(cw.c,cw.c2,(t-.55)/.45):cw.c,pts=[];
    /* the star: five ovate, pointed lobes from a small throat, a little reflexed */
    for(let kk=0;kk<5;kk++){const a0=kk*1.2566+ph*1.7;for(const[da,r,tp]of[[-.63,.25],[-.42,.6],[-.2,.9],[0,1,1],[.2,.9],[.42,.6]]){const a=a0+da,rr=sz*r,p=V3.add(P,V3.add(V3.add(V3.sc(X,Math.cos(a)*rr),V3.sc(Y,Math.sin(a)*rr)),V3.sc(n,-sz*.1*r*r))),s=PJ(B,O,p);pts.push([s[0],s[1],tp])}}
    const I=front?lightI(nV):lightI(V3.sc(nV,-1))*.82,P7=l31Pal(front?col:mix(col,'#c8d0b0',.2),cache),fill=toneAt(P7,.22+.55*I),lite=h2l(col)[2]>.8;
    if(nV[2]<.45){/* the corolla tube, seen from the side or behind */const a=PJ(B,O,P),b=PJ(B,O,V3.add(P,V3.sc(n,-sz*1.7))),C=[[a[0],a[1]],[(a[0]+b[0])/2,(a[1]+b[1])/2],[b[0],b[1]]],tc=mix(col,'#dfe4c8',.25);
      items.push({z:z-sz*.8*nV[2]-.01,fn:()=>E('path',{d:smooth(chpTube(C,[sz*.15,sz*.13,sz*.11],2)),fill:toneAt(l31Pal(tc,cache),.62),stroke:shd(tc,-.45),'stroke-width':.3,'stroke-opacity':.55},g)})}
    items.push({z,fn:()=>{E('path',{d:smooth(tipOut(pts)),fill,stroke:lite?shd(col,-.4):P7.d1,'stroke-width':.35,'stroke-opacity':lite?.75:.6,'stroke-linejoin':'round'},g);
      if(nV[2]>.2){const c=PJ(B,O,P),e1=V3s(PJ(B,O,V3.add(P,V3.sc(X,sz*.17))),c),e2=V3s(PJ(B,O,V3.add(P,V3.sc(Y,sz*.17))),c);E('path',{d:chpEll(c,e1,e2,.45),fill:cw.eye||lt(col,.4),stroke:shd(col,-.3),'stroke-width':.25,'stroke-opacity':.5},g)}}})}
  items.sort((a,b)=>a.z-b.z);for(const it of items)it.fn();return g}
function l31PenPlant(g,t,o){const cw=o.cw||cwNear(CW_L31PEN,o.col)||CW_L31PEN[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||8)*UPC,k=G(g),B=frameOf(o,.4,true),
    up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(A0,V3.sc(up,.25))),sc=['#2e4a20','#4c7034','#76985a','#a8c48a'];
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.3,D:Dm,w:Dm*.07,cols:sc,op,nodes:2,li:.7,lp:.85,opp:1,leafAng:60,side:{p:.7,n:1,top:2,len:.85,ang:34,age:[0,.6],e:.05},seg:.12,wig:.03,e:.015,
    apex:Bm=>V3.sc(Bm[2],Dm*.08),
    flower:(par,Bf,O,op2)=>l31PenHead(par,Bf,O,Dm,cw,op2),
    young:(par,Bf,O,a)=>l31PenHead(par,Bf,O,Dm*.62,cw,a*.7,{nk:.55}),
    leaf:(og,pos)=>l31Leaf3(og,pos,Dm*(og.p.i<=1?R(.55,.68):R(1,1.2)),.46,'#4a7034',{wp:LS_OVATE,nv:6,droop:.18,fold:.22})});
  open(k,t,1000,8,.3);return r}
/* ---------- the corymb (achillea) and the domed corymbose panicle (trachelium): branches from the top of the stem, the outer ones from lower down, carry clusters of tiny heads
   onto one flat or domed surface; each cluster a little dome on a shaded cushion so nothing floats; heads grouped into a few paths (far half then near half).
   U: nR clusters, nf heads each, dome (< 0 domed), ruK cluster radius, fl head size, bh how low the outer branches leave, kind 'cap' (a tiny daisy) or 'tub' (a tube and its long style) ---------- */
function l31Cory(par,Bu,O,Ru,a,cw,U){const q=sm01((a-.08)/.82),det=DET>=1.5,lod=LOD?.6:1,g=G(par),nR=Math.max(6,Math.round(U.nR*(det?1:.75)*lod)),nF=Math.max(4,Math.round(U.nf*(det?1:.6)*lod)),
    Rs=Ru*(.42+.58*q),kap=LERP(U.domeB??-.6,U.dome,q),H0=Ru*.16,ru0=Ru*U.ruK*(.6+.4*q),rot=R(0,6.283),el=toV(Bu,[0,0,1])[2],bc=U.bud||'#8a9a6a',
    cO=mix(cw.c,bc,(1-q)*.55),cI=mix(cw.c2||cw.c,bc,(1-q)*.55),tub=U.kind==='tub';
  const um=[];for(let i=0;i<nR;i++){const rho=Math.min(1,Math.sqrt((i+.6)/nR)*R(.95,1.02)),ph=i*2.39996+rot+R(-.1,.1),cp=Math.cos(ph),sp=Math.sin(ph),
      n=V3.nz([-2*kap*rho*cp,-2*kap*rho*sp,1]),ru=ru0*(.85+.3*rho)*R(.9,1.08),C=[rho*Rs*cp,rho*Rs*sp,H0+kap*Rs*rho*rho];
    const o0=[0,0,-Ru*U.bh*rho*rho],Pb=V3s(C,V3.sc(n,ru*.35)),cc=[Pb[0]*.55,Pb[1]*.55,Pb[2]*.3+o0[2]*.7],r0=PJ(Bu,O,o0),cM=PJ(Bu,O,cc),e=PJ(Bu,O,Pb);
    um.push({i,rho,n,ru,C,nV:toV(Bu,n),z:PJ(Bu,O,C)[2],col:rho<.45&&cw.c2?1:0,ray:`M${f(r0[0])},${f(r0[1])}Q${f(cM[0])},${f(cM[1])} ${f(e[0])},${f(e[1])}`})}
  const PO=pal7(cO),PI=pal7(cI),lite=h2l(cO)[2]>.8,dk=h2l(cO)[2]<.4,rw=Math.max(.55,Ru*.014);
  const drawSet=list=>{let dc='',dO='',dI='',dB='',de='',dh='',dst='',dsg='',IO=0,II=0,nO=0,nI=0;
    for(const u of list){const[Xu,Yu]=l31Fr(u.n),C0=V3s(u.C,V3.sc(u.n,u.ru*.15)),cs=PJ(Bu,O,C0),e1=V3s(PJ(Bu,O,V3.add(C0,V3.sc(Xu,u.ru*.95))),cs),e2=V3s(PJ(Bu,O,V3.add(C0,V3.sc(Yu,u.ru*.95))),cs);
      dc+=chpEll(cs,V3.sc(e1,.8),V3.sc(e2,.8),Math.max(.5,u.ru*.25));const front=u.nV[2]>=0,I=.6+(lightI(front?u.nV:V3.sc(u.nV,-1))-.6)*.6-(front?0:.1);if(u.col){II+=I;nI++}else{IO+=I;nO++}
      const rf0=u.ru*U.fl/Math.sqrt(nF),lit=front&&V3.dot(u.nV,LIGHT)>.2;
      for(let j=0;j<nF;j++){const sg=Math.sqrt((j+.5)/nF),ps=j*2.39996+u.i*1.7,p=V3.add(u.C,V3.add(V3.add(V3.sc(Xu,Math.cos(ps)*sg*u.ru*.9),V3.sc(Yu,Math.sin(ps)*sg*u.ru*.9)),V3.sc(u.n,u.ru*(U.cz??.3)*(1-sg*sg)))),
          s=PJ(Bu,O,p),rr=Math.max(.45,rf0*(.75+.25*q)),ff=front?(u.col?'I':'O'):'B';let dd;
        if(!tub&&det&&q>.5&&front&&!U.btn){/* a tiny daisy: five round rays round the disc */const pp=[];for(let m=0;m<10;m++){const aa=m*.6283+ps,r2=rr*(m%2?.62:1.12);pp.push(f(s[0]+Math.cos(aa)*r2)+','+f(s[1]+Math.sin(aa)*r2*(.55+.45*Math.abs(u.nV[2]))))}dd='M'+pp.join('L')+'Z'}
        else dd=chpDot(s[0],s[1],rr);
        if(ff==='B')dB+=dd;else if(ff==='I')dI+=dd;else dO+=dd;
        if(front&&q>.4&&(det||j%2===0))de+=chpDot(s[0],s[1],rr*(tub?.32:.3));
        if(lit&&sg<.85&&j%3===0)dh+=chpDot(s[0]-rr*.25,s[1]-rr*.3,rr*.45);
        if(tub&&q>.35&&(det||j%2===0)){/* the style standing out of the floret, its stigma a pale club */const dir=V3.nz(V3.add(V3.sc(u.n,.8),V3.sc(V3s(p,u.C),.9/Math.max(.01,u.ru)))),e=PJ(Bu,O,V3.add(p,V3.sc(dir,u.ru*U.sty*R(.7,1.15)*q)));
          dst+=`M${f(s[0])},${f(s[1])}L${f(e[0])},${f(e[1])}`;dsg+=chpDot(e[0],e[1],Math.max(.35,rr*.42))}}}
    if(dc)E('path',{d:dc,fill:shd(cO,dk?-.25:-.4),opacity:.95},g);
    const ti=(P,I)=>toneAt(P,dk?.55+(I-.55)*.5:I),sw=lite?.26:.2,so=lite?.5:.3;
    if(dB){const cb=mix(cO,'#8c9a74',.35);E('path',{d:dB,fill:toneAt(pal7(cb),.45),stroke:shd(cb,-.4),'stroke-width':.22,'stroke-opacity':.5},g)}
    if(dO)E('path',{d:dO,fill:ti(PO,nO?IO/nO:.6),stroke:lite?shd(cO,-.42):PO.d1,'stroke-width':sw,'stroke-opacity':so,'stroke-linejoin':'round'},g);
    if(dI)E('path',{d:dI,fill:ti(PI,nI?II/nI:.6),stroke:lite?shd(cI,-.42):PI.d1,'stroke-width':sw,'stroke-opacity':so,'stroke-linejoin':'round'},g);
    if(de)E('path',{d:de,fill:tub?shd(cO,-.45):U.eye||'#e8d890',opacity:tub?.55:.7},g);
    if(dst)E('path',{d:dst,stroke:lt(cO,.12),'stroke-width':f(Math.max(.3,Ru*.006)),'stroke-opacity':.75,fill:'none','stroke-linecap':'round'},g);
    if(dsg)E('path',{d:dsg,fill:lt(cO,.4),opacity:.85},g);if(dh&&!LOD)E('path',{d:dh,fill:PO.l2,opacity:.6},g)};
  /* the body of the head under its clusters: the shaded mass between them, so the plate reads whole */
  const hb=[];for(const u of um)for(let m=0;m<6;m++){const a=m*1.047,[Xu,Yu]=l31Fr(u.n),p=PJ(Bu,O,V3.add(V3s(u.C,V3.sc(u.n,u.ru*.3)),V3.add(V3.sc(Xu,Math.cos(a)*u.ru*(U.bk??.45)),V3.sc(Yu,Math.sin(a)*u.ru*(U.bk??.45)))));hb.push([p[0],p[1]])}
  const body=()=>E('path',{d:smooth(hull2(hb)),fill:shd(cO,dk?-.2:-.36),stroke:shd(cO,-.5),'stroke-width':.35,'stroke-opacity':.4},g);
  const sets=um.slice().sort((p,r)=>p.z-r.z),half=[sets.slice(0,sets.length>>1),sets.slice(sets.length>>1)],
    rays=list=>{let d='';for(const u of list)d+=u.ray;if(d)E('path',{d,stroke:U.rc||'#6f8a50','stroke-width':f(rw),fill:'none','stroke-linecap':'round'},g)};
  if(el>.3){rays(um);body();for(const h of half)drawSet(h)}else if(el<-.25){for(const h of half)drawSet(h);rays(um)}else{body();for(const h of half){rays(h);drawSet(h)}}
  return g}
/* ---------- yarrow (Achillea millefolium and its hybrids; A. filipendulina): a flat corymb 6–12 cm of hundreds of tiny heads (five short rounded rays round a cream disc);
   in filipendulina a broad, slightly domed plate of golden buttons, rays hardly showing; the stem stiff and ridged, the leaves cut very finely like a feather (millefolium)
   or once pinnate into toothed lobes, grey-green (filipendulina); smaller corymbs on side shoots from the upper axils ---------- */
const CW_L31ACH=[{id:'jaune-pale',n:'Jaune soufre (Moonshine)',c:'#e8d65a',k:'fil',btn:0},{id:'blanc',n:'Blanc',c:'#f4f1e4'},{id:'creme',n:'Crème (Summer Pastels)',c:'#efe2b0'},
  {id:'or',n:'Jaune d’or (filipendulina Cloth of Gold)',c:'#e8b224',k:'fil'},{id:'or-parker',n:'Or vif (filipendulina Parker’s Variety)',c:'#dfa21c',k:'fil'},
  {id:'terracotta',n:'Terracotta',c:'#d2774c',c2:'#e7a77c'},{id:'saumon',n:'Saumon (Salmon Beauty)',c:'#ef9f80',c2:'#f4c4a8'},{id:'rose',n:'Rose (Pink Grapefruit)',c:'#e7a2b8',c2:'#f0c8d2'},
  {id:'cerise',n:'Cerise (Cerise Queen)',c:'#c23a6a'},{id:'rouge',n:'Rouge (Paprika)',c:'#b5343a',c2:'#d0604a'},{id:'lilas',n:'Lilas (Lilac Beauty)',c:'#c7a8d8',c2:'#ddcce6'}];
/* a feather-like leaf of millefolium: a narrow outline, the rachis carrying many pairs of short pinnae, each cut again into thread-like lobes; two strokes */
function l31Feather(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.3,o.face??.7),bend=R(-.1,.1)*len,np=Math.round((LOD?10:16)*(o.np||1)),pl=len*.08;
  const at=t=>[len*t,bend*t*t];let dm=`M0,0`;for(let i=1;i<=8;i++){const p=at(i/8);dm+=`L${f(p[0])},${f(p[1])}`}let dl='';
  for(let i=0;i<np;i++){const t=.1+.88*i/(np-1),p=at(t),l=len*.15*Math.pow(Math.sin(Math.PI*Math.min(.97,.08+t*.92)),.6)*R(.85,1.1);
    for(const s of[-1,1]){const a=s*R(.9,1.2),bx=p[0],by=p[1]+(s>0?len*.004:0),ex=bx+Math.cos(a)*l,ey=by+Math.sin(a)*l*ct;dl+=`M${f(bx)},${f(by)}L${f(ex)},${f(ey)}`;
      for(const u of[.35,.65])for(const s2 of[-1,1]){const fx=bx+Math.cos(a)*l*u,fy=by+Math.sin(a)*l*u*ct,b=a+s2*.75;dl+=`M${f(fx)},${f(fy)}l${f(Math.cos(b)*l*.3)},${f(Math.sin(b)*l*.3*ct)}`}}}
  E('path',{d:dm,stroke:P.d1,'stroke-width':f(Math.max(.6,len*.014)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:dl,stroke:toneAt(P,.55),'stroke-width':f(Math.max(.55,len*.012)),fill:'none','stroke-linecap':'round'},g);
  if(!LOD&&DET>=1.5)E('path',{d:dl,stroke:P.l1,'stroke-width':f(Math.max(.25,len*.004)),'stroke-opacity':.45,fill:'none','stroke-linecap':'round',transform:'translate(-.2,-.25)'},g);return g}
function l31AchPlant(g,t,o){const cw=o.cw||cwNear(CW_L31ACH,o.col)||CW_L31ACH[0],fil=cw.k==='fil',op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||10)*UPC*(fil?1.08:1),Ru=Dm/2,k=G(g),
    B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(V3.add(A0,V3.sc(up,.15)),[0,0,o.up?.5:0])),sc=fil?['#3a4a2a','#5f7448','#8a9e70','#bccaa2']:['#34482a','#566e40','#7f9864','#b0c494'],lc=fil?'#6a8458':'#56743e',
    U=fil?{nR:36,nf:14,dome:-.14,domeB:-.5,ruK:.18,fl:1.05,bh:.5,cz:.1,kind:'cap',btn:cw.btn??1,eye:'#d8a018',bud:'#9aa874',rc:'#7a9060'}:{nR:28,nf:13,dome:-.05,domeB:-.45,ruK:.2,fl:.95,bh:.55,cz:.1,kind:'cap',eye:'#efe2b0',bud:'#8f9e78',rc:'#6f8a50'};
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.45,D:Dm,w:Dm*.05,cols:sc,op,nodes:3,li:.5,lp:.7,leafAng:42,side:{p:.75,n:1,top:2,len:.95,ang:28,age:[.1,.75],e:.05},seg:.1,wig:.03,e:.012,
    apex:Bm=>V3.sc(Bm[2],Ru*.18),
    flower:(par,Bf,O,op2)=>l31Cory(par,Bf,O,Ru,op2,cw,U),
    young:(par,Bf,O,a)=>l31Cory(par,Bf,O,Ru*(.42+.22*a),a,cw,Object.assign({},U,{nR:U.nR*.55})),
    leaf:(og,pos)=>{const len=Dm*(og.p.i<=1?R(.75,.95):R(1.05,1.3));return lsLeaf2D(og,pos,len,(par,x,y,a,l)=>fil?chpCutLeaf(par,x,y,a,l,lc,{np:6,nl:2,lw:.035,pl:.2,ll:.34,la:.6,pa:1.1,sh:.05,sw:Dm*.05}):l31Feather(par,x,y,a,l,lc))}});
  open(k,t,1000,8,.3);return r}
/* ---------- throatwort (Trachelium caeruleum; Campanulaceae): a domed corymbose panicle 8–15 cm, a mist of hundreds of tiny tubular flowers whose long styles stand far out;
   alternate ovate leaves, sharply toothed, often tinged purple like the stem; a large central head and smaller satellites on side shoots.
   Cost: florets, throats, styles and stigmas each one path per half of the head (the old version drew 3000 elements) ---------- */
const CW_L31TRA=[{id:'violet',n:'Violet (Lake Michigan Purple)',c:'#6c4a94'},{id:'pourpre',n:'Pourpre noir (Devotion Purple)',c:'#4e2c6e'},{id:'bleu',n:'Bleu violet (Lake Louise Blue)',c:'#7c78c4'},
  {id:'lavande',n:'Lavande (Corporate Lavender)',c:'#b6a2d4'},{id:'lilas',n:'Lilas gris (Lake Michigan)',c:'#a596c0'},{id:'blanc',n:'Blanc (Lake Louise White)',c:'#f2f2ea',c2:'#e4ead2'},
  {id:'blanc-vert',n:'Blanc verdi',c:'#dfe6c8'},{id:'vert',n:'Vert (boutons, Jade)',c:'#b6c68a'},{id:'rose',n:'Rose pâle (Devotion Pink)',c:'#e2b4cc'},{id:'bordeaux',n:'Bordeaux (Black Knight)',c:'#5a2a48'}];
function l31TraPlant(g,t,o){const cw=o.cw||cwNear(CW_L31TRA,o.col)||CW_L31TRA[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||14)*UPC,Ru=Dm/2,k=G(g),
    B=frameOf(o,.4,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(V3.add(A0,V3.sc(up,.15)),[0,0,o.up?.35:0])),pu=h2l(cw.c)[1]>.15&&(h2l(cw.c)[0]>.6||h2l(cw.c)[0]<.05),
    sc=pu?['#3a2a34','#5e4a4e','#857066','#b0a088']:['#2e4424','#4e6a38','#76925a','#a8bf8a'],lc=pu?'#4a5e36':'#4f6e38',
    U={nR:32,nf:24,dome:-.55,domeB:-.7,ruK:.21,fl:1.05,bh:.4,cz:.16,bk:.75,kind:'tub',sty:.55,bud:mix(shd(cw.c,-.2),'#5e7a44',.35),rc:pu?'#6a5a54':'#6a844c'};
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.45,D:Dm,w:Dm*.045,cols:sc,op,nodes:3,li:.4,lp:.55,leafAng:48,side:{p:.85,n:1,top:2,len:.7,ang:30,age:[.4,.9],e:.05},seg:.1,wig:.03,e:.012,
    apex:Bm=>V3.sc(Bm[2],Ru*.22),
    flower:(par,Bf,O,op2)=>l31Cory(par,Bf,O,Ru,op2,cw,U),
    young:(par,Bf,O,a)=>l31Cory(par,Bf,O,Ru*(.38+.2*a),a,cw,Object.assign({},U,{nR:12,nf:18})),
    leaf:(og,pos)=>{const len=Dm*(og.p.i<=1?R(.42,.55):R(.6,.78));return lsLeaf2D(og,pos,len,(par,x,y,a,l)=>dentLeaf(par,x,y,a,l,lc,{w:.42,nt:11}))}});
  open(k,t,1000,8,.3);return r}
/* ---------- campanula: C. medium, Canterbury bells — big inflated bells 4–5 cm, five shallow recurved lobes, the calyx with five sepals and five reflexed appendages, or in the calycanthema forms
   (cup-and-saucer) a coloured saucer under the bell; C. persicifolia — wide open cups 3–4 cm on longer pedicels, narrow leaves. A raceme opening from its foot up, buds green then coloured,
   pointed and five-angled, at its tip; hairy lanceolate leaves on the stem, a small bract under each flower ---------- */
const CW_L31CAM=[{id:'bleu',n:'Bleu (Champion Blue)',c:'#6f7fd0'},{id:'bleu-fonce',n:'Bleu violet profond',c:'#4a4aa8'},{id:'lavande',n:'Lavande (Champion Lavender)',c:'#b0a2e0'},{id:'mauve',n:'Mauve',c:'#a06ab8'},
  {id:'rose',n:'Rose (Champion Pink)',c:'#f0b2c8'},{id:'blanc',n:'Blanc (Champion White)',c:'#f7f5ee'},
  {id:'saucer-bleu',n:'Bleu, tasse et soucoupe (calycanthema)',c:'#7a8ad8',k:'cup',f:'cup'},{id:'saucer-rose',n:'Rose, tasse et soucoupe (calycanthema)',c:'#eeb6cc',k:'cup',f:'cup'},
  {id:'saucer-blanc',n:'Blanc, tasse et soucoupe (calycanthema)',c:'#f6f3ea',k:'cup',f:'cup'},
  {id:'pers-bleu',n:'Bleu ciel (persicifolia)',c:'#9aa6e6',k:'per',f:'per'},{id:'pers-blanc',n:'Blanc (persicifolia Alba)',c:'#f6f6f0',k:'per',f:'per'},{id:'pers-lilas',n:'Lilas (persicifolia)',c:'#c4b2e4',k:'per',f:'per'}];
/* the bell profiles (radius × r along its length): medium inflated, persicifolia a wide cup */
const L31_BELL={med:prof([[0,.3],[.12,.62],[.4,.86],[.7,.92],[.88,1],[1,1.24]]),per:prof([[0,.22],[.14,.58],[.45,.92],[.75,1.12],[1,1.38]])};
/* one bell in its frame B (z out of its mouth) at O (its foot), len long, rw its half-width: the outer wall turned to the eye as a sheet (sheet3), five ribs, the lobed mouth;
   when the mouth turns to the eye its paler inside, the white style and its three curled stigmas; the calyx, or the saucer, under it */
function l31Bell(parts,B,O,len,rw,cw,op,cache){const per=cw.k==='per',pr=per?L31_BELL.per:L31_BELL.med,o2=sm01((op-.25)/.75),lobe=a=>Math.pow(Math.abs(Math.cos(a*2.5)),.6),
    Az=B[2],Xb=B[0],Yb=B[1],th=Math.atan2(Yb[2],Xb[2]),rot=R(0,1.2566),P=l31Pal(cw.c,cache),PB=l31Pal(shd(cw.c,-.12),cache),lite=h2l(cw.c)[2]>.82,
    rad=(a,v)=>rw*pr(v)*(v>.82?1+(.2+.25*o2)*((v-.82)/.18)**2*(lobe(a-rot)-.35):1)*(.75+.25*o2),
    S=(u,v)=>{const a=th+u*Math.PI*.5,r=rad(a,v),fl=v>.85?((v-.85)/.15)**2*len*(-.06+.1*(1-lobe(a-rot))):0;return V3.add(V3.add(O,V3.sc(Az,len*v+fl)),V3.add(V3.sc(Xb,Math.cos(a)*r),V3.sc(Yb,Math.sin(a)*r)))};
  const F={k:null,B:I3,O:[0,0,0],parts:[]},VL=[];for(let j=0;j<5;j++){let d=((rot+j*1.2566+.628-th)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI;if(Math.abs(d)<Math.PI*.47){const u=d/(Math.PI*.5);VL.push([[u,.06],[u,.45],[u,.85]])}}
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:8,nv:9,across:1.5,ew:.5,eo:lite?.7:.45,edge:lite?shd(cw.c,-.45):null,cast:0,veins:VL,vw:Math.max(.4,rw*.07),vo:.35,vlo:.3});
  let zt=-1e9;for(const p of ps)zt=Math.max(zt,p.z);
  /* the mouth: the lobed rim as seen; inside it the wall facing the eye, paler toward the throat; the style and stigmas */
  const mz=Az[2],rim=[];for(let m=0;m<40;m++){const a=m/40*6.283,r=rad(a,1),fl=len*(-.06+.1*(1-lobe(a-rot))),p=V3.add(V3.add(O,V3.sc(Az,len+fl)),V3.add(V3.sc(Xb,Math.cos(a)*r),V3.sc(Yb,Math.sin(a)*r)));rim.push([p[0],-p[1]])}
  if(mz>.08)parts.push({z:zt+.02,fn:par=>{const ic=mix(cw.c,'#ffffff',.18),PI=l31Pal(ic,cache);E('path',{d:smooth(rim),fill:toneAt(PI,.62+.25*mz),stroke:lite?shd(cw.c,-.45):P.d1,'stroke-width':.45,'stroke-opacity':.7,'stroke-linejoin':'round'},par);
    const c=V3.add(O,V3.sc(Az,len*.25)),thr=[];for(let m=0;m<12;m++){const a=m/12*6.283,p=V3.add(c,V3.add(V3.sc(Xb,Math.cos(a)*rw*.42),V3.sc(Yb,Math.sin(a)*rw*.42)));thr.push([p[0],-p[1]])}
    E('path',{d:smooth(thr),fill:shd(ic,-.3),opacity:.45},par);
    if(o2>.3&&mz>.5&&!LOD){/* the style, white, its three stigmas curling back */const s0=V3.add(O,V3.sc(Az,len*.2)),s1=V3.add(O,V3.sc(Az,len*(per?.62:.7)));let d=`M${f(s0[0])},${f(-s0[1])}L${f(s1[0])},${f(-s1[1])}`;
      let dg='';for(let j=0;j<3;j++){const a=j*2.094+rot,e=V3.add(s1,V3.add(V3.sc(Xb,Math.cos(a)*rw*.08),V3.sc(Yb,Math.sin(a)*rw*.08)));dg+=chpDot(e[0],-e[1],Math.max(.5,rw*.06))}
      E('path',{d,stroke:'#efe9d4','stroke-width':f(Math.max(.55,rw*.05)),fill:'none','stroke-linecap':'round','stroke-opacity':.85},par);E('path',{d:dg,fill:'#f4f0e0',stroke:shd(ic,-.3),'stroke-width':.25,'stroke-opacity':.5},par)}}});
  parts.push(...ps)}
/* the calyx under a bell or a bud: five narrow green sepals (and in medium five little reflexed appendages); the saucer of the calycanthema, a coloured, wavy disc */
function l31Calyx(parts,B,O,len,rw,cw,sau,zb){const Az=B[2],Xb=B[0],Yb=B[1],rot=R(0,1.2566),P=pal7('#5a8a3c');
  if(sau){const pts=[];for(let m=0;m<30;m++){const a=m/30*6.283,r=rw*1.75*(1+.06*Math.sin(a*10+rot)),p=V3.add(V3.add(O,V3.sc(Az,len*(.08+.05*Math.sin(a*5)))),V3.add(V3.sc(Xb,Math.cos(a)*r),V3.sc(Yb,Math.sin(a)*r)));pts.push([p[0],-p[1]])}
    const nz=Az[2],c=lt(cw.c,.08),PS=pal7(c),z=O[2]+len*.08*nz;
    parts.push({z:zb!=null?zb:z,fn:par=>{E('path',{d:smooth(pts),fill:toneAt(PS,.55+.25*Math.abs(nz)),stroke:h2l(c)[2]>.82?shd(c,-.45):PS.d1,'stroke-width':.45,'stroke-opacity':.6},par);
      if(!LOD){let d='';for(let j=0;j<10;j++){const a=j*.628+rot,a0=V3.add(O,V3.add(V3.sc(Xb,Math.cos(a)*rw*.7),V3.sc(Yb,Math.sin(a)*rw*.7))),a1=V3.add(O,V3.add(V3.sc(Az,len*.1),V3.add(V3.sc(Xb,Math.cos(a)*rw*1.55),V3.sc(Yb,Math.sin(a)*rw*1.55))));d+=`M${f(a0[0])},${f(-a0[1])}L${f(a1[0])},${f(-a1[1])}`}
        E('path',{d,stroke:PS.d1,'stroke-width':.4,'stroke-opacity':.35,fill:'none'},par)}}});return}
  let d='';for(let j=0;j<5;j++){const a=j*1.2566+rot,r=V3.add(V3.sc(Xb,Math.cos(a)),V3.sc(Yb,Math.sin(a))),tg=V3.add(V3.sc(Xb,-Math.sin(a)),V3.sc(Yb,Math.cos(a))),b=V3.add(O,V3.sc(r,rw*.3)),
      tip=V3.add(b,V3.add(V3.sc(r,rw*.42),V3.sc(Az,len*.32))),l0=V3.add(b,V3.sc(tg,rw*.12)),l1=V3.add(b,V3.sc(tg,-rw*.12));d+=`M${f(l0[0])},${f(-l0[1])}L${f(tip[0])},${f(-tip[1])}L${f(l1[0])},${f(-l1[1])}Z`;
    if(cw.k!=='per'){const a2=a+.628,r2=V3.add(V3.sc(Xb,Math.cos(a2)),V3.sc(Yb,Math.sin(a2))),b2=V3.add(O,V3.sc(r2,rw*.32)),e2=V3.add(b2,V3.add(V3.sc(r2,rw*.2),V3.sc(Az,-len*.12)));d+=`M${f(b2[0])},${f(-b2[1])}L${f(e2[0])},${f(-e2[1])}`}}
  parts.push({z:zb!=null?zb:O[2]+len*.1*Az[2],fn:par=>E('path',{d,fill:toneAt(P,.55),stroke:P.d1,'stroke-width':.5,'stroke-opacity':.7,'stroke-linejoin':'round'},par)})}
/* a bud: pointed, five-angled ovoid, green when young then coloured */
function l31CamBud(par,B,O,s,col){spBud(par,B,O,s,s*.5,col,{tp:.55,pw:.55});if(LOD)return;let d='';for(let j=0;j<3;j++){const a=j*1.05-1.05,pts=[];for(let i=0;i<=6;i++){const v=.08+i/6*.88,r=s*.25*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.55)*(1-.55*v),p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r+0,v*s]);pts.push([p[0],p[1]])}d+=smooth(pts,false)}
  E('path',{d,stroke:shd(col,-.35),'stroke-width':.4,'stroke-opacity':.45,fill:'none'},par)}
function l31CamPlant(g,t,o){const cw=cwPick(CW_L31CAM,o),per=cw.k==='per',sau=cw.k==='cup',op=Math.max(.05,Math.min(1,o.op??R(.78,1))),k=G(g),parts=[],cache={},sp=!!o.spine,
    Lf0=(o.cm||30)*UPC*(per?.85:1),Lt=sp?blen(o.spine):Lf0*1.75,Dm=(per?3.4:5)*UPC*R(.95,1.05),SC=['#2c4620','#4c7234','#78a056','#b0cc88'],pc=mix(SC[1],'#6a8a4a',.3),lc=per?'#466e30':'#55803c';let Lfl=0,Lb=0;
  const P=spGrow(o,Lt,{face:R(-.7,.7),wig:.03,e:.06,seg:7,w:per?3.2:4.6,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.75:.6:.62));Lb=L-Lfl;const ph0=R(0,360),N=[],n=per?4:3;
    for(let j=0;j<n;j++){const u=j/Math.max(1,n-1);N.push({l:Lb*(.16+.7*u)*R(.95,1.05),phi:ph0+j*137.5,kink:R(1,2.5),leaf:{a:44-10*u+R(-5,5),len:Dm*(per?2.5-.5*u:2.6-.8*u)*R(.9,1.1),w:per?.13:.27}})}return N}}),A=P.A,L=A.L,s0=A.sOf(L-Lfl);
  spStemP(A,parts,[0,s0*.5,s0],per?3.2:4.6,per?2.4:3.4,SC,s0);spStemP(A,parts,[s0,s0+(1-s0)*.3,s0+(1-s0)*.6,1],per?2.4:3.4,1,SC,1,s0);
  for(const lf of P.leaves){const lv=lf.nd.leaf;if(sp){if(lf.nd.l<11*UPC)continue;spLeafUp(lf,.12);const e=V3.add(lf.pos,V3.sc(lf.H,lv.len));if(lf.pos[1]<22||e[1]<22)continue}
    parts.push(spLeafPart(A,lf,lv.len,(par,x,y,ang,len,face)=>lanceFlat(par,x,y,ang,len,lv.w,lc,{tilt:Math.acos(Math.min(1,face)),wav:per?0:2.5,fold:.35})))}
  /* the raceme: from its foot, open bells, one or two opening, coloured buds, green buds at its tip */
  const nT=Math.max(per?5:7,Math.round(Lfl/UPC*(per?.24:.42))),ag=spAges(nT,op<.2?0:Math.min(.82,.12+.72*op),0,per?1:2),Lr=Lfl;
  for(let i=0;i<nT;i++){const qi=i/Math.max(1,nT-1),l=L-Lr+Lr*(.03+.95*spQ(i,nT,per?.6:.45)),s=A.sOf(l),az=(i*137.5+R(-18,18))*D,a=ag[i],f0=A.at(s);
    /* the bract under each flower */
    const r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),bH=V3.nz(V3.add(V3.sc(r,.8),V3.sc(f0.T,.6))),bl=Dm*(.9-.4*qi);
    parts.push({z:A.zk(s,f0.p[2]+bH[2]*bl*.4)-.003,fn:par=>{const p=[f0.p[0],-f0.p[1]],h=[bH[0],-bH[1]];lanceFlat(par,p[0],p[1],Math.atan2(h[1],h[0]),bl*Math.max(.35,Math.hypot(h[0],h[1])),.2,lc,{tilt:.5,fold:.3})}});
    if(a.k==='bud'){const qb=a.qb,sb=Dm*(.75-.4*qb),pl=spAt(A,s,az,Dm*(per?.45:.2)*(1-.5*qb),.95+.3*qb,0),B=spFrame(pl.ax,pl.T,0),bc=mix(cw.c,'#8cae64',Math.min(.92,.15+.8*Math.round(qb*4)/4));
      parts.push({z:A.zk(s,pl.pos[2]),fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.9,Dm*.05),pc);const cp=[];l31Calyx(cp,B,pl.pos,sb*.6,sb*.32,{k:'per'},false,0);cp[0].fn(par);l31CamBud(par,B,pl.pos,sb,bc)}})}
    else{const h=a.k==='half'?a.op:1,sz=(1-.15*qi)*(.78+.22*h),len=Dm*sz,rw=len*(per?.42:.33),pl=spAt(A,s,az,Dm*(per?.75:.32)*(.6+.4*h),(per?.5:.42)+(1-h)*.35+R(-.1,.1),0),B=spFrame(pl.ax,pl.T,R(-.2,.2)),bp=[];
      if(sau&&h>.5)l31Calyx(bp,B,pl.pos,len,rw,cw,true);else l31Calyx(bp,B,pl.pos,len*.8,rw,cw,false);
      l31Bell(bp,B,pl.pos,len,rw,cw,h,cache);/* the calyx is under the bell when the bell faces away, over its foot when the eye looks up the bell's back */
      const zz=A.zk(s,pl.pos[2]);let zmin=1e9,zmax=-1e9;for(const q of bp){zmin=Math.min(zmin,q.z);zmax=Math.max(zmax,q.z)}
      if(B[2][2]<0)bp[0].z=zmax+.01;else bp[0].z=zmin-.01;bp.sort((p,q)=>p.z-q.z);
      parts.push({z:zz,fn:par=>{spPed(par,pl.node,pl.pos,pl.T,Math.max(.9,Dm*.05),pc);for(const q of bp)q.fn(par)}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:per?3.2:4.6,bc:SC}}
/* ---------- registries: pentas, yarrow and throatwort are heads grown on their stem; astilbe and campanula are lines along the composer's spine ---------- */
Object.assign(GH,{'astilbe':l31AstPlant,'pentas':l31PenPlant,'achillee':l31AchPlant,'trachelium':l31TraPlant,'campanule':l31CamPlant});
Object.assign(CWS,{'astilbe':CW_L31AST,'pentas':CW_L31PEN,'achillee':CW_L31ACH,'trachelium':CW_L31TRA,'campanule':CW_L31CAM});
Object.assign(SZG,{'astilbe':[15,20,25,25,30],'pentas':[6,7,8,8,9,10],'achillee':[7,8,10,10,12,14],'trachelium':[9,11,12,14,15],'campanule':[20,25,30,30,35]});
Object.assign(GHI,{'pentas':{form:'sphere',size:1.6,k:'head',rk:.95},'achillee':{form:'disque',size:1.8,k:'head',rk:1},'trachelium':{form:'disque',size:1.8,k:'head',rk:1},
  'astilbe':{form:'epi',size:1,k:'plant',self:55*UPC,tip:.85,fx:3*UPC},'campanule':{form:'epi',size:1,k:'plant',self:62*UPC,tip:.9,fx:4.5*UPC}});
for(const id of['pentas','achillee','trachelium'])GH_BUDS.add(id);
