"""Check inventory preservation, private sheet links and autonomous SVG assets."""
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
records = json.loads((ROOT / 'inventaire.json').read_text(encoding='utf-8-sig'))
errors = []
seen = set()
for record in records:
    source = ROOT / record['path']
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    if digest != record['sha256']:
        errors.append(f'Changed source: {source}')
    if digest in seen:
        errors.append(f'Duplicate source: {source}')
    seen.add(digest)
    folder = source.parent
    for name in ('FICHE.md', 'RECHERCHE.md'):
        if not (folder / name).is_file():
            errors.append(f'Missing sheet: {record["id"]}/{name}')
    if not record.get('sources'):
        errors.append(f'Missing source links: {record["id"]}')

folders = [ROOT / r['group'] / r['id'] for r in records]
notes = [ROOT / 'README.md', ROOT / 'METHODE.md', ROOT / 'CLASSEMENT.md', ROOT / 'Safe/README.md', ROOT / 'Unsafe/README.md', ROOT / '_tests/README.md']
notes += [folder / name for folder in folders for name in ('FICHE.md','CLASSEMENT.md')]
for note in notes:
    for link in re.findall(r'\]\(([^)]+)\)', note.read_text(encoding='utf-8-sig')):
        if link.startswith(('https://', 'http://', '#')):
            continue
        target = note.parent / unquote(link.split('#')[0].strip('<>'))
        if not target.exists():
            errors.append(f'Broken local link: {note.name}: {link}')

initial_svg_files = sorted((ROOT / '_tests/svg').glob('*.svg'))
svg_files = initial_svg_files + list((ROOT / '_tests/fidele').glob('*.svg'))
for svg in svg_files:
    tree = ET.parse(svg)
    elements = list(tree.iter())
    ids = [node.attrib['id'] for node in elements if 'id' in node.attrib]
    if len(ids) != len(set(ids)):
        errors.append(f'Duplicate SVG ids: {svg.name}')
    for node in elements:
        tag = node.tag.split('}')[-1]
        if tag in ('script', 'foreignObject', 'image'):
            errors.append(f'Unsupported external or active SVG content: {svg.name}/{tag}')
        for key, value in node.attrib.items():
            if key.endswith('href') and not value.startswith('#'):
                errors.append(f'External SVG dependency: {svg.name}: {value}')
            for reference in re.findall(r'url\(#([^)]+)\)', value):
                if reference not in ids:
                    errors.append(f'Broken SVG reference: {svg.name}: {reference}')

assert len(records) == 116
assert len(initial_svg_files) == 8
assert len(folders) == 116 and all(folder.is_dir() for folder in folders)
result = {
    'date': '2026-10-05',
    'originals': len(records),
    'matching_sha256': len(records) if not errors else None,
    'unique_originals': len(seen),
    'safe': sum(r['group']=='Safe' for r in records),
    'unsafe': sum(r['group']=='Unsafe' for r in records),
    'numbered_folders': len(folders),
    'individual_sheets': sum((f / 'FICHE.md').is_file() for f in folders),
    'classification_sheets': sum((f / 'CLASSEMENT.md').is_file() for f in folders),
    'research_logs': sum((f / 'RECHERCHE.md').is_file() for f in folders),
    'complementary_logs': sum(len(list(f.glob('COMPLEMENT*.md'))) for f in folders),
    'autonomous_svg_assets': len(svg_files),
    'errors': errors,
}
(ROOT / '_tests/verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(result, ensure_ascii=False))
if errors:
    raise SystemExit(1)
