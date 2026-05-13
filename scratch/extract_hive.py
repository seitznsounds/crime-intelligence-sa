import pdfplumber
import sys
import os

pdf_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\anticorruption-govza\South Africa - Hive Document.pdf"
output_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\anticorruption-govza\south_africa_hive_document.txt"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    sys.exit(1)

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with pdfplumber.open(pdf_path) as pdf:
    text = ""
    for i in range(len(pdf.pages)):
        page_text = pdf.pages[i].extract_text()
        if page_text:
            text += f"--- Page {i+1} ---\n{page_text}\n\n"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)

print(f"Extraction complete: {output_path}")
