#!/bin/bash
# ramwait.sh: before a modeller or a heavy render. Waits, up to 30 min, until free RAM is over the atelier's floor, 4 GB (owner, 2026-10-25:
# « 5,5 est exagéré, on peut descendre à 4 ; grave-le définitivement à 4 » ; 3 GB before, 4.5 before 2026-10-18). Prints RAM OK / RAM BASSE.
# The RAM is read live from fleur/res/ram.txt, written every 2 s by fleur/res/ramlive.py; when that file is older than 10 s, the freshest
# load log (fleur/res/vague*.csv, fleur/res.ps1) is the fallback, as before. Shell builtins only while waiting (the kernel token leak).
R=C:/Users/agent/Desktop/flower/flower-atelier/fleur/res
SEUILC=400
FF="$R/.ramwait-$$"; mkfifo "$FF" && exec 9<>"$FF"; rm -f "$FF"
nap() { read -t "$1" -u 9 _; }
for ((i = 1; i <= 180; i++)); do
  printf -v now '%(%s)T' -1
  t=""; r=""; read -r t r _ < "$R/ram.txt" 2>/dev/null
  if [ -n "$t" ] && [ $((now - t)) -le 10 ]; then
    rc=$(( 10#${r%%.*} * 100 + 10#${r#*.} ))
    if [ "$rc" -ge "$SEUILC" ]; then echo "RAM OK ($r Go libres)"; exit 0; fi
    [ "$i" = 1 ] && echo "RAM basse ($r Go libres, 4 demandés) : attente"
  else
    f=$(ls -t $R/vague1.csv $R/vague2.csv $R/vague3.csv 2>/dev/null | head -1)
    if [ -n "$f" ] && [ -n "$(find "$f" -mmin -5 2>/dev/null)" ]; then
      last=$(tail -1 "$f" | cut -d, -f3)
      if awk -v l="$last" 'BEGIN{exit !(l>=4)}'; then echo "RAM OK ($last Go libres, relevé de charge)"; exit 0; fi
      [ "$i" = 1 ] && echo "RAM basse ($last Go libres) : attente"
    else
      [ "$i" = 1 ] && echo "mesure de la RAM absente (fleur/res/ramlive.py arrêté, relevé de charge figé) : attente (préviens l'orchestrateur)"
    fi
  fi
  nap 10
done
echo "RAM BASSE depuis plus de 30 min : modeleur ou rendu différé, préviens l'orchestrateur"; exit 1
