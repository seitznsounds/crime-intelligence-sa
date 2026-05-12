import pdfplumber
import os

pdf_path = "intelligence/pplaaf/Criminal Procedure Act 51 of 1977 1977-051.pdf"
output_path = ".intelligence/extractions/pplaaf/criminal_procedure_act_1977.md"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Starting Forensic Extraction: {pdf_path}")

with pdfplumber.open(pdf_path) as pdf:
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction: Criminal Procedure Act 51 of 1977\n\n")
        f.write(f"**Source**: {pdf_path}\n\n")
        
        total_pages = len(pdf.pages)
        for i, page in enumerate(pdf.pages):
            f.write(f"## Page {i+1}\n\n")
            
            # Extract Text
            text = page.extract_text()
            if text:
                f.write(text + "\n\n")
            
            # Extract Tables
            tables = page.extract_tables()
            if tables:
                for t_idx, table in enumerate(tables):
                    f.write(f"### Table {t_idx+1} (Page {i+1})\n\n")
                    for row in table:
                        clean_row = [str(cell).replace("\n", " ").strip() if cell else "" for cell in row]
                        f.write("| " + " | ".join(clean_row) + " |\n")
                    f.write("\n")
            
            if (i+1) % 10 == 0 or (i+1) == total_pages:
                print(f"Processed Page {i+1}/{total_pages}")

print(f"Extraction Complete: {output_path}")
