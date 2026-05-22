# Project Agents Configuration

This project is a Capacitor-based Android application wrapping a Next.js web application.

## Project Context
- **App Name**: Visita Crime Intelligence
- **Package ID**: za.co.visita.crime.app
- **Target URL**: https://crime.visita.co.za
- **Framework**: Capacitor with Android Native (Java/Kotlin)

## Agent Instructions
- When modifying Android native code, ensure consistency with Capacitor's bridge.
- WebView settings should prioritize security (HTTPS) and performance.
- Asset management (icons/splash) should be handled via `@capacitor/assets` or manually in `src/main/res`.
- Maintain the `network_security_config.xml` to restrict traffic to the target domain.

## Capacitor Build Workflow
1. **Static Export**: Ensure `next.config.mjs` is set to `output: 'export'`.
2. **Build Web**: Run `CAPACITOR_BUILD=true npm run build`.
3. **Sync Android**: Run `npx cap sync android`.
4. **Local vs Hosted**:
   - For **Local Production**: Comment out `server.url` in `capacitor.config.ts`.
   - For **Hosted (Staging)**: Set `server.url` to your target URL.
