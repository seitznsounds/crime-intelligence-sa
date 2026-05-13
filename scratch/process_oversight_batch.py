import pdfplumber
import os
import json

def process_reports(files):
    for file_name in files:
        pdf_path = os.path.join("intelligence/saps/crime-stats/", file_name)
        dist_path = os.path.join(".intelligence/distillations/saps/", file_name.replace(".pdf", "_distillation.json"))
        
        if not os.path.exists(pdf_path):
            print(f"File not found: {pdf_path}")
            continue
            
        print(f"Processing: {file_name}")
        try:
            with pdfplumber.open(pdf_path) as pdf:
                # Extract first 5 pages for high-level summary
                text = ""
                for i in range(min(5, len(pdf.pages))):
                    page_text = pdf.pages[i].extract_text()
                    if page_text:
                        text += f"--- Page {i+1} ---\n{page_text}\n\n"
                
                distilled = {
                    "source": pdf_path,
                    "date_analyzed": "2026-05-12",
                    "preview_text": text[:2000] # Just a snippet for metadata
                }
                
                with open(dist_path, "w", encoding="utf-8") as f:
                    json.dump(distilled, f, indent=2)
                print(f"✅ Distilled: {file_name}")
        except Exception as e:
            print(f"❌ Error processing {file_name}: {e}")

psira_sabric = [
    "Annual_Report_2020.pdf",
    "PSiRA Annual Report 2019.pdf",
    "PSiRA Annual Report 2021-2022.pdf",
    "PSiRA AR 2020_21_FINAL_28September2021.pdf",
    "PSiRA-AnnualReport2016-17-FA-ScreenRes.pdf",
    "PSIRA_Annual Report 2023_web_301023.pdf",
    "PSIRA_Annual Report 2024_25.pdf",
    "PSIRA_AR2018_final.pdf",
    "SABRIC_annual-report-2024.pdf"
]

process_reports(psira_sabric)
