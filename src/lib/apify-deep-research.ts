import { ApifyClient } from "apify-client";

export interface DeepResearchParams {
  query: string;
  recursiveDepth?: number;
  maxResults?: number;
  detailedAnalysis?: boolean;
}

/**
 * Triggers the za_intelligence/deep-research-web-browser actor for on-demand investigative research.
 */
export async function triggerDeepResearch(params: DeepResearchParams) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });

  if (!process.env.APIFY_TOKEN) {
    throw new Error("APIFY_TOKEN is missing from environment variables.");
  }

  const input = {
    query: params.query,
    recursiveDepth: params.recursiveDepth || 1,
    maxResults: params.maxResults || 5,
    detailedAnalysis: params.detailedAnalysis !== undefined ? params.detailedAnalysis : true,
    proxyConfiguration: {
      useApifyProxy: true,
    },
    outputFormats: ["markdown"],
    chunkSize: 1000
  };

  try {
    const run = await client.actor("za_intelligence/deep-research-web-browser").start(input);
    console.log(`[APIFY] Started Deep Research: ${run.id}`);
    return run;
  } catch (error) {
    console.error("[APIFY] Error starting deep research:", error);
    throw error;
  }
}

/**
 * Polling function to get the status of a research run.
 */
export async function getResearchStatus(runId: string) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });
  return await client.run(runId).get();
}

/**
 * Retrieves finalized research results.
 * Filters results effectively, strips Apify metadata, and provides congruent output.
 */
export async function getResearchResults(runId: string) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });
  const dataset = await client.run(runId).dataset();
  const { items } = await dataset.listItems();

  // 1. Filter and Deduplicate effectively
  const uniqueItemsMap = new Map<string, any>();
  for (const item of items as any[]) {
    const url = item.metadata?.url || item.searchResult?.url || item.url;
    if (url && !uniqueItemsMap.has(url)) {
      uniqueItemsMap.set(url, item);
    }
  }

  // 2. Strip Metadata & Provide Congruent Output
  return Array.from(uniqueItemsMap.values())
    .filter((item: any) => (item.markdown || item.text) && (item.markdown || item.text).length > 100)
    .map((item: any) => ({
      url: item.metadata?.url || item.searchResult?.url || item.url || "unknown",
      title: item.metadata?.title || item.searchResult?.title || "Extracted Intel Node",
      content: item.markdown || item.text || "",
      source: item.searchResult?.url?.split('/')[2] || "web-intel",
      rank: item.searchResult?.rank || 0
    }));
}

/**
 * Runs the deep research actor and waits for results.
 */
export async function runDeepResearch(query: string, maxResults = 3) {
  const client = new ApifyClient({
    token: process.env.APIFY_TOKEN,
  });

  const run = await client.actor("za_intelligence/deep-research-web-browser").call({
    query,
    maxResults,
    outputFormats: ["markdown"],
  });

  return await getResearchResults(run.id);
}
