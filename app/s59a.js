/* ================= Serre, lot 59 — fougères 2 et prêles : fougère parapluie (Sticherus), helecho (Pelazoneuron kunthii), fougère chaîne géante (Woodwardia fimbriata), uluhe (Dicranopteris linearis), prêle d'hiver (Equisetum hyemale) ================= */
/* chaque fronde est poussée par le L-système (l44Main du lot 44) : le rachis suit son chemin (épine du Composer, arc d'une planche), ses nœuds portent les pennes ; les fougères fourchues (Sticherus, Dicranopteris)
   se ramifient par fausses dichotomies, un bourgeon dormant à chaque fourche, leurs segments ultimes pectinés ; les pennes sont des nappes 3D pliées sur leur costa, découpées en lobes,
   groupées en quelques chemins par profondeur et par ton ; la prêle est un tube creux segmenté, ses nœuds cerclés de leurs gaines. Contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
const l59Op=o=>Math.max(.05,Math.min(1,o.op??1)),l59Cols=c=>[shd(c,-.58),shd(c,-.25),c,shd(c,.4)];
/* lobe outlines: t across the lobe (from its lower sinus to the next), r from the depth of the sinus to the full half-width; fine on the sheets, light in the app */
const L59_LB={round:[[[0,0],[.1,.55],[.25,.9],[.45,1],[.65,.92],[.82,.62],[.93,.3],[1,0]],[[0,0],[.2,.82],[.5,1],[.82,.62],[1,0]]],
  acute:[[[0,0],[.14,.45],[.32,.78],[.5,.95],[.6,1],[.72,.72],[.87,.34],[1,0]],[[0,0],[.28,.66],[.6,1],[.84,.42],[1,0]]],
  linear:[[[0,0],[.08,.6],[.18,.93],[.4,1],[.64,.95],[.86,.62],[1,0]],[[0,0],[.14,.85],[.45,1],[.8,.85],[1,0]]]};
/* ---------- a pinna (or the ultimate segment of a forked frond) at its organ: the costa along H, arched a little (ar), drooping under its weight (dr), curving toward the tip of the frond (fa, along fw);
   the lamina across L = U × H, V-folded on the costa (fo); its margin cut into nl lobes a side, d deep (0 entire, .6 pinnatifid, .9 pinnatisect), slanted toward the tip (sl);
   its two halves are polygons lit by their own normal (the costa a vein over the first), pushed into polys. S: len, wr, wp, nl, d, lb, sl, ar, dr, fa, fo, fw, sori ---------- */
function l59Pinna(og,S,P,PB,lim,polys,lv){const H=V3.nz(og.H),U=V3.nz(og.U),L=V3.nz(V3.cr(U,H)),len=S.len,det=DET>=1.5&&!LOD,tp=L59_LB[S.lb||'round'][det?0:1],nl=Math.max(2,Math.round(S.nl*(det?1:.72))),d=S.d??.6,sl=S.sl??.4,wp=S.wp||LS_LANCE,
    fw0=S.fw?V3s(S.fw,V3.sc(H,V3.dot(S.fw,H))):null,Fw=fw0&&V3l(fw0)>1e-6?V3.nz(fw0):null,W=len*(S.wr||.1),fo=S.fo??.2,nm=det?10:6,mid=[];
  const C=v=>{let p=V3.add(og.pos,V3.add(V3.sc(H,len*v),V3.sc(U,len*(S.ar||0)*Math.sin(Math.PI*v))));if(Fw)p=V3.add(p,V3.sc(Fw,len*(S.fa||0)*v*v));return V3.add(p,[0,-len*(S.dr||0)*v*v,0])};
  for(let i=0;i<=nm;i++)mid.push(C(i/nm));if(lim!=null&&mid.some(p=>p[1]<lim))return 0;
  const z=mid.reduce((a,p)=>a+p[2],0)/mid.length,dC=V3s(C(.6),C(.4));
  for(const s of[-1,1]){const sd=V3.add(V3.sc(L,s*Math.cos(fo)),V3.sc(U,Math.sin(fo))),pts=[og.pos];
    for(let i=0;i<nl;i++){const a=i/nl,b=(i+1)/nl;for(const[t,r]of tp){if(i>0&&t===0)continue;const v=Math.min(1,a+(b-a)*(t+sl*r));pts.push(V3.add(C(v),V3.sc(sd,W*wp(v)*((1-d)+d*r))))}}
    pts.push(C(1));for(let i=nm-1;i>0;i--)pts.push(mid[i]);
    let n=V3.sc(V3.cr(dC,sd),s);n=V3l(n)>1e-9?V3.nz(n):[0,0,1];const tn=l44Tone(P,PB,n,lv||3),q={pts:pts.map(fgQ),z,col:tn.col,mid:s>0?mid.map(fgQ):null};
    /* the sori of the chain fern: oblong, end to end in a chain along each side of the costa, on the back */
    if(S.sori&&det&&!tn.fr){q.dash=[];for(let i=1;i<nm-1;i++){const a=C((i+.15)/nm),b=C((i+.85)/nm);q.dash.push([V3.add(a,V3.sc(sd,W*wp(i/nm)*.24)),V3.add(b,V3.sc(sd,W*wp(i/nm)*.24))].map(fgQ))}}
    polys.push(q)}
  return 1}
/* the polygons far to near in nb depth bands, each band one path per tone, then its veins (the costae) and the sori in one stroke each; axes and buds may join the bands (q.ax: a stroke, q.bud: a knob) */
function l59Batch(polys,nb,parts,o={}){if(!polys.length)return;polys.sort((a,b)=>a.z-b.z);const per=Math.ceil(polys.length/nb);
  for(let b=0;b<nb;b++){const sl=polys.slice(b*per,(b+1)*per);if(!sl.length)continue;const by=new Map(),ax=new Map();let z=0,dm='',ds='',db='';
    for(const q of sl){z+=q.z;if(q.ax){const kw=q.w.toFixed(1);ax.set(kw,(ax.get(kw)||'')+'M'+q.ax.map(p=>f(p[0])+','+f(p[1])).join('L'));continue}
      if(q.bud){const[x,y]=q.bud,r=q.r;db+=`M${f(x-r)},${f(y)}a${f(r)},${f(r*.8)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r*.8)} 0 1,0 ${f(-2*r)},0`;continue}
      if(!by.has(q.col))by.set(q.col,[]);by.get(q.col).push(q.pts);if(q.mid)dm+='M'+q.mid.map(p=>f(p[0])+','+f(p[1])).join('L');if(q.dash)for(const d of q.dash)ds+=`M${f(d[0][0])},${f(d[0][1])}L${f(d[1][0])},${f(d[1][1])}`}
    parts.push({z:z/sl.length+(o.zb||0),cast:false,fn:par=>{
      for(const[w,d]of ax)E('path',{d,stroke:o.axc,'stroke-width':w,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
      for(const[c,L]of by)E('path',{d:L.map(fgD).join(''),fill:c,stroke:o.ink||shd(c,-.45),'stroke-width':o.ew||(DET>=1.5?.3:.38),'stroke-opacity':o.eo??.45,'stroke-linejoin':'round'},par);
      if(dm)E('path',{d:dm,stroke:o.vc,'stroke-width':o.vw||.7,'stroke-opacity':o.vo??.75,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
      if(ds)E('path',{d:ds,stroke:o.sc||'#5a3a1e','stroke-width':1.1,'stroke-opacity':.55,fill:'none','stroke-linecap':'round'},par);
      if(db)E('path',{d:db,fill:o.bc||'#7a5634',stroke:shd(o.bc||'#7a5634',-.4),'stroke-width':.3},par)}})}}
/* the branches of a forked frond as strokes in the bands (never thinner than 1.2: they hold the segments), its main axis a shaded ribbon */
function l59Axes(res,cols,parts,polys){lsChainParts([res.chains[0]],[0,0,0],cols,parts,{piece:DET>=1.5?8:14});
  for(const ch of res.chains.slice(1)){const w=Math.max(1.2,Math.round(ch.ws.reduce((a,x)=>a+x,0)/ch.ws.length/.4)*.4);polys.push({ax:ch.pts.map(fgQ),w,z:ch.pts.reduce((a,p)=>a+p[2],0)/ch.pts.length-.02})}}
/* a crozier: the young tip of a frond still rolled in its circinate spiral (toward the front of the frond, a little sideways so that it reads face on), its coiled pinnae as beads on both flanks */
function l59Croz(og,len,w,cols,c,parts){const H=V3.nz(og.H),U=V3.nz(og.U),L=V3.cr(U,H),ax=V3.nz(V3.add(V3.sc(U,.8),V3.sc(L,.6))),e2=V3.nz(V3s(ax,V3.sc(H,V3.dot(ax,H)))),N=28,ds=len/N,R0=len*2.2/(5.4*Math.PI),pts=[og.pos],ws=[w];let p=og.pos,th=0;
  for(let i=1;i<=N;i++){th+=(1+3*Math.pow(i/N,1.5))/R0*ds;p=V3.add(p,V3.sc(V3.add(V3.sc(H,Math.cos(th)),V3.sc(e2,Math.sin(th))),ds));pts.push(p);ws.push(Math.max(1.2,w*(1-.5*i/N)))}
  const sc=pts.map(fgQ),side=V3.cr(ax,H),bd=[];for(let i=3;i<N;i+=2){const r=Math.max(1.1,ws[i]*.62);for(const s of[-1,1]){const q=fgQ(V3.add(pts[i],V3.sc(side,s*ws[i]*.5)));bd.push(`M${f(q[0]-r)},${f(q[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`)}}
  const z=pts.reduce((a,q)=>a+q[2],0)/pts.length+.05;
  parts.push({z,cast:false,fn:par=>{E('path',{d:polyRibbon(sc,i=>ws[i]/2),fill:cols[1]},par);if(bd.length)E('path',{d:bd.join(''),fill:c,stroke:shd(c,-.45),'stroke-width':.35},par);E('path',{d:polyRibbon(sc,i=>ws[i]*.18,i=>ws[i]*.3),fill:cols[3],opacity:.6},par)}})}
/* a path through given 3D points (a zigzag rachis, a bent horsetail): the same interface as spAxis (at, sOf, L, l0, s0, up) */
function l59Path(pts,A0,l0){const N=pts.length-1,cum=[0];for(let i=1;i<=N;i++)cum.push(cum[i-1]+V3l(V3s(pts[i],pts[i-1])));const L=cum[N];
  const ix=s=>{const l=Math.max(0,Math.min(1,s))*L;let i=1;while(i<N&&cum[i]<l)i++;return[i,Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1)))]};
  const at=s=>{const[i,t]=ix(s),p=V3.add(pts[i-1],V3.sc(V3s(pts[i],pts[i-1]),t)),T=V3.nz(V3s(pts[i],pts[i-1])),F0=A0.at(Math.min(1,cum[i]/L)).Fr;let Fr=V3s(F0,V3.sc(T,V3.dot(F0,T)));Fr=V3l(Fr)>1e-6?V3.nz(Fr):[0,0,1];return{p,T,Fr,Sd:V3.cr(T,Fr)}};
  return{at,L,sOf:l=>Math.max(0,Math.min(1,l/L)),s0:l0/L,l0,up:A0.up,cb:s=>at(s).p}}
/* the axis sampled every few units along its length (for l59Path) */
const l59Samp=(A,st)=>{const n=Math.max(8,Math.ceil(A.L/st)),out=[];for(let i=0;i<=n;i++){const l=A.L*i/n;out.push({l,q:A.at(A.sOf(l))})}return out};

/* ---------- the pinnate frond (chain fern, helecho): a stipe, then the blade, its pinnae subopposite in pairs, longest a little above the base, spreading in the plane of the frond
   and swept back a little (a shallow roof, so that it reads in profile), each curving toward the tip; young, the top of the blade is still a crozier ---------- */
function l59Frond(g,t,o,F){const cw=fgCw(F.cws,o),op=l59Op(o),ks=o.spine?1:(o.cm||F.cm0)/F.cm0,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,F.id,()=>{const Lt=o.spine?blen(o.spine):F.cm0*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(F.arch[0],F.arch[1])),Le=A.L,l0=A.l0||0,yg=o.spine?0:Math.max(0,Math.min(1,(.9-op)/.75)),
      Lb0=l0+(Le-l0)*F.u0,Ly=Le-Lb0,Lc=Ly*.24*yg,Lend=Le-Lc*.5,np=Math.max(4,Math.round(F.np*(1-.3*yg))),nodes=[],side=[];
    let x=Lb0;const sp0=(Lend-Lb0-Ly*.04)/(np*(1-.22));for(let i=0;i<np&&x<Lend-Ly*.03;i++){const q=(x-Lb0)/Ly,sp=sp0*(1-.44*q)*R(.92,1.08);nodes.push(x);side.push(1);nodes.push(x+sp*R(.22,.4));side.push(-1);x+=sp}
    while(nodes.length&&nodes[nodes.length-1]>Lend-Ly*.015){nodes.pop();side.pop()}
    const cols=l59Cols(cw.s||F.stipe),lim=g35Lim(o),P=pal7(cw.c),PB=pal7(mix(cw.c,F.back||'#c8d4a8',.35)),polys=[],parts=[],kz=o.spine?1:.75+.25*ks;
    const res=l44Main(A,nodes,{w0:F.w0*Math.min(1.12,kz),w1:F.w1,cols,step:8,depth:4,end:Lend,
      node:(i,u,w)=>{const q=Math.max(0,Math.min(1,(nodes[i]-Lb0)/Ly)),s=side[i];return[['[',{}],['+',{a:s*(F.ang(q)+R(-4,4))*(1-.3*yg*q)}],['&',{a:F.pitch+R(-5,5)}],['Pn',{q,s,i}],[']',{}]]}});
    for(const og of res.organs){if(og.t!=='Pn')continue;const q=og.p.q,qy=yg*Math.max(0,(q-.4)/.6),len=Lt*F.pl*F.prof(q)*(1-.55*qy)*R(.92,1.06),T=A.at(A.sOf(nodes[og.p.i])).T;
      l59Pinna(og,Object.assign({},F.pn,{len,fw:T,fo:(F.pn.fo??.2)+.6*qy,dr:(F.pn.dr||0)*(1-qy)}),qy>.3?pal7(mix(cw.c,'#c8d870',.4)):P,PB,lim,polys,det?4:3)}
    lsChainParts([res.chains[0]],[0,0,0],cols,parts,{piece:DET>=1.5?9:14});
    l59Batch(polys,det?4:3,parts,{vc:mix(cw.c,'#f0f0d0',.45),vw:det?.8:.7,eo:.4,ink:shd(cw.c,-.5),sc:F.soriC});
    const T=res.organs.find(q=>q.t==='T');if(yg&&T)l59Croz(T,Lc,Math.max(2.2,F.w1*1.9),cols,mix(cw.c,'#b8c860',.3),parts);
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- giant chain fern (Woodwardia fimbriata): huge arching fronds (to 2–3 m in the wild, cut at 80 to 120 cm), the stipe straw-brown and scaly at its foot, the blade lanceolate,
   pinnate-pinnatifid: pinnae lanceolate and long-acuminate, cut deep (three quarters) into falcate, acute, finely spinulose lobes; frank green, a little glossy; on the back the oblong sori
   end to end like the links of a chain along both sides of each costa (hence the name) ---------- */
const CW_L59WF=[{id:'vert',n:'Vert franc',c:'#4f8a34'},{id:'vert-tendre',n:'Vert tendre (jeunes frondes)',c:'#7ea844'}];
const L59_WFP=prof([[0,.7],[.18,1],[.45,.9],[.7,.6],[.88,.3],[1,.08]]),L59_WFW=prof([[0,.55],[.1,.95],[.3,1],[.6,.78],[.85,.42],[1,.04]]);
const l59Wood=(g,t,o)=>l59Frond(g,t,o,{cws:CW_L59WF,cm0:100,id:'l59wf',arch:[.22,.34],u0:.3,np:17,w0:6,w1:1.5,stipe:'#9a7a4c',back:'#b8c8a0',pitch:28,pl:.17,prof:L59_WFP,soriC:'#6a4220',
  ang:q=>64-20*q,pn:{wr:.11,wp:L59_WFW,nl:15,d:.76,lb:'acute',sl:.62,ar:.03,dr:.07,fa:.1,fo:.2,sori:1}});

/* ---------- helecho (Pelazoneuron kunthii, syn. Thelypteris kunthii — southern shield fern, « helecho » of the Latin American trade): soft, light fronds of 50 to 100 cm, the stipe green-straw,
   the blade lanceolate, pinnate-pinnatifid: the pinnae linear-lanceolate, almost at right angles to the rachis, cut halfway to two thirds into rounded oblong lobes, the lowest pair hardly shorter;
   light yellow-green, finely hairy, matt; supple, the pinnae drooping a little ---------- */
const CW_L59TK=[{id:'vert-clair',n:'Vert clair',c:'#9cc05a'},{id:'vert-tendre',n:'Vert tendre',c:'#84ad48'}];
const L59_TKP=prof([[0,.62],[.22,1],[.5,.86],[.76,.5],[.92,.2],[1,.05]]),L59_TKW=prof([[0,.7],[.1,.98],[.4,1],[.7,.82],[.9,.45],[1,.06]]);
const l59Thel=(g,t,o)=>l59Frond(g,t,o,{cws:CW_L59TK,cm0:60,id:'l59tk',arch:[.26,.4],u0:.32,np:15,w0:3.4,w1:1.3,stipe:'#8aa25a',back:'#d4dcb4',pitch:24,pl:.19,prof:L59_TKP,
  ang:q=>78-22*q,pn:{wr:.085,wp:L59_TKW,nl:13,d:.6,lb:'round',sl:.22,ar:.02,dr:.13,fa:.05,fo:.16}});

/* ---------- umbrella fern (Sticherus flabellatus, S. cunninghamii — Gleicheniaceae): a long wiry stipe, then the frond forks pseudo-dichotomously in tiers, one above the other like stacked
   umbrellas: at each tier a pair of branches spread almost level round a dormant bud (brown, hairy) which goes on to make the next tier; each branch forks two or three times more and the last forks
   carry the ultimate segments, pectinate: cut to the axis into narrow linear lobes, close as the teeth of a comb; bright fresh green, paler beneath. Young: the top tier still in croziers ---------- */
const CW_L59ST=[{id:'vert-vif',n:'Vert vif',c:'#5e9e36'},{id:'vert-profond',n:'Vert profond',c:'#3d6e2c'}];
const L59_STW=prof([[0,.55],[.1,.9],[.5,1],[.8,.85],[.95,.5],[1,.1]]);
function l59Stich(g,t,o){const cw=fgCw(CW_L59ST,o),op=l59Op(o),cm0=20,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l59st',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks*2.3,Sp=o.spine?Math.min(cm0*UPC*1.1,Lt*.42):cm0*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.04,.1)),Le=A.L,l0=A.l0||0,
      yg=o.spine?0:Math.max(0,Math.min(1,(.9-op)/.75)),nT=yg>.6?1:yg>.2?2:rnd()<.6?2:3,gap=Sp*R(.32,.4),top=Le-Sp*.08,nodes=[];
    for(let i=nT-1;i>=0;i--){const x=top-i*gap*(1-.1*i);if(x>l0+(Le-l0)*.12)nodes.push(x)}const nt=nodes.length,r=Sp*.6;
    const end=nodes[nt-1]+Sp*.05,ph=R(0,360),ps=rnd()<.5?-1:1,cols=l59Cols('#6b5a38'),lim=g35Lim(o),P=pal7(cw.c),PB=pal7(mix(cw.c,'#c8d8b0',.4)),polys=[],parts=[];
    /* a branch: B(d) → F Bd [ +α B(d−1) ] [ −α B(d−1) ], B(0) → F Sg (a pectinate ultimate segment); the forks yaw round U, the normal of the umbrella */
    const rules={B:p=>{if(p.d<=0)return[['F',{l:p.l*.3,w1:1.2,e:-.012}],['Sg',{len:r*.78*p.k,j:p.j}]];const a=R(28,38),w=Math.max(1.2,p.w*.8);
      return[['F',{l:p.l*R(.9,1.1),w1:w,e:-.016}],['Bd',{r:Math.max(1.2,p.w*.6)}],['[',{w}],['+',{a}],['B',{d:p.d-1,l:p.l*.76,w,j:p.j,k:p.k}],[']',{}],['[',{w}],['-',{a}],['B',{d:p.d-1,l:p.l*.76,w,j:p.j,k:p.k}],[']',{}]]}};
    /* each tier an umbrella: its normal tilted τ from the stipe toward the front and to one side (alternately), its pair of branches at the azimuth φ, spreading a little below its plane */
    const res=l44Main(A,nodes,{w0:2.8*Math.min(1.1,.8+.2*ks),w1:1.7,cols,step:8,depth:7,end,rules,
      node:(i,u,w)=>{const j=nt-1-i,kz=(1-.14*j)*(i===nt-1?1-.3*yg:1)*(j?1:.9),dd=3,out=[['Bd',{r:Math.max(1.4,w*.7)}]],tilt=[['/',{a:ps*(i%2?1:-1)*R(35,55)}],['^',{a:R(40,54)}],['/',{a:ph+i*90+R(-15,15)}]];
        for(const s of[-1,1])out.push(['[',{w:Math.max(1.3,w*.7)}],...tilt,['+',{a:s*R(96,106)}],['/',{a:90}],['B',{d:dd,l:r*(dd===3?.17:.22)*kz,w:Math.max(1.3,w*.7),j:i,k:kz}],[']',{}]);return out}});
    for(const og of res.organs){
      if(og.t==='Sg'){const top=og.p.j===nt-1?yg:0,len=og.p.len*(1-.5*top)*R(.88,1.1);
        if(top>.55){l59Croz(og,len*.8,1.9,cols,cw.c,parts);continue}
        l59Pinna(og,{len,wr:.125,wp:L59_STW,nl:19,d:.9,lb:'linear',sl:.5,ar:.02,dr:.05,fo:.14+.5*top,fw:null},P,PB,lim,polys,det?4:3)}
      else if(og.t==='Bd'||og.t==='T')polys.push({bud:fgQ(og.pos),r:og.p.r||1.6,z:og.pos[2]+.03})}
    l59Axes(res,cols,parts,polys);
    l59Batch(polys,det?4:3,parts,{vc:mix(cw.c,'#e8f0c8',.4),vw:.6,eo:.4,ink:shd(cw.c,-.5),axc:cols[1],bc:'#7a5432'});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- uluhe (Dicranopteris linearis, false staghorn fern — Gleicheniaceae): a wiry rachis that forks again and again, zigzagging from fork to fork; in each fork a dormant bud, hairy,
   flanked by a pair of small reflexed accessory pinnae; the side branch forks once more into a pair of long pectinate pinnae (the fronds « in pairs »), cut to the axis into narrow linear
   segments, glaucous beneath. Sold as a line: fresh or preserved green, dried natural brown, or dyed (plum) ---------- */
const CW_L59DL=[{id:'vert',n:'Vert (stabilisé)',c:'#4c7a35',r:'#5a4630',b:'#aebca4'},{id:'prune',n:'Prune (teinte)',c:'#5e2f44',r:'#3e1c2c',b:'#7a4a5e'},{id:'brun',n:'Brun naturel (séché)',c:'#8a4a2a',r:'#5a3420',b:'#a8704a'}];
const L59_DLW=prof([[0,.6],[.1,.92],[.5,1],[.82,.82],[.95,.45],[1,.08]]);
function l59Dicr(g,t,o){const cw=fgCw(CW_L59DL,o),op=l59Op(o),cm0=45,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l59dl',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks,A0=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.2)),l0=A0.l0||0,Lv=A0.L-l0,yg=o.spine?0:Math.max(0,Math.min(1,(.9-op)/.75)),
      nf=Lv>Lt*.5?(rnd()<.5?3:4):2,fk=[];for(let i=0;i<nf;i++)fk.push(l0+Lv*(.26+.58*(i+.5)/nf)*R(.97,1.03));
    /* the zigzag: the rachis turns at each fork, away from the side branch (amplitude ramped in from the foot) */
    const amp=Math.min(1.1*UPC,Lv*.035),s0=rnd()<.5?-1:1,K=[[Math.max(l0,fk[0]-amp*6),0],...fk.map((x,i)=>[x,amp*(i%2?1:-1)*s0]),[A0.L,amp*(nf%2?1:-1)*s0*.6]],
      zz=l=>{if(l<=K[0][0])return 0;for(let i=1;i<K.length;i++)if(l<=K[i][0]){const t=(l-K[i-1][0])/((K[i][0]-K[i-1][0])||1);return K[i-1][1]+(K[i][1]-K[i-1][1])*t}return K[K.length-1][1]};
    const pts=l59Samp(A0,6).map(({l,q})=>V3.add(q.p,V3.sc(q.Sd,zz(l)))),A=l59Path(pts,A0,l0);
    const cols=l59Cols(cw.r),lim=g35Lim(o),P=pal7(cw.c),PB=pal7(mix(cw.c,cw.b,.35)),polys=[],parts=[],pl=Lt*.27*(.6+.4*(1-yg)),acc=Lt*.055;
    const rules={Fk:p=>[['Bd',{r:1.4}],['/',{a:R(-55,55)}],['[',{}],['+',{a:R(26,36)}],['&',{a:R(-12,12)}],['Sg',{len:p.l*R(.92,1.08),y:p.y}],[']',{}],['[',{}],['-',{a:R(26,36)}],['&',{a:R(-12,12)}],['Sg',{len:p.l*R(.92,1.08),y:p.y}],[']',{}]],
      T:()=>[['Fk',{l:pl*.85,y:yg}]]};
    const res=l44Main(A,fk,{w0:2.6*Math.min(1.1,.8+.2*ks),w1:1.5,cols,step:6,depth:5,rules,
      node:(i,u,w)=>{const s=(i%2?-1:1)*s0,out=[['Bd',{r:Math.max(1.3,w*.6)}]];
        for(const j of[-1,1])out.push(['[',{}],['+',{a:j*R(104,122)}],['&',{a:R(-18,18)}],['Sg',{len:acc*R(.85,1.15),acc:1}],[']',{}]);
        out.push(['[',{w:w*.78}],['+',{a:s*R(38,52)}],['&',{a:R(-34,34)}],['F',{l:Lt*R(.07,.1),w1:Math.max(1.2,w*.62),e:-.012}],['Fk',{l:pl*R(.85,1.05),y:yg*.6}],[']',{}]);return out}});
    for(const og of res.organs){
      if(og.t==='Sg'){const y=og.p.y||0,len=og.p.len*(1-.45*y);if(y>.55){l59Croz(og,len*.6,1.8,cols,cw.c,parts);continue}
        l59Pinna(og,{len,wr:og.p.acc?.17:.15,wp:L59_DLW,nl:og.p.acc?7:20,d:.92,lb:'linear',sl:.55,ar:.02,dr:og.p.acc?.12:.08,fo:.16+.5*y},P,PB,lim,polys,det?4:3)}
      else if(og.t==='Bd')polys.push({bud:fgQ(og.pos),r:og.p.r||1.4,z:og.pos[2]+.03})}
    l59Axes(res,cols,parts,polys);
    l59Batch(polys,det?4:3,parts,{vc:mix(cw.c,'#f0e8d0',.35),vw:.6,eo:.4,ink:shd(cw.c,-.5),axc:cols[1],bc:shd(cw.r,.15)});
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- winter horsetail, scouring rush (Equisetum hyemale): leafless evergreen stems, hollow, unbranched, 5 to 8 mm thick, finely ridged lengthwise (rough with silica), dark green;
   every 3 to 6 cm a node clasped by its sheath, as long as wide, appressed: ash-grey between two black bands, the upper band fringed with small dark teeth; the tip pointed, perhaps ending
   in a small pointed cone (strobilus), dark then yellowish brown. Sold straight in bunches, or creased by the florist into graphic angles ---------- */
const CW_L59EQ=[{id:'vert-sapin',n:'Vert sapin (naturel)',c:'#3a5a33'}];
/* the florist's crease is kept off: in the shop a creased stem reads as a broken one, so the rushes stand straight */
const L59_EQFOLD=false;
function l59Equi(g,t,o){const cw=fgCw(CW_L59EQ,o),op=l59Op(o),cm0=80,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g),det=DET>=1.5&&!LOD;
  return g35Run(o,'l59eq',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks,A0=fgAxis(o,Lt,R(-.025,.025)),l0=A0.l0||0,Le0=A0.L,w=4.2*(o.spine?1:Math.min(1.1,.85+.15*ks)),inter=R(3.6,4.6)*UPC;
    /* the nodes, from a node just under the foot; perhaps one of them creased: the stem above it turned by θ in the plane of the view (never past the horizontal) */
    const nodes=[];for(let x=inter*R(.2,.9);x<Le0-inter*.55;x+=inter*R(.9,1.1))if(x>l0+2)nodes.push(x);
    const smp=l59Samp(A0,5);let pts=smp.map(({q})=>q.p);const kc=nodes.filter(x=>x>l0+(Le0-l0)*.52&&x<l0+(Le0-l0)*.78),bend=L59_EQFOLD&&kc.length&&rnd()<.4;
    if(bend){const lk=kc[Math.floor(rnd()*kc.length)],ik=smp.findIndex(s=>s.l>=lk),q=smp[ik].q,P0=q.p,ax=q.Fr,T=q.T,up=A0.up||[0,1,0],side=ax[2]>=0?1:-1,
        sg=(T[0]>.08?-1:T[0]<-.08?1:rnd()<.5?-1:1)*side,ang0=Math.acos(Math.max(-1,Math.min(1,V3.dot(T,up)))),th=Math.min(R(38,68)*D,Math.max(.3,95*D-ang0));nodes[nodes.indexOf(lk)]=smp[ik].l;
      pts=pts.map((p,i)=>i<=ik?p:V3.add(P0,rotA(V3s(p,P0),ax,sg*th)))}
    const A=l59Path(pts,A0,l0),Le=A.L,cols=l59Cols(cw.c),cone=op>.3&&(o.spine?rnd()<.5:true),parts=[];
    const res=l44Main(A,nodes.filter(x=>x<Le-inter*.4),{w0:w,w1:w*.92,cols,step:5,depth:2,end:Le-(cone?0:inter*.12),node:()=>[['Nd',{}]]});
    const c0=res.chains[0];c0.ws=c0.ws.map((x,i)=>{const l=i/(c0.ws.length-1);return l>.96?x*(1-.25*(l-.96)/.04):x});
    lsChainParts([c0],[0,0,0],cols,parts,{piece:DET>=1.5?10:16});
    /* the sheaths: an ash-grey collar between two black rings, its rims curved as a ring seen a little from above; the ridges as fine dark lines */
    let dg='',dk='',dr='',zm=-1e9;const sh=w*1.05,hw=w*.56;
    const band=(p,T,a,b,h0)=>{const Ts=[T[0],-T[1]],tl=Math.hypot(Ts[0],Ts[1])||1,tx=Ts[0]/tl,ty=Ts[1]/tl,nx=-ty,ny=tx,bu=h0*Math.max(.18,Math.min(.5,Math.abs(T[2])+.15)),c=fgQ(p),
        P=(u,v)=>[c[0]+nx*u*hw+tx*v,c[1]+ny*u*hw+ty*v];const A1=P(-1,a),B1=P(1,a),A2=P(-1,b),B2=P(1,b),M1=P(0,a-bu*1.6),M2=P(0,b-bu*1.6);
      return`M${f(A1[0])},${f(A1[1])}Q${f(M1[0])},${f(M1[1])} ${f(B1[0])},${f(B1[1])}L${f(B2[0])},${f(B2[1])}Q${f(M2[0])},${f(M2[1])} ${f(A2[0])},${f(A2[1])}Z`};
    for(const og of res.organs){if(og.t!=='Nd')continue;const p=og.pos,T=V3.nz(og.H);zm=Math.max(zm,p[2]);dg+=band(p,T,0,sh,hw);dk+=band(p,T,-.2,sh*.2,hw)+band(p,T,sh*.74,sh,hw);
      if(det){const Ts=fgQ(T),tl=Math.hypot(Ts[0],Ts[1])||1,tx=Ts[0]/tl,ty=Ts[1]/tl,c=fgQ(p);let d='M';for(let j=0;j<=8;j++){const u=-1+j/4,v=sh+(j%2?w*.28:0);d+=(j?'L':'')+f(c[0]-ty*u*hw*.98+tx*v)+','+f(c[1]+tx*u*hw*.98+ty*v)}dk+=d}}
    if(det){const P=c0.pts;for(let i=0;i<P.length-1;i++){const a=fgQ(P[i]),b=fgQ(P[i+1]),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
      for(const u of[-.62,-.2,.25]){const o1=u*c0.ws[i]/2,o2=u*c0.ws[i+1]/2;dr+=`M${f(a[0]+nx*o1)},${f(a[1]+ny*o1)}L${f(b[0]+nx*o2)},${f(b[1]+ny*o2)}`}}}
    const T=res.organs.find(q=>q.t==='T'),zz=Math.max(zm,c0.pts.reduce((a,p)=>Math.max(a,p[2]),-1e9))+.05;
    parts.push({z:zz,cast:false,fn:par=>{if(dr)E('path',{d:dr,stroke:shd(cw.c,-.35),'stroke-width':.4,'stroke-opacity':.45,fill:'none'},par);
      if(dg)E('path',{d:dg,fill:'#a8a69a',stroke:'#6e6c62','stroke-width':.25},par);if(dk)E('path',{d:dk,fill:'#141412',stroke:'#141412','stroke-width':.3,'stroke-linejoin':'round'},par)}});
    /* the tip: a small pointed cone of shield-like scales, or the bare pointed apex */
    if(T){const H=V3.nz(T.H),cl=cone?(1.2+.6*op)*UPC:w*1.2,cw2=cone?w*.62:w*.42,cc=cone?(op<.75?'#2a2a20':'#8a6a3a'):cols[1],seg=[];
      for(let i=0;i<=10;i++){const v=i/10,r=cw2*(cone?Math.sin(Math.PI*Math.min(1,v*1.1))**.6*(1-.2*v):1-v);seg.push([v,r])}
      const Hs=fgQ(H),hl=Math.hypot(Hs[0],Hs[1])||1,hx=Hs[0]/hl,hy=Hs[1]/hl,c=fgQ(T.pos),Lp=seg.map(([v,r])=>[c[0]+hx*v*cl-hy*r,c[1]+hy*v*cl+hx*r]),Rp=seg.map(([v,r])=>[c[0]+hx*v*cl+hy*r,c[1]+hy*v*cl-hx*r]).reverse();
      let sc='';if(cone&&det)for(let i=1;i<5;i++){const v=i/5,r=cw2*.9;sc+=`M${f(c[0]+hx*v*cl-hy*r)},${f(c[1]+hy*v*cl+hx*r)}L${f(c[0]+hx*v*cl+hy*r)},${f(c[1]+hy*v*cl-hx*r)}`}
      parts.push({z:zz+.01,cast:false,fn:par=>{E('path',{d:'M'+Lp.concat(Rp).map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:cc,stroke:shd(cc,-.45),'stroke-width':.35},par);if(sc)E('path',{d:sc,stroke:shd(cc,-.4),'stroke-width':.35,fill:'none'},par)}})}
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- registries: drawers, colourways, trade grades (the frond, the stem), and how the composer treats them: the three fronds as foliage at their natural length,
   the uluhe and the horsetail as lines (the horsetail stiff) ---------- */
Object.assign(GH,{'sticherus-umbrella-fern':l59Stich,'thelypteris-kunthii-helecho':l59Thel,'woodwardia-fimbriata':l59Wood,'dicranopteris-uluhe':l59Dicr,'equisetum-preles':l59Equi});
Object.assign(CWS,{'sticherus-umbrella-fern':CW_L59ST,'thelypteris-kunthii-helecho':CW_L59TK,'woodwardia-fimbriata':CW_L59WF,'dicranopteris-uluhe':CW_L59DL,'equisetum-preles':CW_L59EQ});
Object.assign(SZG,{'sticherus-umbrella-fern':[15,20,20,25],'thelypteris-kunthii-helecho':[50,60,60,70],'woodwardia-fimbriata':[80,100,100,120],'dicranopteris-uluhe':[35,45,45,60],'equisetum-preles':[60,80,80,100]});
const L59_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'sticherus-umbrella-fern':L59_I(60,{fx:30}),'thelypteris-kunthii-helecho':L59_I(60,{fx:26}),'woodwardia-fimbriata':L59_I(100,{fx:34}),
  'dicranopteris-uluhe':L59_I(45,{form:'ligne',size:1,tip:.8,fx:4*UPC}),'equisetum-preles':L59_I(80,{form:'ligne',size:1,tip:1,fx:1.5*UPC})});
