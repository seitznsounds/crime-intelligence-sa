import pdfplumber
import json
import os

files = [
    "Annual-Crime-2021_2022-web.pdf",
    "Annual_Report_2020.pdf",
    "April-2022_23-presentation.pdf",
    "April-to-March 2020_21-presentation.pdf",
    "April_June 2020_2021.pdf"
]

base_path = "intelligence/saps/crime-stats/"

def search_keywords(file_path):
    print(f"Searching keywords in {file_path}")
    results = {}
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages[:20]): # Check first 20 pages
            text = page.extract_text()
            if not text:
                continue
            text_lower = text.lower()
            if "national crime" in text_lower or "total" in text_lower or "serious crime" in text_lower or "murder" in text_lower:
                results[i] = text[:500] # Store first 500 chars
    return results

for file in files:
    file_path = os.path.join(base_path, file)
    keywords = search_keywords(file_path)
    print(f"Found keywords in {file} at pages: {list(keywords.keys())}")
    # print(json.dumps(keywords, indent=2))
