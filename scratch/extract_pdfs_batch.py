import pdfplumber
import os

files_to_process = [
    ("intelligence/anticorruption-govza/HSRC-GIZ_Headline Report_TRACKING SOCIAL NORMS AND BEHAVIOUR CHANGE IN SOUTH AFRICA 04072025.pdf", "hsrc_social_norms_headline_2025.md"),
    ("intelligence/anticorruption-govza/NACS IMPACT STORIES.pdf", "nacs_impact_stories.md"),
    ("intelligence/anticorruption-govza/EXEC SUMMARY_National Dialogue on Anti-Corruption Report 2024.pdf", "national_dialogue_exec_summary_2024.md"),
    ("intelligence/anticorruption-govza/Final Conference Report.pdf", "national_dialogue_final_conference_2024.md"),
    ("intelligence/unodc/Architecture Workstream.pdf", "architecture_workstream_audit.md"),
]

output_dir = ".intelligence/extractions/pending"

for pdf_path, md_name in files_to_process:
    print(f"Processing {pdf_path}...")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text_content = []
            # Extract at least first 50 pages if available
            pages_to_extract = min(len(pdf.pages), 50)
            for i in range(pages_to_extract):
                page = pdf.pages[i]
                text = page.extract_text()
                if text:
                    text_content.append(f"## Page {i+1}\n\n{text}\n")
            
            output_path = os.path.join(output_dir, md_name)
            with open(output_path, "w", encoding="utf-8") as f:
                f.write("\n".join(text_content))
            print(f"Successfully saved to {output_path}")
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
