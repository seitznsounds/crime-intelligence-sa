import pdfplumber
import os
import sys

def extract_pdf_to_md(pdf_path, output_path):
    if not os.path.exists(pdf_path):
        print(f"Error: File not found {pdf_path}")
        return

    print(f"Extracting {pdf_path}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                full_text += f"## Page {i+1}\n\n{text}\n\n"
            
            # Extract tables if any
            tables = page.extract_tables()
            for j, table in enumerate(tables):
                full_text += f"### Table {j+1} (Page {i+1})\n\n"
                for row in table:
                    # Clean row
                    clean_row = [str(cell).replace('\n', ' ').strip() if cell else "" for cell in row]
                    full_text += "| " + " | ".join(clean_row) + " |\n"
                full_text += "\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)
    
    print(f"Successfully extracted to {output_path}")

if __name__ == "__main__":
    pdf_file = "intelligence/pplaaf/20230629-Whistleblower-Protection-Regime-South-Africa.pdf"
    out_file = ".intelligence/extractions/pplaaf/whistleblower_protection_regime_2023.md"
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    
    extract_pdf_to_md(pdf_file, out_file)
