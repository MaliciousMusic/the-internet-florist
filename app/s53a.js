/* ================= Serre, lot 53 — Protéacées 3, poussées par le L-système (moteur du lot 16) : serruria, waratah, mimetes, leucadendron à cônes, grevillea ================= */
/* ---------- shared pieces: a finely cut leaf (a rachis in 3D and its linear lobes, perhaps forked), drawn as strokes toned by its facing ---------- */
const L53_P3=p=>[p[0],-p[1],p[2]];
/* og: the organ (H, U, L); len; col (upper face), o: {bc lower face, nl lobe pairs, ll lobe length ×len, lw lobe width, rw rachis width, ang lobe angle (deg), fork, droop, arch, face, v0 (first lobe), term (terminal lobe)} */
function l53Cut(og,pos,len,col,o={}){const fa=(o.face??.3)*Math.atan2(og.L[2],og.U[2]),L=V3.add(V3.sc(og.L,Math.cos(fa)),V3.sc(og.U,-Math.sin(fa))),U=V3.add(V3.sc(og.U,Math.cos(fa)),V3.sc(og.L,Math.sin(fa))),H=og.H,
    dr=o.droop??.1,ar=o.arch??.06,rc=v=>V3.add(V3.add(pos,V3.sc(H,len*v)),V3.add(V3.sc(U,len*ar*Math.sin(Math.PI*v)),[0,-len*dr*v*v,0])),nl=o.nl||4,v0=o.v0??.22,
    rach=[],lob=[];let z=0,nz=0;
  for(let i=0;i<=8;i++){const p=rc(i/8);rach.push(L53_P3(p));z+=p[2];nz++}
  const lobe=(v,s,ll,a)=>{const b=rc(v),tg=V3.nz(V3s(rc(Math.min(1,v+.04)),rc(Math.max(0,v-.04)))),d=V3.nz(V3.add(V3.sc(tg,Math.cos(a)),V3.add(V3.sc(L,s*Math.sin(a)),V3.sc(U,ll/len*.25)))),
      m=V3.add(b,V3.sc(d,ll*.5)),e=V3.add(V3.add(b,V3.sc(d,ll)),V3.add(V3.sc(tg,ll*.18),[0,-ll*dr*.6,0]));lob.push([b,m,e].map(L53_P3));z+=e[2];nz++;
    if(o.fork){const f0=V3.add(b,V3.sc(d,ll*.55)),q=o.fork;for(const sg of[-1,1]){const d2=V3.nz(V3.add(V3.sc(d,1),V3.sc(L,sg*s*q))),e2=V3.add(f0,V3.sc(d2,ll*.42));lob.push([f0,V3.add(f0,V3.sc(d2,ll*.2)),e2].map(L53_P3))}}};
  for(let j=0;j<nl;j++){const v=v0+(1-v0)*.9*j/Math.max(1,nl-1),ll=len*(o.ll||.3)*(1-.45*v)*R(.88,1.1),a=(o.ang??42)*D*(1-.25*v);lobe(v,1,ll,a);lobe(Math.min(.98,v+.03),-1,ll*R(.9,1.05),a)}
  if(o.term)lobe(1,0,len*(o.ll||.3)*.6,0);
  const up=U[2]>=0,I=lightI(up?U:V3.sc(U,-1)),P=pal7(up?col:(o.bc||col)),tn=toneAt(P,I),lw=Math.max(1.1,o.lw||1.1),rw=Math.max(1.15,o.rw||lw*1.15);
  return{z:z/nz,cast:false,fn:par=>{const g=G(par);let d='';for(const[a,m,e]of lob)d+=`M${f(a[0])},${f(a[1])}Q${f(m[0])},${f(m[1])} ${f(e[0])},${f(e[1])}`;
    E('path',{d:smooth(rach.map(q=>[q[0],q[1]]),false)+d,stroke:tn,'stroke-width':f(lw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},g);
    E('path',{d:smooth(rach.map(q=>[q[0],q[1]]),false),stroke:tn,'stroke-width':f(rw),fill:'none','stroke-linecap':'round'},g);
    if(!LOD&&lw>2)E('path',{d,stroke:P.l1,'stroke-width':f(lw*.3),'stroke-opacity':.45,fill:'none','stroke-linecap':'round'},g)}}}
/* a bract with its fine longitudinal veins (papery bracts) */
function l53Veined(it,vc){return{z:it.z,fn:kk=>{protLig(kk,[it]);if(LOD)return;const S=it.l.S,n=S.length-1;let d='';for(const j of[1,2,3]){const q=[];for(let i=1;i<n;i++)q.push([S[i][j][0],S[i][j][1]]);if(q.length>1)d+=smooth(q,false)}
  if(d)E('path',{d,stroke:vc,'stroke-width':.35,'stroke-opacity':.28,fill:'none','stroke-linecap':'round'},kk)}}}
/* a plumed dome of florets (the heart of a serruria): the dome, then silky tufts standing off it where it faces the eye, tipped with colour; each tuft starts on the dome */
function l53Plume(k,B,O,rb,h,col,tip,o={}){const pk=o.pk||1.6,rf=t=>rb*Math.pow(Math.max(0,1-Math.pow(t,pk)),.55),pts=[];
  for(let i=0;i<=8;i++){const t=i/8,r=rf(t);for(let j=0;j<16;j++){const a=j/16*6.283,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,h*t]);pts.push([p[0],p[1]])}}
  E('path',{d:smooth(hull2(pts)),fill:budFill(col),stroke:shd(col,-.45),'stroke-width':.4,'stroke-opacity':.5},k);if(LOD)return;
  const nf=DET>=1.5?70:34,lw=Math.max(1.1,rb*.07),rr=Math.max(.65,rb*.055);let dd='',dt='';
  for(let i=0;i<nf;i++){const q=(i+.5)/nf,t=Math.min(.92,1-Math.sqrt(1-q*.95)),a=i*2.39996,r=rf(t),dr=(rf(Math.min(1,t+.02))-rf(Math.max(0,t-.02)))/.04,nn=V3.nz([Math.cos(a),Math.sin(a),-dr/h]),nV=toV(B,nn)[2];if(nV<.05)continue;
    const p0=[Math.cos(a)*r*.9,Math.sin(a)*r*.9,h*t*.95],ln=rb*(.18+.1*(1-t)),p1=V3.add(p0,V3.sc(V3.nz(V3.add(nn,[0,0,.5])),ln)),s0=PJ(B,O,p0),s1=PJ(B,O,p1);
    dd+=`M${f(s0[0])},${f(s0[1])}L${f(s1[0])},${f(s1[1])}`;dt+=`M${f(s1[0]-rr)},${f(s1[1])}a${f(rr)},${f(rr)} 0 1,0 ${f(2*rr)},0a${f(rr)},${f(rr)} 0 1,0 ${f(-2*rr)},0`}
  if(dd){E('path',{d:dd,stroke:mix(lt(col,.2),tip,.25),'stroke-width':f(lw),'stroke-opacity':.9,fill:'none','stroke-linecap':'round'},k);E('path',{d:dt,fill:tip,opacity:.8},k)}}
/* the plant of protGrow (lot 16), its main head turned along the tip of its axis (follow: how much) rather than toward where the head looks: a spike, a raceme, a cone ends its stem */
function l53Grow(k,o,P){const B=frameOf(o,P.rr??.25,false),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2],w=P.w,aK=P.aimK??.1;
  let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];U0=V3.nz(U0);
  const card=B.reach&&!NECK_X,kr=card?.96:.4,lp=Math.min(P.lp*(o.rim?.7:1),B.reach?B.reach*kr*.75:1e9),bare=o.rim?0:B.reach?(card?B.reach*.3:0):P.bare||0,
    Lmax=B.reach?B.reach*kr-bare:1e9,nN=o.rim?0:Math.max(0,Math.min(P.nodes,Math.floor((Lmax-lp)/P.li))),zz=P.zz??2.5,ph0=R(0,360),latAt=protLats(P,nN);
  const rules=Object.assign({S:()=>(bare?[['F',{l:bare,w0:w*1.34,w1:w*1.3}]]:[]).concat([['A',{n:nN}]]),
    A:p=>p.n>0?[['+',{a:R(-zz,zz)}],['F',{l:P.li*R(.86,1.14),w1:w*(1+.3*p.n/Math.max(1,nN)),aim:ax,k:aK*Math.pow(Math.max(0,1-p.n/(nN+1.5)),2)}],['N',{i:p.n}],['A',{n:p.n-1}]]
      :[['F',{l:lp*.55,w1:w*1.03,aim:ax,k:aK*2}],['F',{l:lp*.45,w1:w,aim:ax,k:aK*3.6}],['K',{main:1}]]},protRules(P,latAt,ph0));
  const res=lsTurtle(lsDerive([['S',{}]],rules,nN+(P.lat?P.lat.nodes:0)+5),{p:[0,0,0],H:up,U:U0,wig:P.wig??.012,seg:P.seg||6,T:[0,1,0],e:P.e??.008,w:w*1.3});
  for(const ch of res.chains)ch.c=P.cols;const main=res.organs.find(q=>q.t==='K'),apex=main.pos,fw=P.follow??0,Bh=fw?protFrame(V3.add(V3.sc(main.H,fw),V3.sc(ax,1-fw)),B[1]):null;
  protDraw(k,res,{P,B,Bh,ax,apex,off:V3s([0,0,0],apex),zh:Math.max(0,(Bh||B)[2][2])*P.D*(P.zhk??.3)});return lsNeck(res,[0,0,0],apex)}
/* ---------- serruria (Serruria florida 'Blushing Bride' and hybrids): small cups of papery, pearly bracts, white flushed with pink, pointed and finely veined, in two rows round a plumed heart
   of silky florets; the heads nod at the tips of slender branched stems; the leaves finely cut into needle-like segments, twice forked ---------- */
const L53_CW_SER=[{id:'blushing-bride',n:'Blanc rosé nacré (Blushing Bride)',c:'#f6ece9',fl:'#eab0bf',core:'#f2dce2',tip:'#d87890'},
  {id:'sugar-n-spice',n:'Blanc à cœur rose soutenu (Sugar ’n’ Spice)',c:'#f4dfe4',fl:'#d8708e',core:'#eec4d0',tip:'#c04a70'},
  {id:'pretty-in-pink',n:'Rose vif (Pretty in Pink)',c:'#eeaabf',fl:'#d65a84',core:'#f0c8d4',tip:'#b83a64'},
  {id:'creme',n:'Blanc crème (S. florida)',c:'#f4eedb',fl:'#e8d4b2',core:'#f2e8d8',tip:'#d0a890'}];
const L53_SERB=prof([[0,.3],[.2,.78],[.5,1],[.8,.74],[1,.3]]),L53_SERW=['#3e2a20','#5e4232','#86664c','#b4967a'];
function l53SerHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),rot=R(0,6.283),items=[],det=DET>=1.5,ns=LOD?[5,6]:det?[9,11]:[7,9],ro={pw:.5},rr=protBodyR(Dh*.1,-Dh*.12,Dh*.01,ro),
    S=[{L:.4,W:.19,a0:[.22,1.12],a1:[-.22,.78],r0:.09,z0:-.06,n:6},{L:.34,W:.16,a0:[.1,.72],a1:[-.3,.42],r0:.08,z0:-.03,n:6}];
  S.forEach((s,si)=>{const nn=ns[si],rank=1-si;for(let i=0;i<nn;i++){const phi=(i+si*.5)/nn*6.283+rot+R(-.1,.1),
      l=ligule(B,O,{phi,r0:Math.min(Dh*s.r0,rr(Dh*s.z0)*.9),z0:Dh*s.z0,L:Dh*s.L*R(.9,1.06)*(.82+.18*o2),W:Dh*s.W*R(.9,1.08),wp:L53_SERB,a0:LERP(s.a0[0],s.a0[1],o2)+R(-.05,.05),a1:LERP(s.a1[0],s.a1[1],o2)+R(-.06,.06),pw:1.3,th:.95,tip:'point',tw:R(-.2,.2),n:s.n}),
      c=mix(cw.c,cw.fl,(.38-.18*si)*(1-o2)+R(0,.06));
    items.push(l53Veined({l,z:protZ(l,B,phi,rank,Dh),c,cb:mix(c,cw.fl,.12),ov:det?.4:.3,basec:cw.fl,bf:.42+.12*si,bo:.42+.2*(1-o2),sheen:det?Math.max(.5,Dh*.012):0,sw:.5,ink:shd(cw.fl,-.3),eo:.55},shd(cw.fl,-.2)))}});
  {const bc=mix(cw.fl,'#8a6a52',.35);items.push({z:PJ(B,O,[0,0,-Dh*.05])[2],fn:kk=>protBody(kk,B,O,Dh*.1,-Dh*.12,Dh*.01,bc,ro)})}
  if(o2>.25){const h=Dh*(.12+.12*o2),rb=Dh*(.17+.05*o2),cz=nz<-.1?-1e9:PJ(B,O,[0,0,h*.4])[2];items.push({z:cz,fn:kk=>l53Plume(kk,B,O,rb,h,cw.core,cw.tip)})}
  protLig(k,items);return k}
function l53SerPlant(g,t,o){const cw=cwPick(L53_CW_SER,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||4)*UPC*(cw.sz||1),k=G(g),
    lf=(og,pos)=>l53Cut(og,pos,4.4*UPC*R(.85,1.12)*(og.p.lat?.8:1),'#74845a',{bc:'#a0aa86',nl:3,ll:.5,lw:1.05,rw:1.15,ang:26,droop:.05,arch:.04,v0:.3,term:1}),
    P={D:Dh,op,w:.3*UPC,cols:L53_SERW,nodes:14,li:.85*UPC,lp:1.8*UPC,bare:6*UPC,aimK:.09,topAng:10,leaf:{ang:40,draw:lf},
      lat:{p:.9,n:[1.4,3],top:[2,5],nodes:3,li:.9*UPC,lp:1.6*UPC,ang:38,age:[.1,1],sz:.88,e:.06},head:(par,B,O,D2,op2,inf)=>l53SerHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- waratah (Telopea speciosissima and the Shady Lady hybrids): a dome of a few hundred tubular flowers packed in spiral rows, each a curved perianth from which the style springs
   and arches toward the top; they open from the foot of the dome upward; a ruff of long pointed bracts round its base; a stout leafy stem, the leaves leathery, toothed toward the tip ---------- */
const L53_CW_TEL=[{id:'rouge',n:'Rouge écarlate (T. speciosissima)',c:'#c8142c',br:'#b8142c',body:'#7a0c1c',st:'#d8263a'},
  {id:'cramoisi',n:'Cramoisi (Shady Lady Crimson)',c:'#a40e2a',br:'#940c24',body:'#5a0816',st:'#b81a34'},
  {id:'rose',n:'Rose (Shady Lady Pink)',c:'#e2668e',br:'#d65a7e',body:'#a8385a',st:'#ec84a4'},
  {id:'blanc',n:'Blanc (Shady Lady White)',c:'#f2efdf',br:'#e6e8cc',body:'#c8c8a4',st:'#f8f6ec',g:1},
  {id:'jaune',n:'Jaune doré (Shady Lady Yellow)',c:'#f0cf62',br:'#e8d08a',body:'#b89a3a',st:'#f6dc7c'}];
const L53_TELB=prof([[0,.5],[.2,.9],[.45,1],[.75,.6],[1,.03]]),L53_TELL=prof([[0,.2],[.15,.46],[.45,.8],[.72,1],[.9,.85],[1,.5]]);
function l53TelHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.08)/.92),q=sm01((op-.2)/.72),rot=R(0,6.283),det=DET>=1.5,items=[],
    a=Dh*(.2+.11*o2),hz=Dh*(.3+.05*o2),zc=Dh*.1,thM=1.82,gc=cw.g?'#a8b878':'#7e9a52',bud=mix(cw.c,gc,.42*(1-o2)),
    sp=(th,ph)=>[a*Math.sin(th)*Math.cos(ph),a*Math.sin(th)*Math.sin(ph),zc+hz*Math.cos(th)],sn=(th,ph)=>V3.nz([Math.sin(th)*Math.cos(ph)/a,Math.sin(th)*Math.sin(ph)/a,Math.cos(th)/hz]);
  /* the ruff of bracts round the foot of the dome */
  const nb=LOD?7:det?14:11;for(let i=0;i<nb;i++){const phi=i/nb*6.283+rot+R(-.1,.1),z0=zc-hz*.32,
      l=ligule(B,O,{phi,r0:a*.8,z0,L:Dh*.38*R(.72,1.12)*(.7+.3*o2),W:Dh*.09*R(.88,1.1),wp:L53_TELB,a0:LERP(.55,1.38,o2)+R(-.08,.08),a1:LERP(.25,1.95,o2)+R(-.15,.15),pw:1.4,th:.55,tip:'point',tw:R(-.3,.3),n:6}),
      c=mix(cw.br,gc,.35*(1-o2));
    items.push({l,z:protZ(l,B,phi,1,Dh),c,cb:shd(c,-.1),ov:det?.35:0,sw:.45})}
  /* the florets: open ones (perianth and style), closed ones (a hooked bud pressed to the dome) */
  const N=Math.round((det?150:96)*(LOD?.5:1)),grp=[[],[],[]],stubs=[[],[],[]];
  for(let i=0;i<N;i++){const t=(i+.5)/N,th=Math.acos(1-t*(1-Math.cos(thM))),ph=i*2.39996+rot,p0=sp(th,ph),n=sn(th,ph),nv=toV(B,n)[2],gi=nv<-.2?0:nv<.35?1:2;
    if(th/thM>1-q*1.05){const Lf=Dh*(.11+.04*Math.sin(th))*R(.92,1.08),kc=.4+.25*th/thM,e=V3.nz(V3.add(V3.sc(n,1-kc),[0,0,kc*1.2])),p1=V3.add(p0,V3.sc(n,Lf*.5)),p2=V3.add(p1,V3.sc(e,Lf*.5)),
        inw=V3.nz(V3.add([-p0[0]/a*.5,-p0[1]/a*.5,1],V3.sc(e,.3))),p3=V3.add(p2,V3.sc(V3.nz(V3.add(e,V3.sc(inw,.6))),Lf*.42)),p4=V3.add(p3,V3.sc(inw,Lf*.28));
      grp[gi].push([p0,p1,p2,p3,p4])}
    else{const tp=V3.nz(V3.add(V3.sc(n,.55),[0,0,1])),p1=V3.add(p0,V3.sc(tp,Dh*.05)),p2=V3.add(p1,V3.sc(V3.nz(V3.add(tp,[-p0[0]/a*.6,-p0[1]/a*.6,0])),Dh*.025));stubs[gi].push([p0,p1,p2])}}
  const pC=pal7(cw.c),pS=pal7(cw.st),pB=pal7(bud),wt=Math.max(1.3,Dh*.03),ws=Math.max(1.1,Dh*.012),kr=Math.max(.7,Dh*.011);
  const draw=(kk,gi,I)=>{let d='',ds='',dk='',dh='',db='';
    for(const[p0,p1,p2,p3,p4]of grp[gi]){const s=[p0,p1,p2,p3,p4].map(p=>PJ(B,O,p));d+=`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`;
      ds+=`M${f(s[2][0])},${f(s[2][1])}Q${f(s[3][0])},${f(s[3][1])} ${f(s[4][0])},${f(s[4][1])}`;dk+=`M${f(s[4][0]-kr)},${f(s[4][1])}a${f(kr)},${f(kr)} 0 1,0 ${f(2*kr)},0a${f(kr)},${f(kr)} 0 1,0 ${f(-2*kr)},0`;
      if(I>.6&&!LOD)dh+=`M${f(s[0][0]-.3)},${f(s[0][1]-.4)}Q${f(s[1][0]-.3)},${f(s[1][1]-.4)} ${f(s[2][0]-.3)},${f(s[2][1]-.4)}`}
    for(const[p0,p1,p2]of stubs[gi]){const s=[p0,p1,p2].map(p=>PJ(B,O,p));db+=`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`}
    if(db){E('path',{d:db,stroke:toneAt(pB,I),'stroke-width':f(wt*1.15),fill:'none','stroke-linecap':'round'},kk);if(!LOD&&I>.5)E('path',{d:db,stroke:pB.l1,'stroke-width':f(wt*.35),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},kk)}
    if(d){E('path',{d,stroke:toneAt(pC,I),'stroke-width':f(wt),fill:'none','stroke-linecap':'round'},kk);E('path',{d:ds,stroke:toneAt(pS,I+.05),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},kk);
      E('path',{d:dk,fill:toneAt(pS,I-.12)},kk);if(dh)E('path',{d:dh,stroke:pC.l1,'stroke-width':f(wt*.3),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},kk)}};
  /* the dome itself (the receptacle under the florets) and its florets, as one piece in the painter's order of the bracts */
  const hp=[];for(let i=0;i<=10;i++)for(let j=0;j<14;j++){const th=i/10*thM,p=PJ(B,O,sp(th,j/14*6.283));hp.push([p[0],p[1]])}
  const bodyC=mix(cw.body,gc,.4*(1-o2));
  items.push({z:PJ(B,O,[0,0,zc])[2],fn:kk=>{draw(kk,0,.36);protBody(kk,B,O,a*.82,zc-hz*.62,zc-hz*.05,shd(bodyC,-.1),{pw:.5});E('path',{d:smooth(hull2(hp)),fill:budFill(bodyC),stroke:shd(bodyC,-.5),'stroke-width':.4,'stroke-opacity':.5},kk);draw(kk,1,.55);draw(kk,2,.72)}});
  protLig(k,items);return k}
function l53TelPlant(g,t,o){const cw=cwPick(L53_CW_TEL,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||10)*UPC*(cw.sz||1),k=G(g),
    lf=(og,pos)=>protLeaf(og,pos,15*UPC*R(.86,1.08)*(og.p.i<=1?.75:1),.26,'#38552e',{wp:L53_TELL,teeth:3,bulge:.06,droop:.06,arch:.06,fold:.12,face:.35,tc:'#2c4424',ec:'#24381c',eo:.5,bc:'#7a8c62',mw:.009}),
    P={D:Dh,op,w:.9*UPC,cols:['#2c3a1e','#46562c','#687a44','#9aa874'],nodes:9,li:2.4*UPC,lp:2.2*UPC,bare:6*UPC,aimK:.12,topAng:24,leaf:{ang:36,draw:lf},zhk:.9,piece:9,
      head:(par,B,O,D2,op2,inf)=>l53TelHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):protGrow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- mimetes (Mimetes cucullatus and kin): the top of a leafy stem whose upper leaves turn red and yellow and arch over, like hoods, the small flower heads in their axils;
   from under each hood a tuft of long styles juts out, each with its pollen presenter; the youngest leaves still closed in a bud at the top; oblong leaves pressed up the stem, three-toothed at the tip ---------- */
const L53_CW_MIM=[{id:'cucullatus',n:'Rouge et jaune (M. cucullatus)',c:'#d42a26',base:'#f2c63e',g:'#5e7a3e',st:'#ec5a5a',pp:'#f4d860'},
  {id:'orange',n:'Orange flamme',c:'#ec7426',base:'#f6d050',g:'#62783c',st:'#f08a4a',pp:'#f6dc6a'},
  {id:'hirtus',n:'Jaune à pointes rouges (M. hirtus)',c:'#ecbc34',base:'#f6dc6a',tipc:'#cc3a26',g:'#647a3a',st:'#e85a3a',pp:'#f2e090'},
  {id:'saumon',n:'Saumon (forme claire)',c:'#ee8a6a',base:'#f6d080',g:'#62783e',st:'#f4a08a',pp:'#f6e0a0'},
  {id:'argenteus',n:'Argenté rosé (M. argenteus)',c:'#cfcfc6',base:'#e8dcd8',g:'#8a9680',st:'#d887a8',pp:'#e8c0d4',sv:1}];
const L53_MIMH=prof([[0,.4],[.2,.85],[.5,1],[.8,.85],[1,.4]]),L53_MIML=prof([[0,.3],[.15,.7],[.45,.96],[.75,1],[.92,.85],[1,.55]]);
function l53MimHead(par,B,O,Dh,op,cw,info={}){const k=G(par),o2=sm01((op-.1)/.9),q=sm01((op-.25)/.7),rot=R(0,6.283),det=DET>=1.5,items=[],n=LOD?8:det?16:12,cr=Dh*.07,zb=-Dh*.04,zt=Dh*.86,
    ws=Math.max(1.1,Dh*.009),kr=Math.max(.7,Dh*.009);
  /* the axis inside the spike */
  {const bc=mix(cw.g,'#4a3a26',.3);items.push({z:PJ(B,O,[0,0,(zb+zt)/2])[2],fn:kk=>protBody(kk,B,O,cr,zb-Dh*.05,zt+Dh*.04,bc,{pw:.35})})}
  for(let i=0;i<n;i++){const fr=i/(n-1),phi=i*2.39996+rot,z0=zb+fr*(zt-zb),top=sm01((fr-.72)/.28),
      a0=LERP(.25,.95-.35*fr,o2)*(1-.75*top)+R(-.05,.05),a1=LERP(-.12,.12,o2)-.25*top+R(-.05,.05),
      l=ligule(B,O,{phi,r0:cr*.8,z0,L:Dh*(.46-.2*fr)*R(.92,1.06),W:Dh*(.2-.06*fr),wp:L53_MIMH,a0,a1,pw:1.1,th:1.25,tip:'round',tw:R(-.2,.2),n:6}),
      c=mix(cw.g,cw.c,sm01(fr*2.6+.15)*(.85+.15*o2));
    items.push({l,z:protZ(l,B,phi,1.2,Dh),c,cb:mix(c,cw.base,.25),ov:det?.38:0,basec:cw.base,bf:.3,bo:.65*(.4+.6*o2),tipc:cw.tipc||null,tf:.72,to:.75,
      sheen:cw.sv?Math.max(.6,Dh*.012):0,hair:cw.sv?'#f4f2f0':null,hw:Math.max(.35,Dh*.006),ho:.6,hf:.3,sw:.45});
    /* the tuft of styles under the hood (the lower hoods open first) */
    if(fr>.12&&fr<.78&&fr<q*.9+.1){const ns=det?4:3,Ls=Dh*(.24-.06*fr),dd=[],kk=[];
      for(let j=0;j<ns;j++){const ps=phi+(j/(ns-1)-.5)*.55+R(-.08,.08),r=[Math.cos(ps),Math.sin(ps),0],p0=[r[0]*cr*.6,r[1]*cr*.6,z0+Dh*.02],p1=V3.add(p0,V3.add(V3.sc(r,Ls*.62),[0,0,-Ls*.06])),p2=V3.add(p1,V3.add(V3.sc(r,Ls*.22),[0,0,Ls*.42]));dd.push([p0,p1,p2])}
      items.push({z:protZ(l,B,phi,1.2,Dh)-Dh*.012,fn:kk2=>{let d='',dk='';for(const[p0,p1,p2]of dd){const s=[p0,p1,p2].map(p=>PJ(B,O,p));d+=`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`;
          dk+=`M${f(s[2][0]-kr)},${f(s[2][1])}a${f(kr)},${f(kr)} 0 1,0 ${f(2*kr)},0a${f(kr)},${f(kr)} 0 1,0 ${f(-2*kr)},0`}
        const I=lightI(V3.nz(toV(B,[Math.cos(phi),Math.sin(phi),.3])));E('path',{d,stroke:toneAt(pal7(cw.st),I),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},kk2);E('path',{d:dk,fill:toneAt(pal7(cw.pp),I)},kk2)}})}}
  protLig(k,items);return k}
function l53MimPlant(g,t,o){const cw=cwPick(L53_CW_MIM,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||9)*UPC*(cw.sz||1),k=G(g),lc=cw.sv?'#a8b0a0':'#5e7a44',
    lf=(og,pos)=>{const i=og.p.i,tt=sm01(1-(i-1)/5),c=mix(lc,mix(cw.c,lc,.4),tt*.8);
      return protLeaf(og,pos,5*UPC*R(.88,1.1)*(1-.15*tt),.36,c,{wp:L53_MIML,teeth:i>2?3:0,round:i<=2,bulge:.08,droop:.03,arch:.05,fold:.14,face:.3,tc:'#8a3a26',ec:cw.sv?'#e8ece4':'#3a4a2a',eo:cw.sv?.6:.4,bc:cw.sv?'#d4d8cc':'#9aa884',flush:tt>.1?cw.c:null,ff:.7-.4*tt,fo:.7,lift:cw.sv?.08:0})},
    P={D:Dh,op,w:.6*UPC,cols:PROT_GREY,nodes:18,li:.95*UPC,lp:.4*UPC,bare:6*UPC,topAng:-8,leaf:{ang:24,draw:lf},zhk:.2,follow:.85,aimK:.05,
      head:(par,B,O,D2,op2,inf)=>l53MimHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):l53Grow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- leucadendron (the cone forms, not the coloured cups of leucadendron-rouges and -jaunes-verts): Leucadendron platyspermum and argenteum, whose ornament is the cone itself —
   a big egg of woody spiral scales, green then bronze, silky silver in the silver tree — set in a loose rosette of the top leaves; also sold dried, natural or bleached ---------- */
const L53_CW_LCD=[{id:'platyspermum',n:'Cône vert doré (L. platyspermum frais)',c:'#a2a444',lf:'#b0b25a',g:'#6a7e3e',sc:'#6a6a22'},
  {id:'platyspermum-bronze',n:'Cône bronze (L. platyspermum mûr)',c:'#8a5632',lf:'#8c9a52',g:'#5e7038',sc:'#4a2a18'},
  {id:'argenteum',n:'Argenté (L. argenteum, arbre d’argent)',c:'#c6cabe',lf:'#c2cac0',g:'#9aa694',sc:'#7a8070',sv:1},
  {id:'seche',n:'Séché naturel',c:'#6e4428',lf:'#8a7450',g:'#6a5a3a',sc:'#3a2212',dry:1},
  {id:'blanchi',n:'Séché blanchi',c:'#e6dcbe',lf:'#e0d6b8',g:'#cfc4a2',sc:'#a89a76',dry:1}];
const L53_LCDL=prof([[0,.3],[.15,.7],[.45,1],[.75,.85],[.92,.55],[1,.26]]);
function l53LcdHead(par,B,O,Dh,op,cw,info={}){const k=G(par),nz=B[2][2],o2=sm01((op-.1)/.9),rot=R(0,6.283),items=[],det=DET>=1.5,n=LOD?8:det?14:11,cr=Dh*(.22+.1*o2),ch=Dh*(.62+.38*o2),
    cc=mix(cw.c,cw.g,.4*(1-o2)),rb=protBodyR(Dh*.16,-Dh*.3,0,{taper:.5});
  /* the rosette of the top leaves round the foot of the cone */
  for(let i=0;i<n;i++){const fr=i/(n-1),out=1-fr,phi=i*2.39996+rot,z0=-Dh*(.04+.24*out),
      l=ligule(B,O,{phi,r0:rb(z0)*.85,z0,L:Dh*(.62+.25*out)*R(.92,1.06),W:Dh*(.17+.03*out),wp:L53_LCDL,a0:LERP(.12+.05*out,.42+.3*out,o2)+R(-.04,.04),a1:LERP(-.12,cw.dry?.95+.3*out:.6+.35*out,o2)+R(-.06,.06),pw:1.3,th:cw.dry?1.1:.7,tip:'point',tw:R(-.3,.3)*(cw.dry?2:1),n:6}),
      c=mix(cw.lf,cw.g,.45*out+(cw.sv?0:.15*(1-o2)));
    items.push({l,z:protZ(l,B,phi,out*2,Dh),c,cb:cw.sv?lt(c,.12):mix(c,shd(c,.12),.6),ov:det?.4:0,hair:cw.sv?'#f6f6f2':null,hw:Math.max(.4,Dh*.008),ho:.75,hf:.05,sheen:cw.sv?Math.max(.6,Dh*.014):0,sw:.45})}
  {const bc=shd(mix(cw.lf,cw.g,.5),-.2);items.push({z:PJ(B,O,[0,0,-Dh*.15])[2],fn:kk=>protBody(kk,B,O,Dh*.16,-Dh*.3,0,bc,{taper:.5})})}
  /* the cone: its scales, their pale ridges where it faces the eye */
  items.push({z:nz<-.2?-1e9:PJ(B,O,[0,0,ch*.4])[2]+Dh*.02,fn:kk=>{protCone(kk,B,O,cr,ch,cc,{silver:cw.sv});if(LOD)return;let d='';const nn=det?44:26,rr=Math.max(.6,cr*.07),z0=-ch*.12;
    for(let i=0;i<nn;i++){const qq=(i+.5)/nn,u=(.14+.76*qq)*Math.PI,a=i*2.39996,ro=cr*Math.sin(u)*(1-.12*Math.cos(u))*.96,z=z0+(ch-z0)*(1-Math.cos(u))/2,nV=toV(B,[Math.cos(a)*Math.sin(u),Math.sin(a)*Math.sin(u),-Math.cos(u)*.6])[2];
      if(nV<.2)continue;const p=PJ(B,O,[Math.cos(a)*ro,Math.sin(a)*ro,z]);d+=`M${f(p[0]-rr*1.4)},${f(p[1])}l${f(rr*1.4)},${f(-rr)}l${f(rr*1.4)},${f(rr)}l${f(-rr*1.4)},${f(rr)}z`}
    if(d)E('path',{d,fill:lt(cc,.35),stroke:cw.sc,'stroke-width':.35,'stroke-opacity':.45,opacity:.75},kk)}});
  protLig(k,items);return k}
function l53LcdPlant(g,t,o){const cw=cwPick(L53_CW_LCD,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||5)*UPC*(cw.sz||1),k=G(g),
    lf=(og,pos)=>{const i=og.p.i,tt=sm01(1-(i-1)/6),c=mix(cw.g,cw.lf,tt*.8),len=(cw.sv?8:4.6)*UPC*R(.86,1.08)*(1-.12*tt)*(og.p.lat?.8:1);
      return protLeaf(og,pos,len,cw.sv?.2:.3,c,{wp:L53_LCDL,droop:cw.dry?.08:.03,arch:.06,fold:cw.dry?.3:.14,face:.3,tw:cw.dry?R(-.8,.8):R(-.3,.3),ec:cw.sv?'#eef0ea':shd(c,-.35),eo:cw.sv?.7:.4,bc:cw.sv?'#dde0d8':mix(c,'#c4c8a8',.3),lift:cw.sv?.1:0})},
    P={D:Dh,op,w:.55*UPC,cols:cw.dry?PROT_WOOD:PROT_GREY,nodes:20,li:1.05*UPC,lp:.4*UPC,bare:6*UPC,aimK:.06,follow:.7,leaf:{ang:(i)=>30-12*sm01(1-(i-1)/5),draw:lf},
      lat:{p:cw.sv?.15:.45,n:[1,2],top:[3,7],nodes:4,li:1*UPC,lp:.6*UPC,ang:32,age:[.4,1],sz:.8,e:.05},head:(par,B,O,D2,op2,inf)=>l53LcdHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):l53Grow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- grevillea (G. 'Robyn Gordon', 'Superb', 'Moonlight'…): a raceme of flowers along a curved rachis, open from its base to its tip; each a curved perianth tube split open,
   from which a long wiry style loops out, its stigma knob turned toward the tip — a toothbrush on one side (the Robyn Gordon group), a cylinder all round (Moonlight);
   the buds still hooked, their style looped inside; the leaves deeply cut into linear lobes, silvery beneath ---------- */
const L53_CW_GRE=[{id:'robyn-gordon',n:'Rouge rosé (Robyn Gordon)',c:'#d42e48',tb:'#e05868',kn:'#d8d070',rc:'#8a3a3a'},
  {id:'superb',n:'Saumon et jaune (Superb)',c:'#f08a5a',tb:'#f2c454',kn:'#c8b84a',rc:'#a86a3a'},
  {id:'honey-gem',n:'Orange miel (Honey Gem)',c:'#ee9a2a',tb:'#f4b440',kn:'#a8902a',rc:'#8a6a2a',cyl:1},
  {id:'moonlight',n:'Ivoire (Moonlight)',c:'#f2ecd4',tb:'#f4eedc',kn:'#d8cc8a',rc:'#8a8a6a',cyl:1},
  {id:'coconut-ice',n:'Rose et crème (Coconut Ice)',c:'#e8849c',tb:'#f2d8c6',kn:'#d8c870',rc:'#8a4a4a'},
  {id:'ned-kelly',n:'Orange rouge (Ned Kelly)',c:'#e65a2c',tb:'#f09440',kn:'#c8b050',rc:'#8a4a2a'}];
function l53GreHead(par,B,O,Dh,op,cw,info={}){const k=G(par),o2=sm01((op-.08)/.92),q=sm01((op-.2)/.75),rot=R(-.3,.3),det=DET>=1.5,Lr=Dh*(.62+.38*o2),bend=R(.1,.2),
    rc=s=>[0,bend*s*s*Lr,s*Lr],rw=Dh*.025,N=Math.round((det?60:40)*(LOD?.5:1)),grp=[[],[],[]],bud=[[],[],[]];
  for(let i=0;i<N;i++){const s=.04+.94*(i+.5)/N,phi=cw.cyl?i*2.39996+rot:Math.PI/2+rot+(((i*.618034)%1)-.5)*2.6,r=[Math.cos(phi),Math.sin(phi),0],c=rc(s),p0=V3.add(c,V3.sc(r,rw)),
      nv=toV(B,r)[2],gi=nv<-.25?0:nv<.3?1:2,z=[0,0,1];
    if(s<LERP(-.1,1.08,q)){const Lt=Dh*.08,dT=V3.nz(V3.add(r,V3.sc(z,.35))),p1=V3.add(p0,V3.sc(dT,Lt*.6)),p2=V3.add(p1,V3.add(V3.sc(r,Lt*.3),V3.sc(z,-Lt*.25))),
        Ls=Dh*(.26+.06*(1-s))*R(.92,1.08),p3=V3.add(p1,V3.add(V3.sc(r,Ls*.62),V3.sc(z,Ls*.28))),p4=V3.add(p1,V3.add(V3.sc(r,Ls*.42),V3.sc(z,Ls*.78)));
      grp[gi].push([p0,p1,p2,p3,p4])}
    else{const Lb=Dh*(.07+.05*(1-s)),p1=V3.add(p0,V3.sc(r,Lb*.7)),p2=V3.add(V3.add(p0,V3.sc(r,Lb*.55)),V3.sc(z,Lb*.6));bud[gi].push([p0,p1,p2])}}
  const pS=pal7(cw.c),pT=pal7(cw.tb),wt=Math.max(1.3,Dh*.026),ws=Math.max(1.1,Dh*.011),kr=Math.max(.75,Dh*.012),wb=Math.max(1.4,Dh*.034);
  const draw=(gi,I)=>{let dt='',ds='',dk='',db='';
    for(const[p0,p1,p2,p3,p4]of grp[gi]){const s=[p0,p1,p2,p3,p4].map(p=>PJ(B,O,p));dt+=`M${f(s[0][0])},${f(s[0][1])}L${f(s[1][0])},${f(s[1][1])}L${f(s[2][0])},${f(s[2][1])}`;
      ds+=`M${f(s[1][0])},${f(s[1][1])}Q${f(s[3][0])},${f(s[3][1])} ${f(s[4][0])},${f(s[4][1])}`;dk+=`M${f(s[4][0]-kr)},${f(s[4][1])}a${f(kr)},${f(kr)} 0 1,0 ${f(2*kr)},0a${f(kr)},${f(kr)} 0 1,0 ${f(-2*kr)},0`}
    for(const[p0,p1,p2]of bud[gi]){const s=[p0,p1,p2].map(p=>PJ(B,O,p));db+=`M${f(s[0][0])},${f(s[0][1])}Q${f(s[1][0])},${f(s[1][1])} ${f(s[2][0])},${f(s[2][1])}`}
    if(db){const bc=mix(cw.tb,cw.c,.35);E('path',{d:db,stroke:toneAt(pal7(bc),I),'stroke-width':f(wb),fill:'none','stroke-linecap':'round'},k);if(!LOD&&I>.5)E('path',{d:db,stroke:lt(bc,.4),'stroke-width':f(wb*.3),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},k)}
    if(ds){E('path',{d:ds,stroke:toneAt(pS,I),'stroke-width':f(ws),fill:'none','stroke-linecap':'round'},k);E('path',{d:dt,stroke:toneAt(pT,I),'stroke-width':f(wt),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},k);E('path',{d:dk,fill:toneAt(pal7(cw.kn),I)},k)}};
  draw(0,.38);
  /* the rachis */
  {const P=[];for(let i=0;i<=8;i++){const p=PJ(B,O,rc(i/8*.99));P.push([p[0],p[1]])}E('path',{d:smooth(P,false),stroke:cw.rc,'stroke-width':f(Math.max(1.3,rw*1.6)),fill:'none','stroke-linecap':'round'},k)}
  draw(1,.55);draw(2,.72);return k}
function l53GrePlant(g,t,o){const cw=cwPick(L53_CW_GRE,o),op=Math.max(.05,Math.min(1,o.op??R(.86,1))),Dh=(o.cm||12)*UPC*(cw.sz||1),k=G(g),
    lf=(og,pos)=>l53Cut(og,pos,10*UPC*R(.85,1.12)*(og.p.lat?.75:1),'#58703e',{bc:'#c0c4ac',nl:4,ll:.42,lw:.42*UPC,rw:.32*UPC,ang:48,droop:.09,arch:.06,v0:.18,term:1}),
    P={D:Dh,op,w:.42*UPC,cols:['#3a3424','#5a5236','#827a52','#b0a87c'],nodes:7,li:2.6*UPC,lp:1.2*UPC,bare:6*UPC,aimK:.1,topAng:12,leaf:{ang:44,draw:lf},zhk:.2,follow:.6,
      lat:{p:.5,n:[1,2],top:[1,3],nodes:2,li:1.4*UPC,lp:1.4*UPC,ang:40,age:[.05,.8],sz:.8,e:.05},head:(par,B,O,D2,op2,inf)=>l53GreHead(par,B,O,D2,op2,cw,inf)};
  const r=o.spine?protAlong(k,o,P):l53Grow(k,o,P);open(k,t,1000,8,.3);return r}
/* ---------- the registers ---------- */
Object.assign(GH,{'serruria':l53SerPlant,'telopea':l53TelPlant,'mimetes':l53MimPlant,'leucadendron':l53LcdPlant,'grevillea':l53GrePlant});
Object.assign(CWS,{'serruria':L53_CW_SER,'telopea':L53_CW_TEL,'mimetes':L53_CW_MIM,'leucadendron':L53_CW_LCD,'grevillea':L53_CW_GRE});
Object.assign(SZG,{'serruria':[3,4,4,5,6],'telopea':[8,9,10,11,12],'mimetes':[7,8,9,10,11],'leucadendron':[3,4,5,5,6],'grevillea':[8,10,12,14,15]});
Object.assign(GHI,{'serruria':{form:'etoile',size:1.6,k:'head',rk:.9},'telopea':{form:'sphere',size:3,k:'head',rk:1},'mimetes':{form:'cornet',size:2.5,k:'head',rk:.9},
  'leucadendron':{form:'cornet',size:2,k:'head',rk:.9},'grevillea':{form:'grappe',size:2.2,k:'head',rk:.8}});
for(const id of['serruria','telopea','mimetes','leucadendron','grevillea'])GH_BUDS.add(id);
