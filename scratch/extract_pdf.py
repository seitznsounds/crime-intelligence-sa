import pdfplumber
import sys
import os

pdf_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\unodc\UNODC-WB_2012_On_the_Take_-_Criminalizing_Illicit_Enrichment_to_Fight_Corruption.pdf"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    sys.exit(1)

with pdfplumber.open(pdf_path) as pdf:
    # Extracting first 20 pages for distillation
    text = ""
    for i in range(min(len(pdf.pages), 20)):
        page_text = pdf.pages[i].extract_text()
        if page_text:
            text += f"--- Page {i+1} ---\n{page_text}\n\n"
    
    with open("distilled_unodc.txt", "w", encoding="utf-8") as f:
        f.write(text)

print("Extraction complete: distilled_unodc.txt")
