import pypdf
import os

files = [
    "CLEAR-AA Landscape Analysis.pdf",
    "CLEAR-AA NACS Theory of Change.pdf",
]

base = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\intelligence\anticorruption-govza"
out_base = r"c:\Users\Faiz\Documents\workspaces\seitznsounds\crime-intelligence-sa\.intelligence\extractions\anticorruption-govza"
os.makedirs(out_base, exist_ok=True)

def clean(text):
    return "".join(c for c in (text or "") if ord(c) < 128 or c in "–—''""•")

for fname in files:
    pdf_path = os.path.join(base, fname)
    slug = fname.replace(" ", "_").replace(".pdf", "").lower()
    out_path = os.path.join(out_base, f"{slug}.md")
    reader = pypdf.PdfReader(pdf_path)
    print(f"Extracting {fname} ({len(reader.pages)} pages)...")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Forensic Extraction: {fname}\n\n**Pages**: {len(reader.pages)}\n\n")
        for i, page in enumerate(reader.pages):
            f.write(f"## Page {i+1}\n\n{clean(page.extract_text())}\n\n")
    print(f"  -> {out_path}")

print("Done.")
