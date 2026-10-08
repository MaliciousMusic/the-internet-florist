/* pxtest.js: anemone heads rendered by the pixel engine (x1.js + x2.js) in Node, side by side on one PNG sheet
   usage: node pxtest.js out.png [px per unit] [bg r,g,b] */
const fs=require('fs'),zlib=require('zlib'),vm=require('vm'),SP=__dirname+'/..';
const rd=f=>fs.readFileSync(SP+'/app/'+f,'utf8');
vm.runInThisContext(rd('x1.js')+'\n'+rd('x2.js')+'\nglobalThis.__P={pxRaster,pxaHead};');
const out=process.argv[2]||SP+'/pilote/t.png',s=+(process.argv[3]||9),bg=(process.argv[4]||'232,228,220').split(',').map(Number);
const Lr=[-.5,.62,.6],ll=Math.hypot(...Lr),L=Lr.map(x=>x/ll),D=7*6.5;
const rot=(ax)=>{const z=ax.map(x=>x/Math.hypot(...ax)),x0=[1,0,0],y=[z[1]*x0[2]-z[2]*x0[1],z[2]*x0[0]-z[0]*x0[2],z[0]*x0[1]-z[1]*x0[0]],yl=Math.hypot(...y),Y=y.map(c=>c/yl),X=[Y[1]*z[2]-Y[2]*z[1],Y[2]*z[0]-Y[0]*z[2],Y[0]*z[1]-Y[1]*z[0]];return[X,Y,z]};
const cases=[['bleu',[0,0,1],101],['blanc',[0,0,1],202],['bleu',[0,.82,.57],303],['bleu',[.25,.2,.95],404]];
const tiles=[];let t0=Date.now();
for(const[cw,ax,seed]of cases){const B=rot(ax),{M,mats}=__P.pxaHead(B,[0,0,0],D,cw,1,seed),mesh={P:M.P,N:M.N,UV:M.UV,MI:M.MI,T:M.T};
  const r=__P.pxRaster(mesh,mats,{s,ss:2,L,mg:2});tiles.push(r);console.log(cw,seed,'verts',M.MI.length,'tris',M.T.length/3,r.W+'x'+r.H)}
console.log('ms',Date.now()-t0);
/* sheet: tiles side by side on the background */
const TW=Math.max(...tiles.map(t=>t.W)),TH=Math.max(...tiles.map(t=>t.H)),W=TW*tiles.length,H=TH,img=new Uint8Array(W*H*3);
for(let i=0;i<W*H;i++){img[3*i]=bg[0];img[3*i+1]=bg[1];img[3*i+2]=bg[2]}
tiles.forEach((t,ti)=>{const ox=ti*TW+((TW-t.W)>>1),oy=(TH-t.H)>>1;for(let y=0;y<t.H;y++)for(let x=0;x<t.W;x++){const o=(y*t.W+x)*4,a=t.data[o+3]/255;if(!a)continue;const p=((oy+y)*W+ox+x)*3;for(let c=0;c<3;c++)img[p+c]=Math.round(t.data[o+c]*a+img[p+c]*(1-a))}});
const raw=Buffer.alloc((W*3+1)*H);for(let y=0;y<H;y++){raw[y*(W*3+1)]=0;Buffer.from(img.buffer,y*W*3,W*3).copy(raw,y*(W*3+1)+1)}
const crcT=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0}),crc=b=>{let c=0xffffffff;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0};
const chunk=(t,b)=>{const l=Buffer.alloc(4);l.writeUInt32BE(b.length);const tb=Buffer.concat([Buffer.from(t),b]),c=Buffer.alloc(4);c.writeUInt32BE(crc(tb));return Buffer.concat([l,tb,c])};
const ih=Buffer.alloc(13);ih.writeUInt32BE(W,0);ih.writeUInt32BE(H,4);ih[8]=8;ih[9]=2;
fs.writeFileSync(out,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw,{level:6})),chunk('IEND',Buffer.alloc(0))]));
