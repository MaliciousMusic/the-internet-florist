# -*- coding: utf-8 -*-
"""cast_compare.py: a render beside its reference photograph, at the same scale and framing, for the comparison step of docs/STANDARD-RENDU.md.
The photograph stays on the PC (never in the repository, never published); only the comparison image is written.

usage: python cast_compare.py <photo> <render.png> <x> <y> <pixels per unit> <photo axis x> <photo foot y> <out.png> [x0,y0,x1,y1] [scale]
  <x> <y>: the render's top-left corner in user space, as cast_render.js prints it (the axis at x = 500, the foot at y = 990)
  <photo axis x> <photo foot y>: where the vessel's axis and foot line are in the photograph (pixels)
  x0,y0,x1,y1: the part of the photograph's frame to show (all of it by default); scale: of the output (0.5 by default)
"""
import sys
from PIL import Image

photo, render, x, y, s, ax, fy, out = sys.argv[1:9]
x, y, s, ax, fy = float(x), float(y), float(s), float(ax), float(fy)
ph = Image.open(photo).convert('RGB')
r = Image.open(render).convert('RGB')
# the render placed in the photograph's frame: its axis on the photograph's axis, its foot on the photograph's foot
can = Image.new('RGB', ph.size, (196, 198, 202))
can.paste(r, (int(round(ax - (500 - x) * s)), int(round(fy - (990 - y) * s))))
box = tuple(int(v) for v in sys.argv[9].split(',')) if len(sys.argv) > 9 else (0, 0, ph.width, ph.height)
sc = float(sys.argv[10]) if len(sys.argv) > 10 else .5
a, b = ph.crop(box), can.crop(box)
o = Image.new('RGB', (a.width * 2 + 10, a.height), (255, 255, 255))
o.paste(a, (0, 0))
o.paste(b, (a.width + 10, 0))
o.resize((int(o.width * sc), int(o.height * sc)), Image.LANCZOS).save(out)
print(out, o.size)
