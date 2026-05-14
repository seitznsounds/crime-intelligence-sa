# True Crime vs. Recorded Stats Design

## Overview
A dedicated interactive module at `/stats/void` to visualize the "Reporting Void"—the gap between official SAPS data and actual lived experiences as surveyed by StatsSA (a 4.9x multiplier for some categories).

## Architecture & Interaction

**The "Reality Engine" (Interactive Slider)**
The core interaction is a slider that moves from 0% (Official SAPS View) to 100% (True StatsSA Reality).
As the user drags the slider, the entire dashboard reacts dynamically:
- **0%**: Represents underreported official data. The UI styling leans towards safe, "institutional blue."
- **100%**: Represents the audited reality. The UI shifts towards warning crimson, and the numbers scale up massively.

## Impact Modules
1. **The Core Multiplier HUD**: A massive typographic display showing the live multiplier based on the slider (scaling from 1.0x to 4.9x) alongside the raw deficit of "Missing Dockets."
2. **Category Growth Chart**: A dynamic horizontal bar chart comparing specific crime categories (e.g., Home Robbery, Extortion, Assault). The bars stretch out via `framer-motion` springs as the slider is dragged.
3. **Public Trust Metric**: An inversely correlated metric card showing how public trust in SAPS degrades as the "True Crime" reality increases, explaining the reporting collapse.

## Technical Components
- `src/app/stats/void/page.tsx`: Server Component loading the baseline data.
- `src/app/stats/void/VoidClient.tsx`: Client Component handling the slider state (`realityIndex` from 0 to 1) and the complex framer-motion animations interpolating between SAPS base numbers and the True Crime maximums.
