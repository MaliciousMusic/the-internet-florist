"""Exercise local persistence and access boundaries without a browser."""
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
URL = "http://127.0.0.1:8787"
PATH = ROOT / "selection.json"
original = PATH.read_bytes()
checks = []


def request(path, data=None, origin=URL):
    headers = {"Origin": origin, "Content-Type": "application/json"}
    payload = json.dumps(data).encode("utf-8") if data is not None else None
    req = Request(URL + path, data=payload, headers=headers, method="PUT" if data is not None else "GET")
    try:
        with urlopen(req, timeout=5) as response:
            return response.status, response.read(), response.headers
    except HTTPError as error:
        return error.code, error.read(), error.headers


try:
    assert request("/")[0] == 200
    status, body, headers = request("/svg/C400.svg")
    assert status == 200 and headers["Content-Type"].startswith("image/svg+xml")
    catalog = json.loads(request("/concepts.json")[1])
    assert len(catalog) == 400
    for c in catalog:
        assert request("/" + c["file"])[0] == 200
    checks.append("Page, catalogue et 400 SVG accessibles")
    data = {"catalogueVersion": "belai-vases-400-v1", "selectedIds": ["C400", "C001"], "notes": {"C400": "Essayer le céladon.", "C002": "Élargir le col."}}
    assert request("/api/selection", data)[0] == 200
    saved = json.loads(PATH.read_text(encoding="utf-8"))
    assert saved["selectedIds"] == ["C001", "C400"]
    assert saved["notes"] == data["notes"]
    assert saved["selected"][1]["name"] == catalog[-1]["name"]
    assert json.loads(request("/api/selection")[1]) == saved
    checks.append("Sauvegarde atomique, notes, propriétés et relecture du fichier")
    for invalid in (
        dict(data, selectedIds=["C999"]),
        dict(data, selectedIds=["C001", "C001"]),
        dict(data, catalogueVersion="inconnue"),
        dict(data, notes={"C400": "x" * 2001}),
    ):
        assert request("/api/selection", invalid)[0] == 400
        assert json.loads(PATH.read_text(encoding="utf-8")) == saved
    assert request("/api/selection", data, origin="https://example.org")[0] == 403
    for private in ("/serve.py", "/selection.json", "/inventaire.json", "/../Unsafe/001/FICHE.md", "/%2e%2e%2fUnsafe/001/FICHE.md"):
        assert request(private)[0] == 404
    checks.append("Versions, identifiants, notes invalides et origine extérieure refusés ; références privées inaccessibles")
    (ROOT / "verification-serveur.json").write_text(json.dumps({"checks": checks}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("3 contrôles du serveur réussis ; 400 SVG servis ; sélection initiale restaurée.")
finally:
    temporary = ROOT / ".selection-restore.tmp"
    temporary.write_bytes(original)
    temporary.replace(PATH)
