import pdfplumber
import os

pdf_path = "intelligence/pplaaf/Act No.112, 1998 Witness Protection Act.pdf"
output_path = ".intelligence/extractions/pplaaf/witness_protection_act_1998.md"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Starting Forensic Extraction: {pdf_path}")

with pdfplumber.open(pdf_path) as pdf:
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction: Witness Protection Act 112 of 1998\n\n")
        f.write(f"**Source**: {pdf_path}\n\n")
        
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
                        # Clean row for markdown
                        clean_row = [str(cell).replace("\n", " ").strip() if cell else "" for cell in row]
                        f.write("| " + " | ".join(clean_row) + " |\n")
                    f.write("\n")
            
            print(f"Processed Page {i+1}/{len(pdf.pages)}")

print(f"Extraction Complete: {output_path}")
