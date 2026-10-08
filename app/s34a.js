/* ================= Serre, lot 34 — feuillages tropicaux : philodendrons hybrides, aspidistra, cordyline (feuilles de ti), calathea (Goeppertia), feuilles de strelitzia ================= */
/* chaque feuille est une nappe 3D (sheet3) au bout de son pétiole, poussé par le L-système (fgGrow du lot 24) ; la cordyline porte sa rosette au bout de sa canne */
/* ---------- shared: a big leaf blade as a 3D surface at the tip of its petiole: its midrib leaves along H at th0 toward the face U and curls (ka, radians over the blade),
   across it the blade is folded on the midrib (fold), rolled when young (roll), its margin waved (wave, nw waves), twisted along (tw), drooping under its weight (droop);
   the width profile wp(v, side) may differ on each side (lobes, tears). u runs across from −1 to 1, v from the base to the tip; the face (U) is the sheet's front ---------- */
function t34S(og,len,o){const U=og.U,ln=o.lean||0,H=V3.add(V3.sc(og.H,Math.cos(ln)),V3.sc(V3.cr(og.H,U),Math.sin(ln))),X=V3.cr(H,U),P0=og.pos,W=len*o.wr*.5,wp=o.wp,t0=o.th0||0,ka=o.ka||0,dr=o.droop??.12,fo=o.fold??.1,tw=o.tw||0,wa=o.wave||0,nw=o.nw||5,rl=o.roll||0,ph=o.ph||0;
  return(u,v)=>{const s=u<0?-1:1,w=W*wp(v,s),t=t0+ka*v,ct=Math.cos(t),st=Math.sin(t),mx=Math.abs(ka)>1e-4?(st-Math.sin(t0))/ka:v*Math.cos(t0),my=Math.abs(ka)>1e-4?(Math.cos(t0)-ct)/ka:v*Math.sin(t0);
    const Uv=V3.add(V3.sc(U,ct),V3.sc(H,-st)),a=u*w;let x,y;
    if(rl>.02){const r=W/(rl*Math.PI);x=r*Math.sin(a/r);y=r*(1-Math.cos(a/r))}else{x=a;y=w*fo*Math.abs(u)}
    y+=w*wa*u*u*Math.sin(nw*6.283*v+s*1.7+ph)*Math.min(1,v*6);
    const c=Math.cos(tw*v),sn=Math.sin(tw*v),x2=x*c-y*sn,y2=x*sn+y*c;
    return V3.add(V3.add(V3.add(P0,V3.add(V3.sc(H,mx*len),V3.sc(U,my*len))),V3.add(V3.sc(X,x2),V3.sc(Uv,y2))),[0,-len*dr*v*v,0])}}
/* a shape in the blade's (u,v) space drawn on the screen; a band of the sheet shows rows i0..i1: a mark is drawn on the band that holds its centre */
const t34Q=(S,u,v)=>{const p=S(u,v);return[p[0],-p[1]]},t34P=(S,pts)=>smooth(pts.map(([u,v])=>t34Q(S,u,v))),t34L=(S,pts)=>'M'+pts.map(([u,v])=>{const q=t34Q(S,u,v);return f(q[0])+','+f(q[1])}).join('L');
const t34In=(c,v)=>{const nv=c.scr.length-1;return v>=c.i0/nv-1e-6&&v<=c.i1/nv+1e-6};
/* a mark cut to the rows of the band (null when it lies elsewhere): a mark across a fold shows its part on each face */
const t34Clip=(c,pts)=>{const nv=c.scr.length-1,a=c.i0/nv,b=c.i1/nv;let lo=1,hi=0;for(const q of pts){lo=Math.min(lo,q[1]);hi=Math.max(hi,q[1])}if(hi<a||lo>b)return null;return pts.map(([u,v])=>[u,Math.max(a,Math.min(b,v))])};
/* the blade itself: sheet3 with its two palettes (face, underside), its veins, its gloss, its painted marks (o.paint(g,ctx,S) on the face, o.paintB on the underside) */
function t34Blade(og,len,col,colB,o,parts){const S=t34S(og,len,o),F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(col),PB=pal7(colB);
  const ps=sheet3(F,S,{pal:P,palB:PB,nu:o.nu||6,nv:o.nv||18,across:o.across??1.2,ew:.5,eo:.4,cast:0,veins:o.veins,vw:o.vw||Math.max(.5,len*.004),vo:o.vo,zb:o.zb,
    gloss:o.gl?{shin:o.shin||26,k:o.gl,thr:.2,cu:2,cv:o.gcv||5,nu:8,nv:16,lv:1.7,lu:.5,o:.6}:null,
    paint:(o.paint||o.paintB)&&!LOD?(g,front,c)=>{if(front&&o.paint)o.paint(g,c,S,P);else if(!front&&o.paintB)o.paintB(g,c,S,PB)}:null});
  parts.push(...ps);return S}
/* pinnate lateral veins: from the midrib at v toward the margin, bending to the tip */
const t34Pin=(n,v0,v1,rise,reach=.92)=>{const out=[];for(let i=0;i<n;i++){const v=v0+(v1-v0)*i/(n-1);for(const s of[-1,1])out.push([[0,v],[s*reach*.45,v+rise*.4],[s*reach,v+rise]])}return out};
/* a big leaf on its petiole: the petiole grown by the L-system (from the bouquet's spine, or standing in the view's frame), the blade at its tip facing the front of the spray */
function t34Plant(g,t,o,c){const op=Math.max(.05,Math.min(1,o.op??1)),cm0=c.cm0,ks=o.spine?1:(o.cm||cm0)/cm0,len=(o.cm||cm0)*UPC,k=G(g),Lt=o.spine?blen(o.spine):c.pet*UPC*ks,A=fgAxis(o,Lt,c.arch??R(-.1,.1));
  /* in a bouquet the spine reaches the edge of the mass: the petiole stops short of it so that the blade, not its tip, sits there (a looped leaf keeps its whole petiole) */
  if(o.spine&&!c.full)A.L=Math.min(A.L,Math.max(A.L*.6,A.l0+12*UPC,A.L-len*.5));
  const pc=c.pc,cols=[shd(pc,-.6),shd(pc,-.25),pc,shd(pc,.42)],sE=A.sOf(A.L);
  const r=fgGrow(k,A,{li:9*UPC,liT:0,w0:c.w0*Math.min(1.15,ks),w1:c.w1*Math.min(1.15,ks),cols,uL:2,seg:12,wig:c.wig??.012,tipLv:0,
    tip:og=>{const parts=[],Fr=A.at(sE).Fr,of=fgFace(og,Fr,c.face??.85);c.blade(of,len,op,parts,cols);return parts}});
  open(k,t,1000,0,.4);return r}
/* a short petiole or pulvinus drawn as a tapered axis between two 3D points (P0 → P1, slightly sagging) */
function t34Pet(P0,P1,w0,w1,cols,parts){const P=[],W=[],n=6;let z=0;for(let i=0;i<=n;i++){const t=i/n,q=V3.add(V3.add(P0,V3.sc(V3s(P1,P0),t)),[0,-V3l(V3s(P1,P0))*.06*Math.sin(Math.PI*t),0]);P.push([q[0],-q[1]]);W.push(w0+(w1-w0)*t);z+=q[2]}
  parts.push({z:z/(n+1),cast:false,ax:1,fn:par=>stemPoly(par,P,W,cols)})}

/* ---------- philodendron hybrids (Philodendron 'Imperial Green', 'Imperial Red', 'Rojo Congo', 'Black Cardinal', 'Moonlight', 'Prince of Orange'; Thaumatophyllum 'Xanadu'):
   the self-heading hybrids sold as cut leaves have thick, leathery, very glossy blades, oblong-ovate with a truncate to subcordate base, on long stout petioles;
   'Xanadu' is deeply pinnatifid, its lobes pointing forward; the red forms are burgundy above, wine-red beneath, their petioles red ---------- */
const CW_T34PH=[{id:'imperial-green',n:'Vert lustré (Imperial Green)',c:'#2b4a26',b:'#5a7a44',pc:'#4f6e34'},{id:'xanadu',n:'Vert lobé (Xanadu)',c:'#2f5a2a',b:'#6a8a50',pc:'#58783a',lob:1},
  {id:'imperial-red',n:'Bordeaux (Imperial Red)',c:'#3a1a26',b:'#6a2a34',pc:'#6a2430'},{id:'rojo-congo',n:'Rouge vin, jeunes feuilles rouges (Rojo Congo)',c:'#4a1e22',b:'#7a2a2c',pc:'#7a2a2a',tip:'#8a2a2a'},
  {id:'black-cardinal',n:'Noir pourpré (Black Cardinal)',c:'#221a1c',b:'#4a2a30',pc:'#3a2a26'},{id:'moonlight',n:'Chartreuse (Moonlight)',c:'#b9cc3c',b:'#c8d07a',pc:'#a8b84a'},
  {id:'prince-of-orange',n:'Cuivre orangé (Prince of Orange)',c:'#c47a34',b:'#c89a60',pc:'#8a8a40'}];
const T34_PHI=prof([[0,.4],[.08,.78],[.3,1],[.6,.9],[.84,.5],[.96,.12],[1,0]]),T34_PHX=prof([[0,.5],[.12,.92],[.4,1],[.7,.82],[.9,.42],[1,0]]);
/* Xanadu: the lobes rise slowly to their tip and fall back sharply into the sinus, so they point toward the leaf's tip */
const t34Lob=(v,s)=>{if(v<.06||v>.9)return T34_PHX(v);const n=7,x=(v-.06)/.84*n+(s>0?.0:.5),fr=x-Math.floor(x),d=fr<.78?fr/.78:1-(fr-.78)/.22;return T34_PHX(v)*(.42+.58*Math.pow(d,.8))};
function t34Philo(g,t,o){const cw=fgCw(CW_T34PH,o),lob=!!cw.lob;
  return t34Plant(g,t,o,{cm0:30,pet:40,pc:cw.pc,w0:4.2,w1:3.2,arch:R(-.12,.12),blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.35*yg),col=cw.tip&&yg>0?mix(cw.c,cw.tip,yg):cw.c;
    t34Blade(og,L,col,cw.b,{wp:lob?t34Lob:(v)=>T34_PHI(v),wr:lob?.78:.46,th0:-.22+.15*yg,ka:-.35,lean:R(-.3,.3),droop:.14,fold:lob?.12:.22,tw:(rnd()<.5?-1:1)*R(.45,.8),wave:lob?0:.04,nw:3,roll:yg*1.9,nv:lob?44:18,nu:6,gl:.95,shin:30,gcv:6,
      veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(.9,L*.012),c:shd(cw.c,.38),o:.75},...(lob?[]:t34Pin(7,.1,.78,.17).map(p=>({pts:p})))].concat(lob?[0,1,2,3,4,5,6].flatMap(i=>{const v=.06+(i+.62)*.84/7;return[{pts:[[0,v-.09],[-.5,v-.04],[-.9,v]]},{pts:[[0,v-.15],[.5,v-.1],[.9,v-.06]]}]}):[])},parts)}})}

/* ---------- cast-iron plant (Aspidistra elatior): each leaf rises alone from the rhizome on a stiff, channelled petiole; the blade is long-elliptic, leathery, dark green,
   with fine parallel veins and a long acuminate tip; 'Milky Way' speckled with cream, 'Variegata' striped with cream, 'Asahi' whitening toward the tip, 'Okame' striped
   with yellow; sold also bleached or dyed. In arrangements the leaf is often bent, folded back on itself or rolled into a loop ---------- */
const CW_T34AS=[{id:'vert',n:'Vert foncé',c:'#26462a'},{id:'milky-way',n:'Mouchetée crème (Milky Way)',c:'#3a5a34',g:'#2a4a2c',sp:'#e8e2b4'},
  {id:'variegata',n:'Panachée crème (Variegata)',c:'#c4c69a',g:'#2c4a2c',st:'#ece6c0'},{id:'asahi',n:'Pointe blanche (Asahi)',c:'#7a8a62',g:'#2c4a2c',tw:'#eeeacc'},
  {id:'okame',n:'Rayée jaune (Okame)',c:'#a6a24a',g:'#3a5a2c',st:'#d8cc5a'},{id:'teinte-lilas',n:'Teintée lilas',c:'#8a7aa8'},{id:'blanchie',n:'Blanchie crème',c:'#e6dcb8'}];
const T34_ASP=prof([[0,.06],[.08,.36],[.32,1],[.58,.9],[.82,.42],[.95,.1],[1,0]]);
function t34Aspi(g,t,o){const cw=fgCw(CW_T34AS,o),base=cw.g||cw.c,loop=o.spine&&rnd()<.3;
  return t34Plant(g,t,o,{cm0:50,pet:24,full:loop,pc:mix(base,'#6a7a40',.35),w0:3.4,w1:2.8,arch:R(-.05,.05),wig:.006,blade:(og,len,op,parts)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.3*yg)*(loop?.8:1);
    const vs=[.18,.36,.56,.76].flatMap(u=>[-u,u]).map(u=>({pts:[[u,.03],[u,.4],[u,.8],[u*.4,.98]]}));
    t34Blade(og,L,base,mix(base,'#8aa070',.35),{wp:(v)=>T34_ASP(v),wr:.22,th0:-.1+.15*yg,ka:loop?-5.4:-.45-.3*rnd(),lean:loop?0:(rnd()<.5?-1:1)*R(.2,.45)*(o.spine?.4:1),droop:loop?.02:o.spine?.08:.22,fold:.26,tw:loop?R(.5,.9):(rnd()<.5?-1:1)*R(.4,.8),wave:.02,nw:4,roll:yg*1.8,nv:loop?34:20,nu:5,gl:.7,shin:24,
      veins:[{pts:[[0,0],[0,.5],[0,.98]],w:Math.max(.7,L*.006),c:shd(base,.3),o:.6},...vs],vo:.35,
      paint:(gg,c,S,P)=>{let d='';
        if(cw.sp){const s0=Math.floor(L);let x=s0*7.13%1;for(let i=0;i<(DET>=1.5?70:40);i++){x=(x*9301+.4927)%1;const v=.06+.88*((i*.618)%1),u=(x*2-1)*.85;if(!t34In(c,v))continue;const q=t34Q(S,u,v),rr=Math.max(.5,L*.0035*(.6+x));d+=`M${f(q[0]-rr)},${f(q[1])}a${f(rr)},${f(rr*1.3)} 0 1,0 ${f(rr*2)},0a${f(rr)},${f(rr*1.3)} 0 1,0 ${f(-rr*2)},0`}
          if(d)E('path',{d,fill:cw.sp,opacity:.85},gg);return}
        if(cw.st){for(const[a,b]of[[.3,.42],[-.62,-.5],[.74,.8],[-.2,-.14]]){const pts=[];for(let i=0;i<=8;i++){const v=.04+.9*i/8;if(t34In(c,v))pts.push([a*(1-.5*Math.max(0,v-.8)/.2),v])}for(let i=8;i>=0;i--){const v=.04+.9*i/8;if(t34In(c,v))pts.push([b*(1-.5*Math.max(0,v-.8)/.2),v])}if(pts.length>3)d+=t34P(S,pts)}
          if(d)E('path',{d,fill:cw.st,opacity:.85},gg);return}
        if(cw.tw){let pts=[];for(let i=0;i<=10;i++){const u=-.98+i*.196;pts.push([u,.66+.06*Math.sin(i*2.1)-.04*Math.abs(u)])}for(let i=1;i<=6;i++)pts.push([.98,.7+.3*i/6]);for(let i=6;i>=1;i--)pts.push([-.98,.7+.3*i/6]);pts=t34Clip(c,pts);if(pts)E('path',{d:t34P(S,pts),fill:cw.tw,opacity:.82},gg)}}},parts)}})}

/* ---------- ti plant (Cordyline fruticosa): a slender cane ringed with leaf scars, crowned by a rosette of spirally set leaves on channelled petioles; the blades
   lanceolate, glossy, ascending then arching; green, red, wine, almost black, bright pink, or striped ('Kiwi'); 'Red Sister' burgundy-bronze edged with hot pink,
   its young leaves fuchsia. The youngest leaves stand up in the centre, still folded ---------- */
const CW_T34CO=[{id:'vert',n:'Vert (ti vert)',c:'#4c7a35',b:'#7a9a5a'},{id:'red-sister',n:'Bordeaux liseré rose (Red Sister)',c:'#9b1b30',g:'#5a2030',tip:'#d23a6a',mg:'#e0507a',b:'#8a3a4a'},
  {id:'rouge',n:'Rouge sang (Red Dragon)',c:'#7a1626',b:'#8a3040'},{id:'bordeaux-noir',n:'Bordeaux noir (Black Mystique)',c:'#3a1820',b:'#5a2a32'},
  {id:'rose',n:'Rose vif (Pink Diamond)',c:'#d4457a',g:'#5a3a3a',tip:'#e0609a',mg:'#e8709e',b:'#b06070'},{id:'chocolat',n:'Chocolat (Chocolate Queen)',c:'#4a2c22',b:'#6a4436'},
  {id:'kiwi',n:'Panachée crème et vert (Kiwi)',c:'#c4c69a',g:'#5a8a3a',st:'#e6e0a0',mg:'#c85a6a',b:'#9ab070'},{id:'noir-rouge',n:'Presque noir (Black Magic)',c:'#2a2220',b:'#4a3430'}];
const T34_COR=prof([[0,.12],[.1,.6],[.42,1],[.72,.8],[.92,.3],[1,0]]);
function t34Cord(g,t,o){const cw=fgCw(CW_T34CO,o),op=Math.max(.05,Math.min(1,o.op??1)),cm0=45,ks=o.spine?1:(o.cm||cm0)/cm0,len0=(o.cm||cm0)*UPC,k=G(g),Lt=o.spine?blen(o.spine):40*UPC*ks,
    A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.04,.1)),sc='#6a5a3e',cols=[shd(sc,-.55),shd(sc,-.2),sc,shd(sc,.4)],base=cw.g||cw.c;
  const r=fgGrow(k,A,{li:1.6*UPC*Math.min(1,ks),liT:.55,w0:4.4*Math.min(1.1,ks),w1:3,cols,uL:o.spine?.9:.84,phy:'spiral',la:22,face:.45,lift:.8,seg:10,wig:.008,
    nodeDraw:(og)=>{const[X0]=fgCross(og.H),w=og.w*.62,a=V3.add(og.pos,V3.sc(X0,-w)),b=V3.add(og.pos,V3.sc(X0,w)),q0=fgQ(a),q1=fgQ(b),m=fgQ(V3.add(og.pos,V3.sc(og.H,-og.w*.18)));
      return{z:og.pos[2]+.6,fn:par=>E('path',{d:`M${f(q0[0])},${f(q0[1])}Q${f(m[0])},${f(m[1])} ${f(q1[0])},${f(q1[1])}`,stroke:shd(sc,-.45),'stroke-width':.6,'stroke-opacity':.7,fill:'none'},par)}},node:1,
    leaf:(og,p)=>{const parts=[],u=p.tip?1:p.u,yg=p.tip?Math.min(1,.55+.6*(1-op)):Math.max(0,.75-op)/.75*Math.max(0,(u-.84)/.16),L=len0*(p.tip?.62:1-.18*Math.max(0,u-.9)/.1)*R(.9,1.06)*(1-.25*yg),pl=L*.18,
        col=cw.tip&&u>.94?mix(cw.c,cw.tip,Math.min(1,(u-.94)/.06)):cw.c,P1=V3.add(og.pos,V3.add(V3.sc(og.H,pl),[0,pl*.04,0]));
      t34Pet(og.pos,P1,og.w*.55,Math.max(.9,L*.012),[shd(col,-.6),shd(col,-.3),shd(col,-.05),shd(col,.3)],parts);
      t34Blade(Object.assign({},og,{pos:P1}),L,cw.st?base:col,cw.b,{wp:T34_COR,wr:.2,th0:p.tip?.1:-.05,ka:p.tip?-.2:-.85*R(.8,1.2),droop:p.tip?.02:.16,fold:.22+.6*yg,tw:R(-.6,.6),wave:.03,nw:3,roll:yg*1.4,nv:16,nu:4,gl:.85,shin:28,
        veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(.6,L*.008),c:shd(col,cw.st?-.1:.3),o:.6},...t34Pin(5,.12,.75,.22,.85).map(q=>({pts:q}))],
        paint:cw.mg||cw.st?(gg,c,S)=>{let d='',dm='';
          if(cw.st)for(const[a,b]of[[.08,.22],[-.4,-.28],[.5,.62],[-.7,-.64]]){const pts=[];for(let i=0;i<=7;i++){const v=.03+.92*i/7;if(t34In(c,v))pts.push([a,v])}for(let i=7;i>=0;i--){const v=.03+.92*i/7;if(t34In(c,v))pts.push([b,v])}if(pts.length>3)d+=t34P(S,pts)}
          if(cw.mg)for(const s of[-1,1]){const pts=[];for(let i=0;i<=8;i++){const v=.04+.92*i/8;if(t34In(c,v))pts.push([s,v])}for(let i=8;i>=0;i--){const v=.04+.92*i/8;if(t34In(c,v))pts.push([s*(.82-.06*Math.sin(i*1.7)),v])}if(pts.length>3)dm+=t34P(S,pts)}
          if(d)E('path',{d,fill:cw.st,opacity:.85},gg);if(dm)E('path',{d:dm,fill:cw.mg,opacity:.9},gg)}:null},parts);
      return parts}});
  open(k,t,1000,0,.4);return r}

/* ---------- prayer plants (Goeppertia, syn. Calathea; Ctenanthe): an oval to oblong blade on a slender petiole that ends in a swollen pulvinus (the leaf turns on it);
   the face painted along the lateral veins — silver bands (G. orbifolia), a feathered silver crown ('Medallion'), dark ovals on pale green (G. makoyana, peacock;
   G. lancifolia, rattlesnake, its margin waved), velvety dark bars (G. zebrina), a pink heart ('Rosy'), a mosaic (G. musaica 'Network'); the underside often purple ---------- */
const CW_T34CA=[{id:'medallion',n:'Médaillon argenté (Medallion)',c:'#2a4a2a',b:'#5c2140',pat:'med',p1:'#a8bea0',p2:'#4a7a48'},{id:'orbifolia',n:'Bandes argentées (orbifolia)',c:'#5a7a4e',b:'#a8b890',pat:'orb',p1:'#c4d0bc',round:1},
  {id:'makoyana',n:'Plumes de paon (makoyana)',c:'#b8c0b4',b:'#7a3a5a',pat:'mak',p1:'#2e4a2c',p2:'#d8dcc8'},{id:'lancifolia',n:'Écailles sombres, bord ondulé (lancifolia)',c:'#7a9a4a',b:'#5c2140',pat:'lan',p1:'#2c4224',lance:1},
  {id:'zebrina',n:'Zébrée velours (zebrina)',c:'#4a8a3a',b:'#6a3a5a',pat:'zeb',p1:'#22402a'},{id:'rosy',n:'Cœur rose (Rosy)',c:'#d6a2ac',g:'#2a4a2a',b:'#5c2140',pat:'rosy',p1:'#e0aab4'},
  {id:'network',n:'Mosaïque vert tendre (Network)',c:'#a8c060',b:'#b0c080',pat:'net',p1:'#4a6a2a'}];
const T34_CAL=prof([[0,.22],[.12,.72],[.42,1],[.72,.86],[.92,.42],[1,0]]),T34_ORB=prof([[0,.35],[.1,.8],[.42,1],[.75,.86],[.94,.4],[1,0]]),T34_LAN=prof([[0,.12],[.1,.5],[.35,.9],[.55,1],[.8,.62],[.95,.18],[1,0]]);
/* the marks along the lateral veins: at v (on the midrib), reaching u0..u1 across, rising to the tip as they go out */
const t34Mark=(s,v,u0,u1,h,rise=.1,n=6)=>{const A=[],B=[];for(let i=0;i<=n;i++){const t=i/n,u=u0+(u1-u0)*t,vv=v+rise*(u-u0)/Math.max(.1,1-u0),hh=h*Math.sin(Math.PI*(.12+.76*t));A.push([s*u,vv+hh]);B.push([s*u,vv-hh])}return A.concat(B.reverse())};
function t34CalPaint(cw,L){return(gg,c,S)=>{let d1='',d2='';const n=DET>=1.5?9:7,add=(p0,two)=>{const pts=t34Clip(c,p0);if(!pts)return;if(two)d2+=t34P(S,pts);else d1+=t34P(S,pts)};
  if(cw.pat==='orb')for(let i=0;i<n+2;i++){const v=.06+i*.84/(n+1);for(const s of[-1,1])add(t34Mark(s,v,.04,.9,.022,.12,7))}
  else if(cw.pat==='med'){for(const s of[-1,1]){const band=(a,b,zg)=>{const A=[],B=[],m=16;for(let i=0;i<=m;i++){const v=.07+.84*i/m,z=i%2?zg:-zg*.4,w=T34_CAL(v)/Math.max(.2,T34_CAL(v));A.push([s*(a+z*.5)*w,v+.02]);B.push([s*(b+z)*w,v+.05])}return A.concat(B.reverse())};
      add(band(.4,.7,.07));add(band(.03,.24,.05),1)}}
  else if(cw.pat==='mak'||cw.pat==='lan'){for(let i=0;i<n;i++){const v=.08+i*.8/(n-1);for(const s of[-1,1]){const big=(i+(s>0?1:0))%2===0;add(t34Mark(s,v,.05,big?.62:.34,big?.04:.03,.06,5));if(cw.pat==='mak')add(t34Mark(s,v+.045,.5,.88,.012,.08,4))}}}
  else if(cw.pat==='zeb')for(let i=0;i<n+3;i++){const v=.05+i*.86/(n+2);for(const s of[-1,1])add(t34Mark(s,v,.03,.9,.018,.14,6))}
  else if(cw.pat==='rosy'){for(const s of[-1,1]){const pts=[[0,.03]];for(let i=0;i<=12;i++){const v=.05+.86*i/12;pts.push([s*(.74*T34_CAL(v)/1+(i%2?-.08:.04))*Math.min(1,v*4),v])}pts.push([0,.96]);add(pts)}
    for(let i=0;i<n;i++){const v=.12+i*.7/(n-1);for(const s of[-1,1])add(t34Mark(s,v,.08,.5,.008,.08,3),1)}}
  else if(cw.pat==='net'){let d='';for(let i=0;i<n*2;i++){const v=.05+i*.86/(n*2-1);for(const s of[-1,1])if(t34In(c,v))d+=t34L(S,[[0,v],[s*.5,v+.05],[s*.9,v+.1]])}
    for(const u of[-.75,-.5,-.25,.25,.5,.75]){const pts=[];for(let i=0;i<=10;i++){const v=.06+.88*i/10;if(t34In(c,v))pts.push([u,v])}if(pts.length>1)d+=t34L(S,pts)}
    if(d)E('path',{d,stroke:cw.p1,'stroke-width':f(Math.max(.4,L*.003)),'stroke-opacity':.6,fill:'none'},gg);return}
  if(d1)E('path',{d:d1,fill:cw.p1,opacity:cw.pat==='mak'||cw.pat==='lan'||cw.pat==='zeb'?.92:.8},gg);if(d2)E('path',{d:d2,fill:cw.p2||cw.p1,opacity:.75},gg)}}
function t34Cala(g,t,o){const cw=fgCw(CW_T34CA,o),base=cw.g||cw.c;
  return t34Plant(g,t,o,{cm0:28,pet:36,pc:'#5a7040',w0:2.4,w1:1.9,arch:R(-.14,.14),wig:.018,blade:(og,len,op,parts,cols)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.3*yg)*(cw.lance?1.25:1),pv=len*.09;
    /* the pulvinus: a swollen, darker joint at the top of the petiole, the blade set on it at an angle */
    const P1=V3.add(og.pos,V3.sc(og.H,pv));t34Pet(og.pos,P1,og.w*1.35,og.w*1.15,[shd(cols[2],-.6),shd(cols[2],-.35),shd(cols[2],-.1),shd(cols[2],.25)],parts);
    t34Blade(Object.assign({},og,{pos:P1}),L,base,cw.b,{wp:cw.round?T34_ORB:cw.lance?T34_LAN:T34_CAL,wr:cw.round?.86:cw.lance?.3:.56,th0:-.45+.3*yg,ka:-.5,droop:.08,fold:-.16,tw:(rnd()<.5?-1:1)*R(.5,.85),wave:cw.lance?.18:0,nw:cw.lance?7:3,roll:yg*1.8,nv:cw.lance?26:20,nu:6,
      gl:cw.pat==='zeb'?0:.35,shin:18,across:1.3,veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(.6,L*.008),c:cw.pat==='med'||cw.pat==='rosy'?'#c8d4b8':shd(base,.3),o:.7},...t34Pin(9,.06,.86,.12,.95).map(q=>({pts:q}))],vo:.3,
      paint:t34CalPaint(cw,L)},parts)}})}

/* ---------- bird-of-paradise leaves (Strelitzia reginae): a stiff paddle, oblong to lanceolate, thick and leathery, blue-green and glaucous (matt bloom), on a long, stout,
   channelled petiole; a broad pale midrib, fine parallel lateral veins running out to the margin; the blade tears along those veins into strips, more on old leaves ---------- */
const CW_T34ST=[{id:'vert-bleute',n:'Vert bleuté',c:'#5a7a6a',b:'#8aa098'},{id:'glauque',n:'Gris-vert glauque',c:'#7d8c7c',b:'#a4b0a2'},{id:'vert-sombre',n:'Vert sombre',c:'#2e4a30',b:'#6a8270'}];
const T34_STR=prof([[0,.12],[.06,.55],[.2,.92],[.5,1],[.78,.9],[.93,.5],[1,0]]);
function t34Stre(g,t,o){const cw=fgCw(CW_T34ST,o),tears=[];for(const s of[-1,1]){let v=.12+R(0,.15);while(v<.86){if(rnd()<.55)tears.push({s,v,d:R(.35,.92)});v+=R(.08,.2)}}
  const wp=(v,s)=>{let w=T34_STR(v);for(const q of tears)if(q.s===s){const x=Math.abs(v-q.v-.02)/.022;if(x<1)w*=1-q.d*(1-x)}return w};
  return t34Plant(g,t,o,{cm0:38,pet:60,pc:mix(cw.c,'#8a9a70',.4),w0:6,w1:4.6,arch:R(-.06,.06),wig:.005,blade:(og,len,op,parts)=>{const yg=Math.max(0,.75-op)/.75,L=len*(1-.3*yg);
    t34Blade(og,L,cw.c,cw.b,{wp:yg>.3?(v)=>T34_STR(v):wp,wr:.36,th0:-.25+.2*yg,ka:-.45,droop:.07,fold:.3,tw:(rnd()<.5?-1:1)*R(.35,.6),wave:.03,nw:2,roll:yg*1.9,nv:yg>.3?18:42,nu:6,gl:.22,shin:14,across:1.1,
      veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(1.2,L*.022),c:mix('#d8d0a0',cw.c,.15),o:.85},...t34Pin(14,.06,.9,.14,.97).map(q=>({pts:q}))],vo:.28,
      paint:(gg,c,S,P)=>{let d='';for(const q of tears){if(yg>.3||!t34In(c,q.v))continue;const u0=1-q.d;d+=t34L(S,[[q.s*u0,q.v+.02-.06*q.d],[q.s*(u0+1)/2,q.v+.02-.03*q.d],[q.s,q.v+.02]])}
        if(d)E('path',{d,stroke:P.d2,'stroke-width':.7,'stroke-opacity':.7,fill:'none','stroke-linecap':'round'},gg)}},parts)}})}

/* ---------- registers ---------- */
Object.assign(GH,{'philodendron-hybrides':t34Philo,'aspidistra-elatior':t34Aspi,'cordyline-fruticosa-ti':t34Cord,'goeppertia-calathea':t34Cala,'strelitzia-feuilles':t34Stre});
Object.assign(CWS,{'philodendron-hybrides':CW_T34PH,'aspidistra-elatior':CW_T34AS,'cordyline-fruticosa-ti':CW_T34CO,'goeppertia-calathea':CW_T34CA,'strelitzia-feuilles':CW_T34ST});
/* commercial grades, in the recipe's unit: the length of the blade (cordyline: of its longest leaves) */
Object.assign(SZG,{'philodendron-hybrides':[25,30,40],'aspidistra-elatior':[40,50,60],'cordyline-fruticosa-ti':[35,45,55],'goeppertia-calathea':[20,28,35],'strelitzia-feuilles':[30,38,50]});
/* in a bouquet the composer lets these leaves rise on their petioles behind the flowers: only the top of the spine, where the blade starts, must clear the lip (c4.js) */
for(const fn of[t34Philo,t34Aspi,t34Cord,t34Cala,t34Stre])fn.bigLeaf={ext:14,k0:12};
