const HV='-62 -62 124 124',HS='-50 -50 100 100';
const AN={bordeaux:{c:['#2a020a','#5c0a1c','#8e1430','#c23a54','#f2a6b4'],sp:['#f3e6c2','#c9a96a']},saumon:{c:['#5a2010','#a8512f','#d9825d','#f3b394','#ffe0cc'],sp:['#fff1d6','#e7b06b']}};
window.LAB=[
 ['Anthurium bordeaux',HV,s=>xAnth(s,0,AN.bordeaux)],['Anthurium saumon',HV,s=>xAnth(s,0,AN.saumon)],['Calla noir','-55 -150 110 160',s=>xCalla(s,0,{c:['#0a0206','#22061a','#3d0f2e','#5e2048','#9a6080'],ic:['#1a0410','#4a1636'],nk:'#2a3018',sp:'#d8b44a'})],
 ['Cymbidium cuivre','-40 -40 80 80',s=>xCymb(s,0,{})],['Cluster cymbidium','-60 -65 120 120',s=>xCymbCluster(s,0,{c:tones('#b8c35a'),lip:['#9a1020','#fff6e0','#d04050']})],
 ['Rose crème pêche',HS,s=>xRose(s,0,{c:tones('#f4d2bd'),deep:'#d98a66'})],['Rose blush',HS,s=>xRose(s,0,{c:tones('#eebcc4'),deep:'#b8606e'})],['Rose bordeaux',HS,s=>xRose(s,0,{c:tones('#8a1430'),deep:'#2a0410'})],
 ['Rose ivoire bouton',HS,s=>xRose(s,0,{c:tones('#f4ecd8'),deep:'#c9b47a',button:'#9aa860'})],['Renoncule orange','-40 -40 80 80',s=>xRanunc(s,0,{})],
 ['Renoncule rose pâle','-40 -40 80 80',s=>xRanunc(s,0,{c:tones('#f2c4c6'),deep:'#c07a80',eye:'#6a8a2a'})],['Renoncule saumon','-40 -40 80 80',s=>xRanunc(s,0,{c:tones('#f49a78'),deep:'#b0402a'})],
 ['Dahlia bordeaux','-56 -56 112 112',s=>xDahlia(s,0,{})],['Dahlia café au lait','-56 -56 112 112',s=>xDahlia(s,0,{c:tones('#ecc9b8'),deep:'#b0806e'})],['Dahlia pêche','-56 -56 112 112',s=>xDahlia(s,0,{c:tones('#f59a62'),deep:'#a0401a'})],
 ['Œillet rose poudré','-38 -38 76 76',s=>xCarn(s,0,{})],['Œillet corail','-38 -38 76 76',s=>xCarn(s,0,{c:tones('#f07862')})],['Œillet bordeaux','-38 -38 76 76',s=>xCarn(s,0,{c:tones('#7a1028')})],
 ['Œillet picotee','-38 -38 76 76',s=>xCarn(s,0,{c:tones('#fbf3f4'),tc:'#d0206a'})],['Feuille d\'anthurium','-90 -230 180 240',s=>xAnthLeaf(s,0,{})]];
