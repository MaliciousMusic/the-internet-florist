
/* ================= Composer v4 — real sizes, stems radiating from the mouth, every flower visible ================= */
/* occasions: each one sets the volume (N stems), the silhouettes it favours, how dense, how grouped and how lopsided the mass is, and the kind of filler added */
const OCCS={amour:{n:"Je t'aime",N:41,w:{dome:2.4,cascade:1.5,eventail:.9},dr:1.4,ln:.7,dens:1.12,grp:.8,dec:.6,fk:'nuage',why:'dôme généreux, masses groupées, une cascade qui adoucit'},
 anniv:{n:'Anniversaire',N:39,w:{libre:2,eventail:1.3},dr:1,ln:1.2,dens:1,grp:.5,dec:1,fk:'festif',why:'silhouette libre et festive, des couleurs qui se répondent'},
 bravo:{n:'Félicitations',N:35,w:{vertical:2,lcroissant:1.6,libre:.9},dr:.8,ln:1.7,dens:.95,grp:.45,dec:1.3,fk:'graphique',why:'un élan vertical, des lignes graphiques qui montent'},
 merci:{n:'Merci',N:31,w:{libre:1.8,triangle:1.3},dr:.8,ln:1.1,dens:.8,grp:.35,dec:.9,fk:'champetre',why:'une brassée légère et champêtre, très aérée'},
 courage:{n:'Courage',N:29,w:{dome:2.2,triangle:1.2},dr:.7,ln:.5,dens:1.05,grp:.6,dec:.4,fk:'nuage',why:'un dôme doux et rond, sans lignes agressives'},
 juste:{n:'Juste comme ça',N:33,w:{libre:2,eventail:.9},dr:1,ln:1,dens:.85,grp:.4,dec:1,fk:'saison',why:'un bouquet naturel et asymétrique, de saison'}};
/* the season of today decides the seasonal touch */
const SEASON=(m=>m>=8&&m<=10?'automne':m===11||m<=1?'hiver':m<=4?'printemps':'été')(new Date().getMonth()),SKIND={automne:'baies',hiver:'branche',printemps:'branche','été':'graphique'};
/* palette of the chosen flowers → tone of the foliage and of the fillers */
const TONE={chaud:['chaude','#5f6b33','#f2e2b0','un feuillage bronze qui réchauffe'],froid:['froide','#8fa8a0','#f4f2ee','un feuillage argenté qui rafraîchit'],
 pastel:['pastel','#9fb491','#f6eef0','un vert tendre qui adoucit'],sombre:['profonde','#2f3b2a','#6a1a2a','un feuillage profond qui donne du relief'],mixte:['mêlée','#4f7a3a','#f6f4ee','un vert frais qui relie les couleurs']};
const FWHY={nuage:'un nuage léger qui enveloppe',festif:'des touches pétillantes',graphique:'des lignes qui donnent de l’élan',champetre:'des ombelles champêtres qui aèrent',baies:'des baies de saison',branche:'des branches de saison'};
const VWHY={low:'coupe basse : le feuillage déborde du col',tall:'vase haut : volume resserré, lignes allongées',hand:'bouquet noué : une collerette de feuillage',wrap:'papier : il fait la collerette, moins de feuillage',kenzan:'pique-fleurs : composition aérée et graphique'};
const VFAC={low:1,tall:.9,hand:1.05,wrap:.95,kenzan:.75};
/* which catalogue species can serve as each kind of filler (fresh only: no dried, dyed or preserved stems) */
const FOUR={feuillage:(r,m)=>m.r==='feuillage'&&r.a==='foliage'&&!/palm|cycas|monstera|philodendron|strelitzia|banan|aspidistra|phormium|cordyline/.test(r.id)&&!['single','rosette','frond'].includes((r.p||{}).arr)&&(((r.p||{}).leaf||{}).cm||r.cm||8)<=12,
 nuage:(r,m)=>['remplissage','texture'].includes(m.r)&&r.a==='spray'&&(((r.p||{}).fl||{}).cm||1)<=1.4,
 champetre:(r,m)=>['remplissage','texture','secondaire'].includes(m.r)&&(r.a==='globe'&&['flat','dome'].includes((r.p||{}).shape)&&(r.cm||9)<=12||r.a==='spray'&&((r.p||{}).fl||{}).a==='radial'),
 festif:(r,m)=>['remplissage','texture','baie'].includes(m.r)&&(r.a==='berries'||r.a==='globe'&&(r.p||{}).shape==='ball'&&(r.cm||9)<=5||r.a==='spray'&&(r.p||{}).shape==='corymb'),
 graphique:(r,m)=>m.r==='graminee'||r.a==='line'&&['grass','loop'].includes((r.p||{}).type||'grass'),
 baies:(r,m)=>m.r==='baie'&&r.a==='berries'&&(((r.p||{}).cm)||r.cm||1)<=1.6&&(r.p||{}).type!=='single',
 branche:(r,m)=>m.r==='branche'&&r.a==='line'};
function cdist(a,b){const x=hx(a),y=hx(b),dr=x[0]-y[0],dg=x[1]-y[1],db=x[2]-y[2];return Math.sqrt(2*dr*dr+4*dg*dg+3*db*db)/3}
function toneOf(items){let w=0,warm=0,cool=0,Ls=0,Ss=0;for(const it of items){w++;if(it.S>.22&&(it.H<65||it.H>330))warm++;if(it.S>.18&&it.H>=170&&it.H<=300)cool++;Ls+=it.L;Ss+=it.S}
  if(!w)return'mixte';const L=Ls/w,Sm=Ss/w;return L<.36?'sombre':L>.72&&Sm<.62?'pastel':warm/w>=.55?'chaud':cool/w>=.45?'froid':'mixte'}
/* the closest species of a kind to a target colour, preferring those whose meaning suits the occasion and never one that would be clumsy */
/* retired colourways (ret:1) stay resolvable but are no longer offered: a proposed filler never takes one (the random draw is still spent, so the other proposals of old gifts stay the same) */
function pickFour(kind,target,occ,taken){const ok=FOUR[kind];let best=null,bs=1e9;
  for(const r of RECIPES){const m=MBY[r.id]||{};if(!ok(r,m)||taken.has(r.id)||/seche|stabilis|teint|sechee/.test(r.id)||(m.e||[]).includes(occ))continue;
    (r.cols||[]).slice(0,4).forEach((col,ci)=>{const d=cdist(col,target)+((m.o||[]).includes(occ)?-16:0)+Math.max(0,(r.price||300)-700)/40+(kind==='branche'&&SEASON==='printemps'&&(r.p||{}).type==='blossom'?-20:0)+rnd()*12;if(d<bs&&!((CWS[r.id]||[])[ci]||{}).ret){bs=d;best={r,col}}})}
  return best&&prodFor(best.r.id,best.col)}
/* silhouettes measured on the references: asp = width/height of the mass */
const TPL={eventail:{w:.24,asp:1.35,lines:[3,5],drape:'l',dec:[.15,.3]},libre:{w:.2,asp:1.2,lines:[3,7],drape:'lL',dec:[.2,.4]},triangle:{w:.16,asp:1,lines:[1,3],drape:'l',dec:[.25,.4]},
 cascade:{w:.12,asp:1.1,lines:[1,3],drape:'L',dec:[.15,.3]},dome:{w:.11,asp:1.12,lines:[0,1],drape:'l',dec:[0,.1]},vertical:{w:.08,asp:.78,lines:[3,5],drape:'l',dec:[.1,.25]},lcroissant:{w:.09,asp:1.25,lines:[1,3],drape:'l',dec:[.35,.5]}};
/* the vessel's class from its real proportions: low and open (coupes, bowls, pots) or tall (vases, bottles, calices) */
const vClass=vid=>{const v=VZ[vid]||{};if(v.kind==='hand')return'hand';if(v.kind==='wrap')return'wrap';if(v.kind==='kenzan')return'kenzan';const wmax=Math.max(...(v.prof||[[0,30]]).map(p=>p[1]));return vH(v)>wmax*1.45||vMouth(v)<24?'tall':'low'};
function sd(v){seed=(Math.abs(Math.round(v))*48271+12345)%2147483647||1;rnd();rnd();rnd()}
const odd=n=>{n=Math.max(1,Math.round(n));return n%2?n:n+1};
const hueD=(a,b)=>{const d=Math.abs(a-b)%360;return d>180?360-d:d};
function hsl(hex){const[r,g,b]=hx(hex).map(v=>v/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=(mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4)*60}return[h,s,l]}
function wpick(w){let t=0;for(const k in w)t+=w[k];let u=rnd()*t;for(const k in w){u-=w[k];if(u<=0)return k}return Object.keys(w)[0]}
function prof3(p){const sp=p.info||{form:'disque',size:2,k:'head',r:40},[H,S,L]=hsl(p.col||'#cccccc'),r=p.rec||{};const dsp=(typeof DEPTH_SP!=='undefined'&&DEPTH_SP[p.sid])||[5,0],it={p,f:r.a==='custom'?(r.p||{}).fn:r.a,sp,form:sp.form,size:sp.size,H,S,L,d3:!!p.d3,dp:dsp[0],piv:dsp[1]};
  it.ol=outlineOf(it);if(it.d3&&!(typeof FOOT_SP!=='undefined'&&FOOT_SP[p.sid]))FOOT_DEF[p.sid]=OUTLINE_FOOT[it.ol==='rond'&&(r.a==='cup'||sp.form==='cornet')?'cup':it.ol];return it}
/* overlap area of two discs (visibility) */
function lens(d,a,b){if(d>=a+b)return 0;if(d<=Math.abs(a-b))return Math.PI*Math.min(a,b)**2;const a2=a*a,b2=b*b;
  return a2*Math.acos(Math.max(-1,Math.min(1,(d*d+a2-b2)/(2*d*a))))+b2*Math.acos(Math.max(-1,Math.min(1,(d*d+b2-a2)/(2*d*b))))-.5*Math.sqrt(Math.max(0,(-d+a+b)*(d+a-b)*(d-a+b)*(d+a+b)))}
/* roles and stem counts from the occasion; no limit on the number of varieties */
/* PLANOPT: the player's own hand in the shop's composer, set by the page around plan(): {qty: Map id→stems, pos: Map id→place
   1–10 (1 at the back, 10 in front, 5 the composer's choice), noAdds: the proposed greenery already taken into the cart,
   air: the bouquet's breathing, 0 tight … 1 stems shown as composed (see settle); a model sets it with m.air, an occasion with O.air};
   null everywhere else (QA, the on-chain page), so their bouquets never change */
let PLANOPT=null;
function plan(ids,occ,vid){sd(ids.slice().sort().join('|').split('').reduce((a,ch)=>(a*31+ch.charCodeAt(0))%2147483,7)+(occ||'').length*131+(vid||'').length*17);
  const O=OCCS[occ]||OCCS.juste,vs=vClass(vid),items=ids.map(id=>PBY[id]).filter(Boolean).map(prof3),r={drape:[],line:[],focal:[],second:[],filler:[],foliage:[]};
  for(const it of items){if(it.form==='retombante')r.drape.push(it);else if((it.form==='ligne'||it.form==='epi')&&bends(it))r.line.push(it);else if(it.form==='feuillage')r.foliage.push(it)}
  const heads=items.filter(it=>!r.drape.includes(it)&&!r.line.includes(it)&&!r.foliage.includes(it)).sort((a,b)=>b.size-a.size||rnd()-.5);
  const nf=Math.max(1,Math.min(3,heads.filter(h=>h.size>=2.5).length||1));r.focal=heads.slice(0,nf);for(const it of heads.slice(nf))(it.size>=1.9?r.second:r.filler).push(it);
  /* volume: the occasion sets the number of stems, the vessel scales it; greenery share falls as more varieties are chosen */
  const nv=items.length,mono=nv===1,N=Math.min(64,Math.max(Math.round(O.N*VFAC[vs])+(nv<=2?-4:0),Math.round(nv*2.6))),g=Math.max(.1,Math.min(.3,.34-.035*nv)),budget=N*(1-g),cnt=new Map();
  const W={focal:5,second:5,filler:6,line:3,drape:2,foliage:2},lim={focal:[3,7],second:[3,9],filler:[3,11],line:[1,5],drape:[1,3],foliage:[1,5]};let raw=0;for(const k in r)for(const it of r[k])raw+=W[k];
  for(const k in r)for(const it of r[k]){let n=mono?budget*.85:W[k]*budget/Math.max(1,raw);if(k==='line')n*=O.ln;if(k==='drape')n*=O.dr;
    let[a,b]=lim[k];if(nv>9&&k!=='line'&&k!=='drape')a=1;n=Math.min(mono&&k!=='line'&&k!=='drape'?25:b,Math.max(a,n));cnt.set(it,k==='drape'?Math.max(1,Math.round(n)):nv>9&&n<2.5?Math.max(1,Math.round(n)):odd(n))}
  /* fourrages: real greenery and fillers chosen by palette, occasion, season and vessel, priced like the flowers */
  const tone=toneOf(items),T=TONE[tone],taken=new Set(items.map(it=>it.p.sid)),adds=[],notes=[`« ${O.n} » : ${O.why}`];
  const add=(kind,target,role,why)=>{if(PLANOPT&&PLANOPT.noAdds)return;const p=pickFour(kind,target,occ,taken);if(!p)return;taken.add(p.sid);const it=prof3(p);it.extra=1;it.why=why;r[role].push(it);adds.push(it)};
  add('feuillage',T[1],'foliage',T[3]);if(!r.foliage.some(it=>!it.extra)&&(vs==='low'||vs==='hand')&&N>=30)add('feuillage',mix(T[1],'#4f7a3a',.5),'foliage','un second feuillage pour la profondeur');
  const fk=O.fk==='saison'?SKIND[SEASON]:O.fk,ln=k=>k==='graphique'||k==='branche';add(fk,ln(fk)?T[1]:T[2],ln(fk)?'line':'filler',FWHY[fk]+(O.fk==='saison'?` (${SEASON})`:''));
  if(O.fk!=='saison'&&N>=34){const sk=SKIND[SEASON];if(sk!==fk)add(sk,sk==='baies'?mix(T[2],'#a8321e',.5):T[1],ln(sk)?'line':'filler',`${FWHY[sk]} (${SEASON})`)}
  const ef=adds.filter(it=>r.foliage.includes(it)),eo=adds.filter(it=>!r.foliage.includes(it)),G0=N*g;
  for(const it of ef)cnt.set(it,odd(Math.max(2,G0*.55/ef.length)));for(const it of eo)cnt.set(it,odd(Math.max(2,G0*.45/Math.max(1,eo.length))));
  notes.push(`${nv} variété${nv>1?'s':''} choisie${nv>1?'s':''} : ${Math.round(g*100)} % de verdure et de garniture ${g>.24?'pour donner du volume':g<.15?'pour laisser parler les fleurs':'pour équilibrer'}`,
    `palette ${T[0]} : ${T[3]}`,VWHY[vs]);
  /* the player's hand: stems counted one by one; a variety set to 8 or more takes a focal place, to 3 or less goes into the mass
     (its depth follows in compose); from the first touch every stem is placed, as for a recipe of the game */
  let ex=0;const X=PLANOPT;if(X){for(const it of items.concat(adds)){const q=X.qty&&X.qty.get(it.p.id);if(q){cnt.set(it,Math.max(1,Math.min(99,Math.round(q))));ex=1}
      const s=X.pos&&X.pos.get(it.p.id);if(!s||s===5)continue;it.pos=s;ex=1;if(s>3&&s<8)continue;
      let k0=null;for(const k of['focal','second','filler']){const i=r[k].indexOf(it);if(i>=0){r[k].splice(i,1);k0=k}}if(k0)(s>=8?r.focal:r.filler).push(it)}
    if(!r.focal.length){const h=r.second.shift()||r.filler.shift();if(h)r.focal.push(h)}}
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items:items.concat(adds),r,cnt,N,tot,gar:Math.max(3,Math.round(N*.05)),adds,notes,tone,vs,ex,air:X&&X.air!=null?X.air:O.air||0}}
/* the occasion decides the silhouette: its favourite shapes weigh three times more, the others a third */
function pickTpl(P,vid){const w={};for(const k in TPL)w[k]=TPL[k].w*(P.O.w[k]?P.O.w[k]*3:.35);const{r}=P;
  if(r.drape.length){w.cascade*=3;w.libre*=1.3}else w.cascade*=.15;if(r.line.length>=2){w.vertical*=1.8;w.libre*=1.5;w.eventail*=1.3}if(!r.line.length){w.vertical*=.4;w.libre*=.7}
  let vs=vClass(vid);if(vs==='wrap')vs='hand';
  if(vs==='low'){w.dome*=1.2;w.eventail*=1.3;w.cascade*=1.3;w.vertical*=.5}if(vs==='tall'){w.vertical*=1.6;w.triangle*=1.3;w.lcroissant*=1.3;w.dome*=.6}
  if(vs==='hand'){w.eventail*=1.5;w.libre*=1.3;w.cascade*=1.2;w.dome*=.7}if(vs==='kenzan'){w.vertical*=1.4;w.libre*=1.3;w.lcroissant*=1.4}return wpick(w)}
function basePoint(vid){const v=VZ[vid]||VZ['coupe-blanche'];return v.kind==='hand'||v.kind==='wrap'?[VX,830]:[VX+vMx(v),FL-vMh(v)]}
/* real size of one stem: diameter in cm with natural spread and opening stage */
/* a greenhouse species is cut at one of its trade grades and draws its own stage; the others shrink their buds here */
function stemSize(it,st){const c0=cmOf(it.p),gr=SZG[it.p.sid];if(gr){const cm=pick(gr)*R(.96,1.04);return{cm,r:(it.sp.r||c0/2*UPC)*cm/c0*(st==='bud'?.62:st==='half'?.86:1)}}
  const cm=c0*R(.9,1.1)*(st==='bud'?.5:st==='half'?.78:1);return{cm,r:(it.sp.r||c0/2*UPC)*cm/c0}}
const OPENABLE=new Set(['double','cup','star']);
/* stems that bend: natural length of a self-carried stem, stiff (spikes, alliums, plumes) or arching (grasses, branches, leaves, sprays) */
function natLen(it){const sp=it.sp;return sp.self||(sp.an?-sp.an[1]/.82:300)}
function stiffOf(it){const r=it.p.rec||{},ty=(r.p||{}).type,gh=GHI[it.p.sid];if(gh&&gh.tip!=null)return gh.tip;return it.form==='epi'||['xAllium','xDelph','allium'].includes(it.f)||(r.a==='line'&&(ty==='plume'||ty==='seedhead'))}
/* a stem leaving the mouth upright then bending to its tip at angle th (degrees from vertical) and chord len; arching stems end leaning further out */
function spineFor(th,len,stiff,droop=1){const a=th*D,ex=Math.sin(a)*len,ey=-Math.cos(a)*len,sg=Math.sign(th)||(rnd()<.5?-1:1),
    ea=(typeof stiff==='number'?th*stiff:stiff?th*1.06:th+sg*Math.min(32,6+Math.abs(th)*.38)*droop)*D,k1=len*.36,k2=len*.34;
  return[[0,0],[Math.sin(a)*k1*.22,-k1],[ex-Math.sin(ea)*k2,ey+Math.cos(ea)*k2],[ex,ey]]}
/* where a stem enters the mouth: spread across the opening in the order of the stems' angles, so stems never cross at the neck */
const baseAt=(BP,mw,th)=>[BP[0]+Math.max(-1,Math.min(1,th/65))*mw*.5+R(-2.5,2.5),BP[1]-3];
/* clusters carried on their own stem (sprays, berries, leafy stems, smoke bush) are drawn along a bent stem from the mouth */
/* stems that can be drawn along a bent spine (everything else is a head on its own stem) */
const SPINE_A=new Set(['line','spike','accessory','spray','berries','foliage']),SPINE_FN=new Set(['xDelph','xAllium','oncidium','xSanders','xSnake','xLichen','xSmoke']),bends=it=>{const r=it.p.rec||{};return SPINE_A.has(r.a)||r.a==='custom'&&SPINE_FN.has((r.p||{}).fn)};
const CLU=new Set(['spray','berries','foliage']),isClu=it=>!(GHI[it.p.sid]&&GHI[it.p.sid].k==='head')&&(CLU.has((it.p.rec||{}).a)||it.f==='xSmoke'||it.f==='oncidium');
function hidesUnder(v,S,B,ext,k0=3){if(!v.prof)return false;
  for(let k=k0;k<=20;k++){const q=bz(S,k/20),x=B[0]+q[0],y=B[1]+q[1];for(const dx of[-ext*.6,0,ext*.6])if(y+ext>vSilTop(v,x+dx)-1)return true}return false}
function pickStage(it,edge){const w={open:edge?.55:.85};if(it.d3&&(BUD3.has(it.f)||OPENABLE.has(it.f)||(GHI[it.p.sid]||{}).buds||GH_BUDS.has(it.p.sid))){w.half=edge?.35:.18;w.bud=edge?.3:.06}else if(hasView(it.f,'bud')){w.bud=edge?.25:.05;if(hasView(it.f,'half'))w.half=.15}return wpick(w)}
/* ---------- head footprints ----------
   the composer places a head by the point its stem reaches (its anchor, X Y); what the head covers is its real footprint (app/z6.js
   FOOT_SP, measured on drawn heads): 1 to 3 circles [x, y, radius] along its stem, toward the head; a species not measured keeps the old
   disc of .92 r on its anchor */
/* the fan of the stems over the mouth: a head h above the rim lies at most mw + 1.1 r + FAN h to the side (~58° from upright) */
const FAN=1.6;
/* how deep stems stand in a vessel: in its bowl, not in its foot (a footed coupe holds water only above the narrow stem of its foot) */
function vDepth(v){const H=vH(v),P=v.prof;if(!P||!P.length)return H;const mx=Math.max(...P.map(p=>p[1]));let hf=0;for(const p of P)if(p[0]<H*.6&&p[1]<mx*.45)hf=Math.max(hf,p[0]);return H-hf}
/* ---------- outlines ----------
   every head has an outline class, from its measured footprint (FOOT_SP) or else from its kind, so that a species drawn yesterday, today or
   tomorrow is placed by its shape: rond (discs, cups, rosettes, globes), epi (spikes and racemes: a line), gerbe (sprays, umbels, berries:
   wide and light), pendant (bells hanging below their stem's end). A new 3D head not yet measured takes its class's footprint
   (medians of the measured ones; a cup sits higher on its stem); a 2D drawing keeps the disc on its centre */
const OUTLINE_FOOT={rond:[.2,.95,.85],cup:[.8,.85,.82],epi:[1.1,.75,1.8],gerbe:[.6,1.6,1.2],pendant:[-1.6,1.6,1.4]},FOOT_DEF={};
function outlineOf(it){const sid=it.p.sid,f=typeof FOOT_SP!=='undefined'&&FOOT_SP[sid],r=it.p.rec||{},a=r.a==='custom'?(r.p||{}).fn:r.a,fm=it.form;
  if(f){if(f[0]<=-.8)return'pendant';if(f[2]>=f[1]*1.6)return'epi';if(f[1]>=f[2]*1.6)return'gerbe';return'rond'}
  if(a==='bell')return'pendant';if(a==='spike'||fm==='epi'||fm==='grappe')return'epi';if(['spray','berries','dot'].includes(a)||isClu(it))return'gerbe';return'rond'}
const footOf=sid=>(typeof FOOT_SP!=='undefined'&&FOOT_SP[sid])||FOOT_DEF[sid]||[0,.92,.92],footK=sid=>{const f=footOf(sid);return f[1]*f[2]/.8464};
function footCircles(sid,X,Y,r,B,dir){const[c,sa,sb]=footOf(sid);let ux=dir?dir[0]:X-B[0],uy=dir?dir[1]:Y-B[1];const l=Math.hypot(ux,uy);if(l<1e-6){ux=0;uy=-1}else if(!dir&&l<6){ux=0;uy=-1}else{ux/=l;uy/=l}
  const n=Math.max(1,Math.min(3,Math.round(sb/sa))),rad=n===1?Math.sqrt(sa*sb):Math.max(sa,sb/n),sp=n>1?2*(sb-rad)/(n-1):0,C=[];
  for(let k=0;k<n;k++){const a=c+(k-(n-1)/2)*sp;C.push([X+ux*a*r,Y+uy*a*r,rad*r])}return C}
/* overlap of two footprints, the area of one, its heart (the middle of its circles, a third of their radius) and whether a footprint F,
   in front, lies on the heart of the footprint C behind it (petals reach past 2 sigma: 1.1 of the circles), a flower stuck into another,
   the clipping the eye never forgives; fBig: F is clearly the bigger (1.3 times the area), so that hiding part of C, heart included, reads as
   depth (C behind it), not as clipping */
/* CORE_K: [reach of the head in front, size of the heart behind]; ?ck=1.1,1 in the address to try others */
const CORE_K=(()=>{const m=typeof location!=='undefined'&&/[?&]ck=([\d.]+),([\d.]+)/.exec(location.search);return m?[+m[1],+m[2]]:[1.1,1]})();
const fBig=(F,C)=>fArea(F)>=fArea(C)*1.3,fOv=(A,B)=>{let s=0;for(const a of A)for(const b of B)s+=lens(Math.hypot(a[0]-b[0],a[1]-b[1]),a[2],b[2]);return s},fArea=C=>{let s=0;for(const a of C)s+=Math.PI*a[2]*a[2];return s},
  fHeart=C=>{let x=0,y=0,r=0;for(const a of C){x+=a[0];y+=a[1];r+=a[2]}const n=C.length;return[x/n,y/n,r/n*.35]},
  fCore=(F,C)=>{const k=fHeart(C);for(const a of F)if(Math.hypot(a[0]-k[0],a[1]-k[1])<a[2]*CORE_K[0]+k[2]*CORE_K[1])return true;return false};
/* a heads entry: its anchor X Y and radius r (the composer's), its footprint c, and the centre x y of that footprint; a rim flower,
   turned outward over the lip (dir), lies along that direction, not along its stem */
function footSet(h,X,Y,B){h.X=X;h.Y=Y;h.c=footCircles(h.sid,X,Y,h.r,B,h.dir);let x=0,y=0,w=0;for(const a of h.c){const m=a[2]*a[2];x+=a[0]*m;y+=a[1]*m;w+=m}h.x=x/w;h.y=y/w;return h}

/* ---------- settling: stems are never cut, they bend at the bottom of the vessel ----------
   a head's stem as c5 (stemTo) draws it from the mouth, sampled every 6 units above the vessel's silhouette (below it the vessel hides it);
   each sample [x, y, length, number of flowers in front of it]: every head is drawn in front of every stem, so a sample inside a head's
   footprint (SET_K/.92 of its circles) is hidden, one in none of them is bare stem */
const SET_K=.82,QS=typeof location!=='undefined'?location.search:'',SETTLE_OFF=/[?&]noset=1/.test(QS),NOREACH=/[?&]noreach=1/.test(QS),NOSTEMZ=/[?&]nostemz=1/.test(QS),NOTALL=/[?&]notall=1/.test(QS);
/* to compare in the lab: ?noset=1 the bouquet before settling, ?noreach=1 without the stems' reach, ?nostemz=1 without the stems' depth rule,
   ?notall=1 without the products made for height (tallL, tallH) */
function stemSamples(x,y,BP,mw,rx,rimY){const bx=BP[0]+Math.max(-1,Math.min(1,(x-BP[0])/Math.max(60,rx)))*mw*.45,by=BP[1]+8,dy=BP[1]-y,Lc=Math.hypot(x-bx,by-y),sh=Math.max(0,Math.min(1,1-(Lc-20)/50)),
    P1=[bx+(x-bx)*.22,BP[1]-dy*.33],P1s=[bx+(x-bx)*.33,by+(y-by)*.33],P=[[bx,by],[P1[0]+(P1s[0]-P1[0])*sh,P1[1]+(P1s[1]-P1[1])*sh],[x-(x-bx)*.3,y+dy*.35],[x,y]],n=Math.max(4,Math.ceil(Lc/6)),S=[];
  let p=P[0];for(let i=1;i<=n;i++){const q=bz(P,i/n),l=Math.hypot(q[0]-p[0],q[1]-p[1]);p=q;if(q[1]<rimY(q[0])-1)S.push([q[0],q[1],l,0])}return{S,bx,P}}
/* a head may come down its stem, but a low one stays over the mouth: the higher, the wider the fan (FAN: stems leave the mouth at most ~58°
   from upright); over the mouth a head may rest on the lip (c5 then draws it in front of the vessel), elsewhere it stays clear of it.
   1. the neck: every stem passes through the mouth, so the bundle just above it is the barest place of a bouquet; up to 8 times, a small or
      middle head (never a focal one, never one set at the back by the player or by its species' plane) is brought to the spot where the
      most bare stem lies within its reach, when that hides more than its size of bare stem;
   2. settling, from the mouth outward (four passes): a head showing more bare stem than its allowance (a bud or a half-open head may
      stand on a short bare stem, a focal flower hardly any) slides down its stem toward the mouth: down to the lip, then as far as its
      bare stem, or 70, 45, 25 % of it, at its depth or a little behind (never a head the player set in front). Over a narrow neck (its mouth
      narrower than the median head) a head stays a diameter above the mouth: lower, its neck would end in the mouth and its stem turn back.
   A move is kept only where the head still fits (it stays visible and hides no flower behind it more than placing allows) and the bouquet
   as a whole shows less bare stem. air (0–1, the bouquet's breathing) widens every allowance and brings fewer heads to the neck: 0 the
   tightest bouquet, 1 no settling at all. Returns the bare length and the length of stem above the vessel, for the score */
function settle(heads,BP,mw,rx,ry,v,hand,fits,axFor,PL,air=0,fan=FAN){const rimY=x=>hand||!v.prof?BP[1]:Math.min(FL,vSilTop(v,x)),KC=SET_K/.92,
    inD=(p,h)=>{for(const a of h.c)if((p[0]-a[0])**2+(p[1]-a[1])**2<(a[2]*KC)**2)return true;return false},
    M=heads.filter(h=>h.o&&h.o.kind==='head'&&!h.o.rim&&!h.o.front);
  const build=h=>{const s=stemSamples(h.X,h.Y,BP,mw,rx,rimY);h.S=s.S;h.ss=s.S;h.bx=s.bx;for(const p of h.S)for(const o of heads)if(inD(p,o))p[3]++},
    bare=h=>{let e=0;for(const p of h.S)if(!p[3])e+=p[2];return e},total=()=>{let e=0;for(const h of M)e+=bare(h);return e},
    moveTo=(h,X,Y)=>{for(const k of M)if(k!==h)for(const p of k.S)if(inD(p,h))p[3]--;footSet(h,X,Y,BP);for(const k of M)if(k!==h)for(const p of k.S)if(inD(p,h))p[3]++;build(h)},
    onLip=(h,Y)=>!hand&&Y>BP[1]-h.r*.95-2,
    fitsAt=(h,X,Y,z,need)=>{const i=heads.indexOf(h),lip=onLip(h,Y);heads.splice(i,1);const zz=fits(X,Y,h.r,lip?Math.max(z,.97):z,need,h.sid,lip,h.reach?{r:h.r,it:h.it}:null);heads.splice(i,0,h);return zz},
    dB=h=>Math.hypot(h.X-BP[0],h.Y-BP[1]);
  const cone=(x,y,r)=>Math.abs(x-BP[0])-(mw+r*1.1+Math.max(0,BP[1]-y)*fan),
    yLim=(h,x)=>{if(hand)return BP[1]-h.r*.3;const m=Math.abs(x-BP[0])<=mw*.9+h.r*.4;return m&&mw<rMed?BP[1]-h.r*2-2:m&&!h.focal?BP[1]-h.r*.45:BP[1]-h.r*.95-2};
  for(const h of M)build(h);let tot=total();const moved=new Set();
  /* 1. the neck: the head's footprint goes on the spot (its anchor below it, along its stem) */
  const rs=M.map(h=>h.r).sort((a,b)=>a-b),rMed=rs[rs.length>>1]||20,cell=12,RC=Math.ceil(rMed*SET_K/cell);
  for(let it=0;it<Math.round(8*(1-air));it++){const G=new Map();for(const h of M)for(const p of h.S)if(!p[3]){const k=Math.floor(p[0]/cell)+','+Math.floor(p[1]/cell);G.set(k,(G.get(k)||0)+p[2])}
    const spots=[];for(const k of G.keys()){const[i,j]=k.split(',').map(Number);let s=0;for(let a=-RC;a<=RC;a++)for(let b=-RC;b<=RC;b++)if(a*a+b*b<=RC*RC+1)s+=G.get((i+a)+','+(j+b))||0;spots.push([(i+.5)*cell,(j+.5)*cell,s])}
    spots.sort((a,b)=>b[2]-a[2]);if(!spots.length||spots[0][2]<rMed*1.2)break;
    const cand=M.filter(h=>!h.focal&&!h.tall&&!moved.has(h)&&h.r<=rMed*1.35&&PL(h.it)>3&&(h.it.dp||5)>3).map(h=>[h,bare(h)]).sort((a,b)=>b[1]-a[1]||a[0].r-b[0].r).slice(0,14).map(a=>a[0]);
    let best=null;for(const sp of spots.slice(0,4))for(const h of cand){const ux=sp[0]-BP[0],uy=sp[1]-BP[1],l=Math.hypot(ux,uy)||1,c=footOf(h.sid)[0]*h.r,X=sp[0]-ux/l*c,Y=Math.min(sp[1]-uy/l*c,yLim(h,X)),X0=h.X,Y0=h.Y;if(!hand&&cone(X,Y,h.r)>0)continue;
      for(const z0 of[h.z,Math.max(h.z,.92)]){if(z0!==h.z&&PL(h.it)<5)continue;const z=fitsAt(h,X,Y,z0,.5);if(z===null)continue;moveTo(h,X,Y);const g=tot-total();moveTo(h,X0,Y0);if(g>h.r*1.2&&(!best||g>best.g))best={h,X,Y,z,g};break}}
    if(!best)break;moveTo(best.h,best.X,best.Y);best.h.z=onLip(best.h,best.Y)?Math.max(best.z,.97):best.z;tot=total();moved.add(best.h)}
  /* 2. settling */
  for(let pass=0;pass<4;pass++){let n=0;M.sort((a,b)=>dB(a)-dB(b));
    for(const h of M){if(h.tall)continue;const e=bare(h),allow=(h.o.st!=='open'?h.r*1.1:h.focal?h.r*.3:h.r*.55)*(1+2.5*air)+air*24;if(e<=allow+4)continue;
      const tx=h.bx,ty=BP[1],d=Math.hypot(h.X-tx,h.Y-ty);if(d<h.r*1.2)continue;const ux=(tx-h.X)/d,uy=(ty-h.Y)/d,X0=h.X,Y0=h.Y,c0=cone(X0,Y0,h.r),zs=PL(h.it)>=8?[h.z]:[h.z,h.z-.25];
      let done=false;for(const z of zs){for(const f of[0,1,.7,.45,.25]){const s=Math.min(f?(e-allow)*f:1e9,d-h.r*1.2);if(s<4)continue;let X=X0+ux*s,Y=Y0+uy*s;const yM=yLim(h,X);
          if(Y>yM){const s2=(yM-Y0)/uy;if(!(s2>=4))continue;X=X0+ux*s2;Y=yM}
          if(!hand&&cone(X,Y,h.r)>Math.max(0,c0))continue;const zz=fitsAt(h,X,Y,z,h.focal?.72:z<h.z?.4:.5);if(zz===null)continue;
          moveTo(h,X,Y);const t2=total();if(t2<tot-Math.max(3,s*.2)){tot=t2;n++;moved.add(h);h.z=onLip(h,Y)?Math.max(zz,.97):zz;done=true;break}moveTo(h,X0,Y0)}if(done)break}}
    if(!n)break}
  /* a head come down onto the lip rests on it like the rim flowers: in front of the vessel, turned outward, its stem over the lip */
  for(const h of moved){const o=h.o;o.x=h.X;o.y=h.Y;o.z=h.z;o.ax=axFor(h.X,h.Y,h.z,h.it.form);o.rot=Math.atan2(h.X-BP[0],BP[1]-h.Y)/D*.8;o.settled=1;
    if(!hand&&h.Y>BP[1]-h.r*.95-2){const sd=Math.sign(h.X-BP[0])||1;Object.assign(o,{front:true,rim:true,ax:V3.nz([sd*.8,.05,.6]),z:Math.max(h.z,.97)+.01+heads.indexOf(h)*1e-4});h.z=o.z;h.dir=[sd,.06];footSet(h,h.X,h.Y,BP);h.ss=[]}}
  let vis=0;for(const h of M)for(const p of h.S)vis+=p[2];for(const h of M){delete h.S;delete h.bx}return{bare:tot,vis,moved:moved.size,n:M.length}}
/* clean overlaps: a head still lying on the heart of a flower behind it (one placed where nothing fitted, a rim flower) moves to the
   nearest place around its anchor where it fits, inside the bouquet's envelope: the smaller of the two first, never a focal flower when the other is not; a head under
   a cluster on its own stem or under the drapes' clump moves itself; two passes.
   Returns how many hearts stay covered (0 is the aim, like the kinks of the stems) */
function untangle(heads,BP,hand,fits,axFor,SF,crosses,inEnv=()=>true){const H=heads.filter(h=>h.o&&h.o.kind==='head'),F=heads.filter(h=>h.o||h.dr),fitsAt=(h,X,Y,z,need)=>{const i=heads.indexOf(h);heads.splice(i,1);const zz=fits(X,Y,h.r,z,need,h.sid,!!h.o.rim,h.reach?{r:h.r,it:h.it}:null);heads.splice(i,0,h);return zz};
  /* first the depths: a head a stem runs behind comes in front of that stem's head, as far as its own stem lets it (three passes); one that
     cannot is moved like a covered heart */
  const zr=h=>{let lo=-9,hi=9;for(const o of heads){if(o===h||o.gar&&!o.dr)continue;if(o.ss&&o.ss.length&&crosses(o.ss,h.c))lo=Math.max(lo,o.z+.01);if(!o.dr&&h.ss&&h.ss.length&&crosses(h.ss,o.c))hi=Math.min(hi,o.z-.01)}return[lo,hi]};
  for(let pass=0;pass<3;pass++){let n=0;for(const h of H){if(h.o.rim)continue;const[lo,hi]=zr(h);if(lo>hi||h.z>=lo&&h.z<=hi)continue;h.z=h.z<lo?lo:hi;h.o.z=h.z;n++}if(!n)break}
  const clash=()=>{const L=[];for(const a of F)for(const b of H){if(a===b||a.z<=b.z||!a.dr&&fBig(a.c,b.c))continue;if(fCore(a.c,b.c))L.push([a,b])}
    for(const h of H){if(h.o.rim)continue;const[lo,hi]=zr(h);if(lo>hi)L.push([h,h])}return L};let L=clash();
  for(let pass=0;pass<2&&L.length;pass++){for(const[a,b]of L){if(a!==b&&!fCore(a.c,b.c))continue;const m=a===b?[a]:!H.includes(a)?[b]:(a.focal&&!b.focal)||(a.focal===b.focal&&a.r>b.r)?[b,a]:[a,b];
      for(const h of m){let ok=false;
        for(let k=1;k<=10&&!ok;k++)for(let j=0;j<12&&!ok;j++){const t=j/12*6.2832+k*.7,X=h.X+Math.cos(t)*h.r*.35*k,Y=Math.min(h.Y+Math.sin(t)*h.r*.35*k,hand?BP[1]-h.r*.3:h.o.rim?h.Y:BP[1]-h.r*.95-2);if(!h.o.rim&&!inEnv(X,Y,1.1))continue;
          const zz=fitsAt(h,X,Y,h.z,h.focal?.6:.35);if(zz!==null){footSet(h,X,Y,BP);h.ss=h.o.rim?[]:SF(X,Y);h.z=zz;const o=h.o;o.x=X;o.y=Y;o.z=zz;if(!o.rim)o.ax=axFor(X,Y,h.z,h.it.form);o.rot=Math.atan2(X-BP[0],BP[1]-Y)/D*.8;ok=true}}
        if(ok)break}}
    L=clash()}
  return L.length}

function candidate(P,sv,vid,tk){sd(sv);const T=P.asp?Object.assign({},TPL[tk],{asp:P.asp}):TPL[tk],s0=rnd()<.5?-1:1,s=P.side||s0,BP=basePoint(vid),v=VZ[vid]||{},mw=vMouth(v)||26,{r}=P,cnt=new Map(P.cnt),out=[],heads=[];
  /* every head stem at its real size: the mass is sized from the flowers, not the flowers from the mass */
  const pool=[];for(const k of['focal','second','filler'])for(const it of r[k])for(let j=0;j<cnt.get(it);j++)pool.push({it,role:k,j});
  let area=0;for(const q of pool){const st=pickStage(q.it,q.j>0&&rnd()<.25);Object.assign(q,{st},stemSize(q.it,st));area+=Math.PI*q.r*q.r*footK(q.it.p.sid)}
  /* reach: a stem is as long as it is. Its trade length (rec.stem.cm) less what stands in the vessel (down to the water: 55 % of the
     vessel's height, 4 to 22 cm; a pin holder 2 cm; the ~20 cm drawn under the tie of a held bouquet), slightly curved (1.06): a head is never
     further from the mouth than that, never nearer than its own size allows (1.3 r, at the lip); the vessel's depth is its bowl's (vDepth). Short stems stay low, long ones may rise:
     the verticality of a bouquet comes from its stems */
  const dep=v.kind==='hand'||v.kind==='wrap'?20:v.kind==='kenzan'?2:Math.max(4,Math.min(22,.55*vDepth(v)/UPC)),
    reachOf=q=>{const cm=((((q.it||{}).p||{}).rec||{}).stem||{}).cm||50;return Math.max(q.r*1.3,(cm-dep)*UPC/1.06)},
    inReach=(q,x,y,k=1)=>{const Rr=NOREACH?1e9:reachOf(q)*k,d=Math.hypot(x-BP[0],y-BP[1]);return d<=Rr?[x,y]:[BP[0]+(x-BP[0])*Rr/d,BP[1]+(y-BP[1])*Rr/d]};
  const st=P.model?{}:P.O;let ry=Math.max(60,Math.sqrt(area*.6/(Math.PI*T.asp*(st.dens||1)))),rx=ry*T.asp;
  /* the mass stays within reach of its stems: half of its heads must be able to reach its top, the longest stems hold the top (it widens,
     its area kept, never past that reach) */
  /* a mass held down by its stems opens its fan wider (up to ~64° from upright), so that its flowers find room at the sides */
  let fan=FAN;{const a=pool.map(reachOf).sort((x,y)=>x-y),RQ=a.length&&!NOREACH?a[Math.floor(a.length*.5)]:1e9;if(1.82*ry>RQ){const k=RQ/(1.82*ry);ry*=k;rx=Math.max(rx,Math.min(rx/k,RQ*1.1));fan=FAN*Math.min(1.3,1/Math.sqrt(k))}}
  const dec=R(T.dec[0],T.dec[1])*(st.dec??1),FP=[BP[0]+s*dec*rx*.5,BP[1]-ry*(v.kind==='wrap'?1.02:.82)],H=ry*2.1;
  /* three-lobed envelope: main mass, a lower lobe on the other side, a higher lobe toward the apex — never a ball */
  const lobes=[{cx:FP[0],cy:FP[1],rx,ry},{cx:FP[0]-s*rx*.72,cy:FP[1]+ry*.3,rx:rx*.48,ry:ry*.5},{cx:FP[0]+s*rx*.28,cy:FP[1]-ry*.62,rx:rx*.42,ry:ry*.48}];
  const inEnv=(x,y,k=1)=>lobes.some(l=>((x-l.cx)/(l.rx*k))**2+((y-l.cy)/(l.ry*k))**2<=1);
  /* the drapes hang over the lip on the bouquet's side, or, on a sculpted vessel (v.sil), on the side of the lip where nothing rises (never
     over a bat's body or a dragon's coil) */
  const ds=v.sil?(vSilTop(v,BP[0]+mw*1.4)>=vSilTop(v,BP[0]-mw*1.4)?1:-1):s;
  const AP=[BP[0]-s*rx*R(.05,.2),FP[1]-ry*R(1.5,1.9)],DP=[BP[0]+ds*mw*R(.3,.85),BP[1]+2];
  /* visibility, on the real footprints: a head may hide only part of what is behind it and never its heart, must stay visible itself, and
     no head in front of it may lie on its own heart */
  const vis=h=>{let occ=0;for(const o of heads)if(o!==h&&o.z>h.z)occ+=fOv(o.c,h.c);return 1-occ/fArea(h.c)};
  /* lip: the head will rest on the lip (in front of the vessel); any other stays 8 units clear of the vessel's silhouette, or c5 would
     raise it and bring it in front of everything */
  /* a vessel measured on its model (v.sil): above the mouth its sculpture is solid (a bat's head, a horn, a spathe). A stem leaves through
     the opening and never runs through it; a flower resting on the lip never lies on what rises higher than the lip */
  const rock=(x,y,C,lip)=>{if(lip){for(const a of C)for(const dx of[-.7,0,.7]){const X=a[0]+a[2]*dx,top=vSilTop(v,X);if(top<BP[1]-6&&a[1]+a[2]*.8>top)return false}return true}
    const Pq=stemSamples(x,y,BP,mw,rx,rimY).P;for(let i=1;i<=24;i++){const q=bz(Pq,i/24);if(q[1]<BP[1]-4&&q[1]>vSilTop(v,q[0])+3)return false}return true};
  const clear=C=>{if(hand||!v.prof)return true;for(const a of C){const lim=Math.min(vSilTop(v,a[0]-a[2]*.7),vSilTop(v,a[0]),vSilTop(v,a[0]+a[2]*.7));if(a[1]+a[2]>lim-8)return false}return true};
  /* stems: as c5 draws them, sampled above the vessel (a cluster: the foot of its own spine); every stem is drawn behind every head, so a stem
     may only pass behind flowers standing in front of its own head, or it seems to run through them: a head's depth lies between the
     flowers whose stems run behind it (it must be in front of them) and those its own stem runs behind (it must stay behind them) */
  const rimY=x=>v.kind==='hand'||v.kind==='wrap'||!v.prof?BP[1]:Math.min(FL,vSilTop(v,x)),SF=(X,Y)=>stemSamples(X,Y,BP,mw,rx,rimY).S,
    spineS=o=>{const S=[];for(let i=1;i<=12;i++){const q=bz(o.spine,(o.from||1)*i/12),X=o.x+q[0],Y=o.y+q[1];if(Y<rimY(X)-1)S.push([X,Y])}return S},
    inBody=(p,C)=>{for(const a of C)if((p[0]-a[0])**2+(p[1]-a[1])**2<(a[2]*.8)**2)return true;return false},crosses=(S,C)=>{for(const p of S)if(inBody(p,C))return true;return false};
  /* fitz: the depth the head can take there (z if it may, or the nearest allowed), or null where it does not fit: out of reach, too near the
     vessel, a stem through a flower, not visible enough, hiding too much or a heart */
  const FD=typeof window!=='undefined'&&window.FITDBG,no=k=>{if(FD)FD[k]=(FD[k]||0)+1;return null};/* lab: window.FITDBG={} counts the refusals */
  const fitz=(x,y,rr,z,need,sid,lip,q)=>{if(q&&!NOREACH&&Math.hypot(x-BP[0],y-BP[1])>reachOf(q)+.5)return no('reach');
    const C=footCircles(sid,x,y,rr,BP,lip?[Math.sign(x-BP[0])||1,.06]:null);if(!lip&&!clear(C))return no('rim');if(v.sil&&!hand&&!rock(x,y,C,lip))return no('vase');
    const S=lip?[]:SF(x,y);let lo=-9,hi=9;for(const o of heads){if(o.gar&&!o.dr)continue;if(o.ss&&o.ss.length&&crosses(o.ss,C))lo=Math.max(lo,o.z+.01);if(!o.dr&&crosses(S,o.c))hi=Math.min(hi,o.z-.01)}
    if(NOSTEMZ){lo=-9;hi=9}if(lo>hi)return no('stemz');z=Math.max(lo,Math.min(hi,z));if(vis({c:C,z})<need)return no('vis');
    for(const o of heads){if(o.z>=z){if((!o.gar&&!fBig(o.c,C)||o.dr)&&fCore(o.c,C))return no('heartF');continue}const ov=fOv(o.c,C)/fArea(o.c);if(!ov)continue;if(ov>(o.focal?.25:.5))return no('hide');if(vis(o)-ov<(o.focal?.72:.38))return no('hideV');if(!o.gar&&!fBig(C,o.c)&&fCore(C,o.c))return no('heartB')}return z},
    fits=(...a)=>fitz(...a)!==null;
  const axFor=(x,y,z,form)=>{const dx=x-BP[0],dy=BP[1]-y,l=Math.hypot(dx,dy)||1;let fz=.3+1.1*z;if(form==='cornet')fz*=.45;if(form==='orchidee'||form==='disque'||form==='coeur'||form==='etoile')fz=Math.max(fz,.6);return V3.nz([dx/l,dy/l,fz])};
  /* the player's place for a variety (1 at the back … 10 in front, 5 untouched): its depth, how much of it must stay visible, where in the mass */
  const PL=it=>P.ex&&!P.recipe&&it.pos&&it.pos!==5?it.pos:5,
    /* products made for height: their trade stem (rec.stem.cm) is long and they stand at the back, set there by the player (place 1-4) or by
       their species' plane (profondeur.csv). A woody branch (a line at the back, never a grass or a loop) keeps a long stem, up to what it can
       reach above the water; a head on a stem a quarter longer than the bouquet's usual one rises above the dome, at the back */
    stemCm=it=>(((it.p||{}).rec||{}).stem||{}).cm||50,back=(it,k)=>{const p=PL(it);return p<=k||p===5&&(it.dp||5)<=k},
    cmMed=(a=>a.length?a[a.length>>1]:40)(pool.map(q=>stemCm(q.it)).sort((x,y)=>x-y)),
    tallL=it=>!NOTALL&&!it.short&&back(it,3)&&!['grass','loop'].includes(((it.p.rec||{}).p||{}).type||'grass'),
    tallH=it=>!NOTALL&&!isClu(it)&&stemCm(it)>=Math.max(45,cmMed*1.2)&&back(it,4),reachL=it=>Math.max(40,(stemCm(it)-dep)*UPC/1.06),pz=(q,z)=>{const p=PL(q.it);if(p!==5)return Math.max(-.6,Math.min(1.6,z+(p-5)*.12));const d=q.it.dp||5;return d===5?z:Math.max(-.3,Math.min(1.3,z+(d-5)*.05))},pn=(q,n)=>PL(q.it)<=3?n*.55:n;
  const push=(q,x,y,z,extra={})=>{const o=Object.assign({it:q.it,role:q.role,kind:'head',x,y,z,cm:q.cm,st:q.st,ax:axFor(x,y,z,q.it.form),rr:q.r,rot:Math.atan2(x-BP[0],BP[1]-y)/D*.8},extra);
    if(isClu(q.it)){if(!hand)y=Math.min(y,BP[1]-q.r*1.25-2);const T=[x,y-q.r*.3],B=baseAt(BP,mw,Math.atan2(T[0]-BP[0],BP[1]-T[1])/D),len=Math.max(30,Math.hypot(T[0]-B[0],T[1]-B[1]));
      Object.assign(o,{kind:'self',x:B[0],y:B[1],spine:spineFor(Math.atan2(T[0]-B[0],B[1]-T[1])/D,len,true),from:Math.max(.3,1-2.2*q.r/len)})}
    out.push(o);const h=footSet({r:q.r,it:q.it,sid:q.it.p.sid,z,focal:q.role==='focal',o,dir:o.rim?[Math.sign(o.ax[0])||1,.06]:null,reach:reachOf(q)},x,y,BP);h.ss=o.rim?[]:o.kind==='self'?spineS(o):SF(x,y);heads.push(h)};
  /* the clump the drapes leave at the lip (c5 draws them in front of everything): no heart under it */
  if(r.drape.length&&v.kind!=='hand'&&v.kind!=='wrap'){let nd=0;for(const it of r.drape)nd+=cnt.get(it);const dx=DP[0]+ds*Math.min(14,mw*.3),dy=BP[1]-8,dr=Math.min(34,16+6*nd);heads.push({x:dx,y:dy,X:dx,Y:dy,r:dr,c:[[dx,dy,dr]],gar:1,dr:1,z:2,it:{p:{id:'drape'},L:.3,S:.3}})}
  /* lines first: the tallest to the apex, others fanned, never parallel */
  const lines=[];for(const it of r.line)for(let i=0;i<cnt.get(it);i++)lines.push(it);if(lines.some(it=>it.short))lines.sort((a,b)=>(a.short?1:0)-(b.short?1:0));const angs=[],hand=v.kind==='hand'||v.kind==='wrap',amax=hand?66:60;
  lines.forEach((it,i)=>{let th;if(i===0)th=Math.atan2(AP[0]-BP[0],BP[1]-AP[1])/D;else for(let k=0;k<40;k++){th=(rnd()<.65?-s:s)*R(8,tallL(it)?Math.min(amax,28):amax);if(angs.every(a=>Math.abs(a-th)>=12))break}
    th=Math.max(-amax,Math.min(amax,th));angs.push(th);
    /* a line is cut to the silhouette: never longer than the bouquet asks for, never stretched past its natural stem */
    const want=(it.short?R(.44,.64):i===0?1.08:R(.7,1))*(BP[1]-AP[1])*(1-Math.abs(th)/170),
      len=tallL(it)?Math.min(natLen(it)*R(.9,1),Math.max(want,reachL(it)*(i===0?R(.9,.98):R(.78,.95))*(1-Math.abs(th)/150))):Math.min(natLen(it)*R(.9,1),want),B=baseAt(BP,mw,th),gh=GHI[it.p.sid]||{},lty=((it.p.rec||{}).p||{}).type,fx=gh.fx||(lty==='loop'?Math.max(24,len*.24):Math.max(10,((((it.p.rec||{}).p||{}).fl||{}).cm||0)*UPC*.6+4)),k0=gh.fx?(it.short?4:7):3;let S=spineFor(th,len,stiffOf(it)),ok=hand;
    for(let k=0;k<(P.ex?24:8)&&!ok;k++){if(!hidesUnder(v,S,B,fx,k0)){ok=true;break}th*=.82;S=spineFor(th,len,stiffOf(it),Math.max(.2,1-.15*k))}if(!ok&&!P.ex)return;
    out.push({it,role:'line',kind:'self',x:B[0],y:B[1],spine:S,len,ex:B[0]+S[3][0],ey:B[1]+S[3][1],z:it.short?R(.25,.55):.1,short:!!it.short})});
  /* focal flowers: zigzag at three heights, biggest first so the smaller ones find room around them */
  const TRI=[[-.04,.1],[.2,-.15],[-.24,-.32],[.32,.12],[-.36,.04],[.1,-.48],[-.12,.3]];let fi=0;
  for(const q of pool.filter(q=>q.role==='focal').sort((a,b)=>b.r-a.r)){if((GHI[q.it.p.sid]||{}).rim){q.skip=1;continue}let ok=false,x,y,z;
    for(let k=0;k<40&&!ok;k++){const o=TRI[(fi+k)%TRI.length];x=FP[0]+s*o[0]*rx*2+R(-12,12)*(1+k*.1);y=FP[1]+o[1]*ry*2+R(-12,12)*(1+k*.1);z=pz(q,fi<3?R(.8,1):R(.55,.85));{const p=PL(q.it);if(p>=8){x=FP[0]+(x-FP[0])*.6;y=Math.max(y,FP[1]+ry*.18)}else if(p<=3)y=Math.min(y,FP[1]-ry*.38)}
      if(!hand)y=Math.min(y,BP[1]-q.r*.95-2);[x,y]=inReach(q,x,y);const zz=fitz(x,y,q.r,z,pn(q,.8),q.it.p.sid,false,q);ok=zz!==null;if(ok)z=zz}
    if(ok){push(q,x,y,z);fi++}else q.skip=1}
  /* the mass in drifts: dark varieties near the core, light ones outward; small flowers forward, big ones back */
  const rest=pool.filter(q=>q.role!=='focal').sort((a,b)=>a.it.L-b.it.L),byV=new Map();for(const q of rest){if(!byV.has(q.it))byV.set(q.it,[]);byV.get(q.it).push(q)}
  const hint=(it,dc0)=>{const pl=PL(it),dl=it.dp||5,hp=pl>=8?{pos:'bottom'}:pl<=3?{pos:'top'}:P.hints&&P.hints.get(it)||(dl>=8?{pos:'bottom',soft:1}:dl<=3?{pos:'top',soft:1}:null);if(!hp)return dc0;let[x,y]=dc0;const top=FP[1]-ry,hy=hp.h!=null?BP[1]-(.12+.88*hp.h)*(BP[1]-top):y;
    if(hp.pos==='left')x=FP[0]-rx*.55;else if(hp.pos==='right')x=FP[0]+rx*.55;else if(hp.pos==='core')x=FP[0]+R(-.15,.15)*rx;else if(hp.pos==='top')x=FP[0]+R(-.3,.3)*rx;const hr=[x,hp.pos==='top'?FP[1]-ry*.7:hp.pos==='bottom'?FP[1]+ry*.45:hy];
    /* a species' usual plane only leans the drift halfway toward the front low or the back high */
    return hp.soft?[(dc0[0]+hr[0])/2,(dc0[1]+hr[1])/2]:hr};
  [...byV.values()].forEach((grp,gi,all)=>{const dark=gi/Math.max(1,all.length-1),lb=lobes[gi%3===2?1:gi%3===1?2:0],phi=R(0,6.283),b0=[lb.cx+Math.cos(phi)*lb.rx*(.1+.55*dark),lb.cy+Math.sin(phi)*lb.ry*(.1+.55*dark)],ol=grp[0].it.ol;
    /* by outline: spikes draw the silhouette (outward and up, along their own stems), hanging bells keep to the low edge where they fall on
       nothing, sprays lie between the core and the edge, round heads where the drift puts them */
    const sg=Math.sign(b0[0]-BP[0])||s,d0=ol==='epi'?[BP[0]+(b0[0]-BP[0])*1.2,b0[1]-ry*.18]:ol==='pendant'?[BP[0]+sg*rx*.7,FP[1]+ry*.4]:ol==='gerbe'?[FP[0]+(b0[0]-FP[0])*1.12,b0[1]]:b0,
      tl=tallH(grp[0].it),dc=tl?inReach(grp[0],FP[0]+R(-.3,.3)*rx,BP[1]-Math.max(reachOf(grp[0])*R(.8,.9),(BP[1]-FP[1]+ry)*R(.95,1.1))):inReach(grp[0],...hint(grp[0].it,d0),.85);
    grp.forEach((q,j)=>{if((GHI[q.it.p.sid]||{}).rim){q.skip=1;return}let ok=false,x,y,z;const edge=q.st!=='open'&&!tl;for(let k=0;k<60&&!ok;k++){const a=j*2.39+R(-.7,.7),d=q.r*(.6+.5*Math.sqrt(j+1))*(1+k*.04)*(1.35-.6*(st.grp??.5));
        if(edge&&k<30){const l=pick(lobes),t=R(0,6.283);x=l.cx+Math.cos(t)*l.rx*R(.85,1.15);y=l.cy+Math.sin(t)*l.ry*R(.85,1.15)}else if(tl){x=dc[0]+Math.cos(a)*d*.5;y=dc[1]+Math.abs(Math.sin(a))*d*1.2}else{x=dc[0]+Math.cos(a)*d;y=dc[1]+Math.sin(a)*d*.85}
        y=Math.min(y,hand?BP[1]-q.r*.3:BP[1]-q.r*.95-2);{const cw=mw+q.r*1.1+Math.max(0,BP[1]-y)*fan;x=Math.max(BP[0]-cw,Math.min(BP[0]+cw,x))}[x,y]=inReach(q,x,y);
        z=pz(q,q.r<34?R(.45,.95):R(.15,.7));if(tl?Math.abs(x-FP[0])>rx*.6:!(edge?inEnv(x,y,1.25):inEnv(x,y,1.05)))continue;const zz=fitz(x,y,q.r,z,pn(q,k<30?.55:.45),q.it.p.sid,false,q);ok=zz!==null;if(ok)z=zz}
      if(ok){push(q,x,y,z);if(tl){heads[heads.length-1].tall=1;out[out.length-1].tall=1}}else q.skip=1})});
  /* rim flowers: stems resting on the lip, one spilling over the front, so the bouquet sits IN the vessel (never a variety the player set at the back,
     never a product made for height) */
  if(v.kind!=='hand'&&v.kind!=='wrap'){const rimF=q=>(GHI[q.it.p.sid]||{}).rim?1:0,rim=rest.filter(q=>q.skip&&PL(q.it)>3&&!tallH(q.it)).concat(pool.filter(q=>q.role==='focal'&&q.skip&&rimF(q)&&PL(q.it)>3)).sort((a,b)=>rimF(b)-rimF(a)).slice(0,3),extra=rest.filter(q=>!q.skip&&q.r<44);for(let i=0;!P.ex&&rim.length<2&&i<extra.length;i++)rim.push(Object.assign({},extra[i]));
    const U=[.78,.62,.22,.4],pl=[];rim.length=Math.min(rim.length,Math.max(2,Math.min(4,Math.round(mw/22))));
    /* on a sculpted vessel (v.sil) a rim flower never lies on what rises above the lip: it takes the other side, or is left out; and it
       must be one the lip can hold (a bottle's neck carries no anthurium lying on it) */
    rim.forEach((q,i)=>{if(v.sil&&q.r>mw*1.2)return;let sd2=i%2?-s:s,x=0,y=0,ok=false;for(let k=0;k<(v.sil?24:12);k++){if(k===12)sd2=-sd2;x=BP[0]+sd2*mw*U[i%4]*R(.85,1.15);y=BP[1]-q.r*R(.12,.38);const free=pl.every(p=>Math.hypot(p[0]-x,p[1]-y)>(p[2]+q.r)*.72);
        if(!v.sil){if(free)break;continue}if(free&&rock(x,y,footCircles(q.it.p.sid,x,y,q.r,BP,[sd2,.06]),true)){ok=true;break}}
      if(v.sil&&!ok)return;pl.push([x,y,q.r]);push(q,x,y,.97+i*.002,{front:true,rim:true,ax:V3.nz([sd2*.8,.05,.6])});q.skip=0})}
  if(P.ex)for(const q of pool){if(q.skip!==1)continue;let ok=false,x=FP[0],y=FP[1],z=.3;
    for(let k=0;k<160&&!ok;k++){const l=lobes[k%3],t=R(0,6.283),d=Math.sqrt(rnd())*(1+k*.006);[x,y]=inReach(q,l.cx+Math.cos(t)*l.rx*d,Math.min(l.cy+Math.sin(t)*l.ry*d,hand?BP[1]-q.r*.3:BP[1]-q.r*.95-2));z=pz(q,R(.1,.6));const zz=fitz(x,y,q.r,z,Math.max(.12,.45-k*.003),q.it.p.sid,false,q);ok=zz!==null;if(ok)z=zz}
    push(q,x,y,z);q.skip=0}
  /* stems are never cut: whatever a stem has beyond what the bouquet shows bends at the bottom of the vessel (or runs on under the tie),
     so a head may slide down its own stem toward the mouth. The bouquet settles as in a real vase: from the mouth outward, a head whose
     stem would show bare between the flowers comes down along it until the flowers below hide it, never hiding them, and the bundle
     just above the mouth is filled first (ikebana pins excepted). P.air, the bouquet's breathing, lets stems show on purpose */
  const air=Math.max(0,Math.min(1,P.air||0)),sett=v.kind==='kenzan'||SETTLE_OFF||air>=1?null:settle(heads,BP,mw,rx,ry,v,hand,fitz,axFor,PL,air,fan),clash=untangle(heads,BP,hand,fitz,axFor,SF,crosses,inEnv);
  /* garnish fills the holes inside the envelope: free berries, buds, burnet and grasses picked from the palette; its foot stays above the vessel's silhouette (lobes, handles);
     it leans with the fan of the stems (out from the binding point), so its own stem arrives along its axis and never breaks */
  const gk=garnishKinds(P.items);let ng=0;for(let k=0;k<400&&ng<P.gar;k++){const l=pick(lobes),t=R(0,6.283),q=Math.sqrt(rnd())*.95,x=l.cx+Math.cos(t)*l.rx*q,y=l.cy+Math.sin(t)*l.ry*q,rr=14;
    if(y>BP[1]-(hand?8:26))continue;const gfan=Math.max(-55,Math.min(55,Math.atan2(x-BP[0],BP[1]-y)/D)),grot=Math.max(-55,Math.min(55,gfan*.85+R(-12,12))),gsc=R(.8,1.05),fx=x-12*gsc*Math.sin(grot*D),fy=y+12*gsc*Math.cos(grot*D);if(!hand&&v.prof&&(y+16>Math.min(vSilTop(v,x-18),vSilTop(v,x-9),vSilTop(v,x),vSilTop(v,x+9),vSilTop(v,x+18))||fy+6>Math.min(vSilTop(v,fx-8),vSilTop(v,fx),vSilTop(v,fx+8))))continue;if(heads.some(h=>h.c.some(a=>Math.hypot(a[0]-x,a[1]-y)<(a[2]/.92+rr)*.7)))continue;out.push({role:'garnish',kind:'garnish',type:gk[ng%gk.length],x,y,rot:grot,scale:gsc,z:R(.02,.3)});heads.push({x,y,X:x,Y:y,r:rr,c:[[x,y,rr*.92]],gar:1,z:.1,it:{p:{id:'g'},L:.3,S:.3}});ng++}
  /* foliage: leafy stems rising from the mouth and arching out behind the mass to its edge, never loose in the air */
  const fang=[],flim=hand?84:70;for(const it of r.foliage||[])for(let i=0;i<cnt.get(it);i++){let th=0;const big=['single','rosette'].includes(((it.p.rec||{}).p||{}).arr);
    /* big single leaves rise behind the flowers; leafy stems may arch further out; a greenhouse foliage gives its own clearance (GHI fx) and is checked along its real spine */
    for(let k=0;k<30;k++){th=(i%2?-s:s)*(big?R(6,42):R(16,flim));if(fang.every(a=>Math.abs(a-th)>=9))break}fang.push(th);
    const dir=[Math.sin(th*D),-Math.cos(th*D)];let d=10,inside=false;for(;d<900;d+=8){if(inEnv(BP[0]+dir[0]*d,BP[1]+dir[1]*d,1))inside=true;else if(inside)break}if(!inside)d=ry*1.1;
    const len=Math.min(natLen(it),d*R(.95,1.15)),B=baseAt(BP,mw,th),lf=((it.p.rec||{}).p||{}).leaf||{},gx=(GHI[it.p.sid]||{}).fx,ext=gx||Math.min(60,(lf.cm||(it.p.rec||{}).cm||8)*UPC*.55)+4;let S=spineFor(th,len,false,1.1),ok=hand,dr=1.1;
    /* a big leaf drawn by its species (GH[sid].bigLeaf = {ext, k0}) rises on its petiole: only the top of its spine, where the blade starts, must clear the lip */
    const fr=!gx&&((it.p.rec||{}).p||{}).arr==='frond',bl=(GH[it.p.sid]||{}).bigLeaf,chk=S2=>{if(bl)return hidesUnder(v,S2,B,bl.ext,bl.k0);if(!fr)return hidesUnder(v,S2,B,ext);const a=bang(S2,1)*.75*D,Lf=blen(S2);return hidesUnder(v,[[0,0],[Math.sin(a)*Lf*.33,-Math.cos(a)*Lf*.33],[Math.sin(a)*Lf*.66,-Math.cos(a)*Lf*.66],[Math.sin(a)*Lf,-Math.cos(a)*Lf]],B,Math.max(ext,Lf*.32))};
    for(let k=0;k<(P.ex?24:9)&&!ok;k++){if(!chk(S)){ok=true;break}th*=.84;dr*=.72;S=spineFor(th,len,false,dr)}if(!ok&&!P.ex)continue;
    out.push({it,role:'foliage',kind:'self',x:B[0],y:B[1],spine:S,z:R(.01,.08)})}
  /* drapes on the mass side, opposite the apex, hanging from the lip */
  const dl=(T.drape==='L'?1.1:.82)*(H+150);for(const it of r.drape)for(let i=0;i<cnt.get(it);i++)out.push({it,role:'drape',kind:'drape',x:BP[0]+Math.max(-mw*.85,Math.min(mw*.85,DP[0]-BP[0]+ds*R(-6,22)+i*ds*16)),y:DP[1]-R(2,6),len:R(.32,.5)*dl,sway:ds*R(26,70),side:ds,z:2});
  for(const o of out){if(o.kind!=='head')continue;o.behind=heads.some(h=>h.z<o.z-.05&&Math.hypot(h.x-o.x,h.y-o.y)<(h.r+o.rr)*.75);o.outer=!inEnv(o.x,o.y,.8)}
  return{out,heads,tk,T,s,H,W:rx*2,FP,AP,DP,BP,ell:{cx:FP[0],cy:FP[1],rx,ry},lobes,P,cnt,sett,clash}}
function garnishKinds(items){const L=items.reduce((a,it)=>a+it.L,0)/Math.max(1,items.length),warm=items.filter(it=>it.S>.2&&(it.H<60||it.H>300)).length>=items.length/2;
  return L<.5?['baies','sanguisorbe','boutons']:warm?['sanguisorbe','boutons','graminee','baies']:['boutons','graminee','baies']}
/* ---------- quality control: balance, every variety visible, density, lines, drapes, grouping ---------- */
function scoreC(c){const{heads,out,BP,ell}=c,hh=heads.filter(h=>!h.gar);let Lw=0,Rw=0;
  for(const h of hh){const w=h.r*h.r*(.6+.8*(1-h.it.L));if(h.x<BP[0])Lw+=w;else Rw+=w}
  const bal=Math.max(Lw,Rw)/Math.max(1,Lw+Rw),sBal=bal<.54?Math.max(0,1-(.54-bal)*4):bal>.72?Math.max(0,1-(bal-.72)*4):1;
  const visOf=h=>{let occ=0;for(const o of heads)if(o!==h&&o.z>h.z)occ+=fOv(o.c,h.c);return 1-occ/fArea(h.c)};
  const ids=new Set(c.P.items.filter(it=>it.form!=='retombante'&&it.form!=='ligne'&&it.form!=='epi').map(it=>it.p.id));let shown=0;for(const id of ids)if(hh.some(h=>h.it.p.id===id&&visOf(h)>.6))shown++;
  const sShow=ids.size?shown/ids.size:1,sVisMin=hh.length?Math.min(...hh.map(visOf)):1;
  let inside=0,cov=0;for(let i=0;i<18;i++)for(let j=0;j<14;j++){const x=ell.cx-ell.rx+(i+.5)*ell.rx/9,y=ell.cy-ell.ry+(j+.5)*ell.ry/7;if(((x-ell.cx)/ell.rx)**2+((y-ell.cy)/ell.ry)**2>.75)continue;inside++;if(heads.some(h=>h.c.some(a=>Math.hypot(a[0]-x,a[1]-y)<=a[2]*1.03)))cov++}
  const sDens=Math.min(1,(inside?cov/inside:0)/.85),lines=out.filter(o=>o.role==='line').length,sLines=c.tk==='dome'?1:Math.min(1,lines/2);
  let same=0,tot=0;for(const h of hh){let nb=null,bd=1e9;for(const o of hh){if(o===h)continue;const d=Math.hypot(o.x-h.x,o.y-h.y);if(d<bd){bd=d;nb=o}}tot++;if(nb&&nb.it.p.id===h.it.p.id)same++}
  const gi=tot?same/tot:.5,sGrp=gi>=.3&&gi<=.75?1:.6,sDrape=c.P.r.drape.length?1:(c.tk==='cascade'?0:.8),skipped=c.P.tot-hh.length;
  /* bare stem seen between the flowers (share of the stems above the vessel), after settling */
  const sBare=c.sett&&c.sett.vis?c.sett.bare/c.sett.vis*(1-(c.P.air||0)):0;
  return 3*sBal+4*sShow+2*Math.max(0,sVisMin)+3*sDens+2*sLines+2*sDrape+1*sGrp-.08*Math.max(0,skipped)-3*sBare}
/* a reference bouquet: explicit stems, roles, positions, heights, silhouette, side */
function planModel(m){const O=OCCS[(m.occ||[])[0]]||OCCS.juste,r={drape:[],line:[],focal:[],second:[],filler:[],foliage:[]},cnt=new Map(),hints=new Map(),items=[];
  const RM={focal:'focal',second:'second',filler:'filler',accent:'filler',line:'line',drape:'drape',foliage:'foliage'};
  for(const el of m.els){const p=prodFor(el.id,el.col||(RBY[el.id]&&RBY[el.id].cols[0]));if(!p)continue;const it=prof3(p);let role=RM[el.role]||'filler';
    if(role!=='drape'&&it.form==='retombante')role='drape';if(role==='drape'&&it.form!=='retombante')role=bends(it)?'line':'second';if((role==='focal'||role==='second'||role==='filler')&&(it.form==='ligne'||it.form==='epi')){role='line';if(RM[el.role]!=='focal')it.short=1}if(role==='line'&&!bends(it))role='second';
    r[role].push(it);items.push(it);cnt.set(it,Math.max(1,Math.round(el.n)));hints.set(it,{pos:el.pos,h:el.h,ang:el.ang});if(el.place&&el.place!==5)it.pos=el.place}
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items,r,cnt,N:tot,tot,gar:Math.max(3,Math.round(tot*.12)),hints,asp:m.asp,side:m.side,model:m,ex:m.hand?1:0,air:m.air!=null?m.air:O.air||0}}
/* a recipe of the game: the exact stems a bouquet burned, variety by variety; nothing is added (no greenery, no garnish), the roles come from the flowers themselves */
function planRecipe(rc,occ,vid){const O=OCCS[occ]||OCCS.juste,vs=vClass(vid),r={drape:[],line:[],focal:[],second:[],filler:[],foliage:[]},cnt=new Map(),items=[];
  for(const[id,n]of rc){const p=PBY[id];if(!p||!(n>0))continue;const it=prof3(p);items.push(it);cnt.set(it,Math.max(1,Math.round(n)))}
  for(const it of items){if(it.form==='retombante')r.drape.push(it);else if((it.form==='ligne'||it.form==='epi')&&bends(it))r.line.push(it);else if(it.form==='feuillage')r.foliage.push(it)}
  const heads=items.filter(it=>!r.drape.includes(it)&&!r.line.includes(it)&&!r.foliage.includes(it)).sort((a,b)=>b.size-a.size||(a.p.id<b.p.id?-1:a.p.id>b.p.id?1:0));
  const nf=Math.max(1,Math.min(3,heads.filter(h=>h.size>=2.5).length||1));r.focal=heads.slice(0,nf);for(const it of heads.slice(nf))(it.size>=1.9?r.second:r.filler).push(it);
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items,r,cnt,N:tot,tot,gar:0,adds:[],notes:[`recette : ${tot} tiges`],tone:items.length?toneOf(items):'neutre',vs,recipe:1,ex:1,air:O.air||0}}
function compose(ids,sv,occ,vid,model,recipe){const P=model?planModel(model):recipe?planRecipe(recipe,occ,vid):plan(ids,occ,vid);sd(sv*31+7);const tk=model&&TPL[model.tpl]?model.tpl:pickTpl(P,vid);let best=null;for(let k=0;k<8;k++){const c=candidate(P,sv*97+k*13+1,vid,tk),sc=scoreC(c);if(!best||sc>best.score){best=c;best.score=sc}}
  /* a variety set forward or back by the player: its lines, leaves and drapes drawn after or before the others (its heads were placed
     at their depth); 1–3 goes into the back layer, behind every flower; 7–10 into the mass, where it can come in front of them */
  if(P.ex&&!P.recipe)for(const o of best.out){const s=o.it&&o.it.pos;if(!s||s===5)continue;if(o.role==='line'||o.role==='foliage'||o.kind==='drape')o.z+=(s-5)*.12;o.back=s<=3;o.fwd=s>=7}
  return best}
