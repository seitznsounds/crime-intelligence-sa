# Deep Research Browser: Robustness & Monetization Plan

## 1. Technical Robustness (Stabilization)
- **Error Isolation**: Implement per-request error boundaries so that a single failed search pass or blocked page does not fail the entire recursive research run.
- **Circuit Breakers**: If the actor hits a persistent proxy block (403/429), it should gracefully downscale or rotate proxy groups automatically.
- **Memory Management**: Optimize the recursive loop to prevent memory leaks during deep multi-hop passes by purging old search state after each pass.
- **Smart Chunking**: Improve the RAG chunking logic to prioritize semantic headers (H1, H2) rather than fixed-length character splits.

## 2. Monetization & Apify Marketplace Strategy
- **Pay-Per-Event Pricing**: Set up Apify's monetization to charge per "Deep Research Pass" (e.g., $0.05 per pass) rather than just compute time.
- **Freemium Tiers**:
    - **Surface Research (Level 1)**: Free or Low Cost.
    - **Forensic Research (Level 3)**: Premium tier with multi-hop entity extraction.
- **SEO Optimization**: Update `actor.json` with targeted keywords (Forensic Investigation, Corporate Intelligence, OSINT, AI Researcher) to drive marketplace traffic.
- **Branding**: Create a premium social preview image and high-fidelity documentation showcasing the "Recursive Intelligence" advantage over basic scrapers.

## 3. Integration Features for Power Users
- **Webhook Support**: Allow users to register a webhook URL to receive "Live Thought Updates" as the agent traverses the web.
- **Export Formats**: Support `.docx` or `.pdf` formatted intelligence briefs in addition to Markdown/JSON.
- **API Secret Management**: Allow users to provide their own OpenAI/Anthropic keys for an "Internal LLM Brain" pass (if they want better summarization than the default extraction).

## 4. Next Operational Steps
1. [x] Fix TypeScript build errors (Import Actor, Prefix Unused Params).
2. [ ] Implement `p-limit` or similar to control search breadth concurrency.
3. [ ] Add a `Cost Estimate` field to the output dataset so users know their expenditure per run.
4. [ ] Publish a "Beta" version to the Apify Marketplace under `za_intelligence`.
