import { createClient } from '@supabase/supabase-js';
import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const apify = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function syncBackfills() {
  console.log("Checking for active TRC indexing runs...");

  const { data: volumes, error } = await supabase
    .from('trc_volumes')
    .select('*')
    .eq('status', 'INDEXING');

  if (error) {
    console.error("Error fetching volumes:", error);
    return;
  }

  if (!volumes || volumes.length === 0) {
    console.log("No volumes with status 'INDEXING' found in the database.");
    return;
  }

  for (const vol of volumes) {
    if (!vol.apify_run_id) {
      console.warn(`[WARN] Volume ${vol.volume_number} is 'INDEXING' but has no apify_run_id. Please trigger it from the UI.`);
      continue;
    }

    console.log(`Checking run ${vol.apify_run_id} for Vol ${vol.volume_number}...`);
    
    try {
      const run = await apify.run(vol.apify_run_id).get();
      
      if (!run) {
        console.warn(`[WARN] Run ${vol.apify_run_id} for Vol ${vol.volume_number} not found on Apify.`);
        continue;
      }

      console.log(`[INFO] Vol ${vol.volume_number} run status: ${run.status}`);

      if (run.status === 'SUCCEEDED') {
        console.log(`[PROCESS] Run ${vol.apify_run_id} succeeded. Fetching results...`);
        
        const { items } = await apify.run(vol.apify_run_id).dataset().listItems();
        console.log(`[PROCESS] Found ${items.length} items.`);
        
        if (items.length === 0) {
          console.warn(`[WARN] No items found in dataset for Vol ${vol.volume_number}.`);
          continue;
        }

        // Save locally for agentic analysis
        const fs = require('fs');
        const path = require('path');
        const dir = path.join(process.cwd(), '.intelligence', 'backfills');
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const fileName = `vol_${vol.volume_number}_${vol.apify_run_id}.json`;
        const filePath = path.join(dir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
        console.log(`[SUCCESS] Crawled data saved to ${filePath}`);

        // Update volume status to CRAWLED
        await supabase
          .from('trc_volumes')
          .update({ 
            status: 'CRAWLED', 
            progress: 100,
            updated_at: new Date().toISOString()
          })
          .eq('id', vol.id);

        console.log(`[STATUS] Vol ${vol.volume_number} marked as CRAWLED. Ready for agentic analysis.`);
      } else if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
        console.error(`[ERROR] Run ${vol.apify_run_id} for Vol ${vol.volume_number} failed with status: ${run.status}`);
        await supabase
          .from('trc_volumes')
          .update({ status: 'QUEUED', progress: 0, apify_run_id: null })
          .eq('id', vol.id);
      } else {
        console.log(`[INFO] Run ${vol.apify_run_id} is still ${run.status}...`);
      }
    } catch (err: any) {
      console.error(`[ERROR] Error processing run ${vol.apify_run_id} for Vol ${vol.volume_number}:`, err.message);
    }
  }
}

syncBackfills().catch(console.error);
