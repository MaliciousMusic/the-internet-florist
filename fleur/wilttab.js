// usage: node fleur/wilttab.js app/y-tulipa.js [cws...] (from the atelier or chantier root; reads d1.js, s0.js, z1.js of this working copy's app/)  -> table of tulWiltCol for each colourway's main colours, w = 0,.3,.6,.9
const fs=require('fs'),vm=require('vm');const CH=require('path').join(__dirname,'..','app')+'/';
const d1=fs.readFileSync(CH+'d1.js','utf8'),s0=fs.readFileSync(CH+'s0.js','utf8'),z1=fs.readFileSync(CH+'z1.js','utf8');
const pick=(src,re)=>{const m=src.match(re);if(!m)throw new Error('miss '+re);return m[0]};
let code=[pick(d1,/const hx=.*\n/),pick(d1,/const hs=.*\n/),pick(d1,/const mix=.*\n/),pick(s0,/const h2l=.*\n/),pick(s0,/const l2h=.*\n/),
  'const svSm=t=>t<=0?0:t>=1?1:t*t*(3-2*t);const LIFE_CC=new Map();\n',pick(z1,/function lifeCol\(c,w\)\{[\s\S]*?LIFE_CC\.set\(key,o\);return o\}/)].join('\n');
const y=fs.readFileSync(process.argv[2],'utf8');
code+='\n'+pick(y,/const TULS=\{[\s\S]*?\}\};/)+'\n'+pick(y,/function tulWiltCol[\s\S]*?\n(?=if\(typeof GHI)/);
code+=String.raw`
this.TULS=TULS;this.tulWiltCol=tulWiltCol;this.h2l=h2l;this.mix=mix;this.setDk=id=>{if(typeof tulDark==='function')TUL_DK=tulDark({id})};`;
const C={};vm.createContext(C);vm.runInContext(code,C);
const W=[0,.3,.6,.9],cws=process.argv.slice(3);const ids=cws.length?cws:Object.keys(C.TULS);
const hsl=c=>{const[h,s,l]=C.h2l(c);return`${h.toFixed(0)}/${s.toFixed(2)}/${l.toFixed(2)}`};
for(const id of ids){const S=C.TULS[id];if(!S)continue;C.setDk(id);const t=S.t||S.i,o=S.o||S.i,X={i:S.i,o,li:S.li,rim:C.mix(t,'#ffffff',.3),blite:C.mix(o,'#ffffff',.42),fil:'#3a3a34'};for(const k of['i','o','li','rim','blite','fil']){const c=X[k];if(!c)continue;
  console.log([id,k,c,hsl(c)].concat(W.slice(1).map(w=>C.tulWiltCol(c,w))).join(' '))}}
