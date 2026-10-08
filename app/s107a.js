/* ================= Serre, lot 107 — printemps 8, poussés par le L-système : triteleia, jacinthe des bois, scille, sparaxis, ixia ================= */
/* chaque plante pousse comme le muscari et le muguet (lot 66) : une hampe, puis la grappe ou l'ombelle nœud par nœud, chaque fleur au bout de son pédicelle poussé par la tortue ;
   les pédicelles sont tirés de leurs chaînes et dessinés avec leur fleur ; les étoiles (triteleia, scille, sparaxis, ixia) sont dessinées par petits paquets triés en profondeur,
   les clochettes de la jacinthe des bois une à une ; l'ombelle de la triteleia comme l'agapanthe (reprise 2) */
const l107Up=B=>B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];
function l107U0(face,up){const U=V3s(face,V3.sc(up,V3.dot(face,up)));return V3l(U)<1e-3?[0,0,1]:U}
const l107T=(cache,c,I)=>{const q=Math.round(Math.max(0,Math.min(1,I))*14),key=c+'|'+q;return cache[key]||(cache[key]=toneAt(pal7(c),q/14))};
const l107C=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
const l107Cw=(list,o)=>o.cw||list.find(w=>w.c===o.col)||cwNear(list,o.col)||list[0];
const l107Op=o=>Math.max(.05,Math.min(1,o.op??1));

/* ---------- shared: a tepal of a star in its flower's frame (local Z the axis): its midline from the base radius rb out to R, z rising by cup (and bend, the flare), its half-width W·wp(t);
   S: n, rot, R, rb, W, wp, cup, bend, alt (the inner whorl's size), point (a sharp tip) ---------- */
function l107At(S,m,t,s){const a=S.rot+m*6.2832/S.n,c=Math.cos(a),si=Math.sin(a),k=(m%2?(S.alt||1):1)/Math.hypot(1,S.cup+(S.bend||0)*.5),r=S.rb+(S.R*k-S.rb)*t,w=S.W*k*S.wp(t)*s,z=S.R*k*(S.cup*t+(S.bend||0)*t*t)+(S.z0||0);
  return[c*r-si*w,si*r+c*w,z]}
/* its outline on the screen between t0 and t1, ws its width share (marks: a stripe, a ring) */
function l107Out(B,O,S,m,t0,t1,ws){const n=LOD?3:5,L=[],Rt=[];for(let i=0;i<=n;i++){const t=t0+(t1-t0)*i/n;L.push(PJ(B,O,l107At(S,m,t,ws)));Rt.push(PJ(B,O,l107At(S,m,t,-ws)))}
  const q=L.concat(Rt.reverse()).map(p=>[p[0],p[1]]);if(t1>=1&&S.point){const i=n;q.splice(i+1,0,q[i])}return smooth(q)}
/* the inner face of tepal m turns to the eye? (its normal r'·Z − z'·u at mid-length, in view space) */
function l107Inner(B,S,m){const a=S.rot+m*6.2832/S.n,k=(m%2?(S.alt||1):1)/Math.hypot(1,S.cup+(S.bend||0)*.5),dr=S.R*k-S.rb,dz=S.R*k*(S.cup+(S.bend||0)),n=toV(B,[-dz*Math.cos(a),-dz*Math.sin(a),dr]);return V3.nz(n)}
/* a closed bud (an ovoid along local Z from O): its outline */
function l107BudD(B,O,s,w,tp=.45){const pts=[];for(let i=0;i<=6;i++)for(let j=0;j<8;j++){const v=i/6,a=j/8*6.283,r=w*.5*Math.pow(Math.sin(Math.PI*Math.min(.98,.04+.94*v)),.6)*(1-tp*v),p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,v*s]);pts.push([p[0],p[1]])}
  return smooth(hull2(pts))}
/* ---------- a packet of flowers far to near, a few paths for the lot: pedicels, the tubes behind, the tepals seen from behind, the buds, the tepals seen inside,
   the marks (stripes, rings, eyes), the stamens and anthers, the tubes in front. Item: {B, O (the mouth), kind 'star'|'bud', S, ped (screen points), tube [len, r0, r1], bud [s, w, tp], c, cb} ---------- */
function l107Pack(par,its,cw,cache,o){let dp='',dtb='',dtf='',dout='',din='',db='',dst='',dan='',dab='',dey='';const mk={},sIn=[],sOut=[],budc=[];
  for(const it of its){if(it.ped&&it.ped.length>1)dp+=smooth(it.ped,false);const B=it.B,O=it.O,nz=B[2][2];
    if(it.kind==='bud'){db+=l107BudD(B,it.bo||O,it.bud[0],it.bud[1],it.bud[2]);budc.push(it.c);continue}
    const S=it.S;if(it.tube){const[tl,r0,r1]=it.tube,C=[PJ(B,O,[0,0,-tl]),PJ(B,O,[0,0,-tl*.45]),PJ(B,O,[0,0,S.z0||0])],Lp=[],Rp=[];
      for(let i=0;i<3;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(2,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,r=r0+(r1-r0)*i/2;Lp.push([C[i][0]-dy/l*r,C[i][1]+dx/l*r]);Rp.push([C[i][0]+dy/l*r,C[i][1]-dx/l*r])}
      const e0=C[0],e1=C[1],l=Math.hypot(e1[0]-e0[0],e1[1]-e0[1])||1,cap=[e0[0]-(e1[0]-e0[0])/l*r0*.8,e0[1]-(e1[1]-e0[1])/l*r0*.8],d=smooth([cap].concat(Lp,Rp.reverse()));if(nz>=0)dtb+=d;else dtf+=d}
    for(let m=0;m<S.n;m++){const nv=l107Inner(B,S,m),inn=nv[2]>0,d=l107Out(B,O,S,m,0,1,1);if(inn){din+=d;sIn.push(lightI(nv))}else{dout+=d;sOut.push(lightI(V3.sc(nv,-1)))}
      if(inn&&S.marks)for(const q of S.marks){mk[q.c]=(mk[q.c]||'')+l107Out(B,O,S,m,q.t0,q.t1,q.ws)}}
    if(nz>.2&&S.eye){const q=spDisc(B,O,S.eye[0],(S.z0||0)+S.R*.02,8);dey+=smooth(q)}
    if(nz>(S.st&&S.st.dot?.3:.05)&&S.st&&!LOD){const st=S.st,c=PJ(B,O,[0,0,(S.z0||0)+S.R*.03]);for(let j=0;j<st.n;j++){const a=S.rot+(j+.5)*6.2832/st.n,e=PJ(B,O,[Math.cos(a)*st.r*S.R,Math.sin(a)*st.r*S.R,(S.z0||0)+st.h*S.R]);
        if(!st.dot)dst+=`M${f(c[0])},${f(c[1])}L${f(e[0])},${f(e[1])}`;if(st.bar){const e2=PJ(B,O,[Math.cos(a)*st.r*S.R*1.5,Math.sin(a)*st.r*S.R*1.5,(S.z0||0)+st.h*S.R*1.25]);dab+=`M${f(e[0])},${f(e[1])}L${f(e2[0])},${f(e2[1])}`}else dan+=l107C(e[0],e[1],Math.max(.45,st.ar*S.R))}}}
  const av=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:.6,c=its.find(i=>i.c)?.c||cw.c,cb=its.find(i=>i.cb)?.cb||mix(c,'#d8dcc8',.25),ink=h2l(c)[2]>.85?'#8e8e7a':shd(c,-.42),tc=o.tube||mix(c,'#9ab070',.35);
  if(dp)E('path',{d:dp,stroke:o.pc,'stroke-width':f(o.pw),fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},par);
  if(dtb)E('path',{d:dtb,fill:l107T(cache,tc,.5),stroke:shd(tc,-.45),'stroke-width':.35,'stroke-opacity':.6},par);
  if(dout)E('path',{d:dout,fill:l107T(cache,cb,Math.max(.42,av(sOut)*.95)),stroke:ink,'stroke-width':.35,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
  if(db){const bc=budc[0]||c;E('path',{d:db,fill:l107T(cache,bc,.55),stroke:shd(bc,-.45),'stroke-width':.35,'stroke-opacity':.6},par)}
  if(din)E('path',{d:din,fill:l107T(cache,c,Math.min(o.imax||.7,av(sIn))),stroke:ink,'stroke-width':.35,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
  if(!LOD||o.markLod)for(const q in mk)E('path',{d:mk[q],fill:q,opacity:o.mo??.9},par);
  if(dey)E('path',{d:dey,fill:o.eye||shd(c,-.5),stroke:shd(o.eye||c,-.4),'stroke-width':.3},par);
  if(dst)E('path',{d:dst,stroke:o.stc||mix(c,'#f4f0e8',.4),'stroke-width':1.1,fill:'none','stroke-linecap':'round'},par);
  if(dan)E('path',{d:dan,fill:o.an||'#f0d040',stroke:shd(o.an||'#f0d040',-.4),'stroke-width':.3},par);
  if(dab)E('path',{d:dab,stroke:o.an||'#f0d040','stroke-width':f(Math.max(1.3,((its.find(i=>i.S)||{}).S||{R:10}).R*.09)),fill:'none','stroke-linecap':'round'},par);
  if(dtf)E('path',{d:dtf,fill:l107T(cache,tc,.58),stroke:shd(tc,-.45),'stroke-width':.35,'stroke-opacity':.6},par)}
/* ---------- the grown plant drawn: the pedicels taken out of their chains (each drawn with its flower, from its node on the axis), the flowers by packets of size chunk,
   other organs by other(og,pos); mk(og,pos,ped) gives a flower's item (or null), draw(par,items) draws a packet ---------- */
function l107Grow(k,res,apex,sc,mk,draw,o={}){const c0=res.chains[0],off=V3.sc(apex,-1),peds=new Map(),scr=p=>[p[0]+off[0],-(p[1]+off[1])];
  for(const og of res.organs){if(og.t!=='K')continue;const ch=res.chains.find(c=>c!==c0&&V3l(V3s(c.pts[c.pts.length-1],og.pos))<1e-6);if(ch){peds.set(og,ch.pts.map(scr));ch.drop=1}}
  res.chains=res.chains.filter(c=>!c.drop);
  const items=[];for(const og of res.organs){if(og.t!=='K')continue;const pos=V3.add(og.pos,off),it=mk(og,pos,peds.get(og)||null);if(it){it.og=og;it.z=it.z??pos[2];items.push(it)}}
  items.sort((a,b)=>a.z-b.z);const lead=new Map(),ch=o.chunk||4;
  for(let i=0;i<items.length;i+=ch){const grp=items.slice(i,i+ch);let z=0;for(const it of grp)z+=it.z;lead.set(grp[0].og,{z:z/grp.length,fn:par=>draw(par,grp)})}
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{if(og.t==='K'){const p=lead.get(og);return p?{parts:[p]}:null}return o.other?o.other(og,pos):null}})}
const l107Strap=(og,pos,L,wr,col,o={})=>{const pp=[];lsLeafParts(Object.assign({},og,{pos}),L,wr,col,pp,Object.assign({wp:LS_STRAP,droop:.3,arch:.05,fold:.45,face:.3,gloss:.2},o));return{ext:1,parts:pp}};

/* ---------- triplet lily (Triteleia laxa, syn. Brodiaea laxa: 'Queen Fabiola', 'Corrina', 'Rudy', 'Silver Queen', 'Aquarius'; T. ixioides 'Starlight'): a thin, wiry, leafless scape 40–60 cm,
   at its top two to four papery spathe bracts and a loose umbel of ten to twenty-five flowers on unequal pedicels 2–6 cm, spreading and curving up;
   each flower a funnel 2.5–4 cm: a narrow tube and six spreading oblong lobes, each with a darker midvein, six stamens in two rows at the mouth (anthers pale blue or white);
   they open a few at a time, the umbel holding buds, open and opening flowers together ---------- */
const L107_TRI=[{id:'queen-fabiola',n:'Bleu violet (Queen Fabiola)',c:'#5d5cc4',mid:'#33308e',bud:'#4a4290'},{id:'corrina',n:'Violet profond (Corrina)',c:'#4a3aa8',mid:'#2a1c70',bud:'#3a2a78'},
  {id:'rudy',n:'Blanc strié de violet (Rudy)',c:'#f1eff6',mid:'#5244b0',bud:'#9a94c4'},{id:'silver-queen',n:'Blanc argenté (Silver Queen)',c:'#f6f5f1',mid:'#c4c4dc',bud:'#c8ccb4'},
  {id:'aquarius',n:'Bleu ciel (Aquarius)',c:'#a9b6ea',mid:'#6a76c0',bud:'#7a84b8'},{id:'starlight',n:'Jaune pâle (ixioides Starlight)',c:'#f2e48c',mid:'#7a8a3a',bud:'#b8b868'}];
const L107_TRW=prof([[0,.45],[.2,.8],[.6,1],[.85,.82],[1,.3]]);
function l107Trit(g,t,o){const cw=l107Cw(L107_TRI,o),op=l107Op(o),D=(o.cm||10)*UPC,Rr=D/2,k=G(g),B=frameOf(o,.6,true),sc=['#2e4a22','#557a3c','#7ea060','#aec894'],up=l107Up(B),ax=B[2],U0=l107U0(ax,up),cache={};
  const n=Math.round(R(12,18)*(LOD?.75:1)),kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*.9))):1,sheet=!B.reach&&!o.rim,w=Math.max(1.6,D*.03),pw=Math.max(1.15,D*.014),bud=op<.3,fo=bud?0:op<.7?.45:.85;
  const Lf=2.8*UPC*Math.pow(D/(10*UPC),.3),mods=[['F',{l:D*(sheet?1.5:.7)*kr*(o.rim?.4:1),w0:w*1.15,w1:w,e:.006}],['F',{l:D*.22*kr,w1:w,aim:V3.nz(V3.add(up,V3.sc(ax,.45))),k:.25}],['Sp',{}]];
  for(let i=0;i<n;i++){const age=bud?R(.02,.25):rnd()<fo?R(.78,1):rnd()<.35?R(.45,.65):R(.05,.32),q=Math.sqrt((i+.5)/n),el=bud?6+16*q:14+64*q+R(-7,7),
      pl=Rr*(bud?R(.22,.32):R(.6,.95)*(age<.4?.82:1));mods.push(['[',{w:pw}],['/',{a:i*137.5+R(-14,14)}],['&',{a:el}],['F',{l:pl,w1:pw*.9,e:bud?.01:.035}],['K',{i,age}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.06,T:[0,1,0],e:.006,w:w*1.15});for(const ch of res.chains)ch.c=sc;
  const sp=res.organs.find(q=>q.t==='Sp'),apex=sp.pos;
  l107Grow(k,res,apex,sc,(og,pos,ped)=>{const a=og.p.age,Bf=frZ(og.H,up,R(0,6.28));
    if(a<.4){const s=Lf*(.55+.5*a),c=mix(cw.bud,'#7a9a52',.45-.9*a);return{kind:'bud',B:Bf,O:pos,bud:[s,s*.3,.55],c,ped}}
    const o2=Math.min(1,(a-.4)/.5),tl=Lf*.38,Rt=Lf*.62*(.8+.2*o2),S={n:6,rot:R(0,6.28),R:Rt,rb:Lf*.07,W:Rt*.26,wp:L107_TRW,cup:.55+1.6*(1-o2),bend:-.32*o2,alt:.94,z0:0,
      marks:[{t0:.08,t1:.9,ws:cw.id==='rudy'?.2:.13,c:cw.mid}],st:{n:6,r:.12,h:.16,ar:.024,dot:1}};
    return{kind:'star',B:Bf,O:V3.add(pos,V3.sc(Bf[2],tl)),S,tube:[tl,Lf*.05,Lf*.085],c:cw.c,cb:mix(cw.c,'#c8ccd8',.3),ped}},
    (par,its)=>l107Pack(par,its,cw,cache,{pc:sc[1],pw,an:h2l(cw.c)[2]>.8?'#9aa0d0':'#d8dcf0',tube:mix(cw.c,'#8aa070',.18)}),
    {chunk:3,other:(og,pos)=>{if(og.t!=='Sp')return null;const Bs=lsFrame(og,null,0),it=[];
      for(let j=0;j<3;j++)it.push({l:ligule(Bs,pos,{phi:j*2.1+R(-.3,.3),r0:w*.4,z0:-w*.3,L:Lf*R(.3,.45),W:Lf*.07,wp:prof([[0,.8],[.5,1],[1,.05]]),a0:bud?.3:2.3,a1:bud?.2:2.7,tip:'point',th:1}),c:'#c8c4a0',ink:'#8a7a5a'});
      return{parts:[{z:pos[2]-.2,fn:par=>drawLig(par,it)}]}}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- bluebell (Hyacinthoides non-scripta, the English bluebell; H. hispanica, the Spanish bluebell 'Excelsior', 'White City', 'Queen of the Pinks'): a fleshy leafless scape;
   non-scripta: its raceme bends over at the tip, six to twelve narrow tubular bells hang all to one side, their six tepals curled back at the mouth, the anthers cream;
   hispanica: the scape stiff and upright, ten to fifteen broader, more open bells hang all round it, hardly recurved, the anthers blue; each bell on a short pedicel with two
   bluish bracteoles; they open from the bottom up, the top ones green-blue buds ---------- */
const L107_HYA=[{id:'bleu-anglais',n:'Bleu violet (non-scripta)',c:'#4c4cb6',fm:'ns'},{id:'bleu',n:'Bleu (hispanica Excelsior)',c:'#6476d2',fm:'hi'},
  {id:'bleu-pale',n:'Bleu porcelaine (hispanica Blue Queen)',c:'#9cb0e8',fm:'hi'},{id:'blanc',n:'Blanc (hispanica White City)',c:'#f6f5ee',fm:'hi'},
  {id:'rose',n:'Rose (hispanica Queen of the Pinks)',c:'#e4a8c8',fm:'hi'},{id:'blanc-anglais',n:'Blanc (non-scripta Alba)',c:'#f7f6f0',fm:'ns'}];
/* one bell in its frame (local Z its mouth, hanging), L long, a open (0 bud … 1); hi: broader, flaring, hardly curled */
function l107Bell(par,B,O,L,cw,a,cache,hi){const c=cw.c,nz=B[2][2],ink=h2l(c)[2]>.85?'#8e8e7a':shd(c,-.42);
  if(a<.35){const s=L*(.6+.4*a/.35);E('path',{d:l107BudD(B,O,s,s*(hi?.42:.34),.35),fill:l107T(cache,mix(c,'#6a9a6a',.5-1.2*a),.55),stroke:ink,'stroke-width':.35,'stroke-opacity':.55},par);return}
  const o2=Math.min(1,(a-.35)/.65),Rb=L*(hi?.27:.2),zr=L*.86,rot=(O[0]*.37+O[1]*.11)%6.283,body=[];
  for(let i=0;i<=6;i++){const v=i/6,r=Rb*(.62+.38*Math.pow(v,hi?.7:1.4))*Math.pow(Math.sin(Math.min(1,v/.18)*Math.PI/2),.5),z=v*zr;for(let j=0;j<10;j++){const an=j/10*6.283,p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,z]);body.push([p[0],p[1]])}}
  /* the mouth: six lobes flaring out, their tips curled back (non-scripta) or spreading (hispanica) */
  const fl=hi?.55:.75,rc=hi?.05:.16,lob=[];for(let m=0;m<6;m++){const a0=rot+m*1.0472,pt=(an,r,z)=>{const p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,z]);return[p[0],p[1]]};
    lob.push(pt(a0-.42,Rb*.96,zr-L*.02),pt(a0-.2,Rb*(1+fl*.6*o2),zr+L*.07),pt(a0,Rb*(1+fl*o2),zr+L*(.1-rc*o2)),pt(a0,Rb*(1+fl*o2),zr+L*(.1-rc*o2)),pt(a0+.2,Rb*(1+fl*.6*o2),zr+L*.07))}
  const I=lightI(V3.nz(V3.add(B[2],[-.25,.45,.5]))),Ib=lightI(V3.nz(V3.add(V3.sc(B[2],-1),[-.2,.5,.6])));
  const rim=()=>{E('path',{d:smooth(lob),fill:l107T(cache,c,nz>.1?.66:.58),stroke:ink,'stroke-width':.35,'stroke-opacity':.55,'stroke-linejoin':'round'},par);
    if(nz>.15&&!LOD){E('path',{d:smooth(spDisc(B,O,Rb*.78,zr*.97,10)),fill:shd(c,-.3)},par);if(nz>.35){let d='';for(let j=0;j<3;j++){const an=rot+j*2.09,s=PJ(B,O,[Math.cos(an)*Rb*.3,Math.sin(an)*Rb*.3,zr*.9]);d+=l107C(s[0],s[1],Math.max(.6,Rb*.14))}
      E('path',{d,fill:hi?'#5a6ab8':'#ece4c4'},par)}}};
  if(nz<-.1)rim();E('path',{d:smooth(hull2(body)),fill:l107T(cache,c,Math.max(.5,Ib*.5+I*.5)),stroke:ink,'stroke-width':.35,'stroke-opacity':.55},par);
  if(!LOD){const q=[];for(let i=1;i<=5;i++){const v=i/6,p=PJ(B,O,[Math.cos(rot+.52)*Rb*.7,Math.sin(rot+.52)*Rb*.7,v*zr]);q.push([p[0],p[1]])}E('path',{d:smooth(q,false),stroke:shd(c,-.2),'stroke-width':1.05,'stroke-opacity':.45,fill:'none'},par)}
  if(nz>=-.1)rim()}
function l107Hya(g,t,o){const cw=l107Cw(L107_HYA,o),op=l107Op(o),ns=cw.fm==='ns',D=(o.cm||12)*UPC,k=G(g),sc=['#2e4a2a','#5a8a48','#88b070','#b8d4a0'],cache={};
  const B=frameOf(o,.3,true),up=l107Up(B),face=B[2],U0=l107U0(face,up),sheet=!B.reach&&!o.rim,n=Math.round(ns?R(7,11):R(9,13)),nOpen=Math.round(n*(op<.3?0:op<.7?.45:.8)),
    kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.4))):1,w=Math.max(1.6,D*.03),li=D/n,Lb=(ns?1.7:1.9)*UPC*Math.pow(D/(12*UPC),.3),ph0=R(0,360),dn=V3.sc(up,-1),pw=Math.max(1.1,w*.5),Un=V3.nz(U0),th=R(0,6.283),lean=V3.nz(V3.add(V3.sc(up,.8),V3.sc(V3.add(V3.sc(Un,Math.cos(th)),V3.sc(V3.cr(up,Un),Math.sin(th))),.6)));
  /* S: the scape (two strap leaves at its foot on a sheet), then the raceme: non-scripta leans and arches over, its bells to one side; hispanica stands, its bells all round */
  const rules={S:()=>{const out=[];if(sheet)for(let j=0;j<2;j++)out.push(['[',{}],['/',{a:ph0+j*160+R(-15,15)}],['&',{a:R(10,18)}],['Lv',{j}],[']',{}]);
      out.push(['F',{l:D*(o.rim?.25:sheet?1.5:1.1)*kr,w0:w*1.2,w1:w*1.05,e:.004}]);if(ns)out.push(['F',{l:D*.22*kr,w1:w,aim:lean,k:.09}]);out.push(['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*.5,w1:Math.max(1.1,w*.4),e:ns?-.06:.004}]];const q=p.i/(n-1);
      return[['F',{l:li*R(.9,1.1)*(1-.3*q),w1:Math.max(1.15,w*(1-.5*q)),e:ns?-.05-.1*q:.004}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:pw}],['/',{a:ns?(p.i%2?32:-32)+R(-10,10):ph0+p.i*137.5}],['&',{a:(ns?50:62)+R(-8,8)}],
        ['F',{l:Lb*(ns?.5:.62)*(1-.3*q)*R(.9,1.1),w1:pw*.9,e:-.3}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.008,seg:D*.05,T:[0,1,0],e:.004,w:w*1.2});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos;
  l107Grow(k,res,apex,sc,(og,pos,ped)=>{const i=og.p.i,a=i<nOpen?Math.min(1,.62+.38*(1-i/Math.max(1,nOpen))+(op>.9?.2:0)):Math.max(0,.3-.3*(i-nOpen)/Math.max(1,n-nOpen)),s=Lb*(1-.25*og.p.q)*(a<.35?.75:1),
      ax=V3.nz(V3.add(V3.sc(og.H,ns?.4:.75),dn)),Bf=frZ(ax,og.H,0),c=V3.add(pos,V3.sc(ax,-s*.04));return{kind:'bell',B:Bf,O:c,s,a,ped,z:c[2]+ax[2]*s*.4}},
    (par,its)=>{for(const it of its){if(it.ped)E('path',{d:smooth(it.ped,false),stroke:sc[1],'stroke-width':f(pw),fill:'none','stroke-linecap':'round'},par);l107Bell(par,it.B,it.O,it.s,cw,it.a,cache,!ns)}},
    {chunk:1,other:(og,pos)=>og.t==='Lv'?l107Strap(og,pos,D*R(1.8,2.3),.07,'#4c7a3a',{droop:.35,fold:.5}):null});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- squill (Scilla siberica 'Spring Beauty', 'Alba'; S. mischtschenkoana 'Tubergeniana'; S. peruviana and its white form): siberica: a slender reddish scape 10–20 cm,
   two to five nodding flowers near its top, bell-shaped stars 1.5 cm, the tepals deep blue with a darker midvein, blue anthers;
   peruviana: a stout scape 20–30 cm and a dense broad cone of fifty to a hundred flat stars 2 cm, violet-blue, on pedicels long at the foot (spreading) and short at the top,
   the buds packed in a dark cone at its apex; blue filaments and yellow anthers ---------- */
const L107_SCI=[{id:'peruviana',n:'Bleu violet (peruviana)',c:'#4a4ec6',fm:'pe',bud:'#2e2e7a'},{id:'peruviana-blanc',n:'Blanc (peruviana Alba)',c:'#f4f3ec',fm:'pe',bud:'#c8d0a8'},
  {id:'peruviana-lilas',n:'Bleu lilas (peruviana Lilacina)',c:'#9a8ed6',fm:'pe',bud:'#6a5ea8'},{id:'siberica',n:'Bleu gentiane (siberica Spring Beauty)',c:'#2f4cd0',fm:'si',mid:'#1a2a8a',bud:'#2a3a8a'},
  {id:'siberica-blanc',n:'Blanc (siberica Alba)',c:'#f6f6f2',fm:'si',mid:'#d8dcd0',bud:'#c8d0b0'},{id:'tubergeniana',n:'Bleu pâle strié (mischtschenkoana Tubergeniana)',c:'#c8d4f2',fm:'si',mid:'#6a82cc',bud:'#8a9ac8'}];
const L107_SCW=prof([[0,.4],[.25,.85],[.6,1],[.88,.65],[1,.06]]);
function l107Scille(g,t,o){const cw=l107Cw(L107_SCI,o),op=l107Op(o),pe=cw.fm==='pe',D=(o.cm||10)*UPC*(pe?1:.42),k=G(g),cache={},B=frameOf(o,pe?.5:.3,true),up=l107Up(B),face=B[2],U0=l107U0(face,up),
    sc=pe?['#2e4a24','#4e7438','#76a052','#a8c886']:['#3e3a2c','#6a5e44','#8e8a62','#b8b08a'],sheet=!B.reach&&!o.rim,ph0=R(0,360);
  const n=pe?Math.round(R(40,52)*(LOD?.6:1)):Math.round(R(3,5)),nOpen=Math.round(n*(op<.3?0:op<.7?.45:.78)),w=pe?Math.max(2.4,D*.05):Math.max(1.4,D*.04),pw=pe?Math.max(1.1,D*.012):1.1,
    Dm=(pe?2.1:1.5)*UPC*Math.pow(D/((pe?10:4.2)*UPC),.25),Lr=pe?D*.85:D*.55,li=Lr/n,kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*(pe?.9:2)))):1;
  const rules={S:()=>{const out=[];if(sheet)for(let j=0;j<2;j++)out.push(['[',{}],['/',{a:ph0+j*150+R(-15,15)}],['&',{a:R(10,18)}],['Lv',{j}],[']',{}]);
      out.push(['F',{l:D*(o.rim?.3:sheet?(pe?1.3:2.4):(pe?.8:1.6))*kr,w0:w*1.2,w1:w*1.05,e:.004}]);if(!pe)out.push(['&',{a:R(6,14)}]);out.push(['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*(pe?.4:.15),w1:Math.max(1.1,w*.35)}]];const q=p.i/(n-1),open=p.i<nOpen;
      /* peruviana: the lower pedicels long and spreading, curving up; the top ones short and erect round the cone of buds; siberica: short arched pedicels, the flowers nodding */
      const pl=pe?(op<.3?D*(.04+.1*(1-q)):D*(.05+.36*Math.pow(1-q,1.3))*(open?1:.75)):Dm*R(.4,.55),el=pe?(op<.3?20-12*q:open?66-30*q:34-20*q)+R(-6,6):R(42,58);
      return[['F',{l:li*R(.85,1.15)*(pe?1-.5*q:1),w1:Math.max(1.15,w*(1-.55*q)),e:.004}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:pw}],['/',{a:ph0+p.i*137.5+R(-10,10)}],['&',{a:el}],
        ['F',{l:pl*R(.9,1.1),w1:pw*.9,e:pe?.015:-.16}],['K',{i:p.i,q}],[']',{}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:pe?.006:.015,seg:pe?D*.04:D*.06,T:[0,1,0],e:.004,w:w*1.2});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos,dn=V3.sc(up,-1);
  l107Grow(k,res,apex,sc,(og,pos,ped)=>{const i=og.p.i,q=og.p.q,a=i<nOpen?Math.min(1,.7+.3*(1-i/Math.max(1,nOpen))):Math.max(0,.32-.32*(i-nOpen)/Math.max(1,n-nOpen));
      const ax=pe?V3.nz(V3.add(og.H,V3.sc(up,.2))):V3.nz(V3.add(V3.sc(og.H,.5),dn)),Bf=frZ(ax,og.H,R(0,6.28));
      if(a<.4){const s=Dm*(pe?.32+.1*a:.42+.15*a)*(pe?1-.35*q:1);return{kind:'bud',B:Bf,O:pos,bud:[s,s*(pe?.62:.5),.4],c:mix(cw.bud,'#6a8a5a',.25-.5*a),ped}}
      const o2=Math.min(1,(a-.4)/.5),Rt=Dm/2*(.75+.25*o2),S={n:6,rot:R(0,6.28),R:Rt,rb:Rt*.08,W:Rt*.2,wp:L107_SCW,cup:pe?.12+1.4*(1-o2):.85+1.2*(1-o2),bend:pe?-.04:-.38*o2,alt:.95,point:1,z0:0,
        marks:cw.mid?[{t0:.05,t1:.85,ws:.16,c:cw.mid}]:null,eye:[Rt*.12],st:{n:6,r:pe?.22:.2,h:pe?.2:.3,ar:pe?.03:.045,dot:!pe||Dm<12}};
      return{kind:'star',B:Bf,O:V3.add(pos,V3.sc(ax,Rt*.06)),S,c:cw.c,cb:mix(cw.c,'#d0d4dc',.3),ped}},
    (par,its)=>l107Pack(par,its,cw,cache,{pc:sc[1],pw,an:pe?'#f2d23a':cw.id==='siberica'?'#3a4ab0':'#7a86c8',eye:pe?shd(cw.c,-.55):mix(cw.c,'#2a3a7a',.4),stc:pe?mix(cw.c,'#c8ccf0',.3):null}),
    {chunk:pe?5:1,other:(og,pos)=>og.t==='Lv'?l107Strap(og,pos,D*(pe?R(1.6,2):R(2.5,3.2)),pe?.1:.08,pe?'#4a7a38':'#4a6e3a',{droop:.3,fold:pe?.55:.45}):null});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- harlequin flower (Sparaxis tricolor and its hybrids; Iridaceae): a wiry stem 30–40 cm, a loose spike of two to six flowers, each held out of two
   papery, deeply torn bracts streaked brown; the flower a flat star 4–6 cm, six obovate tepals in bright colours, the centre yellow ringed with black (purple on the pale ones)
   in arrow-shaped marks, three stamens with dark anthers round a pale three-branched style; the lowest open first, the top one in bud ---------- */
const L107_SPX=[{id:'orange',n:'Orange à cœur jaune cerclé de noir',c:'#f0662a',ring:'#24161a',eye:'#f2c41c'},{id:'rouge',n:'Rouge à cœur jaune cerclé de noir',c:'#c8202e',ring:'#1e1216',eye:'#f2c41c'},
  {id:'rose',n:'Rose vif à cœur jaune',c:'#e66a9e',ring:'#3a1428',eye:'#f2c41c'},{id:'blanc',n:'Blanc crème à cœur jaune cerclé de pourpre',c:'#f6f0de',ring:'#5a1a44',eye:'#f2c830'},
  {id:'jaune',n:'Jaune à cœur cerclé de noir',c:'#f4d02a',ring:'#22161a',eye:'#f6e070'},{id:'pourpre',n:'Pourpre à cœur jaune',c:'#82287e',ring:'#1e0e1c',eye:'#f2c41c'},
  {id:'saumon',n:'Saumon à cœur jaune cerclé de noir',c:'#f49470',ring:'#2a1614',eye:'#f2c41c'}];
const L107_SPW=prof([[0,.3],[.25,.66],[.6,.98],[.82,1],[.95,.78],[1,.35]]);
function l107Spx(g,t,o){const cw=l107Cw(L107_SPX,o),op=l107Op(o),Dm=(o.cm||5)*UPC,k=G(g),cache={},B=frameOf(o,.4,true),up=l107Up(B),face=B[2],U0=l107U0(face,up),
    sc=['#2c4a1e','#4a7432','#78a04e','#aacb84'],sheet=!B.reach&&!o.rim,n=Math.round(R(3,5)),nOpen=Math.max(op<.3?0:1,Math.round(n*(op<.3?0:op<.7?.4:.7))),w=Math.max(1.5,Dm*.045),
    li=Dm*.55,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(Dm*2.5))):1,sd=rnd()<.5?1:-1;
  /* the stem, one sheathing leaf on a sheet; then the spike: at each node the rachis turns a little away from its flower, the flowers alternate and face up and out */
  const rules={S:()=>{const out=[];if(sheet)out.push(['[',{}],['/',{a:R(0,360)}],['&',{a:R(8,14)}],['Lv',{}],[']',{}]);out.push(['F',{l:Dm*(o.rim?.4:sheet?4:2.2)*kr,w0:w*1.15,w1:w,e:.006}],['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*.35,w1:Math.max(1.1,w*.6)}]];const q=p.i/(n-1),side=p.i%2?1:-1;
      return[['F',{l:li*R(.85,1.15)*(1-.25*q),w1:Math.max(1.15,w*(1-.3*q)),e:.01}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:w*.7}],['/',{a:side*90+R(-15,15)}],['&',{a:38+R(-6,6)}],['F',{l:Dm*.07,w1:w*.6}],['K',{i:p.i,q,side}],[']',{}],
        ['Br',{i:p.i,side}],['+',{a:side*R(7,11)+sd*3}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.01,seg:Dm*.12,T:[0,1,0],e:.006,w:w*1.15});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos;
  l107Grow(k,res,apex,sc,(og,pos,ped)=>{const i=og.p.i,a=i<nOpen?Math.min(1,.75+.25*(1-i/Math.max(1,nOpen))):Math.max(0,.35-.3*(i-nOpen)/Math.max(1,n-nOpen)),
      ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.5),V3.sc(up,.35)),V3.sc(face,.75))),Bf=frZ(ax,up,R(0,6.28));
    if(a<.42){const s=Dm*(.36+.25*a/.42)*(1-.2*og.p.q);return{kind:'bud',B:Bf,O:V3.add(pos,V3.sc(ax,-Dm*.03)),bud:[s,s*.36,.62],c:mix(cw.c,'#7a8a4a',.55-.9*a),ped}}
    const o2=Math.min(1,(a-.42)/.45),Rt=Dm/2*(.8+.2*o2)*(1-.12*og.p.q),S={n:6,rot:R(0,6.28),R:Rt,rb:Rt*.06,W:Rt*.27,wp:L107_SPW,cup:.12+1.1*(1-o2),bend:-.05,alt:.95,z0:0,
      marks:[{t0:.18,t1:.47,ws:.78,c:cw.ring},{t0:0,t1:.3,ws:1.03,c:cw.eye}],st:{n:3,r:.12,h:.22,ar:.04,bar:1}};
    return{kind:'star',B:Bf,O:V3.add(pos,V3.sc(ax,Dm*.14)),S,tube:[Dm*.16,Dm*.04,Dm*.06],c:cw.c,cb:mix(cw.c,'#d8d4c0',.25),ped,z:pos[2]+Dm*.3}},
    (par,its)=>l107Pack(par,its,cw,cache,{pc:sc[1],pw:Math.max(1.1,w*.6),an:'#4a2a4a',stc:'#e8d070',tube:'#8aa858',mo:1,markLod:1}),
    {chunk:1,other:(og,pos)=>{if(og.t==='Lv')return l107Strap(og,pos,Dm*R(3,3.8),.09,'#4c7a34',{droop:.18,fold:.5,arch:.04});if(og.t!=='Br')return null;
      /* the two papery bracts at the node, torn at their tips, streaked brown */
      const Bn=lsFrame(og,null,0),it=[];for(const s of[-1,1])it.push({l:ligule(Bn,pos,{phi:(og.p.side>0?0:3.14)+s*.5,r0:w*.3,z0:-Dm*.02,L:Dm*R(.2,.26)*(s>0?1:.8),W:Dm*.06,wp:prof([[0,.9],[.5,1],[.85,.6],[1,.15]]),a0:.25,a1:.5,tip:'point',th:1.6}),
        c:'#d8d0b0',ink:'#8a6a4a',mid:'#a07850',mw:1.05});return{parts:[{z:pos[2]-Dm*.05,fn:par=>drawLig(par,it)}]}}});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- corn lily (Ixia hybrids: 'Panorama', 'Giant', 'Mabel', 'Yellow Emperor', 'Rose Emperor', 'Castor'; I. viridiflora): a stiff wiry stem 40–60 cm,
   a slender spike of eight to twenty flowers, each sessile in two small membranous bracts, a thin tube opening into a star 3 cm of six pointed elliptic tepals,
   the centre dark (purple, crimson or black: the turquoise viridiflora's eye almost black), three stamens; they open from the base, the buds slender, along the tip ---------- */
const L107_IXI=[{id:'blanc',n:'Blanc à cœur pourpre (Panorama)',c:'#f6f0e2',eye:'#5a1e44'},{id:'creme',n:'Crème à cœur pourpre (Giant)',c:'#f2e6c8',eye:'#6a1a48'},
  {id:'rose-vif',n:'Rose cerise (Mabel)',c:'#e0457e',eye:'#6a1236'},{id:'rose',n:'Rose tendre (Rose Emperor)',c:'#f2b4c4',eye:'#a8306a'},
  {id:'jaune',n:'Jaune à cœur brun (Yellow Emperor)',c:'#f2df58',eye:'#5a2a1a'},{id:'rouge',n:'Rouge carmin (Castor)',c:'#c4203e',eye:'#3a0a16'},
  {id:'orange',n:'Orange (Hogarth)',c:'#f2943a',eye:'#7a2a14'},{id:'viridiflora',n:'Bleu-vert à œil noir (viridiflora)',c:'#6fc8bc',eye:'#1c1426',ring:'#3a2a5a'}];
const L107_IXW=prof([[0,.35],[.3,.85],[.6,1],[.85,.7],[1,.08]]);
function l107Ixia(g,t,o){const cw=l107Cw(L107_IXI,o),op=l107Op(o),D=(o.cm||12)*UPC,k=G(g),cache={},B=frameOf(o,.3,true),up=l107Up(B),face=B[2],U0=l107U0(face,up),
    sc=['#2c4a1e','#4a7432','#78a04e','#aacb84'],sheet=!B.reach&&!o.rim,n=Math.round(R(10,14)*(LOD?.8:1)),nOpen=Math.round(n*(op<.3?0:op<.7?.35:.6)),w=Math.max(1.5,D*.022),
    Dm=3*UPC*Math.pow(D/(12*UPC),.2),li=D/n,kr=B.reach?Math.min(1,Math.max(.12,B.reach*.4/(D*1.6))):1,ph0=R(0,360),bend=rnd()<.5?1:-1;
  const rules={S:()=>[['F',{l:D*(o.rim?.25:sheet?1.4:1.1)*kr,w0:w*1.2,w1:w*1.05,e:.004}],['A',{i:0}]],
    A:p=>{if(p.i>=n)return[['F',{l:li*.5,w1:Math.max(1.1,w*.45)}]];const q=p.i/(n-1);
      /* the flowers in a loose spiral; the tip of the spike leans a little */
      return[['F',{l:li*R(.85,1.15)*(1-.35*q),w1:Math.max(1.15,w*(1-.45*q)),e:.004}],p.i?['Nd',{i:p.i}]:['N0',{}],['[',{w:Math.max(1.1,w*.55)}],['/',{a:ph0+p.i*150+R(-15,15)}],['&',{a:42+R(-6,6)}],
        ['F',{l:Dm*.06,w1:Math.max(1.1,w*.5)}],['K',{i:p.i,q}],[']',{}],q>.5?['+',{a:bend*R(2,4)}]:['/',{a:0}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.006,seg:D*.05,T:[0,1,0],e:.004,w:w*1.2});for(const ch of res.chains)ch.c=sc;
  const apex=res.organs.find(q=>q.t==='N0').pos;
  l107Grow(k,res,apex,sc,(og,pos,ped)=>{const i=og.p.i,q=og.p.q,a=i<nOpen?Math.min(1,.72+.28*(1-i/Math.max(1,nOpen))):Math.max(0,.36-.36*(i-nOpen)/Math.max(1,n-nOpen)),
      ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.5),V3.sc(up,.3)),V3.sc(face,.65))),Bf=frZ(ax,up,R(0,6.28));
    if(a<.42){const bx=V3.nz(V3.add(og.H,V3.sc(up,1.2))),Bb=frZ(bx,up,0),s=Dm*(.42+.3*a/.42)*(1-.35*q);return{kind:'bud',B:Bb,O:V3.add(pos,V3.sc(bx,-Dm*.02)),bud:[s,s*.2,.6],c:mix(cw.c,'#7a9a52',.45-.7*a),ped}}
    const o2=Math.min(1,(a-.42)/.45),Rt=Dm/2*(.8+.2*o2),S={n:6,rot:R(0,6.28),R:Rt,rb:Rt*.06,W:Rt*.24,wp:L107_IXW,cup:.1+1.2*(1-o2),bend:-.04,alt:.96,point:1,z0:0,
      marks:cw.ring?[{t0:0,t1:.34,ws:1.02,c:cw.ring},{t0:0,t1:.24,ws:1.03,c:cw.eye}]:[{t0:0,t1:.26,ws:1.03,c:cw.eye}],st:{n:3,r:.26,h:.3,ar:.035}};
    return{kind:'star',B:Bf,O:V3.add(pos,V3.sc(ax,Dm*.12)),S,tube:[Dm*.14,Dm*.035,Dm*.05],c:cw.c,cb:mix(cw.c,'#d8d4c0',.25),ped}},
    (par,its)=>l107Pack(par,its,cw,cache,{pc:sc[1],pw:Math.max(1.1,w*.55),an:'#e8d070',stc:mix(cw.c,'#f4f0e0',.5),tube:mix(cw.c,'#9ab060',.45),mo:1,markLod:1}),
    {chunk:2});
  open(k,t,1000,4,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'triteleia':l107Trit,'jacinthe-des-bois':l107Hya,'scille':l107Scille,'sparaxis':l107Spx,'ixia':l107Ixia});
Object.assign(CWS,{'triteleia':L107_TRI,'jacinthe-des-bois':L107_HYA,'scille':L107_SCI,'sparaxis':L107_SPX,'ixia':L107_IXI});
Object.assign(SZG,{'triteleia':[8,9,10,11,12],'jacinthe-des-bois':[8,10,12,14,15],'scille':[6,8,10,11,12],'sparaxis':[4,4.5,5,5.5,6],'ixia':[8,10,12,13,15]});
Object.assign(GHI,{'triteleia':{form:'sphere',size:2,k:'head',rk:.9},'jacinthe-des-bois':{form:'grappe',size:1.8,k:'head',rk:.6},'scille':{form:'grappe',size:1.6,k:'head',rk:.7},
  'sparaxis':{form:'etoile',size:1.8,k:'head',rk:.8},'ixia':{form:'grappe',size:1.8,k:'head',rk:.6}});
for(const id of['triteleia','jacinthe-des-bois','scille','sparaxis','ixia'])GH_BUDS.add(id);
