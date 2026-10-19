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
   owner). The guards' grid: fleur/apparence.py piece on two guard petals of the cultivar's named photo (refcache/.../apparence/reperes.json,
   frames checked on look/fc_*.jpg), then grille; cleaned of what is not tissue (a leaf, a cast shadow, a whole shadow band) and, for the
   whites, the camera's tint replaced by the cream of the coloris notes (4.4), the raw grid kept beside it (grille-<cw>-brute.json); the hand
   ramp only below v .15-.3 (hidden under the heart on every photo: gridV). The rings are read inside an ellipse placed by hand on ONE flower of each
   photo (refcache/.../cw/placements.json; owner 2026-10-19: automatic circles were wrong on clusters and on flowers seen aslant). Unmeasured here: noir (no black-red double among the measured cultivars) */
const PEO_FG={amb:.4,dif:.74,sat:.25,ao:.3,chroma:1,tone:1.06,q:3},PEO_FH={amb:.38,dif:.74,sat:.4,ao:.5,chroma:1.04,tone:1.05,q:3};
const PEO_CW={
  /* rose: Sarah Bernhardt (3 flowers, refcache/.../cw/sarah-bernhardt_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'rose':{g:{st:[[0,'#eaa9c4'],[.45,'#e487c1'],[.72,'#e2a5cc'],[1,'#c294a8']],bst:[[0,'#e7acc4'],[.4,'#ebaed3'],[1,'#d5adbf']],shade:'#ba5586',lite:'#f3d6e8',bshade:'#ca789d',blite:'#ffffff',vein:'#cb75a1',bvein:'#e8b7d6',vo:.16,
      grid:{nu:6,nv:24,c:[['#d7b0ad','#d1a0a0','#cc8d92','#e3a3a8','#fd93bc','#ffb0de'],['#dab5b1','#cda09c','#c88e91','#c87f8b','#f48cb7','#e37aa9'],['#d3aaa7','#ca9796','#c7838b','#c57a8c','#c96995','#c97099'],['#cda6a0','#cd999a','#c6868f','#bd8082','#cb868a','#ed79a9'],['#cc8a90','#d1949a','#d28f95','#d19192','#da8b95','#e489ab'],['#c6828b','#cc898f','#d89c9b','#e0a7a5','#e197a3','#e198a8'],['#e577a1','#cc8e92','#d49f9b','#dca9a3','#f68eb8','#d798a5'],['#e6749e','#f178b5','#d1989b','#e980ad','#f396b6','#d09a9f'],['#e46d9d','#ef76b3','#eb78b1','#e67daa','#f097b7','#d29ca1'],['#e86f9f','#e974af','#da6a9f','#eb80ac','#f893b7','#d19ba0'],['#e76ead','#e772ad','#d06596','#e979ad','#f38fbc','#d199a2'],['#e670aa','#e36ba3','#d46698','#e374a8','#e97faf','#d698a4'],['#eb76a2','#d46b9a','#d86a9a','#cd6c99','#cb6e98','#dc88ab'],['#e26da5','#e974aa','#dd72a4','#cc6e9a','#c66e96','#cb739a'],['#f07ba6','#ea76aa','#ea7ca5','#d874a1','#c86e98','#cd779d'],['#ff93b9','#f27faa','#f084ad','#df79a3','#da7ba5','#d582a6'],['#ff9ac0','#fa8bb4','#ed89b1','#de7ba8','#dc7ca5','#d687a9'],['#ff9ac2','#fc8eb5','#f394b8','#e37da5','#dc7da6','#d98eb0'],['#ffa1c4','#fa91b6','#ffadcd','#e581aa','#d483a4','#db90b0'],['#ffb6d6','#fd9bbd','#f49cbf','#e888ad','#db82a4','#d990b0'],['#ffc1e6','#ffbfdf','#fb9ebe','#f695b7','#e98ead','#de91b0'],['#ffc8ed','#ffbbdf','#f598bb','#f9a0bf','#fba3bd','#f6a5bd'],['#ffc4e8','#ec8fb6','#f194ba','#f39abc','#f39bbc','#e59db6'],['#ffc2ea','#ffbee5','#ffa6cb','#ed96b8','#ef99bb','#f5a4c3']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#8a4671'],[.2,'#a35b89'],[.5,'#bc71a1'],[.8,'#d8a3c0'],[.93,'#e4bbd0'],[1,'#ebcbdb']],bst:[[0,'#96587e'],[.3,'#c079a6'],[.6,'#bc71a1'],[.9,'#d8a3c0'],[1,'#ebcbdb']],shade:'#8b2951',lite:'#d8a3c0',bshade:'#a83f6e',blite:'#ffffff',vein:'#9f4770',bvein:'#ca8db3',vo:.18,fine:PEO_FH}},
  /* rouge: Felix Crousse (2 flowers, refcache/.../cw/felix-crousse_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'rouge':{g:{st:[[0,'#d16d68'],[.45,'#b61a3a'],[.72,'#c11d47'],[1,'#d4316d']],bst:[[0,'#d2756f'],[.4,'#d05262'],[1,'#de6982']],shade:'#9a1223',lite:'#eda2a7',bshade:'#b54c49',blite:'#ffffff',vein:'#aa1631',bvein:'#d45768',vo:.16,
      grid:{nu:6,nv:24,c:[['#92232e','#9a2531','#912430','#d04458','#9f242e','#932237'],['#92232e','#9a2531','#912430','#d04458','#9f242e','#932237'],['#9e232f','#9c2631','#942530','#d14359','#a62944','#ae3048'],['#a72632','#9f2633','#972930','#d6425c','#a3252e','#8b1f28'],['#b22a3c','#912129','#8b1f28','#cd3d5b','#a52748','#8b212b'],['#952434','#97242b','#901f29','#d3365a','#ac2736','#8e212d'],['#932337','#9f252f','#9a232e','#cf375d','#ac2635','#9f2639'],['#922239','#a82736','#9d2430','#a0243f','#b22b43','#ac2b4b'],['#96263d','#a8294a','#a22636','#a1273c','#b82c4c','#b92e4c'],['#a12644','#b32c50','#ad2740','#a5273a','#b42940','#bc2d47'],['#a92945','#c9315e','#bb2a4a','#b62b45','#c42e45','#c5304d'],['#a12841','#d13668','#c83357','#c5304f','#c63047','#c9314d'],['#a12634','#a93055','#bb3157','#cf355a','#ca334f','#cc3352'],['#a62835','#aa2d51','#ba2d56','#d73c6e','#cf375c','#ca3356'],['#ad2a38','#b03158','#ba2c4a','#d3437c','#da4074','#ce3862'],['#b62d3d','#b93865','#c43049','#d1427b','#db4487','#d53f71'],['#b92d45','#ba3f6c','#c33466','#d54276','#d94994','#ce4572'],['#ca3254','#c3396d','#d03970','#d23d6b','#dd4780','#cd4775'],['#d2345e','#ca386d','#dc3f79','#dd4777','#d34b81','#cd4c7f'],['#d83d77','#dd3c7c','#e63e84','#de447a','#c93659','#c73b67'],['#e24286','#e94294','#e8418d','#df4179','#db3d73','#d53e73'],['#dc4082','#ed449d','#e94191','#e74889','#e64883','#e14584'],['#e8489a','#ec439c','#f74cab','#f252a2','#e54886','#e0458a'],['#e74799','#e94499','#f24aaa','#f151a2','#e44890','#e04589']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#ab152f'],[.2,'#ac152f'],[.5,'#ae152e'],[.8,'#d5245e'],[.93,'#df3c7d'],[1,'#e44993']],bst:[[0,'#b73741'],[.3,'#b52c39'],[.6,'#ae152e'],[.9,'#d5245e'],[1,'#e44993']],shade:'#7b0c13',lite:'#d5245e',bshade:'#8e0f19',blite:'#ffffff',vein:'#8f101e',bvein:'#c55153',vo:.18,fine:PEO_FH}},
  /* fuchsia: Pamyati Akademika Kurchatova (3 flowers, refcache/.../cw/pamyati-akademika-kurcha_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'fuchsia':{g:{st:[[0,'#f590b6'],[.45,'#f159ac'],[.72,'#ee53ab'],[1,'#d955a0']],bst:[[0,'#f195b8'],[.4,'#f578b6'],[1,'#e886ba']],shade:'#de387f',lite:'#fdb7d9',bshade:'#e96997',blite:'#ffffff',vein:'#e54390',bvein:'#f57bbb',vo:.16,
      grid:{nu:6,nv:24,c:[['#ff92df','#ff92df','#ff97ec','#ff9bf0','#ff63b7','#ff8dd3'],['#ff92df','#ff92df','#ff97ec','#ff9bf0','#ff63b7','#ff8dd3'],['#ff92df','#ff92df','#ff97ec','#ff9bf0','#ff63b7','#ff8dd3'],['#ff9cf0','#ff98ed','#ffa0f5','#ffa0f3','#ff9cf0','#ff6ec1'],['#ffa1ef','#ffa0f6','#ffa1f6','#ffaef7','#ffc5fd','#ff96e7'],['#ffa0f4','#ff9df4','#ff99f2','#ffa0f4','#ffd1ff','#ffb8ff'],['#ff9ef1','#ff95e9','#ff97ee','#ff94ea','#ff9aef','#ff9ee7'],['#feaefa','#ffa3fb','#ffa8ff','#ffb3fe','#ffaef9','#ffaff0'],['#ff84db','#ff89df','#ffa2fd','#ffaeff','#ffafff','#ff99e6'],['#ff85da','#ff82d6','#ff94e9','#ffa1fa','#ff91e2','#ff94df'],['#ff7ed3','#ff7fd2','#ff90e3','#ff9cf6','#ffa1f9','#ffa5ff'],['#ff77cc','#ff88da','#ff8ce3','#ff93e7','#ff98e9','#ffa2fd'],['#ff73c7','#ff89da','#ff94e9','#ff9af5','#ff95f0','#ffa1f7'],['#ff9af0','#ff73c4','#ff98ee','#ff9df3','#ff9af3','#ffa5f7'],['#ff9ef1','#ff9ef1','#ff9df1','#ff9ef1','#ff9bf2','#ffaffd'],['#ffa0f1','#ff73c6','#ff9ae6','#ffa0f3','#ffa5f8','#ffb6ff'],['#ffa4f5','#ffa4f5','#ff9be3','#ffa3f5','#ffa6f7','#ffb5ff'],['#f967be','#ff6ebd','#fe7cc4','#ffa9f8','#ffa2f4','#ffb1fe'],['#f96bbe','#fc70c0','#ef6bbc','#ff9eea','#ffa0f0','#ffbfff'],['#fa70c1','#fb70c1','#f56cbf','#ff88d6','#ff9cec','#ffb4ff'],['#fe7fcd','#fd80cd','#f87ac8','#ff99e0','#ff9ae9','#ffa5f3'],['#ff83d0','#ff90db','#ffa1e5','#ffbbf8','#ff9dee','#ffa2f3'],['#ffaeeb','#fc7ecb','#ff8fd9','#ffaeee','#ffccff','#ffd7ff'],['#fd6cc3','#ff7cd1','#ff94e4','#ff9bea','#ff9df0','#ffb6f5']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#f258ac'],[.2,'#f04ea4'],[.5,'#ee439d'],[.8,'#f8a3e5'],[.93,'#fccdf1'],[1,'#fde9f9']],bst:[[0,'#f56cb4'],[.3,'#f053a3'],[.6,'#ee439d'],[.9,'#f8a3e5'],[1,'#fde9f9']],shade:'#b01840',lite:'#f8a3e5',bshade:'#d5276d',blite:'#ffffff',vein:'#c92a64',bvein:'#f671b0',vo:.18,fine:PEO_FH}},
  /* cerise: Kansas (2 flowers, refcache/.../cw/kansas_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'cerise':{g:{st:[[0,'#e07187'],[.45,'#cd1866'],[.72,'#e42c7c'],[1,'#e72f91']],bst:[[0,'#de7a8c'],[.4,'#e0547b'],[1,'#f272ac']],shade:'#a80b33',lite:'#fbabc2',bshade:'#c04d57',blite:'#ffffff',vein:'#c0194f',bvein:'#ef6495',vo:.16,
      grid:{nu:6,nv:24,c:[['#a22a60','#9b2a60','#902a5c','#992346','#9e2448','#a1254d'],['#a42a62','#972960','#912a5a','#982757','#9c244b','#a0254e'],['#ac2c64','#9e2d5f','#92274a','#8c243f','#7c1b31','#9e254f'],['#9c2b61','#a32a61','#a92a64','#9f285e','#88233e','#a12447'],['#a22760','#a32b61','#a6295c','#a22b58','#b12b62','#b02855'],['#9a2953','#7c1a32','#781a2a','#701420','#b72c63','#bc2d62'],['#8d2341','#7f1b30','#7d1b2b','#791722','#9b2346','#a82551'],['#801d30','#821c2e','#821b2d','#831a25','#801a2b','#951e40'],['#871e34','#871e31','#871d2d','#8a1c26','#941c29','#a1254b'],['#8c2037','#8a1f33','#8a1e2b','#8e1d2b','#921c27','#ad2853'],['#92223b','#912033','#8e1e2e','#901d2b','#981e2d','#c73c6d'],['#98223d','#931f34','#911e30','#951e2e','#9d1f30','#a62036'],['#9e2440','#942135','#941f33','#971f30','#a4223a','#ac2336'],['#a12544','#962137','#972136','#9b2136','#de3566','#b12541'],['#9f2442','#9b223a','#e13c6a','#fe528d','#b32748','#b22643'],['#a22544','#b52951','#ff5594','#b4274c','#b22649','#ce2e52'],['#ab284d','#b02a51','#d8346f','#b32852','#bd2b59','#d12f52'],['#fc4f8e','#b32c58','#c22d64','#b72a57','#bf2d5e','#cd2f58'],['#ff6cc2','#c02e69','#c02e67','#ba2e65','#c0306e','#cc2f5e'],['#ff79cd','#ff73cc','#cf3378','#bc2f6a','#c0306e','#ca3064'],['#ff7fdd','#ff7bd4','#f453a3','#bd2f6d','#c33474','#cb3169'],['#ff83e5','#ff7edb','#eb499c','#c13170','#c43579','#c9316c'],['#ff83e6','#ff7fe3','#df3e92','#c23273','#c5357c','#c73063'],['#ff83ec','#ff7ee6','#e53f94','#c23376','#c33479','#c62e5d']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#ca164a'],[.2,'#cc144e'],[.5,'#cd1252'],[.8,'#f43aa3'],[.93,'#f753ba'],[1,'#f961ca']],bst:[[0,'#d33c5a'],[.3,'#d22f5b'],[.6,'#cd1252'],[.9,'#f43aa3'],[1,'#f961ca']],shade:'#7e0511',lite:'#f43aa3',bshade:'#98061d',blite:'#ffffff',vein:'#9d092a',bvein:'#dd5671',vo:.18,fine:PEO_FH}},
  /* bordeaux: Mons. Martin Cahuzac (3 flowers, refcache/.../cw/mons-martin-cahuzac_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'bordeaux':{g:{st:[[0,'#cc6b5b'],[.45,'#ad1c28'],[.72,'#b1182e'],[1,'#b31a35']],bst:[[0,'#cd7463'],[.4,'#c54d4c'],[1,'#cc5e5f']],shade:'#8e0f18',lite:'#e79f9a',bshade:'#ab4840',blite:'#ffffff',vein:'#9c1321',bvein:'#c75253',vo:.16,
      grid:{nu:6,nv:24,c:[['#981d1d','#9c1d20','#a72026','#a92227','#a2313c','#b75273'],['#881b1a','#751819','#8f2d28','#9c2835','#a03041','#a53445'],['#7b191b','#71181b','#852828','#912631','#952b39','#9d2e3c'],['#6f181c','#6d191e','#7c2327','#87242e','#892631','#962934'],['#63161c','#691920','#721e27','#7c222a','#7e2129','#8e232b'],['#6f1c21','#671720','#741e29','#7c232b','#7a1e27','#84232d'],['#791e25','#711922','#751a27','#7f242f','#7d1f28','#802029'],['#7e2025','#771e28','#771f2a','#7e222c','#7d202a','#87252f'],['#88222a','#80212a','#81242c','#7e2029','#82222b','#932c36'],['#8d222b','#892231','#892530','#832130','#86222c','#942c38'],['#b92f3e','#962738','#932735','#902734','#8c2431','#9b2c3a'],['#d74356','#aa2c44','#972536','#912332','#8f2533','#9f313f'],['#d34860','#a0263b','#98232e','#92232e','#8f2330','#9c2d39'],['#bf3a52','#9e2638','#982434','#94212b','#90222e','#9b2a37'],['#ab2e41','#972435','#942332','#93202e','#902130','#9b2a35'],['#b32f3f','#9e2632','#932130','#911f2d','#952437','#a1334c'],['#af2c3b','#a22535','#90202f','#942335','#9a3348','#a43a56'],['#b72f3d','#a22742','#9c2336','#9e2943','#9e3852','#a43955'],['#b52d3a','#9e2434','#9d253b','#9c364d','#a03853','#a23753'],['#b52d38','#a62533','#a32431','#a92c3d','#9f3753','#a23753'],['#b52b36','#a72430','#a62631','#9e3852','#a03853','#a33955'],['#b62a33','#a82634','#af262f','#9d384e','#9d3752','#a23855'],['#ae262e','#af262c','#b3272e','#a4272c','#933244','#98384c'],['#af262d','#ae252a','#b0252c','#a0232b','#922a3b','#8b2d3b']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#a61828'],[.2,'#a51524'],[.5,'#a31120'],[.8,'#d52757'],[.93,'#e34a7a'],[1,'#ec5e92']],bst:[[0,'#b3383a'],[.3,'#ab282b'],[.6,'#a31120'],[.9,'#d52757'],[1,'#ec5e92']],shade:'#740910',lite:'#d52757',bshade:'#810912',blite:'#ffffff',vein:'#860c16',bvein:'#bc4d47',vo:.18,fine:PEO_FH}},
  /* vieux-rose: Madame Calot (2 flowers, refcache/.../cw/madame-calot_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'vieux-rose':{g:{st:[[0,'#ebd4cc'],[.45,'#e7cbce'],[.72,'#dfced1'],[1,'#cfc8c8']],bst:[[0,'#e8d3cc'],[.4,'#e7d7d9'],[1,'#ddd6d6']],shade:'#d6b0b1',lite:'#f1e9ea',bshade:'#dfbfc0',blite:'#ffffff',vein:'#dabcbe',bvein:'#e5d8da',vo:.16,
      grid:{nu:6,nv:24,c:[['#e0adb9','#e1aeba','#e8b8c2','#f6e9e9','#f5d3d9','#ebced5'],['#ffdce6','#ffe7f1','#ffe9f2','#f4eae9','#ffecf4','#ffedf5'],['#ffe7ee','#ffe8f3','#ffe7f0','#f9ebeb','#ffedf3','#ffeff8'],['#ffeaf3','#ffe8f3','#ffe6f0','#ffe3ec','#f9edee','#ffebf3'],['#f6ebec','#f7edee','#ffe8f1','#ffe8ee','#fbe2e6','#f3e8e9'],['#ffe4e9','#f5ebec','#ffeaf3','#fde7f0','#f6e1e5','#f2dce1'],['#f9e3e8','#f8e6e9','#feeaef','#f7e6eb','#eedde3','#e6d9e0'],['#ece1e3','#efe2e4','#f2e5e7','#efe6e7','#e8e3e3','#ffdee5'],['#e3dadb','#e1dbdc','#ded5d8','#e2dadc','#e2c1ca','#e8e0e2'],['#e4d8da','#e3d9db','#e0d4d8','#e4d8db','#e3c3cb','#e8dddf'],['#e6d6d9','#e4d7da','#e3d4d8','#e6d7da','#e4c6cd','#e8d9dc'],['#e7d5d8','#e6d5d9','#e5d3d9','#e8d5d9','#e5c8ce','#e8d6da'],['#e9d3d7','#e7d3d8','#e8d3d9','#ead4d8','#e6cbd0','#e8d2d7'],['#ead1d6','#e9d1d7','#ead2d9','#ecd2d7','#e7cdd1','#e8cfd4'],['#e9d9db','#e1d6d8','#e7d7da','#e8d5db','#ead5d9','#ebd8dc'],['#e4d5d8','#e7dcdd','#e7ddde','#e1dadb','#e6d6da','#ddcad0'],['#e3d9da','#e7dbdd','#e4dedf','#e1dadb','#dcd2d4','#d7c5ca'],['#e3dedc','#ded6d7','#dfd7d6','#ddd9d9','#d5d5d4','#c0bdbc'],['#d6d0d2','#d8d3d4','#d3cdce','#cec9ca','#d3cacd','#c6c8c7'],['#d3cdcf','#d5cfd0','#d1cbcc','#ccc6c7','#d1c9cc','#ccc6c8'],['#d0c9cc','#d1cacd','#cfc8cb','#cac3c5','#d0c8cb','#d1c5c8'],['#cec6c9','#cec6c9','#cec6c9','#c8c0c2','#cec7ca','#d7c3c9'],['#d8cecf','#d8cecf','#d8cecf','#cbc1c1','#dad1d2','#deccd2'],['#d2cbcc','#c5b5b8','#c5c1c2','#d3cbc9','#e3d3d6','#dbd8d7']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#e0c2be'],[.2,'#e1c2c0'],[.5,'#e1c3c3'],[.8,'#f1dddc'],[.93,'#f5e4e1'],[1,'#f8e9e4']],bst:[[0,'#e3c8c4'],[.3,'#e3c7c7'],[.6,'#e1c3c3'],[.9,'#f1dddc'],[1,'#f8e9e4']],shade:'#c38e8a',lite:'#f1dddc',bshade:'#cea4a5',blite:'#ffffff',vein:'#cfa3a0',bvein:'#e7cfcf',vo:.18,fine:PEO_FH}},
  /* lilas: Mons. Jules Elie (3 flowers, refcache/.../cw/mons-jules-elie_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'lilas':{g:{st:[[0,'#e28eb0'],[.45,'#d55ba3'],[.72,'#e386c4'],[1,'#e58ac6']],bst:[[0,'#e093b2'],[.4,'#da89bc'],[1,'#efaad6']],shade:'#b0457e',lite:'#f5c9e4',bshade:'#c26c96',blite:'#ffffff',vein:'#c55f99',bvein:'#ea9fd0',vo:.16,
      grid:{nu:6,nv:24,c:[['#ae7da8','#a9729f','#bb8eb3','#b791b4','#b88bb6','#b489b2'],['#ac78a4','#a86d9d','#b281a9','#b889b1','#bd90bb','#ba92bb'],['#aa6ea1','#a9679d','#aa7aa4','#b87eab','#b78cb3','#bd95be'],['#ac6da1','#ad6da3','#b477ae','#b97eaf','#bf89b4','#be97bd'],['#ad6fa9','#af71a5','#b37bad','#bb81af','#b98ab5','#bc99c1'],['#b478b2','#ba7db6','#b87cb0','#ba83ba','#b789bb','#c19dc6'],['#b97db8','#bc7fb6','#ba81b7','#b882b9','#b681b8','#bf9ac5'],['#bc7ebe','#bb7fb8','#ba82b6','#b986bb','#b781b8','#b080ae'],['#be80bf','#bc80b9','#bb82ba','#ba86bf','#b781b8','#a16b9d'],['#c183c3','#bb88ba','#bc81bc','#bc86c0','#b880b8','#a671a2'],['#c384c8','#ca9bcc','#be81c0','#be86c1','#b880ba','#ab79a9'],['#c586ca','#cca1cf','#dcbce4','#c087c5','#b67eb8','#b280b0'],['#cc93cb','#d592cc','#dca2db','#c38ac8','#b880ba','#b381b3'],['#cb8cd1','#c997ca','#cca4d2','#c28bc8','#b984bd','#b481b2'],['#cc8fd2','#ce8ad2','#cc93d5','#c183c4','#be89c2','#b685b6'],['#d18ad4','#d08ad3','#d294d8','#c183c3','#bf8bc4','#b787b9'],['#d088d3','#d08ad3','#c382c6','#c285c6','#c38ec6','#b98dbf'],['#d188d3','#ca85cd','#c481c6','#c588c9','#c18fc8','#ba8fc0'],['#d188d3','#ce86d0','#c684c9','#c689ca','#c292ca','#bd95c5'],['#d389d4','#cf86d1','#c484c8','#c588c8','#c392c9','#be97c9'],['#d48ad6','#cf86d0','#c985cd','#c789cc','#c993cc','#c39acd'],['#d58cd7','#cc87cf','#c987cf','#ca8bcf','#c694cd','#c59cce'],['#d48dd7','#d088d2','#c989cf','#ca8bcf','#c793d0','#c79cd2'],['#d58fd9','#d089d3','#c786cd','#c689cc','#c591cd','#c097cc']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#ad6297'],[.2,'#b8659b'],[.5,'#c467a0'],[.8,'#ef98d4'],[.93,'#eab6e4'],[1,'#e6c9ef']],bst:[[0,'#b672a1'],[.3,'#c870a5'],[.6,'#c467a0'],[.9,'#ef98d4'],[1,'#e6c9ef']],shade:'#881f48',lite:'#ef98d4',bshade:'#a13c6e',blite:'#ffffff',vein:'#a13d6a',bvein:'#d186b2',vo:.18,fine:PEO_FH}},
  /* framboise: Cincinnati (3 flowers, refcache/.../cw/cincinnati_k.jpg, an ellipse placed by hand on one flower each: guards from .5 to .96 of it, the heart in its own circle) */
  'framboise':{g:{st:[[0,'#ca96a5'],[.45,'#b36c92'],[.72,'#be80a8'],[1,'#ae769b']],bst:[[0,'#c99aa7'],[.4,'#c691b0'],[1,'#c6a0b8']],shade:'#a74176',lite:'#e3c5d7',bshade:'#bb6890',blite:'#ffffff',vein:'#b15b8a',bvein:'#cc99b9',vo:.16,
      grid:{nu:6,nv:24,c:[['#b76d99','#be6c9e','#cc579a','#e445a5','#d8408f','#d05b9c'],['#dc3c9d','#dc3c93','#dc3f9b','#e346a6','#e94daf','#dd4496'],['#dd3b9b','#da3d9a','#d93e97','#de41a1','#e456ab','#e852af'],['#e03c9e','#e03e9f','#d93e9c','#d83c9e','#ca67b0','#e652b9'],['#e33d9f','#de3d9d','#db3d9f','#c962ab','#d55bb0','#dc57b9'],['#e63fa4','#db3b9b','#cc4f9e','#c467bf','#df4baf','#d24bae'],['#e941aa','#d93d9e','#da3c9d','#db3ea2','#dd49ad','#d74cb0'],['#e941a6','#e342a7','#dc3fa0','#df44a7','#dd49ac','#d344a7'],['#eb43aa','#e644a9','#dc3ea1','#db42a7','#de49ad','#dd4eb0'],['#ea44ab','#e443a8','#de3fa2','#de45aa','#d848ac','#d647aa'],['#e945ac','#e242a6','#db3fa1','#da45a9','#d647ab','#d448aa'],['#e845ac','#e345aa','#da3fa2','#d443a7','#d54bae','#d24eac'],['#e444a9','#e548ae','#dc42a5','#d548ae','#d350b3','#cf56b2'],['#e749ae','#e648ae','#dc44a7','#d14cae','#d156b4','#d05db6'],['#e44aaf','#e547ad','#e047ab','#ca4bab','#cd56b1','#ce5cb5'],['#eb49b0','#e94ab0','#de48ab','#cb4fae','#cc58b3','#cd5fb6'],['#ec4cb2','#eb4eb5','#e84fb5','#cd50ac','#ce56b0','#cf5eb3'],['#ee4eb4','#ed52b9','#ea56ba','#d451b0','#cc55af','#cf61b6'],['#f052b6','#ef56b9','#e958ba','#ce57b1','#cb58b0','#cf62b6'],['#f356b9','#f058ba','#eb5aba','#d859b4','#ce5cb2','#d265b8'],['#f558bc','#f659bd','#eb5ab8','#dc5bb8','#cf5db3','#ce64b2'],['#f75ec1','#fa5fc0','#ec5bb8','#e55cba','#d55fb6','#d26db7'],['#fd6ac8','#f964c4','#f163c0','#e75cb9','#df66bc','#dc74bb'],['#f681d0','#ec68c0','#f76ac6','#dd5cb8','#e364be','#de6eb6']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#a0768e'],[.2,'#a96a93'],[.5,'#b15c97'],[.8,'#dfc1d6'],[.93,'#f1e2ed'],[1,'#fdf9fd']],bst:[[0,'#a98399'],[.3,'#b6669d'],[.6,'#b15c97'],[.9,'#dfc1d6'],[1,'#fdf9fd']],shade:'#831642',lite:'#dfc1d6',bshade:'#a12b6b',blite:'#ffffff',vein:'#963563',bvein:'#c27dab',vo:.18,fine:PEO_FH}},
  /* blanc: Duchesse de Nemours, blush: Shirley Temple. Whites (BONNES-PRATIQUES 4.4): the cameras gave them grey-green; their relative
     lightness is kept from the rings (Duchesse: the heart a little darker and warmer than the guards, a cream-yellow centre; Shirley Temple:
     guards and heart alike, the centre faintly cream), the tint from the coloris notes; shadows warm (3.7) */
  blanc:{g:{st:[[0,'#e8e2c4'],[.3,'#f4f1e6'],[.7,'#f8f6ee'],[1,'#fbfaf4']],bst:[[0,'#e4e0c4'],[.4,'#f2f0e6'],[1,'#f8f6ee']],shade:'#b09478',lite:'#ffffff',bshade:'#b4a888',blite:'#ffffff',
      vein:'#ddd6bc',bvein:'#e8e4d2',vo:.12,
      grid:{nu:6,nv:24,c:[['#dddace','#dedbcf','#d4d1c6','#d7d4c8','#e3e0d4','#e3e0d5'],['#dfdcd0','#dfdcd1','#e1ded2','#e1ded2','#e2dfd3','#e4e1d5'],['#d9d6cb','#e1ded2','#d5d2c6','#d5d2c7','#e0ddd1','#e4e1d5'],['#dad7cc','#e0ddd1','#e0ddd1','#dddace','#e0ddd1','#e3e0d4'],['#e6e3d7','#e3e0d4','#e1ded2','#dcd9cd','#dbd8cc','#e1ded2'],['#e4e1d5','#e7e4d8','#e0ddd1','#e3e0d4','#dcd9cd','#e3e0d4'],['#e0ded2','#e2dfd4','#dad7cb','#e0ded2','#d8d5ca','#e2dfd3'],['#e0ddd2','#e2dfd3','#dbd8cc','#e0ddd1','#dcd9cd','#e0ddd1'],['#e3e0d4','#e1ded2','#dfdcd0','#d7d4c9','#d9d6cb','#e0ddd1'],['#e4e2d6','#e1ded2','#e1ded3','#dcd9cd','#dddace','#e2dfd3'],['#e6e3d7','#e3e0d4','#e5e2d6','#dfdcd0','#e1ded2','#e4e1d5'],['#eae7db','#e8e5d9','#e8e5d9','#e2dfd3','#e2dfd3','#e5e3d7'],['#faf7eb','#eae7db','#f1eee2','#e4e1d5','#e2dfd3','#e6e3d7'],['#faf7eb','#f3f0e4','#e7e4d8','#dfdcd0','#e4e1d5','#e8e5d9'],['#f9f6ea','#ebe8dc','#ebe8dc','#ebe8dc','#e7e4d8','#eae7db'],['#dcd9cd','#dad7cb','#dcd9cd','#e1ded2','#ebe8dc','#ece9dd'],['#e0ddd1','#dedbcf','#dfdcd1','#e9e6db','#efece0','#efece0'],['#ebe8dc','#f0ede1','#f0ede1','#f0ede1','#f1eee2','#f1eee3'],['#f1eee2','#edeadf','#ece9dd','#f2efe3','#f4f1e5','#f5f2e7'],['#f6f3e7','#f4f1e5','#fdfaee','#fbf8ec','#faf7eb','#f7f4e8'],['#f9f6ea','#fcf9ed','#fdfaee','#fcf9ed','#fcf9ed','#f8f5e9'],['#fcf9ed','#fcf9ed','#fefbef','#f9f6ea','#faf7eb','#f8f5e9'],['#f9f6ea','#f9f6ea','#f9f6ea','#fcf9ed','#fcf9ed','#faf7eb'],['#fefbef','#fffcf0','#fefbef','#fdfaee','#fbf8ec','#fbf8ec']]},gridV:[.15,.3],fine:PEO_FG},
    h:{st:[[0,'#e6d48e'],[.2,'#efe2b2'],[.5,'#f3ebd2'],[.8,'#f8f4e6'],[1,'#fcfaf2']],bst:[[0,'#eadca6'],[.4,'#f2ead4'],[1,'#faf7ee']],shade:'#b4906a',lite:'#ffffff',bshade:'#bea080',blite:'#ffffff',
      vein:'#d8ccaa',bvein:'#e8e0c8',vo:.12,fine:PEO_FH}},
  blush:{g:{st:[[0,'#ece0cc'],[.3,'#f6efe8'],[.7,'#f8f3ee'],[1,'#fbf8f4']],bst:[[0,'#e8dece'],[.4,'#f4eee8'],[1,'#f9f5f1']],shade:'#a89484',lite:'#ffffff',bshade:'#b4a494',blite:'#ffffff',
      vein:'#e0d4c8',bvein:'#ece4dc',vo:.12,
      grid:{nu:6,nv:24,c:[['#fffcf8','#fffcf8','#fffbf7','#fffbf7','#f9f4f0','#ede8e4'],['#fffbf7','#f2ede9','#ece7e3','#fdf8f4','#f4efeb','#ece7e3'],['#faf5f1','#f0ebe7','#f3eeea','#f7f2ee','#f2ede9','#ebe6e2'],['#f9f4f0','#efeae6','#f3eeea','#f3eeea','#ece7e3','#eae5e1'],['#f9f4f0','#e7e2de','#ede8e4','#eae5e1','#eae5e1','#f6f1ed'],['#ebe6e2','#f1ece8','#ddd8d4','#d8d3cf','#e2ddd9','#faf5f1'],['#b8b4b0','#e5e0dc','#d4cfcb','#c9c4c1','#d6d1cd','#d4cfcb'],['#d6d1cd','#ede8e4','#dad5d1','#ccc7c4','#f4efeb','#c9c4c0'],['#d9d4d0','#e0dbd7','#d5d0cc','#c9c4c0','#dad5d1','#d9d4d0'],['#d5d0cc','#d9d4d0','#d5d0cc','#c7c3bf','#d7d2cf','#d5d0cc'],['#bcb7b3','#ded9d5','#c6c1bd','#b8b3af','#c4bfbc','#e8e3e0'],['#b4afab','#d0cbc8','#dad5d1','#b6b1ad','#c0bbb7','#e6e2de'],['#c1bdb9','#c0bbb8','#cac5c1','#b6b1ad','#c1bdb9','#e4dfdb'],['#c3bebb','#bcb7b3','#c3bebb','#bdb9b5','#c8c3bf','#e3deda'],['#c5c0bd','#cec9c5','#cfcac6','#c4bfbc','#e0dbd7','#d6d1cd'],['#c5c0bc','#cec9c5','#d5d0cc','#ccc8c4','#d7d2ce','#c0bbb7'],['#bdb9b5','#cac6c2','#d5d0cc','#d7d3cf','#d8d3cf','#c3beba'],['#bfbab7','#c8c4c0','#ccc8c4','#d7d2ce','#d9d4d1','#d6d1cd'],['#c0bbb7','#ccc8c4','#c9c5c1','#cfcac6','#dcd7d3','#cdc9c5'],['#bdb8b4','#cac6c2','#ccc7c4','#cbc7c3','#d7d2ce','#cbc7c3'],['#c1bcb8','#c3beba','#ccc7c3','#c7c2be','#d2cdc9','#c7c2be'],['#c7c2bf','#c4bfbc','#c3bfbb','#c2bdba','#d3ceca','#cac6c2'],['#cbc6c3','#cbc6c3','#bbb6b2','#cbc6c3','#c4c0bc','#cbc6c3'],['#c1bcb8','#c7c2be','#c1bcb8','#bdb8b4','#b4b0ac','#c1bcb8']]},gridV:[.15,.3],fine:PEO_FG},
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
