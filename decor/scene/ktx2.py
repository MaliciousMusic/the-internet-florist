"""ktx2.py: the frieze's decor sprites as GPU-compressed textures (owner, 2026-10-28: « les textures compressées aussi je
prends »). Each strip tile and pillar of frise.json (frise_cuisson.mjs's WebP pictures) gets a KTX2 beside it, Basis ETC1S
with its mipmaps: about the WebP's weight, but a quarter of its memory on the graphics card (a byte a pixel once
transcoded to BC7, BC3, ASTC or ETC2, against four), and no decoding on the page's main thread (libktx in a worker).
The bouquets stay WebP: ETC1S blotches their petals (measured 2026-10-28: mean error 4.4, against 3.3 on the grass).

Each picture is first stretched to a multiple of 4 pixels each way (the compressed blocks' size; under 0.2 % of its width,
the sprite keeps its world size), and its KTX2 rebuilt only when its WebP is newer. amorce.py then lists them
(amorce.json "ktx2"), and frise.js loads them where the graphics card takes a compressed format.

  python decor/scene/ktx2.py           (after frise_cuisson.mjs / frise_versions.mjs, before amorce.py)
  KTX=<path to ktx.exe>                 default ~/.belai-ktx/bin/ktx.exe (KTX-Software 4.4.2, Apache-2.0)
"""
import json, os, subprocess, sys, tempfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FR = os.path.join(HERE, '..', 'out', 'frise')
# (in the home folder: the Microsoft Store's Python does not see the files of AppData/Local)
KTX = os.environ.get('KTX') or os.path.expanduser('~/.belai-ktx/bin/ktx.exe')
QLEVEL = '192'  # BasisLZ quality (1-255): the grass's blades stay clean at 192

fr = json.load(open(os.path.join(FR, 'frise.json'), encoding='utf-8'))
srcs = [pre[0] for B in fr['bandes'] for pre in (B.get('apercus') or [])] + [P['apercu'][0] for P in fr['piliers']]
srcs = sorted({s.split('?')[0] for s in srcs})

made = kept = 0
before = after = 0
tmp = tempfile.mkdtemp(prefix='ktx2-')
for k, src in enumerate(srcs):
    webp = os.path.join(FR, src)
    out = webp[: -len('.webp')] + '.ktx2'
    before += os.path.getsize(webp)
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(webp):
        kept += 1
        after += os.path.getsize(out)
        continue
    im = Image.open(webp).convert('RGBA')
    w, h = -(-im.width // 4) * 4, -(-im.height // 4) * 4
    if (w, h) != im.size:
        im = im.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA')
    png = os.path.join(tmp, 'p.png')
    im.save(png)
    subprocess.run(
        [KTX, 'create', '--format', 'R8G8B8A8_SRGB', '--assign-tf', 'srgb', '--encode', 'basis-lz', '--qlevel', QLEVEL, '--generate-mipmap', png, out],
        check=True,
        capture_output=True,
    )
    made += 1
    after += os.path.getsize(out)
    print(f'{k + 1}/{len(srcs)} {src}: {os.path.getsize(webp) // 1024} -> {os.path.getsize(out) // 1024} Ko', flush=True)
os.remove(os.path.join(tmp, 'p.png')) if os.path.exists(os.path.join(tmp, 'p.png')) else None
os.rmdir(tmp)
print(f'ktx2 : {made} faits, {kept} a jour ; WebP {before // 1024} Ko -> KTX2 {after // 1024} Ko')
