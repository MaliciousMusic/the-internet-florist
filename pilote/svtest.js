window.snapSvg=async function(svg,W,name,bg){const XS=new XMLSerializer(),vb=svg.getAttribute('viewBox').trim().split(/\s+/).map(Number),H=Math.round(W*vb[3]/vb[2]);
  const find=id=>svg.querySelector('#'+CSS.escape(id))||document.getElementById(id);let out='';const seen=new Set();
  const add=x=>{for(const m of x.matchAll(/url\(#([^)"'\s]+)\)|href="#([^"]+)"/g)){const id=m[1]||m[2];if(seen.has(id))continue;seen.add(id);const el=find(id);if(el){const s=XS.serializeToString(el);out+=s;add(s)}}};
  const body=[...svg.children].filter(n=>n.tagName!=='defs').map(n=>XS.serializeToString(n)).join('');add(body);
  const src=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="${vb.join(' ')}"><defs>${out}</defs>${body}</svg>`;
  const img=new Image(),url=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));img.src=url;await img.decode();URL.revokeObjectURL(url);
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');if(bg){cx.fillStyle=bg;cx.fillRect(0,0,W,H)}
  cx.drawImage(img,0,0,W,H);const d=cv.toDataURL('image/png');const r=await fetch('http://127.0.0.1:8781/save?name='+name,{method:'POST',body:d});return[r.status,W,H]};

/* the measures of a sheet, for a headless run (fleur/shot.sh): heads, elements and KB per head, patches per head, ms per head */
window.svtOut=(svg,n,ms,snapP)=>{const el=svg.querySelectorAll('*').length,pat=[...svg.querySelectorAll('use')].filter(u=>(u.getAttribute('clip-path')||'').includes('#sq')).length,
    kb=new XMLSerializer().serializeToString(svg).length/1024,o={n,el:Math.round(el/n),kb:Math.round(kb/n),patch:+(pat/n).toFixed(1)};
  const fin=r=>{const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(Object.assign(o,r?{snap:r.join('x')}:{}));document.body.append(pre)};
  if(snapP)snapP.then(fin,e=>fin(['err '+e]));else fin()};
/* SVG pilot sheet: heads at several views and seeds. URL: cw, op, D, seeds, views (indices), cols, det, bg, sp (species) */
if(!new URLSearchParams(location.search).get('cmp')&&!new URLSearchParams(location.search).get('grid')&&!new URLSearchParams(location.search).get('plant'))setTimeout(()=>{const Q=new URLSearchParams(location.search),dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
  document.body.style.cssText='margin:0;background:'+(Q.get('bg')||'#e9e4dc');DET=+(Q.get('det')||1.5);LOD=0;
  const cw=Q.get('cw')||'bleu',op=+(Q.get('op')||1),D=+(Q.get('D')||240),seeds=(Q.get('seeds')||'1,2,3,4').split(',').map(Number),cols=+(Q.get('cols')||seeds.length),
    VIEWS=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0]],vi=(Q.get('views')||'0,1,2,3').split(',').map(Number),
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
    VIEWS=[[0,0,1,0],[0,.5,.87,0],[.38,.55,.74,.4],[0,.86,.5,0],[-.55,.25,.8,-.3],[0,-.42,.91,0],[.7,.1,.7,.2],[0,.97,.24,0],[.97,-.17,.17,0],[-.62,-.26,.74,0]],VL=(Q.get('view')||'2').split(',').map(x=>VIEWS[+x]),rws=[];for(const cw of cws)for(const V of VL)rws.push([cw,V]);const gap=D*1.15,W=Math.round(st.length*gap+D*.3),H=Math.round(rws.length*gap+D*.2),
    svg=E('svg',{width:W,height:H,viewBox:`0 0 ${W} ${H}`},document.body);GDEF=E('defs',{},svg);let ms=0,n=0;
  rws.forEach(([cw,V],r)=>st.forEach(([op,wl],c)=>{const B=basis(V3.nz([V[0],V[1],V[2]]),V[3]),X=D*.2+gap*(c+.5),Y=D*.1+gap*(r+.55),t0=performance.now(),seed=+(Q.get('seed')||3)+r*7+c;
    const sid=Q.get('sid')||'anemone-coronaria',spec=/^SVT_[A-Z]+$/.test(Q.get('spec')||'')?eval(Q.get('spec')):null,hf=spec?(p,B2,O2,D2,c2,o2,s2,w2)=>tulSvg(p,B2,O2,D2,c2,o2,s2,w2,spec):(typeof SV_HEAD!=='undefined'&&SV_HEAD[sid])||anemSvg,T0=WILT;if(wl>0&&typeof lifeWilt==='function')WILT=lifeWilt(wl,(GHI[sid]&&GHI[sid].wilt)||svaWiltCol,sid);try{hf(G(svg),B,[X,-Y,0],D,cw,op,seed,wl)}finally{WILT=T0}ms+=performance.now()-t0;n++}));
  document.title='grid '+n+' '+Math.round(ms/n)+'ms';const sp=Q.get('snap')?snapSvg(svg,+(Q.get('sw')||W),Q.get('snap'),'#e9e4dc'):null;if(sp)sp.then(r=>{document.title+=' snap '+r.join(',')});svtOut(svg,n,ms,sp)},400);
/* whole stems: ?plant=1&cw=bleu&st=.1:0,.3:0,.6:0,1:0,1:.4,1:.75&vw=-.45,.15,.88 → drawRec of the species, one cell per stage, fitted */
if(new URLSearchParams(location.search).get('plant'))setTimeout(()=>{const Q=new URLSearchParams(location.search),dS=typeof defs!=='undefined'&&defs.closest?defs.closest('svg'):null;document.body.innerHTML='';if(dS)document.body.append(dS);
  DET=+(Q.get('det')||1.5);LOD=0;const sid=Q.get('sid')||'anemone-coronaria',rec=RBY[sid],cw=(CWS[sid]||[]).find(x=>x.id===(Q.get('cw')||'bleu')),st=(Q.get('st')||'.1:0,.3:0,.6:0,1:0,1:.4,1:.75').split(',').map(x=>x.split(':').map(Number)),
    vw=(Q.get('vw')||'-.45,.15,.88').split(',').map(Number),cellW=+(Q.get('cell')||170),svg=E('svg',{width:cellW*st.length,height:cellW*2.2,viewBox:`0 0 ${cellW*st.length} ${cellW*2.2}`},document.body);GDEF=E('defs',{},svg);
  /* full=<cm>: the whole cut stem below the head's neck, with the leaves its species carries in a bouquet (STEML, stemLeaves), as in the vase */
  const full=+(Q.get('full')||0),own=(GHI[sid]&&GHI[sid].wilt)||svaWiltCol;let ms=0;
  st.forEach(([op,wl],i)=>{const g=G(svg),k=G(g),sk=full?G(k):null;SVA_LIFE=wl||null;const T0=WILT;if(wl>0)WILT=lifeWilt(wl,own,sid);const t0=performance.now();
    try{renderStatic(()=>{const r=drawRec(k,0,rec,{vw,ax:Q.get('axv')?vw:undefined,op,cw,col:cw&&cw.c,roll:0});if(sk&&r&&r.neck)svtStem(sk,r,sid,full)})}finally{WILT=T0;SVA_LIFE=null}ms+=performance.now()-t0;
    const b=k.getBBox(),s=Math.min(cellW*.9/b.width,cellW*2.1/b.height);k.setAttribute('transform',`translate(${f(cellW*(i+.5)-(b.x+b.width/2)*s)},${f(cellW*1.1-(b.y+b.height/2)*s)}) scale(${s.toFixed(4)})`)});
  document.title='plant ok';const sp=Q.get('snap')?snapSvg(svg,+(Q.get('sw')||cellW*st.length*2),Q.get('snap'),'#e9e4dc'):null;if(sp)sp.then(r=>{document.title+=' snap '+r.join(',')});svtOut(svg,st.length,ms,sp)},400);
/* the stem below a head's neck (r: what the head hands back), cm long, with its leaves */
window.svtStem=(par,r,sid,cm)=>{const e=r.neck,nd=r.nd||[0,1],L=cm*UPC,P3=e,P2=[e[0]+nd[0]*L*.3,e[1]+nd[1]*L*.3],P0=[e[0]+nd[0]*L*.3,e[1]+L],P1=[P0[0],P0[1]-L*.35],P=[P0,P1,P2,P3],C=[],W=[],w=(r.nw||3)*1.12;
  for(let i=0;i<=24;i++){C.push(bz(P,i/24));W.push(w*(1.08-.08*i/24))}
  /* GHI[sid].basal(par,P,L,w,side): the whole plant's leaves from the foot of the stem (sheets only), behind (-1) then in front (1) of it */
  const bl=GHI[sid]&&GHI[sid].basal;if(bl)bl(par,P,L,W[0],-1);if(GHI[sid]&&GHI[sid].cut&&typeof svStemCut==='function')svStemCut(par,C,W,r.ncols||SG,(g2,C2,W2)=>stemPoly(g2,C2,W2,r.ncols||SG));else stemPoly(par,C,W,r.ncols||SG);if(STEML[sid])stemLeaves(par,P,sid,P0[1]+L,L*.3,0);if(bl)bl(par,P,L,W[0],1)};
/* the bouquet's chance, old drawing against the new: ?rtest=1&rc=tulipe-simple~7:7,tulipe-simple~12:6 → for each life stage and vessel, the bouquet's
   seed once it is drawn, with the SVG heads off and on (the same: the composition does not move) */
if(new URLSearchParams(location.search).get('rtest'))setTimeout(()=>{const Q=new URLSearchParams(location.search),rc=(Q.get('rc')||'tulipe-simple~7:7,tulipe-simple~12:6').split(',').map(x=>{const[a,b]=x.split(':');return[a,+b]}),out=[];
  for(const L of[null,{stage:0,u:.5},{stage:2,u:.5},{stage:3,u:.3},{stage:3,u:1}])for(const v of['cylindre-verre-clair','coupe-pied-blanche']){const res=[];
    for(const on of[false,true]){SV_ON=on;LIFE=L;const svg=E('svg',{},document.body);let s1;const r0=rnd;let hh=0,nn=0;rnd=function(){const x=r0();nn++;hh=(Math.imul(hh,31)+Math.floor(x*1e9))|0;return x};try{renderStatic(()=>{buildBq(svg,[],+(Q.get('sv')||11),v,0,'juste',null,rc)});s1=nn+':'+hh+'/'+svg.querySelectorAll('*').length}catch(e){s1='ERR '+e.message}finally{rnd=r0}svg.remove();res.push(s1)}
    out.push((L?L.stage+':'+L.u:'-')+' '+v+' '+(res[0].split('/')[0]===res[1].split('/')[0]?'IDENTIQUE':'DIFFERENT')+' '+res.join(' / '))}
  SV_ON=true;LIFE=null;const pre=document.createElement('pre');pre.id='out';pre.textContent=out.join(' | ');document.body.append(pre)},400);
/* which pieces patch each other: ?grid=1&...&dbgp=1 → the pairs of pieces (index in the head: tepals first, then the heart's pieces; o outer, i inner)
   counted over the sheet, with the cells where each is in front (only the pairs svDraw patches) */
if(new URLSearchParams(location.search).get('dbgp')){const PC={},oDraw=svDraw,oOrd=svOrder;let cur=null;
  svDraw=function(par,pieces,o){pieces.forEach((p,i)=>{p._i=i;if(p.proxy)p.proxy._i=i});cur=pieces.length;return oDraw(par,pieces,o)};
  svOrder=function(items,eps){const out=oOrd(items,eps);for(const[A,B2,fa,fb]of out.fr){const a=A.oi,b=B2.oi;const[e,l,c]=a<b?[A,B2,fa]:[B2,A,fb];if(c<3)continue;
      const ia=(A.sh||A.px||{})._i,ib=(B2.sh||B2.px||{})._i,nm=i=>i==null?'?':i<3?'o'+i:i<6?'i'+i:'h'+i,k=[nm(ia),nm(ib)].sort().join('-');PC[k]=(PC[k]||0)+1}return out};
  window.svtOut0=window.svtOut;window.svtOut=(svg,n,ms,sp)=>{const pre=document.createElement('pre');pre.id='out';const L=Object.entries(PC).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+v);pre.textContent=L.join(' ');document.body.append(pre)}}
