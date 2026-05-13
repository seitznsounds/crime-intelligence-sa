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
                    "date_analyzed": "2026-05-13",
                    "preview_text": text[:2000] 
                }
                
                with open(dist_path, "w", encoding="utf-8") as f:
                    json.dump(distilled, f, indent=2)
                print(f"✅ Distilled: {file_name}")
        except Exception as e:
            print(f"❌ Error processing {file_name}: {e}")

remaining_files = [
    "PSIRA_Annual Report 2024_25.pdf",
    "PSIRA_AR2018_final.pdf",
    "SABRIC_annual-report-2024.pdf",
    "april_june_2021_22_quarter1_presentation.pdf",
    "april_to_march_2019_20_presentation.pdf",
    "fourth_quarter_2020_21_crimestats.pdf",
    "fourth_quarter_presentation_2021_2022.pdf",
    "July-to-September-2022-Presentation.pdf",
    "july_to_september_2020_21_crime_situation.pdf",
    "july_to_september_2021_22_quarter2_presentation.pdf",
    "Media-Statement-IR-Welcomes-DOJ-CD-Minister-Decision-on-Sex-Offender-Register-Publishing-04-March-2025.pdf",
    "October-2022-to-December-2022.pdf",
    "october_to_december_2020_21_crimestats.pdf",
    "third_quarter_presentation_2021_2022.pdf"
]

process_reports(remaining_files)
