import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runTask(leadName: string, query: string) {
  const actorId = 'za_intelligence/news-scraper';
  const buildNumber = '1.0.2';
  
  console.log(`\n[${leadName}] Starting actor ${actorId} (build: ${buildNumber})...`);
  
  const input = {
    query,
    startUrls: [
      { url: "https://www.news24.com" },
      { url: "https://www.timeslive.co.za" },
      { url: "https://www.dailymaverick.co.za" }
    ],
    maxItems: 5
  };

  try {
    const run = await client.actor(actorId).call(input, { build: buildNumber, waitSecs: 300 });
    console.log(`[${leadName}] Run ID: ${run.id}, Status: ${run.status}`);

    const { items } = await client.dataset(run.defaultDatasetId).listItems({ limit: 5 });
    const outputPath = path.join('intelligence', 'extractions', `${leadName}_intel.json`);
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`[${leadName}] Saved ${items.length} items to ${outputPath}`);
  } catch (error: any) {
    console.error(`[${leadName}] Error:`, error.message);
  }
}

async function main() {
  await runTask('witness_h', 'Madlanga Commission Witness H testimony leaked');
  await runTask('port_shepstone_cocaine', 'Port Shepstone cocaine theft Hawks investigation 2026');
  await runTask('anc_political_funding', 'ANC political funding Brown Mogotsi Medicare 24 scandal');
}

main();
