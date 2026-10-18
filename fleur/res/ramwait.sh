#!/bin/sh
# ramwait.sh: before a modeller or a heavy render (waves 2 and 3). Waits, up to 30 min, until free RAM is back over 3 GB (owner, 2026-10-18: 4.5 before; he plays while the atelier works): the last sample
# AND at least 6 of the last 8 samples (2 minutes) of the freshest load log (fleur/res/vague1.csv, vague2.csv or vague3.csv). Prints RAM OK / RAM BASSE.
# Since the 2026-10-17 crash: no log, or a log older than 5 minutes, also waits (the load logger fleur/res.ps1 must run).
R=C:/Users/agent/Desktop/flower/flower-atelier/fleur/res
for i in $(seq 1 30); do
  f=$(ls -t $R/vague1.csv $R/vague2.csv $R/vague3.csv 2>/dev/null | head -1)
  if [ -n "$f" ] && [ -n "$(find "$f" -mmin -5 2>/dev/null)" ]; then
    last=$(tail -1 "$f" | cut -d, -f3)
    ok=$(tail -8 "$f" | grep "^20" | awk -F, '$3>=3{n++} END{print n+0}')
    if awk -v l="$last" 'BEGIN{exit !(l>=3)}' && [ "$ok" -ge 6 ]; then echo "RAM OK ($last Go libres)"; exit 0; fi
    [ "$i" = 1 ] && echo "RAM basse ($last Go libres) : attente"
  else
    [ "$i" = 1 ] && echo "relevé de charge absent ou figé : attente (préviens l'orchestrateur)"
  fi
  sleep 60
done
echo "RAM BASSE depuis plus de 30 min : modeleur ou rendu différé, préviens l'orchestrateur"; exit 1
