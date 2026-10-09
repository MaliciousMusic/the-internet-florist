/* ================= y-alchemilla.js : lady's mantle, Alchemilla mollis, drawn in SVG (the cloud, leaves and drops of y3-ecume.js) =================
   A cut flowering stem: a soft hairy stem branching above into loose cymes, a froth of tiny petal-less florets in glomerules (y3-ecume.js);
   small cauline leaves with leafy stipules at its forks, a large long-petioled leaf lower down, with drops on it.
   The colour FOLLOWS THE STAGE (refcache/alchemille/brief.md §3-4, coloris.md passes 1 and 2): the tight young buds are dark green, the buds
   lime, the opening cymes pale green, then acid green, the full cloud yellow-green; it pales as it ages, turns yellow-brown, khaki and dries
   rose-brown. The three colourways of the catalogue are starting PHASES on that one curve (passe 2: « des stades et des éclairages d'une même
   plante »); the bouquet's life moves the cloud along it. Whether they stay colourways is the owner's question (ids and tables untouched). */
/* the curve: [phase, L, C, h] (CIE LCh D65). Measured: tight bud L43 C39 h121 (photo 45, pal, one photo); lime bud L80 C66 h115 (T3 L79 C80 h114
   and J4 L87 C50 h115, mean); vert-tendre L77 C56 h112 (pass 2 median, 3 photos, level D); vert-acide L81 C62 h107 (pass 2 median, 7 photos, C);
   jaune-vert L73 C61 h105 (pass 2 median, 3 photos, C); ageing pale L83 C39 h106 (J3); yellow-brown L55 C32 h103 (photos 16 and 133, auto);
   khaki L54 C22 h88 (photo 71, auto); dry rose-brown L67 C15 h45 (F9, October) */
const ALC_CURVE=[[0,43,39,121],[.12,80,66,115],[.25,77,56,112],[.4,81,62,107],[.55,73,61,105],[.7,83,39,106],[.8,55,32,103],[.9,54,22,88],[1,67,15,45]];
/* where each colourway of the catalogue starts on the curve (ids and order of CW_L88AL unchanged) */
const ALC_PH0={'vert-tendre':.25,'vert-acide':.4,'jaune-vert':.55};
function alcLife(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return SVA_LIFE;
  return typeof LIFE!=='undefined'&&LIFE&&typeof lifeWEl==='function'?lifeWEl(LIFE,lifeProfile({sid:'alchemille',rec:{}})):0}
/* how far into its bloom the bouquet is (Éclosion 0..1, 1 after): the cloud keeps yellowing in the vase */
function alcAge(){if(typeof SVA_LIFE!=='undefined'&&SVA_LIFE!=null)return 0;return typeof LIFE!=='undefined'&&LIFE?(LIFE.stage===1?LIFE.u:LIFE.stage>1?1:0):0}
/* the phase: every cloud opens from green (op), ages a little in the vase, then pales and browns as it declines, and dries rose-brown */
function alcPhase(cwx,op,wl,o){const p0=ALC_PH0[cwx.id]??.4,ow=svSm((op-.03)/.5);let p=p0*ow+.12*((o&&o.age)||0)*ow;
  const dec=svSm((wl-.1)/.4),mid=svSm((wl-.35)/.3),fan=svSm((wl-.55)/.3);p+=(Math.max(p,.7)-p)*dec;p+=(Math.max(p,.85)-p)*mid;p+=(1-p)*fan;return Math.min(1,p)}
/* the cloud's colours at a phase: the dark core between florets, shade, body, light, glint; the unopened florets greener (earlier on the curve);
   the browned florets later; the twigs yellow-green (photo 203: #b2b24a lit), dark red-brown when dry (photo 71) */
function alcCol(p,cwx,l){const fan=(l&&l.fan)||0,dec=(l&&l.dec)||0,at=(q,dl,kc,kl)=>svEcCurve(ALC_CURVE,Math.max(0,Math.min(1,q)),dl||0,kc??1,kl??1),L=svEcCurveL(ALC_CURVE,p),
    pb=Math.min(p*.45,.14);
  return{body:at(p),lit:at(p,(100-L)*.3,.95),hi:at(p,(100-L)*.55,.8),shade:at(p,0,.92,.8),deep:at(p-.06,0,.85,.66),bud:at(pb,0,1,.92),budS:at(pb,0,.9,.72),
    brown:at(Math.min(1,p+.22),0,.95,.9),disc:mix(svEcLch(80,66,96),at(p),.2+.6*dec),
    tw:mix(mix('#7d9a3c','#9a9046',dec),'#6e3a2c',.8*fan),tw2:mix(mix('#94ae4c','#a89a52',dec),'#7a4634',.8*fan)}}
const ALC_SPEC={phase:alcPhase,col:alcCol};
/* the wilt of the plant's own colours (the main stem; the cloud and the leaves do their own): greens yellow, then the stem darkens red-brown (71) */
function alcWiltCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#')return c;const[h,s]=h2l(c);
  if(h>=50&&h<175&&s>.1){const y=typeof lifeCol==='function'?lifeCol(c,w):c;return mix(y,'#6a3a2a',.5*svSm((w-.5)/.45))}return c}
if(typeof GHI!=='undefined'&&GHI['alchemille'])GHI['alchemille'].wilt=alcWiltCol;
/* the head of the grid sheets: a sprig (one flowering branch) in the frame B at O, D its size */
function alcSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_L88AL!=='undefined'&&CW_L88AL.find(x=>x.id===cwId))||{id:cwId,c:'#c3c94b'},W0=WILT;WILT=null;
  try{return svEcume(par,B,O,D,S||ALC_SPEC,cwx,op,seed,wl==null?alcLife():wl,{age:alcAge()})}finally{WILT=W0}}
if(typeof SV_HEAD!=='undefined')SV_HEAD['alchemille']=alcSvg;
/* the stem: yellow-green, soft-haired (photos 38, 58: #5c902c, #71871d; shade #365a1c, light #7eb147) */
function alcStemCols(){const c=['#3a571e','#62892e','#86ab45','#bcd28a'];c.sv={hair:'#e9efdd',hairK:.85,ribs:[-.3,.35],swell:.04,gloss:.22};return c}
/* the geometry of the drawn plant against the old drawing's skeleton (receipt measures, etat.md) */
/* f: the cloud's width and the large leaf grown beyond the old drawing's box (photos 197, 203, 166: cloud .27 to .63 of the stem;
   rtest stays the same up to f 4: the composer reads the box's bottom, which the branches' feet keep) */
const ALC_GEO={reach:1.45,leaf:[.16,.26,.62],pet:[.4,.45,.55],f:1.5};
/* ---------- the composer's measure of the stem ----------
   c5.js measures a cluster's whole drawing (getBBox) and lengthens its stem, drawing it again (new draws of chance), until its lowest point
   clears the vase's rim; the box's width picks where the rim is read. The SVG plant must hand the composer the SAME box as the old drawing, or
   the bouquet's chance moves (rtest). So: the old drawing's pieces that reach an edge of its box (left, right, bottom, within ALC_TOL) are drawn
   again, hidden (getBBox still counts them), and the SVG drawing is kept inside that box, ALC_PAD within. */
const ALC_TOL=2.5,ALC_PAD=1.5;
/* the box of path data in the drawing's coordinates (absolute M L C Q, relative m l h v, arcs by their chord's middle +- the larger radius) */
function alcDBox(d,b){const tk=d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)||[];let i=0,c='',x=0,y=0;const num=()=>+tk[i++],add=(a,q,r=0)=>{b[0]=Math.min(b[0],a-r);b[2]=Math.max(b[2],a+r);b[1]=Math.min(b[1],q-r);b[3]=Math.max(b[3],q+r)};
  while(i<tk.length){if(/[a-zA-Z]/.test(tk[i]))c=tk[i++];if(i>=tk.length)break;if(/[a-zA-Z]/.test(tk[i])&&(c==='Z'||c==='z'))continue;
    if(c==='M'||c==='L'){x=num();y=num();add(x,y)}else if(c==='m'||c==='l'){x+=num();y+=num();add(x,y)}else if(c==='h'){x+=num();add(x,y)}else if(c==='v'){y+=num();add(x,y)}
    else if(c==='H'){x=num();add(x,y)}else if(c==='V'){y=num();add(x,y)}else if(c==='C'||c==='Q'||c==='S'||c==='T'){x=num();y=num();add(x,y)}
    else if(c==='c'||c==='q'||c==='s'||c==='t'){const n=c==='c'?3:c==='t'?1:2,x0=x,y0=y;for(let k=0;k<n;k++){const a=num(),q=num();add(x0+a,y0+q);if(k===n-1){x=x0+a;y=y0+q}}}
    else if(c==='a'||c==='A'){const rx=num(),ry=num();num();num();num();const ex=num(),ey=num(),nx=c==='a'?x+ex:ex,ny=c==='a'?y+ey:ey;add((x+nx)/2,(y+ny)/2,Math.max(rx,ry));add(nx,ny);x=nx;y=ny}
    else i++}return b}
/* the box of what a part draws, drawn into a detached group (its paths only) */
function alcPartBox(fn){const g=G(null),b=[1e9,1e9,-1e9,-1e9];try{fn(g)}catch(_){}const walk=n=>{for(const ch of[...(n.children||[])]){if(ch.getAttribute&&ch.getAttribute('d'))alcDBox(ch.getAttribute('d'),b);walk(ch)}};walk(g);return b}
/* the old drawing's box and the pieces on its edges: I.items (the old cymes: each writes its path data into B), I.SVI.lv[].gh (the old leaves'
   parts), the old stem (stem3 with the old colours on the cuts of bzShoot) */
function alcOldBox(A,I){const pcs=[],U=[1e9,1e9,-1e9,-1e9],s0=I.s0||0,cuts=[s0];for(let i=1;i<=6;i++)cuts.push(s0+(1-s0)*i/6);
  const wt=s=>I.w0+(I.w1-I.w0)*Math.max(0,Math.min(1,(s-s0)/((1-s0)||1)));
  for(let j=0;j<6;j++){const a=cuts[j],b=cuts[j+1];if(b-a<1e-3)continue;const P=bseg(A.Cs,a,b),wa=wt(a),wb=wt(b),fn=par=>stem3(par,P,wa,wb,I.sc0,8);pcs.push({b:alcPartBox(fn),fn})}
  for(const it of I.items||[]){const B={};it.fn(B);let d='';for(const k in B)d+=B[k];if(d)pcs.push({b:alcDBox(d,[1e9,1e9,-1e9,-1e9]),d})}
  for(const v of I.SVI.lv)for(const p of v.gh||[])pcs.push({b:alcPartBox(p.fn),fn:p.fn});
  for(const q of pcs)if(q.b[0]<=q.b[2]){U[0]=Math.min(U[0],q.b[0]);U[1]=Math.min(U[1],q.b[1]);U[2]=Math.max(U[2],q.b[2]);U[3]=Math.max(U[3],q.b[3])}
  const edge=pcs.filter(q=>q.b[0]<=q.b[2]&&(q.b[0]<U[0]+ALC_TOL||q.b[2]>U[2]-ALC_TOL||q.b[3]>U[3]-ALC_TOL));
  /* the containment box in view space (y up): [x0, x1, lowest y] */
  return{U,edge,box:[U[0]+ALC_PAD,U[2]-ALC_PAD,-U[3]+ALC_PAD]}}
/* the plant (l88Alchemille, s88a.js, once the old drawing's share of the bouquet's chance is consumed): I.SVI.br the grown branches of the old
   skeleton (their foot, direction and reach), I.SVI.lv its leaf nodes. The cloud, the leaves and the stipules are drawn from their own seed;
   the painter's WILT filter is lifted while they draw (they wilt by their own life) */
function alcSvgPlant(A,parts,I){const cwx=I.cw,wl=alcLife(),st=svEcState(ALC_SPEC,I.op,wl,cwx,{age:alcAge()}),cl={tw:[],gl:[]},top=A.at(1).p,
    sd0=svSeed('alchemille',cwx.id,Math.round(top[0]*8),Math.round(top[1]*8),Math.round(I.L*8)),rg=svRng(sd0),noW=fn=>par=>{const W0=WILT;WILT=null;try{fn(par)}finally{WILT=W0}};
  const OB=alcOldBox(A,I),f=ALC_GEO.f||1,bc=(OB.box[0]+OB.box[1])/2,BX=[bc-(bc-OB.box[0])*f,bc+(OB.box[1]-bc)*f,OB.box[2]],[bx0,bx1,by]=BX;
  /* the hidden copy of the old drawing's edge pieces */
  if(OB.edge.length)parts.push({z:-1e9,cast:false,fn:par=>{const g=G(par,{visibility:'hidden','aria-hidden':'true'});let d='';for(const q of OB.edge){if(q.d)d+=q.d;else q.fn(g)}if(d)E('path',{d,fill:'none'},g)}});
  /* the cloud: each branch from its foot on the old skeleton, regrown smaller (same seed) until it stays inside the box */
  let rmax=0;const brs=[];for(const res of I.SVI.br){const ch=res.chains[0];if(!ch||ch.pts.length<2)continue;const b=ch.pts[0];let reach=0;for(const og of res.organs)reach=Math.max(reach,V3l(V3s(og.pos,b)));
    brs.push([b,V3.nz(V3s(ch.pts[Math.min(2,ch.pts.length-1)],b)),reach]);rmax=Math.max(rmax,reach)}
  brs.forEach(([b,H,reach],i)=>{const U=V3.nz(V3.cr(H,Math.abs(H[2])<.9?[0,0,1]:[1,0,0])),o={depth:reach>rmax*.6?3:2,w:st.P.twW[DET>=1.5?1:0]*(.7+.3*reach/rmax)};let k=ALC_GEO.reach*f,c1=null;
    for(let it=0;it<4;it++){c1={tw:[],gl:[]};svEcGrow(c1,st,b,H,U,reach*k,svRng(sd0+i*7919+1),o);const e=svEcExt(c1,st);let s=1;
      if(e[1]>bx1)s=Math.min(s,(bx1-b[0])/Math.max(1e-6,e[1]-b[0]));if(e[0]<bx0)s=Math.min(s,(b[0]-bx0)/Math.max(1e-6,b[0]-e[0]));if(e[2]<by)s=Math.min(s,(b[1]-by)/Math.max(1e-6,b[1]-e[2]));
      if(s>=1)break;k*=Math.max(.05,s*.95);if(it===3)c1=null}
    if(c1){cl.tw.push(...c1.tw);cl.gl.push(...c1.gl)}});
  for(const p of svEcParts(cl,st))parts.push({z:p.z,cast:false,fn:noW(p.fn)});
  if(typeof ALC_DBG!=='undefined')ALC_DBG.push({U:OB.U,edge:OB.edge.length,cloud:svEcExt(cl,st),L:I.L,s0:I.s0||0,nb:brs.length,ng:cl.gl.length,top:A.at(1).p,foot:A.at(I.s0||0).p});
  /* the leaves: small cauline ones up in the forks (photos 203, 58, 38: 2 to 4 cm on short petioles, a leafy toothed stipule at the node), a
     large one lower down (photos 8, 171, 202) carrying the drops, held up toward the viewer (the old drawing's narrow box leaves room for a
     large blade only in front of the stem); all inside the box (svEcLeaf shrinks a leaf about its foot) */
  const nl=I.SVI.lv.length;I.SVI.lv.forEach((v,i)=>{const big=i===nl-1&&nl>1,kind=big?2:i===0?0:1,len=I.C*ALC_GEO.leaf[kind]*(big?f:1)*(.92+.16*rg()),q=v.q,r=v.r,
      pos=V3.add(q.p,V3.sc(r,v.ww*.3)),Hd=big?V3.nz(V3.add(V3.add(V3.sc(q.T,.8),V3.sc(r,.35)),[0,0,.5])):V3.nz(V3.add(V3.sc(q.T,.5),r)),up=big?V3.nz([r[0]*.3,.85,.7]):V3.nz(V3.add(V3.add([0,1,0],V3.sc(r,.25)),[0,0,.6])),sd=svSeed('alc-feuille',cwx.id,i,Math.round(pos[0]*8),Math.round(pos[1]*8)),
      lo={len,ax:.88,n:big?9:7,sin:big?.13:.22,gap:big?.3:.9,nt:big?[6,10]:[4,6],td:big?[.034,.028]:[.05,.045],pet:ALC_GEO.pet[kind],wl,sd,box:BX,drops:big?1:kind?.45:0,cup:big?.22:.12,pleat:big?.075:.06};
    parts.push({z:pos[2]+Hd[2]*len*lo.pet*.7+.1,cast:false,fn:noW(par=>svEcLeaf(par,pos,Hd,up,lo))});
    /* the stipule: a leafy toothed collar clasping the node on the leaf's side */
    parts.push({z:q.p[2]+.08,cast:false,fn:noW(par=>alcStipule(par,q,r,v.ww,len*.16,wl,BX))})})}
/* a stipule: fused, leaf-like, deeply toothed, wrapped round the node (photo 38); shrunk toward the node to stay inside box */
function alcStipule(par,q,r,ww,sz,wl,box){const n=7,S2=p=>[p[0],-p[1]],T=q.T,sd=V3.nz(V3.cr(T,r));let P=[];
  const mk=z=>{const Q=[V3.add(q.p,V3.sc(T,-z*.15))];for(let i=0;i<=n*2;i++){const t=i/(n*2),a=(t-.5)*2.6,tip=i%2===1,rr=ww*.55+(tip?z:z*.55)*Math.sin(Math.PI*(.15+.7*t)),
      dir=V3.add(V3.sc(r,Math.cos(a)),V3.sc(sd,Math.sin(a)));Q.push(V3.add(q.p,V3.add(V3.sc(dir,rr),V3.sc(T,(tip?z*.55:z*.2)*(1-Math.abs(t-.5))))))}return Q};
  for(let it=0;it<4;it++){P=mk(sz);if(!box)break;let ok=true;for(const p of P)if(p[0]<box[0]||p[0]>box[1]||p[1]<box[2]){ok=false;break}if(ok)break;sz*=.6;if(it===3)return}
  let d='';P.map(S2).forEach((p,i)=>{d+=(i?'L':'M')+svJ([svR(p[0]),svR(p[1])])});
  const c=wl>0?mix('#6f9a3e','#9a8a4a',svSm((wl-.2)/.5)):'#6f9a3e';E('path',{d:d+'z',fill:c,stroke:'#3f6424','stroke-width':svF(Math.max(.25,sz*.04)),'stroke-opacity':.6,'stroke-linejoin':'round'},par)}
