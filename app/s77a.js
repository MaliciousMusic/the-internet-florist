/* ================= Serre, lot 77 — dracænas et lin : Dracaena reflexa « Song of India », D. marginata, D. fragrans, D. surculosa (gold dust), Phormium (lin de Nouvelle-Zélande) ================= */
/* chaque tige est poussée par le L-système : la canne suit son chemin (épine du Composer, arc d'une planche), ses nœuds portent les feuilles en spirale, en touffe ou en verticilles,
   les cicatrices foliaires marquent la canne nue ; les feuilles sont des nappes 3D (g35 du lot 35, t34 du lot 34) bordées, rayées ou tachetées ; contrat des feuillages : {k, bw, bw1, bc, neck, nd} */
const l77Op=o=>Math.max(.05,Math.min(1,o.op??1)),l77Cols=c=>[shd(c,-.58),shd(c,-.25),c,shd(c,.4)];
/* ---------- the lot's leaf: g35Leaf (lot 35) with its variegation as nested bands (vrs [{c, k(y)}], outermost first: a coloured margin, a cream stripe, a green centre)
   and spots painted on the upper face (spots [[x, y, r]] in leaf lengths); in a bouquet it keeps above the mouth (lim), shrinking, or is dropped ---------- */
function l77Leaf(P0,H,N,len,sh,c,cb,o={}){const M=g35Surf(P0,H,N,len,o),det=DET>=1.5&&!LOD,P=pal7(c),PB=pal7(cb),mid=sh.mid||[[0,0],[0,.5],[0,1]];
  const half=side=>{const ol=sh[side],sg=side==='R'?1:-1;let cx=0,cy=0;for(const[x,y]of ol){cx+=x;cy+=y}cx=cx/ol.length*.6;cy/=ol.length;const n=g35Nrm(M,cx||sg*.05,cy),fr=n[2]>=0,
      pts=mid.map(([x,y])=>M(x,y)).concat(ol.slice().reverse().map(([x,y])=>M(x,y))),z=ol.reduce((a,[x,y])=>a+M(x,y)[2],0)/ol.length;
    return{ol,sg,n,fr,pts:pts.map(g35Q).filter((q,i,A)=>{const r=A[(i+1)%A.length];return Math.abs(q[0]-r[0])+Math.abs(q[1]-r[1])>1e-3}),z,I:lightI(fr?n:V3.sc(n,-1))+(o.dI||0)}};
  const hs=[half('L'),half('R')].sort((a,b)=>a.z-b.z),z=(hs[0].z+hs[1].z)/2,anyF=hs[0].fr||hs[1].fr;
  if(o.lim!=null&&hs.some(h=>h.pts.some(q=>-q[1]<o.lim)))return(o.fk??1)>.6?l77Leaf(P0,H,N,len*.8,sh,c,cb,Object.assign({},o,{fk:(o.fk??1)*.8,droop:(o.droop||0)*.7})):{z:0,cast:false,fn:()=>{}};
  return{z:z+(o.zb||0),cast:false,fn:par=>{const sm=o.sm?smooth:g35D;
    for(const h of hs){const col=toneAt(h.fr?P:PB,h.I);
      E('path',LOD?{d:sm(h.pts),fill:col}:{d:sm(h.pts),fill:col,stroke:(h.fr?P:PB).ink,'stroke-width':det?.35:.42,'stroke-opacity':.34,'stroke-linejoin':'round'},par);
      if(LOD)continue;
      if(h.fr||o.vrB&&det)for(const b of o.vrs||[]){const ip=mid.map(([x,y])=>M(x,y)).concat(h.ol.slice().reverse().map(([x,y])=>M(x*b.k(y),y)));E('path',{d:sm(ip.map(g35Q)),fill:toneAt(pal7(h.fr?b.c:mix(b.c,cb,.35)),h.I)},par)}
      if(!h.fr)continue;
      if(o.spots){let d='';for(const[x,y,r]of o.spots){if(Math.sign(x)!==h.sg)continue;const q=[];for(let i=0;i<6;i++){const a=i*Math.PI/3;q.push(g35Q(M(x+Math.cos(a)*r,y+Math.sin(a)*r*1.25)))}d+=smooth(q)}
        if(d)E('path',{d,fill:toneAt(pal7(o.spotC),h.I+.06),opacity:.92},par)}}
    if(det&&o.veins){let d='';for(const L of o.veins)d+='M'+L.map(([x,y])=>{const q=g35Q(M(x,y));return f(q[0])+','+f(q[1])}).join('L');
      E('path',{d,stroke:anyF?(o.vc||P.d1):PB.d1,'stroke-width':.4,'stroke-opacity':.4,fill:'none','stroke-linecap':'round'},par)}
    if(o.gloss&&det&&anyF){const h=hs[1].fr?hs[1]:hs[0],sg=h.sg,A=[],B=[];for(let i=2;i<9;i++){const y=i/10;A.push(g35Q(M(sg*.1*g35Xw(sh,y),y)));B.push(g35Q(M(sg*.5*g35Xw(sh,y),y)))}E('path',{d:smooth(A.concat(B.reverse())),fill:'#ffffff',opacity:f(.2*o.gloss)},par)}}}}
/* ---------- the leaf scars of a bare cane: a narrow crescent across the front of the cane at each node below the leaves (the base of a fallen leaf), batched into a few parts ---------- */
function l77Scars(nds,sc,parts,o={}){if(!nds.length||LOD)return;const per=o.per||9,col=shd(sc,o.dk??-.5),hi=mix(sc,'#e8e0c8',.35);
  for(let a=0;a<nds.length;a+=per){let d='',dh='',z=0;const sl=nds.slice(a,a+per);
    for(const og of sl){let F=V3s([0,0,1],V3.sc(og.H,og.H[2]));F=V3l(F)>1e-3?V3.nz(F):fgCross(og.H)[0];const S=V3.cr(og.H,F),w=og.w*.44,h=Math.max(.55,og.w*(o.h||.14)),ph=(og.p.u*37)%1*.5,
        arc=(dy,k)=>{const q=[];for(let i=0;i<=8;i++){const t=Math.PI*(.08+.84*i/8);q.push(fgQ(V3.add(V3.add(og.pos,V3.sc(og.H,dy-og.w*.12*Math.sin(t)*k)),V3.add(V3.sc(S,Math.cos(t+ph*.4)*w),V3.sc(F,Math.sin(t)*w)))))}return q};
      const A=arc(0,1),B=arc(-h,1).reverse();d+=fgD(A.concat(B));if(o.hi)dh+=fgD(arc(h*.9,1).concat(arc(0,1).reverse()));z+=og.pos[2]+og.w*.5}
    parts.push({z:z/sl.length+.01,cast:false,fn:par=>{E('path',{d,fill:col,opacity:.8},par);if(dh)E('path',{d:dh,fill:hi,opacity:.55},par)}})}}
/* a variegation band's half-width along the blade (k at its middle, narrowing a little toward the tip, a slight wave) */
const l77K=(k,wv=0,ph=0)=>y=>Math.max(.05,k*(1-.25*Math.max(0,y-.7)/.3)*(1+wv*Math.sin(y*19+ph)));
/* a leaf turned further away from its cane (by a degrees, in the plane of the cane's direction T and the leaf's own): the lower leaves of a crown spread wider */
const l77Div=(og,T,a)=>{const ax=V3.cr(T,og.H);if(V3l(ax)<1e-4||!a)return og;const H=rotA(og.H,V3.nz(ax),a*D),U=rotA(og.U,V3.nz(ax),a*D);return Object.assign({},og,{H,U,L:V3.cr(U,H)})};
const L77_MID=Array.from({length:15},(_,i)=>[0,i/14]);

/* ---------- Song of India (Dracaena reflexa 'Song of India', Pleomele): slender woody stems that lean and curve, clothed almost to the base in leaves set in a tight spiral;
   the leaves lanceolate, sessile and clasping, 10–20 cm long and 1.5–2.5 cm wide, leathery, reflexed (bent back from the stem and arching down), margins broad golden-yellow to cream over a
   green centre ('Song of Jamaica': dark green with a pale centre stripe; 'Anita': plain green); at the tip of every stem the youngest leaves stand up in a tight rosette ---------- */
const CW_L77SI=[{id:'song-of-india',n:'Bordé jaune d’or (Song of India)',c:'#d4b030',lf:'#d6bc44',g:'#4c7a32',k:.5},
  {id:'song-of-jamaica',n:'Vert foncé, centre vert tendre (Song of Jamaica)',c:'#a8c47a',lf:'#2c5228',g:'#a2bc6c',k:.3},{id:'anita',n:'Vert uni (Anita)',c:'#4c7a35',lf:'#467432'}];
const L77_SIW=prof([[0,.26],[.07,.56],[.28,1],[.58,.86],[.84,.44],[1,0]]);
function l77Refl(g,t,o){const cw=fgCw(CW_L77SI,o),op=l77Op(o),cm0=15,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g);
  return g35Run(o,'l77si',()=>{const Lt=o.spine?blen(o.spine):42*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.12,.24)),sc='#8a8458',cols=l77Cols(sc),sh=Object.assign(g35Prof(L77_SIW,.14,14),{mid:L77_MID}),nds=[];
    return fgGrow(k,A,{li:1.05*UPC*Math.min(1,ks),liT:.55,w0:3.6*Math.min(1.1,ks),w1:2.1,cols,uL:o.spine?.45:.3,phy:'spiral',la:64,lp:.8,face:.35,lift:.5,seg:8,wig:.01,node:1,
      nodeDraw:og=>{if(og.p.u<(o.spine?.45:.3))nds.push(og);return null},
      leaf:(og,p)=>{const u=p.tip?1:p.u,top=Math.max(0,(u-.8)/.2),yg=p.tip?Math.min(1,.6+.5*(1-op)):top*top*Math.max(.25,1-op*.7),
          L=cm0*UPC*(o.spine?1:ks)*(p.tip?.42:1-.48*top)*R(.88,1.08),lc=mix(cw.lf,shd(cw.lf,R(-.08,.08)),.5);
        return l77Leaf(og.pos,V3.nz(og.H),V3.nz(og.U),L,sh,lc,mix(cw.lf,'#d8e0a8',.55),{lim:g35Lim(o),fold:.14+.9*yg,arch:.07-.06*yg,droop:(p.tip?.02:.24-.16*yg)*R(.8,1.2),cup:.03,wave:.012,wk:4,wph:R(0,6),tw:R(-.7,.7),bend:R(-.08,.08),sm:1,
          vrs:cw.g?[{c:cw.g,k:l77K(cw.k,.05,R(0,6))}]:null,vrB:1,gloss:.7,dI:.06,veins:[L77_MID]})},
      post:(res,parts)=>l77Scars(nds,sc,parts,{h:.12})})})}

/* ---------- Madagascar dragon tree (Dracaena marginata, syn. D. reflexa var. angustifolia): thin, bare, grey-brown canes ringed with the crescent scars of fallen leaves, closer and closer
   toward the top, often curving; at the tip a dense tuft of linear leaves 30–60 cm long and under 1 cm wide, stiff at the base then arching and twisting, the youngest upright in the heart;
   green edged with a thin red line ('Marginata'), 'Bicolor'/'Tricolor' striped cream between the green centre and the red edge, 'Colorama' mostly pink-red, 'Magenta' deep wine ---------- */
const CW_L77MA=[{id:'marginata',n:'Vert liseré rouge (Marginata)',c:'#26422a',m:'#a02a3a',b:[{c:'#2e5030',k:.74}]},
  {id:'magenta',n:'Bordeaux (Magenta)',c:'#7a1e2e',m:'#7a1e2e',b:[{c:'#4a2228',k:.52}]},
  {id:'colorama',n:'Rose vif (Colorama)',c:'#d36a8a',m:'#c03e5e',b:[{c:'#d77290',k:.8},{c:'#4a5a34',k:.16}]},
  {id:'tricolor',n:'Tricolore crème, vert et rouge (Tricolor)',c:'#c8c08a',m:'#b03a48',b:[{c:'#e6dca8',k:.8},{c:'#3a5a32',k:.42}]}];
const L77_MAW=prof([[0,.5],[.05,.82],[.2,1],[.7,.92],[.9,.55],[1,0]]);
function l77Marg(g,t,o){const cw=fgCw(CW_L77MA,o),op=l77Op(o),cm0=45,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g);
  return g35Run(o,'l77ma',()=>{const Lt=o.spine?blen(o.spine):44*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.1,.2)),sc='#8a8070',cols=l77Cols(sc),sh=Object.assign(g35Prof(L77_MAW,.028,14),{mid:L77_MID}),nds=[],uL=o.spine?.84:.8,Tt=A.at(1).T;
    return fgGrow(k,A,{li:1.3*UPC*Math.min(1,ks),liT:.84,w0:3.4*Math.min(1.1,ks),w1:2.6,cols,uL,phy:'spiral',la:26,face:.3,lift:.6,seg:8,wig:.008,node:1,
      nodeDraw:og=>{if(og.p.u<uL)nds.push(og);return null},
      leaf:(og,p)=>{const u=p.tip?1:p.u,top=Math.max(0,(u-uL)/(1-uL)),yg=p.tip?Math.min(1,.6+.5*(1-op)):Math.pow(top,3)*Math.max(.3,1-op*.6),
          L=cm0*UPC*(o.spine?.62:ks*.82)*(p.tip?.5:1-.4*top*top)*R(.85,1.1),lc=mix(cw.m,shd(cw.m,R(-.06,.06)),.5);
        if(!p.tip)og=l77Div(og,Tt,(1-top)*R(26,40));
        return l77Leaf(og.pos,V3.nz(og.H),V3.nz(og.U),L,sh,lc,mix(cw.b[cw.b.length-1].c,'#a8b890',.3),{lim:g35Lim(o),fold:.2+.5*yg,arch:.1*(1-yg),droop:(p.tip?.03:.3-.2*yg)*R(.75,1.2),wave:.006,wk:3,wph:R(0,6),tw:R(-.9,.9)*(1-.6*yg),bend:R(-.1,.1),sm:1,
          vrs:cw.b.map(b=>({c:b.c,k:l77K(b.k)})),vrB:1,gloss:.5,dI:.02})},
      post:(res,parts)=>l77Scars(nds,sc,parts,{h:.16,hi:1,per:10})})})}

/* ---------- corn plant (Dracaena fragrans, 'Massangeana', 'Janet Craig', 'Lemon Lime', 'Warneckii'): a stout cane, grey-brown and ringed with leaf scars, crowned by a rosette of broad
   strap leaves 40–90 cm long and 5–10 cm wide, glossy, a little waved at the margin, rising then arching over; plain dark green ('Janet Craig'), a broad yellow band down the centre
   ('Massangeana'), chartreuse edged with dark green and white lines ('Lemon Lime'), grey-green finely striped white ('Warneckii'); the young leaves rolled upright in the heart ---------- */
const CW_L77FR=[{id:'janet-craig',n:'Vert foncé uni (Janet Craig)',c:'#26452a'},{id:'massangeana',n:'Bande centrale jaune (Massangeana)',c:'#a8b440',g:'#2c5428',band:[{a:.3,c:'#c8c444',wv:.1}]},
  {id:'lemon-lime',n:'Citron vert liseré (Lemon Lime)',c:'#b8c63a',g:'#2c5428',band:[{a:.8,c:'#b4c63a',wv:0},{a:.86,b:.8,c:'#eef0d8'}],lines:[{a:.22,c:'#e8ecc8'}]},
  {id:'warneckii',n:'Vert gris rayé blanc (Warneckii)',c:'#6a8a5a',g:'#4a6e44',band:[{a:.86,b:.82,c:'#e8ecd8'}],lines:[{a:.12,c:'#dce4cc'},{a:.4,c:'#e2e8d2'}]}];
const L77_FRW=prof([[0,.28],[.06,.6],[.2,.94],[.5,1],[.8,.86],[.94,.42],[1,0]]);
/* a band of the blade between |u| = b and a (b: inner edge, none = from the midrib) on both sides of the midrib, painted on the rows of the sheet's band (lot 34's t34P) */
function l77Band(c,S,a,b,wv,ph){const out=[];const m=14,v0=.03,v1=.97,w=(v,s)=>a*(1+wv*Math.sin(v*23+ph+s))*(v>.86?1-.3*(v-.86)/.14:1);
  if(b==null){const pts=[];for(let i=0;i<=m;i++){const v=v0+(v1-v0)*i/m;if(t34In(c,v))pts.push([w(v,0),v])}for(let i=m;i>=0;i--){const v=v0+(v1-v0)*i/m;if(t34In(c,v))pts.push([-w(v,1),v])}if(pts.length>3)out.push(t34P(S,pts))}
  else for(const s of[-1,1]){const pts=[];for(let i=0;i<=m;i++){const v=v0+(v1-v0)*i/m;if(t34In(c,v))pts.push([s*a,v])}for(let i=m;i>=0;i--){const v=v0+(v1-v0)*i/m;if(t34In(c,v))pts.push([s*b,v])}if(pts.length>3)out.push(t34P(S,pts))}
  return out.join('')}
/* the blade of lot 34 (t34Blade) kept above the mouth in a bouquet: shorter and less arched until it clears, else left out */
function l77Fit(og,len,o,lim){if(lim==null)return{len,o};let L=len,q=Object.assign({},o);for(let i=0;i<5;i++){const S=t34S(og,L,q);let ok=true;for(let j=2;j<=10&&ok;j++)for(const u of[-1,0,1])if(S(u,j/10)[1]<lim){ok=false;break}
    if(ok)return{len:L,o:q};L*=.82;q=Object.assign({},q,{ka:q.ka*.7,droop:(q.droop||0)*.6})}return null}
function l77Frag(g,t,o){const cw=fgCw(CW_L77FR,o),op=l77Op(o),cm0=60,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g);
  return g35Run(o,'l77fr',()=>{const Lt=o.spine?blen(o.spine):30*UPC*ks,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.05,.12)),sc='#7a7458',cols=l77Cols(sc),nds=[],uL=o.spine?.8:.74,base=cw.g||cw.c,Tt=A.at(1).T;
    return fgGrow(k,A,{li:1.9*UPC*Math.min(1,ks),liT:.72,w0:8*Math.min(1.1,ks),w1:6.4,cols,uL,phy:'spiral',la:30,face:.5,lift:.7,seg:9,wig:.006,node:1,
      nodeDraw:og=>{if(og.p.u<uL)nds.push(og);return null},
      leaf:(og,p)=>{const parts=[],u=p.tip?1:p.u,top=Math.max(0,(u-uL)/(1-uL)),yg=p.tip?Math.min(1,.62+.5*(1-op)):Math.pow(top,3)*Math.max(.3,1-op*.6),
          L0=cm0*UPC*(o.spine?.55:ks*.75)*(p.tip?.55:1-.3*top*top)*R(.88,1.08);if(!p.tip)og=l77Div(og,Tt,(1-top)*R(10,24));
        const ft=l77Fit(og,L0,{wp:L77_FRW,wr:.13,th0:p.tip?.25:.2-.25*(1-yg),ka:p.tip?-.15:-(1.5-1.1*yg)*R(.8,1.2),droop:p.tip?.02:.1,fold:.16+.55*yg,tw:R(-.5,.5)*(1-yg),wave:.05,nw:5,ph:R(0,6),roll:yg*.9},g35Lim(o));if(!ft)return null;
        const L=ft.len,col=mix(base,shd(base,R(-.06,.06)),.5),ph=R(0,6);
        t34Blade(og,L,col,mix(base,'#a8b890',.35),Object.assign(ft.o,{nv:LOD?7:DET>=1.5?14:9,nu:4,gl:DET>=1.5?.75:0,shin:28,across:DET>=1.5?1.2:0,
          veins:DET>=1.5?[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(.6,L*.006),c:shd(col,.25),o:.5}]:null,
          paint:cw.band||cw.lines?(gg,c,S)=>{for(const b of cw.band||[]){const d=l77Band(c,S,b.a,b.b,b.wv||0,ph);if(d)E('path',{d,fill:b.c,opacity:.95},gg)}
            for(const ln of cw.lines||[]){const d=l77Band(c,S,ln.a+.025,ln.a-.025,0,0);if(d)E('path',{d,fill:ln.c,opacity:.85},gg)}}:null}),parts);
        return parts},
      post:(res,parts)=>l77Scars(nds,sc,parts,{h:.1,hi:1,per:8})})})}

/* ---------- gold dust dracaena (Dracaena surculosa, syn. D. godseffiana): thin wiry canes, green turning brown, branching, the nodes far apart; at each node a false whorl of 2–3 leaves
   on short petioles, elliptic, 5–10 cm, pointed, glossy deep green spotted cream-yellow ('Gold Dust'), so densely in 'Florida Beauty' that the green shows only as islands,
   'Juanita' with a cream stripe down the midrib; the shoots end in two young leaves still folded ---------- */
const CW_L77SU=[{id:'gold-dust',n:'Vert taché d’or (Gold Dust)',c:'#2a4a26',sp:'#e2d48a',n0:14,r:.045},{id:'florida-beauty',n:'Constellé crème (Florida Beauty)',c:'#b8b890',lf:'#e2dcb2',n0:30,r:.07,g:'#2e5028'},
  {id:'juanita',n:'Strié or, taché (Juanita)',c:'#c8b448',lf:'#2e4e28',sp:'#e6d690',n0:12,r:.04,st:'#dccc66'}];
const L77_SUW=prof([[0,.08],[.07,.1],[.16,.52],[.4,.97],[.6,1],[.82,.7],[.95,.22],[1,0]]);
function l77Surc(g,t,o){const cw=fgCw(CW_L77SU,o),op=l77Op(o),cm0=8,ks=o.spine?1:(o.cm||cm0)/cm0,kl=o.spine?1:.6+.4*ks,k=G(g);
  return g35Run(o,'l77su',()=>{const Lt=o.spine?blen(o.spine):44*UPC*kl,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.06,.16)),sc='#6a7044',cols=l77Cols(sc),Le=A.L,l0=A.l0||0,nodes=[],gr=cw.g||cw.lf||cw.c,
      sh=Object.assign(g35Prof(L77_SUW,.4,14),{mid:[[0,0],[0,.5],[0,1]]}),Fr=A.at(.7).Fr;
    for(let l=l0+(o.spine?Math.max(9*UPC,(Le-l0)*.3):Le*.18);l<Le-2*UPC*kl;l+=4.2*UPC*kl*R(.85,1.15))nodes.push(l);
    const nn=nodes.length,brI=new Set();for(let i=1;i<nn-2;i++)if(rnd()<(o.spine?.22:.3)&&brI.size<2)brI.add(i);
    /* a whorl W(i): 2 or 3 leaves round the node; a branch B(n): its internode, its whorl, then on, ending in its folded tip leaves */
    const whorl=(i,q,ph)=>{const nl=rnd()<.45?3:2,out=[['Nd',{u:q}]];for(let j=0;j<nl;j++)out.push(['[',{}],['/',{a:ph+j*360/nl+R(-15,15)}],['&',{a:R(48,62)}],['Lv',{q}],[']',{}]);return out};
    const rules={B:p=>p.n<=0?[['F',{l:1.4*UPC*kl,w1:1.2,e:.03}],['[',{}],['&',{a:8}],['Lv',{q:1,tip:1}],[']',{}],['[',{}],['/',{a:180}],['&',{a:14}],['Lv',{q:1,tip:1}],[']',{}]]
      :[['F',{l:3.4*UPC*kl*R(.85,1.15),w1:Math.max(1.2,p.w*(.7+.3*p.n/p.n0)),e:.04}],...whorl(0,.6+.4*(1-p.n/p.n0),p.ph+p.n*90),['B',Object.assign({},p,{n:p.n-1})]]};
    const res=l44Main(A,nodes,{w0:2.6*Math.min(1.15,kl),w1:1.6,cols,step:8,depth:8,rules,
      node:(i,u,w)=>{const out=whorl(i,u,i*97+R(-20,20));if(brI.has(i)){const n0=Math.round(R(2,3));out.push(['[',{w:w*.7}],['/',{a:i*97+60+R(-20,20)}],['&',{a:R(30,42)}],['$',{v:Fr}],['B',{n:n0,n0,w:w*.7,ph:R(0,360)}],[']',{}])}return out}});
    /* the tip of the main cane: two young leaves */
    const parts=[],T=res.organs.find(q=>q.t==='T');lsChainParts(res.chains,[0,0,0],cols,parts,{piece:DET>=1.5?7:12});
    const leaf=(og,q,tip)=>{const yg=tip?Math.min(1,.55+.5*(1-op)):0,L=cm0*UPC*(o.spine?1:ks)*(tip?.5:.85+.25*Math.min(1,q))*R(.88,1.1),F=fgFace(og,Fr,.55),H=V3.nz(F.H),N=V3.nz(F.U),P0=og.pos;
      const spots=[];if(!tip){let n=Math.round(cw.n0*(DET>=1.5?1:.7));for(let s=0;s<n*3&&spots.length<n;s++){const y=R(.06,.92),xw=g35Xw(sh,y)*.82,x=R(-xw,xw);if(Math.abs(x)>.02)spots.push([x,y,cw.r*R(.5,1.2)*(cw.g?1.2:1)])}}
      const lf=l77Leaf(P0,H,N,L,sh,cw.lf||cw.c,mix(gr,'#a0b080',.35),{lim:g35Lim(o),fold:.1+.8*yg,arch:.05,droop:tip?.02:.1,cup:.04,tw:R(-.4,.4),bend:R(-.06,.06),sm:1,wave:.01,wk:3,
        vrs:cw.st?[{c:cw.st,k:y=>.16*(1-y*.6)}]:null,spots:spots.length?spots:null,spotC:cw.g?gr:cw.sp,gloss:.9,dI:.02,veins:[[[0,0],[0,.5],[0,.97]]]});
      /* in Florida Beauty the leaf is cream and the spots are the green islands */
      return[lf]};
    for(const og of res.organs){if(og.t==='Lv')parts.push(...leaf(og,og.p.q,og.p.tip));else if(og.t==='Nd'){const w=og.w;parts.push(l44Ring(og,w,mix(sc,'#8a7a50',.4)))}}
    if(T)for(const[a,r]of[[8,0],[14,180]]){const og=Object.assign({},T,{H:rotA(T.H,T.L,a*D)});og.H=rotA(og.H,T.H,r*D);parts.push(...leaf(og,1,1))}
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- New Zealand flax (Phormium tenax, P. cookianum and their hybrids): a cut leaf, sword-shaped, stiff and leathery, 0.6–2 m long; folded in a V along its keel at the base
   (the leaves of the fan ride on one another), opening flat upward, the tip arching and often a little twisted; the margin and keel lined orange-red in the species; green, bronze-purple
   ('Purpureum', 'Platt's Black'), striped pink, red and bronze ('Maori Queen', 'Rainbow Queen'), golden with green lines ('Yellow Wave'), cream and green ('Variegatum') ---------- */
const CW_L77PH=[{id:'tenax',n:'Vert (tenax)',c:'#4c7a35',b:'#6a8a50',mg:'#c0603a'},{id:'purpureum',n:'Bronze pourpré (Purpureum)',c:'#5a3530',b:'#6a4a40',mg:'#a04a30'},
  {id:'maori-queen',n:'Rayé rose et bronze (Maori Queen)',c:'#e0907a',g:'#76583a',b:'#8a6a4a',mg:'#c43a3a',st:[[.78,1,'#e2806e'],[.42,.6,'#eaa48c'],[.06,.18,'#d67a68']]},
  {id:'yellow-wave',n:'Jaune or, rayures vertes (Yellow Wave)',c:'#d9c23a',g:'#c8b83a',b:'#a8a85a',st:[[.88,1,'#5a7a34'],[.4,.48,'#6a8a3a'],[.66,.7,'#7a9a40']]},
  {id:'variegatum',n:'Panaché crème et vert (Variegatum)',c:'#c4c69a',g:'#4c7a35',b:'#8a9a6a',mg:'#c86a40',st:[[.82,.94,'#ece6c4'],[.4,.56,'#e8e2bc'],[.1,.16,'#e4dfb4']]},
  {id:'platts-black',n:'Presque noir (Platt’s Black)',c:'#2e2424',b:'#4a3a34',mg:'#5a2a2a'}];
const L77_PHW=prof([[0,.3],[.08,.52],[.25,.88],[.5,1],[.78,.86],[.94,.4],[1,0]]);
/* the leaf along the axis grown by the turtle: its centreline the grown chain, its face toward the front (Fr) twisting slowly; across, the blade is folded in a V on its keel,
   tight at the base and opening flat by a third of its length (φ: the angle of each half above flat) */
function l77PhS(C,Fr0,len,W,o){const n=C.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(C[i],C[i-1])));const Lc=cum[n-1]||1,tw=o.tw||0,f0=o.f0??1.15,f1=o.f1??.12,dr=o.droop||0;
  const at=v=>{const l=v*Lc;let i=1;while(i<n-1&&cum[i]<l)i++;const t=Math.max(0,Math.min(1,(l-cum[i-1])/((cum[i]-cum[i-1])||1))),p=V3.add(C[i-1],V3.sc(V3s(C[i],C[i-1]),t)),T=V3.nz(V3s(C[Math.min(n-1,i+1)],C[Math.max(0,i-2)]));return{p,T}};
  return(u,v)=>{const{p,T}=at(v),a=tw*v*v;let N=V3s(Fr0,V3.sc(T,V3.dot(Fr0,T)));N=V3l(N)>1e-6?V3.nz(N):fgCross(T)[0];N=rotA(N,T,a);const X=V3.cr(T,N),w=W*o.wp(v),ph=f1+(f0-f1)*(1-sm01(Math.min(1,v/.34))),x=u*w*Math.cos(ph),y=Math.abs(u)*w*Math.sin(ph);
    return V3.add(V3.add(p,V3.add(V3.sc(X,x),V3.sc(N,y))),[0,-len*dr*Math.max(0,v-.55)**2,0])}}
function l77Phor(g,t,o){const cw=fgCw(CW_L77PH,o),op=l77Op(o),cm0=100,ks=o.spine?1:(o.cm||cm0)/cm0,k=G(g);
  return g35Run(o,'l77ph',()=>{const Lt=o.spine?blen(o.spine):cm0*UPC*ks*.94,A=fgAxis(o,Lt,(rnd()<.5?-1:1)*R(.24,.4)),yg=Math.max(0,.6-op)/.6,base=cw.g||cw.c,cols=l77Cols(shd(base,-.05)),
      W=Lt*.085*(1-.35*yg)*(o.spine?.85:1)*.5,res=l44Main(A,[],{w0:W*.7,w1:W*.7,cols,step:9}),C=res.chains[0].pts,Fr=A.at(.5).Fr,parts=[];
    const S=l77PhS(C,Fr,A.L,W,{wp:L77_PHW,tw:(rnd()<.5?-1:1)*R(.7,1.3)*(o.spine?.6:1),f0:1.2,f1:.14+.6*yg,droop:o.spine?0:.1}),F={k:null,B:I3,O:[0,0,0],parts:[]},P=pal7(base),PB=pal7(cw.b);
    parts.push(...sheet3(F,S,{pal:P,palB:PB,nu:4,nv:LOD?10:26,across:1.3,ew:.5,eo:.4,cast:0,vw:Math.max(.5,W*.03),
      veins:[{pts:[[0,0],[0,.5],[0,.97]],w:Math.max(.6,W*.05),c:cw.mg||shd(base,.3),o:.7}],gloss:{shin:24,k:.45,thr:.2,cu:2,cv:6,nu:6,nv:18,lv:1.6,lu:.5,o:.5},
      paint:!LOD&&(cw.st||cw.mg)?(gg,front,c)=>{if(!front)return;for(const[a,b,cc]of cw.st||[]){const d=l77Band(c,S,b,a,0,0);if(d)E('path',{d,fill:cc,opacity:.92},gg)}
        if(cw.mg){const d=l77Band(c,S,1,.95,0,0);if(d)E('path',{d,fill:cw.mg,opacity:.85},gg)}}:null}));
    drawParts(k,parts);open(k,t,1000,0,.4);return l44Out(k,A,res,cols)})}

/* ---------- registers ---------- */
Object.assign(GH,{'dracaena-reflexa-song-of-india':l77Refl,'dracaena-marginata':l77Marg,'dracaena-fragrans':l77Frag,'dracaena-surculosa':l77Surc,'phormium-lin-nz':l77Phor});
Object.assign(CWS,{'dracaena-reflexa-song-of-india':CW_L77SI,'dracaena-marginata':CW_L77MA,'dracaena-fragrans':CW_L77FR,'dracaena-surculosa':CW_L77SU,'phormium-lin-nz':CW_L77PH});
/* commercial grades, in the recipe's unit: the length of the leaves (the cane grows with them) */
Object.assign(SZG,{'dracaena-reflexa-song-of-india':[12,15,18],'dracaena-marginata':[30,40,45],'dracaena-fragrans':[45,60,75],'dracaena-surculosa':[6,8,10],'phormium-lin-nz':[70,100,130]});
const L77_I=(len,o={})=>Object.assign({form:'feuillage',size:1.1,k:'plant',rk:.44,self:len*UPC},o);
Object.assign(GHI,{'dracaena-reflexa-song-of-india':L77_I(55,{fx:30}),'dracaena-marginata':L77_I(70,{fx:30}),'dracaena-fragrans':L77_I(60,{fx:30}),'dracaena-surculosa':L77_I(50,{fx:24}),
  'phormium-lin-nz':{form:'ligne',size:1,k:'plant',self:100*UPC,tip:.9,fx:3.5*UPC,rch:8*UPC}});
/* the crowned canes rise behind the flowers: only the top of the spine, where the rosette starts, must clear the lip (c4.js) */
for(const fn of[l77Marg,l77Frag])fn.bigLeaf={ext:16,k0:12};
