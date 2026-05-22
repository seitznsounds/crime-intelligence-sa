# Tool Boundaries (DO NOT REMOVE)

- If you are the Antigravity Agent: Only use the `~/.gemini/antigravity/` folder. Use `/.mcp.json` (in root folder) for MCP servers. Ignore `/.gemini/GEMINI-MCP.md` and `/.gemini/settings.json` because this is for Gemini CLI. Do not attempt to use CLI extensions.
- If you are the Gemini CLI: Do not attempt to sync, mix, or treat Antigravity's MCPs (like Sequential Thinking or Linear) as 'missing'. You must use the `extensions/` directory and `settings.json`.

# Google Antigravity — Crime Intelligence SA

## Persona

You are a senior TypeScript architect and digital vigilante for justice.
Your objective is to build high-fidelity intelligence systems that dismantle systemic corruption through radical transparency and premium Next.js engineering.

@/agents/rules/project-rules.md

# 🛡️ Manifesto: Exposing the Helms of Power

Crime in South Africa is not just a street-level issue; it is a systemic failure engineered from the top.

- **The Root Cause**: Corruption at the highest helms of power allows crime to flourish.
- **The Facilitators**: Hijackers and drug dealers are symptoms; the ones they work for—the police officers who make dockets disappear and the officials who turn stolen cars into "legal" assets—are the true targets.
- **The Objective**: If we do not expose the criminals in power, they will always roam free while the citizens suffer. We use data as our weapon to disrupt this cycle.

# 🎯 Mission: Radical Transparency

- **Democratize Intelligence**: Provide free, uncorrupted data to every citizen.
- **Expose High-Level Corruption**: Document and highlight the links between organized crime and government officials.
- **Systemic Accountability**: Track the "lifecycle" of crime—from the street to the official who legitimizes it.

# 🚀 Operational Progress (June 2026)

### 1. Ingestion Protocol [COMPLETED]

- **Resilient Pipeline**: Processed 32k+ records with exponential backoff and smart date sanitization.
- **Schema Hardening**: Automated metadata flattening for deeply nested intelligence points.

### 2. UI/UX Design System [COMPLETED]

- **Dossier Aesthetic**: Codified in `.agents/skills/ui-ux/SKILL.md`.
- **Premium Tokens**: Custom glassmorphism, monospaced typography (JetBrains Mono), and high-precision icons (Lucide).

### 3. Intelligence Hub [COMPLETED]

- **Cinematic Landing**: Staggered Framer Motion entrances and operational counters.
- **Expose Board**: Risk-ranked technical dossier cards for PEPs and syndicates.
- **Network Map**: Interactive SVG-based visualization of corruption links and operational hubs.

### 4. Geospatial Intelligence [COMPLETED]

- **Global Crime Heatmap**: Interactive 3D visualization of crime density across South Africa.
- **Station Performance Leaderboard**: Deep-dive audits and comparative ranking of all 1,154 SAPS stations (Note: Data currently covers 2005 - 2016).

### 5. Predictive Analysis [COMPLETED]

- **AI Corruption Forecasting**: Utilizing link analysis to detect emerging corruption hubs.
- **Syndicate Hierarchy Mapping**: Automated generation of organizational charts for major syndicates.

### 6. Citizen Evidence Portal [COMPLETED]

- **Secure Uplink**: Anonymous 4-step reporting flow with simulated AES-256 encryption.
- **Evidence Drop**: High-fidelity drag-and-drop uploader with metadata stripping protocols.
- **Admin Security Gate**: Verified queue system for vetting citizen intelligence and mapping aliases to authoritative entities.
- **Archival Rejections**: Moderation engine requiring reasoned rejections that archive rather than delete invalid reports.

### 7. Community Governance [COMPLETED]

- **Whistleblower Protection 2.0**: Zero-Knowledge proofs for anonymous verification.
- **Citizen Voting**: Democratic prioritization portal for investigative targets.

### 8. Historical Excavation & Accountability [COMPLETED]

- **Apify RAG Integration**: Utilizing `za_intelligence/rag-web-browser` to backfill pre-apartheid historical records.
- **Accountability Board**: Tracking unpunished perpetrators of crimes against humanity.
- **Victim Tributes**: Living monument for TRC Volume 7 narratives.
- **Reclaim the Land**: Historical displacement mapping and stolen land dossiers.

### 9. Institutional Audits & Global Pressure [COMPLETED]

- **State Department Audits**: Utilizing TRC Volume 4 to audit historical and modern institutional decay (SAPS, SADF).
- **Amnesty Tracker**: Mapping the findings of the TRC Amnesty Committee (Volume 6).
- **Live Incident Ticker**: Real-time Supabase integration for surfacing street-level intelligence as it happens.
- **Global Transparency Index**: Benchmarking SA investigative data against international corruption standards.

### 10. TRC Report Vault Backfilling [COMPLETED]

- **Dynamic Ingestion**: Transitioned from hardcoded arrays to Supabase-backed orchestration for TRC Volumes 1-7.
- **RAG Automation**: Implemented Server Actions to trigger the `za_intelligence/rag-web-browser` Apify actor.
- **Live Monitoring**: Integrated Supabase Realtime for instant UI status updates (QUEUED -> INDEXING -> CRAWLED -> INDEXED).
- **Agentic Analysis Protocol [COMPLETED]**: Successfully executed a three-stage local workflow for all 7 volumes:
  1. **Stage 1: Local Capture**: Apify actor crawled TRC data and saved to `.intelligence/backfills/`.
  2. **Stage 2: Agentic Distillation**: Antigravity (AI assistant) distilled raw markdown into 26+ high-fidelity structured intelligence records (Biko, Botha, Vlakplaas, Machel, etc.).
  3. **Stage 3: Verified Upsert**: Executed custom ingestion scripts (`ingest-volN-distilled.ts`) to populate `historical_records`, marking all volumes as `INDEXED`.

### 11. Database Architecture Hardening [COMPLETED]

- **RLS Security**: Enabled Row Level Security on all 22 tables with public-read/service-role-write policies.
- **Reference Tables**: Created `provinces` (9 seeded), `stations`, `organizations`, `locations`, `crime_categories` (28 SAPS categories seeded with severity weights).
- **Network Graph Schema**: Created `person_incident_links`, `person_org_links`, `person_relationships`, `org_links`, `evidence_sources` — enabling full corruption network mapping.
- **Index Optimization**: Added 30+ targeted indexes on `station_statistics` (339K rows), `people` (32K), `incidents`, `historical_records`, and `ai_news`.
- **Materialized Views**: `mv_station_rankings`, `mv_crime_trends`, `mv_people_risk_summary`, `mv_platform_stats` with one-call `refresh_materialized_views()`.
- **Full-Text Search**: pg_trgm fuzzy matching + tsvector GIN indexes on people/incidents/historical_records. `search_intelligence()` and `search_people_fuzzy()` functions deployed.
- **Data Quality**: Auto-`updated_at` triggers, FK columns linking incidents to stations/locations/categories/provinces.

### 12. Public Accessibility Overhaul [COMPLETED]

- **Jargon Elimination**: Refactored titles, badges, and navigation labels platform-wide to plain English (e.g., "Zero-Knowledge Vault" -> "Evidence Vault", "Geospatial Intelligence" -> "Crime Map").
- **Contextual Guidance**: Integrated expandable guidance tooltips on all intelligence modules via `PageShell`.
- **Continuous Flow**: Deployed `<WhatNext>` cross-navigation components to maintain user engagement and prevent dead-ends.
- **Layout Optimization**: Refined global navigation components (`Navbar`, `MobileBottomBar`, `CommandPalette`) for better scaling and density control on varied viewports.

### 12. Data Science Analysis & Quality [COMPLETED]

- **Deep Analysis**: 13-finding report across 23.6M crime data points, 11 years of SAPS data, 1,143 stations.
- **Knowledge Base Ingestion**: Ingested 3,540 records with 384-dim pgvector embeddings into new `ai_knowledge_base` table. Semantic search via `search_knowledge_base()`.
- **Data Purge**: Removed 178 non-crime records (sports, weather) from incidents table.
- **PEP Classification**: Tagged 3,702 people with PEP tiers (1,288 Tier 1 politicians, 1,453 Tier 2 executives/judges, 961 Tier 3 suspects/intermediaries).
- **Key Findings**: Business robbery +349%, drug crime +173%, murder climbing back to 18,673/year. Top 10% of stations produce 42% of national crime.

### 13. UI/UX Architecture Overhaul [COMPLETED]

- **Navigation Redesign**: Restructuring 16 flat routes into logical information architecture with grouped navigation.
- **Flow Optimization**: Implementing intuitive user journeys from landing → investigation → action.
- **Mobile Responsiveness**: Ensuring all 20 pages are mobile-first with proper touch targets.
- **Design System Enforcement**: Applying consistent glassmorphism tokens and spacing rhythm across all pages.
- **PageShell Standardization**: Wrapped 13+ pages in a unified layout shell for consistent headers and navigation.

### 14. UI/UX Interactions (Sprint 4) [COMPLETED]

- **Skeleton Loaders**: Implementation of high-fidelity shimmer states for all data-fetching modules.
- **Command Palette (⌘K)**: Global search and quick-action interface deployed.
- **Defensive UI**: Error boundaries and consistent empty states for resilient data handling.

### 15. StatsSA Intelligence & Reporting Gaps [COMPLETED]

- **PDF Extraction Pipeline**: Ingested and analyzed GPSJS 2017/18/19 reports.
- **Reporting Gap Analysis**: Identified a massive **4.9x discrepancy** in Home Robbery and **2.1x** in Housebreaking between StatsSA experienced crime and official SAPS stats.
- **Network Link Population**: Established foundational links for the corruption web, linking key TRC figures (Eugene de Kock, Dirk Coetzee) to core organizations (Vlakplaas, CCB).
- **Geocoding Backfill**: Spatially enriched incidents across major hotspots (Gauteng, Western Cape, Soweto) for heatmap accuracy.

16. **Intelligence Ingestion Cycle (Sprint 5) [IN PROGRESS]**

- **Strategic Mapping**: Initialized `INGEST.md` to track forensic analysis of 52 high-fidelity documents from PPLAAF, NACAC, and UNODC.
- **Protocol Establishment**: Implementing the Agentic Intelligence Protocol (Extraction -> Distillation -> Research -> Ingestion).
- **Target Zero**: Prioritizing Whistleblower Protection regimes and National Anti-Corruption strategy gaps.

### 17. MCP Server Integration [COMPLETED]

- **Tool Discovery**: Configured isolated MCP servers for Gemini CLI in `.gemini/settings.json`.
- **Conflict Resolution**: Established strict boundaries between Gemini CLI (`settings.json`) and Antigravity AI (`.mcp.json`) to prevent port and protocol collisions.
- **Port Isolation**: Moved Gemini CLI `browser-server` to port 8001 to free up port 8000 for Antigravity's default configuration.

### 18. Component Library Absorption [COMPLETED]

- **Command Injection**: Absorbed 15+ custom investigative commands into `.gemini/commands/` including Supabase Data Explorer and Performance Optimizer.
- **Hook Automation**: Deployed `git-add-changes` and code formatting hooks to `.gemini/hooks/` for streamlined operational integrity.
- **Skill Enrichment**: Integrated specialized skills for `shadcn`, `nextjs-patterns`, `react-best-practices`, and `tailwind-design` into the agent's active repertoire.

### 19. PPLAAF Forensic Audit [COMPLETED]

- **Vulnerability Mapping**: Identified the "Protection-Implementation Paradox" and the transition from internal retaliation to "External Retribution" (assassination).
- **Pathology Extraction**: Documented the "Section 7 Reporting Loop" and "Restitution Gap" (12-24 month salary cap) as fatal flaws in the current whistleblower regime.
- **Strategic Briefing**: Generated a comprehensive technical research brief in `research/pplaaf-audit/forensic_audit_report_may_2026.md`.

### 20. NACAC Gap Analysis [COMPLETED]

- **Reporting Discrepancy**: Cross-referenced official 2025 reports with platform data, identifying a 4.9x gaslighting factor in experienced crime versus recorded stats.
- **Economic Impact**: Highlighted the R1.44 trillion "Shadow Loss" delta between official tainted contracts and actual GDP impact.

### 21. Incentive Calculator UI Upgrade [COMPLETED]

- **Citizen Restitution Projection**: Enhanced the dynamic UI module to allow citizens to calculate potential rewards (15-25%) for exposing state capture, based on Zondo recommendations.
- **Social Impact Logic**: Integrated quantified social reinvestment metrics (RDP houses, state schools) into the calculator's risk-adjusted engine.

### 22. Intelligence Graph Enrichment [COMPLETED]

- **Suspect Backfill**: Enriched dossiers for high-risk targets (Vusimuzi Matlala, Ebrahim Kadwa, Feroz Khan) with high-fidelity biographies and verified image URLs.
- **Station Mapping**: Resolved the "STATION_UNNAMED" issue by executing a statistical fingerprinting script, backfilling names for the top-tier SAPS stations in the performance leaderboard.
- **Navigation Overhaul**: Updated the global navbar to feature the newly designed "True Crime Estimator", "Oversight Radar", and "Incentive Calculator" modules.

### 23. Predictive Infiltration Modeling [COMPLETED]

- **Algorithm Development**: Formalized the "Syndicate Proximity" scoring logic using network degrees, PEP risk scores, and SCM behavioral fingerprints.
- **Big Five Forecast**: Generated a high-fidelity infiltration forecast identifying **Crime Intelligence (SAPS)** and **Global Alpha Shell Ltd** as critical proximity nodes (95-100%).
- **UI Operationalization**: Upgraded the `Predictive Intel Engine` component with a dual-modal view, enabling toggling between Infiltration Probabilities and Reform Trajectories.

### 24. Mobile Data Presentation Architecture [COMPLETED]

- **Responsive Data Grids**: Replaced legacy HTML tables with `<ResponsiveDataGrid />`, automatically transforming desktop tables into thumb-friendly, stackable cards on mobile viewports.
- **Accessible Expansion Modals**: Implemented `@radix-ui/react-dialog` via `<FullScreenDataModal />` to provide native-feeling, 44px-touch-target expansions for complex data.
- **Mobile Chart Overlays**: Deployed `<MobileExpandableChart />` to wrap dense data visualizations (like the `OversightRadar`) in a blurred preview state on mobile, preventing accidental touches and layout breakage.
- **Layout Shift Elimination**: Standardized `<DataCardSkeleton />` to match the exact dimensions of the new mobile cards, ensuring zero Cumulative Layout Shift (CLS) during data fetching.
- **Stats Page Refactor**: Successfully transitioned the National Performance Leaderboard (`src/app/stats/page.tsx`) to the new architecture, removing 60+ lines of duplicated responsive logic.

### 25. Evidence Packaging Engine [COMPLETED]

- **Justice Weaponization**: Built the backend orchestration to aggregate high-risk dossiers and incidents into "Justice Packages" for international bodies (ICC/UN).
- **Cryptographic Integrity**: Implemented pseudo-signing with SHA-256 and salt-based hashes for evidence authenticity verification.
- **Justice Portal**: Created a high-fidelity template in `/justice/[id]` for viewing and exporting formal investigative dossiers.
- **Vault Integration**: Integrated packaging actions directly into the Zero-Knowledge Vault and network intelligence hubs.

### 26. AI Link Inference Upgrades [COMPLETED]

- **Inferential Intelligence**: Transitioned from descriptive to predictive intelligence by implementing a hybrid inference engine combining relationship graph analysis and pgvector semantic similarity.
- **Semantic Graph Core**: Deployed the `getInferredLinks` server action that cross-references known PEP hubs with semantically correlated documents in the `ai_knowledge_base`.
- **UI Operationalization**: Integrated live "Predictive Linkage" into the `Predictive Intel Engine`, replacing mock data with real-time confidence-scored connection predictions.

### 27. Phase 4: Active Investigation & Automated Triage [COMPLETED]
- **Step 1: Automated Triage**: Filtered high-risk targets and performed deep research on top 5.
- **Step 2: Targeted Scraping**: Executed deep beneficial ownership audits for Falcon Cat, Black AK, Cor Kabeng, and Lux SA.
- **Step 3: Synthesis & Exposure**: Published "Final Investigative Report: The Big Five Cartel & Gold Mafia Nexus".
- **Master KG Sync**: Synchronized master 5,500-node graph to production database including 5,600+ relationships.

### 28. UI/UX: Intelligence Narrative Layer [COMPLETED]
- **Dynamic Dossier Integration**: Implemented recursive Markdown dossier rendering in `IntelligenceDrawer` and profile pages using `react-markdown`.
- **Temporal Strike Patterns**: Upgraded geospatial map with visual highlighting for peak ambush windows (02:00-05:00).
- **Syndicate Profile Access**: Direct forensic profile access integrated into the hierarchical syndicate viewer.

### 29. Authoritative Legal Intelligence (Sabinet) [COMPLETED]
- **Dynamic Scraper Pipeline**: Developed `scripts/scrape_sabinet.ts` using Playwright to traverse **50+ pages** of search results.
- **Criminal Taxonomy Search**: Implemented high-precision boolean queries targeting murder, gang hits, CIT heists, and extortion.
- **Forensic Extraction**: Automated retrieval of **Judges**, **Attorneys**, **Case Numbers**, and **AI Summaries** from dynamic Ant Design components.
- **Subject-Based Filtering**: Built a strict rejection engine to exclude non-criminal matters (marriage, divorce, labor disputes) from the intelligence pool.

### 30. Intelligence Stream & Judicial UI [COMPLETED]
- **IntelligenceDrawer Component**: Created a global, real-time side-drawer surfacing the latest court rulings and field news across the entire app.
- [x] **Judicial Intelligence Corpus**: Launched a dedicated portal at `/justice/judgments` for browsing and filtering criminal jurisprudence.
- [x] **Forensic Case View**: Implemented detailed evidence dossiers for judgments, linking legal outcomes directly to intelligence nodes.
- [x] **KG Legal Synchronization**: Developed `scripts/link_judgments_to_graph.ts` to automatically inject legal actors (judges, defendants) as nodes into the master Knowledge Graph.

### 31. Financial Asset & Syndicate Hardening [COMPLETED]
- **Asset Migration**: Added polymorphic `assets` and `entity_asset_links` tables to track real estate, vehicles, trusts, crypto wallets, and shell companies.
- **Syndicate Dashboard**: Refactored `/admin/syndicates` into a deep intelligence profile with dropdowns for strict categorisation.
- **Automated Threat Logic**: Implemented dynamic Risk Score aggregation based on the average threat level of known associates and gang size multipliers.

### 32. Capacitor Mobile Integration [COMPLETED]
- **Platform Setup**: Installed Capacitor core and CLI, and added native platforms for Android (`android/`) and iOS (`ios/`).
- **Identity Registration**: Registered the app under name `Visita Crime Intelligence` and package identifier `za.co.visita.crime.app`.
- **Hybrid Live URL Integration**: Configured `capacitor.config.ts` to load the production server URL `https://crime.visita.co.za`, bypassing Next.js static export limits for Server Actions and Route Handlers.
- **Asset Generation**: Used `@capacitor/assets` to automatically compile custom launcher icons and splash screens from source images in the `/public` folder.


# 🔮 Next Operational Cycle (Watchdog Phase)

1. **Daily Watchdog Delta**: Automated execution of `scripts/watchdog.ts` for real-time extraction of new leads.
2. **Media Kit Generation**: Exporting high-fidelity investigative reports for external journalism partners.
3. **Real-time Incident Trigger**: Automated research tasks triggered by new high-severity incidents in the ticker.

# 📂 Directory Architecture & Forensic Assets

### Intelligence Data
- `intelligence/corruption_knowledge_graph.json`: Master unified Knowledge Graph (5,500+ nodes).
- `intelligence/dossiers/`: High-fidelity investigative narratives (Markdown).
- `intelligence/extractions/`: Raw forensic data from recursive web-browser crawls.

### Visual Intelligence
- **Supabase Bucket:** `entity_images`: Verified profile images for high-risk targets.
- `.research/to-ingest/DOSSIER_UPDATE.md`: Investigation log for visual enrichment progress.

### Investigation Tracks
- `.research/investigations/`: Focused investigation tracks (Witness H, Cocaine Trail, Gangland Succession, etc.).
- `.research/to-ingest/INVESTIGATE.md`: Master investigation roadmap and Priority Intelligence Requirements (PIRs).

### Forensic Scripts (`scratch/` & `scripts/`)
- `scripts/watchdog.ts`: Standardized daily intelligence cycle (Scrape -> Sync -> Prune -> Push).
- `scratch/resolve_entities.ts`: Fuzzy-match deduplication for the 37,000-node production dataset.
- `scratch/sync_master_kg_to_db.ts`: Full synchronization pipeline between Knowledge Graph and Supabase.

# ⚠️ Technical Constraints
- **Vercel Hobby Tier Limit**: Restricted to ONE cron job per day. Complex investigations must be handled agentically via the local watchdog script.

# 🧠 Agent Intelligence Overlays

## Next.js 16 ADR (Architectural Decision Record)

- **Turbopack Mode**: Use `next dev --turbo` for development.
- **Server Actions**: Prefer Server Actions over API routes for form submissions and mutations.
- **RSC Strategy**: Keep Client Components leaf-level. Use Server Components for all data fetching and layout structure.
- **Metadata API**: Use the dynamic Metadata API for SEO rather than `next/head`.

## Database Strategy: Supabase `crime_intelligence`

- **Project ID**: `qanvvpojzirrdeofsmrb` | **Region**: `eu-west-1` | **DB Size**: ~347 MB
- **Schema**: All intelligence data in `public` schema across 23 tables.
- **Security**: RLS enabled on ALL tables. Public read for transparency, service-role-only writes.
- **Real-time**: Supabase Realtime for incident alerts and TRC backfill status.
- **Search**: `search_intelligence(query)` for cross-table full-text search, `search_people_fuzzy(name)` for similarity matching, `search_knowledge_base(embedding)` for semantic vector search.
- **Analytics**: 4 materialized views for dashboards, refreshed via `refresh_materialized_views()`.
- **Network Graph**: 5 join tables (`person_incident_links`, `person_org_links`, `person_relationships`, `org_links`, `evidence_sources`) enabling corruption network traversal.
- **Extensions**: PostGIS (spatial), pgvector (embeddings), pg_trgm (fuzzy search), pgcrypto.
