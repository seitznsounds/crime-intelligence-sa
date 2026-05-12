# 📥 Ingestion Mission: Dismantling the Shadow State

This document tracks the strategic analysis, distillation, and ingestion of high-fidelity intelligence from PPLAAF, NACAC, and UNODC sources. Our objective is to weaponize this data to expose the links between organized crime and institutional decay.

## 📊 Ingestion Status Overview

| Source Group | Total Files | Analyzed | Ingested | Status |
| :--- | :---: | :---: | :---: | :--- |
| **PPLAAF** (Whistleblower Protection) | 9 | 9 | 9 | ✅ COMPLETED |
| **Anticorruption-Govza** (National Strategy) | 18 | 0 | 0 | 🟥 QUEUED |
| **UNODC / International** (Global Standards) | 25 | 0 | 0 | 🟥 QUEUED |

---

## 🎯 Strategic Analysis & Priority Ranking

We prioritize ingestion based on the **Manifesto: Exposing the Helms of Power**.

### 1. High Priority: Protection & Law (PPLAAF)
*Focus: Whistleblower protection and legal frameworks for witness safety.*
*   **Rationale**: To democratize intelligence, we must understand the legal shield (or sword) facing those who speak out.
*   **Key Targets**: `20230629-Whistleblower-Protection-Regime-South-Africa.pdf` [INGESTED], `Act No.112, 1998 Witness Protection Act.pdf` [INGESTED].

### 2. High Priority: The Accountability Gap (Anticorruption-Govza)
*Focus: National Anti-Corruption Strategy (NACS) and NACAC reports.*
*   **Rationale**: These documents represent the government's self-audit. We will cross-reference these with our **4.9x Reporting Gap** findings to expose institutional gaslighting.
*   **Key Targets**: `National Anti-Corruption Advisory Council Report August 2025.pdf`, `National Dialogue Report 2024`.

### 3. Medium Priority: Global Pressure (UNODC/International)
*Focus: International standards on asset recovery and police accountability.*
*   **Rationale**: Benchmarking South Africa against UN and G20 standards provides the "Global Pressure" required for systemic change.
*   **Key Targets**: `UNODC_2011_Handbook_on_Police_Accountability.pdf`, `BRICS_2024Analytical_Note_on_Asset_Recovery.pdf`.

---

## 🛠️ Operational Workflow

For each document, we execute the **Agentic Intelligence Protocol**:

1.  **Stage 1: Forensic Extraction** ([pdf-processing](.agents/skills/pdf-processing/SKILL.md)) ✅
    *   Extract full text and structured tables.
    *   Cleanse OCR errors and sanitize metadata.
2.  **Stage 2: Semantic Distillation** ([data-scientist](.agents/skills/data-scientist/SKILL.md)) ✅
    *   Identify PEPs (Politically Exposed Persons) and Syndicates.
    *   Map "Corruption Links" and "Reporting Gaps".
    *   Generate vector embeddings for `ai_knowledge_base`.
3.  **Stage 3: Deep Contextualization** ([deep-research-notebooklm](.agents/skills/deep-research-notebooklm/SKILL.md)) ✅
    *   Research entities against historical records.
    *   Generate research briefs for the **Expose Board**.
4.  **Stage 4: Verified Ingestion** ✅
    *   Upsert into `historical_records`, `people`, `incidents`, and `ai_knowledge_base`.
    *   Refresh materialized views to update dashboards.

---

## 📝 Detailed Task Tracker

### PPLAAF (South Africa Whistleblower Focus)
- [x] `20230629-Whistleblower-Protection-Regime-South-Africa.pdf` (INGESTED)
- [x] `Act No.112, 1998 Witness Protection Act.pdf` (INGESTED)
- [x] `Criminal Procedure Act 51 of 1977 1977-051.pdf` (INGESTED)
- [x] `Prevention of Corrupt Activities Act of 2003 pacocaa2004470.pdf` (INGESTED)
- [x] `Protection of Information Act 1982-084.pdf` (INGESTED)
- [x] `Witness Protection Act 112 of 1998 1998-112.pdf` (REDUNDANT - See Act 112 above)
- [x] `report_2017.pdf` (INGESTED)
- [x] `report_2020.pdf` (INGESTED)
- [x] `south-africa.md` (INGESTED)

### Anticorruption-Govza (National Strategy)
- [ ] `National Anti-Corruption Advisory Council Report August 2025.pdf`
- [ ] `National Dialogue on Anti-Corruption Report 2024-Digital Version.pdf`
- [ ] `HSRC-GIZ_Final Report_TRACKING SOCIAL NORMS AND BEHAVIOUR CHANGE.pdf`
- [ ] `Mthente Literature Review Corruption in South Africa.pdf`
- [ ] (Remaining 14 files...)

### UNODC / International (Global Standards)
- [ ] `UNODC_2011_Handbook_on_Police_Accountability_Oversight_and_Integrity.pdf`
- [ ] `BRICS_2024Analytical_Note_on_Asset_Recovery.pdf`
- [ ] `FATF_2024_Horizontal_Review_of_Gatekeepers_Technical_Compliance.pdf`
- [ ] `G20_2025_Accountability_Report_on_Whistleblower_Protection.pdf`
- [ ] (Remaining 21 files...)

---

## 📊 Knowledge Graph Expansion Plan

- **Entities**: Extract names of officials mentioned in NACS reports and link them to `people` table.
- **Orgs**: Map the "Architecture Workstream" and link to `organizations`.
- **Links**: Create `person_org_links` for every official found in the "Asset Recovery" documents.
