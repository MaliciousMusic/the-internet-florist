/* ================= Serre, lot 30 — remplissage fin 2, grandi par le L-système : gypsophile, fleur de cire, verge d'or, matricaire, tweedia ================= */
/* ---------- shared: a very branched stem is drawn in batches. Its fine axes, needles and florets become items at their own depth; the items are sorted and cut into a few bins,
   each bin one part in the painter's order, drawn as one path per kind (twigs, shadows, petals, lights): a cloud of hundreds of florets costs a few dozen elements ---------- */
function l30Batch(parts,items,keys,nb){if(!items.length)return;items.sort((a,b)=>a.z-b.z);const per=Math.max(1,Math.ceil(items.length/nb));
  for(let i=0;i<items.length;i+=per){const sl=items.slice(i,i+per);let z=0;for(const q of sl)z+=q.z;z/=sl.length;
    parts.push({z,cast:false,fn:par=>{const B={};for(const q of sl)q.fn(B);for(const[k,a]of keys)if(B[k])E('path',Object.assign({d:B[k]},a),par)}})}}
const l30Add=(B,k,d)=>{B[k]=(B[k]||'')+d};
/* a circle as path data (centre in view space, y up) */
const l30O=(x,y,r)=>`M${f(x-r)},${f(-y)}a${f(r)},${f(r)} 0 1,0 ${f(2*r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2*r)},0`;
/* the fine axes of a grown branch as items: each chain cut in short runs at their depth, each run stroked in the width class of its chain (cls: [[min width, key], …], widest first) */
function l30Twigs(items,res,cls,from=0){for(const ch of res.chains){const n=ch.pts.length;for(let a=from;a<n-1;a+=3){const b=Math.min(n-1,a+3);let z=0,w=0,d='';
    for(let i=a;i<=b;i++){const q=ch.pts[i];z+=q[2];w+=ch.ws[i];d+=(i===a?'M':'L')+f(q[0])+','+f(-q[1])}z/=b-a+1;w/=b-a+1;const k=(cls.find(c=>w>=c[0])||cls[cls.length-1])[1];items.push({z,fn:B=>l30Add(B,k,d)})}}}
/* stroked keys for the twig classes: [key, colour, width], with a lit stroke along the thicker ones at sheet detail */
const l30TwKeys=(list)=>{const out=[];for(const[k,c,w]of list){out.push([k,{fill:'none',stroke:c,'stroke-width':f(w),'stroke-linecap':'round','stroke-linejoin':'round'}])}return out};
/* a point at length l of the main axis, pushed out toward the side az by off */
function l30On(A,l,az,off=0){const f0=A.at(A.sOf(l)),r=V3.add(V3.sc(f0.Fr,Math.cos(az)),V3.sc(f0.Sd,Math.sin(az)));return{p:V3.add(f0.p,V3.sc(r,off)),r,T:f0.T,Fr:f0.Fr}}
/* a direction tilted a radians from v toward w */
const l30Tilt=(v,w,a)=>V3.nz(V3.add(V3.sc(v,Math.cos(a)),V3.sc(V3.nz(V3s(w,V3.sc(v,V3.dot(w,v)))),Math.sin(a))));
/* the frame of a small flower: its face along ax, its top toward up */
function l30Fr(ax,up=[0,1,0],roll=0){return spFrame(V3.nz(ax),up,roll)}
/* a projected outline (PJ points → screen) as path data */
/* a frilled disc: n scallops round (x, y), their depth amp */
function l30Sc(x,y,r,n,ph,amp){let d='';for(let i=0;i<=n;i++){const a=ph+i/n*6.283,v=[x+Math.cos(a)*r*(1-amp),-(y+Math.sin(a)*r*(1-amp))];if(!i){d='M'+f(v[0])+','+f(v[1]);continue}
    const m=a-3.1416/n,c=[x+Math.cos(m)*r*(1+amp*.9),-(y+Math.sin(m)*r*(1+amp*.9))];d+='Q'+f(c[0])+','+f(c[1])+' '+f(v[0])+','+f(v[1])}return d+'Z'}
const l30Poly=(P,cl=true)=>'M'+P.map(p=>f(p[0])+','+f(p[1])).join('L')+(cl?'Z':'');

/* ---------- gypsophile (Gypsophila paniculata 'Xlence', 'Million Star'): a slender glaucous stem with swollen nodes and a few pairs of narrow leaves, opening above into a broad domed panicle:
   opposite branches, each forking again and again (dichasia) on hair-fine pedicels, every fork and tip ending in a tiny double floret (5–10 mm, a white puff), a few still green buds among them ---------- */
const CW_L30G=[{id:'xlence',n:'Blanc (Xlence)',c:'#f6f5ef',fs:1},{id:'million',n:'Blanc fin (Million Star)',c:'#f3f2ea',fs:.68},{id:'rose',n:'Rosé (Pink Xlence / Rosy)',c:'#f2dbe0',fs:.9},
  {id:'t-rose',n:'Teinté rose',c:'#e7b6c5',fs:1},{id:'t-lilas',n:'Teinté lilas',c:'#c6b4db',fs:1},{id:'t-caramel',n:'Teinté caramel',c:'#cda274',fs:1},{id:'t-bleu',n:'Teinté bleu ciel',c:'#8fb0d6',fs:1},
  {id:'arc',n:'Teinté arc-en-ciel',c:'#e9a6c4',fs:1,f:1,rb:['#e9a6c4','#f2d27a','#9fcf9a','#8fb0d6','#c6a4db']}];
function l30Gyps(g,t,o){const cw=cwPick(CW_L30G,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||40)*UPC,sc=['#4f6650','#6f8a6e','#8fa88c','#bccdb6'],tw='#7f9a7c',lc='#7d9a80';
  const fr=.42*UPC*cw.fs*(DET<1.5?1.12:1),cols=cw.rb||[cw.c],tinted=cw.id.startsWith('t-')||cw.rb;
  return bzShoot(g,t,o,{Lt:C*1.15,w0:3.2,w1:.9,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],nb=DET>=1.5?9:5;
    /* a dichasium: an internode, a floret in the fork, two arms rolled a quarter turn from the last pair; some arms abort */
    const dich=(n,l,w,lv)=>{if(n<=0)return[['F',{l,w1:Math.max(.3,w*.6)}],['Fl',{lv}]];const out=[['F',{l,w1:w}],['/',{a:90+R(-25,25)}],['[',{w:.32}],['F',{l:l*.18,w1:.3}],['Fl',{lv:lv-.6}],[']',{}]];
      for(const s of['+','-'])if(rnd()>(lv>2?.22:.08)||lv<1)out.push(['[',{w:w*.78}],[s,{a:R(26,44)}],...dich(n-1,l*R(.58,.8),w*.72,lv+1),[']',{}]);return out};
    const grow=(res)=>{l30Twigs(items,res,[[1.05,'t0'],[.6,'t1'],[0,'t2']]);for(const og of res.organs)if(og.t==='Fl')floret(og)};
    /* a floret: the oldest (in the forks, near the base) open first; buds are green beads */
    const floret=(og)=>{const m=op*1.35-og.p.lv*.12+R(-.12,.12),p=og.pos,ci=Math.floor(rnd()*cols.length);
      if(m<.3){const r=fr*R(.32,.42)*(.7+.6*Math.max(0,m+.2));items.push({z:p[2],fn:B=>{l30Add(B,'bs',l30O(p[0]+r*.2,p[1]-r*.25,r));l30Add(B,'bb',l30O(p[0],p[1],r*.86));if(!LOD)l30Add(B,'bl',l30O(p[0]-r*.28,p[1]+r*.3,r*.34))}});return}
      const r=fr*R(.8,1.12)*Math.min(1,.55+m*.5),o2=V3.sc(V3.nz(V3.add(og.H,[0,.4,0])),r*.5),c=V3.add(p,o2),ph=R(0,6.283),ph2=R(0,6.283);
      items.push({z:c[2],fn:B=>{l30Add(B,'s'+ci,l30O(c[0]+r*.12,c[1]-r*.15,r*.96));
        /* a puff: a frilled outline, and at sheet detail its inner ring of crowded petals */
        if(DET>=1.5){l30Add(B,'b'+ci,l30Sc(c[0],c[1],r*.9,7,ph,.16));l30Add(B,'v'+ci,l30Sc(c[0]+r*.04,c[1]-r*.04,r*.5,5,ph2,.22))}else l30Add(B,'b'+ci,l30O(c[0],c[1],r*.86));
        if(!LOD)l30Add(B,'l'+ci,l30O(c[0]-r*.26,c[1]+r*.28,r*.36))}})};
    /* the top of the main axis forks like a branch; below it, decussate pairs of branches, longer downward, reaching out into the dome */
    const top=bzGrow(A,L-.3,0,4,dich(DET<1.5?4:5,C*.07,1,0),{w:1,seg:C*.02,T:[0,1,0],e:.02,wig:.08});grow(top);
    const nN=7;for(let i=0;i<nN;i++){const l=L-C*(.05+.075*i*(1+.06*i));if(l<l0+4)continue;const ph=(i%2?90:0)+R(-15,15),u=i/(nN-1);
      for(const sd of[0,180]){if(i>4&&rnd()<.3)continue;const br=bzGrow(A,l,(ph+sd)*D,R(50,62)+u*16,[['F',{l:C*(.03+.12*u)*R(.85,1.15),w1:1.15}],...(u>.2?[['/',{a:90}],['[',{w:.8}],['+',{a:R(35,50)}],...dich(2+(u>.6?1:0),C*.05,.7,2),[']',{}],['[',{w:.8}],['-',{a:R(35,50)}],...dich(2,C*.05,.7,2),[']',{}],['/',{a:-90}]]:[]),['F',{l:C*(.03+.12*u)*R(.85,1.15),w1:1.05}],...dich(i<1||DET<1.5?4:5,C*R(.06,.08)*(1+.3*u),1.1,i>2?1:0)],{w:1.4,seg:C*.02,T:[0,1,0],e:.025+.035*u,wig:.08});grow(br)}
      /* the swollen node */
      const nd=l30On(A,l,0,0).p;items.push({z:nd[2]+.05,fn:B=>l30Add(B,'nd',l30O(nd[0],nd[1],1.15))})}
    /* below the panicle, two pairs of narrow glaucous leaves */
    for(let i=0;i<2;i++){const l=L-C*(.66+.2*i);if(l<l0+6)continue;const ph=45+(i%2?90:0)+R(-8,8);for(const sd of[0,180]){const q=l30On(A,l,(ph+sd)*D,.8),H=V3.nz(V3.add(V3.sc(q.T,.7),q.r));
      parts.push(bzBlade(q.p,H,q.T,C*R(.17,.21),.16,lc,{wp:LS_LANCE,droop:.2,arch:.05,fold:.3,face:.4}))}}
    const keys=l30TwKeys([['t0',tw,1.05],['t1',mix(tw,'#a8bca4',.25),.62],['t2',mix(tw,'#b8c8b0',.35),.36]]);keys.push(['nd',{fill:shd(tw,-.15)}]);
    for(let ci=0;ci<cols.length;ci++){const c=cols[ci],P=pal7(c),sh=tinted?shd(c,-.22):mix(c,'#b8b4a8',.42);
      keys.push(['s'+ci,{fill:sh}],['b'+ci,{fill:c}],['v'+ci,{fill:'none',stroke:tinted?P.d1:'#cfcabd','stroke-width':.3,'stroke-opacity':.75}],['l'+ci,{fill:tinted?shd(c,.45):'#ffffff',opacity:.7}])}
    keys.splice(4,0,['bs',{fill:'#5f7a4c'}],['bb',{fill:tinted?mix('#9ab27a',cols[0],.35):'#9ab27a'}],['bl',{fill:'#d4e2bc',opacity:.8}]);
    l30Batch(parts,items,keys,nb)}})}

/* flowers drawn one by one at sheet detail (each its own part), batched by depth at the app's detail where they are a few millimetres wide */
function l30Flowers(parts,items,keys,nb){if(DET>=1.5){for(const q of items)parts.push({z:q.z,cast:false,fn:par=>{const B={};q.fn(B);for(const[k,a]of keys)if(B[k])E('path',Object.assign({d:B[k]},a),par)}})}else l30Batch(parts,items,keys,nb)}
/* a needle leaf from p along d (3D), len long, bowed toward bow and hooked at its tip (Chamelaucium uncinatum: 'hooked') */
function l30Needle(p,d,len,bow,hook){const t=V3.add(p,V3.sc(d,len)),m=V3.add(V3.add(p,V3.sc(d,len*.5)),V3.sc(bow,len*.08)),h=V3.add(t,V3.sc(hook,len*.06)),m2=V3.add(t,V3.sc(V3.nz(V3s(t,m)),len*.04));
  return`M${f(p[0])},${f(-p[1])}Q${f(m[0])},${f(-m[1])} ${f(t[0])},${f(-t[1])}Q${f(m2[0])},${f(-m2[1])} ${f(h[0])},${f(-h[1])}`}

/* ---------- fleur de cire (Chamelaucium uncinatum and hybrids): wiry reddish-brown twigs crowded with needle leaves (1.5–3 cm, hooked at the tip); in the upper axils and at the tips of the side shoots,
   small clusters of waxy flowers (1–2 cm): five round cupped petals round a shallow hypanthium whose nectar disc turns from yellow-green to wine red as the flower ages, a ring of tiny stamens,
   and round pearly buds; 'Dancing Queen' is double ---------- */
const CW_L30W=[{id:'snow',n:'Blanc (Snow Flakes)',c:'#f7f2ee'},{id:'blondie',n:'Blanc crème, bouton pourpre (Blondie)',c:'#f3ead8',bud:'#b85f86'},{id:'pearl',n:'Rose perle (Esperance Pearl)',c:'#efd0d9'},
  {id:'stephanie',n:'Rose (Lady Stephanie)',c:'#e39cb6'},{id:'dancing',n:'Rose vif double (Dancing Queen)',c:'#d6689b',dbl:1},{id:'mauve',n:'Mauve lilas',c:'#b287b4'},{id:'pride',n:'Pourpre (Purple Pride)',c:'#7d3a6f'}];
function l30Wax(g,t,o){const cw=cwPick(CW_L30W,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||30)*UPC,sc=['#3a2216','#5e3a26','#80583c','#b08a68'],tw='#6a4430',nc='#4d6a36';
  const P=pal7(cw.c),rf=.78*UPC*(DET<1.5?1.1:1),dark=hsl(cw.c)[2]<.45;
  return bzShoot(g,t,o,{Lt:C*1.15,w0:3,w1:1.1,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],fl=[],nb=DET>=1.5?8:5,FW=A.at(.9).Fr;
    /* needles all along a run of axis (organs or frames along the spine) */
    const needles=(pos,H,U,k)=>{const n=2;for(let j=0;j<n;j++){const ph=R(0,6.283),rr=V3.add(V3.sc(U,Math.cos(ph)),V3.sc(V3.cr(U,H),Math.sin(ph))),d=l30Tilt(H,rr,R(.5,.95)),len=UPC*R(1.2,2.1)*k,p=V3.add(pos,V3.sc(rr,.4)),
        dd=l30Needle(p,d,len,H,V3.nz(V3.add(rr,[0,-.5,0])));items.push({z:p[2]+d[2]*len*.5,fn:B=>l30Add(B,d[2]>.1?'nl':'nd',dd)})}};
    /* a flower (or a bud) at the end of a pedicel from p along d */
    const flower=(p,d,age)=>{const m=op*1.3-age*.22+R(-.1,.1),pl=UPC*R(.5,.9),q=V3.add(p,V3.sc(d,pl));items.push({z:(p[2]+q[2])/2,fn:B=>l30Add(B,'pd',`M${f(p[0])},${f(-p[1])}L${f(q[0])},${f(-q[1])}`)});
      const bc=cw.bud||mix(cw.c,'#c8d0a0',.18);
      if(m<.3){const r=rf*R(.4,.5)*(.75+.5*Math.max(0,m+.2)),c=V3.add(q,V3.sc(d,r*.8));fl.push({z:c[2],fn:B=>{l30Add(B,'bs',l30O(c[0]+r*.15,c[1]-r*.2,r));l30Add(B,'bb',l30O(c[0],c[1],r*.88));if(!LOD)l30Add(B,'bl',l30O(c[0]-r*.3,c[1]+r*.32,r*.34))}});return}
      const op2=Math.min(1,(m-.3)/.5),r=rf*R(.85,1.1)*(.6+.4*op2),ax=V3.nz(V3.add(V3.add(d,[0,.5,0]),V3.sc(FW,.25))),Bf=l30Fr(ax,[0,1,0],R(0,6.283)),O=V3.add(q,V3.sc(ax,r*.15)),cup=.75-.45*op2,n=ax[2],
        ctr=m>1.05?mix(cw.c==='#7d3a6f'?'#4a1430':'#7a2b45',cw.c,.1):m>.8?'#a8742e':'#b9bd5a';
      fl.push({z:O[2],fn:B=>{const I=Math.max(.3,Math.min(1,lightI(n<-.15?V3.sc(ax,-1):ax)));
        const NK=DET>=1.5?12:6,pet=(rr,dc,rp,ph0,np,tag)=>{for(let i=0;i<np;i++){const a=ph0+i*6.283/np,e=[Math.cos(a),Math.sin(a),0],tg=[-e[1],e[0],0],pts=[];for(let k=0;k<NK;k++){const th=k/NK*6.283,dd=dc+rp*Math.cos(th),ss=rp*Math.sin(th)*.96,z=cup*rr*(dd/rr)**2;pts.push(PJ(Bf,O,[e[0]*dd+tg[0]*ss,e[1]*dd+tg[1]*ss,z]))}
          const ev=toV(Bf,e)[2],k=(n<-.15?'q':ev>.3&&n>-.15?'f':'k')+tag+(DET>=1.5?Math.min(2,Math.floor(I*3)):1);l30Add(B,k,DET>=1.5?smooth(pts.map(p=>[p[0],p[1]])):l30Poly(pts))}};
        const ph=R(0,6.283);pet(r,r*.6,r*.36,ph,5,'');if(cw.dbl)pet(r*.7,r*.36,r*.24,ph+.63,5,'i');
        /* the hypanthium: the nectar disc and its ring of stamens seen from the front; from behind, the green-brown calyx cup */
        if(n>-.15){const dc=spDisc(Bf,O,r*.26,cup*r*.04,DET>=1.5?12:6);l30Add(B,'c',DET>=1.5?smooth(dc):l30Poly(dc));if(DET>=1.5&&!cw.dbl){let d='';for(let i=0;i<10;i++){const a=i/10*6.283,pp=PJ(Bf,O,[Math.cos(a)*r*.33,Math.sin(a)*r*.33,cup*r*.1]);d+=l30O(pp[0],-pp[1],.28)}l30Add(B,'st',d)}}
        else{const dc=spDisc(Bf,O,r*.2,-r*.08,6);l30Add(B,'cb',l30Poly(dc))}}})};
    /* the side shoots, spiralled up the axis, longer below (a loose dome); each a run of needled internodes, forking once, ending in a cluster */
    const shoot=(l,az,u)=>{const n=Math.max(2,Math.round((C*(.12+.38*u))/(UPC*.7))),mods=[];for(let i=0;i<n;i++){mods.push(['F',{l:UPC*.7*R(.85,1.15),w1:Math.max(.55,1.1-.06*i)}],['N',{k:1-.4*i/n}]);if(i===Math.floor(n*R(.5,.7))&&rnd()<.6)mods.push(['[',{w:.6}],[rnd()<.5?'+':'-',{a:R(30,45)}],['F',{l:UPC*R(1,2)}],['N',{k:.7}],['A',{}],['F',{l:UPC*R(.6,1.2)}],['N',{k:.6}],['K',{}],[']',{}]);if(i>n*.45&&rnd()<(i>n-6?.5:.2))mods.push(['A',{}])}
      mods.push(['K',{}]);const br=bzGrow(A,l,az,R(42,58)+u*18,mods,{w:1.2,seg:UPC*.7,T:[0,1,0],e:.022,wig:.06});l30Twigs(items,br,[[.8,'t0'],[0,'t1']]);
      for(const og of br.organs){if(og.t==='N')needles(og.pos,og.H,og.U,og.p.k);else if(og.t==='A'){const rr=og.U;flower(og.pos,l30Tilt(og.H,rr,R(.5,.9)),1)}
        else if(og.t==='K'){const k=2+Math.floor(rnd()*2.4),ph=R(0,6.283);flower(og.pos,og.H,0);for(let j=0;j<k;j++){const a=ph+j*6.283/k,rr=V3.add(V3.sc(og.U,Math.cos(a)),V3.sc(og.L,Math.sin(a)));flower(og.pos,l30Tilt(og.H,rr,R(.6,1)),.6+j*.4)}}}};
    const span=C*.6;let l=L-UPC*.6,i=0;while(l>Math.max(l0+3,L-span)){const u=(L-l)/span;shoot(l,(i*137.5+R(-12,12))*D,u);l-=C*R(.045,.065);i++}
    /* the tip of the main axis ends in a cluster; needles all along it */
    const tip=l30On(A,L,0,0),f1=A.at(1);{const k=3,ph=R(0,6.283);flower(tip.p,f1.T,0);for(let j=0;j<k;j++){const a=ph+j*2.094,rr=V3.add(V3.sc(f1.Fr,Math.cos(a)),V3.sc(f1.Sd,Math.sin(a)));flower(tip.p,l30Tilt(f1.T,rr,.8),.5+j*.3)}}
    for(let ll=L-UPC*.5;ll>l0+2;ll-=UPC*.55){const q=A.at(A.sOf(ll));needles(q.p,q.T,q.Fr,ll>L-span?1:1.15)}
    l30Batch(parts,items,l30TwKeys([['t0',tw,.95],['t1',mix(tw,'#9a7a5a',.3),.6],['pd',mix(tw,'#7a8a50',.4),.42],['nd',shd(nc,-.2),.6],['nl',nc,.62]]),nb);
    const keys=[];const tone=(I)=>toneAt(P,[.42,.62,.82][I]),ink=P.ink;
    for(const tag of['','i']){for(let q=0;q<3;q++)keys.push(['q'+tag+q,{fill:mix(tone(q),'#a8b090',.15),stroke:ink,'stroke-width':.3,'stroke-opacity':.4}]);for(let q=0;q<3;q++)keys.push(['k'+tag+q,{fill:tone(q),stroke:ink,'stroke-width':.3,'stroke-opacity':.4}])}
    keys.push(['cb',{fill:mix('#7a8a4a',cw.c,.3),stroke:'#4a4a2a','stroke-width':.3,'stroke-opacity':.6}],['c',{fill:'#b9bd5a',stroke:dark?'#3a1020':'#7a2b45','stroke-width':.6,'stroke-opacity':.85}],['st',{fill:'#f4e8c8'}]);
    for(const tag of['','i'])for(let q=0;q<3;q++)keys.push(['f'+tag+q,{fill:shd(tone(q),.08),stroke:ink,'stroke-width':.3,'stroke-opacity':.4}]);
    keys.push(['bs',{fill:shd(cw.bud||cw.c,-.35)}],['bb',{fill:cw.bud||mix(cw.c,'#c8d0a0',.18)}],['bl',{fill:'#ffffff',opacity:.7}]);
    l30Flowers(parts,fl,keys,DET>=1.5?nb:4)}})}

/* ---------- verge d'or (Solidago canadensis and hybrids, × Solidaster): a stiff leafy stem, alternate lanceolate serrate leaves shrinking upward; at its top a plumy pyramidal panicle,
   its branches leaving the axis upward then arching out and over to one side, crowded on their upper face with countless tiny golden capitula (3–5 mm), small leaves among them ---------- */
const CW_L30S=[{id:'tara',n:'Jaune d\'or (Tara)',c:'#e4b52b'},{id:'glory',n:'Jaune vif (Golden Glory)',c:'#efcb3f'},{id:'lemore',n:'Jaune citron pâle (Solidaster Lemore)',c:'#f0e2a3'},
  {id:'fonce',n:'Or foncé (Strahlenkrone)',c:'#cf9f1d'},{id:'orange',n:'Teinté orange',c:'#e07b2b',f:1}];
function l30Sol(g,t,o){const cw=cwPick(CW_L30S,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||25)*UPC,sc=['#2f4220','#4a6232','#6a8448','#9cb478'],tw='#5e7a37',lc='#4f7034';
  const hr=.17*UPC*(DET<1.5?1.15:1),P=pal7(cw.c),G0='#a8b84a';
  return bzShoot(g,t,o,{Lt:C*1.9,w0:3.4,w1:1,sc,bow:R(.05,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],nb=DET>=1.5?9:5,side=R(0,6.283);
    /* a capitulum: a tiny elongate head of florets, upright, at the upper face of its branch, on its short pedicel (1–3 mm) from the point b of the twig */
    const head=(p,ax,m,b)=>{const r=hr*R(.85,1.15)*(.7+.3*Math.min(1,m)),c=p,col=m>.75?0:m>.4?1:2;items.push({z:c[2],fn:B=>{if(b)l30Add(B,'t1',`M${f(b[0])},${f(-b[1])}L${f(c[0])},${f(-c[1])}`);l30Add(B,'s'+col,l30O(c[0]+r*.25,c[1]-r*.3,r*1.05));l30Add(B,'b'+col,l30O(c[0],c[1]+r*.2,r*.9));if(!LOD&&col<2)l30Add(B,'l'+col,l30O(c[0]-r*.25,c[1]+r*.5,r*.42))}})};
    /* a branch: rising then arched over by its own weight (gravity tropism), heads along its upper face, younger toward its tip */
    const branch=(l,az,u)=>{const len=C*(.14+.34*Math.sin(Math.PI*Math.min(1,.15+u*.95)))*R(.85,1.1),n=Math.max(3,Math.round(len/(UPC*.45))),mods=[];
      for(let i=0;i<n;i++){mods.push(['F',{l:len/n,w1:Math.max(.35,.9*(1-i/n))}],['$',{}],['H',{v:i/n}]);if(i>1&&i<n-2&&rnd()<.22)mods.push(['[',{w:.4}],['+',{a:R(25,40)*(rnd()<.5?1:-1)}],['F',{l:len*.12,w1:.3}],['$',{}],['H',{v:.7}],['F',{l:len*.1,w1:.25}],['$',{}],['H',{v:.9}],[']',{}]);if(i===1&&rnd()<.5)mods.push(['Lf',{}])}
      const br=bzGrow(A,l,az,R(28,40),mods,{w:1,seg:UPC*.45,T:[0,-1,0],e:.035+.025*u,wig:.04});l30Twigs(items,br,[[.6,'t0'],[0,'t1']]);
      for(const og of br.organs){if(og.t==='H'){const m=op*1.35-og.p.v*.45+R(-.08,.08),k=og.p.v>.85||(DET<1.5&&rnd()<.45)?1:2;for(let j=0;j<k;j++){const sp=V3.add(V3.sc(og.L,R(-.9,.9)),V3.sc(og.H,R(-.5,.5))),p=V3.add(og.pos,V3.add(V3.sc(og.U,hr*R(.9,1.6)),V3.sc(sp,hr*1.2)));head(p,og.U,m,og.pos)}}
        else if(og.t==='Lf')parts.push(bzBlade(og.pos,l30Tilt(og.H,og.U,-.3),og.U,UPC*R(1.6,2.4),.2,lc,{wp:LS_LANCE,droop:.25,arch:.05,fold:.25,face:.5}))}};
    /* the panicle: branches spiralled up the top of the axis, longest in its lower middle, all leaning toward one side */
    const span=C*.75;let l=L-UPC*.4,i=0;while(l>Math.max(l0+3,L-span)){const u=(L-l)/span,az=side+(i*137.5%360-180)*.55*D+R(-.3,.3);branch(l,az,u);l-=UPC*R(.55,.8)*(1+u*.8);i++}
    /* the tip of the axis itself carries heads */
    for(let ll=L;ll>L-C*.1;ll-=UPC*.35){const q=A.at(A.sOf(ll));for(let j=0;j<2;j++){const az=R(0,6.283),r=V3.add(V3.sc(q.Fr,Math.cos(az)),V3.sc(q.Sd,Math.sin(az)));head(V3.add(q.p,V3.sc(r,hr*1.3)),q.T,op*1.35-(L-ll)/(C*.1)*.2-.3,q.p)}}
    /* leaves up the stem, shrinking toward the panicle */
    for(let ll=L-span*.55;ll>l0+6;ll-=UPC*R(1.6,2.2)){const v=(L-ll)/(C*1.9),q=l30On(A,ll,R(0,6.283),.9),H=V3.nz(V3.add(V3.sc(q.T,.85),q.r));
      parts.push(bzBlade(q.p,H,q.T,UPC*(3.5+7*Math.min(1,v*1.6))*R(.9,1.1),.17,lc,{wp:LS_LANCE,teeth:7,td:.08,droop:.3,arch:.06,fold:.22,face:.5,vn:3}))}
    const keys=l30TwKeys([['t0',tw,.8],['t1',mix(tw,'#90a860',.25),.45]]),cs=[cw.c,mix(cw.c,G0,.45),mix(cw.c,G0,.85)];
    for(let k=0;k<3;k++){const Pk=pal7(cs[k]);keys.push(['s'+k,{fill:Pk.d1}],['b'+k,{fill:cs[k]}],['l'+k,{fill:Pk.l2,opacity:.85}])}
    l30Batch(parts,items,keys,nb)}})}

/* ---------- matricaire (Tanacetum parthenium): an upright leafy stem, light green pinnatifid leaves with toothed lobes, branching above into a loose flat corymb of small heads (1.5–2 cm):
   in the single forms ('Magic Single', 'Vegmo') a dozen short white rays round a domed yellow disc; in the double ones a white or yellow pompon of crowded short rays ---------- */
const CW_L30M=[{id:'single',n:'Blanc simple (Vegmo Single)',c:'#f7f5ee'},{id:'double',n:'Blanc double (Tetra White)',c:'#f4f1e6',dbl:1},{id:'creme',n:'Crème double (Magic Snowball)',c:'#efe3a2',dbl:1},
  {id:'lime',n:'Vert anis double (Magic Lime Green)',c:'#cad66a',dbl:1,disc:'#b6c446'},{id:'gold',n:'Jaune d\'or pompon (Golden Ball)',c:'#efd04a',dbl:2,disc:'#e6bd2a'}];
/* a cut leaf in 2D: pinnatifid, its lobes toothed */
function l30Pinn(par,x,y,ang,len,col,o={}){const P=pal7(col),g=G(par,{transform:`translate(${f(x)},${f(y)}) rotate(${f(ang/D)})`}),pl=len*.2,bl=len-pl,W=bl*.42,ct=o.ct??1,nl=o.nl||4,Lt=[],Rt=[],nn=DET>=1.5?60:34;
  for(let i=0;i<=nn;i++){const t=i/nn,ov=Math.sin(Math.PI*Math.pow(t,.75))*(1-.3*t),ph=Math.abs(Math.sin(Math.PI*nl*(t+.04))),lob=.22+.78*Math.pow(ph,.7),th=1+.12*Math.sin(t*nl*2*Math.PI*2.5),w=W*ov*lob*th;
    Lt.push([pl+bl*t,-w*ct]);Rt.push([pl+bl*t,w*ct])}
  E('path',{d:`M0,0L${f(pl+bl*.9)},0`,stroke:P.d1,'stroke-width':f(Math.max(.5,len*.02)),'stroke-linecap':'round'},g);
  E('path',{d:pD(Lt.concat(Rt.reverse()))+'Z',fill:toneAt(P,o.I??.62),stroke:P.ink,'stroke-width':.4,'stroke-opacity':.5,'stroke-linejoin':'round'},g);return g}
function l30Mat(g,t,o){const cw=cwPick(CW_L30M,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,sc=['#2e4a22','#4a6a36','#6e9050','#a4c080'],tw='#5f8240',lc='#7aa04a';
  const P=pal7(cw.c),disc=cw.disc||'#e6bd2a',hr=.85*UPC*(cw.dbl?.88:1);
  return bzShoot(g,t,o,{Lt:C*1.8,w0:3,w1:1.2,sc,grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,items=[],hd=[],FW=A.at(.9).Fr;
    /* a head on its peduncle: frame toward the light above; rays, then the disc (or the pompon), seen from behind its green involucre */
    const head=(og,age)=>{const m=op*1.3-age*.18+R(-.08,.08),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.35),[0,.75,0]),V3.sc(FW,.8))),pos=og.pos;
      if(m<.35){const r=hr*R(.32,.4)*(.7+.6*Math.max(0,m)),c=V3.add(pos,V3.sc(ax,r*.6));hd.push({z:c[2],fn:B=>{l30Add(B,'gs',l30O(c[0]+r*.15,c[1]-r*.2,r));l30Add(B,'gb',l30O(c[0],c[1],r*.86));if(m>.15)l30Add(B,'gt',l30O(c[0]-r*.05,c[1]+r*.25,r*.5*(m/.35)));if(!LOD)l30Add(B,'gl',l30O(c[0]-r*.3,c[1]+r*.3,r*.28))}});return}
      const op2=Math.min(1,(m-.35)/.5),r=hr*R(.88,1.1)*(.55+.45*op2),Bf=l30Fr(ax,[0,1,0],R(0,6.283)),O=pos,n=ax[2],rd=r*.36,dh=r*(cw.dbl?.3:.22),nr=cw.dbl?14:13;
      hd.push({z:O[2]+r*.2*n,fn:B=>{const I=Math.max(.3,Math.min(1,lightI(n<-.1?V3.sc(ax,-1):ax))),q=n<-.1?'q':'r',NK=DET>=1.5?7:4;
        const rays=(r0,r1,w,cnt,ph,tilt,tag)=>{for(let i=0;i<cnt;i++){const a=ph+i*6.283/cnt,e=[Math.cos(a),Math.sin(a),0],tg=[-e[1],e[0],0],L1=[],R1=[];
            for(let k=0;k<=NK;k++){const v=k/NK,d=r0+(r1-r0)*v*(.3+.7*op2),ww=w*Math.sin(Math.PI*Math.min(.92,v*.9+.08))*(v>.85?.8:1),z=tilt*(d-r0);const a1=PJ(Bf,O,[e[0]*d+tg[0]*ww,e[1]*d+tg[1]*ww,z]),a2=PJ(Bf,O,[e[0]*d-tg[0]*ww,e[1]*d-tg[1]*ww,z]);L1.push(a1);R1.push(a2)}
            l30Add(B,tag+(I>.62?1:0),l30Poly(L1.concat(R1.reverse())))}};
        const ph=R(0,6.283);
        if(!cw.dbl){rays(rd*.85,r,r*.2,nr,ph,-.12,q);if(n>-.1){const dc=[];for(const[zz,rr]of[[0,rd],[dh*.6,rd*.8],[dh,rd*.3]])for(const p of spDisc(Bf,O,rr,zz,10))dc.push(p);l30Add(B,'d',l30Poly(l30Hull(dc)))}}
        else{rays(rd*.5,r,r*.17,nr,ph,-.05,q);if(n>-.1){rays(rd*.3,r*.8,r*.16,12,ph+.26,.35,'u');rays(rd*.1,r*.55,r*.15,9,ph+.5,.9,'u');if(cw.dbl===1&&DET>=1.5){const dc=spDisc(Bf,O,rd*.25,dh*.9,8);l30Add(B,'d',smooth(dc))}}}
        if(n<-.1){const iv=[];for(const[zz,rr]of[[0,rd*1.15],[-dh*.7,rd*.95],[-dh*1.2,rd*.4]])for(const p of spDisc(Bf,O,rr,zz,10))iv.push(p);l30Add(B,'iv',l30Poly(l30Hull(iv)))}}})};
    /* the corymb: peduncles from the upper nodes, longer below, so that the heads come level; some fork again */
    const span=C*.8;let l=L,i=0;
    {const q=A.at(1);head({pos:q.p,H:q.T},0)}
    for(l=L-UPC*.6;l>Math.max(l0+3,L-span);l-=UPC*R(.7,1.1)*(1+(L-l)/span),i++){const u=(L-l)/span,az=(i*137.5+R(-15,15))*D,len=(L-l)*R(.9,1.15)/Math.cos(.45)+UPC*.6;
      const fork=u>.2&&rnd()<.85,mods=fork?[['F',{l:len*.55,w1:.75}],['[',{w:.6}],['+',{a:R(25,38)}],['F',{l:len*.45,w1:.5,aim:[0,1,0],k:.25}],['K',{a:1}],[']',{}],['[',{w:.6}],['-',{a:R(20,32)}],['F',{l:len*.38,w1:.5,aim:[0,1,0],k:.25}],['K',{a:1.6}],[']',{}],['F',{l:len*.45,w1:.55,aim:[0,1,0],k:.2}],['K',{a:.5}]]
        :[['F',{l:len,w1:.6,aim:[0,1,0],k:.12}],['K',{a:u}]];
      const br=bzGrow(A,l,az,R(30,42),mods,{w:.95,seg:UPC*.6,T:[0,1,0],e:.03,wig:.04});l30Twigs(items,br,[[.7,'t0'],[0,'t1']]);for(const og of br.organs)if(og.t==='K')head(og,og.p.a);
      /* the small leaf at the node */
      if(rnd()<.8){const q=l30On(A,l,az+R(-.4,.4),.5),H=l30Tilt(q.T,q.r,R(.7,1)),p=q.p,ln=UPC*R(1.8,2.8)*(.6+u);items.push({z:p[2]+H[2]*ln*.4,fn:B=>{}});parts.push(lsLeaf2D({H},p,ln,(par,x,y,an,ll)=>l30Pinn(par,x,y,an,ll,lc,{nl:3,ct:.75})))}}
    /* below, alternate leaves up the stem */
    for(let ll=L-span-UPC*.6;ll>l0+6;ll-=UPC*R(1.8,2.6)){const q=l30On(A,ll,R(0,6.283),.6),H=l30Tilt(q.T,q.r,R(.75,1.05)),v=Math.min(1,(L-ll)/(C*1.5));parts.push(lsLeaf2D({H},q.p,UPC*(2.4+3*v)*R(.9,1.1),(par,x,y,an,ll2)=>l30Pinn(par,x,y,an,ll2,lc,{nl:4,ct:.8})))}
    l30Batch(parts,items,l30TwKeys([['t0',tw,.75],['t1',mix(tw,'#a0c080',.25),.5]]),DET>=1.5?6:3);
    const ink=P.ink,keys=[['iv',{fill:'#6f9446',stroke:'#2e4a22','stroke-width':.3,'stroke-opacity':.6}]];
    for(const tg of['q','r','u'])for(const k of[0,1])keys.push([tg+k,{fill:tg==='q'?mix(toneAt(P,.5+.2*k),'#b4c49a',.2):toneAt(P,tg==='u'?.7+.2*k:.62+.2*k),stroke:ink,'stroke-width':cw.dbl?.18:.25,'stroke-opacity':cw.dbl?.28:.45}]);
    keys.splice(7,0,['d',{fill:budFill(disc),stroke:shd(disc,-.5),'stroke-width':.3,'stroke-opacity':.6}]);
    keys.push(['gs',{fill:'#4a6e30'}],['gb',{fill:'#7fa652'}],['gt',{fill:cw.dbl===2?cw.c:mix(cw.c,'#e0e8c8',.2)}],['gl',{fill:'#c8dca8',opacity:.8}]);
    l30Flowers(parts,hd,keys,DET>=1.5?8:4)}})}
/* the convex hull of screen points (monotone chain) */
function l30Hull(P){const p=P.map(q=>[q[0],q[1]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>1&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}
  return lo.slice(0,-1).concat(up.slice(0,-1))}

/* ---------- tweedia (Oxypetalum caeruleum): soft, slightly twining downy grey-green stems with opposite oblong leaves, heart-shaped at their base; in the upper axils, small cymes of
   star flowers (2.5 cm): five thick oblong petals of powder blue that turn lilac as they age, a darker blue corona of five fleshy scales round a pale column; pointed pinkish buds ---------- */
const CW_L30T=[{id:'ciel',n:'Bleu ciel (Blue Star)',c:'#8fb8dc'},{id:'poudre',n:'Bleu poudré (Heaven Blue)',c:'#a9c8e4'},{id:'gris',n:'Bleu gris (Little Blue Star)',c:'#b4c6dc'},
  {id:'lilas',n:'Lilas (fleurs mûres)',c:'#a48ab8',f:1},{id:'blanc',n:'Blanc (Alba)',c:'#f4f2ee'},{id:'rose',n:'Rose (Rosea)',c:'#eab4c4'}];
function l30Twd(g,t,o){const cw=cwPick(CW_L30T,o),op=Math.max(.05,Math.min(1,o.op??1)),C=(o.cm||15)*UPC,sc=['#4a5444','#6a7662','#8e9a84','#c0c8b4'],lc='#8d9c80',blue=cw.id!=='blanc'&&cw.id!=='rose';
  const fr=1.2*UPC,cor=blue?'#3a6ab8':cw.id==='rose'?'#c06a8a':'#d8dce8';
  return bzShoot(g,t,o,{Lt:C*1.8,w0:2.8,w1:1.3,sc,bow:R(-.1,.1),grow:(A,parts,s0)=>{const L=A.L,l0=L*s0,fl=[],tws=[],FW=A.at(.9).Fr;
    const flower=(og,age)=>{const m=op*1.3-age*.25+R(-.08,.08),pos=og.pos;
      if(m<.4){const ax=V3.nz(V3.add(og.H,[0,.5,0])),len=fr*R(.75,1)*(.75+.45*Math.max(0,m)),b0=pos,b1=V3.add(pos,V3.sc(ax,len*.5)),b2=V3.add(pos,V3.sc(ax,len)),w=len*.26;
        const bc=mix(cw.c,'#d8a8c0',blue?.55:.2);fl.push({z:b1[2],fn:B=>{const a=[b0[0],-b0[1]],c=[b2[0],-b2[1]],dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l*w,ny=dx/l*w,mx=a[0]+dx*.45,my=a[1]+dy*.45;
          l30Add(B,'bd',`M${f(a[0])},${f(a[1])}Q${f(mx+nx*1.6)},${f(my+ny*1.6)} ${f(c[0])},${f(c[1])}Q${f(mx-nx*1.6)},${f(my-ny*1.6)} ${f(a[0])},${f(a[1])}Z`);if(DET>=1.5)l30Add(B,'bv',`M${f(a[0]+dx*.3)},${f(a[1]+dy*.3)}Q${f(mx+nx*.4)},${f(my+ny*.4)} ${f(c[0])},${f(c[1])}`)}},);fl[fl.length-1].bc=bc;return}
      const op2=Math.min(1,(m-.4)/.45),col=age>1.2&&blue?mix(cw.c,'#a48ab8',.45):cw.c,r=fr*R(.9,1.08)*(.6+.4*op2),ax=V3.nz(V3.add(V3.add(V3.sc(og.H,.6),[0,.55,0]),V3.sc(FW,.55))),Bf=l30Fr(ax,[0,1,0],R(0,6.283)),O=pos,n=ax[2];
      fl.push({z:O[2],fn:B=>{const I=Math.max(.3,Math.min(1,lightI(n<-.1?V3.sc(ax,-1):ax))),tk=(age>1.2&&blue?'o':'p')+(n<-.1?'b':'')+(I>.62?1:0),ph=R(0,6.283),NK=DET>=1.5?7:4;
        for(let i=0;i<5;i++){const a=ph+i*1.2566,e=[Math.cos(a),Math.sin(a),0],tg=[-e[1],e[0],0],L1=[],R1=[];for(let k=0;k<=NK;k++){const v=k/NK,d=r*(.12+.88*v),ww=r*.24*Math.sin(Math.PI*(.12+.8*v))*(v>.9?.75:1)*(1-.4*(1-op2)),z=r*(.25*(1-op2)*v-.12*op2*v*v);
            L1.push(PJ(Bf,O,[e[0]*d+tg[0]*ww,e[1]*d+tg[1]*ww,z]));R1.push(PJ(Bf,O,[e[0]*d-tg[0]*ww,e[1]*d-tg[1]*ww,z]))}
          l30Add(B,tk,DET>=1.5?smooth(L1.concat(R1.reverse()).map(p=>[p[0],p[1]])):l30Poly(L1.concat(R1.reverse())));if(DET>=1.5&&n>-.1){const a1=PJ(Bf,O,[e[0]*r*.2,e[1]*r*.2,0]),a2=PJ(Bf,O,[e[0]*r*.85,e[1]*r*.85,0]);l30Add(B,'pv',`M${f(a1[0])},${f(a1[1])}L${f(a2[0])},${f(a2[1])}`)}}
        if(n>-.1){let d='';for(let i=0;i<5;i++){const a=ph+(i+.5)*1.2566,c=PJ(Bf,O,[Math.cos(a)*r*.13,Math.sin(a)*r*.13,r*.08]);d+=l30O(c[0],-c[1],r*.075)}l30Add(B,'cr',d);const c=PJ(Bf,O,[0,0,r*.14]);l30Add(B,'cl',l30O(c[0],-c[1],r*.065))}
        else{const c=PJ(Bf,O,[0,0,-r*.05]);l30Add(B,'ca',l30O(c[0],-c[1],r*.14))}}})};
    /* the shoot: opposite leaf pairs up the stem; in the upper axils a peduncle bearing a little cyme */
    const nN=Math.max(2,Math.round((L-l0)/(UPC*3.2)));for(let i=0;i<nN;i++){const l=L-UPC*(1.2+3.2*i*(1+.06*i));if(l<l0+5)break;const ph=45+(i%2?90:0)+R(-8,8);
      for(const sd of[0,180]){const az=(ph+sd)*D,q=l30On(A,l,az,.7),H=V3.nz(V3.add(V3.sc(q.T,.55),q.r)),len=UPC*R(3.6,5)*(i?1:.55);
        parts.push(bzBlade(q.p,H,q.T,len,.36,lc,{wp:L30_CORD,droop:.22,arch:.06,fold:.2,face:.4,vn:4,ao:.92}));
        if(i<4&&rnd()<(i?.7:.9)){const k=i>1?2:3,mods=[['F',{l:UPC*R(1.2,2),w1:.6}]];for(let j=0;j<k;j++)mods.push(['[',{w:.5}],['/',{a:j*360/k+R(-20,20)}],['&',{a:R(30,50)}],['F',{l:UPC*R(.8,1.5),w1:.45}],['K',{a:i+j*.4}],[']',{}]);
          const br=bzGrow(A,l,az+.5,R(30,45),mods,{w:.7,seg:UPC*.4,T:[0,1,0],e:.04,wig:.05});l30Twigs(tws,br,[[.55,'t0'],[0,'t1']]);for(const og of br.organs)if(og.t==='K')flower(og,og.p.a)}}}
    {const q=A.at(1);flower({pos:q.p,H:q.T},-.3);flower({pos:V3.add(q.p,V3.sc(q.Fr,1)),H:l30Tilt(q.T,q.Fr,.6)},.2)}
    const P=pal7(cw.c),PO=pal7(mix(cw.c,'#a48ab8',.45)),keys=[];
    for(const[k,Q]of[['p',P],['o',PO]])for(const b of['b',''])for(const j of[0,1])keys.push([k+b+j,{fill:b?mix(toneAt(Q,.5+.2*j),'#c8ccd0',.15):toneAt(Q,.58+.24*j),stroke:Q.ink,'stroke-width':.3,'stroke-opacity':.4}]);
    keys.push(['pv',{fill:'none',stroke:shd(cw.c,-.2),'stroke-width':.35,'stroke-opacity':.5}],['cr',{fill:cor,stroke:shd(cor,-.5),'stroke-width':.25}],['cl',{fill:'#f2f0e8'}],['ca',{fill:'#8a9a7c'}],
      ['bd',{fill:mix(cw.c,'#d8a8c0',blue?.55:.2),stroke:'#6a6070','stroke-width':.3,'stroke-opacity':.5}],['bv',{fill:'none',stroke:'#ffffff','stroke-width':.4,'stroke-opacity':.45}]);
    l30Batch(parts,tws,l30TwKeys([['t0',sc[1],.75],['t1',sc[2],.55]]),DET>=1.5?6:3);l30Flowers(parts,fl,keys,4)}})}
const L30_CORD=prof([[0,.55],[.06,.85],[.22,1],[.5,.86],[.78,.5],[1,.04]]);

/* ---------- registers ---------- */
Object.assign(GH,{'gypsophile':l30Gyps,'waxflower':l30Wax,'solidago':l30Sol,'matricaire':l30Mat,'tweedia':l30Twd});
Object.assign(CWS,{'gypsophile':CW_L30G,'waxflower':CW_L30W,'solidago':CW_L30S,'matricaire':CW_L30M,'tweedia':CW_L30T});
Object.assign(SZG,{'gypsophile':[30,35,40,40,50],'waxflower':[20,25,30,30,35],'solidago':[20,25,25,30],'matricaire':[12,15,15,18],'tweedia':[12,15,15,18]});
Object.assign(GHI,{'gypsophile':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8},'waxflower':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8},'solidago':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.75},
  'matricaire':{form:'grappe',size:1.1,k:'plant',rk:.45,tip:.8},'tweedia':{form:'grappe',size:1.1,k:'plant',rk:1.1,tip:.75}});
