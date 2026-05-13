import json
import os

extraction_path = r".intelligence/extractions/anticorruption-govza/nacs_monitoring_framework_2024.json"
distillation_path = r".intelligence/distillations/anticorruption-govza/nacs_monitoring_framework_2024.json"

if not os.path.exists(extraction_path):
    print(f"Extraction not found: {extraction_path}")
    exit(1)

with open(extraction_path, "r") as f:
    data = json.load(f)

# Group by pillars and outcomes
pillars = []
current_pillar = None
current_outcome = None

for row in data:
    prog = row.get("Programme")
    indicator = row.get("Outcome indicator")
    
    if prog and "PILLAR" in prog:
        current_pillar = {
            "title": prog.strip(),
            "outcomes": []
        }
        pillars.append(current_pillar)
        current_outcome = None
    
    if prog and "Outcome" in prog:
        current_outcome = {
            "title": prog.strip(),
            "indicators": []
        }
        if current_pillar:
            current_pillar["outcomes"].append(current_outcome)
    
    if indicator and current_outcome:
        current_outcome["indicators"].append({
            "name": indicator.strip(),
            "baseline": row.get("Baseline"),
            "responsible": row.get("Responsible")
        })

distilled = {
    "source": "intelligence/anticorruption-govza/Draft NACS Monitoring Framework_20032024.xlsx_",
    "date_analyzed": "2026-05-12",
    "strategy_period": "2020-2030",
    "pillars": pillars
}

with open(distillation_path, "w") as f:
    json.dump(distilled, f, indent=2)

print(f"Distillation complete: {distillation_path}")
