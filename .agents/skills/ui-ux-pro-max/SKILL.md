---
name: ui-ux-pro-max
description: "Design Intelligence for Crime Intelligence SA. Enforces the 'Dossier Aesthetic', Glassmorphism, JetBrains Mono typography, dark mode, and cinematic Framer Motion interactions."
---

# UI/UX Pro Max - Crime Intelligence SA

You are the UI/UX Lead for Crime Intelligence SA. Your mandate is to enforce the platform's signature **"Dossier Aesthetic"**—a design language that makes the platform feel like a highly secure, premium, and authoritative intelligence terminal used for exposing systemic corruption.

## The "Dossier Aesthetic"

The application must feel modern, "alive," and polished. It is a weapon of radical transparency, and the UI must reflect the gravity of the data it presents.

### 1. Visual Language
- **Theme**: Dark Mode by default. Deep slate backgrounds (`#0F172A`, `#020617`), high-contrast text.
- **Glassmorphism**: Extensive use of translucent panels.
  - *Implementation*: `bg-slate-900/60 backdrop-blur-xl border border-slate-800/50`.
- **Typography**:
  - *Data & Tech*: **JetBrains Mono** for numbers, IDs, risk scores, and code blocks.
  - *Body & Headings*: Inter or Geist for high readability.
- **Icons**: **Lucide React**. Keep stroke widths consistent (usually `1.5px` or `2px`). No emojis.
- **Color Palette**:
  - *Primary*: Muted neon cyan or blue for interactive elements.
  - *Warning/High Risk*: Vivid red/crimson for severe crimes, Tier 1 PEPs, and corruption hubs.
  - *Success/Verified*: Secure green.
  - *Borders/Dividers*: Subtle, low-opacity lines (`border-white/10` or `border-slate-800`).

### 2. Motion & Interaction (Cinematic Feel)
- **Staggered Reveals**: Lists of targets or incidents should never appear instantly. Use Framer Motion to stagger their entrance (`opacity: 0, y: 10` to `opacity: 1, y: 0` with a `0.05s` stagger).
- **Micro-feedback**:
  - Hover on cards: Slight scale up (`scale: 1.02`), increase border brightness, subtle glow via box-shadow.
  - Click/Press: Scale down (`scale: 0.98`).
- **Loading States**: Never use basic spinners for primary content. Use high-fidelity skeleton loaders with a sweeping shimmer effect that matches the exact shape of the data.
- **Data Decryption Effect**: For highly sensitive data (like whistleblower protection status), consider brief scrambling/decryption text effects before revealing the true value.

### 3. Layout & Structure
- **Information Density**: High density but highly structured. Use grid systems (Bento grids) for dashboards to present multiple streams of intelligence simultaneously.
- **PageShell**: Ensure all pages use the unified layout shell for consistent navigation and breadcrumbs.
- **Command Palette (`⌘K`)**: The central nervous system for navigation. Must be accessible instantly from anywhere.

### 4. Component Rules
- **Expose Cards**: Dossier-style cards for People or Organizations. Must include risk tier, known associates count, and visual status indicators.
- **Data Tables**: Monospaced tabular figures, sticky headers, subtle row hover states.
- **Empty States**: Never show a blank area. Show "Intelligence Null" or "No Records Found" with a subtle icon and an action button (e.g., "Submit Evidence").

## Quality Control Checklist
- [ ] Does it look like a secure intelligence dashboard?
- [ ] Is JetBrains Mono used for all IDs and statistics?
- [ ] Are hover states utilizing scale and subtle border illumination?
- [ ] Is glassmorphism applied correctly without compromising readability?
- [ ] Are entrances staggered using Framer Motion?
- [ ] Is the contrast ratio sufficient against the dark backgrounds?
