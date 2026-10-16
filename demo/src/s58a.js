/* ================= Serre, lot 58 — fougères : fougère cuir (Rumohra adiantiformis), fougère de Boston (Nephrolepis exaltata), nid d'oiseau (Asplenium nidus), fougère bleue (Phlebodium aureum 'Blue Star'), fougère épée (Polystichum munitum) ================= */
/* chaque fronde est poussée par le L-système : le stipe puis le rachis suivent leur axe (épine du Composer, arc d'une planche), ses nœuds portent les pennes alternées, une penne pousse ses pinnules, une pinnule ses segments ;
   la jeune fronde se déroule en crosse (préfoliaison circinée : le rachis enroulé vers sa face supérieure, les pennes repliées dedans). Chaque penne, pinnule ou segment est une petite nappe 3D (pliée sur sa nervure, en cuvette,
   tordue, retombante) dont les deux moitiés prennent chacune leur lumière ; elles sont groupées par profondeur et par ton, si bien qu'une fronde tient en quelques chemins. Contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
const l58Op=o=>Math.max(.05,Math.min(1,o.op??1));
/* an axis given by a polyline in view space (its frame Fr along it): same interface as spAxis (at, L, sOf, s0, l0, up) */
function l58Ax(P,F,up){const N=P.length-1,cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const L=cum[N];
  const ix=s=>{const l=Math.max(0,Math.min(1,s))*L;let i=1;while(i<N&&cum[i]<l)i++;return[i,Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)))]};
  const at=s=>{const[i,t]=ix(s),p=V3.add(P[i-1],V3.sc(V3s(P[i],P[i-1]),t)),T=V3.nz(V3s(P[Math.min(N,i+1)],P[Math.max(0,i-2)]));let Fr=V3.add(V3.sc(F[i-1],1-t),V3.sc(F[i],t));
    Fr=V3s(Fr,V3.sc(T,V3.dot(Fr,T)));Fr=V3l(Fr)>1e-6?V3.nz(Fr):[0,0,1];return{p,T,Fr,Sd:V3.cr(T,Fr)}};
  return{at,L,sOf:l=>Math.max(0,Math.min(1,l/L)),s0:0,l0:0,up,cb:s=>at(s).p}}
/* the frond's axis: as fgAxis (the composer's spine, a card's bunch), on a sheet arched to one side and bowed back away from its upper face (a frond arches face up), so it reads in depth from the side */
function l58Axis(o,Lt,arch,bow){if(o.spine||(o.up&&Math.hypot(o.up[0],o.up[1])>6))return fgAxis(o,Lt,arch);const B=frameOf(o,0),a=arch*Lt,b=bow*Lt,
    C=[[0,0,0],[a*.06,Lt*.36,-b*.08],[a*.45,Lt*.7,-b*.45],[a,Lt*(1-.1*Math.abs(arch)-.12*bow),-b]].map(p=>toV(B,p)),A=spAxis(o,Lt,{C,Fr:toV(B,[0,0,1])});A.up=V3.nz(toV(B,[0,1,0]));A.s0=0;A.l0=0;return A}
/* the young frond unrolling (circinate vernation): beyond the share 1−cl of its length the rachis coils toward its upper face (Fr), tighter and tighter — a logarithmic spiral of th turns; cs: where the coil starts */
function l58Curl(A0,cl,th){const N=60,Lo=A0.L*(1-cl),Lc=A0.L*cl,P=[],F=[];for(let i=0;i<=N;i++){const q=A0.at(A0.sOf(Lo*i/N));P.push(q.p);F.push(q.Fr)}
  const e=A0.at(A0.sOf(Lo)),Phi=th*6.283,kk=.3,r0=Lc*kk/(1-Math.exp(-kk*Phi)),M=Math.max(16,Math.round(th*40));let p=e.p;
  for(let j=1;j<=M;j++){const a=Phi*(j-.5)/M,ds=r0*Math.exp(-kk*a)*Phi/M,b=Phi*j/M;p=V3.add(p,V3.sc(V3.add(V3.sc(e.T,Math.cos(a)),V3.sc(e.Fr,Math.sin(a))),ds));P.push(p);
    F.push(V3.add(V3.sc(e.Fr,Math.cos(b)),V3.sc(e.T,-Math.sin(b))))}
  const A=l58Ax(P,F,A0.up);A.cs=Lo/A.L;return A}
/* ---------- a pinna's outline (x across toward the tip of its parent axis, y along its midrib, in its lengths): half-widths wr/2·wp(y), teeth (nt of them from t0, depth td: 'saw' pointing to the apex,
   else rounded crenations or lobes), an auricle on the tip side (au), falcate (fa: the midrib bent toward the parent's tip). Returns the midrib and the two margins, from the base to the tip ---------- */
function l58Ol(S,lo){const n=lo&&S.td<.2&&!S.saw?0:lo&&S.saw?Math.ceil((S.nt||0)*.6):S.nt||0,t0=S.t0??.12,fa=S.fa||0,xm=y=>fa*y*y,wr=S.wr,mid=[],nm=lo?(fa?4:2):8;for(let i=0;i<=nm;i++){const y=i/nm;mid.push([xm(y),y])}
  const ys=lo?[[0,1],[.06,1]]:[[0,1],[.03,1],[.07,1]];for(let y=.1;y<t0-.01;y+=lo?.08:.05)ys.push([y,1]);
  if(n){const dy=(1-t0)/n,ph=S.saw?[0,.55,.9]:lo?[0,.33,.66]:[0,.25,.5,.75];for(let j=0;j<n;j++)for(const p of ph)ys.push([t0+dy*(j+p),S.saw?1-S.td*(1-p):1-S.td*(1-Math.sin(Math.PI*p))])}
  else for(let y=Math.max(t0,.12);y<.99;y+=lo?.1:.06)ys.push([y,1]);
  const side=sg=>ys.filter(([y])=>y<1).map(([y,r])=>{let w=wr*.5*S.wp(y)*r*(S.jag?1+R(-S.jag,S.jag):1);if(sg>0&&S.au)w+=S.au*Math.exp(-(((y-.075)/.055)**2));return[xm(y)+sg*w,y]}).concat([[xm(1),1]]);
  return{mid,A:side(1),B:side(-1),fa}}
/* the surface of a pinna at og: its midrib along H, x across along og.L turned by tw round H toward og.U, mirrored by sg (so x>0 faces the parent's tip), folded on the midrib (V), cupped, arched, waved, drooping */
function l58Surf(og,len,sg,o){const H=V3.nz(og.H),tw=o.tw||0,W=V3.add(V3.sc(og.L,Math.cos(tw)),V3.sc(og.U,Math.sin(tw))),N=V3.cr(H,W),B=og.pos,fo=o.fold||0,cu=o.cup||0,ar=o.arch||0,dr=o.droop||0,wv=o.wave||0,wk=o.wk||4,wp=o.wph||0;
  return(x,y)=>{const xs=x*sg,ax=Math.abs(x),h=fo*ax+cu*x*x+ar*Math.sin(Math.PI*y)+(wv?wv*Math.sin(wk*Math.PI*y+wp+(x<0?1.9:0))*Math.min(1,ax*10):0);
    return[B[0]+(H[0]*y+W[0]*xs+N[0]*h)*len,B[1]+(H[1]*y+W[1]*xs+N[1]*h)*len-dr*len*y*y,B[2]+(H[2]*y+W[2]*xs+N[2]*h)*len]}}
/* a quantised light tone of the face that shows (lit up-left), the gloss of a leathery blade where it catches the light (half vector) */
const l58Tone=(P,PB,n,lv,gl)=>{const fr=n[2]>=0,m=fr?n:V3.sc(n,-1),I=lightI(m),q=Math.round(Math.max(0,Math.min(1,(I-.3)/.62))*(lv-1))/(lv-1);let col=toneAt(fr?P:PB,.3+.62*q);
  if(gl&&fr&&V3.dot(m,HV3)>.93)col=mix(col,'#ffffff',.2*gl);return{fr,col}};
/* one pinna (or pinnule, segment, lobe) as its two halves, each lit by its own normal; sori dots on the back where it shows; pushed into polys (null when it would hang below the lip) */
function l58Pin(og,len,ol,sg,o,X){const M=l58Surf(og,len,sg,o),out=[];
  for(const[side,sx]of[[ol.A,1],[ol.B,-1]]){const pts=ol.mid.map(([x,y])=>M(x,y)).concat(side.slice().reverse().map(([x,y])=>M(x,y)));if(X.lim!=null&&pts.some(p=>p[1]<X.lim))return null;
    const cx=sx*X.wr*.22,e=.02;let n=V3.cr(V3s(M(cx,.55),M(cx,.35)),V3s(M(cx+e,.45),M(cx-e,.45)));n=V3l(n)>1e-9?V3.sc(V3.nz(n),sg):[0,0,1];
    const tn=l58Tone(X.P,X.PB,n,X.lv,X.gl),z=pts.reduce((a,p)=>a+p[2],0)/pts.length;out.push({pts:pts.map(fgQ),z,col:tn.col});
    if(X.sori&&!tn.fr)for(const[x0,y]of X.sori){if(x0*sx<0)continue;const x=x0+(ol.fa||0)*y*y,c=M(x,y),r=X.sr*len,[a,b]=[V3.nz(V3s(M(x+.05,y),M(x-.05,y))),V3.nz(V3s(M(x,y+.05),M(x,y-.05)))],q=[];
      for(let i=0;i<6;i++){const t=i*1.047;q.push(fgQ(V3.add(c,V3.add(V3.sc(a,Math.cos(t)*r),V3.sc(b,Math.sin(t)*r)))))}out.push({pts:q,z:z+.001,col:X.sc,ov:1})}}
  return out}
/* batches of flat polygons drawn far to near in nb depth bands, each band one path per colour, the sori of the band over them */
function l58Batch(polys,nb,parts,o={}){if(!polys.length)return;polys.sort((a,b)=>a.z-b.z);const per=Math.ceil(polys.length/nb);
  for(let b=0;b<nb;b++){const sl=polys.slice(b*per,(b+1)*per);if(!sl.length)continue;const by=new Map(),ov=new Map();let z=0;for(const q of sl){z+=q.z;const Mp=q.ov?ov:by;if(!Mp.has(q.col))Mp.set(q.col,[]);Mp.get(q.col).push(q.pts)}
    parts.push({z:z/sl.length+(o.zb||0),cast:false,fn:par=>{for(const[c,L]of by)E('path',{d:L.map(fgD).join(''),fill:c,stroke:o.ink||shd(c,-.45),'stroke-width':o.ew||(DET>=1.5?.3:.38),'stroke-opacity':o.eo??.42,'stroke-linejoin':'round'},par);
      for(const[c,L]of ov)E('path',{d:L.map(fgD).join(''),fill:c,opacity:.9},par)}})}}
/* the stipe and rachis: a tapered ribbon cut into pieces at their own depth (a crozier passes in front of itself), the stipe's scales near its foot */
function l58Rachis(ch,cols,parts,zb,sc){const n=ch.pts.length,step=12;for(let a=0;a<n-1;a+=step){const b=Math.min(n-1,a+step),P=[],W=[];let z=0;for(let i=a;i<=b;i++){P.push(fgQ(ch.pts[i]));W.push(ch.ws[i]);z+=ch.pts[i][2]}
    const wf=i=>W[i]/2,scl=[];if(sc&&DET>=1.5&&!LOD)for(let i=Math.max(1,a);i<b;i++){if(i>sc.n)break;const p=P[i-a],q=P[Math.min(P.length-1,i-a+1)],dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=W[i-a]/2,sg=i%2?1:-1,
        bx=p[0]+nx*w*.5*sg,by=p[1]+ny*w*.5*sg;scl.push([[bx-dx/l*w*.5,by-dy/l*w*.5],[bx+nx*w*1.05*sg+dx/l*w*.9,by+ny*w*1.05*sg+dy/l*w*.9],[bx+dx/l*w*.6,by+dy/l*w*.6]])}
    parts.push({z:z/(b-a+1)+zb,cast:false,fn:par=>{E('path',{d:polyRibbon(P,wf),fill:cols[1]},par);if(!LOD)E('path',{d:polyRibbon(P,i=>wf(i)*.32,i=>wf(i)*.42),fill:cols[3],opacity:.6},par);
      if(scl.length)E('path',{d:scl.map(fgD).join(''),fill:sc.c,opacity:.85},par)}})}}
/* ---------- the frond grower shared by the pinnate ferns. X: cws, cm (the frond's length), arch, u0 (the stipe's share), curl (the share coiled in bud), w0 w1, dl dt (the step between pinnae and its shortening),
   pl(q) (a pinna's length in blade lengths, q from the base to the tip of the blade), ang(q) dih (the pinnae's angle to the rachis and out of its plane), mode 'tri' (pinnules and segments grown on each pinna) or a
   simple pinna (ol, tw, fold, cup, droop), tip, sori, wing (a winged rachis), gl (gloss), lv (tones) ---------- */
function l58Frond(g,t,o,X){const cw=fgCw(X.cws,o),op=l58Op(o),cm0=X.cm,ks=o.spine?1:(o.cm||cm0)/cm0,kz=o.spine?1:.7+.3*ks,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,X.id,()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks,A0=l58Axis(o,Lt,(rnd()<.5?-1:1)*R(X.arch[0],X.arch[1]),X.bow*R(.8,1.2)),yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66)),cl=yg*X.curl,
      A=cl>.02?l58Curl(A0,cl,.55+1.1*yg):A0,Le=A.L,l0=A.l0||0,lb=l0+(Le-l0)*(o.spine?X.u0*.8:X.u0),Lb=Le-lb,cs=A.cs,fy=1-.3*yg,cols=l44Cols(cw.st),lim=g35Lim(o),
      P=pal7(cw.c),PB=pal7(cw.b),gl=cw.gl??X.gl,C={P,PB,lv:det?4:3,gl,lim,wr:1,sc:X.sc,sr:X.sr},nodes=[];
    for(let x=lb;x<Le-(X.tg||.02)*Lb;){nodes.push(x);const q=(x-lb)/Lb;x+=Lb*X.dl*(1-X.dt*q)*R(.92,1.08)}
    const cOf=x=>cs!=null?Math.max(0,(x/Le-cs)/(1-cs)):0,lenF=c=>fy*(c>0?.12+.78*Math.pow(1-c,1.6):1);
    /* a pinna of the leatherleaf: P(n) → F [ ±α Q ] P(n−1), its pinnules alternate, the first one on the side toward the frond's base; on the lower pinnae the basiscopic pinnules are longer
       and the first of them branch once more (pinnules cut into segments): the blade tripinnate, deltoid */
    const rules={P:p=>{if(p.n<=0)return[['F',{l:p.li*.45,w1:1.15,e:-.01}],['Q',{sz:.62*p.k,lv:p.lv,s:0,li:p.li}]];const tq=1-p.n/p.n0,bas=p.lv===1&&p.s===p.S?1+.75*Math.max(0,1-p.q/.45)*(1-tq):1,
        out=[['F',{l:p.li*R(.9,1.1),w1:Math.max(1.15,p.w*(1-.6*tq)),e:-.012}]];
      if(p.lv===1&&tq<.5&&p.n>2&&bas>1.12&&!p.c){const m=Math.max(2,Math.round(bas*R(2.4,3.4)*(1-tq)));out.push(['[',{w:1.2}],['+',{a:p.s*R(46,56)}],['&',{a:R(-8,8)}],['P',{n:m,n0:m,li:p.li*.68,s:p.s,S:p.s,k:p.k*.9,w:1.2,lv:2,q:p.q,c:0}],[']',{}])}
      else out.push(['[',{}],['+',{a:p.s*R(48,60)*(1-.5*p.c)}],[p.c?'^':'&',{a:p.c?50*p.c:R(-10,10)}],['Q',{sz:p.k*(1-.42*tq)*bas,lv:p.lv,s:p.s,li:p.li}],[']',{}]);
      out.push(['P',Object.assign({},p,{n:p.n-1,s:-p.s})]);return out}};
    const res=l44Main(A,nodes,{w0:X.w0*Math.min(1.1,kz),w1:X.w1,cols,step:o.spine?8:6,depth:X.mode==='tri'?28:4,rules,
      node:(i,u,w)=>{const x=nodes[i],q=(x-lb)/Lb,c=cOf(x),s=i%2?1:-1,Lp=X.pl(q)*Lb*lenF(c)*R(.94,1.06),a=X.ang(q)*(1-.55*c)+R(-4,4),tl=[c>0?'^':'&',{a:c>0?75*c:X.dih+R(-5,5)}];
        if(X.mode==='tri'){const li=X.li*UPC*kz*(.8+.2*fy),n=Math.max(1,Math.round(Lp/li)),wp=Math.max(1.2,w*.55);return[['[',{w:wp}],['+',{a:s*a}],tl,['P',{n,n0:n,li:Lp/n,s,S:s,k:(1-.25*q)*fy*(1-.5*c),w:wp,lv:1,q,c}],[']',{}]]}
        return[['[',{}],['+',{a:s*a}],tl,['Pa',{q,c,s,L:Lp}],[']',{}]]}});
    /* the pinnae, pinnules and segments */
    const polys=[],add=r=>{if(r)polys.push(...r)},v3=()=>R(-1,1);
    const lo=!det,ols=X.mode==='tri'?{1:[0,1,2].map(()=>l58Ol(X.olP,lo)),2:[0,1].map(()=>l58Ol(X.olS,lo)),t:l58Ol(Object.assign({},X.olP,{au:0}),lo)}:{p:[0,1,2].map(()=>l58Ol(Object.assign({},X.ol,{wr:cw.wr||X.ol.wr}),lo)),t:l58Ol(Object.assign({},X.ol,{au:0,fa:0,wr:cw.wr||X.ol.wr},X.olT||{}),lo)};
    const pinO=(sz,c)=>({tw:(X.tw+R(-8,8))*D*(c?.3:1),fold:X.fold+.6*c,cup:X.cup,arch:X.archP||0,droop:X.droop*(1-c),wave:cw.wv??X.wave,wk:X.wk||4,wph:R(0,6)});
    for(const og of res.organs){
      if(og.t==='Pa'){const ol=ols.p[Math.floor(rnd()*3)],Cx=Object.assign({},C,{wr:cw.wr||X.ol.wr,sori:(det||X.soriAll)&&X.sori&&og.p.q>=X.soriAt&&og.p.c<.05?X.sori:null});add(l58Pin(og,og.p.L,ol,-og.p.s,pinO(1,og.p.c),Cx))}
      else if(og.t==='Q'){const lv=og.p.lv,len=og.p.li*(lv===1?X.qL[0]:X.qL[1])*og.p.sz,ol=og.p.s?ols[lv][Math.floor(rnd()*ols[lv].length)]:ols.t,S=lv===1?X.olP:X.olS;
        add(l58Pin(og,len,ol,og.p.s?-og.p.s:1,{tw:R(-20,20)*D,fold:.14,cup:.12,arch:.04,droop:.06},Object.assign({},C,{wr:S.wr,sori:det&&X.sori?X.sori[lv]:null})))}
      else if(og.t==='T'&&X.tip){const c=cOf(Le),len=X.tip*Lb*lenF(c);add(l58Pin(og,len,ols.t||ols.p[0],1,pinO(1,c),Object.assign({},C,{wr:X.ol?X.ol.wr:1,sori:null})))}}
    /* a winged rachis (the blue fern): the blade joins its lobes along the rachis, one strip per internode on each side */
    if(X.wing){const c0=res.chains[0],ax=[],F=[];let lc=l0;for(let i=0;i<c0.pts.length-1;i++){lc+=V3l(V3s(c0.pts[i+1],c0.pts[i]));if(lc<lb+2||cOf(lc)>.02||lc>Le-2)continue;
        const q=A.at(A.sOf(lc));ax.push(c0.pts[i+1]);F.push({q,ww:X.wing*UPC*kz*fy*(1-.6*(lc-lb)/Lb)})}
      if(ax.length>1)for(const sg of[1,-1]){const dh=Math.sin(X.dih*D),ed=ax.map((p,i)=>V3.add(p,V3.add(V3.sc(F[i].q.Sd,sg*F[i].ww),V3.sc(F[i].q.Fr,-dh*F[i].ww)))),pts=ax.concat(ed.slice().reverse());
        if(lim!=null&&pts.some(p=>p[1]<lim))continue;const m=Math.floor(ax.length/2),q=F[m].q;let n=V3.cr(V3s(ax[Math.min(ax.length-1,m+1)],ax[Math.max(0,m-1)]),V3s(ed[m],ax[m]));n=V3l(n)>1e-9?V3.nz(n):[0,0,1];if(V3.dot(n,q.Fr)<0)n=V3.sc(n,-1);
        polys.push({pts:pts.map(fgQ),z:pts.reduce((a,p)=>a+p[2],0)/pts.length-6,col:l58Tone(P,PB,n,C.lv,gl).col})}}
    const parts=[],away=A.at(.6).Fr[2]<0;l58Rachis(res.chains[0],cols,parts,away?3:.4,X.scale?{n:Math.round(res.chains[0].pts.length*(X.u0*.55)),c:X.scale}:null);
    /* the axes of the pinnae (the leatherleaf): one ribbon each, never under 1.15 (they hold the pinnules) */
    const sub=res.chains.slice(1);if(sub.length){let zA=0,nA=0;for(const ch of sub)for(const p of ch.pts){zA+=p[2];nA++}
      parts.push({z:zA/nA+(away?2:-.3),cast:false,fn:par=>E('path',{d:sub.map(ch=>polyRibbon(ch.pts.map(fgQ),i=>Math.max(1.15,ch.ws[i])/2)).join(''),fill:cols[1]},par)})}
    l58Batch(polys,det?3:2,parts,{ink:shd(cw.c,-.5),eo:.4});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- leatherleaf fern (Rumohra adiantiformis, « fougère cuir », leather fern): the florist's fern — a stiff stipe as long as the blade, green-straw with brown scales at its foot; the blade deltoid,
   tripinnate, leathery and glossy, dark green; pinnae alternate, ascending, the lowest the largest, their basiscopic pinnules longer; pinnules oblong, cut into crenate lobes; round sori near the lobes'
   margins beneath, under a peltate indusium. Grown under shade cloth in Florida and Costa Rica, sold by the bunch of 25 fronds; also sprayed gold or silver for the festive season ---------- */
const CW_L58RU=[{id:'vert-sombre',n:'Vert sombre brillant',c:'#2a5a2c',b:'#5e7c4c',st:'#6a7040'},{id:'costa-rica',n:'Vert profond (Costa Rica)',c:'#24482a',b:'#566e48',st:'#5a6438'},
  {id:'vert-vif',n:'Vert vif (Floride)',c:'#386c30',b:'#6a8a54',st:'#727a44'},{id:'or',n:'Peint or',c:'#c9a646',b:'#a88e4e',st:'#9a8040',gl:.5,f:1},{id:'argent',n:'Peint argent',c:'#c6cac4',b:'#9ea49a',st:'#8e928a',gl:.5,f:1}];
const L58_RU={id:'l58ru',cws:CW_L58RU,cm:50,arch:[.06,.12],bow:.1,u0:.45,curl:.5,w0:3.4,w1:1.25,dl:.082,dt:.35,li:.9,pl:q=>.5*Math.pow(1-q,.85)+.04,ang:q=>52-10*q,dih:12,mode:'tri',gl:1,tg:.03,qL:[3,2.9],
  scale:'#7a5a34',olP:{wr:.46,nt:4,td:.4,t0:.16,fa:.08,wp:prof([[0,.55],[.15,.95],[.45,1],[.75,.75],[.92,.4],[1,0]])},olS:{wr:.38,nt:3,td:.16,t0:.2,fa:.05,wp:prof([[0,.6],[.2,1],[.7,.9],[.92,.5],[1,0]])},
  sori:{1:[[.11,.3],[-.11,.3],[.1,.5],[-.1,.5],[.09,.68],[-.09,.68]],2:[[.09,.4],[-.09,.4],[.08,.65],[-.08,.65]]},sc:'#6a4a26',sr:.035};
function l58Rum(g,t,o){return l58Frond(g,t,o,L58_RU)}

/* ---------- Boston fern (Nephrolepis exaltata 'Bostoniensis'): long narrow fronds, arching, once-pinnate; a short stipe, brown, fibrillose; forty to sixty pairs of pinnae, alternate, close, almost
   sessile, linear-oblong, finely crenate, an auricle on the side toward the tip, a little falcate and tilted; the blade narrowed a little at its base and tapering to a slender tip; soft fresh green.
   The Boston form is sterile (no sori). The young frond unrolls from its tip ---------- */
const CW_L58BO=[{id:'vert-tendre',n:'Vert tendre (Boston)',c:'#8fb35a',b:'#a6bf82',st:'#6a6a40'},{id:'vert-franc',n:'Vert franc',c:'#4c7a35',b:'#7a9862',st:'#5a5e38'},
  {id:'vert-pomme',n:'Vert pomme (Green Lady)',c:'#79a63e',b:'#9ab874',st:'#64683c'},{id:'dallas',n:'Vert dense (Dallas)',c:'#5f8f3a',b:'#86a468',st:'#5e623a',wr:.26}];
const L58_BO={id:'l58bo',cws:CW_L58BO,cm:60,arch:[.28,.42],bow:.2,u0:.14,curl:.5,w0:2.7,w1:1.15,dl:.0135,dt:.25,pl:q=>.088*(.55+.45*Math.sin(Math.min(1,q/.3)*Math.PI/2))*(1-.9*Math.pow(Math.max(0,(q-.72)/.28),1.2)),
  ang:q=>80-12*q,dih:18,tw:30,fold:.1,cup:.08,droop:.05,gl:.3,tip:.02,
  ol:{wr:.22,nt:8,td:.14,t0:.14,au:.04,fa:.07,wp:prof([[0,.55],[.07,.95],[.25,1],[.6,.9],[.86,.55],[1,0]])}};
function l58Bos(g,t,o){return l58Frond(g,t,o,L58_BO)}

/* ---------- sword fern (Polystichum munitum, western sword fern): fronds like a sword, once-pinnate, lanceolate; the stipe a quarter of the frond, densely clad in rusty-brown scales; thirty to fifty pairs
   of pinnae, linear-lanceolate, acuminate, a little falcate, the margin serrate with spiny teeth and an auricle at the base on the side toward the tip; leathery, glossy, dark green; on the upper pinnae
   round sori in two rows beneath. Cut in the forests of the Pacific Northwest, long-lasting ---------- */
const CW_L58PO=[{id:'vert-sombre',n:'Vert sombre',c:'#26442a',b:'#566c4c',st:'#5a5a30'},{id:'vert-profond',n:'Vert profond',c:'#1f3d2a',b:'#4c6450',st:'#4e5230'},
  {id:'vert-olive',n:'Vert olive (fronde d\'été)',c:'#3c5630',b:'#687c56',st:'#62603a'}];
const L58_PO={id:'l58po',cws:CW_L58PO,cm:80,arch:[.1,.2],bow:.12,u0:.24,curl:.5,w0:3.8,w1:1.3,dl:.021,dt:.2,pl:q=>.165*(.62+.38*Math.sin(Math.min(1,q/.28)*Math.PI/2))*(1-.93*Math.pow(Math.max(0,(q-.55)/.45),1.25)),
  ang:q=>72-12*q,dih:14,tw:16,fold:.16,cup:.05,droop:.04,gl:.8,tip:.03,scale:'#8a5a2c',
  ol:{wr:.17,nt:13,td:.2,t0:.14,saw:1,au:.035,fa:.13,wp:prof([[0,.7],[.07,1],[.35,.9],[.7,.58],[.9,.26],[1,0]])},soriAt:.35,sori:[[.05,.25],[-.05,.25],[.045,.4],[-.045,.4],[.04,.55],[-.04,.55],[.03,.7],[-.03,.7]],sc:'#7a4a24',sr:.012};
function l58Swo(g,t,o){return l58Frond(g,t,o,L58_PO)}

/* ---------- blue star fern (Phlebodium aureum 'Blue Star', « polypode doré »): a long smooth stipe, golden-brown; the blade deeply pinnatifid — three to six pairs of long strap-shaped lobes, undulate,
   joined along the rachis by a narrow wing, a terminal lobe as long; glaucous blue-green, waxy, paler beneath where the round sori show, golden-orange, in a row on each side of the lobe's midrib ---------- */
const CW_L58PH=[{id:'blue-star',n:'Bleu-vert glauque (Blue Star)',c:'#6f9690',b:'#9ab2a8',st:'#8a6a40'},{id:'davana',n:'Bleu argenté ondulé (Davana)',c:'#7c9a8e',b:'#a4b6aa',st:'#86683e',wv:.05},
  {id:'vert',n:'Vert (type)',c:'#4c7a35',b:'#86a06c',st:'#8a6a3a'}];
const L58_PH={id:'l58ph',cws:CW_L58PH,cm:50,arch:[.06,.12],bow:.08,u0:.46,curl:.45,w0:3.2,w1:1.6,dl:.095,dt:.25,tg:.1,pl:q=>.46*(1-.4*q),ang:q=>62-16*q,dih:9,tw:8,fold:.08,cup:.06,droop:.07,wave:.025,wk:5,gl:0,tip:.42,wing:.55,olT:{wp:prof([[0,.35],[.12,.8],[.35,1],[.65,.9],[.88,.5],[1,0]])},
  ol:{wr:.3,nt:0,t0:.12,fa:.06,wp:prof([[0,1.1],[.08,.8],[.25,1],[.6,.94],[.86,.58],[1,0]])},soriAt:0,soriAll:1,sori:[[.045,.2],[-.045,.2],[.05,.32],[-.05,.32],[.05,.44],[-.05,.44],[.048,.56],[-.048,.56],[.042,.68],[-.042,.68],[.034,.8],[-.034,.8]],sc:'#d89a2a',sr:.016};
/* the golden sori are the blue fern's mark: shown on the back at every detail (half of them in the app) */
const L58_PHA=Object.assign({},L58_PH,{sori:L58_PH.sori.filter((_,i)=>i%4<2)});
function l58Phl(g,t,o){return l58Frond(g,t,o,DET>=1.5&&!LOD?L58_PH:L58_PHA)}

/* ---------- bird's nest fern (Asplenium nidus): a leaf entire, lanceolate, long-tapering to its foot, acute at its tip, undulate, bright apple green and glossy; its midrib black-brown, raised beneath;
   fine veins parallel and oblique, close; linear sori along the veins of the upper half beneath. A short black stipe. 'Crispy Wave' crinkled, 'Osaka' narrow and wavy. The young leaf unrolls,
   its margins rolled inward ---------- */
const CW_L58AN=[{id:'vert-pomme',n:'Vert pomme brillant',c:'#7cb03e',b:'#9cbc72',wv:.018,wk:7},{id:'vert-profond',n:'Vert profond',c:'#3d7a30',b:'#6c9058',wv:.016,wk:6},
  {id:'crispy-wave',n:'Ondulé (Crispy Wave)',c:'#5c9a34',b:'#86aa66',wv:.034,wk:18,wr:.15},{id:'osaka',n:'Étroit ondulé (Osaka)',c:'#6aa63a',b:'#90b26a',wv:.03,wk:13,wr:.1}];
const L58_ANW=prof([[0,.04],[.12,.28],[.35,.72],[.6,1],[.8,.88],[.94,.45],[1,0]]),L58_BLK=['#120e0c','#2b1f19','#4a3a30','#7a6a5e'];
function l58Nid(g,t,o){const cw=fgCw(CW_L58AN,o),op=l58Op(o),cm0=55,ks=o.spine?1:(o.cm||cm0)/cm0,kz=o.spine?1:.7+.3*ks,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l58an',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks,A=l58Axis(o,Lt,(rnd()<.5?-1:1)*R(.06,.12),R(.12,.18)),Le=A.L,l0=A.l0||0,yg=o.spine?0:Math.max(0,Math.min(1,(.8-op)/.66)),
      lb=l0+(Le-l0)*(o.spine?.08:.11),Lb=(Le-lb)*(1-.3*yg),lim=g35Lim(o),wr=(cw.wr||.2)*(1-.3*yg),fo=.16+1.1*yg,wv=cw.wv*(1-.6*yg),wk=cw.wk,ph=R(0,6.283),
      c=yg?mix(cw.c,'#b4d070',.35*yg):cw.c,P=pal7(c),PB=pal7(cw.b);
    /* the L-system grows the stipe up to the blade's foot (the midrib goes on along the same axis) */
    const res=l44Main(A,[],{w0:4.2*Math.min(1.1,kz),w1:3.4*Math.min(1.1,kz),cols:L58_BLK,end:lb,step:6}),parts=[];
    const fr=y=>A.at(A.sOf(lb+Lb*y)),Wd=y=>Lb*wr*.5*L58_ANW(y);
    /* the blade's surface on its axis: x across (−1…1 of the half-width), folded upward on the midrib, its margin waving more and more toward the edge, drooping */
    const M=(x,y)=>{const q=fr(y),ax=Math.abs(x),w=Wd(y),h=fo*ax*w+wv*Lb*Math.sin(wk*Math.PI*y+ph+(x<0?2.1:0))*Math.pow(ax,1.6)*Math.min(1,y*6);
      const p=V3.add(V3.add(q.p,V3.sc(q.Sd,x*w)),V3.sc(q.Fr,h));if(lim!=null&&p[1]<lim)p[1]=lim;return p};
    const nrm=(x,y)=>{const e=.01,q=fr(y);let n=V3.cr(V3s(M(x+e,y),M(x-e,y)),V3s(M(x,y+e),M(x,y-e)));n=V3l(n)>1e-9?V3.nz(n):q.Fr;return V3.dot(n,q.Fr)<0?V3.sc(n,-1):n};
    /* each half one fill (its mean light), its undulations as soft lenses between crest and trough — lit or shaded by their own slope, widest at the margin */
    const halves=[];for(const sg of[1,-1]){const ns=det?36:24,mg=[];for(let i=0;i<=ns;i++)mg.push(M(sg,i/ns));const pts=[];for(let i=0;i<=8;i++)pts.push(M(0,i/8));for(let i=ns;i>=0;i--)pts.push(mg[i]);
      let nm=[0,0,0];for(const y of[.25,.4,.55,.7,.85])nm=V3.add(nm,nrm(sg*.45,y));nm=V3.nz(nm);const tn=l58Tone(P,PB,nm,12,0),I0=lightI(tn.fr?nm:V3.sc(nm,-1)),lens=[[],[],[],[]];
      const phs=ph+(sg<0?2.1:0);for(let n=-1;n<wk+2;n++){const y0=Math.max(.02,((n+.5)*Math.PI-phs)/(wk*Math.PI)),y1=Math.min(.99,((n+1.5)*Math.PI-phs)/(wk*Math.PI));if(y1-y0<.012)continue;
        const yc=(y0+y1)/2,n2=nrm(sg*.8,yc),dI=lightI(tn.fr?n2:V3.sc(n2,-1))-I0;if(Math.abs(dI)<.05)continue;const L=[];for(let j=0;j<=6;j++)L.push(fgQ(M(sg,y0+(y1-y0)*j/6)));
        for(let j=5;j>=1;j--){const tt=j/6;L.push(fgQ(M(sg*(1-.72*Math.sin(Math.PI*tt)),y0+(y1-y0)*tt)))}lens[(dI>0?0:2)+(Math.abs(dI)>.16?1:0)].push(L)}
      halves.push({sg,pts:pts.map(fgQ),edge:mg.map(fgQ),col:tn.col,fr:tn.fr,lens,z:pts.reduce((a,p)=>a+p[2],0)/pts.length})}
    halves.sort((a,b)=>a.z-b.z);
    const mid=[],mw=[];for(let i=0;i<=24;i++){const y=i/24;mid.push(fgQ(M(0,y)));mw.push(Math.max(.5,(2.6-2.1*y)*Math.min(1.1,kz)*(y<.04?1.3:1)))}
    const zl=halves.reduce((a,h)=>a+h.z,0)/2,back=!halves[0].fr&&!halves[1].fr;
    /* veins (parallel, oblique, close) on the face that shows; linear sori along those of the upper half beneath */
    let dv='',ds='';if(det){const nv=34;for(const h of halves)for(let i=1;i<nv;i++){const y=.03+.94*i/nv,a=[],sg=h.sg;for(let j=0;j<=3;j++){const x=.04+.92*j/3;a.push(fgQ(M(sg*x,y+.05*x)))}
        dv+='M'+a.map(q=>f(q[0])+','+f(q[1])).join('L');if(back&&y>.4&&y<.92&&i%2){const s=[];for(let j=0;j<=2;j++){const x=.1+.4*j/2;s.push(fgQ(M(sg*x,y+.05*x)))}ds+='M'+s.map(q=>f(q[0])+','+f(q[1])).join('L')}}}
    parts.push({z:zl,cast:false,fn:par=>{for(const h of halves){E('path',{d:smooth(h.pts),fill:h.col},par);
        if(!LOD)h.lens.forEach((L,i)=>{if(L.length)E('path',{d:L.map(q=>smooth(q)).join(''),fill:i<2?'#ffffff':P.d2,opacity:[.13,.26,.16,.3][i]},par)});
        E('path',{d:'M'+h.edge.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:P.ink,'stroke-width':det?.45:.5,'stroke-opacity':.45,fill:'none','stroke-linejoin':'round'},par)}
      if(dv)E('path',{d:dv,stroke:back?PB.d1:P.d1,'stroke-width':.35,'stroke-opacity':.32,fill:'none'},par);
      if(ds)E('path',{d:ds,stroke:'#6a4a2a','stroke-width':.8,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par);
      /* the gloss: a soft light band on the half that faces the light */
      if(!LOD&&!back){const h=halves[1].fr?halves[1]:halves[0],a=[],b2=[];for(let i=2;i<=9;i++){const y=i/11;a.push(fgQ(M(h.sg*.12,y)));b2.push(fgQ(M(h.sg*.48,y)))}E('path',{d:smooth(a.concat(b2.reverse())),fill:'#ffffff',opacity:.16},par)}
      E('path',{d:polyRibbon(mid,i=>mw[i]/2),fill:L58_BLK[1]},par);if(!LOD)E('path',{d:polyRibbon(mid,i=>mw[i]*.18,i=>mw[i]*.2),fill:L58_BLK[3],opacity:.6},par)}});
    l58Rachis(res.chains[0],L58_BLK,parts,-.2,{n:Math.round(res.chains[0].pts.length*.4),c:'#1a1210'});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,L58_BLK)})}

/* ---------- registries: drawers, colourways, trade grades (the frond's or the leaf's length in cm), and how the composer treats them: foliage stems at their natural length ---------- */
Object.assign(GH,{'rumohra-adiantiformis-leatherleaf':l58Rum,'nephrolepis-exaltata-boston':l58Bos,'asplenium-nidus':l58Nid,'phlebodium-aureum-blue-star':l58Phl,'polystichum-munitum-sword-fern':l58Swo});
Object.assign(CWS,{'rumohra-adiantiformis-leatherleaf':CW_L58RU,'nephrolepis-exaltata-boston':CW_L58BO,'asplenium-nidus':CW_L58AN,'phlebodium-aureum-blue-star':CW_L58PH,'polystichum-munitum-sword-fern':CW_L58PO});
Object.assign(SZG,{'rumohra-adiantiformis-leatherleaf':[40,50,55,65],'nephrolepis-exaltata-boston':[45,60,60,75],'asplenium-nidus':[40,55,55,70],'phlebodium-aureum-blue-star':[35,50,50,60],'polystichum-munitum-sword-fern':[60,80,80,100]});
const L58_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'rumohra-adiantiformis-leatherleaf':L58_I(55,{fx:30}),'nephrolepis-exaltata-boston':L58_I(60,{fx:18}),'asplenium-nidus':L58_I(55,{fx:22}),
  'phlebodium-aureum-blue-star':L58_I(50,{fx:28}),'polystichum-munitum-sword-fern':L58_I(75,{fx:22})});
