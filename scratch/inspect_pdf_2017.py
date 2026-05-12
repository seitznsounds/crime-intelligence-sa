import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2017 - 2018.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    for i in range(10):
        print(f"--- Page {i+1} ---")
        text = pdf.pages[i].extract_text()
        if text:
            print(text[:500])
        else:
            print("No text")
