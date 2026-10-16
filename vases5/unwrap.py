# The vessel's surface unrolled flat around its axis: for each (turn angle, height) the radius of the outermost surface of the
# model, rendered on the GPU from the mesh itself. Relief, edges and decor are then read on the model's own geometry, without
# perspective, foreshortening or hidden parts, and every view gets its labels back through its position map.
#   .venv-depth/Scripts/python unwrap.py <vase> [W=4096 H=2048]  ->  <vase>/out/unwrap_r.npy (radius, model units; 0 = no surface)
import sys, os, json
import numpy as np, moderngl
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import glbkit  # noqa: E402

VS = '''#version 330
in vec3 pos;
out float vr; out float vth;
uniform float off;
void main(){ float th = atan(pos.z, pos.x); th = th + off; if (th > 3.14159265) th -= 6.2831853;
  vr = length(pos.xz); vth = th;
  gl_Position = vec4(th / 3.14159265, pos.y * 2.0 - 1.0, 1.0 - vr, 1.0); }'''
GS = '''#version 330
layout(triangles) in; layout(triangle_strip, max_vertices = 3) out;
in float vr[]; in float vth[]; out float gr;
void main(){ float a = vth[0], b = vth[1], c = vth[2];
  if (max(max(a, b), c) - min(min(a, b), c) > 3.0) return;          /* a triangle across the seam: drawn by the other pass */
  for (int i = 0; i < 3; i++) { gr = vr[i]; gl_Position = gl_in[i].gl_Position; EmitVertex(); } EndPrimitive(); }'''
FS = '''#version 330
in float gr; out vec4 o;
void main(){ o = vec4(gr, 0.0, 0.0, 1.0); }'''


def unwrap(vase, W=4096, H=2048):
    out = os.path.join(HERE, vase, 'out')
    m = glbkit.Model(os.path.join(out, 'model.glb'))
    ctx = moderngl.create_standalone_context()
    prog = ctx.program(vertex_shader=VS, geometry_shader=GS, fragment_shader=FS)
    vao = ctx.vertex_array(prog, [(ctx.buffer(m.v.astype('f4').tobytes()), '3f', 'pos')], ctx.buffer(m.f.astype('i4').tobytes()))
    fbo = ctx.framebuffer(ctx.texture((W, H), 4, dtype='f4'), ctx.depth_renderbuffer((W, H)))
    fbo.use(); ctx.enable(moderngl.DEPTH_TEST)           # depth = 1 - r: the outermost surface wins (the outside, not the neck's inside)
    res = []
    for off in (0.0, 3.14159265):                         # two passes shifted by half a turn: the seam of one is the middle of the other
        fbo.clear(0, 0, 0, 0)
        prog['off'].value = off
        vao.render()
        a = np.frombuffer(fbo.color_attachments[0].read(), np.float32).reshape(H, W, 4)[::-1, :, 0].copy()
        res.append(a)
    a0, a1 = res
    a1 = np.roll(a1, -W // 2, axis=1)                     # back to the first pass's angles
    r = np.maximum(a0, a1)
    np.save(os.path.join(out, 'unwrap_r.npy'), r.astype(np.float32))
    json.dump(dict(W=W, H=H, theta='atan2(z, x), -pi..pi left to right', h='model height 0..1, top row = 1'), open(os.path.join(out, 'unwrap.json'), 'w'))
    print('unwrap', W, H, 'covered %.1f %%' % (100 * (r > 0).mean()))


if __name__ == '__main__':
    kw = dict(a.split('=') for a in sys.argv[2:] if '=' in a)
    unwrap(sys.argv[1], int(kw.get('W', 4096)), int(kw.get('H', 2048)))
