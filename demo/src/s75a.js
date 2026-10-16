/* ================= Serre, lot 75 — feuillages tropicaux 3 : monstera, philodendron selloum, philodendron Xanadu, alocasia, feuilles d'anthurium ================= */
/* chaque feuille est une nappe 3D au bout de son pétiole, poussé par le L-système (l38Plant du lot 38, fgGrow du lot 24) ; les feuilles découpées (monstera, selloum, Xanadu)
   sont tendues en deux moitiés dont les rangées suivent les nervures latérales : chaque découpe part de la marge le long d'une nervure, les fenêtres du monstera sont de vrais
   trous (clip-path) ; l'alocasia et l'anthurium reprennent le limbe en cœur du lot 38 (l38Blade) avec leurs nervures peintes */

/* ---------- shared: the leaf's plane bent in 3D (l38M), lifted off its plane by dz (in blade lengths) to wave the lobes ---------- */
function l75M(og,len,o){const M=l38M(og,len,o),e=.004;
  return(x,y,dz)=>{const p=M(x,y);if(!dz)return p;const a=V3s(M(x+e,y),M(x-e,y)),b=V3s(M(x,y+e),M(x,y-e));let n=V3.cr(a,b);const l=V3l(n);if(l<1e-9)return p;return V3.add(p,V3.sc(n,dz*len/l))}}
/* a cut blade c: its outline sp {lb, out(y, s)} (half width at y, in blade lengths; lb how far the basal lobes reach back), its veins rising by rise toward the tip and bowed (bow);
   the rows of a half run along those veins, from the midrib (or the petiole, for the basal lobes) to the margin. Cuts per side: c.sl[s] = [{v, d, w, p}] (v the row of the cut at
   the margin, d how far in it stops, as a share of the row; w its half width in rows, g0 that of its rounded end; p its flare), so a row keeps r ∈ [0, rm(v)] */
const l75Si=s=>s<0?0:1;
function l75Row(c,s,v,r){const sp=c.sp,lb=sp.lb,yb=-lb+v*(1+lb),xb=s*sp.out(yb,s),ya=Math.max(0,yb-c.rise*Math.pow(1-Math.max(0,yb),.55)),dx=xb,dy=yb-ya,l=Math.hypot(dx,dy)||1e-6;
  let nx=-dy/l,ny=dx/l;if(nx*-s+ny*-1<0){nx=-nx;ny=-ny}const bw=(yb<0?c.bowL??c.bow:c.bow)*l*Math.sin(Math.PI*r);return[r*dx+nx*bw,ya+r*dy+ny*bw]}
function l75Rm(c,s,v){let m=1;for(const q of c.sl[l75Si(s)]){const g0=q.g0||0,x=(Math.abs(v-q.v)-g0)/(q.w-g0);if(x<1)m=Math.min(m,q.d+(1-q.d)*Math.pow(Math.max(0,x),q.p))}return c.wav?m*c.wav(v,s):m}
/* evenly spread cuts between rows v0 and v1 (n of them), depth d ± dj, half width w (g0 at its end), flare p; the ribs run between them */
function l75Cuts(n,v0,v1,d,dj,w,p,g0=0){const out=[];for(let i=0;i<n;i++){const t=n>1?i/(n-1):.5,k=R(.85,1.15);out.push({v:v0+(v1-v0)*t+R(-.25,.25)*(v1-v0)/Math.max(1,n),d:Math.max(.06,d+R(-dj,dj)),w:w*k,g0:g0*k,p})}return out.sort((a,b)=>a.v-b.v)}
/* the ribs of a half: one along each lobe, midway between two cuts (and below the first one) */
const l75Ribs=(sl,v1)=>{const out=[];for(let i=0;i<sl.length;i++){const a=i?sl[i-1].v:Math.max(.02,sl[0].v-.6*(sl[1]?sl[1].v-sl[0].v:.1));out.push((a+sl[i].v)/2)}if(sl.length)out.push((sl[sl.length-1].v+(v1??.97))/2);return out};
/* the marks of a cut half, painted on each band of rows: holes clipped out of the band (the sheet behind shows through), patches, the midrib and the ribs */
function l75CutPaint(g,front,cx,c,s,T,L,pal,o,gc){const nv=cx.scr.length-1,a=cx.i0/nv-1e-6,b=cx.i1/nv+1e-6,Q=(r,v)=>{const p=T(r,v);return[p[0],-p[1]]},si=l75Si(s);
  /* the fenestrations: the band loses them (evenodd clip), their cut edge drawn round them */
  const H=(c.ho||[[],[]])[si];if(H.length){let d='',rim='';for(const h of H){if(h.v+h.b<a||h.v-h.b>b)continue;const P=[];for(let i=0;i<14;i++){const t=i/14*6.283;P.push(Q(h.r+h.a*Math.cos(t),Math.max(a,Math.min(b,h.v+h.b*Math.sin(t)))))}
      const sd=smooth(P);d+=sd;if(h.v>=a&&h.v<=b)rim+=sd}
    if(d){const id='l75h'+(gid++);E('path',{d:'M-99999,-99999H99999V99999H-99999Z'+d,'clip-rule':'evenodd'},E('clipPath',{id},GDEF||defs));g.setAttribute('clip-path',`url(#${id})`)}
    if(rim)E('path',{d:rim,fill:'none',stroke:pal.ink,'stroke-width':1.1,'stroke-opacity':.42},g)}
  if(LOD)return;
  /* patches in (share of the row, row): the cream of the variegated forms, clipped to the band (gc) so that no speck overhangs a cut */
  if(front&&o.patch){const g=gc();let d='';for(const P0 of o.patch){let lo=1,hi=0;for(const q of P0){lo=Math.min(lo,q[1]);hi=Math.max(hi,q[1])}if(hi<a||lo>b)continue;
      d+=smooth(P0.map(([f0,v])=>{const vv=Math.max(a,Math.min(b,v));return Q(f0*l75Rm(c,s,vv),vv)}))}if(d)E('path',{d,fill:o.pc,opacity:.95},g)}
  if(front&&o.dots){const g=gc();let d='';for(const[f0,v,rr]of o.dots[si]){if(v<a||v>b)continue;const q=Q(f0*l75Rm(c,s,v),v),r0=Math.max(.6,rr*L);d+=`M${f(q[0]-r0)},${f(q[1])}a${f(r0)},${f(r0)} 0 1,0 ${f(r0*2)},0a${f(r0)},${f(r0)} 0 1,0 ${f(-r0*2)},0`}if(d)E('path',{d,fill:o.pc,opacity:.9},g)}
  /* the midrib (each half draws its side of it) and the ribs, a broad pale stroke under a finer one */
  const lines=[],mv0=c.mv0||0;{const P=[];for(let i=0;i<=24;i++){const v=mv0+(1-mv0)*i/24;if(v>=a&&v<=b)P.push(Q(0,v))}if(P.length>1)lines.push([P,1])}
  for(const v of c.ribs[si]){if(v<a||v>b)continue;const m=l75Rm(c,s,v),P=[];for(let i=0;i<=8;i++)P.push(Q(m*.97*i/8,v));lines.push([P,0])}
  const cm=front?o.vc:o.vcB,w0=Math.max(1.4,L*o.mw),w1=Math.max(1.1,L*o.rw);let d0='',d1='';for(const[P,m]of lines){const d=smooth(P,false);if(m)d0+=d;else d1+=d}
  if(d0){E('path',{d:d0,stroke:cm,'stroke-width':f(w0*1.7),'stroke-opacity':.35,fill:'none','stroke-linecap':'round'},g);E('path',{d:d0,stroke:cm,'stroke-width':f(w0),'stroke-opacity':.9,fill:'none','stroke-linecap':'round'},g)}
  if(d1)E('path',{d:d1,stroke:cm,'stroke-width':f(w1),'stroke-opacity':front?.72:.85,fill:'none','stroke-linecap':'round'},g)}
/* the cut blade: two halves as sheets (face and underside palettes), gloss on the face; in a bouquet (o.lim) it shrinks until its whole margin stays above the vessel's mouth */
function l75CutBlade(og,len,col,colB,c,o,parts){const L0=len;let M=l75M(og,len,o);
  if(o.lim!=null)for(const k of[1,.85,.72,.6,.5,.42]){len=L0*k;M=l75M(og,len,o);let lo=1e9;for(const s of[-1,1])for(let i=0;i<=48;i++){const v=i/48,r=l75Rm(c,s,v),q=l75Row(c,s,v,r);lo=Math.min(lo,M(q[0],q[1],c.dz?c.dz(r,v,s):0)[1])}if(lo>=o.lim)break}
  const P=pal7(col),PB=pal7(colB),F={k:null,B:I3,O:[0,0,0],parts:[]};
  /* the midrib starts where the first row leaves it (below, the rows fan out of the petiole into the basal lobes) */
  {let lo=0,hi=1;for(let i=0;i<30;i++){const m=(lo+hi)/2;if(l75Row(c,1,m,0)[1]>1e-4)hi=m;else lo=m}c.mv0=hi}
  /* the gloss is laid on the tissue that a cut never reaches within the reach of a highlight (rmn: the row's shortest neighbour), and clipped to the band, so that no glint spills over a cut */
  const Gl=o.gl?{shin:o.shin||26,k:o.gl,thr:.2,cu:DET>=1.5?3:2,cv:DET>=1.5?7:4,nu:8,nv:24,lv:.7,lu:1.5,o:.5}:null;
  for(const s of[-1,1]){const T=(r,v)=>{const q=l75Row(c,s,v,r);return M(q[0],q[1],c.dz?c.dz(r,v,s):0)},S=(u,v)=>T((s>0?(u+1)/2:(1-u)/2)*l75Rm(c,s,v),v),
      rmn=v=>{let m=1;for(let i=-4;i<=4;i++)m=Math.min(m,l75Rm(c,s,Math.max(0,Math.min(1,v+i*.01))));return m},Sg=(u,v)=>T((s>0?(u+1)/2:(1-u)/2)*rmn(v),v);
    parts.push(...sheet3(F,S,{pal:P,palB:PB,nu:o.nu||5,nv:o.nv||60,across:o.across??1,ew:.5,eo:.42,cast:0,zb:o.zb,
      paint:(g,front,cx)=>{let id=null;const gc=()=>{if(!id){id='l75g'+(gid++);E('path',{d:cx.d},E('clipPath',{id},GDEF||defs))}return G(g,{'clip-path':`url(#${id})`})};
        l75CutPaint(g,front,cx,c,s,T,len,front?P:PB,o,gc);if(!LOD&&front&&o.gl)gloss3(gc(),F,Sg,Gl,cx.i0/(cx.scr.length-1),cx.i1/(cx.scr.length-1))}}).map(p=>l75Thin(p)))}
  return M}
/* a cut blade needs many rows, and sheet3 lays one gradient stop per row along each band: once drawn, the band's gradient keeps a dozen of them (the light along it is smooth) */
function l75Thin(p,n=12){const fn=p.fn;p.fn=par=>{const k=par.childNodes.length;fn(par);const g=par.childNodes[k];if(!g||!g.querySelector)return;
  for(const e of g.querySelectorAll('path[fill^="url(#q"]')){const id=e.getAttribute('fill').slice(5,-1),gr=document.getElementById(id);if(!gr)continue;const st=[...gr.children];if(st.length<=n)continue;
    st.forEach((x,i)=>{if(i&&i<st.length-1&&Math.round(i*(n-1)/(st.length-1))===Math.round((i-1)*(n-1)/(st.length-1)))x.remove()})}};return p}
const l75Cols=c=>[shd(c,-.6),shd(c,-.25),c,shd(c,.4)];

/* ---------- Swiss cheese plant (Monstera deliciosa): a huge, thick, very glossy, dark green blade, broadly cordate, as wide as long, on a long petiole sheathed below and
   ending in a geniculum; the adult leaf is cut pinnatifidly from the margin along the lateral veins, deeper below the middle, and pierced near the midrib by rows of oval
   fenestrations between the veins; the young leaf unrolls, already cut. Sold dark green, deep green, or variegated ('Albo Borsigiana' cut with white sectors,
   'Thai Constellation' speckled with cream) ---------- */
const CW_L75MO=[{id:'vert-fonce',n:'Vert foncé brillant',c:'#22472a',b:'#5f7f4c'},{id:'vert-profond',n:'Vert profond',c:'#1e3a24',b:'#56724a'},
  {id:'albo',n:'Panachée blanc (Albo Variegata)',c:'#d9ddc6',g:'#22472a',b:'#7a9268',var:'albo',pc:'#eef0e2'},{id:'thai',n:'Constellation crème (Thai Constellation)',c:'#8a9a6e',g:'#2a4c2c',b:'#7a9268',var:'thai',pc:'#e6e2bc'}];
const L75_MOP=prof([[0,.42],[.05,.74],[.14,.94],[.28,1],[.48,.95],[.66,.8],[.82,.54],[.93,.24],[1,0]]);
function l75MoCut(young){const sp={lb:.18,out:(y)=>.5*L75_MOP((y+.18)/1.18)},c={sp,rise:.18,bow:.06,bowL:.1,sl:[],ho:[],ribs:[]};
  for(const s of[-1,1]){const n=young?0:Math.round(R(5,7)),sl=n?l75Cuts(n,.15,.74,.42,.12,.011,1.05):[];
    /* deeper below the middle, shallower toward the tip */
    for(const q of sl)q.d=Math.min(.75,q.d+(.45-q.v)*.4);c.sl.push(sl);c.ribs.push(n?l75Ribs(sl,.9):[.2,.4,.6,.78]);
    const ho=[];if(!young){for(const q of sl){const r0=q.d*R(.32,.5);ho.push({v:q.v,r:r0,a:q.d*R(.13,.18),b:.013+.005*rnd()});if(q.d>.55&&rnd()<.6)ho.push({v:q.v+R(-.003,.003),r:q.d*.82,a:q.d*.08,b:.009})}
      /* above the last cut the gaps between the ribs keep only their fenestrations */
      const vl=sl[sl.length-1].v;for(const v of[vl+(.9-vl)*.4,vl+(.9-vl)*.75])ho.push({v,r:.22,a:.08,b:.01})}
    c.ho.push(ho)}
  return c}
/* the white sectors of 'Albo' (as shares of the row, rows) and the cream speckles of 'Thai Constellation' */
function l75MoVar(cw){if(cw.var==='albo'){const out=[];for(let k=0;k<3;k++){const v0=R(.08,.8),dv=R(.04,.14),f0=rnd()<.5?0:R(.2,.5),P=[];for(let i=0;i<=6;i++)P.push([f0+.03*Math.sin(i*2.3),v0+dv*i/6]);for(let i=6;i>=0;i--)P.push([1.02,v0+dv*i/6+.01*Math.sin(i*1.7)]);out.push(P)}return{patch:out}}
  if(cw.var==='thai'){const d=[[],[]];let x=rnd();for(let i=0;i<90;i++){x=(x*9301+.4927)%1;d[i%2].push([.06+.9*((i*.618)%1),.05+.9*x,.006+.008*((x*7)%1)])}return{dots:d}}return{}}
function l75Mons(g,t,o){const cw=fgCw(CW_L75MO,o),base=cw.g||cw.c;
  return l38Plant(g,t,o,{cm0:40,pet:60,pc:mix(base,'#6a8a4a',.4),w0:6.4,w1:5,arch:R(-.12,.12),face:.75,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg),c=l75MoCut(yg>.6),gl=V3.add(og.pos,V3.sc(og.H,L*.05)),v=l75MoVar(cw);
    /* the geniculum: a swollen, paler joint at the top of the petiole */
    l38Pet(og.pos,gl,og.w*1.2,og.w*1.3,l38Cols(mix(cols[2],'#b8c08a',.3)),parts);
    l75CutBlade(Object.assign({},og,{pos:gl}),L,base,cw.b,c,{lim:og.lim,th0:-.3+.4*yg,ka:.55,lean:R(-.2,.2),droop:.1,fold:.12+(yg>.6?0:1.4*yg),cup:.06,tw:(rnd()<.5?-1:1)*R(.35,.6),roll:yg>.6?yg*1.9:0,W:.45,nv:64,nu:5,
      gl:.95,shin:30,mw:.012,rw:.0055,vc:mix(base,'#c8d4a0',.42),vcB:mix(cw.b,'#e0e4c8',.4),pc:cw.pc,...v},parts)}})}

/* ---------- lacy tree philodendron (Thaumatophyllum bipinnatifidum, syn. Philodendron selloum): a very large, thick, glossy blade, ovate-sagittate, cut almost to the
   broad pale midrib into 9 to 14 pairs of lobes, the lobes themselves waved and lobed again (bipinnatifid), the basal lobes too; on a long, stout, pale petiole ---------- */
const CW_L75SE=[{id:'selloum',n:'Vert foncé luisant (Selloum)',c:'#23462a',b:'#5a7a48'},{id:'pinnatifidum',n:'Vert franc (Pinnatifidum)',c:'#4c7a35',b:'#7a9a5e'},{id:'hope',n:'Vert sombre ondulé (Hope)',c:'#2a4a2a',b:'#5e7a4a',hope:1}];
const L75_SEP=prof([[0,.62],[.06,.86],[.16,1],[.34,.96],[.56,.8],[.76,.52],[.9,.24],[1,0]]);
function l75SeCut(young,hope){const sp={lb:.28,out:(y)=>.47*L75_SEP((y+.28)/1.28)},c={sp,rise:.24,bow:.06,bowL:.08,sl:[],ribs:[]};
  for(const s of[-1,1]){const n=young?6:Math.round(R(9,11)),sl=l75Cuts(n,.09,.86,young?.5:.16,.04,young?.014:.021,.5,young?0:.008);c.sl.push(sl);c.ribs.push(l75Ribs(sl,.95))}
  /* the lobes lobed again: their margin notched between the side veins, more on the big lower lobes */
  c.wav=(v,s)=>{const sl=c.sl[l75Si(s)];let k=1;for(let i=0;i<=sl.length;i++){const a=i?sl[i-1].v:0,b=i<sl.length?sl[i].v:1;if(v>=a&&v<b){const x=(v-a)/(b-a),n=v<.5?3:2;k=1-(young?0:hope?.1:.07)*Math.pow(Math.abs(Math.sin(Math.PI*x*n)),.6)*(1-.5*v)}}return k};
  /* waved lobes: each lifts and drops along its margin */
  c.dz=(r,v,s)=>(young?0:hope?.05:.032)*r*r*Math.sin(v*70+s*1.3);return c}
function l75Sell(g,t,o){const cw=fgCw(CW_L75SE,o);
  return l38Plant(g,t,o,{cm0:55,pet:70,pc:'#8aa65a',w0:6.8,w1:5.4,arch:R(-.1,.1),face:.75,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg),c=l75SeCut(yg>.6,cw.hope);
    l75CutBlade(og,L,cw.c,cw.b,c,{lim:og.lim,th0:-.26+.4*yg,ka:.5,lean:R(-.2,.2),droop:.12,fold:.16+(yg>.6?0:1.4*yg),cup:.04,tw:(rnd()<.5?-1:1)*R(.3,.55),roll:yg>.6?yg*1.9:0,W:.4,nv:80,nu:5,
      gl:.8,shin:26,mw:.016,rw:.006,vc:mix(cw.c,'#d8dcae',.5),vcB:mix(cw.b,'#e8e8cc',.45)},parts)}})}

/* ---------- Xanadu philodendron (Thaumatophyllum xanadu, 'Winterbourn'): smaller and more compact, the blade ovate-sagittate, cut regularly into 15 to 20 narrow, stiff
   lobes with straight margins, pointing forward; dark green, rather matt, sometimes bronze-coppery; the leaves held upright on firm petioles ---------- */
const CW_L75XA=[{id:'xanadu',n:'Vert foncé (Xanadu)',c:'#2a4a2a',b:'#5e7c4a'},{id:'winterbourn',n:'Vert foncé (Winterbourn)',c:'#2e522c',b:'#648250'},{id:'cuivre',n:'Reflets bronze cuivré',c:'#6b5a34',g:'#3a4a2a',b:'#7a7a50',br:'#8a6a3a'}];
const L75_XAP=prof([[0,.56],[.08,.86],[.22,1],[.44,.94],[.66,.74],[.84,.44],[.95,.14],[1,0]]);
function l75XaCut(young){const sp={lb:.2,out:(y)=>.4*L75_XAP((y+.2)/1.2)},c={sp,rise:.38,bow:.03,bowL:.05,sl:[],ribs:[]};
  for(const s of[-1,1]){const n=young?5:Math.round(R(7,9)),sl=l75Cuts(n,.07,.84,young?.55:.28,.05,young?.012:.02,1.15);c.sl.push(sl);c.ribs.push(l75Ribs(sl,.95))}return c}
function l75Xana(g,t,o){const cw=fgCw(CW_L75XA,o),base=cw.g||cw.c;
  return l38Plant(g,t,o,{cm0:30,pet:42,pc:'#6a8a44',w0:4.4,w1:3.4,arch:R(-.06,.06),wig:.008,face:.8,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg),c=l75XaCut(yg>.6),col=cw.br?mix(base,cw.br,.35):base;
    l75CutBlade(og,L,col,cw.b,c,{lim:og.lim,th0:-.06+.3*yg,ka:.35,lean:R(-.15,.15),droop:.05,fold:.2+(yg>.6?0:1.4*yg),cup:.02,tw:(rnd()<.5?-1:1)*R(.25,.45),roll:yg>.6?yg*1.9:0,W:.36,nv:60,nu:5,
      gl:.35,shin:18,mw:.014,rw:.0055,vc:mix(col,'#c8cc98',.42),vcB:mix(cw.b,'#e0e0c4',.4)},parts)}})}

/* ---------- elephant's ear (Alocasia): a sagittate blade, the two basal lobes reaching far back, joined round the petiole in the peltate forms; held out or hanging from the
   top of a long petiole. A. × amazonica 'Polly': almost black-green and glossy, the midrib, the primary veins and a collective vein near the margin ivory white, the margin
   scalloped between the veins; 'Frydek' (A. micholitziana): velvety matt green, veins white; A. odora and macrorrhizos: plain bright green, the veins barely paler ---------- */
const CW_L75AL=[{id:'polly',n:'Vert noir, nervures ivoire (Polly)',c:'#1e3322',v:'#e8e6cc',b:'#5a4650',sc:.07,pel:1,gl:.9},{id:'amazonica',n:'Vert noir, nervures blanches (Amazonica)',c:'#1a2c1e',v:'#eceadc',b:'#4e3a46',sc:.1,gl:.9},
  {id:'frydek',n:'Vert velours, nervures blanches (Frydek)',c:'#2a4a2a',v:'#dfe4d0',b:'#7a8a6a',sc:.02,gl:.12},{id:'odora',n:'Vert vif uni (odora)',c:'#4b7a34',v:'#8aa86a',b:'#86a06a',sc:.015,gl:.5,big:1},
  {id:'bronze',n:'Vert bronze (Black Velvet)',c:'#4b5532',v:'#c4c4a0',b:'#6a4a4a',sc:.03,gl:.3,pel:1},{id:'variegata',n:'Panachée crème (Variegata)',c:'#c9cba2',g:'#3e6a30',v:'#a8bc88',b:'#9aaa7c',sc:.015,gl:.5,big:1,var:'#ecebd0'}];
const L75_ALP=prof([[0,.12],[.07,.5],[.18,.82],[.3,.98],[.38,1],[.52,.86],[.7,.58],[.86,.3],[.96,.08],[1,0]]);
/* the primary veins end at the margin's points (y of their ends), the scallops sag between them */
const L75_ALV=[-.36,-.18,.08,.26,.44,.62,.8];
function l75AlSp(cw){const lb=cw.big?.36:.44,W=cw.big?.42:.36,xl=W*L75_ALP(0),E2=L75_ALV.map(y=>Math.max(-lb+.02,y*(cw.big?.85:1)));
  const sc=y=>{if(!cw.sc)return 1;for(let i=0;i<E2.length-1;i++)if(y>=E2[i]&&y<E2[i+1]){const x=(y-E2[i])/(E2[i+1]-E2[i]);return 1-cw.sc*Math.pow(Math.sin(Math.PI*x),.7)}return 1};
  return{lb,E:E2,out:(y)=>W*L75_ALP((y+lb)/(1+lb))*sc(y),inn:cw.pel?(y)=>xl*Math.max(0,(-y-lb*.72)/(lb*.28)):(y)=>xl*Math.pow(-y/lb,1.7)}}
function l75AlMarks(sp,cw,L){const V=[[[0,-.02],[0,.5],[0,.985]]],w=Math.max(1.2,L*.009);
  for(const s of[-1,1]){for(const y1 of sp.E){const y0=y1<0?0:Math.max(0,y1-.2);V.push(l38Vein(sp,s,y0,y1,.95,6))}}
  /* the cream sectors of the variegated form run out from the midrib between two veins, widening to the margin */
  const out=[];if(cw.var)for(const s of[-1,1])for(let k=0;k<2;k++){const y0=R(.02,.6),dy=R(.1,.22),P=[[0,y0],[s*.06,y0+.03]];for(let i=0;i<=5;i++){const y=Math.min(.95,y0+.16+dy*i/5);P.push([s*sp.out(y,s)*1.05,y])}P.push([s*.05,y0+.1],[0,y0+.06]);out.push({p:P,c:cw.var,o:.92})}
  /* the collective vein, just inside the margin, and the veins: a broad faint halo under the white line on the dark forms */
  for(const s of[-1,1])V.push(l38Ring(sp,s,.9,24));
  if(cw.sc>.05)out.push(...V.map(l=>({l,w:f(w*2.6),c:cw.v,o:.25})));out.push(...V.map((l,i)=>({l,w:f(i?w:w*1.6),c:cw.v,o:.95})));return out}
function l75Aloc(g,t,o){const cw=fgCw(CW_L75AL,o),base=cw.g||cw.c,sp=l75AlSp(cw);
  return l38Plant(g,t,o,{cm0:35,pet:50,pc:cw.big?'#7a9a54':'#6a6a48',w0:4,w1:3,arch:R(-.14,.14),face:.7,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg);
    l38Blade(og,L,base,cw.b,sp,{lim:og.lim,th0:-.42+.6*yg,ka:.6,lean:R(-.2,.2),droop:.12,fold:.2+(yg>.6?0:1.8*yg),cup:.08,tw:(rnd()<.5?-1:1)*R(.4,.7),wave:cw.sc?.01:.03,nw:5,roll:yg>.6?yg*1.9:0,nv:30,across:.8,W:.4,gl:cw.gl,shin:cw.gl>.6?30:16,
      marks:l75AlMarks(sp,cw,L),marksB:[[[0,0],[0,.5],[0,.98]],...[-1,1].flatMap(s=>sp.E.map(y1=>l38Vein(sp,s,y1<0?0:Math.max(0,y1-.2),y1,.9,4)))].map(l=>({l,w:Math.max(1.2,L*.01),c:shd(cw.b,.3),o:.85}))},parts)}})}

/* ---------- anthurium leaves (Anthurium andraeanum and hybrids; 'Jungle King', A. plowmanii type): a cordate to sagittate blade, longer than wide, with a deep basal sinus
   and a drawn-out tip, thick and very glossy, deep green; the midrib raised, the lateral veins arching toward the tip and joined by a collective vein near the margin;
   it hangs from a geniculum at the top of a long slender petiole; the young leaf unrolls bronze ---------- */
const CW_L75AF=[{id:'andreanum',n:'Vert foncé brillant (Andreanum)',c:'#1f4224',b:'#5e7e4c'},{id:'vert-franc',n:'Vert franc',c:'#4c7a35',b:'#82a062'},
  {id:'jungle-king',n:'Vert foncé, feuille longue ondulée (Jungle King)',c:'#24432a',b:'#5a7a4a',jk:1},{id:'jeune-bronze',n:'Jeune feuille bronze',c:'#5a4a2a',b:'#8a7a52'}];
const L75_AFP=prof([[0,.36],[.06,.66],[.16,.94],[.28,1],[.46,.88],[.66,.62],[.82,.36],[.93,.12],[1,0]]),L75_AJK=prof([[0,.3],[.06,.6],[.14,.9],[.24,1],[.42,.86],[.62,.6],[.8,.34],[.93,.12],[1,0]]);
const l75AfSp=(jk)=>{const lb=jk?.22:.3,W=jk?.24:.33,pr=jk?L75_AJK:L75_AFP,xl=W*pr(0);return{lb,out:(y)=>W*pr((y+lb)/(1+lb)),inn:(y)=>xl*Math.pow(-y/lb,2.2)}};
function l75AfMarks(sp,cw,L){const w=Math.max(1.1,L*.006),V=[];
  for(const s of[-1,1]){V.push(l38Vein(sp,s,0,.9,.55,10),l38Vein(sp,s,0,-.2,.6,6),l38Vein(sp,s,0,-.1,.85,6));for(const y0 of[.16,.32,.48,.64])V.push(l38Vein(sp,s,y0,y0+.26,.82,6))}
  const C=[-1,1].map(s=>l38Ring(sp,s,.92,24));
  return[...V.map(l=>({l,w:f(w),c:shd(cw.c,.36),o:.75})),...C.map(l=>({l,w:f(w),c:shd(cw.c,.3),o:.6})),{l:[[0,0],[0,.5],[0,.985]],w:f(Math.max(1.5,L*.013)),c:mix(cw.c,'#b8c890',.4),o:.9}]}
function l75AnFe(g,t,o){const cw=fgCw(CW_L75AF,o),sp=l75AfSp(cw.jk);
  return l38Plant(g,t,o,{cm0:30,pet:50,pc:mix(cw.c,'#7a9a54',.5),w0:3.2,w1:2.5,arch:R(-.14,.14),face:.72,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg)*(cw.jk?1.12:1),col=yg>0?mix(cw.c,'#7a5a34',yg*.7):cw.c,
    gl=V3.add(og.pos,V3.sc(og.H,L*.06));
    l38Pet(og.pos,gl,og.w*1.2,og.w*1.35,l38Cols(mix(cols[2],'#c0c890',.25)),parts);
    l38Blade(Object.assign({},og,{pos:gl}),L,col,cw.b,sp,{lim:og.lim,th0:-.3+.4*yg,ka:.75,lean:R(-.25,.25),droop:.1,fold:.24+(yg>.6?0:1.8*yg),cup:.1,tw:(rnd()<.5?-1:1)*R(.45,.75),wave:cw.jk?.03:.008,nw:cw.jk?7:3,roll:yg>.6?yg*1.9:0,nv:24,across:.9,W:.36,gl:.95,shin:32,
      marks:l75AfMarks(sp,{c:col},L),marksB:[[[0,0],[0,.5],[0,.98]],...[-1,1].flatMap(s=>[l38Vein(sp,s,0,.9,.55,5),l38Vein(sp,s,0,-.2,.6,3)])].map(l=>({l,w:Math.max(1.2,L*.009),c:shd(cw.b,.3),o:.85}))},parts)}})}

/* ---------- registers ---------- */
Object.assign(GH,{'monstera-deliciosa':l75Mons,'philodendron-bipinnatifidum-selloum':l75Sell,'philodendron-xanadu':l75Xana,'alocasia':l75Aloc,'anthurium-feuilles':l75AnFe});
Object.assign(CWS,{'monstera-deliciosa':CW_L75MO,'philodendron-bipinnatifidum-selloum':CW_L75SE,'philodendron-xanadu':CW_L75XA,'alocasia':CW_L75AL,'anthurium-feuilles':CW_L75AF});
/* commercial grades, in the recipe's unit: the length of the blade (monstera Mini / Medium / Large, alocasia S / M / L) */
Object.assign(SZG,{'monstera-deliciosa':[25,40,55],'philodendron-bipinnatifidum-selloum':[40,60,75],'philodendron-xanadu':[20,30,40],'alocasia':[25,40,55],'anthurium-feuilles':[20,30,40]});
/* in a bouquet the composer lets the big leaves rise on their petioles behind the flowers: only the top of the spine, where the blade starts, must clear the lip (c4.js);
   the sagittate lobes of the alocasia and the basal lobes of the selloum hang back below the petiole's top: they keep more room above the lip */
for(const fn of[l75Mons,l75Xana,l75AnFe])fn.bigLeaf={ext:14,k0:12};
for(const fn of[l75Sell,l75Aloc])fn.bigLeaf={ext:30,k0:12};
