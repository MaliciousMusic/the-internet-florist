#!/bin/sh
# sync_demo.sh ["commit message"]: copies the app modules (mkapp.sh order) to the project (demo/src) and rewrites the order in demo/src/build.sh; lab tools to demo/lab
# Since 2026-10-05 Codex works in C:/Users/agent/Desktop/flower (its lot/* branches): Claude's commits go through its own worktree on main,
# C:/Users/agent/Desktop/flower-claude, brought up to date first, and only demo/ is added (never anyone else's work in progress)
SP="C:/Users/agent/Desktop/flower-atelier"
W="C:/Users/agent/Desktop/flower-claude"
D="$W/demo"
[ "$(git -C "$W" rev-parse --abbrev-ref HEAD)" = main ] || { echo "flower-claude n'est pas sur main"; exit 1; }
git -C "$W" fetch -q origin && git -C "$W" merge -q --ff-only origin/main || { echo "main a divergé d'origin/main : à régler à la main"; exit 1; }
LIST=$(sed -n 's/^cat a1\.html \.\.\/p2\.js \.\.\/p3\.js \.\.\/p4\.js \(.*u3\.js\) > .*/\1/p' "$SP/mkapp.sh")
LIST=$(cd "$SP/app" && eval "echo $LIST")
n=0
for f in $LIST; do cmp -s "$SP/app/$f" "$D/src/$f" || { cp "$SP/app/$f" "$D/src/$f"; n=$((n+1)); echo "  src/$f"; }; done
for f in p2.js p3.js p4.js; do cmp -s "$SP/$f" "$D/src/$f" || { cp "$SP/$f" "$D/src/$f"; echo "  src/$f"; }; done
cmp -s "$SP/app/a1.html" "$D/src/a1.html" || { cp "$SP/app/a1.html" "$D/src/a1.html"; echo "  src/a1.html"; }
python - "$D/src/build.sh" "$LIST" <<'EOF'
import sys,re
p,lst=sys.argv[1],sys.argv[2].split()
s=open(p,encoding='utf-8').read()
s=re.sub(r'^cat a1\.html p2\.js p3\.js p4\.js .*? > \.\./index\.html$','cat a1.html p2.js p3.js p4.js '+' '.join(lst)+' > ../index.html',s,flags=re.M)
open(p,'w',encoding='utf-8',newline=chr(10)).write(s)
EOF
for f in pl.js cards.js sptime.js stg.js qa13.js vgal.js inv.js head.html perf.js perf2.js perf3.js; do [ -f "$SP/lab/$f" ] && { cmp -s "$SP/lab/$f" "$D/lab/$f" || { cp "$SP/lab/$f" "$D/lab/$f"; echo "  lab/$f"; }; }; done
# the flower method's atelier tools (catalogue/serre/methode/METHODE.md): copies, the atelier itself is C:/Users/agent/Desktop/flower-atelier
mkdir -p "$D/lab/fleur"; for f in fleur/refs.py fleur/img.py fleur/bill.py fleur/shot.sh pilote/svtest.js pilote/mksv.py ws/qawatch.sh ws/chrome1.sh ws/gate.sh; do b=$(basename "$f"); cmp -s "$SP/$f" "$D/lab/fleur/$b" || { cp "$SP/$f" "$D/lab/fleur/$b"; echo "  lab/fleur/$b"; }; done
(cd "$D/src" && sh build.sh) && echo "demo/index.html reconstruit ($(wc -c < "$D/index.html") octets)"
# with a message: commit demo/ only and push main to GitHub (private repo MaliciousMusic/belais-flowers)
if [ -n "$1" ]; then cd "$W" && git add demo && git commit -q -m "$1" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git push -q origin main && echo "poussé : $(git log --oneline -1)"; fi
