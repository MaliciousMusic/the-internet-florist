
/* ================= Branchement des espèces 3D, tailles réelles ================= */
/* green sepals cupping a bud (3D species with o.op < .45) */
function sepals3(F,Rr,n=5){const c=['#1c3416','#365e26','#628c40','#a6c67a','#c8e09a'];for(let i=0;i<n;i++)F.parts.push(petalPart(petalGeo({r0:Rr*.05,z0:-Rr*.08,phi:(i*360/n+R(-10,10))*D,L:Rr*.55,W:Rr*.1,pf:sinP(.6,.05),a0:(40+R(0,30))*D,a1:(70+R(0,40))*D,cup:-.2,n:5}),F.B,F.O,c,c,{flat:1}))}
const BUD3=new Set(['xRose','xRanunc','xDahlia','xCarn','peony','tulip','xLily']);
function withSepals(fn,cm){return(g,t,o)=>{fn(g,t,o);if((o.op??1)<.45){const F={k:G(g),B:basis(axOf(o),0),O:[0,0,0],parts:[]};sepals3(F,(o.cm||cm)/2*UPC);drawParts(F.k,F.parts);g.insertBefore(F.k,g.firstChild)}}}
Object.assign(FN,{xRose:withSepals(x3Rose,10),xRanunc:withSepals(x3Ranunc,6),xDahlia:withSepals(x3Dahlia,13),xCarn:x3Carn,xMum:x3Mum,xScab:x3Scab,xLily:withSepals(x3Lily,17),xGlor:x3Glor,
  xPhalCluster:x3PhalCluster,xCymbCluster:x3CymbCluster,xAnth:x3Anth,xNerine:x3Nerine,tulip:withSepals(x3Tulip,7),peony:withSepals(x3Peony,13),cosmos:x3Cosmos,anemone:x3Anem,sunflower:x3Sun,hydrangea:x3Hydra});
/* real head size in cm (diameter, or spathe length) and scale of the remaining 2D drawings */
const CM={xAnth:12,xCalla:10,xPhalCluster:9,xCymbCluster:9,xRose:10,xRanunc:6,xDahlia:13,xCarn:6,xMum:11,xNerine:13,xGlor:9,xPea:12,xScab:5,xLily:17,
  peony:13,tulip:7,anemone:7,cosmos:7,hydrangea:16,sunflower:14,strelitzia:18,cattleya:13,paphio:9,marigold:6,pansy:5,morningGlory:8};
const D3=new Set(['xAnth','xPhalCluster','xCymbCluster','xRose','xRanunc','xDahlia','xCarn','xMum','xNerine','xGlor','xScab','xLily','peony','tulip','anemone','cosmos','hydrangea','sunflower']);
const ART2={xCalla:.66,xPea:.78,strelitzia:.6,cattleya:.92,paphio:.73,marigold:.5,pansy:.5,morningGlory:.6};
/* visual radius in SVG units at real size: drives spacing and visibility in the composer and the garden */
for(const k in CM){if(SP[k])SP[k].r=CM[k]/2*UPC*(k==='xPhalCluster'||k==='xCymbCluster'?1.9:k==='xAnth'?.8:k==='xCalla'?.75:1)}
const artK=f0=>D3.has(f0)?1:(ART2[f0]||1);
