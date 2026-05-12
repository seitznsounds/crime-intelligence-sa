# 📥 Ingestion Mission: Dismantling the Shadow State

This document tracks the strategic analysis, distillation, and ingestion of high-fidelity intelligence from PPLAAF, NACAC, and UNODC sources. Our objective is to weaponize this data to expose the links between organized crime and institutional decay.

## 📊 Ingestion Status Overview

| Source Group | Total Files | Analyzed | Ingested | Status |
| :--- | :---: | :---: | :---: | :--- |
| **PPLAAF** (Whistleblower Protection) | 9 | 9 | 9 | ✅ COMPLETED |
| **Anticorruption-Govza** (National Strategy) | 18 | 10 | 10 | 🟡 ANALYZING |
| **UNODC / International** (Global Standards) | 25 | 0 | 0 | 🟥 QUEUED |
| **Forensic Audits** (Real-time Intel) | 1 | 1 | 1 | ✅ COMPLETED |

---

## 🎯 Strategic Analysis & Priority Ranking

We prioritize ingestion based on the **Manifesto: Exposing the Helms of Power**.

### 1. High Priority: Protection & Law (PPLAAF)
*Focus: Whistleblower protection and legal frameworks for witness safety.*
*   **Rationale**: To democratize intelligence, we must understand the legal shield (or sword) facing those who speak out.
*   **Key Targets**: 
- [x] **Witness Protection Audit**: Act No.112, 1998 Forensic Extraction (Section 7 Pathology Identified).
- [x] **Asset Recovery Benchmarking**: BRICS 2024 Analytical Note (1% Global Recovery Rate & Presidential Bottleneck Ingested).
- [ ] **UNODC Global Standards**: 21 Files remaining (Batch Pipeline Initialized).

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
- [x] `National Anti-Corruption Advisory Council Report August 2025.pdf` (INGESTED)
- [x] `National Dialogue on Anti-Corruption Report 2024-Digital Version.pdf` (INGESTED)
- [x] `HSRC Policy Brief Silent witness.pdf` (INGESTED)
- [x] `HSRC-GIZ_Final Report_TRACKING SOCIAL NORMS AND BEHAVIOUR CHANGE.pdf` (INGESTED)
- [x] `Mthente Literature Review Corruption in South Africa.pdf` (INGESTED)
- [x] `CLEAR-AA Landscape Analysis.pdf` (INGESTED)
- [x] `CLEAR-AA NACS Theory of Change.pdf` (INGESTED)
- [x] `CLEAR-AA Priorities for Public Sector.pdf` (INGESTED)
- [x] `CLEAR-AA-Mthente NACS M&E Framework.pdf` (INGESTED)
- [x] `Mthente_HandOver_Report_23072024.pdf` (INGESTED)
- [ ] (Remaining 9 files...)

### UNODC / International (Global Standards)
- [ ] `UNODC_2011_Handbook_on_Police_Accountability_Oversight_and_Integrity.pdf`
- [x] `BRICS_2024Analytical_Note_on_Asset_Recovery.pdf` (INGESTED)
- [ ] `FATF_2024_Horizontal_Review_of_Gatekeepers_Technical_Compliance.pdf`
- [ ] `G20_2025_Accountability_Report_on_Whistleblower_Protection.pdf`
- [ ] (Remaining 21 files...)

### Forensic Audits (Real-time Operational Intelligence)
- [x] `Major General Feroz Khan Arrest Dossier (May 2026)` (INGESTED)
    - **Outcome**: 11 Tier-1 PEPs/Suspects, 11 Organizations (Cartels/SAPS), 3 Major Incidents (Gold/Drugs/Tenders).
    - **Nexus Points**: Point Blank Security <-> SAPS SCM <-> Big Five Cartel.
    - **UI**: Visualized in `SapsInfiltrationHub`.
- [x] `CLEAR-AA / Mthente NACS M&E Framework (2025)` (INGESTED)
    - **Outcome**: 6-pillar indicator framework, performance index.
    - **UI**: Visualized in `AccountabilityDashboard`.
- [x] `SAPS Officer Violence and Mental Health.md` (INGESTED)
    - **Outcome**: Extracted systemic decay metrics, 12+ high-profile people/PEPs, 4 major incidents, and statistical trends on suicide and GBVF.
    - **Nexus Points**: Madlanga Commission findings linked to National Commissioner and "Big Five" Cartel.
- [x] `Witness Protection Act (No. 112 of 1998) Forensic Audit` (INGESTED)
    - **Outcome**: Identified Section 7 "Reporting Void" pathology.
    - **UI**: Visualized in `IncentiveCalculator`.
- [x] `BRICS 2024 Asset Recovery Benchmarking` (INGESTED)
    - **Outcome**: Identified 1% global recovery rate and Presidential bottleneck.
    - **UI**: Visualized in `AccountabilityDashboard`.

---

## 📊 Knowledge Graph Expansion Plan

- **Entities**: Extract names of officials mentioned in NACS reports and link them to `people` table.
- **Orgs**: Map the "Architecture Workstream" and link to `organizations`.
- **Links**: Create `person_org_links` for every official found in the "Asset Recovery" documents.
