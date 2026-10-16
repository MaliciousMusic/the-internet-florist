#!/bin/sh
# ramwait.sh: before launching a modeller (wave 2). Waits, up to 30 min, while free RAM has stayed under 4 GB for the whole last 10 minutes
# (40 samples of the freshest load log, fleur/res/vague1.csv or vague2.csv). Prints RAM OK / RAM BASSE.
R=C:/Users/agent/Desktop/flower/flower-atelier/fleur/res
for i in $(seq 1 30); do
  f=$(ls -t $R/vague1.csv $R/vague2.csv 2>/dev/null | head -1)
  [ -n "$f" ] || { echo "RAM ? (aucun relevé)"; exit 0; }
  tot=$(tail -40 "$f" | grep -c "^20")
  low=$(tail -40 "$f" | grep "^20" | awk -F, '$3<4{n++} END{print n+0}')
  if [ "$tot" -eq 0 ] || [ "$low" -lt "$tot" ]; then echo "RAM OK ($(tail -1 "$f" | cut -d, -f3) Go libres)"; exit 0; fi
  sleep 60
done
echo "RAM BASSE depuis plus de 30 min : modeleur différé, préviens l'orchestrateur"; exit 1
