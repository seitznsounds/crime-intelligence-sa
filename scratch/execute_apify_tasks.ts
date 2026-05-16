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
  console.log(`\n[${leadName}] Starting actor ${actorId}...`);
  try {
    // We use call() which starts the actor and waits for it to finish.
    // We set a high timeout because deep research can take a while.
    const run = await client.actor(actorId).call(input, { waitSecs: 300, ...options });
    
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
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`[${leadName}] Saved ${items.length} items to ${outputPath}`);
  } catch (error: any) {
    console.error(`[${leadName}] Error:`, error.message);
  }
}

async function main() {
  const deepResearchId = 'za_intelligence/deep-research-web-browser';

  console.log("Starting Apify Intelligence Gathering (Fallback Mode)...");

  // Re-routed News Scraper Tasks (using Deep Research Browser)
  console.log("\n--- Investigative Research Tasks ---");
  
  await runTask(deepResearchId, { 
    query: "Deep investigative research into Madlanga Commission Witness H testimony and judicial capture allegations June 2026",
    recursiveDepth: 2
  }, 'witness_h');

  await runTask(deepResearchId, { 
    query: "Trace the Port Shepstone cocaine theft investigation and links to Big Five Cartel 2026",
    recursiveDepth: 2
  }, 'port_shepstone_cocaine');

  await runTask(deepResearchId, { 
    query: "ANC political funding audit: Brown Mogotsi, Medicare 24, and Cat VIP Protection proceeds",
    recursiveDepth: 2
  }, 'anc_political_funding');

  // Deep Research Tasks
  console.log("\n--- Specific Node Research Tasks ---");
  await runTask(deepResearchId, { 
    query: "Identify South African high-ranking police officers passed over for promotion 2024-2025 linked to Madlanga Commission" 
  }, 'passed_over_officers');

  await runTask(deepResearchId, { 
    query: "Structure of 'The Green Lounge' private terminal project and its links to Vusimuzi Cat Matlala" 
  }, 'green_lounge');

  await runTask(deepResearchId, { 
    query: "Current status of NPA prosecution against Fannie Masemola and Shadrack Sibiya June 2026" 
  }, 'npa_prosecution');

  console.log("\nAll tasks completed.");
}

main().catch(err => {
    console.error("Main execution error:", err);
    process.exit(1);
});
