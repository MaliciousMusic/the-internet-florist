#!/bin/sh
# The shape maps of the bumblebee's reference photos (PROTOCOLE §2, outils/forme.py), two per view, on the half-size copies of
# refcache/bombus-terrestris/demi/ (RAM: nine sessions share the PC). One model at a time on the whole chantier (GATE_MAX=1).
# Prompts and axes are read on the gridded photos: px of the half-size copy; --axe runs from the tip of the abdomen to the front
# of the head (for the face, from the mouth to the vertex).
#   sh insectes/bourdon/formes.sh [name...]
cd "$(dirname "$0")/../.."
PY=C:/Users/agent/Desktop/flower/flower-atelier/vases5/.venv-depth/Scripts/python
D=refcache/bombus-terrestris/demi; O=refcache/bombus-terrestris/formes
one() {
  n=$1; shift
  [ $# -gt 0 ] || return
  GATE_MAX=1 GATE_RAM=${GATE_RAM:-5.5} sh C:/Users/agent/Desktop/flower/flower-atelier/ch/insectes-suite/ws/gate.sh $PY insectes/outils/forme.py photo "$@" --out $O/$n
}
want() { [ -z "$SEL" ] || echo " $SEL " | grep -q " $1 "; }
SEL="$*"
want c024 && one c024 $D/c024.png --vue dessus --box 0,40,780,790 --axe "395,700;375,140" --pos "380,300;380,500;380,640" --neg "100,700;650,150;700,600"
want c072 && one c072 $D/c072.png --vue dessus --box 350,350,1350,1950 --axe "870,1880;790,420" --pos "800,700;820,1300;800,1700" --neg "300,2200;1500,600;1500,1800"
want c060 && one c060 $D/c060.png --vue profil --box 240,150,930,560 --axe "805,400;305,400" --pos "450,300;650,330;350,380" --neg "600,620;980,500;1000,200;150,300"
want c126 && one c126 $D/c126.png --vue profil --box 170,250,960,760 --axe "885,560;215,470" --pos "500,400;750,480;320,420" --neg "300,560;450,600;700,250;1000,420"
want c084 && one c084 $D/c084.png --vue face --box 590,300,1140,840 --axe "865,830;865,330" --pos "865,550;700,550;1030,550" --neg "865,150;400,600;1350,600"
want c082 && one c082 $D/c082.png --vue face --box 580,150,1400,1000 --axe "1130,970;1000,180" --pos "1000,600;800,500;1250,450" --neg "1150,1400;300,800;1700,700"
want c120 && one c120 $D/c120.png --vue dessous --box 130,50,480,640 --axe "310,630;265,120" --pos "300,300;300,500;280,180" --neg "600,650;650,150"
