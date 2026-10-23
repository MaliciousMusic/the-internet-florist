# The shape maps of the red ant's reference photos (PROTOCOLE §2), one heavy model at a time through the gate.
# sh insectes/fourmi-rouge/outils/formes.sh   (from the atelier copy's root)
PY=C:/Users/agent/Desktop/flower/flower-atelier/vases5/.venv-depth/Scripts/python
F=insectes/fourmi-rouge/outils/forme.py
H=refcache/myrmica-rubra/hd
C=refcache/myrmica-rubra/cartes
run() { GATE_MAX=1 sh ws/gate.sh $PY $F photo "$@"; }
run $H/c115.jpg 440,250,1560,1160 "820,660;1025,820;1389,957" "694,683;1521,1070" --out $C/profil-c115 --vue profil
run $H/c013.jpg 1250,1350,3150,2420 "2816,1536;2304,1685;1557,2048" "3093,1643;1408,2304" --out $C/profil-c013 --vue profil
run $H/c123.jpg 420,240,1960,1340 "638,1116;979,911;1640,524" "490,1230;1913,490" --out $C/dessus-c123 --vue dessus
run $H/c148.jpg 50,220,1060,540 "146,390;390,390;878,366" "73,390;1013,366" --out $C/dessus-c148 --vue dessus
run $H/c124.jpg 790,440,1125,900 "953,650;953,760" "953,460;949,887" --out $C/face-c124 --vue face
run $H/c082.jpg 180,10,760,760 "487,300;487,550" "487,26;487,744" --out $C/face-c082 --vue face
