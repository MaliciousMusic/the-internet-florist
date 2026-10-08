<script>
setTimeout(()=>{const d=GARDEN.find(b=>b.kind==='recu');const a=wSnap(d),b=wSnap(d);let i=0;while(i<a.src.length&&a.src[i]===b.src[i])i++;
 const cnt=s=>(s.match(/<path/g)||[]).length;const lines=['same '+(a.src===b.src),'len '+a.src.length+' '+b.src.length,'paths '+cnt(a.src)+' '+cnt(b.src),'first diff at '+i+': '+a.src.slice(Math.max(0,i-200),i+80)];
 const pre=document.createElement('pre');pre.id='dbgout';pre.textContent=lines.join(String.fromCharCode(10));document.body.append(pre);document.title='GAL-DONE'},2500);
</script>
