import pdfplumber
import os

pdf_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\pplaaf\report_2017.pdf"
output_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\pplaaf\report_2017.md"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Starting extraction: {pdf_path}")

def clean_text(text):
    if not text:
        return ""
    return "".join(i for i in text if ord(i) < 128)

with pdfplumber.open(pdf_path) as pdf:
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction: PPLAAF Report 2017\n\n")
        for i, page in enumerate(pdf.pages):
            f.write(f"## Page {i+1}\n\n")
            text = page.extract_text()
            if text:
                f.write(clean_text(text) + "\n\n")
            
            print(f"Processed page {i+1}/{len(pdf.pages)}")

print(f"Extraction complete: {output_path}")
