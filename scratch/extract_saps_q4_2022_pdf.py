import pdfplumber
import os
import json

pdf_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\saps\crime-stats\4th-Quarter-January 2023-March 2023.pdf"
output_path = r".intelligence/extractions/saps/saps_q4_2022_2023_pdf.json"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    exit(1)

extracted_tables = []

with pdfplumber.open(pdf_path) as pdf:
    for i in range(min(40, len(pdf.pages))): 
        tables = pdf.pages[i].extract_tables()
        if tables:
            for table in tables:
                extracted_tables.append({
                    "page": i + 1,
                    "data": table
                })

os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    json.dump(extracted_tables, f, indent=2)

print(f"Extraction complete: {output_path}")
