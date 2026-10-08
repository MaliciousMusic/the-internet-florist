const BQ=[
 ["Je t'aime · coupe",['anthurium-bordeaux','rose-bordeaux','calla-noir','amarante-bordeaux','oeillet-bordeaux','scabieuse-noire','phalaenopsis-prune'],'amour','coupe-blanche'],
 ['Anniversaire · boule',['anthurium-saumon','rose-peche','dahlia-peche','renoncule-saumon','nerine-corail','cymbidium-cuivre','calla-peche','herbe-ours'],'anniv','boule-chocolat'],
 ['Merci · verre',['lys-casablanca','phalaenopsis-blanc','rose-ivoire','renoncule-blanche','delphinium-blanc','calla-ivoire'],'merci','verre'],
 ['Félicitations · noué',['gloriosa','anthurium-rouge','renoncule-rouge','lys-tigre','renoncule-orange','allium-boucle','amarante-corail'],'bravo','noue'],
 ['Courage · calice',['rose-blush','dahlia-cafe','oeillet-poudre','pois-rose','renoncule-rose','anthurium-rose'],'courage','calice'],
 ['Juste comme ça · kenzan',['phalaenopsis-magenta','chrysantheme-mauve','allium-violet','scabieuse-lavande','pois-lavande','delphinium-bleu'],'juste','kenzan'],
 ['Mono anthurium · urne',['anthurium-noir'],'amour','urne'],['Papier · vert',['anthurium-vert','cymbidium-vert','calla-verte','renoncule-blanche','herbe-ours'],'anniv','papier']];
window.LAB=BQ.map(([n,ids,occ,vid],i)=>[n,'0 0 100 100',s=>{const c=buildBq(s,ids,11+i*7,vid,0,occ);s.closest('.c').querySelector('b').textContent=n+' · '+c.tk+' · '+s.dataset.n+' tiges'}]);
