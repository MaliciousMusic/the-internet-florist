# The renders of the profile and top pairs measured against the SAM maps of the photos (PROTOCOLE §2.2), no model: light.
# sh insectes/fourmi-rouge/outils/mesure-rendus.sh   (from the atelier copy's root, after outils/paires.py fourmi-rouge)
# The axes run from the mandibles' tip to the gaster's tip, read on planches/paire-*.png (render px).
F=insectes/fourmi-rouge/outils/forme.py
P=insectes/fourmi-rouge/planches
C=refcache/myrmica-rubra/cartes
python $F rendu $P/paire-profil-c013.png "${AXE_PROFIL:-1115,212;118,358}" --out $C/rendu-profil --vue profil &&
python $F rendu $P/paire-dessus-c123.png "${AXE_DESSUS:-128,298;875,300}" --out $C/rendu-dessus --vue dessus &&
python $F table $C/profil-c115 $C/profil-c013 $C/rendu-profil --ref 2 &&
python $F table $C/dessus-c123 $C/dessus-c148 $C/rendu-dessus --ref 2
