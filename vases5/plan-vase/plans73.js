/* The plan of every vessel of the catalogue (z7-plan vPlan), as the engine reads it in the page (SVGB measured cavities included), no
   drawing: appended to lab/qa13.html by mkplans.sh; ?plans=1 → <pre id="out"> (one row per vessel, with its profile and cavity for the
   sheet of sections). The flags (which vessels need a measure of their own) are computed from it by plans73.py */
{const Q=new URLSearchParams(location.search);if(Q.get('plans')){const out=[],r1=x=>Math.round(x*10)/10;
  for(const id of Object.keys(VZ)){const v=VZ[id],sb=v.svgb&&typeof SVGB!=='undefined'?SVGB[v.svgb]:null,row={id,n:v.n,fam:v.fam,shape:v.shape,kind:v.kind||null,mat:v.mat,
      vs:v.vs||1,h:r1(v.h||0),mo:r1(v.mo||0),mh:v.mh!=null?r1(v.mh):null,mx:r1(v.mx||0),lipw:v.lipw||0,sil:!!v.sil,m2:!!(v.m2&&v.m2.length),box:!!v.box,ol:!!v.ol,
      cavb:!!(sb&&sb.cavb),cavr:!!(sb&&sb.cavr),inner:!!(sb&&sb.inner),prof:(v.prof||[]).map(p=>[r1(p[0]),r1(p[1])])};
    try{const pl=v.prof?vPlan(v):null;if(pl){const L=pl.land,lc={};for(const q of L.rings)lc[q[1]]=(lc[q[1]]||0)+1;
      Object.assign(row,{src:pl.src,yF:r1(pl.yF),yM:r1(pl.yM),D:r1(pl.D),rM:r1(pl.rM),rE:pl.rE.map(r1),rF:r1(pl.rF),throat:pl.throat.map(r1),pinch:pl.pinch.map(r1),
        edge:pl.edge.map(a=>r1(a/D)),cone:pl.CONE.length,n6:pl.cap.n6,cls:pl.env.cls,fan:r1(pl.env.fan/D),big:r1(pl.env.big),sides:pl.sides,rWide:r1(L.rWide),rFoot:r1(L.rFoot),land:lc,
        rOutAtMouth:r1(profR(v.prof,pl.yM)),cav:pl.cav.filter((_,i)=>i%4===0).map(q=>[r1(q[0]),r1(q[1])]),plan:true})}else row.plan=false}
    catch(e){row.err=String(e).slice(0,140)}
    out.push(row)}
  const pre=document.createElement('pre');pre.id='out';pre.textContent=JSON.stringify(out);document.body.prepend(pre);document.title='PLANS-DONE'}}
