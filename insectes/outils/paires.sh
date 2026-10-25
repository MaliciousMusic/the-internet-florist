# The bee's three reference pairs in one image: profile (studio macro), three-quarter (living), top (studio).
cd "$(dirname "$0")"
R=../../refcache/apis-mellifera
node gros.mjs abeille ../abeille/planches/g-profil.png 80 1100 800 0.5,0,-0.6 pose:270:8 1.0 >/dev/null &&
node gros.mjs abeille ../abeille/planches/g-3q.png 70 1300 900 0.8,0,-0.8 pose:75:22 1.0 >/dev/null &&
node gros.mjs abeille ../abeille/planches/g-dessus.png 75 900 1100 -1.5,0,0 pose:180:90 1.0 >/dev/null &&
python paire.py $R/hd/c256.jpg 300,200,3700,2500 ../abeille/planches/g-profil.png $R/p1.jpg --h 420 --flip >/dev/null &&
python paire.py $R/hd/c166.jpg 200,100,2900,2000 ../abeille/planches/g-3q.png $R/p2.jpg --h 420 >/dev/null &&
python paire.py $R/hd/c282.jpg 700,600,2000,2150 ../abeille/planches/g-dessus.png $R/p3.jpg --h 420 >/dev/null &&
python -c "
from PIL import Image
a=[Image.open('$R/p%d.jpg'%i) for i in (1,2,3)]
W=max(a[0].width+a[2].width+12,a[1].width); m=Image.new('RGB',(W,840+12),'#efe9df')
m.paste(a[0],(0,0)); m.paste(a[2],(a[0].width+12,0)); m.paste(a[1],(0,432)); m.save('$R/paires.jpg',quality=88); print(m.size)"
