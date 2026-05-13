import pandas as pd
import json
import os
import re

def process_saps_excel(file_path):
    print(f"Processing {file_path}...")
    try:
        xl = pd.ExcelFile(file_path)
    except Exception as e:
        print(f"Error opening {file_path}: {e}")
        return None

    sheet_names = xl.sheet_names
    top30_sheet = None
    
    # Try to find the Top 30 sheet
    for name in sheet_names:
        if 'top' in name.lower() and '30' in name.lower():
            top30_sheet = name
            break
    
    if not top30_sheet:
        print(f"Could not find Top 30 sheet in {file_path}. Sheets: {sheet_names}")
        # Fallback: try searching for '17' or 'serious'
        for name in sheet_names:
            if '17' in name or 'serious' in name.lower():
                top30_sheet = name
                break
    
    if not top30_sheet:
        return None

    df = pd.read_excel(file_path, sheet_name=top30_sheet)
    
    # Find the row where "RSA Position" or similar is 1
    # Often the header is not at the top.
    
    start_row = -1
    for i, row in df.iterrows():
        row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
        if 'RSA' in row_str and 'Position' in row_str:
            # Check if next rows have '1'
            pass
        
        # Check if any cell in the row is 1 and another is 'Station' or 'Province'
        row_list = [str(val).strip() for val in row.values]
        if '1' in row_list and any(x in row_list for x in ['Station', 'STATION']):
             start_row = i
             break
        
        # Sometimes it's the row above the '1'
        if any(x in row_list for x in ['Station', 'STATION', 'Province', 'PROVINCE']) and any(x in row_list for x in ['Position', 'POSITION']):
            # Look at next row
            if i + 1 < len(df):
                next_row_list = [str(val).strip() for val in df.iloc[i+1].values]
                if '1' in next_row_list:
                    start_row = i
                    break

    if start_row == -1:
        # Try another approach: look for '17 Community reported serious Crime'
        for i, row in df.iterrows():
            row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
            if '17' in row_str and 'Community' in row_str:
                start_row = i
                break

    if start_row == -1:
        print(f"Could not find start row in {top30_sheet}")
        return None

    # Re-read with correct header
    df = pd.read_excel(file_path, sheet_name=top30_sheet, skiprows=start_row)
    
    # Clean up column names
    df.columns = [str(c).replace('\n', ' ').strip() for c in df.columns]
    
    # Identify Top 30 for "17 Community reported serious Crime"
    # Note: Sometimes the file is JUST the Top 30 for that category.
    # Sometimes it has multiple tables.
    
    # Look for "17 Community reported serious Crime" in the sheet or header
    # Let's assume the first 30 rows of data are what we want if it looks like a Top 30 list.
    
    # Find where data starts (row with '1' in Position column)
    pos_col = None
    for col in df.columns:
        if 'Position' in col or 'Pos' in col:
            pos_col = col
            break
    
    if not pos_col:
        # Try first column
        pos_col = df.columns[0]

    # Filter for the top 30
    top_30_data = []
    found_count = 0
    for i, row in df.iterrows():
        try:
            val = str(row[pos_col]).strip()
            if val.isdigit() and int(val) <= 30:
                station_info = {
                    "position": int(val),
                    "station": row.get('Station', row.get('STATION', 'Unknown')),
                    "province": row.get('Province', row.get('PROVINCE', 'Unknown')),
                    "count": row.get(df.columns[-1], 0) # Usually the latest year is the last column
                }
                # Try to get specific year count
                for col in df.columns:
                    if '202' in col or '201' in col:
                         station_info["count"] = row[col]
                
                top_30_data.append(station_info)
                found_count += 1
                if found_count >= 30 and int(val) == 30:
                    break
        except:
            continue

    # Extract National Totals
    # Usually in a sheet called 'National' or 'RSA'
    national_totals = {"total_serious_crimes": None, "murder": None}
    
    potential_total_sheets = [s for s in sheet_names if s.lower() in ['national', 'rsa', 'table 1', 'summary']]
    if not potential_total_sheets:
        potential_total_sheets = sheet_names # Search all if not found
        
    for s in potential_total_sheets:
        tdf = pd.read_excel(file_path, sheet_name=s)
        for i, row in tdf.iterrows():
            row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
            if 'Total serious' in row_str or '17 Community' in row_str:
                # Find the number in this row
                nums = [val for val in row.values if isinstance(val, (int, float))]
                if nums:
                    national_totals["total_serious_crimes"] = nums[-1]
            if 'Murder' in row_str and 'Attempted' not in row_str:
                nums = [val for val in row.values if isinstance(val, (int, float))]
                if nums:
                    national_totals["murder"] = nums[-1]
        if national_totals["total_serious_crimes"] and national_totals["murder"]:
            break

    return {
        "file": os.path.basename(file_path),
        "national_totals": national_totals,
        "top_30_stations_community_serious_crime": top_30_data
    }

files_to_process = [
    "Crime-Statistics-2019_2020.xlsx",
    "Crime-Statistics-2020_2021-Release.xlsx",
    "Crime-Statistics-2021_2022-latest.xlsx",
    "crime_statistics_fourth_qaurter 2020_2021_current.xlsx",
    "crime_statistics_july_september_2020_21.xlsx",
    "crime_statistics_third_qaurter 2020_2021.xlsx",
    "First Quarter Crime data 2022_2023.xlsx",
    "first_quarter 2020_2021_crime_statistics.xlsx",
    "First_Quarter_Crime_Data 2021_2022.xlsx",
    "fourth_quarter_2021_2022_release.xlsx",
    "second_quarter_2021_2022_release.xlsx",
    "third_quarter_2021_2022_release.xlsx"
]

base_dir = "intelligence/saps/crime-stats/"
output_dir = ".intelligence/distillations/saps/"
os.makedirs(output_dir, exist_ok=True)

results = []
for filename in files_to_process:
    file_path = os.path.join(base_dir, filename)
    if os.path.exists(file_path):
        data = process_saps_excel(file_path)
        if data:
            output_file = os.path.join(output_dir, filename.replace('.xlsx', '.json'))
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Saved {output_file}")
            results.append(filename)
        else:
            print(f"Failed to process {filename}")
    else:
        print(f"File not found: {file_path}")

print(f"\nProcessed {len(results)} files.")
