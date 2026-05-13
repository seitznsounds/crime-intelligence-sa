import pdfplumber
import os

pdf_path = r"C:\users\Faiz\documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\unodc\UN_Convention_Against_Corruption.pdf"
output_path = r".intelligence/extractions/unodc/uncac_full_text.txt"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    exit(1)

extracted_text = ""

with pdfplumber.open(pdf_path) as pdf:
    # Extract first 40 pages for key provisions (Articles 1-60)
    for i in range(min(40, len(pdf.pages))):
        text = pdf.pages[i].extract_text()
        if text:
            extracted_text += f"--- Page {i+1} ---\n{text}\n\n"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(extracted_text)

print(f"Extraction complete: {output_path}")
