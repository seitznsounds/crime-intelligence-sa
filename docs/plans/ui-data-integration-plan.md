# UI/UX Data Integration Plan: Exposing Deep Intelligence

## Problem Statement
The current UI (Network Map, Syndicates page, Expose Hub) is too visually focused. While nodes and edges look good, they fail to communicate the *depth* of the intelligence. Users click on a syndicate or a person and see only surface-level data, missing the operational methods, deep political connections, and historical context we have gathered (e.g., the Big Five Cartel's operations, the Port Shepstone cocaine trail).

## Goal
Transform the UI from a simple visual map into an immersive, data-rich investigative tool. When a user interacts with a node, they must be presented with a comprehensive, narrative-driven dossier.

## Core Features & Implementation Strategy

### 1. The 'Intelligence Drawer' (Contextual Side Panel)
*   **Concept:** Instead of a simple tooltip, clicking a node on the Network Map or a card in the Syndicates page slides out a persistent right-hand drawer (taking up ~30-40% of the screen width).
*   **Content:**
    *   **Header:** Entity Name, Type (Person/Org), and Status (e.g., "In Custody - eBongweni C-Max").
    *   **Executive Summary:** A concise 2-3 sentence overview (pulled from Knowledge Graph metadata).
    *   **The Narrative:** A scrollable text section detailing their operations (e.g., how the Big Five uses Medicare 24 for tender fraud).
    *   **Key Connections (Interactive List):** A list of their direct edges, grouped by relationship type (e.g., "Funded", "Investigated By"). Clicking an entity here updates the drawer and highlights them on the map.
    *   **Source Citations:** Links to the origin of the data (e.g., "Madlanga Commission Interim Report, Dec 2025").

### 2. Interactive Timelines (Temporal Analysis)
*   **Concept:** A dedicated component within the Intelligence Drawer or a separate 'Timeline View' page.
*   **Content:** Visualizing the chronological sequence of events (e.g., 2021: Cocaine Theft -> 2024: SAPS Contract Awarded -> 2025: Mchunu Suspension -> 2026: Masemola Charged).
*   **Interaction:** Users can scrub through time to see how the network evolved or when specific alliances were formed.

### 3. The 'Dossier View' (Deep Dive Page)
*   **Concept:** For major hubs (e.g., Cat Matlala, Jacob Zuma), a dedicated full-page view accessible via a "View Full Dossier" button in the Intelligence Drawer.
*   **Content:**
    *   **Corporate Structure:** Visual hierarchy of shell companies and front organizations.
    *   **Known Associates Matrix:** A localized, filtered sub-graph focusing only on their immediate 1st and 2nd-degree connections.
    *   **Financial Flow:** Visual representation of alleged bribes or irregular tenders (e.g., the R1m monthly payments to Sibiya).

### 4. Aesthetic & Tone (Referencing `frontend-design` skill)
*   **Tone:** "Investigative / Journalistic." Clean, slightly brutalist, prioritizing legibility of dense text over flashy animations. Think high-end investigative journalism platforms (e.g., Bellingcat, ICIJ).
*   **Typography:** Use a strong serif for headers (authoritative) and a highly legible sans-serif for body text.
*   **Color:** Dark mode by default to reduce eye strain during deep reading, using sharp accent colors (e.g., amber or crimson) to highlight critical connections or criminal charges.

## Data Pipeline Integration
1.  **Backend to Frontend:** Ensure the frontend fetches the enriched `intelligence/corruption_knowledge_graph.json` alongside the specific extractions in `intelligence/extractions/`.
2.  **State Management:** The UI must maintain a globally accessible "Selected Entity" state to synchronize the Network Map highlight with the Intelligence Drawer content.

## Next Steps
1.  Develop the React/Next.js components for the `Intelligence Drawer` and `Timeline`.
2.  Connect the components to the local JSON data stores.
3.  Apply the styling guidelines outlined in the Aesthetic section.
