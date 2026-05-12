# Forensic Intelligence Distillation: Prevention of Corrupt Activities Act (PRECCA) 2003

## 🛡️ Metadata
- **Act No**: 12 of 2004
- **Commencement**: 27 April 2004 (Section 34(2) on 31 July 2004)
- **Scope**: Public and Private Sector Corruption
- **Vulnerability Status**: High (Systemic reporting failures)

## 🎯 Intelligence Points

### 1. The "Duty to Report" (Section 34) - [CRITICAL VULNERABILITY]
- **The Mandate**: Any person in a "position of authority" who knows or *ought reasonably to have known/suspected* that an offence (Corruption, Theft, Fraud > R100k) has been committed MUST report it to a police official.
- **Target Entities**: 
    - Directors-General / Heads of Departments.
    - Municipal Managers.
    - Senior Management Service (SMS) in public bodies.
    - Directors and Managers of companies (including CEOs/Partners).
- **The Loophole**: While failure to report is an offence (Section 34(2)), enforcement is virtually non-existent for high-level officials who "wilfully ignore" red flags. This section is the primary baseline for our **Incentive Calculator** (reversing the failure to report into a reward for reporting).

### 2. Register for Tender Defaulters (Section 28-33)
- **Mechanism**: A centralized register maintained by the National Treasury for persons/enterprises convicted of corruption in contracts/tenders.
- **Sanction**: Barred from government tenders for 10 to 15 years.
- **Operational Gap**: Despite the law, the Register for Tender Defaulters has historically been under-utilized, with many "defaulters" continuing to operate under shell companies.

### 3. Witness & Evidence Coercion (Section 11)
- **The Offence**: Criminalizes any gratification given or received to:
    - Testify in a "particular way" (Untruthful testimony).
    - **Withhold a Police Docket** or evidential material.
    - Alter, destroy, or conceal records to impair availability for trial.
- **Syndicate Vector**: This is the section most frequently violated by "Dockets disappearing" in high-profile corruption cases.

### 4. Unexplained Wealth Triggers (Section 22-23)
- **The Investigation**: Allows the National Director of Public Prosecutions (NDPP) to apply for an "investigation direction" if a person possesses property disproportionate to their known sources of income.
- **Intelligence Use**: This provides the legal framework for our platform's "Asset Tracking" of PEPs.

### 5. Extraterritorial Jurisdiction (Section 35)
- **Global Reach**: South African courts have jurisdiction over corruption committed anywhere in the world by a citizen, resident, or SA-registered company.
- **Implication**: Enables prosecution of offshore state capture architects (e.g., in Dubai or the UK).

## 🚀 Actionable Intelligence for Platform
1. **Reporting Thresholds**: Set R100,000 as the "Legal Mandatory Trigger" in the Incident Reporter.
2. **Duty Holders**: Map all Tier 1 and Tier 2 PEPs as "Section 34 Duty Holders." If an incident is verified on our platform involving their department, and no report exists, they are in breach of Section 34.
3. **Tender Defaulter Cross-Reference**: Integrate the Register for Tender Defaulters (if available via API/Scraping) into the **Expose Board**.

## 🧬 Relationship Mapping
- **Linked Table**: `historical_records` (Legal Baselines)
- **Linked Table**: `ai_knowledge_base` (Legislative Logic)
- **Linked Table**: `people` (Mapping duty holders)
- **Cross-Reference**: Criminal Procedure Act 1977 (Section 204/205) vs. PRECCA 2003 (Section 34 reporting).
