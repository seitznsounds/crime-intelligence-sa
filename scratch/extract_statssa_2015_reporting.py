import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2015 - 2016.pdf"

with pdfplumber.open(pdf_path) as pdf:
    with open("scratch/statssa_2015_reporting.txt", "w", encoding="utf-8") as f:
        # Extract pages 60 to 80 which contain the reporting rates
        for i in range(59, 80):
            if i < len(pdf.pages):
                f.write(f"--- Page {i+1} ---\n")
                text = pdf.pages[i].extract_text()
                if text:
                    f.write(text)
                f.write("\n\n")

print("Extracted reporting rate pages from 2015-2016 report.")
