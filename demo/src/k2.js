/* ---------- model bouquets added after the compiled catalogue (k0.js is never regenerated: its SKU numbers must not move); each one is
   appended to MODELS before the shop numbers and prices them (u1.js). n stays above the reference photographs' numbers (VREF) ---------- */
/* a model element whose colour is exactly one of its species' named colourways takes that very product (its SKU and its variety name)
   instead of an ad-hoc colour; a model may set gar (the little garnish of buds, grasses and berries the composer adds, 0 for none) */
{const pf=prodFor;prodFor=function(sid,col){const L=CWS[sid];if(L&&col){const ci=L.findIndex(w=>w.c===col&&!w.ret);if(ci>=0&&PBY[`${sid}~${ci}`])return PBY[`${sid}~${ci}`]}return pf(sid,col)}}
{const pm=planModel;planModel=function(m){const P=pm(m);if(typeof m.gar==='number')P.gar=m.gar;return P}}
/* « Ronde bleue » : only flowers redrawn in native SVG, in their white and blue colourways (exact colourway colours, so each head
   takes its named variety), in the frosted glass vase with dancers */
MODELS.push({n:1001,nom:'Ronde bleue',occ:['juste','merci','anniv'],tpl:'libre',asp:1.18,vase:'verre-danseuses',vcol:'#d3d3cf',bg:'#e9eef3',plinth:'none',side:1,gar:0,
  notes:'Nos fleurs redessinées, dans leurs coloris blancs et bleus, en ronde autour du vase en verre aux danseuses.',
  els:[
    {id:'cognassier-du-japon',col:'#fbf6f1',n:3,role:'line',pos:'left',h:1,ang:'mixed'},
    {id:'iris-hollandais',col:'#f7f5ee',n:2,role:'line',pos:'left',h:.85,ang:'side'},
    {id:'iris-hollandais',col:'#4a44a8',n:3,role:'line',pos:'around',h:.9,ang:'side'},
    {id:'iris-hollandais',col:'#8a9ad8',n:2,role:'line',pos:'right',h:.75,ang:'side'},
    {id:'anemone-coronaria',col:'#6049c9',n:3,role:'focal',pos:'core',h:.3,ang:'face'},
    {id:'anemone-coronaria',col:'#faf9f5',n:3,role:'focal',pos:'around',h:.35,ang:'face'},
    {id:'viburnum-roseum',col:'#f7f5ee',n:3,role:'focal',pos:'core',h:.25,ang:'face'},
    {id:'tulipe-simple',col:'#f6f3ea',n:3,role:'second',pos:'around',h:.45,ang:'tq'},
    {id:'tulipe-perroquet',col:'#f6f1e2',n:2,role:'second',pos:'right',h:.35,ang:'tq'},
    {id:'renoncule-classique',col:'#f7f3ea',n:3,role:'second',pos:'around',h:.3,ang:'face'},
    {id:'jacinthe',col:'#8a7cb6',n:2,role:'second',pos:'left',h:.3,ang:'mixed'},
    {id:'jacinthe',col:'#5e58aa',n:2,role:'second',pos:'right',h:.3,ang:'mixed'},
    {id:'lilas',col:'#f6f4ec',n:3,role:'second',pos:'left',h:.55,ang:'mixed'},
    {id:'lilas',col:'#a99ad8',n:2,role:'second',pos:'right',h:.5,ang:'mixed'},
    {id:'muscari',col:'#5566c8',n:4,role:'filler',pos:'rim',h:.1,ang:'mixed'},
    {id:'muscari',col:'#8ea6d0',n:3,role:'filler',pos:'around',h:.2,ang:'mixed'},
    {id:'freesia',col:'#e8e6dc',n:2,role:'filler',pos:'around',h:.5,ang:'side'},
    {id:'pois-de-senteur',col:'#f7f3ec',n:2,role:'filler',pos:'around',h:.4,ang:'mixed'},
    {id:'pois-de-senteur',col:'#4a4aa8',n:2,role:'filler',pos:'around',h:.45,ang:'mixed'},
    {id:'narcisse-bouquet',col:'#fbfaf4',n:3,role:'filler',pos:'around',h:.35,ang:'face'},
    {id:'fritillaire-meleagris',col:'#f4f2ee',n:2,role:'accent',pos:'rim',h:.2,ang:'side'}]});
