import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2017 - 2018.pdf"

with pdfplumber.open(pdf_path) as pdf:
    with open("scratch/statssa_analysis_raw_p2.txt", "w", encoding="utf-8") as f:
        # Start from page 31 (index 30) to page 60
        start_page = 30
        end_page = min(60, len(pdf.pages))
        for i in range(start_page, end_page):
            f.write(f"--- Page {i+1} ---\n")
            text = pdf.pages[i].extract_text()
            if text:
                f.write(text)
            f.write("\n\n")

print(f"Text from pages {start_page+1} to {end_page} extracted to scratch/statssa_analysis_raw_p2.txt")
