import pdfplumber
import os

pdf_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\pplaaf\Protection of Information Act 1982-084.pdf"
output_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\pplaaf\protection_of_information_act_1982.md"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Starting extraction: {pdf_path}")

def clean_text(text):
    if not text:
        return ""
    return "".join(i for i in text if ord(i) < 128)

with pdfplumber.open(pdf_path) as pdf:
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction: Protection of Information Act 1982\n\n")
        for i, page in enumerate(pdf.pages):
            f.write(f"## Page {i+1}\n\n")
            text = page.extract_text()
            if text:
                f.write(clean_text(text) + "\n\n")
            
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    f.write("| " + " | ".join([clean_text(str(cell)) for cell in row]) + " |\n")
                f.write("\n")
            
            print(f"Processed page {i+1}/{len(pdf.pages)}")

print(f"Extraction complete: {output_path}")
