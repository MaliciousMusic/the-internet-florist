<script>
setTimeout(()=>{const ids=['rose-standard','tulipe-simple','pivoine-herbacee-double','hortensia-boule','lis-oriental','phalaenopsis','gerbera','renoncule-classique','delphinium','protea-cynaroides','immortelle-xerochrysum','eucalyptus-cinerea','gypsophile','anemone-coronaria'];
const out=ids.map(id=>id+': '+(PRODUCTS.filter(p=>p.sid===id).map(p=>p.id.split('~')[1]+'='+p.cn+'('+p.col+')').join(' | ')));
const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=out.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
