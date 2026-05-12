import pdfplumber
import os

pdf_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\anticorruption-govza\National Anti-Corruption Advisory Council Report August 2025.pdf"
output_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\anticorruption-govza\nacac_report_2025.md"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Starting extraction: {pdf_path} (62MB - This may take a while)")

def clean_text(text):
    if not text:
        return ""
    # Filter non-ascii but keep common punctuation/symbols
    return "".join(i for i in text if ord(i) < 128 or i in "–—‘’“”•")

with pdfplumber.open(pdf_path) as pdf:
    total_pages = len(pdf.pages)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction: National Anti-Corruption Advisory Council (NACAC) Report - August 2025\n\n")
        f.write(f"**Total Pages**: {total_pages}\n\n")
        
        # Limit to first 100 pages for initial forensic audit if it's too large, 
        # but the user wants "Forensic Extraction", so I'll try all but monitor.
        # Actually, let's do all.
        for i, page in enumerate(pdf.pages):
            f.write(f"## Page {i+1}\n\n")
            
            # Extract Text
            text = page.extract_text()
            if text:
                f.write(clean_text(text) + "\n\n")
            
            # Extract Tables if present
            tables = page.extract_tables()
            for table_index, table in enumerate(tables):
                f.write(f"### Table {table_index + 1} (Page {i+1})\n\n")
                for row in table:
                    # Clean each cell
                    clean_row = [clean_text(cell) if cell else "" for cell in row]
                    f.write("| " + " | ".join(clean_row) + " |\n")
                f.write("\n")
                
            if (i + 1) % 10 == 0:
                print(f"Processed page {i+1}/{total_pages}")

print(f"Extraction complete: {output_path}")
