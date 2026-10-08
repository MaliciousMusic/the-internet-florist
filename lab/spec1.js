const HV='-62 -62 124 124';
const AN={bordeaux:{c:['#2a020a','#5c0a1c','#8e1430','#c23a54','#f2a6b4'],sp:['#f3e6c2','#c9a96a']},saumon:{c:['#5a2010','#a8512f','#d9825d','#f3b394','#ffe0cc'],sp:['#fff1d6','#e7b06b']},
 vert:{c:['#1f3a10','#4c7a24','#7faa3c','#b4d276','#e6f5c4'],sp:['#f2f0c8','#c8d07a']},noir:{c:['#08020a','#1d0814','#341024','#57203c','#a8708a'],sp:['#4a2430','#7a4050']},rose:{c:['#6a3440','#b8707e','#dda0aa','#f3cdd2','#fff0f2'],sp:['#f5eadf','#d9a3a8']}};
window.LAB=[
 ['Anthurium bordeaux',HV,s=>xAnth(s,0,AN.bordeaux)],['Anthurium saumon',HV,s=>xAnth(s,0,AN.saumon)],['Anthurium vert',HV,s=>xAnth(s,0,AN.vert)],['Anthurium noir',HV,s=>xAnth(s,0,AN.noir)],
 ['Calla ivoire','-55 -150 110 160',s=>xCalla(s,0,{})],['Calla noir','-55 -150 110 160',s=>xCalla(s,0,{c:['#0a0206','#22061a','#3d0f2e','#5e2048','#9a6080'],ic:['#1a0410','#4a1636'],nk:'#2a3018',sp:'#d8b44a'})],
 ['Calla pêche','-55 -150 110 160',s=>xCalla(s,0,{c:['#5a2a10','#c0602a','#ee9050','#ffc090','#ffe4cc'],ic:['#d07040','#ffd0a8'],nk:'#7a8a3a',sp:'#f0a020'})],['Anthurium rose',HV,s=>xAnth(s,0,AN.rose)],
 ['Phalaenopsis blanc','-45 -45 90 90',s=>xPhal(s,0,{})],['Phalaenopsis magenta','-45 -45 90 90',s=>xPhal(s,0,{c:tones('#c2387f'),lip:['#4a0626','#8a1048','#ffd23f'],cap:'#ffd0e4'})],
 ['Phalaenopsis prune réticulé','-45 -45 90 90',s=>xPhal(s,0,{c:['#3a0820','#a8406a','#e9a0bc','#f8d6e4','#fff0f6'],ret:1,vc:'#7a0a36',lip:['#3a0418','#7a0a36','#f2c84a']})],['Cluster phalaenopsis','-70 -70 140 140',s=>xPhalCluster(s,0,{c:tones('#c2387f'),lip:['#4a0626','#8a1048','#ffd23f']})],
 ['Cymbidium cuivre','-40 -40 80 80',s=>xCymb(s,0,{})],['Cymbidium vert','-40 -40 80 80',s=>xCymb(s,0,{c:tones('#b8c35a'),lip:['#9a1020','#fff6e0','#d04050']})],
 ['Cymbidium bordeaux','-40 -40 80 80',s=>xCymb(s,0,{c:tones('#7a1734'),lip:['#5a0816','#fbe8dc','#b02040']})],['Cluster cymbidium','-70 -75 140 140',s=>xCymbCluster(s,0,{})],
 ['Spray phalaenopsis','-40 -230 260 250',s=>xPhalSpray(s,0,{side:1,n:6,c:tones('#c2387f'),lip:['#4a0626','#8a1048','#ffd23f']})],['Spray cymbidium','-40 -230 260 250',s=>xCymbSpray(s,0,{side:1})],
 ['Phal. retombant','-40 -10 260 250',s=>xPhalSpray(s,0,{side:1,hang:1,n:6})],['Feuille d\'anthurium','-80 -250 160 260',s=>xAnthLeaf(s,0,{})]];
