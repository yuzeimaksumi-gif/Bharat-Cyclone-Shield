"""Downloads India ADM2 (district) boundaries from geoBoundaries (gbOpen, CC BY 4.0),
keeps the districts for our 3 demo regions, and writes frontend/public/data/regions.geojson.
Run from the project root:  python backend/scripts/build_region_geodata.py
"""
import json, re, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw" / "ind_adm2_simplified.geojson"
OUT = ROOT / "frontend" / "public" / "data" / "regions.geojson"
API = "https://www.geoboundaries.org/api/current/gbOpen/IND/ADM2/"

# Each district = a group of alias spellings. bbox = (lon_min, lat_min, lon_max, lat_max)
# sanity check so a same-named district elsewhere in India is never picked.
REGIONS = {
    "odisha": {
        "bbox": (83.5, 17.5, 88.0, 22.5),
        "districts": [["Balasore", "Baleshwar", "Baleswar"], ["Bhadrak"],
                      ["Kendrapara", "Kendrapada"], ["Jagatsinghpur", "Jagatsinghapur"],
                      ["Puri"], ["Ganjam"]],
    },
    "sundarbans": {
        "bbox": (88.0, 21.4, 89.3, 23.4),
        "districts": [["South 24 Parganas", "South Twenty Four Parganas", "Dakshin 24 Parganas"],
                      ["North 24 Parganas", "North Twenty Four Parganas", "Uttar 24 Parganas"]],
    },
    "tamilnadu": {
        "bbox": (78.5, 9.8, 80.6, 13.9),
        "districts": [["Chennai"], ["Tiruvallur", "Thiruvallur"],
                      ["Kancheepuram", "Kanchipuram", "Kanchipuram"], ["Chengalpattu", "Chengalpet", "Chengalputtu"],
                      ["Villupuram", "Viluppuram"], ["Cuddalore"], ["Mayiladuthurai"],
                      ["Nagapattinam"], ["Tiruvarur", "Thiruvarur"], ["Thanjavur"]],
    },
}

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "BharatCycloneShield/0.1"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)

def coords(geom):  # yields every (lon, lat) in a geometry
    def walk(c):
        if c and isinstance(c[0], (int, float)):
            yield c
        else:
            for x in c:
                yield from walk(x)
    yield from walk(geom["coordinates"])

def center(geom):
    pts = list(coords(geom))
    return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))

def rounded(c):  # ~100 m precision keeps the file small
    return [round(c, 3)] if isinstance(c, (int, float)) else [rounded(x) if isinstance(x, list) else round(x, 3) for x in c]

def rnd(c):
    return round(c, 3) if isinstance(c, (int, float)) else [rnd(x) for x in c]

# 1. Download (cached)
meta = {}
if not RAW.exists():
    RAW.parent.mkdir(parents=True, exist_ok=True)
    meta = fetch_json(API)
    if isinstance(meta, list):
        meta = meta[0]
    print("API response keys:", list(meta.keys()))
    url = meta.get("simplifiedGeometryGeoJSON") or meta.get("gjDownloadURL")
    if not url:
        raise SystemExit("No GeoJSON link found in the API response - see the keys above.")
    print("Downloading:", url)
    RAW.write_text(json.dumps(fetch_json(url)), encoding="utf-8")
    (RAW.parent / "ind_adm2_meta.json").write_text(json.dumps(meta, indent=2))
else:
    print("Using cached download:", RAW)
    mp = RAW.parent / "ind_adm2_meta.json"
    meta = json.loads(mp.read_text()) if mp.exists() else {}

data = json.loads(RAW.read_text(encoding="utf-8"))
print("Total districts in file:", len(data["features"]))

# 2. Filter
out_features, problems = [], []
for rid, cfg in REGIONS.items():
    x0, y0, x1, y1 = cfg["bbox"]
    print(f"\n== {rid} ==")
    for aliases in cfg["districts"]:
        wanted = {norm(a) for a in aliases}
        hit = None
        for f in data["features"]:
            name = f["properties"].get("shapeName", "")
            if norm(name) in wanted:
                cx, cy = center(f["geometry"])
                if x0 <= cx <= x1 and y0 <= cy <= y1:
                    hit = f
                    break
        if hit:
            name = hit["properties"]["shapeName"]
            print("  OK  ", name)
            out_features.append({
                "type": "Feature",
                "properties": {"regionId": rid, "districtName": name},
                "geometry": {"type": hit["geometry"]["type"], "coordinates": rnd(hit["geometry"]["coordinates"])},
            })
        else:
            problems.append(rid)
            print("  MISS", aliases)
            near = sorted({f["properties"].get("shapeName", "?") for f in data["features"]
                           if x0 <= center(f["geometry"])[0] <= x1 and y0 <= center(f["geometry"])[1] <= y1})
            print("       district names inside this region's box:", near)

# 3. Write
OUT.parent.mkdir(parents=True, exist_ok=True)
fc = {"type": "FeatureCollection",
      "metadata": {"source": "geoBoundaries gbOpen (William & Mary geoLab)", "license": "CC BY 4.0",
                   "boundaryYear": meta.get("boundaryYear"), "note": "District groupings are illustrative."},
      "features": out_features}
OUT.write_text(json.dumps(fc), encoding="utf-8")
print(f"\nWrote {len(out_features)} districts -> {OUT} ({OUT.stat().st_size // 1024} KB)")
if problems:
    print("Some districts were not matched: paste the MISS lines to me.")