# Crime Intelligence SA: Development Roadmap

This roadmap tracks the immediate and upcoming operational tasks required to finalize Sprint 5 and advance the platform's intelligence capabilities. Tasks are designed to be implemented sequentially.

## Phase 1: Mobile UI/UX Rollout & Consolidation (Immediate)

_Goal: Deploy the new `ResponsiveDataGrid` and `FullScreenDataModal` across all remaining data-heavy pages._

- [x] **Accountability Board (`/accountability`)**: Refactor the Perpetrator grids and TRC Vault components to use responsive cards and loading skeletons.
- [x] **Expose Board (`/expose`)**: Integrate `<FullScreenDataModal>` for high-risk PEP dossiers and complex relationship maps.
- [x] **Restitution Board (`/restitution`)**: Update the historical map and list of displaced zones to be touch-friendly and use expandable charts.
- [x] **Geospatial Map (`/map`)**: Wrap the D3/SVG map in `<MobileExpandableChart>` and convert the absolute hotspot panel to a mobile dialog.

## Phase 2: Sprint 5 Dashboard Integration

**Objective**: Surface the freshly ingested forensic data (PPLAAF, NACAC, UNODC) into high-fidelity, interactive dashboards using our new responsive components.

- [x] **Assassination Board (External Retribution Tracker)**: Visualize the "Protection-Implementation Paradox" and the 98% physical impunity rate identified in the PPLAAF audit.
- [x] **Leadership Accountability Board**: Develop an interface for the 40+ Tier-1 PEPs and acting officials mapped during the National Government Leadership Audit.
- [x] **True Crime vs. Recorded Stats**: Built a dedicated interactive visualization module demonstrating the "4.9x Reporting Void" gap in official SAPS data (Integrated into `/stats`).

## Phase 3: New Operational Modules (Completed)

**Objective**: Build the next generation of platform tools to drive real-world accountability.

- [x] **WPU Vacancy Tracker**: Implemented a dashboard module tracking funding deficits and leadership vacancies in the Witness Protection Unit.
- [x] **Evidence Packaging Engine**: Built a backend service capable of aggregating platform dossiers into signed packages for international justice bodies (ICC/UN).
- [x] **Live Data Migration (Phase 3)**: Successfully transitioned 9+ investigative hubs to authoritative Supabase data, removing all major mock arrays.

## Phase 4: AI Link Inference & Deep Research (Active)

**Objective**: Transition from descriptive to inferential intelligence by predicting unknown corruption links.

- [x] **AI Link Inference Upgrades**: Implemented predictive linkage inference for "High Probability" corruption hubs using pgvector similarity and relationship graph analysis (Integrated into `PredictiveReformModel`).
- [x] **Deep Research Portal**: Integrated the `za_intelligence/deep-research-web-browser` Apify actor for on-demand investigative research within the UI.
- [x] **Forecasting Refinement**: Enhanced the probability engine with time-series analysis of link density spikes and SCM (Supply Chain Management) behavioral fingerprints.
- [x] **Sophisticated About Page**: Implemented a "Command Center" about page featuring the platform's Manifesto, technical Architecture Engine, and live system Telemetry.

## Phase 5: Deployment, PWA & Field Readiness (Antigravity Focus)

**Objective**: Finalize the platform for high-stakes investigative field use and ensure cross-platform operationality.

- [ ] **PWA & Offline Optimization**: Implement service workers and local caching (IndexedDB) for investigation rosters and high-risk dossiers in low-connectivity zones.
- [ ] **Biometric Access Tier**: Integrate WebAuthn (Biometrics) for secure "Step-up" authentication when accessing high-risk evidence packages.
- [x] **Live News Ingestion Pipeline**: Integrated Paystack donation system and optimized global UI/UX for dual-theme accessibility.
- [ ] **Advanced Witness Protection Interface**: Expand the WPU module with client-side PGP-encrypted incident logs and a mobile "Panic Button" for field operatives.
- [ ] **Automated Sentiment Intelligence**: Deploy background tasks to adjust PEP risk scores based on breaking news sentiment analysis from SA news sources.

## Phase 6: Forensic Legal Intelligence & Network Expansion (Completed)

**Objective**: Harness authoritative legal data to unmask beneficial ownership networks and bridge the gap between field reports and judicial outcomes.

- [x] **Cross-Source Entity Linking**: Developed the "Resolution Engine" (`scripts/resolve_case_lifecycle.ts`) linking 150+ news incidents to court judgments for a full "Case Lifecycle" view.
- [x] **Interactive Relationship Graphs**: Deployed `<RelationshipGraph />` on judgment dossiers to surface judge-defendant-event clusters.
- [x] **Deep Beneficial Ownership Audits**: Implemented automated `deep-research` triggers for defendants to unmask shell company networks (Integrated into `scripts/audit_beneficial_ownership.ts`).
- [x] **Intelligence Stream Integration**: Launched the `IntelligenceDrawer` providing a global real-time feed of latest judicial and field intelligence.
- [ ] **Attorney-Syndicate Mapping**: Implemented analysis script; awaiting larger dataset for visual cluster deployment.

## Phase 7: Asset Recovery & Citizen Corroboration (Active)

**Objective**: Convert intelligence into tangible results by tracking asset forfeitures and empowering citizen-led verification.

- [ ] **Asset Recovery Tracker**: Extract "Application for Forfeiture" results from judgments to build a live leaderboard of recovered state assets and seized syndicate property.
- [ ] **Citizen Corroboration Protocol**: Implement a ZKP-secured interface for whistleblowers to "Add Context" or "Corroborate" news incidents with private forensic assets.
- [ ] **Syndicate Hierarchy Reconstruction**: Automatically update the `syndicates` table using inferred links between legal parties, attorneys, and common directors.
- [ ] **Government Gazette Pipeline**: Deploy the official Gazette scraper to track state tender awards and director changes as high-fidelity capture signals.
- [ ] **Legal Heatmap Module**: Visualize the volume and severity of criminal judgments across the 14 High Court divisions of South Africa.
