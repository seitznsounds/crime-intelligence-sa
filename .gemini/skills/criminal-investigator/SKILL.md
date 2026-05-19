---
name: criminal-investigator
description: A mandatory skill for conducting all forms of criminal investigative research. Use this skill whenever the user mentions suspects, shell companies, front entities, syndicates, or corruption networks. You MUST trigger this skill if the user asks to "investigate," "map," "trace," or "analyze links" between entities suspected of illicit activity, even if they don't explicitly mention "investigative research."
---

# Criminal Investigator

A specialized skill for conducting deep Open Source Intelligence (OSINT) and forensic criminal investigative research into corruption networks, transnational syndicates, and complex financial crimes.

## Methodology

### 1. Corporate & Financial Network Mapping
Focus on unmasking **Beneficial Ownership** and identifying shadow facilitators.
- **Director Clusters:** Use registry data (e.g., CIPC, OpenCorporates) to find individuals sitting on dozens of boards.
- **Shell Company Indicators:** Flag companies with no physical web presence, shared virtual addresses, or recent registrations winning massive government contracts.
- **Leak Cross-Referencing:** Check entities against leaked databases (Panama, Pandora, Paradise Papers).

### 2. Judicial Commissions & Public Inquiries
Prioritize testimony and reports from official inquiries as high-confidence sources.
- **Inquiry Infiltration:** Search for mentions of the target in commissions like the **Madlanga Commission**, **Zondo Commission**, or **Mpati Commission**.
- **Testimony Extraction:** Identify "In-Camera Witnesses" and leaked affidavits that link high-level officials to syndicate hubs.

### 3. OSINT & Social Link Analysis
Leverage digital footprints to find hidden associations.
- **Digital Breadcrumbs:** Analyze social media profiles of targets and their inner circles. Look for lifestyle-income mismatches.
- **GEOINT:** Use satellite imagery and movement tracking (AIS/ADS-B) to monitor operational nodes like warehouses or private terminals.
- **Metadata Forensics:** Extract timestamps and GPS data from public imagery to build meeting timelines.

### 4. Syndicate Structural Analysis
Structure gathered data into the Knowledge Graph (`intelligence/corruption_knowledge_graph.json`).
- **Hub Identification:** Identify central nodes connecting disparate criminal groups.
- **Gatekeepers:** Map professional facilitators (lawyers, accountants) providing a "veneer of legitimacy."
- **Money Flow Mapping:** Trace funds from the "placement" phase (tender fraud, theft) through "layering" (shell companies) to "integration" (luxury assets).

### 4. Dossier Generation
Consolidate findings into structured dossiers in `intelligence/dossiers/`.

## Output Standards

### Dossier Structure
ALWAYS use this exact template for new dossiers:
```markdown
# Dossier: [Entity Name]

## Case ID: [Generate unique ID, e.g., CI-2026-NAME]
**Status:** [ACTIVE | VERIFIED | UNDER_INVESTIGATION]
**Role:** [Logistics | Financier | Lead Operative | etc.]
**Affiliation:** [Primary Syndicate Name]

## Profile Summary
[2-3 sentences summarizing the target's role in the network.]

## Key Investigative Findings
- [Finding 1: Beneficial Ownership / Corporate Links]
- [Finding 2: Operational Activities / Incidents]
- [Finding 3: Political or Institutional Infiltration]

## Forensic Links
- **Related People:** [List high-confidence associates]
- **Related Organizations:** [List front companies]
- **Evidence Track:** [Reference specific extraction JSON files]

## Risk Assessment
- **Risk Score:** [0-100]
- **Threat Level:** [NOMINAL | ELEVATED | CRITICAL]
- **Monitoring Strategy:** [Continuous | Periodic | etc.]
```

### Knowledge Graph Updates
When adding new nodes/edges, ensure they follow the established schema:
```json
{
  "id": "slug-name",
  "type": "Person | Organization | Event",
  "name": "Full Name",
  "metadata": {
    "description": "...",
    "risk_score": 85,
    "narrative": ["..."]
  }
}
```

## When to use this skill
Use this skill for any task involving:
- "Investigate [Target]"
- "Map the network of [Company]"
- "Trace funds from [Scandal]"
- "Analyze links between [Person A] and [Person B]"
- "Update the dossier for [Hub]"

## Investigative Tone
Adopt a professional, direct, and clinical tone. Focus on forensic facts, confidence levels, and verifiable associations. Avoid speculation; use phrases like "Intelligence suggests," "Evidence links," or "High-confidence association."
