import json
import os

def distill_quarter(q_num, file_path):
    extraction_path = f".intelligence/extractions/saps/saps_q{q_num}_2025_2026_top30_stations.json"
    distillation_path = f".intelligence/distillations/saps/saps_q{q_num}_2025_2026_top30_stations.json"

    if not os.path.exists(extraction_path):
        print(f"Extraction not found: {extraction_path}")
        return

    with open(extraction_path, "r") as f:
        data = json.load(f)

    # Search for the start of the Top 30 data (RSA Position 1)
    start_idx = 0
    for i, row in enumerate(data):
        vals = list(row.values())
        if vals and vals[0] == 1:
            start_idx = i
            break
    
    if start_idx == 0:
        # Fallback to row 13 if search fails
        start_idx = 13

    top_stations = []
    for row in data[start_idx:start_idx+30]:
        vals = list(row.values())
        if len(vals) >= 12 and vals[2] is not None:
            top_stations.append({
                "rsa_position": vals[0],
                "prov_position": vals[1],
                "station": vals[2],
                "district": vals[3],
                "province": vals[4],
                "q_count": vals[9],
                "count_diff": vals[10],
                "percent_change": vals[11]
            })

    distilled = {
        "source": file_path,
        "period": f"Q{q_num} 2025-2026",
        "date_analyzed": "2026-05-12",
        "category": "17 Community reported serious Crime",
        "top_30_stations": top_stations
    }

    os.makedirs(os.path.dirname(distillation_path), exist_ok=True)
    with open(distillation_path, "w") as f:
        json.dump(distilled, f, indent=2)
    print(f"Distillation complete: {distillation_path}")

distill_quarter(1, "intelligence/saps/crime-stats/2025-2026_-_1st_Quarter_WEB.xlsx")
distill_quarter(2, "intelligence/saps/crime-stats/2025-2026_-_2nd_Quarter_WEB.xlsx")
distill_quarter(3, "intelligence/saps/crime-stats/2025-2026_-_3rd_Quarter_WEB.xlsx")
