/* ---------- the 3D structure check (2026-10-18, owner: « aucun clipping ni overlapping : une règle très, très sévère qui mesure que les
   calques SVG sont parfaitement structurés »). Test only (&qa3d=1), read by svDraw on every head of every sort: the sheets of a head (petals,
   tepals, sepals, bracts, every piece drawn by svSheet, and since 2026-10-19 the drawn pieces of a heart by their proxy sheets, wh 'h') must never pass through one another. For each pair
   of sheets A, B, A's grid is sampled (13 x 25, past the shared base v < .1 where the pieces meet on the receptacle); each sample's signed
   distance to B along B's normal at B's nearest sample; an edge of A's grid whose two ends lie on the two sides of B while both are near B
   (closer than 1.5 times B's sample spacing) is a crossing. SVQA keeps, over the sheet: heads, crossings, the pairs that cross and the worst
   one (its pieces, the share of A's edges that cross). 0 is the only good value. A sheet marked qa:false (a hidden floor disc) is skipped. */
const SVQA_ON=typeof location!=='undefined'&&/[?&]qa3d=[12]/.test(location.search||'');
const SVQA_DBG=typeof location!=='undefined'&&/[?&]qa3d=2/.test(location.search||'');
const SVQA={heads:0,cross:0,pairs:0,worst:null,where:null};  /* where (test only): crossing edges by A's height (5 bands of v) x A's |u| (3 bands), and by whorl pair */
function svQa3d(pieces,par){const S=pieces.map(p=>p.fn?(p.proxy&&p.proxy.S&&p.qa!==false&&!p.tube?Object.assign({},p.proxy,{wh:'h'}):null):p).filter(p=>p&&p.S&&p.qa!==false);  /* the drawn pieces too, by their proxy sheets; a tube is checked as a tube (below) */  /* the drawn pieces too (a filament, the style), by their proxy sheets */if(S.length<2){SVQA.heads++;return}
  const NU=12,NV=24,W=NU+1,v0=.1;
  const G=S.map(sh=>{const P=[],w0=sh.wh==='h'?.3:v0;for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const u=-1+2*i/NU,v=w0+(1-w0)*j/NV;P.push(sh.S(u,v))}  /* a drawn piece of the heart: past its insertion (the first 30 %, as for the tubes) */
    const N=[];for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const a=P[j*W+Math.min(NU,i+1)],b=P[j*W+Math.max(0,i-1)],c=P[Math.min(NV,j+1)*W+i],d=P[Math.max(0,j-1)*W+i];
      N.push(V3.nz(V3.cr(V3s(c,d),V3s(a,b))))}
    let sp=0,ns=0;for(let j=0;j<=NV;j++)for(let i=0;i<NU;i++){sp+=V3l(V3s(P[j*W+i+1],P[j*W+i]));ns++}
    for(let j=0;j<NV;j++)for(let i=0;i<=NU;i++){sp+=V3l(V3s(P[(j+1)*W+i],P[j*W+i]));ns++}
    return{P,N,h:sp/ns}});
  let cross=0,pairs=0;const mk=[];
  for(let a=0;a<G.length;a++)for(let b=0;b<G.length;b++){if(a===b||S[a].wh==='h'&&S[b].wh==='h')continue;const A=G[a],Bg=G[b],near=1.5*Bg.h;  /* two drawn pieces: checked as tubes, below */
    /* each A sample: its signed distance to B and whether it is near B at all */
    const sd=A.P.map((p,ak)=>{let bd=1e18,bk=0;for(let k=0;k<Bg.P.length;k++){const q=Bg.P[k],dx=p[0]-q[0],dy=p[1]-q[1],dz=p[2]-q[2],d2=dx*dx+dy*dy+dz*dz;if(d2<bd){bd=d2;bk=k}}
      const q=Bg.P[bk],n=Bg.N[bk],bi=bk%W,bj=Math.floor(bk/W),inside=bi>0&&bi<NU&&bj>0&&bj<NV;  /* past B's border the side flips without any crossing */
      return[(p[0]-q[0])*n[0]+(p[1]-q[1])*n[1]+(p[2]-q[2])*n[2],inside&&Math.sqrt(bd)<near,bk]});
    let c=0,tot=0;const edge=(x,y)=>{tot++;const s=sd[x],t=sd[y];if(s[1]&&t[1]&&s[0]*t[0]<0&&Math.max(Math.abs(s[0]),Math.abs(t[0]))>Bg.h*.05){c++;
      const W2=SVQA.where||(SVQA.where={v:[0,0,0,0,0],u:[0,0,0],pair:{}}),j=Math.floor(x/W),i=x%W,vv=v0+(1-v0)*j/NV,uu=Math.abs(-1+2*i/NU),pk=(S[a].wh??'?')+'-'+(S[b].wh??'?');
      W2.v[Math.min(4,Math.floor(vv*5))]+=.5;W2.u[Math.min(2,Math.floor(uu*3))]+=.5;W2.pair[pk]=(W2.pair[pk]||0)+.5;
      if(SVQA_DBG&&par){const pa=A.P[x],pb=A.P[y],m=PJ(S[a].B,S[a].O,[(pa[0]+pb[0])/2,(pa[1]+pb[1])/2,(pa[2]+pb[2])/2]);mk.push(m)}
      if(SVQA_DBG&&(W2.dbg||(W2.dbg=[])).length<40)W2.dbg.push([a,b,i,j,t===sd[y]?(y%W):0,Math.floor(y/W),s[2]%W,Math.floor(s[2]/W),+(s[0]/Bg.h).toFixed(2),+(t[0]/Bg.h).toFixed(2),+(A.N[x][0]*Bg.N[s[2]][0]+A.N[x][1]*Bg.N[s[2]][1]+A.N[x][2]*Bg.N[s[2]][2]).toFixed(2)])}};
    for(let j=0;j<=NV;j++)for(let i=0;i<NU;i++)edge(j*W+i,j*W+i+1);
    for(let j=0;j<NV;j++)for(let i=0;i<=NU;i++)edge(j*W+i,(j+1)*W+i);
    if(c){cross+=c;pairs++;const sh=c/tot;if(!SVQA.worst||sh>SVQA.worst.share)SVQA.worst={a,b,share:+sh.toFixed(3),edges:c}}}
  /* &qa3d=2: each crossing marked on the drawing, a red dot over everything (the group is appended after svDraw's own) */
  if(SVQA_DBG&&par&&mk.length){const ns='http://www.w3.org/2000/svg',gm=document.createElementNS(ns,'g');for(const m of mk){const c=document.createElementNS(ns,'circle');
    c.setAttribute('cx',m[0].toFixed(1));c.setAttribute('cy',m[1].toFixed(1));c.setAttribute('r','1.6');c.setAttribute('fill','#ff0030');gm.appendChild(c)}par.appendChild(gm)}
  /* the drawn pieces that are tubes (a filament, the style: p.tube {P, r0, r1}): two of them pass through each other where their axes come nearer
     than the sum of their radii, past the shared insertion round the ovary (the first ins of each one's length, 30 %: the filaments and the style rise together from the receptacle, as the tepals' feet do below v .1); each such pair of segments counts */
  const TB=pieces.filter(p=>p.fn&&p.tube&&p.qa!==false).map(p=>p.tube);
  for(let a=0;a<TB.length;a++)for(let b=a+1;b<TB.length;b++){const A=TB[a],B2=TB[b];let c=0;
    const seg=(T,k)=>[T.P[k],T.P[k+1],T.r0+(T.r1-T.r0)*(k+.5)/(T.P.length-1)];
    for(let i=0;i<A.P.length-1;i++){if(i/(A.P.length-1)<(A.ins??.3))continue;const[a0,a1,ra]=seg(A,i);
      for(let j=0;j<B2.P.length-1;j++){if(j/(B2.P.length-1)<(B2.ins??.3))continue;const[b0,b1,rb]=seg(B2,j);
        /* the nearest points of two segments (clamped) */
        const u=V3s(a1,a0),v=V3s(b1,b0),w=V3s(a0,b0),aa=V3.dot(u,u),bb=V3.dot(u,v),cc=V3.dot(v,v),dd=V3.dot(u,w),ee=V3.dot(v,w),den=aa*cc-bb*bb;
        let s1=den>1e-12?Math.max(0,Math.min(1,(bb*ee-cc*dd)/den)):0,t1=cc>1e-12?Math.max(0,Math.min(1,(bb*s1+ee)/cc)):0;s1=aa>1e-12?Math.max(0,Math.min(1,(bb*t1-dd)/aa)):0;
        const d=V3l(V3s(V3.add(a0,V3.sc(u,s1)),V3.add(b0,V3.sc(v,t1))));if(d<ra+rb)c++}}
    if(c){cross+=2*c;pairs+=2;(SVQA.where||(SVQA.where={v:[0,0,0,0,0],u:[0,0,0],pair:{}})).pair['tubes']=(SVQA.where.pair['tubes']||0)+c}}
  /* a tube against the sheets: its axis, past its insertion, must neither pass through a sheet (two axis points near it on its two sides) nor come
     nearer it than its radius (its distance to the tangent plane of the sheet's nearest inner sample, that sample within 1.5 sample spacings) */
  for(const T of TB){const nT=T.P.length-1;let c=0;
    for(let x=0;x<G.length;x++){const Bg=G[x],sd=T.P.map((p,k)=>{if(k<Math.ceil(nT*(T.ins??.3)))return null;let bd=1e18,bk=0;
        for(let k2=0;k2<Bg.P.length;k2++){const q=Bg.P[k2],dx=p[0]-q[0],dy=p[1]-q[1],dz=p[2]-q[2],d2=dx*dx+dy*dy+dz*dz;if(d2<bd){bd=d2;bk=k2}}
        const bi=bk%W,bj=Math.floor(bk/W);if(!(bi>0&&bi<NU&&bj>0&&bj<NV)||Math.sqrt(bd)>1.5*Bg.h)return null;const q=Bg.P[bk],n=Bg.N[bk];return(p[0]-q[0])*n[0]+(p[1]-q[1])*n[1]+(p[2]-q[2])*n[2]});
      for(let k=0;k<=nT;k++){const s1=sd[k];if(s1==null)continue;const r=T.r0+(T.r1-T.r0)*k/nT;if(Math.abs(s1)<r*.9)c++;else if(k<nT&&sd[k+1]!=null&&s1*sd[k+1]<0)c++}}
    if(c){cross+=2*c;pairs+=2;(SVQA.where||(SVQA.where={v:[0,0,0,0,0],u:[0,0,0],pair:{}})).pair['tube-nappe']=(SVQA.where.pair['tube-nappe']||0)+c}}
  SVQA.heads++;SVQA.cross+=cross/2;SVQA.pairs+=pairs/2}
