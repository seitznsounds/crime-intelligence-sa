import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2017 - 2018.pdf"

with pdfplumber.open(pdf_path) as pdf:
    with open("scratch/statssa_analysis_raw.txt", "w", encoding="utf-8") as f:
        for i in range(min(30, len(pdf.pages))):
            f.write(f"--- Page {i+1} ---\n")
            text = pdf.pages[i].extract_text()
            if text:
                f.write(text)
            f.write("\n\n")

print("Raw text extracted to scratch/statssa_analysis_raw.txt")
