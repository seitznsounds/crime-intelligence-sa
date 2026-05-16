import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function runTask(actorId: string, input: any, leadName: string, options: any = {}) {
  console.log(`\n[${leadName}] Starting actor ${actorId}...`);
  try {
    const run = await client.actor(actorId).call(input, { waitSecs: 300, ...options });
    
    if (!run) throw new Error("Run did not start");
    
    console.log(`[${leadName}] Status: ${run.status}, Dataset: ${run.defaultDatasetId}`);

    const { items } = await client.dataset(run.defaultDatasetId).listItems({ limit: 10 });
    const outputPath = path.join('intelligence', 'extractions', `${leadName}_delta.json`);
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`[${leadName}] Saved ${items.length} nodes to ${outputPath}`);
  } catch (error: any) {
    console.error(`[${leadName}] Error:`, error.message);
  }
}

async function main() {
  const deepId = 'za_intelligence/deep-research-web-browser';

  console.log("=== OPERATIONAL WATCHDOG: DAILY DELTA UPDATE ===");

  const leads = [
    { name: 'witness_h', query: "Latest on Witness H testimony Madlanga Commission June 2026" },
    { name: 'cocaine_trail', query: "Port Shepstone cocaine theft investigation updates and Hawks arrests" },
    { name: 'npa_status', query: "NPA prosecution status Fannie Masemola and Shadrack Sibiya June 2026" },
    { name: 'gang_succession', query: "Cape Flats gang succession: The Americans vs NTKs and rise of Sadia Madatt" },
    { name: 'transport_sabotage', query: "Western Cape train arson investigation and taxi association links" }
  ];

  for (const lead of leads) {
    await runTask(deepId, { query: lead.query, recursiveDepth: 1, maxResults: 5 }, lead.name);
  }

  console.log("\n--- Synchronizing Intelligence Layers ---");
  
  try {
    console.log("Syncing extractions to Knowledge Graph...");
    execSync('npx tsx scratch/sync_extractions_to_kg.ts', { stdio: 'inherit' });

    console.log("Pruning KG noise...");
    execSync('npx tsx scratch/prune_kg_noise.ts', { stdio: 'inherit' });

    console.log("Syncing KG nodes to Database...");
    execSync('npx tsx scratch/sync_kg_nodes.ts', { stdio: 'inherit' });

    console.log("Syncing KG edges to Database...");
    execSync('npx tsx scratch/sync_kg_edges.ts', { stdio: 'inherit' });

    console.log("\n=== WATCHDOG CYCLE COMPLETE ===");
  } catch (e: any) {
    console.error("Sync Phase Error:", e.message);
  }
}

main();
