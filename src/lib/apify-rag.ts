import { ApifyClient } from "apify-client";

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export interface RagCrawlParams {
  queries: string[];
  maxPagesPerQuery?: number;
  depth?: number;
}

/**
 * Triggers the za_intelligence/rag-web-browser actor to backfill historical intelligence.
 */
export async function triggerHistoricalBackfill(params: RagCrawlParams) {
  if (!process.env.APIFY_TOKEN) {
    throw new Error("APIFY_TOKEN is missing from environment variables.");
  }

  const input = {
    queries: params.queries,
    maxPagesPerQuery: params.maxPagesPerQuery || 10,
    depth: params.depth || 1,
    proxyConfiguration: {
      useApifyProxy: true,
    },
    // RAG specific settings
    format: "markdown",
    includeMetadata: true,
    saveHtml: false,
  };

  try {
    const run = await client.actor("za_intelligence/rag-web-browser").start(input);
    console.log(`[APIFY] Started RAG Backfill: ${run.id}`);
    return run;
  } catch (error) {
    console.error("[APIFY] Failed to trigger backfill:", error);
    throw error;
  }
}

/**
 * Retrieves results from a completed Apify RAG run.
 */
export async function getBackfillResults(runId: string) {
  const dataset = await client.run(runId).dataset();
  const { items } = await dataset.listItems();
  return items;
}
