import json
import os

extraction_path = r".intelligence/extractions/saps/saps_q2_2022_2023_top30.json"
distillation_path = r".intelligence/distillations/saps/saps_q2_2022_2023_top30.json"

if not os.path.exists(extraction_path):
    print(f"Extraction not found: {extraction_path}")
    exit(1)

with open(extraction_path, "r") as f:
    data = json.load(f)

# Search for RSA Position 1
start_idx = 0
for i, row in enumerate(data):
    vals = list(row.values())
    if vals and vals[0] == 1:
        start_idx = i
        break

top_stations = []
for row in data[start_idx:start_idx+30]:
    vals = list(row.values())
    if len(vals) >= 12:
        top_stations.append({
            "rsa_position": vals[0],
            "station": vals[1],
            "district": vals[2],
            "province": vals[3],
            "q2_2022_count": vals[8],
            "count_diff": vals[9],
            "percent_change": vals[10]
        })

distilled = {
    "source": "intelligence/saps/crime-stats/2022-2023-Q2-crime-stats.xlsx",
    "period": "Q2 2022-2023",
    "date_analyzed": "2026-05-12",
    "category": "17 Community reported serious Crime",
    "top_30_stations": top_stations
}

os.makedirs(os.path.dirname(distillation_path), exist_ok=True)
with open(distillation_path, "w") as f:
    json.dump(distilled, f, indent=2)

print(f"Distillation complete: {distillation_path}")
