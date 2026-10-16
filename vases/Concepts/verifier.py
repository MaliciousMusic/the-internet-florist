"""Verify catalogue completeness, native SVG structure and private reference integrity."""
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
concepts = json.loads((ROOT / "concepts.json").read_text(encoding="utf-8"))
extraction = json.loads((ROOT / "extraction-116.json").read_text(encoding="utf-8"))
references = json.loads((ROOT.parent / "inventaire.json").read_text(encoding="utf-8"))
assert len(concepts) == 400
assert [c["id"] for c in concepts] == [f"C{i:03d}" for i in range(1, 401)]
assert len({(c["family"], c["shape"]) for c in concepts}) == 400
assert len({c["family"] for c in concepts}) == 20
assert len({c["shape"] for c in concepts}) == 20
assert len({c["material"] for c in concepts}) == 16
assert len(extraction) == len(references) == 116
assert {r["id"] for r in extraction} == {r["id"] for r in references}
assert {r for c in concepts for r in c["references"]} == {r["id"] for r in references}
hashes = set()
for c in concepts:
    path = ROOT / c["file"]
    source = path.read_text(encoding="utf-8")
    svg = ET.fromstring(source)
    assert svg.tag == "{http://www.w3.org/2000/svg}svg"
    assert svg.attrib["viewBox"] == "0 0 300 400"
    ids = [n.attrib["id"] for n in svg.iter() if "id" in n.attrib]
    assert len(ids) == len(set(ids))
    assert set(re.findall(r"url\(#([^)]*)\)", source)).issubset(ids)
    for node in svg.iter():
        assert node.tag.split("}")[-1] not in ("image", "script", "foreignObject", "iframe")
        assert all(not key.lower().startswith("on") for key in node.attrib)
        for key, value in node.attrib.items():
            if key.endswith("href"):
                assert value.startswith("#")
    assert "data:" not in source and "https://" not in source
    hashes.add(hashlib.sha256(path.read_bytes()).hexdigest())
assert len(hashes) == 400
for r in references:
    assert hashlib.sha256((ROOT.parent / r["path"]).read_bytes()).hexdigest() == r["sha256"]
report = {
    "concepts": len(concepts), "native_svg": len(hashes), "family_profile_pairs": 400,
    "references_extracted_and_unchanged": len(references),
    "families": dict(Counter(c["family"] for c in concepts)),
    "materials": dict(Counter(c["material"] for c in concepts)),
}
(ROOT / "verification-structure.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("400 SVG natifs distincts ; 400 couples famille/profil ; 116 références extraites et inchangées.")
