import {test} from 'node:test';
import assert from 'node:assert/strict';
import {placeStem} from '../../engine/stem-placement.ts';
const frame={base:[200,700],width:300,mouth:35,bounds:[0,0,500,800]};
test('retouching one stem preserves all neighbours, the original pose and the camera',()=>{
  const stems=[{kind:'head',x:100,y:400,z:.8,rr:25,ax:[0,1,.8]},
    {kind:'head',x:300,y:450,z:.6,rr:20,ax:[.1,.9,.6]}];
  const before=JSON.stringify({stems,frame});
  const moved=placeStem(stems[0]!,.5,-.6,frame);
  assert.equal(moved.x,282.5);assert.equal(moved.y,stems[0]!.y);assert.equal(moved.z,-.09999999999999998);
  assert.equal(moved.back,true);assert.equal(JSON.stringify({stems,frame}),before);
  const back=placeStem(stems[0]!,0,0,frame);assert.equal(back.x,200);assert.equal(back.y,400);
});
test('a bent stem keeps its foot fixed and a hanging stem stays on the mouth',()=>{
  const spine=[[0,0],[2,-40],[15,-80],[30,-120]],stem={kind:'self',x:200,y:700,z:.1,spine};
  const moved=placeStem(stem,.7,.5,frame);assert.deepEqual((moved.spine as number[][])[0],spine[0]);
  assert.equal(moved.ex,315.5);assert.equal(moved.ey,580);assert.deepEqual(stem.spine,spine);
  const hanging=placeStem({kind:'drape',x:200,y:698,z:2,sway:35},1,-.2,frame);
  assert.equal(hanging.x,228);assert.equal(hanging.y,698);
  assert.throws(()=>placeStem(stem,NaN,0,frame));
});
