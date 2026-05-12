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
    console.log("No active indexing runs found.");
    return;
  }

  for (const vol of volumes) {
    if (!vol.apify_run_id) continue;

    console.log(`Checking run ${vol.apify_run_id} for Vol ${vol.volume_number}...`);
    
    try {
      const run = await apify.run(vol.apify_run_id).get();
      
      if (!run) {
        console.warn(`Run ${vol.apify_run_id} not found.`);
        continue;
      }

      if (run.status === 'SUCCEEDED') {
        console.log(`Run ${vol.apify_run_id} succeeded. Ingesting results...`);
        
        const { items } = await apify.run(vol.apify_run_id).dataset().listItems();
        
        // Transform items into historical_records
        const records = items.map((item: any) => ({
          title: item.title || `TRC Vol ${vol.volume_number} Excerpt`,
          summary: item.description || item.text?.substring(0, 200),
          content: item.text || item.content,
          category: 'TRC_REPORT',
          backfill_source: `TRC_VOL_${vol.volume_number}`,
          apify_run_id: vol.apify_run_id,
          metadata: {
            url: item.url,
            volume: vol.volume_number,
            timestamp: new Date().toISOString()
          }
        }));

        // Insert into historical_records
        const { error: insertError } = await supabase
          .from('historical_records')
          .insert(records);

        if (insertError) {
          console.error(`Failed to insert records for Vol ${vol.volume_number}:`, insertError.message);
          continue;
        }

        // Update volume status to INDEXED
        await supabase
          .from('trc_volumes')
          .update({ status: 'INDEXED', progress: 100 })
          .eq('id', vol.id);

        console.log(`Successfully indexed Vol ${vol.volume_number}.`);
      } else if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
        console.error(`Run ${vol.apify_run_id} failed with status: ${run.status}`);
        await supabase
          .from('trc_volumes')
          .update({ status: 'QUEUED', progress: 0 })
          .eq('id', vol.id);
      } else {
        console.log(`Run ${vol.apify_run_id} is still ${run.status}.`);
      }
    } catch (err: any) {
      console.error(`Error processing run ${vol.apify_run_id}:`, err.message);
    }
  }
}

syncBackfills().catch(console.error);
