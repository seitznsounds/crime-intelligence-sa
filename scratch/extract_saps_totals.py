import pdfplumber
import json
import os
import re

def extract_national_stats(file_path):
    stats = {
        "source": file_path,
        "period": "",
        "national_stats": {},
        "provincial_serious_crimes": {},
        "provincial_murders": {},
    }
    
    with pdfplumber.open(file_path) as pdf:
        # Try to find the period on the first page
        first_page_text = pdf.pages[0].extract_text()
        if first_page_text:
            # Look for patterns like 2021/2022 or April to June
            stats["period"] = first_page_text.split('\n')[0] # Default to first line

        for page in pdf.pages[:30]: # Look in first 30 pages
            tables = page.extract_tables()
            for table in tables:
                if not table: continue
                # Look for a table that has "RSA" or "National" and crime categories
                table_str = str(table).lower()
                if "murder" in table_str and ("rsa" in table_str or "national" in table_str or "total" in table_str):
                    # We found a potential summary table
                    # print(f"Found table in {file_path} page {page.page_number}")
                    # Process the table
                    for row in table:
                        if not row: continue
                        row_clean = [str(cell).replace('\n', ' ').strip() for cell in row if cell]
                        if not row_clean: continue
                        
                        # Look for Murder
                        if "murder" == row_clean[0].lower() or "murder" in row_clean[0].lower():
                            # Usually the last or second to last column is the total/count
                            try:
                                # Find the first numeric value from the end
                                for val in reversed(row_clean):
                                    val_clean = val.replace(' ', '').replace(',', '')
                                    if val_clean.isdigit():
                                        stats["national_stats"]["total_murders"] = int(val_clean)
                                        break
                            except:
                                pass
                        
                        # Look for total serious crimes
                        if "total" in row_clean[0].lower() and "serious" in row_clean[0].lower():
                            try:
                                for val in reversed(row_clean):
                                    val_clean = val.replace(' ', '').replace(',', '')
                                    if val_clean.isdigit():
                                        stats["national_stats"]["total_serious_crimes"] = int(val_clean)
                                        break
                            except:
                                pass

    return stats

files = [
    "Annual-Crime-2021_2022-web.pdf",
    "April-2022_23-presentation.pdf",
    "April-to-March 2020_21-presentation.pdf",
    "April_June 2020_2021.pdf"
]

base_path = "intelligence/saps/crime-stats/"

results = []
for file in files:
    file_path = os.path.join(base_path, file)
    try:
        res = extract_national_stats(file_path)
        results.append(res)
    except Exception as e:
        print(f"Error processing {file}: {e}")

print(json.dumps(results, indent=2))
