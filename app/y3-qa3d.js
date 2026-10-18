/* ---------- the 3D structure check (2026-10-18, owner: « aucun clipping ni overlapping : une règle très, très sévère qui mesure que les
   calques SVG sont parfaitement structurés »). Test only (&qa3d=1), read by svDraw on every head of every sort: the sheets of a head (petals,
   tepals, sepals, bracts, every piece drawn by svSheet; not the drawn strokes of a heart) must never pass through one another. For each pair
   of sheets A, B, A's grid is sampled (13 x 25, past the shared base v < .1 where the pieces meet on the receptacle); each sample's signed
   distance to B along B's normal at B's nearest sample; an edge of A's grid whose two ends lie on the two sides of B while both are near B
   (closer than 1.5 times B's sample spacing) is a crossing. SVQA keeps, over the sheet: heads, crossings, the pairs that cross and the worst
   one (its pieces, the share of A's edges that cross). 0 is the only good value. A sheet marked qa:false (a hidden floor disc) is skipped. */
const SVQA_ON=typeof location!=='undefined'&&/[?&]qa3d=1/.test(location.search||'');
const SVQA={heads:0,cross:0,pairs:0,worst:null};
function svQa3d(pieces){const S=pieces.filter(p=>!p.fn&&p.S&&p.qa!==false);if(S.length<2){SVQA.heads++;return}
  const NU=12,NV=24,W=NU+1,v0=.1;
  const G=S.map(sh=>{const P=[];for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const u=-1+2*i/NU,v=v0+(1-v0)*j/NV;P.push(sh.S(u,v))}
    const N=[];for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const a=P[j*W+Math.min(NU,i+1)],b=P[j*W+Math.max(0,i-1)],c=P[Math.min(NV,j+1)*W+i],d=P[Math.max(0,j-1)*W+i];
      N.push(V3.nz(V3.cr(V3s(c,d),V3s(a,b))))}
    let sp=0,ns=0;for(let j=0;j<=NV;j++)for(let i=0;i<NU;i++){sp+=V3l(V3s(P[j*W+i+1],P[j*W+i]));ns++}
    for(let j=0;j<NV;j++)for(let i=0;i<=NU;i++){sp+=V3l(V3s(P[(j+1)*W+i],P[j*W+i]));ns++}
    return{P,N,h:sp/ns}});
  let cross=0,pairs=0;
  for(let a=0;a<G.length;a++)for(let b=0;b<G.length;b++){if(a===b)continue;const A=G[a],Bg=G[b],near=1.5*Bg.h;
    /* each A sample: its signed distance to B and whether it is near B at all */
    const sd=A.P.map(p=>{let bd=1e18,bk=0;for(let k=0;k<Bg.P.length;k++){const q=Bg.P[k],dx=p[0]-q[0],dy=p[1]-q[1],dz=p[2]-q[2],d2=dx*dx+dy*dy+dz*dz;if(d2<bd){bd=d2;bk=k}}
      const q=Bg.P[bk],n=Bg.N[bk],bi=bk%W,bj=Math.floor(bk/W),inside=bi>0&&bi<NU&&bj>0&&bj<NV;  /* past B's border the side flips without any crossing */
      return[(p[0]-q[0])*n[0]+(p[1]-q[1])*n[1]+(p[2]-q[2])*n[2],inside&&Math.sqrt(bd)<near]});
    let c=0,tot=0;const edge=(x,y)=>{tot++;const s=sd[x],t=sd[y];if(s[1]&&t[1]&&s[0]*t[0]<0&&Math.max(Math.abs(s[0]),Math.abs(t[0]))>Bg.h*.05)c++};
    for(let j=0;j<=NV;j++)for(let i=0;i<NU;i++)edge(j*W+i,j*W+i+1);
    for(let j=0;j<NV;j++)for(let i=0;i<=NU;i++)edge(j*W+i,(j+1)*W+i);
    if(c){cross+=c;pairs++;const sh=c/tot;if(!SVQA.worst||sh>SVQA.worst.share)SVQA.worst={a,b,share:+sh.toFixed(3),edges:c}}}
  SVQA.heads++;SVQA.cross+=cross/2;SVQA.pairs+=pairs/2}
