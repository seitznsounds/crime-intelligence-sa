import pypdf
import os

pdf_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\anticorruption-govza\CLEAR-AA-Mthente NACS M&E Framework.pdf"
output_path = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\anticorruption-govza\clear_aa_mthente_me_framework.md"

os.makedirs(os.path.dirname(output_path), exist_ok=True)

print(f"Starting efficient extraction: {pdf_path}")

def clean_text(text):
    if not text:
        return ""
    return "".join(i for i in text if ord(i) < 128 or i in "–—‘’“”•")

try:
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction (Text): CLEAR-AA-Mthente NACS M&E Framework\n\n")
        f.write(f"**Total Pages**: {total_pages}\n\n")
        
        for i in range(total_pages):
            f.write(f"## Page {i+1}\n\n")
            page = reader.pages[i]
            text = page.extract_text()
            if text:
                f.write(clean_text(text) + "\n\n")
            
            if (i + 1) % 10 == 0:
                print(f"Processed page {i+1}/{total_pages}")
                f.flush()

    print(f"Extraction complete: {output_path}")
except Exception as e:
    print(f"Error: {e}")
