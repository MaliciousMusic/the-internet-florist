
/* ---------- what the vessel stands on: the stand of its photo (cube, column, stool, Chinese stand, counter, books) or a table ---------- */
const SMAT={beton:{t:'#a9b1ba',f:'#8e98a3',e:'#c4cbd2'},platre:{t:'#ecebe7',f:'#dedcd6',e:'#f7f6f2'},laque:{t:null,f:null,e:null},brule:{t:'#2f3033',f:'#121213',e:'#4a4a4c'},
  serpentine:{t:'#aab497',f:'#8e9a7c',e:'#c8cfb5'},miroir:{t:'#e9e6f0',f:'#c9c7d2',e:'#ffffff'},marbre:{t:'#ecebe8',f:'#dcdad6',e:'#ffffff'},inox:{t:'#8a877e',f:'#6e665c',e:'#c1c2b9'},bois:{t:null,f:null,e:null}};
function stCols(st){const m=SMAT[st.m]||{},c=st.c;return{t:m.t||lt(c,.08),f:m.f||dk(c,.1),e:m.e||lt(c,.3)}}
/* stone, concrete and wood surfaces on a face, clipped to it */
function faceTex(par,st,x0,y0,x1,y1,clip){const k=G(par,clip?{'clip-path':`url(#${clip})`}:null),m=st.m,W=x1-x0,H=y1-y0;
  if(m==='beton'){for(let i=0;i<lodN(70);i++)E('circle',{cx:f(R(x0,x1)),cy:f(R(y0,y1)),r:f(R(.4,1.6)),fill:'#4e5560',opacity:f(R(.2,.5))},k);for(let i=0;i<6;i++)E('ellipse',{cx:f(R(x0,x1)),cy:f(R(y0,y1)),rx:f(R(10,40)),ry:f(R(5,18)),fill:'#5a636e',opacity:.08},k)}
  if(m==='marbre'||m==='serpentine'){const vc=m==='marbre'?'#9a9894':'#4f5a44';for(let i=0;i<lodN(9);i++){const xa=R(x0-40,x1),ya=R(y0,y1);let d=`M${f(xa)},${f(ya)}`;for(let j=1;j<=8;j++)d+=`L${f(xa+j*W*.12+R(-6,6))},${f(ya+j*R(2,9)+R(-4,4))}`;
      E('path',{d,stroke:vc,'stroke-width':f(R(.4,1.6)),'stroke-opacity':f(R(.15,.45)),fill:'none'},k)}}
  if(m==='brule'){let d='';for(let y=y0+2;y<y1;y+=R(2,5))d+=`M${f(x0)},${f(y)}H${f(x1)}`;E('path',{d,stroke:'#4a4a4e','stroke-width':.5,'stroke-opacity':.35},k);for(let i=0;i<lodN(30);i++)E('rect',{x:f(R(x0,x1)),y:f(R(y0,y1)),width:f(R(3,14)),height:.8,fill:'#6a6a70',opacity:.25},k)}
  if(m==='bois'){for(let i=0;i<lodN(12);i++){const y=R(y0,y1);E('path',{d:`M${f(x0)},${f(y)}C${f(x0+W*.3)},${f(y+R(-5,5))} ${f(x0+W*.6)},${f(y+R(-5,5))} ${f(x1)},${f(y+R(-3,3))}`,stroke:'#2e1e12','stroke-opacity':.22,'stroke-width':f(R(.5,1.3)),fill:'none'},k)}}
  if(st.fl){let d='';for(let x=x0+4;x<x1;x+=7.8)d+=`M${f(x)},${f(y0)}V${f(y1)}`;E('path',{d,stroke:'#000','stroke-opacity':.1,'stroke-width':2.2},k);let d2='';for(let x=x0+6.4;x<x1;x+=7.8)d2+=`M${f(x)},${f(y0)}V${f(y1)}`;E('path',{d:d2,stroke:'#fff','stroke-opacity':.35,'stroke-width':1},k)}
  return k}
function rectClip(x0,y0,x1,y1){return vClip(`M${f(x0)},${f(y0)}H${f(x1)}V${f(y1)}H${f(x0)}Z`)}
/* returns how far below the floor line the stand should stay in frame, and the clip of its top face for the vessel's shadow */
function stage(par,v){const st=v.st,g=G(par);if(!st){const sf=v.sf||'none';if(sf!=='none')plinth(g,sf);return{show:sf==='none'?14:26,top:null}}
  const c=stCols(st),w=st.w/2,dep=Math.min(st.w,260)*.16,k=st.k;
  if(k==='box'||k==='huaji'||k==='books'){const yb=FL-dep/2,yf=FL+dep/2,fh=Math.max(40,st.h);
    if(k==='books'){const bk=[[0,st.h*.55,'#e8306a'],[st.h*.55,st.h*.45,'#3a5f8a']];let yy=yf;for(const[,th,cc]of bk.reverse()){}
      E('path',{d:`M${f(VX-w)},${f(yb)}L${f(VX+w)},${f(yb)}L${f(VX+w+4)},${f(yf)}L${f(VX-w-4)},${f(yf)}Z`,fill:lt(st.c,.1)},g);E('rect',{x:f(VX-w-4),y:f(yf),width:f(2*w+8),height:f(st.h*.5),fill:lin([dk(st.c,.15),st.c,dk(st.c,.2)],0,0,1,0)},g);
      E('rect',{x:f(VX-w-4),y:f(yf+st.h*.18),width:f(2*w*.55),height:f(st.h*.14),fill:'#f5a623',opacity:.9},g);E('rect',{x:f(VX-w-10),y:f(yf+st.h*.5),width:f(2*w+20),height:f(st.h*.5),fill:lin(['#efe6d4','#fbf6ea','#e6dcc6'],0,0,0,1)},g);
      let d='';for(let y=yf+st.h*.52;y<yf+st.h;y+=1.6)d+=`M${f(VX-w-8)},${f(y)}H${f(VX+w+8)}`;E('path',{d,stroke:'#c9bda4','stroke-width':.4,'stroke-opacity':.6},g);
      return{show:Math.min(st.h+dep,95),top:vClip(`M${f(VX-w)},${f(yb)}L${f(VX+w)},${f(yb)}L${f(VX+w+4)},${f(yf)}L${f(VX-w-4)},${f(yf)}Z`)}}
    const topD=`M${f(VX-w*.97)},${f(yb)}L${f(VX+w*.97)},${f(yb)}L${f(VX+w)},${f(yf)}L${f(VX-w)},${f(yf)}Z`;
    E('path',{d:topD,fill:st.m==='miroir'?lin(['#f4f2f8','#d9d6e4','#efedf5'],0,0,1,0):lin([[0,dk(c.t,.06)],[.5,c.t],[1,lt(c.t,.04)]],0,0,1,0)},g);
    if(k==='huaji')E('path',{d:`M${f(VX-w)},${f(yf)}H${f(VX+w)}`,stroke:lt(st.c,.3),'stroke-width':1.2},g);
    E('rect',{x:f(VX-w),y:f(yf),width:f(2*w),height:f(k==='huaji'?st.h*.07:fh),fill:lin([[0,lt(c.f,.06)],[.55,c.f],[1,dk(c.f,.18)]],0,0,1,0)},g);
    if(k==='huaji'){const ya=yf+st.h*.07,lg=Math.max(7,w*.09);E('rect',{x:f(VX-w+4),y:f(ya),width:f(2*w-8),height:f(st.h*.09),fill:dk(st.c,.1)},g);let d='';const x0=VX-w+lg+4,x1=VX+w-lg-4;
      for(let x=x0;x<x1;x+=12)d+=`M${f(x)},${f(ya+2)}v${f(st.h*.09-4)}h6v${f(-(st.h*.09-4))}`;E('path',{d,stroke:lt(st.c,.15),'stroke-width':1.2,fill:'none'},g);
      for(const s of[-1,1])E('rect',{x:f(s<0?VX-w+3:VX+w-3-lg),y:f(ya),width:f(lg),height:f(st.h*.9),fill:lin([lt(st.c,.12),st.c,dk(st.c,.25)],0,0,1,0)},g)}
    if(st.m==='miroir'){E('path',{d:`M${f(VX-w*.3)},${f(yf)}L${f(VX-w*.1)},${f(yf+fh)}`,stroke:'#ffffff','stroke-width':6,'stroke-opacity':.25},g)}
    faceTex(g,st,VX-w,yf,VX+w,yf+fh,rectClip(VX-w,yf,VX+w,yf+fh));faceTex(g,st,VX-w,yb,VX+w,yf,vClip(topD));
    E('path',{d:`M${f(VX-w)},${f(yf+.5)}H${f(VX+w)}`,stroke:c.e,'stroke-width':1.2,'stroke-opacity':.8},g);
    return{show:k==='huaji'?Math.min(st.h,120):Math.min(fh+dep/2,105),top:vClip(topD)}}
  if(k==='drum'||k==='stool'){const ry=vRy(w),th=k==='stool'?Math.max(18,st.h*.08):Math.min(st.h,420),S=[[0,w],[th,w]];
    const id='sd'+(gid++),gr=E('linearGradient',{id,x1:0,x2:1,y1:0,y2:0},GDEF||defs),mat={mat:st.m==='laque'||st.m==='inox'?'satin':'matte'};
    for(let i=0;i<15;i++){const u=-1+2*i/14,[hex]=vShade(mat,c.f,u,0);E('stop',{offset:f(i/14),'stop-color':hex},gr)}
    if(k==='stool'){for(const[dx,sp]of[[-.62,-1],[.62,1],[-.15,-.25]])E('path',{d:`M${f(VX+dx*w)},${f(FL+th)}L${f(VX+dx*w+sp*28)},${f(FL+th+st.h)}`,stroke:dk(st.c,dx===-.15?.35:.15),'stroke-width':f(Math.max(9,w*.12)),'stroke-linecap':'butt'},g)}
    E('path',{d:`M${f(VX-w)},${FL}L${f(VX-w)},${f(FL+th)}A${f(w)},${f(ry)} 0 0 0 ${f(VX+w)},${f(FL+th)}L${f(VX+w)},${FL}Z`,fill:`url(#${id})`},g);
    if(st.fl&&!LOD){let d='';for(let i=1;i<40;i++){const ph=-Math.PI/2+i*Math.PI/40,x=VX+w*Math.sin(ph);d+=`M${f(x)},${f(FL+ry*Math.cos(ph))}V${f(FL+th+ry*Math.cos(ph))}`}E('path',{d,stroke:'#000','stroke-opacity':.08,'stroke-width':1.6},g)}
    faceTex(g,st,VX-w,FL,VX+w,FL+th,vClip(`M${f(VX-w)},${FL}L${f(VX-w)},${f(FL+th)}A${f(w)},${f(ry)} 0 0 0 ${f(VX+w)},${f(FL+th)}L${f(VX+w)},${FL}Z`));
    const topD=`M${f(VX-w)},${FL}A${f(w)},${f(ry)} 0 1 1 ${f(VX+w)},${FL}A${f(w)},${f(ry)} 0 1 1 ${f(VX-w)},${FL}Z`;E('path',{d:topD,fill:rad([[0,lt(c.t,.05)],[.8,c.t],[1,dk(c.t,.08)]],.45,.4,.7)},g);
    if(st.m==='bois'||st.m==='brule'){for(let i=1;i<6;i++)E('ellipse',{cx:f(VX+w*.1),cy:FL,rx:f(w*i/6.5),ry:f(ry*i/6.5),fill:'none',stroke:dk(c.t,.2),'stroke-opacity':.18,'stroke-width':.7},g)}
    E('path',{d:`M${f(VX-w)},${FL}A${f(w)},${f(ry)} 0 0 0 ${f(VX+w)},${FL}`,stroke:c.e,'stroke-width':1.3,'stroke-opacity':.7,fill:'none'},g);
    return{show:Math.min(th+ry+30,105),top:vClip(topD)}}
  /* counters and consoles: a wide top with a thick front edge */
  const W2=Math.min(w,420),yb=FL-dep/2,yf=FL+dep/2,ed=st.round?12:16,topD=st.round?`M${f(VX-W2+dep)},${f(yb)}L${f(VX+W2-dep)},${f(yb)}Q${f(VX+W2)},${FL} ${f(VX+W2-dep)},${f(yf)}L${f(VX-W2+dep)},${f(yf)}Q${f(VX-W2)},${FL} ${f(VX-W2+dep)},${f(yb)}Z`:`M${f(VX-W2)},${f(yb)}L${f(VX+W2)},${f(yb)}L${f(VX+W2)},${f(yf)}L${f(VX-W2)},${f(yf)}Z`;
  E('path',{d:topD,fill:lin([[0,dk(c.t,.05)],[.5,c.t],[1,lt(c.t,.06)]],0,0,1,0)},g);faceTex(g,st,VX-W2,yb,VX+W2,yf,vClip(topD));
  E('rect',{x:f(VX-W2+(st.round?dep:0)),y:f(yf),width:f(2*W2-(st.round?2*dep:0)),height:ed,fill:lin([lt(c.f,.12),c.f],0,0,0,1)},g);
  if(st.brass)E('rect',{x:f(VX-W2+(st.round?dep:0)),y:f(yf+ed),width:f(2*W2-(st.round?2*dep:0)),height:2.4,fill:lin(['#8a6a2a','#e8c878','#9a7a3a'],0,0,1,0)},g);
  if(st.h>200){E('rect',{x:f(VX-W2+8),y:f(yf+ed),width:f(2*W2-16),height:120,fill:lin([dk(c.f,.04),dk(c.f,.12)],0,0,0,1)},g);faceTex(g,st,VX-W2+8,yf+ed,VX+W2-8,yf+ed+120,rectClip(VX-W2+8,yf+ed,VX+W2-8,yf+ed+120))}
  E('path',{d:`M${f(VX-W2)},${f(yf+.5)}H${f(VX+W2)}`,stroke:c.e,'stroke-width':1,'stroke-opacity':.75},g);
  return{show:st.h>200?70:dep/2+ed+18,top:vClip(topD)}}
/* the table slab (no stand) */
function plinth(par,kind){if(!kind||kind==='none')return;const C={beton:['#b9b4ac','#cfcac2','#a29c93'],blanc:['#ecebe7','#f7f6f3','#d8d6d1'],noir:['#1c1b1c','#2a292a','#111'],bois:['#6a4a32','#8a6446','#4e3524'],marbre:['#e6e4df','#f4f3ef','#d2cfc8']}[kind]||['#e6e4df','#f2f0ec','#d4d0c8'];
  E('path',{d:`M${VX-260},${FL+2}L${VX+260},${FL+2}L${VX+250},${FL-14}L${VX-250},${FL-14}Z`,fill:lin([C[1],C[0]],0,0,0,1)},par);
  E('rect',{x:VX-260,y:FL+2,width:520,height:260,fill:lin([[0,C[0]],[.5,C[2]],[1,C[2]]],0,0,0,1)},par);
  E('path',{d:`M${VX-260},${FL+2.5}L${VX+260},${FL+2.5}`,stroke:'#fff','stroke-opacity':kind==='noir'?.12:.45,'stroke-width':1.2},par);
  if(kind==='bois')for(let i=0;i<9;i++){const y=FL+10+i*26+R(-6,6);E('path',{d:`M${VX-260},${f(y)}C${VX-80},${f(y+R(-8,8))} ${VX+80},${f(y+R(-8,8))} ${VX+260},${f(y)}`,stroke:'#3e2a1c','stroke-opacity':.35,'stroke-width':1.2,fill:'none'},par)}
  if(kind==='marbre')faceTex(par,{m:'marbre'},VX-260,FL-14,VX+260,FL+120,null)}
