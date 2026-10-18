window.snapSvg=async function(svg,W,name,bg){const XS=new XMLSerializer(),vb=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number),H=Math.round(W*vb[3]/vb[2]);
  const find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id);let out='';const seen=new Set();
  const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);out+=s;add(s)}}};
  /* ?pix=x:y,x:y (pixels of the snap): the shapes that paint there (point in fill or stroke), to name a stray piece */
  {const pq=new URLSearchParams(location.search).get('pix');if(pq){const SC=svg.getScreenCTM(),R=[];for(const t of pq.split(',')){const[x,y]=t.split(':').map(Number),X=vb[0]+(x+.5)*vb[2]/W,Y=vb[1]+(y+.5)*vb[3]/H,sp=new DOMPoint(X,Y).matrixTransform(SC),hs=[];
    for(const el of svg.querySelectorAll('path,ellipse,circle,rect,polygon')){let M;try{M=el.getScreenCTM().inverse()}catch(_){continue}const lp=sp.matrixTransform(M);let f=0,k=0;try{f=el.isPointInFill(lp);k=!f&&el.getAttribute('stroke')&&el.getAttribute('stroke')!=='none'&&el.isPointInStroke(lp)}catch(_){}
      if(f||k){const ch=[];let n=el.parentNode;while(n&&n!==svg&&ch.length<6){ch.push(n.tagName+(n.getAttribute('clip-path')?'C':'')+(n.dataset&&Object.keys(n.dataset).length?JSON.stringify(n.dataset):''));n=n.parentNode}
        hs.push([k?'S':'F',el.getAttribute('fill'),el.getAttribute('fill-opacity')||el.getAttribute('opacity'),el.getAttribute('stroke'),el.getAttribute('stroke-width'),el.getAttribute('clip-path'),ch.join('<'),(el.getAttribute('d')||'').slice(0,90)])}}
    const top=hs.filter(h=>/^url/.test(h[1]||'')).pop()||null,sp2=top&&/^url/.test(top[1]||'')?[...svg.querySelectorAll('path[stroke]')].filter(e=>e.getAttribute('stroke')===top[1]).map(e=>e.getAttribute('d')):[];
    R.push({p:t,hs:hs.slice(-6),full:(top&&([...svg.querySelectorAll('path')].find(e=>e.getAttribute('fill')===top[1]&&/^url/.test(top[1]||''))||{getAttribute:()=>''}).getAttribute('d'))||'',spine:sp2})}window.__svtDbg=R}}
  const body=[...svg.children].filter(n=>n.tagName!=='defs').map(n=>XS.serializeToString(n)).join('');add(body);
  const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${vb.join(' ')}"><defs>${out}</defs>${body}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;await img.decode();URL.revokeObjectURL(url);
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');if(bg){cx.fillStyle=bg;cx.fillRect(0,0,W,H)}
  cx.drawImage(img,0,0,W,H);const d=cv.toDataURL('image/png');const r=await fetch('http://127.0.0.1:8781/save?name='+name,{method:'POST',body:d});return[r.status,W,H]};

/* the measures of a sheet, for a headless run (fleur/shot.sh): heads, elements and KB per head, patches per head, ms per head */
window.svtOut=(svg,n,ms,snapP)=>{const el=svg.querySelectorAll('*').length,pat=[...svg.querySelectorAll('use')].filter(u=>(u.getAttribute('clip-path')||'').includes('#sq')).length,
    kb=new XMLSerializer().serializeToString(svg).length/1024,o={n,el:Math.round(el/n),kb:Math.round(kb/n),patch:+(pat/n).toFixed(1)};
  /* &bd=1 (chantier grappes): per cell, the elements / KB of each top-level piece of the drawing (stem, leaves, head...), then the shared defs */
  if(new URLSearchParams(location.search).get('bd')){const XS=new XMLSerializer(),m=k=>k.querySelectorAll('*').length+1+'/'+(XS.serializeToString(k).length/1024).toFixed(1)+(new URLSearchParams(location.search).get('bd')==='2'?'/'+(k.getAttribute('fill')||k.tagName):'');
    o.bd=[...svg.children].filter(g=>g.tagName==='g').map(g=>{let k=g;while(k&&k.children.length===1)k=k.firstElementChild;return k?[...k.children].map(m).join(' '):''});const d=svg.querySelector('defs');if(d){o.defs=m(d);
      /* the defs by kind: id prefix (letters) -> count, elements, KB */const by={};for(const c of d.children){const k=c.tagName.slice(0,3)+':'+(c.id||'').replace(/[0-9_-].*$/,''),b=by[k]||(by[k]=[0,0,0]);b[0]++;b[1]+=c.querySelectorAll('*').length+1;b[2]+=XS.serializeToString(c).length/1024}
      /* &dump=1: the whole markup, to analyse offline (one stage) */if(new URLSearchParams(location.search).get('dump'))o.dump=XS.serializeToString(svg);
      o.defsBy=Object.fromEntries(Object.entries(by).sort((a,b)=>b[1][2]-a[1][2]).map(([k,v])=>[k,v[0]+'x '+v[1]+'el '+v[2].toFixed(1)+'KB']))}}
  /* window.__svtDbg (a probe a module may fill while debugging): copied into the measures */if(window.__svtDbg)o.dbg=window.__svtDbg;
  /* &loc=1 on a plant sheet (fleur/pipe.py pairs feuille and tige): where svtStem put the stem and its leaves, in pixels of the snap: per cell the
     stem's midline (25 points), its width at mid-length, the box of the stem and the box of each leaf; size = the snap's width and height */
  if(new URLSearchParams(location.search).get('loc')&&window.__svtLoc){const Q=new URLSearchParams(location.search),W0=+svg.getAttribute('width'),H0=+svg.getAttribute('height'),k=(+(Q.get('sw'))||2*W0)/W0,R=svg.getBoundingClientRect(),
      bx=e=>{const b=e.getBoundingClientRect();return[b.left-R.left,b.top-R.top,b.right-R.left,b.bottom-R.top].map(v=>Math.round(v*k))},un=(a,b)=>[Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[2],b[2]),Math.max(a[3],b[3])];
    o.loc={k:+k.toFixed(4),size:[Math.round(W0*k),Math.round(H0*k)],cells:window.__svtLoc.map(q=>{const M=svg.getScreenCTM().inverse().multiply(q.par.getScreenCTM()),sc=Math.sqrt(Math.abs(M.a*M.d-M.b*M.c));
      return{stem:q.C.map(p=>[Math.round((M.a*p[0]+M.c*p[1]+M.e)*k),Math.round((M.b*p[0]+M.d*p[1]+M.f)*k)]),w:+(q.W[12]*sc*k).toFixed(1),
        sbox:q.stem.length?q.stem.map(bx).reduce(un):null,leaves:q.leaves.map(bx).filter(b=>b[2]>b[0]&&b[3]>b[1])}})}}
  const fin=r=>{const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(Object.assign(o,r?{snap:r.join('x')}:{}));document.body.append(pre)};
  if(snapP)snapP.then(fin,e=>fin(['err '+e]));else fin()};
/* SVG pilot sheet: heads at several views and seeds. URL: cw, op, D, seeds, views (indices), cols, det, bg, sp (species) */
if(!new URLSearchParams(location.search).get('cmp')&&!new URLSearchParams(location.search).get('grid')&&!new URLSearchParams(location.search).get('plant')&&!new URLSearchParams(location.search).get('bq'))setTimeout(()=>{const Q=new URLSearchParams(location.search),dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
  document.body.style.cssText='margin:0;background:'+(Q.get('bg')||'#e9e4dc');DET=+(Q.get('det')||1.5);LOD=0;
  const cw=Q.get('cw')||'bleu',op=+(Q.get('op')||1),D=+(Q.get('D')||240),seeds=(Q.get('seeds')||'1,2,3,4').split(',').map(Number),cols=+(Q.get('cols')||seeds.length),
    VIEWS=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0],[0,-.97,-.24,0],[.35,-.9,.26,.3],[0,-.55,.83,0]],vi=(Q.get('views')||'0,1,2,3').split(',').map(Number),
    cells=[];for(const v of vi)for(const s of seeds)cells.push([v,s]);
  const gap=D*1.12,rows=Math.ceil(cells.length/cols),W=Math.round(cols*gap+D*.2),H=Math.round(rows*gap+D*.2),svg=E('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`},document.body);GDEF=E('defs',{},svg);
  window.SVT={n:0,ms:0,el:0,bytes:0};
  cells.forEach(([v,s],k)=>{const c=k%cols,r=Math.floor(k/cols),X=D*.1+gap*(c+.5),Y=D*.1+gap*(r+.5),V=VIEWS[v],B=basis(V3.nz([V[0],V[1],V[2]]),V[3]),g=G(svg),t0=performance.now();
    if((Q.get('sp')||'anem')==='anem')anemSvg(g,B,[X,-Y,0],D,cw,op,s);
    SVT.ms+=performance.now()-t0;SVT.n++;SVT.el+=g.querySelectorAll('*').length;SVT.bytes+=g.outerHTML.length});
  SVT.defs=GDEF.querySelectorAll('*').length;SVT.defsBytes=GDEF.outerHTML.length;document.title='ok '+JSON.stringify(SVT);
  if(Q.get('snap'))snapSvg(svg,+(Q.get('sw')||W),Q.get('snap'),Q.get('bg')||'#e9e4dc').then(r=>{document.title+=' snap '+r.join(',')})},400);
/* comparison with a reference photograph (hotlinked, never stored): ?cmp=55&ax=0,.7,.71&roll=0&op=.5&seed=3&sc=1 -> left the photo crop, right the
   drawing at the same size; saved to bronze/out/<snap> */
const SV_REF={55:['https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Anemone_%22de_Caan%22_%2849730384412%29.jpg/1280px-Anemone_%22de_Caan%22_%2849730384412%29.jpg',[.07,0,.89,.82],.38],
  78:['https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Anemone_in_my_garden_%288600733848%29.jpg/1280px-Anemone_in_my_garden_%288600733848%29.jpg',[0,0,1,1],.6],
  99:['https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Bucuresti%2C_Romania._Floare_Anemona._Cimitirul_Bellu_Catolic._Mormantul_compozitorului_Dan_Iagnov._Aprilie_2023.jpg/1280px-Bucuresti%2C_Romania._Floare_Anemona._Cimitirul_Bellu_Catolic._Mormantul_compozitorului_Dan_Iagnov._Aprilie_2023.jpg',[0,0,1,1],.46],
  123:['https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Purple_Flower.jpg/1280px-Purple_Flower.jpg',[.1,0,.9,.9],.42],
  214:['https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/White-Anemone-Sitia-Crete-Greece.jpg/1280px-White-Anemone-Sitia-Crete-Greece.jpg',[.27,.12,.78,.98],.3],
  195:['https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/PikiWiki_Israel_47635_Plants_of_Israel.JPG/1280px-PikiWiki_Israel_47635_Plants_of_Israel.JPG',[.25,.05,.85,.75],.3]};
const SV_AR={55:[1280,1024],78:[1280,720],99:[1280,1285],123:[1280,851],214:[1280,853],195:[1280,1069]};
/* the drawing alone, at the size of the photo's crop (the photo is shown next to it in the Commons tab) */
window.svCmp=async(Q)=>{const id=Q.get('cmp'),ref=SV_REF[id],ar=SV_AR[id],P=+(Q.get('pw')||640),[x0,y0,x1,y1]=ref[1],sw=(x1-x0)*ar[0],shh=(y1-y0)*ar[1],PH=Math.round(P*shh/sw),D=+(Q.get('D')||P*ref[2]*2*(+(Q.get('dk')||1)));
  document.body.innerHTML='';const svg=E('svg',{width:P,height:PH,viewBox:`0 0 ${P} ${PH}`},document.body);GDEF=E('defs',{},svg);DET=+(Q.get('det')||1.5);
  const ax=(Q.get('ax')||'0,0,1').split(',').map(Number),B=basis(V3.nz(ax),+(Q.get('roll')||0)),cx=+(Q.get('cx')||.5)*P,cy=+(Q.get('cy')||.5)*PH;
  anemSvg(G(svg),B,[cx,-cy,0],D,Q.get('cw')||'bleu',+(Q.get('op')||1),+(Q.get('seed')||1));
  const r=await snapSvg(svg,Math.round(P*(+(Q.get('k')||1.6))),Q.get('snap')||'cmp.png',Q.get('bg')||'#e9e4dc');document.title='cmp '+r.join(',')};
if(new URLSearchParams(location.search).get('cmp'))setTimeout(()=>svCmp(new URLSearchParams(location.search)).catch(e=>document.title='ERR '+e.message),450);
/* stages × colourways: ?grid=1&cws=bleu,rouge&st=.06:0,.2:0,.4:0,.75:0,1:.35,1:.75&view=2&D=120 */
if(new URLSearchParams(location.search).get('grid'))setTimeout(()=>{const Q=new URLSearchParams(location.search),dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
  DET=+(Q.get('det')||1.5);LOD=0;const cws=(Q.get('cws')||'bleu').split(','),st=(Q.get('st')||'.06:0,.2:0,.4:0,.75:0,1:.35,1:.75').split(',').map(x=>x.split(':').map(Number)),D=+(Q.get('D')||120),
    VIEWS=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0],[.97,-.17,.17,0],[-.62,-.26,.74,0],[0,-.97,-.24,0],[.35,-.9,.26,.3],[0,-.55,.83,0],[.5,.1,-.86,0]],VL=(Q.get('view')||'2').split(',').map(x=>VIEWS[+x]),rws=[];for(const cw of cws)for(const V of VL)rws.push([cw,V]);const gap=D*+(Q.get('gapk')||1.15),W=Math.round(st.length*gap+D*.3),H=Math.round(rws.length*gap+D*.2),
    svg=E('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`},document.body);GDEF=E('defs',{},svg);let ms=0,n=0;
  rws.forEach(([cw,V],r)=>st.forEach(([op,wl],c)=>{const B=basis(V3.nz([V[0],V[1],V[2]]),V[3]),X=D*.2+gap*(c+.5),Y=D*.1+gap*(r+.55),t0=performance.now(),seed=+(Q.get('seed')||3)+r*7+c;
    const sid=Q.get('sid')||'anemone-coronaria',spec=/^SVT_[A-Z]+$/.test(Q.get('spec')||'')?eval(Q.get('spec')):null,hf=spec?(p,B2,O2,D2,c2,o2,s2,w2)=>tulSvg(p,B2,O2,D2,c2,o2,s2,w2,spec):(typeof SV_HEAD!=='undefined'&&SV_HEAD[sid])||anemSvg,T0=WILT;if(wl>0&&typeof lifeWilt==='function')WILT=lifeWilt(wl,(GHI[sid]&&GHI[sid].wilt)||svaWiltCol,sid);const oz=+(Q.get('oz')||0),Vn=V3.nz([V[0],V[1],V[2]]);try{hf(G(svg),B,[X-Vn[0]*oz*D,-Y-Vn[1]*oz*D,-Vn[2]*oz*D],D,cw,op,seed,wl)}finally{WILT=T0}ms+=performance.now()-t0;n++}));
  document.title='grid '+n+' '+Math.round(ms/n)+'ms';const sp=Q.get('snap')?snapSvg(svg,+(Q.get('sw')||W),Q.get('snap'),'#e9e4dc'):null;if(sp)sp.then(r=>{document.title+=' snap '+r.join(',')});svtOut(svg,n,ms,sp)},400);
/* whole stems: ?plant=1&cw=bleu&st=.1:0,.3:0,.6:0,1:0,1:.4,1:.75&vw=-.45,.15,.88 → drawRec of the species, one cell per stage, fitted */
if(new URLSearchParams(location.search).get('plant'))setTimeout(()=>{/* &ordbg=1: the orchid scapes' flowers (svorScape) after the measures */if(new URLSearchParams(location.search).get('ordbg')&&window.svtOut){window.SVOR_DBGL=[];const f0=window.svtOut;window.svtOut=function(){const r=f0.apply(this,arguments),add=()=>{const p=document.getElementById('out');if(!p)return setTimeout(add,50);p.textContent+=String.fromCharCode(10)+'ORDBG '+JSON.stringify(window.SVOR_DBGL)};add();return r}}
  const Q=new URLSearchParams(location.search),dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
  /* seed=<n>: the sheet's own chance, whatever the page drew before it (to compare two builds) */
  if(Q.get('seed'))sd(+Q.get('seed'));
  DET=+(Q.get('det')||1.5);LOD=0;const sid=Q.get('sid')||'anemone-coronaria',rec=RBY[sid],cw=(CWS[sid]||[]).find(x=>x.id===(Q.get('cw')||'bleu')),st=(Q.get('st')||'.1:0,.3:0,.6:0,1:0,1:.4,1:.75').split(',').map(x=>x.split(':').map(Number)),
    vw=(Q.get('vw')||'-.45,.15,.88').split(',').map(Number),cellW=+(Q.get('cell')||170),svg=E('svg',{width:cellW*st.length,height:cellW*2.2,viewBox:`0 0 ${cellW*st.length} ${cellW*2.2}`},document.body);GDEF=E('defs',{},svg);
  /* full=<cm>[,<cm>...] (cycled over the cells): the whole cut stem below the head's neck, with the leaves its species carries in a bouquet (STEML, stemLeaves), as in the vase */
  const fulls=(Q.get('full')||'0').split(',').map(Number);let full=fulls[0];const own=(GHI[sid]&&GHI[sid].wilt)||svaWiltCol;let ms=0;
  st.forEach(([op,wl],i)=>{full=fulls[i%fulls.length];const g=G(svg),k=G(g),sk=full?G(k):null;SVA_LIFE=wl||null;const T0=WILT;if(wl>0)WILT=lifeWilt(wl,own,sid);const t0=performance.now();
    /* &strand=60,48,37 (cm, one per cell, cycled): a free strand of that length (o.len: the wisteria's strand as in a bouquet, room unbounded) */
    const sl=(Q.get('strand')||'').split(',').filter(Boolean).map(Number);
    /* (the cells' strands as the three strands of one stem held in the hand: one shared drape, its room unbounded) */
    if(sl.length&&typeof DRAPEX!=='undefined'){if(!window.__svtDr)window.__svtDr={x:0,y:0,side:1,held:true,top:0,mw:26,mcx:0,FL:0};DRAPEX=window.__svtDr}
    try{renderStatic(()=>{const r=drawRec(k,0,rec,Object.assign({vw,ax:Q.get('axv')?vw:undefined,op,cw,col:cw&&cw.c,roll:0},sl.length?{len:sl[i%sl.length]*UPC}:{}));if(sk&&r&&r.neck)svtStem(sk,r,sid,full)})}finally{WILT=T0;SVA_LIFE=null;if(sl.length&&typeof DRAPEX!=='undefined')DRAPEX=null}ms+=performance.now()-t0;
    const b=k.getBBox(),s=Math.min(cellW*.9/b.width,cellW*2.1/b.height);(window.__svtFit=window.__svtFit||[]).push([k,b,i,s]);k.setAttribute('transform',`translate(${f(cellW*(i+.5)-(b.x+b.width/2)*s)},${f(cellW*1.1-(b.y+b.height/2)*s)}) scale(${s.toFixed(4)})`)});
  /* same=1: one scale for every cell (the smallest), the stems standing on one ground line: their lengths compare */
  if(Q.get('same')&&window.__svtFit){const s=Math.min(...window.__svtFit.map(q=>q[3]));for(const[k,b,i]of window.__svtFit)k.setAttribute('transform',`translate(${f(cellW*(i+.5)-(b.x+b.width/2)*s)},${f(cellW*2.15-(b.y+b.height)*s)}) scale(${s.toFixed(4)})`)}
  document.title='plant ok';const sp=Q.get('snap')?snapSvg(svg,+(Q.get('sw')||cellW*st.length*2),Q.get('snap'),Q.get('bg')||'#e9e4dc'):null;if(sp)sp.then(r=>{document.title+=' snap '+r.join(',')});svtOut(svg,st.length,ms,sp)},400);
/* the stem below a head's neck (r: what the head hands back), cm long, with its leaves */
window.svtStem=(par,r,sid,cm)=>{const e=r.neck,nd=r.nd||[0,1],L=cm*UPC,P3=e,P2=[e[0]+nd[0]*L*.3,e[1]+nd[1]*L*.3],P0=[e[0]+nd[0]*L*.3,e[1]+L],P1=[P0[0],P0[1]-L*.35],P=[P0,P1,P2,P3],C=[],W=[],w=(r.nw||3)*1.12;
  for(let i=0;i<=24;i++){C.push(bz(P,i/24));W.push(w*(1.08-.08*i/24))}
  /* STEML[sid].sheetY: the stem's leaves only above that share of its length (the rose's stripped foot), as a vessel's mouth would
     GHI[sid].basal(par,P,L,w,side): the whole plant's leaves from the foot of the stem (sheets only), behind (-1) then in front (1) of it */
  /* &loc=1 (fleur/pipe.py, pairs feuille and tige): which children of par are the stem and which the leaves, kept for svtOut (read only, nothing drawn) */
  const LOC=new URLSearchParams(location.search).get('loc'),k0=par.children.length;let k1=k0,k2=k0;
  const bl=GHI[sid]&&GHI[sid].basal;if(bl)bl(par,P,L,W[0],-1);k1=par.children.length;if(GHI[sid]&&GHI[sid].cut&&typeof svStemCut==='function')svStemCut(par,C,W,r.ncols||SG,(g2,C2,W2)=>stemPoly(g2,C2,W2,r.ncols||SG));else stemPoly(par,C,W,r.ncols||SG);k2=par.children.length;if(STEML[sid])stemLeaves(par,P,sid,STEML[sid].sheetY?e[1]+L*STEML[sid].sheetY:P0[1]+L,L*.3,0);if(bl)bl(par,P,L,W[0],1);
  if(LOC){const ch=[...par.children];(window.__svtLoc=window.__svtLoc||[]).push({par,C,W,stem:ch.slice(k1,k2),leaves:ch.slice(k0,k1).concat(ch.slice(k2))})}};
/* the bouquet's chance, old drawing against the new: ?rtest=1&rc=tulipe-simple~7:7,tulipe-simple~12:6 → for each life stage and vessel, the bouquet's
   seed once it is drawn, with the SVG heads off and on (the same: the composition does not move) */
if(new URLSearchParams(location.search).get('rtest'))setTimeout(()=>{const Q=new URLSearchParams(location.search),rc=(Q.get('rc')||'tulipe-simple~7:7,tulipe-simple~12:6').split(',').map(x=>{const[a,b]=x.split(':');return[a,+b]}),out=[];
  for(const L of[null,{stage:0,u:.5},{stage:2,u:.5},{stage:3,u:.3},{stage:3,u:1}])for(const v of['cylindre-verre-clair','coupe-pied-blanche']){const res=[];
    if(Q.get('boxlog'))window.SPD_BOXLOG=[];const sts=[];for(const on of[false,true]){SV_ON=on;LIFE=L;const svg=E('svg',{},document.body);let s1;const r0=rnd;let hh=0,nn=0;const ST=Q.get('rtw')?{}:null;sts.push(ST);rnd=function(){const x=r0();nn++;hh=(Math.imul(hh,31)+Math.floor(x*1e9))|0;
      /* ?rtw=1: who draws (the three callers of each draw, name@line), to find what the SVG drawing consumes on top of the old one */
      if(ST){const k=new Error().stack.split('\n').slice(2,5).map(q=>{const m=q.trim().match(/^at (?:(\S+) )?\(?.*?:(\d+):\d+\)?$/);return m?(m[1]||'')+'@'+m[2]:'?'}).join('<');ST[k]=(ST[k]||0)+1}return x};try{renderStatic(()=>{buildBq(svg,[],+(Q.get('sv')||11),v,0,'juste',null,rc)});s1=nn+':'+hh+'/'+svg.querySelectorAll('*').length}catch(e){s1='ERR '+e.message}finally{rnd=r0}svg.remove();res.push(s1)}
    out.push((L?L.stage+':'+L.u:'-')+' '+v+' '+(res[0].split('/')[0]===res[1].split('/')[0]?'IDENTIQUE':'DIFFERENT')+' '+res.join(' / '));
    /* ?boxlog=1: the scales svSpdKeepBox gave the SVG heads of the run with SV on (y3-spathe.js) */
    if(Q.get('boxlog')&&window.SPD_BOXLOG){out.push('  box: '+SPD_BOXLOG.map(q=>q[0]).join(','));if(Q.get('boxlog')==='2')out.push('  boxes: '+JSON.stringify(SPD_BOXLOG.slice(0,6)));SPD_BOXLOG=[]}
    if(sts[0]&&res[0].split('/')[0]!==res[1].split('/')[0]){const ks=new Set([...Object.keys(sts[0]),...Object.keys(sts[1])]),d=[];for(const k of ks){const x=sts[0][k]||0,y=sts[1][k]||0;if(x!==y)d.push([y-x,k+' '+x+'>'+y])}
      d.sort((p,q)=>Math.abs(q[0])-Math.abs(p[0]));out.push('  why: '+d.slice(0,+(Q.get('rtn')||8)).map(q=>q[1]).join(' ; '))}}
  SV_ON=true;LIFE=null;const pre=document.createElement('pre');pre.id='out';const ok=window.ROSA_OBK;if(ok&&ok.length){const s=ok.slice().sort((a,b)=>a-b);out.push('OBK n'+s.length+' <1:'+s.filter(x=>x<1).length+' min '+s[0].toFixed(3)+' med '+s[s.length>>1].toFixed(3))}const ow=window.ROSA_OBW;if(ow&&ow.length){const md=j=>{const s=ow.filter((_,i)=>i%3===j).sort((a,b)=>a-b);return s[s.length>>2].toFixed(2)+'/'+s[s.length>>1].toFixed(2)+'/'+s[(s.length*3)>>2].toFixed(2)};out.push('OBW w '+md(0)+' bot '+md(1)+' h '+md(2))}pre.textContent=out.join(' | ');document.body.append(pre)},400);
/* which pieces patch each other: ?grid=1&...&dbgp=1 → the pairs of pieces (index in the head: tepals first, then the heart's pieces; o outer, i inner)
   counted over the sheet, with the cells where each is in front (only the pairs svDraw patches) */
if(new URLSearchParams(location.search).get('dbgp')){const PC={},oDraw=svDraw,oOrd=svOrder;let cur=null;
  svDraw=function(par,pieces,o){window._dbT=pieces.map(p=>p.tag||(p.proxy&&p.proxy.tag)||null);pieces.forEach((p,i)=>{p._i=i;if(p.proxy)p.proxy._i=i});cur=pieces.length;return oDraw(par,pieces,o)};
  svOrder=function(items,eps){const out=oOrd(items,eps);for(const[A,B2,fa,fb]of out.fr){const a=A.oi,b=B2.oi;const[e,l,c]=a<b?[A,B2,fa]:[B2,A,fb];if(c<3)continue;
      const sa=(A.sh||A.px||{}),sb=(B2.sh||B2.px||{}),nm=q=>(q._i!=null&&window._dbT&&window._dbT[q._i])||(q._i==null?'?':q._i<3?'o'+q._i:q._i<6?'i'+q._i:'h'+q._i),k=[nm(sa),nm(sb)].sort().join('-');PC[k]=(PC[k]||0)+1}return out};
  window.svtOut0=window.svtOut;window.svtOut=(svg,n,ms,sp)=>{const pre=document.createElement('pre');pre.id='out';const L=Object.entries(PC).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+v);pre.textContent=L.join(' ');document.body.append(pre)}}
/* wireframe of the sheets: ?grid=1&...&axes=1 → over every svSheet piece a head draws through svDraw (its sheets, and the proxies of its drawn
   parts, dashed grey) three thin lines in the piece's own frame: the midrib (u=0, v from 0 to 1, a dot at the base v=0), the +u direction at v=.5
   (from u=0 to u=+.5 along the sheet, a dot at its +u end) and the normal of the inner face at the centre (u=0, v=.5; svSheet's cross product
   dS/dv x dS/du, a quarter of the midrib long, dashed). One colour per whorl: the piece's tag w<n>, else its depth bias zb, else its index.
   Opt-in: without axes=1 nothing is wrapped and nothing changes. svDraw (app/y1.js) is wrapped here, never edited. */
if(new URLSearchParams(location.search).get('grid')&&new URLSearchParams(location.search).get('axes')==='1'){const aDraw=svDraw,
    PAL=['#e6194b','#1f9e3a','#2b5bd7','#f58231','#911eb4','#0fb5c9','#e0218a','#8a5a14'],NSA='http://www.w3.org/2000/svg',
    el=(t,a,p)=>{const e=document.createElementNS(NSA,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e},f=x=>Math.round(x*10)/10;
  window.SVT_AXES=0;
  svDraw=function(par,pieces,o){const k=aDraw(par,pieces,o),D=(o&&o.D)||100,sw=Math.max(.5,D*.0035),grp=new Map(),g=el('g',{'data-axes':'1',fill:'none','stroke-linecap':'round'},k);
    pieces.forEach((p,i)=>{const sh=p&&p.fn?p.proxy:p;if(!sh||typeof sh.S!=='function'||!sh.B||!sh.O)return;
      const m=/^w(\d+)/.exec(String(p.tag||sh.tag||'')),key=m?'w'+m[1]:sh.zb!=null?'z'+Math.round(sh.zb*1e4):'i'+i;if(!grp.has(key))grp.set(key,PAL[grp.size%PAL.length]);
      const col=p.fn?'#7a7a7a':grp.get(key),S=(u,v)=>sh.S(Math.max(-1,Math.min(1,u)),Math.max(0,Math.min(1,v))),at=q=>{const s=PJ(sh.B,sh.O,q);return[s[0],s[1]]},
        line=(P,w,dash)=>{const a={d:'M'+P.map(q=>f(q[0])+','+f(q[1])).join('L'),stroke:col,'stroke-width':f(w*10)/10};if(dash)a['stroke-dasharray']=f(w*3)+' '+f(w*2);el('path',a,g)},
        dot=(q,r)=>el('circle',{cx:f(q[0]),cy:f(q[1]),r:f(r*10)/10,fill:col,stroke:'none'},g);
      const mid=[];let len=0;for(let j=0;j<=16;j++){const q=S(0,j/16);if(j){const r=S(0,(j-1)/16);len+=Math.hypot(q[0]-r[0],q[1]-r[1],q[2]-r[2])}mid.push(q)}
      line(mid.map(at),sw,p.fn);dot(at(mid[0]),sw*1.6);
      const pu=[];for(let j=0;j<=8;j++)pu.push(at(S(j/16,.5)));line(pu,sw*1.4,false);dot(pu[pu.length-1],sw*1.4);
      const e=1e-3,c0=S(0,.5),dv=V3s(S(0,.5+e),S(0,.5-e)),du=V3s(S(e,.5),S(-e,.5)),n=V3.nz(V3.cr(dv,du)),L=len*.25;
      line([at(c0),at([c0[0]+n[0]*L,c0[1]+n[1]*L,c0[2]+n[2]*L])],sw,true);window.SVT_AXES++});
    return k}}
/* fit mode (fleur/fit.py): many candidate settings of one kind drawn in one headless run, one cell per (candidate, cell of the job).
   ?fit=1&job=<url of a json>&sp=fit&seeds=1&views=0&snap=  (the empty snap and sp=fit keep the default anemone sheet from drawing and saving;
   shot.sh appends the real snap name). The job: {sid, spec: the global name of the kind's sheet (SVA_P, SVT_SIMPLE...), cw: id or index in CWS[sid],
   D, gap (cell side x D), cols, det, cells:[{k:'head'|'plant', op, wl, view, seed, Dk (head size x D), vw, axv, full}], cands:[{path:value}], links:[{path,to,k,b}], probe:[paths]}.
   Paths: 'L.0' a svBloom setting of the sheet (from SVB_DEF when the sheet lacks it), '$NAME.a.b' a key of any global object (gene table, GHI, SVL_DEF),
   'mat.st.3.1' a field of the colourway's material; a final ':h' ':s' ':l' shifts a colour (svShift). Every change is undone after the candidate's
   cells (the sheet's cache S._m dropped), so the page's sheets end as they began. Out: pre#out {n,W,H,gap,cw,box:[[x0,y0,x1,y1]],base,err,ms} */
if(new URLSearchParams(location.search).get('fit')){const Q=new URLSearchParams(location.search),jobP=fetch(Q.get('job'),{cache:'no-store'}).then(r=>r.json());
  const dc=x=>Array.isArray(x)?x.map(dc):(x&&typeof x==='object'&&Object.getPrototypeOf(x)===Object.prototype)?Object.fromEntries(Object.entries(x).map(([k,v])=>[k,dc(v)])):x,
    own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),parse=p=>{const m=/^(.*?)(?::([hsl]))?$/.exec(p);return{ks:m[1].split('.'),ch:m[2]||null}},
    put=(old,ch,v)=>ch?svShift(old,ch==='h'?v:0,ch==='s'?v:0,ch==='l'?v:0):v,
    walk=(o,ks)=>{for(const k of ks)o=o==null?o:o[k];return o};
  /* the current value of a path (a colour shift starts at 0) */
  const getv=(S,p,cwo)=>{const{ks,ch}=parse(p);if(ch)return 0;if(ks[0][0]==='$')return walk(eval(ks[0].slice(1)),ks.slice(1));
    if(ks[0]==='mat')return walk(S.mat(cwo),ks.slice(1));return walk(own(S,ks[0])?S:SVB_DEF,ks)};
  /* set a path for one candidate: the touched top key is replaced by a deep copy (shared arrays of SVB_DEF or a parent sheet stay untouched) */
  const setv=(S,p,v,undo,mo)=>{const{ks,ch}=parse(p);if(ks[0]==='mat'){mo.push([ks.slice(1),ch,v]);return}
    const g=ks[0][0]==='$',root=g?eval(ks[0].slice(1)):S,k0=g?ks[1]:ks[0],rest=ks.slice(g?2:1);
    if(!undo.some(u=>u[0]===root&&u[1]===k0)){const ow=own(root,k0);undo.push([root,k0,ow,root[k0]]);root[k0]=dc(ow||g?root[k0]:SVB_DEF[k0])}
    if(!rest.length){root[k0]=put(root[k0],ch,v);return}const o=walk(root[k0],rest.slice(0,-1)),kl=rest[rest.length-1];o[kl]=put(o[kl],ch,v)};
  setTimeout(async()=>{let job;try{job=await jobP}catch(e){const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify({err:['job '+e.message]});document.body.append(pre);return}
    const dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
    DET=+(job.det||1);LOD=0;const sid=job.sid,S=eval(job.spec),D=job.D||80,gap=Math.round(D*(job.gap||2.3)),cells=job.cells,cands=job.cands,cl=(typeof CWS!=='undefined'&&CWS[sid])||[],
      cwId=/^\d+$/.test(String(job.cw))?((cl[+job.cw]||{}).id||String(job.cw)):(job.cw||(cl[0]&&cl[0].id)||'bleu'),cwo=cl.find(x=>x.id===cwId)||{id:cwId},
      VIEWS=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0]],
      N=cands.length*cells.length,cols=Math.max(1,Math.min(job.cols||12,N)),rows=Math.ceil(N/cols),W=cols*gap,H=rows*gap,
      svg=E('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`},document.body),hf=(typeof SV_HEAD!=='undefined'&&SV_HEAD[sid])||anemSvg,wf=(GHI[sid]&&GHI[sid].wilt)||svaWiltCol;
    GDEF=E('defs',{},svg);const base={},box=[],err=[];let ms=0;delete S._m;
    for(const p of job.probe||[])try{base[p]=getv(S,p,cwo)}catch(e){base[p]=null;err.push('probe '+p+' '+e.message)}delete S._m;
    const head=(g,c,X,Y)=>{const V=VIEWS[c.view||0],B=basis(V3.nz([V[0],V[1],V[2]]),V[3]),T0=WILT;if(c.wl>0&&typeof lifeWilt==='function')WILT=lifeWilt(c.wl,wf,sid);
      try{hf(g,B,[X,-Y,0],D*(c.Dk||1),cwId,c.op,c.seed||3,c.wl||0)}finally{WILT=T0}};
    const plant=(g,c,X,Y)=>{const k=G(g),sk=c.full?G(k):null,vw=c.vw||[-.45,.15,.88],T0=WILT;SVA_LIFE=c.wl||null;if(c.wl>0)WILT=lifeWilt(c.wl,wf,sid);
      try{renderStatic(()=>{const r=drawRec(k,0,RBY[sid],{vw,ax:c.axv?vw:undefined,op:c.op,cw:cwo,col:cwo.c,roll:0});if(sk&&r&&r.neck)svtStem(sk,r,sid,c.full)})}finally{WILT=T0;SVA_LIFE=null}
      const b=k.getBBox(),s=Math.min(gap*.9/b.width,gap*.9/b.height);k.setAttribute('transform',`translate(${f(X-(b.x+b.width/2)*s)},${f(Y-(b.y+b.height/2)*s)}) scale(${s.toFixed(4)})`)};
    cands.forEach((cd,ci)=>{const undo=[],mo=[];delete S._m;
      try{const vals=Object.assign({},cd);for(const L of job.links||[]){const tv=(L.to in vals)?vals[L.to]:base[L.to],k=L.k==null?base[L.path]/base[L.to]:L.k;vals[L.path]=k*tv+(L.b||0)}
        for(const[p,v]of Object.entries(vals))setv(S,p,v,undo,mo);
        if(mo.length){const m0=S.mat;undo.push([S,'mat',own(S,'mat'),m0]);S.mat=function(x){const m=Object.assign({},m0.call(this,x));for(const[ks,ch,v]of mo){m[ks[0]]=dc(m[ks[0]]);
          if(ks.length===1){m[ks[0]]=put(m[ks[0]],ch,v);continue}const o=walk(m[ks[0]],ks.slice(1,-1)),kl=ks[ks.length-1];o[kl]=put(o[kl],ch,v)}return m}}
        delete S._m;
        cells.forEach((c,j)=>{const i=ci*cells.length+j,cx=i%cols,cy=Math.floor(i/cols),X=gap*(cx+.5),Y=gap*(cy+.5),t0=performance.now();box.push([gap*cx,gap*cy,gap*(cx+1),gap*(cy+1)]);
          try{(c.k==='plant'?plant:head)(G(svg),c,X,Y)}catch(e){err.push(i+' '+e.message)}ms+=performance.now()-t0})}
      catch(e){err.push('cand '+ci+' '+e.message);while(box.length<(ci+1)*cells.length)box.push(null)}
      finally{for(const[r,k,ow,v]of undo.reverse()){if(ow)r[k]=v;else delete r[k]}delete S._m}});
    document.title='fit '+N;const name=Q.getAll('snap').filter(Boolean).pop(),out={n:N,W,H,gap,cw:cwId,box,base,err:err.slice(0,20),ms:Math.round(ms)};
    const fin=r=>{const pre=document.createElement('pre');pre.id='out';out.snap=r;pre.textContent=JSON.stringify(out);document.body.append(pre)};
    if(name)snapSvg(svg,W,name,'#e9e4dc').then(fin,e=>fin('err '+e));else fin(null)},450)}
/* a whole bouquet (chantier grappes): ?bq=1&rc=jacinthe~0:7,jacinthe~4:7&sv=11&v=cylindre-verre-clair&life=3:.3 -> the bouquet drawn, snapped; the
   measures of the hyacinth heads drawn in it (elements and KB per raceme group, count); &fn=muSvPlant (or a list) for another species' plant */
if(new URLSearchParams(location.search).get('bq'))setTimeout(()=>{const Q=new URLSearchParams(location.search),rc=(Q.get('rc')||'jacinthe~0:7,jacinthe~4:7').split(',').map(x=>{const[a,b]=x.split(':');return[a,+b]}),
    lf=Q.get('life'),L=lf?{stage:+lf.split(':')[0],u:+lf.split(':')[1]}:null;document.body.innerHTML='';DET=+(Q.get('det')||1);LOD=0;LIFE=L;
  const svg=E('svg',{width:900,height:1100},document.body);const hs=[];for(const nm of(Q.get('fn')||'hyaSvPlant').split(',')){const o0=window[nm];if(typeof o0==='function')window[nm]=function(k,...a){const r=o0(k,...a);hs.push(k);return r}}
  /* &stat=1: where a raceme's bytes go (path data by floret level and layer, the clusters' blobs, the whole racemes) */
  const ST={};if(Q.get('stat')&&typeof GR_FLORET!=='undefined'){for(const nm of Object.keys(GR_FLORET)){const f0=GR_FLORET[nm],gp=f0.grp;
      GR_FLORET[nm]=function(c,f,lod){const p0=c.put;ST['n'+lod]=(ST['n'+lod]||0)+1;c.put=p=>{const kk='l'+lod+'y'+(p.ly??'');ST[kk]=(ST[kk]||0)+(p.d||'').length;return p0(p)};try{return f0(c,f,lod)}finally{c.put=p0}};
      if(gp)GR_FLORET[nm].grp=function(c,cl){const p0=c.put;c.put=p=>{ST.grp=(ST.grp||0)+(p.d||'').length;return p0(p)};try{return gp(c,cl)}finally{c.put=p0}}}
    const g0=window.grDraw;window.grDraw=function(...a){const k=g0(...a);ST.pan=(ST.pan||0)+new XMLSerializer().serializeToString(k).length;ST.panEl=(ST.panEl||0)+k.querySelectorAll('*').length;ST.np=(ST.np||0)+1;return k}}
  if(Q.get('dbg'))window.SVDBG=[];
  /* &mdl=<i>: the model bouquet MODELS[i] (its vase and background), as the site's model cards draw it */
  const MD=Q.get('mdl')!=null&&typeof MODELS!=='undefined'?MODELS[+Q.get('mdl')]:null;
  renderStatic(()=>{if(MD)buildBq(svg,[],+(Q.get('sv')||7),MD.vase,0,null,MD);else buildBq(svg,[],+(Q.get('sv')||11),Q.get('v')||'cylindre-verre-clair',0,'juste',null,rc)});
  const XS=new XMLSerializer(),m=hs.map(k=>[k.querySelectorAll('*').length,Math.round(XS.serializeToString(k).length/1024*10)/10]);
  const o={dbg:window.SVDBG||undefined,st:Q.get('stat')?ST:undefined,n:hs.length,heads:m.map(x=>x.join('el/')+'KB').join(' '),el:svg.querySelectorAll('*').length,kb:Math.round(XS.serializeToString(svg).length/1024)};
  const sp=Q.get('snap')?snapSvg(svg,+(Q.get('sw')||900),Q.get('snap'),Q.get('bg')||(MD&&MD.bg)||'#e9e4dc'):null;const fin=r=>{const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(Object.assign(o,r?{snap:r.join('x')}:{}));document.body.append(pre)};
  if(sp)sp.then(fin,e=>fin(['err '+e]));else fin()},400);
/* the junctions of a woody branch (porteur 2026-10-09: no gap between a flower and its calyx, the calyx and its pedicel, the pedicel and its spur):
   ?plant=1&...&jn=1 → each flower svBranch draws goes in its own group; after the sheet's measures come "JN" (one row per flower: cell, x, y in snap
   pixels, R0 in snap pixels, az the z of its axis (1 face on, 0 profile, -1 from behind), op, wl, lod, its drawn width and height / D) and "SE" (the
   spurs' ends: cell, x, y) and "BR" (per cell: the branch's box in cm, fD in cm); python fleur/img.py jn <png> <json> crops one flower per stage and view */
if(new URLSearchParams(location.search).get('jn')&&typeof svBranch==='function'){const J=[],SE=[],BR=[],o0=svBranch,p0=svbPeds;
  const PM={},kO=b=>b[0].toFixed(2)+','+b[1].toFixed(2);
  svbPeds=function(par,se,cp,peds,...a){SE.push(E('circle',{cx:se[0],cy:-se[1],r:.01,fill:'none'},par));const n0=par.childNodes.length,r=p0(par,se,cp,peds,...a),el=par.childNodes[n0];
    if(el&&!(S0=>S0&&S0.infl&&S0.infl.join)(a[0]))for(const q of peds)PM[kO(q[1])]=el;return r};
  if(typeof svbPedJ==='function'){const pj0=svbPedJ;svbPedJ=function(par,items,...a){const n0=par.childNodes.length,r=pj0(par,items,...a),el=par.childNodes[n0];if(el)for(const q of items)PM[kO(q[3])]=el;return r}}
  svBranch=function(par,S,o){if(!S._jn){const f=S.flower;S.flower=(pp,B,O,D,cw,op,sd,wl,lod)=>{const g=E('g',{},pp),m=E('circle',{cx:O[0],cy:-O[1],r:D/2,fill:'none'},pp);
      const Bn=S.axis?S.axis(B,cw,op,wl):B,j=S.infl&&S.infl.join,F=j?V3.add(O,V3.sc(Bn[2],-j*D)):O;J.push({g,m,D,O,F,az:Bn[2][2],op,wl,lod});return f(g,B,O,D,cw,op,sd,wl,lod)};S._jn=1}const r=o0(par,S,o);BR.push({k:r,fD:S.fD});return r};
  const f0=window.svtOut;window.svtOut=function(svg,...a){const r=f0.call(this,svg,...a),Q=new URLSearchParams(location.search),vb=svg.viewBox.baseVal,cw=+(Q.get('cell')||170),
      sk=+(Q.get('sw')||vb.width*2)/vb.width,R=svg.getBoundingClientRect(),P=e=>{const b=e.getBoundingClientRect();return[(b.x+b.width/2-R.x)*sk,(b.y+b.height/2-R.y)*sk,b.width/2*sk]},
      f2=x=>Math.round(x*100)/100,U=typeof UPC!=='undefined'?UPC:6.5;
    /* gap: how far (mm) from the pedicel's end (the flower's foot) the flower's own paint begins (0: the foot is inside the flower's fill or outline) */
    const cov=(g,x,y)=>{const pt={x,y};for(const e of g.querySelectorAll('path,ellipse,circle,polygon')){if(e.closest('[transform]')&&e.closest('[transform]')!==g&&g.contains(e.closest('[transform]')))continue;
        if(e.getAttribute('fill')!=='none'&&e.isPointInFill(pt))return 1;const st=e.getAttribute('stroke');if(st&&st!=='none'&&e.isPointInStroke(pt))return 1}return 0},
      gap=q=>{const x=q.F[0],y=-q.F[1],R=q.D/2;if(cov(q.g,x,y))return 0;for(const d of[.02,.04,.07,.1,.15,.2,.3,.45,.7])for(let a=0;a<24;a++)if(cov(q.g,x+Math.cos(a/24*6.283)*d*R,y+Math.sin(a/24*6.283)*d*R))return f2(d*R/U*10);return 99};
    /* order: 1 the pedicel is painted over a flower that faces us (it crosses the corolla to its centre), 2 under a flower seen from behind (hidden
       by the petals up to the calyx: the calyx floats on the corolla), 0 right */
    const ordr=q=>{const el=PM[kO(q.O)];if(!el)return-1;const after=!!(q.g.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING);return q.az>.15&&after?1:q.az<-.15&&!after?2:0};
    const jn=J.map(q=>{const[x,y,rr]=P(q.m),bb=q.g.getBBox();return[Math.floor(x/sk/cw),Math.round(x),Math.round(y),Math.round(rr),f2(q.az),f2(q.op),f2(q.wl||0),q.lod,f2(bb.width/q.D),f2(bb.height/q.D),gap(q),ordr(q)]}),
      se=SE.map(m=>{const[x,y]=P(m);return[Math.floor(x/sk/cw),Math.round(x),Math.round(y)]}),br=BR.map(q=>{const b=q.k.getBBox();return[f2(b.width/U),f2(b.height/U),f2(q.fD/U)]});
    const add=()=>{const p=document.getElementById('out');if(!p)return setTimeout(add,50);p.textContent+=' JN '+JSON.stringify(jn)+' SE '+JSON.stringify(se)+' BR '+JSON.stringify(br)};add();return r}}
