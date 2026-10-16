"""A single sculptural SVG study: wrapped leaf surfaces, relief veins and light."""
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_tests' / 'reprise'
OUT.mkdir(exist_ok=True)
PI = math.pi
SIN, COS, EXP, SQRT = math.sin, math.cos, math.exp, math.sqrt
faces = []


def unit(v):
    norm = SQRT(sum(a * a for a in v)) or 1
    return tuple(a / norm for a in v)


def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])


def minus(a, b):
    return tuple(x-y for x,y in zip(a,b))


def dot(a, b):
    return sum(x*y for x,y in zip(a,b))


LIGHT = unit((-.56, .7, .58))
HALF = unit((LIGHT[0], LIGHT[1] + .16, LIGHT[2] + 1))


def radius(y):
    return 236 * SQRT(max(.015, 1-(y/378)**2))


def project(p):
    x, y, z = p
    return (400 + x, 542 - y + z * .17, z + y * .17)


def color(point, normal, albedo, grain, relief=0):
    nx, ny, nz = normal
    diffuse = max(0, dot(normal, LIGHT))
    shine = max(0, dot(normal, HALF))**28
    scatter = .14 * (1-max(0,nz))**.8
    ambient = .29 + .09 * (ny + 1)
    brightness = ambient + .7 * diffuse
    # Soft upper fill and an edge glow imitate satin, partially translucent glass.
    raw = [value*brightness + 103*shine + 90*scatter + grain for value in albedo]
    return '#'+''.join(f'{max(0,min(255,round(v))):02x}' for v in raw)


def add_surface(fn, nu, nv, albedo, noise=.7):
    grid = [[fn(-1+2*u/nu, -1+2*v/nv) for u in range(nu+1)] for v in range(nv+1)]
    for v in range(nv):
        for u in range(nu):
            p0, p1 = grid[v][u], grid[v][u+1]
            p2, p3 = grid[v+1][u+1], grid[v+1][u]
            middle = tuple((a+b+c+d)/4 for a,b,c,d in zip(p0,p1,p2,p3))
            normal = unit(cross(minus(p1,p0), minus(p3,p0)))
            if normal[2] < -.02:
                continue
            normal = unit((normal[0], normal[1], max(.001,normal[2])))
            texture = noise * SIN(middle[0]*2.03+middle[1]*3.17) * COS(middle[1]*.91-middle[2]*1.13)
            fill = color(middle, normal, albedo, texture)
            vertices = [project(p) for p in (p0,p1,p2,p3)]
            if any(not math.isfinite(a) for p in vertices for a in p):
                continue
            coords = ' '.join(f'{p[0]:.2f},{p[1]:.2f}' for p in vertices)
            faces.append((sum(p[2] for p in vertices)/4, f'<polygon points="{coords}" fill="{fill}" stroke="{fill}" stroke-width=".35" stroke-linejoin="round"/>'))


def body(u, v):
    theta = u * PI/2
    y = -328 + (v+1)*306.5
    r = radius(y)
    # A restrained uneven surface replaces the perfectly smooth gradient from v1.
    bump = .7*SIN(theta*31+y*.06)*COS(y*.09)
    return ((r+bump)*SIN(theta), y, (r+bump)*COS(theta))


def blade(theta0, center, length, width, tilt, layer, phase):
    tilt = tilt * PI / 180
    def surface(t, s):
        lobes = .83 + .17 * COS(s*PI*6.6 + phase)
        shape = max(.001,1-s*s)**.62
        w = width * shape * lobes
        bend = 15*SIN(s*2.4+phase) * (1-s*s)
        x = t*w + bend
        y = s*length
        world_y = center + y*COS(tilt) - x*SIN(tilt)
        world_y = max(-357,min(367,world_y))
        around = theta0 + (x*COS(tilt)+y*SIN(tilt))/236
        base = radius(world_y)
        # Broad lamina curvature, curling scallops and a central raised vein.
        h = layer + 9*(1-t*t)*(1-s*s)
        h += 13*abs(t)**7*(.55+.45*SIN(s*21+phase))
        h += 8*EXP(-t*t*250)*(1-s*s)**.3
        # Secondary veins rise diagonally from the central rib to alternating lobes.
        for start in (-.79,-.54,-.29,-.04,.21,.46,.71):
            shift = .27*abs(t) + .02*SIN(t*5+phase)
            h += 4.4*EXP(-((s-start-shift)*72)**2)*(1-abs(t)**2)
            # Smaller branches and nearby concavities give actual surface normals.
            h -= 1.1*EXP(-((s-start-shift-.035)*36)**2)*(1-abs(t))
        h += .3*SIN(t*91+s*77+phase)*COS(s*37-t*29)
        h *= max(.06,shape)
        return ((base+h)*SIN(around), world_y, (base+h)*COS(around))
    return surface


add_surface(body, 90, 144, (77,135,68), .8)
LAYERS = [
    (-1.10, 28, 288, 105, -9, 13, .3),
    (1.15, 49, 290, 101, 11, 12, 1.2),
    (.18, 145, 195, 96, -9, 13, 2.3),
    (-.56, -8, 316, 117, -14, 24, .7),
    (.63, 18, 302, 107, 14, 25, 1.1),
    (-.15, -205, 150, 82, -8, 37, .15),
]
for theta, center, length, width, tilt, layer, phase in LAYERS:
    add_surface(blade(theta,center,length,width,tilt,layer,phase), 50, 174, (113,186,88), .9)

# A slim irregular inner lip sits behind the projecting upper leaves.
opening = '<ellipse cx="400" cy="278" rx="139" ry="25" fill="#203e21"/><ellipse cx="400" cy="276" rx="131" ry="19" fill="#10281a"/>'
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-labelledby="title desc"><title id="title">005 — Feuillage, reprise de volume</title><desc id="desc">Étude SVG de surfaces courbes et de nervures en relief, à valider. Aucun pixel de photographie.</desc>'''
svg += opening
svg += ''.join(element for depth,element in sorted(faces,key=lambda item:item[0]))
svg += '</svg>'
target = OUT / '005-feuillage-v2.svg'
target.write_text(svg, encoding='utf-8')
print(f'{len(faces)} shaded vector facets, {len(svg)/1024/1024:.2f} MiB; {target.name}')
