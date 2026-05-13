import pdfplumber
import os

pdf_path = r"intelligence/saps/crime-stats/2025-2026_-_1st_Quarter_WEB.pdf"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    exit(1)

with pdfplumber.open(pdf_path) as pdf:
    # Check first 5 pages for structure
    for i in range(min(5, len(pdf.pages))):
        print(f"--- Page {i+1} ---")
        text = pdf.pages[i].extract_text()
        if text:
            print(text[:1000])
        else:
            print("No text found (might be scanned or image-based)")

        tables = pdf.pages[i].extract_tables()
        if tables:
            print(f"Found {len(tables)} tables")
            for table in tables:
                print(f"Table rows: {len(table)}, cols: {len(table[0])}")
                # Print first few rows of the first table
                for row in table[:3]:
                    print(row)
