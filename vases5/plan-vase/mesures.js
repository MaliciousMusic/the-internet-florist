/* The measures of their own for the 13 vessels whose profile does not tell their cavity (step 6 of the vessel plan) → app/z7-plan-mesures.js
   (VPLAN_OV, read by z7-plan vPlan). Scale 1 (before the owner's VSC), shop units, vessel frame (y up from the floor, x from the axis).
   - sculpted, measured on the GLB (cavites/<id>.json, cavite_glb.py): the hollow from its floor to where it is walled all round, then on
     to the mouth that compo.py measured;
   - sculpted whose GLB is not hollowed (only a dent at the top): a straight cavity of the mouth's width down to a floor at a tenth of
     the mouth's height, marked 'suppose' (an assumption, not a measure);
   - not turned (outline, box), from the outline measured on the photo (ol): at each height the inside of the front outline less the
     wall, its centre and half width; its depth over its width (zk) for the section of an oval or square opening.
   node vases5/plan-vase/mesures.js */
const fs=require('fs'),path=require('path'),HERE=__dirname,APP=path.join(HERE,'../../app');
const src=fs.readFileSync(path.join(APP,'v0.js'),'utf8'),a=src.indexOf('[',src.indexOf('VZ0='));let d=0,i=a;for(;i<src.length;i++){if(src[i]=='[')d++;else if(src[i]==']'){d--;if(!d)break}}
const VZ0=JSON.parse(src.slice(a,i+1)),V=id=>VZ0.find(v=>v.id===id),r1=x=>Math.round(x*10)/10;
const WALL={glass:2.6,metal:3.2,gloss:4,satin:4,matte:4.5,stone:5,wood:5},OV={};
/* sculpted, from the GLB */
for(const id of['gres-chauve-souris','bronze-bambous','coque-verte','calla-gres','gui-argent']){const m=JSON.parse(fs.readFileSync(path.join(HERE,'cavites',id+'.json'),'utf8'));
  OV[id]={src:'glb',yF:Math.max(m.yF,5),cav:m.cav.filter(q=>q[0]>=m.yF),note:`creux mesuré sur le modèle 3D de ${r1(m.yF)} à ${r1(m.first)}, puis jusqu'à la bouche (${m.mh})`}}
/* sculpted whose GLB is not hollowed */
for(const id of['bronze-lys','jardiniere-cristaux']){const v=V(id),mh=v.mh!=null?v.mh:v.h,lw=Math.max(1.1,Math.min(v.lipw||3,(v.mo||20)*.14)),r=(v.mo||20)-lw;
  OV[id]={src:'suppose',yF:r1(mh*.1),cav:[[r1(mh*.1),r1(r),r1(v.mx||0)],[r1(mh),r1(r),r1(v.mx||0)]],note:'modèle 3D non creusé : cavité droite de la largeur de la bouche, fond au dixième de sa hauteur (hypothèse)'}}
/* not turned: the inside of the front outline */
function crossings(P,y){const xs=[];for(let k=0;k<P.length;k++){const p=P[k],q=P[(k+1)%P.length];if((p[1]-y)*(q[1]-y)<0||p[1]===y&&q[1]!==y){const t=(y-p[1])/((q[1]-p[1])||1e-9);xs.push(p[0]+(q[0]-p[0])*t)}}return xs.sort((u,w)=>u-w)}
for(const id of['suiban-lobe-rose','suiban-ovale-peint','vase-coeur-anthracite','vase-tete-veine-sable','prisme-jaune']){const v=V(id),P=v.ol.pts,mo=v.ol.mouth,ym=mo[2],wall=WALL[v.mat]??4,
    W=Math.max(...P.map(p=>Math.abs(p[0])))*2,zk=v.ol.d?Math.min(1,v.ol.d/W):1,rows=[];
  for(let k=1;k<=40;k++){const y=ym*k/41,xs=crossings(P,y);if(xs.length<2)continue;const xl=xs[0],xr=xs[xs.length-1];rows.push([y,(xr-xl)/2,(xl+xr)/2])}
  /* the floor: above a narrow foot (narrower than .6 of the widest), then the bottom's thickness */
  /* a solid foot is a waist: a narrow part with a wider one under it (a suiban's feet, a head's neck on its base: the reference photo
     of the head holds 30 stems, which its neck could not); a heart narrowing down to its point has nothing wider under it: hollow */
  const wmax=Math.max(...rows.map(q=>q[1]));let yf=0;
  const waist=rows.some((q,j)=>q[0]<ym*.6&&rows.slice(0,j).some(b=>b[1]>q[1]*1.15));
  /* (a suiban stands on feet: a basin on legs) */
  if(waist||/^suiban/.test(id))for(const q of rows)if(q[0]<ym*.6&&q[1]<wmax*.6)yf=q[0];yf+=wall*1.5;
  const cav=rows.filter(q=>q[0]>=yf).map(q=>[r1(q[0]),r1(Math.max(1,q[1]-wall)),r1(q[2])]);
  OV[id]={src:'contour',yF:r1(yf),zk:+zk.toFixed(3),cav,note:`coupe tirée du contour relevé sur la photo (bouche de ${r1((mo[1]-mo[0])/6.5)} cm, profondeur ${r1(v.ol.d/6.5)} cm)`}}
/* the square column: its inside is a square, half its side less the wall; a square's section over its inscribed circle's is 4 / π */
{const v=V('colonne-blanche'),wall=WALL[v.mat]??4,hs=v.box.w/2-wall;OV['colonne-blanche']={src:'boite',yF:r1(wall*1.5),zk:+(4/Math.PI).toFixed(3),
  cav:[[r1(wall*1.5),r1(hs),0],[r1(v.h),r1(hs),0]],note:`colonne carrée de ${r1(v.box.w/6.5)} cm : cavité carrée, demi-côté moins la paroi (le profil prenait la demi-diagonale)`}}
/* the owner's own drawing (2026-10-23): the cavity he traced in red on the sheet of the 13 (porteur/traces.json, read from his strokes by
   their pixels, in each cell's scale) replaces the measure for the vessels he traced; it prevails over the GLB and the outline. The column:
   his width, centred and straight (its round mouth is its narrowest section: the square body does not count in its capacity) */
{const T=JSON.parse(fs.readFileSync(path.join(HERE,'porteur','traces.json'),'utf8'));for(const id in T){const t=T[id],prev=OV[id]||{};let cav=t.cav,zk=prev.zk;
  if(id==='colonne-blanche'){const w=cav.map(q=>q[1]).sort((p,q)=>p-q)[cav.length>>1];cav=[[t.yF,w,0],[V(id).h,w,0]];zk=null}
  OV[id]=Object.assign({src:'porteur',yF:t.yF,cav,note:'cavité tracée par le porteur sur la planche des 13 (2026-10-23)'},zk?{zk}:{})}}
/* the owner's second drawing (2026-10-23): on the lily, the jardinière and the head, the true opening in red across the top of the vessel
   (mouth: [height, inner half width, centre x]) and the cavity's walls in blue (porteur/traces2.json): the lily's and the jardinière's whole
   cavity (no more assumed), the head's bottom in its neck under the cavity he traced first */
{const T2=JSON.parse(fs.readFileSync(path.join(HERE,'porteur','traces2.json'),'utf8'));for(const id in T2){const t=T2[id],prev=OV[id]||{};let cav=t.cav;
  if(id==='vase-tete-veine-sable')cav=t.cav.concat((prev.cav||[]).filter(q=>q[0]>t.top+1));
  OV[id]=Object.assign({},prev.zk?{zk:prev.zk}:{},{src:'porteur',yF:t.yF,cav,mouth:t.mouth,note:'cavité et bouche tracées par le porteur sur la planche des 13 (2026-10-23)'})}}
const js=`/* ================= Vessel plan, measures of their own (z7-plan vPlan reads VPLAN_OV): the 13 vessels whose profile does not tell their
   cavity, measured on their GLB, from their photo outline, traced by the owner, or assumed where the GLB is not hollowed (src). Generated by
   vases5/plan-vase/mesures.js; scale 1, shop units, [height, half width, centre x] ================= */
var VPLAN_OV=${JSON.stringify(OV)};
/* the owner's mouths (mouth: the opening he traced) make the vessel's own mouth for the composer too (its width, height, centre; the lip's
   width kept), composer version 3 only: a bouquet composed before keeps its drawing */
if(typeof VZ!=='undefined'&&!(typeof CMP_V!=='undefined'&&CMP_V<3))for(const id in VPLAN_OV){const o=VPLAN_OV[id],v=VZ[id];if(!o.mouth||!v)continue;const k=v.vs||1,
  lw=Math.max(1.1,Math.min(v.lipw||3,(v.mo||20)*.14));v.mo=o.mouth[1]*k+lw;v.mh=o.mouth[0]*k;v.mx=o.mouth[2]*k;v._plan=null}
`;
fs.writeFileSync(path.join(APP,'z7-plan-mesures.js'),js);
for(const id in OV){const o=OV[id],c=o.cav;console.log(id.padEnd(24),o.src.padEnd(8),'fond',o.yF,'points',c.length,'demi-largeur',Math.min(...c.map(q=>q[1])),'..',Math.max(...c.map(q=>q[1])),o.zk?'zk '+o.zk:'')}
