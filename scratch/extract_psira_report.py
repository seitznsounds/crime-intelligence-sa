import pdfplumber
import os
import json

pdf_path = r"intelligence/saps/crime-stats/PSiRA - Annual Report 2023-24.pdf"

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

with open("scratch/psira_report_2023_2024_extraction.txt", "w", encoding="utf-8") as f:
    f.write(extracted_text)

print("Extraction complete: scratch/psira_report_2023_2024_extraction.txt")
