/* ================= Serre, lot 40 — textures sèches et graminées, poussées par le L-système : herbe de la pampa, massette, bruyère, ozothamnus, ricin en capsules ================= */
/* ---------- shared: a line's L-system in its own upright frame (lnAxis of lot 18), its points laid along the axis (in a bouquet hugging the spine, never sinking under it) ---------- */
function l40Lay(A,bq,L,Rm,fd){const vw=new Map();return q=>{let v=vw.get(q);if(!v){const p=bq?lnHug(q.slice(),L,Rm):q;v=bq?lnSink(A,p,A.W(p),L,fd):A.W(p);vw.set(q,v)}return v}}
/* a soft veil round a screen polyline (a plume's branch): its half-width hw(v) along it, a shaded veil on the side away from the light; a silky thread down its middle;
   on the sheets the hairs themselves, combed toward its tip. One part per veil, at its own depth */
function l40Veil(P0,o,parts){const[P]=lnSub(P0),n=P.length;if(n<2)return;const S=P.map(p=>[p[0],-p[1]]),Lf=[],Rt=[],Sh=[],Sr=[],N=[];let z=0,pn=[1,0],tg=[0,-1];
  for(let i=0;i<n;i++){z+=P[i][2];const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);if(l>1e-6){pn=[-dy/l,dx/l];tg=[dx/l,dy/l]}N.push([pn,tg]);
    const w=o.hw(i/(n-1)),lit=Math.max(-1,Math.min(1,-(pn[0]+pn[1])*1.4)),c=-lit*w*.4;
    Lf.push([S[i][0]+pn[0]*w,S[i][1]+pn[1]*w]);Rt.push([S[i][0]-pn[0]*w,S[i][1]-pn[1]*w]);Sh.push([S[i][0]+pn[0]*(c+w*.55),S[i][1]+pn[1]*(c+w*.55)]);Sr.push([S[i][0]+pn[0]*(c-w*.55),S[i][1]+pn[1]*(c-w*.55)])}
  const Hl=o.halo?S.map((p,i)=>[p[0]+N[i][0][0]*o.hw(i/(n-1))*o.halo,p[1]+N[i][0][1]*o.hw(i/(n-1))*o.halo]).concat(S.map((p,i)=>[p[0]-N[i][0][0]*o.hw(i/(n-1))*o.halo,p[1]-N[i][0][1]*o.hw(i/(n-1))*o.halo]).reverse()):null;
  parts.push({z:z/n+(o.zb||0),fn:par=>{if(Hl&&!LOD)E('path',{d:smooth(Hl),fill:o.body,opacity:o.hop??.28},par);E('path',{d:smooth(Lf.concat(Rt.reverse())),fill:o.body,opacity:o.op??.7},par);if(!LOD&&o.shade)E('path',{d:smooth(Sh.concat(Sr.reverse())),fill:o.shade,opacity:o.so??.32},par);
    if(o.thread)E('path',{d:pD(S),fill:'none',stroke:o.thread,'stroke-width':o.tw||.45,'stroke-opacity':.8,'stroke-linecap':'round'},par);
    if(!LOD&&DET>=1.5&&o.barb){let d='';for(let i=1;i<n;i++){const[nn,tt]=N[i],w=o.hw(i/(n-1))*(o.halo||1);if(w<.6)continue;for(const s of[-1,1])for(const[k,a]of[[1.12,.5],[.92,.72],[.7,.88]]){const ux=nn[0]*s*Math.sqrt(1-a*a*.6)+tt[0]*a*.8,uy=nn[1]*s*Math.sqrt(1-a*a*.6)+tt[1]*a*.8,b0=w*.35;d+=`M${f(S[i][0]+nn[0]*s*b0)},${f(S[i][1]+nn[1]*s*b0)}l${f(ux*w*k*.75)},${f(uy*w*k*.75)}`}}
      if(d)E('path',{d,fill:'none',stroke:o.barb,'stroke-width':.24,'stroke-opacity':.55,'stroke-linecap':'round'},par)}}})}
/* a tapered needle or a soft spine as a filled sliver from its base b (screen) toward its tip t, w its width at the base (never under 1.1: it stays joined to what carries it) */
function l40Sliver(b,t,w){const dx=t[0]-b[0],dy=t[1]-b[1],l=Math.hypot(dx,dy)||1,h=Math.max(1.1,w)/2,nx=-dy/l*h,ny=dx/l*h,m=[b[0]+dx*.4,b[1]+dy*.4];
  return`M${f(b[0]+nx)},${f(b[1]+ny)}Q${f(m[0]+nx*.8)},${f(m[1]+ny*.8)} ${f(t[0])},${f(t[1])}Q${f(m[0]-nx*.8)},${f(m[1]-ny*.8)} ${f(b[0]-nx)},${f(b[1]-ny)}Z`}
/* a small round body as a circle sub-path (many of them in one path: a cloud of buds, a raceme of capsules) */
const l40Dot=(c,r)=>`M${f(c[0]-r)},${f(c[1])}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0Z`;
/* the tone bucket of a point on a small sphere: its offset from the centre toward the light (upper left), from 0 (shade) to 2 (lit) */
const l40Lit=(dx,dy,r)=>{const k=-(dx+dy)/(1.41*Math.max(.01,r));return k>.35?2:k<-.35?0:1};

/* ---------- herbe de la pampa (Cortaderia selloana): a tall smooth culm, straw coloured, two or three dark-ringed nodes, and at its top a big silky panicle (30–50 cm, 8–14 cm wide):
   a rachis carrying whorls of fine branches, longest at its base, clothed in long silvery hairs that make it a feathery plume, nodding a little at its tip.
   Stages: in the sheath (the plume still wrapped in the flag leaf, its tip peeping out), freshly out (compact, the branches held close), open and fluffed (dried, spread, airy).
   Sold dried, natural (cream, champagne, beige), bleached white, 'Rosea' pink and dyed (pink, taupe, coffee, terracotta, black) ---------- */
const CW_L40PAMPA=[
 {id:'creme',n:'Naturel crème',c:'#ece2cb',st:'#cdbf9a'},
 {id:'champagne',n:'Champagne beige',c:'#d8c6a6',st:'#bea77c'},
 {id:'blanc',n:'Blanchi blanc',c:'#f7f4ec',st:'#ddd3b8'},
 {id:'cafe',n:'Teint café',c:'#8b6b4c',st:'#6e533a'},
 {id:'taupe',n:'Teint taupe',c:'#a6927f',st:'#857462'},
 {id:'rose',n:'Rose poudré (Rosea)',c:'#e1abb4',st:'#c9a48a'},
 {id:'terracotta',n:'Teint terracotta',c:'#c27a5a',st:'#9a5c42'},
 {id:'noir',n:'Teint noir',c:'#3a3432',st:'#2c2826'}];
function l40Pampa(g,t,o){const cw=cwPick(CW_L40PAMPA,o),op=Math.max(.05,Math.min(1,o.op??1)),st=op<.3?0:op<.75?1:2,k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||90)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt,{bow:R(-.04,.04)}),L=A.L,UP=[0,1,0];
  const gi=GHI['pampa'],Rm=gi.rch,fd=gi.fx*.92,sz=Math.max(.55,Math.min(1.4,L/(90*UPC))),Lp=Math.min(L*.42,R(30,40)*UPC*Math.pow(sz,.6))*(st===0?.7:st===1?.9:1),Lc=L-Lp*(st===0?.35:1),
    nC=7,w0=R(.55,.7)*UPC*Math.pow(sz,.3),nW=st===0?8:13,hw0=R(4.8,6.2)*UPC*Math.pow(sz,.5);
  const rules={
    /* the culm: held straight up its axis, its nodes ringed; the last internode thinner */
    C:p=>{if(p.i>=nC)return[['Nd',{}],['Ra',{j:0}]];const out=[['F',{l:Lc/nC*R(.92,1.08),w1:w0*(1-.45*(p.i+1)/nC),aim:UP,k:.14,wig:.004}]];if(p.i===2||p.i===4)out.push(['Nd',{}]);out.push(['C',{i:p.i+1}]);return out},
    /* the rachis through the plume, nodding toward its tip when open; at each node a whorl of two or three branches, the lower ones longest and most spread */
    Ra:p=>{if(p.j>=nW)return[['F',{l:Lp/nW*.6,w1:.1*UPC,e:st===2?.05:.01}]];const q=p.j/(nW-1),nb=q<.5?3:2,out=[['F',{l:Lp/nW*R(.85,1.15),w1:w0*.42*(1-.7*q),e:st===2?.012+.04*q:.004,wig:.008}]];
      for(let b=0;b<nb;b++){const a=st===0?R(2,5):st===1?R(8,15)*(1-.4*q):R(30,50)*(1-.4*q),bl=Lp*(st===0?.22:.34)*(1-.72*q)*R(.8,1.15);
        out.push(['[',{c:'br',w:.06*UPC}],['/',{a:p.j*97+b*360/nb+R(-25,25)}],['&',{a}],['F',{l:bl*.5,w1:.05*UPC,e:st===2?.05:.01}],['F',{l:bl*.5,w1:.03*UPC,e:st===2?.16:.02}],[']',{}])}
      out.push(['Ra',{j:p.j+1}]);return out}};
  const res=lsTurtle(lsDerive([['C',{i:0}]],rules,nC+nW+4),{p:[0,0,0],H:UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:1e6,w:w0}),Wq=l40Lay(A,bq,L,Rm,fd);
  const cul=lnCols(cw.st,'#fffaf0'),body=shd(cw.c,.06),shade=h2l(cw.c)[2]>.88?mix(cw.c,'#9c8f78',.5):mix(shd(cw.c,-.45),'#7a6048',.15),thread=shd(cw.st,-.08),barb=shd(cw.c,-.28),dk=h2l(cw.c)[2]<.35,c0=res.chains[0];
  /* the culm below the plume as a round stem; the rachis inside the plume is a veil, its core the widest one */
  const ci=c0.pts.findIndex(q=>q[1]>=Lc-.5),cut=ci<0?c0.pts.length-1:ci,Pc=c0.pts.slice(0,cut+1).map(Wq);lnTube(Pc,c0.ws.slice(0,cut+1),()=>cul,parts,{gloss:.35,piece:24,min:bq?.55:.53,ink:h2l(cw.st)[2]>.66?shd(cw.st,-.5):null});
  const Pr=c0.pts.slice(cut).map(Wq),wv=st===0?.32:st===1?.55:1,pr=v=>(v<.25?.45+.55*Math.sin(v/.25*Math.PI/2):1-.55*Math.pow((v-.25)/.75,2))*Math.sqrt(Math.max(0,1-Math.pow(Math.max(0,v-.9)/.1,2))*.8+.2),op0=dk?.8:.55;
  if(Pr.length>1)l40Veil(Pr,{hw:v=>hw0*.42*wv*pr(v)*(1-.6*v)+.6,body,shade,thread,barb,op:op0,halo:1.3,zb:-.02},parts);
  /* each branch toned by where it stands in the plume: the ones behind and on the shaded side deeper, the front ones lightest (the plume reads round without outlines) */
  const zc=(Pr.length?Pr.reduce((a,p)=>a+p[2],0)/Pr.length:0),bs=[];for(const ch of res.chains)if(ch.c==='br')bs.push(ch.pts.map(Wq));
  for(const P of bs){const e=P[P.length-1],m=P[Math.floor(P.length/2)],dz=Math.max(-1,Math.min(1,(m[2]-zc)/(hw0*.6))),sx=Math.max(-1,Math.min(1,(e[0]-P[0][0]-(e[1]-P[0][1]))/(hw0*1.2))),kd=Math.max(0,Math.min(.75,.32-.3*dz+.18*sx));
    l40Veil(P,{hw:v=>hw0*.3*wv*pr(v)+.5,body:mix(body,shade,kd*.75),thread,barb,op:op0,halo:1.35},parts)}
  /* the sheath of the flag leaf round a plume not yet out; the dark rings of the nodes (on the sheets) */
  for(const og of res.organs){const P=Wq(og.pos),H=A.Wv(og.pos,og.H);if(og.t!=='Nd')continue;
    if(st===0&&og.pos[1]>Lc*.8){const l=Lp*.75,b0=V3.add(P,V3.sc(H,-l*.1)),t0=V3.add(P,V3.sc(H,l*.9)),B=[b0[0],-b0[1]],T=[t0[0],-t0[1]],dx=T[0]-B[0],dy=T[1]-B[1],ll=Math.hypot(dx,dy)||1,w=w0*1.25,nx=-dy/ll*w,ny=dx/ll*w,sc=mix(cw.st,'#a8a878',.3);
      parts.push({z:P[2]+.3,fn:par=>E('path',{d:`M${f(B[0]+nx*.7)},${f(B[1]+ny*.7)}C${f(B[0]+dx*.4+nx)},${f(B[1]+dy*.4+ny)} ${f(B[0]+dx*.85+nx*.5)},${f(B[1]+dy*.85+ny*.5)} ${f(T[0])},${f(T[1])}C${f(B[0]+dx*.8-nx*.4)},${f(B[1]+dy*.8-ny*.4)} ${f(B[0]+dx*.4-nx)},${f(B[1]+dy*.4-ny)} ${f(B[0]-nx*.7)},${f(B[1]-ny*.7)}Z`,fill:toneAt(pal7(sc),.6),stroke:shd(sc,-.5),'stroke-width':.3,'stroke-opacity':.5},par)})}
    else if(DET>=1.5&&!LOD&&og.pos[1]<Lc-1){const S0=[P[0],-P[1]],h2=[H[0],-H[1]],hl=Math.hypot(h2[0],h2[1])||1,w=og.w*.55;parts.push({z:P[2]+.05,fn:par=>E('path',{d:`M${f(S0[0]-h2[1]/hl*w)},${f(S0[1]+h2[0]/hl*w)}L${f(S0[0]+h2[1]/hl*w)},${f(S0[1]-h2[0]/hl*w)}`,stroke:shd(cw.st,-.4),'stroke-width':.8,'stroke-linecap':'round'},par)})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0*2,bc:[shd(cw.st,-.5),shd(cw.st,-.2),cw.st,shd(cw.st,.4)]}}

/* ---------- massette (Typha latifolia; T. angustifolia narrower): a stiff round scape, and at its top the female spike, a dense cylinder (12–20 cm × 2–2.5 cm) of tiny flowers,
   velvety chocolate brown when ripe; above it, the male spike withered to a thin pointed tip; long strap leaves (1–2 cm wide), spongy, sheathing the base, arching and twisting.
   Stages: young (green spike, the male part still yellow with pollen), turning (olive brown), ripe (chocolate). Sold fresh, dried natural, bleached or dyed ---------- */
const CW_L40TYPHA=[
 {id:'naturel',n:'Brun chocolat (naturel)',c:'#5b3b27',st:'#8a9a62',nat:1},
 {id:'vert',n:'Vert (frais, jeune)',c:'#7c8c4c',st:'#7f9450',fresh:1},
 {id:'blanchi',n:'Blanchi ivoire',c:'#efe7d6',st:'#d8cfae'},
 {id:'rose',n:'Teint rose poudré',c:'#e8bfc6',st:'#c8a8a0'},
 {id:'prune',n:'Teint prune',c:'#5e2b45',st:'#5a4048'},
 {id:'noir',n:'Teint noir',c:'#2e2826',st:'#3a3430'}];
/* a velvet cylinder along a screen polyline: its rounded ends, its body toned across (shade side, lit band, a soft sheen), a fuzzy paler rim */
function l40Cyl(par,S,r,P,o={}){const d=pD(S),n=S.length,a=S[0],b=S[n-1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);let nx=-.7,ny=-.7;
  if(l>r*.3){nx=-dy/l;ny=dx/l;if(nx+ny>0){nx=-nx;ny=-ny}}const sh=(k,w,c,op)=>E('path',{d,transform:`translate(${f(nx*r*k)},${f(ny*r*k)})`,fill:'none',stroke:c,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round',opacity:op},par);
  if(!LOD)E('path',{d,fill:'none',stroke:toneAt(P,.7),'stroke-width':f(2*r+.7),'stroke-linecap':'round','stroke-linejoin':'round',opacity:.35},par);
  E('path',{d,fill:'none',stroke:toneAt(P,o.lo??.3),'stroke-width':f(2*r),'stroke-linecap':'round','stroke-linejoin':'round'},par);
  if(LOD)return;sh(.22,r*1.35,toneAt(P,.52),1);sh(.4,r*.7,toneAt(P,.66),(o.sheen??.75)*.55)}
function l40Typha(g,t,o){const cw=cwPick(CW_L40TYPHA,o),op=Math.max(.05,Math.min(1,o.op??1)),st=op<.3?0:op<.75?1:2,k=G(g),parts=[],bq=!!o.spine,Lf=(o.cm||80)*UPC,Lt=bq?blen(o.spine):Lf,A=lnAxis(o,Lt,{bow:R(-.02,.02)}),L=A.L,UP=[0,1,0];
  const gi=GHI['typha'],Rm=gi.rch,fd=gi.fx*.92,sz=Math.max(.55,Math.min(1.4,L/(80*UPC))),Ls=R(13,18)*UPC*Math.pow(sz,.35)*(st===0?.8:1),rs=R(.95,1.2)*UPC*Math.pow(sz,.2)*(st===0?.72:st===1?.9:1),
    gap=R(0,.6)*UPC,Lm=Ls*R(.45,.65),Lc=Math.max(L*.4,L-Ls-gap-Lm),nC=6,w0=R(.45,.55)*UPC*Math.pow(sz,.3),nl=bq?(o.short?1:Math.round(R(1,2))):2;
  const rules={
    C:p=>{if(p.i>=nC)return[['Sb',{}],['F',{l:Ls,w1:w0*.6,aim:UP,k:.2}],['St',{}],['F',{l:gap+.01,w1:w0*.5}],['[',{c:'male',w:w0*.48}],['M',{j:0}],[']',{}]];const out=[['F',{l:Lc/nC*R(.94,1.06),w1:w0*(1-.32*(p.i+1)/nC),aim:UP,k:.2,wig:.002}]];
      /* the leaves sheath the scape low down, alternate, arching out and twisting, the lower one longest */
      if(p.i<nl)out.push(['[',{c:'leaf'}],['/',{a:p.i*180+R(-30,30)}],['&',{a:bq?R(4,9):R(7,15)}],['$',{}],['o',{b:p.i,j:0}],['Lv',{b:p.i,j:0}],[']',{}]);out.push(['C',{i:p.i+1}]);return out},
    Lv:p=>{const n=14,len=L*(bq?R(.5,.7):R(.55,.8))*(p.b?.85:1);if(p.j>=n)return[];return[['/',{a:R(6,14)*(p.b?-1:1)}],['F',{l:len/n,e:bq?.02:.06*Math.pow((p.j+1)/n,1.5)}],['o',{b:p.b,j:p.j+1}],['Lv',{b:p.b,j:p.j+1}]]},
    M:p=>p.j>=4?[]:[['F',{l:Lm/4,w1:w0*(.42-.09*(p.j+1)),aim:UP,k:.15,wig:.01}],['M',{j:p.j+1}]]};
  const res=lsTurtle(lsDerive([['C',{i:0}]],rules,nC+20),{p:[0,0,0],H:UP,U:[0,0,1],T:[0,-1,0],e:0,wig:0,seg:1e6,w:w0}),Wq=l40Lay(A,bq,L,Rm,fd);
  /* colours: a natural spike ripens green → olive → chocolate; a dyed or bleached one keeps its colour */
  const nat=cw.nat,spc=nat?(st===0?'#6f7a3e':st===1?'#6a5530':cw.c):cw.fresh?(st===2?'#6f7a42':'#7c8c4c'):cw.c,PS=pal7(spc),stc=cw.fresh||nat&&st<2?'#7f9450':cw.st,cul=lnCols(stc,'#fbfff0'),male=st===0?(cw.fresh||nat?'#c9b25a':shd(cw.c,.1)):mix(spc,'#9a8a62',.45);
  const c0=res.chains[0],Pc=c0.pts.map(Wq);lnTube(Pc,c0.ws,()=>cul,parts,{gloss:.4,piece:24,min:.53,ink:h2l(stc)[2]>.66?shd(stc,-.5):null});
  const sb=res.organs.find(q=>q.t==='Sb'),stp=res.organs.find(q=>q.t==='St');
  if(sb&&stp){const sp=[];for(let i=0;i<=8;i++){const u=i/8,q=V3.add(V3.sc(sb.pos,1-u),V3.sc(stp.pos,u));sp.push(Wq(q))}const[Q]=lnSub(sp),S=Q.map(p=>[p[0],-p[1]]);let z=0;for(const p of Q)z+=p[2];
    parts.push({z:z/Q.length+.01,fn:par=>l40Cyl(par,S,rs,PS,{lo:cw.id==='blanchi'?.42:.3,sheen:h2l(spc)[2]>.7?.5:.7})})}
  for(const ch of res.chains){if(ch.c==='male'){const P=ch.pts.map(Wq);lnTube(P,ch.ws,()=>lnCols(male),parts,{piece:24,min:.53})}}
  /* the leaves: strap blades from their sheaths, laid like the blades of lot 18 */
  const lc=cw.fresh||nat?'#5f7a3a':mix(cw.st,'#8a8a62',.3),pl=lnPals(lc,mix(lc,'#b4c19a',.25),mix(lc,'#d8d2a8',.45)),bl=[];
  for(const og of res.organs)if(og.t==='o'){(bl[og.p.b]=bl[og.p.b]||[])[og.p.j]={p:og.pos.slice(),H:og.H,U:og.U}}
  bl.forEach((nd,b)=>{if(!nd||nd.length<3||nd.some(x=>!x))return;const P=[],U=[],V=[],n=nd.length;for(let j=0;j<n;j++){const q=nd[j],p=bq?lnHug(q.p.slice(),L,Rm):q.p;P.push(bq?lnSink(A,p,A.W(p),L,fd):A.W(p));const Hv=A.Wv(p,q.H),Uv=A.Wv(p,q.U);U.push(V3.nz(V3s(Uv,V3.sc(Hv,V3.dot(Uv,Hv)))));V.push(j/(n-1))}
    const w=R(1.1,1.5)*UPC,W=V.map(v=>w*(v<.06?.75+4*v:v<.7?1:Math.max(.05,Math.pow(Math.max(0,1-(v-.7)/.3),.8))));lnRibbon(P,U,W,V,{pal:pl.pal,palB:pl.palB,th:bq?.8:.4,piece:14,dI:DET>=1.5?.06:.1,mid:1,zb:b*.001},parts)});
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0*2,bc:[shd(stc,-.5),shd(stc,-.2),stc,shd(stc,.4)]}}

/* ---------- bruyère (Erica gracilis, E. carnea; Calluna vulgaris and its 'bud bloomers'): a thin woody stem, red-brown, branching into a brush of short twigs crowded with
   needle leaves (3–6 mm, in whorls of four) and tiny urn-shaped bells (2–4 mm) in whorls along them, nodding outward, a dark mouth at their tip.
   Stages: in bud (small, deep-coloured globes), half open, in full bloom. Sold as cut stems of 30–60 cm, the flowering part 10–25 cm ---------- */
const CW_L40HEATH=[
 {id:'rose-vif',n:'Rose vif (Erica gracilis)',c:'#d0507a'},
 {id:'blanc',n:'Blanc (gracilis Alba)',c:'#f4f0ee',g:'#d8e0c8'},
 {id:'mauve',n:'Violet mauve',c:'#a04a8a'},
 {id:'rose',n:'Rose tendre',c:'#e89ab8'},
 {id:'bordeaux',n:'Rouge bordeaux (Calluna Garden Girls)',c:'#a8304a'},
 {id:'lilas',n:'Lilas (Calluna)',c:'#c48ac8'},
 {id:'vieux-rose',n:'Vieux rose (séché)',c:'#9b5a68'}];
/* the bells, needles and twigs of a band of depth, each set in one path: the back bells, the twigs, the needles, the front bells (three tones each), the mouths */
function l40HeathBand(par,B,c){const P=pal7(c.col),tn=[toneAt(P,.34),toneAt(P,.56),toneAt(P,.76)],ink=shd(c.col,-.55),dt=DET>=1.5&&!LOD;
  const bells=(L)=>{const d=['','',''];for(const b of L)d[b.t]+=b.d;d.forEach((x,i)=>{if(x)E('path',{d:x,fill:tn[i],stroke:ink,'stroke-width':.22,'stroke-opacity':dt?.5:.3},par)})};
  bells(B.back);if(B.tw)E('path',{d:B.tw,fill:'none',stroke:c.wood,'stroke-width':1.15,'stroke-linecap':'round','stroke-linejoin':'round'},par);
  if(B.nd)E('path',{d:B.nd,fill:c.leaf,stroke:shd(c.leaf,-.4),'stroke-width':dt?.18:0,'stroke-opacity':.5},par);bells(B.front);
  if(dt&&B.mo)E('path',{d:B.mo,fill:shd(c.col,-.6),opacity:.7},par);if(dt&&B.hl)E('path',{d:B.hl,fill:'#ffffff',opacity:.45},par)}
function l40Heath(g,t,o){const cw=cwPick(CW_L40HEATH,o),op=Math.max(.05,Math.min(1,o.op??1)),k=G(g),parts=[],bq=!!o.spine,C=(o.cm||15)*UPC,Lt=bq?blen(o.spine):C*2.5,A=lnAxis(o,Lt,{bow:R(-.05,.05)}),L=A.L,UP=[0,1,0];
  const gi=GHI['bruyere'],Rm=gi.rch,fd=gi.fx*.92,Lfl=Math.min(C,L*(bq?(o.short?.7:.5):.55)),Lb=L-Lfl,nM=10,w0=R(.42,.52)*UPC,ns=Math.max(8,Math.round(Lfl/UPC*1.15)),sl=R(1.6,3.2)*UPC*Math.min(1.2,Math.pow(C/(15*UPC),.4));
  const rules={
    /* the main stem: below, bare but for its needles; in the flowering part, a twig at every node turning round it (2/5), the lower ones longest */
    M:p=>{if(p.i>=nM)return[['T',{j:0}]];return[['F',{l:Lb/nM*R(.9,1.1),w1:w0*(1-.4*(p.i+1)/nM),aim:UP,k:.1,wig:.01}],['M',{i:p.i+1}]]},
    T:p=>{if(p.j>=ns)return[['F',{l:sl*.25,w1:.18*UPC,aim:UP,k:.1}]];const q=p.j/(ns-1),out=[['F',{l:Lfl/ns*R(.85,1.15),w1:w0*.6*(1-.62*q),aim:UP,k:.1,wig:.02}]];
      if(q<.94)out.push(['[',{c:'sh',w:.18*UPC}],['/',{a:p.j*144+R(-25,25)}],['&',{a:R(30,48)-12*q}],['F',{l:sl*(1-.5*q)*R(.75,1.2)*.5,w1:.17*UPC,e:.02}],['F',{l:sl*(1-.5*q)*R(.75,1.2)*.5,w1:.16*UPC,e:.03,wig:.03}],[']',{}]);
      out.push(['T',{j:p.j+1}]);return out}};
  const res=lsTurtle(lsDerive([['M',{i:0}]],rules,nM+ns+4),{p:[0,0,0],H:UP,U:[0,0,1],T:UP,e:0,wig:0,seg:1e6,w:w0}),Wq=l40Lay(A,bq,L,Rm,fd),c0=res.chains[0];
  const wood=['#3a2418','#5e3a26','#86583a','#b8896a'],stc=lnCols('#6a4430','#f2e2d0'),leaf=mix('#3e5a2c','#5c7a3a',R(0,.4)),col=cw.c,bud=mix(shd(col,-.18),cw.g||col,.15);
  lnTube(c0.pts.map(Wq),c0.ws,()=>stc,parts,{gloss:.3,piece:20,min:.55});
  /* the bells and needles along a twig (or the top of the main stem), in view space: a whorl of four every node, the needles at the bare base, the youngest bells at its tip still in bud */
  const items=[],hb=.15*UPC,bs=.65+.35*op,lim=bq?24:-1e9;
  const along=(P,u0,isMain)=>{const n=P.length;if(n<2)return;const cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const Lc=cum[n-1];if(Lc<1)return;
    const at=l=>{let i=1;while(i<n-1&&cum[i]<l)i++;const t2=(l-cum[i-1])/((cum[i]-cum[i-1])||1),p=V3.add(P[i-1],V3.sc(V3s(P[i],P[i-1]),t2)),T=V3.nz(V3s(P[i],P[i-1]));return{p,T}};
    const step=hb*2.6*Math.max(.8,bs);let ph=R(0,90);
    for(let l=Lc*u0;l<=Lc-.2;l+=step*R(.85,1.1)){const{p,T}=at(l),q=l/Lc;if(bq&&p[1]<lim)continue;let X=V3.cr(T,[0,0,1]);if(V3l(X)<.1)X=V3.cr(T,[1,0,0]);X=V3.nz(X);const Y=V3.cr(T,X);ph+=45;
      const young=q>.82,fl=q>(isMain?.0:.28);
      for(let j=0;j<4;j++){const a=(ph+j*90+R(-15,15))*D,r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a)));
        if(!fl){const dn=V3.nz(V3.add(V3.sc(r,.55),V3.sc(T,.85))),b=[p[0]+r[0]*.4,-(p[1]+r[1]*.4)],tp=V3.add(p,V3.sc(dn,R(.4,.6)*UPC));items.push({z:p[2]+r[2],nd:l40Sliver(b,[tp[0],-tp[1]],1.1)});continue}
        const yb=young?R(.55,.75):1,el=young?R(.2,.5):R(-.55,-.1),dir=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(T,Math.sin(el)))),hl=hb*R(1.05,1.25)*bs*yb*1.25,rw=hl*(young?.95:.78),cen=V3.add(p,V3.sc(dir,hl*.92)),
          c2=[cen[0],-cen[1]],e1=[dir[0],-dir[1]],e1l=Math.hypot(e1[0],e1[1]),fs=Math.max(.35,e1l),ea=e1l>1e-4?[e1[0]/e1l,e1[1]/e1l]:[0,1],mj=hl*fs+rw*(1-fs),ang=Math.atan2(ea[1],ea[0]);
        const tI=lightI(dir),tt=tI>.66?2:tI>.42?1:0,eo=`M${f(c2[0]-ea[0]*mj)},${f(c2[1]-ea[1]*mj)}A${f(mj)},${f(rw)} ${f(ang/D)} 1,0 ${f(c2[0]+ea[0]*mj)},${f(c2[1]+ea[1]*mj)}A${f(mj)},${f(rw)} ${f(ang/D)} 1,0 ${f(c2[0]-ea[0]*mj)},${f(c2[1]-ea[1]*mj)}Z`;
        const mo=!young&&dir[2]>-.2?l40Dot([c2[0]+ea[0]*mj*.82,c2[1]+ea[1]*mj*.82],Math.max(.25,rw*.28)):'',hl2=tt===2?l40Dot([c2[0]-rw*.3,c2[1]-rw*.3],rw*.22):'';
        items.push({z:cen[2],back:dir[2]<-.15,t:tt,d:eo,col:young?bud:col,mo,hl:hl2})}}};
  for(const ch of res.chains)if(ch.c==='sh'){const P=ch.pts.map(Wq);along(P,0,false);items.push({z:P.reduce((a,p)=>a+p[2],0)/P.length,tw:pD(P.map(p=>[p[0],-p[1]]))})}
  { const top=c0.pts.filter(q=>q[1]>=Lb-.5).map(Wq);along(top,.05,true)}
  /* the bare stem's needles, pressed upward along it */
  const low=c0.pts.filter(q=>q[1]>L*.12&&q[1]<Lb).map(Wq);for(let i=1;i<low.length;i++){const p=low[i],T=V3.nz(V3s(p,low[i-1]));for(let j=0;j<4;j++){const a=R(0,6.28),X=V3.nz(V3.cr(T,[0,0,1])),Y=V3.cr(T,X),r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),dn=V3.nz(V3.add(V3.sc(r,.5),V3.sc(T,.86))),b=[p[0]+r[0]*w0*.3,-(p[1]+r[1]*w0*.3)],tp=V3.add(p,V3.sc(dn,R(.45,.65)*UPC));
    if(bq&&p[1]<lim)continue;items.push({z:p[2]+r[2]*.5,nd:l40Sliver(b,[tp[0],-tp[1]],1.1)})}}
  /* bands of depth: each drawn in one go, far to near */
  if(items.length){const zs=items.map(q=>q.z),z0=Math.min(...zs),z1=Math.max(...zs),nb=DET>=1.5?6:4,bands=[];for(let b=0;b<nb;b++)bands.push({back:[],front:[],tw:'',nd:'',mo:'',hl:'',bud:{back:[],front:[]},z:0,n:0});
    for(const q of items){const b=bands[Math.min(nb-1,Math.floor((q.z-z0)/((z1-z0)||1)*nb))];b.z+=q.z;b.n++;if(q.tw)b.tw+=q.tw;else if(q.nd)b.nd+=q.nd;else{const L2=q.col===col?b:b.bud;(q.back?L2.back:L2.front).push(q);b.mo+=q.mo;b.hl+=q.hl}}
    for(const b of bands){if(!b.n)continue;parts.push({z:b.z/b.n,fn:par=>{l40HeathBand(par,b,{col,wood:wood[1],leaf});if(b.bud.back.length||b.bud.front.length)l40HeathBand(par,b.bud,{col:bud,wood:wood[1],leaf})}})}}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:w0*2,bc:wood}}

/* ---------- a cloud of tiny round bodies (buds of rice flower) drawn as one group: sorted far to near, split in two layers of depth on the sheets (one in the app); in each layer an inked underlay
   (the outline of their union) then the bodies in three tones by their facing; the glints at sheet detail. b: {c (view space centre), r, n (normal)} ---------- */
function l40Cloud(par,B,col,o={}){if(!B.length)return;const P=pal7(col),tn=[toneAt(P,o.lo??.38),toneAt(P,.6),toneAt(P,.8)],ink=o.ink||shd(col,-.5),dt=DET>=1.5&&!LOD,s=B.slice().sort((a,b)=>a.c[2]-b.c[2]),h=dt?Math.ceil(s.length/2):s.length;
  for(const L of[s.slice(0,h),s.slice(h)]){if(!L.length)continue;let u='';const d=['','',''];let hl='';
    for(const b of L){const c=[b.c[0],-b.c[1]],I=lightI(b.n),t=I>.68?2:I>.45?1:0;u+=l40Dot(c,b.r);d[t]+=l40Dot(c,b.r*.86);if(dt&&t===2)hl+=l40Dot([c[0]-b.r*.32,c[1]-b.r*.32],b.r*.24)}
    E('path',{d:u,fill:tn[0],stroke:ink,'stroke-width':o.sw??.45,'stroke-opacity':.55},par);d.forEach((x,i)=>{if(x)E('path',{d:x,fill:tn[i]},par)});if(hl)E('path',{d:hl,fill:'#ffffff',opacity:.5},par)}}
/* the needle leaves along a view-space polyline P: in whorls turning round it, pressed upward; their upper faces and their pale undersides each in one path */
function l40Needles(P,o){let up='',dn='',z=0,n=0;for(let i=1;i<P.length;i++){const p=P[i],T=V3.nz(V3s(p,P[i-1]));let X=V3.cr(T,[0,0,1]);if(V3l(X)<.1)X=V3.cr(T,[1,0,0]);X=V3.nz(X);const Y=V3.cr(T,X);
    for(let j=0;j<o.k;j++){if(o.skip&&o.skip(p))continue;const a=R(0,6.283),r=V3.add(V3.sc(X,Math.cos(a)),V3.sc(Y,Math.sin(a))),dn3=V3.nz(V3.add(V3.sc(r,Math.sin(o.ang)),V3.sc(T,Math.cos(o.ang)))),
      b=[p[0]+r[0]*o.r0,-(p[1]+r[1]*o.r0)],tp=V3.add(p,V3.sc(dn3,o.len*R(.75,1.15))),sl=l40Sliver(b,[tp[0],-tp[1]],o.w||1.1);if(r[2]>-.2)up+=sl;else dn+=sl;z+=p[2];n++}}
  return{z:n?z/n:0,fn:par=>{if(dn)E('path',{d:dn,fill:o.cb,stroke:shd(o.cb,-.4),'stroke-width':DET>=1.5?.15:0,'stroke-opacity':.5},par);if(up)E('path',{d:up,fill:o.c,stroke:shd(o.c,-.45),'stroke-width':DET>=1.5?.15:0,'stroke-opacity':.5},par)}}}
/* twigs as one stroked path of constant width (never under 1.15: they stay joined) */
const l40Twigs=(chains,col,w=1.2)=>{let d='',z=0,n=0;for(const ch of chains){d+=pD(ch.pts.map(p=>[p[0],-p[1]]));for(const p of ch.pts){z+=p[2];n++}}return{z:n?z/n:0,fn:par=>E('path',{d,fill:'none',stroke:col,'stroke-width':f(Math.max(1.15,w)),'stroke-linecap':'round','stroke-linejoin':'round'},par)}};

/* ---------- ozothamnus, rice flower (Ozothamnus diosmifolius): a woody stem clothed in fine needle leaves (1–1.5 cm, dark green above, woolly white beneath),
   branching at its top into a dense, flat-topped corymb: each branch forks into short twigs that end in tight balls of tiny round buds (2–3 mm), white, cream or pink,
   that open into minute starry heads. Stages: green-tinged tight buds, coloured buds, the first heads opening. Sold as stems of 50–70 cm, the corymb 10–20 cm across ---------- */
const CW_L40OZO=[
 {id:'blanc',n:'Blanc (Cook’s Tiara)',c:'#f4f1ea'},
 {id:'creme',n:'Crème ivoire',c:'#ece6d4'},
 {id:'rose-pale',n:'Rose pâle (Pink Champagne)',c:'#efd0d8'},
 {id:'rose',n:'Rose (Radiance)',c:'#e3a3b8'},
 {id:'rose-vif',n:'Rose vif (Sunset Pink)',c:'#c96a8e'},
 {id:'prune',n:'Prune (teint)',c:'#8a3a6a'}];
function l40Ozo(g,t,o){const cw=cwPick(CW_L40OZO,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||25)*UPC,sc=['#2e2a1a','#4f4a30','#6f6a4a','#9c9878'],lc='#33502a',lcb=mix('#e8ead8','#9aa888',.3),dt=DET>=1.5;
  return bzShoot(g,t,o,{Lt:C*2.6,w0:3.4,w1:1.5,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,Ltop=C*.3,bD=C*.55*R(.9,1.1),bud=mix(cw.c,shd(cw.c,-.15),.3),col=op<.3?mix(cw.c,'#c8d0a8',.35):cw.c;
    /* the corymb: branches spiralled up the top of the stem, the lower ones longest, all reaching up to one dome; each forks into twigs ending in balls of buds */
    const nb=dt?9:8,gr=.7*UPC*(.8+.25*op),br=.16*UPC*(.85+.25*op),Ld=C*.3,Rd=bD/2;
    /* a twig forks into smaller ones: each fork ends in a ball of buds (K) */
    const fork=(lv,len)=>{const out=[['F',{l:len*.5,w1:1.05}]],n=lv?2:3;for(let j=0;j<n;j++){out.push(['[',{w:1}],['/',{a:j*360/n+R(-25,25)}],['&',{a:R(24,40)}]);if(lv)out.push(['F',{l:len*R(.35,.5),w1:.9,e:-.05}],['K',{}]);else out.push(...fork(1,len*.55));out.push([']',{}])}out.push(['F',{l:len*.25,w1:.9}],['K',{}]);return out};
    for(let i=0;i<nb;i++){const q=i/(nb-1),l=L-Ld*(1-q);if(l<l0+4)continue;const az=(i*137.5+R(-15,15))*D,el=q>.9?R(4,12):62-38*q+R(-6,6),
        rho=Math.min(Rd*.85,Math.tan(el*D)*(L-l+Rd*.25)),len=Math.hypot(rho,L-l+Rd*.25-rho*rho/(Rd*4))*R(.75,.85),mods=fork(0,len);
      const res=bzGrow(A,l,az,el,mods,{w:1.3,seg:4,T:[0,1,0],e:.12,wig:.05}),B=[];
      for(const og of res.organs){const ax=V3.nz(V3.add(og.H,[0,.8,0])),O=V3.add(og.pos,V3.sc(ax,gr*.3)),nbud=dt?26:16;B.push({c:og.pos,r:br*1.05,n:ax});
        for(let m=0;m<nbud;m++){const u=R(-1,1)*.95,a=R(0,6.283),w=Math.sqrt(1-u*u),dir=V3.nz(V3.add(V3.sc(ax,Math.abs(u)*.9+.15),V3.add(V3.sc(V3.nz(V3.cr(ax,[0,0,1])),w*Math.cos(a)),V3.sc(V3.nz(V3.cr(ax,V3.nz(V3.cr(ax,[0,0,1])))),w*Math.sin(a))))),c=V3.add(O,V3.sc(dir,gr*Math.sqrt(R(.15,1))));B.push({c,r:br*R(.85,1.12),n:dir})}}
      const zz=B.reduce((a,b)=>a+b.c[2],0)/Math.max(1,B.length),tw=l40Twigs(res.chains,mix(sc[1],'#6f7a4a',.35),1.2);
      parts.push({z:zz,fn:par=>{tw.fn(par);l40Cloud(par,B,col)}});
      parts.push(Object.assign(l40Needles(res.chains[0].pts,{k:2,ang:.55,len:.7*UPC,r0:.4,c:lc,cb:lcb}),{z:zz-.5}))}
    /* the needle leaves of the stem below the corymb, denser toward its top */
    const P=[];for(let l=l0+2;l<L-Ltop*.9;l+=2.2)P.push(A.at(A.sOf(l)).p);if(P.length>1)parts.push(Object.assign(l40Needles(P,{k:2,ang:.5,len:1.1*UPC,r0:1,c:lc,cb:lcb,skip:o.spine?(p=>p[1]<24):null}),{}))}})}

/* ---------- ricin (Ricinus communis 'Carmencita', 'Impala', 'Zanzibarensis'): a stout glaucous stem, red to purple, its big palmate leaves (7–9 pointed toothed lobes, bronze-purple
   in the red forms) on long petioles; at its top an erect raceme of three-lobed capsules (1.5–2.5 cm) on short pedicels, bristling with soft fleshy spines, bright red,
   burgundy or green. Stages: young (small, green-tinged), colouring, ripe. Sold as stems of 60–80 cm, the raceme 10–20 cm ---------- */
const CW_L40RIC=[
 {id:'rouge',n:'Rouge vif (Carmencita)',c:'#c22a30',lf:'#5a2630',sc:'#6a2228'},
 {id:'vert',n:'Vert (Zanzibarensis)',c:'#8ea24a',lf:'#4f7a34',sc:'#5f7a38'},
 {id:'bordeaux',n:'Bordeaux (Impala)',c:'#7a2840',lf:'#4a2230',sc:'#5a2030'},
 {id:'prune',n:'Prune foncé',c:'#5c2638',lf:'#3e2028',sc:'#4a1e28'},
 {id:'bronze',n:'Bronze (séché)',c:'#8a5a38',lf:'#5a4030',sc:'#5a3c28'},
 {id:'rose',n:'Rose (Carmencita Pink)',c:'#df8aa0',lf:'#4f6a34',sc:'#7a3a40'}];
function l40Ricin(g,t,o){const cw=cwPick(CW_L40RIC,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,s0c=shd(cw.sc,-.45),sc=[s0c,cw.sc,shd(cw.sc,.25),mix(cw.sc,'#c8b8c0',.45)],dt=DET>=1.5;
  return bzShoot(g,t,o,{Lt:C*3.4,w0:4.6,w1:2.2,s1:1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,Lr=Math.min(C,L*.7),ncap=Math.max(8,Math.round(Lr/UPC*(dt?1.35:1.15))),col=op<.3?mix(cw.c,'#8aa048',.55):op<.75?mix(cw.c,'#8aa048',.2):cw.c;
    /* the capsules up the raceme, spiralled, the youngest (smaller) at its top */
    for(let i=0;i<ncap;i++){const q=i/(ncap-1),l=L-Lr*(1-q)*.97-.6;if(l<l0+3)continue;const az=(i*137.5+R(-12,12))*D,f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),
        el=(q>.92?20:52-18*q+R(-8,8))*D,dir=V3.nz(V3.add(V3.sc(f0.T,Math.cos(el)),V3.sc(r,Math.sin(el)))),pl=(1.1-.5*q)*UPC*R(.85,1.15),rr=(1.05-.35*q)*UPC*R(.9,1.08)*(.72+.28*op),
        base=V3.add(f0.p,V3.sc(r,1.2)),pe=V3.add(base,V3.sc(dir,pl)),ax=V3.nz(V3.add(dir,[0,.35,0])),O=V3.add(pe,V3.sc(ax,rr*.85)),ph=R(0,6.283),c1=mix(col,shd(col,-.2),R(0,.35));
      /* the soft spines: from points of its visible surface along their normals, foreshortened; those on the rim stand out of the silhouette */
      const sp=[],ns=dt?56:34;for(let m=0;m<ns;m++){const u=R(-.95,.97),a=R(0,6.283),w=Math.sqrt(1-u*u),X=V3.nz(V3.cr(ax,[0,0,1])),Y=V3.cr(ax,X),n=V3.nz(V3.add(V3.sc(ax,u),V3.add(V3.sc(X,w*Math.cos(a)),V3.sc(Y,w*Math.sin(a)))));
        if(n[2]<-.15)continue;const b=V3.add(O,V3.sc(n,rr*.9)),e=V3.add(O,V3.sc(n,rr*(1.3+R(0,.2))));sp.push(l40Sliver([b[0],-b[1]],[e[0],-e[1]],rr*.17))}
      const lobes=(par,c,e1,e2,mj,r0)=>{if(LOD)return;let d='';for(let j=0;j<3;j++){const a=ph+j*2.094,s=Math.sin(a),cs=Math.cos(a);if(cs<-.1)continue;const x=s*r0*.95;d+=`M${f(c[0]+e1[0]*mj*.92+e2[0]*x*.2)},${f(c[1]+e1[1]*mj*.92+e2[1]*x*.2)}Q${f(c[0]+e2[0]*x*1.05)},${f(c[1]+e2[1]*x*1.05)} ${f(c[0]-e1[0]*mj*.92+e2[0]*x*.2)},${f(c[1]-e1[1]*mj*.92+e2[1]*x*.2)}`}
        if(d)E('path',{d,fill:'none',stroke:shd(c1,-.35),'stroke-width':f(Math.max(.4,r0*.1)),'stroke-opacity':.55,'stroke-linecap':'round'},par)};
      parts.push({z:O[2],fn:par=>{E('path',{d:`M${f(base[0])},${f(-base[1])}L${f(pe[0])},${f(-pe[1])}`,stroke:cw.sc,'stroke-width':1.5,'stroke-linecap':'round'},par);
        bzFruit(par,O,ax,rr*.9,rr,c1,{gl:.28,big:3,paint:lobes});E('path',{d:sp.join(''),fill:mix(c1,'#ffffff',.08),stroke:shd(c1,-.4),'stroke-width':.25,'stroke-opacity':.6},par)}})}
    /* the palmate leaves on long petioles below the raceme (one or two), the lower one larger */
    const nl=o.spine?(o.from>.6?1:2):2;for(let j=0;j<nl;j++){const l=L-Lr-C*(.35+.55*j)*R(.9,1.1);if(l<l0+C*.25||(o.spine&&A.at(A.sOf(l)).p[1]<30))continue;const az=(j*170+R(-20,20))*D,f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),
        H=V3.nz(V3.add(V3.sc(f0.T,.55),r)),len=C*R(.95,1.2)*(1-.15*j),p=[f0.p[0],-f0.p[1]],h=[H[0],-H[1]],hl=Math.hypot(h[0],h[1]),fs=Math.max(.35,hl),ang=Math.atan2(h[1],h[0]);
      parts.push({z:f0.p[2]+H[2]*len*.4,fn:par=>palmLeaf(par,p[0],p[1],ang,len*fs,cw.lf,{lobes:7,spread:290,wl:.2,pet:.42,tilt:Math.acos(Math.min(1,.35+.65*Math.abs(H[2])))})})}}})}

/* ---------- registers ---------- */
Object.assign(GH,{'pampa':l40Pampa,'typha':l40Typha,'bruyere':l40Heath,'ozothamnus':l40Ozo,'ricin-capsules':l40Ricin});
Object.assign(CWS,{'pampa':CW_L40PAMPA,'typha':CW_L40TYPHA,'bruyere':CW_L40HEATH,'ozothamnus':CW_L40OZO,'ricin-capsules':CW_L40RIC});
Object.assign(SZG,{'pampa':[60,80,100,100,120,150],'typha':[60,70,80,80,100],'bruyere':[10,15,15,20,25],'ozothamnus':[18,22,25,25,30],'ricin-capsules':[10,12,15,15,20]});
Object.assign(GHI,{'pampa':{form:'ligne',size:1,k:'plant',self:90*UPC,tip:.92,fx:4*UPC,rch:9*UPC},'typha':{form:'ligne',size:1,k:'plant',self:80*UPC,tip:.97,fx:3.5*UPC,rch:6*UPC},
 'bruyere':{form:'epi',size:1,k:'plant',self:45*UPC,tip:.85,fx:4*UPC,rch:4*UPC},
 'ozothamnus':{form:'nuage',size:1.3,k:'plant',rk:.6,tip:.85},'ricin-capsules':{form:'baie',size:1.5,k:'plant',rk:.75,tip:.85}});
