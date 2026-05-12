import { ApifyClient } from "apify-client";

export interface RagCrawlParams {
  queries: string[];
  maxPagesPerQuery?: number;
  depth?: number;
}

/**
 * Triggers the za_intelligence/rag-web-browser actor to backfill historical intelligence.
 */
export async function triggerHistoricalBackfill(params: RagCrawlParams) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });

  if (!process.env.APIFY_TOKEN) {
    throw new Error("APIFY_TOKEN is missing from environment variables.");
  }

  const input = {
    query: params.queries[0] || "",
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
    const run = await client.actor("qlUHrtbRqnWuo4mGt").start(input);
    console.log(`[APIFY] Started RAG Backfill: ${run.id}`);
    return run;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves results from a completed Apify RAG run.
 */
export async function getBackfillResults(runId: string) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });
  const dataset = await client.run(runId).dataset();
  const { items } = await dataset.listItems();
  return items;
}
