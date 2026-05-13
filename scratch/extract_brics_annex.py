import pdfplumber
import sys
import os

pdf_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\unodc\BRICS_2024_Annex_to_BRICS_Analytical_Note_on_Asset_Recovery.pdf"
output_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\unodc\brics_2024_asset_recovery_annex.txt"

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
