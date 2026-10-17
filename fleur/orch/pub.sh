#!/bin/sh
# pub3.sh "<modules>": wave 3 publication in the clean copy ws/pub-apres: copies only the named app modules to demo/src,
# rewrites the module order of demo/src/build.sh from mkapp.sh (same code as sync_demo.sh) and rebuilds demo/index.html
D=C:/Users/agent/Desktop/flower/flower-atelier/ws/pub-apres; cd $D || exit 1
LIST=$(sed -n 's/^cat a1\.html \.\.\/p2\.js \.\.\/p3\.js \.\.\/p4\.js \(.*u3\.js\) > .*/\1/p' mkapp.sh)
LIST=$(cd app && eval "echo $LIST")
for f in $1; do cmp -s app/$f demo/src/$f || { cp app/$f demo/src/$f; echo "  src/$f"; }; done
python - demo/src/build.sh "$LIST" <<'PY'
import sys,re
p,lst=sys.argv[1],sys.argv[2].split()
s=open(p,encoding='utf-8').read()
s=re.sub(r'^cat a1\.html p2\.js p3\.js p4\.js .*? > \.\./index\.html$','cat a1.html p2.js p3.js p4.js '+' '.join(lst)+' > ../index.html',s,flags=re.M)
open(p,'w',encoding='utf-8',newline=chr(10)).write(s)
PY
(cd demo/src && sh build.sh) && echo "demo/index.html reconstruit ($(wc -c < demo/index.html) octets)"
git status --short demo | head -20
