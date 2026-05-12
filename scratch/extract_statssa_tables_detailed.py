import pdfplumber
import pandas as pd

pdf_path = "intelligence/statssa/Crime Statistics South Africa 2017 - 2018.pdf"

def clean_table(table):
    if not table: return None
    return pd.DataFrame(table[1:], columns=table[0])

with pdfplumber.open(pdf_path) as pdf:
    # Table 6: Housebreaking by Province (Page 21)
    # Note: PDF index is usually p-1, so Page 21 is index 20.
    # But in the raw text Page 21 was index 20.
    
    print("--- Extracting Table 6 (Housebreaking by Province) ---")
    p21 = pdf.pages[20]
    tables = p21.extract_tables()
    for i, t in enumerate(tables):
        print(f"Table {i+1} on Page 21:")
        for row in t: print(row)

    print("\n--- Extracting Table 8 (Home Robbery by Province) ---")
    p25 = pdf.pages[24]
    tables = p25.extract_tables()
    for i, t in enumerate(tables):
        print(f"Table {i+1} on Page 25:")
        for row in t: print(row)
        
    print("\n--- Extracting Table 15 (Murder Statistics) ---")
    p38 = pdf.pages[37]
    tables = p38.extract_tables()
    for i, t in enumerate(tables):
        print(f"Table {i+1} on Page 38:")
        for row in t: print(row)
