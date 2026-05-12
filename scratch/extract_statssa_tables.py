import pdfplumber

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2015 - 2016.pdf"

with pdfplumber.open(pdf_path) as pdf:
    # Let's check page 96 (index was page-based, but PDF page index might differ)
    # The TOC says Page 96.
    # Let's check a range around 90-110.
    for i in range(95, 105):
        if i >= len(pdf.pages): break
        print(f"--- Page {i+1} ---")
        tables = pdf.pages[i].extract_tables()
        if tables:
            print(f"Found {len(tables)} tables")
            for j, table in enumerate(tables):
                print(f"Table {j+1}:")
                for row in table[:10]: # Print first 10 rows
                    print(row)
        else:
            print("No tables found")
        print("\n" + "="*50 + "\n")
