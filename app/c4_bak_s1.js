
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
function pickFour(kind,target,occ,taken){const ok=FOUR[kind];let best=null,bs=1e9;
  for(const r of RECIPES){const m=MBY[r.id]||{};if(!ok(r,m)||taken.has(r.id)||/seche|stabilis|teint|sechee/.test(r.id)||(m.e||[]).includes(occ))continue;
    (r.cols||[]).slice(0,4).forEach(col=>{const d=cdist(col,target)+((m.o||[]).includes(occ)?-16:0)+Math.max(0,(r.price||300)-700)/40+(kind==='branche'&&SEASON==='printemps'&&(r.p||{}).type==='blossom'?-20:0)+rnd()*12;if(d<bs){bs=d;best={r,col}}})}
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
function prof3(p){const sp=p.info||{form:'disque',size:2,k:'head',r:40},[H,S,L]=hsl(p.col||'#cccccc'),r=p.rec||{};return{p,f:r.a==='custom'?(r.p||{}).fn:r.a,sp,form:sp.form,size:sp.size,H,S,L,d3:!!p.d3}}
/* overlap area of two discs (visibility) */
function lens(d,a,b){if(d>=a+b)return 0;if(d<=Math.abs(a-b))return Math.PI*Math.min(a,b)**2;const a2=a*a,b2=b*b;
  return a2*Math.acos(Math.max(-1,Math.min(1,(d*d+a2-b2)/(2*d*a))))+b2*Math.acos(Math.max(-1,Math.min(1,(d*d+b2-a2)/(2*d*b))))-.5*Math.sqrt(Math.max(0,(-d+a+b)*(d+a-b)*(d-a+b)*(d+a+b)))}
/* roles and stem counts from the occasion; no limit on the number of varieties */
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
  const add=(kind,target,role,why)=>{const p=pickFour(kind,target,occ,taken);if(!p)return;taken.add(p.sid);const it=prof3(p);it.extra=1;it.why=why;r[role].push(it);adds.push(it)};
  add('feuillage',T[1],'foliage',T[3]);if(!r.foliage.some(it=>!it.extra)&&(vs==='low'||vs==='hand')&&N>=30)add('feuillage',mix(T[1],'#4f7a3a',.5),'foliage','un second feuillage pour la profondeur');
  const fk=O.fk==='saison'?SKIND[SEASON]:O.fk,ln=k=>k==='graphique'||k==='branche';add(fk,ln(fk)?T[1]:T[2],ln(fk)?'line':'filler',FWHY[fk]+(O.fk==='saison'?` (${SEASON})`:''));
  if(O.fk!=='saison'&&N>=34){const sk=SKIND[SEASON];if(sk!==fk)add(sk,sk==='baies'?mix(T[2],'#a8321e',.5):T[1],ln(sk)?'line':'filler',`${FWHY[sk]} (${SEASON})`)}
  const ef=adds.filter(it=>r.foliage.includes(it)),eo=adds.filter(it=>!r.foliage.includes(it)),G0=N*g;
  for(const it of ef)cnt.set(it,odd(Math.max(2,G0*.55/ef.length)));for(const it of eo)cnt.set(it,odd(Math.max(2,G0*.45/Math.max(1,eo.length))));
  notes.push(`${nv} variété${nv>1?'s':''} choisie${nv>1?'s':''} : ${Math.round(g*100)} % de verdure et de garniture ${g>.24?'pour donner du volume':g<.15?'pour laisser parler les fleurs':'pour équilibrer'}`,
    `palette ${T[0]} : ${T[3]}`,VWHY[vs]);
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items:items.concat(adds),r,cnt,N,tot,gar:Math.max(3,Math.round(N*.05)),adds,notes,tone,vs}}
/* the occasion decides the silhouette: its favourite shapes weigh three times more, the others a third */
function pickTpl(P,vid){const w={};for(const k in TPL)w[k]=TPL[k].w*(P.O.w[k]?P.O.w[k]*3:.35);const{r}=P;
  if(r.drape.length){w.cascade*=3;w.libre*=1.3}else w.cascade*=.15;if(r.line.length>=2){w.vertical*=1.8;w.libre*=1.5;w.eventail*=1.3}if(!r.line.length){w.vertical*=.4;w.libre*=.7}
  let vs=vClass(vid);if(vs==='wrap')vs='hand';
  if(vs==='low'){w.dome*=1.2;w.eventail*=1.3;w.cascade*=1.3;w.vertical*=.5}if(vs==='tall'){w.vertical*=1.6;w.triangle*=1.3;w.lcroissant*=1.3;w.dome*=.6}
  if(vs==='hand'){w.eventail*=1.5;w.libre*=1.3;w.cascade*=1.2;w.dome*=.7}if(vs==='kenzan'){w.vertical*=1.4;w.libre*=1.3;w.lcroissant*=1.4}return wpick(w)}
function basePoint(vid){const v=VZ[vid]||VZ['coupe-blanche'];return v.kind==='hand'||v.kind==='wrap'?[VX,830]:[VX+vMx(v),FL-vMh(v)]}
/* real size of one stem: diameter in cm with natural spread and opening stage */
function stemSize(it,st){const c0=cmOf(it.p),cm=c0*R(.9,1.1)*(st==='bud'?.5:st==='half'?.78:1);return{cm,r:(it.sp.r||c0/2*UPC)*cm/c0}}
const OPENABLE=new Set(['double','cup','star']);
/* stems that bend: natural length of a self-carried stem, stiff (spikes, alliums, plumes) or arching (grasses, branches, leaves, sprays) */
function natLen(it){const sp=it.sp;return sp.self||(sp.an?-sp.an[1]/.82:300)}
function stiffOf(it){const r=it.p.rec||{},ty=(r.p||{}).type;return it.form==='epi'||['xAllium','xDelph','allium'].includes(it.f)||(r.a==='line'&&(ty==='plume'||ty==='seedhead'))}
/* a stem leaving the mouth upright then bending to its tip at angle th (degrees from vertical) and chord len; arching stems end leaning further out */
function spineFor(th,len,stiff,droop=1){const a=th*D,ex=Math.sin(a)*len,ey=-Math.cos(a)*len,sg=Math.sign(th)||(rnd()<.5?-1:1),
    ea=(stiff?th*1.06:th+sg*Math.min(32,6+Math.abs(th)*.38)*droop)*D,k1=len*.36,k2=len*.34;
  return[[0,0],[Math.sin(a)*k1*.22,-k1],[ex-Math.sin(ea)*k2,ey+Math.cos(ea)*k2],[ex,ey]]}
/* where a stem enters the mouth: spread across the opening in the order of the stems' angles, so stems never cross at the neck */
const baseAt=(BP,mw,th)=>[BP[0]+Math.max(-1,Math.min(1,th/65))*mw*.5+R(-2.5,2.5),BP[1]-3];
/* clusters carried on their own stem (sprays, berries, leafy stems, smoke bush) are drawn along a bent stem from the mouth */
/* stems that can be drawn along a bent spine (everything else is a head on its own stem) */
const SPINE_A=new Set(['line','spike','accessory','spray','berries','foliage']),SPINE_FN=new Set(['xDelph','xAllium','oncidium','xSanders','xSnake','xLichen','xSmoke']),bends=it=>{const r=it.p.rec||{};return SPINE_A.has(r.a)||r.a==='custom'&&SPINE_FN.has((r.p||{}).fn)};
const CLU=new Set(['spray','berries','foliage']),isClu=it=>CLU.has((it.p.rec||{}).a)||it.f==='xSmoke';
function hidesUnder(v,S,B,ext){if(!v.prof)return false;
  for(let k=3;k<=20;k++){const q=bz(S,k/20),x=B[0]+q[0],y=B[1]+q[1];for(const dx of[-ext*.6,0,ext*.6])if(y+ext>vSilTop(v,x+dx)-1)return true}return false}
function pickStage(it,edge){const w={open:edge?.55:.85};if(it.d3&&(BUD3.has(it.f)||OPENABLE.has(it.f))){w.half=edge?.35:.18;w.bud=edge?.3:.06}else if(hasView(it.f,'bud')){w.bud=edge?.25:.05;if(hasView(it.f,'half'))w.half=.15}return wpick(w)}

function candidate(P,sv,vid,tk){sd(sv);const T=P.asp?Object.assign({},TPL[tk],{asp:P.asp}):TPL[tk],s0=rnd()<.5?-1:1,s=P.side||s0,BP=basePoint(vid),v=VZ[vid]||{},mw=vMouth(v)||26,{r}=P,cnt=new Map(P.cnt),out=[],heads=[];
  /* every head stem at its real size: the mass is sized from the flowers, not the flowers from the mass */
  const pool=[];for(const k of['focal','second','filler'])for(const it of r[k])for(let j=0;j<cnt.get(it);j++)pool.push({it,role:k,j});
  let area=0;for(const q of pool){const st=pickStage(q.it,q.j>0&&rnd()<.25);Object.assign(q,{st},stemSize(q.it,st));area+=Math.PI*q.r*q.r}
  const st=P.model?{}:P.O,ry=Math.max(60,Math.sqrt(area*.6/(Math.PI*T.asp*(st.dens||1)))),rx=ry*T.asp,dec=R(T.dec[0],T.dec[1])*(st.dec??1),FP=[BP[0]+s*dec*rx*.5,BP[1]-ry*(v.kind==='wrap'?1.02:.82)],H=ry*2.1;
  /* three-lobed envelope: main mass, a lower lobe on the other side, a higher lobe toward the apex — never a ball */
  const lobes=[{cx:FP[0],cy:FP[1],rx,ry},{cx:FP[0]-s*rx*.72,cy:FP[1]+ry*.3,rx:rx*.48,ry:ry*.5},{cx:FP[0]+s*rx*.28,cy:FP[1]-ry*.62,rx:rx*.42,ry:ry*.48}];
  const inEnv=(x,y,k=1)=>lobes.some(l=>((x-l.cx)/(l.rx*k))**2+((y-l.cy)/(l.ry*k))**2<=1);
  const AP=[BP[0]-s*rx*R(.05,.2),FP[1]-ry*R(1.5,1.9)],DP=[BP[0]+s*mw*R(.3,.85),BP[1]+2];
  /* visibility: a head may hide only part of what is behind it, and must stay visible itself */
  const vis=h=>{let occ=0;for(const o of heads)if(o!==h&&o.z>h.z)occ+=lens(Math.hypot(o.x-h.x,o.y-h.y),o.r*.92,h.r*.92);return 1-occ/(Math.PI*(h.r*.92)**2)};
  const fits=(x,y,rr,z,need)=>{if(vis({x,y,r:rr,z})<need)return false;for(const o of heads){if(o.z>=z)continue;const ov=lens(Math.hypot(o.x-x,o.y-y),o.r*.92,rr*.92)/(Math.PI*(o.r*.92)**2);if(ov>(o.focal?.25:.5))return false;if(vis(o)-ov<(o.focal?.72:.38))return false}return true};
  const axFor=(x,y,z,form)=>{const dx=x-BP[0],dy=BP[1]-y,l=Math.hypot(dx,dy)||1;let fz=.3+1.1*z;if(form==='cornet')fz*=.45;if(form==='orchidee'||form==='disque'||form==='coeur'||form==='etoile')fz=Math.max(fz,.6);return V3.nz([dx/l,dy/l,fz])};
  const push=(q,x,y,z,extra={})=>{const o=Object.assign({it:q.it,role:q.role,kind:'head',x,y,z,cm:q.cm,st:q.st,ax:axFor(x,y,z,q.it.form),rr:q.r,rot:Math.atan2(x-BP[0],BP[1]-y)/D*.8},extra);
    if(isClu(q.it)){if(!hand)y=Math.min(y,BP[1]-q.r*1.25-2);const T=[x,y-q.r*.3],B=baseAt(BP,mw,Math.atan2(T[0]-BP[0],BP[1]-T[1])/D),len=Math.max(30,Math.hypot(T[0]-B[0],T[1]-B[1]));
      Object.assign(o,{kind:'self',x:B[0],y:B[1],spine:spineFor(Math.atan2(T[0]-B[0],B[1]-T[1])/D,len,true),from:Math.max(.3,1-2.2*q.r/len)})}
    out.push(o);heads.push({x,y,r:q.r,it:q.it,z,focal:q.role==='focal'})};
  /* lines first: the tallest to the apex, others fanned, never parallel */
  const lines=[];for(const it of r.line)for(let i=0;i<cnt.get(it);i++)lines.push(it);const angs=[],hand=v.kind==='hand'||v.kind==='wrap',amax=hand?66:60;
  lines.forEach((it,i)=>{let th;if(i===0)th=Math.atan2(AP[0]-BP[0],BP[1]-AP[1])/D;else for(let k=0;k<40;k++){th=(rnd()<.65?-s:s)*R(8,amax);if(angs.every(a=>Math.abs(a-th)>=12))break}
    th=Math.max(-amax,Math.min(amax,th));angs.push(th);
    /* a line is cut to the silhouette: never longer than the bouquet asks for, never stretched past its natural stem */
    const want=(i===0?1.08:R(.7,1))*(BP[1]-AP[1])*(1-Math.abs(th)/170),len=Math.min(natLen(it)*R(.9,1),want),B=baseAt(BP,mw,th),fx=Math.max(10,((((it.p.rec||{}).p||{}).fl||{}).cm||0)*UPC*.6+4);let S=spineFor(th,len,stiffOf(it)),ok=hand;
    for(let k=0;k<8&&!ok;k++){if(!hidesUnder(v,S,B,fx)){ok=true;break}th*=.82;S=spineFor(th,len,stiffOf(it),Math.max(.2,1-.15*k))}if(!ok)return;
    out.push({it,role:'line',kind:'self',x:B[0],y:B[1],spine:S,len,ex:B[0]+S[3][0],ey:B[1]+S[3][1],z:.1})});
  /* focal flowers: zigzag at three heights, biggest first so the smaller ones find room around them */
  const TRI=[[-.04,.1],[.2,-.15],[-.24,-.32],[.32,.12],[-.36,.04],[.1,-.48],[-.12,.3]];let fi=0;
  for(const q of pool.filter(q=>q.role==='focal').sort((a,b)=>b.r-a.r)){let ok=false,x,y,z;
    for(let k=0;k<40&&!ok;k++){const o=TRI[(fi+k)%TRI.length];x=FP[0]+s*o[0]*rx*2+R(-12,12)*(1+k*.1);y=FP[1]+o[1]*ry*2+R(-12,12)*(1+k*.1);z=fi<3?R(.8,1):R(.55,.85);if(!hand)y=Math.min(y,BP[1]-q.r*.95-2);ok=fits(x,y,q.r,z,.8)}
    if(ok){push(q,x,y,z);fi++}else q.skip=1}
  /* the mass in drifts: dark varieties near the core, light ones outward; small flowers forward, big ones back */
  const rest=pool.filter(q=>q.role!=='focal').sort((a,b)=>a.it.L-b.it.L),byV=new Map();for(const q of rest){if(!byV.has(q.it))byV.set(q.it,[]);byV.get(q.it).push(q)}
  const hint=(it,dc0)=>{const hp=P.hints&&P.hints.get(it);if(!hp)return dc0;let[x,y]=dc0;const top=FP[1]-ry,hy=hp.h!=null?BP[1]-(.12+.88*hp.h)*(BP[1]-top):y;
    if(hp.pos==='left')x=FP[0]-rx*.55;else if(hp.pos==='right')x=FP[0]+rx*.55;else if(hp.pos==='core')x=FP[0]+R(-.15,.15)*rx;else if(hp.pos==='top')x=FP[0]+R(-.3,.3)*rx;return[x,hp.pos==='top'?FP[1]-ry*.7:hp.pos==='bottom'?FP[1]+ry*.45:hy]};
  [...byV.values()].forEach((grp,gi,all)=>{const dark=gi/Math.max(1,all.length-1),lb=lobes[gi%3===2?1:gi%3===1?2:0],phi=R(0,6.283),dc=hint(grp[0].it,[lb.cx+Math.cos(phi)*lb.rx*(.1+.55*dark),lb.cy+Math.sin(phi)*lb.ry*(.1+.55*dark)]);
    grp.forEach((q,j)=>{let ok=false,x,y,z;const edge=q.st!=='open';for(let k=0;k<60&&!ok;k++){const a=j*2.39+R(-.7,.7),d=q.r*(.6+.5*Math.sqrt(j+1))*(1+k*.04)*(1.35-.6*(st.grp??.5));
        if(edge&&k<30){const l=pick(lobes),t=R(0,6.283);x=l.cx+Math.cos(t)*l.rx*R(.85,1.15);y=l.cy+Math.sin(t)*l.ry*R(.85,1.15)}else{x=dc[0]+Math.cos(a)*d;y=dc[1]+Math.sin(a)*d*.85}
        y=Math.min(y,hand?BP[1]-q.r*.3:BP[1]-q.r*.95-2);if(y>BP[1]-ry*.45)x=Math.max(BP[0]-mw-q.r*1.1,Math.min(BP[0]+mw+q.r*1.1,x));
        z=q.r<34?R(.45,.95):R(.15,.7);ok=(edge?inEnv(x,y,1.25):inEnv(x,y,1.05))&&fits(x,y,q.r,z,k<30?.55:.45)}
      if(ok)push(q,x,y,z);else q.skip=1})});
  /* rim flowers: stems resting on the lip, one spilling over the front, so the bouquet sits IN the vessel */
  if(v.kind!=='hand'&&v.kind!=='wrap'){const rim=rest.filter(q=>q.skip).slice(0,3),extra=rest.filter(q=>!q.skip&&q.r<44);for(let i=0;rim.length<2&&i<extra.length;i++)rim.push(Object.assign({},extra[i]));
    const U=[.78,.62,.22,.4],pl=[];rim.length=Math.min(rim.length,Math.max(2,Math.min(4,Math.round(mw/22))));
    rim.forEach((q,i)=>{const sd2=i%2?-s:s;let x=0,y=0;for(let k=0;k<12;k++){x=BP[0]+sd2*mw*U[i%4]*R(.85,1.15);y=BP[1]-q.r*R(.12,.38);if(pl.every(p=>Math.hypot(p[0]-x,p[1]-y)>(p[2]+q.r)*.72))break}
      pl.push([x,y,q.r]);push(q,x,y,.97,{front:true,rim:true,ax:V3.nz([sd2*.8,.05,.6])});q.skip=0})}
  /* garnish fills the holes inside the envelope: free berries, buds, burnet and grasses picked from the palette */
  const gk=garnishKinds(P.items);let ng=0;for(let k=0;k<400&&ng<P.gar;k++){const l=pick(lobes),t=R(0,6.283),q=Math.sqrt(rnd())*.95,x=l.cx+Math.cos(t)*l.rx*q,y=l.cy+Math.sin(t)*l.ry*q,rr=14;
    if(y>BP[1]-(hand?8:26))continue;if(heads.some(h=>Math.hypot(h.x-x,h.y-y)<(h.r+rr)*.7))continue;out.push({role:'garnish',kind:'garnish',type:gk[ng%gk.length],x,y,rot:R(-40,40),scale:R(.8,1.05),z:R(.02,.3)});heads.push({x,y,r:rr,gar:1,z:.1,it:{p:{id:'g'},L:.3,S:.3}});ng++}
  /* foliage: leafy stems rising from the mouth and arching out behind the mass to its edge, never loose in the air */
  const fang=[],flim=hand?84:70;for(const it of r.foliage||[])for(let i=0;i<cnt.get(it);i++){let th=0;const big=['single','rosette'].includes(((it.p.rec||{}).p||{}).arr);
    /* big single leaves rise behind the flowers; leafy stems may arch further out */
    for(let k=0;k<30;k++){th=(i%2?-s:s)*(big?R(6,42):R(16,flim));if(fang.every(a=>Math.abs(a-th)>=9))break}fang.push(th);
    const dir=[Math.sin(th*D),-Math.cos(th*D)];let d=10,inside=false;for(;d<900;d+=8){if(inEnv(BP[0]+dir[0]*d,BP[1]+dir[1]*d,1))inside=true;else if(inside)break}if(!inside)d=ry*1.1;
    const len=Math.min(natLen(it),d*R(.95,1.15)),B=baseAt(BP,mw,th),lf=((it.p.rec||{}).p||{}).leaf||{},ext=Math.min(60,(lf.cm||(it.p.rec||{}).cm||8)*UPC*.55)+4;let S=spineFor(th,len,false,1.1),ok=hand,dr=1.1;
    const fr=((it.p.rec||{}).p||{}).arr==='frond',chk=S2=>{if(!fr)return hidesUnder(v,S2,B,ext);const a=bang(S2,1)*.75*D,Lf=blen(S2);return hidesUnder(v,[[0,0],[Math.sin(a)*Lf*.33,-Math.cos(a)*Lf*.33],[Math.sin(a)*Lf*.66,-Math.cos(a)*Lf*.66],[Math.sin(a)*Lf,-Math.cos(a)*Lf]],B,Math.max(ext,Lf*.32))};
    for(let k=0;k<9&&!ok;k++){if(!chk(S)){ok=true;break}th*=.84;dr*=.72;S=spineFor(th,len,false,dr)}if(!ok)continue;
    out.push({it,role:'foliage',kind:'self',x:B[0],y:B[1],spine:S,z:R(.01,.08)})}
  /* drapes on the mass side, opposite the apex, hanging from the lip */
  const dl=(T.drape==='L'?1.1:.82)*(H+150);for(const it of r.drape)for(let i=0;i<cnt.get(it);i++)out.push({it,role:'drape',kind:'drape',x:BP[0]+Math.max(-mw*.85,Math.min(mw*.85,DP[0]-BP[0]+s*R(-6,22)+i*s*16)),y:DP[1]-R(2,6),len:R(.32,.5)*dl,sway:s*R(26,70),side:s,z:2});
  for(const o of out){if(o.kind!=='head')continue;o.behind=heads.some(h=>h.z<o.z-.05&&Math.hypot(h.x-o.x,h.y-o.y)<(h.r+o.rr)*.75);o.outer=!inEnv(o.x,o.y,.8)}
  return{out,heads,tk,T,s,H,W:rx*2,FP,AP,DP,BP,ell:{cx:FP[0],cy:FP[1],rx,ry},lobes,P,cnt}}
function garnishKinds(items){const L=items.reduce((a,it)=>a+it.L,0)/Math.max(1,items.length),warm=items.filter(it=>it.S>.2&&(it.H<60||it.H>300)).length>=items.length/2;
  return L<.5?['baies','sanguisorbe','boutons']:warm?['sanguisorbe','boutons','graminee','baies']:['boutons','graminee','baies']}
/* ---------- quality control: balance, every variety visible, density, lines, drapes, grouping ---------- */
function scoreC(c){const{heads,out,BP,ell}=c,hh=heads.filter(h=>!h.gar);let Lw=0,Rw=0;
  for(const h of hh){const w=h.r*h.r*(.6+.8*(1-h.it.L));if(h.x<BP[0])Lw+=w;else Rw+=w}
  const bal=Math.max(Lw,Rw)/Math.max(1,Lw+Rw),sBal=bal<.54?Math.max(0,1-(.54-bal)*4):bal>.72?Math.max(0,1-(bal-.72)*4):1;
  const visOf=h=>{let occ=0;for(const o of heads)if(o!==h&&o.z>h.z)occ+=lens(Math.hypot(o.x-h.x,o.y-h.y),o.r*.92,h.r*.92);return 1-occ/(Math.PI*(h.r*.92)**2)};
  const ids=new Set(c.P.items.filter(it=>it.form!=='retombante'&&it.form!=='ligne'&&it.form!=='epi').map(it=>it.p.id));let shown=0;for(const id of ids)if(hh.some(h=>h.it.p.id===id&&visOf(h)>.6))shown++;
  const sShow=ids.size?shown/ids.size:1,sVisMin=hh.length?Math.min(...hh.map(visOf)):1;
  let inside=0,cov=0;for(let i=0;i<18;i++)for(let j=0;j<14;j++){const x=ell.cx-ell.rx+(i+.5)*ell.rx/9,y=ell.cy-ell.ry+(j+.5)*ell.ry/7;if(((x-ell.cx)/ell.rx)**2+((y-ell.cy)/ell.ry)**2>.75)continue;inside++;if(heads.some(h=>Math.hypot(h.x-x,h.y-y)<=h.r*.95))cov++}
  const sDens=Math.min(1,(inside?cov/inside:0)/.85),lines=out.filter(o=>o.role==='line').length,sLines=c.tk==='dome'?1:Math.min(1,lines/2);
  let same=0,tot=0;for(const h of hh){let nb=null,bd=1e9;for(const o of hh){if(o===h)continue;const d=Math.hypot(o.x-h.x,o.y-h.y);if(d<bd){bd=d;nb=o}}tot++;if(nb&&nb.it.p.id===h.it.p.id)same++}
  const gi=tot?same/tot:.5,sGrp=gi>=.3&&gi<=.75?1:.6,sDrape=c.P.r.drape.length?1:(c.tk==='cascade'?0:.8),skipped=c.P.tot-hh.length;
  return 3*sBal+4*sShow+2*Math.max(0,sVisMin)+3*sDens+2*sLines+2*sDrape+1*sGrp-.08*Math.max(0,skipped)}
/* a reference bouquet: explicit stems, roles, positions, heights, silhouette, side */
function planModel(m){const O=OCCS[(m.occ||[])[0]]||OCCS.juste,r={drape:[],line:[],focal:[],second:[],filler:[],foliage:[]},cnt=new Map(),hints=new Map(),items=[];
  const RM={focal:'focal',second:'second',filler:'filler',accent:'filler',line:'line',drape:'drape',foliage:'foliage'};
  for(const el of m.els){const p=prodFor(el.id,el.col||(RBY[el.id]&&RBY[el.id].cols[0]));if(!p)continue;const it=prof3(p);let role=RM[el.role]||'filler';
    if(role!=='drape'&&it.form==='retombante')role='drape';if((role==='focal'||role==='second'||role==='filler')&&(it.form==='ligne'||it.form==='epi'))role='line';if(role==='line'&&!bends(it))role='second';
    r[role].push(it);items.push(it);cnt.set(it,Math.max(1,Math.round(el.n)));hints.set(it,{pos:el.pos,h:el.h,ang:el.ang})}
  let tot=0;for(const v of cnt.values())tot+=v;return{O,items,r,cnt,N:tot,tot,gar:Math.max(3,Math.round(tot*.12)),hints,asp:m.asp,side:m.side,model:m}}
function compose(ids,sv,occ,vid,model){const P=model?planModel(model):plan(ids,occ,vid);sd(sv*31+7);const tk=model&&TPL[model.tpl]?model.tpl:pickTpl(P,vid);let best=null;for(let k=0;k<8;k++){const c=candidate(P,sv*97+k*13+1,vid,tk),sc=scoreC(c);if(!best||sc>best.score){best=c;best.score=sc}}return best}
