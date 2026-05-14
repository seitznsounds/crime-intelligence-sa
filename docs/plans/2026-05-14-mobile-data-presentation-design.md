# Mobile Data Presentation Design

## Overview
A comprehensive strategy to transform complex data elements (tables, charts, maps) across the Crime Intelligence SA platform into a highly responsive, premium mobile experience. The approach favors card-based transformations and progressive disclosure over horizontal scrolling, strictly adhering to touch-first psychology and performance guidelines.

## 1. Component Architecture
Three primary wrapper components will be introduced to handle the responsive layout shifting:

- **`ResponsiveDataGrid`**: A replacement for standard HTML `<table>` structures. On desktop (`md:` and above), it renders a traditional grid/table. On mobile, it utilizes CSS Flex/Grid to transform rows into styled cards (`bg-bg-glass p-4 rounded-xl`).
- **`MobileExpandableChart`**: A wrapper for data visualizations (Recharts/D3). On mobile devices, it restricts height and complexity, acting as a static or simplified preview overlaid with a "Tap to Interact" prompt.
- **`FullScreenDataModal`**: Utilizes Radix UI / shadcn Dialog primitives to render expanded, fully interactive versions of charts, maps, or data rows when triggered by a mobile user. It guarantees a minimum 44x44px "Close" target in the thumb zone.

## 2. Mobile UX & Error Handling
- **Layout Stability (CLS)**: Skeletons (`DataCardSkeleton`, `ChartSkeleton`) matching the exact mobile dimensions will be used during data fetching to eliminate layout shift.
- **Touch & Typography**: 
  - All interactive elements must enforce a minimum touch target of 44x44px (`h-11 w-11`).
  - Primary body text will be a minimum of `16px` to prevent iOS Safari auto-zooming. Secondary data will be at least `12px` with accessible contrast ratios.
- **Error Boundaries**: Data components will be wrapped in isolated Error Boundaries. If a chart or dataset fails to render, a stylized fallback card with a large "Retry" button will appear, preventing the entire page from crashing.

## 3. Testing Strategy
- **Viewport Simulation**: Validate layouts explicitly on `375px` (iPhone SE/older) to ensure no horizontal overflow occurs.
- **Touch Target Verification**: Audit all newly created cards and modal buttons using browser dev tools to confirm no interactive element drops below the 44px threshold.
- **A11y & Contrast**: Run Lighthouse/Axe tests against the mobile card views, verifying that the dynamic dark/glass styles maintain a minimum 4.5:1 contrast ratio and that modal dialogs trap focus correctly.
