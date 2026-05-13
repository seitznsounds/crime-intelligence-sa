import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2015 - 2016.pdf"

with pdfplumber.open(pdf_path) as pdf:
    with open("scratch/statssa_2015_stations.txt", "w", encoding="utf-8") as f:
        # Tables start around page 10
        for i in range(10, min(50, len(pdf.pages))):
            f.write(f"--- Page {i+1} ---\n")
            text = pdf.pages[i].extract_text()
            if text:
                f.write(text)
            f.write("\n\n")

print("Extracted pages for station mapping.")
