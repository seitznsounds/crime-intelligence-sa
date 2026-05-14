// Intelligence Metrics & Policy Data
// This data is server-side and intended to be fetched via Server Actions.
// Source: NACAC 2025, HSRC Social Norms, Zondo Vol 6, PPLAAF Audit.

export const REPORTING_METRICS = [
  { label: "Public Willingness to Report", value: 59, color: "bg-emerald-500", suffix: "%" }, // From INGEST.md: 59% willing to report
  { label: "Willingness to Testify", value: 48, color: "bg-accent-blue", suffix: "%" }, // From INGEST.md: 48% willing to testify
  { label: "Fear of Retaliation", value: 62, color: "bg-accent-crimson", suffix: "%" }, // From INGEST.md: 62% fear retaliation
  { label: "Perceived Political Connections Value", value: 61, color: "bg-accent-gold", suffix: "%" }, // From INGEST.md: 61% connections essential
];

export const SOCIAL_NORM_METRICS = [
  { label: "Bribe Solicitation Exposure", value: 51, type: "negative" },
  { label: "Sextortion Indirect Exposure", value: 11, type: "negative" }, // From INGEST.md: 11% public sector
  { label: "Belief Ordinary People Get Punished", value: 46, type: "neutral" },
  { label: "Institutionalized Rule-Bending", value: 20, type: "negative" }, // From INGEST.md: ~20% workforce
  { label: "Elite Impunity Index", value: 54, type: "negative" },
  { label: "Zero Tolerance Stance", value: 27, type: "positive" },
];

export const ZONDO_PILLARS = [
  { id: 1, title: "National Anti-Corruption Charter", status: "proposed", priority: "high" },
  { id: 2, title: "Whistleblower Financial Rewards", status: "proposed", priority: "critical" },
  { id: 3, title: "Dedicated Procurement Agency (OPI)", status: "in_progress", priority: "critical" },
  { id: 4, title: "Corporate Deferred Prosecution", status: "proposed", priority: "medium" },
  { id: 5, title: "Procurement Officers Professional Body", status: "in_progress", priority: "high" },
  { id: 6, title: "Public Procurement Transparency", status: "enacted", priority: "high" },
  { id: 7, title: "Accounting Officer Protection (Good Faith)", status: "proposed", priority: "medium" },
  { id: 8, title: "PRECCA Hardening", status: "in_progress", priority: "high" },
  { id: 9, title: "Criminalise Tender-for-Donation", status: "proposed", priority: "critical" },
  { id: 10, title: "Specific Procurement Legislation", status: "enacted", priority: "high" },
];

export const LEGISLATIVE_GAPS = [
  { law: "PDA (Protected Disclosures Act)", gap: "Reactive vs Proactive: Only covers 'occupational detriment' after harm occurs.", severity: "critical", fix: "Introduce immediate interim relief & protection orders" },
  { law: "PDA (Protected Disclosures Act)", gap: "The 'Secret' Loophole: Zero protection for disclosures involving State Secrets (PIA 1982).", severity: "critical", fix: "Repeal PIA 1982; integrate security disclosures into PDA" },
  { law: "PDA (Protected Disclosures Act)", gap: "No protection against 'External Harm' (Blacklisting, SLAPP suits, family threats).", severity: "critical", fix: "Broaden scope to include non-occupational retaliation" },
  { law: "PDA (Protected Disclosures Act)", gap: "Reverse Onus Deficit: Burden of proof remains largely on the whistleblower.", severity: "high", fix: "Implement full reverse onus for all detrimental acts" },
  { law: "Witness Protection Act", gap: "Section 7 Loop: Requires reporting to potentially implicated SAPS structures.", severity: "high", fix: "Consolidate into an independent Whistleblower Agency" },
  { law: "Companies Act (Section 159)", gap: "Exclusion of Former Stakeholders: Does not protect former directors or employees.", severity: "high", fix: "Broaden definition of 'eligible' whistleblowers" },
  { law: "Environmental Acts (NEMA)", gap: "Asymmetry: High rewards for env crimes vs zero for state capture.", severity: "medium", fix: "Standardise 15-25% rewards across all corruption types" },
];
