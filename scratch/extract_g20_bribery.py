import pdfplumber
import os

def extract_pdf(pdf_path, output_path, title):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    print(f"Starting Forensic Extraction: {pdf_path}")
    
    with pdfplumber.open(pdf_path) as pdf:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"# Forensic Extraction: {title}\n\n")
            f.write(f"**Source**: {pdf_path}\n\n")
            
            for i, page in enumerate(pdf.pages):
                f.write(f"## Page {i+1}\n\n")
                text = page.extract_text()
                if text:
                    f.write(text + "\n\n")
                
                tables = page.extract_tables()
                if tables:
                    for t_idx, table in enumerate(tables):
                        f.write(f"### Table {t_idx+1} (Page {i+1})\n\n")
                        for row in table:
                            clean_row = [str(cell).replace("\n", " ").strip() if cell else "" for cell in row]
                            f.write("| " + " | ".join(clean_row) + " |\n")
                        f.write("\n")
                print(f"Processed Page {i+1}/{len(pdf.pages)}")
    print(f"Extraction Complete: {output_path}")

# G20 Bribery Report (Closest match to OECD Bribery Study requested)
extract_pdf(
    "intelligence/unodc/G20_2015_Progress_Report_on_the_G20_Self_Assessment_on_Combatting_the_Bribery_of_Foreign_Public_Officials.pdf",
    ".intelligence/extractions/unodc/g20_bribery_self_assessment_2015.md",
    "G20 2015 Progress Report: Bribery of Foreign Public Officials"
)
