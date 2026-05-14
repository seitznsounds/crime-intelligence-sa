# Assassinations & Retribution Tracker Design

## Overview
A dedicated dashboard to visualize the "Protection-Implementation Paradox" and the 98% physical impunity rate identified in the PPLAAF audit. This board will be accessible at `/accountability/assassinations`.

## Architecture & Layout

### 1. The Scorecard HUD
The top section will display the most critical metrics summarizing the systemic failure of the Witness Protection Unit (WPU):
- **Physical Impunity Rate**: 98% (Highlighting the core PPLAAF finding).
- **Recorded Assassinations**: Total count of verified hits on whistleblowers and investigators.
- **Protection Paradox**: Metric highlighting the failure rate or structural gaps in the WPU.

### 2. The Visualization Canvas
A toggleable view using the `DataTabs` component, allowing users to switch between two primary visualization modes without navigating away:

#### Tab A: Chronological Timeline
A vertical, scrollable sequence of events mapping the timeline from whistleblowing to retaliatory assassination.
- **Interaction**: Uses `FullScreenDataModal` so tapping an event on mobile expands the full dossier of the victim and the systemic failure points.
- **Design**: Alternating timeline nodes with distinct styling for "Disclosure Events" vs "Retaliation Events".

#### Tab B: Relational Network Map
A visual web showing the links between victims (whistleblowers/investigators) and implicated PEPs/cartels.
- **Interaction**: The map will be wrapped in `MobileExpandableChart`. On mobile, it appears as a blurred preview that expands to full-screen to prevent scroll traps while scrolling the main page.
- **Design**: SVG-based nodes connected by relationship lines (e.g., "Investigated", "Testified Against", "Assassinated By").

## Components Needed
- `src/app/accountability/assassinations/page.tsx`: The main server component.
- `src/app/accountability/assassinations/AssassinationsClient.tsx`: Client-side logic for the tabs, timeline rendering, and network map SVG.

## Data Structure (Mock/Initial)
- **Timeline Events**: `id`, `date`, `victim_name`, `role`, `event_type` (disclosure | retaliation), `description`, `implicated_pep`.
- **Network Nodes**: `id`, `type` (victim | pep | cartel), `name`, `risk_score`.
- **Network Links**: `source`, `target`, `relationship`.
