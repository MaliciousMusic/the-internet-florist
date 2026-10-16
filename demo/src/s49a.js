/* ================= Serre, lot 49 — grands bulbes, poussés par le L-système : amaryllis (Hippeastrum), amaryllis belladone, lis longiflorum et trompette, tubéreuse, pavot d'Islande ================= */
/* les trompettes (hippeastrum, belladone, longiflorum) partagent un dessin : six tépales en ligules, la gorge teintée, les étamines déclinées ; les ombelles poussent comme celles de la reprise 2 et du cyrtanthus (lot 41),
   le lis comme les grappes de la reprise 2, la tubéreuse comme les épis de la reprise 5 (spGrow), le pavot comme une hampe nue qui se redresse */
const l49Q=p=>[p[0],-p[1]],l49C=(x,y,r)=>`M${f(x-r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* a frame whose face looks along Z, its top toward Yh */
function l49Fr(Z,Yh,roll=0){Z=V3.nz(Z);let Y=V3s(Yh,V3.sc(Z,V3.dot(Yh,Z)));if(V3l(Y)<1e-4){Y=Math.abs(Z[1])<.9?[0,1,0]:[0,0,1];Y=V3s(Y,V3.sc(Z,V3.dot(Y,Z)))}Y=V3.nz(Y);const X=V3.cr(Y,Z),c=Math.cos(roll),s=Math.sin(roll);
  return[V3.add(V3.sc(X,c),V3.sc(Y,s)),V3.add(V3.sc(Y,c),V3.sc(X,-s)),Z]}
const l49T=(cache,c,I)=>{const q=Math.round(Math.max(0,Math.min(1,I))*14),k=c+'|'+q;return cache[k]||(cache[k]=toneAt(pal7(c),q/14))};
/* the up of a head and the front turned square to it */
function l49Up(B){const up=B.upV?V3.nz([B.upV[0],B.upV[1],B.upV[2]||0]):[0,1,0];let U0=V3s(B[2],V3.sc(up,V3.dot(B[2],up)));if(V3l(U0)<1e-3)U0=[0,0,1];return{up,U0:V3.nz(U0)}}
/* petals far to near (as spPetals), with their painted marks: throat (basec, bf), flushed tips (tipc, tf), picotee (edgec), a broad central band (band), fine veins (vein) */
function l49Pet(k,items,cache){const zz=it=>it.l?it.l.z:it.z;items.sort((a,b)=>zz(a)-zz(b));
  for(const it of items){if(!it.l){it.fn(k);continue}const l=it.l,back=l.nm[2]<0,cc=back?(it.cb||mix(it.c,'#e8e4d8',.2)):it.c,I0=lightI(back?V3.sc(l.nm,-1):l.nm),I=(it.lift??.15)+(1-(it.lift??.15))*Math.max(0,I0),
      lite=h2l(cc)[2]>.82,d=smooth(l.out),nr=l.S.length-1;
    E('path',{d,fill:l49T(cache,cc,I),stroke:lite?shd(cc,-.5):shd(cc,-.42),'stroke-width':.4,'stroke-opacity':lite?.6:.5,'stroke-linejoin':'round'},k);if(LOD)continue;
    const half=(i0)=>l.out.slice(i0,l.out.length-i0),base=(fr)=>{const i1=Math.max(1,Math.round(nr*fr));return l.out.slice(0,i1+1).concat(l.out.slice(l.out.length-(i1+1)))},spine=(a,b)=>l.S.slice(Math.round(nr*a),Math.round(nr*b)+1);
    if(it.tipc){const q=half(Math.round(nr*(it.tf||.55)));if(q.length>3)E('path',{d:smooth(q),fill:it.tipc,opacity:back?.35:it.to??.5},k)}
    if(back){if(it.bvein){const q=spine(.05,.95).map(r=>[r[2][0],r[2][1]]);E('path',{d:smooth(q,false),stroke:it.bvein,'stroke-width':f(it.bw||1),'stroke-opacity':.5,fill:'none','stroke-linecap':'round'},k)}continue}
    if(it.band){const q=spine(.04,.9),L=q.map(r=>[(r[1][0]+r[2][0])/2,(r[1][1]+r[2][1])/2]),Rr=q.map(r=>[(r[3][0]+r[2][0])/2,(r[3][1]+r[2][1])/2]);E('path',{d:smooth(L.concat(Rr.reverse())),fill:it.band,opacity:.85},k)}
    if(it.basec)E('path',{d:smooth(base(it.bf||.35)),fill:it.basec,opacity:it.bo??.8},k);
    if(it.vein){let vd='';for(const j of[1,2,3]){const q=spine(.06,.85).map(r=>[r[j][0],r[j][1]]);vd+=smooth(q,false)}E('path',{d:vd,stroke:it.vein,'stroke-width':f(it.vw||.6),'stroke-opacity':it.vo??.5,fill:'none','stroke-linecap':'round'},k)}
    if(it.edgec){const q=half(Math.round(nr*.25));E('path',{d:smooth(q,false),stroke:it.edgec,'stroke-width':f(it.ew||1.1),'stroke-opacity':.9,fill:'none','stroke-linejoin':'round','stroke-linecap':'round'},k)}}}

/* a light lance leaf drawn on the screen at (x,y) along ang: the blade (its width foreshortened by face), its shaded half, the midrib; three paths */
function l49Leaf(par,x,y,ang,len,w,col,face=.7,arch=.12){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),W=len*w*.5*Math.max(.25,face),A=[],Bq=[],M=[];
  for(let i=0;i<=8;i++){const v=i/8,wv=W*LS_LANCE(v),cy=-len*arch*Math.sin(Math.PI*v)*(1-face*.5);A.push([v*len,cy-wv]);Bq.push([v*len,cy+wv]);M.push([v*len,cy+wv*.08])}
  E('path',{d:smooth(A.concat(Bq.slice().reverse())),fill:P.b,stroke:P.d2,'stroke-width':.4,'stroke-opacity':.6},g);if(LOD)return g;
  E('path',{d:smooth(M.concat(Bq.slice().reverse())),fill:P.d1,opacity:.55},g);E('path',{d:smooth(M.slice(0,8),false),stroke:P.l1,'stroke-width':f(Math.max(.5,len*.01)),'stroke-opacity':.55,fill:'none'},g);return g}
/* ---------- the trumpet shared by the amaryllis and the trumpet lilies: six tepals (outer three broader), joined in a short throat, spreading from a0 to a1 (radians off the axis) as op grows;
   the stamens and the style come out of the throat, declinate (bending down, then up at their ends) ; the ovary behind, where the pedicel joins. K: L, Wo, Wi (×D), a0, a1, pw, th (roll toward the face), wav ---------- */
const L49_TEP=prof([[0,.3],[.15,.62],[.45,1],[.72,.88],[.9,.42],[1,.01]]),L49_TEPL=prof([[0,.22],[.35,.5],[.65,.92],[.82,1],[.94,.5],[1,.01]]),L49_SPA=prof([[0,.8],[.35,1],[.7,.62],[1,.04]]);
function l49Trumpet(par,B,O,D,cw,op,K,cache){const k=G(par),o2=sm01((op-.25)/.75),it=[],rot=(O[0]*.13+O[1]*.07)%1*.5,dn=V3s(toV(B,[0,-1,0]),[0,0,0]);
  const rows=cw.dbl?[[0,1,0],[1,.86,.52],[2,.7,.26]]:[[0,1,0]];
  for(const[li,sc,ph1]of rows)for(let j=0;j<6;j++){const inner=j%2,low=Math.abs(Math.sin(rot+j*1.0472+ph1))>.9&&Math.sin(rot+j*1.0472+ph1)<0,phi=rot+j*1.0472+ph1+1.5708,
      a0=(K.a0-.08*li)*(.25+.75*o2),a1=(K.a1-.25*li)*(.3+.7*o2),W=D*(inner?K.Wi:K.Wo)*sc*(low&&K.zyg?.82:1)*(.8+.2*o2),L=D*K.L*sc*(inner?.97:1)*(.82+.18*o2);
    const l=ligule(B,O,{phi,r0:D*(K.r0||.03),z0:(inner?D*.01:0)+li*D*.05,L,W,wp:K.wp||L49_TEP,a0,a1,pw:K.pw,th:(K.th??.5)*(1-.4*li),thp:t=>1-.7*t,tip:'round',n:DET>=1.5?9:7,tw:inner?.12:-.1,wav:(K.wav||0)*(1+li*.8)*o2,wk:5});
    const t={l,c:cw.c,cb:cw.cb||mix(cw.c,K.back||'#dfe4c4',.22),lift:.38};
    const lite=DET<1.5&&K.lite&&inner;if(cw.throat&&li===0&&!lite)Object.assign(t,{basec:cw.throat,bf:K.bf||.35,bo:.55});if(cw.tip&&!lite)Object.assign(t,{tipc:cw.tip,tf:K.tf||.45,to:.55});if(cw.edge)Object.assign(t,{edgec:cw.edge,ew:Math.max(1.1,D*.012)});
    if(cw.band&&li===0)t.band=cw.band;if(cw.vein)Object.assign(t,{vein:cw.vein,vw:Math.max(.5,D*.005)});if(K.bvein)Object.assign(t,{bvein:K.bvein,bw:Math.max(1,D*.012)});it.push(t)}
  /* the throat's own depth, a dark disc deep in the trumpet when it turns to the eye */
  const nz=B[2][2];if(!LOD&&nz>.55){const zt=PJ(B,O,[0,0,D*K.L*.18])[2]+nz*D*.6;it.push({z:zt,fn:kk=>{const q=spDisc(B,O,D*.05,D*K.L*.14,10);E('path',{d:smooth(q),fill:shd(cw.throat||cw.c,-.3),opacity:.45*sm01((nz-.55)/.3)},kk)}})}
  /* stamens and style: one path of filaments (≥1.05 wide), the anthers on their ends; the double has none to show */
  if(!cw.dbl&&op>.5){const ns=6,Ls=D*K.L*(K.sl||.85),fil=K.fil||mix('#eef0d8',cw.c,.2),an=cw.an||K.an||'#e8d48a',P=[];
    for(let m=0;m<=ns;m++){const sty=m===ns,a=sty?0:(m/ns-.5)*.9,L=sty?Ls*1.08:Ls*(.86+.14*Math.cos(m*1.7)),dd=K.decl??.22;
      const p0=[0,0,D*.03],p1=[Math.sin(a)*L*.12,-L*dd*.9,L*.55],p2=[Math.sin(a)*L*.3,-L*dd*.6+L*.1*(1+Math.cos(m*2.3)*.4),L];P.push({sty,q:[p0,p1,p2].map(p=>PJ(B,O,p))})}
    const zs=PJ(B,O,[0,-Ls*.12,Ls*.7])[2]+(nz>.5?nz*D*.7:0);it.push({z:zs,fn:kk=>{let dfl='',dst='',da='';for(const s of P){let[a,b,c]=s.q;if(nz<.5){a=[(a[0]+2*b[0]+c[0])/4,(a[1]+2*b[1]+c[1])/4];b=[(b[0]+c[0])/2,(b[1]+c[1])/2]}const seg=`M${f(a[0])},${f(a[1])}Q${f(b[0])},${f(b[1])} ${f(c[0])},${f(c[1])}`;if(s.sty)dst+=seg;else{dfl+=seg;da+=l49C(c[0],c[1],Math.max(.9,D*.011))}}
      E('path',{d:dfl,stroke:fil,'stroke-width':f(Math.max(1.05,D*.009)),fill:'none','stroke-linecap':'round'},kk);E('path',{d:dst,stroke:K.sty||fil,'stroke-width':f(Math.max(1.1,D*.011)),fill:'none','stroke-linecap':'round'},kk);
      if(!LOD){E('path',{d:da,fill:an,stroke:shd(an,-.4),'stroke-width':.35},kk);const c=P[ns].q[2],r=Math.max(1,D*.014);E('path',{d:l49C(c[0],c[1],r),fill:K.stg||mix(fil,'#ffffff',.3),stroke:shd(K.stg||fil,-.4),'stroke-width':.35},kk)}}})}
  /* the green ovary behind the trumpet, where the pedicel arrives */
  const oz=PJ(B,O,[0,0,-D*.06])[2];it.push({z:oz,fn:kk=>spBud(kk,l49Fr(V3.sc(B[2],-1),B[1]),V3.add(O,toV(B,[0,0,D*.02])),D*(K.ov||.13),D*(K.ov||.13)*.62,K.ovc||'#7a9a52',{tp:.25,pw:.8})});
  l49Pet(k,it,cache);return k}
/* a closed trumpet bud: a long club, green at its foot, the colour coming through toward the tip, three ribs */
function l49TBud(par,B,O,len,w,cw,a,cache){const k=G(par),c=mix(cw.bud||cw.c,'#8aa858',Math.max(0,.45-.45*a));spBud(k,B,O,len,w,c,{tp:.55,pw:.55});
  if(!LOD){let rd='';for(let m=0;m<3;m++){const an=m/3*6.283+.5,vis=toV(B,[Math.cos(an),Math.sin(an),0])[2];if(vis<-.1)continue;const q=[.12,.4,.7,.9].map(v=>{const r=w*.5*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.55)*(1-.55*v)*.92,p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*len]);return[p[0],p[1]]});rd+=smooth(q,false)}
    E('path',{d:rd,stroke:shd(c,-.35),'stroke-width':.6,'stroke-opacity':.5,fill:'none'},k)}return k}

/* ---------- amaryllis (Hippeastrum hybrids: 'Red Lion', 'Mont Blanc', 'Apple Blossom', 'Minerva', 'Picotee', 'Rilona', 'Double Dragon', 'Alfresco'): a thick, hollow, leafless scape,
   glaucous green; at its top two papery spathe valves and an umbel of two to four (up to six) huge funnel-shaped flowers on short pedicels, held out level and turned outward like a cross;
   six tepals joined in a short green throat, the lower inner one narrower; six declinate stamens and a longer style with its three-lobed stigma. The buds stand up together inside
   the closed spathe, then part, swell, colour and turn outward one by one ---------- */
const L49_CWHIP=[{id:'rouge',n:'Rouge (Red Lion)',c:'#bf1a2c',throat:'#6a8a2a',an:'#f0e6c8'},{id:'rouge-vif',n:'Rouge vif (Ferrari)',c:'#d0202a',throat:'#7a8a2a',an:'#f0e6c8'},
  {id:'bordeaux',n:'Bordeaux velouté (Benfica)',c:'#7a1424',throat:'#4a5a22',an:'#e8dcc0'},{id:'blanc',n:'Blanc (Mont Blanc)',c:'#faf7f0',throat:'#c8dc8a',an:'#efe4c4'},
  {id:'apple-blossom',n:'Blanc rosé (Apple Blossom)',c:'#f8eeea',tip:'#ec9aaa',vein:'#e48aa0',throat:'#cfe09a',an:'#efe4c4'},{id:'rose',n:'Rose (Pink Surprise)',c:'#ec8aa6',vein:'#d0607e',throat:'#b8d080',an:'#efe4c4'},
  {id:'saumon',n:'Saumon (Rilona)',c:'#f29c84',vein:'#e0705e',throat:'#c8d07a',an:'#efe4c4'},{id:'peche',n:'Pêche (Terra Cotta Star)',c:'#f5c0a0',vein:'#e8907a',throat:'#c8d888',an:'#efe4c4'},
  {id:'minerva',n:'Rouge à étoile blanche (Minerva)',c:'#c41c2e',band:'#f6efe6',throat:'#b8d080',an:'#f0e6c8'},{id:'picotee',n:'Blanc liseré rouge (Picotee)',c:'#f8f5ec',edge:'#c41c2e',throat:'#c8dc8a',an:'#efe4c4'},
  {id:'double-rouge',n:'Double rouge (Double Dragon)',c:'#c01a2a',dbl:1,throat:'#6a8a2a'},{id:'double-blanc',n:'Double blanc (Alfresco)',c:'#f8f6ee',dbl:1,throat:'#c8dc8a'},
  {id:'double-strie',n:'Double rouge strié blanc (Dancing Queen)',c:'#c8202e',band:'#f6eee6',dbl:1,throat:'#8aa040'}];
const L49_HIP={L:.56,Wo:.3,Wi:.26,a0:.42,a1:1.42,pw:1.7,th:.55,r0:.035,zyg:1,decl:.26,sl:.78,ov:.12,wav:.06,bf:.13,tf:.5,fil:'#f2eedc',sty:'#f2eedc',stg:'#f6f2e2'};
const L49_BEL={lite:1,L:.62,Wo:.17,Wi:.16,a0:.14,a1:.9,pw:2.6,th:.45,r0:.03,zyg:1,decl:.18,sl:.9,ov:.1,wav:.03,bf:.42,tf:.5,fil:'#f4d4dc',sty:'#f2c8d4',stg:'#f6e2e8',back:'#f2e0e4'};
/* the umbel on its scape: n flowers (their ages), the spathe, the buds; S: D, w (scape width ×D), Ls (scape ×D), ped (pedicel ×D), el (angle off the scape of an open flower, degrees),
   K the trumpet, sc the scape colours, spc the spathe colour, ring (flowers evenly round, the belladonna) */
function l49Umbel(g,t,o,list,S){const cw=cwPick(list,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||S.cm)*UPC*(S.ds||1),k=G(g),B=frameOf(o,.5,true),{up,U0}=l49Up(B),cache={},sc=S.sc;
  const n=S.n(op),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.1))):1,w=D*S.w,
    mods=[['F',{l:D*(o.rim?.25:S.Ls)*kr,w0:w*1.08,w1:w,e:.008,seg:D*.22}],['F',{l:D*.1*kr,aim:V3.nz(V3.add(up,V3.sc(B[2],.25))),k:.25,w1:w*.96}],['Sp',{}]];
  /* the oldest flower faces the head's front; the others round it; the youngest buds stay erect in the middle */
  for(let i=0;i<n;i++){const age=Math.max(0,Math.min(1,op*1.3-(i/Math.max(1,n))*(op<.6?.85:S.lag)+R(-.05,.05))),a=180+(S.ring?i*360/n:[0,180,90,270,45,225][i%6])+R(-12,12),
      el=age<.3?R(10,22)+age*40:age<.55?30+(age-.3)*120:S.el+R(-8,8);
    mods.push(['[',{w:Math.max(1.15,w*(S.pw||.32))}],['/',{a}],['&',{a:el}],['F',{l:D*S.ped*(age<.3?.55+age:.85+.2*age)*R(.92,1.08),w1:Math.max(1.1,w*(S.pw||.32)*.8),e:age<.3?.02:S.pe??-.01}],['K',{age,i}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.012,seg:D*.06,T:[0,1,0],e:.008,w:w*1.08});for(const ch of res.chains)ch.c=sc;
  const sp=res.organs.find(q=>q.t==='Sp'),apex=V3.add(sp.pos,V3.sc(sp.H,D*.04)),closed=op<.22;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:10,organ:(og,pos)=>{
    if(og.t==='Sp'){const Bs=lsFrame(og,null,0);
      /* closed: the spathe wraps the buds, a fat pointed sheath; open: its two valves wither and hang back under the umbel */
      if(closed){const len=D*S.bud*(1.05+.8*op),c=mix(S.spc,mix(cw.c,'#8aa858',.6),.25);return{parts:[{z:pos[2]+len*Bs[2][2]*.3,fn:par=>{const kk=G(par);spBud(kk,Bs,V3.add(pos,V3.sc(og.H,-w*.2)),len,len*S.bw*1.3,c,{tp:.62,pw:.5});
        if(!LOD){const s0=PJ(Bs,pos,[len*S.bw*.12,0,len*.05]),s1=PJ(Bs,pos,[len*S.bw*.06,len*S.bw*.1,len*.7]),s2=PJ(Bs,pos,[0,0,len*.97]);E('path',{d:`M${f(s0[0])},${f(s0[1])}Q${f(s1[0])},${f(s1[1])} ${f(s2[0])},${f(s2[1])}`,stroke:shd(c,-.4),'stroke-width':.7,'stroke-opacity':.55,fill:'none'},kk)}}}]}}
      const it=[];for(const s of[-1,1])it.push({l:ligule(Bs,pos,{phi:s*1.571+R(-.3,.3),r0:w*.35,z0:-w*.4,L:D*S.spl,W:D*S.spl*.22,wp:L49_SPA,a0:op<.5?.3:1.7,a1:op<.5?.45:2.4,tip:'point',th:1.3,n:5,tw:R(-.3,.3)}),c:S.spc,ink:shd(S.spc,-.45)});
      return{parts:[{z:pos[2]-D*.05,fn:par=>drawLig(par,it)}]}}
    if(og.t==='K'){if(closed)return null;const a=og.p.age;
      if(a<.55){const Bf=l49Fr(og.H,up,R(-.4,.4)),len=D*S.bud*(.9+.5*a),c=V3.add(pos,V3.sc(og.H,-len*.04));return{parts:[{z:pos[2]+og.H[2]*len*.5,fn:par=>l49TBud(par,Bf,c,len,len*S.bw,cw,a/.55,cache)}]}}
      /* the open flower: level, turned outward, a little down; its face toward the head's front for the first */
      const hz=V3.nz([og.H[0],og.H[1]*.2-.1,og.H[2]]),ax=og.p.i===0?V3.nz(V3.add(V3.sc(B[2],.8),V3.sc(hz,.4))):hz,Bf=l49Fr(ax,up,R(-.12,.12)),op2=Math.min(1,(a-.55)/.45*1.1+.3),c=V3.add(pos,V3.sc(ax,D*.02));
      return{parts:[{z:c[2]+ax[2]*D*.25,fn:par=>l49Trumpet(par,Bf,c,D,cw,op2,S.K,cache)}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}
const l49Hip=(g,t,o)=>l49Umbel(g,t,o,L49_CWHIP,{cm:17,w:.11,Ls:2.6,ped:.3,el:84,pe:-.02,lag:.55,bud:.62,bw:.36,spl:.38,K:L49_HIP,sc:['#3a5a2a','#5f8a3c','#86ac5c','#b4d08c'],spc:'#c8b48a',
  n:op=>op<.22?4:Math.round(R(3.5,4.4))});

/* ---------- amaryllis belladonna (Amaryllis belladonna, the true amaryllis — 'Naked Lady'; with its forms 'Alba', 'Johannesburg', and × Amarygia): a solid scape, naked (the leaves come after),
   flushed purple-red; at its top a ring of six to twelve fragrant trumpets on short pedicels, facing out and a little up, rose pink with a paler throat; the buds erect in the middle ---------- */
const L49_CWBEL=[{id:'rose',n:'Rose (type)',c:'#f1a6bc',throat:'#f8e8d8',tip:'#e47a9a',an:'#d8b0a0'},{id:'rose-pale',n:'Rose pâle',c:'#f6ccd8',throat:'#faf0e4',tip:'#ee9ab2',an:'#d8b0a0'},
  {id:'rose-vif',n:'Rose vif à gorge blanche (Johannesburg)',c:'#e4709a',throat:'#faf2ea',tip:'#cc4a7a',an:'#c89090'},{id:'magenta',n:'Rose magenta (× Amarygia)',c:'#d4507e',throat:'#f6dce0',tip:'#b03068',an:'#b07080'},
  {id:'blanc',n:'Blanc (Alba)',c:'#f8f4ee',throat:'#f6eecc',tip:'#f2dce0',an:'#d8c0a0'},{id:'blanc-rose',n:'Blanc rosé (Hathor)',c:'#f8ece8',throat:'#f8f2dc',tip:'#f0b8c4',an:'#d8b8a0'}];
const l49Bel=(g,t,o)=>l49Umbel(g,t,o,L49_CWBEL,{cm:16,ds:.58,w:.12,pw:.16,Ls:5.2,ped:.42,el:58,pe:.04,lag:.5,ring:1,bud:.62,bw:.3,spl:.42,K:L49_BEL,sc:['#4a1a2a','#7a2a42','#a04a5e','#c87a88'],spc:'#c8a090',
  n:op=>op<.22?6:Math.round(R(6,8.4))});

/* ---------- Easter lily and trumpet lilies (Lilium longiflorum 'White Heaven', 'White Fox'; trumpet hybrids, division VI: 'Pink Perfection', 'African Queen', 'Golden Splendor', L. regale):
   a stiff stem clothed all along in many scattered, lance-shaped, glossy leaves; at its top a raceme of two to five long trumpets held level or nodding a little on stout pedicels,
   six waxy tepals joined in a long tube, flaring and curling back at their tips; the stamens with yellow pollen; long green-white buds pointing up and out, the youngest at the top ---------- */
const L49_CWLLT=[{id:'blanc',n:'Blanc pur (White Heaven)',c:'#fbfaf2',throat:'#d8e8a8',an:'#e6c23e',bud:'#e8eccc'},{id:'blanc-vert',n:'Blanc à gorge verte (White Fox)',c:'#f8f8ee',throat:'#b8d488',an:'#e6c23e',bud:'#dce6bc'},
  {id:'creme',n:'Crème (trompette)',c:'#f5efd8',throat:'#f0d880',an:'#d8a838',bud:'#e6e0bc'},{id:'abricot',n:'Abricot (African Queen)',c:'#f1ae6e',throat:'#f0c050',an:'#b8602a',bud:'#d8b080',back:'#c08060'},
  {id:'jaune',n:'Jaune (Golden Splendor)',c:'#f2d462',throat:'#e8b830',an:'#b8702a',bud:'#d8d080',back:'#b89060'},{id:'rose',n:'Rose (Pink Perfection)',c:'#e8a0b8',throat:'#f0e0a8',an:'#9a5a2a',bud:'#c890a0',back:'#a05a78'},
  {id:'regale',n:'Blanc revers pourpre (L. regale)',c:'#faf6ee',throat:'#f0d860',an:'#d8a838',bud:'#c890a0',back:'#9a4a6a'}];
const L49_LLT={L:1.02,Wo:.21,Wi:.25,a0:.07,a1:1.95,pw:3.4,th:.5,r0:.025,decl:.06,sl:.78,ov:.07,wav:.04,bf:.55,tf:.6,wp:L49_TEPL,fil:'#e8eccc',sty:'#d8e4b0',stg:'#c8d090'};
function l49Lily(g,t,o){const cw=cwPick(L49_CWLLT,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||14)*UPC,k=G(g),sc=['#2a4a1e','#46702e','#6a9a44','#9cc070'],cache={},lc='#3a6a2a';
  const K=Object.assign({},L49_LLT,cw.back?{bvein:cw.back}:{}),Lt=D*K.L;
  if(o.rim){const r=lsHeadS(k,o,{D,w:D*.04,cols:sc,op,rr:.4,nodes:0,lp:.4,flower:(par,B2,O,D2,op2)=>l49Trumpet(par,B2,O,D,cw,op2,K,cache)});open(k,t,1000,8,.3);return r}
  const B=frameOf(o,.4,true),{up,U0}=l49Up(B);
  const nF=op<.3?0:op<.7?1:Math.round(R(2,3.4)),nB=op<.3?3:op<.7?2:Math.round(R(1,2.4)),n=nF+nB,kr=B.reach?Math.min(1,Math.max(.15,B.reach*.4/(D*1.4))):1,li=D*.24*kr,w=D*.045;
  /* the leafy stem: leaves all along, smaller toward the raceme; then a node per flower (its bract and its pedicel), the oldest lowest */
  const rules={S:()=>{const out=[];for(let j=0;j<6;j++)out.push(['F',{l:li*(j?.42:.8),w1:w*(1.12-.015*j)}],['[',{}],['/',{a:j*137.5+R(-15,15)}],['&',{a:38+R(-6,6)}],['Lv',{j}],[']',{}]);out.push(['A',{i:0}]);return out},
    A:p=>{if(p.i>=n)return[['F',{l:li*.3,w1:w*.5}]];const fl=p.i<nF,age=fl?1-.1*p.i:.45-.35*(p.i-nF)/Math.max(1,nB);
      return[['F',{l:li*R(.6,.8)*(p.i?1:.6),w1:w*(1-.05*p.i)}],['[',{}],['&',{a:34}],['Lv',{bract:1}],[']',{}],['[',{w:w*.45}],['&',{a:fl?58+R(-6,6):30+R(-5,5)}],['F',{l:D*(fl?.36:.26)*kr,w1:w*.36,e:fl?.04:.08}],[fl?'K':'Kb',{age,i:p.i}],[']',{}],['/',{a:137.5+R(-12,12)}],['A',{i:p.i+1}]]}};
  const res=lsTurtle(lsDerive([['S',{}]],rules,n+3),{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.1,T:[0,1,0],e:.012,w:w*1.12});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K')||res.organs.filter(q=>q.t==='Kb').pop(),apex=main.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'){/* level or a little nodding, turned out from the stem; the main one faces the head's front */
      const hz=V3.nz([og.H[0],-.12,og.H[2]]),ax=og===main?V3.nz(V3.add(V3.sc(B[2],.85),V3.sc(hz,.3))):hz,Bf=l49Fr(ax,up,R(-.1,.1)),c=V3.add(pos,V3.sc(ax,D*.03));
      return{parts:[{z:c[2]+ax[2]*Lt*.5,fn:par=>l49Trumpet(par,Bf,c,D,cw,og===main?op:Math.min(op,og.p.age),K,cache)}]}}
    if(og.t==='Kb'){const Bf=lsFrame(og,null,R(-.3,.3)),len=Lt*(.5+.55*og.p.age);return{parts:[{z:pos[2]+og.H[2]*len*.5,fn:par=>l49TBud(par,Bf,pos,len,len*.24,cw,og.p.age,cache)}]}}
    if(og.t==='Lv'){const len=D*(og.p.bract?.45:.95-.06*(og.p.j||0)),lw=og.p.bract?.13:.16;return{ext:1,parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l)=>l49Leaf(par,x,y,a,l,lw,lc,.35+.65*Math.abs(og.U[2])))]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- tuberose (Polianthes tuberosa: 'Mexican Single', 'The Pearl' double, 'Pink Sapphire'): a tall stem with a few narrow clasping leaves, shorter up the stem, then a spike of waxy white
   flowers in pairs, each a slender, slightly curved tube (2,5–5 cm) opening into six spreading, pointed, starry lobes (many in the double), the scent heavy; they open from the bottom up;
   at the top the paired buds, slim and pink-flushed. Drawn by florets: the tube, the star (one path, or two rows in the double), the throat ---------- */
const L49_CWTUB=[{id:'blanc',n:'Blanc simple (Mexican Single)',c:'#fbfaf2',bud:'#e8c8c8'},{id:'blanc-double',n:'Blanc double (The Pearl)',c:'#fbf8ee',dbl:1,bud:'#e8c8c8'},
  {id:'creme',n:'Crème ivoire',c:'#f4ecd4',bud:'#e0c0b0'},{id:'rose',n:'Rosé (Pink Sapphire)',c:'#f4d6da',dbl:1,bud:'#d8909a'},{id:'blanc-rose',n:'Blanc à boutons rosés (Sensation)',c:'#faf6f0',bud:'#d898a0'}];
function l49TubFloret(par,B,O,Dm,cw,h,cache,rot){const k=par,Lt=Dm*.68,r0=Dm*.055,r1=Dm*.1,rr=Dm*.5*(.55+.45*h),nz=B[2][2],c=cw.c,ink=shd(c,-.5),ax=B[2];
  /* the tube, a little curved toward the face, waxy, the light along it */
  const T=[[0,0,0],[0,Dm*.06,Lt*.35],[0,Dm*.1,Lt*.7],[0,Dm*.1,Lt]],C=T.map(p=>PJ(B,O,p)),Lp=[],Rp=[];for(let i=0;i<C.length;i++){const a=C[Math.max(0,i-1)],b=C[Math.min(C.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,r=r0+(r1-r0)*i/(C.length-1);Lp.push([C[i][0]-dy/l*r,C[i][1]+dx/l*r]);Rp.push([C[i][0]+dy/l*r,C[i][1]-dx/l*r])}
  const tube=()=>E('path',{d:smooth(Lp.concat(Rp.reverse())),fill:l49T(cache,mix(c,'#e8e0c8',.2),.55),stroke:ink,'stroke-width':.38,'stroke-opacity':.55},k);
  const O2=PJ(B,O,T[3]),Om=V3.add(O,toV(B,T[3])),star=(n,R0,ph,cup,tone)=>{let d='';for(let m=0;m<n;m++){const a=ph+m/n*6.283,w=.62*6.283/n,pts=[];
      for(const[u,v]of[[-1,.06],[-.95,.4],[-.62,.8],[0,1.06],[.62,.8],[.95,.4],[1,.06]]){const an=a+u*w*(1-.45*v),r=R0*v,p=PJ(B,Om,[Math.cos(an)*r,Math.sin(an)*r,cup*R0*v*v]);pts.push([p[0],p[1]])}d+=smooth(pts)}
    E('path',{d,fill:l49T(cache,c,tone),stroke:ink,'stroke-width':.45,'stroke-opacity':.7,'stroke-linejoin':'round'},k)};
  const flower=()=>{const cup=.22+.4*(1-h);if(cw.dbl){star(6,rr,rot,cup+.1,.62);star(6,rr*.78,rot+.52,cup+.3,.74);if(!LOD)star(5,rr*.5,rot+.2,cup+.55,.82)}else star(6,rr,rot,cup,nz>0?.7:.5);
    if(!LOD&&nz>.1&&!cw.dbl)E('path',{d:l49C(O2[0],O2[1],Math.max(.9,r1*.9)),fill:mix(c,'#c8c098',.5)},k)};
  if(nz>=0){tube();flower()}else{flower();tube()}return k}
function l49Tub(g,t,o){const cw=cwPick(L49_CWTUB,o),op=Math.max(.05,Math.min(1,o.op??R(.7,1))),k=G(g),parts=[],cache={},sp=!!o.spine,SC=['#2e4a24','#4e7a38','#78a456','#a8cc84'];
  const Lf0=(o.cm||25)*UPC,Lt=sp?blen(o.spine):Lf0*3,Dm=4.2*UPC*R(.94,1.06);let Lfl=0;
  /* the stem: five or six nodes, each with a narrow leaf clasping it, shorter upward */
  const P=spGrow(o,Lt,{face:R(-.6,.6),wig:.02,e:.1,seg:9,w:6,nodes:L=>{Lfl=Math.min(Lf0,L*(sp?o.short?.6:.45:.36))*(op<.25?.75+.6*op:1);const N=[],n=5,ph0=R(0,360),Lb=L-Lfl;
      for(let j=0;j<n;j++)N.push({l:Lb*(.12+.84*j/(n-1)),phi:ph0+j*137.5,kink:R(.2,.8),leaf:{a:16+R(-4,4)}});return N}}),A=P.A,L=A.L,l0=L-Lfl,s0=A.sOf(l0);
  /* the pairs: ages down the spike; the lowest open, then opening, then buds coloured, green-tipped at the very top */
  const nP=Math.max(6,Math.round(Lfl/UPC/2.1)),fo=op<.25?0:Math.min(.75,.1+.65*op),nO=Math.round(nP*fo),items=[];
  for(let i=0;i<nP;i++){const q=i/(nP-1),l=l0+Lfl*(.02+.96*Math.pow(q,.85)),s=A.sOf(l),az0=(i*95+R(-10,10))*D;
    for(const m of[0,1]){const az=az0+m*Math.PI,f0=A.at(s),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az))),kd=i<nO?'open':'bud',h=kd==='open'?Math.min(1,(nO-i)/2.2):0,qb=kd==='bud'?(i-nO)/Math.max(1,nP-nO-1):0,
      el=kd==='bud'?.95+.45*qb:.55+.25*(1-h),ax=V3.nz(V3.add(V3.sc(r,Math.cos(el)),V3.sc(f0.T,Math.sin(el)))),pos=V3.add(V3.add(f0.p,V3.sc(r,Dm*.07)),V3.sc(f0.T,Dm*.04));
      items.push({i,m,s,kd,h,qb,r,ax,pos,node:f0.p,T:f0.T})}}
  const cuts=[0,s0*.5,s0];for(let j=1;j<=nP;j++)cuts.push(s0+(1-s0)*j/nP);
  l41StemP(A,parts,cuts.slice(0,3),6,4.6,SC,s0);l41StemP(A,parts,cuts.slice(2),4.6,1.6,SC.map(c=>shd(c,-.15)),1,s0,1);
  /* the leaves: narrow, clasping, rising close to the stem */
  for(const lf of P.leaves){const len=(16-11*lf.s/s0)*UPC*R(.85,1.1);if(sp)spLeafUp(lf,.3);parts.push(spLeafPart(A,lf,len,(par,x,y,ang,l2,face)=>l49Leaf(par,x,y,ang,l2,.09,'#4f7a36',face,.06)))}
  const bc=mix(cw.bud||cw.c,'#e8e0c8',.15);
  for(const it of items){const B=spFrame(it.ax,it.T,(it.i*.7)%1),z=A.zk(it.s,it.pos[2]+it.ax[2]*Dm*.5);
    /* a small bract under each pair, out of which the flowers come */
    if(it.m===0)parts.push({z:A.zk(it.s,it.node[2]+.2),fn:par=>{const l=ligule(spFrame(V3.nz(V3.add(it.r,V3.sc(it.T,1.4))),it.T,0),it.node,{phi:0,r0:0,z0:0,L:Dm*.28,W:Dm*.08,wp:L49_SPA,a0:.1,a1:.25,tip:'point',th:.8,n:4});drawLig(par,[{l,c:'#7a9a58',ink:'#3e5a2a',flat:'#6e9050'}])}});
    if(it.kd==='bud'){const len=Dm*(.9-.38*it.qb),wb=len*.2,c=mix(bc,'#9ab868',.55*it.qb*it.qb);parts.push({z,fn:par=>{const kk=G(par);spBud(kk,B,it.pos,len,wb,c,{tp:-.1,pw:.9})}});continue}
    parts.push({z,fn:par=>l49TubFloret(par,B,it.pos,Dm,cw,it.h,cache,(it.i*.9+it.m)%1.04)})}
  drawParts(k,parts);open(k,t,1100,0,.5);return{k,bw:6,bc:SC}}

/* ---------- Iceland poppy (Papaver nudicaule: Champagne Bubbles, Colibri, Spring Fever, Wonderland series): a leafless, hairy scape, crooked at the top; the bud, hairy and nodding on its hook,
   lifts as it swells; the two hairy sepals split and drop, the four petals unfold crumpled like tissue paper into a wide cup (two outer broad, two inner), a yellow blotch at their base;
   in the middle the ribbed ovary capped by its flat, rayed stigma, ringed by a fringe of many yellow stamens ---------- */
const L49_CWPAV=[{id:'orange',n:'Orange',c:'#f07a2a',base:'#f6c040'},{id:'jaune',n:'Jaune',c:'#f6d23a',base:'#f2c020'},{id:'blanc',n:'Blanc',c:'#f7f3ea',base:'#f2e08a'},{id:'rose',n:'Rose',c:'#ef8a8e',base:'#f4d070'},
  {id:'saumon',n:'Saumon pêche',c:'#f6c2a0',base:'#f6d880'},{id:'rouge',n:'Rouge écarlate',c:'#e0302a',base:'#f0a040'},{id:'creme',n:'Crème citron',c:'#f6eaa8',base:'#f2d050'},
  {id:'abricot',n:'Abricot',c:'#f6a660',base:'#f6c850'},{id:'corail',n:'Corail',c:'#f4705a',base:'#f6b850'},{id:'rose-borde',n:'Rose bordé crème (Champagne Bubbles)',c:'#f2a0a8',edge:'#faecd8',base:'#f4d070'}];
const L49_PAVP=prof([[0,.2],[.12,.5],[.4,.9],[.7,1],[.9,.92],[1,.6]]);
/* the hairs: a fringe of short teeth along a screen polyline (a ribbon with a toothed edge, one path, behind the stem) */
function l49Hairs(P,w,hl){const A=[],B2=[],n=P.length;for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,ww=w(i)/2,e=i%2?hl:hl*.15,tx=dx/l*hl*.35;
  A.push([P[i][0]+nx*(ww+e)+tx,P[i][1]+ny*(ww+e)+(dy/l)*hl*.35]);B2.push([P[i][0]-nx*(ww+e)+tx,P[i][1]-ny*(ww+e)+(dy/l)*hl*.35])}
  return'M'+A.map(q=>f(q[0])+','+f(q[1])).join('L')+'L'+B2.reverse().map(q=>f(q[0])+','+f(q[1])).join('L')+'Z'}
function l49PavFlower(par,B,O,D,cw,op,cache){const k=G(par),R0=D/2,o2=sm01((op-.3)/.7),it=[],rot=(O[0]*.17+O[1]*.11)%6.283,nz=B[2][2];
  /* the petals: the two outer broad ones first, the inner pair across them; crumpled (wav), cupped (th), opening from a closed ball to a wide bowl */
  for(let j=0;j<4;j++){const inner=j>=2,phi=rot+(inner?1.5708:0)+(j%2)*Math.PI,a0=.15+.45*o2,a1=.35+1.05*o2+(inner?-.05:.05),
      l=ligule(B,O,{phi,r0:R0*.1,z0:inner?R0*.06:0,L:R0*(inner?.92:1)*(.78+.22*o2),W:R0*(inner?1.05:1.15)*(.8+.2*o2),wp:L49_PAVP,a0,a1,pw:1.3,th:.75-.25*o2,tip:'round',n:DET>=1.5?9:7,wav:.08+.08*(1-o2),wk:7,tw:R(-.15,.15)});
    it.push({l,c:cw.c,cb:mix(cw.c,'#e8dcc0',.15),lift:.25,basec:cw.base,bf:.16,bo:.6,edgec:cw.edge,ew:Math.max(1.1,D*.02),vein:shd(cw.c,-.22),vw:.5,vo:.35})}
  /* the heart: the fringe of stamens round the ovary, the ovary and its rayed stigma cap */
  const zc=PJ(B,O,[0,0,R0*.25])[2]+nz*R0*1.2;it.push({z:zc,fn:kk=>{if(op<.45)return;const c=PJ(B,O,[0,0,R0*.2]),ring=[];const n=DET>=1.5?72:48;
      for(let i=0;i<=n;i++){const a=i/n*6.283,r=i%2?R0*(.36+.05*Math.sin(i*2.7)):R0*.27,p=PJ(B,O,[Math.cos(a)*r,Math.sin(a)*r,R0*(i%2?.3:.2)]);ring.push([p[0],p[1]])}
      E('path',{d:'M'+ring.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:'#f2cc3a',stroke:'#c8941a','stroke-width':.4,'stroke-opacity':.7,'stroke-linejoin':'round'},kk);
      const cap=spDisc(B,O,R0*.2,R0*.32,12);E('path',{d:smooth(cap),fill:'#a8b860',stroke:'#5a6a2a','stroke-width':.45},kk);
      if(!LOD){let d='';const cc=PJ(B,O,[0,0,R0*.34]);for(let i=0;i<7;i++){const a=i/7*6.283+rot,p=PJ(B,O,[Math.cos(a)*R0*.19,Math.sin(a)*R0*.19,R0*.32]);d+=`M${f(cc[0])},${f(cc[1])}L${f(p[0])},${f(p[1])}`}
        E('path',{d,stroke:'#5a6a2a','stroke-width':.8,'stroke-opacity':.75,fill:'none'},kk);E('path',{d:l49C(cc[0],cc[1],Math.max(.8,R0*.05)),fill:'#c8b850'},kk)}}});
  l49Pet(k,it,cache);
  if(!LOD&&nz>.25&&op>.45){}return k}
/* the bud: an ovoid of two hairy sepals, its seam; as it opens they part on the crumpled colour */
function l49PavBud(par,B,O,len,cw,a){const k=G(par),w=len*.72,pts=[];for(let i=0;i<=10;i++)for(let j=0;j<14;j++){const v=i/10,an=j/14*6.283,r=w*.5*Math.pow(Math.sin(Math.PI*Math.min(.99,.03+.97*v)),.75)*(1-.3*v),p=PJ(B,O,[Math.cos(an)*r,Math.sin(an)*r,v*len]);pts.push([p[0],p[1]])}
  const h=hull2(pts),hz=[];let cx=0,cy=0;for(const p of h){cx+=p[0];cy+=p[1]}cx/=h.length;cy/=h.length;
  /* the hairy outline: short teeth all round the bud */
  for(let i=0;i<h.length;i++){const p=h[i],q=h[(i+1)%h.length],m=Math.max(1,Math.round(Math.hypot(q[0]-p[0],q[1]-p[1])/1.6));for(let s=0;s<m;s++){const t=s/m,x=p[0]+(q[0]-p[0])*t,y=p[1]+(q[1]-p[1])*t,dx=x-cx,dy=y-cy,l=Math.hypot(dx,dy)||1,e=(hz.length%2)?len*.05:0;hz.push([x+dx/l*e,y+dy/l*e])}}
  E('path',{d:'M'+hz.map(q=>f(q[0])+','+f(q[1])).join('L')+'Z',fill:'#b8b490'},k);E('path',{d:smooth(h),fill:budFill('#8aa060'),stroke:'#4a5a2a','stroke-width':.45,'stroke-opacity':.6},k);
  if(a>.2&&!LOD){/* the seam split open on the colour */const s0=PJ(B,O,[0,0,len*(.2-.1*a)]),s1=PJ(B,O,[w*.12*a,w*.08,len*.5]),s2=PJ(B,O,[0,0,len*.95]),s3=PJ(B,O,[-w*.12*a,w*.08,len*.5]);
    E('path',{d:`M${f(s0[0])},${f(s0[1])}Q${f(s1[0])},${f(s1[1])} ${f(s2[0])},${f(s2[1])}Q${f(s3[0])},${f(s3[1])} ${f(s0[0])},${f(s0[1])}Z`,fill:cw.c,stroke:shd(cw.c,-.4),'stroke-width':.4},k)}
  else if(!LOD){const s0=PJ(B,O,[0,w*.1,len*.15]),s2=PJ(B,O,[0,w*.06,len*.95]);E('path',{d:`M${f(s0[0])},${f(s0[1])}L${f(s2[0])},${f(s2[1])}`,stroke:'#4a5a2a','stroke-width':.6,'stroke-opacity':.5},k)}return k}
function l49Pav(g,t,o){const cw=cwPick(L49_CWPAV,o),op=Math.max(.05,Math.min(1,o.op??1)),D=(o.cm||8)*UPC,k=G(g),sc=['#4a6230','#6e8a4a','#94ae6a','#bccc94'],cache={},hc='#c8c49a';
  const B=frameOf(o,.3,true),{up,U0}=l49Up(B),face=B[2],bud=op<.4,kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*1.8))):1,w=Math.max(2.2,D*.06);
  /* the neck: the bud hangs on its hook; it lifts as the flower opens, which ends looking where the head is turned */
  const lift=sm01((op-.1)/.5),fax=V3.nz(V3.add(V3.sc(face,.35+.65*lift),V3.sc(up,-1+1.6*lift))),hook=V3.nz(V3.add(V3.sc(up,.2+.8*lift),V3.sc(face,.6)));
  const rules={S:()=>[['F',{l:D*(o.rim?.4:2.2)*kr,w0:w*1.05,w1:w,e:.02}],['F',{l:Math.max(D*.5,24)*kr,aim:hook,k:.1,w1:w*.95}],['F',{l:Math.max(D*.5,24)*kr,aim:fax,k:.12,w1:w*.9}],['K',{main:1}]]};
  const res=lsTurtle(lsDerive([['S',{}]],rules,2),{p:[0,0,0],H:up,U:U0,wig:.02,seg:Math.min(D*.06,4),T:[0,1,0],e:.02,w:w*1.05});for(const ch of res.chains)ch.c=sc;
  const main=res.organs.find(q=>q.t==='K'),apex=main.pos,off=V3s([0,0,0],apex);
  /* the hairs along the scape, behind it, with it in the stems layer of a bouquet */
  const c0=res.chains[0],ci=lsCut(res,apex),hp=c0.pts.map(q=>[q[0]+off[0],-(q[1]+off[1])]),hz=c0.pts.reduce((a,q)=>Math.min(a,q[2]+off[2]),1e9);
  res.organs.push({t:'Hr',p:{},pos:apex,H:up,U:U0,L:[1,0,0]});
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:12,organ:(og,pos)=>{
    if(og.t==='Hr')return{ext:1,parts:[{z:hz-1,fn:par=>{if(!LOD)E('path',{d:l49Hairs(hp,i=>c0.ws[i],Math.max(.7,w*.3)),fill:hc,opacity:.85},par)}}]};
    if(og.t==='K'){const ax=V3.nz(V3.add(og.H,V3.sc(fax,1.2))),Bf=l49Fr(ax,up,R(-.2,.2));
      if(bud){const len=D*(.32+.18*op/.4),c=V3.add(pos,V3.sc(ax,-len*.06));return{parts:[{z:c[2]+ax[2]*len*.5,fn:par=>l49PavBud(par,Bf,c,len,cw,op/.4)}]}}
      const c=V3.add(pos,V3.sc(ax,D*.02));return{parts:[{z:c[2]+ax[2]*D*.15,fn:par=>l49PavFlower(par,Bf,c,D,cw,op,cache)}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'amaryllis-hippeastrum':l49Hip,'amaryllis':l49Bel,'lis-longiflorum-trompette':l49Lily,'tubereuse':l49Tub,'pavot-islande':l49Pav});
Object.assign(CWS,{'amaryllis-hippeastrum':L49_CWHIP,'amaryllis':L49_CWBEL,'lis-longiflorum-trompette':L49_CWLLT,'tubereuse':L49_CWTUB,'pavot-islande':L49_CWPAV});
Object.assign(SZG,{'amaryllis-hippeastrum':[14,16,17,18,20],'amaryllis':[12,14,16,16,18],'lis-longiflorum-trompette':[12,13,14,15,17],'tubereuse':[18,22,25,25,30],'pavot-islande':[6,7,8,8,9]});
Object.assign(GHI,{'amaryllis-hippeastrum':{form:'etoile',size:3,k:'head',rk:.9},'amaryllis':{form:'grappe',size:2.5,k:'head',rk:.8},'lis-longiflorum-trompette':{form:'etoile',size:2.5,k:'head',rk:.85},
  'tubereuse':{form:'epi',size:1,k:'plant',self:80*UPC,tip:.85,fx:5*UPC},'pavot-islande':{form:'disque',size:2,k:'head',rk:.9}});
for(const id of['amaryllis-hippeastrum','amaryllis','lis-longiflorum-trompette','tubereuse','pavot-islande'])GH_BUDS.add(id);
