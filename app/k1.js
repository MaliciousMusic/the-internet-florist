
/* ================= Catalogue v4 : chaque espèce × ses couleurs devient une fleur à cueillir ================= */
/* every reference model stands in the vessel of its photo */
for(const m of MODELS){const nv=VREF[m.n];if(nv)m.vase=nv}
/* three models whose vessel's neck cannot hold their stems, even enlarged (z7-plan vpFit): moved to a wider vessel of the same family,
   nearest in material and bearing (owner, 2026-10-23; vases5/plan-vase/RAPPORT-plan-vase.md) */
{const VWIDE={24:'cylindre-inox-miroir',28:'calice-celadon-pans',66:'calice-etain'};for(const m of MODELS)if(VWIDE[m.n])m.vase=VWIDE[m.n]}
const RBY=Object.fromEntries(RECIPES.map(r=>[r.id,r])),MBY=Object.fromEntries(CATMETA.map(m=>[m.id,m]));
const FAMS=[['blanc','Blancs & crèmes','#f4efe4'],['rose','Roses tendres','#efb7c0'],['fuchsia','Fuchsias','#c2387f'],['rouge','Rouges','#c8162a'],['bordeaux','Bordeaux & prunes','#6d1028'],
 ['peche','Pêches & corails','#f2a27e'],['orange','Oranges & cuivres','#ef7a26'],['jaune','Jaunes','#f2c832'],['vert','Verts','#6f9a4a'],['bleu','Bleus','#6f8fd8'],['violet','Violets & lilas','#8a5ac0'],['noir','Noirs & bruns','#3a2a24']];
const FAMI=Object.fromEntries(FAMS.map((f,i)=>[f[0],i]));
function famOf(hex){const[h,s,l]=hsl(hex);if(l>.86&&s<.5||l>.8&&s<.25)return'blanc';if(l<.17)return'noir';if(s<.16)return l>.6?'blanc':l<.4?'noir':'vert';
  if((h>=345||h<12)&&l<.3)return'bordeaux';if(h>=300&&h<345&&l<.28)return'bordeaux';if(h>=20&&h<45&&l<.35)return'noir';
  if(h>=345||h<10)return l>.7?'rose':'rouge';if(h<22)return l>.62?'peche':'rouge';if(h<42)return l>.7?'peche':'orange';if(h<68)return l>.88?'blanc':'jaune';
  if(h<175)return'vert';if(h<250)return'bleu';if(h<290)return'violet';return l>.74?'rose':'fuchsia'}
const CNAMES=[['blanc','#fbfbf6'],['ivoire','#f5efdf'],['crème','#f0e2c2'],['champagne','#e8d3b0'],['blush','#f2cfc8'],['rose poudré','#e6b0b8'],['rose','#e98aa8'],['rose vif','#e0507a'],['fuchsia','#c8207a'],['magenta','#a8206e'],
 ['cerise','#c8183a'],['rouge','#c41a26'],['vermillon','#e0402a'],['bordeaux','#6d1028'],['prune','#5a1a3a'],['aubergine','#3a1028'],['noir','#1c1618'],['corail','#f07862'],['saumon','#f49a78'],['pêche','#f6bc98'],['abricot','#f6a060'],
 ['orange','#ef7a26'],['cuivre','#b8603a'],['jaune','#f2c832'],['citron','#eee070'],['beurre','#f4e2a2'],['vert','#5f8a42'],['vert anis','#b8d060'],['chartreuse','#c4cc48'],['sauge','#9ab09a'],['vert sapin','#2a4a34'],['bleu','#4f6fd0'],
 ['bleu ciel','#9ac0ec'],['bleu poudré','#aab8e0'],['lavande','#b8a8e0'],['lilas','#c8a8d8'],['mauve','#b088b8'],['violet','#7a4ab0'],['brun','#7a5030'],['café','#8a6a50'],['gris','#a8aaa4'],['argent','#c6cac2'],['doré','#c8a050'],['vert tendre','#8aa860'],['vieux rose','#c49aa2'],['bois de rose','#8a4a5a'],['bleu-violet','#4a4aa8']];
const CRGB=CNAMES.map(([n,h])=>[n,hx(h)]);
function colName(hex){const a=hx(hex);let best='',bd=1e9;for(const[n,b]of CRGB){const dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2],d=2*dr*dr+4*dg*dg+3*db*db;if(d<bd){bd=d;best=n}}return best}
function is3D(rec){const a=rec.a,k=(rec.p||{}).kind;if(GH[rec.id])return true;if(a==='custom')return D3.has((rec.p||{}).fn);if(['radial','double','cup','star','globe','protea'].includes(a))return true;
  if(a==='spathe')return k!=='calla'&&k!=='arum';if(a==='orchid')return!['catt','paph','onc'].includes(k);if(a==='exotic')return['ginger','torch-ginger','pineapple','kangaroo-paw'].includes(k);return false}
/* products = species × colour (up to four colours each) */
/* retired colourways (ret:1) stay in PRODUCTS and PBY, with the same ids and SKU numbers, so old bouquets, gifts and gardens still draw; the shop and the composer no longer offer them (p.ret) */
const PRODUCTS=[],PBY={};
/* colourways added after the catalogue was numbered (late) become products at the end, so no existing SKU number moves. late:N is the wave: wave 1 (the anemones, the late tulips) keeps its numbers, wave 2 (the rosettes: double tulip, classic ranunculus) follows it, each wave in the recipes' order */
const PROD_LATE=[];let PROD_LATE_PASS=false;
/* a species finished in the greenhouse offers every colourway it is sold in, each with its own name; the others keep up to four colours */
const lc1=s=>s.charAt(0).toLowerCase()+s.slice(1);
for(const r of RECIPES){if(CWS[r.id])r.cols=CWS[r.id].map(w=>w.c);const m=MBY[r.id]||{n:r.id},info=recInfo(r),cws=CWS[r.id],cols=cws?cws.map(w=>w.c):(r.cols||['#e8a0b0']).slice(0,4);
  cols.forEach((col,ci)=>{if(cws&&cws[ci].late&&!PROD_LATE_PASS){PROD_LATE.push([r,ci]);return}const fam=famOf(col),p={id:`${r.id}~${ci}`,sid:r.id,n:m.n,cn:cws?lc1(cws[ci].n):colName(col),col,fam,price:Math.max(50,Math.round(r.price||300)),rec:r,info,d3:is3D(r),cat:m.c,role:m.r,sens:(m.sc&&m.sc[fam])||m.s||'',occ:m.o||[],ev:m.e||[]};if(cws&&cws[ci].ret)p.ret=1;PRODUCTS.push(p);PBY[p.id]=p})}
PROD_LATE_PASS=true;const lateW=([r,ci])=>+CWS[r.id][ci].late||1;PROD_LATE.sort((a,b)=>lateW(a)-lateW(b));for(const[r,ci]of PROD_LATE){const m=MBY[r.id]||{n:r.id},info=recInfo(r),cws=CWS[r.id],cols=cws.map(w=>w.c),col=cols[ci];(()=>{const fam=famOf(col),p={id:`${r.id}~${ci}`,sid:r.id,n:m.n,cn:cws?lc1(cws[ci].n):colName(col),col,fam,price:Math.max(50,Math.round(r.price||300)),rec:r,info,d3:is3D(r),cat:m.c,role:m.r,sens:(m.sc&&m.sc[fam])||m.s||'',occ:m.o||[],ev:m.e||[]};if(cws&&cws[ci].ret)p.ret=1;PRODUCTS.push(p);PBY[p.id]=p})()}PROD_LATE_PASS=false;
/* an ad-hoc product for a model bouquet element (any colour of any species) */
function prodFor(sid,col){const r=RBY[sid];if(!r)return null;const key=`${sid}@${col}`;if(PBY[key])return PBY[key];const m=MBY[sid]||{n:sid};
  const fam=famOf(col),p={id:key,sid,n:m.n,cn:colName(col),col,fam,price:Math.max(50,Math.round(r.price||300)),rec:r,info:recInfo(r),d3:is3D(r),cat:m.c,role:m.r,sens:(m.sc&&m.sc[fam])||m.s||'',occ:m.o||[],ev:m.e||[]};PBY[key]=p;return p}
/* real size in cm of one stem's head */
const cmOf=p=>p.rec.cm||(p.rec.a==='custom'&&CM[(p.rec.p||{}).fn])||6;
