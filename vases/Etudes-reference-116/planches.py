"""Prepare private inspection sheets without serving these bitmaps as artwork."""
from pathlib import Path
import argparse
import json
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parent
inventory=json.loads((ROOT.parent/'inventaire.json').read_text(encoding='utf-8'))
parser=argparse.ArgumentParser()
parser.add_argument('--source',action='store_true')
args=parser.parse_args()
for start in range(0,116,8):
    items=inventory[start:start+8]
    sheet=Image.new('RGB',(1600,1220),'#eee9dd')
    draw=ImageDraw.Draw(sheet)
    for n,item in enumerate(items):
        src=ROOT.parent/item['path'] if args.source else ROOT/'apercus'/f'{item["id"]}-natif.png'
        if not src.exists():continue
        image=Image.open(src).convert('RGBA')
        image.thumbnail((392,570),Image.Resampling.LANCZOS)
        left=(n%4)*400+(400-image.width)//2
        top=(n//4)*610+25+(570-image.height)//2
        sheet.paste(image,(left,top),image)
        draw.text(((n%4)*400+10,(n//4)*610+6),item['id']+' — '+item['label'],fill='#243a2f')
    sheet.save(ROOT/'controles'/(f'planche-{start+1:03d}-{start+len(items):03d}-'+('source' if args.source else 'svg')+'.png'))
