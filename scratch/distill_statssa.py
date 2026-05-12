import re

with open("scratch/statssa_analysis_raw.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Pattern for Table 6 (Housebreaking)
# Western Cape 133 971 (6,4%)
# Eastern Cape 129 203 (6,6%)
# Northern Cape 14 069 (4,2%)
# Free State 67 021 (7,0%)
# KwaZulu-Natal 144 656 (5,0%)
# North West 75 754 (6,0%)
# Gauteng 316 284 (6,1%)
# Mpumalanga 43 976 (3,5%)
# Limpopo 44 633 (2,7%)
# South Africa 969 567 (5,8%)

# I'll manually parse these from the text
provinces = ["Western Cape", "Eastern Cape", "Northern Cape", "Free State", "KwaZulu-Natal", "North West", "Gauteng", "Mpumalanga", "Limpopo"]

results = []
for p in provinces:
    # Look for province name followed by numbers
    # Example: Western Cape 133 971 (6,4%)
    match = re.search(rf"{p}\s+([\d\s]+)\s+\(([\d,]+)%\)", text)
    if match:
        count = match.group(1).replace(" ", "")
        percentage = match.group(2).replace(",", ".")
        results.append({
            "province": p,
            "experienced_count": int(count),
            "percentage_of_households": float(percentage),
            "crime_type": "Housebreaking"
        })

# Table 8 (Home Robbery)
# Western Cape 16 024 (0,8%)
# Eastern Cape 14 365 (0,7%)
# Northern Cape 5 448 (1,6%)
# Free State 11 506 (1,2%)
# KwaZulu-Natal 43 148 (1,5%)
# North West 14 553 (1,2%)
# Gauteng 70 885 (1,4%)
# Mpumalanga 3 349 (0,3%)
# Limpopo 4 722 (0,3%)
# South Africa 183 998 (1,1%)

for p in provinces:
    # We need to search specifically in the context of Table 8 if possible, but let's try direct matches first
    # and check if they are different from Table 6
    matches = re.findall(rf"{p}\s+([\d\s]+)\s+\(([\d,]+)%\)", text)
    if len(matches) >= 2:
        # Second match should be Home Robbery (Table 8 is after Table 6)
        match = matches[1]
        count = match[0].replace(" ", "")
        percentage = match[1].replace(",", ".")
        results.append({
            "province": p,
            "experienced_count": int(count),
            "percentage_of_households": float(percentage),
            "crime_type": "Home Robbery"
        })

import json
with open("scratch/statssa_distilled.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"Distilled {len(results)} provincial crime records.")
