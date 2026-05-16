import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

/**
 * Placeholder function for processing raw extraction results.
 * Will be implemented later to parse markdown and extract nodes/edges.
 */
function processResults(name: string, rawJson: any) {
  console.log(`[${name}] Placeholder: processResults called for ${rawJson.length} items.`);
  // TODO: Implement parsing logic for Knowledge Graph nodes/edges
}

async function executeTriage() {
  const priorityFile = 'scratch/priority_missing_intel.json';
  if (!fs.existsSync(priorityFile)) {
    console.error(`Error: ${priorityFile} not found.`);
    return;
  }

  const rawData = fs.readFileSync(priorityFile, 'utf8');
  const targets = JSON.parse(rawData);

  // Filter for top 5 targets (sorted by tier DESC, then risk DESC)
  const topTargets = targets
    .sort((a: any, b: any) => {
      if (b.tier !== a.tier) return b.tier - a.tier;
      return (b.risk || 0) - (a.risk || 0);
    })
    .slice(0, 5);

  console.log(`Top 5 Triage Targets:`, topTargets.map((t: any) => `${t.name} (Tier ${t.tier}, Risk ${t.risk})`));

  const actorId = 'za_intelligence/deep-research-web-browser';

  for (const target of topTargets) {
    const name = target.name;
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    console.log(`\n[${name}] Starting deep research triage...`);
    
    const input = {
      query: `Deep investigative research into ${name} and their links to South African corruption, business networks, and political patronage. Identify shell companies and high-confidence affiliations.`,
      recursiveDepth: 2,
      maxResults: 10
    };

    try {
      const run = await client.actor(actorId).call(input, { waitSecs: 600 });
      
      if (!run) {
        console.error(`[${name}] Run failed to start.`);
        continue;
      }

      console.log(`[${name}] Run ID: ${run.id}, Status: ${run.status}`);

      if (run.status === 'SUCCEEDED') {
        const { items } = await client.dataset(run.defaultDatasetId).listItems({
          limit: 10,
        });

        const outputPath = path.join('intelligence', 'extractions', `triage_${safeName}_raw.json`);
        fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
        console.log(`[${name}] Saved ${items.length} items to ${outputPath}`);
        
        processResults(name, items);
      } else {
        console.warn(`[${name}] Run finished with status: ${run.status}`);
      }
    } catch (error: any) {
      console.error(`[${name}] Error during execution:`, error.message);
    }
  }
}

executeTriage().catch(err => {
  console.error("Fatal error during triage batch execution:", err);
  process.exit(1);
});
