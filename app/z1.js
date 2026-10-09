
/* ================= Stades de vie : le même bouquet au fil de ses 30 jours — bourgeon, éclosion, déclin, fané ================= */
/* LIFE: null for the usual rendering, else {stage:0..3, u:0..1 (progress within the stage)}, set by the caller around buildBq */
let LIFE=null;
/* LIFE_ALL: null, or 'open' / 'fane' to draw every head at one stage whatever the composition gave it (its footprint, hence the composition,
   unchanged): 'open' every flower fully open (with LIFE in bloom), 'fane' every flower opened then faded (with LIFE faded) */
let LIFE_ALL=null;
const LIFE_NAMES=['Bourgeon','Éclosion','Déclin','Fané'];
/* the stage of a bouquet from its age in days, with the thresholds of the contract: bud < 3, bloom < 20, decline < 30, then faded */
function lifeAt(days){const d=Math.max(0,days);return d<3?{stage:0,u:d/3}:d<20?{stage:1,u:(d-3)/17}:d<30?{stage:2,u:(d-20)/10}:{stage:3,u:Math.min(1,(d-30)/30)}}
/* how far the tissues have wilted (0 fresh, 1 dry) */
const lifeW=L=>!L?0:L.stage===2?.22+.28*L.u:L.stage===3?.62+.3*L.u:0;
/* a stable number in [0,1) from a few values: stage decisions never draw from the bouquet's random stream */
const lifeH=(...a)=>{let h=2166136261;for(const v of a){h^=Math.round(v*997)|0;h=Math.imul(h,16777619)}return((h>>>0)%100003)/100003};
/* how each species ages, until the research sheets (catalogue/fanaison) take over:
   k how much its colours turn, nod how far its heads give way at the neck, shed how many petals it drops, dry whether it dries in place */
const LIFE_KEEP=/stabilis|seche|teint|plume-|strass|fil-alu|lichen/;
const LIFE_DRYS=/protea|immortelle|statice|limonium|helichrysum|xerochrysum|gomphrena|craspedia|lagurus|pampa|typha|banksia|leucadendron|eryngium|echinops|lunaire|capsule|hortensia|achillee|celosie|amarante|astilbe|lavande|nigelle/;
const LIFE_SOFT=/tulipe|anemone|renoncule|gerbera|pavot|cosmos|scabieuse|tournesol|zinnia|dahlia|pois-de-senteur|lisianthus|rose|pivoine|freesia|iris|jacinthe|narcisse|muflier|giroflee|hellebore|calla|arum|gloriosa/;
const LIFE_SHED=/tulipe|rose|pivoine|anemone|renoncule|pavot|lis-|dahlia|cosmos|camelia|pois-de-senteur|hellebore|pommier|cerisier|amandier|pecher|magnolia|sato-zakura|cognassier|clematite|gloriosa|lisianthus/;
const LIFE_PROF={};
function lifeProfile(p){const sid=p&&p.sid;if(!sid)return{k:1,nod:0,shed:0,dry:0};if(LIFE_PROF[sid])return LIFE_PROF[sid];const rec=p.rec||{},a=rec.a,g=GHI[sid]||{};let r;
  const sp=typeof LIFE_SP!=='undefined'&&LIFE_SP[sid];
  if(LIFE_KEEP.test(sid))r={k:0,nod:0,shed:0,dry:0};
  /* the research sheet of the species, when there is one (catalogue/fanaison, z2.js) */
  else if(sp)r={k:sp[0],nod:sp[1],shed:sp[2],dry:sp[3],days:sp[4]};
  /* dries in place: hydrangeas turn antique, proteas and leucadendrons dull, true everlastings keep most of their colour */
  else if(/hortensia/.test(sid))r={k:.8,nod:.12,shed:0,dry:1};
  else if(a==='protea'||/protea|leucadendron|banksia|serruria|mimetes|telopea/.test(sid))r={k:.62,nod:.06,shed:0,dry:1};
  else if(LIFE_DRYS.test(sid))r={k:.38,nod:.1,shed:0,dry:1};
  else if(g.form==='feuillage'||a==='foliage')r={k:.85,nod:.2,shed:0,dry:0};
  else if(a==='berries'||g.form==='baie')r={k:.6,nod:.15,shed:0,dry:0};
  else r={k:1,nod:LIFE_SOFT.test(sid)?1:.45,shed:LIFE_SHED.test(sid)?1:(a==='radial'||a==='double'||a==='cup'||a==='star')?.5:0,dry:0};
  return LIFE_PROF[sid]=r}
/* how wilted one element is: the stage, how much its species changes colour, and how long it lasts in a vase (a tulip, 6 days, is further gone at Déclin than a chrysanthemum, 3 weeks) */
function lifeWEl(L,pr){const w=lifeW(L);if(!w)return 0;if(!pr)return w;const af=pr.days?Math.max(.6,Math.min(1.5,10/pr.days)):1;return Math.min(.95,w*pr.k*(L.stage===2?af:Math.max(.85,Math.min(1.2,af))))}
/* the colour of a wilting tissue: greens yellow toward olive, then straw and brown; whites go ivory, then parchment;
   deep reds darken to wine; pinks dull to old rose, then tan; yellows and oranges to ochre; blues and violets grey to dusty mauve */
const LIFE_CC=new Map();
function lifeCol(c,w){if(w<=0||typeof c!=='string'||c.length!==7||c[0]!=='#'||c==='#ffffff'||c==='#000000')return c;
  const key=c+(w*100|0);let o=LIFE_CC.get(key);if(o)return o;const[h,s,l]=h2l(c);
  if(s<.1){o=l>.8?mix(c,'#ddd0b2',.5*w):mix(c,l>.4?'#9a8a72':'#3a2e26',.35*w);if(w>.6)o=mix(o,'#a88a62',(w-.6)*.7)}
  else if(h>=55&&h<175){const ww=w*(.45+.55*Math.min(1,s/.35));o=l2h(h+(40-h)*Math.min(1,ww*1.15),s*(1-.3*ww),l+(.38-l)*.35*ww);if(ww>.55)o=mix(o,l<.3?'#3e3020':'#7a6238',(ww-.55)*.85)}
  else if(l>.8){o=mix(c,'#e4d6b4',.6*w);if(w>.55)o=mix(o,'#b0905e',(w-.55)*.75)}
  else if(h>=300||h<20){if(l<.5){const tg=h<20?-15:345;o=l2h(h+(tg-h)*.3*w,s*(1-.25*w),l*(1-.45*w))}else{o=mix(c,'#b48e96',.55*w);if(w>.55)o=mix(o,'#8a6450',(w-.55)*.8)}}
  else if(h<55){o=l2h(h+(30-h)*.5*w,s*(1-.45*w),l*(1-.28*w));if(w>.55)o=mix(o,'#8e6232',(w-.55)*.7)}
  else{o=l2h(h+(268-h)*.3*w,s*(1-.6*w),l+(.5-l)*.25*w);if(w>.5)o=mix(o,'#76666e',(w-.5)*.65)}
  LIFE_CC.set(key,o);return o}
/* the filter E() applies to every element drawn while an element of the bouquet is wilting (its gradients are cached under their own key) */
const LIFE_KEYS=['fill','stroke','stop-color','flood-color'];
/* a species may replace the common wilt of its colours with its own (GHI[sid].wilt=(colour,w)=>colour), when its research sheet says otherwise */
function lifeWilt(w,own,tag){if(w<=0)return null;const cf=own||lifeCol,fn=a=>{let b=null;for(const k of LIFE_KEYS){const v=a[k];if(typeof v==='string'&&v.length===7&&v[0]==='#'){const nv=cf(v,w);if(nv!==v){if(!b)b=Object.assign({},a);b[k]=nv}}}return b||a};fn.key='~w'+(w*100|0)+(own?'~'+tag:'');return fn}
/* the opening of a head at this stage: buds stay buds; open heads close back to buds and half-open ones at Bourgeon; everything is open from Déclin on */
/* a species the composer may show in bud (the same test as pickStage) */
const lifeBudOK=it=>!!(it&&it.d3&&(BUD3.has(it.f)||OPENABLE.has(it.f)||(GHI[it.p.sid]||{}).buds||GH_BUDS.has(it.p.sid)));
function lifeOp(L,st,op0,h,ok=true){if(!L||L.stage===1||(L.stage===0&&!ok))return op0;if(L.stage===0)return st==='bud'?.1:st==='half'?.22+.12*L.u:.14+(.12+.3*L.u)*h;return st==='bud'?.3:st==='half'?.85:1}
/* how far a head nods (degrees, outward and down): soft stems give way under the head, stiff ones hardly move */
function lifeNod(L,pr,h){if(!L||L.stage<2||!pr.nod)return 0;return Math.min(36,(L.stage===2?6+12*L.u:18+14*L.u)*pr.nod*(.7+.6*h))}
/* petals fallen on the table, in front of and beside the vessel: from the heads that shed theirs, in the colour of their wilt, flat on the table with a crisp shadow */
function lifeFallen(par,L,heads,BP,mw,show,sv){if(!L||L.stage<2)return;const s0=seed;sd(sv*13+977);const g=G(par),sh=G(g,{'data-life':'fallen'}),pg=G(g);
  let n=0;const cap=L.stage===2?6:16,w=lifeW(L);
  for(const o of heads){const pr=lifeProfile(o.it.p);if(!pr.shed)continue;const m=Math.round(pr.shed*(L.stage===2?.4+1.4*L.u:1.6+2*L.u)*Math.min(1.6,(o.rr||30)/34));
    for(let i=0;i<m&&n<cap;i++,n++){const len=Math.max(9,(o.rr||30)*R(.62,.95)),wd=len*R(.5,.78),side=o.x>=BP[0]?1:-1,x=BP[0]+side*R(mw*.45,mw*1.5+18)+R(-8,8),
      y=FL+R(3,Math.max(6,Math.min(show-3,22))),rot=R(-80,80),sq=R(.32,.55),col=lifeCol(o.it.p.col,lifeWEl(L,pr)),P=pal7(col),d=rpet(len,wd/2),
      tf=`translate(${f(x)},${f(y)}) scale(1,${sq.toFixed(2)}) rotate(${f(rot)})`;
      E('path',{d,fill:'#2a160e','fill-opacity':.16,transform:`translate(${f(x+2.4)},${f(y+1.6)}) scale(1,${sq.toFixed(2)}) rotate(${f(rot)})`},sh);
      const k=G(pg,{transform:tf});E('path',{d,fill:P.b,stroke:P.d2,'stroke-width':.4},k);
      E('path',{d:rpet(len*.8,wd*.26),fill:P.l1,opacity:.5,transform:`translate(0,${f(-len*.07)})`},k);
      E('path',{d:`M0,${f(-len*.12)}L0,${f(-len*.76)}`,stroke:P.d1,'stroke-width':.35,'stroke-opacity':.45,fill:'none'},k)}}
  seed=s0}
