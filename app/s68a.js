/* ================= Serre, lot 68 — eucalyptus 2 : eucalyptus 'Baby Blue' (E. pulverulenta), gommier cidre (E. gunnii), eucalyptus à feuilles de saule (E. nicholii), « Populus » (E. populnea), « Stuartiana » (E. bridgesiana) ================= */
/* chaque tige coupée est poussée par le L-système (l44Main du lot 44) : l'axe principal suit son chemin (épine du Composer, arc d'une planche, tige d'une carte), ses nœuds portent les feuilles
   (paires décussées des feuilles juvéniles, spirale des feuilles adultes), les rameaux latéraux et, chez le Populus, les ombelles de capsules ; les limbes sont des nappes 3D (f15BladeS du lot 15)
   dessinées avec leur vrai contour (base cordée embrassante, pointe courte), leur pruine, leurs nervures ; les jeunes pousses du sommet sont plus petites, plus pâles ou teintées.
   Contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
const l68Op=o=>Math.max(.05,Math.min(1,o.op??1)),l68Cols=c=>[shd(c,-.58),shd(c,-.25),c,shd(c,.4)];
/* ---------- a blade on its 3D surface S(u, v) (f15BladeS), v from v0 (behind the node: the lobes of a clasping cordate base) to the tip; its outline row by row as the extreme points across its midrib
   (its true silhouette, edge-on too), closed at the base through the sinus (0, vs) when the base is cordate; on sheets its two halves, each lit by its own face, the midrib, the side veins, the bloom, the gloss ---------- */
const L68_U5=[-1,-.5,0,.5,1];
function l68Blade(S,P,PB,o={}){const nv=o.nv||(DET>=1.5&&!LOD?12:7),v0=o.v0||0,vs=o.vs??v0,vi=i=>v0+(1-v0)*(1-Math.cos(Math.PI*i/nv))/2,rows=[];let z=0;
  for(let i=0;i<=nv;i++){const v=vi(i),r=L68_U5.map(u=>{const p=S(u,u===0?Math.max(v,vs):v);return[p[0],-p[1],p[2]]});rows.push(r);z+=r[2][2]}z/=nv+1;
  const Lf=[],Rt=[];for(let i=0;i<=nv;i++){const a=rows[Math.max(0,i-1)][2],b=rows[Math.min(nv,i+1)][2];let px=-(b[1]-a[1]),py=b[0]-a[0];if(Math.hypot(px,py)<1e-6){px=rows[i][4][0]-rows[i][0][0];py=rows[i][4][1]-rows[i][0][1]}
    const m=Math.hypot(px,py)||1;px/=m;py/=m;let mn=1e9,mx=-1e9,pl=rows[i][0],pr=rows[i][4];const c=rows[i][2];for(const q of[rows[i][0],rows[i][1],rows[i][3],rows[i][4]]){const s=(q[0]-c[0])*px+(q[1]-c[1])*py;if(s<mn){mn=s;pl=q}if(s>mx){mx=s;pr=q}}Lf.push([pl[0],pl[1]]);Rt.push([pr[0],pr[1]])}
  if(o.sharp){const e=rows[nv][2];Lf.push([e[0],e[1]])}
  const sin=vs>v0+1e-3?(p=>[[p[0],-p[1]]])(S(0,vs)):[],out=Lf.concat(Rt.reverse(),sin),nC=f15Nrm(S,-1,1),mt=o.mt??.8,tc=f15Tone(P,PB,nC,mt),lite=h2l(tc)[2]>.76,ink=o.ink||shd(tc,-.5),eo=o.eo??(lite?.8:.45);
  return{z:z+(o.zb||0),cast:false,fn:par=>{const d=smooth(out);
    if(DET>=1.5&&!LOD){const half=j=>{const q=[];for(let i=0;i<=nv;i++)q.push([rows[i][j][0],rows[i][j][1]]);for(let i=nv;i>=0;i--)q.push([rows[i][2][0],rows[i][2][1]]);return q},
        hs=[[0,f15Nrm(S,-1,0),rows.reduce((s,r)=>s+r[0][2],0)],[4,f15Nrm(S,0,1),rows.reduce((s,r)=>s+r[4][2],0)]].sort((a,b)=>a[2]-b[2]);
      E('path',{d,fill:tc},par);for(const[j,n]of hs)E('path',{d:smooth(half(j)),fill:f15Tone(P,PB,n,mt)},par);
      if(o.gloss){const sg=f15Nrm(S,-1,0)[2]>f15Nrm(S,0,1)[2]?-1:1,A=[],B=[];for(let i=1;i<nv;i++){const v=vi(i);if(v<.1||v>.86)continue;const a=S(sg*.16,v),b=S(sg*.46,v);A.push([a[0],-a[1]]);B.push([b[0],-b[1]])}
        if(A.length>1)E('path',{d:smooth(A.concat(B.reverse())),fill:'#ffffff',opacity:f(.13*o.gloss)},par)}
      if(o.mid){const q=[];for(let i=0;i<nv;i++){const v=vi(i);if(v>=vs)q.push([rows[i][2][0],rows[i][2][1]])}if(q.length>1)E('path',{d:smooth(q,false),stroke:o.mid,'stroke-width':f(o.mw||.45),'stroke-opacity':o.mo??.45,fill:'none','stroke-linecap':'round'},par)}
      if(o.veins){let dv='';for(const L of o.veins){const q=L.map(([u,v])=>{const p=S(u,v);return[p[0],-p[1]]});dv+=smooth(q,false)}E('path',{d:dv,stroke:o.vc||o.mid||ink,'stroke-width':f(o.vw||.3),'stroke-opacity':o.vo??.3,fill:'none','stroke-linecap':'round'},par)}
      if(o.bloom)E('path',{d,fill:f15BloomFill(),opacity:o.bloom},par);
      E('path',{d,fill:'none',stroke:ink,'stroke-width':o.ew||.42,'stroke-opacity':Math.min(.85,eo+.05),'stroke-linejoin':'round'},par)}
    else E('path',LOD&&!lite?{d,fill:tc}:{d,fill:tc,stroke:ink,'stroke-width':o.ew||.4,'stroke-opacity':eo,'stroke-linejoin':'round'},par)}}}
/* the lowest a blade reaches (y up, view space), over its whole outline (the clasping lobes too) */
const l68Low=(S,v0)=>{let y=1e9;for(const v of[v0,.25,.5,.75,1])for(const u of[-1,0,1])y=Math.min(y,S(u,v)[1]);return y};
/* a leaf that would hang below the mouth is shortened, or left out when it would get too small */
function l68Fit(mk,len,lim,v0){if(lim==null)return mk(len);for(const k of[1,.8,.62]){const S=mk(len*k);if(l68Low(S,v0)>=lim)return S}return null}
/* the lowest a leaf may reach: above the mouth for a stem rising from it, free for the top of a stem whose foot joins the stems, and on a sheet */
const l68Lim=o=>o.spine&&!(o.from>0)?3:null;
/* ---------- leaf forms (outline profile, width ratio, base v0 / sinus vs, face ρ, arch, fold, cup, droop, curl, twist, matte, petiole cm, veins) ---------- */
const L68_VR=[0,1,2,3].map(k=>{const v=.16+.17*k;return[[0,v],[.42,v+.08],[.8,v+.2]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]).concat([[[.82,.1],[.9,.45],[.62,.84]],[[-.82,.1],[-.9,.45],[-.62,.84]]]),
  L68_VL=[0,1,2,3].map(k=>{const v=.14+.2*k;return[[0,v],[.5,v+.1],[.86,v+.22]]}).flatMap(L=>[L,L.map(([u,v])=>[-u,v])]),
  L68_VN=[[[0,.04],[.42,.3],[.5,.6],[.3,.9]],[[0,.04],[-.42,.3],[-.5,.6],[-.3,.9]]];
const L68_M={
  /* Baby Blue: round-cordate, sessile, clasping (its lobes meet behind the stem), cupped, held almost level */
  bb:{wp:prof([[-.16,.06],[-.13,.46],[-.07,.74],[.04,.92],[.24,1],[.5,.94],[.74,.7],[.9,.38],[1,.04]]),wr:1.04,v0:-.16,vs:-.01,rho:48,arch:.04,fold:.02,cup:.22,droop:.03,curl:.06,tw:.08,mt:.42,veins:L68_VR},
  /* gunnii juvenile: orbicular, the base rounded to faintly cordate, sessile, a little cupped */
  gj:{wp:prof([[-.08,.06],[-.06,.42],[0,.66],[.14,.92],[.4,1],[.66,.86],[.86,.52],[1,.06]]),wr:.98,v0:-.08,vs:0,rho:58,arch:.05,fold:.07,cup:.14,droop:.05,curl:.04,tw:.1,mt:.6,veins:L68_VR},
  /* gunnii adult: lanceolate, petiolate, hanging on edge */
  ga:{wp:prof([[0,.12],[.12,.6],[.32,.96],[.46,1],[.7,.74],[.88,.34],[1,.02]]),wr:.24,v0:0,rho:16,arch:.06,fold:.12,cup:.03,droop:.3,curl:-.02,tw:.5,mt:.7,pet:1.1,sharp:1,veins:L68_VL},
  /* nicholii: linear-lanceolate, very narrow, twisted and pendulous on a short petiole */
  nc:{wp:prof([[0,.2],[.08,.66],[.24,.96],[.42,1],[.66,.82],[.86,.42],[1,.02]]),wr:.11,v0:0,rho:14,arch:.05,fold:.16,cup:0,droop:.5,curl:-.04,tw:.7,mt:.72,pet:.8,sharp:1,veins:null},
  /* populus: broad-ovate to round with a short drawn-out tip, glossy, on a long petiole */
  po:{wp:prof([[0,.36],[.08,.72],[.26,.98],[.42,1],[.62,.88],[.8,.56],[.92,.2],[1,.01]]),wr:.9,v0:0,rho:52,arch:.06,fold:.1,cup:.06,droop:.14,curl:-.02,tw:.25,mt:.85,pet:1.5,sharp:1,veins:L68_VN.concat(L68_VL.slice(0,6)),gloss:1},
  /* stuartiana juvenile: ovate to round, the base rounded, sessile, soft blue-grey */
  sj:{wp:prof([[-.06,.06],[-.04,.4],[0,.58],[.14,.88],[.36,1],[.6,.9],[.82,.56],[.94,.2],[1,.02]]),wr:.84,v0:-.06,vs:0,rho:56,arch:.05,fold:.08,cup:.1,droop:.07,curl:.03,tw:.12,mt:.62,veins:L68_VR},
  /* stuartiana alternate: ovate, short-petiolate, a little hanging */
  sa:{wp:prof([[0,.3],[.1,.7],[.3,.97],[.46,1],[.68,.84],[.86,.46],[1,.02]]),wr:.66,v0:0,rho:34,arch:.05,fold:.1,cup:.06,droop:.15,curl:.02,tw:.3,mt:.65,pet:.6,sharp:1,veins:L68_VL}};
/* one leaf at an organ of the turtle: its size falls toward the tip, the youngest leaves paler, bluer or flushed (natural) or a little uneven (dyed); a petiole on the petiolate forms */
function l68Leaf(og,lim,M,L0,col,o={}){const p=og.p,q=p.q??0,yk=Math.max(0,Math.min(1,(q-o.y0)/(1-o.y0))),sz=L0*UPC*l68LK*(1-(o.tipK??.6)*Math.pow(q,1.6))*(p.s||1)*R(.9,1.08),Hd=og.H,sg=p.j?-1:1,
    rho=(M.rho+R(-16,16))*D,N=f15Face(og,rho,o.opp?sg:(rnd()<.5?1:-1)),c=o.dyed?mix(col,shd(col,R(-.12,.1)),.6):mix(mix(col,shd(col,R(-.07,.07)),.5),o.young||lt(col,.3),yk*(o.yw??.75)),
    cb=o.dyed?shd(c,.06):mix(c,o.back||'#d6ded8',.25),det=DET>=1.5&&!LOD,pl=M.pet?M.pet*UPC*(1-.4*q)*R(.85,1.15):og.w*.3,P0=V3.add(og.pos,V3.sc(Hd,pl)),
    mk=len=>f15BladeS(P0,Hd,N,len,len*M.wr*.5,M.wp,{arch:M.arch,fold:M.fold,cup:M.cup,droop:M.droop*(o.soft||1),curl:M.curl,tw:M.tw*R(-1,1)}),S=l68Fit(mk,sz,lim,M.v0||0);
  if(!S)return null;const mid=o.dyed?shd(c,.18):mix(c,'#efe6d8',.42),parts=[l68Blade(S,pal7(c),pal7(cb),{v0:M.v0,vs:M.vs,sharp:M.sharp,mt:o.dyed?.72:M.mt,mid:det?mid:null,veins:det?M.veins:null,vc:mid,vo:.2,bloom:o.bloom,gloss:M.gloss&&!o.dyed?M.gloss:0})];
  /* the petiole, from the node into the blade (thick enough to stay one piece with the stem) */
  if(M.pet)parts.push(g35Pet(og.pos,V3.add(P0,V3.sc(Hd,sz*.04)),Math.max(1.15,og.w*.5),o.pc||shd(c,-.3),-.02));
  return parts}
/* ---------- the grower: nodes along the main axis (opposite decussate pairs, or a spiral), side shoots in their zone (B(n) → F M(n) B(n−1), B(0) → F T), and the species' own organs.
   S: len (cm), leafy, inter [base, tip] (cm), phy(q) → 'opp'|'alt', ang [base, tip], w0, w1, cols, br {zone, p, max, gap, n, li, ang, eb, ls, wk}, caps(i, q) → modules, leaf(og, lim), tip(og), org(og) ---------- */
let l68LK=1;/* the leaf scale of the stem being grown (a sheet's leaf-size grade) */
function l68Grow(g,t,o,id,S){const k=G(g),op=l68Op(o);
  return g35Run(o,id,()=>{const big=o.cm>15,ks=o.spine||!o.cm?1:big?o.cm/S.len:o.cm/S.rcm,Lt=o.spine?blen(o.spine):S.len*UPC*(big?ks:.7+.3*ks)*(.62+.38*op),A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(S.arch[0],S.arch[1])),Le=A.L,l0=A.l0||0,
      kl=o.spine?1:big?.8+.2*Math.min(1.3,ks):.6+.4*ks,lim=l68Lim(o),fr=o.spine&&o.from>0;
    const a0=o.spine?(fr?l0+(Le-l0)*.04:Math.max(Le*(1-S.leafy),Le*.17)):Le*(1-S.leafy),nodes=[];
    for(let a=a0;a<Le-UPC*(S.tl??1);){nodes.push(a);const q=(a-a0)/Math.max(1,Le-a0);a+=UPC*kl*(S.inter[0]+(S.inter[1]-S.inter[0])*q)*R(.88,1.12)*(.75+.25*op)}
    const nN=nodes.length,qOf=i=>nN>1?i/(nN-1):1,ph0=R(0,360),br=S.br,brAt=new Map();
    if(br){let c=0;for(let i=0;i<nN&&c<br.max;i++){const q=qOf(i);if(q>=br.zone[0]&&q<=br.zone[1]&&rnd()<br.p){brAt.set(i,c++);i+=br.gap||1}}}
    const angAt=q=>S.ang[0]+(S.ang[1]-S.ang[0])*q;let phA=ph0,lastOpp=true;
    /* the leaves of one node: a decussate pair, or one leaf of the spiral */
    const leaves=(q,qs,ph,ang,s,opp)=>{const out=[];for(let j=0;j<(opp?2:1);j++)out.push(['[',{}],['/',{a:ph+j*180+R(-14,14)}],['&',{a:ang+R(-7,7)}],['Lv',{q:qs,j,s,opp:opp?1:0}],[']',{}]);return out};
    const rules={B:p=>{if(p.n<=0)return[['F',{l:p.li*.5,w1:Math.max(1.2,S.w1*.8),e:br.eb}],...leaves(1,1,p.ph+90,26,.7,S.phy(1,1)==='opp'),['T',{u:1,b:1}]];const qb=1-p.n/p.n0,opp=S.phy(Math.min(1,p.q+.5*qb),1)==='opp';p.ph+=opp?90:137.5;
        const out=[['F',{l:p.li*R(.85,1.15)*(1-.3*qb),w1:Math.max(1.2,p.w*(1-.55*qb)),e:br.eb}],...leaves(p.q,Math.min(1,p.q+.5*qb),p.ph,angAt(Math.min(1,p.q+.35+.4*qb)),br.ls||.85,opp)];
        if(S.caps&&rnd()<(S.capsB??0))out.push(...S.caps(-1,Math.min(1,p.q+.5*qb),p.ph+90));
        return[...out,['B',Object.assign({},p,{n:p.n-1})]]}};
    const res=l44Main(A,nodes,{w0:S.w0*Math.min(1.1,.75+.25*ks),w1:S.w1,cols:S.cols,step:8,depth:(br?br.n[1]:0)+4,wig:0,rules,
      node:(i,u,w)=>{const q=qOf(i),opp=S.phy(q,0)==='opp';phA+=opp?(lastOpp?90:0):137.5;lastOpp=opp;const out=leaves(q,q,phA+R(-6,6),angAt(q),1,opp);
        if(brAt.has(i)){const c=brAt.get(i),n=Math.round(R(br.n[0],br.n[1])*(1-.35*q)*(.7+.3*op)),wb=Math.max(1.3,w*(br.wk||.55));
          if(n>0)out.push(['[',{w:wb}],['/',{a:phA+(opp?90:70)+(c%2?180:0)+R(-25,25)}],['&',{a:br.ang+R(-8,8)}],['B',{n,n0:n,li:br.li*UPC*kl,q,w:wb,ph:R(0,360)}],[']',{}])}
        if(S.caps)out.push(...S.caps(i,q,phA+90));
        return out}});
    const parts=[];lsChainParts(res.chains,[0,0,0],S.cols,parts,{piece:DET>=1.5?9:14});
    if(S.ridge&&DET>=1.5&&!LOD)l68Ridge(res.chains[0],S.ridge,parts);
    l68LK=o.spine||big?1:kl;for(const og of res.organs){const pp=og.t==='Lv'?S.leaf(og,lim,op):og.t==='T'?S.tip&&S.tip(og,op):S.org?S.org(og,lim,op):null;if(pp)parts.push(...pp)}
    l68LK=1;drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,S.cols)})}
/* the angular stem of the Baby Blue: a crisp light ridge along its lit side (sheets) */
function l68Ridge(ch,c,parts){const n=ch.pts.length;for(let a=0;a<n-1;a+=8){const b=Math.min(n-1,a+8),P=[],W=[];let z=0;for(let i=a;i<=b;i++){P.push([ch.pts[i][0],-ch.pts[i][1]]);W.push(ch.ws[i]);z+=ch.pts[i][2]}
    if(Math.max(...W)<1.6)continue;parts.push({z:z/(b-a+1)+.001,cast:false,fn:par=>E('path',{d:polyRibbon(P,i=>W[i]*.07,i=>W[i]*.3),fill:c,opacity:.7},par)})}}
/* ---------- E. pulverulenta 'Baby Blue': juvenile leaves only, opposite and decussate, sessile, round to cordate, their bases clasping the stem, so close that the pairs overlap like stacked discs;
   bright silver-blue under a thick powdery bloom; the stems stiff, square in section, glaucous; few side shoots ---------- */
const CW_L68BB=[{id:'bleu-argent',n:'Bleu argenté (Baby Blue)',c:'#9db0b4'},{id:'bleu-poudre',n:'Bleu poudré',c:'#aec0c8'},{id:'vert-bleute',n:'Vert bleuté',c:'#88a39c'}];
const L68_BBST=['#3a4446','#62727a','#8e9fa4','#c2d0d2'];
function l68BB(g,t,o){const cw=fgCw(CW_L68BB,o);
  return l68Grow(g,t,o,'l68bb',{len:55,rcm:3,leafy:.88,inter:[1.5,.95],phy:()=>'opp',ang:[76,56],w0:4,w1:1.3,cols:L68_BBST,arch:[.04,.1],tl:.6,ridge:'#d8e2e4',
    br:{zone:[.12,.7],p:.4,max:2,gap:2,n:[3,6],li:1.25,ang:42,eb:.004,ls:.84,wk:.62},
    leaf:(og,lim,op)=>l68Leaf(og,lim,L68_M.bb,4.2,cw.c,{opp:1,y0:.55-.3*(1-op),young:mix(cw.c,'#e4eef0',.6),back:'#dfe7e8',bloom:.5,tipK:.55,pc:L68_BBST[1]}),
    tip:og=>eucApex(og,mix(cw.c,'#b8c8cc',.5))})}
/* ---------- E. gunnii (cider gum), juvenile foliage: small round leaves (2–4 cm) in opposite decussate pairs, sessile, silver-blue under the bloom, along reddish, slender stems with many short
   side shoots; on some stems the top already carries a few adult leaves, alternate, lanceolate and petiolate ---------- */
const CW_L68GU=[{id:'bleu-argent',n:'Bleu argenté',c:'#93a8ad'},{id:'bleu-vert',n:'Bleu-vert',c:'#82a09a'},{id:'vert-gris',n:'Vert-de-gris',c:'#9aab90'}];
const L68_GUST=['#481c1c','#783632','#a45a4e','#cc9488'];
function l68Gu(g,t,o){const cw=fgCw(CW_L68GU,o),ad=rnd()<.4?R(.8,.88):2;
  return l68Grow(g,t,o,'l68gu',{len:55,rcm:3,leafy:.86,inter:[2.3,1.25],phy:q=>q>=ad?'alt':'opp',ang:[74,48],w0:3,w1:1.15,cols:L68_GUST,arch:[.08,.18],tl:.8,
    br:{zone:[.08,.78],p:.6,max:5,gap:1,n:[3,7],li:1.6,ang:46,eb:-.014,ls:.86,wk:.55},
    leaf:(og,lim,op)=>{const a=og.p.q>=ad&&!og.p.opp;return l68Leaf(og,lim,a?L68_M.ga:L68_M.gj,a?7:3.2,a?mix(cw.c,'#6e8a7c',.35):cw.c,{opp:!a,y0:.5-.3*(1-op),young:mix(cw.c,'#c9a6a8',.4),back:'#dce3e2',bloom:a?.2:.45,tipK:a?.3:.5,pc:L68_GUST[1]})},
    tip:og=>eucApex(og,'#a8888a')})}
/* ---------- E. nicholii (narrow-leaved black peppermint, « eucalyptus à feuilles de saule »): very narrow linear-lanceolate leaves (6–12 cm × 0.5–1 cm), alternate, on short petioles, hanging,
   blue-green flushed purple (the young shoots plum), along fine, supple, reddish-purple branchlets that weep ---------- */
const CW_L68NI=[{id:'vert-bleute',n:'Vert bleuté',c:'#7c9a92'},{id:'vert-gris',n:'Vert grisé',c:'#8a9a86'},{id:'pourpre',n:'Pourpré (jeunes pousses)',c:'#76606c'}];
const L68_NIST=['#3a1820','#662c36','#8e4c56','#b8828a'];
function l68Ni(g,t,o){const cw=fgCw(CW_L68NI,o),pu=cw.id==='pourpre';
  return l68Grow(g,t,o,'l68ni',{len:60,rcm:9,leafy:.84,inter:[1.7,1],phy:()=>'alt',ang:[48,34],w0:2.6,w1:1.05,cols:L68_NIST,arch:[.2,.34],tl:.6,
    br:{zone:[.05,.82],p:.6,max:6,gap:1,n:[5,9],li:1.45,ang:54,eb:-.03,ls:.88,wk:.5},
    leaf:(og,lim,op)=>l68Leaf(og,lim,L68_M.nc,9,pu?mix(cw.c,'#7c9a92',.3):mix(cw.c,'#7a5a6a',.12),{y0:.45-.3*(1-op),young:pu?'#8a4a5e':mix(cw.c,'#8a4a5e',.55),yw:.8,back:'#c8d0cc',bloom:.12,tipK:.5,pc:L68_NIST[1]}),
    tip:og=>eucApex(og,'#7a3a48')})}
/* ---------- « Populus » (E. populnea, poplar box): broad-ovate to round leaves with a short point, glossy bright green, on long petioles, alternate; in the leaf axils umbels of small round
   capsules (the florists' « berries », 5–7 mm), each on its pedicel, a disc on top, green ripening brown; sold natural, dyed or painted ---------- */
const CW_L68PO=[{id:'baies-vertes',n:'Baies vertes',c:'#a9b98a',lf:'#5a8238',bc:'#9cb06c'},{id:'olive',n:'Baies vert-olive',c:'#7a8450',lf:'#557a34',bc:'#7e8046'},
  {id:'brun',n:'Baies brunes (mûres)',c:'#6e5238',lf:'#5e7c3c',bc:'#6e5238'},{id:'bordeaux',n:'Bordeaux (teinté)',c:'#6a2234',dy:1},{id:'or',n:'Doré (peint)',c:'#c9a24a',dy:1},{id:'noir',n:'Noir (teinté)',c:'#2e2b2c',dy:1}];
const L68_POST=['#2c2a1a','#545030','#7c784a','#aca87a'];
/* an umbel of capsules at its organ: the peduncle along H, the capsules fanned round it on their pedicels, drawn far to near in one part */
function l68Caps(og,lim,cw,op){const H=V3.nz(V3.add(og.H,[0,-.25,0])),[X,Y]=fgCross(H),det=DET>=1.5&&!LOD,n=og.p.n,lp=UPC*R(.55,.9)*l68LK,E0=V3.add(og.pos,V3.sc(H,lp)),r0=UPC*R(.3,.36)*(.8+.2*op)*Math.sqrt(l68LK),
    bc=cw.dy?cw.c:mix(cw.bc,'#7a5a3a',Math.max(0,.6-op)*0),cs=[];
  for(let j=0;j<n;j++){const a=j*2.4+R(-.3,.3),sp=j===0?.15:R(.75,1.05),d=V3.nz(V3.add(H,V3.add(V3.sc(X,Math.cos(a)*sp),V3.sc(Y,Math.sin(a)*sp)))),pl=UPC*R(.3,.48),r=r0*R(.9,1.08),
      C=V3.add(E0,V3.sc(d,pl+r*.8));cs.push({d,C,r,s:V3.add(E0,V3.sc(d,pl))})}
  if(lim!=null&&(E0[1]<lim||cs.some(c=>c.C[1]-c.r<lim)))return null;
  cs.sort((a,b)=>a.C[2]-b.C[2]);const P=pal7(bc),st=cw.dy?shd(cw.c,-.25):mix(shd(bc,-.25),'#5a5a30',.4),q=fgQ;
  let dp=`M${f(q(og.pos)[0])},${f(q(og.pos)[1])}L${f(q(E0)[0])},${f(q(E0)[1])}`;for(const c of cs)dp+=`M${f(q(E0)[0])},${f(q(E0)[1])}L${f(q(c.C)[0])},${f(q(c.C)[1])}`;
  const z=cs.reduce((s,c)=>s+c.C[2],0)/n;
  return[{z,cast:false,fn:par=>{E('path',{d:dp,stroke:st,'stroke-width':1.2,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
    /* in the app: the capsules turned away in one path, those facing in another (three elements a cluster) */
    if(!det){const ci=(p,r)=>`M${f(p[0]-r)},${f(p[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;let bk='',fw='';for(const c of cs){if(c.d[2]>-.2)fw+=ci(q(c.C),c.r);else bk+=ci(q(c.C),c.r)}
      for(const[d,I]of[[bk,.42],[fw,.68]])if(d)E('path',{d,fill:toneAt(P,I),stroke:shd(bc,-.5),'stroke-width':.4,'stroke-opacity':.55},par);return}
    for(const c of cs){const p=q(c.C),fr=c.d[2]>-.2,tn=toneAt(P,fr?.62+.16*c.d[2]:.42);
      E('circle',{cx:f(p[0]),cy:f(p[1]),r:f(c.r),fill:tn,stroke:shd(bc,-.5),'stroke-width':.4,'stroke-opacity':.55},par);
      if(det){/* the shaded side (lit from the upper left) and the disc of the capsule's top, foreshortened along its axis */
        const sx=c.r*.32,sy=c.r*.32;E('path',{d:`M${f(p[0]-c.r*.62)},${f(p[1]+c.r*.78)}A${f(c.r)},${f(c.r)} 0 0 0 ${f(p[0]+c.r*.95)},${f(p[1]-c.r*.3)}A${f(c.r*1.1)},${f(c.r*1.1)} 0 0 1 ${f(p[0]-c.r*.62)},${f(p[1]+c.r*.78)}Z`,fill:P.d1,opacity:.55},par);
        const tp=q(V3.add(c.C,V3.sc(c.d,c.r*.72))),dd=[c.d[0],-c.d[1]],dl=Math.hypot(dd[0],dd[1])||1,an=Math.atan2(dd[1],dd[0])*180/Math.PI+90,ry=c.r*.5*Math.max(.18,Math.abs(c.d[2]));
        if(c.d[2]>-.3){E('ellipse',{cx:f(tp[0]),cy:f(tp[1]),rx:f(c.r*.5),ry:f(ry),transform:`rotate(${f(an)} ${f(tp[0])} ${f(tp[1])})`,fill:shd(bc,cw.dy?.12:-.12),stroke:shd(bc,-.45),'stroke-width':.35},par);
          E('circle',{cx:f(tp[0]),cy:f(tp[1]),r:f(c.r*.12),fill:shd(bc,-.5)},par)}
        else E('circle',{cx:f(p[0]-sx),cy:f(p[1]-sy),r:f(c.r*.22),fill:P.l1,opacity:.5},par)}}}}]}
function l68Po(g,t,o){const cw=fgCw(CW_L68PO,o),lf=cw.dy?cw.c:cw.lf,cols=cw.dy?f15DyeStem(cw.c):L68_POST;
  return l68Grow(g,t,o,'l68po',{len:60,rcm:6,leafy:.86,inter:[3.4,2.2],phy:()=>'alt',ang:[56,42],w0:3.2,w1:1.2,cols,arch:[.1,.2],tl:.9,
    br:{zone:[.05,.7],p:.5,max:4,gap:1,n:[3,5],li:2.6,ang:44,eb:-.012,ls:.86,wk:.55},capsB:.8,
    caps:(i,q,ph)=>q>.18||i<0?(rnd()<(i<0?1:.82)?[['[',{w:1.3}],['/',{a:ph+R(-30,30)}],['&',{a:R(28,44)}],['Cp',{q,n:Math.round(R(8,13))}],[']',{}]]:[]):[],
    leaf:(og,lim,op)=>l68Leaf(og,lim,L68_M.po,6.2,lf,{dyed:cw.dy,y0:.6-.3*(1-op),young:mix(lf,'#a8743c',.45),yw:.6,back:'#b8c8a0',tipK:.42,pc:cols[1]}),
    org:(og,lim,op)=>og.t==='Cp'?l68Caps(og,lim,cw,op):null,tip:og=>eucApex(og,cw.dy?shd(cw.c,-.1):'#8a6a3a')})}
/* ---------- « Stuartiana » (E. bridgesiana, apple box): juvenile leaves ovate to round (4–7 cm), soft blue-grey, sessile and opposite in the lower part, then alternate and short-petiolate
   toward the top, on long reddish stems with a few long side shoots ---------- */
const CW_L68ST=[{id:'bleu-gris',n:'Bleu-gris doux',c:'#98aaa6'},{id:'vert-sauge',n:'Vert sauge',c:'#8ea77b'},{id:'argent',n:'Gris argenté',c:'#a9b5ae'}];
const L68_STST=['#46281f','#764638','#a06e60','#c8a298'];
function l68St(g,t,o){const cw=fgCw(CW_L68ST,o),sw=R(.42,.58);
  return l68Grow(g,t,o,'l68st',{len:70,rcm:3.5,leafy:.86,inter:[3,1.7],phy:q=>q<sw?'opp':'alt',ang:[70,46],w0:3.4,w1:1.2,cols:L68_STST,arch:[.1,.2],tl:.8,
    br:{zone:[.1,.6],p:.45,max:3,gap:2,n:[3,6],li:2.4,ang:44,eb:-.012,ls:.84,wk:.55},
    leaf:(og,lim,op)=>{const a=!og.p.opp;return l68Leaf(og,lim,a?L68_M.sa:L68_M.sj,a?5.4:5.6,cw.c,{opp:!a,y0:.55-.3*(1-op),young:mix(cw.c,'#c49a90',.45),back:'#dbe2de',bloom:.32,tipK:.5,pc:L68_STST[1]})},
    tip:og=>eucApex(og,'#9a7a72')})}
/* ---------- registries: drawers, colourways, trade grades (the length of the cut stem, cm), and how the composer treats them: stems of foliage drawn along their spine, at their natural length ---------- */
Object.assign(GH,{'eucalyptus-pulverulenta-baby-blue':l68BB,'eucalyptus-gunnii':l68Gu,'eucalyptus-nicholii':l68Ni,'eucalyptus-populus':l68Po,'eucalyptus-stuartiana':l68St});
Object.assign(CWS,{'eucalyptus-pulverulenta-baby-blue':CW_L68BB,'eucalyptus-gunnii':CW_L68GU,'eucalyptus-nicholii':CW_L68NI,'eucalyptus-populus':CW_L68PO,'eucalyptus-stuartiana':CW_L68ST});
Object.assign(SZG,{'eucalyptus-pulverulenta-baby-blue':[40,50,55,60,70],'eucalyptus-gunnii':[40,50,55,60,70],'eucalyptus-nicholii':[50,60,60,70,80],'eucalyptus-populus':[50,60,60,70],'eucalyptus-stuartiana':[50,60,70,80,90]});
const L68_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'eucalyptus-pulverulenta-baby-blue':L68_I(55,{fx:22}),'eucalyptus-gunnii':L68_I(55,{fx:20}),'eucalyptus-nicholii':L68_I(60,{fx:18}),'eucalyptus-populus':L68_I(60,{fx:24}),'eucalyptus-stuartiana':L68_I(70,{fx:24})});
