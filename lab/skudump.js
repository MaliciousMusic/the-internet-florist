<script>
setTimeout(()=>{const L=['sku;sid;espece;coloris;couleur;famille;prix_cts;role;categorie'];let i=0;
for(const p of PRODUCTS){i++;L.push([i,p.sid,p.n,p.cn,p.col,p.fam,p.price,p.role,p.cat].map(v=>String(v).replace(/;/g,',')).join(';'))}
const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=L.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
