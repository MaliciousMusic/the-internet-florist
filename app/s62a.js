/* ================= Serre, lot 62 — remplissage 3, poussé par le L-système : craspedia, monnaie-du-pape, mimosa, lavande, véronique ================= */
/* ---------- shared: small bodies (florets, pompons, pods, calyces) laid as items at their own depth, sorted and cut into a few bins (l30Batch of lot 30), each bin one path per key;
   every stalk a stroke of at least 1.05 from the point of its carrier: nothing small is left loose ---------- */
const L62_PW=1.1;
const l62Seg=(a,b)=>`M${f(a[0])},${f(-a[1])}L${f(b[0])},${f(-b[1])}`;
/* a stalk bowed a little toward v (view space points, y up) */
const l62Arc=(a,b,v,k)=>{const m=V3.add(V3.sc(V3.add(a,b),.5),V3.sc(v,k));return`M${f(a[0])},${f(-a[1])}Q${f(m[0])},${f(-m[1])} ${f(b[0])},${f(-b[1])}`};
/* an ellipse in 3D (centre c, half-axes along a and b, view space) as a closed path on the screen, n points */
function l62Ell(c,a,b,n=14){let d='';for(let i=0;i<n;i++){const t=i/n*6.283,p=V3.add(c,V3.add(V3.sc(a,Math.cos(t)),V3.sc(b,Math.sin(t))));d+=(i?'L':'M')+f(p[0])+','+f(-p[1])}return d+'Z'}
/* two unit vectors across a direction n */
function l62Across(n){const a=Math.abs(n[1])<.9?[0,1,0]:[1,0,0],X=V3.nz(V3.cr(a,n));return[X,V3.cr(n,X)]}
/* the frame of a line species on its axis: points of its own upright frame laid on the spine (lot 40) */
const l62Lay=(A,bq,L,Rm,fd)=>l40Lay(A,bq,L,Rm,fd);

/* ---------- craspedia, billy buttons (Pycnosorus globosus, syn. Craspedia globosa): a perfect golden ball (2–3.5 cm) made of some hundred tiny capitula,
   each of a few tubular five-toothed florets, packed so tight the ball looks pebbled; in bud a tight olive-green ball, silvery with the papery bracts of its capitula,
   that turns yellow from its foot upward. One ball on a long, thin, stiff scape (50–70 cm), grey-green and woolly; the leaves are all in the basal rosette (none on the cut stem) ---------- */
const CW_L62CR=[
 {id:'or',n:'Jaune d’or (Billy Buttons)',c:'#e5b31c'},
 {id:'soleil',n:'Jaune soleil (Golden Drumstick)',c:'#f1c421'},
 {id:'ocre',n:'Ocre doré (séché)',c:'#c8961f',dry:1},
 {id:'blanc',n:'Blanc crème (blanchi)',c:'#efe6cc',dry:1,st:'#d8d0b4'},
 {id:'orange',n:'Orange (teint)',c:'#e8782a',dry:1},
 {id:'rouge',n:'Rouge (teint)',c:'#b8262e',dry:1},
 {id:'rose',n:'Rose fuchsia (teint)',c:'#d4508c',dry:1},
 {id:'bleu',n:'Bleu (teint)',c:'#3e62b0',dry:1},
 {id:'vert',n:'Vert pomme (teint)',c:'#8cb43c',dry:1}];
const L62_CRSC=['#3c4a30','#62735a','#8fa088','#c4cebc'];
/* the ball: Dh its diameter, op its age (0 a green bud … 1 every floret open); in its own frame B, z up the scape, its foot at O */
function l62CrBall(par,B,O,Dh,op,cw){const det=DET>=1.5,lod=LOD?.5:1,Rh=Dh/2*(.78+.22*sm01(op/.7)),C=[0,0,Rh*.94],sd=R(0,6.283),N=Math.max(60,Math.round((det?300:150)*lod*Math.min(1.3,Math.max(.6,Rh/10)))),
    gap=Math.sqrt(4*Math.PI/N)*Rh,fl=[],bud=cw.dry?mix(cw.c,'#9a9468',.45):'#8f9a5a',silver=cw.dry?mix(cw.c,'#ffffff',.35):'#c6ccb0',pale=h2l(cw.c)[2]>.8;let zmin=1e9,zmax=-1e9;
  for(let i=0;i<N;i++){const zz=1-2*(i+.5)/N,r=Math.sqrt(1-zz*zz),a=i*2.39996+sd,n=[Math.cos(a)*r,Math.sin(a)*r,zz],nV=toV(B,n);if(nV[2]<-.3)continue;
    const p=V3.add(C,V3.sc(n,Rh*R(.97,1.02))),h=(1-zz)/2,m=sm01((op*1.45-.25-(1-h)*.55+R(-.06,.06))/.3),I0=lightI(nV[2]>=0?nV:V3.sc(nV,-1)),I=pale?.42+.55*I0:.1+.9*I0+R(-.03,.03),pp=PJ(B,O,p);zmin=Math.min(zmin,pp[2]);zmax=Math.max(zmax,pp[2]);
    if(m<.5){/* a closed capitulum: a little dome of papery bracts */fl.push({q:a14Bud(B,O,p,n,gap*.5,gap*.46,8),z:pp[2],c:m<.2?bud:mix(bud,cw.c,.5),I:I*.95});
      if(det&&nV[2]>.3&&rnd()<.3){const c0=PJ(B,O,V3.add(p,V3.sc(n,gap*.4)));fl[fl.length-1].e=a14Dot(c0[0]-gap*.1,c0[1]-gap*.1,Math.max(.25,gap*.08));fl[fl.length-1].ec=silver}continue}
    /* an open capitulum: a tight boss of tiny five-toothed florets, seen as one pebble with a star at its top */
    const q=a14Star(B,O,p,n,gap*.62*R(.92,1.08),R(0,6.283),5,.62,.35,1,0),c0=PJ(B,O,V3.add(p,V3.sc(n,gap*.25)));
    fl.push({q,z:pp[2],c:cw.c,I,e:det&&nV[2]>.05?a14Dot(c0[0],c0[1],Math.max(.32,gap*.13)):null,ec:shd(cw.c,pale?-.25:-.38)})}
  /* the core under the pebbles: the ball's own silhouette, shaded as a sphere lit from the upper left, so no gap ever shows through */
  const cc=PJ(B,O,C),cmix=op<.4?mix(bud,cw.c,sm01(op/.4)*.5):cw.c,g=G(par);
  E('circle',{cx:f(cc[0]),cy:f(cc[1]),r:f(Rh*.97),fill:LOD?shd(cmix,-.3):rad([[0,shd(cmix,.2)],[.5,shd(cmix,-.12)],[.9,shd(cmix,-.45)],[1,shd(cmix,-.6)]],.38,.34,.7)},g);
  drawParts(g,a14Bands(fl,det?3:2,zmin,zmax+.01,{so:.45,sw:.22,lv:det?10:6}));return g}
function l62Crasp(g,t,o){const cw=cwPick(CW_L62CR,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||3)*UPC,k=G(g),w=Math.max(1.5,.24*UPC),sc=cw.dry?['#5a5038','#857a5a','#ab9f80','#d4ccb4']:L62_CRSC;
  const B=frameOf(o,.3,true),up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0],ax=B[2];let U0=V3s(ax,V3.sc(up,V3.dot(ax,up)));if(V3l(U0)<1e-3)U0=[0,0,1];
  const Lh=D*(o.rim?1.2:4.2),kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/Lh)):1,lean=V3.nz(V3.add(up,V3.sc(ax,.12)));
  /* S → F F(aim) U : the scape is one stiff internode, barely turning at its top */
  const res=lsTurtle(lsDerive([['S',{}]],{S:()=>[['F',{l:Lh*kr*.7,w1:w*1.02}],['F',{l:Lh*kr*.3,w1:w*1.08,aim:lean,k:.06}],['U',{}]]},2),{p:[0,0,0],H:up,U:U0,wig:.004,seg:Math.max(4,D*.25),T:[0,1,0],e:.002,w:w});
  for(const ch of res.chains)ch.c=sc;const og=res.organs.find(q=>q.t==='U'),apex=V3.add(og.pos,V3.sc(og.H,D*.4));
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(q,pos)=>q.t==='U'?{parts:[{z:pos[2]+D*.3,fn:par=>l62CrBall(par,lsFrame(q,null,0),pos,D,op,cw)}]}:null});
  const r=lsNeck(res,[0,0,0],apex);if(!cw.dry)g37Hairs(k,r.np.filter(p=>Math.hypot(p[0]-r.np[0][0],p[1]-r.np[0][1])>D*.9),w,'#d4d8c8',{l:.9,every:3});open(k,t,1000,4,.3);return r}
Object.assign(GH,{'craspedia':l62Crasp});CWS['craspedia']=CW_L62CR;SZG['craspedia']=[2,2.5,3,3,3.5];
GHI['craspedia']={form:'sphere',size:1.2,k:'head',rk:1};
GH_BUDS.add('craspedia');

/* ---------- monnaie-du-pape, honesty (Lunaria annua): a branched raceme of silicles, round to broadly oval (3–4.5 cm), flat as coins, each on a spreading pedicel and a short stipe,
   tipped by the persistent style; inside, three or four flat seeds on each side of the septum. Dried, the two papery valves fall and leave the septum: a satiny, pearly, translucent moon
   in its thin frame (the replum), the seeds or their prints seen through it as shadows. Fresh, the pods are green, often flushed purple, the seeds bulging. Sold as dry stems (50–80 cm) ---------- */
const CW_L62LU=[
 {id:'argent',n:'Argent nacré (séché, valves tombées)',c:'#e4e1d9',dry:1},
 {id:'blanc',n:'Blanc nacré (blanchi)',c:'#f3f0e8',dry:1,bl:1},
 {id:'naturel',n:'Beige (séché, valves en place)',c:'#d7c9ad',dry:1,shut:1},
 {id:'vert',n:'Vert frais',c:'#a8bf7a',fresh:1},
 {id:'violet',n:'Vert lavé de pourpre (frais)',c:'#8e6a8c',fresh:1,c2:'#9aae72'},
 {id:'dore',n:'Doré (peint)',c:'#d8b25a',dry:1,paint:1},
 {id:'rose',n:'Rose poudré (teint)',c:'#e6bccb',dry:1}];
function l62Lunar(g,t,o){const cw=cwPick(CW_L62LU,o),op=Math.max(.05,Math.min(1,o.op??1)),Dp=(o.cm||4)*UPC*(.72+.28*sm01(op/.6)),H=48*UPC,
    sc=cw.fresh?['#3e4a2c','#647450','#8a9a70','#bcc8a0']:['#5e5240','#8a7c60','#ab9d7c','#d4c8aa'],tw=cw.fresh?'#6a7a50':'#9a8c6c';
  return bzShoot(g,t,o,{Lt:H,w0:3,w1:1.3,sc,bow:R(-.05,.05),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],nb=DET>=1.5?9:6,det=DET>=1.5;
    /* a pod at the end of its stalk: centre along the stalk's direction, its flat face turned round it; dried pods peel with age (valves on → septum bare) */
    const pod=(og,v)=>{const h=V3.nz(V3.add(og.H,[0,.25,0])),[X,Y]=l62Across(h);let wv,nrm;for(let k=0;k<8;k++){const rl=R(0,6.283);wv=V3.add(V3.sc(X,Math.cos(rl)),V3.sc(Y,Math.sin(rl)));nrm=V3.nz(V3.cr(h,wv));if(Math.abs(nrm[2])>.38)break}const 
        s=Dp*R(.88,1.1)*(1-.18*v),a=s*.53,b=s*.47,c=V3.add(og.pos,V3.sc(h,a+s*.05)),I0=lightI(nrm[2]>=0?nrm:V3.sc(nrm,-1)),ti=I0>.7?2:I0>.5?1:0,
        peel=cw.shut?0:cw.fresh?0:sm01((op-.3)/.5)*R(.7,1.3),shut=peel<.5,key=(shut?'v':'s')+ti;
      const out=l62Ell(c,V3.sc(h,a),V3.sc(wv,b),det?20:14),tip=V3.add(c,V3.sc(h,a+s*.09)),base=V3.add(c,V3.sc(h,-a)),ns=Math.round(R(2,4));
      items.push({z:c[2],fn:Bk=>{l30Add(Bk,'st',l62Seg(og.pos,base)+l62Seg(V3.add(c,V3.sc(h,a*.92)),tip));l30Add(Bk,key,out);
        /* the seeds: a row down the middle, seen through the septum as shadows (bulging and lit on the fresh or still closed pods) */
        let sd='',sl='';for(let j=0;j<ns;j++){const u=-.45+.9*(j+.5)/ns,q=V3.add(c,V3.add(V3.sc(h,u*a*.95),V3.sc(wv,(j%2?.12:-.12)*b))),rs=s*R(.11,.13);sd+=l62Ell(q,V3.sc(h,rs),V3.sc(wv,rs*.92),8);if(shut&&det)sl+=l62Ell(V3.add(q,[-rs*.25,rs*.3,0]),V3.sc(h,rs*.4),V3.sc(wv,rs*.35),6)}
        l30Add(Bk,shut?'sv':'ss',sd);if(sl)l30Add(Bk,'sl',sl);l30Add(Bk,'rm',out);if(det&&!shut&&I0>.55)l30Add(Bk,'gl',l62Ell(V3.add(c,V3.add(V3.sc(h,a*.25),V3.sc(wv,-b*.35))),V3.sc(h,a*.42),V3.sc(wv,b*.16),10))}})};
    /* a raceme: its axis rising and spreading, pods on alternate stalks, the lowest oldest */
    const raceme=(l,az,el,len,np)=>{const mods=[];for(let i=0;i<np;i++){mods.push(['F',{l:len/np*R(.8,1.2),w1:Math.max(1.15,1.6*(1-i/np))}],['[',{w:1.15}],['/',{a:i*180+R(-35,35)}],['&',{a:R(38,62)}],['F',{l:UPC*R(1.6,2.4),w1:1.15,e:.02}],['P',{v:i/np}],[']',{}])}
      const br=bzGrow(A,l,az,el,mods,{w:1.8,seg:UPC*.6,T:[0,1,0],e:.03,wig:.05});l30Twigs(items,br,[[1.3,'t0'],[0,'t1']]);for(const og of br.organs)if(og.t==='P')pod(og,og.p.v)};
    /* side racemes alternate up the upper half, the lower longer; the main axis ends in its own raceme */
    const span=L-Math.max(l0+UPC*3,L*.42),side=R(0,6.283);let i=0;for(let l=L-span;l<L-UPC*5;l+=UPC*R(2.4,3.4)){const u=(l-(L-span))/span;raceme(l,side+i*2.4+R(-.3,.3),R(28,42)-u*10,UPC*(16-9*u)*R(.85,1.1),Math.max(3,Math.round((7-3*u)*R(.8,1.2))));i++}
    {const mods=[],np=Math.round(R(5,7));for(let j=0;j<np;j++){mods.push(['[',{w:1.15}],['/',{a:j*137+R(-20,20)}],['&',{a:R(35,55)}],['F',{l:UPC*R(1.6,2.4),w1:1.15,e:.02}],['P',{v:j/np}],[']',{}]);if(j<np-1)mods.push(['F',{l:UPC*R(1.4,2),w1:1.2}])}
      const tp=bzGrow(A,L-.5,0,2,mods,{w:1.4,seg:UPC*.6,T:[0,1,0],e:.02,wig:.04});l30Twigs(items,tp,[[1.3,'t0'],[0,'t1']]);for(const og of tp.organs)if(og.t==='P')pod(og,.3+og.p.v*.5)}
    /* keys: stalks, the shut pods (valves, opaque), the bare septa (translucent and pearly), seeds, frames, glints */
    const keys=l30TwKeys([['t0',tw,1.5],['t1',tw,1.15],['st',tw,L62_PW]]),P=pal7(cw.c),vc=cw.fresh?cw.c:cw.shut?cw.c:mix(cw.c,'#c8b48c',cw.bl?.4:.65),PV=pal7(vc),pc=cw.c2||cw.c;
    for(let k=0;k<3;k++){keys.push(['v'+k,{fill:toneAt(cw.fresh&&k===0?pal7(pc):PV,[.42,.6,.8][k])}]);keys.push(['s'+k,{fill:toneAt(P,[.5,.68,.86][k]),'fill-opacity':cw.paint?1:.78}])}
    keys.push(['sv',{fill:shd(vc,-.22),opacity:cw.fresh?.55:.35}],['ss',{fill:cw.paint?shd(cw.c,-.25):mix(shd(cw.c,-.35),'#7a6a50',.4),opacity:cw.paint?.6:.38}],['sl',{fill:'#ffffff',opacity:.35}],
      ['rm',{fill:'none',stroke:cw.fresh?shd(cw.c,-.4):mix(tw,cw.c,.35),'stroke-width':det?.6:.5,'stroke-opacity':.8}],['gl',{fill:'#ffffff',opacity:cw.paint?.4:.5}]);
    /* the batches: stalks and twigs first in every bin, then the pods */
    keys.sort((a,b)=>(a[0][0]==='t'||a[0]==='st'?0:1)-(b[0][0]==='t'||b[0]==='st'?0:1));l30Batch(parts,items,keys,nb)}})}
Object.assign(GH,{'lunaire':l62Lunar});CWS['lunaire']=CW_L62LU;SZG['lunaire']=[3,3.5,4,4,4.5];
GHI['lunaire']={form:'grappe',size:1.1,k:'plant',rk:.5,tip:.8};

/* ---------- mimosa, silver wattle (Acacia dealbata; A. baileyana close to it): a woody, finely ribbed twig, glaucous, its bipinnate leaves (8–12 cm, 10–20 pairs of pinnae,
   each with 30–50 pairs of minute leaflets) a feathery grey-green, silvery beneath. From the axils of the upper leaves, racemes gathered into a panicle of little round heads
   (5–7 mm), 20–30 a raceme, each a puff of a hundred stamens, bright yellow and downy; in bud tight yellow-green beads. Sold in bunches of 40–60 cm sprays ---------- */
const CW_L62MI=[
 {id:'jaune',n:'Jaune vif (Gaulois)',c:'#f1cf2b'},
 {id:'or',n:'Jaune d’or (Mirandole)',c:'#e6b723'},
 {id:'citron',n:'Jaune citron pâle (Le Gaulois Astier)',c:'#f2dc5a'},
 {id:'baileyana',n:'Jaune vif à feuillage pourpre (baileyana Purpurea)',c:'#efc82a',lf:'#7f7a86',lb:'#a8a4b0'}];
/* a bipinnate leaf in 3D from p along h, its blade's normal nv: the rachis, its pairs of pinnae (each a fringed strip of leaflets) in the leaf's plane, drooping a little */
function l62Bipin(p,h,nv,len,np,items,det){const s=V3.nz(V3.cr(nv,h)),dn=[0,-1,0],pts=[];for(let i=0;i<=8;i++){const t=i/8;pts.push(V3.add(p,V3.add(V3.sc(h,len*t),V3.sc(dn,len*.16*t*t))))}
  const at=t=>{const x=t*8,i=Math.min(7,Math.floor(x)),u=x-i;return V3.add(V3.sc(pts[i],1-u),V3.sc(pts[i+1],u))};let up='',dw='',z=0,n=0;
  for(let j=0;j<np;j++){const t=.14+.84*(j+.5)/np,b=at(t),hl=len*.24*(1-.35*Math.abs(t-.5)*2)*(t>.9?.7:1),wf=len*.032;
    for(const sd of[-1,1]){const d=V3.nz(V3.add(V3.add(V3.sc(s,sd),V3.sc(h,.45)),V3.sc(dn,.15))),e=V3.add(b,V3.sc(d,hl)),ac=V3.nz(V3.cr(nv,d)),nt=det?9:6,L1=[],L2=[];
      /* the fringe: a leaflet each side at every step, the strip narrowing to its tip */
      for(let i=0;i<=nt;i++){const u=i/nt,c=V3.add(b,V3.sc(d,hl*u)),w=wf*(1-.55*u)*(i%2?1:.45);L1.push(V3.add(c,V3.sc(ac,w)));L2.push(V3.add(c,V3.sc(ac,-w)))}
      const poly=L1.concat(L2.reverse()).map(q=>[q[0],-q[1]]),fr=V3.dot(nv,[0,0,1])*(1)>=0;const dd=pD(poly)+'Z';if(fr)up+=dd;else dw+=dd;z+=e[2];n++}}
  const rc=pD(pts.map(q=>[q[0],-q[1]]));items.push({z:n?z/n:p[2],fn:B=>{l30Add(B,'rc',rc);if(dw)l30Add(B,'lb',dw);if(up)l30Add(B,'lf',up)}})}
function l62Mimosa(g,t,o){const cw=cwPick(CW_L62MI,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||35)*UPC,sc=['#4a5444','#6e7a66','#95a08a','#c4ccb8'],tw='#7a866e',det=DET>=1.5;
  const rb=.27*UPC*(det?1:1.12),P=pal7(cw.c),bud=mix(cw.c,'#9aa848',.5);
  return bzShoot(g,t,o,{Lt:C*1.45,w0:3.6,w1:1.3,sc,bow:R(.04,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],nb=det?10:6;
    /* a head: a downy puff (open) or a bead (bud), on its short pedicel from the raceme */
    const head=(og,m)=>{const opn=m>.5,r=rb*(opn?R(.9,1.1)*(.8+.2*Math.min(1,m)):R(.45,.55)),c=V3.add(og.pos,V3.sc(og.H,r*.85));
      items.push({z:c[2]+.1,fn:B=>{l30Add(B,'pd',l62Seg(og.base,c));if(opn){l30Add(B,'hs',l30O(c[0]+r*.16,c[1]-r*.2,r*.98));l30Add(B,'h',det?l30Sc(c[0],c[1],r*.92,15,R(0,6.283),.17):l30Sc(c[0],c[1],r*.9,9,R(0,6.283),.12));if(!LOD)l30Add(B,'hl',l30O(c[0]-r*.3,c[1]+r*.3,r*.38))}
        else{l30Add(B,'us',l30O(c[0]+r*.15,c[1]-r*.18,r));l30Add(B,'u',l30O(c[0],c[1],r*.86));if(det)l30Add(B,'ul',l30O(c[0]-r*.3,c[1]+r*.3,r*.3))}}})};
    /* a raceme: a fine axis, heads on short pedicels all round it, the lowest oldest; at its foot sometimes a second, shorter one (a panicle) */
    const raceme=(l,az,el,len,u)=>{const n=Math.max(4,Math.round(len/(UPC*.34))),mods=[];for(let i=0;i<n;i++){mods.push(['F',{l:len/n*R(.85,1.15),w1:1.12}],['/',{a:137.5}],['[',{w:1.1}],['&',{a:R(55,85)}],['F',{l:UPC*R(.22,.32),w1:1.1}],['Hd',{v:i/n}],[']',{}]);
        if(i<n-2&&rnd()<.55)mods.push(['[',{w:1.1}],['/',{a:180}],['&',{a:R(55,85)}],['F',{l:UPC*R(.22,.32),w1:1.1}],['Hd',{v:i/n+.05}],[']',{}]);
        if(i===1&&len>UPC*3&&rnd()<.6)mods.push(['[',{w:1.2}],['+',{a:R(30,45)*(rnd()<.5?1:-1)}],['F',{l:len*.25,w1:1.15}],['/',{a:90}],['[',{w:1.1}],['&',{a:60}],['F',{l:UPC*.4,w1:1.1}],['Hd',{v:.6}],[']',{}],['F',{l:len*.2,w1:1.1}],['[',{w:1.1}],['&',{a:60}],['F',{l:UPC*.4,w1:1.1}],['Hd',{v:.8}],[']',{}],[']',{}])}
      const br=bzGrow(A,l,az,el,mods,{w:1.3,seg:UPC*.4,T:[0,1,0],e:.05+.05*u,wig:.06});l30Twigs(items,br,[[1.25,'t0'],[0,'t1']]);
      /* each head knows the point of the raceme it hangs from: the turtle position before its pedicel */
      for(const og of br.organs)if(og.t==='Hd'){og.base=V3.add(og.pos,V3.sc(og.H,-UPC*.27));head(og,op*1.5-og.p.v*.55-u*.15+R(-.1,.1))}};
    /* nodes down from the top: a leaf at each, and in the flowering zone a raceme in its axil, longest in the middle of the panicle */
    const zone=C*.85,side=R(0,6.283);let i=0;
    raceme(L-.3,0,4,UPC*R(3,4),0);
    for(let l=L-UPC*1.2;l>l0+UPC*2;l-=UPC*R(1.3,1.9)*(l<L-zone?1.6:1)){const u=(L-l)/zone,az=side+i*2.4+R(-.25,.25),q=l30On(A,l,az,.8);
      if(u<1)raceme(l,az,R(40,62),UPC*(2.5+6*Math.sin(Math.PI*Math.min(1,.2+u*.8)))*R(.85,1.15),u);
      if(u>.25||rnd()<.5){const h=V3.nz(V3.add(V3.sc(q.T,.55),q.r)),nv=V3.nz(V3.cr(h,V3.nz(V3.cr(q.T,h)))),ll=UPC*(u<1?5+4*u:8.5)*R(.85,1.1);
        l62Bipin(V3.add(q.p,V3.sc(q.r,-.5)),h,V3.dot(nv,[0,1,0])<0?V3.sc(nv,-1):nv,ll,Math.round((det?13:9)*R(.85,1.1)),items,det)}i++}
    const lf=cw.lf||'#7d8c6a',lb=cw.lb||'#b4bea6',keys=l30TwKeys([['t0',tw,1.25],['t1',mix(tw,'#a8b07c',.35),1.12],['rc',lf,1.1],['pd',mix(tw,cw.c,.25),L62_PW]]);
    keys.push(['lb',{fill:lb,stroke:shd(lb,-.35),'stroke-width':det?.2:0,'stroke-opacity':.6}],['lf',{fill:lf,stroke:shd(lf,-.4),'stroke-width':det?.2:0,'stroke-opacity':.6}],
      ['us',{fill:shd(bud,-.35)}],['u',{fill:bud}],['ul',{fill:shd(bud,.5),opacity:.8}],['hs',{fill:P.d1}],['h',{fill:cw.c}],['hl',{fill:P.l2,opacity:.85}]);
    l30Batch(parts,items,keys,nb)}})}
Object.assign(GH,{'mimosa':l62Mimosa});CWS['mimosa']=CW_L62MI;SZG['mimosa']=[25,30,35,35,45];
GHI['mimosa']={form:'grappe',size:1.2,k:'plant',rk:.5,tip:.75};
GH_BUDS.add('mimosa');

/* ---------- lavande (Lavandula angustifolia 'Hidcote', 'Maillette'; lavandin L. × intermedia 'Grosso', 'Super'): a thin, stiff, square peduncle, grey-green, bare but for a pair or two
   of narrow grey linear leaves low down; at its top a dense spike (4–8 cm, the lavandin's 8–12 cm and pointed) of whorls of six to ten flowers, the lowest one or two set apart.
   Each flower a ribbed, downy tubular calyx, violet-grey, from which the small two-lipped corolla peeps out, brighter; dried lavender is cut in bud, the calyces closed.
   The lavandin often carries a pair of shorter side spikes on long stalks from a node below its main spike ---------- */
const CW_L62LA=[
 {id:'hidcote',n:'Violet profond (Hidcote)',c:'#4e3477',k:'#6a3f9a'},
 {id:'maillette',n:'Bleu lavande (Maillette)',c:'#7d70b6',k:'#8a6cc8'},
 {id:'grosso',n:'Violet bleuté (lavandin Grosso)',c:'#6c4f9c',k:'#7b58b8',lv:1},
 {id:'super',n:'Bleu clair (lavandin Super)',c:'#7486b8',k:'#8a8ad0',lv:1},
 {id:'sechee',n:'Bleu nuit (séchée en bouton)',c:'#3a4a8a',dry:1},
 {id:'rose',n:'Rose (Rosea)',c:'#d8a8c8',k:'#e6b4d4',kx:'#b8a0b0'},
 {id:'blanc',n:'Blanc (Edelweiss)',c:'#f0eee8',k:'#f8f6f2',kx:'#c4c8b4'}];
function l62Lav(g,t,o){const cw=cwPick(CW_L62LA,o),op=cw.dry?.12:Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],bq=!!o.spine,Ls=(o.cm||6)*UPC*(cw.lv?1.5:1),Lt=bq?blen(o.spine):Ls+34*UPC,
    A=lnAxis(o,Lt,{bow:R(-.03,.03)}),L=A.L,UP=[0,1,0],gi=GHI['lavande'],Rm=gi.rch,fd=gi.fx*.92,det=DET>=1.5,Lsp=Math.min(Ls,L*.45),Lb=L-Lsp,nM=8,w0=Math.max(1.35,.22*UPC),wt=Math.max(1.12,.16*UPC);
  const az0=R(0,360),kx=cw.kx||mix(cw.c,'#8a9a8a',cw.dry?.25:.38),kc=cw.k||cw.c,nW=Math.max(6,Math.round(Lsp/(UPC*(cw.lv?.5:.44)))),side=cw.lv&&!o.short;
  /* M: the peduncle in nM internodes (a node with its pair of leaves low down; on the lavandin a node with its two side spikes); T: the spike, whorl after whorl */
  const rules={M:p=>{if(p.i>=nM)return[['T',{j:0,n:nW,l:Lsp}]];const out=[['F',{l:Lb/nM*R(.92,1.08),w1:w0-(w0-wt)*(p.i+1)/nM,aim:UP,k:.12,wig:.006}]];
      if(p.i===1||p.i===3&&rnd()<.6)out.push(['Nd',{}],['[',{}],['/',{a:p.i*90+R(-15,15)}],['&',{a:R(28,40)}],['Lv',{}],[']',{}],['[',{}],['/',{a:p.i*90+180+R(-15,15)}],['&',{a:R(28,40)}],['Lv',{}],[']',{}]);
      if(side&&p.i===nM-2)for(const sd of[0,180])out.push(['[',{w:wt}],['/',{a:az0+sd+R(-20,20)}],['&',{a:R(16,24)}],['F',{l:Lb/nM*1.6,w1:wt,e:.01}],['T',{j:0,n:Math.round(nW*.45),l:Lsp*.42,sd:1}],[']',{}]);
      out.push(['M',{i:p.i+1}]);return out},
    T:p=>{if(p.j>=p.n)return[['F',{l:p.l/p.n*.4,w1:wt*.8,aim:UP,k:.08}]];const q=p.j/p.n,gap=p.j<2&&!p.sd?2.1-p.j*.6:1;
      return[['F',{l:p.l/p.n*gap*R(.9,1.1)*(1-.25*q),w1:wt,aim:UP,k:.1}],['W',{q,sd:p.sd||0}],['T',{j:p.j+1,n:p.n,l:p.l,sd:p.sd}]]}};
  const res=lsTurtle(lsDerive([['M',{i:0}]],rules,nM+nW+4),{p:[0,0,0],H:UP,U:[0,0,1],T:UP,e:0,wig:0,seg:1e6,w:w0}),Wq=l40Lay(A,bq,L,Rm,fd);
  const stc=lnCols(cw.dry?'#7a8a6a':'#7f8f6a','#e8eee0');for(const ch of res.chains)lnTube(ch.pts.map(Wq),ch.ws,()=>stc,parts,{gloss:.2,piece:20,min:.56});
  /* the whorls: calyces leaning out and up, the corolla peeping from the lower ones first; the top of the spike still in bud */
  const items=[],itB=[],cl=.62*UPC*(cw.lv?.9:1),cwd=.19*UPC,lim=bq?24:-1e9;
  for(const og of res.organs){if(og.t==='Lv'){const P=Wq(og.pos);if(bq&&og.pos[1]<lim)continue;const H=A.Wv(og.pos,og.H),U0=A.Wv(og.pos,og.U);parts.push(bzBlade(P,H,U0,UPC*R(3,4.5),.08,'#8a9a84',{wp:LS_STRAP,droop:.12,arch:.04,fold:.15,face:.4}));continue}
    if(og.t!=='W')continue;const q=og.p.q,P=Wq(og.pos),T=A.Wv(og.pos,og.H),[X,Y]=l62Across(T),nf=Math.round((det?9:7)*(og.p.sd?.7:1)*(1-.35*q)),ph=R(0,6.283),sz=(1-.35*q*q)*(og.p.sd?.85:1);
    for(let j=0;j<nf;j++){const a=ph+j/nf*6.283+R(-.2,.2),r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),el=R(1.0,1.2)-.15*q,dir=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(T,Math.sin(el)))),
        hl=cl*.5*sz*R(.9,1.1),c=V3.add(V3.add(P,V3.sc(r,wt*.4)),V3.sc(dir,hl)),acr=V3.nz(V3.cr(dir,[0,0,1])),fa=Math.hypot(dir[0],dir[1]),rw=cwd*.5*sz*(1+.15*(1-fa)),I=lightI(V3.nz(V3.add(r,[0,0,.35]))),ti=I>.66?2:I>.46?1:0;
      const m=op*1.55-q*.95+R(-.12,.12),cor=!cw.dry&&m>.5&&q<.92,tip=V3.add(c,V3.sc(dir,hl*.95)),back=V3.dot(r,[0,0,1])<-.25,bk=c[2]<P[2];
      (bk?itB:items).push({z:P[2]+(bk?-60:60)+c[2]*.01,fn:B=>{l30Add(B,'c'+ti,l62Ell(c,V3.sc(dir,hl),V3.sc(acr,rw),det?12:8));l30Add(B,'t'+ti,l62Ell(V3.add(c,V3.sc(dir,hl*.5)),V3.sc(dir,hl*.5),V3.sc(acr,rw*.92),det?10:7));if(det&&ti>0)l30Add(B,'cr',l62Seg(V3.add(c,V3.sc(dir,-hl*.6)),V3.add(c,V3.sc(dir,hl*.7))));
        /* the corolla: a small two-lipped flower at the mouth, its upper lip the larger, turned out */
        if(cor&&!back){const cd=V3.nz(V3.add(dir,V3.sc(r,.6))),[u,v]=l62Across(cd),s2=cwd*.85*Math.min(1,(m-.5)*2.2+.3)*sz,cc=V3.add(tip,V3.sc(cd,s2*.3));l30Add(B,'k'+ti,l62Ell(cc,V3.sc(u,s2),V3.sc(v,s2*.78),det?10:7));if(det)l30Add(B,'ke',l62Ell(V3.add(cc,V3.sc(cd,s2*.15)),V3.sc(u,s2*.28),V3.sc(v,s2*.22),6))}}})}}
  const PC=pal7(kx),PK=pal7(kc),keys=[];for(let i=0;i<3;i++)keys.push(['c'+i,{fill:toneAt(PC,[.36,.56,.76][i]),stroke:shd(kx,-.5),'stroke-width':det?.25:.18,'stroke-opacity':.55}]);
  const PT=pal7(cw.dry?cw.c:mix(kx,cw.c,.6));for(let i=0;i<3;i++)keys.push(['t'+i,{fill:toneAt(PT,[.36,.56,.76][i])}]);keys.push(['cr',{fill:'none',stroke:shd(kx,-.35),'stroke-width':.3,'stroke-opacity':.5}]);for(let i=0;i<3;i++)keys.push(['k'+i,{fill:toneAt(PK,[.42,.62,.82][i]),stroke:shd(kc,-.5),'stroke-width':det?.22:0,'stroke-opacity':.5}]);
  keys.push(['ke',{fill:shd(kc,-.55),opacity:.7}]);l30Batch(parts,itB,keys,det?4:3);l30Batch(parts,items,keys,det?5:3);
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0*2,bc:['#3e4a34','#5f6e50','#7f8f6a','#b0bc9c']}}
Object.assign(GH,{'lavande':l62Lav});CWS['lavande']=CW_L62LA;SZG['lavande']=[4,5,6,6,8,10];
GHI['lavande']={form:'epi',size:1,k:'plant',self:42*UPC,tip:.92,fx:3*UPC,rch:3.5*UPC};
GH_BUDS.add('lavande');

/* ---------- véronique (Veronica longifolia, syn. Pseudolysimachion longifolium, and its hybrids 'Marietta', 'Pink Shades', 'Schneeriesin'): an upright leafy stem,
   opposite (or in threes) lanceolate leaves, sharply toothed, nearly sessile; at its top a long tapering spike (10–25 cm), dense with small flowers (6–8 mm) on very short stalks,
   four unequal lobes and two long stamens standing out, opening from the base of the spike upward while its slender tip is still a tail of buds;
   from the upper axils one or two shorter side spikes ---------- */
const CW_L62VE=[
 {id:'bleu',n:'Bleu (Marietta)',c:'#5a6abf'},
 {id:'bleu-violet',n:'Bleu violet (Blauriesin)',c:'#6a5bb3'},
 {id:'violet',n:'Violet profond (Dark Martje)',c:'#6e4a9d'},
 {id:'lilas',n:'Lilas (Lila Karina)',c:'#a596d3'},
 {id:'rose',n:'Rose (Pink Shades)',c:'#e39abb'},
 {id:'rose-vif',n:'Rose vif (Red Fox)',c:'#c8508a'},
 {id:'blanc',n:'Blanc (Schneeriesin)',c:'#f3f1ea'}];
function l62Veron(g,t,o){const cw=cwPick(CW_L62VE,o),op=Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],bq=!!o.spine,Ls=(o.cm||18)*UPC,Lt=bq?blen(o.spine):Ls+40*UPC,
    A=lnAxis(o,Lt,{bow:R(-.05,.05)}),L=A.L,UP=[0,1,0],gi=GHI['veronique'],Rm=gi.rch,fd=gi.fx*.92,det=DET>=1.5,Lsp=Math.min(Ls,L*.42),Lb=L-Lsp,nM=6,w0=Math.max(1.6,.32*UPC),wt=Math.max(1.15,.12*UPC);
  const nS=Math.max(10,Math.round(Lsp/(UPC*.3))),sides=o.short?0:rnd()<.75?(rnd()<.45?2:1):0;
  /* M: the leafy stem, a pair of leaves at every node (in its upper axils the side spikes); S: a spike, step after step, florets spiralled round it */
  const rules={M:p=>{if(p.i>=nM)return[['S',{j:0,n:nS,l:Lsp,sd:0}]];const out=[['F',{l:Lb/nM*R(.9,1.1)*(p.i<2?1.25:.9),w1:w0-(w0-wt*1.4)*(p.i+1)/nM,aim:UP,k:.1,wig:.008}],['Nd',{}]],ph=p.i*90+R(-12,12);
      for(const sd of[0,180])out.push(['[',{}],['/',{a:ph+sd}],['&',{a:R(42,58)}],['Lv',{i:p.i}],[']',{}]);
      if(p.i>=nM-sides)out.push(['[',{w:wt*1.2}],['/',{a:ph+90+(p.i%2)*180+R(-15,15)}],['&',{a:R(24,34)}],['F',{l:Lb/nM*.8,w1:wt*1.1,e:.02}],['S',{j:0,n:Math.round(nS*.5),l:Lsp*.5,sd:1}],[']',{}]);
      out.push(['M',{i:p.i+1}]);return out},
    S:p=>{if(p.j>=p.n)return[];const q=p.j/p.n;return[['F',{l:p.l/p.n*R(.92,1.08),w1:Math.max(1.05,wt*(1-.5*q)),aim:UP,k:.12,wig:.01}],['Sp',{q,sd:p.sd}],['S',{j:p.j+1,n:p.n,l:p.l,sd:p.sd}]]}};
  const res=lsTurtle(lsDerive([['M',{i:0}]],rules,nM+nS+4),{p:[0,0,0],H:UP,U:[0,0,1],T:UP,e:0,wig:0,seg:1e6,w:w0}),Wq=l40Lay(A,bq,L,Rm,fd),lim=bq?24:-1e9;
  const stc=lnCols('#5a7a42','#eef4e0');for(const ch of res.chains)lnTube(ch.pts.map(Wq),ch.ws,()=>stc,parts,{gloss:.25,piece:18,min:.56});
  /* the florets: a dense cylinder tapering to a fine tail; open below (four lobes, the upper one widest, a pale eye, two stamens), buds above */
  const itF=[],itB=[],fr=.32*UPC*(det?1:1.1),P=pal7(cw.c),pale=h2l(cw.c)[2]>.82,bud=pale?mix(cw.c,'#c8d4b0',.45):mix(shd(cw.c,-.15),'#6a7a5a',.3),ph0=R(0,6.283);let cnt=0;
  for(const og of res.organs){if(og.t==='Lv'){if(bq&&og.pos[1]<lim)continue;const Pp=Wq(og.pos),H=A.Wv(og.pos,og.H),U0=A.Wv(og.pos,og.U),u=og.p.i/(nM-1);
      parts.push(bzBlade(Pp,H,U0,UPC*(9-3.5*u)*R(.9,1.1),.2,'#4f7337',{wp:LS_LANCE,teeth:det?11:8,td:.1,droop:.18,arch:.06,fold:.22,face:.4,vn:4}));continue}
    if(og.t!=='Sp')continue;const q=og.p.q,P0=Wq(og.pos),T=A.Wv(og.pos,og.H),[X,Y]=l62Across(T),rr=(.42-.3*q)*UPC*(og.p.sd?.8:1),nf=Math.max(2,Math.round((det?8:6)*(1-.6*q))),zA=P0[2];
    for(let j=0;j<nf;j++){const a=ph0+(cnt++)*2.39996,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),c=V3.add(P0,V3.add(V3.sc(r,rr*R(.85,1.05)),V3.sc(T,R(-.5,.5)*UPC*.3))),
        m=op*1.5-q*1.25+R(-.1,.1),nrm=V3.nz(V3.add(r,V3.sc(T,.35))),I=lightI(nrm[2]>=-.1?nrm:V3.sc(nrm,-1)),ti=I>.68?2:I>.48?1:0,bk=c[2]<zA,arr=bk?itB:itF,z=zA+(bk?-60:60)+c[2]*.01,bs=V3.add(P0,V3.sc(r,wt*.4));
      if(m<.5||q>.93){const bl=fr*(.7+.35*Math.max(0,m+.3))*(1-.35*q),bc=V3.add(c,V3.sc(r,-bl*.3)),dd=V3.nz(V3.add(r,V3.sc(T,.9)));arr.push({z,fn:B=>{l30Add(B,'pd',l62Seg(bs,bc));l30Add(B,'u'+ti,l62Ell(bc,V3.sc(dd,bl*.55),V3.sc(V3.nz(V3.cr(dd,[0,0,1])),bl*.38),det?9:7))}});continue}
      const s=fr*R(.9,1.1)*Math.min(1,.6+(m-.5)),[u,v]=l62Across(nrm),fa=Math.abs(nrm[2]);
      arr.push({z,fn:B=>{l30Add(B,'pd',l62Seg(bs,c));let d='';for(let i=0;i<4;i++){const t=a+i*1.5708,lr=s*(i===0?1.12:i===2?.82:1),dl=V3.add(V3.sc(u,Math.cos(t)),V3.sc(v,Math.sin(t))),e=V3.add(c,V3.sc(dl,lr)),
          s1=V3.add(c,V3.sc(V3.add(V3.sc(u,Math.cos(t-.62)),V3.sc(v,Math.sin(t-.62))),lr*.72)),s2=V3.add(c,V3.sc(V3.add(V3.sc(u,Math.cos(t+.62)),V3.sc(v,Math.sin(t+.62))),lr*.72));d+=(i?'L':'M')+f(s1[0])+','+f(-s1[1])+'Q'+f(e[0])+','+f(-e[1])+' '+f(s2[0])+','+f(-s2[1])}
        l30Add(B,(bk&&fa<.5?'b':'f')+ti,d+'Z');if(det&&!bk){l30Add(B,'ey',l30O(c[0],c[1],s*.22));const st=V3.add(c,V3.sc(V3.nz(V3.add(nrm,V3.sc(T,.6))),s*1.5));l30Add(B,'sm',l62Seg(c,st)+l30O(st[0],st[1],s*.16))}}})}}
  const keys=[['pd',{fill:'none',stroke:'#5f7f48','stroke-width':L62_PW,'stroke-linecap':'round'}]],PB=pal7(bud);
  for(let i=0;i<3;i++)keys.push(['u'+i,{fill:toneAt(PB,[.4,.6,.8][i]),stroke:shd(bud,-.5),'stroke-width':det?.2:0,'stroke-opacity':.5}]);
  for(let i=0;i<3;i++)keys.push(['b'+i,{fill:toneAt(P,[.3,.45,.6][i]),stroke:shd(cw.c,-.5),'stroke-width':det?.2:0,'stroke-opacity':.45}]);
  for(let i=0;i<3;i++)keys.push(['f'+i,{fill:toneAt(P,[.48,.66,.84][i]),stroke:shd(cw.c,pale?-.3:-.5),'stroke-width':det?.22:.15,'stroke-opacity':.5}]);
  keys.push(['ey',{fill:pale?'#e8e4c8':mix(cw.c,'#ffffff',.6)}],['sm',{fill:pale?'#c8b890':shd(cw.c,-.4),stroke:pale?'#c8c0a0':mix(cw.c,'#e8e0f0',.3),'stroke-width':.3}]);
  l30Batch(parts,itB,keys,det?4:2);l30Batch(parts,itF,keys,det?6:3);
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0*2,bc:['#2e4220','#4f7337','#6f9050','#a4c080']}}
Object.assign(GH,{'veronique':l62Veron});CWS['veronique']=CW_L62VE;SZG['veronique']=[12,15,18,18,22,25];
GHI['veronique']={form:'epi',size:1,k:'plant',self:60*UPC,tip:.86,fx:4*UPC,rch:5*UPC};
GH_BUDS.add('veronique');
