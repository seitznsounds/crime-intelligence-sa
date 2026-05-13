import pdfplumber
import os
import json

pdf_path = r"intelligence/saps/crime-stats/2025-2026_-_1st_Quarter_WEB.pdf"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    exit(1)

extracted_tables = []

with pdfplumber.open(pdf_path) as pdf:
    for i in range(10, min(30, len(pdf.pages))): # Likely tables start after methodology
        print(f"--- Page {i+1} ---")
        tables = pdf.pages[i].extract_tables()
        if tables:
            for table in tables:
                print(f"Found table with {len(table)} rows")
                extracted_tables.append({
                    "page": i + 1,
                    "data": table
                })
                # Print first 5 rows to see content
                for row in table[:5]:
                    print(row)

# Save a sample to a file for analysis
with open("scratch/saps_q1_tables_sample.json", "w") as f:
    json.dump(extracted_tables, f, indent=2)
