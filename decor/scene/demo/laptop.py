"""laptop.py: draws demo/laptop.svg, the generic laptop of the demo "On your desktop" (owner, 2026-10-27: realistic, from
reference photos, no brand): a platinum aluminium laptop seen from the front and a little above, its lid open, thin black
bezels and a thicker chin, a keyboard of real key widths in the deck's colour seen in perspective, a wide trackpad.
The screen is a hole (SCREEN below) the page shows the desktop and the bouquet through.

    python decor/scene/demo/laptop.py
"""
import os

W, H = 1600, 1080
SCREEN = (250, 74, 1100, 688, 5)  # x, y, w, h, radius (16:10)
LID = (228, 40, 1144, 772, 26)  # the lid's aluminium outline
DECK_TOP, DECK_FRONT = 818, 1006  # the deck's back edge (by the hinge) and its front edge
DECK_BACK_X, DECK_FRONT_X = (206, 1394), (54, 1546)

# the keyboard: rows of keys in units (1 = a letter key), each row 15 units wide; the function row is shorter
ROWS = [
    (0.62, [1] * 14 + [1]),
    (1, [1] * 13 + [2]),
    (1, [1.5] + [1] * 12 + [1.5]),
    (1, [1.75] + [1] * 11 + [2.25]),
    (1, [2.25] + [1] * 10 + [2.75]),
    (1, [1, 1, 1, 1, 5.5, 1, 1] + [1, 1, 1]),
]
KB_U = (0.115, 0.885)  # the keyboard's left and right edges, across the deck
KB_V = (0.06, 0.55)  # its back and front edges, down the deck
PAD_U, PAD_V = (0.34, 0.66), (0.61, 0.93)


def deck(u, v):
    """a point of the deck: u across (0 left, 1 right), v down (0 the hinge, 1 the front edge), in perspective"""
    l = DECK_BACK_X[0] + (DECK_FRONT_X[0] - DECK_BACK_X[0]) * v
    r = DECK_BACK_X[1] + (DECK_FRONT_X[1] - DECK_BACK_X[1]) * v
    # (the depth foreshortens toward the hinge)
    y = DECK_TOP + (DECK_FRONT - DECK_TOP) * (v ** 1.12)
    return l + (r - l) * u, y


def quad(u0, u1, v0, v1):
    pts = [deck(u0, v0), deck(u1, v0), deck(u1, v1), deck(u0, v1)]
    return 'M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'z'


def keys():
    out_side, out_top = [], []
    total = sum(h for h, _ in ROWS)
    gap_u, gap_v = 0.0042, 0.012
    v = KB_V[0]
    for hrow, row in ROWS:
        dv = (KB_V[1] - KB_V[0]) * hrow / total
        units = sum(row)
        u = KB_U[0]
        for w in row:
            du = (KB_U[1] - KB_U[0]) * w / units
            u0, u1, v0, v1 = u + gap_u, u + du - gap_u, v + gap_v, v + dv - gap_v
            # the key's side (its front face, a little lower) then its top
            out_side.append(quad(u0, u1, v0 + 0.006, v1 + 0.006))
            out_top.append(quad(u0, u1, v0, v1))
            u += du
        v += dv
    return out_side, out_top


def svg():
    sx, sy, sw, sh, sr = SCREEN
    lx, ly, lw, lh, lr = LID
    side, top = keys()
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
  <!-- A generic platinum laptop seen from the front and a little above (demo "On your desktop", owner 2026-10-27: realistic,
       from reference photos, no brand, no logo), drawn by laptop.py. The screen is a hole (x {sx}, y {sy}, {sw} x {sh},
       radius {sr}): the page shows the desktop and the bouquet through it. -->
  <defs>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a9aeb4"/><stop offset="0.04" stop-color="#dfe2e5"/><stop offset="0.5" stop-color="#cfd3d7"/>
      <stop offset="0.96" stop-color="#dfe2e5"/><stop offset="1" stop-color="#a9aeb4"/>
    </linearGradient>
    <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bcc1c6"/><stop offset="0.18" stop-color="#d3d7db"/><stop offset="1" stop-color="#e4e7ea"/>
    </linearGradient>
    <linearGradient id="well" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a5abb2"/><stop offset="1" stop-color="#b8bdc3"/>
    </linearGradient>
    <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d6d9dd"/><stop offset="1" stop-color="#e2e5e8"/>
    </linearGradient>
    <linearGradient id="pad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c3c8cd"/><stop offset="1" stop-color="#cfd3d7"/>
    </linearGradient>
    <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eef0f2"/><stop offset="0.4" stop-color="#c6cbd0"/><stop offset="1" stop-color="#8e959c"/>
    </linearGradient>
    <linearGradient id="hinge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7d838a"/><stop offset="1" stop-color="#b3b8be"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.13"/><stop offset="0.36" stop-color="#fff" stop-opacity="0.03"/>
      <stop offset="0.37" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0b1a33" stop-opacity="0.32"/><stop offset="1" stop-color="#0b1a33" stop-opacity="0"/>
    </radialGradient>
    <mask id="trou" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#fff"/><rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="{sr}" fill="#000"/>
    </mask>
  </defs>

  <ellipse cx="800" cy="1044" rx="760" ry="22" fill="url(#shadow)"/>

  <g mask="url(#trou)">
    <!-- the lid: its aluminium rim, the black glass edge to edge, the chin a little thicker, the camera -->
    <rect x="{lx}" y="{ly}" width="{lw}" height="{lh}" rx="{lr}" fill="url(#rim)"/>
    <rect x="{lx + 5}" y="{ly + 5}" width="{lw - 10}" height="{lh - 10}" rx="{lr - 5}" fill="#0b0c0e"/>
    <rect x="{lx + 5}" y="{ly + 5}" width="{lw - 10}" height="6" rx="3" fill="#fff" opacity="0.06"/>
    <circle cx="800" cy="{(ly + sy) / 2 + 2:.1f}" r="5" fill="#1a1e24"/>
    <circle cx="800" cy="{(ly + sy) / 2 + 2:.1f}" r="2.2" fill="#2a3a52"/>
    <circle cx="798.9" cy="{(ly + sy) / 2 + 1:.1f}" r="0.8" fill="#8fa8c8"/>
  </g>

  <!-- the hinge, seen between the lid and the deck -->
  <path fill="url(#hinge)" d="M{lx + 40} {ly + lh - 2}h{lw - 80}l14 {DECK_TOP - ly - lh + 4}H{lx + 26}z"/>

  <!-- the deck, the keyboard's well, its keys, the trackpad -->
  <path fill="url(#deck)" d="{quad(0, 1, 0, 1)}"/>
  <path fill="url(#well)" d="{quad(KB_U[0] - 0.008, KB_U[1] + 0.008, KB_V[0] - 0.015, KB_V[1] + 0.015)}"/>
  <g fill="#9aa0a7">{''.join(f'<path d="{d}"/>' for d in side)}</g>
  <g fill="url(#cap)">{''.join(f'<path d="{d}"/>' for d in top)}</g>
  <path fill="url(#pad)" stroke="#aeb4ba" stroke-width="1.2" d="{quad(PAD_U[0], PAD_U[1], PAD_V[0], PAD_V[1])}"/>

  <!-- the front edge catching the light, the thumb's notch -->
  <path fill="url(#lip)" d="M{DECK_FRONT_X[0]} {DECK_FRONT}H{DECK_FRONT_X[1]}l-8 20a14 14 0 0 1-12 8H74a14 14 0 0 1-12-8z"/>
  <path fill="#7c838b" opacity="0.5" d="M730 {DECK_FRONT + 1}h140a10 10 0 0 1-10 9H740a10 10 0 0 1-10-9z"/>

  <!-- the screen's glass over what the page shows through it -->
  <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="{sr}" fill="url(#glass)" pointer-events="none"/>
</svg>
'''


if __name__ == '__main__':
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'laptop.svg')
    open(out, 'w', encoding='utf-8', newline='\n').write(svg())
    print('laptop.svg', SCREEN)
