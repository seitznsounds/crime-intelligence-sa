import pdfplumber
import json
import os
import re

def clean_val(val):
    if val is None: return 0
    val = str(val).replace('\n', ' ').strip()
    val = val.replace(' ', '').replace(',', '').replace('.', '')
    sign = 1
    if val.startswith('-'):
        sign = -1
        val = val[1:]
    if val.isdigit():
        return sign * int(val)
    return 0

PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"]

def extract_saps_pdf(file_path):
    stats = {
        "source": file_path,
        "period": "",
        "national_stats": {},
        "provincial_serious_crimes": {},
        "provincial_murders": {},
        "top_stations_murder": []
    }
    
    with pdfplumber.open(file_path) as pdf:
        stats["period"] = pdf.pages[0].extract_text().split('\n')[0].strip()
        
        for page_num, page in enumerate(pdf.pages[:60]):
            text = page.extract_text()
            if not text: continue
            text_upper = text.upper()
            
            tables = page.extract_tables()
            if not tables: continue
            
            for table in tables:
                if not table or len(table) < 2: continue
                
                table_str = str(table).upper()
                
                # Check for Horizontal Provincial Table
                if "EASTERN CAPE" in table_str and "WESTERN CAPE" in table_str and ("RSA" in table_str or "REPUBLIC" in table_str):
                    # Horizontal layout: provinces are in one row, values in another
                    header_row = None
                    prov_indices = {}
                    
                    for row in table:
                        row_str = " ".join([str(c) for c in row if c]).upper()
                        if "EASTERN CAPE" in row_str:
                            header_row = [str(c).replace('\n', ' ').strip() for c in row]
                            for i, cell in enumerate(header_row):
                                cell_up = cell.upper()
                                for p in PROVINCES:
                                    if p.upper() in cell_up:
                                        prov_indices[p] = i
                                if "RSA" in cell_up or "REPUBLIC" in cell_up:
                                    prov_indices["RSA"] = i
                            break
                    
                    if prov_indices:
                        # Now find the row with the latest year
                        latest_year_row = None
                        latest_year = 0
                        for row in table:
                            row_str = " ".join([str(c) for c in row if c])
                            years = re.findall(r'20\d{2}', row_str)
                            if years:
                                year = int(max(years))
                                if year >= latest_year:
                                    latest_year = year
                                    latest_year_row = row
                        
                        if latest_year_row:
                            target_stats = "provincial_murders" if "MURDER" in text_upper else "provincial_serious_crimes"
                            for p, idx in prov_indices.items():
                                val = clean_val(latest_year_row[idx])
                                if p == "RSA":
                                    key = "total_murders" if "MURDER" in text_upper else "total_serious_crimes"
                                    stats["national_stats"][key] = val
                                else:
                                    if "MURDER" in text_upper:
                                        stats["provincial_murders"][p] = val
                                    else:
                                        stats["provincial_serious_crimes"][p] = val

                # Check for Vertical Provincial Table
                elif any(p.upper() in table_str for p in PROVINCES) and ("RSA" in table_str or "REPUBLIC" in table_str):
                    # Vertical layout
                    latest_idx = -1
                    for row in table:
                        row_str = " ".join([str(c) for c in row if c]).upper()
                        if "20" in row_str:
                            for i, cell in enumerate(row):
                                if cell and "20" in str(cell):
                                    latest_idx = i # Keep updating to get latest
                    
                    if latest_idx != -1:
                        for row in table:
                            if not row or len(row) <= latest_idx: continue
                            row_head = str(row[0]).replace('\n', ' ').strip().upper()
                            val = clean_val(row[latest_idx])
                            for p in PROVINCES:
                                if p.upper() == row_head:
                                    if "MURDER" in text_upper:
                                        stats["provincial_murders"][p] = val
                                    else:
                                        stats["provincial_serious_crimes"][p] = val
                            if "RSA" in row_head or "REPUBLIC" in row_head or "TOTAL" in row_head:
                                if "MURDER" in text_upper:
                                    stats["national_stats"]["total_murders"] = val
                                elif "TOTAL 17" in row_head or "COMMUNITY" in text_upper:
                                    stats["national_stats"]["total_serious_crimes"] = val

                # Top Stations
                if "TOP 30" in text_upper and "STATION" in text_upper and ("MURDER" in text_upper or "COMMUNITY" in text_upper):
                    if len(stats["top_stations_murder"]) < 10:
                        latest_idx = -1
                        # Find header
                        for row in table:
                            if "20" in str(row).upper():
                                for i, c in enumerate(row):
                                    if c and "20" in str(c): latest_idx = i
                        
                        if latest_idx != -1:
                            for row in table:
                                if not row or len(row) < 4: continue
                                if str(row[0]).isdigit(): # Position
                                    try:
                                        stats["top_stations_murder"].append({
                                            "name": str(row[1]).replace('\n', ' ').strip(),
                                            "province": str(row[2]).replace('\n', ' ').strip(),
                                            "count": clean_val(row[latest_idx])
                                        })
                                    except: pass

    return stats

files = [
    "Annual-Crime-2021_2022-web.pdf",
    "April-2022_23-presentation.pdf",
    "April-to-March 2020_21-presentation.pdf",
    "April_June 2020_2021.pdf"
]

base_path = "intelligence/saps/crime-stats/"

for file in files:
    file_path = os.path.join(base_path, file)
    print(f"Processing {file}...")
    try:
        res = extract_saps_pdf(file_path)
        output_file = f".intelligence/distillations/saps/{file.replace('.pdf', '')}_distillation.json"
        with open(output_file, 'w') as f:
            json.dump(res, f, indent=2)
        print(f"Saved to {output_file}")
    except Exception as e:
        print(f"Error processing {file}: {e}")
