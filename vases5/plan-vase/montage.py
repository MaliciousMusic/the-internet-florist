"""Before/after sheet of the vessel plan: one row per vessel, before (stems pivot at the mouth) | after (cone of the plan).
python vases5/plan-vase/montage.py [seed] -> vases5/plan-vase/planche-etape2.jpg"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
SEED = sys.argv[1] if len(sys.argv) > 1 else '23'
VASES = ['bronze-carpe', 'verre-danseuses', 'gres-chauve-souris', 'cylindre-verre-clair', 'soliflore-balustre-noir']
C, PAD, TOP = 560, 16, 64
try:
    F = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 22)
    FB = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 26)
except OSError:
    F = FB = ImageFont.load_default()
rows = [v for v in VASES if os.path.exists(os.path.join(D, 'rendus', f'{v}_apres_s{SEED}.png'))]
W, H = 2 * C + 3 * PAD + 260, TOP + len(rows) * (C + PAD) + PAD
sheet = Image.new('RGB', (W, H), '#f4efe6')
dr = ImageDraw.Draw(sheet)
dr.text((PAD, 12), f'Plan du vase, étape 2 : avant (tiges pivotant à la bouche) | après (cône fond + lèvre), graine {SEED}', font=FB, fill='#222')
for i, v in enumerate(rows):
    y = TOP + i * (C + PAD)
    for j, k in enumerate(['avant', 'apres']):
        p = os.path.join(D, 'rendus', f'{v}_{k}_s{SEED}.png')
        if os.path.exists(p):
            sheet.paste(Image.open(p).convert('RGB').resize((C, C), Image.LANCZOS), (PAD + j * (C + PAD), y))
        dr.text((PAD + j * (C + PAD) + 8, y + 6), 'avant' if k == 'avant' else 'après', font=F, fill='#555')
    dr.text((2 * C + 3 * PAD, y + C // 2 - 14), v, font=F, fill='#333')
sheet.save(os.path.join(D, f'planche-etape2_s{SEED}.jpg'), quality=88)
print('ok', len(rows), 'vases')
