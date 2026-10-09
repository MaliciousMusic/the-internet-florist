/* ================= Serre, lot 106 — printemps 7, poussés par le L-système : tulipe à fleur de lis, tulipe viridiflora, narcisse à bouquet, violette, nivéole ================= */
/* reprend les moteurs voisins : les tépales en 3D des tulipes (lot 9 : sheet3, sheen3, TUL_SC ; lot 54 : l54Paint, l54Grad, l54Nk, l54Flame), le narcisse du lot 41 (ligule, spPetals,
   spBud, NAR_SPA, l41Fr), les ligules de la pensée (lot 10), la feuille en cœur (lot 67) et la clochette des fritillaires (lot 54) ; les motifs (liserés, flammes vertes, points verts)
   sont des polygones dans l'espace (u,v) du tépale, peints sur la bande dessinée : ils suivent la courbe qui les porte */

/* a tepal sheet as petS (lot 1), its spine's angle off the axis a function of t (degrees): a waisted goblet whose tips arch outward; cup<0 hollow toward the face */
function l106Tep(o){const ph=o.phi*D,R0=[Math.cos(ph),Math.sin(ph),0],A0=[Math.sin(ph),-Math.cos(ph),0],n=24,sp=[],dv=[];let p=[R0[0]*o.r0,R0[1]*o.r0,o.z0||0];
  for(let i=0;i<=n;i++){const a=o.ang(i/n)*D,d=[R0[0]*Math.sin(a),R0[1]*Math.sin(a),Math.cos(a)];dv.push(d);if(i)p=V3.add(p,V3.sc(d,o.L/n));sp.push(p)}
  const tw=(o.tw||0)*D,wp=o.wp;
  return(u,v)=>{const x=v*n,i=Math.min(n-1,Math.floor(x)),fr=x-i,P=V3.add(sp[i],V3.sc(V3s(sp[i+1],sp[i]),fr)),d=V3.nz(V3.add(dv[i],V3.sc(V3s(dv[i+1],dv[i]),fr)));
    let A=A0,N=V3.sc(V3.nz(V3.cr(d,A0)),-1);if(tw){const c=Math.cos(tw*v),s=Math.sin(tw*v);A=V3.add(V3.sc(A0,c),V3.sc(N,s));N=V3.nz(V3.cr(A,d))}
    const w=o.W*wp(v),cu=o.cup*w*(1-u*u)+(o.bow||0)*o.L*Math.sin(Math.PI*v);return V3.add(V3.add(P,V3.sc(A,u*w)),V3.sc(N,cu))}}
/* the picotee of a tepal: a band round its margins from v0 up, wider toward the point, which it covers; its inner edge wavers a little */
function l106Edge(wd,v0=.3){const n=l54N(),e=(v,s)=>Math.min(1,wd*(.3+.7*sm01((v-v0)/(1-v0)))*(1+.18*n(v*2+s))+sm01((v-.9)/.1)),L=[],Rr=[],Li=[],Ri=[];
  for(let i=0;i<=20;i++){const v=v0+(1-v0)*i/20;L.push([-1.04,v]);Rr.push([1.04,v]);Li.push([-(1-e(v,0)),v]);Ri.push([1-e(v,3),v])}
  /* one polygon per margin (a band clipped to rows must stay convex across), meeting at the point */
  return[L.concat([[0,1.03]],Li.reverse()),Rr.concat([[0,1.03]],Ri.reverse())]}
/* the green flame of a viridiflora: a broad feathered tongue up the midrib, from the base to near the tip, its edges broken into licks */
function l106Green(wd,fe){const lo=l54Nk(5,9),hi=l54Nk(30,48),hi2=l54Nk(30,48),Lf=[],Rt=[],vt=R(.82,.92);
  for(let i=0;i<=24;i++){const v=-.02+(vt+.02)*i/24,s=Math.pow(Math.sin(Math.PI*Math.min(1,(v+.08)/(vt+.12))),.7),b=wd*(.4+.6*s)*(1-Math.pow(Math.max(0,v)/vt,5)),c=.04*lo(v);
    Lf.push([c-Math.max(.02,b*(1+.12*lo(v+1))+fe*Math.max(0,hi(v))),v]);Rt.push([c+Math.max(.02,b*(1+.12*lo(v+2))+fe*Math.max(0,hi2(v))),v])}
  return[Lf.concat([[.04*lo(vt),Math.min(1,vt+.06)]],Rt.reverse())]}

/* ---------- tulips: the tepals of lot 9 drawn with their own spine (l106Tep), their patterns painted in (u,v); stamens and pistil once the cup opens; the peduncle grown by the L-system ---------- */
function l106TulFlower(par,B,O,Dm,cw,op,K){const F={k:G(par),B,O,parts:[],so:.18,sd:null},o2=sm01((op-.12)/.88),Ln=Dm*K.L,c=cw.c,cP=pal7(c),cB=pal7(cw.cb||mix(shd(c,.06),'#e8e4d4',h2l(c)[2]>.8?.06:.1)),
    lite=h2l(c)[2]>.82,wide=op>.985?1:0;
  for(let i=0;i<6;i++){const inner=i%2===1,ph=90+i*60+R(-6,6),W=Ln*(inner?K.Wi:K.Wo),S=l106Tep({phi:ph,r0:Dm*(inner?.03:.05),z0:inner?Dm*.008:0,L:Ln*R(.96,1.03)*(inner?.97:1),W,wp:K.wp,
      ang:K.ang(o2,inner,wide),cup:K.cup*(K.cb0?K.cb0+(1-K.cb0)*o2:1),bow:K.bow*(1.3-o2),tw:R(-6,6)}),P=K.pat(cw,inner,o2);
    F.parts.push(...sheet3(F,S,{pal:cP,palB:cB,nu:7,nv:12,across:1.6,ew:.5,eo:lite?.5:.32,cast:1,paint:(g,front,X)=>{if(LOD)return;
        if(!front&&o2<.7)E('path',{d:X.d,fill:l54Grad(X,0,.5,[[0,'#7f9a5a',(cw.g??.45)*(1-o2)],[1,'#7f9a5a',0]])},g);
        for(const q of P){const a=front?q.fi:q.ba;if(a)l54Paint(g,front,X,q.p,q.c,a,.55)}
        if(front&&cw.bl&&o2>.5){const a=Math.min(1,(o2-.5)*2.5);E('path',{d:X.d,fill:l54Grad(X,0,.26,[[0,cw.bl,.95*a],[.65,cw.bl,.8*a],[1,cw.bl,0]])},g)}}}),
      ...sheen3(F,S,{side:-1,shin:16,thr:.35,w:W*.32,op:.36,v0:.12,v1:.86}));
    if(o2>.55&&!inner)F.parts.push(...sheen3(F,S,{side:1,shin:18,thr:.42,w:W*.28,op:.26,v0:.25,v1:.85}))}
  /* stamens round the pistil, seen once the cup opens (as lot 9) */
  if(o2>.42&&!LOD){const an=cw.an||(h2l(c)[2]<.35?'#1c1418':'#2a2430'),fil=[],ant=[];for(let i=0;i<6;i++){const a=(i*60+30)*D,cx=Math.cos(a),sy=Math.sin(a);fil.push([[cx*Dm*.04,sy*Dm*.04,Dm*.01],[cx*Dm*.07,sy*Dm*.07,Dm*.12]]);ant.push([[cx*Dm*.07,sy*Dm*.07,Dm*.11],[cx*Dm*.085,sy*Dm*.085,Dm*.2]])}
    const pz=PJ3(F,[0,0,Dm*.12])[2];F.parts.push({z:pz,cast:false,fn:pp=>{const P=q=>PJ3(F,q);E('path',{d:fil.map(q=>{const a=P(q[0]),b=P(q[1]);return`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}).join(''),stroke:'#3a3a34','stroke-width':f(Math.max(.4,Dm*.014)),fill:'none'},pp);
      const pi=tubeFlat(F.B,F.O,[[0,0,0],[0,0,Dm*.1],[0,0,Dm*.18]],Dm*.045,Dm*.04,'#d8dcb0',{ink:'#7a8a50'});pi.fn(pp);const st=P([0,0,Dm*.19]),r=Dm*.03;E('path',{d:`M${f(st[0]-r*1.4)},${f(st[1])}a${f(r*1.4)},${f(r)} 0 1,0 ${f(r*2.8)},0a${f(r*1.4)},${f(r)} 0 1,0 ${f(-r*2.8)},0`,fill:'#efe6b8',stroke:'#a09a60','stroke-width':.35},pp);
      E('path',{d:ant.map(q=>{const a=P(q[0]),b=P(q[1]);return`M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`}).join(''),stroke:an,'stroke-width':f(Math.max(.8,Dm*.028)),fill:'none','stroke-linecap':'round'},pp)}})}
  render3(F,Dm*.5);return F}
/* the head as tulipHead (lot 9): the fleshy peduncle rises along the stem and bends little by little toward where the flower looks; at the rim it is short and the flower leans out */
function l106TulPlant(g,t,o,list,K,sid){const cw=cwPick(list,o),op=Math.max(.05,Math.min(1,o.op??R(.6,.85))),Dm=(o.cm||K.cm)*UPC,k=G(g),B=frameOf(o,.25),gh=GHI[sid],up=l54Up(B),ax=B[2],U0=l54U0(ax,up);
  const sw=gh.sw,Lp=Dm*R(1.4,1.8)*(K.lp||1)*(o.rim?.55:1),Lq=B.reach?Math.max(Dm*.7,Math.min(Lp,B.reach*.38)):Lp;
  const res=lsTurtle([['F',{l:Lq*.45,w0:sw*1.12,w1:sw*1.06,c:TUL_SC}],['F',{l:Lq*.55,w1:sw,aim:ax,k:.24}],['K',{main:1}]],{p:[0,0,0],H:up,U:U0,wig:.035,seg:Dm*.22}),apex=res.organs[0].pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:TUL_SC,organ:(og,pos)=>({parts:[{z:pos[2],fn:par=>l106TulFlower(par,lsFrame(og,null,R(-.12,.12)),pos,Dm,cw,op,K)}]})});
  open(k,t,1000,6,.35);return lsNeck(res,[0,0,0],apex)}

/* ---------- lily-flowered tulip (Tulipa, groupe Fleur de lis: 'Ballade', 'West Point', 'White Triumphator', 'Ballerina', 'Red Shine', 'Marilyn', 'Mariette', 'China Pink',
   'Aladdin', 'Claudia', 'Purple Dream', 'Burgundy', 'Sapporo', 'Elegant Lady'): a tall slender stem; six long, narrow, sharply pointed tepals forming a waisted, elongated goblet,
   their tips arching outward like a lily's (a star when the flower opens wide); bud slim and pointed. Picotee varieties edged white, gold or pink; 'Marilyn' flamed raspberry ---------- */
const CW_L106LYS=[{id:'ballade',n:'Magenta liseré de blanc (Ballade)',c:'#b8367c',edge:'#f8f2f2',ew:.2,bl:'#f4f0e8'},{id:'west-point',n:'Jaune d’or (West Point)',c:'#f4c81e',bl:'#e8b020'},
  {id:'white-triumphator',n:'Blanc (White Triumphator)',c:'#f7f4ec',bl:'#ece4b8',g:.5},{id:'ballerina',n:'Orange mandarine (Ballerina)',c:'#f07a2a',cb:'#e2582e',bl:'#f2c040'},
  {id:'red-shine',n:'Rouge à cœur bleu (Red Shine)',c:'#c41a2a',bl:'#24203a'},{id:'marilyn',n:'Blanc flammé de framboise (Marilyn)',c:'#f6f0ee',fl:'#c4204e',bl:'#f2e8c8'},
  {id:'mariette',n:'Rose satiné (Mariette)',c:'#e87aa0',bl:'#f4f0f0'},{id:'china-pink',n:'Rose tendre (China Pink)',c:'#f0a2bc',bl:'#f6f2f2'},
  {id:'aladdin',n:'Rouge liseré de jaune (Aladdin)',c:'#d0262a',edge:'#f2c83a',ew:.15,bl:'#f2c83a'},{id:'claudia',n:'Pourpre liseré de blanc (Claudia)',c:'#8a3a8a',edge:'#f6f2f4',ew:.2,bl:'#f4f0f0'},
  {id:'purple-dream',n:'Lilas pourpré (Purple Dream)',c:'#a66cba',bl:'#f2eef4'},{id:'burgundy',n:'Pourpre (Burgundy)',c:'#6e2468',bl:'#f2eef4'},
  {id:'sapporo',n:'Jaune pâle virant au blanc (Sapporo)',c:'#f2ebb6',bl:'#e8d880',g:.4},{id:'elegant-lady',n:'Crème liseré de rose (Elegant Lady)',c:'#f4ecd2',edge:'#e08aa6',ew:.22,bl:'#ece0a8'}];
const L106_LYS={cm:8,L:1.04,Wo:.27,Wi:.26,cup:-.42,cb0:.55,bow:.03,lp:1.2,wp:prof([[0,.4],[.2,.8],[.45,1],[.7,.8],[.88,.38],[1,0]]),
  /* the base flares, the middle stands nearly upright (the waist), then the point arches out; inner tepals a little less */
  ang:(o2,inner,wide)=>{const ab=7+20*o2+12*wide+(inner?0:3),am=1+9*o2+14*wide,at=-7+(84+30*wide)*Math.pow(o2,.9)+(inner?-6:4);return t=>t<.45?ab+(am-ab)*sm01(t/.45):am+(at-am)*Math.pow((t-.45)/.55,1.7)},
  pat:(cw,inner,o2)=>{const P=[];if(cw.edge)P.push({p:l106Edge(cw.ew),c:cw.edge,fi:.95,ba:.9});if(cw.fl){const q=l54Flame({fe:1},inner);P.push({p:q,c:mix(cw.fl,'#7a8a50',.4*(1-o2)*(1-o2)),fi:.9,ba:.85})}return P}};
const l106Lys=(g,t,o)=>l106TulPlant(g,t,o,CW_L106LYS,L106_LYS,'tulipe-fleur-de-lys');

/* ---------- viridiflora tulip (Tulipa, groupe Viridiflora: 'Spring Green', 'Groenland', 'China Town', 'Artist', 'Golden Artist', 'Florosa', 'Esperanto', 'Night Rider', 'Doll's Minuet',
   'Formosa', 'Flaming Spring Green'): a single late tulip, its tepals a little pointed and thick, each marked on its back with a broad green flame up the midrib, feathered at its edges,
   showing faintly inside; the green deepest in bud. Late, long-lasting ---------- */
const CW_L106VIR=[{id:'spring-green',n:'Ivoire flammé de vert (Spring Green)',c:'#f4f0da',gr:'#86a650',gw:.36,bl:'#e8e4b0'},{id:'groenland',n:'Rose flammé de vert (Groenland)',c:'#ee94b0',gr:'#88a458',gw:.34,bl:'#f2ecd0'},
  {id:'china-town',n:'Rose tendre flammé de vert (China Town)',c:'#f4b2c6',gr:'#94ac60',gw:.3,bl:'#f4ecd8'},{id:'artist',n:'Saumon orangé flammé de vert (Artist)',c:'#e8865a',cb:'#d4745a',gr:'#7e9450',gw:.42,bl:'#f0c068'},
  {id:'golden-artist',n:'Orange doré flammé de vert (Golden Artist)',c:'#f2a83a',gr:'#8a9a48',gw:.4,bl:'#f2c848'},{id:'florosa',n:'Crème rosé flammé de vert (Florosa)',c:'#f2d0c8',gr:'#8aa85a',gw:.36,bl:'#f0e4c0'},
  {id:'esperanto',n:'Rouge flammé de vert (Esperanto)',c:'#c8242e',gr:'#6a8a48',gw:.32,bl:'#2a2a2a'},{id:'night-rider',n:'Pourpre flammé de vert (Night Rider)',c:'#7a3a86',gr:'#6e8a52',gw:.32,bl:'#f0eef0'},
  {id:'dolls-minuet',n:'Magenta flammé de vert (Doll’s Minuet)',c:'#c8307a',gr:'#7a9a50',gw:.3,bl:'#f2eef0'},{id:'formosa',n:'Jaune flammé de vert (Formosa)',c:'#f2d240',gr:'#7e9e44',gw:.34,bl:'#e8c020'},
  {id:'flaming',n:'Blanc flammé de vert et de rouge (Flaming Spring Green)',c:'#f6f2e6',gr:'#86a650',gw:.3,fl:'#c4202e',bl:'#ece4b8'}];
const L106_VIR={cm:7,L:.92,Wo:.34,Wi:.32,cup:-.46,bow:.04,wp:prof([[0,.38],[.22,.78],[.55,1],[.8,.86],[.94,.46],[1,.1]]),
  ang:(o2,inner,wide)=>{const a0=14+(20+8*wide)*Math.pow(o2,1.15)+(inner?0:3),a1=-4+(56+22*wide)*Math.pow(o2,1.7)+(inner?0:6);return t=>a0+(a1-a0)*Math.pow(t,1.35)},
  pat:(cw,inner,o2)=>{const gc=mix(cw.gr,'#5e7a3a',.3*(1-o2)),P=[{p:l106Green(cw.gw*(inner?.85:1)*(1+.7*(1-o2)),.06),c:gc,fi:0,ba:.92},{p:l106Green(cw.gw*.45,.03),c:gc,fi:.4,ba:0}];
    if(cw.fl)P.push({p:[l54Flame({fe:1},inner)[1]],c:cw.fl,fi:.85,ba:.8});return P}};
const l106Vir=(g,t,o)=>l106TulPlant(g,t,o,CW_L106VIR,L106_VIR,'tulipe-viridiflora');

/* ---------- bunch-flowered daffodil (Narcissus tazetta, division 8: 'Paperwhite Ziva', 'Geranium', 'Minnow', 'Avalanche', 'Grand Soleil d'Or', 'Cragford', var. chinensis,
   'Silver Chimes', 'Martinette'): a stout, two-edged scape; at its top a papery spathe, split, and out of it an umbel of three to a dozen small, very fragrant flowers on pedicels of
   unequal length; each a flat star of six broad, rounded tepals (with a small point) round a short cup, behind it a slender green floral tube; buds erect in the middle, the oldest
   flowers outermost, turned outward ---------- */
const CW_L106NB=[{id:'paperwhite',n:'Blanc pur (Ziva)',c:'#fbfaf4',tr:'#f4f0dc',nn:[7,10],cl:.7,sz:.9},{id:'geranium',n:'Blanc à coupe orange (Geranium)',c:'#faf8f0',tr:'#ee5a24',nn:[4,6],sz:1.15},
  {id:'minnow',n:'Blanc à coupe jaune citron (Minnow)',c:'#f2e7a6',tr:'#f2c83a',nn:[3,5],sz:.85},{id:'avalanche',n:'Blanc à coupe jaune (Avalanche)',c:'#f9f7ee',tr:'#f2cc3a',nn:[6,9],sz:1},
  {id:'soleil-d-or',n:'Jaune à coupe orange (Grand Soleil d’Or)',c:'#f4cb2e',tr:'#f08a1e',nn:[5,8],sz:1},{id:'cragford',n:'Blanc à coupe orange vif (Cragford)',c:'#f8f6ee',tr:'#f0742a',nn:[4,6],sz:1.1},
  {id:'chinensis',n:'Blanc à coupe jaune d’or (Chinese Sacred Lily)',c:'#fbf9f0',tr:'#f2b828',nn:[5,8],sz:1},{id:'silver-chimes',n:'Blanc à coupe blanche (Silver Chimes)',c:'#f6f2e2',tr:'#f2e6a4',nn:[5,8],sz:1.05,cl:1.3},
  {id:'martinette',n:'Jaune d’or à coupe orange (Martinette)',c:'#f6d034',tr:'#ef7a22',nn:[4,6],sz:1.05},
  {id:'golden-dawn',n:'Jaune d’or profond à coupe orange (Golden Dawn)',c:'#f0c61c',tr:'#f08a08',nn:[5,8],sz:1,late:1}];
const L106_TTEP=prof([[0,.4],[.2,.85],[.5,1],[.78,.86],[.93,.5],[1,.16]]);
/* the short cup in the flower's frame (as narTrumpet, lot 41): rings from its base to its crimped rim; the anthers show in its mouth */
function l106Cup(par,B,O,R0,cw,o2,cache){const nz=B[2][2],Lt=R0*(.12+.1*o2)*(cw.cl||1),rb=R0*.15,rm=R0*(.22+.1*o2),ph=(O[0]*.31+O[1]*.17)%6.283,nr=DET>=1.5?16:12,rings=[],c=cw.tr,P=pal7(c);
  for(const v of[0,.5,1]){const q=[];for(let i=0;i<nr;i++){const a=i/nr*6.283,fr=v===1?1+.07*o2*Math.sin(a*8+ph):1,r=(rb+(rm-rb)*Math.pow(v,.8))*fr;q.push([Math.cos(a)*r,Math.sin(a)*r,v*Lt])}rings.push(q)}
  const all=[];for(const q of rings)for(const p of q){const s=PJ(B,O,p);all.push([s[0],s[1]])}
  const ink=shd(c,h2l(c)[2]>.85?-.5:-.42),rim=rings[2].map(p=>{const s=PJ(B,O,p);return[s[0],s[1]]});E('path',{d:smooth(hull2(all)),fill:l41T(cache,c,.62),stroke:ink,'stroke-width':.45,'stroke-opacity':.6},par);
  if(nz>.08){E('path',{d:smooth(rim),fill:l41T(cache,c,.5),stroke:ink,'stroke-width':.45,'stroke-opacity':.6},par);
    if(!LOD){const th=rings[1].map(p=>{const s=PJ(B,O,[p[0]*.8,p[1]*.8,p[2]]);return[s[0],s[1]]});E('path',{d:smooth(th),fill:P.d1,opacity:.45},par);
      const sc=PJ(B,O,[0,0,Lt*.7]);let d='';for(let i=0;i<3;i++){const a=i*2.09+ph;d+=l41C(sc[0]+Math.cos(a)*rb*.5,sc[1]+Math.sin(a)*rb*.5,Math.max(.6,rb*.3))}E('path',{d,fill:'#f2d468',stroke:'#b0901a','stroke-width':.3},par)}}
  else E('path',{d:smooth(rim),fill:'none',stroke:ink,'stroke-width':.45,'stroke-opacity':.5},par)}
/* one flower: the six tepals spread flat (outer three a shade larger and behind), the cup, the floral tube behind, ending on the pedicel at O − Z·0.66 R0 */
function l106TazFlower(par,B,O,D,cw,op,cache){const k=G(par),R0=D/2,o2=sm01((op-.3)/.7),it=[],rot=(O[0]*.13+O[1]*.07)%6.283,cb=mix(cw.c,'#d8dcc0',.25);
  for(let j=0;j<6;j++){const inner=j%2,a0=.42+1.02*o2,a1=.6+1.02*o2+(inner?0:.06),l=ligule(B,O,{phi:rot+j*1.0472,r0:R0*.1,z0:inner?R0*.03:0,L:R0*(inner?.84:.9)*(.7+.3*o2),W:R0*(inner?.5:.56),wp:L106_TTEP,a0,a1,pw:1.2,th:.3,n:DET>=1.5?6:5,tw:inner?.08:-.06});
    it.push({l,c:cw.c,cb,lift:.2})}
  it.push({z:PJ(B,O,[0,0,R0*.12])[2],fn:kk=>l106Cup(kk,B,O,R0,cw,o2,cache)});
  it.push({z:PJ(B,O,[0,0,-R0*.3])[2],fn:kk=>spBud(kk,l41Fr(V3.sc(B[2],-1),B[1]),V3.add(O,toV(B,[0,0,R0*.02])),R0*.68,R0*.2,'#9ab26a',{tp:.15,pw:.5})});
  spPetals(k,it,cache);return k}
/* a bud: slim, erect, greenish, the colour showing at its end */
function l106TazBud(par,B,O,D,cw,a){const s=D*(.38+.16*a);spBud(par,B,V3.add(O,toV(B,[0,0,-s*.06])),s,s*.36,mix(cw.c,'#9aae68',.6-.45*a),{tp:.45,pw:.6})}
function l106NbPlant(g,t,o){if(typeof nbqSvPlant==='function'&&typeof SV_ON!=='undefined'&&SV_ON)return nbqSvPlant(g,t,o);/* the tazetta in native SVG (yz-narcissus-bouquet.js) */const cw=cwPick(CW_L106NB,o),op=Math.max(.05,Math.min(1,o.op??R(.6,1))),D=(o.cm||3)*UPC*(cw.sz||1),k=G(g),sc=['#2e4a32','#557a58','#80a682','#b2ccb0'],cache={};
  const B=frameOf(o,.3,true),up=l54Up(B),face=B[2],U0=l54U0(face,up),kr=B.reach?Math.min(1,Math.max(.2,B.reach*.4/(D*4.4))):1,w=Math.max(2,D*.14),Ls=D*(o.rim?.9:4.4)*kr;
  /* the umbel: n pedicels out of the spathe, the oldest outermost and turned out, the youngest buds erect in the middle */
  const n=o.rim?2:Math.min(DET>=1.5?12:7,Math.round(R(cw.nn[0],cw.nn[1]+.4))),mods=[['F',{l:Ls,w0:w*1.1,w1:w,e:.01}],['Sp',{}],['F',{l:D*.1,w1:w*.9}]];
  for(let i=0;i<n;i++){const age=i===0?op:Math.max(0,Math.min(1,op*1.15-i/n*(op<.6?.8:.6)+R(-.08,.08))),a=i*137.5+R(-12,12),el=i===0?R(6,14):age<.3?R(8,18):R(22,44);
    mods.push(['[',{w:Math.max(1.2,w*.4)}],['/',{a}],['&',{a:el}],['F',{l:D*(age<.3?.5:.65+.4*age)*R(.85,1.15)*(o.rim?.7:1),w1:Math.max(1.12,w*.3),e:age<.3?.02:-.04}],[i?'Kb':'K',{age,i}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.015,seg:D*.12,T:[0,1,0],e:.01,w:w*1.1});for(const ch of res.chains)ch.c=sc;
  const apex=V3.add(res.organs.find(q=>q.t==='Sp').pos,V3.sc(up,D*.1));
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,organ:(og,pos)=>{
    if(og.t==='K'||og.t==='Kb'){const a=Math.min(og.p.age,op*1.1);if(a<.3){const Bf=l41Fr(og.H,up,R(-.2,.2));return{parts:[{z:pos[2]+og.H[2]*D*.2,fn:par=>l106TazBud(par,Bf,pos,D,cw,a/.3)}]}}
      const ax=V3.nz(V3.add(og.H,V3.sc(face,.55))),Bf=l41Fr(ax,up,R(-.2,.2)),c=V3.add(pos,V3.sc(ax,D*.34));return{parts:[{z:c[2]+ax[2]*D*.1,fn:par=>l106TazFlower(par,Bf,c,D,cw,a,cache)}]}}
    /* the spathe: papery, split, standing beside the umbel */
    if(og.t==='Sp'){const Bs=l41Fr(V3.nz(V3.add(og.H,V3.sc(face,-.3))),V3.sc(face,-1),0),l=ligule(Bs,V3.add(pos,V3.sc(og.H,-D*.12)),{phi:R(-.4,.4),r0:w*.4,z0:0,L:D*1.2,W:D*.28,wp:NAR_SPA,a0:.12,a1:.32,pw:1.2,th:1.6,tip:'point',n:5,tw:R(-.4,.4)});
      return{parts:[{z:pos[2]-1e-3,fn:par=>drawLig(par,[{l,c:'#d6c296',ink:'#8a7650'}])}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- sweet violet (Viola odorata: 'Königin Charlotte', 'Czar', 'Alba', 'Rosea', 'Red Charm', 'Sulphurea', 'Cœur d'Alsace'; Parma violets V. × parmensis 'Duchesse de Parme',
   'Marie-Louise'): sold as small tied posies; slender peduncles from the tie, each crooked at its top so the flower nods; five unequal petals — two upper ones swept back, two side
   ones bearded at their base, the broad lower one veined dark on a white throat and drawn out behind into a short spur; small green sepals; the Parma violets double, pale lavender.
   Round them a collar of heart-shaped, crenate leaves on long petioles ---------- */
const CW_L106VI=[{id:'violet',n:'Violet (Königin Charlotte)',c:'#5a2e92',top:'#62359a'},{id:'czar',n:'Violet profond (Czar)',c:'#40227a',top:'#482a84'},
  {id:'blanc',n:'Blanc (Alba)',c:'#f7f5ee',vn:'#7a5aa8',eye:'#f2e6a8'},{id:'rose',n:'Rose (Rosea)',c:'#d48ab4',top:'#da94bc',vn:'#7a2a5a'},
  {id:'red-charm',n:'Pourpre rougeâtre (Red Charm)',c:'#8a2a6e',top:'#922f76'},{id:'sulphurea',n:'Abricot (Sulphurea)',c:'#ecc08e',top:'#e2b08a',vn:'#7a4a6a',eye:'#f2d07a'},
  {id:'coeur-alsace',n:'Rose saumoné (Cœur d’Alsace)',c:'#e2a0b4',vn:'#8a3a5a'},
  {id:'parme',n:'Lavande double (Duchesse de Parme)',c:'#a894d2',top:'#b2a0d8',dbl:1},{id:'marie-louise',n:'Bleu lavande double à cœur blanc (Marie-Louise)',c:'#8676c4',dbl:1,heart:'#f2eef6'}];
const L106_VPET=prof([[0,.3],[.25,.8],[.6,1],[.85,.9],[1,.6]]);
/* one flower in its frame (Z its face): sepals and spur behind, the five petals (a second, smaller row in the Parma violets), the veins and the beak of the style */
function l106VioFlower(par,B,O,D,cw,op,cache){const k=G(par),R0=D/2,nz=B[2][2],o2=sm01((op-.25)/.75),it=[],pc=[],c=cw.c,top=cw.top||c,a0=.95+.4*o2,a1=1.25+.3*o2,det=DET>=1.5,vn=cw.vn||shd(c,-.62);
  /* the spur, back and a little down, and five narrow sepals behind the petals */
  const spAx=V3.nz(V3.add(V3.sc(B[2],-1),V3.sc(B[1],-.5)));it.push({z:PJ(B,O,[0,-R0*.15,-R0*.3])[2],fn:kk=>spBud(kk,l41Fr(spAx,B[2]),V3.add(O,toV(B,[0,-R0*.08,-R0*.02])),R0*.6,R0*.24,mix(c,'#ffffff',.06),{tp:.15,pw:.5})});
  if(nz<.1&&!LOD)for(let j=0;j<5;j++)it.push({l:ligule(B,O,{phi:(54+j*72)*D2R,r0:R0*.08,z0:-R0*.05,L:R0*.42,W:R0*.08,wp:L54_NSEG,a0:1.5,a1:1.9,pw:1.2,th:.2,tip:'point',n:4}),c:'#5a7e3c',cb:'#6e8e4c',lift:.25});
  const P5=[[120,.72,.34,top,-.04,1.5],[60,.72,.34,top,-.04,1.5],[200,.64,.3,c,0,1.25],[340,.64,.3,c,0,1.25],[270,.68,.42,c,.03,1.18]];
  P5.forEach(([ph,Lk,Wk,cc,dz,ar],j)=>{const l=ligule(B,O,{phi:ph*D2R+R(-.05,.05),r0:R0*.06,z0:R0*dz,L:R0*Lk*(.75+.25*o2),W:R0*Wk,wp:L106_VPET,a0,a1:a1*ar/1.25,pw:1.2,th:.3,tip:'round',wav:.06,wk:3,n:det?6:5,tw:R(-.15,.15)});pc.push(l);
    it.push({l,c:cc,cb:mix(cc,'#e8e4d8',.25),lift:.35,basec:j>1&&!cw.dbl?cw.eye||'#f6f2f4':null,bf:.26,bo:.9})});
  if(cw.dbl)for(let j=0;j<(det?7:5);j++){const n=det?7:5,l=ligule(B,O,{phi:(j+.5)*6.283/n+R(-.1,.1),r0:R0*.04,z0:R0*.06,L:R0*R(.4,.5)*(.7+.3*o2),W:R0*.24,wp:L106_VPET,a0:.5+.5*o2,a1:.8+.5*o2,pw:1.2,th:.4,tip:'round',wav:.1,wk:3,n:5,tw:R(-.3,.3)});
    it.push({l,c:j%3===0&&cw.heart?cw.heart:mix(c,'#ffffff',.12),cb:mix(c,'#e8e4d8',.25),lift:.4})}
  spPetals(k,it,cache);if(LOD||nz<.05||cw.dbl)return k;
  /* dark veins fanning on the three lower petals, from the throat */
  let d='';for(const l of pc.slice(2)){const n=l.S.length-1;for(const cc of[1,2,3]){const q=[];for(let i=0;i<=3;i++){const ii=Math.round(i/3*n*.5);q.push([l.S[ii][cc][0],l.S[ii][cc][1]])}d+=smooth(q,false)}}
  E('path',{d,stroke:vn,'stroke-width':f(Math.max(.35,R0*.03)),'stroke-opacity':.6,fill:'none','stroke-linecap':'round'},k);
  const e=PJ(B,O,[0,-R0*.03,R0*.07]),er=Math.max(.6,R0*.08);E('path',{d:l41C(e[0],e[1],er),fill:'#e8e0a0',stroke:'#8a9a50','stroke-width':.3},k);return k}
/* a bud: a nodding ovoid in its green sepals, the colour showing */
function l106VioBud(par,B,O,D,cw,a){const s=D*(.36+.16*a);spBud(par,B,O,s,s*.42,mix(cw.c,'#5f8a3e',.55-.4*a),{tp:.45,pw:.6})}
/* a leaf: broadly heart-shaped, blunt, the margin crenate, palmately veined; on the screen at (x,y) along ang, foreshortened across by face (after l67Heart) */
function l106VioLeaf(par,x,y,ang,len,col,o={}){const g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),P=pal7(col),ct=Math.max(.22,o.face??.7),pl=len*.18,bl=len-pl,bd=o.bend??0,nT=DET>=1.5?13:9;
  /* half outline from the sinus round the basal lobe to the tip, crenate: (along, across) in blade lengths */
  const H0=[[.08,0],[-.06,.14],[-.04,.34],[.1,.47],[.3,.5],[.52,.44],[.72,.34],[.86,.22],[.96,.09],[1,0]],half=[];
  for(let i=0;i<=nT*2;i++){const t=i/(nT*2),j=Math.min(H0.length-2,Math.floor(t*(H0.length-1))),fr=t*(H0.length-1)-j,a=H0[j],b=H0[j+1],cr=i%2?1:.94;half.push([a[0]+(b[0]-a[0])*fr,(a[1]+(b[1]-a[1])*fr)*(i&&i<nT*2?cr:1)])}
  const pt=(q,s)=>[pl+bl*q[0],s*bl*q[1]*ct+bd*bl*q[0]*q[0]],up=half.map(q=>pt(q,1)),dn=half.map(q=>pt(q,-1)).reverse(),out=up.concat(dn.slice(1,-1));
  E('path',{d:`M0,0Q${f(pl*.5)},${f(bd*pl*.1)} ${f(pl+bl*.08)},0`,stroke:shd(col,-.28),'stroke-width':f(Math.max(1.1,len*.035)),fill:'none','stroke-linecap':'round'},g);
  E('path',{d:smooth(out),fill:toneAt(P,o.I??.6),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5,'stroke-linejoin':'round'},g);
  if(!LOD){const mid=[[.08,0],[.4,0],[.7,0],[.97,0]].map(q=>pt(q,0));E('path',{d:smooth(up.concat(mid.slice().reverse())),fill:P.d1,opacity:.3},g);
    let d=smooth(mid,false);for(const[u,v,u1]of[[.08,.36,.12],[.1,.42,.36],[.3,.36,.62]])for(const s of[-1,1]){const a=pt([u,0],0),b=pt([u1,v],s);d+=`M${f(a[0])},${f(a[1])}Q${f((a[0]+b[0])/2)},${f(a[1]+(b[1]-a[1])*.3)} ${f(b[0])},${f(b[1])}`}
    E('path',{d,stroke:P.l1,'stroke-width':f(Math.max(.4,len*.012)),'stroke-opacity':.55,fill:'none'},g)}return g}
/* the posy: the tied bundle of stems below (the bouquet's stem), from the tie the peduncles spread over the front, each rising, then crooked toward where its flower nods;
   a few buds hang lower; the leaves stand round them on their petioles */
function l106VioPlant(g,t,o){const cw=cwPick(CW_L106VI,o),op=Math.max(.05,Math.min(1,o.op??R(.6,1))),D=(o.cm||2)*UPC,k=G(g),B=frameOf(o,.35,true),up=l54Up(B),face=B[2],U0=V3.nz(l54U0(face,up)),
    sc=['#2e4a22','#4a7036','#6e9650','#a2c282'],lc='#3e6a2c',cache={},det=DET>=1.5;
  const nF=o.rim?2:Math.round(R(det?5:4,det?7.4:5.4)),nB=o.rim?0:Math.round(R(1,1.9)),nL=o.rim?0:Math.round(R(3,3.9)),Lp=D*4.2*(o.rim?.5:1),kr=B.reach?Math.min(1,Math.max(.3,B.reach*.42/Lp)):1,w=Math.max(1.15,D*.08),ph=R(-20,20);
  const rad=a=>V3.sc(rotA(U0,up,a*D),-1),mods=[['F',{l:Lp*.3*kr,w0:w*2.6,w1:w*2.3}],['Tie',{}]];
  /* the flowers over the front (roll 180° turns the pitch toward the face), the buds anywhere, the leaves round the back and sides */
  for(let i=0;i<nF+nB;i++){const bud=i>=nF,a=bud?R(0,360):180+ph+(i-(nF-1)/2)*(200/Math.max(1,nF-1))*(nF>1?1:0)+R(-10,10),r=rad(a),age=bud?R(0,.6)*Math.min(1,op*2):i===0?op:Math.max(0,Math.min(1,op*R(.75,1.1))),
      fa=bud?V3.nz(V3.add(V3.add(V3.sc(r,.5),V3.sc(up,-.75)),V3.sc(face,.2))):V3.nz(V3.add(V3.add(V3.sc(face,.55),V3.sc(r,.6)),V3.sc(up,-.18))),Li=Lp*kr*R(.75,1.05)*(bud?.8:1);
    mods.push(['[',{w:w*1.05}],['/',{a}],['&',{a:bud?R(12,26):R(10,30)}],['F',{l:Li*.72,w1:w,e:.02}],['F',{l:D*.55,w1:w*.95,aim:fa,k:.42}],[bud?'Kb':'K',{age,fa}],[']',{}])}
  for(let j=0;j<nL;j++){const a=R(-30,30)+j*360/nL;mods.push(['[',{w:w*1.1}],['/',{a}],['&',{a:R(28,48)}],['F',{l:D*R(.8,1.4)*kr,w1:w,e:.06}],['Lv',{j}],[']',{}])}
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.03,seg:D*.28,T:[0,1,0],e:.01,w:w*2.6});for(const ch of res.chains)ch.c=sc;const tie=res.organs.find(q=>q.t==='Tie'),apex=tie.pos;
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:10,organ:(og,pos)=>{
    if(og.t==='K'&&og.p.age<.3)og.t='Kb';if(og.t==='K'){const ax=V3.nz(V3.add(og.H,V3.sc(og.p.fa,.6))),Bf=l41Fr(ax,up,R(-.2,.2)),c=V3.add(pos,V3.sc(ax,D*.06));return{parts:[{z:c[2]+ax[2]*D*.2,fn:par=>l106VioFlower(par,Bf,c,D,cw,og.p.age,cache)}]}}
    if(og.t==='Kb'){const Bf=l41Fr(og.H,up,R(-.2,.2));return{parts:[{z:pos[2]+og.H[2]*D*.2,fn:par=>l106VioBud(par,Bf,V3.add(pos,V3.sc(og.H,-D*.04)),D,cw,Math.min(1,og.p.age/.3))}]}}
    if(og.t==='Lv'){const len=D*R(1.5,2)*Math.max(.6,kr),face2=.3+.7*Math.abs(og.U[2]);return{parts:[lsLeaf2D(og,pos,len,(par,x,y,a,l)=>l106VioLeaf(par,x,y,a,l,lc,{face:face2,bend:R(-.08,.08),I:.5+.2*face2}))]}}
    /* the tie: a few turns of raffia round the bundle */
    if(og.t==='Tie'){const p=[pos[0],-pos[1]],a=Math.atan2(-og.H[1],og.H[0])/D,ww=w*2.6+1.2;return{ext:1,parts:[{z:pos[2]+.5,cast:false,fn:par=>{const gg=G(par,{transform:`translate(${f(p[0])},${f(p[1])}) rotate(${f(a)})`});
      E('path',{d:`M${f(-D*.06)},${f(-ww/2)}L${f(D*.06)},${f(-ww/2)}L${f(D*.06)},${f(ww/2)}L${f(-D*.06)},${f(ww/2)}Z`,fill:'#d2bc84',stroke:'#8a7448','stroke-width':.35},gg);
      if(!LOD)E('path',{d:`M0,${f(-ww/2)}L0,${f(ww/2)}`,stroke:'#a89060','stroke-width':.5},gg)}}]}}
    return null}});
  open(k,t,1000,8,.3);return lsNeck(res,[0,0,0],apex)}

/* ---------- snowflake (Leucojum aestivum 'Gravetye Giant', L. vernum and var. carpathicum): a hollow, two-edged, leafless scape; at its top a green, membranous spathe standing up,
   and out of it, on slender arching pedicels of unequal length, two to seven bells hanging plumb (one or two in L. vernum, larger); each bell six equal, broad tepals (unlike the
   snowdrop's), white, each with a green spot just under its little point (yellow in carpathicum); a round green ovary above the bell ---------- */
const CW_L106NV=[{id:'aestivum',n:'Blanc pointé de vert (aestivum)',c:'#f8f7f0',sp:'#6e9a3a'},{id:'gravetye',n:'Blanc pointé de vert, grandes clochettes (Gravetye Giant)',c:'#f9f8f2',sp:'#6a9838',big:1.2},
  {id:'vernum',n:'Blanc pointé de vert, nivéole de printemps (vernum)',c:'#faf9f4',sp:'#76a43e',ver:1},{id:'carpathicum',n:'Blanc pointé de jaune (vernum carpathicum)',c:'#faf8f0',sp:'#e8c22a',ver:1}];
const L106_NWP=prof([[0,.34],[.2,.8],[.55,1],[.82,.92],[.94,.55],[1,.12]]),L106_NSC=['#3a5a30','#5e8a4e','#8ab270','#bcd6a4'];
/* one bell hanging along its frame's Z: Lb long, a open (bud … 1); the tepals rounded at the shoulder, their points a little flared; the spot painted on both faces */
function l106NivBell(par,B,O,Lb,cw,a){const F={k:G(par),B,O,parts:[],so:.14,sd:null},o2=Math.max(0,Math.min(1,a)),bud=o2<.35,gr='#7e9e58',ver=!!cw.ver,
    base=bud?mix(cw.c,gr,.6-1.2*o2):cw.c,cP=pal7(base),cI=pal7(mix(base,'#c8d0b8',.1));
  for(let i=0;i<6;i++){const inner=i%2,ph=i*60+30+R(-4,4),sh=bud?12+26*o2:(ver?40:34)+12*o2-(inner?4:0),tip=bud?-12+6*o2:-2+16*o2+(inner?-3:3),
      S=petS({phi:ph,r0:Lb*.06,z0:inner?-Lb*.012:0,L:Lb*(inner?.97:1)*R(.98,1.02),W:Lb*(ver?.3:.27)*(.6+.4*o2),wp:L106_NWP,a0:sh,a1:tip,pw:.7,cup:-.32,bow:0,tw:R(-3,3)}),
      cv=R(.79,.83),ru=R(.42,.52),spot=[Array.from({length:14},(_,j)=>{const an=j/14*6.283;return[Math.cos(an)*ru,cv+Math.sin(an)*.085*(an>3.14?1:.8)]})];
    F.parts.push(...sheet3(F,S,{pal:cI,palB:cP,nu:5,nv:6,across:1.5,ew:.5,eo:.45,cast:0,paint:(g,front,X)=>{if(LOD)return;
      if(o2>.15)l54Paint(g,front,X,spot,bud?mix(cw.sp,gr,.4):cw.sp,front?.75:.95,.5);if(!front&&X.i0/(X.scr.length-1)<.22)E('path',{d:X.d,fill:l54Grad(X,0,.22,[[0,'#7e9e58',.45],[1,'#7e9e58',0]])},g)}}))}
  /* the round green ovary above the bell, where the pedicel arrives */
  F.parts.push({z:PJ3(F,[0,0,-Lb*.08])[2],cast:false,fn:pp=>spBud(pp,B,V3.add(O,toV(B,[0,0,-Lb*.2])),Lb*.26,Lb*.24,'#7e9e58',{tp:.1,pw:.6})});
  /* the anthers and style, seen from below in the open bell */
  if(o2>.6&&B[2][2]>.25&&!LOD){const s=PJ3(F,[0,0,Lb*.45]);F.parts.push({z:s[2],cast:false,fn:pp=>{let d='';for(let i=0;i<6;i++){const an=i*1.047+.5,q=PJ3(F,[Math.cos(an)*Lb*.07,Math.sin(an)*Lb*.07,Lb*.42]);d+=l41C(q[0],q[1],Math.max(.55,Lb*.03))}
    E('path',{d,fill:'#e8b830',stroke:'#a07a10','stroke-width':.3},pp)}})}
  render3(F,Lb*.8);return F}
function l106NivPlant(g,t,o){const cw=cwPick(CW_L106NV,o),ver=!!cw.ver,op=Math.max(.05,Math.min(1,o.op??R(.6,1))),D=(o.cm||1.8)*UPC*(cw.big||1)*(ver?1.15:1),k=G(g),B=frameOf(o,.3),up=l54Up(B),ax=B[2],U0=l54U0(ax,up),sc=L106_NSC;
  const dn=o.rim?[0,-1,0]:V3.sc(up,-1),Ls=D*(ver?4.5:6)*(o.rim?.3:1),kr=B.reach?Math.min(1,Math.max(.22,B.reach*.42/Ls)):1,L=Ls*kr,w=Math.max(1.8,D*.12),ph=R(0,360);
  const n=o.rim?1:ver?(rnd()<.3?2:1):Math.round(R(2.6,5.4)),ages=Array.from({length:n},(_,i)=>i===0?op:Math.max(0,Math.min(1,op*R(.6,1.05)-.1*i)));
  /* the scape, the spathe, the umbel's pedicels arching out and down, the bells hanging plumb at their ends */
  const mods=[['F',{l:L,w0:w*1.1,w1:w,e:.02}],['Sp',{}],['F',{l:D*.06,w1:w*.9}]];
  for(let i=0;i<n;i++)mods.push(['[',{w:Math.max(1.2,w*.55)}],['/',{a:ph+i*(360/n)+R(-20,20)}],['&',{a:i===0&&n>1?R(14,24):R(30,55)}],['F',{l:D*R(.7,1.5)*(ver?.75:1)*(o.rim?.6:1),w1:Math.max(1.15,w*.42),e:-.1}],
    ['F',{l:D*.4,w1:Math.max(1.12,w*.4),aim:V3.nz(V3.add(dn,V3.sc(ax,.15))),k:.4}],[i?'Kb':'K',{age:ages[i]}],[']',{}]);
  const res=lsTurtle(mods,{p:[0,0,0],H:up,U:U0,wig:.02,seg:D*.3,T:[0,1,0],e:.015,w:w*1.1});for(const ch of res.chains)ch.c=sc;const apex=V3.add(res.organs.find(q=>q.t==='Sp').pos,V3.sc(up,D*.06));
  const bell=(par,og,pos,a)=>{const Hd=V3.nz(V3.add(dn,V3.sc(og.H,.25))),Bf=l41Fr(Hd,V3.nz(V3.add(up,[0,0,.01])),R(-.3,.3)),s=D*(a<.35?.8+.2*a/.35:1);l106NivBell(par,Bf,V3.add(pos,V3.sc(Hd,s*.18)),s,cw,a)};
  lsPlant(k,res,{O:[0,0,0],apex,cols:sc,piece:10,organ:(og,pos)=>{
    if(og.t==='K'||og.t==='Kb'){const a=Math.min(og.p.age,op*1.1);return{parts:[{z:pos[2]+og.H[2]*D*.3,fn:par=>bell(par,og,pos,a)}]}}
    /* the spathe: green, membranous, standing up behind the umbel */
    if(og.t==='Sp'){const Bs=l41Fr(V3.nz(V3.add(og.H,V3.sc(ax,-.35))),V3.sc(ax,-1),0),l=ligule(Bs,V3.add(pos,V3.sc(og.H,-D*.1)),{phi:R(-.4,.4),r0:w*.4,z0:0,L:D*(ver?1.6:1.9),W:D*.26,wp:NAR_SPA,a0:.1,a1:.26,pw:1.2,th:1.4,tip:'point',n:5,tw:R(-.4,.4)});
      return{parts:[{z:pos[2]-1e-3,fn:par=>drawLig(par,[{l,c:'#9ab47a',ink:'#5a7a44'}])}]}}
    return null}});
  open(k,t,1100,4,.35);return lsNeck(res,[0,0,0],apex)}

Object.assign(GH,{'tulipe-fleur-de-lys':l106Lys,'tulipe-viridiflora':l106Vir,'narcisse-bouquet':l106NbPlant,'violette':l106VioPlant,'niveole':l106NivPlant});
Object.assign(CWS,{'tulipe-fleur-de-lys':CW_L106LYS,'tulipe-viridiflora':CW_L106VIR,'narcisse-bouquet':CW_L106NB,'violette':CW_L106VI,'niveole':CW_L106NV});
Object.assign(SZG,{'tulipe-fleur-de-lys':[7,7.5,8,8.5,9],'tulipe-viridiflora':[6,6.5,7,7.5,8],'narcisse-bouquet':[2.5,3,3,3.5,4],'violette':[1.5,2,2,2.5],'niveole':[1.5,1.8,2,2,2.5]});
Object.assign(GHI,{'tulipe-fleur-de-lys':{form:'cornet',size:2,k:'head',rk:.95,sw:4,sc:TUL_SC},'tulipe-viridiflora':{form:'cornet',size:2,k:'head',rk:.95,sw:4.4,sc:TUL_SC},
  'narcisse-bouquet':{form:'grappe',size:1.7,k:'head',rk:.85},'violette':{form:'disque',size:1.4,k:'head',rk:.85},'niveole':{form:'grappe',size:1.4,k:'head',rk:.8}});
for(const id of['tulipe-fleur-de-lys','tulipe-viridiflora','narcisse-bouquet','violette','niveole'])GH_BUDS.add(id);
STEML['tulipe-fleur-de-lys']=Object.assign({},STEML['tulipe-simple']);STEML['tulipe-viridiflora']=Object.assign({},STEML['tulipe-simple']);
