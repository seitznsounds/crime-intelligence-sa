import pdfplumber
import sys
import os

pdf_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\unodc\UNODC_2008_Good_Practices_for_the_Protection_of_Witnesses_in_Criminal_Proceedings_Involving_Organized_Crime.pdf"
output_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\unodc\unodc_witness_protection_2008.txt"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    sys.exit(1)

# Ensure output directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with pdfplumber.open(pdf_path) as pdf:
    text = ""
    for i in range(min(len(pdf.pages), 20)):
        page_text = pdf.pages[i].extract_text()
        if page_text:
            text += f"--- Page {i+1} ---\n{page_text}\n\n"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)

print(f"Extraction complete: {output_path}")
