# UI/UX Excellence Skill

## Overview
This skill provides instructions for building high-fidelity, premium, and "neat" web interfaces for the Crime Intelligence SA platform. It focuses on a "Dossier" aesthetic—combining technical precision with modern glassmorphism.

## 💎 Design Principles

### 1. The "Dossier" Aesthetic
- **Visual Style**: Dark mode by default. Use deep blacks (`#050505`) and very subtle borders.
- **Glassmorphism**: Use `backdrop-filter: blur(12px)` with low opacity backgrounds (`rgba(255, 255, 255, 0.03)`).
- **Depth**: Use z-axis layering. Content should feel like it's floating on a sophisticated glass surface.

### 2. Precise Iconography
- **Scale**: Icons should be small and supporting, never overwhelming. Default size: `16px` to `20px`.
- **Weight**: Use thin or light stroke weights (`stroke-width: 1.5` or `2`).
- **Consistency**: Use a single library (e.g., Lucide React) for all icons.

### 3. Grid & Alignment
- **Containers**: Use a maximum width of `1400px` for the main content.
- **Grids**: Favor 12-column grids for complex pages and 1/3 or 1/4 splits for dashboards.
- **Padding**: Use generous, consistent white space. Standardize on `1.5rem` (24px) or `2rem` (32px) for card padding.

### 4. Typography Hierarchy
- **Font**: Use 'Outfit' or 'Inter' for a modern, technical feel.
- **Headings**: High contrast between heading levels. Use `tracking-tight` for large headers.
- **Monospaced Data**: Use monospaced fonts (e.g., JetBrains Mono) for IDs, scores, and raw metadata to enhance the "Intelligence" feel.
