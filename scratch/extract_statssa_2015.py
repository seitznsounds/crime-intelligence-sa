import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2015 - 2016.pdf"

with pdfplumber.open(pdf_path) as pdf:
    with open("scratch/statssa_2015_raw.txt", "w", encoding="utf-8") as f:
        # Extract first 40 pages which usually contain the key summary and tables
        num_pages = min(40, len(pdf.pages))
        for i in range(num_pages):
            f.write(f"--- Page {i+1} ---\n")
            text = pdf.pages[i].extract_text()
            if text:
                f.write(text)
            f.write("\n\n")

print(f"Extracted first {num_pages} pages of 2015-2016 report.")
