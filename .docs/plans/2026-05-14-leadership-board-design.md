# Leadership Accountability Board Design

## Overview
An interactive organizational chart mapping 40+ Tier-1 PEPs and acting officials from the National Government Leadership Audit. The objective is to visually expose the flow of systemic corruption and highlight compromised nodes within the government hierarchy.

## Architecture

**Route**: `/accountability/leadership`

### 1. Intelligence HUD
A simplified top-level dashboard that tracks:
- **Audited Departments**: Total number of government structures mapped.
- **Compromise Index**: Percentage of nodes flagged as high-risk or implicated in state capture.

### 2. The Interactive Org Chart Canvas
- **Draggable Viewport**: The core interaction model uses `framer-motion` to create an infinite, draggable canvas. This allows the massive org chart to be explored without restrictive CSS scrollbars, supporting pinch/swipe on mobile.
- **Hierarchical Layout**: Nodes are arranged in a tree structure (e.g., Presidency -> Ministries -> Directorates).
- **SVG Routing Lines**: SVG paths are drawn dynamically behind the HTML nodes to connect the hierarchy. Compromised paths are tinted crimson.

### 3. Node Design (PEP Cards)
Each official is represented as a tactical glass-card.
- **Status Indicators**:
  - *High Risk (Compromised)*: Crimson borders, glowing shadow, pulse animation.
  - *Medium Risk (Under Investigation)*: Gold highlights.
  - *Clean/Unknown*: Neutral glass styling.
- **Progressive Disclosure**: Nodes act as triggers for the `FullScreenDataModal`. Clicking a node slides up a comprehensive forensic dossier on that specific official without navigating away from the map.

## Components Needed
- `src/app/accountability/leadership/page.tsx`: Server Component.
- `src/app/accountability/leadership/LeadershipClient.tsx`: Client Component handling the framer-motion drag canvas and SVG lines.
