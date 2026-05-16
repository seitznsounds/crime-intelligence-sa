import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runTask(actorId: string, input: any, leadName: string) {
  console.log(`\n[${leadName}] Starting deep investigative research...`);
  try {
    const run = await client.actor(actorId).call(input, { waitSecs: 600 });
    
    if (!run) {
        throw new Error("Run did not start or returned null");
    }
    
    console.log(`[${leadName}] Run ID: ${run.id}, Status: ${run.status}`);

    if (run.status !== 'SUCCEEDED') {
        console.warn(`[${leadName}] Warning: Run finished with status ${run.status}`);
    }

    console.log(`[${leadName}] Fetching results from dataset: ${run.defaultDatasetId}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems({
      limit: 10,
    });

    const outputPath = path.join('intelligence', 'extractions', `shell_audit_${leadName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`[${leadName}] Saved ${items.length} forensic nodes to ${outputPath}`);
  } catch (error: any) {
    console.error(`[${leadName}] Error:`, error.message);
  }
}

async function main() {
  const deepResearchId = 'za_intelligence/deep-research-web-browser';

  const targets = [
    { name: 'falcon_cat_trading', query: "Identify beneficial owners, physical addresses, and links to Vusimuzi Cat Matlala for Falcon Cat Trading and Suppliers South Africa." },
    { name: 'black_ak_trading', query: "Investigate Black AK Trading: shareholders, government contracts, and connections to the Big Five Cartel in Gauteng." },
    { name: 'cor_kabeng_trading', query: "Trace beneficial ownership and political funding links for Cor Kabeng Trading & Suppliers South Africa." },
    { name: 'lux_sa_investments', query: "Deep dive into Lux South African Investments Pty Ltd: directors, international transfers, and links to state capture 2.0." }
  ];

  console.log("Starting Batch Beneficial Ownership Audit...");

  for (const target of targets) {
    await runTask(deepResearchId, { 
      query: target.query,
      recursiveDepth: 2,
      maxResults: 5,
      detailedAnalysis: true
    }, target.name);
  }

  console.log("\nBatch audit completed.");
}

main().catch(err => {
    console.error("Main execution error:", err);
    process.exit(1);
});
