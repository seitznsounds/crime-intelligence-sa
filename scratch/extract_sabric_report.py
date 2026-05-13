import pdfplumber
import os
import json

pdf_path = r"intelligence/saps/crime-stats/SABRIC-CRIME-STATISTICS-REPORT-2024.pdf"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    exit(1)

extracted_text = ""

with pdfplumber.open(pdf_path) as pdf:
    # Extract first 50 pages for key findings
    for i in range(min(50, len(pdf.pages))):
        text = pdf.pages[i].extract_text()
        if text:
            extracted_text += f"--- Page {i+1} ---\n{text}\n\n"

with open("scratch/sabric_report_2024_extraction.txt", "w", encoding="utf-8") as f:
    f.write(extracted_text)

print("Extraction complete: scratch/sabric_report_2024_extraction.txt")
