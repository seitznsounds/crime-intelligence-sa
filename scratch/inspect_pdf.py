import pdfplumber
import os

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2015 - 2016.pdf"

if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found.")
    exit(1)

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    
    # Extract first 5 pages to see index and intro
    for i in range(min(10, len(pdf.pages))):
        print(f"--- Page {i+1} ---")
        text = pdf.pages[i].extract_text()
        if text:
            print(text[:1000]) # Print first 1000 chars
        else:
            print("No text found (maybe scanned image)")
        
        # Check for tables
        tables = pdf.pages[i].extract_tables()
        if tables:
            print(f"Found {len(tables)} tables on page {i+1}")
            for j, table in enumerate(tables):
                print(f"Table {j+1}: {table[0] if table else 'Empty'}")
        print("\n" + "="*50 + "\n")
