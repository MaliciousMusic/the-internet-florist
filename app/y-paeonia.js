/* ================= Pivoine herbacée double (Paeonia lactiflora, double) en SVG natif (y-paeonia.js), 2026-10-19 =================
   Drawn by hand after the photos of refcache/pivoine-herbacee-double (106, 93, 98, 97, 109 open; 121, 138 half open; 107, 82, 89, 80 buds;
   201 the decline). A full double peony is two things: the guard petals, ten to twelve broad obovate petals in about two rows, cupped, their
   rounded ends irregularly notched, opening into a saucer; and the heart, a ball of fifty and more narrower petaloids (the stamens turned to
   petals), crumpled and frilled at the tip, rising from the receptacle and curling in over the top, the youngest in the middle a little lower
   (the crown). Under them five green sepals, fleshy, red at the rim, two or three ending in a leafy point. The carpels (three to five green
   felted follicles with a red crest) hide in the middle until the petals fall.
   The structure (BONNES-PRATIQUES §13-14): every piece lies on its own shell of a family of nested surfaces of revolution around the axis. A
   shell is a curve of the (r, z) half-plane, written as its distance rho(psi) from the receptacle's centre O along the ray at psi from the axis;
   the shells are tabulated over psi and kept strictly nested (each one outside the one before along every ray). Pieces are assigned shells in
   the order of their spiral (the golden angle), the outer ones first: sepals, guards, then the heart from the outside in. Two pieces that meet
   at the same place are on two shells, the outer one outside; their crumpling moves each point along its ray by less than half the gap to the
   neighbours it overlaps, so no piece can pass through another (x3d 0 by construction, measured by y3-qa3d.js). The shells change with the
   stage: a ball in the bud, a cup half open, a saucer round a dome open, a flatter, looser head in the decline; the faded drops its petals. */

/* the colourways (the catalogue's CW_PDBL, s12a.js): c the guard petals, c2 the heart. The hand ramps from the photos (base, body, tip) until
   the measured grids (fleur/apparence.py) take their place; a colourway without its own entry is derived from its catalogue colours */
/* the measured colourways (2026-10-19): each catalogue colourway on the named photos of the cultivar it was matched to (coloris.json of the
   coloris step: the name when the catalogue gives it, else the nearest measured double by ΔE; matches without a name are questions to the
   owner). The guards' grid: the face rings of the guard zone, |u| bands equal but the margin (the ring's lighter quarter), below v .45 the hand
   ramp (hidden under the heart on a face photo: gridV). The rings are read inside an ellipse placed by hand on ONE flower of each
   photo (refcache/.../cw/placements.json; owner 2026-10-19: automatic circles were wrong on clusters and on flowers seen aslant). Unmeasured here: noir (no black-red double among the measured cultivars) */
const PEO_FG={amb:.4,dif:.74,sat:.25,ao:.3,chroma:1,tone:1.06,q:3},PEO_FH={amb:.38,dif:.74,sat:.4,ao:.5,chroma:1.04,tone:1.05,q:3};
const PEO_CW={
  /* rose: Sarah Bernhardt (3 flowers, refcache/.../cw/sarah-bernhardt_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'rose':{g:{st:[[0,'#eaa9c4'],[.45,'#e487c1'],[.72,'#e2a5cc'],[1,'#c294a8']],bst:[[0,'#e7acc4'],[.4,'#ebaed3'],[1,'#d5adbf']],shade:'#ba5586',lite:'#f3d6e8',bshade:'#ca789d',blite:'#ffffff',vein:'#cb75a1',bvein:'#e8b7d6',vo:.16,
      grid:{nu:6,nv:24,c:[['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eca8cf'],['#e487c1','#e487c1','#e487c1','#e487c1','#e898c8','#eba8cf'],['#e58cc2','#e58cc2','#e58cc2','#e58cc2','#e49cc8','#e3adce'],['#e690c3','#e690c3','#e690c3','#e690c3','#ea9fcb','#edaed2'],['#e597c7','#e597c7','#e597c7','#e597c7','#eba7d1','#efb7db'],['#e4a1cc','#e4a1cc','#e4a1cc','#e4a1cc','#e9b1d7','#efc1e2'],['#e2a7ce','#e2a7ce','#e2a7ce','#e2a7ce','#e9b7d9','#f0c7e3'],['#e2a5cc','#e2a5cc','#e2a5cc','#e2a5cc','#e9b6d7','#f0c6e1'],['#e4a7cc','#e4a7cc','#e4a7cc','#e4a7cc','#eab8d7','#f0c9e3'],['#e3a0c4','#e3a0c4','#e3a0c4','#e3a0c4','#ebb3d2','#f3c8e0'],['#da9abb','#da9abb','#da9abb','#da9abb','#e7adca','#f4c0d9'],['#ce96b1','#ce96b1','#ce96b1','#ce96b1','#dfa6c0','#f1b6d0'],['#c593aa','#c593aa','#c593aa','#c593aa','#d8a2b9','#ecb1c8'],['#c294a8','#c294a8','#c294a8','#c294a8','#d7a4b8','#edb4c8']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#8a4671'],[.2,'#a35b89'],[.5,'#bc71a1'],[.8,'#d8a3c0'],[.93,'#e4bbd0'],[1,'#ebcbdb']],bst:[[0,'#96587e'],[.3,'#c079a6'],[.6,'#bc71a1'],[.9,'#d8a3c0'],[1,'#ebcbdb']],shade:'#8b2951',lite:'#d8a3c0',bshade:'#a83f6e',blite:'#ffffff',vein:'#9f4770',bvein:'#ca8db3',vo:.18,fine:PEO_FH}},
  /* rouge: Felix Crousse (2 flowers, refcache/.../cw/felix-crousse_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'rouge':{g:{st:[[0,'#d16d68'],[.45,'#b61a3a'],[.72,'#c11d47'],[1,'#d4316d']],bst:[[0,'#d2756f'],[.4,'#d05262'],[1,'#de6982']],shade:'#9a1223',lite:'#eda2a7',bshade:'#b54c49',blite:'#ffffff',vein:'#aa1631',bvein:'#d45768',vo:.16,
      grid:{nu:6,nv:24,c:[['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c01d45','#cb2150'],['#b61a3a','#b61a3a','#b61a3a','#b61a3a','#c11e45','#cb2151'],['#b81c3e','#b81c3e','#b81c3e','#b81c3e','#c41f4a','#d02356'],['#bb1e41','#bb1e41','#bb1e41','#bb1e41','#c6224f','#d2275d'],['#be1d43','#be1d43','#be1d43','#be1d43','#c92452','#d42a61'],['#c01d46','#c01d46','#c01d46','#c01d46','#cb2555','#d72c65'],['#c11e48','#c11e48','#c11e48','#c11e48','#cd2658','#d92e69'],['#c11d47','#c11d47','#c11d47','#c11d47','#ce2659','#da2e6b'],['#c51e4a','#c51e4a','#c51e4a','#c51e4a','#cf255a','#d82b6a'],['#c11f4a','#c11f4a','#c11f4a','#c11f4a','#cc2559','#d62b69'],['#c2214d','#c2214d','#c2214d','#c2214d','#cc265c','#d72c6b'],['#c62555','#c62555','#c62555','#c62555','#d12b65','#db3176'],['#cd2a61','#cd2a61','#cd2a61','#cd2a61','#d83374','#e23c87'],['#d4316d','#d4316d','#d4316d','#d4316d','#df3c82','#e94797']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#ab152f'],[.2,'#ac152f'],[.5,'#ae152e'],[.8,'#d5245e'],[.93,'#df3c7d'],[1,'#e44993']],bst:[[0,'#b73741'],[.3,'#b52c39'],[.6,'#ae152e'],[.9,'#d5245e'],[1,'#e44993']],shade:'#7b0c13',lite:'#d5245e',bshade:'#8e0f19',blite:'#ffffff',vein:'#8f101e',bvein:'#c55153',vo:.18,fine:PEO_FH}},
  /* fuchsia: Pamyati Akademika Kurchatova (3 flowers, refcache/.../cw/pamyati-akademika-kurcha_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'fuchsia':{g:{st:[[0,'#f590b6'],[.45,'#f159ac'],[.72,'#ee53ab'],[1,'#d955a0']],bst:[[0,'#f195b8'],[.4,'#f578b6'],[1,'#e886ba']],shade:'#de387f',lite:'#fdb7d9',bshade:'#e96997',blite:'#ffffff',vein:'#e54390',bvein:'#f57bbb',vo:.16,
      grid:{nu:6,nv:24,c:[['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f159ac','#f159ac','#f159ac','#f159ac','#f569ba','#f979c8'],['#f158ab','#f158ab','#f158ab','#f158ab','#f569b9','#f979c8'],['#ed52a6','#ed52a6','#ed52a6','#ed52a6','#f364b5','#f974c4'],['#ec53a5','#ec53a5','#ec53a5','#ec53a5','#f369b7','#f97eca'],['#ee54a6','#ee54a6','#ee54a6','#ee54a6','#f46bb9','#f980cc'],['#f052a7','#f052a7','#f052a7','#f052a7','#f465b6','#f876c5'],['#f051a7','#f051a7','#f051a7','#f051a7','#f45eb2','#f76abd'],['#ed53aa','#ed53aa','#ed53aa','#ed53aa','#f361b6','#f86ec2'],['#e750a5','#e750a5','#e750a5','#e750a5','#ef60b5','#f76fc4'],['#e753a7','#e753a7','#e753a7','#e753a7','#ef64b6','#f875c6'],['#e558aa','#e558aa','#e558aa','#e558aa','#ef6dbb','#f982cd'],['#e15aa8','#e15aa8','#e15aa8','#e15aa8','#ed73bd','#f98cd3'],['#db58a3','#db58a3','#db58a3','#db58a3','#eb74ba','#fa8ed2'],['#d955a0','#d955a0','#d955a0','#d955a0','#ea71b5','#fa8bcb']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#f258ac'],[.2,'#f04ea4'],[.5,'#ee439d'],[.8,'#f8a3e5'],[.93,'#fccdf1'],[1,'#fde9f9']],bst:[[0,'#f56cb4'],[.3,'#f053a3'],[.6,'#ee439d'],[.9,'#f8a3e5'],[1,'#fde9f9']],shade:'#b01840',lite:'#f8a3e5',bshade:'#d5276d',blite:'#ffffff',vein:'#c92a64',bvein:'#f671b0',vo:.18,fine:PEO_FH}},
  /* cerise: Kansas (2 flowers, refcache/.../cw/kansas_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'cerise':{g:{st:[[0,'#e07187'],[.45,'#cd1866'],[.72,'#e42c7c'],[1,'#e72f91']],bst:[[0,'#de7a8c'],[.4,'#e0547b'],[1,'#f272ac']],shade:'#a80b33',lite:'#fbabc2',bshade:'#c04d57',blite:'#ffffff',vein:'#c0194f',bvein:'#ef6495',vo:.16,
      grid:{nu:6,nv:24,c:[['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92177','#e42989'],['#cd1866','#cd1866','#cd1866','#cd1866','#d92178','#e4298a'],['#d21c6a','#d21c6a','#d21c6a','#d21c6a','#dc257d','#e72e90'],['#d11b65','#d11b65','#d11b65','#d11b65','#de257c','#ea3093'],['#d21862','#d21862','#d21862','#d21862','#df2477','#ec2e8e'],['#d71b68','#d71b68','#d71b68','#d71b68','#e3257a','#ef2f8c'],['#df2374','#df2374','#df2374','#df2374','#e82b82','#f13390'],['#e42c7c','#e42c7c','#e42c7c','#e42c7c','#ea3287','#f03892'],['#e72b7f','#e72b7f','#e72b7f','#e72b7f','#eb328b','#f03897'],['#e82d87','#e82d87','#e82d87','#e82d87','#ed3695','#f23ea3'],['#e72d89','#e72d89','#e72d89','#e72d89','#ed3899','#f241a9'],['#e62e8c','#e62e8c','#e62e8c','#e62e8c','#ed399c','#f243ac'],['#e73092','#e73092','#e73092','#e73092','#ed3aa1','#f444b0'],['#e72f91','#e72f91','#e72f91','#e72f91','#ef3aa1','#f644b2']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#ca164a'],[.2,'#cc144e'],[.5,'#cd1252'],[.8,'#f43aa3'],[.93,'#f753ba'],[1,'#f961ca']],bst:[[0,'#d33c5a'],[.3,'#d22f5b'],[.6,'#cd1252'],[.9,'#f43aa3'],[1,'#f961ca']],shade:'#7e0511',lite:'#f43aa3',bshade:'#98061d',blite:'#ffffff',vein:'#9d092a',bvein:'#dd5671',vo:.18,fine:PEO_FH}},
  /* bordeaux: Mons. Martin Cahuzac (3 flowers, refcache/.../cw/mons-martin-cahuzac_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'bordeaux':{g:{st:[[0,'#cc6b5b'],[.45,'#ad1c28'],[.72,'#b1182e'],[1,'#b31a35']],bst:[[0,'#cd7463'],[.4,'#c54d4c'],[1,'#cc5e5f']],shade:'#8e0f18',lite:'#e79f9a',bshade:'#ab4840',blite:'#ffffff',vein:'#9c1321',bvein:'#c75253',vo:.16,
      grid:{nu:6,nv:24,c:[['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b92137','#c42746'],['#ad1c28','#ad1c28','#ad1c28','#ad1c28','#b82137','#c42745'],['#ab1927','#ab1927','#ab1927','#ab1927','#b71e33','#c22340'],['#aa1125','#aa1125','#aa1125','#aa1125','#b61931','#c2203d'],['#ae1428','#ae1428','#ae1428','#ae1428','#b91b35','#c52242'],['#b61c30','#b61c30','#b61c30','#b61c30','#c2233e','#ce2b4d'],['#bb1f34','#bb1f34','#bb1f34','#bb1f34','#c92945','#d83357'],['#b1182e','#b1182e','#b1182e','#b1182e','#c22542','#d33158'],['#ac142c','#ac142c','#ac142c','#ac142c','#bd2440','#ce3153'],['#ad1631','#ad1631','#ad1631','#ad1631','#ba203f','#c62a4e'],['#ad1731','#ad1731','#ad1731','#ad1731','#b71d3b','#c12346'],['#af1730','#af1730','#af1730','#af1730','#b81d3a','#c12243'],['#b21932','#b21932','#b21932','#b21932','#bb1f3d','#c52548'],['#b31a35','#b31a35','#b31a35','#b31a35','#bc203f','#c42649']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#a61828'],[.2,'#a51524'],[.5,'#a31120'],[.8,'#d52757'],[.93,'#e34a7a'],[1,'#ec5e92']],bst:[[0,'#b3383a'],[.3,'#ab282b'],[.6,'#a31120'],[.9,'#d52757'],[1,'#ec5e92']],shade:'#740910',lite:'#d52757',bshade:'#810912',blite:'#ffffff',vein:'#860c16',bvein:'#bc4d47',vo:.18,fine:PEO_FH}},
  /* vieux-rose: Madame Calot (2 flowers, refcache/.../cw/madame-calot_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'vieux-rose':{g:{st:[[0,'#ebd4cc'],[.45,'#e7cbce'],[.72,'#dfced1'],[1,'#cfc8c8']],bst:[[0,'#e8d3cc'],[.4,'#e7d7d9'],[1,'#ddd6d6']],shade:'#d6b0b1',lite:'#f1e9ea',bshade:'#dfbfc0',blite:'#ffffff',vein:'#dabcbe',bvein:'#e5d8da',vo:.16,
      grid:{nu:6,nv:24,c:[['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e7cbce','#e7cbce','#e7cbce','#e7cbce','#ebd1d3','#efd7d8'],['#e6cdd1','#e6cdd1','#e6cdd1','#e6cdd1','#ebd3d6','#efdadc'],['#e5cfd2','#e5cfd2','#e5cfd2','#e5cfd2','#e9d4d7','#eddadc'],['#e3ced1','#e3ced1','#e3ced1','#e3ced1','#e6d4d6','#ead9db'],['#e2cfd2','#e2cfd2','#e2cfd2','#e2cfd2','#e5d4d7','#e8d9db'],['#e2cfd3','#e2cfd3','#e2cfd3','#e2cfd3','#e5d4d7','#e7d9dc'],['#decdd1','#decdd1','#decdd1','#decdd1','#e2d3d6','#e6d8db'],['#d9c8cc','#d9c8cc','#d9c8cc','#d9c8cc','#ddcfd2','#e2d5d7'],['#d7c8cb','#d7c8cb','#d7c8cb','#d7c8cb','#dbced0','#e0d3d5'],['#d5c9cb','#d5c9cb','#d5c9cb','#d5c9cb','#daced0','#ded4d5'],['#d4c9ca','#d4c9ca','#d4c9ca','#d4c9ca','#d8cecf','#dcd4d5'],['#d1c8c9','#d1c8c9','#d1c8c9','#d1c8c9','#d5cece','#dad4d4'],['#cfc8c8','#cfc8c8','#cfc8c8','#cfc8c8','#d3cece','#d8d4d5']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#e0c2be'],[.2,'#e1c2c0'],[.5,'#e1c3c3'],[.8,'#f1dddc'],[.93,'#f5e4e1'],[1,'#f8e9e4']],bst:[[0,'#e3c8c4'],[.3,'#e3c7c7'],[.6,'#e1c3c3'],[.9,'#f1dddc'],[1,'#f8e9e4']],shade:'#c38e8a',lite:'#f1dddc',bshade:'#cea4a5',blite:'#ffffff',vein:'#cfa3a0',bvein:'#e7cfcf',vo:.18,fine:PEO_FH}},
  /* lilas: Mons. Jules Elie (3 flowers, refcache/.../cw/mons-jules-elie_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'lilas':{g:{st:[[0,'#e28eb0'],[.45,'#d55ba3'],[.72,'#e386c4'],[1,'#e58ac6']],bst:[[0,'#e093b2'],[.4,'#da89bc'],[1,'#efaad6']],shade:'#b0457e',lite:'#f5c9e4',bshade:'#c26c96',blite:'#ffffff',vein:'#c55f99',bvein:'#ea9fd0',vo:.16,
      grid:{nu:6,nv:24,c:[['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ba3','#d55ba3','#d55ba3','#d55ba3','#e36ab2','#f179c2'],['#d55ca3','#d55ca3','#d55ca3','#d55ca3','#e36cb4','#f27cc4'],['#d468a8','#d468a8','#d468a8','#d468a8','#e781c0','#fa9ad9'],['#d670b0','#d670b0','#d670b0','#d670b0','#e78dc8','#f7a9e2'],['#d370b0','#d370b0','#d370b0','#d370b0','#e58ac7','#f6a5de'],['#d271b0','#d271b0','#d271b0','#d271b0','#e388c6','#f59fdc'],['#d87ab7','#d87ab7','#d87ab7','#d87ab7','#e58fcb','#f3a3e0'],['#e386c4','#e386c4','#e386c4','#e386c4','#ec9ad4','#f4aee5'],['#e288c5','#e288c5','#e288c5','#e288c5','#e79dd4','#ecb3e4'],['#e18cc6','#e18cc6','#e18cc6','#e18cc6','#eba5d7','#f3bde9'],['#e28cc7','#e28cc7','#e28cc7','#e28cc7','#e8a7d9','#eec0eb'],['#e58cc8','#e58cc8','#e58cc8','#e58cc8','#e6a7d9','#e7c0ea'],['#e78cc8','#e78cc8','#e78cc8','#e78cc8','#e8a6d8','#e8bee9'],['#e58ac6','#e58ac6','#e58ac6','#e58ac6','#eaa2d7','#efb9e8']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#ad6297'],[.2,'#b8659b'],[.5,'#c467a0'],[.8,'#ef98d4'],[.93,'#eab6e4'],[1,'#e6c9ef']],bst:[[0,'#b672a1'],[.3,'#c870a5'],[.6,'#c467a0'],[.9,'#ef98d4'],[1,'#e6c9ef']],shade:'#881f48',lite:'#ef98d4',bshade:'#a13c6e',blite:'#ffffff',vein:'#a13d6a',bvein:'#d186b2',vo:.18,fine:PEO_FH}},
  /* framboise: Cincinnati (3 flowers, refcache/.../cw/cincinnati_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'framboise':{g:{st:[[0,'#ca96a5'],[.45,'#b36c92'],[.72,'#be80a8'],[1,'#ae769b']],bst:[[0,'#c99aa7'],[.4,'#c691b0'],[1,'#c6a0b8']],shade:'#a74176',lite:'#e3c5d7',bshade:'#bb6890',blite:'#ffffff',vein:'#b15b8a',bvein:'#cc99b9',vo:.16,
      grid:{nu:6,nv:24,c:[['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b36c92','#b36c92','#b36c92','#b36c92','#ba81a0','#c196ae'],['#b46d93','#b46d93','#b46d93','#b46d93','#bc83a1','#c298b0'],['#bd779c','#bd779c','#bd779c','#bd779c','#c794af','#d1b1c2'],['#bd81a2','#bd81a2','#bd81a2','#bd81a2','#cb9db6','#d9baca'],['#ba7ea1','#ba7ea1','#ba7ea1','#ba7ea1','#c599b3','#ceb4c4'],['#bb79a1','#bb79a1','#bb79a1','#bb79a1','#c295b2','#c8b0c3'],['#bd7ca4','#bd7ca4','#bd7ca4','#bd7ca4','#c697b7','#ceb2c9'],['#be81a8','#be81a8','#be81a8','#be81a8','#c998b9','#d3b0cb'],['#c087ad','#c087ad','#c087ad','#c087ad','#ce9ebf','#dbb5d1'],['#ba85a8','#ba85a8','#ba85a8','#ba85a8','#c99cba','#d7b3cd'],['#b786a8','#b786a8','#b786a8','#b786a8','#c49ab7','#d0aec7'],['#b585a6','#b585a6','#b585a6','#b585a6','#bf97b3','#c9a9c0'],['#b27f9f','#b27f9f','#b27f9f','#b27f9f','#bb90ac','#c5a1b8'],['#ae769b','#ae769b','#ae769b','#ae769b','#b786a5','#bf97b0']]},gridV:[.3,.48],fine:PEO_FG},
    h:{st:[[0,'#a0768e'],[.2,'#a96a93'],[.5,'#b15c97'],[.8,'#dfc1d6'],[.93,'#f1e2ed'],[1,'#fdf9fd']],bst:[[0,'#a98399'],[.3,'#b6669d'],[.6,'#b15c97'],[.9,'#dfc1d6'],[1,'#fdf9fd']],shade:'#831642',lite:'#dfc1d6',bshade:'#a12b6b',blite:'#ffffff',vein:'#963563',bvein:'#c27dab',vo:.18,fine:PEO_FH}},
  /* blanc: Duchesse de Nemours, blush: Shirley Temple. Whites (BONNES-PRATIQUES 4.4): the cameras gave them grey-green; their relative
     lightness is kept from the rings (Duchesse: the heart a little darker and warmer than the guards, a cream-yellow centre; Shirley Temple:
     guards and heart alike, the centre faintly cream), the tint from the coloris notes; shadows warm (3.7) */
  blanc:{g:{st:[[0,'#e8e2c4'],[.3,'#f4f1e6'],[.7,'#f8f6ee'],[1,'#fbfaf4']],bst:[[0,'#e4e0c4'],[.4,'#f2f0e6'],[1,'#f8f6ee']],shade:'#b09478',lite:'#ffffff',bshade:'#b4a888',blite:'#ffffff',
      vein:'#ddd6bc',bvein:'#e8e4d2',vo:.12,fine:PEO_FG},
    h:{st:[[0,'#e6d48e'],[.2,'#efe2b2'],[.5,'#f3ebd2'],[.8,'#f8f4e6'],[1,'#fcfaf2']],bst:[[0,'#eadca6'],[.4,'#f2ead4'],[1,'#faf7ee']],shade:'#b4906a',lite:'#ffffff',bshade:'#bea080',blite:'#ffffff',
      vein:'#d8ccaa',bvein:'#e8e0c8',vo:.12,fine:PEO_FH}},
  blush:{g:{st:[[0,'#ece0cc'],[.3,'#f6efe8'],[.7,'#f8f3ee'],[1,'#fbf8f4']],bst:[[0,'#e8dece'],[.4,'#f4eee8'],[1,'#f9f5f1']],shade:'#a89484',lite:'#ffffff',bshade:'#b4a494',blite:'#ffffff',
      vein:'#e0d4c8',bvein:'#ece4dc',vo:.12,fine:PEO_FG},
    h:{st:[[0,'#ecdcbc'],[.25,'#f2e6d6'],[.5,'#f5ece4'],[.8,'#f9f4ee'],[1,'#fcfaf6']],bst:[[0,'#eee2c8'],[.4,'#f4ece4'],[1,'#faf7f2']],shade:'#a08c78',lite:'#ffffff',bshade:'#b09c88',blite:'#ffffff',
      vein:'#e0d2c2',bvein:'#ece2d8',vo:.12,fine:PEO_FH}}};var PEO_LAST=null;  /* (test only, &qa3d=2: the last head's pieces) */
const PEO_GRID={};
/* the receptacle and the shells: key curves (r, z in R0), outside first, for four stages of opening (op): the closed bud, the marshmallow, the
   cup, the open saucer. sep: the sepals' shell; gO, gI: the outer and inner guards; hO, hI: the outer and inner heart. The key curves start at
   their insertion on the receptacle and run past the pieces' tips; between two key curves a shell is their blend */
const PEO_KEYS=[
  {op:.06,sep:[[.13,-.11],[.24,-.06],[.31,.05],[.33,.18],[.29,.32],[.18,.43],[0,.47]],gO:[[.12,-.09],[.22,-.04],[.29,.06],[.31,.18],[.27,.31],[.17,.41],[0,.45]],
    gI:[[.11,-.08],[.2,-.03],[.27,.06],[.29,.18],[.25,.3],[.16,.39],[0,.43]],hO:[[.1,-.06],[.18,-.01],[.24,.07],[.26,.18],[.23,.29],[.14,.37],[0,.4]],
    hI:[[.04,0],[.07,.06],[.09,.13],[.09,.2],[.07,.26],[0,.3]]},
  {op:.35,sep:[[.14,-.13],[.3,-.09],[.43,.02],[.48,.18],[.45,.36],[.3,.55],[0,.62]],gO:[[.13,-.1],[.27,-.05],[.39,.06],[.44,.2],[.41,.37],[.27,.54],[0,.6]],
    gI:[[.12,-.09],[.25,-.04],[.36,.06],[.41,.2],[.38,.36],[.25,.52],[0,.58]],hO:[[.11,-.07],[.22,-.02],[.32,.07],[.37,.2],[.34,.35],[.22,.49],[0,.55]],
    hI:[[.04,0],[.08,.08],[.11,.18],[.12,.28],[.09,.38],[0,.43]]},
  {op:.65,sep:[[.15,-.15],[.34,-.13],[.52,-.04],[.66,.1],[.72,.3],[.7,.55],[.5,.85],[0,.98]],gO:[[.15,-.12],[.32,-.07],[.5,.04],[.63,.18],[.7,.38],[.68,.62],[.48,.88],[0,.96]],
    gI:[[.14,-.1],[.29,-.05],[.45,.05],[.57,.19],[.62,.38],[.6,.6],[.44,.84],[0,.92]],hO:[[.12,-.08],[.25,-.03],[.39,.07],[.5,.21],[.54,.38],[.52,.58],[.38,.78],[0,.86]],
    hI:[[.04,0],[.08,.1],[.12,.24],[.14,.4],[.12,.56],[0,.66]]},
  {op:1,sep:[[.16,-.17],[.36,-.21],[.58,-.2],[.8,-.12],[1.0,.02],[1.12,.24],[1.12,.6],[.9,1],[0,1.3]],gO:[[.16,-.13],[.34,-.11],[.56,-.05],[.8,.07],[.99,.26],[1.07,.5],[1.0,.86],[.6,1.2],[0,1.28]],
    gI:[[.15,-.11],[.31,-.07],[.5,.0],[.7,.13],[.86,.32],[.92,.56],[.86,.86],[.5,1.16],[0,1.24]],hO:[[.13,-.09],[.3,-.03],[.49,.1],[.64,.3],[.71,.55],[.68,.8],[.5,1.02],[.25,1.14],[0,1.18]],
    hI:[[.04,0],[.08,.15],[.13,.4],[.16,.65],[.13,.9],[0,1.02]]}];
/* the free settings. Counts: sepals, guards, heart petaloids (by DET). Widths are half widths in R0 at the widest; tips: where each piece ends,
   as an angle from the axis (radians), [bud, marshmallow, cup, open] */
const PEO_DBL={nS:5,nG:[11,12],nH:[32,44],
  H:[.17,.25,.4,.5],tight:[0,0,.26,.36,0],cap:.12,sepW:.27,sepTip:[1.45,1.9,2.42,2.6],sepLeaf:[.3,.25,.2,.15],gW:.4,gTip:[.06,.28,1.15,1.57],hW:[.17,.28],hTipI:[.04,.04,.03,.025],hTipO:[.4,.65,1.05,1.15],
  sOut:[.06,.04],  /* the first sepal's shell past sep, and the sepals' spread */
  ruf:[.012,.03,.08],rufK:[5,9],amp:.45,curl:.06,cupG:.25,cupH:.35,
  dec:[.1,.4],fan:[.5,.35],fall:[.42,.5],keep:.08,flop:.32,loose:.12,
  nu:[9,13],nv:[14,22],gnu:[13,17],gnv:[20,30],pmin:3,
  light:{wrap:.32,amb:.3,dif:.68,sky:.14,ks:.1,gloss:14,dark:[.94,.86,.78,.7,.62,.54],da:.16,lit:[1.05,1.13,1.21],la:.17,darkLo:[.9,.78,.66],daLo:.22,litLo:[1.07,1.17],laLo:.2,soft:.05}};
/* the carpels' envelope (the core no petal comes inside), by stage, in the same terms */
const PEO_CORE=[[.06,[[.02,0],[.05,.02],[.06,.06],[.04,.1],[0,.12]]],[.35,[[.02,0],[.07,.03],[.09,.09],[.07,.15],[0,.18]]],[.65,[[.02,0],[.1,.04],[.13,.13],[.1,.22],[0,.26]]],
  [1,[[.02,0],[.16,.03],[.2,.14],[.2,.28],[.12,.36],[0,.38]]]];
const PEO_NJ=160,PEO_PSI=3.1;  /* the shells' table: rho at NJ+1 angles from the axis (0) to PSI (straight down: the feet on the receptacle) */
/* a key curve made smooth (Catmull-Rom through its points, 12 steps a span: a polyline's corners showed as bands of light), then resampled
   to m points by arc length */
function peoRes(P0,m){const P=[],n=P0.length,g=i=>P0[Math.max(0,Math.min(n-1,i))];
  for(let i=0;i<n-1;i++)for(let k=0;k<12;k++){const t=k/12,a=g(i-1),b=g(i),c=g(i+1),d=g(i+2),t2=t*t,t3=t2*t;
    P.push([0,1].map(j=>.5*(2*b[j]+(-a[j]+c[j])*t+(2*a[j]-5*b[j]+4*c[j]-d[j])*t2+(-a[j]+3*b[j]-3*c[j]+d[j])*t3)))}
  P.push(P0[n-1]);const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const T=L[L.length-1]||1,out=[];
  for(let q=0;q<m;q++){const s=T*q/(m-1);let i=1;while(i<P.length-1&&L[i]<s)i++;const f=Math.max(0,Math.min(1,(s-L[i-1])/((L[i]-L[i-1])||1)));out.push([P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f])}return out}
/* the key curve of a stage op, blended between the two stages around it (smoothly) */
function peoBlend(list,op,get){let a=list[0],b=list[list.length-1];for(let i=0;i<list.length-1;i++)if(op<=list[i+1].op){a=list[i];b=list[i+1];break}
  const t=op<=a.op?0:op>=b.op?1:svSm((op-a.op)/(b.op-a.op)),A=peoRes(get(a),64),Bq=peoRes(get(b),64);return A.map((p,q)=>[p[0]+(Bq[q][0]-p[0])*t,p[1]+(Bq[q][1]-p[1])*t])}
/* a curve (r, z) as its table rho(psi): the ray at psi meets the curve where the cross product changes sign; past the curve's ends the ends' rho */
function peoTab(P0,H,miss){const P=P0.map(p=>[p[0],p[1]-H]),T=new Float64Array(PEO_NJ+1),ps=P.map(p=>Math.atan2(p[0],p[1])),rh=P.map(p=>Math.hypot(p[0],p[1]));
  for(let j=0;j<=PEO_NJ;j++){const a=j/PEO_NJ*PEO_PSI,dx=Math.sin(a),dz=Math.cos(a);let best=-1;
    for(let i=0;i<P.length-1;i++){const p=P[i],q=P[i+1],c0=p[0]*dz-p[1]*dx,c1=q[0]*dz-q[1]*dx;if(c0*c1>0)continue;const f=Math.abs(c0-c1)<1e-12?0:c0/(c0-c1),
      x=p[0]+(q[0]-p[0])*f,z=p[1]+(q[1]-p[1])*f;if(x*dx+z*dz<=0)continue;const r=Math.hypot(x,z);if(r>best)best=r}
    if(best<0){if(miss!=null)best=miss;else{const i=a>ps[0]?0:P.length-1;best=rh[i]}}T[j]=best}return T}
/* the shells of one head at stage op, decline dec, faded fan: the key tables nested outward from the core (each outside the one inside it by
   eps along every ray); rho(psi, s) with s 0 the sepals' curve .. 1 gO .. 2 gI .. 3 hO .. 4 hI, s < 0 outside the sepals; ins(s) the insertion */
function peoShells(P,op,dec,fan){const names=['sep','gO','gI','hO','hI'],eps=.014;
  const C=names.map(n=>peoBlend(PEO_KEYS,op,k=>k[n])),core=peoBlend(PEO_CORE.map(([o,c])=>({op:o,c})),op,k=>k.c);
  /* the decline: the guards and the sepals flop away from the axis, the heart loosens (wider, lower); the faded more */
  const fl=P.flop*(dec+.6*fan),lo=P.loose*(dec+.8*fan);
  C.forEach((c,i)=>{const n=c.length;for(let q=1;q<n;q++){const t=q/(n-1),p=c[q],a=Math.atan2(p[0],p[1]),r=Math.hypot(p[0],p[1]);
    if(i<3&&fl>0){const a2=a+fl*svSm((t-.1)/.6)*(i?1:.7);c[q]=[r*Math.sin(a2),r*Math.cos(a2)]}else if(i>=3&&lo>0)c[q]=[p[0]*(1+lo*t),p[1]*(1-.45*lo*t)]}});
  const H=peoSt(P.H,op)-.08*lo;if(fan>0)core.forEach((p,q)=>{core[q]=[p[0]*(1+.3*fan),p[1]*(1+.3*fan)]});
  /* while the head is shut (bud, marshmallow) the guards lie a petal's thickness apart: the inner key curves are drawn toward the centre */
  {const bw=1-svSm((op-.32)/.5);if(bw>0)C.forEach((c,i)=>{const f=1-(P.tight[i]||0)*bw;if(f!==1)c.forEach((p,q)=>{c[q]=[p[0]*f,H+(p[1]-H)*f]})})}
  const T=C.map(c=>peoTab(c,H)),K=peoTab(core,H,0);
  for(let j=0;j<=PEO_NJ;j++){let lo2=K[j];for(let i=4;i>=0;i--){if(T[i][j]<lo2+eps)T[i][j]=lo2+eps;lo2=T[i][j]}}
  const ins=C.map(c=>Math.atan2(c[0][0],c[0][1]-H));
  const at=(Tb,a)=>{const x=Math.max(0,Math.min(PEO_NJ,a/PEO_PSI*PEO_NJ)),j=Math.min(PEO_NJ-1,Math.floor(x)),f=x-j,y0=Tb[Math.max(0,j-1)],y1=Tb[j],y2=Tb[j+1],y3=Tb[Math.min(PEO_NJ,j+2)];  /* Catmull-Rom: no kink at the table's steps */
    return y1+.5*f*(y2-y0+f*(2*y0-5*y1+4*y2-y3+f*(3*(y1-y2)+y3-y0)))};
  const rho=(a,s)=>{if(s<=0)return at(T[0],a)+(-s)*P.sOut[0];const i=Math.min(3,Math.floor(s)),f=s-i;return at(T[i],a)*(1-f)+at(T[i+1],a)*f};
  const insA=s=>{if(s<=0)return Math.min(PEO_PSI,ins[0]+(-s)*.03);const i=Math.min(3,Math.floor(s)),f=s-i;return ins[i]*(1-f)+ins[i+1]*f};
  return{rho,ins:insA,core:a=>at(K,a),H}}
/* a profile [[v, w]...] read at v (smooth between its points) */
const peoProf=(W,v)=>{for(let j=1;j<W.length;j++)if(v<=W[j][0]){const q=(v-W[j-1][0])/(W[j][0]-W[j-1][0]);return W[j-1][1]+(W[j][1]-W[j-1][1])*svSm(q)}return W[W.length-1][1]};
/* the outlines (photos 106, 93 at 1:1): a guard petal broadly obovate from a short claw, widest at two thirds, its end rounded and cut by one to
   three shallow notches; a petaloid of the heart narrower, spoon-shaped, its end frilled and cut deeper; a sepal round and fleshy, some with a
   leafy point */
const PEO_WP={g:[[0,.2],[.12,.36],[.4,.78],[.66,1],[.82,.95],[.92,.78],[.97,.56],[1,.3]],h:[[0,.18],[.2,.42],[.55,.86],[.78,1],[.9,.9],[.96,.7],[1,.45]],
  s:[[0,.5],[.2,.86],[.5,1],[.75,.9],[.9,.68],[1,.3]],sl:[[0,.5],[.2,.86],[.45,.9],[.65,.55],[.82,.28],[1,.08]]};
/* (the end's roundness is in these profiles: the outline cut Lu below stays shallow, a deep cut skews the sheet's grid and its normals) */
/* the pieces of one head: their spiral place, shell, extent and individual traits, from the seed (the same head at every stage) */
function peoPieces(P,g,op,nG,nH){const r=svRng(g.sd),L=[],GA=2.39996;
  for(let i=0;i<P.nS;i++)L.push({kind:'s',i,th:g.rot+i*2.5133+r.in(-.1,.1),s:-1+i/(P.nS-1),leafy:i===0||(i===1&&r()<.35),sd:Math.floor(r()*1e9),
    dW:r.in(.88,1.12),dT:r.in(-.08,.08),ph:r.in(0,6.28)});
  for(let k=0;k<nG;k++)L.push({kind:'g',i:k,th:g.rot+.7+k*GA+r.in(-.07,.07),s:1+k/(nG-1),sd:Math.floor(r()*1e9),dW:r.in(.88,1.14),dT:r.in(-.1,.1),
    notch:Array.from({length:1+Math.floor(r()*3)},()=>[r.in(-.7,.7),r.in(.25,.6),r.in(.05,.11)]),ph:r.in(0,6.28),ph2:r.in(0,6.28),wk:r.in(2.2,3.6),fall:r(),asym:r.in(-.08,.08)});
  /* the heart's petaloids: never two alike (photo 106: chunky, crumpled, of all sizes, their ends at every height, frilled by a few uneven
     cuts, some ends rolled out, some in) */
  for(let k=0;k<nH;k++){const t=k/(nH-1);L.push({kind:'h',i:k,t,th:g.rot+.7+(nG+k)*GA+r.in(-.22,.22),s:3+t,sd:Math.floor(r()*1e9),dW:r.in(.62,1.45),dT:r.in(-.16,.16)*(1-.6*t),
    notch:Array.from({length:1+Math.floor(r()*4)},()=>[r.in(-.85,.85),r.in(.2,1),r.in(.05,.2)]),ph:r.in(0,6.28),ph2:r.in(0,6.28),wk:r.in(2.2,5.5),fall:r(),asym:r.in(-.18,.18),
    tilt:r.in(-1,1),roll:r()<.4?-1:1,fold:r.in(.4,1.4)})}
  return L}
/* the stage table [bud, marshmallow, cup, open] read at op */
const peoSt=(A,op)=>{const o=[.06,.35,.65,1];if(op<=o[0])return A[0];for(let i=0;i<3;i++)if(op<=o[i+1])return A[i]+(A[i+1]-A[i])*svSm((op-o[i])/(o[i+1]-o[i]));return A[3]};
/* each piece's geometry over its shell: v -> psi by arc length from the insertion to the tip, the half width, the crumpling bounded by its
   neighbours (BONNES-PRATIQUES §14: every point moves along its ray by less than amp of the gap to any piece it overlaps) */
function peoGeom(P,L,sh,op,dec,fan,R0){const NA=40,NR=14,hi=DET>=1.5;
  for(const q of L){const W=q.kind==='g'?P.gW:q.kind==='h'?P.hW[1]+(P.hW[0]-P.hW[1])*q.t:P.sepW;
    q.W=W*q.dW*(q.kind==='h'?.8+.2*svSm((op-.3)/.5):1);q.wp=q.kind==='s'?(q.leafy?PEO_WP.sl:PEO_WP.s):PEO_WP[q.kind];
    q.a0=sh.ins(q.s);q.a1=q.kind==='s'?peoSt(P.sepTip,op)-(q.leafy?peoSt(P.sepLeaf,op):0)+q.dT+.15*(dec+fan)+.7*P.flop*(dec+.6*fan):
      q.kind==='g'?peoSt(P.gTip,op)+q.dT+P.flop*(dec+.6*fan)*.8:peoSt(P.hTipO,op)+(peoSt(P.hTipI,op)-peoSt(P.hTipO,op))*Math.pow(q.t,.8)+q.dT+.2*dec;
    q.a1=Math.max(.02,Math.min(q.a0-.3,q.a1));
    /* the arc along the shell: cumulative length, then psi at NA+1 even steps of length */
    const ps=[],Ls=[0];let pr=null;for(let i=0;i<=NA;i++){const a=q.a0+(q.a1-q.a0)*i/NA,rh=sh.rho(a,q.s),pt=[rh*Math.sin(a),rh*Math.cos(a)];ps.push(a);if(pr)Ls.push(Ls[i-1]+Math.hypot(pt[0]-pr[0],pt[1]-pr[1]));pr=pt}
    const T=Ls[NA]||1,PV=new Float64Array(NA+1);for(let i=0;i<=NA;i++){const l=T*i/NA;let j=1;while(j<NA&&Ls[j]<l)j++;const f=Math.max(0,Math.min(1,(l-Ls[j-1])/((Ls[j]-Ls[j-1])||1)));PV[i]=ps[j-1]+(ps[j]-ps[j-1])*f}
    q.len=T;q.psi=v=>{const x=Math.max(0,Math.min(1,v))*NA,j=Math.min(NA-1,Math.floor(x)),f=x-j;return PV[j]*(1-f)+PV[j+1]*f};
    q.vOf=a=>{if(a>PV[0]||a<PV[NA])return-1;let j=1;while(j<NA&&PV[j]>a)j++;return(j-1+(PV[j-1]-a)/((PV[j-1]-PV[j])||1))/NA};
    q.ew=q.kind==='g'?.05:q.kind==='h'?.08:.03;
    q.hwE=v=>q.W*peoProf(q.wp,v)*(1+Math.abs(q.asym||0))*(1+q.ew);
    q.dth=(v,a)=>{const rh=sh.rho(a,q.s)*Math.sin(a);return Math.min(1.25,q.hwE(v)/Math.max(1e-3,rh))}}
  /* the bounds: by rows of v, the least gap to a piece outside (out) and inside (in), and to the core */
  for(const q of L){const out=new Float64Array(NR+1),inn=new Float64Array(NR+1);
    for(let j=0;j<=NR;j++){const v=j/NR,a=q.psi(v),rk=sh.rho(a,q.s),dk=q.dth(v,a);let mo=P.cap,mi=Math.min(P.cap,rk-sh.core(a));
      for(const m of L){if(m===q)continue;const vm=m.vOf(a);if(vm<0)continue;let d=Math.abs(q.th-m.th)%6.2832;if(d>3.1416)d=6.2832-d;if(d>dk+m.dth(vm,a)+.06)continue;
        const gp=sh.rho(a,m.s)-rk;if(gp>0)mo=Math.min(mo,gp);else mi=Math.min(mi,-gp)}
      const base=svSm((v-.03)/.22);out[j]=Math.max(0,mo)*P.amp*base;inn[j]=Math.max(0,mi)*P.amp*base}
    const sm=A=>A.map((x,j)=>Math.min(x,A[Math.max(0,j-1)],A[Math.min(NR,j+1)]));q.aO=sm(out);q.aI=sm(inn);
    q.amp=(A,v)=>{const x=Math.max(0,Math.min(1,v))*NR,j=Math.min(NR-1,Math.floor(x)),f=x-j;return A[j]*(1-f)+A[j+1]*f}}}
/* the surface of a piece: (u, v) -> local 3D point (R0 units x R0). The end's outline (Lu) cuts v; the half width gives the turn about the axis
   at that height; the cup, the crumpling and the curl move the point along its ray, inside its bounds (a soft clamp, never past them) */
function peoSurf(P,q,sh,R0,dec,fan){const kind=q.kind,A=P.ruf[kind==='g'?1:kind==='h'?2:0]*(1+.9*dec+.6*fan)*(DET>=1.5?1:.8),
    vb=kind==='g'?.93:kind==='h'?.9:q.leafy?.94:.88,pw=kind==='g'?2.3:kind==='h'?2:q.leafy?1.15:1.8;
  const Lu=u=>{const a=Math.abs(u);let x=vb+(1-vb)*Math.pow(Math.max(0,1-Math.pow(a,pw)),1/pw);
    if(q.notch)for(const[un,dp,wn]of q.notch)x-=dp*(1-vb)*Math.exp(-Math.pow((u-un)/wn,2));
    if(kind==='h')x-=.01*(1+Math.sin(u*(4+q.wk)+q.ph2)*Math.sin(u*2.3+q.ph))*svSm((a-.2)/.5);return Math.max(.05,x)};
  return(u,v)=>{const ve=v*Lu(u),a=q.psi(ve),hw=q.W*peoProf(q.wp,ve)*(1+(q.asym||0)*Math.sign(u))*(1+q.ew*Math.sin((q.wk||3)*1.3*Math.PI*ve+q.ph+(u<0?2.3:0))*svSm((ve-.15)/.3)),
      rs=sh.rho(a,q.s),sn=Math.max(1e-3,Math.sin(a)),dth=Math.min(1.25,hw/(rs*sn)),th=q.th+u*dth;
    let x=0;const au=Math.abs(u);
    if(kind==='g'){x=-P.cupG*hw*u*u*svSm(ve/.35)+A*Math.pow(au,1.4)*Math.sin(q.wk*Math.PI*u+q.ph+2*ve)*svSm((ve-.3)/.4)+A*.5*Math.sin(2.3*Math.PI*ve+q.ph2)*svSm((ve-.4)/.4)
      +P.curl*svSm((ve-.72)/.28)*(1+.8*au)}
    else if(kind==='h'){x=-P.cupH*hw*u*u+A*q.fold*(.6*Math.sin(q.wk*Math.PI*u+q.ph+6*ve)+.4*Math.sin(1.7*q.wk*Math.PI*u-q.ph2+11*ve))*svSm((ve-.2)/.4)*(.5+.5*au)
      +A*.8*q.tilt*u*svSm((ve-.3)/.4)+P.curl*.7*q.roll*svSm((ve-.75)/.25)}
    else x=-.5*hw*u*u+.01*Math.sin(3*Math.PI*u+q.ph)*svSm((ve-.4)/.4)+(fan+dec)*.04*svSm((ve-.6)/.4);
    const bo=q.amp(q.aO,ve),bi=q.amp(q.aI,ve),d=x>0?(bo>1e-6?bo*Math.tanh(x/bo):0):(bi>1e-6?-bi*Math.tanh(-x/bi):0),rr=(rs+d)*R0;
    return[rr*sn*Math.cos(th),rr*sn*Math.sin(th),sh.H*R0+rr*Math.cos(a)]}}
/* the colours of a colourway, by piece: g the guards, h the heart, s the sepals; ramps from the base (0) to the end (1), inner face st and back
   bst, shade and light of the washes, veins. A measured entry (PEO_CW) wins; else derived from the catalogue's c (guards) and c2 (heart): a
   paler cream base, the body, the end a little silvered (photos 106, 98: the heart's frilled ends catch the light), the back paler */
const PEO_CWX={};
function peoCol(cwx){const id=cwx.id;if(PEO_CWX[id])return PEO_CWX[id];const c=cwx.c||'#f0a6c0',c2=cwx.c2||c,pale=h2l(c)[2]>.82;
  const sh=x=>h2l(x)[2]>.82?mix(x,'#8a6448',.42):mix(x,'#3a0618',.5),li=x=>mix(x,'#ffffff',.6);
  const one=(x,tip)=>({st:[[0,mix(x,'#f2e2bc',.5)],[.16,mix(x,'#ffffff',.08)],[.5,x],[.84,mix(x,'#ffffff',tip*.5)],[1,mix(x,'#ffffff',tip)]],
    bst:[[0,mix(x,'#dcdcae',.45)],[.2,mix(x,'#ffffff',.22)],[.7,mix(x,'#ffffff',.2)],[1,mix(x,'#ffffff',.26)]],shade:sh(x),lite:li(x),bshade:sh(mix(x,'#ffffff',.2)),blite:'#ffffff',
    vein:pale?mix(x,'#c8a890',.35):mix(x,'#5a0a28',.22),bvein:mix(x,'#ffffff',.1),vo:pale?.12:.16});
  const M=PEO_CW[id]||{};return PEO_CWX[id]={g:Object.assign(one(c,.14),M.g),h:Object.assign(one(c2,.3),M.h),s:{st:[[0,'#4e6e26'],[.45,'#628434'],[.8,'#6e8838'],[1,'#7a6a30']],bst:[[0,'#7c9a48'],[.6,'#8eaa58'],[1,'#98a85a']],
    shade:'#1e3410',lite:'#b8d07a',bshade:'#3e5a20',blite:'#d0e09a',vein:'#3e5c1c',bvein:'#6e8c40',vo:.2,rim:'#9a2a22'},
    carp:'#8aa860',felt:'#dfe6c6',crest:'#b8284a'}}
/* a colour on the head at stage: the tight bud's green on the backs, the decline's bleaching, the faded drying (BONNES-PRATIQUES 6.4: pinks to
   a dusty pale then tan, whites to ivory then beige, reds to wine then brown; the sepals yellow) */
function peoShv(c,v,gt,dec,fan,kind){let x=c;if(gt>0&&kind!=='s')x=mix(x,'#9cb262',Math.min(1,gt*(1-.8*v)));
  if(kind==='s'){if(fan>0)x=typeof lifeCol==='function'?lifeCol(x,.6*fan):mix(x,'#8a8a3a',.5*fan);return x}
  const[h,s,l]=h2l(x);if(dec>0)x=l>.8?mix(x,'#f4ecd8',.35*dec):mix(x,l>.45?'#f0dde2':'#7a2a40',.3*dec);
  const a=Math.min(1,.2*dec+.85*fan);if(a>0){x=mix(x,'#ead6d6',.35*a);x=mix(x,'#c8a088',Math.min(1,a*a*(.15+.6*v)));if(a>.6)x=mix(x,'#8a6448',(a-.6)*v*.9)}return x}
function peoMat(P,C,kind,gt,dec,fan,hi){const K=C[kind],sv=(c,v)=>peoShv(c,v,gt,dec,fan,kind),ramp=st=>st.map(([v,c])=>[v,sv(c,v)]);
  const m=Object.assign({stops:ramp(K.st),bstops:ramp(K.bst),shade:sv(K.shade,.5),lite:K.lite,bshade:sv(K.bshade,.5),blite:K.blite,rim:mix(sv(K.st[2][1],.5),'#3a1020',.3),
    cast:mix(K.shade,'#1a0a08',.5)},P.light,{trans:kind==='s'?.08:.16+.1*dec,rw:hi?.0025:0,ro:.2});
  /* the fine material and the measured grid (opt-in by the colourway's measures): the tissue dries under it as the flower fades */
  if(K.fine&&hi){const age=Math.min(.7,.15*dec+.6*fan)*(kind==='h'?.55:1),f0=Object.assign({shadeC:K.shade,shadeK:h2l(K.st[2][1])[2]>.7?.75:.45},K.fine);m.fine=age>0?Object.assign({},f0,{age:{a:age,c:'#ecd4d6',c2:'#b48c7c',vein:'#8a6050',n:10}}):f0;if(K.grid&&gt<.3){m.grid=K.grid;if(K.gridV)m.gridV=K.gridV}}
  if(kind==='s')m.cross=[{st:[[0,K.rim,0],[.72,K.rim,0],[.9,K.rim,.55],[1,K.rim,.85]],tip:.9,bk:.5,soft:.02}];
  if(!hi)for(const q of['stops','bstops'])if(m[q].length>3)m[q]=[m[q][0],m[q][Math.floor(m[q].length/2)],m[q][m[q].length-1]];
  return m}
/* the carpels (photos 201, 306, 308: three to five follicles in the middle, felted, pale green under a white down, each ending in a curled
   crest, red to crimson): drawn only once the petals fall and show them (the full double hides them); each a drawn piece, a felted spindle
   along a 3D spine, with a proxy strap for the order and its tube for the 3D check (y3-qa3d.js) */
function peoCarpels(B,O,R0,g,C,op,fan,pieces,ff){if(ff<.15)return;const r=svRng(g.sd+71),n=3+Math.floor(r()*3),hi=DET>=1.5,sw=1+.3*fan,
    lt=(()=>{const x=LIGHT[0],y=-LIGHT[1],l=Math.hypot(x,y)||1;return[x/l,y/l]})(),body=mix(C.carp,'#8a7a40',.35*fan),felt=C.felt,crest=mix(C.crest,'#5a1a1a',.4*fan);
  const T=[];for(let i=0;i<n;i++){const ph=g.rot+i/n*6.2832+r.in(-.15,.15),rd=[Math.cos(ph),Math.sin(ph),0],L=R0*.27*sw*r.in(.9,1.08),P3=[];
    for(let j=0;j<=8;j++){const v=j/8,a=.08+.18*v*v;P3.push([rd[0]*R0*(.05+.02*v)+rd[0]*Math.sin(a)*L*v,rd[1]*R0*(.05+.02*v)+rd[1]*Math.sin(a)*L*v,R0*.02+Math.cos(a)*L*v])}
    T.push({P:P3,rad:k=>R0*.045*sw*Math.sin(Math.PI*Math.min(.95,.12+k/8*.85)),ph,rd})}
  let Q=typeof svApart==='function'?svApart(T.map(t=>({P:t.P,rad:t.rad})),R0*.006,.2,6):T.map(t=>t.P);
  /* clear of the petals still on (their feet round the receptacle): the measure's own rule, then apart again */
  if(typeof svClearT==='function')for(let it=0;it<3;it++){Q=Q.map((P3,x)=>svClearT(pieces,P3,T[x].rad,.15,R0*.006));if(typeof svApart==='function')Q=svApart(Q.map((P3,x)=>({P:P3,rad:T[x].rad})),R0*.006,.2,4)}
  T.forEach((t,x)=>{const P3=Q[x],w=k=>t.rad(k),ax=V3.cr(V3s(P3[8],P3[0]),[0,0,1]),side=V3l(ax)>1e-3?V3.nz(ax):[1,0,0],
      sp=v=>{const y=v*8,j=Math.min(7,Math.floor(y)),f=y-j;return V3.add(V3.sc(P3[j],1-f),V3.sc(P3[j+1],f))},
      prox=svSheet(B,O,(u,v)=>V3.add(sp(v),V3.sc(side,u*Math.max(w(v*8)*.5,R0*.008))),{nu:2,nv:9});
    pieces.push({fn:k2=>{const S2=P3.map(p=>PJ(B,O,p)),Lp=[],Rp=[],Hp=[];for(let q=0;q<=8;q++){const a=S2[Math.max(0,q-1)],b=S2[Math.min(8,q+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ww=w(q),nx=-dy/l,ny=dx/l;
        Lp.push([S2[q][0]+nx*ww,S2[q][1]+ny*ww]);Rp.push([S2[q][0]-nx*ww,S2[q][1]-ny*ww]);Hp.push([nx,ny,ww,S2[q]])}
      const hk=G(k2),out=svSpl(Lp.concat(Rp.slice().reverse())),mid=Hp[4],sg=mid[0]*lt[0]+mid[1]*lt[1]>0?1:-1,id='pc'+(gid++),
        gr=E('linearGradient',{id,gradientUnits:'userSpaceOnUse',x1:svF(mid[3][0]+mid[0]*mid[2]*sg),y1:svF(mid[3][1]+mid[1]*mid[2]*sg),x2:svF(mid[3][0]-mid[0]*mid[2]*sg),y2:svF(mid[3][1]-mid[1]*mid[2]*sg)},GDEF||defs);
      for(const[o2,c2]of[[0,mix(felt,body,.25)],[.35,mix(body,felt,.35)],[.7,body],[1,mix(body,'#1e2a0c',.45)]])E('stop',{offset:o2,'stop-color':c2},gr);
      E('path',{d:out,fill:`url(#${id})`,stroke:mix(body,'#2a3010',.4),'stroke-width':svF(Math.max(.12,R0*.004)),'stroke-opacity':.4},hk);
      if(!LOD){/* the suture (a fine groove along the inner side) and the down: short pale hairs standing out of the outline */
        E('path',{d:svSpl(Hp.slice(1,8).map(([nx,ny,ww,p])=>[p[0]-nx*ww*.35*sg,p[1]-ny*ww*.35*sg]),false),fill:'none',stroke:mix(body,'#24300c',.5),'stroke-width':svF(Math.max(.1,R0*.005)),'stroke-opacity':.5,'stroke-linecap':'round'},hk);
        if(hi){const rr=svRng(g.sd+x*13);let dh='';for(const E2 of[Lp,Rp])for(let q=1;q<8;q++)for(let z=0;z<3;z++){const p=E2[q],c=Hp[q][3],dx=p[0]-c[0],dy=p[1]-c[1],l=Math.hypot(dx,dy)||1,len=R0*rr.in(.008,.02);
          const x0=p[0]-dx/l*len*.4+rr.in(-1,1)*R0*.01,y0=p[1]-dy/l*len*.4+rr.in(-1,1)*R0*.01;dh+=`M${svF(x0)},${svF(y0)}l${svF(dx/l*len)},${svF(dy/l*len)}`}
          E('path',{d:dh,fill:'none',stroke:felt,'stroke-width':svF(Math.max(.1,R0*.003)),'stroke-opacity':.7,'stroke-linecap':'round'},hk)}}
      /* the crest: a curled flat stigma over the tip, rolled outward */
      const tp=P3[8],dir=V3.nz(V3s(P3[8],P3[6])),o2=V3.nz([t.rd[0],t.rd[1],0]),cr=[];for(let q=0;q<=6;q++){const a=q/6*3.6,rr2=R0*.035*(1-.4*q/6);
        cr.push(PJ(B,O,V3.add(tp,V3.add(V3.sc(dir,Math.sin(a)*rr2),V3.sc(o2,(1-Math.cos(a))*rr2)))))}
      E('path',{d:svSpl(cr.map(p=>[p[0],p[1]]),false),fill:'none',stroke:crest,'stroke-width':svF(Math.max(.4,R0*.022)),'stroke-linecap':'round'},hk);
      E('path',{d:svSpl(cr.map(p=>[p[0]+lt[0]*R0*.005,p[1]+lt[1]*R0*.005]),false),fill:'none',stroke:mix(crest,'#ffd0d8',.35),'stroke-width':svF(Math.max(.2,R0*.008)),'stroke-opacity':.6,'stroke-linecap':'round'},hk)},
      proxy:prox,pmin:1,tube:{P:P3,r0:w(1),r1:w(7),ins:.15}})})}
/* the head: in the frame B at O (Z from the stem to the face), D the open flower's diameter */
function peoHead(par,B,O,D,S,cwx,op,seed,wl){const P=S?Object.assign({},PEO_DBL,S):PEO_DBL,hi=DET>=1.5,R0=D/2,r=svRng(seed||1),W0=typeof WILT!=='undefined'?WILT:null;
  const g={rot:r.in(0,6.2832),sd:Math.floor(r()*1e9),dop:r.in(-.025,.025)},oo=Math.max(.02,Math.min(1,op+g.dop)),wl0=wl||0,
    dec=svSm((wl0-P.dec[0])/P.dec[1]),fan=svSm((wl0-P.fan[0])/P.fan[1]),gt=1-svSm((oo-.12)/.26);
  if(typeof WILT!=='undefined')WILT=null;
  try{const sh=peoShells(P,oo,dec,fan),nG=P.nG[hi?1:0],nH=Math.round(P.nH[hi?1:0]*(oo<.3?.5:1)),ff=svSm((wl0-P.fall[0])/P.fall[1]);
    let L=peoPieces(P,g,oo,nG,nH);if(ff>0)L=L.filter(q=>q.kind==='s'||q.fall>=ff*(1-(q.kind==='g'||q.t<.3?P.keep*2:0)));  /* the last to hang on are guards and outer petaloids */
    peoGeom(P,L,sh,oo,dec,fan,R0);if(typeof SVQA_DBG!=='undefined'&&SVQA_DBG)PEO_LAST={L,sh,P,dec,fan,R0};
    const C=peoCol(cwx),M={g:peoMat(P,C,'g',gt,dec,fan,hi),h:peoMat(P,C,'h',gt*.6,dec,fan,hi),s:peoMat(P,C,'s',0,dec,fan,hi)},pieces=[],det=hi?1.25:.8;
    for(const q of L){const vr=svRng(q.sd+5),vn=q.kind==='s'?svVeins(vr,5,0,.2):svVeins(vr,q.kind==='g'?(hi?16:9):(hi?9:5),hi?.15:0,hi?.35:.2),base=M[q.kind],vc=base.stops[Math.floor(base.stops.length/2)][1],
        K=C[q.kind],vo=K.vo;
      const m=Object.assign({},base,{fineVeins:false,veins:!hi&&q.kind==='h'?null:(s2,front)=>front?[[vn.main,.0016,peoShv(K.vein,.5,gt,dec,fan,q.kind),vo+.15*dec],[vn.fine,.0011,peoShv(K.vein,.5,gt,dec,fan,q.kind),vo*.55]]:[[vn.main,.0016,peoShv(K.bvein,.5,gt,dec,fan,q.kind),vo*.7]]});
      const big=q.kind==='g',nu=Math.round((big?P.gnu:P.nu)[hi?1:0]*(q.kind==='s'?.7:1)),nv=Math.round((big?P.gnv:P.nv)[hi?1:0]*(q.kind==='s'?.7:1)),dz=q.kind==='h'?.45:.3;
      const pc=svSheet(B,O,peoSurf(P,q,sh,R0,dec,fan),{nu,nv,mat:m,ao:(u,v,front)=>front?1-dz*(1-svSm((v-.02)/.4)):1-.2*(1-svSm(v/.25))});pc.wh=q.kind;pieces.push(pc)}
    /* the floor of the heart: the core's surface in the hollow's darkest colour, so that nothing shows through between the innermost
       petaloids (qa:false: it lies under them by design, as the lily's floor) */
    if(ff<.5){const fc=mix(C.h.shade,'#2a0410',.25),fm=Object.assign({},M.h,{stops:[[0,fc],[1,mix(fc,C.h.st[2][1],.35)]],bstops:[[0,fc],[1,fc]],fine:null,grid:null,cross:null,veins:null,transmit:null});
      pieces.push(svSheet(B,O,(u,v)=>{const a=(1-v)*PEO_PSI*.92,th=(u+1)*Math.PI,rr=Math.max(.01,sh.core(a))*.96*R0;return[rr*Math.sin(a)*Math.cos(th),rr*Math.sin(a)*Math.sin(th),sh.H*R0+rr*Math.cos(a)]},{nu:12,nv:8,mat:fm,qa:false,zb:-.004}))}
    peoCarpels(B,O,R0,g,C,oo,fan,pieces,ff);
    return svDraw(par,pieces,{D,pmin:P.pmin,shadow:hi})}
  finally{if(typeof WILT!=='undefined')WILT=W0}}
function peoSvg(par,B,O,D,cwId,op,seed,wl,S){const cwx=(typeof CW_PDBL!=='undefined'&&CW_PDBL.find(x=>x.id===cwId))||{id:cwId};return peoHead(par,B,O,D,S,cwx,op,seed,wl==null?0:wl)}
var SV_HEAD=typeof SV_HEAD!=='undefined'?SV_HEAD:{};SV_HEAD['pivoine-herbacee-double']=peoSvg;
