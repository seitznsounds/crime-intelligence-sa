# 📥 Ingestion Mission: Dismantling the Shadow State

This document tracks the strategic analysis, distillation, and ingestion of high-fidelity intelligence from PPLAAF, NACAC, and UNODC sources. Our objective is to weaponize this data to expose the links between organized crime and institutional decay.

## 📊 Ingestion Status Overview

| Source Group | Total Files | Analyzed | Ingested | Status |
| :--- | :---: | :---: | :---: | :--- |
| **PPLAAF** (Whistleblower Protection) | 9 | 9 | 9 | ✅ COMPLETED |
| **Anticorruption-Govza** (National Strategy) | 18 | 18 | 18 | ✅ COMPLETED |
| **UNODC / International** (Global Standards) | 25 | 25 | 25 | ✅ COMPLETED |
| **SAPS Crime Statistics** (Raw Data) | 50 | 50 | 50 | ✅ COMPLETED |
| **Forensic Audits** (Real-time Intel) | 13 | 13 | 13 | ✅ COMPLETED |

---

## 🎯 Strategic Analysis & Priority Ranking

We prioritize ingestion based on the **Manifesto: Exposing the Helms of Power**.

### 1. High Priority: SAPS Crime Statistics (Raw Data)
*Focus: Official crime figures and annual reports from SAPS, IPID, and PSiRA.*
*   **Rationale**: This granular data provides the baseline for identifying **Reporting Gaps** and **Institutional Decay**.
*   **Key Targets**: 
- [ ] **2025-2026 Quarterly Stats**: Real-time trend monitoring.
- [ ] **IPID Annual Reports**: Tracking police misconduct and accountability.
- [ ] **PSiRA Reports**: Mapping the private security landscape and its links to formal policing.

### 2. High Priority: Protection & Law (PPLAAF)
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

### SAPS Crime Statistics (Raw Data)
- [x] `2022-2023-Q2-crime-stats.xlsx` (INGESTED)
- [x] `2022-2023-Q3-crime-stats.xlsx` (INGESTED)
- [x] `2022-2023-Q4-crime-stats.xlsx` (INGESTED)
- [x] `2025-2026_-_1st_Quarter_WEB.pdf` (INGESTED)
- [x] `2025-2026_-_1st_Quarter_WEB.xlsx` (INGESTED)
- [x] `2025-2026_-_2nd_Quarter_WEB.pdf` (INGESTED)
- [x] `2025-2026_-_2nd_Quarter_WEB.xlsx` (INGESTED)
- [x] `2025-2026_-_3rd_Quarter_WEB.pdf` (INGESTED)
- [x] `2025-2026_-_3rd_Quarter_WEB.xlsx` (INGESTED)
- [x] `4th-Quarter-January 2023-March 2023.pdf` (INGESTED)
- [x] `Annual-Crime-2021_2022-web.pdf` (INGESTED)
- [x] `Annual_Report_2020.pdf` (INGESTED)
- [x] `April-2022_23-presentation.pdf` (INGESTED)
- [x] `April-to-March 2020_21-presentation.pdf` (INGESTED)
- [x] `April_June 2020_2021.pdf` (INGESTED)
- [x] `april_june_2021_22_quarter1_presentation.pdf` (INGESTED)
- [x] `april_to_march_2019_20_presentation.pdf` (INGESTED)
- [x] `Crime-Statistics-2019_2020.xlsx` (INGESTED)
- [x] `Crime-Statistics-2020_2021-Release.xlsx` (INGESTED)
- [x] `Crime-Statistics-2021_2022-latest.xlsx` (INGESTED)
- [x] `crime_statistics_fourth_qaurter 2020_2021_current.xlsx` (INGESTED)
- [x] `crime_statistics_july_september_2020_21.xlsx` (INGESTED)
- [x] `crime_statistics_third_qaurter 2020_2021.xlsx` (INGESTED)
- [x] `First Quarter Crime data 2022_2023.xlsx` (INGESTED)
- [x] `first_quarter 2020_2021_crime_statistics.xlsx` (INGESTED)
- [x] `First_Quarter_Crime_Data 2021_2022.xlsx` (INGESTED)
- [x] `fourth_quarter_2020_21_crimestats.pdf` (INGESTED)
- [x] `fourth_quarter_2021_2022_release.xlsx` (INGESTED)
- [x] `fourth_quarter_presentation_2021_2022.pdf` (INGESTED)
- [x] `Hawks_Organigram_2025.png` (IDENTIFIED)
- [x] `IPID Annual Report 2022 - 2023.pdf` (INGESTED)
- [x] `July-to-September-2022-Presentation.pdf` (INGESTED)
- [x] `july_to_september_2020_21_crime_situation.pdf` (INGESTED)
- [x] `july_to_september_2021_22_quarter2_presentation.pdf` (INGESTED)
- [x] `Media-Statement-IR-Welcomes-DOJ-CD-Minister-Decision-on-Sex-Offender-Register-Publishing-04-March-2025.pdf` (INGESTED)
- [x] `October-2022-to-December-2022.pdf` (INGESTED)
- [x] `october_to_december_2020_21_crimestats.pdf` (INGESTED)
- [x] `PSiRA - Annual Report 2023-24.pdf` (INGESTED)
- [x] `PSiRA Annual Report 2019.pdf` (INGESTED)
- [x] `PSiRA Annual Report 2021-2022.pdf` (INGESTED)
- [x] `PSiRA AR 2020_21_FINAL_28September2021.pdf` (INGESTED)
- [x] `PSiRA-AnnualReport2016-17-FA-ScreenRes.pdf` (INGESTED)
- [x] `PSIRA_Annual Report 2023_web_301023.pdf` (INGESTED)
- [x] `PSIRA_Annual Report 2024_25.pdf` (INGESTED)
- [x] `PSIRA_AR2018_final.pdf` (INGESTED)
- [x] `SABRIC-CRIME-STATISTICS-REPORT-2024.pdf` (INGESTED)
- [x] `SABRIC_annual-report-2024.pdf` (INGESTED)
- [x] `second_quarter_2021_2022_release.xlsx` (INGESTED)
- [x] `third_quarter_2021_2022_release.xlsx` (INGESTED)
- [x] `third_quarter_presentation_2021_2022.pdf` (INGESTED)

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
- [x] `EXEC SUMMARY_National Dialogue on Anti-Corruption Report 2024.pdf` (INGESTED)
- [x] `Final Conference Report.pdf` (INGESTED)
- [x] `HSRC-GIZ_Headline Report_TRACKING SOCIAL NORMS AND BEHAVIOUR CHANGE IN SOUTH AFRICA 04072025.pdf` (INGESTED)
- [x] `NACS IMPACT STORIES.pdf` (INGESTED)
- [ ] `NACS Vision 2040.jpg`
- [x] `President Cyril Ramaphosa.pdf` (INGESTED)
- [x] `South Africa - Hive Document.pdf` (INGESTED)
- [x] `Draft NACS Monitoring Framework_20032024.xlsx` (INGESTED)
- [x] `Architecture Workstream.pdf` (INGESTED)

### UNODC / International (Global Standards)
- [ ] `UNODC_2011_Handbook_on_Police_Accountability_Oversight_and_Integrity.pdf`
- [x] `BRICS_2024Analytical_Note_on_Asset_Recovery.pdf` (INGESTED)
- [x] `FATF_2024_Horizontal_Review_of_Gatekeepers_Technical_Compliance_Related_to_Corruption.pdf` (INGESTED)
- [x] `G20_2025_Accountability_Report_on_Whistleblower_Protection.pdf` (INGESTED)
- [ ] `About the NACS _ NACAC.pdf`
- [x] `BRICS_2023_Johannesburg_Declaration.pdf` (INGESTED)
- [x] `BRICS_2024_Annex_to_BRICS_Analytical_Note_on_Asset_Recovery.pdf` (INGESTED)
- [x] `BRICS_2024_Brief_on_Activities_of_BRICS_Anti-Corruption_Working_Group_in_2024.pdf` (INGESTED)
- [x] `BRICS_2025_MFA_Chairs_Statement.pdf` (INGESTED)
- [x] `BRICS_2025_Rio_de_Janeiro_Declaration.pdf` (INGESTED)
- [x] `Commonwealth-Common-Law-Legal-Systems-en.pdf` (INGESTED)
- [x] `Declaration Statement _ 9Nov2023.pdf` (INGESTED)
- [x] `G20_2015_Progress_Report_on_the_G20_Self_Assessment_on_Combatting_the_Bribery_of_Foreign_Public_Officials.pdf` (INGESTED)
- [x] `Integrity Pledge_National Dialogue.pdf` (INGESTED)
- [x] `NACS Strategic Pillars_National Dialogue on 9 November 2023.pdf` (INGESTED)
- [x] `OECD_2011_Study_on_Whistleblower_Protection_Frameworks_Compendium_of_Best_Practices_and_Guiding_Principles.pdf` (INGESTED)
- [x] `StAR_2026_Human_Rights_in_Asset_Recovery_Processes.pdf` (INGESTED)
- [ ] `UN_Convention_Against_Corruption.pdf` - **PENDING**
- [x] `Stone Keynote for National Dialogue--Final Nov 2023.pdf` (INGESTED)
- [x] `UNODC-WB_2012_On_the_Take_-_Criminalizing_Illicit_Enrichment_to_Fight_Corruption.pdf` (INGESTED)
- [x] `UNODC_2008_Good_Practices_for_the_Protection_of_Witnesses_in_Criminal_Proceedings_Involving_Organized_Crime.pdf` (INGESTED)
- [x] `UNODC_2011_Handbook_on_Police_Accountability_Oversight_and_Integrity.pdf` (INGESTED)
- [x] `UNODC_2017_Handbook_on_Anti-Corruption_Measures_in_Prisons.pdf` (INGESTED)
- [x] `UNODC_2021_Speak_Up_for_Health_Guidelines.pdf` (INGESTED)
- [x] `UN_Convention_Against_Corruption.pdf` (INGESTED)
- [x] `Victims-report-05_0.pdf` (INGESTED)

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
- [x] `National Government Leadership Audit (May 2026)` (INGESTED)
    - **Outcome**: 40+ Tier-1 PEPs and institutional leadership mapped across Justice, Police, and Defence.
    - **Nexus Points**: Linking suspended and acting officials to institutional decay dossiers.
    - **UI**: Visualized in `ExposeBoard`.

---

## 🔍 Forensic Findings Log

### 📌 Finding ID: NORM-2025-001 (The "Political Connections" Premium)
- **Source**: HSRC-GIZ Social Norms Headline Report (2025)
- **Vulnerability**: 61% of South Africans believe political connections are essential/very important for "getting ahead".
- **Pathology**: **Network-Based Patronage** - Success is perceived as a function of political proximity rather than merit.
- **Data Scientist Note**: This outweighs bribery (42%) as a perceived success driver, indicating that "who you know" is more valuable than "who you pay".

### 📌 Finding ID: NORM-2025-002 (The Testimony Gap)
- **Source**: HSRC-GIZ Social Norms Headline Report (2025)
- **Vulnerability**: Significant drop-off between reporting (59% willing) and testifying in court (48% willing).
- **Pathology**: **Culture of Fear / Physical Impunity** - Citizens fear the visibility of the court precinct.
- **Data Scientist Note**: The 11% delta represents the "Silence Void" where evidence dies before reaching prosecution.

### 📌 Finding ID: NORM-2025-003 (Occupational Infiltration)
- **Source**: HSRC-GIZ Social Norms Headline Report (2025)
- **Vulnerability**: ~20% of the workforce admits their specific occupation is a hotbed of bribery and rule-bending.
- **Pathology**: **Institutionalized Rule-Bending** - In certain sectors, corruption is a normalized part of professional duty.
- **Data Scientist Note**: Cross-reference with SAPS/SCM data to identify which professions feel most compromised.

### 📌 Finding ID: NORM-2025-004 (Sextortion Parallelism)
- **Source**: HSRC-GIZ Social Norms Headline Report (2025)
- **Vulnerability**: Near-identical indirect experience rates for public (11%) and private (10%) sector sexual extortion.
- **Pathology**: **Cross-Sectoral Patriarchy** - Sexual exploitation is not limited to state services but extends to "sex for jobs/promotions" in the private sector.

### 📌 Finding ID: WB-2025-001 (Incentive Benchmarking)
- **Source**: Final Conference Report: Strengthening Whistleblower Protection Mechanisms (2025)
- **Vulnerability**: High personal and financial risk for "corruption resistors" (e.g., Cynthia Stimpel).
- **Pathology**: Lack of financial safety net for those who save the state billions.
- **Solution**: Awarding a percentage (e.g., 10%) of recovered assets as an incentive for contribute to successful convictions.

### 📌 Finding ID: WB-2025-002 (Reverse Burden of Proof)
- **Source**: Final Conference Report: Strengthening Whistleblower Protection Mechanisms (2025)
- **Vulnerability**: Difficulty for whistleblowers to prove retaliation links.
- **Pathology**: PDA/Labour law imbalance.
- **Solution**: Shifting the burden of proof to the employer in PDA retaliation cases.

### 📌 Finding ID: WB-2025-003 (Recognition of Sextortion)
- **Source**: Final Conference Report: Strengthening Whistleblower Protection Mechanisms (2025)
- **Vulnerability**: Gendered corruption risks in education and public service.
- **Pathology**: Gender-blind anti-corruption frameworks.
- **Solution**: Recognition of "sex for marks/jobs" as corruption and implementation of gender-responsive policies.

### 📌 Finding ID: WB-2025-004 (The "Impipi" Pathology)
- **Source**: Final Conference Report: Strengthening Whistleblower Protection Mechanisms (2025)
- **Vulnerability**: Historical stigma demonizing reporting as "snitching" (apartheid legacy).
- **Pathology**: Cultural barrier to accountability.
- **Solution**: Behavioral change campaign to glorify whistleblowers as "Ubuntu" heroes.

### 📌 Finding ID: NACS-2024-001 (The OPI Transition)
- **Source**: National Dialogue on Anti-Corruption Report 2024 (Executive Summary)
- **Vulnerability**: Existing anti-corruption agencies (Hawks, NPA, SIU) encounter significant resource and capacity challenges.
- **Pathology**: Fragmented institutional architecture.
- **Solution**: Establishment of the **Office of Public Integrity (OPI)** as a Chapter 9 institution within one year, leveraging SIU resources.

### 📌 Finding ID: NACS-2024-002 (Procurement Vulnerability)
- **Source**: National Dialogue on Anti-Corruption Report 2024 (Executive Summary)
- **Vulnerability**: Bid rigging, irregular contracts, and inadequate contract management.
- **Pathology**: High susceptibility of public procurement to syndicate infiltration.
- **Solution**: Mandatory e-procurement and blacklisting of corrupt suppliers.

### 📌 Finding ID: NACS-2024-003 (Whistleblower Fragility)
- **Source**: National Dialogue on Anti-Corruption Report 2024 (Executive Summary)
- **Vulnerability**: Retaliation and lack of support for those exposing corruption.
- **Pathology**: Stigmatization of whistleblowing; limited scope of Protected Disclosures Act.
- **Solution**: Legislative reform to criminalize retaliation and establish independent disclosure management bodies.

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

## 📊 Knowledge Graph Expansion Plan [COMPLETED]

- **Entities**: Extracted 40+ Tier-1 PEPs and institutional officials from NACS and National Government audits; linked to `people` table.
- **Orgs**: Mapped 12+ government departments and specialized units (OPI, PKTT, SSA, etc.) to `organizations`.
- **Links**: Created 100+ `person_org_links` and relationship nodes for tracked officials, including suspended and acting leadership.
