/* ================= Serre, lot 90 — champêtres 2, poussés par le L-système : carthame (houppe dans son involucre épineux), célosie à épis (épis papyracés argentés), camomille (marguerites au cœur conique),
   agérate (corymbes de pompons duveteux), immortelle (corymbes de boutons d'or sur tiges argentées) ================= */
/* ---------- shared pieces ---------- */
/* a stroke that carries a piece (a twig, a thread of a leaf) never thinner than the app's pixel test can follow; finer only on the sheets */
const l90W=w=>DET>=1.5?w:Math.max(1.05,w);
/* a 2D leaf cut into threads (chamomile): a rachis, pairs of pinnae forking into filiform lobes; two strokes */
function l90Fili(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.35,o.ct??.8),bend=R(-.14,.14)*len,np=o.np||5,at=t=>[len*t,bend*t*t];
  let dm='M0,0';for(let i=1;i<=8;i++){const p=at(i/8);dm+=`L${f(p[0])},${f(p[1])}`}let dl='';
  for(let i=0;i<np;i++){const t=.14+.8*i/(np-1),p=at(t),l=len*.34*(1-.45*t)*R(.85,1.12);
    for(const s of[-1,1]){const a=s*R(.5,.8),ex=p[0]+Math.cos(a)*l,ey=p[1]+Math.sin(a)*l*ct,mx=p[0]+Math.cos(a)*l*.5+l*.08,my=p[1]+Math.sin(a)*l*.5*ct;dl+=`M${f(p[0])},${f(p[1])}Q${f(mx)},${f(my)} ${f(ex)},${f(ey)}`;
      const fx=p[0]+Math.cos(a)*l*.42+l*.05,fy=p[1]+Math.sin(a)*l*.42*ct,b=a+s*.55;dl+=`M${f(fx)},${f(fy)}l${f(Math.cos(b)*l*.48)},${f(Math.sin(b)*l*.48*ct)}`}}
  const e=at(1);dl+=`M${f(e[0])},${f(e[1])}l${f(len*.08)},${f(bend*.05)}`;
  E('path',{d:dm,stroke:P.d1,'stroke-width':f(l90W(Math.max(.6,len*.022))),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:dl,stroke:toneAt(P,.58),'stroke-width':f(l90W(Math.max(.5,len*.014))),fill:'none','stroke-linecap':'round'},g);return g}
/* scales laid in the painter's order: sorted, cut in runs, each run one path per key (a few dozen elements for hundreds of florets) */
/* the fine axes of a grown branch as batched items, pushed a little back so that the heads they carry stay in front of them */
function l90Twigs(items,res,cls,zb){const n0=items.length;l30Twigs(items,res,cls);for(let i=n0;i<items.length;i++)items[i].z-=zb}
function l90Runs(par,items,keys,per){items.sort((a,b)=>a.z-b.z);for(let i=0;i<items.length;i+=per){const B={};for(const q of items.slice(i,i+per))l30Add(B,q.k,q.d);for(const[k,a]of keys)if(B[k])E('path',Object.assign({d:B[k]},a),par)}}

/* ---------- carthame (Carthamus tinctorius): a stiff, pale, branched stem, sessile oblong leaves edged with spiny teeth, each branch ending in one head: an urn of green,
   overlapping, spine-tipped bracts, the outer ones leafy and spreading; from its narrowed mouth a tuft (houppe) of slender tubular florets, yellow as they open, turning orange
   to brick red with age (the yellow and the cream forms keep their colour); the round green buds, already prickly, are sold as well ('Grenade') ---------- */
const CW_L90CAR=[{id:'orange',n:'Orange (Zanzibar)',c:'#e9792a',y:'#efb02e'},{id:'or',n:'Jaune d’or (Lasting Yellow)',c:'#eab32b',y:'#efd04a'},{id:'rouge',n:'Rouge orangé (Feuerschopf)',c:'#d9542a',y:'#ec8e2c'},
  {id:'creme',n:'Crème (Creme Weiss)',c:'#efe2c0',y:'#f0e6b4'},{id:'blanc',n:'Blanc ivoire (Lasting White)',c:'#efe9da',y:'#efe6c6'}];
/* the head in its frame B (z = its axis, origin at its foot); s its diameter, a its age (0 a shut bud … 1 the full tuft) */
function l90CarHead(par,B,O,s,a,cw){const g=G(par),det=DET>=1.5,q=sm01((a-.3)/.6),bud=a<.3,Rb=s*(bud?.3:.34),hB=s*(bud?.58:.66),gc='#6f9440',gd='#3f5e28',el=toV(B,[0,0,1])[2],rot=R(0,6.283);
  const rAt=v=>Rb*Math.pow(Math.sin(Math.PI*(.06+.94*v*(bud?1:.8))),bud?.75:.6)*(bud?1:1-.15*v),body=[];
  for(let i=0;i<=8;i++)for(let j=0;j<12;j++){const v=i/8,an=j/12*6.283,r=rAt(v),p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*hB]);body.push([p[0],p[1]])}
  /* the leafy outer bracts, spreading from the foot (those behind before the urn) */
  const nb=det?7:5,outer=[];for(let i=0;i<nb;i++){const phi=rot+i/nb*6.283+R(-.2,.2),l=ligule(B,O,{phi,r0:Rb*.5,z0:hB*.08,L:s*R(.5,.68)*(bud?.85:1),W:s*.13,wp:prof([[0,.45],[.35,1],[.75,.7],[1,.06]]),a0:bud?.7:.95,a1:bud?.5:.75+.35*q,pw:1.2,tip:'point',th:.6,n:4,tw:R(-.3,.3)});
    outer.push({l,c:mix(gc,'#8aac58',R(0,.4)),ink:gd,back:toV(B,[Math.cos(phi),Math.sin(phi),0])[2]<0})}
  const urn=()=>{E('path',{d:smooth(hull2(body)),fill:budFill(gc),stroke:gd,'stroke-width':.4,'stroke-opacity':.6},g);
    /* the appressed bracts tiled up the urn, each ending in a short spine */
    let dt='',dl='',ds='';const rows=bud?4:5,nr=det?9:6;for(let r=0;r<rows;r++){const v0=.12+.8*r/rows,v1=Math.min(bud?1.02:.98,v0+1.25/rows),ph=rot+r*.35;
      for(let j=0;j<nr;j++){const an=ph+j/nr*6.283,nV=toV(B,[Math.cos(an),Math.sin(an),.25]);if(nV[2]<.1)continue;const w=6.283/nr*.62,pt=(u,v)=>{const rr=rAt(Math.min(1,v))*1.03;return PJ(B,O,[Math.cos(an+u)*rr,Math.sin(an+u)*rr,v*hB])};
        const A=pt(-w,v0),Bq=pt(-w*.8,(v0+v1)/2),T=pt(0,v1),C=pt(w*.8,(v0+v1)/2),D0=pt(w,v0),d=`M${f(A[0])},${f(A[1])}Q${f(Bq[0])},${f(Bq[1])} ${f(T[0])},${f(T[1])}Q${f(C[0])},${f(C[1])} ${f(D0[0])},${f(D0[1])}Z`;
        if(V3.dot(nV,LIGHT)>.25)dl+=d;else dt+=d;if(r===rows-1){const tip=PJ(B,O,[Math.cos(an)*rAt(Math.min(1,v1))*1.1,Math.sin(an)*rAt(Math.min(1,v1))*1.1,v1*hB+s*.05]);ds+=`M${f(T[0])},${f(T[1])}L${f(tip[0])},${f(tip[1])}`}}}
    if(dt)E('path',{d:dt,fill:toneAt(pal7(gc),.5),stroke:gd,'stroke-width':.3,'stroke-opacity':.55,'stroke-linejoin':'round'},g);
    if(dl)E('path',{d:dl,fill:toneAt(pal7(gc),.76),stroke:gd,'stroke-width':.3,'stroke-opacity':.5,'stroke-linejoin':'round'},g);
    if(ds&&!LOD)E('path',{d:ds,stroke:'#a8aa6a','stroke-width':f(Math.max(.4,s*.02)),fill:'none','stroke-linecap':'round'},g)};
  /* the tuft: tubular florets from the mouth, the outer ones spreading; its massed base first, then the florets by depth (lit, shaded), their pale styles */
  const tuft=()=>{if(bud&&a<.22)return;const top=[0,0,hB*.9],nf=det?64:30,Lf=s*(.18+.26*q),col=mix(cw.y||cw.c,cw.c,q),P=pal7(col),tips=spDisc(B,O,Rb*.55,hB*.86,10),fl=[];
    for(let i=0;i<nf;i++){const rr=Math.sqrt((i+.5)/nf),an=i*2.39996+rot,sp=rr*(.22+.45*q),d=V3.nz([Math.cos(an)*Math.sin(sp),Math.sin(an)*Math.sin(sp),Math.cos(sp)]),b0=[Math.cos(an)*Rb*.5*rr,Math.sin(an)*Rb*.5*rr,top[2]-s*.04],
        l=Lf*R(.88,1.08)*(1.12-.4*rr*rr),e=V3.add(b0,V3.sc(d,l)),m=V3.add(V3.add(b0,V3.sc(d,l*.5)),[0,0,l*.06]),pb=PJ(B,O,b0),pm=PJ(B,O,m),pe=PJ(B,O,e),dV=toV(B,d);tips.push([pe[0],pe[1]]);
      fl.push({z:pe[2],lit:V3.dot(dV,LIGHT)>.15,d:`M${f(pb[0])},${f(pb[1])}Q${f(pm[0])},${f(pm[1])} ${f(pe[0])},${f(pe[1])}`,e:pe})}
    E('path',{d:smooth(hull2(tips)),fill:toneAt(P,.12),stroke:shd(col,-.45),'stroke-width':.35,'stroke-opacity':.4},g);
    fl.sort((p,r)=>p.z-r.z);const w=l90W(Math.max(.8,s*.085));
    const ng=det?9:3,per=Math.ceil(fl.length/ng);for(let gi=0;gi<fl.length;gi+=per){const half=fl.slice(gi,gi+per);let dd='',dl='',dg='';for(const q2 of half){if(q2.lit)dl+=q2.d;else dd+=q2.d;if(!LOD&&q>.25)dg+=chpDot(q2.e[0],q2.e[1],w*.36)}
      const all=dd+dl;if(all)E('path',{d:all,stroke:P.d2,'stroke-width':f(w),fill:'none','stroke-linecap':'round','stroke-opacity':.85},g);if(dd)E('path',{d:dd,stroke:P.b,'stroke-width':f(w*.55),fill:'none','stroke-linecap':'round'},g);if(dl)E('path',{d:dl,stroke:P.l1,'stroke-width':f(w*.55),fill:'none','stroke-linecap':'round'},g);
      if(dg)E('path',{d:dg,fill:mix(cw.y||cw.c,'#fff4c8',.4),opacity:.9},g)}};
  const back=outer.filter(o=>o.back),front=outer.filter(o=>!o.back);if(back.length)drawLig(g,back);
  if(el<-.2){tuft();urn()}else{urn();tuft()}if(front.length)drawLig(g,front);return g}
function l90CarPlant(g,t,o){const cw=o.cw||cwNear(CW_L90CAR,o.col)||CW_L90CAR[0],op=Math.max(.05,Math.min(1,o.op??1)),Dm=(o.cm||2.5)*UPC,k=G(g),B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],
    A0=V3.nz(axOf(o)),aim=V3.nz(V3.add(V3.add(V3.sc(A0,.55),V3.sc(up,.6)),[0,0,o.up?.4:0])),sc=['#4a5a34','#76865a','#a6b48a','#d0d8b8'],lc='#5f7f3a';
  const r=chpHeadS(k,o,{B,up,face:A0,aim,aimK:.35,D:Dm,w:Math.max(1.6,Dm*.16),cols:sc,op,nodes:3,li:1.5,lp:2.6,leafAng:40,side:{p:.85,n:1,top:3,len:2.6,ang:30,age:[0,.8],e:.04,w:.75},seg:.3,wig:.025,e:.012,
    flower:(par,Bf,O,op2)=>l90CarHead(par,Bf,O,Dm,op2,cw),young:(par,Bf,O,a)=>l90CarHead(par,Bf,O,Dm*(a<.3?.85:.8+.15*a),a,cw),
    leaf:(og,pos)=>bzBlade(pos,og.H,og.U,Dm*(og.p.i<=1?R(1.3,1.6):R(1.8,2.3)),.34,lc,{wp:LS_LANCE,teeth:7,td:.22,droop:.12,arch:.06,fold:.3,face:.4,vn:4,gloss:.6})});
  open(k,t,1000,8,.3);return r}

/* ---------- célosie à épis (Celosia spicata 'Flamingo Feather' and its kin; wheat celosia): a slender, much-branched plant; every branch ends in a narrow, pointed spike
   5–10 cm long, about 1 cm thick, of tiny papery florets pressed upward like scales; the florets open from the foot, and the old ones lose their colour, so that the spike is
   silvery white below and coloured (pink, purple, ruby) in its upper part, its very tip still green-tinged while it grows. In a bouquet it is a line along the composer's spine ---------- */
const CW_L90CEL=[{id:'flamingo',n:'Rose argenté (Flamingo Feather)',c:'#e9a6c2',c2:'#f1ecee'},{id:'rose',n:'Rose vif (Asian Garden)',c:'#d9649a',c2:'#efe4ea'},
  {id:'pourpre',n:'Pourpre (Flamingo Purple)',c:'#9e2e78',c2:'#e6d8e2',lc:'#4e4a2c',st:['#2a1820','#523040','#78505c','#a07e88']},{id:'rubis',n:'Rubis (Ruby Parfait)',c:'#a52a52',c2:'#ecc8d4',lc:'#4e4a2c'},
  {id:'amazon',n:'Rose pourpre (Cramer’s Amazon)',c:'#b8407a',c2:'#efd2e0'},{id:'argent',n:'Blanc argenté',c:'#ece8e2',c2:'#f4f2ee'},{id:'saumon',n:'Saumon',c:'#e59a83',c2:'#f2e6e0'}];
/* a spike along C3 (view space, foot → tip), Ws thick: its outline, silver below, its colour above, then its scales (one floret each) climbing in a spiral, pressed upward */
function l90Spike(par,C3,Ws,cw,a){const n=C3.length-1,g=G(par),det=DET>=1.5,ph=R(0,6.28),q=sm01((a-.05)/.9),vt=.12+.38*q,col=cw.c,sil=cw.c2||'#eeeae4',tipc=mix(col,'#7a9a50',.35*(1-q)+.12),
    rv=v=>Ws/2*(v<.06?.55+.45*Math.sin(Math.PI/2*v/.06):v<.5?1:Math.pow((1-v)/.5,1.05))+.25,C=C3.map(p=>[p[0],-p[1]]),rs=C3.map((p,i)=>rv(i/n));
  const Tg=i=>V3.nz(V3s(C3[Math.min(n,i+1)],C3[Math.max(0,i-1)])),FR=C3.map((p,i)=>{const T=Tg(i),X=V3.nz(V3.cr(Math.abs(T[2])<.9?[0,0,1]:[1,0,0],T));return[T,X,V3.cr(T,X)]});
  const cAt=v=>v<vt-.1?mix(sil,col,Math.max(0,(v-vt+.45)/.35)*.25):v<vt+.12?mix(mix(sil,col,.25),col,(v-vt+.1)/.22):v>.93?mix(col,tipc,(v-.93)/.07):col;
  /* its colour runs along the axis (silver, the passage, the colour, the green tip); a second fill shades it across, lit on the left */
  const gA='l90a'+(gid++),gr=E('linearGradient',{id:gA,gradientUnits:'userSpaceOnUse',x1:f(C[0][0]),y1:f(C[0][1]),x2:f(C[n][0]),y2:f(C[n][1])},defs);
  stops(gr,[[0,mix(sil,col,.08)],[Math.max(.01,vt-.12),mix(sil,col,.22)],[Math.min(.9,vt+.12),col],[.92,col],[1,tipc]]);
  const mI=n>>1,ux=C[Math.min(n,mI+1)][0]-C[Math.max(0,mI-1)][0],uy=C[Math.min(n,mI+1)][1]-C[Math.max(0,mI-1)][1],ul=Math.hypot(ux,uy)||1;let px=-uy/ul,py=ux/ul;if(px>0){px=-px;py=-py}
  const gX='l90x'+(gid++),gx=E('linearGradient',{id:gX,gradientUnits:'userSpaceOnUse',x1:f(C[mI][0]+px*Ws*.55),y1:f(C[mI][1]+py*Ws*.55),x2:f(C[mI][0]-px*Ws*.55),y2:f(C[mI][1]-py*Ws*.55)},defs);
  stops(gx,[[0,'#2a1a1a',.22],[.28,'#ffffff',.26],[.5,'#ffffff',0],[.8,'#2a1a1a',.18],[1,'#2a1a1a',.42]]);
  const tube=smooth(chpTube(C,rs,3));E('path',{d:tube,fill:`url(#${gA})`,stroke:shd(mix(sil,col,.5),-.5),'stroke-width':.4,'stroke-opacity':.5,'stroke-linejoin':'round'},g);E('path',{d:tube,fill:`url(#${gX})`},g);
  if(LOD)return g;
  const ns=Math.round((det?170:56)),its=[],bands=5,keyOf=(v,lit)=>'s'+Math.min(bands-1,Math.floor(v*bands))+(lit?'l':'d');
  for(let k=0;k<ns;k++){const v=.03+.94*(k+.5)/ns,i=Math.min(n-1,Math.floor(v*n)),t=v*n-i,ps=k*2.39996+ph,[T,X,Y]=FR[i],rad=V3.add(V3.sc(X,Math.cos(ps)),V3.sc(Y,Math.sin(ps)));if(rad[2]<-.05)continue;
    const r=(rs[i]+(rs[i+1]-rs[i])*t),c=V3.add(C3[i],V3.sc(V3s(C3[i+1],C3[i]),t)),Ls=Ws*(det?.36:.46)*(1-.4*v)+.6,w=Ls*.55,S=V3.nz(V3.cr(T,rad)),p=V3.add(c,V3.sc(rad,r*.7)),
      e=V3.add(p,V3.add(V3.sc(T,Ls),V3.sc(rad,Ls*.32))),m1=V3.add(V3.add(p,V3.sc(T,Ls*.45)),V3.add(V3.sc(S,w*.55),V3.sc(rad,Ls*.22))),m2=V3.add(V3.add(p,V3.sc(T,Ls*.45)),V3.add(V3.sc(S,-w*.55),V3.sc(rad,Ls*.22))),
      a1=V3.add(p,V3.sc(S,w*.3)),a2=V3.add(p,V3.sc(S,-w*.3)),sc2=x=>f(x[0])+','+f(-x[1]);
    its.push({z:p[2]-v*.01,k:keyOf(v,V3.dot(rad,LIGHT)>.1),d:`M${sc2(a1)}Q${sc2(m1)} ${sc2(e)}Q${sc2(m2)} ${sc2(a2)}Z`})}
  const keys=[];for(let b=0;b<bands;b++){const v=(b+.5)/bands,c=cAt(v),P=pal7(c);keys.push(['s'+b+'d',{fill:toneAt(P,.46),stroke:shd(c,-.4),'stroke-width':.25,'stroke-opacity':.5}],['s'+b+'l',{fill:toneAt(P,.7),stroke:shd(c,-.35),'stroke-width':.25,'stroke-opacity':.45}])}
  l90Runs(g,its,keys,det?28:30);return g}
function l90CelPlant(g,t,o){const cw=cwPick(CW_L90CEL,o),op=Math.max(.05,Math.min(1,o.op??R(.8,1))),k=G(g),parts=[],SC=cw.st||['#2c4a1e','#4a7232','#76a050','#acc886'],lc=cw.lc||'#4f7a34',
    Lf0=(o.cm||10)*UPC,Lt=o.spine?blen(o.spine):Lf0*3.4,A=chpAxis(o,Lt,{face:R(-.6,.6),amp:.18*UPC,nw:1.1,e0:.35}),L=A.L,q=sm01((op-.05)/.95),
    Ls=Math.min(Lf0*(.55+.45*q),L*(o.spine?o.short?.34:.26:.3)),Ws=Math.max(4.2,Lf0*.11*(.85+.15*q)),sP=A.sOf(L-Ls);
  chpStem(A,parts,[0,sP*.5,Math.min(1,sP+(1-sP)*.04)],4,2.4,SC);
  const C3=[];for(let i=0;i<=14;i++)C3.push(A.cb(sP+(1-sP)*i/14));let zp=0;for(const p of C3)zp+=p[2];parts.push({z:zp/C3.length+.5,fn:par=>l90Spike(par,C3,Ws,cw,op)});
  /* side spikes on long curving branches from the upper axils (the plant branches like a candelabrum), some forking again into a smaller spike */
  const ns=Math.max(2,Math.round((o.spine?o.short?2:3:5)*(.7+.3*q)+rnd()*.8)),lz=L-Ls;
  for(let j=0;j<ns;j++){const l=lz-Lf0*(.06+.55*j/Math.max(1,ns))*R(.9,1.1);if(l<(o.spine?L*.42:Lf0*.4))continue;const s=A.sOf(l),fr=A.at(s),az=(j*137.5+R(-20,20))*D,th=(36+R(-6,8))*D,
      side=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)*.5),V3.sc(fr.Sd,Math.sin(az)))),dir=V3.nz(V3.add(V3.sc(fr.T,Math.cos(th)),V3.sc(side,Math.sin(th)))),
      lb=Lf0*R(.35,.6)*(1+.3*j/ns),lps=Ls*R(.6,.8)*(1-.12*j),res=lsTurtle([['F',{l:lb,w0:2.2,w1:1.6}],['F',{l:lps,w0:1.6,w1:1.2}]],{p:fr.p,H:dir,U:fr.Fr,wig:.02,seg:Math.max(3,(lb+lps)/14),T:[0,1,0],e:.07,w:2.2}),
      P=res.chains[0].pts,cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const ib=cum.findIndex(c=>c>=lb),stalk=P.slice(0,Math.max(2,ib+1)),pl=P.slice(Math.max(0,ib));
    let zs=0;for(const p of stalk)zs+=p[2];parts.push({z:zs/stalk.length,fn:par=>chpTwig(par,stalk,2.2,1.6,SC)});
    if(pl.length>2){let z2=0;for(const p of pl)z2+=p[2];const a=Math.max(.1,Math.min(1,op*(.9-.1*j))),W2=Ws*R(.75,.9);parts.push({z:z2/pl.length+.4,fn:par=>l90Spike(par,pl,W2,cw,a)})}
    const Lx=V3.nz(V3.cr(fr.T,side)),H=V3.nz(V3.add(V3.sc(fr.T,Math.cos(55*D)),V3.sc(side,Math.sin(55*D)))),og={pos:fr.p,H,L:Lx,U:V3.cr(H,Lx)};
    parts.push(chpLeaf3(og,fr.p,Lf0*R(.4,.55),.15,lc,{droop:.25}))}
  const lmin=o.spine?10*UPC:Lf0*.2,nl=o.spine?3:5;for(let j=0;j<nl;j++){const l=lmin+(lz-Lf0*.5-lmin)*(j+.3)/nl;if(l<lmin||l>lz-Lf0*.1)continue;const s=A.sOf(l),fr=A.at(s),az=(j*137.5+R(-20,20))*D,
      side=V3.nz(V3.add(V3.sc(fr.Fr,Math.cos(az)*.6),V3.sc(fr.Sd,Math.sin(az)))),Lx=V3.nz(V3.cr(fr.T,side)),H=V3.nz(V3.add(V3.sc(fr.T,Math.cos(46*D)),V3.sc(side,Math.sin(46*D)))),og={pos:fr.p,H,L:Lx,U:V3.cr(H,Lx)};
    parts.push(chpLeaf3(og,fr.p,Lf0*R(.7,.9)*(1-.06*j),.15,lc,{droop:.3}))}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:4,bc:SC}}

/* ---------- camomille (Matricaria chamomilla, syn. M. recutita): a fine, much-branched, glabrous stem, the leaves two or three times cut into threadlike lobes; every branchlet
   ends in a small daisy (1.5–2.5 cm): 12–17 white rays round a yellow disc that rises, as it ages, into a high hollow cone, while the rays fold back down against the peduncle ---------- */
const CW_L90CAM=[{id:'blanc',n:'Blanc (Bodegold)',c:'#f8f6ee',disc:'#e6b922'}];
function l90CamPlant(g,t,o){const cw=cwPick(CW_L90CAM,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||25)*UPC,sc=['#2e4a22','#4a6a36','#6e9050','#a4c080'],tw='#5f8a40',lc='#6f9a46';
  const P=pal7(cw.c),disc=cw.disc,hr=.95*UPC;
  return bzShoot(g,t,o,{Lt:C*1.45,w0:2.6,w1:1.1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    /* a head on its peduncle: a bud (the green involucre, the yellow disc swelling in it), then the rays spreading flat, then the cone rising and the rays folding back */
    const head=(og,age)=>{const m=op*1.3-age*.2+R(-.08,.08),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.45),[0,.7,0]),V3.sc(FW,.6))),pos=og.pos;
      if(m<.32){const r=hr*R(.26,.32)*(.75+.5*Math.max(0,m/.32)),c=V3.add(pos,V3.sc(ax,r*.55));hd.push({z:c[2],fn:B=>{l30Add(B,'gs',l30O(c[0]+r*.12,c[1]-r*.18,r));l30Add(B,'gb',l30O(c[0],c[1],r*.88));
        if(m>.12){const tp=V3.add(c,V3.sc(ax,r*.45));l30Add(B,'gt',l30O(tp[0],tp[1],r*.55*Math.min(1,m/.32)))}if(!LOD)l30Add(B,'gl',l30O(c[0]-r*.3,c[1]+r*.3,r*.26))}});return}
      const op2=Math.min(1,(m-.32)/.5),old=Math.max(0,Math.min(1,(m-.95)/.35)),r=hr*R(.85,1.1)*(.5+.5*op2),Bf=l30Fr(ax,[0,1,0],R(0,6.283)),O=pos,n=ax[2],rd=r*.3,dh=r*(.16+.3*op2+.25*old),nr=13+Math.floor(rnd()*4);
      const A0=.3*(1-op2)-.05-.55*old,A1=.12*(1-op2)-.22-1.1*old;
      hd.push({z:O[2]+r*.2*n,fn:B=>{const q=n<-.1?'q':'r',NK=DET>=1.5?6:3,ph=R(0,6.283),I=Math.max(.3,Math.min(1,lightI(n<-.1?V3.sc(ax,-1):ax)));
        for(let i=0;i<nr;i++){const an=ph+i*6.283/nr+R(-.06,.06),e=[Math.cos(an),Math.sin(an),0],tg=[-e[1],e[0],0],L1=[],R1=[],w=r*.15*R(.9,1.1),ln=(r-rd*.85)*(.35+.65*op2)*R(.9,1.08);
          for(let k=0;k<=NK;k++){const v=k/NK,d=rd*.85+ln*v*Math.cos(Math.max(0,-(A0+A1*v))*.6),ww=w*Math.sin(Math.PI*Math.min(.9,v*.85+.1))*(v>.85?.85:1),z=ln*v*(A0+A1*v*.8);
            L1.push(PJ(Bf,O,[e[0]*d+tg[0]*ww,e[1]*d+tg[1]*ww,z]));R1.push(PJ(Bf,O,[e[0]*d-tg[0]*ww,e[1]*d-tg[1]*ww,z]))}
          l30Add(B,q+(I>.62?1:0),l30Poly(L1.concat(R1.reverse())))}
        if(n>-.25){const dc=[];for(const[zz,rr]of[[0,rd],[dh*.4,rd*.8],[dh*.75,rd*.48],[dh,rd*.12]])for(const p of spDisc(Bf,O,rr,zz,12))dc.push(p);l30Add(B,'d',smooth(l30Hull(dc)));
          if(DET>=1.5&&!LOD){let dd='';for(let j=0;j<22;j++){const v=Math.sqrt((j+.5)/22),an=j*2.39996+ph,zz=dh*(1-v)*.95,rr=rd*(.12+.86*v)*.92,nV=toV(Bf,[Math.cos(an),Math.sin(an),.6]);if(nV[2]<.1)continue;const p=PJ(Bf,O,[Math.cos(an)*rr,Math.sin(an)*rr,zz]);dd+=chpDot(p[0],p[1],Math.max(.3,r*.035))}if(dd)l30Add(B,'dd',dd)}}
        if(n<-.1){const iv=[];for(const[zz,rr]of[[0,rd*1.1],[-dh*.3,rd*.9],[-dh*.6,rd*.4]])for(const p of spDisc(Bf,O,rr,zz,10))iv.push(p);l30Add(B,'iv',l30Poly(l30Hull(iv)))}}})};
    /* the branching: from the upper nodes long branchlets, each forking once or twice into peduncles; the main axis ends in the eldest head */
    const fork=(len,lv)=>{if(lv>=2||len<UPC*2.2)return[['F',{l:len,w1:.55,aim:[0,1,0],k:.07}],['K',{a:lv*.6+.2}]];const out=[['F',{l:len*.42,w1:.75-.1*lv}]],nf=rnd()<.45?2:1;
      for(let j=0;j<nf;j++)out.push(['[',{w:.65}],[j?'-':'+',{a:R(26,42)}],...fork(len*R(.5,.65),lv+1),[']',{}]);return out.concat(fork(len*.58,lv+1))};
    const span=C*.75;{const q=A.at(1);head({pos:q.p,H:q.T},0)}let i=0;
    for(let l=L-UPC*.8;l>Math.max(l0+3,L-span);l-=UPC*R(1,1.5)*(1+.6*(L-l)/span),i++){const u=(L-l)/span,az=(i*137.5+R(-15,15))*D,len=(L-l)*R(.7,1.12)/Math.cos(.5)+UPC*1.2;
      const br=bzGrow(A,l,az,R(36,54),fork(len,u<.15?1:0),{w:.95,seg:UPC*.6,T:[0,1,0],e:.03,wig:.04});l90Twigs(items,br,[[.7,'t0'],[0,'t1']],hr*1.2);for(const og of br.organs)if(og.t==='K')head(og,og.p.a+u*.4);
      if(rnd()<.85){const q=l30On(A,l,az+R(-.4,.4),.5),H=l30Tilt(q.T,q.r,R(.6,.9)),ln=UPC*R(1.8,2.8)*(.7+.6*u);parts.push(lsLeaf2D({H},q.p,ln,(par,x,y,an,ll)=>l90Fili(par,x,y,an,ll,lc,{np:4})))}}
    for(let ll=L-span-UPC*.5;ll>l0+6;ll-=UPC*R(1.6,2.3)){const q=l30On(A,ll,R(0,6.283),.5),H=l30Tilt(q.T,q.r,R(.65,1)),v=Math.min(1,(L-ll)/(C*1.2));parts.push(lsLeaf2D({H},q.p,UPC*(2.6+2.6*v)*R(.9,1.1),(par,x,y,an,ll2)=>l90Fili(par,x,y,an,ll2,lc,{np:5})))}
    l30Batch(parts,items,l30TwKeys([['t0',tw,l90W(.8)],['t1',mix(tw,'#a0c080',.2),l90W(.6)]]),DET>=1.5?6:3);
    const ink=P.ink,keys=[['iv',{fill:'#6f9446',stroke:'#2e4a22','stroke-width':.3,'stroke-opacity':.6}]];
    for(const tg of['q','r'])for(const kk of[0,1])keys.push([tg+kk,{fill:tg==='q'?mix(toneAt(P,.5+.2*kk),'#b4c49a',.2):toneAt(P,.62+.2*kk),stroke:ink,'stroke-width':.25,'stroke-opacity':.45}]);
    keys.push(['d',{fill:budFill(disc),stroke:shd(disc,-.5),'stroke-width':.3,'stroke-opacity':.6}],['dd',{fill:shd(disc,-.3),opacity:.55}]);
    keys.push(['gs',{fill:'#4a6e30'}],['gb',{fill:'#8fb056'}],['gt',{fill:mix(disc,'#c8d878',.2)}],['gl',{fill:'#c8dca8',opacity:.8}]);
    l30Flowers(parts,hd,keys,DET>=1.5?8:4)}})}

/* ---------- agérate (Ageratum houstonianum; 'Blue Horizon', the Timeless series, 'Red Sea'): a soft, hairy, branching stem, opposite ovate leaves with round teeth on long petioles;
   at the top and in the upper axils dense corymbs (5–10 cm) of small fluffy heads (6–9 mm): each a little cup of green bracts brimming with tubular florets
   whose long threadlike styles stand out, so that the head is a powder puff ---------- */
const CW_L90AGE=[{id:'lavande',n:'Bleu lavande (Blue Horizon)',c:'#8f8fd0'},{id:'bleu',n:'Bleu (Timeless Blue)',c:'#6f7cc6'},{id:'mauve',n:'Mauve (Timeless Lavender)',c:'#b089c4'},
  {id:'rose',n:'Rose (Timeless Pink)',c:'#e4a0c0'},{id:'blanc',n:'Blanc (Timeless White)',c:'#f5f4f0'},{id:'pourpre',n:'Rouge pourpre (Red Sea)',c:'#c9567e'}];
function l90AgePlant(g,t,o){const cw=cwPick(CW_L90AGE,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||10)*UPC,sc=['#2e4422','#4c6a36','#729050','#a6bc84'],tw='#5a7a3c',lc='#557a36';
  const P=pal7(cw.c),wh=h2l(cw.c)[2]>.88,hr=.42*UPC,ZB=hr*1.5;
  return bzShoot(g,t,o,{Lt:C*3.4,w0:3,w1:1.5,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    /* a head: the green cup, then the puff of florets above it (a scalloped ball lit from the upper left) and its styles; a bud is a tight greenish ball tinged with colour */
    const head=(og,age)=>{const m=op*1.25-age*.25+R(-.06,.06),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.4),[0,.75,0]),V3.sc(FW,.5))),pos=og.pos;
      const q=Math.max(0,Math.min(1,(m-.2)/.6)),r=hr*R(.85,1.12)*(.55+.45*q),c=V3.add(pos,V3.sc(ax,r*(.55+.25*q))),I=Math.max(.2,Math.min(1,lightI(V3.nz(V3.add(ax,[0,0,.6])))+R(-.12,.12))),ph=R(0,6.283);
      hd.push({z:c[2],fn:B=>{const cu=V3.add(pos,V3.sc(ax,r*.22));l30Add(B,'ac',l30O(cu[0],cu[1],r*.58));
        if(q<.2){l30Add(B,'b'+(I>.6?1:0),l30O(c[0],c[1],r*.78));if(!LOD)l30Add(B,'bl',l30O(c[0]-r*.25,c[1]+r*.25,r*.22));return}
        l30Add(B,'a'+(I>.7?2:I>.45?1:0),l30Sc(c[0],c[1],r,DET>=1.5?13:9,ph,.11));
        if(!LOD){l30Add(B,'al',l30O(c[0]-r*.3,c[1]+r*.3,r*.34));if(DET>=1.5&&q>.5){let d='';for(let j=0;j<18;j++){const a=ph+j*.349+R(-.15,.15),r0=r*R(.5,.85),r1=r*R(1,1.2);d+=`M${f(c[0]+Math.cos(a)*r0)},${f(-c[1]-Math.sin(a)*r0)}L${f(c[0]+Math.cos(a)*r1)},${f(-c[1]-Math.sin(a)*r1)}`}l30Add(B,'as',d)}}}})};
    /* the corymbs: a cluster ends every axis — a central head and two to four forking peduncles round it; the outer branches leave from the upper nodes, longer, so the heads come level */
    const clu=(n,len,lv=0)=>{const out=[];for(let j=0;j<n;j++)out.push(['[',{w:.6}],['/',{a:j*360/n+R(-20,20)}],['&',{a:R(44,62)-lv*6}],['F',{l:len*R(.8,1.15),w1:.5,aim:[0,1,0],k:.14}],...(lv<1&&rnd()<.85?clu(2+Math.floor(rnd()*2),len*.42,lv+1):[['K',{a:.25+lv*.3}]]),[']',{}]);return out.concat([['F',{l:len*.25,w1:.5}],['K',{a:lv*.3}]])};
    const top=bzGrow(A,L-.3,0,3,clu(5,C*.2),{w:1.1,seg:UPC*.4,T:[0,1,0],e:.02,wig:.04});l90Twigs(items,top,[[.75,'t0'],[0,'t1']],ZB);for(const og of top.organs)if(og.t==='K')head(og,og.p.a);
    const nodes=7,dl=C*.2;for(let i=0;i<nodes;i++){const l=L-C*.12-dl*i*(1+.3*i);if(l<l0+6)continue;const ph=(i%2?90:0)+R(-10,10),u=i/nodes;
      for(const sd of[0,180]){const az=(ph+sd)*D;if(i<3&&rnd()<(i<2?.95:.6)){const len=(L-l)*R(.8,1)+C*.06,br=bzGrow(A,l,az,R(30,42),[['F',{l:len,w1:.85,aim:[0,1,0],k:.06}],...clu(i<1?3:2,C*(.16-.025*i))],{w:1.1,seg:UPC*.5,T:[0,1,0],e:.03,wig:.04});
          l90Twigs(items,br,[[.75,'t0'],[0,'t1']],ZB);for(const og of br.organs)if(og.t==='K')head(og,og.p.a+u*.5)}
        const q=l30On(A,l,az,1),H=V3.nz(V3.add(V3.sc(q.T,.5),q.r)),len=C*R(.36,.46)*(.6+.9*u);parts.push(bzBlade(q.p,H,q.T,len,.6,lc,{wp:LS_OVATE,teeth:6,td:.14,droop:.22,arch:.06,fold:.18,face:.45,vn:3,pleat:1}))}}
    l30Batch(parts,items,l30TwKeys([['t0',tw,l90W(.95)],['t1',mix(tw,'#a0b880',.2),l90W(.7)]]),DET>=1.5?6:3);
    const keys=[['ac',{fill:'#5f8a3e',stroke:'#2e4a22','stroke-width':.3,'stroke-opacity':.6}],['b0',{fill:mix('#7f9e58',cw.c,.35)}],['b1',{fill:mix('#9ab870',cw.c,.35)}],['bl',{fill:'#dce8c8',opacity:.6}]];
    for(let kk=0;kk<3;kk++)keys.push(['a'+kk,{fill:toneAt(P,wh?.6+.15*kk:.42+.2*kk),stroke:wh?'#b8b8a8':P.d1,'stroke-width':.3,'stroke-opacity':.55,'stroke-linejoin':'round'}]);
    keys.push(['as',{fill:'none',stroke:wh?'#ffffff':P.l2,'stroke-width':.3,'stroke-opacity':.7,'stroke-linecap':'round'}],['al',{fill:wh?'#ffffff':P.l2,opacity:.45}]);
    l30Flowers(parts,hd,keys,DET>=1.5?8:4)}})}

/* ---------- immortelle (Helichrysum italicum, H. stoechas): woody at its foot, the stems white-felted, silver, crowded with narrow needle leaves (1–3 cm) rolled at their margins;
   at the top a dense flat corymb (2–5 cm) of tiny ovoid heads (3–5 mm), their dry, glossy involucral bracts golden yellow even in bud, opening hardly at all: a cluster of buttons ---------- */
const CW_L90HEL=[{id:'or',n:'Jaune d’or (H. italicum)',c:'#e2b42a'},{id:'citron',n:'Jaune citron (H. stoechas)',c:'#e8cf3e'},{id:'paille',n:'Jaune paille (séchée)',c:'#e3cf84'},
  {id:'orange',n:'Orangé (H. arenarium aurantiacum)',c:'#e39a30'},{id:'blanchie',n:'Blanchie (séchée)',c:'#f2ede0'}];
function l90HelPlant(g,t,o){const cw=cwPick(CW_L90HEL,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||8)*UPC,sc=['#6e7864','#929c88','#b8c0b0','#dfe4d8'],tw='#9aa292',nc='#a4ae9c';
  const P=pal7(cw.c),hh=.36*UPC,ZB=hh*1.2;
  return bzShoot(g,t,o,{Lt:C*3.4,w0:2.6,w1:1.3,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    /* a head: an ovoid button on its short pedicel, its glossy bracts, the tiny disc showing at its top once open; young heads greener and woollier */
    const head=(og,age)=>{const m=Math.max(0,Math.min(1,op*1.25-age*.2+R(-.06,.06))),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.5),[0,.7,0]),V3.sc(FW,.4))),pos=og.pos,s=hh*R(.85,1.1)*(.7+.3*m),
        c=V3.add(pos,V3.sc(ax,s*.55)),a2=[ax[0],-ax[1]],l2=Math.hypot(a2[0],a2[1]),e1=l2>.05?[a2[0]/l2*s*.55*l2+0,a2[1]/l2*s*.55*l2]:[s*.4,0],e2=l2>.05?[-a2[1]/l2*s*.38,a2[0]/l2*s*.38]:[0,s*.4],
        I=Math.max(.2,Math.min(1,lightI(V3.nz(V3.add(ax,[0,0,.5])))+R(-.1,.1))),col=m<.4?'g':'y';
      hd.push({z:c[2],fn:B=>{const cs=[c[0],-c[1]];l30Add(B,col+(I>.68?2:I>.42?1:0),chpEll(cs,e1,e2,s*.36));
        if(!LOD){l30Add(B,'hl',chpDot(cs[0]-s*.14,cs[1]-s*.16,s*.13));if(m>.55&&ax[2]>-.2){const tp=V3.add(pos,V3.sc(ax,s*1.02));l30Add(B,'tp',chpEll([tp[0],-tp[1]],[s*.2,0],[0,s*.2*Math.max(.3,Math.abs(ax[2])+.3)],.4))}}}})};
    /* the corymb: forking peduncles from the top nodes, longer below, each ending in a little cluster of three to six buttons on short pedicels */
    const knot=(n,len)=>{const out=[];for(let j=0;j<n;j++)out.push(['[',{w:.55}],['/',{a:j*360/n+R(-25,25)}],['&',{a:R(28,50)}],['F',{l:len*R(.7,1.2),w1:.5,aim:[0,1,0],k:.25}],['K',{a:.3}],...(rnd()<.6?[['[',{w:.5}],['+',{a:R(30,50)}],['F',{l:len*R(.4,.6),w1:.5,aim:[0,1,0],k:.2}],['K',{a:.5}],[']',{}]]:[]),[']',{}]);return out.concat([['F',{l:len*.4,w1:.5}],['K',{a:0}]])};
    const top=bzGrow(A,L-.3,0,3,knot(6,C*.08),{w:1.05,seg:UPC*.3,T:[0,1,0],e:.02,wig:.04});l90Twigs(items,top,[[.75,'t0'],[0,'t1']],ZB);for(const og of top.organs)if(og.t==='K')head(og,og.p.a);
    let i=0;for(let l=L-C*.05;l>Math.max(l0+4,L-C*.55);l-=C*R(.045,.07)*(1+(L-l)/C),i++){const u=(L-l)/(C*.55),az=(i*137.5+R(-15,15))*D,len=(L-l)*R(.85,1.05)/Math.cos(.7)+C*.05;
      const br=bzGrow(A,l,az,R(38,52),[['F',{l:len,w1:.8,aim:[0,1,0],k:.07}],...knot(3+Math.floor(rnd()*3),C*.065)],{w:.95,seg:UPC*.4,T:[0,1,0],e:.03,wig:.04});l90Twigs(items,br,[[.75,'t0'],[0,'t1']],ZB);for(const og of br.organs)if(og.t==='K')head(og,og.p.a+u*.4)}
    /* the needle leaves, crowded and ascending all up the stem below the corymb (white-felted: a pale stroke, a darker edge) */
    for(let ll=L-C*.55;ll>l0+3;ll-=UPC*R(.55,.85)){const q=l30On(A,ll,R(0,6.283),.4),H=l30Tilt(q.T,q.r,R(.35,.7)),ln=UPC*R(1.4,2.4)*(ll>L-C*1.2?.8:1),p=q.p,e=V3.add(p,V3.sc(H,ln)),mm=V3.add(V3.add(p,V3.sc(H,ln*.5)),[0,-ln*.06,0]);
      const d=`M${f(p[0])},${f(-p[1])}Q${f(mm[0])},${f(-mm[1])} ${f(e[0])},${f(-e[1])}`;items.push({z:p[2]+H[2]*ln*.5,fn:B=>{l30Add(B,'n0',d);if(!LOD)l30Add(B,'n1',d)}})}
    l30Batch(parts,items,l30TwKeys([['t0',tw,l90W(.9)],['t1',mix(tw,'#c8d0c0',.25),l90W(.7)],['n0',shd(nc,-.2),l90W(1.25)],['n1',lt(nc,.18),l90W(.5)]]),DET>=1.5?6:3);
    const keys=[];for(let kk=0;kk<3;kk++)keys.push(['g'+kk,{fill:toneAt(pal7(mix('#a8b468',cw.c,.45)),.4+.22*kk),stroke:'#6a7040','stroke-width':.3,'stroke-opacity':.5}]);
    for(let kk=0;kk<3;kk++)keys.push(['y'+kk,{fill:toneAt(P,.4+.22*kk),stroke:P.d2,'stroke-width':.3,'stroke-opacity':.55}]);
    keys.push(['tp',{fill:shd(cw.c,-.3),opacity:.85}],['hl',{fill:'#ffffff',opacity:.55}]);
    l30Flowers(parts,hd,keys,DET>=1.5?8:4)}})}

/* ---------- registers: the safflower is a head grown on its branched stem (also sold in bud); wheat celosia is a line along the composer's spine; chamomile, ageratum and the
   everlasting are sprays grown along their spine ---------- */
Object.assign(GH,{'carthame':l90CarPlant,'celosie-a-epis':l90CelPlant,'camomille':l90CamPlant,'agerate':l90AgePlant,'immortelle-helichrysum':l90HelPlant});
Object.assign(CWS,{'carthame':CW_L90CAR,'celosie-a-epis':CW_L90CEL,'camomille':CW_L90CAM,'agerate':CW_L90AGE,'immortelle-helichrysum':CW_L90HEL});
Object.assign(SZG,{'carthame':[2,2.5,2.5,3,3.5],'celosie-a-epis':[6,8,10,10,12],'camomille':[20,25,25,30],'agerate':[6,8,10,10,12],'immortelle-helichrysum':[5,6,8,8,10]});
Object.assign(GHI,{'carthame':{form:'sphere',size:1.6,k:'head',rk:1.1},'celosie-a-epis':{form:'epi',size:1,k:'plant',self:55*UPC,tip:.85,fx:3*UPC},
  'camomille':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8},'agerate':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8},'immortelle-helichrysum':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8}});
GH_BUDS.add('carthame');
