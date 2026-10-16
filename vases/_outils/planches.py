"""Create private, numbered inspection sheets without altering source files."""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
records = json.loads((root / 'inventaire.json').read_text(encoding='utf-8-sig'))
out = root / '_planches'
out.mkdir(exist_ok=True)
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 25)
for start in range(0, len(records), 16):
    page = Image.new('RGB', (1600, 1760), '#e7e8ea')
    draw = ImageDraw.Draw(page)
    for pos, record in enumerate(records[start:start + 16]):
        x, y = (pos % 4) * 400, (pos // 4) * 440
        with Image.open(root / record['path']) as original:
            record['width'], record['height'] = original.size
            thumb = ImageOps.contain(original.convert('RGB'), (380, 385))
            page.paste(thumb, (x + (400 - thumb.width) // 2, y + 40 + (385 - thumb.height) // 2))
        draw.text((x + 15, y + 6), record['id'], fill='#111111', font=font)
    page.save(out / f'{start + 1:03d}-{min(start + 16, len(records)):03d}.png')
(root / 'inventaire.json').write_text(json.dumps(records, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'{len(records)} sources; {(len(records) + 15) // 16} inspection sheets.')
