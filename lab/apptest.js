<script>
/* test hooks: ?test=contenant&m=33 opens a model's send flow at the container step; ?test=fam&f=calice also switches the family */
{const Q=new URLSearchParams(location.search),k=Q.get('test');if(k)setTimeout(()=>{try{const m=MODELS.find(x=>x.n===+(Q.get('m')||33));openModel(m);
  if(k==='contenant'||k==='fam'){openFlow();if(k==='fam')setTimeout(()=>{const b=document.querySelector(`#fVF [data-f="${Q.get('f')||'calice'}"]`);b&&b.click()},300)}}catch(e){document.title='ERR '+e.message;console.error(e)}},600)}
</script>
