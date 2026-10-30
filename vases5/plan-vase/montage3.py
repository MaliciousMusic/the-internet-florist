"""Step 3 sheet: model bouquets over their vessel's capacity, in the vessel as it is | as the Composer scales it.
python vases5/plan-vase/montage3.py -> vases5/plan-vase/planche-etape3.jpg"""
import os, json
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
ROWS = [(71, 'soliflore-balustre-noir', '1.30', 'M77'), (27, 'balustre-argent-patine', '1.10', 'M30'), (25, 'calice-souffle-col-tube', '1.50', 'M28')]
C, PAD, TOP = 520, 16, 64
F = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 21)
FB = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 25)
capa = {}
try:
    for r in json.load(open(os.path.join(D, 'qa', 'capa.json'), encoding='utf8')):
        capa['M%s' % r.get('n')] = r
except OSError:
    pass
W, H = 2 * C + 3 * PAD + 420, TOP + len(ROWS) * (C + PAD) + PAD
sheet = Image.new('RGB', (W, H), '#f4efe6')
dr = ImageDraw.Draw(sheet)
dr.text((PAD, 14), 'Plan du vase, étape 3 : capacité du col — vase du catalogue | vase agrandi par le Composer', font=FB, fill='#222')
for i, (m, v, k, mn) in enumerate(ROWS):
    y = TOP + i * (C + PAD)
    for j, vv in enumerate([v, f'{v}_{k}']):
        p = os.path.join(D, 'rendus3', f'm{m}_{vv}.png')
        if os.path.exists(p):
            sheet.paste(Image.open(p).convert('RGB').resize((C, C), Image.LANCZOS), (PAD + j * (C + PAD), y))
        dr.text((PAD + j * (C + PAD) + 8, y + 6), 'tel quel' if j == 0 else f'agrandi ×{k.replace(".", ",")}', font=F, fill='#555')
    r = capa.get(mn, {})
    lines = [f'{mn} · {v}', f'{r.get("stems", "?")} tiges composées', f'col rempli à {round(100 * r.get("fill", 0))} %',
             f'au plus {r.get("max", "?")} tiges à sa taille', f'{r.get("maxGrow", "?")} à ×1,5',
             'tient agrandi' if r.get('ok') else 'trop étroit, même agrandi']
    for n, t in enumerate(lines):
        dr.text((2 * C + 3 * PAD, y + 150 + n * 30), t, font=FB if n == 0 else F, fill='#b5462f' if (n == 5 and not r.get('ok')) else '#333')
sheet.save(os.path.join(D, 'planche-etape3.jpg'), quality=88)
print('ok')
