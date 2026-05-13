import pdfplumber

pdf_path = "intelligence/saps/crime-stats/Annual-Crime-2021_2022-web.pdf"

with pdfplumber.open(pdf_path) as pdf:
    with open("scratch/saps_annual_2021_text.txt", "w", encoding="utf-8") as f:
        for i in range(10, min(60, len(pdf.pages))):
            f.write(f"--- Page {i+1} ---\n")
            text = pdf.pages[i].extract_text()
            if text:
                f.write(text)
            f.write("\n\n")

print("Extracted text from 2021-2022 annual report.")
