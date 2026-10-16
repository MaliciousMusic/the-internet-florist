/* ================= Serre, lot 87 — statices et fleurs papier, poussées par le L-système : statice à larges feuilles, statice de Tartarie, statice queue-de-rat, ixodia, glixia ================= */
/* les panicules poussent comme le gypsophile (lot 30) : l'axe de la tige (bzShoot du lot 20), les rameaux grandis par le L-système depuis ses nœuds (bzGrow), les centaines de fleurons
   rangés par profondeur et dessinés par lots de chemins (l30Batch) ; la queue-de-rat est un bouquet d'épis ondulés, l'ixodia un corymbe de capitules (les rayons en 3D de la matricaire),
   le glixia des faisceaux de hampes fines portant chacune une étoile papyracée. Tout trait qui relie une fleur à sa tige fait au moins 1,05 unité (sinon il se détache au rendu) */
/* stroked keys of the twigs, never thinner than 1.05 so that every floret stays joined to its axis */
const l87Tw=list=>l30TwKeys(list.map(([k,c,w])=>[k,c,Math.max(1.05,w)]));
/* the up direction across a twig of tangent h (its upper side, where the spikelets stand) */
const l87Up=h=>{const u=V3s([0,1,0],V3.sc(h,V3.dot([0,1,0],h)));return V3l(u)<1e-3?[0,0,1]:V3.nz(u)};
/* each chain of a grown branch walked at a given spacing: points, tangents and how far along the chain (0..1) */
function l87Walk(ch,step,from=0){const P=ch.pts,out=[];if(P.length<2)return out;const cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+V3l(V3s(P[i],P[i-1])));const L=cum[cum.length-1];if(L<1e-3)return out;
  let j=1;for(let s=L*from;s<=L+1e-6;s+=step){while(j<P.length-1&&cum[j]<s)j++;const a=P[j-1],b=P[j],t=Math.max(0,Math.min(1,(s-cum[j-1])/((cum[j]-cum[j-1])||1)));
    out.push({p:V3.add(a,V3.sc(V3s(b,a),t)),h:V3.nz(V3s(b,a)),u:s/L})}return out}
/* a dichasial panicle branch for the L-system: an internode, a twig to each side (rolled round, zigzag), then the axis goes on; S marks a spike at every end */
function l87PanRules(o={}){const a0=o.a0??30,a1=o.a1??46,wm=1.05;return{B:p=>{const l=p.l,w=p.w;if(p.o>=p.m)return[['F',{l,w0:w,w1:Math.max(wm,w*.7)}],['S',{o:p.o}]];const a=R(70,110),w2=Math.max(wm,w*.78);
  return[['F',{l:l*.4,w0:w,w1:Math.max(wm,w*.9)}],['[',{w:w2}],['/',{a}],['&',{a:R(a0,a1)}],['B',{o:p.o+1,m:p.m,l:l*(o.k1??.6),w:w2}],[']',{}],['F',{l:l*.3,w1:Math.max(wm,w*.85)}],
    ['[',{w:w2}],['/',{a:a+180+R(-25,25)}],['&',{a:R(a0-2,a1-2)}],['B',{o:p.o+1,m:p.m,l:l*(o.k2??.52),w:w2}],[']',{}],['F',{l:l*.3,w1:Math.max(wm,w*.8)}],['S',{o:p.o}]]}}}
/* the panicle of a statice: branches spiralled up the top Hi of the axis (longer below, so that it domes), each forked m times; returns the grown branches */
function l87Panicle(A,s0,Hi,S){const L=A.L,l0=L*s0,out=[],nb=S.nb,rules=l87PanRules(S);
  for(let j=0;j<nb;j++){const u=j/(nb-1),l=L-Hi*(1-u)*.96-UPC*.4;if(l<l0+4)continue;const az=(j*137.5+R(-12,12))*D,el=S.el0+(S.el1-S.el0)*u+R(-5,5),len=Hi*(S.l0-(S.l0-S.l1)*u)*R(.88,1.1);
    out.push(bzGrow(A,l,az,el,lsDerive([['B',{o:0,m:u<S.mu?S.m:S.m-1,l:len,w:S.wb}]],rules,S.m+2),{w:S.wb,seg:S.seg,T:[0,1,0],e:S.e,wig:S.wig}))}
  /* the tip of the axis forks too */
  out.push(bzGrow(A,L-.2,R(0,6.283),R(4,10),lsDerive([['B',{o:1,m:S.m,l:Hi*S.l1*1.1,w:S.wb}]],rules,S.m+2),{w:S.wb,seg:S.seg,T:[0,1,0],e:S.e,wig:S.wig}));return out}

/* ---------- statice à larges feuilles (Limonium latifolium = L. platyphyllum): a leafless wiry scape from a basal rosette, opening into a huge, airy, much-branched panicle (30–50 cm across),
   its zigzag branches forking three or four times; the tiny flowers (4–6 mm) in short one-sided spikes along the last twigs: a funnel of white papery calyx round a lavender-blue corolla,
   so that the whole reads as a lavender cloud; dried, the calyces keep it ---------- */
const L87_CW_LAT=[{id:'lavande',n:'Lavande bleuté (type)',c:'#b5a7d6'},{id:'bleu',n:'Bleu lavande (Blue Cloud)',c:'#9b96cf'},{id:'violet',n:'Violet (Violetta)',c:'#5e3f86'},
  {id:'bleu-nuit',n:'Bleu nuit (teinté)',c:'#4b4f8f',f:1},{id:'blanc',n:'Blanc (Alba)',c:'#f2f0ea',k:'#f6f3ea'}];
function l87Lat(g,t,o){const cw=cwPick(L87_CW_LAT,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||35)*UPC,sc=['#3b5228','#5f7a40','#89a266','#bfd29c'],tw='#62803e';
  const rf=.26*UPC*(DET<1.5?1.3:1),P=pal7(cw.c),kc=cw.k||'#f7f5ee',white=h2l(cw.c)[2]>.88;
  return bzShoot(g,t,o,{Lt:C*1.5,w0:3.2,w1:1.2,sc,bow:R(-.06,.06),grow:(A,parts,s0)=>{const items=[],nb=DET>=1.5?9:5,Hi=C*.62;
    const brs=l87Panicle(A,s0,Hi,{nb:Math.round(R(12,14)),m:3,mu:.85,el0:80,el1:46,l0:1.05,l1:.45,wb:1.6,seg:C*(DET<1.5?.028:.018),e:.045,wig:.09,a0:34,a1:52});
    /* a spikelet on the upper side of its twig: the oldest (near the base of the panicle) open first, the tips last */
    const fl=(p,h,age)=>{const m=op*1.35-age*.45+R(-.12,.12),up=l87Up(h),q=V3.add(p,V3.sc(up,rf*R(.35,.75))),side=V3.cr(h,up),c=V3.add(q,V3.sc(side,rf*R(-.5,.5)));
      if(m<.38){const r=rf*R(.5,.62);items.push({z:c[2],fn:B=>l30Add(B,'b',l30O(c[0],c[1],r))});return}
      const r=rf*R(.85,1.1)*Math.min(1,.65+.5*(m-.38)),n=V3.nz(V3.add(V3.sc(up,.8),[R(-.6,.6),R(-.2,.3),R(-.3,.8)])),I=lightI(n)+R(-.08,.08),ci=n[2]<-.1?0:I>.78?2:1;
      items.push({z:c[2],fn:B=>{l30Add(B,'w',l30O(c[0]+r*.15,c[1]-r*.28,r*.82));l30Add(B,'c'+ci,l30O(c[0],c[1]+r*.08,r*(white?.8:.7)));if(DET>=1.5&&n[2]>.2)l30Add(B,'e',l30O(c[0],c[1]+r*.08,r*.18))}})};
    for(const br of brs){l30Twigs(items,br,[[1.4,'t0'],[1.15,'t1'],[0,'t2']]);
      for(const ch of br.chains){if(ch.ord<(DET<1.5?2:1)&&br.chains.length>1)continue;for(const q of l87Walk(ch,rf*(DET<1.5?2.1:1.1),ch.ord>=2?.15:.5))for(let j=DET<1.5?1:rnd()<.6?3:2;j>0;j--)fl(q.p,q.h,(ch.ord>=2?.2:0)+q.u*.6)}
      for(const og of br.organs)if(og.t==='S')for(let i=0,n=Math.round(R(3,6));i<n;i++)fl(V3.add(og.pos,V3.sc(og.H,rf*(.3+i*.7))),og.H,.8+i*.08)}
    const keys=l87Tw([['t0',tw,1.4],['t1',mix(tw,'#a8bc8a',.2),1.18],['t2',mix(tw,'#b8c8a0',.3),1.05]]),ti=[.4,.62,.84].map(I=>toneAt(P,I));
    keys.push(['b',{fill:mix(cw.c,'#8aa060',.45)}],['w',{fill:mix(kc,'#b8b4a8',.25)}]);for(let i=0;i<3;i++)keys.push(['c'+i,{fill:white?toneAt(pal7(kc),[.62,.78,.92][i]):ti[i]}]);
    keys.push(['e',{fill:white?'#e8e4c8':shd(cw.c,-.35)}]);l30Batch(parts,items,keys,nb)}})}

/* ---------- statice de Tartarie (Goniolimon tataricum, « German statice »): a short stiff scape, winged and angular in its upper part, branching into a dense, rounded-triangular panicle
   (15–20 cm) of rigid zigzag branches; the spikelets crowded in dense short spikes at the ends: two to five flowers each, a funnel of silvery white papery calyx (the 'flower')
   round a small pinkish-mauve corolla soon gone; sold dried, natural white or dyed ---------- */
const L87_CW_TAT=[{id:'argent',n:'Blanc argenté (naturel)',c:'#ebe8e0',co:'#d68fae'},{id:'blanc',n:'Blanc (blanchi)',c:'#f6f4ee',co:'#eadde2'},{id:'rose',n:'Teinté rose',c:'#ecd3dc',co:'#d68fae'},
  {id:'lilas',n:'Teinté lilas',c:'#d7cbe3',co:'#a68cc4'},{id:'bleu',n:'Teinté bleu ciel',c:'#c4d2ea',co:'#8aa2d0',f:1},{id:'creme',n:'Crème (vieilli)',c:'#ece2c4',co:'#c8a080',f:1}];
function l87Tat(g,t,o){const cw=cwPick(L87_CW_TAT,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,tw=mix('#9a9c78',cw.c,.2),sc=[shd(tw,-.45),tw,mix(tw,'#c8d0a8',.3),mix(tw,'#eef0dc',.5)];
  const rc=.3*UPC*(DET<1.5?1.2:1),P=pal7(cw.c),ink=shd(cw.c,-.42);
  return bzShoot(g,t,o,{Lt:C*2.6,w0:3.6,w1:1.6,sc,bow:R(-.04,.04),grow:(A,parts,s0)=>{const items=[],nb=DET>=1.5?9:5,Hi=C*1.05;
    const brs=l87Panicle(A,s0,Hi,{nb:Math.round(R(11,13)),m:3,mu:.75,el0:74,el1:40,l0:.72,l1:.32,wb:2,seg:C*.03,e:.025,wig:.025,a0:38,a1:54,k1:.58,k2:.52});
    /* a spikelet: the funnel of calyx seen from outside (its hull) and its open papery limb when it looks our way; the corolla a speck of colour at the throat */
    const sp=(p,h,age)=>{const m=op*1.3-age*.35+R(-.12,.12),up=l87Up(h),side=V3.cr(h,up),n=V3.nz(V3.add(V3.add(V3.sc(up,.75),V3.sc(side,R(-.6,.6))),[R(-.2,.2),R(0,.2),R(-.1,.6)])),pos=V3.add(p,V3.sc(n,rc*.85));
      if(m<.36){const q=l23Seed(V3.add(p,V3.sc(n,rc*.2)),n,rc*1.5,rc*.62,DET>=1.5?8:6);items.push({z:pos[2],fn:B=>l30Add(B,'b',l23Poly(q))});return}
      const o2=Math.min(1,(m-.36)/.45),r=rc*(.6+.4*o2)*R(.9,1.1),q=DET>=1.5?l23Disc(pos,n,r,5,.18*o2,R(0,1.2),15):null,foot=[p[0],-p[1]],I=Math.abs(lightI(n))+R(-.05,.05),ti=I<.5?0:I<.72?1:2;
      items.push({z:pos[2],fn:B=>{if(DET<1.5){l30Add(B,'h'+Math.max(0,ti-1),l30O((pos[0]+p[0])/2,(pos[1]+p[1])/2,r*.9));if(n[2]>.05)l30Add(B,'l'+ti,l30O(pos[0],pos[1],r*.85));return}l30Add(B,'h'+Math.max(0,ti-1),l23Poly(l23Hull(q.concat([foot]))));if(n[2]>.05){l30Add(B,'l'+ti,DET>=1.5?smooth(q):l23Poly(q));if(n[2]>.3&&o2>.5&&rnd()<.4)l30Add(B,'co',l23Cir(pos[0],-pos[1],r*.15))}}})};
    for(const br of brs){l30Twigs(items,br,[[1.6,'t0'],[1.25,'t1'],[0,'t2']]);
      for(const ch of br.chains){if(ch.ord<1&&br.chains.length>1)continue;for(const q of l87Walk(ch,rc*(DET<1.5?1.5:.75),ch.ord>=2?.2:.55))for(let j=DET>=1.5&&rnd()<.5?2:1;j>0;j--)sp(q.p,q.h,q.u*.5+(ch.ord>=2?.2:0))}
      for(const og of br.organs)if(og.t==='S')for(let i=0,n=Math.round(R(6,10)*(DET<1.5?.6:1));i<n;i++)sp(V3.add(og.pos,V3.sc(og.H,rc*.6*i)),og.H,.7+i*.06)}
    const keys=l87Tw([['t0',tw,1.6],['t1',mix(tw,'#b4bc94',.25),1.3],['t2',mix(tw,'#c4c8a8',.35),1.08]]),st=(c)=>({fill:c,stroke:ink,'stroke-width':LOD?0:.3,'stroke-opacity':.6,'stroke-linejoin':'round'});
    keys.push(['b',st(mix(cw.c,'#9aa878',.45))]);for(let i=0;i<2;i++)keys.push(['h'+i,st(mix(toneAt(P,[.36,.56][i]),'#9a9a84',.25))]);for(let i=0;i<3;i++)keys.push(['l'+i,st(toneAt(P,[.6,.78,.94][i]))]);
    keys.push(['co',{fill:cw.co}]);l30Batch(parts,items,keys,nb)}})}

/* ---------- statice queue-de-rat (Psylliostachys suworowii, « Russian statice », « rat's tail »): a slender scape topped by a main spike, with a few lateral spikes branching near its top;
   each spike thin and cylindrical (8–20 cm × 1 cm), sinuous, crowded with tiny rose flowers (calyx and corolla both pink) in close rings, opening from the base, the tip still in bud and tapering ---------- */
const L87_CW_QDR=[{id:'rose',n:'Rose (type)',c:'#dc5f94'},{id:'rose-mauve',n:'Rose mauve (Pink Pokers)',c:'#c27b9f'},{id:'carmin',n:'Rose carmin',c:'#c2416e'},{id:'lilas',n:'Lilas (teinte claire)',c:'#b49cc9',f:1}];
/* a spike along a 3D polyline: rings of tiny florets round a dark core; behind the core first, the core, then the florets before it, all sorted by depth with the rest */
function l87Spike(items,pts,R0,rf,op,o={}){const W=l87Walk({pts},rf*1.05);const n=W.length;if(n<2)return;let ph=R(0,6.283);
  for(let i=0;i<n;i++){const{p,h,u}=W[i],[X,Y]=l23Across(h),tp=Math.min(1,u/.04)*(u>.82?Math.max(.25,1-(u-.82)/.18*.75):1),m=op*1.45-u*.9+R(-.06,.06),Rr=R0*tp*(m<.35?.75:1);
    if(i<n-1){const q=W[i+1].p,w=Math.max(1.05,Rr*.9);items.push({z:p[2]-.01,fn:B=>l30Add(B,'core',polyRibbon([[p[0],-p[1]],[q[0],-q[1]]],()=>w,null))})}
    const M=o.M||6;ph+=2.4;for(let j=0;j<M;j++){const az=ph+j*6.283/M,r=V3.add(V3.sc(X,Math.cos(az)),V3.sc(Y,Math.sin(az))),c=V3.add(p,V3.sc(r,Rr*.75)),I=lightI(V3.nz(V3.add(r,[0,.2,.35])))+R(-.06,.06);
      if(m<.35){const rr=rf*(.6+.25*tp);items.push({z:c[2],fn:B=>l30Add(B,'b'+(I>.65?1:0),l30O(c[0],c[1],rr))});continue}
      const rr=rf*R(.88,1.08)*Math.min(1,.7+.6*(m-.35)),ci=r[2]<-.2?0:I<.58?1:I<.8?2:3;items.push({z:c[2],fn:B=>{l30Add(B,'f'+ci,l30O(c[0],c[1],rr));if(DET>=1.5&&ci>=2&&rnd()<.5)l30Add(B,'w',l30O(c[0]+r[0]*rr*.35,c[1]+r[1]*rr*.35,rr*.28))}})}}}
function l87Qdr(g,t,o){const cw=cwPick(L87_CW_QDR,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,tw='#6a8048',sc=['#33461f','#55703a','#7e9a5c','#b8cc94'];
  const R0=.42*UPC,rf=.2*UPC,P=pal7(cw.c),Lq=o.spine?blen(o.spine):C*3.1,s1=Math.max(.5,1-Math.min(C,Lq*.45)/Lq-.03);
  return bzShoot(g,t,o,{Lt:C*3.1,w0:3,w1:2,s1,sc,bow:R(-.06,.06),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],nb=DET>=1.5?10:6,Ls=Math.min(C,L*.45);
    /* the main spike: the top of the axis, swaying more and more toward its tip (a sinuous tail), starting from the axis itself */
    const ph=R(0,6.283),ph2=R(0,6.283),am=C*.06,sa=A.sOf(L-Ls),main=[];for(let i=0;i<=40;i++){const s=sa+(1-sa)*i/40,fr=A.at(s),v=i/40,e=am*v*v;main.push(V3.add(fr.p,V3.add(V3.sc(fr.Sd,e*Math.sin(v*7.5+ph)),V3.sc(fr.Fr,e*.6*Math.sin(v*5.5+ph2)))))}
    {const sb=[],s2=Math.min(s1-.01,sa);for(let i=0;i<=10;i++)sb.push(A.at(s2+(sa-s2)*i/10).p);const pts=sb.concat(main.slice(1,33));l30Twigs(items,{chains:[{pts,ws:pts.map(()=>2)}]},[[0,'s0']])}
    l87Spike(items,main,R0,rf,op);
    /* two to four lateral spikes from the nodes just under it, sessile on a short curved base, rising and swaying as they go */
    const nl=Math.round(R(2,4));for(let j=0;j<nl;j++){const l=L-Ls*R(.95,1.05)-C*(.06+.16*j)*R(.85,1.15);if(l<l0+5)continue;const len=C*R(.5,.85)*(1-.12*j),n=Math.round(len/(UPC*.7)),mods=[['F',{l:UPC*R(.8,1.6),w1:1.6}]];
      for(let i=0;i<n;i++)mods.push(['F',{l:len/n,w1:1.3,wig:.14}]);const br=bzGrow(A,l,(j*137.5+R(-20,20))*D,R(24,36),mods,{w:1.8,seg:UPC*.7,T:[0,1,0],e:.06,wig:.1});
      const ch=br.chains[0];l30Twigs(items,{chains:[{pts:ch.pts.slice(0,Math.ceil(ch.pts.length*.8)),ws:ch.ws}]},[[0,'s0']]);const k=Math.max(2,Math.floor(ch.pts.length*.16));l87Spike(items,ch.pts.slice(k-1),R0*.9,rf,op*R(.85,1))}
    const keys=l87Tw([['s0',sc[1],2]]);keys.push(['core',{fill:mix(P.d2,tw,.3)}],['b0',{fill:mix(cw.c,'#7a9050',.5)}],['b1',{fill:mix(cw.c,'#9ab070',.35)}]);
    for(let i=0;i<4;i++)keys.push(['f'+i,{fill:toneAt(P,[.3,.5,.68,.86][i])}]);keys.push(['w',{fill:mix(cw.c,'#ffffff',.6)}]);l30Batch(parts,items,keys,nb)}})}

/* ---------- ixodia (Ixodia achillaeoides, Australian mountain daisy): a thin wiry stem, slightly sticky, with narrow linear leaves running down it in wings; at its top a flat corymb
   of 10–60 small papery heads (8–15 mm): a ring of spreading white petal-like bract laminae round a small yellow disc; the buds narrow urns of glossy bracts; dried it keeps its white ---------- */
const L87_CW_IXO=[{id:'blanc',n:'Blanc papier (naturel)',c:'#f5f2e8'},{id:'blanc-pur',n:'Blanc pur (alata)',c:'#fbfaf5'},{id:'creme',n:'Crème (séché)',c:'#eee4c8',f:1}];
function l87Ixo(g,t,o){const cw=cwPick(L87_CW_IXO,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||20)*UPC,sc=['#2f4220','#4f6a34','#738e52','#a8bc84'],tw='#5f7a42',lc='#6a8648';
  const P=pal7(cw.c),disc='#e4bf34',hr=.62*UPC*(DET<1.5?1.1:1);
  return bzShoot(g,t,o,{Lt:C*1.9,w0:2.6,w1:1.3,sc,bow:R(-.07,.07),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    const head=(og,age)=>{const m=op*1.3-age*.2+R(-.08,.08),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.35),[0,.75,0]),V3.sc(FW,.95))),pos=og.pos;
      if(m<.36){/* an urn-shaped bud: straw-green bracts tipped white */const len=hr*R(.85,1)*(.75+.5*Math.max(0,m)),c=V3.add(pos,V3.sc(ax,len*.5)),q=l23Seed(pos,ax,len*1.15,len*.72,DET>=1.5?10:7),t2=V3.add(pos,V3.sc(ax,len*.95));
        hd.push({z:c[2],fn:B=>{l30Add(B,'ub',l23Poly(q));if(m>.15)l30Add(B,'ut',l30O(t2[0],t2[1],len*.26*(m/.36+.3)))}});return}
      const o2=Math.min(1,(m-.36)/.5),r=hr*R(.85,1.12)*(.55+.45*o2),Bf=l30Fr(ax,[0,1,0],R(0,6.283)),O=pos,n=ax[2],rd=r*.34,dh=r*.24,tilt=-.08+1.3*(1-o2);
      hd.push({z:O[2]+r*.2*n,fn:B=>{const I=Math.max(.3,Math.min(1,lightI(n<-.1?V3.sc(ax,-1):ax))),q=n<-.1?'q':'r',NK=DET>=1.5?7:4;
        const rays=(r0,r1,w,cnt,ph,tl,tag)=>{for(let i=0;i<cnt;i++){const a=ph+i*6.283/cnt,e=[Math.cos(a),Math.sin(a),0],tg=[-e[1],e[0],0],L1=[],R1=[];
            for(let k=0;k<=NK;k++){const v=k/NK,d=r0+(r1-r0)*v,ww=w*Math.pow(Math.sin(Math.PI*Math.min(1,v*.85+.08)),.8)*(1-.55*v*v),z=tl*(d-r0);L1.push(PJ(Bf,O,[e[0]*d+tg[0]*ww,e[1]*d+tg[1]*ww,z]));R1.push(PJ(Bf,O,[e[0]*d-tg[0]*ww,e[1]*d-tg[1]*ww,z]))}
            const tip=PJ(Bf,O,[e[0]*(r1+w*.15),e[1]*(r1+w*.15),tl*(r1+w*.15-r0)]);l30Add(B,tag+(I>.62?1:0),l30Poly(L1.concat([tip],R1.reverse())))}};
        const ph=R(0,6.283);rays(rd*.7,r,r*.24,DET>=1.5?12:9,ph,tilt,q);if(DET>=1.5&&n>-.1)rays(rd*.6,r*.8,r*.2,8,ph+.3,tilt+.25,'u');
        if(n>-.1){const dc=[];for(const[zz,rr]of[[0,rd],[dh*.6,rd*.78],[dh,rd*.3]])for(const p of spDisc(Bf,O,rr,zz,10))dc.push(p);l30Add(B,'d',l30Poly(l30Hull(dc)));
          if(DET>=1.5){let d='';for(let i=0;i<7;i++){const a=i*2.4,rr=rd*.55*Math.sqrt((i+.5)/7),pp=PJ(Bf,O,[Math.cos(a)*rr,Math.sin(a)*rr,dh*.9]);d+=l30O(pp[0],-pp[1],rd*.12)}l30Add(B,'dd',d)}}
        else{const iv=[];for(const[zz,rr]of[[0,rd*1.15],[-dh*.8,rd*.95],[-dh*1.4,rd*.4]])for(const p of spDisc(Bf,O,rr,zz,10))iv.push(p);l30Add(B,'iv',l30Poly(l30Hull(iv)))}}})};
    /* the corymb: peduncles from the upper nodes, longer below so that the heads come level, each forking into a little cluster */
    const span=C*.5;{const q=A.at(1);head({pos:q.p,H:q.T},0)}
    let i=0;for(let l=L-UPC*.7;l>Math.max(l0+3,L-span);l-=UPC*R(.6,.9)*(1+(L-l)/span*.5),i++){const u=(L-l)/span,az=(i*137.5+R(-15,15))*D,len=(L-l)*R(1,1.2)/Math.cos(.7)+UPC*.8,k=1+Math.round(R(1.5,3.5)*(.4+u)),mods=[['F',{l:len*.55,w1:1.2,aim:[0,1,0],k:.05}]];
      for(let j=0;j<k;j++)mods.push(['[',{w:1.1}],['/',{a:j*360/k+R(-25,25)}],['&',{a:R(28,46)}],['F',{l:len*R(.28,.45),w1:1.05,aim:[0,1,0],k:.12}],['K',{a:u*.6+j*.25}],[']',{}]);mods.push(['F',{l:len*.3,w1:1.05,aim:[0,1,0],k:.2}],['K',{a:u*.5}]);
      const br=bzGrow(A,l,az,R(40,56),mods,{w:1.3,seg:UPC*.5,T:[0,1,0],e:.03,wig:.04});l30Twigs(items,br,[[1.15,'t0'],[0,'t1']]);for(const og of br.organs)if(og.t==='K')head(og,og.p.a)}
    /* the narrow leaves, alternate, all up the stem, shorter toward the corymb */
    for(let ll=L-span*.8;ll>l0+5;ll-=UPC*R(1.4,2)*(DET<1.5?1.7:1)){const v=Math.min(1,(L-ll)/(C*1.6)),q=l30On(A,ll,R(0,6.283),.7),H=V3.nz(V3.add(V3.sc(q.T,.9),q.r));
      parts.push(bzBlade(q.p,H,q.T,UPC*(1.4+2.4*v)*R(.85,1.1),.14,lc,{wp:LS_LANCE,droop:.12,arch:.05,fold:.3,face:.5}))}
    l30Batch(parts,items,l87Tw([['t0',tw,1.25],['t1',mix(tw,'#9ab07a',.25),1.05]]),DET>=1.5?6:3);
    const ink=mix(P.ink,'#8a8070',.5),keys=[['iv',{fill:'#b8ac78',stroke:'#5a5030','stroke-width':.3,'stroke-opacity':.6}]];
    for(const tg of['q','r','u'])for(const k of[0,1])keys.push([tg+k,{fill:tg==='q'?mix(toneAt(P,.52+.2*k),'#c8c0a0',.25):toneAt(P,tg==='u'?.66+.2*k:.6+.24*k),stroke:ink,'stroke-width':.25,'stroke-opacity':.5}]);
    keys.splice(7,0,['d',{fill:budFill(disc),stroke:shd(disc,-.5),'stroke-width':.3,'stroke-opacity':.6}],['dd',{fill:shd(disc,-.2)}]);
    keys.push(['ub',{fill:'#b4a874',stroke:'#5e5634','stroke-width':.3,'stroke-opacity':.6}],['ut',{fill:mix(cw.c,'#d8d0b0',.3)}]);l30Flowers(parts,hd,keys,DET>=1.5?8:4)}})}

/* ---------- glixia (« Brazilian star flower », sempre-viva: Syngonanthus / Comanthera, Eriocaulaceae; sold dried): fine straw-like scapes in loose sheaves, each from a small papery sheath,
   each ending in one tiny capitulum (5–8 mm): a star of pointed papery involucral bracts round a little cushion of florets; closed in the damp (a narrow cone), open when dry;
   sold natural (cream), bleached white, or dyed in many colours, the stems taking the dye ---------- */
const L87_CW_GLX=[{id:'naturel',n:'Naturel crème',c:'#f3f0e6'},{id:'blanchi',n:'Blanc (blanchi)',c:'#fbfaf6'},{id:'jaune',n:'Jaune',c:'#f0d35a',dy:1},{id:'peche',n:'Pêche',c:'#efb48a',dy:1},
  {id:'orange',n:'Orange',c:'#e8803a',dy:1},{id:'rose-pastel',n:'Rose pastel',c:'#f2c4d0',dy:1},{id:'rose',n:'Rose',c:'#e8a8bf',dy:1},{id:'rouge',n:'Rouge',c:'#b8283a',dy:1},
  {id:'mauve',n:'Mauve',c:'#c3a8d6',dy:1},{id:'violet',n:'Violet',c:'#6e3c8e',dy:1},{id:'bleu',n:'Bleu',c:'#5a7ec4',dy:1},{id:'gris',n:'Gris',c:'#a6a6a0',dy:1},{id:'noir',n:'Noir',c:'#2b2829',dy:1}];
function l87Glx(g,t,o){const cw=cwPick(L87_CW_GLX,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||35)*UPC,st=cw.dy?mix('#b5a988',cw.c,.55):'#b5a988',sc=[shd(st,-.45),st,mix(st,'#e8e0c8',.3),mix(st,'#f6f2e6',.5)];
  const P=pal7(cw.c),dark=h2l(cw.c)[2]<.35,hr=.48*UPC*(DET<1.5?1.15:1),ctr=cw.dy?shd(cw.c,dark?.25:-.18):'#d8c890';
  return bzShoot(g,t,o,{Lt:C*1.45,w0:2.2,w1:1.3,sc,bow:R(-.08,.08),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    /* a star: pointed bracts, flat when dry and open, raised into a cone when closed; its cushion of florets at the centre */
    const star=(og,age)=>{const m=op*1.3-age*.25+R(-.1,.1),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.45),[0,.5,0]),V3.sc(FW,1.05))),O=og.pos,o2=Math.max(0,Math.min(1,(m-.2)/.6)),r=hr*R(.85,1.12)*(.5+.5*o2),
        Bf=l30Fr(ax,[0,1,0],R(0,6.283)),n=ax[2],tl=.05+2.4*(1-o2),nr=DET>=1.5?14:10;
      hd.push({z:O[2]+1.5,fn:B=>{const I=Math.max(.3,Math.min(1,lightI(n<-.1?V3.sc(ax,-1):ax))),k=(n<-.1?'q':'r')+(I>.62?1:0),ph=R(0,6.283),pts=[];
        for(let i=0;i<nr*2;i++){const a=ph+i*3.1416/nr,d=i%2?r*.52:r*R(.9,1.05),pp=PJ(Bf,O,[Math.cos(a)*d,Math.sin(a)*d,tl*Math.max(0,d-r*.15)]);pts.push(pp)}
        l30Add(B,k,l30Poly(pts));if(n>-.1&&o2>.3){const dc=spDisc(Bf,O,r*.26,r*.08,DET>=1.5?9:6);l30Add(B,'c',l30Poly(dc))}else if(n<=-.1){const dc=spDisc(Bf,O,r*.18,-r*.06,6);l30Add(B,'cb',l30Poly(dc))}}})};
    /* a sheaf: a small sheath on the axis and five to twelve scapes leaving it, fanned, each rising and bending a little under its star */
    const sheaf=(l,az,el,cnt,lmax,age)=>{const q=l30On(A,l,az,0),s=l30Tilt(q.T,q.r,el*D);
      for(let j=0;j<cnt;j++){const a=j*6.283/cnt+R(-.3,.3),rr=V3.add(V3.sc(q.Fr,Math.cos(a)),V3.sc(V3.cr(q.T,q.Fr),Math.sin(a))),len=lmax*R(.45,1),n=Math.max(2,Math.round(len/(UPC*.8))),mods=[];
        for(let i=0;i<n;i++)mods.push(['F',{l:len/n,w1:1.08}]);mods.push(['K',{a:age+j*.04}]);const H=l30Tilt(s,rr,R(.18,.62));
        const res=lsTurtle(mods,{p:q.p,H,U:l87Up(H),w:1.15,seg:UPC*.8,T:[0,1,0],e:.012,wig:.05});
        l30Twigs(items,res,[[0,'t1']]);for(const og of res.organs)if(og.t==='K')star(og,og.p.a)}
      const sp=V3.add(q.p,V3.sc(s,UPC*.7));items.push({z:q.p[2]+.02,fn:B=>l30Add(B,'sh',polyRibbon([[q.p[0],-q.p[1]],[sp[0],-sp[1]]],i=>i?1.1:1.5,null))})};
    /* the main sheaf at the top of the axis, one or two side sheaves on longer forks below */
    {const q=A.at(1);star({pos:q.p,H:q.T},0)}sheaf(L-UPC*.3,0,4,Math.round(R(11,16)),C*.34,.1);
    for(let j=0,nj=Math.round(R(1,2));j<nj;j++){const l=L-C*(.28+.18*j)*R(.9,1.1);if(l<l0+6)continue;const az=(j*170+R(-30,30))*D,len=C*R(.12,.2),n=Math.max(2,Math.round(len/(UPC*.8))),mods=[];
      for(let i=0;i<n;i++)mods.push(['F',{l:len/n,w1:1.2,aim:[0,1,0],k:.06}]);const br=bzGrow(A,l,az,R(16,26),mods,{w:1.3,seg:UPC*.8,T:[0,1,0],e:.02,wig:.04});l30Twigs(items,br,[[0,'t0']]);
      const e=br.chains[0].pts[br.chains[0].pts.length-1],H=br.chains[0].pts.length>1?V3.nz(V3s(e,br.chains[0].pts[br.chains[0].pts.length-2])):[0,1,0];
      for(let k=0,nk=Math.round(R(6,9));k<nk;k++){const a=k*6.283/nk+R(-.3,.3),rr=l87Up(H),side=V3.cr(H,rr),dd=V3.add(V3.sc(rr,Math.cos(a)),V3.sc(side,Math.sin(a))),len2=C*R(.08,.2),mm=[];
        for(let i=0,ni=Math.max(2,Math.round(len2/(UPC*.8)));i<ni;i++)mm.push(['F',{l:len2/ni,w1:1.08}]);mm.push(['K',{a:.3+k*.05}]);const Hh=l30Tilt(H,dd,R(.2,.6)),U0=l87Up(Hh);
        const res=lsTurtle(mm,{p:e,H:Hh,U:U0,w:1.1,seg:UPC*.8,T:[0,1,0],e:.012,wig:.05});l30Twigs(items,res,[[0,'t1']]);for(const og of res.organs)if(og.t==='K')star(og,og.p.a)}}
    l30Batch(parts,items,l87Tw([['t0',st,1.3],['t1',mix(st,'#e0d8c0',.15),1.08],['sh',shd(st,-.15),1.2]]),DET>=1.5?6:3);
    const ink=dark?shd(cw.c,.35):shd(cw.c,-.45),keys=[];
    for(const tg of['q','r'])for(const k of[0,1])keys.push([tg+k,{fill:tg==='q'?mix(toneAt(P,.5+.2*k),st,.2):toneAt(P,.6+.24*k),stroke:ink,'stroke-width':.32,'stroke-opacity':.8,'stroke-linejoin':'round'}]);
    keys.push(['c',{fill:ctr,stroke:shd(ctr,-.4),'stroke-width':.2,'stroke-opacity':.6}],['cb',{fill:mix(st,'#8a7a50',.3)}]);l30Flowers(parts,hd,keys,DET>=1.5?6:4)}})}

/* ---------- registers ---------- */
Object.assign(GH,{'limonium-latifolium':l87Lat,'statice-tatarica':l87Tat,'statice-queue-de-rat':l87Qdr,'ixodia':l87Ixo,'glixia':l87Glx});
Object.assign(CWS,{'limonium-latifolium':L87_CW_LAT,'statice-tatarica':L87_CW_TAT,'statice-queue-de-rat':L87_CW_QDR,'ixodia':L87_CW_IXO,'glixia':L87_CW_GLX});
Object.assign(SZG,{'limonium-latifolium':[25,30,35,35,45],'statice-tatarica':[10,12,15,15,20],'statice-queue-de-rat':[10,12,15,15,20],'ixodia':[15,18,20,20,25],'glixia':[25,30,35,35,45]});
Object.assign(GHI,{'limonium-latifolium':{form:'grappe',size:1.1,k:'plant',rk:.42,tip:.8},'statice-tatarica':{form:'grappe',size:1.1,k:'plant',rk:.6,tip:.85},
  'statice-queue-de-rat':{form:'epi',size:1,k:'plant',tip:.9,fx:4*UPC},'ixodia':{form:'grappe',size:1.1,k:'plant',rk:.6,tip:.8},'glixia':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8}});
GH_BUDS.add('ixodia');
