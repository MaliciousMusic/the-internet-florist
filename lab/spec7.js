window.FIT=1;
const AXS=[['face',[0,0,1],1],['3/4 haut',[0,.75,.66],1],['3/4 côté',[.75,.25,.6],1],['profil',[0,1,.08],1],['dos',[.2,.35,-.9],1],['mi-ouverte',[.3,.5,.8],.5],['bouton',[0,.6,.8],.12]];
const SPX=['dahlia-cafe','rose-peche','renoncule-rose','oeillet-corail','chrysantheme-mauve','scabieuse-noire','lys-stargazer','gloriosa','phalaenopsis-magenta','cymbidium-cuivre','anthurium-bordeaux','nerine-rose','tulipe-rouge','pivoine-sarah','cosmos-chocolat','anemone-blanche','tournesol','hortensia-bleu'];
window.LAB=[];for(const id of SPX){const p=BYID[id];for(const[nm,ax,op]of AXS){if(op<1&&!BUD3.has(p.f)&&nm==='bouton')continue;LAB.push([`${p.n} · ${nm}`,'0 0 10 10',s=>{seed=23;FN[p.f](s,0,Object.assign({},p.o,{ax,op,roll:0}))}])}}
