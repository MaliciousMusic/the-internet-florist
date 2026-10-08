window.FIT=1;
const VWS=['face','tq','side','half','bud','back','front'];
const PICK=['rose-peche','rose-bordeaux','renoncule-rose','dahlia-cafe','oeillet-corail','chrysantheme-mauve','scabieuse-noire','anthurium-bordeaux','calla-ivoire','calla-noir','lys-stargazer','gloriosa'];
window.LAB=[];for(const id of PICK){const p=BYID[id];for(const v of VWS){if(v!=='face'&&!hasView(p.f,v))continue;LAB.push([`${p.n} · ${v}`,'0 0 10 10',s=>{seed=17;drawView(s,0,p.f,Object.assign({},p.o),v)}])}}
