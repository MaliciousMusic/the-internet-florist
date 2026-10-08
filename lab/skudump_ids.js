<script>
setTimeout(()=>{const L=['sku;id;sid;cn;col;fam;ret'];let i=0;
for(const p of PRODUCTS){i++;L.push([i,p.id,p.sid,p.cn,p.col,p.fam,p.ret?1:0].map(v=>String(v).replace(/;/g,',')).join(';'))}
const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=L.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
