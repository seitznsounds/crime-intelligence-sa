import pandas as pd
import json
import os

def extract_and_distill(file_path, sheet_name, q_label, year_label):
    extraction_path = f".intelligence/extractions/saps/saps_{q_label}_{year_label}_top30.json"
    distillation_path = f".intelligence/distillations/saps/saps_{q_label}_{year_label}_top30.json"
    
    print(f"Processing {file_path} -> {sheet_name}")
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        data = df.to_dict(orient='records')
        
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
                    "q_count": vals[8],
                    "count_diff": vals[9],
                    "percent_change": vals[10]
                })

        distilled = {
            "source": file_path,
            "period": f"{q_label} {year_label}",
            "date_analyzed": "2026-05-12",
            "category": "17 Community reported serious Crime",
            "top_30_stations": top_stations
        }

        os.makedirs(os.path.dirname(distillation_path), exist_ok=True)
        with open(distillation_path, "w") as f:
            json.dump(distilled, f, indent=2)
        print(f"✅ Distillation complete: {distillation_path}")
        return True
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

extract_and_distill(r'intelligence/saps/crime-stats/2022-2023-Q3-crime-stats.xlsx', 'TOP30 Stations', 'Q3', '2022_2023')
extract_and_distill(r'intelligence/saps/crime-stats/2022-2023-Q4-crime-stats.xlsx', 'TOP30 stations', 'Q4', '2022_2023')
