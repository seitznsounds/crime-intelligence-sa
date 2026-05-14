# AI Corruption Forecasting Refinement Design

## Overview
Enhancing the existing predictive engine from static link counting to dynamic temporal and behavioral analysis. This shift allows the platform to detect "Infiltration Spikes" and "SCM Capture" patterns before they become operational.

## 1. Temporal Link Density Analysis (Velocity)
- **Algorithm**: Analyze `created_at` timestamps for `person_org_links` and `person_relationships`.
- **Metric**: "Link Velocity" (links established in the last 90 days).
- **Spike Detection**: Flagging entities where link velocity exceeds the 12-month rolling average by 300%+.

## 2. SCM Behavioral Fingerprints
- **Role Mapping**: Identifying critical "Procurement Nodes" in the relationship graph.
- **SCM Indicators**:
  - `SCM_ANOMALY`: Multiple PEP links to an organization's procurement or tender roles.
  - `COVERT_CAPTURE`: High-risk links identified without formal public disclosure.
  - `TENDER_SPIKE`: Sudden emergence of links to state-owned enterprise (SOE) supply chain heads.

## 3. UI/UX Operationalization
- **Density Sparklines**: Visualizing the 6-month growth trend of links on each forecast card.
- **Behavioral Badges**: Semantic tagging of anomalies (`[SCM_ANOMALY]`, `[COVERT_CAPTURE]`).
- **Risk Multipliers**: Dynamically scaling the risk score based on the combination of static density and temporal velocity.

## 4. Technical Components
- `src/app/forecast/actions.ts`: Refactor `getForecasts` to calculate temporal metrics and identify SCM fingerprints.
- `src/app/forecast/ForecastClient.tsx`: Upgrade card UI with sparklines and behavioral tagging.
