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

# FATF Gatekeepers
extract_pdf(
    "intelligence/unodc/FATF_2024_Horizontal_Review_of_Gatekeepers_Technical_Compliance_Related_to_Corruption.pdf",
    ".intelligence/extractions/unodc/fatf_gatekeepers_2024.md",
    "FATF 2024 Horizontal Review of Gatekeepers"
)
