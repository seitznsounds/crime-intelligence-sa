# 📥 Ingestion Mission: Dismantling the Shadow State

This document tracks the strategic analysis, distillation, and ingestion of high-fidelity intelligence from PPLAAF, NACAC, and UNODC sources. Our objective is to weaponize this data to expose the links between organized crime and institutional decay.

## 📊 Ingestion Status Overview

| Source Group | Total Files | Analyzed | Ingested | Status |
| :--- | :---: | :---: | :---: | :--- |
| **PPLAAF** (Whistleblower Protection) | 9 | 9 | 9 | ✅ COMPLETED |
| **Anticorruption-Govza** (National Strategy) | 18 | 10 | 10 | 🟡 ANALYZING |
| **UNODC / International** (Global Standards) | 25 | 9 | 9 | 🟡 ANALYZING |
| **Forensic Audits** (Real-time Intel) | 13 | 13 | 13 | ✅ COMPLETED |

---

## 🎯 Strategic Analysis & Priority Ranking

We prioritize ingestion based on the **Manifesto: Exposing the Helms of Power**.

### 1. High Priority: Protection & Law (PPLAAF)
*Focus: Whistleblower protection and legal frameworks for witness safety.*
*   **Rationale**: To democratize intelligence, we must understand the legal shield (or sword) facing those who speak out.
*   **Key Targets**: 
- [x] **Witness Protection Audit**: Act No.112, 1998 Forensic Extraction (Section 7 Pathology Identified).
- [x] **Legal Vulnerability Phase 2**: Audit of PPLAAF/DOJ Reform Paper (SLAPP/Blacklisting identified).
- [x] **Companies Act Phase 3**: Section 159 Loophole Audit (Former employees/Directors exclusion identified).

### 2. High Priority: The Accountability Gap (Anticorruption-Govza)
*Focus: National Anti-Corruption Strategy (NACS) and NACAC reports.*
*   **Rationale**: These documents represent the government's self-audit. We will cross-reference these with our **4.9x Reporting Gap** findings to expose institutional gaslighting.
*   **Key Targets**: 
- [x] **NACAC 2025 Report**: OPI/CMC structure extracted.
- [x] **Mthente M&E Framework**: CLEAR-AA indicators extracted.
- [x] **R12.4 Bn Audit**: National Treasury Q2 2025 Unpaid Invoices linked to departmental failures.

### 3. Medium Priority: Global Pressure (UNODC/International)
*Focus: International standards on asset recovery and police accountability.*
*   **Rationale**: Benchmarking South Africa against UN and G20 standards provides the "Global Pressure" required for systemic change.
*   **Key Targets**: 
- [x] **BRICS 2024**: Asset recovery benchmarks extracted.
- [x] **FATF 2024**: Gatekeeper protocols extracted.
- [ ] **OECD 2011**: Whistleblower compendium (Next in queue).

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
- [ ] `EXEC SUMMARY_National Dialogue on Anti-Corruption Report 2024.pdf`
- [ ] `Final Conference Report.pdf`
- [ ] `HSRC-GIZ_Headline Report_TRACKING SOCIAL NORMS AND BEHAVIOUR CHANGE IN SOUTH AFRICA 04072025.pdf`
- [ ] `NACS IMPACT STORIES.pdf`
- [ ] `NACS Vision 2040.jpg`
- [ ] `President Cyril Ramaphosa.pdf`
- [ ] `South Africa - Hive Document.pdf`
- [ ] `Draft NACS Monitoring Framework_20032024.xlsx`
- [ ] `Architecture Workstream.pdf`

### UNODC / International (Global Standards)
- [ ] `UNODC_2011_Handbook_on_Police_Accountability_Oversight_and_Integrity.pdf`
- [x] `BRICS_2024Analytical_Note_on_Asset_Recovery.pdf` (INGESTED)
- [ ] `FATF_2024_Horizontal_Review_of_Gatekeepers_Technical_Compliance.pdf`
- [ ] `G20_2025_Accountability_Report_on_Whistleblower_Protection.pdf`
- [ ] `About the NACS _ NACAC.pdf`
- [ ] `BRICS_2023_Johannesburg_Declaration.pdf`
- [ ] `BRICS_2024_Annex_to_BRICS_Analytical_Note_on_Asset_Recovery.pdf`
- [ ] `BRICS_2024_Brief_on_Activities_of_BRICS_Anti-Corruption_Working_Group_in_2024.pdf`
- [ ] `BRICS_2025_MFA_Chairs_Statement.pdf`
- [ ] `BRICS_2025_Rio_de_Janeiro_Declaration.pdf`
- [ ] `Commonwealth-Common-Law-Legal-Systems-en.pdf`
- [ ] `Declaration Statement _ 9Nov2023.pdf`
- [x] `G20_2015_Progress_Report_on_the_G20_Self_Assessment_on_Combatting_the_Bribery_of_Foreign_Public_Officials.pdf` (INGESTED)
- [ ] `Integrity Pledge_National Dialogue.pdf`
- [ ] `NACS Strategic Pillars_National Dialogue on 9 November 2023.pdf`
- [x] `OECD_2011_Study_on_Whistleblower_Protection_Frameworks_Compendium_of_Best_Practices_and_Guiding_Principles.pdf` (INGESTED)
- [x] `StAR_2026_Human_Rights_in_Asset_Recovery_Processes.pdf` (INGESTED)
- [ ] `UN_Convention_Against_Corruption.pdf` - **PENDING**
- [ ] `Stone Keynote for National Dialogue--Final Nov 2023.pdf`
- [x] `UNODC-WB_2012_On_the_Take_-_Criminalizing_Illicit_Enrichment_to_Fight_Corruption.pdf` (INGESTED)
- [ ] `UNODC_2008_Good_Practices_for_the_Protection_of_Witnesses_in_Criminal_Proceedings_Involving_Organized_Crime.pdf`
- [x] `UNODC_2011_Handbook_on_Police_Accountability_Oversight_and_Integrity.pdf` (INGESTED)
- [ ] `UNODC_2017_Handbook_on_Anti-Corruption_Measures_in_Prisons.pdf`
- [ ] `UNODC_2021_Speak_Up_for_Health_Guidelines.pdf`
- [x] `UN_Convention_Against_Corruption.pdf` (INGESTED)
- [ ] `Victims-report-05_0.pdf`

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
- [x] `National Treasury Q2 2025 Unpaid Invoices Audit` (INGESTED)
    - **Outcome**: R12.4 Billion high-risk expenditure identified. Provincial departments (97%) and DOJ&CD (49% of national) identified as primary failure nodes.
    - **UI**: Visualized in `AccountabilityDashboard`.
- [x] `PPLAAF Phase 2: Legal Vulnerability Audit` (INGESTED)
    - **Outcome**: Identified SLAPP suit fragility, industry blacklisting (ostracism scope), and physical impunity (98% unpunished retaliation).
    - **UI**: Visualized in `IncentiveCalculator`.
- [x] `Companies Act Phase 3: Section 159 Forensic Audit` (INGESTED)
    - **Outcome**: Identified major loopholes: Exclusion of former employees/directors, ambiguity on anonymity, and lack of external disclosure protection.
    - **UI**: Visualized in `IncentiveCalculator`.
- [x] `OECD 2011 Whistleblower Study: Global Benchmarking` (INGESTED)
    - **Outcome**: Established 10-30% reward range as global best practice (USA/Korea). Mapped against Zondo 15-25% recommendation.
    - **UI**: Visualized in `IncentiveCalculator`.
- [x] `StAR 2026: Human Rights in Asset Recovery` (INGESTED)
    - **Outcome**: Identified international benchmarks for asset return and social reuse of recovered funds.
    - **UI**: Visualized in `ReformTicker`.
- [x] `NACAC 2025 Advisory Framework` (INGESTED)
    - **Outcome**: Extracted OPI transition targets and whistleblower judge proposal.
    - **UI**: Visualized in `ReformTicker`.
- [x] `G20 2015: Foreign Bribery Assessment` (INGESTED)
    - **Outcome**: Established benchmarks for prosecution of enablers and foreign bribery enforcement.
    - **UI**: Visualized in `ReformTicker`.
- [x] `OPI Transition Audit (NACAC Ch. 3)` (INGESTED)
    - **Outcome**: Identified 3-year leadership vacuum risk and SIU proclamation bottleneck.
    - **UI**: Visualized in `ReformTicker` (OPI Trigger).
- [x] `SCM Spatial Heatmap Analysis` (INGESTED)
    - **Outcome**: Mapped provincial SCM lag to "Ghost Vendor" probability.
    - **UI**: Visualized in `SCMHeatmap`.
- [x] `UN Convention Against Corruption (UNCAC)` (INGESTED)
    - **Outcome**: Established international benchmarks for preventive anti-corruption bodies and mutual legal assistance.
    - **UI**: Visualized in `ReformTicker`.
- [x] `Municipal SCM Drill-Down (Big Five)` (INGESTED)
    - **Outcome**: Identified Johannesburg and Tshwane as critical municipal failure nodes.
    - **UI**: Visualized in `MunicipalSCMTracker`.
- [x] `OPI Transition Milestone Audit` (INGESTED)
    - **Outcome**: Tracked 5 key legislative and operational triggers for OPI readiness.
    - **UI**: Visualized in `OPITransitionTracker`.
- [x] `UNODC Police Accountability Handbook` (INGESTED)
    - **Outcome**: Established benchmarks for SAPS oversight, external monitoring, and disciplinary integrity.
    - **UI**: Visualized in `ReformTicker`.
- [x] `Cross-Border Asset Recovery (UNCAC Ch. V)` (INGESTED)
    - **Outcome**: Mapped detection, freezing, and return phases for R9.3 Bn in tracked assets.
    - **UI**: Visualized in `AssetRecoveryTracker`.
- [x] `Legislative Reform Feed Operationalization` (INGESTED)
    - **Outcome**: Integrated live ticker for Parliamentary monitoring.
    - **UI**: Visualized in `ReformFeed`.

---

## 🔍 Forensic Findings Log

### 📌 Finding ID: AFU-2025-001 (R12.4 Bn High-Risk Expenditure)
- **Source**: National Treasury 30-Day Non-Compliance Report (Q2 2025) / Transparency Portal
- **Data Point**: R12.4 Billion in unpaid invoices older than 30 days.
- **Critical Node**: Provincial departments account for 97% of total (Eastern Cape leads at R3.8B).
- **Pathology**: **Administrative Concealment** - Delayed payments are used to mask ghost vendor transactions and redirect funds into syndicate-controlled sub-accounts before final settlement.
- **Linking**: Linked to DOJ&CD (49% of national department unpaid invoices).

### 📌 Finding ID: PDA-2025-002 (Legal Vulnerability Audit Phase 3)
- **Source**: PPLAAF / DOJ Discussion Document / Companies Act Section 159 / OECD 2011
- **Vulnerability 1**: **SLAPP Suit Fragility** - No statutory protection against "spurious civil cases" designed to cause financial ruin.
- **Vulnerability 2**: **Ostracism Scope** - PDA/Sec 159 fails to address industry-wide blacklisting.
- **Vulnerability 3**: **Physical Impunity** - Retaliators go unpunished 98% of the time.
- **Vulnerability 4**: **Section 7 Loop** - Witness Protection Act Section 7 requires reporting to potentially implicated SAPS structures.
- **Vulnerability 5**: **Exclusion of Former Stakeholders** - Section 159 does not protect former directors or employees.
- **Vulnerability 6**: **Anonymity Ambiguity** - No statutory right to anonymous reporting in corporate structures.
- **Vulnerability 7**: **Proclamation Bottleneck** - SIU investigations are delayed by months/years awaiting Presidential Proclamation.
- **Vulnerability 8**: **OPI Leadership Vacuum** - 3-year transitional window (2025-2028) lacks a dedicated Constitutional champion, relying on political oversight (MoJ&CD).
- **Vulnerability 9**: **SIU-to-OPI Resource Attrition** - Risk of skilled forensic loss during institutional absorption without salary parity.

---

## 📊 Knowledge Graph Expansion Plan

- **Entities**: Extract names of officials mentioned in NACS reports and link them to `people` table.
- **Orgs**: Map the "Architecture Workstream" and link to `organizations`.
- **Links**: Create `person_org_links` for every official found in the "Asset Recovery" documents.
