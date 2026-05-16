import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runTask(actorId: string, input: any, outputName: string, options: any = {}) {
  console.log(`\n[${outputName}] Starting actor ${actorId}...`);
  try {
    const run = await client.actor(actorId).call(input, { waitSecs: 300, ...options });
    
    if (!run) {
        throw new Error("Run did not start or returned null");
    }
    
    console.log(`[${outputName}] Run ID: ${run.id}`);
    console.log(`[${outputName}] Status: ${run.status}`);

    if (run.status !== 'SUCCEEDED') {
        console.warn(`[${outputName}] Warning: Run finished with status ${run.status}`);
    }

    console.log(`[${outputName}] Fetching results from dataset: ${run.defaultDatasetId}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const outputPath = path.join('intelligence', 'extractions', `${outputName}.json`);
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`[${outputName}] Saved ${items.length} items to ${outputPath}`);
    return items;
  } catch (error: any) {
    console.error(`[${outputName}] Error:`, error.message);
    return null;
  }
}

async function main() {
  const deepResearchId = 'za_intelligence/deep-research-web-browser';

  console.log("Starting Targeted Scraping for Step 2 of Phase 4...");

  // 1. Front Company Ownership
  const frontCompanyQuery = `Deep research on: "Falcon Cat Trading and Suppliers", "Black AK Trading", "Cor Kabeng Trading & Suppliers", and "Lux South African Investments Pty Ltd". Identify all registered directors, beneficial owners, and links to Vusimuzi 'Cat' Matlala or other family members (e.g., Tsakane Matlala). Find any record of government contracts awarded to these specific firms in 2025-2026.`;
  await runTask(deepResearchId, { query: frontCompanyQuery }, 'front_company_intel');

  // 2. The Port Shepstone Cocaine Trail
  const cocaineTrailQuery = `Major-General Hendrik Flynn Madlanga Commission testimony cocaine theft Hawks. Port Shepstone Hawks storage narcotics theft 2021 investigation update 2026. Extract specific names of Hawks officers implicated or 'on duty' during the theft.`;
  await runTask(deepResearchId, { query: cocaineTrailQuery }, 'cocaine_trail_deep_intel');

  // 3. Daily News Monitoring (PIRs)
  const pirMonitoringQuery = `Madlanga Commission 'Witness H' identity leaks June 2026. Brown Mogotsi arrest update defeating ends of justice 2026.`;
  await runTask(deepResearchId, { query: pirMonitoringQuery }, 'daily_pir_monitoring');

  console.log("\nAll 3 data extractions completed.");
}

main().catch(err => {
    console.error("Main execution error:", err);
    process.exit(1);
});
