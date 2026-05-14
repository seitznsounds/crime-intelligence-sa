# WPU Vacancy Tracker Design

## Overview
A dashboard module designed to expose the institutional sabotage within the Witness Protection Unit (WPU). This module demonstrates the causal link between administrative failures (budget/staffing) and physical retaliation (assassinations).

## Architecture
**Integration**: This module will be added as a third tab ("WPU Health") to the existing `DataTabs` within `src/app/accountability/assassinations/AssassinationsClient.tsx`.

## Visual Components

### 1. Causality Banner
A high-impact header component stating the core forensic finding: *The correlation between unspent protection budgets and whistleblower assassinations.*

### 2. Budget Hemorrhage Gauges
Visual representation of the WPU's financial status.
- **Allocated vs. Spent**: Shows massive underspending.
- **Safehouse Capacity**: Shows the percentage of functional safehouses vs. required capacity.

### 3. Critical Vacancy Roster
Using the `ResponsiveDataGrid` to list unfilled operational roles.
- **Data Points**: Role Title, Department, Months Vacant, Risk Impact.
- **Styling**: Roles vacant for > 12 months (indicating deliberate administrative stalling) will be highlighted with crimson text and subtle pulsing animations to denote critical institutional failure.

## Technical Implementation
- Modify `AssassinationsClient.tsx` to accept new mock data for `wpuStats` and `wpuVacancies`.
- Add a new tab `id: "wpu"` to the existing `TABS` array.
- Implement the UI rendering for `activeTab === 'wpu'` within the `AnimatePresence` block.
