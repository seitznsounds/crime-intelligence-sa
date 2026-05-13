import pdfplumber
import sys
import os

pdf_path = r"intelligence/anticorruption-govza/Final Conference Report.pdf"
output_path = ".intelligence/extractions/anticorruption-govza/final_conference_report.md"

if not os.path.exists(pdf_path):
    print(f"File not found: {pdf_path}")
    sys.exit(1)

print(f"Extracting: {pdf_path}")

with pdfplumber.open(pdf_path) as pdf:
    text = f"# Extraction: Final Conference Report (National Dialogue 2024)\n\n"
    text += f"Source: {pdf_path}\n"
    text += f"Total Pages: {len(pdf.pages)}\n\n"
    
    for i in range(len(pdf.pages)):
        page_text = pdf.pages[i].extract_text()
        if page_text:
            text += f"## Page {i+1}\n\n{page_text}\n\n"
        
        tables = pdf.pages[i].extract_tables()
        if tables:
            for j, table in enumerate(tables):
                text += f"### Page {i+1} - Table {j+1}\n\n"
                for row in table:
                    clean_row = [str(cell).replace('\n', ' ').strip() if cell else "" for cell in row]
                    text += "| " + " | ".join(clean_row) + " |\n"
                text += "\n"

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)

print(f"Extraction complete: {output_path}")
