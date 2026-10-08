#!/bin/sh
# wsb.sh <ws>: builds ws/<ws>/pl.html (planche, cards, sptime) and ws/<ws>/qa13.html (QA, perf) from app/ with the workspace overlaid:
# a .js in ws/<ws>/ with the name of an app/ module replaces it; any other .js there loads just before c4.js (after every lot and reprise)
SP="C:/Users/agent/Desktop/flower-atelier"
W="$SP/ws/$1"; A="$SP/app"; [ -d "$W" ] || { echo "pas de workspace $W"; exit 1; }
LIST=$(sed -n 's/.*cat \.\.\/p2\.js \.\.\/p3\.js \.\.\/p4\.js \(.*k1\.js\).*/\1/p' "$SP/mkpl.sh")
files=""; over=""; extra=""
for f in $LIST; do
  if [ "$f" = c4.js ]; then
    for x in "$W"/*.js; do [ -f "$x" ] || continue; b=$(basename "$x"); case " $LIST " in *" $b "*) ;; *) files="$files $x"; extra="$extra $b";; esac; done
  fi
  if [ -f "$W/$f" ]; then files="$files $W/$f"; over="$over $f"; else files="$files $A/$f"; fi
done
P="$SP/p2.js $SP/p3.js $SP/p4.js"
{ sed "s/const RM=true;//" "$SP/lab/head.html"; cat $P $files "$SP/lab/pl.js" "$SP/lab/sptime.js" "$SP/lab/u1part.js" "$SP/lab/cards.js" "$SP/lab/stg.js"; echo '</script></body></html>'; } > "$W/pl.html"
{ sed "s/const RM=true;//" "$SP/lab/head.html"; cat $P $files "$SP/lab/qa13.js" "$SP/lab/vgal.js" "$SP/lab/inv.js" "$SP/lab/perf.js" "$SP/lab/perf2.js" "$SP/lab/perf3.js"; echo '</script></body></html>'; } > "$W/qa13.html"
echo "ws $1 | remplacés:${over:- aucun} | ajoutés:${extra:- aucun}"
node -e "const fs=require('fs');for(const p of ['pl.html','qa13.html']){const h=fs.readFileSync(process.argv[1]+'/'+p,'utf8');const m=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];let ok=1;for(const x of m){try{new Function(x[1])}catch(e){ok=0;console.log(p,'SYNTAX ERR',e.message)}}console.log(p,ok?'syntaxe ok':'SYNTAXE KO',Math.round(h.length/1024)+'KB')}" "$W"
