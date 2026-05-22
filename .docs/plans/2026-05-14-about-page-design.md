# About Page Design: Exposing the Architecture

## Overview
A dedicated `/about` route designed to establish immediate authority by showcasing the technical sophistication of the Crime Intelligence SA platform. Instead of a generic text page, it acts as a "Command Center" split across three tabs.

## Architecture

**Route**: `/about`

### Tab 1: Manifesto & Journey
- **The Core Doctrine**: A cinematic presentation of the manifesto: "Crime is not just a street-level issue; it is a systemic failure engineered from the top."
- **The Lifecycle Timeline**: A vertical sequence component detailing the intelligence lifecycle:
  1. Ingestion (Scraping TRC & PPLAAF data)
  2. AI Distillation (Extracting relational nodes)
  3. Exposure (Generating forensic dossiers)
  4. Weaponization (Packaging for the ICC).

### Tab 2: The Engine (Technical Deep Dive)
- **RAG Pipeline Architecture**: A visual chart showcasing how Apify Actors scrape data, process it with AI, and ingest it into Supabase.
- **Security & Integrity Stack**: Highlight cards for key technologies:
  - `pgvector` for semantic search.
  - Zero-Knowledge proofs for whistleblower protection.
  - Cryptographic SHA-256 signing for Evidence Packaging.

### Tab 3: Telemetry (The Situation Room)
- **Live Metrics Grid**: Dense dashboard displaying operational counters (e.g., "32,450 Records Processed", "1,288 Tier-1 PEPs Mapped").
- **System Health Indicators**: Simulated pulsing status nodes showing database connection, API health, and RAG pipeline status, proving the platform is a living intelligence network.

## Components Needed
- `src/app/about/page.tsx`: Server Component.
- `src/app/about/AboutClient.tsx`: Client Component housing the `DataTabs` and the framer-motion interactive blocks for the three distinct views.
