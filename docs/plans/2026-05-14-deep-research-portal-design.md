# Deep Research Portal: Operational Plan

## 1. Repository & Infrastructure Sync
- **Remote Alignment**: Initialize the nested repository at `/.actors/deep-research-web-browser` and link it to `https://github.com/seitzmf/deep-research-web-browser`.
- **Actor Rebranding**:
    - Update `package.json`: `name` -> `deep-research-web-browser`.
    - Update `.actor/actor.json`: `name` -> `deep-research-web-browser`, `title` -> `Deep Research Browser`.
- **Deployment**: Prepare for Apify GitHub Import at `za_intelligence/deep-research-web-browser`.

## 2. Recursive Intelligence Conversion
The actor logic will be upgraded from a single-pass RAG scraper to a multi-pass deep research engine:
- **Recursive Search Loop**: Implement a state-managed loop where the actor analyzes findings and spawns new search queries.
- **Synthesized Briefing**: Output will transition from raw text chunks to a structured "Intelligence Briefing" JSON object.
- **SCM/PEP Tagging**: Integration of the newly refined behavioral fingerprints to automatically tag entities during the research pass.

## 3. Portal UI Integration
- **Briefing Interface**: A dedicated UI in the main app to trigger investigation queries.
- **Operational Progress**: Real-time polling to show the actor's current investigative state.
- **Dossier Ingestion**: One-click action to save the synthesized brief into the platform's forensic database.

## 4. Operational Tasks
1.  [ ] Sync nested repository remotes and push to GitHub.
2.  [ ] Rebrand actor manifests (`package.json`, `actor.json`).
3.  [ ] Refactor `src/search.ts` to support multi-pass recursive logic.
4.  [ ] Build the `DeepResearchPortal` UI component and Server Actions.
