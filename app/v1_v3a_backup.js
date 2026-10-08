
/* ================= Vessels from the reference study: lathe-drawn ceramics, glass, metal, kenzan, hand-tied, paper ================= */
const FL=990,VX=500;
/* profile = [[height from floor, half width], ...] bottom -> top */
const VZ={
 'coupe-blanche':{n:'Coupe sur pied',m:'céramique mate',p:0,col:'#ecebe5',mat:'matte',pl:'beton',prof:[[0,34],[5,36],[9,22],[34,12],[52,13],[66,34],[82,60],[94,70]]},
 'coupe-noire':{n:'Coupe noire',m:'céramique mate',p:60,col:'#1d1b1d',mat:'matte',pl:'blanc',prof:[[0,34],[5,36],[9,22],[34,12],[52,13],[66,34],[82,60],[94,70]]},
 'boule-chocolat':{n:'Boule chocolat',m:'émail brillant',p:60,col:'#3b2016',mat:'gloss',pl:'bois',prof:[[0,38],[10,56],[40,74],[78,72],[108,50],[124,26],[134,22],[142,26]]},
 'boule-sapin':{n:'Boule vert sapin',m:'émail brillant',p:60,col:'#1d3a29',mat:'gloss',pl:'blanc',prof:[[0,38],[10,56],[40,74],[78,72],[108,50],[124,26],[134,22],[142,26]]},
 'verre':{n:'Cylindre verre',m:'tiges visibles',p:50,kind:'glass',pl:'beton',prof:[[0,44],[176,44]]},
 'calice':{n:'Calice terrazzo',m:'grès moucheté',p:80,col:'#e9e5e0',mat:'matte',tex:'terrazzo',pl:'blanc',prof:[[0,46],[7,46],[12,28],[54,13],[64,15],[74,30],[160,34],[166,35]]},
 'balustre':{n:'Balustre argent',m:'étain patiné',p:100,kind:'metal',col:'#a19e98',pl:'noir',prof:[[0,38],[8,38],[14,20],[34,17],[84,54],[118,50],[148,24],[166,19],[180,32]]},
 'urne':{n:'Urne Médicis',m:'céramique noire',p:100,col:'#161517',mat:'matte',pl:'blanc',prof:[[0,42],[9,42],[15,24],[40,20],[56,32],[84,40],[130,46],[150,54],[156,56]]},
 'cobalt':{n:'Boule côtelée',m:'émail cobalt',p:80,col:'#3a68c8',mat:'gloss',tex:'ribs',pl:'blanc',prof:[[0,36],[10,54],[40,70],[76,68],[104,46],[120,26],[130,23],[136,26]]},
 'jarre':{n:'Jarre en grès',m:'terre mouchetée',p:60,col:'#a5683e',mat:'matte',tex:'speck',pl:'bois',prof:[[0,36],[24,58],[70,64],[110,46],[130,28],[140,26],[146,29]]},
 'soliflore':{n:'Soliflore noir',m:'verre laqué',p:80,col:'#0d0b0d',mat:'gloss',pl:'blanc',prof:[[0,40],[6,40],[12,14],[24,12],[44,34],[70,48],[96,40],[124,16],[184,9],[196,13]]},
 'kenzan':{n:'Pique-fleurs',m:'laiton sur béton',p:90,kind:'kenzan',pl:'beton',h:96},
 'noue':{n:'Bouquet noué',m:'ruban satin',p:0,kind:'hand',rib:'#e9c9c3',h:0},
 'papier':{n:'Papier coréen',m:'ruban de soie',p:40,kind:'wrap',paper:'#ebe6de',rib:'#b9a294',h:0}};
const vH=v=>v.h!=null?v.h:v.prof[v.prof.length-1][0];
const vMouth=v=>v.prof?v.prof[v.prof.length-1][1]:v.kind==='kenzan'?18:26;
/* left/right outline of a lathe profile */
function lathe(P){const R2=P.map(([y,w])=>[VX+w,FL-y]),L2=P.slice().reverse().map(([y,w])=>[VX-w,FL-y]);return smooth(R2,false)+'L'+smooth(L2,false).slice(1)+'Z'}
function plinth(par,kind){if(!kind)return;const C={beton:['#b9b4ac','#cfcac2','#a29c93'],blanc:['#ecebe7','#f7f6f3','#d8d6d1'],noir:['#1c1b1c','#2a292a','#111'],bois:['#6a4a32','#8a6446','#4e3524']}[kind];
  E('path',{d:`M${VX-260},${FL+2}L${VX+260},${FL+2}L${VX+250},${FL-14}L${VX-250},${FL-14}Z`,fill:lin([C[1],C[0]],0,0,0,1)},par);
  E('rect',{x:VX-260,y:FL+2,width:520,height:260,fill:lin([[0,C[0]],[.5,C[2]],[1,C[2]]],0,0,0,1)},par);
  E('path',{d:`M${VX-260},${FL+2.5}L${VX+260},${FL+2.5}`,stroke:'#fff','stroke-opacity':kind==='noir'?.12:.45,'stroke-width':1.2},par);
  if(kind==='bois')for(let i=0;i<9;i++){const y=FL+10+i*26+R(-6,6);E('path',{d:`M${VX-260},${f(y)}C${VX-80},${f(y+R(-8,8))} ${VX+80},${f(y+R(-8,8))} ${VX+260},${f(y)}`,stroke:'#3e2a1c','stroke-opacity':.35,'stroke-width':1.2,fill:'none'},par)}}
function vessel(par,id,t=0,o={}){const v=VZ[id]||VZ['coupe-blanche'],g=G(par),h=vH(v),mw=vMouth(v),top=FL-h;
  if(!o.noPlinth)plinth(g,v.pl);
  if(v.kind!=='hand'&&v.kind!=='wrap')E('ellipse',{cx:VX+8,cy:FL-1,rx:f((v.prof?v.prof[0][1]:60)*1.5),ry:9,fill:rad([[0,'#1a1210',.42],[1,'#1a1210',0]])},g);
  if(v.kind==='kenzan'){E('ellipse',{cx:VX,cy:FL-6,rx:46,ry:8,fill:lin(['#6a5020','#d9b25a','#8a6a2a'],0,0,1,0)},g);E('rect',{x:VX-46,y:FL-6,width:92,height:6,fill:lin(['#5a4018','#c9a24a','#7a5a20'],0,0,1,0)},g);
    for(let i=0;i<26;i++)E('path',{d:`M${f(VX+R(-38,38))},${f(FL-6+R(-4,4))}v-4`,stroke:'#e8d08a','stroke-width':.8},g)}
  else if(v.prof){const d=lathe(v.prof),wmax=Math.max(...v.prof.map(p=>p[1]));
    if(v.kind==='glass'){E('path',{d,fill:lin([[0,'#cfe0dc',.42],[.2,'#ffffff',.12],[.5,'#e8f2f0',.08],[.85,'#bcd2cc',.3],[1,'#a8c2bc',.5]],0,0,1,0)},g)}
    else{const c=v.col,met=v.kind==='metal';
      E('path',{d,fill:met?lin([[0,dk(c,.55)],[.12,lt(c,.5)],[.24,dk(c,.2)],[.42,lt(c,.7)],[.55,c],[.8,dk(c,.45)],[1,dk(c,.65)]],0,0,1,0):lin([[0,dk(c,.5)],[.2,dk(c,.12)],[.34,lt(c,v.mat==='gloss'?.25:.12)],[.5,c],[.82,dk(c,.38)],[1,dk(c,.58)]],0,0,1,0)},g);
      E('path',{d,fill:lin([[0,'#000',0],[.7,'#000',0],[1,'#000',.25]],0,0,0,1)},g);
      if(v.tex==='ribs')for(let i=1;i<12;i++){const u=i/12*2-1;E('path',{d:smooth(v.prof.map(([y,w])=>[VX+u*w*.98,FL-y]),false),stroke:lt(c,.55),'stroke-width':2.2,'stroke-opacity':f(.55*(1-Math.abs(u))+.1),fill:'none'},g)}
      if(v.tex==='terrazzo'||v.tex==='speck'||v.tex==='ribs'){const sc=v.tex==='terrazzo'?['#2a2626','#7a7470','#b8aea6']:v.tex==='speck'?['#3a2010','#d8b890','#5a3420']:['#ffffff','#e8eeff','#ffffff'];
        for(let i=0;i<(v.tex==='ribs'?60:110);i++){const y=R(4,h-4),pr=v.prof,j=pr.findIndex(p=>p[0]>=y),a=pr[Math.max(0,j-1)],b=pr[Math.max(0,j)],w=a[1]+(b[1]-a[1])*((y-a[0])/Math.max(1,b[0]-a[0]));
          E('circle',{cx:f(VX+R(-.92,.92)*w),cy:f(FL-y),r:f(R(.5,v.tex==='terrazzo'?1.8:1.2)),fill:pick(sc),opacity:f(R(.35,.85))},g)}}
      if(v.mat==='gloss'||met){glint(g,VX-wmax*.42,FL-h*.5,wmax*.07,h*.32,0,.6);glint(g,VX+wmax*.5,FL-h*.45,wmax*.04,h*.2,0,.25)}}
    E('ellipse',{cx:VX,cy:f(top),rx:mw,ry:f(Math.max(2.5,mw*.16)),fill:v.kind==='glass'?'#d8e6e2':dk(v.col||'#888',.7),stroke:v.kind==='glass'?'#ffffff':lt(v.col||'#888',.35),'stroke-width':v.kind==='glass'?2:1.4,'stroke-opacity':.8},g);
    if(v.kind==='glass'){E('path',{d:`M${VX-41},${FL-140}Q${VX},${FL-133} ${VX+41},${FL-140}`,stroke:'#ffffff','stroke-width':1.4,'stroke-opacity':.7,fill:'none'},g);
      glint(g,VX-30,FL-90,4,70,0,.55);glint(g,VX+33,FL-96,2.5,60,0,.35);E('path',{d,fill:'none',stroke:'#e4eeeb','stroke-width':2.5,'stroke-opacity':.8},g)}}
  if(t)fade(g,t,700,18);return{g,top,mw,h}}
/* stems seen through glass / below a binding: bundle from the binding point down to the cut ends */
function stemsBelow(par,n,id){const v=VZ[id]||{},bp=v.kind==='hand'||v.kind==='wrap'?[VX,830]:[VX,FL-vH(v)],g=G(par);
  if(v.kind==='glass'){for(let i=0;i<n;i++){const x0=VX+R(-30,30),x1=VX+R(-34,34);E('path',{d:`M${f(x0)},${FL-176}L${f(x0+(x1-x0)*.35)},${FL-140}L${f(x1)},${FL-6}`,stroke:pick(['#4f7a36','#5f8a3e','#3f6a2e']),'stroke-width':f(R(2.2,3.6)),'stroke-opacity':.85,fill:'none'},g)}
    E('rect',{x:VX-43,y:FL-140,width:86,height:138,fill:'#cfe3dc',opacity:.18},g);return g}
  const hand=v.kind==='hand'||v.kind==='wrap',len=v.kind==='kenzan'?vH(v)-8:hand?120:0,spread=hand?40:6;
  for(let i=0;i<n;i++){const u=n>1?i/(n-1)*2-1:0,x1=bp[0]+u*spread+R(-4,4),y1=bp[1]+len*R(.9,1.05);E('path',{d:`M${f(bp[0]+u*8)},${f(bp[1]-6)}Q${f(bp[0]+u*6)},${f(bp[1]+len*.3)} ${f(x1)},${f(y1)}`,stroke:pick(['#4f7a36','#5f8a3e','#3f6a2e','#6a8a3a']),'stroke-width':f(R(2.4,3.8)),fill:'none','stroke-linecap':'butt'},g)}
  return g}
/* ribbon bow with trailing tails (hand-tied, wrap, kenzan bundle) */
function bow(par,x,y,c,long=1){const g=G(par);E('rect',{x:f(x-16),y:f(y-6),width:32,height:12,rx:3,fill:c},g);E('rect',{x:f(x-16),y:f(y-6),width:32,height:12,rx:3,fill:lin([[0,'#fff',.3],[.5,'#fff',0],[1,'#000',.2]],0,0,0,1)},g);
  for(const s of[-1,1]){E('path',{d:`M${x},${y}C${x+s*12},${y-22} ${x+s*34},${y-14} ${x+s*30},${y}C${x+s*26},${y+10} ${x+s*10},${y+6} ${x},${y}Z`,fill:c,stroke:dk(c,.25),'stroke-width':.6},g);
    E('path',{d:`M${x},${y+2}C${x+s*8},${y+40} ${x+s*(18+R(0,10))},${y+90*long} ${x+s*(10+R(0,14))},${y+150*long}`,stroke:c,'stroke-width':7,fill:'none','stroke-linecap':'butt'},g)}
  E('circle',{cx:x,cy:y,r:5,fill:dk(c,.12)},g);return g}
/* paper cone: back sheet behind the flowers, front sheet over the stems */
function wrapBack(par,bp,c){E('path',{d:`M${bp[0]-26},${bp[1]+40}L${bp[0]-170},${bp[1]-150}Q${bp[0]},${bp[1]-200} ${bp[0]+170},${bp[1]-150}L${bp[0]+26},${bp[1]+40}Z`,fill:lin([dk(c,.12),c,lt(c,.4)],0,0,1,0)},par)}
function wrapFront(par,bp,c){const g=G(par);E('path',{d:`M${bp[0]-22},${bp[1]+44}L${bp[0]-120},${bp[1]-84}Q${bp[0]-40},${bp[1]-40} ${bp[0]+10},${bp[1]-62}Q${bp[0]+70},${bp[1]-90} ${bp[0]+128},${bp[1]-70}L${bp[0]+22},${bp[1]+44}Z`,fill:lin([[0,lt(c,.3)],[.5,c],[1,dk(c,.18)]],0,0,1,0)},g);
  E('path',{d:`M${bp[0]-120},${bp[1]-84}Q${bp[0]-40},${bp[1]-40} ${bp[0]+10},${bp[1]-62}Q${bp[0]+70},${bp[1]-90} ${bp[0]+128},${bp[1]-70}`,stroke:'#fff','stroke-width':2,'stroke-opacity':.7,fill:'none'},g);
  for(let i=0;i<5;i++)E('path',{d:`M${f(bp[0]+R(-80,80))},${f(bp[1]-R(20,60))}l${f(R(-20,20))},${f(R(30,60))}`,stroke:dk(c,.25),'stroke-width':.8,'stroke-opacity':.25},g);return g}
