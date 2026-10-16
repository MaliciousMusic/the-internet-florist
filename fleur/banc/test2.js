DET=+(process.env.DET||1);LOD=0;GDEF=new El('defs');
const tags=(n,o)=>{if(n.tag==="filter")return o;o[n.tag]=(o[n.tag]||0)+1;(n.children||[]).forEach(c=>tags(c,o));return o};
const ser=n=>n.tag==='#t'?'':'<'+n.tag+Object.entries(n.attrs).map(([k,v])=>' '+k+'="'+v+'"').join('')+'>'+(n.children||[]).map(ser).join('')+'</'+n.tag+'>';
const [vw,op,wl]=JSON.parse(process.env.CASE||'[[0,-0.97,-0.24],1,0]');const B=basis(V3.nz(vw),0),g=new El('g');
frmSvg(g,B,[200,-200,0],110,process.env.CW||'damier',op,3,wl);
console.log('g',JSON.stringify(tags(g,{})),'defs',JSON.stringify(tags(GDEF,{})),'svgKB',((ser(g).length+ser(GDEF).length)/1024).toFixed(1));
