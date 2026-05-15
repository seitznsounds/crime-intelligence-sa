import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runTask(actorId: string, input: any, leadName: string, options: any = {}) {
  console.log(`\n[${leadName}] Starting actor ${actorId} with build ${options.build}...`);
  try {
    const run = await client.actor(actorId).call(input, { waitSecs: 300, version: '1.0', ...options });
    
    if (!run) {
        throw new Error("Run did not start or returned null");
    }
    
    console.log(`[${leadName}] Run ID: ${run.id}`);
    console.log(`[${leadName}] Status: ${run.status}`);

    if (run.status !== 'SUCCEEDED') {
        console.warn(`[${leadName}] Warning: Run finished with status ${run.status}`);
    }

    console.log(`[${leadName}] Fetching results from dataset: ${run.defaultDatasetId}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: 5,
    });

    const outputPath = path.join('intelligence', 'extractions', `${leadName}_intel.json`);
    
    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`[${leadName}] Saved ${items.length} items to ${outputPath}`);
  } catch (error: any) {
    console.error(`[${leadName}] Error:`, error.message);
  }
}

async function main() {
  const newsScraperId = 'za_intelligence/news-scraper';

  const newsUrls = [
    { "url": "https://www.news24.com" },
    { "url": "https://www.timeslive.co.za" },
    { "url": "https://www.dailymaverick.co.za" }
  ];

  console.log("Running Specific News Scraper Tasks...");

  // Task 1: Madlanga Commission
  await runTask(newsScraperId, { 
    query: "Madlanga Commission Witness H testimony leaked",
    startUrls: newsUrls
  }, 'madlanga_commission');

  // Task 2: Port Shepstone
  await runTask(newsScraperId, { 
    query: "Port Shepstone cocaine theft Hawks investigation 2026",
    startUrls: newsUrls
  }, 'port_shepstone_cocaine');

  // Task 3: ANC Funding
  await runTask(newsScraperId, { 
    query: "ANC political funding Brown Mogotsi Medicare 24 scandal",
    startUrls: newsUrls
  }, 'anc_funding_medicare');

  console.log("\nAll tasks completed.");
}

main().catch(err => {
    console.error("Main execution error:", err);
    process.exit(1);
});
