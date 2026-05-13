import json
import os

extraction_path = r".intelligence/extractions/saps/saps_q1_2025_2026_top30_stations.json"
distillation_path = r".intelligence/distillations/saps/saps_q1_2025_2026_top30_stations.json"

if not os.path.exists(extraction_path):
    print(f"Extraction not found: {extraction_path}")
    exit(1)

with open(extraction_path, "r") as f:
    data = json.load(f)

# The Excel structure is a bit messy, we need to find the data rows
# Based on the peek, data starts around row 13
top_stations = []

for row in data[13:43]: # Rows 13 to 43 should be the Top 30
    # Column names are 'Unnamed: 0', 'Unnamed: 1', etc. or whatever pandas assigned
    # We need to map them manually based on the structure seen in the peek
    # RSA Position, Prov Position, Station, District, Province, Q1_2021, Q1_2022, Q1_2023, Q1_2024, Q1_2025, Count_Diff, Percent_Change
    
    # Let's try to map by index if column names are unreliable
    vals = list(row.values())
    if len(vals) >= 12 and vals[2] is not None:
        top_stations.append({
            "rsa_position": vals[0],
            "prov_position": vals[1],
            "station": vals[2],
            "district": vals[3],
            "province": vals[4],
            "q1_2025_count": vals[9],
            "count_diff": vals[10],
            "percent_change": vals[11]
        })

distilled = {
    "source": "intelligence/saps/crime-stats/2025-2026_-_1st_Quarter_WEB.xlsx",
    "period": "Q1 2025-2026 (April to June 2025)",
    "date_analyzed": "2026-05-12",
    "category": "17 Community reported serious Crime",
    "top_30_stations": top_stations
}

# Ensure output directory exists
os.makedirs(os.path.dirname(distillation_path), exist_ok=True)

with open(distillation_path, "w") as f:
    json.dump(distilled, f, indent=2)

print(f"Distillation complete: {distillation_path}")
