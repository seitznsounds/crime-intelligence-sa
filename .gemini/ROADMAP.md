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
- [x] **Attorney-Syndicate Mapping**: Implemented analysis script (`scripts/analyze_legal_clusters.ts`) to detect shared defense attorneys across multiple criminal syndicates.

## Phase 7: Asset Recovery & Citizen Corroboration (Completed)

**Objective**: Convert intelligence into tangible results by tracking asset forfeitures and empowering citizen-led verification.

- [x] **Asset Recovery Tracker**: Launched `/stats/recovery` dashboard to track state asset forfeitures and seized syndicate property extracted from high court rulings.
- [x] **Citizen Corroboration Protocol**: Deployed ZKP-secured whistleblower interface (`<CorroborationModal />`) for public context injection into forensic records.
- [x] **Syndicate Hierarchy Reconstruction**: Automatically updated the `organizations` table using inferred links from judicial metadata (+140 new forensic organization nodes).
- [x] **Government Gazette Pipeline**: Established a high-fidelity ingestion pipeline (`scripts/scrape_gazettes.ts`) tracking tender awards and liquidation signals.
- [x] **Legal Heatmap Module**: Launched the Judicial Intelligence Heatmap (`/justice/heatmap`) to visualize criminal judgment density across High Court divisions.

## Phase 8: UX Accessibility & Plain-Language Overhaul (Completed)

**Objective**: Demystify the platform's technical jargon and make high-stakes intelligence accessible to the general public.

- [x] **Plain-Language Navigation**: Refactored `navigation.ts` and `Navbar.tsx` to use accessible terminology ("Data" instead of "Statistics & Maps") and optimized header layout for readability.
- [x] **Page-Level Context (Guidance)**: Implemented an expandable `guidance` tooltip in `<PageShell>` across 15+ core modules to explain page functionality in simple terms.
- [x] **Cross-Navigation Engine**: Deployed `<WhatNext>` component dynamically at the bottom of all modules to prevent user dead-ends and suggest logical next steps.
- [x] **First-Visit Onboarding**: Integrated `<OnboardingBanner>` on the homepage to clearly communicate the platform's mission to new users.

## Phase 9: Financial Intelligence & Asset Tracking (Completed)

**Objective**: Expand the database to capture the exact links between money, power, and crime by tracking physical and corporate assets.

- [x] **Asset Database Upgrades**: Migrated the schema to include `assets` and `entity_asset_links` to capture Shell Companies, Vehicles, Real Estate, Trusts, and Crypto Wallets.
- [x] **Relational Intelligence Dashboards**: Upgraded `/admin/syndicates` to automatically compute syndicate Risk Scores based on known associates' aggregated threat levels.
- [x] **Asset & Associate Linking UI**: Built comprehensive UI modals allowing admins to register assets and forge "Known Associate" connections directly inside the syndicate profiles, updating operational footprint dynamically.

# Operational Cycle: Watchdog Omega (Upcoming)

**Objective**: Scaling the automated research fleet, establishing external data-sharing protocols, and hardening field security.

- [ ] **Automated PIR Watchdog**: Deploy daily cron tasks to scan for deltas on all 10 Priority Intelligence Requirements.
- [ ] **Forensic Media Kits**: Export high-fidelity investigative reports as signed PDF packages for journalism partners.
- [ ] **Real-time Incident Trigger**: Auto-dispatch `deep-research` actors when high-severity incidents appear in the field ticker.
- [ ] **PWA & Offline Optimization**: Implement service workers and local caching (IndexedDB) for investigation rosters in low-connectivity zones.
- [ ] **Biometric Access Tier**: Secure high-risk evidence nodes behind WebAuthn-based step-up authentication.
- [ ] **Advanced Witness Protection Interface**: Expand the WPU module with client-side PGP-encrypted incident logs and a mobile "Panic Button" for field operatives.
